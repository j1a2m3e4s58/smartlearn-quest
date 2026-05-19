import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const CORRECT_ORDER = [
  "Roots absorb water from soil",
  "Leaves absorb sunlight",
  "CO2 enters through stomata",
  "Chlorophyll converts light to energy",
  "Glucose is produced",
  "Oxygen is released",
];

function shuffleSteps(round: number): string[] {
  const arr = [...CORRECT_ORDER];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.abs(Math.sin(round * 13 + i) * 6.999));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PhotosynthesisSteps({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [round, setRound] = useState(1);
  const [steps, setSteps] = useState<string[]>(shuffleSteps(1));
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctTotal, setCorrectTotal] = useState(0);
  const startTimeRef = { current: Date.now() };
  const { triggerShake, triggerCombo, triggerMascotReaction } = useGameFeel();

  const endGame = useCallback(
    (finalScore: number, correct: number, lv: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          finalScore,
          correct / (3 * 6),
          (Date.now() - startTimeRef.current) / 1000,
          lv > 0,
        ),
      );
    },
    [config, onGameEnd],
  );

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, () => {
    endGame(score, correctTotal, lives);
  });

  const startGame = () => {
    setPhase("playing");
    setRound(1);
    setScore(0);
    setLives(3);
    setPlayerOrder([]);
    setSubmitted(false);
    setResults([]);
    setSteps(shuffleSteps(1));
    setCorrectTotal(0);
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const handleStepClick = (step: string) => {
    if (submitted) return;
    if (playerOrder.includes(step)) {
      setPlayerOrder((o) => o.filter((s) => s !== step));
    } else {
      setPlayerOrder((o) => [...o, step]);
    }
  };

  const handleSubmit = () => {
    if (playerOrder.length < 6) return;
    const r = CORRECT_ORDER.map((step, i) => playerOrder[i] === step);
    const numCorrect = r.filter(Boolean).length;
    setResults(r);
    setSubmitted(true);
    const allCorrect = numCorrect === 6;
    const ns = score + (allCorrect ? 30 : numCorrect * 5);
    const nc = correctTotal + numCorrect;
    setScore(ns);
    setCorrectTotal(nc);
    if (allCorrect) {
      triggerCombo(1);
      triggerMascotReaction("correct");
    } else {
      triggerShake();
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(ns, nc, 0), 1500);
        return;
      }
    }
    setTimeout(() => {
      if (round >= 3) {
        endGame(ns, nc, lives);
      } else {
        setRound((r) => r + 1);
        setPlayerOrder([]);
        setSubmitted(false);
        setResults([]);
        setSteps(shuffleSteps(round + 1));
      }
    }, 1500);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">
          Photosynthesis Steps
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Click the steps in the correct order of photosynthesis. All 6 in order
          scores bonus points!
        </p>
        <GlowButton data-ocid="photo.start_button" onClick={startGame}>
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">Game Over</h2>
        <p className="text-2xl text-cyan-400">Score: {score}</p>
        <GlowButton data-ocid="photo.restart_button" onClick={startGame}>
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-rose-500" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div className="text-cyan-400 font-mono text-lg">{timeLeft}s</div>
        <div className="text-foreground font-bold">
          Round {round}/3 | Score: {score}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Click steps in the correct order of photosynthesis:
      </div>

      <div className="grid grid-cols-1 gap-2">
        {steps.map((step, idx) => {
          const pos = playerOrder.indexOf(step);
          const isSelected = pos !== -1;
          const resultIdx = playerOrder.findIndex((s) => s === step);
          const isCorrect =
            submitted && resultIdx !== -1 ? results[resultIdx] : null;
          return (
            <button
              key={idx}
              type="button"
              data-ocid={`photo.step.${idx + 1}`}
              onClick={() => handleStepClick(step)}
              disabled={submitted}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all flex items-center gap-3 ${
                isCorrect === true
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                  : isCorrect === false
                    ? "border-rose-400 bg-rose-400/20 text-rose-300"
                    : isSelected
                      ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 text-foreground"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isSelected
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {isSelected ? pos + 1 : " "}
              </span>
              {step}
            </button>
          );
        })}
      </div>

      <GlowButton
        data-ocid="photo.submit_button"
        onClick={handleSubmit}
        disabled={playerOrder.length < 6 || submitted}
      >
        Submit Order ({playerOrder.length}/6)
      </GlowButton>

      {submitted && (
        <div className="text-center text-sm text-muted-foreground">
          Correct order:{" "}
          {CORRECT_ORDER.map((s, i) => (
            <span key={i} className="block text-xs text-emerald-400">
              {i + 1}. {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
