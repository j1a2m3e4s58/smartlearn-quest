import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { T as Target } from "./target-BArPR6vI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { T as TrendingUp } from "./trending-up-BCF05R7n.js";
const D1_PROBLEMS = [
  {
    scenario: "Ball launched at 10 m/s at 45°. Ignore air resistance. Where does it land?",
    v0: 10,
    angleDeg: 45,
    type: "range",
    answers: ["10.2 m", "5.1 m", "8.4 m", "12.0 m"],
    correct: 0,
    explanation: "Range = v²sin(2θ)/g = 100×1/9.8 ≈ 10.2 m"
  },
  {
    scenario: "A ball is dropped from rest. How far does it fall in 2 seconds?",
    v0: 0,
    angleDeg: 270,
    type: "height",
    answers: ["10 m", "19.6 m", "9.8 m", "40 m"],
    correct: 1,
    explanation: "h = ½gt² = 0.5 × 9.8 × 4 = 19.6 m"
  },
  {
    scenario: "Newton's First Law: A hockey puck slides on frictionless ice. What happens?",
    v0: 5,
    angleDeg: 0,
    type: "law",
    answers: [
      "It slows down gradually",
      "It speeds up",
      "It keeps moving at constant speed",
      "It stops immediately"
    ],
    correct: 2,
    explanation: "Newton's 1st Law: Objects in motion stay in motion unless acted upon."
  },
  {
    scenario: "A 5 kg box is pushed with 20 N force. What is its acceleration?",
    v0: 0,
    angleDeg: 0,
    type: "law",
    answers: ["100 m/s²", "4 m/s²", "2.5 m/s²", "20 m/s²"],
    correct: 1,
    explanation: "F=ma → a = F/m = 20/5 = 4 m/s²"
  },
  {
    scenario: "Projectile: v0 = 20 m/s at 30°. What is the horizontal range?",
    v0: 20,
    angleDeg: 30,
    type: "range",
    answers: ["35.3 m", "40.8 m", "20 m", "28.6 m"],
    correct: 0,
    explanation: "Range = v²sin(60°)/g = 400 × 0.866/9.8 ≈ 35.3 m"
  },
  {
    scenario: "A ball is thrown vertically at 14.7 m/s. How long until it returns to launch height?",
    v0: 14.7,
    angleDeg: 90,
    type: "time",
    answers: ["1.5 s", "3 s", "4.5 s", "2 s"],
    correct: 1,
    explanation: "t = 2v0/g = 2×14.7/9.8 = 3 s"
  },
  {
    scenario: "Newton's 3rd Law: You push a wall with 50 N. The wall pushes back with?",
    v0: 0,
    angleDeg: 0,
    type: "law",
    answers: ["25 N", "100 N", "50 N", "0 N"],
    correct: 2,
    explanation: "Newton's 3rd Law: Equal and opposite reaction forces."
  },
  {
    scenario: "A 10 kg object in free fall. Net force = ? (g = 9.8 m/s²)",
    v0: 0,
    angleDeg: 270,
    type: "law",
    answers: ["9.8 N", "98 N", "10 N", "49 N"],
    correct: 1,
    explanation: "F = mg = 10 × 9.8 = 98 N"
  },
  {
    scenario: "Projectile at v0 = 15 m/s, 60°. What is the max height?",
    v0: 15,
    angleDeg: 60,
    type: "height",
    answers: ["8.6 m", "17.2 m", "11.5 m", "5.7 m"],
    correct: 0,
    explanation: "H = (v0 sinθ)²/2g = (15×√3/2)²/19.6 ≈ 8.6 m"
  },
  {
    scenario: "A car decelerates from 30 m/s to 0 in 5 s. What is the deceleration?",
    v0: 30,
    angleDeg: 0,
    type: "law",
    answers: ["5 m/s²", "6 m/s²", "3 m/s²", "10 m/s²"],
    correct: 1,
    explanation: "a = Δv/t = (0-30)/5 = -6 m/s²"
  }
];
const D2_PROBLEMS = [
  {
    scenario: "Projectile at 30 m/s, 53°. Calculate the time of flight.",
    v0: 30,
    angleDeg: 53,
    type: "time",
    answers: ["4.9 s", "3.5 s", "6.1 s", "2.4 s"],
    correct: 0,
    explanation: "t = 2v0sinθ/g = 2×30×0.8/9.8 ≈ 4.9 s"
  },
  {
    scenario: "Ball launched from 80 m cliff at 20 m/s horizontal. Time to hit ground?",
    v0: 20,
    angleDeg: 0,
    type: "time",
    answers: ["4.04 s", "3.2 s", "5.1 s", "2 s"],
    correct: 0,
    explanation: "h = ½gt² → t = √(2h/g) = √(160/9.8) = 4.04 s"
  },
  {
    scenario: "At what angle does a projectile achieve maximum range?",
    v0: 20,
    angleDeg: 45,
    type: "law",
    answers: ["90°", "30°", "45°", "60°"],
    correct: 2,
    explanation: "Maximum range occurs at 45° because sin(2×45°) = sin90° = 1 (maximum)."
  },
  {
    scenario: "Circular motion: satellite orbits at r = 6800 km, v = 7.8 km/s. Centripetal acceleration?",
    v0: 7800,
    angleDeg: 0,
    type: "law",
    answers: ["8.9 m/s²", "12 m/s²", "4.5 m/s²", "15 m/s²"],
    correct: 0,
    explanation: "ac = v²/r = 7800²/6800000 ≈ 8.9 m/s²"
  },
  {
    scenario: "A rocket with thrust 50000 N and mass 2000 kg. Find net acceleration.",
    v0: 0,
    angleDeg: 90,
    type: "law",
    answers: ["25 m/s²", "15.2 m/s²", "35 m/s²", "10 m/s²"],
    correct: 1,
    explanation: "Net F = 50000 - 2000×9.8 = 30400 N. a = 30400/2000 = 15.2 m/s²"
  }
];
const D3_PROBLEMS = [
  {
    scenario: "Simple harmonic motion: T = 2π√(L/g). A 1m pendulum period = ?",
    v0: 0,
    angleDeg: 0,
    type: "time",
    answers: ["2.01 s", "1.58 s", "3.14 s", "4.44 s"],
    correct: 0,
    explanation: "T = 2π√(1/9.8) = 2π×0.319 = 2.01 s"
  },
  {
    scenario: "A spring (k=200 N/m) is compressed 0.1m. Elastic PE stored?",
    v0: 0,
    angleDeg: 0,
    type: "law",
    answers: ["1 J", "10 J", "2 J", "20 J"],
    correct: 0,
    explanation: "PE = ½kx² = 0.5×200×0.01 = 1 J"
  },
  {
    scenario: "Orbital mechanics: Double the orbital radius. Orbital period changes by factor?",
    v0: 0,
    angleDeg: 0,
    type: "law",
    answers: ["2√2 (Kepler's 3rd law)", "2", "4", "√2"],
    correct: 0,
    explanation: "T² ∝ r³. If r doubles: T² increases by 8, so T increases by 2√2."
  }
];
const FORCE_DIAGRAMS = [
  {
    description: "A book rests on a table. Weight = 10 N downward. Table exerts normal force upward.",
    forces: "Weight: 10 N down | Normal: 10 N up",
    lawApplied: "Newton's 1st Law",
    question: "What is the net force on the book?",
    answers: ["10 N downward", "0 N (balanced)", "20 N upward", "10 N upward"],
    correct: 1,
    explanation: "Equal and opposite forces cancel out. Net force = 0. Object stays still."
  },
  {
    description: "A car accelerates. Engine provides 5000 N forward. Air resistance = 1000 N backward.",
    forces: "Thrust: 5000 N forward | Drag: 1000 N backward",
    lawApplied: "Newton's 2nd Law",
    question: "What is the net force on the car?",
    answers: [
      "6000 N forward",
      "4000 N forward",
      "1000 N backward",
      "5000 N forward"
    ],
    correct: 1,
    explanation: "Net force = 5000 - 1000 = 4000 N forward. F=ma causes acceleration."
  },
  {
    description: "Rocket in space. Thrust = 20000 N upward. Gravity = 15000 N downward.",
    forces: "Thrust: 20000 N up | Weight: 15000 N down",
    lawApplied: "Newton's 2nd Law",
    question: "Net force direction and magnitude?",
    answers: [
      "5000 N upward",
      "35000 N upward",
      "5000 N downward",
      "15000 N upward"
    ],
    correct: 0,
    explanation: "Net F = 20000 - 15000 = 5000 N upward. Rocket accelerates upward."
  },
  {
    description: "A parachutist reaches terminal velocity. Weight = 800 N down. Air drag = 800 N up.",
    forces: "Weight: 800 N down | Drag: 800 N up",
    lawApplied: "Newton's 1st Law",
    question: "At terminal velocity, what is the parachutist's acceleration?",
    answers: [
      "9.8 m/s² down",
      "0 (constant velocity)",
      "Increasing downward",
      "Decreasing to zero"
    ],
    correct: 1,
    explanation: "Balanced forces = zero net force = zero acceleration = constant velocity."
  },
  {
    description: "Block on frictionless surface. Two people push: Person A = 30 N right, Person B = 10 N left.",
    forces: "A: 30 N right | B: 10 N left",
    lawApplied: "Newton's 2nd Law",
    question: "If block mass is 5 kg, what is the acceleration?",
    answers: ["4 m/s² right", "8 m/s² right", "6 m/s² right", "2 m/s² right"],
    correct: 0,
    explanation: "Net F = 30 - 10 = 20 N right. a = F/m = 20/5 = 4 m/s² right."
  },
  {
    description: "An object floats in water. Weight = 50 N down. Upthrust (buoyancy) = 50 N up.",
    forces: "Weight: 50 N down | Buoyancy: 50 N up",
    lawApplied: "Newton's 1st Law",
    question: "This illustrates which of Archimedes' findings?",
    answers: [
      "Pressure increases with depth",
      "Upthrust equals weight of displaced fluid",
      "All objects sink eventually",
      "Buoyancy depends on speed"
    ],
    correct: 1,
    explanation: "Archimedes' principle: upthrust equals weight of displaced fluid, allowing objects to float."
  },
  {
    description: "A ball is thrown upward. At its highest point, only gravity acts (g = 9.8 m/s²).",
    forces: "Gravity: 9.8 m/s² downward",
    lawApplied: "Newton's 2nd Law",
    question: "What is the ball's velocity at its highest point?",
    answers: [
      "9.8 m/s upward",
      "9.8 m/s downward",
      "0 m/s momentarily",
      "Depends on initial speed"
    ],
    correct: 2,
    explanation: "At maximum height, vertical velocity = 0 momentarily before reversing direction."
  },
  {
    description: "Elevator accelerates upward. Normal force from floor = 900 N. Person's weight = 700 N.",
    forces: "Normal: 900 N up | Weight: 700 N down",
    lawApplied: "Newton's 2nd Law",
    question: "The person feels heavier because the net force is:",
    answers: [
      "200 N upward (causes upward acceleration)",
      "200 N downward",
      "700 N upward",
      "0 N"
    ],
    correct: 0,
    explanation: "Net force = 900 - 700 = 200 N upward. This causes acceleration upward, making person feel heavier."
  },
  {
    description: "Two magnets repel. Magnet A exerts 5 N on Magnet B to the right.",
    forces: "A on B: 5 N right | B on A: ? N left",
    lawApplied: "Newton's 3rd Law",
    question: "What force does Magnet B exert on Magnet A?",
    answers: ["2.5 N left", "10 N left", "5 N left", "0 N"],
    correct: 2,
    explanation: "Newton's 3rd Law: every action has an equal and opposite reaction. B exerts 5 N left on A."
  },
  {
    description: "A 2 kg object on a 15° frictionless ramp. Component of gravity along ramp = mg sin15°.",
    forces: "Weight component down ramp: mg sin15° | Normal: mg cos15°",
    lawApplied: "Newton's 2nd Law",
    question: "Acceleration down the ramp (g = 9.8 m/s²)?",
    answers: ["2.54 m/s²", "9.8 m/s²", "4.9 m/s²", "1.27 m/s²"],
    correct: 0,
    explanation: "a = g sin15° = 9.8 × 0.259 = 2.54 m/s² down the ramp."
  },
  {
    description: "An object in circular motion. Centripetal force points toward the center.",
    forces: "Centripetal force: inward | Velocity: tangential",
    lawApplied: "Newton's 1st Law (modified)",
    question: "If the string breaks, which direction does the object fly?",
    answers: [
      "Inward toward center",
      "Outward away from center",
      "Tangentially in a straight line",
      "Stops immediately"
    ],
    correct: 2,
    explanation: "Without centripetal force, object continues in a straight tangential line (Newton's 1st Law)."
  },
  {
    description: "Free-falling feather and hammer on the Moon (no air). Released from same height.",
    forces: "Only gravity acts | No air resistance",
    lawApplied: "Newton's 2nd Law (gravity)",
    question: "Which hits the ground first on the Moon?",
    answers: [
      "Hammer (heavier)",
      "Feather (lighter)",
      "They hit at exactly the same time",
      "Depends on shape"
    ],
    correct: 2,
    explanation: "In a vacuum, all objects fall at the same rate regardless of mass (demonstrated by Apollo 15)."
  }
];
const COLLISION_QUESTIONS = [
  {
    description: "Two billiard balls collide head-on. Ball A (1 kg) moving at 4 m/s hits Ball B (1 kg) at rest.",
    m1: 1,
    v1: 4,
    m2: 1,
    v2: 0,
    collisionType: "Elastic",
    question: "Total momentum before collision (p = mv)?",
    answers: ["0 kg·m/s", "4 kg·m/s", "8 kg·m/s", "2 kg·m/s"],
    correct: 1,
    explanation: "p = m1v1 + m2v2 = 1×4 + 1×0 = 4 kg·m/s. Momentum is conserved."
  },
  {
    description: "Two clay balls (2 kg each) stick together after collision. Ball A: 6 m/s, Ball B: 0 m/s.",
    m1: 2,
    v1: 6,
    m2: 2,
    v2: 0,
    collisionType: "Perfectly Inelastic",
    question: "What is the combined velocity after collision?",
    answers: ["6 m/s", "3 m/s", "12 m/s", "0 m/s"],
    correct: 1,
    explanation: "Momentum conserved: (2×6 + 2×0) = 4×v. v = 12/4 = 3 m/s."
  },
  {
    description: "Cart A (5 kg) at 4 m/s collides with Cart B (3 kg) at -2 m/s (opposite direction).",
    m1: 5,
    v1: 4,
    m2: 3,
    v2: -2,
    collisionType: "Head-on",
    question: "Total momentum of the system?",
    answers: ["26 kg·m/s", "14 kg·m/s", "20 kg·m/s", "8 kg·m/s"],
    correct: 1,
    explanation: "p = 5×4 + 3×(-2) = 20 - 6 = 14 kg·m/s."
  },
  {
    description: "A 0.5 kg ball moving at 10 m/s is caught by a 4.5 kg player standing still.",
    m1: 0.5,
    v1: 10,
    m2: 4.5,
    v2: 0,
    collisionType: "Inelastic (catch)",
    question: "What is the player's velocity after catching the ball?",
    answers: ["1 m/s", "5 m/s", "10 m/s", "0.5 m/s"],
    correct: 0,
    explanation: "0.5×10 = 5×v. v = 5/5 = 1 m/s. Momentum conserved."
  },
  {
    description: "Rocket of mass 1000 kg ejects 100 kg of gas at 500 m/s backward.",
    m1: 1e3,
    v1: 0,
    m2: 100,
    v2: -500,
    collisionType: "Explosion",
    question: "What is the rocket's velocity after ejection (momentum conservation)?",
    answers: [
      "50 m/s forward",
      "500 m/s forward",
      "100 m/s forward",
      "25 m/s forward"
    ],
    correct: 0,
    explanation: "0 = 900×v + 100×(-500). 900v = 50000. v = 50000/900 ≈ 50 m/s forward."
  },
  {
    description: "A 3 kg object moves at 8 m/s. Calculate its momentum.",
    m1: 3,
    v1: 8,
    m2: 0,
    v2: 0,
    collisionType: "Single Object",
    question: "Momentum of the object?",
    answers: ["11 kg·m/s", "24 kg·m/s", "2.67 kg·m/s", "8 kg·m/s"],
    correct: 1,
    explanation: "p = mv = 3 × 8 = 24 kg·m/s."
  },
  {
    description: "A truck (10000 kg) at 20 m/s and a car (1000 kg) at 30 m/s collide and stick.",
    m1: 1e4,
    v1: 20,
    m2: 1e3,
    v2: 30,
    collisionType: "Perfectly Inelastic",
    question: "Combined velocity after collision (same direction)?",
    answers: ["20.9 m/s", "25 m/s", "50 m/s", "22.7 m/s"],
    correct: 0,
    explanation: "p = 10000×20 + 1000×30 = 230000. v = 230000/11000 ≈ 20.9 m/s."
  },
  {
    description: "Impulse: A force of 200 N acts for 0.05 s on an object.",
    m1: 0,
    v1: 0,
    m2: 0,
    v2: 0,
    collisionType: "Impulse",
    question: "What is the impulse (change in momentum)?",
    answers: ["10 N·s", "4000 N·s", "250 N·s", "200 N·s"],
    correct: 0,
    explanation: "Impulse = F × t = 200 × 0.05 = 10 N·s = change in momentum."
  },
  {
    description: "Two astronauts (80 kg each) in space. They push off each other from rest.",
    m1: 80,
    v1: 0,
    m2: 80,
    v2: 0,
    collisionType: "Explosion from rest",
    question: "If Astronaut A moves at 2 m/s right, what is Astronaut B's velocity?",
    answers: ["2 m/s left", "0 m/s", "4 m/s left", "2 m/s right"],
    correct: 0,
    explanation: "Total initial momentum = 0. So 80×2 + 80×vB = 0. vB = -2 m/s (left)."
  },
  {
    description: "A 0.2 kg ball hits a wall at 15 m/s and rebounds at 12 m/s.",
    m1: 0.2,
    v1: 15,
    m2: 0,
    v2: 0,
    collisionType: "Elastic (wall)",
    question: "What is the change in momentum (magnitude)?",
    answers: ["0.6 kg·m/s", "5.4 kg·m/s", "3 kg·m/s", "2.4 kg·m/s"],
    correct: 1,
    explanation: "Δp = m(v2 - v1) = 0.2 × (12-(-15)) = 0.2 × 27 = 5.4 kg·m/s."
  }
];
function PhysicsMotion({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "force-balance")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ForceBalance, { config, onGameEnd });
  if (gameId === "momentum-arena")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MomentumArena, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectileLab, { config, onGameEnd });
}
function ProjectileLab({ config, onGameEnd }) {
  var _a, _b;
  const problems = config.difficulty === 1 ? D1_PROBLEMS : config.difficulty === 2 ? D2_PROBLEMS : D3_PROBLEMS;
  const [phase, setPhase] = reactExports.useState("start");
  const [pIdx, setPIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [selectedAnswer, setSelectedAnswer] = reactExports.useState(null);
  const [arcProgress, setArcProgress] = reactExports.useState(0);
  const animRef = reactExports.useRef(null);
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
      if (animRef.current) clearInterval(animRef.current);
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
  const currentP = problems[pIdx % problems.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  const progressBarStyle = { width: `${progressPct}%` };
  const angleRad = currentP.angleDeg * Math.PI / 180;
  const arcPoints = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19 * arcProgress;
    const px = 20 + t * 60;
    const py = 80 - t * Math.sin(angleRad) * 60 + t * t * 20;
    return { x: px, y: Math.max(5, Math.min(90, py)) };
  });
  const arcPathData = arcPoints.map((pt, i) => `${(i === 0 ? "M" : "L") + pt.x} ${pt.y}`).join(" ");
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    setArcProgress(0);
    startTimer();
    if (animRef.current) clearInterval(animRef.current);
    animRef.current = setInterval(() => {
      setArcProgress((p) => {
        if (p >= 1) return p;
        return p + 0.05;
      });
    }, 50);
  }
  function handleAnswer(idx) {
    if (flash !== "idle" || phase !== "playing") return;
    setSelectedAnswer(idx);
    setTotal((t) => t + 1);
    if (idx === currentP.correct) {
      const pts = config.difficulty * 250;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(currentP.explanation);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Incorrect. ${currentP.explanation}`);
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
      setSelectedAnswer(null);
      setArcProgress(0);
      const nextIdx = pIdx + 1;
      if (nextIdx >= problems.length) endGame(true);
      else {
        setPIdx(nextIdx);
        setPhase("playing");
        if (animRef.current) clearInterval(animRef.current);
        animRef.current = setInterval(() => {
          setArcProgress((p) => {
            if (p >= 1) return p;
            return p + 0.05;
          });
        }, 50);
      }
    }, 2e3);
  }
  const arcColor = flash === "correct" ? "#10b981" : flash === "wrong" ? "#f43f5e" : "#00f5ff";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "physics_motion.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#7c3aed" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            pIdx + 1,
            "/",
            problems.length
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
                style: progressBarStyle
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
                TrendingUp,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#7c3aed" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#7c3aed",
                    textShadow: "0 0 20px rgba(124,58,237,0.6)"
                  },
                  children: "Projectile Lab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Solve projectile and Newton's law problems. See the trajectory animated in real time." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "physics_motion.start_button",
                  children: "Launch Lab"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "glass rounded-xl border border-border/30 overflow-hidden",
              style: { height: 140 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  viewBox: "0 0 100 100",
                  className: "w-full h-full",
                  preserveAspectRatio: "none",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "0",
                        y1: "85",
                        x2: "100",
                        y2: "85",
                        stroke: "rgba(255,255,255,0.1)",
                        strokeWidth: "0.5"
                      }
                    ),
                    arcProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: arcPathData,
                        fill: "none",
                        stroke: arcColor,
                        strokeWidth: "1.5",
                        strokeDasharray: "2 1",
                        style: { filter: `drop-shadow(0 0 3px ${arcColor})` }
                      }
                    ),
                    arcProgress >= 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: ((_a = arcPoints[arcPoints.length - 1]) == null ? void 0 : _a.x) ?? 80,
                        cy: ((_b = arcPoints[arcPoints.length - 1]) == null ? void 0 : _b.y) ?? 80,
                        r: "2",
                        fill: arcColor,
                        style: { filter: `drop-shadow(0 0 4px ${arcColor})` }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "20",
                        cy: "80",
                        r: "2.5",
                        fill: "#f59e0b",
                        style: { filter: "drop-shadow(0 0 4px #f59e0b)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("text", { x: "22", y: "95", fontSize: "5", fill: "rgba(255,255,255,0.4)", children: [
                      currentP.v0,
                      "m/s@",
                      currentP.angleDeg,
                      "°"
                    ] })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
              className: `glass-card rounded-xl p-4 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-4 leading-relaxed", children: currentP.scenario }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentP.answers.map((ans, i) => {
                  let borderColor = "rgba(255,255,255,0.1)";
                  let bgColor = "transparent";
                  if (phase === "feedback") {
                    if (i === currentP.correct) {
                      borderColor = "#10b981";
                      bgColor = "rgba(16,185,129,0.15)";
                    } else if (i === selectedAnswer) {
                      borderColor = "#f43f5e";
                      bgColor = "rgba(244,63,94,0.15)";
                    }
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "px-3 py-2.5 rounded-lg border-2 text-sm text-left text-muted-foreground hover:border-[#7c3aed] hover:text-foreground transition-all",
                      style: { borderColor, background: bgColor },
                      onClick: () => handleAnswer(i),
                      "data-ocid": `physics_motion.answer.${i}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs mr-2 opacity-50", children: [
                          String.fromCharCode(65 + i),
                          "."
                        ] }),
                        ans
                      ]
                    },
                    `ans-${i}`
                  );
                }) })
              ]
            },
            pIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-xl px-4 py-2 text-xs ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`,
              children: feedbackMsg
            }
          )
        ] })
      ]
    }
  );
}
function ForceBalance({ config, onGameEnd }) {
  const totalQ = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 10 : 12;
  const diagrams = FORCE_DIAGRAMS.slice(0, totalQ);
  const [phase, setPhase] = reactExports.useState("start");
  const [dIdx, setDIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
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
  const current = diagrams[dIdx % diagrams.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleAnswer(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === current.correct) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${current.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${current.explanation}`);
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
      const next = dIdx + 1;
      if (next >= diagrams.length) endGame(true);
      else {
        setDIdx(next);
        setPhase("playing");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "force_balance.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            dIdx + 1,
            "/",
            diagrams.length
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
                Target,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#00f5ff" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#00f5ff",
                    textShadow: "0 0 20px rgba(0,245,255,0.6)"
                  },
                  children: "Force Balance"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Force diagrams showing objects with labeled forces. Identify net force, Newton's Law applied, and calculate acceleration or direction." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "force_balance.start_button",
                  children: "Begin Analysis"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs px-2 py-0.5 rounded font-bold",
                    style: { background: "#00f5ff20", color: "#00f5ff" },
                    children: current.lawApplied
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-3", children: current.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg p-3 border border-border/20 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Forces acting:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono", style: { color: "#00f5ff" }, children: current.forces })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: current.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: current.answers.map((ans, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "text-left px-4 py-2.5 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#00f5ff] hover:text-[#00f5ff] transition-all",
                    onClick: () => handleAnswer(i),
                    "data-ocid": `force_balance.answer.${i}`,
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
            },
            dIdx
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
function MomentumArena({ config, onGameEnd }) {
  const totalQ = config.difficulty === 1 ? 6 : config.difficulty === 2 ? 8 : 10;
  const questions = COLLISION_QUESTIONS.slice(0, totalQ);
  const [phase, setPhase] = reactExports.useState("start");
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
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
  const current = questions[qIdx % questions.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleAnswer(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === current.correct) {
      const pts = config.difficulty * 250;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${current.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${current.explanation}`);
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
      if (next >= questions.length) endGame(true);
      else {
        setQIdx(next);
        setPhase("playing");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "momentum_arena.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#a855f7" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
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
                TrendingUp,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#a855f7" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#a855f7",
                    textShadow: "0 0 20px rgba(168,85,247,0.6)"
                  },
                  children: "Momentum Arena"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Collision scenarios are presented. Calculate momentum, verify conservation laws, and determine post-collision velocities." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "momentum_arena.start_button",
                  children: "Begin Collisions"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs px-2 py-0.5 rounded",
                    style: {
                      background: "#a855f720",
                      color: "#a855f7",
                      fontFamily: "'Orbitron',sans-serif"
                    },
                    children: current.collisionType
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-3", children: current.description }),
                (current.m1 > 0 || current.m2 > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg p-3 border border-border/20 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    current.m1 > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Object 1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-sm font-mono",
                          style: { color: "#a855f7" },
                          children: [
                            "m=",
                            current.m1,
                            "kg, v=",
                            current.v1,
                            "m/s"
                          ]
                        }
                      )
                    ] }),
                    current.m2 > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Object 2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-sm font-mono",
                          style: { color: "#06b6d4" },
                          children: [
                            "m=",
                            current.m2,
                            "kg, v=",
                            current.v2,
                            "m/s"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "p = mv | Conservation: p_before = p_after" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: current.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: current.answers.map((ans, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#a855f7] hover:text-[#a855f7] transition-all font-mono",
                    onClick: () => handleAnswer(i),
                    "data-ocid": `momentum_arena.answer.${i}`,
                    children: ans
                  },
                  `ans-${i}`
                )) })
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
export {
  PhysicsMotion as default
};
