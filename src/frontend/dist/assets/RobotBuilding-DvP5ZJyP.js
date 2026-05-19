import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence, Z as Zap } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { S as Settings } from "./settings-PszpihEQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
const COLORS = {
  chassis: "#00f5ff",
  motor: "#7c3aed",
  wheel: "#10b981",
  sensor: "#f59e0b",
  power: "#f43f5e",
  board: "#e879f9",
  arm: "#fb923c",
  camera: "#38bdf8"
};
const LEVELS = {
  1: {
    title: "Basic Ground Robot",
    parts: [
      {
        id: "chassis",
        name: "Chassis Frame",
        slotId: "slot-chassis",
        color: COLORS.chassis,
        description: "Structural base"
      },
      {
        id: "motor-l",
        name: "Left Drive Motor",
        slotId: "slot-motor-l",
        color: COLORS.motor,
        description: "DC motor, 200 RPM"
      },
      {
        id: "motor-r",
        name: "Right Drive Motor",
        slotId: "slot-motor-r",
        color: COLORS.motor,
        description: "DC motor, 200 RPM"
      },
      {
        id: "wheel-l",
        name: "Left Wheel",
        slotId: "slot-wheel-l",
        color: COLORS.wheel,
        description: "Rubber-grip wheel"
      },
      {
        id: "wheel-r",
        name: "Right Wheel",
        slotId: "slot-wheel-r",
        color: COLORS.wheel,
        description: "Rubber-grip wheel"
      },
      {
        id: "power",
        name: "Battery Pack",
        slotId: "slot-power",
        color: COLORS.power,
        description: "7.4V LiPo"
      }
    ],
    slots: [
      { id: "slot-chassis", label: "Chassis", x: 35, y: 35, partId: null },
      { id: "slot-motor-l", label: "Left Motor", x: 10, y: 50, partId: null },
      { id: "slot-motor-r", label: "Right Motor", x: 60, y: 50, partId: null },
      { id: "slot-wheel-l", label: "Left Wheel", x: 5, y: 70, partId: null },
      { id: "slot-wheel-r", label: "Right Wheel", x: 65, y: 70, partId: null },
      { id: "slot-power", label: "Power", x: 35, y: 65, partId: null }
    ]
  },
  2: {
    title: "Sensor-Equipped Explorer",
    parts: [
      {
        id: "chassis",
        name: "Chassis Frame",
        slotId: "slot-chassis",
        color: COLORS.chassis,
        description: "Structural base"
      },
      {
        id: "motor-l",
        name: "Left Motor",
        slotId: "slot-motor-l",
        color: COLORS.motor,
        description: "Drive motor"
      },
      {
        id: "motor-r",
        name: "Right Motor",
        slotId: "slot-motor-r",
        color: COLORS.motor,
        description: "Drive motor"
      },
      {
        id: "wheel-l",
        name: "Left Wheel",
        slotId: "slot-wheel-l",
        color: COLORS.wheel,
        description: "Drive wheel"
      },
      {
        id: "wheel-r",
        name: "Right Wheel",
        slotId: "slot-wheel-r",
        color: COLORS.wheel,
        description: "Drive wheel"
      },
      {
        id: "sensor-f",
        name: "Front Ultrasonic",
        slotId: "slot-sensor-f",
        color: COLORS.sensor,
        description: "HC-SR04"
      },
      {
        id: "power",
        name: "Battery Pack",
        slotId: "slot-power",
        color: COLORS.power,
        description: "7.4V LiPo"
      },
      {
        id: "board",
        name: "Arduino Mega",
        slotId: "slot-board",
        color: COLORS.board,
        description: "Microcontroller"
      }
    ],
    slots: [
      { id: "slot-chassis", label: "Chassis", x: 35, y: 35, partId: null },
      { id: "slot-motor-l", label: "L.Motor", x: 8, y: 48, partId: null },
      { id: "slot-motor-r", label: "R.Motor", x: 62, y: 48, partId: null },
      { id: "slot-wheel-l", label: "L.Wheel", x: 3, y: 65, partId: null },
      { id: "slot-wheel-r", label: "R.Wheel", x: 67, y: 65, partId: null },
      { id: "slot-sensor-f", label: "Sensor", x: 38, y: 15, partId: null },
      { id: "slot-power", label: "Power", x: 38, y: 60, partId: null },
      { id: "slot-board", label: "Board", x: 38, y: 80, partId: null }
    ]
  },
  3: {
    title: "Advanced Robotic Arm",
    parts: [
      {
        id: "chassis",
        name: "Chassis Frame",
        slotId: "slot-chassis",
        color: COLORS.chassis,
        description: "Aluminum frame"
      },
      {
        id: "motor-l",
        name: "Left Drive Motor",
        slotId: "slot-motor-l",
        color: COLORS.motor,
        description: "High-torque DC"
      },
      {
        id: "motor-r",
        name: "Right Drive Motor",
        slotId: "slot-motor-r",
        color: COLORS.motor,
        description: "High-torque DC"
      },
      {
        id: "wheel-l",
        name: "Left Mecanum",
        slotId: "slot-wheel-l",
        color: COLORS.wheel,
        description: "Omnidirectional"
      },
      {
        id: "wheel-r",
        name: "Right Mecanum",
        slotId: "slot-wheel-r",
        color: COLORS.wheel,
        description: "Omnidirectional"
      },
      {
        id: "sensor-f",
        name: "Front LIDAR",
        slotId: "slot-sensor-f",
        color: COLORS.sensor,
        description: "360° scanner"
      },
      {
        id: "arm",
        name: "Servo Arm",
        slotId: "slot-arm",
        color: COLORS.arm,
        description: "6-DOF robotic arm"
      },
      {
        id: "camera",
        name: "Vision Camera",
        slotId: "slot-camera",
        color: COLORS.camera,
        description: "OpenCV module"
      },
      {
        id: "board",
        name: "Raspberry Pi 4",
        slotId: "slot-board",
        color: COLORS.board,
        description: "Main processor"
      },
      {
        id: "power",
        name: "Li-Ion Battery",
        slotId: "slot-power",
        color: COLORS.power,
        description: "11.1V 5000mAh"
      }
    ],
    slots: [
      { id: "slot-chassis", label: "Chassis", x: 35, y: 40, partId: null },
      { id: "slot-motor-l", label: "L.Motor", x: 6, y: 48, partId: null },
      { id: "slot-motor-r", label: "R.Motor", x: 64, y: 48, partId: null },
      { id: "slot-wheel-l", label: "L.Wheel", x: 2, y: 65, partId: null },
      { id: "slot-wheel-r", label: "R.Wheel", x: 68, y: 65, partId: null },
      { id: "slot-sensor-f", label: "LIDAR", x: 38, y: 12, partId: null },
      { id: "slot-arm", label: "Arm", x: 5, y: 28, partId: null },
      { id: "slot-camera", label: "Camera", x: 65, y: 28, partId: null },
      { id: "slot-board", label: "Board", x: 38, y: 55, partId: null },
      { id: "slot-power", label: "Power", x: 55, y: 70, partId: null }
    ]
  }
};
function AssemblyLine({ config, onGameEnd }) {
  const level = LEVELS[config.difficulty];
  const [slots, setSlots] = reactExports.useState(
    level.slots.map((s) => ({ ...s }))
  );
  const [placed, setPlaced] = reactExports.useState([]);
  const [dragging, setDragging] = reactExports.useState(null);
  const [errorSlot, setErrorSlot] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [testRunning, setTestRunning] = reactExports.useState(false);
  const [testSuccess, setTestSuccess] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = completed ? 90 + config.difficulty * 3 : Math.max(20, placed.length / level.parts.length * 100);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, placed.length, level.parts.length]
  );
  function handleDropOnSlot(slotId) {
    if (!dragging) return;
    const part = level.parts.find((p) => p.id === dragging);
    if (!part) return;
    if (part.slotId !== slotId) {
      setErrorSlot(slotId);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 600);
        return nl;
      });
      setTimeout(() => setErrorSlot(null), 700);
      setDragging(null);
      return;
    }
    setSlots(
      (prev) => prev.map((s) => s.id === slotId ? { ...s, partId: dragging } : s)
    );
    setPlaced((prev) => [...prev, dragging]);
    setScore((s) => s + 150 * config.difficulty);
    setDragging(null);
  }
  function handleTestRobot() {
    if (placed.length < level.parts.length) return;
    setTestRunning(true);
    setTimeout(() => {
      setTestRunning(false);
      setTestSuccess(true);
      setScore((s) => s + 500 * config.difficulty);
      setTimeout(() => endGame(true), 2200);
    }, 2e3);
  }
  const availableParts = level.parts.filter((p) => !placed.includes(p.id));
  const allPlaced = placed.length === level.parts.length;
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "robot_building.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Assembly Line"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Drag robot components into their correct slots. Wrong part in wrong slot costs a life." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Complete the robot to run the test mission and score bonus points." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "robot_building.start_button",
                  children: "Start Assembly"
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
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "robot_building.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: level.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-44 shrink-0 flex flex-col gap-2 overflow-y-auto",
              "data-ocid": "robot_building.parts_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Components"
                  }
                ),
                availableParts.map((part) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    draggable: true,
                    onDragStart: () => setDragging(part.id),
                    onDragEnd: () => setDragging(null),
                    whileHover: { scale: 1.03 },
                    whileTap: { scale: 0.97 },
                    className: "p-2 rounded-lg border cursor-grab active:cursor-grabbing text-xs",
                    style: {
                      borderColor: `${part.color}50`,
                      backgroundColor: `${part.color}10`,
                      color: part.color
                    },
                    "data-ocid": `robot_building.part.${part.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: part.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-muted-foreground mt-0.5",
                          style: { fontSize: "10px" },
                          children: part.description
                        }
                      )
                    ]
                  },
                  part.id
                )),
                allPlaced && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[#10b981] text-center mt-4", children: "All parts placed!" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative rounded-xl border border-border/30 glass overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute top-2 left-3 text-xs text-muted-foreground",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "ASSEMBLY DIAGRAM"
              }
            ),
            slots.map((slot) => {
              const placedPart = level.parts.find((p) => p.id === slot.partId);
              const isError = errorSlot === slot.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  onDragOver: (e) => e.preventDefault(),
                  onDrop: () => handleDropOnSlot(slot.id),
                  className: `absolute flex flex-col items-center justify-center rounded-lg border-2 transition-all cursor-pointer w-20 h-14 text-center ${isError ? "border-[#f43f5e] bg-[#f43f5e]/20 animate-pulse" : slot.partId ? "border-[#10b981]/60 bg-[#10b981]/10" : "border-border/40 bg-card/60 hover:border-[#00f5ff]/40"}`,
                  style: {
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    transform: "translate(-50%, -50%)"
                  },
                  "data-ocid": `robot_building.slot.${slot.id}`,
                  children: slot.partId && placedPart ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-[#10b981] mb-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-bold leading-tight",
                        style: { color: placedPart.color, fontSize: "9px" },
                        children: placedPart.name
                      }
                    )
                  ] }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-muted-foreground",
                      style: { fontSize: "9px" },
                      children: slot.label
                    }
                  )
                },
                slot.id
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (testRunning || testSuccess) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                className: "absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20 backdrop-blur-sm",
                children: testRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { rotate: 360 },
                      transition: {
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear"
                      },
                      className: "w-16 h-16 rounded-full border-4 border-[#00f5ff]/30 border-t-[#00f5ff] mb-4"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[#00f5ff] font-bold",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "RUNNING TEST MISSION..."
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-16 w-16 text-[#10b981] mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-2xl font-black text-[#10b981]",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "TEST PASSED"
                    }
                  )
                ] })
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleTestRobot,
            disabled: !allPlaced || testRunning || testSuccess,
            "data-ocid": "robot_building.test_button",
            children: "Run Test Mission"
          }
        ) })
      ]
    }
  );
}
const REPAIR_SCENARIOS = {
  1: [
    {
      title: "Steering Fault",
      symptom: "Robot only moves to the LEFT — right side does not respond.",
      robotDesc: "Differential drive robot, 2 motors, battery, controller.",
      faultyPartId: "motor-r",
      parts: [
        {
          id: "motor-l",
          label: "Left Motor",
          color: "#7c3aed",
          description: "DC motor, 200 RPM"
        },
        {
          id: "motor-r",
          label: "Right Motor",
          color: "#7c3aed",
          description: "DC motor, 200 RPM"
        },
        {
          id: "battery",
          label: "Battery Pack",
          color: "#f43f5e",
          description: "7.4V LiPo"
        },
        {
          id: "controller",
          label: "Controller Board",
          color: "#e879f9",
          description: "Arduino Mega"
        }
      ],
      explanation: "One-sided movement means the RIGHT motor has failed. Left motor drives normally — robot curves left."
    },
    {
      title: "Power Cutout",
      symptom: "Robot starts then shuts down after 3 seconds. No movement.",
      robotDesc: "Mobile robot with battery, motor driver, and controller.",
      faultyPartId: "battery",
      parts: [
        {
          id: "battery",
          label: "Battery Pack",
          color: "#f43f5e",
          description: "7.4V LiPo"
        },
        {
          id: "motor-driver",
          label: "Motor Driver",
          color: "#10b981",
          description: "L298N driver"
        },
        {
          id: "controller",
          label: "Controller Board",
          color: "#e879f9",
          description: "Arduino Mega"
        },
        {
          id: "chassis",
          label: "Chassis Frame",
          color: "#00f5ff",
          description: "Structural base"
        }
      ],
      explanation: "Sudden shutdown after brief operation = battery failure (low capacity or bad cell causing voltage drop under load)."
    }
  ],
  2: [
    {
      title: "Sensor Blindness",
      symptom: "Robot crashes into walls — proximity sensor reads 0 constantly.",
      robotDesc: "Explorer robot with front ultrasonic sensor.",
      faultyPartId: "sensor-f",
      parts: [
        {
          id: "sensor-f",
          label: "Front Ultrasonic",
          color: "#f59e0b",
          description: "HC-SR04"
        },
        {
          id: "sensor-b",
          label: "Rear IR Sensor",
          color: "#f59e0b",
          description: "GP2Y0A21"
        },
        {
          id: "controller",
          label: "Controller Board",
          color: "#e879f9",
          description: "Arduino Mega"
        },
        {
          id: "motor-driver",
          label: "Motor Driver",
          color: "#10b981",
          description: "L298N"
        }
      ],
      explanation: "Constant 0 reading from proximity sensor = sensor hardware failure or disconnected signal pin. Replace front ultrasonic sensor."
    },
    {
      title: "Erratic Motion",
      symptom: "Robot moves in random directions — cannot follow commands.",
      robotDesc: "Programmable robot with controller, motors, and drivers.",
      faultyPartId: "controller",
      parts: [
        {
          id: "controller",
          label: "Controller Board",
          color: "#e879f9",
          description: "Arduino Mega"
        },
        {
          id: "motor-l",
          label: "Left Motor",
          color: "#7c3aed",
          description: "DC motor"
        },
        {
          id: "motor-r",
          label: "Right Motor",
          color: "#7c3aed",
          description: "DC motor"
        },
        {
          id: "battery",
          label: "Battery Pack",
          color: "#f43f5e",
          description: "7.4V LiPo"
        }
      ],
      explanation: "Random uncontrolled movement = corrupted firmware or fried microcontroller. Motor hardware works but logic is broken."
    }
  ],
  3: [
    {
      title: "Arm Failure",
      symptom: "Robotic arm twitches but won't hold positions — servo oscillates.",
      robotDesc: "Advanced robotic arm system with servo controller.",
      faultyPartId: "servo-ctrl",
      parts: [
        {
          id: "servo-ctrl",
          label: "Servo Controller",
          color: "#fb923c",
          description: "PCA9685 I2C"
        },
        {
          id: "arm-motor",
          label: "Arm Servo Motor",
          color: "#fb923c",
          description: "MG996R 10kg"
        },
        {
          id: "processor",
          label: "Raspberry Pi 4",
          color: "#e879f9",
          description: "Main processor"
        },
        {
          id: "power-module",
          label: "Power Module",
          color: "#f43f5e",
          description: "5V/3A regulator"
        },
        {
          id: "encoder",
          label: "Position Encoder",
          color: "#00f5ff",
          description: "AS5048A magnetic"
        }
      ],
      explanation: "Twitching/oscillating servo = faulty servo controller losing PWM signal integrity. Servo motor is fine — controller is failing."
    },
    {
      title: "Vision System Error",
      symptom: "Camera feed shows only black — robot cannot detect objects.",
      robotDesc: "Vision-guided robot with OpenCV camera module.",
      faultyPartId: "camera",
      parts: [
        {
          id: "camera",
          label: "Vision Camera",
          color: "#38bdf8",
          description: "OpenCV module"
        },
        {
          id: "processor",
          label: "Raspberry Pi 4",
          color: "#e879f9",
          description: "Main processor"
        },
        {
          id: "lidar",
          label: "Front LIDAR",
          color: "#f59e0b",
          description: "360° scanner"
        },
        {
          id: "battery",
          label: "Li-Ion Battery",
          color: "#f43f5e",
          description: "11.1V 5000mAh"
        },
        {
          id: "wifi",
          label: "WiFi Module",
          color: "#10b981",
          description: "ESP8266"
        }
      ],
      explanation: "Black camera feed = camera hardware failed or disconnected ribbon cable. Processor and other systems are working normally."
    }
  ]
};
function RobotRepair({ config, onGameEnd }) {
  const scenarios = REPAIR_SCENARIOS[config.difficulty];
  const [scenarioIdx, setScenarioIdx] = reactExports.useState(0);
  const scenario = scenarios[scenarioIdx];
  const [selected, setSelected] = reactExports.useState(null);
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
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
          correct / scenarios.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, scenarios.length]
  );
  function handleConfirm() {
    if (!selected || confirmed) return;
    const ok = selected === scenario.faultyPartId;
    setResult(ok);
    setConfirmed(true);
    if (ok) {
      setScore((s) => s + 300 * config.difficulty);
      setCorrect((c) => c + 1);
      setTimeout(() => {
        const next = scenarioIdx + 1;
        if (next >= scenarios.length) {
          endGame(true);
          return;
        }
        setScenarioIdx(next);
        setSelected(null);
        setConfirmed(false);
        setResult(null);
      }, 2e3);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
      setTimeout(() => {
        setSelected(null);
        setConfirmed(false);
        setResult(null);
      }, 2e3);
    }
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "robot_repair.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Robot Repair Diagnostics"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "A malfunctioning robot shows specific symptoms. Read the symptom carefully and identify which component is faulty." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Wrong diagnosis costs a life. Root-cause analysis required." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "robot_repair.start_button",
                  children: "Begin Diagnostics"
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
      "data-ocid": "robot_repair.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
              children: [
                "Case ",
                scenarioIdx + 1,
                "/",
                scenarios.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 shrink-0 border border-[#f59e0b]/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs font-bold text-[#f59e0b] mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: [
                "SYMPTOM REPORT: ",
                scenario.title
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-bold", children: scenario.symptom }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: scenario.robotDesc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-muted-foreground shrink-0",
            style: { fontFamily: "'Orbitron', sans-serif" },
            children: "CLICK THE FAULTY COMPONENT"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 flex-1", children: scenario.parts.map((part) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            type: "button",
            whileHover: { scale: 1.03 },
            whileTap: { scale: 0.97 },
            onClick: () => !confirmed && setSelected(part.id),
            className: "rounded-xl border-2 p-4 text-left transition-all",
            style: {
              borderColor: confirmed && part.id === scenario.faultyPartId ? "#10b981" : confirmed && part.id === selected ? "#f43f5e" : selected === part.id ? part.color : `${part.color}40`,
              backgroundColor: confirmed && part.id === scenario.faultyPartId ? "#10b98115" : selected === part.id ? `${part.color}15` : "transparent"
            },
            "data-ocid": `robot_repair.part.${part.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", style: { color: part.color }, children: part.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: part.description }),
              confirmed && part.id === scenario.faultyPartId && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] mt-1" }),
              confirmed && part.id === selected && part.id !== scenario.faultyPartId && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] mt-1" })
            ]
          },
          part.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: result !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-xs ${result ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                children: result ? `Correct diagnosis! ${scenario.explanation}` : `Wrong component. ${scenario.explanation}`
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleConfirm,
            disabled: !selected || confirmed,
            "data-ocid": "robot_repair.confirm_button",
            children: "Confirm Diagnosis"
          }
        ) })
      ]
    }
  );
}
const UPGRADE_MISSIONS = {
  1: [
    {
      title: "Obstacle Avoidance Mission",
      missionDesc: "Robot must navigate a field with obstacles. Currently only drives forward — needs to detect and avoid walls.",
      baseCapabilities: ["Move Forward", "Move Backward"],
      requiredUpgrades: ["proximity-sensor", "servo-steering"],
      availableUpgrades: [
        {
          id: "proximity-sensor",
          label: "Proximity Sensor",
          color: "#f59e0b",
          capability: "Obstacle detection",
          cost: 150
        },
        {
          id: "servo-steering",
          label: "Servo Steering",
          color: "#10b981",
          capability: "Directional control",
          cost: 200
        },
        {
          id: "camera",
          label: "Vision Camera",
          color: "#38bdf8",
          capability: "Visual navigation",
          cost: 400
        },
        {
          id: "extra-battery",
          label: "Extra Battery",
          color: "#f43f5e",
          capability: "Extended runtime",
          cost: 120
        }
      ],
      explanation: "Obstacle avoidance requires proximity sensor (detect wall) + servo steering (turn away). Camera and extra battery are not necessary."
    }
  ],
  2: [
    {
      title: "Object Sorting Mission",
      missionDesc: "Robot must pick up colored objects and sort them into bins. Currently only navigates — needs manipulation and color detection.",
      baseCapabilities: ["Navigate Grid", "Basic Sensors"],
      requiredUpgrades: ["color-sensor", "gripper-arm", "servo-controller"],
      availableUpgrades: [
        {
          id: "color-sensor",
          label: "Color Sensor (TCS3200)",
          color: "#00f5ff",
          capability: "Color identification",
          cost: 180
        },
        {
          id: "gripper-arm",
          label: "Gripper Arm",
          color: "#fb923c",
          capability: "Object manipulation",
          cost: 350
        },
        {
          id: "servo-controller",
          label: "Servo Controller (PCA9685)",
          color: "#7c3aed",
          capability: "Arm precision control",
          cost: 220
        },
        {
          id: "gps-module",
          label: "GPS Module",
          color: "#10b981",
          capability: "Outdoor positioning",
          cost: 300
        },
        {
          id: "speaker",
          label: "Speaker Module",
          color: "#e879f9",
          capability: "Audio output",
          cost: 80
        }
      ],
      explanation: "Sorting requires: color sensor (identify object), gripper arm (pick up), servo controller (control arm). GPS and speaker are unnecessary."
    }
  ],
  3: [
    {
      title: "Autonomous Mapping Mission",
      missionDesc: "Robot must map an unknown environment, detect hazards, and transmit a floor plan wirelessly.",
      baseCapabilities: ["Drive Motorized", "Basic Proximity"],
      requiredUpgrades: [
        "lidar-360",
        "imu-sensor",
        "wifi-module",
        "onboard-processor"
      ],
      availableUpgrades: [
        {
          id: "lidar-360",
          label: "LIDAR 360° Scanner",
          color: "#f59e0b",
          capability: "Full room scanning",
          cost: 800
        },
        {
          id: "imu-sensor",
          label: "IMU Sensor (MPU6050)",
          color: "#00f5ff",
          capability: "Orientation tracking",
          cost: 120
        },
        {
          id: "wifi-module",
          label: "WiFi Module (ESP8266)",
          color: "#10b981",
          capability: "Wireless transmission",
          cost: 90
        },
        {
          id: "onboard-processor",
          label: "Onboard Processor (RPi4)",
          color: "#e879f9",
          capability: "SLAM computation",
          cost: 600
        },
        {
          id: "ir-sensor",
          label: "IR Sensor Array",
          color: "#f59e0b",
          capability: "Line detection",
          cost: 60
        },
        {
          id: "extra-battery",
          label: "High-Cap Battery",
          color: "#f43f5e",
          capability: "Extended mission",
          cost: 200
        }
      ],
      explanation: "Autonomous mapping (SLAM) needs: LIDAR (scan environment), IMU (track orientation), WiFi (transmit map), RPi4 (run SLAM algorithm)."
    }
  ]
};
function RobotUpgrade({ config, onGameEnd }) {
  const missions = UPGRADE_MISSIONS[config.difficulty];
  const [missionIdx, setMissionIdx] = reactExports.useState(0);
  const mission = missions[missionIdx];
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
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          correct / missions.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, missions.length]
  );
  function toggleUpgrade(id) {
    if (submitted) return;
    setSelected(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function handleSubmit() {
    if (submitted || selected.length === 0) return;
    setSubmitted(true);
    const required = mission.requiredUpgrades;
    const missing = required.filter((r) => !selected.includes(r));
    const extra = selected.filter((s) => !required.includes(s));
    const ok = missing.length === 0 && extra.length === 0;
    setResult({ ok, missing, extra });
    if (ok) {
      setScore((s) => s + 400 * config.difficulty);
      setCorrect((c) => c + 1);
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
      }, 2200);
    } else {
      setTimeout(() => {
        setSelected([]);
        setSubmitted(false);
        setResult(null);
      }, 2500);
    }
  }
  const totalCost = selected.reduce((sum, id) => {
    const upg = mission.availableUpgrades.find((u) => u.id === id);
    return sum + ((upg == null ? void 0 : upg.cost) ?? 0);
  }, 0);
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "robot_upgrade.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
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
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#10b981" },
                  children: "Robot Upgrade Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "A basic robot needs upgrades for a specific mission. Read the mission requirements and select ONLY the necessary components." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Over-upgrading or missing components = mission failure. Choose precisely." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "robot_upgrade.start_button",
                  children: "Configure Upgrades"
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
      "data-ocid": "robot_upgrade.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#10b981" },
              children: mission.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Budget Used:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: totalCost }),
            " coins"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 shrink-0 border border-[#10b981]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold text-[#10b981] mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "MISSION BRIEF"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: mission.missionDesc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: mission.baseCapabilities.map((cap) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground",
              children: cap
            },
            cap
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-muted-foreground shrink-0",
            style: { fontFamily: "'Orbitron', sans-serif" },
            children: "SELECT REQUIRED UPGRADES"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 overflow-y-auto", children: mission.availableUpgrades.map((upg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            type: "button",
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => toggleUpgrade(upg.id),
            className: "rounded-xl border-2 p-3 text-left transition-all",
            style: {
              borderColor: selected.includes(upg.id) ? upg.color : `${upg.color}30`,
              backgroundColor: selected.includes(upg.id) ? `${upg.color}15` : "transparent"
            },
            "data-ocid": `robot_upgrade.item.${upg.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", style: { color: upg.color }, children: upg.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", style: { color: upg.color }, children: [
                  upg.cost,
                  "c"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: upg.capability }),
              selected.includes(upg.id) && (result == null ? void 0 : result.extra.includes(upg.id)) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#f43f5e] mt-1", children: "Not required for this mission" })
            ]
          },
          upg.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: result && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 ${result.ok ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-xs ${result.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                children: result.ok ? `Perfect selection! ${mission.explanation}` : `${result.missing.length > 0 ? `Missing: ${result.missing.join(", ")}. ` : ""}${result.extra.length > 0 ? `Not needed: ${result.extra.join(", ")}. ` : ""}${mission.explanation}`
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: selected.length === 0 || submitted,
            "data-ocid": "robot_upgrade.submit_button",
            children: "Deploy Upgrades"
          }
        ) })
      ]
    }
  );
}
function RobotBuilding({ config, onGameEnd }) {
  if (config.gameId === "robot-repair")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RobotRepair, { config, onGameEnd });
  if (config.gameId === "robot-upgrade")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RobotUpgrade, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AssemblyLine, { config, onGameEnd });
}
export {
  RobotBuilding as default
};
