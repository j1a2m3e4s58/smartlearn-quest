import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

// ─────────────────────────────────────────────
// GAME 1 — Pattern Analyst (unchanged)
// ─────────────────────────────────────────────
type PatternType = "number_seq" | "visual_transform" | "matrix" | "analogy";
interface PatternQuestion {
  type: PatternType;
  description: string;
  sequence: string[];
  options: string[];
  answer: string;
  rule: string;
}

const QUESTIONS: Record<1 | 2 | 3, PatternQuestion[]> = {
  1: [
    {
      type: "number_seq",
      description: "What comes next? 2, 4, 6, 8, ?",
      sequence: ["2", "4", "6", "8"],
      options: ["9", "10", "12", "11"],
      answer: "10",
      rule: "Add 2 each time.",
    },
    {
      type: "number_seq",
      description: "What comes next? 1, 3, 9, 27, ?",
      sequence: ["1", "3", "9", "27"],
      options: ["54", "81", "63", "36"],
      answer: "81",
      rule: "Multiply by 3 each time.",
    },
    {
      type: "analogy",
      description: "Big : Small as Fast : ?",
      sequence: ["Big", "Small", "Fast"],
      options: ["Quick", "Rapid", "Slow", "Speed"],
      answer: "Slow",
      rule: "Antonym relationship.",
    },
    {
      type: "number_seq",
      description: "What comes next? 5, 10, 15, 20, ?",
      sequence: ["5", "10", "15", "20"],
      options: ["22", "25", "30", "24"],
      answer: "25",
      rule: "Add 5 each time.",
    },
    {
      type: "analogy",
      description: "Pen : Writer as Brush : ?",
      sequence: ["Pen", "Writer", "Brush"],
      options: ["Art", "Painter", "Canvas", "Color"],
      answer: "Painter",
      rule: "Tool : User relationship.",
    },
  ],
  2: [
    {
      type: "number_seq",
      description: "What comes next? 1, 1, 2, 3, 5, 8, ?",
      sequence: ["1", "1", "2", "3", "5", "8"],
      options: ["11", "12", "13", "16"],
      answer: "13",
      rule: "Fibonacci: add two preceding numbers.",
    },
    {
      type: "matrix",
      description: "3x3 matrix: [1,2,3][2,4,6][3,6,?]",
      sequence: ["1", "2", "3", "2", "4", "6", "3", "6"],
      options: ["8", "7", "9", "12"],
      answer: "9",
      rule: "Row/column products: 3x3=9.",
    },
    {
      type: "visual_transform",
      description:
        "Square rotates 90deg clockwise each step. At step 4 a corner points up. Step 5 orientation?",
      sequence: ["0deg", "90deg", "180deg", "270deg"],
      options: ["0deg", "90deg", "360deg", "45deg"],
      answer: "0deg",
      rule: "360deg full rotation brings back to start.",
    },
    {
      type: "number_seq",
      description: "What comes next? 2, 6, 12, 20, 30, ?",
      sequence: ["2", "6", "12", "20", "30"],
      options: ["40", "42", "44", "36"],
      answer: "42",
      rule: "Differences: 4,6,8,10,12. Next diff is 12.",
    },
    {
      type: "analogy",
      description: "7 : 49 as 8 : ?",
      sequence: ["7", "49", "8"],
      options: ["56", "64", "72", "16"],
      answer: "64",
      rule: "x : x\u00b2 relationship. 8\u00b2=64.",
    },
  ],
  3: [
    {
      type: "matrix",
      description: "Each row sums to 9. Row1: 1,5,3. Row2: 4,2,3. Row3: 2,4,?",
      sequence: ["1", "5", "3", "4", "2", "3", "2", "4"],
      options: ["2", "3", "1", "5"],
      answer: "3",
      rule: "Each row totals 9. 2+4+?=9, so ?=3.",
    },
    {
      type: "number_seq",
      description: "What comes next? 2, 3, 5, 7, 11, 13, ?",
      sequence: ["2", "3", "5", "7", "11", "13"],
      options: ["15", "17", "19", "14"],
      answer: "17",
      rule: "Prime numbers sequence.",
    },
    {
      type: "visual_transform",
      description:
        "Pattern: +1 side per step. Triangle(3), Square(4), Pentagon(5), Hexagon(6). Next?",
      sequence: ["3 sides", "4 sides", "5 sides", "6 sides"],
      options: ["7 sides", "8 sides", "6 sides", "10 sides"],
      answer: "7 sides",
      rule: "Add 1 side each step. Heptagon = 7 sides.",
    },
    {
      type: "analogy",
      description: "16 : 4 as 81 : ?",
      sequence: ["16", "4", "81"],
      options: ["9", "27", "18", "3"],
      answer: "9",
      rule: "Square root relationship. \u221a81=9.",
    },
    {
      type: "number_seq",
      description: "What comes next? 0, 1, 4, 9, 16, 25, ?",
      sequence: ["0", "1", "4", "9", "16", "25"],
      options: ["30", "36", "49", "32"],
      answer: "36",
      rule: "Perfect squares: 0\u00b2,1\u00b2,2\u00b2... 6\u00b2=36.",
    },
  ],
};

