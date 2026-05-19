import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface ParagraphChallenge {
  sentences: string[];
  correctOrder: number[];
}

const CHALLENGES: ParagraphChallenge[] = [
  {
    sentences: [
      "Dogs are wonderful pets.",
      "They are loyal and always happy to see you.",
      "Dogs can be trained to do many helpful tasks.",
      "They also protect the home from strangers.",
      "For these reasons, dogs are called man's best friend.",
    ],
    correctOrder: [0, 1, 2, 3, 4],
  },
  {
    sentences: [
      "Reading is one of the most valuable habits a person can develop.",
      "It improves vocabulary and sharpens concentration.",
      "Reading also expands your knowledge about the world.",
      "It helps you understand other people's experiences and emotions.",
      "That is why good readers often become great thinkers and leaders.",
    ],
    correctOrder: [0, 1, 2, 3, 4],
  },
  {
    sentences: [
      "Trees are vital to life on Earth.",
      "They produce oxygen that animals and humans breathe.",
      "Trees also provide food, shelter, and shade.",
      "Their roots hold soil in place and prevent erosion.",
      "Protecting trees means protecting the future of our planet.",
    ],
    correctOrder: [0, 1, 2, 3, 4],
  },
  {
    sentences: [
      "The Internet has changed the way people live and work.",
      "It allows us to communicate instantly across the globe.",
      "Students can now access information and learn online.",
      "Businesses use the Internet to reach millions of customers.",
      "Life today would be very different without this technology.",
    ],
    correctOrder: [0, 1, 2, 3, 4],
  },
  {
    sentences: [
      "Exercise is important for a healthy body and mind.",
      "It strengthens the muscles and improves heart health.",
      "Regular activity also helps reduce stress and anxiety.",
      "Even a short walk each day makes a big difference.",
      "Everyone benefits from making exercise part of their daily routine.",
    ],
    correctOrder: [0, 1, 2, 3, 4],
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

export default function ParagraphOrganizer({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [challenges] = useState<ParagraphChallenge[]>(() =>
    [...CHALLENGES].sort(() => Math.random() - 0.5),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const { triggerShake, triggerParticle, triggerCombo, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(
      buildResult(config, score, correct / challenges.length, 120, true),
    );
  }, [config, score, correct, challenges.length, onGameEnd]);

  const { timeLeft, start, reset } = useGameTimer(120, handleExpire);

  const initChallenge = (i: number) => {
    const c = challenges[i];
    const sh = [...c.correctOrder].sort(() => Math.random() - 0.5);
    setShuffled(sh);
    setPlayerOrder([]);
  };

  const startGame = () => {
    reset();
    setIdx(0);
    setScore(0);
    setLives(3);
    setCorrect(0);
    setFeedback(null);
    initChallenge(0);
    setPhase("playing");
    start();
  };

  const handleAdd = (sentIdx: number) => {
    if (feedback) return;
    if (playerOrder.includes(sentIdx)) return;
    setPlayerOrder((prev) => [...prev, sentIdx]);
  };

  const handleRemove = (pos: number) => {
    if (feedback) return;
    setPlayerOrder((prev) => prev.filter((_, i) => i !== pos));
  };

  const handleSubmit = () => {
    if (playerOrder.length !== 5 || feedback) return;
    const c = challenges[idx];
    const isCorrect = playerOrder.every((v, i) => v === c.correctOrder[i]);
    if (isCorrect) {
      const ns = score + 25;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      setFeedback("correct");
      triggerParticle(200, 200, "correct");
      triggerCombo(1);
      triggerMascotReaction("correct");
      setTimeout(() => {
        setFeedback(null);
        if (idx + 1 >= challenges.length) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              nc / challenges.length,
              120 - timeLeft,
              true,
            ),
          );
        } else {
          const next = idx + 1;
          setIdx(next);
          initChallenge(next);
        }
      }, 1000);
    } else {
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      triggerShake();
      triggerMascotReaction("wrong");
      setTimeout(() => {
        setFeedback(null);
        initChallenge(idx);
        if (nl <= 0) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              correct / challenges.length,
              120 - timeLeft,
              false,
            ),
          );
        }
      }, 800);
    }
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
            Paragraph Organizer
          </h2>
          <p className="text-white/70 mb-2">
            Arrange 5 sentences to form a well-structured paragraph: topic
            sentence, 3 supporting details, conclusion.
          </p>
          <p className="text-white/50 text-sm mb-6">
            5 paragraphs / 3 lives / 120 seconds / +25 per correct paragraph
          </p>
          <GlowButton data-ocid="po.start_button" onClick={startGame}>
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
            Correct: {correct} / {challenges.length}
          </p>
          <GlowButton data-ocid="po.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const c = challenges[idx];
  const remaining = shuffled.filter((si) => !playerOrder.includes(si));

  return (
    <div className="flex flex-col gap-5 p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          Para {idx + 1}/{challenges.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 20 ? "text-[#f43f5e]" : "text-[#10b981]"}`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
          Your paragraph (click slot to remove)
        </p>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((pos) => {
            const role =
              pos === 0
                ? "Topic Sentence"
                : pos === 4
                  ? "Conclusion"
                  : `Supporting Detail ${pos}`;
            const filled = playerOrder[pos] !== undefined;
            return (
              <div
                key={pos}
                onClick={() => filled && handleRemove(pos)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && filled)
                    handleRemove(pos);
                }}
                role="button"
                tabIndex={filled ? 0 : -1}
                className={`flex items-start gap-3 rounded-xl border p-3 transition-all duration-200 ${
                  filled
                    ? feedback === "correct"
                      ? "border-[#10b981] bg-[#10b981]/10"
                      : feedback === "wrong"
                        ? "border-[#f43f5e] bg-[#f43f5e]/10"
                        : "border-[#00f5ff]/30 bg-[#00f5ff]/5 cursor-pointer hover:bg-[#00f5ff]/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex flex-col items-center gap-1 mt-0.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                      filled
                        ? "border-[#00f5ff] text-[#00f5ff]"
                        : "border-white/20 text-white/30"
                    }`}
                  >
                    {pos + 1}
                  </span>
                  <span className="text-[9px] text-white/30 text-center leading-tight w-12">
                    {role}
                  </span>
                </div>
                <span className="text-white/80 text-sm leading-relaxed">
                  {filled ? (
                    c.sentences[playerOrder[pos]]
                  ) : (
                    <span className="text-white/20">--- empty ---</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {remaining.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
            Click to place in paragraph
          </p>
          <div className="flex flex-col gap-2">
            {remaining.map((si) => (
              <button
                type="button"
                key={si}
                data-ocid={`po.sentence.${si}`}
                onClick={() => handleAdd(si)}
                disabled={!!feedback}
                className="text-left rounded-xl border border-white/20 bg-white/5 p-3 text-white/80 text-sm hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/5 transition-all duration-200"
              >
                {c.sentences[si]}
              </button>
            ))}
          </div>
        </div>
      )}

      <GlowButton
        data-ocid="po.submit_button"
        onClick={handleSubmit}
        disabled={playerOrder.length !== 5 || !!feedback}
      >
        Submit Paragraph
      </GlowButton>
    </div>
  );
}
