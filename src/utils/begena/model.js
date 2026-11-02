// Physical model of a begena string with a buzzing bridge.
//
// Implements the modal, energy-stable string/bridge/thread scheme of
//   M. van Walstijn, J. Bridges, S. Mehes, "A Real-Time Synthesis Oriented
//   Tanpura Model", Proc. DAFx-16, pp. 175-182 (2016),
// adapted to the begena: gut strings, and the U-shaped leather piece between
// string and bridge acting as the soft, damped termination (the tanpura's
// cotton thread), with the string repeatedly striking the bridge edge.
//
// Equation numbers below refer to that paper.

export function renderString(opts) {
  const o = {
    sr: 44100,
    duration: 2.5,
    f0: 101.2,           // fundamental [Hz]
    L: 0.75,             // speaking length [m]
    radius: 0.65e-3,     // gut string radius [m]
    density: 1300,       // gut [kg/m^3]
    E: 5.0e9,            // gut Young's modulus [Pa]
    sigma0: 1.1,         // damping fit parameters, eq. (3)/(18)
    sigma1: 0.012,
    sigma3: 1.2e-5,
    xb: 10e-3, wb: 2e-3, kb: 5e7, hb: 0,                 // bridge edge (one-sided contact)
    xc: 6e-3, wc: 1.5e-3, kc: 4e4, rc: 3.0, hc: 0,       // leather piece (spring-damper)
    xe: 0.5, we: 0.75,   // pluck position / width, as fractions of L
    ae: -0.6,            // pluck force amplitude [N]
    te: 0.012,           // pluck duration [s]
    be: 6,               // pluck shape parameter, eq. (15)
    maxModeHz: 14000,
    ...opts,
  };
  const dt = 1 / o.sr;
  const n = Math.floor(o.duration * o.sr);
  const A = Math.PI * o.radius ** 2;
  const rhoA = o.density * A;
  const I = 0.25 * Math.PI * o.radius ** 4;
  const EI = o.E * I;
  const T = rhoA * (2 * o.L * o.f0) ** 2;   // tension giving f0 (stiffness adds a little)
  const m = 0.5 * rhoA * o.L;               // modal mass

  // Modes up to maxModeHz (and Nyquist)
  const modes = [];
  for (let i = 1; ; i++) {
    const beta = (i * Math.PI) / o.L;
    const k = 0.5 * o.L * (EI * beta ** 4 + T * beta ** 2);
    const alpha = o.sigma0 + o.sigma1 * beta + o.sigma3 * beta ** 3;        // eq. (18)
    const w = Math.sqrt(Math.max(1e-9, k / m - alpha ** 2));
    if (w / (2 * Math.PI) > Math.min(o.maxModeHz, 0.45 * o.sr)) break;
    modes.push({ beta, w, alpha });
  }
  const M = modes.length;

  const gOf = (xz, wz, beta) => {                                            // eq. (20)
    const den = Math.PI ** 2 - beta ** 2 * wz ** 2;
    if (Math.abs(den) < 1e-9) return 0.25 * Math.PI * Math.sin(beta * xz);
    return (Math.PI ** 2 * Math.sin(beta * xz) * Math.cos((beta * wz) / 2)) / den;
  };

  const a = new Float64Array(M), b = new Float64Array(M), Jinv = new Float64Array(M);
  const gb = new Float64Array(M), gc = new Float64Array(M), ge = new Float64Array(M);
  const eb = new Float64Array(M), ec = new Float64Array(M), nutW = new Float64Array(M);
  const xi = dt * dt / (2 * m);
  let thbb = 0, thbc = 0, thcc = 0;
  for (let i = 0; i < M; i++) {
    const { beta, w, alpha } = modes[i];
    const R = Math.exp(-alpha * dt), Om = Math.cos(w * dt);
    const den = 1 + 2 * R * Om + R * R;
    a[i] = (1 - 2 * R * Om + R * R) / den;                                  // eq. (33)
    b[i] = (2 * (1 - R * R)) / den;
    Jinv[i] = 1 / (1 + a[i] + b[i]);
    gb[i] = gOf(o.xb, o.wb, beta);
    gc[i] = gOf(o.xc, o.wc, beta);
    ge[i] = gOf(o.xe * o.L, o.we * o.L, beta);
    eb[i] = xi * Jinv[i] * gb[i];
    ec[i] = xi * Jinv[i] * gc[i];
    thbb += gb[i] * eb[i]; thbc += gb[i] * ec[i]; thcc += gc[i] * ec[i];
    nutW[i] = -((i + 1) % 2 === 0 ? 1 : -1) * beta * (T + EI * beta * beta); // eq. (22)
  }

  const y = new Float64Array(M), q = new Float64Array(M), ub = new Float64Array(M);
  const Fd = new Float32Array(n);   // force on the bridge/leather (drives the body)
  const Fn = new Float32Array(n);   // force at the nut end
  const phic = o.kc / 2 + o.rc / dt;
  const phi = (thbb - (phic * thbc / (1 + phic * thcc)) * thbc) * o.kb / 2;
  const theta = thbb - (phic * thbc / (1 + phic * thcc)) * thbc;
  const nE = Math.floor(o.te * o.sr);
  const sinhB = Math.sinh(o.be);

  for (let s = 0; s < n; s++) {
    // Pluck force, eqs. (14)-(15)
    let Fe = 0;
    if (s < nE) {
      const t = s * dt;
      const he = 0.5 * (t + (o.te * Math.sinh((o.be * t) / o.te)) / sinhB);
      Fe = o.ae * Math.sin((Math.PI / o.te) * he) ** 2;
    }
    // u-bar, eq. (42); spatial averages at bridge and leather, eq. (21)
    let yb = 0, yc = 0, uB = 0, uC = 0;
    for (let i = 0; i < M; i++) {
      const u = Jinv[i] * (2 * (q[i] - a[i] * y[i]) + xi * ge[i] * Fe);
      ub[i] = u;
      yb += gb[i] * y[i]; yc += gc[i] * y[i];
      uB += gb[i] * u; uC += gc[i] * u;
    }
    // Leather force in terms of the bridge force, eqs. (45)-(47)
    const vc = (o.kc * (o.hc - yc) - phic * uC) / (1 + phic * thcc);
    const betac = (phic * thbc) / (1 + phic * thcc);
    // Bridge contact: analytic solution of eq. (48), Fig. 4
    const u = -uB - thbc * vc;
    const dy = o.hb - yb;
    let sb;
    if (dy <= 0) {
      if (u <= -dy) sb = -u;
      else sb = (2 * phi * dy - u - Math.sqrt(Math.max(0, u * u - 4 * phi * dy * (u + dy)))) / (2 * (1 + phi));
    } else if (u >= dy * (phi - 1)) {
      sb = (2 * phi * dy - u) / (1 + phi);
    } else {
      sb = -0.5 * u + 0.5 * Math.sqrt(u * u + 4 * phi * dy * dy);
    }
    const Fb = (sb + u) / theta;
    const Fc = vc - betac * Fb;
    // Mode update, eqs. (40)-(41)
    let fn = 0;
    for (let i = 0; i < M; i++) {
      const sbar = ub[i] + eb[i] * Fb + ec[i] * Fc;
      y[i] += sbar;
      q[i] = sbar - q[i];
      fn += nutW[i] * y[i];
    }
    Fd[s] = -Fc - Fb;                                                         // eq. (13)
    Fn[s] = fn;
  }
  return { Fd, Fn, modes: M, T };
}
