import { j as jsxRuntimeExports, r as reactExports, m as motion, Z as Zap, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { C as Cpu } from "./cpu-DjqPbGA_.js";
const BAND_COLORS = {
  black: "#111",
  brown: "#7B3F00",
  red: "#e53e3e",
  orange: "#f59e0b",
  yellow: "#fef08a",
  green: "#10b981",
  blue: "#3b82f6",
  violet: "#7c3aed",
  gray: "#94a3b8",
  white: "#f8fafc",
  gold: "#f59e0b",
  silver: "#94a3b8"
};
const COMP_CHALLENGES = {
  1: [
    {
      id: "r1",
      kind: "resistor",
      displayName: "Carbon Film Resistor",
      colorBands: ["red", "red", "brown", "gold"],
      nameOptions: ["Resistor", "Capacitor", "Inductor", "Diode"],
      correctName: 0,
      valueQuestion: "Red-Red-Brown bands = ?",
      valueOptions: ["220 Ohm", "2.2K Ohm", "22 Ohm", "2200 Ohm"],
      correctValue: 0,
      functionOptions: [
        "Stores charge",
        "Limits current flow",
        "Allows one-way current",
        "Amplifies signal"
      ],
      correctFunction: 1,
      explanation: "A resistor with Red-Red-Brown = 22x10 = 220 Ohm. It limits current flow."
    },
    {
      id: "led1",
      kind: "led",
      displayName: "Light Emitting Diode",
      nameOptions: ["Transistor", "Resistor", "LED", "Capacitor"],
      correctName: 2,
      valueQuestion: "Typical forward voltage of a red LED?",
      valueOptions: ["0.3V", "1.8-2.2V", "5V", "12V"],
      correctValue: 1,
      functionOptions: [
        "Amplifies current",
        "Stores energy",
        "Emits light when forward biased",
        "Filters AC"
      ],
      correctFunction: 2,
      explanation: "An LED emits light when forward biased. Red LEDs have ~1.8-2.2V forward voltage."
    },
    {
      id: "cap1",
      kind: "capacitor",
      displayName: "Ceramic Capacitor",
      code: "104",
      nameOptions: ["Resistor", "Capacitor", "Transistor", "IC"],
      correctName: 1,
      valueQuestion: "Code '104' means?",
      valueOptions: ["104 pF", "100 nF (0.1 uF)", "1 uF", "10 uF"],
      correctValue: 1,
      functionOptions: [
        "Limits current",
        "Stores charge and energy in electric field",
        "Emits light",
        "Switches current"
      ],
      correctFunction: 1,
      explanation: "Code 104 = 100,000 pF = 0.1 uF. Capacitors store charge in an electric field."
    }
  ],
  2: [
    {
      id: "r2",
      kind: "resistor",
      displayName: "Metal Film Resistor",
      colorBands: ["orange", "orange", "red", "brown", "gold"],
      nameOptions: ["Resistor", "Fuse", "Inductor", "Varistor"],
      correctName: 0,
      valueQuestion: "Orange-Orange-Red-Brown (5-band) = ?",
      valueOptions: ["3.32K Ohm", "33.2K Ohm", "332 Ohm", "3320 Ohm"],
      correctValue: 1,
      functionOptions: [
        "Amplifies signal",
        "Limits current to protect components",
        "Oscillates frequency",
        "Detects light"
      ],
      correctFunction: 1,
      explanation: "5-band: 3-3-2 x 10^1 x gold tolerance = 33200 Ohm = 33.2K."
    },
    {
      id: "tr1",
      kind: "transistor",
      displayName: "NPN Transistor BC547",
      nameOptions: ["Diode", "Transistor", "SCR", "MOSFET"],
      correctName: 1,
      valueQuestion: "Which terminal of NPN controls current flow?",
      valueOptions: ["Emitter", "Collector", "Base", "Gate"],
      correctValue: 2,
      functionOptions: [
        "Only passes current one way",
        "Amplifies or switches current via base signal",
        "Stores charge",
        "Generates oscillation"
      ],
      correctFunction: 1,
      explanation: "An NPN transistor uses the Base to control current between Collector and Emitter."
    },
    {
      id: "d1",
      kind: "diode",
      displayName: "1N4007 Rectifier Diode",
      nameOptions: ["LED", "Zener Diode", "Rectifier Diode", "Transistor"],
      correctName: 2,
      valueQuestion: "Maximum reverse voltage of 1N4007?",
      valueOptions: ["50V", "200V", "1000V", "400V"],
      correctValue: 2,
      functionOptions: [
        "Emits infrared light",
        "Allows current in one direction only",
        "Amplifies RF signals",
        "Varies capacitance"
      ],
      correctFunction: 1,
      explanation: "The 1N4007 handles up to 1000V reverse voltage and is used in AC-to-DC conversion."
    }
  ],
  3: [
    {
      id: "ic1",
      kind: "ic_chip",
      displayName: "NE555 Timer IC",
      nameOptions: [
        "Microcontroller",
        "Op-Amp",
        "555 Timer IC",
        "Voltage Regulator"
      ],
      correctName: 2,
      valueQuestion: "In astable mode, what does the 555 timer produce?",
      valueOptions: [
        "DC voltage only",
        "Continuous square wave pulses",
        "Sine waves",
        "Random noise"
      ],
      correctValue: 1,
      functionOptions: [
        "Regulates voltage",
        "Amplifies audio",
        "Generates timing pulses and oscillator signals",
        "Converts AC to DC"
      ],
      correctFunction: 2,
      explanation: "The NE555 in astable mode produces a continuous square wave."
    },
    {
      id: "r3",
      kind: "resistor",
      displayName: "Power Resistor",
      colorBands: ["brown", "black", "black", "red", "brown"],
      nameOptions: [
        "Ceramic Resistor",
        "Power Wirewound Resistor",
        "Thermistor",
        "Varistor"
      ],
      correctName: 1,
      valueQuestion: "Brown-Black-Black-Red (5-band) = ?",
      valueOptions: ["100 Ohm", "1000 Ohm (1K)", "10000 Ohm (10K)", "100K"],
      correctValue: 2,
      functionOptions: [
        "Varies resistance with temperature",
        "Dissipates high power while limiting current",
        "Detects voltage spikes",
        "Stores charge"
      ],
      correctFunction: 1,
      explanation: "1-0-0 x 10^2 = 10K. Power resistors handle high wattage dissipation."
    },
    {
      id: "cap2",
      kind: "capacitor",
      displayName: "Electrolytic Capacitor",
      code: "470uF 35V",
      nameOptions: [
        "Ceramic Capacitor",
        "Film Capacitor",
        "Electrolytic Capacitor",
        "Supercapacitor"
      ],
      correctName: 2,
      valueQuestion: "Why is polarity critical for electrolytic capacitors?",
      valueOptions: [
        "It affects resistance value",
        "Reverse polarity causes catastrophic failure",
        "It only changes capacitance",
        "No reason - polarity doesn't matter"
      ],
      correctValue: 1,
      functionOptions: [
        "Only used in RF circuits",
        "High capacitance bulk energy storage and power supply filtering",
        "Generates oscillations",
        "Limits current"
      ],
      correctFunction: 1,
      explanation: "Electrolytic capacitors are polarized. Reverse voltage destroys the oxide layer causing violent failure."
    }
  ]
};
const MM_TASKS = [
  {
    id: "mm1",
    description: "Measure voltage across R1 in a 9V series circuit.",
    circuitLabel: "Battery(9V) - R1(470) - R2(1k)",
    correctMode: "V",
    probeRed: "R1 positive end",
    probeBlack: "R1 negative end",
    displayValue: "2.93V",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "R1 positive end",
      "Battery positive",
      "R2 positive end",
      "Ground"
    ],
    blackOptions: [
      "R1 negative end",
      "Battery negative",
      "R2 positive end",
      "Junction"
    ],
    explanation: "To measure voltage across R1: set to V mode, place red probe on high side of R1, black on low side. Voltage divider: 9x470/1470 = 2.93V."
  },
  {
    id: "mm2",
    description: "Measure total current flowing from the battery.",
    circuitLabel: "5V Battery - 1k Resistor",
    correctMode: "A",
    probeRed: "Battery positive terminal",
    probeBlack: "Circuit input wire",
    displayValue: "5mA",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "Battery positive terminal",
      "Resistor high end",
      "Junction",
      "Ground"
    ],
    blackOptions: [
      "Circuit input wire",
      "Resistor low end",
      "Ground",
      "Battery negative"
    ],
    explanation: "Ammeter must be in SERIES with the circuit. Break the circuit and insert ammeter. I = V/R = 5/1000 = 5mA."
  },
  {
    id: "mm3",
    description: "Measure resistance of an unknown resistor (circuit unpowered).",
    circuitLabel: "Unpowered - isolated 560 Ohm resistor",
    correctMode: "Ohm",
    probeRed: "Resistor lead 1",
    probeBlack: "Resistor lead 2",
    displayValue: "560 Ohm",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: ["Resistor lead 1", "Power rail", "Ground", "Junction"],
    blackOptions: ["Resistor lead 2", "Ground", "Power rail", "Component leg"],
    explanation: "Resistance must be measured with circuit UNPOWERED. Place probes on both legs of isolated resistor. Ohm mode only."
  },
  {
    id: "mm4",
    description: "Measure voltage across LED to check it's forward biased.",
    circuitLabel: "3.3V supply - 220 Ohm - LED - Ground",
    correctMode: "V",
    probeRed: "LED anode",
    probeBlack: "LED cathode",
    displayValue: "2.1V",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: ["LED anode", "Resistor input", "Power rail", "Ground"],
    blackOptions: ["LED cathode", "Ground", "Resistor output", "Junction"],
    explanation: "Measure LED forward voltage: red on anode (+), black on cathode (-). Typical red LED: 1.8-2.2V."
  },
  {
    id: "mm5",
    description: "Check if switch is open or closed (continuity test).",
    circuitLabel: "Switch in series with buzzer",
    correctMode: "Ohm",
    probeRed: "Switch terminal 1",
    probeBlack: "Switch terminal 2",
    displayValue: "0.3 Ohm (closed)",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "Switch terminal 1",
      "Power rail",
      "Buzzer positive",
      "Ground"
    ],
    blackOptions: [
      "Switch terminal 2",
      "Buzzer negative",
      "Ground",
      "Power rail"
    ],
    explanation: "Continuity/resistance mode tests switch. Near 0 Ohm = closed (conducting). High reading = open (not conducting)."
  },
  {
    id: "mm6",
    description: "Measure supply voltage at power rail.",
    circuitLabel: "12V power supply connected to breadboard",
    correctMode: "V",
    probeRed: "Power rail (+)",
    probeBlack: "Ground rail (-)",
    displayValue: "12.02V",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "Power rail (+)",
      "IC Vcc pin",
      "Capacitor positive",
      "Component output"
    ],
    blackOptions: [
      "Ground rail (-)",
      "IC GND pin",
      "Capacitor negative",
      "Circuit return"
    ],
    explanation: "Always verify supply voltage first in any debug session. Red to + rail, black to ground. Compare to expected 12V."
  },
  {
    id: "mm7",
    description: "Measure collector current through NPN transistor.",
    circuitLabel: "12V - 470 Ohm - NPN Collector - Emitter - GND",
    correctMode: "A",
    probeRed: "Collector series point",
    probeBlack: "Emitter junction",
    displayValue: "25.5mA",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "Collector series point",
      "Base connection",
      "Power rail",
      "Emitter"
    ],
    blackOptions: ["Emitter junction", "Ground", "Collector", "Power rail"],
    explanation: "To measure collector current: ammeter in series with collector path. Break wire between collector resistor and collector pin."
  },
  {
    id: "mm8",
    description: "Measure impedance of an unpowered capacitor.",
    circuitLabel: "1000uF electrolytic capacitor isolated",
    correctMode: "Ohm",
    probeRed: "Positive leg (+)",
    probeBlack: "Negative leg (-)",
    displayValue: "Infinite (open)",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "Positive leg (+)",
      "Junction point",
      "Power supply",
      "Neutral point"
    ],
    blackOptions: [
      "Negative leg (-)",
      "Ground",
      "Power rail",
      "Component body"
    ],
    explanation: "A good capacitor reads very high (near-infinite) resistance in DC. Initially shows low then rises as capacitor charges from the tester current."
  },
  {
    id: "mm9",
    description: "Verify battery voltage before use in a project.",
    circuitLabel: "9V PP3 battery",
    correctMode: "V",
    probeRed: "Battery + terminal",
    probeBlack: "Battery - terminal",
    displayValue: "8.73V",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: ["Battery + terminal", "Ground", "Junction", "Neutral"],
    blackOptions: ["Battery - terminal", "Ground", "Power rail", "Junction"],
    explanation: "Always test battery before use. A 9V battery below 7.5V under load may not power circuits reliably. Check with no load first."
  },
  {
    id: "mm10",
    description: "Measure voltage drop across a diode in forward bias.",
    circuitLabel: "5V - 1k - 1N4007 Diode - GND",
    correctMode: "V",
    probeRed: "Diode anode",
    probeBlack: "Diode cathode",
    displayValue: "0.67V",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: ["Diode anode", "Power rail", "Cathode", "Ground"],
    blackOptions: ["Diode cathode", "Ground", "Anode", "Junction"],
    explanation: "Silicon diode forward voltage drop: ~0.6-0.7V. Schottky: ~0.2-0.4V. LED: 1.8-3.5V depending on color."
  },
  {
    id: "mm11",
    description: "Measure voltage between two nodes in a voltage divider.",
    circuitLabel: "12V - 10k - middle node - 10k - GND",
    correctMode: "V",
    probeRed: "Middle node junction",
    probeBlack: "Ground rail",
    displayValue: "6.0V",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "Middle node junction",
      "Top resistor input",
      "Bottom resistor output",
      "Power rail"
    ],
    blackOptions: [
      "Ground rail",
      "Junction",
      "Component lead",
      "Power positive"
    ],
    explanation: "Equal resistors in voltage divider: V_mid = V_supply/2 = 12/2 = 6V. Red to measured node, black to common ground."
  },
  {
    id: "mm12",
    description: "Confirm LED is not reversed in circuit before powering.",
    circuitLabel: "LED in series with 330 Ohm resistor (unpowered)",
    correctMode: "Ohm",
    probeRed: "LED anode candidate",
    probeBlack: "LED cathode candidate",
    displayValue: "Low in one direction only",
    modeOptions: ["V", "A", "Ohm"],
    redOptions: [
      "LED anode candidate",
      "LED flat side",
      "Resistor lead",
      "Power positive"
    ],
    blackOptions: [
      "LED cathode candidate",
      "LED round side",
      "Ground",
      "Junction"
    ],
    explanation: "Use diode test or Ohm mode: low resistance in one direction (forward) = correct polarity. Infinite both ways = LED dead."
  }
];
const JOINT_COLORS = {
  good: "#10b981",
  cold: "#94a3b8",
  bridge: "#f43f5e",
  insufficient: "#f59e0b"
};
const JOINT_LABELS = {
  good: "Good Joint",
  cold: "Cold Joint",
  bridge: "Solder Bridge",
  insufficient: "Insufficient"
};
const JOINT_DESCRIPTIONS = {
  good: "Smooth, shiny, cone-shaped. Component leg surrounded evenly. No voids.",
  cold: "Dull, grainy, cracked surface. Poor thermal bond. High resistance connection.",
  bridge: "Excess solder connects two adjacent pads. Creates short circuit between traces.",
  insufficient: "Too little solder. Pad not fully wetted. Weak mechanical and electrical connection."
};
const PCB_INSPECTIONS = [
  {
    id: "pcb1",
    title: "Arduino Shield PCB",
    description: "Inspect header pins on a freshly soldered Arduino shield.",
    joints: [
      { id: 1, type: "good", visual: "Bright cone", x: 15, y: 30 },
      { id: 2, type: "cold", visual: "Dull gray", x: 35, y: 30 },
      { id: 3, type: "good", visual: "Smooth cone", x: 55, y: 30 },
      { id: 4, type: "bridge", visual: "Solder blob", x: 75, y: 30 },
      { id: 5, type: "insufficient", visual: "Thin layer", x: 20, y: 60 },
      { id: 6, type: "good", visual: "Round dome", x: 45, y: 60 },
      { id: 7, type: "cold", visual: "Grainy", x: 65, y: 60 },
      { id: 8, type: "good", visual: "Bright dome", x: 85, y: 60 }
    ]
  },
  {
    id: "pcb2",
    title: "Power Supply Board",
    description: "Check solder quality on a 12V power supply PCB.",
    joints: [
      { id: 1, type: "cold", visual: "Gray matte", x: 12, y: 25 },
      { id: 2, type: "good", visual: "Shiny cone", x: 32, y: 25 },
      { id: 3, type: "bridge", visual: "Short circuit", x: 52, y: 25 },
      { id: 4, type: "good", visual: "Smooth dome", x: 72, y: 25 },
      { id: 5, type: "insufficient", visual: "Sparse", x: 20, y: 55 },
      { id: 6, type: "good", visual: "Full cone", x: 42, y: 55 },
      { id: 7, type: "good", visual: "Clean", x: 62, y: 55 },
      { id: 8, type: "cold", visual: "Dull", x: 82, y: 55 }
    ]
  },
  {
    id: "pcb3",
    title: "LED Matrix Board",
    description: "Inspect all 10 solder joints on a 4x4 LED matrix section.",
    joints: [
      { id: 1, type: "good", visual: "Bright", x: 10, y: 20 },
      { id: 2, type: "good", visual: "Dome", x: 30, y: 20 },
      { id: 3, type: "cold", visual: "Dull", x: 50, y: 20 },
      { id: 4, type: "bridge", visual: "Blob", x: 70, y: 20 },
      { id: 5, type: "good", visual: "Clean", x: 90, y: 20 },
      { id: 6, type: "insufficient", visual: "Sparse", x: 10, y: 50 },
      { id: 7, type: "good", visual: "Shiny", x: 30, y: 50 },
      { id: 8, type: "cold", visual: "Grainy", x: 50, y: 50 },
      { id: 9, type: "good", visual: "Full", x: 70, y: 50 },
      { id: 10, type: "bridge", visual: "Short", x: 90, y: 50 }
    ]
  }
];
function ComponentIdentifierGame({ config, onGameEnd }) {
  const challenges = COMP_CHALLENGES[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [step, setStep] = reactExports.useState("name");
  const [selected, setSelected] = reactExports.useState(null);
  const [answered, setAnswered] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [flash, setFlash] = reactExports.useState(null);
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
          total > 0 ? correct / total * 100 : 0,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, total]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  const challenge = challenges[idx];
  const stepOrder = ["name", "value", "function"];
  const stepQuestions = {
    name: {
      options: challenge.nameOptions,
      correct: challenge.correctName,
      question: "Identify this component"
    },
    value: {
      options: challenge.valueOptions,
      correct: challenge.correctValue,
      question: challenge.valueQuestion
    },
    function: {
      options: challenge.functionOptions,
      correct: challenge.correctFunction,
      question: "What is the primary function of this component?"
    }
  };
  const stepColors = {
    name: "#00f5ff",
    value: "#f59e0b",
    function: "#10b981"
  };
  const stepLabels = {
    name: "NAME",
    value: "VALUE",
    function: "FUNCTION"
  };
  function handleAnswer(optIdx) {
    if (answered || !gameStarted) return;
    const { correct: correctIdx } = stepQuestions[step];
    setSelected(optIdx);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === correctIdx) {
      setScore((s) => s + 150 * config.difficulty);
      setCorrect((c) => c + 1);
      setFlash("correct");
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
      setFlash("wrong");
    }
    setTimeout(() => {
      setFlash(null);
      setSelected(null);
      setAnswered(false);
      const ci = stepOrder.indexOf(step);
      const nextStep = stepOrder[ci + 1];
      if (nextStep) {
        setStep(nextStep);
      } else {
        const nextIdx = idx + 1;
        if (nextIdx >= challenges.length) {
          endGame(true);
        } else {
          setIdx(nextIdx);
          setStep("name");
        }
      }
    }, 1400);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "electronics_lab.page",
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
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Component Identifier"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Electronic components appear one at a time. Identify name, decode value, and classify function." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f43f5e] text-xs mb-6", children: "Three questions per component. Wrong answers cost lives." }),
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
                  "data-ocid": "electronics_lab.start_button",
                  children: "Enter Lab"
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
      "data-ocid": "electronics_lab.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${timeLeft / config.timeLimit * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            className: `glass-card rounded-xl p-5 shrink-0 border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            "data-ocid": "electronics_lab.component_display",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "w-24 h-16 rounded-lg flex items-center justify-center shrink-0",
                  style: { background: "#0a0a1a" },
                  children: [
                    challenge.kind === "resistor" && challenge.colorBands && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 h-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full w-2 rounded-sm",
                          style: { backgroundColor: "#d4a574" }
                        }
                      ),
                      challenge.colorBands.map((band, bi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full w-2 rounded-sm",
                          style: { backgroundColor: BAND_COLORS[band] ?? "#888" }
                        },
                        `b-${bi}`
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full w-2 rounded-sm",
                          style: { backgroundColor: "#d4a574" }
                        }
                      )
                    ] }),
                    challenge.kind === "capacitor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-10 rounded-b-lg border-2 flex items-center justify-center",
                          style: {
                            borderColor: "#7c3aed",
                            backgroundColor: "#7c3aed20"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-bold",
                              style: { color: "#7c3aed", fontSize: "9px" },
                              children: challenge.code
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0.5 h-3 bg-[#94a3b8]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0.5 h-3 bg-[#94a3b8]" })
                      ] })
                    ] }),
                    challenge.kind === "led" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-8 rounded-full border-2",
                          style: {
                            borderColor: "#00f5ff",
                            backgroundColor: "#00f5ff30",
                            boxShadow: "0 0 12px #00f5ff"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0.5 h-4 bg-[#94a3b8]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0.5 h-3 bg-[#94a3b8]" })
                      ] })
                    ] }),
                    challenge.kind === "diode" && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "60", height: "40", viewBox: "0 0 60 40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "0",
                          y1: "20",
                          x2: "60",
                          y2: "20",
                          stroke: "#94a3b8",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "polygon",
                        {
                          points: "20,8 40,20 20,32",
                          fill: "#f59e0b30",
                          stroke: "#f59e0b",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "40",
                          y1: "8",
                          x2: "40",
                          y2: "32",
                          stroke: "#f59e0b",
                          strokeWidth: "2"
                        }
                      )
                    ] }),
                    challenge.kind === "transistor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "60", height: "50", viewBox: "0 0 60 50", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "30",
                          cy: "25",
                          r: "18",
                          fill: "#10b98120",
                          stroke: "#10b981",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "12",
                          y1: "25",
                          x2: "22",
                          y2: "25",
                          stroke: "#10b981",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "22",
                          y1: "12",
                          x2: "22",
                          y2: "38",
                          stroke: "#10b981",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "22",
                          y1: "16",
                          x2: "38",
                          y2: "8",
                          stroke: "#10b981",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "22",
                          y1: "34",
                          x2: "38",
                          y2: "42",
                          stroke: "#10b981",
                          strokeWidth: "2"
                        }
                      )
                    ] }),
                    challenge.kind === "ic_chip" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "w-16 h-12 rounded border-2 relative flex items-center justify-center",
                        style: {
                          borderColor: "#e879f9",
                          backgroundColor: "#e879f910"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-bold",
                              style: { color: "#e879f9", fontSize: "8px" },
                              children: "NE555"
                            }
                          ),
                          [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "absolute w-1 h-1 rounded-full bg-[#e879f9]",
                              style: { left: "-3px", top: `${25 + i * 16}%` }
                            },
                            `p-${i}`
                          )),
                          [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "absolute w-1 h-1 rounded-full bg-[#e879f9]",
                              style: { right: "-3px", top: `${25 + i * 16}%` }
                            },
                            `p2-${i}`
                          ))
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      "COMPONENT #",
                      idx + 1
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-black text-foreground", children: challenge.displayName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-2", children: stepOrder.map((s, si) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2 h-2 rounded-full",
                      style: {
                        backgroundColor: si < stepOrder.indexOf(step) ? "#10b981" : si === stepOrder.indexOf(step) ? stepColors[step] : "#374151"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs",
                      style: {
                        color: s === step ? stepColors[step] : "#6b7280",
                        fontSize: "9px",
                        fontFamily: "'Orbitron', sans-serif"
                      },
                      children: stepLabels[s]
                    }
                  )
                ] }, s)) })
              ] })
            ] })
          },
          `${challenge.id}-${step}`
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-3 shrink-0",
            style: { borderLeft: `3px solid ${stepColors[step]}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", style: { color: stepColors[step] }, children: [
                stepLabels[step],
                ":",
                " "
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: stepQuestions[step].question })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 flex-1", children: stepQuestions[step].options.map((opt, i) => {
          let bs = "border-border/30 hover:border-[#f59e0b]/40";
          if (answered) {
            if (i === stepQuestions[step].correct)
              bs = "border-[#10b981] bg-[#10b981]/10";
            else if (i === selected) bs = "border-[#f43f5e] bg-[#f43f5e]/10";
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileHover: !answered ? { scale: 1.02 } : {},
              whileTap: !answered ? { scale: 0.98 } : {},
              onClick: () => handleAnswer(i),
              disabled: answered,
              className: `glass-card rounded-xl p-3 border text-sm cursor-pointer transition-all text-left ${bs}`,
              "data-ocid": `electronics_lab.option.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                answered && i === stepQuestions[step].correct && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] shrink-0" }),
                answered && i === selected && i !== stepQuestions[step].correct && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] shrink-0" }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Note: " }),
              challenge.explanation
            ] })
          }
        ) })
      ]
    }
  );
}
function MultimeterMasterGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 8 : 12;
  const tasks = MM_TASKS.slice(0, count);
  const [idx, setIdx] = reactExports.useState(0);
  const [modeSelected, setModeSelected] = reactExports.useState(null);
  const [redSelected, setRedSelected] = reactExports.useState(null);
  const [blackSelected, setBlackSelected] = reactExports.useState(null);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
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
          total > 0 ? correct / total * 100 : 0,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, total]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const task = tasks[idx];
  function handleSubmit() {
    if (submitted) return;
    const modeOk = modeSelected === task.correctMode;
    const redOk = redSelected === task.probeRed;
    const blackOk = blackSelected === task.probeBlack;
    const ok = modeOk && redOk && blackOk;
    setSubmitted(true);
    setResult(ok);
    setTotal((t) => t + 1);
    if (ok) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
    setTimeout(() => {
      const n = idx + 1;
      if (n >= tasks.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setModeSelected(null);
      setRedSelected(null);
      setBlackSelected(null);
      setSubmitted(false);
      setResult(null);
    }, 2e3);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "multimeter_master.page",
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
                  style: { color: "#00f5ff" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
                  children: "Multimeter Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Circuit diagrams are shown. Select the correct multimeter mode (V/A/Ohm), place the red probe, and place the black probe to take each measurement." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Correct probe placement is critical. Wrong mode or placement gives incorrect readings or damages equipment." }),
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
                  "data-ocid": "multimeter_master.start_button",
                  children: "Begin Measurements"
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
      "data-ocid": "multimeter_master.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all",
                style: { width: `${timeLeft / config.timeLimit * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#00f5ff]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs font-bold mb-1",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
              children: [
                "TASK ",
                idx + 1,
                "/",
                tasks.length,
                ": ",
                task.description
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: task.circuitLabel }),
          submitted && result && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-[#10b981] mt-1", children: [
            "Reading: ",
            task.displayValue
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "SELECT MEASUREMENT MODE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: task.modeOptions.map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: () => {
                if (!submitted) setModeSelected(mode);
              },
              className: "flex-1 rounded-xl border-2 py-3 font-black text-xl transition-all",
              style: {
                borderColor: modeSelected === mode ? "#00f5ff" : "#374151",
                backgroundColor: modeSelected === mode ? "#00f5ff20" : "transparent",
                color: modeSelected === mode ? "#00f5ff" : "#6b7280",
                fontFamily: "'Orbitron', sans-serif"
              },
              "data-ocid": `multimeter_master.mode.${mode}`,
              children: mode
            },
            mode
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs mb-2",
                style: { fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" },
                children: "RED PROBE (+)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: task.redOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileHover: { scale: 1.01 },
                whileTap: { scale: 0.99 },
                onClick: () => {
                  if (!submitted) setRedSelected(opt);
                },
                className: "rounded-lg border px-2 py-1.5 text-xs font-bold transition-all text-left",
                style: {
                  borderColor: redSelected === opt ? "#f43f5e" : "#374151",
                  backgroundColor: redSelected === opt ? "#f43f5e20" : "transparent",
                  color: redSelected === opt ? "#f43f5e" : "#94a3b8"
                },
                "data-ocid": `multimeter_master.red.${opt.replace(/ /g, "_")}`,
                children: opt
              },
              opt
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs mb-2",
                style: { fontFamily: "'Orbitron', sans-serif", color: "#6b7280" },
                children: "BLACK PROBE (-)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: task.blackOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileHover: { scale: 1.01 },
                whileTap: { scale: 0.99 },
                onClick: () => {
                  if (!submitted) setBlackSelected(opt);
                },
                className: "rounded-lg border px-2 py-1.5 text-xs font-bold transition-all text-left",
                style: {
                  borderColor: blackSelected === opt ? "#94a3b8" : "#374151",
                  backgroundColor: blackSelected === opt ? "#94a3b820" : "transparent",
                  color: blackSelected === opt ? "#94a3b8" : "#4b5563"
                },
                "data-ocid": `multimeter_master.black.${opt.replace(/ /g, "_")}`,
                children: opt
              },
              opt
            )) })
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
                  result ? "Correct measurement setup! " : "Wrong configuration. ",
                  task.explanation
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
            disabled: !modeSelected || !redSelected || !blackSelected || submitted,
            "data-ocid": "multimeter_master.measure_button",
            children: "Take Measurement"
          }
        )
      ]
    }
  );
}
function SolderingChallengeGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const inspections = PCB_INSPECTIONS.slice(0, count);
  const [inspIdx, setInspIdx] = reactExports.useState(0);
  const [jointIdx, setJointIdx] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(null);
  const [answered, setAnswered] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
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
          total > 0 ? correct / total * 100 : 0,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, total]
  );
  const insp = inspections[inspIdx];
  const joint = insp.joints[jointIdx];
  function handleClassify(type) {
    if (answered || !gameStarted) return;
    setSelected(type);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (type === joint.type) {
      setScore((s) => s + 150 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
    setTimeout(() => {
      const nextJ = jointIdx + 1;
      if (nextJ >= insp.joints.length) {
        const nextI = inspIdx + 1;
        if (nextI >= inspections.length) {
          endGame(true);
          return;
        }
        setInspIdx(nextI);
        setJointIdx(0);
      } else setJointIdx(nextJ);
      setSelected(null);
      setAnswered(false);
    }, 1600);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "soldering_challenge.page",
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
                  style: { color: "#e879f9" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#e879f9" },
                  children: "PCB Soldering Inspector"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "PCBs with solder joints are shown. Classify each joint as Good, Cold, Bridge, or Insufficient. Identify which joints need rework." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Quality control inspector role: every bad joint detected prevents field failures in real devices." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "soldering_challenge.start_button",
                  children: "Start Inspection"
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
      "data-ocid": "soldering_challenge.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#e879f9" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#e879f9" },
              children: [
                "Joint ",
                jointIdx + 1,
                "/",
                insp.joints.length
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#e879f9]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold mb-1",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#e879f9" },
              children: insp.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: insp.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass rounded-xl border border-border/30 p-2 shrink-0 relative overflow-hidden",
            style: { height: "120px" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  className: "absolute inset-0 w-full h-full",
                  viewBox: "0 0 100 80",
                  preserveAspectRatio: "none",
                  children: [
                    insp.joints.map(
                      (j, i) => i < insp.joints.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: j.x + 2,
                          y1: j.y + 2,
                          x2: insp.joints[i + 1].x + 2,
                          y2: insp.joints[i + 1].y + 2,
                          stroke: "#374151",
                          strokeWidth: "1"
                        },
                        `t-${i}`
                      )
                    ),
                    insp.joints.map((j) => {
                      const isActive = j.id === joint.id;
                      const color = JOINT_COLORS[j.type];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            cx: j.x + 2,
                            cy: j.y + 2,
                            r: isActive ? 5 : 3.5,
                            fill: isActive ? `${color}60` : `${color}30`,
                            stroke: isActive ? color : `${color}80`,
                            strokeWidth: isActive ? 2 : 1,
                            style: {
                              filter: isActive ? `drop-shadow(0 0 4px ${color})` : "none"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "text",
                          {
                            x: j.x + 2,
                            y: j.y + 2,
                            textAnchor: "middle",
                            dominantBaseline: "middle",
                            fill: color,
                            fontSize: "4",
                            fontFamily: "Orbitron",
                            children: j.id
                          }
                        )
                      ] }, j.id);
                    })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `glass-card rounded-xl p-3 shrink-0 border-2 transition-all ${answered ? selected === joint.type ? "border-[#10b981]" : "border-[#f43f5e]" : "border-[#e879f9]/40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs font-bold mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#e879f9" },
                  children: [
                    "JOINT #",
                    joint.id,
                    ": ",
                    joint.visual
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Classify this solder joint:" }),
              answered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mt-1",
                  style: { color: selected === joint.type ? "#10b981" : "#f43f5e" },
                  children: JOINT_DESCRIPTIONS[joint.type]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 shrink-0", children: ["good", "cold", "bridge", "insufficient"].map(
          (type) => {
            let bc = "border-border/30";
            if (answered) {
              if (type === joint.type) bc = "border-[#10b981] bg-[#10b981]/10";
              else if (type === selected)
                bc = "border-[#f43f5e] bg-[#f43f5e]/10";
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileHover: !answered ? { scale: 1.03 } : {},
                whileTap: !answered ? { scale: 0.97 } : {},
                onClick: () => handleClassify(type),
                disabled: answered,
                className: `rounded-xl border-2 py-3 font-bold text-sm transition-all ${bc}`,
                style: {
                  color: JOINT_COLORS[type],
                  borderColor: answered && type === joint.type ? "#10b981" : answered && type === selected ? "#f43f5e" : `${JOINT_COLORS[type]}60`
                },
                "data-ocid": `soldering_challenge.classify.${type}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  answered && type === joint.type && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
                  answered && type === selected && type !== joint.type && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
                  JOINT_LABELS[type]
                ] })
              },
              type
            );
          }
        ) }),
        !answered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "REFERENCE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1 mt-1", children: ["good", "cold", "bridge", "insufficient"].map(
            (t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs",
                style: { color: JOINT_COLORS[t] },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                    JOINT_LABELS[t],
                    ":"
                  ] }),
                  " ",
                  JOINT_DESCRIPTIONS[t].split(".")[0]
                ]
              },
              t
            )
          ) })
        ] })
      ]
    }
  );
}
function ElectronicsLab(props) {
  switch (props.config.gameId) {
    case "multimeter-master":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MultimeterMasterGame, { ...props });
    case "soldering-challenge":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SolderingChallengeGame, { ...props });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentIdentifierGame, { ...props });
  }
}
export {
  ElectronicsLab as default
};
