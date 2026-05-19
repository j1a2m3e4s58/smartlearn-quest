import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const GRID_PUZZLES = {
  1: [
    {
      categories: [
        ["Alice", "Bob", "Carol"],
        ["Red", "Blue", "Green"]
      ],
      clues: [
        "Alice does not have Red.",
        "Bob does not have Blue.",
        "Carol has Green."
      ],
      solution: [
        [false, true, false],
        [true, false, false],
        [false, false, true]
      ]
    },
    {
      categories: [
        ["Dog", "Cat", "Bird"],
        ["Anna", "Ben", "Cara"]
      ],
      clues: [
        "Anna does not own the Dog.",
        "Ben owns the Cat.",
        "Cara does not own the Bird."
      ],
      solution: [
        [false, false, true],
        [false, true, false],
        [true, false, false]
      ]
    }
  ],
  2: [
    {
      categories: [
        ["Alex", "Beth", "Carl", "Dana"],
        ["Math", "Art", "Music", "Sport"]
      ],
      clues: [
        "Alex does not like Math or Art.",
        "Beth likes Music.",
        "Carl does not like Sport.",
        "Dana likes Math."
      ],
      solution: [
        [false, false, false, true],
        [false, false, true, false],
        [false, true, false, false],
        [true, false, false, false]
      ]
    }
  ],
  3: [
    {
      categories: [
        ["Aiko", "Bruno", "Cleo", "Dax", "Eli"],
        ["Piano", "Guitar", "Drums", "Violin", "Flute"]
      ],
      clues: [
        "Aiko plays a string instrument.",
        "Bruno does not play Piano or Flute.",
        "Cleo plays Drums.",
        "Dax does not play Guitar.",
        "Eli plays Piano.",
        "Aiko does not play Guitar."
      ],
      solution: [
        [false, false, false, true, false],
        [false, true, false, false, false],
        [false, false, true, false, false],
        [false, false, false, false, true],
        [true, false, false, false, false]
      ]
    }
  ]
};
function LogicGridMaster({ config, onGameEnd }) {
  const puzzles = GRID_PUZZLES[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [puzzleIdx, setPuzzleIdx] = reactExports.useState(0);
  const [grid, setGrid] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [solved, setSolved] = reactExports.useState(0);
  const [msg, setMsg] = reactExports.useState("");
  const [msgColor, setMsgColor] = reactExports.useState("#4ade80");
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const solvedRef = reactExports.useRef(solved);
  solvedRef.current = solved;
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const puzzle = puzzles[puzzleIdx % puzzles.length];
  const rows = puzzle.categories[0].length;
  const cols = puzzle.categories[1].length;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.min(100, solvedRef.current / puzzles.length * 100),
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, puzzles.length]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function initGrid(r, c) {
    return Array.from(
      { length: r },
      () => Array(c).fill("empty")
    );
  }
  function startGame() {
    startTimeRef.current = Date.now();
    setGrid(initGrid(rows, cols));
    setPhase("playing");
    startTimer();
  }
  function cycleCell(r, c) {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      const cur = next[r][c];
      next[r][c] = cur === "empty" ? "yes" : cur === "yes" ? "no" : "empty";
      return next;
    });
  }
  function checkSolution() {
    let correct = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (puzzle.solution[r][c] && grid[r][c] !== "yes") {
          correct = false;
          break;
        }
        if (!puzzle.solution[r][c] && grid[r][c] !== "no") {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }
    if (correct) {
      const pts = 500 * config.difficulty + timeLeft * 5;
      setScore((s) => s + pts);
      setSolved((s) => s + 1);
      setMsg(`Correct! +${pts} pts`);
      setMsgColor("#4ade80");
      setTimeout(() => {
        setPuzzleIdx((i) => i + 1);
        setGrid(initGrid(rows, cols));
        setMsg("");
      }, 1500);
    } else {
      setMsg("Not quite — check your deductions.");
      setMsgColor("#f43f5e");
      setTimeout(() => setMsg(""), 2e3);
    }
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "logic_puzzle.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#00f5ff] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#00f5ff]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Logic Grid Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Use the clues to deduce who owns what. Click cells to mark YES or NO. Submit when the grid is complete." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors",
                  "data-ocid": "logic_puzzle.start_button",
                  children: "Start Puzzle"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#f59e0b]", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Puzzle ",
              puzzleIdx % puzzles.length + 1,
              "/",
              puzzles.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/30 bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Clues" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: puzzle.clues.map((clue, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "text-sm text-foreground/80 flex gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#00f5ff] font-mono shrink-0", children: [
                    i + 1,
                    "."
                  ] }),
                  clue
                ]
              },
              `clue-${i}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-20" }),
              puzzle.categories[1].map((col, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-2 py-1 text-xs text-[#00f5ff] font-bold text-center border border-border/30 min-w-[60px]",
                  children: col
                },
                `col-${ci}`
              ))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: puzzle.categories[0].map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-xs font-bold text-foreground/80 border border-border/30", children: row }),
              Array.from({ length: cols }).map((_, ci) => {
                var _a;
                const cell = ((_a = grid[ri]) == null ? void 0 : _a[ci]) ?? "empty";
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "border border-border/30 p-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => cycleCell(ri, ci),
                        className: `w-14 h-10 font-bold text-base transition-all hover:opacity-80 ${cell === "yes" ? "bg-[#10b981]/20 text-[#10b981]" : cell === "no" ? "bg-[#f43f5e]/20 text-[#f43f5e]" : "bg-card/60 text-muted-foreground"}`,
                        "data-ocid": `logic_puzzle.cell.${ri}_${ci}`,
                        children: cell === "yes" ? "YES" : cell === "no" ? "NO" : "—"
                      }
                    )
                  },
                  `cell-${ri}-${ci}`
                );
              })
            ] }, `row-${ri}`)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: msg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "text-sm font-bold text-center",
              style: { color: msgColor },
              children: msg
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: checkSolution,
              className: "self-center px-8 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors",
              "data-ocid": "logic_puzzle.check_button",
              children: "Check Solution"
            }
          )
        ] })
      ]
    }
  );
}
const SYLLOGISMS = {
  1: [
    {
      premises: ["All mammals are warm-blooded.", "Dogs are mammals."],
      conclusion: "Dogs are warm-blooded.",
      valid: true,
      explanation: "Valid: If all mammals are warm-blooded and dogs are mammals, then dogs must be warm-blooded."
    },
    {
      premises: ["All cats are animals.", "All animals need food."],
      conclusion: "All cats need food.",
      valid: true,
      explanation: "Valid: Transitive property — cats → animals → need food."
    },
    {
      premises: ["All birds can fly.", "Penguins are birds."],
      conclusion: "Penguins can fly.",
      valid: false,
      explanation: "Invalid: The first premise is factually false (penguins cannot fly), making the conclusion unsound."
    },
    {
      premises: ["Some students like math.", "All math lovers are logical."],
      conclusion: "All students are logical.",
      valid: false,
      explanation: "Invalid: Only some students like math, not all — the conclusion overclaims."
    },
    {
      premises: ["No fish is a mammal.", "Whales are not fish."],
      conclusion: "Whales are mammals.",
      valid: false,
      explanation: "Invalid: Whales not being fish does not make them mammals by this argument alone."
    }
  ],
  2: [
    {
      premises: ["If it rains, the road is wet.", "The road is wet."],
      conclusion: "It rained.",
      valid: false,
      explanation: "Invalid: Affirming the consequent. The road could be wet for other reasons (flooding, cleaning, etc.)."
    },
    {
      premises: ["All squares are rectangles.", "No rectangles are circles."],
      conclusion: "No squares are circles.",
      valid: true,
      explanation: "Valid: If all squares are rectangles and no rectangles are circles, then no squares can be circles."
    },
    {
      premises: ["If you study hard, you pass.", "You did not pass."],
      conclusion: "You did not study hard.",
      valid: true,
      explanation: "Valid: Modus Tollens — contrapositive reasoning is logically sound."
    },
    {
      premises: [
        "Some politicians are honest.",
        "All honest people are respected."
      ],
      conclusion: "Some politicians are respected.",
      valid: true,
      explanation: "Valid: Some politicians → honest → respected, so at least some politicians are respected."
    },
    {
      premises: ["Only leaders can vote.", "Maya voted."],
      conclusion: "Maya is a leader.",
      valid: true,
      explanation: "Valid: If only leaders can vote, and Maya voted, Maya must be a leader."
    }
  ],
  3: [
    {
      premises: ["All A are B.", "All B are C.", "No C are D."],
      conclusion: "No A are D.",
      valid: true,
      explanation: "Valid: A→B→C, and no C are D, so no A can be D."
    },
    {
      premises: ["Some X are Y.", "All Y are Z.", "Some Z are W."],
      conclusion: "Some X are W.",
      valid: false,
      explanation: "Invalid: We cannot confirm which Z are W — the Y→Z group may not overlap the Z that are W."
    },
    {
      premises: ["If P then Q.", "If Q then R.", "P is true."],
      conclusion: "R is true.",
      valid: true,
      explanation: "Valid: Hypothetical syllogism — P→Q→R, so P implies R."
    },
    {
      premises: [
        "All artists are creative.",
        "Some creative people are engineers.",
        "All engineers are precise."
      ],
      conclusion: "All artists are precise.",
      valid: false,
      explanation: "Invalid: Only some creative people are engineers — artists may not be among those creative engineers."
    },
    {
      premises: [
        "No reptiles are warm-blooded.",
        "Some warm-blooded animals have wings.",
        "All birds have wings."
      ],
      conclusion: "Some birds are not reptiles.",
      valid: true,
      explanation: "Valid: Birds are warm-blooded (implied), no reptile is warm-blooded, so birds cannot be reptiles."
    }
  ]
};
function LogicQuiz({ config, onGameEnd }) {
  const questions = SYLLOGISMS[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [chosen, setChosen] = reactExports.useState(null);
  const [revealed, setRevealed] = reactExports.useState(false);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const totalRef = reactExports.useRef(total);
  totalRef.current = total;
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }
  function handleAnswer(answer) {
    if (revealed) return;
    const q2 = questions[idx % questions.length];
    setChosen(answer);
    setRevealed(true);
    setTotal((t) => t + 1);
    if (answer === q2.valid) {
      const pts = 250 * config.difficulty + timeLeft * 3;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1800);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      if (idx + 1 >= questions.length) {
        endGame(true);
        return;
      }
      setIdx((i) => i + 1);
      setChosen(null);
      setRevealed(false);
    }, 1800);
  }
  const q = questions[idx % questions.length];
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "logic_quiz.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#6366f1] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#6366f1]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Logic Quiz"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Evaluate syllogisms, deductive chains, and conditional arguments. Decide: is the conclusion logically VALID or INVALID?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#6366f1" },
                  "data-ocid": "logic_quiz.start_button",
                  children: "Analyze Arguments"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#6366f1]", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              idx + 1,
              "/",
              questions.length,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -40 },
              className: "flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#6366f1]/30 bg-card/40 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-[#6366f1] mb-2", children: "Premises" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 mb-4", children: q.premises.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "text-sm text-foreground/90 flex gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#6366f1] font-mono shrink-0", children: [
                          i + 1,
                          "."
                        ] }),
                        p
                      ]
                    },
                    `p-${i}`
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-1", children: "Conclusion" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-foreground", children: [
                      "Therefore: ",
                      q.conclusion
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground", children: "Is this argument logically valid?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [true, false].map((ans) => {
                  let cls = "border-border/30 bg-card/60 hover:border-[#6366f1]/50";
                  if (revealed && ans === q.valid)
                    cls = "border-[#10b981] bg-[#10b981]/10";
                  else if (revealed && ans === chosen && ans !== q.valid)
                    cls = "border-[#f43f5e] bg-[#f43f5e]/10";
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleAnswer(ans),
                      disabled: revealed,
                      className: `px-4 py-4 rounded-xl border-2 font-black text-lg transition-all ${cls} disabled:cursor-not-allowed`,
                      "data-ocid": `logic_quiz.answer.${ans ? "valid" : "invalid"}`,
                      children: ans ? "VALID" : "INVALID"
                    },
                    String(ans)
                  );
                }) }),
                revealed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: "rounded-lg border border-[#6366f1]/20 bg-[#6366f1]/5 p-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-bold mb-1",
                          style: {
                            color: chosen === q.valid ? "#10b981" : "#f43f5e"
                          },
                          children: chosen === q.valid ? "Correct!" : "Incorrect"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: q.explanation })
                    ]
                  }
                )
              ]
            },
            idx
          ) })
        ] })
      ]
    }
  );
}
const DEDUCTION_CASES = {
  1: [
    {
      title: "The Broken Window",
      scenario: "A classroom window was broken during recess. Five students were near the area. Use the clues to identify who broke it.",
      suspects: ["James", "Lucy", "Marco", "Nina", "Oscar"],
      clues: [
        "The culprit was wearing a red shirt.",
        "James and Marco were not wearing red.",
        "Lucy was inside the library during recess.",
        "Oscar was playing football far away.",
        "Nina was seen throwing a ball near the window."
      ],
      clueEliminations: {
        "0": [],
        "1": ["James", "Marco"],
        "2": ["Lucy"],
        "3": ["Oscar"],
        "4": []
      },
      answer: "Nina",
      explanation: "Clues eliminate James, Marco (no red shirt), Lucy (was in library), Oscar (far away). Nina was wearing red and throwing a ball near the window."
    }
  ],
  2: [
    {
      title: "The Missing Trophy",
      scenario: "The school trophy disappeared from the display case. Five people had access that evening. Deduce who took it.",
      suspects: [
        "Mr. Hart",
        "Coach Wells",
        "Student A",
        "Janitor Lee",
        "Secretary Pam"
      ],
      clues: [
        "The display case was opened with a master key.",
        "Only Mr. Hart and Janitor Lee have master keys.",
        "Mr. Hart was at a meeting with 20 witnesses at the time.",
        "Janitor Lee's key card shows access at 7:42pm — the exact time of the theft.",
        "The trophy was found in Janitor Lee's cleaning closet."
      ],
      clueEliminations: {
        "0": ["Student A", "Coach Wells", "Secretary Pam"],
        "1": [],
        "2": ["Mr. Hart"],
        "3": [],
        "4": []
      },
      answer: "Janitor Lee",
      explanation: "Only Hart and Lee have master keys. Hart has an alibi (meeting with 20 witnesses). Lee's key card logged access at the exact time of theft and the trophy was found in his closet."
    }
  ],
  3: [
    {
      title: "The Data Leak",
      scenario: "Confidential exam papers were leaked online. Five staff had digital access. Chain the evidence to find the source.",
      suspects: [
        "Dr. Evans",
        "Ms. Park",
        "Mr. Osei",
        "Tech Admin Lara",
        "Principal Webb"
      ],
      clues: [
        "The leak originated from an internal IP address registered to the exam office.",
        "Only Dr. Evans and Ms. Park work in the exam office.",
        "Dr. Evans logged out at 4pm; the leak timestamp is 4:47pm.",
        "Ms. Park's workstation shows activity at 4:45pm — 2 minutes before the upload.",
        "The uploaded file metadata shows Ms. Park's staff ID as the author."
      ],
      clueEliminations: {
        "0": ["Mr. Osei", "Tech Admin Lara", "Principal Webb"],
        "1": [],
        "2": ["Dr. Evans"],
        "3": [],
        "4": []
      },
      answer: "Ms. Park",
      explanation: "Only Evans and Park had exam office access. Evans logged out before the leak. Park had workstation activity 2 minutes before the upload, and the file metadata contains her staff ID."
    }
  ]
};
function DeductionMaster({ config, onGameEnd }) {
  const cases = DEDUCTION_CASES[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [caseIdx] = reactExports.useState(0);
  const [revealedClues, setRevealedClues] = reactExports.useState([]);
  const [eliminated, setEliminated] = reactExports.useState([]);
  const [accusation, setAccusation] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const phaseRef = reactExports.useRef(phase);
  phaseRef.current = phase;
  const startTimeRef = reactExports.useRef(Date.now());
  const c = cases[caseIdx];
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 100 : 30,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("deduction");
  }
  function revealClue(idx) {
    const id = String(idx);
    if (revealedClues.includes(id)) return;
    setRevealedClues((prev) => [...prev, id]);
    const newElim = c.clueEliminations[id] ?? [];
    setEliminated((prev) => [.../* @__PURE__ */ new Set([...prev, ...newElim])]);
    setScore((s) => s + 50 * config.difficulty);
  }
  function makeAccusation(suspect) {
    setAccusation(suspect);
    const correct = suspect === c.answer;
    const pts = correct ? 700 * config.difficulty + timeLeft * 5 : 0;
    if (correct) setScore((s) => s + pts);
    setTimeout(() => endGame(correct), 2500);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const activeSuspects = c.suspects.filter((s) => !eliminated.includes(s));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "deduction_master.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#eab308] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#eab308]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Deduction Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Reveal clues one by one. Each clue eliminates suspects. Chain the evidence to identify the one remaining culprit." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#eab308", color: "black" },
                  "data-ocid": "deduction_master.start_button",
                  children: "Open Dossier"
                }
              )
            ]
          }
        ),
        (phase === "deduction" || phase === "accusation") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#eab308] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Clues: ",
              revealedClues.length,
              "/",
              c.clues.length,
              " | Active:",
              " ",
              activeSuspects.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#eab308]/30 bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#eab308] text-sm", children: c.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: c.scenario })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: c.suspects.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `px-3 py-2 rounded-lg border text-xs font-bold transition-all ${eliminated.includes(s) ? "border-[#f43f5e]/30 bg-[#f43f5e]/5 text-muted-foreground line-through" : "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"}`,
              "data-ocid": `deduction_master.suspect.${i + 1}`,
              children: s
            },
            s
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Evidence Files — Click to reveal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: c.clues.map((clue, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => revealClue(i),
              className: `w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${revealedClues.includes(String(i)) ? "border-[#eab308]/50 bg-[#eab308]/10 text-foreground" : "border-border/30 bg-card/40 text-muted-foreground hover:border-[#eab308]/30"}`,
              "data-ocid": `deduction_master.clue.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#eab308] mr-2", children: [
                  "Clue ",
                  i + 1,
                  ":"
                ] }),
                revealedClues.includes(String(i)) ? clue : "[Click to reveal]"
              ]
            },
            `clue-${i}`
          )) }),
          revealedClues.length >= 2 && phase === "deduction" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPhase("accusation"),
              className: "self-center px-6 py-2 rounded-lg font-bold text-sm",
              style: { background: "#eab308", color: "black" },
              "data-ocid": "deduction_master.accuse_button",
              children: "Make Accusation"
            }
          ),
          phase === "accusation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground", children: "Who is the culprit?" }),
            c.suspects.map((suspect) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => makeAccusation(suspect),
                className: `w-full px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${accusation === suspect ? suspect === c.answer ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10" : eliminated.includes(suspect) ? "border-border/20 bg-card/20 text-muted-foreground/50" : "border-border/40 bg-card/60 hover:border-[#eab308]"}`,
                "data-ocid": `deduction_master.accuse.${suspect}`,
                children: suspect
              },
              suspect
            )),
            accusation && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: `rounded-lg p-3 text-xs border ${accusation === c.answer ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                children: [
                  accusation === c.answer ? "Correct! " : "Wrong. ",
                  c.explanation
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function LogicPuzzle({ config, onGameEnd }) {
  if (config.gameId === "logic-quiz")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LogicQuiz, { config, onGameEnd });
  if (config.gameId === "deduction-master")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DeductionMaster, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LogicGridMaster, { config, onGameEnd });
}
export {
  LogicPuzzle as default
};
