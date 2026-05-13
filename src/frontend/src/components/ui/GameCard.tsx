import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { ProgressRing } from "./ProgressRing";

interface GameCardProps {
  title: string;
  description: string;
  unlocked: boolean;
  completionPercent: number;
  color?: string;
  onClick?: () => void;
  badge?: string;
  "data-ocid"?: string;
}

export function GameCard({
  title,
  description,
  unlocked,
  completionPercent,
  color = "#00f5ff",
  onClick,
  badge,
  "data-ocid": ocid,
}: GameCardProps) {
  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.02, y: -2 } : undefined}
      whileTap={unlocked ? { scale: 0.98 } : undefined}
      onClick={unlocked ? onClick : undefined}
      data-ocid={ocid}
      className={[
        "glass-card rounded-xl p-4 border transition-smooth relative overflow-hidden",
        unlocked
          ? "cursor-pointer hover:border-primary/40 hover:shadow-glow-cyan"
          : "opacity-60 cursor-not-allowed border-border/30",
      ].join(" ")}
    >
      {/* Top stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      <div className="flex items-start gap-3">
        {/* Progress Ring */}
        <div className="shrink-0">
          {unlocked ? (
            <ProgressRing
              percent={completionPercent}
              size={52}
              strokeWidth={4}
              color={color}
            />
          ) : (
            <div className="w-13 h-13 flex items-center justify-center">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-sm text-foreground truncate">
              {title}
            </h3>
            {badge && (
              <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Play indicator */}
          <div className="mt-2">
            {unlocked ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase"
                style={{ color }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full animate-glow-pulse"
                  style={{ backgroundColor: color }}
                />
                Play
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase">
                Locked
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
