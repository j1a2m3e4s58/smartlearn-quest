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

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#e879f9"] as const;
type Color = (typeof COLORS)[number];

interface Round {
  sequence: Color[];
  answer: Color;
}

function buildRound(i: number): Round {
  const patterns: Color[][] = [
    ["#ef4444", "#3b82f6", "#ef4444", "#3b82f6", "#ef4444"],
    ["#10b981", "#f59e0b", "#10b981", "#f59e0b", "#10b981"],
    ["#ef4444", "#3b82f6", "#10b981", "#ef4444", "#3b82f6"],
    ["#e879f9", "#f59e0b", "#e879f9", "#f59e0b", "#e879f9"],
    ["#3b82f6", "#10b981", "#f59e0b", "#3b82f6", "#10b981"],
    ["#ef4444", "#ef4444", "#3b82f6", "#ef4444", "#ef4444"],
    ["#10b981", "#e879f9", "#10b981", "#e879f9", "#10b981"],
    ["#f59e0b", "#3b82f6", "#ef4444", "#f59e0b", "#3b82f6"],
    ["#e879f9", "#10b981", "#3b82f6", "#e879f9", "#10b981"],
    ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
    ["#3b82f6", "#3b82f6", "#f59e0b", "#3b82f6", "#3b82f6"],
    ["#10b981", "#ef4444", "#e879f9", "#10b981", "#ef4444"],
    ["#f59e0b", "#f59e0b", "#3b82f6", "#f59e0b", "#f59e0b"],
    ["#e879f9", "#3b82f6", "#f59e0b", "#ef4444", "#e879f9"],
    ["#10b981", "#10b981", "#e879f9", "#10b981", "#10b981"],
  ];
  const answers: Color[] = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#f59e0b",
    "#f59e0b",
    "#3b82f6",
    "#e879f9",
    "#ef4444",
    "#3b82f6",
    "#3b82f6",
    "#f59e0b",
    "#e879f9",
    "#3b82f6",
    "#3b82f6",
    "#e879f9",
  ];
  const n = i % patterns.length;
  const ans = answers[n];
  const opts = [
    ...new Set([ans, ...COLORS.filter((c) => c !== ans).slice(0, 3)]),
  ].slice(0, 4) as Color[];
  return { sequence: patterns[n], answer: ans };
}

export default function ColorPatternGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [rounds] = useState(() =>
    Array.from({ length: 15 }, (_, i) => buildRound(i)),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<Color | null>(null);
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
          (correctRef.current / 15) * 100,
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

  function pick(color: Color) {
    if (selected !== null) return;
    setSelected(color);
    const r = rounds[idx];
    if (color === r.answer) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty + timeLeft * 2);
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
      if (idx + 1 >= 15) endGame(true);
      else setIdx((i) => i + 1);
    }, 800);
  }

  const round = rounds[Math.min(idx, rounds.length - 1)];
  const uniqueColors = [
    ...new Set([
      round.answer,
      ...COLORS.filter((c) => c !== round.answer).slice(0, 3),
    ]),
  ] as Color[];

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="color_pattern.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f43f5e] transition-all duration-1000"
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
            className="text-3xl font-black text-[#f43f5e]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Color Patterns
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            A sequence of colored tiles with a blank at the end. Pick the
            correct color to complete the pattern.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f43f5e] text-white font-bold hover:opacity-90 transition-colors"
            data-ocid="color_pattern.start_button"
          >
            Start Game
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#f43f5e]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {idx + 1}/15 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`rounded-xl border-2 p-5 transition-all ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-border/30 bg-card/20"
            }`}
          >
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {round.sequence.map((c, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg shadow-lg border border-white/10"
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="w-12 h-12 rounded-lg border-2 border-dashed border-foreground/40 flex items-center justify-center text-foreground text-xl font-bold">
                ?
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Which color comes next?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {uniqueColors.slice(0, 4).map((color, i) => (
              <motion.button
                key={color}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => pick(color)}
                className={`h-16 rounded-xl border-4 transition-all ${
                  selected === color
                    ? color === round.answer
                      ? "border-[#10b981] scale-105"
                      : "border-[#f43f5e] opacity-60"
                    : selected !== null && color === round.answer
                      ? "border-[#10b981] scale-105"
                      : "border-transparent hover:border-white/40"
                }`}
                style={{ backgroundColor: color }}
                data-ocid={`color_pattern.option.${i + 1}`}
              />
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
            className="text-4xl font-black text-[#f43f5e]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            PATTERNS SOLVED
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/15 correct</div>
        </motion.div>
      )}
    </div>
  );
}
