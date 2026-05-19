import { u as useNavigate, f as useParams, j as jsxRuntimeExports, P as ParticleBackground, m as motion, A as ArrowLeft, d as Lock, C as ChevronRight } from "./index-bdQaMNSA.js";
import { g as getSubjectInLevel } from "./basicLevels-CzhGsAtZ.js";
const PLAYER_XP = 500;
function CategoryCard({
  category,
  index,
  subjectColor,
  isUnlocked,
  onClick
}) {
  const completed = 0;
  const total = category.subGames.length;
  const progress = total > 0 ? completed / total * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20, scale: 0.97 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      whileHover: isUnlocked ? { y: -3, scale: 1.02 } : {},
      whileTap: isUnlocked ? { scale: 0.97 } : {},
      onClick: isUnlocked ? onClick : void 0,
      "data-ocid": `category-grid.card.${index + 1}`,
      className: [
        "relative rounded-xl overflow-hidden",
        isUnlocked ? "cursor-pointer group" : "cursor-not-allowed opacity-50"
      ].join(" "),
      style: {
        background: "oklch(0.08 0.02 260 / 0.8)",
        border: `1px solid ${isUnlocked ? `${subjectColor}25` : "oklch(0.2 0.02 260)"}`,
        backdropFilter: "blur(10px)"
      },
      children: [
        isUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
            style: {
              background: `radial-gradient(ellipse at 50% 0%, ${subjectColor}10 0%, transparent 70%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-xs font-bold tracking-wider uppercase leading-snug max-w-[80%]",
                style: {
                  fontFamily: "'Orbitron', sans-serif",
                  color: isUnlocked ? subjectColor : "oklch(0.4 0.02 260)"
                },
                children: category.name
              }
            ),
            !isUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-muted-foreground flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronRight,
              {
                className: "h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5",
                style: { color: subjectColor }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-snug mb-3 line-clamp-2", children: category.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground tracking-wider uppercase", children: [
              completed,
              "/",
              total,
              " completed"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 rounded-full bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: { width: `${progress}%`, background: subjectColor }
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function CategoryGridPage() {
  const navigate = useNavigate();
  const { levelId, subjectId } = useParams({ strict: false });
  const subject = getSubjectInLevel(levelId, subjectId);
  if (!subject) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Subject not found." }) });
  }
  const isUnlocked = (_idx) => PLAYER_XP >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative min-h-screen bg-background overflow-hidden",
      "data-ocid": "category-grid.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleBackground, { count: 40 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 left-0 right-0 h-64 pointer-events-none",
            style: {
              background: `linear-gradient(180deg, ${subject.color}0c 0%, transparent 100%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -16 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.4 },
              className: "flex items-center gap-2 mb-8 flex-wrap",
              "data-ocid": "category-grid.breadcrumb",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigate({ to: "/world" }),
                    className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                    "data-ocid": "category-grid.home_link",
                    children: "SmartLearn Quest"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigate({ to: "/world/$levelId/subjects", params: { levelId } }),
                    className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                    "data-ocid": "category-grid.level_link",
                    children: levelId.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-bold tracking-wider",
                    style: { color: subject.color },
                    children: subject.name
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/world/$levelId/subjects", params: { levelId } }),
                "data-ocid": "category-grid.back_button",
                className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
                  "Back"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "text-xl sm:text-2xl lg:text-3xl font-black tracking-tight",
                  style: {
                    fontFamily: "'Orbitron', sans-serif",
                    color: subject.color
                  },
                  children: subject.name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                subject.categories.length,
                " categories — select one to explore its missions"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
              "data-ocid": "category-grid.list",
              children: subject.categories.map((category, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                CategoryCard,
                {
                  category,
                  index: i,
                  subjectColor: subject.color,
                  isUnlocked: isUnlocked(),
                  onClick: () => navigate({
                    to: "/world/$levelId/subject/$subjectId/category/$categoryId",
                    params: { levelId, subjectId, categoryId: category.id }
                  })
                },
                category.id
              ))
            }
          )
        ] })
      ]
    }
  );
}
export {
  CategoryGridPage as default
};
