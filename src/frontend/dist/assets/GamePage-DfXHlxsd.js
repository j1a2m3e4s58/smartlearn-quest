const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/MouseMaster-DDVB9gj_.js","assets/index-YNz7x6b_.js","assets/index-DjChCtfn.css","assets/GameEngine-C6-gOS55.js","assets/KeyboardNinja-BydCpJ23.js","assets/keyboard-ClqhCTD4.js","assets/circle-x-CSy5lt7W.js","assets/circle-check-big-CtJI2EqC.js","assets/TypingSpeed-Mg6Bmm2h.js","assets/CyberSafety-BWZeM9D4.js","assets/CodingBasics-BkZOBWli.js","assets/play-C4PekZaW.js","assets/rotate-ccw-CgMobSEI.js"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, d as useParams, u as useNavigate, r as reactExports, k as useMutateRecordScore, l as useMutateApplyProgressUpdate, j as jsxRuntimeExports, n as AnimatePresence, m as motion, G as GlowButton, _ as __vitePreload } from "./index-YNz7x6b_.js";
import { X } from "./x-BjS-gBGY.js";
import { P as Play } from "./play-C4PekZaW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode);
const MouseMaster = reactExports.lazy(() => __vitePreload(() => import("./MouseMaster-DDVB9gj_.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0));
const KeyboardNinja = reactExports.lazy(() => __vitePreload(() => import("./KeyboardNinja-BydCpJ23.js"), true ? __vite__mapDeps([4,1,2,3,5,6,7]) : void 0));
const TypingSpeed = reactExports.lazy(() => __vitePreload(() => import("./TypingSpeed-Mg6Bmm2h.js"), true ? __vite__mapDeps([8,1,2,3]) : void 0));
const CyberSafety = reactExports.lazy(() => __vitePreload(() => import("./CyberSafety-BWZeM9D4.js"), true ? __vite__mapDeps([9,1,2,3,7,6]) : void 0));
const CodingBasics = reactExports.lazy(() => __vitePreload(() => import("./CodingBasics-BkZOBWli.js"), true ? __vite__mapDeps([10,1,2,3,11,12,7]) : void 0));
const GAME_META = {
  "mouse-master": {
    name: "Mouse Master",
    component: MouseMaster
  },
  "keyboard-ninja": {
    name: "Keyboard Ninja",
    component: KeyboardNinja
  },
  "typing-speed": {
    name: "Typing Speed",
    component: TypingSpeed
  },
  "cyber-safety": {
    name: "Cyber Safety",
    component: CyberSafety
  },
  "coding-basics": {
    name: "Coding Basics",
    component: CodingBasics
  }
};
const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Advanced",
  3: "Expert"
};
function GamePage() {
  const { gameId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = reactExports.useState(1);
  const [isPaused, setIsPaused] = reactExports.useState(false);
  const [gameKey, setGameKey] = reactExports.useState(0);
  const [showDifficultyPicker, setShowDifficultyPicker] = reactExports.useState(false);
  const { mutateAsync: recordScore } = useMutateRecordScore();
  const { mutateAsync: applyProgress } = useMutateApplyProgressUpdate();
  const meta = GAME_META[gameId];
  if (!meta) {
    navigate({ to: "/world-map" });
    return null;
  }
  const config = {
    gameId,
    gameName: meta.name,
    difficulty,
    timeLimit: difficulty === 1 ? 60 : difficulty === 2 ? 90 : 120,
    livesCount: difficulty === 1 ? 5 : difficulty === 2 ? 3 : 3
  };
  async function handleGameEnd(result) {
    try {
      await recordScore({
        gameId: result.gameId,
        score: BigInt(result.score),
        accuracy: BigInt(Math.round(result.accuracy)),
        timeSpent: BigInt(result.timeSpent)
      });
      await applyProgress({
        xpEarned: BigInt(result.xpEarned),
        coinsEarned: BigInt(result.coinsEarned),
        playTimeSeconds: BigInt(result.timeSpent),
        dateString: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      });
    } catch {
    }
    navigate({
      to: "/results/$gameId",
      params: { gameId },
      state: { result }
    });
  }
  const GameComponent = meta.component;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "game.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud shrink-0 flex items-center justify-between gap-3 m-3 mb-0 rounded-xl neon-top-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/world-map" }),
              className: "flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth text-sm",
              "data-ocid": "game.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                " Quit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              className: "text-sm font-black uppercase tracking-widest glow-cyan-text",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: meta.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowDifficultyPicker((p) => !p),
                  className: "flex items-center gap-1 text-xs border border-[#7c3aed]/50 text-[#7c3aed] rounded-lg px-2 py-1 hover:bg-[#7c3aed]/10 transition-smooth",
                  "data-ocid": "game.difficulty_toggle",
                  children: [
                    DIFFICULTY_LABELS[difficulty],
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showDifficultyPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: -8 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -8 },
                  className: "absolute right-0 top-8 glass-card rounded-lg border border-border/30 z-50 overflow-hidden",
                  "data-ocid": "game.difficulty_menu",
                  children: [1, 2, 3].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setDifficulty(d);
                        setGameKey((k) => k + 1);
                        setShowDifficultyPicker(false);
                      },
                      className: `block w-full text-left px-4 py-2 text-xs hover:bg-[#7c3aed]/10 transition-smooth ${difficulty === d ? "text-[#7c3aed] font-bold" : "text-muted-foreground"}`,
                      "data-ocid": `game.difficulty_option.${d}`,
                      children: DIFFICULTY_LABELS[d]
                    },
                    d
                  ))
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsPaused((p) => !p),
                className: "p-1.5 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-border transition-smooth",
                "aria-label": isPaused ? "Resume game" : "Pause game",
                "data-ocid": "game.pause_button",
                children: isPaused ? /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative p-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            reactExports.Suspense,
            {
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full border-2 border-[#00f5ff] border-t-transparent animate-spin" }) }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                GameComponent,
                {
                  config,
                  onGameEnd: handleGameEnd
                },
                gameKey
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isPaused && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-40",
              "data-ocid": "game.pause_overlay",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center border border-[#7c3aed]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black glow-purple-text mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "PAUSED"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Game is paused" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    GlowButton,
                    {
                      variant: "primary",
                      size: "md",
                      onClick: () => setIsPaused(false),
                      "data-ocid": "game.resume_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
                        " Resume"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    GlowButton,
                    {
                      variant: "ghost",
                      size: "md",
                      onClick: () => navigate({ to: "/world-map" }),
                      "data-ocid": "game.quit_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                        " Quit to Map"
                      ]
                    }
                  )
                ] })
              ] })
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  GamePage as default
};
