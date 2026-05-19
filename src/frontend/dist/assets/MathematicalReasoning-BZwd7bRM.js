import { r as reactExports, j as jsxRuntimeExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function genPattern(diff) {
  const types = diff === 1 ? ["arithmetic"] : diff === 2 ? ["arithmetic", "geometric", "fibonacci"] : ["arithmetic", "geometric", "fibonacci", "alternating", "quadratic"];
  const type = types[randInt(0, types.length - 1)];
  let seq;
  let next;
  let rule;
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
    seq = Array.from(
      { length: 5 },
      (_, i) => i % 2 === 0 ? base + i * step : -(base + (i - 1) * step)
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
    Math.floor(next * 0.7)
  ].filter((o) => o !== next && o > 0);
  return {
    sequence: seq,
    nextValue: next,
    rule,
    type,
    options: shuffle([next, ...wrongOpts.slice(0, 3)])
  };
}
const MATH_STATEMENTS = [
  {
    statement: "The sum of two even numbers is even.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "4 + 6 = 10 (even)", isCorrect: true },
      { text: "3 + 5 = 8 (even)", isCorrect: false },
      { text: "2 + 3 = 5 (odd)", isCorrect: false }
    ],
    explanation: "Even + Even is always Even. (2n + 2m = 2(n+m))"
  },
  {
    statement: "The square of a number is positive.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "0² = 0 (not positive)", isCorrect: true },
      { text: "3² = 9 (positive)", isCorrect: false },
      { text: "(-2)² = 4 (positive)", isCorrect: false }
    ],
    explanation: "0² = 0 which is not positive, but all other squares are positive."
  },
  {
    statement: "All prime numbers are odd.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "2 is prime and even", isCorrect: true },
      { text: "4 is even but not prime", isCorrect: false },
      { text: "1 is odd but not prime", isCorrect: false }
    ],
    explanation: "2 is the only even prime number. All other primes are odd."
  },
  {
    statement: "A rectangle is a square.",
    classification: "sometimes",
    exampleLabel: "Example where true:",
    exampleOptions: [
      {
        text: "A 5x5 rectangle (all sides equal) is a square",
        isCorrect: true
      },
      { text: "A 3x7 rectangle is always a square", isCorrect: false },
      { text: "Rectangles and squares are always different", isCorrect: false }
    ],
    explanation: "A square is a special rectangle where all sides are equal."
  },
  {
    statement: "The product of two negative numbers is positive.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "(-3) × (-4) = 12 (positive)", isCorrect: true },
      { text: "(-3) × 4 = -12 (negative)", isCorrect: false },
      { text: "(-1) × (-1) = -1 (negative)", isCorrect: false }
    ],
    explanation: "Negative × Negative = Positive. This is always true."
  },
  {
    statement: "Dividing a number by 2 gives an integer.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "5 ÷ 2 = 2.5 (not integer)", isCorrect: true },
      { text: "4 ÷ 2 = 2 (integer)", isCorrect: false },
      { text: "All divisions produce integers", isCorrect: false }
    ],
    explanation: "Only even numbers divided by 2 give integers. Odd numbers do not."
  },
  {
    statement: "The sum of two odd numbers is even.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "3 + 5 = 8 (even)", isCorrect: true },
      { text: "3 + 5 = 9 (odd)", isCorrect: false },
      { text: "Only sometimes even", isCorrect: false }
    ],
    explanation: "Odd + Odd = Even. (2n+1) + (2m+1) = 2(n+m+1)."
  },
  {
    statement: "A triangle can have two right angles.",
    classification: "never",
    exampleLabel: "Why impossible:",
    exampleOptions: [
      {
        text: "Two 90° angles = 180°; a third angle is impossible",
        isCorrect: true
      },
      {
        text: "Some special triangles have two right angles",
        isCorrect: false
      },
      { text: "Only in obtuse triangles", isCorrect: false }
    ],
    explanation: "Angles in a triangle sum to 180°. Two right angles alone equal 180°, leaving 0° for the third."
  },
  {
    statement: "A number is divisible by 9 if its digit sum is divisible by 9.",
    classification: "always",
    exampleLabel: "Supporting example:",
    exampleOptions: [
      { text: "81: digits 8+1=9, divisible by 9", isCorrect: true },
      { text: "72: digits 7+2=9 but 72÷9=8 exactly", isCorrect: false },
      { text: "Only works for 2-digit numbers", isCorrect: false }
    ],
    explanation: "This divisibility rule for 9 always works for any whole number."
  },
  {
    statement: "An even number is divisible by 4.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      { text: "6 is even but 6÷4 = 1.5 (not divisible)", isCorrect: true },
      { text: "All even numbers are divisible by 4", isCorrect: false },
      { text: "No even number is divisible by 4", isCorrect: false }
    ],
    explanation: "Only multiples of 4 (4,8,12,16,...) satisfy this. 2, 6, 10 etc. do not."
  },
  {
    statement: "Adding 0 to a number changes it.",
    classification: "never",
    exampleLabel: "Proof:",
    exampleOptions: [
      {
        text: "n + 0 = n for any n. Zero is the additive identity.",
        isCorrect: true
      },
      { text: "0 changes negative numbers only", isCorrect: false },
      { text: "Adding 0 multiplies by 0", isCorrect: false }
    ],
    explanation: "0 is the additive identity. n + 0 = n for all real numbers, always."
  },
  {
    statement: "Squaring a fraction between 0 and 1 makes it larger.",
    classification: "never",
    exampleLabel: "Example:",
    exampleOptions: [
      {
        text: "(0.5)² = 0.25, which is smaller than 0.5",
        isCorrect: true
      },
      { text: "(0.5)² = 1, which is larger", isCorrect: false },
      { text: "Only fractions above 0.9 get larger", isCorrect: false }
    ],
    explanation: "For 0 < x < 1, x² < x. Multiplying a fraction by itself makes it smaller."
  },
  {
    statement: "A quadrilateral with 4 equal sides is a square.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      {
        text: "A rhombus has 4 equal sides but is not a square",
        isCorrect: true
      },
      { text: "Only squares have 4 equal sides", isCorrect: false },
      { text: "All 4-equal-sided shapes are squares", isCorrect: false }
    ],
    explanation: "A rhombus has 4 equal sides but non-right angles, so it is not a square."
  },
  {
    statement: "The product of two fractions is larger than each fraction.",
    classification: "never",
    exampleLabel: "Example:",
    exampleOptions: [
      { text: "(1/2) × (1/3) = 1/6, smaller than both", isCorrect: true },
      { text: "Product is always larger", isCorrect: false },
      { text: "Only true for improper fractions", isCorrect: false }
    ],
    explanation: "When both fractions are between 0 and 1, their product is always smaller than either."
  },
  {
    statement: "Two lines that never meet are parallel.",
    classification: "sometimes",
    exampleLabel: "Counterexample:",
    exampleOptions: [
      {
        text: "Two lines in 3D space can be skew (non-parallel, non-intersecting)",
        isCorrect: true
      },
      { text: "Non-meeting lines are always parallel", isCorrect: false },
      { text: "In all cases, non-meeting = parallel", isCorrect: false }
    ],
    explanation: "In 2D: non-meeting = parallel. But in 3D space, skew lines never meet and are not parallel."
  }
];
const TRUTH_COLORS = {
  always: "#4ade80",
  sometimes: "#f59e0b",
  never: "#f43f5e"
};
const TRUTH_LABELS = {
  always: "Always True",
  sometimes: "Sometimes True",
  never: "Never True"
};
function buildPuzzles(diff) {
  const count = diff === 1 ? 4 : diff === 2 ? 6 : 8;
  const allPuzzles = [
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
          }
        },
        {
          text: "I am not a perfect square.",
          eliminate: (n) => Number.isInteger(Math.sqrt(n))
        },
        { text: "I am odd.", eliminate: (n) => n % 2 === 0 }
      ]
    },
    {
      range: [1, 50],
      answer: 12,
      clues: [
        { text: "I am less than 20.", eliminate: (n) => n >= 20 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        { text: "I am divisible by 3.", eliminate: (n) => n % 3 !== 0 },
        { text: "I am greater than 10.", eliminate: (n) => n <= 10 },
        { text: "I am not divisible by 4.", eliminate: (n) => n % 4 === 0 }
      ]
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
          }
        },
        {
          text: "I am a perfect square.",
          eliminate: (n) => !Number.isInteger(Math.sqrt(n))
        },
        { text: "I am odd.", eliminate: (n) => n % 2 === 0 }
      ]
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
          }
        }
      ]
    },
    {
      range: [20, 80],
      answer: 56,
      clues: [
        { text: "I am divisible by 8.", eliminate: (n) => n % 8 !== 0 },
        { text: "I am divisible by 7.", eliminate: (n) => n % 7 !== 0 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        { text: "I am less than 60.", eliminate: (n) => n >= 60 },
        { text: "I am greater than 50.", eliminate: (n) => n <= 50 }
      ]
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
          }
        },
        { text: "I am greater than 15.", eliminate: (n) => n <= 15 },
        { text: "I am less than 20.", eliminate: (n) => n >= 20 },
        { text: "I am odd.", eliminate: (n) => n % 2 === 0 },
        {
          text: "My digits sum to 8.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 8;
          }
        }
      ]
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
          }
        }
      ]
    },
    {
      range: [1, 60],
      answer: 36,
      clues: [
        {
          text: "I am a perfect square.",
          eliminate: (n) => !Number.isInteger(Math.sqrt(n))
        },
        { text: "I am divisible by 9.", eliminate: (n) => n % 9 !== 0 },
        { text: "I am greater than 30.", eliminate: (n) => n <= 30 },
        { text: "I am even.", eliminate: (n) => n % 2 !== 0 },
        {
          text: "My digit sum is 9.",
          eliminate: (n) => {
            const d = String(n).split("");
            return d.reduce((a, c) => a + Number.parseInt(c), 0) !== 9;
          }
        }
      ]
    }
  ];
  return allPuzzles.slice(0, count);
}
function MathematicalReasoning({ config, onGameEnd }) {
  const gameId = config.gameId;
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const totalRef = reactExports.useRef(total);
  totalRef.current = total;
  const gameOverRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (s, c, t, done) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = t > 0 ? c / t * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          s,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          done
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    endGame(scoreRef.current, correctRef.current, totalRef.current, false);
  });
  const timePct = timeLeft / config.timeLimit * 100;
  const [g1Phase, setG1Phase] = reactExports.useState("idle");
  const [pattern, setPattern] = reactExports.useState(
    () => genPattern(config.difficulty)
  );
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
  const [g1Feedback, setG1Feedback] = reactExports.useState(null);
  const [questionTime, setQuestionTime] = reactExports.useState(0);
  const questionStartRef = reactExports.useRef(Date.now());
  const MAX_TASKS = 8;
  function g1Choose(option) {
    if (g1Feedback) return;
    const elapsed = (Date.now() - questionStartRef.current) / 1e3;
    setQuestionTime(elapsed);
    const newTotal = total + 1;
    setTotal(newTotal);
    totalRef.current = newTotal;
    const ok = option === pattern.nextValue;
    const timeBonus = ok && elapsed < 2 ? 200 : ok && elapsed < 5 ? 100 : ok ? 50 : 0;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = score + timeBonus;
    setCorrect(newCorrect);
    correctRef.current = newCorrect;
    setScore(newScore);
    scoreRef.current = newScore;
    setG1Feedback({
      msg: ok ? `Correct! Rule: ${pattern.rule}. +${timeBonus}` : `Wrong. Answer: ${pattern.nextValue}. ${pattern.rule}`,
      ok
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
  const stmtCount = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 10 : 15;
  const [g2Statements] = reactExports.useState(
    () => shuffle(MATH_STATEMENTS).slice(0, stmtCount)
  );
  const [g2Phase, setG2Phase] = reactExports.useState("idle");
  const [g2Idx, setG2Idx] = reactExports.useState(0);
  const [g2Class, setG2Class] = reactExports.useState(null);
  const [g2ExChoice, setG2ExChoice] = reactExports.useState(null);
  const [g2Submitted, setG2Submitted] = reactExports.useState(false);
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
  const [g3Puzzles] = reactExports.useState(
    () => buildPuzzles(config.difficulty)
  );
  const [g3Phase, setG3Phase] = reactExports.useState("idle");
  const [g3PIdx, setG3PIdx] = reactExports.useState(0);
  const [g3ClueIdx, setG3ClueIdx] = reactExports.useState(0);
  const [g3Eliminated, setG3Eliminated] = reactExports.useState(/* @__PURE__ */ new Set());
  const [g3Selected, setG3Selected] = reactExports.useState(null);
  const [g3Feedback, setG3Feedback] = reactExports.useState(null);
  const [g3Confirmed, setG3Confirmed] = reactExports.useState(false);
  const g3Puzzle = g3Puzzles[g3PIdx];
  const g3Numbers = g3Puzzle ? Array.from(
    { length: g3Puzzle.range[1] - g3Puzzle.range[0] + 1 },
    (_, i) => g3Puzzle.range[0] + i
  ) : [];
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
      msg: ok ? `Correct! The mystery number is ${g3Puzzle.answer}.` : `Wrong. It was ${g3Puzzle.answer}.`
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
    setG3Eliminated(/* @__PURE__ */ new Set());
    setG3Selected(null);
    setG3Feedback(null);
    setG3Confirmed(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "mathematical_reasoning.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#06b6d4] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        gameId === "logic-chains" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          g1Phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "flex-1 flex flex-col items-center justify-center gap-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black text-[#06b6d4]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Logic Chain"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Identify the pattern in sequences and select the next value. Faster answers earn more points." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      questionStartRef.current = Date.now();
                      setG1Phase("playing");
                      startTimer();
                    },
                    className: "px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                    "data-ocid": "mathematical_reasoning.start_button",
                    children: "Find Patterns"
                  }
                )
              ]
            }
          ),
          g1Phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Pattern ",
                taskIdx + 1,
                "/",
                MAX_TASKS
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                timeLeft,
                "s | Fast bonus: <2s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                className: "flex-1 flex flex-col items-center justify-center gap-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-center", children: [
                    pattern.sequence.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-14 h-14 rounded-lg border-2 border-[#06b6d4]/50 bg-card flex items-center justify-center text-xl font-black",
                        children: v
                      },
                      i
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg border-2 border-[#06b6d4] bg-[#06b6d4]/10 flex items-center justify-center text-2xl font-black text-[#06b6d4]", children: "?" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 w-full max-w-xs", children: pattern.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => g1Choose(opt),
                      className: `py-4 rounded-xl border-2 text-xl font-black transition-all hover:border-[#06b6d4] hover:bg-[#06b6d4]/10 ${g1Feedback ? opt === pattern.nextValue ? "border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]" : "border-border opacity-50" : "border-border"}`,
                      "data-ocid": `mathematical_reasoning.option.${i + 1}`,
                      disabled: !!g1Feedback,
                      children: opt
                    },
                    i
                  )) }),
                  g1Feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold",
                      style: { color: g1Feedback.ok ? "#4ade80" : "#f43f5e" },
                      children: g1Feedback.msg
                    }
                  )
                ]
              },
              taskIdx
            ) })
          ] })
        ] }),
        gameId === "proof-builder" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          g2Phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "flex-1 flex flex-col items-center justify-center gap-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black text-[#06b6d4]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Proof Builder"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                  stmtCount,
                  " math statements to classify as Always/Sometimes/Never True — then justify with an example or counterexample."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG2Phase("classify");
                      startTimer();
                    },
                    className: "px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90",
                    "data-ocid": "mathematical_reasoning.pb_start_button",
                    children: "Start Proving"
                  }
                )
              ]
            }
          ),
          (g2Phase === "classify" || g2Phase === "justify" || g2Phase === "result") && g2Stmt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Statement ",
                g2Idx + 1,
                "/",
                g2Statements.length
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                timeLeft,
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#06b6d4]/30 bg-card/40 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-[#06b6d4] mb-1", children: "Mathematical Statement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-sm", children: g2Stmt.statement })
            ] }),
            g2Phase === "classify" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Is this statement:" }),
              ["always", "sometimes", "never"].map(
                (cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setG2Class(cls),
                    "data-ocid": `mathematical_reasoning.class_${cls}`,
                    className: `py-3 rounded-xl border-2 font-bold text-sm transition-all ${g2Class === cls ? `border-[${TRUTH_COLORS[cls]}] bg-[${TRUTH_COLORS[cls]}]/10` : "border-border hover:border-[#06b6d4]/50"}`,
                    style: g2Class === cls ? {
                      borderColor: TRUTH_COLORS[cls],
                      background: `${TRUTH_COLORS[cls]}18`,
                      color: TRUTH_COLORS[cls]
                    } : {},
                    children: TRUTH_LABELS[cls]
                  },
                  cls
                )
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submitG2Classification,
                  disabled: !g2Class,
                  className: "py-3 rounded-xl bg-[#06b6d4] text-black font-bold hover:opacity-90 disabled:opacity-40",
                  "data-ocid": "mathematical_reasoning.pb_classify_button",
                  children: "Classify"
                }
              )
            ] }),
            g2Phase === "justify" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: g2Stmt.exampleLabel }),
              g2Stmt.exampleOptions.map((ex, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setG2ExChoice(i),
                  disabled: g2Submitted,
                  "data-ocid": `mathematical_reasoning.pb_example.${i + 1}`,
                  className: `py-3 px-4 rounded-xl border text-sm text-left transition-all ${g2ExChoice === i ? "border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4]" : "border-border/40 hover:border-[#06b6d4]/40"} ${g2Submitted && ex.isCorrect ? "border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]" : ""}`,
                  children: ex.text
                },
                i
              )),
              !g2Submitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submitG2Justification,
                  disabled: g2ExChoice === null,
                  className: "py-3 rounded-xl bg-[#06b6d4] text-black font-bold hover:opacity-90 disabled:opacity-40",
                  "data-ocid": "mathematical_reasoning.pb_justify_button",
                  children: "Submit Justification"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#06b6d4]/30 bg-card/30 p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#06b6d4] font-bold mb-1", children: "Explanation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: g2Stmt.explanation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: nextG2Statement,
                    className: "mt-2 px-4 py-1.5 rounded-lg bg-[#06b6d4] text-black font-bold text-xs",
                    "data-ocid": "mathematical_reasoning.pb_next_button",
                    children: "Next"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        gameId === "reasoning-boss" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          g3Phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "flex-1 flex flex-col items-center justify-center gap-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black text-[#06b6d4]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Reasoning Boss"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "A mystery number hides in a grid. Reveal clues one at a time, eliminate candidates, then deduce the answer." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  g3Puzzles.length,
                  " puzzles | Difficulty ",
                  config.difficulty
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG3Phase("playing");
                      startTimer();
                    },
                    className: "px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90",
                    "data-ocid": "mathematical_reasoning.rb_start_button",
                    children: "Begin Deduction"
                  }
                )
              ]
            }
          ),
          g3Phase === "playing" && g3Puzzle && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Puzzle ",
                g3PIdx + 1,
                "/",
                g3Puzzles.length
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                timeLeft,
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#06b6d4]/30 bg-card/40 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-[#06b6d4] mb-2", children: [
                "Clues Revealed (",
                g3ClueIdx,
                "/",
                g3Puzzle.clues.length,
                ")"
              ] }),
              g3Puzzle.clues.slice(0, g3ClueIdx).map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground mb-0.5", children: [
                i + 1,
                ". ",
                c.text
              ] }, i)),
              g3ClueIdx < g3Puzzle.clues.length && !g3Confirmed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: applyG3Clue,
                  className: "mt-2 px-4 py-1.5 rounded-lg bg-[#06b6d4] text-black font-bold text-xs hover:opacity-90",
                  "data-ocid": "mathematical_reasoning.rb_clue_button",
                  children: [
                    "Reveal Clue ",
                    g3ClueIdx + 1
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: g3Numbers.map((n) => {
              const elim = g3Eliminated.has(n);
              const sel = g3Selected === n;
              const cellStyle = sel ? { borderColor: "#06b6d4", background: "#06b6d418" } : elim ? { opacity: 0.2 } : {};
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => !elim && !g3Confirmed && setG3Selected(n),
                  "data-ocid": `mathematical_reasoning.rb_num.${n}`,
                  disabled: elim || g3Confirmed,
                  className: `w-9 h-9 rounded-lg border text-xs font-bold transition-all ${sel ? "border-[#06b6d4] text-[#06b6d4]" : elim ? "border-muted text-muted line-through" : "border-border/40 hover:border-[#06b6d4]/50 text-foreground"}`,
                  style: cellStyle,
                  children: n
                },
                n
              );
            }) }),
            g3ClueIdx > 0 && !g3Confirmed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: confirmG3Answer,
                disabled: g3Selected === null,
                className: "py-3 rounded-xl bg-[#06b6d4] text-black font-bold hover:opacity-90 disabled:opacity-40",
                "data-ocid": "mathematical_reasoning.rb_confirm_button",
                children: [
                  "My answer is: ",
                  g3Selected ?? "..."
                ]
              }
            ),
            g3Feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-xl border p-3 ${g3Feedback.ok ? "border-[#4ade80]/40 bg-[#4ade80]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-bold text-sm",
                      style: { color: g3Feedback.ok ? "#4ade80" : "#f43f5e" },
                      children: g3Feedback.msg
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: nextG3Puzzle,
                      className: "mt-2 px-4 py-1.5 rounded-lg bg-[#06b6d4] text-black font-bold text-xs",
                      "data-ocid": "mathematical_reasoning.rb_next_button",
                      children: g3PIdx + 1 < g3Puzzles.length ? "Next Puzzle" : "Finish"
                    }
                  )
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  MathematicalReasoning as default
};
