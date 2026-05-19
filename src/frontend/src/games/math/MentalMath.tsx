import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Problem {
  question: string;
  answer: number;
  options?: number[];
}

function genProblem(diff: 1 | 2 | 3, ops?: string[]): Problem {
  const allOps =
    ops ??
    (diff === 1
      ? ["+", "-"]
      : diff === 2
        ? ["+", "-", "*"]
        : ["+", "-", "*", "/"]);
  const op = allOps[randInt(0, allOps.length - 1)];
  const maxN = diff === 1 ? 20 : diff === 2 ? 50 : 99;
  let a = randInt(2, maxN);
  let b = randInt(2, diff === 3 ? 12 : maxN);
  let answer: number;
  if (op === "+") {
    answer = a + b;
  } else if (op === "-") {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
  } else if (op === "*") {
    a = randInt(2, diff === 3 ? 20 : 12);
    b = randInt(2, diff === 3 ? 20 : 12);
    answer = a * b;
  } else {
    b = randInt(2, 12);
    a = b * randInt(2, 12);
    answer = a / b;
  }
  const wrongs = [
    answer + randInt(1, 5),
    answer - randInt(1, 4),
    answer + randInt(6, 15),
  ].filter((w) => w !== answer && w > 0);
  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    options: shuffle([answer, ...wrongs.slice(0, 3)]),
  };
}

function genTimedProblem(tier: number): Problem {
  if (tier <= 1) return genProblem(1, ["+", "-"]);
  if (tier === 2) return genProblem(2, ["*", "/"]);
  if (tier === 3) return genProblem(2);
  if (tier === 4) {
    const a = randInt(2, 20);
    const b = randInt(2, 10);
    const c = randInt(1, 5);
    const ans = a * b + c;
    const wrongs = [ans + 2, ans - 3, ans + 7].filter(
      (w) => w !== ans && w > 0,
    );
    return {
      question: `${a} x ${b} + ${c} = ?`,
      answer: ans,
      options: shuffle([ans, ...wrongs.slice(0, 3)]),
    };
  }
  const base = randInt(20, 80);
  const pct = [10, 20, 25, 50][randInt(0, 3)];
  const ans = Math.round((base * pct) / 100);
  const wrongs = [ans + 2, ans - 1, ans + 5].filter((w) => w !== ans && w >= 0);
  return {
    question: `${pct}% of ${base} = ?`,
    answer: ans,
    options: shuffle([ans, ...wrongs.slice(0, 3)]),
  };
}

function buildMultiplicationRow(n: number): string {
  return Array.from(
    { length: 12 },
    (_, i) => `${n}x${i + 1}=${n * (i + 1)}`,
  ).join("  ");
}

const DIGIT_LABELS = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
  "0",
  "00",
  "CLR",
];

