import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { audioEngine } from "./AudioEngine";
import type { EffectId } from "./AudioEngine";
import { narrationEngine } from "./NarrationEngine";

interface AudioContextValue {
  playEffect: (id: EffectId) => void;
  playAmbience: (context: string) => void;
  stopAmbience: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (v: number) => void;
  narration: typeof narrationEngine;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudioContext(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx)
    throw new Error("useAudioContext must be used within AudioProvider");
  return ctx;
}

const CONTEXT_TRACK_MAP: Record<string, string> = {
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
};

// SVG icons — no emoji
function SpeakerOnIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  const playEffect = useCallback((id: EffectId) => {
    audioEngine.init();
    audioEngine.playEffect(id);
  }, []);

  const playAmbience = useCallback((context: string) => {
    const key = context.toLowerCase().replace(/[^a-z-]/g, "");
    const trackId = (CONTEXT_TRACK_MAP[key] ?? "menu") as Parameters<
      typeof audioEngine.play
    >[0];
    audioEngine.init();
    audioEngine.play(trackId);
  }, []);

  const stopAmbience = useCallback(() => {
    audioEngine.stop();
  }, []);

  const toggleMute = useCallback(() => {
    audioEngine.init();
    if (audioEngine.isMuted) {
      audioEngine.unmute();
      setIsMuted(false);
    } else {
      audioEngine.mute();
      setIsMuted(true);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    audioEngine.init();
    audioEngine.setVolume(v);
    setVolumeState(v);
  }, []);

  const value: AudioContextValue = {
    playEffect,
    playAmbience,
    stopAmbience,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    narration: narrationEngine,
  };

  return (
    <AudioCtx.Provider value={value}>
      {children}

      {/* Fixed audio control widget */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
        data-ocid="audio.widget"
      >
        {/* Floating control panel */}
        {panelOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "52px",
              right: 0,
              width: "220px",
              background: "oklch(0.12 0.02 260 / 0.95)",
              border: "1px solid oklch(0.65 0.2 200 / 0.35)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "12px",
              padding: "16px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 16px oklch(0.65 0.2 200 / 0.12)",
            }}
            data-ocid="audio.panel"
          >
            {/* Panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "oklch(0.65 0.2 200)",
                }}
              >
                Audio Control
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close audio panel"
                data-ocid="audio.close_button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "oklch(0.55 0.025 255)",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Volume label + value */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "12px", color: "oklch(0.75 0.01 255)" }}>
                Volume
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "oklch(0.65 0.2 200)",
                  fontFamily: "monospace",
                }}
              >
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Volume slider */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Master volume"
              data-ocid="audio.volume_slider"
              style={{
                width: "100%",
                accentColor: "oklch(0.65 0.2 200)",
                cursor: "pointer",
                marginBottom: "14px",
              }}
            />

            {/* Mute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              data-ocid="audio.mute_toggle"
              aria-pressed={isMuted}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "8px 0",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
                background: isMuted
                  ? "oklch(0.62 0.22 25 / 0.18)"
                  : "oklch(0.65 0.2 200 / 0.15)",
                border: `1px solid ${isMuted ? "oklch(0.62 0.22 25 / 0.5)" : "oklch(0.65 0.2 200 / 0.4)"}`,
                color: isMuted ? "oklch(0.72 0.22 25)" : "oklch(0.65 0.2 200)",
              }}
            >
              {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
              {isMuted ? "Unmute" : "Mute All Audio"}
            </button>
          </div>
        )}

        {/* Main toggle button */}
        <button
          type="button"
          onClick={() => {
            audioEngine.init();
            setPanelOpen((p) => !p);
            audioEngine.playEffect("click");
          }}
          aria-label={
            panelOpen ? "Close audio settings" : "Open audio settings"
          }
          aria-expanded={panelOpen}
          data-ocid="audio.toggle_button"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "oklch(0.12 0.02 260 / 0.9)",
            border: `1px solid oklch(0.65 0.2 200 / ${panelOpen ? "0.6" : "0.3"})`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isMuted ? "oklch(0.55 0.025 255)" : "oklch(0.65 0.2 200)",
            boxShadow: panelOpen
              ? "0 0 16px oklch(0.65 0.2 200 / 0.35), 0 4px 12px rgba(0,0,0,0.4)"
              : "0 4px 12px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.2s, border-color 0.2s, color 0.2s",
          }}
        >
          {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
        </button>
      </div>
    </AudioCtx.Provider>
  );
}

export type { AudioContextValue };
