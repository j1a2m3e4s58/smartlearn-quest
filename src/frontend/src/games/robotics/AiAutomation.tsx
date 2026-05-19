import { GlowButton } from "@/components/ui/GlowButton";
import { Brain, CheckCircle, Heart, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

// ── Game 1: ML Trainer (existing) ────────────────────────────────────────────────
type ShapeType = "circle" | "square" | "triangle" | "star";
type ShapeClass = "A" | "B" | "C" | "D";
interface TrainingSample {
  id: number;
  shape: ShapeType;
  size: "small" | "medium" | "large";
  rotation: number;
  trueClass: ShapeClass;
  userLabel: ShapeClass | null;
}
interface TestSample {
  id: number;
  shape: ShapeType;
  size: "small" | "medium" | "large";
  rotation: number;
  trueClass: ShapeClass;
  userPrediction: ShapeClass | null;
}
const SHAPE_CLASS_MAP: Record<ShapeType, ShapeClass> = {
  circle: "A",
  square: "B",
  triangle: "C",
  star: "D",
};
const SHAPE_COLORS: Record<ShapeType, string> = {
  circle: "#00f5ff",
  square: "#7c3aed",
  triangle: "#f59e0b",
  star: "#f43f5e",
};
function generateSample(id: number, difficulty: number): TrainingSample {
  const shapes: ShapeType[] =
    difficulty >= 2
      ? ["circle", "square", "triangle", "star"]
      : ["circle", "square", "triangle"];
  const shape = shapes[Math.floor(Math.random() * shapes.length)] as ShapeType;
  const sizes: Array<"small" | "medium" | "large"> = [
    "small",
    "medium",
    "large",
  ];
  const size = sizes[Math.floor(Math.random() * (difficulty >= 2 ? 3 : 1))];
  const rotation = difficulty >= 3 ? Math.floor(Math.random() * 8) * 45 : 0;
  return {
    id,
    shape,
    size,
    rotation,
    trueClass: SHAPE_CLASS_MAP[shape],
    userLabel: null,
  };
}
function generateTest(id: number, difficulty: number): TestSample {
  const s = generateSample(id, difficulty);
  return { ...s, userPrediction: null };
}
function ShapeIcon({
  shape,
  size,
  rotation,
  color,
  dim = 48,
}: {
  shape: ShapeType;
  size: "small" | "medium" | "large";
  rotation: number;
  color: string;
  dim?: number;
}) {
  const scale = size === "small" ? 0.7 : size === "large" ? 1.3 : 1;
  const s = dim * scale;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
    >
      {shape === "circle" && (
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={(s / 2) * 0.85}
          fill={`${color}30`}
          stroke={color}
          strokeWidth="2"
        />
      )}
      {shape === "square" && (
        <rect
          x={(dim - s * 0.85) / 2}
          y={(dim - s * 0.85) / 2}
          width={s * 0.85}
          height={s * 0.85}
          fill={`${color}30`}
          stroke={color}
          strokeWidth="2"
        />
      )}
      {shape === "triangle" && (
        <polygon
          points={`${dim / 2},${dim * 0.1} ${dim * 0.9},${dim * 0.85} ${dim * 0.1},${dim * 0.85}`}
          fill={`${color}30`}
          stroke={color}
          strokeWidth="2"
        />
      )}
      {shape === "star" && (
        <path
          d={`M ${dim / 2} ${dim * 0.08} L ${dim * 0.62} ${dim * 0.38} L ${dim * 0.95} ${dim * 0.38} L ${dim * 0.69} ${dim * 0.58} L ${dim * 0.79} ${dim * 0.92} L ${dim * 0.5} ${dim * 0.72} L ${dim * 0.21} ${dim * 0.92} L ${dim * 0.31} ${dim * 0.58} L ${dim * 0.05} ${dim * 0.38} L ${dim * 0.38} ${dim * 0.38} Z`}
          fill={`${color}30`}
          stroke={color}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

// ── Game 2: Automation Designer ──────────────────────────────────────────────────
type ObjShape = "circle" | "square" | "triangle" | "pentagon";
type ObjColor = "red" | "blue" | "green" | "yellow";
type ObjSize = "small" | "large";
type BinId = "A" | "B" | "C" | "D";
interface ConveyorObject {
  id: number;
  shape: ObjShape;
  color: ObjColor;
  size: ObjSize;
}
interface SortRule {
  condition: string;
  property: "shape" | "color" | "size";
  value: string;
  bin: BinId;
}
interface ConveyorLevel {
  title: string;
  description: string;
  objects: ConveyorObject[];
  rules: SortRule[];
  bins: BinId[];
}
const OBJ_COLORS: Record<ObjColor, string> = {
  red: "#f43f5e",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#fef08a",
};
const OBJ_SHAPES: ObjShape[] = ["circle", "square", "triangle", "pentagon"];
const OBJ_COLOR_LIST: ObjColor[] = ["red", "blue", "green", "yellow"];
const CONVEYOR_LEVELS: ConveyorLevel[] = [
  {
    title: "Basic Color Sort",
    description: "Sort objects by color. Red goes to Bin A, Blue to Bin B.",
    bins: ["A", "B"],
    rules: [
      {
        condition: "IF color=red THEN Bin A",
        property: "color",
        value: "red",
        bin: "A",
      },
      {
        condition: "IF color=blue THEN Bin B",
        property: "color",
        value: "blue",
        bin: "B",
      },
    ],
    objects: [
      { id: 1, shape: "circle", color: "red", size: "small" },
      { id: 2, shape: "square", color: "blue", size: "large" },
      { id: 3, shape: "triangle", color: "red", size: "large" },
      { id: 4, shape: "circle", color: "blue", size: "small" },
      { id: 5, shape: "square", color: "red", size: "small" },
    ],
  },
  {
    title: "Shape Classification",
    description: "Sort by shape. Circles to A, Squares to B, Triangles to C.",
    bins: ["A", "B", "C"],
    rules: [
      {
        condition: "IF shape=circle THEN Bin A",
        property: "shape",
        value: "circle",
        bin: "A",
      },
      {
        condition: "IF shape=square THEN Bin B",
        property: "shape",
        value: "square",
        bin: "B",
      },
      {
        condition: "IF shape=triangle THEN Bin C",
        property: "shape",
        value: "triangle",
        bin: "C",
      },
    ],
    objects: [
      { id: 1, shape: "circle", color: "blue", size: "large" },
      { id: 2, shape: "triangle", color: "red", size: "small" },
      { id: 3, shape: "square", color: "green", size: "large" },
      { id: 4, shape: "circle", color: "yellow", size: "small" },
      { id: 5, shape: "triangle", color: "blue", size: "large" },
      { id: 6, shape: "square", color: "red", size: "small" },
    ],
  },
  {
    title: "Size Segregation",
    description: "Small items to Bin A, Large items to Bin B.",
    bins: ["A", "B"],
    rules: [
      {
        condition: "IF size=small THEN Bin A",
        property: "size",
        value: "small",
        bin: "A",
      },
      {
        condition: "IF size=large THEN Bin B",
        property: "size",
        value: "large",
        bin: "B",
      },
    ],
    objects: [
      { id: 1, shape: "circle", color: "red", size: "small" },
      { id: 2, shape: "square", color: "blue", size: "large" },
      { id: 3, shape: "triangle", color: "green", size: "small" },
      { id: 4, shape: "pentagon", color: "yellow", size: "large" },
      { id: 5, shape: "circle", color: "blue", size: "large" },
      { id: 6, shape: "square", color: "red", size: "small" },
    ],
  },
  {
    title: "Multi-Rule Sorting",
    description:
      "Complex rules: Red circles to A, Blue squares to B, everything else to C.",
    bins: ["A", "B", "C"],
    rules: [
      {
        condition: "IF color=red AND shape=circle THEN Bin A",
        property: "color",
        value: "red",
        bin: "A",
      },
      {
        condition: "IF color=blue AND shape=square THEN Bin B",
        property: "color",
        value: "blue",
        bin: "B",
      },
      {
        condition: "IF color=green THEN Bin C",
        property: "color",
        value: "green",
        bin: "C",
      },
    ],
    objects: [
      { id: 1, shape: "circle", color: "red", size: "small" },
      { id: 2, shape: "square", color: "blue", size: "large" },
      { id: 3, shape: "triangle", color: "green", size: "small" },
      { id: 4, shape: "circle", color: "yellow", size: "large" },
      { id: 5, shape: "square", color: "red", size: "small" },
      { id: 6, shape: "circle", color: "blue", size: "large" },
      { id: 7, shape: "triangle", color: "green", size: "small" },
      { id: 8, shape: "pentagon", color: "yellow", size: "large" },
      { id: 9, shape: "circle", color: "green", size: "small" },
      { id: 10, shape: "square", color: "blue", size: "large" },
    ],
  },
];
function getBinForObject(obj: ConveyorObject, rules: SortRule[]): BinId {
  for (const rule of rules) {
    if (rule.property === "color" && obj.color === rule.value) return rule.bin;
    if (rule.property === "shape" && obj.shape === rule.value) return rule.bin;
    if (rule.property === "size" && obj.size === rule.value) return rule.bin;
  }
  return "A";
}

// ── Game 3: AI Ethics Quiz ─────────────────────────────────────────────────────────
interface EthicsScenario {
  id: string;
  title: string;
  scenario: string;
  biasType: string;
  biasTypeOptions: string[];
  correctBiasIdx: number;
  fairnessFix: string;
  fixOptions: string[];
  correctFixIdx: number;
  explanation: string;
}
const ETHICS_SCENARIOS: EthicsScenario[] = [
  {
    id: "e1",
    title: "Facial Recognition",
    scenario:
      "A police department deploys a facial recognition system. The AI correctly identifies 99% of light-skinned faces but only 65% of dark-skinned faces. In 6 months, 14 innocent people with darker skin were wrongly arrested.",
    biasType: "Representation Bias",
    biasTypeOptions: [
      "Representation Bias",
      "Confirmation Bias",
      "Label Bias",
      "Temporal Bias",
    ],
    correctBiasIdx: 0,
    fairnessFix: "Collect balanced training data across all skin tones",
    fixOptions: [
      "Collect balanced training data across all skin tones",
      "Use the system only for light-skinned people",
      "Lower the confidence threshold for all groups",
      "Deploy faster processors",
    ],
    correctFixIdx: 0,
    explanation:
      "The training dataset lacked diversity. Models inherit biases from their training data. Fix: balanced dataset collection and fairness metrics across demographic groups.",
  },
  {
    id: "e2",
    title: "Hiring Algorithm",
    scenario:
      "A tech company uses an AI to filter resumes. The system rejects applicants who attended women's colleges at 3x the rate of other colleges. The AI was trained on 10 years of historical hiring data where men dominated senior roles.",
    biasType: "Historical Bias",
    biasTypeOptions: [
      "Selection Bias",
      "Historical Bias",
      "Measurement Bias",
      "Aggregation Bias",
    ],
    correctBiasIdx: 1,
    fairnessFix:
      "Audit training data for gender patterns and add fairness constraints",
    fixOptions: [
      "Filter out college names from all resumes",
      "Audit training data for gender patterns and add fairness constraints",
      "Only hire from gender-neutral schools",
      "Replace AI with random selection",
    ],
    correctFixIdx: 1,
    explanation:
      "Historical data encodes past discrimination. The AI learned that male-dominated patterns = success. Fix: fairness audits, bias-aware training, equal opportunity constraints.",
  },
  {
    id: "e3",
    title: "Content Recommendation",
    scenario:
      "A social media AI recommends increasingly extreme political content. Users who watch moderate political videos are progressively shown more extreme videos because extreme content has higher engagement metrics.",
    biasType: "Optimization Bias",
    biasTypeOptions: [
      "Sampling Bias",
      "Label Bias",
      "Optimization Bias",
      "Temporal Bias",
    ],
    correctBiasIdx: 2,
    fairnessFix:
      "Add diversity and balance constraints to the recommendation objective",
    fixOptions: [
      "Remove all political content",
      "Only recommend content from verified sources",
      "Add diversity and balance constraints to the recommendation objective",
      "Reduce recommendation frequency",
    ],
    correctFixIdx: 2,
    explanation:
      "The AI optimizes only for engagement, not for user wellbeing or societal impact. Fix: multi-objective optimization including diversity, accuracy, and balance alongside engagement.",
  },
  {
    id: "e4",
    title: "Credit Scoring",
    scenario:
      "A bank's AI denies loans more often to applicants from certain zip codes, even when income and credit history are identical to approved applicants from other areas. The zip code feature correlates with race due to historical housing segregation.",
    biasType: "Proxy Discrimination",
    biasTypeOptions: [
      "Proxy Discrimination",
      "Sample Bias",
      "Labeling Error",
      "Concept Drift",
    ],
    correctBiasIdx: 0,
    fairnessFix:
      "Remove proxy features (zip code) that correlate with protected attributes",
    fixOptions: [
      "Approve all applicants from those zip codes",
      "Remove proxy features (zip code) that correlate with protected attributes",
      "Increase loan interest rates uniformly",
      "Use more zip code features for precision",
    ],
    correctFixIdx: 1,
    explanation:
      "Zip code acts as a proxy for race due to historical segregation. Even without using race directly, the model discriminates. Fix: remove or de-correlate proxy variables.",
  },
  {
    id: "e5",
    title: "Medical Diagnosis AI",
    scenario:
      "A hospital AI that diagnoses disease severity was trained primarily on data from wealthy patients who had regular checkups. When deployed in clinics serving low-income patients, it consistently under-diagnoses severity because those patients tend to seek care only in advanced stages.",
    biasType: "Distribution Shift",
    biasTypeOptions: [
      "Confirmation Bias",
      "Distribution Shift",
      "Label Noise",
      "Survivorship Bias",
    ],
    correctBiasIdx: 1,
    fairnessFix:
      "Collect representative training data from the target deployment population",
    fixOptions: [
      "Train faster on more data",
      "Only use the AI for wealthy patients",
      "Collect representative training data from the target deployment population",
      "Increase model complexity",
    ],
    correctFixIdx: 2,
    explanation:
      "The training distribution (wealthy, regular checkups) differs from deployment distribution (varied socioeconomic access). Fix: domain-appropriate training data and ongoing monitoring.",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ── GAME 1 COMPONENT ──────────────────────────────────────────────────────────
function MLTrainerGame({ config, onGameEnd }: Props) {
  const TRAIN_COUNT = 15;
  const TEST_COUNT = 5;
  const [phase, setPhase] = useState<
    "intro" | "training" | "testing" | "results"
  >("intro");
  const [trainSamples] = useState<TrainingSample[]>(() =>
    Array.from({ length: TRAIN_COUNT }, (_, i) =>
      generateSample(i, config.difficulty),
    ),
  );
  const [testSamples, setTestSamples] = useState<TestSample[]>(() =>
    Array.from({ length: TEST_COUNT }, (_, i) =>
      generateTest(100 + i, config.difficulty),
    ),
  );
  const [trainIdx, setTrainIdx] = useState(0);
  const [testIdx, setTestIdx] = useState(0);
  const [labels, setLabels] = useState<Record<number, ShapeClass>>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [showWrong, setShowWrong] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean, finalScore: number, correctCount: number) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          finalScore,
          (correctCount / TEST_COUNT) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  function handleLabel(cls: ShapeClass) {
    const sample = trainSamples[trainIdx];
    const correct = cls === sample.trueClass;
    setLabels((prev) => ({ ...prev, [sample.id]: cls }));
    if (correct) {
      setScore((s) => s + 50 * config.difficulty);
      setLastCorrect(true);
    } else {
      setLives((l) => Math.max(0, l - 1));
      setShowWrong(true);
      setLastCorrect(false);
      setTimeout(() => setShowWrong(false), 600);
    }
    setTimeout(() => {
      setLastCorrect(null);
      const next = trainIdx + 1;
      if (next >= TRAIN_COUNT) {
        setPhase("testing");
        setTrainIdx(0);
      } else setTrainIdx(next);
    }, 500);
  }

  function handlePredict(cls: ShapeClass) {
    const sample = testSamples[testIdx];
    const correct = cls === sample.trueClass;
    let newScore = score;
    if (correct) {
      newScore = score + 200 * config.difficulty;
      setScore(newScore);
    }
    const updated = testSamples.map((s, i) =>
      i === testIdx ? { ...s, userPrediction: cls } : s,
    );
    setTestSamples(updated);
    setLastCorrect(correct);
    setTimeout(() => {
      setLastCorrect(null);
      const next = testIdx + 1;
      if (next >= TEST_COUNT) {
        setPhase("results");
        const correctCount = updated.filter(
          (s) => s.userPrediction === s.trueClass,
        ).length;
        setTimeout(() => endGame(true, newScore, correctCount), 1800);
      } else setTestIdx(next);
    }, 800);
  }

  const labeledCount = Object.keys(labels).length;
  const trainProgress = Math.round((labeledCount / TRAIN_COUNT) * 100);
  const classes: ShapeClass[] =
    config.difficulty >= 2 ? ["A", "B", "C", "D"] : ["A", "B", "C"];
  const classLabels: Record<ShapeClass, string> = {
    A: "Class A (Circle)",
    B: "Class B (Square)",
    C: "Class C (Triangle)",
    D: "Class D (Star)",
  };

  if (phase === "intro")
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="ai_automation.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Brain
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#7c3aed" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
          >
            Machine Learning Trainer
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Label {TRAIN_COUNT} training samples, then test your model on{" "}
            {TEST_COUNT} unlabeled shapes.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("training");
            }}
            data-ocid="ai_automation.start_button"
          >
            Begin Training
          </GlowButton>
        </motion.div>
      </div>
    );

  if (phase === "training") {
    const current = trainSamples[trainIdx];
    return (
      <div
        className="w-full h-full flex flex-col gap-4"
        data-ocid="ai_automation.page"
      >
        <div className="game-hud flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2" style={{ color: "#7c3aed" }}>
            <Brain className="h-4 w-4" />
            <span className="text-lg font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              TRAINING PHASE
            </span>
            <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] transition-all duration-300"
                style={{ width: `${trainProgress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {labeledCount}/{TRAIN_COUNT}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: config.livesCount }).map((_, i) => (
              <Heart
                key={`h-${i}`}
                className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            LABEL THIS SAMPLE
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className={`glass-card rounded-2xl p-8 flex items-center justify-center border-2 transition-all ${showWrong ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.5)]" : lastCorrect === true ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "border-border/30"}`}
              data-ocid="ai_automation.sample_card"
            >
              <ShapeIcon
                shape={current.shape}
                size={current.size}
                rotation={current.rotation}
                color={SHAPE_COLORS[current.shape]}
                dim={80}
              />
            </motion.div>
          </AnimatePresence>
          <p className="text-xs text-muted-foreground">
            Sample #{trainIdx + 1} — What class?
          </p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {classes.map((cls) => (
              <motion.button
                type="button"
                key={cls}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleLabel(cls)}
                className="rounded-xl border-2 border-border/40 py-3 font-bold text-sm transition-all hover:border-[#7c3aed] hover:bg-[#7c3aed]/10"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "#7c3aed",
                }}
                data-ocid={`ai_automation.label_btn.${cls}`}
              >
                {classLabels[cls]}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "testing") {
    const current = testSamples[testIdx];
    return (
      <div
        className="w-full h-full flex flex-col gap-4"
        data-ocid="ai_automation.page"
      >
        <div className="game-hud flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2" style={{ color: "#00f5ff" }}>
            <Brain className="h-4 w-4" />
            <span className="text-lg font-bold">{score.toLocaleString()}</span>
          </div>
          <span
            className="text-xs font-bold"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" }}
          >
            TEST PHASE — {testIdx + 1}/{TEST_COUNT}
          </span>
          <div className="text-xs text-muted-foreground">
            Model Accuracy: ?%
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            PREDICT THIS SAMPLE
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className={`glass-card rounded-2xl p-8 flex items-center justify-center border-2 transition-all ${lastCorrect === true ? "border-[#10b981]" : lastCorrect === false ? "border-[#f43f5e]" : "border-[#00f5ff]/40"}`}
              data-ocid="ai_automation.test_card"
            >
              <ShapeIcon
                shape={current.shape}
                size={current.size}
                rotation={current.rotation}
                color="#94a3b8"
                dim={80}
              />
            </motion.div>
          </AnimatePresence>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {classes.map((cls) => (
              <motion.button
                type="button"
                key={cls}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handlePredict(cls)}
                className="rounded-xl border-2 border-border/40 py-3 font-bold text-sm transition-all hover:border-[#00f5ff]"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "#00f5ff",
                }}
                data-ocid={`ai_automation.predict_btn.${cls}`}
              >
                {classLabels[cls as ShapeClass]}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const correctCount = testSamples.filter(
    (s) => s.userPrediction === s.trueClass,
  ).length;
  const accuracy = Math.round((correctCount / TEST_COUNT) * 100);
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-6"
      data-ocid="ai_automation.results_page"
    >
      <h2
        className="text-2xl font-black"
        style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
      >
        MODEL EVALUATION
      </h2>
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm text-center border border-[#7c3aed]/40">
        <p
          className="text-5xl font-black mb-2"
          style={{
            color:
              accuracy >= 80
                ? "#10b981"
                : accuracy >= 60
                  ? "#f59e0b"
                  : "#f43f5e",
          }}
        >
          {accuracy}%
        </p>
        <p className="text-muted-foreground text-sm mb-4">Model Accuracy</p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {testSamples.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <ShapeIcon
                shape={s.shape}
                size="small"
                rotation={s.rotation}
                color={s.userPrediction === s.trueClass ? "#10b981" : "#f43f5e"}
                dim={32}
              />
              {s.userPrediction === s.trueClass ? (
                <CheckCircle className="h-3 w-3 text-[#10b981]" />
              ) : (
                <XCircle className="h-3 w-3 text-[#f43f5e]" />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Score:{" "}
          <span className="font-bold text-foreground">
            {score.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── GAME 2 COMPONENT ──────────────────────────────────────────────────────────
function AutomationDesignerGame({ config, onGameEnd }: Props) {
  const levelCount =
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 4;
  const levels = CONVEYOR_LEVELS.slice(0, levelCount);
  const [levelIdx, setLevelIdx] = useState(0);
  const [objIdx, setObjIdx] = useState(0);
  const [selectedBin, setSelectedBin] = useState<BinId | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const acc = total > 0 ? (correct / total) * 100 : 0;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const level = levels[levelIdx];
  const obj = level.objects[objIdx];

  function handleBinSelect(bin: BinId) {
    if (answered || !gameStarted) return;
    const correctBin = getBinForObject(obj, level.rules);
    const isCorrect = bin === correctBin;
    setSelectedBin(bin);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (isCorrect) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1000);
        return nl;
      });
    setTimeout(() => {
      const nextObj = objIdx + 1;
      if (nextObj >= level.objects.length) {
        const nextLevel = levelIdx + 1;
        if (nextLevel >= levels.length) {
          endGame(true);
          return;
        }
        setLevelIdx(nextLevel);
        setObjIdx(0);
      } else setObjIdx(nextObj);
      setSelectedBin(null);
      setAnswered(false);
    }, 1600);
  }

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="automation_designer.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Brain
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#10b981" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981" }}
          >
            Factory Automation Designer
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Objects arrive on a conveyor belt. Apply IF-THEN automation rules to
            sort them into the correct bins. Wrong sorting triggers a defect
            alert.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Read the rules carefully. Each level adds more complex sorting
            logic.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="automation_designer.start_button"
          >
            Start Factory
          </GlowButton>
        </motion.div>
      </div>
    );

  const correctBin = getBinForObject(obj, level.rules);
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="automation_designer.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Brain className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981" }}
        >
          Level {levelIdx + 1}: {level.title}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>

      {/* Rules panel */}
      <div className="glass-card rounded-xl p-3 shrink-0 border border-[#10b981]/30">
        <p
          className="text-xs font-bold mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981" }}
        >
          SORTING RULES
        </p>
        <div className="flex flex-col gap-1">
          {level.rules.map((r, i) => (
            <div
              key={i}
              className="text-xs px-2 py-1 rounded-lg bg-card/40"
              style={{ color: "#f59e0b" }}
            >
              {r.condition}
            </div>
          ))}
        </div>
      </div>

      {/* Conveyor belt */}
      <div className="glass-card rounded-xl p-4 shrink-0 flex items-center justify-center gap-6">
        <p
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          ON BELT
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${levelIdx}-${objIdx}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="flex flex-col items-center gap-2"
          >
            <svg width="64" height="64" viewBox="0 0 64 64">
              {obj.shape === "circle" && (
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill={`${OBJ_COLORS[obj.color]}30`}
                  stroke={OBJ_COLORS[obj.color]}
                  strokeWidth="3"
                />
              )}
              {obj.shape === "square" && (
                <rect
                  x="8"
                  y="8"
                  width="48"
                  height="48"
                  rx="4"
                  fill={`${OBJ_COLORS[obj.color]}30`}
                  stroke={OBJ_COLORS[obj.color]}
                  strokeWidth="3"
                />
              )}
              {obj.shape === "triangle" && (
                <polygon
                  points="32,6 58,58 6,58"
                  fill={`${OBJ_COLORS[obj.color]}30`}
                  stroke={OBJ_COLORS[obj.color]}
                  strokeWidth="3"
                />
              )}
              {obj.shape === "pentagon" && (
                <polygon
                  points="32,4 56,20 48,52 16,52 8,20"
                  fill={`${OBJ_COLORS[obj.color]}30`}
                  stroke={OBJ_COLORS[obj.color]}
                  strokeWidth="3"
                />
              )}
            </svg>
            <p className="text-xs text-muted-foreground capitalize">
              {obj.color} {obj.shape} ({obj.size})
            </p>
            <p className="text-xs text-muted-foreground">
              Object {objIdx + 1}/{level.objects.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bins */}
      <div className="shrink-0">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          SELECT DESTINATION BIN
        </p>
        <div className="grid grid-cols-4 gap-2">
          {level.bins.map((bin) => {
            let bc = "border-border/30 hover:border-[#10b981]/60";
            if (answered) {
              if (bin === correctBin) bc = "border-[#10b981] bg-[#10b981]/15";
              else if (bin === selectedBin)
                bc = "border-[#f43f5e] bg-[#f43f5e]/15";
            }
            return (
              <motion.button
                type="button"
                key={bin}
                whileHover={!answered ? { scale: 1.06 } : {}}
                whileTap={!answered ? { scale: 0.95 } : {}}
                onClick={() => handleBinSelect(bin)}
                disabled={answered}
                className={`rounded-xl border-2 py-4 text-xl font-black transition-all ${bc}`}
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "#10b981",
                }}
                data-ocid={`automation_designer.bin.${bin}`}
              >
                {bin}
                {answered && bin === correctBin && (
                  <CheckCircle className="h-4 w-4 mx-auto mt-1 text-[#10b981]" />
                )}
                {answered && bin === selectedBin && bin !== correctBin && (
                  <XCircle className="h-4 w-4 mx-auto mt-1 text-[#f43f5e]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── GAME 3 COMPONENT ──────────────────────────────────────────────────────────
function AIEthicsGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const scenarios = ETHICS_SCENARIOS.slice(0, count);
  const [idx, setIdx] = useState(0);
  const [biasSelected, setBiasSelected] = useState<number | null>(null);
  const [fixSelected, setFixSelected] = useState<number | null>(null);
  const [biasAnswered, setBiasAnswered] = useState(false);
  const [fixAnswered, setFixAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const acc = total > 0 ? (correct / total) * 100 : 0;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const sc = scenarios[idx];

  function handleBiasAnswer(optIdx: number) {
    if (biasAnswered || !gameStarted) return;
    setBiasSelected(optIdx);
    setBiasAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === sc.correctBiasIdx) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1000);
        return nl;
      });
  }

  function handleFixAnswer(optIdx: number) {
    if (fixAnswered || !biasAnswered || !gameStarted) return;
    setFixSelected(optIdx);
    setFixAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === sc.correctFixIdx) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1000);
        return nl;
      });
    setTimeout(() => {
      const n = idx + 1;
      if (n >= scenarios.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setBiasSelected(null);
      setFixSelected(null);
      setBiasAnswered(false);
      setFixAnswered(false);
    }, 2000);
  }

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="ai_ethics.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Brain
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f59e0b" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
          >
            AI Ethics Lab
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Real-world AI bias scenarios are presented. Identify the type of
            bias, then propose the correct fairness intervention.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Critical AI literacy: understanding bias types is essential for
            responsible AI deployment.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="ai_ethics.start_button"
          >
            Analyze Cases
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="ai_ethics.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Brain className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
        >
          Case {idx + 1}/{scenarios.length}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sc.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex flex-col gap-3 flex-1"
        >
          <div className="glass-card rounded-xl p-3 shrink-0 border border-[#f59e0b]/30">
            <p
              className="text-xs font-bold mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
            >
              CASE: {sc.title}
            </p>
            <p className="text-sm text-foreground">{sc.scenario}</p>
          </div>

          <div className="shrink-0">
            <p
              className="text-xs font-bold mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" }}
            >
              STEP 1: Identify the type of AI bias
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sc.biasTypeOptions.map((opt, i) => {
                let bc = "border-border/30 hover:border-[#f59e0b]/40";
                if (biasAnswered) {
                  if (i === sc.correctBiasIdx)
                    bc = "border-[#10b981] bg-[#10b981]/10";
                  else if (i === biasSelected)
                    bc = "border-[#f43f5e] bg-[#f43f5e]/10";
                }
                return (
                  <motion.button
                    type="button"
                    key={`b-${i}`}
                    whileHover={!biasAnswered ? { scale: 1.02 } : {}}
                    whileTap={!biasAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleBiasAnswer(i)}
                    disabled={biasAnswered}
                    className={`glass-card rounded-xl p-2 border text-xs font-bold transition-all ${bc}`}
                    data-ocid={`ai_ethics.bias.${i + 1}`}
                  >
                    <div className="flex items-center gap-1">
                      {biasAnswered && i === sc.correctBiasIdx && (
                        <CheckCircle className="h-3 w-3 text-[#10b981]" />
                      )}
                      {biasAnswered &&
                        i === biasSelected &&
                        i !== sc.correctBiasIdx && (
                          <XCircle className="h-3 w-3 text-[#f43f5e]" />
                        )}
                      {opt}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {biasAnswered && (
            <div className="shrink-0">
              <p
                className="text-xs font-bold mb-2"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "#00f5ff",
                }}
              >
                STEP 2: Propose a fairness fix
              </p>
              <div className="grid grid-cols-1 gap-2">
                {sc.fixOptions.map((opt, i) => {
                  let bc = "border-border/30 hover:border-[#00f5ff]/40";
                  if (fixAnswered) {
                    if (i === sc.correctFixIdx)
                      bc = "border-[#10b981] bg-[#10b981]/10";
                    else if (i === fixSelected)
                      bc = "border-[#f43f5e] bg-[#f43f5e]/10";
                  }
                  return (
                    <motion.button
                      type="button"
                      key={`f-${i}`}
                      whileHover={!fixAnswered ? { scale: 1.01 } : {}}
                      whileTap={!fixAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handleFixAnswer(i)}
                      disabled={fixAnswered}
                      className={`glass-card rounded-xl p-2 border text-xs font-bold transition-all text-left ${bc}`}
                      data-ocid={`ai_ethics.fix.${i + 1}`}
                    >
                      <div className="flex items-start gap-1">
                        {fixAnswered && i === sc.correctFixIdx && (
                          <CheckCircle className="h-3 w-3 text-[#10b981] shrink-0 mt-0.5" />
                        )}
                        {fixAnswered &&
                          i === fixSelected &&
                          i !== sc.correctFixIdx && (
                            <XCircle className="h-3 w-3 text-[#f43f5e] shrink-0 mt-0.5" />
                          )}
                        {opt}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence>
            {fixAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-xl p-3 shrink-0 border border-[#00f5ff]/30"
              >
                <p className="text-xs text-[#00f5ff]">
                  <span className="font-bold">Explanation: </span>
                  {sc.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── MAIN EXPORT
export default function AiAutomation(props: Props) {
  switch (props.config.gameId) {
    case "automation-designer":
      return <AutomationDesignerGame {...props} />;
    case "ai-ethics":
      return <AIEthicsGame {...props} />;
    default:
      return <MLTrainerGame {...props} />;
  }
}
