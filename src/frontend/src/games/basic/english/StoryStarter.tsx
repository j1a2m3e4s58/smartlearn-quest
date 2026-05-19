import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Prompt {
  opener: string;
  options: string[];
  answer: string;
}

const PROMPTS: Prompt[] = [
  {
    opener: "One stormy night, Emma heard a loud knock at the door.",
    options: [
      "She opened it and found a lost puppy shivering in the rain.",
      "She decided to eat some cereal.",
      "The sun came out and it became a lovely day.",
      "She went to the market to buy vegetables.",
    ],
    answer: "She opened it and found a lost puppy shivering in the rain.",
  },
  {
    opener: "The spaceship landed silently in the farmer's field.",
    options: [
      "Three small glowing figures stepped out and waved.",
      "The farmer decided to plant corn.",
      "It was a beautiful Saturday morning.",
      "The children went to school.",
    ],
    answer: "Three small glowing figures stepped out and waved.",
  },
  {
    opener: "Deep in the forest, a young explorer found a glowing map.",
    options: [
      "He followed it and discovered a hidden waterfall city.",
      "He folded it and put it in his pocket.",
      "She decided to go back home for dinner.",
      "The map was made of old paper.",
    ],
    answer: "He followed it and discovered a hidden waterfall city.",
  },
  {
    opener: "The last scientist on Earth pressed the emergency button.",
    options: [
      "A signal shot into space, calling for help from distant worlds.",
      "She made herself a cup of tea.",
      "The button was red and very large.",
      "She turned off all the computers.",
    ],
    answer: "A signal shot into space, calling for help from distant worlds.",
  },
  {
    opener: "Maya opened the ancient book and the pages began to glow.",
    options: [
      "Words floated off the page and rearranged into a secret message.",
      "She closed it and went to sleep.",
      "The book was very heavy.",
      "She put it back on the shelf.",
    ],
    answer: "Words floated off the page and rearranged into a secret message.",
  },
  {
    opener: "The robot chef arrived at the restaurant and put on an apron.",
    options: [
      "It created dishes no human had ever tasted before.",
      "The restaurant was very crowded.",
      "A chef also arrived at the same time.",
      "The apron was white and clean.",
    ],
    answer: "It created dishes no human had ever tasted before.",
  },
  {
    opener: "High on the mountain, a small door appeared out of nowhere.",
    options: [
      "Inside was a library containing every story ever told.",
      "It was painted green.",
      "The mountain was very cold and snowy.",
      "No one was near the mountain that day.",
    ],
    answer: "Inside was a library containing every story ever told.",
  },
  {
    opener:
      "The submarine hit something soft and the crew gathered around the window.",
    options: [
      "Outside, a giant friendly whale was smiling at them.",
      "The captain went back to sleep.",
      "They decided to surface immediately.",
      "The water was very dark and cold.",
    ],
    answer: "Outside, a giant friendly whale was smiling at them.",
  },
  {
    opener:
      "On the day of the school talent show, something went completely wrong.",
    options: [
      "The stage curtains rose to reveal a magical forest that had grown overnight.",
      "Everyone sat in their chairs quietly.",
      "The teacher cancelled the show.",
      "The students practised their acts one more time.",
    ],
    answer:
      "The stage curtains rose to reveal a magical forest that had grown overnight.",
  },
  {
    opener:
      "The grandfather clock struck midnight and all the toys came alive.",
    options: [
      "They quickly organized a secret adventure while the children slept.",
      "Everything became very quiet.",
      "The children woke up and came downstairs.",
      "The clock was very old and made of wood.",
    ],
    answer:
      "They quickly organized a secret adventure while the children slept.",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

export default function StoryStarter({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [prompts] = useState<Prompt[]>(() =>
    [...PROMPTS].sort(() => Math.random() - 0.5),
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const { triggerShake, triggerParticle, triggerCombo, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(buildResult(config, score, correct / prompts.length, 120, true));
  }, [config, score, correct, prompts.length, onGameEnd]);

  const { timeLeft, start, reset } = useGameTimer(120, handleExpire);

  const startGame = () => {
    reset();
    setIndex(0);
    setScore(0);
    setLives(3);
    setCorrect(0);
    setSelected(null);
    setFeedback(null);
    setPhase("playing");
    start();
  };

  const handleSelect = (opt: string) => {
    if (feedback) return;
    setSelected(opt);
    const p = prompts[index];
    if (opt === p.answer) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      setFeedback("correct");
      triggerParticle(200, 200, "correct");
      triggerCombo(1);
      triggerMascotReaction("correct");
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        if (index + 1 >= prompts.length) {
          setPhase("over");
          onGameEnd(
            buildResult(config, ns, nc / prompts.length, 120 - timeLeft, true),
          );
        } else {
          setIndex((i) => i + 1);
        }
      }, 900);
    } else {
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      triggerShake();
      triggerMascotReaction("wrong");
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        if (nl <= 0) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              correct / prompts.length,
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
            Story Starter
          </h2>
          <p className="text-white/70 mb-2">
            Read the story opening and choose the continuation that best fits
            the tone and logic.
          </p>
          <p className="text-white/50 text-sm mb-6">
            10 openers / 3 lives / 120 seconds
          </p>
          <GlowButton data-ocid="ss.start_button" onClick={startGame}>
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
            Correct: {correct} / {prompts.length}
          </p>
          <GlowButton data-ocid="ss.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const p = prompts[index];

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          {index + 1}/{prompts.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 20 ? "text-[#f43f5e]" : "text-[#10b981]"}`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="rounded-2xl border border-[#00f5ff]/20 bg-[#00f5ff]/5 backdrop-blur-md p-6">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
          Story Opening
        </p>
        <p className="text-white text-lg font-medium italic leading-relaxed">
          "{p.opener}"
        </p>
      </div>

      <p className="text-white/50 text-xs uppercase tracking-widest text-center">
        What happens next?
      </p>

      <div className="flex flex-col gap-3">
        {p.options.map((opt, i) => {
          let cls =
            "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-white/80 text-sm cursor-pointer transition-all duration-200 hover:border-[#00f5ff]/40 hover:bg-white/10 text-left";
          if (selected === opt && feedback === "correct")
            cls += " !border-[#10b981] !bg-[#10b981]/15 !text-[#10b981]";
          if (selected === opt && feedback === "wrong")
            cls += " !border-[#f43f5e] !bg-[#f43f5e]/15 !text-[#f43f5e]";
          return (
            <button
              type="button"
              key={i}
              data-ocid={`ss.option.${i + 1}`}
              className={cls}
              onClick={() => handleSelect(opt)}
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
