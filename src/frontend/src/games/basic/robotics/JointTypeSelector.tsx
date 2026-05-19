import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

interface JointQuestion {
  scenario: string;
  movement: string;
  options: string[];
  correct: number;
  explanation: string;
}

const ALL_QUESTIONS: JointQuestion[] = [
  {
    scenario: "A robot elbow needs to bend forward and backward in one plane.",
    movement: "Flexion / Extension",
    options: ["Revolute (R)", "Prismatic (P)", "Spherical (S)", "Helical (H)"],
    correct: 0,
    explanation:
      "Revolute joints provide single-axis rotation — ideal for bending motions.",
  },
  {
    scenario:
      "A gripper finger needs to slide in and out to grip objects of different sizes.",
    movement: "Linear Grip Adjustment",
    options: ["Spherical (S)", "Prismatic (P)", "Revolute (R)", "Planar (F)"],
    correct: 1,
    explanation: "Prismatic joints allow linear sliding motion along one axis.",
  },
  {
    scenario:
      "A robot shoulder must rotate freely in all directions like a ball-and-socket.",
    movement: "Omni-directional Rotation",
    options: ["Revolute (R)", "Cylindrical (C)", "Spherical (S)", "Planar (F)"],
    correct: 2,
    explanation:
      "Spherical joints allow rotation around 3 axes — 3 degrees of freedom.",
  },
  {
    scenario:
      "A robotic conveyor arm must slide forward and also spin to orient packages.",
    movement: "Translate + Rotate on Same Axis",
    options: [
      "Prismatic (P)",
      "Cylindrical (C)",
      "Revolute (R)",
      "Spherical (S)",
    ],
    correct: 1,
    explanation:
      "Cylindrical joints combine prismatic (slide) and revolute (rotate) on the same axis.",
  },
  {
    scenario:
      "A robot wrist must twist like a screwdriver to install fasteners.",
    movement: "Screw / Helical Motion",
    options: [
      "Revolute (R)",
      "Prismatic (P)",
      "Helical (H)",
      "Cylindrical (C)",
    ],
    correct: 2,
    explanation:
      "Helical joints couple rotation with linear motion along the same axis.",
  },
  {
    scenario:
      "An XY gantry plotter needs to move in a flat 2D plane in any direction.",
    movement: "2D Planar Translation",
    options: ["Spherical (S)", "Revolute (R)", "Planar (F)", "Prismatic (P)"],
    correct: 2,
    explanation:
      "Planar joints allow translation in 2 axes and rotation in the plane.",
  },
  {
    scenario:
      "A 6-DOF industrial arm needs its wrist to orient a tool in any direction.",
    movement: "Full 3D Orientation",
    options: [
      "Cylindrical (C)",
      "Revolute (R)",
      "Helical (H)",
      "Spherical (S)",
    ],
    correct: 3,
    explanation:
      "Spherical joints with 3 revolute axes give full 3D orientation control.",
  },
  {
    scenario:
      "A knee joint in a walking robot must absorb impact while bending.",
    movement: "Single-Axis Bend with Load",
    options: ["Revolute (R)", "Prismatic (P)", "Planar (F)", "Helical (H)"],
    correct: 0,
    explanation:
      "Revolute joints in the sagittal plane match knee biomechanics.",
  },
  {
    scenario: "A telescoping arm needs to extend and retract its reach.",
    movement: "Linear Extension / Retraction",
    options: ["Revolute (R)", "Spherical (S)", "Prismatic (P)", "Planar (F)"],
    correct: 2,
    explanation: "Prismatic joints provide the required linear sliding motion.",
  },
  {
    scenario:
      "A pan-tilt camera mount must rotate left-right and tilt up-down independently.",
    movement: "2-Axis Pan + Tilt",
    options: [
      "Two Revolute Joints",
      "One Spherical Joint",
      "One Cylindrical Joint",
      "One Planar Joint",
    ],
    correct: 0,
    explanation:
      "Two revolute joints (one per axis) give independent pan and tilt control.",
  },
];

export default function JointTypeSelector({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 10;
  const questions = ALL_QUESTIONS.slice(0, count);
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current !== "playing") return;
      setPhase("idle");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          questions.length > 0
            ? (correctRef.current / questions.length) * 100
            : 0,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd, questions.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function startGame() {
    startRef.current = Date.now();
    setPhase("playing");
    startTimer();
  }

  function handleAnswer(i: number) {
    if (revealed) return;
    const q = questions[idx];
    setChosen(i);
    setRevealed(true);
    if (i === q.correct) {
      const pts = 250 * config.difficulty + timeLeft * 3;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      if (idx + 1 >= questions.length) {
        endGame(true);
        return;
      }
      setIdx((i) => i + 1);
      setChosen(null);
      setRevealed(false);
    }, 1800);
  }

  const q = questions[idx];
  const pct = (timeLeft / config.timeLimit) * 100;
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="joint_type.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#e879f9] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Joint Type Selector
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read each movement requirement and select the correct robotic joint
            type.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 text-white"
            style={{ background: "#e879f9" }}
            data-ocid="joint_type.start_button"
          >
            Select Joints
          </button>
        </motion.div>
      )}
      {phase === "playing" && q && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#e879f9]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {idx + 1}/{questions.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="rounded-xl border border-[#e879f9]/30 bg-card/40 p-4">
                <p className="text-xs uppercase tracking-widest text-[#e879f9] mb-2">
                  Movement Requirement
                </p>
                <p className="text-sm text-foreground/90 mb-2">{q.scenario}</p>
                <div className="inline-block px-2 py-1 rounded bg-[#e879f9]/10 border border-[#e879f9]/30 text-xs text-[#e879f9]">
                  {q.movement}
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Which joint type fits this requirement?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  let cls =
                    "border-border/30 bg-card/60 hover:border-[#e879f9]/50";
                  if (revealed && i === q.correct)
                    cls = "border-[#10b981] bg-[#10b981]/10";
                  else if (revealed && i === chosen && i !== q.correct)
                    cls = "border-[#f43f5e] bg-[#f43f5e]/10";
                  return (
                    <button
                      key={`o-${i}`}
                      type="button"
                      onClick={() => handleAnswer(i)}
                      disabled={revealed}
                      className={`px-3 py-3 rounded-xl border-2 font-bold text-sm transition-all ${cls} disabled:cursor-not-allowed`}
                      data-ocid={`joint_type.option.${i + 1}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-[#e879f9]/20 bg-[#e879f9]/5 p-3 text-xs text-muted-foreground"
                >
                  <span
                    className="font-bold"
                    style={{
                      color: chosen === q.correct ? "#10b981" : "#f43f5e",
                    }}
                  >
                    {chosen === q.correct ? "Correct! " : "Incorrect. "}
                  </span>
                  {q.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
