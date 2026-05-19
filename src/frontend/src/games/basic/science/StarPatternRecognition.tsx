import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface Constellation {
  name: string;
  stars: { x: number; y: number }[];
  connections: [number, number][];
}

const CONSTELLATIONS: Constellation[] = [
  {
    name: "Orion",
    stars: [
      { x: 100, y: 20 },
      { x: 130, y: 45 },
      { x: 70, y: 45 },
      { x: 100, y: 80 },
      { x: 80, y: 115 },
      { x: 120, y: 115 },
      { x: 60, y: 155 },
      { x: 140, y: 155 },
    ],
    connections: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 7],
    ],
  },
  {
    name: "Ursa Major",
    stars: [
      { x: 20, y: 80 },
      { x: 50, y: 70 },
      { x: 80, y: 75 },
      { x: 110, y: 70 },
      { x: 140, y: 60 },
      { x: 165, y: 40 },
      { x: 180, y: 70 },
      { x: 170, y: 100 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 20, y: 120 },
      { x: 55, y: 60 },
      { x: 100, y: 100 },
      { x: 145, y: 50 },
      { x: 180, y: 110 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    name: "Leo",
    stars: [
      { x: 30, y: 100 },
      { x: 60, y: 60 },
      { x: 90, y: 40 },
      { x: 120, y: 50 },
      { x: 150, y: 90 },
      { x: 140, y: 130 },
      { x: 100, y: 150 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
    ],
  },
  {
    name: "Scorpius",
    stars: [
      { x: 100, y: 10 },
      { x: 90, y: 40 },
      { x: 80, y: 70 },
      { x: 70, y: 100 },
      { x: 75, y: 130 },
      { x: 85, y: 155 },
      { x: 100, y: 170 },
      { x: 115, y: 155 },
      { x: 130, y: 140 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
    ],
  },
  {
    name: "Taurus",
    stars: [
      { x: 100, y: 100 },
      { x: 130, y: 70 },
      { x: 160, y: 50 },
      { x: 150, y: 90 },
      { x: 70, y: 70 },
      { x: 40, y: 50 },
      { x: 50, y: 100 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [0, 4],
      [4, 5],
      [4, 6],
    ],
  },
  {
    name: "Gemini",
    stars: [
      { x: 60, y: 10 },
      { x: 120, y: 10 },
      { x: 60, y: 50 },
      { x: 120, y: 50 },
      { x: 50, y: 90 },
      { x: 130, y: 90 },
      { x: 55, y: 130 },
      { x: 125, y: 130 },
      { x: 60, y: 170 },
      { x: 120, y: 170 },
    ],
    connections: [
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [6, 8],
      [7, 9],
    ],
  },
  {
    name: "Aquila",
    stars: [
      { x: 100, y: 10 },
      { x: 100, y: 50 },
      { x: 60, y: 80 },
      { x: 140, y: 80 },
      { x: 100, y: 100 },
      { x: 80, y: 140 },
      { x: 120, y: 140 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [4, 5],
      [4, 6],
    ],
  },
  {
    name: "Lyra",
    stars: [
      { x: 100, y: 10 },
      { x: 100, y: 50 },
      { x: 60, y: 90 },
      { x: 80, y: 130 },
      { x: 120, y: 130 },
      { x: 140, y: 90 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 1],
    ],
  },
  {
    name: "Perseus",
    stars: [
      { x: 100, y: 10 },
      { x: 90, y: 50 },
      { x: 80, y: 90 },
      { x: 70, y: 130 },
      { x: 110, y: 100 },
      { x: 130, y: 60 },
      { x: 150, y: 30 },
      { x: 60, y: 160 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 7],
      [1, 4],
      [4, 5],
      [5, 6],
    ],
  },
];

function getChoices(correct: number): string[] {
  const others = CONSTELLATIONS.map((c, i) => i).filter((i) => i !== correct);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const all = [...shuffled, correct].sort(() => Math.random() - 0.5);
  return all.map((i) => CONSTELLATIONS[i].name);
}

export default function StarPatternRecognition({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [qIndex, setQIndex] = useState(0);
  const [order] = useState(() =>
    [...CONSTELLATIONS.keys()].sort(() => Math.random() - 0.5),
  );
  const [choices, setChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = { current: Date.now() };
  const { triggerShake, triggerCombo } = useGameFeel();

  const endGame = useCallback(
    (finalScore: number, correct: number, lv: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          finalScore,
          correct / 10,
          (Date.now() - startTimeRef.current) / 1000,
          lv > 0,
        ),
      );
    },
    [config, onGameEnd],
  );

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, () => {
    endGame(score, correctCount, lives);
  });

  const startGame = () => {
    const cIdx = order[0];
    setPhase("playing");
    setQIndex(0);
    setScore(0);
    setLives(3);
    setFlash(null);
    setCorrectCount(0);
    setChoices(getChoices(cIdx));
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const handleChoice = (name: string) => {
    if (flash) return;
    const correct = CONSTELLATIONS[order[qIndex]].name;
    if (name === correct) {
      setFlash("correct");
      const ns = score + 10;
      const nc = correctCount + 1;
      setScore(ns);
      setCorrectCount(nc);
      triggerCombo(1);
      setTimeout(() => {
        setFlash(null);
        const nextIdx = qIndex + 1;
        if (nextIdx >= 10) endGame(ns, nc, lives);
        else {
          setQIndex(nextIdx);
          setChoices(getChoices(order[nextIdx]));
        }
      }, 700);
    } else {
      setFlash("wrong");
      const nl = lives - 1;
      setLives(nl);
      triggerShake();
      setTimeout(() => {
        setFlash(null);
        if (nl <= 0) endGame(score, correctCount, 0);
        else {
          const nextIdx = qIndex + 1;
          if (nextIdx >= 10) endGame(score, correctCount, nl);
          else {
            setQIndex(nextIdx);
            setChoices(getChoices(order[nextIdx]));
          }
        }
      }, 700);
    }
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">
          Star Pattern Recognition
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Identify 10 constellations from their star patterns. Choose the
          correct name from 4 options.
        </p>
        <GlowButton data-ocid="stars.start_button" onClick={startGame}>
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">Game Over</h2>
        <p className="text-2xl text-cyan-400">Score: {score}</p>
        <p className="text-muted-foreground">Identified: {correctCount} / 10</p>
        <GlowButton data-ocid="stars.restart_button" onClick={startGame}>
          Play Again
        </GlowButton>
      </div>
    );
  }

  const c = CONSTELLATIONS[order[qIndex]];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-rose-500" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div className="text-cyan-400 font-mono text-lg">{timeLeft}s</div>
        <div className="text-foreground font-bold">
          {qIndex + 1}/10 | Score: {score}
        </div>
      </div>

      <div
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 flex justify-center transition-all ${
          flash === "correct"
            ? "ring-2 ring-emerald-400"
            : flash === "wrong"
              ? "ring-2 ring-rose-400"
              : ""
        }`}
      >
        <svg
          viewBox="0 0 200 200"
          width="260"
          height="260"
          className="overflow-visible"
        >
          <rect width="200" height="200" fill="transparent" />
          {c.connections.map(([a, b], i) => (
            <line
              key={i}
              x1={c.stars[a].x}
              y1={c.stars[a].y}
              x2={c.stars[b].x}
              y2={c.stars[b].y}
              stroke="rgba(0,245,255,0.35)"
              strokeWidth="1.5"
            />
          ))}
          {c.stars.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={4}
              fill="#ffffff"
              opacity={0.9}
            />
          ))}
        </svg>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Which constellation is this?
      </div>

      <div className="grid grid-cols-2 gap-3">
        {choices.map((name) => (
          <button
            key={name}
            type="button"
            data-ocid={`stars.choice.${name.toLowerCase().replace(/\s+/g, "_")}`}
            onClick={() => handleChoice(name)}
            disabled={!!flash}
            className="rounded-xl border border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-foreground font-semibold py-3 transition-all disabled:opacity-50"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
