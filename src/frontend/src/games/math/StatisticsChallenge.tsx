import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
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
function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// ── GAME 1: data-detective (preserved) ─────────────────────────────────────────────

interface Dataset {
  label: string;
  values: number[];
  categories: string[];
}
interface StatQuestion {
  text: string;
  answer: number;
  hint: string;
}

function genDataset(diff: 1 | 2 | 3): Dataset {
  const cats = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const count = diff === 1 ? 5 : diff === 2 ? 6 : 7;
  const max = diff === 1 ? 20 : diff === 2 ? 50 : 100;
  const values = Array.from({ length: count }, () => randInt(1, max));
  return { label: "Data Set", values, categories: cats.slice(0, count) };
}

function calcStats(vals: number[]) {
  const sorted = [...vals].sort((a, b) => a - b);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const freq: Record<number, number> = {};
  vals.forEach((v) => {
    freq[v] = (freq[v] || 0) + 1;
  });
  const maxF = Math.max(...Object.values(freq));
  const mode = Number.parseInt(
    Object.keys(freq).find((k) => freq[Number(k)] === maxF) || "0",
  );
  const range = sorted[sorted.length - 1] - sorted[0];
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
  return {
    mean: round1(mean),
    mode,
    range,
    median,
    stddev: round1(Math.sqrt(variance)),
  };
}

function genQuestions(dataset: Dataset, diff: 1 | 2 | 3): StatQuestion[] {
  const s = calcStats(dataset.values);
  const qs: StatQuestion[] = [
    {
      text: `What is the MEAN of: ${dataset.values.join(", ")}?`,
      answer: s.mean,
      hint: `Add all values and divide by ${dataset.values.length}`,
    },
    {
      text: `What is the RANGE of: ${dataset.values.join(", ")}?`,
      answer: s.range,
      hint: `Max minus Min: ${Math.max(...dataset.values)} - ${Math.min(...dataset.values)}`,
    },
    {
      text: `What is the MEDIAN of: ${dataset.values.join(", ")}?`,
      answer: s.median,
      hint: "Sort values and find the middle",
    },
  ];
  if (diff >= 2)
    qs.push({
      text: `What is the MODE of: ${dataset.values.join(", ")}?`,
      answer: s.mode,
      hint: "Most frequently occurring value",
    });
  if (diff === 3)
    qs.push({
      text: `Std deviation of: ${dataset.values.join(", ")} (1dp)?`,
      answer: s.stddev,
      hint: `stddev = sqrt(variance) = ${s.stddev}`,
    });
  return qs;
}

