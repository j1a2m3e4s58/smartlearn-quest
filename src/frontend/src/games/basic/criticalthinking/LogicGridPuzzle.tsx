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

type GridCell = "yes" | "no" | "unknown";

interface Puzzle {
  people: string[];
  items: string[];
  clues: string[];
  solution: boolean[][];
}

const PUZZLES: Puzzle[] = [
  {
    people: ["Alice", "Bob", "Carol"],
    items: ["Cat", "Dog", "Fish"],
    clues: [
      "Alice does not own the dog.",
      "Bob owns a mammal (cat or dog).",
      "Carol is allergic to fur-bearing animals.",
    ],
    solution: [
      [true, false, false],
      [false, true, false],
      [false, false, true],
    ],
  },
  {
    people: ["Red", "Blue", "Green"],
    items: ["Math", "Art", "Music"],
    clues: [
      "Red team does not do Art.",
      "Blue team and Green team do not do Math.",
      "Green team does Music.",
    ],
    solution: [
      [true, false, false],
      [false, true, false],
      [false, false, true],
    ],
  },
  {
    people: ["Tom", "Amy", "Sam"],
    items: ["Apple", "Banana", "Cherry"],
    clues: [
      "Tom does not eat fruit that starts with A or B.",
      "Amy eats the yellow fruit.",
      "Sam does not eat Cherry.",
    ],
    solution: [
      [false, false, true],
      [false, true, false],
      [true, false, false],
    ],
  },
];

export default function LogicGridPuzzle({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [pIdx, setPIdx] = useState(0);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const puzzle = PUZZLES[Math.min(pIdx, PUZZLES.length - 1)];

  function makeGrid() {
    return Array.from(
      { length: 3 },
      () => Array(3).fill("unknown") as GridCell[],
    );
  }

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 90 : 50,
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
    setPIdx(0);
    setScore(0);
    setLives(config.livesCount);
    setGrid(makeGrid());
    setPhase("playing");
    startTimer();
  }

  function toggleCell(r: number, c: number) {
    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri === r && ci === c) {
            const next: GridCell =
              cell === "unknown" ? "yes" : cell === "yes" ? "no" : "unknown";
            return next;
          }
          return cell;
        }),
      ),
    );
  }

  function checkSolution() {
    const p = puzzle;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        const expected = p.solution[r][c];
        const cell = grid[r][c];
        const cellVal = cell === "yes";
        if (cell === "unknown" || cellVal !== expected) {
          setFlash("err");
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setTimeout(() => endGame(false), 800);
            return nl;
          });
          setTimeout(() => setFlash(null), 800);
          return;
        }
      }
    setFlash("ok");
    setScore((s) => s + 500 * config.difficulty + timeLeft * 4);
    setTimeout(() => {
      setFlash(null);
      if (pIdx + 1 >= PUZZLES.length) endGame(true);
      else {
        setPIdx((i) => i + 1);
        setGrid(makeGrid());
      }
    }, 1500);
  }

  const cellStyle = (cell: GridCell, r: number, c: number) => {
    if (cell === "yes")
      return "bg-[#10b981]/30 border-[#10b981] text-[#10b981]";
    if (cell === "no") return "bg-[#f43f5e]/20 border-[#f43f5e] text-[#f43f5e]";
    return "bg-card/20 border-border/30 text-muted-foreground hover:border-[#00f5ff]/40";
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="logic_grid.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#10b981] transition-all duration-1000"
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
            className="text-3xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Logic Grid
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Use the clues to fill in the grid. Click a cell to toggle Yes / No.
            All cells must be correct to advance.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#10b981] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="logic_grid.start_button"
          >
            Start Puzzle
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#10b981]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Puzzle {pIdx + 1}/3 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-lg border border-border/20 bg-card/20 p-3 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold mb-1">
              CLUES
            </div>
            {puzzle.clues.map((c, i) => (
              <div key={i} className="text-xs text-foreground">
                {i + 1}. {c}
              </div>
            ))}
          </div>
          <div
            className={`rounded-xl border-2 overflow-hidden transition-all ${
              flash === "ok"
                ? "border-[#10b981]"
                : flash === "err"
                  ? "border-[#f43f5e]"
                  : "border-border/30"
            }`}
          >
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-muted-foreground text-left" />
                  {puzzle.items.map((item) => (
                    <th
                      key={item}
                      className="p-2 text-xs text-muted-foreground text-center"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {puzzle.people.map((person, r) => (
                  <tr key={person}>
                    <td className="p-2 text-xs font-semibold text-foreground">
                      {person}
                    </td>
                    {puzzle.items.map((_, c) => (
                      <td key={c} className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCell(r, c)}
                          className={`w-10 h-10 rounded border-2 font-bold text-sm transition-all ${cellStyle(grid[r]?.[c] || "unknown", r, c)}`}
                          data-ocid={`logic_grid.cell.${r + 1}.${c + 1}`}
                        >
                          {grid[r]?.[c] === "yes"
                            ? "Y"
                            : grid[r]?.[c] === "no"
                              ? "X"
                              : ""}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={checkSolution}
            className="py-3 rounded-lg bg-[#10b981] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="logic_grid.check_button"
          >
            Check Solution
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
            className="text-4xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            SOLVED
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
        </motion.div>
      )}
    </div>
  );
}
