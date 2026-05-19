import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function genRaceProblem(diff) {
  if (diff === 1) {
    const speed = randInt(20, 60);
    const time = randInt(1, 4);
    const dist = speed * time;
    const type = randInt(0, 2);
    if (type === 0)
      return {
        question: `Distance = ${dist}km, Speed = ${speed}km/h. Time (hours)?`,
        answer: time,
        formula: "Time = Distance / Speed"
      };
    if (type === 1)
      return {
        question: `Speed = ${speed}km/h, Time = ${time}h. Distance (km)?`,
        answer: dist,
        formula: "Distance = Speed x Time"
      };
    return {
      question: `Distance = ${dist}km, Time = ${time}h. Speed (km/h)?`,
      answer: speed,
      formula: "Speed = Distance / Time"
    };
  }
  if (diff === 2) {
    const speed_ms = randInt(5, 20);
    const speed_kmh = Math.round(speed_ms * 3.6);
    const type = randInt(0, 1);
    if (type === 0)
      return {
        question: `${speed_ms} m/s = ? km/h (round to nearest whole)`,
        answer: speed_kmh,
        formula: "km/h = m/s x 3.6"
      };
    const dist = randInt(50, 200);
    const time = randInt(2, 5);
    const speed = Math.round(dist / time);
    return {
      question: `Car travels ${dist}km in ${time} hours at constant speed. Speed (km/h)?`,
      answer: speed,
      formula: "Speed = Distance / Time"
    };
  }
  const d1 = randInt(30, 100);
  const s1 = randInt(20, 60);
  const d2 = randInt(30, 100);
  const s2 = randInt(20, 60);
  const t1 = d1 / s1;
  const t2 = d2 / s2;
  const diff_min = Math.round(Math.abs(t1 - t2) * 60);
  return {
    question: `Car A: ${d1}km at ${s1}km/h. Car B: ${d2}km at ${s2}km/h. Difference in time (mins)?`,
    answer: diff_min,
    formula: `T_A=${t1.toFixed(2)}h, T_B=${t2.toFixed(2)}h`
  };
}
const TRACK_LENGTH = 100;
const LAPS_TO_WIN = 5;
const AI_CARS_INIT = [
  { id: 2, name: "Falcon", color: "#f43f5e", isPlayer: false, pos: 0 },
  { id: 3, name: "Viper", color: "#f59e0b", isPlayer: false, pos: 0 }
];
function TimeTrialRacer({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [cars, setCars] = reactExports.useState([
    { id: 1, name: "You", color: "#00f5ff", isPlayer: true, pos: 0 },
    ...AI_CARS_INIT.map((c) => ({ ...c }))
  ]);
  const [problem, setProblem] = reactExports.useState(
    genRaceProblem(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [winner, setWinner] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const totalRef = reactExports.useRef(total);
  totalRef.current = total;
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (won) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, scoreRef.current, acc, ts, won));
    },
    [config, onGameEnd]
  );
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    const aiSpeed = config.difficulty === 1 ? 2.5 : config.difficulty === 2 ? 3.5 : 4.5;
    const interval = setInterval(() => {
      setCars((prev) => {
        const updated = prev.map((c) => {
          if (c.isPlayer) return c;
          const newPos = c.pos + aiSpeed + (Math.random() - 0.4);
          if (newPos >= TRACK_LENGTH * LAPS_TO_WIN && !winner) {
            setWinner(c.name);
            setTimeout(() => endGame(false), 500);
          }
          return { ...c, pos: Math.min(newPos, TRACK_LENGTH * LAPS_TO_WIN) };
        });
        return updated;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [phase, config.difficulty, winner, endGame]);
  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newTotal = total + 1;
    setTotal(newTotal);
    const tol = problem.answer > 50 ? problem.answer * 0.03 : 0.5;
    const ok = Math.abs(val - problem.answer) <= tol;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = ok ? score + 200 : Math.max(0, score);
    setCorrect(newCorrect);
    setScore(newScore);
    if (ok) {
      setCars(
        (prev) => prev.map((c) => {
          if (!c.isPlayer) return c;
          const newPos = c.pos + 15;
          if (newPos >= TRACK_LENGTH * LAPS_TO_WIN)
            setTimeout(() => endGame(true), 300);
          return { ...c, pos: Math.min(newPos, TRACK_LENGTH * LAPS_TO_WIN) };
        })
      );
      setFeedback({ msg: "Correct! Your car accelerates!", ok: true });
    } else {
      setFeedback({ msg: `Wrong. ${problem.formula}`, ok: false });
    }
    setTimeout(() => {
      setProblem(genRaceProblem(config.difficulty));
      setInput("");
      setFeedback(null);
    }, 1e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "time_speed.page",
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
                  children: "Time Trial Racer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Solve speed/distance/time problems to accelerate your car. Finish before the AI to win!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                    setProblem(genRaceProblem(config.difficulty));
                  },
                  className: "px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "time_speed.start_button",
                  children: "Race!"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-border/30 bg-card space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: "Race Track" }),
            cars.map((car) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: car.color }, children: car.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  Math.floor(car.pos / TRACK_LENGTH * 100 / LAPS_TO_WIN),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-4 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded transition-all duration-300",
                  style: {
                    width: `${Math.min(100, car.pos / (TRACK_LENGTH * LAPS_TO_WIN) * 100)}%`,
                    background: car.color
                  }
                }
              ) })
            ] }, car.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "flex-1 flex flex-col items-center justify-center gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground font-mono text-center", children: problem.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.1",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-2xl font-bold rounded border-2 border-[#00f5ff]/50 bg-background focus:border-[#00f5ff] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "time_speed.answer_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "time_speed.submit_button",
                      children: "Answer"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: problem.formula }),
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
            problem.question
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground text-center", children: [
            "Score: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
          ] })
        ] })
      ]
    }
  );
}
function genSpeedProblem(diff, idx) {
  const unknowns = [
    "speed",
    "distance",
    "time"
  ];
  const unknown = unknowns[idx % 3];
  if (diff === 1) {
    const s = randInt(20, 80);
    const t = randInt(1, 5);
    const d = s * t;
    if (unknown === "speed")
      return {
        scenario: `A bus travels ${d} km in ${t} hours at constant speed.`,
        given: [
          { label: "Distance", value: d, unit: "km" },
          { label: "Time", value: t, unit: "h" }
        ],
        unknown,
        question: "What is the speed (km/h)?",
        answer: s,
        answerUnit: "km/h",
        formula: "Speed = Distance ÷ Time",
        workings: `${d} ÷ ${t} = ${s}`
      };
    if (unknown === "distance")
      return {
        scenario: `A car drives at ${s} km/h for ${t} hours.`,
        given: [
          { label: "Speed", value: s, unit: "km/h" },
          { label: "Time", value: t, unit: "h" }
        ],
        unknown,
        question: "What distance is covered (km)?",
        answer: d,
        answerUnit: "km",
        formula: "Distance = Speed × Time",
        workings: `${s} × ${t} = ${d}`
      };
    return {
      scenario: `A train covers ${d} km at ${s} km/h.`,
      given: [
        { label: "Distance", value: d, unit: "km" },
        { label: "Speed", value: s, unit: "km/h" }
      ],
      unknown,
      question: "How long does it take (hours)?",
      answer: t,
      answerUnit: "h",
      formula: "Time = Distance ÷ Speed",
      workings: `${d} ÷ ${s} = ${t}`
    };
  }
  if (diff === 2) {
    const s = randInt(30, 120);
    const t = randInt(1, 4) + 0.5;
    const d = s * t;
    if (unknown === "speed")
      return {
        scenario: `A motorcycle travels ${d} km in ${t} hours.`,
        given: [
          { label: "Distance", value: d, unit: "km" },
          { label: "Time", value: t, unit: "h" }
        ],
        unknown,
        question: "Calculate the speed (km/h).",
        answer: s,
        answerUnit: "km/h",
        formula: "Speed = Distance ÷ Time",
        workings: `${d} ÷ ${t} = ${s}`
      };
    if (unknown === "distance")
      return {
        scenario: `A plane flies at ${s} km/h for ${t} hours.`,
        given: [
          { label: "Speed", value: s, unit: "km/h" },
          { label: "Time", value: t, unit: "h" }
        ],
        unknown,
        question: "What distance is covered (km)?",
        answer: d,
        answerUnit: "km",
        formula: "Distance = Speed × Time",
        workings: `${s} × ${t} = ${d}`
      };
    return {
      scenario: `A runner covers ${d} km at ${s} km/h.`,
      given: [
        { label: "Distance", value: d, unit: "km" },
        { label: "Speed", value: s, unit: "km/h" }
      ],
      unknown,
      question: "How long does the journey take (hours)?",
      answer: t,
      answerUnit: "h",
      formula: "Time = Distance ÷ Speed",
      workings: `${d} ÷ ${s} = ${t}`
    };
  }
  const s_ms = randInt(5, 25);
  const s_kmh = Number.parseFloat((s_ms * 3.6).toFixed(1));
  const t_s = randInt(10, 60);
  const d_m = Number.parseFloat((s_ms * t_s).toFixed(1));
  if (unknown === "speed")
    return {
      scenario: `An athlete covers ${d_m} m in ${t_s} seconds.`,
      given: [
        { label: "Distance", value: d_m, unit: "m" },
        { label: "Time", value: t_s, unit: "s" }
      ],
      unknown,
      question: "Speed in m/s? (Then convert to km/h)",
      answer: s_ms,
      answerUnit: "m/s",
      formula: "Speed = Distance ÷ Time; km/h = m/s × 3.6",
      workings: `${d_m} ÷ ${t_s} = ${s_ms} m/s = ${s_kmh} km/h`
    };
  if (unknown === "distance")
    return {
      scenario: `A ball rolls at ${s_ms} m/s for ${t_s} seconds.`,
      given: [
        { label: "Speed", value: s_ms, unit: "m/s" },
        { label: "Time", value: t_s, unit: "s" }
      ],
      unknown,
      question: "How far does it travel (m)?",
      answer: d_m,
      answerUnit: "m",
      formula: "Distance = Speed × Time",
      workings: `${s_ms} × ${t_s} = ${d_m}`
    };
  return {
    scenario: `A cyclist covers ${d_m} m at ${s_ms} m/s.`,
    given: [
      { label: "Distance", value: d_m, unit: "m" },
      { label: "Speed", value: s_ms, unit: "m/s" }
    ],
    unknown,
    question: "How long does it take (seconds)?",
    answer: t_s,
    answerUnit: "s",
    formula: "Time = Distance ÷ Speed",
    workings: `${d_m} ÷ ${s_ms} = ${t_s}`
  };
}
function SpeedCalculator({ config, onGameEnd }) {
  const TOTAL = 12;
  const [phase, setPhase] = reactExports.useState("idle");
  const [idx, setIdx] = reactExports.useState(0);
  const [problems] = reactExports.useState(
    () => Array.from(
      { length: TOTAL },
      (_, i) => genSpeedProblem(config.difficulty, i)
    )
  );
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const prob = problems[idx];
  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const tol = prob.answer > 10 ? prob.answer * 0.05 : 0.1;
    const ok = Math.abs(val - prob.answer) <= tol;
    const newScore = ok ? score + 200 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    setFeedback({
      msg: ok ? `Correct! ${prob.answer} ${prob.answerUnit}` : `Wrong. ${prob.formula}`,
      ok,
      workings: prob.workings
    });
    const nextIdx = idx + 1;
    if (nextIdx >= TOTAL) {
      setTimeout(() => {
        setPhase("over");
        const acc = newCorrect / TOTAL * 100;
        const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
        onGameEnd(buildResult(config, newScore, acc, ts, true));
      }, 1200);
    } else {
      setTimeout(() => {
        setIdx(nextIdx);
        setInput("");
        setFeedback(null);
      }, 1400);
    }
  }
  const labelColor = {
    speed: "#00f5ff",
    distance: "#4ade80",
    time: "#f59e0b"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "speed_calculator.page",
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
                  children: "Speed Calculator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Solve D=S×T problems. Each question gives you two values — find the missing one. 12 scenarios across speed, distance, and time." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00f5ff" }, children: "Speed = D ÷ T" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#4ade80" }, children: "Distance = S × T" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#f59e0b" }, children: "Time = D ÷ S" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "speed_calculator.start_button",
                  children: "Solve Problems"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Problem ",
              idx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border/30 bg-card", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: prob.scenario }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-wrap", children: [
                    prob.given.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex flex-col items-center p-3 rounded-lg border border-border/40 bg-muted/20 min-w-20",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: g.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black", children: g.value }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: g.unit })
                        ]
                      },
                      g.label
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex flex-col items-center p-3 rounded-lg border-2 min-w-20",
                        style: { borderColor: labelColor[prob.unknown] },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "text-xs font-bold",
                              style: { color: labelColor[prob.unknown] },
                              children: prob.unknown.toUpperCase()
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "text-lg font-black",
                              style: { color: labelColor[prob.unknown] },
                              children: "?"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: prob.answerUnit })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: prob.formula })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: prob.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.1",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-2xl font-bold rounded border-2 border-[#00f5ff]/50 bg-background focus:border-[#00f5ff] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "speed_calculator.answer_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "speed_calculator.submit_button",
                      children: "Calculate"
                    }
                  )
                ] }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold",
                      style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                      children: feedback.msg
                    }
                  ),
                  feedback.workings && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                    "Workings: ",
                    feedback.workings
                  ] })
                ] })
              ]
            },
            idx
          ) })
        ] })
      ]
    }
  );
}
const ALL_ACTIVITIES = [
  { name: "Morning Assembly", durationMin: 30, color: "#00f5ff" },
  { name: "Mathematics", durationMin: 50, color: "#f59e0b" },
  { name: "Science Class", durationMin: 45, color: "#4ade80" },
  { name: "Short Break", durationMin: 15, color: "#a855f7" },
  { name: "English", durationMin: 50, color: "#f43f5e" },
  { name: "Lunch Break", durationMin: 40, color: "#fb923c" },
  { name: "ICT Lesson", durationMin: 45, color: "#06b6d4" },
  { name: "Physical Education", durationMin: 60, color: "#84cc16" },
  { name: "Social Studies", durationMin: 40, color: "#ec4899" },
  { name: "Reading Period", durationMin: 30, color: "#8b5cf6" }
];
function genScheduleRound(diff) {
  const count = diff === 1 ? 4 : diff === 2 ? 5 : 6;
  const shuffled = [...ALL_ACTIVITIES].sort(() => Math.random() - 0.5).slice(0, count);
  return {
    activities: shuffled,
    startHour: 8,
    startMin: 0,
    endHour: 15,
    endMin: 0
  };
}
function formatTime(h, m) {
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
function ScheduleMaster({ config, onGameEnd }) {
  const TOTAL_ROUNDS = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 4;
  const [phase, setPhase] = reactExports.useState("idle");
  const [roundIdx, setRoundIdx] = reactExports.useState(0);
  const [round, setRound] = reactExports.useState(
    () => genScheduleRound(config.difficulty)
  );
  const [order, setOrder] = reactExports.useState(
    () => round.activities.map((_, i) => i)
  );
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [dragging, setDragging] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  function moveItem(fromIdx, dir) {
    setOrder((prev) => {
      const next = [...prev];
      const toIdx = fromIdx + dir;
      if (toIdx < 0 || toIdx >= next.length) return prev;
      [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
      return next;
    });
  }
  function submitSchedule() {
    if (submitted) return;
    setSubmitted(true);
    const totalMin = order.reduce(
      (acc, i) => acc + round.activities[i].durationMin,
      0
    );
    const startTotal = round.startHour * 60 + round.startMin;
    const endTotal = startTotal + totalMin;
    const endH = Math.floor(endTotal / 60);
    const endM = endTotal % 60;
    const maxEnd = round.endHour * 60 + round.endMin;
    const ok = endTotal <= maxEnd;
    const pts = ok ? 200 : 0;
    const newScore = score + pts;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    setResult({
      ok,
      msg: ok ? `Schedule fits! Total: ${totalMin} min, finishes at ${formatTime(endH, endM)}.` : `Schedule runs too long! Finishes at ${formatTime(endH, endM)} — ${endTotal - maxEnd} min over limit.`,
      endTime: formatTime(endH, endM)
    });
    const nextRound = roundIdx + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setTimeout(() => {
        setPhase("over");
        const acc = newCorrect / TOTAL_ROUNDS * 100;
        const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
        onGameEnd(buildResult(config, newScore, acc, ts, true));
      }, 2e3);
    } else {
      setTimeout(() => {
        const newRound = genScheduleRound(config.difficulty);
        setRoundIdx(nextRound);
        setRound(newRound);
        setOrder(newRound.activities.map((_, i) => i));
        setSubmitted(false);
        setResult(null);
      }, 2e3);
    }
  }
  const timeSlots = [];
  let curH = round.startHour;
  let curM = round.startMin;
  for (const i of order) {
    const act = round.activities[i];
    const startStr = formatTime(curH, curM);
    curM += act.durationMin;
    while (curM >= 60) {
      curM -= 60;
      curH++;
    }
    timeSlots.push({
      name: act.name,
      start: startStr,
      end: formatTime(curH, curM),
      color: act.color
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "schedule_master.page",
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
                  children: "Schedule Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Arrange school activities into a timetable. Use the arrows to reorder. Make sure everything fits within school hours (8:00 AM – 3:00 PM)!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "schedule_master.start_button",
                  children: "Plan the Day"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Round ",
              roundIdx + 1,
              "/",
              TOTAL_ROUNDS
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Start: 8:00 AM | End by: 3:00 PM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Use arrows to reorder activities, then submit your schedule." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 flex-1 overflow-auto", children: order.map((actIdx, pos) => {
            const act = round.activities[actIdx];
            const slot = timeSlots[pos];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                layout: true,
                className: "flex items-center gap-2 p-2 rounded-lg border border-border/30 bg-card",
                style: { borderLeftColor: act.color, borderLeftWidth: 3 },
                "data-ocid": `schedule_master.activity.${pos + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => moveItem(pos, -1),
                        disabled: pos === 0 || submitted,
                        className: "w-5 h-4 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center justify-center",
                        children: "▲"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => moveItem(pos, 1),
                        disabled: pos === order.length - 1 || submitted,
                        className: "w-5 h-4 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center justify-center",
                        children: "▼"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: act.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      act.durationMin,
                      " min"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-xs font-mono",
                        style: { color: act.color },
                        children: slot.start
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      "→ ",
                      slot.end
                    ] })
                  ] })
                ]
              },
              actIdx
            );
          }) }),
          result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-3 rounded-xl border text-sm font-bold",
              style: {
                borderColor: result.ok ? "#4ade80" : "#f43f5e",
                color: result.ok ? "#4ade80" : "#f43f5e"
              },
              children: result.msg
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: submitSchedule,
              className: "py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity",
              "data-ocid": "schedule_master.submit_button",
              children: "Submit Schedule"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "none" }, children: dragging })
      ]
    }
  );
}
function TimeSpeed({ config, onGameEnd }) {
  if (config.gameId === "speed-calculator")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedCalculator, { config, onGameEnd });
  if (config.gameId === "schedule-master")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduleMaster, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TimeTrialRacer, { config, onGameEnd });
}
export {
  TimeSpeed as default
};
