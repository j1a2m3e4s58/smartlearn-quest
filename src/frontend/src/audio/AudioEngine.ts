/**
 * AudioEngine — procedural Web Audio API singleton.
 * Multi-layer adaptive music, world-specific ambience, expanded effects.
 * Generates all sound programmatically — no external audio assets required.
 */

// ─── Public types ────────────────────────────────────────────────────────────

export type TrackId =
  | "menu"
  | "ict"
  | "math"
  | "science"
  | "english"
  | "robotics"
  | "critical"
  | "victory"
  | "defeat"
  | "boss";

export type IntensityLevel = "explore" | "engage" | "intense";

export type EffectId =
  | "click"
  | "correct"
  | "wrong"
  | "combo"
  | "achievement"
  | "countdown"
  | "impact"
  | "victory_sting"
  | "defeat_sting"
  | "levelUp"
  | "worldUnlock"
  | "bossIntro"
  | "streak"
  | "hint"
  | "narrationStart"
  | "easter_egg"
  | "save"
  | "leaderboard_entry";

// ─── Internal types ───────────────────────────────────────────────────────────

interface LayerConfig {
  gain: number; // relative gain multiplier vs base
  tempoMult: number; // oscillator pulse speed multiplier
  filterHz: number; // low-pass cutoff in Hz
}

const INTENSITY_LAYERS: Record<IntensityLevel, LayerConfig> = {
  explore: { gain: 0.6, tempoMult: 0.75, filterHz: 800 },
  engage: { gain: 1.0, tempoMult: 1.0, filterHz: 2000 },
  intense: { gain: 1.4, tempoMult: 1.3, filterHz: 6000 },
};

interface TrackConfig {
  frequencies: number[];
  tempo: number;
  waveform: OscillatorType;
  baseGain: number;
  harmonics: number[];
}

const TRACK_CONFIGS: Record<TrackId, TrackConfig> = {
  menu: {
    frequencies: [220, 277, 330],
    tempo: 80,
    waveform: "sine",
    baseGain: 0.08,
    harmonics: [1, 2, 3],
  },
  ict: {
    frequencies: [330, 415, 494],
    tempo: 120,
    waveform: "square",
    baseGain: 0.05,
    harmonics: [1, 2, 4],
  },
  math: {
    frequencies: [264, 330, 396],
    tempo: 100,
    waveform: "triangle",
    baseGain: 0.07,
    harmonics: [1, 2, 3],
  },
  science: {
    frequencies: [293, 370, 440],
    tempo: 90,
    waveform: "sine",
    baseGain: 0.07,
    harmonics: [1, 1.5, 2],
  },
  english: {
    frequencies: [349, 440, 523],
    tempo: 76,
    waveform: "sine",
    baseGain: 0.06,
    harmonics: [1, 2, 3],
  },
  robotics: {
    frequencies: [220, 311, 415],
    tempo: 140,
    waveform: "sawtooth",
    baseGain: 0.04,
    harmonics: [1, 3, 5],
  },
  critical: {
    frequencies: [294, 370, 494],
    tempo: 110,
    waveform: "triangle",
    baseGain: 0.06,
    harmonics: [1, 2, 4],
  },
  victory: {
    frequencies: [523, 659, 784],
    tempo: 160,
    waveform: "sine",
    baseGain: 0.09,
    harmonics: [1, 2, 3],
  },
  defeat: {
    frequencies: [196, 220, 246],
    tempo: 60,
    waveform: "sine",
    baseGain: 0.07,
    harmonics: [1, 1.5, 2],
  },
  boss: {
    frequencies: [110, 146, 220],
    tempo: 130,
    waveform: "sawtooth",
    baseGain: 0.05,
    harmonics: [1, 2, 3, 5],
  },
};

interface ActiveTrack {
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  filterNode: BiquadFilterNode;
  lfoNode: OscillatorNode;
  lfoGain: GainNode;
}

interface AmbienceNode {
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  intervals: ReturnType<typeof setInterval>[];
}

// ─── Engine class ─────────────────────────────────────────────────────────────

