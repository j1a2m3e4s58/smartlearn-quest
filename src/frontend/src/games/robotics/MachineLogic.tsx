import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Cpu, Heart, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ── Game 1: Logic Gate Network (existing) ──────────────────────────────────
type GateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "empty";
type BitValue = 0 | 1;
interface Gate {
  id: string;
  type: GateType;
  x: number;
  y: number;
  inputs: string[];
  output: string;
}
interface Circuit {
  title: string;
  description: string;
  inputLabels: string[];
  defaultInputs: BitValue[];
  gates: Gate[];
  targetQuestion: string;
  computeAnswer: (inputs: BitValue[]) => BitValue;
}
function evalGate(type: GateType, vals: BitValue[]): BitValue {
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
const GATE_COLORS: Record<GateType, string> = {
  AND: "#00f5ff",
  OR: "#7c3aed",
  NOT: "#f59e0b",
  XOR: "#10b981",
  NAND: "#f43f5e",
  empty: "#374151",
};
const CIRCUITS: Record<1 | 2 | 3, Circuit[]> = {
  1: [
    {
      title: "Single AND Gate",
      description:
        "Toggle inputs A and B. Trace the signal through the AND gate.",
      inputLabels: ["A", "B"],
      defaultInputs: [0, 1],
      gates: [
        {
          id: "g1",
          type: "AND",
          x: 50,
          y: 40,
          inputs: ["A", "B"],
          output: "OUT",
        },
      ],
      targetQuestion: "What is the output when A=0, B=1?",
      computeAnswer: ([a, b]) => evalGate("AND", [a, b]),
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
          output: "OUT",
        },
      ],
      targetQuestion: "What is the output when X=1, Y=0?",
      computeAnswer: ([x, y]) => evalGate("OR", [x, y]),
    },
    {
      title: "NOT Inverter",
      description: "A NOT gate inverts the signal.",
      inputLabels: ["IN"],
      defaultInputs: [1],
      gates: [
        { id: "g1", type: "NOT", x: 50, y: 40, inputs: ["IN"], output: "OUT" },
      ],
      targetQuestion: "What is the output when IN=1?",
      computeAnswer: ([a]) => evalGate("NOT", [a]),
    },
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
          output: "M",
        },
        { id: "g2", type: "NOT", x: 65, y: 40, inputs: ["M"], output: "OUT" },
      ],
      targetQuestion: "A=1, B=1. AND output M=? Final OUT=?",
      computeAnswer: ([a, b]) => evalGate("NOT", [evalGate("AND", [a, b])]),
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
          output: "OUT",
        },
      ],
      targetQuestion: "D0=0, D1=1. XOR output?",
      computeAnswer: ([a, b]) => evalGate("XOR", [a, b]),
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
          output: "M1",
        },
        {
          id: "g2",
          type: "AND",
          x: 25,
          y: 60,
          inputs: ["Q", "R"],
          output: "M2",
        },
        {
          id: "g3",
          type: "OR",
          x: 65,
          y: 42,
          inputs: ["M1", "M2"],
          output: "OUT",
        },
      ],
      targetQuestion:
        "P=1, Q=0, R=1. M1=AND(P,Q)=? M2=AND(Q,R)=? OUT=OR(M1,M2)=?",
      computeAnswer: ([p, q, r]) =>
        evalGate("OR", [evalGate("AND", [p, q]), evalGate("AND", [q, r])]),
    },
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
          output: "SUM",
        },
        {
          id: "g2",
          type: "AND",
          x: 50,
          y: 65,
          inputs: ["A", "B"],
          output: "CARRY",
        },
      ],
      targetQuestion: "A=1, B=1. SUM=XOR(A,B)=? CARRY=AND(A,B)=?",
      computeAnswer: ([a, b]) => evalGate("XOR", [a, b]),
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
          output: "OUT",
        },
      ],
      targetQuestion: "X=1, Y=0. NAND = NOT(AND(X,Y)) = ?",
      computeAnswer: ([x, y]) => evalGate("NAND", [x, y]),
    },
  ],
};

