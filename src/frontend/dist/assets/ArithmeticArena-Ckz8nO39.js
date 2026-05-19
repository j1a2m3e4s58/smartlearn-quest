import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const DIFF = {
  1: {
    playerHP: 100,
    aiHP: 100,
    aiDelayMs: 3e3,
    numRange: 12,
    ops: ["+", "-"],
    damage: 20
  },
  2: {
    playerHP: 100,
    aiHP: 120,
    aiDelayMs: 2e3,
    numRange: 20,
    ops: ["+", "-", "*"],
    damage: 25
  },
  3: {
    playerHP: 100,
    aiHP: 150,
    aiDelayMs: 1200,
    numRange: 30,
    ops: ["+", "-", "*", "/"],
    damage: 30
  }
};
function genProblem(difficulty) {
  const d = DIFF[difficulty];
  const op = d.ops[Math.floor(Math.random() * d.ops.length)];
  let a = Math.floor(Math.random() * d.numRange) + 1;
  let b = Math.floor(Math.random() * d.numRange) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  if (op === "/") {
    b = Math.max(1, b);
    a = b * (Math.floor(Math.random() * 10) + 1);
  }
  const answer = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
  return { a, b, op, answer };
}
function MathCombat({ config, onGameEnd }) {
  const d = DIFF[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [playerHP, setPlayerHP] = reactExports.useState(d.playerHP);
  const [aiHP, setAiHP] = reactExports.useState(d.aiHP);
  const [problem, setProblem] = reactExports.useState(
    genProblem(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [hits, setHits] = reactExports.useState(0);
  const [attempts, setAttempts] = reactExports.useState(0);
  const [shakePlayer, setShakePlayer] = reactExports.useState(false);
  const [shakeAI, setShakeAI] = reactExports.useState(false);
  const [playerFlash, setPlayerFlash] = reactExports.useState(null);
  const [aiFlash, setAiFlash] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const playerHPRef = reactExports.useRef(playerHP);
  playerHPRef.current = playerHP;
  const aiHPRef = reactExports.useRef(aiHP);
  aiHPRef.current = aiHP;
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const hitsRef = reactExports.useRef(hits);
  hitsRef.current = hits;
  const attemptsRef = reactExports.useRef(attempts);
  attemptsRef.current = attempts;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const accuracy = attemptsRef.current > 0 ? hitsRef.current / attemptsRef.current * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed)
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    const timer = setTimeout(() => {
      var _a;
      if (phaseRef.current !== "playing") return;
      setPlayerHP((prev) => {
        const next = prev - d.damage;
        if (next <= 0) {
          endGame(false);
          return 0;
        }
        return next;
      });
      setShakePlayer(true);
      setPlayerFlash("hit");
      setTimeout(() => {
        setShakePlayer(false);
        setPlayerFlash(null);
      }, 600);
      setMessage("AI answered first! You took damage.");
      setProblem(genProblem(config.difficulty));
      setInput("");
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, d.aiDelayMs);
    return () => clearTimeout(timer);
  }, [problem, phase, d.aiDelayMs, d.damage, config.difficulty, endGame]);
  function submit() {
    var _a;
    if (phase !== "playing") return;
    const val = Number.parseFloat(input.trim());
    setAttempts((a) => a + 1);
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    if (val === problem.answer) {
      setHits((h) => h + 1);
      const pts = 100 + Math.floor(d.aiDelayMs / 10);
      setScore((s) => s + pts);
      setAiHP((prev) => {
        const next = prev - d.damage;
        if (next <= 0) {
          endGame(true);
          return 0;
        }
        return next;
      });
      setShakeAI(true);
      setAiFlash("hit");
      setTimeout(() => {
        setShakeAI(false);
        setAiFlash(null);
      }, 600);
      setMessage("Correct! You strike the opponent!");
    } else {
      setPlayerHP((prev) => {
        const next = prev - Math.floor(d.damage / 2);
        if (next <= 0) {
          endGame(false);
          return 0;
        }
        return next;
      });
      setShakePlayer(true);
      setPlayerFlash("hit");
      setTimeout(() => {
        setShakePlayer(false);
        setPlayerFlash(null);
      }, 600);
      setMessage(`Wrong! Answer was ${problem.answer}`);
    }
    setProblem(genProblem(config.difficulty));
    setInput("");
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }
  function startGame() {
    startTimeRef.current = Date.now();
    setPhase("playing");
    startTimer();
    setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 100);
  }
  const playerPct = playerHP / d.playerHP * 100;
  const aiPct = aiHP / d.aiHP * 100;
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "arithmetic_arena.page",
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
                  className: "text-3xl font-black text-[#00f5ff]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Arithmetic Combat"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Solve math problems before the AI does. Correct answers deal damage. Wrong answers hurt you." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                "Difficulty ",
                config.difficulty,
                " — AI reacts in ",
                d.aiDelayMs / 1e3,
                "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:bg-[#00f5ff]/90 transition-colors",
                  "data-ocid": "arithmetic_arena.start_button",
                  children: "Start Battle"
                }
              )
            ]
          }
        ),
        phase !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: "YOU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: shakePlayer ? { x: [-6, 6, -4, 4, 0] } : {},
                  className: "w-full h-5 bg-muted rounded overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-full transition-all duration-300 ${playerFlash === "hit" ? "bg-red-500" : "bg-green-500"}`,
                      style: { width: `${playerPct}%` }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
                Math.max(0, playerHP),
                " / ",
                d.playerHP,
                " HP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono text-right", children: "AI OPPONENT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: shakeAI ? { x: [-6, 6, -4, 4, 0] } : {},
                  className: "w-full h-5 bg-muted rounded overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-full transition-all duration-300 ${aiFlash === "hit" ? "bg-red-500" : "bg-red-400"}`,
                      style: { width: `${aiPct}%` }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-right", children: [
                Math.max(0, aiHP),
                " / ",
                d.aiHP,
                " HP"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                className: "text-5xl font-black text-center",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: [
                  problem.a,
                  " ",
                  problem.op,
                  " ",
                  problem.b,
                  " = ?"
                ]
              },
              `${problem.a}${problem.op}${problem.b}`
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  type: "number",
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && submit(),
                  className: "w-36 text-center text-2xl font-bold rounded-lg border-2 border-[#00f5ff]/50 bg-card focus:border-[#00f5ff] focus:outline-none p-2",
                  placeholder: "?",
                  "data-ocid": "arithmetic_arena.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submit,
                  className: "px-6 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:bg-[#00f5ff]/90 transition-colors",
                  "data-ocid": "arithmetic_arena.submit_button",
                  children: "Strike!"
                }
              )
            ] }),
            message && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm text-center",
                style: {
                  color: message.startsWith("Correct") ? "#4ade80" : "#f43f5e"
                },
                children: message
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "Score:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score.toLocaleString() }),
              " ",
              "| Time: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                timeLeft,
                "s"
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function NumberBlitz({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [timeLeft, setTimeLeft] = reactExports.useState(60);
  const [problem, setProblem] = reactExports.useState(
    genProblem(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [answered, setAnswered] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const answeredRef = reactExports.useRef(answered);
  answeredRef.current = answered;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = answeredRef.current > 0 ? correctRef.current / answeredRef.current * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, scoreRef.current, acc, ts, completed));
    },
    [config, onGameEnd]
  );
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, [phase, endGame]);
  function submit() {
    var _a;
    if (phase !== "playing") return;
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newAnswered = answered + 1;
    setAnswered(newAnswered);
    const ok = val === problem.answer;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 100);
      setTimeLeft((t) => t + 3);
      setFlash("green");
    } else {
      setTimeLeft((t) => Math.max(1, t - 5));
      setFlash("red");
    }
    setTimeout(() => setFlash(null), 400);
    setProblem(genProblem(config.difficulty));
    setInput("");
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }
  function startGame() {
    startTimeRef.current = Date.now();
    setPhase("playing");
    setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 100);
  }
  const timePct = timeLeft / 60 * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "number_blitz.page",
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
                  className: "text-3xl font-black text-[#00f5ff]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Number Blitz"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Answer as many arithmetic problems as possible in 60 seconds. Correct: +3s. Wrong: -5s." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "number_blitz.start_button",
                  children: "Start Blitz"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-[#00f5ff]"}`,
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `font-bold text-lg ${timeLeft <= 10 ? "text-red-400" : "text-[#00f5ff]"}`,
                children: [
                  timeLeft,
                  "s"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              answered,
              " answered"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "flex-1 flex flex-col items-center justify-center gap-5",
              animate: flash === "green" ? { backgroundColor: ["rgba(74,222,128,0.2)", "transparent"] } : flash === "red" ? { backgroundColor: ["rgba(244,63,94,0.2)", "transparent"] } : {},
              transition: { duration: 0.4 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { y: -30, opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: { y: 30, opacity: 0 },
                    transition: { duration: 0.15 },
                    className: "text-5xl font-black text-center",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      problem.a,
                      " ",
                      problem.op,
                      " ",
                      problem.b,
                      " = ?"
                    ]
                  },
                  `${problem.a}${problem.op}${problem.b}`
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: inputRef,
                      type: "number",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-36 text-center text-2xl font-bold rounded-lg border-2 border-[#00f5ff]/50 bg-card focus:border-[#00f5ff] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "number_blitz.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-6 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "number_blitz.submit_button",
                      children: "Answer"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  "Correct: ",
                  correct,
                  " | Wrong: ",
                  answered - correct
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const BOSS_PHASES = [
  { ops: ["+", "-"], numRange: 20, label: "Phase 1: Basic Operations" },
  {
    ops: ["+", "-", "*"],
    numRange: 25,
    label: "Phase 2: Multiplication"
  },
  {
    ops: ["+", "-", "*", "/"],
    numRange: 30,
    label: "Phase 3: All Operations"
  }
];
function ArithmeticBoss({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [bossPhase, setBossPhase] = reactExports.useState(0);
  const [bossHP, setBossHP] = reactExports.useState(100);
  const [playerHP, setPlayerHP] = reactExports.useState(100);
  const [shieldActive, setShieldActive] = reactExports.useState(false);
  const [shieldHits, setShieldHits] = reactExports.useState(0);
  const [doubleDmg, setDoubleDmg] = reactExports.useState(false);
  const [doubleDmgTimer, setDoubleDmgTimer] = reactExports.useState(0);
  const [problem, setProblem] = reactExports.useState(
    genProblem(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [message, setMessage] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const totalRef = reactExports.useRef(total);
  totalRef.current = total;
  const bossHPRef = reactExports.useRef(bossHP);
  bossHPRef.current = bossHP;
  const playerHPRef = reactExports.useRef(playerHP);
  playerHPRef.current = playerHP;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, scoreRef.current, acc, ts, completed));
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    const shieldInterval = setInterval(() => {
      setShieldActive(true);
      setShieldHits(0);
      setMessage("Boss activates SHIELD — answer 2 correct to break it!");
      setTimeout(() => {
        setShieldActive(false);
        setShieldHits(0);
      }, 8e3);
    }, 15e3);
    const doubleDmgInterval = setInterval(() => {
      setDoubleDmg(true);
      setDoubleDmgTimer(30);
      setMessage("Boss DOUBLE DAMAGE mode — wrong answers cost double HP!");
    }, 2e4);
    return () => {
      clearInterval(shieldInterval);
      clearInterval(doubleDmgInterval);
    };
  }, [phase]);
  reactExports.useEffect(() => {
    if (!doubleDmg || phase !== "playing") return;
    const id = setInterval(() => {
      setDoubleDmgTimer((t) => {
        if (t <= 1) {
          setDoubleDmg(false);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, [doubleDmg, phase]);
  function genBossProblem() {
    const bp = BOSS_PHASES[bossPhase];
    const op = bp.ops[Math.floor(Math.random() * bp.ops.length)];
    let a = Math.floor(Math.random() * bp.numRange) + 1;
    let b = Math.floor(Math.random() * bp.numRange) + 1;
    if (op === "-" && b > a) [a, b] = [b, a];
    if (op === "/") {
      b = Math.max(1, b);
      a = b * (Math.floor(Math.random() * 8) + 1);
    }
    const answer = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
    return { a, b, op, answer };
  }
  function submit() {
    var _a;
    if (phase !== "playing") return;
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newTotal = total + 1;
    setTotal(newTotal);
    if (val === problem.answer) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setScore((s) => s + 150);
      if (shieldActive) {
        const newHits = shieldHits + 1;
        setShieldHits(newHits);
        if (newHits >= 2) {
          setShieldActive(false);
          setShieldHits(0);
          setMessage("Shield broken! Boss takes damage!");
          const newBossHP = Math.max(0, bossHP - 10);
          setBossHP(newBossHP);
          bossHPRef.current = newBossHP;
          if (newBossHP <= 0) {
            setTimeout(() => endGame(true), 500);
            return;
          }
          const nextBossPhase = Math.floor((100 - newBossHP) / 34);
          if (nextBossPhase > bossPhase) {
            setBossPhase(Math.min(2, nextBossPhase));
          }
        } else {
          setMessage("Hit 1/2 to break shield!");
        }
      } else {
        const newBossHP = Math.max(0, bossHP - 10);
        setBossHP(newBossHP);
        bossHPRef.current = newBossHP;
        setMessage("Direct hit on boss!");
        if (newBossHP <= 0) {
          setTimeout(() => endGame(true), 500);
          return;
        }
        const nextBossPhase = Math.floor((100 - newBossHP) / 34);
        if (nextBossPhase > bossPhase) {
          setBossPhase(Math.min(2, nextBossPhase));
          setMessage(
            `Boss enters ${BOSS_PHASES[Math.min(2, nextBossPhase)].label}!`
          );
        }
      }
    } else {
      const dmg = doubleDmg ? 20 : 10;
      const newPlayerHP = Math.max(0, playerHP - dmg);
      setPlayerHP(newPlayerHP);
      playerHPRef.current = newPlayerHP;
      setMessage(
        doubleDmg ? `Wrong! Double damage! -${dmg} HP. Answer: ${problem.answer}` : `Wrong! -${dmg} HP. Answer: ${problem.answer}`
      );
      if (newPlayerHP <= 0) {
        setTimeout(() => endGame(false), 500);
        return;
      }
    }
    setProblem(genBossProblem());
    setInput("");
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }
  function startGame() {
    startTimeRef.current = Date.now();
    setPhase("playing");
    startTimer();
    setBossHP(100);
    setPlayerHP(100);
    setBossPhase(0);
    setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 100);
  }
  const bossHPPct = bossHP;
  const playerHPPct = playerHP;
  const timePct = timeLeft / config.timeLimit * 100;
  const bpInfo = BOSS_PHASES[bossPhase];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-3",
      "data-ocid": "arithmetic_boss.page",
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
                  className: "text-3xl font-black text-red-400",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Arithmetic Boss"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Defeat the math boss with 100HP. Boss has shields and enters double-damage mode. 3 phases of increasing difficulty." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg bg-red-500 text-white font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "arithmetic_boss.start_button",
                  children: "Challenge Boss"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-xs text-center font-bold text-red-400",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: bpInfo.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "PLAYER" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-4 bg-muted rounded overflow-hidden mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-green-500 transition-all duration-300",
                  style: { width: `${playerHPPct}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
                playerHP,
                " HP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-right", children: "BOSS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-4 bg-muted rounded overflow-hidden mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-full transition-all duration-300 ${shieldActive ? "bg-blue-400" : "bg-red-500"}`,
                  style: { width: `${bossHPPct}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-right", children: [
                bossHP,
                " HP ",
                shieldActive ? "[SHIELD]" : ""
              ] })
            ] })
          ] }),
          doubleDmg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs font-bold text-red-400 animate-pulse", children: [
            "DOUBLE DAMAGE ACTIVE — ",
            doubleDmgTimer,
            "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                className: "text-5xl font-black text-center",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: [
                  problem.a,
                  " ",
                  problem.op,
                  " ",
                  problem.b,
                  " = ?"
                ]
              },
              `${problem.a}${problem.op}${problem.b}`
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  type: "number",
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && submit(),
                  className: "w-36 text-center text-2xl font-bold rounded-lg border-2 border-red-500/50 bg-card focus:border-red-500 focus:outline-none p-2",
                  placeholder: "?",
                  "data-ocid": "arithmetic_boss.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submit,
                  className: "px-6 py-2 rounded-lg bg-red-500 text-white font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "arithmetic_boss.submit_button",
                  children: "Attack!"
                }
              )
            ] }),
            message && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm text-center",
                style: {
                  color: message.includes("Direct hit") || message.includes("broken") ? "#4ade80" : "#f43f5e"
                },
                children: message
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score }),
              " |",
              " ",
              timeLeft,
              "s"
            ] })
          ] })
        ] })
      ]
    }
  );
}
function ArithmeticArena({ config, onGameEnd }) {
  if (config.gameId === "number-blitz")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NumberBlitz, { config, onGameEnd });
  if (config.gameId === "arithmetic-boss")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArithmeticBoss, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MathCombat, { config, onGameEnd });
}
export {
  ArithmeticArena as default
};
