import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Cpu, Info, XCircle, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─── Shared types ────────────────────────────────────────────────────────────
type SlotKey = "R1" | "C1" | "U1" | "D1" | "Q1" | "X1" | "L1" | "P1";

interface ComponentDef {
  key: string;
  name: string;
  symbol: string;
  color: string;
}

interface BoardSlot {
  key: SlotKey;
  label: string;
  correctComponent: string;
  tooltip: string;
  x: number;
  y: number;
}

interface BoardDesign {
  name: string;
  description: string;
  slots: BoardSlot[];
}

// ─── PC Builder data ─────────────────────────────────────────────────────────
const COMPONENTS: ComponentDef[] = [
  { key: "resistor", name: "Resistor", symbol: "R", color: "#f59e0b" },
  { key: "capacitor", name: "Capacitor", symbol: "C", color: "#00f5ff" },
  { key: "ic_chip", name: "IC Chip", symbol: "U", color: "#7c3aed" },
  { key: "diode", name: "Diode", symbol: "D", color: "#f43f5e" },
  { key: "transistor", name: "Transistor", symbol: "Q", color: "#10b981" },
  { key: "crystal", name: "Crystal Oscillator", symbol: "X", color: "#e879f9" },
  { key: "inductor", name: "Inductor", symbol: "L", color: "#fb923c" },
  { key: "power_conn", name: "Power Connector", symbol: "P", color: "#facc15" },
];

