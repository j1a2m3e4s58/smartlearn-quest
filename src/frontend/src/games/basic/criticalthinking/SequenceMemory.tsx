import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface SequenceMemoryProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const COLORS = [
  {
    id: 0,
    label: "Red",
    bg: "bg-rose-500",
    active: "bg-rose-300",
    border: "border-rose-400",
  },
  {
    id: 1,
    label: "Blue",
    bg: "bg-blue-500",
    active: "bg-blue-300",
    border: "border-blue-400",
  },
  {
    id: 2,
    label: "Green",
    bg: "bg-emerald-500",
    active: "bg-emerald-300",
    border: "border-emerald-400",
  },
  {
    id: 3,
    label: "Yellow",
    bg: "bg-yellow-400",
    active: "bg-yellow-200",
    border: "border-yellow-300",
  },
];

export default function SequenceMemory({
  config,
  onGameEnd,
}: SequenceMemoryProps) {
  const [phase, setPhase] = useState<"idle" | "showing" | "input" | "over">(
    "idle",
  );
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const startTimeRef = useRef<number>(0);

  const showSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    setPlayerInput([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < seq.length) {
        setActiveColor(seq[i]);
        setTimeout(() => setActiveColor(null), 500);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("input"), 600);
      }
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const startGame = useCallback(() => {
    const initial = [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
    ];
    setSequence(initial);
    setScore(0);
    setPhase("showing");
    startTimeRef.current = Date.now();
    showSequence(initial);
  }, [showSequence]);

  const handleColorClick = useCallback(
    (colorId: number) => {
      if (phase !== "input") return;
      const newInput = [...playerInput, colorId];
      setPlayerInput(newInput);
      const idx = newInput.length - 1;

      if (newInput[idx] !== sequence[idx]) {
        triggerShake();
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setHighScore((prev) => Math.max(prev, sequence.length));
        setPhase("over");
        onGameEnd(
          buildResult(
            config,
            score,
            (score / Math.max(1, sequence.length)) * 100,
            elapsed,
            false,
          ),
        );
        return;
      }

      if (newInput.length === sequence.length) {
        triggerParticle(0, 0, "correct");
        triggerMascotReaction("correct");
        const newScore = score + sequence.length * 10;
        setScore(newScore);
        const newSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(newSeq);
        setTimeout(() => showSequence(newSeq), 500);
      }
    },
    [
      phase,
      playerInput,
      sequence,
      score,
      triggerShake,
      triggerParticle,
      triggerMascotReaction,
      config,
      onGameEnd,
      showSequence,
    ],
  );

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Sequence Memory</h2>
        <p className="text-white/70 text-center max-w-md">
          Watch the light sequence, then repeat it. Each correct round adds one
          more step. One mistake ends the game.
        </p>
        {highScore > 0 && (
          <p className="text-yellow-400">High Score: {highScore} steps</p>
        )}
        <GlowButton
          onClick={startGame}
          data-ocid="sequence_memory.start_button"
        >
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-rose-400">Wrong!</h2>
        <p className="text-white/70">
          You reached sequence length:{" "}
          <span className="text-cyan-300 font-bold">{sequence.length}</span>
        </p>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <p className="text-yellow-400">
          Best: {Math.max(highScore, sequence.length)} steps
        </p>
        <GlowButton
          onClick={startGame}
          data-ocid="sequence_memory.restart_button"
        >
          Try Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-6 p-4">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Sequence:{" "}
            <strong className="text-cyan-300">{sequence.length}</strong>
          </span>
          <span
            className={
              phase === "showing" ? "text-yellow-400" : "text-emerald-400"
            }
          >
            {phase === "showing" ? "Watch..." : "Your turn!"}
          </span>
        </div>
        <div
          className="grid grid-cols-2 gap-4"
          data-ocid="sequence_memory.grid"
        >
          {COLORS.map((color) => (
            <button
              type="button"
              key={color.id}
              onClick={() => handleColorClick(color.id)}
              disabled={phase === "showing"}
              data-ocid={`sequence_memory.color.${color.id}`}
              className={`w-32 h-32 rounded-2xl border-2 font-bold text-white transition-all duration-150 ${
                activeColor === color.id
                  ? `${color.active} ${color.border} scale-110 shadow-lg`
                  : `${color.bg} ${color.border} hover:brightness-125 active:scale-95`
              } disabled:cursor-not-allowed`}
            >
              {color.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < playerInput.length ? "bg-emerald-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
