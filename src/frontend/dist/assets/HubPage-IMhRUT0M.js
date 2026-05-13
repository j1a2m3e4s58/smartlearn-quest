import { d as useParams, u as useNavigate, g as getHubById, e as getSubjectById, a as useAllHubProgress, f as useMyRecentScores, j as jsxRuntimeExports, G as GlowButton, P as ParticleBackground, m as motion, A as ArrowLeft, h as Shield, Z as Zap, b as ProgressRing, L as Lock, i as Star } from "./index-YNz7x6b_.js";
import { T as Target, a as Trophy } from "./trophy-hcACKst3.js";
import { P as Play } from "./play-C4PekZaW.js";
const HUB_GAMES = {
  mouseMaster: [
    {
      id: "mouse-master",
      name: "Cursor Precision Training",
      description: "Navigate through shrinking target zones with increasing speed and accuracy.",
      educationalObjective: "Develop fine motor control and cursor precision for desktop computing.",
      difficulty: 1,
      route: "/game/mouse-master",
      unlocked: true
    },
    {
      id: "drag-drop-maze",
      name: "Drag-Drop Obstacle Maze",
      description: "Drag items through complex pathways without touching maze walls.",
      educationalObjective: "Master drag-and-drop interactions for file management and GUI use.",
      difficulty: 2,
      route: "/game/drag-drop-maze",
      unlocked: true
    },
    {
      id: "double-click-race",
      name: "Double-Click Race",
      description: "Open files faster than the AI opponent using precise double-clicks.",
      educationalObjective: "Practice double-click timing essential for file and folder operations.",
      difficulty: 1,
      route: "/game/double-click-race",
      unlocked: true
    },
    {
      id: "desktop-organizer",
      name: "Desktop Organization Challenge",
      description: "Sort and organize cluttered desktop icons into the correct folders before time runs out.",
      educationalObjective: "Learn desktop organization and file categorization principles.",
      difficulty: 2,
      route: "/game/desktop-organizer",
      unlocked: false
    },
    {
      id: "scroll-shooter",
      name: "Scroll Wheel Navigator",
      description: "Navigate long documents finding hidden targets using scroll gestures.",
      educationalObjective: "Develop scrolling and document navigation skills for productivity.",
      difficulty: 3,
      route: "/game/scroll-shooter",
      unlocked: false
    }
  ],
  keyboardNinja: [
    {
      id: "keyboard-ninja",
      name: "Shortcut Combat Arena",
      description: "Defeat opponents using keyboard shortcuts faster than they can use the mouse.",
      educationalObjective: "Master essential keyboard shortcuts to boost productivity and speed.",
      difficulty: 2,
      route: "/game/keyboard-ninja",
      unlocked: true
    },
    {
      id: "key-mastery",
      name: "Key Mastery Challenge",
      description: "Identify and press the correct keys on a virtual keyboard within the countdown.",
      educationalObjective: "Build keyboard familiarity and key identification skills.",
      difficulty: 1,
      route: "/game/key-mastery",
      unlocked: true
    },
    {
      id: "function-key-boss",
      name: "Function Key Boss Battle",
      description: "Use F1–F12 function keys to defeat escalating enemy waves in combat.",
      educationalObjective: "Learn the purpose and context of function keys in real applications.",
      difficulty: 3,
      route: "/game/function-key-boss",
      unlocked: true
    },
    {
      id: "symbol-sprint",
      name: "Symbol Sprint",
      description: "Type special characters and symbols at speed in a timed race.",
      educationalObjective: "Practice typing symbols and punctuation for advanced text entry.",
      difficulty: 2,
      route: "/game/symbol-sprint",
      unlocked: false
    },
    {
      id: "nav-warrior",
      name: "Navigation Warrior",
      description: "Use arrow keys, Home, End, and Page keys to navigate text documents efficiently.",
      educationalObjective: "Master keyboard navigation for efficient document and browser use.",
      difficulty: 3,
      route: "/game/nav-warrior",
      unlocked: false
    }
  ],
  typingSpeed: [
    {
      id: "typing-speed",
      name: "Speed Typist: WPM Tournament",
      description: "Race against time and opponents to achieve the highest words-per-minute score.",
      educationalObjective: "Develop touch typing speed and accuracy for real-world computing tasks.",
      difficulty: 2,
      route: "/game/typing-speed",
      unlocked: true
    },
    {
      id: "typing-accuracy",
      name: "Precision Typist",
      description: "Type complex passages with zero errors — accuracy over speed.",
      educationalObjective: "Build precise typing habits to reduce errors in professional work.",
      difficulty: 1,
      route: "/game/typing-accuracy",
      unlocked: true
    },
    {
      id: "code-typist",
      name: "Code Typist Challenge",
      description: "Type programming syntax and code snippets accurately at speed.",
      educationalObjective: "Prepare for programming by mastering code-specific typing patterns.",
      difficulty: 3,
      route: "/game/code-typist",
      unlocked: true
    },
    {
      id: "typing-marathon",
      name: "Typing Marathon",
      description: "Sustain high WPM across an extended passage without losing momentum.",
      educationalObjective: "Build typing endurance required for lengthy document production.",
      difficulty: 2,
      route: "/game/typing-marathon",
      unlocked: false
    },
    {
      id: "blind-type",
      name: "Blind Type Master",
      description: "Type words without looking at the keyboard — full touch-typing technique.",
      educationalObjective: "Achieve true touch-typing independence for maximum professional efficiency.",
      difficulty: 3,
      route: "/game/blind-type",
      unlocked: false
    }
  ],
  cyberSafety: [
    {
      id: "cyber-safety",
      name: "Cyber Guardian: Phishing Defense",
      description: "Identify and neutralize phishing emails, fake websites, and social engineering attacks.",
      educationalObjective: "Recognize and respond to digital threats to protect personal information online.",
      difficulty: 2,
      route: "/game/cyber-safety",
      unlocked: true
    },
    {
      id: "password-fortress",
      name: "Password Fortress Builder",
      description: "Construct strong passwords and protect your digital vault from cracking attempts.",
      educationalObjective: "Learn password security principles and strong credential management.",
      difficulty: 1,
      route: "/game/password-fortress",
      unlocked: true
    },
    {
      id: "virus-hunter",
      name: "Virus Hunter",
      description: "Detect and quarantine malware hidden inside files before it spreads.",
      educationalObjective: "Understand how malware works and how to protect devices from infection.",
      difficulty: 2,
      route: "/game/virus-hunter",
      unlocked: true
    },
    {
      id: "privacy-shield",
      name: "Privacy Shield Mission",
      description: "Audit your digital footprint and secure exposed personal data across platforms.",
      educationalObjective: "Develop digital privacy awareness and responsible online behavior.",
      difficulty: 3,
      route: "/game/privacy-shield",
      unlocked: false
    },
    {
      id: "social-engineering-boss",
      name: "Social Engineering Boss Battle",
      description: "Defeat the master manipulator by identifying deceptive tactics in real scenarios.",
      educationalObjective: "Recognize social engineering techniques used in real-world cyberattacks.",
      difficulty: 3,
      route: "/game/social-engineering-boss",
      unlocked: false
    }
  ],
  codingBasics: [
    {
      id: "coding-basics",
      name: "Code Puzzle: Drag-Drop Programming",
      description: "Arrange code blocks in the correct sequence to make programs execute properly.",
      educationalObjective: "Understand algorithmic thinking, sequencing, and basic programming logic.",
      difficulty: 1,
      route: "/game/coding-basics",
      unlocked: true
    },
    {
      id: "loop-lab",
      name: "Loop Lab",
      description: "Use loops to control robot movements through challenging grid mazes.",
      educationalObjective: "Master loop structures and iteration as core programming concepts.",
      difficulty: 2,
      route: "/game/loop-lab",
      unlocked: true
    },
    {
      id: "variable-vault",
      name: "Variable Vault",
      description: "Store, modify, and retrieve variables to unlock safes in an escape room.",
      educationalObjective: "Understand variables, data types, and memory assignment in programming.",
      difficulty: 2,
      route: "/game/variable-vault",
      unlocked: true
    },
    {
      id: "function-factory",
      name: "Function Factory",
      description: "Build reusable functions on an assembly line to maximize factory output.",
      educationalObjective: "Learn function definition, parameters, and return values in programming.",
      difficulty: 3,
      route: "/game/function-factory",
      unlocked: false
    },
    {
      id: "conditional-combat",
      name: "Conditional Combat",
      description: "Program AI warriors using if/else logic to defeat adaptive enemies.",
      educationalObjective: "Apply conditional statements and boolean logic to solve real problems.",
      difficulty: 3,
      route: "/game/conditional-combat",
      unlocked: false
    }
  ]
};
function getDefaultGames(hubId) {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${hubId}-game-${i + 1}`,
    name: `Mission ${i + 1}`,
    description: "Complete this mission to advance your knowledge and earn rewards.",
    educationalObjective: "Build core competencies aligned with Ghana Education Service standards.",
    difficulty: i % 3 + 1,
    route: `/game/${hubId}-${i + 1}`,
    unlocked: i < 2
  }));
}
function DifficultyBadge({
  level,
  color
}) {
  const labels = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
  const opacities = { 1: "25", 2: "35", 3: "50" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase",
      style: {
        color,
        background: `${color}${opacities[level]}`,
        border: `1px solid ${color}50`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5", fill: color }),
        labels[level]
      ]
    }
  );
}
function HubPage() {
  const { hubId } = useParams({ from: "/hub/$hubId" });
  const navigate = useNavigate();
  const hub = getHubById(hubId);
  const subject = hub ? getSubjectById(hub.subjectId) : null;
  const { data: hubProgress = [] } = useAllHubProgress();
  const { data: recentScores = [] } = useMyRecentScores();
  if (!hub || !subject) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen bg-background flex items-center justify-center",
        "data-ocid": "hub.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Hub not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(GlowButton, { onClick: () => navigate({ to: "/world-map" }), children: "Return to World Map" })
        ] })
      }
    );
  }
  const color = subject.color;
  const games = HUB_GAMES[hubId] ?? getDefaultGames(hubId);
  const hubProgressData = hubProgress.find((h) => h.hubId === hubId);
  const completedGames = hubProgressData ? Number(hubProgressData.missionsCompleted) : 0;
  const progressPercent = games.length > 0 ? Math.round(completedGames / games.length * 100) : 0;
  const getPersonalBest = (gameId) => {
    const scores = recentScores.filter((s) => s.gameId === gameId).map((s) => Number(s.score));
    return scores.length > 0 ? Math.max(...scores) : null;
  };
  const XP_REWARDS = { 1: 50, 2: 100, 3: 200 };
  const HUB_ACHIEVEMENTS = [
    {
      id: "first-play",
      label: "First Mission Cleared",
      earned: completedGames >= 1
    },
    { id: "halfway", label: "Halfway Master", earned: completedGames >= 3 },
    {
      id: "full-clear",
      label: "Hub Champion",
      earned: completedGames >= games.length
    },
    { id: "no-damage", label: "Flawless Run", earned: false }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-background", "data-ocid": "hub.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleBackground, { count: 40 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-0 left-0 right-0 h-48 opacity-25 pointer-events-none",
        style: {
          background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${color}30 0%, transparent 100%)`
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -16 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.3 },
          className: "flex items-center gap-2 text-sm text-muted-foreground mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({
                  to: "/subject/$subjectId",
                  params: { subjectId: hub.subjectId }
                }),
                "data-ocid": "hub.back_button",
                className: "inline-flex items-center gap-1.5 hover:text-foreground transition-colors group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" }),
                  subject.name
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "/" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/60 truncate", children: hub.name })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "glass-card rounded-2xl border p-6 mb-6",
          style: { borderColor: `${color}30` },
          "data-ocid": "hub.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute top-0 left-0 right-0 h-px rounded-t-2xl",
                style: {
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  opacity: 0.8
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4", style: { color } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[10px] font-bold tracking-widest uppercase",
                      style: { color },
                      children: [
                        subject.name,
                        " Hub"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-2xl sm:text-3xl font-black tracking-tight mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif", color },
                    children: hub.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 leading-relaxed", children: hub.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Grade ",
                      hub.minGrade,
                      "–",
                      hub.maxGrade
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5", style: { color } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", style: { color }, children: [
                      "Up to ",
                      XP_REWARDS[3],
                      " XP per game"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5 text-accent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      completedGames,
                      "/",
                      games.length,
                      " Completed"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProgressRing,
                {
                  percent: progressPercent,
                  size: 80,
                  strokeWidth: 6,
                  color
                }
              ) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-8", "data-ocid": "hub.game.list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3",
            style: { fontFamily: "'Orbitron', sans-serif" },
            children: "Missions"
          }
        ),
        games.map((game, i) => {
          const personalBest = getPersonalBest(game.id);
          const xpReward = XP_REWARDS[game.difficulty];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: {
                duration: 0.4,
                delay: 0.1 + i * 0.07,
                ease: "easeOut"
              },
              "data-ocid": `hub.game.item.${i + 1}`,
              className: [
                "glass-card rounded-xl border overflow-hidden group transition-smooth",
                game.unlocked ? "border-border/30 cursor-pointer hover:border-opacity-60" : "border-border/20 opacity-55"
              ].join(" "),
              style: {
                borderColor: game.unlocked ? `${color}25` : void 0
              },
              onClick: game.unlocked ? () => navigate({
                to: game.route,
                params: { gameId: game.id }
              }) : void 0,
              whileHover: game.unlocked ? { y: -2 } : {},
              children: [
                game.unlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    style: {
                      background: `radial-gradient(ellipse at 0% 50%, ${color}0a 0%, transparent 60%)`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black",
                      style: {
                        background: game.unlocked ? `${color}18` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${game.unlocked ? `${color}40` : "rgba(255,255,255,0.08)"}`,
                        color: game.unlocked ? color : void 0,
                        fontFamily: "'Orbitron', sans-serif"
                      },
                      children: game.unlocked ? i + 1 : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h3",
                        {
                          className: "text-sm font-bold leading-snug",
                          style: {
                            fontFamily: "'Orbitron', sans-serif",
                            color: game.unlocked ? color : void 0
                          },
                          children: game.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        DifficultyBadge,
                        {
                          level: game.difficulty,
                          color: game.unlocked ? color : "rgba(255,255,255,0.3)"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed", children: game.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] text-muted-foreground mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3 w-3 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: game.educationalObjective })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "text-[10px] font-bold tracking-widest uppercase",
                            style: { color: game.unlocked ? color : void 0 },
                            children: [
                              "+",
                              xpReward,
                              " XP"
                            ]
                          }
                        ),
                        personalBest !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-accent font-bold", children: [
                          "Best: ",
                          personalBest.toLocaleString()
                        ] })
                      ] }),
                      game.unlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          className: "flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity",
                          style: { color },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3", fill: color }),
                            "Launch"
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground tracking-widest uppercase", children: "Locked" })
                    ] })
                  ] })
                ] })
              ]
            },
            game.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6 },
          className: "glass-card rounded-2xl border p-5",
          style: { borderColor: `${color}20` },
          "data-ocid": "hub.achievements.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-xs font-bold tracking-widest uppercase mb-4",
                style: { fontFamily: "'Orbitron', sans-serif", color },
                children: "Hub Achievements"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: HUB_ACHIEVEMENTS.map((ach) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: [
                  "flex items-center gap-3 rounded-lg p-3 border transition-smooth",
                  ach.earned ? "border-accent/30 bg-accent/5" : "border-border/20 opacity-50"
                ].join(" "),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Trophy,
                    {
                      className: "h-4 w-4 shrink-0",
                      style: { color: ach.earned ? "#f59e0b" : void 0 },
                      fill: ach.earned ? "#f59e0b" : "none"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground/80", children: ach.label }),
                  ach.earned && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[9px] font-bold tracking-widest uppercase text-accent", children: "Earned" })
                ]
              },
              ach.id
            )) }),
            hub.unlocked && hub.isPlayable && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-4 border-t border-border/20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              GlowButton,
              {
                onClick: () => {
                  const firstGame = games.find((g) => g.unlocked);
                  if (firstGame)
                    navigate({
                      to: firstGame.route,
                      params: { gameId: firstGame.id }
                    });
                },
                size: "lg",
                "data-ocid": "hub.start_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4", fill: "currentColor" }),
                  "Start First Mission"
                ]
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
export {
  HubPage as default
};