// ── Game 2: Truth Table Master ────────────────────────────────────────────────────
interface TruthTableChallenge {
  id: string;
  expression: string;
  inputs: string[];
  rows: Array<{ inputVals: BitValue[]; output: BitValue }>;
  compute: (...args: BitValue[]) => BitValue;
}
const TRUTH_TABLES: TruthTableChallenge[] = [
  {
    id: "tt1",
    expression: "A AND B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 0 },
      { inputVals: [0, 1], output: 0 },
      { inputVals: [1, 0], output: 0 },
      { inputVals: [1, 1], output: 1 },
    ],
    compute: (a, b) => evalGate("AND", [a, b]),
  },
  {
    id: "tt2",
    expression: "A OR B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 0 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 1 },
    ],
    compute: (a, b) => evalGate("OR", [a, b]),
  },
  {
    id: "tt3",
    expression: "NOT A",
    inputs: ["A"],
    rows: [
      { inputVals: [0], output: 1 },
      { inputVals: [1], output: 0 },
    ],
    compute: (a) => evalGate("NOT", [a]),
  },
  {
    id: "tt4",
    expression: "A XOR B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 0 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 0 },
    ],
    compute: (a, b) => evalGate("XOR", [a, b]),
  },
  {
    id: "tt5",
    expression: "A NAND B",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 1 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 0 },
    ],
    compute: (a, b) => evalGate("NAND", [a, b]),
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
      { inputVals: [1, 1, 1], output: 1 },
    ],
    compute: (a, b, c) => evalGate("AND", [a, evalGate("OR", [b, c])]),
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
      { inputVals: [1, 1, 1], output: 1 },
    ],
    compute: (a, b, c) => evalGate("AND", [evalGate("OR", [a, b]), c]),
  },
  {
    id: "tt8",
    expression: "NOT (A AND B)",
    inputs: ["A", "B"],
    rows: [
      { inputVals: [0, 0], output: 1 },
      { inputVals: [0, 1], output: 1 },
      { inputVals: [1, 0], output: 1 },
      { inputVals: [1, 1], output: 0 },
    ],
    compute: (a, b) => evalGate("NOT", [evalGate("AND", [a, b])]),
  },
];

