import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

// ─────────────────────────────────────────────
// GAME 1 — Algorithm Debugger
// ─────────────────────────────────────────────
type NodeType = "start" | "process" | "decision" | "output";
interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  outTrue?: string;
  outFalse?: string;
  out?: string;
}
interface BugChallenge {
  title: string;
  description: string;
  nodes: FlowNode[];
  bugNodeId: string;
  explanation: string;
  testInput: string;
  expectedOutput: string;
  actualOutput: string;
}

const CHALLENGES: Record<1 | 2 | 3, BugChallenge[]> = {
  1: [
    {
      title: "Add Two Numbers",
      description: "Adds A and B. Input: A=3, B=5. Expected: 8. Got: 5.",
      testInput: "A=3, B=5",
      expectedOutput: "8",
      actualOutput: "5",
      nodes: [
        {
          id: "start",
          type: "start",
          label: "START",
          x: 150,
          y: 20,
          out: "read",
        },
        {
          id: "read",
          type: "process",
          label: "Read A, B",
          x: 150,
          y: 90,
          out: "calc",
        },
        {
          id: "calc",
          type: "process",
          label: "Result = B",
          x: 150,
          y: 160,
          out: "print",
        },
        {
          id: "print",
          type: "output",
          label: "Print Result",
          x: 150,
          y: 230,
          out: "end",
        },
        { id: "end", type: "start", label: "END", x: 150, y: 300 },
      ],
      bugNodeId: "calc",
      explanation: "'Result = B' should be 'Result = A + B'.",
    },
    {
      title: "Find Maximum",
      description:
        "Finds larger of X and Y. Input: X=7, Y=4. Expected: Max=7. Got: Max=4.",
      testInput: "X=7, Y=4",
      expectedOutput: "Max=7",
      actualOutput: "Max=4",
      nodes: [
        {
          id: "start",
          type: "start",
          label: "START",
          x: 150,
          y: 20,
          out: "read",
        },
        {
          id: "read",
          type: "process",
          label: "Read X, Y",
          x: 150,
          y: 90,
          out: "decide",
        },
        {
          id: "decide",
          type: "decision",
          label: "X < Y?",
          x: 150,
          y: 160,
          outTrue: "max_x",
          outFalse: "max_y",
        },
        {
          id: "max_x",
          type: "output",
          label: "Max = X",
          x: 60,
          y: 250,
          out: "end",
        },
        {
          id: "max_y",
          type: "output",
          label: "Max = Y",
          x: 240,
          y: 250,
          out: "end",
        },
        { id: "end", type: "start", label: "END", x: 150, y: 330 },
      ],
      bugNodeId: "decide",
      explanation:
        "Condition 'X < Y?' takes X=Max branch when true. Should be 'X > Y?'.",
    },
  ],
  2: [
    {
      title: "Count to N",
      description: "Counts from 1 to N=5. Expected: 1,2,3,4,5. Got: 1,2,3,4.",
      testInput: "N=5",
      expectedOutput: "1, 2, 3, 4, 5",
      actualOutput: "1, 2, 3, 4",
      nodes: [
        {
          id: "start",
          type: "start",
          label: "START",
          x: 150,
          y: 20,
          out: "init",
        },
        {
          id: "init",
          type: "process",
          label: "i = 1",
          x: 150,
          y: 90,
          out: "check",
        },
        {
          id: "check",
          type: "decision",
          label: "i < N?",
          x: 150,
          y: 160,
          outTrue: "print",
          outFalse: "end",
        },
        {
          id: "print",
          type: "output",
          label: "Print i",
          x: 150,
          y: 240,
          out: "inc",
        },
        {
          id: "inc",
          type: "process",
          label: "i = i + 1",
          x: 150,
          y: 310,
          out: "check",
        },
        { id: "end", type: "start", label: "END", x: 270, y: 160 },
      ],
      bugNodeId: "check",
      explanation: "'i < N' stops at i=5. Should be 'i <= N'.",
    },
  ],
  3: [
    {
      title: "Factorial Calculator",
      description: "Calculates factorial N=4. Expected: 24. Got: 0.",
      testInput: "N=4",
      expectedOutput: "24",
      actualOutput: "0",
      nodes: [
        {
          id: "start",
          type: "start",
          label: "START",
          x: 150,
          y: 20,
          out: "init",
        },
        {
          id: "init",
          type: "process",
          label: "result=0, i=1",
          x: 150,
          y: 90,
          out: "check",
        },
        {
          id: "check",
          type: "decision",
          label: "i <= N?",
          x: 150,
          y: 160,
          outTrue: "mul",
          outFalse: "print",
        },
        {
          id: "mul",
          type: "process",
          label: "result = result * i",
          x: 150,
          y: 240,
          out: "inc",
        },
        {
          id: "inc",
          type: "process",
          label: "i = i + 1",
          x: 150,
          y: 310,
          out: "check",
        },
        {
          id: "print",
          type: "output",
          label: "Print result",
          x: 270,
          y: 160,
          out: "end",
        },
        { id: "end", type: "start", label: "END", x: 270, y: 240 },
      ],
      bugNodeId: "init",
      explanation:
        "result initialized to 0. Multiplying by 0 = 0 always. Should be result = 1.",
    },
  ],
};

