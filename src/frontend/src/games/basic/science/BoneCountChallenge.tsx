import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

interface Question {
  q: string;
  choices: (number | string)[];
  answer: number | string;
}

const QUESTIONS: Question[] = [
  {
    q: "How many ribs does the human body have?",
    choices: [24, 12, 8, 36],
    answer: 24,
  },
  {
    q: "How many vertebrae does the spine have?",
    choices: [33, 24, 26, 40],
    answer: 33,
  },
  {
    q: "How many bones are in an adult body?",
    choices: [206, 256, 186, 306],
    answer: 206,
  },
  {
    q: "How many bones are in the skull?",
    choices: [22, 8, 12, 30],
    answer: 22,
  },
  {
    q: "How many teeth does a full adult set have?",
    choices: [32, 28, 36, 24],
    answer: 32,
  },
  {
    q: "How many fingers do humans have in total?",
    choices: [10, 8, 12, 6],
    answer: 10,
  },
  {
    q: "How many toes do humans have in total?",
    choices: [10, 8, 12, 6],
    answer: 10,
  },
  {
    q: "How many bones are in one human foot?",
    choices: [26, 16, 20, 30],
    answer: 26,
  },
  {
    q: "How many bones are in one human hand?",
    choices: [27, 20, 22, 30],
    answer: 27,
  },
  {
    q: "Which is the longest bone in the human body?",
    choices: ["Femur", "Tibia", "Humerus", "Fibula"],
    answer: "Femur",
  },
  {
    q: "Which is the smallest bone in the human body?",
    choices: ["Stapes", "Malleus", "Incus", "Coccyx"],
    answer: "Stapes",
  },
  {
    q: "How many cervical vertebrae are in the neck?",
    choices: [7, 5, 9, 12],
    answer: 7,
  },
];

export default function BoneCountChallenge({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { triggerShake, triggerParticle, triggerCombo } = useGameFeel();

  const endGame = useCallback(
    (
      finalScore: number,
      finalCorrect: number,
      finalWrong: number,
      completed: boolean,
    ) => {
      setPhase("over");
      const elapsed = (Date.now() - startTime) / 1000;
      const total = finalCorrect + finalWrong;
      onGameEnd(
        buildResult(
          config,
          finalScore,
          total > 0 ? (finalCorrect / total) * 100 : 0,
          elapsed,
          completed,
        ),
      );
    },
    [config, startTime, onGameEnd],
  );

  const handleExpire = useCallback(() => {
    endGame(score, correct, wrong, false);
  }, [score, correct, wrong, endGame]);

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, handleExpire);

  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setLives(3);
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setAnswered(false);
    setStartTime(Date.now());
    resetTimer();
    startTimer();
  };

  const handleAnswer = (choice: number | string) => {
    if (answered || phase !== "playing") return;
    setAnswered(true);
    const q = QUESTIONS[idx];
    const isCorrect = choice === q.answer;
    if (isCorrect) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      triggerParticle(0, 0, "correct");
      if (nc % 3 === 0) triggerCombo(nc / 3);
      setFeedback({ msg: `Correct! The answer is ${q.answer}.`, ok: true });
      if (idx + 1 >= QUESTIONS.length) {
        setTimeout(() => endGame(ns, nc, wrong, true), 1200);
        return;
      }
    } else {
      const nl = lives - 1;
      const nw = wrong + 1;
      setLives(nl);
      setWrong(nw);
      triggerShake();
      setFeedback({
        msg: `Wrong! The correct answer is ${q.answer}.`,
        ok: false,
      });
      if (nl <= 0) {
        setTimeout(() => endGame(score, correct, nw, false), 1200);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      setIdx((i) => Math.min(i + 1, QUESTIONS.length - 1));
    }, 1200);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
            Bone Count Challenge
          </h2>
          <p className="text-white/70 mb-6">
            Answer 12 questions about the human skeletal system. How well do you
            know your bones?
          </p>
          <GlowButton data-ocid="bone.play_button" onClick={startGame}>
            Play Now
          </GlowButton>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    const total = correct + wrong;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: lives > 0 ? "#10b981" : "#f43f5e" }}
          >
            {lives > 0 ? "Excellent Work!" : "Game Over"}
          </h2>
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#00f5ff]">{score}</div>
              <div className="text-white/50 text-sm">Score</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#10b981]">{acc}%</div>
              <div className="text-white/50 text-sm">Accuracy</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {correct}/{QUESTIONS.length}
              </div>
              <div className="text-white/50 text-sm">Correct</div>
            </div>
          </div>
          <GlowButton data-ocid="bone.play_again_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[idx];
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="text-[#00f5ff] font-bold">Score: {score}</div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-[#f43f5e]" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div
          className={`font-bold ${timeLeft <= 20 ? "text-[#f43f5e] animate-pulse" : "text-[#f59e0b]"}`}
        >
          {timeLeft}s
        </div>
      </div>

      <div className="text-center text-white/40 text-sm">
        {idx + 1} / {QUESTIONS.length}
      </div>

      {feedback && (
        <div
          className={`rounded-lg px-4 py-2 text-sm font-medium text-center ${
            feedback.ok
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
              : "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          {q.q}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {q.choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              data-ocid={`bone.choice.${i + 1}`}
              onClick={() => handleAnswer(choice)}
              disabled={answered}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                answered && choice === q.answer
                  ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981]"
                  : "bg-white/5 border-white/20 text-white/80 hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10"
              } disabled:cursor-not-allowed`}
            >
              {String(choice)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
