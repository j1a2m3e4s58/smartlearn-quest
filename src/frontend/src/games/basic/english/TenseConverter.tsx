import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

const TENSE_Q = [
  {
    present: "She eats rice.",
    options: [
      "She ate rice.",
      "She eat rice.",
      "She has rice.",
      "She eats rice.",
    ],
    answer: "She ate rice.",
  },
  {
    present: "They play football.",
    options: [
      "They played football.",
      "They plays football.",
      "They have football.",
      "They are football.",
    ],
    answer: "They played football.",
  },
  {
    present: "He runs fast.",
    options: [
      "He ran fast.",
      "He runned fast.",
      "He run fast.",
      "He has run fast.",
    ],
    answer: "He ran fast.",
  },
  {
    present: "We go to school.",
    options: [
      "We went to school.",
      "We goed to school.",
      "We gone to school.",
      "We going to school.",
    ],
    answer: "We went to school.",
  },
  {
    present: "I see a bird.",
    options: [
      "I saw a bird.",
      "I sawed a bird.",
      "I seen a bird.",
      "I did see a bird.",
    ],
    answer: "I saw a bird.",
  },
  {
    present: "The dog barks loudly.",
    options: [
      "The dog barked loudly.",
      "The dog barkted loudly.",
      "The dog has bark loudly.",
      "The dog barks loudly.",
    ],
    answer: "The dog barked loudly.",
  },
  {
    present: "She writes a letter.",
    options: [
      "She wrote a letter.",
      "She writed a letter.",
      "She has write a letter.",
      "She written a letter.",
    ],
    answer: "She wrote a letter.",
  },
  {
    present: "They sing a song.",
    options: [
      "They sang a song.",
      "They singed a song.",
      "They has sing a song.",
      "They singed a song.",
    ],
    answer: "They sang a song.",
  },
  {
    present: "He drives to work.",
    options: [
      "He drove to work.",
      "He drived to work.",
      "He driven to work.",
      "He has drive to work.",
    ],
    answer: "He drove to work.",
  },
  {
    present: "I drink water daily.",
    options: [
      "I drank water daily.",
      "I drinked water daily.",
      "I drunk water daily.",
      "I has drink water daily.",
    ],
    answer: "I drank water daily.",
  },
  {
    present: "We swim in the river.",
    options: [
      "We swam in the river.",
      "We swimmed in the river.",
      "We has swim in the river.",
      "We swum in the river.",
    ],
    answer: "We swam in the river.",
  },
  {
    present: "She buys new clothes.",
    options: [
      "She bought new clothes.",
      "She buyed new clothes.",
      "She has buy new clothes.",
      "She has bought new clothes.",
    ],
    answer: "She bought new clothes.",
  },
  {
    present: "They teach English.",
    options: [
      "They taught English.",
      "They teached English.",
      "They has teach English.",
      "They thought English.",
    ],
    answer: "They taught English.",
  },
  {
    present: "He brings food home.",
    options: [
      "He brought food home.",
      "He bringed food home.",
      "He brung food home.",
      "He has bring food home.",
    ],
    answer: "He brought food home.",
  },
  {
    present: "I know the answer.",
    options: [
      "I knew the answer.",
      "I knowed the answer.",
      "I known the answer.",
      "I has know the answer.",
    ],
    answer: "I knew the answer.",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function TenseConverter({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];
  const totalQ = diff === "easy" ? 8 : diff === "medium" ? 12 : 15;

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  function shuffleArr<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const { timeLeft } = useGameTimer(120, () => endGame(score, completed));

  function startGame() {
    setPhase("playing");
    setIdx(0);
    setScore(0);
    setLives(3);
    setCompleted(0);
    setSelected(null);
    setFeedback(null);
    setShuffledOptions(shuffleArr(TENSE_Q[0].options));
  }

  function endGame(fs: number, fc: number) {
    setPhase("over");
    const accuracy = fc > 0 ? Math.round((fc / totalQ) * 100) : 0;
    onGameEnd(buildResult(config, fs, accuracy, 120 - timeLeft, fc > 0));
  }

  function pickOption(opt: string) {
    if (feedback) return;
    setSelected(opt);
    const q = TENSE_Q[idx % TENSE_Q.length];
    if (opt === q.answer) {
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
          setShuffledOptions(
            shuffleArr(TENSE_Q[nextIdx % TENSE_Q.length].options),
          );
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
          Tense Converter
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Convert present tense sentences to the correct past tense form. Choose
          the right answer from four options.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>Questions: {totalQ} | Lives: 3 | Timer: 120s</div>
          <div>Correct = +10 points</div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="tense-converter.start_button"
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
            Converted: {completed}/{totalQ}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="tense-converter.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  const q = TENSE_Q[idx % TENSE_Q.length];

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

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <p className="text-xs text-muted-foreground mb-2">
          Convert to past tense:
        </p>
        <p className="text-xl font-semibold text-foreground">{q.present}</p>
      </div>

      {feedback === "correct" && (
        <div className="text-center text-[#10b981] font-bold animate-pulse">
          Correct! +10
        </div>
      )}
      {feedback === "wrong" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          Wrong! Correct: {q.answer}
        </div>
      )}

      <div
        className="grid grid-cols-1 gap-3"
        data-ocid="tense-converter.options"
      >
        {shuffledOptions.map((opt, i) => {
          let cls =
            "rounded-xl border p-4 text-left font-medium transition-all cursor-pointer ";
          if (feedback && opt === q.answer)
            cls += "border-[#10b981]/60 bg-[#10b981]/20 text-[#10b981]";
          else if (feedback && opt === selected && opt !== q.answer)
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
              data-ocid={`tense-converter.option.${i + 1}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
