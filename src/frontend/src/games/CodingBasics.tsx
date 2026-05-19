import { GlowButton } from "@/components/ui/GlowButton";
import {
  CheckCircle,
  Code,
  Heart,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "./GameEngine";

// ─── Shared helpers ────────────────────────────────────────────────────────────

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

function HUDHearts({ total, lives }: { total: number; lives: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <Heart
          key={`h-${i}`}
          className={`h-4 w-4 ${
            i < lives
              ? "text-[#f43f5e] fill-[#f43f5e]"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Code Puzzle (block-ordering) ──────────────────────────────────────────────

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
    id: "print-yes",
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
      hint: "Use the VAR block",
      blocks: [ALL_BLOCKS[8]],
      expectedOutput: "42 stored in x",
    },
    {
      title: "Print World",
      description: "Print the word 'World'",
      hint: "Use the PRINT(World) block",
      blocks: [ALL_BLOCKS[1]],
      expectedOutput: "World",
    },
  ],
  2: [
    {
      title: "Count 1 to 3",
      description: "Use a loop to print 1, 2, 3",
      hint: "FOR then PRINT(i) then END FOR",
      blocks: [ALL_BLOCKS[4], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3",
    },
    {
      title: "Greet User",
      description: "Store Alice's name then print Hello!",
      hint: "VAR then PRINT",
      blocks: [ALL_BLOCKS[9], ALL_BLOCKS[0]],
      expectedOutput: "name = Alice\nHello!",
    },
    {
      title: "Five Items",
      description: "Loop through 1 to 5, print each",
      hint: "FOR 1-5 with PRINT(i)",
      blocks: [ALL_BLOCKS[5], ALL_BLOCKS[2], ALL_BLOCKS[10]],
      expectedOutput: "1\n2\n3\n4\n5",
    },
  ],
  3: [
    {
      title: "Greater Check",
      description: "Check if 10 > 5 and print Yes",
      hint: "IF first, then PRINT inside",
      blocks: [ALL_BLOCKS[6], ALL_BLOCKS[3], ALL_BLOCKS[11]],
      expectedOutput: "Yes",
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
      ifConditionMet = match ? Number(match[1]) > Number(match[2]) : true;
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

function CodePuzzleGame({ config, onGameEnd }: Props) {
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
  const scoreRef = useRef(0);
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
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 100 : Math.max(0, 100 - (config.livesCount - lives) * 33),
          timeSpent,
          completed,
        ),
      );
    },
    [config, lives, onGameEnd],
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
      }, 2000);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 500);
        return nl;
      });
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="coding_basics.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Code className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
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
              Code Puzzle
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Drag code blocks into the program zone in the correct order and
              press Execute to run them.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTimeRef.current = Date.now();
                gameOverRef.current = false;
                setGameStarted(true);
              }}
              data-ocid="coding_basics.start_button"
            >
              Start Coding
            </GlowButton>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
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
              <span className="text-xs text-muted-foreground border border-border/30 rounded px-2 py-1 shrink-0">
                Hint: {puzzle.hint}
              </span>
            </div>
          </div>
          <div className="flex gap-3 flex-1 overflow-hidden">
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
                  onDragStart={() => setDraggingId(block.id)}
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
            <div className="flex-1 flex flex-col gap-2">
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Program
              </p>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggingId) return;
                  const block = puzzle.blocks.find((b) => b.id === draggingId);
                  if (block && !placed.find((p) => p.id === block.id))
                    setPlaced((prev) => [...prev, block]);
                  setDraggingId(null);
                }}
                className={`flex-1 min-h-[120px] rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-smooth ${draggingId ? "border-[#00f5ff]/60 bg-[#00f5ff]/5" : "border-border/30"}`}
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
                        onClick={() => {
                          setPlaced((prev) =>
                            prev.filter((b) => b.id !== block.id),
                          );
                          setOutput(null);
                        }}
                        className="ml-2 text-muted-foreground hover:text-[#f43f5e] transition-smooth"
                        aria-label="Remove block"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              {output !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`rounded-xl border p-3 font-mono text-xs whitespace-pre leading-5 ${celebration ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                  data-ocid="coding_basics.output"
                >
                  <span className="text-muted-foreground">Output: </span>
                  {output || "(empty)"}
                  {celebration && (
                    <span className="ml-2 font-bold"> CORRECT!</span>
                  )}
                </motion.div>
              )}
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

// ─── Variable Vault (variable trace) ─────────────────────────────────────────

interface VarStep {
  code: string;
  question: string;
  varName: string;
  correctValue: string;
  explanation: string;
}

interface VarProgram {
  title: string;
  steps: VarStep[];
}

const VAR_PROGRAMS: Record<1 | 2 | 3, VarProgram[]> = {
  1: [
    {
      title: "Simple Assignment",
      steps: [
        {
          code: "x = 5",
          question: "What is x after this line?",
          varName: "x",
          correctValue: "5",
          explanation: "x is assigned the value 5.",
        },
        {
          code: "x = x + 3",
          question: "What is x now?",
          varName: "x",
          correctValue: "8",
          explanation: "x was 5, then 5 + 3 = 8.",
        },
        {
          code: "x = x * 2",
          question: "What is x now?",
          varName: "x",
          correctValue: "16",
          explanation: "x was 8, then 8 * 2 = 16.",
        },
      ],
    },
    {
      title: "Two Variables",
      steps: [
        {
          code: "a = 10",
          question: "What is a?",
          varName: "a",
          correctValue: "10",
          explanation: "a is assigned 10.",
        },
        {
          code: "b = 4",
          question: "What is b?",
          varName: "b",
          correctValue: "4",
          explanation: "b is assigned 4.",
        },
        {
          code: "a = a - b",
          question: "What is a now?",
          varName: "a",
          correctValue: "6",
          explanation: "a was 10, b is 4, so 10 - 4 = 6.",
        },
      ],
    },
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
          explanation: "count is initialized to 0.",
        },
        {
          code: "count = count + 1  // loop runs 3 times",
          question: "After 3 iterations what is count?",
          varName: "count",
          correctValue: "3",
          explanation: "Starting at 0, adding 1 three times gives 3.",
        },
        {
          code: "total = count * 10",
          question: "What is total?",
          varName: "total",
          correctValue: "30",
          explanation: "count is 3, so 3 * 10 = 30.",
        },
        {
          code: "total = total / 2",
          question: "What is total now?",
          varName: "total",
          correctValue: "15",
          explanation: "30 / 2 = 15.",
        },
      ],
    },
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
          explanation: "x is 7.",
        },
        {
          code: "y = 3",
          question: "What is y?",
          varName: "y",
          correctValue: "3",
          explanation: "y is 3.",
        },
        {
          code: "temp = x",
          question: "What is temp?",
          varName: "temp",
          correctValue: "7",
          explanation: "temp copies x which is 7.",
        },
        {
          code: "x = y",
          question: "What is x now?",
          varName: "x",
          correctValue: "3",
          explanation: "x now holds y's value: 3.",
        },
        {
          code: "y = temp",
          question: "What is y now?",
          varName: "y",
          correctValue: "7",
          explanation: "y now holds temp's value: 7. Swap complete!",
        },
      ],
    },
  ],
};

