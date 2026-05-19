import { u as useNavigate, f as useParams, j as jsxRuntimeExports, P as ParticleBackground, m as motion, A as ArrowLeft, d as Lock } from "./index-bdQaMNSA.js";
import { g as getSubjectInLevel, a as getCategoryInSubject } from "./basicLevels-CzhGsAtZ.js";
const PLAYER_XP = 500;
const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced"
};
function DifficultyStars({ difficulty }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex items-center gap-0.5",
      "aria-label": `Difficulty: ${DIFFICULTY_LABELS[difficulty]}`,
      children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "svg",
        {
          className: "h-2.5 w-2.5",
          viewBox: "0 0 10 10",
          "aria-hidden": "true",
          fill: i < difficulty ? "currentColor" : "none",
          stroke: "currentColor",
          strokeWidth: "1",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1", y: "1", width: "8", height: "8", rx: "1.5" })
        },
        i
      ))
    }
  );
}
function SubGameCard({
  subGame,
  index,
  subjectColor,
  isUnlocked,
  onClick
}) {
  const hasGame = subGame.gameId !== null;
  const isPlayable = isUnlocked && hasGame;
  const isFuture = !hasGame;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.93 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        duration: 0.3,
        delay: index * 0.03,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      whileHover: isPlayable ? { y: -3, scale: 1.03 } : {},
      whileTap: isPlayable ? { scale: 0.97 } : {},
      onClick: isPlayable ? onClick : void 0,
      "data-ocid": `sub-game-grid.card.${index + 1}`,
      className: [
        "relative rounded-xl overflow-hidden",
        isPlayable ? "cursor-pointer group" : "cursor-default",
        !isUnlocked || isFuture ? "opacity-55" : ""
      ].join(" "),
      style: {
        background: "oklch(0.09 0.02 260 / 0.85)",
        border: `1px solid ${isPlayable ? `${subjectColor}28` : "oklch(0.18 0.02 260)"}`,
        backdropFilter: "blur(8px)",
        minHeight: 130
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
            style: {
              background: isPlayable ? `${subjectColor}20` : "oklch(0.15 0.02 260)",
              color: isPlayable ? subjectColor : "oklch(0.4 0.02 260)",
              border: `1px solid ${isPlayable ? `${subjectColor}30` : "oklch(0.2 0.02 260)"}`
            },
            children: index + 1
          }
        ),
        isPlayable && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
            style: {
              background: `radial-gradient(ellipse at 50% 0%, ${subjectColor}12 0%, transparent 70%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5",
                style: {
                  background: isPlayable ? `${subjectColor}18` : "oklch(0.12 0.02 260)",
                  border: `1px solid ${isPlayable ? `${subjectColor}28` : "oklch(0.18 0.02 260)"}`
                },
                children: !isUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3 text-muted-foreground" }) : isFuture ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    className: "h-3 w-3 text-muted-foreground",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    "aria-hidden": "true",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 6 12 12 16 14" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    className: "h-3 w-3",
                    style: { color: subjectColor },
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "5 3 19 12 5 21 5 3" })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h4",
              {
                className: "text-[11px] font-bold leading-snug line-clamp-2 pr-5",
                style: {
                  fontFamily: "'Orbitron', sans-serif",
                  color: isPlayable ? subjectColor : "oklch(0.5 0.03 260)"
                },
                children: subGame.title
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-snug line-clamp-2 flex-1", children: isFuture ? "Coming in a future update" : subGame.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-border/15", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DifficultyStars, { difficulty: subGame.difficulty }),
            !isUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground tracking-wider", children: [
              subGame.unlockAtXP,
              " XP"
            ] })
          ] })
        ] })
      ]
    }
  );
}
function SubGameGridPage() {
  const navigate = useNavigate();
  const { levelId, subjectId, categoryId } = useParams({ strict: false });
  const subject = getSubjectInLevel(levelId, subjectId);
  const category = getCategoryInSubject(levelId, subjectId, categoryId);
  if (!subject || !category) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Category not found." }) });
  }
  const isUnlocked = (sg) => PLAYER_XP >= sg.unlockAtXP;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative min-h-screen bg-background overflow-hidden",
      "data-ocid": "sub-game-grid.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleBackground, { count: 30 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 left-0 right-0 h-48 pointer-events-none",
            style: {
              background: `linear-gradient(180deg, ${subject.color}0a 0%, transparent 100%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.nav,
            {
              initial: { opacity: 0, x: -16 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.4 },
              className: "flex items-center gap-2 mb-8 flex-wrap",
              "aria-label": "Breadcrumb",
              "data-ocid": "sub-game-grid.breadcrumb",
              children: [
                [
                  { label: "Home", action: () => navigate({ to: "/world" }) },
                  {
                    label: levelId.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                    action: () => navigate({
                      to: "/world/$levelId/subjects",
                      params: { levelId }
                    })
                  },
                  {
                    label: subject.name,
                    action: () => navigate({
                      to: "/world/$levelId/subject/$subjectId/categories",
                      params: { levelId, subjectId }
                    })
                  }
                ].map(({ label, action }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "/" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: action,
                      className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                      children: label
                    }
                  )
                ] }, i)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-bold tracking-wider",
                    style: { color: subject.color },
                    children: category.name
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({
                  to: "/world/$levelId/subject/$subjectId/categories",
                  params: { levelId, subjectId }
                }),
                "data-ocid": "sub-game-grid.back_button",
                className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1",
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
                  children: category.name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: category.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5 tracking-wider uppercase", children: [
                category.subGames.length,
                " missions — earn XP to unlock advanced stages"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
              "data-ocid": "sub-game-grid.list",
              children: category.subGames.map((sg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SubGameCard,
                {
                  subGame: sg,
                  index: i,
                  subjectColor: subject.color,
                  isUnlocked: isUnlocked(sg),
                  onClick: () => {
                    if (sg.gameId) {
                      navigate({
                        to: "/game/$gameId",
                        params: { gameId: sg.gameId }
                      });
                    }
                  }
                },
                sg.id
              ))
            }
          )
        ] })
      ]
    }
  );
}
export {
  SubGameGridPage as default
};
