import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Heart, Package, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

// ── Game 1: Drone Pilot Academy (existing) ────────────────────────────────
type CellType = "empty" | "wall" | "drone" | "package" | "delivery" | "wind";
type Direction = "N" | "S" | "E" | "W";
interface CourseLevel {
  title: string;
  grid: CellType[][];
  startPos: [number, number];
  packages: Array<[number, number]>;
  deliveries: Array<[number, number]>;
  fuelLimit: number;
  wind?: Direction;
  windLabel?: string;
}
const COURSES: Record<1 | 2 | 3, CourseLevel[]> = {
  1: [
    {
      title: "Starter Airfield",
      fuelLimit: 25,
      startPos: [0, 0],
      packages: [
        [0, 3],
        [2, 1],
      ],
      deliveries: [
        [4, 3],
        [3, 0],
      ],
      grid: [
        ["empty", "empty", "wall", "package", "empty"],
        ["empty", "wall", "package", "empty", "empty"],
        ["empty", "empty", "empty", "wall", "empty"],
        ["delivery", "empty", "wall", "empty", "empty"],
        ["empty", "empty", "empty", "delivery", "empty"],
      ],
    },
  ],
  2: [
    {
      title: "Urban Grid",
      fuelLimit: 30,
      startPos: [0, 0],
      packages: [
        [0, 4],
        [4, 1],
        [2, 3],
      ],
      deliveries: [
        [4, 4],
        [1, 3],
        [3, 1],
      ],
      wind: "E",
      windLabel: "Wind from WEST pushing EAST",
      grid: [
        ["empty", "wall", "empty", "empty", "package"],
        ["empty", "empty", "wall", "delivery", "wall"],
        ["wall", "empty", "empty", "package", "empty"],
        ["empty", "delivery", "wall", "empty", "wall"],
        ["empty", "package", "empty", "empty", "delivery"],
      ],
    },
  ],
  3: [
    {
      title: "Precision Cargo Run",
      fuelLimit: 35,
      startPos: [0, 0],
      packages: [
        [0, 4],
        [4, 0],
        [2, 2],
        [4, 4],
      ],
      deliveries: [
        [4, 3],
        [0, 3],
        [3, 4],
        [1, 1],
      ],
      wind: "S",
      windLabel: "Crosswind pushing SOUTH",
      grid: [
        ["empty", "wall", "empty", "delivery", "package"],
        ["empty", "delivery", "wall", "empty", "wall"],
        ["wall", "empty", "package", "wall", "empty"],
        ["empty", "empty", "wall", "empty", "delivery"],
        ["package", "wall", "empty", "delivery", "package"],
      ],
    },
  ],
};
const CELL_SIZE = 58;
const COLS = 5;
const ROWS = 5;

