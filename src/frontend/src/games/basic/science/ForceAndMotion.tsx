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

type FrictionLevel = "Low" | "Medium" | "High";

const FRICTION_MAP: Record<FrictionLevel, number> = {
  Low: 10,
  Medium: 30,
  High: 50,
};

const SCENARIOS: { force: number; friction: FrictionLevel; moves: boolean }[] =
  [
    { force: 20, friction: "Low", moves: true },
    { force: 5, friction: "Low", moves: false },
    { force: 40, friction: "Medium", moves: true },
    { force: 25, friction: "Medium", moves: false },
    { force: 60, friction: "High", moves: true },
    { force: 45, friction: "High", moves: false },
    { force: 15, friction: "Low", moves: true },
    { force: 8, friction: "Medium", moves: false },
    { force: 55, friction: "High", moves: true },
    { force: 35, friction: "Medium", moves: true },
    { force: 28, friction: "Low", moves: true },
    { force: 48, friction: "High", moves: false },
  ];

export default function ForceAndMotion({ config, onGameEnd }: Props) {
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

  const handleAnswer = (moves: boolean) => {
    if (answered || phase !== "playing") return;
    setAnswered(true);
    const s = SCENARIOS[idx];
    const friction = FRICTION_MAP[s.friction];
    const netForce = s.force - friction;
    const isCorrect = moves === s.moves;
    if (isCorrect) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      triggerParticle(0, 0, "correct");
      if (nc % 3 === 0) triggerCombo(nc / 3);
      const explanation = s.moves
        ? `Correct! Force (${s.force}N) > Friction (${friction}N). Net force = ${netForce}N. Box moves!`
        : `Correct! Force (${s.force}N) < Friction (${friction}N). Box does not move.`;
      setFeedback({ msg: explanation, ok: true });
      if (idx + 1 >= SCENARIOS.length) {
        setTimeout(() => endGame(ns, nc, wrong, true), 1500);
        return;
      }
    } else {
      const nl = lives - 1;
      const nw = wrong + 1;
      setLives(nl);
      setWrong(nw);
      triggerShake();
      const explanation = s.moves
        ? `Wrong! Force (${s.force}N) > Friction (${friction}N). The box DOES move.`
        : `Wrong! Force (${s.force}N) < Friction (${friction}N). The box does NOT move.`;
      setFeedback({ msg: explanation, ok: false });
      if (nl <= 0) {
        setTimeout(() => endGame(score, correct, nw, false), 1500);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      setIdx((i) => i + 1);
    }, 1500);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
            Force and Motion
          </h2>
          <p className="text-white/70 mb-4">
            Apply forces to a box against friction. Decide: does it move or stay
            still? 12 physics challenges await.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            {Object.entries(FRICTION_MAP).map(([k, v]) => (
              <div
                key={k}
                className="rounded-lg bg-white/5 border border-white/10 p-3"
              >
                <div className="font-bold text-white">{k}</div>
                <div className="text-white/50">{v}N friction</div>
              </div>
            ))}
          </div>
          <GlowButton data-ocid="force.play_button" onClick={startGame}>
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
            {lives > 0 ? "Physics Expert!" : "Game Over"}
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
          <GlowButton data-ocid="force.play_again_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const s = SCENARIOS[idx];
  const friction = FRICTION_MAP[s.friction];
  const arrowWidth = Math.min(100, (s.force / 60) * 100);
  const frictionWidth = Math.min(100, (friction / 60) * 100);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="text-[#00f5ff] font-bold">Score: {score}</div>
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
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            feedback.ok
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
              : "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
        <div className="flex items-center justify-between mb-4 text-sm text-white/60">
          <span>
            Surface:{" "}
            <strong className="text-white">{s.friction} Friction</strong>
          </span>
          <span>Question {idx + 1}</span>
        </div>

        {/* Physics scene */}
        <div className="relative h-32 rounded-xl bg-white/5 border border-white/10 mb-4 flex items-end overflow-hidden">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white/10 border-t border-white/20" />
          {/* Box */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-14 rounded border-2 border-[#00f5ff]/60 bg-[#00f5ff]/10 flex items-center justify-center">
            <span className="text-[#00f5ff] text-xs font-bold">BOX</span>
          </div>
          {/* Applied force arrow */}
          <div
            className="absolute bottom-14 left-4 flex items-center"
            style={{ width: `${arrowWidth}%`, maxWidth: "40%" }}
          >
            <div className="h-1 bg-[#10b981] flex-1 rounded" />
            <div
              className="w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "10px solid #10b981",
              }}
            />
          </div>
          <div className="absolute top-3 left-4 text-xs text-[#10b981]">
            {s.force}N Applied
          </div>
          {/* Friction arrow (opposing) */}
          <div
            className="absolute bottom-14 right-4 flex items-center"
            style={{ width: `${frictionWidth}%`, maxWidth: "40%" }}
          >
            <div
              className="w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "10px solid #f43f5e",
              }}
            />
            <div className="h-1 bg-[#f43f5e] flex-1 rounded" />
          </div>
          <div className="absolute top-3 right-4 text-xs text-[#f43f5e]">
            {friction}N Friction
          </div>
        </div>

        <p className="text-white font-semibold text-center mb-4">
          Does the box move?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            data-ocid="force.answer.yes"
            onClick={() => handleAnswer(true)}
            disabled={answered}
            className="py-4 rounded-xl border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981] font-bold text-lg hover:bg-[#10b981]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            YES — It Moves
          </button>
          <button
            type="button"
            data-ocid="force.answer.no"
            onClick={() => handleAnswer(false)}
            disabled={answered}
            className="py-4 rounded-xl border border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e] font-bold text-lg hover:bg-[#f43f5e]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            NO — Stays Still
          </button>
        </div>
      </div>
    </div>
  );
}
