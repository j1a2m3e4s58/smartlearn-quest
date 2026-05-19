import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

type MeasureType = "length" | "weight" | "volume" | "angle";
interface MeasureTask {
  type: MeasureType;
  objectName: string;
  actualValue: number;
  unit: string;
  toolLabel: string;
  scale: number;
  precision: number;
}

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

const TASKS_BY_DIFF: Record<1 | 2 | 3, MeasureTask[]> = {
  1: [
    {
      type: "length",
      objectName: "Pencil",
      actualValue: 15,
      unit: "cm",
      toolLabel: "Ruler (cm)",
      scale: 20,
      precision: 0,
    },
    {
      type: "length",
      objectName: "Book width",
      actualValue: 21,
      unit: "cm",
      toolLabel: "Ruler (cm)",
      scale: 30,
      precision: 0,
    },
    {
      type: "weight",
      objectName: "Apple",
      actualValue: 200,
      unit: "g",
      toolLabel: "Scale (g)",
      scale: 500,
      precision: 0,
    },
    {
      type: "volume",
      objectName: "Cup of water",
      actualValue: 250,
      unit: "mL",
      toolLabel: "Jug (mL)",
      scale: 500,
      precision: 0,
    },
    {
      type: "angle",
      objectName: "Angle A",
      actualValue: 45,
      unit: "deg",
      toolLabel: "Protractor",
      scale: 180,
      precision: 0,
    },
  ],
  2: [
    {
      type: "length",
      objectName: "Nail",
      actualValue: 3.5,
      unit: "cm",
      toolLabel: "Ruler (mm)",
      scale: 10,
      precision: 1,
    },
    {
      type: "weight",
      objectName: "Stone",
      actualValue: 1.25,
      unit: "kg",
      toolLabel: "Scale (kg)",
      scale: 5,
      precision: 2,
    },
    {
      type: "volume",
      objectName: "Bottle",
      actualValue: 0.75,
      unit: "L",
      toolLabel: "Jug (L)",
      scale: 2,
      precision: 2,
    },
    {
      type: "angle",
      objectName: "Angle B",
      actualValue: 127,
      unit: "deg",
      toolLabel: "Protractor",
      scale: 180,
      precision: 0,
    },
    {
      type: "length",
      objectName: "Ribbon",
      actualValue: 8.4,
      unit: "cm",
      toolLabel: "Ruler (mm)",
      scale: 15,
      precision: 1,
    },
  ],
  3: [
    {
      type: "length",
      objectName: "Wire",
      actualValue: 1.67,
      unit: "m",
      toolLabel: "Tape (m)",
      scale: 3,
      precision: 2,
    },
    {
      type: "weight",
      objectName: "Box",
      actualValue: 3.75,
      unit: "kg",
      toolLabel: "Scale (kg)",
      scale: 10,
      precision: 2,
    },
    {
      type: "volume",
      objectName: "Flask",
      actualValue: 0.325,
      unit: "L",
      toolLabel: "Jug (L)",
      scale: 0.5,
      precision: 3,
    },
    {
      type: "angle",
      objectName: "Angle C",
      actualValue: 63,
      unit: "deg",
      toolLabel: "Protractor",
      scale: 180,
      precision: 0,
    },
    {
      type: "length",
      objectName: "Thin wire",
      actualValue: 23.5,
      unit: "mm",
      toolLabel: "Vernier (mm)",
      scale: 50,
      precision: 1,
    },
  ],
};

