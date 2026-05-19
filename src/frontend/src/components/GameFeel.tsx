import {
  AnimatePresence,
  type TargetAndTransition,
  motion,
} from "motion/react";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ParticleType = "correct" | "wrong" | "combo" | "achievement";
type MascotReaction = "correct" | "wrong" | "levelup" | "warning" | "idle";

interface Particle {
  id: number;
  x: number;
  y: number;
  type: ParticleType;
}

interface ComboDisplay {
  id: number;
  count: number;
}

interface AchievementDisplay {
  id: number;
  text: string;
}

interface StreakDisplay {
  id: number;
  count: number;
}

interface CinematicOverlay {
  type: "levelup" | "worldunlock" | "bossintro";
  label: string;
}

interface GameFeelContextValue {
  triggerShake: () => void;
  triggerParticle: (x: number, y: number, type: ParticleType) => void;
  triggerCombo: (count: number) => void;
  triggerAchievement: (text: string) => void;
  triggerCinematicIn: () => void;
  triggerCinematicOut: () => void;
  triggerMascotReaction: (type: MascotReaction) => void;
  triggerLevelUp: () => void;
  triggerWorldUnlock: (worldName: string) => void;
  triggerBossIntro: (bossName: string) => void;
  triggerStreak: (count: number) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const GameFeelCtx = createContext<GameFeelContextValue | null>(null);

export function useGameFeel(): GameFeelContextValue {
  const ctx = useContext(GameFeelCtx);
  if (!ctx) throw new Error("useGameFeel must be used within GameFeelProvider");
  return ctx;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PARTICLE_COLORS: Record<ParticleType, string> = {
  correct: "oklch(0.78 0.2 190)",
  wrong: "oklch(0.62 0.22 25)",
  combo: "oklch(0.72 0.18 280)",
  achievement: "oklch(0.82 0.2 85)",
};

const PARTICLE_GLOW: Record<ParticleType, string> = {
  correct: "0 0 8px oklch(0.78 0.2 190 / 0.8)",
  wrong: "0 0 8px oklch(0.62 0.22 25 / 0.8)",
  combo: "0 0 8px oklch(0.72 0.18 280 / 0.8)",
  achievement: "0 0 8px oklch(0.82 0.2 85 / 0.8)",
};

let uidCounter = 0;
function uid() {
  return ++uidCounter;
}

// ─── NPC Mascot SVG ──────────────────────────────────────────────────────────

const MASCOT_VARIANTS: Record<MascotReaction, Record<string, unknown>> = {
  idle: {
    y: [0, -6, 0],
    transition: {
      duration: 2.8,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
  correct: {
    y: [0, -18, 0, -10, 0],
    transition: { duration: 0.6, times: [0, 0.3, 0.55, 0.75, 1] },
  },
  wrong: {
    x: [0, -6, 6, -4, 4, 0],
    y: [0, 4, 4, 2, 2, 0],
    transition: { duration: 0.5 },
  },
  levelup: {
    rotate: [0, 360],
    scale: [1, 1.3, 1],
    transition: { duration: 0.7, ease: "backOut" },
  },
  warning: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4 },
  },
};

function MascotSVG() {
  return (
    <svg
      width="72"
      height="92"
      viewBox="0 0 72 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        cx="36"
        cy="88"
        rx="20"
        ry="4"
        fill="oklch(0.55 0.2 194 / 0.25)"
      />
      <rect
        x="18"
        y="44"
        width="36"
        height="28"
        rx="8"
        fill="oklch(0.14 0.025 265)"
        stroke="oklch(0.65 0.2 194 / 0.6)"
        strokeWidth="1.5"
      />
      <rect
        x="25"
        y="51"
        width="22"
        height="14"
        rx="4"
        fill="oklch(0.09 0.018 265)"
        stroke="oklch(0.55 0.18 194 / 0.4)"
        strokeWidth="1"
      />
      <circle cx="30" cy="58" r="2.5" fill="oklch(0.78 0.2 190)" />
      <circle cx="36" cy="58" r="2.5" fill="oklch(0.76 0.14 60)" />
      <circle cx="42" cy="58" r="2.5" fill="oklch(0.72 0.18 280)" />
      <rect
        x="20"
        y="16"
        width="32"
        height="28"
        rx="10"
        fill="oklch(0.16 0.028 265)"
        stroke="oklch(0.65 0.2 194 / 0.7)"
        strokeWidth="1.5"
      />
      <line
        x1="36"
        y1="16"
        x2="36"
        y2="7"
        stroke="oklch(0.55 0.18 194 / 0.8)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="36" cy="5" r="3" fill="oklch(0.78 0.2 190)" />
      <rect
        x="25"
        y="24"
        width="8"
        height="5"
        rx="2"
        fill="oklch(0.78 0.2 190)"
      />
      <rect
        x="39"
        y="24"
        width="8"
        height="5"
        rx="2"
        fill="oklch(0.78 0.2 190)"
      />
      <rect
        x="27"
        y="36"
        width="18"
        height="3"
        rx="1.5"
        fill="oklch(0.55 0.18 194 / 0.6)"
      />
      <rect
        x="8"
        y="46"
        width="10"
        height="20"
        rx="5"
        fill="oklch(0.14 0.025 265)"
        stroke="oklch(0.55 0.18 194 / 0.5)"
        strokeWidth="1.5"
      />
      <rect
        x="54"
        y="46"
        width="10"
        height="20"
        rx="5"
        fill="oklch(0.14 0.025 265)"
        stroke="oklch(0.55 0.18 194 / 0.5)"
        strokeWidth="1.5"
      />
      <rect
        x="22"
        y="70"
        width="10"
        height="18"
        rx="5"
        fill="oklch(0.14 0.025 265)"
        stroke="oklch(0.55 0.18 194 / 0.5)"
        strokeWidth="1.5"
      />
      <rect
        x="40"
        y="70"
        width="10"
        height="18"
        rx="5"
        fill="oklch(0.14 0.025 265)"
        stroke="oklch(0.55 0.18 194 / 0.5)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Cinematic Overlays ───────────────────────────────────────────────────────

function CinematicLevelUp() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9950,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.04 0.02 265 / 0.96)",
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        exit={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "3px solid oklch(0.78 0.2 190 / 0.7)",
          boxShadow:
            "0 0 60px oklch(0.78 0.2 190 / 0.4), inset 0 0 60px oklch(0.78 0.2 190 / 0.15)",
        }}
      />
      {[-80, 80].map((offset) => (
        <motion.div
          key={offset}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            position: "absolute",
            top: `calc(50% + ${offset}px)`,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.78 0.2 190 / 0.5), transparent)",
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.1, opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "backOut" }}
        style={{
          fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
          fontSize: "clamp(3rem, 10vw, 6rem)",
          fontWeight: 900,
          letterSpacing: "0.12em",
          color: "oklch(0.88 0.1 85)",
          textShadow:
            "0 0 40px oklch(0.78 0.2 190 / 0.8), 0 0 80px oklch(0.78 0.2 190 / 0.4)",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        LEVEL UP
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{
          marginTop: "16px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1rem",
          letterSpacing: "0.3em",
          color: "oklch(0.78 0.2 190 / 0.8)",
          textTransform: "uppercase",
        }}
      >
        New abilities unlocked
      </motion.div>
    </motion.div>
  );
}

