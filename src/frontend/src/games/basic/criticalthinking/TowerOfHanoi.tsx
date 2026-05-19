import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface TowerOfHanoiProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFFICULTY_DISKS: Record<number, number> = { 1: 3, 2: 4, 3: 5 };
const OPTIMAL_MOVES: Record<number, number> = { 3: 7, 4: 15, 5: 31 };
const DISK_COLORS = [
  "bg-cyan-400",
  "bg-emerald-400",
  "bg-yellow-400",
  "bg-rose-400",
  "bg-purple-400",
];

type Pegs = [number[], number[], number[]];

export default function TowerOfHanoi({ config, onGameEnd }: TowerOfHanoiProps) {
  const numDisks = DIFFICULTY_DISKS[config.difficulty ?? 1];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [pegs, setPegs] = useState<Pegs>([[], [], []]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [invalidFlash, setInvalidFlash] = useState<number | null>(null);
  const { triggerShake } = useGameFeel();

  const startGame = useCallback(() => {
    const initialPeg = Array.from({ length: numDisks }, (_, i) => numDisks - i);
    setPegs([initialPeg, [], []]);
    setSelected(null);
    setMoves(0);
    setPhase("playing");
  }, [numDisks]);

  const handlePegClick = useCallback(
    (pegIdx: number) => {
      if (phase !== "playing") return;

      if (selected === null) {
        if (pegs[pegIdx].length === 0) return;
        setSelected(pegIdx);
      } else {
        if (selected === pegIdx) {
          setSelected(null);
          return;
        }
        const fromPeg = pegs[selected];
        const toPeg = pegs[pegIdx];
        const disk = fromPeg[fromPeg.length - 1];

        if (toPeg.length > 0 && toPeg[toPeg.length - 1] < disk) {
          triggerShake();
          setInvalidFlash(pegIdx);
          setTimeout(() => setInvalidFlash(null), 500);
          setSelected(null);
          return;
        }

        const newPegs: Pegs = pegs.map((p) => [...p]) as Pegs;
        newPegs[selected].pop();
        newPegs[pegIdx].push(disk);
        setPegs(newPegs);
        setMoves((m) => m + 1);
        setSelected(null);

        if (newPegs[2].length === numDisks) {
          setPhase("over");
          const movesUsed = moves + 1;
          const optimal = OPTIMAL_MOVES[numDisks];
          const accuracy = Math.min(100, (optimal / movesUsed) * 100);
          onGameEnd(
            buildResult(config, Math.round(accuracy * 10), accuracy, 0, true),
          );
        }
      }
    },
    [phase, pegs, selected, moves, triggerShake, numDisks, config, onGameEnd],
  );

  const pegLabels = ["A", "B", "C"];

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Tower of Hanoi</h2>
        <p className="text-white/70 text-center max-w-md">
          Move all disks from peg A to peg C. You cannot place a larger disk on
          a smaller one. Click a peg to select its top disk, then click the
          target peg.
        </p>
        <p className="text-white/60 text-sm">
          Disks: {numDisks} | Optimal: {OPTIMAL_MOVES[numDisks]} moves
        </p>
        <GlowButton onClick={startGame} data-ocid="hanoi.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-emerald-400">Solved!</h2>
        <p className="text-white/70">
          Your moves: <span className="text-cyan-300 font-bold">{moves}</span>
        </p>
        <p className="text-white/70">
          Optimal:{" "}
          <span className="text-yellow-400 font-bold">
            {OPTIMAL_MOVES[numDisks]}
          </span>
        </p>
        <GlowButton onClick={startGame} data-ocid="hanoi.restart_button">
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Moves: <strong className="text-cyan-300">{moves}</strong>
          </span>
          <span className="text-white/50">
            Optimal: {OPTIMAL_MOVES[numDisks]}
          </span>
          {selected !== null && (
            <span className="text-yellow-400">
              Peg {pegLabels[selected]} selected — click target peg
            </span>
          )}
        </div>
        <div className="flex gap-8 items-end" data-ocid="hanoi.pegs">
          {pegs.map((peg, pegIdx) => (
            <button
              type="button"
              key={pegIdx}
              onClick={() => handlePegClick(pegIdx)}
              data-ocid={`hanoi.peg.${pegIdx}`}
              className={`flex flex-col items-center gap-1 cursor-pointer group ${
                invalidFlash === pegIdx ? "animate-pulse" : ""
              }`}
            >
              <div className="flex flex-col-reverse items-center gap-1 min-h-[200px] justify-end relative">
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-2 h-48 rounded-t-full ${
                    selected === pegIdx ? "bg-yellow-400" : "bg-white/30"
                  } transition-colors`}
                />
                {peg.map((disk, di) => {
                  const width = 24 + disk * 16;
                  return (
                    <div
                      key={di}
                      style={{ width: `${width}px` }}
                      className={`h-6 rounded-md z-10 transition-all ${
                        DISK_COLORS[(disk - 1) % DISK_COLORS.length]
                      } ${
                        di === peg.length - 1 && selected === pegIdx
                          ? "ring-2 ring-white shadow-lg"
                          : ""
                      }`}
                    />
                  );
                })}
              </div>
              <div
                className={`w-48 h-2 rounded-full ${
                  invalidFlash === pegIdx ? "bg-rose-500" : "bg-white/30"
                } transition-colors`}
              />
              <span
                className={`text-sm font-bold ${
                  selected === pegIdx ? "text-yellow-400" : "text-white/60"
                }`}
              >
                {pegLabels[pegIdx]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
