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

interface OhmProblem {
  given: { V?: number; I?: number; R?: number };
  find: "V" | "I" | "R";
  answer: number;
  tolerance: number;
  scenario: string;
  hint: string;
}

const EASY: OhmProblem[] = [
  {
    given: { V: 12, R: 4 },
    find: "I",
    answer: 3,
    tolerance: 0.1,
    scenario: "A 12V battery powers a 4Ω resistor. Find the current.",
    hint: "I = V / R",
  },
  {
    given: { V: 9, R: 3 },
    find: "I",
    answer: 3,
    tolerance: 0.1,
    scenario: "A 9V source drives a 3Ω load. Find the current.",
    hint: "I = V / R",
  },
  {
    given: { V: 6, I: 2 },
    find: "R",
    answer: 3,
    tolerance: 0.1,
    scenario: "6V drives 2A through a resistor. Find the resistance.",
    hint: "R = V / I",
  },
  {
    given: { I: 4, R: 5 },
    find: "V",
    answer: 20,
    tolerance: 0.5,
    scenario: "4A flows through a 5Ω resistor. Find the voltage.",
    hint: "V = I × R",
  },
  {
    given: { V: 24, R: 8 },
    find: "I",
    answer: 3,
    tolerance: 0.1,
    scenario:
      "A 24V supply connects to an 8Ω heating element. Find the current.",
    hint: "I = V / R",
  },
];
const MEDIUM: OhmProblem[] = [
  {
    given: { V: 5, R: 330 },
    find: "I",
    answer: 0.015,
    tolerance: 0.001,
    scenario:
      "A 5V Arduino pin drives an LED through a 330Ω resistor. Find the current in Amps.",
    hint: "I = V / R — answer in Amps",
  },
  {
    given: { V: 3.3, I: 0.02 },
    find: "R",
    answer: 165,
    tolerance: 1,
    scenario:
      "3.3V logic drives 20mA through an LED. Find the required series resistance.",
    hint: "R = V / I (convert mA to A first)",
  },
  {
    given: { V: 9, R: 1000 },
    find: "I",
    answer: 0.009,
    tolerance: 0.0005,
    scenario: "9V source, 1kΩ base resistor. Find base current in Amps.",
    hint: "I = V / R",
  },
  {
    given: { I: 0.5, R: 200 },
    find: "V",
    answer: 100,
    tolerance: 0.5,
    scenario:
      "0.5A flows through a 200Ω motor winding. Find the voltage across it.",
    hint: "V = I × R",
  },
  {
    given: { V: 12, I: 0.04 },
    find: "R",
    answer: 300,
    tolerance: 2,
    scenario: "12V powers an LED array drawing 40mA. Find total resistance.",
    hint: "R = V / I",
  },
];
const HARD: OhmProblem[] = [
  {
    given: { V: 5, R: 470 },
    find: "I",
    answer: 0.01064,
    tolerance: 0.0005,
    scenario:
      "5V supply, 470Ω resistor in LED circuit. Calculate exact current in Amps.",
    hint: "I = 5 / 470",
  },
  {
    given: { V: 3.3, R: 220 },
    find: "I",
    answer: 0.015,
    tolerance: 0.001,
    scenario:
      "3.3V GPIO pin, 220Ω resistor to LED. Find current to 3 decimal places (A).",
    hint: "I = 3.3 / 220",
  },
  {
    given: { I: 0.025, R: 390 },
    find: "V",
    answer: 9.75,
    tolerance: 0.1,
    scenario: "25mA through a 390Ω resistor. Find the exact voltage drop.",
    hint: "V = I × R (convert mA first)",
  },
  {
    given: { V: 12, I: 0.0364 },
    find: "R",
    answer: 330,
    tolerance: 2,
    scenario:
      "12V supply, measured 36.4mA current. Identify the resistor value.",
    hint: "R = V / I",
  },
  {
    given: { V: 9, R: 680 },
    find: "I",
    answer: 0.01324,
    tolerance: 0.0005,
    scenario:
      "9V battery, 680Ω resistor. Find current — answer to 5 decimal places (A).",
    hint: "I = 9 / 680",
  },
];
const ALL_PROBLEMS: Record<1 | 2 | 3, OhmProblem[]> = {
  1: EASY,
  2: MEDIUM,
  3: HARD,
};

