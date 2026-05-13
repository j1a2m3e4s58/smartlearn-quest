import { r as reactExports, j as jsxRuntimeExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-YNz7x6b_.js";
import { b as buildResult, u as useGameTimer, H as Heart } from "./GameEngine-C6-gOS55.js";
import { K as Keyboard } from "./keyboard-ClqhCTD4.js";
import { C as CircleX } from "./circle-x-CSy5lt7W.js";
import { C as CircleCheckBig } from "./circle-check-big-CtJI2EqC.js";
const SHORTCUTS = [
  {
    action: "Copy",
    keys: ["Control", "c"],
    display: "Ctrl + C",
    category: "Edit"
  },
  {
    action: "Paste",
    keys: ["Control", "v"],
    display: "Ctrl + V",
    category: "Edit"
  },
  {
    action: "Cut",
    keys: ["Control", "x"],
    display: "Ctrl + X",
    category: "Edit"
  },
  {
    action: "Undo",
    keys: ["Control", "z"],
    display: "Ctrl + Z",
    category: "Edit"
  },
  {
    action: "Save",
    keys: ["Control", "s"],
    display: "Ctrl + S",
    category: "File"
  },
  {
    action: "Select All",
    keys: ["Control", "a"],
    display: "Ctrl + A",
    category: "Edit"
  },
  {
    action: "Print",
    keys: ["Control", "p"],
    display: "Ctrl + P",
    category: "File"
  },
  {
    action: "New File",
    keys: ["Control", "n"],
    display: "Ctrl + N",
    category: "File"
  },
  {
    action: "Find",
    keys: ["Control", "f"],
    display: "Ctrl + F",
    category: "Navigation"
  },
  {
    action: "Bold",
    keys: ["Control", "b"],
    display: "Ctrl + B",
    category: "Format"
  },
  {
    action: "Italic",
    keys: ["Control", "i"],
    display: "Ctrl + I",
    category: "Format"
  },
  {
    action: "Underline",
    keys: ["Control", "u"],
    display: "Ctrl + U",
    category: "Format"
  },
  {
    action: "Redo",
    keys: ["Control", "y"],
    display: "Ctrl + Y",
    category: "Edit"
  },
  {
    action: "Close Tab",
    keys: ["Control", "w"],
    display: "Ctrl + W",
    category: "Navigation"
  },
  {
    action: "Open",
    keys: ["Control", "o"],
    display: "Ctrl + O",
    category: "File"
  }
];
function KeyboardNinja({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [shuffled, setShuffled] = reactExports.useState([]);
  const [flash, setFlash] = reactExports.useState("idle");
  const [showAnswer, setShowAnswer] = reactExports.useState(false);
  const [totalAnswers, setTotalAnswers] = reactExports.useState(0);
  const [correctAnswers, setCorrectAnswers] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correctAnswers);
  const totalRef = reactExports.useRef(totalAnswers);
  livesRef.current = lives;
  scoreRef.current = score;
  correctRef.current = correctAnswers;
  totalRef.current = totalAnswers;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const accuracy = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed)
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
    const arr = [...SHORTCUTS].sort(() => Math.random() - 0.5);
    setShuffled(arr);
  }, []);
  reactExports.useEffect(() => {
    if (!gameStarted || gameOverRef.current || flash !== "idle") return;
    function handleKey(e) {
      e.preventDefault();
      if (!shuffled.length) return;
      const current2 = shuffled[currentIdx % shuffled.length];
      const pressedKey = e.key.toLowerCase();
      const expectedKey = current2.keys[current2.keys.length - 1].toLowerCase();
      const needsCtrl = current2.keys.includes("Control");
      const needsShift = current2.keys.includes("Shift");
      const needsAlt = current2.keys.includes("Alt");
      const ctrlOk = needsCtrl ? e.ctrlKey || e.metaKey : true;
      const shiftOk = needsShift ? e.shiftKey : !e.shiftKey;
      const altOk = needsAlt ? e.altKey : !e.altKey;
      const isCorrect = ctrlOk && shiftOk && altOk && pressedKey === expectedKey;
      setTotalAnswers((t) => t + 1);
      if (isCorrect) {
        const levelMult = config.difficulty;
        setScore((s) => s + 150 * levelMult);
        setCorrectAnswers((c) => c + 1);
        setFlash("correct");
        setTimeout(() => {
          setFlash("idle");
          setCurrentIdx((i) => i + 1);
        }, 500);
      } else {
        setFlash("wrong");
        setShowAnswer(true);
        setLives((l) => {
          const newL = l - 1;
          if (newL <= 0) endGame(false);
          return newL;
        });
        setTimeout(() => {
          setFlash("idle");
          setShowAnswer(false);
          setCurrentIdx((i) => i + 1);
        }, 1e3);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameStarted, flash, currentIdx, shuffled, config.difficulty, endGame]);
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    startTimer();
  }
  const current = shuffled.length > 0 ? shuffled[currentIdx % shuffled.length] : null;
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "keyboard_ninja.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `heart-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Keyboard Ninja"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Press the correct keyboard shortcut shown on screen. Speed and accuracy both count." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "keyboard_ninja.start_button",
                  children: "Begin Training"
                }
              )
            ]
          }
        ) : current ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 60 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -60 },
            transition: { duration: 0.25 },
            className: `glass-card rounded-2xl p-10 text-center max-w-md w-full border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            "data-ocid": "keyboard_ninja.challenge_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: current.category
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-4xl font-black mt-2 mb-6",
                  style: {
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#00f5ff"
                  },
                  children: current.action
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Press the shortcut for:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3 flex-wrap", children: current.keys.map((k, ki) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: keyboard shortcut keys are stable positional items
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-3 py-1.5 rounded-lg border border-[#00f5ff]/50 text-[#00f5ff] font-mono text-lg font-bold bg-[#00f5ff]/5", children: k }),
                  ki < current.keys.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mx-1", children: "+" })
                ] }, `key-${ki}`)
              )) }),
              showAnswer && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: "mt-4 flex items-center justify-center gap-2 text-[#f43f5e]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                      "Answer: ",
                      current.display
                    ] })
                  ]
                }
              ),
              flash === "correct" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.5 },
                  animate: { opacity: 1, scale: 1 },
                  className: "mt-4 flex items-center justify-center gap-2 text-[#10b981]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold", children: [
                      "+",
                      150 * config.difficulty,
                      " pts"
                    ] })
                  ]
                }
              )
            ]
          },
          currentIdx
        ) }) : null })
      ]
    }
  );
}
export {
  KeyboardNinja as default
};
