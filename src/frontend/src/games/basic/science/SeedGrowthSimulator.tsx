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
type SoilType = "Sandy" | "Loamy" | "Clay";

const QUESTIONS = [
  "What does the plant need more of right now to grow better?",
  "Which condition is limiting the plant growth the most?",
  "What single change would increase plant health the most?",
  "What is currently harming the plant growth?",
  "Which factor is closest to its ideal range?",
  "What would help the plant reach maximum health?",
  "Which resource is being wasted right now?",
  "What is the biggest weakness in the current conditions?",
  "Which single adjustment would have the greatest positive impact?",
  "What does this plant need to survive better?",
];

type FactorType =
  | "Water"
  | "Sunlight"
  | "Better Soil"
  | "Nothing (already optimal)";

function calcScores(water: number, sunlight: number, soil: SoilType) {
  const waterScore =
    water >= 60 && water <= 80
      ? 33
      : water < 60
        ? (water / 60) * 33
        : ((100 - water) / 20) * 33;
  const sunScore =
    sunlight >= 70 && sunlight <= 90
      ? 33
      : sunlight < 70
        ? (sunlight / 70) * 33
        : ((100 - sunlight) / 10) * 33;
  const soilScore = soil === "Loamy" ? 34 : soil === "Sandy" ? 17 : 20;
  return {
    waterScore: Math.max(0, Math.round(waterScore)),
    sunScore: Math.max(0, Math.round(sunScore)),
    soilScore,
    total: Math.max(
      0,
      Math.min(100, Math.round(waterScore + sunScore + soilScore)),
    ),
  };
}

function getCorrectAnswer(
  water: number,
  sunlight: number,
  soil: SoilType,
  qIdx: number,
): FactorType {
  const { waterScore, sunScore, soilScore, total } = calcScores(
    water,
    sunlight,
    soil,
  );
  if (total > 80) return "Nothing (already optimal)";
  // For odd questions, ask about the weakest; for even, also consider context
  const min = Math.min(waterScore, sunScore, soilScore);
  if (min === soilScore && soil !== "Loamy")
    return qIdx % 3 === 2
      ? "Better Soil"
      : waterScore <= sunScore
        ? "Water"
        : "Better Soil";
  if (min === waterScore) return "Water";
  if (min === sunScore) return "Sunlight";
  return "Better Soil";
}

const PLANT_STAGES = [
  { minHealth: 0, label: "Seed", color: "#a0522d", stemH: 4 },
  { minHealth: 20, label: "Sprout", color: "#6abf69", stemH: 20 },
  { minHealth: 40, label: "Seedling", color: "#4caf50", stemH: 40 },
  { minHealth: 60, label: "Young Plant", color: "#2e7d32", stemH: 60 },
  { minHealth: 80, label: "Mature Plant", color: "#1b5e20", stemH: 80 },
];

