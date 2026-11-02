// Web Audio API Sound Synthesizer for Mechanical Keyboard and Ethiopian Begena

// "Type with Begena": beats tracked from the instrumental opening of Alemu Aga's
// "Besmeab - Abatachin Hoy" (~94 BPM). Each entry is [start seconds, gain] into
// /sounds/begena-beats.mp3; every keystroke plays the next beat, so typing
// replays the piece at your own pace.
const BEGENA_SPRITE_URL = '/sounds/begena-beats.mp3';
const BEGENA_BEATS = [
  [0.723, 0.76], [1.299, 1.27], [2.052, 0.81], [2.662, 1.32], [3.384, 1.38], [4.043, 0.99],
  [4.746, 0.67], [5.319, 1.36], [5.935, 0.9], [6.579, 0.81], [7.121, 0.98], [7.728, 1.01],
  [8.327, 0.86], [8.893, 1.54], [9.46, 0.84], [10.048, 0.72], [10.671, 1.02], [12.054, 1.19],
  [12.781, 0.92], [13.353, 0.8], [14.023, 0.99], [14.822, 0.62], [15.454, 0.66], [16.035, 0.77],
  [16.641, 1.17], [17.348, 0.94], [18.011, 0.85], [18.629, 0.86], [19.339, 1.03], [19.934, 1.08],
  [20.673, 0.9], [21.442, 1.02], [22.158, 0.97], [22.708, 1.32], [23.404, 1.37], [23.944, 1.07],
  [24.644, 0.89], [25.223, 1.34], [25.748, 0.99], [26.433, 0.98], [27.076, 1.08], [27.701, 0.99],
  [28.274, 1.48], [28.822, 1.16], [29.516, 1.13], [30.173, 0.84], [30.808, 1.0], [31.525, 1.08],
  [32.133, 1.07], [32.823, 1.13], [33.462, 1.61], [34.085, 0.99], [34.783, 1.35],
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundType = 'begena'; // 'begena', 'thock', 'cherry_blue', 'typewriter', 'off'
    this.volume = 0.5;
    this.notes = [220, 247.5, 275, 330, 367.5, 440, 495, 550]; // Meditative pentatonic mode (ዜማ)
    this.noteIndex = 0;
    this.beatIndex = 0;
    this.begenaBuffer = null;
    this.begenaLoading = null;
    this.activeVoices = [];
  }

  // Fetch & decode the begena recording once, on first use
  loadBegena() {
    if (this.begenaBuffer || this.begenaLoading) return this.begenaLoading;
    this.init();
    if (!this.ctx || typeof fetch === 'undefined') return null;
    this.begenaLoading = fetch(BEGENA_SPRITE_URL)
      .then(res => res.arrayBuffer())
      .then(data => new Promise((resolve, reject) => this.ctx.decodeAudioData(data, resolve, reject)))
      .then(buffer => { this.begenaBuffer = buffer; })
      .catch(() => { this.begenaLoading = null; });
    return this.begenaLoading;
  }

  // Start the melody from the first beat (on test restart)
  resetSequence() {
    this.beatIndex = 0;
    this.noteIndex = 0;
  }

  // Play part of the recording with a pluck-shaped envelope
  playBegenaSlice(now, offset, duration, gainValue, { muted = false } = {}) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.begenaBuffer;
    const gain = this.ctx.createGain();
    let node = src;
    if (muted) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 380;
      src.connect(filter);
      node = filter;
    }
    const peak = Math.max(0.0002, gainValue);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.006);
    gain.gain.setValueAtTime(peak, now + duration * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    node.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(now, Math.max(0, offset), duration + 0.02);

    // Keep polyphony bounded when typing fast
    this.activeVoices.push(src);
    src.onended = () => { this.activeVoices = this.activeVoices.filter(v => v !== src); };
    if (this.activeVoices.length > 6) {
      try { this.activeVoices.shift().stop(); } catch { /* already stopped */ }
    }
  }

  playBegenaBeat(now) {
    if (!this.begenaBuffer) {
      this.loadBegena();
      this.playBegenaString(now);
      return;
    }
    const [start, gain] = BEGENA_BEATS[this.beatIndex % BEGENA_BEATS.length];
    this.beatIndex++;
    this.playBegenaSlice(now, start - 0.012, 0.55, this.volume * 0.9 * gain);
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSoundType(type) {
    this.soundType = type;
    if (type === 'type_with_begena') this.loadBegena();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playKey() {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      switch (this.soundType) {
        case 'type_with_begena':
          this.playBegenaBeat(now);
          break;
        case 'begena':
          this.playBegenaString(now);
          break;
        case 'thock':
          this.playThock(now);
          break;
        case 'cherry_blue':
          this.playCherryBlue(now);
          break;
        case 'typewriter':
          this.playTypewriter(now);
          break;
        default:
          this.playBegenaString(now);
      }
    } catch {
      // AudioContext interrupted or blocked
    }
  }

  // Realistic deep lubed Topre switch Thock
  playThock(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const pitch = 130 + Math.random() * 25;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Crisp mechanical Cherry MX Blue click
  playCherryBlue(now) {
    // Sharp click noise burst
    const bufferSize = this.ctx.sampleRate * 0.015;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200 + Math.random() * 400, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Heavy mechanical typewriter stroke
  playTypewriter(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    gain.gain.setValueAtTime(this.volume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Ethiopian Begena (David's 10-string Sacred Harp) Pluck synthesis
  playBegenaString(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pentatonic scale step
    const freq = this.notes[this.noteIndex % this.notes.length];
    this.noteIndex++;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Begena has warm lingering overtone with natural decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Soft error thud
  playError() {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.soundType === 'type_with_begena' && this.begenaBuffer) {
        // Muted, dampened string for a mistake
        const [start] = BEGENA_BEATS[this.beatIndex % BEGENA_BEATS.length];
        this.playBegenaSlice(now, start - 0.012, 0.14, this.volume * 1.2, { muted: true });
        return;
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // AudioContext interrupted
    }
  }

  // Triumphant sacred bell chime upon completing chapter
  playVictory() {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.soundType === 'type_with_begena' && this.begenaBuffer) {
        // Opening phrase of the recording as a closing flourish
        const [start] = BEGENA_BEATS[0];
        this.playBegenaSlice(this.ctx.currentTime, start - 0.012, 6, this.volume * 0.9);
        return;
      }
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major triumph
      chords.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch {
      // AudioContext interrupted
    }
  }
}

export const soundEngine = new SoundEngine();
