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

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── GAME 1: Logic Chains ────────────────────────────────────────────────────
type PatternType =
  | "arithmetic"
  | "geometric"
  | "fibonacci"
  | "alternating"
  | "quadratic";
interface Pattern {
  sequence: number[];
  nextValue: number;
  rule: string;
  type: PatternType;
  options: number[];
}

function genPattern(diff: 1 | 2 | 3): Pattern {
  const types: PatternType[] =
    diff === 1
      ? ["arithmetic"]
      : diff === 2
        ? ["arithmetic", "geometric", "fibonacci"]
        : ["arithmetic", "geometric", "fibonacci", "alternating", "quadratic"];
  const type = types[randInt(0, types.length - 1)];
  let seq: number[];
  let next: number;
  let rule: string;
  if (type === "arithmetic") {
    const d = randInt(2, diff * 4);
    const start = randInt(1, 10);
    seq = Array.from({ length: 5 }, (_, i) => start + i * d);
    next = seq[4] + d;
    rule = `Add ${d} each time`;
  } else if (type === "geometric") {
    const r = randInt(2, 3);
    const start = randInt(1, 5);
    seq = Array.from({ length: 5 }, (_, i) => start * r ** i);
    next = seq[4] * r;
    rule = `Multiply by ${r} each time`;
  } else if (type === "fibonacci") {
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    seq = [a, b];
    for (let i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
    next = seq[4] + seq[3];
    rule = "Each term = sum of previous two";
  } else if (type === "alternating") {
    const base = randInt(2, 8);
    const step = randInt(1, 3);
    seq = Array.from({ length: 5 }, (_, i) =>
      i % 2 === 0 ? base + i * step : -(base + (i - 1) * step),
    );
    next = seq[4] + 2 * step;
    rule = "Alternating sign with increasing absolute value";
  } else {
    const a = randInt(1, 2);
    seq = Array.from({ length: 5 }, (_, i) => a * (i + 1) * (i + 1));
    next = a * 36;
    rule = `n-squared pattern (multiply by ${a})`;
  }
  const wrongOpts = [
    next + randInt(1, 5),
    next - randInt(1, 4),
    next * 2,
    Math.floor(next * 0.7),
  ].filter((o) => o !== next && o > 0);
  return {
    sequence: seq,
    nextValue: next,
    rule,
    type,
    options: shuffle([next, ...wrongOpts.slice(0, 3)]),
  };
}

// ── GAME 2: Proof Builder ───────────────────────────────────────────────────
type TruthClass = "always" | "sometimes" | "never";
interface MathStatement {
  statement: string;
  classification: TruthClass;
  exampleLabel: string;
  exampleOptions: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const MATH_STATEMENTS: MathStatement[] = [
  {
    statement: "The sum of two even numbers is even.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "4 + 6 = 10 (even)", isCorrect: true },
      { text: "3 + 5 = 8 (even)", isCorrect: false },
      { text: "2 + 3 = 5 (odd)", isCorrect: false },
    ],
    explanation: "Even + Even is always Even. (2n + 2m = 2(n+m))",
  },
  {
    statement: "The square of a number is positive.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "0\u00b2 = 0 (not positive)", isCorrect: true },
      { text: "3\u00b2 = 9 (positive)", isCorrect: false },
      { text: "(-2)\u00b2 = 4 (positive)", isCorrect: false },
    ],
    explanation:
      "0\u00b2 = 0 which is not positive, but all other squares are positive.",
  },
  {
    statement: "All prime numbers are odd.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "2 is prime and even", isCorrect: true },
      { text: "4 is even but not prime", isCorrect: false },
      { text: "1 is odd but not prime", isCorrect: false },
    ],
    explanation: "2 is the only even prime number. All other primes are odd.",
  },
  {
    statement: "A rectangle is a square.",
    classification: "sometimes",
    exampleLabel: "Example where true:",
    exampleOptions: [
      {
        text: "A 5x5 rectangle (all sides equal) is a square",
        isCorrect: true,
      },
      { text: "A 3x7 rectangle is always a square", isCorrect: false },
      { text: "Rectangles and squares are always different", isCorrect: false },
    ],
    explanation: "A square is a special rectangle where all sides are equal.",
  },
  {
    statement: "The product of two negative numbers is positive.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "(-3) \u00d7 (-4) = 12 (positive)", isCorrect: true },
      { text: "(-3) \u00d7 4 = -12 (negative)", isCorrect: false },
      { text: "(-1) \u00d7 (-1) = -1 (negative)", isCorrect: false },
    ],
    explanation: "Negative \u00d7 Negative = Positive. This is always true.",
  },
  {
    statement: "Dividing a number by 2 gives an integer.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "5 \u00f7 2 = 2.5 (not integer)", isCorrect: true },
      { text: "4 \u00f7 2 = 2 (integer)", isCorrect: false },
      { text: "All divisions produce integers", isCorrect: false },
    ],
    explanation:
      "Only even numbers divided by 2 give integers. Odd numbers do not.",
  },
  {
    statement: "The sum of two odd numbers is even.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "3 + 5 = 8 (even)", isCorrect: true },
      { text: "3 + 5 = 9 (odd)", isCorrect: false },
      { text: "Only sometimes even", isCorrect: false },
    ],
    explanation: "Odd + Odd = Even. (2n+1) + (2m+1) = 2(n+m+1).",
  },
  {
    statement: "A triangle can have two right angles.",
    classification: "never",
    exampleLabel: "Why impossible:",
    exampleOptions: [
      {
        text: "Two 90\u00b0 angles = 180\u00b0; a third angle is impossible",
        isCorrect: true,
      },
      {
        text: "Some special triangles have two right angles",
        isCorrect: false,
      },
      { text: "Only in obtuse triangles", isCorrect: false },
    ],
    explanation:
      "Angles in a triangle sum to 180\u00b0. Two right angles alone equal 180\u00b0, leaving 0\u00b0 for the third.",
  },
  {
    statement: "A number is divisible by 9 if its digit sum is divisible by 9.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "81: digits 8+1=9, divisible by 9", isCorrect: true },
      { text: "72: digits 7+2=9 but 72\u00f79=8 exactly", isCorrect: false },
      { text: "Only works for 2-digit numbers", isCorrect: false },
    ],
    explanation:
      "This divisibility rule for 9 always works for any whole number.",
  },
  {
    statement: "An even number is divisible by 4.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "6 is even but 6\u00f74 = 1.5 (not divisible)", isCorrect: true },
      { text: "All even numbers are divisible by 4", isCorrect: false },
      { text: "No even number is divisible by 4", isCorrect: false },
    ],
    explanation:
      "Only multiples of 4 (4,8,12,16,...) satisfy this. 2, 6, 10 etc. do not.",
  },
  {
    statement: "Adding 0 to a number changes it.",
    classification: "never",
    exampleLabel: "Proof:",
    exampleOptions: [
      {
        text: "n + 0 = n for any n. Zero is the additive identity.",
        isCorrect: true,
      },
      { text: "0 changes negative numbers only", isCorrect: false },
      { text: "Adding 0 multiplies by 0", isCorrect: false },
    ],
    explanation:
      "0 is the additive identity. n + 0 = n for all real numbers, always.",
  },
  {
    statement: "Squaring a fraction between 0 and 1 makes it larger.",
    classification: "never",
    exampleLabel: "Example:",
    exampleOptions: [
      {
        text: "(0.5)\u00b2 = 0.25, which is smaller than 0.5",
        isCorrect: true,
      },
      { text: "(0.5)\u00b2 = 1, which is larger", isCorrect: false },
      { text: "Only fractions above 0.9 get larger", isCorrect: false },
    ],
    explanation:
      "For 0 < x < 1, x\u00b2 < x. Multiplying a fraction by itself makes it smaller.",
  },
  {
    statement: "A quadrilateral with 4 equal sides is a square.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      {
        text: "A rhombus has 4 equal sides but is not a square",
        isCorrect: true,
      },
      { text: "Only squares have 4 equal sides", isCorrect: false },
      { text: "All 4-equal-sided shapes are squares", isCorrect: false },
    ],
    explanation:
      "A rhombus has 4 equal sides but non-right angles, so it is not a square.",
  },
  {
    statement: "The product of two fractions is larger than each fraction.",
    classification: "never",
    exampleLabel: "Example:",
    exampleOptions: [
      { text: "(1/2) \u00d7 (1/3) = 1/6, smaller than both", isCorrect: true },
      { text: "Product is always larger", isCorrect: false },
      { text: "Only true for improper fractions", isCorrect: false },
    ],
    explanation:
      "When both fractions are between 0 and 1, their product is always smaller than either.",
  },
  {
    statement: "Two lines that never meet are parallel.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      {
        text: "Two lines in 3D space can be skew (non-parallel, non-intersecting)",
        isCorrect: true,
      },
      { text: "Non-meeting lines are always parallel", isCorrect: false },
      { text: "In all cases, non-meeting = parallel", isCorrect: false },
    ],
    explanation:
      "In 2D: non-meeting = parallel. But in 3D space, skew lines never meet and are not parallel.",
  },
];

