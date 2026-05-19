import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, G as GlowButton, n as AnimatePresence, m as motion, A as ArrowLeft } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { K as Keyboard } from "./keyboard-d_ciUwhk.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { A as ArrowUp, a as ArrowDown } from "./arrow-up-DBX_ZmgS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
const PASSAGES = [
  "The computer is one of the most important inventions in human history. It processes information at incredible speeds and allows people to communicate across the world.",
  "A keyboard is an input device used to enter text and commands into a computer. Learning to type quickly and accurately is an important skill in the modern world.",
  "The internet connects billions of devices worldwide. It allows people to share information, communicate, and access resources from anywhere on the planet.",
  "Software consists of programs and operating systems that run on computer hardware. Without software, hardware cannot perform any useful tasks for the user."
];
function KeyboardWarrior({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [pIdx, setPIdx] = reactExports.useState(0);
  const [typed, setTyped] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState(0);
  const [wpm, setWpm] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const inputRef = reactExports.useRef(null);
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const errorsRef = reactExports.useRef(0);
  scoreRef.current = score;
  errorsRef.current = errors;
  const passage = PASSAGES[pIdx % PASSAGES.length];
  const endGame = reactExports.useCallback(
    (completed) => {
      if (over) return;
      setOver(true);
      const acc = Math.max(0, 100 - errorsRef.current / passage.length * 100);
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
    [config, onGameEnd, over, passage.length]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleInput(val) {
    if (!started || over) return;
    setTyped(val);
    const elapsed = (Date.now() - startRef.current) / 6e4;
    const wordsTyped = val.trim().split(" ").length;
    setWpm(elapsed > 0 ? Math.round(wordsTyped / elapsed) : 0);
    if (val.length > typed.length) {
      const idx = val.length - 1;
      if (val[idx] !== passage[idx]) setErrors((e) => e + 1);
    }
    if (val === passage) {
      setScore((s) => s + 300 * config.difficulty + wpm * 2);
      const next = pIdx + 1;
      setPIdx(next);
      setTyped("");
      if (next >= PASSAGES.length) endGame(true);
    }
  }
  function startGame() {
    startRef.current = Date.now();
    setStarted(true);
    startTimer();
    setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 50);
  }
  const pct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "keyboard_warrior.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-[#f59e0b]", children: [
            wpm,
            " WPM"
          ] }),
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
        !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-14 w-14 text-[#00f5ff]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-3xl font-black glow-cyan-text",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Keyboard Warrior"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center max-w-xs", children: "Type the displayed passage as fast and accurately as possible. WPM and accuracy determine your score." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: startGame,
              "data-ocid": "keyboard_warrior.start_button",
              children: "Begin Training"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-xl p-4 border border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm leading-relaxed font-mono",
              "data-ocid": "keyboard_warrior.passage",
              children: passage.split("").map((ch, i) => {
                let cls = "text-muted-foreground/50";
                if (i < typed.length)
                  cls = typed[i] === ch ? "text-[#10b981]" : "text-[#f43f5e] bg-[#f43f5e]/20";
                else if (i === typed.length)
                  cls = "text-foreground border-b-2 border-[#00f5ff]";
                return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: ch }, `c-${i}`);
              })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              value: typed,
              onChange: (e) => handleInput(e.target.value),
              className: "glass rounded-xl p-3 border border-[#00f5ff]/40 focus:border-[#00f5ff] outline-none text-sm font-mono bg-transparent text-foreground",
              placeholder: "Start typing here...",
              "data-ocid": "keyboard_warrior.input",
              spellCheck: false,
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Errors: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e] font-bold", children: errors })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Passage ",
              pIdx + 1,
              "/",
              PASSAGES.length
            ] })
          ] })
        ] })
      ]
    }
  );
}
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
    action: "Undo",
    keys: ["Control", "z"],
    display: "Ctrl + Z",
    category: "Edit"
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
  }
];
function KeyMastery({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [shuffled, setShuffled] = reactExports.useState([]);
  const [flash, setFlash] = reactExports.useState("idle");
  const [showAnswer, setShowAnswer] = reactExports.useState(false);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  livesRef.current = lives;
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
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
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
    setShuffled([...SHORTCUTS].sort(() => Math.random() - 0.5));
  }, []);
  reactExports.useEffect(() => {
    if (!started || gameOverRef.current || flash !== "idle") return;
    function handleKey(e) {
      e.preventDefault();
      if (!shuffled.length) return;
      const cur2 = shuffled[currentIdx % shuffled.length];
      const pk = e.key.toLowerCase();
      const ek = cur2.keys[cur2.keys.length - 1].toLowerCase();
      const ctrlOk = cur2.keys.includes("Control") ? e.ctrlKey || e.metaKey : true;
      const shiftOk = cur2.keys.includes("Shift") ? e.shiftKey : !e.shiftKey;
      const isCorrect = ctrlOk && shiftOk && pk === ek;
      setTotal((t) => t + 1);
      if (isCorrect) {
        setScore((s) => s + 150 * config.difficulty);
        setCorrect((c) => c + 1);
        setFlash("correct");
        setTimeout(() => {
          setFlash("idle");
          setCurrentIdx((i) => i + 1);
        }, 500);
      } else {
        setFlash("wrong");
        setShowAnswer(true);
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return Math.max(0, nl);
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
  }, [started, flash, currentIdx, shuffled, config.difficulty, endGame]);
  const cur = shuffled.length > 0 ? shuffled[currentIdx % shuffled.length] : null;
  const pct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "key_mastery.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-3xl font-black glow-cyan-text mb-3",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Key Mastery"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Press the correct keyboard shortcut for the displayed action. Speed and accuracy both count." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: () => {
                startRef.current = Date.now();
                gameOverRef.current = false;
                setStarted(true);
                startTimer();
              },
              "data-ocid": "key_mastery.start_button",
              children: "Begin Training"
            }
          )
        ] }) : cur ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 60 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -60 },
            transition: { duration: 0.25 },
            className: `glass-card rounded-2xl p-10 text-center max-w-md w-full border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            "data-ocid": "key_mastery.challenge_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: cur.category
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
                  children: cur.action
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Press the keyboard shortcut for this action:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3 flex-wrap", children: cur.keys.map((k, ki) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-3 py-1.5 rounded-lg border border-[#00f5ff]/50 text-[#00f5ff] font-mono text-lg font-bold bg-[#00f5ff]/5", children: k }),
                ki < cur.keys.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mx-1", children: "+" })
              ] }, `k-${ki}`)) }),
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
                      cur.display
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
const FUNCTION_KEYS = [
  { key: "F1", action: "Open Help", context: "Most applications" },
  { key: "F2", action: "Rename selected item", context: "File Explorer" },
  { key: "F3", action: "Search / Find", context: "Browser / Explorer" },
  { key: "F4", action: "Open address bar", context: "Browser" },
  { key: "F5", action: "Refresh / Reload", context: "Browser / Desktop" },
  { key: "F6", action: "Move focus to address bar", context: "Browser" },
  {
    key: "F7",
    action: "Spelling and Grammar check",
    context: "Microsoft Word"
  },
  { key: "F8", action: "Boot menu access", context: "System Startup" },
  { key: "F9", action: "Send/Receive emails", context: "Microsoft Outlook" },
  { key: "F10", action: "Activate menu bar", context: "Windows applications" },
  { key: "F11", action: "Toggle Full Screen", context: "Browser / Explorer" },
  { key: "F12", action: "Open Developer Tools", context: "Browser" }
];
function FunctionKeyBoss({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [pressedKey, setPressedKey] = reactExports.useState("");
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  livesRef.current = lives;
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const [tasks] = reactExports.useState(
    () => [...FUNCTION_KEYS].sort(() => Math.random() - 0.5)
  );
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
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
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
    if (!started || gameOverRef.current || flash !== "idle") return;
    function handleKey(e) {
      if (!e.key.startsWith("F") || e.key.length > 3) return;
      e.preventDefault();
      const task2 = tasks[taskIdx % tasks.length];
      setTotal((t) => t + 1);
      setPressedKey(e.key);
      if (e.key === task2.key) {
        setScore((s) => s + 200 * config.difficulty);
        setCorrect((c) => c + 1);
        setFlash("correct");
        setTimeout(() => {
          setFlash("idle");
          setPressedKey("");
          setTaskIdx((i) => i + 1);
        }, 700);
      } else {
        setFlash("wrong");
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return Math.max(0, nl);
        });
        setTimeout(() => {
          setFlash("idle");
          setPressedKey("");
          setTaskIdx((i) => i + 1);
        }, 1e3);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, flash, taskIdx, tasks, config.difficulty, endGame]);
  const task = tasks[taskIdx % tasks.length];
  const pct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "function_key_boss.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-3xl font-black glow-cyan-text mb-3",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Function Key Boss"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Read the action displayed and press the correct Function key (F1-F12) on your keyboard." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: () => {
                startRef.current = Date.now();
                gameOverRef.current = false;
                setStarted(true);
                startTimer();
              },
              "data-ocid": "function_key_boss.start_button",
              children: "Start Challenge"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            className: `glass-card rounded-2xl p-8 text-center max-w-md w-full border-2 ${flash === "correct" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: task.context }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black text-[#00f5ff] mb-4",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: task.action
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Press the correct Function key:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2", children: FUNCTION_KEYS.map((fk) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `px-3 py-2 rounded-lg border font-mono text-sm font-bold transition-all ${pressedKey === fk.key ? flash === "correct" ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]" : fk.key === task.key && flash === "wrong" ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-border/40 text-muted-foreground"}`,
                  children: fk.key
                },
                fk.key
              )) })
            ]
          },
          taskIdx
        ) }) })
      ]
    }
  );
}
const SYMBOL_CHALLENGES = [
  { symbol: "@", hint: "Shift + 2", keys: "Shift+2" },
  { symbol: "#", hint: "Shift + 3", keys: "Shift+3" },
  { symbol: "$", hint: "Shift + 4", keys: "Shift+4" },
  { symbol: "%", hint: "Shift + 5", keys: "Shift+5" },
  { symbol: "^", hint: "Shift + 6", keys: "Shift+6" },
  { symbol: "&", hint: "Shift + 7", keys: "Shift+7" },
  { symbol: "*", hint: "Shift + 8", keys: "Shift+8" },
  { symbol: "(", hint: "Shift + 9", keys: "Shift+9" },
  { symbol: ")", hint: "Shift + 0", keys: "Shift+0" },
  { symbol: "!", hint: "Shift + 1", keys: "Shift+1" },
  { symbol: "_", hint: "Shift + Minus", keys: "Shift+-" },
  { symbol: "+", hint: "Shift + Equals", keys: "Shift+=" },
  { symbol: "{", hint: "Shift + [", keys: "Shift+[" },
  { symbol: "}", hint: "Shift + ]", keys: "Shift+]" },
  { symbol: "|", hint: "Shift + Backslash", keys: "Shift+\\" },
  { symbol: ":", hint: "Shift + Semicolon", keys: "Shift+;" },
  { symbol: '"', hint: "Shift + Quote", keys: "Shift+'" },
  { symbol: "<", hint: "Shift + Comma", keys: "Shift+," },
  { symbol: ">", hint: "Shift + Period", keys: "Shift+." },
  { symbol: "?", hint: "Shift + Slash", keys: "Shift+/" }
];
function SymbolSprint({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [taskIdx, setTaskIdx] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const [tasks] = reactExports.useState(
    () => [...SYMBOL_CHALLENGES].sort(() => Math.random() - 0.5)
  );
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
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
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
    if (!started || gameOverRef.current || flash !== "idle") return;
    function handleKey(e) {
      const task2 = tasks[taskIdx % tasks.length];
      const typed = e.shiftKey ? e.key : e.key;
      setTotal((t) => t + 1);
      if (typed === task2.symbol) {
        setScore((s) => s + 180 * config.difficulty);
        setCorrect((c) => c + 1);
        setFlash("correct");
        setTimeout(() => {
          setFlash("idle");
          setTaskIdx((i) => i + 1);
        }, 500);
      } else if (e.key !== "Shift" && e.key !== "Control") {
        setFlash("wrong");
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return Math.max(0, nl);
        });
        setTimeout(() => {
          setFlash("idle");
          setTaskIdx((i) => i + 1);
        }, 800);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, flash, taskIdx, tasks, config.difficulty, endGame]);
  const task = tasks[taskIdx % tasks.length];
  const pct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "symbol_sprint.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center", children: !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-3xl font-black glow-cyan-text mb-3",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Symbol Sprint"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Type the symbol shown on screen using the correct Shift key combination. Master special characters!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: () => {
                startRef.current = Date.now();
                gameOverRef.current = false;
                setStarted(true);
                startTimer();
              },
              "data-ocid": "symbol_sprint.start_button",
              children: "Start Sprint"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
            className: `glass-card rounded-2xl p-10 text-center max-w-xs w-full border-2 ${flash === "correct" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs uppercase mb-2", children: "Type this symbol" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-8xl font-black text-[#00f5ff] mb-4",
                  style: { textShadow: "0 0 30px rgba(0,245,255,0.6)" },
                  children: task.symbol
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: task.hint }),
              flash === "correct" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-[#10b981] font-bold text-sm", children: [
                "+",
                180 * config.difficulty,
                " pts"
              ] })
            ]
          },
          taskIdx
        ) }) })
      ]
    }
  );
}
const GRID_COLS = 8;
const GRID_ROWS = 6;
function NavWarrior({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [over, setOver] = reactExports.useState(false);
  const [playerPos, setPlayerPos] = reactExports.useState({ col: 0, row: 0 });
  const [items, setItems] = reactExports.useState(
    () => Array.from({ length: 5 }).map(() => ({
      col: 1 + Math.floor(Math.random() * (GRID_COLS - 2)),
      row: 1 + Math.floor(Math.random() * (GRID_ROWS - 2)),
      collected: false
    }))
  );
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [moves, setMoves] = reactExports.useState(0);
  const startRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const gameOverRef = reactExports.useRef(false);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const collected = items.filter((i) => i.collected).length;
      const acc = collected / items.length * 100;
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
    [config, onGameEnd, items]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  reactExports.useEffect(() => {
    if (!started || over || gameOverRef.current) return;
    function handleKey(e) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      e.preventDefault();
      setMoves((m) => m + 1);
      setPlayerPos((prev) => {
        const next = { ...prev };
        if (e.key === "ArrowUp") next.row = Math.max(0, prev.row - 1);
        if (e.key === "ArrowDown")
          next.row = Math.min(GRID_ROWS - 1, prev.row + 1);
        if (e.key === "ArrowLeft") next.col = Math.max(0, prev.col - 1);
        if (e.key === "ArrowRight")
          next.col = Math.min(GRID_COLS - 1, prev.col + 1);
        setItems((prevItems) => {
          const updated = prevItems.map(
            (item) => !item.collected && item.col === next.col && item.row === next.row ? { ...item, collected: true } : item
          );
          const collected = updated.filter((i) => i.collected).length;
          setScore(
            (s) => s + (updated.filter((i) => i.collected).length - prevItems.filter((i) => i.collected).length) * 150 * config.difficulty
          );
          if (collected === updated.length) endGame(true);
          return updated;
        });
        return next;
      });
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, over, endGame, config.difficulty]);
  const pct = timeLeft / config.timeLimit * 100;
  const cellSize = 52;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "nav_warrior.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold text-lg", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Items: ",
            items.filter((i) => i.collected).length,
            "/",
            items.length
          ] }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: [
          !started ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-3xl font-black glow-cyan-text mb-3",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "Nav Warrior"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4 text-sm", children: "Use the Arrow Keys to move your character through the grid and collect all items before time runs out." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded border border-border/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded border border-border/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded border border-border/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded border border-border/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "primary",
                size: "lg",
                onClick: () => {
                  startRef.current = Date.now();
                  gameOverRef.current = false;
                  setStarted(true);
                  startTimer();
                },
                "data-ocid": "nav_warrior.start_button",
                children: "Start Navigation"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "relative",
              style: {
                width: GRID_COLS * cellSize,
                height: GRID_ROWS * cellSize
              },
              children: Array.from({ length: GRID_ROWS }).map(
                (_, row) => Array.from({ length: GRID_COLS }).map((__, col) => {
                  const isPlayer = playerPos.col === col && playerPos.row === row;
                  const item = items.find(
                    (i) => i.col === col && i.row === row && !i.collected
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `absolute border border-border/20 flex items-center justify-center ${isPlayer ? "bg-[#00f5ff]/20 border-[#00f5ff]/60" : item ? "bg-[#f59e0b]/10" : "bg-card/20"}`,
                      style: {
                        left: col * cellSize,
                        top: row * cellSize,
                        width: cellSize,
                        height: cellSize
                      },
                      children: [
                        isPlayer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#00f5ff] shadow-[0_0_12px_rgba(0,245,255,0.8)]" }),
                        item && !isPlayer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded bg-[#f59e0b]" })
                      ]
                    },
                    `${col}-${row}`
                  );
                })
              )
            }
          ),
          started && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Moves: ",
              moves
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "to move" })
          ] })
        ] })
      ]
    }
  );
}
function KeyboardNinja({ config, onGameEnd }) {
  switch (config.gameId) {
    case "keyboard-warrior":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(KeyboardWarrior, { config, onGameEnd });
    case "function-key-boss":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FunctionKeyBoss, { config, onGameEnd });
    case "symbol-sprint":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SymbolSprint, { config, onGameEnd });
    case "nav-warrior":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(NavWarrior, { config, onGameEnd });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(KeyMastery, { config, onGameEnd });
  }
}
export {
  KeyboardNinja as default
};
