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

const ORGANS = [
  "Heart",
  "Lungs",
  "Brain",
  "Liver",
  "Stomach",
  "Kidneys",
  "Intestines",
  "Bladder",
  "Pancreas",
  "Spleen",
];
const REGIONS = [
  "Head",
  "Chest",
  "Abdomen",
  "Lower Back",
  "Pelvis",
  "Left Side",
];
const CORRECT: Record<string, string> = {
  Heart: "Chest",
  Lungs: "Chest",
  Brain: "Head",
  Liver: "Abdomen",
  Stomach: "Abdomen",
  Kidneys: "Lower Back",
  Intestines: "Abdomen",
  Bladder: "Pelvis",
  Pancreas: "Abdomen",
  Spleen: "Left Side",
};

export default function OrganMatchGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [startTime, setStartTime] = useState(0);
  const { triggerShake, triggerParticle, triggerCombo } = useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    const elapsed = (Date.now() - startTime) / 1000;
    const total = correctCount + wrongCount;
    onGameEnd(
      buildResult(
        config,
        score,
        total > 0 ? (correctCount / total) * 100 : 0,
        elapsed,
        false,
      ),
    );
  }, [config, score, correctCount, wrongCount, startTime, onGameEnd]);

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(90, handleExpire);

  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setLives(3);
    setCorrectCount(0);
    setWrongCount(0);
    setMatched(new Set());
    setSelectedOrgan(null);
    setFeedback(null);
    setStartTime(Date.now());
    resetTimer();
    startTimer();
  };

  const handleOrganClick = (organ: string) => {
    if (phase !== "playing" || matched.has(organ)) return;
    setSelectedOrgan(organ);
  };

  const handleRegionClick = (region: string) => {
    if (phase !== "playing" || !selectedOrgan) return;
    const correct = CORRECT[selectedOrgan] === region;
    if (correct) {
      const newMatched = new Set(matched);
      newMatched.add(selectedOrgan);
      setMatched(newMatched);
      const newScore = score + 15;
      setScore(newScore);
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      triggerParticle(0, 0, "correct");
      if (newCorrect % 3 === 0) triggerCombo(newCorrect / 3);
      setFeedback({
        msg: `Correct! ${selectedOrgan} is in the ${region}.`,
        ok: true,
      });
      setSelectedOrgan(null);
      if (newMatched.size === ORGANS.length) {
        setPhase("over");
        const elapsed = (Date.now() - startTime) / 1000;
        onGameEnd(buildResult(config, newScore, 100, elapsed, true));
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setWrongCount((w) => w + 1);
      triggerShake();
      setFeedback({
        msg: `Wrong! ${selectedOrgan} belongs to ${CORRECT[selectedOrgan]}.`,
        ok: false,
      });
      setSelectedOrgan(null);
      if (newLives <= 0) {
        setPhase("over");
        const elapsed = (Date.now() - startTime) / 1000;
        const total = correctCount + wrongCount + 1;
        onGameEnd(
          buildResult(
            config,
            score,
            (correctCount / total) * 100,
            elapsed,
            false,
          ),
        );
      }
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
            Organ Match
          </h2>
          <p className="text-white/70 mb-6">
            Match each organ to its correct body region. Select an organ, then
            click its location.
          </p>
          <div className="flex gap-3 justify-center mb-6">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                type="button"
                data-ocid={`organ.difficulty.${d}`}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  config.difficulty === d
                    ? "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]"
                    : "border-white/20 bg-white/5 text-white/60 hover:border-white/40"
                }`}
              >
                {d === 1 ? "Easy" : d === 2 ? "Medium" : "Hard"}
              </button>
            ))}
          </div>
          <GlowButton data-ocid="organ.play_button" onClick={startGame}>
            Play Now
          </GlowButton>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    const total = correctCount + wrongCount;
    const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: lives > 0 ? "#10b981" : "#f43f5e" }}
          >
            {lives > 0 ? "Mission Complete!" : "Game Over"}
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
                {matched.size}/10
              </div>
              <div className="text-white/50 text-sm">Matched</div>
            </div>
          </div>
          <GlowButton data-ocid="organ.play_again_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* HUD */}
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
          className={`font-bold ${timeLeft <= 15 ? "text-[#f43f5e] animate-pulse" : "text-[#f59e0b]"}`}
        >
          {timeLeft}s
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        {/* Organs */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
            Organs
          </h3>
          <div className="flex flex-col gap-2">
            {ORGANS.map((organ) => (
              <button
                key={organ}
                type="button"
                data-ocid={`organ.organ.${organ.toLowerCase()}`}
                onClick={() => handleOrganClick(organ)}
                disabled={matched.has(organ)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  matched.has(organ)
                    ? "bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]/50 line-through"
                    : selectedOrgan === organ
                      ? "bg-[#00f5ff]/20 border border-[#00f5ff] text-[#00f5ff]"
                      : "bg-white/5 border border-white/10 text-white/80 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {organ}
              </button>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
            {selectedOrgan ? `Place: ${selectedOrgan}` : "Body Regions"}
          </h3>
          <div className="flex flex-col gap-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                data-ocid={`organ.region.${region.toLowerCase().replace(" ", "-")}`}
                onClick={() => handleRegionClick(region)}
                disabled={!selectedOrgan}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  !selectedOrgan
                    ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                    : "bg-white/5 border border-white/20 text-white/80 hover:border-[#00f5ff]/60 hover:bg-[#00f5ff]/10 cursor-pointer"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
          {selectedOrgan && (
            <p className="mt-3 text-xs text-[#00f5ff]/70">
              Select a region for <strong>{selectedOrgan}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="text-center text-white/40 text-xs">
        {matched.size}/10 organs matched
      </div>
    </div>
  );
}
