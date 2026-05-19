import { GlowButton } from "@/components/ui/GlowButton";
import { Heart, Leaf, TrendingDown, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Game 1 types ────────────────────────────────────────────────────────────
interface Species {
  id: string;
  name: string;
  role: "producer" | "herbivore" | "carnivore" | "omnivore" | "decomposer";
  eats: string[];
  population: number;
  maxPop: number;
  icon: string;
  color: string;
}

const BASE_SPECIES: Species[] = [
  {
    id: "grass",
    name: "Grass",
    role: "producer",
    eats: [],
    population: 500,
    maxPop: 1000,
    icon: "G",
    color: "#4ade80",
  },
  {
    id: "shrub",
    name: "Shrub",
    role: "producer",
    eats: [],
    population: 200,
    maxPop: 500,
    icon: "S",
    color: "#22c55e",
  },
  {
    id: "rabbit",
    name: "Rabbit",
    role: "herbivore",
    eats: ["grass", "shrub"],
    population: 100,
    maxPop: 300,
    icon: "R",
    color: "#a78bfa",
  },
  {
    id: "deer",
    name: "Deer",
    role: "herbivore",
    eats: ["grass", "shrub"],
    population: 60,
    maxPop: 200,
    icon: "D",
    color: "#c084fc",
  },
  {
    id: "fox",
    name: "Fox",
    role: "carnivore",
    eats: ["rabbit"],
    population: 20,
    maxPop: 80,
    icon: "F",
    color: "#fb923c",
  },
  {
    id: "wolf",
    name: "Wolf",
    role: "carnivore",
    eats: ["deer", "rabbit"],
    population: 10,
    maxPop: 40,
    icon: "W",
    color: "#f43f5e",
  },
  {
    id: "mushroom",
    name: "Fungus",
    role: "decomposer",
    eats: [],
    population: 150,
    maxPop: 400,
    icon: "M",
    color: "#94a3b8",
  },
  {
    id: "bear",
    name: "Bear",
    role: "omnivore",
    eats: ["rabbit", "deer", "shrub"],
    population: 5,
    maxPop: 20,
    icon: "B",
    color: "#f59e0b",
  },
];

interface Connection {
  from: string;
  to: string;
}

// ─── Game 2 types ────────────────────────────────────────────────────────────
interface PlantPartQ {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const PLANT_PART_QUESTIONS: PlantPartQ[] = [
  {
    question:
      "Which part of the plant absorbs water and minerals from the soil?",
    options: ["Leaf", "Stem", "Root", "Flower"],
    correct: 2,
    explanation:
      "Roots anchor the plant and absorb water and dissolved minerals.",
  },
  {
    question: "Where does photosynthesis primarily occur?",
    options: ["Root", "Stem", "Flower", "Leaf"],
    correct: 3,
    explanation:
      "Leaves contain chloroplasts with chlorophyll for photosynthesis.",
  },
  {
    question: "What function does the stem serve?",
    options: [
      "Absorbs sunlight",
      "Transports water and nutrients",
      "Produces seeds",
      "Attracts pollinators",
    ],
    correct: 1,
    explanation:
      "The stem conducts water/minerals upward and glucose downward.",
  },
  {
    question: "What is the primary function of the flower?",
    options: [
      "Food storage",
      "Water absorption",
      "Reproduction",
      "Photosynthesis",
    ],
    correct: 2,
    explanation: "Flowers are the reproductive structures of flowering plants.",
  },
  {
    question: "What gas do plants release during photosynthesis?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    correct: 2,
    explanation:
      "Photosynthesis produces oxygen as a byproduct: 6CO2 + 6H2O + light = C6H12O6 + 6O2",
  },
  {
    question:
      "What raw material do plants take in through their leaves for photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Water Vapour"],
    correct: 1,
    explanation: "CO2 enters leaves through tiny pores called stomata.",
  },
  {
    question: "What is the green pigment in leaves called?",
    options: ["Carotenoid", "Melanin", "Chlorophyll", "Hemoglobin"],
    correct: 2,
    explanation: "Chlorophyll absorbs red and blue light, reflecting green.",
  },
  {
    question: "What does a plant store as food after photosynthesis?",
    options: ["Starch and Glucose", "Fat", "Protein", "Minerals"],
    correct: 0,
    explanation: "Plants convert glucose to starch for long-term storage.",
  },
  {
    question: "Which structure in plant cells carries out photosynthesis?",
    options: ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"],
    correct: 2,
    explanation:
      "Chloroplasts contain the thylakoid membranes where light reactions occur.",
  },
  {
    question: "What happens to glucose produced during photosynthesis?",
    options: [
      "Exhaled as CO2",
      "Used for respiration and growth",
      "Converted to water",
      "Released as heat",
    ],
    correct: 1,
    explanation:
      "Glucose fuels cellular respiration and builds cell structures.",
  },
];

// ─── Game 3 types ────────────────────────────────────────────────────────────
interface AnimalCard {
  name: string;
  description: string;
  category: string;
  vertebrate: boolean;
}

const ANIMALS: AnimalCard[] = [
  {
    name: "Dolphin",
    description: "Warm-blooded, breathes air, nurses young with milk",
    category: "Mammal",
    vertebrate: true,
  },
  {
    name: "Eagle",
    description: "Has feathers, lays eggs, warm-blooded, two wings",
    category: "Bird",
    vertebrate: true,
  },
  {
    name: "Crocodile",
    description: "Scaly skin, cold-blooded, lays eggs on land",
    category: "Reptile",
    vertebrate: true,
  },
  {
    name: "Frog",
    description: "Moist skin, starts aquatic, lives on land as adult",
    category: "Amphibian",
    vertebrate: true,
  },
  {
    name: "Salmon",
    description: "Has gills and fins, cold-blooded, lives in water",
    category: "Fish",
    vertebrate: true,
  },
  {
    name: "Butterfly",
    description: "Six legs, three body segments, exoskeleton, wings",
    category: "Insect",
    vertebrate: false,
  },
  {
    name: "Lion",
    description: "Warm-blooded, has fur, nurses young, gives live birth",
    category: "Mammal",
    vertebrate: true,
  },
  {
    name: "Penguin",
    description: "Has feathers, warm-blooded, cannot fly, swims well",
    category: "Bird",
    vertebrate: true,
  },
  {
    name: "Python",
    description: "Scaly, cold-blooded, no limbs, egg-laying",
    category: "Reptile",
    vertebrate: true,
  },
  {
    name: "Salamander",
    description: "Smooth moist skin, breathes through gills as larva",
    category: "Amphibian",
    vertebrate: true,
  },
  {
    name: "Clownfish",
    description: "Aquatic, has scales and fins, breathes through gills",
    category: "Fish",
    vertebrate: true,
  },
  {
    name: "Ant",
    description: "Six legs, three segments, exoskeleton, social colony",
    category: "Insect",
    vertebrate: false,
  },
  {
    name: "Bat",
    description: "Warm-blooded, has wings made of skin, nurses young",
    category: "Mammal",
    vertebrate: true,
  },
  {
    name: "Parrot",
    description: "Has feathers, beak, lays eggs, warm-blooded",
    category: "Bird",
    vertebrate: true,
  },
  {
    name: "Gecko",
    description: "Has scales, cold-blooded, climbs walls with toe pads",
    category: "Reptile",
    vertebrate: true,
  },
  {
    name: "Axolotl",
    description: "Aquatic salamander with external gills, neotenic",
    category: "Amphibian",
    vertebrate: true,
  },
  {
    name: "Shark",
    description: "Cartilaginous fish, cold-blooded, powerful predator",
    category: "Fish",
    vertebrate: true,
  },
  {
    name: "Beetle",
    description: "Six legs, hard wing cases (elytra), exoskeleton",
    category: "Insect",
    vertebrate: false,
  },
  {
    name: "Elephant",
    description: "Largest land animal, warm-blooded, long gestation",
    category: "Mammal",
    vertebrate: true,
  },
  {
    name: "Dragonfly",
    description: "Four wings, six legs, compound eyes, aquatic larva",
    category: "Insect",
    vertebrate: false,
  },
];

const CATEGORIES = ["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Insect"];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function PlantsAnimals({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "plant-scientist")
    return <PlantScientist config={config} onGameEnd={onGameEnd} />;
  if (gameId === "classification-expert")
    return <ClassificationExpert config={config} onGameEnd={onGameEnd} />;
  return <EcosystemArchitect config={config} onGameEnd={onGameEnd} />;
}

// ============================================================================
// GAME 1 — Ecosystem Architect
// ============================================================================
function EcosystemArchitect({ config, onGameEnd }: Props) {
  const [gameStarted, setGameStarted] = useState(false);
  const [species, setSpecies] = useState<Species[]>(() => {
    const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
    return BASE_SPECIES.slice(0, count).map((s) => ({ ...s }));
  });
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [tick, setTick] = useState(0);
  const [events, setEvents] = useState<string[]>([]);
  const [stability, setStability] = useState(100);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const stabilityRef = useRef(stability);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  stabilityRef.current = stability;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : stabilityRef.current;
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

  function simulateEcosystem() {
    setSpecies((prev) => {
      const next = prev.map((s) => ({ ...s }));
      const msgs: string[] = [];
      for (const sp of next) {
        if (sp.role === "producer") {
          sp.population = Math.min(sp.maxPop, sp.population + 30);
        } else if (sp.role === "decomposer") {
          sp.population = Math.min(sp.maxPop, sp.population + 10);
        } else {
          const prey = sp.eats
            .map((eid) => next.find((s) => s.id === eid))
            .filter(Boolean) as Species[];
          const totalPreyPop = prey.reduce((s, p) => s + p.population, 0);
          const connected = connections.some(
            (c) =>
              (sp.eats.includes(c.from) && c.to === sp.id) || c.from === sp.id,
          );
          if (totalPreyPop > 50 && connected) {
            sp.population = Math.min(
              sp.maxPop,
              sp.population + Math.floor(totalPreyPop * 0.05),
            );
            for (const p of prey)
              p.population = Math.max(
                0,
                p.population - Math.floor(sp.population * 0.2),
              );
          } else {
            sp.population = Math.max(
              0,
              sp.population - Math.floor(sp.population * 0.15),
            );
            if (sp.population === 0) msgs.push(`${sp.name} went extinct!`);
          }
        }
      }
      const extinct = next.filter(
        (s) => s.population === 0 && s.role !== "producer",
      ).length;
      const newStability = Math.max(0, 100 - extinct * 20);
      if (newStability < stabilityRef.current) {
        setScore((s) => Math.max(0, s - 50));
        setEvents(msgs);
      } else {
        setScore((s) => s + config.difficulty * 30);
        setCorrect((c) => c + 1);
      }
      setTotal((t) => t + 1);
      setStability(newStability);
      if (newStability === 0) endGame(false);
      setTick((t) => t + 1);
      return next;
    });
  }

  function handleConnect(from: string, to: string) {
    if (from === to) return;
    const exists = connections.some((c) => c.from === from && c.to === to);
    if (exists) return;
    const fromSp = species.find((s) => s.id === from);
    const toSp = species.find((s) => s.id === to);
    if (!fromSp || !toSp) return;
    const valid = toSp.eats.includes(from) || fromSp.eats.includes(to);
    if (valid) {
      setConnections((cs) => [...cs, { from, to }]);
      setScore((s) => s + config.difficulty * 100);
      setCorrect((c) => c + 1);
    } else {
      setScore((s) => Math.max(0, s - 30));
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setTotal((t) => t + 1);
  }

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    startTimer();
    const interval = setInterval(() => {
      if (gameOverRef.current) {
        clearInterval(interval);
        return;
      }
      simulateEcosystem();
    }, 3000);
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;
  const stabilityColor =
    stability > 60 ? "#10b981" : stability > 30 ? "#f59e0b" : "#f43f5e";

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="plants_animals.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#4ade80" }}>
          <Leaf className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Ecosystem:</span>
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${stability}%`, background: stabilityColor }}
            />
          </div>
          <span
            className="text-xs tabular-nums"
            style={{ color: stabilityColor }}
          >
            {stability}%
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

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
            <Leaf
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#4ade80" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#4ade80",
                textShadow: "0 0 20px rgba(74,222,128,0.6)",
              }}
            >
              Ecosystem Architect
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Connect producers to consumers to predators. Build a balanced food
              web.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Drag from one species to another to create a food chain link. Keep
              the ecosystem stable.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="plants_animals.start_button"
            >
              Build Ecosystem
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex-1 glass rounded-xl border border-border/30 p-4 overflow-hidden relative">
            <div className="scanlines absolute inset-0 pointer-events-none z-10" />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 5 }}
            >
              {connections.map((c, i) => {
                const fromEl = document.getElementById(`sp-${c.from}`);
                const toEl = document.getElementById(`sp-${c.to}`);
                if (!fromEl || !toEl) return null;
                const fr = fromEl.getBoundingClientRect();
                const tr = toEl.getBoundingClientRect();
                const container = fromEl
                  .closest(".glass")
                  ?.getBoundingClientRect();
                if (!container) return null;
                const x1 = fr.left + fr.width / 2 - container.left;
                const y1 = fr.top + fr.height / 2 - container.top;
                const x2 = tr.left + tr.width / 2 - container.left;
                const y2 = tr.top + tr.height / 2 - container.top;
                return (
                  <line
                    key={`conn-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#4ade8080"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                );
              })}
            </svg>
            <div className="grid grid-cols-4 gap-3 h-full content-start">
              {species.map((sp) => (
                <motion.div
                  key={sp.id}
                  id={`sp-${sp.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: sp.population > 0 ? 1 : 0.3, scale: 1 }}
                  className="glass-card rounded-xl p-3 cursor-grab border-2 transition-all"
                  style={{
                    borderColor:
                      dragging === sp.id ? sp.color : `${sp.color}40`,
                  }}
                  draggable
                  onDragStart={() => setDragging(sp.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragging && dragging !== sp.id) {
                      handleConnect(dragging, sp.id);
                      setDragging(null);
                    }
                  }}
                  data-ocid={`plants_animals.species.${sp.id}`}
                >
                  <div className="text-center">
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center font-black text-lg"
                      style={{
                        background: `${sp.color}20`,
                        color: sp.color,
                        border: `2px solid ${sp.color}60`,
                      }}
                    >
                      {sp.icon}
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      {sp.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {sp.role}
                    </p>
                    <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(sp.population / sp.maxPop) * 100}%`,
                          background: sp.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sp.population} pop
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="w-52 flex flex-col gap-2">
            <div className="glass-card rounded-xl p-3 border border-border/30">
              <p className="text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                Instructions
              </p>
              <p className="text-xs text-muted-foreground">
                Drag species cards to connect them. Producer feeds Herbivore
                feeds Carnivore.
              </p>
            </div>
            <div className="glass-card rounded-xl p-3 border border-border/30">
              <p className="text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                Tick {tick}
              </p>
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3" style={{ color: "#4ade80" }} />
                <span className="text-xs text-muted-foreground">
                  Connections: {connections.length}
                </span>
              </div>
              <AnimatePresence>
                {events.map((e, i) => (
                  <motion.p
                    key={`ev-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs mt-1"
                    style={{ color: "#f43f5e" }}
                  >
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                    {e}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2 — Plant Scientist
// ============================================================================
const PHOTO_INPUTS = ["Water", "CO2", "Sunlight", "Chlorophyll"];
const PHOTO_OUTPUTS = ["Glucose", "Oxygen"];
const PHOTO_BOTH = [...PHOTO_INPUTS, ...PHOTO_OUTPUTS];

function PlantScientist({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<
    "start" | "equation" | "quiz" | "feedback"
  >("start");
  const [placedInputs, setPlacedInputs] = useState<string[]>([]);
  const [placedOutputs, setPlacedOutputs] = useState<string[]>([]);
  const [equationDone, setEquationDone] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [draggingTile, setDraggingTile] = useState<string | null>(null);

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

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("equation");
    startTimer();
  }

  function dropToSide(side: "input" | "output") {
    if (!draggingTile) return;
    const tile = draggingTile;
    if (side === "input") {
      if (PHOTO_INPUTS.includes(tile) && !placedInputs.includes(tile)) {
        setPlacedInputs((prev) => [...prev, tile]);
        setScore((s) => s + config.difficulty * 80);
        setCorrect((c) => c + 1);
      } else {
        setScore((s) => Math.max(0, s - 30));
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return nl;
        });
      }
    } else {
      if (PHOTO_OUTPUTS.includes(tile) && !placedOutputs.includes(tile)) {
        setPlacedOutputs((prev) => [...prev, tile]);
        setScore((s) => s + config.difficulty * 80);
        setCorrect((c) => c + 1);
      } else {
        setScore((s) => Math.max(0, s - 30));
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return nl;
        });
      }
    }
    setTotal((t) => t + 1);
    setDraggingTile(null);
    if (
      placedInputs.length + (PHOTO_INPUTS.includes(tile) ? 1 : 0) >=
        PHOTO_INPUTS.length &&
      placedOutputs.length + (PHOTO_OUTPUTS.includes(tile) ? 1 : 0) >=
        PHOTO_OUTPUTS.length
    ) {
      setEquationDone(true);
      setTimeout(() => setPhase("quiz"), 800);
    }
  }

  function handleAnswer(idx: number) {
    if (flash !== "idle") return;
    const q = PLANT_PART_QUESTIONS[qIdx % PLANT_PART_QUESTIONS.length];
    setTotal((t) => t + 1);
    if (idx === q.correct) {
      const pts = config.difficulty * 120;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${q.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${q.explanation}`);
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
      if (next >= 10) endGame(true);
      else {
        setQIdx(next);
        setPhase("quiz");
      }
    }, 1800);
  }

  const currentQ = PLANT_PART_QUESTIONS[qIdx % PLANT_PART_QUESTIONS.length];
  const availableTiles = PHOTO_BOTH.filter(
    (t) => !placedInputs.includes(t) && !placedOutputs.includes(t),
  );

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="plant_scientist.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#22c55e" }}>
          <Leaf className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {phase === "quiz" || phase === "feedback"
            ? `Q${qIdx + 1}/10`
            : "Equation"}
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
            <Leaf
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#22c55e" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#22c55e",
                textShadow: "0 0 20px rgba(34,197,94,0.6)",
              }}
            >
              Plant Scientist
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Drag tiles to complete the photosynthesis equation, then answer 10
              questions about plant parts.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="plant_scientist.start_button"
            >
              Start Lab
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "equation" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-4 border border-border/30">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-4"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              Photosynthesis Equation — Drag tiles to correct side
            </p>
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">INPUTS</p>
                <div
                  className="min-h-16 w-40 rounded-xl border-2 border-dashed border-[#22c55e]/40 p-2 flex flex-wrap gap-1 items-start"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropToSide("input")}
                >
                  {placedInputs.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ background: "#22c55e20", color: "#22c55e" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full border-2 border-[#f59e0b]/60 flex items-center justify-center"
                  style={{ background: "#f59e0b20" }}
                >
                  <span className="text-[#f59e0b] font-black text-xs">
                    Light
                  </span>
                </div>
                <span className="text-[#f59e0b] font-black text-lg">-&gt;</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">OUTPUTS</p>
                <div
                  className="min-h-16 w-40 rounded-xl border-2 border-dashed border-[#06b6d4]/40 p-2 flex flex-wrap gap-1 items-start"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropToSide("output")}
                >
                  {placedOutputs.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ background: "#06b6d420", color: "#06b6d4" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableTiles.map((t) => (
              <div
                key={t}
                draggable
                onDragStart={() => setDraggingTile(t)}
                className="px-3 py-2 rounded-lg border-2 border-border/40 text-sm font-bold cursor-grab text-foreground hover:border-[#22c55e] transition-all"
              >
                {t}
              </div>
            ))}
          </div>
          {equationDone && (
            <div
              className="rounded-xl px-4 py-3 text-center text-sm font-bold"
              style={{
                background: "#22c55e20",
                color: "#22c55e",
                border: "2px solid #22c55e60",
              }}
            >
              Equation complete! Moving to plant questions...
            </div>
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
                Plant Biology — Question {qIdx + 1}
              </p>
              <p className="text-base font-semibold text-foreground mb-5">
                {currentQ.question}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={`opt-${i}`}
                    type="button"
                    className="px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
                    onClick={() => handleAnswer(i)}
                    data-ocid={`plant_scientist.answer.${i}`}
                  >
                    {opt}
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

// ============================================================================
// GAME 3 — Classification Expert
// ============================================================================
function ClassificationExpert({ config, onGameEnd }: Props) {
  const animalCount = config.difficulty === 1 ? 12 : 16;
  const animalList = ANIMALS.slice(0, animalCount);

  const [phase, setPhase] = useState<
    "start" | "classify" | "vertebrate" | "feedback"
  >("start");
  const [aIdx, setAIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [chosenCategory, setChosenCategory] = useState("");

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

  const currentA = animalList[aIdx % animalList.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("classify");
    startTimer();
  }

  function handleCategorySelect(cat: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    setChosenCategory(cat);
    if (cat === currentA.category) {
      setScore((s) => s + config.difficulty * 120);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${currentA.name} is a ${currentA.category}. Now classify its vertebrate status.`,
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("vertebrate");
      }, 1000);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. ${currentA.name} is a ${currentA.category}. Try the vertebrate question.`,
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("vertebrate");
      }, 1500);
    }
  }

  function handleVertebrate(isVert: boolean) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    const correct_ans = currentA.vertebrate;
    if (isVert === correct_ans) {
      const pts =
        config.difficulty * (chosenCategory === currentA.category ? 180 : 90);
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${currentA.name} is ${correct_ans ? "a vertebrate" : "an invertebrate"}. +${pts} pts`,
      );
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. ${currentA.name} is ${correct_ans ? "a vertebrate" : "an invertebrate"}.`,
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
      setChosenCategory("");
      const next = aIdx + 1;
      if (next >= animalList.length) endGame(true);
      else {
        setAIdx(next);
        setPhase("classify");
      }
    }, 2000);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="classification_expert.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#a78bfa" }}>
          <Leaf className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {aIdx + 1}/{animalList.length}
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
            <Leaf
              className="h-14 w-14 mx-auto mb-4"
              style={{ color: "#a78bfa" }}
            />
            <h2
              className="text-3xl font-black mb-3"
              style={{
                fontFamily: "'Orbitron',sans-serif",
                color: "#a78bfa",
                textShadow: "0 0 20px rgba(167,139,250,0.6)",
              }}
            >
              Classification Expert
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Classify {animalList.length} animals by type
              (Mammal/Bird/Reptile/etc.) then by vertebrate status.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="classification_expert.start_button"
            >
              Start Sorting
            </GlowButton>
          </div>
        </motion.div>
      )}

      {(phase === "classify" ||
        phase === "vertebrate" ||
        phase === "feedback") && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={aIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={`glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <h3
                className="text-2xl font-black mb-1"
                style={{ color: "#a78bfa" }}
              >
                {currentA.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {currentA.description}
              </p>
              {phase === "classify" && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Classify this animal:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat, i) => (
                      <button
                        key={cat}
                        type="button"
                        className="px-3 py-2 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#a78bfa] hover:text-[#a78bfa] transition-all"
                        onClick={() => handleCategorySelect(cat)}
                        data-ocid={`classification_expert.category.${i}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {(phase === "vertebrate" || phase === "feedback") && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Is this animal a vertebrate or invertebrate?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 py-3 rounded-xl border-2 border-border/30 text-sm font-bold text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all"
                      onClick={() => handleVertebrate(true)}
                      data-ocid="classification_expert.vertebrate_yes"
                    >
                      Vertebrate
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-3 rounded-xl border-2 border-border/30 text-sm font-bold text-muted-foreground hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all"
                      onClick={() => handleVertebrate(false)}
                      data-ocid="classification_expert.vertebrate_no"
                    >
                      Invertebrate
                    </button>
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
