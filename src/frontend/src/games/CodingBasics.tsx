import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Code, Heart, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "./GameEngine";

interface CodeBlock {
  id: string;
  type: "print" | "for" | "if" | "var" | "end";
  content: string;
  indent: number;
  color: string;
}

interface Puzzle {
  title: string;
  description: string;
  hint: string;
  blocks: CodeBlock[];
  expectedOutput: string;
}

const BLOCK_COLORS: Record<CodeBlock["type"], string> = {
  print: "#00f5ff",
  for: "#7c3aed",
  if: "#f59e0b",
  var: "#10b981",
  end: "#6b7280",
};

const ALL_BLOCKS: CodeBlock[] = [
  {
    id: "print-hello",
    type: "print",
    content: "PRINT('Hello!')",
    indent: 0,
    color: BLOCK_COLORS.print,
  },
  {
    id: "print-world",
    type: "print",
    content: "PRINT('World')",
    indent: 0,
    color: BLOCK_COLORS.print,
  },
  {
    id: "print-i",
    type: "print",
    content: "PRINT(i)",
    indent: 1,
    color: BLOCK_COLORS.print,
  },
  {
    id: "print-result",
    type: "print",
    content: "PRINT('Yes')",
    indent: 1,
    color: BLOCK_COLORS.print,
  },
  {
    id: "for-123",
    type: "for",
    content: "FOR i IN [1, 2, 3]:",
    indent: 0,
    color: BLOCK_COLORS.for,
  },
  {
    id: "for-15",
    type: "for",
    content: "FOR i IN [1, 2, 3, 4, 5]:",
    indent: 0,
    color: BLOCK_COLORS.for,
  },
  {
    id: "if-10-5",
    type: "if",
    content: "IF 10 > 5:",
    indent: 0,
    color: BLOCK_COLORS.if,
  },
  {
    id: "if-x-0",
    type: "if",
    content: "IF x > 0:",
    indent: 0,
    color: BLOCK_COLORS.if,
  },
  {
    id: "var-x",
    type: "var",
    content: "x = 42",
    indent: 0,
    color: BLOCK_COLORS.var,
  },
  {
    id: "var-name",
    type: "var",
    content: "name = 'Alice'",
    indent: 0,
    color: BLOCK_COLORS.var,
  },
  {
    id: "end-for",
    type: "end",
    content: "END FOR",
    indent: 0,
    color: BLOCK_COLORS.end,
  },
  {
    id: "end-if",
    type: "end",
    content: "END IF",
    indent: 0,
    color: BLOCK_COLORS.end,
  },
];

