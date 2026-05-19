import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

const SENTENCES = [
  "The cat sat on the mat",
  "She runs very fast",
  "We play football after school",
  "Birds fly in the sky",
  "He reads books every day",
  "The sun rises in the east",
  "Children love to play",
  "Water is good for health",
  "She likes to sing songs",
  "Books help us to learn",
];

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TileItem {
  id: number;
  word: string;
  used: boolean;
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function SentenceBuilder({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [answer, setAnswer] = useState<TileItem[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);

  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];

  const totalSentences = diff === "easy" ? 5 : diff === "medium" ? 7 : 10;

  const loadSentence = useCallback((index: number) => {
    const sentence = SENTENCES[index % SENTENCES.length];
    const words = sentence.split(" ");
    const shuffled = shuffleArr(
      words.map((w, i) => ({ id: i, word: w, used: false })),
    );
    setTiles(shuffled);
    setAnswer([]);
    setFeedback(null);
  }, []);

  const { timeLeft } = useGameTimer(120, () => endGame(score, completed));

  function startGame() {
    setPhase("playing");
    setIdx(0);
    setScore(0);
    setLives(3);
    setCompleted(0);
    loadSentence(0);
  }

  function endGame(finalScore: number, finalCompleted: number) {
    setPhase("over");
    const accuracy =
      finalCompleted > 0
        ? Math.round((finalCompleted / totalSentences) * 100)
        : 0;
    onGameEnd(
      buildResult(
        config,
        finalScore,
        accuracy,
        120 - timeLeft,
        finalCompleted > 0,
      ),
    );
  }

  function clickTile(tile: TileItem) {
    if (tile.used) return;
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)),
    );
    setAnswer((prev) => [...prev, tile]);
  }

  function removeTile(tile: TileItem) {
    setAnswer((prev) => prev.filter((t) => t.id !== tile.id));
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: false } : t)),
    );
  }

  function submit() {
    const correct = SENTENCES[idx % SENTENCES.length];
    const built = answer.map((t) => t.word).join(" ");
    if (built === correct) {
      triggerCombo(score + 20);
      const ns = score + 20;
      const nc = completed + 1;
      setScore(ns);
      setCompleted(nc);
      setFeedback("correct");
      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= totalSentences || lives <= 0) {
          endGame(ns, nc);
        } else {
          setIdx(nextIdx);
          loadSentence(nextIdx);
        }
      }, 800);
    } else {
      triggerShake();
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      setTimeout(() => {
        if (nl <= 0) {
          endGame(score, completed);
        } else {
          loadSentence(idx);
        }
      }, 800);
    }
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff] tracking-wide">
          Sentence Builder
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Arrange the scrambled word tiles into the correct sentence order.
          Click tiles to add them, click again to remove.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>Sentences: {totalSentences} | Lives: 3 | Timer: 120s</div>
          <div>Correct answer = +20 points</div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="sentence-builder.start_button"
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
            Sentences completed: {completed}/{totalSentences}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="sentence-builder.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  const correctSentence = SENTENCES[idx % SENTENCES.length];

  return (
    <div className="flex flex-col gap-4 p-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Sentence {idx + 1}/{totalSentences}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-sm">Time: {timeLeft}s</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
      </div>

      {feedback === "correct" && (
        <div className="text-center text-[#10b981] font-bold animate-pulse">
          Correct! +20
        </div>
      )}
      {feedback === "wrong" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          Wrong! Check word order.
        </div>
      )}

      <div
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 min-h-[60px] flex flex-wrap gap-2 items-center"
        data-ocid="sentence-builder.answer_bar"
      >
        {answer.length === 0 && (
          <span className="text-muted-foreground text-sm">
            Click tiles below to build the sentence...
          </span>
        )}
        {answer.map((tile) => (
          <button
            type="button"
            key={tile.id}
            onClick={() => removeTile(tile)}
            className="px-3 py-1.5 rounded-lg bg-[#00f5ff]/20 border border-[#00f5ff]/40 text-[#00f5ff] text-sm font-medium hover:bg-[#00f5ff]/40 transition-colors"
            data-ocid={`sentence-builder.answer_tile.${tile.id}`}
          >
            {tile.word}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <p className="text-xs text-muted-foreground mb-3">
          Available words — click to add:
        </p>
        <div
          className="flex flex-wrap gap-2"
          data-ocid="sentence-builder.tile_pool"
        >
          {tiles.map((tile) => (
            <button
              type="button"
              key={tile.id}
              onClick={() => clickTile(tile)}
              disabled={tile.used}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                tile.used
                  ? "opacity-30 cursor-not-allowed border-white/10 bg-white/5 text-muted-foreground"
                  : "border-white/20 bg-white/10 hover:bg-[#f59e0b]/20 hover:border-[#f59e0b]/40 text-foreground cursor-pointer"
              }`}
              data-ocid={`sentence-builder.tile.${tile.id}`}
            >
              {tile.word}
            </button>
          ))}
        </div>
      </div>

      {feedback === "wrong" && (
        <div className="text-xs text-muted-foreground text-center">
          Correct: {correctSentence}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <GlowButton
          onClick={() => {
            setAnswer([]);
            setTiles((prev) => prev.map((t) => ({ ...t, used: false })));
          }}
          data-ocid="sentence-builder.clear_button"
        >
          Clear
        </GlowButton>
        <GlowButton
          onClick={submit}
          disabled={answer.length === 0}
          data-ocid="sentence-builder.submit_button"
        >
          Submit
        </GlowButton>
      </div>
    </div>
  );
}