const BOARD_DESIGNS: Record<1 | 2 | 3, BoardDesign[]> = {
  1: [
    {
      name: "Basic Microcontroller Board",
      description:
        "An introductory circuit board with standard passive and active components.",
      slots: [
        {
          key: "R1",
          label: "R1",
          correctComponent: "resistor",
          tooltip:
            "R1 — Resistor: Limits current flow. Measured in Ohms. Protects sensitive components from excess current.",
          x: 15,
          y: 20,
        },
        {
          key: "C1",
          label: "C1",
          correctComponent: "capacitor",
          tooltip:
            "C1 — Capacitor: Stores and releases electrical charge. Used for filtering noise in power rails.",
          x: 40,
          y: 15,
        },
        {
          key: "U1",
          label: "U1",
          correctComponent: "ic_chip",
          tooltip:
            "U1 — IC Chip: Integrated circuit containing thousands of transistors on a single die.",
          x: 62,
          y: 30,
        },
        {
          key: "D1",
          label: "D1",
          correctComponent: "diode",
          tooltip:
            "D1 — Diode: Allows current to flow in one direction only. Prevents reverse polarity damage.",
          x: 25,
          y: 55,
        },
        {
          key: "Q1",
          label: "Q1",
          correctComponent: "transistor",
          tooltip:
            "Q1 — Transistor: Acts as an electronic switch or amplifier. The building block of all processors.",
          x: 50,
          y: 60,
        },
        {
          key: "X1",
          label: "X1",
          correctComponent: "crystal",
          tooltip:
            "X1 — Crystal Oscillator: Generates a precise clock frequency. Sets the timing for all digital logic.",
          x: 75,
          y: 55,
        },
        {
          key: "L1",
          label: "L1",
          correctComponent: "inductor",
          tooltip:
            "L1 — Inductor: Stores energy in a magnetic field. Used in power converters and filtering circuits.",
          x: 20,
          y: 80,
        },
        {
          key: "P1",
          label: "P1",
          correctComponent: "power_conn",
          tooltip:
            "P1 — Power Connector: The board entry point for VCC and GND supply rails.",
          x: 70,
          y: 80,
        },
      ],
    },
  ],
  2: [
    {
      name: "Signal Processing Board",
      description:
        "An intermediate board featuring high-precision analog and digital signal components.",
      slots: [
        {
          key: "R1",
          label: "R1",
          correctComponent: "resistor",
          tooltip:
            "R1 — Precision Resistor: Used in voltage dividers and feedback networks for op-amp circuits.",
          x: 12,
          y: 18,
        },
        {
          key: "C1",
          label: "C1",
          correctComponent: "capacitor",
          tooltip:
            "C1 — Filter Capacitor: Part of an RC filter to remove high-frequency interference from analog signals.",
          x: 35,
          y: 12,
        },
        {
          key: "U1",
          label: "U1",
          correctComponent: "ic_chip",
          tooltip:
            "U1 — DSP Chip: A digital signal processor executes mathematical operations on digitized waveforms.",
          x: 60,
          y: 25,
        },
        {
          key: "D1",
          label: "D1",
          correctComponent: "diode",
          tooltip:
            "D1 — Schottky Diode: Low forward-voltage drop diode used in high-speed rectifier circuits.",
          x: 22,
          y: 52,
        },
        {
          key: "Q1",
          label: "Q1",
          correctComponent: "transistor",
          tooltip:
            "Q1 — MOSFET: Metal Oxide Semiconductor Field Effect Transistor — controls power delivery efficiently.",
          x: 48,
          y: 58,
        },
        {
          key: "X1",
          label: "X1",
          correctComponent: "crystal",
          tooltip:
            "X1 — TCXO: Temperature Compensated Crystal Oscillator — maintains accuracy across temperature ranges.",
          x: 74,
          y: 52,
        },
        {
          key: "L1",
          label: "L1",
          correctComponent: "inductor",
          tooltip:
            "L1 — Choke Inductor: Blocks high-frequency AC while passing DC — used in EMI suppression.",
          x: 18,
          y: 78,
        },
        {
          key: "P1",
          label: "P1",
          correctComponent: "power_conn",
          tooltip:
            "P1 — JST Connector: A compact, locked power connector used in embedded and portable devices.",
          x: 68,
          y: 78,
        },
      ],
    },
  ],
  3: [
    {
      name: "High-Speed RF Communications Board",
      description:
        "An advanced RF board for wireless transmission systems. Precision placement is critical.",
      slots: [
        {
          key: "R1",
          label: "R1",
          correctComponent: "resistor",
          tooltip:
            "R1 — RF Termination Resistor: Matches impedance to 50 Ohm transmission lines preventing signal reflections.",
          x: 10,
          y: 15,
        },
        {
          key: "C1",
          label: "C1",
          correctComponent: "capacitor",
          tooltip:
            "C1 — RF Bypass Capacitor: Decouples the supply rail at GHz frequencies, stabilizing RF amplifier bias.",
          x: 32,
          y: 10,
        },
        {
          key: "U1",
          label: "U1",
          correctComponent: "ic_chip",
          tooltip:
            "U1 — RF Transceiver IC: Integrates modulator, demodulator, PA driver, and LNA in a single package.",
          x: 58,
          y: 22,
        },
        {
          key: "D1",
          label: "D1",
          correctComponent: "diode",
          tooltip:
            "D1 — PIN Diode: Used as an RF switch or attenuator in antenna switching networks.",
          x: 20,
          y: 50,
        },
        {
          key: "Q1",
          label: "Q1",
          correctComponent: "transistor",
          tooltip:
            "Q1 — GaAs FET: Gallium Arsenide transistor delivering high gain and low noise at microwave frequencies.",
          x: 46,
          y: 56,
        },
        {
          key: "X1",
          label: "X1",
          correctComponent: "crystal",
          tooltip:
            "X1 — VCTCXO: Voltage Controlled TCXO provides a tunable reference for phase-locked loop circuits.",
          x: 72,
          y: 50,
        },
        {
          key: "L1",
          label: "L1",
          correctComponent: "inductor",
          tooltip:
            "L1 — RF Ferrite Bead: Suppresses common-mode noise on power and signal lines entering the RF stage.",
          x: 16,
          y: 76,
        },
        {
          key: "P1",
          label: "P1",
          correctComponent: "power_conn",
          tooltip:
            "P1 — SMA Connector: Industry-standard 50 Ohm RF coaxial connector for antenna connection.",
          x: 66,
          y: 76,
        },
      ],
    },
  ],
};

