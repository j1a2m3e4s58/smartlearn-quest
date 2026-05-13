import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Z as Zap, m as motion, G as GlowButton } from "./index-YNz7x6b_.js";
import { b as buildResult, H as Heart } from "./GameEngine-C6-gOS55.js";
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
function TypingSpeed({ config, onGameEnd }) {
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
    const options = PASSAGES[config.difficulty];
    setPassage(options[Math.floor(Math.random() * options.length)]);
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
    if (val.length === passage.length) {
      endGame(true, val.length, passage.length, elapsed);
    }
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
                  children: "Typing Speed"
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
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: character spans in a fixed passage string, index is the stable identity
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: color, children: char }, `char-${i}`)
                );
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
export {
  TypingSpeed as default
};
