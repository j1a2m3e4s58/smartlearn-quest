import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

interface XPBarProps {
  level: number;
  currentXP: number;
  xpToNext: number;
  totalXP?: number;
  className?: string;
}

function AnimatedCounter({
  target,
  duration = 1.2,
}: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString();
        }
      },
    });
    return () => controls.stop();
  }, [target, duration, motionVal]);

  return <span ref={ref}>0</span>;
}

export function XPBar({
  level,
  currentXP,
  xpToNext,
  totalXP,
  className = "",
}: XPBarProps) {
  const percent = Math.min((currentXP / Math.max(xpToNext, 1)) * 100, 100);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Hexagonal level badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center"
            style={{
              clipPath:
                "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              background:
                "linear-gradient(135deg, rgba(0,245,255,0.25), rgba(0,245,255,0.06))",
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{
                duration: 2.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at center, rgba(0,245,255,0.3) 0%, transparent 70%)",
                clipPath:
                  "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            />
            <div
              className="flex flex-col items-center leading-none"
              style={{ position: "relative", zIndex: 1 }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  color: "rgba(0,245,255,0.6)",
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                LVL
              </span>
              <span
                className="text-lg font-black leading-tight"
                style={{
                  color: "var(--color-cyan)",
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: "0 0 12px rgba(0,245,255,0.8)",
                }}
              >
                {level}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: "var(--color-cyan)",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              Experience
            </p>
            {totalXP !== undefined && (
              <p className="text-xs text-muted-foreground">
                Total: <AnimatedCounter target={totalXP} /> XP
              </p>
            )}
          </div>
        </div>

        {/* XP numbers */}
        <div className="text-right flex-shrink-0">
          <p
            className="text-sm font-bold tabular-nums"
            style={{
              color: "var(--color-cyan)",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            <AnimatedCounter target={currentXP} />
            <span className="text-xs text-muted-foreground font-normal">
              {" "}
              / {xpToNext.toLocaleString()}
            </span>
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            XP to next level
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative h-3 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "linear-gradient(90deg, var(--color-cyan), oklch(0.7 0.18 250))",
            boxShadow:
              "0 0 10px rgba(0,245,255,0.6), 0 0 20px rgba(0,245,255,0.25)",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatDelay: 1.5,
          }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            width: "40%",
          }}
        />
      </div>

      <div className="flex justify-between px-1">
        <span className="text-[10px] text-muted-foreground">0</span>
        <span className="text-[10px] text-muted-foreground">
          {Math.round(xpToNext / 2).toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {xpToNext.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
