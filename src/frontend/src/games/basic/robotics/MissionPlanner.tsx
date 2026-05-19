import { motion } from "motion/react";
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

interface Waypoint {
  id: string;
  x: number;
  y: number;
}
interface Mission {
  waypoints: Waypoint[];
  optimalDist: number;
}

function dist(a: Waypoint, b: Waypoint) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function totalDist(order: string[], wps: Waypoint[]) {
  let d = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const a = wps.find((w) => w.id === order[i])!;
    const b = wps.find((w) => w.id === order[i + 1])!;
    d += dist(a, b);
  }
  return d;
}

const MISSIONS: Mission[] = [
  {
    waypoints: [
      { id: "A", x: 10, y: 80 },
      { id: "B", x: 30, y: 20 },
      { id: "C", x: 60, y: 50 },
      { id: "D", x: 80, y: 15 },
      { id: "E", x: 90, y: 70 },
    ],
    optimalDist: 185,
  },
  {
    waypoints: [
      { id: "A", x: 5, y: 50 },
      { id: "B", x: 50, y: 10 },
      { id: "C", x: 90, y: 50 },
      { id: "D", x: 50, y: 90 },
      { id: "E", x: 50, y: 50 },
    ],
    optimalDist: 200,
  },
  {
    waypoints: [
      { id: "A", x: 20, y: 20 },
      { id: "B", x: 80, y: 20 },
      { id: "C", x: 80, y: 80 },
      { id: "D", x: 20, y: 80 },
      { id: "E", x: 50, y: 50 },
    ],
    optimalDist: 220,
  },
];

export default function MissionPlanner({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [mIdx, setMIdx] = useState(0);
  const [order, setOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 85 : 50,
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
  const mission = MISSIONS[Math.min(mIdx, MISSIONS.length - 1)];

  function startGame() {
    startRef.current = Date.now();
    setMIdx(0);
    setScore(0);
    setOrder([]);
    setSubmitting(false);
    setPhase("playing");
    startTimer();
  }

  function toggleWaypoint(id: string) {
    if (submitting) return;
    setOrder((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  function submitRoute() {
    if (order.length !== mission.waypoints.length || submitting) return;
    setSubmitting(true);
    const d = totalDist(order, mission.waypoints);
    const efficiency = Math.max(
      0,
      100 -
        Math.max(0, ((d - mission.optimalDist) / mission.optimalDist) * 100),
    );
    const pts = Math.floor(efficiency * config.difficulty * 4) + timeLeft * 2;
    setScore((s) => s + pts);
    setFlash("ok");
    setTimeout(() => {
      setFlash(null);
      setSubmitting(false);
      if (mIdx + 1 >= MISSIONS.length) endGame(true);
      else {
        setMIdx((i) => i + 1);
        setOrder([]);
      }
    }, 1800);
  }

  const currentDist =
    order.length >= 2 ? totalDist(order, mission.waypoints) : 0;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="mission_planner.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#e879f9] transition-all duration-1000"
          style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Mission Planner
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Click waypoints A through E in the order you want the drone to visit
            them. Create the shortest possible route — efficiency = more points.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#e879f9] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="mission_planner.start_button"
          >
            Plan Mission
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm shrink-0">
            <span className="font-mono text-[#e879f9]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Mission {mIdx + 1}/3
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`relative flex-1 rounded-xl border overflow-hidden transition-all ${
              flash === "ok"
                ? "border-[#10b981] shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                : "border-border/30"
            }
            bg-card/20`}
            data-ocid="mission_planner.map"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {order.length >= 2 &&
                order.map((_, i) => {
                  if (i === 0) return null;
                  const a = mission.waypoints.find(
                    (w) => w.id === order[i - 1],
                  )!;
                  const b = mission.waypoints.find((w) => w.id === order[i])!;
                  return (
                    <line
                      key={i}
                      x1={`${a.x}%`}
                      y1={`${a.y}%`}
                      x2={`${b.x}%`}
                      y2={`${b.y}%`}
                      stroke="#e879f9"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      style={{ filter: "drop-shadow(0 0 3px #e879f9)" }}
                    />
                  );
                })}
            </svg>
            {mission.waypoints.map((wp, i) => {
              const posInOrder = order.indexOf(wp.id);
              return (
                <motion.button
                  key={wp.id}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWaypoint(wp.id)}
                  className={`absolute w-9 h-9 rounded-full border-2 font-bold text-sm flex items-center justify-center transition-all ${
                    posInOrder !== -1
                      ? "border-[#10b981] bg-[#10b981]/30 text-[#10b981]"
                      : "border-[#e879f9]/60 bg-[#e879f9]/10 text-[#e879f9]"
                  }`}
                  style={{
                    left: `calc(${wp.x}% - 18px)`,
                    top: `calc(${wp.y}% - 18px)`,
                  }}
                  data-ocid={`mission_planner.waypoint.${i + 1}`}
                >
                  {posInOrder !== -1 ? posInOrder + 1 : wp.id}
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <span>Route: {order.join(" → ")}</span>
            <span>
              {order.length >= 2 ? `Dist: ${currentDist.toFixed(0)}` : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={submitRoute}
            disabled={order.length !== mission.waypoints.length}
            className="py-3 rounded-lg bg-[#e879f9] text-black font-bold hover:opacity-90 disabled:opacity-40 transition-colors shrink-0"
            data-ocid="mission_planner.submit_button"
          >
            Submit Route
          </button>
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            MISSIONS DONE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
        </motion.div>
      )}
    </div>
  );
}
