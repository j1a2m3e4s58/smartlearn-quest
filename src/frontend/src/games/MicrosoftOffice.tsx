import { GlowButton } from "@/components/ui/GlowButton";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heart,
  Italic,
  Underline,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─ Shared helper ──────────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─ Game 1: Word Wizard (Document Formatting) ───────────────────────────────────────────
interface FormatTask {
  id: string;
  instruction: string;
  docTitle: string;
  docBody: string;
  required: Partial<DocFormat>;
}

interface DocFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: "left" | "center" | "right";
  fontSize: number;
  titleSize: number;
}

const FORMAT_TASKS: FormatTask[] = [
  {
    id: "f1",
    instruction:
      "Make the title BOLD, set font size to 24, and CENTER the paragraph.",
    docTitle: "Annual School Report",
    docBody:
      "This report summarizes academic performance, attendance, and extracurricular achievements throughout the academic year.",
    required: { bold: true, fontSize: 24, align: "center" },
  },
  {
    id: "f2",
    instruction: "Apply ITALIC style and LEFT-ALIGN the paragraph.",
    docTitle: "Science Project Notes",
    docBody:
      "Water boils at 100 degrees Celsius at standard atmospheric pressure. This principle is used in many industrial applications.",
    required: { italic: true, align: "left" },
  },
  {
    id: "f3",
    instruction:
      "UNDERLINE the text, set font size to 18, and RIGHT-ALIGN the paragraph.",
    docTitle: "Mathematics Assignment",
    docBody:
      "Question 1: Solve for x in the equation 3x + 7 = 22. Show all working steps clearly.",
    required: { underline: true, fontSize: 18, align: "right" },
  },
  {
    id: "f4",
    instruction: "Apply BOLD + ITALIC, CENTER-ALIGN, and set font size to 20.",
    docTitle: "English Essay Introduction",
    docBody:
      "The impact of technology on modern education cannot be overstated. Digital tools have transformed how students learn.",
    required: { bold: true, italic: true, align: "center", fontSize: 20 },
  },
  {
    id: "f5",
    instruction: "BOLD only, set font size to 16, LEFT-ALIGN.",
    docTitle: "Class Rules Notice",
    docBody:
      "All students must arrive on time. Phones must be silent during lessons. Homework is due every Friday morning.",
    required: { bold: true, fontSize: 16, align: "left" },
  },
  {
    id: "f6",
    instruction: "UNDERLINE + BOLD, set font size to 22, RIGHT-ALIGN.",
    docTitle: "Certificate of Merit",
    docBody:
      "This certificate is awarded to the student who achieved the highest score in the end-of-term examination.",
    required: { bold: true, underline: true, fontSize: 22, align: "right" },
  },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32];