export default function VoltageCalculator({ config, onGameEnd }: Props) {
  const problems = ALL_PROBLEMS[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
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
          problems.length > 0
            ? (correctRef.current / problems.length) * 100
            : 0,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd, problems.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function startGame() {
    startRef.current = Date.now();
    setPhase("playing");
    startTimer();
  }

  function submit() {
    const val = Number.parseFloat(answer);
    if (Number.isNaN(val)) {
      setFeedback({ ok: false, msg: "Enter a numeric value." });
      return;
    }
    const p = problems[idx];
    if (Math.abs(val - p.answer) <= p.tolerance) {
      const pts = 400 * config.difficulty + timeLeft * 5;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedback({
        ok: true,
        msg: `Correct! +${pts} pts. Answer: ${p.answer}`,
      });
      setTimeout(() => {
        if (idx + 1 >= problems.length) {
          endGame(true);
          return;
        }
        setIdx((i) => i + 1);
        setAnswer("");
        setFeedback(null);
      }, 1800);
    } else {
      setFeedback({
        ok: false,
        msg: `Incorrect. Expected ≈${p.answer}. ${p.hint}`,
      });
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1800);
        return nl;
      });
    }
  }

  const p = problems[idx];
  const pct = (timeLeft / config.timeLimit) * 100;
  const VARS: Record<string, string> = {
    V: "Voltage (V)",
    I: "Current (A)",
    R: "Resistance (Ω)",
  };
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="voltage_calculator.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#7c3aed] transition-all duration-1000"
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
            className="text-3xl font-black text-[#7c3aed]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Ohm's Law Calculator
          </h2>
          <div className="rounded-xl border border-[#7c3aed]/30 bg-card/40 px-6 py-4 text-center">
            <p className="text-2xl font-black text-[#7c3aed] mb-2">V = I × R</p>
            <p className="text-sm text-muted-foreground">
              Voltage = Current × Resistance
            </p>
          </div>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Solve circuit problems using Ohm's Law. Find the missing variable.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#7c3aed] text-white font-bold hover:opacity-90"
            data-ocid="voltage_calculator.start_button"
          >
            Solve Circuits
          </button>
        </motion.div>
      )}
      {phase === "playing" && p && (
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#7c3aed]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {idx + 1}/{problems.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="rounded-xl border border-[#7c3aed]/30 bg-card/40 p-4">
                <p className="text-xs uppercase tracking-widest text-[#7c3aed] mb-2">
                  Problem
                </p>
                <p className="text-sm text-foreground/90 mb-3">{p.scenario}</p>
                <div className="flex gap-3 flex-wrap">
                  {(["V", "I", "R"] as const).map((key) => (
                    <div
                      key={key}
                      className={`px-3 py-2 rounded-lg border text-sm font-mono ${
                        p.find === key
                          ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]"
                          : "border-[#7c3aed]/30 bg-card/60 text-foreground"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mr-1">
                        {key} =
                      </span>
                      {p.find === key
                        ? "?"
                        : ((p.given as Record<string, number | undefined>)[
                            key
                          ] ?? "—")}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="voltage-input"
                  className="text-xs text-muted-foreground"
                >
                  Enter value for {VARS[p.find]}:
                </label>
                <div className="flex gap-2">
                  <input
                    id="voltage-input"
                    type="number"
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      setFeedback(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="flex-1 rounded-lg px-3 py-2 text-sm bg-card border border-border text-foreground"
                    placeholder={`${p.find} = ?`}
                    data-ocid="voltage_calculator.input"
                  />
                  <button
                    type="button"
                    onClick={submit}
                    className="px-5 py-2 rounded-lg bg-[#7c3aed] text-white font-bold text-sm hover:opacity-90"
                    data-ocid="voltage_calculator.submit_button"
                  >
                    Check
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-lg border p-3 text-sm ${feedback.ok ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                  >
                    {feedback.msg}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
