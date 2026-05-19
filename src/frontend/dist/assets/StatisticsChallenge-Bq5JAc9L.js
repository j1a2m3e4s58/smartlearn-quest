import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function round1(n) {
  return Math.round(n * 10) / 10;
}
function genDataset(diff) {
  const cats = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const count = diff === 1 ? 5 : diff === 2 ? 6 : 7;
  const max = diff === 1 ? 20 : diff === 2 ? 50 : 100;
  const values = Array.from({ length: count }, () => randInt(1, max));
  return { label: "Data Set", values, categories: cats.slice(0, count) };
}
function calcStats(vals) {
  const sorted = [...vals].sort((a, b) => a - b);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const freq = {};
  vals.forEach((v) => {
    freq[v] = (freq[v] || 0) + 1;
  });
  const maxF = Math.max(...Object.values(freq));
  const mode = Number.parseInt(
    Object.keys(freq).find((k) => freq[Number(k)] === maxF) || "0"
  );
  const range = sorted[sorted.length - 1] - sorted[0];
  const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
  const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
  return {
    mean: round1(mean),
    mode,
    range,
    median,
    stddev: round1(Math.sqrt(variance))
  };
}
function genQuestions(dataset, diff) {
  const s = calcStats(dataset.values);
  const qs = [
    {
      text: `What is the MEAN of: ${dataset.values.join(", ")}?`,
      answer: s.mean,
      hint: `Add all values and divide by ${dataset.values.length}`
    },
    {
      text: `What is the RANGE of: ${dataset.values.join(", ")}?`,
      answer: s.range,
      hint: `Max minus Min: ${Math.max(...dataset.values)} - ${Math.min(...dataset.values)}`
    },
    {
      text: `What is the MEDIAN of: ${dataset.values.join(", ")}?`,
      answer: s.median,
      hint: "Sort values and find the middle"
    }
  ];
  if (diff >= 2)
    qs.push({
      text: `What is the MODE of: ${dataset.values.join(", ")}?`,
      answer: s.mode,
      hint: "Most frequently occurring value"
    });
  if (diff === 3)
    qs.push({
      text: `Std deviation of: ${dataset.values.join(", ")} (1dp)?`,
      answer: s.stddev,
      hint: `stddev = sqrt(variance) = ${s.stddev}`
    });
  return qs;
}
function DataDetective({ config, onGameEnd }) {
  var _a;
  const [phase, setPhase] = reactExports.useState("idle");
  const [dataset, setDataset] = reactExports.useState(
    genDataset(config.difficulty)
  );
  const [questions, setQuestions] = reactExports.useState([]);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [rounds, setRounds] = reactExports.useState(0);
  const MAX_ROUNDS = 3;
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
    onGameEnd(
      buildResult(
        config,
        scoreRef.current,
        acc,
        Math.floor((Date.now() - startTimeRef.current) / 1e3),
        false
      )
    );
  });
  const endGame = reactExports.useCallback(() => {
    setPhase("over");
    const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
    onGameEnd(
      buildResult(
        config,
        scoreRef.current,
        acc,
        Math.floor((Date.now() - startTimeRef.current) / 1e3),
        true
      )
    );
  }, [config, onGameEnd]);
  function startGame() {
    startTimeRef.current = Date.now();
    const ds = genDataset(config.difficulty);
    setDataset(ds);
    const qs = genQuestions(ds, config.difficulty);
    setQuestions(qs);
    setQIdx(0);
    setPhase("playing");
    startTimer();
  }
  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const q = questions[qIdx];
    const newTotal = total + 1;
    setTotal(newTotal);
    if (Math.abs(val - q.answer) <= 0.15) {
      const newCorrect = correct + 1;
      const newScore = score + 200;
      setCorrect(newCorrect);
      setScore(newScore);
      scoreRef.current = newScore;
      correctRef.current = newCorrect;
      setFeedback({ msg: `Correct! ${q.answer}`, ok: true });
      const nextQ = qIdx + 1;
      if (nextQ >= questions.length) {
        const nextRound = rounds + 1;
        setRounds(nextRound);
        if (nextRound >= MAX_ROUNDS) {
          setTimeout(endGame, 800);
          return;
        }
        setTimeout(() => {
          const ds = genDataset(config.difficulty);
          setDataset(ds);
          setQuestions(genQuestions(ds, config.difficulty));
          setQIdx(0);
          setInput("");
          setFeedback(null);
        }, 800);
      } else {
        setTimeout(() => {
          setQIdx(nextQ);
          setInput("");
          setFeedback(null);
        }, 800);
      }
    } else {
      setFeedback({ msg: `Incorrect. Hint: ${q.hint}`, ok: false });
      setTimeout(() => {
        setInput("");
        setFeedback(null);
      }, 1500);
    }
  }
  const barMax = Math.max(...dataset.values);
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "statistics_challenge.page",
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
                  className: "text-3xl font-black text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Data Detective"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Analyze datasets and answer statistical questions. Calculate mean, mode, median, range, and more." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "statistics_challenge.start_button",
                  children: "Investigate Data"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#f59e0b] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Round ",
              rounds + 1,
              "/",
              MAX_ROUNDS,
              " | Q ",
              qIdx + 1,
              "/",
              questions.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl border border-border/30 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1 h-32", children: dataset.values.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-1 flex flex-col items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[#f59e0b]", children: v }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full rounded-t transition-all duration-500",
                    style: {
                      height: `${v / barMax * 100}%`,
                      background: "#f59e0b",
                      opacity: 0.7 + i % 3 * 0.1
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: dataset.categories[i] })
              ]
            },
            i
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: (_a = questions[qIdx]) == null ? void 0 : _a.text }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.1",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "statistics_challenge.answer_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "statistics_challenge.submit_button",
                      children: "Submit"
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
function genChartData(diff) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const SUBJECTS = ["Math", "Science", "English", "ICT", "Art"];
  const count = diff === 1 ? 4 : diff === 2 ? 5 : 6;
  const max = diff === 1 ? 50 : diff === 2 ? 100 : 200;
  const scenarios = [
    {
      label: "Monthly Sales (GHS)",
      cats: MONTHS.slice(0, count),
      chart: "bar"
    },
    {
      label: "Test Scores",
      cats: SUBJECTS.slice(0, count),
      chart: "bar"
    },
    {
      label: "Temperature (°C)",
      cats: MONTHS.slice(0, count),
      chart: "line"
    }
  ];
  const scenario = scenarios[randInt(0, scenarios.length - 1)];
  const values = Array.from({ length: count }, () => randInt(10, max));
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const maxIdx = values.indexOf(maxVal);
  const minIdx = values.indexOf(minVal);
  const total = values.reduce((a, b) => a + b, 0);
  return {
    label: scenario.label,
    categories: scenario.cats,
    values,
    chartType: scenario.chart,
    questions: [
      { text: "What is the highest value?", answer: maxVal, isNum: true },
      {
        text: "Which category had the highest value?",
        answer: scenario.cats[maxIdx],
        isNum: false
      },
      { text: "What is the lowest value?", answer: minVal, isNum: true },
      {
        text: "Which category had the lowest value?",
        answer: scenario.cats[minIdx],
        isNum: false
      },
      {
        text: "What is the total across all categories?",
        answer: total,
        isNum: true
      }
    ]
  };
}
function GraphReader({ config, onGameEnd }) {
  const TOTAL_CHARTS = 3;
  const [phase, setPhase] = reactExports.useState("idle");
  const [chart, setChart] = reactExports.useState(
    genChartData(config.difficulty)
  );
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [chartIdx, setChartIdx] = reactExports.useState(0);
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
  const totalQs = TOTAL_CHARTS * 5;
  const endGame = reactExports.useCallback(
    (s, c) => {
      const acc = c / totalQs * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd, totalQs]
  );
  const q = chart.questions[qIdx];
  const barMax = Math.max(...chart.values);
  function submit() {
    const rawInput = input.trim();
    const ok = q.isNum ? Math.abs(Number.parseFloat(rawInput) - q.answer) < 0.5 : rawInput.toLowerCase() === String(q.answer).toLowerCase();
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! ${q.answer}` : `Wrong. Answer: ${q.answer}`,
      ok
    });
    setTimeout(() => {
      const nextQ = qIdx + 1;
      if (nextQ >= 5) {
        const nextChart = chartIdx + 1;
        if (nextChart >= TOTAL_CHARTS) {
          endGame(newScore, newCorrect);
          return;
        }
        setChart(genChartData(config.difficulty));
        setChartIdx(nextChart);
        setQIdx(0);
      } else {
        setQIdx(nextQ);
      }
      setInput("");
      setFeedback(null);
    }, 1e3);
  }
  const svgW = 280;
  const svgH = 120;
  function BarChart() {
    const bw = (svgW - 20) / chart.values.length - 4;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: svgW, height: svgH, className: "w-full", children: chart.values.map((v, i) => {
      const h = v / barMax * (svgH - 30);
      const x = 10 + i * ((svgW - 20) / chart.values.length);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y: svgH - h - 20,
            width: bw,
            height: h,
            fill: "#f59e0b",
            opacity: 0.7 + i * 0.05,
            rx: 2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: x + bw / 2,
            y: svgH - h - 24,
            textAnchor: "middle",
            fontSize: 9,
            fill: "#f59e0b",
            children: v
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: x + bw / 2,
            y: svgH - 5,
            textAnchor: "middle",
            fontSize: 8,
            fill: "rgba(255,255,255,0.5)",
            children: chart.categories[i]
          }
        )
      ] }, i);
    }) });
  }
  function LineChart() {
    const pts = chart.values.map((v, i) => {
      const x = 15 + i * ((svgW - 30) / (chart.values.length - 1));
      const y = svgH - 20 - v / barMax * (svgH - 30);
      return `${x},${y}`;
    }).join(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: svgW, height: svgH, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: pts, fill: "none", stroke: "#00f5ff", strokeWidth: 2 }),
      chart.values.map((v, i) => {
        const x = 15 + i * ((svgW - 30) / (chart.values.length - 1));
        const y = svgH - 20 - v / barMax * (svgH - 30);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x, cy: y, r: 4, fill: "#00f5ff" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x,
              y: y - 8,
              textAnchor: "middle",
              fontSize: 9,
              fill: "#00f5ff",
              children: v
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x,
              y: svgH - 4,
              textAnchor: "middle",
              fontSize: 8,
              fill: "rgba(255,255,255,0.5)",
              children: chart.categories[i]
            }
          )
        ] }, i);
      })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "graph_reader.page",
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
                  className: "text-3xl font-black text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Graph Reader"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                "Read bar charts and line graphs. Answer questions about values, categories, and totals. ",
                TOTAL_CHARTS,
                " charts, 5 questions each."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "graph_reader.start_button",
                  children: "Read Graphs"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Chart ",
              chartIdx + 1,
              "/",
              TOTAL_CHARTS,
              " | Q ",
              qIdx + 1,
              "/5"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-border/30 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 font-semibold", children: chart.label }),
            chart.chartType === "bar" ? /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(LineChart, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: q.text }),
                q.isNum ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "graph_reader.num_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "graph_reader.submit_button",
                      children: "Submit"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: chart.categories.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setInput(cat);
                      submit();
                    },
                    className: "px-4 py-2 rounded-lg border-2 border-border font-bold text-sm hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 transition-all",
                    "data-ocid": `graph_reader.cat.${i + 1}`,
                    children: cat
                  },
                  i
                )) }),
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
            `${chartIdx}-${qIdx}`
          ) })
        ] })
      ]
    }
  );
}
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
function simplify(n, d) {
  const g = gcd(n, d);
  return [n / g, d / g];
}
const COLORS = ["Red", "Blue", "Green", "Yellow", "Purple"];
function genProbProblem(diff) {
  if (diff === 1 || Math.random() > 0.5) {
    const numColors = diff === 1 ? 2 : diff === 2 ? 3 : 4;
    const items = COLORS.slice(0, numColors).map((c) => ({
      color: c,
      count: randInt(1, 5)
    }));
    const total2 = items.reduce((s, i) => s + i.count, 0);
    const picked2 = items[randInt(0, items.length - 1)];
    const [sn2, sd2] = simplify(picked2.count, total2);
    return {
      scenario: "bag",
      description: `Bag contains: ${items.map((i) => `${i.count} ${i.color}`).join(", ")}`,
      question: `P(picking ${picked2.color})?`,
      answerNum: sn2,
      answerDen: sd2,
      bagItems: items
    };
  }
  const numSections = diff === 2 ? 4 : 6;
  const sections = Array.from({ length: numSections }, (_, i) => ({
    label: `Section ${i + 1}`,
    count: randInt(1, 3)
  }));
  const total = sections.reduce((s, i) => s + i.count, 0);
  const picked = sections[randInt(0, sections.length - 1)];
  const [sn, sd] = simplify(picked.count, total);
  return {
    scenario: "spinner",
    description: `Spinner with ${numSections} sections of varying sizes`,
    question: `P(landing on ${picked.label})?`,
    answerNum: sn,
    answerDen: sd,
    spinnerSections: sections
  };
}
function ProbabilityLab({ config, onGameEnd }) {
  const TOTAL = 12;
  const [phase, setPhase] = reactExports.useState("idle");
  const [problem, setProblem] = reactExports.useState(
    genProbProblem(config.difficulty)
  );
  const [numInput, setNumInput] = reactExports.useState("");
  const [denInput, setDenInput] = reactExports.useState("");
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
    const n = Number.parseInt(numInput.trim());
    const d = Number.parseInt(denInput.trim());
    if (Number.isNaN(n) || Number.isNaN(d) || d === 0) return;
    const [sn, sd] = simplify(n, d);
    const ok = sn === problem.answerNum && sd === problem.answerDen;
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! P = ${problem.answerNum}/${problem.answerDen}` : `Wrong. P = ${problem.answerNum}/${problem.answerDen}`,
      ok
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setProblem(genProbProblem(config.difficulty));
      setNumInput("");
      setDenInput("");
      setFeedback(null);
      setQIdx(next);
    }, 1e3);
  }
  function BagViz() {
    if (!problem.bagItems) return null;
    const colorMap = {
      Red: "#f43f5e",
      Blue: "#3b82f6",
      Green: "#4ade80",
      Yellow: "#f59e0b",
      Purple: "#a855f7"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-border/30 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Bag contents:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: problem.bagItems.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        Array.from({ length: item.count }, (_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-6 h-6 rounded-full border-2 border-border",
            style: { background: colorMap[item.color] || "#888" }
          },
          j
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", children: item.color })
      ] }, i)) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "probability_lab.page",
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
                  className: "text-3xl font-black text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Probability Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Calculate the probability of events as fractions. Scenarios include bags of colored balls and spinners. 12 problems." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "probability_lab.start_button",
                  children: "Enter Lab"
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: problem.description }),
                problem.scenario === "bag" && /* @__PURE__ */ jsxRuntimeExports.jsx(BagViz, {}),
                problem.scenario === "spinner" && problem.spinnerSections && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-border/30 bg-card", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Spinner sections:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: problem.spinnerSections.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "px-2 py-1 rounded border border-[#f59e0b]/40 text-xs font-mono",
                      children: [
                        s.label,
                        ": ",
                        s.count,
                        " wedge",
                        s.count > 1 ? "s" : ""
                      ]
                    },
                    i
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: problem.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter as a fraction (numerator / denominator):" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      value: numInput,
                      onChange: (e) => setNumInput(e.target.value),
                      className: "w-20 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "probability_lab.num_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold", children: "/" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      value: denInput,
                      onChange: (e) => setDenInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-20 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "probability_lab.den_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "probability_lab.submit_button",
                      children: "Submit"
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
function StatisticsChallenge({ config, onGameEnd }) {
  if (config.gameId === "graph-reader")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GraphReader, { config, onGameEnd });
  if (config.gameId === "probability-lab")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProbabilityLab, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataDetective, { config, onGameEnd });
}
export {
  StatisticsChallenge as default
};