function WordWizardGame({ config, onGameEnd }: Props) {
  const taskCount =
    config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5;
  const [tasks] = useState<FormatTask[]>(() =>
    shuffle(FORMAT_TASKS).slice(0, taskCount),
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [format, setFormat] = useState<DocFormat>({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
    fontSize: 14,
    titleSize: 28,
  });
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = taskCount > 0 ? (correctRef.current / taskCount) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed),
      );
    },
    [config, onGameEnd, gameOver, taskCount],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function toggleFormat(key: keyof DocFormat, value?: number | string) {
    setFormat((f) => {
      if (key === "align")
        return { ...f, align: value as "left" | "center" | "right" };
      if (key === "fontSize") return { ...f, fontSize: value as number };
      return {
        ...f,
        [key]:
          !f[key as keyof Pick<DocFormat, "bold" | "italic" | "underline">],
      };
    });
  }

  function checkFormat() {
    const task = tasks[currentIdx];
    const req = task.required;
    let matches = 0;
    let total = Object.keys(req).length;
    if (total === 0) total = 1;
    if (req.bold !== undefined && format.bold === req.bold) matches++;
    if (req.italic !== undefined && format.italic === req.italic) matches++;
    if (req.underline !== undefined && format.underline === req.underline)
      matches++;
    if (req.align !== undefined && format.align === req.align) matches++;
    if (req.fontSize !== undefined && format.fontSize === req.fontSize)
      matches++;
    const pct = matches / total;
    if (pct >= 1) {
      const timeBonus = Math.floor((timeLeft / config.timeLimit) * 60);
      setScore((s) => s + 200 + timeBonus);
      setCorrect((c) => c + 1);
      setFeedback({
        ok: true,
        msg: "Perfect formatting! All requirements met.",
      });
    } else if (pct > 0) {
      setScore((s) => s + Math.floor(100 * pct));
      setFeedback({
        ok: false,
        msg: `Partial credit (${matches}/${total} requirements met). Keep practicing!`,
      });
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        ok: false,
        msg: "None of the required formatting was applied. Try again!",
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
        titleSize: 28,
      });
      if (currentIdx + 1 >= tasks.length) endGame(true);
      else setCurrentIdx((i) => i + 1);
    }, 1600);
  }

  const task = tasks[currentIdx];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="office_arena.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <span className="font-bold text-xs">OFFICE</span>
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentIdx + 1}/{taskCount}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Office Productivity Arena
          </h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Read the formatting instructions and apply them to the document
            using the toolbar. Then click Submit.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="office_arena.start_button"
          >
            Open Word Processor
          </GlowButton>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="glass-card rounded-xl p-3 border border-[#00f5ff]/20 shrink-0">
            <p className="text-xs text-[#00f5ff] uppercase tracking-widest mb-1">
              Formatting Task
            </p>
            <p className="text-foreground font-semibold">{task.instruction}</p>
          </div>
          <div className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden border border-border/40">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e3a5f]/60 border-b border-border/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {task.docTitle} — Microsoft Word
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-muted/20 border-b border-border/20 flex-wrap">
              {(["bold", "italic", "underline"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFormat(key)}
                  data-ocid={`office_arena.${key}_button`}
                  className={`p-1.5 rounded border transition-all ${
                    format[key]
                      ? "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  {key === "bold" ? (
                    <Bold className="h-4 w-4" />
                  ) : key === "italic" ? (
                    <Italic className="h-4 w-4" />
                  ) : (
                    <Underline className="h-4 w-4" />
                  )}
                </button>
              ))}
              <div className="w-px h-5 bg-border/40 mx-1" />
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleFormat("align", a)}
                  data-ocid={`office_arena.align_${a}`}
                  className={`p-1.5 rounded border transition-all ${
                    format.align === a
                      ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  {a === "left" ? (
                    <AlignLeft className="h-4 w-4" />
                  ) : a === "center" ? (
                    <AlignCenter className="h-4 w-4" />
                  ) : (
                    <AlignRight className="h-4 w-4" />
                  )}
                </button>
              ))}
              <div className="w-px h-5 bg-border/40 mx-1" />
              <select
                value={format.fontSize}
                onChange={(e) =>
                  toggleFormat("fontSize", Number(e.target.value))
                }
                data-ocid="office_arena.font_size_select"
                className="bg-background border border-border/40 rounded px-2 py-1 text-xs text-foreground"
              >
                {FONT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}pt
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h1
                    className="text-foreground"
                    style={{
                      fontSize: `${format.titleSize}px`,
                      fontWeight: format.bold ? "bold" : "normal",
                      textDecoration: format.underline ? "underline" : "none",
                      textAlign: format.align,
                    }}
                  >
                    {task.docTitle}
                  </h1>
                  <p
                    className="leading-relaxed text-foreground/90"
                    style={{
                      fontSize: `${format.fontSize}px`,
                      fontWeight: format.bold ? "bold" : "normal",
                      fontStyle: format.italic ? "italic" : "normal",
                      textDecoration: format.underline ? "underline" : "none",
                      textAlign: format.align,
                    }}
                  >
                    {task.docBody}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="px-4 py-3 border-t border-border/20 flex items-center justify-between">
              {feedback && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                  data-ocid={
                    feedback.ok
                      ? "office_arena.success_state"
                      : "office_arena.error_state"
                  }
                >
                  {feedback.msg}
                </motion.p>
              )}
              <GlowButton
                variant="primary"
                size="sm"
                onClick={checkFormat}
                data-ocid="office_arena.submit_button"
                className="ml-auto"
              >
                Submit Formatting
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─ Game 2: Excel Explorer (Formula Matching) ──────────────────────────────────────────
interface FormulaTask {
  id: number;
  scenario: string;
  tableHeader: string[];
  tableData: string[][];
  taskPrompt: string;
  options: { formula: string; correct: boolean; explanation: string }[];
}

