import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}
interface Connection {
  from: string;
  to: string;
}
interface Puzzle {
  title: string;
  description: string;
  nodes: Node[];
  required: Array<[string, string]>;
  wrongPenalty: string;
}

const PUZZLES: Record<1 | 2 | 3, Puzzle[]> = {
  1: [
    {
      title: "Light the Bulb",
      description:
        "Connect Battery to Resistor, then Resistor to LED to complete the circuit.",
      nodes: [
        { id: "bat", label: "Battery", x: 10, y: 40, color: "#f43f5e" },
        { id: "res", label: "Resistor", x: 45, y: 20, color: "#f59e0b" },
        { id: "led", label: "LED", x: 80, y: 40, color: "#00f5ff" },
      ],
      required: [
        ["bat", "res"],
        ["res", "led"],
        ["led", "bat"],
      ],
      wrongPenalty: "Wrong connection — short circuit!",
    },
    {
      title: "Switch Circuit",
      description: "Connect Battery → Switch → LED to control the light.",
      nodes: [
        { id: "bat", label: "Battery", x: 10, y: 50, color: "#f43f5e" },
        { id: "sw", label: "Switch", x: 45, y: 15, color: "#e879f9" },
        { id: "led", label: "LED", x: 80, y: 50, color: "#00f5ff" },
      ],
      required: [
        ["bat", "sw"],
        ["sw", "led"],
        ["led", "bat"],
      ],
      wrongPenalty: "Wrong path — circuit open!",
    },
  ],
  2: [
    {
      title: "Transistor Switch",
      description:
        "Wire the transistor to amplify the base signal to drive the LED.",
      nodes: [
        { id: "bat", label: "9V Battery", x: 8, y: 40, color: "#f43f5e" },
        { id: "rb", label: "Base Res", x: 30, y: 15, color: "#f59e0b" },
        { id: "tr", label: "NPN BJT", x: 55, y: 40, color: "#10b981" },
        { id: "rl", label: "Load Res", x: 55, y: 15, color: "#f59e0b" },
        { id: "led", label: "LED", x: 80, y: 15, color: "#00f5ff" },
      ],
      required: [
        ["bat", "rl"],
        ["rl", "led"],
        ["led", "tr"],
        ["tr", "bat"],
        ["bat", "rb"],
        ["rb", "tr"],
      ],
      wrongPenalty: "Incorrect wiring — transistor damaged!",
    },
  ],
  3: [
    {
      title: "H-Bridge Motor Driver",
      description: "Wire an H-bridge to enable bidirectional motor control.",
      nodes: [
        { id: "bat", label: "12V Supply", x: 8, y: 45, color: "#f43f5e" },
        { id: "q1", label: "Q1 (High-L)", x: 30, y: 15, color: "#10b981" },
        { id: "q2", label: "Q2 (Low-L)", x: 30, y: 70, color: "#10b981" },
        { id: "q3", label: "Q3 (High-R)", x: 65, y: 15, color: "#7c3aed" },
        { id: "q4", label: "Q4 (Low-R)", x: 65, y: 70, color: "#7c3aed" },
        { id: "motor", label: "DC Motor", x: 45, y: 45, color: "#f59e0b" },
      ],
      required: [
        ["bat", "q1"],
        ["q1", "motor"],
        ["motor", "q4"],
        ["q4", "bat"],
        ["bat", "q3"],
        ["q3", "motor"],
        ["q2", "bat"],
      ],
      wrongPenalty: "Bridge fault — motor stall!",
    },
  ],
};