const TRUTH_COLORS: Record<TruthClass, string> = {
  always: "#4ade80",
  sometimes: "#f59e0b",
  never: "#f43f5e",
};
const TRUTH_LABELS: Record<TruthClass, string> = {
  always: "Always True",
  sometimes: "Sometimes True",
  never: "Never True",
};

// ── GAME 3: Reasoning Boss ──────────────────────────────────────────────────
interface MysteryPuzzle {
  range: [number, number];
  clues: { text: string; eliminate: (n: number) => boolean }[];
  answer: number;
}

function buildPuzzles(diff: 1 | 2 | 3): MysteryPuzzle[] {
  const count = diff === 1 ? 4 : diff === 2 ? 6 : 8;
  const allPuzzles: MysteryPuzzle[] = [
    {
      range: [21, 60],
      answer: 37,
      clues: [
        { text: "I am between 30 and 50.", eliminate: (n) => n < 30 || n > 50 },
        { text: "I am divisible by 7.", eliminate: (n) => n % 7 !== 0 },
        {
          text: "My digit sum is 10.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 10;
          },
        },
        {
          text: "I am not a perfect square.",
          eliminate: (n) => Number.isInteger(Math.sqrt(n)),
        },
        { text: "I am odd.", eliminate: (n) => n % 2 === 0 },
      ],
    },
    {
      range: [1, 50],
      answer: 12,
      clues: [
        { text: "I am less than 20.", eliminate: (n) => n >= 20 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        { text: "I am divisible by 3.", eliminate: (n) => n % 3 !== 0 },
        { text: "I am greater than 10.", eliminate: (n) => n <= 10 },
        { text: "I am not divisible by 4.", eliminate: (n) => n % 4 === 0 },
      ],
    },
    {
      range: [10, 60],
      answer: 45,
      clues: [
        { text: "I am a multiple of 5.", eliminate: (n) => n % 5 !== 0 },
        { text: "I am between 40 and 50.", eliminate: (n) => n < 40 || n > 50 },
        {
          text: "My digit sum is 9.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 9;
          },
        },
        {
          text: "I am a perfect square.",
          eliminate: (n) => !Number.isInteger(Math.sqrt(n)),
        },
        { text: "I am odd.", eliminate: (n) => n % 2 === 0 },
      ],
    },
    {
      range: [1, 40],
      answer: 28,
      clues: [
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        { text: "I am divisible by 4.", eliminate: (n) => n % 4 !== 0 },
        { text: "I am greater than 20.", eliminate: (n) => n <= 20 },
        { text: "I am not divisible by 7.", eliminate: (n) => n % 7 === 0 },
        {
          text: "My digit sum is 10.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 10;
          },
        },
      ],
    },
    {
      range: [20, 80],
      answer: 56,
      clues: [
        { text: "I am divisible by 8.", eliminate: (n) => n % 8 !== 0 },
        { text: "I am divisible by 7.", eliminate: (n) => n % 7 !== 0 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        { text: "I am less than 60.", eliminate: (n) => n >= 60 },
        { text: "I am greater than 50.", eliminate: (n) => n <= 50 },
      ],
    },
    {
      range: [1, 50],
      answer: 17,
      clues: [
        {
          text: "I am prime.",
          eliminate: (n) => {
            if (n < 2) return true;
            for (let i = 2; i <= Math.sqrt(n); i++)
              if (n % i === 0) return true;
            return false;
          },
        },
        { text: "I am greater than 15.", eliminate: (n) => n <= 15 },
        { text: "I am less than 20.", eliminate: (n) => n >= 20 },
        { text: "I am odd.", eliminate: (n) => n % 2 === 0 },
        {
          text: "My digits sum to 8.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 8;
          },
        },
      ],
    },
    {
      range: [30, 90],
      answer: 72,
      clues: [
        { text: "I am divisible by 9.", eliminate: (n) => n % 9 !== 0 },
        { text: "I am divisible by 8.", eliminate: (n) => n % 8 !== 0 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        { text: "I am between 65 and 80.", eliminate: (n) => n < 65 || n > 80 },
        {
          text: "My digit sum is 9.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 9;
          },
        },
      ],
    },
    {
      range: [1, 60],
      answer: 36,
      clues: [
        {
          text: "I am a perfect square.",
          eliminate: (n) => !Number.isInteger(Math.sqrt(n)),
        },
        { text: "I am divisible by 9.", eliminate: (n) => n % 9 !== 0 },
        { text: "I am greater than 30.", eliminate: (n) => n <= 30 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        {
          text: "My digit sum is 9.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 9;
          },
        },
      ],
    },
  ];
  return allPuzzles.slice(0, count);
}

