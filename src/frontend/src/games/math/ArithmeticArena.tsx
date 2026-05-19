import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

type Op = "+" | "-" | "*" | "/";
interface Problem {
  a: number;
  b: number;
  op: Op;
  answer: number;
}

const DIFF = {
  1: {
    playerHP: 100,
    aiHP: 100,
    aiDelayMs: 3000,
    numRange: 12,
    ops: ["+", "-"] as Op[],
    damage: 20,
  },
  2: {
    playerHP: 100,
    aiHP: 120,
    aiDelayMs: 2000,
    numRange: 20,
    ops: ["+", "-", "*"] as Op[],
    damage: 25,
  },
  3: {
    playerHP: 100,
    aiHP: 150,
    aiDelayMs: 1200,
    numRange: 30,
    ops: ["+", "-", "*", "/"] as Op[],
    damage: 30,
  },
};

function genProblem(difficulty: 1 | 2 | 3): Problem {
  const d = DIFF[difficulty];
  const op = d.ops[Math.floor(Math.random() * d.ops.length)];
  let a = Math.floor(Math.random() * d.numRange) + 1;
  let b = Math.floor(Math.random() * d.numRange) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  if (op === "/") {
    b = Math.max(1, b);
    a = b * (Math.floor(Math.random() * 10) + 1);
  }
  const answer =
    op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
  return { a, b, op, answer };
}

// ── GAME 1: math-combat ──────────────────────────────────────────────────────

