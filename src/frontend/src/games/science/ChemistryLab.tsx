import { GlowButton } from "@/components/ui/GlowButton";
import { FlaskConical, Heart, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Game 1: Reaction Engine data ─────────────────────────────────────────────────
interface Challenge {
  targetName: string;
  targetFormula: string;
  reactants: string[];
  correctPair: [number, number];
  explanation: string;
}

const D1_CHALLENGES: Challenge[] = [
  {
    targetName: "Water",
    targetFormula: "H₂O",
    reactants: ["Hydrogen", "Oxygen", "Carbon", "Nitrogen", "Chlorine"],
    correctPair: [0, 1],
    explanation: "2H₂ + O₂ → 2H₂O",
  },
  {
    targetName: "Sodium Chloride (Table Salt)",
    targetFormula: "NaCl",
    reactants: ["Sodium", "Chlorine", "Oxygen", "Carbon", "Hydrogen"],
    correctPair: [0, 1],
    explanation: "Na + Cl₂ → 2NaCl",
  },
  {
    targetName: "Carbon Dioxide",
    targetFormula: "CO₂",
    reactants: ["Hydrogen", "Oxygen", "Carbon", "Nitrogen", "Sulfur"],
    correctPair: [2, 1],
    explanation: "C + O₂ → CO₂",
  },
  {
    targetName: "Ammonia",
    targetFormula: "NH₃",
    reactants: ["Nitrogen", "Hydrogen", "Oxygen", "Carbon", "Sulfur"],
    correctPair: [0, 1],
    explanation: "N₂ + 3H₂ → 2NH₃",
  },
  {
    targetName: "Rust (Iron Oxide)",
    targetFormula: "Fe₂O₃",
    reactants: ["Iron", "Oxygen", "Carbon", "Hydrogen", "Nitrogen"],
    correctPair: [0, 1],
    explanation: "4Fe + 3O₂ → 2Fe₂O₃",
  },
  {
    targetName: "Calcium Oxide (Quicklime)",
    targetFormula: "CaO",
    reactants: ["Calcium", "Oxygen", "Carbon", "Hydrogen", "Sodium"],
    correctPair: [0, 1],
    explanation: "2Ca + O₂ → 2CaO",
  },
  {
    targetName: "Magnesium Oxide",
    targetFormula: "MgO",
    reactants: ["Magnesium", "Oxygen", "Nitrogen", "Carbon", "Chlorine"],
    correctPair: [0, 1],
    explanation: "2Mg + O₂ → 2MgO",
  },
  {
    targetName: "Potassium Bromide",
    targetFormula: "KBr",
    reactants: ["Potassium", "Bromine", "Chlorine", "Carbon", "Oxygen"],
    correctPair: [0, 1],
    explanation: "2K + Br₂ → 2KBr",
  },
  {
    targetName: "Hydrogen Chloride",
    targetFormula: "HCl",
    reactants: ["Hydrogen", "Chlorine", "Oxygen", "Bromine", "Fluorine"],
    correctPair: [0, 1],
    explanation: "H₂ + Cl₂ → 2HCl",
  },
  {
    targetName: "Sulfur Dioxide",
    targetFormula: "SO₂",
    reactants: ["Sulfur", "Oxygen", "Carbon", "Nitrogen", "Hydrogen"],
    correctPair: [0, 1],
    explanation: "S + O₂ → SO₂",
  },
];

const D2_CHALLENGES: Challenge[] = [
  {
    targetName: "Sulfuric Acid",
    targetFormula: "H₂SO₄",
    reactants: [
      "Sulfur Trioxide",
      "Water",
      "Hydrochloric Acid",
      "Nitrogen",
      "Carbon",
    ],
    correctPair: [0, 1],
    explanation: "SO₃ + H₂O → H₂SO₄",
  },
  {
    targetName: "Sodium Bicarbonate",
    targetFormula: "NaHCO₃",
    reactants: [
      "Sodium Carbonate",
      "Carbon Dioxide",
      "Water",
      "Oxygen",
      "Chlorine",
    ],
    correctPair: [0, 1],
    explanation: "Na₂CO₃ + CO₂ + H₂O → 2NaHCO₃",
  },
  {
    targetName: "Nitric Acid",
    targetFormula: "HNO₃",
    reactants: ["Nitrogen Dioxide", "Water", "Oxygen", "Sulfur", "Carbon"],
    correctPair: [0, 1],
    explanation: "3NO₂ + H₂O → 2HNO₃ + NO",
  },
  {
    targetName: "Calcium Sulfate (Gypsum)",
    targetFormula: "CaSO₄",
    reactants: [
      "Calcium Hydroxide",
      "Sulfuric Acid",
      "Hydrochloric Acid",
      "Carbon Dioxide",
      "Oxygen",
    ],
    correctPair: [0, 1],
    explanation: "Ca(OH)₂ + H₂SO₄ → CaSO₄ + 2H₂O",
  },
  {
    targetName: "Ammonium Sulfate",
    targetFormula: "(NH₄)₂SO₄",
    reactants: ["Ammonia", "Sulfuric Acid", "Nitric Acid", "Water", "Carbon"],
    correctPair: [0, 1],
    explanation: "2NH₃ + H₂SO₄ → (NH₄)₂SO₄",
  },
  {
    targetName: "Iron(III) Chloride",
    targetFormula: "FeCl₃",
    reactants: [
      "Iron",
      "Chlorine Gas",
      "Hydrochloric Acid",
      "Oxygen",
      "Sodium",
    ],
    correctPair: [0, 1],
    explanation: "2Fe + 3Cl₂ → 2FeCl₃",
  },
  {
    targetName: "Barium Sulfate",
    targetFormula: "BaSO₄",
    reactants: [
      "Barium Chloride",
      "Sodium Sulfate",
      "Sulfuric Acid",
      "Water",
      "Carbon",
    ],
    correctPair: [0, 1],
    explanation: "BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl",
  },
  {
    targetName: "Silver Chloride",
    targetFormula: "AgCl",
    reactants: [
      "Silver Nitrate",
      "Sodium Chloride",
      "Silver Oxide",
      "Chlorine Gas",
      "Carbon",
    ],
    correctPair: [0, 1],
    explanation: "AgNO₃ + NaCl → AgCl + NaNO₃",
  },
];

const D3_CHALLENGES: Challenge[] = [
  {
    targetName: "Ethanol",
    targetFormula: "C₂H₅OH",
    reactants: ["Ethene", "Water (steam)", "Methanol", "Oxygen", "Hydrogen"],
    correctPair: [0, 1],
    explanation: "C₂H₄ + H₂O → C₂H₅OH (hydration)",
  },
  {
    targetName: "Methanol",
    targetFormula: "CH₃OH",
    reactants: [
      "Carbon Monoxide",
      "Hydrogen",
      "Carbon Dioxide",
      "Methane",
      "Oxygen",
    ],
    correctPair: [0, 1],
    explanation: "CO + 2H₂ → CH₃OH",
  },
  {
    targetName: "Aspirin",
    targetFormula: "C₉H₈O₄",
    reactants: [
      "Salicylic Acid",
      "Acetic Anhydride",
      "Ethanol",
      "Sulfuric Acid",
      "Water",
    ],
    correctPair: [0, 1],
    explanation: "Salicylic acid + Acetic anhydride → Aspirin + Acetic acid",
  },
  {
    targetName: "Ester (Ethyl Ethanoate)",
    targetFormula: "CH₃COOC₂H₅",
    reactants: [
      "Ethanoic Acid",
      "Ethanol",
      "Propanoic Acid",
      "Methanol",
      "Water",
    ],
    correctPair: [0, 1],
    explanation: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O",
  },
  {
    targetName: "Glucose",
    targetFormula: "C₆H₁₂O₆",
    reactants: [
      "Carbon Dioxide",
      "Water (photosynthesis)",
      "Oxygen",
      "Nitrogen",
      "Hydrogen",
    ],
    correctPair: [0, 1],
    explanation: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
  },
  {
    targetName: "Acetic Acid",
    targetFormula: "CH₃COOH",
    reactants: ["Methanol", "Carbon Monoxide", "Ethanol", "Oxygen", "Hydrogen"],
    correctPair: [0, 1],
    explanation: "CH₃OH + CO → CH₃COOH (Monsanto process)",
  },
];

// ─── Game 2: Element Identifier data ───────────────────────────────────────────────
interface ElementQ {
  symbol: string;
  name: string;
  atomicNumber: number;
  group: string;
  nameOptions: string[];
  groupOptions: string[];
}

const ELEMENTS: ElementQ[] = [
  {
    symbol: "H",
    name: "Hydrogen",
    atomicNumber: 1,
    group: "Non-metal",
    nameOptions: ["Hydrogen", "Helium", "Hafnium", "Holmium"],
    groupOptions: ["Alkali Metal", "Noble Gas", "Non-metal", "Halogen"],
  },
  {
    symbol: "He",
    name: "Helium",
    atomicNumber: 2,
    group: "Noble Gas",
    nameOptions: ["Hydrogen", "Helium", "Hafnium", "Holmium"],
    groupOptions: ["Alkali Metal", "Noble Gas", "Halogen", "Non-metal"],
  },
  {
    symbol: "Li",
    name: "Lithium",
    atomicNumber: 3,
    group: "Alkali Metal",
    nameOptions: ["Lithium", "Lead", "Lutetium", "Lawrencium"],
    groupOptions: ["Alkali Metal", "Noble Gas", "Transition Metal", "Halogen"],
  },
  {
    symbol: "C",
    name: "Carbon",
    atomicNumber: 6,
    group: "Non-metal",
    nameOptions: ["Calcium", "Carbon", "Copper", "Cobalt"],
    groupOptions: ["Non-metal", "Alkali Metal", "Noble Gas", "Halogen"],
  },
  {
    symbol: "N",
    name: "Nitrogen",
    atomicNumber: 7,
    group: "Non-metal",
    nameOptions: ["Nickel", "Nitrogen", "Neon", "Niobium"],
    groupOptions: ["Halogen", "Noble Gas", "Non-metal", "Transition Metal"],
  },
  {
    symbol: "O",
    name: "Oxygen",
    atomicNumber: 8,
    group: "Non-metal",
    nameOptions: ["Oxygen", "Osmium", "Oganesson", "Indium"],
    groupOptions: ["Alkali Metal", "Non-metal", "Noble Gas", "Halogen"],
  },
  {
    symbol: "Ne",
    name: "Neon",
    atomicNumber: 10,
    group: "Noble Gas",
    nameOptions: ["Nickel", "Neptunium", "Neon", "Nitrogen"],
    groupOptions: ["Halogen", "Alkali Metal", "Noble Gas", "Transition Metal"],
  },
  {
    symbol: "Na",
    name: "Sodium",
    atomicNumber: 11,
    group: "Alkali Metal",
    nameOptions: ["Nitrogen", "Sodium", "Samarium", "Silicon"],
    groupOptions: ["Alkali Metal", "Noble Gas", "Halogen", "Non-metal"],
  },
  {
    symbol: "Mg",
    name: "Magnesium",
    atomicNumber: 12,
    group: "Alkaline Earth",
    nameOptions: ["Manganese", "Magnesium", "Mendelevium", "Mercury"],
    groupOptions: [
      "Transition Metal",
      "Alkaline Earth",
      "Halogen",
      "Noble Gas",
    ],
  },
  {
    symbol: "Fe",
    name: "Iron",
    atomicNumber: 26,
    group: "Transition Metal",
    nameOptions: ["Fluorine", "Fermium", "Iron", "Iodine"],
    groupOptions: ["Halogen", "Non-metal", "Transition Metal", "Noble Gas"],
  },
  {
    symbol: "Cu",
    name: "Copper",
    atomicNumber: 29,
    group: "Transition Metal",
    nameOptions: ["Curium", "Copper", "Calcium", "Chromium"],
    groupOptions: ["Alkali Metal", "Transition Metal", "Noble Gas", "Halogen"],
  },
  {
    symbol: "Zn",
    name: "Zinc",
    atomicNumber: 30,
    group: "Transition Metal",
    nameOptions: ["Zinc", "Zirconium", "Xenon", "Yttrium"],
    groupOptions: ["Halogen", "Alkali Metal", "Transition Metal", "Noble Gas"],
  },
  {
    symbol: "Cl",
    name: "Chlorine",
    atomicNumber: 17,
    group: "Halogen",
    nameOptions: ["Calcium", "Cobalt", "Chromium", "Chlorine"],
    groupOptions: ["Halogen", "Noble Gas", "Alkali Metal", "Non-metal"],
  },
  {
    symbol: "Ar",
    name: "Argon",
    atomicNumber: 18,
    group: "Noble Gas",
    nameOptions: ["Arsenic", "Argon", "Astatine", "Gold"],
    groupOptions: ["Halogen", "Transition Metal", "Noble Gas", "Alkali Metal"],
  },
  {
    symbol: "Ca",
    name: "Calcium",
    atomicNumber: 20,
    group: "Alkaline Earth",
    nameOptions: ["Carbon", "Cadmium", "Calcium", "Cerium"],
    groupOptions: [
      "Alkali Metal",
      "Alkaline Earth",
      "Transition Metal",
      "Halogen",
    ],
  },
  {
    symbol: "Au",
    name: "Gold",
    atomicNumber: 79,
    group: "Transition Metal",
    nameOptions: ["Gold", "Germanium", "Gallium", "Gadolinium"],
    groupOptions: ["Transition Metal", "Noble Gas", "Halogen", "Alkali Metal"],
  },
  {
    symbol: "Ag",
    name: "Silver",
    atomicNumber: 47,
    group: "Transition Metal",
    nameOptions: ["Argon", "Silver", "Antimony", "Astatine"],
    groupOptions: [
      "Halogen",
      "Transition Metal",
      "Noble Gas",
      "Alkaline Earth",
    ],
  },
  {
    symbol: "Pb",
    name: "Lead",
    atomicNumber: 82,
    group: "Post-transition Metal",
    nameOptions: ["Phosphorus", "Lead", "Platinum", "Praseodymium"],
    groupOptions: [
      "Transition Metal",
      "Post-transition Metal",
      "Non-metal",
      "Halogen",
    ],
  },
  {
    symbol: "F",
    name: "Fluorine",
    atomicNumber: 9,
    group: "Halogen",
    nameOptions: ["Fluorine", "Fermium", "Francium", "Iron"],
    groupOptions: ["Halogen", "Alkali Metal", "Noble Gas", "Transition Metal"],
  },
  {
    symbol: "K",
    name: "Potassium",
    atomicNumber: 19,
    group: "Alkali Metal",
    nameOptions: ["Krypton", "Potassium", "Kurchatovium", "Curium"],
    groupOptions: ["Alkali Metal", "Noble Gas", "Halogen", "Transition Metal"],
  },
];

// ─── Game 3: Lab Safety data ─────────────────────────────────────────────────────
interface LabScenario {
  scenario: string;
  hazard: string;
  procedures: string[];
  correctProcedure: number;
  hazardLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const LAB_SCENARIOS: LabScenario[] = [
  {
    scenario:
      "You mix bleach (sodium hypochlorite) with ammonia-based cleaner in a beaker.",
    hazard: "Toxic chloramine gas is produced — can cause lung damage.",
    procedures: [
      "Stir vigorously",
      "Immediately ventilate and evacuate",
      "Add water to dilute",
      "Cover and wait",
    ],
    correctProcedure: 1,
    hazardLevel: "CRITICAL",
  },
  {
    scenario:
      "You are heating a liquid in a test tube without wearing safety goggles.",
    hazard: "Liquid may splatter or boil suddenly into eyes.",
    procedures: [
      "Continue heating carefully",
      "Put on safety goggles immediately",
      "Heat faster to finish quickly",
      "Use a heat shield only",
    ],
    correctProcedure: 1,
    hazardLevel: "HIGH",
  },
  {
    scenario:
      "You need to pour concentrated sulfuric acid into water to dilute it.",
    hazard: "Pouring water into acid causes violent exothermic reaction.",
    procedures: [
      "Pour water into acid quickly",
      "Always add acid to water slowly",
      "Mix equal volumes at once",
      "Heat the mixture first",
    ],
    correctProcedure: 1,
    hazardLevel: "HIGH",
  },
  {
    scenario: "You drop a glass beaker on the lab floor and it shatters.",
    hazard: "Sharp glass shards can cause cuts; chemicals may be present.",
    procedures: [
      "Pick up glass with bare hands",
      "Leave it and continue work",
      "Use a brush and dustpan, wear gloves",
      "Sweep with paper",
    ],
    correctProcedure: 2,
    hazardLevel: "MEDIUM",
  },
  {
    scenario: "You notice a classmate has a chemical splashed on their skin.",
    hazard: "Chemical burns can worsen if not treated immediately.",
    procedures: [
      "Rub the chemical off with a cloth",
      "Flush with large amounts of water immediately",
      "Apply antiseptic cream",
      "Wait to see if it burns",
    ],
    correctProcedure: 1,
    hazardLevel: "HIGH",
  },
  {
    scenario: "You need to smell a chemical in a flask to identify it.",
    hazard: "Inhaling unknown chemicals can cause poisoning.",
    procedures: [
      "Put nose directly over flask",
      "Waft vapours gently toward your nose",
      "Take a deep sniff",
      "Seal the flask and shake",
    ],
    correctProcedure: 1,
    hazardLevel: "HIGH",
  },
  {
    scenario:
      "You are working with flammable solvents near a lit Bunsen burner.",
    hazard: "Flammable vapours can ignite and cause fire or explosion.",
    procedures: [
      "Work quickly",
      "Keep solvent far from flame or extinguish flame",
      "Use a small flame",
      "Cover solvent with paper",
    ],
    correctProcedure: 1,
    hazardLevel: "CRITICAL",
  },
  {
    scenario:
      "You finish an experiment using hazardous chemicals and want to dispose of waste.",
    hazard:
      "Pouring chemicals down the sink may cause reactions or environmental harm.",
    procedures: [
      "Pour down the sink with water",
      "Follow teacher instructions for disposal containers",
      "Evaporate it outdoors",
      "Leave in beaker on bench",
    ],
    correctProcedure: 1,
    hazardLevel: "MEDIUM",
  },
  {
    scenario: "A small fire breaks out in a crucible on a tripod.",
    hazard: "Fire can spread quickly if not controlled.",
    procedures: [
      "Blow it out",
      "Pour water on it immediately",
      "Cover with a fire blanket or sand",
      "Fan with a notebook",
    ],
    correctProcedure: 2,
    hazardLevel: "HIGH",
  },
  {
    scenario:
      "You are working with a chemical and need to eat lunch right after.",
    hazard: "Chemical residue on hands can contaminate food.",
    procedures: [
      "Eat quickly",
      "Use hand sanitiser only",
      "Wash hands thoroughly with soap and water",
      "Use gloves while eating",
    ],
    correctProcedure: 2,
    hazardLevel: "MEDIUM",
  },
  {
    scenario: "The fire alarm sounds during a chemistry experiment.",
    hazard:
      "Leaving chemicals unattended can cause fire, spills, or reactions.",
    procedures: [
      "Finish the experiment first",
      "Turn off heat sources, cap chemicals, evacuate",
      "Take chemicals with you",
      "Ignore if it's probably a drill",
    ],
    correctProcedure: 1,
    hazardLevel: "HIGH",
  },
  {
    scenario: "You accidentally ingest a small amount of unknown lab chemical.",
    hazard: "Ingestion of lab chemicals can be toxic or fatal.",
    procedures: [
      "Drink water and wait",
      "Immediately inform teacher and call poison control",
      "Induce vomiting",
      "Continue working",
    ],
    correctProcedure: 1,
    hazardLevel: "CRITICAL",
  },
];

type ReactionAnim = "idle" | "success" | "explosion";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function ChemistryLab({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "element-identifier")
    return <ElementIdentifier config={config} onGameEnd={onGameEnd} />;
  if (gameId === "lab-safety")
    return <LabSafety config={config} onGameEnd={onGameEnd} />;
  return <ReactionEngine config={config} onGameEnd={onGameEnd} />;
}

// ============================================================================
// GAME 1 — Reaction Engine
// ============================================================================
function ReactionEngine({ config, onGameEnd }: Props) {
  const challenges =
    config.difficulty === 1
      ? D1_CHALLENGES
      : config.difficulty === 2
        ? D2_CHALLENGES
        : D3_CHALLENGES;
  const [phase, setPhase] = useState<"start" | "playing" | "feedback">("start");
  const [cIdx, setCIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [reaction, setReaction] = useState<ReactionAnim>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

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
  const currentC = challenges[cIdx % challenges.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;
  const progressBarStyle = { width: `${progressPct}%` };

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }

  function toggleReactant(idx: number) {
    if (reaction !== "idle") return;
    setSelected((prev) => {
      if (prev.includes(idx)) return prev.filter((i) => i !== idx);
      if (prev.length >= 2) return prev;
      return [...prev, idx];
    });
  }

  function handleReact() {
    if (selected.length !== 2 || reaction !== "idle") return;
    setTotal((t) => t + 1);
    const [a, b] = [...selected].sort((x, y) => x - y);
    const [ca, cb] = currentC.correctPair;
    const isCorrect = (a === ca && b === cb) || (a === cb && b === ca);
    if (isCorrect) {
      const pts = config.difficulty * 300;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setReaction("success");
      setFeedbackMsg(currentC.explanation);
    } else {
      setReaction("explosion");
      setFeedbackMsg(`Wrong combination! ${currentC.explanation}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setReaction("idle");
      setFeedbackMsg("");
      setSelected([]);
      const nextIdx = cIdx + 1;
      if (nextIdx >= challenges.length) endGame(true);
      else {
        setCIdx(nextIdx);
        setPhase("playing");
      }
    }, 2200);
  }

  const flaskColor =
    reaction === "success"
      ? "#10b981"
      : reaction === "explosion"
        ? "#f43f5e"
        : "#00f5ff";
  const flaskBorder = `border-2 transition-all ${reaction === "success" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : reaction === "explosion" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`;

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="chemistry_lab.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <FlaskConical className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {cIdx + 1}/{challenges.length}
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
              style={progressBarStyle}
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
            <FlaskConical
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
              Lab Reaction Engine
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Select 2 reactants to synthesize the target compound. Wrong pair
              causes an explosion!
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="chemistry_lab.start_button"
            >
              Enter Lab
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "playing" || phase === "feedback") && (
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex-1 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={cIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`glass-card rounded-xl p-5 ${flaskBorder}`}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-2 text-muted-foreground"
                  style={{ fontFamily: "'Orbitron',sans-serif" }}
                >
                  Target Compound
                </p>
                <h3
                  className="text-2xl font-black mb-1"
                  style={{ color: flaskColor }}
                >
                  {currentC.targetName}
                </h3>
                <p
                  className="text-lg font-mono mb-4"
                  style={{ color: flaskColor, opacity: 0.8 }}
                >
                  {currentC.targetFormula}
                </p>
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={
                      reaction === "success"
                        ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                        : reaction === "explosion"
                          ? {
                              x: [0, -8, 8, -8, 8, 0],
                              scale: [1, 1.1, 0.9, 1.1, 0.9, 1],
                            }
                          : {}
                    }
                    transition={{ duration: 0.5 }}
                    className="w-16 h-20 relative flex items-center justify-center"
                  >
                    <div
                      className="w-12 h-16 rounded-b-full rounded-t-sm border-2 relative overflow-hidden"
                      style={{
                        borderColor: flaskColor,
                        boxShadow: `0 0 20px ${flaskColor}60`,
                      }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-b-full"
                        style={{
                          height: reaction === "idle" ? "40%" : "80%",
                          background: `${flaskColor}40`,
                        }}
                      />
                    </div>
                    <FlaskConical
                      className="absolute h-6 w-6"
                      style={{ color: flaskColor }}
                    />
                  </motion.div>
                </div>
                {feedbackMsg && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`rounded-lg px-3 py-2 text-xs font-mono ${reaction === "success" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}
                  >
                    {feedbackMsg}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
            <GlowButton
              variant={selected.length === 2 ? "primary" : "secondary"}
              size="md"
              onClick={handleReact}
              disabled={selected.length !== 2 || reaction !== "idle"}
              data-ocid="chemistry_lab.react_button"
            >
              <Zap className="h-4 w-4 mr-2" />
              React!
            </GlowButton>
          </div>
          <div className="w-56 flex flex-col gap-2">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground px-1"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              Reactants ({selected.length}/2)
            </p>
            {currentC.reactants.map((r, i) => {
              const isSel = selected.includes(i);
              return (
                <motion.button
                  key={`r-${i}`}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all glass ${isSel ? "border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]" : "border-border/30 text-muted-foreground hover:border-[#00f5ff]/60 hover:text-foreground"}`}
                  onClick={() => toggleReactant(i)}
                  data-ocid={`chemistry_lab.reactant.${i}`}
                >
                  {isSel && (
                    <span className="w-2 h-2 rounded-full bg-[#00f5ff] inline-block mr-2" />
                  )}
                  {r}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2 — Element Identifier
// ============================================================================
function ElementIdentifier({ config, onGameEnd }: Props) {
  const totalQ =
    config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 20;
  const elementList = ELEMENTS.slice(0, totalQ);

  const [phase, setPhase] = useState<"start" | "name" | "group" | "feedback">(
    "start",
  );
  const [eIdx, setEIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [chosenName, setChosenName] = useState("");

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
  const current = elementList[eIdx % elementList.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("name");
    startTimer();
  }

  function handleName(opt: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    setChosenName(opt);
    if (opt === current.name) {
      setScore((s) => s + config.difficulty * 100);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! Atomic number: ${current.atomicNumber}. Now identify the group.`,
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("group");
      }, 1000);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. ${current.symbol} is ${current.name}. Try the group.`,
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("group");
      }, 1500);
    }
  }

  function handleGroup(opt: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (opt === current.group) {
      const pts = config.difficulty * (chosenName === current.name ? 150 : 80);
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${current.name} (${current.symbol}) is in the ${current.group} group. +${pts} pts`,
      );
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${current.name} is a ${current.group}.`);
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
      setChosenName("");
      const next = eIdx + 1;
      if (next >= elementList.length) endGame(true);
      else {
        setEIdx(next);
        setPhase("name");
      }
    }, 2000);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="element_identifier.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#7c3aed" }}>
          <FlaskConical className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {eIdx + 1}/{elementList.length}
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
            <FlaskConical
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#7c3aed" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#7c3aed",
                textShadow: "0 0 20px rgba(124,58,237,0.6)",
              }}
            >
              Element Identifier
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              An element symbol is shown. Identify its name, atomic number, and
              group. {totalQ} elements total.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="element_identifier.start_button"
            >
              Enter Periodic Table
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "name" || phase === "group" || phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={eIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center"
            >
              <div
                className="w-32 h-32 rounded-2xl border-4 flex flex-col items-center justify-center"
                style={{
                  borderColor: "#7c3aed",
                  background: "rgba(124,58,237,0.1)",
                  boxShadow: "0 0 30px rgba(124,58,237,0.3)",
                }}
              >
                <span className="text-xs text-muted-foreground">
                  #{current.atomicNumber}
                </span>
                <span
                  className="text-4xl font-black"
                  style={{ color: "#7c3aed" }}
                >
                  {current.symbol}
                </span>
                <span className="text-xs text-muted-foreground">
                  {phase === "name" ? "Name?" : current.name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div
            className={`glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
          >
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              {phase === "name"
                ? "Step 1 — Identify the element name"
                : "Step 2 — Identify the group"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(phase === "name"
                ? current.nameOptions
                : current.groupOptions
              ).map((opt, i) => (
                <button
                  key={`opt-${i}`}
                  type="button"
                  className="px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                  onClick={() =>
                    phase === "name" ? handleName(opt) : handleGroup(opt)
                  }
                  data-ocid={`element_identifier.option.${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

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
// GAME 3 — Lab Safety
// ============================================================================
function LabSafety({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<
    "start" | "hazard" | "procedure" | "feedback"
  >("start");
  const [sIdx, setSIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

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
  const current = LAB_SCENARIOS[sIdx % LAB_SCENARIOS.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  const levelColors: Record<string, string> = {
    LOW: "#10b981",
    MEDIUM: "#f59e0b",
    HIGH: "#f97316",
    CRITICAL: "#f43f5e",
  };

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("hazard");
    startTimer();
  }

  function handleHazardAcknowledge() {
    setPhase("procedure");
  }

  function handleProcedure(idx: number) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === current.correctProcedure) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct procedure! +${pts} pts`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. Correct: "${current.procedures[current.correctProcedure]}"`,
      );
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
      const next = sIdx + 1;
      if (next >= LAB_SCENARIOS.length) endGame(true);
      else {
        setSIdx(next);
        setPhase("hazard");
      }
    }, 2000);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="lab_safety.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f97316" }}>
          <FlaskConical className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {sIdx + 1}/{LAB_SCENARIOS.length}
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
            <FlaskConical
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#f97316" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#f97316",
                textShadow: "0 0 20px rgba(249,115,22,0.6)",
              }}
            >
              Lab Safety
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              12 dangerous lab scenarios. Identify the hazard and select the
              correct safety procedure.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="lab_safety.start_button"
            >
              Enter Lab
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "hazard" ||
        phase === "procedure" ||
        phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={sIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-black px-2 py-0.5 rounded"
                  style={{
                    background: `${levelColors[current.hazardLevel]}20`,
                    color: levelColors[current.hazardLevel],
                  }}
                >
                  {current.hazardLevel} HAZARD
                </span>
                <span className="text-xs text-muted-foreground">
                  Scenario {sIdx + 1}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-3">
                {current.scenario}
              </p>
              {(phase === "procedure" || phase === "feedback") && (
                <div
                  className="glass rounded-lg p-3 border mb-4"
                  style={{
                    borderColor: `${levelColors[current.hazardLevel]}40`,
                  }}
                >
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ color: levelColors[current.hazardLevel] }}
                  >
                    Hazard Identified:
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {current.hazard}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {phase === "hazard" && (
            <GlowButton
              variant="primary"
              size="md"
              onClick={handleHazardAcknowledge}
              data-ocid="lab_safety.acknowledge_button"
            >
              Identify Hazard — Select Procedure
            </GlowButton>
          )}

          {(phase === "procedure" || phase === "feedback") && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground px-1">
                Select the correct safety procedure:
              </p>
              {current.procedures.map((proc, i) => (
                <button
                  key={`proc-${i}`}
                  type="button"
                  className="text-left px-4 py-3 rounded-xl border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f97316] hover:text-[#f97316] transition-all"
                  onClick={() => handleProcedure(i)}
                  data-ocid={`lab_safety.procedure.${i}`}
                >
                  <span className="font-mono text-xs mr-2 opacity-60">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {proc}
                </button>
              ))}
            </div>
          )}

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
