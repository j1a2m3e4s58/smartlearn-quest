import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Factory, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

// ─── Game 1: Factory Controller ─────────────────────────────────────────────

type StationStatus = "idle" | "active" | "jammed" | "complete";

interface Station {
  id: number;
  label: string;
  operation: string;
  color: string;
}
interface ProductionChallenge {
  title: string;
  description: string;
  stations: Station[];
  correctSequence: number[];
  explanation: string;
  hasQualityGate?: boolean;
  qualityGateStation?: number;
}

const FACTORY_CHALLENGES: Record<1 | 2 | 3, ProductionChallenge[]> = {
  1: [
    {
      title: "Car Assembly Line",
      description:
        "Activate stations in the correct order to assemble a vehicle. Wrong order causes a jam.",
      stations: [
        {
          id: 1,
          label: "Chassis Weld",
          operation: "Weld frame components",
          color: "#00f5ff",
        },
        {
          id: 2,
          label: "Engine Mount",
          operation: "Install engine block",
          color: "#7c3aed",
        },
        {
          id: 3,
          label: "Electrical",
          operation: "Wire electronics",
          color: "#f59e0b",
        },
        {
          id: 4,
          label: "Body Panel",
          operation: "Attach body panels",
          color: "#10b981",
        },
        {
          id: 5,
          label: "Final QC",
          operation: "Quality inspection",
          color: "#f43f5e",
        },
      ],
      correctSequence: [1, 2, 3, 4, 5],
      explanation:
        "Chassis first, then engine, then electrical (needs engine mount), then body panels, finally QC.",
    },
  ],
  2: [
    {
      title: "Electronics PCB Line",
      description:
        "PCB manufacturing requires precise station order. Solder before placing components = defects.",
      stations: [
        {
          id: 1,
          label: "Bare Board Prep",
          operation: "Clean and inspect PCB",
          color: "#00f5ff",
        },
        {
          id: 2,
          label: "Solder Paste",
          operation: "Apply solder paste via stencil",
          color: "#f59e0b",
        },
        {
          id: 3,
          label: "Component Place",
          operation: "SMT pick and place",
          color: "#7c3aed",
        },
        {
          id: 4,
          label: "Reflow Oven",
          operation: "Melt solder at 260C",
          color: "#f43f5e",
        },
        {
          id: 5,
          label: "AOI Inspection",
          operation: "Automated optical check",
          color: "#10b981",
        },
      ],
      correctSequence: [1, 2, 3, 4, 5],
      hasQualityGate: true,
      qualityGateStation: 5,
      explanation:
        "Clean board, apply paste, place components, reflow (melt solder), AOI checks for defects.",
    },
  ],
  3: [
    {
      title: "Smart Device Assembly",
      description:
        "Complex assembly with quality gates. Station 3 is a QC gate.",
      stations: [
        {
          id: 1,
          label: "Housing Mold",
          operation: "Injection mold casing",
          color: "#00f5ff",
        },
        {
          id: 2,
          label: "Battery Insert",
          operation: "Place and test battery",
          color: "#7c3aed",
        },
        {
          id: 3,
          label: "QC Gate 1",
          operation: "Electrical test — fail = reject",
          color: "#f43f5e",
        },
        {
          id: 4,
          label: "PCB Assembly",
          operation: "Install main board",
          color: "#f59e0b",
        },
        {
          id: 5,
          label: "Display Mount",
          operation: "Attach and calibrate screen",
          color: "#10b981",
        },
      ],
      correctSequence: [1, 2, 3, 4, 5],
      hasQualityGate: true,
      qualityGateStation: 3,
      explanation:
        "Housing then battery, then QC gate before expensive PCB, then display.",
    },
  ],
};

const STATE_COLORS: Record<StationStatus, string> = {
  idle: "#374151",
  active: "#10b981",
  jammed: "#f43f5e",
  complete: "#00f5ff",
};

function FactoryControllerGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const challenges = FACTORY_CHALLENGES[config.difficulty];
  const [challengeIdx, setChallengeIdx] = useState(0);
  const challenge = challenges[challengeIdx];
  const [sequence, setSequence] = useState<number[]>([]);
  const [stationStates, setStationStates] = useState<
    Record<number, StationStatus>
  >(() => Object.fromEntries(challenge.stations.map((s) => [s.id, "idle"])));
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<"success" | "jam" | null>(null);
  const [jamStation, setJamStation] = useState<number | null>(null);
  const [productionRate, setProductionRate] = useState(0);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correct / challenges.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, challenges.length],
  );

  function toggleStation(stationId: number) {
    if (simulating || simResult) return;
    setSequence((prev) =>
      prev.includes(stationId)
        ? prev.filter((s) => s !== stationId)
        : [...prev, stationId],
    );
  }

  function handleSimulate() {
    if (sequence.length !== challenge.stations.length || simulating) return;
    setSimulating(true);
    setSimResult(null);
    setJamStation(null);
    const states: Record<number, StationStatus> = Object.fromEntries(
      challenge.stations.map((s) => [s.id, "idle"]),
    );
    setStationStates({ ...states });
    const isCorrect = sequence.every(
      (id, i) => id === challenge.correctSequence[i],
    );
    let delay = 0;
    let jamAt: number | null = null;
    for (let i = 0; i < sequence.length; i++) {
      const stId = sequence[i];
      const expected = challenge.correctSequence[i];
      const isWrong = stId !== expected;
      delay += 600;
      const capturedStId = stId;
      setTimeout(() => {
        setStationStates((prev) => ({
          ...prev,
          [capturedStId]: isWrong ? "jammed" : "active",
        }));
        if (isWrong && jamAt === null) {
          jamAt = i;
          setJamStation(capturedStId);
        }
      }, delay);
    }
    setTimeout(() => {
      setSimulating(false);
      if (isCorrect) {
        const rate = Math.floor(100 * config.difficulty);
        setProductionRate(rate);
        setSimResult("success");
        setScore((s) => s + 400 * config.difficulty);
        setCorrect((c) => c + 1);
        setStationStates(
          Object.fromEntries(challenge.stations.map((s) => [s.id, "complete"])),
        );
        setTimeout(() => {
          const next = challengeIdx + 1;
          if (next >= challenges.length) {
            endGame(true);
          } else {
            const nc = challenges[next];
            setChallengeIdx(next);
            setSequence([]);
            setStationStates(
              Object.fromEntries(nc.stations.map((s) => [s.id, "idle"])),
            );
            setSimResult(null);
            setJamStation(null);
            setProductionRate(0);
          }
        }, 2200);
      } else {
        setSimResult("jam");
        setTimeout(() => {
          setSequence([]);
          setSimResult(null);
          setJamStation(null);
          setStationStates(
            Object.fromEntries(challenge.stations.map((s) => [s.id, "idle"])),
          );
        }, 2500);
      }
    }, delay + 600);
  }

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="industrial_automation.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Factory
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#10b981" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981" }}
          >
            Factory Floor Controller
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Click stations to build your activation sequence. Wrong order causes
            a production jam.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Simulate the line to test your sequence. Correct order = products
            completed. Quality gates reject defects before they advance.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="industrial_automation.start_button"
          >
            Start Factory
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="industrial_automation.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Factory className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981" }}
        >
          {challenge.title}
        </span>
        {productionRate > 0 && (
          <span className="text-xs text-[#10b981]">
            Rate: {productionRate} units/hr
          </span>
        )}
      </div>
      <div className="glass-card rounded-xl p-3 shrink-0 border border-[#10b981]/30">
        <p className="text-sm text-foreground">{challenge.description}</p>
        {challenge.hasQualityGate && (
          <p className="text-xs text-[#f43f5e] mt-1">
            Station {challenge.qualityGateStation} is a QC gate.
          </p>
        )}
      </div>
      <div
        className="relative glass rounded-xl border border-border/30 p-4 overflow-hidden"
        data-ocid="industrial_automation.conveyor"
      >
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />
        <div className="flex items-center justify-between relative">
          <div
            className="absolute inset-y-1/2 left-0 right-0 h-1 rounded-full"
            style={{ backgroundColor: "#1e293b" }}
          />
          {simResult === "success" && (
            <motion.div
              className="absolute inset-y-1/2 left-0 right-0 h-1 rounded-full"
              style={{
                backgroundColor: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
            />
          )}
          {challenge.stations.map((station) => {
            const seqPosition = sequence.indexOf(station.id);
            const stateColor = STATE_COLORS[stationStates[station.id]];
            const isJammed = jamStation === station.id;
            return (
              <motion.button
                type="button"
                key={station.id}
                whileHover={!simulating && !simResult ? { scale: 1.05 } : {}}
                whileTap={!simulating && !simResult ? { scale: 0.95 } : {}}
                onClick={() => toggleStation(station.id)}
                animate={isJammed ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative z-20 flex flex-col items-center gap-1 cursor-pointer"
                style={{ minWidth: "80px" }}
                data-ocid={`industrial_automation.station.${station.id}`}
              >
                <div
                  className="w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all"
                  style={{
                    borderColor: stateColor,
                    backgroundColor: `${stateColor}20`,
                    boxShadow:
                      stationStates[station.id] !== "idle"
                        ? `0 0 12px ${stateColor}`
                        : "none",
                  }}
                >
                  {stationStates[station.id] === "complete" && (
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ color: stateColor }}
                    />
                  )}
                  {stationStates[station.id] === "jammed" && (
                    <XCircle
                      className="h-5 w-5"
                      style={{ color: stateColor }}
                    />
                  )}
                  {(stationStates[station.id] === "idle" ||
                    stationStates[station.id] === "active") && (
                    <span
                      className="text-lg font-black"
                      style={{
                        color: stateColor,
                        fontFamily: "'Orbitron', sans-serif",
                      }}
                    >
                      {station.id}
                    </span>
                  )}
                </div>
                <span
                  className="text-xs text-center font-bold"
                  style={{ color: station.color, fontSize: "9px" }}
                >
                  {station.label}
                </span>
                {seqPosition !== -1 && (
                  <div
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: "#7c3aed", color: "#fff" }}
                  >
                    {seqPosition + 1}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="glass-card rounded-xl p-3 shrink-0">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          YOUR SEQUENCE
        </p>
        <div className="flex gap-2 flex-wrap">
          {sequence.map((id, i) => {
            const st = challenge.stations.find((s) => s.id === id);
            return (
              <div
                key={`seq-${i}`}
                className="flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
                style={{
                  borderColor: `${st?.color ?? "#374151"}60`,
                  color: st?.color,
                }}
              >
                <span className="font-bold">{i + 1}.</span> {st?.label}
              </div>
            );
          })}
          {sequence.length < challenge.stations.length && (
            <div className="rounded-lg border border-dashed border-border/40 px-2 py-1 text-xs text-muted-foreground">
              Click station to add...
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {simResult === "jam" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-3 border border-[#f43f5e] bg-[#f43f5e]/10 shrink-0"
          >
            <p className="text-sm text-[#f43f5e] font-bold">
              JAM DETECTED — Wrong order. Reset and re-sequence.
            </p>
          </motion.div>
        )}
        {simResult === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-3 border border-[#10b981] bg-[#10b981]/10 shrink-0"
          >
            <p className="text-sm text-[#10b981] font-bold">
              PRODUCTION SUCCESSFUL — {productionRate} units/hr.{" "}
              {challenge.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="shrink-0 flex justify-end">
        <GlowButton
          variant="primary"
          size="sm"
          onClick={handleSimulate}
          disabled={
            sequence.length !== challenge.stations.length ||
            simulating ||
            simResult !== null
          }
          data-ocid="industrial_automation.simulate_button"
        >
          Run Production Line
        </GlowButton>
      </div>
    </div>
  );
}

// ─── Game 2: Quality Control ───────────────────────────────────────────────────

type QCVerdict = "pass" | "fail" | "marginal";

interface QCProduct {
  id: number;
  measurement: number;
  correct: QCVerdict;
}

interface QCScenario {
  productName: string;
  unit: string;
  nominal: number;
  tolerancePlus: number;
  toleranceMinus: number;
  products: QCProduct[];
}

const QC_SCENARIOS: Record<1 | 2 | 3, QCScenario[]> = {
  1: [
    {
      productName: "Steel Rod",
      unit: "mm",
      nominal: 100,
      tolerancePlus: 0.5,
      toleranceMinus: 0.5,
      products: [
        { id: 1, measurement: 100.2, correct: "pass" },
        { id: 2, measurement: 100.6, correct: "fail" },
        { id: 3, measurement: 99.7, correct: "pass" },
        { id: 4, measurement: 99.4, correct: "fail" },
        { id: 5, measurement: 100.45, correct: "marginal" },
        { id: 6, measurement: 100.0, correct: "pass" },
        { id: 7, measurement: 101.0, correct: "fail" },
        { id: 8, measurement: 99.55, correct: "marginal" },
      ],
    },
  ],
  2: [
    {
      productName: "Aluminum Shaft",
      unit: "mm",
      nominal: 50,
      tolerancePlus: 0.2,
      toleranceMinus: 0.2,
      products: [
        { id: 1, measurement: 50.15, correct: "marginal" },
        { id: 2, measurement: 50.25, correct: "fail" },
        { id: 3, measurement: 49.85, correct: "marginal" },
        { id: 4, measurement: 50.0, correct: "pass" },
        { id: 5, measurement: 49.7, correct: "fail" },
        { id: 6, measurement: 50.1, correct: "pass" },
        { id: 7, measurement: 50.22, correct: "fail" },
        { id: 8, measurement: 49.95, correct: "pass" },
      ],
    },
    {
      productName: "Plastic Gear",
      unit: "mm",
      nominal: 30,
      tolerancePlus: 0.3,
      toleranceMinus: 0.3,
      products: [
        { id: 1, measurement: 30.2, correct: "pass" },
        { id: 2, measurement: 30.35, correct: "fail" },
        { id: 3, measurement: 29.8, correct: "pass" },
        { id: 4, measurement: 29.65, correct: "fail" },
        { id: 5, measurement: 30.28, correct: "marginal" },
        { id: 6, measurement: 29.72, correct: "marginal" },
        { id: 7, measurement: 30.0, correct: "pass" },
        { id: 8, measurement: 30.4, correct: "fail" },
      ],
    },
  ],
  3: [
    {
      productName: "Precision Bearing",
      unit: "mm",
      nominal: 25,
      tolerancePlus: 0.05,
      toleranceMinus: 0.05,
      products: [
        { id: 1, measurement: 25.03, correct: "pass" },
        { id: 2, measurement: 25.06, correct: "fail" },
        { id: 3, measurement: 24.97, correct: "pass" },
        { id: 4, measurement: 24.94, correct: "fail" },
        { id: 5, measurement: 25.048, correct: "marginal" },
        { id: 6, measurement: 24.952, correct: "marginal" },
        { id: 7, measurement: 25.01, correct: "pass" },
        { id: 8, measurement: 25.07, correct: "fail" },
      ],
    },
    {
      productName: "Hydraulic Piston",
      unit: "mm",
      nominal: 75,
      tolerancePlus: 0.1,
      toleranceMinus: 0.1,
      products: [
        { id: 1, measurement: 75.05, correct: "pass" },
        { id: 2, measurement: 75.12, correct: "fail" },
        { id: 3, measurement: 74.93, correct: "pass" },
        { id: 4, measurement: 74.88, correct: "fail" },
        { id: 5, measurement: 75.09, correct: "marginal" },
        { id: 6, measurement: 74.92, correct: "marginal" },
        { id: 7, measurement: 75.0, correct: "pass" },
        { id: 8, measurement: 75.15, correct: "fail" },
      ],
    },
  ],
};

// Marginal = within 90% of tolerance (flags for re-inspection)
function classifyProduct(
  measurement: number,
  nominal: number,
  tolerancePlus: number,
  toleranceMinus: number,
): QCVerdict {
  const deviation = measurement - nominal;
  if (deviation > tolerancePlus) return "fail";
  if (deviation < -toleranceMinus) return "fail";
  if (Math.abs(deviation) >= 0.85 * Math.min(tolerancePlus, toleranceMinus))
    return "marginal";
  return "pass";
}

function QualityControlGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const allScenarios = QC_SCENARIOS[config.difficulty];
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = allScenarios[scenarioIdx];
  const [verdicts, setVerdicts] = useState<Record<number, QCVerdict | null>>(
    () => Object.fromEntries(scenario.products.map((p) => [p.id, null])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (completedScenarios / allScenarios.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, completedScenarios, allScenarios.length],
  );

  function handleVerdict(productId: number, verdict: QCVerdict) {
    if (submitted) return;
    setVerdicts((prev) => ({
      ...prev,
      [productId]: prev[productId] === verdict ? null : verdict,
    }));
  }

  const allClassified = scenario.products.every((p) => verdicts[p.id] !== null);

  function handleSubmit() {
    if (!allClassified) return;
    let pts = 0;
    let correct = 0;
    for (const product of scenario.products) {
      if (verdicts[product.id] === product.correct) {
        pts += 50;
        correct++;
      }
    }
    pts *= config.difficulty;
    const newScore = score + pts;
    setScore(newScore);
    scoreRef.current = newScore;
    setSubmitted(true);
    setTimeout(() => {
      const next = completedScenarios + 1;
      setCompletedScenarios(next);
      if (next >= allScenarios.length) {
        endGame(true);
      } else {
        const nextScenario = allScenarios[next];
        setScenarioIdx(next);
        setVerdicts(
          Object.fromEntries(nextScenario.products.map((p) => [p.id, null])),
        );
        setSubmitted(false);
      }
    }, 3500);
  }

  const defectCount = submitted
    ? scenario.products.filter((p) => verdicts[p.id] === "fail").length
    : 0;
  const defectRate = submitted
    ? ((defectCount / scenario.products.length) * 100).toFixed(1)
    : "0";

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="quality_control.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Factory
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f59e0b" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
          >
            Quality Control Inspector
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Inspect product measurements against tolerance specifications.
            Classify each as Pass, Fail, or Marginal.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Pass = within tolerance. Fail = exceeds tolerance. Marginal = within
            tolerance but near the limit (flags for re-inspection).
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="quality_control.start_button"
          >
            Start Inspection
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  const passLimit = scenario.nominal + scenario.tolerancePlus;
  const failLimit = scenario.nominal - scenario.toleranceMinus;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="quality_control.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Factory className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
        >
          {scenario.productName}
        </span>
        <span className="text-xs text-muted-foreground">
          {completedScenarios + 1}/{allScenarios.length}
        </span>
      </div>

      <div className="glass-card rounded-xl p-3 shrink-0 border border-[#f59e0b]/30">
        <p
          className="text-xs font-bold text-[#f59e0b] mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          TOLERANCE SPECIFICATION
        </p>
        <p className="text-sm">
          Nominal:{" "}
          <span className="font-bold text-[#f59e0b]">
            {scenario.nominal}
            {scenario.unit}
          </span>{" "}
          | Range:{" "}
          <span className="font-bold text-[#10b981]">
            {failLimit.toFixed(2)} – {passLimit.toFixed(2)} {scenario.unit}
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Marginal = within {(scenario.tolerancePlus * 0.15).toFixed(3)}
          {scenario.unit} of limit | Fail = outside range
        </p>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {scenario.products.map((product) => {
          const verdict = verdicts[product.id];
          const deviation = (product.measurement - scenario.nominal).toFixed(3);
          const isPos = product.measurement >= scenario.nominal;
          const showResult = submitted;
          const isCorrect = showResult && verdict === product.correct;
          return (
            <div
              key={product.id}
              className="glass-card rounded-xl p-3 border transition-all"
              style={{
                borderColor: showResult
                  ? isCorrect
                    ? "#10b981"
                    : "#f43f5e"
                  : verdict
                    ? verdict === "pass"
                      ? "#10b98140"
                      : verdict === "fail"
                        ? "#f43f5e40"
                        : "#f59e0b40"
                    : "#374151",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold text-muted-foreground"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  PRODUCT #{product.id}
                </span>
                <span
                  className="text-lg font-black tabular-nums"
                  style={{
                    color:
                      Math.abs(product.measurement - scenario.nominal) <=
                      scenario.tolerancePlus
                        ? "#10b981"
                        : "#f43f5e",
                  }}
                >
                  {product.measurement.toFixed(3)} {scenario.unit}
                </span>
                <span
                  className="text-xs"
                  style={{ color: isPos ? "#f59e0b" : "#00f5ff" }}
                >
                  {isPos ? "+" : ""}
                  {deviation}
                </span>
              </div>
              <div className="flex gap-2">
                {(["pass", "marginal", "fail"] as QCVerdict[]).map((v) => {
                  const vColors: Record<QCVerdict, string> = {
                    pass: "#10b981",
                    marginal: "#f59e0b",
                    fail: "#f43f5e",
                  };
                  const isSelected = verdict === v;
                  return (
                    <button
                      type="button"
                      key={v}
                      onClick={() => handleVerdict(product.id, v)}
                      className="flex-1 rounded-lg border-2 py-1.5 text-xs font-bold transition-all uppercase"
                      style={{
                        borderColor: isSelected
                          ? vColors[v]
                          : `${vColors[v]}30`,
                        backgroundColor: isSelected
                          ? `${vColors[v]}20`
                          : "transparent",
                        color: isSelected ? vColors[v] : "#6b7280",
                      }}
                      disabled={submitted}
                      data-ocid={`quality_control.product.${product.id}.${v}`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <p
                  className="text-xs mt-1"
                  style={{ color: isCorrect ? "#10b981" : "#f43f5e" }}
                >
                  {isCorrect
                    ? "Correct classification"
                    : `Should be: ${product.correct.toUpperCase()} — deviation = ${deviation} (limit = +-${scenario.tolerancePlus})`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {submitted && (
        <div className="glass-card rounded-xl p-3 shrink-0 border border-[#f59e0b]/30">
          <p
            className="text-xs font-bold text-[#f59e0b] mb-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            INSPECTION SUMMARY
          </p>
          <p className="text-sm">
            Defect Rate:{" "}
            <span
              className="font-bold"
              style={{
                color:
                  Number.parseFloat(defectRate) > 20 ? "#f43f5e" : "#10b981",
              }}
            >
              {defectRate}%
            </span>{" "}
            | {defectCount} of {scenario.products.length} products failed
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {Number.parseFloat(defectRate) > 25
              ? "High defect rate. Process requires corrective action."
              : Number.parseFloat(defectRate) > 10
                ? "Moderate defects. Process is borderline."
                : "Low defect rate. Process is under control."}
          </p>
        </div>
      )}

      {!submitted && (
        <div className="shrink-0 flex justify-end">
          <GlowButton
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!allClassified}
            data-ocid="quality_control.submit_button"
          >
            Submit Inspection
          </GlowButton>
        </div>
      )}
    </div>
  );
}

// ─── Game 3: Process Optimizer (Bottleneck) ──────────────────────────────

interface WorkStation {
  id: string;
  label: string;
  cycleTime: number;
  color: string;
}
type ImprovementAction = "add_worker" | "split_station" | "reduce_setup";

interface FactoryLayout {
  title: string;
  stations: WorkStation[];
  improvementOptions: Array<{
    id: ImprovementAction;
    label: string;
    description: string;
    cycleDelta: number;
    targetStation: string;
  }>;
  explanation: string;
}

const IMPROVEMENT_LABELS: Record<ImprovementAction, string> = {
  add_worker: "Add Worker to Bottleneck",
  split_station: "Split Station into 2 Parallel",
  reduce_setup: "Reduce Setup Time",
};

const FACTORY_LAYOUTS: Record<1 | 2 | 3, FactoryLayout[]> = {
  1: [
    {
      title: "Beverage Bottling Plant",
      stations: [
        { id: "A", label: "Wash Bottles", cycleTime: 10, color: "#00f5ff" },
        { id: "B", label: "Fill Liquid", cycleTime: 25, color: "#f43f5e" },
        { id: "C", label: "Cap & Seal", cycleTime: 15, color: "#f59e0b" },
        { id: "D", label: "Label Apply", cycleTime: 25, color: "#e879f9" },
        { id: "E", label: "Pack Crate", cycleTime: 12, color: "#10b981" },
      ],
      improvementOptions: [
        {
          id: "add_worker",
          label: "Add 2nd worker to Fill & Label (B+D)",
          description:
            "Additional worker halves cycle time at both bottlenecks",
          cycleDelta: -12,
          targetStation: "B",
        },
        {
          id: "split_station",
          label: "Split Station B into B1 and B2",
          description:
            "Two parallel fill stations each handle half the throughput",
          cycleDelta: -13,
          targetStation: "B",
        },
        {
          id: "reduce_setup",
          label: "Reduce fill changeover time by 4s",
          description: "Lean manufacturing technique reduces non-value time",
          cycleDelta: -4,
          targetStation: "B",
        },
      ],
      explanation:
        "Bottleneck = Station B and D (both 25s). Splitting B into 2 parallel reduces effective cycle to 12.5s and pushes bottleneck to C.",
    },
  ],
  2: [
    {
      title: "Engine Component Line",
      stations: [
        { id: "A", label: "Raw Material Cut", cycleTime: 8, color: "#00f5ff" },
        { id: "B", label: "CNC Machining", cycleTime: 40, color: "#f43f5e" },
        { id: "C", label: "Heat Treatment", cycleTime: 20, color: "#f59e0b" },
        { id: "D", label: "Grinding", cycleTime: 18, color: "#7c3aed" },
        { id: "E", label: "Final Inspection", cycleTime: 10, color: "#10b981" },
      ],
      improvementOptions: [
        {
          id: "split_station",
          label: "Add 2nd CNC machine (parallel)",
          description:
            "Two CNC machines running in parallel halves effective cycle time",
          cycleDelta: -20,
          targetStation: "B",
        },
        {
          id: "add_worker",
          label: "Add CNC operator for faster setups",
          description: "Reduces CNC cycle from 40s to 28s",
          cycleDelta: -12,
          targetStation: "B",
        },
        {
          id: "reduce_setup",
          label: "Pre-program CNC fixtures",
          description: "Reduces CNC from 40s to 32s",
          cycleDelta: -8,
          targetStation: "B",
        },
      ],
      explanation:
        "Bottleneck = CNC at 40s. Adding a parallel CNC machine cuts effective time to 20s — system throughput doubles.",
    },
  ],
  3: [
    {
      title: "Semiconductor Fab Line",
      stations: [
        { id: "A", label: "Wafer Clean", cycleTime: 15, color: "#00f5ff" },
        { id: "B", label: "Lithography", cycleTime: 60, color: "#f43f5e" },
        { id: "C", label: "Etch Chamber", cycleTime: 30, color: "#f59e0b" },
        { id: "D", label: "Deposition", cycleTime: 35, color: "#7c3aed" },
        { id: "E", label: "Die Test", cycleTime: 20, color: "#10b981" },
      ],
      improvementOptions: [
        {
          id: "split_station",
          label: "Add 2nd lithography tool",
          description: "Parallel lithography tools cut cycle to 30s",
          cycleDelta: -30,
          targetStation: "B",
        },
        {
          id: "add_worker",
          label: "Add lithography technician",
          description: "Reduces recipe load time, cutting cycle to 45s",
          cycleDelta: -15,
          targetStation: "B",
        },
        {
          id: "reduce_setup",
          label: "Pre-align reticle sets",
          description: "Reduces litho cycle to 50s",
          cycleDelta: -10,
          targetStation: "B",
        },
      ],
      explanation:
        "Lithography is the dominant bottleneck at 60s. A 2nd tool brings effective cycle to 30s — near line balance.",
    },
    {
      title: "Automotive Weld Shop",
      stations: [
        { id: "A", label: "Part Fixture", cycleTime: 12, color: "#00f5ff" },
        { id: "B", label: "Spot Weld", cycleTime: 22, color: "#f59e0b" },
        { id: "C", label: "MIG Weld", cycleTime: 35, color: "#f43f5e" },
        { id: "D", label: "Grind & Dress", cycleTime: 18, color: "#7c3aed" },
        { id: "E", label: "Paint & Cure", cycleTime: 28, color: "#10b981" },
      ],
      improvementOptions: [
        {
          id: "split_station",
          label: "Add robotic MIG welding arm",
          description: "Robot reduces MIG cycle to 17s",
          cycleDelta: -18,
          targetStation: "C",
        },
        {
          id: "add_worker",
          label: "Add second MIG welder",
          description: "Two welders working in parallel, cycle drops to 18s",
          cycleDelta: -17,
          targetStation: "C",
        },
        {
          id: "reduce_setup",
          label: "Pre-stage weld fixtures",
          description: "Reduces MIG cycle to 28s",
          cycleDelta: -7,
          targetStation: "C",
        },
      ],
      explanation:
        "MIG Weld bottleneck at 35s. Adding a robot arm reduces cycle to 17s — throughput increases by 105%.",
    },
  ],
};

function ProcessOptimizerGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const allLayouts = FACTORY_LAYOUTS[config.difficulty];
  const [layoutIdx, setLayoutIdx] = useState(0);
  const layout = allLayouts[layoutIdx];
  const [identifiedBottleneck, setIdentifiedBottleneck] = useState<
    string | null
  >(null);
  const [selectedImprovement, setSelectedImprovement] =
    useState<ImprovementAction | null>(null);
  const [phase, setPhase] = useState<"identify" | "improve" | "result">(
    "identify",
  );
  const [score, setScore] = useState(0);
  const [completedLayouts, setCompletedLayouts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (completedLayouts / allLayouts.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, completedLayouts, allLayouts.length],
  );

  const maxCycle = Math.max(...layout.stations.map((s) => s.cycleTime));
  const bottleneckStation = layout.stations.find(
    (s) => s.cycleTime === maxCycle,
  );
  const currentThroughput = (3600 / maxCycle).toFixed(1);
  const targetOption = selectedImprovement
    ? layout.improvementOptions.find((o) => o.id === selectedImprovement)
    : null;
  const improvedCycle = targetOption
    ? maxCycle + targetOption.cycleDelta
    : maxCycle;
  const improvedThroughput = selectedImprovement
    ? (3600 / improvedCycle).toFixed(1)
    : currentThroughput;

  function handleBottleneckIdentify(stationId: string) {
    if (phase !== "identify") return;
    setIdentifiedBottleneck(stationId);
  }

  function handleConfirmBottleneck() {
    if (!identifiedBottleneck) return;
    const isCorrect = identifiedBottleneck === bottleneckStation?.id;
    if (isCorrect) {
      setScore((s) => s + 200 * config.difficulty);
      setPhase("improve");
    } else {
      setIdentifiedBottleneck(null);
    }
  }

  function handleApplyImprovement() {
    if (!selectedImprovement) return;
    const opt = layout.improvementOptions.find(
      (o) => o.id === selectedImprovement,
    );
    const bestOpt = layout.improvementOptions.reduce((a, b) =>
      Math.abs(b.cycleDelta) > Math.abs(a.cycleDelta) ? b : a,
    );
    const isBest = selectedImprovement === bestOpt.id;
    const pts = isBest ? 300 * config.difficulty : 150 * config.difficulty;
    setScore((s) => s + pts);
    scoreRef.current = scoreRef.current + pts;
    setPhase("result");
    setTimeout(() => {
      const next = completedLayouts + 1;
      setCompletedLayouts(next);
      if (next >= allLayouts.length) {
        endGame(true);
      } else {
        setLayoutIdx(next);
        setIdentifiedBottleneck(null);
        setSelectedImprovement(null);
        setPhase("identify");
      }
    }, 3000);
  }

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="process_optimizer.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Factory
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#7c3aed" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
          >
            Process Optimizer
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Analyze factory production lines. Identify the bottleneck station
            (longest cycle time), then apply improvements to maximize
            throughput.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Throughput = 3600 / Bottleneck Cycle Time (units per hour).
            Eliminating the bottleneck is the highest leverage action in any
            production system.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="process_optimizer.start_button"
          >
            Analyze Factory
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="process_optimizer.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#7c3aed" }}>
          <Factory className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
        >
          {layout.title}
        </span>
        <span className="text-xs text-muted-foreground">
          {completedLayouts + 1}/{allLayouts.length}
        </span>
      </div>

      {/* Phase indicator */}
      <div className="flex gap-2 shrink-0">
        {(["identify", "improve", "result"] as const).map((p) => (
          <div
            key={p}
            className="flex-1 rounded-lg py-1.5 text-xs font-bold text-center transition-all"
            style={{
              backgroundColor: phase === p ? "#7c3aed20" : "transparent",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: phase === p ? "#7c3aed" : "#374151",
              color: phase === p ? "#7c3aed" : "#6b7280",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {p.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Station cycle time chart */}
      <div className="glass-card rounded-xl p-3 shrink-0">
        <p
          className="text-xs text-muted-foreground mb-3"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          CYCLE TIMES — CLICK BOTTLENECK
        </p>
        <div className="flex items-end gap-2 h-24">
          {layout.stations.map((station) => {
            const heightPct = (station.cycleTime / maxCycle) * 100;
            const isBottleneck = station.cycleTime === maxCycle;
            const isIdentified = identifiedBottleneck === station.id;
            const barStyle = {
              height: `${heightPct}%`,
              backgroundColor: isIdentified
                ? station.color
                : `${station.color}50`,
              boxShadow:
                isBottleneck && phase === "result"
                  ? `0 0 10px ${station.color}`
                  : "none",
            };
            return (
              <button
                type="button"
                key={station.id}
                onClick={() =>
                  phase === "identify" && handleBottleneckIdentify(station.id)
                }
                className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                data-ocid={`process_optimizer.station.${station.id}`}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: isBottleneck ? station.color : "#6b7280" }}
                >
                  {station.cycleTime}s
                </span>
                <div
                  className="w-full rounded-t transition-all"
                  style={barStyle}
                />
                <span
                  className="text-xs text-center font-bold"
                  style={{ color: station.color, fontSize: "9px" }}
                >
                  {station.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase: identify */}
      {phase === "identify" && (
        <>
          <div className="glass-card rounded-xl p-3 shrink-0">
            <p
              className="text-xs text-muted-foreground mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              IDENTIFY BOTTLENECK
            </p>
            <p className="text-sm">
              Current throughput:{" "}
              <span className="font-bold text-[#f59e0b]">
                {currentThroughput} units/hr
              </span>
            </p>
            {identifiedBottleneck && (
              <p className="text-sm mt-1">
                Selected:{" "}
                <span
                  className="font-bold"
                  style={{
                    color: layout.stations.find(
                      (s) => s.id === identifiedBottleneck,
                    )?.color,
                  }}
                >
                  {
                    layout.stations.find((s) => s.id === identifiedBottleneck)
                      ?.label
                  }{" "}
                  (
                  {
                    layout.stations.find((s) => s.id === identifiedBottleneck)
                      ?.cycleTime
                  }
                  s)
                </span>
              </p>
            )}
          </div>
          <div className="shrink-0 flex justify-end">
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleConfirmBottleneck}
              disabled={!identifiedBottleneck}
              data-ocid="process_optimizer.confirm_bottleneck"
            >
              Confirm Bottleneck
            </GlowButton>
          </div>
        </>
      )}

      {/* Phase: improve */}
      {phase === "improve" && (
        <>
          <div className="flex flex-col gap-2 flex-1">
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SELECT IMPROVEMENT STRATEGY
            </p>
            {layout.improvementOptions.map((opt) => (
              <motion.button
                type="button"
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedImprovement(opt.id)}
                className="rounded-xl border-2 p-3 text-left transition-all"
                style={{
                  borderColor:
                    selectedImprovement === opt.id ? "#7c3aed" : "#374151",
                  backgroundColor:
                    selectedImprovement === opt.id
                      ? "#7c3aed15"
                      : "transparent",
                }}
                data-ocid={`process_optimizer.improvement.${opt.id}`}
              >
                <p
                  className="text-sm font-bold"
                  style={{
                    color:
                      selectedImprovement === opt.id ? "#7c3aed" : "#94a3b8",
                  }}
                >
                  {IMPROVEMENT_LABELS[opt.id]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opt.description}
                </p>
                {selectedImprovement === opt.id && (
                  <p
                    className="text-xs mt-1 font-bold"
                    style={{ color: "#10b981" }}
                  >
                    New throughput estimate:{" "}
                    {(3600 / (maxCycle + opt.cycleDelta)).toFixed(1)} units/hr
                  </p>
                )}
              </motion.button>
            ))}
          </div>
          <div className="shrink-0 flex justify-end">
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleApplyImprovement}
              disabled={!selectedImprovement}
              data-ocid="process_optimizer.apply_improvement"
            >
              Apply Improvement
            </GlowButton>
          </div>
        </>
      )}

      {/* Phase: result */}
      {phase === "result" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 shrink-0 border border-[#10b981]/40"
        >
          <p
            className="text-xs font-bold text-[#10b981] mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            OPTIMIZATION RESULT
          </p>
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Before</p>
              <p className="text-xl font-black text-[#f43f5e]">
                {currentThroughput}
              </p>
              <p className="text-xs text-muted-foreground">units/hr</p>
            </div>
            <div className="flex items-center text-[#7c3aed] font-black text-2xl">
              +
            </div>
            <div>
              <p className="text-xs text-muted-foreground">After</p>
              <p className="text-xl font-black text-[#10b981]">
                {improvedThroughput}
              </p>
              <p className="text-xs text-muted-foreground">units/hr</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {layout.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function IndustrialAutomation({ config, onGameEnd }: Props) {
  if (config.gameId === "quality-control")
    return <QualityControlGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "process-optimizer")
    return <ProcessOptimizerGame config={config} onGameEnd={onGameEnd} />;
  return <FactoryControllerGame config={config} onGameEnd={onGameEnd} />;
}
