import { GlowButton } from "@/components/ui/GlowButton";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFF_NUMS = {
  1: [1, 2, 3, 4, 5],
  2: [2, 3, 4, 5, 6, 7, 8],
  3: [3, 4, 5, 6, 7, 8, 9, 12],
};

type GridCell = { val: number | null; status: "empty" | "correct" | "wrong" };

export default function MultiplicationGrid({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [nums, setNums] = useState<number[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [active, setActive] = useState<[number, number] | null>(null);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    timeLeft,
    start: startTimer,
    pause: stopTimer,
  } = useGameTimer(
    config.difficulty === 3 ? 90 : config.difficulty === 2 ? 120 : 180,
    () => endGame(score),
  );

  const endGame = useCallback(
    (s: number) => {
      stopTimer();
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          Math.min(100, Math.round((s / 125) * 100)),
          0,
          s >= 100,
        ),
      );
    },
    [stopTimer, onGameEnd, config],
  );

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0) endGame(score);
  }, [timeLeft, phase, score, endGame]); // timer handled by useGameTimer callback too

  const startGame = () => {
    const n = DIFF_NUMS[(config.difficulty ?? 1) as 1 | 2 | 3];
    setNums(n.slice(0, 5));
    setGrid(
      Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => ({
          val: null,
          status: "empty" as const,
        })),
      ),
    );
    setScore(0);
    setActive(null);
    setInputVal("");
    setPhase("play");
    startTimer();
  };

  const handleCellClick = (r: number, c: number) => {
    if (grid[r][c].status === "correct") return;
    setActive([r, c]);
    setInputVal("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!active) return;
      const [r, c] = active;
      const answer = nums[r] * nums[c];
      const guess = Number.parseInt(inputVal, 10);
      const correct = guess === answer;
      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
      newGrid[r][c] = { val: guess, status: correct ? "correct" : "wrong" };
      setGrid(newGrid);
      const pts = correct ? score + 5 : score;
      setScore(pts);
      const allDone = newGrid.every((row) =>
        row.every((cell) => cell.status === "correct"),
      );
      if (allDone) endGame(pts);
      setActive(null);
      setInputVal("");
    },
    [active, grid, nums, inputVal, score, endGame],
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Multiplication Grid
            </h2>
            <p className="text-slate-300 mb-2">
              Click each cell and enter the product of the row and column
              numbers.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Fill all cells correctly to win. Race against the timer!
            </p>
            <GlowButton onClick={startGame} data-ocid="mult-grid.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span
              className="text-slate-300 font-mono"
              style={{ color: timeLeft < 30 ? "#f43f5e" : "#94a3b8" }}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
            <div className="overflow-auto">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="w-12 h-12" />
                    {nums.map((n) => (
                      <th
                        key={n}
                        className="w-12 h-12 text-[#f59e0b] font-bold text-sm"
                      >
                        {n}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nums.map((rn, r) => (
                    <tr key={rn}>
                      <td className="text-[#f59e0b] font-bold text-sm text-center">
                        {rn}
                      </td>
                      {nums.map((cn, c) => {
                        const cell = grid[r]?.[c];
                        const isActive = active?.[0] === r && active?.[1] === c;
                        return (
                          <td key={cn}>
                            <button
                              type="button"
                              data-ocid={`mult-grid.cell.${r * 5 + c + 1}`}
                              onClick={() => handleCellClick(r, c)}
                              className="w-12 h-12 border rounded-lg text-xs font-bold transition-all"
                              style={{
                                borderColor: isActive
                                  ? "#00f5ff"
                                  : cell?.status === "correct"
                                    ? "#10b981"
                                    : cell?.status === "wrong"
                                      ? "#f43f5e"
                                      : "#ffffff22",
                                background: isActive
                                  ? "#00f5ff22"
                                  : cell?.status === "correct"
                                    ? "#10b98122"
                                    : cell?.status === "wrong"
                                      ? "#f43f5e22"
                                      : "#ffffff05",
                                color:
                                  cell?.status === "correct"
                                    ? "#10b981"
                                    : cell?.status === "wrong"
                                      ? "#f43f5e"
                                      : "#94a3b8",
                              }}
                            >
                              {cell?.val ?? "?"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {active && (
              <form
                onSubmit={handleInputSubmit}
                className="flex gap-2 items-center"
              >
                <span className="text-slate-400 text-sm">
                  {nums[active[0]]} × {nums[active[1]]} =
                </span>
                <input
                  ref={inputRef}
                  data-ocid="mult-grid.input"
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-20 text-center bg-white/5 border border-[#00f5ff]/50 rounded-lg px-2 py-2 text-white focus:outline-none"
                />
                <button
                  type="submit"
                  data-ocid="mult-grid.submit_button"
                  className="px-4 py-2 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] text-sm font-bold"
                >
                  Enter
                </button>
              </form>
            )}
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Complete!
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton
              onClick={startGame}
              data-ocid="mult-grid.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
