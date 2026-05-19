import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

const EASY_WORDS = [
  {
    word: "Happy",
    definition: "Feeling pleased or joyful",
    distractors: ["Feeling sad", "Feeling tired", "Feeling angry"],
  },
  {
    word: "Big",
    definition: "Large in size",
    distractors: ["Small in size", "Fast in speed", "Quiet in noise"],
  },
  {
    word: "Fast",
    definition: "Moving quickly",
    distractors: ["Moving slowly", "Standing still", "Moving sideways"],
  },
  {
    word: "Cold",
    definition: "Having a low temperature",
    distractors: ["Having high heat", "Being very soft", "Moving quickly"],
  },
  {
    word: "Brave",
    definition: "Ready to face danger without fear",
    distractors: ["Afraid of everything", "Very slow", "Always sleeping"],
  },
  {
    word: "Bright",
    definition: "Giving out a strong light",
    distractors: ["Very dark", "Completely quiet", "Very heavy"],
  },
  {
    word: "Quiet",
    definition: "Making little or no noise",
    distractors: ["Very loud", "Moving fast", "Brightly lit"],
  },
  {
    word: "Kind",
    definition: "Gentle and caring towards others",
    distractors: ["Rude to others", "Very tall", "Extremely loud"],
  },
  {
    word: "Strong",
    definition: "Having great physical power",
    distractors: ["Very weak", "Extremely thin", "Slowly moving"],
  },
  {
    word: "Clean",
    definition: "Free from dirt or impurity",
    distractors: ["Covered in mud", "Very noisy", "Extremely dark"],
  },
  {
    word: "Old",
    definition: "Having lived for many years",
    distractors: ["Recently born", "Very fast", "Extremely loud"],
  },
  {
    word: "New",
    definition: "Recently made or acquired",
    distractors: ["Very old", "Broken apart", "Very slow"],
  },
  {
    word: "Wet",
    definition: "Covered with liquid",
    distractors: ["Completely dry", "Very hard", "Brightly colored"],
  },
  {
    word: "Soft",
    definition: "Easy to press or shape",
    distractors: ["Very hard", "Extremely cold", "Very noisy"],
  },
  {
    word: "Round",
    definition: "Having a circular shape",
    distractors: ["Having sharp corners", "Completely flat", "Very tall"],
  },
  {
    word: "Long",
    definition: "Measuring a great distance",
    distractors: ["Very short", "Extremely wide", "Very heavy"],
  },
  {
    word: "Deep",
    definition: "Extending far down from the surface",
    distractors: ["Very shallow", "Extremely wide", "Very tall"],
  },
  {
    word: "Light",
    definition: "Not heavy; easy to lift",
    distractors: ["Very heavy", "Completely dark", "Very slow"],
  },
  {
    word: "Sharp",
    definition: "Having a thin cutting edge",
    distractors: ["Very blunt", "Extremely soft", "Very wide"],
  },
  {
    word: "Full",
    definition: "Containing as much as possible",
    distractors: ["Completely empty", "Very light", "Extremely small"],
  },
];

