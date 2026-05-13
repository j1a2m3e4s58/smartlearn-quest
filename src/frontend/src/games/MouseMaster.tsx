import { GlowButton } from "@/components/ui/GlowButton";
import { Crosshair, Heart, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Target {
  id: string;
  x: number;
  y: number;
  spawnTime: number;
  lifeMs: number;
  isDecoy: boolean;
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFF = {
  1: { maxTargets: 1, lifeMs: 1500, spawnIntervalMs: 800, moveAfterMs: null },
  2: { maxTargets: 2, lifeMs: 1200, spawnIntervalMs: 700, moveAfterMs: 500 },
  3: { maxTargets: 3, lifeMs: 900, spawnIntervalMs: 600, moveAfterMs: null },
} as const;

export default function MouseMaster({ config, onGameEnd }: Props) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [combo, setCombo] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [totalHit, setTotalHit] = useState(0);
  const [comboFlash, setComboFlash] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const totalSpawnedRef = useRef(totalSpawned);
  const totalHitRef = useRef(totalHit);
  livesRef.current = lives;
  scoreRef.current = score;
  comboRef.current = combo;
  totalSpawnedRef.current = totalSpawned;
  totalHitRef.current = totalHit;

  const startTimeRef = useRef<number>(Date.now());

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const accuracy =
        totalSpawnedRef.current > 0
          ? (totalHitRef.current / totalSpawnedRef.current) * 100
          : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed),
      );
    },
    [config, onGameEnd, gameOver],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const diff = DIFF[config.difficulty];
    const interval = setInterval(() => {
      setTargets((prev) => {
        // Expire old targets
        const now = Date.now();
        const expired = prev.filter((t) => now - t.spawnTime >= t.lifeMs);
        for (const target of expired) {
          if (!target.isDecoy) {
            setLives((l) => {
              const newL = l - 1;
              if (newL <= 0) {
                endGame(false);
                return 0;
              }
              return newL;
            });
            setCombo(0);
          }
          // decoy expired = no penalty
        }
        const alive = prev.filter((t) => now - t.spawnTime < t.lifeMs);
        // Spawn new if needed
        if (alive.length < diff.maxTargets) {
          const isDecoy = config.difficulty === 3 && Math.random() < 0.3;
          const newTarget: Target = {
            id: `t-${Date.now()}-${Math.random()}`,
            x: 5 + Math.random() * 80,
            y: 5 + Math.random() * 80,
            spawnTime: now,
            lifeMs: diff.lifeMs,
            isDecoy,
          };
          setTotalSpawned((s) => s + 1);
          return [...alive, newTarget];
        }
        return alive;
      });
    }, diff.spawnIntervalMs);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, config.difficulty, endGame]);

  function handleTargetClick(target: Target) {
    if (!gameStarted || gameOver) return;
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    if (target.isDecoy) {
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) endGame(false);
        return newL;
      });
      setCombo(0);
      return;
    }
    const newCombo = comboRef.current + 1;
    const multiplier = 1 + Math.floor(newCombo / 5) * 0.5;
    const pts = Math.floor(100 * multiplier);
    setScore((s) => s + pts);
    setCombo(newCombo);
    setTotalHit((h) => h + 1);
    setComboFlash(true);
    setTimeout(() => setComboFlash(false), 300);
  }

  function handleStart() {
    startTimeRef.current = Date.now();
    setGameStarted(true);
    startTimer();
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="mouse_master.page"
    >
      {/* HUD */}
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Crosshair className="h-4 w-4" />
          <span
            className={`text-lg font-bold transition-all ${comboFlash ? "scale-125 text-[#f59e0b]" : ""}`}
          >
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length heart row, positional index is stable
              key={`heart-${i}`}
              className={`h-4 w-4 transition-all ${
                i < lives
                  ? "text-[#f43f5e] fill-[#f43f5e]"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {combo >= 5 && (
            <span className="flex items-center gap-1 text-[#f59e0b] text-xs">
              <Zap className="h-3 w-3" />x
              {(1 + Math.floor(combo / 5) * 0.5).toFixed(1)}
            </span>
          )}
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Arena */}
      <div
        ref={arenaRef}
        className="relative flex-1 rounded-xl border border-border/30 glass overflow-hidden cursor-crosshair"
        style={{ minHeight: 320 }}
        data-ocid="mouse_master.arena"
      >
        {/* Scanlines overlay */}
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />

        {/* Start overlay */}
        {!gameStarted && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/80 backdrop-blur-sm"
          >
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Mouse Master
            </p>
            <h2
              className="text-3xl font-black glow-cyan-text mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Click Targets!
            </h2>
            <p className="text-muted-foreground text-sm mb-1">
              Click cyan targets before they vanish.
            </p>
            {config.difficulty === 3 && (
              <p className="text-[#f43f5e] text-xs mb-4">
                Avoid red decoy targets!
              </p>
            )}
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="mouse_master.start_button"
            >
              Start Game
            </GlowButton>
          </motion.div>
        )}

        {/* Targets */}
        <AnimatePresence>
          {targets.map((target) => (
            <TargetCircle
              key={target.id}
              target={target}
              onClick={() => handleTargetClick(target)}
            />
          ))}
        </AnimatePresence>

        {/* Combo indicator */}
        {combo >= 3 && gameStarted && (
          <motion.div
            key={combo}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 text-[#f59e0b] font-black text-xl pointer-events-none"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {combo}x COMBO!
          </motion.div>
        )}
      </div>
    </div>
  );
}

function TargetCircle({
  target,
  onClick,
}: {
  target: Target;
  onClick: () => void;
}) {
  const progress = Math.max(
    0,
    1 - (Date.now() - target.spawnTime) / target.lifeMs,
  );
  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`absolute w-14 h-14 rounded-full border-2 focus:outline-none ${
        target.isDecoy
          ? "border-[#f43f5e] bg-[#f43f5e]/10"
          : "border-[#00f5ff] bg-[#00f5ff]/10"
      }`}
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        transform: "translate(-50%, -50%)",
        boxShadow: target.isDecoy
          ? "0 0 20px rgba(244,63,94,0.5)"
          : "0 0 20px rgba(0,245,255,0.5)",
      }}
      data-ocid={
        target.isDecoy ? "mouse_master.decoy_target" : "mouse_master.target"
      }
    >
      <div
        className={`absolute inset-0 rounded-full transition-transform ${
          target.isDecoy ? "bg-[#f43f5e]/20" : "bg-[#00f5ff]/20"
        }`}
        style={{ transform: `scale(${progress})`, transformOrigin: "center" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Crosshair
          className={`h-5 w-5 ${
            target.isDecoy ? "text-[#f43f5e]" : "text-[#00f5ff]"
          }`}
        />
      </div>
    </motion.button>
  );
}
