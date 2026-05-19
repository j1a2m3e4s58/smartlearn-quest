import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M17 12H7", key: "16if0g" }],
  ["path", { d: "M19 18H5", key: "18s9l3" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignCenter = createLucideIcon("align-center", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 18H3", key: "1amg6g" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignLeft = createLucideIcon("align-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M21 18H7", key: "1ygte8" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignRight = createLucideIcon("align-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", key: "mg9rjx" }
  ]
];
const Bold = createLucideIcon("bold", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
];
const Italic = createLucideIcon("italic", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4", key: "9kb039" }],
  ["line", { x1: "4", x2: "20", y1: "20", y2: "20", key: "nun2al" }]
];
const Underline = createLucideIcon("underline", __iconNode);
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const FORMAT_TASKS = [
  {
    id: "f1",
    instruction: "Make the title BOLD, set font size to 24, and CENTER the paragraph.",
    docTitle: "Annual School Report",
    docBody: "This report summarizes academic performance, attendance, and extracurricular achievements throughout the academic year.",
    required: { bold: true, fontSize: 24, align: "center" }
  },
  {
    id: "f2",
    instruction: "Apply ITALIC style and LEFT-ALIGN the paragraph.",
    docTitle: "Science Project Notes",
    docBody: "Water boils at 100 degrees Celsius at standard atmospheric pressure. This principle is used in many industrial applications.",
    required: { italic: true, align: "left" }
  },
  {
    id: "f3",
    instruction: "UNDERLINE the text, set font size to 18, and RIGHT-ALIGN the paragraph.",
    docTitle: "Mathematics Assignment",
    docBody: "Question 1: Solve for x in the equation 3x + 7 = 22. Show all working steps clearly.",
    required: { underline: true, fontSize: 18, align: "right" }
  },
  {
    id: "f4",
    instruction: "Apply BOLD + ITALIC, CENTER-ALIGN, and set font size to 20.",
    docTitle: "English Essay Introduction",
    docBody: "The impact of technology on modern education cannot be overstated. Digital tools have transformed how students learn.",
    required: { bold: true, italic: true, align: "center", fontSize: 20 }
  },
  {
    id: "f5",
    instruction: "BOLD only, set font size to 16, LEFT-ALIGN.",
    docTitle: "Class Rules Notice",
    docBody: "All students must arrive on time. Phones must be silent during lessons. Homework is due every Friday morning.",
    required: { bold: true, fontSize: 16, align: "left" }
  },
  {
    id: "f6",
    instruction: "UNDERLINE + BOLD, set font size to 22, RIGHT-ALIGN.",
    docTitle: "Certificate of Merit",
    docBody: "This certificate is awarded to the student who achieved the highest score in the end-of-term examination.",
    required: { bold: true, underline: true, fontSize: 22, align: "right" }
  }
];
const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32];
function WordWizardGame({ config, onGameEnd }) {
  const taskCount = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5;
  const [tasks] = reactExports.useState(
    () => shuffle(FORMAT_TASKS).slice(0, taskCount)
  );
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [format, setFormat] = reactExports.useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
    fontSize: 14,
    titleSize: 28
  });
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = taskCount > 0 ? correctRef.current / taskCount * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver, taskCount]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function toggleFormat(key, value) {
    setFormat((f) => {
      if (key === "align")
        return { ...f, align: value };
      if (key === "fontSize") return { ...f, fontSize: value };
      return {
        ...f,
        [key]: !f[key]
      };
    });
  }
  function checkFormat() {
    const task2 = tasks[currentIdx];
    const req = task2.required;
    let matches = 0;
    let total = Object.keys(req).length;
    if (total === 0) total = 1;
    if (req.bold !== void 0 && format.bold === req.bold) matches++;
    if (req.italic !== void 0 && format.italic === req.italic) matches++;
    if (req.underline !== void 0 && format.underline === req.underline)
      matches++;
    if (req.align !== void 0 && format.align === req.align) matches++;
    if (req.fontSize !== void 0 && format.fontSize === req.fontSize)
      matches++;
    const pct = matches / total;
    if (pct >= 1) {
      const timeBonus = Math.floor(timeLeft / config.timeLimit * 60);
      setScore((s) => s + 200 + timeBonus);
      setCorrect((c) => c + 1);
      setFeedback({
        ok: true,
        msg: "Perfect formatting! All requirements met."
      });
    } else if (pct > 0) {
      setScore((s) => s + Math.floor(100 * pct));
      setFeedback({
        ok: false,
        msg: `Partial credit (${matches}/${total} requirements met). Keep practicing!`
      });
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        ok: false,
        msg: "None of the required formatting was applied. Try again!"
      });
      if (newLives <= 0) {
        setTimeout(() => endGame(false), 1400);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setFormat({
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        fontSize: 14,
        titleSize: 28
      });
      if (currentIdx + 1 >= tasks.length) endGame(true);
      else setCurrentIdx((i) => i + 1);
    }, 1600);
  }
  const task = tasks[currentIdx];
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "office_arena.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs", children: "OFFICE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              currentIdx + 1,
              "/",
              taskCount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Office Productivity Arena"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Read the formatting instructions and apply them to the document using the toolbar. Then click Submit." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "office_arena.start_button",
                  children: "Open Word Processor"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#00f5ff]/20 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#00f5ff] uppercase tracking-widest mb-1", children: "Formatting Task" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: task.instruction })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col glass-card rounded-xl overflow-hidden border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-[#1e3a5f]/60 border-b border-border/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#f43f5e]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#f59e0b]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#10b981]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
                task.docTitle,
                " — Microsoft Word"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-2 bg-muted/20 border-b border-border/20 flex-wrap", children: [
              ["bold", "italic", "underline"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleFormat(key),
                  "data-ocid": `office_arena.${key}_button`,
                  className: `p-1.5 rounded border transition-all ${format[key] ? "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]" : "border-border/40 text-muted-foreground hover:border-border"}`,
                  children: key === "bold" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-4 w-4" }) : key === "italic" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Underline, { className: "h-4 w-4" })
                },
                key
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-border/40 mx-1" }),
              ["left", "center", "right"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleFormat("align", a),
                  "data-ocid": `office_arena.align_${a}`,
                  className: `p-1.5 rounded border transition-all ${format.align === a ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 text-muted-foreground hover:border-border"}`,
                  children: a === "left" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: "h-4 w-4" }) : a === "center" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlignCenter, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlignRight, { className: "h-4 w-4" })
                },
                a
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-border/40 mx-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: format.fontSize,
                  onChange: (e) => toggleFormat("fontSize", Number(e.target.value)),
                  "data-ocid": "office_arena.font_size_select",
                  className: "bg-background border border-border/40 rounded px-2 py-1 text-xs text-foreground",
                  children: FONT_SIZES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s, children: [
                    s,
                    "pt"
                  ] }, s))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-6 overflow-y-auto bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h1",
                    {
                      className: "text-foreground",
                      style: {
                        fontSize: `${format.titleSize}px`,
                        fontWeight: format.bold ? "bold" : "normal",
                        textDecoration: format.underline ? "underline" : "none",
                        textAlign: format.align
                      },
                      children: task.docTitle
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "leading-relaxed text-foreground/90",
                      style: {
                        fontSize: `${format.fontSize}px`,
                        fontWeight: format.bold ? "bold" : "normal",
                        fontStyle: format.italic ? "italic" : "normal",
                        textDecoration: format.underline ? "underline" : "none",
                        textAlign: format.align
                      },
                      children: task.docBody
                    }
                  )
                ]
              },
              task.id
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border/20 flex items-center justify-between", children: [
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: `text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                  "data-ocid": feedback.ok ? "office_arena.success_state" : "office_arena.error_state",
                  children: feedback.msg
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "sm",
                  onClick: checkFormat,
                  "data-ocid": "office_arena.submit_button",
                  className: "ml-auto",
                  children: "Submit Formatting"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
const FORMULA_TASKS = [
  {
    id: 1,
    scenario: "Class test scores are recorded in column B (B2:B6).",
    tableHeader: ["Student", "Score"],
    tableData: [
      ["Ama", "85"],
      ["Kofi", "72"],
      ["Yaa", "91"],
      ["Kwame", "68"],
      ["Efua", "79"]
    ],
    taskPrompt: "Calculate the TOTAL score of all 5 students.",
    options: [
      {
        formula: "=SUM(B2:B6)",
        correct: true,
        explanation: "SUM adds all values in a range. Perfect for totals."
      },
      {
        formula: "=AVERAGE(B2:B6)",
        correct: false,
        explanation: "AVERAGE divides sum by count — gives average, not total."
      },
      {
        formula: "=MAX(B2:B6)",
        correct: false,
        explanation: "MAX returns the single highest value, not the total."
      },
      {
        formula: "=COUNT(B2:B6)",
        correct: false,
        explanation: "COUNT counts how many numbers exist, not their sum."
      }
    ]
  },
  {
    id: 2,
    scenario: "Class test scores are recorded in column B (B2:B6).",
    tableHeader: ["Student", "Score"],
    tableData: [
      ["Ama", "85"],
      ["Kofi", "72"],
      ["Yaa", "91"],
      ["Kwame", "68"],
      ["Efua", "79"]
    ],
    taskPrompt: "Find the AVERAGE score across all students.",
    options: [
      {
        formula: "=AVERAGE(B2:B6)",
        correct: true,
        explanation: "AVERAGE sums the range and divides by count. Correct for mean."
      },
      {
        formula: "=SUM(B2:B6)",
        correct: false,
        explanation: "SUM gives the total, not the average."
      },
      {
        formula: "=MEDIAN(B2:B6)",
        correct: false,
        explanation: "MEDIAN gives the middle value, not the arithmetic mean."
      },
      {
        formula: "=MIN(B2:B6)",
        correct: false,
        explanation: "MIN returns the lowest value, not the average."
      }
    ]
  },
  {
    id: 3,
    scenario: "Sales figures for 4 branches are in column C (C2:C5).",
    tableHeader: ["Branch", "Sales (GHS)"],
    tableData: [
      ["Accra", "12500"],
      ["Kumasi", "9800"],
      ["Tamale", "7200"],
      ["Takoradi", "11400"]
    ],
    taskPrompt: "Find the HIGHEST sales figure among all branches.",
    options: [
      {
        formula: "=MAX(C2:C5)",
        correct: true,
        explanation: "MAX returns the largest value in the range."
      },
      {
        formula: "=SUM(C2:C5)",
        correct: false,
        explanation: "SUM adds all values together — not the maximum."
      },
      {
        formula: "=MIN(C2:C5)",
        correct: false,
        explanation: "MIN returns the smallest value, not largest."
      },
      {
        formula: "=AVERAGE(C2:C5)",
        correct: false,
        explanation: "AVERAGE computes the mean, not the maximum."
      }
    ]
  },
  {
    id: 4,
    scenario: "Student grades are in column C. A grade is 'Pass' if score >= 50.",
    tableHeader: ["Student", "Score", "Result"],
    tableData: [
      ["Ama", "75", "?"],
      ["Kofi", "43", "?"],
      ["Yaa", "88", "?"]
    ],
    taskPrompt: "Write the formula in C2 to show Pass or Fail based on score in B2.",
    options: [
      {
        formula: '=IF(B2>=50,"Pass","Fail")',
        correct: true,
        explanation: "IF checks the condition and returns Pass or Fail accordingly."
      },
      {
        formula: "=SUM(B2,50)",
        correct: false,
        explanation: "SUM just adds numbers — it cannot produce Pass/Fail text."
      },
      {
        formula: "=AVERAGE(B2:B6)",
        correct: false,
        explanation: "AVERAGE computes a mean — not a Pass/Fail condition."
      },
      {
        formula: "=MAX(B2:B6)",
        correct: false,
        explanation: "MAX returns the highest number, not a conditional result."
      }
    ]
  },
  {
    id: 5,
    scenario: "A budget spreadsheet tracks monthly expenses in D2:D13.",
    tableHeader: ["Month", "Expense (GHS)"],
    tableData: [
      ["Jan", "800"],
      ["Feb", "950"],
      ["Mar", "720"],
      ["Apr", "1100"]
    ],
    taskPrompt: "Count how many months had expenses recorded.",
    options: [
      {
        formula: "=COUNT(D2:D13)",
        correct: true,
        explanation: "COUNT counts how many numeric cells exist in the range."
      },
      {
        formula: "=SUM(D2:D13)",
        correct: false,
        explanation: "SUM totals the values, it does not count entries."
      },
      {
        formula: "=COUNTA(D2:D13)",
        correct: false,
        explanation: "COUNTA counts non-empty cells (including text). For numbers use COUNT."
      },
      {
        formula: "=MIN(D2:D13)",
        correct: false,
        explanation: "MIN returns the smallest value, not the count."
      }
    ]
  },
  {
    id: 6,
    scenario: "Population data for 6 regions is in column E (E2:E7).",
    tableHeader: ["Region", "Population"],
    tableData: [
      ["Greater Accra", "5310600"],
      ["Ashanti", "5440463"],
      ["Northern", "2479461"],
      ["Western", "2996577"]
    ],
    taskPrompt: "Find the LOWEST population value among all regions.",
    options: [
      {
        formula: "=MIN(E2:E7)",
        correct: true,
        explanation: "MIN returns the smallest value in the range."
      },
      {
        formula: "=MAX(E2:E7)",
        correct: false,
        explanation: "MAX returns the largest, not smallest value."
      },
      {
        formula: "=AVERAGE(E2:E7)",
        correct: false,
        explanation: "AVERAGE computes the mean, not the minimum."
      },
      {
        formula: "=SUM(E2:E7)",
        correct: false,
        explanation: "SUM adds all values together, not the minimum."
      }
    ]
  }
];
function ExcelExplorerGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
  const [tasks] = reactExports.useState(
    () => shuffle(FORMULA_TASKS).slice(0, Math.min(count, FORMULA_TASKS.length))
  );
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [answered, setAnswered] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = tasks.length > 0 ? correctRef.current / tasks.length * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver, tasks.length]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleSelect(opt) {
    if (!gameStarted || gameOver || answered) return;
    setAnswered(true);
    if (opt.correct) {
      const bonus = Math.floor(timeLeft / config.timeLimit * 80);
      setScore((s) => s + 180 + bonus);
      setCorrect((c) => c + 1);
      setFeedback({ ok: true, msg: opt.explanation });
    } else {
      const newL = lives - 1;
      setLives(newL);
      setFeedback({ ok: false, msg: opt.explanation });
      if (newL <= 0) {
        setTimeout(() => endGame(false), 1600);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      if (idx + 1 >= tasks.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 1600);
  }
  const task = tasks[idx];
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "excel_explorer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#10b981]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              idx + 1,
              "/",
              tasks.length
            ] }),
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
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Excel Formula Explorer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "A spreadsheet scenario is shown. Pick the correct Excel formula (SUM, AVERAGE, MAX, MIN, IF, COUNT) for each task." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "excel_explorer.start_button",
                  children: "Open Spreadsheet"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#10b981]/30 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#10b981] text-xs uppercase tracking-widest mb-1", children: "Scenario" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground", children: task.scenario })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl overflow-hidden border border-border/40 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-[#0d3d1a]/60 border-b border-border/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#f43f5e]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#f59e0b]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#10b981]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1", children: "Microsoft Excel" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: task.tableHeader.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-3 py-1 text-left text-[#10b981] border-b border-[#10b981]/20 font-bold",
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: task.tableData.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "tr",
                {
                  className: ri % 2 === 0 ? "bg-[#10b981]/5" : "",
                  children: row.map((cell, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "px-3 py-1 text-foreground border-b border-border/10",
                      children: cell
                    },
                    `cell-${ci}`
                  ))
                },
                `row-${ri}`
              )) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-lg p-3 border border-[#f59e0b]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f59e0b] font-semibold text-sm", children: task.taskPrompt }) }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
              children: feedback.msg
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: task.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              onClick: () => handleSelect(opt),
              disabled: answered,
              whileHover: !answered ? { scale: 1.02 } : {},
              "data-ocid": `excel_explorer.formula_${i + 1}`,
              className: `text-left px-4 py-3 rounded-lg border transition-all font-mono text-sm ${answered && opt.correct ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : "border-border/40 glass-card text-foreground hover:border-[#10b981]/40"}`,
              children: opt.formula
            },
            `fo-${i}`
          )) })
        ] })
      ]
    }
  );
}
const SLIDE_SETS = [
  {
    topic: "How Computers Work",
    slides: [
      {
        id: 1,
        title: "How Computers Work",
        content: "Presenter: ICT Department | Date: March 2024",
        type: "title",
        correctOrder: 1
      },
      {
        id: 2,
        title: "Agenda",
        content: "1. Hardware 2. Software 3. Data Processing 4. Summary",
        type: "agenda",
        correctOrder: 2
      },
      {
        id: 3,
        title: "Computer Hardware",
        content: "CPU, RAM, HDD, Motherboard, GPU, PSU, I/O Devices",
        type: "content",
        correctOrder: 3
      },
      {
        id: 4,
        title: "Computer Software",
        content: "Operating systems, applications, drivers, and utilities",
        type: "content",
        correctOrder: 4
      },
      {
        id: 5,
        title: "Summary",
        content: "Computers process input data into output through hardware + software",
        type: "conclusion",
        correctOrder: 5
      }
    ]
  },
  {
    topic: "Internet Safety for Students",
    slides: [
      {
        id: 6,
        title: "Internet Safety",
        content: "Staying Safe Online | Basic 5 ICT",
        type: "title",
        correctOrder: 1
      },
      {
        id: 7,
        title: "Why It Matters",
        content: "Over 5 billion people use the internet — threats are everywhere",
        type: "agenda",
        correctOrder: 2
      },
      {
        id: 8,
        title: "Phishing Threats",
        content: "Fake emails and websites trying to steal your information",
        type: "content",
        correctOrder: 3
      },
      {
        id: 9,
        title: "Protecting Yourself",
        content: "Strong passwords, HTTPS, avoid suspicious links, report threats",
        type: "content",
        correctOrder: 4
      },
      {
        id: 10,
        title: "Questions?",
        content: "What questions do you have about internet safety?",
        type: "questions",
        correctOrder: 5
      }
    ]
  },
  {
    topic: "The Water Cycle",
    slides: [
      {
        id: 11,
        title: "The Water Cycle",
        content: "Science Department | Basic 4",
        type: "title",
        correctOrder: 1
      },
      {
        id: 12,
        title: "Overview",
        content: "Evaporation, Condensation, Precipitation, Collection",
        type: "agenda",
        correctOrder: 2
      },
      {
        id: 13,
        title: "Evaporation & Condensation",
        content: "Heat causes water to evaporate. Clouds form from condensed water vapor.",
        type: "content",
        correctOrder: 3
      },
      {
        id: 14,
        title: "Precipitation",
        content: "Water falls as rain, snow, or hail and collects in oceans, lakes, rivers.",
        type: "content",
        correctOrder: 4
      },
      {
        id: 15,
        title: "Conclusion",
        content: "The water cycle continuously moves water through Earth's systems.",
        type: "conclusion",
        correctOrder: 5
      }
    ]
  }
];
const SLIDE_TYPE_COLORS = {
  title: "#7c3aed",
  agenda: "#00f5ff",
  content: "#10b981",
  conclusion: "#f59e0b",
  questions: "#f43f5e"
};
function PowerPointProGame({ config, onGameEnd }) {
  const setCount = config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const [slideSets] = reactExports.useState(
    () => shuffle(SLIDE_SETS).slice(0, Math.min(setCount, SLIDE_SETS.length))
  );
  const [setIdx, setSetIdx] = reactExports.useState(0);
  const [orderedSlides, setOrderedSlides] = reactExports.useState(
    () => shuffle(slideSets[0].slides)
  );
  const [dragIdx, setDragIdx] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [checked, setChecked] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, 80, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleDragStart(i) {
    setDragIdx(i);
  }
  function handleDrop(targetIdx) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setOrderedSlides((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  }
  function checkOrder() {
    const correct = orderedSlides.every((s, i) => s.correctOrder === i + 1);
    if (correct) {
      setScore((sc) => sc + 400);
      setFeedback({ ok: true, msg: "Perfect slide order!" });
    } else {
      const newL = livesRef.current - 1;
      setLives(newL);
      setFeedback({
        ok: false,
        msg: "Incorrect order. Slides must follow: Title > Agenda > Content > Conclusion/Questions."
      });
      if (newL <= 0) {
        setTimeout(() => endGame(false), 1600);
        return;
      }
    }
    setChecked(true);
    setTimeout(() => {
      setFeedback(null);
      setChecked(false);
      const nextSet = setIdx + 1;
      if (nextSet >= slideSets.length) endGame(true);
      else {
        setSetIdx(nextSet);
        setOrderedSlides(shuffle(slideSets[nextSet].slides));
      }
    }, 1800);
  }
  const currentSet = slideSets[setIdx];
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "ppt_pro.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#7c3aed]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "PowerPoint Pro"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Slides are shuffled out of order. Drag them into the correct presentation sequence, then click Check Order." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "ppt_pro.start_button",
                  children: "Start Presentation"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#7c3aed]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#7c3aed] uppercase tracking-widest mb-1", children: [
              "Topic: ",
              currentSet.topic
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Drag the 5 slides into the correct presentation order." })
          ] }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
              children: feedback.msg
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid gap-2 overflow-y-auto", children: orderedSlides.map((slide, i) => {
            const typeColor = SLIDE_TYPE_COLORS[slide.type];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                draggable: true,
                onDragStart: () => handleDragStart(i),
                onDragOver: (e) => e.preventDefault(),
                onDrop: () => handleDrop(i),
                className: "glass-card rounded-xl border p-3 cursor-grab active:cursor-grabbing flex items-center gap-3",
                style: { borderColor: `${typeColor}40` },
                "data-ocid": `ppt_pro.slide.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                      style: { background: `${typeColor}20`, color: typeColor },
                      children: i + 1
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: slide.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: slide.content })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs px-2 py-0.5 rounded border",
                      style: { color: typeColor, borderColor: `${typeColor}40` },
                      children: slide.type
                    }
                  )
                ]
              },
              slide.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: checkOrder,
              disabled: checked,
              "data-ocid": "ppt_pro.check_button",
              className: "shrink-0",
              children: "Check Order"
            }
          )
        ] })
      ]
    }
  );
}
function MicrosoftOffice({ config, onGameEnd }) {
  if (config.gameId === "excel-explorer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ExcelExplorerGame, { config, onGameEnd });
  if (config.gameId === "powerpoint-pro")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PowerPointProGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WordWizardGame, { config, onGameEnd });
}
export {
  MicrosoftOffice as default
};
