import { GlowButton } from "@/components/ui/GlowButton";
import { Activity, Heart, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Shared types ───────────────────────────────────────────────────────────
interface Organ {
  id: string;
  name: string;
  system: string;
  x: number;
  y: number;
  w: number;
  h: number;
  functions: string[];
  diseases: string[];
  color: string;
}

interface Scenario {
  diagnosis: string;
  targetOrganId: string;
  question: string;
  answers: string[];
  correctAnswer: number;
}

// ─── Game 1: Anatomy Surgeon ─────────────────────────────────────────────────
const ORGANS: Organ[] = [
  {
    id: "brain",
    name: "Brain",
    system: "Nervous",
    x: 42,
    y: 3,
    w: 16,
    h: 12,
    functions: [
      "Controls body functions",
      "Processes sensory info",
      "Memory and cognition",
    ],
    diseases: ["Meningitis", "Stroke", "Epilepsy"],
    color: "#7c3aed",
  },
  {
    id: "heart",
    name: "Heart",
    system: "Circulatory",
    x: 38,
    y: 30,
    w: 14,
    h: 13,
    functions: ["Pumps blood", "Circulates oxygen", "Maintains blood pressure"],
    diseases: ["Heart attack", "Arrhythmia", "Heart failure"],
    color: "#f43f5e",
  },
  {
    id: "lungs",
    name: "Lungs",
    system: "Respiratory",
    x: 24,
    y: 28,
    w: 14,
    h: 16,
    functions: ["Gas exchange", "Oxygenates blood", "Removes CO2"],
    diseases: ["Pneumonia", "Asthma", "Bronchitis"],
    color: "#06b6d4",
  },
  {
    id: "lungs_r",
    name: "Lungs (R)",
    system: "Respiratory",
    x: 62,
    y: 28,
    w: 14,
    h: 16,
    functions: ["Gas exchange", "Oxygenates blood", "Removes CO2"],
    diseases: ["Pneumonia", "Asthma", "Bronchitis"],
    color: "#06b6d4",
  },
  {
    id: "stomach",
    name: "Stomach",
    system: "Digestive",
    x: 36,
    y: 48,
    w: 15,
    h: 12,
    functions: ["Breaks down food", "Produces acid", "Protein digestion"],
    diseases: ["Gastritis", "Ulcer", "GERD"],
    color: "#f59e0b",
  },
  {
    id: "liver",
    name: "Liver",
    system: "Digestive",
    x: 54,
    y: 44,
    w: 15,
    h: 13,
    functions: ["Detoxifies blood", "Produces bile", "Stores glycogen"],
    diseases: ["Hepatitis", "Cirrhosis", "Fatty liver"],
    color: "#84cc16",
  },
  {
    id: "kidneys",
    name: "Kidneys",
    system: "Excretory",
    x: 28,
    y: 58,
    w: 10,
    h: 10,
    functions: ["Filters blood", "Produces urine", "Regulates blood pressure"],
    diseases: ["Kidney stones", "Nephritis", "CKD"],
    color: "#f97316",
  },
  {
    id: "kidneys_r",
    name: "Kidneys (R)",
    system: "Excretory",
    x: 62,
    y: 58,
    w: 10,
    h: 10,
    functions: ["Filters blood", "Produces urine", "Regulates blood pressure"],
    diseases: ["Kidney stones", "Nephritis", "CKD"],
    color: "#f97316",
  },
  {
    id: "small_intestine",
    name: "Small Intestine",
    system: "Digestive",
    x: 38,
    y: 60,
    w: 14,
    h: 14,
    functions: ["Absorbs nutrients", "Final digestion", "Enzyme secretion"],
    diseases: ["Crohn's disease", "Celiac disease", "IBS"],
    color: "#a855f7",
  },
];

const D1_SCENARIOS: Scenario[] = [
  {
    diagnosis: "Patient has irregular heartbeat and chest pain.",
    targetOrganId: "heart",
    question: "Which organ is responsible for pumping blood?",
    answers: ["Brain", "Heart", "Lungs", "Liver"],
    correctAnswer: 1,
  },
  {
    diagnosis: "Patient cannot breathe properly, oxygen levels are low.",
    targetOrganId: "lungs",
    question: "Which organ performs gas exchange?",
    answers: ["Heart", "Stomach", "Lungs", "Brain"],
    correctAnswer: 2,
  },
  {
    diagnosis: "Patient has severe headache, confusion, and memory loss.",
    targetOrganId: "brain",
    question: "Which organ controls all body functions?",
    answers: ["Liver", "Brain", "Heart", "Kidneys"],
    correctAnswer: 1,
  },
  {
    diagnosis: "Patient cannot digest food properly, stomach acid is low.",
    targetOrganId: "stomach",
    question: "Which organ breaks down food using acid?",
    answers: ["Liver", "Kidneys", "Stomach", "Brain"],
    correctAnswer: 2,
  },
  {
    diagnosis: "Patient has high toxin levels and yellow skin (jaundice).",
    targetOrganId: "liver",
    question: "Which organ detoxifies the blood and produces bile?",
    answers: ["Stomach", "Liver", "Heart", "Lungs"],
    correctAnswer: 1,
  },
];

const D2_SCENARIOS: Scenario[] = [
  {
    diagnosis: "Patient presents with hematuria and flank pain.",
    targetOrganId: "kidneys",
    question: "Which organ filters waste from the blood and produces urine?",
    answers: ["Stomach", "Liver", "Kidneys", "Lungs"],
    correctAnswer: 2,
  },
  {
    diagnosis: "Malabsorption syndrome — nutrients not being absorbed.",
    targetOrganId: "small_intestine",
    question: "Where does final nutrient absorption occur?",
    answers: ["Stomach", "Small Intestine", "Liver", "Brain"],
    correctAnswer: 1,
  },
  {
    diagnosis: "Patient shows signs of arrhythmia and valve dysfunction.",
    targetOrganId: "heart",
    question:
      "What organ maintains circulatory pressure via rhythmic contractions?",
    answers: ["Brain", "Kidneys", "Heart", "Lungs"],
    correctAnswer: 2,
  },
];

const D3_SCENARIOS: Scenario[] = [
  {
    diagnosis: "Bilateral pleural effusion with dyspnea and cyanosis.",
    targetOrganId: "lungs",
    question:
      "Hypoxia results from failure of which organ's gas-exchange function?",
    answers: ["Heart", "Liver", "Brain", "Lungs"],
    correctAnswer: 3,
  },
  {
    diagnosis: "Elevated AST/ALT enzymes, portal hypertension observed.",
    targetOrganId: "liver",
    question: "Elevated hepatic enzymes indicate dysfunction of which organ?",
    answers: ["Kidneys", "Liver", "Stomach", "Heart"],
    correctAnswer: 1,
  },
  {
    diagnosis: "Patient presents with GFR below 15 — end-stage renal failure.",
    targetOrganId: "kidneys",
    question:
      "Glomerular filtration rate (GFR) measures which organ's function?",
    answers: ["Lungs", "Brain", "Kidneys", "Liver"],
    correctAnswer: 2,
  },
];

// ─── Game 2: Body Systems ────────────────────────────────────────────────────
interface SystemQ {
  functionDesc: string;
  correctSystem: string;
  correctOrgan: string;
  systems: string[];
  organs: string[];
}

const SYSTEM_QUESTIONS: SystemQ[] = [
  {
    functionDesc: "Pumps blood and distributes oxygen throughout the body",
    correctSystem: "Circulatory",
    correctOrgan: "Heart",
    systems: ["Circulatory", "Respiratory", "Nervous", "Digestive"],
    organs: ["Heart", "Lungs", "Brain", "Liver"],
  },
  {
    functionDesc: "Filters waste from blood and regulates water balance",
    correctSystem: "Excretory",
    correctOrgan: "Kidneys",
    systems: ["Excretory", "Circulatory", "Digestive", "Endocrine"],
    organs: ["Kidneys", "Heart", "Stomach", "Pancreas"],
  },
  {
    functionDesc: "Receives and processes sound signals",
    correctSystem: "Nervous",
    correctOrgan: "Brain",
    systems: ["Nervous", "Sensory", "Circulatory", "Respiratory"],
    organs: ["Brain", "Ear", "Lungs", "Spinal Cord"],
  },
  {
    functionDesc: "Coordinates all voluntary and involuntary movement",
    correctSystem: "Nervous",
    correctOrgan: "Brain",
    systems: ["Nervous", "Muscular", "Skeletal", "Endocrine"],
    organs: ["Brain", "Spinal Cord", "Muscles", "Adrenal Glands"],
  },
  {
    functionDesc: "Exchanges oxygen and carbon dioxide with the atmosphere",
    correctSystem: "Respiratory",
    correctOrgan: "Lungs",
    systems: ["Respiratory", "Circulatory", "Excretory", "Digestive"],
    organs: ["Lungs", "Heart", "Kidneys", "Stomach"],
  },
  {
    functionDesc: "Breaks down food into nutrients for absorption",
    correctSystem: "Digestive",
    correctOrgan: "Stomach",
    systems: ["Digestive", "Excretory", "Circulatory", "Endocrine"],
    organs: ["Stomach", "Liver", "Pancreas", "Small Intestine"],
  },
  {
    functionDesc: "Regulates blood sugar using hormone secretion",
    correctSystem: "Endocrine",
    correctOrgan: "Pancreas",
    systems: ["Endocrine", "Digestive", "Nervous", "Circulatory"],
    organs: ["Pancreas", "Stomach", "Brain", "Liver"],
  },
  {
    functionDesc: "Detoxifies blood and produces bile for fat digestion",
    correctSystem: "Digestive",
    correctOrgan: "Liver",
    systems: ["Digestive", "Excretory", "Circulatory", "Immune"],
    organs: ["Liver", "Kidneys", "Heart", "Spleen"],
  },
  {
    functionDesc: "Absorbs nutrients from digested food into the bloodstream",
    correctSystem: "Digestive",
    correctOrgan: "Small Intestine",
    systems: ["Digestive", "Circulatory", "Excretory", "Respiratory"],
    organs: ["Small Intestine", "Large Intestine", "Stomach", "Liver"],
  },
  {
    functionDesc: "Produces red blood cells and stores calcium",
    correctSystem: "Skeletal",
    correctOrgan: "Bone Marrow",
    systems: ["Skeletal", "Circulatory", "Muscular", "Immune"],
    organs: ["Bone Marrow", "Spleen", "Liver", "Lymph Nodes"],
  },
  {
    functionDesc: "Produces antibodies to fight bacterial infection",
    correctSystem: "Immune",
    correctOrgan: "White Blood Cells",
    systems: ["Immune", "Circulatory", "Lymphatic", "Nervous"],
    organs: ["White Blood Cells", "Platelets", "Red Blood Cells", "Plasma"],
  },
  {
    functionDesc: "Controls heart rate and breathing during stress",
    correctSystem: "Nervous",
    correctOrgan: "Adrenal Glands",
    systems: ["Nervous", "Endocrine", "Circulatory", "Muscular"],
    organs: ["Adrenal Glands", "Brain", "Heart", "Thyroid"],
  },
  {
    functionDesc: "Carries oxygen in the blood via iron-containing protein",
    correctSystem: "Circulatory",
    correctOrgan: "Red Blood Cells",
    systems: ["Circulatory", "Respiratory", "Immune", "Skeletal"],
    organs: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"],
  },
  {
    functionDesc: "Secretes thyroid hormone to regulate metabolism",
    correctSystem: "Endocrine",
    correctOrgan: "Thyroid",
    systems: ["Endocrine", "Nervous", "Digestive", "Muscular"],
    organs: ["Thyroid", "Pituitary", "Adrenal Glands", "Pancreas"],
  },
  {
    functionDesc: "Protects internal organs and enables movement via joints",
    correctSystem: "Skeletal",
    correctOrgan: "Skeleton",
    systems: ["Skeletal", "Muscular", "Nervous", "Connective"],
    organs: ["Skeleton", "Muscles", "Cartilage", "Tendons"],
  },
];

// ─── Game 3: Health Defender ─────────────────────────────────────────────────
interface Pathogen {
  label: string;
  type: "BACTERIA" | "VIRUS" | "FUNGUS" | "PARASITE";
  color: string;
  responses: string[];
  correctResponse: number;
}

const PATHOGENS: Pathogen[] = [
  {
    label: "Streptococcus",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Neutrophil Attack", "T-Cell Response", "Antifungal Drug"],
    correctResponse: 0,
  },
  {
    label: "Influenza Virus",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "T-Cell Response", "Antifungal Drug"],
    correctResponse: 1,
  },
  {
    label: "Candida Albicans",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Neutrophil Attack", "T-Cell Response", "Antifungal Drug"],
    correctResponse: 2,
  },
  {
    label: "Malaria Parasite",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antibiotic", "Antimalarial Drug", "T-Cell Response"],
    correctResponse: 1,
  },
  {
    label: "E. coli",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Antibiotic", "Antiviral Drug", "Antifungal Drug"],
    correctResponse: 0,
  },
  {
    label: "HIV",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "Antiretroviral Therapy", "Antifungal Drug"],
    correctResponse: 1,
  },
  {
    label: "Ringworm Fungus",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Antifungal Cream", "Antibiotic", "Neutrophil Attack"],
    correctResponse: 0,
  },
  {
    label: "Tapeworm",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antiviral Drug", "Antiparasitic Drug", "T-Cell Response"],
    correctResponse: 1,
  },
  {
    label: "Tuberculosis",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Antifungal Drug", "TB Antibiotics", "Antiretroviral"],
    correctResponse: 1,
  },
  {
    label: "SARS-CoV-2",
    type: "VIRUS",
    color: "#7c3aed",
    responses: [
      "Antibiotic",
      "Antiviral + Vaccine Response",
      "Antifungal Drug",
    ],
    correctResponse: 1,
  },
  {
    label: "Salmonella",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Neutrophil Attack", "Antifungal Drug", "Antiviral Drug"],
    correctResponse: 0,
  },
  {
    label: "Herpes Simplex",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "Antiviral Acyclovir", "Antifungal Drug"],
    correctResponse: 1,
  },
  {
    label: "Aspergillus",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Antifungal Drug", "Antibiotic", "Antiviral Drug"],
    correctResponse: 0,
  },
  {
    label: "Giardia",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antibiotic", "Antiviral Drug", "Antiparasitic Drug"],
    correctResponse: 2,
  },
  {
    label: "Cholera",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Rehydration + Antibiotic", "Antifungal Drug", "T-Cell Only"],
    correctResponse: 0,
  },
  {
    label: "Dengue Fever",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "Antifungal Drug", "Supportive + Antiviral Care"],
    correctResponse: 2,
  },
  {
    label: "Athlete Foot",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Antifungal Treatment", "Antibiotic", "Antiviral Drug"],
    correctResponse: 0,
  },
  {
    label: "Roundworm",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antiviral Drug", "Antibiotic", "Antiparasitic Drug"],
    correctResponse: 2,
  },
  {
    label: "Pneumococcus",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Antibiotic Penicillin", "Antifungal Drug", "T-Cell Response"],
    correctResponse: 0,
  },
  {
    label: "Norovirus",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "T-Cell + Hydration", "Antifungal Drug"],
    correctResponse: 1,
  },
];

