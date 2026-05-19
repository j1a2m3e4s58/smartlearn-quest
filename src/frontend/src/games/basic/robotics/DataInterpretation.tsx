import { motion } from "motion/react";
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

interface DataQuestion {
  sensorData: Record<string, string>;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const QUESTIONS: DataQuestion[] = [
  {
    sensorData: { Distance: "15 cm", Temperature: "38°C", Light: "120 lux" },
    question: "Is the distance safe for the robot arm to extend?",
    options: [
      "Yes, safe distance",
      "No, too close — stop arm",
      "Needs more data",
      "Distance is irrelevant",
    ],
    answer: "No, too close — stop arm",
    explanation:
      "15cm is within the danger zone for arm extension (minimum 25cm)",
  },
  {
    sensorData: { Distance: "60 cm", Temperature: "22°C", Battery: "85%" },
    question: "Should the robot continue its current task?",
    options: [
      "Yes, all readings are nominal",
      "No, battery is critical",
      "No, too far from target",
      "Temperature requires cooling",
    ],
    answer: "Yes, all readings are nominal",
    explanation: "All values are in safe operating range",
  },
  {
    sensorData: {
      Temperature: "78°C",
      "Fan Speed": "2400 RPM",
      Voltage: "12.1V",
    },
    question: "What action should the robot take?",
    options: [
      "Continue normally",
      "Increase fan speed",
      "Shut down immediately",
      "Reduce voltage",
    ],
    answer: "Increase fan speed",
    explanation: "78°C is elevated; increasing fan speed prevents overheating",
  },
  {
    sensorData: { Battery: "8%", Distance: "45 cm", Load: "2.3 kg" },
    question: "What is the highest priority action?",
    options: [
      "Complete the current pick",
      "Return to charging dock",
      "Reduce load weight",
      "Pause and wait",
    ],
    answer: "Return to charging dock",
    explanation: "8% battery is critically low — always recharge first",
  },
  {
    sensorData: { Light: "2 lux", Motion: "Detected", Sound: "12 dB" },
    question: "What scenario does this data suggest?",
    options: [
      "Daytime operations",
      "Nighttime intrusion detected",
      "System malfunction",
      "Sensor error",
    ],
    answer: "Nighttime intrusion detected",
    explanation: "2 lux (very dark) + motion = likely intrusion scenario",
  },
  {
    sensorData: {
      Pressure: "0 Pa",
      "Weight Sensor": "0.0 kg",
      Proximity: "82 cm",
    },
    question: "What does the conveyor belt status indicate?",
    options: [
      "Belt is loaded",
      "Belt is empty and clear",
      "Belt is jammed",
      "Sensor is offline",
    ],
    answer: "Belt is empty and clear",
    explanation: "Zero pressure and weight with clear proximity = empty belt",
  },
  {
    sensorData: {
      "pH Level": "3.2",
      Temperature: "65°C",
      "Flow Rate": "0 L/min",
    },
    question: "What is wrong with this chemical process?",
    options: [
      "pH is perfect",
      "Temperature is too high and flow stopped",
      "Flow rate needs increase only",
      "Nothing is wrong",
    ],
    answer: "Temperature is too high and flow stopped",
    explanation:
      "pH 3.2 is acidic, 65°C is high, and zero flow rate indicates a blockage",
  },
  {
    sensorData: { GPS: "37.4°N 122.0°W", Speed: "0 km/h", Heading: "N/A" },
    question: "What is the drone doing?",
    options: [
      "Flying north",
      "Hovering stationary",
      "Moving south",
      "Returning to base",
    ],
    answer: "Hovering stationary",
    explanation:
      "Zero speed with a fixed GPS coordinate means the drone is hovering",
  },
  {
    sensorData: { Voltage: "3.1V", Current: "0.02A", Resistance: "155Ω" },
    question: "Using Ohm's Law, is the resistance reading correct?",
    options: [
      "Yes, R = V/I confirms it",
      "No, R should be ~310Ω",
      "No, R should be ~62Ω",
      "Insufficient data",
    ],
    answer: "No, R should be ~155Ω",
    explanation: "V/I = 3.1/0.02 = 155Ω — the reading is correct",
  },
  {
    sensorData: {
      Encoder: "1240 ticks",
      "Wheel Diameter": "6 cm",
      "Ticks/Rev": "360",
    },
    question: "How far has the robot traveled (approx)?",
    options: [
      "About 65 cm",
      "About 130 cm",
      "About 6.5 cm",
      "About 3.4 rotations",
    ],
    answer: "About 65 cm",
    explanation: "1240/360 = 3.44 revolutions × π × 6cm ≈ 64.9cm ≈ 65cm",
  },
];

export default function DataInterpretation({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [questions] = useState(() =>
    [...QUESTIONS].sort(() => Math.random() - 0.5),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const [correct, setCorrect] = useState(0);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const correctRef = useRef(correct);
  correctRef.current = correct;

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / 10) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startRef.current = Date.now();
    setIdx(0);
    setScore(0);
    setLives(config.livesCount);
    setCorrect(0);
    setSelected(null);
    setPhase("playing");
    startTimer();
  }

  function pick(opt: string) {
    if (selected !== null) return;
    setSelected(opt);
    const q = questions[idx];
    if (opt === q.answer) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 250 * config.difficulty + timeLeft * 2);
    } else {
      setFlash("err");
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
    }
    setTimeout(() => {
      setFlash(null);
      setSelected(null);
      if (idx + 1 >= 10) endGame(true);
      else setIdx((i) => i + 1);
    }, 1200);
  }

  const q = questions[Math.min(idx, questions.length - 1)];
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="data_interpretation.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
          style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
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
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Data Analyst
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Examine sensor data tables and answer questions about what the robot
            should do. Apply logical analysis.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="data_interpretation.start_button"
          >
            Analyze Data
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#f59e0b]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {idx + 1}/10 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/30 overflow-hidden">
            <div className="text-xs text-[#f59e0b] font-semibold px-3 pt-2 pb-1">
              SENSOR DATA TABLE
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-border/20">
                  <th className="text-left px-3 py-1.5 text-xs text-muted-foreground font-semibold">
                    Sensor
                  </th>
                  <th className="text-right px-3 py-1.5 text-xs text-muted-foreground font-semibold">
                    Reading
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(q.sensorData).map(([k, v], i) => (
                  <tr key={k} className={i % 2 === 0 ? "bg-card/20" : ""}>
                    <td className="px-3 py-2 text-foreground font-medium">
                      {k}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[#00f5ff]">
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className={`rounded-xl border-2 p-3 transition-all ${
              flash === "ok"
                ? "border-[#10b981]"
                : flash === "err"
                  ? "border-[#f43f5e]"
                  : "border-[#f59e0b]/30"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">
              {q.question}
            </p>
          </div>
          <div className="grid gap-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => pick(opt)}
                className={`w-full px-4 py-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                  selected === opt
                    ? opt === q.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : selected !== null && opt === q.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-border/40 bg-card/30 text-foreground hover:border-[#f59e0b]/60"
                }`}
                data-ocid={`data_interpretation.option.${i + 1}`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
          {selected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs ${selected === q.answer ? "text-[#10b981]" : "text-[#f43f5e]"}`}
            >
              {q.explanation}
            </motion.p>
          )}
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            ANALYSIS DONE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/10 correct</div>
        </motion.div>
      )}
    </div>
  );
}
