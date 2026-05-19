import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence, Z as Zap } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { C as Cpu } from "./cpu-DjqPbGA_.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
const COMP_COLORS = {
  resistor: "#f59e0b",
  led: "#00f5ff",
  capacitor: "#7c3aed",
  transistor: "#10b981",
  battery: "#f43f5e",
  switch: "#e879f9"
};
const SPECS = {
  1: {
    title: "LED Circuit",
    description: "Connect a battery to a resistor, then to an LED.",
    objective: "Battery → Resistor → LED → Battery (ground)",
    ohmQuestion: { r: 330, v: 5, answer: 15, unit: "mA" },
    components: [
      {
        id: "bat",
        type: "battery",
        label: "5V Battery",
        color: COMP_COLORS.battery,
        x: 10,
        y: 45,
        connected: false
      },
      {
        id: "res1",
        type: "resistor",
        label: "330Ω",
        color: COMP_COLORS.resistor,
        x: 40,
        y: 25,
        connected: false
      },
      {
        id: "led1",
        type: "led",
        label: "LED (Red)",
        color: COMP_COLORS.led,
        x: 70,
        y: 45,
        connected: false
      }
    ],
    requiredConnections: [
      ["bat", "res1"],
      ["res1", "led1"],
      ["led1", "bat"]
    ]
  },
  2: {
    title: "Transistor Switch Circuit",
    description: "Use a transistor as a switch.",
    objective: "Battery→Collector | Base-Input→Resistor→Base | Emitter→Ground→LED",
    ohmQuestion: { r: 1e3, v: 3.3, answer: 3, unit: "mA" },
    components: [
      {
        id: "bat",
        type: "battery",
        label: "9V Battery",
        color: COMP_COLORS.battery,
        x: 8,
        y: 40,
        connected: false
      },
      {
        id: "res1",
        type: "resistor",
        label: "1kΩ Base",
        color: COMP_COLORS.resistor,
        x: 30,
        y: 20,
        connected: false
      },
      {
        id: "tr1",
        type: "transistor",
        label: "NPN BC547",
        color: COMP_COLORS.transistor,
        x: 52,
        y: 42,
        connected: false
      },
      {
        id: "res2",
        type: "resistor",
        label: "470Ω Load",
        color: COMP_COLORS.resistor,
        x: 52,
        y: 20,
        connected: false
      },
      {
        id: "led1",
        type: "led",
        label: "LED (Blue)",
        color: COMP_COLORS.led,
        x: 75,
        y: 20,
        connected: false
      },
      {
        id: "sw1",
        type: "switch",
        label: "Input Signal",
        color: COMP_COLORS.switch,
        x: 10,
        y: 20,
        connected: false
      }
    ],
    requiredConnections: [
      ["bat", "res2"],
      ["res2", "led1"],
      ["led1", "tr1"],
      ["tr1", "bat"],
      ["sw1", "res1"],
      ["res1", "tr1"]
    ]
  },
  3: {
    title: "Capacitor Filter Circuit",
    description: "Build a power supply filter.",
    objective: "AC Input → Bridge Rectifier → Filter Capacitor → Load Resistor → LED indicator",
    ohmQuestion: { r: 220, v: 12, answer: 55, unit: "mA" },
    components: [
      {
        id: "bat",
        type: "battery",
        label: "12V AC",
        color: COMP_COLORS.battery,
        x: 5,
        y: 45,
        connected: false
      },
      {
        id: "cap1",
        type: "capacitor",
        label: "1000μF Filter",
        color: COMP_COLORS.capacitor,
        x: 42,
        y: 60,
        connected: false
      },
      {
        id: "res1",
        type: "resistor",
        label: "220Ω Load",
        color: COMP_COLORS.resistor,
        x: 65,
        y: 25,
        connected: false
      },
      {
        id: "led1",
        type: "led",
        label: "LED Indicator",
        color: COMP_COLORS.led,
        x: 82,
        y: 45,
        connected: false
      },
      {
        id: "tr1",
        type: "transistor",
        label: "Rectifier",
        color: COMP_COLORS.transistor,
        x: 25,
        y: 30,
        connected: false
      },
      {
        id: "sw1",
        type: "switch",
        label: "Power Switch",
        color: COMP_COLORS.switch,
        x: 25,
        y: 62,
        connected: false
      }
    ],
    requiredConnections: [
      ["bat", "tr1"],
      ["tr1", "cap1"],
      ["cap1", "res1"],
      ["res1", "led1"],
      ["led1", "bat"],
      ["sw1", "bat"]
    ]
  }
};
const CIRCUIT_QUESTIONS = [
  {
    id: "q1",
    circuitType: "series",
    description: "Two 100Ω resistors in series, 12V supply",
    question: "Total resistance in this series circuit?",
    options: ["100Ω", "200Ω", "50Ω", "400Ω"],
    correctIdx: 1,
    explanation: "Series: R_total = R1 + R2 = 100 + 100 = 200Ω",
    r1: 100,
    r2: 100,
    voltage: 12
  },
  {
    id: "q2",
    circuitType: "parallel",
    description: "Two 100Ω resistors in parallel, 12V supply",
    question: "Total resistance in this parallel circuit?",
    options: ["200Ω", "100Ω", "50Ω", "25Ω"],
    correctIdx: 2,
    explanation: "Parallel: 1/R = 1/100 + 1/100 = 2/100. R = 50Ω",
    r1: 100,
    r2: 100,
    voltage: 12
  },
  {
    id: "q3",
    circuitType: "series",
    description: "60Ω and 40Ω in series, 10V supply",
    question: "Current through the circuit?",
    options: ["100mA", "250mA", "150mA", "50mA"],
    correctIdx: 0,
    explanation: "I = V/R_total = 10/(60+40) = 10/100 = 0.1A = 100mA",
    r1: 60,
    r2: 40,
    voltage: 10
  },
  {
    id: "q4",
    circuitType: "parallel",
    description: "Two 60Ω bulbs in parallel, 12V supply",
    question: "What happens if one bulb is removed from the parallel circuit?",
    options: [
      "Both bulbs go out",
      "Other bulb gets brighter",
      "Other bulb stays the same brightness",
      "Other bulb gets dimmer"
    ],
    correctIdx: 2,
    explanation: "In parallel, each branch has the same voltage. Removing one branch doesn't affect the others.",
    r1: 60,
    r2: 60,
    voltage: 12
  },
  {
    id: "q5",
    circuitType: "series",
    description: "Two 60Ω bulbs in series, 12V supply",
    question: "What happens if one bulb is removed from the series circuit?",
    options: [
      "Both bulbs go out",
      "Other bulb gets brighter",
      "Other bulb gets twice as bright",
      "Only removed bulb goes out"
    ],
    correctIdx: 0,
    explanation: "Series circuit: removing one component breaks the circuit. All components go out.",
    r1: 60,
    r2: 60,
    voltage: 12
  },
  {
    id: "q6",
    circuitType: "parallel",
    description: "40Ω and 60Ω in parallel, 12V supply",
    question: "Which resistor carries more current?",
    options: [
      "40Ω carries more",
      "60Ω carries more",
      "Both carry equal current",
      "Neither carries current"
    ],
    correctIdx: 0,
    explanation: "Parallel: same voltage, so I=V/R. Lower resistance draws more current. 40Ω: 300mA vs 60Ω: 200mA.",
    r1: 40,
    r2: 60,
    voltage: 12
  },
  {
    id: "q7",
    circuitType: "series",
    description: "Three 100Ω resistors in series, 9V supply",
    question: "Voltage drop across each resistor?",
    options: ["9V", "4.5V", "3V", "1V"],
    correctIdx: 2,
    explanation: "Series: voltage divides equally. V_each = 9V / 3 = 3V each.",
    r1: 100,
    r2: 100,
    voltage: 9
  },
  {
    id: "q8",
    circuitType: "parallel",
    description: "Parallel circuit with 3 bulbs, 9V supply",
    question: "Voltage across each bulb in parallel?",
    options: ["3V", "9V", "4.5V", "27V"],
    correctIdx: 1,
    explanation: "Parallel: all branches share the same supply voltage = 9V.",
    r1: 100,
    r2: 100,
    voltage: 9
  },
  {
    id: "q9",
    circuitType: "series",
    description: "Series circuit with R1=200Ω, R2=300Ω, V=10V",
    question: "Voltage across R1 only?",
    options: ["4V", "6V", "5V", "10V"],
    correctIdx: 0,
    explanation: "Voltage divider: V_R1 = V * R1/(R1+R2) = 10 * 200/500 = 4V",
    r1: 200,
    r2: 300,
    voltage: 10
  },
  {
    id: "q10",
    circuitType: "parallel",
    description: "Parallel circuit: R1=120Ω, R2=40Ω, V=12V",
    question: "Total current from the battery?",
    options: ["400mA", "300mA", "600mA", "200mA"],
    correctIdx: 0,
    explanation: "I_total = V/R1 + V/R2 = 12/120 + 12/40 = 0.1 + 0.3 = 0.4A = 400mA",
    r1: 120,
    r2: 40,
    voltage: 12
  }
];
const SYMBOL_QUESTIONS = [
  {
    id: "s1",
    symbolName: "resistor",
    nameOptions: ["Resistor", "Capacitor", "Inductor", "Diode"],
    correctName: 0,
    functionOptions: [
      "Stores charge",
      "Limits current flow",
      "Amplifies signal",
      "One-way valve"
    ],
    correctFunction: 1,
    schematicRole: "Current limiting and voltage division",
    color: "#f59e0b"
  },
  {
    id: "s2",
    symbolName: "capacitor",
    nameOptions: ["Battery", "Capacitor", "Transistor", "Fuse"],
    correctName: 1,
    functionOptions: [
      "Limits current",
      "Amplifies",
      "Stores charge in electric field",
      "Converts AC"
    ],
    correctFunction: 2,
    schematicRole: "Filtering, timing, energy storage",
    color: "#7c3aed"
  },
  {
    id: "s3",
    symbolName: "diode",
    nameOptions: ["LED", "Zener", "Diode", "Transistor"],
    correctName: 2,
    functionOptions: [
      "Emits light",
      "Allows current one direction only",
      "Amplifies current",
      "Stores energy"
    ],
    correctFunction: 1,
    schematicRole: "Rectification, reverse polarity protection",
    color: "#f43f5e"
  },
  {
    id: "s4",
    symbolName: "npn_transistor",
    nameOptions: ["Diode", "NPN Transistor", "MOSFET", "Op-Amp"],
    correctName: 1,
    functionOptions: [
      "Only passes DC",
      "Switches/amplifies via base control",
      "Stores magnetic energy",
      "Oscillates frequency"
    ],
    correctFunction: 1,
    schematicRole: "Switching and amplification",
    color: "#10b981"
  },
  {
    id: "s5",
    symbolName: "led",
    nameOptions: ["IR Sensor", "Photodiode", "LED", "Zener Diode"],
    correctName: 2,
    functionOptions: [
      "Converts light to current",
      "Emits light when forward biased",
      "Blocks reverse voltage",
      "Generates RF"
    ],
    correctFunction: 1,
    schematicRole: "Visual indicators, displays, lighting",
    color: "#00f5ff"
  },
  {
    id: "s6",
    symbolName: "ground",
    nameOptions: ["Power Rail", "Ground Symbol", "Fuse", "Switch"],
    correctName: 1,
    functionOptions: [
      "Supplies voltage",
      "Reference zero-volt point",
      "Amplifies",
      "Disconnects circuit"
    ],
    correctFunction: 1,
    schematicRole: "Voltage reference, return path for current",
    color: "#94a3b8"
  },
  {
    id: "s7",
    symbolName: "inductor",
    nameOptions: ["Resistor", "Capacitor", "Inductor", "Transformer"],
    correctName: 2,
    functionOptions: [
      "Stores charge",
      "Stores energy in magnetic field",
      "Limits current permanently",
      "Converts frequency"
    ],
    correctFunction: 1,
    schematicRole: "Filters, RF circuits, energy storage",
    color: "#e879f9"
  },
  {
    id: "s8",
    symbolName: "battery",
    nameOptions: ["Capacitor", "Generator", "Battery/Cell", "Inductor"],
    correctName: 2,
    functionOptions: [
      "Stores charge in field",
      "Converts mechanical to electrical",
      "Provides DC EMF",
      "Converts AC to DC"
    ],
    correctFunction: 2,
    schematicRole: "DC power source",
    color: "#f43f5e"
  },
  {
    id: "s9",
    symbolName: "switch",
    nameOptions: ["Relay", "Switch", "Fuse", "Button"],
    correctName: 1,
    functionOptions: [
      "Amplifies signal",
      "Opens/closes circuit path",
      "Regulates voltage",
      "Stores energy"
    ],
    correctFunction: 1,
    schematicRole: "Circuit control and protection",
    color: "#f59e0b"
  },
  {
    id: "s10",
    symbolName: "op_amp",
    nameOptions: ["Transistor", "Logic Gate", "Op-Amp", "555 Timer"],
    correctName: 2,
    functionOptions: [
      "Switches digital signals",
      "Generates timing",
      "Amplifies differential voltage",
      "Converts AC/DC"
    ],
    correctFunction: 2,
    schematicRole: "Signal amplification, filtering, comparators",
    color: "#00f5ff"
  },
  {
    id: "s11",
    symbolName: "fuse",
    nameOptions: ["Resistor", "Fuse", "Zener", "Switch"],
    correctName: 1,
    functionOptions: [
      "Limits resistance",
      "Sacrificial overcurrent protection",
      "Stores charge",
      "Converts voltage"
    ],
    correctFunction: 1,
    schematicRole: "Circuit protection from overcurrent",
    color: "#f43f5e"
  },
  {
    id: "s12",
    symbolName: "mosfet",
    nameOptions: ["BJT Transistor", "JFET", "MOSFET", "SCR"],
    correctName: 2,
    functionOptions: [
      "Base controlled",
      "Voltage-controlled field effect switching",
      "Light activated",
      "Thermal switching"
    ],
    correctFunction: 1,
    schematicRole: "High-power switching, motor drivers",
    color: "#10b981"
  },
  {
    id: "s13",
    symbolName: "transformer",
    nameOptions: ["Inductor", "Motor", "Transformer", "Relay"],
    correctName: 2,
    functionOptions: [
      "Converts current only",
      "Steps AC voltage up or down",
      "Stores DC energy",
      "Filters harmonics"
    ],
    correctFunction: 1,
    schematicRole: "Voltage conversion in power supplies",
    color: "#7c3aed"
  },
  {
    id: "s14",
    symbolName: "relay",
    nameOptions: ["Switch", "Relay", "Solenoid", "Electromagnet"],
    correctName: 1,
    functionOptions: [
      "Manual circuit control",
      "Electromagnetically controlled switch",
      "Stores magnetic energy",
      "Motor coil"
    ],
    correctFunction: 1,
    schematicRole: "Isolating control from high power circuits",
    color: "#e879f9"
  },
  {
    id: "s15",
    symbolName: "zener_diode",
    nameOptions: ["Diode", "LED", "Zener Diode", "Schottky"],
    correctName: 2,
    functionOptions: [
      "One-way current",
      "Emits light",
      "Maintains constant reverse breakdown voltage",
      "Varies capacitance"
    ],
    correctFunction: 2,
    schematicRole: "Voltage regulation and reference",
    color: "#f59e0b"
  },
  {
    id: "s16",
    symbolName: "pnp_transistor",
    nameOptions: ["NPN Transistor", "PNP Transistor", "MOSFET", "JFET"],
    correctName: 1,
    functionOptions: [
      "Turns ON with base HIGH",
      "Turns ON with base LOW",
      "Voltage controlled",
      "Only for AC signals"
    ],
    correctFunction: 1,
    schematicRole: "High-side switching applications",
    color: "#7c3aed"
  },
  {
    id: "s17",
    symbolName: "voltage_source",
    nameOptions: ["Current Source", "Voltage Source", "Battery", "Generator"],
    correctName: 1,
    functionOptions: [
      "Supplies constant current",
      "Maintains constant voltage regardless of load",
      "Varies with load",
      "Only AC output"
    ],
    correctFunction: 1,
    schematicRole: "Ideal power supply modeling",
    color: "#10b981"
  },
  {
    id: "s18",
    symbolName: "photoresistor",
    nameOptions: [
      "Thermistor",
      "Varistor",
      "LDR Photoresistor",
      "Potentiometer"
    ],
    correctName: 2,
    functionOptions: [
      "Changes with temperature",
      "Changes with voltage",
      "Decreases resistance with light",
      "Fixed resistance"
    ],
    correctFunction: 2,
    schematicRole: "Light sensing and automatic lighting",
    color: "#f59e0b"
  },
  {
    id: "s19",
    symbolName: "thermistor",
    nameOptions: ["Resistor", "Thermistor", "Varistor", "Fuse"],
    correctName: 1,
    functionOptions: [
      "Fixed resistance",
      "Changes resistance with temperature",
      "Changes with light",
      "Stores thermal energy"
    ],
    correctFunction: 1,
    schematicRole: "Temperature measurement and control",
    color: "#f43f5e"
  },
  {
    id: "s20",
    symbolName: "crystal_oscillator",
    nameOptions: ["Capacitor", "Inductor", "Crystal Oscillator", "Resonator"],
    correctName: 2,
    functionOptions: [
      "Stores charge",
      "Stores magnetic energy",
      "Generates precise stable frequency",
      "Filters noise"
    ],
    correctFunction: 2,
    schematicRole: "Clock generation for microcontrollers",
    color: "#00f5ff"
  }
];
function SymbolSVG({ name, color }) {
  const d = 60;
  switch (name) {
    case "resistor":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "10", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polyline",
          {
            points: "10,15 14,5 18,25 22,5 26,25 30,5 34,25 38,5 42,25 46,15",
            fill: "none",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "46",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "capacitor":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "25", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "25", y1: "5", x2: "25", y2: "25", stroke: color, strokeWidth: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "35", y1: "5", x2: "35", y2: "25", stroke: color, strokeWidth: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "35",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "diode":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "20", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polygon",
          {
            points: "20,5 40,15 20,25",
            fill: `${color}30`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "40", y1: "5", x2: "40", y2: "25", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "40",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "npn_transistor":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "50", viewBox: "0 0 60 50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "30",
            cy: "25",
            r: "20",
            fill: `${color}15`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "25", x2: "18", y2: "25", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "18",
            y1: "10",
            x2: "18",
            y2: "40",
            stroke: color,
            strokeWidth: "3"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "18", x2: "40", y2: "8", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "18",
            y1: "32",
            x2: "40",
            y2: "42",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "led":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "15", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polygon",
          {
            points: "15,5 35,15 15,25",
            fill: `${color}30`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "35", y1: "5", x2: "35", y2: "25", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "35",
            y1: "15",
            x2: "55",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "38",
            y1: "3",
            x2: "45",
            y2: "-3",
            stroke: color,
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "43",
            y1: "3",
            x2: "50",
            y2: "-3",
            stroke: color,
            strokeWidth: "1.5"
          }
        )
      ] });
    case "ground":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "40", height: d, viewBox: "0 0 40 60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "20", y1: "0", x2: "20", y2: "25", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5", y1: "25", x2: "35", y2: "25", stroke: color, strokeWidth: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "10",
            y1: "33",
            x2: "30",
            y2: "33",
            stroke: color,
            strokeWidth: "2.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "15",
            y1: "41",
            x2: "25",
            y2: "41",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "inductor":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "8", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M8,15 Q14,2 20,15 Q26,2 32,15 Q38,2 44,15 Q50,2 56,15",
            fill: "none",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "52",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "battery":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "18", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "6", x2: "18", y2: "24", stroke: color, strokeWidth: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "24",
            y1: "10",
            x2: "24",
            y2: "20",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "30", y1: "6", x2: "30", y2: "24", stroke: color, strokeWidth: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "36",
            y1: "10",
            x2: "36",
            y2: "20",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "36",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "switch":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "15", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15", cy: "15", r: "3", fill: color }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15", y1: "15", x2: "42", y2: "5", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "45", cy: "15", r: "3", fill: color }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "45",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    case "op_amp":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "50", viewBox: "0 0 60 50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polygon",
          {
            points: "10,5 50,25 10,45",
            fill: `${color}15`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "17", x2: "10", y2: "17", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "33", x2: "10", y2: "33", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "50",
            y1: "25",
            x2: "60",
            y2: "25",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "20", y: "22", fill: color, fontSize: "10", fontWeight: "bold", children: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "20", y: "36", fill: color, fontSize: "10", fontWeight: "bold", children: "-" })
      ] });
    case "fuse":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "15", x2: "12", y2: "15", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "12",
            y: "8",
            width: "36",
            height: "14",
            rx: "7",
            fill: `${color}20`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "48",
            y1: "15",
            x2: "60",
            y2: "15",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "20",
            y1: "15",
            x2: "40",
            y2: "15",
            stroke: color,
            strokeWidth: "1.5",
            strokeDasharray: "3,2"
          }
        )
      ] });
    case "mosfet":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "50", viewBox: "0 0 60 50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "30",
            cy: "25",
            r: "20",
            fill: `${color}10`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "25", x2: "18", y2: "25", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "18",
            y1: "12",
            x2: "18",
            y2: "38",
            stroke: color,
            strokeWidth: "3"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "22", y1: "12", x2: "22", y2: "38", stroke: "none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "24", y1: "15", x2: "40", y2: "8", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "24",
            y1: "25",
            x2: "40",
            y2: "25",
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "24",
            y1: "35",
            x2: "40",
            y2: "42",
            stroke: color,
            strokeWidth: "2"
          }
        )
      ] });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: d, height: "30", viewBox: "0 0 60 30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "10",
            y: "5",
            width: "40",
            height: "20",
            rx: "4",
            fill: `${color}20`,
            stroke: color,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "30",
            y: "18",
            textAnchor: "middle",
            fill: color,
            fontSize: "8",
            fontFamily: "Orbitron",
            children: name.slice(0, 4).toUpperCase()
          }
        )
      ] });
  }
}
function ElectronicLabGame({ config, onGameEnd }) {
  const spec = SPECS[config.difficulty];
  const [components, setComponents] = reactExports.useState(
    spec.components.map((c) => ({ ...c }))
  );
  const [wires, setWires] = reactExports.useState([]);
  const [connecting, setConnecting] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [shortCircuit, setShortCircuit] = reactExports.useState(false);
  const [circuitComplete, setCircuitComplete] = reactExports.useState(false);
  const [ohmAnswer, setOhmAnswer] = reactExports.useState("");
  const [ohmSolved, setOhmSolved] = reactExports.useState(false);
  const [ohmError, setOhmError] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const connected = wires.filter((w) => w.active).length;
      const acc = completed ? 95 : connected / spec.requiredConnections.length * 100;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, wires, spec.requiredConnections.length]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function handleComponentClick(compId) {
    if (!gameStarted || circuitComplete) return;
    if (!connecting) {
      setConnecting(compId);
      return;
    }
    if (connecting === compId) {
      setConnecting(null);
      return;
    }
    const exists = wires.some(
      (w) => w.from === connecting && w.to === compId || w.from === compId && w.to === connecting
    );
    if (exists) {
      setConnecting(null);
      return;
    }
    const isValid = spec.requiredConnections.some(
      ([a, b]) => a === connecting && b === compId || a === compId && b === connecting
    );
    if (!isValid) {
      setShortCircuit(true);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
      setTimeout(() => setShortCircuit(false), 800);
      setConnecting(null);
      return;
    }
    const newWire = {
      id: `w-${connecting}-${compId}`,
      from: connecting,
      to: compId,
      active: true
    };
    const newWires = [...wires, newWire];
    setWires(newWires);
    setScore((s) => s + 120 * config.difficulty);
    setComponents(
      (prev) => prev.map(
        (c) => connecting === c.id || compId === c.id ? { ...c, connected: true } : c
      )
    );
    const connectedPairs = new Set(newWires.map((w) => `${w.from}-${w.to}`));
    const allConnected = spec.requiredConnections.every(
      ([a, b]) => connectedPairs.has(`${a}-${b}`) || connectedPairs.has(`${b}-${a}`)
    );
    if (allConnected) {
      setCircuitComplete(true);
      setScore((s) => s + 400 * config.difficulty);
    }
    setConnecting(null);
  }
  function handleOhmSubmit() {
    if (!spec.ohmQuestion) return;
    const val = Number.parseFloat(ohmAnswer);
    if (Math.abs(val - spec.ohmQuestion.answer) <= 1) {
      setOhmSolved(true);
      setScore((s) => s + 250 * config.difficulty);
      setTimeout(() => endGame(true), 1500);
    } else {
      setOhmError(true);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
      setTimeout(() => setOhmError(false), 800);
    }
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "circuits_hub.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
                  children: "Electronic Circuit Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Click two components to connect them with a wire. Build the specified circuit to complete the lab." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f43f5e] text-xs mb-6", children: "Wrong connections cause short circuits and cost lives!" }),
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
                  "data-ocid": "circuits_hub.start_button",
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
      "data-ocid": "circuits_hub.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#7c3aed]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: spec.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold mt-1", children: spec.objective })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `relative flex-1 rounded-xl border overflow-hidden glass ${shortCircuit ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.6)]" : "border-border/30"} transition-all`,
            "data-ocid": "circuits_hub.breadboard",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  className: "absolute inset-0 w-full h-full pointer-events-none z-0",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    wires.map((wire) => {
                      const f = components.find((c) => c.id === wire.from);
                      const t = components.find((c) => c.id === wire.to);
                      if (!f || !t) return null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: `${f.x + 5}%`,
                          y1: `${f.y + 5}%`,
                          x2: `${t.x + 5}%`,
                          y2: `${t.y + 5}%`,
                          stroke: circuitComplete ? "#10b981" : "#00f5ff",
                          strokeWidth: "2",
                          style: {
                            filter: `drop-shadow(0 0 4px ${circuitComplete ? "#10b981" : "#00f5ff"})`
                          }
                        },
                        wire.id
                      );
                    }),
                    connecting && (() => {
                      const c = components.find((comp) => comp.id === connecting);
                      return c ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: `${c.x + 5}%`,
                          cy: `${c.y + 5}%`,
                          r: "14",
                          fill: "none",
                          stroke: "#f59e0b",
                          strokeWidth: "2",
                          strokeDasharray: "4,2"
                        }
                      ) : null;
                    })()
                  ]
                }
              ),
              components.map((comp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  whileHover: { scale: 1.08 },
                  whileTap: { scale: 0.95 },
                  onClick: () => handleComponentClick(comp.id),
                  className: "absolute flex flex-col items-center justify-center rounded-lg border-2 w-20 h-14 text-center cursor-pointer transition-all z-20 text-xs font-bold",
                  style: {
                    left: `${comp.x}%`,
                    top: `${comp.y}%`,
                    borderColor: connecting === comp.id ? "#f59e0b" : comp.connected ? "#10b981" : `${comp.color}60`,
                    backgroundColor: comp.connected ? "#10b98115" : `${comp.color}10`,
                    color: comp.color,
                    boxShadow: connecting === comp.id ? "0 0 16px #f59e0b" : comp.connected ? "0 0 8px #10b981" : "none"
                  },
                  "data-ocid": `circuits_hub.component.${comp.id}`,
                  children: [
                    comp.connected ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheckBig,
                      {
                        className: "h-3 w-3 mb-0.5",
                        style: { color: "#10b981" }
                      }
                    ) : null,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px" }, children: comp.label })
                  ]
                },
                comp.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: shortCircuit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.5 },
                  animate: { opacity: 1, scale: 1.2 },
                  exit: { opacity: 0 },
                  className: "absolute inset-0 flex items-center justify-center z-30 pointer-events-none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Zap,
                      {
                        className: "h-20 w-20 mx-auto text-[#f43f5e]",
                        style: { filter: "drop-shadow(0 0 20px #f43f5e)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[#f43f5e] font-black text-xl mt-2",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "SHORT CIRCUIT!"
                      }
                    )
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: circuitComplete && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm z-30",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 text-center max-w-xs w-full border border-[#10b981]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-10 w-10 mx-auto mb-2 text-[#10b981]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-lg font-black text-[#10b981] mb-3",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "CIRCUIT COMPLETE!"
                      }
                    ),
                    spec.ohmQuestion && !ohmSolved && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground mb-2", children: [
                        "Apply Ohm's Law: V=",
                        spec.ohmQuestion.v,
                        "V, R=",
                        spec.ohmQuestion.r,
                        "\\u03a9"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
                        "Current I = V/R = ? (",
                        spec.ohmQuestion.unit,
                        ")"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "number",
                            value: ohmAnswer,
                            onChange: (e) => setOhmAnswer(e.target.value),
                            className: `flex-1 rounded-lg px-3 py-2 text-sm bg-card border text-foreground ${ohmError ? "border-[#f43f5e]" : "border-border"}`,
                            placeholder: "Current (mA)",
                            "data-ocid": "circuits_hub.ohm_input"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          GlowButton,
                          {
                            variant: "primary",
                            size: "sm",
                            onClick: handleOhmSubmit,
                            "data-ocid": "circuits_hub.ohm_submit",
                            children: "Solve"
                          }
                        )
                      ] }),
                      ohmError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#f43f5e] mt-2", children: "Incorrect — try again" })
                    ] }),
                    ohmSolved && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#10b981] font-bold", children: "Lab Complete! Perfect solution." })
                  ] })
                }
              ) })
            ]
          }
        ),
        connecting && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 text-xs text-center text-[#f59e0b]",
            style: { fontFamily: "'Orbitron', sans-serif" },
            children: [
              "Connecting from: ",
              connecting,
              " — click target component"
            ]
          }
        )
      ]
    }
  );
}
function SeriesParallelGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 10;
  const questions = CIRCUIT_QUESTIONS.slice(0, count);
  const [idx, setIdx] = reactExports.useState(0);
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
  const q = questions[idx];
  function handleAnswer(optIdx) {
    if (answered || !gameStarted) return;
    setSelected(optIdx);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === q.correctIdx) {
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
      const n = idx + 1;
      if (n >= questions.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setSelected(null);
      setAnswered(false);
    }, 1800);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "series_parallel.page",
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
                  children: "Series vs Parallel Analysis"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Circuit diagrams shown side by side. Answer questions about total resistance, current distribution, and component behavior." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Master the fundamental difference between series and parallel circuit configurations." }),
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
                  "data-ocid": "series_parallel.start_button",
                  children: "Analyze Circuits"
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
      "data-ocid": "series_parallel.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
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
                  className: `glass-card rounded-xl p-4 shrink-0 border-2 ${q.circuitType === "series" ? "border-[#00f5ff]/40" : "border-[#7c3aed]/40"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "text-xs font-bold mb-2",
                        style: {
                          fontFamily: "'Orbitron', sans-serif",
                          color: q.circuitType === "series" ? "#00f5ff" : "#7c3aed"
                        },
                        children: [
                          q.circuitType.toUpperCase(),
                          " CIRCUIT — ",
                          q.description
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100%", height: "80", viewBox: "0 0 300 80", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "10",
                          y1: "40",
                          x2: "30",
                          y2: "40",
                          stroke: "#94a3b8",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "30",
                          y1: "28",
                          x2: "30",
                          y2: "52",
                          stroke: "#f43f5e",
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "36",
                          y1: "32",
                          x2: "36",
                          y2: "48",
                          stroke: "#f43f5e",
                          strokeWidth: "2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: "20",
                          y: "65",
                          fill: "#f43f5e",
                          fontSize: "9",
                          textAnchor: "middle",
                          children: [
                            q.voltage,
                            "V"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1: "36",
                          y1: "40",
                          x2: "60",
                          y2: "40",
                          stroke: "#94a3b8",
                          strokeWidth: "2"
                        }
                      ),
                      q.circuitType === "series" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "polyline",
                          {
                            points: "60,40 65,28 70,52 75,28 80,52 85,28 90,40",
                            fill: "none",
                            stroke: "#f59e0b",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "text",
                          {
                            x: "75",
                            y: "65",
                            fill: "#f59e0b",
                            fontSize: "9",
                            textAnchor: "middle",
                            children: [
                              q.r1,
                              "\\u03a9"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "90",
                            y1: "40",
                            x2: "130",
                            y2: "40",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "polyline",
                          {
                            points: "130,40 135,28 140,52 145,28 150,52 155,28 160,40",
                            fill: "none",
                            stroke: "#7c3aed",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "text",
                          {
                            x: "145",
                            y: "65",
                            fill: "#7c3aed",
                            fontSize: "9",
                            textAnchor: "middle",
                            children: [
                              q.r2,
                              "\\u03a9"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "160",
                            y1: "40",
                            x2: "290",
                            y2: "40",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "290",
                            y1: "40",
                            x2: "290",
                            y2: "60",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "10",
                            y1: "60",
                            x2: "290",
                            y2: "60",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "10",
                            y1: "40",
                            x2: "10",
                            y2: "60",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "60",
                            y1: "40",
                            x2: "60",
                            y2: "15",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "60",
                            y1: "40",
                            x2: "60",
                            y2: "65",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "polyline",
                          {
                            points: "60,15 180,15",
                            fill: "none",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "polyline",
                          {
                            points: "100,15 105,5 110,25 115,5 120,25 125,5 130,15",
                            fill: "none",
                            stroke: "#f59e0b",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "text",
                          {
                            x: "115",
                            y: "34",
                            fill: "#f59e0b",
                            fontSize: "9",
                            textAnchor: "middle",
                            children: [
                              q.r1,
                              "\\u03a9"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "polyline",
                          {
                            points: "60,65 180,65",
                            fill: "none",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "polyline",
                          {
                            points: "100,65 105,55 110,75 115,55 120,75 125,55 130,65",
                            fill: "none",
                            stroke: "#7c3aed",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "text",
                          {
                            x: "115",
                            y: "80",
                            fill: "#7c3aed",
                            fontSize: "9",
                            textAnchor: "middle",
                            children: [
                              q.r2,
                              "\\u03a9"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "180",
                            y1: "15",
                            x2: "180",
                            y2: "65",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "180",
                            y1: "40",
                            x2: "290",
                            y2: "40",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "290",
                            y1: "40",
                            x2: "290",
                            y2: "60",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "10",
                            y1: "60",
                            x2: "290",
                            y2: "60",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: "10",
                            y1: "40",
                            x2: "10",
                            y2: "60",
                            stroke: "#94a3b8",
                            strokeWidth: "2"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: q.question }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1", children: q.options.map((opt, i) => {
                let bc = "border-border/30 hover:border-[#00f5ff]/40";
                if (answered) {
                  if (i === q.correctIdx) bc = "border-[#10b981] bg-[#10b981]/10";
                  else if (i === selected)
                    bc = "border-[#f43f5e] bg-[#f43f5e]/10";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    whileHover: !answered ? { scale: 1.02 } : {},
                    whileTap: !answered ? { scale: 0.98 } : {},
                    onClick: () => handleAnswer(i),
                    disabled: answered,
                    className: `glass-card rounded-xl p-3 border text-sm cursor-pointer transition-all text-left ${bc}`,
                    "data-ocid": `series_parallel.option.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                      answered && i === q.correctIdx && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] shrink-0" }),
                      answered && i === selected && i !== q.correctIdx && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] shrink-0" }),
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Analysis: " }),
                    q.explanation
                  ] })
                }
              ) })
            ]
          },
          q.id
        ) })
      ]
    }
  );
}
function ComponentQuizGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 6 : config.difficulty === 2 ? 13 : 20;
  const questions = SYMBOL_QUESTIONS.slice(0, count);
  const [idx, setIdx] = reactExports.useState(0);
  const [nameSelected, setNameSelected] = reactExports.useState(null);
  const [funcSelected, setFuncSelected] = reactExports.useState(null);
  const [nameAnswered, setNameAnswered] = reactExports.useState(false);
  const [funcAnswered, setFuncAnswered] = reactExports.useState(false);
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
  const q = questions[idx];
  function handleNameAnswer(optIdx) {
    if (nameAnswered || !gameStarted) return;
    setNameSelected(optIdx);
    setNameAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === q.correctName) {
      setScore((s) => s + 150 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
  }
  function handleFuncAnswer(optIdx) {
    if (funcAnswered || !nameAnswered || !gameStarted) return;
    setFuncSelected(optIdx);
    setFuncAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === q.correctFunction) {
      setScore((s) => s + 150 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
    setTimeout(() => {
      const n = idx + 1;
      if (n >= questions.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setNameSelected(null);
      setFuncSelected(null);
      setNameAnswered(false);
      setFuncAnswered(false);
    }, 1800);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "component_quiz.page",
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
                  children: "Electronic Symbol Quiz"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Circuit symbols appear one at a time. Identify the component name, then classify its function in a schematic." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "20 standard IEC/ANSI symbols including resistors, transistors, ICs, and more." }),
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
                  "data-ocid": "component_quiz.start_button",
                  children: "Begin Quiz"
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
      "data-ocid": "component_quiz.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#e879f9" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
            className: "flex flex-col gap-3 flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 shrink-0 flex flex-col items-center gap-3 border border-[#e879f9]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: [
                      "SYMBOL #",
                      idx + 1,
                      " OF ",
                      questions.length
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center bg-[#0a0a1a] rounded-xl p-4 w-full min-h-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SymbolSVG, { name: q.symbolName, color: q.color }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: q.schematicRole })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif", color: "#e879f9" },
                    children: "STEP 1: Identify the component name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: q.nameOptions.map((opt, i) => {
                  let bc = "border-border/30 hover:border-[#e879f9]/40";
                  if (nameAnswered) {
                    if (i === q.correctName)
                      bc = "border-[#10b981] bg-[#10b981]/10";
                    else if (i === nameSelected)
                      bc = "border-[#f43f5e] bg-[#f43f5e]/10";
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      type: "button",
                      whileHover: !nameAnswered ? { scale: 1.02 } : {},
                      whileTap: !nameAnswered ? { scale: 0.98 } : {},
                      onClick: () => handleNameAnswer(i),
                      disabled: nameAnswered,
                      className: `glass-card rounded-xl p-2 border text-xs font-bold cursor-pointer transition-all ${bc}`,
                      "data-ocid": `component_quiz.name.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        nameAnswered && i === q.correctName && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-[#10b981]" }),
                        nameAnswered && i === nameSelected && i !== q.correctName && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-[#f43f5e]" }),
                        opt
                      ] })
                    },
                    `n-${i}`
                  );
                }) })
              ] }),
              nameAnswered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold mb-2",
                    style: {
                      fontFamily: "'Orbitron', sans-serif",
                      color: "#00f5ff"
                    },
                    children: "STEP 2: Select its primary function"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: q.functionOptions.map((opt, i) => {
                  let bc = "border-border/30 hover:border-[#00f5ff]/40";
                  if (funcAnswered) {
                    if (i === q.correctFunction)
                      bc = "border-[#10b981] bg-[#10b981]/10";
                    else if (i === funcSelected)
                      bc = "border-[#f43f5e] bg-[#f43f5e]/10";
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      type: "button",
                      whileHover: !funcAnswered ? { scale: 1.02 } : {},
                      whileTap: !funcAnswered ? { scale: 0.98 } : {},
                      onClick: () => handleFuncAnswer(i),
                      disabled: funcAnswered,
                      className: `glass-card rounded-xl p-2 border text-xs font-bold cursor-pointer transition-all ${bc}`,
                      "data-ocid": `component_quiz.func.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        funcAnswered && i === q.correctFunction && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-[#10b981]" }),
                        funcAnswered && i === funcSelected && i !== q.correctFunction && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-[#f43f5e]" }),
                        opt
                      ] })
                    },
                    `f-${i}`
                  );
                }) })
              ] })
            ]
          },
          q.id
        ) })
      ]
    }
  );
}
function CircuitsHub(props) {
  switch (props.config.gameId) {
    case "series-parallel":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SeriesParallelGame, { ...props });
    case "component-quiz":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentQuizGame, { ...props });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ElectronicLabGame, { ...props });
  }
}
export {
  CircuitsHub as default
};
