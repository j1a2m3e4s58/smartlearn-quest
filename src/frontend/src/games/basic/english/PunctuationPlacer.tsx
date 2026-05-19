import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

const PUNCTS = ["", ",", ".", "?", "!", "'"];
const PUNCT_LABELS: Record<string, string> = {
  "": "_",
  ",": ",",
  ".": ".",
  "?": "?",
  "!": "!",
  "'": "'",
};

const SENTENCES = [
  {
    text: "The boy ran fast and he fell down",
    answer: "The boy ran fast, and he fell down.",
  },
  {
    text: "Are you going to school today",
    answer: "Are you going to school today?",
  },
  { text: "Wow that was amazing", answer: "Wow, that was amazing!" },
  {
    text: "She has a cat a dog and a fish",
    answer: "She has a cat, a dog, and a fish.",
  },
  { text: "Where did you put my book", answer: "Where did you put my book?" },
  {
    text: "Please come in and sit down",
    answer: "Please come in, and sit down.",
  },
  {
    text: "He shouted help the house is on fire",
    answer: "He shouted, 'Help, the house is on fire!'",
  },
  {
    text: "Can you help me with this problem",
    answer: "Can you help me with this problem?",
  },
  {
    text: "She bought apples oranges and bananas",
    answer: "She bought apples, oranges, and bananas.",
  },
  { text: "Run the dog is chasing us", answer: "Run, the dog is chasing us!" },
];

interface GapState {
  [key: string]: string;
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

function buildGaps(text: string): { segments: string[]; gapCount: number } {
  const words = text.split(" ");
  return { segments: words, gapCount: words.length };
}

export default function PunctuationPlacer({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];
  const totalQ = diff === "easy" ? 5 : diff === "medium" ? 7 : 10;

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gaps, setGaps] = useState<GapState>({});
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);

  const { timeLeft } = useGameTimer(120, () => endGame(score, completed));

  function loadQuestion(qIdx: number) {
    const sent = SENTENCES[qIdx % SENTENCES.length];
    const { gapCount } = buildGaps(sent.text);
    const init: GapState = {};
    for (let i = 0; i < gapCount; i++) init[String(i)] = "";
    setGaps(init);
    setFeedback(null);
  }

  function startGame() {
    setPhase("playing");
    setIdx(0);
    setScore(0);
    setLives(3);
    setCompleted(0);
    loadQuestion(0);
  }

  function endGame(fs: number, fc: number) {
    setPhase("over");
    const accuracy = fc > 0 ? Math.round((fc / totalQ) * 100) : 0;
    onGameEnd(buildResult(config, fs, accuracy, 120 - timeLeft, fc > 0));
  }

  function cycleGap(key: string) {
    setGaps((prev) => {
      const cur = prev[key] ?? "";
      const curIdx = PUNCTS.indexOf(cur);
      const next = PUNCTS[(curIdx + 1) % PUNCTS.length];
      return { ...prev, [key]: next };
    });
  }

  function buildPlayerAnswer(): string {
    const sent = SENTENCES[idx % SENTENCES.length];
    const words = sent.text.split(" ");
    return words.map((w, i) => w + (gaps[String(i)] ?? "")).join(" ");
  }

  const useCallback_submit = useCallback(() => {
    const sent = SENTENCES[idx % SENTENCES.length];
    const playerAnswer = buildPlayerAnswer();
    if (playerAnswer.trim() === sent.answer.trim()) {
      triggerCombo(score + 15);
      const ns = score + 15;
      const nc = completed + 1;
      setScore(ns);
      setCompleted(nc);
      setFeedback("correct");
      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= totalQ) endGame(ns, nc);
        else {
          setIdx(nextIdx);
          loadQuestion(nextIdx);
        }
      }, 800);
    } else {
      triggerShake();
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      setTimeout(() => {
        if (nl <= 0) endGame(score, completed);
        else loadQuestion(idx);
      }, 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, gaps, score, lives, completed, totalQ]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff] tracking-wide">
          Punctuation Placer
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Click after each word to cycle through punctuation marks and place
          them correctly. Build the properly punctuated sentence.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>Questions: {totalQ} | Lives: 3 | Timer: 120s</div>
          <div>Correct = +15 points</div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="punctuation-placer.start_button"
        >
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
            Completed: {completed}/{totalQ}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="punctuation-placer.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  const sent = SENTENCES[idx % SENTENCES.length];
  const words = sent.text.split(" ");

  return (
    <div className="flex flex-col gap-4 p-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Q {idx + 1}/{totalQ}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-sm">Time: {timeLeft}s</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
      </div>

      {feedback === "correct" && (
        <div className="text-center text-[#10b981] font-bold animate-pulse">
          Correct! +15
        </div>
      )}
      {feedback === "wrong" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          Not quite! Answer:{" "}
          <span className="text-muted-foreground">{sent.answer}</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <p className="text-xs text-muted-foreground mb-4">
          Click the punctuation slot after each word to cycle options:
        </p>
        <div
          className="flex flex-wrap gap-1 items-center"
          data-ocid="punctuation-placer.sentence_area"
        >
          {words.map((word, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-foreground font-medium">{word}</span>
              <button
                type="button"
                onClick={() => cycleGap(String(i))}
                className={`ml-0.5 w-7 h-7 rounded text-sm font-bold border transition-all ${
                  gaps[String(i)]
                    ? "border-[#f59e0b]/60 bg-[#f59e0b]/20 text-[#f59e0b]"
                    : "border-white/20 bg-white/5 text-muted-foreground hover:border-white/40"
                }`}
                data-ocid={`punctuation-placer.gap.${i}`}
              >
                {PUNCT_LABELS[gaps[String(i)] ?? ""]}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Your sentence:{" "}
        <span className="text-foreground">{buildPlayerAnswer()}</span>
      </div>

      <div className="flex justify-center">
        <GlowButton
          onClick={useCallback_submit}
          data-ocid="punctuation-placer.submit_button"
        >
          Submit Answer
        </GlowButton>
      </div>
    </div>
  );
}