const PUZZLES: Record<1 | 2 | 3, Puzzle[]> = {
  1: [
    {
      title: "Hello World",
      description: "Make the computer say 'Hello!'",
      hint: "Use the PRINT block with Hello! text",
      blocks: [ALL_BLOCKS[0]],
      expectedOutput: "Hello!",
    },
    {
      title: "Store a Value",
      description: "Store 42 in a variable called x",
      hint: "Use the VAR block to assign x",
      blocks: [ALL_BLOCKS[8]],
      expectedOutput: "42 stored in x",
    },
    {
      title: "Print World",
      description: "Print the word 'World' to the screen",
      hint: "Use the PRINT block with World text",
      blocks: [ALL_BLOCKS[1]],
      expectedOutput: "World",
    },
  ],
  2: [
    {
      title: "Count 1 to 3",
      description: "Use a loop to print numbers 1, 2, 3",
      hint: "Use FOR block then PRINT(i) inside",
      blocks: [ALL_BLOCKS[4], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3",
    },
    {
      title: "Greet User",
      description: "Store Alice's name and print Hello World",
      hint: "Set name variable, then PRINT",
      blocks: [ALL_BLOCKS[9], ALL_BLOCKS[0]],
      expectedOutput: "name = Alice\nHello!",
    },
    {
      title: "Five Items",
      description: "Loop through numbers 1 to 5 and print each",
      hint: "Use the FOR 1-5 block with PRINT(i)",
      blocks: [ALL_BLOCKS[5], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3\n4\n5",
    },
  ],
  3: [
    {
      title: "Greater Check",
      description: "Check if 10 is greater than 5 and print Yes",
      hint: "IF condition first, then PRINT inside",
      blocks: [ALL_BLOCKS[6], ALL_BLOCKS[3], ALL_BLOCKS[11]],
      expectedOutput: "Yes",
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
        ALL_BLOCKS[10],
      ],
      expectedOutput: "1\n2\n3",
    },
    {
      title: "Variable Logic",
      description: "Store x=42, loop 1-3, print each",
      hint: "VAR first, then FOR loop with PRINT",
      blocks: [ALL_BLOCKS[8], ALL_BLOCKS[4], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "42 stored in x\n1\n2\n3",
    },
  ],
};

function interpretBlocks(placed: CodeBlock[]): string {
  const lines: string[] = [];
  let loopActive = false;
  let loopRange: number[] = [];
  let loopBody: CodeBlock[] = [];
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
        // IF x > 0 — assume true for demo
        ifConditionMet = true;
      }
    } else if (block.type === "end") {
      if (loopActive) {
        loopActive = false;
        for (const i of loopRange) {
          for (const lb of loopBody) {
            if (lb.type === "print") {
              const c = lb.content
                .replace(/PRINT\((.+)\)/, "$1")
                .replace(/'/g, "");
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
          const c = block.content
            .replace(/PRINT\((.+)\)/, "$1")
            .replace(/'/g, "");
          lines.push(c);
        }
      } else {
        const c = block.content
          .replace(/PRINT\((.+)\)/, "$1")
          .replace(/'/g, "");
        lines.push(c);
      }
    }
  }
  return lines.join("\n");
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function CodingBasics({ config, onGameEnd }: Props) {
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [placed, setPlaced] = useState<CodeBlock[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const puzzles = PUZZLES[config.difficulty];
  const puzzle = puzzles[puzzleIdx];
  const toolbox = puzzle.blocks.filter(
    (b) => !placed.find((p) => p.id === b.id),
  );

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const accuracy = completed ? 100 : Math.max(0, 100 - (3 - lives) * 33);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed),
      );
    },
    [config, lives, onGameEnd],
  );

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
  }

  function handleDragStart(id: string) {
    setDraggingId(id);
  }

  function handleDropOnZone(e: React.DragEvent) {
    e.preventDefault();
    if (!draggingId) return;
    const block = puzzle.blocks.find((b) => b.id === draggingId);
    if (block && !placed.find((p) => p.id === block.id)) {
      setPlaced((prev) => [...prev, block]);
    }
    setDraggingId(null);
  }

  function handleRemoveBlock(id: string) {
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
      }, 2000);
    } else {
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) setTimeout(() => endGame(false), 500);
        return newL;
      });
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="coding_basics.page"
    >
      {/* HUD */}
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Code className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length heart row, positional index is stable
              key={`heart-${i}`}
              className={`h-4 w-4 ${
                i < lives
                  ? "text-[#f43f5e] fill-[#f43f5e]"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          Puzzle {puzzleIdx + 1}/{puzzles.length}
        </span>
      </div>

      {!gameStarted ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
          >
            <Code className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Coding Basics
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Drag code blocks into the program zone and press Execute to run
              them. Build the correct program to advance.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="coding_basics.start_button"
            >
              Start Coding
            </GlowButton>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {/* Puzzle title */}
          <div className="glass-card rounded-xl p-4 neon-top-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  className="font-black text-[#00f5ff] text-lg"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {puzzle.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {puzzle.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground border border-border/30 rounded px-2 py-1">
                Hint: {puzzle.hint}
              </span>
            </div>
          </div>

          <div className="flex gap-3 flex-1 overflow-hidden">
            {/* Toolbox */}
            <div
              className="w-48 shrink-0 flex flex-col gap-2"
              data-ocid="coding_basics.toolbox"
            >
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Blocks
              </p>
              {toolbox.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(block.id)}
                  className="px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing font-mono text-xs select-none transition-smooth hover:scale-105"
                  style={{
                    borderColor: `${block.color}60`,
                    backgroundColor: `${block.color}10`,
                    color: block.color,
                    paddingLeft: `${8 + block.indent * 12}px`,
                  }}
                  data-ocid={`coding_basics.block.${block.id}`}
                >
                  {block.content}
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div className="flex-1 flex flex-col gap-2">
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Program
              </p>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropOnZone}
                className={`flex-1 min-h-[120px] rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-smooth ${
                  draggingId
                    ? "border-[#00f5ff]/60 bg-[#00f5ff]/5"
                    : "border-border/30"
                }`}
                data-ocid="coding_basics.drop_zone"
              >
                {placed.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
                    Drop code blocks here
                  </div>
                ) : (
                  placed.map((block, i) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs"
                      style={{
                        borderColor: `${block.color}60`,
                        backgroundColor: `${block.color}15`,
                        color: block.color,
                        paddingLeft: `${8 + block.indent * 12}px`,
                      }}
                      data-ocid={`coding_basics.placed.${i + 1}`}
                    >
                      <span>{block.content}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="ml-2 text-muted-foreground hover:text-[#f43f5e] transition-smooth"
                        aria-label="Remove block"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Output panel */}
              {output !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`rounded-xl border p-3 font-mono text-xs whitespace-pre leading-5 ${
                    celebration
                      ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"
                  }`}
                  data-ocid="coding_basics.output"
                >
                  <span className="text-muted-foreground">Output: </span>
                  {output || "(empty)"}
                  {celebration && (
                    <span className="ml-2 text-[#10b981] font-bold">
                      {" "}
                      CORRECT!
                    </span>
                  )}
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex gap-2">
                <GlowButton
                  variant="primary"
                  size="sm"
                  onClick={handleExecute}
                  disabled={placed.length === 0 || celebration}
                  data-ocid="coding_basics.execute_button"
                >
                  <Play className="h-3 w-3" /> Execute
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPlaced([]);
                    setOutput(null);
                  }}
                  data-ocid="coding_basics.reset_button"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </GlowButton>
              </div>
            </div>
          </div>

          {/* Celebration overlay */}
          <AnimatePresence>
            {celebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                <div className="glass-card rounded-2xl p-8 text-center border-2 border-[#10b981] shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                  <CheckCircle className="h-16 w-16 mx-auto mb-3 text-[#10b981]" />
                  <p
                    className="text-2xl font-black text-[#10b981]"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    CORRECT!
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    +{300 * config.difficulty} pts
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