const MEDIUM_WORDS = [
  {
    word: "Generous",
    definition: "Willing to give more than expected",
    distractors: ["Unwilling to share", "Very aggressive", "Extremely lazy"],
  },
  {
    word: "Ancient",
    definition: "Belonging to a very old time period",
    distractors: ["Very modern", "Brand new", "Extremely fast"],
  },
  {
    word: "Fragile",
    definition: "Easily broken or damaged",
    distractors: ["Extremely strong", "Very flexible", "Completely solid"],
  },
  {
    word: "Curious",
    definition: "Eager to know or learn",
    distractors: ["Having no interest", "Very bored", "Completely silent"],
  },
  {
    word: "Sincere",
    definition: "Genuinely honest and truthful",
    distractors: ["Very dishonest", "Extremely proud", "Very cold"],
  },
  {
    word: "Gloomy",
    definition: "Dark and depressing",
    distractors: ["Very bright", "Extremely cheerful", "Very fast"],
  },
  {
    word: "Hostile",
    definition: "Unfriendly and aggressive",
    distractors: ["Very welcoming", "Extremely kind", "Very quiet"],
  },
  {
    word: "Abundant",
    definition: "Existing in large quantities",
    distractors: ["Very scarce", "Completely empty", "Very thin"],
  },
  {
    word: "Cautious",
    definition: "Careful to avoid danger",
    distractors: ["Extremely reckless", "Very fast", "Completely loud"],
  },
  {
    word: "Flexible",
    definition: "Able to bend easily without breaking",
    distractors: ["Very rigid", "Extremely heavy", "Very loud"],
  },
  {
    word: "Modest",
    definition: "Having a humble view of oneself",
    distractors: ["Very arrogant", "Extremely loud", "Very fast"],
  },
  {
    word: "Patient",
    definition: "Able to wait calmly without complaining",
    distractors: ["Very impatient", "Extremely fast", "Very cold"],
  },
  {
    word: "Distant",
    definition: "Far away in space or time",
    distractors: ["Very nearby", "Extremely loud", "Very warm"],
  },
  {
    word: "Elegant",
    definition: "Graceful and stylish in appearance",
    distractors: ["Very clumsy", "Extremely rough", "Very noisy"],
  },
  {
    word: "Fierce",
    definition: "Showing strong aggression or intensity",
    distractors: ["Very gentle", "Extremely quiet", "Very slow"],
  },
  {
    word: "Humble",
    definition: "Not proud or arrogant",
    distractors: ["Very boastful", "Extremely loud", "Very cold"],
  },
  {
    word: "Loyal",
    definition: "Faithful to someone or something",
    distractors: ["Very disloyal", "Extremely cold", "Very fast"],
  },
  {
    word: "Scarce",
    definition: "Insufficient in supply",
    distractors: ["Very plentiful", "Extremely loud", "Very bright"],
  },
  {
    word: "Timid",
    definition: "Showing a lack of courage",
    distractors: ["Very bold", "Extremely fast", "Very loud"],
  },
  {
    word: "Vague",
    definition: "Not clearly expressed or defined",
    distractors: ["Very precise", "Extremely loud", "Very cold"],
  },
];

const HARD_WORDS = [
  {
    word: "Ephemeral",
    definition: "Lasting for only a very short time",
    distractors: ["Lasting forever", "Extremely loud", "Very strong"],
  },
  {
    word: "Verbose",
    definition: "Using more words than needed",
    distractors: ["Very brief", "Extremely quiet", "Very fast"],
  },
  {
    word: "Intrepid",
    definition: "Fearless and adventurous",
    distractors: ["Very timid", "Extremely cautious", "Very slow"],
  },
  {
    word: "Melancholy",
    definition: "A feeling of pensive sadness",
    distractors: ["Great happiness", "Extreme anger", "Complete boredom"],
  },
  {
    word: "Pragmatic",
    definition: "Dealing sensibly with practical matters",
    distractors: ["Very idealistic", "Extremely emotional", "Very impractical"],
  },
  {
    word: "Tenacious",
    definition: "Not giving up easily",
    distractors: ["Easily defeated", "Very lazy", "Extremely careless"],
  },
  {
    word: "Ambiguous",
    definition: "Open to more than one interpretation",
    distractors: ["Very clear", "Extremely precise", "Very obvious"],
  },
  {
    word: "Benevolent",
    definition: "Well meaning and kindly",
    distractors: ["Very cruel", "Extremely selfish", "Very cold"],
  },
  {
    word: "Cacophony",
    definition: "A harsh discordant mixture of sounds",
    distractors: ["Beautiful music", "Complete silence", "Soft whispers"],
  },
  {
    word: "Diligent",
    definition: "Having or showing careful and persistent effort",
    distractors: ["Very lazy", "Extremely careless", "Very slow"],
  },
  {
    word: "Eloquent",
    definition: "Fluent and persuasive in speaking",
    distractors: ["Unable to speak", "Very confused", "Extremely quiet"],
  },
  {
    word: "Fallacious",
    definition: "Based on a mistaken belief",
    distractors: ["Completely accurate", "Very logical", "Extremely true"],
  },
  {
    word: "Garrulous",
    definition: "Excessively talkative",
    distractors: ["Very quiet", "Extremely reserved", "Very shy"],
  },
  {
    word: "Hegemony",
    definition: "Leadership or dominance over others",
    distractors: ["Complete equality", "Total defeat", "Extreme weakness"],
  },
  {
    word: "Idiosyncrasy",
    definition: "A distinctive individual characteristic",
    distractors: ["Common trait", "Universal behavior", "Shared habit"],
  },
  {
    word: "Juxtapose",
    definition: "Place two things side by side for contrast",
    distractors: ["Remove completely", "Hide separately", "Combine into one"],
  },
  {
    word: "Labyrinthine",
    definition: "Complicated and difficult to navigate",
    distractors: ["Very simple", "Completely straight", "Extremely clear"],
  },
  {
    word: "Magnanimous",
    definition: "Generous and forgiving",
    distractors: ["Very petty", "Extremely vengeful", "Very selfish"],
  },
  {
    word: "Nefarious",
    definition: "Wicked and criminal",
    distractors: ["Completely honest", "Very virtuous", "Extremely kind"],
  },
  {
    word: "Obfuscate",
    definition: "To make unclear or confusing",
    distractors: [
      "To clarify completely",
      "To simplify greatly",
      "To make visible",
    ],
  },
];

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface WordDef {
  word: string;
  definition: string;
  distractors: string[];
}

