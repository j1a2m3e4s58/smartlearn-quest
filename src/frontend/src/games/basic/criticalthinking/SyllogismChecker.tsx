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

interface Syllogism {
  premise1: string;
  premise2: string;
  conclusion: string;
  valid: boolean;
  explanation: string;
}

const SYLLOGISMS: Syllogism[] = [
  {
    premise1: "All dogs are mammals.",
    premise2: "Rex is a dog.",
    conclusion: "Rex is a mammal.",
    valid: true,
    explanation:
      "Valid: Rex belongs to dogs, dogs to mammals, so Rex is a mammal.",
  },
  {
    premise1: "All birds can fly.",
    premise2: "Penguins are birds.",
    conclusion: "Penguins can fly.",
    valid: false,
    explanation:
      "Invalid: The first premise is factually wrong — penguins cannot fly.",
  },
  {
    premise1: "All triangles have three sides.",
    premise2: "This shape has three sides.",
    conclusion: "This shape is a triangle.",
    valid: false,
    explanation:
      "Invalid: Three-sided shapes include non-triangles. This is the fallacy of affirming the consequent.",
  },
  {
    premise1: "No reptiles are warm-blooded.",
    premise2: "Snakes are reptiles.",
    conclusion: "Snakes are not warm-blooded.",
    valid: true,
    explanation:
      "Valid: Snakes are reptiles; no reptile is warm-blooded, so snakes are not.",
  },
  {
    premise1: "All students who study pass.",
    premise2: "Maria studied.",
    conclusion: "Maria passed.",
    valid: true,
    explanation:
      "Valid: Maria studied, all who study pass, therefore Maria passed.",
  },
  {
    premise1: "Some fruits are sweet.",
    premise2: "Mangoes are fruits.",
    conclusion: "Mangoes are sweet.",
    valid: false,
    explanation:
      'Invalid: "Some" does not guarantee mangoes are in the sweet subset.',
  },
  {
    premise1: "All circles are round.",
    premise2: "All wheels are round.",
    conclusion: "All wheels are circles.",
    valid: false,
    explanation:
      "Invalid: Both being round does not make wheels identical to circles.",
  },
  {
    premise1: "No fish breathe air.",
    premise2: "Dolphins breathe air.",
    conclusion: "Dolphins are not fish.",
    valid: true,
    explanation:
      "Valid: If no fish breathes air, and dolphins do breathe air, dolphins cannot be fish.",
  },
  {
    premise1: "All even numbers are divisible by 2.",
    premise2: "8 is an even number.",
    conclusion: "8 is divisible by 2.",
    valid: true,
    explanation: "Valid: 8 is even, all evens divide by 2, so 8 divides by 2.",
  },
  {
    premise1: "If it rains, the ground gets wet.",
    premise2: "The ground is wet.",
    conclusion: "It rained.",
    valid: false,
    explanation:
      "Invalid: The ground could be wet for other reasons (sprinkler, flood, etc.).",
  },
];

export default function SyllogismChecker({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [syllogisms] = useState(() =>
    [...SYLLOGISMS].sort(() => Math.random() - 0.5),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<boolean | null>(null);
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

  function pick(valid: boolean) {
    if (selected !== null) return;
    setSelected(valid);
    const s = syllogisms[idx];
    if (valid === s.valid) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((sc) => sc + 300 * config.difficulty + timeLeft * 2);
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
    }, 1400);
  }

  const s = syllogisms[Math.min(idx, syllogisms.length - 1)];
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="syllogism.page"
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
            Syllogism Checker
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Two premises are shown followed by a conclusion. Decide if the
            conclusion logically follows.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#e879f9] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="syllogism.start_button"
          >
            Begin Logic Test
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
            className={`rounded-xl border-2 p-4 transition-all flex flex-col gap-3 ${
              flash === "ok"
                ? "border-[#10b981] bg-[#10b981]/10"
                : flash === "err"
                  ? "border-[#f43f5e] bg-[#f43f5e]/10"
                  : "border-[#e879f9]/30 bg-card/20"
            }`}
          >
            <div>
              <div className="text-xs text-muted-foreground font-semibold mb-1">
                PREMISE 1
              </div>
              <div className="text-sm text-foreground">{s.premise1}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-semibold mb-1">
                PREMISE 2
              </div>
              <div className="text-sm text-foreground">{s.premise2}</div>
            </div>
            <div className="border-t border-border/30 pt-3">
              <div className="text-xs text-[#e879f9] font-semibold mb-1">
                CONCLUSION
              </div>
              <div className="text-sm font-semibold text-foreground">
                {s.conclusion}
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-center text-foreground">
            Is this conclusion logically valid?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([true, false] as boolean[]).map((val, i) => (
              <motion.button
                key={String(val)}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => pick(val)}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                  selected === val
                    ? val === s.valid
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : selected !== null && val === s.valid
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-border/40 bg-card/30 text-foreground hover:border-[#e879f9]/60"
                }`}
                data-ocid={`syllogism.option.${i + 1}`}
              >
                {val ? "Valid" : "Invalid"}
              </motion.button>
            ))}
          </div>
          {selected !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs ${selected === s.valid ? "text-[#10b981]" : "text-[#f43f5e]"}`}
            >
              {s.explanation}
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
            className="text-4xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            REASONING COMPLETE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/10 correct</div>
        </motion.div>
      )}
    </div>
  );
}
