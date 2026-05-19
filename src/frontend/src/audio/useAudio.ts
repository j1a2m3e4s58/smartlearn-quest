import { useCallback, useEffect, useRef, useState } from "react";
import { audioEngine } from "./AudioEngine";
import type { EffectId, TrackId } from "./AudioEngine";

const CONTEXT_TRACKS: Record<string, TrackId> = {
  menu: "menu",
  "world-map": "menu",
  login: "menu",
  onboarding: "menu",
  ict: "ict",
  math: "math",
  mathematics: "math",
  science: "science",
  english: "english",
  robotics: "robotics",
  critical: "critical",
  "critical-thinking": "critical",
  victory: "victory",
  defeat: "defeat",
  boss: "boss",
  results: "victory",
  default: "menu",
};

export function useAudio() {
  const [isMuted, setIsMuted] = useState(audioEngine.isMuted);
  const [volume, setVolumeState] = useState(audioEngine.volume);

  const play = useCallback((trackId: TrackId) => {
    audioEngine.init();
    audioEngine.play(trackId);
  }, []);

  const stop = useCallback(() => {
    audioEngine.stop();
  }, []);

  const playEffect = useCallback((effectId: EffectId) => {
    audioEngine.init();
    audioEngine.playEffect(effectId);
  }, []);

  const setVolume = useCallback((vol: number) => {
    audioEngine.setVolume(vol);
    setVolumeState(vol);
  }, []);

  const mute = useCallback(() => {
    audioEngine.mute();
    setIsMuted(true);
  }, []);

  const unmute = useCallback(() => {
    audioEngine.unmute();
    setIsMuted(false);
  }, []);

  return { play, stop, playEffect, setVolume, mute, unmute, isMuted, volume };
}

export function useAmbience(context: string) {
  const trackRef = useRef<TrackId | null>(null);

  useEffect(() => {
    const key = context.toLowerCase().replace(/[^a-z-]/g, "");
    const trackId: TrackId =
      (CONTEXT_TRACKS[key] as TrackId | undefined) ??
      (CONTEXT_TRACKS.default as TrackId);

    if (trackRef.current !== trackId) {
      trackRef.current = trackId;
      audioEngine.init();
      audioEngine.play(trackId);
    }
  }, [context]);
}

export type { TrackId, EffectId };
