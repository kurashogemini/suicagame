// Web Audio API Synthesizer for Suika Game sound effects

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('suica_muted') === 'true';
    this.volume = 0.5;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('suica_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Soft thud/pop when fruit is dropped or hits box
  playDrop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio play failure:', e);
    }
  }

  // Satisfying popping sound when two fruits merge
  // Frequency increases with fruit tier
  playMerge(tier = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 320 + tier * 55;

      // Primary pop
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq * 0.7, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.18);

      gain1.gain.setValueAtTime(0.4 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.18);

      // High sparkle tone for higher tiers
      if (tier >= 3) {
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 2, now + 0.04);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.15);

        gain2.gain.setValueAtTime(0.2 * this.volume, now + 0.04);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);

        osc2.start(now + 0.04);
        osc2.stop(now + 0.15);
      }
    } catch (e) {
      console.warn('Audio play failure:', e);
    }
  }

  // Fanfare chord when Watermelon (スイカ) is created!
  playWatermelon() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const startTime = now + index * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {
      console.warn('Audio play failure:', e);
    }
  }

  // Game over descending melody
  playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 415.30, 392, 349.23]; // A4, Ab4, G4, F4

      notes.forEach((freq, index) => {
        const startTime = now + index * 0.15;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {
      console.warn('Audio play failure:', e);
    }
  }

  // Crisp UI button click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio play failure:', e);
    }
  }
}

export const sound = new SoundSystem();
