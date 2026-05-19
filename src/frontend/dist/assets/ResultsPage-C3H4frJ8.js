import { f as useParams, u as useNavigate, q as useRouterState, r as reactExports, s as useMyPersonalBest, l as Star, Z as Zap, j as jsxRuntimeExports, n as AnimatePresence, m as motion, G as GlowButton, C as ChevronRight } from "./index-bdQaMNSA.js";
import { T as Target } from "./target-BArPR6vI.js";
import { C as Clock } from "./clock-CsgfeGb3.js";
import { C as Coins } from "./coins-B9mN5ZCZ.js";
import { T as Trophy } from "./trophy-DDFgY-Cu.js";
import { R as RotateCcw } from "./rotate-ccw-D8U3V_vs.js";
import { M as Map } from "./map-CgAdZPgE.js";
const PARTICLE_COLORS = ["#00f5ff", "#7c3aed", "#f59e0b", "#10b981", "#f43f5e"];
function useCountUp(target, durationMs = 1500) {
  const [value, setValue] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const steps = 60;
    const stepTime = durationMs / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setValue(Math.round(current / steps * target));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, durationMs]);
  return value;
}
const GAME_NAMES = {
  "mouse-master": "Mouse Master",
  "keyboard-ninja": "Keyboard Ninja",
  "typing-speed": "Typing Speed",
  "cyber-safety": "Cyber Safety",
  "coding-basics": "Coding Basics"
};
const HUB_MAP = {
  "mouse-master": "mouseMaster",
  "keyboard-ninja": "keyboardNinja",
  "typing-speed": "typingSpeed",
  "cyber-safety": "cyberSafety",
  "coding-basics": "codingBasics"
};
function ResultsPage() {
  var _a;
  const { gameId } = useParams({ strict: false });
  const navigate = useNavigate();
  const routerState = useRouterState();
  const stateResult = (_a = routerState.location.state) == null ? void 0 : _a.result;
  const result = stateResult ?? null;
  const [particles, setParticles] = reactExports.useState([]);
  const spawned = reactExports.useRef(false);
  const { data: personalBest } = useMyPersonalBest(gameId);
  const prevBest = personalBest ? Number(personalBest.score ?? 0) : 0;
  const isNewBest = result ? result.score > prevBest : false;
  const animatedScore = useCountUp((result == null ? void 0 : result.score) ?? 0);
  const animatedXP = useCountUp((result == null ? void 0 : result.xpEarned) ?? 0);
  const animatedCoins = useCountUp((result == null ? void 0 : result.coinsEarned) ?? 0);
  reactExports.useEffect(() => {
    if (!result) {
      navigate({ to: "/world-map" });
      return;
    }
    if (result.completed && !spawned.current) {
      spawned.current = true;
      const ps = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        angle: -90 + (Math.random() - 0.5) * 120,
        speed: 200 + Math.random() * 300,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        size: 4 + Math.random() * 6
      }));
      setParticles(ps);
      setTimeout(() => setParticles([]), 2500);
    }
  }, [result, navigate]);
  if (!result) return null;
  const gameName = GAME_NAMES[gameId] ?? gameId;
  const isSuccess = result.completed;
  const stats = [
    {
      icon: Target,
      label: "Score",
      value: animatedScore.toLocaleString(),
      color: "#00f5ff"
    },
    {
      icon: Star,
      label: "Accuracy",
      value: `${result.accuracy}%`,
      color: "#f59e0b"
    },
    {
      icon: Clock,
      label: "Time",
      value: `${result.timeSpent}s`,
      color: "#7c3aed"
    },
    {
      icon: Zap,
      label: "XP Earned",
      value: `+${animatedXP}`,
      color: "#10b981"
    },
    {
      icon: Coins,
      label: "Coins",
      value: `+${animatedCoins}`,
      color: "#f59e0b"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${isSuccess ? "bg-background" : "bg-[oklch(0.07_0.02_20)]"}`,
      "data-ocid": "results.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: isSuccess ? "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 70%)" : "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(244,63,94,0.1) 0%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: particles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { x: `${p.x}vw`, y: "80vh", opacity: 1, scale: 1 },
            animate: {
              x: `${p.x + Math.cos(p.angle * Math.PI / 180) * p.speed * 0.03}vw`,
              y: `${80 - Math.sin((90 - p.angle) * Math.PI / 180) * 60}vh`,
              opacity: 0,
              scale: 0
            },
            transition: {
              duration: 1.5 + Math.random() * 0.5,
              ease: "easeOut"
            },
            className: "absolute pointer-events-none rounded-full",
            style: {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`
            }
          },
          p.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -30 },
              animate: { opacity: 1, y: 0 },
              transition: { type: "spring", stiffness: 200, damping: 20 },
              className: "text-center mb-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: isSuccess ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {},
                    transition: { delay: 0.3, duration: 0.6 },
                    className: "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4",
                    style: {
                      background: isSuccess ? "rgba(0,245,255,0.1)" : "rgba(244,63,94,0.1)",
                      border: `2px solid ${isSuccess ? "#00f5ff" : "#f43f5e"}`,
                      boxShadow: isSuccess ? "0 0 30px rgba(0,245,255,0.4)" : "0 0 30px rgba(244,63,94,0.4)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Trophy,
                      {
                        className: `h-10 w-10 ${isSuccess ? "text-[#00f5ff]" : "text-[#f43f5e]"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: `text-3xl font-black uppercase tracking-widest mb-1 ${isSuccess ? "glow-cyan-text" : "text-[#f43f5e]"}`,
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: isSuccess ? "Mission Complete" : "Mission Failed"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: gameName }),
                !isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f43f5e]/70 text-xs mt-1", children: "Better luck next time, commander" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isNewBest && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              className: "mb-4 text-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block px-4 py-2 rounded-full border-2 border-[#f59e0b] text-[#f59e0b] font-black uppercase tracking-widest text-xs glow-gold",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  "data-ocid": "results.new_best_banner",
                  children: "New Personal Best!"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              className: "glass-card rounded-2xl p-6 mb-6 border border-border/30",
              "data-ocid": "results.stats_panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3", children: stats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.3 + i * 0.08 },
                  className: "text-center",
                  "data-ocid": `results.stat.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      stat.icon,
                      {
                        className: "h-5 w-5 mx-auto mb-1",
                        style: { color: stat.color }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xl font-black tabular-nums",
                        style: {
                          color: stat.color,
                          fontFamily: "'Orbitron', sans-serif"
                        },
                        children: stat.value
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: stat.label })
                  ]
                },
                stat.label
              )) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.6 },
              className: "flex flex-col sm:flex-row gap-3",
              "data-ocid": "results.actions",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  GlowButton,
                  {
                    variant: "secondary",
                    size: "md",
                    onClick: () => navigate({ to: "/game/$gameId", params: { gameId } }),
                    className: "flex-1",
                    "data-ocid": "results.replay_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
                      " Play Again"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "md",
                    onClick: () => navigate({ to: "/world-map" }),
                    className: "flex-1",
                    "data-ocid": "results.world_map_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-4 w-4" }),
                      " World Map"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  GlowButton,
                  {
                    variant: "ghost",
                    size: "md",
                    onClick: () => navigate({
                      to: "/hub/$hubId",
                      params: { hubId: HUB_MAP[gameId] ?? "mouseMaster" }
                    }),
                    className: "flex-1",
                    "data-ocid": "results.next_mission_button",
                    children: [
                      "Next Mission ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  ResultsPage as default
};
