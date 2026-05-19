import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Cpu, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

// ─── Game 1: System Integration ──────────────────────────────────────────────

type WheelType = "rubber_track" | "mecanum" | "differential";
type MotorPlacement = "rear_drive" | "front_drive" | "all_wheel";
type SensorWiring = "correct" | "reversed" | "missing_ground";
type ControlBlock =
  | "read_sensor"
  | "compare_threshold"
  | "activate_motor"
  | "wait_delay"
  | "stop_motor";

interface MechatronicChallenge {
  id: string;
  title: string;
  robotType: string;
  description: string;
  mechanical: {
    question: string;
    correctWheel: WheelType;
    correctMotor: MotorPlacement;
    wheelOptions: WheelType[];
    motorOptions: MotorPlacement[];
  };
  electrical: {
    question: string;
    components: Array<{ id: string; label: string; color: string }>;
    correctWiring: SensorWiring;
    wiringOptions: Array<{
      id: SensorWiring;
      label: string;
      description: string;
    }>;
  };
  software: {
    question: string;
    correctSequence: ControlBlock[];
    availableBlocks: ControlBlock[];
  };
  explanation: string;
}

const BLOCK_LABELS: Record<ControlBlock, string> = {
  read_sensor: "READ sensor value",
  compare_threshold: "COMPARE to threshold",
  activate_motor: "ACTIVATE motor",
  wait_delay: "WAIT 10ms",
  stop_motor: "STOP motor",
};
const BLOCK_COLORS: Record<ControlBlock, string> = {
  read_sensor: "#00f5ff",
  compare_threshold: "#7c3aed",
  activate_motor: "#10b981",
  wait_delay: "#f59e0b",
  stop_motor: "#f43f5e",
};
const WHEEL_LABELS: Record<WheelType, string> = {
  rubber_track: "Rubber Tracks",
  mecanum: "Mecanum Wheels",
  differential: "Differential Drive",
};
const MOTOR_LABELS: Record<MotorPlacement, string> = {
  rear_drive: "Rear-Wheel Drive",
  front_drive: "Front-Wheel Drive",
  all_wheel: "All-Wheel Drive",
};

const INTEGRATION_CHALLENGES: Record<1 | 2 | 3, MechatronicChallenge[]> = {
  1: [
    {
      id: "c1",
      title: "Line-Following Robot",
      robotType: "Autonomous Navigator",
      description:
        "Build a robot that follows a black line on white surface using an IR sensor.",
      mechanical: {
        question:
          "Which wheel type allows smooth continuous motion on flat surfaces for line following?",
        correctWheel: "differential",
        correctMotor: "rear_drive",
        wheelOptions: ["rubber_track", "mecanum", "differential"],
        motorOptions: ["rear_drive", "front_drive", "all_wheel"],
      },
      electrical: {
        question:
          "Connect the IR line sensor correctly to the microcontroller.",
        components: [
          { id: "sensor", label: "IR Sensor", color: "#00f5ff" },
          { id: "controller", label: "Microcontroller", color: "#7c3aed" },
          { id: "motor_driver", label: "Motor Driver", color: "#10b981" },
        ],
        correctWiring: "correct",
        wiringOptions: [
          {
            id: "correct",
            label: "VCC to Sensor to Signal to MCU to GND",
            description:
              "Correct: Power, signal to MCU analog input, ground complete",
          },
          {
            id: "reversed",
            label: "GND to Sensor to Signal to MCU to VCC",
            description: "Wrong: Reversed power destroys sensor",
          },
          {
            id: "missing_ground",
            label: "VCC to Sensor to Signal to MCU (no GND)",
            description: "Wrong: Floating ground causes erratic readings",
          },
        ],
      },
      software: {
        question:
          "Arrange control blocks in the correct order for line-following logic.",
        correctSequence: [
          "read_sensor",
          "compare_threshold",
          "activate_motor",
          "wait_delay",
        ],
        availableBlocks: [
          "wait_delay",
          "activate_motor",
          "compare_threshold",
          "read_sensor",
          "stop_motor",
        ],
      },
      explanation:
        "Differential drive for steering, rear motors for push, correct IR wiring, then read to compare to act to wait loop.",
    },
  ],
  2: [
    {
      id: "c2",
      title: "Obstacle Avoidance Robot",
      robotType: "Autonomous Explorer",
      description:
        "Design a robot that detects obstacles with ultrasonic sensor and avoids them.",
      mechanical: {
        question:
          "Which wheel configuration allows the robot to turn in place to avoid obstacles?",
        correctWheel: "mecanum",
        correctMotor: "all_wheel",
        wheelOptions: ["rubber_track", "mecanum", "differential"],
        motorOptions: ["rear_drive", "front_drive", "all_wheel"],
      },
      electrical: {
        question: "Wire the HC-SR04 ultrasonic sensor properly.",
        components: [
          { id: "ultrasonic", label: "HC-SR04 Sensor", color: "#00f5ff" },
          { id: "controller", label: "Arduino MCU", color: "#7c3aed" },
          { id: "motor_driver", label: "L298N Driver", color: "#10b981" },
        ],
        correctWiring: "correct",
        wiringOptions: [
          {
            id: "correct",
            label: "VCC(5V) Trig MCU Echo MCU GND",
            description:
              "Correct: Trig pin sends pulse, Echo pin receives return",
          },
          {
            id: "reversed",
            label: "Echo to Trig then Trig to Echo",
            description: "Wrong: Swapped pins — sensor won't trigger",
          },
          {
            id: "missing_ground",
            label: "VCC and Trig only",
            description: "Wrong: Missing Echo pin means no distance reading",
          },
        ],
      },
      software: {
        question:
          "What is the correct control loop order for obstacle avoidance?",
        correctSequence: [
          "read_sensor",
          "compare_threshold",
          "activate_motor",
          "wait_delay",
        ],
        availableBlocks: [
          "activate_motor",
          "stop_motor",
          "read_sensor",
          "compare_threshold",
          "wait_delay",
        ],
      },
      explanation:
        "Mecanum wheels for omnidirectional turns, all-wheel for power, correct HC-SR04 wiring, read to compare to react loop.",
    },
  ],
  3: [
    {
      id: "c3",
      title: "Automated Sorting Robot",
      robotType: "Industrial Manipulator",
      description:
        "Build a robot arm system that detects object color and sorts into bins.",
      mechanical: {
        question:
          "For heavy industrial sorting with high precision, which drive and wheel combination is ideal?",
        correctWheel: "rubber_track",
        correctMotor: "all_wheel",
        wheelOptions: ["rubber_track", "mecanum", "differential"],
        motorOptions: ["rear_drive", "front_drive", "all_wheel"],
      },
      electrical: {
        question: "Wire the color sensor and servo motor controller correctly.",
        components: [
          {
            id: "color_sensor",
            label: "TCS3200 Color Sensor",
            color: "#00f5ff",
          },
          { id: "servo_ctrl", label: "PCA9685 Servo Driver", color: "#7c3aed" },
          { id: "controller", label: "Raspberry Pi", color: "#10b981" },
        ],
        correctWiring: "correct",
        wiringOptions: [
          {
            id: "correct",
            label: "I2C: SDA/SCL to Pi to PCA9685 to Servos",
            description:
              "Correct: I2C bus with pull-up resistors, proper servo power",
          },
          {
            id: "reversed",
            label: "Direct GPIO to Servo (no driver)",
            description:
              "Wrong: GPIO can't supply servo current — causes MCU damage",
          },
          {
            id: "missing_ground",
            label: "I2C without common ground",
            description: "Wrong: I2C requires common ground reference",
          },
        ],
      },
      software: {
        question: "Correct logic flow for color-based sorting?",
        correctSequence: [
          "read_sensor",
          "compare_threshold",
          "activate_motor",
          "wait_delay",
          "stop_motor",
        ],
        availableBlocks: [
          "stop_motor",
          "wait_delay",
          "compare_threshold",
          "read_sensor",
          "activate_motor",
        ],
      },
      explanation:
        "Rubber tracks for stability, all-wheel for power, I2C wiring for servo control, complete read to compare to act to wait to stop cycle.",
    },
  ],
};

