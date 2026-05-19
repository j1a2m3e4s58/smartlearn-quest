import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const TARGETS = [40, 60, 75, 30, 55];

export default function AltitudeControl({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [round, setRound] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [throttle, setThrottle] = useState(false);
  const [brake, setBrake] = useState(false);
  const [holdTimer, setHoldTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const altRef = useRef(altitude);
  altRef.current = altitude;
  const velRef = useRef(velocity);
  velRef.current = velocity;
  const holdRef = useRef(holdTimer);
  holdRef.current = holdTimer;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const roundRef = useRef(round);
  roundRef.current = round;
  const startRef = useRef(Date.now());
  const animRef = useRef<number>(0);
  const lastRef = useRef(Date.now());

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      cancelAnimationFrame(animRef.current);
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 88 : 40,
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
    setRound(0);
    setScore(0);
    setLives(config.livesCount);
    setAltitude(0);
    setVelocity(0);
    setHoldTimer(0);
    setPhase("playing");
    startTimer();
  }

  useEffect(() => {
    if (phase !== "playing") return;
    function tick() {
      const now = Date.now();
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      const target = TARGETS[roundRef.current];
      const thrust = throttle ? 18 : 0;
      const drag = brake ? -12 : 0;
      const gravity = -6;
      const newVel = Math.max(
        -20,
        Math.min(20, velRef.current + (thrust + drag + gravity) * dt),
      );
      const newAlt = Math.max(0, Math.min(100, altRef.current + newVel * dt));
      setVelocity(newVel);
      setAltitude(newAlt);
      const inZone = Math.abs(newAlt - target) <= 10;
      if (inZone) {
        const nh = Math.min(5, holdRef.current + dt);
        setHoldTimer(nh);
        if (nh >= 5) {
          setFlash("ok");
          setScore(
            (s) => s + 400 * config.difficulty + Math.floor(timeLeft * 3),
          );
          const nr = roundRef.current + 1;
          if (nr >= 5) {
            setTimeout(() => endGame(true), 800);
            return;
          }
          setTimeout(() => {
            setFlash(null);
            setRound(nr);
            setAltitude(0);
            setVelocity(0);
            setHoldTimer(0);
          }, 1000);
        }
      } else {
        setHoldTimer(0);
      }
      animRef.current = requestAnimationFrame(tick);
    }
    lastRef.current = Date.now();
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, throttle, brake, config.difficulty, timeLeft, endGame]);

  const target = TARGETS[Math.min(round, TARGETS.length - 1)];
  const holdPct = (holdTimer / 5) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="altitude_control.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#10b981] transition-all duration-1000"
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
            className="text-3xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Altitude Control
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Use Throttle Up and Throttle Down to hover the drone at the target
            altitude (dashed line). Hold within 10% of target for 5 seconds to
            complete each round.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#10b981] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="altitude_control.start_button"
          >
            Begin Flight
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm shrink-0">
            <span className="font-mono text-[#10b981]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Round {round + 1}/5 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div
            className={`relative flex-1 rounded-xl border overflow-hidden ${
              flash === "ok"
                ? "border-[#10b981] shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                : "border-border/30"
            }`}
            style={{
              background:
                "linear-gradient(to bottom, #0a0a1a 0%, #1a2a1a 60%, #0a1a0a 100%)",
            }}
            data-ocid="altitude_control.viewport"
          >
            <div
              className="absolute inset-x-0 border-t border-dashed border-[#f59e0b]/60"
              style={{ top: `${100 - target}%` }}
            >
              <span className="absolute right-2 top-1 text-xs text-[#f59e0b] font-mono">
                {target}m
              </span>
            </div>
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-12 h-6 rounded-sm border-2 border-[#00f5ff] bg-[#00f5ff]/20 flex items-center justify-center"
              style={{ bottom: `${altitude}%` }}
              animate={{ bottom: `${altitude}%` }}
              transition={{ duration: 0.05 }}
            >
              <span className="text-[10px] text-[#00f5ff] font-mono">
                {Math.round(altitude)}m
              </span>
            </motion.div>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden shrink-0">
            <div
              className="h-full bg-[#10b981] transition-all"
              style={{ width: `${holdPct}%` }}
            />
          </div>
          <div className="text-xs text-center text-muted-foreground shrink-0">
            Hold at target — {(5 - holdTimer).toFixed(1)}s remaining
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <button
              type="button"
              onPointerDown={() => {
                setThrottle(true);
                setBrake(false);
              }}
              onPointerUp={() => setThrottle(false)}
              onPointerLeave={() => setThrottle(false)}
              className={`py-4 rounded-xl border-2 font-bold transition-all ${
                throttle
                  ? "bg-[#10b981]/30 border-[#10b981] text-[#10b981]"
                  : "border-border/40 bg-card/30 text-foreground"
              }`}
              data-ocid="altitude_control.throttle_up"
            >
              Throttle Up
            </button>
            <button
              type="button"
              onPointerDown={() => {
                setBrake(true);
                setThrottle(false);
              }}
              onPointerUp={() => setBrake(false)}
              onPointerLeave={() => setBrake(false)}
              className={`py-4 rounded-xl border-2 font-bold transition-all ${
                brake
                  ? "bg-[#f43f5e]/30 border-[#f43f5e] text-[#f43f5e]"
                  : "border-border/40 bg-card/30 text-foreground"
              }`}
              data-ocid="altitude_control.throttle_down"
            >
              Throttle Down
            </button>
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
            className="text-4xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            FLIGHT COMPLETE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">Rounds cleared: {round}/5</div>
        </motion.div>
      )}
    </div>
  );
}
