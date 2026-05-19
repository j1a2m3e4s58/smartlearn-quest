import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// ─── GAME 1: shape-architect (preserved exactly) ──────────────────────────────────────────

type ShapeType = "rectangle" | "triangle" | "circle";
interface ShapeSpec {
  type: ShapeType;
  label: string;
  params: Record<string, number>;
  questions: Question[];
}
interface Question {
  text: string;
  answer: number;
  unit: string;
}
interface Point {
  x: number;
  y: number;
}

const CELL = 32;
const GRID_W = 12;
const GRID_H = 10;

function makeRectSpec(w: number, h: number): ShapeSpec {
  return {
    type: "rectangle",
    label: `Rectangle ${w}×${h}`,
    params: { w, h },
    questions: [
      {
        text: `What is the area of this ${w}×${h} rectangle?`,
        answer: w * h,
        unit: "sq units",
      },
      {
        text: "What is the perimeter of this rectangle?",
        answer: 2 * (w + h),
        unit: "units",
      },
    ],
  };
}
function makeTriSpec(b: number, h: number): ShapeSpec {
  const side = Math.round(Math.sqrt(b * b + h * h) * 10) / 10;
  return {
    type: "triangle",
    label: `Right Triangle base=${b} height=${h}`,
    params: { b, h },
    questions: [
      {
        text: `What is the area of this right triangle (base=${b}, height=${h})?`,
        answer: Math.round(((b * h) / 2) * 10) / 10,
        unit: "sq units",
      },
      {
        text: "What is the hypotenuse (to 1 decimal)?",
        answer: Math.round(side * 10) / 10,
        unit: "units",
      },
    ],
  };
}
function makeCircSpec(r: number): ShapeSpec {
  return {
    type: "circle",
    label: `Circle radius=${r}`,
    params: { r },
    questions: [
      {
        text: `Area of circle radius=${r} (use π≈3.14, round to 2dp)?`,
        answer: Math.round(3.14 * r * r * 100) / 100,
        unit: "sq units",
      },
      {
        text: `Circumference of circle radius=${r} (use π≈3.14, round to 2dp)?`,
        answer: Math.round(2 * 3.14 * r * 100) / 100,
        unit: "units",
      },
    ],
  };
}

const SPECS_BY_DIFF: Record<1 | 2 | 3, ShapeSpec[]> = {
  1: [
    makeRectSpec(4, 3),
    makeRectSpec(5, 2),
    makeRectSpec(6, 4),
    makeRectSpec(3, 7),
  ],
  2: [
    makeRectSpec(5, 4),
    makeRectSpec(8, 3),
    makeTriSpec(3, 4),
    makeTriSpec(6, 8),
  ],
  3: [makeTriSpec(5, 12), makeCircSpec(3), makeCircSpec(5), makeRectSpec(7, 9)],
};

function gridToCanvas(gx: number, gy: number): Point {
  return { x: gx * CELL, y: gy * CELL };
}