// ── Game 2: Flight Physics Quiz ───────────────────────────────────────────────────
interface FlightQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}
const FLIGHT_QUESTIONS: FlightQuestion[] = [
  {
    id: "fq1",
    scenario: "What happens to drone altitude when thrust equals weight?",
    options: [
      "Drone rises",
      "Drone descends",
      "Drone hovers at constant altitude",
      "Drone spins",
    ],
    correctIdx: 2,
    explanation:
      "When thrust = weight (gravity), net vertical force = 0. Drone maintains constant altitude — this is called hovering.",
  },
  {
    id: "fq2",
    scenario: "How does a quadrotor drone yaw (rotate around vertical axis)?",
    options: [
      "Two opposite rotors spin faster",
      "All rotors change angle",
      "The tail rotor adjusts speed",
      "Two clockwise rotors spin faster than two counter-clockwise",
    ],
    correctIdx: 3,
    explanation:
      "Quadrotors yaw by creating a net torque imbalance. Two motors rotating in one direction dominate two motors in the other direction.",
  },
  {
    id: "fq3",
    scenario: "To roll right, which motors does a standard quad adjust?",
    options: [
      "Front motors increase",
      "Left motors increase, right motors decrease",
      "All motors increase",
      "Only rear right motor changes",
    ],
    correctIdx: 1,
    explanation:
      "Rolling right: left-side motors increase thrust, right-side motors decrease. Creates a torque that tilts the drone right.",
  },
  {
    id: "fq4",
    scenario:
      "A drone flies at 2m/s into a 5m/s headwind. What is its ground speed?",
    options: ["7 m/s", "3 m/s", "5 m/s", "-3 m/s (backward)"],
    correctIdx: 3,
    explanation:
      "Ground speed = airspeed - headwind. 2 - 5 = -3 m/s. The drone moves backward relative to ground despite flying forward.",
  },
  {
    id: "fq5",
    scenario:
      "Which electronic component converts PWM signals into motor rotation speed?",
    options: [
      "Flight controller",
      "ESC (Electronic Speed Controller)",
      "GPS module",
      "Barometer",
    ],
    correctIdx: 1,
    explanation:
      "ESC receives PWM signals from the flight controller and converts them into precise motor RPM commands for brushless motors.",
  },
  {
    id: "fq6",
    scenario: "What sensor measures altitude using air pressure?",
    options: ["Gyroscope", "Magnetometer", "Barometer", "Accelerometer"],
    correctIdx: 2,
    explanation:
      "Barometer measures atmospheric pressure which decreases with altitude. Higher altitude = lower pressure = higher altitude reading.",
  },
  {
    id: "fq7",
    scenario:
      "To pitch forward (fly forward), which motors does the drone adjust?",
    options: [
      "Front motors increase, rear motors decrease",
      "Rear motors increase, front motors decrease",
      "All motors decrease together",
      "Left motors only",
    ],
    correctIdx: 1,
    explanation:
      "Pitching forward: rear motors spin faster, lifting the tail. Front dips down. Thrust vector tilts forward, creating forward movement.",
  },
  {
    id: "fq8",
    scenario: "What is the purpose of a drone's gyroscope?",
    options: [
      "Measures altitude",
      "Measures angular rotation rate",
      "Measures wind speed",
      "Measures battery voltage",
    ],
    correctIdx: 1,
    explanation:
      "Gyroscope measures angular velocity (rotation rate) around all three axes. Essential for PID stabilization loop.",
  },
  {
    id: "fq9",
    scenario:
      "A drone battery shows 3.5V per cell (4S battery). Is this safe to continue flying?",
    options: [
      "Yes, 3.5V is nominal",
      "Yes, 3.5V is fully charged",
      "No, 3.5V is dangerously low - land immediately",
      "No, 3.5V is overcharged",
    ],
    correctIdx: 2,
    explanation:
      "LiPo safe range: 3.7V nominal, 4.2V full, 3.5V minimum. At 3.5V you risk permanent cell damage. Land immediately.",
  },
  {
    id: "fq10",
    scenario: "What does FPV stand for in drone racing?",
    options: [
      "Flight Path Vision",
      "First Person View",
      "Frequency Position Vector",
      "Fixed Point Velocity",
    ],
    correctIdx: 1,
    explanation:
      "FPV (First Person View) uses a camera on the drone feeding live video to goggles worn by the pilot, providing immersive flight.",
  },
  {
    id: "fq11",
    scenario: "Which factor most affects maximum hover time of a quadrotor?",
    options: [
      "GPS signal quality",
      "Motor color",
      "Battery capacity (mAh) vs total weight ratio",
      "Number of props",
    ],
    correctIdx: 2,
    explanation:
      "Hover time is dominated by energy storage (mAh) vs power consumption. Heavier drone needs more thrust = more current = shorter flight.",
  },
  {
    id: "fq12",
    scenario:
      "A drone loses power to one motor. What must the flight controller do?",
    options: [
      "Maintain altitude by increasing opposite motor",
      "Cut all motors for safety",
      "Compensate by reducing opposite motor and adjusting yaw",
      "Switch to GPS mode",
    ],
    correctIdx: 2,
    explanation:
      "With one motor lost, the flight controller reduces the diagonally opposite motor and adjusts remaining pair to prevent uncontrolled spin.",
  },
];

