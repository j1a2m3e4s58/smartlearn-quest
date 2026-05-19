import { GlowButton } from "@/components/ui/GlowButton";
import { Globe, Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

// ─── Shared type ──────────────────────────────────────────────────────────────────
interface Meters {
  env: number;
  eco: number;
  health: number;
}
interface Decision {
  name: string;
  desc: string;
  env: number;
  eco: number;
  health: number;
}
interface Round {
  decisions: Decision[];
}

// ─── Game 1: Planet Guardian data ─────────────────────────────────────────────────
const BASE_ROUNDS: Round[] = [
  {
    decisions: [
      {
        name: "Plant Trees",
        desc: "City-wide reforestation programme",
        env: 10,
        eco: -3,
        health: 5,
      },
      {
        name: "Build Factory",
        desc: "New industrial manufacturing plant",
        env: -12,
        eco: 15,
        health: -8,
      },
      {
        name: "Solar Farm",
        desc: "Install rooftop solar panels",
        env: 8,
        eco: -5,
        health: 3,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Clean River",
        desc: "Remove pollutants from waterways",
        env: 12,
        eco: -4,
        health: 10,
      },
      {
        name: "Open Mine",
        desc: "Extract mineral resources",
        env: -15,
        eco: 18,
        health: -6,
      },
      {
        name: "Recycling Drive",
        desc: "Community waste reduction campaign",
        env: 7,
        eco: 2,
        health: 4,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Organic Farms",
        desc: "Switch to pesticide-free agriculture",
        env: 8,
        eco: -6,
        health: 9,
      },
      {
        name: "Highway Expansion",
        desc: "Widen major transport routes",
        env: -10,
        eco: 12,
        health: -5,
      },
      {
        name: "Wind Turbines",
        desc: "Coastal wind energy installation",
        env: 9,
        eco: -4,
        health: 2,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Green Schools",
        desc: "Eco education for all students",
        env: 5,
        eco: -2,
        health: 8,
      },
      {
        name: "Deforestation",
        desc: "Clear forest for agriculture",
        env: -18,
        eco: 14,
        health: -7,
      },
      {
        name: "Public Transit",
        desc: "Expand bus and rail network",
        env: 10,
        eco: -5,
        health: 6,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Marine Reserve",
        desc: "Protect ocean ecosystems",
        env: 14,
        eco: -6,
        health: 5,
      },
      {
        name: "Oil Drilling",
        desc: "Offshore petroleum extraction",
        env: -16,
        eco: 20,
        health: -9,
      },
      {
        name: "Rainwater Harvest",
        desc: "Community water collection systems",
        env: 6,
        eco: 3,
        health: 7,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Rewild Zone",
        desc: "Return farmland to natural habitat",
        env: 13,
        eco: -8,
        health: 4,
      },
      {
        name: "Coal Power",
        desc: "New coal power station",
        env: -14,
        eco: 16,
        health: -10,
      },
      {
        name: "EV Subsidies",
        desc: "Incentivise electric vehicles",
        env: 9,
        eco: -7,
        health: 5,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Wetlands Restore",
        desc: "Rehabilitate flood plains",
        env: 11,
        eco: -5,
        health: 6,
      },
      {
        name: "Urban Sprawl",
        desc: "Approve major housing development",
        env: -11,
        eco: 13,
        health: -4,
      },
      {
        name: "Compost Network",
        desc: "City-wide organic composting",
        env: 6,
        eco: 1,
        health: 5,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Clean Cookstoves",
        desc: "Replace wood fires with gas",
        env: 7,
        eco: -3,
        health: 12,
      },
      {
        name: "Industrial Waste",
        desc: "Allow untreated discharge",
        env: -13,
        eco: 10,
        health: -12,
      },
      {
        name: "Biodiversity Map",
        desc: "Research and protect species",
        env: 10,
        eco: -2,
        health: 3,
      },
    ],
  },
  {
    decisions: [
      {
        name: "National Park",
        desc: "Designate protected wilderness",
        env: 12,
        eco: -4,
        health: 5,
      },
      {
        name: "Fracking Sites",
        desc: "Hydraulic fracturing for gas",
        env: -15,
        eco: 17,
        health: -8,
      },
      {
        name: "Agroforestry",
        desc: "Integrate trees into croplands",
        env: 9,
        eco: 3,
        health: 6,
      },
    ],
  },
  {
    decisions: [
      {
        name: "Mangrove Plant",
        desc: "Coastal mangrove restoration",
        env: 13,
        eco: -3,
        health: 7,
      },
      {
        name: "Pesticide Use",
        desc: "Increase agricultural chemicals",
        env: -9,
        eco: 8,
        health: -10,
      },
      {
        name: "Zero-Waste City",
        desc: "Full circular economy model",
        env: 10,
        eco: -5,
        health: 8,
      },
    ],
  },
];

const DISASTERS: Decision[] = [
  {
    name: "DISASTER: Wildfire",
    desc: "Uncontrolled wildfire spreads",
    env: -20,
    eco: -10,
    health: -15,
  },
  {
    name: "DISASTER: Flood",
    desc: "Major flooding event",
    env: -10,
    eco: -15,
    health: -12,
  },
  {
    name: "DISASTER: Drought",
    desc: "Severe water shortage",
    env: -12,
    eco: -8,
    health: -14,
  },
];

function scaledRound(base: Round, diff: 1 | 2 | 3): Round {
  if (diff === 1) return base;
  const multiplier = diff === 2 ? 1.4 : 2.0;
  return {
    decisions: base.decisions.map((d) => ({
      ...d,
      env: Math.round(d.env * multiplier),
      eco: Math.round(d.eco * multiplier),
      health: Math.round(d.health * multiplier),
    })),
  };
}

// ─── Game 2: Carbon Calculator data ─────────────────────────────────────────────────
interface CarbonCategory {
  category: string;
  options: { label: string; footprint: number; color: string }[];
}

const CARBON_CATEGORIES: CarbonCategory[] = [
  {
    category: "Daily Transport",
    options: [
      { label: "Drive alone (car)", footprint: 4200, color: "#f43f5e" },
      { label: "Public bus/train", footprint: 900, color: "#f59e0b" },
      { label: "Bicycle / Walk", footprint: 0, color: "#10b981" },
    ],
  },
  {
    category: "Diet",
    options: [
      { label: "Beef-based diet", footprint: 7200, color: "#f43f5e" },
      { label: "Vegetarian diet", footprint: 1800, color: "#f59e0b" },
      { label: "Vegan diet", footprint: 900, color: "#10b981" },
    ],
  },
  {
    category: "Home Energy",
    options: [
      { label: "Coal / oil heating", footprint: 5500, color: "#f43f5e" },
      { label: "Natural gas", footprint: 2800, color: "#f59e0b" },
      { label: "Solar / renewable", footprint: 300, color: "#10b981" },
    ],
  },
  {
    category: "Air Travel",
    options: [
      {
        label: "Frequent flyer (3+ flights/year)",
        footprint: 6000,
        color: "#f43f5e",
      },
      {
        label: "Occasional (1-2 flights/year)",
        footprint: 2000,
        color: "#f59e0b",
      },
      { label: "No air travel", footprint: 0, color: "#10b981" },
    ],
  },
  {
    category: "Shopping Habits",
    options: [
      { label: "Buy new constantly", footprint: 3000, color: "#f43f5e" },
      { label: "Mix of new and secondhand", footprint: 1200, color: "#f59e0b" },
      { label: "Secondhand / minimal", footprint: 300, color: "#10b981" },
    ],
  },
];

// ─── Game 3: Ecosystem Balance data ─────────────────────────────────────────────────
interface EcoSpecies {
  name: string;
  role: string;
  population: number;
  minViable: number;
  maxViable: number;
  dependsOn: string[];
  color: string;
}

const ECOSYSTEM_SPECIES: EcoSpecies[] = [
  {
    name: "Grass",
    role: "Producer",
    population: 800,
    minViable: 100,
    maxViable: 1200,
    dependsOn: [],
    color: "#4ade80",
  },
  {
    name: "Rabbit",
    role: "Herbivore",
    population: 200,
    minViable: 20,
    maxViable: 400,
    dependsOn: ["Grass"],
    color: "#a78bfa",
  },
  {
    name: "Fox",
    role: "Carnivore",
    population: 40,
    minViable: 5,
    maxViable: 80,
    dependsOn: ["Rabbit"],
    color: "#f97316",
  },
  {
    name: "Eagle",
    role: "Apex Predator",
    population: 15,
    minViable: 2,
    maxViable: 30,
    dependsOn: ["Rabbit", "Fox"],
    color: "#f59e0b",
  },
  {
    name: "Bacteria",
    role: "Decomposer",
    population: 600,
    minViable: 50,
    maxViable: 1000,
    dependsOn: [],
    color: "#94a3b8",
  },
];

type EcoAction = "add" | "remove";
interface EcoEvent {
  species: string;
  action: EcoAction;
  effect: string;
}

const ECO_EVENTS: EcoEvent[] = [
  {
    species: "Rabbit",
    action: "add",
    effect: "Grass decreases faster, Fox population increases",
  },
  {
    species: "Fox",
    action: "remove",
    effect: "Rabbit population explodes, Grass collapses",
  },
  {
    species: "Eagle",
    action: "remove",
    effect: "Fox and Rabbit populations increase unchecked",
  },
  {
    species: "Grass",
    action: "remove",
    effect: "All herbivores and carnivores face population collapse",
  },
  {
    species: "Bacteria",
    action: "remove",
    effect: "Dead matter accumulates, nutrients cycle breaks",
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function EnvironmentalScience({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "carbon-calculator")
    return <CarbonCalculator config={config} onGameEnd={onGameEnd} />;
  if (gameId === "ecosystem-balance")
    return <EcosystemBalance config={config} onGameEnd={onGameEnd} />;
  return <PlanetGuardian config={config} onGameEnd={onGameEnd} />;
}

// ============================================================================
// GAME 1 — Planet Guardian
// ============================================================================
function PlanetGuardian({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "playing" | "gameover">("start");
  const [round, setRound] = useState(0);
  const [meters, setMeters] = useState<Meters>({
    env: 60,
    eco: 60,
    health: 60,
  });
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [chosenName, setChosenName] = useState("");
  const [disaster, setDisaster] = useState<Decision | null>(null);

  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const TOTAL_ROUNDS = 10;

  const endGame = useCallback(
    (completed: boolean, finalScore?: number) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const s = finalScore ?? scoreRef.current;
      onGameEnd(
        buildResult(
          config,
          s,
          completed ? 80 : 40,
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
    setPhase("playing");
    startTimer();
  }

  function handleChoice(d: Decision) {
    if (flash) return;
    setChosenName(d.name);
    setFlash("chosen");
    const nextMeters = {
      env: Math.min(100, Math.max(0, meters.env + d.env)),
      eco: Math.min(100, Math.max(0, meters.eco + d.eco)),
      health: Math.min(100, Math.max(0, meters.health + d.health)),
    };
    const isDisasterRound =
      (config.difficulty === 2 && round === 4) ||
      (config.difficulty === 3 && (round === 2 || round === 5 || round === 8));
    let activeDisaster: Decision | null = null;
    if (isDisasterRound) {
      activeDisaster = DISASTERS[round % DISASTERS.length];
      nextMeters.env = Math.min(
        100,
        Math.max(0, nextMeters.env + activeDisaster.env),
      );
      nextMeters.eco = Math.min(
        100,
        Math.max(0, nextMeters.eco + activeDisaster.eco),
      );
      nextMeters.health = Math.min(
        100,
        Math.max(0, nextMeters.health + activeDisaster.health),
      );
      setDisaster(activeDisaster);
    }
    setMeters(nextMeters);
    const anyZero =
      nextMeters.env <= 0 || nextMeters.eco <= 0 || nextMeters.health <= 0;
    const nextRound = round + 1;
    const done = nextRound >= TOTAL_ROUNDS;
    setTimeout(
      () => {
        setFlash(null);
        setDisaster(null);
        if (anyZero) {
          endGame(false);
          return;
        }
        if (done) {
          const finalScore = Math.round(
            (nextMeters.env + nextMeters.eco + nextMeters.health) *
              config.difficulty *
              10,
          );
          setScore(finalScore);
          scoreRef.current = finalScore;
          endGame(true, finalScore);
          return;
        }
        setRound(nextRound);
      },
      isDisasterRound ? 1800 : 900,
    );
  }

  const currentRound = scaledRound(
    BASE_ROUNDS[round % BASE_ROUNDS.length],
    config.difficulty as 1 | 2 | 3,
  );
  const progressPct = (timeLeft / config.timeLimit) * 100;
  function meterColor(val: number) {
    return val > 55 ? "#10b981" : val > 30 ? "#f59e0b" : "#f43f5e";
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="env_science.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Globe className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Round {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
        </span>
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
            <Globe
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
              Planet Manager
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Balance Environment, Economy, and Health across 10 policy rounds.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              If any meter hits zero the planet fails. Keep all three bars alive
              to win.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="env_science.start_button"
            >
              Launch Simulation
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="glass-card rounded-xl p-4 border border-border/30 shrink-0">
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "Environment",
                  style: {
                    width: `${meters.env}%`,
                    background: meterColor(meters.env),
                  },
                  val: meters.env,
                },
                {
                  label: "Economy",
                  style: {
                    width: `${meters.eco}%`,
                    background: meterColor(meters.eco),
                  },
                  val: meters.eco,
                },
                {
                  label: "Health",
                  style: {
                    width: `${meters.health}%`,
                    background: meterColor(meters.health),
                  },
                  val: meters.health,
                },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="text-xs w-24 text-muted-foreground shrink-0">
                    {m.label}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={m.style}
                    />
                  </div>
                  <span
                    className="text-xs tabular-nums w-8 text-right"
                    style={{ color: meterColor(m.val) }}
                  >
                    {m.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {disaster && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl px-4 py-3 border-2 border-[#f43f5e] bg-[#f43f5e]/10 text-center shrink-0"
            >
              <p className="text-sm font-bold text-[#f43f5e]">
                {disaster.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {disaster.desc}
              </p>
            </motion.div>
          )}
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={round}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-2"
              >
                <p
                  className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-1"
                  style={{ fontFamily: "'Orbitron',sans-serif" }}
                >
                  Choose Policy Action
                </p>
                {currentRound.decisions.map((d, i) => {
                  const isChosen = flash === "chosen" && chosenName === d.name;
                  return (
                    <button
                      key={d.name}
                      type="button"
                      className={`glass-card rounded-xl p-4 border-2 ${isChosen ? "border-[#00f5ff]" : "border-border/30"} text-left transition-all hover:border-[#00f5ff]/60 cursor-pointer`}
                      style={
                        isChosen
                          ? { boxShadow: "0 0 16px rgba(0,245,255,0.3)" }
                          : {}
                      }
                      onClick={() => handleChoice(d)}
                      data-ocid={`env_science.decision.${i}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {d.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {d.desc}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5 text-right shrink-0">
                          <span
                            className="text-xs tabular-nums"
                            style={{
                              color: d.env >= 0 ? "#10b981" : "#f43f5e",
                            }}
                          >
                            ENV {d.env >= 0 ? "+" : ""}
                            {d.env}
                          </span>
                          <span
                            className="text-xs tabular-nums"
                            style={{
                              color: d.eco >= 0 ? "#f59e0b" : "#f43f5e",
                            }}
                          >
                            ECO {d.eco >= 0 ? "+" : ""}
                            {d.eco}
                          </span>
                          <span
                            className="text-xs tabular-nums"
                            style={{
                              color: d.health >= 0 ? "#06b6d4" : "#f43f5e",
                            }}
                          >
                            HP {d.health >= 0 ? "+" : ""}
                            {d.health}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2 — Carbon Calculator
// ============================================================================
function CarbonCalculator({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "choosing" | "result">("start");
  const [catIdx, setCatIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [swapMode, setSwapMode] = useState(false);
  const [totalFootprint, setTotalFootprint] = useState(0);

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
  const currentCat = CARBON_CATEGORIES[catIdx % CARBON_CATEGORIES.length];
  const progressPct = (timeLeft / config.timeLimit) * 100;

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("choosing");
    startTimer();
  }

  function handleSelect(footprint: number) {
    setSelections((prev) => ({ ...prev, [currentCat.category]: footprint }));
    setTotal((t) => t + 1);
    const lowestOption = Math.min(
      ...currentCat.options.map((o) => o.footprint),
    );
    if (footprint === lowestOption) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    }
    const next = catIdx + 1;
    if (next >= CARBON_CATEGORIES.length) {
      const total_fp = Object.values({
        ...selections,
        [currentCat.category]: footprint,
      }).reduce((s, v) => s + v, 0);
      setTotalFootprint(total_fp);
      setPhase("result");
    } else {
      setCatIdx(next);
    }
  }

  function handleSwap(cat: string, footprint: number) {
    const oldFp = selections[cat] ?? 0;
    const diff = oldFp - footprint;
    const pts = config.difficulty * Math.floor(diff / 100);
    if (pts > 0) setScore((s) => s + pts);
    setSelections((prev) => ({ ...prev, [cat]: footprint }));
    setTotalFootprint((prev) => prev - diff);
  }

  const MAX_FOOTPRINT = CARBON_CATEGORIES.reduce(
    (s, c) => s + Math.max(...c.options.map((o) => o.footprint)),
    0,
  );
  const footprintPct = Math.min(100, (totalFootprint / MAX_FOOTPRINT) * 100);
  const footprintColor =
    footprintPct < 30 ? "#10b981" : footprintPct < 60 ? "#f59e0b" : "#f43f5e";

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="carbon_calculator.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Globe className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {catIdx + 1}/{CARBON_CATEGORIES.length}
        </span>
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
            <Globe
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
              Carbon Calculator
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Choose lifestyle options across 5 categories. See your carbon
              footprint. Then make swaps to reduce it.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="carbon_calculator.start_button"
            >
              Calculate Footprint
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "choosing" && (
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-xl p-5 border border-border/30"
            >
              <p
                className="text-xs uppercase tracking-widest text-muted-foreground mb-2"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Category {catIdx + 1}: {currentCat.category}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your typical lifestyle option for this category:
              </p>
              <div className="flex flex-col gap-3">
                {currentCat.options.map((opt, i) => (
                  <button
                    key={opt.label}
                    type="button"
                    className="px-4 py-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: `${opt.color}60`,
                      background: `${opt.color}08`,
                    }}
                    onClick={() => handleSelect(opt.footprint)}
                    data-ocid={`carbon_calculator.option.${i}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {opt.label}
                      </span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: opt.color }}
                      >
                        {opt.footprint.toLocaleString()} kg CO2/yr
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(opt.footprint / 7200) * 100}%`,
                          background: opt.color,
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === "result" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col gap-3 overflow-auto"
        >
          <div className="glass-card rounded-xl p-4 border border-border/30">
            <p
              className="text-xs uppercase tracking-widest text-muted-foreground mb-2"
              style={{ fontFamily: "'Orbitron',sans-serif" }}
            >
              Your Carbon Footprint
            </p>
            <p
              className="text-2xl font-black mb-2"
              style={{ color: footprintColor }}
            >
              {totalFootprint.toLocaleString()}{" "}
              <span className="text-sm font-normal">kg CO2/year</span>
            </p>
            <div className="h-4 rounded-full bg-muted overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${footprintPct}%`,
                  background: footprintColor,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {footprintPct < 30
                ? "Excellent! Very low carbon lifestyle."
                : footprintPct < 60
                  ? "Moderate. Consider some swaps."
                  : "High carbon footprint. Major changes recommended."}
            </p>
          </div>

          {!swapMode && (
            <GlowButton
              variant="secondary"
              size="md"
              onClick={() => setSwapMode(true)}
              data-ocid="carbon_calculator.swap_button"
            >
              Make Swaps to Reduce Footprint
            </GlowButton>
          )}

          {swapMode && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Click lower-footprint options to make swaps and earn bonus
                points:
              </p>
              {CARBON_CATEGORIES.map((cat) => (
                <div
                  key={cat.category}
                  className="glass-card rounded-xl p-3 border border-border/30"
                >
                  <p className="text-xs font-bold text-muted-foreground mb-2">
                    {cat.category}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {cat.options.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                        style={
                          selections[cat.category] === opt.footprint
                            ? {
                                borderColor: opt.color,
                                background: `${opt.color}20`,
                                color: opt.color,
                              }
                            : {
                                borderColor: "rgba(255,255,255,0.15)",
                                color: "rgba(255,255,255,0.5)",
                              }
                        }
                        onClick={() => handleSwap(cat.category, opt.footprint)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => endGame(true)}
            data-ocid="carbon_calculator.finish_button"
          >
            Complete Assessment
          </GlowButton>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 3 — Ecosystem Balance
// ============================================================================
function EcosystemBalance({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
  const [species, setSpecies] = useState<EcoSpecies[]>(() =>
    ECOSYSTEM_SPECIES.map((s) => ({ ...s })),
  );
  const [year, setYear] = useState(0);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [eventIdx, setEventIdx] = useState(0);
  const [phase2Answer, setPhase2Answer] = useState("");
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

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
  const currentEvent = ECO_EVENTS[eventIdx % ECO_EVENTS.length];

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }

  function simulateYear(eventToApply?: EcoEvent) {
    setSpecies((prev) => {
      const next = prev.map((s) => ({ ...s }));
      for (const sp of next) {
        if (sp.dependsOn.length === 0) {
          sp.population = Math.min(
            sp.maxViable,
            sp.population + Math.floor(sp.population * 0.1),
          );
        } else {
          const preyOk = sp.dependsOn.every((dep) => {
            const prey = next.find((s) => s.name === dep);
            return prey && prey.population >= prey.minViable;
          });
          if (preyOk) {
            sp.population = Math.min(
              sp.maxViable,
              sp.population + Math.floor(sp.population * 0.08),
            );
          } else {
            sp.population = Math.max(
              0,
              sp.population - Math.floor(sp.population * 0.2),
            );
          }
        }
        if (eventToApply) {
          if (sp.name === eventToApply.species) {
            if (eventToApply.action === "add")
              sp.population = Math.min(sp.maxViable, sp.population + 50);
            else sp.population = Math.max(0, sp.population - 50);
          }
        }
      }
      return next;
    });
  }

  function handleApplyEvent() {
    simulateYear(currentEvent);
    setLog((prev) => [
      ...prev,
      `Year ${year + 1}: ${currentEvent.species} ${currentEvent.action === "add" ? "added" : "removed"} — ${currentEvent.effect}`,
    ]);
    setYear((y) => y + 1);
    setEventIdx((i) => i + 1);
    const allViable = species.every((s) => s.population >= s.minViable);
    if (!allViable) {
      setScore((s) => s - 200);
    } else {
      const pts = config.difficulty * 100;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    }
    setTotal((t) => t + 1);
    if (year + 1 >= 5) endGame(true);
  }

  function handlePredictEffect(prediction: string) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    const expected = currentEvent.effect.toLowerCase();
    const isCorrect = prediction
      .toLowerCase()
      .includes(currentEvent.species.toLowerCase());
    if (isCorrect) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct prediction! ${currentEvent.effect}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${currentEvent.effect}`);
    }
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      handleApplyEvent();
    }, 1500);
  }

  const predictionOptions = [
    `${currentEvent.species} population changes, affecting dependent species`,
    "No significant impact on the ecosystem",
    "Only decomposers are affected",
    "All species populations stay the same",
  ];

  return (
    <div
      className="w-full h-full flex flex-col gap-2 select-none"
      data-ocid="ecosystem_balance.page"
    >
      <div className="game-hud flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#22c55e" }}>
          <Globe className="h-4 w-4" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground">Year {year}/5</span>
        <Heart
          className="h-4 w-4"
          style={{ color: "#f43f5e", fill: "#f43f5e" }}
        />
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
            <Globe
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
              Ecosystem Balance
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Predict the cascade effects when species are added or removed.
              Apply events over 5 years and keep all populations viable.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="ecosystem_balance.start_button"
            >
              Begin Simulation
            </GlowButton>
          </div>
        </motion.div>
      )}

      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          {/* Population bars */}
          <div className="glass-card rounded-xl p-3 border border-border/30">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Current Populations
            </p>
            <div className="flex flex-col gap-1.5">
              {species.map((sp) => {
                const pct = Math.min(100, (sp.population / sp.maxViable) * 100);
                const healthy = sp.population >= sp.minViable;
                return (
                  <div key={sp.name} className="flex items-center gap-2">
                    <span
                      className="text-xs w-20 shrink-0"
                      style={{ color: sp.color }}
                    >
                      {sp.name}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: healthy ? sp.color : "#f43f5e",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs tabular-nums w-8"
                      style={{ color: healthy ? sp.color : "#f43f5e" }}
                    >
                      {sp.population}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={eventIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Year {year + 1} Event
              </p>
              <p className="text-sm font-bold text-foreground mb-3">
                A{" "}
                <span style={{ color: "#22c55e" }}>{currentEvent.species}</span>{" "}
                will be{" "}
                <span
                  style={{
                    color:
                      currentEvent.action === "add" ? "#10b981" : "#f43f5e",
                  }}
                >
                  {currentEvent.action === "add" ? "introduced" : "removed"}
                </span>
                .
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Predict the cascading effect:
              </p>
              <div className="flex flex-col gap-2">
                {predictionOptions.map((opt, i) => (
                  <button
                    key={`pred-${i}`}
                    type="button"
                    className="text-left px-4 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
                    onClick={() => handlePredictEffect(opt)}
                    data-ocid={`ecosystem_balance.prediction.${i}`}
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
