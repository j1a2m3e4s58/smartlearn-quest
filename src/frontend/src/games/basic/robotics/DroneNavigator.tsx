import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

interface Level {
  grid: number;
  gates: [number, number][];
  fuel: number;
}

const LEVELS: Level[] = [
  {
    grid: 6,
    gates: [
      [1, 0],
      [3, 2],
      [5, 4],
      [3, 5],
    ],
    fuel: 30,
  },
  {
    grid: 7,
    gates: [
      [2, 0],
      [5, 1],
      [1, 4],
      [6, 3],
      [3, 6],
    ],
    fuel: 35,
  },
  {
    grid: 8,
    gates: [
      [0, 2],
      [4, 0],
      [7, 3],
      [2, 6],
      [6, 7],
    ],
    fuel: 40,
  },
  {
    grid: 7,
    gates: [
      [3, 0],
      [0, 3],
      [5, 2],
      [1, 6],
      [6, 5],
      [4, 4],
    ],
    fuel: 38,
  },
  {
    grid: 8,
    gates: [
      [1, 0],
      [6, 1],
      [0, 5],
      [7, 3],
      [3, 7],
      [5, 6],
    ],
    fuel: 42,
  },
];

export default function DroneNavigator({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [levelIdx, setLevelIdx] = useState(0);
  const [dronePos, setDronePos] = useState<[number, number]>([0, 0]);
  const [nextGate, setNextGate] = useState(0);
  const [fuel, setFuel] = useState(30);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const level = LEVELS[Math.min(levelIdx, LEVELS.length - 1)];

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 90 : 45,
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
    setLevelIdx(0);
    setScore(0);
    setDronePos([0, 0]);
    setNextGate(0);
    setFuel(LEVELS[0].fuel);
    setPhase("playing");
    startTimer();
  }

  function move(dx: number, dy: number) {
    if (phase !== "playing") return;
    const [x, y] = dronePos;
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= level.grid || ny < 0 || ny >= level.grid) return;
    const newPos: [number, number] = [nx, ny];
    const newFuel = fuel - 1;
    if (newFuel <= 0) {
      endGame(false);
      return;
    }
    setFuel(newFuel);
    setDronePos(newPos);
    const gate = level.gates[nextGate];
    if (gate && gate[0] === nx && gate[1] === ny) {
      setFlash("ok");
      setScore((s) => s + 200 * config.difficulty + newFuel * 5);
      setTimeout(() => setFlash(null), 400);
      const nn = nextGate + 1;
      if (nn >= level.gates.length) {
        if (levelIdx + 1 >= LEVELS.length) {
          setTimeout(() => endGame(true), 600);
          return;
        }
        const next = levelIdx + 1;
        setLevelIdx(next);
        setDronePos([0, 0]);
        setNextGate(0);
        setFuel(LEVELS[next].fuel);
      } else setNextGate(nn);
    }
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      )
        e.preventDefault();
      if (e.key === "ArrowUp" || e.key === "w") move(0, -1);
      else if (e.key === "ArrowDown" || e.key === "s") move(0, 1);
      else if (e.key === "ArrowLeft" || e.key === "a") move(-1, 0);
      else if (e.key === "ArrowRight" || e.key === "d") move(1, 0);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dronePos, phase, fuel, level, nextGate, levelIdx]);

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="drone_navigator.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
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
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Drone Navigator
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Navigate the drone through numbered gates in order using arrow keys
            or the directional buttons. Watch your fuel — each move costs 1
            unit.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="drone_navigator.start_button"
          >
            Launch Drone
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm shrink-0">
            <span className="font-mono text-[#00f5ff]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Level {levelIdx + 1}/5 | Gate {nextGate + 1}/{level.gates.length}
            </span>
            <span className="tabular-nums text-[#f59e0b]">Fuel: {fuel}</span>
          </div>
          <div
            className={`flex-1 rounded-xl border overflow-hidden transition-all ${
              flash === "ok"
                ? "border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                : "border-border/30"
            }`}
            data-ocid="drone_navigator.grid"
          >
            <div
              className="p-2 h-full"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${level.grid},1fr)`,
                gap: "2px",
              }}
            >
              {Array.from({ length: level.grid * level.grid }, (_, i) => {
                const x = i % level.grid;
                const y = Math.floor(i / level.grid);
                const isDrone = dronePos[0] === x && dronePos[1] === y;
                const gateIdx = level.gates.findIndex(
                  (g) => g[0] === x && g[1] === y,
                );
                const isPassed = gateIdx !== -1 && gateIdx < nextGate;
                const isNext = gateIdx === nextGate;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-bold border ${
                      isDrone
                        ? "bg-[#00f5ff]/30 border-[#00f5ff]"
                        : isNext
                          ? "bg-[#f59e0b]/20 border-[#f59e0b] animate-pulse"
                          : isPassed
                            ? "bg-[#10b981]/10 border-[#10b981]/30"
                            : gateIdx !== -1
                              ? "bg-card/40 border-border/40 text-muted-foreground"
                              : "bg-card/20 border-border/10"
                    }`}
                  >
                    {isDrone
                      ? "D"
                      : isNext
                        ? String(gateIdx + 1)
                        : isPassed
                          ? String(gateIdx + 1)
                          : gateIdx !== -1
                            ? String(gateIdx + 1)
                            : ""}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="grid grid-cols-3 gap-1 shrink-0"
            style={{ maxWidth: "140px", margin: "0 auto" }}
          >
            <div />
            <button
              type="button"
              onClick={() => move(0, -1)}
              className="aspect-square rounded bg-card/40 border border-border/30 flex items-center justify-center text-foreground font-bold hover:bg-card/60 transition-colors"
              data-ocid="drone_navigator.up_button"
            >
              W
            </button>
            <div />
            <button
              type="button"
              onClick={() => move(-1, 0)}
              className="aspect-square rounded bg-card/40 border border-border/30 flex items-center justify-center text-foreground font-bold hover:bg-card/60 transition-colors"
              data-ocid="drone_navigator.left_button"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => move(0, 1)}
              className="aspect-square rounded bg-card/40 border border-border/30 flex items-center justify-center text-foreground font-bold hover:bg-card/60 transition-colors"
              data-ocid="drone_navigator.down_button"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => move(1, 0)}
              className="aspect-square rounded bg-card/40 border border-border/30 flex items-center justify-center text-foreground font-bold hover:bg-card/60 transition-colors"
              data-ocid="drone_navigator.right_button"
            >
              D
            </button>
          </div>
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            MISSION OVER
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">
            Levels completed: {levelIdx}/5
          </div>
        </motion.div>
      )}
    </div>
  );
}
