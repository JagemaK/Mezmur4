// Begena voice: the physical string model (./model.js) with parameters fitted
// to Alemu Aga's "Besmeab - Abatachin Hoy" (instrumental opening), plus the
// sound-box filter and the keyboard -> string mapping.
//
// Fit (see PR description): one-third-octave spectrum within ~3.7 dB of the
// recording, band-energy evolution within ~1.7 dB, rattle/flutter 0.37 vs
// 0.41, and sustain of the 250-1400 Hz formant band comparable to the
// recording over the first second.

import { renderString } from './model.js';

// Measured tuning: minor pentatonic (1 b3 4 5 b7) and its octave = 10 strings
export const BEGENA_STRINGS = [75.7, 89.7, 101.2, 112.9, 135.7, 151.4, 179.4, 202.4, 225.8, 271.4];

// String stiffness and the leather termination raise the sounding pitch (as on
// the real instrument); these factors were solved so each string sounds within
// 1 cent of its target.
const TUNING = [0.978, 0.9818, 0.9843, 0.9862, 0.9886, 0.9901, 0.9916, 0.9926, 0.9935, 0.9945];

// Fitted gut string / leather / bridge-edge / finger-pluck parameters (at 101.2 Hz)
const STRING = {
  L: 0.467,          // speaking length [m]
  radius: 0.606e-3,  // gut radius at 101.2 Hz [m]; thinner for higher strings
  xc: 2.0e-3,        // leather piece position [m]
  kc: 9355,          // leather stiffness [N/m]
  rc: 0.1,           // leather damping [kg/s]
  xb: 13.2e-3,       // bridge edge position [m]
  kb: 1.33e7,        // bridge-edge contact stiffness [N/m]
  te: 0.0194,        // finger pluck duration [s]
  be: 15.1,
  xe: 0.329,         // pluck point (fraction of length)
  we: 0.235,
  ae: -3.95,         // pluck force [N]
  sigma0: 0.5,
  sigma1: 0.006,
  sigma3: 2.66e-5,
};

// Sound box: weak low-frequency radiation (high-pass) and two resonances
const BODY = [
  ['hp', 237, 0.707, 0],
  ['peak', 276, 3.0, 8.85],
  ['peak', 877, 3.06, 4.69],
];

export const RENDER_RATE = 44100;
const DURATION = 2.2;

function biquad(kind, f0, sr, Q, gainDb) {
  const A = Math.pow(10, gainDb / 40);
  const w = (2 * Math.PI * f0) / sr;
  const al = Math.sin(w) / (2 * Q);
  const cw = Math.cos(w);
  const [b, a] = kind === 'hp'
    ? [[(1 + cw) / 2, -(1 + cw), (1 + cw) / 2], [1 + al, -2 * cw, 1 - al]]
    : [[1 + al * A, -2 * cw, 1 - al * A], [1 + al / A, -2 * cw, 1 - al / A]];
  return b.map(v => v / a[0]).concat([a[1] / a[0], a[2] / a[0]]);
}

function filterInPlace(x, [b0, b1, b2, a1, a2]) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const x0 = x[i];
    const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x0; y2 = y1; y1 = y0;
    x[i] = y0;
  }
}

/**
 * Render one plucked begena string. `variant` slightly changes the pluck
 * (strength and position) so repeated notes don't sound identical.
 */
export function renderBegenaVoice(stringIndex, variant = 0, sr = RENDER_RATE) {
  const f0 = BEGENA_STRINGS[stringIndex];
  const vary = [[1, 0], [0.85, 0.03], [1.12, -0.025]][variant % 3];
  const { Fd } = renderString({
    ...STRING,
    sr,
    duration: DURATION,
    f0: f0 * TUNING[stringIndex],
    radius: STRING.radius * Math.sqrt(101.2 / f0), // keeps gut tensions in a realistic range
    ae: STRING.ae * vary[0],
    xe: STRING.xe + vary[1],
  });
  const out = Float32Array.from(Fd);
  for (const [kind, f, Q, g] of BODY) filterInPlace(out, biquad(kind, f, sr, Q, g));

  // Short fade-in against clicks, fade-out at the end, normalise loudness
  const fadeIn = Math.floor(0.002 * sr), fadeOut = Math.floor(0.3 * sr);
  let energy = 0;
  const win = Math.floor(0.4 * sr);
  for (let i = 0; i < out.length; i++) {
    if (i < fadeIn) out[i] *= i / fadeIn;
    if (i > out.length - fadeOut) out[i] *= (out.length - i) / fadeOut;
    if (i < win) energy += out[i] * out[i];
  }
  const rms = Math.sqrt(energy / win) || 1;
  let peak = 0;
  for (let i = 0; i < out.length; i++) { out[i] *= 0.18 / rms; peak = Math.max(peak, Math.abs(out[i])); }
  if (peak > 0.95) for (let i = 0; i < out.length; i++) out[i] *= 0.95 / peak;
  return out;
}

// QWERTY columns -> strings (left hand low, right hand high). Rows set how
// hard the string is plucked: number row strongest, bottom row softest.
const COLUMNS = ['1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', '8ik,', '9ol.', "0p;/'-[]=:?"];
const ROW_VELOCITY = [1.0, 0.95, 0.85, 0.72];

export function keyToString(key) {
  if (!key) return null;
  if (key === ' ') return { string: 0, velocity: 0.5 }; // space: soft low drone string
  const k = key.toLowerCase();
  for (let col = 0; col < COLUMNS.length; col++) {
    const pos = COLUMNS[col].indexOf(k);
    if (pos !== -1) return { string: col, velocity: ROW_VELOCITY[Math.min(pos, 3)] };
  }
  return { string: 2, velocity: 0.8 };
}
