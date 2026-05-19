import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Question {
  sentence: string;
  options: string[];
  answer: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    sentence: "She was very ___ about the test results.",
    options: ["nervous", "table", "running", "blue"],
    answer: "nervous",
  },
  {
    sentence: "He ___ to school every morning.",
    options: ["walked", "elephant", "beautiful", "quickly"],
    answer: "walked",
  },
  {
    sentence: "The sky is ___ during the day.",
    options: ["blue", "cold", "round", "tall"],
    answer: "blue",
  },
  {
    sentence: "Please ___ the door when you leave.",
    options: ["close", "eat", "jump", "drink"],
    answer: "close",
  },
  {
    sentence: "She smiled ___ at the good news.",
    options: ["happily", "heavy", "before", "tree"],
    answer: "happily",
  },
  {
    sentence: "The children ___ in the park after school.",
    options: ["played", "mountain", "silver", "bought"],
    answer: "played",
  },
  {
    sentence: "He felt very ___ after running for an hour.",
    options: ["tired", "square", "purple", "ancient"],
    answer: "tired",
  },
  {
    sentence: "The ___ barked loudly at the stranger.",
    options: ["dog", "cloud", "pencil", "ocean"],
    answer: "dog",
  },
  {
    sentence: "We need to ___ water to stay healthy.",
    options: ["drink", "build", "paint", "sing"],
    answer: "drink",
  },
  {
    sentence: "The teacher ___ the students to read quietly.",
    options: ["asked", "flew", "grew", "broke"],
    answer: "asked",
  },
  {
    sentence: "She ___ a beautiful song at the concert.",
    options: ["sang", "drove", "planted", "fixed"],
    answer: "sang",
  },
  {
    sentence: "The flowers ___ in spring.",
    options: ["bloom", "freeze", "fall", "swim"],
    answer: "bloom",
  },
  {
    sentence: "He was ___ to help his friend.",
    options: ["happy", "square", "electric", "frozen"],
    answer: "happy",
  },
  {
    sentence: "The stars ___ brightly in the night sky.",
    options: ["shine", "sleep", "eat", "run"],
    answer: "shine",
  },
  {
    sentence: "They ___ the whole house before the party.",
    options: ["cleaned", "jumped", "counted", "whispered"],
    answer: "cleaned",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

type Phase = "idle" | "playing" | "over";

export default function WordInContext({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions] = useState<Question[]>(() =>
    [...ALL_QUESTIONS].sort(() => Math.random() - 0.5),
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedWrong, setSelectedWrong] = useState<string | null>(null);
  const { triggerShake, triggerParticle, triggerCombo, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(
      buildResult(config, score, correct / questions.length, 120, true),
    );
  }, [config, score, correct, questions.length, onGameEnd]);

  const { timeLeft, start, reset } = useGameTimer(120, handleExpire);

  const startGame = () => {
    reset();
    setIndex(0);
    setScore(0);
    setLives(3);
    setCorrect(0);
    setFeedback(null);
    setSelectedWrong(null);
    setPhase("playing");
    start();
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;
    const q = questions[index];
    if (option === q.answer) {
      const newScore = score + 10;
      const newCorrect = correct + 1;
      setScore(newScore);
      setCorrect(newCorrect);
      setFeedback("correct");
      triggerParticle(200, 200, "correct");
      triggerCombo(1);
      triggerMascotReaction("correct");
      setTimeout(() => {
        setFeedback(null);
        setSelectedWrong(null);
        if (index + 1 >= questions.length) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              newScore,
              newCorrect / questions.length,
              120 - timeLeft,
              true,
            ),
          );
        } else {
          setIndex((i) => i + 1);
        }
      }, 800);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setSelectedWrong(option);
      setFeedback("wrong");
      triggerShake();
      triggerMascotReaction("wrong");
      setTimeout(() => {
        setFeedback(null);
        setSelectedWrong(null);
        if (newLives <= 0) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              correct / questions.length,
              120 - timeLeft,
              false,
            ),
          );
        }
      }, 700);
    }
  };

  const q = questions[index];
  const parts = phase === "playing" ? q.sentence.split("___") : [];

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
            Word In Context
          </h2>
          <p className="text-white/70 mb-2">
            Choose the word that best fits each sentence.
          </p>
          <p className="text-white/50 text-sm mb-6">
            15 questions / 3 lives / 120 seconds
          </p>
          <GlowButton data-ocid="wic.start_button" onClick={startGame}>
            Start Game
          </GlowButton>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">Game Over</h2>
          <p className="text-white/70 text-xl mb-1">
            Score: <span className="text-[#00f5ff] font-bold">{score}</span>
          </p>
          <p className="text-white/50 mb-6">
            Correct: {correct} / {questions.length}
          </p>
          <GlowButton data-ocid="wic.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          Q {index + 1}/{questions.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 20 ? "text-[#f43f5e]" : "text-[#10b981]"}`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
        <p className="text-xl text-white/90 leading-relaxed">
          {parts[0]}
          <span className="inline-block px-4 py-1 mx-1 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/40 text-[#00f5ff] font-bold min-w-[80px]">
            {feedback === "correct" ? q.answer : "___"}
          </span>
          {parts[1]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {q.options.map((opt) => {
          let cls =
            "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-white font-semibold text-lg cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#00f5ff]/40";
          if (feedback === "correct" && opt === q.answer)
            cls += " border-[#10b981] bg-[#10b981]/20 text-[#10b981]";
          if (selectedWrong === opt)
            cls += " border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]";
          return (
            <button
              type="button"
              key={opt}
              data-ocid={`wic.option.${opt}`}
              className={cls}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