export default function WordDefinitionMatch({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];

  const pool =
    diff === "easy"
      ? EASY_WORDS
      : diff === "medium"
        ? MEDIUM_WORDS
        : HARD_WORDS;
  const totalQ = 15;

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [questions, setQuestions] = useState<
    { item: WordDef; options: string[] }[]
  >([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);

  const { timeLeft } = useGameTimer(120, () => endGame(score, completed));

  function startGame() {
    const picked = shuffleArr(pool).slice(0, totalQ);
    const qs = picked.map((item) => ({
      item,
      options: shuffleArr([item.definition, ...item.distractors]),
    }));
    setQuestions(qs);
    setPhase("playing");
    setIdx(0);
    setScore(0);
    setLives(3);
    setCompleted(0);
    setSelected(null);
    setFeedback(null);
  }

  function endGame(fs: number, fc: number) {
    setPhase("over");
    const accuracy = fc > 0 ? Math.round((fc / totalQ) * 100) : 0;
    onGameEnd(buildResult(config, fs, accuracy, 120 - timeLeft, fc > 0));
  }

  function pickOption(opt: string) {
    if (feedback || !questions[idx]) return;
    setSelected(opt);
    const correct = questions[idx].item.definition;
    if (opt === correct) {
      triggerCombo(score + 10);
      const ns = score + 10;
      const nc = completed + 1;
      setScore(ns);
      setCompleted(nc);
      setFeedback("correct");
      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= totalQ) endGame(ns, nc);
        else {
          setIdx(nextIdx);
          setSelected(null);
          setFeedback(null);
        }
      }, 800);
    } else {
      triggerShake();
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      setTimeout(() => {
        if (nl <= 0) endGame(score, completed);
        else {
          setSelected(null);
          setFeedback(null);
        }
      }, 900);
    }
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff] tracking-wide">
          Word Definition Match
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Read the word and choose its correct definition from four options.
          Build your vocabulary!
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>
            Questions: {totalQ} | Lives: 3 | Timer: 120s | Difficulty: {diff}
          </div>
          <div>Correct = +10 points</div>
        </div>
        <GlowButton onClick={startGame} data-ocid="word-def-match.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff]">Game Over</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center space-y-2">
          <div className="text-4xl font-bold text-[#10b981]">{score}</div>
          <div className="text-muted-foreground">
            Matched: {completed}/{totalQ}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="word-def-match.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  const q = questions[idx];
  if (!q) return null;

  return (
    <div className="flex flex-col gap-5 p-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Word {idx + 1}/{totalQ}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-sm">Time: {timeLeft}s</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          What does this word mean?
        </p>
        <p className="text-3xl font-bold text-[#f59e0b] tracking-wide">
          {q.item.word}
        </p>
      </div>

      {feedback === "correct" && (
        <div className="text-center text-[#10b981] font-bold animate-pulse">
          Correct! +10
        </div>
      )}
      {feedback === "wrong" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          Wrong! It means: {q.item.definition}
        </div>
      )}

      <div
        className="grid grid-cols-1 gap-3"
        data-ocid="word-def-match.options"
      >
        {q.options.map((opt, i) => {
          let cls =
            "rounded-xl border p-4 text-left text-sm transition-all cursor-pointer ";
          if (feedback && opt === q.item.definition)
            cls += "border-[#10b981]/60 bg-[#10b981]/20 text-[#10b981]";
          else if (feedback && opt === selected && opt !== q.item.definition)
            cls += "border-[#f43f5e]/60 bg-[#f43f5e]/20 text-[#f43f5e]";
          else
            cls +=
              "border-white/10 bg-white/5 hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/10 text-foreground";
          return (
            <button
              type="button"
              key={i}
              className={cls}
              onClick={() => pickOption(opt)}
              data-ocid={`word-def-match.option.${i + 1}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