function VariableVaultGame({ config, onGameEnd }: Props) {
  const programs = VAR_PROGRAMS[config.difficulty];
  const [programIdx, setProgramIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const program = programs[programIdx];
  const step = program?.steps[stepIdx];
  const totalSteps = programs.reduce((s, p) => s + p.steps.length, 0);
  const completedSteps =
    programs.slice(0, programIdx).reduce((s, p) => s + p.steps.length, 0) +
    stepIdx;

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
    return (
      <div
        className="flex-1 flex items-center justify-center h-full"
        data-ocid="variable_vault.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Code className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
          <h2
            className="text-3xl font-black mb-3"
            style={{ color: "#10b981", fontFamily: "'Orbitron', sans-serif" }}
          >
            Variable Vault
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Watch code execute step by step. Predict the current value of the
            highlighted variable after each line runs.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              gameOverRef.current = false;
              setGameStarted(true);
            }}
            data-ocid="variable_vault.start_button"
          >
            Start Tracing
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="variable_vault.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Code className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <span className="text-xs text-muted-foreground">
          Step {completedSteps + 1}/{totalSteps}
        </span>
      </div>
      {step && (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="glass-card rounded-xl p-4 neon-top-border">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {program.title}
            </p>
            <div className="font-mono text-sm rounded-lg p-3 border border-[#10b981]/30 bg-[#10b981]/5">
              <span className="text-[#10b981] font-bold">&gt;&gt;&gt; </span>
              <span className="text-foreground">{step.code}</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex-1">
            <p className="text-base font-bold text-foreground mb-1">
              {step.question}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              What is the value of{" "}
              <span className="font-mono text-[#10b981] font-bold">
                {step.varName}
              </span>{" "}
              after this line executes?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Enter value..."
                className="flex-1 bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#10b981]/70"
                data-ocid="variable_vault.input"
                disabled={!!feedback}
              />
              <GlowButton
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={!input.trim() || !!feedback}
                data-ocid="variable_vault.submit_button"
              >
                Check
              </GlowButton>
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
                  feedback === "correct"
                    ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                    : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"
                }`}
                data-ocid={
                  feedback === "correct"
                    ? "variable_vault.success_state"
                    : "variable_vault.error_state"
                }
              >
                {feedback === "correct" ? (
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <Search className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span>
                  {feedback === "correct"
                    ? "Correct! "
                    : `The answer was ${step.correctValue}. `}
                  {step.explanation}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Loop Labyrinth (loop prediction) ─────────────────────────────────────────

interface LoopChallenge {
  code: string[];
  questionCount: string;
  questionOutput: string;
  correctCount: string;
  correctOutput: string;
  explanation: string;
}

const LOOP_CHALLENGES: Record<1 | 2 | 3, LoopChallenge[]> = {
  1: [
    {
      code: ["FOR i IN [1, 2, 3]:", "  PRINT(i)", "END FOR"],
      questionCount: "How many times does the loop run?",
      questionOutput: "What is the last value printed?",
      correctCount: "3",
      correctOutput: "3",
      explanation:
        "The loop runs once for each item in [1, 2, 3] = 3 times. Last printed value is 3.",
    },
    {
      code: ["FOR i IN [1, 2, 3, 4, 5]:", "  PRINT(i * 2)", "END FOR"],
      questionCount: "How many iterations?",
      questionOutput: "What is the last value printed?",
      correctCount: "5",
      correctOutput: "10",
      explanation: "5 iterations. Last value: i=5 so 5*2=10.",
    },
    {
      code: ["x = 0", "WHILE x < 3:", "  x = x + 1", "END WHILE"],
      questionCount: "How many times does the loop body run?",
      questionOutput: "What is x when the loop ends?",
      correctCount: "3",
      correctOutput: "3",
      explanation: "x goes 0→1→2→3. Loop runs 3 times, ends when x=3.",
    },
  ],
  2: [
    {
      code: ["sum = 0", "FOR i IN [1, 2, 3, 4]:", "  sum = sum + i", "END FOR"],
      questionCount: "How many iterations?",
      questionOutput: "What is the final value of sum?",
      correctCount: "4",
      correctOutput: "10",
      explanation: "4 iterations. sum = 0+1+2+3+4 = 10.",
    },
    {
      code: ["x = 10", "WHILE x > 5:", "  x = x - 2", "END WHILE"],
      questionCount: "How many times does the loop run?",
      questionOutput: "What is x when done?",
      correctCount: "3",
      correctOutput: "4",
      explanation: "x: 10→8→6→4. Runs 3 times. x=4 when loop ends.",
    },
  ],
  3: [
    {
      code: [
        "count = 0",
        "FOR i IN [1, 2, 3]:",
        "  FOR j IN [1, 2]:",
        "    count = count + 1",
        "  END FOR",
        "END FOR",
      ],
      questionCount: "Total iterations of inner loop?",
      questionOutput: "Final value of count?",
      correctCount: "6",
      correctOutput: "6",
      explanation:
        "Outer runs 3 times, inner runs 2 times each = 3*2 = 6 total.",
    },
    {
      code: [
        "result = 1",
        "FOR i IN [1, 2, 3, 4]:",
        "  result = result * 2",
        "END FOR",
      ],
      questionCount: "How many iterations?",
      questionOutput: "What is result at the end?",
      correctCount: "4",
      correctOutput: "16",
      explanation: "4 iterations. result: 1→2→4→8→16.",
    },
  ],
};

function LoopLabyrinthGame({ config, onGameEnd }: Props) {
  const challenges = LOOP_CHALLENGES[config.difficulty];
  const [idx, setIdx] = useState(0);
  const [countAnswer, setCountAnswer] = useState("");
  const [outputAnswer, setOutputAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
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
    }, 2000);
  }

  if (!gameStarted) {
    return (
      <div
        className="flex-1 flex items-center justify-center h-full"
        data-ocid="loop_labyrinth.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Code className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Loop Labyrinth
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Read the loop code and predict: how many times does it run, and what
            is the final output value?
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              gameOverRef.current = false;
              setGameStarted(true);
            }}
            data-ocid="loop_labyrinth.start_button"
          >
            Enter Labyrinth
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="loop_labyrinth.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#7c3aed]">
          <Code className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <span className="text-xs text-muted-foreground">
          Challenge {idx + 1}/{challenges.length}
        </span>
      </div>
      {challenge && (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="glass-card rounded-xl p-4 neon-top-border">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Read the Loop
            </p>
            <div className="font-mono text-sm rounded-lg p-3 border border-[#7c3aed]/30 bg-[#7c3aed]/5 space-y-1">
              {challenge.code.map((line, i) => (
                <div
                  key={`line-${i}`}
                  style={{ paddingLeft: line.startsWith(" ") ? "20px" : "0" }}
                >
                  <span className="text-[#7c3aed]">
                    {String(i + 1).padStart(2, " ")}{" "}
                  </span>
                  <span className="text-foreground">{line.trimStart()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm font-bold text-foreground mb-3">
                {challenge.questionCount}
              </p>
              <input
                type="text"
                value={countAnswer}
                onChange={(e) => setCountAnswer(e.target.value)}
                placeholder="Enter number..."
                className="w-full bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#7c3aed]/70"
                data-ocid="loop_labyrinth.count_input"
                disabled={!!feedback}
              />
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm font-bold text-foreground mb-3">
                {challenge.questionOutput}
              </p>
              <input
                type="text"
                value={outputAnswer}
                onChange={(e) => setOutputAnswer(e.target.value)}
                placeholder="Enter value..."
                className="w-full bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#7c3aed]/70"
                data-ocid="loop_labyrinth.output_input"
                disabled={!!feedback}
              />
            </div>
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-sm ${
                feedback === "correct"
                  ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                  : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"
              }`}
              data-ocid={
                feedback === "correct"
                  ? "loop_labyrinth.success_state"
                  : "loop_labyrinth.error_state"
              }
            >
              {feedback === "correct"
                ? "Correct! "
                : `Not quite. Count=${challenge.correctCount}, Output=${challenge.correctOutput}. `}
              {challenge.explanation}
            </motion.div>
          )}
          <GlowButton
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!countAnswer.trim() || !outputAnswer.trim() || !!feedback}
            data-ocid="loop_labyrinth.submit_button"
          >
            Submit Prediction
          </GlowButton>
        </div>
      )}
    </div>
  );
}

