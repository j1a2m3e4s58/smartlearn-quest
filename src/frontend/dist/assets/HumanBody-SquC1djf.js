import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence, k as Shield } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { A as Activity } from "./activity-C-ksYUuo.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
const ORGANS = [
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
      "Memory and cognition"
    ],
    diseases: ["Meningitis", "Stroke", "Epilepsy"],
    color: "#7c3aed"
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
    color: "#f43f5e"
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
    color: "#06b6d4"
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
    color: "#06b6d4"
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
    color: "#f59e0b"
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
    color: "#84cc16"
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
    color: "#f97316"
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
    color: "#f97316"
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
    color: "#a855f7"
  }
];
const D1_SCENARIOS = [
  {
    diagnosis: "Patient has irregular heartbeat and chest pain.",
    targetOrganId: "heart",
    question: "Which organ is responsible for pumping blood?",
    answers: ["Brain", "Heart", "Lungs", "Liver"],
    correctAnswer: 1
  },
  {
    diagnosis: "Patient cannot breathe properly, oxygen levels are low.",
    targetOrganId: "lungs",
    question: "Which organ performs gas exchange?",
    answers: ["Heart", "Stomach", "Lungs", "Brain"],
    correctAnswer: 2
  },
  {
    diagnosis: "Patient has severe headache, confusion, and memory loss.",
    targetOrganId: "brain",
    question: "Which organ controls all body functions?",
    answers: ["Liver", "Brain", "Heart", "Kidneys"],
    correctAnswer: 1
  },
  {
    diagnosis: "Patient cannot digest food properly, stomach acid is low.",
    targetOrganId: "stomach",
    question: "Which organ breaks down food using acid?",
    answers: ["Liver", "Kidneys", "Stomach", "Brain"],
    correctAnswer: 2
  },
  {
    diagnosis: "Patient has high toxin levels and yellow skin (jaundice).",
    targetOrganId: "liver",
    question: "Which organ detoxifies the blood and produces bile?",
    answers: ["Stomach", "Liver", "Heart", "Lungs"],
    correctAnswer: 1
  }
];
const D2_SCENARIOS = [
  {
    diagnosis: "Patient presents with hematuria and flank pain.",
    targetOrganId: "kidneys",
    question: "Which organ filters waste from the blood and produces urine?",
    answers: ["Stomach", "Liver", "Kidneys", "Lungs"],
    correctAnswer: 2
  },
  {
    diagnosis: "Malabsorption syndrome — nutrients not being absorbed.",
    targetOrganId: "small_intestine",
    question: "Where does final nutrient absorption occur?",
    answers: ["Stomach", "Small Intestine", "Liver", "Brain"],
    correctAnswer: 1
  },
  {
    diagnosis: "Patient shows signs of arrhythmia and valve dysfunction.",
    targetOrganId: "heart",
    question: "What organ maintains circulatory pressure via rhythmic contractions?",
    answers: ["Brain", "Kidneys", "Heart", "Lungs"],
    correctAnswer: 2
  }
];
const D3_SCENARIOS = [
  {
    diagnosis: "Bilateral pleural effusion with dyspnea and cyanosis.",
    targetOrganId: "lungs",
    question: "Hypoxia results from failure of which organ's gas-exchange function?",
    answers: ["Heart", "Liver", "Brain", "Lungs"],
    correctAnswer: 3
  },
  {
    diagnosis: "Elevated AST/ALT enzymes, portal hypertension observed.",
    targetOrganId: "liver",
    question: "Elevated hepatic enzymes indicate dysfunction of which organ?",
    answers: ["Kidneys", "Liver", "Stomach", "Heart"],
    correctAnswer: 1
  },
  {
    diagnosis: "Patient presents with GFR below 15 — end-stage renal failure.",
    targetOrganId: "kidneys",
    question: "Glomerular filtration rate (GFR) measures which organ's function?",
    answers: ["Lungs", "Brain", "Kidneys", "Liver"],
    correctAnswer: 2
  }
];
const SYSTEM_QUESTIONS = [
  {
    functionDesc: "Pumps blood and distributes oxygen throughout the body",
    correctSystem: "Circulatory",
    correctOrgan: "Heart",
    systems: ["Circulatory", "Respiratory", "Nervous", "Digestive"],
    organs: ["Heart", "Lungs", "Brain", "Liver"]
  },
  {
    functionDesc: "Filters waste from blood and regulates water balance",
    correctSystem: "Excretory",
    correctOrgan: "Kidneys",
    systems: ["Excretory", "Circulatory", "Digestive", "Endocrine"],
    organs: ["Kidneys", "Heart", "Stomach", "Pancreas"]
  },
  {
    functionDesc: "Receives and processes sound signals",
    correctSystem: "Nervous",
    correctOrgan: "Brain",
    systems: ["Nervous", "Sensory", "Circulatory", "Respiratory"],
    organs: ["Brain", "Ear", "Lungs", "Spinal Cord"]
  },
  {
    functionDesc: "Coordinates all voluntary and involuntary movement",
    correctSystem: "Nervous",
    correctOrgan: "Brain",
    systems: ["Nervous", "Muscular", "Skeletal", "Endocrine"],
    organs: ["Brain", "Spinal Cord", "Muscles", "Adrenal Glands"]
  },
  {
    functionDesc: "Exchanges oxygen and carbon dioxide with the atmosphere",
    correctSystem: "Respiratory",
    correctOrgan: "Lungs",
    systems: ["Respiratory", "Circulatory", "Excretory", "Digestive"],
    organs: ["Lungs", "Heart", "Kidneys", "Stomach"]
  },
  {
    functionDesc: "Breaks down food into nutrients for absorption",
    correctSystem: "Digestive",
    correctOrgan: "Stomach",
    systems: ["Digestive", "Excretory", "Circulatory", "Endocrine"],
    organs: ["Stomach", "Liver", "Pancreas", "Small Intestine"]
  },
  {
    functionDesc: "Regulates blood sugar using hormone secretion",
    correctSystem: "Endocrine",
    correctOrgan: "Pancreas",
    systems: ["Endocrine", "Digestive", "Nervous", "Circulatory"],
    organs: ["Pancreas", "Stomach", "Brain", "Liver"]
  },
  {
    functionDesc: "Detoxifies blood and produces bile for fat digestion",
    correctSystem: "Digestive",
    correctOrgan: "Liver",
    systems: ["Digestive", "Excretory", "Circulatory", "Immune"],
    organs: ["Liver", "Kidneys", "Heart", "Spleen"]
  },
  {
    functionDesc: "Absorbs nutrients from digested food into the bloodstream",
    correctSystem: "Digestive",
    correctOrgan: "Small Intestine",
    systems: ["Digestive", "Circulatory", "Excretory", "Respiratory"],
    organs: ["Small Intestine", "Large Intestine", "Stomach", "Liver"]
  },
  {
    functionDesc: "Produces red blood cells and stores calcium",
    correctSystem: "Skeletal",
    correctOrgan: "Bone Marrow",
    systems: ["Skeletal", "Circulatory", "Muscular", "Immune"],
    organs: ["Bone Marrow", "Spleen", "Liver", "Lymph Nodes"]
  },
  {
    functionDesc: "Produces antibodies to fight bacterial infection",
    correctSystem: "Immune",
    correctOrgan: "White Blood Cells",
    systems: ["Immune", "Circulatory", "Lymphatic", "Nervous"],
    organs: ["White Blood Cells", "Platelets", "Red Blood Cells", "Plasma"]
  },
  {
    functionDesc: "Controls heart rate and breathing during stress",
    correctSystem: "Nervous",
    correctOrgan: "Adrenal Glands",
    systems: ["Nervous", "Endocrine", "Circulatory", "Muscular"],
    organs: ["Adrenal Glands", "Brain", "Heart", "Thyroid"]
  },
  {
    functionDesc: "Carries oxygen in the blood via iron-containing protein",
    correctSystem: "Circulatory",
    correctOrgan: "Red Blood Cells",
    systems: ["Circulatory", "Respiratory", "Immune", "Skeletal"],
    organs: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"]
  },
  {
    functionDesc: "Secretes thyroid hormone to regulate metabolism",
    correctSystem: "Endocrine",
    correctOrgan: "Thyroid",
    systems: ["Endocrine", "Nervous", "Digestive", "Muscular"],
    organs: ["Thyroid", "Pituitary", "Adrenal Glands", "Pancreas"]
  },
  {
    functionDesc: "Protects internal organs and enables movement via joints",
    correctSystem: "Skeletal",
    correctOrgan: "Skeleton",
    systems: ["Skeletal", "Muscular", "Nervous", "Connective"],
    organs: ["Skeleton", "Muscles", "Cartilage", "Tendons"]
  }
];
const PATHOGENS = [
  {
    label: "Streptococcus",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Neutrophil Attack", "T-Cell Response", "Antifungal Drug"],
    correctResponse: 0
  },
  {
    label: "Influenza Virus",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "T-Cell Response", "Antifungal Drug"],
    correctResponse: 1
  },
  {
    label: "Candida Albicans",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Neutrophil Attack", "T-Cell Response", "Antifungal Drug"],
    correctResponse: 2
  },
  {
    label: "Malaria Parasite",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antibiotic", "Antimalarial Drug", "T-Cell Response"],
    correctResponse: 1
  },
  {
    label: "E. coli",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Antibiotic", "Antiviral Drug", "Antifungal Drug"],
    correctResponse: 0
  },
  {
    label: "HIV",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "Antiretroviral Therapy", "Antifungal Drug"],
    correctResponse: 1
  },
  {
    label: "Ringworm Fungus",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Antifungal Cream", "Antibiotic", "Neutrophil Attack"],
    correctResponse: 0
  },
  {
    label: "Tapeworm",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antiviral Drug", "Antiparasitic Drug", "T-Cell Response"],
    correctResponse: 1
  },
  {
    label: "Tuberculosis",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Antifungal Drug", "TB Antibiotics", "Antiretroviral"],
    correctResponse: 1
  },
  {
    label: "SARS-CoV-2",
    type: "VIRUS",
    color: "#7c3aed",
    responses: [
      "Antibiotic",
      "Antiviral + Vaccine Response",
      "Antifungal Drug"
    ],
    correctResponse: 1
  },
  {
    label: "Salmonella",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Neutrophil Attack", "Antifungal Drug", "Antiviral Drug"],
    correctResponse: 0
  },
  {
    label: "Herpes Simplex",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "Antiviral Acyclovir", "Antifungal Drug"],
    correctResponse: 1
  },
  {
    label: "Aspergillus",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Antifungal Drug", "Antibiotic", "Antiviral Drug"],
    correctResponse: 0
  },
  {
    label: "Giardia",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antibiotic", "Antiviral Drug", "Antiparasitic Drug"],
    correctResponse: 2
  },
  {
    label: "Cholera",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Rehydration + Antibiotic", "Antifungal Drug", "T-Cell Only"],
    correctResponse: 0
  },
  {
    label: "Dengue Fever",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "Antifungal Drug", "Supportive + Antiviral Care"],
    correctResponse: 2
  },
  {
    label: "Athlete Foot",
    type: "FUNGUS",
    color: "#f59e0b",
    responses: ["Antifungal Treatment", "Antibiotic", "Antiviral Drug"],
    correctResponse: 0
  },
  {
    label: "Roundworm",
    type: "PARASITE",
    color: "#10b981",
    responses: ["Antiviral Drug", "Antibiotic", "Antiparasitic Drug"],
    correctResponse: 2
  },
  {
    label: "Pneumococcus",
    type: "BACTERIA",
    color: "#f43f5e",
    responses: ["Antibiotic Penicillin", "Antifungal Drug", "T-Cell Response"],
    correctResponse: 0
  },
  {
    label: "Norovirus",
    type: "VIRUS",
    color: "#7c3aed",
    responses: ["Antibiotic", "T-Cell + Hydration", "Antifungal Drug"],
    correctResponse: 1
  }
];
function HumanBody({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "body-systems")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BodySystems, { config, onGameEnd });
  if (gameId === "health-defender")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(HealthDefender, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnatomySurgeon, { config, onGameEnd });
}
function AnatomySurgeon({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [scenarioIdx, setScenarioIdx] = reactExports.useState(0);
  const [hovered, setHovered] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(null);
  const [flash, setFlash] = reactExports.useState("idle");
  const [patientHealth, setPatientHealth] = reactExports.useState(100);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const scenarios = config.difficulty === 1 ? D1_SCENARIOS : config.difficulty === 2 ? D2_SCENARIOS : D3_SCENARIOS;
  const currentScenario = scenarios[scenarioIdx % scenarios.length];
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("identify");
    startTimer();
  }
  function handleOrganClick(organId) {
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
      setFeedbackMsg(`Wrong organ: ${organ == null ? void 0 : organ.name}. Patient health drops.`);
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
  function handleAnswer(idx) {
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
      }, 1e3);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. Correct: ${currentScenario.answers[currentScenario.correctAnswer]}`
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
  const progressPct = timeLeft / config.timeLimit * 100;
  const healthColor = patientHealth > 60 ? "#10b981" : patientHealth > 30 ? "#f59e0b" : "#f43f5e";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "human_body.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Patient:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: { width: `${patientHealth}%`, background: healthColor }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums", style: { color: healthColor }, children: [
              patientHealth,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex flex-col items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Activity,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f43f5e" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#f43f5e",
                    textShadow: "0 0 20px rgba(244,63,94,0.6)"
                  },
                  children: "Anatomy Surgeon"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Read the diagnosis. Click the correct organ on the body diagram. Then answer a function question." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Wrong organ = patient health drops." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "human_body.start_button",
                  children: "Begin Surgery"
                }
              )
            ] })
          }
        ),
        (phase === "identify" || phase === "question") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative flex-1 glass rounded-xl border border-border/30 overflow-hidden",
              style: { minHeight: 300 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    viewBox: "0 0 100 100",
                    className: "absolute inset-0 w-full h-full",
                    style: { opacity: 0.15 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "9", rx: "8", ry: "9", fill: "#888" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "38", y: "18", width: "24", height: "3", rx: "1.5", fill: "#888" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "34", y: "21", width: "32", height: "45", rx: "4", fill: "#888" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "22", width: "14", height: "36", rx: "3", fill: "#888" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "66", y: "22", width: "14", height: "36", rx: "3", fill: "#888" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "38", y: "66", width: "11", height: "28", rx: "3", fill: "#888" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "51", y: "66", width: "11", height: "28", rx: "3", fill: "#888" })
                    ]
                  }
                ),
                ORGANS.map((organ) => {
                  const isSelected = selected === organ.id;
                  const isHovered = hovered === organ.id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      type: "button",
                      className: "absolute rounded-lg border-2 transition-all cursor-pointer",
                      style: {
                        left: `${organ.x}%`,
                        top: `${organ.y}%`,
                        width: `${organ.w}%`,
                        height: `${organ.h}%`,
                        borderColor: isSelected && flash === "correct" ? "#10b981" : isSelected && flash === "wrong" ? "#f43f5e" : isHovered ? organ.color : `${organ.color}55`,
                        background: isHovered || isSelected ? `${organ.color}25` : `${organ.color}10`,
                        boxShadow: isHovered ? `0 0 16px ${organ.color}60` : void 0,
                        transform: isHovered ? "scale(1.05)" : "scale(1)"
                      },
                      whileTap: { scale: 0.95 },
                      onMouseEnter: () => setHovered(organ.id),
                      onMouseLeave: () => setHovered(null),
                      onClick: () => handleOrganClick(organ.id),
                      "data-ocid": `human_body.organ.${organ.id}`,
                      children: isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute -top-7 left-1/2 -translate-x-1/2 glass rounded px-2 py-0.5 text-xs font-bold whitespace-nowrap z-20",
                          style: {
                            color: organ.color,
                            border: `1px solid ${organ.color}60`
                          },
                          children: organ.name
                        }
                      )
                    },
                    organ.id
                  );
                })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -20 },
                className: "glass-card rounded-xl p-4 border border-border/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs uppercase tracking-widest text-muted-foreground",
                      style: { fontFamily: "'Orbitron',sans-serif" },
                      children: "Diagnosis"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-medium text-foreground leading-relaxed", children: currentScenario.diagnosis }),
                  phase === "identify" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Click the affected organ on the diagram." })
                ]
              },
              scenarioIdx
            ) }),
            phase === "question" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                className: `glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "border-border/30"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-3 text-foreground", children: currentScenario.question }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: currentScenario.answers.map((ans, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "text-left px-3 py-2 rounded-lg border border-border/40 text-sm transition-all hover:border-[#00f5ff] hover:bg-[#00f5ff]/5 text-muted-foreground hover:text-foreground",
                      onClick: () => handleAnswer(i),
                      "data-ocid": `human_body.answer.${i}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs mr-2 opacity-60", children: [
                          String.fromCharCode(65 + i),
                          "."
                        ] }),
                        ans
                      ]
                    },
                    `ans-${i}`
                  )) })
                ]
              }
            ),
            feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                className: `rounded-lg px-3 py-2 text-xs font-medium ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`,
                children: feedbackMsg
              }
            ),
            hovered && (() => {
              const organ = ORGANS.find((o) => o.id === hovered);
              if (!organ) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3 border border-border/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold mb-1",
                    style: { color: organ.color },
                    children: organ.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
                  "System: ",
                  organ.system
                ] }),
                config.difficulty >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: organ.functions[0] })
              ] });
            })()
          ] })
        ] })
      ]
    }
  );
}
function BodySystems({ config, onGameEnd }) {
  const total_q = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 15;
  const questions = SYSTEM_QUESTIONS.slice(0, total_q);
  const [phase, setPhase] = reactExports.useState(
    "start"
  );
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [chosenSystem, setChosenSystem] = reactExports.useState("");
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const currentQ = questions[qIdx % questions.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("system");
    startTimer();
  }
  function handleSystemSelect(sys) {
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
        `Wrong system. Correct: ${currentQ.correctSystem}. Try the organ anyway.`
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
  function handleOrganSelect(org) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (org === currentQ.correctOrgan) {
      const pts = config.difficulty * (chosenSystem === currentQ.correctSystem ? 200 : 100);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "body_systems.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#06b6d4" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            qIdx + 1,
            "/",
            questions.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Activity,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#06b6d4" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#06b6d4",
                    textShadow: "0 0 20px rgba(6,182,212,0.6)"
                  },
                  children: "Body Systems"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Read the body function description. Select the correct body system, then the specific organ responsible." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-6", children: [
                questions.length,
                " questions — both correct = bonus points."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "body_systems.start_button",
                  children: "Start Quiz"
                }
              )
            ] })
          }
        ),
        (phase === "system" || phase === "organ" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground mb-3",
                    style: { fontFamily: "'Orbitron',sans-serif" },
                    children: "Function Description"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-5 leading-relaxed", children: currentQ.functionDesc }),
                phase === "system" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Step 1 — Select the body system:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentQ.systems.map((sys, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all",
                      onClick: () => handleSystemSelect(sys),
                      "data-ocid": `body_systems.system.${i}`,
                      children: sys
                    },
                    `sys-${i}`
                  )) })
                ] }),
                (phase === "organ" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Step 2 — Select the specific organ:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentQ.organs.map((org, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all",
                      onClick: () => handleOrganSelect(org),
                      "data-ocid": `body_systems.organ.${i}`,
                      children: org
                    },
                    `org-${i}`
                  )) })
                ] })
              ]
            },
            qIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-xl px-4 py-3 text-sm ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: feedbackMsg
            }
          )
        ] })
      ]
    }
  );
}
function HealthDefender({ config, onGameEnd }) {
  const totalPathogens = 20;
  const pathogenList = PATHOGENS.slice(0, totalPathogens);
  const [phase, setPhase] = reactExports.useState("start");
  const [pIdx, setPIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(5);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [progress, setProgress] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const currentP = pathogenList[pIdx % pathogenList.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  const pathogenProgressPct = pIdx / pathogenList.length * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleResponse(idx) {
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
        `Wrong response! Correct: ${currentP.responses[currentP.correctResponse]}`
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
  const typeColors = {
    BACTERIA: "#f43f5e",
    VIRUS: "#7c3aed",
    FUNGUS: "#f59e0b",
    PARASITE: "#10b981"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "health_defender.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Cell Defense:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: {
                  width: `${pathogenProgressPct}%`,
                  background: "#10b981"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              pIdx,
              "/",
              pathogenList.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Shield,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#10b981" : void 0,
                fill: i < lives ? "#10b981" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `s-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Shield,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#10b981" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#10b981",
                    textShadow: "0 0 20px rgba(16,185,129,0.6)"
                  },
                  children: "Health Defender"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Pathogens are attacking a cell. Select the correct immune response before they break through." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "5 lives — 20 pathogens — choose wisely." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "health_defender.start_button",
                  children: "Defend Cell"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 60 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -60 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs uppercase tracking-widest font-black px-2 py-0.5 rounded",
                        style: {
                          background: `${typeColors[currentP.type]}20`,
                          color: typeColors[currentP.type]
                        },
                        children: currentP.type
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: "text-xl font-black mt-2",
                        style: { color: typeColors[currentP.type] },
                        children: currentP.label
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-16 h-16 rounded-full border-4 flex items-center justify-center",
                      style: {
                        borderColor: typeColors[currentP.type],
                        boxShadow: `0 0 20px ${typeColors[currentP.type]}60`
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-black text-center",
                          style: { color: typeColors[currentP.type] },
                          children: currentP.type.slice(0, 3)
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-muted rounded-full overflow-hidden mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full rounded-full",
                    style: { background: typeColors[currentP.type] },
                    animate: { width: ["0%", "85%"] },
                    transition: { duration: 3, ease: "linear" }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select the correct immune response before the pathogen reaches the cell:" })
              ]
            },
            pIdx
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: currentP.responses.map((resp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileTap: { scale: 0.97 },
              className: "w-full px-4 py-3 rounded-xl border-2 border-border/30 text-sm font-medium text-muted-foreground hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/5 transition-all",
              onClick: () => handleResponse(i),
              "data-ocid": `health_defender.response.${i}`,
              children: resp
            },
            `resp-${i}`
          )) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-xl px-4 py-3 text-sm font-medium ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: feedbackMsg
            }
          )
        ] })
      ]
    }
  );
}
export {
  HumanBody as default
};
