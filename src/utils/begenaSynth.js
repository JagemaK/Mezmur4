// Begena (በገና) string synthesiser.
//
// Modelled on Alemu Aga's "Besmeab - Abatachin Hoy" (instrumental opening):
//  - Tuning: strings measured at 75.7, 89.7, 101.2, 112.9 and 135.7 Hz, a
//    minor pentatonic (1, b3, 4, 5, b7); the upper five are the octave above,
//    giving the begena's ten strings.
//  - Tone: harmonics 3-4 loudest, a strong body resonance near 720 Hz, weak
//    fundamental, ~3 s sustain, and the characteristic buzz from the strings
//    slapping the leather pieces at the bridge on every vibration.
//
// Each string is a waveguide (Karplus-Strong) with a one-sided "leather"
// contact at the bridge; every contact injects a short burst of band-passed
// noise (the buzz). The result goes through biquad filters for the body.
// Buffers are rendered once per string and cached.

export const BEGENA_STRINGS = [75.7, 89.7, 101.2, 112.9, 135.7, 151.4, 179.4, 202.4, 225.8, 271.4];

const PARAMS = {
  t60: 3.0,        // seconds for the string to decay 60 dB
  bright: 0.75,    // loss-filter brightness (higher = highs ring longer)
  gap: 0.04,       // leather contact threshold
  slap: 0.2,       // energy absorbed by each contact
  sizzle: 4.0,     // buzz level (kept below the recording for a smoother sound)
  pluckPos: 0.24,  // pluck point along the string (shapes the harmonic comb)
  duration: 2.4,
};

// RBJ audio-EQ-cookbook biquad coefficients
function biquad(kind, f0, sr, Q = 0.707, gainDb = 0) {
  const A = Math.pow(10, gainDb / 40);
  const w = (2 * Math.PI * f0) / sr;
  const al = Math.sin(w) / (2 * Q);
  const cw = Math.cos(w);
  let b, a;
  if (kind === 'peak') {
    b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A];
  } else if (kind === 'hp') {
    b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al];
  } else if (kind === 'bp') {
    b = [al, 0, -al]; a = [1 + al, -2 * cw, 1 - al];
  } else {
    const sq = 2 * Math.sqrt(A) * al; // lowshelf
    b = [A * ((A + 1) - (A - 1) * cw + sq), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - sq)];
    a = [(A + 1) + (A - 1) * cw + sq, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - sq];
  }
  return { b0: b[0] / a[0], b1: b[1] / a[0], b2: b[2] / a[0], a1: a[1] / a[0], a2: a[2] / a[0] };
}

function filterInPlace(x, c) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const x0 = x[i];
    const y0 = c.b0 * x0 + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1; x1 = x0; y2 = y1; y1 = y0;
    x[i] = y0;
  }
}

// Small deterministic PRNG so every load sounds identical
function makeRandom(seed) {
  let s = seed >>> 0;
  const uniform = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return () => {
    // approx. standard normal (sum of uniforms)
    return (uniform() + uniform() + uniform() + uniform() - 2) * 1.7320508;
  };
}

