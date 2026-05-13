import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Z as Zap, m as motion, G as GlowButton, n as AnimatePresence } from "./index-YNz7x6b_.js";
import { b as buildResult, u as useGameTimer, H as Heart } from "./GameEngine-C6-gOS55.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
];
const Crosshair = createLucideIcon("crosshair", __iconNode);
const DIFF = {
  1: { maxTargets: 1, lifeMs: 1500, spawnIntervalMs: 800, moveAfterMs: null },
  2: { maxTargets: 2, lifeMs: 1200, spawnIntervalMs: 700, moveAfterMs: 500 },
  3: { maxTargets: 3, lifeMs: 900, spawnIntervalMs: 600, moveAfterMs: null }
};
function MouseMaster({ config, onGameEnd }) {
  const [targets, setTargets] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [combo, setCombo] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [totalSpawned, setTotalSpawned] = reactExports.useState(0);
  const [totalHit, setTotalHit] = reactExports.useState(0);
  const [comboFlash, setComboFlash] = reactExports.useState(false);
  const arenaRef = reactExports.useRef(null);
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  const comboRef = reactExports.useRef(combo);
  const totalSpawnedRef = reactExports.useRef(totalSpawned);
  const totalHitRef = reactExports.useRef(totalHit);
  livesRef.current = lives;
  scoreRef.current = score;
  comboRef.current = combo;
  totalSpawnedRef.current = totalSpawned;
  totalHitRef.current = totalHit;
  const startTimeRef = reactExports.useRef(Date.now());
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const accuracy = totalSpawnedRef.current > 0 ? totalHitRef.current / totalSpawnedRef.current * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
    if (!gameStarted || gameOver) return;
    const diff = DIFF[config.difficulty];
    const interval = setInterval(() => {
      setTargets((prev) => {
        const now = Date.now();
        const expired = prev.filter((t) => now - t.spawnTime >= t.lifeMs);
        for (const target of expired) {
          if (!target.isDecoy) {
            setLives((l) => {
              const newL = l - 1;
              if (newL <= 0) {
                endGame(false);
                return 0;
              }
              return newL;
            });
            setCombo(0);
          }
        }
        const alive = prev.filter((t) => now - t.spawnTime < t.lifeMs);
        if (alive.length < diff.maxTargets) {
          const isDecoy = config.difficulty === 3 && Math.random() < 0.3;
          const newTarget = {
            id: `t-${Date.now()}-${Math.random()}`,
            x: 5 + Math.random() * 80,
            y: 5 + Math.random() * 80,
            spawnTime: now,
            lifeMs: diff.lifeMs,
            isDecoy
          };
          setTotalSpawned((s) => s + 1);
          return [...alive, newTarget];
        }
        return alive;
      });
    }, diff.spawnIntervalMs);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, config.difficulty, endGame]);
  function handleTargetClick(target) {
    if (!gameStarted || gameOver) return;
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    if (target.isDecoy) {
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) endGame(false);
        return newL;
      });
      setCombo(0);
      return;
    }
    const newCombo = comboRef.current + 1;
    const multiplier = 1 + Math.floor(newCombo / 5) * 0.5;
    const pts = Math.floor(100 * multiplier);
    setScore((s) => s + pts);
    setCombo(newCombo);
    setTotalHit((h) => h + 1);
    setComboFlash(true);
    setTimeout(() => setComboFlash(false), 300);
  }
  function handleStart() {
    startTimeRef.current = Date.now();
    setGameStarted(true);
    startTimer();
  }
  const progressPct = timeLeft / config.timeLimit * 100;
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
                className: `text-lg font-bold transition-all ${comboFlash ? "scale-125 text-[#f59e0b]" : ""}`,
                children: score.toLocaleString()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 transition-all ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `heart-${i}`
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
                style: { width: `${progressPct}%` }
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
            ref: arenaRef,
            className: "relative flex-1 rounded-xl border border-border/30 glass overflow-hidden cursor-crosshair",
            style: { minHeight: 320 },
            "data-ocid": "mouse_master.arena",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              !gameStarted && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/80 backdrop-blur-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "Mouse Master"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        className: "text-3xl font-black glow-cyan-text mb-4",
                        style: { fontFamily: "'Orbitron', sans-serif" },
                        children: "Click Targets!"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-1", children: "Click cyan targets before they vanish." }),
                    config.difficulty === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f43f5e] text-xs mb-4", children: "Avoid red decoy targets!" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      GlowButton,
                      {
                        variant: "primary",
                        size: "lg",
                        onClick: handleStart,
                        "data-ocid": "mouse_master.start_button",
                        children: "Start Game"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: targets.map((target) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TargetCircle,
                {
                  target,
                  onClick: () => handleTargetClick(target)
                },
                target.id
              )) }),
              combo >= 3 && gameStarted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
function TargetCircle({
  target,
  onClick
}) {
  const progress = Math.max(
    0,
    1 - (Date.now() - target.spawnTime) / target.lifeMs
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      transition: { duration: 0.2 },
      onClick,
      className: `absolute w-14 h-14 rounded-full border-2 focus:outline-none ${target.isDecoy ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-[#00f5ff] bg-[#00f5ff]/10"}`,
      style: {
        left: `${target.x}%`,
        top: `${target.y}%`,
        transform: "translate(-50%, -50%)",
        boxShadow: target.isDecoy ? "0 0 20px rgba(244,63,94,0.5)" : "0 0 20px rgba(0,245,255,0.5)"
      },
      "data-ocid": target.isDecoy ? "mouse_master.decoy_target" : "mouse_master.target",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute inset-0 rounded-full transition-transform ${target.isDecoy ? "bg-[#f43f5e]/20" : "bg-[#00f5ff]/20"}`,
            style: { transform: `scale(${progress})`, transformOrigin: "center" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Crosshair,
          {
            className: `h-5 w-5 ${target.isDecoy ? "text-[#f43f5e]" : "text-[#00f5ff]"}`
          }
        ) })
      ]
    }
  );
}
export {
  MouseMaster as default
};
