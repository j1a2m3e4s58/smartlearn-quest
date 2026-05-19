import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
const TASKS_BY_DIFF = {
  1: [
    {
      type: "length",
      objectName: "Pencil",
      actualValue: 15,
      unit: "cm",
      toolLabel: "Ruler (cm)",
      scale: 20,
      precision: 0
    },
    {
      type: "length",
      objectName: "Book width",
      actualValue: 21,
      unit: "cm",
      toolLabel: "Ruler (cm)",
      scale: 30,
      precision: 0
    },
    {
      type: "weight",
      objectName: "Apple",
      actualValue: 200,
      unit: "g",
      toolLabel: "Scale (g)",
      scale: 500,
      precision: 0
    },
    {
      type: "volume",
      objectName: "Cup of water",
      actualValue: 250,
      unit: "mL",
      toolLabel: "Jug (mL)",
      scale: 500,
      precision: 0
    },
    {
      type: "angle",
      objectName: "Angle A",
      actualValue: 45,
      unit: "deg",
      toolLabel: "Protractor",
      scale: 180,
      precision: 0
    }
  ],
  2: [
    {
      type: "length",
      objectName: "Nail",
      actualValue: 3.5,
      unit: "cm",
      toolLabel: "Ruler (mm)",
      scale: 10,
      precision: 1
    },
    {
      type: "weight",
      objectName: "Stone",
      actualValue: 1.25,
      unit: "kg",
      toolLabel: "Scale (kg)",
      scale: 5,
      precision: 2
    },
    {
      type: "volume",
      objectName: "Bottle",
      actualValue: 0.75,
      unit: "L",
      toolLabel: "Jug (L)",
      scale: 2,
      precision: 2
    },
    {
      type: "angle",
      objectName: "Angle B",
      actualValue: 127,
      unit: "deg",
      toolLabel: "Protractor",
      scale: 180,
      precision: 0
    },
    {
      type: "length",
      objectName: "Ribbon",
      actualValue: 8.4,
      unit: "cm",
      toolLabel: "Ruler (mm)",
      scale: 15,
      precision: 1
    }
  ],
  3: [
    {
      type: "length",
      objectName: "Wire",
      actualValue: 1.67,
      unit: "m",
      toolLabel: "Tape (m)",
      scale: 3,
      precision: 2
    },
    {
      type: "weight",
      objectName: "Box",
      actualValue: 3.75,
      unit: "kg",
      toolLabel: "Scale (kg)",
      scale: 10,
      precision: 2
    },
    {
      type: "volume",
      objectName: "Flask",
      actualValue: 0.325,
      unit: "L",
      toolLabel: "Jug (L)",
      scale: 0.5,
      precision: 3
    },
    {
      type: "angle",
      objectName: "Angle C",
      actualValue: 63,
      unit: "deg",
      toolLabel: "Protractor",
      scale: 180,
      precision: 0
    },
    {
      type: "length",
      objectName: "Thin wire",
      actualValue: 23.5,
      unit: "mm",
      toolLabel: "Vernier (mm)",
      scale: 50,
      precision: 1
    }
  ]
};
function MeasurementMission({ config, onGameEnd }) {
  const tasks = TASKS_BY_DIFF[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
  const [placed, setPlaced] = reactExports.useState(false);
  const [readingPos, setReadingPos] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const correctRef = reactExports.useRef(0);
  const totalRef = reactExports.useRef(0);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    setPhase("over");
    const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
    const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
    onGameEnd(buildResult(config, scoreRef.current, acc, ts, false));
  });
  const endGame = reactExports.useCallback(
    (s, c, t) => {
      setPhase("over");
      const acc = t > 0 ? c / t * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd]
  );
  const task = tasks[taskIdx];
  const indicatorPct = task ? task.actualValue / task.scale * 100 : 0;
  function placeTool() {
    setPlaced(true);
    setReadingPos(indicatorPct);
  }
  function submitReading() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newTotal = total + 1;
    setTotal(newTotal);
    const tol = task.precision === 0 ? 0.5 : task.precision === 1 ? 0.05 : 0.01;
    const ok = Math.abs(val - task.actualValue) <= tol;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = ok ? score + 200 : Math.max(0, score);
    setCorrect(newCorrect);
    setScore(newScore);
    setFeedback({
      msg: ok ? `Correct! ${task.actualValue} ${task.unit}` : `Incorrect. Value was ${task.actualValue} ${task.unit}`,
      ok
    });
    const nextIdx = taskIdx + 1;
    if (nextIdx >= tasks.length) {
      setTimeout(() => endGame(newScore, newCorrect, newTotal), 1e3);
    } else {
      setTimeout(() => {
        setTaskIdx(nextIdx);
        setPlaced(false);
        setInput("");
        setFeedback(null);
      }, 1200);
    }
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "measurement_lab.page",
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
                  className: "text-3xl font-black text-[#06b6d4]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Measurement Mission"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Use virtual measurement tools — rulers, scales, protractors, and jugs — to measure objects accurately." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                    startTimer();
                  },
                  className: "px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "measurement_lab.start_button",
                  children: "Start Lab"
                }
              )
            ]
          }
        ),
        phase === "playing" && task && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#06b6d4] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Task ",
              taskIdx + 1,
              "/",
              tasks.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border/30 bg-card", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Object to measure:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-[#06b6d4]", children: task.objectName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                    "Tool: ",
                    task.toolLabel
                  ] })
                ] }),
                !placed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'Click "Place Tool" to measure the object:' }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: placeTool,
                      className: "px-5 py-2 rounded border-2 border-[#06b6d4] text-[#06b6d4] font-bold hover:bg-[#06b6d4]/10 transition-colors",
                      "data-ocid": "measurement_lab.place_tool",
                      children: [
                        "Place ",
                        task.toolLabel
                      ]
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-[#06b6d4]/40 bg-card", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
                      task.toolLabel,
                      " Reading:"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-8 bg-muted rounded overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex", children: Array.from({ length: 11 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex-1 border-r border-border/30 flex items-end pb-1",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs text-muted-foreground",
                              style: { fontSize: 8 },
                              children: (task.scale * i / 10).toFixed(task.precision)
                            }
                          )
                        },
                        i
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute top-0 bottom-0 w-0.5 bg-red-500 transition-all duration-500",
                          style: { left: `${readingPos}%` }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                      "Read the measurement value (",
                      task.unit,
                      "):"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          step: task.precision === 0 ? "1" : task.precision === 1 ? "0.1" : "0.01",
                          value: input,
                          onChange: (e) => setInput(e.target.value),
                          onKeyDown: (e) => e.key === "Enter" && submitReading(),
                          className: "w-32 text-center text-xl font-bold rounded border-2 border-[#06b6d4]/50 bg-background focus:border-[#06b6d4] focus:outline-none p-2",
                          placeholder: `0.${"0".repeat(task.precision)}`,
                          "data-ocid": "measurement_lab.reading_input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: submitReading,
                          className: "px-5 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity",
                          "data-ocid": "measurement_lab.submit_button",
                          children: "Record"
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
            },
            taskIdx
          ) })
        ] })
      ]
    }
  );
}
function genConvQuestion(diff) {
  const easy = [
    { question: "5 km = ? m", answer: 5e3, unit: "m", category: "Length" },
    { question: "3000 m = ? km", answer: 3, unit: "km", category: "Length" },
    { question: "250 cm = ? m", answer: 2.5, unit: "m", category: "Length" },
    { question: "2 kg = ? g", answer: 2e3, unit: "g", category: "Mass" },
    { question: "500 g = ? kg", answer: 0.5, unit: "kg", category: "Mass" },
    { question: "3 L = ? mL", answer: 3e3, unit: "mL", category: "Volume" },
    { question: "1500 mL = ? L", answer: 1.5, unit: "L", category: "Volume" },
    {
      question: "2 hours = ? minutes",
      answer: 120,
      unit: "min",
      category: "Time"
    },
    {
      question: "180 minutes = ? hours",
      answer: 3,
      unit: "hours",
      category: "Time"
    },
    {
      question: "90 seconds = ? minutes",
      answer: 1.5,
      unit: "min",
      category: "Time"
    }
  ];
  const med = [
    { question: "4.5 km = ? m", answer: 4500, unit: "m", category: "Length" },
    { question: "750 cm = ? m", answer: 7.5, unit: "m", category: "Length" },
    { question: "2.3 kg = ? g", answer: 2300, unit: "g", category: "Mass" },
    { question: "4500 g = ? kg", answer: 4.5, unit: "kg", category: "Mass" },
    { question: "2.75 L = ? mL", answer: 2750, unit: "mL", category: "Volume" },
    { question: "3250 mL = ? L", answer: 3.25, unit: "L", category: "Volume" },
    {
      question: "2.5 hours = ? minutes",
      answer: 150,
      unit: "min",
      category: "Time"
    },
    {
      question: "135 minutes = ? hours",
      answer: 2.25,
      unit: "hours",
      category: "Time"
    },
    {
      question: "3 hours = ? seconds",
      answer: 10800,
      unit: "sec",
      category: "Time"
    },
    { question: "100 mm = ? cm", answer: 10, unit: "cm", category: "Length" }
  ];
  const hard = [
    {
      question: "1.25 km = ? cm",
      answer: 125e3,
      unit: "cm",
      category: "Length"
    },
    { question: "3.75 kg = ? g", answer: 3750, unit: "g", category: "Mass" },
    { question: "0.5 L = ? mL", answer: 500, unit: "mL", category: "Volume" },
    {
      question: "7200 seconds = ? hours",
      answer: 2,
      unit: "hours",
      category: "Time"
    },
    { question: "2.5 m = ? mm", answer: 2500, unit: "mm", category: "Length" },
    {
      question: "3 hours 15 min = ? minutes",
      answer: 195,
      unit: "min",
      category: "Time"
    },
    {
      question: "4.5 L = ? cm³",
      answer: 4500,
      unit: "cm³",
      category: "Volume"
    },
    { question: "1500 mm = ? m", answer: 1.5, unit: "m", category: "Length" }
  ];
  const pool = diff === 1 ? easy : diff === 2 ? med : hard;
  return pool[randInt(0, pool.length - 1)];
}
function UnitConverter({ config, onGameEnd }) {
  const TOTAL = 20;
  const TIME_PER_Q = 10;
  const [phase, setPhase] = reactExports.useState("idle");
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [question, setQuestion] = reactExports.useState(
    () => genConvQuestion(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [streak, setStreak] = reactExports.useState(0);
  const [qTimer, setQTimer] = reactExports.useState(TIME_PER_Q);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const correctRef = reactExports.useRef(0);
  const phaseRef = reactExports.useRef("idle");
  scoreRef.current = score;
  correctRef.current = correct;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (s, c, won) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = c / TOTAL * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, won));
    },
    [config, onGameEnd]
  );
  const nextQuestion = reactExports.useCallback(
    (s, c, idx) => {
      if (idx >= TOTAL) {
        endGame(s, c, true);
        return;
      }
      setQuestion(genConvQuestion(config.difficulty));
      setInput("");
      setFeedback(null);
      setQTimer(TIME_PER_Q);
      setQIdx(idx);
    },
    [config.difficulty, endGame]
  );
  const qTimerRef = reactExports.useRef(qTimer);
  qTimerRef.current = qTimer;
  const qIdxRef = reactExports.useRef(qIdx);
  qIdxRef.current = qIdx;
  const [timerTick, setTimerTick] = reactExports.useState(0);
  const timerTickRef = reactExports.useRef(timerTick);
  timerTickRef.current = timerTick;
  const intervalRef = reactExports.useRef(null);
  const scoreForTimeout = reactExports.useRef(0);
  scoreForTimeout.current = score;
  const correctForTimeout = reactExports.useRef(0);
  correctForTimeout.current = correct;
  const streakRef = reactExports.useRef(streak);
  streakRef.current = streak;
  function startGame() {
    startTimeRef.current = Date.now();
    setQTimer(TIME_PER_Q);
    setQIdx(0);
    setQuestion(genConvQuestion(config.difficulty));
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setFeedback(null);
    setInput("");
    setPhase("playing");
  }
  const qTimerState = qTimer;
  const phaseState = phase;
  reactExports.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseRef.current !== "playing") return;
    intervalRef.current = setInterval(() => {
      setQTimer((prev) => {
        if (prev <= 1) {
          const nextIdx = qIdxRef.current + 1;
          streakRef.current = 0;
          setStreak(0);
          setFeedback({ msg: "Time! Moving on...", ok: false });
          setTimeout(() => {
            setFeedback(null);
            nextQuestion(
              scoreForTimeout.current,
              correctForTimeout.current,
              nextIdx
            );
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
  }, [nextQuestion]);
  reactExports.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const lastQIdx = reactExports.useRef(-1);
  if (phaseState === "playing" && qIdx !== lastQIdx.current) {
    lastQIdx.current = qIdx;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setQTimer((prev) => {
        if (prev <= 1) {
          const nextIdx = qIdxRef.current + 1;
          streakRef.current = 0;
          setStreak(0);
          setFeedback({ msg: "Time! Moving on...", ok: false });
          setTimeout(() => {
            setFeedback(null);
            nextQuestion(
              scoreForTimeout.current,
              correctForTimeout.current,
              nextIdx
            );
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
  }
  if (phaseState !== "playing" && intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const tol = question.answer > 100 ? question.answer * 0.01 : 0.01;
    const ok = Math.abs(val - question.answer) <= tol;
    const newStreak = ok ? streak + 1 : 0;
    const multiplier = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
    const pts = ok ? Math.floor(100 * multiplier) : 0;
    const newScore = score + pts;
    const newCorrect = ok ? correct + 1 : correct;
    setStreak(newStreak);
    setScore(newScore);
    setCorrect(newCorrect);
    setFeedback({
      msg: ok ? `Correct! x${multiplier} streak bonus` : `Wrong. Answer: ${question.answer} ${question.unit}`,
      ok
    });
    const nextIdx = qIdx + 1;
    setTimeout(() => nextQuestion(newScore, newCorrect, nextIdx), 900);
  }
  const qPct = qTimerState / TIME_PER_Q * 100;
  const progPct = qIdx / TOTAL * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "unit_converter.page",
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
                  className: "text-3xl font-black text-[#06b6d4]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Unit Converter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                TOTAL,
                " conversion questions — 10 seconds each. Build a streak multiplier for bonus points. Convert between km, m, cm, kg, g, L, mL, hours, and minutes."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "unit_converter.start_button",
                  children: "Convert!"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-1000",
              style: {
                width: `${qPct}%`,
                background: qTimerState <= 3 ? "#f43f5e" : "#06b6d4"
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#4ade80] transition-all duration-200",
              style: { width: `${progPct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono",
                style: { color: qTimerState <= 3 ? "#f43f5e" : void 0 },
                children: [
                  qTimerState,
                  "s"
                ]
              }
            ),
            streak >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-bold", children: [
              "Streak x",
              streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              qIdx,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center gap-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-1 rounded-full text-xs font-bold",
                    style: { background: "rgba(6,182,212,0.15)", color: "#06b6d4" },
                    children: question.category
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-4xl font-black text-center",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: question.question
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.001",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-36 text-center text-2xl font-bold rounded border-2 border-[#06b6d4]/50 bg-background focus:border-[#06b6d4] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "unit_converter.answer_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "unit_converter.submit_button",
                      children: "Enter"
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
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
const ESTIMATION_OBJECTS = [
  {
    name: "School Desk",
    description: "A standard student classroom desk",
    requestUnit: "cm (length)",
    actualValue: 60,
    context: "Typical desk is about 60 cm wide"
  },
  {
    name: "Pencil",
    description: "A standard HB writing pencil",
    requestUnit: "cm (length)",
    actualValue: 19,
    context: "Standard pencil is about 19 cm long"
  },
  {
    name: "Football Field",
    description: "Full-size football pitch (length)",
    requestUnit: "m (length)",
    actualValue: 105,
    context: "FIFA regulation field is 105 m long"
  },
  {
    name: "Textbook",
    description: "A typical school textbook",
    requestUnit: "g (mass)",
    actualValue: 400,
    context: "Average textbook weighs about 400 g"
  },
  {
    name: "Water Bottle (full)",
    description: "Standard 500mL plastic water bottle",
    requestUnit: "g (mass)",
    actualValue: 510,
    context: "Full 500mL bottle: water (500g) + bottle (~10g)"
  },
  {
    name: "Classroom Door",
    description: "Standard interior classroom door",
    requestUnit: "cm (height)",
    actualValue: 200,
    context: "Standard door height is about 200 cm"
  },
  {
    name: "Car (small sedan)",
    description: "A typical small family car",
    requestUnit: "m (length)",
    actualValue: 4.3,
    context: "Small sedan is about 4.3 m long"
  },
  {
    name: "Swimming Pool",
    description: "Olympic swimming pool (length)",
    requestUnit: "m (length)",
    actualValue: 50,
    context: "Olympic pool is exactly 50 m long"
  },
  {
    name: "Brick",
    description: "Standard red clay building brick",
    requestUnit: "g (mass)",
    actualValue: 2200,
    context: "Standard brick weighs about 2.2 kg"
  },
  {
    name: "Backpack (full, school)",
    description: "Loaded school backpack with books",
    requestUnit: "kg (mass)",
    actualValue: 4,
    context: "A full school backpack is about 4 kg"
  },
  {
    name: "Milk Carton (1L)",
    description: "1-litre school milk carton",
    requestUnit: "mL (volume)",
    actualValue: 1e3,
    context: "1-litre carton contains exactly 1000 mL"
  },
  {
    name: "Palm (hand width)",
    description: "Width of an average adult palm",
    requestUnit: "cm (length)",
    actualValue: 8,
    context: "Average palm width is about 8 cm"
  }
];
function EstimationExpert({ config, onGameEnd }) {
  const TOTAL_OBJECTS = 12;
  const [phase, setPhase] = reactExports.useState(
    "idle"
  );
  const [objIdx, setObjIdx] = reactExports.useState(0);
  const [objects] = reactExports.useState(() => {
    const pool = [...ESTIMATION_OBJECTS];
    while (pool.length < TOTAL_OBJECTS) pool.push(...ESTIMATION_OBJECTS);
    return pool.sort(() => Math.random() - 0.5).slice(0, TOTAL_OBJECTS);
  });
  const [input, setInput] = reactExports.useState("");
  const [lastResult, setLastResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const obj = objects[objIdx];
  function submitEstimate() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val) || val <= 0) {
      setInput("");
      return;
    }
    const pct = Math.abs(val - obj.actualValue) / obj.actualValue;
    const pts = pct <= 0.1 ? 200 : pct <= 0.2 ? 100 : 0;
    const isCorrect = pts > 0;
    const newScore = score + pts;
    const newCorrect = isCorrect ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    setLastResult({
      pct: Math.round(pct * 100),
      actual: obj.actualValue,
      guess: val,
      unit: obj.requestUnit.split(" ")[0]
    });
    setPhase("result");
  }
  function nextObject() {
    const nextIdx = objIdx + 1;
    if (nextIdx >= TOTAL_OBJECTS) {
      setPhase("over");
      const acc = correct / TOTAL_OBJECTS * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, score, acc, ts, true));
    } else {
      setObjIdx(nextIdx);
      setInput("");
      setLastResult(null);
      setPhase("playing");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "estimation_expert.page",
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
                  className: "text-3xl font-black text-[#06b6d4]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Estimation Expert"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Estimate the real-world measurement of everyday objects. Within 10% = full points, within 20% = half points. 12 objects total." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "estimation_expert.start_button",
                  children: "Begin Estimating"
                }
              )
            ]
          }
        ),
        phase === "playing" && obj && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Object ",
                  objIdx + 1,
                  "/",
                  TOTAL_OBJECTS
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Score: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: score })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-xl border border-border/30 bg-card flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-[#06b6d4]", children: obj.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: obj.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-2 rounded bg-muted/30 text-sm", children: [
                  "Estimate the",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#06b6d4] font-bold", children: obj.requestUnit }),
                  " ",
                  "of this object:"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && submitEstimate(),
                    className: "w-36 text-center text-2xl font-bold rounded border-2 border-[#06b6d4]/50 bg-background focus:border-[#06b6d4] focus:outline-none p-2",
                    placeholder: "?",
                    "data-ocid": "estimation_expert.answer_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: submitEstimate,
                    className: "px-5 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity",
                    "data-ocid": "estimation_expert.submit_button",
                    children: "Estimate"
                  }
                )
              ] })
            ]
          },
          objIdx
        ) }),
        phase === "result" && lastResult && obj && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-center", children: obj.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-8 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Your Estimate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black", children: [
                    lastResult.guess,
                    " ",
                    lastResult.unit
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Actual Value" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-[#06b6d4]", children: [
                    lastResult.actual,
                    " ",
                    lastResult.unit
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-lg font-bold",
                    style: {
                      color: lastResult.pct <= 10 ? "#4ade80" : lastResult.pct <= 20 ? "#f59e0b" : "#f43f5e"
                    },
                    children: lastResult.pct <= 10 ? "Excellent! +200 pts" : lastResult.pct <= 20 ? "Close! +100 pts" : "Off by more than 20%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
                  lastResult.pct,
                  "% error"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-center max-w-xs p-2 rounded bg-muted/30", children: obj.context }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: nextObject,
                  className: "px-6 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "estimation_expert.next_button",
                  children: objIdx + 1 < TOTAL_OBJECTS ? "Next Object" : "See Results"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function MeasurementLab({ config, onGameEnd }) {
  if (config.gameId === "unit-converter")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(UnitConverter, { config, onGameEnd });
  if (config.gameId === "estimation-expert")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EstimationExpert, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MeasurementMission, { config, onGameEnd });
}
export {
  MeasurementLab as default
};
