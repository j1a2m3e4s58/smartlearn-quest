import { GlowButton } from "@/components/ui/GlowButton";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  Heart,
  MousePointer,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─── Game 1: Cursor Precision ───────────────────────────────────────────────

interface Target {
  id: string;
  x: number;
  y: number;
  spawnTime: number;
  lifeMs: number;
  isDecoy: boolean;
}

function CursorPrecision({ config, onGameEnd }: Props) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [combo, setCombo] = useState(0);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [totalHit, setTotalHit] = useState(0);
  const [flash, setFlash] = useState(false);
  const startRef = useRef(Date.now());
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const spawnedRef = useRef(0);
  const hitRef = useRef(0);
  livesRef.current = lives;
  scoreRef.current = score;
  comboRef.current = combo;
  spawnedRef.current = totalSpawned;
  hitRef.current = totalHit;

  const DIFF = {
    1: { maxT: 1, lifeMs: 1600, spawnMs: 850 },
    2: { maxT: 2, lifeMs: 1200, spawnMs: 700 },
    3: { maxT: 3, lifeMs: 900, spawnMs: 550 },
  } as const;

  const endGame = useCallback(
    (completed: boolean) => {
      if (over) return;
      setOver(true);
      const acc =
        spawnedRef.current > 0
          ? (hitRef.current / spawnedRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, over],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  useEffect(() => {
    if (!started || over) return;
    const d = DIFF[config.difficulty];
    const iv = setInterval(() => {
      setTargets((prev) => {
        const now = Date.now();
        const expired = prev.filter((t) => now - t.spawnTime >= t.lifeMs);
        for (const t of expired) {
          if (!t.isDecoy) {
            setLives((l) => {
              const nl = l - 1;
              if (nl <= 0) endGame(false);
              return Math.max(0, nl);
            });
            setCombo(0);
          }
        }
        const alive = prev.filter((t) => now - t.spawnTime < t.lifeMs);
        if (alive.length < d.maxT) {
          const isDecoy = config.difficulty === 3 && Math.random() < 0.3;
          setTotalSpawned((s) => s + 1);
          return [
            ...alive,
            {
              id: `t-${Date.now()}-${Math.random()}`,
              x: 5 + Math.random() * 80,
              y: 5 + Math.random() * 80,
              spawnTime: now,
              lifeMs: d.lifeMs,
              isDecoy,
            },
          ];
        }
        return alive;
      });
    }, d.spawnMs);
    return () => clearInterval(iv);
  }, [started, over, config.difficulty, endGame, DIFF]);

  function hitTarget(t: Target) {
    if (!started || over) return;
    setTargets((prev) => prev.filter((x) => x.id !== t.id));
    if (t.isDecoy) {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return Math.max(0, nl);
      });
      setCombo(0);
      return;
    }
    const nc = comboRef.current + 1;
    const mult = 1 + Math.floor(nc / 5) * 0.5;
    setScore((s) => s + Math.floor(100 * mult));
    setCombo(nc);
    setTotalHit((h) => h + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  }

  const pct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="mouse_master.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Crosshair className="h-4 w-4" />
          <span
            className={`text-lg font-bold transition-all ${flash ? "scale-125 text-[#f59e0b]" : ""}`}
          >
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {combo >= 5 && (
            <span className="flex items-center gap-1 text-[#f59e0b] text-xs">
              <Zap className="h-3 w-3" />x
              {(1 + Math.floor(combo / 5) * 0.5).toFixed(1)}
            </span>
          )}
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>
      <div
        className="relative flex-1 rounded-xl border border-border/30 glass overflow-hidden cursor-crosshair"
        data-ocid="mouse_master.arena"
      >
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />
        {!started && !over && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/80 backdrop-blur-sm"
          >
            <Crosshair className="h-12 w-12 text-[#00f5ff] mb-4" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Cursor Precision
            </h2>
            <p className="text-muted-foreground text-sm mb-1">
              Click cyan targets before they vanish. Avoid red decoys.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startRef.current = Date.now();
                setStarted(true);
                startTimer();
              }}
              data-ocid="mouse_master.start_button"
            >
              Start Game
            </GlowButton>
          </motion.div>
        )}
        <AnimatePresence>
          {targets.map((t) => (
            <motion.button
              type="button"
              key={t.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => hitTarget(t)}
              className={`absolute w-14 h-14 rounded-full border-2 focus:outline-none flex items-center justify-center ${t.isDecoy ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-[#00f5ff] bg-[#00f5ff]/10"}`}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: "translate(-50%,-50%)",
                boxShadow: t.isDecoy
                  ? "0 0 20px rgba(244,63,94,0.5)"
                  : "0 0 20px rgba(0,245,255,0.5)",
              }}
              data-ocid={
                t.isDecoy ? "mouse_master.decoy_target" : "mouse_master.target"
              }
            >
              <Crosshair
                className={`h-5 w-5 ${t.isDecoy ? "text-[#f43f5e]" : "text-[#00f5ff]"}`}
              />
            </motion.button>
          ))}
        </AnimatePresence>
        {combo >= 3 && started && (
          <motion.div
            key={combo}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 text-[#f59e0b] font-black text-xl pointer-events-none"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {combo}x COMBO!
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Game 2: Drag Drop Maze ──────────────────────────────────────────────────

const MAZE_GRID = 8;
const OBSTACLES = [
  [2, 1],
  [2, 2],
  [2, 3],
  [4, 3],
  [4, 4],
  [6, 2],
  [6, 3],
  [6, 5],
  [3, 6],
  [5, 6],
] as [number, number][];

interface MazeItem {
  id: string;
  label: string;
  folder: string;
  col: number;
  row: number;
  placed: boolean;
}
interface MazeFolder {
  id: string;
  label: string;
  col: number;
  row: number;
}

const FOLDERS: MazeFolder[] = [
  { id: "docs", label: "Documents", col: 7, row: 1 },
  { id: "images", label: "Images", col: 7, row: 4 },
  { id: "videos", label: "Videos", col: 7, row: 7 },
];

const ITEMS: Omit<MazeItem, "placed">[] = [
  { id: "i1", label: "report.docx", folder: "docs", col: 0, row: 0 },
  { id: "i2", label: "photo.jpg", folder: "images", col: 0, row: 3 },
  { id: "i3", label: "movie.mp4", folder: "videos", col: 0, row: 6 },
  { id: "i4", label: "notes.txt", folder: "docs", col: 0, row: 1 },
];

function DragDropMaze({ config, onGameEnd }: Props) {
  const [items, setItems] = useState<MazeItem[]>(
    ITEMS.map((i) => ({ ...i, placed: false })),
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, [number, number]>>(
    () => Object.fromEntries(ITEMS.map((i) => [i.id, [i.col, i.row]])),
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("");
  const startRef = useRef(Date.now());
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (over) return;
      setOver(true);
      const placed = items.filter((i) => i.placed).length;
      const acc = (placed / ITEMS.length) * 100;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, over, items],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function isObstacle(col: number, row: number) {
    return OBSTACLES.some(([c, r]) => c === col && r === row);
  }

  function tryDrop(itemId: string, col: number, row: number) {
    const folder = FOLDERS.find((f) => f.col === col && f.row === row);
    const item = items.find((i) => i.id === itemId);
    if (!item || item.placed) return;
    if (folder) {
      if (folder.id === item.folder) {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, placed: true } : i)),
        );
        setScore((s) => s + 200 * config.difficulty);
        setMsg("Correct folder!");
        setTimeout(() => setMsg(""), 1200);
        const allPlaced = items
          .filter((i) => i.id !== itemId)
          .every((i) => i.placed);
        if (allPlaced) endGame(true);
      } else {
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return Math.max(0, nl);
        });
        setMsg("Wrong folder!");
        setTimeout(() => setMsg(""), 1200);
      }
    } else if (!isObstacle(col, row)) {
      setPositions((prev) => ({ ...prev, [itemId]: [col, row] }));
    }
    setDragging(null);
  }

  const cellSize = 46;

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="drag_drop_maze.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <span className="text-[#00f5ff] font-bold text-lg">
          {score.toLocaleString()}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{timeLeft}s</span>
      </div>
      {msg && (
        <div
          className={`text-center text-sm font-bold mb-1 ${msg.startsWith("C") ? "text-[#10b981]" : "text-[#f43f5e]"}`}
        >
          {msg}
        </div>
      )}
      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h2
            className="text-2xl font-black glow-cyan-text"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Drag Drop Maze
          </h2>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            Drag files through the maze grid to their correct destination
            folders. Avoid obstacles.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startRef.current = Date.now();
              setStarted(true);
              startTimer();
            }}
            data-ocid="drag_drop_maze.start_button"
          >
            Start Game
          </GlowButton>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div
            className="relative"
            style={{
              width: MAZE_GRID * cellSize,
              height: MAZE_GRID * cellSize,
            }}
          >
            {Array.from({ length: MAZE_GRID }).map((_, row) =>
              Array.from({ length: MAZE_GRID }).map((__, col) => {
                const isObs = isObstacle(col, row);
                const folder = FOLDERS.find(
                  (f) => f.col === col && f.row === row,
                );
                return (
                  <div
                    key={`${col}-${row}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={() => {
                      if (dragging) tryDrop(dragging, col, row);
                    }}
                    className={`absolute border border-border/20 flex items-center justify-center text-[9px] font-bold ${
                      isObs
                        ? "bg-[#f43f5e]/20 border-[#f43f5e]/40"
                        : folder
                          ? "bg-[#00f5ff]/10 border-[#00f5ff]/50"
                          : "bg-card/30"
                    }`}
                    style={{
                      left: col * cellSize,
                      top: row * cellSize,
                      width: cellSize,
                      height: cellSize,
                    }}
                  >
                    {isObs && (
                      <div className="w-3 h-3 bg-[#f43f5e]/60 rounded-sm" />
                    )}
                    {folder && (
                      <span className="text-[#00f5ff] text-center leading-tight px-1">
                        {folder.label}
                      </span>
                    )}
                  </div>
                );
              }),
            )}
            {items
              .filter((i) => !i.placed)
              .map((item) => {
                const [col, row] = positions[item.id];
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDragging(item.id)}
                    className="absolute flex items-center justify-center text-[9px] font-bold text-[#00f5ff] bg-[#00f5ff]/20 border border-[#00f5ff]/60 rounded cursor-grab"
                    style={{
                      left: col * cellSize + 3,
                      top: row * cellSize + 3,
                      width: cellSize - 6,
                      height: cellSize - 6,
                      zIndex: 10,
                    }}
                    data-ocid="drag_drop_maze.item"
                  >
                    {item.label}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Game 3: Double Click Race ───────────────────────────────────────────────

interface ClickTarget {
  id: string;
  x: number;
  y: number;
  needsDouble: boolean;
}

function DoubleClickRace({ config, onGameEnd }: Props) {
  const [target, setTarget] = useState<ClickTarget | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [hits, setHits] = useState(0);
  const [total, setTotal] = useState(0);
  const [lastMsg, setLastMsg] = useState("");
  const startRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);
  const totalRef = useRef(0);
  const livesRef = useRef(lives);
  scoreRef.current = score;
  hitsRef.current = hits;
  totalRef.current = total;
  livesRef.current = lives;
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endGame = useCallback(
    (completed: boolean) => {
      if (over) return;
      setOver(true);
      const acc =
        totalRef.current > 0 ? (hitsRef.current / totalRef.current) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, over],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function spawnTarget() {
    const needsDouble = Math.random() > 0.5;
    setTarget({
      id: `t-${Date.now()}`,
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 75,
      needsDouble,
    });
    setTotal((t) => t + 1);
  }

  const handleClick = useCallback(
    (t: ClickTarget) => {
      if (!started || over) return;
      clickCountRef.current += 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        const clicks = clickCountRef.current;
        clickCountRef.current = 0;
        const wasDouble = clicks >= 2;
        if ((wasDouble && t.needsDouble) || (!wasDouble && !t.needsDouble)) {
          setScore((s) => s + 100 * config.difficulty);
          setHits((h) => h + 1);
          setLastMsg(t.needsDouble ? "Double click!" : "Single click!");
        } else {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) endGame(false);
            return Math.max(0, nl);
          });
          setLastMsg(
            t.needsDouble ? "Needed double click!" : "Needed single click!",
          );
        }
        setTarget(null);
        setTimeout(() => {
          setLastMsg("");
          spawnTarget();
        }, 600);
      }, 350);
    },
    [started, over, config.difficulty, endGame],
  );

  function startGame() {
    startRef.current = Date.now();
    setStarted(true);
    startTimer();
    spawnTarget();
  }

  const pct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="double_click_race.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <span className="text-[#00f5ff] font-bold text-lg">
          {score.toLocaleString()}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{timeLeft}s</span>
        </div>
      </div>
      <div
        className="relative flex-1 rounded-xl border border-border/30 glass overflow-hidden"
        data-ocid="double_click_race.arena"
      >
        {!started ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
            <MousePointer className="h-12 w-12 text-[#00f5ff]" />
            <h2
              className="text-2xl font-black glow-cyan-text"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Double Click Race
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Blue targets need a SINGLE click. Orange targets need a DOUBLE
              click. Wrong click type loses a life.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={startGame}
              data-ocid="double_click_race.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        ) : (
          <>
            {lastMsg && (
              <div
                className={`absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold px-3 py-1 rounded-full z-20 ${
                  lastMsg.includes("Needed")
                    ? "bg-[#f43f5e]/20 text-[#f43f5e]"
                    : "bg-[#10b981]/20 text-[#10b981]"
                }`}
              >
                {lastMsg}
              </div>
            )}
            <AnimatePresence>
              {target && (
                <motion.button
                  type="button"
                  key={target.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => handleClick(target)}
                  className={`absolute rounded-full border-2 flex flex-col items-center justify-center gap-1 focus:outline-none ${target.needsDouble ? "border-[#f59e0b] bg-[#f59e0b]/15 text-[#f59e0b]" : "border-[#00f5ff] bg-[#00f5ff]/15 text-[#00f5ff]"}`}
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: "translate(-50%,-50%)",
                    width: 80,
                    height: 80,
                    boxShadow: target.needsDouble
                      ? "0 0 24px rgba(245,158,11,0.5)"
                      : "0 0 24px rgba(0,245,255,0.5)",
                  }}
                  data-ocid="double_click_race.target"
                >
                  <span className="text-[10px] font-bold uppercase">
                    {target.needsDouble ? "Double" : "Single"}
                  </span>
                  <MousePointer className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Game 4: Scroll Master ───────────────────────────────────────────────────

const SCROLL_PASSAGES = [
  {
    text: "The central processing unit (CPU) is the primary component of a computer that performs most of the processing inside a computer. The CPU is also referred to as the processor or microprocessor. The CPU is responsible for fetching, decoding, and executing instructions.",
    keywords: [
      "central processing unit",
      "processor",
      "microprocessor",
      "instructions",
    ],
  },
  {
    text: "Random Access Memory (RAM) is a type of computer memory that can be accessed randomly without accessing the preceding bytes. RAM is used to store working data and machine code currently in use. The more RAM a computer has, the faster it can run applications.",
    keywords: ["random access memory", "ram", "working data", "applications"],
  },
  {
    text: "An operating system (OS) is system software that manages computer hardware and software resources. Examples of operating systems include Windows, macOS, and Linux. The OS provides common services for computer programs and acts as an intermediary between user and hardware.",
    keywords: ["operating system", "windows", "macos", "linux"],
  },
];

function ScrollMaster({ config, onGameEnd }: Props) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [targetWord, setTargetWord] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [found, setFound] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"" | "correct" | "wrong">("");
  const startRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const foundRef = useRef(0);
  const totalRef = useRef(0);
  scoreRef.current = score;
  foundRef.current = found;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (over) return;
      setOver(true);
      const acc =
        totalRef.current > 0 ? (foundRef.current / totalRef.current) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, over],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function pickNextWord(pIdx: number) {
    const p = SCROLL_PASSAGES[pIdx % SCROLL_PASSAGES.length];
    const kw = p.keywords[Math.floor(Math.random() * p.keywords.length)];
    setTargetWord(kw);
    setTotal((t) => t + 1);
  }

  function startGame() {
    startRef.current = Date.now();
    setStarted(true);
    startTimer();
    pickNextWord(0);
  }

  function handleWordClick(word: string) {
    if (!started || over || !targetWord) return;
    const clicked = word.toLowerCase().replace(/[^a-z]/g, "");
    const target = targetWord.toLowerCase().replace(/[^a-z]/g, "");
    if (clicked === target || targetWord.toLowerCase().includes(clicked)) {
      setScore((s) => s + 150 * config.difficulty);
      setFound((f) => f + 1);
      setFlash("correct");
      setTimeout(() => {
        setFlash("");
        const next = passageIdx + 1;
        setPassageIdx(next);
        pickNextWord(next);
      }, 700);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return Math.max(0, nl);
      });
      setFlash("wrong");
      setTimeout(() => setFlash(""), 700);
    }
  }

  const passage = SCROLL_PASSAGES[passageIdx % SCROLL_PASSAGES.length];

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="scroll_master.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <span className="text-[#00f5ff] font-bold text-lg">
          {score.toLocaleString()}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{timeLeft}s</span>
      </div>
      {started && (
        <div
          className={`mb-2 text-center rounded-lg p-2 border text-sm font-bold ${
            flash === "correct"
              ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
              : flash === "wrong"
                ? "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"
                : "border-border/30 bg-card/30 text-[#00f5ff]"
          }`}
        >
          Find and click:{" "}
          <span className="uppercase tracking-wider">{targetWord}</span>
        </div>
      )}
      <div
        className="flex-1 glass rounded-xl border border-border/30 overflow-y-auto p-4"
        data-ocid="scroll_master.document"
      >
        {!started ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <h2
              className="text-2xl font-black glow-cyan-text"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Scroll Master
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Find and click the highlighted keyword in the document. Read
              carefully and scroll to find it.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={startGame}
              data-ocid="scroll_master.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        ) : (
          <p className="text-sm leading-loose text-foreground/80">
            {passage.text.split(" ").map((word, idx) => {
              const clean = word.toLowerCase().replace(/[^a-z]/g, "");
              const isTarget =
                targetWord.toLowerCase().includes(clean) && clean.length > 3;
              return (
                <span
                  key={`w-${idx}`}
                  role="button"
                  onClick={() => handleWordClick(word)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleWordClick(word);
                  }}
                  tabIndex={0}
                  className={`cursor-pointer rounded px-0.5 transition-colors ${
                    isTarget
                      ? "text-[#00f5ff] bg-[#00f5ff]/10 hover:bg-[#00f5ff]/25"
                      : "hover:bg-border/20"
                  }`}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Game 5: Context Menu Ninja ──────────────────────────────────────────────

interface ContextTask {
  item: string;
  instruction: string;
  correctOption: string;
  options: string[];
}

const CONTEXT_TASKS: ContextTask[] = [
  {
    item: "report.docx",
    instruction: "Create a copy of this file",
    correctOption: "Copy",
    options: ["Cut", "Copy", "Delete", "Rename"],
  },
  {
    item: "Desktop shortcut",
    instruction: "Remove this item permanently",
    correctOption: "Delete",
    options: ["Move to Trash", "Delete", "Cut", "Copy"],
  },
  {
    item: "folder.zip",
    instruction: "Get file properties and size",
    correctOption: "Properties",
    options: ["Open", "Share", "Properties", "Rename"],
  },
  {
    item: "image.png",
    instruction: "Open this file with Paint",
    correctOption: "Open with",
    options: ["Open", "Open with", "Print", "Share"],
  },
  {
    item: "old_file.txt",
    instruction: "Change this file's name",
    correctOption: "Rename",
    options: ["Edit", "Rename", "Copy", "Properties"],
  },
  {
    item: "selected text",
    instruction: "Move this text to a new location",
    correctOption: "Cut",
    options: ["Cut", "Copy", "Paste", "Delete"],
  },
  {
    item: "blank area",
    instruction: "Create a new folder here",
    correctOption: "New Folder",
    options: ["New Folder", "Refresh", "Paste", "Sort by"],
  },
];

function ContextMenuNinja({ config, onGameEnd }: Props) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [flash, setFlash] = useState<"" | "correct" | "wrong">("");
  const [showMenu, setShowMenu] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = totalAnswered;

  const endGame = useCallback(
    (completed: boolean) => {
      if (over) return;
      setOver(true);
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, over],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );
  const tasks = CONTEXT_TASKS;
  const task = tasks[taskIdx % tasks.length];

  function selectOption(opt: string) {
    if (!started || over || flash !== "") return;
    setTotalAnswered((t) => t + 1);
    setShowMenu(false);
    if (opt === task.correctOption) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
      setFlash("correct");
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return Math.max(0, nl);
      });
      setFlash("wrong");
    }
    setTimeout(() => {
      setFlash("");
      setTaskIdx((i) => i + 1);
    }, 900);
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="context_menu_ninja.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <span className="text-[#00f5ff] font-bold text-lg">
          {score.toLocaleString()}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{timeLeft}s</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {!started ? (
          <>
            <h2
              className="text-2xl font-black glow-cyan-text"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Context Menu Ninja
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Right-click the file and choose the correct menu option for each
              task shown.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startRef.current = Date.now();
                setStarted(true);
                startTimer();
              }}
              data-ocid="context_menu_ninja.start_button"
            >
              Start Game
            </GlowButton>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={taskIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className={`glass-card rounded-2xl p-8 max-w-sm w-full border-2 ${
                flash === "correct"
                  ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  : flash === "wrong"
                    ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                    : "border-border/30"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">
                Task
              </p>
              <p className="text-foreground font-semibold mb-3">
                {task.instruction}
              </p>
              <div
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowMenu(true);
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40 cursor-context-menu hover:bg-muted/50 transition-colors mb-3"
                data-ocid="context_menu_ninja.file_item"
              >
                <MousePointer className="h-5 w-5 text-[#00f5ff]" />
                <span className="font-mono text-sm text-foreground">
                  {task.item}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Right-click the item above
              </p>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-3 border border-border/40 rounded-lg overflow-hidden shadow-xl bg-card"
                    data-ocid="context_menu_ninja.menu"
                  >
                    {task.options.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => selectOption(opt)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#00f5ff]/10 hover:text-[#00f5ff] transition-colors border-b border-border/20 last:border-b-0"
                        data-ocid="context_menu_ninja.menu_option"
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── Root Export ─────────────────────────────────────────────────────────────

export default function MouseMaster({ config, onGameEnd }: Props) {
  switch (config.gameId) {
    case "drag-drop-maze":
      return <DragDropMaze config={config} onGameEnd={onGameEnd} />;
    case "double-click-race":
      return <DoubleClickRace config={config} onGameEnd={onGameEnd} />;
    case "scroll-master":
      return <ScrollMaster config={config} onGameEnd={onGameEnd} />;
    case "context-menu-ninja":
      return <ContextMenuNinja config={config} onGameEnd={onGameEnd} />;
    default:
      return <CursorPrecision config={config} onGameEnd={onGameEnd} />;
  }
}
