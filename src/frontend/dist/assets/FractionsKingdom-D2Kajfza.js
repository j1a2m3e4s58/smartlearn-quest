import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
function simplify(n, d) {
  const g = gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function genFraction(diff) {
  if (diff === 1) {
    const den2 = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
    const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
    return { num: num2, den: den2, display: `${num2}/${den2}`, value: num2 / den2 };
  }
  if (diff === 2) {
    const den2 = [3, 4, 5, 6, 8, 10, 12][Math.floor(Math.random() * 7)];
    const whole = Math.floor(Math.random() * 3);
    const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
    const [sn2, sd2] = simplify(num2, den2);
    if (whole === 0)
      return { num: sn2, den: sd2, display: `${sn2}/${sd2}`, value: sn2 / sd2 };
    return {
      num: whole * sd2 + sn2,
      den: sd2,
      display: `${whole} ${sn2}/${sd2}`,
      value: whole + sn2 / sd2
    };
  }
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const d1 = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
  const d2 = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
  const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
  const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
  let num;
  let den;
  if (op === "+") {
    num = n1 * d2 + n2 * d1;
    den = d1 * d2;
  } else if (op === "-") {
    num = Math.abs(n1 * d2 - n2 * d1);
    den = d1 * d2;
  } else {
    num = n1 * n2;
    den = d1 * d2;
  }
  const [sn, sd] = simplify(num, den);
  return {
    num: sn,
    den: sd,
    display: `(${n1}/${d1} ${op} ${n2}/${d2})`,
    value: sn / sd
  };
}
const TRICKS_WIN = 10;
function FractionWars({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [playerTricks, setPlayerTricks] = reactExports.useState(0);
  const [aiTricks, setAiTricks] = reactExports.useState(0);
  const [cardA, setCardA] = reactExports.useState(genFraction(config.difficulty));
  const [cardB, setCardB] = reactExports.useState(genFraction(config.difficulty));
  const [round, setRound] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const endGame = reactExports.useCallback(
    (completed, _pT, _aT, s, c, t) => {
      setPhase("over");
      const accuracy = t > 0 ? c / t * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, accuracy, timeSpent, completed));
    },
    [config, onGameEnd]
  );
  function choose(choice) {
    if (phase !== "playing") return;
    const eps = 1e-4;
    const actuallyA = cardA.value > cardB.value + eps;
    const actuallyB = cardB.value > cardA.value + eps;
    const actuallyEqual = !actuallyA && !actuallyB;
    const correct_choice = choice === "A" && actuallyA || choice === "B" && actuallyB || choice === "equal" && actuallyEqual;
    const newTotal = total + 1;
    const newCorrect = correct + (correct_choice ? 1 : 0);
    const newScore = score + (correct_choice ? 150 : 0);
    setTotal(newTotal);
    setCorrect(newCorrect);
    setScore(newScore);
    let newPT = playerTricks;
    let newAT = aiTricks;
    if (correct_choice) {
      newPT = playerTricks + 1;
      setPlayerTricks(newPT);
      setFeedback({ msg: "Correct! You win this trick.", correct: true });
    } else {
      newAT = aiTricks + 1;
      setAiTricks(newAT);
      const hint = actuallyA ? `${cardA.display} is larger` : actuallyB ? `${cardB.display} is larger` : "They are equal";
      setFeedback({ msg: `Wrong. ${hint}`, correct: false });
    }
    const newRound = round + 1;
    setRound(newRound);
    if (newRound >= TRICKS_WIN || newPT >= Math.ceil(TRICKS_WIN / 2) + 1 || newAT >= Math.ceil(TRICKS_WIN / 2) + 1) {
      setTimeout(
        () => endGame(newPT > newAT, newPT, newAT, newScore, newCorrect, newTotal),
        1e3
      );
    } else {
      setTimeout(() => {
        setCardA(genFraction(config.difficulty));
        setCardB(genFraction(config.difficulty));
        setFeedback(null);
      }, 1e3);
    }
  }
  function FractionBar({ f }) {
    const pct = Math.min(1, f.value) * 100;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-2xl font-black text-center",
          style: { fontFamily: "'Orbitron', sans-serif" },
          children: f.display
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-6 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-[#00f5ff] transition-all duration-500",
          style: { width: `${pct}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-center text-muted-foreground", children: f.value.toFixed(4) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "fractions_kingdom.page",
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
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Fraction Wars"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                "Compare two fractions and choose which is greater. Win tricks to defeat the AI. Best of ",
                TRICKS_WIN,
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                    setCardA(genFraction(config.difficulty));
                    setCardB(genFraction(config.difficulty));
                  },
                  className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:bg-[#a855f7]/90 transition-colors",
                  "data-ocid": "fractions_kingdom.start_button",
                  children: "Start Battle"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#4ade80]", children: [
              "You: ",
              playerTricks,
              " tricks"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Round ",
              round + 1,
              "/",
              TRICKS_WIN
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400", children: [
              "AI: ",
              aiTricks,
              " tricks"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border-2 border-[#00f5ff]/40 bg-card space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-widest text-center", children: "Card A" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FractionBar, { f: cardA })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border-2 border-[#a855f7]/40 bg-card space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-widest text-center", children: "Card B" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FractionBar, { f: cardB })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: feedback ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0 },
                className: "text-sm font-bold",
                style: { color: feedback.correct ? "#4ade80" : "#f43f5e" },
                children: feedback.msg
              },
              "fb"
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "flex gap-3 flex-wrap justify-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => choose("A"),
                      className: "px-6 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "fractions_kingdom.choose_a",
                      children: "A is Greater"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => choose("equal"),
                      className: "px-6 py-2 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "fractions_kingdom.choose_equal",
                      children: "Equal"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => choose("B"),
                      className: "px-6 py-2 rounded-lg bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "fractions_kingdom.choose_b",
                      children: "B is Greater"
                    }
                  )
                ]
              },
              "btns"
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function genBuildTask(diff) {
  if (diff === 1) {
    const den2 = [2, 3, 4, 5, 6][randInt(0, 4)];
    const num2 = randInt(1, den2 - 1);
    return { num: num2, den: den2, cols: den2 };
  }
  if (diff === 2) {
    const den2 = [4, 6, 8, 9, 10][randInt(0, 4)];
    const num2 = randInt(1, den2 - 1);
    return { num: num2, den: den2, cols: Math.min(den2, 8) };
  }
  const den = [3, 4, 5, 6][randInt(0, 3)];
  const num = randInt(den + 1, den * 2);
  return { num, den, cols: den };
}
function FractionBuilder({ config, onGameEnd }) {
  const TOTAL = 15;
  const [phase, setPhase] = reactExports.useState("idle");
  const [task, setTask] = reactExports.useState(genBuildTask(config.difficulty));
  const [selectedNum, setSelectedNum] = reactExports.useState(null);
  const [selectedDen, setSelectedDen] = reactExports.useState(null);
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
  function submitGuess() {
    if (selectedNum === null || selectedDen === null) return;
    const ok = selectedNum === task.num && selectedDen === task.den;
    const newScore = ok ? score + 120 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! ${task.num}/${task.den}` : `Wrong. It was ${task.num}/${task.den}`,
      ok
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setTask(genBuildTask(config.difficulty));
      setSelectedNum(null);
      setSelectedDen(null);
      setFeedback(null);
      setQIdx(next);
    }, 1e3);
  }
  const totalCells = task.cols * Math.ceil(task.den / task.cols);
  const shadedCount = Math.round(task.num / task.den * totalCells);
  const numOptions = Array.from({ length: task.den * 2 }, (_, i) => i + 1);
  const denOptions = [2, 3, 4, 5, 6, 8, 9, 10, 12];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "fraction_builder.page",
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
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Fraction Builder"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "A shaded rectangle is shown. Select the numerator and denominator that match the visual fraction. 15 rounds." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "fraction_builder.start_button",
                  children: "Build Fractions"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Fraction ",
              qIdx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Correct: ",
              correct
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-[#a855f7]/30 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "What fraction is shaded?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid gap-1",
                style: { gridTemplateColumns: `repeat(${task.cols}, 1fr)` },
                children: Array.from({ length: totalCells }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-8 rounded-sm border border-border/30 ${i < shadedCount ? "bg-[#a855f7]" : "bg-muted"}`
                  },
                  i
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Select Numerator (shaded parts):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: numOptions.slice(0, 12).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedNum(n),
                  className: `w-10 h-10 rounded border-2 font-bold text-sm transition-all ${selectedNum === n ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border hover:border-[#a855f7]/50"}`,
                  "data-ocid": `fraction_builder.num.${n}`,
                  children: n
                },
                n
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Select Denominator (total parts):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: denOptions.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedDen(d),
                  className: `w-10 h-10 rounded border-2 font-bold text-sm transition-all ${selectedDen === d ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border hover:border-[#a855f7]/50"}`,
                  "data-ocid": `fraction_builder.den.${d}`,
                  children: d
                },
                d
              )) })
            ] }),
            selectedNum !== null && selectedDen !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-[#a855f7]", children: [
                selectedNum,
                "/",
                selectedDen
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submitGuess,
                  className: "px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "fraction_builder.submit_button",
                  children: "Confirm"
                }
              )
            ] }),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm font-bold",
                style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                children: feedback.msg
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function lcmOf(a, b) {
  const g = gcd(a, b);
  return a * b / g;
}
function genFQProblem(diff) {
  const dens1 = diff === 1 ? [2, 3, 4] : diff === 2 ? [3, 4, 5, 6] : [4, 5, 6, 8, 10];
  const d1 = dens1[randInt(0, dens1.length - 1)];
  const dens2 = dens1.filter((d) => d !== d1);
  const d2 = dens2[randInt(0, dens2.length - 1)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const op = Math.random() > 0.5 ? "+" : "-";
  const l = lcmOf(d1, d2);
  const converted1 = n1 * (l / d1);
  const converted2 = n2 * (l / d2);
  const rawNum = op === "+" ? converted1 + converted2 : Math.abs(converted1 - converted2);
  const [ansNum, ansDen] = simplify(rawNum, l);
  const wrongLcms = [l * 2, l + 1, d1 * d2].filter((v) => v !== l && v > 0);
  const lcmOptions = [l, ...wrongLcms.slice(0, 3)].sort(
    () => Math.random() - 0.5
  );
  return {
    n1,
    d1,
    n2,
    d2,
    op,
    lcm: l,
    answerNum: ansNum,
    answerDen: ansDen,
    lcmOptions,
    convertedOptions: [{ first: converted1, second: converted2 }]
  };
}
function FractionQuest({ config, onGameEnd }) {
  const TOTAL = 10;
  const [phase, setPhase] = reactExports.useState("idle");
  const [problem, setProblem] = reactExports.useState(
    genFQProblem(config.difficulty)
  );
  const [step, setStep] = reactExports.useState("lcm");
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [inputNum, setInputNum] = reactExports.useState("");
  const [inputDen, setInputDen] = reactExports.useState("");
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
  function chooseLCM(val) {
    const ok = val === problem.lcm;
    setFeedback({
      msg: ok ? `Correct LCM = ${problem.lcm}` : `Wrong. LCM of ${problem.d1} and ${problem.d2} = ${problem.lcm}`,
      ok
    });
    setTimeout(() => {
      if (ok) setStep("convert");
      else setStep("lcm");
      setFeedback(null);
    }, 800);
  }
  function submitConvert() {
    const c1 = problem.n1 * (problem.lcm / problem.d1);
    const c2 = problem.n2 * (problem.lcm / problem.d2);
    const expNum = inputNum.trim();
    const expDen = inputDen.trim();
    expNum === `${c1}/${problem.lcm}` || Number(expNum) === c1 && Number(expDen) === problem.lcm;
    const okSimple = Number(expNum) === c1;
    if (okSimple) {
      setFeedback({
        msg: `Correct! ${problem.n1}/${problem.d1} = ${c1}/${problem.lcm} and ${problem.n2}/${problem.d2} = ${c2}/${problem.lcm}`,
        ok: true
      });
      setTimeout(() => {
        setStep("add");
        setFeedback(null);
        setInputNum("");
        setInputDen("");
      }, 1200);
    } else {
      setFeedback({
        msg: `Hint: ${problem.n1}/${problem.d1} = ${c1}/${problem.lcm}`,
        ok: false
      });
    }
  }
  function submitAnswer() {
    const num = Number.parseInt(inputNum.trim());
    const den = Number.parseInt(inputDen.trim());
    const ok = num === problem.answerNum && den === problem.answerDen;
    const newScore = ok ? score + 200 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! ${problem.answerNum}/${problem.answerDen}` : `Wrong. Answer: ${problem.answerNum}/${problem.answerDen}`,
      ok
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setProblem(genFQProblem(config.difficulty));
      setStep("lcm");
      setFeedback(null);
      setInputNum("");
      setInputDen("");
      setQIdx(next);
    }, 1e3);
  }
  const c1shown = problem.n1 * (problem.lcm / problem.d1);
  const c2shown = problem.n2 * (problem.lcm / problem.d2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "fraction_quest.page",
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
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Fraction Quest"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Add and subtract fractions step-by-step. Find the LCM, convert, then calculate. 10 problems." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "fraction_quest.start_button",
                  children: "Begin Quest"
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-4xl font-black text-center",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: [
                problem.n1,
                "/",
                problem.d1,
                " ",
                problem.op,
                " ",
                problem.n2,
                "/",
                problem.d2
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 justify-center", children: ["lcm", "convert", "add"].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `px-3 py-1 rounded text-xs font-bold border ${step === s ? "border-[#a855f7] text-[#a855f7]" : i < ["lcm", "convert", "add"].indexOf(step) ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`,
              children: [
                "Step ",
                i + 1,
                ":",
                " ",
                s === "lcm" ? "Find LCM" : s === "convert" ? "Convert" : "Calculate"
              ]
            },
            s
          )) }),
          step === "lcm" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
              "What is the LCM of ",
              problem.d1,
              " and ",
              problem.d2,
              "?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: problem.lcmOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => chooseLCM(opt),
                className: "px-6 py-3 rounded-lg border-2 border-[#a855f7]/40 font-bold text-lg hover:border-[#a855f7] hover:bg-[#a855f7]/10 transition-all",
                "data-ocid": `fraction_quest.lcm.${i + 1}`,
                children: opt
              },
              i
            )) })
          ] }),
          step === "convert" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
              "LCM = ",
              problem.lcm,
              ". Enter the converted first fraction numerator:"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              problem.n1,
              "/",
              problem.d1,
              " = ?/",
              problem.lcm
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: inputNum,
                  onChange: (e) => setInputNum(e.target.value),
                  className: "w-24 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2",
                  placeholder: "?",
                  "data-ocid": "fraction_quest.convert_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-bold", children: [
                "/ ",
                problem.lcm
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submitConvert,
                  className: "px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "fraction_quest.convert_submit",
                  children: "Check"
                }
              )
            ] })
          ] }),
          step === "add" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
              c1shown,
              "/",
              problem.lcm,
              " ",
              problem.op,
              " ",
              c2shown,
              "/",
              problem.lcm,
              " = ?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter final answer (simplified if possible)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: inputNum,
                  onChange: (e) => setInputNum(e.target.value),
                  className: "w-20 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2",
                  placeholder: "num",
                  "data-ocid": "fraction_quest.ans_num"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold", children: "/" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: inputDen,
                  onChange: (e) => setInputDen(e.target.value),
                  className: "w-20 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2",
                  placeholder: "den",
                  "data-ocid": "fraction_quest.ans_den"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submitAnswer,
                  className: "px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "fraction_quest.answer_submit",
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
        ] })
      ]
    }
  );
}
function FractionsKingdom({ config, onGameEnd }) {
  if (config.gameId === "fraction-builder")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FractionBuilder, { config, onGameEnd });
  if (config.gameId === "fraction-quest")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FractionQuest, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FractionWars, { config, onGameEnd });
}
export {
  FractionsKingdom as default
};
