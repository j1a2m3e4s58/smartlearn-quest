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

interface Segment {
  id: string;
  label: string;
  mass: number;
  color: string;
}
interface Challenge {
  title: string;
  description: string;
  segments: Segment[];
  pivotAt: number; // index of the pivot/fulcrum segment
  targetBalance: number; // target moment difference (0 = perfect)
  tolerance: number;
}

const CHALLENGES: Record<1 | 2 | 3, Challenge[]> = {
  1: [
    {
      title: "Simple Lever Balance",
      description:
        "Adjust the weight positions on each side of the fulcrum to balance the beam.",
      segments: [
        { id: "a", label: "Block A (2kg)", mass: 2, color: "#00f5ff" },
        { id: "b", label: "Block B (4kg)", mass: 4, color: "#f43f5e" },
      ],
      pivotAt: 1,
      targetBalance: 0,
      tolerance: 0.5,
    },
    {
      title: "Robot Arm Balance",
      description: "Place counterweights so the arm moments balance.",
      segments: [
        { id: "arm", label: "Arm (3kg)", mass: 3, color: "#10b981" },
        {
          id: "cw",
          label: "Counterweight (1.5kg)",
          mass: 1.5,
          color: "#f59e0b",
        },
      ],
      pivotAt: 1,
      targetBalance: 0,
      tolerance: 1,
    },
  ],
  2: [
    {
      title: "3-Segment Robot",
      description:
        "Distribute mass across 3 segments to stabilize the robot chassis.",
      segments: [
        { id: "front", label: "Front Module (5kg)", mass: 5, color: "#00f5ff" },
        { id: "middle", label: "Battery (8kg)", mass: 8, color: "#f43f5e" },
        { id: "rear", label: "Motor Pack (3kg)", mass: 3, color: "#7c3aed" },
      ],
      pivotAt: 1,
      targetBalance: 0,
      tolerance: 2,
    },
  ],
  3: [
    {
      title: "6-DOF Arm Balancing",
      description: "Balance a 6-segment arm using calculated moment equations.",
      segments: [
        { id: "s1", label: "Base (10kg)", mass: 10, color: "#00f5ff" },
        { id: "s2", label: "Shoulder (4kg)", mass: 4, color: "#f59e0b" },
        { id: "s3", label: "Upper Arm (3kg)", mass: 3, color: "#10b981" },
        { id: "s4", label: "Forearm (2kg)", mass: 2, color: "#7c3aed" },
        { id: "s5", label: "Wrist (1.5kg)", mass: 1.5, color: "#e879f9" },
        { id: "s6", label: "Gripper (1kg)", mass: 1, color: "#f43f5e" },
      ],
      pivotAt: 2,
      targetBalance: 0,
      tolerance: 3,
    },
  ],
};

export default function BalanceChallenge({ config, onGameEnd }: Props) {
  const challenges = CHALLENGES[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [cIdx, setCIdx] = useState(0);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedOk, setFeedOk] = useState(false);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const ch = challenges[cIdx % challenges.length];

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current !== "playing") return;
      setPhase("idle");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 85 : 30,
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
    const init: Record<string, number> = {};
    for (const s of ch.segments) init[s.id] = 0;
    setPositions(init);
    startRef.current = Date.now();
    setPhase("playing");
    startTimer();
  }

  function checkBalance() {
    // Compute moment relative to pivot
    const pivot = ch.pivotAt;
    let momentLeft = 0;
    let momentRight = 0;
    ch.segments.forEach((seg, i) => {
      const armLen = Math.abs(i - pivot);
      const pos = positions[seg.id] ?? 0; // user sets arm length multiplier 1–5
      const m = seg.mass * (armLen + pos);
      if (i < pivot) momentLeft += m;
      else if (i > pivot) momentRight += m;
    });
    const diff = Math.abs(momentLeft - momentRight);
    if (diff <= ch.tolerance) {
      const pts = 600 * config.difficulty + timeLeft * 6;
      setScore((s) => s + pts);
      setFeedOk(true);
      setFeedback(
        `Balanced! Moment difference: ${diff.toFixed(2)} N·m — +${pts} pts`,
      );
      setTimeout(() => {
        if (cIdx + 1 >= challenges.length) {
          endGame(true);
          return;
        }
        setCIdx((i) => i + 1);
        const init: Record<string, number> = {};
        for (const s of challenges[(cIdx + 1) % challenges.length].segments)
          init[s.id] = 0;
        setPositions(init);
        setFeedback(null);
      }, 2000);
    } else {
      setFeedOk(false);
      setFeedback(
        `Unbalanced: Left=${momentLeft.toFixed(1)} N·m, Right=${momentRight.toFixed(1)} N·m. Diff=${diff.toFixed(1)}`,
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
  }

  const pct = (timeLeft / config.timeLimit) * 100;
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="balance_challenge.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
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
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Balance Challenge
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Adjust each segment's position offset so the robot's torques balance
            around the pivot. Uses the moment equation: M = mass × distance.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90"
            data-ocid="balance_challenge.start_button"
          >
            Balance Robot
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#f59e0b]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {ch.title} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{ch.description}</p>
          <div className="space-y-3">
            {ch.segments.map((seg, i) => (
              <div
                key={seg.id}
                className="rounded-lg border border-border/30 bg-card/40 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-sm font-bold"
                    style={{ color: seg.color }}
                  >
                    {seg.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {i === ch.pivotAt
                      ? "PIVOT"
                      : i < ch.pivotAt
                        ? "Left arm"
                        : "Right arm"}
                  </span>
                </div>
                {i !== ch.pivotAt && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">
                      Offset: {(positions[seg.id] ?? 0).toFixed(1)} m
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={positions[seg.id] ?? 0}
                      onChange={(e) =>
                        setPositions((p) => ({
                          ...p,
                          [seg.id]: Number.parseFloat(e.target.value),
                        }))
                      }
                      className="flex-1"
                      style={{ accentColor: seg.color }}
                      data-ocid={`balance_challenge.slider.${i + 1}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg border p-3 text-xs ${feedOk ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`}
              >
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={checkBalance}
            className="self-center px-8 py-2 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90"
            data-ocid="balance_challenge.check_button"
          >
            Check Balance
          </button>
        </div>
      )}
    </div>
  );
}