type Phase = "mechanical" | "electrical" | "software";

function SystemIntegrationGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const challenges = INTEGRATION_CHALLENGES[config.difficulty];
  const [challengeIdx, setChallengeIdx] = useState(0);
  const challenge = challenges[challengeIdx];
  const [phase, setPhase] = useState<Phase>("mechanical");
  const [selectedWheel, setSelectedWheel] = useState<WheelType | null>(null);
  const [selectedMotor, setSelectedMotor] = useState<MotorPlacement | null>(
    null,
  );
  const [selectedWiring, setSelectedWiring] = useState<SensorWiring | null>(
    null,
  );
  const [softwareBlocks, setSoftwareBlocks] = useState<ControlBlock[]>([]);
  const [mechanicalResult, setMechanicalResult] = useState<boolean | null>(
    null,
  );
  const [electricalResult, setElectricalResult] = useState<boolean | null>(
    null,
  );
  const [softwareResult, setSoftwareResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [_systemTestPassed, setSystemTestPassed] = useState(false);
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
          (correct / challenges.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, challenges.length],
  );

  function handleMechanicalSubmit() {
    const ok =
      selectedWheel === challenge.mechanical.correctWheel &&
      selectedMotor === challenge.mechanical.correctMotor;
    setMechanicalResult(ok);
    if (ok) {
      setScore((s) => s + 120 * config.difficulty);
      setTimeout(() => setPhase("electrical"), 1200);
    } else {
      setTimeout(() => {
        setMechanicalResult(null);
        setSelectedWheel(null);
        setSelectedMotor(null);
      }, 1500);
    }
  }
  function handleElectricalSubmit() {
    const ok = selectedWiring === challenge.electrical.correctWiring;
    setElectricalResult(ok);
    if (ok) {
      setScore((s) => s + 120 * config.difficulty);
      setTimeout(() => setPhase("software"), 1200);
    } else {
      setTimeout(() => {
        setElectricalResult(null);
        setSelectedWiring(null);
      }, 1500);
    }
  }
  function toggleSoftwareBlock(block: ControlBlock) {
    setSoftwareBlocks((prev) =>
      prev.includes(block) ? prev.filter((b) => b !== block) : [...prev, block],
    );
  }
  function handleSoftwareSubmit() {
    const correct_seq = challenge.software.correctSequence;
    const ok =
      softwareBlocks.length === correct_seq.length &&
      softwareBlocks.every((b, i) => b === correct_seq[i]);
    setSoftwareResult(ok);
    if (ok) {
      setScore((s) => s + 160 * config.difficulty);
      setSystemTestPassed(true);
      setCorrect((c) => c + 1);
      setTimeout(() => {
        const next = challengeIdx + 1;
        if (next >= challenges.length) {
          endGame(true);
        } else {
          setChallengeIdx(next);
          setPhase("mechanical");
          setSelectedWheel(null);
          setSelectedMotor(null);
          setSelectedWiring(null);
          setSoftwareBlocks([]);
          setMechanicalResult(null);
          setElectricalResult(null);
          setSoftwareResult(null);
          setSystemTestPassed(false);
        }
      }, 2400);
    } else {
      setTimeout(() => {
        setSoftwareResult(null);
        setSoftwareBlocks([]);
      }, 1800);
    }
  }

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="mechatronics.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Cpu
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#e879f9" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#e879f9" }}
          >
            System Integration Challenge
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Mechatronics = Mechanical + Electrical + Software. Configure all
            three domains correctly for each robot challenge.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            All three must be correct for the system test to pass.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="mechatronics.start_button"
          >
            Begin Integration
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  const phases: Phase[] = ["mechanical", "electrical", "software"];
  const phaseColors: Record<Phase, string> = {
    mechanical: "#f59e0b",
    electrical: "#00f5ff",
    software: "#10b981",
  };
  const phaseLabels: Record<Phase, string> = {
    mechanical: "MECHANICAL",
    electrical: "ELECTRICAL",
    software: "SOFTWARE",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="mechatronics.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#e879f9" }}>
          <Cpu className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          {phases.map((p) => (
            <div key={p} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    p === phase
                      ? phaseColors[p]
                      : phases.indexOf(p) < phases.indexOf(phase)
                        ? "#10b981"
                        : "#374151",
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: p === phase ? phaseColors[p] : "#6b7280",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px",
                }}
              >
                {phaseLabels[p]}
              </span>
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {challengeIdx + 1}/{challenges.length}
        </span>
      </div>
      <div className="glass-card rounded-xl p-3 shrink-0 border border-[#e879f9]/30">
        <p
          className="text-xs font-bold"
          style={{ color: "#e879f9", fontFamily: "'Orbitron', sans-serif" }}
        >
          {challenge.robotType}
        </p>
        <p className="text-sm text-foreground">
          {challenge.title}: {challenge.description}
        </p>
      </div>
      <AnimatePresence mode="wait">
        {phase === "mechanical" && (
          <motion.div
            key="mechanical"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col gap-3"
          >
            <div
              className="glass-card rounded-xl p-3 shrink-0 border-l-4"
              style={{ borderLeftColor: "#f59e0b" }}
            >
              <p
                className="text-xs font-bold text-[#f59e0b] mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                MECHANICAL DOMAIN
              </p>
              <p className="text-sm">{challenge.mechanical.question}</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div>
                <p
                  className="text-xs text-muted-foreground mb-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  WHEEL TYPE
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {challenge.mechanical.wheelOptions.map((w) => (
                    <motion.button
                      type="button"
                      key={w}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedWheel(w)}
                      className="rounded-xl border-2 p-3 text-xs font-bold transition-all"
                      style={{
                        borderColor:
                          selectedWheel === w ? "#f59e0b" : "#374151",
                        backgroundColor:
                          selectedWheel === w ? "#f59e0b20" : "transparent",
                        color: selectedWheel === w ? "#f59e0b" : "#94a3b8",
                      }}
                      data-ocid={`mechatronics.wheel.${w}`}
                    >
                      {WHEEL_LABELS[w]}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <p
                  className="text-xs text-muted-foreground mb-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  MOTOR PLACEMENT
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {challenge.mechanical.motorOptions.map((m) => (
                    <motion.button
                      type="button"
                      key={m}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedMotor(m)}
                      className="rounded-xl border-2 p-3 text-xs font-bold transition-all"
                      style={{
                        borderColor:
                          selectedMotor === m ? "#f59e0b" : "#374151",
                        backgroundColor:
                          selectedMotor === m ? "#f59e0b20" : "transparent",
                        color: selectedMotor === m ? "#f59e0b" : "#94a3b8",
                      }}
                      data-ocid={`mechatronics.motor.${m}`}
                    >
                      {MOTOR_LABELS[m]}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <AnimatePresence>
              {mechanicalResult !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl p-2 border text-sm flex items-center gap-2 shrink-0 ${mechanicalResult ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                >
                  {mechanicalResult ? (
                    <CheckCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  {mechanicalResult
                    ? "Mechanical design correct. Advancing to electrical."
                    : "Incorrect combination. Review requirements and retry."}
                </motion.div>
              )}
            </AnimatePresence>
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleMechanicalSubmit}
              disabled={
                !selectedWheel || !selectedMotor || mechanicalResult !== null
              }
              data-ocid="mechatronics.mechanical_submit"
            >
              Confirm Mechanical Design
            </GlowButton>
          </motion.div>
        )}
        {phase === "electrical" && (
          <motion.div
            key="electrical"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col gap-3"
          >
            <div
              className="glass-card rounded-xl p-3 shrink-0 border-l-4"
              style={{ borderLeftColor: "#00f5ff" }}
            >
              <p
                className="text-xs font-bold text-[#00f5ff] mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                ELECTRICAL DOMAIN
              </p>
              <p className="text-sm">{challenge.electrical.question}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              {challenge.electrical.components.map((comp) => (
                <div
                  key={comp.id}
                  className="flex-1 rounded-xl border-2 p-3 text-xs text-center"
                  style={{
                    borderColor: `${comp.color}60`,
                    color: comp.color,
                    backgroundColor: `${comp.color}10`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center"
                    style={{
                      backgroundColor: `${comp.color}20`,
                      border: `2px solid ${comp.color}`,
                    }}
                  >
                    <Cpu className="h-4 w-4" style={{ color: comp.color }} />
                  </div>
                  <span className="font-bold" style={{ fontSize: "9px" }}>
                    {comp.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {challenge.electrical.wiringOptions.map((opt) => (
                <motion.button
                  type="button"
                  key={opt.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedWiring(opt.id)}
                  className="rounded-xl border-2 p-3 text-left transition-all"
                  style={{
                    borderColor:
                      selectedWiring === opt.id ? "#00f5ff" : "#374151",
                    backgroundColor:
                      selectedWiring === opt.id ? "#00f5ff15" : "transparent",
                  }}
                  data-ocid={`mechatronics.wiring.${opt.id}`}
                >
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: selectedWiring === opt.id ? "#00f5ff" : "#94a3b8",
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "10px",
                    }}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {electricalResult !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl p-2 border text-sm flex items-center gap-2 shrink-0 ${electricalResult ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                >
                  {electricalResult ? (
                    <CheckCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  {electricalResult
                    ? "Wiring correct. Advancing to software."
                    : "Wrong wiring diagram. This would damage components."}
                </motion.div>
              )}
            </AnimatePresence>
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleElectricalSubmit}
              disabled={!selectedWiring || electricalResult !== null}
              data-ocid="mechatronics.electrical_submit"
            >
              Confirm Wiring Diagram
            </GlowButton>
          </motion.div>
        )}
        {phase === "software" && (
          <motion.div
            key="software"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col gap-3"
          >
            <div
              className="glass-card rounded-xl p-3 shrink-0 border-l-4"
              style={{ borderLeftColor: "#10b981" }}
            >
              <p
                className="text-xs font-bold text-[#10b981] mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                SOFTWARE DOMAIN
              </p>
              <p className="text-sm">{challenge.software.question}</p>
            </div>
            <div className="shrink-0">
              <p
                className="text-xs text-muted-foreground mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                YOUR CONTROL SEQUENCE
              </p>
              <div className="flex flex-col gap-1">
                {softwareBlocks.map((block, i) => (
                  <motion.div
                    key={`${block}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    style={{
                      borderColor: `${BLOCK_COLORS[block]}60`,
                      backgroundColor: `${BLOCK_COLORS[block]}10`,
                    }}
                  >
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{
                        color: BLOCK_COLORS[block],
                        fontFamily: "'Orbitron', sans-serif",
                        minWidth: "16px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: BLOCK_COLORS[block] }}
                    >
                      {BLOCK_LABELS[block]}
                    </span>
                  </motion.div>
                ))}
                {softwareBlocks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border/40 px-3 py-2 text-xs text-muted-foreground">
                    Click blocks below to add them in order
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p
                className="text-xs text-muted-foreground mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                AVAILABLE BLOCKS
              </p>
              <div className="grid grid-cols-1 gap-1">
                {challenge.software.availableBlocks
                  .filter((b) => !softwareBlocks.includes(b))
                  .map((block) => (
                    <motion.button
                      type="button"
                      key={block}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleSoftwareBlock(block)}
                      className="rounded-lg border px-3 py-2 text-sm font-bold text-left transition-all"
                      style={{
                        borderColor: `${BLOCK_COLORS[block]}60`,
                        color: BLOCK_COLORS[block],
                        backgroundColor: `${BLOCK_COLORS[block]}08`,
                      }}
                      data-ocid={`mechatronics.block.${block}`}
                    >
                      {BLOCK_LABELS[block]}
                    </motion.button>
                  ))}
              </div>
            </div>
            <AnimatePresence>
              {softwareResult !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl p-2 border text-sm flex items-center gap-2 shrink-0 ${softwareResult ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                >
                  {softwareResult ? (
                    <CheckCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  {softwareResult
                    ? `SYSTEM TEST PASSED. ${challenge.explanation}`
                    : "Wrong logic sequence. Reset and try correct order."}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="shrink-0 flex gap-2 justify-end">
              <GlowButton
                variant="secondary"
                size="sm"
                onClick={() => setSoftwareBlocks([])}
                data-ocid="mechatronics.reset_blocks"
              >
                Reset
              </GlowButton>
              <GlowButton
                variant="primary"
                size="sm"
                onClick={handleSoftwareSubmit}
                disabled={
                  softwareBlocks.length <
                    challenge.software.correctSequence.length ||
                  softwareResult !== null
                }
                data-ocid="mechatronics.software_submit"
              >
                Run System Test
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Game 2: Feedback Control ───────────────────────────────────────────────

interface ControlSystem {
  name: string;
  unit: string;
  setpoint: number;
  initial: number;
  minPGain: number;
  maxPGain: number;
  optimalPGain: number;
  description: string;
  color: string;
}

const CONTROL_SYSTEMS: ControlSystem[] = [
  {
    name: "Room Thermostat",
    unit: "C",
    setpoint: 20,
    initial: 15,
    minPGain: 0.1,
    maxPGain: 5.0,
    optimalPGain: 1.5,
    description:
      "Heat room to setpoint. Too low P-gain = slow response. Too high = oscillation.",
    color: "#f59e0b",
  },
  {
    name: "Motor Speed",
    unit: "RPM",
    setpoint: 1000,
    initial: 0,
    minPGain: 0.1,
    maxPGain: 5.0,
    optimalPGain: 2.0,
    description:
      "Accelerate motor to 1000 RPM. High P-gain causes overshoot oscillations.",
    color: "#00f5ff",
  },
  {
    name: "Water Level",
    unit: "%",
    setpoint: 80,
    initial: 20,
    minPGain: 0.1,
    maxPGain: 5.0,
    optimalPGain: 1.2,
    description:
      "Fill tank to 80% capacity. Too aggressive = level overshoots and oscillates.",
    color: "#7c3aed",
  },
  {
    name: "Robot Arm Angle",
    unit: "deg",
    setpoint: 90,
    initial: 0,
    minPGain: 0.1,
    maxPGain: 5.0,
    optimalPGain: 1.8,
    description:
      "Move arm to 90 degree position. Precise P-gain needed for stable positioning.",
    color: "#10b981",
  },
  {
    name: "Conveyor Speed",
    unit: "m/s",
    setpoint: 2,
    initial: 0,
    minPGain: 0.1,
    maxPGain: 5.0,
    optimalPGain: 1.0,
    description:
      "Accelerate conveyor to 2 m/s. Low P-gain is often preferred for conveyor stability.",
    color: "#e879f9",
  },
];

function simulateStep(
  current: number,
  setpoint: number,
  pGain: number,
  dt: number,
): number {
  const error = setpoint - current;
  const output = pGain * error;
  return current + output * dt;
}

function generateResponseCurve(
  initial: number,
  setpoint: number,
  pGain: number,
): number[] {
  const points: number[] = [initial];
  let val = initial;
  for (let t = 0; t < 30; t++) {
    val = simulateStep(val, setpoint, pGain, 0.1);
    points.push(val);
  }
  return points;
}

function FeedbackControlGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const systemCount =
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [systemIdx, setSystemIdx] = useState(0);
  const system = CONTROL_SYSTEMS[systemIdx % CONTROL_SYSTEMS.length];
  const [pGain, setPGain] = useState(1.0);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [completedSystems, setCompletedSystems] = useState(0);
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
          (completedSystems / systemCount) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, completedSystems, systemCount],
  );

  const curve = generateResponseCurve(system.initial, system.setpoint, pGain);
  const finalVal = curve[curve.length - 1];
  const overshoot = Math.max(...curve) - system.setpoint;
  const hasOscillation = pGain > system.optimalPGain * 1.8;
  const isSlow = pGain < system.optimalPGain * 0.5;
  const isGood =
    !hasOscillation &&
    !isSlow &&
    Math.abs(finalVal - system.setpoint) <
      Math.abs(system.setpoint - system.initial) * 0.1;

  function handleConfirm() {
    setConfirmed(true);
    const proximityScore = Math.max(
      0,
      100 - Math.abs(pGain - system.optimalPGain) * 40,
    );
    const pts = Math.round(proximityScore * 3 * config.difficulty);
    const newScore = score + pts;
    setScore(newScore);
    scoreRef.current = newScore;
    setTimeout(() => {
      const next = completedSystems + 1;
      setCompletedSystems(next);
      if (next >= systemCount) {
        endGame(true);
      } else {
        setSystemIdx(next);
        setPGain(1.0);
        setConfirmed(false);
      }
    }, 3000);
  }

  const CHART_W = 280;
  const CHART_H = 80;
  const range = Math.abs(system.setpoint - system.initial) * 1.5 || 1;
  const minY = Math.min(system.initial, system.setpoint) - range * 0.2;
  const maxY = Math.max(system.initial, system.setpoint) + range * 0.3;

  function toSvgX(i: number) {
    return (i / (curve.length - 1)) * CHART_W;
  }
  function toSvgY(v: number) {
    return CHART_H - ((v - minY) / (maxY - minY)) * CHART_H;
  }

  const pathD = curve
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"} ${toSvgX(i).toFixed(1)} ${toSvgY(v).toFixed(1)}`,
    )
    .join(" ");
  const setpointY = toSvgY(system.setpoint);

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="feedback_control.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Cpu
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#00f5ff" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" }}
          >
            Feedback Control Tuner
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Tune the P-gain (proportional gain) for closed-loop control systems.
            Find the optimal value that gives fast, stable response without
            oscillation.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Too low P-gain = slow response. Too high = oscillation. Find the
            sweet spot for stable control.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="feedback_control.start_button"
          >
            Start Tuning
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="feedback_control.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div
          className="flex items-center gap-2"
          style={{ color: system.color }}
        >
          <Cpu className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: system.color }}
        >
          {system.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {completedSystems + 1}/{systemCount}
        </span>
      </div>

      <div
        className="glass-card rounded-xl p-3 shrink-0 border"
        style={{ borderColor: `${system.color}40` }}
      >
        <p
          className="text-xs font-bold mb-1"
          style={{ color: system.color, fontFamily: "'Orbitron', sans-serif" }}
        >
          CONTROL SYSTEM — PROPORTIONAL CONTROL
        </p>
        <p className="text-sm">{system.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Setpoint:{" "}
          <span className="font-bold" style={{ color: system.color }}>
            {system.setpoint}
            {system.unit}
          </span>{" "}
          | Current:{" "}
          <span className="font-bold">
            {system.initial}
            {system.unit}
          </span>
        </p>
      </div>

      {/* Response curve */}
      <div
        className="glass-card rounded-xl p-3 shrink-0 border"
        style={{ borderColor: `${system.color}30` }}
      >
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          SYSTEM RESPONSE (P-gain = {pGain.toFixed(1)})
        </p>
        <svg
          width="100%"
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: "80px" }}
        >
          {/* Setpoint line */}
          <line
            x1="0"
            y1={setpointY}
            x2={CHART_W}
            y2={setpointY}
            stroke={system.color}
            strokeWidth="1"
            strokeDasharray="4,3"
            opacity="0.6"
          />
          {/* Response curve */}
          <path
            d={pathD}
            fill="none"
            stroke={isGood ? "#10b981" : hasOscillation ? "#f43f5e" : "#f59e0b"}
            strokeWidth="2"
          />
          <text
            x="4"
            y={setpointY - 4}
            fill={system.color}
            fontSize="9"
            fontFamily="Orbitron"
          >
            Setpoint
          </text>
          <text
            x={CHART_W - 60}
            y={CHART_H - 4}
            fill="#6b7280"
            fontSize="8"
            fontFamily="Orbitron"
          >
            Time
          </text>
        </svg>
        <div className="flex justify-between text-xs mt-1">
          <span
            style={{
              color: isGood
                ? "#10b981"
                : hasOscillation
                  ? "#f43f5e"
                  : isSlow
                    ? "#f59e0b"
                    : "#6b7280",
            }}
          >
            {isGood
              ? "Stable response"
              : hasOscillation
                ? `Oscillating (overshoot: ${overshoot.toFixed(1)})`
                : isSlow
                  ? "Response too slow"
                  : "Adjusting..."}
          </span>
          <span className="text-muted-foreground">
            Final: {finalVal.toFixed(1)}
            {system.unit}
          </span>
        </div>
      </div>

      {/* P-gain slider */}
      <div className="glass-card rounded-xl p-4 shrink-0">
        <div className="flex justify-between mb-2">
          <p
            className="text-xs font-bold"
            style={{
              color: system.color,
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            P-GAIN
          </p>
          <p
            className="text-xl font-black tabular-nums"
            style={{ color: system.color }}
          >
            {pGain.toFixed(1)}
          </p>
        </div>
        <input
          type="range"
          min={system.minPGain * 10}
          max={system.maxPGain * 10}
          step="1"
          value={Math.round(pGain * 10)}
          onChange={(e) =>
            !confirmed && setPGain(Number.parseInt(e.target.value) / 10)
          }
          className="w-full"
          disabled={confirmed}
          style={{ accentColor: system.color }}
          data-ocid="feedback_control.pgain_slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{system.minPGain} (too slow)</span>
          <span>{system.maxPGain} (oscillates)</span>
        </div>
      </div>

      {/* Feedback labels */}
      <div className="grid grid-cols-3 gap-2 shrink-0">
        <div
          className="rounded-lg p-2 text-center border"
          style={{
            borderColor: isSlow ? "#f59e0b" : "#374151",
            backgroundColor: isSlow ? "#f59e0b10" : "transparent",
          }}
        >
          <p
            className="text-xs font-bold"
            style={{ color: isSlow ? "#f59e0b" : "#6b7280" }}
          >
            SLOW
          </p>
          <p className="text-xs text-muted-foreground">
            P &lt; {(system.optimalPGain * 0.5).toFixed(1)}
          </p>
        </div>
        <div
          className="rounded-lg p-2 text-center border"
          style={{
            borderColor: isGood ? "#10b981" : "#374151",
            backgroundColor: isGood ? "#10b98110" : "transparent",
          }}
        >
          <p
            className="text-xs font-bold"
            style={{ color: isGood ? "#10b981" : "#6b7280" }}
          >
            STABLE
          </p>
          <p className="text-xs text-muted-foreground">Optimal zone</p>
        </div>
        <div
          className="rounded-lg p-2 text-center border"
          style={{
            borderColor: hasOscillation ? "#f43f5e" : "#374151",
            backgroundColor: hasOscillation ? "#f43f5e10" : "transparent",
          }}
        >
          <p
            className="text-xs font-bold"
            style={{ color: hasOscillation ? "#f43f5e" : "#6b7280" }}
          >
            OSCILLATING
          </p>
          <p className="text-xs text-muted-foreground">
            P &gt; {(system.optimalPGain * 1.8).toFixed(1)}
          </p>
        </div>
      </div>

      {!confirmed && (
        <div className="shrink-0 flex justify-end">
          <GlowButton
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            data-ocid="feedback_control.confirm_button"
          >
            Lock in P-gain: {pGain.toFixed(1)}
          </GlowButton>
        </div>
      )}
      {confirmed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-3 shrink-0 border"
          style={{ borderColor: isGood ? "#10b981" : "#f59e0b" }}
        >
          <p
            className="text-sm font-bold"
            style={{ color: isGood ? "#10b981" : "#f59e0b" }}
          >
            {isGood
              ? `Excellent tuning! P-gain of ${pGain.toFixed(1)} gives stable response. Optimal was ${system.optimalPGain}.`
              : `Acceptable. Optimal P-gain for ${system.name} is ${system.optimalPGain}. Your gain: ${pGain.toFixed(1)}.`}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Game 3: Robotics Challenge (Pick-and-Place) ────────────────────────────

interface RoboticComponent {
  id: string;
  label: string;
  description: string;
  color: string;
}
interface AlgorithmBlock {
  id: string;
  label: string;
  color: string;
}
interface RoboticsTask {
  title: string;
  briefing: string;
  requiredComponents: string[];
  allComponents: string[];
  sequenceLabel: string;
  correctSequence: string[];
  algorithmBlocks: AlgorithmBlock[];
  correctAlgorithm: string[];
  explanation: string;
}

const ROBOT_COMPONENTS: Record<string, RoboticComponent> = {
  color_sensor: {
    id: "color_sensor",
    label: "Color Sensor",
    description: "Detects object color (RGB)",
    color: "#00f5ff",
  },
  conveyor: {
    id: "conveyor",
    label: "Conveyor Belt",
    description: "Moves objects to robot arm",
    color: "#f59e0b",
  },
  arm: {
    id: "arm",
    label: "Robot Arm",
    description: "3-DOF articulated arm",
    color: "#7c3aed",
  },
  gripper: {
    id: "gripper",
    label: "Gripper",
    description: "Pneumatic clamp end effector",
    color: "#10b981",
  },
  controller: {
    id: "controller",
    label: "Controller",
    description: "PLC logic controller",
    color: "#e879f9",
  },
  camera: {
    id: "camera",
    label: "Vision Camera",
    description: "Object position detection",
    color: "#f43f5e",
  },
  ultrasonic: {
    id: "ultrasonic",
    label: "Distance Sensor",
    description: "Object proximity detection",
    color: "#00f5ff",
  },
  servo: {
    id: "servo",
    label: "Servo Motors",
    description: "Precision joint actuators",
    color: "#f59e0b",
  },
  weight_sensor: {
    id: "weight_sensor",
    label: "Weight Sensor",
    description: "Measures object mass",
    color: "#f43f5e",
  },
  navigation: {
    id: "navigation",
    label: "Navigation Module",
    description: "Path planning and movement",
    color: "#7c3aed",
  },
};

const ROBOTICS_TASKS: Record<1 | 2 | 3, RoboticsTask[]> = {
  1: [
    {
      title: "Color Sorting",
      briefing:
        "Mission: Sort red and blue cubes into separate bins. Design the robot system and write the control algorithm.",
      requiredComponents: ["color_sensor", "conveyor", "arm", "controller"],
      allComponents: [
        "color_sensor",
        "conveyor",
        "arm",
        "gripper",
        "controller",
        "camera",
      ],
      sequenceLabel:
        "System Architecture (order: input sensor to process to output)",
      correctSequence: ["conveyor", "color_sensor", "controller", "arm"],
      algorithmBlocks: [
        { id: "detect", label: "IF color = RED", color: "#f43f5e" },
        { id: "move_bin1", label: "MOVE ARM to Bin 1", color: "#7c3aed" },
        { id: "detect_blue", label: "IF color = BLUE", color: "#00f5ff" },
        { id: "move_bin2", label: "MOVE ARM to Bin 2", color: "#7c3aed" },
        { id: "release", label: "RELEASE gripper", color: "#10b981" },
      ],
      correctAlgorithm: [
        "detect",
        "move_bin1",
        "detect_blue",
        "move_bin2",
        "release",
      ],
      explanation:
        "Conveyor delivers objects, color sensor reads, controller decides which bin, arm executes the move.",
    },
  ],
  2: [
    {
      title: "Vision-Guided Pick",
      briefing:
        "Mission: Use a camera to locate randomly placed objects on a table and pick them up.",
      requiredComponents: ["camera", "controller", "arm", "gripper"],
      allComponents: [
        "camera",
        "ultrasonic",
        "arm",
        "gripper",
        "controller",
        "servo",
        "color_sensor",
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["camera", "controller", "servo", "arm"],
      algorithmBlocks: [
        { id: "scan", label: "SCAN camera for object", color: "#f43f5e" },
        { id: "calc", label: "CALCULATE pick position", color: "#7c3aed" },
        { id: "move_arm", label: "MOVE ARM to position", color: "#10b981" },
        { id: "grip", label: "CLOSE gripper", color: "#f59e0b" },
        { id: "place", label: "PLACE in tray", color: "#00f5ff" },
      ],
      correctAlgorithm: ["scan", "calc", "move_arm", "grip", "place"],
      explanation:
        "Camera provides coordinates, controller calculates IK, servos drive arm joints, gripper picks and places.",
    },
    {
      title: "Weight-Based Sorting",
      briefing:
        "Mission: Sort products into light and heavy bins based on measured weight.",
      requiredComponents: ["weight_sensor", "conveyor", "arm", "controller"],
      allComponents: [
        "weight_sensor",
        "conveyor",
        "arm",
        "controller",
        "color_sensor",
        "camera",
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["conveyor", "weight_sensor", "controller", "arm"],
      algorithmBlocks: [
        { id: "weigh", label: "READ weight sensor", color: "#f43f5e" },
        {
          id: "compare",
          label: "COMPARE to threshold (500g)",
          color: "#7c3aed",
        },
        { id: "bin_heavy", label: "IF heavy SEND to Bin 2", color: "#f59e0b" },
        { id: "bin_light", label: "IF light SEND to Bin 1", color: "#00f5ff" },
        { id: "advance", label: "ADVANCE conveyor", color: "#10b981" },
      ],
      correctAlgorithm: [
        "weigh",
        "compare",
        "bin_light",
        "bin_heavy",
        "advance",
      ],
      explanation:
        "Conveyor feeds station, weight sensor measures, controller branches to correct bin, conveyor advances.",
    },
  ],
  3: [
    {
      title: "Autonomous Navigation",
      briefing:
        "Mission: Robot must navigate a warehouse floor, avoid obstacles, and deliver items to 3 locations.",
      requiredComponents: ["navigation", "ultrasonic", "controller", "servo"],
      allComponents: [
        "navigation",
        "ultrasonic",
        "controller",
        "servo",
        "camera",
        "arm",
        "weight_sensor",
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["navigation", "ultrasonic", "controller", "servo"],
      algorithmBlocks: [
        { id: "plan", label: "PLAN path to destination", color: "#7c3aed" },
        { id: "sense", label: "READ proximity sensors", color: "#00f5ff" },
        { id: "check", label: "IF obstacle detected", color: "#f43f5e" },
        { id: "reroute", label: "RECALCULATE path", color: "#f59e0b" },
        { id: "drive", label: "DRIVE to next waypoint", color: "#10b981" },
      ],
      correctAlgorithm: ["plan", "sense", "check", "reroute", "drive"],
      explanation:
        "Path planner sets route, distance sensors detect obstacles, controller reroutes dynamically, servos drive wheels.",
    },
    {
      title: "Assembly Collaboration",
      briefing:
        "Mission: Two robot arms work in sync to assemble a product by picking different sub-components.",
      requiredComponents: ["camera", "controller", "arm", "gripper"],
      allComponents: [
        "camera",
        "controller",
        "arm",
        "gripper",
        "servo",
        "navigation",
        "ultrasonic",
      ],
      sequenceLabel: "System Architecture",
      correctSequence: ["camera", "controller", "arm", "gripper"],
      algorithmBlocks: [
        { id: "sync", label: "SYNC both arm controllers", color: "#e879f9" },
        { id: "detect", label: "DETECT component positions", color: "#f43f5e" },
        { id: "pick_a", label: "ARM A picks sub-component", color: "#7c3aed" },
        { id: "pick_b", label: "ARM B picks base plate", color: "#00f5ff" },
        {
          id: "assemble",
          label: "ASSEMBLE at fixture point",
          color: "#10b981",
        },
      ],
      correctAlgorithm: ["sync", "detect", "pick_a", "pick_b", "assemble"],
      explanation:
        "Controllers must sync first, camera detects both parts, arms pick simultaneously, then combine at assembly fixture.",
    },
  ],
};

type RobotPhase = "components" | "sequence" | "algorithm" | "result";

function RoboticsChallengeGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const allTasks = ROBOTICS_TASKS[config.difficulty];
  const [taskIdx, setTaskIdx] = useState(0);
  const task = allTasks[taskIdx];
  const [phase, setPhase] = useState<RobotPhase>("components");
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [systemSequence, setSystemSequence] = useState<string[]>([]);
  const [algorithmBlocks, setAlgorithmBlocks] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
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
          (completedTasks / allTasks.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, completedTasks, allTasks.length],
  );

  function toggleComponent(id: string) {
    setSelectedComponents((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev,
    );
  }
  function toggleSequence(id: string) {
    setSystemSequence((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }
  function toggleAlgorithm(id: string) {
    setAlgorithmBlocks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  }

  function handleComponentsSubmit() {
    const correct =
      task.requiredComponents.every((c) => selectedComponents.includes(c)) &&
      selectedComponents.length === task.requiredComponents.length;
    if (correct) {
      setScore((s) => s + 150 * config.difficulty);
      setPhase("sequence");
    } else {
      setSelectedComponents([]);
    }
  }

  function handleSequenceSubmit() {
    const correct =
      systemSequence.length === task.correctSequence.length &&
      systemSequence.every((c, i) => c === task.correctSequence[i]);
    if (correct) {
      setScore((s) => s + 150 * config.difficulty);
      setPhase("algorithm");
    } else {
      setSystemSequence([]);
    }
  }

  function handleAlgorithmSubmit() {
    const correct =
      algorithmBlocks.length === task.correctAlgorithm.length &&
      algorithmBlocks.every((b, i) => b === task.correctAlgorithm[i]);
    if (correct) {
      setScore((s) => s + 200 * config.difficulty);
      setPhase("result");
      setTimeout(() => {
        const next = completedTasks + 1;
        setCompletedTasks(next);
        if (next >= allTasks.length) {
          endGame(true);
        } else {
          setTaskIdx(next);
          setPhase("components");
          setSelectedComponents([]);
          setSystemSequence([]);
          setAlgorithmBlocks([]);
        }
      }, 3000);
    } else {
      setAlgorithmBlocks([]);
    }
  }

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="robotics_challenge.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Cpu
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f43f5e" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" }}
          >
            Robotics Integration Challenge
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Mission briefings require you to design a complete robot system:
            select the right components, place them in the correct architecture
            sequence, and write the control algorithm using IF-THEN blocks.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="robotics_challenge.start_button"
          >
            Accept Mission
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  const phaseSteps: RobotPhase[] = ["components", "sequence", "algorithm"];
  const phaseColors: Record<RobotPhase, string> = {
    components: "#f43f5e",
    sequence: "#7c3aed",
    algorithm: "#10b981",
    result: "#00f5ff",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="robotics_challenge.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f43f5e" }}>
          <Cpu className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex gap-1">
          {phaseSteps.map((p) => (
            <div
              key={p}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  p === phase
                    ? phaseColors[p]
                    : phaseSteps.indexOf(p) <
                        phaseSteps.indexOf(phase as RobotPhase)
                      ? "#10b981"
                      : "#374151",
              }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {completedTasks + 1}/{allTasks.length}
        </span>
      </div>

      <div className="glass-card rounded-xl p-3 shrink-0 border border-[#f43f5e]/30">
        <p
          className="text-xs font-bold text-[#f43f5e] mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          MISSION BRIEFING
        </p>
        <p className="text-sm font-bold text-foreground">{task.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{task.briefing}</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "components" && (
          <motion.div
            key="comp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-3"
          >
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SELECT EXACTLY 4 REQUIRED COMPONENTS ({selectedComponents.length}
              /4)
            </p>
            <div className="grid grid-cols-2 gap-2 flex-1 content-start">
              {task.allComponents.map((cid) => {
                const comp = ROBOT_COMPONENTS[cid];
                const isSelected = selectedComponents.includes(cid);
                return (
                  <motion.button
                    type="button"
                    key={cid}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleComponent(cid)}
                    className="rounded-xl border-2 p-3 text-left transition-all"
                    style={{
                      borderColor: isSelected ? comp.color : `${comp.color}30`,
                      backgroundColor: isSelected
                        ? `${comp.color}15`
                        : "transparent",
                    }}
                    data-ocid={`robotics_challenge.comp.${cid}`}
                  >
                    <p
                      className="text-xs font-bold"
                      style={{ color: isSelected ? comp.color : "#94a3b8" }}
                    >
                      {comp.label}
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontSize: "9px" }}
                    >
                      {comp.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleComponentsSubmit}
              disabled={selectedComponents.length !== 4}
              data-ocid="robotics_challenge.components_submit"
            >
              Confirm Components
            </GlowButton>
          </motion.div>
        )}

        {phase === "sequence" && (
          <motion.div
            key="seq"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-3"
          >
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              BUILD SYSTEM ARCHITECTURE — {task.sequenceLabel}
            </p>
            <div className="shrink-0">
              <p className="text-xs text-muted-foreground mb-1">
                Your sequence:
              </p>
              <div className="flex gap-2 min-h-10 flex-wrap">
                {systemSequence.map((cid, i) => {
                  const comp = ROBOT_COMPONENTS[cid];
                  return (
                    <div
                      key={`s-${i}`}
                      className="rounded-lg border px-2 py-1 text-xs font-bold"
                      style={{
                        borderColor: `${comp.color}50`,
                        color: comp.color,
                      }}
                    >
                      {i + 1}. {comp.label}
                    </div>
                  );
                })}
                {systemSequence.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    Click components below...
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {task.correctSequence.map((cid) => {
                const comp = ROBOT_COMPONENTS[cid];
                const placed = systemSequence.includes(cid);
                return (
                  <motion.button
                    type="button"
                    key={cid}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleSequence(cid)}
                    className="rounded-xl border-2 p-3 text-left transition-all flex items-center gap-3"
                    style={{
                      borderColor: placed ? comp.color : `${comp.color}30`,
                      backgroundColor: placed
                        ? `${comp.color}12`
                        : "transparent",
                    }}
                    data-ocid={`robotics_challenge.seq.${cid}`}
                  >
                    {placed && (
                      <CheckCircle
                        className="h-4 w-4 shrink-0"
                        style={{ color: comp.color }}
                      />
                    )}
                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{ color: placed ? comp.color : "#94a3b8" }}
                      >
                        {comp.label}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontSize: "9px" }}
                      >
                        {comp.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <div className="flex gap-2 justify-end shrink-0">
              <GlowButton
                variant="secondary"
                size="sm"
                onClick={() => setSystemSequence([])}
                data-ocid="robotics_challenge.reset_seq"
              >
                Reset
              </GlowButton>
              <GlowButton
                variant="primary"
                size="sm"
                onClick={handleSequenceSubmit}
                disabled={systemSequence.length !== task.correctSequence.length}
                data-ocid="robotics_challenge.seq_submit"
              >
                Confirm Architecture
              </GlowButton>
            </div>
          </motion.div>
        )}

        {phase === "algorithm" && (
          <motion.div
            key="algo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-3"
          >
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              WRITE CONTROL ALGORITHM — Click blocks in correct order
            </p>
            <div className="shrink-0">
              <p className="text-xs text-muted-foreground mb-1">
                Your algorithm:
              </p>
              <div className="flex flex-col gap-1 min-h-10">
                {algorithmBlocks.map((bid, i) => {
                  const block = task.algorithmBlocks.find((b) => b.id === bid);
                  return block ? (
                    <div
                      key={`a-${i}`}
                      className="rounded-lg border px-3 py-1.5 text-xs font-bold flex items-center gap-2"
                      style={{
                        borderColor: `${block.color}50`,
                        backgroundColor: `${block.color}10`,
                        color: block.color,
                      }}
                    >
                      <span style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {i + 1}
                      </span>
                      {block.label}
                    </div>
                  ) : null;
                })}
                {algorithmBlocks.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    Click blocks below...
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              {task.algorithmBlocks
                .filter((b) => !algorithmBlocks.includes(b.id))
                .map((block) => (
                  <motion.button
                    type="button"
                    key={block.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleAlgorithm(block.id)}
                    className="rounded-lg border px-3 py-2 text-sm font-bold text-left transition-all"
                    style={{
                      borderColor: `${block.color}50`,
                      color: block.color,
                      backgroundColor: `${block.color}08`,
                    }}
                    data-ocid={`robotics_challenge.algo.${block.id}`}
                  >
                    {block.label}
                  </motion.button>
                ))}
            </div>
            <div className="flex gap-2 justify-end shrink-0">
              <GlowButton
                variant="secondary"
                size="sm"
                onClick={() => setAlgorithmBlocks([])}
                data-ocid="robotics_challenge.reset_algo"
              >
                Reset
              </GlowButton>
              <GlowButton
                variant="primary"
                size="sm"
                onClick={handleAlgorithmSubmit}
                disabled={
                  algorithmBlocks.length !== task.algorithmBlocks.length
                }
                data-ocid="robotics_challenge.algo_submit"
              >
                Run Mission
              </GlowButton>
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            <CheckCircle
              className="h-20 w-20"
              style={{
                color: "#10b981",
                filter: "drop-shadow(0 0 20px #10b981)",
              }}
            />
            <p
              className="text-xl font-black text-[#10b981]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              MISSION ACCOMPLISHED
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              {task.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function Mechatronics({ config, onGameEnd }: Props) {
  if (config.gameId === "feedback-control")
    return <FeedbackControlGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "robotics-challenge")
    return <RoboticsChallengeGame config={config} onGameEnd={onGameEnd} />;
  return <SystemIntegrationGame config={config} onGameEnd={onGameEnd} />;
}
