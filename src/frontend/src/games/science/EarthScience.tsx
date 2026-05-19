import { GlowButton } from "@/components/ui/GlowButton";
import { Heart, Layers } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Game 1: Geological Survey data ─────────────────────────────────────────────────
type RockType = "Igneous" | "Sedimentary" | "Metamorphic";
type Era = "Paleozoic" | "Mesozoic" | "Cenozoic";

interface RockSample {
  name: string;
  texture: string;
  grainSize: string;
  formationDesc: string;
  type: RockType;
  formationQ: string;
  formationOptions: string[];
  formationCorrect: number;
}
interface Fossil {
  name: string;
  era: Era;
}

const ROCKS: RockSample[] = [
  {
    name: "Granite",
    texture: "Coarse, crystalline",
    grainSize: "Large (>5mm)",
    formationDesc: "Cooled slowly deep underground from magma",
    type: "Igneous",
    formationQ: "How does granite form?",
    formationOptions: [
      "Magma cools slowly underground",
      "Sediment compacts under pressure",
      "Heat/pressure transforms rock",
      "Lava cools on surface",
    ],
    formationCorrect: 0,
  },
  {
    name: "Basalt",
    texture: "Fine-grained, dense",
    grainSize: "Small (<1mm)",
    formationDesc: "Lava cooled rapidly at the earth's surface",
    type: "Igneous",
    formationQ: "Why is basalt fine-grained?",
    formationOptions: [
      "It formed underwater",
      "Rapid cooling leaves no time for large crystals",
      "Sediment was compressed",
      "It was metamorphosed",
    ],
    formationCorrect: 1,
  },
  {
    name: "Sandstone",
    texture: "Gritty, granular",
    grainSize: "Medium (0.06-2mm)",
    formationDesc: "Sand grains cemented together over millions of years",
    type: "Sedimentary",
    formationQ: "What process creates sandstone?",
    formationOptions: [
      "Volcanic eruption",
      "Metamorphism",
      "Compaction and cementation of sand",
      "Melting and re-solidification",
    ],
    formationCorrect: 2,
  },
  {
    name: "Limestone",
    texture: "Fine-grained, porous",
    grainSize: "Fine (<0.06mm)",
    formationDesc: "Marine organisms' shells accumulated and compacted",
    type: "Sedimentary",
    formationQ: "What is the main source material of limestone?",
    formationOptions: [
      "Volcanic ash",
      "Shell and coral debris",
      "Metamorphic pressure",
      "Igneous fragments",
    ],
    formationCorrect: 1,
  },
  {
    name: "Marble",
    texture: "Crystalline, smooth",
    grainSize: "Medium-coarse",
    formationDesc: "Limestone recrystallised under intense heat and pressure",
    type: "Metamorphic",
    formationQ: "What rock transforms into marble?",
    formationOptions: ["Basalt", "Limestone", "Sandstone", "Shale"],
    formationCorrect: 1,
  },
  {
    name: "Slate",
    texture: "Fine-grained, foliated",
    grainSize: "Very fine",
    formationDesc: "Shale subjected to low-grade metamorphism",
    type: "Metamorphic",
    formationQ: "Which rock is the parent rock of slate?",
    formationOptions: ["Granite", "Basalt", "Sandstone", "Shale"],
    formationCorrect: 3,
  },
  {
    name: "Quartzite",
    texture: "Very hard, granular",
    grainSize: "Medium",
    formationDesc: "Sandstone fused under extreme pressure",
    type: "Metamorphic",
    formationQ: "What property makes quartzite extremely hard?",
    formationOptions: [
      "Sediment layers",
      "High silica content fused by pressure",
      "Volcanic glass",
      "Organic matter",
    ],
    formationCorrect: 1,
  },
  {
    name: "Obsidian",
    texture: "Glassy, smooth",
    grainSize: "None (amorphous)",
    formationDesc: "Volcanic lava cooled so fast no crystals formed",
    type: "Igneous",
    formationQ: "Why does obsidian have no crystals?",
    formationOptions: [
      "Formed underwater",
      "Cooled too fast for crystals to grow",
      "Under extreme pressure",
      "Contains no minerals",
    ],
    formationCorrect: 1,
  },
  {
    name: "Conglomerate",
    texture: "Rounded pebbles in matrix",
    grainSize: "Very coarse",
    formationDesc: "Large rounded sediment cemented by finer material",
    type: "Sedimentary",
    formationQ: "Rounded clasts in conglomerate indicate what?",
    formationOptions: [
      "Volcanic origin",
      "Transport by water over long distances",
      "Metamorphic recrystallisation",
      "Deep burial pressure",
    ],
    formationCorrect: 1,
  },
  {
    name: "Gneiss",
    texture: "Banded, coarse",
    grainSize: "Coarse",
    formationDesc: "High-grade metamorphism of granite or sedimentary rock",
    type: "Metamorphic",
    formationQ: "What characterises gneiss?",
    formationOptions: [
      "Folded volcanic layers",
      "Alternating light and dark mineral bands",
      "Sediment cross-bedding",
      "Glassy texture",
    ],
    formationCorrect: 1,
  },
  {
    name: "Pumice",
    texture: "Porous, lightweight",
    grainSize: "Vesicular",
    formationDesc: "Frothy lava solidified with gas bubbles trapped inside",
    type: "Igneous",
    formationQ: "Why does pumice float on water?",
    formationOptions: [
      "It contains salt",
      "Trapped gas bubbles make it less dense than water",
      "It is made of clay",
      "It forms in rivers",
    ],
    formationCorrect: 1,
  },
  {
    name: "Shale",
    texture: "Layered, flaky",
    grainSize: "Very fine (<0.004mm)",
    formationDesc: "Fine clay particles deposited in calm water",
    type: "Sedimentary",
    formationQ: "Where does shale typically form?",
    formationOptions: [
      "Deep ocean trenches",
      "Volcanic vents",
      "Quiet lakes or deep seas",
      "Mountain peaks",
    ],
    formationCorrect: 2,
  },
];

