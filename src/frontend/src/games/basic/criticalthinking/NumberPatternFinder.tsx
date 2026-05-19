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

type SeqType = "arithmetic" | "geometric" | "squares" | "fibonacci";
interface Sequence {
  values: number[];
  next: number;
  type: SeqType;
  hint: string;
}

function genSequences(): Sequence[] {
  const seqs: Sequence[] = [];
  const types: SeqType[] = [
    "arithmetic",
    "geometric",
    "squares",
    "fibonacci",
    "arithmetic",
    "geometric",
    "squares",
    "fibonacci",
    "arithmetic",
    "geometric",
    "squares",
    "fibonacci",
    "arithmetic",
    "geometric",
    "squares",
  ];
  const params = [
    { d: 3, start: 2 },
    { d: 5, start: 1 },
    { d: 7, start: 0 },
    { d: 4, start: 10 },
    { d: 6, start: 3 },
    { r: 2, start: 1 },
    { r: 3, start: 2 },
    { r: 2, start: 3 },
    { r: 4, start: 1 },
    { r: 2, start: 5 },
  ];
  for (let i = 0; i < 15; i++) {
    const type = types[i];
    if (type === "arithmetic") {
      const d = 2 + Math.floor(i * 0.7);
      const s = i * 3;
      const vals = [s, s + d, s + 2 * d, s + 3 * d, s + 4 * d];
      seqs.push({
        values: vals.slice(0, 5),
        next: vals[5] ?? s + 5 * d,
        type,
        hint: `Add ${d} each time`,
      });
    } else if (type === "geometric") {
      const r = 2 + (i % 2);
      const s = 1 + (i % 3);
      const vals = [s, s * r, s * r * r, s * r * r * r, s * r * r * r * r];
      seqs.push({
        values: vals.slice(0, 5),
        next: vals[5] ?? s * r ** 5,
        type,
        hint: `Multiply by ${r} each time`,
      });
    } else if (type === "squares") {
      const off = i % 4;
      const vals = [1, 4, 9, 16, 25].map((v) => v + off);
      seqs.push({
        values: vals.slice(0, 5),
        next: 36 + off,
        type,
        hint: "Perfect squares + offset",
      });
    } else {
      const a = i % 3;
      const b = a + (1 + (i % 2));
      const fib = [
        a,
        b,
        a + b,
        b + (a + b),
        a + b + (b + (a + b)),
        b + (a + b) + (b + (a + b)),
      ];
      seqs.push({
        values: fib.slice(0, 5),
        next: fib[5],
        type,
        hint: "Each number is the sum of the two before",
      });
    }
  }
  return seqs.slice(0, 15);
}

export default function NumberPatternFinder({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [sequences] = useState(genSequences);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showHint, setShowHint] = useState(false);
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
    setInput("");
    setShowHint(false);
    setPhase("playing");
    startTimer();
  }

  function submit() {
    const val = Number.parseInt(input, 10);
    if (Number.isNaN(val)) return;
    const seq = sequences[idx];
    if (val === seq.next) {
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
      setInput("");
      setShowHint(false);
      if (idx + 1 >= 15) endGame(true);
      else setIdx((i) => i + 1);
    }, 900);
  }

  const seq = sequences[Math.min(idx, sequences.length - 1)];
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="number_pattern.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
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
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Number Patterns
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            A sequence of 5 numbers is shown. Find the pattern and type the next
            number.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="number_pattern.start_button"
          >
            Find Patterns
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#f59e0b]">
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
                  : "border-[#f59e0b]/30 bg-card/20"
            }`}
          >
            <div className="flex items-center gap-3 justify-center flex-wrap">
              {seq.values.map((v, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-xl border-2 border-[#f59e0b]/40 bg-[#f59e0b]/10 flex items-center justify-center font-mono text-xl font-bold text-[#f59e0b]"
                >
                  {v}
                </div>
              ))}
              <div className="w-14 h-14 rounded-xl border-2 border-dashed border-[#00f5ff]/60 bg-[#00f5ff]/10 flex items-center justify-center font-mono text-2xl font-bold text-[#00f5ff]">
                ?
              </div>
            </div>
          </div>
          {showHint && (
            <div className="text-xs text-[#f59e0b] text-center">{seq.hint}</div>
          )}
          <div className="flex gap-2">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Next number..."
              className="flex-1 px-4 py-3 rounded-lg border border-border/40 bg-card/30 text-foreground font-mono text-lg focus:border-[#f59e0b] outline-none transition-colors"
              data-ocid="number_pattern.input"
            />
            <button
              type="button"
              onClick={submit}
              className="px-6 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-colors"
              data-ocid="number_pattern.submit_button"
            >
              Check
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors"
            data-ocid="number_pattern.hint_button"
          >
            Show hint (-50 pts)
          </button>
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            PATTERN MASTERED
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/15 correct</div>
        </motion.div>
      )}
    </div>
  );
}