export default function WireConnectionGame({ config, onGameEnd }: Props) {
  const puzzles = PUZZLES[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [pIdx, setPIdx] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const [complete, setComplete] = useState(false);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const puzzle = puzzles[pIdx % puzzles.length];

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 90 : 40,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startRef.current = Date.now();
    setConnections([]);
    setPhase("playing");
    startTimer();
  }

  function nodeClick(id: string) {
    if (!selecting) {
      setSelecting(id);
      return;
    }
    if (selecting === id) {
      setSelecting(null);
      return;
    }
    const already = connections.some(
      (c) =>
        (c.from === selecting && c.to === id) ||
        (c.from === id && c.to === selecting),
    );
    if (already) {
      setSelecting(null);
      return;
    }
    const valid = puzzle.required.some(
      ([a, b]) =>
        (a === selecting && b === id) || (a === id && b === selecting),
    );
    if (!valid) {
      setFlash("err");
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
      setTimeout(() => setFlash(null), 600);
      setSelecting(null);
      return;
    }
    const next = [...connections, { from: selecting, to: id }];
    setConnections(next);
    setScore((s) => s + 150 * config.difficulty);
    setFlash("ok");
    setTimeout(() => setFlash(null), 400);
    const allDone = puzzle.required.every(([a, b]) =>
      next.some(
        (c) => (c.from === a && c.to === b) || (c.from === b && c.to === a),
      ),
    );
    if (allDone) {
      setComplete(true);
      setScore((s) => s + 500 * config.difficulty + timeLeft * 5);
      setTimeout(() => {
        if (pIdx + 1 >= puzzles.length) {
          endGame(true);
          return;
        }
        setPIdx((i) => i + 1);
        setConnections([]);
        setComplete(false);
        setSelecting(null);
      }, 1800);
    }
    setSelecting(null);
  }

  const pct = (timeLeft / config.timeLimit) * 100;
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="wire_connection.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Wire Connection
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Click two nodes to connect them with a wire. Build the complete
            circuit to light up the bulb. Wrong connections cost lives.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="wire_connection.start_button"
          >
            Start Wiring
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#00f5ff]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {puzzle.title} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-lg border border-[#00f5ff]/20 bg-card/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              {puzzle.description}
            </p>
          </div>
          <div
            className={`relative flex-1 rounded-xl border overflow-hidden transition-all
            ${
              flash === "err"
                ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                : flash === "ok"
                  ? "border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : complete
                    ? "border-[#10b981]"
                    : "border-border/30"
            }`}
            data-ocid="wire_connection.board"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {connections.map((c, i) => {
                const f = puzzle.nodes.find((n) => n.id === c.from);
                const t = puzzle.nodes.find((n) => n.id === c.to);
                if (!f || !t) return null;
                return (
                  <line
                    key={`wire-${i}`}
                    x1={`${f.x + 4}%`}
                    y1={`${f.y + 4}%`}
                    x2={`${t.x + 4}%`}
                    y2={`${t.y + 4}%`}
                    stroke={complete ? "#10b981" : "#00f5ff"}
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 4px ${complete ? "#10b981" : "#00f5ff"})`,
                    }}
                  />
                );
              })}
              {selecting &&
                (() => {
                  const n = puzzle.nodes.find((nd) => nd.id === selecting);
                  return n ? (
                    <circle
                      cx={`${n.x + 4}%`}
                      cy={`${n.y + 4}%`}
                      r="16"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                  ) : null;
                })()}
            </svg>
            {puzzle.nodes.map((node, i) => (
              <motion.button
                key={node.id}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => nodeClick(node.id)}
                className="absolute flex items-center justify-center rounded-lg border-2 w-20 h-12 text-xs font-bold cursor-pointer z-10 transition-all"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  borderColor:
                    selecting === node.id
                      ? "#f59e0b"
                      : connections.some(
                            (c) => c.from === node.id || c.to === node.id,
                          )
                        ? "#10b981"
                        : `${node.color}60`,
                  backgroundColor: connections.some(
                    (c) => c.from === node.id || c.to === node.id,
                  )
                    ? "#10b98115"
                    : `${node.color}10`,
                  color: node.color,
                }}
                data-ocid={`wire_connection.node.${i + 1}`}
              >
                {node.label}
              </motion.button>
            ))}
            <AnimatePresence>
              {complete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/80 z-20"
                >
                  <div className="text-center">
                    <div
                      className="text-4xl font-black text-[#10b981]"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      CIRCUIT COMPLETE!
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">
                      Bulb is lit — excellent wiring!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {selecting && (
            <p className="text-xs text-center text-[#f59e0b]">
              Connecting: {selecting} — click target node
            </p>
          )}
        </div>
      )}
    </div>
  );
}
