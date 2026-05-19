import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const ACTIVITIES = [
  {
    id: "Rest",
    label: "Rest",
    bpm: 70,
    color: "#10b981",
    bg: "border-emerald-500/40 bg-emerald-500/10",
  },
  {
    id: "Walk",
    label: "Walk",
    bpm: 100,
    color: "#00f5ff",
    bg: "border-cyan-500/40 bg-cyan-500/10",
  },
  {
    id: "Run",
    label: "Run",
    bpm: 150,
    color: "#f59e0b",
    bg: "border-amber-500/40 bg-amber-500/10",
  },
  {
    id: "Sprint",
    label: "Sprint",
    bpm: 185,
    color: "#f43f5e",
    bg: "border-rose-500/40 bg-rose-500/10",
  },
];

const QUESTIONS = [
  { q: "Is 70 bpm normal for resting?", activity: "Rest", answer: true },
  { q: "Is 150 bpm normal for running?", activity: "Run", answer: true },
  {
    q: "Is 185 bpm dangerous for sprinting?",
    activity: "Sprint",
    answer: false,
  },
  {
    q: "Would 70 bpm be too slow during exercise?",
    activity: "Walk",
    answer: true,
  },
  { q: "Is 100 bpm normal when walking?", activity: "Walk", answer: true },
  {
    q: "Does your heart rate increase with activity?",
    activity: "Run",
    answer: true,
  },
  {
    q: "Is resting heart rate typically between 60-100 bpm?",
    activity: "Rest",
    answer: true,
  },
  {
    q: "Should your heart rate be 185 bpm while sleeping?",
    activity: "Sprint",
    answer: false,
  },
  {
    q: "Athletes often have lower resting heart rates - true?",
    activity: "Rest",
    answer: true,
  },
  {
    q: "Can regular exercise improve your heart health?",
    activity: "Run",
    answer: true,
  },
];

export default function HeartRateSimulator({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [pulseWidth, setPulseWidth] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const { triggerShake, triggerCombo, triggerMascotReaction } = useGameFeel();

  const endGame = useCallback(
    (finalScore: number, correct: number, lv: number) => {
      setPhase("over");
      const timeSpent = (Date.now() - startTimeRef.current) / 1000;
      onGameEnd(
        buildResult(
          config,
          finalScore,
          correct / QUESTIONS.length,
          timeSpent,
          lv > 0,
        ),
      );
    },
    [config, onGameEnd],
  );

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(90, () => {
    endGame(score, correctCount, lives);
  });

  useEffect(() => {
    if (phase !== "playing") return;
    if (pulseRef.current) clearInterval(pulseRef.current);
    let forward = true;
    let width = 0;
    const interval = 60000 / activity.bpm / 40;
    pulseRef.current = setInterval(() => {
      if (forward) {
        width = Math.min(100, width + 2.5);
        if (width >= 100) forward = false;
      } else {
        width = Math.max(0, width - 2.5);
        if (width <= 0) forward = true;
      }
      setPulseWidth(width);
    }, interval);
    return () => {
      if (pulseRef.current) clearInterval(pulseRef.current);
    };
  }, [activity, phase]);

  const startGame = () => {
    setPhase("playing");
    setQIndex(0);
    setScore(0);
    setLives(3);
    setCorrectCount(0);
    setActivity(ACTIVITIES[0]);
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const handleAnswer = (answer: boolean) => {
    const q = QUESTIONS[qIndex];
    if (answer === q.answer) {
      setFeedback("correct");
      const ns = score + 10;
      const nc = correctCount + 1;
      setScore(ns);
      setCorrectCount(nc);
      triggerCombo(1);
      triggerMascotReaction("correct");
      setTimeout(() => {
        setFeedback(null);
        if (qIndex + 1 >= QUESTIONS.length) {
          endGame(ns, nc, lives);
        } else {
          setQIndex((i) => i + 1);
        }
      }, 800);
    } else {
      setFeedback("wrong");
      const nl = lives - 1;
      setLives(nl);
      triggerShake();
      triggerMascotReaction("wrong");
      setTimeout(() => {
        setFeedback(null);
        if (nl <= 0) {
          endGame(score, correctCount, 0);
        } else if (qIndex + 1 >= QUESTIONS.length) {
          endGame(score, correctCount, nl);
        } else {
          setQIndex((i) => i + 1);
        }
      }, 800);
    }
  };

  const act =
    ACTIVITIES.find((a) => a.id === QUESTIONS[qIndex]?.activity) || activity;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <h2 className="text-3xl font-bold text-foreground">
          Heart Rate Simulator
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Explore how physical activity affects heart rate. Answer 10 questions
          about BPM and body health.
        </p>
        <div className="flex gap-4">
          {ACTIVITIES.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border px-4 py-3 text-center ${a.bg}`}
            >
              <div className="font-bold" style={{ color: a.color }}>
                {a.label}
              </div>
              <div className="text-sm text-muted-foreground">{a.bpm} bpm</div>
            </div>
          ))}
        </div>
        <GlowButton data-ocid="heart.start_button" onClick={startGame}>
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">Game Over</h2>
        <p className="text-2xl text-cyan-400">Score: {score}</p>
        <p className="text-muted-foreground">
          Correct: {correctCount} / {QUESTIONS.length}
        </p>
        <GlowButton data-ocid="heart.restart_button" onClick={startGame}>
          Play Again
        </GlowButton>
      </div>
    );
  }

  const q = QUESTIONS[qIndex];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-rose-500" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div className="text-cyan-400 font-mono text-lg">{timeLeft}s</div>
        <div className="text-foreground font-bold">Score: {score}</div>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {ACTIVITIES.map((a) => (
          <button
            type="button"
            key={a.id}
            data-ocid={`heart.activity.${a.id.toLowerCase()}`}
            onClick={() => setActivity(a)}
            className={`rounded-xl border px-4 py-2 font-semibold transition-all ${a.bg} ${activity.id === a.id ? "ring-2 ring-white/30 scale-105" : "opacity-70 hover:opacity-100"}`}
            style={{ color: a.color }}
          >
            {a.label} — {a.bpm} bpm
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col items-center gap-4">
        <div className="text-muted-foreground text-sm">Current BPM</div>
        <div className="text-5xl font-bold" style={{ color: activity.color }}>
          {activity.bpm}
        </div>
        <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{ width: `${pulseWidth}%`, background: activity.color }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {activity.label} activity
        </div>
      </div>

      <div
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all ${
          feedback === "correct"
            ? "ring-2 ring-emerald-500 bg-emerald-500/10"
            : feedback === "wrong"
              ? "ring-2 ring-rose-500 bg-rose-500/10"
              : ""
        }`}
      >
        <div className="text-xs text-muted-foreground mb-2">
          Question {qIndex + 1} / {QUESTIONS.length}
        </div>
        <div className="text-lg font-semibold text-foreground mb-6">{q.q}</div>
        <div className="flex gap-4 justify-center">
          <GlowButton
            data-ocid="heart.yes_button"
            onClick={() => handleAnswer(true)}
            disabled={!!feedback}
          >
            Yes
          </GlowButton>
          <GlowButton
            data-ocid="heart.no_button"
            onClick={() => handleAnswer(false)}
            disabled={!!feedback}
          >
            No
          </GlowButton>
        </div>
        {feedback && (
          <div
            className={`text-center mt-4 font-bold ${feedback === "correct" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {feedback === "correct" ? "+10 Correct!" : "Wrong!"}
          </div>
        )}
      </div>
    </div>
  );
}
