import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useEffect, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface PositionMemoryProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFFICULTY_CONFIG = {
  1: { gridSize: 3 },
  2: { gridSize: 4 },
  3: { gridSize: 5 },
};

function getCellsToRemember(round: number): number {
  return Math.min(2 + Math.floor(round / 2), 6);
}

export default function PositionMemory({
  config,
  onGameEnd,
}: PositionMemoryProps) {
  const difficultyKey = (config.difficulty ?? 1) as 1 | 2 | 3;
  const { gridSize } = DIFFICULTY_CONFIG[difficultyKey];
  const totalCells = gridSize * gridSize;

  const [phase, setPhase] = useState<
    "idle" | "memorize" | "recall" | "feedback" | "over"
  >("idle");
  const [round, setRound] = useState(1);
  const [targetCells, setTargetCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(180, () => {
    setPhase("over");
    onGameEnd(
      buildResult(config, score, (score / (round * 20)) * 100, 180, false),
    );
  });

  const startRound = useCallback(
    (roundNum: number) => {
      const numCells = getCellsToRemember(roundNum);
      const allCells = Array.from({ length: totalCells }, (_, i) => i);
      const shuffled = allCells.sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, numCells);
      setTargetCells(chosen);
      setSelectedCells([]);
      setPhase("memorize");
      setTimeout(() => setPhase("recall"), 1500);
    },
    [totalCells],
  );

  const startGame = useCallback(() => {
    setRound(1);
    setScore(0);
    setLives(3);
    resetTimer();
    startTimer();
    startRound(1);
  }, [resetTimer, startTimer, startRound]);

  const handleCellClick = useCallback(
    (idx: number) => {
      if (phase !== "recall") return;
      setSelectedCells((prev) =>
        prev.includes(idx) ? prev.filter((c) => c !== idx) : [...prev, idx],
      );
    },
    [phase],
  );

  const submitAnswer = useCallback(() => {
    if (phase !== "recall") return;
    const correct =
      targetCells.every((c) => selectedCells.includes(c)) &&
      selectedCells.every((c) => targetCells.includes(c));
    setPhase("feedback");
    if (correct) {
      triggerParticle(0, 0, "correct");
      triggerMascotReaction("correct");
      const newScore = score + 20;
      setScore(newScore);
      if (round >= 10) {
        setTimeout(() => {
          setPhase("over");
          onGameEnd(buildResult(config, newScore, 100, 180 - timeLeft, true));
        }, 1000);
      } else {
        setTimeout(() => startRound(round + 1), 1000);
        setRound((r) => r + 1);
      }
    } else {
      triggerShake();
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              (score / (round * 20)) * 100,
              180 - timeLeft,
              false,
            ),
          );
        }, 1000);
      } else {
        setTimeout(() => startRound(round), 1000);
      }
    }
  }, [
    phase,
    targetCells,
    selectedCells,
    score,
    round,
    lives,
    triggerParticle,
    triggerMascotReaction,
    triggerShake,
    config,
    timeLeft,
    onGameEnd,
    startRound,
  ]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Position Memory</h2>
        <p className="text-white/70 text-center max-w-md">
          Cells will flash cyan briefly. Remember their positions, then click to
          mark them. All correct = +20 points.
        </p>
        <p className="text-white/60 text-sm">
          Grid: {gridSize}x{gridSize} | 10 rounds | 3 lives | 3 minutes
        </p>
        <GlowButton
          onClick={startGame}
          data-ocid="position_memory.start_button"
        >
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Game Over</h2>
        <p className="text-white/70">
          Round: <span className="text-cyan-300 font-bold">{round}/10</span>
        </p>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <GlowButton
          onClick={startGame}
          data-ocid="position_memory.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Round: <strong className="text-cyan-300">{round}/10</strong>
          </span>
          <span>
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Lives: <strong className="text-rose-400">{lives}</strong>
          </span>
          <span>
            Time: <strong className="text-cyan-300">{timeLeft}s</strong>
          </span>
        </div>
        <div className="text-sm text-yellow-400">
          {phase === "memorize" && "Memorize the highlighted cells!"}
          {phase === "recall" && "Click the cells you remember!"}
          {phase === "feedback" && "Processing..."}
        </div>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          data-ocid="position_memory.grid"
        >
          {Array.from({ length: totalCells }, (_, idx) => {
            const isTarget = targetCells.includes(idx);
            const isSelected = selectedCells.includes(idx);
            const showTarget = phase === "memorize" || phase === "feedback";
            return (
              <button
                type="button"
                key={idx}
                onClick={() => handleCellClick(idx)}
                data-ocid={`position_memory.cell.${idx}`}
                className={`w-14 h-14 rounded-lg border transition-all duration-200 ${
                  showTarget && isTarget
                    ? "bg-cyan-400/60 border-cyan-300 shadow-lg shadow-cyan-500/30"
                    : isSelected && phase === "recall"
                      ? "bg-cyan-500/30 border-cyan-400"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              />
            );
          })}
        </div>
        {phase === "recall" && (
          <GlowButton
            onClick={submitAnswer}
            data-ocid="position_memory.submit_button"
          >
            Submit Answer
          </GlowButton>
        )}
      </div>
    </div>
  );
}
