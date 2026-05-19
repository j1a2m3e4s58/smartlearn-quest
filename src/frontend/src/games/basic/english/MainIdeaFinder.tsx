import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Passage {
  paragraph: string;
  options: string[];
  answer: string;
}

const PASSAGES: Passage[] = [
  {
    paragraph:
      "Dogs make wonderful pets. They are loyal, friendly, and love to play. Many dogs are trained to help people with disabilities. Some dogs even work with police and rescue teams.",
    options: [
      "Dogs come in many sizes",
      "Dogs are helpful and loyal animals",
      "Dogs need a lot of food",
      "Some dogs are police dogs",
    ],
    answer: "Dogs are helpful and loyal animals",
  },
  {
    paragraph:
      "The sun is a star at the center of our solar system. It provides light and heat to all the planets. Without the sun, life on Earth would be impossible. The sun has been shining for about 4.6 billion years.",
    options: [
      "The sun is very old",
      "The sun provides light sometimes",
      "The sun is essential for life on Earth",
      "There are no other stars",
    ],
    answer: "The sun is essential for life on Earth",
  },
  {
    paragraph:
      "Exercise is important for staying healthy. It strengthens your muscles and bones. Regular exercise also helps your heart and improves your mood. Doctors recommend at least 30 minutes of exercise each day.",
    options: [
      "Exercise is only for athletes",
      "Exercise makes you tired",
      "Regular exercise improves health and mood",
      "Doctors do not like exercise",
    ],
    answer: "Regular exercise improves health and mood",
  },
  {
    paragraph:
      "Rainforests are home to more than half of the world plant and animal species. They produce oxygen and help regulate the Earth climate. Sadly, rainforests are being destroyed at an alarming rate due to farming and logging.",
    options: [
      "Rainforests have many trees",
      "Rainforests are only found in Africa",
      "Rainforests are vital ecosystems under serious threat",
      "Animals live in rainforests",
    ],
    answer: "Rainforests are vital ecosystems under serious threat",
  },
  {
    paragraph:
      "Water is one of the most important substances on Earth. All living things need water to survive. The human body is about 60 percent water. Without water, a person can only survive for a few days.",
    options: [
      "Water is blue in color",
      "Water is essential for all living things",
      "The ocean is made of water",
      "People drink water every day",
    ],
    answer: "Water is essential for all living things",
  },
  {
    paragraph:
      "Books open doors to new worlds and ideas. Reading improves vocabulary and strengthens the imagination. Students who read regularly tend to perform better in school. Libraries provide free access to thousands of books.",
    options: [
      "Books are made of paper",
      "Reading has many educational benefits",
      "Libraries are quiet places",
      "Some students do not like reading",
    ],
    answer: "Reading has many educational benefits",
  },
  {
    paragraph:
      "The Internet has transformed how people communicate and access information. It connects billions of people across the world. People use it for education, business, entertainment, and staying in touch with family.",
    options: [
      "The Internet is sometimes slow",
      "The Internet changed communication and information access",
      "People use phones to access the Internet",
      "The Internet was invented recently",
    ],
    answer: "The Internet changed communication and information access",
  },
  {
    paragraph:
      "Bees are essential pollinators in our ecosystem. As they collect nectar, they transfer pollen between flowers, helping plants reproduce. Without bees, many crops that humans depend on would fail. Protecting bees protects our food supply.",
    options: [
      "Bees make honey",
      "Bees can sting people",
      "Bees are critical to plant reproduction and food production",
      "Flowers need water to grow",
    ],
    answer: "Bees are critical to plant reproduction and food production",
  },
  {
    paragraph:
      "Recycling helps protect the environment by reducing waste. Materials like paper, glass, and plastic can be processed and used again. Recycling saves energy and reduces pollution. Many countries have made recycling a national priority.",
    options: [
      "Plastic bottles can be recycled",
      "Recycling reduces waste and protects the environment",
      "Some countries do not recycle",
      "Recycling takes a long time",
    ],
    answer: "Recycling reduces waste and protects the environment",
  },
  {
    paragraph:
      "Music has a powerful effect on the human brain. It can improve concentration, reduce stress, and lift moods. Studies show that children who learn music tend to develop stronger language skills. Music therapy is even used in hospitals to help patients recover.",
    options: [
      "Music is played with instruments",
      "Music has wide-ranging benefits for the brain and body",
      "Some people do not like music",
      "Hospitals are quiet places",
    ],
    answer: "Music has wide-ranging benefits for the brain and body",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

export default function MainIdeaFinder({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [passages] = useState<Passage[]>(() =>
    [...PASSAGES].sort(() => Math.random() - 0.5),
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(buildResult(config, score, correct / passages.length, 120, true));
  }, [config, score, correct, passages.length, onGameEnd]);

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
    const p = passages[index];
    if (opt === p.answer) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      setFeedback("correct");
      triggerParticle(200, 200, "correct");
      triggerMascotReaction("correct");
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        if (index + 1 >= passages.length) {
          setPhase("over");
          onGameEnd(
            buildResult(config, ns, nc / passages.length, 120 - timeLeft, true),
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
              correct / passages.length,
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
            Main Idea Finder
          </h2>
          <p className="text-white/70 mb-2">
            Read each paragraph and select the sentence that best captures the
            main idea.
          </p>
          <p className="text-white/50 text-sm mb-6">
            10 passages · 3 lives · 120 seconds
          </p>
          <GlowButton data-ocid="mif.start_button" onClick={startGame}>
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
            Correct: {correct} / {passages.length}
          </p>
          <GlowButton data-ocid="mif.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const p = passages[index];

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          Passage {index + 1}/{passages.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 20 ? "text-[#f43f5e]" : "text-[#10b981]"}`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <p className="text-white/90 leading-relaxed text-base">{p.paragraph}</p>
      </div>

      <p className="text-white/50 text-sm uppercase tracking-widest text-center">
        What is the main idea?
      </p>

      <div className="flex flex-col gap-3">
        {p.options.map((opt, i) => {
          let cls =
            "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-white text-sm cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-[#00f5ff]/30 text-left";
          if (selected === opt && feedback === "correct")
            cls += " !border-[#10b981] !bg-[#10b981]/15 !text-[#10b981]";
          if (selected === opt && feedback === "wrong")
            cls += " !border-[#f43f5e] !bg-[#f43f5e]/15 !text-[#f43f5e]";
          return (
            <button
              type="button"
              key={i}
              data-ocid={`mif.option.${i + 1}`}
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
