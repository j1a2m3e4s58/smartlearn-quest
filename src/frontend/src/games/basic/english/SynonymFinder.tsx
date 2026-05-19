import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface SynonymItem {
  word: string;
  synonym: string;
  distractors: string[];
}

const EASY: SynonymItem[] = [
  { word: "Happy", synonym: "Glad", distractors: ["Sad", "Angry", "Tired"] },
  { word: "Big", synonym: "Large", distractors: ["Small", "Fast", "Quiet"] },
  { word: "Smart", synonym: "Clever", distractors: ["Slow", "Weak", "Loud"] },
  { word: "Fast", synonym: "Quick", distractors: ["Slow", "Heavy", "Soft"] },
  { word: "Cold", synonym: "Chilly", distractors: ["Hot", "Warm", "Mild"] },
  {
    word: "Sad",
    synonym: "Unhappy",
    distractors: ["Joyful", "Excited", "Cheerful"],
  },
  { word: "Old", synonym: "Aged", distractors: ["Young", "New", "Fresh"] },
  { word: "Begin", synonym: "Start", distractors: ["Stop", "Finish", "End"] },
  { word: "Small", synonym: "Tiny", distractors: ["Big", "Huge", "Giant"] },
  { word: "Loud", synonym: "Noisy", distractors: ["Quiet", "Silent", "Soft"] },
];

const MEDIUM: SynonymItem[] = [
  {
    word: "Brave",
    synonym: "Courageous",
    distractors: ["Fearful", "Timid", "Weak"],
  },
  {
    word: "Begin",
    synonym: "Commence",
    distractors: ["Stop", "Finish", "End"],
  },
  {
    word: "Angry",
    synonym: "Furious",
    distractors: ["Calm", "Happy", "Pleased"],
  },
  {
    word: "Tired",
    synonym: "Weary",
    distractors: ["Energetic", "Alert", "Lively"],
  },
  {
    word: "Unusual",
    synonym: "Peculiar",
    distractors: ["Normal", "Common", "Regular"],
  },
  {
    word: "Gather",
    synonym: "Assemble",
    distractors: ["Scatter", "Separate", "Divide"],
  },
  {
    word: "Wealthy",
    synonym: "Affluent",
    distractors: ["Poor", "Broke", "Needy"],
  },
  {
    word: "Help",
    synonym: "Assist",
    distractors: ["Hinder", "Obstruct", "Block"],
  },
  {
    word: "Important",
    synonym: "Significant",
    distractors: ["Trivial", "Minor", "Unimportant"],
  },
  {
    word: "Beautiful",
    synonym: "Gorgeous",
    distractors: ["Ugly", "Plain", "Dull"],
  },
];

const HARD: SynonymItem[] = [
  {
    word: "Ephemeral",
    synonym: "Fleeting",
    distractors: ["Permanent", "Lasting", "Eternal"],
  },
  {
    word: "Verbose",
    synonym: "Loquacious",
    distractors: ["Silent", "Quiet", "Brief"],
  },
  {
    word: "Intrepid",
    synonym: "Valiant",
    distractors: ["Cowardly", "Timid", "Fearful"],
  },
  {
    word: "Melancholy",
    synonym: "Despondent",
    distractors: ["Elated", "Cheerful", "Jubilant"],
  },
  {
    word: "Tenacious",
    synonym: "Dogged",
    distractors: ["Yielding", "Flexible", "Weak"],
  },
  {
    word: "Benevolent",
    synonym: "Magnanimous",
    distractors: ["Malevolent", "Cruel", "Selfish"],
  },
  {
    word: "Garrulous",
    synonym: "Voluble",
    distractors: ["Taciturn", "Reticent", "Laconic"],
  },
  {
    word: "Perfidious",
    synonym: "Treacherous",
    distractors: ["Loyal", "Faithful", "Steadfast"],
  },
  {
    word: "Obdurate",
    synonym: "Intransigent",
    distractors: ["Flexible", "Adaptable", "Pliant"],
  },
  {
    word: "Sagacious",
    synonym: "Perspicacious",
    distractors: ["Foolish", "Ignorant", "Obtuse"],
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

export default function SynonymFinder({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];
  const pool = diff === "easy" ? EASY : diff === "medium" ? MEDIUM : HARD;
  const totalQ = 15;

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [questions, setQuestions] = useState<
    { item: SynonymItem; options: string[] }[]
  >([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);

  const { timeLeft } = useGameTimer(120, () => endGame(score, completed));

  function startGame() {
    const items = shuffleArr([...pool, ...pool, ...pool]).slice(0, totalQ);
    const qs = items.map((item) => ({
      item,
      options: shuffleArr([item.synonym, ...item.distractors]),
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
    const correct = questions[idx].item.synonym;
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
          Synonym Finder
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Find the synonym of each word. A synonym is a word that means the same
          or nearly the same as another word.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>
            Questions: {totalQ} | Lives: 3 | Timer: 120s | Difficulty: {diff}
          </div>
          <div>Correct = +10 points</div>
        </div>
        <GlowButton onClick={startGame} data-ocid="synonym-finder.start_button">
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
            Found: {completed}/{totalQ}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="synonym-finder.restart_button"
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
          Q {idx + 1}/{totalQ}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-sm">Time: {timeLeft}s</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Find the synonym for:
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
          Wrong! Synonym: {q.item.synonym}
        </div>
      )}

      <div
        className="grid grid-cols-2 gap-3"
        data-ocid="synonym-finder.options"
      >
        {q.options.map((opt, i) => {
          let cls =
            "rounded-xl border p-4 text-center font-medium text-sm transition-all cursor-pointer ";
          if (feedback && opt === q.item.synonym)
            cls += "border-[#10b981]/60 bg-[#10b981]/20 text-[#10b981]";
          else if (feedback && opt === selected && opt !== q.item.synonym)
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
              data-ocid={`synonym-finder.option.${i + 1}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
