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

interface ComponentQ {
  name: string;
  symbol: string;
  color: string;
  options: string[];
  correct: number;
  function: string;
  unit: string;
}

const ALL_COMPONENTS: ComponentQ[] = [
  {
    name: "Resistor",
    symbol: "zigzag",
    color: "#f59e0b",
    options: ["Resistor", "Capacitor", "Inductor", "Diode"],
    correct: 0,
    function: "Limits current flow in a circuit",
    unit: "Ohms (Ω)",
  },
  {
    name: "Capacitor",
    symbol: "capacitor",
    color: "#7c3aed",
    options: ["Battery", "Capacitor", "Transistor", "Fuse"],
    correct: 1,
    function: "Stores electrical charge in an electric field",
    unit: "Farads (F)",
  },
  {
    name: "LED",
    symbol: "led",
    color: "#00f5ff",
    options: ["Photodiode", "Zener Diode", "LED", "IR Sensor"],
    correct: 2,
    function: "Emits light when forward biased",
    unit: "Volts forward / mA",
  },
  {
    name: "NPN Transistor",
    symbol: "bjt",
    color: "#10b981",
    options: ["Diode", "MOSFET", "NPN Transistor", "Op-Amp"],
    correct: 2,
    function: "Amplifies or switches signals via base current",
    unit: "Current gain (hFE)",
  },
  {
    name: "Diode",
    symbol: "diode",
    color: "#f43f5e",
    options: ["Zener Diode", "LED", "Diode", "Transistor"],
    correct: 2,
    function: "Allows current in one direction only",
    unit: "Volts forward drop",
  },
  {
    name: "Inductor",
    symbol: "inductor",
    color: "#e879f9",
    options: ["Resistor", "Capacitor", "Inductor", "Transformer"],
    correct: 2,
    function: "Stores energy in a magnetic field",
    unit: "Henrys (H)",
  },
  {
    name: "Zener Diode",
    symbol: "zener",
    color: "#f59e0b",
    options: ["Diode", "LED", "Schottky", "Zener Diode"],
    correct: 3,
    function: "Maintains constant reverse breakdown voltage",
    unit: "Zener voltage (Vz)",
  },
  {
    name: "MOSFET",
    symbol: "mosfet",
    color: "#10b981",
    options: ["BJT", "JFET", "SCR", "MOSFET"],
    correct: 3,
    function: "Voltage-controlled high-power switching",
    unit: "Threshold voltage (Vth)",
  },
  {
    name: "Op-Amp",
    symbol: "opamp",
    color: "#00f5ff",
    options: ["Logic Gate", "555 Timer", "Op-Amp", "Comparator IC"],
    correct: 2,
    function: "Amplifies differential input voltage",
    unit: "Open-loop gain (dB)",
  },
  {
    name: "Crystal Oscillator",
    symbol: "crystal",
    color: "#38bdf8",
    options: ["Capacitor", "Inductor", "Resonator", "Crystal Oscillator"],
    correct: 3,
    function: "Generates a precise stable clock frequency",
    unit: "Hertz (MHz)",
  },
];

