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

interface Part {
  id: string;
  name: string;
  color: string;
  targetSlot: string;
  description: string;
}
interface Slot {
  id: string;
  label: string;
  x: number;
  y: number;
  accepts: string;
}
interface Level {
  title: string;
  parts: Part[];
  slots: Slot[];
  description: string;
}

const LEVELS: Record<1 | 2 | 3, Level> = {
  1: {
    title: "Ground Robot Assembly",
    description:
      "Assemble a basic ground robot by placing each part into its correct slot.",
    parts: [
      {
        id: "chassis",
        name: "Chassis Frame",
        color: "#00f5ff",
        targetSlot: "s-chassis",
        description: "Structural body",
      },
      {
        id: "motors",
        name: "Drive Motors",
        color: "#7c3aed",
        targetSlot: "s-motors",
        description: "Locomotion",
      },
      {
        id: "wheels",
        name: "Wheels x4",
        color: "#10b981",
        targetSlot: "s-wheels",
        description: "Traction",
      },
      {
        id: "battery",
        name: "LiPo Battery",
        color: "#f43f5e",
        targetSlot: "s-battery",
        description: "Power source",
      },
      {
        id: "board",
        name: "Controller Board",
        color: "#e879f9",
        targetSlot: "s-board",
        description: "Brain",
      },
    ],
    slots: [
      {
        id: "s-chassis",
        label: "Body Frame",
        x: 20,
        y: 40,
        accepts: "chassis",
      },
      { id: "s-motors", label: "Motor Bay", x: 45, y: 15, accepts: "motors" },
      { id: "s-wheels", label: "Wheel Axles", x: 70, y: 40, accepts: "wheels" },
      {
        id: "s-battery",
        label: "Battery Bay",
        x: 45,
        y: 65,
        accepts: "battery",
      },
      { id: "s-board", label: "MCU Slot", x: 45, y: 40, accepts: "board" },
    ],
  },
  2: {
    title: "Arm Robot Assembly",
    description:
      "Build a 4-DOF robotic arm. Place mechanical and electronic components in sequence.",
    parts: [
      {
        id: "base",
        name: "Rotating Base",
        color: "#00f5ff",
        targetSlot: "s-base",
        description: "Shoulder joint",
      },
      {
        id: "link1",
        name: "Arm Link 1",
        color: "#f59e0b",
        targetSlot: "s-link1",
        description: "Upper arm",
      },
      {
        id: "link2",
        name: "Arm Link 2",
        color: "#f59e0b",
        targetSlot: "s-link2",
        description: "Forearm",
      },
      {
        id: "gripper",
        name: "Gripper End",
        color: "#10b981",
        targetSlot: "s-gripper",
        description: "End effector",
      },
      {
        id: "servo1",
        name: "Shoulder Servo",
        color: "#7c3aed",
        targetSlot: "s-servo1",
        description: "Joint actuator",
      },
      {
        id: "servo2",
        name: "Elbow Servo",
        color: "#e879f9",
        targetSlot: "s-servo2",
        description: "Joint actuator",
      },
    ],
    slots: [
      { id: "s-base", label: "Base Mount", x: 40, y: 70, accepts: "base" },
      { id: "s-link1", label: "Upper Link", x: 25, y: 48, accepts: "link1" },
      { id: "s-link2", label: "Lower Link", x: 45, y: 30, accepts: "link2" },
      {
        id: "s-gripper",
        label: "End Effector",
        x: 65,
        y: 15,
        accepts: "gripper",
      },
      {
        id: "s-servo1",
        label: "Shoulder Joint",
        x: 15,
        y: 65,
        accepts: "servo1",
      },
      { id: "s-servo2", label: "Elbow Joint", x: 35, y: 45, accepts: "servo2" },
    ],
  },
  3: {
    title: "Autonomous Rover Assembly",
    description:
      "Assemble a fully autonomous rover with sensors, navigation, and power management.",
    parts: [
      {
        id: "chassis",
        name: "Rover Chassis",
        color: "#00f5ff",
        targetSlot: "s-chassis",
        description: "Body",
      },
      {
        id: "wheels",
        name: "6-Wheel Drive",
        color: "#10b981",
        targetSlot: "s-wheels",
        description: "Locomotion",
      },
      {
        id: "lidar",
        name: "LiDAR Sensor",
        color: "#f43f5e",
        targetSlot: "s-lidar",
        description: "3D mapping",
      },
      {
        id: "camera",
        name: "Vision Camera",
        color: "#38bdf8",
        targetSlot: "s-camera",
        description: "Object detection",
      },
      {
        id: "cpu",
        name: "Jetson CPU",
        color: "#7c3aed",
        targetSlot: "s-cpu",
        description: "AI processor",
      },
      {
        id: "solar",
        name: "Solar Panel",
        color: "#f59e0b",
        targetSlot: "s-solar",
        description: "Power generation",
      },
      {
        id: "imu",
        name: "IMU Module",
        color: "#e879f9",
        targetSlot: "s-imu",
        description: "Orientation",
      },
    ],
    slots: [
      { id: "s-chassis", label: "Frame", x: 35, y: 45, accepts: "chassis" },
      { id: "s-wheels", label: "Drive Train", x: 15, y: 60, accepts: "wheels" },
      { id: "s-lidar", label: "LiDAR Mount", x: 55, y: 20, accepts: "lidar" },
      { id: "s-camera", label: "Camera Rail", x: 75, y: 35, accepts: "camera" },
      { id: "s-cpu", label: "CPU Tray", x: 35, y: 25, accepts: "cpu" },
      { id: "s-solar", label: "Top Panel", x: 15, y: 25, accepts: "solar" },
      { id: "s-imu", label: "IMU Mount", x: 60, y: 60, accepts: "imu" },
    ],
  },
};

