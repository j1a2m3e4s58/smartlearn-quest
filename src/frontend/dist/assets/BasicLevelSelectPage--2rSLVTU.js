import { u as useNavigate, j as jsxRuntimeExports, P as ParticleBackground, m as motion, d as Lock } from "./index-bdQaMNSA.js";
import { B as BASIC_LEVELS } from "./basicLevels-CzhGsAtZ.js";
const PLAYER_XP = 500;
const XP_THRESHOLDS = [0, 200, 600, 1200, 2200, 3500, 5200, 7500, 10500];
function getUnlockState(index) {
  return PLAYER_XP >= XP_THRESHOLDS[index] ? "unlocked" : "locked";
}
function getProgress(index) {
  if (index === 0) return 35;
  if (index === 1) return 12;
  return 0;
}
function WorldNode({ level, index, state, progress, onClick }) {
  const isLocked = state === "locked";
  const circumference = 2 * Math.PI * 52;
  const strokeDash = progress / 100 * circumference;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.75 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1]
      },
      whileHover: !isLocked ? { scale: 1.07, y: -4 } : {},
      whileTap: !isLocked ? { scale: 0.96 } : {},
      onClick: !isLocked ? onClick : void 0,
      "data-ocid": `basic-level.node.${index + 1}`,
      className: [
        "flex flex-col items-center gap-3 select-none",
        isLocked ? "cursor-not-allowed" : "cursor-pointer group"
      ].join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { width: 120, height: 120 }, children: [
          !isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              style: {
                background: `radial-gradient(circle, ${level.theme.glow} 0%, transparent 70%)`,
                filter: "blur(8px)",
                transform: "scale(1.3)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "absolute inset-0 -rotate-90",
              width: "120",
              height: "120",
              viewBox: "0 0 120 120",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "60",
                    cy: "60",
                    r: "52",
                    fill: "none",
                    stroke: "oklch(0.25 0.03 260)",
                    strokeWidth: "4"
                  }
                ),
                !isLocked && progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "60",
                    cy: "60",
                    r: "52",
                    fill: "none",
                    stroke: level.theme.primary,
                    strokeWidth: "4",
                    strokeLinecap: "round",
                    strokeDasharray: `${strokeDash} ${circumference - strokeDash}`
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-2 rounded-full flex flex-col items-center justify-center",
              style: {
                background: isLocked ? "oklch(0.12 0.02 260)" : "radial-gradient(circle at 35% 35%, oklch(0.18 0.04 260), oklch(0.10 0.03 260))",
                border: `2px solid ${isLocked ? "oklch(0.25 0.03 260)" : level.theme.primary}`,
                boxShadow: !isLocked ? `0 0 20px ${level.theme.glow}` : "none"
              },
              children: isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-7 w-7 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-2xl font-black leading-none",
                    style: {
                      fontFamily: "'Orbitron', sans-serif",
                      color: level.theme.primary,
                      textShadow: `0 0 12px ${level.theme.glow}`
                    },
                    children: index + 1
                  }
                ),
                progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5", children: [
                  progress,
                  "%"
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-bold tracking-widest uppercase mb-0.5",
              style: {
                fontFamily: "'Orbitron', sans-serif",
                color: isLocked ? "oklch(0.4 0.03 260)" : level.theme.primary
              },
              children: level.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground max-w-[110px] leading-snug line-clamp-2", children: isLocked ? "Earn more XP to unlock" : level.subtitle.split("—")[0].trim() })
        ] })
      ]
    }
  );
}
function BasicLevelSelectPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative min-h-screen bg-background overflow-hidden",
      "data-ocid": "basic-level-select.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleBackground, { count: 60 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-15",
            style: {
              background: "radial-gradient(ellipse, rgba(0,245,255,0.18) 0%, transparent 65%)"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.55 },
              className: "text-center mb-14",
              "data-ocid": "basic-level-select.header",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "h-3.5 w-3.5 text-primary",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 0 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold tracking-widest uppercase text-primary", children: "GES Basic 1 – 9 Curriculum" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-gradient-cyan",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Choose Your World"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground max-w-lg mx-auto", children: "Select a Basic level to begin your adventure. Each world contains hundreds of missions, games, and discoveries across all subjects." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-3 gap-x-6 gap-y-12 justify-items-center max-w-3xl mx-auto",
              "data-ocid": "basic-level-select.grid",
              children: BASIC_LEVELS.map((level, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                WorldNode,
                {
                  level,
                  index,
                  state: getUnlockState(index),
                  progress: getProgress(index),
                  onClick: () => navigate({
                    to: "/world/$levelId/subjects",
                    params: { levelId: level.id }
                  })
                },
                level.id
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1 },
              className: "mt-14 text-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground tracking-wider uppercase", children: [
                "Current XP: ",
                PLAYER_XP.toLocaleString(),
                " — complete missions to unlock higher worlds"
              ] })
            }
          )
        ] })
      ]
    }
  );
}
export {
  BasicLevelSelectPage as default
};
