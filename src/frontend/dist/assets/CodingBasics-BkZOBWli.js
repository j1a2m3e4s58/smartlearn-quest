import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-YNz7x6b_.js";
import { b as buildResult, H as Heart } from "./GameEngine-C6-gOS55.js";
import { P as Play } from "./play-C4PekZaW.js";
import { R as RotateCcw } from "./rotate-ccw-CgMobSEI.js";
import { C as CircleCheckBig } from "./circle-check-big-CtJI2EqC.js";
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
    id: "print-result",
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
      hint: "Use the VAR block to assign x",
      blocks: [ALL_BLOCKS[8]],
      expectedOutput: "42 stored in x"
    },
    {
      title: "Print World",
      description: "Print the word 'World' to the screen",
      hint: "Use the PRINT block with World text",
      blocks: [ALL_BLOCKS[1]],
      expectedOutput: "World"
    }
  ],
  2: [
    {
      title: "Count 1 to 3",
      description: "Use a loop to print numbers 1, 2, 3",
      hint: "Use FOR block then PRINT(i) inside",
      blocks: [ALL_BLOCKS[4], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3"
    },
    {
      title: "Greet User",
      description: "Store Alice's name and print Hello World",
      hint: "Set name variable, then PRINT",
      blocks: [ALL_BLOCKS[9], ALL_BLOCKS[0]],
      expectedOutput: "name = Alice\nHello!"
    },
    {
      title: "Five Items",
      description: "Loop through numbers 1 to 5 and print each",
      hint: "Use the FOR 1-5 block with PRINT(i)",
      blocks: [ALL_BLOCKS[5], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3\n4\n5"
    }
  ],
  3: [
    {
      title: "Greater Check",
      description: "Check if 10 is greater than 5 and print Yes",
      hint: "IF condition first, then PRINT inside",
      blocks: [ALL_BLOCKS[6], ALL_BLOCKS[3], ALL_BLOCKS[11]],
      expectedOutput: "Yes"
    },
    {
      title: "Conditional Loop",
      description: "Loop 1-3 and check if i > 0 inside the loop",
      hint: "FOR, then IF, then PRINT, then END IF, END FOR",
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
      ifConditionMet = match ? Number(match[1]) > Number(match[2]) : false;
      if (!match) {
        ifConditionMet = true;
      }
    } else if (block.type === "end") {
      if (loopActive) {
        loopActive = false;
        for (const i of loopRange) {
          for (const lb of loopBody) {
            if (lb.type === "print") {
              const c = lb.content.replace(/PRINT\((.+)\)/, "$1").replace(/'/g, "");
              lines.push(c === "i" ? String(i) : c);
            } else if (lb.type === "if") {
              ifConditionMet = i > 0;
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
function CodingBasics({ config, onGameEnd }) {
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
  const scoreRef = reactExports.useRef(score);
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
      const accuracy = completed ? 100 : Math.max(0, 100 - (3 - lives) * 33);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed)
      );
    },
    [config, lives, onGameEnd]
  );
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
  }
  function handleDragStart(id) {
    setDraggingId(id);
  }
  function handleDropOnZone(e) {
    e.preventDefault();
    if (!draggingId) return;
    const block = puzzle.blocks.find((b) => b.id === draggingId);
    if (block && !placed.find((p) => p.id === block.id)) {
      setPlaced((prev) => [...prev, block]);
    }
    setDraggingId(null);
  }
  function handleRemoveBlock(id) {
    setPlaced((prev) => prev.filter((b) => b.id !== id));
    setOutput(null);
  }
  function handleExecute() {
    const result = interpretBlocks(placed);
    setOutput(result);
    const trimmedResult = result.trim().replace(/\r/g, "");
    const expected = puzzle.expectedOutput.trim().replace(/\r/g, "");
    if (trimmedResult === expected) {
      setCelebration(true);
      setScore((s) => s + 300 * config.difficulty);
      setTimeout(() => {
        setCelebration(false);
        const nextIdx = puzzleIdx + 1;
        if (nextIdx >= puzzles.length) {
          endGame(true);
        } else {
          setPuzzleIdx(nextIdx);
          setPlaced([]);
          setOutput(null);
        }
      }, 2e3);
    } else {
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) setTimeout(() => endGame(false), 500);
        return newL;
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `heart-${i}`
          )) }),
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
                  children: "Coding Basics"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Drag code blocks into the program zone and press Execute to run them. Build the correct program to advance." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground border border-border/30 rounded px-2 py-1", children: [
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
                      onDragStart: () => handleDragStart(block.id),
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
                  onDrop: handleDropOnZone,
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
                            onClick: () => handleRemoveBlock(block.id),
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
                    celebration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[#10b981] font-bold", children: [
                      " ",
                      "CORRECT!"
                    ] })
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
export {
  CodingBasics as default
};