// ── Game 1: Measurement Mission ──────────────────────────────────────────────
function MeasurementMission({ config, onGameEnd }: Props) {
  const tasks = TASKS_BY_DIFF[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [taskIdx, setTaskIdx] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [readingPos, setReadingPos] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    setPhase("over");
    const acc =
      totalRef.current > 0 ? (correctRef.current / totalRef.current) * 100 : 0;
    const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
    onGameEnd(buildResult(config, scoreRef.current, acc, ts, false));
  });

  const endGame = useCallback(
    (s: number, c: number, t: number) => {
      setPhase("over");
      const acc = t > 0 ? (c / t) * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd],
  );

  const task = tasks[taskIdx];
  const indicatorPct = task ? (task.actualValue / task.scale) * 100 : 0;

  function placeTool() {
    setPlaced(true);
    setReadingPos(indicatorPct);
  }

  function submitReading() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newTotal = total + 1;
    setTotal(newTotal);
    const tol = task.precision === 0 ? 0.5 : task.precision === 1 ? 0.05 : 0.01;
    const ok = Math.abs(val - task.actualValue) <= tol;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = ok ? score + 200 : Math.max(0, score);
    setCorrect(newCorrect);
    setScore(newScore);
    setFeedback({
      msg: ok
        ? `Correct! ${task.actualValue} ${task.unit}`
        : `Incorrect. Value was ${task.actualValue} ${task.unit}`,
      ok,
    });
    const nextIdx = taskIdx + 1;
    if (nextIdx >= tasks.length) {
      setTimeout(() => endGame(newScore, newCorrect, newTotal), 1000);
    } else {
      setTimeout(() => {
        setTaskIdx(nextIdx);
        setPlaced(false);
        setInput("");
        setFeedback(null);
      }, 1200);
    }
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="measurement_lab.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#06b6d4]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Measurement Mission
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Use virtual measurement tools — rulers, scales, protractors, and
            jugs — to measure objects accurately.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
              startTimer();
            }}
            className="px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="measurement_lab.start_button"
          >
            Start Lab
          </button>
        </motion.div>
      )}
      {phase === "playing" && task && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-[#06b6d4] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Task {taskIdx + 1}/{tasks.length}
            </span>
            <span>
              Score: <span className="text-[#06b6d4] font-bold">{score}</span>
            </span>
            <span>{timeLeft}s</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={taskIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl border border-border/30 bg-card">
                <p className="text-sm text-muted-foreground mb-1">
                  Object to measure:
                </p>
                <p className="text-xl font-bold text-[#06b6d4]">
                  {task.objectName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tool: {task.toolLabel}
                </p>
              </div>
              {!placed ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Click "Place Tool" to measure the object:
                  </p>
                  <button
                    type="button"
                    onClick={placeTool}
                    className="px-5 py-2 rounded border-2 border-[#06b6d4] text-[#06b6d4] font-bold hover:bg-[#06b6d4]/10 transition-colors"
                    data-ocid="measurement_lab.place_tool"
                  >
                    Place {task.toolLabel}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-[#06b6d4]/40 bg-card">
                    <div className="text-xs text-muted-foreground mb-2">
                      {task.toolLabel} Reading:
                    </div>
                    <div className="relative w-full h-8 bg-muted rounded overflow-hidden">
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: 11 }, (_, i) => (
                          <div
                            key={i}
                            className="flex-1 border-r border-border/30 flex items-end pb-1"
                          >
                            <span
                              className="text-xs text-muted-foreground"
                              style={{ fontSize: 8 }}
                            >
                              {((task.scale * i) / 10).toFixed(task.precision)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 transition-all duration-500"
                        style={{ left: `${readingPos}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Read the measurement value ({task.unit}):
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        step={
                          task.precision === 0
                            ? "1"
                            : task.precision === 1
                              ? "0.1"
                              : "0.01"
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitReading()}
                        className="w-32 text-center text-xl font-bold rounded border-2 border-[#06b6d4]/50 bg-background focus:border-[#06b6d4] focus:outline-none p-2"
                        placeholder={`0.${"0".repeat(task.precision)}`}
                        data-ocid="measurement_lab.reading_input"
                      />
                      <button
                        type="button"
                        onClick={submitReading}
                        className="px-5 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity"
                        data-ocid="measurement_lab.submit_button"
                      >
                        Record
                      </button>
                    </div>
                    {feedback && (
                      <p
                        className="text-sm font-bold"
                        style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
                      >
                        {feedback.msg}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Unit conversion helpers ───────────────────────────────────────────────────
interface ConvQuestion {
  question: string;
  answer: number;
  unit: string;
  category: string;
}

function genConvQuestion(diff: 1 | 2 | 3): ConvQuestion {
  const easy: ConvQuestion[] = [
    { question: "5 km = ? m", answer: 5000, unit: "m", category: "Length" },
    { question: "3000 m = ? km", answer: 3, unit: "km", category: "Length" },
    { question: "250 cm = ? m", answer: 2.5, unit: "m", category: "Length" },
    { question: "2 kg = ? g", answer: 2000, unit: "g", category: "Mass" },
    { question: "500 g = ? kg", answer: 0.5, unit: "kg", category: "Mass" },
    { question: "3 L = ? mL", answer: 3000, unit: "mL", category: "Volume" },
    { question: "1500 mL = ? L", answer: 1.5, unit: "L", category: "Volume" },
    {
      question: "2 hours = ? minutes",
      answer: 120,
      unit: "min",
      category: "Time",
    },
    {
      question: "180 minutes = ? hours",
      answer: 3,
      unit: "hours",
      category: "Time",
    },
    {
      question: "90 seconds = ? minutes",
      answer: 1.5,
      unit: "min",
      category: "Time",
    },
  ];
  const med: ConvQuestion[] = [
    { question: "4.5 km = ? m", answer: 4500, unit: "m", category: "Length" },
    { question: "750 cm = ? m", answer: 7.5, unit: "m", category: "Length" },
    { question: "2.3 kg = ? g", answer: 2300, unit: "g", category: "Mass" },
    { question: "4500 g = ? kg", answer: 4.5, unit: "kg", category: "Mass" },
    { question: "2.75 L = ? mL", answer: 2750, unit: "mL", category: "Volume" },
    { question: "3250 mL = ? L", answer: 3.25, unit: "L", category: "Volume" },
    {
      question: "2.5 hours = ? minutes",
      answer: 150,
      unit: "min",
      category: "Time",
    },
    {
      question: "135 minutes = ? hours",
      answer: 2.25,
      unit: "hours",
      category: "Time",
    },
    {
      question: "3 hours = ? seconds",
      answer: 10800,
      unit: "sec",
      category: "Time",
    },
    { question: "100 mm = ? cm", answer: 10, unit: "cm", category: "Length" },
  ];
  const hard: ConvQuestion[] = [
    {
      question: "1.25 km = ? cm",
      answer: 125000,
      unit: "cm",
      category: "Length",
    },
    { question: "3.75 kg = ? g", answer: 3750, unit: "g", category: "Mass" },
    { question: "0.5 L = ? mL", answer: 500, unit: "mL", category: "Volume" },
    {
      question: "7200 seconds = ? hours",
      answer: 2,
      unit: "hours",
      category: "Time",
    },
    { question: "2.5 m = ? mm", answer: 2500, unit: "mm", category: "Length" },
    {
      question: "3 hours 15 min = ? minutes",
      answer: 195,
      unit: "min",
      category: "Time",
    },
    {
      question: "4.5 L = ? cm³",
      answer: 4500,
      unit: "cm³",
      category: "Volume",
    },
    { question: "1500 mm = ? m", answer: 1.5, unit: "m", category: "Length" },
  ];
  const pool = diff === 1 ? easy : diff === 2 ? med : hard;
  return pool[randInt(0, pool.length - 1)];
}

// ── Game 2: Unit Converter ────────────────────────────────────────────────────
function UnitConverter({ config, onGameEnd }: Props) {
  const TOTAL = 20;
  const TIME_PER_Q = 10;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [qIdx, setQIdx] = useState(0);
  const [question, setQuestion] = useState<ConvQuestion>(() =>
    genConvQuestion(config.difficulty),
  );
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [qTimer, setQTimer] = useState(TIME_PER_Q);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const phaseRef = useRef<"idle" | "playing" | "over">("idle");
  scoreRef.current = score;
  correctRef.current = correct;
  phaseRef.current = phase;

  const endGame = useCallback(
    (s: number, c: number, won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = TOTAL > 0 ? (c / TOTAL) * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, acc, ts, won));
    },
    [config, onGameEnd],
  );

  const nextQuestion = useCallback(
    (s: number, c: number, idx: number) => {
      if (idx >= TOTAL) {
        endGame(s, c, true);
        return;
      }
      setQuestion(genConvQuestion(config.difficulty));
      setInput("");
      setFeedback(null);
      setQTimer(TIME_PER_Q);
      setQIdx(idx);
    },
    [config.difficulty, endGame],
  );

  // per-question countdown
  const qTimerRef = useRef(qTimer);
  qTimerRef.current = qTimer;
  const qIdxRef = useRef(qIdx);
  qIdxRef.current = qIdx;

  const [timerTick, setTimerTick] = useState(0);
  const timerTickRef = useRef(timerTick);
  timerTickRef.current = timerTick;

  // Use a simple interval that restarts when phase=playing and updates qTimer
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreForTimeout = useRef(0);
  scoreForTimeout.current = score;
  const correctForTimeout = useRef(0);
  correctForTimeout.current = correct;
  const streakRef = useRef(streak);
  streakRef.current = streak;

  function startGame() {
    startTimeRef.current = Date.now();
    setQTimer(TIME_PER_Q);
    setQIdx(0);
    setQuestion(genConvQuestion(config.difficulty));
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setFeedback(null);
    setInput("");
    setPhase("playing");
  }

  // Countdown interval
  const qTimerState = qTimer;
  const phaseState = phase;

  const runInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseRef.current !== "playing") return;
    intervalRef.current = setInterval(() => {
      setQTimer((prev) => {
        if (prev <= 1) {
          // time out this question
          const nextIdx = qIdxRef.current + 1;
          streakRef.current = 0;
          setStreak(0);
          setFeedback({ msg: "Time! Moving on...", ok: false });
          setTimeout(() => {
            setFeedback(null);
            nextQuestion(
              scoreForTimeout.current,
              correctForTimeout.current,
              nextIdx,
            );
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [nextQuestion]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Restart interval when qIdx changes during play
  const lastQIdx = useRef(-1);
  if (phaseState === "playing" && qIdx !== lastQIdx.current) {
    lastQIdx.current = qIdx;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setQTimer((prev) => {
        if (prev <= 1) {
          const nextIdx = qIdxRef.current + 1;
          streakRef.current = 0;
          setStreak(0);
          setFeedback({ msg: "Time! Moving on...", ok: false });
          setTimeout(() => {
            setFeedback(null);
            nextQuestion(
              scoreForTimeout.current,
              correctForTimeout.current,
              nextIdx,
            );
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  if (phaseState !== "playing" && intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  void runInterval;
  void stopInterval;
  void timerTick;
  void setTimerTick;

  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const tol = question.answer > 100 ? question.answer * 0.01 : 0.01;
    const ok = Math.abs(val - question.answer) <= tol;
    const newStreak = ok ? streak + 1 : 0;
    const multiplier = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
    const pts = ok ? Math.floor(100 * multiplier) : 0;
    const newScore = score + pts;
    const newCorrect = ok ? correct + 1 : correct;
    setStreak(newStreak);
    setScore(newScore);
    setCorrect(newCorrect);
    setFeedback({
      msg: ok
        ? `Correct! x${multiplier} streak bonus`
        : `Wrong. Answer: ${question.answer} ${question.unit}`,
      ok,
    });
    const nextIdx = qIdx + 1;
    setTimeout(() => nextQuestion(newScore, newCorrect, nextIdx), 900);
  }

  const qPct = (qTimerState / TIME_PER_Q) * 100;
  const progPct = (qIdx / TOTAL) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="unit_converter.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#06b6d4]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Unit Converter
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            {TOTAL} conversion questions — 10 seconds each. Build a streak
            multiplier for bonus points. Convert between km, m, cm, kg, g, L,
            mL, hours, and minutes.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="unit_converter.start_button"
          >
            Convert!
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full h-3 bg-muted rounded overflow-hidden">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${qPct}%`,
                background: qTimerState <= 3 ? "#f43f5e" : "#06b6d4",
              }}
            />
          </div>
          <div className="w-full h-1 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-[#4ade80] transition-all duration-200"
              style={{ width: `${progPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span
              className="font-mono"
              style={{ color: qTimerState <= 3 ? "#f43f5e" : undefined }}
            >
              {qTimerState}s
            </span>
            {streak >= 2 && (
              <span className="text-[#f59e0b] font-bold">
                Streak x{streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1}
              </span>
            )}
            <span>
              {qIdx}/{TOTAL}
            </span>
            <span>
              Score: <span className="text-[#06b6d4] font-bold">{score}</span>
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}
              >
                {question.category}
              </div>
              <div
                className="text-4xl font-black text-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {question.question}
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.001"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-36 text-center text-2xl font-bold rounded border-2 border-[#06b6d4]/50 bg-background focus:border-[#06b6d4] focus:outline-none p-2"
                  placeholder="?"
                  data-ocid="unit_converter.answer_input"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="px-5 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity"
                  data-ocid="unit_converter.submit_button"
                >
                  Enter
                </button>
              </div>
              {feedback && (
                <p
                  className="text-sm font-bold"
                  style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
                >
                  {feedback.msg}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Estimation data ──────────────────────────────────────────────────────────
interface EstimObj {
  name: string;
  description: string;
  requestUnit: string;
  actualValue: number;
  context: string;
}

const ESTIMATION_OBJECTS: EstimObj[] = [
  {
    name: "School Desk",
    description: "A standard student classroom desk",
    requestUnit: "cm (length)",
    actualValue: 60,
    context: "Typical desk is about 60 cm wide",
  },
  {
    name: "Pencil",
    description: "A standard HB writing pencil",
    requestUnit: "cm (length)",
    actualValue: 19,
    context: "Standard pencil is about 19 cm long",
  },
  {
    name: "Football Field",
    description: "Full-size football pitch (length)",
    requestUnit: "m (length)",
    actualValue: 105,
    context: "FIFA regulation field is 105 m long",
  },
  {
    name: "Textbook",
    description: "A typical school textbook",
    requestUnit: "g (mass)",
    actualValue: 400,
    context: "Average textbook weighs about 400 g",
  },
  {
    name: "Water Bottle (full)",
    description: "Standard 500mL plastic water bottle",
    requestUnit: "g (mass)",
    actualValue: 510,
    context: "Full 500mL bottle: water (500g) + bottle (~10g)",
  },
  {
    name: "Classroom Door",
    description: "Standard interior classroom door",
    requestUnit: "cm (height)",
    actualValue: 200,
    context: "Standard door height is about 200 cm",
  },
  {
    name: "Car (small sedan)",
    description: "A typical small family car",
    requestUnit: "m (length)",
    actualValue: 4.3,
    context: "Small sedan is about 4.3 m long",
  },
  {
    name: "Swimming Pool",
    description: "Olympic swimming pool (length)",
    requestUnit: "m (length)",
    actualValue: 50,
    context: "Olympic pool is exactly 50 m long",
  },
  {
    name: "Brick",
    description: "Standard red clay building brick",
    requestUnit: "g (mass)",
    actualValue: 2200,
    context: "Standard brick weighs about 2.2 kg",
  },
  {
    name: "Backpack (full, school)",
    description: "Loaded school backpack with books",
    requestUnit: "kg (mass)",
    actualValue: 4,
    context: "A full school backpack is about 4 kg",
  },
  {
    name: "Milk Carton (1L)",
    description: "1-litre school milk carton",
    requestUnit: "mL (volume)",
    actualValue: 1000,
    context: "1-litre carton contains exactly 1000 mL",
  },
  {
    name: "Palm (hand width)",
    description: "Width of an average adult palm",
    requestUnit: "cm (length)",
    actualValue: 8,
    context: "Average palm width is about 8 cm",
  },
];

// ── Game 3: Estimation Expert ─────────────────────────────────────────────────
function EstimationExpert({ config, onGameEnd }: Props) {
  const TOTAL_OBJECTS = 12;
  const [phase, setPhase] = useState<"idle" | "playing" | "result" | "over">(
    "idle",
  );
  const [objIdx, setObjIdx] = useState(0);
  const [objects] = useState<EstimObj[]>(() => {
    const pool = [...ESTIMATION_OBJECTS];
    while (pool.length < TOTAL_OBJECTS) pool.push(...ESTIMATION_OBJECTS);
    return pool.sort(() => Math.random() - 0.5).slice(0, TOTAL_OBJECTS);
  });
  const [input, setInput] = useState("");
  const [lastResult, setLastResult] = useState<{
    pct: number;
    actual: number;
    guess: number;
    unit: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startTimeRef = useRef(Date.now());

  const obj = objects[objIdx];

  function submitEstimate() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val) || val <= 0) {
      setInput("");
      return;
    }
    const pct = Math.abs(val - obj.actualValue) / obj.actualValue;
    const pts = pct <= 0.1 ? 200 : pct <= 0.2 ? 100 : 0;
    const isCorrect = pts > 0;
    const newScore = score + pts;
    const newCorrect = isCorrect ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    setLastResult({
      pct: Math.round(pct * 100),
      actual: obj.actualValue,
      guess: val,
      unit: obj.requestUnit.split(" ")[0],
    });
    setPhase("result");
  }

  function nextObject() {
    const nextIdx = objIdx + 1;
    if (nextIdx >= TOTAL_OBJECTS) {
      setPhase("over");
      const acc = (correct / TOTAL_OBJECTS) * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, score, acc, ts, true));
    } else {
      setObjIdx(nextIdx);
      setInput("");
      setLastResult(null);
      setPhase("playing");
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="estimation_expert.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#06b6d4]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Estimation Expert
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Estimate the real-world measurement of everyday objects. Within 10%
            = full points, within 20% = half points. 12 objects total.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#06b6d4] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="estimation_expert.start_button"
          >
            Begin Estimating
          </button>
        </motion.div>
      )}
      {phase === "playing" && obj && (
        <AnimatePresence mode="wait">
          <motion.div
            key={objIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Object {objIdx + 1}/{TOTAL_OBJECTS}
              </span>
              <span>
                Score: <span className="text-[#06b6d4] font-bold">{score}</span>
              </span>
            </div>
            <div className="p-5 rounded-xl border border-border/30 bg-card flex flex-col gap-2">
              <div className="text-2xl font-black text-[#06b6d4]">
                {obj.name}
              </div>
              <div className="text-muted-foreground text-sm">
                {obj.description}
              </div>
              <div className="mt-2 p-2 rounded bg-muted/30 text-sm">
                Estimate the{" "}
                <span className="text-[#06b6d4] font-bold">
                  {obj.requestUnit}
                </span>{" "}
                of this object:
              </div>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitEstimate()}
                className="w-36 text-center text-2xl font-bold rounded border-2 border-[#06b6d4]/50 bg-background focus:border-[#06b6d4] focus:outline-none p-2"
                placeholder="?"
                data-ocid="estimation_expert.answer_input"
              />
              <button
                type="button"
                onClick={submitEstimate}
                className="px-5 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity"
                data-ocid="estimation_expert.submit_button"
              >
                Estimate
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      {phase === "result" && lastResult && obj && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div className="text-xl font-bold text-center">{obj.name}</div>
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Your Estimate</div>
              <div className="text-2xl font-black">
                {lastResult.guess} {lastResult.unit}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Actual Value</div>
              <div className="text-2xl font-black text-[#06b6d4]">
                {lastResult.actual} {lastResult.unit}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-lg font-bold"
              style={{
                color:
                  lastResult.pct <= 10
                    ? "#4ade80"
                    : lastResult.pct <= 20
                      ? "#f59e0b"
                      : "#f43f5e",
              }}
            >
              {lastResult.pct <= 10
                ? "Excellent! +200 pts"
                : lastResult.pct <= 20
                  ? "Close! +100 pts"
                  : "Off by more than 20%"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {lastResult.pct}% error
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center max-w-xs p-2 rounded bg-muted/30">
            {obj.context}
          </div>
          <button
            type="button"
            onClick={nextObject}
            className="px-6 py-2 rounded bg-[#06b6d4] text-black font-bold hover:opacity-90 transition-opacity"
            data-ocid="estimation_expert.next_button"
          >
            {objIdx + 1 < TOTAL_OBJECTS ? "Next Object" : "See Results"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function MeasurementLab({ config, onGameEnd }: Props) {
  if (config.gameId === "unit-converter")
    return <UnitConverter config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "estimation-expert")
    return <EstimationExpert config={config} onGameEnd={onGameEnd} />;
  return <MeasurementMission config={config} onGameEnd={onGameEnd} />;
}
