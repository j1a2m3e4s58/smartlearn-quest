import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useEffect, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryCardFlipProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFFICULTIES = {
  easy: { cols: 4, rows: 3, values: ["1", "2", "3", "4", "5", "6"] },
  medium: {
    cols: 4,
    rows: 4,
    values: ["cat", "dog", "sun", "moon", "tree", "bird", "fish", "star"],
  },
  hard: {
    cols: 5,
    rows: 4,
    values: ["@", "#", "$", "%", "^", "&", "*", "!", "?", "~"],
  },
};

function generateDeck(difficulty: "easy" | "medium" | "hard"): Card[] {
  const { values } = DIFFICULTIES[difficulty];
  const pairs = [...values, ...values];
  const shuffled = pairs.sort(() => Math.random() - 0.5);
  return shuffled.map((value, idx) => ({
    id: idx,
    value,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryCardFlip({
  config,
  onGameEnd,
}: MemoryCardFlipProps) {
  const diffMap: Record<number, "easy" | "medium" | "hard"> = {
    1: "easy",
    2: "medium",
    3: "hard",
  };
  const difficulty: "easy" | "medium" | "hard" =
    diffMap[config.difficulty] ?? "easy";
  const { cols } = DIFFICULTIES[difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(300, () => {
    setPhase("over");
    onGameEnd(
      buildResult(
        config,
        score,
        (score / Math.max(1, moves)) * 100,
        300 - timeLeft,
        false,
      ),
    );
  });

  const startGame = useCallback(() => {
    setCards(generateDeck(difficulty));
    setSelected([]);
    setMoves(0);
    setScore(0);
    setLocked(false);
    setPhase("playing");
    resetTimer();
    startTimer();
  }, [difficulty, resetTimer, startTimer]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (locked || phase !== "playing") return;
      const card = cards[id];
      if (card.isFlipped || card.isMatched) return;
      if (selected.includes(id)) return;

      const newSelected = [...selected, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
      );
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setLocked(true);
        setMoves((m) => m + 1);
        const [a, b] = newSelected;
        if (cards[a].value === cards[b].value) {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, isMatched: true } : c,
            ),
          );
          const newScore = score + Math.max(10, 50 - moves);
          setScore(newScore);
          setSelected([]);
          setLocked(false);
          triggerParticle(0, 0, "correct");
          triggerMascotReaction("correct");
          const allMatched = cards.filter((c) => !c.isMatched).length === 2;
          if (allMatched) {
            setPhase("over");
            onGameEnd(buildResult(config, newScore, 100, 300 - timeLeft, true));
          }
        } else {
          triggerShake();
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                newSelected.includes(c.id) ? { ...c, isFlipped: false } : c,
              ),
            );
            setSelected([]);
            setLocked(false);
          }, 1000);
        }
      }
    },
    [
      locked,
      phase,
      cards,
      selected,
      score,
      moves,
      triggerShake,
      triggerParticle,
      triggerMascotReaction,
      config,
      timeLeft,
      onGameEnd,
    ],
  );

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Memory Card Flip</h2>
        <p className="text-white/70 text-center max-w-md">
          Find all matching pairs. Fewer moves = higher score. Difficulty:{" "}
          <span className="text-cyan-300 capitalize">{difficulty}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="memory_card.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Round Complete</h2>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <p className="text-white/70">
          Moves: <span className="text-cyan-300 font-bold">{moves}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="memory_card.restart_button">
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
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Moves: <strong className="text-cyan-300">{moves}</strong>
          </span>
          <span>
            Time: <strong className="text-cyan-300">{timeLeft}s</strong>
          </span>
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          data-ocid="memory_card.grid"
        >
          {cards.map((card) => (
            <button
              type="button"
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              data-ocid={`memory_card.card.${card.id}`}
              className={`w-16 h-16 rounded-xl border text-xl font-bold transition-all duration-300 cursor-pointer ${
                card.isMatched
                  ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                  : card.isFlipped
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-white/5 border-white/10 hover:border-white/30 text-transparent"
              }`}
            >
              {card.isFlipped || card.isMatched ? card.value : "?"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
