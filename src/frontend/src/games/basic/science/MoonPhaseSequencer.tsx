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

const PHASES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Third Quarter",
  "Waning Crescent",
];

type MoonStyle = { background: string; boxShadow?: string };

function getMoonStyle(phase: string): MoonStyle {
  switch (phase) {
    case "New Moon":
      return { background: "#1a1a2e" };
    case "Waxing Crescent":
      return {
        background:
          "radial-gradient(circle at 65% 50%, #f0e68c 30%, #1a1a2e 31%)",
      };
    case "First Quarter":
      return {
        background: "linear-gradient(to right, #1a1a2e 50%, #f0e68c 50%)",
      };
    case "Waxing Gibbous":
      return {
        background:
          "radial-gradient(circle at 35% 50%, #1a1a2e 30%, #f0e68c 31%)",
      };
    case "Full Moon":
      return {
        background: "#f0e68c",
        boxShadow: "0 0 20px 6px rgba(240,230,140,0.5)",
      };
    case "Waning Gibbous":
      return {
        background:
          "radial-gradient(circle at 65% 50%, #1a1a2e 30%, #f0e68c 31%)",
      };
    case "Third Quarter":
      return {
        background: "linear-gradient(to left, #1a1a2e 50%, #f0e68c 50%)",
      };
    case "Waning Crescent":
      return {
        background:
          "radial-gradient(circle at 35% 50%, #f0e68c 30%, #1a1a2e 31%)",
      };
    default:
      return { background: "#888" };
  }
}

function shufflePhases(round: number): string[] {
  const arr = [...PHASES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.abs(Math.sin(round * 11 + i) * 7.999));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MoonPhaseSequencer({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [round, setRound] = useState(1);
  const [shuffled, setShuffled] = useState<string[]>(shufflePhases(1));
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
          correct / (3 * 8),
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
  } = useGameTimer(90, () => {
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
    setShuffled(shufflePhases(1));
    setCorrectTotal(0);
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const handlePhaseClick = (p: string) => {
    if (submitted) return;
    if (playerOrder.includes(p)) {
      setPlayerOrder((o) => o.filter((x) => x !== p));
    } else {
      setPlayerOrder((o) => [...o, p]);
    }
  };

  const handleSubmit = () => {
    if (playerOrder.length < 8) return;
    const r = PHASES.map((p, i) => playerOrder[i] === p);
    const numCorrect = r.filter(Boolean).length;
    setResults(r);
    setSubmitted(true);
    const allCorrect = numCorrect === 8;
    const ns = score + (allCorrect ? 40 : numCorrect * 4);
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
      if (round >= 3) endGame(ns, nc, lives);
      else {
        setRound((r) => r + 1);
        setPlayerOrder([]);
        setSubmitted(false);
        setResults([]);
        setShuffled(shufflePhases(round + 1));
      }
    }, 1500);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">
          Moon Phase Sequencer
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Click the moon phases in the correct order from New Moon to Waning
          Crescent. All 8 correct earns a bonus!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {PHASES.map((p) => (
            <div key={p} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full border border-white/20 overflow-hidden"
                style={getMoonStyle(p)}
              />
              <span className="text-xs text-muted-foreground">{p}</span>
            </div>
          ))}
        </div>
        <GlowButton data-ocid="moon.start_button" onClick={startGame}>
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
        <GlowButton data-ocid="moon.restart_button" onClick={startGame}>
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
        Click moon phases in order (1 = New Moon, 8 = Waning Crescent):
      </div>

      <div className="grid grid-cols-4 gap-3">
        {shuffled.map((p, idx) => {
          const posInOrder = playerOrder.indexOf(p);
          const isSelected = posInOrder !== -1;
          const resultIdx = playerOrder.findIndex((x) => x === p);
          const isCorrect =
            submitted && resultIdx !== -1 ? results[resultIdx] : null;
          return (
            <button
              key={idx}
              type="button"
              data-ocid={`moon.phase.${idx + 1}`}
              onClick={() => handlePhaseClick(p)}
              disabled={submitted}
              className={`rounded-xl border px-2 py-3 flex flex-col items-center gap-2 transition-all ${
                isCorrect === true
                  ? "border-emerald-400 bg-emerald-400/20"
                  : isCorrect === false
                    ? "border-rose-400 bg-rose-400/20"
                    : isSelected
                      ? "border-cyan-400 bg-cyan-400/15"
                      : "border-white/20 bg-white/5 hover:border-white/40"
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border border-white/10 overflow-hidden"
                style={getMoonStyle(p)}
              />
              <span
                className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  isSelected
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {isSelected ? posInOrder + 1 : " "}
              </span>
              <span className="text-xs text-center text-foreground leading-tight">
                {p}
              </span>
            </button>
          );
        })}
      </div>

      <GlowButton
        data-ocid="moon.submit_button"
        onClick={handleSubmit}
        disabled={playerOrder.length < 8 || submitted}
      >
        Submit Sequence ({playerOrder.length}/8)
      </GlowButton>

      {submitted && (
        <div className="text-center text-xs text-emerald-400 mt-1">
          Correct order: {PHASES.join(" → ")}
        </div>
      )}
    </div>
  );
}
