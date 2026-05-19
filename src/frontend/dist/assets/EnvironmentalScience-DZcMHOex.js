import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { G as Globe } from "./globe-xjd47iwo.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
const BASE_ROUNDS = [
  {
    decisions: [
      {
        name: "Plant Trees",
        desc: "City-wide reforestation programme",
        env: 10,
        eco: -3,
        health: 5
      },
      {
        name: "Build Factory",
        desc: "New industrial manufacturing plant",
        env: -12,
        eco: 15,
        health: -8
      },
      {
        name: "Solar Farm",
        desc: "Install rooftop solar panels",
        env: 8,
        eco: -5,
        health: 3
      }
    ]
  },
  {
    decisions: [
      {
        name: "Clean River",
        desc: "Remove pollutants from waterways",
        env: 12,
        eco: -4,
        health: 10
      },
      {
        name: "Open Mine",
        desc: "Extract mineral resources",
        env: -15,
        eco: 18,
        health: -6
      },
      {
        name: "Recycling Drive",
        desc: "Community waste reduction campaign",
        env: 7,
        eco: 2,
        health: 4
      }
    ]
  },
  {
    decisions: [
      {
        name: "Organic Farms",
        desc: "Switch to pesticide-free agriculture",
        env: 8,
        eco: -6,
        health: 9
      },
      {
        name: "Highway Expansion",
        desc: "Widen major transport routes",
        env: -10,
        eco: 12,
        health: -5
      },
      {
        name: "Wind Turbines",
        desc: "Coastal wind energy installation",
        env: 9,
        eco: -4,
        health: 2
      }
    ]
  },
  {
    decisions: [
      {
        name: "Green Schools",
        desc: "Eco education for all students",
        env: 5,
        eco: -2,
        health: 8
      },
      {
        name: "Deforestation",
        desc: "Clear forest for agriculture",
        env: -18,
        eco: 14,
        health: -7
      },
      {
        name: "Public Transit",
        desc: "Expand bus and rail network",
        env: 10,
        eco: -5,
        health: 6
      }
    ]
  },
  {
    decisions: [
      {
        name: "Marine Reserve",
        desc: "Protect ocean ecosystems",
        env: 14,
        eco: -6,
        health: 5
      },
      {
        name: "Oil Drilling",
        desc: "Offshore petroleum extraction",
        env: -16,
        eco: 20,
        health: -9
      },
      {
        name: "Rainwater Harvest",
        desc: "Community water collection systems",
        env: 6,
        eco: 3,
        health: 7
      }
    ]
  },
  {
    decisions: [
      {
        name: "Rewild Zone",
        desc: "Return farmland to natural habitat",
        env: 13,
        eco: -8,
        health: 4
      },
      {
        name: "Coal Power",
        desc: "New coal power station",
        env: -14,
        eco: 16,
        health: -10
      },
      {
        name: "EV Subsidies",
        desc: "Incentivise electric vehicles",
        env: 9,
        eco: -7,
        health: 5
      }
    ]
  },
  {
    decisions: [
      {
        name: "Wetlands Restore",
        desc: "Rehabilitate flood plains",
        env: 11,
        eco: -5,
        health: 6
      },
      {
        name: "Urban Sprawl",
        desc: "Approve major housing development",
        env: -11,
        eco: 13,
        health: -4
      },
      {
        name: "Compost Network",
        desc: "City-wide organic composting",
        env: 6,
        eco: 1,
        health: 5
      }
    ]
  },
  {
    decisions: [
      {
        name: "Clean Cookstoves",
        desc: "Replace wood fires with gas",
        env: 7,
        eco: -3,
        health: 12
      },
      {
        name: "Industrial Waste",
        desc: "Allow untreated discharge",
        env: -13,
        eco: 10,
        health: -12
      },
      {
        name: "Biodiversity Map",
        desc: "Research and protect species",
        env: 10,
        eco: -2,
        health: 3
      }
    ]
  },
  {
    decisions: [
      {
        name: "National Park",
        desc: "Designate protected wilderness",
        env: 12,
        eco: -4,
        health: 5
      },
      {
        name: "Fracking Sites",
        desc: "Hydraulic fracturing for gas",
        env: -15,
        eco: 17,
        health: -8
      },
      {
        name: "Agroforestry",
        desc: "Integrate trees into croplands",
        env: 9,
        eco: 3,
        health: 6
      }
    ]
  },
  {
    decisions: [
      {
        name: "Mangrove Plant",
        desc: "Coastal mangrove restoration",
        env: 13,
        eco: -3,
        health: 7
      },
      {
        name: "Pesticide Use",
        desc: "Increase agricultural chemicals",
        env: -9,
        eco: 8,
        health: -10
      },
      {
        name: "Zero-Waste City",
        desc: "Full circular economy model",
        env: 10,
        eco: -5,
        health: 8
      }
    ]
  }
];
const DISASTERS = [
  {
    name: "DISASTER: Wildfire",
    desc: "Uncontrolled wildfire spreads",
    env: -20,
    eco: -10,
    health: -15
  },
  {
    name: "DISASTER: Flood",
    desc: "Major flooding event",
    env: -10,
    eco: -15,
    health: -12
  },
  {
    name: "DISASTER: Drought",
    desc: "Severe water shortage",
    env: -12,
    eco: -8,
    health: -14
  }
];
function scaledRound(base, diff) {
  if (diff === 1) return base;
  const multiplier = diff === 2 ? 1.4 : 2;
  return {
    decisions: base.decisions.map((d) => ({
      ...d,
      env: Math.round(d.env * multiplier),
      eco: Math.round(d.eco * multiplier),
      health: Math.round(d.health * multiplier)
    }))
  };
}
const CARBON_CATEGORIES = [
  {
    category: "Daily Transport",
    options: [
      { label: "Drive alone (car)", footprint: 4200, color: "#f43f5e" },
      { label: "Public bus/train", footprint: 900, color: "#f59e0b" },
      { label: "Bicycle / Walk", footprint: 0, color: "#10b981" }
    ]
  },
  {
    category: "Diet",
    options: [
      { label: "Beef-based diet", footprint: 7200, color: "#f43f5e" },
      { label: "Vegetarian diet", footprint: 1800, color: "#f59e0b" },
      { label: "Vegan diet", footprint: 900, color: "#10b981" }
    ]
  },
  {
    category: "Home Energy",
    options: [
      { label: "Coal / oil heating", footprint: 5500, color: "#f43f5e" },
      { label: "Natural gas", footprint: 2800, color: "#f59e0b" },
      { label: "Solar / renewable", footprint: 300, color: "#10b981" }
    ]
  },
  {
    category: "Air Travel",
    options: [
      {
        label: "Frequent flyer (3+ flights/year)",
        footprint: 6e3,
        color: "#f43f5e"
      },
      {
        label: "Occasional (1-2 flights/year)",
        footprint: 2e3,
        color: "#f59e0b"
      },
      { label: "No air travel", footprint: 0, color: "#10b981" }
    ]
  },
  {
    category: "Shopping Habits",
    options: [
      { label: "Buy new constantly", footprint: 3e3, color: "#f43f5e" },
      { label: "Mix of new and secondhand", footprint: 1200, color: "#f59e0b" },
      { label: "Secondhand / minimal", footprint: 300, color: "#10b981" }
    ]
  }
];
const ECOSYSTEM_SPECIES = [
  {
    name: "Grass",
    role: "Producer",
    population: 800,
    minViable: 100,
    maxViable: 1200,
    dependsOn: [],
    color: "#4ade80"
  },
  {
    name: "Rabbit",
    role: "Herbivore",
    population: 200,
    minViable: 20,
    maxViable: 400,
    dependsOn: ["Grass"],
    color: "#a78bfa"
  },
  {
    name: "Fox",
    role: "Carnivore",
    population: 40,
    minViable: 5,
    maxViable: 80,
    dependsOn: ["Rabbit"],
    color: "#f97316"
  },
  {
    name: "Eagle",
    role: "Apex Predator",
    population: 15,
    minViable: 2,
    maxViable: 30,
    dependsOn: ["Rabbit", "Fox"],
    color: "#f59e0b"
  },
  {
    name: "Bacteria",
    role: "Decomposer",
    population: 600,
    minViable: 50,
    maxViable: 1e3,
    dependsOn: [],
    color: "#94a3b8"
  }
];
const ECO_EVENTS = [
  {
    species: "Rabbit",
    action: "add",
    effect: "Grass decreases faster, Fox population increases"
  },
  {
    species: "Fox",
    action: "remove",
    effect: "Rabbit population explodes, Grass collapses"
  },
  {
    species: "Eagle",
    action: "remove",
    effect: "Fox and Rabbit populations increase unchecked"
  },
  {
    species: "Grass",
    action: "remove",
    effect: "All herbivores and carnivores face population collapse"
  },
  {
    species: "Bacteria",
    action: "remove",
    effect: "Dead matter accumulates, nutrients cycle breaks"
  }
];
function EnvironmentalScience({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "carbon-calculator")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CarbonCalculator, { config, onGameEnd });
  if (gameId === "ecosystem-balance")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EcosystemBalance, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PlanetGuardian, { config, onGameEnd });
}
function PlanetGuardian({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [round, setRound] = reactExports.useState(0);
  const [meters, setMeters] = reactExports.useState({
    env: 60,
    eco: 60,
    health: 60
  });
  const [score, setScore] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(null);
  const [chosenName, setChosenName] = reactExports.useState("");
  const [disaster, setDisaster] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const TOTAL_ROUNDS = 10;
  const endGame = reactExports.useCallback(
    (completed, finalScore) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const s = finalScore ?? scoreRef.current;
      onGameEnd(
        buildResult(
          config,
          s,
          completed ? 80 : 40,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleChoice(d) {
    if (flash) return;
    setChosenName(d.name);
    setFlash("chosen");
    const nextMeters = {
      env: Math.min(100, Math.max(0, meters.env + d.env)),
      eco: Math.min(100, Math.max(0, meters.eco + d.eco)),
      health: Math.min(100, Math.max(0, meters.health + d.health))
    };
    const isDisasterRound = config.difficulty === 2 && round === 4 || config.difficulty === 3 && (round === 2 || round === 5 || round === 8);
    let activeDisaster = null;
    if (isDisasterRound) {
      activeDisaster = DISASTERS[round % DISASTERS.length];
      nextMeters.env = Math.min(
        100,
        Math.max(0, nextMeters.env + activeDisaster.env)
      );
      nextMeters.eco = Math.min(
        100,
        Math.max(0, nextMeters.eco + activeDisaster.eco)
      );
      nextMeters.health = Math.min(
        100,
        Math.max(0, nextMeters.health + activeDisaster.health)
      );
      setDisaster(activeDisaster);
    }
    setMeters(nextMeters);
    const anyZero = nextMeters.env <= 0 || nextMeters.eco <= 0 || nextMeters.health <= 0;
    const nextRound = round + 1;
    const done = nextRound >= TOTAL_ROUNDS;
    setTimeout(
      () => {
        setFlash(null);
        setDisaster(null);
        if (anyZero) {
          endGame(false);
          return;
        }
        if (done) {
          const finalScore = Math.round(
            (nextMeters.env + nextMeters.eco + nextMeters.health) * config.difficulty * 10
          );
          setScore(finalScore);
          scoreRef.current = finalScore;
          endGame(true, finalScore);
          return;
        }
        setRound(nextRound);
      },
      isDisasterRound ? 1800 : 900
    );
  }
  const currentRound = scaledRound(
    BASE_ROUNDS[round % BASE_ROUNDS.length],
    config.difficulty
  );
  const progressPct = timeLeft / config.timeLimit * 100;
  function meterColor(val) {
    return val > 55 ? "#10b981" : val > 30 ? "#f59e0b" : "#f43f5e";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "env_science.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Round ",
            Math.min(round + 1, TOTAL_ROUNDS),
            "/",
            TOTAL_ROUNDS
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
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
                Globe,
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
                  children: "Planet Manager"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Balance Environment, Economy, and Health across 10 policy rounds." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "If any meter hits zero the planet fails. Keep all three bars alive to win." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "env_science.start_button",
                  children: "Launch Simulation"
                }
              )
            ] })
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-4 border border-border/30 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: [
            {
              label: "Environment",
              style: {
                width: `${meters.env}%`,
                background: meterColor(meters.env)
              },
              val: meters.env
            },
            {
              label: "Economy",
              style: {
                width: `${meters.eco}%`,
                background: meterColor(meters.eco)
              },
              val: meters.eco
            },
            {
              label: "Health",
              style: {
                width: `${meters.health}%`,
                background: meterColor(meters.health)
              },
              val: meters.health
            }
          ].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs w-24 text-muted-foreground shrink-0", children: m.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-3 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: m.style
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs tabular-nums w-8 text-right",
                style: { color: meterColor(m.val) },
                children: m.val
              }
            )
          ] }, m.label)) }) }),
          disaster && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              className: "rounded-xl px-4 py-3 border-2 border-[#f43f5e] bg-[#f43f5e]/10 text-center shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#f43f5e]", children: disaster.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: disaster.desc })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-2 justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: "flex flex-col gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground text-center mb-1",
                    style: { fontFamily: "'Orbitron',sans-serif" },
                    children: "Choose Policy Action"
                  }
                ),
                currentRound.decisions.map((d, i) => {
                  const isChosen = flash === "chosen" && chosenName === d.name;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: `glass-card rounded-xl p-4 border-2 ${isChosen ? "border-[#00f5ff]" : "border-border/30"} text-left transition-all hover:border-[#00f5ff]/60 cursor-pointer`,
                      style: isChosen ? { boxShadow: "0 0 16px rgba(0,245,255,0.3)" } : {},
                      onClick: () => handleChoice(d),
                      "data-ocid": `env_science.decision.${i}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: d.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: d.desc })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 text-right shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "text-xs tabular-nums",
                              style: {
                                color: d.env >= 0 ? "#10b981" : "#f43f5e"
                              },
                              children: [
                                "ENV ",
                                d.env >= 0 ? "+" : "",
                                d.env
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "text-xs tabular-nums",
                              style: {
                                color: d.eco >= 0 ? "#f59e0b" : "#f43f5e"
                              },
                              children: [
                                "ECO ",
                                d.eco >= 0 ? "+" : "",
                                d.eco
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "text-xs tabular-nums",
                              style: {
                                color: d.health >= 0 ? "#06b6d4" : "#f43f5e"
                              },
                              children: [
                                "HP ",
                                d.health >= 0 ? "+" : "",
                                d.health
                              ]
                            }
                          )
                        ] })
                      ] })
                    },
                    d.name
                  );
                })
              ]
            },
            round
          ) }) })
        ] })
      ]
    }
  );
}
function CarbonCalculator({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [catIdx, setCatIdx] = reactExports.useState(0);
  const [selections, setSelections] = reactExports.useState({});
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [swapMode, setSwapMode] = reactExports.useState(false);
  const [totalFootprint, setTotalFootprint] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const currentCat = CARBON_CATEGORIES[catIdx % CARBON_CATEGORIES.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("choosing");
    startTimer();
  }
  function handleSelect(footprint) {
    setSelections((prev) => ({ ...prev, [currentCat.category]: footprint }));
    setTotal((t) => t + 1);
    const lowestOption = Math.min(
      ...currentCat.options.map((o) => o.footprint)
    );
    if (footprint === lowestOption) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    }
    const next = catIdx + 1;
    if (next >= CARBON_CATEGORIES.length) {
      const total_fp = Object.values({
        ...selections,
        [currentCat.category]: footprint
      }).reduce((s, v) => s + v, 0);
      setTotalFootprint(total_fp);
      setPhase("result");
    } else {
      setCatIdx(next);
    }
  }
  function handleSwap(cat, footprint) {
    const oldFp = selections[cat] ?? 0;
    const diff = oldFp - footprint;
    const pts = config.difficulty * Math.floor(diff / 100);
    if (pts > 0) setScore((s) => s + pts);
    setSelections((prev) => ({ ...prev, [cat]: footprint }));
    setTotalFootprint((prev) => prev - diff);
  }
  const MAX_FOOTPRINT = CARBON_CATEGORIES.reduce(
    (s, c) => s + Math.max(...c.options.map((o) => o.footprint)),
    0
  );
  const footprintPct = Math.min(100, totalFootprint / MAX_FOOTPRINT * 100);
  const footprintColor = footprintPct < 30 ? "#10b981" : footprintPct < 60 ? "#f59e0b" : "#f43f5e";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "carbon_calculator.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            catIdx + 1,
            "/",
            CARBON_CATEGORIES.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
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
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Globe,
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
                  children: "Carbon Calculator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Choose lifestyle options across 5 categories. See your carbon footprint. Then make swaps to reduce it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "carbon_calculator.start_button",
                  children: "Calculate Footprint"
                }
              )
            ] })
          }
        ),
        phase === "choosing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            className: "glass-card rounded-xl p-5 border border-border/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: [
                    "Category ",
                    catIdx + 1,
                    ": ",
                    currentCat.category
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Choose your typical lifestyle option for this category:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: currentCat.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "px-4 py-4 rounded-xl border-2 text-left transition-all",
                  style: {
                    borderColor: `${opt.color}60`,
                    background: `${opt.color}08`
                  },
                  onClick: () => handleSelect(opt.footprint),
                  "data-ocid": `carbon_calculator.option.${i}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: opt.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-xs font-mono",
                          style: { color: opt.color },
                          children: [
                            opt.footprint.toLocaleString(),
                            " kg CO2/yr"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full",
                        style: {
                          width: `${opt.footprint / 7200 * 100}%`,
                          background: opt.color
                        }
                      }
                    ) })
                  ]
                },
                opt.label
              )) })
            ]
          },
          catIdx
        ) }) }),
        phase === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex flex-col gap-3 overflow-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                    style: { fontFamily: "'Orbitron',sans-serif" },
                    children: "Your Carbon Footprint"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-2xl font-black mb-2",
                    style: { color: footprintColor },
                    children: [
                      totalFootprint.toLocaleString(),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal", children: "kg CO2/year" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 rounded-full bg-muted overflow-hidden mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-1000",
                    style: {
                      width: `${footprintPct}%`,
                      background: footprintColor
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: footprintPct < 30 ? "Excellent! Very low carbon lifestyle." : footprintPct < 60 ? "Moderate. Consider some swaps." : "High carbon footprint. Major changes recommended." })
              ] }),
              !swapMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "secondary",
                  size: "md",
                  onClick: () => setSwapMode(true),
                  "data-ocid": "carbon_calculator.swap_button",
                  children: "Make Swaps to Reduce Footprint"
                }
              ),
              swapMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click lower-footprint options to make swaps and earn bonus points:" }),
                CARBON_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-xl p-3 border border-border/30",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground mb-2", children: cat.category }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: cat.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                          style: selections[cat.category] === opt.footprint ? {
                            borderColor: opt.color,
                            background: `${opt.color}20`,
                            color: opt.color
                          } : {
                            borderColor: "rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.5)"
                          },
                          onClick: () => handleSwap(cat.category, opt.footprint),
                          children: opt.label
                        },
                        opt.label
                      )) })
                    ]
                  },
                  cat.category
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => endGame(true),
                  "data-ocid": "carbon_calculator.finish_button",
                  children: "Complete Assessment"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function EcosystemBalance({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [species, setSpecies] = reactExports.useState(
    () => ECOSYSTEM_SPECIES.map((s) => ({ ...s }))
  );
  const [year, setYear] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [log, setLog] = reactExports.useState([]);
  const [eventIdx, setEventIdx] = reactExports.useState(0);
  const [phase2Answer, setPhase2Answer] = reactExports.useState("");
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const progressPct = timeLeft / config.timeLimit * 100;
  const currentEvent = ECO_EVENTS[eventIdx % ECO_EVENTS.length];
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function simulateYear(eventToApply) {
    setSpecies((prev) => {
      const next = prev.map((s) => ({ ...s }));
      for (const sp of next) {
        if (sp.dependsOn.length === 0) {
          sp.population = Math.min(
            sp.maxViable,
            sp.population + Math.floor(sp.population * 0.1)
          );
        } else {
          const preyOk = sp.dependsOn.every((dep) => {
            const prey = next.find((s) => s.name === dep);
            return prey && prey.population >= prey.minViable;
          });
          if (preyOk) {
            sp.population = Math.min(
              sp.maxViable,
              sp.population + Math.floor(sp.population * 0.08)
            );
          } else {
            sp.population = Math.max(
              0,
              sp.population - Math.floor(sp.population * 0.2)
            );
          }
        }
        if (eventToApply) {
          if (sp.name === eventToApply.species) {
            if (eventToApply.action === "add")
              sp.population = Math.min(sp.maxViable, sp.population + 50);
            else sp.population = Math.max(0, sp.population - 50);
          }
        }
      }
      return next;
    });
  }
  function handleApplyEvent() {
    simulateYear(currentEvent);
    setLog((prev) => [
      ...prev,
      `Year ${year + 1}: ${currentEvent.species} ${currentEvent.action === "add" ? "added" : "removed"} — ${currentEvent.effect}`
    ]);
    setYear((y) => y + 1);
    setEventIdx((i) => i + 1);
    const allViable = species.every((s) => s.population >= s.minViable);
    if (!allViable) {
      setScore((s) => s - 200);
    } else {
      const pts = config.difficulty * 100;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    }
    setTotal((t) => t + 1);
    if (year + 1 >= 5) endGame(true);
  }
  function handlePredictEffect(prediction) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    currentEvent.effect.toLowerCase();
    const isCorrect = prediction.toLowerCase().includes(currentEvent.species.toLowerCase());
    if (isCorrect) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct prediction! ${currentEvent.effect}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${currentEvent.effect}`);
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      handleApplyEvent();
    }, 1500);
  }
  const predictionOptions = [
    `${currentEvent.species} population changes, affecting dependent species`,
    "No significant impact on the ecosystem",
    "Only decomposers are affected",
    "All species populations stay the same"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "ecosystem_balance.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#22c55e" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Year ",
            year,
            "/5"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: { color: "#f43f5e", fill: "#f43f5e" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
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
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Globe,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#22c55e" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#22c55e",
                    textShadow: "0 0 20px rgba(34,197,94,0.6)"
                  },
                  children: "Ecosystem Balance"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Predict the cascade effects when species are added or removed. Apply events over 5 years and keep all populations viable." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "ecosystem_balance.start_button",
                  children: "Begin Simulation"
                }
              )
            ] })
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Current Populations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: species.map((sp) => {
              const pct = Math.min(100, sp.population / sp.maxViable * 100);
              const healthy = sp.population >= sp.minViable;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs w-20 shrink-0",
                    style: { color: sp.color },
                    children: sp.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-500",
                    style: {
                      width: `${pct}%`,
                      background: healthy ? sp.color : "#f43f5e"
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs tabular-nums w-8",
                    style: { color: healthy ? sp.color : "#f43f5e" },
                    children: sp.population
                  }
                )
              ] }, sp.name);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: [
                  "Year ",
                  year + 1,
                  " Event"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground mb-3", children: [
                  "A",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#22c55e" }, children: currentEvent.species }),
                  " ",
                  "will be",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        color: currentEvent.action === "add" ? "#10b981" : "#f43f5e"
                      },
                      children: currentEvent.action === "add" ? "introduced" : "removed"
                    }
                  ),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Predict the cascading effect:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: predictionOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-left px-4 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#22c55e] hover:text-[#22c55e] transition-all",
                    onClick: () => handlePredictEffect(opt),
                    "data-ocid": `ecosystem_balance.prediction.${i}`,
                    children: opt
                  },
                  `pred-${i}`
                )) })
              ]
            },
            eventIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-xl px-4 py-3 text-sm ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: feedbackMsg
            }
          )
        ] })
      ]
    }
  );
}
export {
  EnvironmentalScience as default
};
