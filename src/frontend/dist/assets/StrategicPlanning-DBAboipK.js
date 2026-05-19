import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const BUILDINGS = [
  {
    type: "school",
    label: "School",
    cost: 200,
    education: 30,
    health: 0,
    transport: 0,
    food: 0
  },
  {
    type: "hospital",
    label: "Hospital",
    cost: 300,
    education: 0,
    health: 40,
    transport: 0,
    food: 0
  },
  {
    type: "road",
    label: "Road",
    cost: 80,
    education: 0,
    health: 0,
    transport: 25,
    food: 0
  },
  {
    type: "market",
    label: "Market",
    cost: 150,
    education: 0,
    health: 0,
    transport: 5,
    food: 35
  },
  {
    type: "park",
    label: "Park",
    cost: 100,
    education: 5,
    health: 10,
    transport: 0,
    food: 5
  },
  {
    type: "police",
    label: "Station",
    cost: 120,
    education: 0,
    health: 5,
    transport: 5,
    food: 0
  }
];
const DIFF_CFG = {
  1: {
    budget: 1200,
    gridSize: 3,
    targets: {
      education: 60,
      health: 60,
      transport: 50,
      food: 60
    }
  },
  2: {
    budget: 1500,
    gridSize: 4,
    targets: {
      education: 80,
      health: 80,
      transport: 70,
      food: 80
    }
  },
  3: {
    budget: 1800,
    gridSize: 5,
    targets: {
      education: 100,
      health: 100,
      transport: 100,
      food: 100
    }
  }
};
const COLORS = {
  school: "#00f5ff",
  hospital: "#f43f5e",
  road: "#94a3b8",
  market: "#f59e0b",
  park: "#10b981",
  police: "#6366f1"
};
function CityPlanner({ config, onGameEnd }) {
  const dc = DIFF_CFG[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [budget, setBudget] = reactExports.useState(dc.budget);
  const [grid, setGrid] = reactExports.useState(
    () => Array.from(
      { length: dc.gridSize },
      (_, r) => Array.from({ length: dc.gridSize }, (_2, c) => ({
        row: r,
        col: c,
        building: null
      }))
    )
  );
  const [selectedBuilding, setSelectedBuilding] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [event, setEvent] = reactExports.useState(null);
  const phaseRef = reactExports.useRef(phase);
  const scoreRef = reactExports.useRef(score);
  const startTimeRef = reactExports.useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 100 : 60,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function computeStats(g) {
    const stats2 = { education: 0, health: 0, transport: 0, food: 0 };
    for (const row of g)
      for (const cell of row) {
        if (!cell.building) continue;
        const b = BUILDINGS.find((b2) => b2.type === cell.building);
        stats2.education += b.education;
        stats2.health += b.health;
        stats2.transport += b.transport;
        stats2.food += b.food;
      }
    return stats2;
  }
  function placeBuilding(r, c) {
    if (!selectedBuilding || phase !== "planning") return;
    const b = BUILDINGS.find((b2) => b2.type === selectedBuilding);
    if (grid[r][c].building) {
      const old = BUILDINGS.find((ob) => ob.type === grid[r][c].building);
      const diff = b.cost - old.cost;
      if (budget - diff < 0) {
        setEvent("Not enough budget!");
        setTimeout(() => setEvent(null), 2e3);
        return;
      }
      setBudget((prev) => prev - diff);
    } else {
      if (budget - b.cost < 0) {
        setEvent("Not enough budget!");
        setTimeout(() => setEvent(null), 2e3);
        return;
      }
      setBudget((prev) => prev - b.cost);
    }
    const newGrid = grid.map(
      (row) => row.map(
        (cell) => cell.row === r && cell.col === c ? { ...cell, building: selectedBuilding } : cell
      )
    );
    setGrid(newGrid);
    const stats2 = computeStats(newGrid);
    const met = Object.entries(dc.targets).filter(
      ([k, v]) => stats2[k] >= v
    ).length;
    setScore(met * 150 * config.difficulty);
    if (Object.entries(dc.targets).every(
      ([k, v]) => stats2[k] >= v
    )) {
      setEvent("All targets met! City thriving!");
      setTimeout(() => endGame(true), 2e3);
    }
  }
  function removeBuilding(r, c) {
    const cell = grid[r][c];
    if (!cell.building) return;
    const b = BUILDINGS.find((b2) => b2.type === cell.building);
    setBudget((prev) => prev + Math.floor(b.cost * 0.7));
    setGrid(
      grid.map(
        (row) => row.map(
          (c2) => c2.row === r && c2.col === c ? { ...c2, building: null } : c2
        )
      )
    );
  }
  const stats = computeStats(grid);
  const timePct = timeLeft / config.timeLimit * 100;
  const needsBar = (val, target, label, color) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color }, children: [
        val,
        "/",
        target
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded-full transition-all duration-300",
        style: {
          width: `${Math.min(100, val / target * 100)}%`,
          background: color
        }
      }
    ) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "strategic_planning.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#6366f1] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
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
                  className: "text-3xl font-black text-[#6366f1]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "City Planner"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Allocate your budget. Place buildings to meet education, health, transport, and food targets." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    startTimer();
                    setPhase("planning");
                  },
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#6366f1" },
                  "data-ocid": "strategic_planning.start_button",
                  children: "Begin Planning"
                }
              )
            ]
          }
        ),
        phase === "planning" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#6366f1] font-mono", children: [
              "Budget: ",
              budget
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            needsBar(
              stats.education,
              dc.targets.education,
              "Education",
              "#00f5ff"
            ),
            needsBar(stats.health, dc.targets.health, "Health", "#f43f5e"),
            needsBar(
              stats.transport,
              dc.targets.transport,
              "Transport",
              "#94a3b8"
            ),
            needsBar(stats.food, dc.targets.food, "Food", "#f59e0b")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: BUILDINGS.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedBuilding(
                selectedBuilding === b.type ? null : b.type
              ),
              className: `px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${selectedBuilding === b.type ? "" : "border-border/30 bg-card/40 hover:opacity-80"}`,
              style: selectedBuilding === b.type ? {
                borderColor: COLORS[b.type],
                background: `${COLORS[b.type]}20`,
                color: COLORS[b.type]
              } : {},
              "data-ocid": `strategic_planning.building.${b.type}`,
              children: [
                b.label,
                " (",
                b.cost,
                ")"
              ]
            },
            b.type
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-1",
              style: { gridTemplateColumns: `repeat(${dc.gridSize}, 1fr)` },
              children: grid.flat().map((cell) => {
                const building = BUILDINGS.find((b) => b.type === cell.building);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    whileHover: { scale: 1.05 },
                    onClick: () => selectedBuilding ? placeBuilding(cell.row, cell.col) : removeBuilding(cell.row, cell.col),
                    className: `h-14 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-bold transition-all ${cell.building ? "" : "border-border/20 bg-card/30 hover:border-border/60"}`,
                    style: cell.building ? {
                      borderColor: COLORS[cell.building],
                      background: `${COLORS[cell.building]}15`,
                      color: COLORS[cell.building]
                    } : {},
                    "data-ocid": `strategic_planning.cell.${cell.row}_${cell.col}`,
                    children: building ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: building.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] opacity-60", children: [
                        building.cost,
                        "c"
                      ] })
                    ] }) : "+"
                  },
                  `${cell.row}-${cell.col}`
                );
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: event && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "text-sm text-center font-bold",
              style: {
                color: event.includes("thriving") ? "#4ade80" : "#f43f5e"
              },
              children: event
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => endGame(false),
              className: "self-end text-xs text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "strategic_planning.submit_button",
              children: "Submit City Plan"
            }
          )
        ] })
      ]
    }
  );
}
const MISSIONS = [
  {
    title: "Operation Alpha",
    objective: "Retrieve classified data from a guarded facility.",
    phases: [
      {
        name: "Infiltration",
        options: [
          {
            label: "Safe: Bribe guard",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0
          },
          {
            label: "Risky: Sneak through ventilation",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0
          },
          {
            label: "Bold: Create distraction",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0
          }
        ]
      },
      {
        name: "Data Extraction",
        options: [
          {
            label: "Safe: Download to USB",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0
          },
          {
            label: "Risky: Hack the mainframe",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0
          },
          {
            label: "Bold: Steal the entire server",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0
          }
        ]
      },
      {
        name: "Escape Route",
        options: [
          {
            label: "Safe: Leave through front",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0
          },
          {
            label: "Risky: Jump from roof",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0
          },
          {
            label: "Bold: Steal a vehicle",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0
          }
        ]
      },
      {
        name: "Extraction",
        options: [
          {
            label: "Safe: Call a driver",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0
          },
          {
            label: "Risky: Helicopter pickup",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0
          },
          {
            label: "Bold: Submarine dock",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0
          }
        ]
      }
    ]
  }
];
function MissionStrategist({ config, onGameEnd }) {
  const missionCount = config.difficulty;
  const [phase, setPhase] = reactExports.useState("idle");
  const [missionIdx, setMissionIdx] = reactExports.useState(0);
  const [phaseIdx, setPhaseIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [run, setRun] = reactExports.useState(1);
  const [results, setResults] = reactExports.useState([]);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }
  const mission = MISSIONS[missionIdx % MISSIONS.length];
  const currentPhase = mission.phases[phaseIdx];
  function chooseOption(opt) {
    let pts = 0;
    let success = false;
    if (opt.type === "safe") {
      pts = opt.guaranteed;
      success = true;
    } else if (opt.type === "risky") {
      success = Math.random() < opt.riskChance;
      pts = success ? opt.riskPts : 0;
    } else {
      success = Math.random() < 0.5;
      pts = success ? opt.riskPts : -20;
    }
    pts = pts * config.difficulty;
    setScore((s) => s + pts);
    setResults((prev) => [
      ...prev,
      { phase: currentPhase.name, choice: opt.label, pts, success }
    ]);
    setTimeout(() => {
      if (phaseIdx + 1 >= mission.phases.length) {
        const nextRun = run + 1;
        if (nextRun > missionCount) {
          endGame(true);
          return;
        }
        setRun(nextRun);
        setPhaseIdx(0);
        setResults([]);
      } else setPhaseIdx((i) => i + 1);
    }, 1200);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const optColors = {
    safe: "#22c55e",
    risky: "#f59e0b",
    bold: "#f43f5e"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "mission_strategist.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#6366f1] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
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
                  className: "text-3xl font-black text-[#6366f1]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Mission Strategist"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: [
                "Navigate a 4-phase mission. At each phase choose Safe (guaranteed), Risky (80% chance), or Bold (50% chance). Maximize total score across ",
                missionCount,
                " run",
                missionCount > 1 ? "s" : "",
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#22c55e]/30 p-2 bg-card/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[#22c55e]", children: "Safe" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "+50 pts guaranteed" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#f59e0b]/30 p-2 bg-card/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[#f59e0b]", children: "Risky" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "80% → +100 pts" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#f43f5e]/30 p-2 bg-card/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[#f43f5e]", children: "Bold" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "50% → +150 / -20" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#6366f1" },
                  "data-ocid": "mission_strategist.start_button",
                  children: "Launch Mission"
                }
              )
            ]
          }
        ),
        phase === "playing" && currentPhase && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#6366f1] font-mono", children: [
              "Run ",
              run,
              "/",
              missionCount,
              " | Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Phase ",
              phaseIdx + 1,
              "/",
              mission.phases.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#6366f1]/30 bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#6366f1] font-bold uppercase tracking-widest mb-1", children: mission.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: currentPhase.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: mission.objective })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: currentPhase.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => chooseOption(opt),
              className: "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm hover:opacity-90",
              style: {
                borderColor: `${optColors[opt.type]}50`,
                background: `${optColors[opt.type]}10`,
                color: optColors[opt.type]
              },
              "data-ocid": `mission_strategist.option.${opt.type}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: opt.label })
            },
            opt.type
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: results.slice(-3).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `text-xs flex justify-between ${r.success ? "text-[#22c55e]" : "text-[#f43f5e]"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  r.phase,
                  ": ",
                  r.choice
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  r.pts >= 0 ? "+" : "",
                  r.pts,
                  " pts"
                ] })
              ]
            },
            `r-${i}`
          )) })
        ] })
      ]
    }
  );
}
const DT_DECISIONS = [
  {
    title: "School Technology Investment",
    question: "Should the school buy tablets or textbooks?",
    context: "Budget: GHS 5000. 50 students need learning materials.",
    branches: [
      {
        label: "Tablets (25 units)",
        probability: 0.7,
        outcomeValue: 80,
        isOptimal: true
      },
      {
        label: "Textbooks (full set)",
        probability: 1,
        outcomeValue: 50,
        isOptimal: false
      },
      {
        label: "Mix (10 tablets + half textbooks)",
        probability: 0.85,
        outcomeValue: 65,
        isOptimal: false
      }
    ],
    optimalBranch: 0,
    explanation: "Tablets have higher expected value (0.7 x 80 = 56) vs textbooks (1.0 x 50 = 50). Though risky, tablets provide greater long-term learning flexibility."
  },
  {
    title: "Business Expansion",
    question: "Should the company expand to a new market?",
    context: "Current revenue: $200k. Expansion costs $50k.",
    branches: [
      {
        label: "Expand to West Africa",
        probability: 0.6,
        outcomeValue: 300,
        isOptimal: true
      },
      {
        label: "Expand locally only",
        probability: 0.9,
        outcomeValue: 120,
        isOptimal: false
      },
      {
        label: "Stay and improve current",
        probability: 1,
        outcomeValue: 80,
        isOptimal: false
      }
    ],
    optimalBranch: 0,
    explanation: "Expected value: West Africa = 0.6 x 300 = 180. Local = 0.9 x 120 = 108. Staying = 80. West Africa has highest expected value despite higher risk."
  },
  {
    title: "Medical Treatment Decision",
    question: "Which treatment should the doctor recommend?",
    context: "Patient has a 70% treatable condition. Two treatments available.",
    branches: [
      {
        label: "Standard surgery (established)",
        probability: 0.85,
        outcomeValue: 90,
        isOptimal: true
      },
      {
        label: "Experimental drug trial",
        probability: 0.5,
        outcomeValue: 120,
        isOptimal: false
      },
      {
        label: "Conservative management",
        probability: 0.95,
        outcomeValue: 40,
        isOptimal: false
      }
    ],
    optimalBranch: 0,
    explanation: "Expected value: Surgery = 0.85 x 90 = 76.5. Experimental = 0.5 x 120 = 60. Conservative = 0.95 x 40 = 38. Surgery offers best risk-adjusted outcome."
  }
];
function DecisionTreeBuilder({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const decisions = DT_DECISIONS.slice(0, count);
  const [phase, setPhase] = reactExports.useState("idle");
  const [dIdx, setDIdx] = reactExports.useState(0);
  const [picked, setPicked] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const livesRef = reactExports.useRef(lives);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }
  const decision = decisions[dIdx];
  function pickBranch(idx) {
    if (picked !== null) return;
    setPicked(idx);
    const correct = idx === decision.optimalBranch;
    if (correct) {
      const pts = 500 * config.difficulty + timeLeft * 3;
      setScore((s) => s + pts);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 2e3);
        return;
      }
    }
    setTimeout(() => {
      if (dIdx + 1 >= decisions.length) {
        endGame(true);
        return;
      }
      setDIdx((i) => i + 1);
      setPicked(null);
    }, 2500);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "decision_tree.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#6366f1] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
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
                  className: "text-3xl font-black text-[#6366f1]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Decision Tree"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Read the scenario. Each branch shows probability and outcome value. Calculate expected value (probability x outcome) and select the optimal decision." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Expected Value = Probability x Outcome | ",
                decisions.length,
                " ",
                "scenarios"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#6366f1" },
                  "data-ocid": "decision_tree.start_button",
                  children: "Build Decision Tree"
                }
              )
            ]
          }
        ),
        phase === "playing" && decision && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#6366f1] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              dIdx + 1,
              "/",
              decisions.length,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
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
              className: "flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#6366f1]/30 bg-card/40 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#6366f1]", children: decision.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mt-1", children: decision.question }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: decision.context })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Calculate Expected Value (P x V) for each branch. Select the optimal decision:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: decision.branches.map((branch, i) => {
                  const ev = (branch.probability * branch.outcomeValue).toFixed(
                    1
                  );
                  const isOptimal = branch.isOptimal;
                  const isPicked = picked === i;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => pickBranch(i),
                      className: `w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${picked !== null && isOptimal ? "border-[#22c55e] bg-[#22c55e]/10" : picked !== null && isPicked && !isOptimal ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-border/30 bg-card/50 hover:border-[#6366f1]/50"}`,
                      "data-ocid": `decision_tree.branch.${i}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: branch.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "text-xs font-mono",
                              style: {
                                color: picked !== null ? isOptimal ? "#22c55e" : "#f43f5e" : "#6366f1"
                              },
                              children: [
                                "EV: ",
                                ev
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                          "P=",
                          branch.probability,
                          " | V=",
                          branch.outcomeValue
                        ] })
                      ]
                    },
                    i
                  );
                }) }),
                picked !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: `rounded-lg p-3 text-sm border ${picked === decision.optimalBranch ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                    children: [
                      picked === decision.optimalBranch ? "Correct! " : "Not optimal. ",
                      decision.explanation
                    ]
                  }
                )
              ]
            },
            dIdx
          ) })
        ] })
      ]
    }
  );
}
function StrategicPlanning({ config, onGameEnd }) {
  if (config.gameId === "mission-strategist")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MissionStrategist, { config, onGameEnd });
  if (config.gameId === "decision-tree")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DecisionTreeBuilder, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CityPlanner, { config, onGameEnd });
}
export {
  StrategicPlanning as default
};
