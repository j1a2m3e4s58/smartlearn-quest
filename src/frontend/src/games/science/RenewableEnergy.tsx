import { GlowButton } from "@/components/ui/GlowButton";
import { Minus, Plus, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Game 1: energy-grid (existing) ──────────────────────────────────────────
interface Period {
  name: string;
  demand: number;
  solarEffective: boolean;
}
interface EnergyConfig {
  solar: number;
  wind: number;
  hydro: number;
}
const PERIODS: Period[] = [
  { name: "Dawn", demand: 20, solarEffective: false },
  { name: "Morning", demand: 70, solarEffective: true },
  { name: "Afternoon", demand: 90, solarEffective: true },
  { name: "Evening", demand: 50, solarEffective: false },
  { name: "Night", demand: 30, solarEffective: false },
];
const STEP = 5;
const SOLAR_MAX = 50;
const WIND_MAX = 40;
const HYDRO_MAX = 30;
function calcSupply(cfg: EnergyConfig, period: Period): number {
  return (period.solarEffective ? cfg.solar : 0) + cfg.wind + cfg.hydro;
}
type GridPhase = "start" | "configure" | "summary";
interface PeriodResult {
  period: Period;
  supply: number;
  demand: number;
  pts: number;
  rating: string;
}

// ─── Game 2: energy-conversion ────────────────────────────────────────────────
interface ConversionChain {
  source: string;
  steps: string[];
  correctOrder: string[];
}
const CONVERSION_CHAINS: ConversionChain[] = [
  {
    source: "Coal Power Plant",
    steps: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy",
    ],
    correctOrder: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy",
    ],
  },
  {
    source: "Solar Panel",
    steps: ["Electrical Energy", "Light Energy"],
    correctOrder: ["Light Energy", "Electrical Energy"],
  },
  {
    source: "Wind Turbine",
    steps: ["Kinetic Energy", "Mechanical Energy", "Electrical Energy"],
    correctOrder: ["Kinetic Energy", "Mechanical Energy", "Electrical Energy"],
  },
  {
    source: "Hydroelectric Dam",
    steps: ["Electrical Energy", "Kinetic Energy", "Potential Energy"],
    correctOrder: ["Potential Energy", "Kinetic Energy", "Electrical Energy"],
  },
  {
    source: "Nuclear Reactor",
    steps: [
      "Electrical Energy",
      "Thermal Energy",
      "Nuclear Energy",
      "Mechanical Energy",
    ],
    correctOrder: [
      "Nuclear Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy",
    ],
  },
  {
    source: "Biomass Plant",
    steps: [
      "Electrical Energy",
      "Thermal Energy",
      "Chemical Energy",
      "Mechanical Energy",
    ],
    correctOrder: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy",
    ],
  },
  {
    source: "Geothermal Station",
    steps: ["Electrical Energy", "Thermal Energy", "Mechanical Energy"],
    correctOrder: ["Thermal Energy", "Mechanical Energy", "Electrical Energy"],
  },
  {
    source: "Tidal Generator",
    steps: [
      "Kinetic Energy",
      "Potential Energy",
      "Electrical Energy",
      "Mechanical Energy",
    ],
    correctOrder: [
      "Potential Energy",
      "Kinetic Energy",
      "Mechanical Energy",
      "Electrical Energy",
    ],
  },
  {
    source: "Gas Turbine",
    steps: [
      "Electrical Energy",
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
    ],
    correctOrder: [
      "Chemical Energy",
      "Thermal Energy",
      "Mechanical Energy",
      "Electrical Energy",
    ],
  },
  {
    source: "Photovoltaic Farm",
    steps: ["Electrical Energy", "Thermal Energy", "Light Energy"],
    correctOrder: ["Light Energy", "Thermal Energy", "Electrical Energy"],
  },
];

