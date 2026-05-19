import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { BASIC_LEVELS } from "@/data/basicLevels";
import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { motion } from "motion/react";

const PLAYER_XP = 500; // TODO: connect to real XP store

const XP_THRESHOLDS = [0, 200, 600, 1200, 2200, 3500, 5200, 7500, 10500];

function getUnlockState(index: number): "unlocked" | "locked" {
  return PLAYER_XP >= XP_THRESHOLDS[index] ? "unlocked" : "locked";
}

function getProgress(index: number): number {
  // Placeholder: returns 0–100 based on completed sub-games
  if (index === 0) return 35;
  if (index === 1) return 12;
  return 0;
}

interface WorldNodeProps {
  level: (typeof BASIC_LEVELS)[number];
  index: number;
  state: "unlocked" | "locked";
  progress: number;
  onClick: () => void;
}

function WorldNode({ level, index, state, progress, onClick }: WorldNodeProps) {
  const isLocked = state === "locked";
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={!isLocked ? { scale: 1.07, y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.96 } : {}}
      onClick={!isLocked ? onClick : undefined}
      data-ocid={`basic-level.node.${index + 1}`}
      className={[
        "flex flex-col items-center gap-3 select-none",
        isLocked ? "cursor-not-allowed" : "cursor-pointer group",
      ].join(" ")}
    >
      {/* Circle node */}
      <div className="relative" style={{ width: 120, height: 120 }}>
        {/* Outer glow ring */}
        {!isLocked && (
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${level.theme.glow} 0%, transparent 70%)`,
              filter: "blur(8px)",
              transform: "scale(1.3)",
            }}
          />
        )}

        {/* SVG progress ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="oklch(0.25 0.03 260)"
            strokeWidth="4"
          />
          {!isLocked && progress > 0 && (
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={level.theme.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            />
          )}
        </svg>

        {/* Main circle */}
        <div
          className="absolute inset-2 rounded-full flex flex-col items-center justify-center"
          style={{
            background: isLocked
              ? "oklch(0.12 0.02 260)"
              : "radial-gradient(circle at 35% 35%, oklch(0.18 0.04 260), oklch(0.10 0.03 260))",
            border: `2px solid ${isLocked ? "oklch(0.25 0.03 260)" : level.theme.primary}`,
            boxShadow: !isLocked ? `0 0 20px ${level.theme.glow}` : "none",
          }}
        >
          {isLocked ? (
            <Lock className="h-7 w-7 text-muted-foreground" />
          ) : (
            <>
              <span
                className="text-2xl font-black leading-none"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: level.theme.primary,
                  textShadow: `0 0 12px ${level.theme.glow}`,
                }}
              >
                {index + 1}
              </span>
              {progress > 0 && (
                <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                  {progress}%
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-0.5"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: isLocked ? "oklch(0.4 0.03 260)" : level.theme.primary,
          }}
        >
          {level.name}
        </p>
        <p className="text-[10px] text-muted-foreground max-w-[110px] leading-snug line-clamp-2">
          {isLocked
            ? "Earn more XP to unlock"
            : level.subtitle.split("—")[0].trim()}
        </p>
      </div>
    </motion.div>
  );
}

export default function BasicLevelSelectPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen bg-background overflow-hidden"
      data-ocid="basic-level-select.page"
    >
      <ParticleBackground count={60} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,245,255,0.18) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
          data-ocid="basic-level-select.header"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-5">
            <svg
              className="h-3.5 w-3.5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 0 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
              GES Basic 1 – 9 Curriculum
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-gradient-cyan"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Choose Your World
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Select a Basic level to begin your adventure. Each world contains
            hundreds of missions, games, and discoveries across all subjects.
          </p>
        </motion.div>

        {/* 3×3 node grid */}
        <div
          className="grid grid-cols-3 gap-x-6 gap-y-12 justify-items-center max-w-3xl mx-auto"
          data-ocid="basic-level-select.grid"
        >
          {BASIC_LEVELS.map((level, index) => (
            <WorldNode
              key={level.id}
              level={level}
              index={index}
              state={getUnlockState(index)}
              progress={getProgress(index)}
              onClick={() =>
                navigate({
                  to: "/world/$levelId/subjects",
                  params: { levelId: level.id },
                })
              }
            />
          ))}
        </div>

        {/* XP hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-14 text-center"
        >
          <p className="text-[11px] text-muted-foreground tracking-wider uppercase">
            Current XP: {PLAYER_XP.toLocaleString()} — complete missions to
            unlock higher worlds
          </p>
        </motion.div>
      </div>
    </div>
  );
}