// ─── Props ───────────────────────────────────────────────────────────────────
type Phase = "start" | "identify" | "question" | "result";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function HumanBody({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  if (gameId === "body-systems")
    return <BodySystems config={config} onGameEnd={onGameEnd} />;
  if (gameId === "health-defender")
    return <HealthDefender config={config} onGameEnd={onGameEnd} />;
  return <AnatomySurgeon config={config} onGameEnd={onGameEnd} />;
}

// ============================================================================
// GAME 1 — Anatomy Surgeon
// ============================================================================
function AnatomySurgeon({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [patientHealth, setPatientHealth] = useState(100);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const scenarios =
    config.difficulty === 1
      ? D1_SCENARIOS
      : config.difficulty === 2
        ? D2_SCENARIOS
        : D3_SCENARIOS;
  const currentScenario = scenarios[scenarioIdx % scenarios.length];

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

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("identify");
    startTimer();
  }

  function handleOrganClick(organId: string) {
    if (flash !== "idle" || phase !== "identify") return;
    setSelected(organId);
    setTotal((t) => t + 1);
    if (organId === currentScenario.targetOrganId) {
      setFlash("correct");
      setFeedbackMsg("Correct organ identified! Now answer the question.");
      setTimeout(() => {
        setFlash("idle");
        setPhase("question");
      }, 800);
    } else {
      setFlash("wrong");
      const organ = ORGANS.find((o) => o.id === organId);
      setFeedbackMsg(`Wrong organ: ${organ?.name}. Patient health drops.`);
      setPatientHealth((h) => Math.max(0, h - 20));
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setSelected(null);
        setFeedbackMsg("");
      }, 1200);
    }
  }

  function handleAnswer(idx: number) {
    if (flash !== "idle" || phase !== "question") return;
    setTotal((t) => t + 1);
    if (idx === currentScenario.correctAnswer) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! +${pts} points`);
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setSelected(null);
        setScenarioIdx((i) => i + 1);
        setPhase("identify");
      }, 1000);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. Correct: ${currentScenario.answers[currentScenario.correctAnswer]}`,
      );
      setPatientHealth((h) => Math.max(0, h - 15));
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setSelected(null);
        setScenarioIdx((i) => i + 1);
        setPhase("identify");
      }, 1500);
    }
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;
  const healthColor =
    patientHealth > 60 ? "#10b981" : patientHealth > 30 ? "#f59e0b" : "#f43f5e";

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="human_body.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#00f5ff" }}>
          <Activity className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Patient:</span>
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${patientHealth}%`, background: healthColor }}
            />
          </div>
          <span className="text-xs tabular-nums" style={{ color: healthColor }}>
            {patientHealth}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className="h-4 w-4"
              style={{
                color: i < lives ? "#f43f5e" : undefined,
                fill: i < lives ? "#f43f5e" : undefined,
                opacity: i < lives ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
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
            <Activity
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#f43f5e" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#f43f5e",
                textShadow: "0 0 20px rgba(244,63,94,0.6)",
              }}
            >
              Anatomy Surgeon
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Read the diagnosis. Click the correct organ on the body diagram.
              Then answer a function question.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Wrong organ = patient health drops.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="human_body.start_button"
            >
              Begin Surgery
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "identify" || phase === "question") && (
        <div className="flex-1 flex gap-3 min-h-0">
          <div
            className="relative flex-1 glass rounded-xl border border-border/30 overflow-hidden"
            style={{ minHeight: 300 }}
          >
            <div className="scanlines absolute inset-0 pointer-events-none z-10" />
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ opacity: 0.15 }}
            >
              <ellipse cx="50" cy="9" rx="8" ry="9" fill="#888" />
              <rect x="38" y="18" width="24" height="3" rx="1.5" fill="#888" />
              <rect x="34" y="21" width="32" height="45" rx="4" fill="#888" />
              <rect x="20" y="22" width="14" height="36" rx="3" fill="#888" />
              <rect x="66" y="22" width="14" height="36" rx="3" fill="#888" />
              <rect x="38" y="66" width="11" height="28" rx="3" fill="#888" />
              <rect x="51" y="66" width="11" height="28" rx="3" fill="#888" />
            </svg>
            {ORGANS.map((organ) => {
              const isSelected = selected === organ.id;
              const isHovered = hovered === organ.id;
              return (
                <motion.button
                  key={organ.id}
                  type="button"
                  className="absolute rounded-lg border-2 transition-all cursor-pointer"
                  style={{
                    left: `${organ.x}%`,
                    top: `${organ.y}%`,
                    width: `${organ.w}%`,
                    height: `${organ.h}%`,
                    borderColor:
                      isSelected && flash === "correct"
                        ? "#10b981"
                        : isSelected && flash === "wrong"
                          ? "#f43f5e"
                          : isHovered
                            ? organ.color
                            : `${organ.color}55`,
                    background:
                      isHovered || isSelected
                        ? `${organ.color}25`
                        : `${organ.color}10`,
                    boxShadow: isHovered
                      ? `0 0 16px ${organ.color}60`
                      : undefined,
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHovered(organ.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleOrganClick(organ.id)}
                  data-ocid={`human_body.organ.${organ.id}`}
                >
                  {isHovered && (
                    <div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 glass rounded px-2 py-0.5 text-xs font-bold whitespace-nowrap z-20"
                      style={{
                        color: organ.color,
                        border: `1px solid ${organ.color}60`,
                      }}
                    >
                      {organ.name}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="w-72 flex flex-col gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={scenarioIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-xl p-4 border border-border/30"
              >
                <span
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'Orbitron',sans-serif" }}
                >
                  Diagnosis
                </span>
                <p className="mt-2 text-sm font-medium text-foreground leading-relaxed">
                  {currentScenario.diagnosis}
                </p>
                {phase === "identify" && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Click the affected organ on the diagram.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
            {phase === "question" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "border-border/30"}`}
              >
                <p className="text-sm font-semibold mb-3 text-foreground">
                  {currentScenario.question}
                </p>
                <div className="flex flex-col gap-2">
                  {currentScenario.answers.map((ans, i) => (
                    <button
                      key={`ans-${i}`}
                      type="button"
                      className="text-left px-3 py-2 rounded-lg border border-border/40 text-sm transition-all hover:border-[#00f5ff] hover:bg-[#00f5ff]/5 text-muted-foreground hover:text-foreground"
                      onClick={() => handleAnswer(i)}
                      data-ocid={`human_body.answer.${i}`}
                    >
                      <span className="font-mono text-xs mr-2 opacity-60">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {ans}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg px-3 py-2 text-xs font-medium ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}
              >
                {feedbackMsg}
              </motion.div>
            )}
            {hovered &&
              (() => {
                const organ = ORGANS.find((o) => o.id === hovered);
                if (!organ) return null;
                return (
                  <div className="glass rounded-xl p-3 border border-border/30">
                    <p
                      className="text-xs font-bold mb-1"
                      style={{ color: organ.color }}
                    >
                      {organ.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      System: {organ.system}
                    </p>
                    {config.difficulty >= 2 && (
                      <p className="text-xs text-muted-foreground">
                        {organ.functions[0]}
                      </p>
                    )}
                  </div>
                );
              })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2 — Body Systems
// ============================================================================
function BodySystems({ config, onGameEnd }: Props) {
  const total_q =
    config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 15;
  const questions = SYSTEM_QUESTIONS.slice(0, total_q);

  const [phase, setPhase] = useState<"start" | "system" | "organ" | "feedback">(
    "start",
  );
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [chosenSystem, setChosenSystem] = useState("");

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  const currentQ = questions[qIdx % questions.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("system");
    startTimer();
  }

  function handleSystemSelect(sys: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    setChosenSystem(sys);
    if (sys === currentQ.correctSystem) {
      setScore((s) => s + config.difficulty * 100);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg("Correct system! Now identify the specific organ.");
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("organ");
      }, 900);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong system. Correct: ${currentQ.correctSystem}. Try the organ anyway.`,
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("organ");
      }, 1400);
    }
  }

  function handleOrganSelect(org: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (org === currentQ.correctOrgan) {
      const pts =
        config.difficulty *
        (chosenSystem === currentQ.correctSystem ? 200 : 100);
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Perfect! ${org} is correct. +${pts} pts`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Incorrect. Correct organ: ${currentQ.correctOrgan}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      setChosenSystem("");
      const next = qIdx + 1;
      if (next >= questions.length) endGame(true);
      else {
        setQIdx(next);
        setPhase("system");
      }
    }, 1800);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="body_systems.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#06b6d4" }}>
          <Activity className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {qIdx + 1}/{questions.length}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className="h-4 w-4"
              style={{
                color: i < lives ? "#f43f5e" : undefined,
                fill: i < lives ? "#f43f5e" : undefined,
                opacity: i < lives ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
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
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
            <Activity
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
              Body Systems
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Read the body function description. Select the correct body
              system, then the specific organ responsible.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              {questions.length} questions — both correct = bonus points.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="body_systems.start_button"
            >
              Start Quiz
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "system" || phase === "organ" || phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Function Description
              </p>
              <p className="text-base font-semibold text-foreground mb-5 leading-relaxed">
                {currentQ.functionDesc}
              </p>

              {phase === "system" && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Step 1 — Select the body system:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {currentQ.systems.map((sys, i) => (
                      <button
                        key={`sys-${i}`}
                        type="button"
                        className="px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all"
                        onClick={() => handleSystemSelect(sys)}
                        data-ocid={`body_systems.system.${i}`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {(phase === "organ" || phase === "feedback") && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Step 2 — Select the specific organ:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {currentQ.organs.map((org, i) => (
                      <button
                        key={`org-${i}`}
                        type="button"
                        className="px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all"
                        onClick={() => handleOrganSelect(org)}
                        data-ocid={`body_systems.organ.${i}`}
                      >
                        {org}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl px-4 py-3 text-sm ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`}
            >
              {feedbackMsg}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 3 — Health Defender
// ============================================================================
function HealthDefender({ config, onGameEnd }: Props) {
  const totalPathogens = 20;
  const pathogenList = PATHOGENS.slice(0, totalPathogens);

  const [phase, setPhase] = useState<"start" | "playing" | "feedback">("start");
  const [pIdx, setPIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [progress, setProgress] = useState(0);

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  const currentP = pathogenList[pIdx % pathogenList.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;
  const pathogenProgressPct = (pIdx / pathogenList.length) * 100;

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }

  function handleResponse(idx: number) {
    if (flash !== "idle" || phase !== "playing") return;
    setTotal((t) => t + 1);
    if (idx === currentP.correctResponse) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Pathogen neutralized! +${pts} pts`);
      setProgress((p) => Math.min(100, p + 5));
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong response! Correct: ${currentP.responses[currentP.correctResponse]}`,
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) {
          endGame(false);
        }
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const next = pIdx + 1;
      if (next >= pathogenList.length) endGame(true);
      else {
        setPIdx(next);
        setPhase("playing");
      }
    }, 1800);
  }

  const typeColors: Record<string, string> = {
    BACTERIA: "#f43f5e",
    VIRUS: "#7c3aed",
    FUNGUS: "#f59e0b",
    PARASITE: "#10b981",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="health_defender.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Shield className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Cell Defense:</span>
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pathogenProgressPct}%`,
                background: "#10b981",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {pIdx}/{pathogenList.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shield
              key={`s-${i}`}
              className="h-4 w-4"
              style={{
                color: i < lives ? "#10b981" : undefined,
                fill: i < lives ? "#10b981" : undefined,
                opacity: i < lives ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
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
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
            <Shield
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
              Health Defender
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Pathogens are attacking a cell. Select the correct immune response
              before they break through.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              5 lives — 20 pathogens — choose wisely.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="health_defender.start_button"
            >
              Defend Cell
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "playing" || phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Pathogen display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pIdx}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "border-border/30"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span
                    className="text-xs uppercase tracking-widest font-black px-2 py-0.5 rounded"
                    style={{
                      background: `${typeColors[currentP.type]}20`,
                      color: typeColors[currentP.type],
                    }}
                  >
                    {currentP.type}
                  </span>
                  <h3
                    className="text-xl font-black mt-2"
                    style={{ color: typeColors[currentP.type] }}
                  >
                    {currentP.label}
                  </h3>
                </div>
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
                  style={{
                    borderColor: typeColors[currentP.type],
                    boxShadow: `0 0 20px ${typeColors[currentP.type]}60`,
                  }}
                >
                  <span
                    className="text-xs font-black text-center"
                    style={{ color: typeColors[currentP.type] }}
                  >
                    {currentP.type.slice(0, 3)}
                  </span>
                </div>
              </div>
              {/* Progress bar showing pathogen advancing */}
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: typeColors[currentP.type] }}
                  animate={{ width: ["0%", "85%"] }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Select the correct immune response before the pathogen reaches
                the cell:
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Response options */}
          <div className="grid grid-cols-1 gap-2">
            {currentP.responses.map((resp, i) => (
              <motion.button
                key={`resp-${i}`}
                type="button"
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-3 rounded-xl border-2 border-border/30 text-sm font-medium text-muted-foreground hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/5 transition-all"
                onClick={() => handleResponse(i)}
                data-ocid={`health_defender.response.${i}`}
              >
                {resp}
              </motion.button>
            ))}
          </div>

          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`}
            >
              {feedbackMsg}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