function ShapeArchitect({ config, onGameEnd }: Props) {
  const specs = SPECS_BY_DIFF[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "draw" | "quiz" | "over">("idle");
  const [specIdx, setSpecIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [clicks, setClicks] = useState<Point[]>([]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const startTimeRef = useRef(Date.now());

  const spec = specs[specIdx % specs.length];

  const endGame = useCallback(
    (s: number, c: number, t: number) => {
      setPhase("over");
      const accuracy = t > 0 ? (c / t) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, accuracy, timeSpent, true));
    },
    [config, onGameEnd],
  );

  function handleGridClick(gx: number, gy: number) {
    if (phase !== "draw") return;
    const p: Point = { x: gx, y: gy };
    if (clicks.find((c) => c.x === gx && c.y === gy)) return;
    const needed =
      spec.type === "rectangle" ? 2 : spec.type === "triangle" ? 3 : 1;
    const next = [...clicks, p];
    setClicks(next);
    if (next.length >= needed) {
      setTimeout(() => {
        setPhase("quiz");
        setQIdx(0);
        setInput("");
        setFeedback(null);
      }, 400);
    }
  }

  function submitAnswer() {
    const val = Number.parseFloat(input.trim());
    const q = spec.questions[qIdx];
    const newTotal = total + 1;
    setTotal(newTotal);
    if (Math.abs(val - q.answer) <= 0.1) {
      const newCorrect = correct + 1;
      const newScore = score + 200;
      setCorrect(newCorrect);
      setScore(newScore);
      setFeedback(`Correct! ${q.answer} ${q.unit}`);
      if (qIdx + 1 < spec.questions.length) {
        setTimeout(() => {
          setQIdx((qi) => qi + 1);
          setInput("");
          setFeedback(null);
        }, 1000);
      } else {
        const nextIdx = specIdx + 1;
        if (nextIdx >= specs.length) {
          setTimeout(() => endGame(newScore, newCorrect, newTotal), 1000);
        } else {
          setTimeout(() => {
            setSpecIdx(nextIdx);
            setClicks([]);
            setPhase("draw");
            setFeedback(null);
            setInput("");
          }, 1000);
        }
      }
    } else {
      setFeedback(`Not quite. Expected ${q.answer} ${q.unit}`);
      setTimeout(() => {
        setInput("");
        setFeedback(null);
      }, 1500);
    }
  }

  const canvasW = GRID_W * CELL;
  const canvasH = GRID_H * CELL;

  function renderShape() {
    const pts = clicks;
    if (spec.type === "rectangle" && pts.length === 2) {
      const x1 = Math.min(pts[0].x, pts[1].x) * CELL;
      const y1 = Math.min(pts[0].y, pts[1].y) * CELL;
      const x2 = Math.max(pts[0].x, pts[1].x) * CELL;
      const y2 = Math.max(pts[0].y, pts[1].y) * CELL;
      return (
        <rect
          x={x1}
          y={y1}
          width={x2 - x1}
          height={y2 - y1}
          fill="rgba(0,245,255,0.15)"
          stroke="#00f5ff"
          strokeWidth={2}
        />
      );
    }
    if (spec.type === "triangle" && pts.length === 3) {
      const p = pts.map((pp) => gridToCanvas(pp.x, pp.y));
      return (
        <polygon
          points={p.map((pp) => `${pp.x},${pp.y}`).join(" ")}
          fill="rgba(168,85,247,0.15)"
          stroke="#a855f7"
          strokeWidth={2}
        />
      );
    }
    if (spec.type === "circle" && pts.length === 1) {
      return (
        <circle
          cx={pts[0].x * CELL}
          cy={pts[0].y * CELL}
          r={spec.params.r * CELL}
          fill="rgba(245,158,11,0.15)"
          stroke="#f59e0b"
          strokeWidth={2}
        />
      );
    }
    return null;
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="geometry_builder.page"
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
            Shape Architect
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Click on the grid to draw shapes, then answer geometry questions
            about them.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("draw");
            }}
            className="px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="geometry_builder.start_button"
          >
            Begin Building
          </button>
        </motion.div>
      )}
      {(phase === "draw" || phase === "quiz") && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-mono text-[#00f5ff]">
              Shape {specIdx + 1}/{specs.length}: {spec.label}
            </span>
            <span className="text-sm text-muted-foreground">
              Score: <span className="text-[#f59e0b] font-bold">{score}</span>
            </span>
          </div>
          {phase === "draw" && (
            <p className="text-sm text-muted-foreground">
              {spec.type === "rectangle"
                ? "Click 2 corners to draw a rectangle"
                : spec.type === "triangle"
                  ? "Click 3 vertices for a triangle"
                  : "Click the center for a circle"}
            </p>
          )}
          <div className="relative overflow-auto">
            <svg
              width={canvasW}
              height={canvasH}
              className="border border-border/30 rounded cursor-crosshair bg-card/50"
            >
              {Array.from({ length: GRID_W + 1 }, (_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * CELL}
                  y1={0}
                  x2={i * CELL}
                  y2={canvasH}
                  stroke="rgba(255,255,255,0.05)"
                />
              ))}
              {Array.from({ length: GRID_H + 1 }, (_, i) => (
                <line
                  key={`h${i}`}
                  x1={0}
                  y1={i * CELL}
                  x2={canvasW}
                  y2={i * CELL}
                  stroke="rgba(255,255,255,0.05)"
                />
              ))}
              {phase === "draw" &&
                Array.from({ length: GRID_W }, (_, gx) =>
                  Array.from({ length: GRID_H }, (_, gy) => (
                    <rect
                      key={`${gx}-${gy}`}
                      x={gx * CELL}
                      y={gy * CELL}
                      width={CELL}
                      height={CELL}
                      fill="transparent"
                      onClick={() => handleGridClick(gx, gy)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleGridClick(gx, gy);
                      }}
                      tabIndex={0}
                      role="button"
                      className="cursor-crosshair"
                    />
                  )),
                )}
              {clicks.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x * CELL}
                  cy={p.y * CELL}
                  r={5}
                  fill="#00f5ff"
                />
              ))}
              {renderShape()}
            </svg>
          </div>
          {phase === "quiz" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={qIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 p-4 rounded-xl border border-border/30 bg-card"
              >
                <p className="font-medium">{spec.questions[qIdx].text}</p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                    className="w-32 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2"
                    placeholder="?"
                    data-ocid="geometry_builder.answer_input"
                  />
                  <button
                    type="button"
                    onClick={submitAnswer}
                    className="px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                    data-ocid="geometry_builder.submit_button"
                  >
                    Confirm
                  </button>
                </div>
                {feedback && (
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: feedback.startsWith("Correct")
                        ? "#4ade80"
                        : "#f43f5e",
                    }}
                  >
                    {feedback}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}

// ── GAME 2: area-calculator ──────────────────────────────────────────────────────

type CalcShapeType = "rectangle" | "triangle" | "circle" | "parallelogram";
interface CalcShape {
  type: CalcShapeType;
  dims: Record<string, number>;
  label: string;
  questionType: "area" | "perimeter";
  answer: number;
  formula: string;
  unit: string;
}

function genCalcShape(diff: 1 | 2 | 3): CalcShape {
  const types: CalcShapeType[] =
    diff === 1
      ? ["rectangle"]
      : diff === 2
        ? ["rectangle", "triangle"]
        : ["rectangle", "triangle", "circle", "parallelogram"];
  const type = types[randInt(0, types.length - 1)];
  const qType = Math.random() > 0.5 ? "area" : "perimeter";
  if (type === "rectangle") {
    const w = randInt(2, 15);
    const h = randInt(2, 12);
    const answer = qType === "area" ? w * h : 2 * (w + h);
    return {
      type,
      dims: { w, h },
      label: `Rectangle (width=${w}, height=${h})`,
      questionType: qType,
      answer,
      formula:
        qType === "area"
          ? `Area = w × h = ${w} × ${h}`
          : `Perimeter = 2(w+h) = 2(${w}+${h})`,
      unit: qType === "area" ? "sq units" : "units",
    };
  }
  if (type === "triangle") {
    const b = randInt(3, 14);
    const h = randInt(2, 10);
    const area = Math.round(((b * h) / 2) * 10) / 10;
    return {
      type,
      dims: { b, h },
      label: `Triangle (base=${b}, height=${h})`,
      questionType: "area",
      answer: area,
      formula: `Area = (b × h) / 2 = (${b} × ${h}) / 2`,
      unit: "sq units",
    };
  }
  if (type === "circle") {
    const r = randInt(2, 8);
    const area = Math.round(3.14 * r * r * 100) / 100;
    const circ = Math.round(2 * 3.14 * r * 100) / 100;
    const isArea = Math.random() > 0.5;
    return {
      type,
      dims: { r },
      label: `Circle (radius=${r})`,
      questionType: isArea ? "area" : "perimeter",
      answer: isArea ? area : circ,
      formula: isArea
        ? `Area = πr² = 3.14 × ${r}²`
        : `Circumference = 2πr = 2 × 3.14 × ${r}`,
      unit: isArea ? "sq units" : "units",
    };
  }
  // parallelogram
  const b = randInt(4, 14);
  const h = randInt(2, 10);
  return {
    type,
    dims: { b, h },
    label: `Parallelogram (base=${b}, height=${h})`,
    questionType: "area",
    answer: b * h,
    formula: `Area = b × h = ${b} × ${h}`,
    unit: "sq units",
  };
}

function AreaCalculator({ config, onGameEnd }: Props) {
  const TOTAL = 12;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [shape, setShape] = useState<CalcShape>(
    genCalcShape(config.difficulty),
  );
  const [input, setInput] = useState("");
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
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const ok = Math.abs(val - shape.answer) <= 0.1;
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok
        ? `Correct! ${shape.answer} ${shape.unit}`
        : `Wrong. Formula: ${shape.formula} = ${shape.answer} ${shape.unit}`,
      ok,
    });
    setTimeout(
      () => {
        const next = qIdx + 1;
        if (next >= TOTAL) {
          endGame(newScore, newCorrect);
          return;
        }
        setShape(genCalcShape(config.difficulty));
        setInput("");
        setFeedback(null);
        setQIdx(next);
      },
      ok ? 1000 : 2000,
    );
  }

  function ShapeDisplay() {
    if (shape.type === "rectangle") {
      const { w, h } = shape.dims;
      return (
        <svg width={200} height={140} className="mx-auto">
          <rect
            x={20}
            y={20}
            width={w * 10}
            height={h * 10}
            fill="rgba(168,85,247,0.2)"
            stroke="#a855f7"
            strokeWidth={2}
          />
          <text
            x={20 + w * 5}
            y={15}
            textAnchor="middle"
            fontSize={12}
            fill="#a855f7"
          >
            {w}
          </text>
          <text
            x={15}
            y={20 + h * 5}
            textAnchor="middle"
            fontSize={12}
            fill="#a855f7"
          >
            {h}
          </text>
        </svg>
      );
    }
    if (shape.type === "triangle") {
      const { b, h } = shape.dims;
      const bw = b * 10;
      const bh = h * 8;
      return (
        <svg width={200} height={140} className="mx-auto">
          <polygon
            points={`20,${20 + bh} ${20 + bw},${20 + bh} 20,20`}
            fill="rgba(0,245,255,0.2)"
            stroke="#00f5ff"
            strokeWidth={2}
          />
          <text
            x={20 + bw / 2}
            y={20 + bh + 15}
            textAnchor="middle"
            fontSize={12}
            fill="#00f5ff"
          >
            base={b}
          </text>
          <text
            x={8}
            y={20 + bh / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#00f5ff"
          >
            h={h}
          </text>
        </svg>
      );
    }
    if (shape.type === "circle") {
      const r = shape.dims.r * 8;
      return (
        <svg width={200} height={140} className="mx-auto">
          <circle
            cx={100}
            cy={70}
            r={r}
            fill="rgba(245,158,11,0.2)"
            stroke="#f59e0b"
            strokeWidth={2}
          />
          <line
            x1={100}
            y1={70}
            x2={100 + r}
            y2={70}
            stroke="#f59e0b"
            strokeWidth={1}
            strokeDasharray="3,2"
          />
          <text
            x={100 + r / 2}
            y={65}
            textAnchor="middle"
            fontSize={11}
            fill="#f59e0b"
          >
            r={shape.dims.r}
          </text>
        </svg>
      );
    }
    const { b, h } = shape.dims;
    return (
      <svg width={200} height={140} className="mx-auto">
        <polygon
          points={`40,${20 + h * 9} ${20 + b * 10},${20 + h * 9} ${b * 10},20 20,20`}
          fill="rgba(74,222,128,0.2)"
          stroke="#4ade80"
          strokeWidth={2}
        />
        <text
          x={30 + b * 5}
          y={20 + h * 9 + 15}
          textAnchor="middle"
          fontSize={12}
          fill="#4ade80"
        >
          base={b}
        </text>
      </svg>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="area_calculator.page"
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
            Area Calculator
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Shapes are shown with labeled dimensions. Calculate the area or
            perimeter using formulas. Wrong answers reveal the formula.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="area_calculator.start_button"
          >
            Start Calculating
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
            <span>Correct: {correct}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 rounded-xl border border-[#a855f7]/30 bg-card space-y-3"
            >
              <p className="font-semibold">{shape.label}</p>
              <ShapeDisplay />
              <p className="text-sm">
                Calculate the {shape.questionType} ({shape.unit}):
              </p>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-32 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2"
                  placeholder="?"
                  data-ocid="area_calculator.input"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                  data-ocid="area_calculator.submit_button"
                >
                  Calculate
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

// ── GAME 3: angle-master ─────────────────────────────────────────────────────────

type AngleClass = "acute" | "right" | "obtuse" | "straight" | "reflex";
interface AngleTask {
  degrees: number;
  classification: AngleClass;
}

function classifyAngle(deg: number): AngleClass {
  if (deg === 90) return "right";
  if (deg === 180) return "straight";
  if (deg > 180) return "reflex";
  if (deg > 90) return "obtuse";
  return "acute";
}

function genAngleTask(diff: 1 | 2 | 3): AngleTask {
  const deg =
    diff === 1
      ? randInt(1, 3) * 30
      : diff === 2
        ? randInt(1, 11) * 15
        : randInt(1, 35) * 5;
  return { degrees: deg, classification: classifyAngle(deg) };
}

function AngleMaster({ config, onGameEnd }: Props) {
  const TOTAL = 15;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [task, setTask] = useState<AngleTask>(genAngleTask(config.difficulty));
  const [estimateInput, setEstimateInput] = useState("");
  const [classChoice, setClassChoice] = useState<AngleClass | null>(null);
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
    const est = Number.parseInt(estimateInput.trim());
    if (Number.isNaN(est) || classChoice === null) return;
    const estOk = Math.abs(est - task.degrees) <= 10;
    const classOk = classChoice === task.classification;
    const ok = estOk && classOk;
    const partial = estOk || classOk;
    const pts = ok ? 200 : partial ? 80 : 0;
    const newScore = score + pts;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok
        ? `Perfect! ${task.degrees}° is ${task.classification} (+${pts}pts)`
        : partial
          ? `Partial credit (+${pts}). Angle is ${task.degrees}°, classified as ${task.classification}`
          : `Wrong. ${task.degrees}° is ${task.classification}`,
      ok: ok || partial,
    });
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setTask(genAngleTask(config.difficulty));
      setEstimateInput("");
      setClassChoice(null);
      setFeedback(null);
      setQIdx(next);
    }, 1200);
  }

  // Draw protractor SVG with angle indicator
  const cx = 100;
  const cy = 110;
  const r = 80;
  const angleRad = (task.degrees * Math.PI) / 180;
  const endX = cx + r * Math.cos(Math.PI - angleRad);
  const endY = cy - r * Math.sin(angleRad);

  const classes: AngleClass[] = [
    "acute",
    "right",
    "obtuse",
    "straight",
    "reflex",
  ];

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="angle_master.page"
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
            Angle Master
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Estimate angle degrees (within 10°) and classify as acute, right,
            obtuse, straight, or reflex. 15 angles.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="angle_master.start_button"
          >
            Read Angles
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Angle {qIdx + 1}/{TOTAL}
            </span>
            <span>
              Score: <span className="text-[#a855f7] font-bold">{score}</span>
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <svg width={200} height={120} className="mx-auto">
                {/* Protractor arc */}
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="rgba(168,85,247,0.1)"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                />
                {/* Degree marks */}
                {[0, 30, 60, 90, 120, 150, 180].map((deg) => {
                  const a = (deg * Math.PI) / 180;
                  const x1 = cx + (r - 8) * Math.cos(Math.PI - a);
                  const y1 = cy - (r - 8) * Math.sin(a);
                  const x2 = cx + r * Math.cos(Math.PI - a);
                  const y2 = cy - r * Math.sin(a);
                  const lx = cx + (r + 10) * Math.cos(Math.PI - a);
                  const ly = cy - (r + 10) * Math.sin(a);
                  return (
                    <g key={deg}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(168,85,247,0.4)"
                        strokeWidth={1}
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={8}
                        fill="rgba(255,255,255,0.5)"
                      >
                        {deg}
                      </text>
                    </g>
                  );
                })}
                {/* Base line */}
                <line
                  x1={cx - r}
                  y1={cy}
                  x2={cx + r}
                  y2={cy}
                  stroke="#a855f7"
                  strokeWidth={2}
                />
                {/* Angle line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={endX}
                  y2={endY}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                />
                <circle cx={cx} cy={cy} r={3} fill="#f59e0b" />
              </svg>
              <div className="space-y-3 w-full">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Estimate the angle in degrees (within ±10°):
                  </p>
                  <input
                    type="number"
                    value={estimateInput}
                    onChange={(e) => setEstimateInput(e.target.value)}
                    className="w-28 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2"
                    placeholder="?°"
                    data-ocid="angle_master.estimate_input"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Classify this angle:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setClassChoice(cls)}
                        className={`px-3 py-1.5 rounded border text-sm font-semibold capitalize transition-all ${classChoice === cls ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border hover:border-[#a855f7]/50"}`}
                        data-ocid={`angle_master.class.${cls}`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
                {estimateInput && classChoice && (
                  <button
                    type="button"
                    onClick={submit}
                    className="px-6 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity"
                    data-ocid="angle_master.submit_button"
                  >
                    Submit Answer
                  </button>
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
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────

export default function GeometryBuilder({ config, onGameEnd }: Props) {
  if (config.gameId === "area-calculator")
    return <AreaCalculator config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "angle-master")
    return <AngleMaster config={config} onGameEnd={onGameEnd} />;
  return <ShapeArchitect config={config} onGameEnd={onGameEnd} />;
}