export default function PartAssemblyGame({ config, onGameEnd }: Props) {
  const level = LEVELS[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
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
          (Object.keys(placed).length / level.parts.length) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd, placed, level.parts.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startRef.current = Date.now();
    setPhase("playing");
    startTimer();
  }

  function onSlotClick(slotId: string) {
    if (!selected) return;
    const slot = level.slots.find((s) => s.id === slotId);
    if (!slot) return;
    const part = level.parts.find((p) => p.id === selected);
    if (!part) return;
    if (placed[slotId]) {
      setSelected(null);
      return;
    }
    if (slot.accepts === selected) {
      const next = { ...placed, [slotId]: selected };
      setPlaced(next);
      setScore((s) => s + 200 * config.difficulty);
      setFlash("ok");
      setTimeout(() => setFlash(null), 400);
      if (Object.keys(next).length === level.parts.length) {
        setScore((s) => s + 500 * config.difficulty + timeLeft * 5);
        setTimeout(() => endGame(true), 1500);
      }
    } else {
      setFlash("err");
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
      setTimeout(() => setFlash(null), 600);
    }
    setSelected(null);
  }

  const unplaced = level.parts.filter(
    (p) => !Object.values(placed).includes(p.id),
  );
  const pct = (timeLeft / config.timeLimit) * 100;
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="part_assembly.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#10b981] transition-all duration-1000"
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
            className="text-3xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Part Assembly
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Select a part, then click the correct slot to assemble the robot.
            Each part has one exact slot.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#10b981] text-black font-bold hover:opacity-90"
            data-ocid="part_assembly.start_button"
          >
            Assemble Robot
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#10b981]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {level.title} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{level.description}</p>
          <div
            className={`relative flex-1 rounded-xl border overflow-hidden transition-all ${
              flash === "err"
                ? "border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                : flash === "ok"
                  ? "border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : "border-border/30"
            }`}
            data-ocid="part_assembly.board"
          >
            {level.slots.map((slot, i) => {
              const placedPartId = placed[slot.id];
              const part = level.parts.find((p) => p.id === placedPartId);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSlotClick(slot.id)}
                  className="absolute flex flex-col items-center justify-center rounded-lg border-2 w-20 h-14 text-xs font-bold transition-all cursor-pointer"
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    borderColor: part
                      ? part.color
                      : selected
                        ? "#f59e0b"
                        : "#475569",
                    backgroundColor: part
                      ? `${part.color}15`
                      : selected
                        ? "#f59e0b10"
                        : "transparent",
                    color: part ? part.color : "#64748b",
                  }}
                  data-ocid={`part_assembly.slot.${i + 1}`}
                >
                  <span style={{ fontSize: "8px" }}>
                    {part ? part.name : slot.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {unplaced.map((part, i) => (
              <button
                key={part.id}
                type="button"
                onClick={() =>
                  setSelected(selected === part.id ? null : part.id)
                }
                className="px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all"
                style={{
                  borderColor:
                    selected === part.id ? "#f59e0b" : `${part.color}50`,
                  backgroundColor:
                    selected === part.id ? "#f59e0b15" : `${part.color}10`,
                  color: selected === part.id ? "#f59e0b" : part.color,
                }}
                data-ocid={`part_assembly.part.${i + 1}`}
              >
                {part.name}
              </button>
            ))}
          </div>
          {selected && (
            <p className="text-xs text-center text-[#f59e0b] shrink-0">
              Selected: {selected} — click a slot
            </p>
          )}
        </div>
      )}
    </div>
  );
}
