import { r as reactExports, j as jsxRuntimeExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function genProblem(diff, ops) {
  const allOps = ops ?? (diff === 1 ? ["+", "-"] : diff === 2 ? ["+", "-", "*"] : ["+", "-", "*", "/"]);
  const op = allOps[randInt(0, allOps.length - 1)];
  const maxN = diff === 1 ? 20 : diff === 2 ? 50 : 99;
  let a = randInt(2, maxN);
  let b = randInt(2, diff === 3 ? 12 : maxN);
  let answer;
  if (op === "+") {
    answer = a + b;
  } else if (op === "-") {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
  } else if (op === "*") {
    a = randInt(2, diff === 3 ? 20 : 12);
    b = randInt(2, diff === 3 ? 20 : 12);
    answer = a * b;
  } else {
    b = randInt(2, 12);
    a = b * randInt(2, 12);
    answer = a / b;
  }
  const wrongs = [
    answer + randInt(1, 5),
    answer - randInt(1, 4),
    answer + randInt(6, 15)
  ].filter((w) => w !== answer && w > 0);
  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    options: shuffle([answer, ...wrongs.slice(0, 3)])
  };
}
function genTimedProblem(tier) {
  if (tier <= 1) return genProblem(1, ["+", "-"]);
  if (tier === 2) return genProblem(2, ["*", "/"]);
  if (tier === 3) return genProblem(2);
  if (tier === 4) {
    const a = randInt(2, 20);
    const b = randInt(2, 10);
    const c = randInt(1, 5);
    const ans2 = a * b + c;
    const wrongs2 = [ans2 + 2, ans2 - 3, ans2 + 7].filter(
      (w) => w !== ans2 && w > 0
    );
    return {
      question: `${a} x ${b} + ${c} = ?`,
      answer: ans2,
      options: shuffle([ans2, ...wrongs2.slice(0, 3)])
    };
  }
  const base = randInt(20, 80);
  const pct = [10, 20, 25, 50][randInt(0, 3)];
  const ans = Math.round(base * pct / 100);
  const wrongs = [ans + 2, ans - 1, ans + 5].filter((w) => w !== ans && w >= 0);
  return {
    question: `${pct}% of ${base} = ?`,
    answer: ans,
    options: shuffle([ans, ...wrongs.slice(0, 3)])
  };
}
function buildMultiplicationRow(n) {
  return Array.from(
    { length: 12 },
    (_, i) => `${n}x${i + 1}=${n * (i + 1)}`
  ).join("  ");
}
const DIGIT_LABELS = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
  "0",
  "00",
  "CLR"
];
function MentalMath({ config, onGameEnd }) {
  var _a, _b, _c, _d, _e;
  const gameId = config.gameId;
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  const correctRef = reactExports.useRef(0);
  const endGame = reactExports.useCallback(
    (s, c, total, done) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = total > 0 ? c / total * 100 : 0;
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
  const TOTAL_S = config.difficulty === 1 ? 40 : config.difficulty === 2 ? 60 : 80;
  const TIME_S = 90;
  const [g1Phase, setG1Phase] = reactExports.useState("idle");
  const [g1Problems] = reactExports.useState(
    () => Array.from({ length: TOTAL_S }, () => genProblem(config.difficulty))
  );
  const [g1Cur, setG1Cur] = reactExports.useState(0);
  const [g1Score, setG1Score] = reactExports.useState(0);
  const [g1Correct, setG1Correct] = reactExports.useState(0);
  const [g1Time, setG1Time] = reactExports.useState(TIME_S);
  const [g1Input, setG1Input] = reactExports.useState("");
  const [g1Flash, setG1Flash] = reactExports.useState(null);
  const g1PhaseRef = reactExports.useRef(g1Phase);
  g1PhaseRef.current = g1Phase;
  const g1TimeRef = reactExports.useRef(g1Time);
  reactExports.useEffect(() => {
    if (g1Phase !== "playing") return;
    const t = setInterval(() => {
      setG1Time((prev) => {
        g1TimeRef.current = prev - 1;
        if (prev <= 1) {
          clearInterval(t);
          endGame(g1Score, g1Correct, g1Cur, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(t);
  }, [g1Phase, endGame, g1Score, g1Correct, g1Cur]);
  function g1PadInput(label) {
    if (label === "CLR") {
      setG1Input("");
      return;
    }
    setG1Input((p) => p.length < 5 ? p + label : p);
  }
  function g1Submit() {
    if (g1Input.trim() === "") return;
    const val = Number.parseInt(g1Input);
    const prob = g1Problems[g1Cur];
    const ok = val === prob.answer;
    const pts = ok ? 100 : 0;
    const newScore = g1Score + pts;
    const newCorrect = ok ? g1Correct + 1 : g1Correct;
    setG1Score(newScore);
    setG1Correct(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setG1Flash(ok ? "correct" : "wrong");
    setTimeout(() => {
      setG1Flash(null);
      setG1Input("");
      const next = g1Cur + 1;
      if (next >= TOTAL_S) {
        endGame(newScore, newCorrect, TOTAL_S, true);
        return;
      }
      setG1Cur(next);
    }, 400);
  }
  const tableMax = config.difficulty === 1 ? 6 : config.difficulty === 2 ? 10 : 12;
  const TOTAL_MM = 30;
  function genMMProblem() {
    const a = randInt(1, tableMax);
    const b = randInt(1, 12);
    const ans = a * b;
    const wrongs = [
      ans + randInt(1, 5),
      ans - randInt(1, 4),
      ans + randInt(6, 12)
    ].filter((w) => w !== ans && w > 0);
    return {
      question: `${a} x ${b} = ?`,
      answer: ans,
      options: shuffle([ans, ...wrongs.slice(0, 3)])
    };
  }
  const [g2Phase, setG2Phase] = reactExports.useState("idle");
  const [g2Problems] = reactExports.useState(
    () => Array.from({ length: TOTAL_MM }, genMMProblem)
  );
  const [g2Cur, setG2Cur] = reactExports.useState(0);
  const [g2Score, setG2Score] = reactExports.useState(0);
  const [g2Correct, setG2Correct] = reactExports.useState(0);
  const [g2Streak, setG2Streak] = reactExports.useState(0);
  const [g2Chosen, setG2Chosen] = reactExports.useState(null);
  const [g2Flash, setG2Flash] = reactExports.useState(null);
  const [g2ShowRow, setG2ShowRow] = reactExports.useState(null);
  function g2Choose(optIdx) {
    if (g2Flash) return;
    setG2Chosen(optIdx);
    const prob = g2Problems[g2Cur];
    const ok = prob.options[optIdx] === prob.answer;
    const mult = g2Streak >= 4 ? 3 : g2Streak >= 2 ? 2 : 1;
    const pts = ok ? 100 * mult : 0;
    const newScore = g2Score + pts;
    const newCorrect = ok ? g2Correct + 1 : g2Correct;
    const newStreak = ok ? g2Streak + 1 : 0;
    setG2Score(newScore);
    setG2Correct(newCorrect);
    setG2Streak(newStreak);
    setG2Flash(ok ? "correct" : "wrong");
    if (!ok) {
      const tableNum = Number.parseInt(prob.question.split(" ")[0]);
      setG2ShowRow(buildMultiplicationRow(tableNum));
    }
    setTimeout(
      () => {
        setG2Flash(null);
        setG2Chosen(null);
        setG2ShowRow(null);
        const next = g2Cur + 1;
        if (next >= TOTAL_MM) {
          endGame(newScore, newCorrect, TOTAL_MM, true);
          return;
        }
        setG2Cur(next);
      },
      ok ? 400 : 2200
    );
  }
  const [g3Phase, setG3Phase] = reactExports.useState("idle");
  const [g3Score, setG3Score] = reactExports.useState(0);
  const [g3AnsweredCount, setG3AnsweredCount] = reactExports.useState(0);
  const [g3Streak, setG3Streak] = reactExports.useState(0);
  const [g3Strikes, setG3Strikes] = reactExports.useState(0);
  const [g3Tier, setG3Tier] = reactExports.useState(1);
  const [g3Problem, setG3Problem] = reactExports.useState(() => genTimedProblem(1));
  const [g3QuestionTime, setG3QuestionTime] = reactExports.useState(5);
  const [g3Chosen, setG3Chosen] = reactExports.useState(null);
  const [g3Flash, setG3Flash] = reactExports.useState(null);
  const g3PhaseRef = reactExports.useRef(g3Phase);
  g3PhaseRef.current = g3Phase;
  const g3QTimeRef = reactExports.useRef(5);
  reactExports.useEffect(() => {
    if (g3Phase !== "playing" || g3Flash) return;
    g3QTimeRef.current = 5;
    setG3QuestionTime(5);
    const t = setInterval(() => {
      setG3QuestionTime((prev) => {
        g3QTimeRef.current = prev - 1;
        if (prev <= 1) {
          clearInterval(t);
          const newStrikes = g3Strikes + 1;
          setG3Strikes(newStrikes);
          if (newStrikes >= 3) {
            endGame(g3Score, g3AnsweredCount, g3AnsweredCount, false);
            return 0;
          }
          setG3Flash("wrong");
          setTimeout(() => {
            setG3Flash(null);
            setG3Problem(genTimedProblem(g3Tier));
            setG3Streak(0);
          }, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(t);
  }, [g3Phase, g3Flash, g3Strikes, g3Score, g3AnsweredCount, g3Tier, endGame]);
  function g3Choose(optIdx) {
    if (g3Flash) return;
    setG3Chosen(optIdx);
    const ok = g3Problem.options[optIdx] === g3Problem.answer;
    const newAnswered = g3AnsweredCount + 1;
    const newStreak = ok ? g3Streak + 1 : 0;
    const newTier = Math.min(5, Math.floor(newStreak / 5) + 1);
    const pts = ok ? newAnswered * newTier : 0;
    const newScore = g3Score + pts;
    setG3Score(newScore);
    setG3AnsweredCount(newAnswered);
    setG3Streak(newStreak);
    setG3Tier(newTier);
    if (!ok) {
      const newStrikes = g3Strikes + 1;
      setG3Strikes(newStrikes);
      if (newStrikes >= 3) {
        setG3Flash("wrong");
        setTimeout(
          () => endGame(newScore, newAnswered - 1, newAnswered, false),
          600
        );
        return;
      }
    }
    setG3Flash(ok ? "correct" : "wrong");
    setTimeout(() => {
      setG3Flash(null);
      setG3Chosen(null);
      setG3Problem(genTimedProblem(newTier));
      if (!ok) setG3Streak(0);
    }, 500);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "mental_math.page",
      children: [
        gameId === "mental-sprint" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    className: "text-3xl font-black text-[#f59e0b]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Mental Sprint"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                  TOTAL_S,
                  " problems in ",
                  TIME_S,
                  " seconds. Use the number pad to enter answers."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG1Phase("playing");
                    },
                    className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90",
                    "data-ocid": "mental_math.start_button",
                    children: "Start Sprint"
                  }
                )
              ]
            }
          ),
          g1Phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full transition-all duration-1000 ${g1Time <= 15 ? "bg-red-500" : "bg-[#f59e0b]"}`,
                style: { width: `${g1Time / TIME_S * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#f59e0b]", children: [
                g1Time,
                "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                g1Cur,
                "/",
                TOTAL_S
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: g1Score })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.9, opacity: 0 },
                className: `text-5xl font-black text-center py-6 rounded-2xl border-2 transition-colors ${g1Flash === "correct" ? "border-[#4ade80] text-[#4ade80]" : g1Flash === "wrong" ? "border-red-500 text-red-400" : "border-border"}`,
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: (_a = g1Problems[g1Cur]) == null ? void 0 : _a.question
              },
              g1Cur
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-3xl font-black font-mono py-3 rounded-xl border-2 border-[#f59e0b]/50 bg-card min-h-[56px]", children: g1Input || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: DIGIT_LABELS.map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => g1PadInput(label),
                "data-ocid": `mental_math.pad_${label}`,
                className: "py-3 rounded-xl border-2 border-border/50 bg-card text-xl font-black hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all",
                children: label
              },
              label
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: g1Submit,
                className: "py-3 rounded-xl bg-[#f59e0b] text-black font-black text-lg hover:opacity-90",
                "data-ocid": "mental_math.submit_button",
                children: "ENTER"
              }
            )
          ] })
        ] }),
        gameId === "memory-multiply" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    className: "text-3xl font-black text-[#f59e0b]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Memory Multiply"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                  "Times tables (1–",
                  tableMax,
                  "). Build streaks for x2 and x3 multipliers. Miss one and the full table is shown."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG2Phase("playing");
                    },
                    className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90",
                    "data-ocid": "mental_math.mm_start_button",
                    children: "Begin Tables"
                  }
                )
              ]
            }
          ),
          g2Phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                g2Cur,
                "/",
                TOTAL_MM
              ] }),
              g2Streak >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-bold", children: [
                "Streak x",
                g2Streak >= 4 ? 3 : 2
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: g2Score })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                className: `text-5xl font-black text-center py-6 rounded-2xl border-2 transition-colors ${g2Flash === "correct" ? "border-[#4ade80] text-[#4ade80]" : g2Flash === "wrong" ? "border-red-500 text-red-400" : "border-border"}`,
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: (_b = g2Problems[g2Cur]) == null ? void 0 : _b.question
              },
              g2Cur
            ) }),
            g2ShowRow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-2 text-xs font-mono text-[#f59e0b] text-center overflow-x-auto", children: g2ShowRow }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: (_d = (_c = g2Problems[g2Cur]) == null ? void 0 : _c.options) == null ? void 0 : _d.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => g2Choose(i),
                disabled: !!g2Flash,
                "data-ocid": `mental_math.mm_option.${i + 1}`,
                className: `py-5 rounded-xl border-2 text-2xl font-black transition-all ${g2Chosen === i ? opt === g2Problems[g2Cur].answer ? "border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80]" : "border-red-500 bg-red-500/20 text-red-400" : g2Flash && opt === g2Problems[g2Cur].answer ? "border-[#4ade80] bg-[#4ade80]/10" : "border-border hover:border-[#f59e0b] hover:bg-[#f59e0b]/10"}`,
                children: opt
              },
              i
            )) })
          ] })
        ] }),
        gameId === "lightning-round" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    className: "text-3xl font-black text-[#f59e0b]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Lightning Round"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "5 seconds per question. 3 strikes and you're out. Difficulty escalates every 5 correct answers." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tier 1: +/- | Tier 2: x/÷ | Tier 3: Mixed | Tier 4: 2-step | Tier 5: Percentages" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG3Phase("playing");
                    },
                    className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90",
                    "data-ocid": "mental_math.lr_start_button",
                    children: "Start Lightning"
                  }
                )
              ]
            }
          ),
          g3Phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full transition-all duration-1000 ${g3QuestionTime <= 2 ? "bg-red-500" : "bg-[#f59e0b]"}`,
                style: { width: `${g3QuestionTime / 5 * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#f59e0b]", children: [
                g3QuestionTime,
                "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "Tier ",
                g3Tier,
                " | Streak ",
                g3Streak
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-3 h-3 rounded-full ${i < g3Strikes ? "bg-red-500" : "bg-muted"}`
                },
                i
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                className: `text-5xl font-black text-center py-6 rounded-2xl border-2 transition-colors ${g3Flash === "correct" ? "border-[#4ade80] text-[#4ade80]" : g3Flash === "wrong" ? "border-red-500 text-red-400" : "border-border"}`,
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: g3Problem.question
              },
              g3AnsweredCount
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-center text-muted-foreground", children: [
              "Score:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: g3Score }),
              " | Correct: ",
              g3AnsweredCount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: (_e = g3Problem.options) == null ? void 0 : _e.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => g3Choose(i),
                disabled: !!g3Flash,
                "data-ocid": `mental_math.lr_option.${i + 1}`,
                className: `py-5 rounded-xl border-2 text-2xl font-black transition-all ${g3Chosen === i ? opt === g3Problem.answer ? "border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80]" : "border-red-500 bg-red-500/20 text-red-400" : g3Flash && opt === g3Problem.answer ? "border-[#4ade80] bg-[#4ade80]/10" : "border-border hover:border-[#f59e0b] hover:bg-[#f59e0b]/10"}`,
                children: opt
              },
              i
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  MentalMath as default
};
