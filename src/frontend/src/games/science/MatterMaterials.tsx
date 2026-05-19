import { GlowButton } from "@/components/ui/GlowButton";
import { Atom, Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Game 1: States of Matter data ─────────────────────────────────────────────────
type State = "solid" | "liquid" | "gas" | "plasma";
type Classification = "element" | "compound" | "mixture";

interface Challenge {
  substance: string;
  tempC: number;
  description: string;
  correctState: State;
  correctClass: Classification;
  stateReason: string;
  classReason: string;
}

const D1_CHALLENGES: Challenge[] = [
  {
    substance: "Ice",
    tempC: -10,
    description: "Frozen water at -10°C",
    correctState: "solid",
    correctClass: "compound",
    stateReason: "Below 0°C water is solid",
    classReason: "H₂O is a compound of H and O",
  },
  {
    substance: "Water",
    tempC: 25,
    description: "Pure water at room temperature 25°C",
    correctState: "liquid",
    correctClass: "compound",
    stateReason: "Between 0°C and 100°C water is liquid",
    classReason: "H₂O is a chemical compound",
  },
  {
    substance: "Steam",
    tempC: 120,
    description: "Water vapour at 120°C",
    correctState: "gas",
    correctClass: "compound",
    stateReason: "Above 100°C water becomes gas (steam)",
    classReason: "Still H₂O — same compound, different phase",
  },
  {
    substance: "Iron",
    tempC: 20,
    description: "A block of iron at room temperature",
    correctState: "solid",
    correctClass: "element",
    stateReason: "Iron melts at 1538°C, so solid at 20°C",
    classReason: "Fe is a pure element",
  },
  {
    substance: "Oxygen",
    tempC: 25,
    description: "Oxygen gas at room temperature",
    correctState: "gas",
    correctClass: "element",
    stateReason: "O₂ boiling point is -183°C, gas at 25°C",
    classReason: "Oxygen is a pure element (O)",
  },
  {
    substance: "Salt Water",
    tempC: 20,
    description: "Ocean water with dissolved NaCl",
    correctState: "liquid",
    correctClass: "mixture",
    stateReason: "Salt water is liquid at 20°C",
    classReason: "Salt dissolved in water is a mixture",
  },
  {
    substance: "Copper",
    tempC: 25,
    description: "Copper wire at room temperature",
    correctState: "solid",
    correctClass: "element",
    stateReason: "Copper melts at 1085°C",
    classReason: "Cu is a pure metallic element",
  },
  {
    substance: "Carbon Dioxide",
    tempC: 25,
    description: "CO₂ at room temperature and standard pressure",
    correctState: "gas",
    correctClass: "compound",
    stateReason: "CO₂ sublimes at -78.5°C, gas above that",
    classReason: "CO₂ is a compound of C and O",
  },
  {
    substance: "Milk",
    tempC: 4,
    description: "Refrigerated milk at 4°C",
    correctState: "liquid",
    correctClass: "mixture",
    stateReason: "Milk remains liquid at 4°C",
    classReason: "Milk is a mixture of water, proteins, fats",
  },
  {
    substance: "Mercury",
    tempC: 20,
    description: "Mercury in a thermometer at 20°C",
    correctState: "liquid",
    correctClass: "element",
    stateReason: "Mercury melts at -39°C, liquid at room temp",
    classReason: "Hg is a pure element",
  },
];

const D2_CHALLENGES: Challenge[] = [
  {
    substance: "Sulfur",
    tempC: 130,
    description: "Sulfur at 130°C (melting point 115°C)",
    correctState: "liquid",
    correctClass: "element",
    stateReason: "Above 115°C sulfur is molten",
    classReason: "S is a pure non-metal element",
  },
  {
    substance: "Ammonia",
    tempC: -40,
    description: "Ammonia at -40°C (boiling point -33°C)",
    correctState: "liquid",
    correctClass: "compound",
    stateReason: "Below -33°C ammonia is liquid",
    classReason: "NH₃ is a compound of N and H",
  },
  {
    substance: "Bromine",
    tempC: 20,
    description: "Bromine at 20°C (melts at -7°C, boils at 59°C)",
    correctState: "liquid",
    correctClass: "element",
    stateReason: "Between -7°C and 59°C bromine is liquid",
    classReason: "Br₂ is a pure halogen element",
  },
  {
    substance: "Dry Ice",
    tempC: -80,
    description: "Dry ice (solid CO₂) at -80°C",
    correctState: "solid",
    correctClass: "compound",
    stateReason: "CO₂ sublimes at -78.5°C, solid below that",
    classReason: "CO₂ is a compound",
  },
  {
    substance: "Air",
    tempC: 25,
    description: "Atmospheric air at 25°C",
    correctState: "gas",
    correctClass: "mixture",
    stateReason: "Air is gaseous at 25°C",
    classReason: "Air is a mixture of N₂, O₂, Ar, CO₂, etc.",
  },
  {
    substance: "Ethanol",
    tempC: -90,
    description: "Ethanol at -90°C (melting point -114°C)",
    correctState: "liquid",
    correctClass: "compound",
    stateReason: "Between -114°C and 78°C, ethanol is liquid",
    classReason: "C₂H₅OH is an organic compound",
  },
  {
    substance: "Silicon",
    tempC: 1500,
    description: "Silicon at 1500°C (melting point 1414°C)",
    correctState: "liquid",
    correctClass: "element",
    stateReason: "Above 1414°C silicon is molten",
    classReason: "Si is a pure metalloid element",
  },
];

const D3_CHALLENGES: Challenge[] = [
  {
    substance: "Sun's Corona",
    tempC: 1000000,
    description: "Solar corona at ~1 million°C",
    correctState: "plasma",
    correctClass: "mixture",
    stateReason: "At these temperatures all atoms ionize into plasma",
    classReason: "Plasma is a mixture of free electrons and ions",
  },
  {
    substance: "Supercooled Water",
    tempC: -15,
    description: "Pure water supercooled to -15°C without freezing",
    correctState: "liquid",
    correctClass: "compound",
    stateReason: "Under ideal conditions water can remain liquid below 0°C",
    classReason: "H₂O remains a compound in all states",
  },
  {
    substance: "Metallic Hydrogen",
    tempC: 25,
    description: "Hydrogen under 495 GPa pressure at 25°C",
    correctState: "solid",
    correctClass: "element",
    stateReason: "Under extreme pressure hydrogen becomes metallic solid",
    classReason: "H₂ under compression is still pure hydrogen element",
  },
];

const STATE_COLORS: Record<State, string> = {
  solid: "#7c3aed",
  liquid: "#00f5ff",
  gas: "#10b981",
  plasma: "#f43f5e",
};
const PARTICLE_CONFIGS: Record<
  State,
  { count: number; speed: number; spread: number }
> = {
  solid: { count: 16, speed: 0.3, spread: 5 },
  liquid: { count: 16, speed: 1.5, spread: 20 },
  gas: { count: 16, speed: 4, spread: 60 },
  plasma: { count: 16, speed: 8, spread: 80 },
};
const STATES: State[] = ["solid", "liquid", "gas", "plasma"];
const CLASSES: Classification[] = ["element", "compound", "mixture"];

// ─── Game 2: Properties Lab data ────────────────────────────────────────────────────
interface MaterialTest {
  material: string;
  conductor: boolean;
  elastic: boolean;
  transparent: boolean;
  hard: boolean;
  classification: string;
  facts: string;
}

const MATERIALS: MaterialTest[] = [
  {
    material: "Copper",
    conductor: true,
    elastic: false,
    transparent: false,
    hard: true,
    classification: "Metal",
    facts: "Copper is an excellent conductor used in electrical wiring.",
  },
  {
    material: "Rubber",
    conductor: false,
    elastic: true,
    transparent: false,
    hard: false,
    classification: "Polymer",
    facts: "Rubber is elastic and used as an electrical insulator.",
  },
  {
    material: "Glass",
    conductor: false,
    elastic: false,
    transparent: true,
    hard: true,
    classification: "Amorphous Solid",
    facts: "Glass is transparent and non-conductive but brittle.",
  },
  {
    material: "Wood",
    conductor: false,
    elastic: false,
    transparent: false,
    hard: true,
    classification: "Natural Material",
    facts: "Wood is a poor conductor and used in construction.",
  },
  {
    material: "Plastic (PVC)",
    conductor: false,
    elastic: false,
    transparent: false,
    hard: true,
    classification: "Polymer",
    facts: "PVC is an insulator widely used in pipes and cables.",
  },
  {
    material: "Cotton Cloth",
    conductor: false,
    elastic: true,
    transparent: false,
    hard: false,
    classification: "Textile",
    facts: "Cotton is soft, slightly elastic, and breathable.",
  },
  {
    material: "Aluminum Foil",
    conductor: true,
    elastic: false,
    transparent: false,
    hard: false,
    classification: "Metal",
    facts: "Aluminum is a lightweight metal that conducts electricity.",
  },
  {
    material: "Silicon",
    conductor: false,
    elastic: false,
    transparent: false,
    hard: true,
    classification: "Semiconductor",
    facts: "Silicon is a semiconductor — conducts under specific conditions.",
  },
  {
    material: "Acrylic (Perspex)",
    conductor: false,
    elastic: false,
    transparent: true,
    hard: true,
    classification: "Polymer",
    facts: "Acrylic is a transparent hard plastic used in windows.",
  },
  {
    material: "Steel",
    conductor: true,
    elastic: false,
    transparent: false,
    hard: true,
    classification: "Metal Alloy",
    facts: "Steel is an iron-carbon alloy that conducts electricity.",
  },
];

// ─── Game 3: Particle Model data ────────────────────────────────────────────────────
interface ParticleQ {
  description: string;
  spacing: "close" | "medium" | "far";
  motion: "vibrate" | "flow" | "random";
  correctState: State;
  heatEffect: string;
  heatAnswers: string[];
  heatCorrect: number;
}

const PARTICLE_QUESTIONS: ParticleQ[] = [
  {
    description:
      "Particles tightly packed in a regular lattice arrangement. Barely moving — only vibrating in place.",
    spacing: "close",
    motion: "vibrate",
    correctState: "solid",
    heatEffect: "If heat is added, the particles...",
    heatAnswers: [
      "Spread further apart and move faster (melting)",
      "Pack tighter together",
      "Stop moving completely",
      "Disappear",
    ],
    heatCorrect: 0,
  },
  {
    description:
      "Particles close but not in a fixed arrangement. Moving around each other freely.",
    spacing: "medium",
    motion: "flow",
    correctState: "liquid",
    heatEffect: "If heat is added, the liquid particles...",
    heatAnswers: [
      "Slow down and settle",
      "Gain enough energy to escape and become gas (evaporation)",
      "Form a solid",
      "Stop flowing",
    ],
    heatCorrect: 1,
  },
  {
    description:
      "Particles spread far apart, moving rapidly and randomly in all directions.",
    spacing: "far",
    motion: "random",
    correctState: "gas",
    heatEffect: "If heat is removed from a gas, the particles...",
    heatAnswers: [
      "Move faster",
      "Spread further apart",
      "Slow down and come closer together (condensation)",
      "Become plasma",
    ],
    heatCorrect: 2,
  },
  {
    description:
      "Particles arranged in rows and columns, vibrating only. Volume and shape are both fixed.",
    spacing: "close",
    motion: "vibrate",
    correctState: "solid",
    heatEffect: "What happens at the melting point?",
    heatAnswers: [
      "Particles gain enough energy to move freely",
      "Particles disappear",
      "Particles slow down suddenly",
      "Gas is formed directly",
    ],
    heatCorrect: 0,
  },
  {
    description:
      "Particles move freely, filling the container they're in. No fixed shape, but fixed volume.",
    spacing: "medium",
    motion: "flow",
    correctState: "liquid",
    heatEffect: "Why does a liquid flow but not expand to fill its container?",
    heatAnswers: [
      "It has no particles",
      "Particles have enough energy to flow but not to escape the surface tension completely",
      "It's too cold",
      "Particles are locked in place",
    ],
    heatCorrect: 1,
  },
  {
    description:
      "Particles move extremely fast in all directions, hitting the container walls.",
    spacing: "far",
    motion: "random",
    correctState: "gas",
    heatEffect: "Why does a gas expand to fill its container?",
    heatAnswers: [
      "It has no fixed volume and particles move randomly at high speed",
      "It is attracted to container walls",
      "Gas particles are very large",
      "It cools when expanding",
    ],
    heatCorrect: 0,
  },
  {
    description:
      "Regular rows of touching particles barely vibrating. Very low temperature substance.",
    spacing: "close",
    motion: "vibrate",
    correctState: "solid",
    heatEffect: "Sublimation is when a substance goes directly from:",
    heatAnswers: [
      "Liquid to gas",
      "Solid to liquid",
      "Solid to gas without becoming liquid",
      "Gas to solid",
    ],
    heatCorrect: 2,
  },
  {
    description:
      "Slow-moving particles that can slide over each other. Fixed volume, variable shape.",
    spacing: "medium",
    motion: "flow",
    correctState: "liquid",
    heatEffect: "Evaporation differs from boiling because:",
    heatAnswers: [
      "Only happens at the surface at all temperatures",
      "Requires no energy",
      "Only happens in solids",
      "Never produces gas",
    ],
    heatCorrect: 0,
  },
  {
    description:
      "Fast-moving, widely spaced particles that bounce off each other and container walls.",
    spacing: "far",
    motion: "random",
    correctState: "gas",
    heatEffect:
      "If you compress a gas (reduce volume), what happens to particles?",
    heatAnswers: [
      "They slow down and spread out",
      "They collide more frequently and pressure increases",
      "They form a liquid immediately",
      "Temperature drops",
    ],
    heatCorrect: 1,
  },
  {
    description:
      "Particles in a rigid array. Definite shape and volume. Cannot be compressed.",
    spacing: "close",
    motion: "vibrate",
    correctState: "solid",
    heatEffect: "Why can solids not be compressed easily?",
    heatAnswers: [
      "Their particles are already packed as close as possible",
      "They are too light",
      "They have no particles",
      "Their particles are moving too fast",
    ],
    heatCorrect: 0,
  },
  {
    description:
      "Moderate particle spacing. Flows when poured. Takes shape of container base.",
    spacing: "medium",
    motion: "flow",
    correctState: "liquid",
    heatEffect: "Condensation occurs when:",
    heatAnswers: [
      "A solid melts",
      "A liquid evaporates",
      "A gas cools and becomes liquid",
      "A solid sublimes",
    ],
    heatCorrect: 2,
  },
  {
    description:
      "Maximum spacing between particles. Moves into every part of available space.",
    spacing: "far",
    motion: "random",
    correctState: "gas",
    heatEffect: "Diffusion is fastest in which state of matter?",
    heatAnswers: ["Solid", "Liquid", "Gas", "All the same"],
    heatCorrect: 2,
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function MatterMaterials({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "properties-lab")
    return <PropertiesLab config={config} onGameEnd={onGameEnd} />;
  if (gameId === "particle-model")
    return <ParticleModel config={config} onGameEnd={onGameEnd} />;
  return <StatesOfMatter config={config} onGameEnd={onGameEnd} />;
}

// ============================================================================
// GAME 1 — States of Matter
// ============================================================================
function StatesOfMatter({ config, onGameEnd }: Props) {
  const challenges =
    config.difficulty === 1
      ? D1_CHALLENGES
      : config.difficulty === 2
        ? D2_CHALLENGES
        : D3_CHALLENGES;
  const [phase, setPhase] = useState<
    "start" | "state" | "classify" | "feedback"
  >("start");
  const [cIdx, setCIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [revealedState, setRevealedState] = useState<State | null>(null);

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
  const displayState = revealedState ?? "solid";
  const particleConf = PARTICLE_CONFIGS[displayState];
  const particleColor = STATE_COLORS[displayState];

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("state");
    setRevealedState(null);
    startTimer();
  }

  function handleStateSelect(s: State) {
    if (phase !== "state" || flash !== "idle") return;
    setSelectedState(s);
    setTotal((t) => t + 1);
    if (s === currentC.correctState) {
      setRevealedState(s);
      setScore((sc) => sc + config.difficulty * 150);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(currentC.stateReason);
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("classify");
      }, 1200);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Incorrect state. ${currentC.stateReason}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("classify");
      }, 1500);
    }
  }

  function handleClassify(c: Classification) {
    if (phase !== "classify" || flash !== "idle") return;
    setTotal((t) => t + 1);
    if (c === currentC.correctClass) {
      setScore((sc) => sc + config.difficulty * 150);
      setCorrect((cc) => cc + 1);
      setFlash("correct");
      setFeedbackMsg(currentC.classReason);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Incorrect. ${currentC.classReason}`);
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
      setSelectedState(null);
      setRevealedState(null);
      const nextIdx = cIdx + 1;
      if (nextIdx >= challenges.length) endGame(true);
      else {
        setCIdx(nextIdx);
        setPhase("state");
      }
    }, 2000);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="matter_materials.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#00f5ff" }}>
          <Atom className="h-4 w-4" />
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
            <Atom
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#00f5ff" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#00f5ff",
                textShadow: "0 0 20px rgba(0,245,255,0.6)",
              }}
            >
              States of Matter Lab
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Identify the state of matter for each substance, then classify it
              as element, compound, or mixture.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="matter_materials.start_button"
            >
              Start Lab
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "state" || phase === "classify" || phase === "feedback") && (
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex-1 glass rounded-xl border border-border/30 p-4 relative overflow-hidden">
            <p
              className="text-xs uppercase tracking-widest mb-3 text-muted-foreground text-center"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              Particle View
            </p>
            <div className="relative w-full aspect-square max-h-48 mx-auto">
              {Array.from({ length: particleConf.count }).map((_, i) => {
                const angle = (i / particleConf.count) * 2 * Math.PI;
                const radius =
                  particleConf.spread + (i % 4) * (particleConf.spread * 0.3);
                return (
                  <motion.div
                    key={`p-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${50 + Math.cos(angle) * radius}%`,
                      top: `${50 + Math.sin(angle) * radius}%`,
                      width: "8px",
                      height: "8px",
                      background: particleColor,
                      boxShadow: `0 0 6px ${particleColor}`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                    animate={
                      displayState === "solid"
                        ? {}
                        : {
                            x: [
                              0,
                              (Math.random() - 0.5) *
                                (displayState === "liquid" ? 10 : 30),
                              (Math.random() - 0.5) *
                                (displayState === "liquid" ? 10 : 30),
                              0,
                            ],
                            y: [
                              0,
                              (Math.random() - 0.5) *
                                (displayState === "liquid" ? 10 : 30),
                              (Math.random() - 0.5) *
                                (displayState === "liquid" ? 10 : 30),
                              0,
                            ],
                          }
                    }
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1 / particleConf.speed,
                      delay: i * 0.05,
                    }}
                  />
                );
              })}
            </div>
            <p
              className="text-center text-sm font-bold mt-2"
              style={{ color: particleColor }}
            >
              {displayState.toUpperCase()}
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={cIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
              >
                <p
                  className="text-xs text-muted-foreground mb-1 uppercase tracking-wider"
                  style={{ fontFamily: "'Orbitron',sans-serif" }}
                >
                  Substance {cIdx + 1}
                </p>
                <h3 className="text-xl font-black text-foreground mb-1">
                  {currentC.substance}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {currentC.description}
                </p>
                <p className="text-lg font-mono" style={{ color: "#f59e0b" }}>
                  {currentC.tempC > 999999
                    ? currentC.tempC.toExponential(0)
                    : currentC.tempC}
                  °C
                </p>
              </motion.div>
            </AnimatePresence>
            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-lg px-3 py-2 text-xs ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}
              >
                {feedbackMsg}
              </motion.div>
            )}
            {phase === "state" && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Select the state of matter:
                </p>
                {STATES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all"
                    style={{
                      borderColor: `${STATE_COLORS[s]}60`,
                      color: STATE_COLORS[s],
                      background:
                        selectedState === s
                          ? `${STATE_COLORS[s]}20`
                          : "transparent",
                    }}
                    onClick={() => handleStateSelect(s)}
                    data-ocid={`matter_materials.state.${s}`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            {phase === "classify" && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Now classify this substance:
                </p>
                {CLASSES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="px-4 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#00f5ff] hover:text-[#00f5ff] transition-all"
                    onClick={() => handleClassify(c)}
                    data-ocid={`matter_materials.class.${c}`}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2 — Properties Lab
// ============================================================================
function PropertiesLab({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<
    "start" | "testing" | "classify" | "feedback"
  >("start");
  const [mIdx, setMIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [testedProps, setTestedProps] = useState<Set<string>>(new Set());

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
  const current = MATERIALS[mIdx % MATERIALS.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  const classOptions = [
    "Metal",
    "Polymer",
    "Amorphous Solid",
    "Natural Material",
    "Semiconductor",
    "Textile",
    "Metal Alloy",
  ];

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("testing");
    setTestedProps(new Set());
    startTimer();
  }

  function handleTest(prop: string) {
    setTestedProps((prev) => new Set([...prev, prop]));
    setScore((s) => s + config.difficulty * 30);
    if (testedProps.size >= 3) {
      setTimeout(() => setPhase("classify"), 400);
    }
  }

  function handleClassify(cls: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (cls === current.classification) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${current.facts}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. ${current.material} is a ${current.classification}. ${current.facts}`,
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
      setTestedProps(new Set());
      const next = mIdx + 1;
      if (next >= MATERIALS.length) endGame(true);
      else {
        setMIdx(next);
        setPhase("testing");
      }
    }, 2000);
  }

  const propTests = [
    {
      key: "conductor",
      label: "Conductivity Test",
      result: current.conductor ? "Conducts electricity" : "Does not conduct",
    },
    {
      key: "elastic",
      label: "Elasticity Test",
      result: current.elastic ? "Stretches and returns" : "Not elastic",
    },
    {
      key: "transparent",
      label: "Transparency Test",
      result: current.transparent ? "Light passes through" : "Opaque",
    },
    {
      key: "hard",
      label: "Hardness Test",
      result: current.hard ? "Hard and rigid" : "Soft and flexible",
    },
  ];

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="properties_lab.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#a855f7" }}>
          <Atom className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {mIdx + 1}/{MATERIALS.length}
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
            <Atom
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
              Properties Lab
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Test materials for conductivity, elasticity, transparency, and
              hardness. Then classify them based on results.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="properties_lab.start_button"
            >
              Enter Lab
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "testing" ||
        phase === "classify" ||
        phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-xl p-4 border border-border/30">
            <h3
              className="text-xl font-black mb-1"
              style={{ color: "#a855f7" }}
            >
              {current.material}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Run tests to reveal properties, then classify the material.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {propTests.map((pt) => (
                <button
                  key={pt.key}
                  type="button"
                  className="px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all text-left"
                  style={
                    testedProps.has(pt.key)
                      ? {
                          borderColor: "#a855f7",
                          background: "#a855f720",
                          color: "#a855f7",
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.2)",
                          color: "rgba(255,255,255,0.5)",
                        }
                  }
                  onClick={() => handleTest(pt.key)}
                  data-ocid={`properties_lab.test.${pt.key}`}
                >
                  <span className="text-xs block">{pt.label}</span>
                  {testedProps.has(pt.key) && (
                    <span className="text-xs opacity-80">{pt.result}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {(phase === "classify" || phase === "feedback") && (
            <div
              className={`glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <p className="text-xs text-muted-foreground mb-3">
                Based on test results, classify this material:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {classOptions.map((cls, i) => (
                  <button
                    key={cls}
                    type="button"
                    className="px-3 py-2 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#a855f7] hover:text-[#a855f7] transition-all"
                    onClick={() => handleClassify(cls)}
                    data-ocid={`properties_lab.class.${i}`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
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

// ============================================================================
// GAME 3 — Particle Model
// ============================================================================
function ParticleModel({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "state" | "heat" | "feedback">(
    "start",
  );
  const [qIdx, setQIdx] = useState(0);
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
  const current = PARTICLE_QUESTIONS[qIdx % PARTICLE_QUESTIONS.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("state");
    startTimer();
  }

  function handleState(s: State) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (s === current.correctState) {
      setScore((sc) => sc + config.difficulty * 120);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! This is a ${current.correctState}. Now answer the heat effect question.`,
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("heat");
      }, 1000);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. This is a ${current.correctState}.`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("heat");
      }, 1500);
    }
  }

  function handleHeat(idx: number) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === current.heatCorrect) {
      const pts = config.difficulty * 150;
      setScore((sc) => sc + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! +${pts} pts`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. Correct: "${current.heatAnswers[current.heatCorrect]}"`,
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
      const next = qIdx + 1;
      if (next >= PARTICLE_QUESTIONS.length) endGame(true);
      else {
        setQIdx(next);
        setPhase("state");
      }
    }, 2000);
  }

  const spacingColors: Record<string, string> = {
    close: "#7c3aed",
    medium: "#00f5ff",
    far: "#10b981",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="particle_model.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#06b6d4" }}>
          <Atom className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {qIdx + 1}/{PARTICLE_QUESTIONS.length}
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
            <Atom
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
              Particle Model
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Read particle diagrams and identify states of matter. Then predict
              what happens when heat is added or removed.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="particle_model.start_button"
            >
              Start Analysis
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "state" || phase === "heat" || phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              {/* Particle diagram visual */}
              <div className="flex justify-center mb-4">
                <div className="relative w-40 h-20 glass rounded-xl border border-border/20 overflow-hidden">
                  {Array.from({
                    length:
                      current.spacing === "close"
                        ? 20
                        : current.spacing === "medium"
                          ? 12
                          : 6,
                  }).map((_, i) => {
                    const col =
                      current.spacing === "close"
                        ? 5
                        : current.spacing === "medium"
                          ? 4
                          : 3;
                    const row = Math.floor(i / col);
                    const c = i % col;
                    const spread =
                      current.spacing === "close"
                        ? 18
                        : current.spacing === "medium"
                          ? 28
                          : 50;
                    const x =
                      10 +
                      c * spread +
                      (current.spacing === "far" ? Math.random() * 10 - 5 : 0);
                    const y =
                      10 +
                      row * spread +
                      (current.spacing === "far" ? Math.random() * 10 - 5 : 0);
                    const pColor = spacingColors[current.spacing];
                    return (
                      <motion.div
                        key={`dp-${i}`}
                        className="absolute rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: "8px",
                          height: "8px",
                          background: pColor,
                          boxShadow: `0 0 4px ${pColor}`,
                        }}
                        animate={
                          current.motion === "vibrate"
                            ? { x: [-1, 1, -1], y: [-1, 1, -1] }
                            : current.motion === "flow"
                              ? { x: [-5, 5, -3, 3, -5], y: [-3, 3, -5, 5, -3] }
                              : {
                                  x: [-15, 15, -10, 10, -15],
                                  y: [-12, 12, -15, 8, -12],
                                }
                        }
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration:
                            current.motion === "vibrate"
                              ? 0.3
                              : current.motion === "flow"
                                ? 1.5
                                : 0.8,
                          delay: i * 0.05,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <p className="text-sm font-medium text-foreground mb-4">
                {current.description}
              </p>

              {phase === "state" && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Identify the state of matter shown:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATES.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all"
                        style={{
                          borderColor: `${STATE_COLORS[s]}60`,
                          color: STATE_COLORS[s],
                        }}
                        onClick={() => handleState(s)}
                        data-ocid={`particle_model.state.${s}`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {(phase === "heat" || phase === "feedback") && (
                <>
                  <p className="text-xs font-semibold text-foreground mb-3">
                    {current.heatEffect}
                  </p>
                  <div className="flex flex-col gap-2">
                    {current.heatAnswers.map((ans, i) => (
                      <button
                        key={`ha-${i}`}
                        type="button"
                        className="text-left px-4 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all"
                        onClick={() => handleHeat(i)}
                        data-ocid={`particle_model.heat.${i}`}
                      >
                        {ans}
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