// ── Game 3: Mission Planner ───────────────────────────────────────────────────────
interface Waypoint {
  id: string;
  label: string;
  x: number;
  y: number;
}
interface MissionMap {
  id: string;
  title: string;
  description: string;
  home: { x: number; y: number };
  waypoints: Waypoint[];
  batteryLimit: number;
  optimalOrder: string[];
  optimalDistance: number;
}
function dist(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.round(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));
}
const MISSION_MAPS: MissionMap[] = [
  {
    id: "mm1",
    title: "Farm Survey",
    description:
      "Survey 4 crop zones. Start/end at home base. Minimize total distance.",
    home: { x: 10, y: 50 },
    waypoints: [
      { id: "A", label: "Zone A", x: 30, y: 20 },
      { id: "B", label: "Zone B", x: 60, y: 30 },
      { id: "C", label: "Zone C", x: 80, y: 70 },
      { id: "D", label: "Zone D", x: 40, y: 80 },
    ],
    batteryLimit: 250,
    optimalOrder: ["A", "B", "C", "D"],
    optimalDistance: 220,
  },
  {
    id: "mm2",
    title: "Coastal Inspection",
    description: "Inspect 4 buoys. Optimal route saves battery on return leg.",
    home: { x: 20, y: 20 },
    waypoints: [
      { id: "A", label: "Buoy 1", x: 70, y: 10 },
      { id: "B", label: "Buoy 2", x: 80, y: 50 },
      { id: "C", label: "Buoy 3", x: 60, y: 80 },
      { id: "D", label: "Buoy 4", x: 30, y: 60 },
    ],
    batteryLimit: 280,
    optimalOrder: ["A", "B", "C", "D"],
    optimalDistance: 255,
  },
  {
    id: "mm3",
    title: "Search Grid",
    description:
      "Search 5 grid squares for lost hiker. Systematic coverage required.",
    home: { x: 50, y: 50 },
    waypoints: [
      { id: "A", label: "Grid NW", x: 15, y: 15 },
      { id: "B", label: "Grid NE", x: 85, y: 15 },
      { id: "C", label: "Grid SE", x: 85, y: 85 },
      { id: "D", label: "Grid SW", x: 15, y: 85 },
      { id: "E", label: "Grid C", x: 50, y: 50 },
    ],
    batteryLimit: 350,
    optimalOrder: ["A", "B", "C", "D", "E"],
    optimalDistance: 312,
  },
  {
    id: "mm4",
    title: "Bridge Inspection",
    description: "Inspect 4 bridge sections. Must return to base in sequence.",
    home: { x: 5, y: 50 },
    waypoints: [
      { id: "A", label: "Section 1", x: 25, y: 50 },
      { id: "B", label: "Section 2", x: 45, y: 50 },
      { id: "C", label: "Section 3", x: 65, y: 50 },
      { id: "D", label: "Section 4", x: 85, y: 50 },
    ],
    batteryLimit: 200,
    optimalOrder: ["A", "B", "C", "D"],
    optimalDistance: 160,
  },
  {
    id: "mm5",
    title: "Wildfire Monitor",
    description:
      "Monitor 5 fire perimeter points. Wind changes route priorities.",
    home: { x: 50, y: 10 },
    waypoints: [
      { id: "A", label: "North Point", x: 50, y: 25 },
      { id: "B", label: "East Point", x: 80, y: 50 },
      { id: "C", label: "South Point", x: 50, y: 80 },
      { id: "D", label: "West Point", x: 20, y: 50 },
      { id: "E", label: "Center", x: 50, y: 50 },
    ],
    batteryLimit: 300,
    optimalOrder: ["A", "B", "E", "C", "D"],
    optimalDistance: 268,
  },
  {
    id: "mm6",
    title: "Solar Farm Audit",
    description: "Inspect 4 panel arrays arranged in a rectangle.",
    home: { x: 10, y: 10 },
    waypoints: [
      { id: "A", label: "Array NW", x: 10, y: 80 },
      { id: "B", label: "Array NE", x: 90, y: 10 },
      { id: "C", label: "Array SE", x: 90, y: 80 },
      { id: "D", label: "Array SW", x: 50, y: 80 },
    ],
    batteryLimit: 290,
    optimalOrder: ["B", "C", "D", "A"],
    optimalDistance: 265,
  },
  {
    id: "mm7",
    title: "Delivery Network",
    description:
      "Multi-drop package delivery to 4 locations. Each has a time window.",
    home: { x: 50, y: 50 },
    waypoints: [
      { id: "A", label: "Hospital", x: 20, y: 20 },
      { id: "B", label: "School", x: 80, y: 20 },
      { id: "C", label: "Market", x: 20, y: 80 },
      { id: "D", label: "Library", x: 80, y: 80 },
    ],
    batteryLimit: 260,
    optimalOrder: ["A", "B", "D", "C"],
    optimalDistance: 237,
  },
  {
    id: "mm8",
    title: "Pipeline Survey",
    description: "Survey a pipeline with 5 inspection points.",
    home: { x: 5, y: 5 },
    waypoints: [
      { id: "A", label: "Point 1", x: 20, y: 25 },
      { id: "B", label: "Point 2", x: 40, y: 45 },
      { id: "C", label: "Point 3", x: 60, y: 40 },
      { id: "D", label: "Point 4", x: 75, y: 60 },
      { id: "E", label: "Point 5", x: 90, y: 80 },
    ],
    batteryLimit: 310,
    optimalOrder: ["A", "B", "C", "D", "E"],
    optimalDistance: 285,
  },
];

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ── GAME 1 COMPONENT
function DronePilotAcademyGame({ config, onGameEnd }: Props) {
  const course = COURSES[config.difficulty][0];
  const [pos, setPos] = useState<[number, number]>([...course.startPos] as [
    number,
    number,
  ]);
  const [grid, setGrid] = useState<CellType[][]>(() =>
    course.grid.map((row) => [...row]),
  );
  const [carrying, setCarrying] = useState(false);
  const [fuel, setFuel] = useState(course.fuelLimit);
  const [deliveries, setDeliveries] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const deliveriesRef = useRef(deliveries);
  deliveriesRef.current = deliveries;
  const totalPackages = course.packages.length;

  const endGame = useCallback(
    (completed: boolean, finalScore: number, finalDeliveries: number) => {
      if (gameOver) return;
      setGameOver(true);
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          finalScore,
          (finalDeliveries / totalPackages) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, gameOver, totalPackages],
  );

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1500);
  }

  function move(dr: number, dc: number) {
    if (!gameStarted || gameOver) return;
    if (fuel <= 0) {
      showMessage("OUT OF FUEL");
      endGame(false, scoreRef.current, deliveriesRef.current);
      return;
    }
    let [r, c] = pos;
    let newR = r + dr;
    let newC = c + dc;
    if (course.wind === "E") newC = Math.min(COLS - 1, newC + 1);
    else if (course.wind === "S") newR = Math.min(ROWS - 1, newR + 1);
    newR = Math.max(0, Math.min(ROWS - 1, newR));
    newC = Math.max(0, Math.min(COLS - 1, newC));
    if (grid[newR][newC] === "wall") {
      showMessage("BLOCKED");
      setFuel((f) => Math.max(0, f - 1));
      return;
    }
    let newCarrying = carrying;
    let newGrid = grid.map((row) => [...row]) as CellType[][];
    if (!carrying && grid[newR][newC] === "package") {
      newCarrying = true;
      newGrid[newR][newC] = "empty";
      showMessage("PACKAGE COLLECTED");
    }
    let newDeliveries = deliveriesRef.current;
    let newScore = scoreRef.current;
    if (carrying && grid[newR][newC] === "delivery") {
      newCarrying = false;
      newGrid[newR][newC] = "empty";
      newDeliveries += 1;
      newScore += 300 * config.difficulty;
      setScore(newScore);
      setDeliveries(newDeliveries);
      showMessage("DELIVERED!");
      if (newDeliveries >= totalPackages) {
        setPos([newR, newC]);
        setGrid(newGrid);
        setCarrying(newCarrying);
        setFuel((f) => f - 1);
        setTimeout(() => endGame(true, newScore, newDeliveries), 800);
        return;
      }
    }
    setPos([newR, newC]);
    setGrid(newGrid);
    setCarrying(newCarrying);
    setFuel((f) => {
      const nf = f - 1;
      if (nf <= 0)
        setTimeout(
          () => endGame(nf + 1 <= 0, scoreRef.current, deliveriesRef.current),
          500,
        );
      return nf;
    });
  }

  useEffect(() => {
    if (!gameStarted) return;
    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault();
          move(-1, 0);
          break;
        case "ArrowDown":
        case "s":
          e.preventDefault();
          move(1, 0);
          break;
        case "ArrowLeft":
        case "a":
          e.preventDefault();
          move(0, -1);
          break;
        case "ArrowRight":
        case "d":
          e.preventDefault();
          move(0, 1);
          break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="drone_systems.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Package
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#10b981" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981" }}
          >
            Drone Pilot Academy
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Navigate to collect packages and deliver them to marked zones. Use
            arrow buttons or WASD keys.
          </p>
          {course.windLabel && (
            <p className="text-[#f59e0b] text-xs mb-4">{course.windLabel}</p>
          )}
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="drone_systems.start_button"
          >
            Launch Drone
          </GlowButton>
        </motion.div>
      </div>
    );

  const fuelPct = (fuel / course.fuelLimit) * 100;
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="drone_systems.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Package className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span
            style={{
              color: carrying ? "#f59e0b" : "#6b7280",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {carrying ? "CARRYING" : "EMPTY"}
          </span>
          <span className="text-muted-foreground">
            Deliveries:{" "}
            <span className="font-bold text-[#10b981]">
              {deliveries}/{totalPackages}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${fuelPct}%`,
                backgroundColor:
                  fuelPct > 40
                    ? "#10b981"
                    : fuelPct > 20
                      ? "#f59e0b"
                      : "#f43f5e",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {fuel}
          </span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
            gap: "3px",
          }}
          data-ocid="drone_systems.grid"
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isDrone = pos[0] === r && pos[1] === c;
              const borderColor = isDrone
                ? "#10b981"
                : cell === "wall"
                  ? "#374151"
                  : cell === "package"
                    ? "#f59e0b"
                    : cell === "delivery"
                      ? "#7c3aed"
                      : "#1e293b";
              return (
                <div
                  key={`${r}-${c}`}
                  className="rounded-lg flex items-center justify-center relative"
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor:
                      cell === "wall"
                        ? "#1e293b"
                        : isDrone
                          ? carrying
                            ? "#f59e0b20"
                            : "#10b98120"
                          : cell === "package"
                            ? "#f59e0b15"
                            : cell === "delivery"
                              ? "#7c3aed15"
                              : "#0f172a",
                    border: `2px solid ${borderColor}`,
                    boxShadow: isDrone
                      ? `0 0 12px ${carrying ? "#f59e0b" : "#10b981"}`
                      : "none",
                  }}
                  data-ocid={`drone_systems.cell.${r}.${c}`}
                >
                  {isDrone && (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      style={{
                        filter: `drop-shadow(0 0 6px ${carrying ? "#f59e0b" : "#10b981"})`,
                      }}
                    >
                      <circle
                        cx="14"
                        cy="14"
                        r="5"
                        fill={carrying ? "#f59e0b" : "#10b981"}
                      />
                      <line
                        x1="4"
                        y1="4"
                        x2="10"
                        y2="10"
                        stroke={carrying ? "#f59e0b" : "#10b981"}
                        strokeWidth="2"
                      />
                      <line
                        x1="24"
                        y1="4"
                        x2="18"
                        y2="10"
                        stroke={carrying ? "#f59e0b" : "#10b981"}
                        strokeWidth="2"
                      />
                      <line
                        x1="4"
                        y1="24"
                        x2="10"
                        y2="18"
                        stroke={carrying ? "#f59e0b" : "#10b981"}
                        strokeWidth="2"
                      />
                      <line
                        x1="24"
                        y1="24"
                        x2="18"
                        y2="18"
                        stroke={carrying ? "#f59e0b" : "#10b981"}
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                  {!isDrone && cell === "package" && (
                    <svg width="22" height="22" viewBox="0 0 22 22">
                      <rect
                        x="3"
                        y="6"
                        width="16"
                        height="12"
                        rx="2"
                        fill="#f59e0b30"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                      <line
                        x1="11"
                        y1="6"
                        x2="11"
                        y2="18"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                  {!isDrone && cell === "delivery" && (
                    <svg width="22" height="22" viewBox="0 0 22 22">
                      <polygon
                        points="11,3 19,19 3,19"
                        fill="#7c3aed30"
                        stroke="#7c3aed"
                        strokeWidth="2"
                      />
                      <circle cx="11" cy="15" r="1.5" fill="#7c3aed" />
                    </svg>
                  )}
                  {!isDrone && cell === "wall" && (
                    <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                      {[0, 1, 2, 3].map((b) => (
                        <div
                          key={b}
                          className="rounded-sm"
                          style={{ backgroundColor: "#374151" }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-black z-50 pointer-events-none"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              backgroundColor:
                message === "DELIVERED!"
                  ? "#10b98120"
                  : message === "PACKAGE COLLECTED"
                    ? "#f59e0b20"
                    : "#f43f5e20",
              color:
                message === "DELIVERED!"
                  ? "#10b981"
                  : message === "PACKAGE COLLECTED"
                    ? "#f59e0b"
                    : "#f43f5e",
              border: `1px solid ${message === "DELIVERED!" ? "#10b981" : message === "PACKAGE COLLECTED" ? "#f59e0b" : "#f43f5e"}`,
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="shrink-0 flex flex-col items-center gap-2">
        {course.windLabel && (
          <p
            className="text-xs"
            style={{ color: "#f59e0b", fontFamily: "'Orbitron', sans-serif" }}
          >
            {course.windLabel}
          </p>
        )}
        <div className="grid grid-cols-3 gap-2">
          <div />
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => move(-1, 0)}
            className="rounded-lg border-2 border-border/40 h-10 w-10 flex items-center justify-center text-lg font-bold hover:border-[#10b981] transition-all"
            style={{ color: "#10b981" }}
            data-ocid="drone_systems.btn_up"
          >
            N
          </motion.button>
          <div />
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => move(0, -1)}
            className="rounded-lg border-2 border-border/40 h-10 w-10 flex items-center justify-center text-lg font-bold hover:border-[#10b981] transition-all"
            style={{ color: "#10b981" }}
            data-ocid="drone_systems.btn_left"
          >
            W
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => move(1, 0)}
            className="rounded-lg border-2 border-border/40 h-10 w-10 flex items-center justify-center text-lg font-bold hover:border-[#10b981] transition-all"
            style={{ color: "#10b981" }}
            data-ocid="drone_systems.btn_down"
          >
            S
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => move(0, 1)}
            className="rounded-lg border-2 border-border/40 h-10 w-10 flex items-center justify-center text-lg font-bold hover:border-[#10b981] transition-all"
            style={{ color: "#10b981" }}
            data-ocid="drone_systems.btn_right"
          >
            E
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── GAME 2 COMPONENT
function FlightPhysicsGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 8 : 12;
  const questions = FLIGHT_QUESTIONS.slice(0, count);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
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
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          total > 0 ? (correct / total) * 100 : 0,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const q = questions[idx];

  function handleAnswer(optIdx: number) {
    if (answered || !gameStarted) return;
    setSelected(optIdx);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (optIdx === q.correctIdx) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
    setTimeout(() => {
      const n = idx + 1;
      if (n >= questions.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setSelected(null);
      setAnswered(false);
    }, 2000);
  }

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="flight_physics.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Package
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#7c3aed" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
          >
            Drone Flight Physics
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            12 drone physics scenarios covering altitude control, yaw/pitch/roll
            mechanics, battery management, and flight dynamics.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Master the physics that make autonomous drones work.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="flight_physics.start_button"
          >
            Start Quiz
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="flight_physics.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#7c3aed" }}>
          <Package className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" }}
        >
          Q{idx + 1}/{questions.length}
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

      {/* Drone diagram */}
      <div className="glass-card rounded-xl p-3 shrink-0 flex items-center justify-center">
        <svg width="160" height="100" viewBox="0 0 160 100">
          <line
            x1="80"
            y1="50"
            x2="30"
            y2="20"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="50"
            x2="130"
            y2="20"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="50"
            x2="30"
            y2="80"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="50"
            x2="130"
            y2="80"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="80"
            cy="50"
            r="10"
            fill="#7c3aed30"
            stroke="#7c3aed"
            strokeWidth="2"
          />
          {/* Motor circles */}
          <circle
            cx="30"
            cy="20"
            r="12"
            fill="#00f5ff20"
            stroke="#00f5ff"
            strokeWidth="2"
          />
          <text
            x="30"
            y="24"
            textAnchor="middle"
            fill="#00f5ff"
            fontSize="8"
            fontFamily="Orbitron"
          >
            M1
          </text>
          <circle
            cx="130"
            cy="20"
            r="12"
            fill="#10b98120"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x="130"
            y="24"
            textAnchor="middle"
            fill="#10b981"
            fontSize="8"
            fontFamily="Orbitron"
          >
            M2
          </text>
          <circle
            cx="30"
            cy="80"
            r="12"
            fill="#10b98120"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x="30"
            y="84"
            textAnchor="middle"
            fill="#10b981"
            fontSize="8"
            fontFamily="Orbitron"
          >
            M3
          </text>
          <circle
            cx="130"
            cy="80"
            r="12"
            fill="#00f5ff20"
            stroke="#00f5ff"
            strokeWidth="2"
          />
          <text
            x="130"
            y="84"
            textAnchor="middle"
            fill="#00f5ff"
            fontSize="8"
            fontFamily="Orbitron"
          >
            M4
          </text>
          <text
            x="80"
            y="94"
            textAnchor="middle"
            fill="#6b7280"
            fontSize="7"
            fontFamily="Orbitron"
          >
            M1,M4=CW | M2,M3=CCW
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex flex-col gap-3 flex-1"
        >
          <div className="glass-card rounded-xl p-3 shrink-0 border border-[#7c3aed]/30">
            <p className="text-sm font-bold text-foreground">{q.scenario}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 flex-1">
            {q.options.map((opt, i) => {
              let bc = "border-border/30 hover:border-[#7c3aed]/40";
              if (answered) {
                if (i === q.correctIdx) bc = "border-[#10b981] bg-[#10b981]/10";
                else if (i === selected)
                  bc = "border-[#f43f5e] bg-[#f43f5e]/10";
              }
              return (
                <motion.button
                  type="button"
                  key={`opt-${i}`}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`glass-card rounded-xl p-3 border text-sm cursor-pointer transition-all text-left ${bc}`}
                  data-ocid={`flight_physics.option.${i + 1}`}
                >
                  <div className="flex items-start gap-2">
                    {answered && i === q.correctIdx && (
                      <CheckCircle className="h-4 w-4 text-[#10b981] shrink-0" />
                    )}
                    {answered && i === selected && i !== q.correctIdx && (
                      <XCircle className="h-4 w-4 text-[#f43f5e] shrink-0" />
                    )}
                    <span>{opt}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-xl p-3 shrink-0 border border-[#00f5ff]/30"
              >
                <p className="text-xs text-[#00f5ff]">
                  <span className="font-bold">Physics: </span>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── GAME 3 COMPONENT
function MissionPlannerGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const maps = MISSION_MAPS.slice(0, count);
  const [mapIdx, setMapIdx] = useState(0);
  const [route, setRoute] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [routeDistance, setRouteDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correct / maps.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, maps.length],
  );

  const m = maps[mapIdx];

  function calcRouteDistance(r: string[]): number {
    if (r.length === 0) return 0;
    let total = dist(m.home, m.waypoints.find((w) => w.id === r[0])!);
    for (let i = 0; i < r.length - 1; i++) {
      const a = m.waypoints.find((w) => w.id === r[i])!;
      const b = m.waypoints.find((w) => w.id === r[i + 1])!;
      total += dist(a, b);
    }
    const last = m.waypoints.find((w) => w.id === r[r.length - 1])!;
    total += dist(last, m.home);
    return total;
  }

  function toggleWaypoint(id: string) {
    if (submitted) return;
    const newRoute = route.includes(id)
      ? route.filter((r) => r !== id)
      : [...route, id];
    setRoute(newRoute);
    setRouteDistance(newRoute.length > 0 ? calcRouteDistance(newRoute) : 0);
  }

  function handleSubmit() {
    if (submitted || route.length !== m.waypoints.length) return;
    const d = calcRouteDistance(route);
    const tolerance = m.optimalDistance * 0.15;
    const ok = d <= m.optimalDistance + tolerance;
    setSubmitted(true);
    setResult(ok);
    if (ok) {
      setScore((s) => s + 300 * config.difficulty);
      setCorrect((c) => c + 1);
    }
    setTimeout(() => {
      const n = mapIdx + 1;
      if (n >= maps.length) {
        endGame(true);
        return;
      }
      setMapIdx(n);
      setRoute([]);
      setRouteDistance(0);
      setSubmitted(false);
      setResult(null);
    }, 2500);
  }

  if (!gameStarted)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="mission_planner.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Package
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f59e0b" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
          >
            Drone Mission Planner
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            A map shows waypoints to visit. Click waypoints in the optimal order
            to minimize total flight distance within the battery limit.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Order matters. A route within 15% of optimal is accepted. Real-world
            path optimization problem.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="mission_planner.start_button"
          >
            Plan Missions
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="mission_planner.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Package className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
        >
          Mission {mapIdx + 1}/{maps.length}
        </span>
        <span className="text-xs text-muted-foreground">
          Battery: {m.batteryLimit}m limit
        </span>
      </div>

      <div className="glass-card rounded-xl p-2 shrink-0 border border-[#f59e0b]/30">
        <p
          className="text-xs font-bold mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
        >
          {m.title}
        </p>
        <p className="text-xs text-muted-foreground">{m.description}</p>
      </div>

      {/* Map visualization */}
      <div className="glass rounded-xl border border-border/30 relative flex-1 min-h-0 overflow-hidden">
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Route lines */}
          {route.length > 0 &&
            (() => {
              const pts = [
                m.home,
                ...route.map((id) => m.waypoints.find((w) => w.id === id)!),
                m.home,
              ];
              return pts
                .slice(0, -1)
                .map((a, i) => (
                  <line
                    key={`rl-${i}`}
                    x1={a.x}
                    y1={a.y}
                    x2={pts[i + 1].x}
                    y2={pts[i + 1].y}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="2,1"
                    opacity="0.6"
                  />
                ));
            })()}
          {/* Home */}
          <rect
            x={m.home.x - 4}
            y={m.home.y - 4}
            width="8"
            height="8"
            fill="#10b98130"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <text
            x={m.home.x}
            y={m.home.y - 6}
            textAnchor="middle"
            fill="#10b981"
            fontSize="4"
            fontFamily="Orbitron"
          >
            HOME
          </text>
          {/* Waypoints */}
          {m.waypoints.map((wp, i) => {
            const inRoute = route.includes(wp.id);
            const routePos = route.indexOf(wp.id);
            return (
              <g key={wp.id}>
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={inRoute ? 6 : 5}
                  fill={inRoute ? "#f59e0b40" : "#7c3aed20"}
                  stroke={inRoute ? "#f59e0b" : "#7c3aed"}
                  strokeWidth="1.5"
                  style={{
                    cursor: "pointer",
                    filter: inRoute ? "drop-shadow(0 0 3px #f59e0b)" : "none",
                  }}
                  onClick={() => toggleWaypoint(wp.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleWaypoint(wp.id);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={inRoute}
                />
                {inRoute && (
                  <text
                    x={wp.x}
                    y={wp.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#f59e0b"
                    fontSize="4"
                    fontFamily="Orbitron"
                    style={{ pointerEvents: "none" }}
                  >
                    {routePos + 1}
                  </text>
                )}
                {!inRoute && (
                  <text
                    x={wp.x}
                    y={wp.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#7c3aed"
                    fontSize="3.5"
                    fontFamily="Orbitron"
                    style={{ pointerEvents: "none" }}
                  >
                    {wp.label.split(" ")[0].slice(0, 4)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Route display */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-1">
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            ROUTE: HOME {route.map((id) => `→ ${id}`).join(" ")}{" "}
            {route.length > 0 ? "→ HOME" : ""}
          </p>
          <p
            className="text-xs font-bold"
            style={{
              color: routeDistance > m.batteryLimit ? "#f43f5e" : "#10b981",
            }}
          >
            {routeDistance > 0 ? `${routeDistance}m` : ""}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {submitted && result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-3 border shrink-0 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`}
          >
            <p
              className="text-xs"
              style={{ color: result ? "#10b981" : "#f43f5e" }}
            >
              {result
                ? `Optimal route! Distance: ${routeDistance}m (optimal: ${m.optimalDistance}m)`
                : `Too long (${routeDistance}m). Optimal: ${m.optimalDistance}m. Try order: ${m.optimalOrder.join(" → ")}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <GlowButton
        variant="primary"
        size="sm"
        onClick={handleSubmit}
        disabled={route.length !== m.waypoints.length || submitted}
        data-ocid="mission_planner.submit_button"
      >
        Submit Route ({route.length}/{m.waypoints.length} waypoints)
      </GlowButton>
    </div>
  );
}

// ── MAIN EXPORT
export default function DroneSystems(props: Props) {
  switch (props.config.gameId) {
    case "flight-physics":
      return <FlightPhysicsGame {...props} />;
    case "mission-planner":
      return <MissionPlannerGame {...props} />;
    default:
      return <DronePilotAcademyGame {...props} />;
  }
}