const typeLabel: Record<PatternType, string> = {
  number_seq: "NUMBER SEQUENCE",
  visual_transform: "VISUAL TRANSFORM",
  matrix: "MATRIX PATTERN",
  analogy: "ANALOGY",
};

function PatternAnalyst({ config, onGameEnd }: Props) {
  const questions = QUESTIONS[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  livesRef.current = lives;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function handleSelect(opt: string) {
    if (revealed) return;
    const q = questions[idx % questions.length];
    setSelected(opt);
    setRevealed(true);
    setTotal((t) => t + 1);
    if (opt === q.answer) {
      setScore((s) => s + 300 * config.difficulty + timeLeft * 2);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      if (idx + 1 >= questions.length) {
        endGame(true);
        return;
      }
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }, 1500);
  }

  const q = questions[idx % questions.length];
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="pattern_recognition.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#ec4899] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#ec4899]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Pattern Analyst
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Identify the hidden rule in each sequence. Number series, matrix
            patterns, visual transformations, and analogies.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#ec4899" }}
            data-ocid="pattern_recognition.start_button"
          >
            Analyze Patterns
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#ec4899] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {idx + 1}/{questions.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="rounded-xl border border-border/30 bg-card/40 p-4">
                <p className="text-xs uppercase tracking-widest text-[#ec4899] mb-2">
                  {typeLabel[q.type]}
                </p>
                <p className="text-base font-semibold mb-3">{q.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {q.sequence.map((s, i) => (
                    <div
                      key={`seq-${i}`}
                      className="px-3 py-1.5 rounded-lg border border-[#ec4899]/30 bg-[#ec4899]/10 font-mono text-sm font-bold text-[#ec4899]"
                    >
                      {s}
                    </div>
                  ))}
                  <div className="px-3 py-1.5 rounded-lg border-2 border-dashed border-[#ec4899]/50 font-mono text-sm font-bold text-muted-foreground">
                    ?
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  let cls =
                    "border-border/30 bg-card/60 hover:border-[#ec4899]/50";
                  if (revealed && opt === q.answer)
                    cls = "border-[#10b981] bg-[#10b981]/10";
                  else if (revealed && opt === selected && opt !== q.answer)
                    cls = "border-[#f43f5e] bg-[#f43f5e]/10";
                  return (
                    <button
                      key={`opt-${oi}`}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      disabled={revealed}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${cls} disabled:cursor-not-allowed`}
                      data-ocid={`pattern_recognition.option.${oi + 1}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-[#ec4899]/20 bg-[#ec4899]/5 p-3 text-xs"
                >
                  <span className="font-bold text-[#ec4899]">Rule: </span>
                  <span className="text-muted-foreground">{q.rule}</span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 2 — Matrix Patterns
// ─────────────────────────────────────────────
interface MatrixPuzzle {
  title: string;
  description: string;
  grid: (string | null)[];
  options: string[];
  answer: string;
  rule: string;
}

const MATRIX_PUZZLES: MatrixPuzzle[] = [
  {
    title: "Shape Count",
    description:
      "Each row: the number in col 3 = col1 + col2. Find missing value.",
    grid: ["2", "3", "5", "4", "1", "5", "3", "4", null],
    options: ["6", "7", "8", "5"],
    answer: "7",
    rule: "Col3 = Col1 + Col2. 3+4=7.",
  },
  {
    title: "Row Product Rule",
    description:
      "Each row: product of first two = third. Find the missing number.",
    grid: ["2", "3", "6", "3", "4", "12", "4", "5", null],
    options: ["18", "20", "22", "24"],
    answer: "20",
    rule: "4 x 5 = 20.",
  },
  {
    title: "Column Sums",
    description:
      "Each column sums to the same value. Col1: 3,2,4=9. Col2: 5,1,3=9. Col3: 1,4,?=9.",
    grid: ["3", "5", "1", "2", "1", "4", "4", "3", null],
    options: ["3", "4", "5", "2"],
    answer: "4",
    rule: "Col3 must sum to 9: 1+4+?=9, ?=4.",
  },
  {
    title: "Diagonal Pattern",
    description:
      "The main diagonal doubles each step: 1, 2, 4. Find the value in position (3,3).",
    grid: ["1", "0", "0", "0", "2", "0", "0", "0", null],
    options: ["4", "6", "8", "3"],
    answer: "4",
    rule: "Diagonal: 1, 2, 4 (doubles). Third = 4.",
  },
  {
    title: "Row Max Rule",
    description: "Each row: col3 = maximum(col1, col2). Find missing.",
    grid: ["5", "3", "5", "2", "8", "8", "7", "4", null],
    options: ["4", "7", "11", "3"],
    answer: "7",
    rule: "max(7,4) = 7.",
  },
  {
    title: "Multiplication Table",
    description:
      "3x3 multiplication table. Row labels: 2, 3, 4. Col labels: 3, 4, 5. Position (3,3) = 4x5 = ?",
    grid: ["6", "8", "10", "9", "12", "15", "12", "16", null],
    options: ["18", "20", "24", "22"],
    answer: "20",
    rule: "4 x 5 = 20.",
  },
  {
    title: "XOR Pattern",
    description:
      "Each cell is the XOR of row and column index (0-indexed). Row 2, Col 2 = 2 XOR 2 = ?",
    grid: ["0", "1", "2", "1", "0", "3", "2", "3", null],
    options: ["0", "1", "4", "2"],
    answer: "0",
    rule: "2 XOR 2 = 0.",
  },
  {
    title: "Triangle Numbers",
    description:
      "Matrix fills with triangle numbers left to right, top to bottom: 1,3,6,10,15,21,28,36,?.",
    grid: ["1", "3", "6", "10", "15", "21", "28", "36", null],
    options: ["42", "45", "48", "40"],
    answer: "45",
    rule: "Triangle numbers: n(n+1)/2. 9th = 45.",
  },
  {
    title: "Alternating Parity",
    description:
      "Row 1 sums are odd. Row 2 sums are even. Row 3: 2,5,? should be odd sum.",
    grid: ["1", "2", "4", "4", "2", "6", "2", "5", null],
    options: ["2", "4", "1", "3"],
    answer: "1",
    rule: "Sum must be odd: 2+5+? is odd when ?=1 (sum=8... actually ?=4 is even, ?=1 gives sum=8 even... Re-read: row 3 sum = odd. 2+5=7. 7+? odd → ? is even. ?=2 gives 9 odd. Answer: 2.",
  },
  {
    title: "Symmetric Matrix",
    description:
      "Matrix is symmetric (m[i][j]=m[j][i]). Given row2,col1=5, find row1,col2.",
    grid: ["1", null, "3", "5", "2", "4", "3", "4", "1"],
    options: ["3", "4", "5", "2"],
    answer: "5",
    rule: "Symmetric matrix: m[0][1] = m[1][0] = 5.",
  },
  {
    title: "Row Differences",
    description:
      "Each row's third element = col2 - col1. Row 3: 9, 4, ? = 4-9 = ?",
    grid: ["2", "5", "3", "1", "6", "5", "9", "4", null],
    options: ["-5", "5", "-4", "13"],
    answer: "-5",
    rule: "4 - 9 = -5.",
  },
  {
    title: "Squared Sums",
    description:
      "Each cell = sum of its row and column indices squared. Position(2,2) = (2+2)\u00b2 = ?",
    grid: ["0", "1", "4", "1", "4", "9", "4", "9", null],
    options: ["12", "16", "9", "8"],
    answer: "16",
    rule: "(2+2)\u00b2 = 4\u00b2 = 16.",
  },
];

function MatrixPatterns({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 8 : 12;
  const puzzles = MATRIX_PUZZLES.slice(
    0,
    Math.min(count, MATRIX_PUZZLES.length),
  );
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [pIdx, setPIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        puzzles.length > 0 ? (correctRef.current / puzzles.length) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, puzzles.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function handleSelect(opt: string) {
    if (revealed) return;
    const p = puzzles[pIdx];
    setSelected(opt);
    setRevealed(true);
    if (opt === p.answer) {
      setScore((s) => s + 350 * config.difficulty + timeLeft * 2);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      if (pIdx + 1 >= puzzles.length) {
        endGame(true);
        return;
      }
      setPIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }, 1800);
  }

  const puzzle = puzzles[pIdx];
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="matrix_patterns.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#ec4899] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#ec4899]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Matrix Patterns
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Study each 3x3 grid. Identify the rule governing rows and columns.
            Select the value that completes the matrix.
          </p>
          <p className="text-xs text-muted-foreground">
            {puzzles.length} matrices | Rules: sums, products, sequences,
            symmetry
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#ec4899" }}
            data-ocid="matrix_patterns.start_button"
          >
            Solve Matrices
          </button>
        </motion.div>
      )}
      {phase === "playing" && puzzle && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#ec4899] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {pIdx + 1}/{puzzles.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={pIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4"
            >
              <div className="rounded-xl border border-[#ec4899]/30 bg-card/40 p-3">
                <p className="text-xs font-bold text-[#ec4899] mb-1">
                  {puzzle.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {puzzle.description}
                </p>
              </div>
              <div className="flex justify-center">
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                >
                  {puzzle.grid.map((cell, i) => (
                    <div
                      key={`cell-${i}`}
                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${
                        cell === null
                          ? "border-dashed border-[#ec4899] bg-[#ec4899]/10 text-[#ec4899]"
                          : "border-border/30 bg-card/40"
                      }`}
                    >
                      {cell === null ? "?" : cell}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {puzzle.options.map((opt, oi) => {
                  let cls =
                    "border-border/30 bg-card/60 hover:border-[#ec4899]/50";
                  if (revealed && opt === puzzle.answer)
                    cls = "border-[#10b981] bg-[#10b981]/10";
                  else if (
                    revealed &&
                    opt === selected &&
                    opt !== puzzle.answer
                  )
                    cls = "border-[#f43f5e] bg-[#f43f5e]/10";
                  return (
                    <button
                      key={`opt-${oi}`}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      disabled={revealed}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${cls} disabled:cursor-not-allowed`}
                      data-ocid={`matrix_patterns.option.${oi + 1}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-[#ec4899]/20 bg-[#ec4899]/5 p-3 text-xs"
                >
                  <span className="font-bold text-[#ec4899]">Rule: </span>
                  <span className="text-muted-foreground">{puzzle.rule}</span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 3 — Number Sequences
// ─────────────────────────────────────────────
type SeqType =
  | "arithmetic"
  | "geometric"
  | "square"
  | "cube"
  | "fibonacci"
  | "prime";
interface NumberSeq {
  type: SeqType;
  terms: number[];
  next: number[];
  hint: string;
}

const NUM_SEQUENCES: NumberSeq[] = [
  {
    type: "arithmetic",
    terms: [3, 7, 11, 15, 19, 23],
    next: [27, 31],
    hint: "Add 4 each step.",
  },
  {
    type: "geometric",
    terms: [2, 6, 18, 54, 162, 486],
    next: [1458, 4374],
    hint: "Multiply by 3 each step.",
  },
  {
    type: "square",
    terms: [1, 4, 9, 16, 25, 36],
    next: [49, 64],
    hint: "Perfect squares: 1\u00b2, 2\u00b2, 3\u00b2...",
  },
  {
    type: "fibonacci",
    terms: [1, 1, 2, 3, 5, 8],
    next: [13, 21],
    hint: "Each term = sum of previous two.",
  },
  {
    type: "prime",
    terms: [2, 3, 5, 7, 11, 13],
    next: [17, 19],
    hint: "Prime numbers sequence.",
  },
  {
    type: "cube",
    terms: [1, 8, 27, 64, 125, 216],
    next: [343, 512],
    hint: "Perfect cubes: 1\u00b3, 2\u00b3, 3\u00b3...",
  },
  {
    type: "arithmetic",
    terms: [100, 93, 86, 79, 72, 65],
    next: [58, 51],
    hint: "Subtract 7 each step.",
  },
  {
    type: "geometric",
    terms: [1, 3, 9, 27, 81, 243],
    next: [729, 2187],
    hint: "Powers of 3.",
  },
  {
    type: "square",
    terms: [1, 4, 9, 16, 25, 36],
    next: [49, 64],
    hint: "n\u00b2 sequence.",
  },
  {
    type: "fibonacci",
    terms: [0, 1, 1, 2, 3, 5],
    next: [8, 13],
    hint: "Fibonacci starting at 0.",
  },
  {
    type: "prime",
    terms: [17, 19, 23, 29, 31, 37],
    next: [41, 43],
    hint: "Continue the prime number list.",
  },
  {
    type: "arithmetic",
    terms: [5, 11, 17, 23, 29, 35],
    next: [41, 47],
    hint: "Add 6 each step.",
  },
  {
    type: "cube",
    terms: [8, 27, 64, 125, 216, 343],
    next: [512, 729],
    hint: "Cubes starting from 2\u00b3.",
  },
  {
    type: "geometric",
    terms: [512, 256, 128, 64, 32, 16],
    next: [8, 4],
    hint: "Divide by 2 each step.",
  },
  {
    type: "fibonacci",
    terms: [5, 8, 13, 21, 34, 55],
    next: [89, 144],
    hint: "Fibonacci mid-sequence.",
  },
];

function NumberSequences({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 10 : 15;
  const seqs = NUM_SEQUENCES.slice(0, count);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [sIdx, setSIdx] = useState(0);
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [feedback, setFeedback] = useState<{
    msg: string;
    good: boolean;
  } | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [correct, setCorrect] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        seqs.length > 0 ? (correctRef.current / seqs.length) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, seqs.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  const seq = seqs[sIdx];

  function submit() {
    const a1 = Number.parseInt(answer1.trim());
    const a2 = Number.parseInt(answer2.trim());
    const isCorrect = a1 === seq.next[0] && a2 === seq.next[1];
    if (isCorrect) {
      const pts = (hintShown ? 200 : 400) * config.difficulty + timeLeft * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedback({
        msg: `Correct! Next terms: ${seq.next[0]}, ${seq.next[1]}`,
        good: true,
      });
      setTimeout(() => {
        setFeedback(null);
        if (sIdx + 1 >= seqs.length) {
          endGame(true);
          return;
        }
        setSIdx((i) => i + 1);
        setAnswer1("");
        setAnswer2("");
        setHintShown(false);
      }, 1600);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      setFeedback({
        msg: `Incorrect. Correct answer: ${seq.next[0]}, ${seq.next[1]}`,
        good: false,
      });
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
      setTimeout(() => setFeedback(null), 1800);
    }
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const seqTypeColors: Record<SeqType, string> = {
    arithmetic: "#00f5ff",
    geometric: "#f59e0b",
    square: "#ec4899",
    cube: "#a855f7",
    fibonacci: "#22c55e",
    prime: "#f43f5e",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="number_sequences.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#ec4899] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#ec4899]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Number Sequences
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Identify the sequence type (arithmetic, geometric, square, cube,
            Fibonacci, prime). Enter the next two terms.
          </p>
          <p className="text-xs text-muted-foreground">
            {seqs.length} sequences | Hints available
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#ec4899" }}
            data-ocid="number_sequences.start_button"
          >
            Solve Sequences
          </button>
        </motion.div>
      )}
      {phase === "playing" && seq && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#ec4899] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {sIdx + 1}/{seqs.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={sIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-4"
            >
              <div
                className="rounded-xl border bg-card/40 p-4"
                style={{ borderColor: `${seqTypeColors[seq.type]}30` }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: seqTypeColors[seq.type] }}
                >
                  IDENTIFY THE PATTERN
                </p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {seq.terms.map((t, i) => (
                    <div
                      key={`t-${i}`}
                      className="px-3 py-1.5 rounded-lg border font-mono text-sm font-bold"
                      style={{
                        borderColor: `${seqTypeColors[seq.type]}40`,
                        background: `${seqTypeColors[seq.type]}15`,
                        color: seqTypeColors[seq.type],
                      }}
                    >
                      {t}
                    </div>
                  ))}
                  <div className="px-3 py-1.5 rounded-lg border-2 border-dashed border-[#ec4899]/50 font-mono text-sm font-bold text-muted-foreground">
                    ?
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border-2 border-dashed border-[#ec4899]/30 font-mono text-sm font-bold text-muted-foreground">
                    ?
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Type: {seq.type.charAt(0).toUpperCase() + seq.type.slice(1)}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  className="flex-1 rounded-lg border border-[#ec4899]/30 bg-background px-3 py-2 text-sm font-mono focus:border-[#ec4899] focus:outline-none"
                  placeholder="7th term"
                  data-ocid="number_sequences.input1"
                />
                <input
                  type="number"
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="flex-1 rounded-lg border border-[#ec4899]/30 bg-background px-3 py-2 text-sm font-mono focus:border-[#ec4899] focus:outline-none"
                  placeholder="8th term"
                  data-ocid="number_sequences.input2"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="px-4 py-2 rounded-lg font-bold text-sm text-white"
                  style={{ background: "#ec4899" }}
                  data-ocid="number_sequences.submit_button"
                >
                  Submit
                </button>
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-sm font-bold text-center ${feedback.good ? "text-[#22c55e]" : "text-[#f43f5e]"}`}
                  >
                    {feedback.msg}
                  </motion.p>
                )}
              </AnimatePresence>
              {!hintShown && !feedback && (
                <button
                  type="button"
                  onClick={() => setHintShown(true)}
                  className="self-start text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors"
                  data-ocid="number_sequences.hint_button"
                >
                  Hint (halves points)
                </button>
              )}
              {hintShown && (
                <p className="text-xs text-[#f59e0b] border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-2 rounded-lg">
                  Hint: {seq.hint}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export default function PatternRecognition({ config, onGameEnd }: Props) {
  if (config.gameId === "matrix-patterns")
    return <MatrixPatterns config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "number-sequences")
    return <NumberSequences config={config} onGameEnd={onGameEnd} />;
  return <PatternAnalyst config={config} onGameEnd={onGameEnd} />;
}