const FOSSILS: Fossil[] = [
  { name: "Trilobite", era: "Paleozoic" },
  { name: "T-Rex", era: "Mesozoic" },
  { name: "Mammoth", era: "Cenozoic" },
  { name: "Ammonite", era: "Mesozoic" },
  { name: "Crinoid", era: "Paleozoic" },
];

const ROCK_TYPES: RockType[] = ["Igneous", "Sedimentary", "Metamorphic"];
const ERAS: Era[] = ["Paleozoic", "Mesozoic", "Cenozoic"];

// ─── Game 2: Tectonic Master data ────────────────────────────────────────────────────
interface TectonicScenario {
  description: string;
  plates: string;
  boundaryType: string;
  geologicalFeature: string;
  boundaryOptions: string[];
  featureOptions: string[];
}

const TECTONIC_SCENARIOS: TectonicScenario[] = [
  {
    description:
      "Two oceanic plates collide head-on. One plate slides beneath the other.",
    plates: "Pacific Plate meets Philippine Plate",
    boundaryType: "Convergent",
    geologicalFeature: "Deep ocean trench",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Mountain range",
      "Rift valley",
      "Deep ocean trench",
      "Earthquake fault",
    ],
  },
  {
    description: "Two continental plates pull apart from each other.",
    plates: "African Plate and Arabian Plate separating",
    boundaryType: "Divergent",
    geologicalFeature: "Rift valley",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Mountain range",
      "Rift valley",
      "Subduction trench",
      "Strike-slip fault",
    ],
  },
  {
    description:
      "Two plates slide horizontally past each other in opposite directions.",
    plates: "Pacific Plate and North American Plate at San Andreas",
    boundaryType: "Transform",
    geologicalFeature: "Earthquake zone",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Volcano chain",
      "Mountain range",
      "Earthquake zone",
      "Mid-ocean ridge",
    ],
  },
  {
    description:
      "An oceanic plate collides with a continental plate. The denser oceanic plate descends.",
    plates: "Nazca Plate meets South American Plate",
    boundaryType: "Convergent",
    geologicalFeature: "Volcanic mountain range",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Rift valley",
      "Volcanic mountain range",
      "Strike-slip fault",
      "Mid-ocean ridge",
    ],
  },
  {
    description:
      "Two tectonic plates move apart along the ocean floor. New oceanic crust is created.",
    plates: "Eurasian and North American plates at Mid-Atlantic Ridge",
    boundaryType: "Divergent",
    geologicalFeature: "Mid-ocean ridge",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Trench",
      "Mid-ocean ridge",
      "Mountain range",
      "Fault line",
    ],
  },
  {
    description:
      "Two continental plates push against each other with enormous force.",
    plates: "Indian Plate meets Eurasian Plate forming Himalayas",
    boundaryType: "Convergent",
    geologicalFeature: "Mountain range",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Mountain range",
      "Trench",
      "Rift valley",
      "Strike-slip fault",
    ],
  },
  {
    description:
      "Plates separate, and basaltic magma rises to fill the gap along the seafloor.",
    plates: "Mid-Atlantic Ridge area",
    boundaryType: "Divergent",
    geologicalFeature: "Mid-ocean ridge with volcanic activity",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Continental mountain",
      "Mid-ocean ridge with volcanic activity",
      "Transform fault",
      "Island arc",
    ],
  },
  {
    description:
      "Oceanic plate subducts under another oceanic plate forming island arcs.",
    plates: "Pacific Plate subducting under Eurasian",
    boundaryType: "Convergent",
    geologicalFeature: "Island arc and trench",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Mountain range",
      "Rift valley",
      "Island arc and trench",
      "Strike-slip fault",
    ],
  },
  {
    description:
      "Plates grind past each other generating intense seismic activity.",
    plates: "Anatolian Plate versus Eurasian Plate in Turkey",
    boundaryType: "Transform",
    geologicalFeature: "Major earthquake fault zone",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Volcano",
      "Trench",
      "Major earthquake fault zone",
      "Rift valley",
    ],
  },
  {
    description:
      "Continental rifting: a continent splits apart slowly over millions of years.",
    plates: "East African Rift Valley",
    boundaryType: "Divergent",
    geologicalFeature: "Continental rift valley",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Convergent trench",
      "Continental rift valley",
      "Strike-slip fault",
      "Mountain range",
    ],
  },
  {
    description:
      "Dense oceanic plate bends and sinks into the mantle at a steep angle.",
    plates: "Philippine Plate subducting under Mariana plate",
    boundaryType: "Convergent",
    geologicalFeature: "Deepest ocean trench on Earth",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Mid-ocean ridge",
      "Deepest ocean trench on Earth",
      "Continental mountain",
      "Rift valley",
    ],
  },
  {
    description:
      "Two plates lock together, building up stress, then suddenly slip releasing energy.",
    plates: "Any locked plate boundary",
    boundaryType: "Transform",
    geologicalFeature: "Earthquake epicenter zone",
    boundaryOptions: ["Convergent", "Divergent", "Transform"],
    featureOptions: [
      "Volcano",
      "Trench",
      "Rift valley",
      "Earthquake epicenter zone",
    ],
  },
];