const NODE_COLORS: Record<NodeType, string> = {
  start: "#6366f1",
  process: "#00f5ff",
  decision: "#f59e0b",
  output: "#10b981",
};

function AlgorithmDebugger({ config, onGameEnd }: Props) {
  const challenges = CHALLENGES[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const phaseRef = useRef(phase);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  livesRef.current = lives;
  phaseRef.current = phase;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function handleNodeClick(nodeId: string) {
    if (revealed) return;
    const ch = challenges[idx % challenges.length];
    setSelected(nodeId);
    setRevealed(true);
    setTotal((t) => t + 1);
    if (nodeId === ch.bugNodeId) {
      const pts = 400 * config.difficulty + timeLeft * 3;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1800);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      if (idx + 1 >= challenges.length) {
        endGame(true);
        return;
      }
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }, 1800);
  }

  const challenge = challenges[idx % challenges.length];
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="coding_logic.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#6366f1] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#6366f1]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Algorithm Debugger
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Study the flowchart. Trace execution with the given inputs. Click
            the node containing the bug.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#6366f1" }}
            data-ocid="coding_logic.start_button"
          >
            Start Debugging
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6366f1] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {idx + 1}/{challenges.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3"
            >
              <div className="rounded-xl border border-border/30 bg-card/40 p-3">
                <p className="font-bold text-[#6366f1] mb-1">
                  {challenge.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-muted-foreground">
                    Input:{" "}
                    <span className="text-foreground">
                      {challenge.testInput}
                    </span>
                  </span>
                  <span className="text-[#10b981]">
                    Expected: {challenge.expectedOutput}
                  </span>
                  <span className="text-[#f43f5e]">
                    Got: {challenge.actualOutput}
                  </span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Click the node containing the bug
              </p>
              <div
                className="relative bg-card/30 rounded-xl border border-border/20 overflow-auto"
                style={{ minHeight: 380 }}
              >
                <svg
                  width="100%"
                  height="380"
                  viewBox="0 0 400 380"
                  role="img"
                  aria-label="Algorithm flowchart"
                >
                  {challenge.nodes.map((node) => {
                    const edges: React.JSX.Element[] = [];
                    if (node.out) {
                      const target = challenge.nodes.find(
                        (n) => n.id === node.out,
                      );
                      if (target)
                        edges.push(
                          <line
                            key={`edge-${node.id}-${node.out}`}
                            x1={node.x}
                            y1={node.y + 25}
                            x2={target.x}
                            y2={target.y - 5}
                            stroke="#ffffff30"
                            strokeWidth="1.5"
                            markerEnd="url(#arrow)"
                          />,
                        );
                    }
                    if (node.outTrue) {
                      const target = challenge.nodes.find(
                        (n) => n.id === node.outTrue,
                      );
                      if (target)
                        edges.push(
                          <line
                            key={`edge-${node.id}-true`}
                            x1={node.x - 20}
                            y1={node.y + 20}
                            x2={target.x + 30}
                            y2={target.y}
                            stroke="#10b98150"
                            strokeWidth="1.5"
                          />,
                        );
                    }
                    if (node.outFalse) {
                      const target = challenge.nodes.find(
                        (n) => n.id === node.outFalse,
                      );
                      if (target)
                        edges.push(
                          <line
                            key={`edge-${node.id}-false`}
                            x1={node.x + 20}
                            y1={node.y + 20}
                            x2={target.x - 30}
                            y2={target.y}
                            stroke="#f43f5e50"
                            strokeWidth="1.5"
                          />,
                        );
                    }
                    return edges;
                  })}
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="6"
                      markerHeight="6"
                      refX="3"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L6,3 L0,6 Z" fill="#ffffff30" />
                    </marker>
                  </defs>
                  {challenge.nodes.map((node) => {
                    const isBug = revealed && node.id === challenge.bugNodeId;
                    const isSel = node.id === selected;
                    const color = NODE_COLORS[node.type];
                    const isWrongSel = revealed && isSel && !isBug;
                    return (
                      <g
                        key={`node-${node.id}`}
                        transform={`translate(${node.x - 50}, ${node.y - 18})`}
                        onClick={() => handleNodeClick(node.id)}
                        onKeyDown={(e: React.KeyboardEvent<SVGGElement>) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleNodeClick(node.id);
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Flowchart node: ${node.label}`}
                        style={{ cursor: revealed ? "default" : "pointer" }}
                      >
                        {node.type === "decision" ? (
                          <polygon
                            points="50,-15 100,15 50,45 0,15"
                            fill={
                              isBug
                                ? "#f43f5e30"
                                : isWrongSel
                                  ? "#f43f5e20"
                                  : `${color}15`
                            }
                            stroke={isBug || isWrongSel ? "#f43f5e" : color}
                            strokeWidth="2"
                          />
                        ) : node.type === "start" ? (
                          <rect
                            rx="20"
                            ry="20"
                            width="100"
                            height="30"
                            fill={`${color}15`}
                            stroke={color}
                            strokeWidth="2"
                          />
                        ) : (
                          <rect
                            rx="4"
                            ry="4"
                            width="100"
                            height="30"
                            fill={
                              isBug
                                ? "#f43f5e30"
                                : isWrongSel
                                  ? "#f43f5e20"
                                  : `${color}15`
                            }
                            stroke={isBug || isWrongSel ? "#f43f5e" : color}
                            strokeWidth="2"
                          />
                        )}
                        <text
                          x="50"
                          y={node.type === "decision" ? 18 : 19}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {node.label}
                        </text>
                        {isBug && (
                          <text
                            x="50"
                            y={-8}
                            textAnchor="middle"
                            fill="#f43f5e"
                            fontSize="8"
                          >
                            BUG
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-lg border p-3 text-sm ${
                    selected === challenge.bugNodeId
                      ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                      : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
                  }`}
                >
                  {selected === challenge.bugNodeId
                    ? "Bug found! "
                    : "Wrong node. "}
                  {challenge.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 2 — Flowchart Builder
// ─────────────────────────────────────────────
type FBSymbol = "oval" | "rectangle" | "diamond" | "parallelogram";
const FB_SYMBOLS: {
  type: FBSymbol;
  label: string;
  desc: string;
  color: string;
}[] = [
  { type: "oval", label: "Oval", desc: "Start/End", color: "#6366f1" },
  { type: "rectangle", label: "Rectangle", desc: "Process", color: "#00f5ff" },
  { type: "diamond", label: "Diamond", desc: "Decision", color: "#f59e0b" },
  {
    type: "parallelogram",
    label: "Parallelogram",
    desc: "Input/Output",
    color: "#10b981",
  },
];

interface FlowProcess {
  title: string;
  description: string;
  steps: string[];
  correctSequence: FBSymbol[];
  explanation: string;
}

const FLOW_PROCESSES: FlowProcess[] = [
  {
    title: "Boil Water",
    description: "Draw a flowchart to boil water on a stove.",
    steps: [
      "Start",
      "Fill pot with water",
      "Is the water boiling?",
      "Remove from heat",
      "End",
    ],
    correctSequence: ["oval", "rectangle", "diamond", "rectangle", "oval"],
    explanation:
      "Start(oval) → Fill(rectangle) → Is boiling?(diamond) → Remove(rectangle) → End(oval)",
  },
  {
    title: "Login System",
    description: "Flowchart for a computer login system.",
    steps: [
      "Start",
      "Enter username and password",
      "Is password correct?",
      "Show error",
      "Grant access",
      "End",
    ],
    correctSequence: [
      "oval",
      "parallelogram",
      "diamond",
      "rectangle",
      "rectangle",
      "oval",
    ],
    explanation:
      "Start → Input credentials(parallelogram) → Correct?(diamond) → Error(rect) or Access(rect) → End",
  },
  {
    title: "Sort a List",
    description: "Bubble sort: compare adjacent elements.",
    steps: [
      "Start",
      "Is list sorted?",
      "Swap adjacent if out of order",
      "Print sorted list",
      "End",
    ],
    correctSequence: ["oval", "diamond", "rectangle", "parallelogram", "oval"],
    explanation:
      "Start → Sorted?(diamond) → Swap(rectangle) → Output(parallelogram) → End",
  },
  {
    title: "ATM Withdrawal",
    description: "Withdraw cash from an ATM.",
    steps: [
      "Start",
      "Insert card and enter PIN",
      "Is PIN correct?",
      "Display error",
      "Enter amount",
      "Dispense cash",
      "End",
    ],
    correctSequence: [
      "oval",
      "parallelogram",
      "diamond",
      "rectangle",
      "parallelogram",
      "rectangle",
      "oval",
    ],
    explanation:
      "Start → Input(para) → PIN check(diamond) → Error/Amount(rect/para) → Dispense(rect) → End",
  },
];

function FlowchartBuilder({ config, onGameEnd }: Props) {
  const processCount =
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 4;
  const processes = FLOW_PROCESSES.slice(0, processCount);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [pIdx, setPIdx] = useState(0);
  const [built, setBuilt] = useState<FBSymbol[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{
    msg: string;
    good: boolean;
  } | null>(null);
  const [correct, setCorrect] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const correctRef = useRef(correct);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        processes.length > 0
          ? (correctRef.current / processes.length) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, processes.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  const proc = processes[pIdx];

  function addSymbol(sym: FBSymbol) {
    if (built.length >= proc.correctSequence.length) return;
    setBuilt((prev) => [...prev, sym]);
  }
  function removeLastSymbol() {
    setBuilt((prev) => prev.slice(0, -1));
  }

  function checkAnswer() {
    const correct_ans =
      built.length === proc.correctSequence.length &&
      built.every((s, i) => s === proc.correctSequence[i]);
    if (correct_ans) {
      const pts = 400 * config.difficulty + timeLeft * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedback({ msg: `Correct! ${proc.explanation}`, good: true });
      setTimeout(() => {
        setFeedback(null);
        if (pIdx + 1 >= processes.length) {
          endGame(true);
          return;
        }
        setPIdx((i) => i + 1);
        setBuilt([]);
      }, 2500);
    } else {
      setFeedback({
        msg: `Not quite. Check your sequence. ${proc.explanation}`,
        good: false,
      });
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  const SHAPE_COLORS: Record<FBSymbol, string> = {
    oval: "#6366f1",
    rectangle: "#00f5ff",
    diamond: "#f59e0b",
    parallelogram: "#10b981",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="flowchart_builder.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#6366f1] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#6366f1]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Flowchart Builder
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read the process. Click flowchart symbols in the correct order: Oval
            (Start/End), Rectangle (Process), Diamond (Decision), Parallelogram
            (Input/Output).
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {FB_SYMBOLS.map((s) => (
              <div
                key={s.type}
                className="rounded-lg border border-border/30 p-2 bg-card/40 flex gap-2 items-center"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="font-bold" style={{ color: s.color }}>
                  {s.label}
                </span>
                <span className="text-muted-foreground">= {s.desc}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#6366f1" }}
            data-ocid="flowchart_builder.start_button"
          >
            Build Flowcharts
          </button>
        </motion.div>
      )}
      {phase === "playing" && proc && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6366f1] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {pIdx + 1}/{processes.length} processes
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-xl border border-[#6366f1]/30 bg-card/40 p-3">
            <p className="font-bold text-[#6366f1] mb-1">{proc.title}</p>
            <p className="text-sm text-muted-foreground mb-2">
              {proc.description}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Steps: {proc.steps.join(" → ")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Build the sequence ({built.length}/{proc.correctSequence.length}{" "}
            placed):
          </p>
          <div className="flex gap-2 flex-wrap min-h-10 p-2 rounded-xl border border-border/20 bg-card/20">
            {built.map((sym, i) => (
              <div
                key={`built-${i}`}
                className="px-3 py-1 rounded-lg text-xs font-bold border-2"
                style={{
                  borderColor: SHAPE_COLORS[sym],
                  color: SHAPE_COLORS[sym],
                  background: `${SHAPE_COLORS[sym]}15`,
                }}
              >
                {sym}
              </div>
            ))}
            {built.length === 0 && (
              <span className="text-xs text-muted-foreground">
                Click symbols below to build...
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FB_SYMBOLS.map((sym) => (
              <button
                key={sym.type}
                type="button"
                onClick={() => addSymbol(sym.type)}
                className="px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-90"
                style={{
                  borderColor: sym.color,
                  background: `${sym.color}15`,
                  color: sym.color,
                }}
                data-ocid={`flowchart_builder.symbol.${sym.type}`}
              >
                {sym.label}{" "}
                <span className="text-xs opacity-70">({sym.desc})</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={removeLastSymbol}
              disabled={built.length === 0}
              className="px-4 py-2 rounded-lg border border-border/40 text-xs hover:border-[#f43f5e] transition-colors disabled:opacity-40"
              data-ocid="flowchart_builder.undo_button"
            >
              Undo Last
            </button>
            <button
              type="button"
              onClick={checkAnswer}
              disabled={built.length !== proc.correctSequence.length}
              className="flex-1 py-2 rounded-lg font-bold text-sm text-white disabled:opacity-40"
              style={{ background: "#6366f1" }}
              data-ocid="flowchart_builder.check_button"
            >
              Check Answer
            </button>
          </div>
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg border p-3 text-sm ${
                  feedback.good
                    ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                    : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
                }`}
              >
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 3 — Complexity Analyzer
// ─────────────────────────────────────────────
type Complexity =
  | "O(1)"
  | "O(log n)"
  | "O(n)"
  | "O(n log n)"
  | "O(n2)"
  | "O(2n)";
interface ComplexityChallenge {
  title: string;
  algoA: string;
  algoB: string;
  complexityA: Complexity;
  complexityB: Complexity;
  better: "A" | "B";
  explanation: string;
}

const COMPLEXITY_CHALLENGES: ComplexityChallenge[] = [
  {
    title: "Linear vs Binary Search",
    algoA:
      "Check each element one by one until found. 1000 elements = up to 1000 checks.",
    algoB: "Divide sorted list in half each step. 1000 elements = 10 checks.",
    complexityA: "O(n)",
    complexityB: "O(log n)",
    better: "B",
    explanation:
      "Binary search O(log n) beats linear search O(n). For n=1000: log2(1000) ≈ 10 vs 1000 checks.",
  },
  {
    title: "Bubble Sort vs Merge Sort",
    algoA:
      "Compare adjacent pairs repeatedly. 100 elements = up to 10,000 comparisons.",
    algoB: "Divide and merge. 100 elements = ~700 comparisons.",
    complexityA: "O(n2)",
    complexityB: "O(n log n)",
    better: "B",
    explanation:
      "Merge sort O(n log n) beats bubble sort O(n²). At n=100: 10,000 vs 700 operations.",
  },
  {
    title: "Array Access vs List Traversal",
    algoA: "Access element by index: arr[500]. One operation.",
    algoB: "Walk linked list to position 500. 500 operations.",
    complexityA: "O(1)",
    complexityB: "O(n)",
    better: "A",
    explanation:
      "Array index access O(1) beats list traversal O(n). Direct memory address vs walking pointers.",
  },
  {
    title: "Recursive Fibonacci vs Iterative",
    algoA:
      "Recursive fib(n): calls fib(n-1) and fib(n-2) repeatedly. fib(40) = ~2B calls.",
    algoB: "Loop from 0 to n keeping last two values. fib(40) = 40 iterations.",
    complexityA: "O(2n)",
    complexityB: "O(n)",
    better: "B",
    explanation:
      "Iterative O(n) vastly beats naive recursive O(2^n). fib(40): 40 vs 2 billion operations.",
  },
  {
    title: "Hash Table vs Sorted Array Lookup",
    algoA:
      "Hash table lookup: compute hash, access bucket. Usually 1 operation.",
    algoB: "Binary search on sorted array: divide in half each step.",
    complexityA: "O(1)",
    complexityB: "O(log n)",
    better: "A",
    explanation:
      "Hash table O(1) average beats binary search O(log n). Hash gives direct bucket access.",
  },
  {
    title: "Selection Sort vs Quick Sort",
    algoA: "Find minimum in remaining array each time. Always O(n²).",
    algoB: "Pick pivot, partition array, recurse. Average O(n log n).",
    complexityA: "O(n2)",
    complexityB: "O(n log n)",
    better: "B",
    explanation:
      "Quick sort average O(n log n) beats selection sort O(n²). Partition strategy reduces comparisons dramatically.",
  },
  {
    title: "Constant vs Linear Space",
    algoA: "Reverse array in-place by swapping. Extra memory: 1 variable.",
    algoB: "Copy array to new array reversed. Extra memory: n elements.",
    complexityA: "O(1)",
    complexityB: "O(n)",
    better: "A",
    explanation:
      "O(1) space beats O(n) space. In-place reversal uses one temp variable vs allocating a new array of size n.",
  },
  {
    title: "Nested Loop vs Single Loop",
    algoA: "Two nested loops over n elements each. n=10: 100 operations.",
    algoB: "One loop from 0 to n. n=10: 10 operations.",
    complexityA: "O(n2)",
    complexityB: "O(n)",
    better: "B",
    explanation:
      "O(n) single loop beats O(n²) nested loops. For n=1000: 1000 vs 1,000,000 operations.",
  },
  {
    title: "DFS vs BFS on Tree",
    algoA:
      "DFS: explore each branch fully before backtracking. All nodes visited once.",
    algoB: "BFS: level by level. All nodes visited once.",
    complexityA: "O(n)",
    complexityB: "O(n)",
    better: "A",
    explanation:
      "Both DFS and BFS are O(n) for trees. DFS uses O(h) stack space (h = height); BFS uses O(w) queue space (w = width). DFS wins on narrow deep trees.",
  },
  {
    title: "Counting Sort vs Comparison Sort",
    algoA:
      "Count occurrences of each value, reconstruct. n=1000, k=100: 1100 ops.",
    algoB: "Comparison-based merge sort. n=1000: ~10,000 ops.",
    complexityA: "O(n)",
    complexityB: "O(n log n)",
    better: "A",
    explanation:
      "Counting sort O(n+k) beats comparison sorts O(n log n) when k (range) is small relative to n.",
  },
];

function ComplexityAnalyzer({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 7 : 10;
  const challenges = COMPLEXITY_CHALLENGES.slice(0, count);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [cIdx, setCIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<"A" | "B" | null>(null);
  const [correct, setCorrect] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        challenges.length > 0
          ? (correctRef.current / challenges.length) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, challenges.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  const ch = challenges[cIdx];

  function pick(choice: "A" | "B") {
    if (revealed) return;
    setPicked(choice);
    setRevealed(true);
    const isCorrect = choice === ch.better;
    if (isCorrect) {
      const pts = 300 * config.difficulty + timeLeft * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      if (cIdx + 1 >= challenges.length) {
        endGame(true);
        return;
      }
      setCIdx((i) => i + 1);
      setRevealed(false);
      setPicked(null);
    }, 2000);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="complexity_analyzer.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#6366f1] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#6366f1]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Complexity Analyzer
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Two algorithms for the same task. Identify which is more efficient
            (lower Big-O complexity). Pick the better one!
          </p>
          <p className="text-xs text-muted-foreground">
            {challenges.length} challenges | O(1) beats O(n) beats O(n log n)
            beats O(n²)
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#6366f1" }}
            data-ocid="complexity_analyzer.start_button"
          >
            Analyze Algorithms
          </button>
        </motion.div>
      )}
      {phase === "playing" && ch && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6366f1] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {cIdx + 1}/{challenges.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={cIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-3"
            >
              <div className="rounded-xl border border-[#6366f1]/30 bg-card/40 p-3">
                <p className="font-bold text-[#6366f1] mb-1">{ch.title}</p>
                <p className="text-xs text-muted-foreground">
                  Which algorithm is more efficient? Select the better one.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(["A", "B"] as const).map((choice) => {
                  const algo = choice === "A" ? ch.algoA : ch.algoB;
                  const complexity =
                    choice === "A" ? ch.complexityA : ch.complexityB;
                  const isBetter = ch.better === choice;
                  const isChosen = picked === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => pick(choice)}
                      disabled={revealed}
                      className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                        revealed && isBetter
                          ? "border-[#22c55e] bg-[#22c55e]/10"
                          : revealed && isChosen && !isBetter
                            ? "border-[#f43f5e] bg-[#f43f5e]/10"
                            : "border-border/30 bg-card/50 hover:border-[#6366f1]/50"
                      } disabled:cursor-not-allowed`}
                      data-ocid={`complexity_analyzer.algo.${choice}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className="font-bold text-xs uppercase tracking-widest"
                          style={{
                            color: choice === "A" ? "#00f5ff" : "#a855f7",
                          }}
                        >
                          Algorithm {choice}
                        </span>
                        {revealed && (
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: isBetter ? "#22c55e" : "#f43f5e" }}
                          >
                            {complexity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/80">{algo}</p>
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/10 p-3 text-sm text-[#a5b4fc]"
                >
                  {ch.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export default function CodingLogic({ config, onGameEnd }: Props) {
  if (config.gameId === "flowchart-builder")
    return <FlowchartBuilder config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "complexity-analyzer")
    return <ComplexityAnalyzer config={config} onGameEnd={onGameEnd} />;
  return <AlgorithmDebugger config={config} onGameEnd={onGameEnd} />;
}
