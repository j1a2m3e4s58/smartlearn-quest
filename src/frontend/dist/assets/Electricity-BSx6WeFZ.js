import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, Z as Zap, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
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
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
const D1_CHALLENGES = [
  {
    description: "Connect a simple series circuit: battery, switch, and bulb.",
    components: ["Battery", "Switch", "Bulb", "Resistor", "Capacitor"],
    correctOrder: [0, 1, 2],
    circuitType: "Series"
  },
  {
    description: "Build a parallel circuit with a battery and two bulbs.",
    components: ["Battery", "Bulb A", "Bulb B", "Switch", "Resistor"],
    correctOrder: [0, 1, 2],
    circuitType: "Parallel"
  },
  {
    description: "Create a circuit with battery, resistor, and ammeter.",
    components: ["Battery", "Ammeter", "Resistor", "Bulb", "Switch"],
    correctOrder: [0, 2, 1],
    circuitType: "Series"
  },
  {
    description: "Wire: battery connects to switch, switch to motor, motor back to battery.",
    components: ["Switch", "Motor", "Battery", "Resistor", "Bulb"],
    correctOrder: [2, 0, 1],
    circuitType: "Series"
  },
  {
    description: "Build a torch circuit: battery, switch (open), bulb.",
    components: ["Battery", "Bulb", "Switch (open)", "Diode", "Capacitor"],
    correctOrder: [0, 2, 1],
    circuitType: "Open"
  },
  {
    description: "Connect battery, fuse, switch, and bulb in series.",
    components: ["Battery", "Fuse", "Switch", "Bulb", "Capacitor"],
    correctOrder: [0, 1, 2, 3],
    circuitType: "Protected Series"
  },
  {
    description: "Build: battery → voltmeter in parallel with bulb.",
    components: ["Battery", "Bulb", "Voltmeter", "Switch", "Resistor"],
    correctOrder: [0, 1, 2],
    circuitType: "Measurement"
  },
  {
    description: "Wire a doorbell circuit: battery, push-switch, bell.",
    components: ["Push-switch", "Bell", "Battery", "Resistor", "Fuse"],
    correctOrder: [2, 0, 1],
    circuitType: "Series"
  },
  {
    description: "Connect: battery → LED → 330Ω resistor → back to battery.",
    components: ["Battery", "LED", "330Ω Resistor", "Switch", "Capacitor"],
    correctOrder: [0, 1, 2],
    circuitType: "LED"
  },
  {
    description: "Build a short circuit: battery terminals directly connected.",
    components: ["Battery (+)", "Wire", "Battery (-)", "Bulb", "Resistor"],
    correctOrder: [0, 1, 2],
    circuitType: "Short"
  }
];
const D2_CHALLENGES = [
  {
    description: "Series circuit: 9V battery, 3Ω resistor, 6Ω resistor.",
    components: [
      "9V Battery",
      "3Ω Resistor",
      "6Ω Resistor",
      "Ammeter",
      "Voltmeter"
    ],
    correctOrder: [0, 1, 2, 3],
    circuitType: "Series-Measurement",
    ohmQuestion: {
      text: "Total resistance in series = 3+6 = 9Ω. Current = V/R = ?",
      answers: ["3A", "1A", "2A", "0.5A"],
      correct: 1
    }
  },
  {
    description: "Parallel: two 12Ω resistors across a 6V supply.",
    components: [
      "6V Battery",
      "12Ω Resistor A",
      "12Ω Resistor B",
      "Ammeter",
      "Junction wire"
    ],
    correctOrder: [0, 4, 1, 2],
    circuitType: "Parallel",
    ohmQuestion: {
      text: "Parallel resistance = (12×12)/(12+12) = 6Ω. Total current?",
      answers: ["2A", "1A", "0.5A", "4A"],
      correct: 1
    }
  },
  {
    description: "Build a voltage divider: 12V battery, 4Ω and 8Ω resistors.",
    components: [
      "12V Battery",
      "4Ω Resistor",
      "8Ω Resistor",
      "Voltmeter",
      "Ammeter"
    ],
    correctOrder: [0, 1, 2, 3],
    circuitType: "Voltage Divider",
    ohmQuestion: {
      text: "Total R = 12Ω. What is voltage across 8Ω?",
      answers: ["4V", "8V", "6V", "3V"],
      correct: 1
    }
  },
  {
    description: "Wheatstone bridge: balance condition R1/R2 = R3/R4.",
    components: ["Battery", "R1 (10Ω)", "R2 (20Ω)", "R3 (15Ω)", "Galvanometer"],
    correctOrder: [0, 1, 2, 3, 4],
    circuitType: "Bridge",
    ohmQuestion: {
      text: "If R1=10, R2=20, R3=15, what must R4 be for balance?",
      answers: ["20Ω", "30Ω", "25Ω", "10Ω"],
      correct: 1
    }
  },
  {
    description: "Kirchhoff's Voltage Law circuit with three branches.",
    components: ["12V Source", "R1 (3Ω)", "R2 (6Ω)", "R3 (9Ω)", "Ammeter"],
    correctOrder: [0, 1, 2, 3, 4],
    circuitType: "KVL",
    ohmQuestion: {
      text: "Sum of voltage drops = source voltage. Series 3+6+9=18Ω with 18V, current?",
      answers: ["2A", "1A", "3A", "0.5A"],
      correct: 1
    }
  }
];
const D3_CHALLENGES = [
  {
    description: "Thevenin equivalent: find Vth and Rth for a complex two-terminal network.",
    components: [
      "Vs (10V)",
      "R1 (4Ω)",
      "R2 (6Ω)",
      "Open-circuit terminals",
      "Ammeter"
    ],
    correctOrder: [0, 1, 2, 3, 4],
    circuitType: "Thevenin",
    ohmQuestion: {
      text: "Vth = Vs × R2/(R1+R2). With Vs=10, R1=4, R2=6, Vth = ?",
      answers: ["6V", "4V", "5V", "8V"],
      correct: 0
    }
  },
  {
    description: "Op-amp inverting amplifier: Rin, feedback resistor Rf, virtual ground.",
    components: ["-Vin", "Rin (10kΩ)", "Op-Amp", "Rf (100kΩ)", "+Vcc/-Vcc"],
    correctOrder: [0, 1, 2, 3, 4],
    circuitType: "Op-Amp",
    ohmQuestion: {
      text: "Gain of inverting amp = -Rf/Rin = -100k/10k = ?",
      answers: ["-10", "-100", "-1", "+10"],
      correct: 0
    }
  },
  {
    description: "LC resonant circuit: inductor and capacitor at resonant frequency.",
    components: [
      "AC Source",
      "Inductor (L)",
      "Capacitor (C)",
      "Ammeter",
      "Resistor (small)"
    ],
    correctOrder: [0, 1, 2, 3, 4],
    circuitType: "Resonant",
    ohmQuestion: {
      text: "Resonant freq f = 1/(2π√LC). At resonance, impedance is?",
      answers: ["Minimum (purely resistive)", "Maximum", "Zero", "Infinite"],
      correct: 0
    }
  }
];
const OHM_PROBLEMS = [
  {
    circuitDesc: "Series circuit: 12V battery, single resistor R",
    knownValues: "V = 12V, R = 4Ω",
    formula: "I = V/R",
    question: "Calculate the current flowing through the circuit.",
    answers: ["48A", "3A", "0.33A", "8A"],
    correct: 1,
    explanation: "I = V/R = 12/4 = 3A",
    circuitType: "Series"
  },
  {
    circuitDesc: "Circuit with unknown resistance R",
    knownValues: "V = 24V, I = 6A",
    formula: "R = V/I",
    question: "What is the resistance in this circuit?",
    answers: ["4Ω", "144Ω", "0.25Ω", "30Ω"],
    correct: 0,
    explanation: "R = V/I = 24/6 = 4Ω",
    circuitType: "Series"
  },
  {
    circuitDesc: "Battery of unknown voltage V",
    knownValues: "I = 2A, R = 5Ω",
    formula: "V = I × R",
    question: "What is the battery voltage?",
    answers: ["2.5V", "7V", "10V", "3V"],
    correct: 2,
    explanation: "V = I×R = 2×5 = 10V",
    circuitType: "Series"
  },
  {
    circuitDesc: "Series circuit: two resistors R1=3Ω, R2=6Ω with 9V battery",
    knownValues: "V = 9V, R1 = 3Ω, R2 = 6Ω",
    formula: "I = V/(R1+R2)",
    question: "Total current through the series circuit?",
    answers: ["1A", "3A", "0.5A", "9A"],
    correct: 0,
    explanation: "Rtotal = 3+6 = 9Ω. I = 9/9 = 1A",
    circuitType: "Series"
  },
  {
    circuitDesc: "Parallel circuit: two 10Ω resistors with 5V supply",
    knownValues: "V = 5V, R1 = R2 = 10Ω",
    formula: "1/R_eq = 1/R1 + 1/R2",
    question: "Total current drawn from the supply?",
    answers: ["0.25A", "0.5A", "1A", "2A"],
    correct: 2,
    explanation: "Req = 5Ω. Total I = 5/5 = 1A",
    circuitType: "Parallel"
  },
  {
    circuitDesc: "Component with V=6V across it and I=0.3A through it",
    knownValues: "V = 6V, I = 0.3A",
    formula: "R = V/I",
    question: "What is the resistance of this component?",
    answers: ["1.8Ω", "20Ω", "6.3Ω", "0.05Ω"],
    correct: 1,
    explanation: "R = 6/0.3 = 20Ω",
    circuitType: "Component"
  },
  {
    circuitDesc: "A 60W bulb connected to 120V supply",
    knownValues: "P = 60W, V = 120V",
    formula: "I = P/V",
    question: "What current does the bulb draw?",
    answers: ["2A", "0.5A", "1A", "60A"],
    correct: 1,
    explanation: "I = P/V = 60/120 = 0.5A",
    circuitType: "Power"
  },
  {
    circuitDesc: "Resistor dissipating heat: I=3A, R=8Ω",
    knownValues: "I = 3A, R = 8Ω",
    formula: "P = I²R",
    question: "What power does the resistor dissipate?",
    answers: ["72W", "24W", "11W", "2.67W"],
    correct: 0,
    explanation: "P = I²R = 9×8 = 72W",
    circuitType: "Power"
  },
  {
    circuitDesc: "Series: 15V battery, R1=2Ω, R2=3Ω. Find voltage across R2.",
    knownValues: "V = 15V, R1 = 2Ω, R2 = 3Ω",
    formula: "V2 = V × R2/(R1+R2)",
    question: "Voltage across R2 (voltage divider)?",
    answers: ["6V", "9V", "3V", "15V"],
    correct: 1,
    explanation: "V2 = 15 × 3/5 = 9V",
    circuitType: "Voltage Divider"
  },
  {
    circuitDesc: "3 resistors in series: 4Ω, 6Ω, 10Ω with 40V supply",
    knownValues: "V = 40V, R = 4Ω + 6Ω + 10Ω",
    formula: "I = V/Rtotal",
    question: "Current in the circuit?",
    answers: ["2A", "4A", "1A", "0.5A"],
    correct: 0,
    explanation: "Rtotal = 20Ω. I = 40/20 = 2A",
    circuitType: "Series"
  },
  {
    circuitDesc: "Unknown current in parallel branch: R=12Ω, V=6V",
    knownValues: "V = 6V, R = 12Ω",
    formula: "I = V/R",
    question: "Current through this parallel branch?",
    answers: ["72A", "6A", "0.5A", "2A"],
    correct: 2,
    explanation: "I = V/R = 6/12 = 0.5A (each branch has same voltage in parallel)",
    circuitType: "Parallel"
  },
  {
    circuitDesc: "Power rating of circuit: V=220V, R=44Ω",
    knownValues: "V = 220V, R = 44Ω",
    formula: "P = V²/R",
    question: "Power dissipated in the resistor?",
    answers: ["5W", "1100W", "484W", "9680W"],
    correct: 2,
    explanation: "P = V²/R = 220²/44 = 48400/44 = 1100W",
    circuitType: "Power"
  },
  {
    circuitDesc: "Internal resistance: EMF=12V, internal r=2Ω, external R=4Ω",
    knownValues: "EMF = 12V, r = 2Ω, R = 4Ω",
    formula: "I = EMF/(R+r)",
    question: "Terminal current in the circuit?",
    answers: ["3A", "2A", "6A", "1.5A"],
    correct: 1,
    explanation: "I = 12/(4+2) = 12/6 = 2A",
    circuitType: "Internal Resistance"
  },
  {
    circuitDesc: "Find voltage across R2 in series: 18V, R1=6Ω, R2=3Ω",
    knownValues: "V = 18V, R1 = 6Ω, R2 = 3Ω",
    formula: "V2 = I × R2",
    question: "Voltage across R2?",
    answers: ["6V", "12V", "9V", "3V"],
    correct: 0,
    explanation: "I = 18/9 = 2A. V2 = 2×3 = 6V",
    circuitType: "Series"
  },
  {
    circuitDesc: "Energy used: P=100W appliance running for 5 hours",
    knownValues: "P = 100W, t = 5h",
    formula: "E = P × t",
    question: "Energy consumed in kilowatt-hours?",
    answers: ["500 kWh", "20 kWh", "0.5 kWh", "100 kWh"],
    correct: 2,
    explanation: "E = 0.1kW × 5h = 0.5 kWh",
    circuitType: "Energy"
  }
];
const SAFETY_SCENARIOS = [
  {
    situation: "A frayed electrical wire is exposed on a lamp cord in the living room.",
    hazardLevel: "HIGH",
    correctAction: 1,
    actions: [
      "Cover with tape and continue using",
      "Unplug immediately and replace the wire",
      "Use gloves when using the lamp",
      "Ignore if it doesn't spark"
    ],
    explanation: "Frayed wires cause fires and electrocution. Replace immediately."
  },
  {
    situation: "You are plugging in 6 high-wattage devices into one power strip.",
    hazardLevel: "HIGH",
    correctAction: 2,
    actions: [
      "Turn on all devices at once",
      "Use two power strips",
      "Distribute load across separate sockets",
      "Use an extension cord"
    ],
    explanation: "Overloaded sockets overheat and cause fires. Spread load to separate circuits."
  },
  {
    situation: "Your hands are wet after washing dishes and you need to use the microwave.",
    hazardLevel: "CRITICAL",
    correctAction: 1,
    actions: [
      "Use quickly",
      "Dry hands completely before touching any switch",
      "Use one finger only",
      "Turn on with elbow"
    ],
    explanation: "Water conducts electricity. Wet hands near electrical switches risk electrocution."
  },
  {
    situation: "An extension cord is run under a carpet in a hallway.",
    hazardLevel: "MEDIUM",
    correctAction: 2,
    actions: [
      "Check it regularly",
      "Use a lighter cable under carpet",
      "Reroute the cable along the wall outside the carpet",
      "Put a mat over the bump"
    ],
    explanation: "Cables under carpet overheat, fray, and cause fires without being visible."
  },
  {
    situation: "A power socket near the bathroom sink has no cover plate.",
    hazardLevel: "HIGH",
    correctAction: 1,
    actions: [
      "Only use it with dry hands",
      "Cover with a proper socket plate and ensure it is GFCI-protected",
      "Stick tape over it",
      "Hang a towel over it"
    ],
    explanation: "Bathrooms require ground fault circuit interrupters (GFCI) to prevent electrocution."
  },
  {
    situation: "You smell burning plastic from an electrical appliance while it's running.",
    hazardLevel: "CRITICAL",
    correctAction: 0,
    actions: [
      "Immediately switch off and unplug the appliance",
      "Continue using it but open a window",
      "Pour water on it to cool it",
      "Wait to see if it stops"
    ],
    explanation: "Burning smell indicates wiring failure or overheating — risk of fire and electrocution."
  },
  {
    situation: "A child is about to insert a metal object into an unused power socket.",
    hazardLevel: "CRITICAL",
    correctAction: 1,
    actions: [
      "Watch them carefully",
      "Stop them immediately and install socket covers",
      "Tell them not to touch it",
      "Move the child away and wait"
    ],
    explanation: "Metal in live sockets causes electrocution. Socket covers are essential child safety."
  },
  {
    situation: "Your outdoor electrical equipment gets wet in the rain.",
    hazardLevel: "HIGH",
    correctAction: 2,
    actions: [
      "Continue using it",
      "Wipe it dry and continue",
      "Unplug, dry thoroughly, and inspect before reuse",
      "Use on a lower power setting"
    ],
    explanation: "Wet equipment shorts circuit. Must be properly dried and inspected before reuse."
  },
  {
    situation: "You want to hang a picture and need to drill near an electrical outlet.",
    hazardLevel: "MEDIUM",
    correctAction: 1,
    actions: [
      "Drill quickly to avoid wires",
      "Turn off circuit breaker for that area and use a stud finder",
      "Drill at an angle",
      "Only drill if the outlet is off"
    ],
    explanation: "Drilling into hidden wires causes shock. Always turn off the circuit and check for cables."
  },
  {
    situation: "Your electricity bill shows unusually high usage and the meter spins fast with all appliances off.",
    hazardLevel: "MEDIUM",
    correctAction: 2,
    actions: [
      "Ignore it",
      "Switch off only obvious appliances",
      "Call an electrician to inspect for wiring faults or leakage",
      "Reset the circuit breaker"
    ],
    explanation: "Abnormal consumption may indicate a fault, leakage, or meter error requiring professional check."
  },
  {
    situation: "The circuit breaker trips repeatedly when you turn on the air conditioner.",
    hazardLevel: "HIGH",
    correctAction: 1,
    actions: [
      "Keep resetting it manually",
      "Have an electrician inspect the wiring and circuit capacity",
      "Use the AC on a lower setting",
      "Unplug other devices and keep resetting"
    ],
    explanation: "Repeated tripping means the circuit is overloaded or the appliance has a fault — needs inspection."
  },
  {
    situation: "An electrical fire starts in the kitchen. There's a fire extinguisher nearby.",
    hazardLevel: "CRITICAL",
    correctAction: 0,
    actions: [
      "Switch off the electricity and use a dry powder/CO2 extinguisher",
      "Pour water on the fire",
      "Use a damp cloth",
      "Leave and call firefighters only"
    ],
    explanation: "Never use water on electrical fires. CO2 or dry powder extinguishers are safe for electrical fires."
  }
];
function Electricity({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "ohms-law")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(OhmsLaw, { config, onGameEnd });
  if (gameId === "electrical-safety")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ElectricalSafety, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CircuitBuilder, { config, onGameEnd });
}
function CircuitBuilder({ config, onGameEnd }) {
  const challenges = config.difficulty === 1 ? D1_CHALLENGES : config.difficulty === 2 ? D2_CHALLENGES : D3_CHALLENGES;
  const [phase, setPhase] = reactExports.useState(
    "start"
  );
  const [cIdx, setCIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [slots, setSlots] = reactExports.useState([
    null,
    null,
    null,
    null,
    null
  ]);
  const [circuitLit, setCircuitLit] = reactExports.useState(false);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
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
  const currentC = challenges[cIdx % challenges.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  const progressBarStyle = { width: `${progressPct}%` };
  const slotCount = currentC.correctOrder.length;
  const activeSlots = slots.slice(0, slotCount);
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("wiring");
    setSlots([null, null, null, null, null]);
    startTimer();
  }
  function handleComponentClick(compIdx) {
    if (phase !== "wiring") return;
    setSlots((prev) => {
      const next = [...prev];
      const firstEmpty = next.findIndex((s, i) => s === null && i < slotCount);
      if (firstEmpty === -1) return next;
      next[firstEmpty] = compIdx;
      return next;
    });
  }
  function handleClearSlots() {
    setSlots([null, null, null, null, null]);
  }
  function handleCheckCircuit() {
    if (phase !== "wiring") return;
    const filled = activeSlots.slice(0, slotCount).filter((s) => s !== null);
    if (filled.length < slotCount) return;
    const isCorrect = currentC.correctOrder.every(
      (val, i) => activeSlots[i] === val
    );
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCircuitLit(true);
      setFlash("correct");
      setCorrect((c) => c + 1);
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setFeedbackMsg(
        `Circuit complete! ${currentC.circuitType} circuit activated.`
      );
      if (currentC.ohmQuestion && config.difficulty >= 2) {
        setTimeout(() => {
          setFlash("idle");
          setCircuitLit(false);
          setPhase("ohm");
        }, 1200);
      } else {
        setTimeout(() => advanceChallenge(), 1800);
      }
    } else {
      setFlash("wrong");
      setFeedbackMsg("Wrong order! Short circuit detected.");
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setSlots([null, null, null, null, null]);
        setPhase("wiring");
      }, 1500);
    }
  }
  function handleOhmAnswer(idx) {
    if (!currentC.ohmQuestion) return;
    setTotal((t) => t + 1);
    if (idx === currentC.ohmQuestion.correct) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedbackMsg(`Correct calculation! +${pts} pts`);
      setFlash("correct");
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Incorrect. Answer: ${currentC.ohmQuestion.answers[currentC.ohmQuestion.correct]}`
      );
    }
    setPhase("feedback");
    setTimeout(() => advanceChallenge(), 2e3);
  }
  function advanceChallenge() {
    setFlash("idle");
    setFeedbackMsg("");
    setCircuitLit(false);
    setSlots([null, null, null, null, null]);
    const nextIdx = cIdx + 1;
    if (nextIdx >= challenges.length) endGame(true);
    else {
      setCIdx(nextIdx);
      setPhase("wiring");
    }
  }
  const wireColor = flash === "correct" ? "#10b981" : flash === "wrong" ? "#f43f5e" : "#f59e0b";
  const containerBorder = `border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "electricity.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            cIdx + 1,
            "/",
            challenges.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: progressBarStyle
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
                  children: "Circuit Builder"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Click components in the correct wiring order to complete each circuit." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "electricity.start_button",
                  children: "Power On"
                }
              )
            ] })
          }
        ),
        (phase === "wiring" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -20 },
                className: `glass-card rounded-xl p-4 ${containerBorder}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest mb-2 text-muted-foreground",
                      style: { fontFamily: "'Orbitron',sans-serif" },
                      children: [
                        "Circuit ",
                        cIdx + 1
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-4", children: currentC.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-4 flex-wrap", children: Array.from({ length: slotCount }).map((_, i) => {
                    const slotComp = activeSlots[i] !== null ? currentC.components[activeSlots[i]] : null;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "px-2 py-1.5 rounded border-2 text-xs font-mono min-w-20 text-center transition-all",
                          style: {
                            borderColor: slotComp ? wireColor : "rgba(255,255,255,0.15)",
                            background: slotComp ? `${wireColor}20` : "transparent",
                            color: slotComp ? wireColor : "rgba(255,255,255,0.3)"
                          },
                          children: slotComp ?? "[empty]"
                        }
                      ),
                      i < slotCount - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-4 h-0.5 mx-0.5",
                          style: {
                            background: circuitLit ? wireColor : "rgba(255,255,255,0.2)"
                          }
                        }
                      )
                    ] }, `slot-${i}`);
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        animate: circuitLit ? { scale: [1, 1.3, 1] } : {},
                        transition: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 0.8
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Lightbulb,
                          {
                            className: "h-6 w-6",
                            style: {
                              color: circuitLit ? "#f59e0b" : "rgba(255,255,255,0.2)",
                              filter: circuitLit ? "drop-shadow(0 0 8px #f59e0b)" : void 0
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: circuitLit ? "Circuit complete!" : "Wire the circuit correctly to light the bulb." })
                  ] }),
                  feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: `mt-3 rounded-lg px-3 py-2 text-xs ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`,
                      children: feedbackMsg
                    }
                  )
                ]
              },
              cIdx
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "sm",
                  onClick: handleCheckCircuit,
                  "data-ocid": "electricity.check_button",
                  children: "Test Circuit"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: handleClearSlots,
                  "data-ocid": "electricity.clear_button",
                  children: "Clear"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-52 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest px-1 text-muted-foreground",
                style: { fontFamily: "'Orbitron',sans-serif" },
                children: "Components"
              }
            ),
            currentC.components.map((comp, i) => {
              const isUsed = activeSlots.includes(i);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "w-full text-left px-3 py-2 rounded-lg border border-border/30 text-sm text-muted-foreground hover:border-[#f59e0b] hover:text-foreground transition-all glass",
                  style: { opacity: isUsed ? 0.4 : 1 },
                  onClick: () => handleComponentClick(i),
                  disabled: isUsed,
                  "data-ocid": `electricity.component.${i}`,
                  children: comp
                },
                `comp-${i}`
              );
            })
          ] })
        ] }),
        phase === "ohm" && currentC.ohmQuestion && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-8 max-w-lg w-full border-2 border-[#f59e0b]/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-10 w-10 mb-4", style: { color: "#f59e0b" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest mb-2 text-muted-foreground",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: "Ohm's Law Calculation"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-5", children: currentC.ohmQuestion.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentC.ohmQuestion.answers.map((ans, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f59e0b] hover:text-foreground transition-all",
                  onClick: () => handleOhmAnswer(i),
                  "data-ocid": `electricity.ohm_answer.${i}`,
                  children: ans
                },
                `ohm-${i}`
              )) })
            ] })
          }
        )
      ]
    }
  );
}
function OhmsLaw({ config, onGameEnd }) {
  const totalQ = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 15;
  const problems = OHM_PROBLEMS.slice(0, totalQ);
  const [phase, setPhase] = reactExports.useState("start");
  const [pIdx, setPIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [selectedAnswer, setSelectedAnswer] = reactExports.useState(null);
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
  const currentP = problems[pIdx % problems.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleAnswer(idx) {
    if (flash !== "idle" || phase !== "playing") return;
    setSelectedAnswer(idx);
    setTotal((t) => t + 1);
    if (idx === currentP.correct) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${currentP.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${currentP.explanation}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      setSelectedAnswer(null);
      const next = pIdx + 1;
      if (next >= problems.length) endGame(true);
      else {
        setPIdx(next);
        setPhase("playing");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "ohms_law.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            pIdx + 1,
            "/",
            problems.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
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
                  children: "Ohm's Law Calculator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 text-sm", children: [
                "Circuit diagrams show 2 known values. Apply V=IR and power formulas to find the missing value. ",
                problems.length,
                " problems."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "ohms_law.start_button",
                  children: "Start Calculations"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs px-2 py-0.5 rounded",
                      style: {
                        background: "#f59e0b20",
                        color: "#f59e0b",
                        fontFamily: "'Orbitron',sans-serif"
                      },
                      children: currentP.circuitType
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Problem ",
                    pIdx + 1,
                    "/",
                    problems.length
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: currentP.circuitDesc }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg p-3 border border-border/20 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
                    "Known Values:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: currentP.knownValues })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Formula:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", style: { color: "#f59e0b" }, children: currentP.formula })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-4", children: currentP.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentP.answers.map((ans, i) => {
                  let borderColor = "rgba(255,255,255,0.1)";
                  let bgColor = "transparent";
                  if (phase === "feedback") {
                    if (i === currentP.correct) {
                      borderColor = "#10b981";
                      bgColor = "rgba(16,185,129,0.15)";
                    } else if (i === selectedAnswer) {
                      borderColor = "#f43f5e";
                      bgColor = "rgba(244,63,94,0.15)";
                    }
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "px-4 py-3 rounded-lg border-2 text-sm text-muted-foreground hover:border-[#f59e0b] hover:text-foreground transition-all font-mono",
                      style: { borderColor, background: bgColor },
                      onClick: () => handleAnswer(i),
                      "data-ocid": `ohms_law.answer.${i}`,
                      children: ans
                    },
                    `ans-${i}`
                  );
                }) })
              ]
            },
            pIdx
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
function ElectricalSafety({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [sIdx, setSIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
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
  const current = SAFETY_SCENARIOS[sIdx % SAFETY_SCENARIOS.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  const levelColors = {
    LOW: "#10b981",
    MEDIUM: "#f59e0b",
    HIGH: "#f97316",
    CRITICAL: "#f43f5e"
  };
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleAction(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === current.correctAction) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${current.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${current.explanation}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const next = sIdx + 1;
      if (next >= SAFETY_SCENARIOS.length) endGame(true);
      else {
        setSIdx(next);
        setPhase("playing");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "electrical_safety.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f43f5e" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            sIdx + 1,
            "/",
            SAFETY_SCENARIOS.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
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
                Lightbulb,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f43f5e" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#f43f5e",
                    textShadow: "0 0 20px rgba(244,63,94,0.6)"
                  },
                  children: "Electrical Safety"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "12 household electrical hazard scenarios. Identify the danger level and choose the correct action." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "electrical_safety.start_button",
                  children: "Start Assessment"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-black px-2 py-0.5 rounded",
                    style: {
                      background: `${levelColors[current.hazardLevel]}20`,
                      color: levelColors[current.hazardLevel]
                    },
                    children: [
                      current.hazardLevel,
                      " HAZARD"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-4", children: current.situation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "What is the correct action?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: current.actions.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "text-left px-4 py-3 rounded-xl border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f43f5e]/60 hover:text-foreground transition-all",
                    onClick: () => handleAction(i),
                    "data-ocid": `electrical_safety.action.${i}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs mr-2 opacity-60", children: [
                        String.fromCharCode(65 + i),
                        "."
                      ] }),
                      action
                    ]
                  },
                  `act-${i}`
                )) })
              ]
            },
            sIdx
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
  Electricity as default
};
