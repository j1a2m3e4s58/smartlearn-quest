import { useAudioContext } from "@/audio/AudioProvider";
import type { RateValue } from "@/audio/NarrationEngine";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface NarrationPanelProps {
  gameId: string;
  onComplete: () => void;
  onSkip: () => void;
}

type SectionKey = "objective" | "rules" | "controls" | "tip";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "objective", label: "Objective" },
  { key: "rules", label: "Rules" },
  { key: "controls", label: "Controls" },
  { key: "tip", label: "Pro Tip" },
];

const SPEED_OPTIONS: { label: string; value: RateValue }[] = [
  { label: "0.75x", value: 0.75 },
  { label: "1x", value: 1 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
];

// ─── SVG icons ───────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
function ReplayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.96" />
    </svg>
  );
}
function SkipIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: "transform 0.25s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function LightbulbIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}
function GuideIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Floating Guide Button ────────────────────────────────────────────────────
export function FloatingGuideButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] tracking-widest uppercase"
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 40,
        background: "oklch(0.12 0.02 260 / 0.92)",
        border: "1px solid oklch(0.65 0.2 200 / 0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "oklch(0.72 0.18 200)",
        boxShadow:
          "0 0 12px oklch(0.65 0.2 200 / 0.12), 0 4px 12px rgba(0,0,0,0.4)",
        cursor: "pointer",
      }}
      aria-label="Reopen game guide"
      data-ocid="narration.guide_button"
    >
      <GuideIcon />
      Guide
    </motion.button>
  );
}

