import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { C as Cpu } from "./cpu-DjqPbGA_.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
function evalGate(type, vals) {
  switch (type) {
    case "AND":
      return vals.every((v) => v === 1) ? 1 : 0;
    case "OR":
      return vals.some((v) => v === 1) ? 1 : 0;
    case "NOT":
      return vals[0] === 1 ? 0 : 1;
    case "XOR":
      return vals.filter((v) => v === 1).length % 2 === 1 ? 1 : 0;
    case "NAND":
      return vals.every((v) => v === 1) ? 0 : 1;
    default:
      return 0;
  }
}
const GATE_COLORS = {
  AND: "#00f5ff",
  OR: "#7c3aed",
  NOT: "#f59e0b",
  XOR: "#10b981",
  NAND: "#f43f5e",
  empty: "#374151"
};
const CIRCUITS = {
  1: [
    {
      title: "Single AND Gate",
      description: "Toggle inputs A and B. Trace the signal through the AND gate.",
      inputLabels: ["A", "B"],
      defaultInputs: [0, 1],
      gates: [
        {
          id: "g1",
          type: "AND",
          x: 50,
          y: 40,
          inputs: ["A", "B"],
          output: "OUT"
        }
      ],
      targetQuestion: "What is the output when A=0, B=1?",
      computeAnswer: ([a, b]) => evalGate("AND", [a, b])
    },
    {
      title: "OR Gate Logic",
      description: "An OR gate outputs 1 if ANY input is 1.",
      inputLabels: ["X", "Y"],
      defaultInputs: [1, 0],
      gates: [
        {
          id: "g1",
          type: "OR",
          x: 50,
          y: 40,
          inputs: ["X", "Y"],
          output: "OUT"
        }
      ],
      targetQuestion: "What is the output when X=1, Y=0?",
      computeAnswer: ([x, y]) => evalGate("OR", [x, y])
    },
    {
      title: "NOT Inverter",
      description: "A NOT gate inverts the signal.",
      inputLabels: ["IN"],
      defaultInputs: [1],
      gates: [
        { id: "g1", type: "NOT", x: 50, y: 40, inputs: ["IN"], output: "OUT" }
      ],
      targetQuestion: "What is the output when IN=1?",
      computeAnswer: ([a]) => evalGate("NOT", [a])
    }
  ],
  2: [
    {
      title: "Two-Gate Chain",
      description: "Signal flows through AND then NOT.",
      inputLabels: ["A", "B"],
      defaultInputs: [1, 1],
      gates: [
        {
          id: "g1",
          type: "AND",
          x: 30,
          y: 40,
          inputs: ["A", "B"],
          output: "M"
        },
        { id: "g2", type: "NOT", x: 65, y: 40, inputs: ["M"], output: "OUT" }
      ],
      targetQuestion: "A=1, B=1. AND output M=? Final OUT=?",
      computeAnswer: ([a, b]) => evalGate("NOT", [evalGate("AND", [a, b])])
    },
    {
      title: "XOR Detector",
      description: "XOR outputs 1 only when inputs differ.",
      inputLabels: ["D0", "D1"],
      defaultInputs: [0, 1],
      gates: [
        {
          id: "g1",
          type: "XOR",
          x: 50,
          y: 40,
          inputs: ["D0", "D1"],
          output: "OUT"
        }
      ],
      targetQuestion: "D0=0, D1=1. XOR output?",
      computeAnswer: ([a, b]) => evalGate("XOR", [a, b])
    },
    {
      title: "Three-Input OR Network",
      description: "Two AND gates feed an OR gate.",
      inputLabels: ["P", "Q", "R"],
      defaultInputs: [1, 0, 1],
      gates: [
        {
          id: "g1",
          type: "AND",
          x: 25,
          y: 25,
          inputs: ["P", "Q"],
          output: "M1"
        },
        {
          id: "g2",
          type: "AND",
          x: 25,
          y: 60,
          inputs: ["Q", "R"],
          output: "M2"
        },
        {
          id: "g3",
          type: "OR",
          x: 65,
          y: 42,
          inputs: ["M1", "M2"],
          output: "OUT"
        }
      ],
      targetQuestion: "P=1, Q=0, R=1. M1=AND(P,Q)=? M2=AND(Q,R)=? OUT=OR(M1,M2)=?",
      computeAnswer: ([p, q, r]) => evalGate("OR", [evalGate("AND", [p, q]), evalGate("AND", [q, r])])
    }
  ],
  3: [
    {
      title: "Half Adder Circuit",
      description: "A half adder uses XOR for sum and AND for carry.",
      inputLabels: ["A", "B"],
      defaultInputs: [1, 1],
      gates: [
        {
          id: "g1",
          type: "XOR",
          x: 50,
          y: 25,
          inputs: ["A", "B"],
          output: "SUM"
        },
        {
          id: "g2",
          type: "AND",
          x: 50,
          y: 65,
          inputs: ["A", "B"],
          output: "CARRY"
        }
      ],
      targetQuestion: "A=1, B=1. SUM=XOR(A,B)=? CARRY=AND(A,B)=?",
      computeAnswer: ([a, b]) => evalGate("XOR", [a, b])
    },
    {
      title: "NAND Gate Logic",
      description: "NAND is AND followed by NOT.",
      inputLabels: ["X", "Y"],
      defaultInputs: [1, 0],
      gates: [
        {
          id: "g1",
          type: "NAND",
          x: 50,
          y: 40,
          inputs: ["X", "Y"],
          output: "OUT"
        }
      ],
      targetQuestion: "X=1, Y=0. NAND = NOT(AND(X,Y)) = ?",
      computeAnswer: ([x, y]) => evalGate("NAND", [x, y])
    }
  ]
};
const TRUTH_TABLES = [
  {
    id: "tt1",
    expression: "A AND B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 0 },
      { inputVals: [0, 1], output: 0 },
      { inputVals: [1, 0], output: 0 },
      { inputVals: [1, 1], output: 1 }
    ],
    compute: (a, b) => evalGate("AND", [a, b])
  },
  {
    id: "tt2",
    expression: "A OR B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 0 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 1 }
    ],
    compute: (a, b) => evalGate("OR", [a, b])
  },
  {
    id: "tt3",
    expression: "NOT A",
    inputs: ["A"],
    rows: [
      { inputVals: [0], output: 1 },
      { inputVals: [1], output: 0 }
    ],
    compute: (a) => evalGate("NOT", [a])
  },
  {
    id: "tt4",
    expression: "A XOR B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 0 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 0 }
    ],
    compute: (a, b) => evalGate("XOR", [a, b])
  },
  {
    id: "tt5",
    expression: "A NAND B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 1 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 0 }
    ],
    compute: (a, b) => evalGate("NAND", [a, b])
  },
  {
    id: "tt6",
    expression: "A AND (B OR C)",
    inputs: ["A", "B", "C"],
    rows: [
      { inputVals: [0, 0, 0], output: 0 },
      { inputVals: [0, 0, 1], output: 0 },
      { inputVals: [0, 1, 0], output: 0 },
      { inputVals: [0, 1, 1], output: 0 },
      { inputVals: [1, 0, 0], output: 0 },
      { inputVals: [1, 0, 1], output: 1 },
      { inputVals: [1, 1, 0], output: 1 },
      { inputVals: [1, 1, 1], output: 1 }
    ],
    compute: (a, b, c) => evalGate("AND", [a, evalGate("OR", [b, c])])
  },
  {
    id: "tt7",
    expression: "(A OR B) AND C",
    inputs: ["A", "B", "C"],
    rows: [
      { inputVals: [0, 0, 0], output: 0 },
      { inputVals: [0, 0, 1], output: 0 },
      { inputVals: [0, 1, 0], output: 0 },
      { inputVals: [0, 1, 1], output: 1 },
      { inputVals: [1, 0, 0], output: 0 },
      { inputVals: [1, 0, 1], output: 1 },
      { inputVals: [1, 1, 0], output: 0 },
      { inputVals: [1, 1, 1], output: 1 }
    ],
    compute: (a, b, c) => evalGate("AND", [evalGate("OR", [a, b]), c])
  },
  {
    id: "tt8",
    expression: "NOT (A AND B)",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 1 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 0 }
    ],
    compute: (a, b) => evalGate("NOT", [evalGate("AND", [a, b])])
  }
];
const BIN_CHALLENGES = [
  {
    id: "b1",
    op: "add",
    a: 5,
    b: 3,
    aBin: "0101",
    bBin: "0011",
    resultBin: "1000",
    resultDec: 8,
    question: "0101 + 0011 = ? (4-bit)"
  },
  {
    id: "b2",
    op: "add",
    a: 9,
    b: 6,
    aBin: "1001",
    bBin: "0110",
    resultBin: "1111",
    resultDec: 15,
    question: "1001 + 0110 = ? (4-bit)"
  },
  {
    id: "b3",
    op: "subtract",
    a: 8,
    b: 3,
    aBin: "1000",
    bBin: "0011",
    resultBin: "0101",
    resultDec: 5,
    question: "1000 - 0011 = ? (4-bit)"
  },
  {
    id: "b4",
    op: "add",
    a: 13,
    b: 7,
    aBin: "01101",
    bBin: "00111",
    resultBin: "10100",
    resultDec: 20,
    question: "01101 + 00111 = ? (5-bit)"
  },
  {
    id: "b5",
    op: "subtract",
    a: 15,
    b: 6,
    aBin: "01111",
    bBin: "00110",
    resultBin: "01001",
    resultDec: 9,
    question: "01111 - 00110 = ? (5-bit)"
  },
  {
    id: "b6",
    op: "add",
    a: 25,
    b: 14,
    aBin: "011001",
    bBin: "001110",
    resultBin: "100111",
    resultDec: 39,
    question: "011001 + 001110 = ? (6-bit)"
  },
  {
    id: "b7",
    op: "add",
    a: 63,
    b: 64,
    aBin: "00111111",
    bBin: "01000000",
    resultBin: "01111111",
    resultDec: 127,
    question: "00111111 + 01000000 = ? (8-bit)"
  },
  {
    id: "b8",
    op: "subtract",
    a: 100,
    b: 37,
    aBin: "01100100",
    bBin: "00100101",
    resultBin: "00111111",
    resultDec: 63,
    question: "01100100 - 00100101 = ? (8-bit)"
  },
  {
    id: "b9",
    op: "add",
    a: 128,
    b: 127,
    aBin: "10000000",
    bBin: "01111111",
    resultBin: "11111111",
    resultDec: 255,
    question: "10000000 + 01111111 = ? (8-bit)",
    includeHex: true,
    hexResult: "FF"
  },
  {
    id: "b10",
    op: "add",
    a: 170,
    b: 85,
    aBin: "10101010",
    bBin: "01010101",
    resultBin: "11111111",
    resultDec: 255,
    question: "10101010 + 01010101 = ? (alternating pattern)",
    includeHex: true,
    hexResult: "FF"
  },
  {
    id: "b11",
    op: "subtract",
    a: 240,
    b: 15,
    aBin: "11110000",
    bBin: "00001111",
    resultBin: "11100001",
    resultDec: 225,
    question: "11110000 - 00001111 = ? (8-bit)",
    includeHex: true,
    hexResult: "E1"
  },
  {
    id: "b12",
    op: "add",
    a: 192,
    b: 63,
    aBin: "11000000",
    bBin: "00111111",
    resultBin: "11111111",
    resultDec: 255,
    question: "11000000 + 00111111 = ? (8-bit)",
    includeHex: true,
    hexResult: "FF"
  },
  {
    id: "b13",
    op: "subtract",
    a: 200,
    b: 100,
    aBin: "11001000",
    bBin: "01100100",
    resultBin: "01100100",
    resultDec: 100,
    question: "11001000 - 01100100 = ? (200 - 100 = ?)",
    includeHex: true,
    hexResult: "64"
  },
  {
    id: "b14",
    op: "add",
    a: 16,
    b: 32,
    aBin: "00010000",
    bBin: "00100000",
    resultBin: "00110000",
    resultDec: 48,
    question: "00010000 + 00100000 = ? (powers of 2)",
    includeHex: true,
    hexResult: "30"
  },
  {
    id: "b15",
    op: "subtract",
    a: 255,
    b: 128,
    aBin: "11111111",
    bBin: "10000000",
    resultBin: "01111111",
    resultDec: 127,
    question: "11111111 - 10000000 = ? (8-bit)",
    includeHex: true,
    hexResult: "7F"
  }
];
function LogicGateNetworkGame({ config, onGameEnd }) {
  const circuits = CIRCUITS[config.difficulty];
  const [circuitIdx, setCircuitIdx] = reactExports.useState(0);
  const circuit = circuits[circuitIdx];
  const [inputs, setInputs] = reactExports.useState([...circuit.defaultInputs]);
  const [prediction, setPrediction] = reactExports.useState(null);
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
  function toggleInput(i) {
    if (!gameStarted || answered) return;
    setInputs(
      (prev) => prev.map((v, idx) => idx === i ? v === 0 ? 1 : 0 : v)
    );
  }
  function handlePredict(val) {
    if (answered || !gameStarted) return;
    const answer = circuit.computeAnswer(inputs);
    setPrediction(val);
    setAnswered(true);
    setTotal((t) => t + 1);
    const isCorrect = val === answer;
    if (isCorrect) {
      setScore((s) => s + 200 * config.difficulty);
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
      setPrediction(null);
      setAnswered(false);
      const next = circuitIdx + 1;
      if (next >= circuits.length) {
        endGame(true);
        return;
      }
      const nextC = circuits[next];
      setCircuitIdx(next);
      setInputs([...nextC.defaultInputs]);
    }, 1600);
  }
  function computeIntermediates() {
    const vals = {};
    circuit.inputLabels.forEach((label, i) => {
      vals[label] = inputs[i];
    });
    for (const gate of circuit.gates) {
      const iv = gate.inputs.map((inp) => vals[inp] ?? 0);
      vals[gate.output] = evalGate(gate.type, iv);
    }
    return vals;
  }
  const intermediates = computeIntermediates();
  const finalOutput = intermediates.OUT ?? intermediates.SUM ?? 0;
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "machine_logic.page",
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
                  children: "Logic Gate Network"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Toggle input switches to trace signals through digital logic gates. Predict the final output." }),
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
                  "data-ocid": "machine_logic.start_button",
                  children: "Activate Circuit"
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
      "data-ocid": "machine_logic.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
            className: "flex-1 flex flex-col gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: circuit.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mt-1", children: circuit.targetQuestion })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `relative flex-1 rounded-xl border-2 overflow-hidden glass transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
                  "data-ocid": "machine_logic.circuit_board",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
                    circuit.inputLabels.map((label, i) => {
                      const y = circuit.inputLabels.length === 1 ? 50 : 20 + i / (circuit.inputLabels.length - 1) * 60;
                      const val = inputs[i];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.button,
                        {
                          type: "button",
                          whileTap: { scale: 0.9 },
                          onClick: () => toggleInput(i),
                          className: "absolute flex flex-col items-center justify-center rounded-lg border-2 w-14 h-10 z-20 cursor-pointer transition-all",
                          style: {
                            left: "3%",
                            top: `${y}%`,
                            transform: "translateY(-50%)",
                            borderColor: val === 1 ? "#10b981" : "#f43f5e",
                            backgroundColor: val === 1 ? "#10b98120" : "#f43f5e20",
                            boxShadow: val === 1 ? "0 0 10px #10b981" : "0 0 10px #f43f5e"
                          },
                          "data-ocid": `machine_logic.input.${label}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-xs font-black tabular-nums",
                                style: {
                                  color: val === 1 ? "#10b981" : "#f43f5e",
                                  fontFamily: "'Orbitron', sans-serif"
                                },
                                children: val
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-muted-foreground", children: label })
                          ]
                        },
                        `inp-${i}`
                      );
                    }),
                    circuit.gates.map((gate) => {
                      const outVal = intermediates[gate.output];
                      const color = GATE_COLORS[gate.type];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "absolute flex flex-col items-center justify-center rounded-xl border-2 w-20 h-14 z-20",
                          style: {
                            left: `${gate.x}%`,
                            top: `${gate.y}%`,
                            transform: "translate(-50%, -50%)",
                            borderColor: `${color}80`,
                            backgroundColor: `${color}15`,
                            boxShadow: `0 0 10px ${color}40`
                          },
                          "data-ocid": `machine_logic.gate.${gate.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-xs font-black",
                                style: { color, fontFamily: "'Orbitron', sans-serif" },
                                children: gate.type
                              }
                            ),
                            answered && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "text-xs font-bold tabular-nums",
                                style: { color: outVal === 1 ? "#10b981" : "#f43f5e" },
                                children: [
                                  gate.output,
                                  "=",
                                  outVal
                                ]
                              }
                            )
                          ]
                        },
                        gate.id
                      );
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-xl border-2 w-16 h-14 z-20",
                        style: {
                          borderColor: answered ? finalOutput === 1 ? "#10b981" : "#f43f5e" : "#374151",
                          backgroundColor: answered ? finalOutput === 1 ? "#10b98120" : "#f43f5e20" : "#37415120",
                          boxShadow: answered ? finalOutput === 1 ? "0 0 12px #10b981" : "0 0 12px #f43f5e" : "none"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-muted-foreground", children: "OUTPUT" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xl font-black tabular-nums",
                              style: {
                                color: answered ? finalOutput === 1 ? "#10b981" : "#f43f5e" : "#6b7280"
                              },
                              children: answered ? finalOutput : "?"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: flash && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                        className: "absolute inset-0 flex items-center justify-center bg-background/60 z-30 pointer-events-none",
                        children: flash === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "h-16 w-16 text-[#10b981]",
                            style: { filter: "drop-shadow(0 0 20px #10b981)" }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleX,
                          {
                            className: "h-16 w-16 text-[#f43f5e]",
                            style: { filter: "drop-shadow(0 0 20px #f43f5e)" }
                          }
                        )
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground text-center mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "PREDICT OUTPUT"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 justify-center", children: [0, 1].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    type: "button",
                    whileHover: !answered ? { scale: 1.06 } : {},
                    whileTap: !answered ? { scale: 0.94 } : {},
                    onClick: () => handlePredict(val),
                    disabled: answered,
                    className: "rounded-xl border-2 w-24 h-16 flex flex-col items-center justify-center font-black text-2xl transition-all",
                    style: {
                      borderColor: prediction === val ? flash === "correct" ? "#10b981" : "#f43f5e" : val === 1 ? "#10b981" : "#f43f5e",
                      backgroundColor: val === 1 ? "#10b98115" : "#f43f5e15",
                      color: val === 1 ? "#10b981" : "#f43f5e",
                      fontFamily: "'Orbitron', sans-serif"
                    },
                    "data-ocid": `machine_logic.predict.${val}`,
                    children: [
                      val,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: val === 1 ? "HIGH" : "LOW" })
                    ]
                  },
                  `pred-${val}`
                )) })
              ] })
            ]
          },
          `circuit-${circuitIdx}`
        ) })
      ]
    }
  );
}
function TruthTableMasterGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const tables = TRUTH_TABLES.slice(0, count);
  const [tableIdx, setTableIdx] = reactExports.useState(0);
  const [rowIdx, setRowIdx] = reactExports.useState(0);
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
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const table = tables[tableIdx];
  const row = table.rows[rowIdx];
  function handleAnswer(val) {
    if (answered || !gameStarted) return;
    setSelected(val);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (val === row.output) {
      setScore((s) => s + 180 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
    setTimeout(() => {
      const nextRow = rowIdx + 1;
      if (nextRow >= table.rows.length) {
        const nextTable = tableIdx + 1;
        if (nextTable >= tables.length) {
          endGame(true);
          return;
        }
        setTableIdx(nextTable);
        setRowIdx(0);
      } else setRowIdx(nextRow);
      setSelected(null);
      setAnswered(false);
    }, 1400);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "truth_table.page",
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
                  style: { color: "#7c3aed" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
                  children: "Truth Table Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Logic expressions shown with a truth table. Fill in each output row by evaluating the expression for the given input combination." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Complete all rows across multiple expressions. Master AND, OR, NOT, XOR, NAND, and compound logic." }),
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
                  "data-ocid": "truth_table.start_button",
                  children: "Fill Tables"
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
      "data-ocid": "truth_table.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#7c3aed" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#7c3aed]/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-muted-foreground mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: [
                "EXPRESSION ",
                tableIdx + 1,
                "/",
                tables.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xl font-black",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
              children: [
                "F = ",
                table.expression
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "TRUTH TABLE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              table.inputs.map((inp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-2 py-1 text-center font-bold",
                  style: {
                    color: "#7c3aed",
                    fontFamily: "'Orbitron', sans-serif"
                  },
                  children: inp
                },
                inp
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-2 py-1 text-center font-bold",
                  style: {
                    color: "#00f5ff",
                    fontFamily: "'Orbitron', sans-serif"
                  },
                  children: "F"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: table.rows.map((r, ri) => {
              const isActive = ri === rowIdx;
              const isDone = ri < rowIdx;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `border-t border-border/20 ${isActive ? "bg-[#7c3aed]/10" : ""}`,
                  children: [
                    r.inputVals.map((v, vi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-2 py-1 text-center tabular-nums font-mono",
                        style: { color: v === 1 ? "#10b981" : "#f43f5e" },
                        children: v
                      },
                      vi
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-1 text-center", children: [
                      isDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-black tabular-nums",
                          style: {
                            color: r.output === 1 ? "#10b981" : "#f43f5e"
                          },
                          children: r.output
                        }
                      ),
                      isActive && answered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-black tabular-nums",
                          style: {
                            color: selected === r.output ? "#10b981" : "#f43f5e"
                          },
                          children: r.output
                        }
                      ),
                      isActive && !answered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-black",
                          style: { color: "#7c3aed" },
                          children: "?"
                        }
                      ),
                      ri > rowIdx && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "?" })
                    ] })
                  ]
                },
                ri
              );
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-center mb-3", children: [
            "Row ",
            rowIdx + 1,
            ": Inputs = [",
            row.inputVals.join(", "),
            "]. What is F?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 justify-center", children: [0, 1].map((val) => {
            let bc = val === 1 ? "border-[#10b981]" : "border-[#f43f5e]";
            if (answered && val === selected)
              bc += selected === row.output ? " bg-[#10b981]/20" : " bg-[#f43f5e]/20";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                whileHover: !answered ? { scale: 1.06 } : {},
                whileTap: !answered ? { scale: 0.94 } : {},
                onClick: () => handleAnswer(val),
                disabled: answered,
                className: `rounded-xl border-2 w-24 h-16 flex flex-col items-center justify-center font-black text-2xl transition-all ${bc}`,
                style: {
                  color: val === 1 ? "#10b981" : "#f43f5e",
                  fontFamily: "'Orbitron', sans-serif"
                },
                "data-ocid": `truth_table.answer.${val}`,
                children: [
                  val,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: val === 1 ? "TRUE" : "FALSE" })
                ]
              },
              `v-${val}`
            );
          }) })
        ] })
      ]
    }
  );
}
function BinaryCalculatorGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 10 : 15;
  const challenges = BIN_CHALLENGES.slice(0, count);
  const [idx, setIdx] = reactExports.useState(0);
  const [userAnswer, setUserAnswer] = reactExports.useState("");
  const [hexAnswer, setHexAnswer] = reactExports.useState("");
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
  const ch = challenges[idx];
  function handleSubmit() {
    if (submitted) return;
    const binOk = userAnswer.replace(/\s/g, "") === ch.resultBin;
    const hexOk = !ch.includeHex || hexAnswer.toUpperCase().replace(/\s/g, "") === ch.hexResult;
    const ok = binOk && hexOk;
    setSubmitted(true);
    setResult(ok);
    setTotal((t) => t + 1);
    if (ok) {
      setScore((s) => s + 220 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
    setTimeout(() => {
      const n = idx + 1;
      if (n >= challenges.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setUserAnswer("");
      setHexAnswer("");
      setSubmitted(false);
      setResult(null);
    }, 2e3);
  }
  const bitColors = [
    "#f43f5e",
    "#f59e0b",
    "#10b981",
    "#00f5ff",
    "#7c3aed",
    "#e879f9",
    "#f43f5e",
    "#f59e0b"
  ];
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "binary_calculator.page",
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
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Binary Calculator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Binary addition and subtraction problems shown step by step. Enter the binary result. Advanced levels include hexadecimal conversion." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "No decimal shortcuts allowed — perform binary arithmetic directly in your head or on paper." }),
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
                  "data-ocid": "binary_calculator.start_button",
                  children: "Start Calculating"
                }
              )
            ]
          }
        )
      }
    );
  const bits = ch.aBin.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "binary_calculator.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 shrink-0 border border-[#f59e0b]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: [
                "PROBLEM ",
                idx + 1,
                "/",
                challenges.length,
                ": ",
                ch.question
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-lg flex flex-col items-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: ch.aBin.split("").map((bit, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-6 h-7 flex items-center justify-center rounded text-sm font-black",
                style: {
                  backgroundColor: `${bitColors[i % 8]}20`,
                  color: bitColors[i % 8]
                },
                children: bit
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black", style: { color: "#f59e0b" }, children: ch.op === "add" ? "+" : "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: ch.bBin.split("").map((bit, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-6 h-7 flex items-center justify-center rounded text-sm font-black",
                  style: {
                    backgroundColor: `${bitColors[i % 8]}15`,
                    color: `${bitColors[i % 8]}cc`
                  },
                  children: bit
                },
                i
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs text-muted-foreground mt-1",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: [
                  "= ",
                  ch.a,
                  " ",
                  ch.op === "add" ? "+" : "-",
                  " ",
                  ch.b,
                  " = ",
                  ch.resultDec,
                  " ",
                  "(decimal) = ? (binary)"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs text-muted-foreground mb-1",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: [
                  "BINARY RESULT (",
                  bits,
                  " bits)"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: userAnswer,
                onChange: (e) => setUserAnswer(e.target.value),
                placeholder: `Enter ${bits}-bit binary result`,
                className: `w-full rounded-lg px-3 py-2 text-sm bg-card border font-mono ${submitted ? result ? "border-[#10b981] text-[#10b981]" : "border-[#f43f5e] text-[#f43f5e]" : "border-border text-foreground"}`,
                "data-ocid": "binary_calculator.binary_input"
              }
            ),
            submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs mt-1",
                style: {
                  color: userAnswer.replace(/\s/g, "") === ch.resultBin ? "#10b981" : "#f43f5e"
                },
                children: [
                  "Correct: ",
                  ch.resultBin
                ]
              }
            )
          ] }),
          ch.includeHex && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground mb-1",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "HEX CONVERSION"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: hexAnswer,
                onChange: (e) => setHexAnswer(e.target.value),
                placeholder: "Enter hex (e.g. FF)",
                className: `w-full rounded-lg px-3 py-2 text-sm bg-card border font-mono ${submitted ? hexAnswer.toUpperCase() === ch.hexResult ? "border-[#10b981]" : "border-[#f43f5e]" : "border-border"} text-foreground`,
                "data-ocid": "binary_calculator.hex_input"
              }
            ),
            submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs mt-1",
                style: {
                  color: hexAnswer.toUpperCase() === ch.hexResult ? "#10b981" : "#f43f5e"
                },
                children: [
                  "Correct hex: ",
                  ch.hexResult,
                  " (each 4 bits = 1 hex digit)"
                ]
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
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs",
                style: { color: result ? "#10b981" : "#f43f5e" },
                children: result ? `Correct! Binary result: ${ch.resultBin} = ${ch.resultDec} decimal` : `Incorrect. ${ch.aBin} ${ch.op === "add" ? "+" : "-"} ${ch.bBin} = ${ch.resultBin} (${ch.resultDec} decimal)${ch.includeHex ? `, hex: ${ch.hexResult}` : ""}`
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
            disabled: !userAnswer || submitted,
            "data-ocid": "binary_calculator.submit_button",
            children: "Submit Answer"
          }
        )
      ]
    }
  );
}
function MachineLogic(props) {
  switch (props.config.gameId) {
    case "truth-table-master":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TruthTableMasterGame, { ...props });
    case "binary-calculator":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(BinaryCalculatorGame, { ...props });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(LogicGateNetworkGame, { ...props });
  }
}
export {
  MachineLogic as default
};
