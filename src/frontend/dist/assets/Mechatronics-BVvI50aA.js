import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { C as Cpu } from "./cpu-DjqPbGA_.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
const BLOCK_LABELS = {
  read_sensor: "READ sensor value",
  compare_threshold: "COMPARE to threshold",
  activate_motor: "ACTIVATE motor",
  wait_delay: "WAIT 10ms",
  stop_motor: "STOP motor"
};
const BLOCK_COLORS = {
  read_sensor: "#00f5ff",
  compare_threshold: "#7c3aed",
  activate_motor: "#10b981",
  wait_delay: "#f59e0b",
  stop_motor: "#f43f5e"
};
const WHEEL_LABELS = {
  rubber_track: "Rubber Tracks",
  mecanum: "Mecanum Wheels",
  differential: "Differential Drive"
};
const MOTOR_LABELS = {
  rear_drive: "Rear-Wheel Drive",
  front_drive: "Front-Wheel Drive",
  all_wheel: "All-Wheel Drive"
};
const INTEGRATION_CHALLENGES = {
  1: [
    {
      id: "c1",
      title: "Line-Following Robot",
      robotType: "Autonomous Navigator",
      description: "Build a robot that follows a black line on white surface using an IR sensor.",
      mechanical: {
        question: "Which wheel type allows smooth continuous motion on flat surfaces for line following?",
        correctWheel: "differential",
        correctMotor: "rear_drive",
        wheelOptions: ["rubber_track", "mecanum", "differential"],
        motorOptions: ["rear_drive", "front_drive", "all_wheel"]
      },
      electrical: {
        question: "Connect the IR line sensor correctly to the microcontroller.",
        components: [
          { id: "sensor", label: "IR Sensor", color: "#00f5ff" },
          { id: "controller", label: "Microcontroller", color: "#7c3aed" },
          { id: "motor_driver", label: "Motor Driver", color: "#10b981" }
        ],
        correctWiring: "correct",
        wiringOptions: [
          {
            id: "correct",
            label: "VCC to Sensor to Signal to MCU to GND",
            description: "Correct: Power, signal to MCU analog input, ground complete"
          },
          {
            id: "reversed",
            label: "GND to Sensor to Signal to MCU to VCC",
            description: "Wrong: Reversed power destroys sensor"
          },
          {
            id: "missing_ground",
            label: "VCC to Sensor to Signal to MCU (no GND)",
            description: "Wrong: Floating ground causes erratic readings"
          }
        ]
      },
      software: {
        question: "Arrange control blocks in the correct order for line-following logic.",
        correctSequence: [
          "read_sensor",
          "compare_threshold",
          "activate_motor",
          "wait_delay"
        ],
        availableBlocks: [
          "wait_delay",
          "activate_motor",
          "compare_threshold",
          "read_sensor",
          "stop_motor"
        ]
      },
      explanation: "Differential drive for steering, rear motors for push, correct IR wiring, then read to compare to act to wait loop."
    }
  ],
  2: [
    {
      id: "c2",
      title: "Obstacle Avoidance Robot",
      robotType: "Autonomous Explorer",
      description: "Design a robot that detects obstacles with ultrasonic sensor and avoids them.",
      mechanical: {
        question: "Which wheel configuration allows the robot to turn in place to avoid obstacles?",
        correctWheel: "mecanum",
        correctMotor: "all_wheel",
        wheelOptions: ["rubber_track", "mecanum", "differential"],
        motorOptions: ["rear_drive", "front_drive", "all_wheel"]
      },
      electrical: {
        question: "Wire the HC-SR04 ultrasonic sensor properly.",
        components: [
          { id: "ultrasonic", label: "HC-SR04 Sensor", color: "#00f5ff" },
          { id: "controller", label: "Arduino MCU", color: "#7c3aed" },
          { id: "motor_driver", label: "L298N Driver", color: "#10b981" }
        ],
        correctWiring: "correct",
        wiringOptions: [
          {
            id: "correct",
            label: "VCC(5V) Trig MCU Echo MCU GND",
            description: "Correct: Trig pin sends pulse, Echo pin receives return"
          },
          {
            id: "reversed",
            label: "Echo to Trig then Trig to Echo",
            description: "Wrong: Swapped pins — sensor won't trigger"
          },
          {
            id: "missing_ground",
            label: "VCC and Trig only",
            description: "Wrong: Missing Echo pin means no distance reading"
          }
        ]
      },
      software: {
        question: "What is the correct control loop order for obstacle avoidance?",
        correctSequence: [
          "read_sensor",
          "compare_threshold",
          "activate_motor",
          "wait_delay"
        ],
        availableBlocks: [
          "activate_motor",
          "stop_motor",
          "read_sensor",
          "compare_threshold",
          "wait_delay"
        ]
      },
      explanation: "Mecanum wheels for omnidirectional turns, all-wheel for power, correct HC-SR04 wiring, read to compare to react loop."
    }
  ],
  3: [
    {
      id: "c3",
      title: "Automated Sorting Robot",
      robotType: "Industrial Manipulator",
      description: "Build a robot arm system that detects object color and sorts into bins.",
      mechanical: {
        question: "For heavy industrial sorting with high precision, which drive and wheel combination is ideal?",
        correctWheel: "rubber_track",
        correctMotor: "all_wheel",
        wheelOptions: ["rubber_track", "mecanum", "differential"],
        motorOptions: ["rear_drive", "front_drive", "all_wheel"]
      },
      electrical: {
        question: "Wire the color sensor and servo motor controller correctly.",
        components: [
          {
            id: "color_sensor",
            label: "TCS3200 Color Sensor",
            color: "#00f5ff"
          },
          { id: "servo_ctrl", label: "PCA9685 Servo Driver", color: "#7c3aed" },
          { id: "controller", label: "Raspberry Pi", color: "#10b981" }
        ],
        correctWiring: "correct",
        wiringOptions: [
          {
            id: "correct",
            label: "I2C: SDA/SCL to Pi to PCA9685 to Servos",
            description: "Correct: I2C bus with pull-up resistors, proper servo power"
          },
          {
            id: "reversed",
            label: "Direct GPIO to Servo (no driver)",
            description: "Wrong: GPIO can't supply servo current — causes MCU damage"
          },
          {
            id: "missing_ground",
            label: "I2C without common ground",
            description: "Wrong: I2C requires common ground reference"
          }
        ]
      },
      software: {
        question: "Correct logic flow for color-based sorting?",
        correctSequence: [
          "read_sensor",
          "compare_threshold",
          "activate_motor",
          "wait_delay",
          "stop_motor"
        ],
        availableBlocks: [
          "stop_motor",
          "wait_delay",
          "compare_threshold",
          "read_sensor",
          "activate_motor"
        ]
      },
      explanation: "Rubber tracks for stability, all-wheel for power, I2C wiring for servo control, complete read to compare to act to wait to stop cycle."
    }
  ]
};
function SystemIntegrationGame({
  config,
  onGameEnd
}) {
  const challenges = INTEGRATION_CHALLENGES[config.difficulty];
  const [challengeIdx, setChallengeIdx] = reactExports.useState(0);
  const challenge = challenges[challengeIdx];
  const [phase, setPhase] = reactExports.useState("mechanical");
  const [selectedWheel, setSelectedWheel] = reactExports.useState(null);
  const [selectedMotor, setSelectedMotor] = reactExports.useState(
    null
  );
  const [selectedWiring, setSelectedWiring] = reactExports.useState(
    null
  );
  const [softwareBlocks, setSoftwareBlocks] = reactExports.useState([]);
  const [mechanicalResult, setMechanicalResult] = reactExports.useState(
    null
  );
  const [electricalResult, setElectricalResult] = reactExports.useState(
    null
  );
  const [softwareResult, setSoftwareResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [_systemTestPassed, setSystemTestPassed] = reactExports.useState(false);
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
  function handleMechanicalSubmit() {
    const ok = selectedWheel === challenge.mechanical.correctWheel && selectedMotor === challenge.mechanical.correctMotor;
    setMechanicalResult(ok);
    if (ok) {
      setScore((s) => s + 120 * config.difficulty);
      setTimeout(() => setPhase("electrical"), 1200);
    } else {
      setTimeout(() => {
        setMechanicalResult(null);
        setSelectedWheel(null);
        setSelectedMotor(null);
      }, 1500);
    }
  }
  function handleElectricalSubmit() {
    const ok = selectedWiring === challenge.electrical.correctWiring;
    setElectricalResult(ok);
    if (ok) {
      setScore((s) => s + 120 * config.difficulty);
      setTimeout(() => setPhase("software"), 1200);
    } else {
      setTimeout(() => {
        setElectricalResult(null);
        setSelectedWiring(null);
      }, 1500);
    }
  }
  function toggleSoftwareBlock(block) {
    setSoftwareBlocks(
      (prev) => prev.includes(block) ? prev.filter((b) => b !== block) : [...prev, block]
    );
  }
  function handleSoftwareSubmit() {
    const correct_seq = challenge.software.correctSequence;
    const ok = softwareBlocks.length === correct_seq.length && softwareBlocks.every((b, i) => b === correct_seq[i]);
    setSoftwareResult(ok);
    if (ok) {
      setScore((s) => s + 160 * config.difficulty);
      setSystemTestPassed(true);
      setCorrect((c) => c + 1);
      setTimeout(() => {
        const next = challengeIdx + 1;
        if (next >= challenges.length) {
          endGame(true);
        } else {
          setChallengeIdx(next);
          setPhase("mechanical");
          setSelectedWheel(null);
          setSelectedMotor(null);
          setSelectedWiring(null);
          setSoftwareBlocks([]);
          setMechanicalResult(null);
          setElectricalResult(null);
          setSoftwareResult(null);
          setSystemTestPassed(false);
        }
      }, 2400);
    } else {
      setTimeout(() => {
        setSoftwareResult(null);
        setSoftwareBlocks([]);
      }, 1800);
    }
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "mechatronics.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cpu,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#e879f9" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#e879f9" },
                  children: "System Integration Challenge"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Mechatronics = Mechanical + Electrical + Software. Configure all three domains correctly for each robot challenge." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "All three must be correct for the system test to pass." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "mechatronics.start_button",
                  children: "Begin Integration"
                }
              )
            ]
          }
        )
      }
    );
  }
  const phases = ["mechanical", "electrical", "software"];
  const phaseColors = {
    mechanical: "#f59e0b",
    electrical: "#00f5ff",
    software: "#10b981"
  };
  const phaseLabels = {
    mechanical: "MECHANICAL",
    electrical: "ELECTRICAL",
    software: "SOFTWARE"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "mechatronics.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#e879f9" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: phases.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-2 h-2 rounded-full",
                style: {
                  backgroundColor: p === phase ? phaseColors[p] : phases.indexOf(p) < phases.indexOf(phase) ? "#10b981" : "#374151"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs",
                style: {
                  color: p === phase ? phaseColors[p] : "#6b7280",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px"
                },
                children: phaseLabels[p]
              }
            )
          ] }, p)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            challengeIdx + 1,
            "/",
            challenges.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#e879f9]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold",
              style: { color: "#e879f9", fontFamily: "'Orbitron', sans-serif" },
              children: challenge.robotType
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
            challenge.title,
            ": ",
            challenge.description
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
          phase === "mechanical" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-xl p-3 shrink-0 border-l-4",
                    style: { borderLeftColor: "#f59e0b" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-bold text-[#f59e0b] mb-1",
                          style: { fontFamily: "'Orbitron', sans-serif" },
                          children: "MECHANICAL DOMAIN"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: challenge.mechanical.question })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-muted-foreground mb-2",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "WHEEL TYPE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: challenge.mechanical.wheelOptions.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.button,
                      {
                        type: "button",
                        whileHover: { scale: 1.03 },
                        whileTap: { scale: 0.97 },
                        onClick: () => setSelectedWheel(w),
                        className: "rounded-xl border-2 p-3 text-xs font-bold transition-all",
                        style: {
                          borderColor: selectedWheel === w ? "#f59e0b" : "#374151",
                          backgroundColor: selectedWheel === w ? "#f59e0b20" : "transparent",
                          color: selectedWheel === w ? "#f59e0b" : "#94a3b8"
                        },
                        "data-ocid": `mechatronics.wheel.${w}`,
                        children: WHEEL_LABELS[w]
                      },
                      w
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-muted-foreground mb-2",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "MOTOR PLACEMENT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: challenge.mechanical.motorOptions.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.button,
                      {
                        type: "button",
                        whileHover: { scale: 1.03 },
                        whileTap: { scale: 0.97 },
                        onClick: () => setSelectedMotor(m),
                        className: "rounded-xl border-2 p-3 text-xs font-bold transition-all",
                        style: {
                          borderColor: selectedMotor === m ? "#f59e0b" : "#374151",
                          backgroundColor: selectedMotor === m ? "#f59e0b20" : "transparent",
                          color: selectedMotor === m ? "#f59e0b" : "#94a3b8"
                        },
                        "data-ocid": `mechatronics.motor.${m}`,
                        children: MOTOR_LABELS[m]
                      },
                      m
                    )) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: mechanicalResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: `rounded-xl p-2 border text-sm flex items-center gap-2 shrink-0 ${mechanicalResult ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                    children: [
                      mechanicalResult ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0" }),
                      mechanicalResult ? "Mechanical design correct. Advancing to electrical." : "Incorrect combination. Review requirements and retry."
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleMechanicalSubmit,
                    disabled: !selectedWheel || !selectedMotor || mechanicalResult !== null,
                    "data-ocid": "mechatronics.mechanical_submit",
                    children: "Confirm Mechanical Design"
                  }
                )
              ]
            },
            "mechanical"
          ),
          phase === "electrical" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-xl p-3 shrink-0 border-l-4",
                    style: { borderLeftColor: "#00f5ff" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-bold text-[#00f5ff] mb-1",
                          style: { fontFamily: "'Orbitron', sans-serif" },
                          children: "ELECTRICAL DOMAIN"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: challenge.electrical.question })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 shrink-0", children: challenge.electrical.components.map((comp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex-1 rounded-xl border-2 p-3 text-xs text-center",
                    style: {
                      borderColor: `${comp.color}60`,
                      color: comp.color,
                      backgroundColor: `${comp.color}10`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center",
                          style: {
                            backgroundColor: `${comp.color}20`,
                            border: `2px solid ${comp.color}`
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4", style: { color: comp.color } })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: { fontSize: "9px" }, children: comp.label })
                    ]
                  },
                  comp.id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 flex-1", children: challenge.electrical.wiringOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    type: "button",
                    whileHover: { scale: 1.01 },
                    whileTap: { scale: 0.99 },
                    onClick: () => setSelectedWiring(opt.id),
                    className: "rounded-xl border-2 p-3 text-left transition-all",
                    style: {
                      borderColor: selectedWiring === opt.id ? "#00f5ff" : "#374151",
                      backgroundColor: selectedWiring === opt.id ? "#00f5ff15" : "transparent"
                    },
                    "data-ocid": `mechatronics.wiring.${opt.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm font-bold",
                          style: {
                            color: selectedWiring === opt.id ? "#00f5ff" : "#94a3b8",
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: "10px"
                          },
                          children: opt.label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: opt.description })
                    ]
                  },
                  opt.id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: electricalResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: `rounded-xl p-2 border text-sm flex items-center gap-2 shrink-0 ${electricalResult ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                    children: [
                      electricalResult ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0" }),
                      electricalResult ? "Wiring correct. Advancing to software." : "Wrong wiring diagram. This would damage components."
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleElectricalSubmit,
                    disabled: !selectedWiring || electricalResult !== null,
                    "data-ocid": "mechatronics.electrical_submit",
                    children: "Confirm Wiring Diagram"
                  }
                )
              ]
            },
            "electrical"
          ),
          phase === "software" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-xl p-3 shrink-0 border-l-4",
                    style: { borderLeftColor: "#10b981" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-bold text-[#10b981] mb-1",
                          style: { fontFamily: "'Orbitron', sans-serif" },
                          children: "SOFTWARE DOMAIN"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: challenge.software.question })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-muted-foreground mb-2",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "YOUR CONTROL SEQUENCE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    softwareBlocks.map((block, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 },
                        className: "flex items-center gap-3 rounded-lg border px-3 py-2",
                        style: {
                          borderColor: `${BLOCK_COLORS[block]}60`,
                          backgroundColor: `${BLOCK_COLORS[block]}10`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-bold tabular-nums",
                              style: {
                                color: BLOCK_COLORS[block],
                                fontFamily: "'Orbitron', sans-serif",
                                minWidth: "16px"
                              },
                              children: i + 1
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-sm font-bold",
                              style: { color: BLOCK_COLORS[block] },
                              children: BLOCK_LABELS[block]
                            }
                          )
                        ]
                      },
                      `${block}-${i}`
                    )),
                    softwareBlocks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-border/40 px-3 py-2 text-xs text-muted-foreground", children: "Click blocks below to add them in order" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-muted-foreground mb-2",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "AVAILABLE BLOCKS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-1", children: challenge.software.availableBlocks.filter((b) => !softwareBlocks.includes(b)).map((block) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      type: "button",
                      whileHover: { scale: 1.01 },
                      whileTap: { scale: 0.99 },
                      onClick: () => toggleSoftwareBlock(block),
                      className: "rounded-lg border px-3 py-2 text-sm font-bold text-left transition-all",
                      style: {
                        borderColor: `${BLOCK_COLORS[block]}60`,
                        color: BLOCK_COLORS[block],
                        backgroundColor: `${BLOCK_COLORS[block]}08`
                      },
                      "data-ocid": `mechatronics.block.${block}`,
                      children: BLOCK_LABELS[block]
                    },
                    block
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: softwareResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: `rounded-xl p-2 border text-sm flex items-center gap-2 shrink-0 ${softwareResult ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                    children: [
                      softwareResult ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0" }),
                      softwareResult ? `SYSTEM TEST PASSED. ${challenge.explanation}` : "Wrong logic sequence. Reset and try correct order."
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex gap-2 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "secondary",
                      size: "sm",
                      onClick: () => setSoftwareBlocks([]),
                      "data-ocid": "mechatronics.reset_blocks",
                      children: "Reset"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "primary",
                      size: "sm",
                      onClick: handleSoftwareSubmit,
                      disabled: softwareBlocks.length < challenge.software.correctSequence.length || softwareResult !== null,
                      "data-ocid": "mechatronics.software_submit",
                      children: "Run System Test"
                    }
                  )
                ] })
              ]
            },
            "software"
          )
        ] })
      ]
    }
  );
}
const CONTROL_SYSTEMS = [
  {
    name: "Room Thermostat",
    unit: "C",
    setpoint: 20,
    initial: 15,
    minPGain: 0.1,
    maxPGain: 5,
    optimalPGain: 1.5,
    description: "Heat room to setpoint. Too low P-gain = slow response. Too high = oscillation.",
    color: "#f59e0b"
  },
  {
    name: "Motor Speed",
    unit: "RPM",
    setpoint: 1e3,
    initial: 0,
    minPGain: 0.1,
    maxPGain: 5,
    optimalPGain: 2,
    description: "Accelerate motor to 1000 RPM. High P-gain causes overshoot oscillations.",
    color: "#00f5ff"
  },
  {
    name: "Water Level",
    unit: "%",
    setpoint: 80,
    initial: 20,
    minPGain: 0.1,
    maxPGain: 5,
    optimalPGain: 1.2,
    description: "Fill tank to 80% capacity. Too aggressive = level overshoots and oscillates.",
    color: "#7c3aed"
  },
  {
    name: "Robot Arm Angle",
    unit: "deg",
    setpoint: 90,
    initial: 0,
    minPGain: 0.1,
    maxPGain: 5,
    optimalPGain: 1.8,
    description: "Move arm to 90 degree position. Precise P-gain needed for stable positioning.",
    color: "#10b981"
  },
  {
    name: "Conveyor Speed",
    unit: "m/s",
    setpoint: 2,
    initial: 0,
    minPGain: 0.1,
    maxPGain: 5,
    optimalPGain: 1,
    description: "Accelerate conveyor to 2 m/s. Low P-gain is often preferred for conveyor stability.",
    color: "#e879f9"
  }
];
function simulateStep(current, setpoint, pGain, dt) {
  const error = setpoint - current;
  const output = pGain * error;
  return current + output * dt;
}
function generateResponseCurve(initial, setpoint, pGain) {
  const points = [initial];
  let val = initial;
  for (let t = 0; t < 30; t++) {
    val = simulateStep(val, setpoint, pGain, 0.1);
    points.push(val);
  }
  return points;
}
function FeedbackControlGame({
  config,
  onGameEnd
}) {
  const systemCount = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [systemIdx, setSystemIdx] = reactExports.useState(0);
  const system = CONTROL_SYSTEMS[systemIdx % CONTROL_SYSTEMS.length];
  const [pGain, setPGain] = reactExports.useState(1);
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [completedSystems, setCompletedSystems] = reactExports.useState(0);
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
          completedSystems / systemCount * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, completedSystems, systemCount]
  );
  const curve = generateResponseCurve(system.initial, system.setpoint, pGain);
  const finalVal = curve[curve.length - 1];
  const overshoot = Math.max(...curve) - system.setpoint;
  const hasOscillation = pGain > system.optimalPGain * 1.8;
  const isSlow = pGain < system.optimalPGain * 0.5;
  const isGood = !hasOscillation && !isSlow && Math.abs(finalVal - system.setpoint) < Math.abs(system.setpoint - system.initial) * 0.1;
  function handleConfirm() {
    setConfirmed(true);
    const proximityScore = Math.max(
      0,
      100 - Math.abs(pGain - system.optimalPGain) * 40
    );
    const pts = Math.round(proximityScore * 3 * config.difficulty);
    const newScore = score + pts;
    setScore(newScore);
    scoreRef.current = newScore;
    setTimeout(() => {
      const next = completedSystems + 1;
      setCompletedSystems(next);
      if (next >= systemCount) {
        endGame(true);
      } else {
        setSystemIdx(next);
        setPGain(1);
        setConfirmed(false);
      }
    }, 3e3);
  }
  const CHART_W = 280;
  const CHART_H = 80;
  const range = Math.abs(system.setpoint - system.initial) * 1.5 || 1;
  const minY = Math.min(system.initial, system.setpoint) - range * 0.2;
  const maxY = Math.max(system.initial, system.setpoint) + range * 0.3;
  function toSvgX(i) {
    return i / (curve.length - 1) * CHART_W;
  }
  function toSvgY(v) {
    return CHART_H - (v - minY) / (maxY - minY) * CHART_H;
  }
  const pathD = curve.map(
    (v, i) => `${i === 0 ? "M" : "L"} ${toSvgX(i).toFixed(1)} ${toSvgY(v).toFixed(1)}`
  ).join(" ");
  const setpointY = toSvgY(system.setpoint);
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "feedback_control.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cpu,
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
                  children: "Feedback Control Tuner"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Tune the P-gain (proportional gain) for closed-loop control systems. Find the optimal value that gives fast, stable response without oscillation." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Too low P-gain = slow response. Too high = oscillation. Find the sweet spot for stable control." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "feedback_control.start_button",
                  children: "Start Tuning"
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
      "data-ocid": "feedback_control.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              style: { color: system.color },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: system.color },
              children: system.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            completedSystems + 1,
            "/",
            systemCount
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-3 shrink-0 border",
            style: { borderColor: `${system.color}40` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-bold mb-1",
                  style: { color: system.color, fontFamily: "'Orbitron', sans-serif" },
                  children: "CONTROL SYSTEM — PROPORTIONAL CONTROL"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: system.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Setpoint:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", style: { color: system.color }, children: [
                  system.setpoint,
                  system.unit
                ] }),
                " ",
                "| Current:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                  system.initial,
                  system.unit
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-3 shrink-0 border",
            style: { borderColor: `${system.color}30` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs text-muted-foreground mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    "SYSTEM RESPONSE (P-gain = ",
                    pGain.toFixed(1),
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: "100%",
                  viewBox: `0 0 ${CHART_W} ${CHART_H}`,
                  xmlns: "http://www.w3.org/2000/svg",
                  style: { height: "80px" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "0",
                        y1: setpointY,
                        x2: CHART_W,
                        y2: setpointY,
                        stroke: system.color,
                        strokeWidth: "1",
                        strokeDasharray: "4,3",
                        opacity: "0.6"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: pathD,
                        fill: "none",
                        stroke: isGood ? "#10b981" : hasOscillation ? "#f43f5e" : "#f59e0b",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: "4",
                        y: setpointY - 4,
                        fill: system.color,
                        fontSize: "9",
                        fontFamily: "Orbitron",
                        children: "Setpoint"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: CHART_W - 60,
                        y: CHART_H - 4,
                        fill: "#6b7280",
                        fontSize: "8",
                        fontFamily: "Orbitron",
                        children: "Time"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: isGood ? "#10b981" : hasOscillation ? "#f43f5e" : isSlow ? "#f59e0b" : "#6b7280"
                    },
                    children: isGood ? "Stable response" : hasOscillation ? `Oscillating (overshoot: ${overshoot.toFixed(1)})` : isSlow ? "Response too slow" : "Adjusting..."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  "Final: ",
                  finalVal.toFixed(1),
                  system.unit
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-bold",
                style: {
                  color: system.color,
                  fontFamily: "'Orbitron', sans-serif"
                },
                children: "P-GAIN"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xl font-black tabular-nums",
                style: { color: system.color },
                children: pGain.toFixed(1)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: system.minPGain * 10,
              max: system.maxPGain * 10,
              step: "1",
              value: Math.round(pGain * 10),
              onChange: (e) => !confirmed && setPGain(Number.parseInt(e.target.value) / 10),
              className: "w-full",
              disabled: confirmed,
              style: { accentColor: system.color },
              "data-ocid": "feedback_control.pgain_slider"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              system.minPGain,
              " (too slow)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              system.maxPGain,
              " (oscillates)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-2 text-center border",
              style: {
                borderColor: isSlow ? "#f59e0b" : "#374151",
                backgroundColor: isSlow ? "#f59e0b10" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold",
                    style: { color: isSlow ? "#f59e0b" : "#6b7280" },
                    children: "SLOW"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "P < ",
                  (system.optimalPGain * 0.5).toFixed(1)
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-2 text-center border",
              style: {
                borderColor: isGood ? "#10b981" : "#374151",
                backgroundColor: isGood ? "#10b98110" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold",
                    style: { color: isGood ? "#10b981" : "#6b7280" },
                    children: "STABLE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Optimal zone" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-2 text-center border",
              style: {
                borderColor: hasOscillation ? "#f43f5e" : "#374151",
                backgroundColor: hasOscillation ? "#f43f5e10" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold",
                    style: { color: hasOscillation ? "#f43f5e" : "#6b7280" },
                    children: "OSCILLATING"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "P > ",
                  (system.optimalPGain * 1.8).toFixed(1)
                ] })
              ]
            }
          )
        ] }),
        !confirmed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleConfirm,
            "data-ocid": "feedback_control.confirm_button",
            children: [
              "Lock in P-gain: ",
              pGain.toFixed(1)
            ]
          }
        ) }),
        confirmed && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "glass-card rounded-xl p-3 shrink-0 border",
            style: { borderColor: isGood ? "#10b981" : "#f59e0b" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm font-bold",
                style: { color: isGood ? "#10b981" : "#f59e0b" },
                children: isGood ? `Excellent tuning! P-gain of ${pGain.toFixed(1)} gives stable response. Optimal was ${system.optimalPGain}.` : `Acceptable. Optimal P-gain for ${system.name} is ${system.optimalPGain}. Your gain: ${pGain.toFixed(1)}.`
              }
            )
          }
        )
      ]
    }
  );
}
const ROBOT_COMPONENTS = {
  color_sensor: {
    id: "color_sensor",
    label: "Color Sensor",
    description: "Detects object color (RGB)",
    color: "#00f5ff"
  },
  conveyor: {
    id: "conveyor",
    label: "Conveyor Belt",
    description: "Moves objects to robot arm",
    color: "#f59e0b"
  },
  arm: {
    id: "arm",
    label: "Robot Arm",
    description: "3-DOF articulated arm",
    color: "#7c3aed"
  },
  gripper: {
    id: "gripper",
    label: "Gripper",
    description: "Pneumatic clamp end effector",
    color: "#10b981"
  },
  controller: {
    id: "controller",
    label: "Controller",
    description: "PLC logic controller",
    color: "#e879f9"
  },
  camera: {
    id: "camera",
    label: "Vision Camera",
    description: "Object position detection",
    color: "#f43f5e"
  },
  ultrasonic: {
    id: "ultrasonic",
    label: "Distance Sensor",
    description: "Object proximity detection",
    color: "#00f5ff"
  },
  servo: {
    id: "servo",
    label: "Servo Motors",
    description: "Precision joint actuators",
    color: "#f59e0b"
  },
  weight_sensor: {
    id: "weight_sensor",
    label: "Weight Sensor",
    description: "Measures object mass",
    color: "#f43f5e"
  },
  navigation: {
    id: "navigation",
    label: "Navigation Module",
    description: "Path planning and movement",
    color: "#7c3aed"
  }
};
const ROBOTICS_TASKS = {
  1: [
    {
      title: "Color Sorting",
      briefing: "Mission: Sort red and blue cubes into separate bins. Design the robot system and write the control algorithm.",
      requiredComponents: ["color_sensor", "conveyor", "arm", "controller"],
      allComponents: [
        "color_sensor",
        "conveyor",
        "arm",
        "gripper",
        "controller",
        "camera"
      ],
      sequenceLabel: "System Architecture (order: input sensor to process to output)",
      correctSequence: ["conveyor", "color_sensor", "controller", "arm"],
      algorithmBlocks: [
        { id: "detect", label: "IF color = RED", color: "#f43f5e" },
        { id: "move_bin1", label: "MOVE ARM to Bin 1", color: "#7c3aed" },
        { id: "detect_blue", label: "IF color = BLUE", color: "#00f5ff" },
        { id: "move_bin2", label: "MOVE ARM to Bin 2", color: "#7c3aed" },
        { id: "release", label: "RELEASE gripper", color: "#10b981" }
      ],
      correctAlgorithm: [
        "detect",
        "move_bin1",
        "detect_blue",
        "move_bin2",
        "release"
      ],
      explanation: "Conveyor delivers objects, color sensor reads, controller decides which bin, arm executes the move."
    }
  ],
  2: [
    {
      title: "Vision-Guided Pick",
      briefing: "Mission: Use a camera to locate randomly placed objects on a table and pick them up.",
      requiredComponents: ["camera", "controller", "arm", "gripper"],
      allComponents: [
        "camera",
        "ultrasonic",
        "arm",
        "gripper",
        "controller",
        "servo",
        "color_sensor"
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["camera", "controller", "servo", "arm"],
      algorithmBlocks: [
        { id: "scan", label: "SCAN camera for object", color: "#f43f5e" },
        { id: "calc", label: "CALCULATE pick position", color: "#7c3aed" },
        { id: "move_arm", label: "MOVE ARM to position", color: "#10b981" },
        { id: "grip", label: "CLOSE gripper", color: "#f59e0b" },
        { id: "place", label: "PLACE in tray", color: "#00f5ff" }
      ],
      correctAlgorithm: ["scan", "calc", "move_arm", "grip", "place"],
      explanation: "Camera provides coordinates, controller calculates IK, servos drive arm joints, gripper picks and places."
    },
    {
      title: "Weight-Based Sorting",
      briefing: "Mission: Sort products into light and heavy bins based on measured weight.",
      requiredComponents: ["weight_sensor", "conveyor", "arm", "controller"],
      allComponents: [
        "weight_sensor",
        "conveyor",
        "arm",
        "controller",
        "color_sensor",
        "camera"
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["conveyor", "weight_sensor", "controller", "arm"],
      algorithmBlocks: [
        { id: "weigh", label: "READ weight sensor", color: "#f43f5e" },
        {
          id: "compare",
          label: "COMPARE to threshold (500g)",
          color: "#7c3aed"
        },
        { id: "bin_heavy", label: "IF heavy SEND to Bin 2", color: "#f59e0b" },
        { id: "bin_light", label: "IF light SEND to Bin 1", color: "#00f5ff" },
        { id: "advance", label: "ADVANCE conveyor", color: "#10b981" }
      ],
      correctAlgorithm: [
        "weigh",
        "compare",
        "bin_light",
        "bin_heavy",
        "advance"
      ],
      explanation: "Conveyor feeds station, weight sensor measures, controller branches to correct bin, conveyor advances."
    }
  ],
  3: [
    {
      title: "Autonomous Navigation",
      briefing: "Mission: Robot must navigate a warehouse floor, avoid obstacles, and deliver items to 3 locations.",
      requiredComponents: ["navigation", "ultrasonic", "controller", "servo"],
      allComponents: [
        "navigation",
        "ultrasonic",
        "controller",
        "servo",
        "camera",
        "arm",
        "weight_sensor"
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["navigation", "ultrasonic", "controller", "servo"],
      algorithmBlocks: [
        { id: "plan", label: "PLAN path to destination", color: "#7c3aed" },
        { id: "sense", label: "READ proximity sensors", color: "#00f5ff" },
        { id: "check", label: "IF obstacle detected", color: "#f43f5e" },
        { id: "reroute", label: "RECALCULATE path", color: "#f59e0b" },
        { id: "drive", label: "DRIVE to next waypoint", color: "#10b981" }
      ],
      correctAlgorithm: ["plan", "sense", "check", "reroute", "drive"],
      explanation: "Path planner sets route, distance sensors detect obstacles, controller reroutes dynamically, servos drive wheels."
    },
    {
      title: "Assembly Collaboration",
      briefing: "Mission: Two robot arms work in sync to assemble a product by picking different sub-components.",
      requiredComponents: ["camera", "controller", "arm", "gripper"],
      allComponents: [
        "camera",
        "controller",
        "arm",
        "gripper",
        "servo",
        "navigation",
        "ultrasonic"
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["camera", "controller", "arm", "gripper"],
      algorithmBlocks: [
        { id: "sync", label: "SYNC both arm controllers", color: "#e879f9" },
        { id: "detect", label: "DETECT component positions", color: "#f43f5e" },
        { id: "pick_a", label: "ARM A picks sub-component", color: "#7c3aed" },
        { id: "pick_b", label: "ARM B picks base plate", color: "#00f5ff" },
        {
          id: "assemble",
          label: "ASSEMBLE at fixture point",
          color: "#10b981"
        }
      ],
      correctAlgorithm: ["sync", "detect", "pick_a", "pick_b", "assemble"],
      explanation: "Controllers must sync first, camera detects both parts, arms pick simultaneously, then combine at assembly fixture."
    }
  ]
};
function RoboticsChallengeGame({
  config,
  onGameEnd
}) {
  const allTasks = ROBOTICS_TASKS[config.difficulty];
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
  const task = allTasks[taskIdx];
  const [phase, setPhase] = reactExports.useState("components");
  const [selectedComponents, setSelectedComponents] = reactExports.useState([]);
  const [systemSequence, setSystemSequence] = reactExports.useState([]);
  const [algorithmBlocks, setAlgorithmBlocks] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [completedTasks, setCompletedTasks] = reactExports.useState(0);
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
          completedTasks / allTasks.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, completedTasks, allTasks.length]
  );
  function toggleComponent(id) {
    setSelectedComponents(
      (prev) => prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }
  function toggleSequence(id) {
    setSystemSequence(
      (prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }
  function toggleAlgorithm(id) {
    setAlgorithmBlocks(
      (prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }
  function handleComponentsSubmit() {
    const correct = task.requiredComponents.every((c) => selectedComponents.includes(c)) && selectedComponents.length === task.requiredComponents.length;
    if (correct) {
      setScore((s) => s + 150 * config.difficulty);
      setPhase("sequence");
    } else {
      setSelectedComponents([]);
    }
  }
  function handleSequenceSubmit() {
    const correct = systemSequence.length === task.correctSequence.length && systemSequence.every((c, i) => c === task.correctSequence[i]);
    if (correct) {
      setScore((s) => s + 150 * config.difficulty);
      setPhase("algorithm");
    } else {
      setSystemSequence([]);
    }
  }
  function handleAlgorithmSubmit() {
    const correct = algorithmBlocks.length === task.correctAlgorithm.length && algorithmBlocks.every((b, i) => b === task.correctAlgorithm[i]);
    if (correct) {
      setScore((s) => s + 200 * config.difficulty);
      setPhase("result");
      setTimeout(() => {
        const next = completedTasks + 1;
        setCompletedTasks(next);
        if (next >= allTasks.length) {
          endGame(true);
        } else {
          setTaskIdx(next);
          setPhase("components");
          setSelectedComponents([]);
          setSystemSequence([]);
          setAlgorithmBlocks([]);
        }
      }, 3e3);
    } else {
      setAlgorithmBlocks([]);
    }
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "robotics_challenge.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cpu,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f43f5e" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" },
                  children: "Robotics Integration Challenge"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Mission briefings require you to design a complete robot system: select the right components, place them in the correct architecture sequence, and write the control algorithm using IF-THEN blocks." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "robotics_challenge.start_button",
                  children: "Accept Mission"
                }
              )
            ]
          }
        )
      }
    );
  }
  const phaseSteps = ["components", "sequence", "algorithm"];
  const phaseColors = {
    components: "#f43f5e",
    sequence: "#7c3aed",
    algorithm: "#10b981",
    result: "#00f5ff"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "robotics_challenge.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f43f5e" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: phaseSteps.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-2 h-2 rounded-full",
              style: {
                backgroundColor: p === phase ? phaseColors[p] : phaseSteps.indexOf(p) < phaseSteps.indexOf(phase) ? "#10b981" : "#374151"
              }
            },
            p
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            completedTasks + 1,
            "/",
            allTasks.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#f43f5e]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold text-[#f43f5e] mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "MISSION BRIEFING"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: task.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: task.briefing })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
          phase === "components" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      "SELECT EXACTLY 4 REQUIRED COMPONENTS (",
                      selectedComponents.length,
                      "/4)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 flex-1 content-start", children: task.allComponents.map((cid) => {
                  const comp = ROBOT_COMPONENTS[cid];
                  const isSelected = selectedComponents.includes(cid);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      type: "button",
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      onClick: () => toggleComponent(cid),
                      className: "rounded-xl border-2 p-3 text-left transition-all",
                      style: {
                        borderColor: isSelected ? comp.color : `${comp.color}30`,
                        backgroundColor: isSelected ? `${comp.color}15` : "transparent"
                      },
                      "data-ocid": `robotics_challenge.comp.${cid}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-bold",
                            style: { color: isSelected ? comp.color : "#94a3b8" },
                            children: comp.label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs text-muted-foreground",
                            style: { fontSize: "9px" },
                            children: comp.description
                          }
                        )
                      ]
                    },
                    cid
                  );
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleComponentsSubmit,
                    disabled: selectedComponents.length !== 4,
                    "data-ocid": "robotics_challenge.components_submit",
                    children: "Confirm Components"
                  }
                )
              ]
            },
            "comp"
          ),
          phase === "sequence" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      "BUILD SYSTEM ARCHITECTURE — ",
                      task.sequenceLabel
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Your sequence:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 min-h-10 flex-wrap", children: [
                    systemSequence.map((cid, i) => {
                      const comp = ROBOT_COMPONENTS[cid];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "rounded-lg border px-2 py-1 text-xs font-bold",
                          style: {
                            borderColor: `${comp.color}50`,
                            color: comp.color
                          },
                          children: [
                            i + 1,
                            ". ",
                            comp.label
                          ]
                        },
                        `s-${i}`
                      );
                    }),
                    systemSequence.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Click components below..." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 flex-1", children: task.correctSequence.map((cid) => {
                  const comp = ROBOT_COMPONENTS[cid];
                  const placed = systemSequence.includes(cid);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      type: "button",
                      whileHover: { scale: 1.01 },
                      whileTap: { scale: 0.99 },
                      onClick: () => toggleSequence(cid),
                      className: "rounded-xl border-2 p-3 text-left transition-all flex items-center gap-3",
                      style: {
                        borderColor: placed ? comp.color : `${comp.color}30`,
                        backgroundColor: placed ? `${comp.color}12` : "transparent"
                      },
                      "data-ocid": `robotics_challenge.seq.${cid}`,
                      children: [
                        placed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "h-4 w-4 shrink-0",
                            style: { color: comp.color }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-sm font-bold",
                              style: { color: placed ? comp.color : "#94a3b8" },
                              children: comp.label
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs text-muted-foreground",
                              style: { fontSize: "9px" },
                              children: comp.description
                            }
                          )
                        ] })
                      ]
                    },
                    cid
                  );
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "secondary",
                      size: "sm",
                      onClick: () => setSystemSequence([]),
                      "data-ocid": "robotics_challenge.reset_seq",
                      children: "Reset"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "primary",
                      size: "sm",
                      onClick: handleSequenceSubmit,
                      disabled: systemSequence.length !== task.correctSequence.length,
                      "data-ocid": "robotics_challenge.seq_submit",
                      children: "Confirm Architecture"
                    }
                  )
                ] })
              ]
            },
            "seq"
          ),
          phase === "algorithm" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "WRITE CONTROL ALGORITHM — Click blocks in correct order"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Your algorithm:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 min-h-10", children: [
                    algorithmBlocks.map((bid, i) => {
                      const block = task.algorithmBlocks.find((b) => b.id === bid);
                      return block ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "rounded-lg border px-3 py-1.5 text-xs font-bold flex items-center gap-2",
                          style: {
                            borderColor: `${block.color}50`,
                            backgroundColor: `${block.color}10`,
                            color: block.color
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'Orbitron', sans-serif" }, children: i + 1 }),
                            block.label
                          ]
                        },
                        `a-${i}`
                      ) : null;
                    }),
                    algorithmBlocks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Click blocks below..." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 flex-1", children: task.algorithmBlocks.filter((b) => !algorithmBlocks.includes(b.id)).map((block) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    whileHover: { scale: 1.01 },
                    whileTap: { scale: 0.99 },
                    onClick: () => toggleAlgorithm(block.id),
                    className: "rounded-lg border px-3 py-2 text-sm font-bold text-left transition-all",
                    style: {
                      borderColor: `${block.color}50`,
                      color: block.color,
                      backgroundColor: `${block.color}08`
                    },
                    "data-ocid": `robotics_challenge.algo.${block.id}`,
                    children: block.label
                  },
                  block.id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "secondary",
                      size: "sm",
                      onClick: () => setAlgorithmBlocks([]),
                      "data-ocid": "robotics_challenge.reset_algo",
                      children: "Reset"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "primary",
                      size: "sm",
                      onClick: handleAlgorithmSubmit,
                      disabled: algorithmBlocks.length !== task.algorithmBlocks.length,
                      "data-ocid": "robotics_challenge.algo_submit",
                      children: "Run Mission"
                    }
                  )
                ] })
              ]
            },
            "algo"
          ),
          phase === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheckBig,
                  {
                    className: "h-20 w-20",
                    style: {
                      color: "#10b981",
                      filter: "drop-shadow(0 0 20px #10b981)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xl font-black text-[#10b981]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "MISSION ACCOMPLISHED"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: task.explanation })
              ]
            },
            "result"
          )
        ] })
      ]
    }
  );
}
function Mechatronics({ config, onGameEnd }) {
  if (config.gameId === "feedback-control")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FeedbackControlGame, { config, onGameEnd });
  if (config.gameId === "robotics-challenge")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RoboticsChallengeGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SystemIntegrationGame, { config, onGameEnd });
}
export {
  Mechatronics as default
};