function ComponentSVG({
  symbol,
  color,
  size = 80,
}: { symbol: string; color: string; size?: number }) {
  const s = size;
  switch (symbol) {
    case "zigzag":
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <line x1="0" y1="20" x2="10" y2="20" stroke={color} strokeWidth="2" />
          <polyline
            points="10,20 16,5 22,35 28,5 34,35 40,5 46,35 52,5 58,20"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="58"
            y1="20"
            x2="80"
            y2="20"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    case "capacitor":
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <line x1="0" y1="20" x2="32" y2="20" stroke={color} strokeWidth="2" />
          <line x1="32" y1="5" x2="32" y2="35" stroke={color} strokeWidth="3" />
          <line x1="42" y1="5" x2="42" y2="35" stroke={color} strokeWidth="3" />
          <line
            x1="42"
            y1="20"
            x2="80"
            y2="20"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    case "led":
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <line x1="0" y1="20" x2="18" y2="20" stroke={color} strokeWidth="2" />
          <polygon
            points="18,6 42,20 18,34"
            fill={`${color}30`}
            stroke={color}
            strokeWidth="2"
          />
          <line x1="42" y1="6" x2="42" y2="34" stroke={color} strokeWidth="2" />
          <line
            x1="42"
            y1="20"
            x2="70"
            y2="20"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="45"
            y1="2"
            x2="55"
            y2="-6"
            stroke={color}
            strokeWidth="1.5"
          />
          <line
            x1="52"
            y1="2"
            x2="62"
            y2="-6"
            stroke={color}
            strokeWidth="1.5"
          />
        </svg>
      );
    case "bjt":
      return (
        <svg width={s * 0.7} height={s} viewBox="0 0 60 80">
          <circle
            cx="30"
            cy="40"
            r="26"
            fill={`${color}10`}
            stroke={color}
            strokeWidth="2"
          />
          <line x1="0" y1="40" x2="20" y2="40" stroke={color} strokeWidth="2" />
          <line
            x1="20"
            y1="18"
            x2="20"
            y2="62"
            stroke={color}
            strokeWidth="3"
          />
          <line
            x1="20"
            y1="28"
            x2="50"
            y2="14"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="52"
            x2="50"
            y2="66"
            stroke={color}
            strokeWidth="2"
          />
          <polygon points="42,64 50,66 48,58" fill={color} />
        </svg>
      );
    case "diode":
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <line x1="0" y1="20" x2="22" y2="20" stroke={color} strokeWidth="2" />
          <polygon
            points="22,5 52,20 22,35"
            fill={`${color}25`}
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="52"
            y1="5"
            x2="52"
            y2="35"
            stroke={color}
            strokeWidth="2.5"
          />
          <line
            x1="52"
            y1="20"
            x2="80"
            y2="20"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    case "inductor":
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <line x1="0" y1="20" x2="10" y2="20" stroke={color} strokeWidth="2" />
          <path
            d="M10,20 Q18,2 26,20 Q34,2 42,20 Q50,2 58,20 Q66,2 74,20"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="70"
            y1="20"
            x2="80"
            y2="20"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    case "zener":
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <line x1="0" y1="20" x2="22" y2="20" stroke={color} strokeWidth="2" />
          <polygon
            points="22,5 52,20 22,35"
            fill={`${color}25`}
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="48"
            y1="5"
            x2="52"
            y2="5"
            stroke={color}
            strokeWidth="2.5"
          />
          <line
            x1="52"
            y1="5"
            x2="52"
            y2="35"
            stroke={color}
            strokeWidth="2.5"
          />
          <line
            x1="52"
            y1="35"
            x2="56"
            y2="35"
            stroke={color}
            strokeWidth="2.5"
          />
          <line
            x1="52"
            y1="20"
            x2="80"
            y2="20"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    case "mosfet":
      return (
        <svg width={s * 0.7} height={s} viewBox="0 0 60 80">
          <circle
            cx="30"
            cy="40"
            r="26"
            fill={`${color}10`}
            stroke={color}
            strokeWidth="2"
          />
          <line x1="0" y1="40" x2="18" y2="40" stroke={color} strokeWidth="2" />
          <line
            x1="18"
            y1="20"
            x2="18"
            y2="60"
            stroke={color}
            strokeWidth="3"
          />
          <line x1="22" y1="20" x2="22" y2="60" stroke="none" />
          <line
            x1="24"
            y1="24"
            x2="44"
            y2="14"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="24"
            y1="40"
            x2="44"
            y2="40"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="24"
            y1="56"
            x2="44"
            y2="66"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    case "opamp":
      return (
        <svg width={s} height={s * 0.7} viewBox="0 0 80 60">
          <polygon
            points="10,5 68,30 10,55"
            fill={`${color}15`}
            stroke={color}
            strokeWidth="2"
          />
          <line x1="0" y1="20" x2="10" y2="20" stroke={color} strokeWidth="2" />
          <line x1="0" y1="40" x2="10" y2="40" stroke={color} strokeWidth="2" />
          <line
            x1="68"
            y1="30"
            x2="80"
            y2="30"
            stroke={color}
            strokeWidth="2"
          />
          <text x="22" y="26" fill={color} fontSize="12" fontWeight="bold">
            +
          </text>
          <text x="22" y="44" fill={color} fontSize="12" fontWeight="bold">
            -
          </text>
        </svg>
      );
    default:
      return (
        <svg width={s} height={s / 2} viewBox="0 0 80 40">
          <rect
            x="10"
            y="8"
            width="60"
            height="24"
            rx="4"
            fill={`${color}20`}
            stroke={color}
            strokeWidth="2"
          />
          <text x="40" y="24" textAnchor="middle" fill={color} fontSize="9">
            ~
          </text>
        </svg>
      );
  }
}

export default function ComponentIdentifier({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 8 : 10;
  const questions = ALL_COMPONENTS.slice(0, count);
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
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

  function handleAnswer(optIdx: number) {
    if (revealed) return;
    const q = questions[idx];
    setChosen(optIdx);
    setRevealed(true);
    if (optIdx === q.correct) {
      const pts = 300 * config.difficulty + timeLeft * 4;
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
      data-ocid="component_identifier.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
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
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Component Identifier
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Identify electronic components from their schematic symbols. Score
            points for speed and accuracy.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90"
            data-ocid="component_identifier.start_button"
          >
            Identify Components
          </button>
        </motion.div>
      )}
      {phase === "playing" && q && (
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#f59e0b]">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="rounded-xl border border-[#f59e0b]/30 bg-card/40 p-6 flex flex-col items-center gap-3">
                <p className="text-xs uppercase tracking-widest text-[#f59e0b]">
                  Identify this component symbol
                </p>
                <ComponentSVG symbol={q.symbol} color={q.color} size={80} />
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-2"
                  >
                    <p className="text-xs text-muted-foreground">
                      {q.function}
                    </p>
                    <p className="text-xs text-[#f59e0b] mt-1">
                      Unit: {q.unit}
                    </p>
                  </motion.div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {q.options.map((opt, i) => {
                  let cls =
                    "border-border/30 bg-card/60 hover:border-[#f59e0b]/50";
                  if (revealed && i === q.correct)
                    cls = "border-[#10b981] bg-[#10b981]/10 text-[#10b981]";
                  else if (revealed && i === chosen && i !== q.correct)
                    cls = "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]";
                  return (
                    <button
                      key={`opt-${i}`}
                      type="button"
                      onClick={() => handleAnswer(i)}
                      disabled={revealed}
                      className={`px-3 py-3 rounded-xl border-2 font-bold text-sm transition-all ${cls} disabled:cursor-not-allowed`}
                      data-ocid={`component_identifier.option.${i + 1}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
