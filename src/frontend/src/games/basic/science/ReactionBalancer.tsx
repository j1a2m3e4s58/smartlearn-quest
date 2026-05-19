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

const EQUATIONS = [
  { description: "_H2 + _O2 -> _H2O", answer: [2, 1, 2] },
  { description: "_N2 + _H2 -> _NH3", answer: [1, 3, 2] },
  { description: "_C + _O2 -> _CO2", answer: [1, 1, 1] },
  { description: "_Na + _Cl2 -> _NaCl", answer: [2, 1, 2] },
  { description: "_Fe + _O2 -> _Fe2O3", answer: [4, 3, 2] },
  { description: "_CH4 + _O2 -> _CO2 + _H2O", answer: [1, 2, 1, 2] },
  { description: "_Mg + _O2 -> _MgO", answer: [2, 1, 2] },
  { description: "_H2 + _Cl2 -> _HCl", answer: [1, 1, 2] },
  { description: "_Ca + _H2O -> _Ca(OH)2 + _H2", answer: [1, 2, 1, 1] },
  { description: "_Al + _O2 -> _Al2O3", answer: [4, 3, 2] },
];

export default function ReactionBalancer({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [eqIndex, setEqIndex] = useState(0);
  const [coeffs, setCoeffs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = { current: Date.now() };
  const { triggerShake, triggerCombo, triggerMascotReaction } = useGameFeel();

  const endGame = useCallback(
    (finalScore: number, correct: number, lv: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          finalScore,
          correct / EQUATIONS.length,
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
  } = useGameTimer(180, () => {
    endGame(score, correctCount, lives);
  });

  const initCoeffs = (idx: number) => {
    setCoeffs(new Array(EQUATIONS[idx].answer.length).fill(1));
  };

  const startGame = () => {
    setPhase("playing");
    setEqIndex(0);
    setScore(0);
    setLives(3);
    setFlash(null);
    setShowAnswer(false);
    setCorrectCount(0);
    initCoeffs(0);
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const handleCoeffChange = (i: number, val: number) => {
    setCoeffs((c) =>
      c.map((v, idx) => (idx === i ? Math.max(1, Math.min(8, val)) : v)),
    );
  };

  const checkAnswer = () => {
    const eq = EQUATIONS[eqIndex];
    const correct = eq.answer.every((v, i) => v === coeffs[i]);
    if (correct) {
      setFlash("correct");
      const ns = score + 20;
      const nc = correctCount + 1;
      setScore(ns);
      setCorrectCount(nc);
      triggerCombo(1);
      triggerMascotReaction("correct");
      setTimeout(() => {
        setFlash(null);
        setShowAnswer(false);
        if (eqIndex + 1 >= EQUATIONS.length) endGame(ns, nc, lives);
        else {
          setEqIndex((e) => e + 1);
          initCoeffs(eqIndex + 1);
        }
      }, 900);
    } else {
      setFlash("wrong");
      const nl = lives - 1;
      setLives(nl);
      setShowAnswer(true);
      triggerShake();
      setTimeout(() => {
        setFlash(null);
        if (nl <= 0) endGame(score, correctCount, 0);
        else
          setTimeout(() => {
            setShowAnswer(false);
            if (eqIndex + 1 >= EQUATIONS.length)
              endGame(score, correctCount, nl);
            else {
              setEqIndex((e) => e + 1);
              initCoeffs(eqIndex + 1);
            }
          }, 1500);
      }, 500);
    }
  };

  const renderEquation = (desc: string, userCoeffs: number[]) => {
    let ci = 0;
    return desc.split("_").map((part, i) => {
      if (i === 0)
        return (
          <span key={i} className="text-foreground">
            {part}
          </span>
        );
      const idx = ci++;
      return (
        <span key={i} className="inline-flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={8}
            value={userCoeffs[idx] ?? 1}
            onChange={(e) =>
              handleCoeffChange(idx, Number.parseInt(e.target.value) || 1)
            }
            data-ocid={`balancer.coeff.${idx + 1}`}
            className="w-12 h-8 rounded border border-white/20 bg-white/10 text-center text-sm font-bold text-cyan-400 [appearance:textfield] focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <span className="text-foreground">{part}</span>
        </span>
      );
    });
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">
          Reaction Balancer
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Set the coefficients (1-8) to balance each chemical equation.
          Conservation of mass — atoms in must equal atoms out.
        </p>
        <GlowButton data-ocid="balancer.start_button" onClick={startGame}>
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
        <p className="text-muted-foreground">
          Balanced: {correctCount} / {EQUATIONS.length}
        </p>
        <GlowButton data-ocid="balancer.restart_button" onClick={startGame}>
          Play Again
        </GlowButton>
      </div>
    );
  }

  const eq = EQUATIONS[eqIndex];

  return (
    <div className="flex flex-col gap-6 p-4">
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
          {eqIndex + 1}/{EQUATIONS.length} | Score: {score}
        </div>
      </div>

      <div
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all ${
          flash === "correct"
            ? "ring-2 ring-emerald-400 bg-emerald-400/10"
            : flash === "wrong"
              ? "ring-2 ring-rose-400 bg-rose-400/10"
              : ""
        }`}
      >
        <div className="text-muted-foreground text-xs mb-4">
          Equation {eqIndex + 1}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-lg font-mono mb-6">
          {renderEquation(eq.description, coeffs)}
        </div>
        <GlowButton
          data-ocid="balancer.check_button"
          onClick={checkAnswer}
          disabled={!!flash}
        >
          Check Balance
        </GlowButton>
      </div>

      {showAnswer && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="text-amber-400 text-sm font-semibold mb-1">
            Correct coefficients:
          </div>
          <div className="text-foreground font-mono text-sm">
            {eq.answer.join(" — ")}
          </div>
        </div>
      )}
    </div>
  );
}