export default function MathematicalReasoning({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // ── Shared ─────────────────────────────────────────────────────────────
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const totalRef = useRef(total);
  totalRef.current = total;
  const gameOverRef = useRef(false);

  const endGame = useCallback(
    (s: number, c: number, t: number, done: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = t > 0 ? (c / t) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          s,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          done,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    endGame(scoreRef.current, correctRef.current, totalRef.current, false);
  });
  const timePct = (timeLeft / config.timeLimit) * 100;

  // ── GAME 1 STATE ──────────────────────────────────────────────────────────
  const [g1Phase, setG1Phase] = useState<"idle" | "playing">("idle");
  const [pattern, setPattern] = useState<Pattern>(() =>
    genPattern(config.difficulty),
  );
  const [taskIdx, setTaskIdx] = useState(0);
  const [g1Feedback, setG1Feedback] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);
  const [questionTime, setQuestionTime] = useState(0);
  const questionStartRef = useRef(Date.now());
  const MAX_TASKS = 8;

  function g1Choose(option: number) {
    if (g1Feedback) return;
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    setQuestionTime(elapsed);
    const newTotal = total + 1;
    setTotal(newTotal);
    totalRef.current = newTotal;
    const ok = option === pattern.nextValue;
    const timeBonus =
      ok && elapsed < 2 ? 200 : ok && elapsed < 5 ? 100 : ok ? 50 : 0;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = score + timeBonus;
    setCorrect(newCorrect);
    correctRef.current = newCorrect;
    setScore(newScore);
    scoreRef.current = newScore;
    setG1Feedback({
      msg: ok
        ? `Correct! Rule: ${pattern.rule}. +${timeBonus}`
        : `Wrong. Answer: ${pattern.nextValue}. ${pattern.rule}`,
      ok,
    });
    const next = taskIdx + 1;
    if (next >= MAX_TASKS) {
      setTimeout(() => endGame(newScore, newCorrect, newTotal, true), 1200);
    } else {
      setTimeout(() => {
        setPattern(genPattern(config.difficulty));
        setG1Feedback(null);
        setTaskIdx(next);
        questionStartRef.current = Date.now();
      }, 1400);
    }
  }

  // ── GAME 2 STATE ──────────────────────────────────────────────────────────
  const stmtCount =
    config.difficulty === 1 ? 5 : config.difficulty === 2 ? 10 : 15;
  const [g2Statements] = useState<MathStatement[]>(() =>
    shuffle(MATH_STATEMENTS).slice(0, stmtCount),
  );
  const [g2Phase, setG2Phase] = useState<
    "idle" | "classify" | "justify" | "result"
  >("idle");
  const [g2Idx, setG2Idx] = useState(0);
  const [g2Class, setG2Class] = useState<TruthClass | null>(null);
  const [g2ExChoice, setG2ExChoice] = useState<number | null>(null);
  const [g2Submitted, setG2Submitted] = useState(false);

  const g2Stmt = g2Statements[g2Idx];

  function submitG2Classification() {
    if (!g2Class) return;
    const ok = g2Class === g2Stmt.classification;
    const pts = ok ? 200 * config.difficulty : 0;
    setScore((s) => {
      scoreRef.current = s + pts;
      return s + pts;
    });
    setTotal((t) => {
      totalRef.current = t + 1;
      return t + 1;
    });
    if (ok)
      setCorrect((c) => {
        correctRef.current = c + 1;
        return c + 1;
      });
    setG2Phase("justify");
  }

  function submitG2Justification() {
    if (g2ExChoice === null) return;
    const ok = g2Statements[g2Idx].exampleOptions[g2ExChoice].isCorrect;
    const pts = ok ? 150 * config.difficulty : 0;
    setScore((s) => {
      scoreRef.current = s + pts;
      return s + pts;
    });
    setTotal((t) => {
      totalRef.current = t + 1;
      return t + 1;
    });
    if (ok)
      setCorrect((c) => {
        correctRef.current = c + 1;
        return c + 1;
      });
    setG2Submitted(true);
  }

  function nextG2Statement() {
    const next = g2Idx + 1;
    if (next >= g2Statements.length) {
      endGame(scoreRef.current, correctRef.current, totalRef.current, true);
      return;
    }
    setG2Idx(next);
    setG2Class(null);
    setG2ExChoice(null);
    setG2Submitted(false);
    setG2Phase("classify");
  }

  // ── GAME 3 STATE ──────────────────────────────────────────────────────────
  const [g3Puzzles] = useState<MysteryPuzzle[]>(() =>
    buildPuzzles(config.difficulty),
  );
  const [g3Phase, setG3Phase] = useState<"idle" | "playing">("idle");
  const [g3PIdx, setG3PIdx] = useState(0);
  const [g3ClueIdx, setG3ClueIdx] = useState(0);
  const [g3Eliminated, setG3Eliminated] = useState<Set<number>>(new Set());
  const [g3Selected, setG3Selected] = useState<number | null>(null);
  const [g3Feedback, setG3Feedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [g3Confirmed, setG3Confirmed] = useState(false);

  const g3Puzzle = g3Puzzles[g3PIdx];
  const g3Numbers = g3Puzzle
    ? Array.from(
        { length: g3Puzzle.range[1] - g3Puzzle.range[0] + 1 },
        (_, i) => g3Puzzle.range[0] + i,
      )
    : [];

  function applyG3Clue() {
    if (!g3Puzzle || g3ClueIdx >= g3Puzzle.clues.length) return;
    const clue = g3Puzzle.clues[g3ClueIdx];
    const newElim = new Set(g3Eliminated);
    g3Numbers.forEach((n) => {
      if (clue.eliminate(n)) newElim.add(n);
    });
    setG3Eliminated(newElim);
    setG3ClueIdx((i) => i + 1);
  }

  function confirmG3Answer() {
    if (g3Selected === null || !g3Puzzle) return;
    const ok = g3Selected === g3Puzzle.answer;
    const pts = ok ? 300 * config.difficulty : 0;
    setScore((s) => {
      scoreRef.current = s + pts;
      return s + pts;
    });
    setTotal((t) => {
      totalRef.current = t + 1;
      return t + 1;
    });
    if (ok)
      setCorrect((c) => {
        correctRef.current = c + 1;
        return c + 1;
      });
    setG3Feedback({
      ok,
      msg: ok
        ? `Correct! The mystery number is ${g3Puzzle.answer}.`
        : `Wrong. It was ${g3Puzzle.answer}.`,
    });
    setG3Confirmed(true);
  }

  function nextG3Puzzle() {
    const next = g3PIdx + 1;
    if (next >= g3Puzzles.length) {
      endGame(scoreRef.current, correctRef.current, totalRef.current, true);
      return;
    }
    setG3PIdx(next);
    setG3ClueIdx(0);
    setG3Eliminated(new Set());
    setG3Selected(null);
    setG3Feedback(null);
    setG3Confirmed(false);
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="mathematical_reasoning.page"
    >
      <div className="w-full h-2 bg-muted rounded overflow-hidden shrink-0">
        <div
          className="h-full bg-[#06b6d4] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>

      {/* ═══════════ GAME 1: Logic Chains ═══════════ */}
      {gameId === "logic-chains" && (
        <>
          {g1Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#06b6d4]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Logic Chain
              </h2>
              <p className="text-muted-foreground text-center max-w-sm">
                Identify the pattern in sequences and select the next value.
                Faster answers earn more points.
              </p>
              <button
                type="button"
                onClick={() => {
                  startTimeRef.current = Date.now();
                  questionStartRef.current = Date.now();
                  setG1Phase("playing");
                  startTimer();
                }}
                className="px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity"
                data-ocid="mathematical_reasoning.start_button"
              >
                Find Patterns
              </button>
            </motion.div>
          )}
          {g1Phase === "playing" && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Pattern {taskIdx + 1}/{MAX_TASKS}
                </span>
                <span>
                  Score:{" "}
                  <span className="text-[#06b6d4] font-bold">{score}</span>
                </span>
                <span>{timeLeft}s | Fast bonus: &lt;2s</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={taskIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col items-center justify-center gap-6"
                >
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {pattern.sequence.map((v, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-lg border-2 border-[#06b6d4]/50 bg-card flex items-center justify-center text-xl font-black"
                      >
                        {v}
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-lg border-2 border-[#06b6d4] bg-[#06b6d4]/10 flex items-center justify-center text-2xl font-black text-[#06b6d4]">
                      ?
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {pattern.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => g1Choose(opt)}
                        className={`py-4 rounded-xl border-2 text-xl font-black transition-all hover:border-[#06b6d4] hover:bg-[#06b6d4]/10 ${
                          g1Feedback
                            ? opt === pattern.nextValue
                              ? "border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]"
                              : "border-border opacity-50"
                            : "border-border"
                        }`}
                        data-ocid={`mathematical_reasoning.option.${i + 1}`}
                        disabled={!!g1Feedback}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {g1Feedback && (
                    <p
                      className="text-sm font-bold"
                      style={{ color: g1Feedback.ok ? "#4ade80" : "#f43f5e" }}
                    >
                      {g1Feedback.msg}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 2: Proof Builder ═══════════ */}
      {gameId === "proof-builder" && (
        <>
          {g2Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#06b6d4]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Proof Builder
              </h2>
              <p className="text-muted-foreground text-center max-w-sm">
                {stmtCount} math statements to classify as
                Always/Sometimes/Never True — then justify with an example or
                counterexample.
              </p>
              <button
                type="button"
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setG2Phase("classify");
                  startTimer();
                }}
                className="px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90"
                data-ocid="mathematical_reasoning.pb_start_button"
              >
                Start Proving
              </button>
            </motion.div>
          )}
          {(g2Phase === "classify" ||
            g2Phase === "justify" ||
            g2Phase === "result") &&
            g2Stmt && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Statement {g2Idx + 1}/{g2Statements.length}
                  </span>
                  <span>
                    Score:{" "}
                    <span className="text-[#06b6d4] font-bold">{score}</span>
                  </span>
                  <span>{timeLeft}s</span>
                </div>
                <div className="rounded-xl border border-[#06b6d4]/30 bg-card/40 p-4">
                  <p className="text-xs uppercase tracking-widest text-[#06b6d4] mb-1">
                    Mathematical Statement
                  </p>
                  <p className="font-bold text-foreground text-sm">
                    {g2Stmt.statement}
                  </p>
                </div>
                {g2Phase === "classify" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      Is this statement:
                    </p>
                    {(["always", "sometimes", "never"] as TruthClass[]).map(
                      (cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setG2Class(cls)}
                          data-ocid={`mathematical_reasoning.class_${cls}`}
                          className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                            g2Class === cls
                              ? `border-[${TRUTH_COLORS[cls]}] bg-[${TRUTH_COLORS[cls]}]/10`
                              : "border-border hover:border-[#06b6d4]/50"
                          }`}
                          style={
                            g2Class === cls
                              ? {
                                  borderColor: TRUTH_COLORS[cls],
                                  background: `${TRUTH_COLORS[cls]}18`,
                                  color: TRUTH_COLORS[cls],
                                }
                              : {}
                          }
                        >
                          {TRUTH_LABELS[cls]}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      onClick={submitG2Classification}
                      disabled={!g2Class}
                      className="py-3 rounded-xl bg-[#06b6d4] text-black font-bold hover:opacity-90 disabled:opacity-40"
                      data-ocid="mathematical_reasoning.pb_classify_button"
                    >
                      Classify
                    </button>
                  </div>
                )}
                {g2Phase === "justify" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-foreground">
                      {g2Stmt.exampleLabel}
                    </p>
                    {g2Stmt.exampleOptions.map((ex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setG2ExChoice(i)}
                        disabled={g2Submitted}
                        data-ocid={`mathematical_reasoning.pb_example.${i + 1}`}
                        className={`py-3 px-4 rounded-xl border text-sm text-left transition-all ${
                          g2ExChoice === i
                            ? "border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4]"
                            : "border-border/40 hover:border-[#06b6d4]/40"
                        } ${g2Submitted && ex.isCorrect ? "border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]" : ""}`}
                      >
                        {ex.text}
                      </button>
                    ))}
                    {!g2Submitted ? (
                      <button
                        type="button"
                        onClick={submitG2Justification}
                        disabled={g2ExChoice === null}
                        className="py-3 rounded-xl bg-[#06b6d4] text-black font-bold hover:opacity-90 disabled:opacity-40"
                        data-ocid="mathematical_reasoning.pb_justify_button"
                      >
                        Submit Justification
                      </button>
                    ) : (
                      <div className="rounded-xl border border-[#06b6d4]/30 bg-card/30 p-3">
                        <p className="text-xs text-[#06b6d4] font-bold mb-1">
                          Explanation
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {g2Stmt.explanation}
                        </p>
                        <button
                          type="button"
                          onClick={nextG2Statement}
                          className="mt-2 px-4 py-1.5 rounded-lg bg-[#06b6d4] text-black font-bold text-xs"
                          data-ocid="mathematical_reasoning.pb_next_button"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
        </>
      )}

      {/* ═══════════ GAME 3: Reasoning Boss ═══════════ */}
      {gameId === "reasoning-boss" && (
        <>
          {g3Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#06b6d4]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Reasoning Boss
              </h2>
              <p className="text-muted-foreground text-center max-w-sm">
                A mystery number hides in a grid. Reveal clues one at a time,
                eliminate candidates, then deduce the answer.
              </p>
              <p className="text-xs text-muted-foreground">
                {g3Puzzles.length} puzzles | Difficulty {config.difficulty}
              </p>
              <button
                type="button"
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setG3Phase("playing");
                  startTimer();
                }}
                className="px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90"
                data-ocid="mathematical_reasoning.rb_start_button"
              >
                Begin Deduction
              </button>
            </motion.div>
          )}
          {g3Phase === "playing" && g3Puzzle && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Puzzle {g3PIdx + 1}/{g3Puzzles.length}
                </span>
                <span>
                  Score:{" "}
                  <span className="text-[#06b6d4] font-bold">{score}</span>
                </span>
                <span>{timeLeft}s</span>
              </div>
              <div className="rounded-xl border border-[#06b6d4]/30 bg-card/40 p-3">
                <p className="text-xs uppercase tracking-widest text-[#06b6d4] mb-2">
                  Clues Revealed ({g3ClueIdx}/{g3Puzzle.clues.length})
                </p>
                {g3Puzzle.clues.slice(0, g3ClueIdx).map((c, i) => (
                  <p key={i} className="text-xs text-foreground mb-0.5">
                    {i + 1}. {c.text}
                  </p>
                ))}
                {g3ClueIdx < g3Puzzle.clues.length && !g3Confirmed && (
                  <button
                    type="button"
                    onClick={applyG3Clue}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-[#06b6d4] text-black font-bold text-xs hover:opacity-90"
                    data-ocid="mathematical_reasoning.rb_clue_button"
                  >
                    Reveal Clue {g3ClueIdx + 1}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g3Numbers.map((n) => {
                  const elim = g3Eliminated.has(n);
                  const sel = g3Selected === n;
                  const cellStyle = sel
                    ? { borderColor: "#06b6d4", background: "#06b6d418" }
                    : elim
                      ? { opacity: 0.2 }
                      : {};
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => !elim && !g3Confirmed && setG3Selected(n)}
                      data-ocid={`mathematical_reasoning.rb_num.${n}`}
                      disabled={elim || g3Confirmed}
                      className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all ${sel ? "border-[#06b6d4] text-[#06b6d4]" : elim ? "border-muted text-muted line-through" : "border-border/40 hover:border-[#06b6d4]/50 text-foreground"}`}
                      style={cellStyle}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              {g3ClueIdx > 0 && !g3Confirmed && (
                <button
                  type="button"
                  onClick={confirmG3Answer}
                  disabled={g3Selected === null}
                  className="py-3 rounded-xl bg-[#06b6d4] text-black font-bold hover:opacity-90 disabled:opacity-40"
                  data-ocid="mathematical_reasoning.rb_confirm_button"
                >
                  My answer is: {g3Selected ?? "..."}
                </button>
              )}
              {g3Feedback && (
                <div
                  className={`rounded-xl border p-3 ${g3Feedback.ok ? "border-[#4ade80]/40 bg-[#4ade80]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`}
                >
                  <p
                    className="font-bold text-sm"
                    style={{ color: g3Feedback.ok ? "#4ade80" : "#f43f5e" }}
                  >
                    {g3Feedback.msg}
                  </p>
                  <button
                    type="button"
                    onClick={nextG3Puzzle}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-[#06b6d4] text-black font-bold text-xs"
                    data-ocid="mathematical_reasoning.rb_next_button"
                  >
                    {g3PIdx + 1 < g3Puzzles.length ? "Next Puzzle" : "Finish"}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
