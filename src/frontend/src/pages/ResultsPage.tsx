import { GlowButton } from "@/components/ui/GlowButton";
import type { GameResult } from "@/games/GameEngine";
import { useMyPersonalBest } from "@/hooks/useBackend";
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Coins,
  Map as MapIcon,
  RotateCcw,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  angle: number;
  speed: number;
  color: string;
  size: number;
}

const PARTICLE_COLORS = ["#00f5ff", "#7c3aed", "#f59e0b", "#10b981", "#f43f5e"];

function useCountUp(target: number, durationMs = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const steps = 60;
    const stepTime = durationMs / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setValue(Math.round((current / steps) * target));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, durationMs]);
  return value;
}

const GAME_NAMES: Record<string, string> = {
  "mouse-master": "Mouse Master",
  "keyboard-ninja": "Keyboard Ninja",
  "typing-speed": "Typing Speed",
  "cyber-safety": "Cyber Safety",
  "coding-basics": "Coding Basics",
};

const HUB_MAP: Record<string, string> = {
  "mouse-master": "mouseMaster",
  "keyboard-ninja": "keyboardNinja",
  "typing-speed": "typingSpeed",
  "cyber-safety": "cyberSafety",
  "coding-basics": "codingBasics",
};

export default function ResultsPage() {
  const { gameId } = useParams({ strict: false }) as { gameId: string };
  const navigate = useNavigate();
  const routerState = useRouterState();
  const stateResult = (
    routerState.location.state as { result?: GameResult } | null
  )?.result;
  const result = stateResult ?? null;

  const [particles, setParticles] = useState<Particle[]>([]);
  const spawned = useRef(false);

  const { data: personalBest } = useMyPersonalBest(gameId);
  const prevBest = personalBest
    ? Number((personalBest as { score: bigint }).score ?? 0)
    : 0;
  const isNewBest = result ? result.score > prevBest : false;

  const animatedScore = useCountUp(result?.score ?? 0);
  const animatedXP = useCountUp(result?.xpEarned ?? 0);
  const animatedCoins = useCountUp(result?.coinsEarned ?? 0);

  useEffect(() => {
    if (!result) {
      navigate({ to: "/world-map" });
      return;
    }
    if (result.completed && !spawned.current) {
      spawned.current = true;
      const ps: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        angle: -90 + (Math.random() - 0.5) * 120,
        speed: 200 + Math.random() * 300,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        size: 4 + Math.random() * 6,
      }));
      setParticles(ps);
      setTimeout(() => setParticles([]), 2500);
    }
  }, [result, navigate]);

  if (!result) return null;

  const gameName = GAME_NAMES[gameId] ?? gameId;
  const isSuccess = result.completed;

  const stats = [
    {
      icon: Target,
      label: "Score",
      value: animatedScore.toLocaleString(),
      color: "#00f5ff",
    },
    {
      icon: Star,
      label: "Accuracy",
      value: `${result.accuracy}%`,
      color: "#f59e0b",
    },
    {
      icon: Clock,
      label: "Time",
      value: `${result.timeSpent}s`,
      color: "#7c3aed",
    },
    {
      icon: Zap,
      label: "XP Earned",
      value: `+${animatedXP}`,
      color: "#10b981",
    },
    {
      icon: Coins,
      label: "Coins",
      value: `+${animatedCoins}`,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${
        isSuccess ? "bg-background" : "bg-[oklch(0.07_0.02_20)]"
      }`}
      data-ocid="results.page"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isSuccess
            ? "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(244,63,94,0.1) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}vw`, y: "80vh", opacity: 1, scale: 1 }}
            animate={{
              x: `${p.x + Math.cos((p.angle * Math.PI) / 180) * p.speed * 0.03}vw`,
              y: `${80 - Math.sin(((90 - p.angle) * Math.PI) / 180) * 60}vh`,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              ease: "easeOut",
            }}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={
              isSuccess ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}
            }
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: isSuccess
                ? "rgba(0,245,255,0.1)"
                : "rgba(244,63,94,0.1)",
              border: `2px solid ${isSuccess ? "#00f5ff" : "#f43f5e"}`,
              boxShadow: isSuccess
                ? "0 0 30px rgba(0,245,255,0.4)"
                : "0 0 30px rgba(244,63,94,0.4)",
            }}
          >
            <Trophy
              className={`h-10 w-10 ${isSuccess ? "text-[#00f5ff]" : "text-[#f43f5e]"}`}
            />
          </motion.div>

          <h1
            className={`text-3xl font-black uppercase tracking-widest mb-1 ${
              isSuccess ? "glow-cyan-text" : "text-[#f43f5e]"
            }`}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {isSuccess ? "Mission Complete" : "Mission Failed"}
          </h1>
          <p className="text-muted-foreground text-sm">{gameName}</p>
          {!isSuccess && (
            <p className="text-[#f43f5e]/70 text-xs mt-1">
              Better luck next time, commander
            </p>
          )}
        </motion.div>

        <AnimatePresence>
          {isNewBest && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 text-center"
            >
              <span
                className="inline-block px-4 py-2 rounded-full border-2 border-[#f59e0b] text-[#f59e0b] font-black uppercase tracking-widest text-xs glow-gold"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                data-ocid="results.new_best_banner"
              >
                New Personal Best!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-6 border border-border/30"
          data-ocid="results.stats_panel"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="text-center"
                data-ocid={`results.stat.${i + 1}`}
              >
                <stat.icon
                  className="h-5 w-5 mx-auto mb-1"
                  style={{ color: stat.color }}
                />
                <p
                  className="text-xl font-black tabular-nums"
                  style={{
                    color: stat.color,
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
          data-ocid="results.actions"
        >
          <GlowButton
            variant="secondary"
            size="md"
            onClick={() =>
              navigate({ to: "/game/$gameId", params: { gameId } })
            }
            className="flex-1"
            data-ocid="results.replay_button"
          >
            <RotateCcw className="h-4 w-4" /> Play Again
          </GlowButton>
          <GlowButton
            variant="primary"
            size="md"
            onClick={() => navigate({ to: "/world-map" })}
            className="flex-1"
            data-ocid="results.world_map_button"
          >
            <MapIcon className="h-4 w-4" /> World Map
          </GlowButton>
          <GlowButton
            variant="ghost"
            size="md"
            onClick={() =>
              navigate({
                to: "/hub/$hubId",
                params: { hubId: HUB_MAP[gameId] ?? "mouseMaster" },
              })
            }
            className="flex-1"
            data-ocid="results.next_mission_button"
          >
            Next Mission <ChevronRight className="h-4 w-4" />
          </GlowButton>
        </motion.div>
      </div>
    </div>
  );
}
