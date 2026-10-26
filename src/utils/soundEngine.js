// Web Audio API Sound Synthesizer for Mechanical Keyboard and Ethiopian Begena

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundType = 'begena'; // 'begena', 'thock', 'cherry_blue', 'typewriter', 'off'
    this.volume = 0.5;
    this.notes = [220, 247.5, 275, 330, 367.5, 440, 495, 550]; // Meditative pentatonic mode (ዜማ)
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
