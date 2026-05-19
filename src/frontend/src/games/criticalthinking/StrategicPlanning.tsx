import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

// ─────────────────────────────────────────────
// GAME 1 — City Planner (unchanged)
// ─────────────────────────────────────────────
type BuildingType =
  | "school"
  | "hospital"
  | "road"
  | "market"
  | "park"
  | "police";
interface Building {
  type: BuildingType;
  label: string;
  cost: number;
  education: number;
  health: number;
  transport: number;
  food: number;
}
interface GridCell {
  row: number;
  col: number;
  building: BuildingType | null;
}
interface CityNeeds {
  education: number;
  health: number;
  transport: number;
  food: number;
}

const BUILDINGS: Building[] = [
  {
    type: "school",
    label: "School",
    cost: 200,
    education: 30,
    health: 0,
    transport: 0,
    food: 0,
  },
  {
    type: "hospital",
    label: "Hospital",
    cost: 300,
    education: 0,
    health: 40,
    transport: 0,
    food: 0,
  },
  {
    type: "road",
    label: "Road",
    cost: 80,
    education: 0,
    health: 0,
    transport: 25,
    food: 0,
  },
  {
    type: "market",
    label: "Market",
    cost: 150,
    education: 0,
    health: 0,
    transport: 5,
    food: 35,
  },
  {
    type: "park",
    label: "Park",
    cost: 100,
    education: 5,
    health: 10,
    transport: 0,
    food: 5,
  },
  {
    type: "police",
    label: "Station",
    cost: 120,
    education: 0,
    health: 5,
    transport: 5,
    food: 0,
  },
];

const DIFF_CFG = {
  1: {
    budget: 1200,
    gridSize: 3,
    targets: {
      education: 60,
      health: 60,
      transport: 50,
      food: 60,
    } as CityNeeds,
  },
  2: {
    budget: 1500,
    gridSize: 4,
    targets: {
      education: 80,
      health: 80,
      transport: 70,
      food: 80,
    } as CityNeeds,
  },
  3: {
    budget: 1800,
    gridSize: 5,
    targets: {
      education: 100,
      health: 100,
      transport: 100,
      food: 100,
    } as CityNeeds,
  },
};

const COLORS: Record<BuildingType, string> = {
  school: "#00f5ff",
  hospital: "#f43f5e",
  road: "#94a3b8",
  market: "#f59e0b",
  park: "#10b981",
  police: "#6366f1",
};

