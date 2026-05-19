import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, Z as Zap, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
];
const Crosshair = createLucideIcon("crosshair", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12.586 12.586 19 19", key: "ea5xo7" }],
  [
    "path",
    {
      d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",
      key: "277e5u"
    }
  ]
];
const MousePointer = createLucideIcon("mouse-pointer", __iconNode);
function CursorPrecision({ config, onGameEnd }) {
  const [targets, setTargets] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [combo, setCombo] = reactExports.useState(0);
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [totalSpawned, setTotalSpawned] = reactExports.useState(0);
  const [totalHit, setTotalHit] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(false);
  const startRef = reactExports.useRef(Date.now());
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  const comboRef = reactExports.useRef(combo);
  const spawnedRef = reactExports.useRef(0);
  const hitRef = reactExports.useRef(0);
  livesRef.current = lives;
  scoreRef.current = score;
  comboRef.current = combo;
  spawnedRef.current = totalSpawned;
  hitRef.current = totalHit;
  const DIFF = {
    1: { maxT: 1, lifeMs: 1600, spawnMs: 850 },
    2: { maxT: 2, lifeMs: 1200, spawnMs: 700 },
    3: { maxT: 3, lifeMs: 900, spawnMs: 550 }
  };
  const endGame = reactExports.useCallback(
    (completed) => {
      if (over) return;
      setOver(true);
      const acc = spawnedRef.current > 0 ? hitRef.current / spawnedRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, over]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
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
              isDecoy
            }
          ];
        }
        return alive;
      });
    }, d.spawnMs);
    return () => clearInterval(iv);
  }, [started, over, config.difficulty, endGame, DIFF]);
  function hitTarget(t) {
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
  const pct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "mouse_master.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-lg font-bold transition-all ${flash ? "scale-125 text-[#f59e0b]" : ""}`,
                children: score.toLocaleString()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            combo >= 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[#f59e0b] text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
              "x",
              (1 + Math.floor(combo / 5) * 0.5).toFixed(1)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${pct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative flex-1 rounded-xl border border-border/30 glass overflow-hidden cursor-crosshair",
            "data-ocid": "mouse_master.arena",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              !started && !over && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/80 backdrop-blur-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { className: "h-12 w-12 text-[#00f5ff] mb-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        className: "text-3xl font-black glow-cyan-text mb-3",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "Cursor Precision"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-1", children: "Click cyan targets before they vanish. Avoid red decoys." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      GlowButton,
                      {
                        variant: "primary",
                        size: "lg",
                        onClick: () => {
                          startRef.current = Date.now();
                          setStarted(true);
                          startTimer();
                        },
                        "data-ocid": "mouse_master.start_button",
                        children: "Start Game"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: targets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  type: "button",
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0, opacity: 0 },
                  transition: { duration: 0.15 },
                  onClick: () => hitTarget(t),
                  className: `absolute w-14 h-14 rounded-full border-2 focus:outline-none flex items-center justify-center ${t.isDecoy ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-[#00f5ff] bg-[#00f5ff]/10"}`,
                  style: {
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: "translate(-50%,-50%)",
                    boxShadow: t.isDecoy ? "0 0 20px rgba(244,63,94,0.5)" : "0 0 20px rgba(0,245,255,0.5)"
                  },
                  "data-ocid": t.isDecoy ? "mouse_master.decoy_target" : "mouse_master.target",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Crosshair,
                    {
                      className: `h-5 w-5 ${t.isDecoy ? "text-[#f43f5e]" : "text-[#00f5ff]"}`
                    }
                  )
                },
                t.id
              )) }),
              combo >= 3 && started && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20, scale: 0.5 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0 },
                  className: "absolute top-4 left-1/2 -translate-x-1/2 text-[#f59e0b] font-black text-xl pointer-events-none",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    combo,
                    "x COMBO!"
                  ]
                },
                combo
              )
            ]
          }
        )
      ]
    }
  );
}
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
  [5, 6]
];
const FOLDERS = [
  { id: "docs", label: "Documents", col: 7, row: 1 },
  { id: "images", label: "Images", col: 7, row: 4 },
  { id: "videos", label: "Videos", col: 7, row: 7 }
];
const ITEMS = [
  { id: "i1", label: "report.docx", folder: "docs", col: 0, row: 0 },
  { id: "i2", label: "photo.jpg", folder: "images", col: 0, row: 3 },
  { id: "i3", label: "movie.mp4", folder: "videos", col: 0, row: 6 },
  { id: "i4", label: "notes.txt", folder: "docs", col: 0, row: 1 }
];
function DragDropMaze({ config, onGameEnd }) {
  const [items, setItems] = reactExports.useState(
    ITEMS.map((i) => ({ ...i, placed: false }))
  );
  const [dragging, setDragging] = reactExports.useState(null);
  const [positions, setPositions] = reactExports.useState(
    () => Object.fromEntries(ITEMS.map((i) => [i.id, [i.col, i.row]]))
  );
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState("");
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (over) return;
      setOver(true);
      const placed = items.filter((i) => i.placed).length;
      const acc = placed / ITEMS.length * 100;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, over, items]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function isObstacle(col, row) {
    return OBSTACLES.some(([c, r]) => c === col && r === row);
  }
  function tryDrop(itemId, col, row) {
    const folder = FOLDERS.find((f) => f.col === col && f.row === row);
    const item = items.find((i) => i.id === itemId);
    if (!item || item.placed) return;
    if (folder) {
      if (folder.id === item.folder) {
        setItems(
          (prev) => prev.map((i) => i.id === itemId ? { ...i, placed: true } : i)
        );
        setScore((s) => s + 200 * config.difficulty);
        setMsg("Correct folder!");
        setTimeout(() => setMsg(""), 1200);
        const allPlaced = items.filter((i) => i.id !== itemId).every((i) => i.placed);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "drag_drop_maze.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold text-lg", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        msg && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `text-center text-sm font-bold mb-1 ${msg.startsWith("C") ? "text-[#10b981]" : "text-[#f43f5e]"}`,
            children: msg
          }
        ),
        !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-2xl font-black glow-cyan-text",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Drag Drop Maze"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center max-w-xs", children: "Drag files through the maze grid to their correct destination folders. Avoid obstacles." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: () => {
                startRef.current = Date.now();
                setStarted(true);
                startTimer();
              },
              "data-ocid": "drag_drop_maze.start_button",
              children: "Start Game"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative",
            style: {
              width: MAZE_GRID * cellSize,
              height: MAZE_GRID * cellSize
            },
            children: [
              Array.from({ length: MAZE_GRID }).map(
                (_, row) => Array.from({ length: MAZE_GRID }).map((__, col) => {
                  const isObs = isObstacle(col, row);
                  const folder = FOLDERS.find(
                    (f) => f.col === col && f.row === row
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      onDragOver: (e) => {
                        e.preventDefault();
                      },
                      onDrop: () => {
                        if (dragging) tryDrop(dragging, col, row);
                      },
                      className: `absolute border border-border/20 flex items-center justify-center text-[9px] font-bold ${isObs ? "bg-[#f43f5e]/20 border-[#f43f5e]/40" : folder ? "bg-[#00f5ff]/10 border-[#00f5ff]/50" : "bg-card/30"}`,
                      style: {
                        left: col * cellSize,
                        top: row * cellSize,
                        width: cellSize,
                        height: cellSize
                      },
                      children: [
                        isObs && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 bg-[#f43f5e]/60 rounded-sm" }),
                        folder && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] text-center leading-tight px-1", children: folder.label })
                      ]
                    },
                    `${col}-${row}`
                  );
                })
              ),
              items.filter((i) => !i.placed).map((item) => {
                const [col, row] = positions[item.id];
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    draggable: true,
                    onDragStart: () => setDragging(item.id),
                    className: "absolute flex items-center justify-center text-[9px] font-bold text-[#00f5ff] bg-[#00f5ff]/20 border border-[#00f5ff]/60 rounded cursor-grab",
                    style: {
                      left: col * cellSize + 3,
                      top: row * cellSize + 3,
                      width: cellSize - 6,
                      height: cellSize - 6,
                      zIndex: 10
                    },
                    "data-ocid": "drag_drop_maze.item",
                    children: item.label
                  },
                  item.id
                );
              })
            ]
          }
        ) })
      ]
    }
  );
}
function DoubleClickRace({ config, onGameEnd }) {
  const [target, setTarget] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [hits, setHits] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [lastMsg, setLastMsg] = reactExports.useState("");
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const hitsRef = reactExports.useRef(0);
  const totalRef = reactExports.useRef(0);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  hitsRef.current = hits;
  totalRef.current = total;
  livesRef.current = lives;
  const clickCountRef = reactExports.useRef(0);
  const clickTimerRef = reactExports.useRef(null);
  const endGame = reactExports.useCallback(
    (completed) => {
      if (over) return;
      setOver(true);
      const acc = totalRef.current > 0 ? hitsRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, over]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function spawnTarget() {
    const needsDouble = Math.random() > 0.5;
    setTarget({
      id: `t-${Date.now()}`,
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 75,
      needsDouble
    });
    setTotal((t) => t + 1);
  }
  const handleClick = reactExports.useCallback(
    (t) => {
      if (!started || over) return;
      clickCountRef.current += 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        const clicks = clickCountRef.current;
        clickCountRef.current = 0;
        const wasDouble = clicks >= 2;
        if (wasDouble && t.needsDouble || !wasDouble && !t.needsDouble) {
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
            t.needsDouble ? "Needed double click!" : "Needed single click!"
          );
        }
        setTarget(null);
        setTimeout(() => {
          setLastMsg("");
          spawnTarget();
        }, 600);
      }, 350);
    },
    [started, over, config.difficulty, endGame]
  );
  function startGame() {
    startRef.current = Date.now();
    setStarted(true);
    startTimer();
    spawnTarget();
  }
  const pct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "double_click_race.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold text-lg", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${pct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative flex-1 rounded-xl border border-border/30 glass overflow-hidden",
            "data-ocid": "double_click_race.arena",
            children: !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-12 w-12 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Double Click Race"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center max-w-xs", children: "Blue targets need a SINGLE click. Orange targets need a DOUBLE click. Wrong click type loses a life." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: startGame,
                  "data-ocid": "double_click_race.start_button",
                  children: "Start Game"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              lastMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold px-3 py-1 rounded-full z-20 ${lastMsg.includes("Needed") ? "bg-[#f43f5e]/20 text-[#f43f5e]" : "bg-[#10b981]/20 text-[#10b981]"}`,
                  children: lastMsg
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: target && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  exit: { scale: 0 },
                  onClick: () => handleClick(target),
                  className: `absolute rounded-full border-2 flex flex-col items-center justify-center gap-1 focus:outline-none ${target.needsDouble ? "border-[#f59e0b] bg-[#f59e0b]/15 text-[#f59e0b]" : "border-[#00f5ff] bg-[#00f5ff]/15 text-[#00f5ff]"}`,
                  style: {
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: "translate(-50%,-50%)",
                    width: 80,
                    height: 80,
                    boxShadow: target.needsDouble ? "0 0 24px rgba(245,158,11,0.5)" : "0 0 24px rgba(0,245,255,0.5)"
                  },
                  "data-ocid": "double_click_race.target",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase", children: target.needsDouble ? "Double" : "Single" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-5 w-5" })
                  ]
                },
                target.id
              ) })
            ] })
          }
        )
      ]
    }
  );
}
const SCROLL_PASSAGES = [
  {
    text: "The central processing unit (CPU) is the primary component of a computer that performs most of the processing inside a computer. The CPU is also referred to as the processor or microprocessor. The CPU is responsible for fetching, decoding, and executing instructions.",
    keywords: [
      "central processing unit",
      "processor",
      "microprocessor",
      "instructions"
    ]
  },
  {
    text: "Random Access Memory (RAM) is a type of computer memory that can be accessed randomly without accessing the preceding bytes. RAM is used to store working data and machine code currently in use. The more RAM a computer has, the faster it can run applications.",
    keywords: ["random access memory", "ram", "working data", "applications"]
  },
  {
    text: "An operating system (OS) is system software that manages computer hardware and software resources. Examples of operating systems include Windows, macOS, and Linux. The OS provides common services for computer programs and acts as an intermediary between user and hardware.",
    keywords: ["operating system", "windows", "macos", "linux"]
  }
];
function ScrollMaster({ config, onGameEnd }) {
  const [passageIdx, setPassageIdx] = reactExports.useState(0);
  const [targetWord, setTargetWord] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [found, setFound] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("");
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const foundRef = reactExports.useRef(0);
  const totalRef = reactExports.useRef(0);
  scoreRef.current = score;
  foundRef.current = found;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (over) return;
      setOver(true);
      const acc = totalRef.current > 0 ? foundRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, over]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function pickNextWord(pIdx) {
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
  function handleWordClick(word) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "scroll_master.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold text-lg", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        started && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `mb-2 text-center rounded-lg p-2 border text-sm font-bold ${flash === "correct" ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : flash === "wrong" ? "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]" : "border-border/30 bg-card/30 text-[#00f5ff]"}`,
            children: [
              "Find and click:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-wider", children: targetWord })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 glass rounded-xl border border-border/30 overflow-y-auto p-4",
            "data-ocid": "scroll_master.document",
            children: !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Scroll Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center max-w-xs", children: "Find and click the highlighted keyword in the document. Read carefully and scroll to find it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: startGame,
                  "data-ocid": "scroll_master.start_button",
                  children: "Start Game"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-loose text-foreground/80", children: passage.text.split(" ").map((word, idx) => {
              const clean = word.toLowerCase().replace(/[^a-z]/g, "");
              const isTarget = targetWord.toLowerCase().includes(clean) && clean.length > 3;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  role: "button",
                  onClick: () => handleWordClick(word),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleWordClick(word);
                  },
                  tabIndex: 0,
                  className: `cursor-pointer rounded px-0.5 transition-colors ${isTarget ? "text-[#00f5ff] bg-[#00f5ff]/10 hover:bg-[#00f5ff]/25" : "hover:bg-border/20"}`,
                  children: [
                    word,
                    " "
                  ]
                },
                `w-${idx}`
              );
            }) })
          }
        )
      ]
    }
  );
}
const CONTEXT_TASKS = [
  {
    item: "report.docx",
    instruction: "Create a copy of this file",
    correctOption: "Copy",
    options: ["Cut", "Copy", "Delete", "Rename"]
  },
  {
    item: "Desktop shortcut",
    instruction: "Remove this item permanently",
    correctOption: "Delete",
    options: ["Move to Trash", "Delete", "Cut", "Copy"]
  },
  {
    item: "folder.zip",
    instruction: "Get file properties and size",
    correctOption: "Properties",
    options: ["Open", "Share", "Properties", "Rename"]
  },
  {
    item: "image.png",
    instruction: "Open this file with Paint",
    correctOption: "Open with",
    options: ["Open", "Open with", "Print", "Share"]
  },
  {
    item: "old_file.txt",
    instruction: "Change this file's name",
    correctOption: "Rename",
    options: ["Edit", "Rename", "Copy", "Properties"]
  },
  {
    item: "selected text",
    instruction: "Move this text to a new location",
    correctOption: "Cut",
    options: ["Cut", "Copy", "Paste", "Delete"]
  },
  {
    item: "blank area",
    instruction: "Create a new folder here",
    correctOption: "New Folder",
    options: ["New Folder", "Refresh", "Paste", "Sort by"]
  }
];
function ContextMenuNinja({ config, onGameEnd }) {
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [flash, setFlash] = reactExports.useState("");
  const [showMenu, setShowMenu] = reactExports.useState(false);
  const [correct, setCorrect] = reactExports.useState(0);
  const [totalAnswered, setTotalAnswered] = reactExports.useState(0);
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const correctRef = reactExports.useRef(0);
  const totalRef = reactExports.useRef(0);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = totalAnswered;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (over) return;
      setOver(true);
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, over]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const tasks = CONTEXT_TASKS;
  const task = tasks[taskIdx % tasks.length];
  function selectOption(opt) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none",
      "data-ocid": "context_menu_ninja.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold text-lg", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-2xl font-black glow-cyan-text",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Context Menu Ninja"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center max-w-xs", children: "Right-click the file and choose the correct menu option for each task shown." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: () => {
                startRef.current = Date.now();
                setStarted(true);
                startTimer();
              },
              "data-ocid": "context_menu_ninja.start_button",
              children: "Start Game"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            className: `glass-card rounded-2xl p-8 max-w-sm w-full border-2 ${flash === "correct" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-widest", children: "Task" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-3", children: task.instruction }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onContextMenu: (e) => {
                    e.preventDefault();
                    setShowMenu(true);
                  },
                  className: "flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40 cursor-context-menu hover:bg-muted/50 transition-colors mb-3",
                  "data-ocid": "context_menu_ninja.file_item",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-5 w-5 text-[#00f5ff]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: task.item })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Right-click the item above" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.9 },
                  className: "mt-3 border border-border/40 rounded-lg overflow-hidden shadow-xl bg-card",
                  "data-ocid": "context_menu_ninja.menu",
                  children: task.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => selectOption(opt),
                      className: "w-full text-left px-4 py-2 text-sm hover:bg-[#00f5ff]/10 hover:text-[#00f5ff] transition-colors border-b border-border/20 last:border-b-0",
                      "data-ocid": "context_menu_ninja.menu_option",
                      children: opt
                    },
                    opt
                  ))
                }
              ) })
            ]
          },
          taskIdx
        ) }) })
      ]
    }
  );
}
function MouseMaster({ config, onGameEnd }) {
  switch (config.gameId) {
    case "drag-drop-maze":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DragDropMaze, { config, onGameEnd });
    case "double-click-race":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DoubleClickRace, { config, onGameEnd });
    case "scroll-master":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollMaster, { config, onGameEnd });
    case "context-menu-ninja":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenuNinja, { config, onGameEnd });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CursorPrecision, { config, onGameEnd });
  }
}
export {
  MouseMaster as default
};