function DataDetective({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [dataset, setDataset] = useState<Dataset>(
    genDataset(config.difficulty),
  );
  const [questions, setQuestions] = useState<StatQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [rounds, setRounds] = useState(0);
  const MAX_ROUNDS = 3;
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const totalRef = useRef(total);
  totalRef.current = total;

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    setPhase("over");
    const acc =
      totalRef.current > 0 ? (correctRef.current / totalRef.current) * 100 : 0;
    onGameEnd(
      buildResult(
        config,
        scoreRef.current,
        acc,
        Math.floor((Date.now() - startTimeRef.current) / 1000),
        false,
      ),
    );
  });

  const endGame = useCallback(() => {
    setPhase("over");
    const acc =
      totalRef.current > 0 ? (correctRef.current / totalRef.current) * 100 : 0;
    onGameEnd(
      buildResult(
        config,
        scoreRef.current,
        acc,
        Math.floor((Date.now() - startTimeRef.current) / 1000),
        true,
      ),
    );
  }, [config, onGameEnd]);

  function startGame() {
    startTimeRef.current = Date.now();
    const ds = genDataset(config.difficulty);
    setDataset(ds);
    const qs = genQuestions(ds, config.difficulty);
    setQuestions(qs);
    setQIdx(0);
    setPhase("playing");
    startTimer();
  }

  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const q = questions[qIdx];
    const newTotal = total + 1;
    setTotal(newTotal);
    if (Math.abs(val - q.answer) <= 0.15) {
      const newCorrect = correct + 1;
      const newScore = score + 200;
      setCorrect(newCorrect);
      setScore(newScore);
      scoreRef.current = newScore;
      correctRef.current = newCorrect;
      setFeedback({ msg: `Correct! ${q.answer}`, ok: true });
      const nextQ = qIdx + 1;
      if (nextQ >= questions.length) {
        const nextRound = rounds + 1;
        setRounds(nextRound);
        if (nextRound >= MAX_ROUNDS) {
          setTimeout(endGame, 800);
          return;
        }
        setTimeout(() => {
          const ds = genDataset(config.difficulty);
          setDataset(ds);
          setQuestions(genQuestions(ds, config.difficulty));
          setQIdx(0);
          setInput("");
          setFeedback(null);
        }, 800);
      } else {
        setTimeout(() => {
          setQIdx(nextQ);
          setInput("");
          setFeedback(null);
        }, 800);
      }
    } else {
      setFeedback({ msg: `Incorrect. Hint: ${q.hint}`, ok: false });
      setTimeout(() => {
        setInput("");
        setFeedback(null);
      }, 1500);
    }
  }

  const barMax = Math.max(...dataset.values);
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="statistics_challenge.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Data Detective
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Analyze datasets and answer statistical questions. Calculate mean,
            mode, median, range, and more.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="statistics_challenge.start_button"
          >
            Investigate Data
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-[#f59e0b] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Round {rounds + 1}/{MAX_ROUNDS} | Q {qIdx + 1}/{questions.length}
            </span>
            <span>
              Score: <span className="text-[#f59e0b] font-bold">{score}</span>
            </span>
            <span>{timeLeft}s</span>
          </div>
          <div className="p-3 rounded-xl border border-border/30 bg-card">
            <div className="flex items-end gap-1 h-32">
              {dataset.values.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-mono text-[#f59e0b]">{v}</span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${(v / barMax) * 100}%`,
                      background: "#f59e0b",
                      opacity: 0.7 + (i % 3) * 0.1,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {dataset.categories[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="font-medium text-sm">{questions[qIdx]?.text}</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-32 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2"
                  placeholder="?"
                  data-ocid="statistics_challenge.answer_input"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="px-5 py-2 rounded bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity"
                  data-ocid="statistics_challenge.submit_button"
                >
                  Submit
                </button>
              </div>
              {feedback && (
                <p
                  className="text-sm font-bold"
                  style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
                >
                  {feedback.msg}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── GAME 2: graph-reader ────────────────────────────────────────────────────────

type ChartType = "bar" | "line" | "pie";
interface ChartData {
  label: string;
  categories: string[];
  values: number[];
  chartType: ChartType;
  questions: { text: string; answer: number | string; isNum: boolean }[];
}

function genChartData(diff: 1 | 2 | 3): ChartData {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const SUBJECTS = ["Math", "Science", "English", "ICT", "Art"];
  const count = diff === 1 ? 4 : diff === 2 ? 5 : 6;
  const max = diff === 1 ? 50 : diff === 2 ? 100 : 200;
  const scenarios = [
    {
      label: "Monthly Sales (GHS)",
      cats: MONTHS.slice(0, count),
      chart: "bar" as ChartType,
    },
    {
      label: "Test Scores",
      cats: SUBJECTS.slice(0, count),
      chart: "bar" as ChartType,
    },
    {
      label: "Temperature (°C)",
      cats: MONTHS.slice(0, count),
      chart: "line" as ChartType,
    },
  ];
  const scenario = scenarios[randInt(0, scenarios.length - 1)];
  const values = Array.from({ length: count }, () => randInt(10, max));
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const maxIdx = values.indexOf(maxVal);
  const minIdx = values.indexOf(minVal);
  const total = values.reduce((a, b) => a + b, 0);
  return {
    label: scenario.label,
    categories: scenario.cats,
    values,
    chartType: scenario.chart,
    questions: [
      { text: "What is the highest value?", answer: maxVal, isNum: true },
      {
        text: "Which category had the highest value?",
        answer: scenario.cats[maxIdx],
        isNum: false,
      },
      { text: "What is the lowest value?", answer: minVal, isNum: true },
      {
        text: "Which category had the lowest value?",
        answer: scenario.cats[minIdx],
        isNum: false,
      },
      {
        text: "What is the total across all categories?",
        answer: total,
        isNum: true,
      },
    ],
  };
}

function GraphReader({ config, onGameEnd }: Props) {
  const TOTAL_CHARTS = 3;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [chart, setChart] = useState<ChartData>(
    genChartData(config.difficulty),
  );
  const [qIdx, setQIdx] = useState(0);
  const [chartIdx, setChartIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;

  const totalQs = TOTAL_CHARTS * 5;

  const endGame = useCallback(
    (s: number, c: number) => {
      const acc = totalQs > 0 ? (c / totalQs) * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd, totalQs],
  );

  const q = chart.questions[qIdx];
  const barMax = Math.max(...chart.values);

  function submit() {
    const rawInput = input.trim();
    const ok = q.isNum
      ? Math.abs(Number.parseFloat(rawInput) - (q.answer as number)) < 0.5
      : rawInput.toLowerCase() === String(q.answer).toLowerCase();
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! ${q.answer}` : `Wrong. Answer: ${q.answer}`,
      ok,
    });
    setTimeout(() => {
      const nextQ = qIdx + 1;
      if (nextQ >= 5) {
        const nextChart = chartIdx + 1;
        if (nextChart >= TOTAL_CHARTS) {
          endGame(newScore, newCorrect);
          return;
        }
        setChart(genChartData(config.difficulty));
        setChartIdx(nextChart);
        setQIdx(0);
      } else {
        setQIdx(nextQ);
      }
      setInput("");
      setFeedback(null);
    }, 1000);
  }

  const svgW = 280;
  const svgH = 120;

  function BarChart() {
    const bw = (svgW - 20) / chart.values.length - 4;
    return (
      <svg width={svgW} height={svgH} className="w-full">
        {chart.values.map((v, i) => {
          const h = (v / barMax) * (svgH - 30);
          const x = 10 + i * ((svgW - 20) / chart.values.length);
          return (
            <g key={i}>
              <rect
                x={x}
                y={svgH - h - 20}
                width={bw}
                height={h}
                fill="#f59e0b"
                opacity={0.7 + i * 0.05}
                rx={2}
              />
              <text
                x={x + bw / 2}
                y={svgH - h - 24}
                textAnchor="middle"
                fontSize={9}
                fill="#f59e0b"
              >
                {v}
              </text>
              <text
                x={x + bw / 2}
                y={svgH - 5}
                textAnchor="middle"
                fontSize={8}
                fill="rgba(255,255,255,0.5)"
              >
                {chart.categories[i]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  function LineChart() {
    const pts = chart.values
      .map((v, i) => {
        const x = 15 + i * ((svgW - 30) / (chart.values.length - 1));
        const y = svgH - 20 - (v / barMax) * (svgH - 30);
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg width={svgW} height={svgH} className="w-full">
        <polyline points={pts} fill="none" stroke="#00f5ff" strokeWidth={2} />
        {chart.values.map((v, i) => {
          const x = 15 + i * ((svgW - 30) / (chart.values.length - 1));
          const y = svgH - 20 - (v / barMax) * (svgH - 30);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill="#00f5ff" />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                fontSize={9}
                fill="#00f5ff"
              >
                {v}
              </text>
              <text
                x={x}
                y={svgH - 4}
                textAnchor="middle"
                fontSize={8}
                fill="rgba(255,255,255,0.5)"
              >
                {chart.categories[i]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="graph_reader.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Graph Reader
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Read bar charts and line graphs. Answer questions about values,
            categories, and totals. {TOTAL_CHARTS} charts, 5 questions each.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="graph_reader.start_button"
          >
            Read Graphs
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Chart {chartIdx + 1}/{TOTAL_CHARTS} | Q {qIdx + 1}/5
            </span>
            <span>
              Score: <span className="text-[#f59e0b] font-bold">{score}</span>
            </span>
          </div>
          <div className="p-3 rounded-xl border border-border/30 bg-card">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">
              {chart.label}
            </p>
            {chart.chartType === "bar" ? <BarChart /> : <LineChart />}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${chartIdx}-${qIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium">{q.text}</p>
              {q.isNum ? (
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="w-32 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2"
                    placeholder="?"
                    data-ocid="graph_reader.num_input"
                  />
                  <button
                    type="button"
                    onClick={submit}
                    className="px-5 py-2 rounded bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity"
                    data-ocid="graph_reader.submit_button"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {chart.categories.map((cat, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInput(cat);
                        submit();
                      }}
                      className="px-4 py-2 rounded-lg border-2 border-border font-bold text-sm hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 transition-all"
                      data-ocid={`graph_reader.cat.${i + 1}`}
                    >
                      {cat}
                    </button>
                  ))}
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
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── GAME 3: probability-lab ──────────────────────────────────────────────────────

type ProbScenario = "bag" | "spinner";
interface ProbProblem {
  scenario: ProbScenario;
  description: string;
  question: string;
  answerNum: number;
  answerDen: number;
  // bag data
  bagItems?: { color: string; count: number }[];
  // spinner data
  spinnerSections?: { label: string; count: number }[];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function simplify(n: number, d: number): [number, number] {
  const g = gcd(n, d);
  return [n / g, d / g];
}

const COLORS = ["Red", "Blue", "Green", "Yellow", "Purple"];

function genProbProblem(diff: 1 | 2 | 3): ProbProblem {
  if (diff === 1 || Math.random() > 0.5) {
    const numColors = diff === 1 ? 2 : diff === 2 ? 3 : 4;
    const items = COLORS.slice(0, numColors).map((c) => ({
      color: c,
      count: randInt(1, 5),
    }));
    const total = items.reduce((s, i) => s + i.count, 0);
    const picked = items[randInt(0, items.length - 1)];
    const [sn, sd] = simplify(picked.count, total);
    return {
      scenario: "bag",
      description: `Bag contains: ${items.map((i) => `${i.count} ${i.color}`).join(", ")}`,
      question: `P(picking ${picked.color})?`,
      answerNum: sn,
      answerDen: sd,
      bagItems: items,
    };
  }
  // spinner
  const numSections = diff === 2 ? 4 : 6;
  const sections = Array.from({ length: numSections }, (_, i) => ({
    label: `Section ${i + 1}`,
    count: randInt(1, 3),
  }));
  const total = sections.reduce((s, i) => s + i.count, 0);
  const picked = sections[randInt(0, sections.length - 1)];
  const [sn, sd] = simplify(picked.count, total);
  return {
    scenario: "spinner",
    description: `Spinner with ${numSections} sections of varying sizes`,
    question: `P(landing on ${picked.label})?`,
    answerNum: sn,
    answerDen: sd,
    spinnerSections: sections,
  };
}

function ProbabilityLab({ config, onGameEnd }: Props) {
  const TOTAL = 12;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [problem, setProblem] = useState<ProbProblem>(
    genProbProblem(config.difficulty),
  );
  const [numInput, setNumInput] = useState("");
  const [denInput, setDenInput] = useState("");
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

  function submit() {
    const n = Number.parseInt(numInput.trim());
    const d = Number.parseInt(denInput.trim());
    if (Number.isNaN(n) || Number.isNaN(d) || d === 0) return;
    const [sn, sd] = simplify(n, d);
    const ok = sn === problem.answerNum && sd === problem.answerDen;
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok
        ? `Correct! P = ${problem.answerNum}/${problem.answerDen}`
        : `Wrong. P = ${problem.answerNum}/${problem.answerDen}`,
      ok,
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setProblem(genProbProblem(config.difficulty));
      setNumInput("");
      setDenInput("");
      setFeedback(null);
      setQIdx(next);
    }, 1000);
  }

  // Bag visualization
  function BagViz() {
    if (!problem.bagItems) return null;
    const colorMap: Record<string, string> = {
      Red: "#f43f5e",
      Blue: "#3b82f6",
      Green: "#4ade80",
      Yellow: "#f59e0b",
      Purple: "#a855f7",
    };
    return (
      <div className="p-3 rounded-xl border border-border/30 bg-card">
        <p className="text-xs text-muted-foreground mb-2">Bag contents:</p>
        <div className="flex flex-wrap gap-2">
          {problem.bagItems.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              {Array.from({ length: item.count }, (_, j) => (
                <div
                  key={j}
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ background: colorMap[item.color] || "#888" }}
                />
              ))}
              <span className="text-xs font-mono">{item.color}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="probability_lab.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Probability Lab
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Calculate the probability of events as fractions. Scenarios include
            bags of colored balls and spinners. 12 problems.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="probability_lab.start_button"
          >
            Enter Lab
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
              Score: <span className="text-[#f59e0b] font-bold">{score}</span>
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <p className="text-sm text-muted-foreground">
                {problem.description}
              </p>
              {problem.scenario === "bag" && <BagViz />}
              {problem.scenario === "spinner" && problem.spinnerSections && (
                <div className="p-3 rounded-xl border border-border/30 bg-card">
                  <p className="text-xs text-muted-foreground mb-2">
                    Spinner sections:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {problem.spinnerSections.map((s, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 rounded border border-[#f59e0b]/40 text-xs font-mono"
                      >
                        {s.label}: {s.count} wedge{s.count > 1 ? "s" : ""}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-sm font-bold">{problem.question}</p>
              <p className="text-xs text-muted-foreground">
                Enter as a fraction (numerator / denominator):
              </p>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min="0"
                  value={numInput}
                  onChange={(e) => setNumInput(e.target.value)}
                  className="w-20 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2"
                  placeholder="?"
                  data-ocid="probability_lab.num_input"
                />
                <span className="text-2xl font-bold">/</span>
                <input
                  type="number"
                  min="1"
                  value={denInput}
                  onChange={(e) => setDenInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-20 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2"
                  placeholder="?"
                  data-ocid="probability_lab.den_input"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="px-5 py-2 rounded bg-[#f59e0b] text-black font-bold hover:opacity-90 transition-opacity"
                  data-ocid="probability_lab.submit_button"
                >
                  Submit
                </button>
              </div>
              {feedback && (
                <p
                  className="text-sm font-bold"
                  style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
                >
                  {feedback.msg}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────

export default function StatisticsChallenge({ config, onGameEnd }: Props) {
  if (config.gameId === "graph-reader")
    return <GraphReader config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "probability-lab")
    return <ProbabilityLab config={config} onGameEnd={onGameEnd} />;
  return <DataDetective config={config} onGameEnd={onGameEnd} />;
}