function CityPlanner({ config, onGameEnd }: Props) {
  const dc = DIFF_CFG[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "planning" | "over">("idle");
  const [budget, setBudget] = useState(dc.budget);
  const [grid, setGrid] = useState<GridCell[][]>(() =>
    Array.from({ length: dc.gridSize }, (_, r) =>
      Array.from({ length: dc.gridSize }, (_, c) => ({
        row: r,
        col: c,
        building: null,
      })),
    ),
  );
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [event, setEvent] = useState<string | null>(null);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 100 : 60,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function computeStats(g: GridCell[][]): CityNeeds {
    const stats: CityNeeds = { education: 0, health: 0, transport: 0, food: 0 };
    for (const row of g)
      for (const cell of row) {
        if (!cell.building) continue;
        const b = BUILDINGS.find((b) => b.type === cell.building)!;
        stats.education += b.education;
        stats.health += b.health;
        stats.transport += b.transport;
        stats.food += b.food;
      }
    return stats;
  }

  function placeBuilding(r: number, c: number) {
    if (!selectedBuilding || phase !== "planning") return;
    const b = BUILDINGS.find((b) => b.type === selectedBuilding)!;
    if (grid[r][c].building) {
      const old = BUILDINGS.find((ob) => ob.type === grid[r][c].building)!;
      const diff = b.cost - old.cost;
      if (budget - diff < 0) {
        setEvent("Not enough budget!");
        setTimeout(() => setEvent(null), 2000);
        return;
      }
      setBudget((prev) => prev - diff);
    } else {
      if (budget - b.cost < 0) {
        setEvent("Not enough budget!");
        setTimeout(() => setEvent(null), 2000);
        return;
      }
      setBudget((prev) => prev - b.cost);
    }
    const newGrid = grid.map((row) =>
      row.map((cell) =>
        cell.row === r && cell.col === c
          ? { ...cell, building: selectedBuilding }
          : cell,
      ),
    );
    setGrid(newGrid);
    const stats = computeStats(newGrid);
    const met = Object.entries(dc.targets).filter(
      ([k, v]) => stats[k as keyof CityNeeds] >= v,
    ).length;
    setScore(met * 150 * config.difficulty);
    if (
      Object.entries(dc.targets).every(
        ([k, v]) => stats[k as keyof CityNeeds] >= v,
      )
    ) {
      setEvent("All targets met! City thriving!");
      setTimeout(() => endGame(true), 2000);
    }
  }

  function removeBuilding(r: number, c: number) {
    const cell = grid[r][c];
    if (!cell.building) return;
    const b = BUILDINGS.find((b) => b.type === cell.building)!;
    setBudget((prev) => prev + Math.floor(b.cost * 0.7));
    setGrid(
      grid.map((row) =>
        row.map((c2) =>
          c2.row === r && c2.col === c ? { ...c2, building: null } : c2,
        ),
      ),
    );
  }

  const stats = computeStats(grid);
  const timePct = (timeLeft / config.timeLimit) * 100;

  const needsBar = (
    val: number,
    target: number,
    label: string,
    color: string,
  ) => (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span style={{ color }}>
          {val}/{target}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, (val / target) * 100)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="strategic_planning.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#6366f1] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#6366f1]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            City Planner
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Allocate your budget. Place buildings to meet education, health,
            transport, and food targets.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              startTimer();
              setPhase("planning");
            }}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#6366f1" }}
            data-ocid="strategic_planning.start_button"
          >
            Begin Planning
          </button>
        </motion.div>
      )}
      {phase === "planning" && (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6366f1] font-mono">Budget: {budget}</span>
            <span className="text-[#f59e0b] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {needsBar(
              stats.education,
              dc.targets.education,
              "Education",
              "#00f5ff",
            )}
            {needsBar(stats.health, dc.targets.health, "Health", "#f43f5e")}
            {needsBar(
              stats.transport,
              dc.targets.transport,
              "Transport",
              "#94a3b8",
            )}
            {needsBar(stats.food, dc.targets.food, "Food", "#f59e0b")}
          </div>
          <div className="flex gap-2 flex-wrap">
            {BUILDINGS.map((b) => (
              <button
                key={b.type}
                type="button"
                onClick={() =>
                  setSelectedBuilding(
                    selectedBuilding === b.type ? null : b.type,
                  )
                }
                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
                  selectedBuilding === b.type
                    ? ""
                    : "border-border/30 bg-card/40 hover:opacity-80"
                }`}
                style={
                  selectedBuilding === b.type
                    ? {
                        borderColor: COLORS[b.type],
                        background: `${COLORS[b.type]}20`,
                        color: COLORS[b.type],
                      }
                    : {}
                }
                data-ocid={`strategic_planning.building.${b.type}`}
              >
                {b.label} ({b.cost})
              </button>
            ))}
          </div>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${dc.gridSize}, 1fr)` }}
          >
            {grid.flat().map((cell) => {
              const building = BUILDINGS.find((b) => b.type === cell.building);
              return (
                <motion.button
                  key={`${cell.row}-${cell.col}`}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={() =>
                    selectedBuilding
                      ? placeBuilding(cell.row, cell.col)
                      : removeBuilding(cell.row, cell.col)
                  }
                  className={`h-14 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    cell.building
                      ? ""
                      : "border-border/20 bg-card/30 hover:border-border/60"
                  }`}
                  style={
                    cell.building
                      ? {
                          borderColor: COLORS[cell.building],
                          background: `${COLORS[cell.building]}15`,
                          color: COLORS[cell.building],
                        }
                      : {}
                  }
                  data-ocid={`strategic_planning.cell.${cell.row}_${cell.col}`}
                >
                  {building ? (
                    <>
                      <span>{building.label}</span>
                      <span className="text-[9px] opacity-60">
                        {building.cost}c
                      </span>
                    </>
                  ) : (
                    "+"
                  )}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {event && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-center font-bold"
                style={{
                  color: event.includes("thriving") ? "#4ade80" : "#f43f5e",
                }}
              >
                {event}
              </motion.p>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => endGame(false)}
            className="self-end text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="strategic_planning.submit_button"
          >
            Submit City Plan
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 2 — Mission Strategist
// ─────────────────────────────────────────────
const MISSIONS = [
  {
    title: "Operation Alpha",
    objective: "Retrieve classified data from a guarded facility.",
    phases: [
      {
        name: "Infiltration",
        options: [
          {
            label: "Safe: Bribe guard",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0,
          },
          {
            label: "Risky: Sneak through ventilation",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0,
          },
          {
            label: "Bold: Create distraction",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0,
          },
        ],
      },
      {
        name: "Data Extraction",
        options: [
          {
            label: "Safe: Download to USB",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0,
          },
          {
            label: "Risky: Hack the mainframe",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0,
          },
          {
            label: "Bold: Steal the entire server",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0,
          },
        ],
      },
      {
        name: "Escape Route",
        options: [
          {
            label: "Safe: Leave through front",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0,
          },
          {
            label: "Risky: Jump from roof",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0,
          },
          {
            label: "Bold: Steal a vehicle",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0,
          },
        ],
      },
      {
        name: "Extraction",
        options: [
          {
            label: "Safe: Call a driver",
            type: "safe",
            guaranteed: 50,
            riskChance: 0,
            riskPts: 0,
            boldChance: 0,
          },
          {
            label: "Risky: Helicopter pickup",
            type: "risky",
            guaranteed: 0,
            riskChance: 0.8,
            riskPts: 100,
            boldChance: 0,
          },
          {
            label: "Bold: Submarine dock",
            type: "bold",
            guaranteed: 0,
            riskChance: 0.5,
            riskPts: 150,
            boldChance: 0,
          },
        ],
      },
    ],
  },
];

function MissionStrategist({ config, onGameEnd }: Props) {
  const missionCount = config.difficulty;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [missionIdx, setMissionIdx] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [run, setRun] = useState(1);
  const [results, setResults] = useState<
    { phase: string; choice: string; pts: number; success: boolean }[]
  >([]);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  const mission = MISSIONS[missionIdx % MISSIONS.length];
  const currentPhase = mission.phases[phaseIdx];

  function chooseOption(opt: (typeof mission.phases)[0]["options"][0]) {
    let pts = 0;
    let success = false;
    if (opt.type === "safe") {
      pts = opt.guaranteed;
      success = true;
    } else if (opt.type === "risky") {
      success = Math.random() < opt.riskChance;
      pts = success ? opt.riskPts : 0;
    } else {
      success = Math.random() < 0.5;
      pts = success ? opt.riskPts : -20;
    }
    pts = pts * config.difficulty;
    setScore((s) => s + pts);
    setResults((prev) => [
      ...prev,
      { phase: currentPhase.name, choice: opt.label, pts, success },
    ]);
    setTimeout(() => {
      if (phaseIdx + 1 >= mission.phases.length) {
        const nextRun = run + 1;
        if (nextRun > missionCount) {
          endGame(true);
          return;
        }
        setRun(nextRun);
        setPhaseIdx(0);
        setResults([]);
      } else setPhaseIdx((i) => i + 1);
    }, 1200);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const optColors: Record<string, string> = {
    safe: "#22c55e",
    risky: "#f59e0b",
    bold: "#f43f5e",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="mission_strategist.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#6366f1] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#6366f1]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Mission Strategist
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Navigate a 4-phase mission. At each phase choose Safe (guaranteed),
            Risky (80% chance), or Bold (50% chance). Maximize total score
            across {missionCount} run{missionCount > 1 ? "s" : ""}.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded-lg border border-[#22c55e]/30 p-2 bg-card/40">
              <div className="font-bold text-[#22c55e]">Safe</div>
              <div>+50 pts guaranteed</div>
            </div>
            <div className="rounded-lg border border-[#f59e0b]/30 p-2 bg-card/40">
              <div className="font-bold text-[#f59e0b]">Risky</div>
              <div>80% → +100 pts</div>
            </div>
            <div className="rounded-lg border border-[#f43f5e]/30 p-2 bg-card/40">
              <div className="font-bold text-[#f43f5e]">Bold</div>
              <div>50% → +150 / -20</div>
            </div>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#6366f1" }}
            data-ocid="mission_strategist.start_button"
          >
            Launch Mission
          </button>
        </motion.div>
      )}
      {phase === "playing" && currentPhase && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6366f1] font-mono">
              Run {run}/{missionCount} | Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              Phase {phaseIdx + 1}/{mission.phases.length}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-xl border border-[#6366f1]/30 bg-card/40 p-3">
            <p className="text-xs text-[#6366f1] font-bold uppercase tracking-widest mb-1">
              {mission.title}
            </p>
            <p className="text-sm font-bold">{currentPhase.name}</p>
            <p className="text-xs text-muted-foreground">{mission.objective}</p>
          </div>
          <div className="space-y-2">
            {currentPhase.options.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => chooseOption(opt)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm hover:opacity-90"
                style={{
                  borderColor: `${optColors[opt.type]}50`,
                  background: `${optColors[opt.type]}10`,
                  color: optColors[opt.type],
                }}
                data-ocid={`mission_strategist.option.${opt.type}`}
              >
                <span className="font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="space-y-1">
            {results.slice(-3).map((r, i) => (
              <div
                key={`r-${i}`}
                className={`text-xs flex justify-between ${
                  r.success ? "text-[#22c55e]" : "text-[#f43f5e]"
                }`}
              >
                <span>
                  {r.phase}: {r.choice}
                </span>
                <span>
                  {r.pts >= 0 ? "+" : ""}
                  {r.pts} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 3 — Decision Tree Builder
// ─────────────────────────────────────────────
interface DTBranch {
  label: string;
  probability: number;
  outcomeValue: number;
  isOptimal: boolean;
}
interface DTDecision {
  title: string;
  question: string;
  context: string;
  branches: DTBranch[];
  optimalBranch: number;
  explanation: string;
}

const DT_DECISIONS: DTDecision[] = [
  {
    title: "School Technology Investment",
    question: "Should the school buy tablets or textbooks?",
    context: "Budget: GHS 5000. 50 students need learning materials.",
    branches: [
      {
        label: "Tablets (25 units)",
        probability: 0.7,
        outcomeValue: 80,
        isOptimal: true,
      },
      {
        label: "Textbooks (full set)",
        probability: 1.0,
        outcomeValue: 50,
        isOptimal: false,
      },
      {
        label: "Mix (10 tablets + half textbooks)",
        probability: 0.85,
        outcomeValue: 65,
        isOptimal: false,
      },
    ],
    optimalBranch: 0,
    explanation:
      "Tablets have higher expected value (0.7 x 80 = 56) vs textbooks (1.0 x 50 = 50). Though risky, tablets provide greater long-term learning flexibility.",
  },
  {
    title: "Business Expansion",
    question: "Should the company expand to a new market?",
    context: "Current revenue: $200k. Expansion costs $50k.",
    branches: [
      {
        label: "Expand to West Africa",
        probability: 0.6,
        outcomeValue: 300,
        isOptimal: true,
      },
      {
        label: "Expand locally only",
        probability: 0.9,
        outcomeValue: 120,
        isOptimal: false,
      },
      {
        label: "Stay and improve current",
        probability: 1.0,
        outcomeValue: 80,
        isOptimal: false,
      },
    ],
    optimalBranch: 0,
    explanation:
      "Expected value: West Africa = 0.6 x 300 = 180. Local = 0.9 x 120 = 108. Staying = 80. West Africa has highest expected value despite higher risk.",
  },
  {
    title: "Medical Treatment Decision",
    question: "Which treatment should the doctor recommend?",
    context: "Patient has a 70% treatable condition. Two treatments available.",
    branches: [
      {
        label: "Standard surgery (established)",
        probability: 0.85,
        outcomeValue: 90,
        isOptimal: true,
      },
      {
        label: "Experimental drug trial",
        probability: 0.5,
        outcomeValue: 120,
        isOptimal: false,
      },
      {
        label: "Conservative management",
        probability: 0.95,
        outcomeValue: 40,
        isOptimal: false,
      },
    ],
    optimalBranch: 0,
    explanation:
      "Expected value: Surgery = 0.85 x 90 = 76.5. Experimental = 0.5 x 120 = 60. Conservative = 0.95 x 40 = 38. Surgery offers best risk-adjusted outcome.",
  },
];

function DecisionTreeBuilder({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const decisions = DT_DECISIONS.slice(0, count);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [dIdx, setDIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const livesRef = useRef(lives);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  const decision = decisions[dIdx];

  function pickBranch(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const correct = idx === decision.optimalBranch;
    if (correct) {
      const pts = 500 * config.difficulty + timeLeft * 3;
      setScore((s) => s + pts);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 2000);
        return;
      }
    }
    setTimeout(() => {
      if (dIdx + 1 >= decisions.length) {
        endGame(true);
        return;
      }
      setDIdx((i) => i + 1);
      setPicked(null);
    }, 2500);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="decision_tree.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#6366f1] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#6366f1]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Decision Tree
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read the scenario. Each branch shows probability and outcome value.
            Calculate expected value (probability x outcome) and select the
            optimal decision.
          </p>
          <p className="text-xs text-muted-foreground">
            Expected Value = Probability x Outcome | {decisions.length}{" "}
            scenarios
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#6366f1" }}
            data-ocid="decision_tree.start_button"
          >
            Build Decision Tree
          </button>
        </motion.div>
      )}
      {phase === "playing" && decision && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6366f1] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {dIdx + 1}/{decisions.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={dIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-3"
            >
              <div className="rounded-xl border border-[#6366f1]/30 bg-card/40 p-3">
                <p className="text-xs font-bold text-[#6366f1]">
                  {decision.title}
                </p>
                <p className="text-sm font-semibold mt-1">
                  {decision.question}
                </p>
                <p className="text-xs text-muted-foreground">
                  {decision.context}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Calculate Expected Value (P x V) for each branch. Select the
                optimal decision:
              </p>
              <div className="space-y-2">
                {decision.branches.map((branch, i) => {
                  const ev = (branch.probability * branch.outcomeValue).toFixed(
                    1,
                  );
                  const isOptimal = branch.isOptimal;
                  const isPicked = picked === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickBranch(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                        picked !== null && isOptimal
                          ? "border-[#22c55e] bg-[#22c55e]/10"
                          : picked !== null && isPicked && !isOptimal
                            ? "border-[#f43f5e] bg-[#f43f5e]/10"
                            : "border-border/30 bg-card/50 hover:border-[#6366f1]/50"
                      }`}
                      data-ocid={`decision_tree.branch.${i}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold">{branch.label}</span>
                        <span
                          className="text-xs font-mono"
                          style={{
                            color:
                              picked !== null
                                ? isOptimal
                                  ? "#22c55e"
                                  : "#f43f5e"
                                : "#6366f1",
                          }}
                        >
                          EV: {ev}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        P={branch.probability} | V={branch.outcomeValue}
                      </div>
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-lg p-3 text-sm border ${
                    picked === decision.optimalBranch
                      ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                      : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
                  }`}
                >
                  {picked === decision.optimalBranch
                    ? "Correct! "
                    : "Not optimal. "}
                  {decision.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export default function StrategicPlanning({ config, onGameEnd }: Props) {
  if (config.gameId === "mission-strategist")
    return <MissionStrategist config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "decision-tree")
    return <DecisionTreeBuilder config={config} onGameEnd={onGameEnd} />;
  return <CityPlanner config={config} onGameEnd={onGameEnd} />;
}
