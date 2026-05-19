import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

type Shape = "circle" | "square" | "triangle" | "diamond" | "hexagon";

interface Round {
  sequence: Shape[];
  answer: Shape;
  options: Shape[];
}

const ALL_SHAPES: Shape[] = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "hexagon",
];

const SHAPE_SVG: Record<Shape, React.ReactNode> = {
  circle: <circle cx="24" cy="24" r="18" fill="currentColor" />,
  square: <rect x="6" y="6" width="36" height="36" fill="currentColor" />,
  triangle: <polygon points="24,5 43,43 5,43" fill="currentColor" />,
  diamond: <polygon points="24,4 44,24 24,44 4,24" fill="currentColor" />,
  hexagon: (
    <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="currentColor" />
  ),
};

function ShapeIcon({
  shape,
  color = "currentColor",
  size = 40,
}: { shape: Shape; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ color }}>
      {SHAPE_SVG[shape]}
    </svg>
  );
}

function genRound(i: number): Round {
  const patterns: Shape[][] = [
    ["circle", "square", "circle", "square", "circle"],
    ["triangle", "diamond", "triangle", "diamond", "triangle"],
    ["circle", "square", "triangle", "circle", "square"],
    ["hexagon", "circle", "hexagon", "circle", "hexagon"],
    ["square", "triangle", "diamond", "square", "triangle"],
    ["circle", "circle", "square", "circle", "circle"],
    ["diamond", "hexagon", "diamond", "hexagon", "diamond"],
    ["triangle", "square", "circle", "triangle", "square"],
    ["circle", "diamond", "square", "circle", "diamond"],
    ["hexagon", "square", "hexagon", "square", "hexagon"],
    ["circle", "triangle", "hexagon", "circle", "triangle"],
    ["diamond", "circle", "square", "diamond", "circle"],
  ];
  const answers: Shape[] = [
    "square",
    "triangle",
    "diamond",
    "circle",
    "diamond",
    "square",
    "hexagon",
    "circle",
    "square",
    "square",
    "hexagon",
    "square",
  ];
  return {
    sequence: patterns[i % patterns.length],
    answer: answers[i % answers.length],
    options: [
      ...new Set([
        answers[i % answers.length],
        ...ALL_SHAPES.filter((s) => s !== answers[i % answers.length]).slice(
          0,
          3,
        ),
      ]),
    ].slice(0, 4),
  };
}

export default function ShapePatternCompleter({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [rounds] = useState(() =>
    Array.from({ length: 12 }, (_, i) => genRound(i)),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<Shape | null>(null);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const [correct, setCorrect] = useState(0);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const correctRef = useRef(correct);
  correctRef.current = correct;

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / 12) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startRef.current = Date.now();
    setIdx(0);
    setScore(0);
    setLives(config.livesCount);
    setCorrect(0);
    setSelected(null);
    setPhase("playing");
    startTimer();
  }

  function pick(shape: Shape) {
    if (selected !== null) return;
    setSelected(shape);
    const r = rounds[idx];
    if (shape === r.answer) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty + timeLeft * 2);
    } else {
      setFlash("err");
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
    }
    setTimeout(() => {
      setFlash(null);
      setSelected(null);
      if (idx + 1 >= 12) endGame(true);
      else setIdx((i) => i + 1);
    }, 900);
  }

  const round = rounds[Math.min(idx, rounds.length - 1)];
  const COLORS = ["#00f5ff", "#f43f5e", "#10b981", "#f59e0b", "#e879f9"];
  const shapeColor = (s: Shape) =>
    COLORS[ALL_SHAPES.indexOf(s) % COLORS.length];

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="shape_pattern.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#e879f9] transition-all duration-1000"
          style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Shape Patterns
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            A row of shapes is shown with a blank at the end. Select the correct
            shape to complete the pattern.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#e879f9] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="shape_pattern.start_button"
          >
            Start Patterns
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#e879f9]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {idx + 1}/12 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`rounded-xl border-2 p-4 transition-all ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-[#e879f9]/30 bg-card/20"
            }`}
          >
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {round.sequence.map((s, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg border border-border/30 bg-card/30 flex items-center justify-center"
                >
                  <ShapeIcon shape={s} color={shapeColor(s)} size={32} />
                </div>
              ))}
              <div className="w-12 h-12 rounded-lg border-2 border-dashed border-[#e879f9]/60 bg-[#e879f9]/10 flex items-center justify-center text-[#e879f9] text-xl font-bold">
                ?
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {round.options.map((shape, i) => (
              <motion.button
                key={shape}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => pick(shape)}
                className={`py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selected === shape
                    ? shape === round.answer
                      ? "border-[#10b981] bg-[#10b981]/20"
                      : "border-[#f43f5e] bg-[#f43f5e]/20"
                    : selected !== null && shape === round.answer
                      ? "border-[#10b981] bg-[#10b981]/20"
                      : "border-border/40 bg-card/30 hover:border-[#e879f9]/60"
                }`}
                data-ocid={`shape_pattern.option.${i + 1}`}
              >
                <ShapeIcon shape={shape} color={shapeColor(shape)} size={36} />
                <span className="text-xs capitalize text-muted-foreground">
                  {shape}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            COMPLETE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/12 correct</div>
        </motion.div>
      )}
    </div>
  );
}
