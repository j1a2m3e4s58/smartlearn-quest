import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { S as Search } from "./search-D7BVAEw1.js";
import { P as Play } from "./play-BOp9WMuR.js";
import { R as RotateCcw } from "./rotate-ccw-D8U3V_vs.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 18 6-6-6-6", key: "eg8j8" }],
  ["path", { d: "m8 6-6 6 6 6", key: "ppft3o" }]
];
const Code = createLucideIcon("code", __iconNode);
function HUDHearts({ total, lives }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: total }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Heart,
    {
      className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
    },
    `h-${i}`
  )) });
}
const BLOCK_COLORS = {
  print: "#00f5ff",
  for: "#7c3aed",
  if: "#f59e0b",
  var: "#10b981",
  end: "#6b7280"
};
const ALL_BLOCKS = [
  {
    id: "print-hello",
    type: "print",
    content: "PRINT('Hello!')",
    indent: 0,
    color: BLOCK_COLORS.print
  },
  {
    id: "print-world",
    type: "print",
    content: "PRINT('World')",
    indent: 0,
    color: BLOCK_COLORS.print
  },
  {
    id: "print-i",
    type: "print",
    content: "PRINT(i)",
    indent: 1,
    color: BLOCK_COLORS.print
  },
  {
    id: "print-yes",
    type: "print",
    content: "PRINT('Yes')",
    indent: 1,
    color: BLOCK_COLORS.print
  },
  {
    id: "for-123",
    type: "for",
    content: "FOR i IN [1, 2, 3]:",
    indent: 0,
    color: BLOCK_COLORS.for
  },
  {
    id: "for-15",
    type: "for",
    content: "FOR i IN [1, 2, 3, 4, 5]:",
    indent: 0,
    color: BLOCK_COLORS.for
  },
  {
    id: "if-10-5",
    type: "if",
    content: "IF 10 > 5:",
    indent: 0,
    color: BLOCK_COLORS.if
  },
  {
    id: "if-x-0",
    type: "if",
    content: "IF x > 0:",
    indent: 0,
    color: BLOCK_COLORS.if
  },
  {
    id: "var-x",
    type: "var",
    content: "x = 42",
    indent: 0,
    color: BLOCK_COLORS.var
  },
  {
    id: "var-name",
    type: "var",
    content: "name = 'Alice'",
    indent: 0,
    color: BLOCK_COLORS.var
  },
  {
    id: "end-for",
    type: "end",
    content: "END FOR",
    indent: 0,
    color: BLOCK_COLORS.end
  },
  {
    id: "end-if",
    type: "end",
    content: "END IF",
    indent: 0,
    color: BLOCK_COLORS.end
  }
];
const PUZZLES = {
  1: [
    {
      title: "Hello World",
      description: "Make the computer say 'Hello!'",
      hint: "Use the PRINT block with Hello! text",
      blocks: [ALL_BLOCKS[0]],
      expectedOutput: "Hello!"
    },
    {
      title: "Store a Value",
      description: "Store 42 in a variable called x",
      hint: "Use the VAR block",
      blocks: [ALL_BLOCKS[8]],
      expectedOutput: "42 stored in x"
    },
    {
      title: "Print World",
      description: "Print the word 'World'",
      hint: "Use the PRINT(World) block",
      blocks: [ALL_BLOCKS[1]],
      expectedOutput: "World"
    }
  ],
  2: [
    {
      title: "Count 1 to 3",
      description: "Use a loop to print 1, 2, 3",
      hint: "FOR then PRINT(i) then END FOR",
      blocks: [ALL_BLOCKS[4], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3"
    },
    {
      title: "Greet User",
      description: "Store Alice's name then print Hello!",
      hint: "VAR then PRINT",
      blocks: [ALL_BLOCKS[9], ALL_BLOCKS[0]],
      expectedOutput: "name = Alice\nHello!"
    },
    {
      title: "Five Items",
      description: "Loop through 1 to 5, print each",
      hint: "FOR 1-5 with PRINT(i)",
      blocks: [ALL_BLOCKS[5], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3\n4\n5"
    }
  ],
  3: [
    {
      title: "Greater Check",
      description: "Check if 10 > 5 and print Yes",
      hint: "IF first, then PRINT inside",
      blocks: [ALL_BLOCKS[6], ALL_BLOCKS[3], ALL_BLOCKS[11]],
      expectedOutput: "Yes"
    },
    {
      title: "Conditional Loop",
      description: "Loop 1-3, check if i>0, print each",
      hint: "FOR, IF, PRINT, END IF, END FOR",
      blocks: [
        ALL_BLOCKS[4],
        ALL_BLOCKS[7],
        ALL_BLOCKS[2],
        ALL_BLOCKS[11],
        ALL_BLOCKS[10]
      ],
      expectedOutput: "1\n2\n3"
    },
    {
      title: "Variable Logic",
      description: "Store x=42, loop 1-3, print each",
      hint: "VAR first, then FOR loop with PRINT",
      blocks: [ALL_BLOCKS[8], ALL_BLOCKS[4], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "42 stored in x\n1\n2\n3"
    }
  ]
};
function interpretBlocks(placed) {
  const lines = [];
  let loopActive = false;
  let loopRange = [];
  let loopBody = [];
  let ifActive = false;
  let ifConditionMet = false;
  for (const block of placed) {
    if (block.type === "var") {
      const match = block.content.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) lines.push(`${match[1]} = ${match[2].replace(/'/g, "")}`);
    } else if (block.type === "for") {
      loopActive = true;
      loopBody = [];
      const nums = block.content.match(/\d+/g);
      loopRange = nums ? nums.map(Number) : [];
    } else if (block.type === "if") {
      ifActive = true;
      const match = block.content.match(/(\d+)\s*>\s*(\d+)/);
      ifConditionMet = match ? Number(match[1]) > Number(match[2]) : true;
    } else if (block.type === "end") {
      if (loopActive) {
        loopActive = false;
        for (const i of loopRange) {
          for (const lb of loopBody) {
            if (lb.type === "print") {
              const c = lb.content.replace(/PRINT\((.+)\)/, "$1").replace(/'/g, "");
              lines.push(c === "i" ? String(i) : c);
            }
          }
        }
      } else if (ifActive) {
        ifActive = false;
      }
    } else if (block.type === "print") {
      if (loopActive) {
        loopBody.push(block);
      } else if (ifActive) {
        if (ifConditionMet) {
          const c = block.content.replace(/PRINT\((.+)\)/, "$1").replace(/'/g, "");
          lines.push(c);
        }
      } else {
        const c = block.content.replace(/PRINT\((.+)\)/, "$1").replace(/'/g, "");
        lines.push(c);
      }
    }
  }
  return lines.join("\n");
}
function CodePuzzleGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [puzzleIdx, setPuzzleIdx] = reactExports.useState(0);
  const [placed, setPlaced] = reactExports.useState([]);
  const [output, setOutput] = reactExports.useState(null);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [celebration, setCelebration] = reactExports.useState(false);
  const [draggingId, setDraggingId] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const puzzles = PUZZLES[config.difficulty];
  const puzzle = puzzles[puzzleIdx];
  const toolbox = puzzle.blocks.filter(
    (b) => !placed.find((p) => p.id === b.id)
  );
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 100 : Math.max(0, 100 - (config.livesCount - lives) * 33),
          timeSpent,
          completed
        )
      );
    },
    [config, lives, onGameEnd]
  );
  function handleExecute() {
    const result = interpretBlocks(placed);
    setOutput(result);
    const trimmed = result.trim();
    const expected = puzzle.expectedOutput.trim();
    if (trimmed === expected) {
      setCelebration(true);
      setScore((s) => s + 300 * config.difficulty);
      setTimeout(() => {
        setCelebration(false);
        const next = puzzleIdx + 1;
        if (next >= puzzles.length) endGame(true);
        else {
          setPuzzleIdx(next);
          setPlaced([]);
          setOutput(null);
        }
      }, 2e3);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 500);
        return nl;
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "coding_basics.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Puzzle ",
            puzzleIdx + 1,
            "/",
            puzzles.length
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Code Puzzle"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Drag code blocks into the program zone in the correct order and press Execute to run them." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "coding_basics.start_button",
                  children: "Start Coding"
                }
              )
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-black text-[#00f5ff] text-lg",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: puzzle.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: puzzle.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground border border-border/30 rounded px-2 py-1 shrink-0", children: [
              "Hint: ",
              puzzle.hint
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-48 shrink-0 flex flex-col gap-2",
                "data-ocid": "coding_basics.toolbox",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "Blocks"
                    }
                  ),
                  toolbox.map((block) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      draggable: true,
                      onDragStart: () => setDraggingId(block.id),
                      className: "px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing font-mono text-xs select-none transition-smooth hover:scale-105",
                      style: {
                        borderColor: `${block.color}60`,
                        backgroundColor: `${block.color}10`,
                        color: block.color,
                        paddingLeft: `${8 + block.indent * 12}px`
                      },
                      "data-ocid": `coding_basics.block.${block.id}`,
                      children: block.content
                    },
                    block.id
                  ))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-muted-foreground mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Program"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  onDragOver: (e) => e.preventDefault(),
                  onDrop: (e) => {
                    e.preventDefault();
                    if (!draggingId) return;
                    const block = puzzle.blocks.find((b) => b.id === draggingId);
                    if (block && !placed.find((p) => p.id === block.id))
                      setPlaced((prev) => [...prev, block]);
                    setDraggingId(null);
                  },
                  className: `flex-1 min-h-[120px] rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-smooth ${draggingId ? "border-[#00f5ff]/60 bg-[#00f5ff]/5" : "border-border/30"}`,
                  "data-ocid": "coding_basics.drop_zone",
                  children: placed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-muted-foreground text-xs", children: "Drop code blocks here" }) : placed.map((block, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs",
                      style: {
                        borderColor: `${block.color}60`,
                        backgroundColor: `${block.color}15`,
                        color: block.color,
                        paddingLeft: `${8 + block.indent * 12}px`
                      },
                      "data-ocid": `coding_basics.placed.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: block.content }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              setPlaced(
                                (prev) => prev.filter((b) => b.id !== block.id)
                              );
                              setOutput(null);
                            },
                            className: "ml-2 text-muted-foreground hover:text-[#f43f5e] transition-smooth",
                            "aria-label": "Remove block",
                            children: "×"
                          }
                        )
                      ]
                    },
                    block.id
                  ))
                }
              ),
              output !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  className: `rounded-xl border p-3 font-mono text-xs whitespace-pre leading-5 ${celebration ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                  "data-ocid": "coding_basics.output",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Output: " }),
                    output || "(empty)",
                    celebration && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 font-bold", children: " CORRECT!" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleExecute,
                    disabled: placed.length === 0 || celebration,
                    "data-ocid": "coding_basics.execute_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
                      " Execute"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  GlowButton,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => {
                      setPlaced([]);
                      setOutput(null);
                    },
                    "data-ocid": "coding_basics.reset_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
                      " Reset"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: celebration && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.5 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 1.5 },
              className: "absolute inset-0 flex items-center justify-center pointer-events-none z-30",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-8 text-center border-2 border-[#10b981] shadow-[0_0_60px_rgba(16,185,129,0.4)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-16 w-16 mx-auto mb-3 text-[#10b981]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-2xl font-black text-[#10b981]",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "CORRECT!"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
                  "+",
                  300 * config.difficulty,
                  " pts"
                ] })
              ] })
            }
          ) })
        ] })
      ]
    }
  );
}
const VAR_PROGRAMS = {
  1: [
    {
      title: "Simple Assignment",
      steps: [
        {
          code: "x = 5",
          question: "What is x after this line?",
          varName: "x",
          correctValue: "5",
          explanation: "x is assigned the value 5."
        },
        {
          code: "x = x + 3",
          question: "What is x now?",
          varName: "x",
          correctValue: "8",
          explanation: "x was 5, then 5 + 3 = 8."
        },
        {
          code: "x = x * 2",
          question: "What is x now?",
          varName: "x",
          correctValue: "16",
          explanation: "x was 8, then 8 * 2 = 16."
        }
      ]
    },
    {
      title: "Two Variables",
      steps: [
        {
          code: "a = 10",
          question: "What is a?",
          varName: "a",
          correctValue: "10",
          explanation: "a is assigned 10."
        },
        {
          code: "b = 4",
          question: "What is b?",
          varName: "b",
          correctValue: "4",
          explanation: "b is assigned 4."
        },
        {
          code: "a = a - b",
          question: "What is a now?",
          varName: "a",
          correctValue: "6",
          explanation: "a was 10, b is 4, so 10 - 4 = 6."
        }
      ]
    }
  ],
  2: [
    {
      title: "Counter Loop",
      steps: [
        {
          code: "count = 0",
          question: "What is count?",
          varName: "count",
          correctValue: "0",
          explanation: "count is initialized to 0."
        },
        {
          code: "count = count + 1  // loop runs 3 times",
          question: "After 3 iterations what is count?",
          varName: "count",
          correctValue: "3",
          explanation: "Starting at 0, adding 1 three times gives 3."
        },
        {
          code: "total = count * 10",
          question: "What is total?",
          varName: "total",
          correctValue: "30",
          explanation: "count is 3, so 3 * 10 = 30."
        },
        {
          code: "total = total / 2",
          question: "What is total now?",
          varName: "total",
          correctValue: "15",
          explanation: "30 / 2 = 15."
        }
      ]
    }
  ],
  3: [
    {
      title: "Swap Variables",
      steps: [
        {
          code: "x = 7",
          question: "What is x?",
          varName: "x",
          correctValue: "7",
          explanation: "x is 7."
        },
        {
          code: "y = 3",
          question: "What is y?",
          varName: "y",
          correctValue: "3",
          explanation: "y is 3."
        },
        {
          code: "temp = x",
          question: "What is temp?",
          varName: "temp",
          correctValue: "7",
          explanation: "temp copies x which is 7."
        },
        {
          code: "x = y",
          question: "What is x now?",
          varName: "x",
          correctValue: "3",
          explanation: "x now holds y's value: 3."
        },
        {
          code: "y = temp",
          question: "What is y now?",
          varName: "y",
          correctValue: "7",
          explanation: "y now holds temp's value: 7. Swap complete!"
        }
      ]
    }
  ]
};
function VariableVaultGame({ config, onGameEnd }) {
  const programs = VAR_PROGRAMS[config.difficulty];
  const [programIdx, setProgramIdx] = reactExports.useState(0);
  const [stepIdx, setStepIdx] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const program = programs[programIdx];
  const step = program == null ? void 0 : program.steps[stepIdx];
  const totalSteps = programs.reduce((s, p) => s + p.steps.length, 0);
  const completedSteps = programs.slice(0, programIdx).reduce((s, p) => s + p.steps.length, 0) + stepIdx;
  function handleSubmit() {
    if (!step || feedback) return;
    const correct = input.trim() === step.correctValue;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setScore((s) => s + 200 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (livesRef.current <= 0) return;
      const nextStep = stepIdx + 1;
      if (nextStep >= program.steps.length) {
        const nextProg = programIdx + 1;
        if (nextProg >= programs.length) {
          endGame(true);
          return;
        }
        setProgramIdx(nextProg);
        setStepIdx(0);
      } else {
        setStepIdx(nextStep);
      }
    }, 1800);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "variable_vault.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-14 w-14 mx-auto mb-4 text-[#10b981]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { color: "#10b981", fontFamily: "'Orbitron', sans-serif" },
                  children: "Variable Vault"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Watch code execute step by step. Predict the current value of the highlighted variable after each line runs." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "variable_vault.start_button",
                  children: "Start Tracing"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "variable_vault.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Step ",
            completedSteps + 1,
            "/",
            totalSteps
          ] })
        ] }),
        step && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: program.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm rounded-lg p-3 border border-[#10b981]/30 bg-[#10b981]/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: ">>> " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: step.code })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-5 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-foreground mb-1", children: step.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
              "What is the value of",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[#10b981] font-bold", children: step.varName }),
              " ",
              "after this line executes?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") handleSubmit();
                  },
                  placeholder: "Enter value...",
                  className: "flex-1 bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#10b981]/70",
                  "data-ocid": "variable_vault.input",
                  disabled: !!feedback
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "sm",
                  onClick: handleSubmit,
                  disabled: !input.trim() || !!feedback,
                  "data-ocid": "variable_vault.submit_button",
                  children: "Check"
                }
              )
            ] }),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 4 },
                animate: { opacity: 1, y: 0 },
                className: `mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${feedback === "correct" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
                "data-ocid": feedback === "correct" ? "variable_vault.success_state" : "variable_vault.error_state",
                children: [
                  feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    feedback === "correct" ? "Correct! " : `The answer was ${step.correctValue}. `,
                    step.explanation
                  ] })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const LOOP_CHALLENGES = {
  1: [
    {
      code: ["FOR i IN [1, 2, 3]:", "  PRINT(i)", "END FOR"],
      questionCount: "How many times does the loop run?",
      questionOutput: "What is the last value printed?",
      correctCount: "3",
      correctOutput: "3",
      explanation: "The loop runs once for each item in [1, 2, 3] = 3 times. Last printed value is 3."
    },
    {
      code: ["FOR i IN [1, 2, 3, 4, 5]:", "  PRINT(i * 2)", "END FOR"],
      questionCount: "How many iterations?",
      questionOutput: "What is the last value printed?",
      correctCount: "5",
      correctOutput: "10",
      explanation: "5 iterations. Last value: i=5 so 5*2=10."
    },
    {
      code: ["x = 0", "WHILE x < 3:", "  x = x + 1", "END WHILE"],
      questionCount: "How many times does the loop body run?",
      questionOutput: "What is x when the loop ends?",
      correctCount: "3",
      correctOutput: "3",
      explanation: "x goes 0→1→2→3. Loop runs 3 times, ends when x=3."
    }
  ],
  2: [
    {
      code: ["sum = 0", "FOR i IN [1, 2, 3, 4]:", "  sum = sum + i", "END FOR"],
      questionCount: "How many iterations?",
      questionOutput: "What is the final value of sum?",
      correctCount: "4",
      correctOutput: "10",
      explanation: "4 iterations. sum = 0+1+2+3+4 = 10."
    },
    {
      code: ["x = 10", "WHILE x > 5:", "  x = x - 2", "END WHILE"],
      questionCount: "How many times does the loop run?",
      questionOutput: "What is x when done?",
      correctCount: "3",
      correctOutput: "4",
      explanation: "x: 10→8→6→4. Runs 3 times. x=4 when loop ends."
    }
  ],
  3: [
    {
      code: [
        "count = 0",
        "FOR i IN [1, 2, 3]:",
        "  FOR j IN [1, 2]:",
        "    count = count + 1",
        "  END FOR",
        "END FOR"
      ],
      questionCount: "Total iterations of inner loop?",
      questionOutput: "Final value of count?",
      correctCount: "6",
      correctOutput: "6",
      explanation: "Outer runs 3 times, inner runs 2 times each = 3*2 = 6 total."
    },
    {
      code: [
        "result = 1",
        "FOR i IN [1, 2, 3, 4]:",
        "  result = result * 2",
        "END FOR"
      ],
      questionCount: "How many iterations?",
      questionOutput: "What is result at the end?",
      correctCount: "4",
      correctOutput: "16",
      explanation: "4 iterations. result: 1→2→4→8→16."
    }
  ]
};
function LoopLabyrinthGame({ config, onGameEnd }) {
  const challenges = LOOP_CHALLENGES[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [countAnswer, setCountAnswer] = reactExports.useState("");
  const [outputAnswer, setOutputAnswer] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const challenge = challenges[idx];
  function handleSubmit() {
    if (!challenge || feedback) return;
    const countCorrect = countAnswer.trim() === challenge.correctCount;
    const outputCorrect = outputAnswer.trim() === challenge.correctOutput;
    const bothCorrect = countCorrect && outputCorrect;
    setFeedback(bothCorrect ? "correct" : "wrong");
    if (bothCorrect) {
      setScore((s) => s + 350 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 1800);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      setFeedback(null);
      setCountAnswer("");
      setOutputAnswer("");
      const next = idx + 1;
      if (next >= challenges.length) endGame(true);
      else setIdx(next);
    }, 2e3);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "loop_labyrinth.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Loop Labyrinth"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Read the loop code and predict: how many times does it run, and what is the final output value?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "loop_labyrinth.start_button",
                  children: "Enter Labyrinth"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "loop_labyrinth.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#7c3aed]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Challenge ",
            idx + 1,
            "/",
            challenges.length
          ] })
        ] }),
        challenge && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground mb-3",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "Read the Loop"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm rounded-lg p-3 border border-[#7c3aed]/30 bg-[#7c3aed]/5 space-y-1", children: challenge.code.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: { paddingLeft: line.startsWith(" ") ? "20px" : "0" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#7c3aed]", children: [
                    String(i + 1).padStart(2, " "),
                    " "
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: line.trimStart() })
                ]
              },
              `line-${i}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mb-3", children: challenge.questionCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: countAnswer,
                  onChange: (e) => setCountAnswer(e.target.value),
                  placeholder: "Enter number...",
                  className: "w-full bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#7c3aed]/70",
                  "data-ocid": "loop_labyrinth.count_input",
                  disabled: !!feedback
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mb-3", children: challenge.questionOutput }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: outputAnswer,
                  onChange: (e) => setOutputAnswer(e.target.value),
                  placeholder: "Enter value...",
                  className: "w-full bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#7c3aed]/70",
                  "data-ocid": "loop_labyrinth.output_input",
                  disabled: !!feedback
                }
              )
            ] })
          ] }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              className: `p-3 rounded-lg text-sm ${feedback === "correct" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              "data-ocid": feedback === "correct" ? "loop_labyrinth.success_state" : "loop_labyrinth.error_state",
              children: [
                feedback === "correct" ? "Correct! " : `Not quite. Count=${challenge.correctCount}, Output=${challenge.correctOutput}. `,
                challenge.explanation
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: handleSubmit,
              disabled: !countAnswer.trim() || !outputAnswer.trim() || !!feedback,
              "data-ocid": "loop_labyrinth.submit_button",
              children: "Submit Prediction"
            }
          )
        ] })
      ]
    }
  );
}
const BUG_SNIPPETS = {
  1: [
    {
      title: "Print Greeting",
      lines: ["name = 'Alice'", "PRINT(nam)"],
      bugLine: 1,
      fixes: ["PRINT(name)", "PRINT('Alice')", "name = PRINT"],
      correctFix: "PRINT(name)",
      explanation: "'nam' is misspelled — it should be 'name' to match the variable."
    },
    {
      title: "Add Numbers",
      lines: ["a = 5", "b = 3", "result = a - b", "PRINT(result)"],
      bugLine: 2,
      fixes: ["result = a + b", "result = a * b", "result = b - a"],
      correctFix: "result = a + b",
      explanation: "The task is addition, not subtraction. Should be a + b."
    },
    {
      title: "Check Positive",
      lines: ["x = 7", "IF x = 0:", "  PRINT('Positive')", "END IF"],
      bugLine: 1,
      fixes: ["IF x > 0:", "IF x == 0:", "IF 0 > x:"],
      correctFix: "IF x > 0:",
      explanation: "The condition should check if x is greater than 0, not equal to 0."
    }
  ],
  2: [
    {
      title: "Count Loop",
      lines: [
        "FOR i IN [1, 2, 3, 4, 5]:",
        "  PRINT(i)",
        "END FOR",
        "PRINT('Total:', 6)"
      ],
      bugLine: 3,
      fixes: ["PRINT('Total:', 5)", "PRINT('Count:', 6)", "PRINT(i)"],
      correctFix: "PRINT('Total:', 5)",
      explanation: "The loop has 5 elements (1-5), so total should be 5 not 6. Off-by-one error."
    },
    {
      title: "Divide Values",
      lines: ["total = 100", "parts = 0", "result = total / parts"],
      bugLine: 2,
      fixes: ["result = total / 4", "parts = 4", "total = 0"],
      correctFix: "parts = 4",
      explanation: "Dividing by zero causes a runtime error. parts must be set to a non-zero value before division."
    }
  ],
  3: [
    {
      title: "Nested Logic",
      lines: [
        "score = 85",
        "IF score > 100:",
        "  grade = 'A'",
        "ELSE IF score > 70:",
        "  grade = 'B'",
        "END IF"
      ],
      bugLine: 1,
      fixes: ["IF score >= 90:", "IF score > 70:", "IF score == 85:"],
      correctFix: "IF score >= 90:",
      explanation: "Score 85 should not trigger 'A'. The A-grade boundary should be >= 90."
    },
    {
      title: "String Comparison",
      lines: [
        "password = 'secret123'",
        "input = 'Secret123'",
        "IF password = input:",
        "  PRINT('Access granted')",
        "END IF"
      ],
      bugLine: 2,
      fixes: [
        "IF password == input:",
        "IF LOWERCASE(password) == LOWERCASE(input):",
        "IF password != input:"
      ],
      correctFix: "IF LOWERCASE(password) == LOWERCASE(input):",
      explanation: "Passwords are case-sensitive but the check should use == not =. Also the case mismatch 's' vs 'S' means they won't match."
    }
  ]
};
function DebugDetectiveGame({ config, onGameEnd }) {
  const snippets = BUG_SNIPPETS[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [selectedLine, setSelectedLine] = reactExports.useState(null);
  const [selectedFix, setSelectedFix] = reactExports.useState(null);
  const [phase, setPhase] = reactExports.useState(
    "pick-line"
  );
  const [correct, setCorrect] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 88 : 45,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const snippet = snippets[idx];
  function handleLineClick(lineIdx) {
    if (phase !== "pick-line") return;
    setSelectedLine(lineIdx);
    setPhase("pick-fix");
  }
  function handleFixClick(fix) {
    if (phase !== "pick-fix" || !snippet) return;
    setSelectedFix(fix);
    const lineCorrect = selectedLine === snippet.bugLine;
    const fixCorrect = fix === snippet.correctFix;
    const isCorrect = lineCorrect && fixCorrect;
    setCorrect(isCorrect);
    setPhase("feedback");
    if (isCorrect) {
      setScore((s) => s + 400 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 2e3);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      setPhase("pick-line");
      setSelectedLine(null);
      setSelectedFix(null);
      const next = idx + 1;
      if (next >= snippets.length) endGame(true);
      else setIdx(next);
    }, 2200);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "debug_detective.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Debug Detective"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Each code snippet has exactly one bug. Click the wrong line to identify it, then select the correct fix." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "debug_detective.start_button",
                  children: "Start Investigation"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "debug_detective.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#f59e0b]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Case ",
            idx + 1,
            "/",
            snippets.length
          ] })
        ] }),
        snippet && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-black text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: snippet.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: phase === "pick-line" ? "Click the buggy line" : phase === "pick-fix" ? "Select the correct fix" : "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-[#f59e0b]/30 overflow-hidden", children: snippet.lines.map((line, i) => {
              const isBugLine = phase === "feedback" && i === snippet.bugLine;
              const isSelected = selectedLine === i;
              const lineStyle = {
                background: isBugLine ? "rgba(244,63,94,0.15)" : isSelected ? "rgba(245,158,11,0.15)" : "transparent",
                borderLeft: isBugLine ? "3px solid #f43f5e" : isSelected ? "3px solid #f59e0b" : "3px solid transparent"
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleLineClick(i),
                  disabled: phase !== "pick-line",
                  className: "w-full text-left flex items-start gap-3 px-3 py-2 font-mono text-sm hover:bg-[#f59e0b]/10 transition-smooth disabled:cursor-default",
                  style: lineStyle,
                  "data-ocid": `debug_detective.line.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-4 shrink-0 text-right", children: i + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: line })
                  ]
                },
                `line-${i}`
              );
            }) })
          ] }),
          phase === "pick-fix" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-xl p-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-3", children: [
                  "Replace line ",
                  (selectedLine ?? 0) + 1,
                  " with:"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: snippet.fixes.map((fix, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleFixClick(fix),
                    className: "text-left px-3 py-2 rounded-lg border border-border/40 font-mono text-sm hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 transition-smooth",
                    "data-ocid": `debug_detective.fix.${i + 1}`,
                    children: fix
                  },
                  `fix-${i}`
                )) })
              ]
            }
          ) }),
          phase === "feedback" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              className: `p-3 rounded-lg text-sm flex items-start gap-2 ${correct ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: [
                correct ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  correct ? "Bug found and fixed! " : `Bug was on line ${snippet.bugLine + 1}, fix: ${snippet.correctFix}. `,
                  snippet.explanation
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const ALGORITHMS = [
  {
    title: "Making a Cup of Tea",
    steps: [
      "Boil water in the kettle",
      "Place a tea bag in the cup",
      "Pour boiling water into the cup",
      "Wait 3 minutes for tea to brew",
      "Remove the tea bag",
      "Add milk or sugar if desired",
      "Stir the tea",
      "Enjoy your tea"
    ]
  },
  {
    title: "ATM Cash Withdrawal",
    steps: [
      "Insert bank card into the ATM",
      "Enter your PIN number",
      "Select 'Withdraw Cash' option",
      "Enter the amount you want",
      "Confirm the transaction",
      "Collect your cash",
      "Take your receipt"
    ]
  },
  {
    title: "Bubble Sort Algorithm",
    steps: [
      "Start at the first element of the list",
      "Compare current element with the next",
      "If current > next, swap them",
      "Move to the next pair",
      "Repeat until end of list",
      "If any swap occurred, repeat from start"
    ]
  },
  {
    title: "School Morning Routine",
    steps: [
      "Wake up and turn off alarm",
      "Brush teeth and wash face",
      "Get dressed in school uniform",
      "Eat breakfast",
      "Pack school bag with books and items"
    ]
  },
  {
    title: "Search Engine Query",
    steps: [
      "User types keywords into the search box",
      "Search engine tokenizes the query",
      "Index lookup finds matching documents",
      "Ranking algorithm scores each result",
      "Top results are returned to user"
    ]
  }
];
function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function AlgorithmArenaGame({ config, onGameEnd }) {
  const countByDiff = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5;
  const [algos] = reactExports.useState(() => shuffleArr(ALGORITHMS).slice(0, countByDiff));
  const [algoIdx, setAlgoIdx] = reactExports.useState(0);
  const [shuffled, setShuffled] = reactExports.useState(
    () => shuffleArr(algos[0].steps)
  );
  const [placed, setPlaced] = reactExports.useState([]);
  const [draggingStep, setDraggingStep] = reactExports.useState(null);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 92 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const algo = algos[algoIdx];
  const available = shuffled.filter((s) => !placed.includes(s));
  function handleCheck() {
    if (!algo || feedback) return;
    const isCorrect = placed.every((step, i) => step === algo.steps[i]) && placed.length === algo.steps.length;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 300 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 2e3);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      setFeedback(null);
      const next = algoIdx + 1;
      if (next >= algos.length) {
        endGame(true);
        return;
      }
      setAlgoIdx(next);
      setShuffled(shuffleArr(algos[next].steps));
      setPlaced([]);
    }, 2200);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "algorithm_arena.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-14 w-14 mx-auto mb-4 text-[#f43f5e]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Algorithm Arena"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Steps for real-world algorithms are shown scrambled. Drag them into the correct sequence to complete the process." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "algorithm_arena.start_button",
                  children: "Enter Arena"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "algorithm_arena.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#f43f5e]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Algorithm ",
            algoIdx + 1,
            "/",
            algos.length
          ] })
        ] }),
        algo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "Steps (scrambled)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex flex-col gap-2", children: available.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                draggable: true,
                onDragStart: () => setDraggingStep(step),
                className: "px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-sm cursor-grab active:cursor-grabbing hover:border-[#f43f5e]/50 transition-smooth",
                "data-ocid": `algorithm_arena.step.${i + 1}`,
                children: step
              },
              step
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: algo.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  e.preventDefault();
                  if (!draggingStep) return;
                  if (!placed.includes(draggingStep))
                    setPlaced((p) => [...p, draggingStep]);
                  setDraggingStep(null);
                },
                className: `flex-1 min-h-[100px] rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-smooth overflow-y-auto ${draggingStep ? "border-[#f43f5e]/60 bg-[#f43f5e]/5" : "border-border/30"}`,
                "data-ocid": "algorithm_arena.sequence_zone",
                children: placed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs text-center mt-4", children: "Drop steps here in order" }) : placed.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 px-3 py-2 rounded-lg border border-[#f43f5e]/30 bg-[#f43f5e]/5 text-sm",
                    "data-ocid": `algorithm_arena.placed.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f43f5e] font-bold w-5 shrink-0", children: [
                        i + 1,
                        "."
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground flex-1", children: step }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setPlaced((p) => p.filter((s) => s !== step)),
                          className: "text-muted-foreground hover:text-[#f43f5e] transition-smooth text-xs",
                          "aria-label": "Remove step",
                          children: "×"
                        }
                      )
                    ]
                  },
                  step
                ))
              }
            ),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: `p-3 rounded-lg text-sm ${feedback === "correct" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
                children: feedback === "correct" ? "Correct sequence!" : "Order incorrect. Study the correct sequence and try again."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              GlowButton,
              {
                variant: "primary",
                size: "sm",
                onClick: handleCheck,
                disabled: placed.length !== algo.steps.length || !!feedback,
                "data-ocid": "algorithm_arena.check_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
                  " Check Order"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CodingBasics({ config, onGameEnd }) {
  const id = config.gameId;
  if (id === "variable-vault")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(VariableVaultGame, { config, onGameEnd });
  if (id === "loop-labyrinth")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoopLabyrinthGame, { config, onGameEnd });
  if (id === "debug-detective")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DebugDetectiveGame, { config, onGameEnd });
  if (id === "algorithm-arena")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlgorithmArenaGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CodePuzzleGame, { config, onGameEnd });
}
export {
  CodingBasics as default
};