// ─── Debug Detective (find the bug) ───────────────────────────────────────────

interface BugSnippet {
  title: string;
  lines: string[];
  bugLine: number; // 0-indexed
  fixes: string[];
  correctFix: string;
  explanation: string;
}

const BUG_SNIPPETS: Record<1 | 2 | 3, BugSnippet[]> = {
  1: [
    {
      title: "Print Greeting",
      lines: ["name = 'Alice'", "PRINT(nam)"],
      bugLine: 1,
      fixes: ["PRINT(name)", "PRINT('Alice')", "name = PRINT"],
      correctFix: "PRINT(name)",
      explanation:
        "'nam' is misspelled — it should be 'name' to match the variable.",
    },
    {
      title: "Add Numbers",
      lines: ["a = 5", "b = 3", "result = a - b", "PRINT(result)"],
      bugLine: 2,
      fixes: ["result = a + b", "result = a * b", "result = b - a"],
      correctFix: "result = a + b",
      explanation: "The task is addition, not subtraction. Should be a + b.",
    },
    {
      title: "Check Positive",
      lines: ["x = 7", "IF x = 0:", "  PRINT('Positive')", "END IF"],
      bugLine: 1,
      fixes: ["IF x > 0:", "IF x == 0:", "IF 0 > x:"],
      correctFix: "IF x > 0:",
      explanation:
        "The condition should check if x is greater than 0, not equal to 0.",
    },
  ],
  2: [
    {
      title: "Count Loop",
      lines: [
        "FOR i IN [1, 2, 3, 4, 5]:",
        "  PRINT(i)",
        "END FOR",
        "PRINT('Total:', 6)",
      ],
      bugLine: 3,
      fixes: ["PRINT('Total:', 5)", "PRINT('Count:', 6)", "PRINT(i)"],
      correctFix: "PRINT('Total:', 5)",
      explanation:
        "The loop has 5 elements (1-5), so total should be 5 not 6. Off-by-one error.",
    },
    {
      title: "Divide Values",
      lines: ["total = 100", "parts = 0", "result = total / parts"],
      bugLine: 2,
      fixes: ["result = total / 4", "parts = 4", "total = 0"],
      correctFix: "parts = 4",
      explanation:
        "Dividing by zero causes a runtime error. parts must be set to a non-zero value before division.",
    },
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
        "END IF",
      ],
      bugLine: 1,
      fixes: ["IF score >= 90:", "IF score > 70:", "IF score == 85:"],
      correctFix: "IF score >= 90:",
      explanation:
        "Score 85 should not trigger 'A'. The A-grade boundary should be >= 90.",
    },
    {
      title: "String Comparison",
      lines: [
        "password = 'secret123'",
        "input = 'Secret123'",
        "IF password = input:",
        "  PRINT('Access granted')",
        "END IF",
      ],
      bugLine: 2,
      fixes: [
        "IF password == input:",
        "IF LOWERCASE(password) == LOWERCASE(input):",
        "IF password != input:",
      ],
      correctFix: "IF LOWERCASE(password) == LOWERCASE(input):",
      explanation:
        "Passwords are case-sensitive but the check should use == not =. Also the case mismatch 's' vs 'S' means they won't match.",
    },
  ],
};

