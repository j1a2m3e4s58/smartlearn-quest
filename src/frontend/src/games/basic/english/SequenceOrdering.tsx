import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Story {
  events: string[];
  order: number[];
}

const STORIES: Story[] = [
  {
    events: [
      "John went to the market",
      "He bought vegetables",
      "He cooked dinner",
      "He ate with his family",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "She woke up early",
      "She brushed her teeth",
      "She had breakfast",
      "She went to school",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "The seed was planted",
      "It was watered daily",
      "A small plant grew",
      "The plant became a tree",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "He fell down",
      "He cried in pain",
      "His mother helped him",
      "He felt better",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "She read the recipe",
      "She gathered the ingredients",
      "She mixed everything together",
      "She baked a delicious cake",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "The alarm rang",
      "He got dressed quickly",
      "He ran to the bus stop",
      "He arrived at school just in time",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "The caterpillar ate leaves",
      "It formed a cocoon",
      "Days passed quietly",
      "A butterfly emerged",
    ],
    order: [0, 1, 2, 3],
  },
  {
    events: [
      "She noticed it was raining",
      "She found her umbrella",
      "She walked carefully to school",
      "She arrived dry and happy",
    ],
    order: [0, 1, 2, 3],
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

export default function SequenceOrdering({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stories] = useState<Story[]>(() =>
    [...STORIES].sort(() => Math.random() - 0.5),
  );
  const [storyIdx, setStoryIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const { triggerShake, triggerParticle, triggerCombo, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(buildResult(config, score, correct / stories.length, 120, true));
  }, [config, score, correct, stories.length, onGameEnd]);

  const { timeLeft, start, reset } = useGameTimer(120, handleExpire);

  const initStory = (idx: number) => {
    const s = stories[idx];
    const sh = [...s.order].sort(() => Math.random() - 0.5);
    setShuffled(sh);
    setSequence([]);
  };

  const startGame = () => {
    reset();
    setStoryIdx(0);
    setScore(0);
    setLives(3);
    setCorrect(0);
    setFeedback(null);
    initStory(0);
    setPhase("playing");
    start();
  };

  const handleCardClick = (eventIdx: number) => {
    if (feedback) return;
    if (sequence.includes(eventIdx)) return;
    setSequence((prev) => [...prev, eventIdx]);
  };

  const handleRemove = (pos: number) => {
    if (feedback) return;
    setSequence((prev) => prev.filter((_, i) => i !== pos));
  };

  const handleSubmit = () => {
    if (sequence.length !== 4 || feedback) return;
    const story = stories[storyIdx];
    const isCorrect = sequence.every((v, i) => v === story.order[i]);
    if (isCorrect) {
      const ns = score + 20;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      setFeedback("correct");
      triggerParticle(200, 200, "correct");
      triggerCombo(1);
      triggerMascotReaction("correct");
      setTimeout(() => {
        setFeedback(null);
        if (storyIdx + 1 >= stories.length) {
          setPhase("over");
          onGameEnd(
            buildResult(config, ns, nc / stories.length, 120 - timeLeft, true),
          );
        } else {
          const next = storyIdx + 1;
          setStoryIdx(next);
          initStory(next);
        }
      }, 900);
    } else {
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      triggerShake();
      triggerMascotReaction("wrong");
      setTimeout(() => {
        setFeedback(null);
        setSequence([]);
        if (nl <= 0) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              correct / stories.length,
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
            Sequence Ordering
          </h2>
          <p className="text-white/70 mb-2">
            Arrange the story events in the correct order by clicking them.
          </p>
          <p className="text-white/50 text-sm mb-6">
            8 stories / 3 lives / 120 seconds / +20 per correct story
          </p>
          <GlowButton data-ocid="so.start_button" onClick={startGame}>
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
            Correct: {correct} / {stories.length}
          </p>
          <GlowButton data-ocid="so.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const story = stories[storyIdx];
  const remaining = shuffled.filter((idx) => !sequence.includes(idx));

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          Story {storyIdx + 1}/{stories.length}
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
          Your sequence (click to remove)
        </p>
        <div className="flex flex-col gap-2 min-h-[160px]">
          {[0, 1, 2, 3].map((pos) => (
            <div
              key={pos}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                sequence[pos] !== undefined
                  ? feedback === "correct"
                    ? "border-[#10b981] bg-[#10b981]/10"
                    : feedback === "wrong"
                      ? "border-[#f43f5e] bg-[#f43f5e]/10"
                      : "border-[#00f5ff]/30 bg-[#00f5ff]/5 cursor-pointer hover:bg-[#00f5ff]/10"
                  : "border-white/10 bg-white/5"
              }`}
              onClick={() => sequence[pos] !== undefined && handleRemove(pos)}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  sequence[pos] !== undefined
                )
                  handleRemove(pos);
              }}
              role="button"
              tabIndex={sequence[pos] !== undefined ? 0 : -1}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border ${
                  sequence[pos] !== undefined
                    ? "border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/10"
                    : "border-white/20 text-white/30"
                }`}
              >
                {pos + 1}
              </span>
              <span className="text-white/80 text-sm">
                {sequence[pos] !== undefined ? (
                  story.events[sequence[pos]]
                ) : (
                  <span className="text-white/20">---</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
          Click to add to sequence
        </p>
        <div className="flex flex-col gap-2">
          {remaining.map((idx) => (
            <button
              type="button"
              key={idx}
              data-ocid={`so.event.${idx}`}
              onClick={() => handleCardClick(idx)}
              disabled={!!feedback}
              className="text-left rounded-xl border border-white/20 bg-white/5 p-3 text-white/80 text-sm cursor-pointer hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/5 transition-all duration-200"
            >
              {story.events[idx]}
            </button>
          ))}
        </div>
      </div>

      <GlowButton
        data-ocid="so.submit_button"
        onClick={handleSubmit}
        disabled={sequence.length !== 4 || !!feedback}
      >
        Submit Order
      </GlowButton>
    </div>
  );
}