// ─── PC Builder component ────────────────────────────────────────────────────
function PCBuilder({ config, onGameEnd }: Props) {
  const designs = BOARD_DESIGNS[config.difficulty];
  const [designIdx, setDesignIdx] = useState(0);
  const board = designs[designIdx % designs.length];
  const [phase, setPhase] = useState<"idle" | "play" | "powered">("idle");
  const [placements, setPlacements] = useState<
    Partial<Record<SlotKey, string>>
  >({});
  const [selectedSlot, setSelectedSlot] = useState<SlotKey | null>(null);
  const [wrongFlash, setWrongFlash] = useState<SlotKey | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<SlotKey | null>(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalPlacements, setTotalPlacements] = useState(0);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        totalPlacements > 0
          ? ((totalPlacements - errors) / totalPlacements) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.max(0, acc),
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, totalPlacements, errors],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  function startGame() {
    setPlacements({});
    setSelectedSlot(null);
    setPhase("play");
    startTime.current = Date.now();
    gameOverRef.current = false;
  }

  function handleSlotClick(slotKey: SlotKey) {
    if (placements[slotKey]) return;
    setSelectedSlot(slotKey);
  }

  function handleComponentClick(compKey: string) {
    if (!selectedSlot) return;
    const slot = board.slots.find((s) => s.key === selectedSlot);
    if (!slot) return;
    setTotalPlacements((t) => t + 1);
    if (compKey === slot.correctComponent) {
      const next = { ...placements, [selectedSlot]: compKey };
      setPlacements(next);
      setScore((s) => s + 200 * config.difficulty);
      setSelectedSlot(null);
      if (Object.keys(next).length === board.slots.length) {
        setTimeout(() => setPhase("powered"), 400);
        setScore((s) => s + 500 * config.difficulty);
      }
    } else {
      setWrongFlash(selectedSlot);
      setErrors((e) => e + 1);
      setTimeout(() => setWrongFlash(null), 600);
    }
  }

  function nextBoard() {
    const nextIdx = designIdx + 1;
    if (nextIdx >= designs.length) {
      endGame(true);
      return;
    }
    setDesignIdx(nextIdx);
    setPlacements({});
    setSelectedSlot(null);
    setPhase("play");
  }

  const allPlaced = board.slots.every((s) => !!placements[s.key]);
  const timePct = (timeLeft / config.timeLimit) * 100;
  const timerBarStyle = { width: `${timePct}%` } as const;

  function getSlotBorderColor(slot: BoardSlot): string {
    const comp = COMPONENTS.find((c) => c.key === slot.correctComponent);
    if (placements[slot.key]) return comp?.color ?? "#10b981";
    if (wrongFlash === slot.key) return "#f43f5e";
    if (selectedSlot === slot.key) return "#00f5ff";
    return "rgba(100,100,120,0.6)";
  }

  function getSlotBg(slot: BoardSlot): string {
    if (placements[slot.key]) {
      const comp = COMPONENTS.find((c) => c.key === slot.correctComponent);
      return `${comp?.color ?? "#10b981"}22`;
    }
    if (wrongFlash === slot.key) return "rgba(244,63,94,0.2)";
    if (selectedSlot === slot.key) return "rgba(0,245,255,0.15)";
    return "rgba(10,10,20,0.7)";
  }

  function getPlacedLabel(slot: BoardSlot): string {
    const comp = COMPONENTS.find((c) => c.key === placements[slot.key]);
    return comp?.symbol ?? slot.label;
  }

  const hoveredSlotData = board.slots.find((s) => s.key === hoveredSlot);

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="computer_engineering.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#7c3aed]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] transition-all duration-1000"
            style={timerBarStyle}
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Placed:{" "}
            <span className="text-[#10b981] font-bold">
              {Object.keys(placements).length}/{board.slots.length}
            </span>
          </span>
          <span>
            Errors: <span className="text-[#f43f5e] font-bold">{errors}</span>
          </span>
          <span>{timeLeft}s</span>
        </div>
      </div>

      {phase === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
          >
            <Cpu className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Circuit Board Assembly
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Click a slot on the PCB, then click the correct component from the
              tray to place it.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Hover over slots to learn what each component does. All 8 slots
              must be filled correctly to Power On.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={startGame}
              data-ocid="computer_engineering.start_button"
            >
              Start Assembly
            </GlowButton>
          </motion.div>
        </div>
      )}

      {phase === "play" && (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {board.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {board.description}
              </p>
            </div>
            {selectedSlot && (
              <span className="text-xs text-[#00f5ff] font-bold bg-[#00f5ff]/10 px-2 py-1 rounded border border-[#00f5ff]/30">
                Slot {selectedSlot} selected
              </span>
            )}
          </div>

          <div
            className="relative flex-1 glass-card rounded-xl border border-[#7c3aed]/30 overflow-hidden"
            style={{ minHeight: "200px", maxHeight: "280px" }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Circuit board trace lines"
            >
              <path
                d="M 15% 20% L 40% 15% L 62% 30% L 50% 60% L 75% 55%"
                stroke="#7c3aed"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
              />
              <path
                d="M 25% 55% L 50% 60% L 68% 78%"
                stroke="#00f5ff"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
              />
              <path
                d="M 20% 80% L 50% 60% L 70% 80%"
                stroke="#f59e0b"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
              />
            </svg>
            {board.slots.map((slot) => {
              const placed = !!placements[slot.key];
              const comp = placed
                ? COMPONENTS.find((c) => c.key === placements[slot.key])
                : null;
              const borderColor = getSlotBorderColor(slot);
              const bg = getSlotBg(slot);
              const slotStyle = {
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                transform: "translate(-50%, -50%)",
                borderColor,
                background: bg,
                boxShadow: placed
                  ? `0 0 12px ${comp?.color ?? "#10b981"}66`
                  : wrongFlash === slot.key
                    ? "0 0 12px rgba(244,63,94,0.6)"
                    : "none",
              } as const;
              return (
                <button
                  key={slot.key}
                  type="button"
                  className="absolute w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all"
                  style={slotStyle}
                  onClick={() => handleSlotClick(slot.key)}
                  onMouseEnter={() => setHoveredSlot(slot.key)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  data-ocid={`computer_engineering.slot.${slot.key}`}
                >
                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        comp?.color ??
                        (selectedSlot === slot.key ? "#00f5ff" : "#9ca3af"),
                    }}
                  >
                    {placed ? getPlacedLabel(slot) : slot.label}
                  </span>
                  {placed && (
                    <CheckCircle
                      className="h-3 w-3"
                      style={{ color: comp?.color ?? "#10b981" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {hoveredSlotData && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="glass-card rounded-lg p-2 border border-[#7c3aed]/40 text-xs text-muted-foreground flex items-start gap-2"
              >
                <Info className="h-3.5 w-3.5 text-[#7c3aed] shrink-0 mt-0.5" />
                <span>{hoveredSlotData.tooltip}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {selectedSlot
                ? `Select component for ${selectedSlot}`
                : "Click a slot first, then choose component"}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {COMPONENTS.map((comp) => {
                const alreadyUsed = Object.values(placements).includes(
                  comp.key,
                );
                const compStyle = alreadyUsed
                  ? { borderColor: `${comp.color}33`, opacity: 0.4 }
                  : { borderColor: `${comp.color}44` };
                return (
                  <button
                    key={comp.key}
                    type="button"
                    disabled={!selectedSlot || alreadyUsed}
                    onClick={() => handleComponentClick(comp.key)}
                    className="rounded-lg border p-2 flex flex-col items-center gap-1 text-center transition-all hover:scale-105 disabled:cursor-not-allowed"
                    style={compStyle}
                    data-ocid={`computer_engineering.component.${comp.key}`}
                  >
                    <div
                      className="w-8 h-8 rounded font-bold text-sm flex items-center justify-center"
                      style={{
                        background: `${comp.color}22`,
                        color: comp.color,
                      }}
                    >
                      {comp.symbol}
                    </div>
                    <span className="text-xs text-foreground leading-tight">
                      {comp.name}
                    </span>
                    {alreadyUsed && (
                      <span className="text-xs" style={{ color: comp.color }}>
                        Placed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {allPlaced && (
            <GlowButton
              variant="primary"
              onClick={() => setPhase("powered")}
              data-ocid="computer_engineering.power_on_button"
            >
              <Zap className="h-4 w-4 mr-2" /> Power On
            </GlowButton>
          )}
        </div>
      )}

      {phase === "powered" && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-card rounded-2xl p-8 text-center max-w-lg w-full border-2"
            style={{
              borderColor: "#10b981",
              boxShadow: "0 0 40px rgba(16,185,129,0.35)",
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px #10b981",
                  "0 0 30px #10b981",
                  "0 0 10px #10b981",
                ],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: "rgba(16,185,129,0.2)",
                border: "2px solid #10b981",
              }}
            >
              <Zap className="h-8 w-8 text-[#10b981]" />
            </motion.div>
            <h2
              className="text-2xl font-black mb-1"
              style={{ color: "#10b981", fontFamily: "'Orbitron', sans-serif" }}
            >
              SYSTEM ONLINE
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              All 8 components correctly placed. Circuit integrity: 100%.
            </p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {board.slots.map((slot) => {
                const comp = COMPONENTS.find(
                  (c) => c.key === slot.correctComponent,
                );
                const ledStyle = {
                  background: comp?.color,
                  boxShadow: `0 0 8px ${comp?.color}`,
                } as const;
                return (
                  <motion.div
                    key={slot.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: board.slots.indexOf(slot) * 0.1 }}
                    className="rounded-lg p-2 flex flex-col items-center gap-1"
                    style={{
                      background: `${comp?.color ?? "#10b981"}15`,
                      border: `1px solid ${comp?.color ?? "#10b981"}44`,
                    }}
                  >
                    <div className="w-3 h-3 rounded-full" style={ledStyle} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: comp?.color }}
                    >
                      {slot.label}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full text-center">
                      {comp?.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <CheckCircle className="h-4 w-4 text-[#10b981]" />
              <span className="text-sm font-bold text-[#00f5ff]">
                Score: {score.toLocaleString()} pts
              </span>
            </div>
            {designIdx + 1 < designs.length ? (
              <GlowButton
                variant="primary"
                onClick={nextBoard}
                data-ocid="computer_engineering.next_board_button"
              >
                Next Board Design
              </GlowButton>
            ) : (
              <GlowButton
                variant="primary"
                onClick={() => endGame(true)}
                data-ocid="computer_engineering.finish_button"
              >
                Complete Mission
              </GlowButton>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Binary Converter ─────────────────────────────────────────────────────────
type ConvType = "dec2bin" | "dec2hex" | "bin2hex";

interface ConvProblem {
  type: ConvType;
  question: string;
  answer: string;
  explanation: string;
}

function generateConvProblem(idx: number): ConvProblem {
  const types: ConvType[] = ["dec2bin", "dec2hex", "bin2hex"];
  const type = types[idx % 3];
  if (type === "dec2bin") {
    const n = Math.floor(Math.random() * 220) + 1;
    return {
      type,
      question: `Convert ${n} (decimal) to binary`,
      answer: n.toString(2),
      explanation: `${n} in binary is ${n.toString(2)}`,
    };
  }
  if (type === "dec2hex") {
    const n = Math.floor(Math.random() * 240) + 1;
    return {
      type,
      question: `Convert ${n} (decimal) to hexadecimal`,
      answer: n.toString(16).toUpperCase(),
      explanation: `${n} in hex is ${n.toString(16).toUpperCase()}`,
    };
  }
  const n = Math.floor(Math.random() * 240) + 1;
  const bin = n.toString(2).padStart(8, "0");
  return {
    type: "bin2hex",
    question: `Convert ${bin} (binary) to hexadecimal`,
    answer: n.toString(16).toUpperCase(),
    explanation: `${bin} = ${n} decimal = ${n.toString(16).toUpperCase()} hex`,
  };
}

const TOTAL_CONV = 20;

function BinaryConverter({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [problemIdx, setProblemIdx] = useState(0);
  const [problems] = useState(() =>
    Array.from({ length: TOTAL_CONV }, (_, i) => generateConvProblem(i)),
  );
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    msg: string;
    ok: boolean;
    exp: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showExp, setShowExp] = useState(false);
  const [probTime, setProbTime] = useState(12);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const gameOverRef = useRef(false);

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / TOTAL_CONV) * 100,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  useEffect(() => {
    if (phase !== "playing") return;
    if (probTime <= 0) {
      setStreak(0);
      setFeedback({
        msg: "Time up!",
        ok: false,
        exp: problems[problemIdx].explanation,
      });
      setShowExp(true);
      setTimeout(() => advance(), 2000);
    }
    const t = setTimeout(() => setProbTime((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [probTime, phase]);

  function advance() {
    const next = problemIdx + 1;
    if (next >= TOTAL_CONV) {
      endGame(true);
      return;
    }
    setProblemIdx(next);
    setInput("");
    setFeedback(null);
    setShowExp(false);
    setProbTime(12);
  }

  function submit() {
    const prob = problems[problemIdx];
    const userAns = input.trim().toUpperCase();
    const correct_ans = prob.answer.toUpperCase();
    const ok = userAns === correct_ans;
    const newStreak = ok ? streak + 1 : 0;
    const multiplier = Math.min(newStreak, 4);
    const pts = ok ? (150 + multiplier * 50) * config.difficulty : 0;
    setStreak(newStreak);
    setScore((s) => s + pts);
    if (ok) setCorrect((c) => c + 1);
    setFeedback({
      msg: ok
        ? `Correct! x${multiplier + 1} streak bonus`
        : `Wrong. Answer: ${prob.answer}`,
      ok,
      exp: prob.explanation,
    });
    setShowExp(true);
    setTimeout(() => advance(), 2200);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const prob = problems[problemIdx];
  const typeLabel: Record<ConvType, string> = {
    dec2bin: "DEC → BIN",
    dec2hex: "DEC → HEX",
    bin2hex: "BIN → HEX",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="binary_converter.page"
    >
      <div className="flex items-center justify-between text-sm shrink-0">
        <span className="text-[#00f5ff] font-mono font-bold">
          {score.toLocaleString()} pts
        </span>
        <div className="w-32 h-2 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-[#00f5ff] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">{timeLeft}s</span>
      </div>

      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Binary Converter
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            20 timed conversion problems: Decimal to Binary, Decimal to Hex, and
            Binary to Hex. Build streaks for score multipliers. Step-by-step
            explanations after every answer.
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            {(["DEC → BIN", "DEC → HEX", "BIN → HEX"] as const).map((t) => (
              <div
                key={t}
                className="rounded-lg border border-[#00f5ff]/20 p-3 bg-card/40"
              >
                <div className="font-bold text-[#00f5ff]">{t}</div>
              </div>
            ))}
          </div>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            data-ocid="binary_converter.start_button"
          >
            Start
          </GlowButton>
        </motion.div>
      )}

      {phase === "playing" && (
        <AnimatePresence mode="wait">
          <motion.div
            key={problemIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Problem {problemIdx + 1}/{TOTAL_CONV}
              </span>
              <span className="text-[#f59e0b] font-bold">Streak: {streak}</span>
              <span className={probTime <= 4 ? "text-[#f43f5e] font-bold" : ""}>
                {probTime}s
              </span>
            </div>

            <div className="rounded-xl border border-[#00f5ff]/30 bg-card/50 p-5">
              <div className="text-xs font-bold text-[#00f5ff] uppercase tracking-widest mb-3">
                {typeLabel[prob.type]}
              </div>
              <div
                className="text-2xl font-black text-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {prob.question}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !feedback && submit()}
                disabled={!!feedback}
                className="flex-1 rounded-lg border border-[#00f5ff]/30 bg-background px-4 py-2 font-mono text-lg focus:border-[#00f5ff] focus:outline-none uppercase"
                placeholder="Your answer"
                data-ocid="binary_converter.input"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!!feedback}
                className="px-5 py-2 rounded-lg font-bold text-black hover:opacity-90 disabled:opacity-50"
                style={{ background: "#00f5ff" }}
                data-ocid="binary_converter.submit_button"
              >
                Check
              </button>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl border p-4 space-y-2 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`}
                >
                  <p
                    className={`font-bold ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                  >
                    {feedback.msg}
                  </p>
                  {showExp && (
                    <p className="text-sm text-muted-foreground">
                      {feedback.exp}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Hardware Quiz ─────────────────────────────────────────────────────────────
interface HWQuestion {
  description: string;
  specs: string;
  correctName: string;
  correctFunction: string;
  options: string[];
}

const HW_QUESTIONS_D1: HWQuestion[] = [
  {
    description:
      "A rectangular silicon package with metal pins on both sides, inserted into a long socket on the motherboard.",
    specs: "DDR4, 3200MHz, 16GB",
    correctName: "RAM Module",
    correctFunction: "Temporary data storage for active programs",
    options: ["RAM Module", "GPU", "SSD", "CPU", "PSU"],
  },
  {
    description:
      "A large fan-cooled block mounted directly on the CPU. Contains heat pipes and aluminum fins.",
    specs: "TDP: 95W, 4 heat pipes",
    correctName: "CPU Cooler",
    correctFunction: "Dissipates heat generated by the processor",
    options: ["CPU Cooler", "RAM Module", "GPU", "HDD", "Power Supply"],
  },
  {
    description:
      "A flat, rectangular circuit board with expansion slots, CPU socket, and RAM slots.",
    specs: "ATX form factor, LGA1700 socket",
    correctName: "Motherboard",
    correctFunction: "Connects all PC components and routes signals",
    options: ["Motherboard", "GPU", "SSD", "HDD", "PSU"],
  },
  {
    description:
      "A small rectangular box with a cable bundle, converts AC power to DC voltages.",
    specs: "650W, 80+ Gold certified",
    correctName: "Power Supply Unit",
    correctFunction: "Converts mains AC to DC voltages for components",
    options: ["Power Supply Unit", "CPU", "RAM Module", "SSD", "Motherboard"],
  },
  {
    description:
      "A small rectangular chip in a plastic package, the primary computation unit.",
    specs: "3.6GHz base, 12 cores, 24 threads",
    correctName: "CPU",
    correctFunction: "Executes program instructions and arithmetic operations",
    options: ["CPU", "GPU", "RAM Module", "SSD", "Motherboard"],
  },
];

const HW_QUESTIONS_D2: HWQuestion[] = [
  {
    description:
      "A PCIe card with GDDR6 memory, multiple fans, and display connectors.",
    specs: "8GB GDDR6, 2304 shader cores",
    correctName: "GPU",
    correctFunction: "Renders graphics and executes parallel compute tasks",
    options: ["GPU", "CPU", "RAM Module", "SSD", "Sound Card"],
  },
  {
    description:
      "A flat circuit board with NAND flash chips, connects via M.2 slot.",
    specs: "1TB NVMe, 3500MB/s read",
    correctName: "NVMe SSD",
    correctFunction: "Non-volatile storage with near-RAM access speeds",
    options: ["NVMe SSD", "HDD", "RAM Module", "GPU", "Optical Drive"],
  },
  {
    description:
      "A spinning magnetic disk with read/write heads and a motor-driven platter.",
    specs: "4TB, 7200 RPM, SATA III",
    correctName: "HDD",
    correctFunction: "Stores data on magnetic platters at high density",
    options: ["HDD", "SSD", "GPU", "CPU", "RAM Module"],
  },
  {
    description:
      "A small chip near the CPU socket with a coin cell battery backup.",
    specs: "256-byte storage, real-time clock",
    correctName: "CMOS Chip",
    correctFunction: "Stores BIOS settings and maintains system clock",
    options: ["CMOS Chip", "RAM Module", "CPU", "GPU", "BIOS Chip"],
  },
  {
    description:
      "A PCIe card with optical connectors and audio processing circuitry.",
    specs: "24-bit, 192kHz, SNR 120dB",
    correctName: "Sound Card",
    correctFunction:
      "Processes digital audio signals for playback and recording",
    options: ["Sound Card", "GPU", "NIC", "RAM Module", "Modem"],
  },
];

const HW_QUESTIONS_D3: HWQuestion[] = [
  {
    description:
      "A chip that manages USB, SATA, PCIe lanes and communication between CPU and peripherals.",
    specs: "Intel Z790 chipset, 40 PCIe lanes",
    correctName: "Chipset",
    correctFunction: "Routes data between CPU, RAM, and I/O controllers",
    options: ["Chipset", "CPU", "CMOS", "GPU", "BIOS ROM"],
  },
  {
    description:
      "A dedicated PCIe card with RJ45 connector and LAN controller IC.",
    specs: "10GbE, Intel I225-V controller",
    correctName: "Network Interface Card",
    correctFunction: "Interfaces the computer to a wired network",
    options: [
      "Network Interface Card",
      "Sound Card",
      "GPU",
      "Modem",
      "Wi-Fi Card",
    ],
  },
  {
    description:
      "A small flash chip near the power connector on the motherboard, contains boot code.",
    specs: "16MB SPI flash, UEFI firmware",
    correctName: "BIOS ROM",
    correctFunction: "Stores firmware that initializes hardware during POST",
    options: ["BIOS ROM", "CMOS Chip", "RAM Module", "Chipset", "CPU"],
  },
  {
    description:
      "A small rectangular PCIe card with antenna connectors and radio modules.",
    specs: "Wi-Fi 6E, 802.11ax, Bluetooth 5.3",
    correctName: "Wi-Fi Card",
    correctFunction: "Provides wireless network and Bluetooth connectivity",
    options: ["Wi-Fi Card", "NIC", "Sound Card", "GPU", "Modem"],
  },
  {
    description:
      "A modular power distribution circuit integrated on the motherboard near the CPU socket.",
    specs: "12+2 phase, 80A per phase",
    correctName: "VRM",
    correctFunction: "Regulates and stabilizes voltage delivered to the CPU",
    options: ["VRM", "Chipset", "Capacitor Bank", "CPU", "MOSFET Array"],
  },
];

const HW_QUESTION_SETS: Record<1 | 2 | 3, HWQuestion[]> = {
  1: HW_QUESTIONS_D1,
  2: HW_QUESTIONS_D2,
  3: HW_QUESTIONS_D3,
};

function HardwareQuiz({ config, onGameEnd }: Props) {
  const allQ = HW_QUESTION_SETS[config.difficulty];
  const total = Math.min(15, allQ.length * 3);
  const [questions] = useState(() => {
    const q: HWQuestion[] = [];
    while (q.length < total) {
      for (const item of allQ) {
        if (q.length < total) q.push(item);
      }
    }
    return q;
  });
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const gameOverRef = useRef(false);

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / total) * 100,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, total],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  const q = questions[idx];
  const timePct = (timeLeft / config.timeLimit) * 100;

  function confirm() {
    if (!selectedName || confirmed) return;
    setConfirmed(true);
    const ok = selectedName === q.correctName;
    const pts = ok ? 300 * config.difficulty : 0;
    setScore((s) => s + pts);
    if (ok) setCorrect((c) => c + 1);
    setFeedback(ok ? "correct" : "wrong");
    setTimeout(() => {
      const next = idx + 1;
      if (next >= total) {
        endGame(true);
        return;
      }
      setIdx(next);
      setSelectedName(null);
      setConfirmed(false);
      setFeedback(null);
    }, 1800);
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="hardware_quiz.page"
    >
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[#e879f9] font-bold text-sm">
          {score.toLocaleString()} pts
        </span>
        <div className="w-32 h-2 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-[#e879f9] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">{timeLeft}s</span>
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
            Hardware Identifier
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read the hardware description and specs, then identify the
            component. {total} questions with increasing difficulty. No guessing
            — read the specs carefully.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            data-ocid="hardware_quiz.start_button"
          >
            Begin Identification
          </GlowButton>
        </motion.div>
      )}

      {phase === "playing" && q && (
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="text-xs text-muted-foreground">
              Question {idx + 1} / {total}
            </div>

            <div className="rounded-xl border border-[#e879f9]/30 bg-card/50 p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#e879f9] font-bold">
                Hardware Description
              </div>
              <p className="text-sm leading-relaxed">{q.description}</p>
              <div className="rounded border border-border/20 bg-background/60 px-3 py-2 font-mono text-xs text-muted-foreground">
                {q.specs}
              </div>
            </div>

            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Identify this component:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt) => {
                let borderColor = "rgba(100,100,120,0.4)";
                let bg = "rgba(10,10,20,0.5)";
                if (selectedName === opt && !confirmed) {
                  borderColor = "#e879f9";
                  bg = "rgba(232,121,249,0.12)";
                }
                if (confirmed && opt === q.correctName) {
                  borderColor = "#10b981";
                  bg = "rgba(16,185,129,0.12)";
                }
                if (
                  confirmed &&
                  opt === selectedName &&
                  opt !== q.correctName
                ) {
                  borderColor = "#f43f5e";
                  bg = "rgba(244,63,94,0.12)";
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={confirmed}
                    onClick={() => setSelectedName(opt)}
                    className="w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                    style={{ borderColor, background: bg }}
                    data-ocid={`hardware_quiz.option.${opt.replace(/\s+/g, "_")}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!confirmed && selectedName && (
              <button
                type="button"
                onClick={confirm}
                className="px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90"
                style={{ background: "#e879f9", color: "black" }}
                data-ocid="hardware_quiz.confirm_button"
              >
                Confirm Answer
              </button>
            )}

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-xl border p-3 text-sm ${feedback === "correct" ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                >
                  {feedback === "correct" ? (
                    <>
                      <p className="font-bold">
                        Correct! +{300 * config.difficulty} pts
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Function: {q.correctFunction}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold">
                        Incorrect. Answer: {q.correctName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Function: {q.correctFunction}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Root router ──────────────────────────────────────────────────────────────
export default function ComputerEngineering({ config, onGameEnd }: Props) {
  switch (config.gameId) {
    case "binary-converter":
      return <BinaryConverter config={config} onGameEnd={onGameEnd} />;
    case "hardware-quiz":
      return <HardwareQuiz config={config} onGameEnd={onGameEnd} />;
    default:
      return <PCBuilder config={config} onGameEnd={onGameEnd} />;
  }
}
