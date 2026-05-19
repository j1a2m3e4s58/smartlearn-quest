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

interface Scenario {
  condition: string;
  sensorReading: string;
  sensorValue: boolean;
  thenAction: string;
  elseAction: string;
  answer: string;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    condition: "obstacle ahead",
    sensorReading: "Proximity sensor: 5cm (obstacle detected)",
    sensorValue: true,
    thenAction: "Turn Left",
    elseAction: "Go Straight",
    answer: "Turn Left",
    explanation: "Obstacle detected — robot turns left",
  },
  {
    condition: "obstacle ahead",
    sensorReading: "Proximity sensor: 80cm (clear path)",
    sensorValue: false,
    thenAction: "Turn Left",
    elseAction: "Go Straight",
    answer: "Go Straight",
    explanation: "No obstacle — robot goes straight",
  },
  {
    condition: "light level > 500 lux",
    sensorReading: "Light sensor: 720 lux",
    sensorValue: true,
    thenAction: "Activate Solar Charge",
    elseAction: "Use Battery",
    answer: "Activate Solar Charge",
    explanation: "Light level exceeded — solar charge activated",
  },
  {
    condition: "light level > 500 lux",
    sensorReading: "Light sensor: 200 lux",
    sensorValue: false,
    thenAction: "Activate Solar Charge",
    elseAction: "Use Battery",
    answer: "Use Battery",
    explanation: "Low light — battery used",
  },
  {
    condition: "temperature > 40°C",
    sensorReading: "Temp sensor: 62°C",
    sensorValue: true,
    thenAction: "Stop and Cool Down",
    elseAction: "Continue Task",
    answer: "Stop and Cool Down",
    explanation: "Overheating — robot stops to cool",
  },
  {
    condition: "temperature > 40°C",
    sensorReading: "Temp sensor: 28°C",
    sensorValue: false,
    thenAction: "Stop and Cool Down",
    elseAction: "Continue Task",
    answer: "Continue Task",
    explanation: "Normal temperature — task continues",
  },
  {
    condition: "battery < 20%",
    sensorReading: "Battery: 12%",
    sensorValue: true,
    thenAction: "Return to Dock",
    elseAction: "Continue Work",
    answer: "Return to Dock",
    explanation: "Low battery — return to dock",
  },
  {
    condition: "battery < 20%",
    sensorReading: "Battery: 75%",
    sensorValue: false,
    thenAction: "Return to Dock",
    elseAction: "Continue Work",
    answer: "Continue Work",
    explanation: "Sufficient battery — work continues",
  },
  {
    condition: "sound level > 80dB",
    sensorReading: "Sound sensor: 93dB",
    sensorValue: true,
    thenAction: "Alert Human Operator",
    elseAction: "Stay Silent",
    answer: "Alert Human Operator",
    explanation: "Loud noise detected — alert triggered",
  },
  {
    condition: "sound level > 80dB",
    sensorReading: "Sound sensor: 35dB",
    sensorValue: false,
    thenAction: "Alert Human Operator",
    elseAction: "Stay Silent",
    answer: "Stay Silent",
    explanation: "Quiet environment — no alert",
  },
];

export default function ConditionalBranchGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [scenarios] = useState(() =>
    [...SCENARIOS].sort(() => Math.random() - 0.5),
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

  function pick(action: string) {
    if (selected !== null) return;
    setSelected(action);
    const sc = scenarios[idx];
    if (action === sc.answer) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 250 * config.difficulty + timeLeft);
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

  const sc = scenarios[Math.min(idx, scenarios.length - 1)];
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="conditional_branch.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#e879f9] transition-all duration-1000"
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
            className="text-3xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Branch Logic
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read the IF/THEN/ELSE condition and the sensor reading. Predict what
            the robot will do.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#e879f9] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="conditional_branch.start_button"
          >
            Start
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#e879f9]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {idx + 1}/10 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`rounded-xl border-2 p-4 transition-all ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-[#e879f9]/30 bg-card/30"
            }`}
          >
            <div className="font-mono text-sm">
              <div className="text-[#00f5ff]">
                IF <span className="text-[#f59e0b]">{sc.condition}</span>
              </div>
              <div className="ml-4 text-[#10b981]">
                THEN <span className="text-foreground">{sc.thenAction}</span>
              </div>
              <div className="text-[#e879f9]">
                ELSE <span className="text-foreground">{sc.elseAction}</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/30 bg-card/20 p-3">
            <div className="text-xs text-muted-foreground mb-1">
              CURRENT SENSOR READING
            </div>
            <div className="font-mono text-sm text-[#f59e0b]">
              {sc.sensorReading}
            </div>
          </div>
          <div className="text-sm font-semibold text-foreground">
            What does the robot do?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[sc.thenAction, sc.elseAction].map((action, i) => (
              <motion.button
                key={action}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick(action)}
                className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                  selected === action
                    ? action === sc.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : selected !== null && action === sc.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-border/40 bg-card/30 text-foreground hover:border-[#e879f9]/60"
                }`}
                data-ocid={`conditional_branch.option.${i + 1}`}
              >
                {action}
              </motion.button>
            ))}
          </div>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs text-center ${
                selected === sc.answer ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {sc.explanation}
            </motion.div>
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
            className="text-4xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            COMPLETE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/10 correct</div>
        </motion.div>
      )}
    </div>
  );
}
