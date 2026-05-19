import { GlowButton } from "@/components/ui/GlowButton";
import { FlaskConical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

type VarRole = "Independent" | "Dependent" | "Controlled" | null;
interface Variable {
  name: string;
  role: VarRole;
}
interface DataRow {
  trial: number;
  result: number | string;
  unit: string;
}
interface Experiment {
  title: string;
  background: string;
  hypotheses: string[];
  correctHypothesis: number;
  variables: Variable[];
  trialData: DataRow[];
  trend: string;
  conclusions: string[];
  correctConclusion: number;
}

const EXPERIMENTS: Experiment[] = [
  {
    title: "Effect of Fertiliser on Plant Growth",
    background:
      "A farmer wants to know if adding fertiliser increases the height of maize plants. He grows identical maize seeds in the same soil type and gives them the same amount of water and light. Only the amount of fertiliser added changes.",
    hypotheses: [
      "Adding more fertiliser will increase plant height.",
      "Water amount determines plant height.",
      "Sunlight has no effect on plants.",
    ],
    correctHypothesis: 0,
    variables: [
      { name: "Amount of fertiliser (g)", role: "Independent" },
      { name: "Height of plant (cm)", role: "Dependent" },
      { name: "Type of soil", role: "Controlled" },
      { name: "Volume of water (ml)", role: "Controlled" },
      { name: "Hours of light per day", role: "Controlled" },
    ],
    trialData: [
      { trial: 1, result: 12, unit: "cm" },
      { trial: 2, result: 18, unit: "cm" },
      { trial: 3, result: 25, unit: "cm" },
      { trial: 4, result: 31, unit: "cm" },
    ],
    trend:
      "Plant height increases as fertiliser amount increases (positive trend).",
    conclusions: [
      "More fertiliser leads to greater plant height — the hypothesis is supported.",
      "Plant height is unrelated to fertiliser use.",
      "Less fertiliser produces taller plants.",
    ],
    correctConclusion: 0,
  },
  {
    title: "Effect of Temperature on Dissolving Rate",
    background:
      "A student investigates whether water temperature affects how fast a sugar cube dissolves. The same brand of sugar cube is placed in beakers of water at different temperatures. Stirring speed and cube size are kept the same.",
    hypotheses: [
      "A hotter room dissolves sugar faster.",
      "Higher water temperature will increase the dissolving rate of sugar.",
      "Sugar does not dissolve in water.",
    ],
    correctHypothesis: 1,
    variables: [
      { name: "Water temperature (°C)", role: "Independent" },
      { name: "Time to dissolve (s)", role: "Dependent" },
      { name: "Size of sugar cube", role: "Controlled" },
      { name: "Volume of water (ml)", role: "Controlled" },
      { name: "Stirring speed", role: "Controlled" },
    ],
    trialData: [
      { trial: 1, result: 180, unit: "s (20°C)" },
      { trial: 2, result: 120, unit: "s (40°C)" },
      { trial: 3, result: 65, unit: "s (60°C)" },
      { trial: 4, result: 30, unit: "s (80°C)" },
    ],
    trend:
      "Dissolving time decreases as water temperature increases (negative trend).",
    conclusions: [
      "Temperature has no effect on dissolving rate.",
      "Higher temperature increases dissolving time.",
      "Higher water temperature decreases the time needed to dissolve sugar — hypothesis supported.",
    ],
    correctConclusion: 2,
  },
  {
    title: "Effect of Drop Height on Crater Size",
    background:
      "Scientists study meteorite impacts by dropping balls of clay from different heights onto a sand tray. The ball mass stays the same. Only the drop height changes.",
    hypotheses: [
      "Crater size is not affected by height.",
      "Heavier balls make bigger craters.",
      "A greater drop height will produce a larger crater diameter.",
    ],
    correctHypothesis: 2,
    variables: [
      { name: "Drop height (cm)", role: "Independent" },
      { name: "Crater diameter (cm)", role: "Dependent" },
      { name: "Mass of clay ball (g)", role: "Controlled" },
      { name: "Type of sand", role: "Controlled" },
      { name: "Surface area of sand tray", role: "Controlled" },
    ],
    trialData: [
      { trial: 1, result: 3.2, unit: "cm (20 cm drop)" },
      { trial: 2, result: 5.8, unit: "cm (40 cm drop)" },
      { trial: 3, result: 8.1, unit: "cm (60 cm drop)" },
      { trial: 4, result: 10.4, unit: "cm (80 cm drop)" },
    ],
    trend:
      "Crater diameter increases as drop height increases (positive trend).",
    conclusions: [
      "Drop height and crater size are not related.",
      "Greater drop height produces a larger crater — the hypothesis is supported.",
      "Mass of ball determines crater size, not height.",
    ],
    correctConclusion: 1,
  },
];

// ─── Game 2: data-analyst ─────────────────────────────────────────────────────
interface DataSet {
  title: string;
  hypothesis: string;
  conditions: string[];
  measurements: number[][];
  unit: string;
  pattern: "linear" | "curved" | "none";
  patternOptions: string[];
  supported: boolean;
  conclusion: string;
  conclusionOptions: string[];
}

const DATASETS: DataSet[] = [
  {
    title: "Water Volume vs Plant Height (4 weeks)",
    hypothesis: "More water leads to taller plants.",
    conditions: ["0 mL/day", "50 mL/day", "100 mL/day", "200 mL/day"],
    measurements: [
      [2, 2, 3, 3],
      [8, 9, 8, 10],
      [15, 16, 14, 17],
      [22, 23, 21, 24],
    ],
    unit: "cm",
    pattern: "linear",
    patternOptions: [
      "Linear increase",
      "Curved (diminishing returns)",
      "No clear relationship",
    ],
    supported: true,
    conclusion:
      "Hypothesis supported: more water correlates with greater height.",
    conclusionOptions: [
      "Hypothesis supported: more water correlates with greater height.",
      "Hypothesis refuted: water has no effect.",
      "Insufficient data to conclude.",
    ],
  },
  {
    title: "Temperature vs Enzyme Activity",
    hypothesis: "Enzyme activity increases with temperature.",
    conditions: ["20°C", "30°C", "40°C", "50°C"],
    measurements: [
      [12, 14, 13, 11],
      [28, 30, 27, 29],
      [45, 46, 44, 47],
      [21, 19, 22, 20],
    ],
    unit: "units/min",
    pattern: "curved",
    patternOptions: [
      "Linear increase",
      "Peaks then drops (curved)",
      "No clear relationship",
    ],
    supported: false,
    conclusion:
      "Hypothesis partially supported: activity peaks at 40°C then declines.",
    conclusionOptions: [
      "Hypothesis supported: activity always increases.",
      "Hypothesis partially supported: activity peaks at 40°C then declines.",
      "Data is random.",
    ],
  },
  {
    title: "Sunlight Hours vs Crop Yield",
    hypothesis: "More sunlight produces higher crop yield.",
    conditions: ["2 hrs", "4 hrs", "6 hrs", "8 hrs"],
    measurements: [
      [5, 4, 6, 5],
      [14, 15, 13, 16],
      [24, 25, 23, 26],
      [35, 34, 36, 33],
    ],
    unit: "kg",
    pattern: "linear",
    patternOptions: [
      "Linear increase",
      "Curved (diminishing returns)",
      "No clear relationship",
    ],
    supported: true,
    conclusion:
      "Hypothesis supported: yield increases steadily with sunlight hours.",
    conclusionOptions: [
      "Hypothesis supported: yield increases steadily with sunlight hours.",
      "Hypothesis refuted: yield is unrelated to sunlight.",
      "Sunlight only affects small plants.",
    ],
  },
  {
    title: "Fertiliser Concentration vs Root Length",
    hypothesis: "Higher fertiliser concentration increases root length.",
    conditions: ["0%", "1%", "2%", "4%"],
    measurements: [
      [10, 11, 9, 10],
      [18, 19, 17, 20],
      [18, 17, 19, 18],
      [10, 9, 11, 10],
    ],
    unit: "mm",
    pattern: "curved",
    patternOptions: [
      "Linear increase",
      "Peaks at 1-2% then declines (curved)",
      "No clear relationship",
    ],
    supported: false,
    conclusion:
      "Hypothesis partially refuted: optimal concentration is 1-2%; higher concentrations harm roots.",
    conclusionOptions: [
      "Hypothesis supported: all concentrations help.",
      "Hypothesis partially refuted: optimal concentration is 1-2%; higher concentrations harm roots.",
      "Root length is independent of fertiliser.",
    ],
  },
  {
    title: "Exercise Duration vs Resting Heart Rate",
    hypothesis: "Longer exercise training reduces resting heart rate.",
    conditions: ["0 wks", "4 wks", "8 wks", "12 wks"],
    measurements: [
      [78, 80, 79, 81],
      [74, 75, 73, 76],
      [68, 70, 67, 71],
      [63, 64, 62, 65],
    ],
    unit: "bpm",
    pattern: "linear",
    patternOptions: [
      "Linear decrease",
      "Peaked then levelled",
      "No clear relationship",
    ],
    supported: true,
    conclusion:
      "Hypothesis supported: resting heart rate decreases linearly with training duration.",
    conclusionOptions: [
      "Hypothesis supported: resting heart rate decreases linearly with training duration.",
      "Exercise has no effect on heart rate.",
      "Heart rate only changes in the first 4 weeks.",
    ],
  },
  {
    title: "Caffeine Dose vs Reaction Time",
    hypothesis: "Higher caffeine doses reduce reaction time.",
    conditions: ["0 mg", "50 mg", "100 mg", "200 mg"],
    measurements: [
      [420, 430, 410, 425],
      [380, 375, 385, 370],
      [350, 345, 355, 348],
      [355, 360, 352, 358],
    ],
    unit: "ms",
    pattern: "curved",
    patternOptions: [
      "Linear decrease",
      "Decreases then levels off (curved)",
      "No clear relationship",
    ],
    supported: false,
    conclusion:
      "Hypothesis partially supported: reaction time improves up to 100 mg but not beyond.",
    conclusionOptions: [
      "Hypothesis fully supported: all doses reduce reaction time equally.",
      "Hypothesis partially supported: reaction time improves up to 100 mg but not beyond.",
      "Caffeine has no statistical effect.",
    ],
  },
];

// ─── Game 3: scientific-method ────────────────────────────────────────────────
const METHOD_STEPS = [
  "Observe phenomenon",
  "Research background",
  "Form hypothesis",
  "Design experiment",
  "Collect data",
  "Analyse results",
  "Draw conclusions",
  "Communicate findings",
];
interface MethodScenario {
  title: string;
  actions: { description: string; step: string }[];
}
const METHOD_SCENARIOS: MethodScenario[] = [
  {
    title: "Plant near window grows faster",
    actions: [
      {
        description:
          "Student reads textbooks about photosynthesis and light requirements.",
        step: "Research background",
      },
      {
        description:
          "Student counts seeds germinated under sunlight vs. shade over 2 weeks.",
        step: "Collect data",
      },
      {
        description:
          "Student writes: plants receiving direct sunlight will germinate 30% faster.",
        step: "Form hypothesis",
      },
      {
        description:
          "Student notes: plant on windowsill grew 3 cm while others grew 1 cm.",
        step: "Observe phenomenon",
      },
      {
        description:
          "Student creates a table showing germination rates under 4 light conditions.",
        step: "Analyse results",
      },
      {
        description:
          "Student sets up 20 identical pots, half near window, half in dark corner.",
        step: "Design experiment",
      },
      {
        description:
          "Student presents findings at the school science fair with a poster.",
        step: "Communicate findings",
      },
      {
        description:
          "Student states: direct sunlight significantly accelerates germination in seedlings.",
        step: "Draw conclusions",
      },
    ],
  },
  {
    title: "Bridge design for maximum load",
    actions: [
      {
        description:
          "Engineer reads published load-testing studies for wooden bridges.",
        step: "Research background",
      },
      {
        description:
          "Engineer records that the old bridge cracked under a 2-tonne truck.",
        step: "Observe phenomenon",
      },
      {
        description:
          "Engineer states: a triangular truss design will support 3x more load.",
        step: "Form hypothesis",
      },
      {
        description:
          "Engineer builds 5 miniature bridge models with different truss patterns.",
        step: "Design experiment",
      },
      {
        description:
          "Engineer records breaking load for each model in newtons.",
        step: "Collect data",
      },
      {
        description:
          "Engineer calculates average load and standard deviation per design.",
        step: "Analyse results",
      },
      {
        description:
          "Engineer concludes the triangular truss is strongest by 40%.",
        step: "Draw conclusions",
      },
      {
        description: "Engineer publishes results in an engineering journal.",
        step: "Communicate findings",
      },
    ],
  },
];

const VAR_ROLES: VarRole[] = ["Independent", "Dependent", "Controlled"];
type ExStage = "hypothesis" | "variables" | "data" | "conclusion";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ScientificInvestigation({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // Game 1 state
  const [phase, setPhase] = useState<"start" | "experiment">("start");
  const [expIdx, setExpIdx] = useState(0);
  const [stage, setStage] = useState<ExStage>("hypothesis");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [assignedRoles, setAssignedRoles] = useState<Record<string, VarRole>>(
    {},
  );
  const [varFlash, setVarFlash] = useState<
    Record<string, "correct" | "wrong" | "idle">
  >({});
  const [trialsCollected, setTrialsCollected] = useState(0);
  const [selectedRole, setSelectedRole] = useState<VarRole>(null);

  // Game 2 state
  const [daPhase, setDaPhase] = useState<"start" | "play" | "done">("start");
  const [daIdx, setDaIdx] = useState(0);
  const [daStep, setDaStep] = useState<
    "pattern" | "means" | "hypothesis" | "conclusion"
  >("pattern");
  const [daScore, setDaScore] = useState(0);
  const [daFeedback, setDaFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [means, setMeans] = useState<number[]>([]);

  // Game 3 state
  const [smPhase, setSmPhase] = useState<"start" | "order" | "apply" | "done">(
    "start",
  );
  const [smOrder, setSmOrder] = useState<string[]>([]);
  const [shuffledSteps] = useState<string[]>(() => shuffle([...METHOD_STEPS]));
  const [smScenarioIdx] = useState(0);
  const [smActionAnswers, setSmActionAnswers] = useState<
    Record<number, string>
  >({});
  const [smFeedback, setSmFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [smScore, setSmScore] = useState(0);

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const exp = EXPERIMENTS[expIdx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  const progressPct = (timeLeft / config.timeLimit) * 100;
  const timerBarStyle = { width: `${progressPct}%` };

  // ── Game 1 handlers ──────────────────────────────────────────────────────
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("experiment");
    startTimer();
  }
  function handleHypothesis(idx: number) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === exp.correctHypothesis) {
      const pts = 100 * config.difficulty;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct hypothesis! +${pts} pts. Now identify the variables.`,
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setStage("variables");
        setAssignedRoles({});
        setVarFlash({});
      }, 1200);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Not the best hypothesis. Correct: "${exp.hypotheses[exp.correctHypothesis]}". Moving on.`,
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setStage("variables");
        setAssignedRoles({});
        setVarFlash({});
      }, 1600);
    }
  }
  function handleVarAssign(varName: string) {
    if (!selectedRole) return;
    const correct_role = exp.variables.find((v) => v.name === varName)?.role;
    const isCorrect = selectedRole === correct_role;
    const pts = isCorrect ? 40 * config.difficulty : 0;
    if (isCorrect) {
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    }
    setTotal((t) => t + 1);
    setAssignedRoles((prev) => ({ ...prev, [varName]: selectedRole }));
    setVarFlash((prev) => ({
      ...prev,
      [varName]: isCorrect ? "correct" : "wrong",
    }));
    const allDone = exp.variables.every((v) => {
      if (v.name === varName) return true;
      return (
        assignedRoles[v.name] !== undefined && assignedRoles[v.name] !== null
      );
    });
    if (allDone)
      setTimeout(() => {
        setStage("data");
        setTrialsCollected(0);
      }, 900);
  }
  function handleRunTrial() {
    if (trialsCollected >= exp.trialData.length) return;
    const next = trialsCollected + 1;
    setTrialsCollected(next);
    if (next >= exp.trialData.length)
      setTimeout(() => setStage("conclusion"), 600);
  }
  function handleConclusion(idx: number) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === exp.correctConclusion) {
      const pts = 150 * config.difficulty;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct conclusion! +${pts} pts`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Incorrect. Correct: "${exp.conclusions[exp.correctConclusion]}".`,
      );
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const nextExp = expIdx + 1;
      if (nextExp >= EXPERIMENTS.length) endGame(true);
      else {
        setExpIdx(nextExp);
        setStage("hypothesis");
        setAssignedRoles({});
        setVarFlash({});
        setTrialsCollected(0);
        setSelectedRole(null);
      }
    }, 1600);
  }

  // ── Game 2 handlers ──────────────────────────────────────────────────────
  const ds = DATASETS[daIdx % DATASETS.length];
  function computeMeans(data: number[][]): number[] {
    return data.map(
      (row) =>
        Math.round((row.reduce((a, b) => a + b, 0) / row.length) * 10) / 10,
    );
  }
  function daStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    startTimer();
    setMeans(computeMeans(ds.measurements));
    setDaPhase("play");
  }
  function handlePatternAnswer(opt: string) {
    if (daFeedback) return;
    const correct =
      opt ===
      ds.patternOptions[
        ds.pattern === "linear" ? 0 : ds.pattern === "curved" ? 1 : 2
      ];
    const pts = correct ? 100 * config.difficulty : 0;
    setDaScore((s) => s + pts);
    setScore((s) => s + pts);
    setDaFeedback({
      ok: correct,
      msg: correct
        ? `Correct pattern! +${pts} pts`
        : `Incorrect. The pattern is: ${ds.patternOptions[ds.pattern === "linear" ? 0 : 1]}`,
    });
    setTimeout(() => {
      setDaFeedback(null);
      setDaStep("means");
    }, 1800);
  }
  function handleMeansConfirm() {
    setDaStep("hypothesis");
  }
  function handleHypothesisAnswer(supported: boolean) {
    if (daFeedback) return;
    const correct = supported === ds.supported;
    const pts = correct ? 120 * config.difficulty : 0;
    setDaScore((s) => s + pts);
    setScore((s) => s + pts);
    setDaFeedback({
      ok: correct,
      msg: correct
        ? `Correct! +${pts} pts`
        : `Incorrect. The hypothesis was ${ds.supported ? "supported" : "refuted"}.`,
    });
    setTimeout(() => {
      setDaFeedback(null);
      setDaStep("conclusion");
    }, 1800);
  }
  function handleConclusionAnswer(opt: string) {
    if (daFeedback) return;
    const correct = opt === ds.conclusion;
    const pts = correct ? 150 * config.difficulty : 0;
    setDaScore((s) => s + pts);
    setScore((s) => s + pts);
    setDaFeedback({
      ok: correct,
      msg: correct
        ? `Correct! +${pts} pts`
        : `Correct answer: ${ds.conclusion}`,
    });
    setTimeout(() => {
      setDaFeedback(null);
      const nextIdx = daIdx + 1;
      if (nextIdx >= DATASETS.length) {
        setDaPhase("done");
        endGame(true);
      } else {
        setDaIdx(nextIdx);
        setDaStep("pattern");
        setMeans(computeMeans(DATASETS[nextIdx].measurements));
      }
    }, 2000);
  }

  // ── Game 3 handlers ──────────────────────────────────────────────────────
  const smScenario = METHOD_SCENARIOS[smScenarioIdx];
  function smStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    startTimer();
    setSmPhase("order");
  }
  function toggleStepOrder(step: string) {
    if (smOrder.includes(step)) setSmOrder((p) => p.filter((s) => s !== step));
    else if (smOrder.length < METHOD_STEPS.length)
      setSmOrder((p) => [...p, step]);
  }
  function submitOrder() {
    if (smOrder.length !== METHOD_STEPS.length) return;
    const correct = smOrder.every((s, i) => s === METHOD_STEPS[i]);
    const pts = correct
      ? 500 * config.difficulty
      : smOrder.filter((s, i) => s === METHOD_STEPS[i]).length *
        50 *
        config.difficulty;
    setSmScore((s) => s + pts);
    setScore((s) => s + pts);
    setSmFeedback({
      ok: correct,
      msg: correct
        ? `Perfect order! +${pts} pts`
        : `${smOrder.filter((s, i) => s === METHOD_STEPS[i]).length}/8 steps correct. +${pts} pts`,
    });
    setTimeout(() => {
      setSmFeedback(null);
      setSmPhase("apply");
    }, 2000);
  }
  function handleActionAnswer(actionIdx: number, step: string) {
    if (smActionAnswers[actionIdx] !== undefined) return;
    const correct = step === smScenario.actions[actionIdx].step;
    const pts = correct ? 80 * config.difficulty : 0;
    setSmScore((s) => s + pts);
    setScore((s) => s + pts);
    setSmActionAnswers((prev) => ({ ...prev, [actionIdx]: step }));
    if (Object.keys(smActionAnswers).length + 1 >= smScenario.actions.length) {
      setTimeout(() => {
        setSmPhase("done");
        endGame(true);
      }, 1500);
    }
  }

  const stageTitles: Record<ExStage, string> = {
    hypothesis: "Stage 1 — Form a Hypothesis",
    variables: "Stage 2 — Identify Variables",
    data: "Stage 3 — Collect Data",
    conclusion: "Stage 4 — Draw a Conclusion",
  };
  const flashBorder =
    flash === "correct"
      ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
      : flash === "wrong"
        ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        : "border-border/30";

  // ─── Game 2 render ────────────────────────────────────────────────────────
  if (gameId === "data-analyst") {
    return (
      <div
        className="w-full h-full flex flex-col gap-2 select-none"
        data-ocid="data_analyst.page"
      >
        <div className="game-hud flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2" style={{ color: "#06b6d4" }}>
            <FlaskConical className="h-4 w-4" />
            <span className="font-bold text-lg">
              {daScore.toLocaleString()}
            </span>
          </div>
          {daPhase === "play" && (
            <span className="text-xs text-muted-foreground">
              Dataset {daIdx + 1}/{DATASETS.length} — {daStep}
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

        {daPhase === "start" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
              <FlaskConical
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
                Data Analyst
              </h2>
              <p className="text-muted-foreground mb-2 text-sm">
                Analyse 6 real experiment datasets: identify patterns, calculate
                means, evaluate hypotheses, and draw conclusions.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={daStart}
                data-ocid="data_analyst.start_button"
              >
                Begin Analysis
              </GlowButton>
            </div>
          </motion.div>
        )}

        {daPhase === "play" && (
          <div className="flex-1 flex flex-col gap-3 overflow-auto">
            <div className="glass-card rounded-xl p-4 border border-border/30 shrink-0">
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                {ds.title}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Hypothesis:{" "}
                <span className="text-foreground font-medium">
                  {ds.hypothesis}
                </span>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left px-2 py-1.5 text-muted-foreground font-semibold">
                        Condition
                      </th>
                      {ds.measurements[0].map((_, i) => (
                        <th
                          key={i}
                          className="px-2 py-1.5 text-muted-foreground font-semibold"
                        >
                          Trial {i + 1}
                        </th>
                      ))}
                      <th
                        className="px-2 py-1.5 font-bold"
                        style={{ color: "#06b6d4" }}
                      >
                        Mean ({ds.unit})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ds.conditions.map((cond, ci) => (
                      <tr key={ci} className="border-t border-border/20">
                        <td className="px-2 py-1.5 font-semibold text-foreground">
                          {cond}
                        </td>
                        {ds.measurements[ci].map((val, vi) => (
                          <td
                            key={vi}
                            className="px-2 py-1.5 text-center text-muted-foreground"
                          >
                            {val}
                          </td>
                        ))}
                        <td
                          className="px-2 py-1.5 text-center font-bold"
                          style={{ color: "#06b6d4" }}
                        >
                          {means[ci] ?? "?"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={daStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="flex flex-col gap-3"
              >
                {daStep === "pattern" && (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      What pattern do you observe in the data?
                    </p>
                    {ds.patternOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#06b6d4] text-foreground disabled:opacity-50"
                        onClick={() => handlePatternAnswer(opt)}
                        disabled={!!daFeedback}
                        data-ocid={`data_analyst.pattern.${i + 1}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </>
                )}
                {daStep === "means" && (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      Review the calculated means above, then proceed.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      The mean for each condition is shown in the table. Compare
                      the values across conditions to understand the trend.
                    </p>
                    <GlowButton
                      variant="primary"
                      size="md"
                      onClick={handleMeansConfirm}
                      data-ocid="data_analyst.means_confirm_button"
                    >
                      Means Reviewed — Continue
                    </GlowButton>
                  </>
                )}
                {daStep === "hypothesis" && (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      Based on the data, is the hypothesis supported?
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Hypothesis: {ds.hypothesis}
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 px-4 py-3 rounded-xl border border-[#10b981]/40 text-sm font-bold text-[#10b981] hover:bg-[#10b981]/10 transition-all disabled:opacity-50"
                        onClick={() => handleHypothesisAnswer(true)}
                        disabled={!!daFeedback}
                        data-ocid="data_analyst.hypothesis_supported"
                      >
                        Supported
                      </button>
                      <button
                        type="button"
                        className="flex-1 px-4 py-3 rounded-xl border border-[#f43f5e]/40 text-sm font-bold text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-all disabled:opacity-50"
                        onClick={() => handleHypothesisAnswer(false)}
                        disabled={!!daFeedback}
                        data-ocid="data_analyst.hypothesis_refuted"
                      >
                        Refuted
                      </button>
                    </div>
                  </>
                )}
                {daStep === "conclusion" && (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      Select the best conclusion:
                    </p>
                    {ds.conclusionOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#06b6d4] text-foreground disabled:opacity-50"
                        onClick={() => handleConclusionAnswer(opt)}
                        disabled={!!daFeedback}
                        data-ocid={`data_analyst.conclusion.${i + 1}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </>
                )}
                {daFeedback && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      color: daFeedback.ok ? "#10b981" : "#f43f5e",
                      background: daFeedback.ok ? "#10b98115" : "#f43f5e15",
                      border: `1px solid ${daFeedback.ok ? "#10b981" : "#f43f5e"}`,
                    }}
                  >
                    {daFeedback.msg}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  // ─── Game 3 render ────────────────────────────────────────────────────────
  if (gameId === "scientific-method") {
    return (
      <div
        className="w-full h-full flex flex-col gap-2 select-none"
        data-ocid="scientific_method.page"
      >
        <div className="game-hud flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2" style={{ color: "#a855f7" }}>
            <FlaskConical className="h-4 w-4" />
            <span className="font-bold text-lg">
              {smScore.toLocaleString()}
            </span>
          </div>
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

        {smPhase === "start" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
              <FlaskConical
                className="h-14 w-14 mx-auto mb-4"
                style={{ color: "#a855f7" }}
              />
              <h2
                className="text-3xl font-black mb-3"
                style={{
                  fontFamily: "'Orbitron',sans-serif",
                  color: "#a855f7",
                  textShadow: "0 0 20px rgba(168,85,247,0.6)",
                }}
              >
                Scientific Method
              </h2>
              <p className="text-muted-foreground mb-2 text-sm">
                Part 1: Arrange the 8 steps of the scientific method in the
                correct order. Part 2: Match actions to their scientific method
                steps.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={smStart}
                data-ocid="scientific_method.start_button"
              >
                Begin Challenge
              </GlowButton>
            </div>
          </motion.div>
        )}

        {smPhase === "order" && (
          <div className="flex-1 flex flex-col gap-3 overflow-auto">
            <div className="glass-card rounded-xl p-4 border border-border/30">
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Part 1: Order the Steps
              </p>
              <p className="text-sm text-foreground">
                Click the steps in the correct order (1 → 8). Current order
                shown below.
              </p>
            </div>
            <div className="glass-card rounded-xl p-3 border border-border/30 min-h-12">
              <p className="text-xs text-muted-foreground mb-2">
                Your order ({smOrder.length}/8):
              </p>
              <div className="flex flex-wrap gap-1">
                {smOrder.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full font-bold"
                    style={{
                      background: "#a855f720",
                      color: "#a855f7",
                      border: "1px solid #a855f7",
                    }}
                  >
                    {i + 1}. {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {shuffledSteps.map((step, i) => {
                const selected = smOrder.includes(step);
                return (
                  <button
                    key={i}
                    type="button"
                    className="text-left px-4 py-2 rounded-xl border text-sm font-semibold transition-all"
                    style={
                      selected
                        ? {
                            borderColor: "#a855f7",
                            background: "#a855f720",
                            color: "#a855f7",
                          }
                        : {}
                    }
                    onClick={() => toggleStepOrder(step)}
                    data-ocid={`scientific_method.step.${i + 1}`}
                  >
                    {step}
                  </button>
                );
              })}
            </div>
            {smFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg px-3 py-2 text-xs font-medium"
                style={{
                  color: smFeedback.ok ? "#10b981" : "#f59e0b",
                  background: smFeedback.ok ? "#10b98115" : "#f59e0b15",
                  border: `1px solid ${smFeedback.ok ? "#10b981" : "#f59e0b"}`,
                }}
              >
                {smFeedback.msg}
              </motion.div>
            )}
            <GlowButton
              variant="primary"
              size="md"
              onClick={submitOrder}
              disabled={smOrder.length !== METHOD_STEPS.length}
              data-ocid="scientific_method.submit_order_button"
            >
              Submit Order
            </GlowButton>
          </div>
        )}

        {smPhase === "apply" && (
          <div className="flex-1 flex flex-col gap-3 overflow-auto">
            <div className="glass-card rounded-xl p-4 border border-border/30">
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Part 2: Apply the Method
              </p>
              <p className="text-sm font-bold text-foreground">
                Scenario: {smScenario.title}
              </p>
              <p className="text-xs text-muted-foreground">
                For each action described below, click which scientific method
                step it represents.
              </p>
            </div>
            {smScenario.actions.map((action, ai) => (
              <div
                key={ai}
                className="glass-card rounded-xl p-3 border border-border/30"
              >
                <p className="text-xs text-foreground mb-2">
                  {action.description}
                </p>
                {smActionAnswers[ai] !== undefined ? (
                  <p
                    className="text-xs font-bold"
                    style={{
                      color:
                        smActionAnswers[ai] === action.step
                          ? "#10b981"
                          : "#f43f5e",
                    }}
                  >
                    {smActionAnswers[ai] === action.step
                      ? `Correct: ${action.step}`
                      : `Wrong. Correct: ${action.step}`}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {METHOD_STEPS.map((step, si) => (
                      <button
                        key={si}
                        type="button"
                        className="text-xs px-2 py-1 rounded-full border border-border/40 hover:border-[#a855f7]/60 transition-all text-muted-foreground hover:text-foreground"
                        onClick={() => handleActionAnswer(ai, step)}
                        data-ocid={`scientific_method.action.${ai + 1}.step.${si + 1}`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Default: hypothesis-lab ────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="sci_investigation.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#a855f7" }}>
          <FlaskConical className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        {phase === "experiment" && (
          <span className="text-xs text-muted-foreground">
            Exp {expIdx + 1}/{EXPERIMENTS.length} — {stageTitles[stage]}
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

      {phase === "start" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
            <FlaskConical
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#a855f7" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#a855f7",
                textShadow: "0 0 20px rgba(168,85,247,0.6)",
              }}
            >
              Science Lab
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Complete 3 full scientific investigations: form hypotheses,
              classify variables, run trials, and draw conclusions.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Each stage earns points. Accuracy determines your final grade.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="sci_investigation.start_button"
            >
              Start Investigation
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "experiment" && (
        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-auto">
          <div className="glass-card rounded-xl p-4 border border-border/30 shrink-0">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              {exp.title}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {exp.background}
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage + expIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card rounded-xl p-5 border-2 ${flashBorder} transition-all`}
            >
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-4"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                {stageTitles[stage]}
              </p>
              {stage === "hypothesis" && (
                <div className="flex flex-col gap-2">
                  {exp.hypotheses.map((h, i) => (
                    <button
                      key={h}
                      type="button"
                      className="text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#a855f7] hover:bg-[#a855f7]/5 text-muted-foreground hover:text-foreground"
                      onClick={() => handleHypothesis(i)}
                      data-ocid={`sci_investigation.hypothesis.${i}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
              {stage === "variables" && (
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <p className="text-xs text-muted-foreground w-full mb-1">
                      Select a role, then click a variable to assign it:
                    </p>
                    {VAR_ROLES.map((role) => {
                      const roleColor =
                        role === "Independent"
                          ? "#06b6d4"
                          : role === "Dependent"
                            ? "#f59e0b"
                            : "#a855f7";
                      const isActive = selectedRole === role;
                      const roleStyle = isActive
                        ? {
                            borderColor: roleColor,
                            background: `${roleColor}20`,
                            color: roleColor,
                          }
                        : {};
                      return (
                        <button
                          key={role as string}
                          type="button"
                          className="px-3 py-1.5 rounded-lg border border-border/40 text-xs font-bold transition-all"
                          style={roleStyle}
                          onClick={() =>
                            setSelectedRole(isActive ? null : role)
                          }
                          data-ocid={`sci_investigation.role.${role}`}
                        >
                          {role as string}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-2">
                    {exp.variables.map((v, i) => {
                      const assigned = assignedRoles[v.name];
                      const vf = varFlash[v.name];
                      const varBorder =
                        vf === "correct"
                          ? "border-[#10b981] bg-[#10b981]/10"
                          : vf === "wrong"
                            ? "border-[#f43f5e] bg-[#f43f5e]/10"
                            : "border-border/40 hover:border-[#a855f7]/60";
                      const assignedColor =
                        assigned === "Independent"
                          ? "#06b6d4"
                          : assigned === "Dependent"
                            ? "#f59e0b"
                            : assigned === "Controlled"
                              ? "#a855f7"
                              : undefined;
                      const assignedStyle = assignedColor
                        ? { color: assignedColor }
                        : {};
                      return (
                        <button
                          key={v.name}
                          type="button"
                          className={`flex items-center justify-between px-4 py-2 rounded-lg border text-sm transition-all ${varBorder}`}
                          onClick={() => !assigned && handleVarAssign(v.name)}
                          data-ocid={`sci_investigation.variable.${i}`}
                        >
                          <span className="text-foreground">{v.name}</span>
                          {assigned ? (
                            <span
                              className="text-xs font-bold"
                              style={assignedStyle}
                            >
                              {assigned as string}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Click to assign
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {stage === "data" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click Run Trial to collect each data point. Observe the
                    results carefully.
                  </p>
                  <div className="w-full border border-border/30 rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/40">
                          <th className="text-left px-3 py-2 text-xs text-muted-foreground font-semibold">
                            Trial
                          </th>
                          <th className="text-left px-3 py-2 text-xs text-muted-foreground font-semibold">
                            Result
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {exp.trialData.slice(0, trialsCollected).map((row) => (
                          <motion.tr
                            key={row.trial}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="border-t border-border/20"
                          >
                            <td className="px-3 py-2 font-mono text-muted-foreground">
                              Trial {row.trial}
                            </td>
                            <td className="px-3 py-2 font-bold text-foreground">
                              {row.result} {row.unit}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {trialsCollected < exp.trialData.length ? (
                    <GlowButton
                      variant="secondary"
                      size="sm"
                      onClick={handleRunTrial}
                      data-ocid="sci_investigation.run_trial_button"
                    >
                      Run Trial {trialsCollected + 1}
                    </GlowButton>
                  ) : (
                    <div className="glass rounded-lg px-4 py-3 border border-[#10b981]/40">
                      <p className="text-xs font-bold text-[#10b981] mb-1">
                        Data Trend Observed
                      </p>
                      <p className="text-sm text-foreground">{exp.trend}</p>
                    </div>
                  )}
                </div>
              )}
              {stage === "conclusion" && (
                <div>
                  <div className="glass rounded-lg px-4 py-3 border border-border/30 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Data Trend
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {exp.trend}
                    </p>
                  </div>
                  <p className="text-sm font-semibold mb-3 text-foreground">
                    Based on the data, what is the best conclusion?
                  </p>
                  <div className="flex flex-col gap-2">
                    {exp.conclusions.map((c, i) => (
                      <button
                        key={c}
                        type="button"
                        className="text-left px-4 py-3 rounded-xl border border-border/40 text-sm transition-all hover:border-[#a855f7] hover:bg-[#a855f7]/5 text-muted-foreground hover:text-foreground"
                        onClick={() => handleConclusion(i)}
                        data-ocid={`sci_investigation.conclusion.${i}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg px-3 py-2 text-xs font-medium shrink-0 ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}
            >
              {feedbackMsg}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
