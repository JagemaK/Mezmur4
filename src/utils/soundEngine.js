// Web Audio API Sound Synthesizer for Mechanical Keyboard and Ethiopian Begena

import { BEGENA_NOTES, BEGENA_SPRITE_URL, keyToString } from './begena/notes.js';

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundType = 'begena'; // 'begena', 'thock', 'cherry_blue', 'typewriter', 'off'
    this.volume = 0.5;
    this.notes = [220, 247.5, 275, 330, 367.5, 440, 495, 550]; // Meditative pentatonic mode (ዜማ)
    this.noteIndex = 0;
    this.stringBuffers = {};   // string -> [AudioBuffer variants]
    this.stringVariant = {};
    this.voices = [];          // { src, gain, string }
    this.bus = null;
  }

  // Shared output chain: gentle low-pass, short room reverb, soft compressor
  getBus() {
    if (this.bus) return this.bus;
    const ctx = this.ctx;
    const input = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 7000;
    const dry = ctx.createGain();
    dry.gain.value = 0.85;
    const wet = ctx.createGain();
    wet.gain.value = 0.08;
    const reverb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 1.6);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      let seed = 12345 + ch * 777;
      for (let i = 0; i < len; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        d[i] = ((seed / 4294967296) * 2 - 1) * Math.pow(1 - i / len, 3.2);
      }
    }
    reverb.buffer = ir;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 3;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
    input.connect(tone);
    tone.connect(dry);
    tone.connect(reverb);
    reverb.connect(wet);
    dry.connect(comp);
    wet.connect(comp);
    comp.connect(ctx.destination);
    this.bus = input;
    return input;
  }

  // Load the real begena notes once (one small sprite) and cut them into
  // per-string buffers
  warmUpBegena() {
    if (this.begenaLoading) return;
    this.init();
    if (!this.ctx || typeof fetch === 'undefined') return;
    this.begenaLoading = fetch(BEGENA_SPRITE_URL)
      .then(res => res.arrayBuffer())
      .then(data => new Promise((resolve, reject) => this.ctx.decodeAudioData(data, resolve, reject)))
      .then(sprite => {
        const src = sprite.getChannelData(0);
        for (const [string, variant, start, duration] of BEGENA_NOTES) {
          const from = Math.floor(start * sprite.sampleRate);
          const len = Math.floor(duration * sprite.sampleRate);
          const buffer = this.ctx.createBuffer(1, len, sprite.sampleRate);
          buffer.copyToChannel(src.subarray(from, from + len), 0);
          (this.stringBuffers[string] ||= []).push(buffer);
        }
      })
      .catch(() => { this.begenaLoading = null; });
  }

  // Alternate between the recorded variants of a string
  getStringBuffer(string) {
    const list = this.stringBuffers[string];
    if (!list || !list.length) return null;
    this.stringVariant[string] = ((this.stringVariant[string] || 0) + 1) % list.length;
    return list[this.stringVariant[string]];
  }

  // Start a plucked string; re-plucking a ringing string damps it first
  pluckString(string, velocity, { muted = false, when } = {}) {
    const ctx = this.ctx;
    const now = when ?? ctx.currentTime;
    for (const v of this.voices) {
      if (v.string === string) {
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setTargetAtTime(0, now, 0.012);
        try { v.src.stop(now + 0.08); } catch { /* already stopped */ }
      }
    }
    const buffer = this.getStringBuffer(string);
    if (!buffer) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    const level = this.volume * velocity * 0.6;
    let node = src;
    if (muted) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 600;
      src.connect(lp);
      node = lp;
      gain.gain.setValueAtTime(level, now);
      gain.gain.setTargetAtTime(0, now + 0.02, 0.035);
    } else {
      gain.gain.setValueAtTime(level, now);
    }
    node.connect(gain);
    gain.connect(this.getBus());
    src.start(now);
    const voice = { src, gain, string };
    this.voices.push(voice);
    src.onended = () => { this.voices = this.voices.filter(v => v !== voice); };
    // Cap polyphony; fade the oldest voice out smoothly
    if (this.voices.length > 10) {
      const old = this.voices.shift();
      old.gain.gain.setTargetAtTime(0, now, 0.03);
      try { old.src.stop(now + 0.2); } catch { /* already stopped */ }
    }
  }

  playBegenaKey(key) {
    if (key === 'Backspace') {
      this.pluckString(0, 0.35, { muted: true });
      return;
    }
    const mapped = keyToString(key) || { string: 2, velocity: 0.8 };
    this.pluckString(mapped.string, mapped.velocity);
  }

  // Kept for API compatibility (test restart)
  resetSequence() {
    this.noteIndex = 0;
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
    if (type === 'type_with_begena') this.warmUpBegena();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playKey(key) {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      switch (this.soundType) {
        case 'type_with_begena':
          this.warmUpBegena();
          this.playBegenaKey(key);
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
  playError(key) {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.soundType === 'type_with_begena') {
        // The same string, damped by the palm: a short muted thud
        const mapped = keyToString(key) || { string: 2 };
        this.pluckString(mapped.string, 0.9, { muted: true });
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
      if (this.soundType === 'type_with_begena') {
        // Rising pentatonic run across the strings at the recording's ~94 BPM
        const start = this.ctx.currentTime + 0.05;
        [0, 2, 4, 5, 7, 9, 7, 9].forEach((string, i) => {
          this.pluckString(string, i === 7 ? 1 : 0.8, { when: start + i * 0.32 });
        });
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