export default function SeedGrowthSimulator({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [water, setWater] = useState(40);
  const [sunlight, setSunlight] = useState(30);
  const [soil, setSoil] = useState<SoilType>("Sandy");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { triggerShake, triggerParticle, triggerCombo } = useGameFeel();

  const scores = useMemo(
    () => calcScores(water, sunlight, soil),
    [water, sunlight, soil],
  );

  const plantStage = PLANT_STAGES.reduce(
    (acc, s) => (scores.total >= s.minHealth ? s : acc),
    PLANT_STAGES[0],
  );

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
    setQIdx(0);
    setCorrect(0);
    setWrong(0);
    setWater(40);
    setSunlight(30);
    setSoil("Sandy");
    setFeedback(null);
    setAnswered(false);
    setStartTime(Date.now());
    resetTimer();
    startTimer();
  };

  const handleAnswer = (choice: FactorType) => {
    if (answered || phase !== "playing") return;
    setAnswered(true);
    const correctAns = getCorrectAnswer(water, sunlight, soil, qIdx);
    const isCorrect = choice === correctAns;
    if (isCorrect) {
      const ns = score + 10;
      const nc = correct + 1;
      setScore(ns);
      setCorrect(nc);
      triggerParticle(0, 0, "correct");
      if (nc % 3 === 0) triggerCombo(nc / 3);
      setFeedback({
        msg: `Correct! ${correctAns} is most needed. Adjust the controls to help the plant grow!`,
        ok: true,
      });
      // Adjust controls toward ideal
      if (correctAns === "Water") setWater((w) => Math.min(80, w + 20));
      if (correctAns === "Sunlight") setSunlight((s) => Math.min(90, s + 20));
      if (correctAns === "Better Soil") setSoil("Loamy");
      if (qIdx + 1 >= QUESTIONS.length) {
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
        msg: `Wrong! The plant needs ${correctAns} the most right now.`,
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
      setQIdx((i) => (i + 1) % QUESTIONS.length);
      // Slightly adjust conditions to keep questions varied
      setWater((w) =>
        Math.max(10, Math.min(90, w + (Math.random() > 0.5 ? -15 : 10))),
      );
      setSunlight((s) =>
        Math.max(10, Math.min(95, s + (Math.random() > 0.5 ? -10 : 15))),
      );
    }, 1500);
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-[#10b981] mb-3">
            Seed Growth Simulator
          </h2>
          <p className="text-white/70 mb-4">
            Control water, sunlight, and soil type to grow a plant. Answer
            questions about what the plant needs most to score points!
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            <div className="rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 p-3">
              <div className="font-bold text-[#3b82f6]">Water</div>
              <div className="text-white/50 text-xs">60-80% optimal</div>
            </div>
            <div className="rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30 p-3">
              <div className="font-bold text-[#f59e0b]">Sunlight</div>
              <div className="text-white/50 text-xs">70-90% optimal</div>
            </div>
            <div className="rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 p-3">
              <div className="font-bold text-[#10b981]">Soil</div>
              <div className="text-white/50 text-xs">Loamy is best</div>
            </div>
          </div>
          <GlowButton data-ocid="seed.play_button" onClick={startGame}>
            Start Growing
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
            {lives > 0 ? "Master Botanist!" : "Game Over"}
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
                {plantStage.label}
              </div>
              <div className="text-white/50 text-sm">Plant Stage</div>
            </div>
          </div>
          <GlowButton data-ocid="seed.play_again_button" onClick={startGame}>
            Grow Again
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
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

      <div className="grid grid-cols-3 gap-3">
        {/* Plant visualizer */}
        <div
          className="col-span-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 flex flex-col items-center justify-end"
          style={{ minHeight: 180 }}
        >
          <div className="text-xs text-white/40 mb-2">
            Health: {scores.total}%
          </div>
          {/* Plant visual */}
          <div
            className="relative flex flex-col items-center justify-end"
            style={{ height: 120, width: 60 }}
          >
            {/* Soil */}
            <div className="absolute bottom-0 left-0 right-0 h-6 rounded bg-[#a0522d]/40 border border-[#a0522d]/30" />
            {/* Stem */}
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-green-600 transition-all duration-500"
              style={{
                width: 4,
                height: Math.max(4, (plantStage.stemH / 100) * 80),
              }}
            />
            {/* Leaves */}
            {scores.total > 30 && (
              <>
                <div
                  className="absolute rounded-full opacity-80"
                  style={{
                    bottom: 20 + (plantStage.stemH / 100) * 30,
                    left: 8,
                    width: 20,
                    height: 12,
                    background: plantStage.color,
                    transform: "rotate(-30deg)",
                  }}
                />
                <div
                  className="absolute rounded-full opacity-80"
                  style={{
                    bottom: 20 + (plantStage.stemH / 100) * 30,
                    right: 8,
                    width: 20,
                    height: 12,
                    background: plantStage.color,
                    transform: "rotate(30deg)",
                  }}
                />
              </>
            )}
            {scores.total > 60 && (
              <div
                className="absolute rounded-full"
                style={{
                  bottom: 20 + (plantStage.stemH / 100) * 70,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 28,
                  background: plantStage.color,
                }}
              />
            )}
          </div>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: plantStage.color }}
          >
            {plantStage.label}
          </div>
        </div>

        {/* Controls */}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 flex flex-col gap-3">
          {/* Water slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#3b82f6]">Water</span>
              <span className="text-white/50">{water}%</span>
            </div>
            <input
              data-ocid="seed.water_input"
              type="range"
              min={0}
              max={100}
              value={water}
              onChange={(e) => setWater(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
              style={{ accentColor: "#3b82f6" }}
            />
            <div className="text-xs text-white/30 mt-0.5">
              {water < 60 ? "Too dry" : water > 80 ? "Overwatered" : "Optimal"}
            </div>
          </div>
          {/* Sunlight slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#f59e0b]">Sunlight</span>
              <span className="text-white/50">{sunlight}%</span>
            </div>
            <input
              data-ocid="seed.sunlight_input"
              type="range"
              min={0}
              max={100}
              value={sunlight}
              onChange={(e) => setSunlight(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
              style={{ accentColor: "#f59e0b" }}
            />
            <div className="text-xs text-white/30 mt-0.5">
              {sunlight < 70
                ? "Too dark"
                : sunlight > 90
                  ? "Too much sun"
                  : "Optimal"}
            </div>
          </div>
          {/* Soil selector */}
          <div>
            <div className="text-xs text-[#10b981] mb-1">Soil Type</div>
            <div className="flex gap-2">
              {(["Sandy", "Loamy", "Clay"] as SoilType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  data-ocid={`seed.soil.${s.toLowerCase()}`}
                  onClick={() => setSoil(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    soil === s
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {/* Score bars */}
          <div className="flex gap-2 text-xs">
            <div className="flex-1">
              <div className="text-[#3b82f6] mb-0.5">
                W: {scores.waterScore}
              </div>
              <div className="h-1 rounded bg-white/10">
                <div
                  className="h-full rounded bg-[#3b82f6]"
                  style={{ width: `${(scores.waterScore / 33) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[#f59e0b] mb-0.5">S: {scores.sunScore}</div>
              <div className="h-1 rounded bg-white/10">
                <div
                  className="h-full rounded bg-[#f59e0b]"
                  style={{ width: `${(scores.sunScore / 33) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[#10b981] mb-0.5">
                Soil: {scores.soilScore}
              </div>
              <div className="h-1 rounded bg-white/10">
                <div
                  className="h-full rounded bg-[#10b981]"
                  style={{ width: `${(scores.soilScore / 34) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <p className="text-white font-medium text-sm mb-3">
          {QUESTIONS[qIdx % QUESTIONS.length]}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              "Water",
              "Sunlight",
              "Better Soil",
              "Nothing (already optimal)",
            ] as FactorType[]
          ).map((f, i) => (
            <button
              key={f}
              type="button"
              data-ocid={`seed.answer.${i + 1}`}
              onClick={() => handleAnswer(f)}
              disabled={answered}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                answered
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] cursor-pointer"
              } ${
                f === "Water"
                  ? "border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]"
                  : f === "Sunlight"
                    ? "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]"
                    : f === "Better Soil"
                      ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                      : "border-white/20 bg-white/5 text-white/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
