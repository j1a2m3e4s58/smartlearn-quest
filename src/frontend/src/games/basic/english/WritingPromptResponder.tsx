import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface PromptData {
  title: string;
  categories: {
    name: string;
    tiles: string[];
  }[];
}

const PROMPTS: PromptData[] = [
  {
    title: "Describe your favorite season",
    categories: [
      {
        name: "Who",
        tiles: [
          "I enjoy it alone",
          "My family and I",
          "My friends and I",
          "The whole community",
        ],
      },
      {
        name: "What",
        tiles: [
          "Playing outdoors",
          "Reading by the fire",
          "Swimming at the beach",
          "Watching the rain",
        ],
      },
      {
        name: "Where",
        tiles: ["At home", "In the park", "At the beach", "In the mountains"],
      },
      {
        name: "When",
        tiles: [
          "Every year",
          "During school holidays",
          "On weekends",
          "In the mornings",
        ],
      },
      {
        name: "Why",
        tiles: [
          "The weather is perfect",
          "School is out",
          "Nature looks beautiful",
          "Special foods are available",
        ],
      },
    ],
  },
  {
    title: "Write about a time you helped someone",
    categories: [
      {
        name: "Who",
        tiles: [
          "A classmate",
          "A family member",
          "A stranger",
          "A younger child",
        ],
      },
      {
        name: "What",
        tiles: [
          "Carried their bags",
          "Helped with homework",
          "Shared food",
          "Gave directions",
        ],
      },
      {
        name: "Where",
        tiles: ["At school", "On the street", "At home", "In the market"],
      },
      {
        name: "When",
        tiles: [
          "After school",
          "On a rainy day",
          "During break time",
          "Early in the morning",
        ],
      },
      {
        name: "Why",
        tiles: [
          "They were struggling",
          "It felt the right thing to do",
          "They asked for help",
          "I wanted to be kind",
        ],
      },
    ],
  },
  {
    title: "Describe your dream house",
    categories: [
      {
        name: "Who",
        tiles: [
          "Just me",
          "My family",
          "Friends and family",
          "A big community",
        ],
      },
      {
        name: "What",
        tiles: ["Swimming pool", "Library room", "Game room", "Rooftop garden"],
      },
      {
        name: "Where",
        tiles: [
          "By the ocean",
          "In a forest",
          "On a hilltop",
          "In a busy city",
        ],
      },
      {
        name: "When",
        tiles: [
          "When I grow up",
          "After finishing school",
          "After earning money",
          "Someday in the future",
        ],
      },
      {
        name: "Why",
        tiles: [
          "For comfort and peace",
          "To share with loved ones",
          "To have space to create",
          "To feel proud and secure",
        ],
      },
    ],
  },
  {
    title: "Tell about your favorite animal",
    categories: [
      {
        name: "Who",
        tiles: [
          "I observe it alone",
          "Scientists study it",
          "Farmers raise it",
          "Zoos protect it",
        ],
      },
      {
        name: "What",
        tiles: [
          "It is very fast",
          "It has beautiful colors",
          "It is very intelligent",
          "It is strong and brave",
        ],
      },
      {
        name: "Where",
        tiles: [
          "In the wild",
          "On a farm",
          "In the ocean",
          "In tropical forests",
        ],
      },
      {
        name: "When",
        tiles: [
          "Active at night",
          "Active during the day",
          "Seasonal migrant",
          "Year-round resident",
        ],
      },
      {
        name: "Why",
        tiles: [
          "It inspires me",
          "It is important to nature",
          "It is beautiful to watch",
          "It has helped humans",
        ],
      },
    ],
  },
  {
    title: "Write about a special day",
    categories: [
      {
        name: "Who",
        tiles: ["My family", "My friends", "My class", "The whole school"],
      },
      {
        name: "What",
        tiles: [
          "We celebrated together",
          "We went on a trip",
          "We received an award",
          "We played games all day",
        ],
      },
      {
        name: "Where",
        tiles: [
          "At school",
          "At a park",
          "At a relative's house",
          "At a community event",
        ],
      },
      {
        name: "When",
        tiles: [
          "On my birthday",
          "During a holiday",
          "At the end of term",
          "On a national celebration day",
        ],
      },
      {
        name: "Why",
        tiles: [
          "It was unforgettable",
          "I was recognized for hard work",
          "We were all together",
          "Something amazing happened",
        ],
      },
    ],
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

export default function WritingPromptResponder({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [prompts] = useState<PromptData[]>(() =>
    [...PROMPTS].sort(() => Math.random() - 0.5),
  );
  const [promptIdx, setPromptIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { triggerParticle, triggerCombo, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(
      buildResult(
        config,
        totalScore,
        totalScore / (prompts.length * 25),
        180,
        true,
      ),
    );
  }, [config, totalScore, prompts.length, onGameEnd]);

  const { timeLeft, start, reset } = useGameTimer(180, handleExpire);

  const startGame = () => {
    reset();
    setPromptIdx(0);
    setTotalScore(0);
    setLives(3);
    setSelections({});
    setSubmitted(false);
    setFeedback(null);
    setPhase("playing");
    start();
  };

  const toggleTile = (catName: string, tile: string) => {
    if (submitted) return;
    setSelections((prev) => {
      const current = prev[catName] ?? [];
      const exists = current.includes(tile);
      return {
        ...prev,
        [catName]: exists
          ? current.filter((t) => t !== tile)
          : [...current, tile],
      };
    });
  };

  const countFilledCategories = () => {
    const prompt = prompts[promptIdx];
    return prompt.categories.filter(
      (cat) => (selections[cat.name] ?? []).length > 0,
    ).length;
  };

  const handleSubmit = () => {
    if (submitted) return;
    const filled = countFilledCategories();
    if (filled < 4) {
      setFeedback("Please fill at least 4 categories before submitting.");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    const pts = filled >= 5 ? 25 : 15;
    const nts = totalScore + pts;
    setTotalScore(nts);
    setSubmitted(true);
    triggerParticle(200, 200, "correct");
    if (filled >= 5) triggerCombo(2);
    triggerMascotReaction("correct");
    setTimeout(() => {
      setSubmitted(false);
      setSelections({});
      setFeedback(null);
      if (promptIdx + 1 >= prompts.length) {
        setPhase("over");
        onGameEnd(
          buildResult(
            config,
            nts,
            nts / (prompts.length * 25),
            180 - timeLeft,
            true,
          ),
        );
      } else {
        setPromptIdx((p) => p + 1);
      }
    }, 1200);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
            Writing Prompt Responder
          </h2>
          <p className="text-white/70 mb-2">
            For each writing prompt, select detail tiles from at least 4 of the
            5 categories (Who, What, Where, When, Why).
          </p>
          <p className="text-white/50 text-sm mb-2">
            4 categories = +15 pts, all 5 = +25 pts
          </p>
          <p className="text-white/50 text-sm mb-6">
            5 prompts / 3 lives / 180 seconds
          </p>
          <GlowButton data-ocid="wpr.start_button" onClick={startGame}>
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
            Score:{" "}
            <span className="text-[#00f5ff] font-bold">{totalScore}</span>
          </p>
          <p className="text-white/50 mb-6">
            Max possible: {prompts.length * 25}
          </p>
          <GlowButton data-ocid="wpr.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const prompt = prompts[promptIdx];
  const filled = countFilledCategories();

  return (
    <div className="flex flex-col gap-5 p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          Prompt {promptIdx + 1}/{prompts.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {totalScore}</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 30 ? "text-[#f43f5e]" : "text-[#10b981]"}`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="rounded-2xl border border-[#00f5ff]/20 bg-[#00f5ff]/5 backdrop-blur-md p-5">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
          Writing Prompt
        </p>
        <p className="text-white text-xl font-bold">{prompt.title}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prompt.categories.map((cat) => {
          const sel = selections[cat.name] ?? [];
          const hasSel = sel.length > 0;
          return (
            <div
              key={cat.name}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                hasSel
                  ? "border-[#10b981]/40 bg-[#10b981]/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                    hasSel
                      ? "border-[#10b981] text-[#10b981] bg-[#10b981]/10"
                      : "border-white/20 text-white/40"
                  }`}
                >
                  {cat.name}
                </span>
                {hasSel && (
                  <span className="text-[#10b981] text-xs">
                    {sel.length} selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.tiles.map((tile, ti) => {
                  const isSelected = sel.includes(tile);
                  return (
                    <button
                      type="button"
                      key={ti}
                      data-ocid={`wpr.tile.${cat.name.toLowerCase()}.${ti + 1}`}
                      onClick={() => toggleTile(cat.name, tile)}
                      disabled={submitted}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/10 hover:text-white"
                      }`}
                    >
                      {tile}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className="rounded-xl border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 text-[#f59e0b] text-sm text-center">
          {feedback}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-white/50 text-sm">
          Categories filled:{" "}
          <span
            className={
              filled >= 4 ? "text-[#10b981] font-bold" : "text-white/70"
            }
          >
            {filled}/5
          </span>
          {filled >= 5 && (
            <span className="ml-2 text-[#f59e0b] text-xs font-bold">
              +25 pts bonus!
            </span>
          )}
          {filled === 4 && (
            <span className="ml-2 text-white/40 text-xs">+15 pts</span>
          )}
        </span>
        <GlowButton
          data-ocid="wpr.submit_button"
          onClick={handleSubmit}
          disabled={filled < 4 || submitted}
        >
          Submit Response
        </GlowButton>
      </div>
    </div>
  );
}
