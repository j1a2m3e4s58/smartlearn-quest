import { GlowButton } from "@/components/ui/GlowButton";
import type { GameConfig, GameResult } from "@/games/GameEngine";
import {
  useMutateApplyProgressUpdate,
  useMutateRecordScore,
} from "@/hooks/useBackend";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronDown, Pause, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy, useState } from "react";

const MouseMaster = lazy(() => import("@/games/MouseMaster"));
const KeyboardNinja = lazy(() => import("@/games/KeyboardNinja"));
const TypingSpeed = lazy(() => import("@/games/TypingSpeed"));
const CyberSafety = lazy(() => import("@/games/CyberSafety"));
const CodingBasics = lazy(() => import("@/games/CodingBasics"));

const GAME_META: Record<
  string,
  {
    name: string;
    component: React.ComponentType<{
      config: GameConfig;
      onGameEnd: (r: GameResult) => void;
    }>;
  }
> = {
  "mouse-master": {
    name: "Mouse Master",
    component: MouseMaster as React.ComponentType<{
      config: GameConfig;
      onGameEnd: (r: GameResult) => void;
    }>,
  },
  "keyboard-ninja": {
    name: "Keyboard Ninja",
    component: KeyboardNinja as React.ComponentType<{
      config: GameConfig;
      onGameEnd: (r: GameResult) => void;
    }>,
  },
  "typing-speed": {
    name: "Typing Speed",
    component: TypingSpeed as React.ComponentType<{
      config: GameConfig;
      onGameEnd: (r: GameResult) => void;
    }>,
  },
  "cyber-safety": {
    name: "Cyber Safety",
    component: CyberSafety as React.ComponentType<{
      config: GameConfig;
      onGameEnd: (r: GameResult) => void;
    }>,
  },
  "coding-basics": {
    name: "Coding Basics",
    component: CodingBasics as React.ComponentType<{
      config: GameConfig;
      onGameEnd: (r: GameResult) => void;
    }>,
  },
};

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Beginner",
  2: "Advanced",
  3: "Expert",
};

export default function GamePage() {
  const { gameId } = useParams({ strict: false }) as { gameId: string };
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const { mutateAsync: recordScore } = useMutateRecordScore();
  const { mutateAsync: applyProgress } = useMutateApplyProgressUpdate();

  const meta = GAME_META[gameId];

  if (!meta) {
    navigate({ to: "/world-map" });
    return null;
  }

  const config: GameConfig = {
    gameId,
    gameName: meta.name,
    difficulty,
    timeLimit: difficulty === 1 ? 60 : difficulty === 2 ? 90 : 120,
    livesCount: difficulty === 1 ? 5 : difficulty === 2 ? 3 : 3,
  };

  async function handleGameEnd(result: GameResult) {
    try {
      await recordScore({
        gameId: result.gameId,
        score: BigInt(result.score),
        accuracy: BigInt(Math.round(result.accuracy)),
        timeSpent: BigInt(result.timeSpent),
      });
      await applyProgress({
        xpEarned: BigInt(result.xpEarned),
        coinsEarned: BigInt(result.coinsEarned),
        playTimeSeconds: BigInt(result.timeSpent),
        dateString: new Date().toISOString().split("T")[0],
      });
    } catch {
      // Silently fail — navigate anyway
    }
    navigate({
      to: "/results/$gameId",
      params: { gameId },
      state: { result } as Record<string, unknown>,
    });
  }

  const GameComponent = meta.component;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="game.page"
    >
      {/* Top HUD bar */}
      <div className="game-hud shrink-0 flex items-center justify-between gap-3 m-3 mb-0 rounded-xl neon-top-border">
        <button
          type="button"
          onClick={() => navigate({ to: "/world-map" })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth text-sm"
          data-ocid="game.back_button"
        >
          <X className="h-4 w-4" /> Quit
        </button>

        <h1
          className="text-sm font-black uppercase tracking-widest glow-cyan-text"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {meta.name}
        </h1>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDifficultyPicker((p) => !p)}
              className="flex items-center gap-1 text-xs border border-[#7c3aed]/50 text-[#7c3aed] rounded-lg px-2 py-1 hover:bg-[#7c3aed]/10 transition-smooth"
              data-ocid="game.difficulty_toggle"
            >
              {DIFFICULTY_LABELS[difficulty]}
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {showDifficultyPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-8 glass-card rounded-lg border border-border/30 z-50 overflow-hidden"
                  data-ocid="game.difficulty_menu"
                >
                  {([1, 2, 3] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDifficulty(d);
                        setGameKey((k) => k + 1);
                        setShowDifficultyPicker(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#7c3aed]/10 transition-smooth ${
                        difficulty === d
                          ? "text-[#7c3aed] font-bold"
                          : "text-muted-foreground"
                      }`}
                      data-ocid={`game.difficulty_option.${d}`}
                    >
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="p-1.5 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-border transition-smooth"
            aria-label={isPaused ? "Resume game" : "Pause game"}
            data-ocid="game.pause_button"
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 relative p-3 overflow-hidden">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#00f5ff] border-t-transparent animate-spin" />
            </div>
          }
        >
          <GameComponent
            key={gameKey}
            config={config}
            onGameEnd={handleGameEnd}
          />
        </Suspense>

        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-40"
              data-ocid="game.pause_overlay"
            >
              <div className="glass-card rounded-2xl p-10 text-center border border-[#7c3aed]/30">
                <h2
                  className="text-3xl font-black glow-purple-text mb-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  PAUSED
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Game is paused
                </p>
                <div className="flex flex-col gap-3">
                  <GlowButton
                    variant="primary"
                    size="md"
                    onClick={() => setIsPaused(false)}
                    data-ocid="game.resume_button"
                  >
                    <Play className="h-4 w-4" /> Resume
                  </GlowButton>
                  <GlowButton
                    variant="ghost"
                    size="md"
                    onClick={() => navigate({ to: "/world-map" })}
                    data-ocid="game.quit_button"
                  >
                    <X className="h-4 w-4" /> Quit to Map
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