export function renderBegenaString(freq, sampleRate, seed = 1) {
  const p = PARAMS;
  const sr = sampleRate;
  const n = Math.floor(p.duration * sr);
  const rand = makeRandom(seed * 7919 + Math.round(freq));
  const L = sr / freq;
  const Ni = Math.floor(L);
  const frac = L - Ni;
  const loss = Math.pow(10, -3 / (p.t60 * freq));

  // Excitation: soft finger pluck (triangle at pluck point + smoothed noise)
  const buf = new Float32Array(Ni);
  const noise = new Float32Array(Ni);
  for (let i = 0; i < Ni; i++) noise[i] = rand();
  for (let pass = 0; pass < 6; pass++) {
    const last = noise[Ni - 1];
    for (let i = Ni - 1; i > 0; i--) noise[i] = 0.5 * (noise[i] + noise[i - 1]);
    noise[0] = 0.5 * (noise[0] + last);
  }
  let mean = 0;
  for (let i = 0; i < Ni; i++) {
    const xs = i / Ni;
    buf[i] = xs < p.pluckPos ? xs / p.pluckPos : (1 - xs) / (1 - p.pluckPos);
    mean += buf[i];
  }
  mean /= Ni;
  let maxTri = 0;
  for (let i = 0; i < Ni; i++) { buf[i] -= mean; maxTri = Math.max(maxTri, Math.abs(buf[i])); }
  for (let i = 0; i < Ni; i++) buf[i] = buf[i] / maxTri + 0.15 * noise[i];

  // Waveguide loop with leather-contact buzz
  const out = new Float32Array(n);
  const contact = new Float32Array(n);
  const c = (1 - frac) / (1 + frac);
  let prev = 0, apx = 0, apy = 0, idx = 0, peak = 0;
  for (let i = 0; i < n; i++) {
    const y = buf[idx];
    let v = loss * (p.bright * y + (1 - p.bright) * prev);
    prev = y;
    if (v > p.gap) {
      const e = v - p.gap;
      contact[i] = e;
      v = p.gap + e * (1 - p.slap);
    }
    const a = c * v + apx - c * apy; // fractional-delay allpass
    apx = v; apy = a;
    buf[idx] = a;
    out[i] = y;
    peak = Math.max(peak, Math.abs(y));
    idx = (idx + 1) % Ni;
  }

  // Buzz: band-passed noise gated by the contact envelope
  const k = Math.max(1, Math.floor(0.0015 * sr));
  const buzz = new Float32Array(n);
  for (let i = 0; i < n; i++) buzz[i] = rand();
  filterInPlace(buzz, biquad('bp', 3000, sr, 0.8));
  let run = 0, envMax = 0;
  const env = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    run += contact[i] - (i >= k ? contact[i - k] : 0);
    env[i] = run / k;
    envMax = Math.max(envMax, env[i]);
  }
  const buzzGain = envMax > 0 ? (p.sizzle * peak * 0.5) / envMax : 0;
  for (let i = 0; i < n; i++) out[i] += buzz[i] * env[i] * buzzGain;

  // Body: highpass, weak fundamental, resonances at 400 / 720 / 2600 Hz
  for (const [kind, f0, Q, g] of [
    ['hp', 55, 0.707, 0], ['hp', 55, 0.707, 0], ['lowshelf', 220, 0.707, -15],
    ['peak', 400, 1.5, 8], ['peak', 720, 1.8, 12], ['peak', 2600, 1.2, 3.5],
  ]) {
    filterInPlace(out, biquad(kind, f0, sr, Q, g));
  }

  // Soft finger attack, gentle tail, normalise
  const attack = Math.floor(0.003 * sr);
  const tail = Math.floor(0.25 * sr);
  let max = 0;
  for (let i = 0; i < n; i++) {
    if (i < attack) out[i] *= i / attack;
    if (i > n - tail) out[i] *= (n - i) / tail;
    max = Math.max(max, Math.abs(out[i]));
  }
  if (max > 0) for (let i = 0; i < n; i++) out[i] /= max;
  return out;
}

// QWERTY columns -> strings (left hand low, right hand high). Rows set how
// hard the string is plucked: top row strongest, bottom row softest.
const COLUMNS = [
  '1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', '8ik,', '9ol.', "0p;/'-[]=:?",
];
const ROW_VELOCITY = { 0: 1.0, 1: 0.95, 2: 0.85, 3: 0.72 };

export function keyToString(key) {
  if (!key) return null;
  if (key === ' ') return { string: 0, velocity: 0.55 }; // space: soft low drone string
  const k = key.toLowerCase();
  for (let col = 0; col < COLUMNS.length; col++) {
    const pos = COLUMNS[col].indexOf(k);
    if (pos !== -1) return { string: col, velocity: ROW_VELOCITY[Math.min(pos, 3)] };
  }
  return { string: 2, velocity: 0.8 }; // any other character
}
