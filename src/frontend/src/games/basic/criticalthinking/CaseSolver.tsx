import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface CaseSolverProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface EvidenceNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

interface Case {
  title: string;
  description: string;
  nodes: EvidenceNode[];
  correctConnections: Connection[];
}

const CASES: Case[] = [
  {
    title: "The Office Theft",
    description: "Connect evidence that proves how the theft occurred.",
    nodes: [
      { id: "fingerprint", label: "Fingerprint", x: 20, y: 20 },
      { id: "footprint", label: "Footprint", x: 70, y: 20 },
      { id: "alibi", label: "Alibi", x: 20, y: 70 },
      { id: "motive", label: "Motive", x: 70, y: 70 },
      { id: "location", label: "Location", x: 45, y: 45 },
    ],
    correctConnections: [
      { from: "fingerprint", to: "location" },
      { from: "footprint", to: "location" },
      { from: "motive", to: "alibi" },
    ],
  },
  {
    title: "The Forged Document",
    description: "Link the clues to expose the forgery chain.",
    nodes: [
      { id: "fingerprint", label: "Ink Sample", x: 20, y: 20 },
      { id: "footprint", label: "Handwriting", x: 70, y: 20 },
      { id: "alibi", label: "Timeline", x: 20, y: 70 },
      { id: "motive", label: "Motive", x: 70, y: 70 },
      { id: "location", label: "Printer", x: 45, y: 45 },
    ],
    correctConnections: [
      { from: "fingerprint", to: "location" },
      { from: "footprint", to: "fingerprint" },
      { from: "alibi", to: "motive" },
      { from: "location", to: "motive" },
    ],
  },
  {
    title: "The Missing Package",
    description: "Trace the delivery chain using the evidence nodes.",
    nodes: [
      { id: "fingerprint", label: "Receipt", x: 20, y: 20 },
      { id: "footprint", label: "Camera Log", x: 70, y: 20 },
      { id: "alibi", label: "Driver Route", x: 20, y: 70 },
      { id: "motive", label: "Witness", x: 70, y: 70 },
      { id: "location", label: "Drop Zone", x: 45, y: 45 },
    ],
    correctConnections: [
      { from: "fingerprint", to: "alibi" },
      { from: "footprint", to: "location" },
      { from: "motive", to: "location" },
    ],
  },
];

function connectionKey(a: string, b: string): string {
  return [a, b].sort().join("--");
}

export default function CaseSolver({ config, onGameEnd }: CaseSolverProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [correctFound, setCorrectFound] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(180, () => {
    setPhase("over");
    onGameEnd(buildResult(config, score, (score / 90) * 100, 180, false));
  });

  const currentCase = CASES[caseIdx];
  const correctKeys = new Set(
    currentCase.correctConnections.map((c) => connectionKey(c.from, c.to)),
  );

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setCaseIdx(0);
    setSelectedNode(null);
    setCorrectFound(new Set());
    setWrongFlash(null);
    resetTimer();
    startTimer();
    setPhase("playing");
  }, [resetTimer, startTimer]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (phase !== "playing") return;
      if (selectedNode === null) {
        setSelectedNode(nodeId);
      } else if (selectedNode === nodeId) {
        setSelectedNode(null);
      } else {
        const key = connectionKey(selectedNode, nodeId);
        if (correctFound.has(key)) {
          setSelectedNode(null);
          return;
        }
        if (correctKeys.has(key)) {
          triggerParticle(0, 0, "correct");
          triggerMascotReaction("correct");
          const newFound = new Set(correctFound);
          newFound.add(key);
          setCorrectFound(newFound);
          setSelectedNode(null);
          if (newFound.size === currentCase.correctConnections.length) {
            const newScore = score + 30;
            setScore(newScore);
            if (caseIdx >= 2) {
              setTimeout(() => {
                setPhase("over");
                onGameEnd(
                  buildResult(
                    config,
                    newScore,
                    (newScore / 90) * 100,
                    180 - timeLeft,
                    true,
                  ),
                );
              }, 1000);
            } else {
              setTimeout(() => {
                setCaseIdx((n) => n + 1);
                setSelectedNode(null);
                setCorrectFound(new Set());
              }, 1000);
            }
          }
        } else {
          triggerShake();
          setWrongFlash(key);
          setTimeout(() => setWrongFlash(null), 800);
          const newLives = lives - 1;
          setLives(newLives);
          setSelectedNode(null);
          if (newLives <= 0) {
            setTimeout(() => {
              setPhase("over");
              onGameEnd(
                buildResult(
                  config,
                  score,
                  (score / 90) * 100,
                  180 - timeLeft,
                  false,
                ),
              );
            }, 800);
          }
        }
      }
    },
    [
      phase,
      selectedNode,
      correctFound,
      correctKeys,
      currentCase,
      triggerParticle,
      triggerMascotReaction,
      triggerShake,
      score,
      caseIdx,
      lives,
      config,
      timeLeft,
      onGameEnd,
    ],
  );

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Case Solver</h2>
        <p className="text-white/70 text-center max-w-md">
          Click one evidence node, then click another to connect them. Find all
          correct connections to solve the case. Wrong connections cost a life.
        </p>
        <GlowButton onClick={startGame} data-ocid="case_solver.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Cases Closed</h2>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="case_solver.restart_button">
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Case: <strong className="text-cyan-300">{caseIdx + 1}/3</strong>
          </span>
          <span>
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Lives: <strong className="text-rose-400">{lives}</strong>
          </span>
          <span>
            Found:{" "}
            <strong className="text-emerald-400">
              {correctFound.size}/{currentCase.correctConnections.length}
            </strong>
          </span>
          <span>
            Time: <strong className="text-cyan-300">{timeLeft}s</strong>
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <h3 className="text-lg font-bold text-cyan-300 mb-1">
            {currentCase.title}
          </h3>
          <p className="text-white/60 text-sm mb-4">
            {currentCase.description}
          </p>
          {selectedNode && (
            <p className="text-yellow-400 text-xs mb-2">
              "{currentCase.nodes.find((n) => n.id === selectedNode)?.label}"
              selected — click another node to connect
            </p>
          )}
          {/* Evidence board */}
          <div
            className="relative w-full"
            style={{ height: "280px" }}
            data-ocid="case_solver.board"
          >
            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {currentCase.correctConnections.map((conn) => {
                const key = connectionKey(conn.from, conn.to);
                const fromNode = currentCase.nodes.find(
                  (n) => n.id === conn.from,
                )!;
                const toNode = currentCase.nodes.find((n) => n.id === conn.to)!;
                const found = correctFound.has(key);
                const flashing = wrongFlash === key;
                if (!found && !flashing) return null;
                return (
                  <line
                    key={key}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    strokeWidth="3"
                    stroke={flashing ? "#f43f5e" : "#10b981"}
                    strokeDasharray={found ? "none" : "5,5"}
                  />
                );
              })}
            </svg>
            {/* Evidence nodes */}
            {currentCase.nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isConnected = [...correctFound].some((key) =>
                key.includes(node.id),
              );
              return (
                <button
                  type="button"
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  data-ocid={`case_solver.node.${node.id}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute w-20 h-20 rounded-full border-2 flex items-center justify-center text-xs font-bold text-center leading-tight transition-all ${
                    isSelected
                      ? "bg-yellow-400/30 border-yellow-400 shadow-lg shadow-yellow-400/30 scale-110"
                      : isConnected
                        ? "bg-emerald-500/30 border-emerald-400 shadow-lg shadow-emerald-400/30"
                        : "bg-white/10 border-white/30 hover:border-cyan-400 hover:bg-cyan-500/10"
                  }`}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
