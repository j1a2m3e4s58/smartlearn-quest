import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Z as Zap, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const PERIODS = [
  { name: "Dawn", demand: 20, solarEffective: false },
  { name: "Morning", demand: 70, solarEffective: true },
  { name: "Afternoon", demand: 90, solarEffective: true },
  { name: "Evening", demand: 50, solarEffective: false },
  { name: "Night", demand: 30, solarEffective: false }
];
const STEP = 5;
const SOLAR_MAX = 50;
const WIND_MAX = 40;
const HYDRO_MAX = 30;
function calcSupply(cfg, period) {
  return (period.solarEffective ? cfg.solar : 0) + cfg.wind + cfg.hydro;
}
const CONVERSION_CHAINS = [
  {
    source: "Coal Power Plant",
    steps: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy"
    ],
    correctOrder: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy"
    ]
  },
  {
    source: "Solar Panel",
    steps: ["Electrical Energy", "Light Energy"],
    correctOrder: ["Light Energy", "Electrical Energy"]
  },
  {
    source: "Wind Turbine",
    steps: ["Kinetic Energy", "Mechanical Energy", "Electrical Energy"],
    correctOrder: ["Kinetic Energy", "Mechanical Energy", "Electrical Energy"]
  },
  {
    source: "Hydroelectric Dam",
    steps: ["Electrical Energy", "Kinetic Energy", "Potential Energy"],
    correctOrder: ["Potential Energy", "Kinetic Energy", "Electrical Energy"]
  },
  {
    source: "Nuclear Reactor",
    steps: [
      "Electrical Energy",
      "Thermal Energy",
      "Nuclear Energy",
      "Mechanical Energy"
    ],
    correctOrder: [
      "Nuclear Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy"
    ]
  },
  {
    source: "Biomass Plant",
    steps: [
      "Electrical Energy",
      "Thermal Energy",
      "Chemical Energy",
      "Mechanical Energy"
    ],
    correctOrder: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy"
    ]
  },
  {
    source: "Geothermal Station",
    steps: ["Electrical Energy", "Thermal Energy", "Mechanical Energy"],
    correctOrder: ["Thermal Energy", "Mechanical Energy", "Electrical Energy"]
  },
  {
    source: "Tidal Generator",
    steps: [
      "Kinetic Energy",
      "Potential Energy",
      "Electrical Energy",
      "Mechanical Energy"
    ],
    correctOrder: [
      "Potential Energy",
      "Kinetic Energy",
      "Mechanical Energy",
      "Electrical Energy"
    ]
  },
  {
    source: "Gas Turbine",
    steps: [
      "Electrical Energy",
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy"
    ],
    correctOrder: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy"
    ]
  },
  {
    source: "Photovoltaic Farm",
    steps: ["Electrical Energy", "Thermal Energy", "Light Energy"],
    correctOrder: ["Light Energy", "Thermal Energy", "Electrical Energy"]
  }
];
const EFFICIENCY_QUESTIONS = [
  {
    question: "Which source has the lowest CO2 emissions?",
    answer: (s) => s.reduce((a, b) => a.co2 < b.co2 ? a : b).name,
    explain: "Lowest gCO2/kWh means minimal climate impact."
  },
  {
    question: "Which source is most expensive per kWh?",
    answer: (s) => s.reduce((a, b) => a.costPerKWh > b.costPerKWh ? a : b).name,
    explain: "Highest cost/kWh represents the priciest electricity source."
  },
  {
    question: "Which source uses the most land per MW?",
    answer: (s) => s.reduce((a, b) => a.landUse > b.landUse ? a : b).name,
    explain: "High land use limits where and how much can be deployed."
  },
  {
    question: "Which source has the highest reliability score?",
    answer: (s) => s.reduce((a, b) => a.reliability > b.reliability ? a : b).name,
    explain: "Higher reliability means consistent power output regardless of conditions."
  },
  {
    question: "Best for a remote village with no grid connection?",
    answer: (s) => s.reduce((a, b) => a.reliability > b.reliability ? a : b).name,
    explain: "Reliable, low-maintenance sources suit off-grid village deployments best."
  }
];
const SOURCE_POOLS = [
  [
    { name: "Coal", costPerKWh: 0.05, co2: 820, landUse: 10, reliability: 5 },
    { name: "Wind", costPerKWh: 0.04, co2: 11, landUse: 72, reliability: 3 },
    {
      name: "Solar PV",
      costPerKWh: 0.06,
      co2: 41,
      landUse: 64,
      reliability: 2
    }
  ],
  [
    {
      name: "Natural Gas",
      costPerKWh: 0.07,
      co2: 490,
      landUse: 5,
      reliability: 5
    },
    {
      name: "Hydropower",
      costPerKWh: 0.03,
      co2: 24,
      landUse: 150,
      reliability: 4
    },
    { name: "Nuclear", costPerKWh: 0.1, co2: 12, landUse: 3, reliability: 5 }
  ],
  [
    {
      name: "Geothermal",
      costPerKWh: 0.08,
      co2: 38,
      landUse: 4,
      reliability: 5
    },
    {
      name: "Biomass",
      costPerKWh: 0.11,
      co2: 230,
      landUse: 500,
      reliability: 4
    },
    {
      name: "Offshore Wind",
      costPerKWh: 0.09,
      co2: 12,
      landUse: 5,
      reliability: 4
    }
  ],
  [
    { name: "Coal", costPerKWh: 0.05, co2: 820, landUse: 10, reliability: 5 },
    {
      name: "Geothermal",
      costPerKWh: 0.08,
      co2: 38,
      landUse: 4,
      reliability: 5
    },
    {
      name: "Solar CSP",
      costPerKWh: 0.14,
      co2: 22,
      landUse: 80,
      reliability: 3
    }
  ]
];
function RenewableEnergy({ config, onGameEnd }) {
  const gameId = config.gameId;
  const [gridPhase, setGridPhase] = reactExports.useState("start");
  const [periodIdx, setPeriodIdx] = reactExports.useState(0);
  const [energy, setEnergy] = reactExports.useState({
    solar: 0,
    wind: 0,
    hydro: 0
  });
  const [gridResults, setGridResults] = reactExports.useState([]);
  const [deployed, setDeployed] = reactExports.useState(false);
  const [deployFlash, setDeployFlash] = reactExports.useState("");
  const [chainIdx, setChainIdx] = reactExports.useState(0);
  const [playerChain, setPlayerChain] = reactExports.useState([]);
  const [convPhase, setConvPhase] = reactExports.useState(
    "start"
  );
  const [convFeedback, setConvFeedback] = reactExports.useState("idle");
  const [chainScore, setChainScore] = reactExports.useState(0);
  const [chainCorrect, setChainCorrect] = reactExports.useState(0);
  const [effRound, setEffRound] = reactExports.useState(0);
  const [effQIdx, setEffQIdx] = reactExports.useState(0);
  const [effScore, setEffScore] = reactExports.useState(0);
  const [effCorrect, setEffCorrect] = reactExports.useState(0);
  const [effPhase, setEffPhase] = reactExports.useState("start");
  const [effFeedback, setEffFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed, finalScore) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const s = finalScore ?? scoreRef.current;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, 80, timeSpent, completed));
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const period = PERIODS[periodIdx];
  const liveSupply = calcSupply(energy, period);
  const progressPct = timeLeft / config.timeLimit * 100;
  const timerBarStyle = { width: `${progressPct}%` };
  function supplyColor(supply, demand) {
    const d = Math.abs(supply - demand);
    if (d <= 10) return "#10b981";
    if (d <= 20) return "#f59e0b";
    return "#f43f5e";
  }
  const supplyBarWidth = Math.min(100, liveSupply / 100 * 100);
  const demandBarWidth = Math.min(100, period.demand / 100 * 100);
  const supplyBarStyle = {
    width: `${supplyBarWidth}%`,
    background: supplyColor(liveSupply, period.demand)
  };
  const demandBarStyle = { width: `${demandBarWidth}%` };
  const flashColor = deployFlash === "Perfect Match" ? "#10b981" : deployFlash === "Good Match" ? "#f59e0b" : "#f43f5e";
  function handleGridStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGridPhase("configure");
    startTimer();
  }
  function adjust(src, dir) {
    setEnergy((prev) => {
      const max = src === "solar" ? SOLAR_MAX : src === "wind" ? WIND_MAX : HYDRO_MAX;
      const next = prev[src] + dir * STEP;
      return { ...prev, [src]: Math.min(max, Math.max(0, next)) };
    });
  }
  function handleDeploy() {
    if (deployed) return;
    setDeployed(true);
    const p = PERIODS[periodIdx];
    const supply = calcSupply(energy, p);
    const diff = Math.abs(supply - p.demand);
    let pts = 0;
    let rating = "";
    if (diff <= 10) {
      pts = 100 * config.difficulty;
      rating = "Perfect Match";
    } else if (diff <= 20) {
      pts = 60 * config.difficulty;
      rating = "Good Match";
    } else {
      pts = Math.max(0, 20 * config.difficulty - diff);
      rating = "Off Target";
    }
    setGridResults((prev) => [
      ...prev,
      { period: p, supply, demand: p.demand, pts, rating }
    ]);
    setScore((s) => s + pts);
    setDeployFlash(rating);
    setTimeout(() => {
      setDeployFlash("");
      setDeployed(false);
      const nextIdx = periodIdx + 1;
      if (nextIdx >= PERIODS.length) setGridPhase("summary");
      else {
        setPeriodIdx(nextIdx);
        setEnergy({ solar: 0, wind: 0, hydro: 0 });
      }
    }, 1600);
  }
  const currentChain = CONVERSION_CHAINS[chainIdx % CONVERSION_CHAINS.length];
  const shuffledSteps = [...currentChain.steps];
  function convStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setConvPhase("play");
    setPlayerChain([]);
    startTimer();
  }
  function selectStep(step) {
    if (convFeedback !== "idle") return;
    if (playerChain.includes(step)) {
      setPlayerChain((p) => p.filter((s) => s !== step));
      return;
    }
    const next = [...playerChain, step];
    setPlayerChain(next);
    if (next.length === currentChain.correctOrder.length) {
      const correct = next.every((s, i) => s === currentChain.correctOrder[i]);
      const pts = correct ? 150 * config.difficulty : 20;
      setChainScore((s) => s + pts);
      setScore((s) => s + pts);
      if (correct) setChainCorrect((c) => c + 1);
      setConvFeedback(correct ? "correct" : "wrong");
      setTimeout(() => {
        setConvFeedback("idle");
        setPlayerChain([]);
        const nextIdx = chainIdx + 1;
        if (nextIdx >= 10) {
          setConvPhase("done");
          endGame(true);
        } else {
          setChainIdx(nextIdx);
        }
      }, 1500);
    }
  }
  const effSources = SOURCE_POOLS[effRound % SOURCE_POOLS.length];
  const effQuestion = EFFICIENCY_QUESTIONS[effQIdx];
  function effStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setEffPhase("play");
    startTimer();
  }
  function handleEffAnswer(sourceName) {
    if (effFeedback) return;
    const correct = sourceName === effQuestion.answer(effSources);
    const pts = correct ? 120 * config.difficulty : 0;
    setEffScore((s) => s + pts);
    setScore((s) => s + pts);
    if (correct) setEffCorrect((c) => c + 1);
    setEffFeedback({
      ok: correct,
      msg: correct ? `Correct! ${effQuestion.explain} +${pts} pts` : `Incorrect. ${effQuestion.explain}`
    });
    setTimeout(() => {
      setEffFeedback(null);
      const nextQ = effQIdx + 1;
      if (nextQ >= EFFICIENCY_QUESTIONS.length) {
        const nextRound = effRound + 1;
        if (nextRound >= SOURCE_POOLS.length) {
          setEffPhase("done");
          endGame(true);
        } else {
          setEffRound(nextRound);
          setEffQIdx(0);
        }
      } else {
        setEffQIdx(nextQ);
      }
    }, 2e3);
  }
  if (gameId === "energy-conversion") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col gap-2 select-none",
        "data-ocid": "energy_conversion.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#06b6d4" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: chainScore.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              chainIdx + 1,
              "/10 chains | ",
              chainCorrect,
              " correct"
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
          convPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Zap,
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
                    children: "Energy Conversion"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Trace how energy transforms through 10 different power sources." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Click the conversion steps in the correct order for each source." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: convStart,
                    "data-ocid": "energy_conversion.start_button",
                    children: "Start Tracing"
                  }
                )
              ] })
            }
          ),
          convPhase === "play" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: "Energy Source"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-black", style: { color: "#06b6d4" }, children: currentChain.source }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Click the energy types in the correct conversion order (",
                currentChain.correctOrder.length,
                " steps)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Your chain:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 min-h-8", children: [
                playerChain.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "→" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-3 py-1 rounded-full text-xs font-bold",
                      style: {
                        background: "#06b6d420",
                        color: "#06b6d4",
                        border: "1px solid #06b6d4"
                      },
                      children: s
                    }
                  )
                ] }, i)),
                playerChain.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Click steps below to build the chain..." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: shuffledSteps.map((step, i) => {
              const selected = playerChain.includes(step);
              const btnStyle = selected ? {
                borderColor: "#06b6d4",
                background: "#06b6d420",
                color: "#06b6d4"
              } : {};
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "px-3 py-3 rounded-xl border border-border/40 text-sm font-semibold transition-all hover:border-[#06b6d4]/60 text-foreground",
                  style: btnStyle,
                  onClick: () => selectStep(step),
                  disabled: convFeedback !== "idle" || selected,
                  "data-ocid": `energy_conversion.step.${i + 1}`,
                  children: step
                },
                i
              );
            }) }),
            convFeedback !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "rounded-xl p-3 text-center font-bold text-sm",
                style: {
                  color: convFeedback === "correct" ? "#10b981" : "#f43f5e",
                  background: convFeedback === "correct" ? "#10b98115" : "#f43f5e15",
                  border: `1px solid ${convFeedback === "correct" ? "#10b981" : "#f43f5e"}`
                },
                children: convFeedback === "correct" ? `Correct chain! +${150 * config.difficulty} pts` : `Wrong order. Correct: ${currentChain.correctOrder.join(" → ")}`
              }
            )
          ] })
        ]
      }
    );
  }
  if (gameId === "efficiency-challenge") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col gap-2 select-none",
        "data-ocid": "efficiency_challenge.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: effScore.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Round ",
              effRound + 1,
              "/4 | Q",
              effQIdx + 1,
              "/",
              EFFICIENCY_QUESTIONS.length,
              " | ",
              effCorrect,
              " correct"
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
          effPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Zap,
                  {
                    className: "h-14 w-14 mx-auto mb-4",
                    style: { color: "#10b981" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black mb-3",
                    style: {
                      fontFamily: "'Orbitron',sans-serif",
                      color: "#10b981",
                      textShadow: "0 0 20px rgba(16,185,129,0.6)"
                    },
                    children: "Efficiency Challenge"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Compare 3 energy sources across 4 rounds and answer 5 decision questions each round." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Analyse cost, emissions, land use and reliability to pick the best answer." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: effStart,
                    "data-ocid": "efficiency_challenge.start_button",
                    children: "Start Analysis"
                  }
                )
              ] })
            }
          ),
          effPhase === "play" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: effSources.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "glass-card rounded-xl p-3 border border-border/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-black text-center mb-2",
                      style: { color: "#10b981" },
                      children: src.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cost/kWh" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
                        "$",
                        src.costPerKWh.toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "CO2 (g/kWh)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: src.co2 })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Land (m²/MW)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: src.landUse })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Reliability" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: Array.from({ length: 5 }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: j < src.reliability ? "#f59e0b" : "#374151"
                          },
                          children: "★"
                        },
                        j
                      )) })
                    ] })
                  ] })
                ]
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#10b981]/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-[#10b981] mb-2",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: [
                    "Question ",
                    effQIdx + 1,
                    " of ",
                    EFFICIENCY_QUESTIONS.length
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: effQuestion.question })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: effSources.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#10b981]/60 text-foreground font-semibold disabled:opacity-50",
                onClick: () => handleEffAnswer(src.name),
                disabled: !!effFeedback,
                "data-ocid": `efficiency_challenge.answer.${i + 1}`,
                children: src.name
              },
              i
            )) }),
            effFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "rounded-xl p-3 text-sm font-medium",
                style: {
                  color: effFeedback.ok ? "#10b981" : "#f43f5e",
                  background: effFeedback.ok ? "#10b98115" : "#f43f5e15",
                  border: `1px solid ${effFeedback.ok ? "#10b981" : "#f43f5e"}`
                },
                children: effFeedback.msg
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "renewable_energy.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          gridPhase === "configure" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Period ",
            periodIdx + 1,
            "/",
            PERIODS.length
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
        gridPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex flex-col items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Zap,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#f59e0b",
                    textShadow: "0 0 20px rgba(245,158,11,0.6)"
                  },
                  children: "Grid Engineer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Balance solar, wind and hydro power output to match demand across 5 time periods." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Solar only works in Morning and Afternoon. Within 10 units = Perfect. Within 20 = Good." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleGridStart,
                  "data-ocid": "renewable_energy.start_button",
                  children: "Power the Grid"
                }
              )
            ] })
          }
        ),
        gridPhase === "configure" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-3 min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            className: "flex-1 flex flex-col gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: "text-lg font-black",
                        style: { color: "#00f5ff" },
                        children: period.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: period.solarEffective ? "Solar active" : "Solar inactive (no sunlight)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Demand" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "text-2xl font-black",
                        style: { color: "#f43f5e" },
                        children: [
                          period.demand,
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "MW" })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Supply: ",
                        liveSupply,
                        " MW"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            color: supplyColor(liveSupply, period.demand)
                          },
                          children: [
                            liveSupply > period.demand ? "+" : "",
                            liveSupply - period.demand,
                            " MW"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all duration-300",
                        style: supplyBarStyle
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Demand" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        period.demand,
                        " MW"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full bg-[#f43f5e]/60",
                        style: demandBarStyle
                      }
                    ) })
                  ] })
                ] })
              ] }),
              [
                {
                  key: "solar",
                  label: "Solar Panels",
                  max: SOLAR_MAX,
                  active: period.solarEffective,
                  color: "#f59e0b"
                },
                {
                  key: "wind",
                  label: "Wind Turbines",
                  max: WIND_MAX,
                  active: true,
                  color: "#06b6d4"
                },
                {
                  key: "hydro",
                  label: "Hydro Dam",
                  max: HYDRO_MAX,
                  active: true,
                  color: "#3b82f6"
                }
              ].map((src) => {
                const fillPct = energy[src.key] / src.max * 100;
                const fillStyle = {
                  width: `${fillPct}%`,
                  background: src.active ? src.color : "#444"
                };
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-xl p-4 border border-border/30",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-sm font-bold",
                            style: { color: src.active ? src.color : "#666" },
                            children: src.label
                          }
                        ),
                        !src.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "(offline)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "text-sm font-black tabular-nums",
                            style: { color: src.color },
                            children: [
                              energy[src.key],
                              " MW"
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-full transition-all duration-200",
                          style: fillStyle
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "w-8 h-8 rounded-lg border border-border/40 flex items-center justify-center hover:border-[#f43f5e] hover:bg-[#f43f5e]/10 transition-all",
                            onClick: () => adjust(src.key, -1),
                            disabled: !src.active || energy[src.key] <= 0,
                            "data-ocid": `renewable_energy.${src.key}_minus`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                          "Max ",
                          src.max,
                          " MW / Step ",
                          STEP,
                          " MW"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "w-8 h-8 rounded-lg border border-border/40 flex items-center justify-center hover:border-[#10b981] hover:bg-[#10b981]/10 transition-all",
                            onClick: () => adjust(src.key, 1),
                            disabled: !src.active || energy[src.key] >= src.max,
                            "data-ocid": `renewable_energy.${src.key}_plus`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                          }
                        )
                      ] })
                    ]
                  },
                  src.key
                );
              }),
              deployFlash ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded-xl px-4 py-3 text-center font-bold text-sm",
                  style: {
                    color: flashColor,
                    border: `2px solid ${flashColor}`,
                    background: `${flashColor}15`
                  },
                  children: deployFlash
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleDeploy,
                  "data-ocid": "renewable_energy.deploy_button",
                  children: "Deploy to Grid"
                }
              )
            ]
          },
          periodIdx
        ) }) }),
        gridPhase === "summary" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex flex-col gap-3 overflow-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "text-center font-black text-xl",
                  style: { color: "#f59e0b", fontFamily: "'Orbitron',sans-serif" },
                  children: "Grid Report"
                }
              ),
              gridResults.map((r, i) => {
                const ratingColor = r.rating === "Perfect Match" ? "#10b981" : r.rating === "Good Match" ? "#f59e0b" : "#f43f5e";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-xl p-4 border border-border/30",
                    "data-ocid": `renewable_energy.result.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-foreground", children: r.period.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs font-bold",
                            style: { color: ratingColor },
                            children: r.rating
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "text-sm font-black tabular-nums",
                            style: { color: "#f59e0b" },
                            children: [
                              "+",
                              r.pts
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                        "Supply ",
                        r.supply,
                        " MW vs Demand ",
                        r.demand,
                        " MW (diff:",
                        " ",
                        Math.abs(r.supply - r.demand),
                        " MW)"
                      ] })
                    ]
                  },
                  r.period.name
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 text-center border border-[#f59e0b]/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-black", style: { color: "#f59e0b" }, children: [
                  score.toLocaleString(),
                  " pts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Final Score" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => endGame(true),
                  "data-ocid": "renewable_energy.finish_button",
                  children: "Finish"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  RenewableEnergy as default
};
