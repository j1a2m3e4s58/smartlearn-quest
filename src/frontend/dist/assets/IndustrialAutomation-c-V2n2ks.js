import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M16 16h.01", key: "1f9h7w" }],
  [
    "path",
    {
      d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z",
      key: "1iv0i2"
    }
  ],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const Factory = createLucideIcon("factory", __iconNode);
const FACTORY_CHALLENGES = {
  1: [
    {
      title: "Car Assembly Line",
      description: "Activate stations in the correct order to assemble a vehicle. Wrong order causes a jam.",
      stations: [
        {
          id: 1,
          label: "Chassis Weld",
          operation: "Weld frame components",
          color: "#00f5ff"
        },
        {
          id: 2,
          label: "Engine Mount",
          operation: "Install engine block",
          color: "#7c3aed"
        },
        {
          id: 3,
          label: "Electrical",
          operation: "Wire electronics",
          color: "#f59e0b"
        },
        {
          id: 4,
          label: "Body Panel",
          operation: "Attach body panels",
          color: "#10b981"
        },
        {
          id: 5,
          label: "Final QC",
          operation: "Quality inspection",
          color: "#f43f5e"
        }
      ],
      correctSequence: [1, 2, 3, 4, 5],
      explanation: "Chassis first, then engine, then electrical (needs engine mount), then body panels, finally QC."
    }
  ],
  2: [
    {
      title: "Electronics PCB Line",
      description: "PCB manufacturing requires precise station order. Solder before placing components = defects.",
      stations: [
        {
          id: 1,
          label: "Bare Board Prep",
          operation: "Clean and inspect PCB",
          color: "#00f5ff"
        },
        {
          id: 2,
          label: "Solder Paste",
          operation: "Apply solder paste via stencil",
          color: "#f59e0b"
        },
        {
          id: 3,
          label: "Component Place",
          operation: "SMT pick and place",
          color: "#7c3aed"
        },
        {
          id: 4,
          label: "Reflow Oven",
          operation: "Melt solder at 260C",
          color: "#f43f5e"
        },
        {
          id: 5,
          label: "AOI Inspection",
          operation: "Automated optical check",
          color: "#10b981"
        }
      ],
      correctSequence: [1, 2, 3, 4, 5],
      hasQualityGate: true,
      qualityGateStation: 5,
      explanation: "Clean board, apply paste, place components, reflow (melt solder), AOI checks for defects."
    }
  ],
  3: [
    {
      title: "Smart Device Assembly",
      description: "Complex assembly with quality gates. Station 3 is a QC gate.",
      stations: [
        {
          id: 1,
          label: "Housing Mold",
          operation: "Injection mold casing",
          color: "#00f5ff"
        },
        {
          id: 2,
          label: "Battery Insert",
          operation: "Place and test battery",
          color: "#7c3aed"
        },
        {
          id: 3,
          label: "QC Gate 1",
          operation: "Electrical test — fail = reject",
          color: "#f43f5e"
        },
        {
          id: 4,
          label: "PCB Assembly",
          operation: "Install main board",
          color: "#f59e0b"
        },
        {
          id: 5,
          label: "Display Mount",
          operation: "Attach and calibrate screen",
          color: "#10b981"
        }
      ],
      correctSequence: [1, 2, 3, 4, 5],
      hasQualityGate: true,
      qualityGateStation: 3,
      explanation: "Housing then battery, then QC gate before expensive PCB, then display."
    }
  ]
};
const STATE_COLORS = {
  idle: "#374151",
  active: "#10b981",
  jammed: "#f43f5e",
  complete: "#00f5ff"
};
function FactoryControllerGame({
  config,
  onGameEnd
}) {
  const challenges = FACTORY_CHALLENGES[config.difficulty];
  const [challengeIdx, setChallengeIdx] = reactExports.useState(0);
  const challenge = challenges[challengeIdx];
  const [sequence, setSequence] = reactExports.useState([]);
  const [stationStates, setStationStates] = reactExports.useState(() => Object.fromEntries(challenge.stations.map((s) => [s.id, "idle"])));
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [simulating, setSimulating] = reactExports.useState(false);
  const [simResult, setSimResult] = reactExports.useState(null);
  const [jamStation, setJamStation] = reactExports.useState(null);
  const [productionRate, setProductionRate] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          correct / challenges.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, challenges.length]
  );
  function toggleStation(stationId) {
    if (simulating || simResult) return;
    setSequence(
      (prev) => prev.includes(stationId) ? prev.filter((s) => s !== stationId) : [...prev, stationId]
    );
  }
  function handleSimulate() {
    if (sequence.length !== challenge.stations.length || simulating) return;
    setSimulating(true);
    setSimResult(null);
    setJamStation(null);
    const states = Object.fromEntries(
      challenge.stations.map((s) => [s.id, "idle"])
    );
    setStationStates({ ...states });
    const isCorrect = sequence.every(
      (id, i) => id === challenge.correctSequence[i]
    );
    let delay = 0;
    let jamAt = null;
    for (let i = 0; i < sequence.length; i++) {
      const stId = sequence[i];
      const expected = challenge.correctSequence[i];
      const isWrong = stId !== expected;
      delay += 600;
      const capturedStId = stId;
      setTimeout(() => {
        setStationStates((prev) => ({
          ...prev,
          [capturedStId]: isWrong ? "jammed" : "active"
        }));
        if (isWrong && jamAt === null) {
          jamAt = i;
          setJamStation(capturedStId);
        }
      }, delay);
    }
    setTimeout(() => {
      setSimulating(false);
      if (isCorrect) {
        const rate = Math.floor(100 * config.difficulty);
        setProductionRate(rate);
        setSimResult("success");
        setScore((s) => s + 400 * config.difficulty);
        setCorrect((c) => c + 1);
        setStationStates(
          Object.fromEntries(challenge.stations.map((s) => [s.id, "complete"]))
        );
        setTimeout(() => {
          const next = challengeIdx + 1;
          if (next >= challenges.length) {
            endGame(true);
          } else {
            const nc = challenges[next];
            setChallengeIdx(next);
            setSequence([]);
            setStationStates(
              Object.fromEntries(nc.stations.map((s) => [s.id, "idle"]))
            );
            setSimResult(null);
            setJamStation(null);
            setProductionRate(0);
          }
        }, 2200);
      } else {
        setSimResult("jam");
        setTimeout(() => {
          setSequence([]);
          setSimResult(null);
          setJamStation(null);
          setStationStates(
            Object.fromEntries(challenge.stations.map((s) => [s.id, "idle"]))
          );
        }, 2500);
      }
    }, delay + 600);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "industrial_automation.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Factory,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#10b981" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#10b981" },
                  children: "Factory Floor Controller"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Click stations to build your activation sequence. Wrong order causes a production jam." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Simulate the line to test your sequence. Correct order = products completed. Quality gates reject defects before they advance." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "industrial_automation.start_button",
                  children: "Start Factory"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "industrial_automation.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Factory, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#10b981" },
              children: challenge.title
            }
          ),
          productionRate > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#10b981]", children: [
            "Rate: ",
            productionRate,
            " units/hr"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#10b981]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: challenge.description }),
          challenge.hasQualityGate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#f43f5e] mt-1", children: [
            "Station ",
            challenge.qualityGateStation,
            " is a QC gate."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative glass rounded-xl border border-border/30 p-4 overflow-hidden",
            "data-ocid": "industrial_automation.conveyor",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-y-1/2 left-0 right-0 h-1 rounded-full",
                    style: { backgroundColor: "#1e293b" }
                  }
                ),
                simResult === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "absolute inset-y-1/2 left-0 right-0 h-1 rounded-full",
                    style: {
                      backgroundColor: "#10b981",
                      boxShadow: "0 0 8px #10b981"
                    },
                    initial: { width: 0 },
                    animate: { width: "100%" },
                    transition: { duration: 1.5 }
                  }
                ),
                challenge.stations.map((station) => {
                  const seqPosition = sequence.indexOf(station.id);
                  const stateColor = STATE_COLORS[stationStates[station.id]];
                  const isJammed = jamStation === station.id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      type: "button",
                      whileHover: !simulating && !simResult ? { scale: 1.05 } : {},
                      whileTap: !simulating && !simResult ? { scale: 0.95 } : {},
                      onClick: () => toggleStation(station.id),
                      animate: isJammed ? { x: [-4, 4, -4, 4, 0] } : {},
                      transition: { duration: 0.4 },
                      className: "relative z-20 flex flex-col items-center gap-1 cursor-pointer",
                      style: { minWidth: "80px" },
                      "data-ocid": `industrial_automation.station.${station.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all",
                            style: {
                              borderColor: stateColor,
                              backgroundColor: `${stateColor}20`,
                              boxShadow: stationStates[station.id] !== "idle" ? `0 0 12px ${stateColor}` : "none"
                            },
                            children: [
                              stationStates[station.id] === "complete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                CircleCheckBig,
                                {
                                  className: "h-5 w-5",
                                  style: { color: stateColor }
                                }
                              ),
                              stationStates[station.id] === "jammed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                CircleX,
                                {
                                  className: "h-5 w-5",
                                  style: { color: stateColor }
                                }
                              ),
                              (stationStates[station.id] === "idle" || stationStates[station.id] === "active") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "text-lg font-black",
                                  style: {
                                    color: stateColor,
                                    fontFamily: "'Orbitron', sans-serif"
                                  },
                                  children: station.id
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs text-center font-bold",
                            style: { color: station.color, fontSize: "9px" },
                            children: station.label
                          }
                        ),
                        seqPosition !== -1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black",
                            style: { backgroundColor: "#7c3aed", color: "#fff" },
                            children: seqPosition + 1
                          }
                        )
                      ]
                    },
                    station.id
                  );
                })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "YOUR SEQUENCE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
            sequence.map((id, i) => {
              const st = challenge.stations.find((s) => s.id === id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1 rounded-lg border px-2 py-1 text-xs",
                  style: {
                    borderColor: `${(st == null ? void 0 : st.color) ?? "#374151"}60`,
                    color: st == null ? void 0 : st.color
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                      i + 1,
                      "."
                    ] }),
                    " ",
                    st == null ? void 0 : st.label
                  ]
                },
                `seq-${i}`
              );
            }),
            sequence.length < challenge.stations.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-border/40 px-2 py-1 text-xs text-muted-foreground", children: "Click station to add..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
          simResult === "jam" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "rounded-xl p-3 border border-[#f43f5e] bg-[#f43f5e]/10 shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#f43f5e] font-bold", children: "JAM DETECTED — Wrong order. Reset and re-sequence." })
            }
          ),
          simResult === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "rounded-xl p-3 border border-[#10b981] bg-[#10b981]/10 shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[#10b981] font-bold", children: [
                "PRODUCTION SUCCESSFUL — ",
                productionRate,
                " units/hr.",
                " ",
                challenge.explanation
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSimulate,
            disabled: sequence.length !== challenge.stations.length || simulating || simResult !== null,
            "data-ocid": "industrial_automation.simulate_button",
            children: "Run Production Line"
          }
        ) })
      ]
    }
  );
}
const QC_SCENARIOS = {
  1: [
    {
      productName: "Steel Rod",
      unit: "mm",
      nominal: 100,
      tolerancePlus: 0.5,
      toleranceMinus: 0.5,
      products: [
        { id: 1, measurement: 100.2, correct: "pass" },
        { id: 2, measurement: 100.6, correct: "fail" },
        { id: 3, measurement: 99.7, correct: "pass" },
        { id: 4, measurement: 99.4, correct: "fail" },
        { id: 5, measurement: 100.45, correct: "marginal" },
        { id: 6, measurement: 100, correct: "pass" },
        { id: 7, measurement: 101, correct: "fail" },
        { id: 8, measurement: 99.55, correct: "marginal" }
      ]
    }
  ],
  2: [
    {
      productName: "Aluminum Shaft",
      unit: "mm",
      nominal: 50,
      tolerancePlus: 0.2,
      toleranceMinus: 0.2,
      products: [
        { id: 1, measurement: 50.15, correct: "marginal" },
        { id: 2, measurement: 50.25, correct: "fail" },
        { id: 3, measurement: 49.85, correct: "marginal" },
        { id: 4, measurement: 50, correct: "pass" },
        { id: 5, measurement: 49.7, correct: "fail" },
        { id: 6, measurement: 50.1, correct: "pass" },
        { id: 7, measurement: 50.22, correct: "fail" },
        { id: 8, measurement: 49.95, correct: "pass" }
      ]
    },
    {
      productName: "Plastic Gear",
      unit: "mm",
      nominal: 30,
      tolerancePlus: 0.3,
      toleranceMinus: 0.3,
      products: [
        { id: 1, measurement: 30.2, correct: "pass" },
        { id: 2, measurement: 30.35, correct: "fail" },
        { id: 3, measurement: 29.8, correct: "pass" },
        { id: 4, measurement: 29.65, correct: "fail" },
        { id: 5, measurement: 30.28, correct: "marginal" },
        { id: 6, measurement: 29.72, correct: "marginal" },
        { id: 7, measurement: 30, correct: "pass" },
        { id: 8, measurement: 30.4, correct: "fail" }
      ]
    }
  ],
  3: [
    {
      productName: "Precision Bearing",
      unit: "mm",
      nominal: 25,
      tolerancePlus: 0.05,
      toleranceMinus: 0.05,
      products: [
        { id: 1, measurement: 25.03, correct: "pass" },
        { id: 2, measurement: 25.06, correct: "fail" },
        { id: 3, measurement: 24.97, correct: "pass" },
        { id: 4, measurement: 24.94, correct: "fail" },
        { id: 5, measurement: 25.048, correct: "marginal" },
        { id: 6, measurement: 24.952, correct: "marginal" },
        { id: 7, measurement: 25.01, correct: "pass" },
        { id: 8, measurement: 25.07, correct: "fail" }
      ]
    },
    {
      productName: "Hydraulic Piston",
      unit: "mm",
      nominal: 75,
      tolerancePlus: 0.1,
      toleranceMinus: 0.1,
      products: [
        { id: 1, measurement: 75.05, correct: "pass" },
        { id: 2, measurement: 75.12, correct: "fail" },
        { id: 3, measurement: 74.93, correct: "pass" },
        { id: 4, measurement: 74.88, correct: "fail" },
        { id: 5, measurement: 75.09, correct: "marginal" },
        { id: 6, measurement: 74.92, correct: "marginal" },
        { id: 7, measurement: 75, correct: "pass" },
        { id: 8, measurement: 75.15, correct: "fail" }
      ]
    }
  ]
};
function QualityControlGame({
  config,
  onGameEnd
}) {
  const allScenarios = QC_SCENARIOS[config.difficulty];
  const [scenarioIdx, setScenarioIdx] = reactExports.useState(0);
  const scenario = allScenarios[scenarioIdx];
  const [verdicts, setVerdicts] = reactExports.useState(
    () => Object.fromEntries(scenario.products.map((p) => [p.id, null]))
  );
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [completedScenarios, setCompletedScenarios] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completedScenarios / allScenarios.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, completedScenarios, allScenarios.length]
  );
  function handleVerdict(productId, verdict) {
    if (submitted) return;
    setVerdicts((prev) => ({
      ...prev,
      [productId]: prev[productId] === verdict ? null : verdict
    }));
  }
  const allClassified = scenario.products.every((p) => verdicts[p.id] !== null);
  function handleSubmit() {
    if (!allClassified) return;
    let pts = 0;
    for (const product of scenario.products) {
      if (verdicts[product.id] === product.correct) {
        pts += 50;
      }
    }
    pts *= config.difficulty;
    const newScore = score + pts;
    setScore(newScore);
    scoreRef.current = newScore;
    setSubmitted(true);
    setTimeout(() => {
      const next = completedScenarios + 1;
      setCompletedScenarios(next);
      if (next >= allScenarios.length) {
        endGame(true);
      } else {
        const nextScenario = allScenarios[next];
        setScenarioIdx(next);
        setVerdicts(
          Object.fromEntries(nextScenario.products.map((p) => [p.id, null]))
        );
        setSubmitted(false);
      }
    }, 3500);
  }
  const defectCount = submitted ? scenario.products.filter((p) => verdicts[p.id] === "fail").length : 0;
  const defectRate = submitted ? (defectCount / scenario.products.length * 100).toFixed(1) : "0";
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "quality_control.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Factory,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Quality Control Inspector"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Inspect product measurements against tolerance specifications. Classify each as Pass, Fail, or Marginal." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Pass = within tolerance. Fail = exceeds tolerance. Marginal = within tolerance but near the limit (flags for re-inspection)." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "quality_control.start_button",
                  children: "Start Inspection"
                }
              )
            ]
          }
        )
      }
    );
  }
  const passLimit = scenario.nominal + scenario.tolerancePlus;
  const failLimit = scenario.nominal - scenario.toleranceMinus;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "quality_control.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Factory, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
              children: scenario.productName
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            completedScenarios + 1,
            "/",
            allScenarios.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#f59e0b]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold text-[#f59e0b] mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "TOLERANCE SPECIFICATION"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "Nominal:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#f59e0b]", children: [
              scenario.nominal,
              scenario.unit
            ] }),
            " ",
            "| Range:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#10b981]", children: [
              failLimit.toFixed(2),
              " – ",
              passLimit.toFixed(2),
              " ",
              scenario.unit
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Marginal = within ",
            (scenario.tolerancePlus * 0.15).toFixed(3),
            scenario.unit,
            " of limit | Fail = outside range"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex flex-col gap-2", children: scenario.products.map((product) => {
          const verdict = verdicts[product.id];
          const deviation = (product.measurement - scenario.nominal).toFixed(3);
          const isPos = product.measurement >= scenario.nominal;
          const showResult = submitted;
          const isCorrect = showResult && verdict === product.correct;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-xl p-3 border transition-all",
              style: {
                borderColor: showResult ? isCorrect ? "#10b981" : "#f43f5e" : verdict ? verdict === "pass" ? "#10b98140" : verdict === "fail" ? "#f43f5e40" : "#f59e0b40" : "#374151"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-xs font-bold text-muted-foreground",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: [
                        "PRODUCT #",
                        product.id
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-lg font-black tabular-nums",
                      style: {
                        color: Math.abs(product.measurement - scenario.nominal) <= scenario.tolerancePlus ? "#10b981" : "#f43f5e"
                      },
                      children: [
                        product.measurement.toFixed(3),
                        " ",
                        scenario.unit
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-xs",
                      style: { color: isPos ? "#f59e0b" : "#00f5ff" },
                      children: [
                        isPos ? "+" : "",
                        deviation
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["pass", "marginal", "fail"].map((v) => {
                  const vColors = {
                    pass: "#10b981",
                    marginal: "#f59e0b",
                    fail: "#f43f5e"
                  };
                  const isSelected = verdict === v;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleVerdict(product.id, v),
                      className: "flex-1 rounded-lg border-2 py-1.5 text-xs font-bold transition-all uppercase",
                      style: {
                        borderColor: isSelected ? vColors[v] : `${vColors[v]}30`,
                        backgroundColor: isSelected ? `${vColors[v]}20` : "transparent",
                        color: isSelected ? vColors[v] : "#6b7280"
                      },
                      disabled: submitted,
                      "data-ocid": `quality_control.product.${product.id}.${v}`,
                      children: v
                    },
                    v
                  );
                }) }),
                showResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs mt-1",
                    style: { color: isCorrect ? "#10b981" : "#f43f5e" },
                    children: isCorrect ? "Correct classification" : `Should be: ${product.correct.toUpperCase()} — deviation = ${deviation} (limit = +-${scenario.tolerancePlus})`
                  }
                )
              ]
            },
            product.id
          );
        }) }),
        submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#f59e0b]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold text-[#f59e0b] mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "INSPECTION SUMMARY"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "Defect Rate:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-bold",
                style: {
                  color: Number.parseFloat(defectRate) > 20 ? "#f43f5e" : "#10b981"
                },
                children: [
                  defectRate,
                  "%"
                ]
              }
            ),
            " ",
            "| ",
            defectCount,
            " of ",
            scenario.products.length,
            " products failed"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: Number.parseFloat(defectRate) > 25 ? "High defect rate. Process requires corrective action." : Number.parseFloat(defectRate) > 10 ? "Moderate defects. Process is borderline." : "Low defect rate. Process is under control." })
        ] }),
        !submitted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: !allClassified,
            "data-ocid": "quality_control.submit_button",
            children: "Submit Inspection"
          }
        ) })
      ]
    }
  );
}
const IMPROVEMENT_LABELS = {
  add_worker: "Add Worker to Bottleneck",
  split_station: "Split Station into 2 Parallel",
  reduce_setup: "Reduce Setup Time"
};
const FACTORY_LAYOUTS = {
  1: [
    {
      title: "Beverage Bottling Plant",
      stations: [
        { id: "A", label: "Wash Bottles", cycleTime: 10, color: "#00f5ff" },
        { id: "B", label: "Fill Liquid", cycleTime: 25, color: "#f43f5e" },
        { id: "C", label: "Cap & Seal", cycleTime: 15, color: "#f59e0b" },
        { id: "D", label: "Label Apply", cycleTime: 25, color: "#e879f9" },
        { id: "E", label: "Pack Crate", cycleTime: 12, color: "#10b981" }
      ],
      improvementOptions: [
        {
          id: "add_worker",
          label: "Add 2nd worker to Fill & Label (B+D)",
          description: "Additional worker halves cycle time at both bottlenecks",
          cycleDelta: -12,
          targetStation: "B"
        },
        {
          id: "split_station",
          label: "Split Station B into B1 and B2",
          description: "Two parallel fill stations each handle half the throughput",
          cycleDelta: -13,
          targetStation: "B"
        },
        {
          id: "reduce_setup",
          label: "Reduce fill changeover time by 4s",
          description: "Lean manufacturing technique reduces non-value time",
          cycleDelta: -4,
          targetStation: "B"
        }
      ],
      explanation: "Bottleneck = Station B and D (both 25s). Splitting B into 2 parallel reduces effective cycle to 12.5s and pushes bottleneck to C."
    }
  ],
  2: [
    {
      title: "Engine Component Line",
      stations: [
        { id: "A", label: "Raw Material Cut", cycleTime: 8, color: "#00f5ff" },
        { id: "B", label: "CNC Machining", cycleTime: 40, color: "#f43f5e" },
        { id: "C", label: "Heat Treatment", cycleTime: 20, color: "#f59e0b" },
        { id: "D", label: "Grinding", cycleTime: 18, color: "#7c3aed" },
        { id: "E", label: "Final Inspection", cycleTime: 10, color: "#10b981" }
      ],
      improvementOptions: [
        {
          id: "split_station",
          label: "Add 2nd CNC machine (parallel)",
          description: "Two CNC machines running in parallel halves effective cycle time",
          cycleDelta: -20,
          targetStation: "B"
        },
        {
          id: "add_worker",
          label: "Add CNC operator for faster setups",
          description: "Reduces CNC cycle from 40s to 28s",
          cycleDelta: -12,
          targetStation: "B"
        },
        {
          id: "reduce_setup",
          label: "Pre-program CNC fixtures",
          description: "Reduces CNC from 40s to 32s",
          cycleDelta: -8,
          targetStation: "B"
        }
      ],
      explanation: "Bottleneck = CNC at 40s. Adding a parallel CNC machine cuts effective time to 20s — system throughput doubles."
    }
  ],
  3: [
    {
      title: "Semiconductor Fab Line",
      stations: [
        { id: "A", label: "Wafer Clean", cycleTime: 15, color: "#00f5ff" },
        { id: "B", label: "Lithography", cycleTime: 60, color: "#f43f5e" },
        { id: "C", label: "Etch Chamber", cycleTime: 30, color: "#f59e0b" },
        { id: "D", label: "Deposition", cycleTime: 35, color: "#7c3aed" },
        { id: "E", label: "Die Test", cycleTime: 20, color: "#10b981" }
      ],
      improvementOptions: [
        {
          id: "split_station",
          label: "Add 2nd lithography tool",
          description: "Parallel lithography tools cut cycle to 30s",
          cycleDelta: -30,
          targetStation: "B"
        },
        {
          id: "add_worker",
          label: "Add lithography technician",
          description: "Reduces recipe load time, cutting cycle to 45s",
          cycleDelta: -15,
          targetStation: "B"
        },
        {
          id: "reduce_setup",
          label: "Pre-align reticle sets",
          description: "Reduces litho cycle to 50s",
          cycleDelta: -10,
          targetStation: "B"
        }
      ],
      explanation: "Lithography is the dominant bottleneck at 60s. A 2nd tool brings effective cycle to 30s — near line balance."
    },
    {
      title: "Automotive Weld Shop",
      stations: [
        { id: "A", label: "Part Fixture", cycleTime: 12, color: "#00f5ff" },
        { id: "B", label: "Spot Weld", cycleTime: 22, color: "#f59e0b" },
        { id: "C", label: "MIG Weld", cycleTime: 35, color: "#f43f5e" },
        { id: "D", label: "Grind & Dress", cycleTime: 18, color: "#7c3aed" },
        { id: "E", label: "Paint & Cure", cycleTime: 28, color: "#10b981" }
      ],
      improvementOptions: [
        {
          id: "split_station",
          label: "Add robotic MIG welding arm",
          description: "Robot reduces MIG cycle to 17s",
          cycleDelta: -18,
          targetStation: "C"
        },
        {
          id: "add_worker",
          label: "Add second MIG welder",
          description: "Two welders working in parallel, cycle drops to 18s",
          cycleDelta: -17,
          targetStation: "C"
        },
        {
          id: "reduce_setup",
          label: "Pre-stage weld fixtures",
          description: "Reduces MIG cycle to 28s",
          cycleDelta: -7,
          targetStation: "C"
        }
      ],
      explanation: "MIG Weld bottleneck at 35s. Adding a robot arm reduces cycle to 17s — throughput increases by 105%."
    }
  ]
};
function ProcessOptimizerGame({
  config,
  onGameEnd
}) {
  var _a, _b, _c;
  const allLayouts = FACTORY_LAYOUTS[config.difficulty];
  const [layoutIdx, setLayoutIdx] = reactExports.useState(0);
  const layout = allLayouts[layoutIdx];
  const [identifiedBottleneck, setIdentifiedBottleneck] = reactExports.useState(null);
  const [selectedImprovement, setSelectedImprovement] = reactExports.useState(null);
  const [phase, setPhase] = reactExports.useState(
    "identify"
  );
  const [score, setScore] = reactExports.useState(0);
  const [completedLayouts, setCompletedLayouts] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completedLayouts / allLayouts.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, completedLayouts, allLayouts.length]
  );
  const maxCycle = Math.max(...layout.stations.map((s) => s.cycleTime));
  const bottleneckStation = layout.stations.find(
    (s) => s.cycleTime === maxCycle
  );
  const currentThroughput = (3600 / maxCycle).toFixed(1);
  const targetOption = selectedImprovement ? layout.improvementOptions.find((o) => o.id === selectedImprovement) : null;
  const improvedCycle = targetOption ? maxCycle + targetOption.cycleDelta : maxCycle;
  const improvedThroughput = selectedImprovement ? (3600 / improvedCycle).toFixed(1) : currentThroughput;
  function handleBottleneckIdentify(stationId) {
    if (phase !== "identify") return;
    setIdentifiedBottleneck(stationId);
  }
  function handleConfirmBottleneck() {
    if (!identifiedBottleneck) return;
    const isCorrect = identifiedBottleneck === (bottleneckStation == null ? void 0 : bottleneckStation.id);
    if (isCorrect) {
      setScore((s) => s + 200 * config.difficulty);
      setPhase("improve");
    } else {
      setIdentifiedBottleneck(null);
    }
  }
  function handleApplyImprovement() {
    if (!selectedImprovement) return;
    layout.improvementOptions.find(
      (o) => o.id === selectedImprovement
    );
    const bestOpt = layout.improvementOptions.reduce(
      (a, b) => Math.abs(b.cycleDelta) > Math.abs(a.cycleDelta) ? b : a
    );
    const isBest = selectedImprovement === bestOpt.id;
    const pts = isBest ? 300 * config.difficulty : 150 * config.difficulty;
    setScore((s) => s + pts);
    scoreRef.current = scoreRef.current + pts;
    setPhase("result");
    setTimeout(() => {
      const next = completedLayouts + 1;
      setCompletedLayouts(next);
      if (next >= allLayouts.length) {
        endGame(true);
      } else {
        setLayoutIdx(next);
        setIdentifiedBottleneck(null);
        setSelectedImprovement(null);
        setPhase("identify");
      }
    }, 3e3);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "process_optimizer.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Factory,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#7c3aed" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
                  children: "Process Optimizer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Analyze factory production lines. Identify the bottleneck station (longest cycle time), then apply improvements to maximize throughput." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Throughput = 3600 / Bottleneck Cycle Time (units per hour). Eliminating the bottleneck is the highest leverage action in any production system." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "process_optimizer.start_button",
                  children: "Analyze Factory"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "process_optimizer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#7c3aed" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Factory, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
              children: layout.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            completedLayouts + 1,
            "/",
            allLayouts.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 shrink-0", children: ["identify", "improve", "result"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 rounded-lg py-1.5 text-xs font-bold text-center transition-all",
            style: {
              backgroundColor: phase === p ? "#7c3aed20" : "transparent",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: phase === p ? "#7c3aed" : "#374151",
              color: phase === p ? "#7c3aed" : "#6b7280",
              fontFamily: "'Orbitron', sans-serif"
            },
            children: p.toUpperCase()
          },
          p
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-3",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "CYCLE TIMES — CLICK BOTTLENECK"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2 h-24", children: layout.stations.map((station) => {
            const heightPct = station.cycleTime / maxCycle * 100;
            const isBottleneck = station.cycleTime === maxCycle;
            const isIdentified = identifiedBottleneck === station.id;
            const barStyle = {
              height: `${heightPct}%`,
              backgroundColor: isIdentified ? station.color : `${station.color}50`,
              boxShadow: isBottleneck && phase === "result" ? `0 0 10px ${station.color}` : "none"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => phase === "identify" && handleBottleneckIdentify(station.id),
                className: "flex-1 flex flex-col items-center gap-1 cursor-pointer",
                "data-ocid": `process_optimizer.station.${station.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-xs font-bold",
                      style: { color: isBottleneck ? station.color : "#6b7280" },
                      children: [
                        station.cycleTime,
                        "s"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-full rounded-t transition-all",
                      style: barStyle
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs text-center font-bold",
                      style: { color: station.color, fontSize: "9px" },
                      children: station.label
                    }
                  )
                ]
              },
              station.id
            );
          }) })
        ] }),
        phase === "identify" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground mb-1",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "IDENTIFY BOTTLENECK"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
              "Current throughput:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#f59e0b]", children: [
                currentThroughput,
                " units/hr"
              ] })
            ] }),
            identifiedBottleneck && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-1", children: [
              "Selected:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-bold",
                  style: {
                    color: (_a = layout.stations.find(
                      (s) => s.id === identifiedBottleneck
                    )) == null ? void 0 : _a.color
                  },
                  children: [
                    (_b = layout.stations.find((s) => s.id === identifiedBottleneck)) == null ? void 0 : _b.label,
                    " ",
                    "(",
                    (_c = layout.stations.find((s) => s.id === identifiedBottleneck)) == null ? void 0 : _c.cycleTime,
                    "s)"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: handleConfirmBottleneck,
              disabled: !identifiedBottleneck,
              "data-ocid": "process_optimizer.confirm_bottleneck",
              children: "Confirm Bottleneck"
            }
          ) })
        ] }),
        phase === "improve" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "SELECT IMPROVEMENT STRATEGY"
              }
            ),
            layout.improvementOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                whileHover: { scale: 1.01 },
                whileTap: { scale: 0.99 },
                onClick: () => setSelectedImprovement(opt.id),
                className: "rounded-xl border-2 p-3 text-left transition-all",
                style: {
                  borderColor: selectedImprovement === opt.id ? "#7c3aed" : "#374151",
                  backgroundColor: selectedImprovement === opt.id ? "#7c3aed15" : "transparent"
                },
                "data-ocid": `process_optimizer.improvement.${opt.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold",
                      style: {
                        color: selectedImprovement === opt.id ? "#7c3aed" : "#94a3b8"
                      },
                      children: IMPROVEMENT_LABELS[opt.id]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: opt.description }),
                  selectedImprovement === opt.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs mt-1 font-bold",
                      style: { color: "#10b981" },
                      children: [
                        "New throughput estimate:",
                        " ",
                        (3600 / (maxCycle + opt.cycleDelta)).toFixed(1),
                        " units/hr"
                      ]
                    }
                  )
                ]
              },
              opt.id
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: handleApplyImprovement,
              disabled: !selectedImprovement,
              "data-ocid": "process_optimizer.apply_improvement",
              children: "Apply Improvement"
            }
          ) })
        ] }),
        phase === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-xl p-4 shrink-0 border border-[#10b981]/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-bold text-[#10b981] mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "OPTIMIZATION RESULT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Before" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-black text-[#f43f5e]", children: currentThroughput }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "units/hr" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-[#7c3aed] font-black text-2xl", children: "+" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "After" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-black text-[#10b981]", children: improvedThroughput }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "units/hr" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: layout.explanation })
            ]
          }
        )
      ]
    }
  );
}
function IndustrialAutomation({ config, onGameEnd }) {
  if (config.gameId === "quality-control")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(QualityControlGame, { config, onGameEnd });
  if (config.gameId === "process-optimizer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProcessOptimizerGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FactoryControllerGame, { config, onGameEnd });
}
export {
  IndustrialAutomation as default
};
