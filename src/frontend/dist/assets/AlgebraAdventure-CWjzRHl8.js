import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function genEquation(diff) {
  if (diff === 1) {
    const x2 = randInt(1, 10);
    const b2 = randInt(0, 20);
    const result2 = x2 + b2;
    return {
      text: `x + ${b2} = ${result2}`,
      variable: "x",
      answer: x2,
      steps: [
        `Subtract ${b2} from both sides`,
        `x = ${result2} - ${b2}`,
        `x = ${x2}`
      ]
    };
  }
  if (diff === 2) {
    const x2 = randInt(1, 8);
    const a2 = randInt(2, 5);
    const b2 = randInt(0, 15);
    const result2 = a2 * x2 + b2;
    return {
      text: `${a2}x + ${b2} = ${result2}`,
      variable: "x",
      answer: x2,
      steps: [
        `Subtract ${b2} from both sides`,
        `${a2}x = ${result2 - b2}`,
        `Divide both sides by ${a2}`,
        `x = ${x2}`
      ]
    };
  }
  const x = randInt(1, 6);
  const a = randInt(2, 4);
  const b = randInt(1, 10);
  const c = randInt(1, 3);
  const d = randInt(0, 15);
  const result = a * x + b - c * x + d;
  const coeff = a - c;
  if (coeff <= 0) return genEquation(diff);
  return {
    text: `${a}x + ${b} = ${c}x + ${result - b + c * x}`,
    variable: "x",
    answer: x,
    steps: [
      `Collect x terms: (${a}-${c})x = ${result - b + c * x - b}`,
      `${coeff}x = ${coeff * x}`,
      `x = ${x}`
    ]
  };
}
const GATE_COUNT = 5;
const BOSS_HP = 3;
function EquationQuest({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState(
    "idle"
  );
  const [gate, setGate] = reactExports.useState(0);
  const [eq, setEq] = reactExports.useState(genEquation(config.difficulty));
  const [input, setInput] = reactExports.useState("");
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [bossHP, setBossHP] = reactExports.useState(BOSS_HP);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [showSteps, setShowSteps] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const totalRef = reactExports.useRef(total);
  totalRef.current = total;
  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    setPhase("over");
    const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
    onGameEnd(buildResult(config, scoreRef.current, acc, timeSpent, false));
  });
  const endGame = reactExports.useCallback(
    (completed) => {
      setPhase("over");
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd]
  );
  function submit() {
    const val = Number.parseFloat(input.trim());
    setTotal((t) => t + 1);
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    if (val === eq.answer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150);
      setFeedback({ msg: `Correct! ${eq.variable} = ${eq.answer}`, ok: true });
      setShowSteps(false);
      if (phase === "boss") {
        const n = bossHP - 1;
        setBossHP(n);
        if (n <= 0) {
          setTimeout(() => endGame(true), 800);
          return;
        }
      } else {
        const next = gate + 1;
        if (next >= GATE_COUNT) {
          setTimeout(() => {
            setPhase("boss");
            setEq(genEquation(config.difficulty === 1 ? 2 : 3));
            setInput("");
            setFeedback(null);
          }, 800);
          return;
        }
        setGate(next);
      }
    } else {
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) {
          setTimeout(() => endGame(false), 800);
        }
        return n;
      });
      setFeedback({ msg: `Wrong. The answer is ${eq.answer}`, ok: false });
    }
    setTimeout(() => {
      setEq(genEquation(config.difficulty));
      setInput("");
      setFeedback(null);
    }, 1e3);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "algebra_adventure.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#4ade80]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Equation Solver Quest"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                "Solve ",
                GATE_COUNT,
                " algebraic equations to unlock the path forward, then defeat the boss with multi-step equations."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                    startTimer();
                    setEq(genEquation(config.difficulty));
                  },
                  className: "px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "algebra_adventure.start_button",
                  children: "Enter the Quest"
                }
              )
            ]
          }
        ),
        (phase === "playing" || phase === "boss") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#4ade80] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: phase === "boss" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-bold", children: "BOSS BATTLE" }) : `Gate ${gate + 1}/${GATE_COUNT}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Lives: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-bold", children: lives })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score }),
              " |",
              " ",
              timeLeft,
              "s"
            ] })
          ] }),
          phase === "boss" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-4 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-red-500 transition-all duration-300",
              style: { width: `${bossHP / BOSS_HP * 100}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-2", children: [
            Array.from({ length: GATE_COUNT }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-8 h-8 rounded flex items-center justify-center text-xs font-bold border transition-colors ${i < gate ? "bg-[#4ade80] text-black border-[#4ade80]" : i === gate ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`,
                children: i + 1
              },
              i
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-8 h-8 rounded flex items-center justify-center text-xs font-bold border transition-colors ${phase === "boss" ? "border-red-400 text-red-400 animate-pulse" : "border-border text-muted-foreground"}`,
                children: "B"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: "flex-1 flex flex-col items-center justify-center gap-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-4xl font-black text-center",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: eq.text
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Solve for ",
                  eq.variable
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-2xl font-bold rounded border-2 border-[#4ade80]/50 bg-card focus:border-[#4ade80] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "algebra_adventure.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-6 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "algebra_adventure.submit_button",
                      children: "Solve!"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowSteps((s) => !s),
                    className: "text-xs text-muted-foreground underline",
                    "data-ocid": "algebra_adventure.hint_button",
                    children: showSteps ? "Hide steps" : "Show steps"
                  }
                ),
                showSteps && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded border border-[#4ade80]/30 bg-card text-sm space-y-1", children: eq.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
                  i + 1,
                  ". ",
                  s
                ] }, i)) }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-bold",
                    style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                    children: feedback.msg
                  }
                )
              ]
            },
            eq.text
          ) })
        ] })
      ]
    }
  );
}
function genVHProblem(diff) {
  const varNames = ["x", "y", "z", "a", "b"];
  if (diff === 1) {
    const name = varNames[randInt(0, 1)];
    const coeff = randInt(2, 9);
    const c = randInt(1, 20);
    const val = randInt(1, 10);
    const answer2 = coeff * val + c;
    return {
      expression: `${coeff}${name} + ${c}`,
      vars: [{ name, value: val }],
      answer: answer2
    };
  }
  if (diff === 2) {
    const n12 = varNames[0];
    const n22 = varNames[1];
    const c12 = randInt(1, 6);
    const c22 = randInt(1, 6);
    const add = randInt(0, 15);
    const v12 = randInt(1, 8);
    const v22 = randInt(1, 8);
    const answer2 = c12 * v12 + c22 * v22 + add;
    return {
      expression: `${c12}${n12} + ${c22}${n22} + ${add}`,
      vars: [
        { name: n12, value: v12 },
        { name: n22, value: v22 }
      ],
      answer: answer2
    };
  }
  const n1 = varNames[0];
  const n2 = varNames[1];
  const n3 = varNames[2];
  const c1 = randInt(1, 5);
  const c2 = randInt(1, 5);
  const c3 = randInt(1, 5);
  const v1 = randInt(1, 6);
  const v2 = randInt(1, 6);
  const v3 = randInt(1, 6);
  const answer = c1 * v1 - c2 * v2 + c3 * v3;
  return {
    expression: `${c1}${n1} - ${c2}${n2} + ${c3}${n3}`,
    vars: [
      { name: n1, value: v1 },
      { name: n2, value: v2 },
      { name: n3, value: v3 }
    ],
    answer
  };
}
function VariableHunter({ config, onGameEnd }) {
  const TOTAL = 12;
  const [phase, setPhase] = reactExports.useState("idle");
  const [problem, setProblem] = reactExports.useState(
    genVHProblem(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (s, c) => {
      const acc = c / TOTAL * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd]
  );
  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const ok = val === problem.answer;
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    const substituted = problem.vars.map((v) => `${v.name}=${v.value}`).join(", ");
    setFeedback({
      msg: ok ? `Correct! ${problem.expression} = ${problem.answer} (${substituted})` : `Wrong. ${problem.expression} when ${substituted} = ${problem.answer}`,
      ok
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setProblem(genVHProblem(config.difficulty));
      setInput("");
      setFeedback(null);
      setQIdx(next);
    }, 1200);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "variable_hunter.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#4ade80]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Variable Hunter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "An expression is shown with variable values given. Substitute and evaluate to find the answer. 12 problems." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "variable_hunter.start_button",
                  children: "Hunt Variables"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Problem ",
              qIdx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#4ade80] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: "flex-1 flex flex-col items-center justify-center gap-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl border-2 border-[#4ade80]/40 bg-card text-center space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-3xl font-black",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: problem.expression
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 justify-center flex-wrap", children: problem.vars.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "px-3 py-1 rounded bg-[#4ade80]/10 border border-[#4ade80]/30 text-sm font-mono font-bold",
                      children: [
                        v.name,
                        " = ",
                        v.value
                      ]
                    },
                    i
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Evaluate the expression" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-2xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "variable_hunter.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-6 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "variable_hunter.submit_button",
                      children: "Evaluate"
                    }
                  )
                ] }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-bold text-center",
                    style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                    children: feedback.msg
                  }
                )
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
const WORD_PROBLEMS = [
  {
    story: "Kofi buys 3 pens. Each pen costs x cedis. He pays 24 cedis total.",
    question: "What is the cost per pen?",
    equation: "3x = 24",
    setupOptions: ["3x = 24", "x + 3 = 24", "3 + x = 24", "x/3 = 24"],
    correctSetup: "3x = 24",
    answer: 8
  },
  {
    story: "Ama is 5 years older than her brother. Together their ages sum to 25.",
    question: "How old is her brother?",
    equation: "x + (x+5) = 25",
    setupOptions: ["x + (x+5) = 25", "2x = 25", "x + 5 = 25", "2x + 5 = 25"],
    correctSetup: "x + (x+5) = 25",
    answer: 10
  },
  {
    story: "A rectangle's length is twice its width. The perimeter is 36 cm.",
    question: "What is the width?",
    equation: "2(2w + w) = 36",
    setupOptions: ["2(2w+w) = 36", "2w = 36", "3w = 36", "2w + w = 36"],
    correctSetup: "2(2w+w) = 36",
    answer: 6
  },
  {
    story: "Kwame earns GHS x per hour. After 8 hours he has GHS 96.",
    question: "What is his hourly rate?",
    equation: "8x = 96",
    setupOptions: ["8x = 96", "x + 8 = 96", "x/8 = 96", "8 + x = 96"],
    correctSetup: "8x = 96",
    answer: 12
  },
  {
    story: "A number multiplied by 6 then reduced by 4 equals 32.",
    question: "What is the number?",
    equation: "6x - 4 = 32",
    setupOptions: ["6x - 4 = 32", "6x + 4 = 32", "6(x-4) = 32", "x - 4 = 32"],
    correctSetup: "6x - 4 = 32",
    answer: 6
  },
  {
    story: "Adwoa buys apples at x cedis each and oranges at 3 cedis each. She buys 4 apples and 2 oranges for 22 cedis.",
    question: "What is the price per apple?",
    equation: "4x + 6 = 22",
    setupOptions: ["4x + 6 = 22", "4x + 2 = 22", "6x + 2 = 22", "4x - 6 = 22"],
    correctSetup: "4x + 6 = 22",
    answer: 4
  },
  {
    story: "The school has 240 students. The ratio of girls to boys is 3:5.",
    question: "How many girls are there?",
    equation: "3x + 5x = 240",
    setupOptions: ["3x + 5x = 240", "3x = 240", "5x = 240", "3/5 = x/240"],
    correctSetup: "3x + 5x = 240",
    answer: 90
  },
  {
    story: "A bus travels x km/h. It covers 180 km in 3 hours.",
    question: "What is its speed?",
    equation: "3x = 180",
    setupOptions: ["3x = 180", "x/3 = 180", "x + 3 = 180", "x - 3 = 180"],
    correctSetup: "3x = 180",
    answer: 60
  },
  {
    story: "Yaw saves GHS x per month. After 12 months he has 1440 cedis.",
    question: "How much does he save monthly?",
    equation: "12x = 1440",
    setupOptions: [
      "12x = 1440",
      "x + 12 = 1440",
      "12/x = 1440",
      "x - 12 = 1440"
    ],
    correctSetup: "12x = 1440",
    answer: 120
  },
  {
    story: "Two numbers differ by 8. Their sum is 44.",
    question: "What is the smaller number?",
    equation: "x + (x+8) = 44",
    setupOptions: ["x + (x+8) = 44", "2x = 44", "x + 8 = 44", "2x + 8 = 44"],
    correctSetup: "x + (x+8) = 44",
    answer: 18
  }
];
function AlgebraBoss({ config, onGameEnd }) {
  const TOTAL = 10;
  const [phase, setPhase] = reactExports.useState("idle");
  const [problems] = reactExports.useState(() => shuffle(WORD_PROBLEMS).slice(0, TOTAL));
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [step, setStep] = reactExports.useState("setup");
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (s, c) => {
      const acc = c / TOTAL * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd]
  );
  const problem = problems[qIdx];
  function chooseSetup(opt) {
    const ok = opt === problem.correctSetup;
    setFeedback({
      msg: ok ? `Correct! Equation: ${problem.correctSetup}` : `Wrong. The correct equation is: ${problem.correctSetup}`,
      ok
    });
    setTimeout(() => {
      if (ok) {
        setStep("solve");
      } else {
        setStep("solve");
      }
      setFeedback(null);
    }, 1e3);
  }
  function submitSolve() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const ok = val === problem.answer;
    const newScore = ok ? score + 200 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! x = ${problem.answer}` : `Wrong. x = ${problem.answer}`,
      ok
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setQIdx(next);
      setStep("setup");
      setInput("");
      setFeedback(null);
    }, 1e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "algebra_boss.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#4ade80]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Algebra Boss Arena"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "10 real-world word problems. Choose the correct algebraic equation, then solve for x. Points based on accuracy." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "algebra_boss.start_button",
                  children: "Enter Arena"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Problem ",
              qIdx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#4ade80] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `px-3 py-1 rounded text-xs font-bold border ${step === "setup" ? "border-[#4ade80] text-[#4ade80]" : "border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10"}`,
                children: "1. Set Up Equation"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `px-3 py-1 rounded text-xs font-bold border ${step === "solve" ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`,
                children: "2. Solve for x"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              className: "flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border/30 bg-card space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: problem.story }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#4ade80]", children: problem.question })
                ] }),
                step === "setup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose the correct algebraic equation:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: problem.setupOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => chooseSetup(opt),
                      className: "py-3 px-2 rounded-lg border-2 border-border text-sm font-mono font-bold hover:border-[#4ade80]/60 hover:bg-[#4ade80]/10 transition-all",
                      "data-ocid": `algebra_boss.setup.${i + 1}`,
                      children: opt
                    },
                    i
                  )) })
                ] }),
                step === "solve" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                    "Solve:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-[#4ade80]", children: problem.equation })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        value: input,
                        onChange: (e) => setInput(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && submitSolve(),
                        className: "w-32 text-center text-2xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2",
                        placeholder: "x = ?",
                        "data-ocid": "algebra_boss.solve_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: submitSolve,
                        className: "px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
                        "data-ocid": "algebra_boss.solve_submit",
                        children: "Submit"
                      }
                    )
                  ] })
                ] }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-bold",
                    style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                    children: feedback.msg
                  }
                )
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
function AlgebraAdventure({ config, onGameEnd }) {
  if (config.gameId === "variable-hunter")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(VariableHunter, { config, onGameEnd });
  if (config.gameId === "algebra-boss")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlgebraBoss, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(EquationQuest, { config, onGameEnd });
}
export {
  AlgebraAdventure as default
};