export default function MentalMath({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // ── Shared ─────────────────────────────────────────────────────────────
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);

  const endGame = useCallback(
    (s: number, c: number, total: number, done: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = total > 0 ? (c / total) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          s,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          done,
        ),
      );
    },
    [config, onGameEnd],
  );

  // ── GAME 1: Mental Sprint ─────────────────────────────────────────────────
  const TOTAL_S =
    config.difficulty === 1 ? 40 : config.difficulty === 2 ? 60 : 80;
  const TIME_S = 90;
  const [g1Phase, setG1Phase] = useState<"idle" | "playing">("idle");
  const [g1Problems] = useState<Problem[]>(() =>
    Array.from({ length: TOTAL_S }, () => genProblem(config.difficulty)),
  );
  const [g1Cur, setG1Cur] = useState(0);
  const [g1Score, setG1Score] = useState(0);
  const [g1Correct, setG1Correct] = useState(0);
  const [g1Time, setG1Time] = useState(TIME_S);
  const [g1Input, setG1Input] = useState("");
  const [g1Flash, setG1Flash] = useState<"correct" | "wrong" | null>(null);
  const g1PhaseRef = useRef(g1Phase);
  g1PhaseRef.current = g1Phase;
  const g1TimeRef = useRef(g1Time);

  useEffect(() => {
    if (g1Phase !== "playing") return;
    const t = setInterval(() => {
      setG1Time((prev) => {
        g1TimeRef.current = prev - 1;
        if (prev <= 1) {
          clearInterval(t);
          endGame(g1Score, g1Correct, g1Cur, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [g1Phase, endGame, g1Score, g1Correct, g1Cur]);

  function g1PadInput(label: string) {
    if (label === "CLR") {
      setG1Input("");
      return;
    }
    setG1Input((p) => (p.length < 5 ? p + label : p));
  }

  function g1Submit() {
    if (g1Input.trim() === "") return;
    const val = Number.parseInt(g1Input);
    const prob = g1Problems[g1Cur];
    const ok = val === prob.answer;
    const pts = ok ? 100 : 0;
    const newScore = g1Score + pts;
    const newCorrect = ok ? g1Correct + 1 : g1Correct;
    setG1Score(newScore);
    setG1Correct(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setG1Flash(ok ? "correct" : "wrong");
    setTimeout(() => {
      setG1Flash(null);
      setG1Input("");
      const next = g1Cur + 1;
      if (next >= TOTAL_S) {
        endGame(newScore, newCorrect, TOTAL_S, true);
        return;
      }
      setG1Cur(next);
    }, 400);
  }

  // ── GAME 2: Memory Multiply ───────────────────────────────────────────────
  const tableMax =
    config.difficulty === 1 ? 6 : config.difficulty === 2 ? 10 : 12;
  const TOTAL_MM = 30;
  function genMMProblem(): Problem {
    const a = randInt(1, tableMax);
    const b = randInt(1, 12);
    const ans = a * b;
    const wrongs = [
      ans + randInt(1, 5),
      ans - randInt(1, 4),
      ans + randInt(6, 12),
    ].filter((w) => w !== ans && w > 0);
    return {
      question: `${a} x ${b} = ?`,
      answer: ans,
      options: shuffle([ans, ...wrongs.slice(0, 3)]),
    };
  }
  const [g2Phase, setG2Phase] = useState<"idle" | "playing">("idle");
  const [g2Problems] = useState<Problem[]>(() =>
    Array.from({ length: TOTAL_MM }, genMMProblem),
  );
  const [g2Cur, setG2Cur] = useState(0);
  const [g2Score, setG2Score] = useState(0);
  const [g2Correct, setG2Correct] = useState(0);
  const [g2Streak, setG2Streak] = useState(0);
  const [g2Chosen, setG2Chosen] = useState<number | null>(null);
  const [g2Flash, setG2Flash] = useState<"correct" | "wrong" | null>(null);
  const [g2ShowRow, setG2ShowRow] = useState<string | null>(null);

  function g2Choose(optIdx: number) {
    if (g2Flash) return;
    setG2Chosen(optIdx);
    const prob = g2Problems[g2Cur];
    const ok = prob.options![optIdx] === prob.answer;
    const mult = g2Streak >= 4 ? 3 : g2Streak >= 2 ? 2 : 1;
    const pts = ok ? 100 * mult : 0;
    const newScore = g2Score + pts;
    const newCorrect = ok ? g2Correct + 1 : g2Correct;
    const newStreak = ok ? g2Streak + 1 : 0;
    setG2Score(newScore);
    setG2Correct(newCorrect);
    setG2Streak(newStreak);
    setG2Flash(ok ? "correct" : "wrong");
    if (!ok) {
      const tableNum = Number.parseInt(prob.question.split(" ")[0]);
      setG2ShowRow(buildMultiplicationRow(tableNum));
    }
    setTimeout(
      () => {
        setG2Flash(null);
        setG2Chosen(null);
        setG2ShowRow(null);
        const next = g2Cur + 1;
        if (next >= TOTAL_MM) {
          endGame(newScore, newCorrect, TOTAL_MM, true);
          return;
        }
        setG2Cur(next);
      },
      ok ? 400 : 2200,
    );
  }

  // ── GAME 3: Lightning Round ────────────────────────────────────────────────
  const [g3Phase, setG3Phase] = useState<"idle" | "playing">("idle");
  const [g3Score, setG3Score] = useState(0);
  const [g3AnsweredCount, setG3AnsweredCount] = useState(0);
  const [g3Streak, setG3Streak] = useState(0);
  const [g3Strikes, setG3Strikes] = useState(0);
  const [g3Tier, setG3Tier] = useState(1);
  const [g3Problem, setG3Problem] = useState<Problem>(() => genTimedProblem(1));
  const [g3QuestionTime, setG3QuestionTime] = useState(5);
  const [g3Chosen, setG3Chosen] = useState<number | null>(null);
  const [g3Flash, setG3Flash] = useState<"correct" | "wrong" | null>(null);
  const g3PhaseRef = useRef(g3Phase);
  g3PhaseRef.current = g3Phase;
  const g3QTimeRef = useRef(5);

  useEffect(() => {
    if (g3Phase !== "playing" || g3Flash) return;
    g3QTimeRef.current = 5;
    setG3QuestionTime(5);
    const t = setInterval(() => {
      setG3QuestionTime((prev) => {
        g3QTimeRef.current = prev - 1;
        if (prev <= 1) {
          clearInterval(t);
          const newStrikes = g3Strikes + 1;
          setG3Strikes(newStrikes);
          if (newStrikes >= 3) {
            endGame(g3Score, g3AnsweredCount, g3AnsweredCount, false);
            return 0;
          }
          setG3Flash("wrong");
          setTimeout(() => {
            setG3Flash(null);
            setG3Problem(genTimedProblem(g3Tier));
            setG3Streak(0);
          }, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [g3Phase, g3Flash, g3Strikes, g3Score, g3AnsweredCount, g3Tier, endGame]);

  function g3Choose(optIdx: number) {
    if (g3Flash) return;
    setG3Chosen(optIdx);
    const ok = g3Problem.options![optIdx] === g3Problem.answer;
    const newAnswered = g3AnsweredCount + 1;
    const newStreak = ok ? g3Streak + 1 : 0;
    const newTier = Math.min(5, Math.floor(newStreak / 5) + 1);
    const pts = ok ? newAnswered * newTier : 0;
    const newScore = g3Score + pts;
    setG3Score(newScore);
    setG3AnsweredCount(newAnswered);
    setG3Streak(newStreak);
    setG3Tier(newTier);
    if (!ok) {
      const newStrikes = g3Strikes + 1;
      setG3Strikes(newStrikes);
      if (newStrikes >= 3) {
        setG3Flash("wrong");
        setTimeout(
          () => endGame(newScore, newAnswered - 1, newAnswered, false),
          600,
        );
        return;
      }
    }
    setG3Flash(ok ? "correct" : "wrong");
    setTimeout(() => {
      setG3Flash(null);
      setG3Chosen(null);
      setG3Problem(genTimedProblem(newTier));
      if (!ok) setG3Streak(0);
    }, 500);
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="mental_math.page"
    >
      {/* ═══════════ GAME 1: Mental Sprint ═══════════ */}
      {gameId === "mental-sprint" && (
        <>
          {g1Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#f59e0b]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Mental Sprint
              </h2>
              <p className="text-muted-foreground text-center max-w-sm">
                {TOTAL_S} problems in {TIME_S} seconds. Use the number pad to
                enter answers.
              </p>
              <button
                type="button"
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setG1Phase("playing");
                }}
                className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90"
                data-ocid="mental_math.start_button"
              >
                Start Sprint
              </button>
            </motion.div>
          )}
          {g1Phase === "playing" && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="w-full h-3 bg-muted rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${g1Time <= 15 ? "bg-red-500" : "bg-[#f59e0b]"}`}
                  style={{ width: `${(g1Time / TIME_S) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-mono text-[#f59e0b]">{g1Time}s</span>
                <span className="text-muted-foreground">
                  {g1Cur}/{TOTAL_S}
                </span>
                <span>
                  Score:{" "}
                  <span className="text-[#f59e0b] font-bold">{g1Score}</span>
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={g1Cur}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`text-5xl font-black text-center py-6 rounded-2xl border-2 transition-colors ${
                    g1Flash === "correct"
                      ? "border-[#4ade80] text-[#4ade80]"
                      : g1Flash === "wrong"
                        ? "border-red-500 text-red-400"
                        : "border-border"
                  }`}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {g1Problems[g1Cur]?.question}
                </motion.div>
              </AnimatePresence>
              <div className="text-center text-3xl font-black font-mono py-3 rounded-xl border-2 border-[#f59e0b]/50 bg-card min-h-[56px]">
                {g1Input || "-"}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DIGIT_LABELS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => g1PadInput(label)}
                    data-ocid={`mental_math.pad_${label}`}
                    className="py-3 rounded-xl border-2 border-border/50 bg-card text-xl font-black hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={g1Submit}
                className="py-3 rounded-xl bg-[#f59e0b] text-black font-black text-lg hover:opacity-90"
                data-ocid="mental_math.submit_button"
              >
                ENTER
              </button>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 2: Memory Multiply ═══════════ */}
      {gameId === "memory-multiply" && (
        <>
          {g2Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#f59e0b]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Memory Multiply
              </h2>
              <p className="text-muted-foreground text-center max-w-sm">
                Times tables (1–{tableMax}). Build streaks for x2 and x3
                multipliers. Miss one and the full table is shown.
              </p>
              <button
                type="button"
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setG2Phase("playing");
                }}
                className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90"
                data-ocid="mental_math.mm_start_button"
              >
                Begin Tables
              </button>
            </motion.div>
          )}
          {g2Phase === "playing" && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {g2Cur}/{TOTAL_MM}
                </span>
                {g2Streak >= 2 && (
                  <span className="text-[#f59e0b] font-bold">
                    Streak x{g2Streak >= 4 ? 3 : 2}
                  </span>
                )}
                <span>
                  Score:{" "}
                  <span className="text-[#f59e0b] font-bold">{g2Score}</span>
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={g2Cur}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-5xl font-black text-center py-6 rounded-2xl border-2 transition-colors ${
                    g2Flash === "correct"
                      ? "border-[#4ade80] text-[#4ade80]"
                      : g2Flash === "wrong"
                        ? "border-red-500 text-red-400"
                        : "border-border"
                  }`}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {g2Problems[g2Cur]?.question}
                </motion.div>
              </AnimatePresence>
              {g2ShowRow && (
                <div className="rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-2 text-xs font-mono text-[#f59e0b] text-center overflow-x-auto">
                  {g2ShowRow}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {g2Problems[g2Cur]?.options?.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => g2Choose(i)}
                    disabled={!!g2Flash}
                    data-ocid={`mental_math.mm_option.${i + 1}`}
                    className={`py-5 rounded-xl border-2 text-2xl font-black transition-all ${
                      g2Chosen === i
                        ? opt === g2Problems[g2Cur].answer
                          ? "border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80]"
                          : "border-red-500 bg-red-500/20 text-red-400"
                        : g2Flash && opt === g2Problems[g2Cur].answer
                          ? "border-[#4ade80] bg-[#4ade80]/10"
                          : "border-border hover:border-[#f59e0b] hover:bg-[#f59e0b]/10"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 3: Lightning Round ═══════════ */}
      {gameId === "lightning-round" && (
        <>
          {g3Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#f59e0b]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Lightning Round
              </h2>
              <p className="text-muted-foreground text-center max-w-sm">
                5 seconds per question. 3 strikes and you're out. Difficulty
                escalates every 5 correct answers.
              </p>
              <p className="text-xs text-muted-foreground">
                Tier 1: +/- | Tier 2: x/÷ | Tier 3: Mixed | Tier 4: 2-step |
                Tier 5: Percentages
              </p>
              <button
                type="button"
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setG3Phase("playing");
                }}
                className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90"
                data-ocid="mental_math.lr_start_button"
              >
                Start Lightning
              </button>
            </motion.div>
          )}
          {g3Phase === "playing" && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="w-full h-3 bg-muted rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${g3QuestionTime <= 2 ? "bg-red-500" : "bg-[#f59e0b]"}`}
                  style={{ width: `${(g3QuestionTime / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-mono text-[#f59e0b]">
                  {g3QuestionTime}s
                </span>
                <span className="text-muted-foreground">
                  Tier {g3Tier} | Streak {g3Streak}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < g3Strikes ? "bg-red-500" : "bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={g3AnsweredCount}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-5xl font-black text-center py-6 rounded-2xl border-2 transition-colors ${
                    g3Flash === "correct"
                      ? "border-[#4ade80] text-[#4ade80]"
                      : g3Flash === "wrong"
                        ? "border-red-500 text-red-400"
                        : "border-border"
                  }`}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {g3Problem.question}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs text-center text-muted-foreground">
                Score:{" "}
                <span className="text-[#f59e0b] font-bold">{g3Score}</span> |
                Correct: {g3AnsweredCount}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {g3Problem.options?.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => g3Choose(i)}
                    disabled={!!g3Flash}
                    data-ocid={`mental_math.lr_option.${i + 1}`}
                    className={`py-5 rounded-xl border-2 text-2xl font-black transition-all ${
                      g3Chosen === i
                        ? opt === g3Problem.answer
                          ? "border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80]"
                          : "border-red-500 bg-red-500/20 text-red-400"
                        : g3Flash && opt === g3Problem.answer
                          ? "border-[#4ade80] bg-[#4ade80]/10"
                          : "border-border hover:border-[#f59e0b] hover:bg-[#f59e0b]/10"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
