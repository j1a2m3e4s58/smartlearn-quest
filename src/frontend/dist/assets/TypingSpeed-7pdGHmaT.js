import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, Z as Zap, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
];
const Type = createLucideIcon("type", __iconNode);
const PASSAGES = {
  1: [
    "The cat sat on the mat and looked around at the room.",
    "A dog runs fast in the park every single morning.",
    "Blue birds fly high in the bright clear sky above."
  ],
  2: [
    "Information technology connects people across the world through fast networks.",
    "Computer systems process data and store information for future use every day.",
    "Digital devices help students learn and explore new knowledge at their own pace."
  ],
  3: [
    "The central processing unit executes instructions and manages data flow throughout the system.",
    "Encryption algorithms protect sensitive information from unauthorized access across networks.",
    "Machine learning models analyze patterns in large datasets to make intelligent predictions."
  ]
};
const CODE_SNIPPETS = {
  1: [
    "x = 10; y = 20; print(x + y)",
    "if (score > 100) { grade = 'A'; }",
    "for i in range(5): print(i)"
  ],
  2: [
    "function add(a, b) { return a + b; }",
    "const list = [1, 2, 3]; list.forEach(n => console.log(n));",
    "while (count < 10) { count++; total += count; }"
  ],
  3: [
    "class Node { constructor(val) { this.val = val; this.next = null; } }",
    "def binary_search(arr, target): lo, hi = 0, len(arr)-1",
    "SELECT name, score FROM students WHERE grade = 'A' ORDER BY score DESC;"
  ]
};
const MARATHON_WORDS = {
  1: [
    "cat",
    "dog",
    "run",
    "fun",
    "sun",
    "top",
    "cup",
    "big",
    "red",
    "hot",
    "map",
    "sit",
    "fly",
    "bed",
    "car"
  ],
  2: [
    "apple",
    "cloud",
    "brain",
    "swift",
    "track",
    "delta",
    "prime",
    "flame",
    "graft",
    "quilt",
    "stone",
    "cramp",
    "blend",
    "frost",
    "pivot"
  ],
  3: [
    "algorithm",
    "encryption",
    "processor",
    "bandwidth",
    "interface",
    "debugging",
    "recursion",
    "database",
    "framework",
    "protocol",
    "compiler",
    "variable",
    "software",
    "hardware",
    "function"
  ]
};
const HOME_ROW_WORDS = {
  1: [
    "all",
    "fall",
    "hall",
    "dash",
    "gash",
    "glad",
    "flag",
    "half",
    "lass",
    "flask"
  ],
  2: [
    "glass",
    "flags",
    "clads",
    "salad",
    "halfs",
    "flads",
    "klash",
    "shall",
    "falls",
    "hags"
  ],
  3: [
    "flashy",
    "classy",
    "gladly",
    "flasks",
    "jacked",
    "khakis",
    "safely",
    "halved",
    "sashed",
    "flaked"
  ]
};
function SpeedTypistGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [passage, setPassage] = reactExports.useState("");
  const [typedText, setTypedText] = reactExports.useState("");
  const [timeLeft, setTimeLeft] = reactExports.useState(config.timeLimit);
  const [wpm, setWpm] = reactExports.useState(0);
  const [accuracy, setAccuracy] = reactExports.useState(100);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const textareaRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(0);
  const timerRef = reactExports.useRef(null);
  const gameOverRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (completed, typedLen, passageLen, elapsed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const correctChars = Array.from({
        length: Math.min(typedLen, passageLen)
      }).filter((_, i) => typedText[i] === passage[i]).length;
      const acc = typedLen > 0 ? correctChars / typedLen * 100 : 0;
      const minutes = elapsed / 60;
      const calcWpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
      const score = calcWpm * 10 + Math.floor(acc);
      onGameEnd(
        buildResult(config, score, acc, Math.round(elapsed), completed)
      );
    },
    [config, onGameEnd, typedText, passage]
  );
  reactExports.useEffect(() => {
    const opts = PASSAGES[config.difficulty];
    setPassage(opts[Math.floor(Math.random() * opts.length)]);
  }, [config.difficulty]);
  reactExports.useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          const elapsed = (Date.now() - startTimeRef.current) / 1e3;
          endGame(false, typedText.length, passage.length, elapsed);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame, typedText.length, passage.length]);
  function handleInput(e) {
    if (!gameStarted || gameOver) return;
    const val = e.target.value;
    if (val.length > passage.length) return;
    setTypedText(val);
    const elapsed = (Date.now() - startTimeRef.current) / 1e3;
    const correctChars = Array.from(val).filter(
      (ch, i) => ch === passage[i]
    ).length;
    const acc = val.length > 0 ? correctChars / val.length * 100 : 100;
    const minutes = elapsed / 60;
    const calcWpm = minutes > 0 && elapsed > 1 ? Math.round(correctChars / 5 / minutes) : 0;
    setWpm(calcWpm);
    setAccuracy(Math.round(acc));
    if (val.length === passage.length)
      endGame(true, val.length, passage.length, elapsed);
  }
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    setTypedText("");
    setTimeLeft(config.timeLimit);
    setTimeout(() => {
      var _a;
      return (_a = textareaRef.current) == null ? void 0 : _a.focus();
    }, 50);
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "typing_speed.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b]", children: wpm }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1", children: "WPM" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-[#00f5ff]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              accuracy,
              "% accuracy"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 text-[#f43f5e] fill-[#f43f5e]" }),
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
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Speed Typist"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4 text-sm", children: "Type the passage as fast and accurately as possible. Your WPM score determines your final rank." }),
              passage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6 border border-border/30 rounded-lg p-3 text-left leading-relaxed", children: passage }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "typing_speed.start_button",
                  children: "Start Typing"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "glass-card rounded-xl p-5 font-mono text-base leading-8 min-h-[100px] select-none",
              "data-ocid": "typing_speed.passage",
              children: Array.from(passage).map((char, i) => {
                let color = "text-muted-foreground";
                if (i < typedText.length) {
                  color = typedText[i] === char ? "text-[#00f5ff]" : "text-[#f43f5e] underline";
                } else if (i === typedText.length) {
                  color = "text-foreground bg-[#00f5ff]/20 rounded";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: color, children: char }, `char-${i}`);
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: textareaRef,
              value: typedText,
              onChange: handleInput,
              className: "opacity-0 absolute w-0 h-0 pointer-events-none",
              "aria-label": "Type the passage here",
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: false,
              "data-ocid": "typing_speed.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = textareaRef.current) == null ? void 0 : _a.focus();
              },
              className: "glass-card rounded-xl p-4 text-center text-muted-foreground text-sm hover:text-foreground transition-smooth border-2 border-dashed border-border/30 hover:border-[#00f5ff]/40",
              "data-ocid": "typing_speed.focus_area",
              children: "Click here then start typing"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-200",
                style: {
                  width: `${typedText.length / passage.length * 100}%`
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              typedText.length,
              "/",
              passage.length
            ] })
          ] })
        ] })
      ]
    }
  );
}
function TypingAccuracyGame({ config, onGameEnd }) {
  const [passage] = reactExports.useState(() => {
    const opts = PASSAGES[config.difficulty];
    return opts[Math.floor(Math.random() * opts.length)];
  });
  const [typed, setTyped] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [perfect, setPerfect] = reactExports.useState(false);
  const [timeLeft, setTimeLeft] = reactExports.useState(config.timeLimit);
  const textareaRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(0);
  const timerRef = reactExports.useRef(null);
  const gameOverRef = reactExports.useRef(false);
  const errorsRef = reactExports.useRef(errors);
  errorsRef.current = errors;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const acc = passage.length > 0 ? Math.max(
        0,
        (passage.length - errorsRef.current) / passage.length * 100
      ) : 0;
      const elapsed = (Date.now() - startTimeRef.current) / 1e3;
      const bonus = errorsRef.current === 0 ? 500 : 0;
      const score = Math.floor(acc * 2) + bonus;
      onGameEnd(
        buildResult(config, score, acc, Math.round(elapsed), completed)
      );
    },
    [config, onGameEnd, passage]
  );
  reactExports.useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame]);
  function handleInput(e) {
    if (!gameStarted || gameOver) return;
    const val = e.target.value;
    if (val.length > typed.length) {
      const newChar = val[val.length - 1];
      const expectedChar = passage[typed.length];
      if (newChar !== expectedChar) {
        setErrors((er) => er + 1);
        return;
      }
    }
    if (val.length > passage.length) return;
    setTyped(val);
    if (val.length === passage.length) {
      if (errorsRef.current === 0) setPerfect(true);
      (Date.now() - startTimeRef.current) / 1e3;
      setTimeout(() => endGame(true), 400);
      return;
    }
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  const typingProgressPct = typed.length / passage.length * 100;
  const errBarW = Math.min(100, errors * 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "typing_accuracy.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4 text-[#10b981]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-[#10b981]", children: [
              "Errors: ",
              errors
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: perfect && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold text-xs animate-pulse", children: "PERFECT!" }) }),
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
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Typing Accuracy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4 text-sm", children: "Every mistake is blocked — you cannot advance until you type the correct character. Achieve 0 errors for a perfect bonus!" }),
              passage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6 border border-border/30 rounded-lg p-3 text-left leading-relaxed", children: passage }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    setTimeout(() => {
                      var _a;
                      return (_a = textareaRef.current) == null ? void 0 : _a.focus();
                    }, 50);
                  },
                  "data-ocid": "typing_accuracy.start_button",
                  children: "Begin Accuracy Test"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-5 font-mono text-base leading-8 select-none", children: Array.from(passage).map((char, i) => {
            let cls = "text-muted-foreground";
            if (i < typed.length) cls = "text-[#10b981]";
            else if (i === typed.length)
              cls = "text-foreground bg-[#00f5ff]/20 rounded";
            return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: char }, `c-${i}`);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: textareaRef,
              value: typed,
              onChange: handleInput,
              className: "opacity-0 absolute w-0 h-0 pointer-events-none",
              "aria-label": "Type accurately",
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = textareaRef.current) == null ? void 0 : _a.focus();
              },
              className: "glass-card rounded-xl p-4 text-center text-sm text-muted-foreground hover:text-foreground border-2 border-dashed border-border/30 transition-smooth",
              "data-ocid": "typing_accuracy.focus_area",
              children: "Click here and type — errors are blocked, not allowed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-[#10b981] transition-all duration-200",
                  style: { width: `${typingProgressPct}%` }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Error rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-[#f43f5e] transition-all duration-200",
                  style: { width: `${errBarW}%` }
                }
              ) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CodeTypistGame({ config, onGameEnd }) {
  const [snippet] = reactExports.useState(() => {
    const opts = CODE_SNIPPETS[config.difficulty];
    return opts[Math.floor(Math.random() * opts.length)];
  });
  const [typed, setTyped] = reactExports.useState("");
  const [wpm, setWpm] = reactExports.useState(0);
  const [errors, setErrors] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(config.timeLimit);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const textareaRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(0);
  const timerRef = reactExports.useRef(null);
  const gameOverRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const correctChars = Array.from(typed).filter(
        (ch, i) => ch === snippet[i]
      ).length;
      const acc = typed.length > 0 ? correctChars / typed.length * 100 : 0;
      const elapsed = (Date.now() - startTimeRef.current) / 1e3;
      const minutes = elapsed / 60;
      const calcWpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
      const score = calcWpm * 12 + Math.floor(acc) - errors * 5;
      onGameEnd(
        buildResult(
          config,
          Math.max(0, score),
          acc,
          Math.round(elapsed),
          completed
        )
      );
    },
    [config, onGameEnd, typed, snippet, errors]
  );
  reactExports.useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame]);
  function handleInput(e) {
    if (!gameStarted || gameOver) return;
    const val = e.target.value;
    if (val.length > snippet.length) return;
    if (val.length > typed.length) {
      const newChar = val[val.length - 1];
      if (newChar !== snippet[val.length - 1]) setErrors((er) => er + 1);
    }
    setTyped(val);
    const elapsed = (Date.now() - startTimeRef.current) / 1e3;
    const correctChars = Array.from(val).filter(
      (ch, i) => ch === snippet[i]
    ).length;
    const minutes = elapsed / 60;
    if (minutes > 0 && elapsed > 1)
      setWpm(Math.round(correctChars / 5 / minutes));
    if (val.length === snippet.length) endGame(true);
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "code_typist.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4 text-[#7c3aed]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-[#7c3aed]", children: [
              wpm,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "WPM" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Errors: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e] font-bold", children: errors })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Code Typist"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4 text-sm", children: "Type code snippets including special characters. Errors deduct points. High WPM with accuracy wins!" }),
              snippet && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6 border border-[#7c3aed]/30 rounded-lg p-3 text-left leading-relaxed font-mono", children: snippet }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    setTimeout(() => {
                      var _a;
                      return (_a = textareaRef.current) == null ? void 0 : _a.focus();
                    }, 50);
                  },
                  "data-ocid": "code_typist.start_button",
                  children: "Start Coding"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-5 font-mono text-sm leading-8 select-none border border-[#7c3aed]/20", children: Array.from(snippet).map((char, i) => {
            let cls = "text-muted-foreground";
            if (i < typed.length) {
              cls = typed[i] === char ? "text-[#7c3aed]" : "text-[#f43f5e] underline";
            } else if (i === typed.length)
              cls = "text-foreground bg-[#7c3aed]/20 rounded";
            return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: char }, `s-${i}`);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: textareaRef,
              value: typed,
              onChange: handleInput,
              className: "opacity-0 absolute w-0 h-0 pointer-events-none",
              "aria-label": "Type the code here",
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = textareaRef.current) == null ? void 0 : _a.focus();
              },
              className: "glass-card rounded-xl p-4 text-center text-sm text-muted-foreground hover:text-foreground border-2 border-dashed border-[#7c3aed]/30 transition-smooth",
              "data-ocid": "code_typist.focus_area",
              children: "Click here then type the code above"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-[#7c3aed] transition-all",
                style: { width: `${typed.length / snippet.length * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              typed.length,
              "/",
              snippet.length
            ] })
          ] })
        ] })
      ]
    }
  );
}
let wordIdCounter = 0;
function TypingMarathonGame({ config, onGameEnd }) {
  const words = MARATHON_WORDS[config.difficulty];
  const [fallingWords, setFallingWords] = reactExports.useState([]);
  const [currentInput, setCurrentInput] = reactExports.useState("");
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [typedCount, setTypedCount] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const gameOverRef = reactExports.useRef(false);
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  const typedRef = reactExports.useRef(typedCount);
  livesRef.current = lives;
  scoreRef.current = score;
  typedRef.current = typedCount;
  const startTimeRef = reactExports.useRef(Date.now());
  const baseSpeed = config.difficulty === 1 ? 0.4 : config.difficulty === 2 ? 0.6 : 0.9;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = typedRef.current > 0 ? Math.min(
        100,
        typedRef.current / (typedRef.current + (config.livesCount - livesRef.current)) * 100
      ) : 0;
      onGameEnd(buildResult(config, scoreRef.current, acc, elapsed, completed));
    },
    [config, onGameEnd]
  );
  reactExports.useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(
      () => {
        const word = words[Math.floor(Math.random() * words.length)];
        const speedMult = 1 + Math.random() * 0.5;
        setFallingWords((prev) => [
          ...prev,
          {
            id: wordIdCounter++,
            word,
            x: Math.floor(Math.random() * 85),
            y: 0,
            speed: baseSpeed * speedMult
          }
        ]);
      },
      config.difficulty === 1 ? 2200 : config.difficulty === 2 ? 1700 : 1300
    );
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, words, baseSpeed, config.difficulty]);
  reactExports.useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      setFallingWords((prev) => {
        const next = [];
        let livesLost = 0;
        for (const w of prev) {
          const newY = w.y + w.speed;
          if (newY >= 100) {
            livesLost++;
          } else {
            next.push({ ...w, y: newY });
          }
        }
        if (livesLost > 0) {
          setLives((l) => {
            const nl = l - livesLost;
            if (nl <= 0) {
              setTimeout(() => endGame(false), 300);
              return 0;
            }
            return nl;
          });
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, endGame]);
  function handleTyping(e) {
    if (gameOver) return;
    const val = e.target.value;
    setCurrentInput(val);
    const match = fallingWords.find((w) => w.word === val.trim());
    if (match) {
      setFallingWords((prev) => prev.filter((w) => w.id !== match.id));
      setScore((s) => s + 100 + Math.floor((100 - match.y) * 2));
      setTypedCount((t) => t + 1);
      setCurrentInput("");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "typing_marathon.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#f59e0b]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Typed: ",
            typedCount
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Typing Marathon"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Words fall from the top. Type them before they reach the bottom. Speed increases over time. Lose a life for every missed word!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    setTimeout(() => {
                      var _a;
                      return (_a = inputRef.current) == null ? void 0 : _a.focus();
                    }, 100);
                  },
                  "data-ocid": "typing_marathon.start_button",
                  children: "Start Marathon"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 glass-card rounded-xl overflow-hidden border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: fallingWords.map((w) => {
              const wordStyle = { left: `${w.x}%`, top: `${w.y}%` };
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: `absolute font-mono text-sm font-bold px-2 py-1 rounded border ${currentInput.length > 0 && w.word.startsWith(currentInput) ? "border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/15" : "border-border/40 text-foreground bg-background/50"}`,
                  style: wordStyle,
                  children: w.word
                },
                w.id
              );
            }) }),
            fallingWords.length === 0 && gameStarted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-muted-foreground text-sm", children: "Words incoming..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: currentInput,
              onChange: handleTyping,
              placeholder: "Type words here...",
              className: "glass-card rounded-xl px-4 py-3 font-mono text-foreground border border-border/40 focus:border-[#00f5ff]/60 outline-none text-center",
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: false,
              "data-ocid": "typing_marathon.input"
            }
          )
        ] })
      ]
    }
  );
}
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"]
];
const HOME_ROW_KEYS = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
function BlindTypeGame({ config, onGameEnd }) {
  const wordList = HOME_ROW_WORDS[config.difficulty];
  const [words] = reactExports.useState(() => [...wordList].sort(() => Math.random() - 0.5));
  const [wordIdx, setWordIdx] = reactExports.useState(0);
  const [showWord, setShowWord] = reactExports.useState(true);
  const [typed, setTyped] = reactExports.useState("");
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;
  const startTimeRef = reactExports.useRef(Date.now());
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = words.length > 0 ? wordIdx / words.length * 100 : 0;
      onGameEnd(buildResult(config, scoreRef.current, acc, elapsed, completed));
    },
    [config, onGameEnd, words.length, wordIdx]
  );
  function startNextWord() {
    setShowWord(true);
    setTyped("");
    setFeedback(null);
    setTimeout(() => {
      var _a;
      setShowWord(false);
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 1500);
  }
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    setShowWord(true);
    setTimeout(() => {
      var _a;
      setShowWord(false);
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 1800);
  }
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      const word = words[wordIdx];
      if (typed.toLowerCase() === word.toLowerCase()) {
        setScore((s) => s + 200);
        setFeedback("correct");
      } else {
        const newL = livesRef.current - 1;
        setLives(newL);
        setFeedback("wrong");
        if (newL <= 0) {
          setTimeout(() => endGame(false), 1e3);
          return;
        }
      }
      setTimeout(() => {
        const nextIdx = wordIdx + 1;
        if (nextIdx >= words.length) endGame(true);
        else {
          setWordIdx(nextIdx);
          startNextWord();
        }
      }, 800);
    }
  }
  const currentWord = words[wordIdx];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "blind_type.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#f59e0b]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            wordIdx + 1,
            "/",
            words.length
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Blind Type"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "A word appears briefly then hides. Type it from memory using the home row. Press Enter to submit. No key highlights — pure muscle memory!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "blind_type.start_button",
                  children: "Begin Blind Test"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl px-12 py-8 border border-border/40 min-w-[240px] text-center", children: [
              showWord ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  className: "text-4xl font-black font-mono tracking-widest",
                  style: { color: "#00f5ff" },
                  children: currentWord.toUpperCase()
                },
                "show"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "text-4xl font-mono tracking-widest text-muted-foreground/20",
                  children: "????"
                },
                "hide"
              ),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: `text-sm font-bold mt-2 ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                  children: feedback === "correct" ? "Correct!" : `Wrong! It was: ${currentWord.toUpperCase()}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                type: "text",
                value: typed,
                onChange: (e) => setTyped(e.target.value),
                onKeyPress: handleKeyPress,
                placeholder: "Type then press Enter",
                className: "glass-card rounded-xl px-6 py-3 font-mono text-xl text-center text-foreground border border-border/40 focus:border-[#00f5ff]/60 outline-none w-64",
                autoComplete: "off",
                autoCorrect: "off",
                autoCapitalize: "off",
                spellCheck: false,
                disabled: showWord,
                "data-ocid": "blind_type.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-1", children: KEYBOARD_ROWS.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: row.map((key) => {
            const isHome = HOME_ROW_KEYS.includes(key);
            const keyStyle = isHome ? { borderColor: "rgba(124,58,237,0.5)", color: "#7c3aed" } : {
              borderColor: "rgba(100,100,120,0.3)",
              color: "#6b7280"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-7 h-7 rounded border flex items-center justify-center text-xs font-mono font-bold",
                style: keyStyle,
                children: key
              },
              key
            );
          }) }, `row-${ri}`)) })
        ] })
      ]
    }
  );
}
function TypingSpeed({ config, onGameEnd }) {
  if (config.gameId === "typing-accuracy")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TypingAccuracyGame, { config, onGameEnd });
  if (config.gameId === "code-typist")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CodeTypistGame, { config, onGameEnd });
  if (config.gameId === "typing-marathon")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TypingMarathonGame, { config, onGameEnd });
  if (config.gameId === "blind-type")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BlindTypeGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedTypistGame, { config, onGameEnd });
}
export {
  TypingSpeed as default
};