class AudioEngine {
  private static instance: AudioEngine;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: ActiveTrack | null = null;
  private currentTrackId: TrackId | null = null;
  private currentIntensity: IntensityLevel = "explore";
  private ambienceNode: AmbienceNode | null = null;
  private currentAmbienceWorld: string | null = null;
  private _volume = 0.7;
  private _muted = false;
  private initialized = false;

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
    return AudioEngine.instance;
  }

  private constructor() {}

  // ── Initialisation ─────────────────────────────────────────────────────────

  init(): void {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this._volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch {
      // AudioContext not available in this environment
    }
  }

  private ensureCtx(): AudioContext | null {
    if (!this.initialized) this.init();
    if (!this.ctx || !this.masterGain) return null;
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  // ── Track building ─────────────────────────────────────────────────────────

  private buildTrack(
    config: TrackConfig,
    intensity: IntensityLevel,
  ): ActiveTrack | null {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return null;

    const layer = INTENSITY_LAYERS[intensity];

    // Master gain for this track (starts at 0 for fade-in)
    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0, ctx.currentTime);

    // Low-pass filter shaped by intensity
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(layer.filterHz, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    // LFO for gentle tremolo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.4 * layer.tempoMult, ctx.currentTime);
    lfoGain.gain.setValueAtTime(
      config.baseGain * 0.3 * layer.gain,
      ctx.currentTime,
    );
    lfo.connect(lfoGain);
    lfoGain.connect(trackGain.gain);
    lfo.start();

    // Chain: oscillators → trackGain → filter → masterGain
    trackGain.connect(filter);
    filter.connect(this.masterGain);

    const oscillators: OscillatorNode[] = [];
    const beatInterval = 60 / config.tempo / layer.tempoMult;
    const effectiveBase = config.baseGain * layer.gain;

    config.frequencies.forEach((freq, i) => {
      config.harmonics.forEach((harmonic) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const gainVal = effectiveBase / (harmonic * (i + 1));
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);

        const pulsePeriod = beatInterval * (i + 1);
        for (let t = 0; t < 32; t++) {
          const time = ctx.currentTime + t * pulsePeriod;
          gain.gain.setValueAtTime(gainVal * 0.6, time);
          gain.gain.linearRampToValueAtTime(gainVal, time + pulsePeriod * 0.4);
        }

        osc.type = config.waveform;
        osc.frequency.setValueAtTime(freq * harmonic, ctx.currentTime);
        osc.connect(gain);
        gain.connect(trackGain);
        osc.start();
        oscillators.push(osc);
      });
    });

    return {
      oscillators,
      gainNode: trackGain,
      filterNode: filter,
      lfoNode: lfo,
      lfoGain,
    };
  }

  private stopTrackNode(track: ActiveTrack, fadeDuration = 0.8): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    track.gainNode.gain.setValueAtTime(track.gainNode.gain.value, now);
    track.gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
    setTimeout(
      () => {
        track.oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
        try {
          track.lfoNode.stop();
        } catch {}
        try {
          track.gainNode.disconnect();
        } catch {}
        try {
          track.filterNode.disconnect();
        } catch {}
      },
      (fadeDuration + 0.1) * 1000,
    );
  }

  // ── Public music API ───────────────────────────────────────────────────────

  play(trackId: TrackId): void {
    if (!this.initialized) this.init();
    if (this.currentTrackId === trackId) return;
    this.stop();
    const config = TRACK_CONFIGS[trackId];
    if (!config) return;
    const track = this.buildTrack(config, this.currentIntensity);
    if (!track || !this.ctx) return;
    const now = this.ctx.currentTime;
    track.gainNode.gain.cancelScheduledValues(now);
    track.gainNode.gain.setValueAtTime(0, now);
    track.gainNode.gain.linearRampToValueAtTime(this._muted ? 0 : 1, now + 1.5);
    this.currentTrack = track;
    this.currentTrackId = trackId;
  }

  stop(): void {
    if (!this.currentTrack || !this.ctx) return;
    this.stopTrackNode(this.currentTrack, 0.8);
    this.currentTrack = null;
    this.currentTrackId = null;
  }

  /**
   * Smoothly crossfade from the current track to a new one.
   * @param trackId  Target track
   * @param durationMs  Total crossfade duration in milliseconds (default 2000)
   */
  crossfadeToTrack(trackId: TrackId, durationMs = 2000): void {
    if (!this.initialized) this.init();
    const ctx = this.ensureCtx();
    if (!ctx) return;

    const fadeSecs = durationMs / 1000;
    const now = ctx.currentTime;

    // Fade out current track simultaneously with fade in of new track
    if (this.currentTrack) {
      const old = this.currentTrack;
      old.gainNode.gain.setValueAtTime(old.gainNode.gain.value, now);
      old.gainNode.gain.linearRampToValueAtTime(0, now + fadeSecs);
      const oldCopy = old;
      setTimeout(() => {
        oldCopy.oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
        try {
          oldCopy.lfoNode.stop();
        } catch {}
        try {
          oldCopy.gainNode.disconnect();
        } catch {}
        try {
          oldCopy.filterNode.disconnect();
        } catch {}
      }, durationMs + 100);
      this.currentTrack = null;
      this.currentTrackId = null;
    }

    const config = TRACK_CONFIGS[trackId];
    if (!config) return;
    const newTrack = this.buildTrack(config, this.currentIntensity);
    if (!newTrack) return;

    // Start silent, ramp up
    newTrack.gainNode.gain.cancelScheduledValues(now);
    newTrack.gainNode.gain.setValueAtTime(0, now);
    newTrack.gainNode.gain.linearRampToValueAtTime(
      this._muted ? 0 : 1,
      now + fadeSecs,
    );

    this.currentTrack = newTrack;
    this.currentTrackId = trackId;
  }

  /** @deprecated use crossfadeToTrack */
  crossFadeTo(trackId: TrackId): void {
    this.crossfadeToTrack(trackId, 2000);
  }

  // ── Intensity control ──────────────────────────────────────────────────────

  /**
   * Change the emotional intensity of the current (and future) tracks.
   * A 2-second crossfade is applied to the new layer.
   */
  setIntensity(level: IntensityLevel): void {
    if (level === this.currentIntensity) return;
    this.currentIntensity = level;
    if (this.currentTrackId) {
      this.crossfadeToTrack(this.currentTrackId, 2000);
    }
    // Update ambience filter if active
    if (this.ambienceNode && this.ctx) {
      // ambienceNode gain follows intensity
      const targetGain = INTENSITY_LAYERS[level].gain * 0.04;
      const now = this.ctx.currentTime;
      this.ambienceNode.gainNode.gain.linearRampToValueAtTime(
        targetGain,
        now + 2,
      );
    }
  }

  // ── Ambience system ────────────────────────────────────────────────────────

  playAmbience(world: string): void {
    if (this.currentAmbienceWorld === world) return;
    this.stopAmbience();
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;

    const ambiGain = ctx.createGain();
    ambiGain.gain.setValueAtTime(0, ctx.currentTime);
    ambiGain.connect(this.masterGain);

    const oscillators: OscillatorNode[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const baseIntensityGain = INTENSITY_LAYERS[this.currentIntensity].gain;

    switch (world) {
      case "ict": {
        // Digital beeps — short blips on random hi frequencies
        const beepOsc = ctx.createOscillator();
        beepOsc.type = "square";
        beepOsc.frequency.setValueAtTime(1200, ctx.currentTime);
        const beepGain = ctx.createGain();
        beepGain.gain.setValueAtTime(0, ctx.currentTime);
        beepOsc.connect(beepGain);
        beepGain.connect(ambiGain);
        beepOsc.start();
        oscillators.push(beepOsc);
        const beepInterval = setInterval(
          () => {
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            beepOsc.frequency.setValueAtTime(800 + Math.random() * 1200, now);
            beepGain.gain.setValueAtTime(0.08 * baseIntensityGain, now);
            beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          },
          400 + Math.random() * 600,
        );
        intervals.push(beepInterval);

        // Fan hum — low drone
        const fanOsc = ctx.createOscillator();
        fanOsc.type = "sawtooth";
        fanOsc.frequency.setValueAtTime(60, ctx.currentTime);
        const fanFilter = ctx.createBiquadFilter();
        fanFilter.type = "lowpass";
        fanFilter.frequency.setValueAtTime(120, ctx.currentTime);
        const fanGain = ctx.createGain();
        fanGain.gain.setValueAtTime(0.04 * baseIntensityGain, ctx.currentTime);
        fanOsc.connect(fanFilter);
        fanFilter.connect(fanGain);
        fanGain.connect(ambiGain);
        fanOsc.start();
        oscillators.push(fanOsc);
        break;
      }

      case "math": {
        // Soft synth pulses — gentle pentatonic plucks
        const notes = [261, 293, 329, 392, 440];
        const pluckOsc = ctx.createOscillator();
        pluckOsc.type = "triangle";
        pluckOsc.frequency.setValueAtTime(notes[0], ctx.currentTime);
        const pluckGain = ctx.createGain();
        pluckGain.gain.setValueAtTime(0, ctx.currentTime);
        pluckOsc.connect(pluckGain);
        pluckGain.connect(ambiGain);
        pluckOsc.start();
        oscillators.push(pluckOsc);
        let noteIdx = 0;
        const pluckInterval = setInterval(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          noteIdx = (noteIdx + 1) % notes.length;
          pluckOsc.frequency.setValueAtTime(notes[noteIdx], now);
          pluckGain.gain.setValueAtTime(0.1 * baseIntensityGain, now);
          pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        }, 800);
        intervals.push(pluckInterval);
        break;
      }

      case "science": {
        // Lab bubble pops
        const bubbleOsc = ctx.createOscillator();
        bubbleOsc.type = "sine";
        bubbleOsc.frequency.setValueAtTime(500, ctx.currentTime);
        const bubbleGain = ctx.createGain();
        bubbleGain.gain.setValueAtTime(0, ctx.currentTime);
        bubbleOsc.connect(bubbleGain);
        bubbleGain.connect(ambiGain);
        bubbleOsc.start();
        oscillators.push(bubbleOsc);
        const bubbleInterval = setInterval(
          () => {
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const baseFreq = 400 + Math.random() * 400;
            bubbleOsc.frequency.setValueAtTime(baseFreq, now);
            bubbleOsc.frequency.exponentialRampToValueAtTime(
              baseFreq * 1.5,
              now + 0.12,
            );
            bubbleGain.gain.setValueAtTime(0.07 * baseIntensityGain, now);
            bubbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          },
          500 + Math.random() * 800,
        );
        intervals.push(bubbleInterval);

        // Ventilation hiss
        const ventOsc = ctx.createOscillator();
        ventOsc.type = "sawtooth";
        ventOsc.frequency.setValueAtTime(80, ctx.currentTime);
        const ventFilter = ctx.createBiquadFilter();
        ventFilter.type = "bandpass";
        ventFilter.frequency.setValueAtTime(200, ctx.currentTime);
        ventFilter.Q.setValueAtTime(0.5, ctx.currentTime);
        const ventGain = ctx.createGain();
        ventGain.gain.setValueAtTime(
          0.025 * baseIntensityGain,
          ctx.currentTime,
        );
        ventOsc.connect(ventFilter);
        ventFilter.connect(ventGain);
        ventGain.connect(ambiGain);
        ventOsc.start();
        oscillators.push(ventOsc);
        break;
      }

      case "english": {
        // Gentle library ambience — very soft pad
        const padFreqs = [220, 277, 330, 415];
        padFreqs.forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.018 * baseIntensityGain, ctx.currentTime);
          osc.connect(g);
          g.connect(ambiGain);
          osc.start();
          oscillators.push(osc);
        });
        // Page-turn flick sound via brief noise burst
        const pageFlickInterval = setInterval(
          () => {
            if (!this.ctx) return;
            this.noiseBlipDirect(
              this.ctx,
              ambiGain,
              0.04 * baseIntensityGain,
              0.06,
            );
          },
          3000 + Math.random() * 4000,
        );
        intervals.push(pageFlickInterval);
        break;
      }

      case "robotics": {
        // Mechanical servo clicks
        const servoOsc = ctx.createOscillator();
        servoOsc.type = "square";
        servoOsc.frequency.setValueAtTime(900, ctx.currentTime);
        const servoGain = ctx.createGain();
        servoGain.gain.setValueAtTime(0, ctx.currentTime);
        servoOsc.connect(servoGain);
        servoGain.connect(ambiGain);
        servoOsc.start();
        oscillators.push(servoOsc);
        let clickPhase = 0;
        const clickInterval = setInterval(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          clickPhase = (clickPhase + 1) % 4;
          const freq = clickPhase % 2 === 0 ? 1100 : 750;
          servoOsc.frequency.setValueAtTime(freq, now);
          servoGain.gain.setValueAtTime(0.09 * baseIntensityGain, now);
          servoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        }, 250);
        intervals.push(clickInterval);

        // Factory hum
        const factoryOsc = ctx.createOscillator();
        factoryOsc.type = "sawtooth";
        factoryOsc.frequency.setValueAtTime(55, ctx.currentTime);
        const factoryFilter = ctx.createBiquadFilter();
        factoryFilter.type = "lowpass";
        factoryFilter.frequency.setValueAtTime(200, ctx.currentTime);
        const factoryGain = ctx.createGain();
        factoryGain.gain.setValueAtTime(
          0.035 * baseIntensityGain,
          ctx.currentTime,
        );
        factoryOsc.connect(factoryFilter);
        factoryFilter.connect(factoryGain);
        factoryGain.connect(ambiGain);
        factoryOsc.start();
        oscillators.push(factoryOsc);
        break;
      }

      case "critical": {
        // Mysterious resonant tones — detuned slow drones
        const droneFreqs = [110, 123, 146];
        droneFreqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f + i * 0.3, ctx.currentTime); // slight detune
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.03 * baseIntensityGain, ctx.currentTime);
          // Slow amplitude wobble via LFO
          const lfo = ctx.createOscillator();
          const lfoG = ctx.createGain();
          lfo.frequency.setValueAtTime(0.15 + i * 0.07, ctx.currentTime);
          lfoG.gain.setValueAtTime(0.015 * baseIntensityGain, ctx.currentTime);
          lfo.connect(lfoG);
          lfoG.connect(g.gain);
          lfo.start();
          oscillators.push(lfo);
          osc.connect(g);
          g.connect(ambiGain);
          osc.start();
          oscillators.push(osc);
        });
        break;
      }

      default:
        break;
    }

    // Fade ambience in
    const now = ctx.currentTime;
    ambiGain.gain.linearRampToValueAtTime(
      this._muted ? 0 : INTENSITY_LAYERS[this.currentIntensity].gain * 0.04,
      now + 2,
    );

    this.ambienceNode = { oscillators, gainNode: ambiGain, intervals };
    this.currentAmbienceWorld = world;
  }

  stopAmbience(): void {
    if (!this.ambienceNode || !this.ctx) return;
    const node = this.ambienceNode;
    const now = this.ctx.currentTime;
    node.gainNode.gain.setValueAtTime(node.gainNode.gain.value, now);
    node.gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
    node.intervals.forEach((id) => clearInterval(id));
    setTimeout(() => {
      node.oscillators.forEach((o) => {
        try {
          o.stop();
        } catch {}
      });
      try {
        node.gainNode.disconnect();
      } catch {}
    }, 1700);
    this.ambienceNode = null;
    this.currentAmbienceWorld = null;
  }

  // ── Volume controls ────────────────────────────────────────────────────────

  setVolume(vol: number): void {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this._muted) {
      this.masterGain.gain.linearRampToValueAtTime(
        this._volume,
        this.ctx.currentTime + 0.1,
      );
    }
  }

  mute(): void {
    this._muted = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        0,
        this.ctx.currentTime + 0.2,
      );
    }
  }

  unmute(): void {
    this._muted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        this._volume,
        this.ctx.currentTime + 0.2,
      );
    }
  }

  get isMuted(): boolean {
    return this._muted;
  }
  get volume(): number {
    return this._volume;
  }

  // ── Sound effects ──────────────────────────────────────────────────────────

  playEffect(effectId: EffectId): void {
    const ctx = this.ensureCtx();
    if (!ctx || this._muted) return;
    this.effectFns[effectId]?.(ctx);
  }

  private readonly effectFns: Record<EffectId, (ctx: AudioContext) => void> = {
    // ── Existing effects (unchanged) ─────────────────────────────────────────
    click: (ctx) => {
      this.toneBlip(ctx, 880, 0.06, 0.04, "sine");
    },
    correct: (ctx) => {
      this.toneBlip(ctx, 523, 0.15, 0.12, "sine");
      setTimeout(() => this.toneBlip(ctx, 659, 0.12, 0.12, "sine"), 100);
      setTimeout(() => this.toneBlip(ctx, 784, 0.18, 0.2, "sine"), 200);
    },
    wrong: (ctx) => {
      this.toneBlip(ctx, 200, 0.2, 0.08, "sawtooth");
      setTimeout(() => this.toneBlip(ctx, 160, 0.2, 0.18, "sawtooth"), 100);
    },
    combo: (ctx) => {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.15, 0.1, "triangle"), i * 80);
      });
    },
    achievement: (ctx) => {
      [784, 988, 1175, 1568].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.2, 0.15, "sine"), i * 100);
      });
    },
    countdown: (ctx) => {
      this.toneBlip(ctx, 440, 0.18, 0.08, "square");
    },
    impact: (ctx) => {
      this.noiseBlip(ctx, 0.25, 0.12);
      this.toneBlip(ctx, 110, 0.3, 0.08, "sawtooth");
    },
    victory_sting: (ctx) => {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.22, 0.18, "sine"), i * 80);
      });
    },
    defeat_sting: (ctx) => {
      [330, 294, 262, 220, 196].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.2, 0.22, "sine"), i * 120);
      });
    },

    // ── New effects ───────────────────────────────────────────────────────────
    levelUp: (ctx) => {
      // Rising pentatonic burst followed by triumphant chord
      [392, 494, 587, 740, 988].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.2, 0.14, "sine"), i * 70);
      });
      setTimeout(() => {
        [523, 659, 784].forEach((f) =>
          this.toneBlip(ctx, f, 0.25, 0.4, "sine"),
        );
      }, 400);
    },

    worldUnlock: (ctx) => {
      // Cinematic swelling chord + shimmering overtones
      [261, 329, 392, 523].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.18, 0.5, "sine"), i * 60);
      });
      setTimeout(() => {
        [1046, 1318, 1568, 2093].forEach((f, i) => {
          setTimeout(() => this.toneBlip(ctx, f, 0.1, 0.3, "triangle"), i * 50);
        });
      }, 280);
    },

    bossIntro: (ctx) => {
      // Low ominous rumble then rising dissonant stab
      this.toneBlip(ctx, 55, 0.35, 0.6, "sawtooth");
      this.toneBlip(ctx, 58, 0.3, 0.6, "sawtooth"); // +minor-2nd dissonance
      this.noiseBlip(ctx, 0.4, 0.15);
      setTimeout(() => {
        [110, 146, 175].forEach((f, i) => {
          setTimeout(
            () => this.toneBlip(ctx, f, 0.3, 0.25, "sawtooth"),
            i * 50,
          );
        });
      }, 400);
    },

    streak: (ctx) => {
      // Rapid ascending triad hits — feels like a fire combo
      [659, 784, 988, 1319].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.18, 0.08, "square"), i * 55);
      });
      setTimeout(() => this.noiseBlip(ctx, 0.12, 0.06), 240);
    },

    hint: (ctx) => {
      // Gentle two-tone chime — curious, non-intrusive
      this.toneBlip(ctx, 880, 0.1, 0.15, "sine");
      setTimeout(() => this.toneBlip(ctx, 1108, 0.08, 0.2, "sine"), 160);
    },

    narrationStart: (ctx) => {
      // Soft rising sine — signals voice is about to speak
      this.toneBlip(ctx, 440, 0.08, 0.08, "sine");
      setTimeout(() => this.toneBlip(ctx, 554, 0.07, 0.12, "sine"), 90);
      setTimeout(() => this.toneBlip(ctx, 659, 0.06, 0.18, "sine"), 180);
    },

    easter_egg: (ctx) => {
      // Whimsical random sequence — unexpected and delightful
      const funNotes = [1047, 880, 1175, 784, 1319, 659, 1568];
      funNotes.forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.16, 0.08, "triangle"), i * 60);
      });
      setTimeout(() => this.noiseBlip(ctx, 0.1, 0.08), 480);
    },

    save: (ctx) => {
      // Clean double-blip confirmation
      this.toneBlip(ctx, 698, 0.12, 0.1, "sine");
      setTimeout(() => this.toneBlip(ctx, 880, 0.1, 0.12, "sine"), 130);
    },

    leaderboard_entry: (ctx) => {
      // Ascending fanfare — you made the board!
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        setTimeout(() => this.toneBlip(ctx, f, 0.2, 0.16, "sine"), i * 90);
      });
      setTimeout(() => {
        [784, 988, 1175].forEach((f) =>
          this.toneBlip(ctx, f, 0.22, 0.35, "triangle"),
        );
      }, 480);
    },
  };

  // ── Private helpers ────────────────────────────────────────────────────────

  private toneBlip(
    ctx: AudioContext,
    freq: number,
    gain: number,
    duration: number,
    type: OscillatorType,
  ): void {
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain * this._volume, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.01);
    } catch {}
  }

  private noiseBlip(ctx: AudioContext, gain: number, duration: number): void {
    try {
      const bufSize = Math.ceil(ctx.sampleRate * duration);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain * this._volume, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      src.connect(g);
      g.connect(ctx.destination);
      src.start();
    } catch {}
  }

  /** Noise burst routed to an arbitrary destination gain node (for ambience). */
  private noiseBlipDirect(
    ctx: AudioContext,
    dest: GainNode,
    gain: number,
    duration: number,
  ): void {
    try {
      const bufSize = Math.ceil(ctx.sampleRate * duration);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      src.connect(g);
      g.connect(dest);
      src.start();
    } catch {}
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────
export const audioEngine = AudioEngine.getInstance();
