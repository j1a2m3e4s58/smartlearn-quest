import { u as useNavigate, f as useParams, j as jsxRuntimeExports, P as ParticleBackground, m as motion, A as ArrowLeft, C as ChevronRight } from "./index-bdQaMNSA.js";
import { B as BASIC_LEVELS } from "./basicLevels-CzhGsAtZ.js";
function SubjectCard({ subject, levelId, index, onClick }) {
  const totalSubGames = subject.categories.reduce(
    (sum, c) => sum + c.subGames.length,
    0
  );
  const completedSubGames = 0;
  const progress = totalSubGames > 0 ? completedSubGames / totalSubGames * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      whileHover: { y: -5, scale: 1.02 },
      whileTap: { scale: 0.97 },
      onClick,
      "data-ocid": `world-subjects.card.${index + 1}`,
      className: "group relative rounded-2xl overflow-hidden cursor-pointer",
      style: {
        background: "oklch(0.08 0.02 260 / 0.85)",
        border: `1px solid ${subject.color}30`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 0 0 ${subject.color}00, inset 0 1px 0 rgba(255,255,255,0.05)`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 left-0 right-0 h-0.5",
            style: {
              background: `linear-gradient(90deg, transparent, ${subject.color}, transparent)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
            style: {
              background: `radial-gradient(ellipse at 50% 0%, ${subject.color}14 0%, transparent 70%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-12 h-12 rounded-xl flex items-center justify-center",
              style: {
                background: `${subject.color}18`,
                border: `1px solid ${subject.color}30`
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  className: "h-6 w-6",
                  style: { color: subject.color },
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1.75",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: subject.iconPath })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-sm font-bold tracking-widest uppercase mb-1",
                style: {
                  fontFamily: "'Orbitron', sans-serif",
                  color: subject.color
                },
                children: subject.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: subject.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-medium text-muted-foreground tracking-wider uppercase", children: [
                completedSubGames,
                " / ",
                totalSubGames,
                " activities"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-[10px] font-bold",
                  style: { color: subject.color },
                  children: [
                    Math.round(progress),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "h-full rounded-full",
                style: { background: subject.color },
                initial: { width: 0 },
                animate: { width: `${progress}%` },
                transition: { duration: 0.7, delay: index * 0.07 + 0.3 }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground tracking-wider uppercase", children: [
              subject.categories.length,
              " categories"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronRight,
              {
                className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1",
                style: { color: subject.color }
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function WorldSubjectsPage() {
  const navigate = useNavigate();
  const { levelId } = useParams({ strict: false });
  const level = BASIC_LEVELS.find((l) => l.id === levelId);
  if (!level) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Level not found." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative min-h-screen bg-background overflow-hidden",
      "data-ocid": "world-subjects.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleBackground, { count: 50 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10",
            style: {
              background: `radial-gradient(ellipse, ${level.theme.primary} 0%, transparent 70%)`
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -16 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.4 },
              className: "flex items-center gap-2 mb-8 flex-wrap",
              "data-ocid": "world-subjects.breadcrumb",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigate({ to: "/world" }),
                    "data-ocid": "world-subjects.back_button",
                    className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
                      "SmartLearn Quest"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-bold tracking-wider",
                    style: { color: level.theme.primary },
                    children: level.name
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
              className: "mb-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2",
                    style: {
                      fontFamily: "'Orbitron', sans-serif",
                      color: level.theme.primary
                    },
                    children: level.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: level.subtitle })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
              "data-ocid": "world-subjects.grid",
              children: level.subjects.map((subject, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SubjectCard,
                {
                  subject,
                  levelId,
                  index: i,
                  onClick: () => navigate({
                    to: "/world/$levelId/subject/$subjectId/categories",
                    params: { levelId, subjectId: subject.id }
                  })
                },
                subject.id
              ))
            }
          )
        ] })
      ]
    }
  );
}
export {
  WorldSubjectsPage as default
};