function CinematicWorldUnlock({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9950,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.04 0.025 290 / 0.97)",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {[0.4, 0.7, 1.0].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.2, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: `2px solid oklch(0.72 0.18 280 / ${0.6 - i * 0.15})`,
          }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05, y: -20 }}
        transition={{ duration: 0.55, delay: 0.2, ease: "backOut" }}
        style={{
          fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
          fontSize: "clamp(1.5rem, 6vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "0.1em",
          color: "oklch(0.92 0.08 290)",
          textShadow:
            "0 0 30px oklch(0.72 0.18 280 / 0.8), 0 0 70px oklch(0.72 0.18 280 / 0.4)",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {label}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        style={{
          marginTop: "12px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.85rem",
          letterSpacing: "0.35em",
          color: "oklch(0.72 0.18 280 / 0.7)",
          textTransform: "uppercase",
        }}
      >
        World Unlocked
      </motion.div>
    </motion.div>
  );
}

function CinematicBossIntro({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9950,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.04 0.018 20 / 0.98)",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(180deg, oklch(0.08 0.02 20) 0%, oklch(0.06 0.015 265) 100%)",
          borderBottom: "2px solid oklch(0.62 0.22 25 / 0.6)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.45em",
            color: "oklch(0.62 0.22 25 / 0.8)",
            textTransform: "uppercase",
          }}
        >
          Boss Encounter
        </span>
      </motion.div>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(0deg, oklch(0.08 0.02 20) 0%, oklch(0.06 0.015 265) 100%)",
          borderTop: "2px solid oklch(0.62 0.22 25 / 0.6)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
        style={{
          fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
          fontSize: "clamp(2rem, 8vw, 5rem)",
          fontWeight: 900,
          letterSpacing: "0.08em",
          color: "oklch(0.88 0.15 25)",
          textShadow:
            "0 0 40px oklch(0.62 0.22 25 / 0.9), 0 0 80px oklch(0.62 0.22 25 / 0.4)",
          textTransform: "uppercase",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GameFeelProvider({ children }: { children: React.ReactNode }) {
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [combos, setCombos] = useState<ComboDisplay[]>([]);
  const [achievements, setAchievements] = useState<AchievementDisplay[]>([]);
  const [cinematicIn, setCinematicIn] = useState(false);
  const [cinematicOut, setCinematicOut] = useState(false);
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>("idle");
  const [cinematic, setCinematic] = useState<CinematicOverlay | null>(null);
  const [streaks, setStreaks] = useState<StreakDisplay[]>([]);

  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mascotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cinematicTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Existing API ───────────────────────────────────────────────────────────

  const triggerShake = useCallback(() => {
    setShake(true);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => setShake(false), 500);
  }, []);

  const triggerParticle = useCallback(
    (x: number, y: number, type: ParticleType) => {
      const batch: Particle[] = Array.from({ length: 8 }, () => ({
        id: uid(),
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        type,
      }));
      setParticles((prev) => [...prev, ...batch]);
      setTimeout(() => {
        const ids = new Set(batch.map((p) => p.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, 900);
    },
    [],
  );

  const triggerCombo = useCallback((count: number) => {
    const id = uid();
    setCombos((prev) => [...prev, { id, count }]);
    setTimeout(
      () => setCombos((prev) => prev.filter((c) => c.id !== id)),
      1200,
    );
  }, []);

  const triggerAchievement = useCallback((text: string) => {
    const id = uid();
    setAchievements((prev) => [...prev, { id, text }]);
    setTimeout(
      () => setAchievements((prev) => prev.filter((a) => a.id !== id)),
      3000,
    );
  }, []);

  const triggerCinematicIn = useCallback(() => {
    setCinematicIn(true);
    setTimeout(() => setCinematicIn(false), 700);
  }, []);

  const triggerCinematicOut = useCallback(() => {
    setCinematicOut(true);
    setTimeout(() => setCinematicOut(false), 700);
  }, []);

  // ── New API ────────────────────────────────────────────────────────────────

  const triggerMascotReaction = useCallback((type: MascotReaction) => {
    setMascotReaction(type);
    if (mascotTimerRef.current) clearTimeout(mascotTimerRef.current);
    if (type !== "idle") {
      mascotTimerRef.current = setTimeout(
        () => setMascotReaction("idle"),
        1200,
      );
    }
  }, []);

  const showCinematic = useCallback(
    (overlay: CinematicOverlay, durationMs: number) => {
      if (cinematicTimerRef.current) clearTimeout(cinematicTimerRef.current);
      setCinematic(overlay);
      cinematicTimerRef.current = setTimeout(
        () => setCinematic(null),
        durationMs,
      );
    },
    [],
  );

  const triggerLevelUp = useCallback(() => {
    showCinematic({ type: "levelup", label: "LEVEL UP" }, 2500);
    triggerMascotReaction("levelup");
  }, [showCinematic, triggerMascotReaction]);

  const triggerWorldUnlock = useCallback(
    (worldName: string) => {
      showCinematic({ type: "worldunlock", label: worldName }, 3000);
    },
    [showCinematic],
  );

  const triggerBossIntro = useCallback(
    (bossName: string) => {
      showCinematic({ type: "bossintro", label: bossName }, 3000);
    },
    [showCinematic],
  );

  const triggerStreak = useCallback((count: number) => {
    if (count < 3) return;
    const id = uid();
    setStreaks((prev) => [...prev.slice(-2), { id, count }]);
    setTimeout(
      () => setStreaks((prev) => prev.filter((s) => s.id !== id)),
      2000,
    );
  }, []);

  const value: GameFeelContextValue = {
    triggerShake,
    triggerParticle,
    triggerCombo,
    triggerAchievement,
    triggerCinematicIn,
    triggerCinematicOut,
    triggerMascotReaction,
    triggerLevelUp,
    triggerWorldUnlock,
    triggerBossIntro,
    triggerStreak,
  };

  const streakColor = (count: number) => {
    if (count >= 10) return "oklch(0.82 0.2 85)";
    if (count >= 7) return "oklch(0.76 0.14 60)";
    return "oklch(0.72 0.18 280)";
  };

  return (
    <GameFeelCtx.Provider value={value}>
      <div
        className={shake ? "screen-shake" : ""}
        style={{ position: "relative", width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {children}
      </div>

      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-rise"
          aria-hidden="true"
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: PARTICLE_COLORS[p.type],
            boxShadow: PARTICLE_GLOW[p.type],
            pointerEvents: "none",
            zIndex: 9000,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {combos.map((c) => (
        <div
          key={c.id}
          className="combo-pulse"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2rem, 8vw, 5rem)",
            fontWeight: 900,
            color: PARTICLE_COLORS.combo,
            textShadow: `0 0 30px ${PARTICLE_COLORS.combo}`,
            pointerEvents: "none",
            zIndex: 9001,
            letterSpacing: "0.05em",
          }}
        >
          {c.count}x COMBO
        </div>
      ))}

      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 9002,
          pointerEvents: "none",
        }}
        aria-live="polite"
      >
        {achievements.map((a) => (
          <div
            key={a.id}
            className="achievement-bounce"
            style={{
              background: "oklch(0.12 0.02 260 / 0.95)",
              border: "1px solid oklch(0.82 0.2 85 / 0.7)",
              borderRadius: "12px",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow:
                "0 0 24px oklch(0.82 0.2 85 / 0.3), 0 8px 24px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              maxWidth: "280px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: PARTICLE_COLORS.achievement,
                boxShadow: PARTICLE_GLOW.achievement,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "oklch(0.88 0.12 85)",
                textTransform: "uppercase",
              }}
            >
              {a.text}
            </span>
          </div>
        ))}
      </div>

      {/* Streak indicator */}
      <AnimatePresence>
        {streaks.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 0.35, ease: "backOut" }}
            style={{
              position: "fixed",
              top: "50%",
              right: "24px",
              transform: "translateY(-50%)",
              zIndex: 9010,
              pointerEvents: "none",
              fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
              fontSize: `clamp(1rem, ${Math.min(1.2 + (s.count - 3) * 0.12, 2)}rem, 2rem)`,
              fontWeight: 900,
              color: streakColor(s.count),
              textShadow: `0 0 20px ${streakColor(s.count)}`,
              letterSpacing: "0.06em",
              background: "oklch(0.08 0.02 265 / 0.85)",
              border: `1px solid ${streakColor(s.count)}4d`,
              borderRadius: "10px",
              padding: "8px 16px",
              backdropFilter: "blur(10px)",
            }}
            aria-live="assertive"
          >
            {s.count}x Streak!
          </motion.div>
        ))}
      </AnimatePresence>

      {/* NPC Mascot */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9020,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <motion.div
          animate={MASCOT_VARIANTS[mascotReaction] as TargetAndTransition}
          key={mascotReaction}
        >
          <MascotSVG />
        </motion.div>
        <AnimatePresence>
          {mascotReaction !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                bottom: "90px",
                left: "78px",
                background: "oklch(0.12 0.02 265 / 0.95)",
                border: "1px solid oklch(0.65 0.2 194 / 0.5)",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "oklch(0.88 0.12 194)",
                whiteSpace: "nowrap",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)",
              }}
            >
              {mascotReaction === "correct" && "Correct!"}
              {mascotReaction === "wrong" && "Try again"}
              {mascotReaction === "levelup" && "Level Up!"}
              {mascotReaction === "warning" && "Be careful!"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic overlays */}
      <AnimatePresence>
        {cinematic?.type === "levelup" && <CinematicLevelUp key="levelup" />}
        {cinematic?.type === "worldunlock" && (
          <CinematicWorldUnlock key="worldunlock" label={cinematic.label} />
        )}
        {cinematic?.type === "bossintro" && (
          <CinematicBossIntro key="bossintro" label={cinematic.label} />
        )}
      </AnimatePresence>

      {/* Legacy cinematic fades */}
      {cinematicIn && (
        <div
          className="cinematic-fade-in"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(0 0 0)",
            pointerEvents: "none",
            zIndex: 9900,
          }}
        />
      )}
      {cinematicOut && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(0 0 0)",
            pointerEvents: "none",
            zIndex: 9900,
            animation: "cinematic-fade-in 0.7s ease reverse forwards",
          }}
        />
      )}
    </GameFeelCtx.Provider>
  );
}
