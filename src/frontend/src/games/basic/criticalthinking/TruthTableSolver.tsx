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

type GateType = "AND" | "OR" | "NOT" | "XOR";
interface Gate {
  type: GateType;
}
interface TruthRow {
  a: boolean;
  b?: boolean;
  expected: boolean;
}
interface Puzzle {
  gate: Gate;
  rows: TruthRow[];
}

function evalGate(g: GateType, a: boolean, b?: boolean): boolean {
  if (g === "NOT") return !a;
  if (!b === undefined) return false;
  const bv = b!;
  if (g === "AND") return a && bv;
  if (g === "OR") return a || bv;
  if (g === "XOR") return a !== bv;
  return false;
}

function genPuzzles(): Puzzle[] {
  const gates: GateType[] = [
    "AND",
    "OR",
    "NOT",
    "XOR",
    "AND",
    "OR",
    "NOT",
    "XOR",
    "AND",
  ];
  return gates.map((type) => {
    if (type === "NOT") {
      return {
        gate: { type },
        rows: [
          { a: true, expected: false },
          { a: false, expected: true },
          { a: true, expected: false },
        ],
      };
    }
    const combos: Array<[boolean, boolean]> = [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ];
    const rows = combos
      .slice(0, 3)
      .map(([a, b]) => ({ a, b, expected: evalGate(type, a, b) }));
    return { gate: { type }, rows };
  });
}

export default function TruthTableSolver({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [puzzles] = useState(genPuzzles);
  const [pIdx, setPIdx] = useState(0);
  const [rowIdx, setRowIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<boolean | null>(null);
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
  const totalQs = puzzles.reduce((s, p) => s + p.rows.length, 0);

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / totalQs) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd, totalQs],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startRef.current = Date.now();
    setPIdx(0);
    setRowIdx(0);
    setScore(0);
    setLives(config.livesCount);
    setCorrect(0);
    setSelected(null);
    setPhase("playing");
    startTimer();
  }

  function pick(val: boolean) {
    if (selected !== null) return;
    setSelected(val);
    const row = puzzles[pIdx].rows[rowIdx];
    if (val === row.expected) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty + timeLeft);
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
      const puzzle = puzzles[pIdx];
      if (rowIdx + 1 >= puzzle.rows.length) {
        if (pIdx + 1 >= puzzles.length) endGame(true);
        else {
          setPIdx((i) => i + 1);
          setRowIdx(0);
        }
      } else setRowIdx((i) => i + 1);
    }, 900);
  }

  const puzzle = puzzles[pIdx];
  const row = puzzle.rows[rowIdx];
  const isBinary = puzzle.gate.type !== "NOT";

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="truth_table.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
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
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Truth Table Solver
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            A logic gate is shown. Given the inputs A and B, determine the
            output (True or False).
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="truth_table.start_button"
          >
            Solve Gates
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#00f5ff]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Gate {pIdx + 1}/{puzzles.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`rounded-xl border-2 p-4 flex flex-col items-center gap-4 transition-all ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-[#00f5ff]/30 bg-card/20"
            }`}
          >
            <div className="text-2xl font-black text-[#00f5ff]">
              {puzzle.gate.type} Gate
            </div>
            <svg width="160" height="80" viewBox="0 0 160 80">
              {isBinary && (
                <>
                  <line
                    x1="10"
                    y1="25"
                    x2="50"
                    y2="25"
                    stroke="#00f5ff"
                    strokeWidth="2"
                  />
                  <line
                    x1="10"
                    y1="55"
                    x2="50"
                    y2="55"
                    stroke="#00f5ff"
                    strokeWidth="2"
                  />
                  <text x="2" y="28" fill="#f59e0b" fontSize="10">
                    {row.a ? "1" : "0"}
                  </text>
                  <text x="2" y="58" fill="#f59e0b" fontSize="10">
                    {row.b !== undefined ? (row.b ? "1" : "0") : "?"}
                  </text>
                </>
              )}
              {!isBinary && (
                <>
                  <line
                    x1="10"
                    y1="40"
                    x2="50"
                    y2="40"
                    stroke="#00f5ff"
                    strokeWidth="2"
                  />
                  <text x="2" y="43" fill="#f59e0b" fontSize="10">
                    {row.a ? "1" : "0"}
                  </text>
                </>
              )}
              {puzzle.gate.type === "AND" && (
                <>
                  <rect
                    x="50"
                    y="15"
                    width="50"
                    height="50"
                    rx="0"
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="2"
                  />
                  <path
                    d="M75 15 Q100 15 100 40 Q100 65 75 65 L50 65 L50 15 Z"
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="2"
                  />
                </>
              )}
              {puzzle.gate.type === "OR" && (
                <path
                  d="M50 15 Q70 15 100 40 Q70 65 50 65 Q65 40 50 15Z"
                  fill="none"
                  stroke="#e879f9"
                  strokeWidth="2"
                />
              )}
              {puzzle.gate.type === "NOT" && (
                <>
                  <polygon
                    points="50,15 100,40 50,65"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <circle
                    cx="105"
                    cy="40"
                    r="5"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                </>
              )}
              {puzzle.gate.type === "XOR" && (
                <>
                  <path
                    d="M45 15 Q60 40 45 65"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <path
                    d="M50 15 Q70 15 100 40 Q70 65 50 65 Q65 40 50 15Z"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                </>
              )}
              <line
                x1={puzzle.gate.type === "NOT" ? 110 : 100}
                y1="40"
                x2="150"
                y2="40"
                stroke="#00f5ff"
                strokeWidth="2"
              />
              <text x="140" y="44" fill="#f43f5e" fontSize="10">
                ?
              </text>
            </svg>
            <div className="text-sm text-muted-foreground">
              {isBinary
                ? `A=${row.a ? "TRUE" : "FALSE"}, B=${row.b !== undefined ? (row.b ? "TRUE" : "FALSE") : "FALSE"}`
                : `A=${row.a ? "TRUE" : "FALSE"}`}
            </div>
          </div>
          <div className="text-sm font-semibold text-foreground text-center">
            Output = ?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([true, false] as boolean[]).map((val, i) => (
              <motion.button
                key={String(val)}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => pick(val)}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                  selected === val
                    ? val === row.expected
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : selected !== null && val === row.expected
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-border/40 bg-card/30 text-foreground hover:border-[#00f5ff]/60"
                }`}
                data-ocid={`truth_table.option.${i + 1}`}
              >
                {val ? "TRUE" : "FALSE"}
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
            className="text-4xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            LOGIC MASTERED
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">
            {correct}/{totalQs} correct
          </div>
        </motion.div>
      )}
    </div>
  );
}
