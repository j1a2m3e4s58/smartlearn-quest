import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

interface Fraction {
  num: number;
  den: number;
  display: string;
  value: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function simplify(n: number, d: number): [number, number] {
  const g = gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}
function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function genFraction(diff: 1 | 2 | 3): Fraction {
  if (diff === 1) {
    const den = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    return { num, den, display: `${num}/${den}`, value: num / den };
  }
  if (diff === 2) {
    const den = [3, 4, 5, 6, 8, 10, 12][Math.floor(Math.random() * 7)];
    const whole = Math.floor(Math.random() * 3);
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const [sn, sd] = simplify(num, den);
    if (whole === 0)
      return { num: sn, den: sd, display: `${sn}/${sd}`, value: sn / sd };
    return {
      num: whole * sd + sn,
      den: sd,
      display: `${whole} ${sn}/${sd}`,
      value: whole + sn / sd,
    };
  }
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const d1 = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
  const d2 = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
  const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
  const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
  let num: number;
  let den: number;
  if (op === "+") {
    num = n1 * d2 + n2 * d1;
    den = d1 * d2;
  } else if (op === "-") {
    num = Math.abs(n1 * d2 - n2 * d1);
    den = d1 * d2;
  } else {
    num = n1 * n2;
    den = d1 * d2;
  }
  const [sn, sd] = simplify(num, den);
  return {
    num: sn,
    den: sd,
    display: `(${n1}/${d1} ${op} ${n2}/${d2})`,
    value: sn / sd,
  };
}

const TRICKS_WIN = 10;

// ── GAME 1: fraction-wars ────────────────────────────────────────────────────

function FractionWars({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [playerTricks, setPlayerTricks] = useState(0);
  const [aiTricks, setAiTricks] = useState(0);
  const [cardA, setCardA] = useState<Fraction>(genFraction(config.difficulty));
  const [cardB, setCardB] = useState<Fraction>(genFraction(config.difficulty));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{
    msg: string;
    correct: boolean;
  } | null>(null);
  const startTimeRef = useRef(Date.now());

  const endGame = useCallback(
    (
      completed: boolean,
      _pT: number,
      _aT: number,
      s: number,
      c: number,
      t: number,
    ) => {
      setPhase("over");
      const accuracy = t > 0 ? (c / t) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, accuracy, timeSpent, completed));
    },
    [config, onGameEnd],
  );

  function choose(choice: "A" | "B" | "equal") {
    if (phase !== "playing") return;
    const eps = 0.0001;
    const actuallyA = cardA.value > cardB.value + eps;
    const actuallyB = cardB.value > cardA.value + eps;
    const actuallyEqual = !actuallyA && !actuallyB;
    const correct_choice =
      (choice === "A" && actuallyA) ||
      (choice === "B" && actuallyB) ||
      (choice === "equal" && actuallyEqual);
    const newTotal = total + 1;
    const newCorrect = correct + (correct_choice ? 1 : 0);
    const newScore = score + (correct_choice ? 150 : 0);
    setTotal(newTotal);
    setCorrect(newCorrect);
    setScore(newScore);
    let newPT = playerTricks;
    let newAT = aiTricks;
    if (correct_choice) {
      newPT = playerTricks + 1;
      setPlayerTricks(newPT);
      setFeedback({ msg: "Correct! You win this trick.", correct: true });
    } else {
      newAT = aiTricks + 1;
      setAiTricks(newAT);
      const hint = actuallyA
        ? `${cardA.display} is larger`
        : actuallyB
          ? `${cardB.display} is larger`
          : "They are equal";
      setFeedback({ msg: `Wrong. ${hint}`, correct: false });
    }
    const newRound = round + 1;
    setRound(newRound);
    if (
      newRound >= TRICKS_WIN ||
      newPT >= Math.ceil(TRICKS_WIN / 2) + 1 ||
      newAT >= Math.ceil(TRICKS_WIN / 2) + 1
    ) {
      setTimeout(
        () =>
          endGame(newPT > newAT, newPT, newAT, newScore, newCorrect, newTotal),
        1000,
      );
    } else {
      setTimeout(() => {
        setCardA(genFraction(config.difficulty));
        setCardB(genFraction(config.difficulty));
        setFeedback(null);
      }, 1000);
    }
  }

