import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { S as Settings } from "./settings-PszpihEQ.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
const GEAR_TEETH = {
  small: 12,
  medium: 24,
  large: 48
};
const GEAR_RADIUS = {
  small: 20,
  medium: 40,
  large: 72
};
const GEAR_COLORS = {
  small: "#00f5ff",
  medium: "#7c3aed",
  large: "#f59e0b"
};
const GEAR_CHALLENGES = {
  1: [
    {
      title: "Simple Speed Reduction",
      description: "The driving gear spins at 200 RPM. Select one intermediate gear to reduce speed to 100 RPM.",
      driverSize: "small",
      driverRPM: 200,
      targetRPM: 100,
      targetDirection: "opposite",
      slots: ["output"],
      requiredSizes: ["medium"],
      explanation: "Small(12T) driving Medium(24T): ratio = 12/24 = 0.5. 200 x 0.5 = 100 RPM. Opposite direction."
    },
    {
      title: "Speed Increase",
      description: "Driver at 100 RPM. Select output gear to achieve 200 RPM (speed up).",
      driverSize: "medium",
      driverRPM: 100,
      targetRPM: 200,
      targetDirection: "opposite",
      slots: ["output"],
      requiredSizes: ["small"],
      explanation: "Medium(24T) driving Small(12T): ratio = 24/12 = 2. 100 x 2 = 200 RPM. Gear ratio > 1 = speed increase."
    }
  ],
  2: [
    {
      title: "Two-Stage Reduction",
      description: "Driver at 400 RPM. Use two intermediate gears to achieve 50 RPM output.",
      driverSize: "small",
      driverRPM: 400,
      targetRPM: 50,
      targetDirection: "same",
      slots: ["g1", "output"],
      requiredSizes: ["medium", "large"],
      explanation: "Small to Medium: 400x(12/24)=200 RPM. Medium to Large: 200x(24/48)=50 RPM. Even stages = same final direction."
    },
    {
      title: "High Torque System",
      description: "Driver at 300 RPM. Reduce to approximately 75 RPM for higher torque output.",
      driverSize: "small",
      driverRPM: 300,
      targetRPM: 75,
      targetDirection: "same",
      slots: ["g1", "output"],
      requiredSizes: ["medium", "large"],
      explanation: "Small to Medium: 300x(12/24)=150. Medium to Large: 150x(24/48)=75. Two stages = same direction."
    }
  ],
  3: [
    {
      title: "Three-Stage Gear Train",
      description: "Complex gear train. Driver 480 RPM, target output near 30 RPM.",
      driverSize: "small",
      driverRPM: 480,
      targetRPM: 30,
      targetDirection: "opposite",
      slots: ["g1", "g2", "output"],
      requiredSizes: ["small", "medium", "large"],
      explanation: "Three reductions: x(12/24)x(12/24)x(12/48) would overshoot. Correct: small(12)>medium(24)>large(48) gives 480x(12/24)x(24/48)=60 then try variants. Concept: odd stages = opposite direction."
    }
  ]
};
function computeOutputRPM(driverRPM, driverSize, slots) {
  let currentRPM = driverRPM;
  let prevSize = driverSize;
  for (const slot of slots) {
    if (!slot.size) return { rpm: 0, valid: false };
    const ratio = GEAR_TEETH[prevSize] / GEAR_TEETH[slot.size];
    currentRPM = currentRPM * ratio;
    prevSize = slot.size;
  }
  return { rpm: Math.round(currentRPM), valid: true };
}
function GearRatioLabGame({
  config,
  onGameEnd
}) {
  const challenges = GEAR_CHALLENGES[config.difficulty];
  const [challengeIdx, setChallengeIdx] = reactExports.useState(0);
  const challenge = challenges[challengeIdx];
  const [slots, setSlots] = reactExports.useState(
    challenge.slots.map((id, i) => ({ id, size: null, x: 50 + i * 25, y: 50 }))
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [submitResult, setSubmitResult] = reactExports.useState(null);
  const [animAngle, setAnimAngle] = reactExports.useState(0);
  const animRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (animRef.current) clearInterval(animRef.current);
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
  function startAnimation() {
    if (animRef.current) clearInterval(animRef.current);
    animRef.current = setInterval(() => setAnimAngle((a) => (a + 3) % 360), 33);
  }
  function handleSelectGear(slotId, size) {
    if (submitted) return;
    setSlots((prev) => prev.map((s) => s.id === slotId ? { ...s, size } : s));
    startAnimation();
  }
  function handleSubmit() {
    const { rpm, valid } = computeOutputRPM(
      challenge.driverRPM,
      challenge.driverSize,
      slots
    );
    if (!valid) return;
    setSubmitted(true);
    const isCorrect = Math.abs(rpm - challenge.targetRPM) <= 5;
    setSubmitResult(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 350 * config.difficulty);
      setCorrect((c) => c + 1);
      setTimeout(() => {
        const next = challengeIdx + 1;
        if (next >= challenges.length) {
          endGame(true);
        } else {
          const nextChallenge = challenges[next];
          setChallengeIdx(next);
          setSlots(
            nextChallenge.slots.map((id, i) => ({
              id,
              size: null,
              x: 50 + i * 25,
              y: 50
            }))
          );
          setSubmitted(false);
          setSubmitResult(null);
        }
      }, 2e3);
    } else {
      setTimeout(() => {
        setSlots((prev) => prev.map((s) => ({ ...s, size: null })));
        setSubmitted(false);
        setSubmitResult(null);
      }, 2e3);
    }
  }
  const allSlotsFilled = slots.every((s) => s.size !== null);
  const { rpm: previewRPM, valid: previewValid } = computeOutputRPM(
    challenge.driverRPM,
    challenge.driverSize,
    slots
  );
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "mechanical_engineering.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Settings,
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
                  children: "Machine Design Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Select gear sizes to build gear trains that achieve a target output speed. Formula: Output RPM = Input RPM x (Driver Teeth / Driven Teeth)." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Small = 12T, Medium = 24T, Large = 48T." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startAnimation();
                  },
                  "data-ocid": "mechanical_engineering.start_button",
                  children: "Start Design"
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
      "data-ocid": "mechanical_engineering.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
              children: challenge.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            challengeIdx + 1,
            "/",
            challenges.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#f59e0b]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: challenge.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Target:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#10b981]", children: [
              challenge.targetRPM,
              " RPM"
            ] }),
            " ",
            "| Direction:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#7c3aed]", children: [
              challenge.targetDirection,
              " as driver"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative flex-1 rounded-xl border border-border/30 glass overflow-hidden",
            "data-ocid": "mechanical_engineering.canvas",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  className: "absolute inset-0 w-full h-full",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "10%",
                        y1: "50%",
                        x2: "90%",
                        y2: "50%",
                        stroke: "#374151",
                        strokeWidth: "2",
                        strokeDasharray: "6,3"
                      }
                    ),
                    (() => {
                      const cx = 15;
                      const cy = 50;
                      const r = GEAR_RADIUS[challenge.driverSize];
                      const color = GEAR_COLORS[challenge.driverSize];
                      const teeth = GEAR_TEETH[challenge.driverSize];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "g",
                        {
                          style: {
                            transformOrigin: `${cx}% ${cy}%`,
                            transform: `rotate(${animAngle}deg)`
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: `${cx}%`,
                                cy: `${cy}%`,
                                r: r * 0.5,
                                fill: `${color}20`,
                                stroke: color,
                                strokeWidth: "2"
                              }
                            ),
                            Array.from({ length: teeth }).map((_, t) => {
                              const angle = t / teeth * Math.PI * 2;
                              const rx = Math.cos(angle);
                              const ry = Math.sin(angle);
                              const tx = (r * 0.5 * rx - 3).toFixed(1);
                              const ty = (r * 0.5 * ry - 3).toFixed(1);
                              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "rect",
                                {
                                  x: `calc(${cx}% + ${tx}px)`,
                                  y: `calc(${cy}% + ${ty}px)`,
                                  width: "6",
                                  height: "6",
                                  rx: "1",
                                  fill: color,
                                  opacity: "0.8",
                                  style: {
                                    transform: `rotate(${t / teeth * 360}deg)`,
                                    transformOrigin: `${cx}% ${cy}%`
                                  }
                                },
                                t
                              );
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "text",
                              {
                                x: `${cx}%`,
                                y: `${cy}%`,
                                textAnchor: "middle",
                                dominantBaseline: "middle",
                                fill: color,
                                fontSize: "10",
                                fontFamily: "Orbitron",
                                children: [
                                  challenge.driverRPM,
                                  "rpm"
                                ]
                              }
                            )
                          ]
                        },
                        "driver"
                      );
                    })(),
                    slots.map((slot, si) => {
                      const cx = 35 + si * 20;
                      const cy = 50;
                      if (!slot.size) {
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "circle",
                            {
                              cx: `${cx}%`,
                              cy: `${cy}%`,
                              r: "22",
                              fill: "none",
                              stroke: "#374151",
                              strokeWidth: "2",
                              strokeDasharray: "4,4"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "text",
                            {
                              x: `${cx}%`,
                              y: `${cy}%`,
                              textAnchor: "middle",
                              dominantBaseline: "middle",
                              fill: "#6b7280",
                              fontSize: "9",
                              fontFamily: "Orbitron",
                              children: "EMPTY"
                            }
                          )
                        ] }, slot.id);
                      }
                      const r = GEAR_RADIUS[slot.size];
                      const color = GEAR_COLORS[slot.size];
                      const direction = si % 2 === 0 ? -1 : 1;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "g",
                        {
                          style: {
                            transformOrigin: `${cx}% ${cy}%`,
                            transform: `rotate(${animAngle * direction}deg)`
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: `${cx}%`,
                                cy: `${cy}%`,
                                r: r * 0.5,
                                fill: `${color}20`,
                                stroke: color,
                                strokeWidth: "2"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "text",
                              {
                                x: `${cx}%`,
                                y: `${cy}%`,
                                textAnchor: "middle",
                                dominantBaseline: "middle",
                                fill: color,
                                fontSize: "9",
                                fontFamily: "Orbitron",
                                children: [
                                  GEAR_TEETH[slot.size],
                                  "T"
                                ]
                              }
                            )
                          ]
                        },
                        slot.id
                      );
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "88%",
                          cy: "50%",
                          r: "16",
                          fill: submitResult === true ? "#10b98120" : submitResult === false ? "#f43f5e20" : "#374151",
                          stroke: submitResult === true ? "#10b981" : submitResult === false ? "#f43f5e" : "#374151",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "88%",
                          y: "50%",
                          textAnchor: "middle",
                          dominantBaseline: "middle",
                          fill: submitResult === true ? "#10b981" : "#6b7280",
                          fontSize: "8",
                          fontFamily: "Orbitron",
                          children: previewValid ? `${previewRPM}` : "?"
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: submitResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: "absolute inset-0 flex items-center justify-center bg-background/80 z-20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    submitResult ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheckBig,
                      {
                        className: "h-16 w-16 text-[#10b981] mx-auto",
                        style: { filter: "drop-shadow(0 0 20px #10b981)" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleX,
                      {
                        className: "h-16 w-16 text-[#f43f5e] mx-auto",
                        style: { filter: "drop-shadow(0 0 20px #f43f5e)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: challenge.explanation })
                  ] })
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex flex-col gap-2", children: slots.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs w-16 text-muted-foreground",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: slot.id.toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["small", "medium", "large"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: () => handleSelectGear(slot.id, size),
              className: "rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-all",
              style: {
                borderColor: slot.size === size ? GEAR_COLORS[size] : `${GEAR_COLORS[size]}40`,
                backgroundColor: slot.size === size ? `${GEAR_COLORS[size]}20` : "transparent",
                color: GEAR_COLORS[size]
              },
              "data-ocid": `mechanical_engineering.gear_select.${slot.id}.${size}`,
              children: [
                size,
                " (",
                GEAR_TEETH[size],
                "T)"
              ]
            },
            size
          )) })
        ] }, slot.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "Preview:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold tabular-nums",
                style: {
                  color: previewValid && Math.abs(previewRPM - challenge.targetRPM) <= 5 ? "#10b981" : "#f59e0b"
                },
                children: previewValid ? `${previewRPM} RPM` : "--"
              }
            ),
            " ",
            "/ Target:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              challenge.targetRPM,
              " RPM"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: handleSubmit,
              disabled: !allSlotsFilled || submitted,
              "data-ocid": "mechanical_engineering.submit_button",
              children: "Test Gear Train"
            }
          )
        ] })
      ]
    }
  );
}
const FORMULA_LABELS = {
  load_over_effort: "MA = Load / Effort",
  effort_dist_over_load_dist: "MA = Effort Distance / Load Distance",
  radius_wheel_over_axle: "MA = Wheel Radius / Axle Radius",
  length_over_height: "MA = Length / Height"
};
const MACHINE_LABELS = {
  lever: "Lever (Class 1)",
  pulley: "Pulley System",
  inclined_plane: "Inclined Plane",
  wheel_axle: "Wheel and Axle"
};
const MACHINE_COLORS = {
  lever: "#00f5ff",
  pulley: "#f59e0b",
  inclined_plane: "#10b981",
  wheel_axle: "#e879f9"
};
const MACHINE_PROBLEMS = {
  1: [
    {
      id: "m1",
      machineType: "lever",
      label: "Class 1 Lever",
      effortForce: 20,
      loadForce: 60,
      effortDist: 150,
      loadDist: 50,
      correctFormula: "load_over_effort",
      correctMA: 3,
      formulaOptions: [
        "load_over_effort",
        "effort_dist_over_load_dist",
        "radius_wheel_over_axle",
        "length_over_height"
      ],
      explanation: "MA = Load/Effort = 60/20 = 3. A mechanical advantage of 3 means you lift 3x more than you push.",
      diagramDesc: "Fulcrum at center. Effort arm = 150cm on left. Load arm = 50cm on right. Load = 60N. Effort = 20N."
    },
    {
      id: "m2",
      machineType: "inclined_plane",
      label: "Loading Ramp",
      effortForce: 100,
      loadForce: 500,
      planeLength: 10,
      planeHeight: 2,
      correctFormula: "length_over_height",
      correctMA: 5,
      formulaOptions: [
        "length_over_height",
        "load_over_effort",
        "effort_dist_over_load_dist",
        "radius_wheel_over_axle"
      ],
      explanation: "MA = Length/Height = 10/2 = 5. A longer ramp reduces the force needed to lift the same load.",
      diagramDesc: "Ramp length = 10m. Ramp height = 2m. Load weight = 500N. Effort to push = 100N along slope."
    }
  ],
  2: [
    {
      id: "m3",
      machineType: "pulley",
      label: "Fixed + Movable Pulley",
      effortForce: 50,
      loadForce: 100,
      correctFormula: "load_over_effort",
      correctMA: 2,
      formulaOptions: [
        "load_over_effort",
        "effort_dist_over_load_dist",
        "radius_wheel_over_axle",
        "length_over_height"
      ],
      explanation: "MA = Load/Effort = 100/50 = 2. A movable pulley halves the effort needed to lift a load.",
      diagramDesc: "Fixed pulley at top (changes direction). Movable pulley attached to 100N load. Effort = 50N upward on rope."
    },
    {
      id: "m4",
      machineType: "wheel_axle",
      label: "Steering Wheel",
      effortForce: 10,
      loadForce: 0,
      wheelRadius: 30,
      axleRadius: 5,
      correctFormula: "radius_wheel_over_axle",
      correctMA: 6,
      formulaOptions: [
        "radius_wheel_over_axle",
        "load_over_effort",
        "length_over_height",
        "effort_dist_over_load_dist"
      ],
      explanation: "MA = Wheel Radius / Axle Radius = 30/5 = 6. The large wheel multiplies torque transmitted to the small axle.",
      diagramDesc: "Wheel radius = 30cm. Axle radius = 5cm. Effort applied at wheel rim. Load resists at axle."
    },
    {
      id: "m5",
      machineType: "lever",
      label: "Crowbar (Class 2)",
      effortForce: 40,
      loadForce: 200,
      effortDist: 100,
      loadDist: 20,
      correctFormula: "effort_dist_over_load_dist",
      correctMA: 5,
      formulaOptions: [
        "effort_dist_over_load_dist",
        "load_over_effort",
        "radius_wheel_over_axle",
        "length_over_height"
      ],
      explanation: "MA = Effort Distance / Load Distance = 100/20 = 5. Longer effort arm means less force needed.",
      diagramDesc: "Fulcrum at one end. Load = 200N at 20cm from fulcrum. Effort = 40N at 100cm from fulcrum."
    }
  ],
  3: [
    {
      id: "m6",
      machineType: "pulley",
      label: "Block and Tackle (4-rope)",
      effortForce: 25,
      loadForce: 100,
      correctFormula: "load_over_effort",
      correctMA: 4,
      formulaOptions: [
        "load_over_effort",
        "effort_dist_over_load_dist",
        "radius_wheel_over_axle",
        "length_over_height"
      ],
      explanation: "MA = 100/25 = 4. Block and tackle with 4 rope sections supporting the load gives MA = 4.",
      diagramDesc: "4-rope block and tackle. Load = 100N. Effort = 25N. 4 rope sections support the movable block."
    },
    {
      id: "m7",
      machineType: "inclined_plane",
      label: "Screw Jack",
      effortForce: 30,
      loadForce: 600,
      planeLength: 20,
      planeHeight: 1,
      correctFormula: "length_over_height",
      correctMA: 20,
      formulaOptions: [
        "length_over_height",
        "load_over_effort",
        "radius_wheel_over_axle",
        "effort_dist_over_load_dist"
      ],
      explanation: "MA = L/H = 20/1 = 20. A screw is an inclined plane wrapped around a cylinder — very high MA.",
      diagramDesc: "Thread pitch = 1mm (height). Circumference = 20mm (length). Load = 600N. Effort = 30N at handle."
    },
    {
      id: "m8",
      machineType: "wheel_axle",
      label: "Winch System",
      effortForce: 50,
      loadForce: 0,
      wheelRadius: 40,
      axleRadius: 8,
      correctFormula: "radius_wheel_over_axle",
      correctMA: 5,
      formulaOptions: [
        "radius_wheel_over_axle",
        "effort_dist_over_load_dist",
        "load_over_effort",
        "length_over_height"
      ],
      explanation: "MA = 40/8 = 5. The winch handle (large radius) turns the drum (small axle) with 5x mechanical advantage.",
      diagramDesc: "Winch handle radius = 40cm. Drum axle radius = 8cm. Rope winds on drum to lift load."
    },
    {
      id: "m9",
      machineType: "lever",
      label: "Wheelbarrow (Class 2)",
      effortForce: 60,
      loadForce: 240,
      effortDist: 120,
      loadDist: 30,
      correctFormula: "effort_dist_over_load_dist",
      correctMA: 4,
      formulaOptions: [
        "effort_dist_over_load_dist",
        "load_over_effort",
        "length_over_height",
        "radius_wheel_over_axle"
      ],
      explanation: "MA = Effort Distance / Load Distance = 120/30 = 4. Wheelbarrow handles far from axle give 4x advantage.",
      diagramDesc: "Axle at wheel end. Load at 30cm from axle. Handles at 120cm from axle. Effort = 60N. Load = 240N."
    }
  ]
};
function ForceMachineGame({
  config,
  onGameEnd
}) {
  const problems = MACHINE_PROBLEMS[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [selectedFormula, setSelectedFormula] = reactExports.useState(
    null
  );
  const [selectedMA, setSelectedMA] = reactExports.useState(null);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
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
          correct / problems.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, problems.length]
  );
  const problem = problems[idx];
  const maOptions = Array.from(
    /* @__PURE__ */ new Set([
      problem.correctMA,
      problem.correctMA + 1,
      problem.correctMA - 1 > 0 ? problem.correctMA - 1 : problem.correctMA + 2,
      problem.correctMA * 2
    ])
  ).sort(() => Math.random() - 0.5).slice(0, 4);
  function handleSubmit() {
    if (!selectedFormula || selectedMA === null) return;
    const formulaOk = selectedFormula === problem.correctFormula;
    const maOk = selectedMA === problem.correctMA;
    const allOk = formulaOk && maOk;
    setResult(allOk);
    setSubmitted(true);
    if (allOk) {
      setScore((s) => s + 300 * config.difficulty);
      setCorrect((c) => c + 1);
      setTimeout(() => {
        const next = idx + 1;
        if (next >= problems.length) {
          endGame(true);
        } else {
          setIdx(next);
          setSelectedFormula(null);
          setSelectedMA(null);
          setSubmitted(false);
          setResult(null);
        }
      }, 2500);
    } else {
      setTimeout(() => {
        setSelectedFormula(null);
        setSelectedMA(null);
        setSubmitted(false);
        setResult(null);
      }, 2500);
    }
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "force_machine.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Settings,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#00f5ff" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
                  children: "Simple Machines Analyzer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Analyze lever, pulley, inclined plane, and wheel-and-axle diagrams. Select the correct formula and calculate the mechanical advantage." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Mechanical Advantage (MA) measures how much a machine multiplies force. Higher MA = less effort needed." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "force_machine.start_button",
                  children: "Analyze Machines"
                }
              )
            ]
          }
        )
      }
    );
  }
  const color = MACHINE_COLORS[problem.machineType];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "force_machine.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color },
              children: problem.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            idx + 1,
            "/",
            problems.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-4 shrink-0 border",
            style: { borderColor: `${color}40` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs font-bold mb-2",
                  style: { color, fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    MACHINE_LABELS[problem.machineType].toUpperCase(),
                    " DIAGRAM"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "relative h-28 rounded-lg overflow-hidden",
                  style: { backgroundColor: `${color}08` },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-full h-full", xmlns: "http://www.w3.org/2000/svg", children: [
                    problem.machineType === "lever" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "10%",
                          y1: "60%",
                          x2: "90%",
                          y2: "60%",
                          stroke: color,
                          strokeWidth: "4",
                          strokeLinecap: "round"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "polygon",
                        {
                          points: "50%,75% 46%,90% 54%,90%",
                          fill: color,
                          opacity: "0.7"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "20%",
                          y1: "60%",
                          x2: "20%",
                          y2: "25%",
                          stroke: "#f43f5e",
                          strokeWidth: "2",
                          strokeDasharray: "4,2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "20%",
                          y: "20%",
                          textAnchor: "middle",
                          fill: "#f43f5e",
                          fontSize: "10",
                          fontFamily: "Orbitron",
                          children: [
                            "E=",
                            problem.effortForce,
                            "N"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "80%",
                          y1: "60%",
                          x2: "80%",
                          y2: "25%",
                          stroke: "#f59e0b",
                          strokeWidth: "2",
                          strokeDasharray: "4,2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "80%",
                          y: "20%",
                          textAnchor: "middle",
                          fill: "#f59e0b",
                          fontSize: "10",
                          fontFamily: "Orbitron",
                          children: [
                            "L=",
                            problem.loadForce,
                            "N"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "30%",
                          y: "85%",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            problem.effortDist,
                            "cm"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "60%",
                          y: "85%",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            problem.loadDist,
                            "cm"
                          ]
                        }
                      )
                    ] }),
                    problem.machineType === "pulley" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "50%",
                          cy: "20%",
                          r: "14",
                          fill: "none",
                          stroke: color,
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "50%",
                          cy: "55%",
                          r: "14",
                          fill: "none",
                          stroke: color,
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "36%",
                          y1: "20%",
                          x2: "36%",
                          y2: "85%",
                          stroke: "#f43f5e",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "64%",
                          y1: "20%",
                          x2: "64%",
                          y2: "85%",
                          stroke: "#f59e0b",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "42%",
                          y: "68%",
                          width: "16%",
                          height: "20%",
                          fill: "#f59e0b30",
                          stroke: "#f59e0b",
                          strokeWidth: "1"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "36%",
                          y: "92%",
                          textAnchor: "middle",
                          fill: "#f43f5e",
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "E=",
                            problem.effortForce,
                            "N"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "64%",
                          y: "92%",
                          textAnchor: "middle",
                          fill: "#f59e0b",
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "L=",
                            problem.loadForce,
                            "N"
                          ]
                        }
                      )
                    ] }),
                    problem.machineType === "inclined_plane" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "polygon",
                        {
                          points: "5%,85% 95%,85% 95%,20%",
                          fill: `${color}15`,
                          stroke: color,
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "50%",
                          y: "75%",
                          textAnchor: "middle",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "L=",
                            problem.planeLength,
                            "m"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "90%",
                          y: "52%",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "H=",
                            problem.planeHeight,
                            "m"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "40%",
                          y: "52%",
                          width: "12%",
                          height: "10%",
                          fill: "#f59e0b30",
                          stroke: "#f59e0b",
                          strokeWidth: "1"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "30%",
                          y: "42%",
                          fill: "#f43f5e",
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "E=",
                            problem.effortForce,
                            "N"
                          ]
                        }
                      )
                    ] }),
                    problem.machineType === "wheel_axle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "50%",
                          cy: "50%",
                          r: "38",
                          fill: "none",
                          stroke: color,
                          strokeWidth: "2",
                          opacity: "0.5"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "50%",
                          cy: "50%",
                          r: "14",
                          fill: `${color}20`,
                          stroke: color,
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "50%",
                          y1: "12%",
                          x2: "50%",
                          y2: "50%",
                          stroke: "#f43f5e",
                          strokeWidth: "2",
                          strokeDasharray: "4,2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "60%",
                          y: "15%",
                          fill: "#f43f5e",
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "R=",
                            problem.wheelRadius,
                            "cm"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "60%",
                          y: "50%",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: [
                            "r=",
                            problem.axleRadius,
                            "cm"
                          ]
                        }
                      )
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: problem.diagramDesc })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "SELECT CORRECT FORMULA"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: problem.formulaOptions.map((formula) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => !submitted && setSelectedFormula(formula),
              className: "rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all text-left",
              style: {
                borderColor: selectedFormula === formula ? color : `${color}30`,
                backgroundColor: selectedFormula === formula ? `${color}20` : "transparent",
                color: selectedFormula === formula ? color : "#94a3b8"
              },
              "data-ocid": `force_machine.formula.${formula}`,
              children: FORMULA_LABELS[formula]
            },
            formula
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "MECHANICAL ADVANTAGE VALUE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: maOptions.map((ma) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.04 },
              whileTap: { scale: 0.96 },
              onClick: () => !submitted && setSelectedMA(ma),
              className: "flex-1 rounded-xl border-2 py-3 text-sm font-black transition-all",
              style: {
                borderColor: selectedMA === ma ? color : `${color}30`,
                backgroundColor: selectedMA === ma ? `${color}20` : "transparent",
                color: selectedMA === ma ? color : "#94a3b8"
              },
              "data-ocid": `force_machine.ma.${ma}`,
              children: [
                "MA = ",
                ma
              ]
            },
            ma
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: result !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 flex items-start gap-2 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: [
              result ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e] shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: result ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: problem.explanation }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e]", children: "Incorrect. Check the diagram values and formula again." }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: !selectedFormula || selectedMA === null || submitted,
            "data-ocid": "force_machine.submit_button",
            children: "Calculate MA"
          }
        ) })
      ]
    }
  );
}
const BRIDGE_COLORS = {
  beam: "#00f5ff",
  arch: "#f59e0b",
  suspension: "#e879f9",
  truss: "#10b981"
};
const BRIDGE_LABELS = {
  beam: "Beam Bridge",
  arch: "Arch Bridge",
  suspension: "Suspension Bridge",
  truss: "Truss Bridge"
};
const BRIDGE_QUESTIONS = {
  1: [
    {
      id: "bq1",
      question: "Which bridge type uses triangles to distribute load across a rigid framework?",
      options: [
        "Beam Bridge",
        "Arch Bridge",
        "Truss Bridge",
        "Suspension Bridge"
      ],
      correctIdx: 2,
      bridgeType: "truss",
      explanation: "Truss bridges use triangular units because triangles are the only rigid polygon — they cannot deform under load."
    },
    {
      id: "bq2",
      question: "In a suspension bridge, where is the maximum TENSION force experienced?",
      options: [
        "In the concrete towers",
        "In the main cables connecting towers",
        "In the deck surface",
        "In the anchor points"
      ],
      correctIdx: 1,
      bridgeType: "suspension",
      explanation: "The main suspension cables carry maximum tension, stretching between towers. Cables excel in tension, not compression."
    },
    {
      id: "bq3",
      question: "Why does an arch bridge transfer load to its abutments?",
      options: [
        "The deck flexes downward",
        "The arch converts vertical load into horizontal thrust pushing outward",
        "Cables pull the arch downward",
        "The arch expands under compression"
      ],
      correctIdx: 1,
      bridgeType: "arch",
      explanation: "An arch converts vertical loads into outward horizontal thrust through its curved shape. The abutments resist this thrust."
    }
  ],
  2: [
    {
      id: "bq4",
      question: "A 100N load is placed at the center of a simple beam bridge 10m long supported at both ends. What is the reaction force at each support?",
      options: ["25N each", "50N each", "100N each", "75N and 25N"],
      correctIdx: 1,
      bridgeType: "beam",
      explanation: "By symmetry, each support carries half the load. Reaction = 100N / 2 = 50N each end."
    },
    {
      id: "bq5",
      question: "Which part of a truss bridge member experiences COMPRESSION when carrying a downward load?",
      options: [
        "Bottom chord (horizontal)",
        "Top chord (horizontal)",
        "Diagonal members only",
        "Vertical members only"
      ],
      correctIdx: 1,
      bridgeType: "truss",
      explanation: "The top chord of a truss is in compression under vertical loading, while the bottom chord is in tension."
    },
    {
      id: "bq6",
      question: "In a suspension bridge, the deck is hung from vertical cables called hangers. What force do the hangers experience?",
      options: ["Compression", "Tension", "Shear", "Torsion"],
      correctIdx: 1,
      bridgeType: "suspension",
      explanation: "Hanger cables are in pure tension — they stretch under the weight of the deck they support."
    },
    {
      id: "bq7",
      question: "Which bridge type is most efficient for very short spans (up to 20m) due to simplicity?",
      options: [
        "Truss Bridge",
        "Arch Bridge",
        "Beam Bridge",
        "Suspension Bridge"
      ],
      correctIdx: 2,
      bridgeType: "beam",
      explanation: "Beam bridges are simplest and most cost-effective for short spans. Complexity increases cost for longer spans."
    }
  ],
  3: [
    {
      id: "bq8",
      question: "A truss bridge has a 200N load applied at a single joint. There are 4 members meeting at that joint. What does a force balance require at the joint?",
      options: [
        "All members carry 50N",
        "The sum of vertical and horizontal force components must equal zero",
        "Members in compression carry more than in tension",
        "All forces point away from the joint"
      ],
      correctIdx: 1,
      bridgeType: "truss",
      explanation: "Joint equilibrium: sum of all horizontal forces = 0 AND sum of all vertical forces = 0. This is the method of joints."
    },
    {
      id: "bq9",
      question: "Why are suspension bridges preferred over beam bridges for very long spans (>500m)?",
      options: [
        "Suspension cables weigh less than beams at long spans",
        "Suspension bridges have higher compression in towers",
        "Beam bridges cannot span beyond 200m due to bending moment limits",
        "Only suspension bridges have abutments"
      ],
      correctIdx: 0,
      bridgeType: "suspension",
      explanation: "High-strength steel cables are far lighter and more material-efficient than the massive beams needed for equivalent long spans."
    },
    {
      id: "bq10",
      question: "An arch bridge has a horizontal thrust of 500kN at its abutments. The arch rises 8m and spans 40m. What structural feature resists this outward thrust?",
      options: [
        "The deck surface friction",
        "Massive concrete abutments embedded in rock",
        "The suspension cables",
        "Truss members at the arch base"
      ],
      correctIdx: 1,
      bridgeType: "arch",
      explanation: "Arch abutments must be anchored into solid rock or massive concrete to resist the horizontal thrust without sliding outward."
    }
  ]
};
function BridgeBuilderGame({
  config,
  onGameEnd
}) {
  const questions = BRIDGE_QUESTIONS[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [selectedOption, setSelectedOption] = reactExports.useState(null);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
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
          correct / questions.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, questions.length]
  );
  const q = questions[idx];
  function handleSubmit() {
    if (selectedOption === null) return;
    const ok = selectedOption === q.correctIdx;
    setResult(ok);
    setSubmitted(true);
    if (ok) {
      setScore((s) => s + 280 * config.difficulty);
      setCorrect((c) => c + 1);
    }
    setTimeout(() => {
      const next = idx + 1;
      if (next >= questions.length) {
        endGame(true);
      } else {
        setIdx(next);
        setSelectedOption(null);
        setSubmitted(false);
        setResult(null);
      }
    }, 2500);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "bridge_builder.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Settings,
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
                  children: "Structural Analysis"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Analyze four bridge types — Beam, Arch, Suspension, and Truss. Answer structural engineering questions based on force principles." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Each question tests real structural concepts: compression, tension, load distribution, reaction forces, and design principles." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mb-6", children: ["beam", "arch", "suspension", "truss"].map(
                (bt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-lg border p-2 text-xs text-center font-bold",
                    style: {
                      borderColor: `${BRIDGE_COLORS[bt]}40`,
                      color: BRIDGE_COLORS[bt]
                    },
                    children: BRIDGE_LABELS[bt]
                  },
                  bt
                )
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "bridge_builder.start_button",
                  children: "Start Analysis"
                }
              )
            ]
          }
        )
      }
    );
  }
  const color = BRIDGE_COLORS[q.bridgeType];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "bridge_builder.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color },
              children: BRIDGE_LABELS[q.bridgeType]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            idx + 1,
            "/",
            questions.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-3 shrink-0 border",
            style: { borderColor: `${color}40` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs font-bold mb-2",
                  style: { color, fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    "BRIDGE DIAGRAM — ",
                    BRIDGE_LABELS[q.bridgeType].toUpperCase()
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-24 w-full rounded-lg overflow-hidden",
                  style: { backgroundColor: `${color}08` },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-full h-full", xmlns: "http://www.w3.org/2000/svg", children: [
                    q.bridgeType === "beam" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "5%",
                          y: "50%",
                          width: "90%",
                          height: "8%",
                          fill: `${color}30`,
                          stroke: color,
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "5%",
                          y: "58%",
                          width: "6%",
                          height: "25%",
                          fill: color,
                          opacity: "0.5"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "89%",
                          y: "58%",
                          width: "6%",
                          height: "25%",
                          fill: color,
                          opacity: "0.5"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "50%",
                          y1: "30%",
                          x2: "50%",
                          y2: "50%",
                          stroke: "#f43f5e",
                          strokeWidth: "2",
                          strokeDasharray: "4,2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "50%",
                          y: "25%",
                          textAnchor: "middle",
                          fill: "#f43f5e",
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: "Load"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "8%",
                          y: "92%",
                          fill: color,
                          fontSize: "8",
                          fontFamily: "Orbitron",
                          children: "R1"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "89%",
                          y: "92%",
                          fill: color,
                          fontSize: "8",
                          fontFamily: "Orbitron",
                          children: "R2"
                        }
                      )
                    ] }),
                    q.bridgeType === "arch" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M 5% 75% Q 50% 10% 95% 75%",
                          fill: "none",
                          stroke: color,
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "5%",
                          y1: "75%",
                          x2: "5%",
                          y2: "90%",
                          stroke: color,
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "95%",
                          y1: "75%",
                          x2: "95%",
                          y2: "90%",
                          stroke: color,
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "5%",
                          y1: "90%",
                          x2: "95%",
                          y2: "90%",
                          stroke: "#374151",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "50%",
                          y: "50%",
                          textAnchor: "middle",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: "Arch"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "2%",
                          y: "85%",
                          fill: "#f59e0b",
                          fontSize: "8",
                          fontFamily: "Orbitron",
                          children: "Thrust"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "85%",
                          y: "85%",
                          fill: "#f59e0b",
                          fontSize: "8",
                          fontFamily: "Orbitron",
                          children: "Thrust"
                        }
                      )
                    ] }),
                    q.bridgeType === "suspension" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "22%",
                          y: "15%",
                          width: "4%",
                          height: "70%",
                          fill: color,
                          opacity: "0.7"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "74%",
                          y: "15%",
                          width: "4%",
                          height: "70%",
                          fill: color,
                          opacity: "0.7"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M 5% 20% Q 50% 55% 95% 20%",
                          fill: "none",
                          stroke: color,
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: "5%",
                          y: "62%",
                          width: "90%",
                          height: "5%",
                          fill: "#374151",
                          stroke: color,
                          strokeWidth: "1"
                        }
                      ),
                      [30, 40, 50, 60, 70].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: `${x}%`,
                          y1: "37%",
                          x2: `${x}%`,
                          y2: "62%",
                          stroke: color,
                          strokeWidth: "1",
                          opacity: "0.6"
                        },
                        x
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "50%",
                          y: "75%",
                          textAnchor: "middle",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: "Deck"
                        }
                      )
                    ] }),
                    q.bridgeType === "truss" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "5%",
                          y1: "70%",
                          x2: "95%",
                          y2: "70%",
                          stroke: color,
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "5%",
                          y1: "25%",
                          x2: "95%",
                          y2: "25%",
                          stroke: color,
                          strokeWidth: "2",
                          opacity: "0.6"
                        }
                      ),
                      [5, 25, 45, 65, 85, 95].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: `${x}%`,
                          y1: "25%",
                          x2: `${x}%`,
                          y2: "70%",
                          stroke: color,
                          strokeWidth: "1.5",
                          opacity: "0.8"
                        },
                        x
                      )),
                      [5, 25, 45, 65, 85].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: `${x}%`,
                          y1: "70%",
                          x2: `${x + 20}%`,
                          y2: "25%",
                          stroke: "#f59e0b",
                          strokeWidth: "1.5",
                          opacity: "0.6"
                        },
                        `d-${x}`
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "50%",
                          y: "88%",
                          textAnchor: "middle",
                          fill: color,
                          fontSize: "9",
                          fontFamily: "Orbitron",
                          children: "Triangle units (rigid)"
                        }
                      )
                    ] })
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-4 shrink-0 border",
            style: { borderColor: `${color}30` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-bold mb-2",
                  style: { color, fontFamily: "'Orbitron', sans-serif" },
                  children: "STRUCTURAL ANALYSIS QUESTION"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: q.question })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 flex-1", children: q.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const showResult = submitted;
          const isCorrect = i === q.correctIdx;
          let borderC = isSelected ? color : `${color}25`;
          let bgC = isSelected ? `${color}15` : "transparent";
          let textC = isSelected ? color : "#94a3b8";
          if (showResult && isCorrect) {
            borderC = "#10b981";
            bgC = "#10b98115";
            textC = "#10b981";
          }
          if (showResult && isSelected && !isCorrect) {
            borderC = "#f43f5e";
            bgC = "#f43f5e15";
            textC = "#f43f5e";
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              whileHover: !submitted ? { scale: 1.01 } : {},
              whileTap: !submitted ? { scale: 0.99 } : {},
              onClick: () => !submitted && setSelectedOption(i),
              className: "rounded-xl border-2 px-4 py-3 text-sm font-bold text-left transition-all",
              style: {
                borderColor: borderC,
                backgroundColor: bgC,
                color: textC
              },
              "data-ocid": `bridge_builder.option.${i}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60 mr-2", children: [
                  String.fromCharCode(65 + i),
                  "."
                ] }),
                opt
              ]
            },
            i
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: result !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 flex items-start gap-2 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: [
              result ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e] shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: result ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: q.explanation }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f43f5e]", children: [
                "Incorrect. ",
                q.explanation
              ] }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: selectedOption === null || submitted,
            "data-ocid": "bridge_builder.submit_button",
            children: "Submit Answer"
          }
        ) })
      ]
    }
  );
}
function MechanicalEngineering({ config, onGameEnd }) {
  if (config.gameId === "force-machine")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ForceMachineGame, { config, onGameEnd });
  if (config.gameId === "bridge-builder")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BridgeBuilderGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GearRatioLabGame, { config, onGameEnd });
}
export {
  MechanicalEngineering as default
};
