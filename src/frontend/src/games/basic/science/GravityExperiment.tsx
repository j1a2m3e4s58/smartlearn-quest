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
  onGameEnd: (r: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

const SCENARIOS = [
  {
    obj1: "5 kg Feather Bag",
    obj2: "50 kg Rock",
    height: "10 m",
    planet: "Earth (no air)",
    answer: "same",
    fact: "In a vacuum, all objects fall at the same rate regardless of mass — Galileo proved this in 1589!",
  },
  {
    obj1: "1 kg Rubber Ball",
    obj2: "100 kg Cannonball",
    height: "20 m",
    planet: "Earth (no air)",
    answer: "same",
    fact: "Gravitational acceleration on Earth is 9.8 m/s² for all objects regardless of weight.",
  },
  {
    obj1: "10 kg Steel Box",
    obj2: "0.1 kg Pebble",
    height: "5 m",
    planet: "Moon (no air)",
    answer: "same",
    fact: "The Moon has 1/6th Earth gravity (1.62 m/s²), but both objects still fall at the same rate.",
  },
  {
    obj1: "2 kg Textbook",
    obj2: "200 kg Anvil",
    height: "15 m",
    planet: "Mars (no air)",
    answer: "same",
    fact: "Gravity on Mars is 3.72 m/s². Still affects all objects equally — mass does not matter!",
  },
  {
    obj1: "Heavy Metal Block",
    obj2: "Light Sheet of Paper",
    height: "2 m",
    planet: "Vacuum Chamber",
    answer: "same",
    fact: "NASA dropped a hammer and a feather on the Moon in 1971 — they hit the ground at the exact same time.",
  },
  {
    obj1: "500 g Orange",
    obj2: "5 kg Watermelon",
    height: "8 m",
    planet: "Earth (no air)",
    answer: "same",
    fact: "The force of gravity is proportional to mass, but so is inertia — they perfectly cancel out.",
  },
  {
    obj1: "50 kg Person",
    obj2: "0.5 kg Phone",
    height: "12 m",
    planet: "Jupiter (no air)",
    answer: "same",
    fact: "Jupiter's gravity is 24.8 m/s² — extremely strong, but both objects still fall together.",
  },
  {
    obj1: "3 kg Book Stack",
    obj2: "300 kg Safe",
    height: "6 m",
    planet: "Venus (no air)",
    answer: "same",
    fact: "The equation of motion is d = ½gt². Since g is the same for all objects, fall time depends only on height.",
  },
  {
    obj1: "8 kg Backpack",
    obj2: "0.8 kg Water Bottle",
    height: "25 m",
    planet: "Saturn (no air)",
    answer: "same",
    fact: "This is called the Equivalence Principle — the basis of Einstein's General Theory of Relativity.",
  },
  {
    obj1: "Gold Bar (12 kg)",
    obj2: "Wooden Plank (1 kg)",
    height: "18 m",
    planet: "Neptune (no air)",
    answer: "same",
    fact: "Materials do not affect free-fall speed. Whether gold or wood, if dropped together, they land together.",
  },
];

export default function GravityExperiment({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<{
    msg: string;
    fact: string;
    ok: boolean;
  } | null>(null);
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { triggerShake, triggerParticle, triggerCombo } = useGameFeel();

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

  const handleAnswer = (choice: "obj1" | "obj2" | "same") => {
    if (answered || phase !== "playing") return;
    setAnswered(true);
    const s = SCENARIOS[idx];
    const isCorrect = choice === "same";
    if (isCorrect) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      triggerParticle(0, 0, "correct");
      if (nc % 3 === 0) triggerCombo(nc / 3);
      setFeedback({
        msg: "Correct! They land at the same time.",
        fact: s.fact,
        ok: true,
      });
      if (idx + 1 >= SCENARIOS.length) {
        setTimeout(() => endGame(ns, nc, wrong, true), 2500);
        return;
      }
    } else {
      const nl = lives - 1;
      const nw = wrong + 1;
      setLives(nl);
      setWrong(nw);
      triggerShake();
      setFeedback({
        msg: "Wrong! Without air resistance, both objects land at the same time.",
        fact: s.fact,
        ok: false,
      });
      if (nl <= 0) {
        setTimeout(() => endGame(score, correct, nw, false), 2500);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      setIdx((i) => i + 1);
    }, 2500);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
            Gravity Experiment
          </h2>
          <p className="text-white/70 mb-4">
            Galileo dropped objects from the Tower of Pisa. Which hits the
            ground first? Discover the law of falling bodies!
          </p>
          <div className="rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 p-3 mb-6 text-sm text-[#f59e0b]">
            Hint: In all 10 scenarios, there is no air resistance.
          </div>
          <GlowButton data-ocid="gravity.play_button" onClick={startGame}>
            Run Experiment
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
            {lives > 0 ? "Galileo Would Be Proud!" : "Keep Studying!"}
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
                {correct}/{SCENARIOS.length}
              </div>
              <div className="text-white/50 text-sm">Correct</div>
            </div>
          </div>
          <GlowButton data-ocid="gravity.play_again_button" onClick={startGame}>
            Run Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const s = SCENARIOS[idx];
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="text-[#f59e0b] font-bold">Score: {score}</div>
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
        {idx + 1} / {SCENARIOS.length}
      </div>

      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            feedback.ok
              ? "bg-[#10b981]/10 border border-[#10b981]/30"
              : "bg-[#f43f5e]/10 border border-[#f43f5e]/30"
          }`}
        >
          <p
            className={`font-semibold mb-1 ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
          >
            {feedback.msg}
          </p>
          <p className="text-white/60 text-xs">{feedback.fact}</p>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
          Planet: {s.planet} &bull; Drop height: {s.height}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00f5ff]/20 border-2 border-[#00f5ff]/40 mx-auto mb-2 flex items-center justify-center">
              <span className="text-[#00f5ff] text-xs font-bold">A</span>
            </div>
            <div className="text-white/80 text-sm font-medium">{s.obj1}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f43f5e]/20 border-2 border-[#f43f5e]/40 mx-auto mb-2 flex items-center justify-center">
              <span className="text-[#f43f5e] text-xs font-bold">B</span>
            </div>
            <div className="text-white/80 text-sm font-medium">{s.obj2}</div>
          </div>
        </div>
        <p className="text-white font-semibold text-center mb-4">
          Dropped simultaneously from {s.height}. Which lands first?
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            data-ocid="gravity.answer.obj1"
            onClick={() => handleAnswer("obj1")}
            disabled={answered}
            className="py-3 rounded-xl border border-[#00f5ff]/30 bg-[#00f5ff]/10 text-[#00f5ff] text-sm font-medium hover:bg-[#00f5ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            A lands first
          </button>
          <button
            type="button"
            data-ocid="gravity.answer.same"
            onClick={() => handleAnswer("same")}
            disabled={answered}
            className="py-3 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981] text-sm font-medium hover:bg-[#10b981]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Same time
          </button>
          <button
            type="button"
            data-ocid="gravity.answer.obj2"
            onClick={() => handleAnswer("obj2")}
            disabled={answered}
            className="py-3 rounded-xl border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-[#f43f5e] text-sm font-medium hover:bg-[#f43f5e]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            B lands first
          </button>
        </div>
      </div>
    </div>
  );
}
