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

const SENSORS = [
  {
    id: "proximity",
    name: "Proximity",
    desc: "Measures distance to nearby objects using ultrasonic or infrared waves",
  },
  {
    id: "temperature",
    name: "Temperature",
    desc: "Detects heat or cold levels in the environment",
  },
  {
    id: "light",
    name: "Light",
    desc: "Measures ambient light intensity in lux",
  },
  {
    id: "sound",
    name: "Sound",
    desc: "Detects audio levels and vibrations in decibels",
  },
  {
    id: "motion",
    name: "Motion",
    desc: "Detects movement using PIR or accelerometer technology",
  },
  {
    id: "pressure",
    name: "Pressure",
    desc: "Measures force or weight applied to a surface",
  },
];

const SCENARIOS = [
  { text: "A robot needs to stop before hitting a wall.", answer: "proximity" },
  {
    text: "The factory robot must shut down if it overheats.",
    answer: "temperature",
  },
  {
    text: "A robot activates its headlights when it gets dark.",
    answer: "light",
  },
  {
    text: "A security robot alerts when it hears a loud noise.",
    answer: "sound",
  },
  {
    text: "A robot wakes from sleep when a person enters the room.",
    answer: "motion",
  },
  {
    text: "A robot checks if a package is too heavy to lift.",
    answer: "pressure",
  },
  { text: "A robot detects another robot 30cm away.", answer: "proximity" },
  {
    text: "The greenhouse robot monitors if plants need cooling.",
    answer: "temperature",
  },
  {
    text: "A robot draws curtains when sunlight exceeds a threshold.",
    answer: "light",
  },
  {
    text: "A robot steps on a mat and measures the force applied.",
    answer: "pressure",
  },
];

export default function SensorTypeMatch({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [rounds] = useState(() =>
    [...SCENARIOS].sort(() => Math.random() - 0.5),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [dragging, setDragging] = useState<string | null>(null);
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
    setDragging(null);
    setPhase("playing");
    startTimer();
  }

  function pick(sensorId: string) {
    if (selected !== null) return;
    setSelected(sensorId);
    const round = rounds[idx];
    if (sensorId === round.answer) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 300 * config.difficulty + timeLeft * 2);
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
    }, 1100);
  }

  const round = rounds[Math.min(idx, rounds.length - 1)];
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="sensor_type_match.page"
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
            Sensor Match
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read each robot scenario and select the correct sensor type the
            robot should use.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="sensor_type_match.start_button"
          >
            Start Matching
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
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
          <div
            className={`rounded-xl border-2 p-4 transition-all ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-[#f59e0b]/30 bg-card/30"
            }`}
          >
            <div className="text-xs text-[#f59e0b] font-semibold mb-2">
              SCENARIO
            </div>
            <p className="text-sm text-foreground font-medium">{round.text}</p>
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            SELECT THE CORRECT SENSOR:
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {SENSORS.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick(s.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selected === s.id
                    ? s.id === round.answer
                      ? "border-[#10b981] bg-[#10b981]/20"
                      : "border-[#f43f5e] bg-[#f43f5e]/20"
                    : selected !== null && s.id === round.answer
                      ? "border-[#10b981] bg-[#10b981]/20"
                      : "border-border/40 bg-card/30 hover:border-[#f59e0b]/60"
                }`}
                data-ocid={`sensor_type_match.sensor.${i + 1}`}
              >
                <div className="font-semibold text-sm text-foreground">
                  {s.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {s.desc}
                </div>
              </motion.button>
            ))}
          </div>
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
            COMPLETE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/10 correct</div>
        </motion.div>
      )}
    </div>
  );
}
