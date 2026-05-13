import {
  Award,
  CheckCircle,
  Crown,
  Flame,
  Keyboard,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface AchievementBadgeProps {
  achievementId?: string;
  id?: string;
  name: string;
  description?: string;
  unlocked: boolean;
  icon?: ReactNode;
  animate?: boolean;
  "data-ocid"?: string;
}

const ACHIEVEMENT_ICONS: Record<string, ReactNode> = {
  "first-login": <CheckCircle className="h-5 w-5" />,
  "first-game": <Star className="h-5 w-5" />,
  "score-1000": <Target className="h-5 w-5" />,
  "streak-3": <Flame className="h-5 w-5" />,
  "streak-7": <Zap className="h-5 w-5" />,
  "level-5": <Award className="h-5 w-5" />,
  "level-10": <Crown className="h-5 w-5" />,
  "hub-complete": <Shield className="h-5 w-5" />,
  "perfect-game": <Trophy className="h-5 w-5" />,
  "speed-typist": <Keyboard className="h-5 w-5" />,
};

const ACHIEVEMENT_COLORS: Record<string, string> = {
  "first-login": "var(--color-cyan)",
  "first-game": "var(--color-cyan)",
  "score-1000": "var(--color-cyan)",
  "streak-3": "var(--color-gold)",
  "streak-7": "var(--color-gold)",
  "level-5": "var(--color-purple)",
  "level-10": "var(--color-purple)",
  "hub-complete": "var(--color-emerald)",
  "perfect-game": "var(--color-gold)",
  "speed-typist": "var(--color-cyan)",
};

export function AchievementBadge({
  achievementId,
  id,
  name,
  description,
  unlocked,
  icon,
  animate = false,
  "data-ocid": dataOcid,
}: AchievementBadgeProps) {
  const resolvedId = achievementId ?? id ?? "";
  const accentColor = ACHIEVEMENT_COLORS[resolvedId] ?? "var(--color-cyan)";
  const resolvedIcon = icon ?? ACHIEVEMENT_ICONS[resolvedId] ?? (
    <Trophy className="h-5 w-5" />
  );

  return (
    <motion.div
      initial={
        animate
          ? { scale: 0.5, opacity: 0 }
          : { scale: 1, opacity: unlocked ? 1 : 0.45 }
      }
      animate={{ scale: 1, opacity: unlocked ? 1 : 0.45 }}
      whileHover={unlocked ? { scale: 1.06 } : undefined}
      transition={
        animate
          ? { type: "spring", stiffness: 320, damping: 22 }
          : { duration: 0.35 }
      }
      className={[
        "flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-smooth cursor-default select-none",
        unlocked
          ? "glass-card border-white/10"
          : "bg-muted/20 border-border/20 grayscale",
      ].join(" ")}
      style={unlocked ? { boxShadow: `0 0 16px ${accentColor}33` } : undefined}
      data-ocid={dataOcid}
    >
      <div
        className="relative w-12 h-12 flex items-center justify-center"
        style={{
          clipPath:
            "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          background: unlocked
            ? `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`
            : "rgba(255,255,255,0.04)",
        }}
      >
        {unlocked && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              background: `radial-gradient(circle at center, ${accentColor}22 0%, transparent 70%)`,
            }}
          />
        )}
        <span
          style={{
            color: unlocked ? accentColor : "rgba(255,255,255,0.25)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {resolvedIcon}
        </span>
      </div>

      <div className="min-w-0 w-full">
        <p
          className="text-xs font-bold truncate"
          style={{
            color: unlocked ? accentColor : "rgba(255,255,255,0.3)",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {name}
        </p>
        {description && (
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
            {description}
          </p>
        )}
        {unlocked && (
          <span
            className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-widest"
            style={{ color: accentColor, opacity: 0.75 }}
          >
            Unlocked
          </span>
        )}
      </div>
    </motion.div>
  );
}
