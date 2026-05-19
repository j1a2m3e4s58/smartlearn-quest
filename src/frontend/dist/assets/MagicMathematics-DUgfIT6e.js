import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function genVedicProblem(diff) {
  const maxD = diff === 1 ? 5 : diff === 2 ? 8 : 12;
  const d1 = randInt(1, maxD);
  const d2 = randInt(1, maxD);
  const a = 100 - d1;
  const b = 100 - d2;
  const left = a - d2;
  const right = d1 * d2;
  return { a, b, answer: a * b, d1, d2, left, right };
}
const VEDIC_EXAMPLES = [
  { a: 97, b: 96, d1: 3, d2: 4, left: 93, right: 12, answer: 9312 },
  { a: 98, b: 95, d1: 2, d2: 5, left: 93, right: 10, answer: 9310 },
  { a: 94, b: 93, d1: 6, d2: 7, left: 87, right: 42, answer: 8742 }
];
function VedicDojo({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState(
    "idle"
  );
  const [exIdx, setExIdx] = reactExports.useState(0);
  const [probIdx, setProbIdx] = reactExports.useState(0);
  const [problems] = reactExports.useState(
    () => Array.from({ length: 20 }, () => genVedicProblem(config.difficulty))
  );
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [probTime, setProbTime] = reactExports.useState(8);
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const doneRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (won) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          correctRef.current / 20 * 100,
          Math.floor((Date.now() - startRef.current) / 1e3),
          won
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  reactExports.useEffect(() => {
    if (phase !== "practice") return;
    if (probTime <= 0) {
      const p = problems[probIdx];
      setFeedback({ msg: `Time up! ${p.a} x ${p.b} = ${p.answer}`, ok: false });
      setTimeout(() => nextProb(), 2e3);
      return;
    }
    const t = setTimeout(() => setProbTime((prev) => prev - 1), 1e3);
    return () => clearTimeout(t);
  });
  function nextProb() {
    const next = probIdx + 1;
    if (next >= 20) {
      endGame(true);
      return;
    }
    setProbIdx(next);
    setInput("");
    setFeedback(null);
    setProbTime(8);
  }
  function submit() {
    if (feedback) return;
    const val = Number.parseInt(input.trim(), 10);
    const prob2 = problems[probIdx];
    const ok = val === prob2.answer;
    if (ok) setCorrect((c) => c + 1);
    setScore((s) => s + (ok ? 200 * config.difficulty : 0));
    const rightStr2 = prob2.right < 10 ? `0${prob2.right}` : `${prob2.right}`;
    setFeedback({
      msg: ok ? `Correct! Left: ${prob2.a}-${prob2.d2}=${prob2.left}, Right: ${prob2.d1}x${prob2.d2}=${rightStr2}` : `Wrong. Left: ${prob2.left}, Right: ${rightStr2} -> Answer: ${prob2.answer}`,
      ok
    });
    setTimeout(() => nextProb(), 2200);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const prob = problems[probIdx];
  const ex = VEDIC_EXAMPLES[exIdx];
  const rightStr = ex.right < 10 ? `0${ex.right}` : `${ex.right}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "vedic_dojo.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#f59e0b]", children: [
            score.toLocaleString(),
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#f59e0b] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Vedic Math Dojo"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Master the Vedic near-100 multiplication method. Study 3 worked examples, then solve 20 timed problems in 8 seconds each." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-card/50 p-4 max-w-sm w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-[#f59e0b] mb-2", children: "Method" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "1. Find deficits: d1 = 100 - A, d2 = 100 - B" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "2. Left part: A - d2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "3. Right part: d1 x d2 (2 digits, pad if needed)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "4. Combine left + right for the answer" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPhase("tutorial"),
                  className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90",
                  "data-ocid": "vedic_dojo.start_button",
                  children: "Study Examples"
                }
              )
            ]
          }
        ),
        phase === "tutorial" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Example ",
            exIdx + 1,
            " of ",
            VEDIC_EXAMPLES.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0 },
              className: "rounded-xl border border-[#f59e0b]/30 bg-card/50 p-5 space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-2xl font-black text-center",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      ex.a,
                      " x ",
                      ex.b,
                      " = ?"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#f59e0b] text-black font-bold text-xs flex items-center justify-center", children: "1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Deficits: d1 = 100 - ",
                      ex.a,
                      " =",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: ex.d1 }),
                      ", d2 = 100 - ",
                      ex.b,
                      " =",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: ex.d2 })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#00f5ff] text-black font-bold text-xs flex items-center justify-center", children: "2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Left: ",
                      ex.a,
                      " - ",
                      ex.d2,
                      " =",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold", children: ex.left })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#10b981] text-black font-bold text-xs flex items-center justify-center", children: "3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Right: ",
                      ex.d1,
                      " x ",
                      ex.d2,
                      " =",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: rightStr })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#e879f9] text-black font-bold text-xs flex items-center justify-center", children: "4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Answer:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#e879f9] font-bold text-lg", children: ex.answer })
                    ] })
                  ] })
                ] })
              ]
            },
            exIdx
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            exIdx + 1 < VEDIC_EXAMPLES.length && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setExIdx((i) => i + 1),
                className: "flex-1 py-2 rounded-lg border border-[#f59e0b]/30 text-sm hover:bg-[#f59e0b]/10",
                "data-ocid": "vedic_dojo.next_example_button",
                children: "Next Example"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setPhase("practice"),
                className: "flex-1 py-2 rounded-lg bg-[#f59e0b] text-black font-bold text-sm hover:opacity-90",
                "data-ocid": "vedic_dojo.practice_button",
                children: "Start Practice"
              }
            )
          ] })
        ] }),
        phase === "practice" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Problem ",
                  probIdx + 1,
                  "/20"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: probTime <= 3 ? "text-[#f43f5e] font-bold" : "", children: [
                  probTime,
                  "s"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-card/50 p-5 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2 uppercase tracking-widest", children: "Near-100 Multiplication" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-4xl font-black",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      prob.a,
                      " x ",
                      prob.b
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && !feedback && submit(),
                    disabled: !!feedback,
                    className: "flex-1 text-center text-2xl font-bold rounded-lg border-2 border-[#f59e0b]/40 bg-background focus:border-[#f59e0b] focus:outline-none p-2",
                    placeholder: "?",
                    "data-ocid": "vedic_dojo.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: submit,
                    disabled: !!feedback,
                    className: "px-5 py-2 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 disabled:opacity-50",
                    "data-ocid": "vedic_dojo.submit_button",
                    children: "Check"
                  }
                )
              ] }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "text-sm font-bold text-center",
                  style: { color: feedback.ok ? "#10b981" : "#f43f5e" },
                  children: feedback.msg
                }
              )
            ]
          },
          probIdx
        ) })
      ]
    }
  );
}
const ROD_VALUES = [1e4, 1e3, 100, 10, 1];
const ROD_LABELS = ["10K", "1K", "100", "10", "1"];
function buildChallenges() {
  return [
    { type: "represent", label: "Represent", target: 3 },
    { type: "represent", label: "Represent", target: 14 },
    { type: "represent", label: "Represent", target: 52 },
    { type: "represent", label: "Represent", target: 231 },
    { type: "represent", label: "Represent", target: 1304 },
    { type: "add_no_carry", label: "Add", target: 12, addend: 3 },
    { type: "add_no_carry", label: "Add", target: 11, addend: 22 },
    { type: "add_no_carry", label: "Add", target: 14, addend: 21 },
    { type: "add_no_carry", label: "Add", target: 110, addend: 221 },
    { type: "add_no_carry", label: "Add", target: 2001, addend: 1003 },
    { type: "add_with_carry", label: "Add (carry)", target: 8, addend: 5 },
    { type: "add_with_carry", label: "Add (carry)", target: 17, addend: 8 },
    { type: "add_with_carry", label: "Add (carry)", target: 95, addend: 15 },
    { type: "add_with_carry", label: "Add (carry)", target: 199, addend: 12 },
    { type: "add_with_carry", label: "Add (carry)", target: 990, addend: 110 }
  ];
}
function numToRods(n) {
  return ROD_VALUES.map((v) => {
    const digit = Math.floor(n / v) % 10;
    return {
      upper: digit >= 5,
      lower: Array.from({ length: 4 }, (_, i) => digit % 5 > i ? 1 : 0)
    };
  });
}
function rodsToNum(rods) {
  let result = 0;
  for (let i = 0; i < ROD_VALUES.length; i++) {
    const val = (rods[i].upper ? 5 : 0) + rods[i].lower.filter(Boolean).length;
    result += val * ROD_VALUES[i];
  }
  return result;
}
function AbacusMaster({ config, onGameEnd }) {
  const challenges = buildChallenges();
  const [phase, setPhase] = reactExports.useState("idle");
  const [chIdx, setChIdx] = reactExports.useState(0);
  const [rods, setRods] = reactExports.useState(() => numToRods(0));
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const doneRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (won) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          correctRef.current / challenges.length * 100,
          Math.floor((Date.now() - startRef.current) / 1e3),
          won
        )
      );
    },
    [config, onGameEnd, challenges.length]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const ch = challenges[chIdx];
  function toggleUpper(rodIdx) {
    if (feedback) return;
    setRods(
      (prev) => prev.map((r, i) => i === rodIdx ? { ...r, upper: !r.upper } : r)
    );
  }
  function toggleLower(rodIdx, beadIdx) {
    if (feedback) return;
    setRods(
      (prev) => prev.map((r, i) => {
        if (i !== rodIdx) return r;
        const lower = [...r.lower];
        const isActive = lower[beadIdx] === 1;
        if (isActive) {
          for (let j = 0; j <= beadIdx; j++) lower[j] = 0;
        } else {
          for (let j = beadIdx; j < 4; j++) lower[j] = 1;
        }
        return { ...r, lower };
      })
    );
  }
  function checkAnswer() {
    if (feedback) return;
    const displayed = rodsToNum(rods);
    const target = ch.type === "represent" ? ch.target : ch.target + (ch.addend ?? 0);
    const ok = displayed === target;
    if (ok) setCorrect((c) => c + 1);
    setScore((s) => s + (ok ? 250 * config.difficulty : 0));
    setFeedback({
      msg: ok ? `Correct! ${displayed} shown correctly.` : `Wrong. You showed ${displayed}, expected ${target}.`,
      ok
    });
    setTimeout(() => {
      const next = chIdx + 1;
      if (next >= challenges.length) {
        endGame(true);
        return;
      }
      setChIdx(next);
      setRods(numToRods(0));
      setFeedback(null);
    }, 2e3);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "abacus_master.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#00f5ff]", children: [
            score.toLocaleString(),
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#00f5ff]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Abacus Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Use the 5-rod abacus to represent and calculate numbers. Click the upper bead (value 5) or lower beads (value 1 each) to toggle them. 15 challenges increasing in difficulty." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#00f5ff]/30 bg-card/50 p-4 text-sm text-muted-foreground max-w-sm w-full space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Upper bead = 5 x rod value | Lower beads = 1 each" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Rods (left to right): 10K | 1K | 100 | 10 | 1" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg font-bold text-black hover:opacity-90",
                  style: { background: "#00f5ff" },
                  "data-ocid": "abacus_master.start_button",
                  children: "Start"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Challenge ",
              chIdx + 1,
              "/",
              challenges.length,
              ": ",
              ch.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              correct,
              " correct"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-[#00f5ff]/30 bg-card/50 p-4 text-center", children: ch.type === "represent" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-widest", children: "Represent this number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-4xl font-black text-[#00f5ff]",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: ch.target
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-widest", children: [
              ch.addend,
              " + ",
              ch.target,
              " = Show result"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-[#f59e0b]", children: [
              "Set abacus to:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff]", children: ch.target + (ch.addend ?? 0) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#00f5ff]/20 bg-card/40 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-4", children: rods.map((rod, ri) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: ROD_LABELS[ri] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleUpper(ri),
                  className: "w-8 h-8 rounded-full border-2 transition-all",
                  style: {
                    borderColor: "#00f5ff",
                    background: rod.upper ? "#00f5ff" : "transparent"
                  },
                  "data-ocid": `abacus_master.upper.${ri}`,
                  "aria-label": `Rod ${ri + 1} upper bead`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-0.5 bg-[#00f5ff]/40" }),
              rod.lower.map((active, bi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleLower(ri, bi),
                  className: "w-8 h-8 rounded-full border-2 transition-all",
                  style: {
                    borderColor: "#f59e0b",
                    background: active ? "#f59e0b" : "transparent"
                  },
                  "data-ocid": `abacus_master.lower.${ri}.${bi}`,
                  "aria-label": `Rod ${ri + 1} lower bead ${bi + 1}`
                },
                bi
              ))
            ] }, ri)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mt-3 text-sm text-muted-foreground", children: [
              "Current value:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold text-lg", children: rodsToNum(rods).toLocaleString() })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: checkAnswer,
              disabled: !!feedback,
              className: "py-2.5 rounded-lg font-bold text-black hover:opacity-90 disabled:opacity-50",
              style: { background: "#00f5ff" },
              "data-ocid": "abacus_master.check_button",
              children: "Check Answer"
            }
          ),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-sm font-bold text-center",
              style: { color: feedback.ok ? "#10b981" : "#f43f5e" },
              children: feedback.msg
            }
          )
        ] })
      ]
    }
  );
}
function genSquare5() {
  const t = randInt(1, 9);
  const n = t * 10 + 5;
  return {
    tech: "square5",
    question: `${n}² = ?`,
    answer: n * n,
    hint: `${t} x ${t + 1} = ${t * (t + 1)}, append 25 -> ${n * n}`
  };
}
function genTimes11() {
  const n = randInt(12, 89);
  const a = Math.floor(n / 10);
  const b = n % 10;
  const mid = a + b;
  const answer = n * 11;
  return {
    tech: "times11",
    question: `${n} x 11 = ?`,
    answer,
    hint: mid > 9 ? `${a}+${b}=${mid} (carry): (${a}+1)_${mid % 10}_${b} = ${answer}` : `${a}+${b}=${mid} -> ${a}${mid}${b} = ${answer}`
  };
}
function genPercent() {
  const pcts = [10, 5, 15, 25, 20];
  const pct = pcts[Math.floor(Math.random() * pcts.length)];
  const base = randInt(1, 20) * 10;
  const answer = base * pct / 100;
  const methods = {
    10: `${base} / 10`,
    5: `${base} / 10 / 2`,
    15: `(${base / 10}) + (${base / 20})`,
    25: `${base} / 4`,
    20: `${base} / 5`
  };
  return {
    tech: "percent",
    question: `${pct}% of ${base} = ?`,
    answer,
    hint: `${pct}% of ${base}: ${methods[pct]} = ${answer}`
  };
}
const TECH_INFO = {
  square5: {
    title: "Squaring Numbers Ending in 5",
    rule: "N5 squared: multiply tens digit T by (T+1), append 25",
    examples: [
      { q: "35 squared", a: "3 x 4 = 12, append 25 -> 1225" },
      { q: "65 squared", a: "6 x 7 = 42, append 25 -> 4225" }
    ]
  },
  times11: {
    title: "Multiply Any 2-Digit Number by 11",
    rule: "AB x 11: A (A+B) B. Carry if A+B > 9",
    examples: [
      { q: "53 x 11", a: "5+3=8 -> 583" },
      { q: "78 x 11", a: "7+8=15 (carry) -> 858" }
    ]
  },
  percent: {
    title: "Mental Percentages",
    rule: "10%=/10, 5%=10%/2, 15%=10%+5%, 25%=/4, 20%=/5",
    examples: [
      { q: "15% of 80", a: "10%=8, 5%=4 -> 12" },
      { q: "25% of 160", a: "160 / 4 = 40" }
    ]
  }
};
const SHORTCUT_PHASES = ["square5", "times11", "percent"];
function buildShortcutProblems() {
  const s5 = Array.from({ length: 8 }, genSquare5);
  const t11 = Array.from({ length: 8 }, genTimes11);
  const pct = Array.from({ length: 8 }, genPercent);
  const speed = Array.from({ length: 20 }, (_, i) => {
    const type = i % 3;
    return type === 0 ? genSquare5() : type === 1 ? genTimes11() : genPercent();
  });
  return [...s5, ...t11, ...pct, ...speed];
}
function ShortcutWizard({ config, onGameEnd }) {
  const [problems] = reactExports.useState(buildShortcutProblems);
  const [phase, setPhase] = reactExports.useState(
    "idle"
  );
  const [techPhaseIdx, setTechPhaseIdx] = reactExports.useState(0);
  const [probIdx, setProbIdx] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [probTime, setProbTime] = reactExports.useState(8);
  const [speedIdx, setSpeedIdx] = reactExports.useState(0);
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const doneRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (won) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          correctRef.current / 44 * 100,
          Math.floor((Date.now() - startRef.current) / 1e3),
          won
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  reactExports.useEffect(() => {
    if (phase !== "practice" && phase !== "speed") return;
    if (probTime <= 0) {
      const cur = phase === "practice" ? problems[techPhaseIdx * 8 + probIdx] : problems[24 + speedIdx];
      setFeedback({ msg: `Time up! Answer: ${cur.answer}`, ok: false });
      setTimeout(() => advancePractice(), 2e3);
      return;
    }
    const t = setTimeout(() => setProbTime((p) => p - 1), 1e3);
    return () => clearTimeout(t);
  });
  function advancePractice() {
    if (phase === "practice") {
      const next = probIdx + 1;
      if (next >= 8) {
        const nextTech = techPhaseIdx + 1;
        if (nextTech >= SHORTCUT_PHASES.length) {
          setPhase("speed");
          setSpeedIdx(0);
        } else {
          setTechPhaseIdx(nextTech);
          setPhase("teach");
          setProbIdx(0);
        }
      } else {
        setProbIdx(next);
      }
    } else {
      const next = speedIdx + 1;
      if (next >= 20) {
        endGame(true);
        return;
      }
      setSpeedIdx(next);
    }
    setInput("");
    setFeedback(null);
    setProbTime(8);
  }
  function submit() {
    if (feedback) return;
    const cur = phase === "practice" ? problems[techPhaseIdx * 8 + probIdx] : problems[24 + speedIdx];
    const val = Number(input.trim());
    const ok = val === cur.answer;
    if (ok) setCorrect((c) => c + 1);
    setScore((s) => s + (ok ? 200 * config.difficulty : 0));
    setFeedback({
      msg: ok ? `Correct! ${cur.hint}` : `Wrong. ${cur.hint}`,
      ok
    });
    setTimeout(() => advancePractice(), 2200);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const currentTech = SHORTCUT_PHASES[techPhaseIdx];
  const techInfo = TECH_INFO[currentTech];
  const curProb = phase === "practice" ? problems[techPhaseIdx * 8 + probIdx] : phase === "speed" ? problems[24 + speedIdx] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "shortcut_wizard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#e879f9]", children: [
            score.toLocaleString(),
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#e879f9] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#e879f9]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Shortcut Wizard"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Learn 3 mental math shortcuts. Each gets a tutorial plus 8 practice problems. Then a 20-problem speed challenge mixes all three techniques." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-sm", children: SHORTCUT_PHASES.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-[#e879f9]" }),
                    i + 1,
                    ". ",
                    TECH_INFO[t].title
                  ]
                },
                t
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startRef.current = Date.now();
                    setPhase("teach");
                  },
                  className: "px-8 py-3 rounded-lg font-bold text-white hover:opacity-90",
                  style: { background: "#e879f9" },
                  "data-ocid": "shortcut_wizard.start_button",
                  children: "Begin"
                }
              )
            ]
          }
        ),
        phase === "teach" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#e879f9]/30 bg-card/50 p-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#e879f9] font-bold", children: techInfo.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground font-mono", children: techInfo.rule }),
            techInfo.examples.map((ex, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded border border-border/20 bg-background/60 p-3 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: ex.q }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#e879f9]", children: [
                    "-- ",
                    ex.a
                  ] })
                ]
              },
              i
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setProbIdx(0);
                setPhase("practice");
                setProbTime(8);
              },
              className: "py-2.5 rounded-lg font-bold text-white hover:opacity-90",
              style: { background: "#e879f9" },
              "data-ocid": "shortcut_wizard.practice_button",
              children: "Start Practice (8 problems)"
            }
          )
        ] }),
        (phase === "practice" || phase === "speed") && curProb && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: phase === "practice" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  techInfo.title,
                  " -- ",
                  probIdx + 1,
                  "/8"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: probTime <= 3 ? "text-[#f43f5e] font-bold" : "",
                    children: [
                      probTime,
                      "s"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#e879f9] font-bold", children: [
                  "SPEED CHALLENGE -- ",
                  speedIdx + 1,
                  "/20"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: probTime <= 3 ? "text-[#f43f5e] font-bold" : "",
                    children: [
                      probTime,
                      "s"
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#e879f9]/30 bg-card/50 p-5 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-2", children: curProb.tech === "square5" ? "Squaring" : curProb.tech === "times11" ? "x11 Trick" : "Percentage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-4xl font-black",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: curProb.question
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && !feedback && submit(),
                    disabled: !!feedback,
                    className: "flex-1 text-center text-2xl font-bold rounded-lg border-2 border-[#e879f9]/40 bg-background focus:border-[#e879f9] focus:outline-none p-2",
                    placeholder: "?",
                    "data-ocid": "shortcut_wizard.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: submit,
                    disabled: !!feedback,
                    className: "px-5 py-2 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50",
                    style: { background: "#e879f9" },
                    "data-ocid": "shortcut_wizard.submit_button",
                    children: "Check"
                  }
                )
              ] }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "text-sm font-bold text-center",
                  style: { color: feedback.ok ? "#10b981" : "#f43f5e" },
                  children: feedback.msg
                }
              )
            ]
          },
          phase === "practice" ? techPhaseIdx * 8 + probIdx : 100 + speedIdx
        ) })
      ]
    }
  );
}
function MagicMathematics({ config, onGameEnd }) {
  switch (config.gameId) {
    case "abacus-master":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AbacusMaster, { config, onGameEnd });
    case "shortcut-wizard":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutWizard, { config, onGameEnd });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(VedicDojo, { config, onGameEnd });
  }
}
export {
  MagicMathematics as default
};