// ─── Game 3: efficiency-challenge ─────────────────────────────────────────────
interface EnergySource {
  name: string;
  costPerKWh: number;
  co2: number; // gCO2/kWh
  landUse: number; // m2/MW
  reliability: number; // 1-5
}
interface EfficiencyQuestion {
  question: string;
  answer: (sources: EnergySource[]) => string;
  explain: string;
}
const EFFICIENCY_QUESTIONS: EfficiencyQuestion[] = [
  {
    question: "Which source has the lowest CO2 emissions?",
    answer: (s) => s.reduce((a, b) => (a.co2 < b.co2 ? a : b)).name,
    explain: "Lowest gCO2/kWh means minimal climate impact.",
  },
  {
    question: "Which source is most expensive per kWh?",
    answer: (s) =>
      s.reduce((a, b) => (a.costPerKWh > b.costPerKWh ? a : b)).name,
    explain: "Highest cost/kWh represents the priciest electricity source.",
  },
  {
    question: "Which source uses the most land per MW?",
    answer: (s) => s.reduce((a, b) => (a.landUse > b.landUse ? a : b)).name,
    explain: "High land use limits where and how much can be deployed.",
  },
  {
    question: "Which source has the highest reliability score?",
    answer: (s) =>
      s.reduce((a, b) => (a.reliability > b.reliability ? a : b)).name,
    explain:
      "Higher reliability means consistent power output regardless of conditions.",
  },
  {
    question: "Best for a remote village with no grid connection?",
    answer: (s) =>
      s.reduce((a, b) => (a.reliability > b.reliability ? a : b)).name,
    explain:
      "Reliable, low-maintenance sources suit off-grid village deployments best.",
  },
];
const SOURCE_POOLS: EnergySource[][] = [
  [
    { name: "Coal", costPerKWh: 0.05, co2: 820, landUse: 10, reliability: 5 },
    { name: "Wind", costPerKWh: 0.04, co2: 11, landUse: 72, reliability: 3 },
    {
      name: "Solar PV",
      costPerKWh: 0.06,
      co2: 41,
      landUse: 64,
      reliability: 2,
    },
  ],
  [
    {
      name: "Natural Gas",
      costPerKWh: 0.07,
      co2: 490,
      landUse: 5,
      reliability: 5,
    },
    {
      name: "Hydropower",
      costPerKWh: 0.03,
      co2: 24,
      landUse: 150,
      reliability: 4,
    },
    { name: "Nuclear", costPerKWh: 0.1, co2: 12, landUse: 3, reliability: 5 },
  ],
  [
    {
      name: "Geothermal",
      costPerKWh: 0.08,
      co2: 38,
      landUse: 4,
      reliability: 5,
    },
    {
      name: "Biomass",
      costPerKWh: 0.11,
      co2: 230,
      landUse: 500,
      reliability: 4,
    },
    {
      name: "Offshore Wind",
      costPerKWh: 0.09,
      co2: 12,
      landUse: 5,
      reliability: 4,
    },
  ],
  [
    { name: "Coal", costPerKWh: 0.05, co2: 820, landUse: 10, reliability: 5 },
    {
      name: "Geothermal",
      costPerKWh: 0.08,
      co2: 38,
      landUse: 4,
      reliability: 5,
    },
    {
      name: "Solar CSP",
      costPerKWh: 0.14,
      co2: 22,
      landUse: 80,
      reliability: 3,
    },
  ],
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function RenewableEnergy({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // ── Game 1 state ──────────────────────────────────────────────────────
  const [gridPhase, setGridPhase] = useState<GridPhase>("start");
  const [periodIdx, setPeriodIdx] = useState(0);
  const [energy, setEnergy] = useState<EnergyConfig>({
    solar: 0,
    wind: 0,
    hydro: 0,
  });
  const [gridResults, setGridResults] = useState<PeriodResult[]>([]);
  const [deployed, setDeployed] = useState(false);
  const [deployFlash, setDeployFlash] = useState("");

  // ── Game 2 state ──────────────────────────────────────────────────────
  const [chainIdx, setChainIdx] = useState(0);
  const [playerChain, setPlayerChain] = useState<string[]>([]);
  const [convPhase, setConvPhase] = useState<"start" | "play" | "done">(
    "start",
  );
  const [convFeedback, setConvFeedback] = useState<
    "idle" | "correct" | "wrong"
  >("idle");
  const [chainScore, setChainScore] = useState(0);
  const [chainCorrect, setChainCorrect] = useState(0);

  // ── Game 3 state ──────────────────────────────────────────────────────
  const [effRound, setEffRound] = useState(0);
  const [effQIdx, setEffQIdx] = useState(0);
  const [effScore, setEffScore] = useState(0);
  const [effCorrect, setEffCorrect] = useState(0);
  const [effPhase, setEffPhase] = useState<"start" | "play" | "done">("start");
  const [effFeedback, setEffFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  const [score, setScore] = useState(0);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean, finalScore?: number) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const s = finalScore ?? scoreRef.current;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, 80, timeSpent, completed));
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  const period = PERIODS[periodIdx];
  const liveSupply = calcSupply(energy, period);
  const progressPct = (timeLeft / config.timeLimit) * 100;
  const timerBarStyle = { width: `${progressPct}%` };

  function supplyColor(supply: number, demand: number) {
    const d = Math.abs(supply - demand);
    if (d <= 10) return "#10b981";
    if (d <= 20) return "#f59e0b";
    return "#f43f5e";
  }

  const supplyBarWidth = Math.min(100, (liveSupply / 100) * 100);
  const demandBarWidth = Math.min(100, (period.demand / 100) * 100);
  const supplyBarStyle = {
    width: `${supplyBarWidth}%`,
    background: supplyColor(liveSupply, period.demand),
  };
  const demandBarStyle = { width: `${demandBarWidth}%` };
  const flashColor =
    deployFlash === "Perfect Match"
      ? "#10b981"
      : deployFlash === "Good Match"
        ? "#f59e0b"
        : "#f43f5e";

  // Game 1 handlers
  function handleGridStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGridPhase("configure");
    startTimer();
  }
  function adjust(src: keyof EnergyConfig, dir: 1 | -1) {
    setEnergy((prev) => {
      const max =
        src === "solar" ? SOLAR_MAX : src === "wind" ? WIND_MAX : HYDRO_MAX;
      const next = prev[src] + dir * STEP;
      return { ...prev, [src]: Math.min(max, Math.max(0, next)) };
    });
  }
  function handleDeploy() {
    if (deployed) return;
    setDeployed(true);
    const p = PERIODS[periodIdx];
    const supply = calcSupply(energy, p);
    const diff = Math.abs(supply - p.demand);
    let pts = 0;
    let rating = "";
    if (diff <= 10) {
      pts = 100 * config.difficulty;
      rating = "Perfect Match";
    } else if (diff <= 20) {
      pts = 60 * config.difficulty;
      rating = "Good Match";
    } else {
      pts = Math.max(0, 20 * config.difficulty - diff);
      rating = "Off Target";
    }
    setGridResults((prev) => [
      ...prev,
      { period: p, supply, demand: p.demand, pts, rating },
    ]);
    setScore((s) => s + pts);
    setDeployFlash(rating);
    setTimeout(() => {
      setDeployFlash("");
      setDeployed(false);
      const nextIdx = periodIdx + 1;
      if (nextIdx >= PERIODS.length) setGridPhase("summary");
      else {
        setPeriodIdx(nextIdx);
        setEnergy({ solar: 0, wind: 0, hydro: 0 });
      }
    }, 1600);
  }

  // Game 2 handlers
  const currentChain = CONVERSION_CHAINS[chainIdx % CONVERSION_CHAINS.length];
  const shuffledSteps = [...currentChain.steps];
  function convStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setConvPhase("play");
    setPlayerChain([]);
    startTimer();
  }
  function selectStep(step: string) {
    if (convFeedback !== "idle") return;
    if (playerChain.includes(step)) {
      setPlayerChain((p) => p.filter((s) => s !== step));
      return;
    }
    const next = [...playerChain, step];
    setPlayerChain(next);
    if (next.length === currentChain.correctOrder.length) {
      const correct = next.every((s, i) => s === currentChain.correctOrder[i]);
      const pts = correct ? 150 * config.difficulty : 20;
      setChainScore((s) => s + pts);
      setScore((s) => s + pts);
      if (correct) setChainCorrect((c) => c + 1);
      setConvFeedback(correct ? "correct" : "wrong");
      setTimeout(() => {
        setConvFeedback("idle");
        setPlayerChain([]);
        const nextIdx = chainIdx + 1;
        if (nextIdx >= 10) {
          setConvPhase("done");
          endGame(true);
        } else {
          setChainIdx(nextIdx);
        }
      }, 1500);
    }
  }

  // Game 3 handlers
  const effSources = SOURCE_POOLS[effRound % SOURCE_POOLS.length];
  const effQuestion = EFFICIENCY_QUESTIONS[effQIdx];
  function effStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setEffPhase("play");
    startTimer();
  }
  function handleEffAnswer(sourceName: string) {
    if (effFeedback) return;
    const correct = sourceName === effQuestion.answer(effSources);
    const pts = correct ? 120 * config.difficulty : 0;
    setEffScore((s) => s + pts);
    setScore((s) => s + pts);
    if (correct) setEffCorrect((c) => c + 1);
    setEffFeedback({
      ok: correct,
      msg: correct
        ? `Correct! ${effQuestion.explain} +${pts} pts`
        : `Incorrect. ${effQuestion.explain}`,
    });
    setTimeout(() => {
      setEffFeedback(null);
      const nextQ = effQIdx + 1;
      if (nextQ >= EFFICIENCY_QUESTIONS.length) {
        const nextRound = effRound + 1;
        if (nextRound >= SOURCE_POOLS.length) {
          setEffPhase("done");
          endGame(true);
        } else {
          setEffRound(nextRound);
          setEffQIdx(0);
        }
      } else {
        setEffQIdx(nextQ);
      }
    }, 2000);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  if (gameId === "energy-conversion") {
    return (
      <div
        className="w-full h-full flex flex-col gap-2 select-none"
        data-ocid="energy_conversion.page"
      >
        <div className="game-hud flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2" style={{ color: "#06b6d4" }}>
            <Zap className="h-4 w-4" />
            <span className="font-bold text-lg">
              {chainScore.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {chainIdx + 1}/10 chains | {chainCorrect} correct
          </span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full xp-fill transition-all duration-1000"
                style={timerBarStyle}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {timeLeft}s
            </span>
          </div>
        </div>

        {convPhase === "start" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
              <Zap
                className="h-14 w-14 mx-auto mb-4"
                style={{ color: "#06b6d4" }}
              />
              <h2
                className="text-3xl font-black mb-3"
                style={{
                  fontFamily: "'Orbitron',sans-serif",
                  color: "#06b6d4",
                  textShadow: "0 0 20px rgba(6,182,212,0.6)",
                }}
              >
                Energy Conversion
              </h2>
              <p className="text-muted-foreground mb-2 text-sm">
                Trace how energy transforms through 10 different power sources.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Click the conversion steps in the correct order for each source.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={convStart}
                data-ocid="energy_conversion.start_button"
              >
                Start Tracing
              </GlowButton>
            </div>
          </motion.div>
        )}

        {convPhase === "play" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="glass-card rounded-xl p-4 border border-border/30">
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Energy Source
              </p>
              <p className="text-lg font-black" style={{ color: "#06b6d4" }}>
                {currentChain.source}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click the energy types in the correct conversion order (
                {currentChain.correctOrder.length} steps)
              </p>
            </div>

            <div className="glass-card rounded-xl p-4 border border-border/30">
              <p className="text-xs text-muted-foreground mb-2">Your chain:</p>
              <div className="flex flex-wrap gap-2 min-h-8">
                {playerChain.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-muted-foreground text-sm">→</span>
                    )}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "#06b6d420",
                        color: "#06b6d4",
                        border: "1px solid #06b6d4",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
                {playerChain.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    Click steps below to build the chain...
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {shuffledSteps.map((step, i) => {
                const selected = playerChain.includes(step);
                const btnStyle = selected
                  ? {
                      borderColor: "#06b6d4",
                      background: "#06b6d420",
                      color: "#06b6d4",
                    }
                  : {};
                return (
                  <button
                    key={i}
                    type="button"
                    className="px-3 py-3 rounded-xl border border-border/40 text-sm font-semibold transition-all hover:border-[#06b6d4]/60 text-foreground"
                    style={btnStyle}
                    onClick={() => selectStep(step)}
                    disabled={convFeedback !== "idle" || selected}
                    data-ocid={`energy_conversion.step.${i + 1}`}
                  >
                    {step}
                  </button>
                );
              })}
            </div>

            {convFeedback !== "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-3 text-center font-bold text-sm"
                style={{
                  color: convFeedback === "correct" ? "#10b981" : "#f43f5e",
                  background:
                    convFeedback === "correct" ? "#10b98115" : "#f43f5e15",
                  border: `1px solid ${convFeedback === "correct" ? "#10b981" : "#f43f5e"}`,
                }}
              >
                {convFeedback === "correct"
                  ? `Correct chain! +${150 * config.difficulty} pts`
                  : `Wrong order. Correct: ${currentChain.correctOrder.join(" → ")}`}
              </motion.div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (gameId === "efficiency-challenge") {
    return (
      <div
        className="w-full h-full flex flex-col gap-2 select-none"
        data-ocid="efficiency_challenge.page"
      >
        <div className="game-hud flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
            <Zap className="h-4 w-4" />
            <span className="font-bold text-lg">
              {effScore.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Round {effRound + 1}/4 | Q{effQIdx + 1}/
            {EFFICIENCY_QUESTIONS.length} | {effCorrect} correct
          </span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full xp-fill transition-all duration-1000"
                style={timerBarStyle}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {timeLeft}s
            </span>
          </div>
        </div>

        {effPhase === "start" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
              <Zap
                className="h-14 w-14 mx-auto mb-4"
                style={{ color: "#10b981" }}
              />
              <h2
                className="text-3xl font-black mb-3"
                style={{
                  fontFamily: "'Orbitron',sans-serif",
                  color: "#10b981",
                  textShadow: "0 0 20px rgba(16,185,129,0.6)",
                }}
              >
                Efficiency Challenge
              </h2>
              <p className="text-muted-foreground mb-2 text-sm">
                Compare 3 energy sources across 4 rounds and answer 5 decision
                questions each round.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Analyse cost, emissions, land use and reliability to pick the
                best answer.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={effStart}
                data-ocid="efficiency_challenge.start_button"
              >
                Start Analysis
              </GlowButton>
            </div>
          </motion.div>
        )}

        {effPhase === "play" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {effSources.map((src, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-3 border border-border/30"
                >
                  <p
                    className="text-xs font-black text-center mb-2"
                    style={{ color: "#10b981" }}
                  >
                    {src.name}
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost/kWh</span>
                      <span className="font-mono text-foreground">
                        ${src.costPerKWh.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO2 (g/kWh)</span>
                      <span className="font-mono text-foreground">
                        {src.co2}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Land (m²/MW)
                      </span>
                      <span className="font-mono text-foreground">
                        {src.landUse}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reliability</span>
                      <span className="font-mono text-foreground">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span
                            key={j}
                            style={{
                              color:
                                j < src.reliability ? "#f59e0b" : "#374151",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-4 border border-[#10b981]/30">
              <p
                className="text-xs uppercase tracking-widest text-[#10b981] mb-2"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Question {effQIdx + 1} of {EFFICIENCY_QUESTIONS.length}
              </p>
              <p className="text-sm font-bold text-foreground">
                {effQuestion.question}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {effSources.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#10b981]/60 text-foreground font-semibold disabled:opacity-50"
                  onClick={() => handleEffAnswer(src.name)}
                  disabled={!!effFeedback}
                  data-ocid={`efficiency_challenge.answer.${i + 1}`}
                >
                  {src.name}
                </button>
              ))}
            </div>

            {effFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-3 text-sm font-medium"
                style={{
                  color: effFeedback.ok ? "#10b981" : "#f43f5e",
                  background: effFeedback.ok ? "#10b98115" : "#f43f5e15",
                  border: `1px solid ${effFeedback.ok ? "#10b981" : "#f43f5e"}`,
                }}
              >
                {effFeedback.msg}
              </motion.div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Default: energy-grid ────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="renewable_energy.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Zap className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        {gridPhase === "configure" && (
          <span className="text-xs text-muted-foreground">
            Period {periodIdx + 1}/{PERIODS.length}
          </span>
        )}
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={timerBarStyle}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {timeLeft}s
          </span>
        </div>
      </div>

      {gridPhase === "start" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
            <Zap
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#f59e0b" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#f59e0b",
                textShadow: "0 0 20px rgba(245,158,11,0.6)",
              }}
            >
              Grid Engineer
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Balance solar, wind and hydro power output to match demand across
              5 time periods.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Solar only works in Morning and Afternoon. Within 10 units =
              Perfect. Within 20 = Good.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleGridStart}
              data-ocid="renewable_energy.start_button"
            >
              Power the Grid
            </GlowButton>
          </div>
        </motion.div>
      )}

      {gridPhase === "configure" && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={periodIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-3"
            >
              <div className="glass-card rounded-xl p-4 border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3
                      className="text-lg font-black"
                      style={{ color: "#00f5ff" }}
                    >
                      {period.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {period.solarEffective
                        ? "Solar active"
                        : "Solar inactive (no sunlight)"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Demand</p>
                    <p
                      className="text-2xl font-black"
                      style={{ color: "#f43f5e" }}
                    >
                      {period.demand} <span className="text-sm">MW</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Supply: {liveSupply} MW</span>
                      <span
                        style={{
                          color: supplyColor(liveSupply, period.demand),
                        }}
                      >
                        {liveSupply > period.demand ? "+" : ""}
                        {liveSupply - period.demand} MW
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={supplyBarStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Demand</span>
                      <span>{period.demand} MW</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#f43f5e]/60"
                        style={demandBarStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {[
                {
                  key: "solar" as const,
                  label: "Solar Panels",
                  max: SOLAR_MAX,
                  active: period.solarEffective,
                  color: "#f59e0b",
                },
                {
                  key: "wind" as const,
                  label: "Wind Turbines",
                  max: WIND_MAX,
                  active: true,
                  color: "#06b6d4",
                },
                {
                  key: "hydro" as const,
                  label: "Hydro Dam",
                  max: HYDRO_MAX,
                  active: true,
                  color: "#3b82f6",
                },
              ].map((src) => {
                const fillPct = (energy[src.key] / src.max) * 100;
                const fillStyle = {
                  width: `${fillPct}%`,
                  background: src.active ? src.color : "#444",
                };
                return (
                  <div
                    key={src.key}
                    className="glass-card rounded-xl p-4 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: src.active ? src.color : "#666" }}
                      >
                        {src.label}
                      </span>
                      {!src.active && (
                        <span className="text-xs text-muted-foreground">
                          (offline)
                        </span>
                      )}
                      <span
                        className="text-sm font-black tabular-nums"
                        style={{ color: src.color }}
                      >
                        {energy[src.key]} MW
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={fillStyle}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-border/40 flex items-center justify-center hover:border-[#f43f5e] hover:bg-[#f43f5e]/10 transition-all"
                        onClick={() => adjust(src.key, -1)}
                        disabled={!src.active || energy[src.key] <= 0}
                        data-ocid={`renewable_energy.${src.key}_minus`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Max {src.max} MW / Step {STEP} MW
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-border/40 flex items-center justify-center hover:border-[#10b981] hover:bg-[#10b981]/10 transition-all"
                        onClick={() => adjust(src.key, 1)}
                        disabled={!src.active || energy[src.key] >= src.max}
                        data-ocid={`renewable_energy.${src.key}_plus`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {deployFlash ? (
                <div
                  className="rounded-xl px-4 py-3 text-center font-bold text-sm"
                  style={{
                    color: flashColor,
                    border: `2px solid ${flashColor}`,
                    background: `${flashColor}15`,
                  }}
                >
                  {deployFlash}
                </div>
              ) : (
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={handleDeploy}
                  data-ocid="renewable_energy.deploy_button"
                >
                  Deploy to Grid
                </GlowButton>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {gridPhase === "summary" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col gap-3 overflow-auto"
        >
          <h3
            className="text-center font-black text-xl"
            style={{ color: "#f59e0b", fontFamily: "'Orbitron',sans-serif" }}
          >
            Grid Report
          </h3>
          {gridResults.map((r, i) => {
            const ratingColor =
              r.rating === "Perfect Match"
                ? "#10b981"
                : r.rating === "Good Match"
                  ? "#f59e0b"
                  : "#f43f5e";
            return (
              <div
                key={r.period.name}
                className="glass-card rounded-xl p-4 border border-border/30"
                data-ocid={`renewable_energy.result.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">
                    {r.period.name}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: ratingColor }}
                  >
                    {r.rating}
                  </span>
                  <span
                    className="text-sm font-black tabular-nums"
                    style={{ color: "#f59e0b" }}
                  >
                    +{r.pts}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supply {r.supply} MW vs Demand {r.demand} MW (diff:{" "}
                  {Math.abs(r.supply - r.demand)} MW)
                </p>
              </div>
            );
          })}
          <div className="glass-card rounded-xl p-4 text-center border border-[#f59e0b]/40">
            <p className="text-2xl font-black" style={{ color: "#f59e0b" }}>
              {score.toLocaleString()} pts
            </p>
            <p className="text-xs text-muted-foreground mt-1">Final Score</p>
          </div>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => endGame(true)}
            data-ocid="renewable_energy.finish_button"
          >
            Finish
          </GlowButton>
        </motion.div>
      )}
    </div>
  );
}