// ─── Game 3: Earth Layers data ───────────────────────────────────────────────────────
interface EarthLayerQ {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

const EARTH_LAYER_QUIZ: EarthLayerQ[] = [
  {
    question: "Which layer of the Earth do we live on?",
    answers: ["Inner Core", "Outer Core", "Mantle", "Crust"],
    correct: 3,
    explanation:
      "The crust is Earth's outermost solid layer. Continental crust averages 35 km thick.",
  },
  {
    question: "What is the state of the Outer Core?",
    answers: ["Solid rock", "Liquid iron and nickel", "Solid iron", "Gas"],
    correct: 1,
    explanation:
      "The outer core is liquid molten iron and nickel. Its motion generates Earth's magnetic field.",
  },
  {
    question: "What is the state of the Inner Core?",
    answers: ["Liquid iron", "Gaseous metal", "Solid iron and nickel", "Magma"],
    correct: 2,
    explanation:
      "Despite being the hottest layer (~5000°C), the inner core is solid due to immense pressure.",
  },
  {
    question: "Which layer makes up the largest volume of Earth?",
    answers: ["Crust", "Inner Core", "Outer Core", "Mantle"],
    correct: 3,
    explanation:
      "The mantle makes up ~84% of Earth's total volume, extending 2900 km deep.",
  },
  {
    question: "What causes tectonic plate movement?",
    answers: [
      "Earth's rotation",
      "Convection currents in the mantle",
      "Gravitational pull of Moon",
      "Solar radiation",
    ],
    correct: 1,
    explanation:
      "Slow convection currents in the semi-molten mantle drag tectonic plates across Earth's surface.",
  },
  {
    question:
      "What is the approximate depth of the Mohorovicic discontinuity (Moho)?",
    answers: ["50 km", "500 km", "5000 km", "6371 km"],
    correct: 0,
    explanation:
      "The Moho is the boundary between crust and mantle, ~5-35 km below surface.",
  },
  {
    question: "What generates Earth's magnetic field?",
    answers: [
      "Solar wind",
      "Rotation of solid inner core",
      "Convection in liquid outer core",
      "Crystalline crust",
    ],
    correct: 2,
    explanation:
      "Moving liquid iron in the outer core creates a dynamo effect generating Earth's magnetic field.",
  },
  {
    question: "At what depth does the mantle begin?",
    answers: [
      "Below the crust (5-35 km deep)",
      "At 500 km",
      "At 2900 km",
      "At 6371 km",
    ],
    correct: 0,
    explanation:
      "The mantle begins directly below the crust at the Moho boundary.",
  },
  {
    question: "What is the approximate temperature at Earth's center?",
    answers: ["1000°C", "3000°C", "5000°C", "10000°C"],
    correct: 2,
    explanation:
      "Earth's inner core is approximately 5000°C — as hot as the Sun's surface.",
  },
  {
    question: "What type of rock is the oceanic crust primarily made of?",
    answers: ["Granite (felsic)", "Sandstone", "Basalt (mafic)", "Marble"],
    correct: 2,
    explanation:
      "Oceanic crust is denser, thinner, and primarily basaltic. Continental crust is lighter, thicker granite.",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function EarthScience({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "tectonic-master")
    return <TectonicMaster config={config} onGameEnd={onGameEnd} />;
  if (gameId === "earth-layers")
    return <EarthLayers config={config} onGameEnd={onGameEnd} />;
  return <GeologicalSurvey config={config} onGameEnd={onGameEnd} />;
}

// ============================================================================
// GAME 1 — Geological Survey
// ============================================================================
function GeologicalSurvey({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "rocks" | "fossil" | "done">(
    "start",
  );
  const [rockIdx, setRockIdx] = useState(0);
  const [stage, setStage] = useState<"type" | "question">("type");
  const [score, setScore] = useState(0);
  const [fossilIdx, setFossilIdx] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [typeSelected, setTypeSelected] = useState<RockType | null>(null);

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const ROCKS_PER_GAME = 12;
  const rockList = ROCKS.slice(0, ROCKS_PER_GAME);
  const currentRock = rockList[rockIdx] ?? rockList[0];

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

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("rocks");
    startTimer();
  }

  function handleTypeSelect(t: RockType) {
    if (flash !== "idle") return;
    setTotal((v) => v + 1);
    if (t === currentRock.type) {
      setTypeSelected(t);
      setFlash("correct");
      setFeedbackMsg("Correct rock type! Now answer the formation question.");
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setStage("question");
      }, 700);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Incorrect. This is ${currentRock.type} rock.`);
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setTypeSelected(null);
        advanceRock();
      }, 1200);
    }
  }

  function handleFormationAnswer(idx: number) {
    if (flash !== "idle") return;
    setTotal((v) => v + 1);
    if (idx === currentRock.formationCorrect) {
      const pts = typeSelected
        ? 200 * config.difficulty
        : 100 * config.difficulty;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! +${pts} pts`);
    } else {
      if (typeSelected) {
        const pts = 100 * config.difficulty;
        setScore((s) => s + pts);
        setFeedbackMsg(
          `Wrong answer. Type was correct though (+${pts} pts). Answer: ${currentRock.formationOptions[currentRock.formationCorrect]}`,
        );
      } else {
        setFeedbackMsg(
          `Wrong. Answer: ${currentRock.formationOptions[currentRock.formationCorrect]}`,
        );
      }
      setFlash("wrong");
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      setTypeSelected(null);
      setStage("type");
      advanceRock();
    }, 1400);
  }

  function advanceRock() {
    const next = rockIdx + 1;
    if (next >= ROCKS_PER_GAME) setPhase("fossil");
    else setRockIdx(next);
  }

  function handleFossilEra(era: Era) {
    if (flash !== "idle") return;
    const fossil = FOSSILS[fossilIdx];
    setTotal((v) => v + 1);
    if (era === fossil.era) {
      const pts = 150 * config.difficulty;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${fossil.name} is from the ${fossil.era}. +${pts} pts`,
      );
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${fossil.name} is from the ${fossil.era}.`);
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const nextFossil = fossilIdx + 1;
      if (nextFossil >= FOSSILS.length) endGame(true);
      else setFossilIdx(nextFossil);
    }, 1200);
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;
  const timerBarStyle = { width: `${progressPct}%` };
  const flashBorder =
    flash === "correct"
      ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
      : flash === "wrong"
        ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        : "border-border/30";

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="earth_science.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Layers className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {phase === "fossil"
            ? `Fossil ${fossilIdx + 1}/${FOSSILS.length}`
            : `Rock ${rockIdx + 1}/${ROCKS_PER_GAME}`}
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

      {phase === "start" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
            <Layers
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
              Rock Geologist
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Classify 12 rock samples, answer formation questions, then
              identify 5 fossils by geological era.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="earth_science.start_button"
            >
              Begin Excavation
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "rocks" && (
        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={rockIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={`glass-card rounded-xl p-5 border-2 ${flashBorder} transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-xl font-black"
                    style={{ color: "#f59e0b" }}
                  >
                    {currentRock.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rock Sample #{rockIdx + 1}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Texture</p>
                  <p className="text-sm font-medium text-foreground">
                    {currentRock.texture}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Grain Size
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {currentRock.grainSize}
                  </p>
                </div>
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Formation
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {currentRock.formationDesc}
                  </p>
                </div>
              </div>
              {stage === "type" && (
                <div>
                  <p
                    className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                    style={{ fontFamily: "'Orbitron',sans-serif" }}
                  >
                    Classify Rock Type
                  </p>
                  <div className="flex gap-2">
                    {ROCK_TYPES.map((t, i) => (
                      <button
                        key={t}
                        type="button"
                        className="flex-1 py-2 rounded-lg border border-border/40 text-sm font-semibold transition-all hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 text-muted-foreground hover:text-foreground"
                        onClick={() => handleTypeSelect(t)}
                        data-ocid={`earth_science.rock_type.${i}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {stage === "question" && (
                <div>
                  <p className="text-sm font-semibold mb-3 text-foreground">
                    {currentRock.formationQ}
                  </p>
                  <div className="flex flex-col gap-2">
                    {currentRock.formationOptions.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        className="text-left px-3 py-2 rounded-lg border border-border/40 text-sm transition-all hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/5 text-muted-foreground hover:text-foreground"
                        onClick={() => handleFormationAnswer(i)}
                        data-ocid={`earth_science.formation_ans.${i}`}
                      >
                        <span className="font-mono text-xs mr-2 opacity-60">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
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
              className={`rounded-lg px-3 py-2 text-xs font-medium ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}
            >
              {feedbackMsg}
            </motion.div>
          )}
        </div>
      )}

      {phase === "fossil" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 text-center max-w-sm w-full"
          >
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-2"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              Bonus: Fossil Era
            </p>
            <p
              className="text-2xl font-black mb-1"
              style={{ color: "#f59e0b" }}
            >
              {FOSSILS[fossilIdx].name}
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Fossil {fossilIdx + 1} of {FOSSILS.length} — Select the geological
              era
            </p>
            <div className="flex flex-col gap-2">
              {ERAS.map((era, i) => (
                <button
                  key={era}
                  type="button"
                  className="py-3 rounded-xl border border-border/40 text-sm font-bold transition-all hover:border-[#a855f7] hover:bg-[#a855f7]/10 text-muted-foreground hover:text-foreground"
                  onClick={() => handleFossilEra(era)}
                  data-ocid={`earth_science.era.${i}`}
                >
                  {era} Era
                </button>
              ))}
            </div>
            {feedbackMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 text-xs font-medium ${flash === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
              >
                {feedbackMsg}
              </motion.p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2 — Tectonic Master
// ============================================================================
function TectonicMaster({ config, onGameEnd }: Props) {
  const totalQ =
    config.difficulty === 1 ? 8 : config.difficulty === 2 ? 10 : 12;
  const scenarios = TECTONIC_SCENARIOS.slice(0, totalQ);

  const [phase, setPhase] = useState<
    "start" | "boundary" | "feature" | "feedback"
  >("start");
  const [sIdx, setSIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [chosenBoundary, setChosenBoundary] = useState("");

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
  const current = scenarios[sIdx % scenarios.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;
  const boundaryColors: Record<string, string> = {
    Convergent: "#f43f5e",
    Divergent: "#10b981",
    Transform: "#f59e0b",
  };

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("boundary");
    startTimer();
  }

  function handleBoundary(boundary: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    setChosenBoundary(boundary);
    if (boundary === current.boundaryType) {
      setScore((s) => s + config.difficulty * 120);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${current.boundaryType} boundary. Now identify the geological feature created.`,
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("feature");
      }, 1000);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. This is a ${current.boundaryType} boundary. Try the feature.`,
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("feature");
      }, 1500);
    }
  }

  function handleFeature(feature: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (feature === current.geologicalFeature) {
      const pts =
        config.difficulty *
        (chosenBoundary === current.boundaryType ? 200 : 100);
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${current.geologicalFeature} is created at this boundary. +${pts} pts`,
      );
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. The feature created is: ${current.geologicalFeature}`,
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
      setChosenBoundary("");
      const next = sIdx + 1;
      if (next >= scenarios.length) endGame(true);
      else {
        setSIdx(next);
        setPhase("boundary");
      }
    }, 2000);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="tectonic_master.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f97316" }}>
          <Layers className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {sIdx + 1}/{scenarios.length}
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
            <Layers
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
              Tectonic Master
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Plate boundary scenarios shown. Classify as Convergent, Divergent,
              or Transform. Then identify the geological feature created.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="tectonic_master.start_button"
            >
              Begin Geology
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "boundary" ||
        phase === "feature" ||
        phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={sIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <p className="text-sm font-medium text-foreground mb-2">
                {current.description}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {current.plates}
              </p>
              {phase === "boundary" && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Step 1 — Classify the plate boundary:
                  </p>
                  <div className="flex gap-2">
                    {current.boundaryOptions.map((b, i) => (
                      <button
                        key={b}
                        type="button"
                        className="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all"
                        style={{
                          borderColor: `${boundaryColors[b]}60`,
                          color: boundaryColors[b],
                        }}
                        onClick={() => handleBoundary(b)}
                        data-ocid={`tectonic_master.boundary.${i}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {(phase === "feature" || phase === "feedback") && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Step 2 — What geological feature does this create?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {current.featureOptions.map((f, i) => (
                      <button
                        key={f}
                        type="button"
                        className="px-3 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f97316] hover:text-[#f97316] transition-all"
                        onClick={() => handleFeature(f)}
                        data-ocid={`tectonic_master.feature.${i}`}
                      >
                        {f}
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
// GAME 3 — Earth Layers
// ============================================================================
function EarthLayers({ config, onGameEnd }: Props) {
  const LAYERS = [
    {
      name: "Crust",
      depth: "0–35 km",
      temp: "0–870°C",
      state: "Solid",
      color: "#f59e0b",
      radius: 90,
    },
    {
      name: "Mantle",
      depth: "35–2900 km",
      temp: "870–4000°C",
      state: "Semi-solid (viscous)",
      color: "#f97316",
      radius: 75,
    },
    {
      name: "Outer Core",
      depth: "2900–5150 km",
      temp: "4000–5000°C",
      state: "Liquid (iron/nickel)",
      color: "#f43f5e",
      radius: 50,
    },
    {
      name: "Inner Core",
      depth: "5150–6371 km",
      temp: "~5000°C",
      state: "Solid (iron/nickel)",
      color: "#7c3aed",
      radius: 28,
    },
  ];

  const [phase, setPhase] = useState<"start" | "label" | "quiz" | "feedback">(
    "start",
  );
  const [labelIdx, setLabelIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [revealedLayers, setRevealedLayers] = useState<Set<number>>(new Set());

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
  const progressPct = (timeLeft / config.timeLimit) * 100;
  const currentLayer = LAYERS[labelIdx % LAYERS.length];
  const currentQ = EARTH_LAYER_QUIZ[qIdx % EARTH_LAYER_QUIZ.length];

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("label");
    startTimer();
  }

  function handleLayerLabel(name: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (name === currentLayer.name) {
      const pts = config.difficulty * 120;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${currentLayer.name}: ${currentLayer.depth}, ${currentLayer.state}.`,
      );
      setRevealedLayers((prev) => new Set([...prev, labelIdx]));
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. This is the ${currentLayer.name}.`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const next = labelIdx + 1;
      if (next >= LAYERS.length) setPhase("quiz");
      else setLabelIdx(next);
    }, 1400);
  }

  function handleQuizAnswer(idx: number) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === currentQ.correct) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${currentQ.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${currentQ.explanation}`);
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
      if (next >= EARTH_LAYER_QUIZ.length) endGame(true);
      else {
        setQIdx(next);
        setPhase("quiz");
      }
    }, 2000);
  }

  const labelOptions = ["Crust", "Mantle", "Outer Core", "Inner Core"];

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="earth_layers.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f97316" }}>
          <Layers className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {phase === "label"
            ? `Layer ${labelIdx + 1}/4`
            : `Q${qIdx + 1}/${EARTH_LAYER_QUIZ.length}`}
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
            <Layers
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
              Earth Layers
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Label the 4 layers of the Earth, then answer questions about
              depth, temperature, and state of each layer.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="earth_layers.start_button"
            >
              Begin Labeling
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "label" && (
        <div className="flex-1 flex flex-col gap-3">
          {/* Earth cross-section visualization */}
          <div className="flex justify-center">
            <div className="relative" style={{ width: 200, height: 200 }}>
              {[...LAYERS].reverse().map((layer) => (
                <div
                  key={layer.name}
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    width: `${layer.radius * 2}px`,
                    height: `${layer.radius * 2}px`,
                    top: `${100 - layer.radius}px`,
                    left: `${100 - layer.radius}px`,
                    background: `${layer.color}${revealedLayers.has(LAYERS.indexOf(layer)) ? "60" : "20"}`,
                    border: `2px solid ${layer.color}${revealedLayers.has(LAYERS.indexOf(layer)) ? "" : "40"}`,
                  }}
                >
                  {revealedLayers.has(LAYERS.indexOf(layer)) && (
                    <span className="text-xs font-bold text-white">
                      {layer.name}
                    </span>
                  )}
                </div>
              ))}
              {/* Highlight current */}
              <div
                className="absolute rounded-full animate-ping"
                style={{
                  width: `${currentLayer.radius * 2}px`,
                  height: `${currentLayer.radius * 2}px`,
                  top: `${100 - currentLayer.radius}px`,
                  left: `${100 - currentLayer.radius}px`,
                  background: `${currentLayer.color}30`,
                  border: `2px solid ${currentLayer.color}`,
                }}
              />
            </div>
          </div>

          <div
            className={`glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
          >
            <p className="text-xs text-muted-foreground mb-1">
              Depth:{" "}
              <span className="font-mono text-foreground">
                {currentLayer.depth}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              Temperature:{" "}
              <span className="font-mono text-foreground">
                {currentLayer.temp}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              State:{" "}
              <span className="font-mono text-foreground">
                {currentLayer.state}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Which layer of Earth has these properties?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {labelOptions.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className="px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f97316] hover:text-[#f97316] transition-all"
                  onClick={() => handleLayerLabel(label)}
                  data-ocid={`earth_layers.label.${i}`}
                >
                  {label}
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

      {(phase === "quiz" || phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Earth Layers Deep Knowledge
              </p>
              <p className="text-sm font-semibold text-foreground mb-4">
                {currentQ.question}
              </p>
              <div className="flex flex-col gap-2">
                {currentQ.answers.map((ans, i) => (
                  <button
                    key={`ans-${i}`}
                    type="button"
                    className="text-left px-4 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f97316] hover:text-[#f97316] transition-all"
                    onClick={() => handleQuizAnswer(i)}
                    data-ocid={`earth_layers.quiz.${i}`}
                  >
                    <span className="font-mono text-xs mr-2 opacity-60">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {ans}
                  </button>
                ))}
              </div>
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