function DebugDetectiveGame({ config, onGameEnd }: Props) {
  const snippets = BUG_SNIPPETS[config.difficulty];
  const [idx, setIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedFix, setSelectedFix] = useState<string | null>(null);
  const [phase, setPhase] = useState<"pick-line" | "pick-fix" | "feedback">(
    "pick-line",
  );
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 88 : 45,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const snippet = snippets[idx];

  function handleLineClick(lineIdx: number) {
    if (phase !== "pick-line") return;
    setSelectedLine(lineIdx);
    setPhase("pick-fix");
  }

  function handleFixClick(fix: string) {
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
        if (nl <= 0) setTimeout(() => endGame(false), 2000);
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
    return (
      <div
        className="flex-1 flex items-center justify-center h-full"
        data-ocid="debug_detective.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Search className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Debug Detective
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Each code snippet has exactly one bug. Click the wrong line to
            identify it, then select the correct fix.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              gameOverRef.current = false;
              setGameStarted(true);
            }}
            data-ocid="debug_detective.start_button"
          >
            Start Investigation
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="debug_detective.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#f59e0b]">
          <Search className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <span className="text-xs text-muted-foreground">
          Case {idx + 1}/{snippets.length}
        </span>
      </div>
      {snippet && (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="glass-card rounded-xl p-4 neon-top-border">
            <div className="flex items-center justify-between mb-2">
              <h3
                className="font-black text-[#f59e0b]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {snippet.title}
              </h3>
              <span className="text-xs text-muted-foreground">
                {phase === "pick-line"
                  ? "Click the buggy line"
                  : phase === "pick-fix"
                    ? "Select the correct fix"
                    : ""}
              </span>
            </div>
            <div className="rounded-lg border border-[#f59e0b]/30 overflow-hidden">
              {snippet.lines.map((line, i) => {
                const isBugLine = phase === "feedback" && i === snippet.bugLine;
                const isSelected = selectedLine === i;
                const lineStyle = {
                  background: isBugLine
                    ? "rgba(244,63,94,0.15)"
                    : isSelected
                      ? "rgba(245,158,11,0.15)"
                      : "transparent",
                  borderLeft: isBugLine
                    ? "3px solid #f43f5e"
                    : isSelected
                      ? "3px solid #f59e0b"
                      : "3px solid transparent",
                } as const;
                return (
                  <button
                    key={`line-${i}`}
                    type="button"
                    onClick={() => handleLineClick(i)}
                    disabled={phase !== "pick-line"}
                    className="w-full text-left flex items-start gap-3 px-3 py-2 font-mono text-sm hover:bg-[#f59e0b]/10 transition-smooth disabled:cursor-default"
                    style={lineStyle}
                    data-ocid={`debug_detective.line.${i + 1}`}
                  >
                    <span className="text-muted-foreground w-4 shrink-0 text-right">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{line}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {phase === "pick-fix" && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-4"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Replace line {(selectedLine ?? 0) + 1} with:
                </p>
                <div className="grid gap-2">
                  {snippet.fixes.map((fix, i) => (
                    <button
                      key={`fix-${i}`}
                      type="button"
                      onClick={() => handleFixClick(fix)}
                      className="text-left px-3 py-2 rounded-lg border border-border/40 font-mono text-sm hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 transition-smooth"
                      data-ocid={`debug_detective.fix.${i + 1}`}
                    >
                      {fix}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          {phase === "feedback" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                correct
                  ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                  : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"
              }`}
            >
              {correct ? (
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <Search className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <span>
                {correct
                  ? "Bug found and fixed! "
                  : `Bug was on line ${snippet.bugLine + 1}, fix: ${snippet.correctFix}. `}
                {snippet.explanation}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Algorithm Arena (process step ordering) ──────────────────────────────────

interface Algorithm {
  title: string;
  steps: string[];
  scrambled?: string[];
}

const ALGORITHMS: Algorithm[] = [
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
      "Enjoy your tea",
    ],
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
      "Take your receipt",
    ],
  },
  {
    title: "Bubble Sort Algorithm",
    steps: [
      "Start at the first element of the list",
      "Compare current element with the next",
      "If current > next, swap them",
      "Move to the next pair",
      "Repeat until end of list",
      "If any swap occurred, repeat from start",
    ],
  },
  {
    title: "School Morning Routine",
    steps: [
      "Wake up and turn off alarm",
      "Brush teeth and wash face",
      "Get dressed in school uniform",
      "Eat breakfast",
      "Pack school bag with books and items",
    ],
  },
  {
    title: "Search Engine Query",
    steps: [
      "User types keywords into the search box",
      "Search engine tokenizes the query",
      "Index lookup finds matching documents",
      "Ranking algorithm scores each result",
      "Top results are returned to user",
    ],
  },
];

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function AlgorithmArenaGame({ config, onGameEnd }: Props) {
  const countByDiff =
    config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5;
  const [algos] = useState(() => shuffleArr(ALGORITHMS).slice(0, countByDiff));
  const [algoIdx, setAlgoIdx] = useState(0);
  const [shuffled, setShuffled] = useState<string[]>(() =>
    shuffleArr(algos[0].steps),
  );
  const [placed, setPlaced] = useState<string[]>([]);
  const [draggingStep, setDraggingStep] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 92 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const algo = algos[algoIdx];
  const available = shuffled.filter((s) => !placed.includes(s));

  function handleCheck() {
    if (!algo || feedback) return;
    const isCorrect =
      placed.every((step, i) => step === algo.steps[i]) &&
      placed.length === algo.steps.length;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 300 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 2000);
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
    return (
      <div
        className="flex-1 flex items-center justify-center h-full"
        data-ocid="algorithm_arena.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Code className="h-14 w-14 mx-auto mb-4 text-[#f43f5e]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Algorithm Arena
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Steps for real-world algorithms are shown scrambled. Drag them into
            the correct sequence to complete the process.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              gameOverRef.current = false;
              setGameStarted(true);
            }}
            data-ocid="algorithm_arena.start_button"
          >
            Enter Arena
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="algorithm_arena.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#f43f5e]">
          <Code className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <span className="text-xs text-muted-foreground">
          Algorithm {algoIdx + 1}/{algos.length}
        </span>
      </div>
      {algo && (
        <div className="flex-1 flex gap-3 overflow-hidden">
          <div className="flex-1 flex flex-col gap-2">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Steps (scrambled)
            </p>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {available.map((step, i) => (
                <div
                  key={step}
                  draggable
                  onDragStart={() => setDraggingStep(step)}
                  className="px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-sm cursor-grab active:cursor-grabbing hover:border-[#f43f5e]/50 transition-smooth"
                  data-ocid={`algorithm_arena.step.${i + 1}`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {algo.title}
            </p>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!draggingStep) return;
                if (!placed.includes(draggingStep))
                  setPlaced((p) => [...p, draggingStep]);
                setDraggingStep(null);
              }}
              className={`flex-1 min-h-[100px] rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-smooth overflow-y-auto ${
                draggingStep
                  ? "border-[#f43f5e]/60 bg-[#f43f5e]/5"
                  : "border-border/30"
              }`}
              data-ocid="algorithm_arena.sequence_zone"
            >
              {placed.length === 0 ? (
                <p className="text-muted-foreground text-xs text-center mt-4">
                  Drop steps here in order
                </p>
              ) : (
                placed.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#f43f5e]/30 bg-[#f43f5e]/5 text-sm"
                    data-ocid={`algorithm_arena.placed.${i + 1}`}
                  >
                    <span className="text-[#f43f5e] font-bold w-5 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-foreground flex-1">{step}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPlaced((p) => p.filter((s) => s !== step))
                      }
                      className="text-muted-foreground hover:text-[#f43f5e] transition-smooth text-xs"
                      aria-label="Remove step"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg text-sm ${
                  feedback === "correct"
                    ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                    : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"
                }`}
              >
                {feedback === "correct"
                  ? "Correct sequence!"
                  : "Order incorrect. Study the correct sequence and try again."}
              </motion.div>
            )}
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleCheck}
              disabled={placed.length !== algo.steps.length || !!feedback}
              data-ocid="algorithm_arena.check_button"
            >
              <CheckCircle className="h-3 w-3" /> Check Order
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root component with gameId routing ──────────────────────────────────────

export default function CodingBasics({ config, onGameEnd }: Props) {
  const id = config.gameId;
  if (id === "variable-vault")
    return <VariableVaultGame config={config} onGameEnd={onGameEnd} />;
  if (id === "loop-labyrinth")
    return <LoopLabyrinthGame config={config} onGameEnd={onGameEnd} />;
  if (id === "debug-detective")
    return <DebugDetectiveGame config={config} onGameEnd={onGameEnd} />;
  if (id === "algorithm-arena")
    return <AlgorithmArenaGame config={config} onGameEnd={onGameEnd} />;
  // default: code-puzzle
  return <CodePuzzleGame config={config} onGameEnd={onGameEnd} />;
}