  function FractionBar({ f }: { f: Fraction }) {
    const pct = Math.min(1, f.value) * 100;
    return (
      <div className="w-full space-y-1">
        <div
          className="text-2xl font-black text-center"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {f.display}
        </div>
        <div className="w-full h-6 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-[#00f5ff] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-xs text-center text-muted-foreground">
          {f.value.toFixed(4)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none"
      data-ocid="fractions_kingdom.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#a855f7]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Fraction Wars
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Compare two fractions and choose which is greater. Win tricks to
            defeat the AI. Best of {TRICKS_WIN}.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
              setCardA(genFraction(config.difficulty));
              setCardB(genFraction(config.difficulty));
            }}
            className="px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:bg-[#a855f7]/90 transition-colors"
            data-ocid="fractions_kingdom.start_button"
          >
            Start Battle
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between text-sm font-mono">
            <span className="text-[#4ade80]">You: {playerTricks} tricks</span>
            <span className="text-muted-foreground">
              Round {round + 1}/{TRICKS_WIN}
            </span>
            <span className="text-red-400">AI: {aiTricks} tricks</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-full grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border-2 border-[#00f5ff]/40 bg-card space-y-3">
                <div className="text-xs text-muted-foreground uppercase tracking-widest text-center">
                  Card A
                </div>
                <FractionBar f={cardA} />
              </div>
              <div className="p-4 rounded-xl border-2 border-[#a855f7]/40 bg-card space-y-3">
                <div className="text-xs text-muted-foreground uppercase tracking-widest text-center">
                  Card B
                </div>
                <FractionBar f={cardB} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.p
                  key="fb"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-bold"
                  style={{ color: feedback.correct ? "#4ade80" : "#f43f5e" }}
                >
                  {feedback.msg}
                </motion.p>
              ) : (
                <motion.div
                  key="btns"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 flex-wrap justify-center"
                >
                  <button
                    type="button"
                    onClick={() => choose("A")}
                    className="px-6 py-2 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-opacity"
                    data-ocid="fractions_kingdom.choose_a"
                  >
                    A is Greater
                  </button>
                  <button
                    type="button"
                    onClick={() => choose("equal")}
                    className="px-6 py-2 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity"
                    data-ocid="fractions_kingdom.choose_equal"
                  >
                    Equal
                  </button>
                  <button
                    type="button"
                    onClick={() => choose("B")}
                    className="px-6 py-2 rounded-lg bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                    data-ocid="fractions_kingdom.choose_b"
                  >
                    B is Greater
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-sm text-muted-foreground">
              Score: <span className="text-[#f59e0b] font-bold">{score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GAME 2: fraction-builder ───────────────────────────────────────────────────

interface BuildTask {
  num: number;
  den: number;
  cols: number;
}

function genBuildTask(diff: 1 | 2 | 3): BuildTask {
  if (diff === 1) {
    const den = [2, 3, 4, 5, 6][randInt(0, 4)];
    const num = randInt(1, den - 1);
    return { num, den, cols: den };
  }
  if (diff === 2) {
    const den = [4, 6, 8, 9, 10][randInt(0, 4)];
    const num = randInt(1, den - 1);
    return { num, den, cols: Math.min(den, 8) };
  }
  // Hard: improper fractions
  const den = [3, 4, 5, 6][randInt(0, 3)];
  const num = randInt(den + 1, den * 2);
  return { num, den, cols: den };
}

function FractionBuilder({ config, onGameEnd }: Props) {
  const TOTAL = 15;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [task, setTask] = useState<BuildTask>(genBuildTask(config.difficulty));
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [selectedDen, setSelectedDen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;

  const endGame = useCallback(
    (s: number, c: number) => {
      const acc = TOTAL > 0 ? (c / TOTAL) * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd],
  );

  function submitGuess() {
    if (selectedNum === null || selectedDen === null) return;
    const ok = selectedNum === task.num && selectedDen === task.den;
    const newScore = ok ? score + 120 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok
        ? `Correct! ${task.num}/${task.den}`
        : `Wrong. It was ${task.num}/${task.den}`,
      ok,
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setTask(genBuildTask(config.difficulty));
      setSelectedNum(null);
      setSelectedDen(null);
      setFeedback(null);
      setQIdx(next);
    }, 1000);
  }

  // Colored cells grid showing the visual fraction
  const totalCells = task.cols * Math.ceil(task.den / task.cols);
  const shadedCount = Math.round((task.num / task.den) * totalCells);
  const numOptions = Array.from({ length: task.den * 2 }, (_, i) => i + 1);
  const denOptions = [2, 3, 4, 5, 6, 8, 9, 10, 12];

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="fraction_builder.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#a855f7]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Fraction Builder
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            A shaded rectangle is shown. Select the numerator and denominator
            that match the visual fraction. 15 rounds.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="fraction_builder.start_button"
          >
            Build Fractions
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Fraction {qIdx + 1}/{TOTAL}
            </span>
            <span>
              Score: <span className="text-[#a855f7] font-bold">{score}</span>
            </span>
            <span>Correct: {correct}</span>
          </div>
          <div className="p-4 rounded-xl border border-[#a855f7]/30 bg-card">
            <p className="text-xs text-muted-foreground mb-2">
              What fraction is shaded?
            </p>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${task.cols}, 1fr)` }}
            >
              {Array.from({ length: totalCells }, (_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-sm border border-border/30 ${i < shadedCount ? "bg-[#a855f7]" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Select Numerator (shaded parts):
              </p>
              <div className="flex flex-wrap gap-2">
                {numOptions.slice(0, 12).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSelectedNum(n)}
                    className={`w-10 h-10 rounded border-2 font-bold text-sm transition-all ${selectedNum === n ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border hover:border-[#a855f7]/50"}`}
                    data-ocid={`fraction_builder.num.${n}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Select Denominator (total parts):
              </p>
              <div className="flex flex-wrap gap-2">
                {denOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDen(d)}
                    className={`w-10 h-10 rounded border-2 font-bold text-sm transition-all ${selectedDen === d ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border hover:border-[#a855f7]/50"}`}
                    data-ocid={`fraction_builder.den.${d}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {selectedNum !== null && selectedDen !== null && (
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-[#a855f7]">
                  {selectedNum}/{selectedDen}
                </span>
                <button
                  type="button"
                  onClick={submitGuess}
                  className="px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                  data-ocid="fraction_builder.submit_button"
                >
                  Confirm
                </button>
              </div>
            )}
            {feedback && (
              <p
                className="text-sm font-bold"
                style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
              >
                {feedback.msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── GAME 3: fraction-quest ────────────────────────────────────────────────────

interface FQProblem {
  n1: number;
  d1: number;
  n2: number;
  d2: number;
  op: "+" | "-";
  lcm: number;
  answerNum: number;
  answerDen: number;
  lcmOptions: number[];
  convertedOptions: { first: number; second: number }[];
}

function lcmOf(a: number, b: number): number {
  const g = gcd(a, b);
  return (a * b) / g;
}

function genFQProblem(diff: 1 | 2 | 3): FQProblem {
  const dens1 =
    diff === 1 ? [2, 3, 4] : diff === 2 ? [3, 4, 5, 6] : [4, 5, 6, 8, 10];
  const d1 = dens1[randInt(0, dens1.length - 1)];
  const dens2 = dens1.filter((d) => d !== d1);
  const d2 = dens2[randInt(0, dens2.length - 1)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const op: "+" | "-" = Math.random() > 0.5 ? "+" : "-";
  const l = lcmOf(d1, d2);
  const converted1 = n1 * (l / d1);
  const converted2 = n2 * (l / d2);
  const rawNum =
    op === "+" ? converted1 + converted2 : Math.abs(converted1 - converted2);
  const [ansNum, ansDen] = simplify(rawNum, l);
  const wrongLcms = [l * 2, l + 1, d1 * d2].filter((v) => v !== l && v > 0);
  const lcmOptions = [l, ...wrongLcms.slice(0, 3)].sort(
    () => Math.random() - 0.5,
  );
  return {
    n1,
    d1,
    n2,
    d2,
    op,
    lcm: l,
    answerNum: ansNum,
    answerDen: ansDen,
    lcmOptions,
    convertedOptions: [{ first: converted1, second: converted2 }],
  };
}

type FQStep = "lcm" | "convert" | "add" | "done";

function FractionQuest({ config, onGameEnd }: Props) {
  const TOTAL = 10;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [problem, setProblem] = useState<FQProblem>(
    genFQProblem(config.difficulty),
  );
  const [step, setStep] = useState<FQStep>("lcm");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [inputNum, setInputNum] = useState("");
  const [inputDen, setInputDen] = useState("");
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;

  const endGame = useCallback(
    (s: number, c: number) => {
      const acc = TOTAL > 0 ? (c / TOTAL) * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd],
  );

  function chooseLCM(val: number) {
    const ok = val === problem.lcm;
    setFeedback({
      msg: ok
        ? `Correct LCM = ${problem.lcm}`
        : `Wrong. LCM of ${problem.d1} and ${problem.d2} = ${problem.lcm}`,
      ok,
    });
    setTimeout(() => {
      if (ok) setStep("convert");
      else setStep("lcm");
      setFeedback(null);
    }, 800);
  }

  function submitConvert() {
    const c1 = problem.n1 * (problem.lcm / problem.d1);
    const c2 = problem.n2 * (problem.lcm / problem.d2);
    const expNum = inputNum.trim();
    const expDen = inputDen.trim();
    const ok =
      expNum === `${c1}/${problem.lcm}` ||
      (Number(expNum) === c1 && Number(expDen) === problem.lcm);
    const okSimple = Number(expNum) === c1;
    if (okSimple) {
      setFeedback({
        msg: `Correct! ${problem.n1}/${problem.d1} = ${c1}/${problem.lcm} and ${problem.n2}/${problem.d2} = ${c2}/${problem.lcm}`,
        ok: true,
      });
      setTimeout(() => {
        setStep("add");
        setFeedback(null);
        setInputNum("");
        setInputDen("");
      }, 1200);
    } else {
      setFeedback({
        msg: `Hint: ${problem.n1}/${problem.d1} = ${c1}/${problem.lcm}`,
        ok: false,
      });
    }
  }

  function submitAnswer() {
    const num = Number.parseInt(inputNum.trim());
    const den = Number.parseInt(inputDen.trim());
    const ok = num === problem.answerNum && den === problem.answerDen;
    const newScore = ok ? score + 200 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok
        ? `Correct! ${problem.answerNum}/${problem.answerDen}`
        : `Wrong. Answer: ${problem.answerNum}/${problem.answerDen}`,
      ok,
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setProblem(genFQProblem(config.difficulty));
      setStep("lcm");
      setFeedback(null);
      setInputNum("");
      setInputDen("");
      setQIdx(next);
    }, 1000);
  }

  const c1shown = problem.n1 * (problem.lcm / problem.d1);
  const c2shown = problem.n2 * (problem.lcm / problem.d2);

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="fraction_quest.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#a855f7]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Fraction Quest
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Add and subtract fractions step-by-step. Find the LCM, convert, then
            calculate. 10 problems.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="fraction_quest.start_button"
          >
            Begin Quest
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Problem {qIdx + 1}/{TOTAL}
            </span>
            <span>
              Score: <span className="text-[#a855f7] font-bold">{score}</span>
            </span>
          </div>
          <div
            className="text-4xl font-black text-center"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {problem.n1}/{problem.d1} {problem.op} {problem.n2}/{problem.d2}
          </div>
          <div className="flex gap-2 justify-center">
            {["lcm", "convert", "add"].map((s, i) => (
              <div
                key={s}
                className={`px-3 py-1 rounded text-xs font-bold border ${step === s ? "border-[#a855f7] text-[#a855f7]" : i < ["lcm", "convert", "add"].indexOf(step) ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`}
              >
                Step {i + 1}:{" "}
                {s === "lcm"
                  ? "Find LCM"
                  : s === "convert"
                    ? "Convert"
                    : "Calculate"}
              </div>
            ))}
          </div>
          {step === "lcm" && (
            <div className="space-y-3">
              <p className="text-sm">
                What is the LCM of {problem.d1} and {problem.d2}?
              </p>
              <div className="flex gap-3 flex-wrap">
                {problem.lcmOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => chooseLCM(opt)}
                    className="px-6 py-3 rounded-lg border-2 border-[#a855f7]/40 font-bold text-lg hover:border-[#a855f7] hover:bg-[#a855f7]/10 transition-all"
                    data-ocid={`fraction_quest.lcm.${i + 1}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === "convert" && (
            <div className="space-y-3">
              <p className="text-sm">
                LCM = {problem.lcm}. Enter the converted first fraction
                numerator:
              </p>
              <p className="text-xs text-muted-foreground">
                {problem.n1}/{problem.d1} = ?/{problem.lcm}
              </p>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value)}
                  className="w-24 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2"
                  placeholder="?"
                  data-ocid="fraction_quest.convert_input"
                />
                <span className="text-xl font-bold">/ {problem.lcm}</span>
                <button
                  type="button"
                  onClick={submitConvert}
                  className="px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                  data-ocid="fraction_quest.convert_submit"
                >
                  Check
                </button>
              </div>
            </div>
          )}
          {step === "add" && (
            <div className="space-y-3">
              <p className="text-sm">
                {c1shown}/{problem.lcm} {problem.op} {c2shown}/{problem.lcm} = ?
              </p>
              <p className="text-xs text-muted-foreground">
                Enter final answer (simplified if possible)
              </p>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value)}
                  className="w-20 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2"
                  placeholder="num"
                  data-ocid="fraction_quest.ans_num"
                />
                <span className="text-xl font-bold">/</span>
                <input
                  type="number"
                  value={inputDen}
                  onChange={(e) => setInputDen(e.target.value)}
                  className="w-20 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2"
                  placeholder="den"
                  data-ocid="fraction_quest.ans_den"
                />
                <button
                  type="button"
                  onClick={submitAnswer}
                  className="px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                  data-ocid="fraction_quest.answer_submit"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          {feedback && (
            <p
              className="text-sm font-bold"
              style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
            >
              {feedback.msg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────

export default function FractionsKingdom({ config, onGameEnd }: Props) {
  if (config.gameId === "fraction-builder")
    return <FractionBuilder config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "fraction-quest")
    return <FractionQuest config={config} onGameEnd={onGameEnd} />;
  return <FractionWars config={config} onGameEnd={onGameEnd} />;
}