function MathCombat({ config, onGameEnd }: Props) {
  const d = DIFF[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [playerHP, setPlayerHP] = useState(d.playerHP);
  const [aiHP, setAiHP] = useState(d.aiHP);
  const [problem, setProblem] = useState<Problem>(
    genProblem(config.difficulty),
  );
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeAI, setShakeAI] = useState(false);
  const [playerFlash, setPlayerFlash] = useState<"hit" | "heal" | null>(null);
  const [aiFlash, setAiFlash] = useState<"hit" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(Date.now());
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const playerHPRef = useRef(playerHP);
  playerHPRef.current = playerHP;
  const aiHPRef = useRef(aiHP);
  aiHPRef.current = aiHP;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const hitsRef = useRef(hits);
  hitsRef.current = hits;
  const attemptsRef = useRef(attempts);
  attemptsRef.current = attempts;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const accuracy =
        attemptsRef.current > 0
          ? (hitsRef.current / attemptsRef.current) * 100
          : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setTimeout(() => {
      if (phaseRef.current !== "playing") return;
      setPlayerHP((prev) => {
        const next = prev - d.damage;
        if (next <= 0) {
          endGame(false);
          return 0;
        }
        return next;
      });
      setShakePlayer(true);
      setPlayerFlash("hit");
      setTimeout(() => {
        setShakePlayer(false);
        setPlayerFlash(null);
      }, 600);
      setMessage("AI answered first! You took damage.");
      setProblem(genProblem(config.difficulty));
      setInput("");
      inputRef.current?.focus();
    }, d.aiDelayMs);
    return () => clearTimeout(timer);
  }, [problem, phase, d.aiDelayMs, d.damage, config.difficulty, endGame]);

  function submit() {
    if (phase !== "playing") return;
    const val = Number.parseFloat(input.trim());
    setAttempts((a) => a + 1);
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    if (val === problem.answer) {
      setHits((h) => h + 1);
      const pts = 100 + Math.floor(d.aiDelayMs / 10);
      setScore((s) => s + pts);
      setAiHP((prev) => {
        const next = prev - d.damage;
        if (next <= 0) {
          endGame(true);
          return 0;
        }
        return next;
      });
      setShakeAI(true);
      setAiFlash("hit");
      setTimeout(() => {
        setShakeAI(false);
        setAiFlash(null);
      }, 600);
      setMessage("Correct! You strike the opponent!");
    } else {
      setPlayerHP((prev) => {
        const next = prev - Math.floor(d.damage / 2);
        if (next <= 0) {
          endGame(false);
          return 0;
        }
        return next;
      });
      setShakePlayer(true);
      setPlayerFlash("hit");
      setTimeout(() => {
        setShakePlayer(false);
        setPlayerFlash(null);
      }, 600);
      setMessage(`Wrong! Answer was ${problem.answer}`);
    }
    setProblem(genProblem(config.difficulty));
    setInput("");
    inputRef.current?.focus();
  }

  function startGame() {
    startTimeRef.current = Date.now();
    setPhase("playing");
    startTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  }
  const playerPct = (playerHP / d.playerHP) * 100;
  const aiPct = (aiHP / d.aiHP) * 100;
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="arithmetic_arena.page"
    >
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
            Arithmetic Combat
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Solve math problems before the AI does. Correct answers deal damage.
            Wrong answers hurt you.
          </p>
          <div className="text-sm text-muted-foreground">
            Difficulty {config.difficulty} — AI reacts in {d.aiDelayMs / 1000}s
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:bg-[#00f5ff]/90 transition-colors"
            data-ocid="arithmetic_arena.start_button"
          >
            Start Battle
          </button>
        </motion.div>
      )}
      {phase !== "idle" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00f5ff] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-mono">YOU</div>
              <motion.div
                animate={shakePlayer ? { x: [-6, 6, -4, 4, 0] } : {}}
                className="w-full h-5 bg-muted rounded overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-300 ${playerFlash === "hit" ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${playerPct}%` }}
                />
              </motion.div>
              <div className="text-xs font-mono">
                {Math.max(0, playerHP)} / {d.playerHP} HP
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-mono text-right">
                AI OPPONENT
              </div>
              <motion.div
                animate={shakeAI ? { x: [-6, 6, -4, 4, 0] } : {}}
                className="w-full h-5 bg-muted rounded overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-300 ${aiFlash === "hit" ? "bg-red-500" : "bg-red-400"}`}
                  style={{ width: `${aiPct}%` }}
                />
              </motion.div>
              <div className="text-xs font-mono text-right">
                {Math.max(0, aiHP)} / {d.aiHP} HP
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${problem.a}${problem.op}${problem.b}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-5xl font-black text-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {problem.a} {problem.op} {problem.b} = ?
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-36 text-center text-2xl font-bold rounded-lg border-2 border-[#00f5ff]/50 bg-card focus:border-[#00f5ff] focus:outline-none p-2"
                placeholder="?"
                data-ocid="arithmetic_arena.input"
              />
              <button
                type="button"
                onClick={submit}
                className="px-6 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:bg-[#00f5ff]/90 transition-colors"
                data-ocid="arithmetic_arena.submit_button"
              >
                Strike!
              </button>
            </div>
            {message && (
              <p
                className="text-sm text-center"
                style={{
                  color: message.startsWith("Correct") ? "#4ade80" : "#f43f5e",
                }}
              >
                {message}
              </p>
            )}
            <div className="text-sm text-muted-foreground">
              Score:{" "}
              <span className="text-[#f59e0b] font-bold">
                {score.toLocaleString()}
              </span>{" "}
              | Time: <span className="tabular-nums">{timeLeft}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GAME 2: number-blitz ─────────────────────────────────────────────────────

function NumberBlitz({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [problem, setProblem] = useState<Problem>(
    genProblem(config.difficulty),
  );
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(Date.now());
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const answeredRef = useRef(answered);
  answeredRef.current = answered;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        answeredRef.current > 0
          ? (correctRef.current / answeredRef.current) * 100
          : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, scoreRef.current, acc, ts, completed));
    },
    [config, onGameEnd],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, endGame]);

  function submit() {
    if (phase !== "playing") return;
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newAnswered = answered + 1;
    setAnswered(newAnswered);
    const ok = val === problem.answer;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 100);
      setTimeLeft((t) => t + 3);
      setFlash("green");
    } else {
      setTimeLeft((t) => Math.max(1, t - 5));
      setFlash("red");
    }
    setTimeout(() => setFlash(null), 400);
    setProblem(genProblem(config.difficulty));
    setInput("");
    inputRef.current?.focus();
  }

  function startGame() {
    startTimeRef.current = Date.now();
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const timePct = (timeLeft / 60) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="number_blitz.page"
    >
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
            Number Blitz
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Answer as many arithmetic problems as possible in 60 seconds.
            Correct: +3s. Wrong: -5s.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="number_blitz.start_button"
          >
            Start Blitz
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="w-full h-3 bg-muted rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-[#00f5ff]"}`}
              style={{ width: `${timePct}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span
              className={`font-bold text-lg ${timeLeft <= 10 ? "text-red-400" : "text-[#00f5ff]"}`}
            >
              {timeLeft}s
            </span>
            <span className="text-muted-foreground">{answered} answered</span>
            <span>
              Score: <span className="text-[#f59e0b] font-bold">{score}</span>
            </span>
          </div>
          <motion.div
            className="flex-1 flex flex-col items-center justify-center gap-5"
            animate={
              flash === "green"
                ? { backgroundColor: ["rgba(74,222,128,0.2)", "transparent"] }
                : flash === "red"
                  ? { backgroundColor: ["rgba(244,63,94,0.2)", "transparent"] }
                  : {}
            }
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${problem.a}${problem.op}${problem.b}`}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-5xl font-black text-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {problem.a} {problem.op} {problem.b} = ?
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-36 text-center text-2xl font-bold rounded-lg border-2 border-[#00f5ff]/50 bg-card focus:border-[#00f5ff] focus:outline-none p-2"
                placeholder="?"
                data-ocid="number_blitz.input"
              />
              <button
                type="button"
                onClick={submit}
                className="px-6 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity"
                data-ocid="number_blitz.submit_button"
              >
                Answer
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              Correct: {correct} | Wrong: {answered - correct}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ── GAME 3: arithmetic-boss ───────────────────────────────────────────────────

const BOSS_PHASES = [
  { ops: ["+", "-"] as Op[], numRange: 20, label: "Phase 1: Basic Operations" },
  {
    ops: ["+", "-", "*"] as Op[],
    numRange: 25,
    label: "Phase 2: Multiplication",
  },
  {
    ops: ["+", "-", "*", "/"] as Op[],
    numRange: 30,
    label: "Phase 3: All Operations",
  },
];

function ArithmeticBoss({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [bossPhase, setBossPhase] = useState(0);
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldHits, setShieldHits] = useState(0);
  const [doubleDmg, setDoubleDmg] = useState(false);
  const [doubleDmgTimer, setDoubleDmgTimer] = useState(0);
  const [problem, setProblem] = useState<Problem>(
    genProblem(config.difficulty),
  );
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(Date.now());
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const totalRef = useRef(total);
  totalRef.current = total;
  const bossHPRef = useRef(bossHP);
  bossHPRef.current = bossHP;
  const playerHPRef = useRef(playerHP);
  playerHPRef.current = playerHP;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, scoreRef.current, acc, ts, completed));
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  // Boss special events
  useEffect(() => {
    if (phase !== "playing") return;
    const shieldInterval = setInterval(() => {
      setShieldActive(true);
      setShieldHits(0);
      setMessage("Boss activates SHIELD — answer 2 correct to break it!");
      setTimeout(() => {
        setShieldActive(false);
        setShieldHits(0);
      }, 8000);
    }, 15000);
    const doubleDmgInterval = setInterval(() => {
      setDoubleDmg(true);
      setDoubleDmgTimer(30);
      setMessage("Boss DOUBLE DAMAGE mode — wrong answers cost double HP!");
    }, 20000);
    return () => {
      clearInterval(shieldInterval);
      clearInterval(doubleDmgInterval);
    };
  }, [phase]);

  useEffect(() => {
    if (!doubleDmg || phase !== "playing") return;
    const id = setInterval(() => {
      setDoubleDmgTimer((t) => {
        if (t <= 1) {
          setDoubleDmg(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [doubleDmg, phase]);

  function genBossProblem() {
    const bp = BOSS_PHASES[bossPhase];
    const op = bp.ops[Math.floor(Math.random() * bp.ops.length)];
    let a = Math.floor(Math.random() * bp.numRange) + 1;
    let b = Math.floor(Math.random() * bp.numRange) + 1;
    if (op === "-" && b > a) [a, b] = [b, a];
    if (op === "/") {
      b = Math.max(1, b);
      a = b * (Math.floor(Math.random() * 8) + 1);
    }
    const answer =
      op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
    return { a, b, op, answer };
  }

  function submit() {
    if (phase !== "playing") return;
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newTotal = total + 1;
    setTotal(newTotal);
    if (val === problem.answer) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setScore((s) => s + 150);
      if (shieldActive) {
        const newHits = shieldHits + 1;
        setShieldHits(newHits);
        if (newHits >= 2) {
          setShieldActive(false);
          setShieldHits(0);
          setMessage("Shield broken! Boss takes damage!");
          const newBossHP = Math.max(0, bossHP - 10);
          setBossHP(newBossHP);
          bossHPRef.current = newBossHP;
          if (newBossHP <= 0) {
            setTimeout(() => endGame(true), 500);
            return;
          }
          const nextBossPhase = Math.floor((100 - newBossHP) / 34);
          if (nextBossPhase > bossPhase) {
            setBossPhase(Math.min(2, nextBossPhase));
          }
        } else {
          setMessage("Hit 1/2 to break shield!");
        }
      } else {
        const newBossHP = Math.max(0, bossHP - 10);
        setBossHP(newBossHP);
        bossHPRef.current = newBossHP;
        setMessage("Direct hit on boss!");
        if (newBossHP <= 0) {
          setTimeout(() => endGame(true), 500);
          return;
        }
        const nextBossPhase = Math.floor((100 - newBossHP) / 34);
        if (nextBossPhase > bossPhase) {
          setBossPhase(Math.min(2, nextBossPhase));
          setMessage(
            `Boss enters ${BOSS_PHASES[Math.min(2, nextBossPhase)].label}!`,
          );
        }
      }
    } else {
      const dmg = doubleDmg ? 20 : 10;
      const newPlayerHP = Math.max(0, playerHP - dmg);
      setPlayerHP(newPlayerHP);
      playerHPRef.current = newPlayerHP;
      setMessage(
        doubleDmg
          ? `Wrong! Double damage! -${dmg} HP. Answer: ${problem.answer}`
          : `Wrong! -${dmg} HP. Answer: ${problem.answer}`,
      );
      if (newPlayerHP <= 0) {
        setTimeout(() => endGame(false), 500);
        return;
      }
    }
    setProblem(genBossProblem());
    setInput("");
    inputRef.current?.focus();
  }

  function startGame() {
    startTimeRef.current = Date.now();
    setPhase("playing");
    startTimer();
    setBossHP(100);
    setPlayerHP(100);
    setBossPhase(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const bossHPPct = bossHP;
  const playerHPPct = playerHP;
  const timePct = (timeLeft / config.timeLimit) * 100;
  const bpInfo = BOSS_PHASES[bossPhase];

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-3"
      data-ocid="arithmetic_boss.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-red-400"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Arithmetic Boss
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Defeat the math boss with 100HP. Boss has shields and enters
            double-damage mode. 3 phases of increasing difficulty.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-red-500 text-white font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="arithmetic_boss.start_button"
          >
            Challenge Boss
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-[#00f5ff] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <div
            className="text-xs text-center font-bold text-red-400"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {bpInfo.label}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">PLAYER</div>
              <div className="w-full h-4 bg-muted rounded overflow-hidden mt-1">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${playerHPPct}%` }}
                />
              </div>
              <div className="text-xs font-mono">{playerHP} HP</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground text-right">
                BOSS
              </div>
              <div className="w-full h-4 bg-muted rounded overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${shieldActive ? "bg-blue-400" : "bg-red-500"}`}
                  style={{ width: `${bossHPPct}%` }}
                />
              </div>
              <div className="text-xs font-mono text-right">
                {bossHP} HP {shieldActive ? "[SHIELD]" : ""}
              </div>
            </div>
          </div>
          {doubleDmg && (
            <div className="text-center text-xs font-bold text-red-400 animate-pulse">
              DOUBLE DAMAGE ACTIVE — {doubleDmgTimer}s
            </div>
          )}
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${problem.a}${problem.op}${problem.b}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-5xl font-black text-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {problem.a} {problem.op} {problem.b} = ?
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-36 text-center text-2xl font-bold rounded-lg border-2 border-red-500/50 bg-card focus:border-red-500 focus:outline-none p-2"
                placeholder="?"
                data-ocid="arithmetic_boss.input"
              />
              <button
                type="button"
                onClick={submit}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold hover:opacity-90 transition-opacity"
                data-ocid="arithmetic_boss.submit_button"
              >
                Attack!
              </button>
            </div>
            {message && (
              <p
                className="text-sm text-center"
                style={{
                  color:
                    message.includes("Direct hit") || message.includes("broken")
                      ? "#4ade80"
                      : "#f43f5e",
                }}
              >
                {message}
              </p>
            )}
            <div className="text-sm text-muted-foreground">
              Score: <span className="text-[#f59e0b] font-bold">{score}</span> |{" "}
              {timeLeft}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────

export default function ArithmeticArena({ config, onGameEnd }: Props) {
  if (config.gameId === "number-blitz")
    return <NumberBlitz config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "arithmetic-boss")
    return <ArithmeticBoss config={config} onGameEnd={onGameEnd} />;
  return <MathCombat config={config} onGameEnd={onGameEnd} />;
}