// ─── Live Subtitle Bar ────────────────────────────────────────────────────────
export function SubtitleBar({
  text,
  visible,
}: { text: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          key="subtitle-bar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 45,
            padding: "10px 24px 14px",
            background: "oklch(0.08 0.02 260 / 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid oklch(0.65 0.2 200 / 0.2)",
          }}
          data-ocid="narration.subtitle_bar"
        >
          <p
            className="text-center text-sm leading-relaxed"
            style={{ color: "oklch(0.88 0.01 255)" }}
          >
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Hints Accordion ─────────────────────────────────────────────────────────
function HintsAccordion({ hints }: { hints: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid oklch(0.65 0.22 130 / 0.3)",
        background: "oklch(0.08 0.02 260 / 0.5)",
      }}
      data-ocid="narration.hints_accordion"
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 font-bold text-xs tracking-widest uppercase transition-colors duration-150"
        style={{
          color: open ? "oklch(0.72 0.22 130)" : "oklch(0.62 0.2 130)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-expanded={open}
        data-ocid="narration.hints_toggle"
      >
        <span className="flex items-center gap-2">
          <LightbulbIcon />
          Learning Hints
        </span>
        <ChevronDownIcon open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="hints-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 flex flex-col gap-2">
              {hints.map((hint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.22 }}
                  className="flex items-start gap-3 text-xs leading-relaxed py-2 px-3 rounded-lg"
                  style={{
                    background: "oklch(0.65 0.22 130 / 0.07)",
                    color: "oklch(0.78 0.01 255)",
                    border: "1px solid oklch(0.65 0.22 130 / 0.15)",
                  }}
                  data-ocid={`narration.hint_item.${i + 1}`}
                >
                  <span
                    className="shrink-0 font-black text-[10px] rounded px-1.5 py-0.5 mt-0.5"
                    style={{
                      background: "oklch(0.65 0.22 130 / 0.2)",
                      color: "oklch(0.72 0.22 130)",
                    }}
                  >
                    {i + 1}
                  </span>
                  {hint}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function NarrationPanel({
  gameId,
  onComplete,
  onSkip,
}: NarrationPanelProps) {
  const { narration } = useAudioContext();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  const [speed, setSpeed] = useState<RateValue>(1);
  const [lang, setLang] = useState<"en-US" | "tw">("en-US");
  const [allComplete, setAllComplete] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const progressRafRef = useRef<number | null>(null);

  const gameNarration = narration.getNarration(gameId);

  // Progress bar: interpolates 0 → 100 over the estimated narration duration
  const startProgressAnim = useCallback(
    (sectionIndex: number, totalSections: number) => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      const segmentSize = 100 / totalSections;
      const baseProgress = (sectionIndex / totalSections) * 100;
      startTimeRef.current = performance.now();
      const estimatedMs = 3500; // ~3.5s per section as a reasonable estimate
      const tick = () => {
        if (!startTimeRef.current) return;
        const elapsed = performance.now() - startTimeRef.current;
        const ratio = Math.min(elapsed / estimatedMs, 1);
        setProgress(baseProgress + ratio * segmentSize);
        if (ratio < 1) progressRafRef.current = requestAnimationFrame(tick);
      };
      progressRafRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  const speakSection = useCallback(
    (
      sectionIndex: number,
      opts?: { rate?: RateValue; lang?: "en-US" | "tw" },
    ) => {
      if (!gameNarration) return;
      const section = SECTIONS[sectionIndex];
      if (!section) return;
      const text = gameNarration[section.key];
      if (!text) return;
      setIsSpeaking(true);
      setSubtitleText(text);
      startProgressAnim(sectionIndex, SECTIONS.length);
      narration.setRate(opts?.rate ?? speed);
      narration.setLang(opts?.lang ?? lang);
      narration.speak(text, {
        rate: opts?.rate ?? speed,
        lang: opts?.lang ?? lang,
        onSubtitle: setSubtitleText,
        onEnd: () => {
          setIsSpeaking(false);
          if (sectionIndex < SECTIONS.length - 1) {
            const next = sectionIndex + 1;
            setCurrentSection(next);
            setTimeout(() => speakSection(next, opts), 400);
          } else if (!completedRef.current) {
            completedRef.current = true;
            setProgress(100);
            setAllComplete(true);
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameNarration, narration, speed, lang, startProgressAnim],
  );

  useEffect(() => {
    // Allow closing after 2 seconds
    const timer = setTimeout(() => setCanClose(true), 2000);
    speakSection(0);
    return () => {
      clearTimeout(timer);
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      narration.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePlayPause() {
    if (isSpeaking) {
      narration.pause();
      setIsSpeaking(false);
    } else {
      narration.resume();
      setIsSpeaking(true);
    }
  }

  function handleReplay() {
    completedRef.current = false;
    setAllComplete(false);
    setCurrentSection(0);
    setProgress(0);
    narration.stop();
    setTimeout(() => speakSection(0), 100);
  }

  function handleSpeedChange(val: RateValue) {
    setSpeed(val);
    narration.setRate(val);
  }

  function handleLangChange(l: "en-US" | "tw") {
    setLang(l);
    narration.stop();
    completedRef.current = false;
    setAllComplete(false);
    setCurrentSection(0);
    setProgress(0);
    setTimeout(() => speakSection(0, { lang: l }), 100);
  }

  const title = gameNarration?.title ?? gameId;
  const hints = gameNarration?.hints ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "var(--narration-panel-bg, oklch(0.08 0.02 260 / 0.92))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      data-ocid="narration.panel"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-2xl rounded-2xl border overflow-hidden"
        style={{
          background: "oklch(0.12 0.02 260 / 0.98)",
          borderColor:
            "var(--narration-panel-border, oklch(0.65 0.2 200 / 0.5))",
          boxShadow:
            "0 0 60px oklch(0.65 0.2 200 / 0.15), 0 24px 48px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Narration progress bar */}
        <div style={{ height: "3px", background: "oklch(0.18 0.02 260)" }}>
          <motion.div
            style={{
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, oklch(0.65 0.2 200) 0%, oklch(0.72 0.22 280) 100%)",
              boxShadow: "0 0 8px oklch(0.65 0.2 200 / 0.6)",
              transition: "width 0.3s linear",
            }}
            data-ocid="narration.progress_bar"
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Header: title + lang pill toggle */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div
                className="text-[10px] font-bold tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.65 0.2 200)" }}
              >
                Mission Brief
              </div>
              <h2
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "oklch(0.92 0.01 255)",
                }}
              >
                {title}
              </h2>
            </div>

            {/* Language pill toggle */}
            <div
              className="flex items-center rounded-full p-0.5 shrink-0"
              style={{
                background: "oklch(0.08 0.02 260 / 0.8)",
                border: "1px solid oklch(0.3 0.05 260 / 0.5)",
              }}
              data-ocid="narration.lang_toggle"
            >
              <GlobeIcon />
              {(["en-US", "tw"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLangChange(l)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase"
                  style={{
                    transition: "all 0.2s",
                    background:
                      lang === l ? "oklch(0.65 0.2 200)" : "transparent",
                    color:
                      lang === l
                        ? "oklch(0.06 0.01 260)"
                        : "oklch(0.55 0.02 255)",
                    boxShadow:
                      lang === l ? "0 0 8px oklch(0.65 0.2 200 / 0.4)" : "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-pressed={lang === l}
                  data-ocid={`narration.lang_${l}`}
                >
                  {l === "en-US" ? "English" : "Twi"}
                </button>
              ))}
            </div>
          </div>

          {/* Section progress dots */}
          <div
            className="flex items-center gap-2 mb-5"
            data-ocid="narration.section_progress"
          >
            {SECTIONS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className="transition-all duration-300"
                  style={{
                    width: i === currentSection ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background:
                      i < currentSection
                        ? "oklch(0.65 0.2 200)"
                        : i === currentSection
                          ? "oklch(0.75 0.22 200)"
                          : "oklch(0.3 0.02 255)",
                  }}
                />
                {i === currentSection && (
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "oklch(0.65 0.2 200)" }}
                  >
                    {s.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Animated sections */}
          <div className="flex flex-col gap-3 mb-5">
            {SECTIONS.map((s, i) => {
              const text = gameNarration?.[s.key];
              if (!text) return null;
              const isActive = i === currentSection;
              const isPast = i < currentSection;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isActive || isPast ? 1 : 0.35, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: isActive
                      ? "oklch(0.65 0.2 200 / 0.08)"
                      : "oklch(0.08 0.02 260 / 0.5)",
                    border: `1px solid ${
                      isActive
                        ? "oklch(0.65 0.2 200 / 0.3)"
                        : isPast
                          ? "oklch(0.65 0.2 200 / 0.12)"
                          : "oklch(0.25 0.03 260 / 0.4)"
                    }`,
                  }}
                  data-ocid={`narration.section_${s.key}`}
                >
                  <span
                    className="text-[9px] font-black tracking-widest uppercase block mb-1"
                    style={{
                      color: isActive
                        ? "oklch(0.65 0.2 200)"
                        : "oklch(0.45 0.04 255)",
                    }}
                  >
                    {s.label}
                  </span>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.8 0.01 255)" }}
                  >
                    {text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Hints accordion */}
          {hints.length > 0 && (
            <div className="mb-5">
              <HintsAccordion hints={hints} />
            </div>
          )}

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={handlePlayPause}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: "oklch(0.65 0.2 200 / 0.18)",
                border: "1px solid oklch(0.65 0.2 200 / 0.45)",
                color: "oklch(0.75 0.18 200)",
                cursor: "pointer",
              }}
              aria-label={isSpeaking ? "Pause narration" : "Play narration"}
              data-ocid="narration.play_pause_button"
            >
              {isSpeaking ? <PauseIcon /> : <PlayIcon />}
              {isSpeaking ? "Pause" : "Play"}
            </button>

            {/* Replay */}
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: "oklch(0.55 0.18 280 / 0.18)",
                border: "1px solid oklch(0.55 0.18 280 / 0.45)",
                color: "oklch(0.72 0.18 280)",
                cursor: "pointer",
              }}
              aria-label="Replay narration from beginning"
              data-ocid="narration.replay_button"
            >
              <ReplayIcon />
              Replay
            </button>

            {/* Speed selector */}
            <div
              className="flex items-center gap-0.5 rounded-lg p-0.5"
              style={{
                background: "oklch(0.08 0.02 260 / 0.8)",
                border: "1px solid oklch(0.3 0.05 260 / 0.4)",
              }}
              role="group"
              aria-label="Narration speed"
              data-ocid="narration.speed_selector"
            >
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSpeedChange(opt.value)}
                  className="px-2 py-1 rounded text-[10px] font-bold transition-all duration-150"
                  style={{
                    background:
                      speed === opt.value
                        ? "oklch(0.65 0.2 200 / 0.25)"
                        : "transparent",
                    color:
                      speed === opt.value
                        ? "oklch(0.65 0.2 200)"
                        : "oklch(0.55 0.02 255)",
                    border:
                      speed === opt.value
                        ? "1px solid oklch(0.65 0.2 200 / 0.4)"
                        : "1px solid transparent",
                    cursor: "pointer",
                  }}
                  aria-pressed={speed === opt.value}
                  data-ocid={`narration.speed_${String(opt.value).replace(".", "_")}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Skip — available immediately */}
            <button
              type="button"
              onClick={() => {
                narration.stop();
                onSkip();
              }}
              className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-all duration-200"
              style={{
                background: "transparent",
                border: "1px solid oklch(0.35 0.04 255 / 0.5)",
                color: "oklch(0.5 0.02 255)",
                cursor: "pointer",
              }}
              aria-label="Skip narration and start game"
              data-ocid="narration.skip_button"
            >
              <SkipIcon />
              Skip
            </button>
          </div>

          {/* Continue button — only after canClose (2s) AND narration complete */}
          <AnimatePresence>
            {allComplete && canClose && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    narration.stop();
                    onComplete();
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-black tracking-widest uppercase text-sm transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.2 200 / 0.3) 0%, oklch(0.55 0.18 280 / 0.3) 100%)",
                    border: "1px solid oklch(0.65 0.2 200 / 0.6)",
                    color: "oklch(0.85 0.15 200)",
                    boxShadow: "0 0 20px oklch(0.65 0.2 200 / 0.2)",
                    cursor: "pointer",
                  }}
                  data-ocid="narration.continue_button"
                >
                  Start Mission
                  <ChevronRightIcon />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close available after 2s even if narration still going */}
          <AnimatePresence>
            {canClose && !allComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 text-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    narration.stop();
                    onSkip();
                  }}
                  className="text-[11px] font-bold tracking-widest uppercase transition-colors duration-150"
                  style={{
                    color: "oklch(0.4 0.02 255)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  data-ocid="narration.dismiss_button"
                >
                  Skip and start now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