// ── Game 3: Binary Calculator ────────────────────────────────────────────────────
type BinOp = "add" | "subtract";
interface BinCalcChallenge {
  id: string;
  op: BinOp;
  a: number;
  b: number;
  aBin: string;
  bBin: string;
  resultBin: string;
  resultDec: number;
  question: string;
  includeHex?: boolean;
  hexResult?: string;
}
function toBin(n: number, bits = 8): string {
  return (n >>> 0).toString(2).padStart(bits, "0").slice(-bits);
}
const BIN_CHALLENGES: BinCalcChallenge[] = [
  {
    id: "b1",
    op: "add",
    a: 5,
    b: 3,
    aBin: "0101",
    bBin: "0011",
    resultBin: "1000",
    resultDec: 8,
    question: "0101 + 0011 = ? (4-bit)",
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
    question: "1001 + 0110 = ? (4-bit)",
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
    question: "1000 - 0011 = ? (4-bit)",
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
    question: "01101 + 00111 = ? (5-bit)",
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
    question: "01111 - 00110 = ? (5-bit)",
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
    question: "011001 + 001110 = ? (6-bit)",
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
    question: "00111111 + 01000000 = ? (8-bit)",
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
    question: "01100100 - 00100101 = ? (8-bit)",
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
    hexResult: "FF",
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
    hexResult: "FF",
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
    hexResult: "E1",
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
    hexResult: "FF",
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
    hexResult: "64",
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
    hexResult: "30",
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
    hexResult: "7F",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ── GAME 1 COMPONENT
function LogicGateNetworkGame({ config, onGameEnd }: Props) {
  const circuits = CIRCUITS[config.difficulty];
  const [circuitIdx, setCircuitIdx] = useState(0);
  const circuit = circuits[circuitIdx];
  const [inputs, setInputs] = useState<BitValue[]>([...circuit.defaultInputs]);
  const [prediction, setPrediction] = useState<BitValue | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          total > 0 ? (correct / total) * 100 : 0,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function toggleInput(i: number) {
    if (!gameStarted || answered) return;
    setInputs((prev) =>
      prev.map((v, idx) => (idx === i ? ((v === 0 ? 1 : 0) as BitValue) : v)),
    );
  }

  function handlePredict(val: BitValue) {
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
        if (nl <= 0) setTimeout(() => endGame(false), 1000);
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

  function computeIntermediates(): Record<string, BitValue> {
    const vals: Record<string, BitValue> = {};
    circuit.inputLabels.forEach((label, i) => {
      vals[label] = inputs[i];
    });
    for (const gate of circuit.gates) {
      const iv = gate.inputs.map((inp) => vals[inp] ?? 0) as BitValue[];
      vals[gate.output] = evalGate(gate.type, iv);
    }
    return vals;
  }
  const intermediates = computeIntermediates();
  const finalOutput = intermediates.OUT ?? intermediates.SUM ?? 0;

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="machine_logic.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Cpu
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#00f5ff" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" }}
          >
            Logic Gate Network
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Toggle input switches to trace signals through digital logic gates.
            Predict the final output.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="machine_logic.start_button"
          >
            Activate Circuit
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="machine_logic.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#00f5ff" }}>
          <Cpu className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {timeLeft}s
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`circuit-${circuitIdx}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex-1 flex flex-col gap-3"
        >
          <div className="glass-card rounded-xl p-3 shrink-0">
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {circuit.title}
            </p>
            <p className="text-sm font-bold text-foreground mt-1">
              {circuit.targetQuestion}
            </p>
          </div>
          <div
            className={`relative flex-1 rounded-xl border-2 overflow-hidden glass transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.4)]" : "border-border/30"}`}
            data-ocid="machine_logic.circuit_board"
          >
            <div className="scanlines absolute inset-0 pointer-events-none z-10" />
            {circuit.inputLabels.map((label, i) => {
              const y =
                circuit.inputLabels.length === 1
                  ? 50
                  : 20 + (i / (circuit.inputLabels.length - 1)) * 60;
              const val = inputs[i];
              return (
                <motion.button
                  type="button"
                  key={`inp-${i}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleInput(i)}
                  className="absolute flex flex-col items-center justify-center rounded-lg border-2 w-14 h-10 z-20 cursor-pointer transition-all"
                  style={{
                    left: "3%",
                    top: `${y}%`,
                    transform: "translateY(-50%)",
                    borderColor: val === 1 ? "#10b981" : "#f43f5e",
                    backgroundColor: val === 1 ? "#10b98120" : "#f43f5e20",
                    boxShadow:
                      val === 1 ? "0 0 10px #10b981" : "0 0 10px #f43f5e",
                  }}
                  data-ocid={`machine_logic.input.${label}`}
                >
                  <span
                    className="text-xs font-black tabular-nums"
                    style={{
                      color: val === 1 ? "#10b981" : "#f43f5e",
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {val}
                  </span>
                  <span className="text-[8px] text-muted-foreground">
                    {label}
                  </span>
                </motion.button>
              );
            })}
            {circuit.gates.map((gate) => {
              const outVal = intermediates[gate.output];
              const color = GATE_COLORS[gate.type];
              return (
                <div
                  key={gate.id}
                  className="absolute flex flex-col items-center justify-center rounded-xl border-2 w-20 h-14 z-20"
                  style={{
                    left: `${gate.x}%`,
                    top: `${gate.y}%`,
                    transform: "translate(-50%, -50%)",
                    borderColor: `${color}80`,
                    backgroundColor: `${color}15`,
                    boxShadow: `0 0 10px ${color}40`,
                  }}
                  data-ocid={`machine_logic.gate.${gate.id}`}
                >
                  <span
                    className="text-xs font-black"
                    style={{ color, fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {gate.type}
                  </span>
                  {answered && (
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color: outVal === 1 ? "#10b981" : "#f43f5e" }}
                    >
                      {gate.output}={outVal}
                    </span>
                  )}
                </div>
              );
            })}
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-xl border-2 w-16 h-14 z-20"
              style={{
                borderColor: answered
                  ? finalOutput === 1
                    ? "#10b981"
                    : "#f43f5e"
                  : "#374151",
                backgroundColor: answered
                  ? finalOutput === 1
                    ? "#10b98120"
                    : "#f43f5e20"
                  : "#37415120",
                boxShadow: answered
                  ? finalOutput === 1
                    ? "0 0 12px #10b981"
                    : "0 0 12px #f43f5e"
                  : "none",
              }}
            >
              <span className="text-[8px] text-muted-foreground">OUTPUT</span>
              <span
                className="text-xl font-black tabular-nums"
                style={{
                  color: answered
                    ? finalOutput === 1
                      ? "#10b981"
                      : "#f43f5e"
                    : "#6b7280",
                }}
              >
                {answered ? finalOutput : "?"}
              </span>
            </div>
            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/60 z-30 pointer-events-none"
                >
                  {flash === "correct" ? (
                    <CheckCircle
                      className="h-16 w-16 text-[#10b981]"
                      style={{ filter: "drop-shadow(0 0 20px #10b981)" }}
                    />
                  ) : (
                    <XCircle
                      className="h-16 w-16 text-[#f43f5e]"
                      style={{ filter: "drop-shadow(0 0 20px #f43f5e)" }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="shrink-0">
            <p
              className="text-xs text-muted-foreground text-center mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              PREDICT OUTPUT
            </p>
            <div className="flex gap-4 justify-center">
              {([0, 1] as BitValue[]).map((val) => (
                <motion.button
                  type="button"
                  key={`pred-${val}`}
                  whileHover={!answered ? { scale: 1.06 } : {}}
                  whileTap={!answered ? { scale: 0.94 } : {}}
                  onClick={() => handlePredict(val)}
                  disabled={answered}
                  className="rounded-xl border-2 w-24 h-16 flex flex-col items-center justify-center font-black text-2xl transition-all"
                  style={{
                    borderColor:
                      prediction === val
                        ? flash === "correct"
                          ? "#10b981"
                          : "#f43f5e"
                        : val === 1
                          ? "#10b981"
                          : "#f43f5e",
                    backgroundColor: val === 1 ? "#10b98115" : "#f43f5e15",
                    color: val === 1 ? "#10b981" : "#f43f5e",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                  data-ocid={`machine_logic.predict.${val}`}
                >
                  {val}
                  <span className="text-xs font-normal">
                    {val === 1 ? "HIGH" : "LOW"}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── GAME 2 COMPONENT
function TruthTableMasterGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const tables = TRUTH_TABLES.slice(0, count);
  const [tableIdx, setTableIdx] = useState(0);
  const [rowIdx, setRowIdx] = useState(0);
  const [selected, setSelected] = useState<BitValue | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          total > 0 ? (correct / total) * 100 : 0,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );
  const table = tables[tableIdx];
  const row = table.rows[rowIdx];

  function handleAnswer(val: BitValue) {
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
        if (nl <= 0) setTimeout(() => endGame(false), 1000);
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
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="truth_table.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Cpu
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#7c3aed" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
          >
            Truth Table Master
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Logic expressions shown with a truth table. Fill in each output row
            by evaluating the expression for the given input combination.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Complete all rows across multiple expressions. Master AND, OR, NOT,
            XOR, NAND, and compound logic.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="truth_table.start_button"
          >
            Fill Tables
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="truth_table.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#7c3aed" }}>
          <Cpu className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all"
              style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-3 shrink-0 border border-[#7c3aed]/40">
        <p
          className="text-xs text-muted-foreground mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          EXPRESSION {tableIdx + 1}/{tables.length}
        </p>
        <p
          className="text-xl font-black"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
        >
          F = {table.expression}
        </p>
      </div>

      {/* Completed rows */}
      <div className="glass-card rounded-xl p-3 flex-1">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          TRUTH TABLE
        </p>
        <div className="overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {table.inputs.map((inp) => (
                  <th
                    key={inp}
                    className="px-2 py-1 text-center font-bold"
                    style={{
                      color: "#7c3aed",
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {inp}
                  </th>
                ))}
                <th
                  className="px-2 py-1 text-center font-bold"
                  style={{
                    color: "#00f5ff",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  F
                </th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, ri) => {
                const isActive = ri === rowIdx;
                const isDone = ri < rowIdx;
                return (
                  <tr
                    key={ri}
                    className={`border-t border-border/20 ${isActive ? "bg-[#7c3aed]/10" : ""}`}
                  >
                    {r.inputVals.map((v, vi) => (
                      <td
                        key={vi}
                        className="px-2 py-1 text-center tabular-nums font-mono"
                        style={{ color: v === 1 ? "#10b981" : "#f43f5e" }}
                      >
                        {v}
                      </td>
                    ))}
                    <td className="px-2 py-1 text-center">
                      {isDone && (
                        <span
                          className="font-black tabular-nums"
                          style={{
                            color: r.output === 1 ? "#10b981" : "#f43f5e",
                          }}
                        >
                          {r.output}
                        </span>
                      )}
                      {isActive && answered && (
                        <span
                          className="font-black tabular-nums"
                          style={{
                            color:
                              selected === r.output ? "#10b981" : "#f43f5e",
                          }}
                        >
                          {r.output}
                        </span>
                      )}
                      {isActive && !answered && (
                        <span
                          className="font-black"
                          style={{ color: "#7c3aed" }}
                        >
                          ?
                        </span>
                      )}
                      {ri > rowIdx && (
                        <span className="text-muted-foreground">?</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shrink-0">
        <p className="text-sm font-bold text-center mb-3">
          Row {rowIdx + 1}: Inputs = [{row.inputVals.join(", ")}]. What is F?
        </p>
        <div className="flex gap-4 justify-center">
          {([0, 1] as BitValue[]).map((val) => {
            let bc = val === 1 ? "border-[#10b981]" : "border-[#f43f5e]";
            if (answered && val === selected)
              bc +=
                selected === row.output
                  ? " bg-[#10b981]/20"
                  : " bg-[#f43f5e]/20";
            return (
              <motion.button
                type="button"
                key={`v-${val}`}
                whileHover={!answered ? { scale: 1.06 } : {}}
                whileTap={!answered ? { scale: 0.94 } : {}}
                onClick={() => handleAnswer(val)}
                disabled={answered}
                className={`rounded-xl border-2 w-24 h-16 flex flex-col items-center justify-center font-black text-2xl transition-all ${bc}`}
                style={{
                  color: val === 1 ? "#10b981" : "#f43f5e",
                  fontFamily: "'Orbitron', sans-serif",
                }}
                data-ocid={`truth_table.answer.${val}`}
              >
                {val}
                <span className="text-xs font-normal">
                  {val === 1 ? "TRUE" : "FALSE"}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── GAME 3 COMPONENT
function BinaryCalculatorGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 10 : 15;
  const challenges = BIN_CHALLENGES.slice(0, count);
  const [idx, setIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [hexAnswer, setHexAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          total > 0 ? (correct / total) * 100 : 0,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );
  const ch = challenges[idx];

  function handleSubmit() {
    if (submitted) return;
    const binOk = userAnswer.replace(/\s/g, "") === ch.resultBin;
    const hexOk =
      !ch.includeHex ||
      hexAnswer.toUpperCase().replace(/\s/g, "") === ch.hexResult;
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
        if (nl <= 0) setTimeout(() => endGame(false), 1000);
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
    }, 2000);
  }

  const bitColors = [
    "#f43f5e",
    "#f59e0b",
    "#10b981",
    "#00f5ff",
    "#7c3aed",
    "#e879f9",
    "#f43f5e",
    "#f59e0b",
  ];

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="binary_calculator.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Cpu
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f59e0b" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
          >
            Binary Calculator
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Binary addition and subtraction problems shown step by step. Enter
            the binary result. Advanced levels include hexadecimal conversion.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            No decimal shortcuts allowed — perform binary arithmetic directly in
            your head or on paper.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="binary_calculator.start_button"
          >
            Start Calculating
          </GlowButton>
        </motion.div>
      </div>
    );

  const bits = ch.aBin.length;
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="binary_calculator.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Cpu className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all"
              style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 shrink-0 border border-[#f59e0b]/30">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          PROBLEM {idx + 1}/{challenges.length}: {ch.question}
        </p>
        {/* Binary arithmetic display */}
        <div className="font-mono text-lg flex flex-col items-end gap-1">
          <div className="flex gap-0.5">
            {ch.aBin.split("").map((bit, i) => (
              <span
                key={i}
                className="w-6 h-7 flex items-center justify-center rounded text-sm font-black"
                style={{
                  backgroundColor: `${bitColors[i % 8]}20`,
                  color: bitColors[i % 8],
                }}
              >
                {bit}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 w-full">
            <span className="text-lg font-black" style={{ color: "#f59e0b" }}>
              {ch.op === "add" ? "+" : "-"}
            </span>
            <div className="flex gap-0.5">
              {ch.bBin.split("").map((bit, i) => (
                <span
                  key={i}
                  className="w-6 h-7 flex items-center justify-center rounded text-sm font-black"
                  style={{
                    backgroundColor: `${bitColors[i % 8]}15`,
                    color: `${bitColors[i % 8]}cc`,
                  }}
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-border/60 w-full" />
          <p
            className="text-xs text-muted-foreground mt-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            = {ch.a} {ch.op === "add" ? "+" : "-"} {ch.b} = {ch.resultDec}{" "}
            (decimal) = ? (binary)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 shrink-0">
        <div>
          <p
            className="text-xs text-muted-foreground mb-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            BINARY RESULT ({bits} bits)
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={`Enter ${bits}-bit binary result`}
            className={`w-full rounded-lg px-3 py-2 text-sm bg-card border font-mono ${submitted ? (result ? "border-[#10b981] text-[#10b981]" : "border-[#f43f5e] text-[#f43f5e]") : "border-border text-foreground"}`}
            data-ocid="binary_calculator.binary_input"
          />
          {submitted && (
            <p
              className="text-xs mt-1"
              style={{
                color:
                  userAnswer.replace(/\s/g, "") === ch.resultBin
                    ? "#10b981"
                    : "#f43f5e",
              }}
            >
              Correct: {ch.resultBin}
            </p>
          )}
        </div>
        {ch.includeHex && (
          <div>
            <p
              className="text-xs text-muted-foreground mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              HEX CONVERSION
            </p>
            <input
              type="text"
              value={hexAnswer}
              onChange={(e) => setHexAnswer(e.target.value)}
              placeholder="Enter hex (e.g. FF)"
              className={`w-full rounded-lg px-3 py-2 text-sm bg-card border font-mono ${submitted ? (hexAnswer.toUpperCase() === ch.hexResult ? "border-[#10b981]" : "border-[#f43f5e]") : "border-border"} text-foreground`}
              data-ocid="binary_calculator.hex_input"
            />
            {submitted && (
              <p
                className="text-xs mt-1"
                style={{
                  color:
                    hexAnswer.toUpperCase() === ch.hexResult
                      ? "#10b981"
                      : "#f43f5e",
                }}
              >
                Correct hex: {ch.hexResult} (each 4 bits = 1 hex digit)
              </p>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {submitted && result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-3 border shrink-0 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`}
          >
            <p
              className="text-xs"
              style={{ color: result ? "#10b981" : "#f43f5e" }}
            >
              {result
                ? `Correct! Binary result: ${ch.resultBin} = ${ch.resultDec} decimal`
                : `Incorrect. ${ch.aBin} ${ch.op === "add" ? "+" : "-"} ${ch.bBin} = ${ch.resultBin} (${ch.resultDec} decimal)${ch.includeHex ? `, hex: ${ch.hexResult}` : ""}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <GlowButton
        variant="primary"
        size="sm"
        onClick={handleSubmit}
        disabled={!userAnswer || submitted}
        data-ocid="binary_calculator.submit_button"
      >
        Submit Answer
      </GlowButton>
    </div>
  );
}

// ── MAIN EXPORT
export default function MachineLogic(props: Props) {
  switch (props.config.gameId) {
    case "truth-table-master":
      return <TruthTableMasterGame {...props} />;
    case "binary-calculator":
      return <BinaryCalculatorGame {...props} />;
    default:
      return <LogicGateNetworkGame {...props} />;
  }
}
