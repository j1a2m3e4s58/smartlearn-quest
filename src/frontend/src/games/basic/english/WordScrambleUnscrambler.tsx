import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useEffect, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

const EASY_WORDS = [
  "CAT",
  "DOG",
  "SUN",
  "RUN",
  "BIG",
  "FLY",
  "EAT",
  "SIT",
  "HOT",
  "CRY",
];
const MEDIUM_WORDS = [
  "TABLE",
  "HOUSE",
  "WATER",
  "CLOUD",
  "STONE",
  "LIGHT",
  "BREAD",
  "SLEEP",
  "DANCE",
  "SHAKE",
];
const HARD_WORDS = [
  "SCHOOL",
  "GARDEN",
  "FRIEND",
  "MOTHER",
  "CASTLE",
  "BRIDGE",
  "ORANGE",
  "ANIMAL",
  "FINGER",
  "BOTTLE",
];

function scramble(word: string): string[] {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join("") === word && word.length > 1) return scramble(word);
  return letters;
}

interface TileLetter {
  id: number;
  letter: string;
  used: boolean;
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function WordScrambleUnscrambler({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];
  const wordList =
    diff === "easy"
      ? EASY_WORDS
      : diff === "medium"
        ? MEDIUM_WORDS
        : HARD_WORDS;

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [wordIdx, setWordIdx] = useState(0);
  const [tiles, setTiles] = useState<TileLetter[]>([]);
  const [selected, setSelected] = useState<TileLetter[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);

  const { timeLeft } = useGameTimer(120, () => endGame(score, completed));

  function loadWord(idx: number) {
    const word = wordList[idx];
    const letters = scramble(word);
    setTiles(letters.map((l, i) => ({ id: i, letter: l, used: false })));
    setSelected([]);
    setFeedback(null);
  }

  function startGame() {
    setPhase("playing");
    setWordIdx(0);
    setScore(0);
    setLives(3);
    setCompleted(0);
    loadWord(0);
  }

  function endGame(fs: number, fc: number) {
    setPhase("over");
    const accuracy = fc > 0 ? Math.round((fc / wordList.length) * 100) : 0;
    onGameEnd(buildResult(config, fs, accuracy, 120 - timeLeft, fc > 0));
  }

  function clickTile(tile: TileLetter) {
    if (tile.used) return;
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)),
    );
    setSelected((prev) => [...prev, tile]);
  }

  function removeSelected(tile: TileLetter) {
    setSelected((prev) => prev.filter((t) => t.id !== tile.id));
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: false } : t)),
    );
  }

  function clearAll() {
    setSelected([]);
    setTiles((prev) => prev.map((t) => ({ ...t, used: false })));
  }

  function submit() {
    const built = selected.map((t) => t.letter).join("");
    const correct = wordList[wordIdx];
    if (built === correct) {
      triggerCombo(score + 15);
      const ns = score + 15;
      const nc = completed + 1;
      setScore(ns);
      setCompleted(nc);
      setFeedback("correct");
      setTimeout(() => {
        const nextIdx = wordIdx + 1;
        if (nextIdx >= wordList.length) endGame(ns, nc);
        else {
          setWordIdx(nextIdx);
          loadWord(nextIdx);
        }
      }, 800);
    } else {
      triggerShake();
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      setTimeout(() => {
        if (nl <= 0) endGame(score, completed);
        else loadWord(wordIdx);
      }, 900);
    }
  }

  // Prevent stale closures when wordIdx changes
  useEffect(() => {
    if (phase === "playing") loadWord(wordIdx);
  }, [wordIdx]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff] tracking-wide">
          Word Scramble Unscrambler
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          The letters of a word are scrambled. Click tiles to arrange them in
          the correct order and spell the word.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>
            Words: {wordList.length} | Lives: 3 | Timer: 120s | Difficulty:{" "}
            {diff}
          </div>
          <div>Correct = +15 points</div>
        </div>
        <GlowButton onClick={startGame} data-ocid="word-scramble.start_button">
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
            Unscrambled: {completed}/{wordList.length}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="word-scramble.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Word {wordIdx + 1}/{wordList.length}
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
          Wrong! The word was: {wordList[wordIdx]}
        </div>
      )}

      <div
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 min-h-[60px] flex flex-wrap gap-2 items-center justify-center"
        data-ocid="word-scramble.answer_row"
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground text-sm">
            Click tiles below to spell the word...
          </span>
        )}
        {selected.map((tile) => (
          <button
            type="button"
            key={tile.id}
            onClick={() => removeSelected(tile)}
            className="w-10 h-10 rounded-lg bg-[#00f5ff]/20 border border-[#00f5ff]/40 text-[#00f5ff] font-bold text-lg hover:bg-[#00f5ff]/40 transition-colors"
            data-ocid={`word-scramble.selected_tile.${tile.id}`}
          >
            {tile.letter}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <p className="text-xs text-muted-foreground mb-3 text-center">
          Scrambled letters — click to pick:
        </p>
        <div
          className="flex flex-wrap gap-2 justify-center"
          data-ocid="word-scramble.tile_pool"
        >
          {tiles.map((tile) => (
            <button
              type="button"
              key={tile.id}
              onClick={() => clickTile(tile)}
              disabled={tile.used}
              className={`w-10 h-10 rounded-lg border font-bold text-lg transition-all ${
                tile.used
                  ? "opacity-30 cursor-not-allowed border-white/10 bg-white/5 text-muted-foreground"
                  : "border-white/20 bg-white/10 hover:bg-[#f59e0b]/20 hover:border-[#f59e0b]/40 text-foreground cursor-pointer"
              }`}
              data-ocid={`word-scramble.tile.${tile.id}`}
            >
              {tile.letter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <GlowButton onClick={clearAll} data-ocid="word-scramble.clear_button">
          Clear
        </GlowButton>
        <GlowButton
          onClick={submit}
          disabled={selected.length === 0}
          data-ocid="word-scramble.submit_button"
        >
          Submit
        </GlowButton>
      </div>
    </div>
  );
}
