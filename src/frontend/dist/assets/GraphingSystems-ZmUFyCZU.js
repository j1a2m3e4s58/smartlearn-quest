import { r as reactExports, j as jsxRuntimeExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
const GRID_SIZE = 10;
const CELL = 28;
function genTask(diff) {
  if (diff === 1) {
    const points = Array.from({ length: 4 }, () => ({
      x: randInt(-4, 4),
      y: randInt(-4, 4)
    }));
    return {
      points,
      question: `Which quadrant is (${points[0].x}, ${points[0].y}) in?`,
      answer: points[0].x > 0 && points[0].y > 0 ? "Q1" : points[0].x < 0 && points[0].y > 0 ? "Q2" : points[0].x < 0 && points[0].y < 0 ? "Q3" : "Q4",
      hint: "Q1=+,+ Q2=-,+ Q3=-,- Q4=+,-"
    };
  }
  if (diff === 2) {
    const x1 = randInt(-4, 0);
    const y1 = randInt(-3, 3);
    const x2 = randInt(1, 4);
    const rise = randInt(-3, 3);
    const y2 = y1 + rise;
    const slope = (y2 - y1) / (x2 - x1);
    return {
      points: [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
      ],
      question: `Slope of line through (${x1},${y1}) and (${x2},${y2})?`,
      answer: Math.round(slope * 10) / 10,
      hint: "slope = (y2-y1)/(x2-x1)"
    };
  }
  const m = randInt(-3, 3) || 1;
  const b = randInt(-4, 4);
  return {
    points: [
      { x: -3, y: m * -3 + b },
      { x: 3, y: m * 3 + b }
    ],
    question: `y = ${m}x + ${b}. What is the y-intercept?`,
    answer: b,
    hint: `The y-intercept is where x=0. y = ${m}(0) + ${b} = ${b}`
  };
}
function genLineTracerQ(diff) {
  const m = diff === 1 ? randInt(-3, 3) || 1 : randInt(-5, 5) || 1;
  const b = diff === 1 ? randInt(-3, 3) : randInt(-6, 6);
  const mSign = m > 0 ? "positive" : "negative";
  const steepness = Math.abs(m) >= 2 ? "steep" : "gentle";
  const bSign = b > 0 ? "positive" : b < 0 ? "negative" : "zero";
  const correctDesc = `${steepness} ${mSign} slope, ${bSign} y-intercept`;
  const wrongs = [
    `${steepness} ${mSign === "positive" ? "negative" : "positive"} slope, ${bSign} y-intercept`,
    `${steepness === "steep" ? "gentle" : "steep"} ${mSign} slope, ${bSign === "positive" ? "negative" : "positive"} y-intercept`,
    `${steepness} ${mSign} slope, ${bSign === "zero" ? "positive" : "zero"} y-intercept`
  ].filter((w) => w !== correctDesc);
  const opts = shuffle([correctDesc, ...wrongs.slice(0, 3)]);
  return {
    equation: `y = ${m}x ${b >= 0 ? "+" : ""} ${b}`,
    slope: m,
    intercept: b,
    options: opts,
    correctIdx: opts.indexOf(correctDesc)
  };
}
const DATA_TABLES = [
  {
    title: "Monthly Rainfall",
    xLabel: "Month",
    yLabel: "Rainfall (mm)",
    rows: [
      { x: "Jan", y: 20 },
      { x: "Feb", y: 30 },
      { x: "Mar", y: 60 },
      { x: "Apr", y: 90 },
      { x: "May", y: 45 }
    ],
    questions: [
      {
        q: "What is the trend in rainfall from January to April?",
        options: ["Increasing", "Decreasing", "Constant", "No pattern"],
        correctIdx: 0
      },
      {
        q: "Which month had the highest rainfall?",
        options: ["April", "March", "May", "January"],
        correctIdx: 0
      },
      {
        q: "What type of correlation is shown?",
        options: [
          "Positive (overall)",
          "Negative (overall)",
          "No correlation",
          "Perfect linear"
        ],
        correctIdx: 0
      },
      {
        q: "What graph type best displays this data?",
        options: ["Line graph", "Pie chart", "Scatter plot", "Histogram"],
        correctIdx: 0
      },
      {
        q: "What was the rainfall in March?",
        options: ["60 mm", "90 mm", "45 mm", "30 mm"],
        correctIdx: 0
      }
    ]
  },
  {
    title: "Hours Studied vs Score",
    xLabel: "Hours Studied",
    yLabel: "Score (%)",
    rows: [
      { x: 1, y: 45 },
      { x: 2, y: 55 },
      { x: 3, y: 65 },
      { x: 4, y: 75 },
      { x: 5, y: 88 }
    ],
    questions: [
      {
        q: "What is the general trend?",
        options: [
          "More study = higher score",
          "More study = lower score",
          "No relationship",
          "Score is constant"
        ],
        correctIdx: 0
      },
      {
        q: "What score was achieved after 3 hours of study?",
        options: ["65%", "55%", "75%", "45%"],
        correctIdx: 0
      },
      {
        q: "What type of correlation is this?",
        options: [
          "Positive correlation",
          "Negative correlation",
          "Zero correlation",
          "Inverse correlation"
        ],
        correctIdx: 0
      },
      {
        q: "Best graph for continuous numerical data?",
        options: ["Scatter plot", "Bar chart", "Pie chart", "Pictograph"],
        correctIdx: 0
      },
      {
        q: "Predict score for 6 hours (extrapolate)?",
        options: ["About 95-100%", "About 70%", "About 50%", "Cannot predict"],
        correctIdx: 0
      }
    ]
  },
  {
    title: "Temperature vs Ice Cream Sales",
    xLabel: "Temperature (°C)",
    yLabel: "Units Sold",
    rows: [
      { x: 15, y: 20 },
      { x: 20, y: 40 },
      { x: 25, y: 70 },
      { x: 30, y: 100 },
      { x: 35, y: 130 }
    ],
    questions: [
      {
        q: "What happens to sales as temperature rises?",
        options: [
          "Sales increase",
          "Sales decrease",
          "Sales stay the same",
          "No pattern"
        ],
        correctIdx: 0
      },
      {
        q: "How many units were sold at 25°C?",
        options: ["70", "40", "100", "20"],
        correctIdx: 0
      },
      {
        q: "What type of correlation is this?",
        options: [
          "Strong positive",
          "Strong negative",
          "Weak positive",
          "No correlation"
        ],
        correctIdx: 0
      },
      {
        q: "What is the best graph type?",
        options: ["Scatter plot", "Pie chart", "Histogram", "Frequency table"],
        correctIdx: 0
      },
      {
        q: "At what temperature were 100 units sold?",
        options: ["30°C", "25°C", "35°C", "20°C"],
        correctIdx: 0
      }
    ]
  }
];
function GraphingSystems({ config, onGameEnd }) {
  const gameId = config.gameId;
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
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
  const [task, setTask] = reactExports.useState(() => genTask(config.difficulty));
  const [plotted, setPlotted] = reactExports.useState([]);
  const [g1Input, setG1Input] = reactExports.useState("");
  const [g1Feedback, setG1Feedback] = reactExports.useState(null);
  const MAX_TASKS = 6;
  const originX = GRID_SIZE / 2 * CELL;
  const originY = GRID_SIZE / 2 * CELL;
  const svgSize = GRID_SIZE * CELL;
  function gridToSvg(gx, gy) {
    return { sx: originX + gx * CELL, sy: originY - gy * CELL };
  }
  function handleGridClick(e) {
    if (g1Phase !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const gx = Math.round((px - originX) / CELL);
    const gy = Math.round((originY - py) / CELL);
    if (gx < -GRID_SIZE / 2 || gx > GRID_SIZE / 2 || gy < -GRID_SIZE / 2 || gy > GRID_SIZE / 2)
      return;
    if (!plotted.find((p) => p.x === gx && p.y === gy))
      setPlotted((prev) => [...prev, { x: gx, y: gy }]);
  }
  function g1Submit() {
    const val = config.difficulty === 1 ? g1Input.trim().toUpperCase() : Number.parseFloat(g1Input.trim());
    if (val === "" || typeof val === "number" && Number.isNaN(val)) return;
    const newTotal = total + 1;
    setTotal(newTotal);
    const ok = config.difficulty === 1 ? val === task.answer : Math.abs(val - task.answer) <= 0.15;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = ok ? score + 200 : score;
    setCorrect(newCorrect);
    setScore(newScore);
    setG1Feedback({
      msg: ok ? `Correct! ${task.answer}` : `Wrong. Answer: ${task.answer}. ${task.hint}`,
      ok
    });
    const nextTask = taskIdx + 1;
    if (nextTask >= MAX_TASKS) {
      setTimeout(() => endGame(newScore, newCorrect, newTotal, true), 1e3);
    } else {
      setTimeout(() => {
        setTask(genTask(config.difficulty));
        setPlotted([]);
        setG1Input("");
        setG1Feedback(null);
        setTaskIdx(nextTask);
      }, 1200);
    }
  }
  const TOTAL_LT = 12;
  const [g2Phase, setG2Phase] = reactExports.useState("idle");
  const [g2Questions] = reactExports.useState(
    () => Array.from({ length: TOTAL_LT }, () => genLineTracerQ(config.difficulty))
  );
  const [g2Idx, setG2Idx] = reactExports.useState(0);
  const [g2Chosen, setG2Chosen] = reactExports.useState(null);
  const [g2Feedback, setG2Feedback] = reactExports.useState(null);
  function g2Choose(optIdx) {
    if (g2Feedback) return;
    setG2Chosen(optIdx);
    const q = g2Questions[g2Idx];
    const ok = optIdx === q.correctIdx;
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
    setG2Feedback({
      ok,
      msg: ok ? `Correct! ${q.options[q.correctIdx]}` : `Wrong. Correct: ${q.options[q.correctIdx]}`
    });
    setTimeout(() => {
      const next = g2Idx + 1;
      if (next >= TOTAL_LT) {
        endGame(scoreRef.current, correctRef.current, totalRef.current, true);
        return;
      }
      setG2Idx(next);
      setG2Chosen(null);
      setG2Feedback(null);
    }, 1200);
  }
  const ROUNDS = 3;
  const [g3Phase, setG3Phase] = reactExports.useState("idle");
  const [g3Round, setG3Round] = reactExports.useState(0);
  const [g3TableIdx] = reactExports.useState(
    () => Array.from({ length: ROUNDS }, (_, i) => i % DATA_TABLES.length)
  );
  const [g3QIdx, setG3QIdx] = reactExports.useState(0);
  const [g3Chosen, setG3Chosen] = reactExports.useState(null);
  const [g3Feedback, setG3Feedback] = reactExports.useState(null);
  const g3Table = DATA_TABLES[g3TableIdx[g3Round] ?? 0];
  const g3Question = g3Table == null ? void 0 : g3Table.questions[g3QIdx];
  function g3Choose(optIdx) {
    if (g3Feedback || !g3Question) return;
    setG3Chosen(optIdx);
    const ok = optIdx === g3Question.correctIdx;
    const pts = ok ? 120 * config.difficulty : 0;
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
      msg: ok ? "Correct!" : `Wrong. Answer: ${g3Question.options[g3Question.correctIdx]}`
    });
    setTimeout(() => {
      const nextQ = g3QIdx + 1;
      if (nextQ >= g3Table.questions.length) {
        const nextR = g3Round + 1;
        if (nextR >= ROUNDS) {
          endGame(scoreRef.current, correctRef.current, totalRef.current, true);
          return;
        }
        setG3Round(nextR);
        setG3QIdx(0);
      } else {
        setG3QIdx(nextQ);
      }
      setG3Chosen(null);
      setG3Feedback(null);
    }, 1200);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-3",
      "data-ocid": "graphing_systems.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#a855f7] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        gameId === "graph-navigator" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    className: "text-3xl font-black text-[#a855f7]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Graph Navigator"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Plot points on coordinate grids and answer questions about lines, slopes, and intercepts." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG1Phase("playing");
                      startTimer();
                    },
                    className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                    "data-ocid": "graphing_systems.start_button",
                    children: "Start Graphing"
                  }
                )
              ]
            }
          ),
          g1Phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Task ",
                taskIdx + 1,
                "/",
                MAX_TASKS
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                timeLeft,
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: task.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                role: "button",
                tabIndex: 0,
                "aria-label": "Coordinate grid",
                style: { display: "inline-block" },
                onClick: handleGridClick,
                onKeyDown: (e) => {
                  if (e.key === "Enter")
                    handleGridClick(e);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    width: svgSize,
                    height: svgSize,
                    className: "border border-border/30 rounded bg-card/50 cursor-crosshair",
                    children: [
                      Array.from({ length: GRID_SIZE + 1 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: i * CELL,
                          y1: 0,
                          x2: i * CELL,
                          y2: svgSize,
                          stroke: "rgba(255,255,255,0.05)"
                        },
                        `v${i}`
                      )),
                      Array.from({ length: GRID_SIZE + 1 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: 0,
                          y1: i * CELL,
                          x2: svgSize,
                          y2: i * CELL,
                          stroke: "rgba(255,255,255,0.05)"
                        },
                        `h${i}`
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: originX,
                          y1: 0,
                          x2: originX,
                          y2: svgSize,
                          stroke: "rgba(255,255,255,0.3)",
                          strokeWidth: 1.5
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: 0,
                          y1: originY,
                          x2: svgSize,
                          y2: originY,
                          stroke: "rgba(255,255,255,0.3)",
                          strokeWidth: 1.5
                        }
                      ),
                      Array.from({ length: GRID_SIZE }, (_, i) => {
                        const v = i - GRID_SIZE / 2;
                        const { sx, sy } = gridToSvg(v, 0);
                        return v !== 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "text",
                          {
                            x: sx,
                            y: sy + 14,
                            textAnchor: "middle",
                            fontSize: 9,
                            fill: "rgba(255,255,255,0.3)",
                            children: v
                          },
                          `x${i}`
                        ) : null;
                      }),
                      Array.from({ length: GRID_SIZE }, (_, i) => {
                        const v = GRID_SIZE / 2 - i;
                        const { sx, sy } = gridToSvg(0, v);
                        return v !== 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "text",
                          {
                            x: sx - 8,
                            y: sy + 4,
                            textAnchor: "end",
                            fontSize: 9,
                            fill: "rgba(255,255,255,0.3)",
                            children: v
                          },
                          `y${i}`
                        ) : null;
                      }),
                      task.points.map((p, i) => {
                        const { sx, sy } = gridToSvg(p.x, p.y);
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            cx: sx,
                            cy: sy,
                            r: 5,
                            fill: "#f59e0b"
                          },
                          `tp${i}`
                        );
                      }),
                      plotted.map((p, i) => {
                        const { sx, sy } = gridToSvg(p.x, p.y);
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            cx: sx,
                            cy: sy,
                            r: 5,
                            fill: "#00f5ff"
                          },
                          `pp${i}`
                        );
                      }),
                      task.points.length === 2 && (() => {
                        const a = gridToSvg(task.points[0].x, task.points[0].y);
                        const b = gridToSvg(task.points[1].x, task.points[1].y);
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: a.sx,
                            y1: a.sy,
                            x2: b.sx,
                            y2: b.sy,
                            stroke: "#f59e0b",
                            strokeWidth: 2,
                            strokeDasharray: "4,2"
                          }
                        );
                      })()
                    ]
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: config.difficulty === 1 ? "text" : "number",
                  step: "0.1",
                  value: g1Input,
                  onChange: (e) => setG1Input(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && g1Submit(),
                  className: "w-32 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2",
                  placeholder: "?",
                  "data-ocid": "graphing_systems.answer_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: g1Submit,
                  className: "px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "graphing_systems.submit_button",
                  children: "Submit"
                }
              ),
              g1Feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm font-bold",
                  style: { color: g1Feedback.ok ? "#4ade80" : "#f43f5e" },
                  children: g1Feedback.msg
                }
              )
            ] })
          ] })
        ] }),
        gameId === "line-tracer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    className: "text-3xl font-black text-[#a855f7]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Line Tracer"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Match equations to graph descriptions. Read the slope and y-intercept carefully." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  TOTAL_LT,
                  " questions | Difficulty ",
                  config.difficulty
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      startTimeRef.current = Date.now();
                      setG2Phase("playing");
                      startTimer();
                    },
                    className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                    "data-ocid": "graphing_systems.lt_start_button",
                    children: "Start Tracing"
                  }
                )
              ]
            }
          ),
          g2Phase === "playing" && g2Questions[g2Idx] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Q ",
                g2Idx + 1,
                "/",
                TOTAL_LT
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                timeLeft,
                "s"
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "px-8 py-4 rounded-2xl border-2 border-[#a855f7]/50 bg-card text-4xl font-black",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: g2Questions[g2Idx].equation
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Which description best matches this equation?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 w-full max-w-md", children: g2Questions[g2Idx].options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => g2Choose(i),
                      disabled: !!g2Feedback,
                      "data-ocid": `graphing_systems.lt_option.${i + 1}`,
                      className: `w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${g2Feedback ? i === g2Questions[g2Idx].correctIdx ? "border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]" : g2Chosen === i ? "border-[#f43f5e] bg-[#f43f5e]/10 opacity-70" : "border-border/30 opacity-50" : "border-border hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10"}`,
                      children: opt
                    },
                    i
                  )) }),
                  g2Feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold",
                      style: { color: g2Feedback.ok ? "#4ade80" : "#f43f5e" },
                      children: g2Feedback.msg
                    }
                  )
                ]
              },
              g2Idx
            ) })
          ] })
        ] }),
        gameId === "data-plotter" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    className: "text-3xl font-black text-[#a855f7]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Data Plotter"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                  "Analyse data tables across ",
                  ROUNDS,
                  " rounds (5 questions each). Identify trends, correlations, and best graph types."
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
                    className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                    "data-ocid": "graphing_systems.dp_start_button",
                    children: "Start Analysis"
                  }
                )
              ]
            }
          ),
          g3Phase === "playing" && g3Table && g3Question && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Round ",
                g3Round + 1,
                "/",
                ROUNDS,
                " | Q ",
                g3QIdx + 1,
                "/5"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                timeLeft,
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#a855f7]/30 bg-card/40 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#a855f7] mb-2 uppercase tracking-widest", children: g3Table.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left pr-4 pb-1 text-muted-foreground", children: g3Table.xLabel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-muted-foreground", children: g3Table.yLabel })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: g3Table.rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pr-4 py-0.5 font-mono text-foreground", children: row.x }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-[#a855f7] font-bold", children: row.y })
                ] }, i)) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                className: "flex flex-col gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: g3Question.q }),
                  g3Question.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => g3Choose(i),
                      disabled: !!g3Feedback,
                      "data-ocid": `graphing_systems.dp_option.${i + 1}`,
                      className: `w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${g3Feedback ? i === g3Question.correctIdx ? "border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]" : g3Chosen === i ? "border-[#f43f5e] opacity-70" : "border-border/30 opacity-50" : "border-border hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10"}`,
                      children: opt
                    },
                    i
                  )),
                  g3Feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold",
                      style: { color: g3Feedback.ok ? "#4ade80" : "#f43f5e" },
                      children: g3Feedback.msg
                    }
                  )
                ]
              },
              `${g3Round}-${g3QIdx}`
            ) })
          ] })
        ] })
      ]
    }
  );
}
export {
  GraphingSystems as default
};
