import type { GameNarration } from "./gameNarrations";
import { GAME_NARRATIONS } from "./gameNarrations";

type NarrationField = "title" | "objective" | "rules" | "controls" | "tip";

interface SpeakOptions {
  rate?: number;
  lang?: "en-US" | "tw";
  onEnd?: () => void;
  onSubtitle?: (text: string) => void;
}

type RateValue = 0.75 | 1 | 1.25 | 1.5;

class NarrationEngine {
  private static instance: NarrationEngine;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private _rate: RateValue = 1;
  private _lang: "en-US" | "tw" = "en-US";
  private endCallbacks: Array<() => void> = [];
  private available = false;
  private _isPlaying = false;

  static getInstance(): NarrationEngine {
    if (!NarrationEngine.instance)
      NarrationEngine.instance = new NarrationEngine();
    return NarrationEngine.instance;
  }

  private constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.available = true;
    }
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  speak(text: string, options: SpeakOptions = {}): void {
    if (!this.available || !this.synth) return;
    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? this._rate;
    utterance.lang = options.lang === "tw" ? "ak" : "en-US";
    utterance.volume = 1;
    utterance.pitch = 1.05;

    const voices = this.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("karen") ||
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("natural")),
    );
    if (preferred) utterance.voice = preferred;

    this._isPlaying = true;

    utterance.onend = () => {
      this._isPlaying = false;
      options.onEnd?.();
      this.endCallbacks.forEach((cb) => cb());
      this.endCallbacks = [];
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this._isPlaying = false;
      this.currentUtterance = null;
    };

    options.onSubtitle?.(text);

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  speakGame(
    gameId: string,
    fields: NarrationField[] = ["objective", "rules", "controls", "tip"],
    options: SpeakOptions = {},
  ): void {
    const narration = GAME_NARRATIONS[gameId];
    if (!narration) return;
    const texts = fields.map((f) => narration[f]).filter(Boolean);
    const combined = texts.join(" ... ");
    this.speak(combined, options);
  }

  /**
   * Reads hints one by one with a natural pause between them.
   */
  speakHints(hints: string[], options: SpeakOptions = {}, index = 0): void {
    if (index >= hints.length) {
      options.onEnd?.();
      return;
    }
    const hint = hints[index];
    if (!hint) {
      this.speakHints(hints, options, index + 1);
      return;
    }
    this.speak(`Hint ${index + 1}. ${hint}`, {
      rate: options.rate ?? this._rate,
      lang: options.lang ?? this._lang,
      onSubtitle: options.onSubtitle,
      onEnd: () => {
        setTimeout(() => this.speakHints(hints, options, index + 1), 600);
      },
    });
  }

  /**
   * Generates a welcome narration when entering a new world or level.
   */
  speakWorldWelcome(
    worldName: string,
    levelName: string,
    options: SpeakOptions = {},
  ): void {
    const text = `Welcome to ${worldName}. You have entered ${levelName}. Explore the missions, complete challenges, and unlock new skills. Your learning journey begins now. Good luck.`;
    this.speak(text, options);
  }

  getNarration(gameId: string): GameNarration | null {
    return GAME_NARRATIONS[gameId] ?? null;
  }

  stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this._isPlaying = false;
    this.currentUtterance = null;
  }

  pause(): void {
    this.synth?.pause();
    this._isPlaying = false;
  }

  resume(): void {
    this.synth?.resume();
    this._isPlaying = true;
  }

  setRate(rate: RateValue): void {
    this._rate = rate;
  }

  setLang(lang: "en-US" | "tw"): void {
    this._lang = lang;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  onEnd(callback: () => void): void {
    this.endCallbacks.push(callback);
  }
}

export const narrationEngine = NarrationEngine.getInstance();
export type { SpeakOptions, NarrationField, RateValue };
