import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
const CELL = 32;
const GRID_W = 12;
const GRID_H = 10;
function makeRectSpec(w, h) {
  return {
    type: "rectangle",
    label: `Rectangle ${w}×${h}`,
    params: { w, h },
    questions: [
      {
        text: `What is the area of this ${w}×${h} rectangle?`,
        answer: w * h,
        unit: "sq units"
      },
      {
        text: "What is the perimeter of this rectangle?",
        answer: 2 * (w + h),
        unit: "units"
      }
    ]
  };
}
function makeTriSpec(b, h) {
  const side = Math.round(Math.sqrt(b * b + h * h) * 10) / 10;
  return {
    type: "triangle",
    label: `Right Triangle base=${b} height=${h}`,
    params: { b, h },
    questions: [
      {
        text: `What is the area of this right triangle (base=${b}, height=${h})?`,
        answer: Math.round(b * h / 2 * 10) / 10,
        unit: "sq units"
      },
      {
        text: "What is the hypotenuse (to 1 decimal)?",
        answer: Math.round(side * 10) / 10,
        unit: "units"
      }
    ]
  };
}
function makeCircSpec(r) {
  return {
    type: "circle",
    label: `Circle radius=${r}`,
    params: { r },
    questions: [
      {
        text: `Area of circle radius=${r} (use π≈3.14, round to 2dp)?`,
        answer: Math.round(3.14 * r * r * 100) / 100,
        unit: "sq units"
      },
      {
        text: `Circumference of circle radius=${r} (use π≈3.14, round to 2dp)?`,
        answer: Math.round(2 * 3.14 * r * 100) / 100,
        unit: "units"
      }
    ]
  };
}
const SPECS_BY_DIFF = {
  1: [
    makeRectSpec(4, 3),
    makeRectSpec(5, 2),
    makeRectSpec(6, 4),
    makeRectSpec(3, 7)
  ],
  2: [
    makeRectSpec(5, 4),
    makeRectSpec(8, 3),
    makeTriSpec(3, 4),
    makeTriSpec(6, 8)
  ],
  3: [makeTriSpec(5, 12), makeCircSpec(3), makeCircSpec(5), makeRectSpec(7, 9)]
};
function gridToCanvas(gx, gy) {
  return { x: gx * CELL, y: gy * CELL };
}
function ShapeArchitect({ config, onGameEnd }) {
  const specs = SPECS_BY_DIFF[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [specIdx, setSpecIdx] = reactExports.useState(0);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [clicks, setClicks] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const spec = specs[specIdx % specs.length];
  const endGame = reactExports.useCallback(
    (s, c, t) => {
      setPhase("over");
      const accuracy = t > 0 ? c / t * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, accuracy, timeSpent, true));
    },
    [config, onGameEnd]
  );
  function handleGridClick(gx, gy) {
    if (phase !== "draw") return;
    const p = { x: gx, y: gy };
    if (clicks.find((c) => c.x === gx && c.y === gy)) return;
    const needed = spec.type === "rectangle" ? 2 : spec.type === "triangle" ? 3 : 1;
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
        }, 1e3);
      } else {
        const nextIdx = specIdx + 1;
        if (nextIdx >= specs.length) {
          setTimeout(() => endGame(newScore, newCorrect, newTotal), 1e3);
        } else {
          setTimeout(() => {
            setSpecIdx(nextIdx);
            setClicks([]);
            setPhase("draw");
            setFeedback(null);
            setInput("");
          }, 1e3);
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
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1,
          fill: "rgba(0,245,255,0.15)",
          stroke: "#00f5ff",
          strokeWidth: 2
        }
      );
    }
    if (spec.type === "triangle" && pts.length === 3) {
      const p = pts.map((pp) => gridToCanvas(pp.x, pp.y));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "polygon",
        {
          points: p.map((pp) => `${pp.x},${pp.y}`).join(" "),
          fill: "rgba(168,85,247,0.15)",
          stroke: "#a855f7",
          strokeWidth: 2
        }
      );
    }
    if (spec.type === "circle" && pts.length === 1) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: pts[0].x * CELL,
          cy: pts[0].y * CELL,
          r: spec.params.r * CELL,
          fill: "rgba(245,158,11,0.15)",
          stroke: "#f59e0b",
          strokeWidth: 2
        }
      );
    }
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "geometry_builder.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Shape Architect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Click on the grid to draw shapes, then answer geometry questions about them." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("draw");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "geometry_builder.start_button",
                  children: "Begin Building"
                }
              )
            ]
          }
        ),
        (phase === "draw" || phase === "quiz") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono text-[#00f5ff]", children: [
              "Shape ",
              specIdx + 1,
              "/",
              specs.length,
              ": ",
              spec.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: score })
            ] })
          ] }),
          phase === "draw" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: spec.type === "rectangle" ? "Click 2 corners to draw a rectangle" : spec.type === "triangle" ? "Click 3 vertices for a triangle" : "Click the center for a circle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              width: canvasW,
              height: canvasH,
              className: "border border-border/30 rounded cursor-crosshair bg-card/50",
              children: [
                Array.from({ length: GRID_W + 1 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: i * CELL,
                    y1: 0,
                    x2: i * CELL,
                    y2: canvasH,
                    stroke: "rgba(255,255,255,0.05)"
                  },
                  `v${i}`
                )),
                Array.from({ length: GRID_H + 1 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: 0,
                    y1: i * CELL,
                    x2: canvasW,
                    y2: i * CELL,
                    stroke: "rgba(255,255,255,0.05)"
                  },
                  `h${i}`
                )),
                phase === "draw" && Array.from(
                  { length: GRID_W },
                  (_, gx) => Array.from({ length: GRID_H }, (_2, gy) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: gx * CELL,
                      y: gy * CELL,
                      width: CELL,
                      height: CELL,
                      fill: "transparent",
                      onClick: () => handleGridClick(gx, gy),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") handleGridClick(gx, gy);
                      },
                      tabIndex: 0,
                      role: "button",
                      className: "cursor-crosshair"
                    },
                    `${gx}-${gy}`
                  ))
                ),
                clicks.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: p.x * CELL,
                    cy: p.y * CELL,
                    r: 5,
                    fill: "#00f5ff"
                  },
                  i
                )),
                renderShape()
              ]
            }
          ) }),
          phase === "quiz" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "space-y-3 p-4 rounded-xl border border-border/30 bg-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: spec.questions[qIdx].text }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submitAnswer(),
                      className: "w-32 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "geometry_builder.answer_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submitAnswer,
                      className: "px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "geometry_builder.submit_button",
                      children: "Confirm"
                    }
                  )
                ] }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-bold",
                    style: {
                      color: feedback.startsWith("Correct") ? "#4ade80" : "#f43f5e"
                    },
                    children: feedback
                  }
                )
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
function genCalcShape(diff) {
  const types = diff === 1 ? ["rectangle"] : diff === 2 ? ["rectangle", "triangle"] : ["rectangle", "triangle", "circle", "parallelogram"];
  const type = types[randInt(0, types.length - 1)];
  const qType = Math.random() > 0.5 ? "area" : "perimeter";
  if (type === "rectangle") {
    const w = randInt(2, 15);
    const h2 = randInt(2, 12);
    const answer = qType === "area" ? w * h2 : 2 * (w + h2);
    return {
      type,
      dims: { w, h: h2 },
      label: `Rectangle (width=${w}, height=${h2})`,
      questionType: qType,
      answer,
      formula: qType === "area" ? `Area = w × h = ${w} × ${h2}` : `Perimeter = 2(w+h) = 2(${w}+${h2})`,
      unit: qType === "area" ? "sq units" : "units"
    };
  }
  if (type === "triangle") {
    const b2 = randInt(3, 14);
    const h2 = randInt(2, 10);
    const area = Math.round(b2 * h2 / 2 * 10) / 10;
    return {
      type,
      dims: { b: b2, h: h2 },
      label: `Triangle (base=${b2}, height=${h2})`,
      questionType: "area",
      answer: area,
      formula: `Area = (b × h) / 2 = (${b2} × ${h2}) / 2`,
      unit: "sq units"
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
      formula: isArea ? `Area = πr² = 3.14 × ${r}²` : `Circumference = 2πr = 2 × 3.14 × ${r}`,
      unit: isArea ? "sq units" : "units"
    };
  }
  const b = randInt(4, 14);
  const h = randInt(2, 10);
  return {
    type,
    dims: { b, h },
    label: `Parallelogram (base=${b}, height=${h})`,
    questionType: "area",
    answer: b * h,
    formula: `Area = b × h = ${b} × ${h}`,
    unit: "sq units"
  };
}
function AreaCalculator({ config, onGameEnd }) {
  const TOTAL = 12;
  const [phase, setPhase] = reactExports.useState("idle");
  const [shape, setShape] = reactExports.useState(
    genCalcShape(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (s, c) => {
      const acc = c / TOTAL * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd]
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
      msg: ok ? `Correct! ${shape.answer} ${shape.unit}` : `Wrong. Formula: ${shape.formula} = ${shape.answer} ${shape.unit}`,
      ok
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
      ok ? 1e3 : 2e3
    );
  }
  function ShapeDisplay() {
    if (shape.type === "rectangle") {
      const { w, h: h2 } = shape.dims;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 200, height: 140, className: "mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: 20,
            y: 20,
            width: w * 10,
            height: h2 * 10,
            fill: "rgba(168,85,247,0.2)",
            stroke: "#a855f7",
            strokeWidth: 2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: 20 + w * 5,
            y: 15,
            textAnchor: "middle",
            fontSize: 12,
            fill: "#a855f7",
            children: w
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: 15,
            y: 20 + h2 * 5,
            textAnchor: "middle",
            fontSize: 12,
            fill: "#a855f7",
            children: h2
          }
        )
      ] });
    }
    if (shape.type === "triangle") {
      const { b: b2, h: h2 } = shape.dims;
      const bw = b2 * 10;
      const bh = h2 * 8;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 200, height: 140, className: "mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polygon",
          {
            points: `20,${20 + bh} ${20 + bw},${20 + bh} 20,20`,
            fill: "rgba(0,245,255,0.2)",
            stroke: "#00f5ff",
            strokeWidth: 2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: 20 + bw / 2,
            y: 20 + bh + 15,
            textAnchor: "middle",
            fontSize: 12,
            fill: "#00f5ff",
            children: [
              "base=",
              b2
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: 8,
            y: 20 + bh / 2,
            textAnchor: "middle",
            fontSize: 12,
            fill: "#00f5ff",
            children: [
              "h=",
              h2
            ]
          }
        )
      ] });
    }
    if (shape.type === "circle") {
      const r = shape.dims.r * 8;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 200, height: 140, className: "mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 100,
            cy: 70,
            r,
            fill: "rgba(245,158,11,0.2)",
            stroke: "#f59e0b",
            strokeWidth: 2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 100,
            y1: 70,
            x2: 100 + r,
            y2: 70,
            stroke: "#f59e0b",
            strokeWidth: 1,
            strokeDasharray: "3,2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: 100 + r / 2,
            y: 65,
            textAnchor: "middle",
            fontSize: 11,
            fill: "#f59e0b",
            children: [
              "r=",
              shape.dims.r
            ]
          }
        )
      ] });
    }
    const { b, h } = shape.dims;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 200, height: 140, className: "mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "polygon",
        {
          points: `40,${20 + h * 9} ${20 + b * 10},${20 + h * 9} ${b * 10},20 20,20`,
          fill: "rgba(74,222,128,0.2)",
          stroke: "#4ade80",
          strokeWidth: 2
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "text",
        {
          x: 30 + b * 5,
          y: 20 + h * 9 + 15,
          textAnchor: "middle",
          fontSize: 12,
          fill: "#4ade80",
          children: [
            "base=",
            b
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "area_calculator.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Area Calculator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Shapes are shown with labeled dimensions. Calculate the area or perimeter using formulas. Wrong answers reveal the formula." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "area_calculator.start_button",
                  children: "Start Calculating"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Problem ",
              qIdx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Correct: ",
              correct
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              className: "p-4 rounded-xl border border-[#a855f7]/30 bg-card space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: shape.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShapeDisplay, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                  "Calculate the ",
                  shape.questionType,
                  " (",
                  shape.unit,
                  "):"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.01",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "w-32 text-center text-xl font-bold rounded border-2 border-[#a855f7]/50 bg-background focus:border-[#a855f7] focus:outline-none p-2",
                      placeholder: "?",
                      "data-ocid": "area_calculator.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-5 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "area_calculator.submit_button",
                      children: "Calculate"
                    }
                  )
                ] }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-bold",
                    style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                    children: feedback.msg
                  }
                )
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
function classifyAngle(deg) {
  if (deg === 90) return "right";
  if (deg === 180) return "straight";
  if (deg > 180) return "reflex";
  if (deg > 90) return "obtuse";
  return "acute";
}
function genAngleTask(diff) {
  const deg = diff === 1 ? randInt(1, 3) * 30 : diff === 2 ? randInt(1, 11) * 15 : randInt(1, 35) * 5;
  return { degrees: deg, classification: classifyAngle(deg) };
}
function AngleMaster({ config, onGameEnd }) {
  const TOTAL = 15;
  const [phase, setPhase] = reactExports.useState("idle");
  const [task, setTask] = reactExports.useState(genAngleTask(config.difficulty));
  const [estimateInput, setEstimateInput] = reactExports.useState("");
  const [classChoice, setClassChoice] = reactExports.useState(null);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (s, c) => {
      const acc = c / TOTAL * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd]
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
      msg: ok ? `Perfect! ${task.degrees}° is ${task.classification} (+${pts}pts)` : partial ? `Partial credit (+${pts}). Angle is ${task.degrees}°, classified as ${task.classification}` : `Wrong. ${task.degrees}° is ${task.classification}`,
      ok: ok || partial
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
  const cx = 100;
  const cy = 110;
  const r = 80;
  const angleRad = task.degrees * Math.PI / 180;
  const endX = cx + r * Math.cos(Math.PI - angleRad);
  const endY = cy - r * Math.sin(angleRad);
  const classes = [
    "acute",
    "right",
    "obtuse",
    "straight",
    "reflex"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "angle_master.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Angle Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Estimate angle degrees (within 10°) and classify as acute, right, obtuse, straight, or reflex. 15 angles." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#a855f7] text-white font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "angle_master.start_button",
                  children: "Read Angles"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Angle ",
              qIdx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex flex-col items-center gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 200, height: 120, className: "mx-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`,
                      fill: "rgba(168,85,247,0.1)",
                      stroke: "#a855f7",
                      strokeWidth: 1.5
                    }
                  ),
                  [0, 30, 60, 90, 120, 150, 180].map((deg) => {
                    const a = deg * Math.PI / 180;
                    const x1 = cx + (r - 8) * Math.cos(Math.PI - a);
                    const y1 = cy - (r - 8) * Math.sin(a);
                    const x2 = cx + r * Math.cos(Math.PI - a);
                    const y2 = cy - r * Math.sin(a);
                    const lx = cx + (r + 10) * Math.cos(Math.PI - a);
                    const ly = cy - (r + 10) * Math.sin(a);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "line",
                        {
                          x1,
                          y1,
                          x2,
                          y2,
                          stroke: "rgba(168,85,247,0.4)",
                          strokeWidth: 1
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: lx,
                          y: ly,
                          textAnchor: "middle",
                          dominantBaseline: "middle",
                          fontSize: 8,
                          fill: "rgba(255,255,255,0.5)",
                          children: deg
                        }
                      )
                    ] }, deg);
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "line",
                    {
                      x1: cx - r,
                      y1: cy,
                      x2: cx + r,
                      y2: cy,
                      stroke: "#a855f7",
                      strokeWidth: 2
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "line",
                    {
                      x1: cx,
                      y1: cy,
                      x2: endX,
                      y2: endY,
                      stroke: "#f59e0b",
                      strokeWidth: 2.5
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: 3, fill: "#f59e0b" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Estimate the angle in degrees (within ±10°):" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        value: estimateInput,
                        onChange: (e) => setEstimateInput(e.target.value),
                        className: "w-28 text-center text-xl font-bold rounded border-2 border-[#f59e0b]/50 bg-background focus:border-[#f59e0b] focus:outline-none p-2",
                        placeholder: "?°",
                        "data-ocid": "angle_master.estimate_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Classify this angle:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setClassChoice(cls),
                        className: `px-3 py-1.5 rounded border text-sm font-semibold capitalize transition-all ${classChoice === cls ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border hover:border-[#a855f7]/50"}`,
                        "data-ocid": `angle_master.class.${cls}`,
                        children: cls
                      },
                      cls
                    )) })
                  ] }),
                  estimateInput && classChoice && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-6 py-2 rounded bg-[#a855f7] text-white font-bold hover:opacity-90 transition-opacity",
                      "data-ocid": "angle_master.submit_button",
                      children: "Submit Answer"
                    }
                  ),
                  feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-bold",
                      style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                      children: feedback.msg
                    }
                  )
                ] })
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
function GeometryBuilder({ config, onGameEnd }) {
  if (config.gameId === "area-calculator")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AreaCalculator, { config, onGameEnd });
  if (config.gameId === "angle-master")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AngleMaster, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ShapeArchitect, { config, onGameEnd });
}
export {
  GeometryBuilder as default
};
