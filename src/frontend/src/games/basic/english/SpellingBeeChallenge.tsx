import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

const EASY_WORDS = [
  { word: "cat", hint: "A small furry pet that meows" },
  { word: "dog", hint: "A loyal pet that barks" },
  { word: "run", hint: "To move quickly on foot" },
  { word: "big", hint: "Large in size" },
  { word: "sun", hint: "The star at the center of our solar system" },
  { word: "tree", hint: "A tall plant with a trunk and branches" },
  { word: "book", hint: "Something you read with pages inside" },
  { word: "play", hint: "To engage in activity for fun" },
  { word: "fish", hint: "An animal that lives in water" },
  { word: "jump", hint: "To leap into the air" },
];

const MEDIUM_WORDS = [
  { word: "beautiful", hint: "Pleasing to the eye or senses" },
  { word: "necessary", hint: "Something that must be done or had" },
  { word: "through", hint: "Moving from one side to the other" },
  { word: "friend", hint: "A person you like and trust" },
  { word: "because", hint: "For the reason that" },
  { word: "different", hint: "Not the same as something else" },
  { word: "together", hint: "In company with others" },
  { word: "another", hint: "One more of the same kind" },
  { word: "answer", hint: "A response to a question" },
  { word: "weather", hint: "The state of the atmosphere: sunny, rainy, etc." },
];

const HARD_WORDS = [
  { word: "Mediterranean", hint: "A large sea between Europe and Africa" },
  {
    word: "bureaucracy",
    hint: "A system of government with many complex rules",
  },
  { word: "accommodation", hint: "A place where someone can stay or live" },
  { word: "occurrence", hint: "An event or incident that happens" },
  { word: "embarrassment", hint: "A feeling of shame or awkwardness" },
  { word: "parallel", hint: "Lines that are always the same distance apart" },
  { word: "definitely", hint: "Without any doubt; certainly" },
  { word: "immediately", hint: "At once, without delay" },
  { word: "privilege", hint: "A special right or advantage" },
  { word: "acquaintance", hint: "A person one knows slightly but not well" },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function SpellingBeeChallenge({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];
  const wordSet =
    diff === "easy"
      ? EASY_WORDS
      : diff === "medium"
        ? MEDIUM_WORDS
        : HARD_WORDS;

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState("");
  const [attempt, setAttempt] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<
    "correct" | "wrong1" | "wrong2" | null
  >(null);
  const [hint2, setHint2] = useState("");
  const [completed, setCompleted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { timeLeft } = useGameTimer(180, () => endGame(score, completed));

  function startGame() {
    setPhase("playing");
    setWordIdx(0);
    setInput("");
    setAttempt(1);
    setScore(0);
    setLives(3);
    setCompleted(0);
    setFeedback(null);
    setHint2("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function endGame(fs: number, fc: number) {
    setPhase("over");
    const accuracy = fc > 0 ? Math.round((fc / wordSet.length) * 100) : 0;
    onGameEnd(buildResult(config, fs, accuracy, 180 - timeLeft, fc > 0));
  }

  function buildHint2(word: string): string {
    return `${word.length} letters: ${word[0].toUpperCase()}${"_".repeat(word.length - 2)}${word[word.length - 1].toUpperCase()}`;
  }

  function checkSpelling() {
    const current = wordSet[wordIdx];
    if (input.toLowerCase().trim() === current.word.toLowerCase()) {
      const pts = attempt === 1 ? 15 : 8;
      triggerCombo(score + pts);
      const ns = score + pts;
      const nc = completed + 1;
      setScore(ns);
      setCompleted(nc);
      setFeedback("correct");
      setTimeout(() => {
        const nextIdx = wordIdx + 1;
        if (nextIdx >= wordSet.length) endGame(ns, nc);
        else {
          setWordIdx(nextIdx);
          setInput("");
          setAttempt(1);
          setFeedback(null);
          setHint2("");
          inputRef.current?.focus();
        }
      }, 900);
    } else {
      triggerShake();
      if (attempt === 1) {
        setFeedback("wrong1");
        setHint2(buildHint2(current.word));
        setAttempt(2);
        setInput("");
      } else {
        const nl = lives - 1;
        setLives(nl);
        setFeedback("wrong2");
        setTimeout(() => {
          if (nl <= 0) endGame(score, completed);
          else {
            const nextIdx = wordIdx + 1;
            if (nextIdx >= wordSet.length) endGame(score, completed);
            else {
              setWordIdx(nextIdx);
              setInput("");
              setAttempt(1);
              setFeedback(null);
              setHint2("");
              inputRef.current?.focus();
            }
          }
        }, 1000);
      }
    }
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff] tracking-wide">
          Spelling Bee Challenge
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Read the hint and type the correct spelling. You have two attempts per
          word — first try earns more points!
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>
            Words: {wordSet.length} | Lives: 3 | Timer: 180s | Difficulty:{" "}
            {diff}
          </div>
          <div>First try = +15 pts | Second try = +8 pts</div>
        </div>
        <GlowButton onClick={startGame} data-ocid="spelling-bee.start_button">
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
            Spelled correctly: {completed}/{wordSet.length}
          </div>
        </div>
        <GlowButton onClick={startGame} data-ocid="spelling-bee.restart_button">
          Play Again
        </GlowButton>
      </div>
    );
  }

  const current = wordSet[wordIdx];

  return (
    <div className="flex flex-col gap-5 p-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Word {wordIdx + 1}/{wordSet.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-sm">Time: {timeLeft}s</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
        <p className="text-xs text-muted-foreground mb-3">Clue:</p>
        <p className="text-lg font-medium text-foreground">{current.hint}</p>
        {hint2 && <p className="text-sm text-[#f59e0b] mt-3">Hint: {hint2}</p>}
      </div>

      {feedback === "correct" && (
        <div className="text-center text-[#10b981] font-bold animate-pulse">
          Correct! +{attempt === 1 ? 15 : 8}
        </div>
      )}
      {feedback === "wrong1" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          Not quite — try once more!
        </div>
      )}
      {feedback === "wrong2" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          The word was: {current.word}
        </div>
      )}

      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && input.trim() && checkSpelling()
          }
          placeholder="Type your spelling here..."
          className="flex-1 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-[#00f5ff]/60 transition-colors"
          data-ocid="spelling-bee.input"
          disabled={feedback === "correct" || feedback === "wrong2"}
        />
        <GlowButton
          onClick={checkSpelling}
          disabled={
            !input.trim() || feedback === "correct" || feedback === "wrong2"
          }
          data-ocid="spelling-bee.check_button"
        >
          Check
        </GlowButton>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        Attempt {attempt}/2 {attempt === 2 && "— Last chance!"}
      </div>
    </div>
  );
}
