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

type Machine =
  | "Lever"
  | "Pulley"
  | "Inclined Plane"
  | "Screw"
  | "Wedge"
  | "Wheel and Axle";

const MACHINES: Machine[] = [
  "Lever",
  "Pulley",
  "Inclined Plane",
  "Screw",
  "Wedge",
  "Wheel and Axle",
];

const MACHINE_DESC: Record<Machine, string> = {
  Lever: "A rigid bar pivoting on a fulcrum to multiply force",
  Pulley: "A wheel with rope to redirect or multiply force",
  "Inclined Plane": "A flat surface at an angle to reduce lifting effort",
  Screw:
    "An inclined plane wrapped in a helix to convert rotation to linear force",
  Wedge: "Two inclined planes joined to split or separate objects",
  "Wheel and Axle": "A wheel attached to a rod to transfer rotational force",
};

const MACHINE_COLORS: Record<Machine, string> = {
  Lever: "#00f5ff",
  Pulley: "#10b981",
  "Inclined Plane": "#f59e0b",
  Screw: "#f43f5e",
  Wedge: "#a855f7",
  "Wheel and Axle": "#3b82f6",
};

const SCENARIOS: { scenario: string; answer: Machine }[] = [
  {
    scenario: "You need to lift a heavy rock off the ground.",
    answer: "Lever",
  },
  {
    scenario: "You need to lift a bucket of water from a deep well.",
    answer: "Pulley",
  },
  {
    scenario: "You need to roll a heavy barrel up onto a truck.",
    answer: "Inclined Plane",
  },
  {
    scenario: "You need to tighten a bolt deep into a wooden plank.",
    answer: "Screw",
  },
  {
    scenario: "You need to split a large log cleanly in two.",
    answer: "Wedge",
  },
  {
    scenario:
      "You need to move heavy furniture across a room with less effort.",
    answer: "Wheel and Axle",
  },
  {
    scenario:
      "A wheelchair ramp allows easier entry to a building. This is an example of which machine?",
    answer: "Inclined Plane",
  },
  {
    scenario: "Scissors are a combination of two of which simple machine?",
    answer: "Wedge",
  },
  {
    scenario: "A drill bit spinning into material uses which simple machine?",
    answer: "Screw",
  },
  {
    scenario:
      "A flagpole raising system uses a rope and wheel mechanism. Which machine is this?",
    answer: "Pulley",
  },
];

export default function SimpleMachinesChallenge({ config, onGameEnd }: Props) {
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

  const handleAnswer = (machine: Machine) => {
    if (answered || phase !== "playing") return;
    setAnswered(true);
    const q = SCENARIOS[idx];
    const isCorrect = machine === q.answer;
    if (isCorrect) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      triggerParticle(0, 0, "correct");
      if (nc % 3 === 0) triggerCombo(nc / 3);
      setFeedback({
        msg: `Correct! A ${q.answer} is perfect for this task. ${MACHINE_DESC[q.answer]}.`,
        ok: true,
      });
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
      setFeedback({
        msg: `Wrong! The answer is ${q.answer}. ${MACHINE_DESC[q.answer]}.`,
        ok: false,
      });
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
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full">
          <h2 className="text-3xl font-bold text-[#f59e0b] mb-3 text-center">
            Simple Machines
          </h2>
          <p className="text-white/70 mb-5 text-center">
            Match each real-world scenario to the correct simple machine. 10
            engineering challenges.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {MACHINES.map((m) => (
              <div
                key={m}
                className="rounded-xl bg-white/5 border p-3 text-center"
                style={{ borderColor: `${MACHINE_COLORS[m]}40` }}
              >
                <div
                  className="font-bold text-sm"
                  style={{ color: MACHINE_COLORS[m] }}
                >
                  {m}
                </div>
                <div className="text-xs text-white/40 mt-1 leading-tight">
                  {MACHINE_DESC[m].slice(0, 30)}...
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <GlowButton data-ocid="machines.play_button" onClick={startGame}>
              Play Now
            </GlowButton>
          </div>
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
            {lives > 0 ? "Engineering Master!" : "Game Over"}
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
          <GlowButton
            data-ocid="machines.play_again_button"
            onClick={startGame}
          >
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  const q = SCENARIOS[idx];
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
          className={`rounded-lg px-4 py-2 text-sm ${
            feedback.ok
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
              : "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-5">
          <p className="text-white text-base font-medium leading-relaxed">
            {q.scenario}
          </p>
        </div>
        <p className="text-white/50 text-sm mb-3">
          Which simple machine would you use?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {MACHINES.map((m) => (
            <button
              key={m}
              type="button"
              data-ocid={`machines.choice.${m.toLowerCase().replace(/[^a-z]/g, "-")}`}
              onClick={() => handleAnswer(m)}
              disabled={answered}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left ${
                answered
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] cursor-pointer"
              }`}
              style={{
                borderColor: `${MACHINE_COLORS[m]}40`,
                color: MACHINE_COLORS[m],
                background: `${MACHINE_COLORS[m]}10`,
              }}
            >
              <div>{m}</div>
              <div
                className="text-xs font-normal mt-0.5"
                style={{ color: `${MACHINE_COLORS[m]}aa` }}
              >
                {MACHINE_DESC[m].slice(0, 35)}...
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
