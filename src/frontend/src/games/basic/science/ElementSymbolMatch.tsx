import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useMemo, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

const ELEMENTS = [
  { name: "Hydrogen", sym: "H" },
  { name: "Helium", sym: "He" },
  { name: "Carbon", sym: "C" },
  { name: "Nitrogen", sym: "N" },
  { name: "Oxygen", sym: "O" },
  { name: "Sodium", sym: "Na" },
  { name: "Magnesium", sym: "Mg" },
  { name: "Aluminum", sym: "Al" },
  { name: "Silicon", sym: "Si" },
  { name: "Chlorine", sym: "Cl" },
  { name: "Potassium", sym: "K" },
  { name: "Calcium", sym: "Ca" },
  { name: "Iron", sym: "Fe" },
  { name: "Copper", sym: "Cu" },
  { name: "Silver", sym: "Ag" },
  { name: "Gold", sym: "Au" },
  { name: "Fluorine", sym: "F" },
  { name: "Phosphorus", sym: "P" },
  { name: "Sulfur", sym: "S" },
  { name: "Lithium", sym: "Li" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(elements: typeof ELEMENTS, correctIdx: number) {
  const correct = elements[correctIdx];
  const others = elements.filter((_, i) => i !== correctIdx);
  const wrong3 = shuffle(others)
    .slice(0, 3)
    .map((e) => e.sym);
  const choices = shuffle([correct.sym, ...wrong3]);
  return { name: correct.name, answer: correct.sym, choices };
}

export default function ElementSymbolMatch({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const TOTAL = 15;
  const { triggerShake, triggerParticle, triggerCombo } = useGameFeel();

  const questions = useMemo(() => {
    if (!shuffledOrder.length) return [];
    return shuffledOrder.slice(0, TOTAL).map((i) => buildQuestion(ELEMENTS, i));
  }, [shuffledOrder]);

  const endGame = useCallback(
    (s: number, c: number, w: number, comp: boolean) => {
      setPhase("over");
      const elapsed = (Date.now() - startTime) / 1000;
      const total = c + w;
      onGameEnd(
        buildResult(
          config,
          s,
          total > 0 ? (c / total) * 100 : 0,
          elapsed,
          comp,
        ),
      );
    },
    [config, startTime, onGameEnd],
  );

  const handleExpire = useCallback(() => {
    endGame(score, correct, wrong, false);
  }, [score, correct, wrong, endGame]);

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, handleExpire);

  const startGame = () => {
    const indices = shuffle(ELEMENTS.map((_, i) => i));
    setShuffledOrder(indices);
    setPhase("playing");
    setScore(0);
    setLives(3);
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setAnswered(false);
    setStartTime(Date.now());
    resetTimer();
    startTimer();
  };

  const handleAnswer = (choice: string) => {
    if (answered || phase !== "playing" || !questions.length) return;
    setAnswered(true);
    const q = questions[idx];
    const isCorrect = choice === q.answer;
    if (isCorrect) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      triggerParticle(0, 0, "correct");
      if (nc % 3 === 0) triggerCombo(nc / 3);
      setFeedback({ msg: `Correct! ${q.name} = ${q.answer}`, ok: true });
      if (idx + 1 >= TOTAL) {
        setTimeout(() => endGame(ns, nc, wrong, true), 1200);
        return;
      }
    } else {
      const nl = lives - 1;
      const nw = wrong + 1;
      setLives(nl);
      setWrong(nw);
      triggerShake();
      setFeedback({ msg: `Wrong! ${q.name} = ${q.answer}`, ok: false });
      if (nl <= 0) {
        setTimeout(() => endGame(score, correct, nw, false), 1200);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      setIdx((i) => i + 1);
    }, 1200);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-[#10b981] mb-3">
            Element Symbol Match
          </h2>
          <p className="text-white/70 mb-6">
            Match each element name to its correct chemical symbol. 15 questions
            from the periodic table.
          </p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {ELEMENTS.slice(0, 8).map((e) => (
              <div
                key={e.sym}
                className="rounded-lg bg-white/5 border border-white/10 p-2 text-center"
              >
                <div className="text-lg font-bold text-[#10b981]">{e.sym}</div>
                <div className="text-xs text-white/50">{e.name}</div>
              </div>
            ))}
          </div>
          <GlowButton data-ocid="element.play_button" onClick={startGame}>
            Play Now
          </GlowButton>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    const total = correct + wrong;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: lives > 0 ? "#10b981" : "#f43f5e" }}
          >
            {lives > 0 ? "Chemistry Master!" : "Game Over"}
          </h2>
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#00f5ff]">{score}</div>
              <div className="text-white/50 text-sm">Score</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#10b981]">{acc}%</div>
              <div className="text-white/50 text-sm">Accuracy</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {correct}/{TOTAL}
              </div>
              <div className="text-white/50 text-sm">Correct</div>
            </div>
          </div>
          <GlowButton data-ocid="element.play_again_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  if (!q) return null;
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="text-[#10b981] font-bold">Score: {score}</div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-[#f43f5e]" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div
          className={`font-bold ${timeLeft <= 20 ? "text-[#f43f5e] animate-pulse" : "text-[#f59e0b]"}`}
        >
          {timeLeft}s
        </div>
      </div>

      <div className="text-center text-white/40 text-sm">
        {idx + 1} / {TOTAL}
      </div>

      {feedback && (
        <div
          className={`rounded-lg px-4 py-2 text-sm font-medium text-center ${
            feedback.ok
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
              : "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-center">
        <p className="text-white/50 text-sm mb-2">
          What is the chemical symbol for
        </p>
        <h3 className="text-3xl font-bold text-white mb-8">{q.name}</h3>
        <div className="grid grid-cols-4 gap-3">
          {q.choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              data-ocid={`element.choice.${i + 1}`}
              onClick={() => handleAnswer(choice)}
              disabled={answered}
              className={`py-4 rounded-xl border text-2xl font-bold transition-all ${
                answered && choice === q.answer
                  ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981]"
                  : "bg-white/5 border-white/20 text-white hover:border-[#10b981]/60 hover:bg-[#10b981]/10"
              } disabled:cursor-not-allowed`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
