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

interface Round {
  targetDist: number;
  falsePositiveDist: number;
  minRange: number;
  maxRange: number;
  optimalMin: number;
  optimalMax: number;
  description: string;
}

const ROUNDS: Round[] = [
  {
    targetDist: 30,
    falsePositiveDist: 10,
    minRange: 5,
    maxRange: 100,
    optimalMin: 20,
    optimalMax: 45,
    description:
      "Detect the wall at 30cm without triggering the nearby cable at 10cm",
  },
  {
    targetDist: 60,
    falsePositiveDist: 20,
    minRange: 5,
    maxRange: 150,
    optimalMin: 40,
    optimalMax: 75,
    description: "Detect the box at 60cm, ignore the floor reflection at 20cm",
  },
  {
    targetDist: 15,
    falsePositiveDist: 5,
    minRange: 2,
    maxRange: 50,
    optimalMin: 10,
    optimalMax: 22,
    description: "Detect the obstacle at 15cm, ignore sensor noise at 5cm",
  },
  {
    targetDist: 80,
    falsePositiveDist: 35,
    minRange: 10,
    maxRange: 200,
    optimalMin: 55,
    optimalMax: 100,
    description: "Detect the far wall at 80cm, skip the table leg at 35cm",
  },
  {
    targetDist: 45,
    falsePositiveDist: 15,
    minRange: 5,
    maxRange: 120,
    optimalMin: 25,
    optimalMax: 60,
    description:
      "Detect the person at 45cm without reacting to the chair at 15cm",
  },
  {
    targetDist: 25,
    falsePositiveDist: 8,
    minRange: 3,
    maxRange: 80,
    optimalMin: 15,
    optimalMax: 35,
    description: "Detect the robot arm at 25cm, ignore reflections at 8cm",
  },
  {
    targetDist: 70,
    falsePositiveDist: 30,
    minRange: 5,
    maxRange: 180,
    optimalMin: 45,
    optimalMax: 90,
    description:
      "Detect the conveyor belt end at 70cm, ignore the casing at 30cm",
  },
  {
    targetDist: 50,
    falsePositiveDist: 18,
    minRange: 5,
    maxRange: 130,
    optimalMin: 30,
    optimalMax: 65,
    description:
      "Detect the charging dock at 50cm, skip the marker tape at 18cm",
  },
];

export default function SensorRangeGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [rangeMin, setRangeMin] = useState(10);
  const [rangeMax, setRangeMax] = useState(50);
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
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 85 : 40,
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
  const round = ROUNDS[idx];

  function startGame() {
    startRef.current = Date.now();
    setIdx(0);
    setScore(0);
    setLives(config.livesCount);
    setRangeMin(10);
    setRangeMax(50);
    setPhase("playing");
    startTimer();
  }

  function submit() {
    if (flash) return;
    const detectsTarget =
      rangeMin <= round.targetDist && round.targetDist <= rangeMax;
    const detectsFP =
      rangeMin <= round.falsePositiveDist &&
      round.falsePositiveDist <= rangeMax;
    if (detectsTarget && !detectsFP) {
      setFlash("ok");
      const precision =
        100 -
        Math.abs(rangeMin - round.optimalMin) -
        Math.abs(rangeMax - round.optimalMax);
      setScore(
        (s) =>
          s + Math.max(100, precision * config.difficulty * 3) + timeLeft * 2,
      );
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
      if (idx + 1 >= 8) endGame(true);
      else {
        setIdx((i) => i + 1);
        setRangeMin(10);
        setRangeMax(50);
      }
    }, 1200);
  }

  const vizWidth = 320;
  const toX = (v: number) =>
    ((v - round.minRange) / (round.maxRange - round.minRange)) * vizWidth;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="sensor_range.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
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
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Sensor Range
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Adjust the sensor detection range using the sliders. Detect the
            target object without triggering false positives.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="sensor_range.start_button"
          >
            Calibrate Sensors
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#00f5ff]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Round {idx + 1}/8 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`rounded-xl border-2 p-3 transition-all ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-border/30 bg-card/20"
            }`}
          >
            <p className="text-sm text-foreground">{round.description}</p>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/20 p-4">
            <div className="text-xs text-muted-foreground mb-3">
              SENSOR VISUALIZATION (cm)
            </div>
            <div
              className="relative h-12 w-full"
              style={{ maxWidth: `${vizWidth}px` }}
            >
              <div
                className="absolute inset-y-0 rounded bg-[#00f5ff]/10 border border-[#00f5ff]/30"
                style={{
                  left: `${(toX(rangeMin) / vizWidth) * 100}%`,
                  width: `${((toX(rangeMax) - toX(rangeMin)) / vizWidth) * 100}%`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#f43f5e]"
                title="False positive"
                style={{
                  left: `${(toX(round.falsePositiveDist) / vizWidth) * 100}%`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#10b981]"
                title="Target"
                style={{ left: `${(toX(round.targetDist) / vizWidth) * 100}%` }}
              />
              <div
                className="absolute -bottom-4 text-[10px] text-[#f43f5e] -translate-x-1/2"
                style={{
                  left: `${(toX(round.falsePositiveDist) / vizWidth) * 100}%`,
                }}
              >
                {round.falsePositiveDist}cm
              </div>
              <div
                className="absolute -bottom-4 text-[10px] text-[#10b981] -translate-x-1/2"
                style={{ left: `${(toX(round.targetDist) / vizWidth) * 100}%` }}
              >
                {round.targetDist}cm
              </div>
            </div>
            <div className="flex gap-4 text-xs mt-8">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#10b981] inline-block" />
                Target
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#f43f5e] inline-block" />
                False Positive
              </span>
            </div>
          </div>
          <div className="grid gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Min Range</span>
                <span className="text-[#00f5ff] font-mono">{rangeMin}cm</span>
              </div>
              <input
                type="range"
                min={round.minRange}
                max={round.maxRange}
                value={rangeMin}
                onChange={(e) =>
                  setRangeMin(Math.min(Number(e.target.value), rangeMax - 5))
                }
                className="w-full accent-[#00f5ff]"
                data-ocid="sensor_range.min_slider"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Max Range</span>
                <span className="text-[#00f5ff] font-mono">{rangeMax}cm</span>
              </div>
              <input
                type="range"
                min={round.minRange}
                max={round.maxRange}
                value={rangeMax}
                onChange={(e) =>
                  setRangeMax(Math.max(Number(e.target.value), rangeMin + 5))
                }
                className="w-full accent-[#00f5ff]"
                data-ocid="sensor_range.max_slider"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            className="py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="sensor_range.submit_button"
          >
            Confirm Range
          </button>
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            CALIBRATED
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
        </motion.div>
      )}
    </div>
  );
}
