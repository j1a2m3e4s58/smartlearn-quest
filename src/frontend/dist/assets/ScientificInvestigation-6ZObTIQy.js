import { r as reactExports, j as jsxRuntimeExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { F as FlaskConical } from "./flask-conical-DloLj-N9.js";
const EXPERIMENTS = [
  {
    title: "Effect of Fertiliser on Plant Growth",
    background: "A farmer wants to know if adding fertiliser increases the height of maize plants. He grows identical maize seeds in the same soil type and gives them the same amount of water and light. Only the amount of fertiliser added changes.",
    hypotheses: [
      "Adding more fertiliser will increase plant height.",
      "Water amount determines plant height.",
      "Sunlight has no effect on plants."
    ],
    correctHypothesis: 0,
    variables: [
      { name: "Amount of fertiliser (g)", role: "Independent" },
      { name: "Height of plant (cm)", role: "Dependent" },
      { name: "Type of soil", role: "Controlled" },
      { name: "Volume of water (ml)", role: "Controlled" },
      { name: "Hours of light per day", role: "Controlled" }
    ],
    trialData: [
      { trial: 1, result: 12, unit: "cm" },
      { trial: 2, result: 18, unit: "cm" },
      { trial: 3, result: 25, unit: "cm" },
      { trial: 4, result: 31, unit: "cm" }
    ],
    trend: "Plant height increases as fertiliser amount increases (positive trend).",
    conclusions: [
      "More fertiliser leads to greater plant height — the hypothesis is supported.",
      "Plant height is unrelated to fertiliser use.",
      "Less fertiliser produces taller plants."
    ],
    correctConclusion: 0
  },
  {
    title: "Effect of Temperature on Dissolving Rate",
    background: "A student investigates whether water temperature affects how fast a sugar cube dissolves. The same brand of sugar cube is placed in beakers of water at different temperatures. Stirring speed and cube size are kept the same.",
    hypotheses: [
      "A hotter room dissolves sugar faster.",
      "Higher water temperature will increase the dissolving rate of sugar.",
      "Sugar does not dissolve in water."
    ],
    correctHypothesis: 1,
    variables: [
      { name: "Water temperature (°C)", role: "Independent" },
      { name: "Time to dissolve (s)", role: "Dependent" },
      { name: "Size of sugar cube", role: "Controlled" },
      { name: "Volume of water (ml)", role: "Controlled" },
      { name: "Stirring speed", role: "Controlled" }
    ],
    trialData: [
      { trial: 1, result: 180, unit: "s (20°C)" },
      { trial: 2, result: 120, unit: "s (40°C)" },
      { trial: 3, result: 65, unit: "s (60°C)" },
      { trial: 4, result: 30, unit: "s (80°C)" }
    ],
    trend: "Dissolving time decreases as water temperature increases (negative trend).",
    conclusions: [
      "Temperature has no effect on dissolving rate.",
      "Higher temperature increases dissolving time.",
      "Higher water temperature decreases the time needed to dissolve sugar — hypothesis supported."
    ],
    correctConclusion: 2
  },
  {
    title: "Effect of Drop Height on Crater Size",
    background: "Scientists study meteorite impacts by dropping balls of clay from different heights onto a sand tray. The ball mass stays the same. Only the drop height changes.",
    hypotheses: [
      "Crater size is not affected by height.",
      "Heavier balls make bigger craters.",
      "A greater drop height will produce a larger crater diameter."
    ],
    correctHypothesis: 2,
    variables: [
      { name: "Drop height (cm)", role: "Independent" },
      { name: "Crater diameter (cm)", role: "Dependent" },
      { name: "Mass of clay ball (g)", role: "Controlled" },
      { name: "Type of sand", role: "Controlled" },
      { name: "Surface area of sand tray", role: "Controlled" }
    ],
    trialData: [
      { trial: 1, result: 3.2, unit: "cm (20 cm drop)" },
      { trial: 2, result: 5.8, unit: "cm (40 cm drop)" },
      { trial: 3, result: 8.1, unit: "cm (60 cm drop)" },
      { trial: 4, result: 10.4, unit: "cm (80 cm drop)" }
    ],
    trend: "Crater diameter increases as drop height increases (positive trend).",
    conclusions: [
      "Drop height and crater size are not related.",
      "Greater drop height produces a larger crater — the hypothesis is supported.",
      "Mass of ball determines crater size, not height."
    ],
    correctConclusion: 1
  }
];
const DATASETS = [
  {
    title: "Water Volume vs Plant Height (4 weeks)",
    hypothesis: "More water leads to taller plants.",
    conditions: ["0 mL/day", "50 mL/day", "100 mL/day", "200 mL/day"],
    measurements: [
      [2, 2, 3, 3],
      [8, 9, 8, 10],
      [15, 16, 14, 17],
      [22, 23, 21, 24]
    ],
    unit: "cm",
    pattern: "linear",
    patternOptions: [
      "Linear increase",
      "Curved (diminishing returns)",
      "No clear relationship"
    ],
    supported: true,
    conclusion: "Hypothesis supported: more water correlates with greater height.",
    conclusionOptions: [
      "Hypothesis supported: more water correlates with greater height.",
      "Hypothesis refuted: water has no effect.",
      "Insufficient data to conclude."
    ]
  },
  {
    title: "Temperature vs Enzyme Activity",
    hypothesis: "Enzyme activity increases with temperature.",
    conditions: ["20°C", "30°C", "40°C", "50°C"],
    measurements: [
      [12, 14, 13, 11],
      [28, 30, 27, 29],
      [45, 46, 44, 47],
      [21, 19, 22, 20]
    ],
    unit: "units/min",
    pattern: "curved",
    patternOptions: [
      "Linear increase",
      "Peaks then drops (curved)",
      "No clear relationship"
    ],
    supported: false,
    conclusion: "Hypothesis partially supported: activity peaks at 40°C then declines.",
    conclusionOptions: [
      "Hypothesis supported: activity always increases.",
      "Hypothesis partially supported: activity peaks at 40°C then declines.",
      "Data is random."
    ]
  },
  {
    title: "Sunlight Hours vs Crop Yield",
    hypothesis: "More sunlight produces higher crop yield.",
    conditions: ["2 hrs", "4 hrs", "6 hrs", "8 hrs"],
    measurements: [
      [5, 4, 6, 5],
      [14, 15, 13, 16],
      [24, 25, 23, 26],
      [35, 34, 36, 33]
    ],
    unit: "kg",
    pattern: "linear",
    patternOptions: [
      "Linear increase",
      "Curved (diminishing returns)",
      "No clear relationship"
    ],
    supported: true,
    conclusion: "Hypothesis supported: yield increases steadily with sunlight hours.",
    conclusionOptions: [
      "Hypothesis supported: yield increases steadily with sunlight hours.",
      "Hypothesis refuted: yield is unrelated to sunlight.",
      "Sunlight only affects small plants."
    ]
  },
  {
    title: "Fertiliser Concentration vs Root Length",
    hypothesis: "Higher fertiliser concentration increases root length.",
    conditions: ["0%", "1%", "2%", "4%"],
    measurements: [
      [10, 11, 9, 10],
      [18, 19, 17, 20],
      [18, 17, 19, 18],
      [10, 9, 11, 10]
    ],
    unit: "mm",
    pattern: "curved",
    patternOptions: [
      "Linear increase",
      "Peaks at 1-2% then declines (curved)",
      "No clear relationship"
    ],
    supported: false,
    conclusion: "Hypothesis partially refuted: optimal concentration is 1-2%; higher concentrations harm roots.",
    conclusionOptions: [
      "Hypothesis supported: all concentrations help.",
      "Hypothesis partially refuted: optimal concentration is 1-2%; higher concentrations harm roots.",
      "Root length is independent of fertiliser."
    ]
  },
  {
    title: "Exercise Duration vs Resting Heart Rate",
    hypothesis: "Longer exercise training reduces resting heart rate.",
    conditions: ["0 wks", "4 wks", "8 wks", "12 wks"],
    measurements: [
      [78, 80, 79, 81],
      [74, 75, 73, 76],
      [68, 70, 67, 71],
      [63, 64, 62, 65]
    ],
    unit: "bpm",
    pattern: "linear",
    patternOptions: [
      "Linear decrease",
      "Peaked then levelled",
      "No clear relationship"
    ],
    supported: true,
    conclusion: "Hypothesis supported: resting heart rate decreases linearly with training duration.",
    conclusionOptions: [
      "Hypothesis supported: resting heart rate decreases linearly with training duration.",
      "Exercise has no effect on heart rate.",
      "Heart rate only changes in the first 4 weeks."
    ]
  },
  {
    title: "Caffeine Dose vs Reaction Time",
    hypothesis: "Higher caffeine doses reduce reaction time.",
    conditions: ["0 mg", "50 mg", "100 mg", "200 mg"],
    measurements: [
      [420, 430, 410, 425],
      [380, 375, 385, 370],
      [350, 345, 355, 348],
      [355, 360, 352, 358]
    ],
    unit: "ms",
    pattern: "curved",
    patternOptions: [
      "Linear decrease",
      "Decreases then levels off (curved)",
      "No clear relationship"
    ],
    supported: false,
    conclusion: "Hypothesis partially supported: reaction time improves up to 100 mg but not beyond.",
    conclusionOptions: [
      "Hypothesis fully supported: all doses reduce reaction time equally.",
      "Hypothesis partially supported: reaction time improves up to 100 mg but not beyond.",
      "Caffeine has no statistical effect."
    ]
  }
];
const METHOD_STEPS = [
  "Observe phenomenon",
  "Research background",
  "Form hypothesis",
  "Design experiment",
  "Collect data",
  "Analyse results",
  "Draw conclusions",
  "Communicate findings"
];
const METHOD_SCENARIOS = [
  {
    title: "Plant near window grows faster",
    actions: [
      {
        description: "Student reads textbooks about photosynthesis and light requirements.",
        step: "Research background"
      },
      {
        description: "Student counts seeds germinated under sunlight vs. shade over 2 weeks.",
        step: "Collect data"
      },
      {
        description: "Student writes: plants receiving direct sunlight will germinate 30% faster.",
        step: "Form hypothesis"
      },
      {
        description: "Student notes: plant on windowsill grew 3 cm while others grew 1 cm.",
        step: "Observe phenomenon"
      },
      {
        description: "Student creates a table showing germination rates under 4 light conditions.",
        step: "Analyse results"
      },
      {
        description: "Student sets up 20 identical pots, half near window, half in dark corner.",
        step: "Design experiment"
      },
      {
        description: "Student presents findings at the school science fair with a poster.",
        step: "Communicate findings"
      },
      {
        description: "Student states: direct sunlight significantly accelerates germination in seedlings.",
        step: "Draw conclusions"
      }
    ]
  },
  {
    title: "Bridge design for maximum load",
    actions: [
      {
        description: "Engineer reads published load-testing studies for wooden bridges.",
        step: "Research background"
      },
      {
        description: "Engineer records that the old bridge cracked under a 2-tonne truck.",
        step: "Observe phenomenon"
      },
      {
        description: "Engineer states: a triangular truss design will support 3x more load.",
        step: "Form hypothesis"
      },
      {
        description: "Engineer builds 5 miniature bridge models with different truss patterns.",
        step: "Design experiment"
      },
      {
        description: "Engineer records breaking load for each model in newtons.",
        step: "Collect data"
      },
      {
        description: "Engineer calculates average load and standard deviation per design.",
        step: "Analyse results"
      },
      {
        description: "Engineer concludes the triangular truss is strongest by 40%.",
        step: "Draw conclusions"
      },
      {
        description: "Engineer publishes results in an engineering journal.",
        step: "Communicate findings"
      }
    ]
  }
];
const VAR_ROLES = ["Independent", "Dependent", "Controlled"];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function ScientificInvestigation({ config, onGameEnd }) {
  const gameId = config.gameId;
  const [phase, setPhase] = reactExports.useState("start");
  const [expIdx, setExpIdx] = reactExports.useState(0);
  const [stage, setStage] = reactExports.useState("hypothesis");
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [assignedRoles, setAssignedRoles] = reactExports.useState(
    {}
  );
  const [varFlash, setVarFlash] = reactExports.useState({});
  const [trialsCollected, setTrialsCollected] = reactExports.useState(0);
  const [selectedRole, setSelectedRole] = reactExports.useState(null);
  const [daPhase, setDaPhase] = reactExports.useState("start");
  const [daIdx, setDaIdx] = reactExports.useState(0);
  const [daStep, setDaStep] = reactExports.useState("pattern");
  const [daScore, setDaScore] = reactExports.useState(0);
  const [daFeedback, setDaFeedback] = reactExports.useState(null);
  const [means, setMeans] = reactExports.useState([]);
  const [smPhase, setSmPhase] = reactExports.useState(
    "start"
  );
  const [smOrder, setSmOrder] = reactExports.useState([]);
  const [shuffledSteps] = reactExports.useState(() => shuffle([...METHOD_STEPS]));
  const [smScenarioIdx] = reactExports.useState(0);
  const [smActionAnswers, setSmActionAnswers] = reactExports.useState({});
  const [smFeedback, setSmFeedback] = reactExports.useState(null);
  const [smScore, setSmScore] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const exp = EXPERIMENTS[expIdx];
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const progressPct = timeLeft / config.timeLimit * 100;
  const timerBarStyle = { width: `${progressPct}%` };
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("experiment");
    startTimer();
  }
  function handleHypothesis(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === exp.correctHypothesis) {
      const pts = 100 * config.difficulty;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct hypothesis! +${pts} pts. Now identify the variables.`
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setStage("variables");
        setAssignedRoles({});
        setVarFlash({});
      }, 1200);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Not the best hypothesis. Correct: "${exp.hypotheses[exp.correctHypothesis]}". Moving on.`
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setStage("variables");
        setAssignedRoles({});
        setVarFlash({});
      }, 1600);
    }
  }
  function handleVarAssign(varName) {
    var _a;
    if (!selectedRole) return;
    const correct_role = (_a = exp.variables.find((v) => v.name === varName)) == null ? void 0 : _a.role;
    const isCorrect = selectedRole === correct_role;
    const pts = isCorrect ? 40 * config.difficulty : 0;
    if (isCorrect) {
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    }
    setTotal((t) => t + 1);
    setAssignedRoles((prev) => ({ ...prev, [varName]: selectedRole }));
    setVarFlash((prev) => ({
      ...prev,
      [varName]: isCorrect ? "correct" : "wrong"
    }));
    const allDone = exp.variables.every((v) => {
      if (v.name === varName) return true;
      return assignedRoles[v.name] !== void 0 && assignedRoles[v.name] !== null;
    });
    if (allDone)
      setTimeout(() => {
        setStage("data");
        setTrialsCollected(0);
      }, 900);
  }
  function handleRunTrial() {
    if (trialsCollected >= exp.trialData.length) return;
    const next = trialsCollected + 1;
    setTrialsCollected(next);
    if (next >= exp.trialData.length)
      setTimeout(() => setStage("conclusion"), 600);
  }
  function handleConclusion(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === exp.correctConclusion) {
      const pts = 150 * config.difficulty;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct conclusion! +${pts} pts`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Incorrect. Correct: "${exp.conclusions[exp.correctConclusion]}".`
      );
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const nextExp = expIdx + 1;
      if (nextExp >= EXPERIMENTS.length) endGame(true);
      else {
        setExpIdx(nextExp);
        setStage("hypothesis");
        setAssignedRoles({});
        setVarFlash({});
        setTrialsCollected(0);
        setSelectedRole(null);
      }
    }, 1600);
  }
  const ds = DATASETS[daIdx % DATASETS.length];
  function computeMeans(data) {
    return data.map(
      (row) => Math.round(row.reduce((a, b) => a + b, 0) / row.length * 10) / 10
    );
  }
  function daStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    startTimer();
    setMeans(computeMeans(ds.measurements));
    setDaPhase("play");
  }
  function handlePatternAnswer(opt) {
    if (daFeedback) return;
    const correct2 = opt === ds.patternOptions[ds.pattern === "linear" ? 0 : ds.pattern === "curved" ? 1 : 2];
    const pts = correct2 ? 100 * config.difficulty : 0;
    setDaScore((s) => s + pts);
    setScore((s) => s + pts);
    setDaFeedback({
      ok: correct2,
      msg: correct2 ? `Correct pattern! +${pts} pts` : `Incorrect. The pattern is: ${ds.patternOptions[ds.pattern === "linear" ? 0 : 1]}`
    });
    setTimeout(() => {
      setDaFeedback(null);
      setDaStep("means");
    }, 1800);
  }
  function handleMeansConfirm() {
    setDaStep("hypothesis");
  }
  function handleHypothesisAnswer(supported) {
    if (daFeedback) return;
    const correct2 = supported === ds.supported;
    const pts = correct2 ? 120 * config.difficulty : 0;
    setDaScore((s) => s + pts);
    setScore((s) => s + pts);
    setDaFeedback({
      ok: correct2,
      msg: correct2 ? `Correct! +${pts} pts` : `Incorrect. The hypothesis was ${ds.supported ? "supported" : "refuted"}.`
    });
    setTimeout(() => {
      setDaFeedback(null);
      setDaStep("conclusion");
    }, 1800);
  }
  function handleConclusionAnswer(opt) {
    if (daFeedback) return;
    const correct2 = opt === ds.conclusion;
    const pts = correct2 ? 150 * config.difficulty : 0;
    setDaScore((s) => s + pts);
    setScore((s) => s + pts);
    setDaFeedback({
      ok: correct2,
      msg: correct2 ? `Correct! +${pts} pts` : `Correct answer: ${ds.conclusion}`
    });
    setTimeout(() => {
      setDaFeedback(null);
      const nextIdx = daIdx + 1;
      if (nextIdx >= DATASETS.length) {
        setDaPhase("done");
        endGame(true);
      } else {
        setDaIdx(nextIdx);
        setDaStep("pattern");
        setMeans(computeMeans(DATASETS[nextIdx].measurements));
      }
    }, 2e3);
  }
  const smScenario = METHOD_SCENARIOS[smScenarioIdx];
  function smStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    startTimer();
    setSmPhase("order");
  }
  function toggleStepOrder(step) {
    if (smOrder.includes(step)) setSmOrder((p) => p.filter((s) => s !== step));
    else if (smOrder.length < METHOD_STEPS.length)
      setSmOrder((p) => [...p, step]);
  }
  function submitOrder() {
    if (smOrder.length !== METHOD_STEPS.length) return;
    const correct2 = smOrder.every((s, i) => s === METHOD_STEPS[i]);
    const pts = correct2 ? 500 * config.difficulty : smOrder.filter((s, i) => s === METHOD_STEPS[i]).length * 50 * config.difficulty;
    setSmScore((s) => s + pts);
    setScore((s) => s + pts);
    setSmFeedback({
      ok: correct2,
      msg: correct2 ? `Perfect order! +${pts} pts` : `${smOrder.filter((s, i) => s === METHOD_STEPS[i]).length}/8 steps correct. +${pts} pts`
    });
    setTimeout(() => {
      setSmFeedback(null);
      setSmPhase("apply");
    }, 2e3);
  }
  function handleActionAnswer(actionIdx, step) {
    if (smActionAnswers[actionIdx] !== void 0) return;
    const correct2 = step === smScenario.actions[actionIdx].step;
    const pts = correct2 ? 80 * config.difficulty : 0;
    setSmScore((s) => s + pts);
    setScore((s) => s + pts);
    setSmActionAnswers((prev) => ({ ...prev, [actionIdx]: step }));
    if (Object.keys(smActionAnswers).length + 1 >= smScenario.actions.length) {
      setTimeout(() => {
        setSmPhase("done");
        endGame(true);
      }, 1500);
    }
  }
  const stageTitles = {
    hypothesis: "Stage 1 — Form a Hypothesis",
    variables: "Stage 2 — Identify Variables",
    data: "Stage 3 — Collect Data",
    conclusion: "Stage 4 — Draw a Conclusion"
  };
  const flashBorder = flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "border-border/30";
  if (gameId === "data-analyst") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col gap-2 select-none",
        "data-ocid": "data_analyst.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#06b6d4" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: daScore.toLocaleString() })
            ] }),
            daPhase === "play" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Dataset ",
              daIdx + 1,
              "/",
              DATASETS.length,
              " — ",
              daStep
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full xp-fill transition-all duration-1000",
                  style: timerBarStyle
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                timeLeft,
                "s"
              ] })
            ] })
          ] }),
          daPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FlaskConical,
                  {
                    className: "h-14 w-14 mx-auto mb-4",
                    style: { color: "#06b6d4" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black mb-3",
                    style: {
                      fontFamily: "'Orbitron',sans-serif",
                      color: "#06b6d4",
                      textShadow: "0 0 20px rgba(6,182,212,0.6)"
                    },
                    children: "Data Analyst"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Analyse 6 real experiment datasets: identify patterns, calculate means, evaluate hypotheses, and draw conclusions." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: daStart,
                    "data-ocid": "data_analyst.start_button",
                    children: "Begin Analysis"
                  }
                )
              ] })
            }
          ),
          daPhase === "play" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: ds.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
                "Hypothesis:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: ds.hypothesis })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-1.5 text-muted-foreground font-semibold", children: "Condition" }),
                  ds.measurements[0].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "th",
                    {
                      className: "px-2 py-1.5 text-muted-foreground font-semibold",
                      children: [
                        "Trial ",
                        i + 1
                      ]
                    },
                    i
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "th",
                    {
                      className: "px-2 py-1.5 font-bold",
                      style: { color: "#06b6d4" },
                      children: [
                        "Mean (",
                        ds.unit,
                        ")"
                      ]
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ds.conditions.map((cond, ci) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 font-semibold text-foreground", children: cond }),
                  ds.measurements[ci].map((val, vi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "px-2 py-1.5 text-center text-muted-foreground",
                      children: val
                    },
                    vi
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "px-2 py-1.5 text-center font-bold",
                      style: { color: "#06b6d4" },
                      children: means[ci] ?? "?"
                    }
                  )
                ] }, ci)) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -16 },
                className: "flex flex-col gap-3",
                children: [
                  daStep === "pattern" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "What pattern do you observe in the data?" }),
                    ds.patternOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#06b6d4] text-foreground disabled:opacity-50",
                        onClick: () => handlePatternAnswer(opt),
                        disabled: !!daFeedback,
                        "data-ocid": `data_analyst.pattern.${i + 1}`,
                        children: opt
                      },
                      i
                    ))
                  ] }),
                  daStep === "means" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Review the calculated means above, then proceed." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The mean for each condition is shown in the table. Compare the values across conditions to understand the trend." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      GlowButton,
                      {
                        variant: "primary",
                        size: "md",
                        onClick: handleMeansConfirm,
                        "data-ocid": "data_analyst.means_confirm_button",
                        children: "Means Reviewed — Continue"
                      }
                    )
                  ] }),
                  daStep === "hypothesis" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Based on the data, is the hypothesis supported?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
                      "Hypothesis: ",
                      ds.hypothesis
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "flex-1 px-4 py-3 rounded-xl border border-[#10b981]/40 text-sm font-bold text-[#10b981] hover:bg-[#10b981]/10 transition-all disabled:opacity-50",
                          onClick: () => handleHypothesisAnswer(true),
                          disabled: !!daFeedback,
                          "data-ocid": "data_analyst.hypothesis_supported",
                          children: "Supported"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "flex-1 px-4 py-3 rounded-xl border border-[#f43f5e]/40 text-sm font-bold text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-all disabled:opacity-50",
                          onClick: () => handleHypothesisAnswer(false),
                          disabled: !!daFeedback,
                          "data-ocid": "data_analyst.hypothesis_refuted",
                          children: "Refuted"
                        }
                      )
                    ] })
                  ] }),
                  daStep === "conclusion" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Select the best conclusion:" }),
                    ds.conclusionOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#06b6d4] text-foreground disabled:opacity-50",
                        onClick: () => handleConclusionAnswer(opt),
                        disabled: !!daFeedback,
                        "data-ocid": `data_analyst.conclusion.${i + 1}`,
                        children: opt
                      },
                      i
                    ))
                  ] }),
                  daFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "rounded-lg px-3 py-2 text-xs font-medium",
                      style: {
                        color: daFeedback.ok ? "#10b981" : "#f43f5e",
                        background: daFeedback.ok ? "#10b98115" : "#f43f5e15",
                        border: `1px solid ${daFeedback.ok ? "#10b981" : "#f43f5e"}`
                      },
                      children: daFeedback.msg
                    }
                  )
                ]
              },
              daStep
            ) })
          ] })
        ]
      }
    );
  }
  if (gameId === "scientific-method") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col gap-2 select-none",
        "data-ocid": "scientific_method.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#a855f7" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: smScore.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full xp-fill transition-all duration-1000",
                  style: timerBarStyle
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                timeLeft,
                "s"
              ] })
            ] })
          ] }),
          smPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FlaskConical,
                  {
                    className: "h-14 w-14 mx-auto mb-4",
                    style: { color: "#a855f7" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black mb-3",
                    style: {
                      fontFamily: "'Orbitron',sans-serif",
                      color: "#a855f7",
                      textShadow: "0 0 20px rgba(168,85,247,0.6)"
                    },
                    children: "Scientific Method"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Part 1: Arrange the 8 steps of the scientific method in the correct order. Part 2: Match actions to their scientific method steps." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: smStart,
                    "data-ocid": "scientific_method.start_button",
                    children: "Begin Challenge"
                  }
                )
              ] })
            }
          ),
          smPhase === "order" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: "Part 1: Order the Steps"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Click the steps in the correct order (1 → 8). Current order shown below." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-border/30 min-h-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2", children: [
                "Your order (",
                smOrder.length,
                "/8):"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: smOrder.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-xs px-2 py-1 rounded-full font-bold",
                  style: {
                    background: "#a855f720",
                    color: "#a855f7",
                    border: "1px solid #a855f7"
                  },
                  children: [
                    i + 1,
                    ". ",
                    s
                  ]
                },
                i
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: shuffledSteps.map((step, i) => {
              const selected = smOrder.includes(step);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "text-left px-4 py-2 rounded-xl border text-sm font-semibold transition-all",
                  style: selected ? {
                    borderColor: "#a855f7",
                    background: "#a855f720",
                    color: "#a855f7"
                  } : {},
                  onClick: () => toggleStepOrder(step),
                  "data-ocid": `scientific_method.step.${i + 1}`,
                  children: step
                },
                i
              );
            }) }),
            smFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "rounded-lg px-3 py-2 text-xs font-medium",
                style: {
                  color: smFeedback.ok ? "#10b981" : "#f59e0b",
                  background: smFeedback.ok ? "#10b98115" : "#f59e0b15",
                  border: `1px solid ${smFeedback.ok ? "#10b981" : "#f59e0b"}`
                },
                children: smFeedback.msg
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "primary",
                size: "md",
                onClick: submitOrder,
                disabled: smOrder.length !== METHOD_STEPS.length,
                "data-ocid": "scientific_method.submit_order_button",
                children: "Submit Order"
              }
            )
          ] }),
          smPhase === "apply" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: "Part 2: Apply the Method"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground", children: [
                "Scenario: ",
                smScenario.title
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "For each action described below, click which scientific method step it represents." })
            ] }),
            smScenario.actions.map((action, ai) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "glass-card rounded-xl p-3 border border-border/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mb-2", children: action.description }),
                  smActionAnswers[ai] !== void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-bold",
                      style: {
                        color: smActionAnswers[ai] === action.step ? "#10b981" : "#f43f5e"
                      },
                      children: smActionAnswers[ai] === action.step ? `Correct: ${action.step}` : `Wrong. Correct: ${action.step}`
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: METHOD_STEPS.map((step, si) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "text-xs px-2 py-1 rounded-full border border-border/40 hover:border-[#a855f7]/60 transition-all text-muted-foreground hover:text-foreground",
                      onClick: () => handleActionAnswer(ai, step),
                      "data-ocid": `scientific_method.action.${ai + 1}.step.${si + 1}`,
                      children: step
                    },
                    si
                  )) })
                ]
              },
              ai
            ))
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "sci_investigation.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#a855f7" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          phase === "experiment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Exp ",
            expIdx + 1,
            "/",
            EXPERIMENTS.length,
            " — ",
            stageTitles[stage]
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: timerBarStyle
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex flex-col items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FlaskConical,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#a855f7" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#a855f7",
                    textShadow: "0 0 20px rgba(168,85,247,0.6)"
                  },
                  children: "Science Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Complete 3 full scientific investigations: form hypotheses, classify variables, run trials, and draw conclusions." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Each stage earns points. Accuracy determines your final grade." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "sci_investigation.start_button",
                  children: "Start Investigation"
                }
              )
            ] })
          }
        ),
        phase === "experiment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                style: { fontFamily: "'Orbitron',sans-serif" },
                children: exp.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: exp.background })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 ${flashBorder} transition-all`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground mb-4",
                    style: { fontFamily: "'Orbitron',sans-serif" },
                    children: stageTitles[stage]
                  }
                ),
                stage === "hypothesis" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: exp.hypotheses.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#a855f7] hover:bg-[#a855f7]/5 text-muted-foreground hover:text-foreground",
                    onClick: () => handleHypothesis(i),
                    "data-ocid": `sci_investigation.hypothesis.${i}`,
                    children: h
                  },
                  h
                )) }),
                stage === "variables" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-4 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground w-full mb-1", children: "Select a role, then click a variable to assign it:" }),
                    VAR_ROLES.map((role) => {
                      const roleColor = role === "Independent" ? "#06b6d4" : role === "Dependent" ? "#f59e0b" : "#a855f7";
                      const isActive = selectedRole === role;
                      const roleStyle = isActive ? {
                        borderColor: roleColor,
                        background: `${roleColor}20`,
                        color: roleColor
                      } : {};
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "px-3 py-1.5 rounded-lg border border-border/40 text-xs font-bold transition-all",
                          style: roleStyle,
                          onClick: () => setSelectedRole(isActive ? null : role),
                          "data-ocid": `sci_investigation.role.${role}`,
                          children: role
                        },
                        role
                      );
                    })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: exp.variables.map((v, i) => {
                    const assigned = assignedRoles[v.name];
                    const vf = varFlash[v.name];
                    const varBorder = vf === "correct" ? "border-[#10b981] bg-[#10b981]/10" : vf === "wrong" ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-border/40 hover:border-[#a855f7]/60";
                    const assignedColor = assigned === "Independent" ? "#06b6d4" : assigned === "Dependent" ? "#f59e0b" : assigned === "Controlled" ? "#a855f7" : void 0;
                    const assignedStyle = assignedColor ? { color: assignedColor } : {};
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: `flex items-center justify-between px-4 py-2 rounded-lg border text-sm transition-all ${varBorder}`,
                        onClick: () => !assigned && handleVarAssign(v.name),
                        "data-ocid": `sci_investigation.variable.${i}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: v.name }),
                          assigned ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-bold",
                              style: assignedStyle,
                              children: assigned
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Click to assign" })
                        ]
                      },
                      v.name
                    );
                  }) })
                ] }),
                stage === "data" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Click Run Trial to collect each data point. Observe the results carefully." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border border-border/30 rounded-lg overflow-hidden mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs text-muted-foreground font-semibold", children: "Trial" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs text-muted-foreground font-semibold", children: "Result" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: exp.trialData.slice(0, trialsCollected).map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.tr,
                      {
                        initial: { opacity: 0, x: 10 },
                        animate: { opacity: 1, x: 0 },
                        className: "border-t border-border/20",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 font-mono text-muted-foreground", children: [
                            "Trial ",
                            row.trial
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 font-bold text-foreground", children: [
                            row.result,
                            " ",
                            row.unit
                          ] })
                        ]
                      },
                      row.trial
                    )) })
                  ] }) }),
                  trialsCollected < exp.trialData.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    GlowButton,
                    {
                      variant: "secondary",
                      size: "sm",
                      onClick: handleRunTrial,
                      "data-ocid": "sci_investigation.run_trial_button",
                      children: [
                        "Run Trial ",
                        trialsCollected + 1
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg px-4 py-3 border border-[#10b981]/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#10b981] mb-1", children: "Data Trend Observed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: exp.trend })
                  ] })
                ] }),
                stage === "conclusion" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg px-4 py-3 border border-border/30 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Data Trend" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: exp.trend })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-3 text-foreground", children: "Based on the data, what is the best conclusion?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: exp.conclusions.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#a855f7] hover:bg-[#a855f7]/5 text-muted-foreground hover:text-foreground",
                      onClick: () => handleConclusion(i),
                      "data-ocid": `sci_investigation.conclusion.${i}`,
                      children: c
                    },
                    c
                  )) })
                ] })
              ]
            },
            stage + expIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-lg px-3 py-2 text-xs font-medium shrink-0 ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`,
              children: feedbackMsg
            }
          )
        ] })
      ]
    }
  );
}
export {
  ScientificInvestigation as default
};
