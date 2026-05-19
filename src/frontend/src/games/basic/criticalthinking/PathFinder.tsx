import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface PathFinderProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFFICULTY_SIZE: Record<number, number> = { 1: 7, 2: 9, 3: 11 };

function generateMaze(size: number): boolean[][] {
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false),
  );
  // Simple maze: random walls but always keep start/end and a guaranteed path
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) continue;
      // Diagonal corridor free path
      if (Math.abs(r - c) <= 1) continue;
      grid[r][c] = Math.random() < 0.3;
    }
  }
  return grid;
}

function isValidPath(
  walls: boolean[][],
  path: Set<string>,
  size: number,
): boolean {
  if (!path.has("0,0") || !path.has(`${size - 1},${size - 1}`)) return false;
  const visited = new Set<string>();
  const queue: [number, number][] = [[0, 0]];
  visited.add("0,0");
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === size - 1 && c === size - 1) return true;
    const neighbors: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of neighbors) {
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < size &&
        nc >= 0 &&
        nc < size &&
        !visited.has(key) &&
        !walls[nr][nc] &&
        path.has(key)
      ) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

export default function PathFinder({ config, onGameEnd }: PathFinderProps) {
  const size = DIFFICULTY_SIZE[config.difficulty ?? 1];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [maze, setMaze] = useState<boolean[][]>([]);
  const [path, setPath] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [mazeNum, setMazeNum] = useState(1);
  const [feedback, setFeedback] = useState("");
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(180, () => {
    setPhase("over");
    onGameEnd(buildResult(config, score, (score / 300) * 100, 180, false));
  });

  const loadMaze = useCallback(() => {
    setMaze(generateMaze(size));
    setPath(new Set(["0,0", `${size - 1},${size - 1}`]));
    setFeedback("");
  }, [size]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setMazeNum(1);
    resetTimer();
    startTimer();
    setPhase("playing");
    loadMaze();
  }, [resetTimer, startTimer, loadMaze]);

  const toggleCell = useCallback(
    (r: number, c: number) => {
      if (phase !== "playing") return;
      if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) return;
      const key = `${r},${c}`;
      setPath((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    },
    [phase, size],
  );

  const submitPath = useCallback(() => {
    if (maze.length === 0) return;
    const valid = isValidPath(maze, path, size);
    if (valid) {
      triggerParticle(0, 0, "correct");
      triggerMascotReaction("correct");
      const points = Math.max(50, 200 - path.size * 5);
      const newScore = score + points;
      setScore(newScore);
      setFeedback(`Correct! +${points} points`);
      if (mazeNum >= 3) {
        setTimeout(() => {
          setPhase("over");
          onGameEnd(buildResult(config, newScore, 100, 180 - timeLeft, true));
        }, 1000);
      } else {
        setMazeNum((n) => n + 1);
        setTimeout(loadMaze, 1000);
      }
    } else {
      triggerShake();
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback(
        "Invalid path — path must connect start to end without walls!",
      );
      if (newLives <= 0) {
        setTimeout(() => {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              (score / 300) * 100,
              180 - timeLeft,
              false,
            ),
          );
        }, 1000);
      }
    }
  }, [
    maze,
    path,
    size,
    triggerParticle,
    triggerMascotReaction,
    triggerShake,
    score,
    mazeNum,
    lives,
    config,
    timeLeft,
    onGameEnd,
    loadMaze,
  ]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Path Finder</h2>
        <p className="text-white/70 text-center max-w-md">
          Click cells to mark your path from the green start (top-left) to the
          gold end (bottom-right). Avoid walls. Shorter path = more points.
        </p>
        <GlowButton onClick={startGame} data-ocid="pathfinder.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Game Over</h2>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="pathfinder.restart_button">
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Maze: <strong className="text-cyan-300">{mazeNum}/3</strong>
          </span>
          <span>
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Lives: <strong className="text-rose-400">{lives}</strong>
          </span>
          <span>
            Time: <strong className="text-cyan-300">{timeLeft}s</strong>
          </span>
        </div>
        {feedback && <p className="text-sm text-yellow-400">{feedback}</p>}
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          data-ocid="pathfinder.grid"
        >
          {maze.map((row, r) =>
            row.map((isWall, c) => {
              const key = `${r},${c}`;
              const isStart = r === 0 && c === 0;
              const isEnd = r === size - 1 && c === size - 1;
              const inPath = path.has(key);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleCell(r, c)}
                  data-ocid={`pathfinder.cell.${r}.${c}`}
                  disabled={isWall}
                  className={`w-8 h-8 rounded-sm border transition-all ${
                    isWall
                      ? "bg-slate-700 border-slate-600 cursor-not-allowed"
                      : isStart
                        ? "bg-emerald-500 border-emerald-400"
                        : isEnd
                          ? "bg-yellow-400 border-yellow-300"
                          : inPath
                            ? "bg-cyan-500/50 border-cyan-400"
                            : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                />
              );
            }),
          )}
        </div>
        <GlowButton onClick={submitPath} data-ocid="pathfinder.submit_button">
          Submit Path
        </GlowButton>
      </div>
    </div>
  );
}
