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

interface Question {
  loopCount: number;
  stepsPerLoop: number;
  extraSteps: number;
  question: string;
  answer: number;
  options: number[];
  codeSnippet: string;
}

function genQuestions(diff: 1 | 2 | 3): Question[] {
  const qs: Question[] = [];
  const bases = diff === 1 ? [2, 3, 4] : diff === 2 ? [3, 5, 6] : [4, 6, 8];
  const extras = diff === 1 ? [0, 1] : diff === 2 ? [0, 1, 2] : [0, 2, 3];
  for (let i = 0; i < 12; i++) {
    const loops = bases[i % bases.length] + (i > 5 ? 1 : 0);
    const steps = 2 + (i % 3);
    const extra = extras[i % extras.length];
    const answer = loops * steps + extra;
    const wrong = [answer + steps, answer - 1, answer + 2].filter(
      (v) => v > 0 && v !== answer,
    );
    const opts = [...new Set([answer, ...wrong.slice(0, 3)])]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    qs.push({
      loopCount: loops,
      stepsPerLoop: steps,
      extraSteps: extra,
      question: "How many total steps does the robot take?",
      answer,
      options: opts.length === 4 ? opts : [...opts, answer + 3].slice(0, 4),
      codeSnippet: `REPEAT ${loops} TIMES:\n  ${Array.from({ length: steps }, (_, k) => `Move Forward  # step ${k + 1}`).join("\n  ")}${extra > 0 ? `\n${Array.from({ length: extra }, () => "Move Forward  # extra").join("\n")}` : ""}`,
    });
  }
  return qs;
}

export default function LoopCountingGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [questions] = useState(() => genQuestions(config.difficulty));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<number | null>(null);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const [correct, setCorrect] = useState(0);
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
          (correctRef.current / questions.length) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd, questions.length],
  );

  const correctRef = useRef(correct);
  correctRef.current = correct;
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

  function pick(opt: number) {
    if (selected !== null || flash !== null) return;
    setSelected(opt);
    const q = questions[idx];
    if (opt === q.answer) {
      setFlash("ok");
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty + timeLeft * 2);
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
      if (idx + 1 >= questions.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 1000);
  }

  const q = questions[idx];
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="loop_counting.page"
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
            Loop Counter
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read the looped robot code. Count the total number of steps the
            robot takes. Beware of extra steps outside the loop.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#10b981] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="loop_counting.start_button"
          >
            Start Counting
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[#10b981]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              {idx + 1}/12 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/30 p-4">
            <div className="text-xs text-[#10b981] font-semibold mb-2">
              ROBOT CODE
            </div>
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
              {q.codeSnippet}
            </pre>
          </div>
          <div className="text-sm font-semibold text-foreground">
            {q.question}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick(opt)}
                className={`py-4 rounded-xl border-2 font-bold text-xl transition-all ${
                  selected === opt
                    ? opt === q.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : selected !== null && opt === q.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-border/40 bg-card/30 text-foreground hover:border-[#10b981]/60"
                }`}
                data-ocid={`loop_counting.option.${i + 1}`}
              >
                {opt}
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
            className="text-4xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            COMPLETE
          </div>
          <div className="text-2xl font-bold">{score.toLocaleString()} pts</div>
          <div className="text-muted-foreground">{correct}/12 correct</div>
        </motion.div>
      )}
    </div>
  );
}