const FORMULA_TASKS: FormulaTask[] = [
  {
    id: 1,
    scenario: "Class test scores are recorded in column B (B2:B6).",
    tableHeader: ["Student", "Score"],
    tableData: [
      ["Ama", "85"],
      ["Kofi", "72"],
      ["Yaa", "91"],
      ["Kwame", "68"],
      ["Efua", "79"],
    ],
    taskPrompt: "Calculate the TOTAL score of all 5 students.",
    options: [
      {
        formula: "=SUM(B2:B6)",
        correct: true,
        explanation: "SUM adds all values in a range. Perfect for totals.",
      },
      {
        formula: "=AVERAGE(B2:B6)",
        correct: false,
        explanation: "AVERAGE divides sum by count — gives average, not total.",
      },
      {
        formula: "=MAX(B2:B6)",
        correct: false,
        explanation: "MAX returns the single highest value, not the total.",
      },
      {
        formula: "=COUNT(B2:B6)",
        correct: false,
        explanation: "COUNT counts how many numbers exist, not their sum.",
      },
    ],
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
      ["Efua", "79"],
    ],
    taskPrompt: "Find the AVERAGE score across all students.",
    options: [
      {
        formula: "=AVERAGE(B2:B6)",
        correct: true,
        explanation:
          "AVERAGE sums the range and divides by count. Correct for mean.",
      },
      {
        formula: "=SUM(B2:B6)",
        correct: false,
        explanation: "SUM gives the total, not the average.",
      },
      {
        formula: "=MEDIAN(B2:B6)",
        correct: false,
        explanation: "MEDIAN gives the middle value, not the arithmetic mean.",
      },
      {
        formula: "=MIN(B2:B6)",
        correct: false,
        explanation: "MIN returns the lowest value, not the average.",
      },
    ],
  },
  {
    id: 3,
    scenario: "Sales figures for 4 branches are in column C (C2:C5).",
    tableHeader: ["Branch", "Sales (GHS)"],
    tableData: [
      ["Accra", "12500"],
      ["Kumasi", "9800"],
      ["Tamale", "7200"],
      ["Takoradi", "11400"],
    ],
    taskPrompt: "Find the HIGHEST sales figure among all branches.",
    options: [
      {
        formula: "=MAX(C2:C5)",
        correct: true,
        explanation: "MAX returns the largest value in the range.",
      },
      {
        formula: "=SUM(C2:C5)",
        correct: false,
        explanation: "SUM adds all values together — not the maximum.",
      },
      {
        formula: "=MIN(C2:C5)",
        correct: false,
        explanation: "MIN returns the smallest value, not largest.",
      },
      {
        formula: "=AVERAGE(C2:C5)",
        correct: false,
        explanation: "AVERAGE computes the mean, not the maximum.",
      },
    ],
  },
  {
    id: 4,
    scenario:
      "Student grades are in column C. A grade is 'Pass' if score >= 50.",
    tableHeader: ["Student", "Score", "Result"],
    tableData: [
      ["Ama", "75", "?"],
      ["Kofi", "43", "?"],
      ["Yaa", "88", "?"],
    ],
    taskPrompt:
      "Write the formula in C2 to show Pass or Fail based on score in B2.",
    options: [
      {
        formula: '=IF(B2>=50,"Pass","Fail")',
        correct: true,
        explanation:
          "IF checks the condition and returns Pass or Fail accordingly.",
      },
      {
        formula: "=SUM(B2,50)",
        correct: false,
        explanation:
          "SUM just adds numbers — it cannot produce Pass/Fail text.",
      },
      {
        formula: "=AVERAGE(B2:B6)",
        correct: false,
        explanation: "AVERAGE computes a mean — not a Pass/Fail condition.",
      },
      {
        formula: "=MAX(B2:B6)",
        correct: false,
        explanation:
          "MAX returns the highest number, not a conditional result.",
      },
    ],
  },
  {
    id: 5,
    scenario: "A budget spreadsheet tracks monthly expenses in D2:D13.",
    tableHeader: ["Month", "Expense (GHS)"],
    tableData: [
      ["Jan", "800"],
      ["Feb", "950"],
      ["Mar", "720"],
      ["Apr", "1100"],
    ],
    taskPrompt: "Count how many months had expenses recorded.",
    options: [
      {
        formula: "=COUNT(D2:D13)",
        correct: true,
        explanation: "COUNT counts how many numeric cells exist in the range.",
      },
      {
        formula: "=SUM(D2:D13)",
        correct: false,
        explanation: "SUM totals the values, it does not count entries.",
      },
      {
        formula: "=COUNTA(D2:D13)",
        correct: false,
        explanation:
          "COUNTA counts non-empty cells (including text). For numbers use COUNT.",
      },
      {
        formula: "=MIN(D2:D13)",
        correct: false,
        explanation: "MIN returns the smallest value, not the count.",
      },
    ],
  },
  {
    id: 6,
    scenario: "Population data for 6 regions is in column E (E2:E7).",
    tableHeader: ["Region", "Population"],
    tableData: [
      ["Greater Accra", "5310600"],
      ["Ashanti", "5440463"],
      ["Northern", "2479461"],
      ["Western", "2996577"],
    ],
    taskPrompt: "Find the LOWEST population value among all regions.",
    options: [
      {
        formula: "=MIN(E2:E7)",
        correct: true,
        explanation: "MIN returns the smallest value in the range.",
      },
      {
        formula: "=MAX(E2:E7)",
        correct: false,
        explanation: "MAX returns the largest, not smallest value.",
      },
      {
        formula: "=AVERAGE(E2:E7)",
        correct: false,
        explanation: "AVERAGE computes the mean, not the minimum.",
      },
      {
        formula: "=SUM(E2:E7)",
        correct: false,
        explanation: "SUM adds all values together, not the minimum.",
      },
    ],
  },
];

function ExcelExplorerGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
  const [tasks] = useState<FormulaTask[]>(() =>
    shuffle(FORMULA_TASKS).slice(0, Math.min(count, FORMULA_TASKS.length)),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [answered, setAnswered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const acc =
        tasks.length > 0 ? (correctRef.current / tasks.length) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed),
      );
    },
    [config, onGameEnd, gameOver, tasks.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function handleSelect(opt: {
    formula: string;
    correct: boolean;
    explanation: string;
  }) {
    if (!gameStarted || gameOver || answered) return;
    setAnswered(true);
    if (opt.correct) {
      const bonus = Math.floor((timeLeft / config.timeLimit) * 80);
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
  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="excel_explorer.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <span className="text-lg font-bold text-[#10b981]">
          {score.toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {idx + 1}/{tasks.length}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Excel Formula Explorer
          </h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            A spreadsheet scenario is shown. Pick the correct Excel formula
            (SUM, AVERAGE, MAX, MIN, IF, COUNT) for each task.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="excel_explorer.start_button"
          >
            Open Spreadsheet
          </GlowButton>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="glass-card rounded-xl p-3 border border-[#10b981]/30 text-sm">
            <p className="text-[#10b981] text-xs uppercase tracking-widest mb-1">
              Scenario
            </p>
            <p className="text-foreground">{task.scenario}</p>
          </div>
          {/* Spreadsheet preview */}
          <div className="glass-card rounded-xl overflow-hidden border border-border/40 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d3d1a]/60 border-b border-border/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                Microsoft Excel
              </span>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="text-xs font-mono">
                <thead>
                  <tr>
                    {task.tableHeader.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-1 text-left text-[#10b981] border-b border-[#10b981]/20 font-bold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {task.tableData.map((row, ri) => (
                    <tr
                      key={`row-${ri}`}
                      className={ri % 2 === 0 ? "bg-[#10b981]/5" : ""}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={`cell-${ci}`}
                          className="px-3 py-1 text-foreground border-b border-border/10"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass-card rounded-lg p-3 border border-[#f59e0b]/30">
            <p className="text-[#f59e0b] font-semibold text-sm">
              {task.taskPrompt}
            </p>
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`px-4 py-2 rounded-lg text-sm border ${
                feedback.ok
                  ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                  : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
              }`}
            >
              {feedback.msg}
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {task.options.map((opt, i) => (
              <motion.button
                key={`fo-${i}`}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={answered}
                whileHover={!answered ? { scale: 1.02 } : {}}
                data-ocid={`excel_explorer.formula_${i + 1}`}
                className={`text-left px-4 py-3 rounded-lg border transition-all font-mono text-sm ${
                  answered && opt.correct
                    ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]"
                    : "border-border/40 glass-card text-foreground hover:border-[#10b981]/40"
                }`}
              >
                {opt.formula}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─ Game 3: PowerPoint Pro (Slide Ordering) ─────────────────────────────────────────────
interface SlideItem {
  id: number;
  title: string;
  content: string;
  type: "title" | "agenda" | "content" | "conclusion" | "questions";
  correctOrder: number;
}

interface SlideSet {
  topic: string;
  slides: SlideItem[];
}

const SLIDE_SETS: SlideSet[] = [
  {
    topic: "How Computers Work",
    slides: [
      {
        id: 1,
        title: "How Computers Work",
        content: "Presenter: ICT Department | Date: March 2024",
        type: "title",
        correctOrder: 1,
      },
      {
        id: 2,
        title: "Agenda",
        content: "1. Hardware 2. Software 3. Data Processing 4. Summary",
        type: "agenda",
        correctOrder: 2,
      },
      {
        id: 3,
        title: "Computer Hardware",
        content: "CPU, RAM, HDD, Motherboard, GPU, PSU, I/O Devices",
        type: "content",
        correctOrder: 3,
      },
      {
        id: 4,
        title: "Computer Software",
        content: "Operating systems, applications, drivers, and utilities",
        type: "content",
        correctOrder: 4,
      },
      {
        id: 5,
        title: "Summary",
        content:
          "Computers process input data into output through hardware + software",
        type: "conclusion",
        correctOrder: 5,
      },
    ],
  },
  {
    topic: "Internet Safety for Students",
    slides: [
      {
        id: 6,
        title: "Internet Safety",
        content: "Staying Safe Online | Basic 5 ICT",
        type: "title",
        correctOrder: 1,
      },
      {
        id: 7,
        title: "Why It Matters",
        content:
          "Over 5 billion people use the internet — threats are everywhere",
        type: "agenda",
        correctOrder: 2,
      },
      {
        id: 8,
        title: "Phishing Threats",
        content: "Fake emails and websites trying to steal your information",
        type: "content",
        correctOrder: 3,
      },
      {
        id: 9,
        title: "Protecting Yourself",
        content:
          "Strong passwords, HTTPS, avoid suspicious links, report threats",
        type: "content",
        correctOrder: 4,
      },
      {
        id: 10,
        title: "Questions?",
        content: "What questions do you have about internet safety?",
        type: "questions",
        correctOrder: 5,
      },
    ],
  },
  {
    topic: "The Water Cycle",
    slides: [
      {
        id: 11,
        title: "The Water Cycle",
        content: "Science Department | Basic 4",
        type: "title",
        correctOrder: 1,
      },
      {
        id: 12,
        title: "Overview",
        content: "Evaporation, Condensation, Precipitation, Collection",
        type: "agenda",
        correctOrder: 2,
      },
      {
        id: 13,
        title: "Evaporation & Condensation",
        content:
          "Heat causes water to evaporate. Clouds form from condensed water vapor.",
        type: "content",
        correctOrder: 3,
      },
      {
        id: 14,
        title: "Precipitation",
        content:
          "Water falls as rain, snow, or hail and collects in oceans, lakes, rivers.",
        type: "content",
        correctOrder: 4,
      },
      {
        id: 15,
        title: "Conclusion",
        content:
          "The water cycle continuously moves water through Earth's systems.",
        type: "conclusion",
        correctOrder: 5,
      },
    ],
  },
];

const SLIDE_TYPE_COLORS: Record<SlideItem["type"], string> = {
  title: "#7c3aed",
  agenda: "#00f5ff",
  content: "#10b981",
  conclusion: "#f59e0b",
  questions: "#f43f5e",
};

function PowerPointProGame({ config, onGameEnd }: Props) {
  const setCount =
    config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const [slideSets] = useState<SlideSet[]>(() =>
    shuffle(SLIDE_SETS).slice(0, Math.min(setCount, SLIDE_SETS.length)),
  );
  const [setIdx, setSetIdx] = useState(0);
  const [orderedSlides, setOrderedSlides] = useState<SlideItem[]>(() =>
    shuffle(slideSets[0].slides),
  );
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, 80, timeSpent, completed),
      );
    },
    [config, onGameEnd, gameOver],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function handleDragStart(i: number) {
    setDragIdx(i);
  }

  function handleDrop(targetIdx: number) {
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
        msg: "Incorrect order. Slides must follow: Title > Agenda > Content > Conclusion/Questions.",
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
  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="ppt_pro.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <span className="text-lg font-bold text-[#7c3aed]">
          {score.toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            PowerPoint Pro
          </h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Slides are shuffled out of order. Drag them into the correct
            presentation sequence, then click Check Order.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="ppt_pro.start_button"
          >
            Start Presentation
          </GlowButton>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="glass-card rounded-xl p-3 border border-[#7c3aed]/30">
            <p className="text-xs text-[#7c3aed] uppercase tracking-widest mb-1">
              Topic: {currentSet.topic}
            </p>
            <p className="text-muted-foreground text-xs">
              Drag the 5 slides into the correct presentation order.
            </p>
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`px-4 py-2 rounded-lg text-sm border ${
                feedback.ok
                  ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                  : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
              }`}
            >
              {feedback.msg}
            </motion.div>
          )}
          <div className="flex-1 grid gap-2 overflow-y-auto">
            {orderedSlides.map((slide, i) => {
              const typeColor = SLIDE_TYPE_COLORS[slide.type];
              return (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  className="glass-card rounded-xl border p-3 cursor-grab active:cursor-grabbing flex items-center gap-3"
                  style={{ borderColor: `${typeColor}40` }}
                  data-ocid={`ppt_pro.slide.${i + 1}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: `${typeColor}20`, color: typeColor }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {slide.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {slide.content}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded border"
                    style={{ color: typeColor, borderColor: `${typeColor}40` }}
                  >
                    {slide.type}
                  </span>
                </div>
              );
            })}
          </div>
          <GlowButton
            variant="primary"
            size="sm"
            onClick={checkOrder}
            disabled={checked}
            data-ocid="ppt_pro.check_button"
            className="shrink-0"
          >
            Check Order
          </GlowButton>
        </div>
      )}
    </div>
  );
}

// ─ Router ────────────────────────────────────────────────────────────────────────
export default function MicrosoftOffice({ config, onGameEnd }: Props) {
  if (config.gameId === "excel-explorer")
    return <ExcelExplorerGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "powerpoint-pro")
    return <PowerPointProGame config={config} onGameEnd={onGameEnd} />;
  return <WordWizardGame config={config} onGameEnd={onGameEnd} />;
}
