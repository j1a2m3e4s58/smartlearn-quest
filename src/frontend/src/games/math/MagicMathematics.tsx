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

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// ── VEDIC DOJO ──────────────────────────────────────────────────────────────

interface VedicProblem {
  a: number;
  b: number;
  answer: number;
  d1: number;
  d2: number;
  left: number;
  right: number;
}

function genVedicProblem(diff: number): VedicProblem {
  const maxD = diff === 1 ? 5 : diff === 2 ? 8 : 12;
  const d1 = randInt(1, maxD);
  const d2 = randInt(1, maxD);
  const a = 100 - d1;
  const b = 100 - d2;
  const left = a - d2;
  const right = d1 * d2;
  return { a, b, answer: a * b, d1, d2, left, right };
}

const VEDIC_EXAMPLES: VedicProblem[] = [
  { a: 97, b: 96, d1: 3, d2: 4, left: 93, right: 12, answer: 9312 },
  { a: 98, b: 95, d1: 2, d2: 5, left: 93, right: 10, answer: 9310 },
  { a: 94, b: 93, d1: 6, d2: 7, left: 87, right: 42, answer: 8742 },
];

function VedicDojo({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "tutorial" | "practice" | "over">(
    "idle",
  );
  const [exIdx, setExIdx] = useState(0);
  const [probIdx, setProbIdx] = useState(0);
  const [problems] = useState(() =>
    Array.from({ length: 20 }, () => genVedicProblem(config.difficulty)),
  );
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [probTime, setProbTime] = useState(8);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const doneRef = useRef(false);

  const endGame = useCallback(
    (won: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / 20) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  useEffect(() => {
    if (phase !== "practice") return;
    if (probTime <= 0) {
      const p = problems[probIdx];
      setFeedback({ msg: `Time up! ${p.a} x ${p.b} = ${p.answer}`, ok: false });
      setTimeout(() => nextProb(), 2000);
      return;
    }
    const t = setTimeout(() => setProbTime((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  });

  function nextProb() {
    const next = probIdx + 1;
    if (next >= 20) {
      endGame(true);
      return;
    }
    setProbIdx(next);
    setInput("");
    setFeedback(null);
    setProbTime(8);
  }

  function submit() {
    if (feedback) return;
    const val = Number.parseInt(input.trim(), 10);
    const prob = problems[probIdx];
    const ok = val === prob.answer;
    if (ok) setCorrect((c) => c + 1);
    setScore((s) => s + (ok ? 200 * config.difficulty : 0));
    const rightStr = prob.right < 10 ? `0${prob.right}` : `${prob.right}`;
    setFeedback({
      msg: ok
        ? `Correct! Left: ${prob.a}-${prob.d2}=${prob.left}, Right: ${prob.d1}x${prob.d2}=${rightStr}`
        : `Wrong. Left: ${prob.left}, Right: ${rightStr} -> Answer: ${prob.answer}`,
      ok,
    });
    setTimeout(() => nextProb(), 2200);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const prob = problems[probIdx];
  const ex = VEDIC_EXAMPLES[exIdx];
  const rightStr = ex.right < 10 ? `0${ex.right}` : `${ex.right}`;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="vedic_dojo.page"
    >
      <div className="flex items-center justify-between shrink-0">
        <span className="font-bold text-[#f59e0b]">
          {score.toLocaleString()} pts
        </span>
        <div className="w-32 h-2 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-[#f59e0b] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">{timeLeft}s</span>
      </div>

      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-5"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Vedic Math Dojo
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Master the Vedic near-100 multiplication method. Study 3 worked
            examples, then solve 20 timed problems in 8 seconds each.
          </p>
          <div className="rounded-xl border border-[#f59e0b]/30 bg-card/50 p-4 max-w-sm w-full">
            <div className="text-xs uppercase tracking-widest text-[#f59e0b] mb-2">
              Method
            </div>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div>1. Find deficits: d1 = 100 - A, d2 = 100 - B</div>
              <div>2. Left part: A - d2</div>
              <div>3. Right part: d1 x d2 (2 digits, pad if needed)</div>
              <div>4. Combine left + right for the answer</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPhase("tutorial")}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90"
            data-ocid="vedic_dojo.start_button"
          >
            Study Examples
          </button>
        </motion.div>
      )}

      {phase === "tutorial" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="text-xs text-muted-foreground">
            Example {exIdx + 1} of {VEDIC_EXAMPLES.length}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={exIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-[#f59e0b]/30 bg-card/50 p-5 space-y-4"
            >
              <div
                className="text-2xl font-black text-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {ex.a} x {ex.b} = ?
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f59e0b] text-black font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <span>
                    Deficits: d1 = 100 - {ex.a} ={" "}
                    <span className="text-[#f59e0b] font-bold">{ex.d1}</span>,
                    d2 = 100 - {ex.b} ={" "}
                    <span className="text-[#f59e0b] font-bold">{ex.d2}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00f5ff] text-black font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <span>
                    Left: {ex.a} - {ex.d2} ={" "}
                    <span className="text-[#00f5ff] font-bold">{ex.left}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10b981] text-black font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <span>
                    Right: {ex.d1} x {ex.d2} ={" "}
                    <span className="text-[#10b981] font-bold">{rightStr}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#e879f9] text-black font-bold text-xs flex items-center justify-center">
                    4
                  </div>
                  <span>
                    Answer:{" "}
                    <span className="text-[#e879f9] font-bold text-lg">
                      {ex.answer}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-3">
            {exIdx + 1 < VEDIC_EXAMPLES.length && (
              <button
                type="button"
                onClick={() => setExIdx((i) => i + 1)}
                className="flex-1 py-2 rounded-lg border border-[#f59e0b]/30 text-sm hover:bg-[#f59e0b]/10"
                data-ocid="vedic_dojo.next_example_button"
              >
                Next Example
              </button>
            )}
            <button
              type="button"
              onClick={() => setPhase("practice")}
              className="flex-1 py-2 rounded-lg bg-[#f59e0b] text-black font-bold text-sm hover:opacity-90"
              data-ocid="vedic_dojo.practice_button"
            >
              Start Practice
            </button>
          </div>
        </div>
      )}

      {phase === "practice" && (
        <AnimatePresence mode="wait">
          <motion.div
            key={probIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Problem {probIdx + 1}/20</span>
              <span className={probTime <= 3 ? "text-[#f43f5e] font-bold" : ""}>
                {probTime}s
              </span>
            </div>
            <div className="rounded-xl border border-[#f59e0b]/30 bg-card/50 p-5 text-center">
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                Near-100 Multiplication
              </div>
              <div
                className="text-4xl font-black"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {prob.a} x {prob.b}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !feedback && submit()}
                disabled={!!feedback}
                className="flex-1 text-center text-2xl font-bold rounded-lg border-2 border-[#f59e0b]/40 bg-background focus:border-[#f59e0b] focus:outline-none p-2"
                placeholder="?"
                data-ocid="vedic_dojo.input"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!!feedback}
                className="px-5 py-2 rounded-lg bg-[#f59e0b] text-black font-bold hover:opacity-90 disabled:opacity-50"
                data-ocid="vedic_dojo.submit_button"
              >
                Check
              </button>
            </div>
            {feedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold text-center"
                style={{ color: feedback.ok ? "#10b981" : "#f43f5e" }}
              >
                {feedback.msg}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ── ABACUS MASTER ────────────────────────────────────────────────────────────

const ROD_VALUES = [10000, 1000, 100, 10, 1];
const ROD_LABELS = ["10K", "1K", "100", "10", "1"];

interface AbacusChallenge {
  type: "represent" | "add_no_carry" | "add_with_carry";
  label: string;
  target: number;
  addend?: number;
}

function buildChallenges(): AbacusChallenge[] {
  return [
    { type: "represent", label: "Represent", target: 3 },
    { type: "represent", label: "Represent", target: 14 },
    { type: "represent", label: "Represent", target: 52 },
    { type: "represent", label: "Represent", target: 231 },
    { type: "represent", label: "Represent", target: 1304 },
    { type: "add_no_carry", label: "Add", target: 12, addend: 3 },
    { type: "add_no_carry", label: "Add", target: 11, addend: 22 },
    { type: "add_no_carry", label: "Add", target: 14, addend: 21 },
    { type: "add_no_carry", label: "Add", target: 110, addend: 221 },
    { type: "add_no_carry", label: "Add", target: 2001, addend: 1003 },
    { type: "add_with_carry", label: "Add (carry)", target: 8, addend: 5 },
    { type: "add_with_carry", label: "Add (carry)", target: 17, addend: 8 },
    { type: "add_with_carry", label: "Add (carry)", target: 95, addend: 15 },
    { type: "add_with_carry", label: "Add (carry)", target: 199, addend: 12 },
    { type: "add_with_carry", label: "Add (carry)", target: 990, addend: 110 },
  ];
}

function numToRods(n: number): { upper: boolean; lower: number[] }[] {
  return ROD_VALUES.map((v) => {
    const digit = Math.floor(n / v) % 10;
    return {
      upper: digit >= 5,
      lower: Array.from({ length: 4 }, (_, i) => (digit % 5 > i ? 1 : 0)),
    };
  });
}

function rodsToNum(rods: { upper: boolean; lower: number[] }[]): number {
  let result = 0;
  for (let i = 0; i < ROD_VALUES.length; i++) {
    const val = (rods[i].upper ? 5 : 0) + rods[i].lower.filter(Boolean).length;
    result += val * ROD_VALUES[i];
  }
  return result;
}

function AbacusMaster({ config, onGameEnd }: Props) {
  const challenges = buildChallenges();
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [chIdx, setChIdx] = useState(0);
  const [rods, setRods] = useState(() => numToRods(0));
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const doneRef = useRef(false);

  const endGame = useCallback(
    (won: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / challenges.length) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd, challenges.length],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  const ch = challenges[chIdx];

  function toggleUpper(rodIdx: number) {
    if (feedback) return;
    setRods((prev) =>
      prev.map((r, i) => (i === rodIdx ? { ...r, upper: !r.upper } : r)),
    );
  }

  function toggleLower(rodIdx: number, beadIdx: number) {
    if (feedback) return;
    setRods((prev) =>
      prev.map((r, i) => {
        if (i !== rodIdx) return r;
        const lower = [...r.lower];
        const isActive = lower[beadIdx] === 1;
        if (isActive) {
          for (let j = 0; j <= beadIdx; j++) lower[j] = 0;
        } else {
          for (let j = beadIdx; j < 4; j++) lower[j] = 1;
        }
        return { ...r, lower };
      }),
    );
  }

  function checkAnswer() {
    if (feedback) return;
    const displayed = rodsToNum(rods);
    const target =
      ch.type === "represent" ? ch.target : ch.target + (ch.addend ?? 0);
    const ok = displayed === target;
    if (ok) setCorrect((c) => c + 1);
    setScore((s) => s + (ok ? 250 * config.difficulty : 0));
    setFeedback({
      msg: ok
        ? `Correct! ${displayed} shown correctly.`
        : `Wrong. You showed ${displayed}, expected ${target}.`,
      ok,
    });
    setTimeout(() => {
      const next = chIdx + 1;
      if (next >= challenges.length) {
        endGame(true);
        return;
      }
      setChIdx(next);
      setRods(numToRods(0));
      setFeedback(null);
    }, 2000);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="abacus_master.page"
    >
      <div className="flex items-center justify-between shrink-0">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        <div className="w-32 h-2 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-[#00f5ff] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">{timeLeft}s</span>
      </div>

      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-5"
        >
          <h2
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Abacus Master
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Use the 5-rod abacus to represent and calculate numbers. Click the
            upper bead (value 5) or lower beads (value 1 each) to toggle them.
            15 challenges increasing in difficulty.
          </p>
          <div className="rounded-xl border border-[#00f5ff]/30 bg-card/50 p-4 text-sm text-muted-foreground max-w-sm w-full space-y-1">
            <div>Upper bead = 5 x rod value | Lower beads = 1 each</div>
            <div>Rods (left to right): 10K | 1K | 100 | 10 | 1</div>
          </div>
          <button
            type="button"
            onClick={() => {
              startRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg font-bold text-black hover:opacity-90"
            style={{ background: "#00f5ff" }}
            data-ocid="abacus_master.start_button"
          >
            Start
          </button>
        </motion.div>
      )}

      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Challenge {chIdx + 1}/{challenges.length}: {ch.label}
            </span>
            <span>{correct} correct</span>
          </div>

          <div className="rounded-xl border border-[#00f5ff]/30 bg-card/50 p-4 text-center">
            {ch.type === "represent" ? (
              <>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">
                  Represent this number
                </div>
                <div
                  className="text-4xl font-black text-[#00f5ff]"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {ch.target}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">
                  {ch.addend} + {ch.target} = Show result
                </div>
                <div className="text-2xl font-black text-[#f59e0b]">
                  Set abacus to:{" "}
                  <span className="text-[#00f5ff]">
                    {ch.target + (ch.addend ?? 0)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl border border-[#00f5ff]/20 bg-card/40 p-4">
            <div className="flex justify-center gap-4">
              {rods.map((rod, ri) => (
                <div key={ri} className="flex flex-col items-center gap-1">
                  <div className="text-xs text-muted-foreground">
                    {ROD_LABELS[ri]}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleUpper(ri)}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{
                      borderColor: "#00f5ff",
                      background: rod.upper ? "#00f5ff" : "transparent",
                    }}
                    data-ocid={`abacus_master.upper.${ri}`}
                    aria-label={`Rod ${ri + 1} upper bead`}
                  />
                  <div className="w-10 h-0.5 bg-[#00f5ff]/40" />
                  {rod.lower.map((active, bi) => (
                    <button
                      key={bi}
                      type="button"
                      onClick={() => toggleLower(ri, bi)}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{
                        borderColor: "#f59e0b",
                        background: active ? "#f59e0b" : "transparent",
                      }}
                      data-ocid={`abacus_master.lower.${ri}.${bi}`}
                      aria-label={`Rod ${ri + 1} lower bead ${bi + 1}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-center mt-3 text-sm text-muted-foreground">
              Current value:{" "}
              <span className="text-[#00f5ff] font-bold text-lg">
                {rodsToNum(rods).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={checkAnswer}
            disabled={!!feedback}
            className="py-2.5 rounded-lg font-bold text-black hover:opacity-90 disabled:opacity-50"
            style={{ background: "#00f5ff" }}
            data-ocid="abacus_master.check_button"
          >
            Check Answer
          </button>
          {feedback && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-bold text-center"
              style={{ color: feedback.ok ? "#10b981" : "#f43f5e" }}
            >
              {feedback.msg}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}

// ── SHORTCUT WIZARD ──────────────────────────────────────────────────────────

type ShortcutTech = "square5" | "times11" | "percent";

interface ShortcutProblem {
  tech: ShortcutTech;
  question: string;
  answer: number;
  hint: string;
}

function genSquare5(): ShortcutProblem {
  const t = randInt(1, 9);
  const n = t * 10 + 5;
  return {
    tech: "square5",
    question: `${n}\u00b2 = ?`,
    answer: n * n,
    hint: `${t} x ${t + 1} = ${t * (t + 1)}, append 25 -> ${n * n}`,
  };
}

function genTimes11(): ShortcutProblem {
  const n = randInt(12, 89);
  const a = Math.floor(n / 10);
  const b = n % 10;
  const mid = a + b;
  const answer = n * 11;
  return {
    tech: "times11",
    question: `${n} x 11 = ?`,
    answer,
    hint:
      mid > 9
        ? `${a}+${b}=${mid} (carry): (${a}+1)_${mid % 10}_${b} = ${answer}`
        : `${a}+${b}=${mid} -> ${a}${mid}${b} = ${answer}`,
  };
}

function genPercent(): ShortcutProblem {
  const pcts = [10, 5, 15, 25, 20];
  const pct = pcts[Math.floor(Math.random() * pcts.length)];
  const base = randInt(1, 20) * 10;
  const answer = (base * pct) / 100;
  const methods: Record<number, string> = {
    10: `${base} / 10`,
    5: `${base} / 10 / 2`,
    15: `(${base / 10}) + (${base / 20})`,
    25: `${base} / 4`,
    20: `${base} / 5`,
  };
  return {
    tech: "percent",
    question: `${pct}% of ${base} = ?`,
    answer,
    hint: `${pct}% of ${base}: ${methods[pct]} = ${answer}`,
  };
}

const TECH_INFO: Record<
  ShortcutTech,
  { title: string; rule: string; examples: { q: string; a: string }[] }
> = {
  square5: {
    title: "Squaring Numbers Ending in 5",
    rule: "N5 squared: multiply tens digit T by (T+1), append 25",
    examples: [
      { q: "35 squared", a: "3 x 4 = 12, append 25 -> 1225" },
      { q: "65 squared", a: "6 x 7 = 42, append 25 -> 4225" },
    ],
  },
  times11: {
    title: "Multiply Any 2-Digit Number by 11",
    rule: "AB x 11: A (A+B) B. Carry if A+B > 9",
    examples: [
      { q: "53 x 11", a: "5+3=8 -> 583" },
      { q: "78 x 11", a: "7+8=15 (carry) -> 858" },
    ],
  },
  percent: {
    title: "Mental Percentages",
    rule: "10%=/10, 5%=10%/2, 15%=10%+5%, 25%=/4, 20%=/5",
    examples: [
      { q: "15% of 80", a: "10%=8, 5%=4 -> 12" },
      { q: "25% of 160", a: "160 / 4 = 40" },
    ],
  },
};

const SHORTCUT_PHASES: ShortcutTech[] = ["square5", "times11", "percent"];

function buildShortcutProblems(): ShortcutProblem[] {
  const s5 = Array.from({ length: 8 }, genSquare5);
  const t11 = Array.from({ length: 8 }, genTimes11);
  const pct = Array.from({ length: 8 }, genPercent);
  const speed = Array.from({ length: 20 }, (_, i) => {
    const type = i % 3;
    return type === 0 ? genSquare5() : type === 1 ? genTimes11() : genPercent();
  });
  return [...s5, ...t11, ...pct, ...speed];
}

function ShortcutWizard({ config, onGameEnd }: Props) {
  const [problems] = useState(buildShortcutProblems);
  const [phase, setPhase] = useState<"idle" | "teach" | "practice" | "speed">(
    "idle",
  );
  const [techPhaseIdx, setTechPhaseIdx] = useState(0);
  const [probIdx, setProbIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [probTime, setProbTime] = useState(8);
  const [speedIdx, setSpeedIdx] = useState(0);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const doneRef = useRef(false);

  const endGame = useCallback(
    (won: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correctRef.current / 44) * 100,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  useEffect(() => {
    if (phase !== "practice" && phase !== "speed") return;
    if (probTime <= 0) {
      const cur =
        phase === "practice"
          ? problems[techPhaseIdx * 8 + probIdx]
          : problems[24 + speedIdx];
      setFeedback({ msg: `Time up! Answer: ${cur.answer}`, ok: false });
      setTimeout(() => advancePractice(), 2000);
      return;
    }
    const t = setTimeout(() => setProbTime((p) => p - 1), 1000);
    return () => clearTimeout(t);
  });

  function advancePractice() {
    if (phase === "practice") {
      const next = probIdx + 1;
      if (next >= 8) {
        const nextTech = techPhaseIdx + 1;
        if (nextTech >= SHORTCUT_PHASES.length) {
          setPhase("speed");
          setSpeedIdx(0);
        } else {
          setTechPhaseIdx(nextTech);
          setPhase("teach");
          setProbIdx(0);
        }
      } else {
        setProbIdx(next);
      }
    } else {
      const next = speedIdx + 1;
      if (next >= 20) {
        endGame(true);
        return;
      }
      setSpeedIdx(next);
    }
    setInput("");
    setFeedback(null);
    setProbTime(8);
  }

  function submit() {
    if (feedback) return;
    const cur =
      phase === "practice"
        ? problems[techPhaseIdx * 8 + probIdx]
        : problems[24 + speedIdx];
    const val = Number(input.trim());
    const ok = val === cur.answer;
    if (ok) setCorrect((c) => c + 1);
    setScore((s) => s + (ok ? 200 * config.difficulty : 0));
    setFeedback({
      msg: ok ? `Correct! ${cur.hint}` : `Wrong. ${cur.hint}`,
      ok,
    });
    setTimeout(() => advancePractice(), 2200);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const currentTech = SHORTCUT_PHASES[techPhaseIdx];
  const techInfo = TECH_INFO[currentTech];
  const curProb =
    phase === "practice"
      ? problems[techPhaseIdx * 8 + probIdx]
      : phase === "speed"
        ? problems[24 + speedIdx]
        : null;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="shortcut_wizard.page"
    >
      <div className="flex items-center justify-between shrink-0">
        <span className="font-bold text-[#e879f9]">
          {score.toLocaleString()} pts
        </span>
        <div className="w-32 h-2 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-[#e879f9] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">{timeLeft}s</span>
      </div>

      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-5"
        >
          <h2
            className="text-3xl font-black text-[#e879f9]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Shortcut Wizard
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Learn 3 mental math shortcuts. Each gets a tutorial plus 8 practice
            problems. Then a 20-problem speed challenge mixes all three
            techniques.
          </p>
          <div className="space-y-2 text-sm">
            {SHORTCUT_PHASES.map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <div className="w-2 h-2 rounded-full bg-[#e879f9]" />
                {i + 1}. {TECH_INFO[t].title}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              startRef.current = Date.now();
              setPhase("teach");
            }}
            className="px-8 py-3 rounded-lg font-bold text-white hover:opacity-90"
            style={{ background: "#e879f9" }}
            data-ocid="shortcut_wizard.start_button"
          >
            Begin
          </button>
        </motion.div>
      )}

      {phase === "teach" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="rounded-xl border border-[#e879f9]/30 bg-card/50 p-5 space-y-3">
            <div className="text-[#e879f9] font-bold">{techInfo.title}</div>
            <div className="text-sm text-muted-foreground font-mono">
              {techInfo.rule}
            </div>
            {techInfo.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded border border-border/20 bg-background/60 p-3 text-sm"
              >
                <span className="font-bold">{ex.q}</span>{" "}
                <span className="text-[#e879f9]">-- {ex.a}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setProbIdx(0);
              setPhase("practice");
              setProbTime(8);
            }}
            className="py-2.5 rounded-lg font-bold text-white hover:opacity-90"
            style={{ background: "#e879f9" }}
            data-ocid="shortcut_wizard.practice_button"
          >
            Start Practice (8 problems)
          </button>
        </div>
      )}

      {(phase === "practice" || phase === "speed") && curProb && (
        <AnimatePresence mode="wait">
          <motion.div
            key={
              phase === "practice" ? techPhaseIdx * 8 + probIdx : 100 + speedIdx
            }
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {phase === "practice" ? (
                <>
                  <span>
                    {techInfo.title} -- {probIdx + 1}/8
                  </span>
                  <span
                    className={probTime <= 3 ? "text-[#f43f5e] font-bold" : ""}
                  >
                    {probTime}s
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#e879f9] font-bold">
                    SPEED CHALLENGE -- {speedIdx + 1}/20
                  </span>
                  <span
                    className={probTime <= 3 ? "text-[#f43f5e] font-bold" : ""}
                  >
                    {probTime}s
                  </span>
                </>
              )}
            </div>
            <div className="rounded-xl border border-[#e879f9]/30 bg-card/50 p-5 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                {curProb.tech === "square5"
                  ? "Squaring"
                  : curProb.tech === "times11"
                    ? "x11 Trick"
                    : "Percentage"}
              </div>
              <div
                className="text-4xl font-black"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {curProb.question}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !feedback && submit()}
                disabled={!!feedback}
                className="flex-1 text-center text-2xl font-bold rounded-lg border-2 border-[#e879f9]/40 bg-background focus:border-[#e879f9] focus:outline-none p-2"
                placeholder="?"
                data-ocid="shortcut_wizard.input"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!!feedback}
                className="px-5 py-2 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50"
                style={{ background: "#e879f9" }}
                data-ocid="shortcut_wizard.submit_button"
              >
                Check
              </button>
            </div>
            {feedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold text-center"
                style={{ color: feedback.ok ? "#10b981" : "#f43f5e" }}
              >
                {feedback.msg}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ── ROOT ROUTER ──────────────────────────────────────────────────────────────
export default function MagicMathematics({ config, onGameEnd }: Props) {
  switch (config.gameId) {
    case "abacus-master":
      return <AbacusMaster config={config} onGameEnd={onGameEnd} />;
    case "shortcut-wizard":
      return <ShortcutWizard config={config} onGameEnd={onGameEnd} />;
    default:
      return <VedicDojo config={config} onGameEnd={onGameEnd} />;
  }
}
