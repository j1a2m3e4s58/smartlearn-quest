import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { A as Activity } from "./activity-C-ksYUuo.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
function makeSensorReading(sensor, value) {
  const config = {
    temperature: {
      unit: "°C",
      label: "Temperature",
      threshold: { low: 15, high: 45 }
    },
    proximity: {
      unit: "cm",
      label: "Proximity",
      threshold: { low: 5, high: 50 }
    },
    light: {
      unit: "lux",
      label: "Light Level",
      threshold: { low: 200, high: 800 }
    },
    pressure: {
      unit: "kPa",
      label: "Pressure",
      threshold: { low: 90, high: 110 }
    }
  };
  const c = config[sensor];
  const status = value < c.threshold.low || value > c.threshold.high ? Math.abs(value - (c.threshold.low + c.threshold.high) / 2) > c.threshold.high - c.threshold.low ? "critical" : "warning" : "normal";
  return {
    sensor,
    value,
    unit: c.unit,
    label: c.label,
    threshold: c.threshold,
    status
  };
}
const INTERPRETER_CHALLENGES = {
  1: [
    {
      id: "c1",
      readings: [makeSensorReading("temperature", 72)],
      question: "Temperature reads 72°C. What action should the robot take?",
      options: [
        "Continue normal operation",
        "Activate cooling fans immediately",
        "Shut down and wait",
        "Increase motor speed"
      ],
      correctIdx: 1,
      explanation: "72°C exceeds the safe threshold of 45°C. Cooling fans must activate to prevent hardware damage."
    },
    {
      id: "c2",
      readings: [makeSensorReading("proximity", 3)],
      question: "Proximity sensor reads 3cm. What should the robot do?",
      options: [
        "Speed up to pass quickly",
        "Stop and reverse direction",
        "Ignore and continue",
        "Turn lights on"
      ],
      correctIdx: 1,
      explanation: "At 3cm the robot is about to collide. It must immediately stop and reverse."
    },
    {
      id: "c3",
      readings: [makeSensorReading("light", 50)],
      question: "Light level is only 50 lux (very dark). What action is needed?",
      options: [
        "Activate IR/night vision mode",
        "Shut down",
        "Speed up",
        "No action needed"
      ],
      correctIdx: 0,
      explanation: "50 lux is too dark for normal cameras. IR mode enables navigation in low-light environments."
    }
  ],
  2: [
    {
      id: "c4",
      readings: [
        makeSensorReading("temperature", 28),
        makeSensorReading("proximity", 2)
      ],
      question: "Temperature is normal but proximity reads 2cm. Priority action?",
      options: [
        "Address proximity — stop immediately",
        "Check temperature first",
        "Both sensors are fine",
        "Reduce operating frequency"
      ],
      correctIdx: 0,
      explanation: "Proximity at 2cm is critical — imminent collision. Temperature being normal doesn't change the urgency."
    },
    {
      id: "c5",
      readings: [
        makeSensorReading("pressure", 75),
        makeSensorReading("light", 600)
      ],
      question: "Pressure is 75 kPa (below normal), light is fine. What happened?",
      options: [
        "Robot is operating underwater",
        "Sensor malfunction — recalibrate",
        "Robot is at high altitude — adjust pneumatics",
        "Everything is normal"
      ],
      correctIdx: 2,
      explanation: "75 kPa indicates low atmospheric pressure, typical of high altitude. Pneumatic systems need recalibration."
    },
    {
      id: "c6",
      readings: [
        makeSensorReading("temperature", 65),
        makeSensorReading("proximity", 45)
      ],
      question: "Temperature is high (65°C) but proximity is safe. Correct response?",
      options: [
        "Ignore — proximity is fine so keep moving",
        "Throttle motors to reduce heat buildup",
        "Full shutdown immediately",
        "Increase speed to generate airflow"
      ],
      correctIdx: 1,
      explanation: "65°C is in the warning zone. Reducing motor load decreases heat without stopping the mission."
    }
  ],
  3: [
    {
      id: "c7",
      readings: [
        makeSensorReading("temperature", 80),
        makeSensorReading("proximity", 4),
        makeSensorReading("pressure", 125),
        makeSensorReading("light", 15)
      ],
      question: "All sensors in critical range. What is the correct priority order?",
      options: [
        "Proximity → Pressure → Temperature → Light",
        "Temperature → Light → Proximity → Pressure",
        "Light → Temperature → Proximity → Pressure",
        "Pressure → Light → Temperature → Proximity"
      ],
      correctIdx: 0,
      explanation: "Proximity (collision) is always first priority. Pressure (structural) second. Temperature (hardware) third. Light last as navigational only."
    },
    {
      id: "c8",
      readings: [
        makeSensorReading("proximity", 30),
        makeSensorReading("light", 950),
        makeSensorReading("temperature", 20)
      ],
      question: "Light is 950 lux (overexposed), temp and proximity fine. What's needed?",
      options: [
        "Activate UV filter and reduce camera exposure",
        "Stop the robot",
        "No action needed",
        "Replace the sensor"
      ],
      correctIdx: 0,
      explanation: "Overexposure at 950 lux will blind cameras. UV filter + reduced exposure maintains vision quality."
    },
    {
      id: "c9",
      readings: [
        makeSensorReading("temperature", 35),
        makeSensorReading("proximity", 100),
        makeSensorReading("pressure", 95)
      ],
      question: "All readings near normal. What does this sensor state indicate?",
      options: [
        "Robot is malfunctioning",
        "Optimal operating conditions — proceed at full capability",
        "Sensors need recalibration",
        "Shut down for maintenance"
      ],
      correctIdx: 1,
      explanation: "All readings within safe thresholds indicate optimal conditions. The robot should operate at full capability."
    }
  ]
};
const STATUS_COLORS = {
  normal: "#10b981",
  warning: "#f59e0b",
  critical: "#f43f5e"
};
const SENSOR_LABELS = {
  ultrasonic: "Ultrasonic",
  ir: "IR Sensor",
  light: "Light Sensor",
  temperature: "Temperature",
  gyroscope: "Gyroscope",
  camera: "Camera"
};
const SENSOR_COLORS = {
  ultrasonic: "#00f5ff",
  ir: "#f59e0b",
  light: "#fef08a",
  temperature: "#f43f5e",
  gyroscope: "#7c3aed",
  camera: "#10b981"
};
const SENSOR_ICONS = {
  ultrasonic: "US",
  ir: "IR",
  light: "LX",
  temperature: "TH",
  gyroscope: "GY",
  camera: "CAM"
};
const PLACEMENT_MISSIONS = [
  {
    id: "m1",
    title: "Maze Navigator",
    description: "Robot must avoid walls while navigating a closed maze.",
    objective: "Select sensors that detect obstacles at close range.",
    requiredSensors: ["ultrasonic", "ir"],
    optionSensors: ["ultrasonic", "ir", "light", "temperature", "camera"],
    explanation: "Ultrasonic detects distances up to 400cm. IR detects obstacles at 0-30cm. Both needed for wall avoidance."
  },
  {
    id: "m2",
    title: "Line Follower",
    description: "Robot must follow a black line on white surface.",
    objective: "Select sensors that distinguish surface color contrast.",
    requiredSensors: ["ir"],
    optionSensors: ["ultrasonic", "ir", "light", "gyroscope", "camera"],
    explanation: "IR reflectance sensors detect black/white contrast by measuring reflected IR light intensity."
  },
  {
    id: "m3",
    title: "Fire Detector Bot",
    description: "Robot must locate and stop near a heat source in a room.",
    objective: "Select sensors that detect heat and proximity to source.",
    requiredSensors: ["temperature", "ir"],
    optionSensors: ["temperature", "ir", "ultrasonic", "gyroscope", "camera"],
    explanation: "Temperature sensor detects heat source. IR helps navigate to it without collision."
  },
  {
    id: "m4",
    title: "Aerial Mapper",
    description: "Drone must map room dimensions without colliding with walls.",
    objective: "Select distance and orientation sensors.",
    requiredSensors: ["ultrasonic", "gyroscope"],
    optionSensors: ["ultrasonic", "gyroscope", "ir", "temperature", "camera"],
    explanation: "Ultrasonic measures distances to walls. Gyroscope tracks heading angle for accurate mapping."
  },
  {
    id: "m5",
    title: "Visual Sorter",
    description: "Robot must identify and sort objects by color on a conveyor.",
    objective: "Select sensors for color identification.",
    requiredSensors: ["camera", "light"],
    optionSensors: ["camera", "light", "ir", "ultrasonic", "gyroscope"],
    explanation: "Camera captures object color data. Light sensor calibrates ambient conditions for accurate color reading."
  },
  {
    id: "m6",
    title: "Balance Bot",
    description: "Two-wheeled robot must maintain upright balance.",
    objective: "Select the sensor that detects tilt angle.",
    requiredSensors: ["gyroscope"],
    optionSensors: ["gyroscope", "ultrasonic", "ir", "temperature", "camera"],
    explanation: "Gyroscope measures angular velocity and tilt. Essential for PID balance control loops."
  },
  {
    id: "m7",
    title: "Precision Parking",
    description: "Robot parks within 5cm of a wall without contact.",
    objective: "Select accurate short-range distance sensor.",
    requiredSensors: ["ir", "ultrasonic"],
    optionSensors: ["ir", "ultrasonic", "camera", "gyroscope", "temperature"],
    explanation: "IR provides precise short-range distance. Ultrasonic provides longer range confirmation."
  },
  {
    id: "m8",
    title: "Greenhouse Monitor",
    description: "Robot monitors plant health in greenhouse.",
    objective: "Select sensors for environmental conditions.",
    requiredSensors: ["temperature", "light"],
    optionSensors: ["temperature", "light", "ir", "ultrasonic", "gyroscope"],
    explanation: "Temperature tracks heat/cold stress. Light measures photosynthetically active radiation for plant growth."
  }
];
const CAL_CHALLENGES = [
  {
    id: "cal1",
    type: "distance",
    title: "Ultrasonic Threshold",
    description: "Signal has spurious spikes. Set threshold to count only real obstacles (10-40cm range).",
    dataPoints: [8, 25, 30, 200, 15, 28, 5, 22, 300, 18],
    noiseLabel: "Valid detections: 10-40cm",
    correctThresholdLow: 10,
    correctThresholdHigh: 40,
    unit: "cm",
    explanation: "Spikes above 100cm are reflections. Values below 10cm are sensor noise. Valid range: 10-40cm."
  },
  {
    id: "cal2",
    type: "light",
    title: "Light Level Cutoff",
    description: "Classify 'dark room' vs 'lit room'. Only readings below 150 lux should trigger lights.",
    dataPoints: [45, 320, 80, 500, 120, 750, 95, 200, 60, 400],
    noiseLabel: "Trigger threshold: below 150 lux",
    correctThresholdLow: 0,
    correctThresholdHigh: 150,
    unit: "lux",
    explanation: "Readings below 150 lux indicate insufficient ambient light. Above 150 = room is adequately lit."
  },
  {
    id: "cal3",
    type: "temperature",
    title: "Heat Alert Sensitivity",
    description: "Motor overheating alert. Set threshold to warn only when temp exceeds safe operating range.",
    dataPoints: [25, 42, 30, 80, 35, 55, 28, 90, 38, 45],
    noiseLabel: "Alert threshold: above 50°C",
    correctThresholdLow: 50,
    correctThresholdHigh: 100,
    unit: "°C",
    explanation: "Motor safe zone is below 50°C. Above 50°C starts thermal degradation. Above 80°C is critical."
  },
  {
    id: "cal4",
    type: "distance",
    title: "Parking Sensor",
    description: "Parking assist sensor should only warn when object is within 20cm.",
    dataPoints: [5, 150, 15, 200, 8, 300, 12, 100, 18, 250],
    noiseLabel: "Warn threshold: below 20cm",
    correctThresholdLow: 0,
    correctThresholdHigh: 20,
    unit: "cm",
    explanation: "Parking warnings need tight thresholds — only distances under 20cm indicate collision risk."
  },
  {
    id: "cal5",
    type: "light",
    title: "Solar Panel Tracker",
    description: "Track direct sunlight only (above 800 lux). Diffuse light below 800 should not rotate panel.",
    dataPoints: [200, 900, 150, 1200, 300, 850, 400, 1100, 600, 950],
    noiseLabel: "Direct sun: above 800 lux",
    correctThresholdLow: 800,
    correctThresholdHigh: 1500,
    unit: "lux",
    explanation: "Solar trackers should only adjust for direct sunlight (>800 lux). Cloudy conditions waste motor energy."
  },
  {
    id: "cal6",
    type: "temperature",
    title: "Cold Storage Monitor",
    description: "Refrigeration unit should alarm if temperature rises above -2°C (food safety).",
    dataPoints: [-10, 2, -8, 5, -15, 0, -5, 8, -12, 3],
    noiseLabel: "Alarm above: -2°C",
    correctThresholdLow: -2,
    correctThresholdHigh: 50,
    unit: "°C",
    explanation: "Food safety requires storage below -2°C. Any reading above triggers defrost alarm and manual check."
  },
  {
    id: "cal7",
    type: "distance",
    title: "AGV Safety Zone",
    description: "Automated guided vehicle must stop if any obstacle within 30cm of front sensor.",
    dataPoints: [10, 80, 25, 120, 15, 200, 50, 20, 300, 40],
    noiseLabel: "Stop zone: below 30cm",
    correctThresholdLow: 0,
    correctThresholdHigh: 30,
    unit: "cm",
    explanation: "AGV safety stops require a 30cm clearance zone. This allows enough stopping distance at normal speeds."
  },
  {
    id: "cal8",
    type: "light",
    title: "Night Vision Activation",
    description: "IR night vision activates when ambient light drops below 100 lux.",
    dataPoints: [50, 400, 80, 600, 120, 30, 200, 70, 500, 90],
    noiseLabel: "Night vision below: 100 lux",
    correctThresholdLow: 0,
    correctThresholdHigh: 100,
    unit: "lux",
    explanation: "IR illumination is only needed in true dark conditions. Threshold 100 lux prevents wasting IR LEDs in daylight."
  },
  {
    id: "cal9",
    type: "temperature",
    title: "Engine Coolant",
    description: "Coolant pump activates when engine temp exceeds 90°C.",
    dataPoints: [70, 95, 75, 105, 82, 88, 115, 68, 92, 78],
    noiseLabel: "Pump activates above: 90°C",
    correctThresholdLow: 90,
    correctThresholdHigh: 150,
    unit: "°C",
    explanation: "Coolant pump at 90°C prevents thermal runaway. Below 90°C the engine is warming up normally."
  },
  {
    id: "cal10",
    type: "distance",
    title: "Cliff Detection",
    description: "Floor sensor — cliff detected when distance suddenly exceeds 10cm (robot about to fall).",
    dataPoints: [2, 15, 3, 20, 1, 50, 4, 18, 2, 30],
    noiseLabel: "Cliff detected above: 10cm",
    correctThresholdLow: 10,
    correctThresholdHigh: 100,
    unit: "cm",
    explanation: "Floor sensors normally read 1-3cm. When reading exceeds 10cm, robot has reached a drop-off edge."
  }
];
function SensorInterpreterGame({ config, onGameEnd }) {
  const challenges = INTERPRETER_CHALLENGES[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(null);
  const [answered, setAnswered] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gaugeAnim, setGaugeAnim] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = total > 0 ? correct / total * 100 : 0;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, correct, total]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const challenge = challenges[idx];
  reactExports.useEffect(() => {
    if (gameStarted) {
      setGaugeAnim(false);
      setTimeout(() => setGaugeAnim(true), 100);
    }
  }, [idx, gameStarted]);
  function handleAnswer(optIdx) {
    if (answered || !gameStarted) return;
    setSelected(optIdx);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === challenge.correctIdx) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
    }
    setTimeout(() => {
      const next = idx + 1;
      if (next >= challenges.length) {
        endGame(true);
        return;
      }
      setIdx(next);
      setSelected(null);
      setAnswered(false);
    }, 1800);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "sensors_hub.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Sensor Data Interpreter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Read live sensor gauge data and select the correct robot action. Multiple sensors arrive simultaneously." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "sensors_hub.start_button",
                  children: "Activate Sensors"
                }
              )
            ]
          }
        )
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "sensors_hub.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-1000 xp-fill",
              style: { width: `${timeLeft / config.timeLimit * 100}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `grid gap-3 shrink-0 ${challenge.readings.length === 1 ? "grid-cols-1" : challenge.readings.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`,
            children: challenge.readings.map((r) => {
              const pct = Math.min(
                100,
                Math.max(
                  0,
                  (r.value - r.threshold.low * 0.5) / (r.threshold.high * 1.5 - r.threshold.low * 0.5) * 100
                )
              );
              const color = STATUS_COLORS[r.status];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-xl p-3 border",
                  style: { borderColor: `${color}40` },
                  "data-ocid": `sensors_hub.gauge.${r.sensor}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-muted-foreground mb-1",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: r.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.span,
                        {
                          initial: { opacity: 0, scale: 1.3 },
                          animate: { opacity: 1, scale: 1 },
                          className: "text-2xl font-black tabular-nums",
                          style: { color },
                          children: r.value
                        },
                        `${r.sensor}-${r.value}`
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground pb-1", children: r.unit })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { width: 0 },
                        animate: { width: gaugeAnim ? `${pct}%` : 0 },
                        transition: { duration: 0.8, ease: "easeOut" },
                        className: "h-full rounded-full",
                        style: { backgroundColor: color }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 font-bold uppercase", style: { color }, children: r.status })
                  ]
                },
                r.sensor
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-4 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: challenge.question }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1", children: challenge.options.map((opt, i) => {
          let borderColor = "border-border/30 hover:border-[#f59e0b]/40";
          if (answered) {
            if (i === challenge.correctIdx)
              borderColor = "border-[#10b981] bg-[#10b981]/10";
            else if (i === selected)
              borderColor = "border-[#f43f5e] bg-[#f43f5e]/10";
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileHover: !answered ? { scale: 1.02 } : {},
              whileTap: !answered ? { scale: 0.98 } : {},
              onClick: () => handleAnswer(i),
              disabled: answered,
              className: `glass-card rounded-xl p-3 border text-sm cursor-pointer transition-all text-left ${borderColor}`,
              "data-ocid": `sensors_hub.option.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                answered && i === challenge.correctIdx && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] shrink-0 mt-0.5" }),
                answered && i === selected && i !== challenge.correctIdx && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt })
              ] })
            },
            `opt-${i}`
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: answered && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0 },
            className: "glass-card rounded-xl p-3 shrink-0 border border-[#00f5ff]/30",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#00f5ff]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Explanation: " }),
              challenge.explanation
            ] })
          }
        ) })
      ]
    }
  );
}
function SensorPlacementGame({ config, onGameEnd }) {
  const missionCount = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const missions = PLACEMENT_MISSIONS.slice(0, missionCount);
  const [missionIdx, setMissionIdx] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState([]);
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
      const acc = correct / missions.length * 100;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, correct, missions.length]
  );
  const mission = missions[missionIdx];
  function toggleSensor(s) {
    if (submitted) return;
    setSelected(
      (prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }
  function handleSubmit() {
    if (selected.length === 0) return;
    const req = mission.requiredSensors;
    const allCorrect = req.every((r) => selected.includes(r)) && selected.every((s) => req.includes(s));
    setSubmitted(true);
    setResult(allCorrect);
    if (allCorrect) {
      const ns = score + 250 * config.difficulty;
      setScore(ns);
      setCorrect((c) => c + 1);
    }
    setTimeout(() => {
      const next = missionIdx + 1;
      if (next >= missions.length) {
        endGame(true);
        return;
      }
      setMissionIdx(next);
      setSelected([]);
      setSubmitted(false);
      setResult(null);
    }, 2e3);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "sensor_placement.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Activity,
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
                  children: "Sensor Placement Mission"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Each robot mission has a specific task. Select only the sensors required to complete the mission successfully." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Wrong sensors waste weight budget. Missing sensors fail the mission. Select exactly the right combination." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "sensor_placement.start_button",
                  children: "Begin Missions"
                }
              )
            ]
          }
        )
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "sensor_placement.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
              children: [
                "Mission ",
                missionIdx + 1,
                "/",
                missions.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Solved: ",
            correct,
            "/",
            missions.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
            className: "flex flex-col gap-3 flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `glass-card rounded-xl p-4 shrink-0 border-2 transition-all ${result === true ? "border-[#10b981]" : result === false ? "border-[#f43f5e]" : "border-[#00f5ff]/30"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-bold mb-1",
                        style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
                        children: mission.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mb-2", children: mission.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#f59e0b]", children: "Objective:" }),
                      " ",
                      mission.objective
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "160", height: "100", viewBox: "0 0 160 100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "50",
                    y: "30",
                    width: "60",
                    height: "40",
                    rx: "8",
                    fill: "#1e293b",
                    stroke: "#374151",
                    strokeWidth: "2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "60",
                    y: "38",
                    width: "40",
                    height: "24",
                    rx: "4",
                    fill: "#0f172a",
                    stroke: "#00f5ff",
                    strokeWidth: "1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "68",
                    cy: "50",
                    r: "4",
                    fill: "#00f5ff30",
                    stroke: "#00f5ff",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "92",
                    cy: "50",
                    r: "4",
                    fill: "#00f5ff30",
                    stroke: "#00f5ff",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "ellipse",
                  {
                    cx: "58",
                    cy: "76",
                    rx: "8",
                    ry: "5",
                    fill: "#374151",
                    stroke: "#4b5563",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "ellipse",
                  {
                    cx: "102",
                    cy: "76",
                    rx: "8",
                    ry: "5",
                    fill: "#374151",
                    stroke: "#4b5563",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "80",
                    cy: "28",
                    r: "5",
                    fill: selected.includes("ultrasonic") ? `${SENSOR_COLORS.ultrasonic}50` : "#1e293b",
                    stroke: selected.includes("ultrasonic") ? SENSOR_COLORS.ultrasonic : "#374151",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "50",
                    cy: "50",
                    r: "5",
                    fill: selected.includes("ir") ? `${SENSOR_COLORS.ir}50` : "#1e293b",
                    stroke: selected.includes("ir") ? SENSOR_COLORS.ir : "#374151",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "110",
                    cy: "50",
                    r: "5",
                    fill: selected.includes("camera") ? `${SENSOR_COLORS.camera}50` : "#1e293b",
                    stroke: selected.includes("camera") ? SENSOR_COLORS.camera : "#374151",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "80",
                    cy: "72",
                    r: "5",
                    fill: selected.includes("light") ? `${SENSOR_COLORS.light}50` : "#1e293b",
                    stroke: selected.includes("light") ? SENSOR_COLORS.light : "#374151",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "80",
                    y: "10",
                    textAnchor: "middle",
                    fill: "#6b7280",
                    fontSize: "8",
                    fontFamily: "Orbitron",
                    children: "ROBOT"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "SELECT SENSORS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: mission.optionSensors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    type: "button",
                    whileHover: { scale: 1.04 },
                    whileTap: { scale: 0.96 },
                    onClick: () => toggleSensor(s),
                    className: "rounded-xl border-2 p-2 text-xs font-bold transition-all flex flex-col items-center gap-1",
                    style: {
                      borderColor: selected.includes(s) ? SENSOR_COLORS[s] : `${SENSOR_COLORS[s]}40`,
                      backgroundColor: selected.includes(s) ? `${SENSOR_COLORS[s]}20` : "transparent",
                      color: SENSOR_COLORS[s]
                    },
                    "data-ocid": `sensor_placement.sensor.${s}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-sm", children: SENSOR_ICONS[s] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px" }, children: SENSOR_LABELS[s] })
                    ]
                  },
                  s
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: submitted && result !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0 },
                  className: `rounded-xl p-3 border shrink-0 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs",
                      style: { color: result ? "#10b981" : "#f43f5e" },
                      children: [
                        result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                          "Correct sensor selection!",
                          " "
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Wrong selection. " }),
                        mission.explanation
                      ]
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "sm",
                  onClick: handleSubmit,
                  disabled: selected.length === 0 || submitted,
                  "data-ocid": "sensor_placement.submit_button",
                  children: "Deploy Sensors"
                }
              )
            ]
          },
          mission.id
        ) })
      ]
    }
  );
}
function SensorCalibrationGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 10;
  const challenges = CAL_CHALLENGES.slice(0, count);
  const [idx, setIdx] = reactExports.useState(0);
  const [threshLow, setThreshLow] = reactExports.useState(0);
  const [threshHigh, setThreshHigh] = reactExports.useState(100);
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
      const acc = correct / challenges.length * 100;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, correct, challenges.length]
  );
  const cal = challenges[idx];
  function loadChallenge(c) {
    const mid = (c.correctThresholdLow + c.correctThresholdHigh) / 2;
    setThreshLow(c.correctThresholdLow > 0 ? 0 : Math.min(...c.dataPoints) - 5);
    setThreshHigh(mid + 20);
    setSubmitted(false);
    setResult(null);
  }
  function handleSubmit() {
    if (submitted) return;
    const isLowOk = Math.abs(threshLow - cal.correctThresholdLow) <= 5;
    const isHighOk = Math.abs(threshHigh - cal.correctThresholdHigh) <= 10;
    const ok = isLowOk && isHighOk;
    setSubmitted(true);
    setResult(ok);
    if (ok) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    }
    setTimeout(() => {
      const next = idx + 1;
      if (next >= challenges.length) {
        endGame(true);
        return;
      }
      setIdx(next);
      loadChallenge(challenges[next]);
    }, 2200);
  }
  const validCount = cal.dataPoints.filter(
    (v) => v >= threshLow && v <= threshHigh
  ).length;
  const maxVal = Math.max(...cal.dataPoints);
  const minVal = Math.min(...cal.dataPoints);
  const range = maxVal - minVal || 1;
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "sensor_calibration.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Activity,
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
                  children: "Sensor Calibration Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "A noisy sensor signal is displayed. Adjust the threshold sliders to count only valid detections — filtering out noise." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Set threshold range so valid readings pass through and noise is rejected. Check your calibration." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    loadChallenge(challenges[0]);
                    setGameStarted(true);
                  },
                  "data-ocid": "sensor_calibration.start_button",
                  children: "Begin Calibration"
                }
              )
            ]
          }
        )
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "sensor_calibration.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#10b981" },
              children: [
                "Cal ",
                idx + 1,
                "/",
                challenges.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Valid: ",
            validCount,
            "/",
            cal.dataPoints.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#10b981]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs font-bold mb-1",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#10b981" },
              children: [
                cal.title,
                " — ",
                cal.type.toUpperCase()
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: cal.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#f59e0b] mt-1", children: cal.noiseLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 flex-1 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: [
                "SIGNAL DATA — ",
                cal.dataPoints.length,
                " SAMPLES"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full h-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "w-full h-full",
              viewBox: "0 0 300 80",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "0",
                    y: Math.max(0, 80 - (threshHigh - minVal) / range * 80),
                    width: "300",
                    height: Math.min(80, (threshHigh - threshLow) / range * 80),
                    fill: "#10b98120",
                    stroke: "none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: "0",
                    y1: 80 - (threshHigh - minVal) / range * 80,
                    x2: "300",
                    y2: 80 - (threshHigh - minVal) / range * 80,
                    stroke: "#10b981",
                    strokeWidth: "1",
                    strokeDasharray: "4,2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: "0",
                    y1: 80 - (threshLow - minVal) / range * 80,
                    x2: "300",
                    y2: 80 - (threshLow - minVal) / range * 80,
                    stroke: "#f59e0b",
                    strokeWidth: "1",
                    strokeDasharray: "4,2"
                  }
                ),
                cal.dataPoints.map((v, i) => {
                  const inRange = v >= threshLow && v <= threshHigh;
                  const barH = (v - minVal) / range * 80;
                  const x = i / cal.dataPoints.length * 280 + 10;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: x - 6,
                      y: 80 - barH,
                      width: "12",
                      height: barH,
                      rx: "2",
                      fill: inRange ? "#10b981" : "#f43f5e",
                      opacity: "0.8"
                    },
                    i
                  );
                })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b]", children: [
              "Low: ",
              threshLow,
              " ",
              cal.unit
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981]", children: [
              "Valid: ",
              validCount,
              " pts"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981]", children: [
              "High: ",
              threshHigh,
              " ",
              cal.unit
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex flex-col gap-3 glass-card rounded-xl p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "LOW THRESHOLD"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-bold tabular-nums", children: [
                threshLow,
                " ",
                cal.unit
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: minVal - 10,
                max: maxVal,
                value: threshLow,
                onChange: (e) => {
                  const v = Number(e.target.value);
                  if (v < threshHigh) setThreshLow(v);
                },
                className: "w-full accent-[#f59e0b]",
                "data-ocid": "sensor_calibration.low_slider"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[#10b981]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "HIGH THRESHOLD"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981] font-bold tabular-nums", children: [
                threshHigh,
                " ",
                cal.unit
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: minVal,
                max: maxVal + 20,
                value: threshHigh,
                onChange: (e) => {
                  const v = Number(e.target.value);
                  if (v > threshLow) setThreshHigh(v);
                },
                className: "w-full accent-[#10b981]",
                "data-ocid": "sensor_calibration.high_slider"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: submitted && result !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs",
                style: { color: result ? "#10b981" : "#f43f5e" },
                children: [
                  result ? "Calibration accepted! " : "Thresholds off — adjust and retry. ",
                  cal.explanation
                ]
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: submitted,
            "data-ocid": "sensor_calibration.submit_button",
            children: "Apply Calibration"
          }
        )
      ]
    }
  );
}
function SensorsHub(props) {
  switch (props.config.gameId) {
    case "sensor-placement":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SensorPlacementGame, { ...props });
    case "sensor-calibration":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SensorCalibrationGame, { ...props });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SensorInterpreterGame, { ...props });
  }
}
export {
  SensorsHub as default
};
