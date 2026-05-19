import { j as jsxRuntimeExports, r as reactExports, m as motion } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const SYMBOLS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8"
];
const DIFF_CFG = {
  1: { startLen: 3, maxLen: 7, showMs: 600, gridSize: 4 },
  2: { startLen: 4, maxLen: 10, showMs: 500, gridSize: 4 },
  3: { startLen: 5, maxLen: 13, showMs: 400, gridSize: 5 }
};
function MemoryMatrix({ config, onGameEnd }) {
  const dc = DIFF_CFG[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [sequence, setSequence] = reactExports.useState([]);
  const [highlighted, setHighlighted] = reactExports.useState(null);
  const [playerInput, setPlayerInput] = reactExports.useState([]);
  const [seqLen, setSeqLen] = reactExports.useState(dc.startLen);
  const [round, setRound] = reactExports.useState(1);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [feedback, setFeedback] = reactExports.useState(null);
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  const phaseRef = reactExports.useRef(phase);
  const startTimeRef = reactExports.useRef(Date.now());
  const roundsRef = reactExports.useRef(round);
  scoreRef.current = score;
  livesRef.current = lives;
  phaseRef.current = phase;
  roundsRef.current = round;
  const gridSize = dc.gridSize;
  const totalCells = gridSize * gridSize;
  const cellSymbols = SYMBOLS.slice(0, totalCells);
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = Math.min(
        100,
        (roundsRef.current - 1) / Math.max(1, roundsRef.current) * 100
      );
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function generateSequence(len) {
    const seq = [];
    for (let i = 0; i < len; i++)
      seq.push(Math.floor(Math.random() * totalCells));
    return seq;
  }
  async function playSequence(seq) {
    setPhase("show");
    await new Promise((r) => setTimeout(r, 400));
    for (let i = 0; i < seq.length; i++) {
      setHighlighted(seq[i]);
      await new Promise((r) => setTimeout(r, dc.showMs));
      setHighlighted(null);
      await new Promise((r) => setTimeout(r, 150));
    }
    setPhase("input");
    setPlayerInput([]);
  }
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    const seq = generateSequence(dc.startLen);
    setSequence(seq);
    playSequence(seq);
  }
  function handleCellClick(idx) {
    if (phase !== "input") return;
    const newInput = [...playerInput, idx];
    setPlayerInput(newInput);
    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      setFeedback("wrong");
      setPhase("feedback");
      const newLives = livesRef.current - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => endGame(false), 1200);
        return;
      }
      setTimeout(() => {
        setFeedback(null);
        setRound((r) => r + 1);
        const seq = generateSequence(seqLen);
        setSequence(seq);
        playSequence(seq);
      }, 1200);
      return;
    }
    if (newInput.length === sequence.length) {
      const pts = seqLen * 100 * config.difficulty;
      setScore((s) => s + pts);
      setFeedback("correct");
      setPhase("feedback");
      const nextLen = Math.min(seqLen + 1, dc.maxLen);
      setSeqLen(nextLen);
      setTimeout(() => {
        setFeedback(null);
        setRound((r) => r + 1);
        const seq = generateSequence(nextLen);
        setSequence(seq);
        playSequence(seq);
      }, 800);
    }
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "memory_training.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#a855f7] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
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
                  className: "text-3xl font-black",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#a855f7" },
                  children: "Memory Matrix"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Watch the cells light up in sequence, then click them back in the exact same order. Sequences grow longer each round." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Starting length: ",
                dc.startLen,
                " | Grid: ",
                gridSize,
                "x",
                gridSize
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#a855f7", color: "white" },
                  "data-ocid": "memory_training.start_button",
                  children: "Begin Training"
                }
              )
            ]
          }
        ),
        phase !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", style: { color: "#a855f7" }, children: [
              "Round ",
              round
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#f59e0b]", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Seq: ",
              seqLen,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            phase === "show" && "Memorize the sequence...",
            phase === "input" && `Click cells in order — ${playerInput.length}/${sequence.length}`,
            phase === "feedback" && (feedback === "correct" ? "Correct! Next sequence loading..." : "Wrong! Watch carefully next time.")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-2",
              style: { gridTemplateColumns: `repeat(${gridSize}, 1fr)` },
              "data-ocid": "memory_training.grid",
              children: cellSymbols.map((sym, idx) => {
                const isLit = highlighted === idx;
                const posInInput = playerInput.indexOf(idx);
                const isCorrectInput = posInInput !== -1 && sequence[posInInput] === idx;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    animate: isLit ? { scale: 1.15 } : { scale: 1 },
                    transition: { duration: 0.1 },
                    onClick: () => handleCellClick(idx),
                    disabled: phase !== "input",
                    className: `w-14 h-14 rounded-lg border-2 font-bold text-sm transition-all ${isLit ? "border-[#a855f7] bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.8)]" : isCorrectInput ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : phase === "input" ? "border-border/50 bg-card hover:border-[#a855f7] hover:bg-[#a855f7]/10 cursor-pointer" : "border-border/30 bg-card/50 cursor-not-allowed"}`,
                    "data-ocid": `memory_training.cell.${idx}`,
                    children: sym
                  },
                  `cell-${idx}`
                );
              })
            }
          ),
          phase === "input" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-2", children: sequence.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-3 h-3 rounded-full transition-all ${i < playerInput.length ? "bg-[#a855f7]" : "bg-muted"}`
            },
            `dot-${i}`
          )) })
        ] })
      ]
    }
  );
}
const SEQ_ITEMS = [
  { id: "R", label: "Red", color: "#ef4444" },
  { id: "B", label: "Blue", color: "#3b82f6" },
  { id: "G", label: "Green", color: "#22c55e" },
  { id: "Y", label: "Yellow", color: "#eab308" },
  { id: "P", label: "Purple", color: "#a855f7" },
  { id: "O", label: "Orange", color: "#f97316" }
];
const SR_DIFF = {
  1: { startLen: 3, maxLen: 8, showMs: 700 },
  2: { startLen: 4, maxLen: 11, showMs: 500 },
  3: { startLen: 5, maxLen: 14, showMs: 350 }
};
function SequenceRecall({ config, onGameEnd }) {
  const dc = SR_DIFF[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [sequence, setSequence] = reactExports.useState([]);
  const [flashIdx, setFlashIdx] = reactExports.useState(null);
  const [playerInput, setPlayerInput] = reactExports.useState([]);
  const [seqLen, setSeqLen] = reactExports.useState(dc.startLen);
  const [round, setRound] = reactExports.useState(1);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [feedback, setFeedback] = reactExports.useState(null);
  const phaseRef = reactExports.useRef(phase);
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  const roundsRef = reactExports.useRef(round);
  const startTimeRef = reactExports.useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  livesRef.current = lives;
  roundsRef.current = round;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = Math.min(
        100,
        (roundsRef.current - 1) / Math.max(1, roundsRef.current) * 100
      );
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function genSeq(len) {
    return Array.from(
      { length: len },
      () => SEQ_ITEMS[Math.floor(Math.random() * SEQ_ITEMS.length)].id
    );
  }
  async function playSeq(seq) {
    setPhase("show");
    setFlashIdx(null);
    await new Promise((r) => setTimeout(r, 500));
    for (let i = 0; i < seq.length; i++) {
      const itemIdx = SEQ_ITEMS.findIndex((x) => x.id === seq[i]);
      setFlashIdx(itemIdx);
      await new Promise((r) => setTimeout(r, dc.showMs));
      setFlashIdx(null);
      await new Promise((r) => setTimeout(r, 180));
    }
    setPhase("input");
    setPlayerInput([]);
  }
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    const seq = genSeq(dc.startLen);
    setSequence(seq);
    playSeq(seq);
  }
  function handleItemClick(itemId) {
    if (phase !== "input") return;
    const newInput = [...playerInput, itemId];
    setPlayerInput(newInput);
    const pos = newInput.length - 1;
    if (newInput[pos] !== sequence[pos]) {
      setFeedback("wrong");
      setPhase("feedback");
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1200);
        return;
      }
      setTimeout(() => {
        setFeedback(null);
        setRound((r) => r + 1);
        const seq = genSeq(seqLen);
        setSequence(seq);
        playSeq(seq);
      }, 1200);
      return;
    }
    if (newInput.length === sequence.length) {
      const pts = seqLen * 120 * config.difficulty;
      setScore((s) => s + pts);
      setFeedback("correct");
      setPhase("feedback");
      const nextLen = Math.min(seqLen + 1, dc.maxLen);
      setSeqLen(nextLen);
      setTimeout(() => {
        setFeedback(null);
        setRound((r) => r + 1);
        const seq = genSeq(nextLen);
        setSequence(seq);
        playSeq(seq);
      }, 800);
    }
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "sequence_recall.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#3b82f6] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
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
                  className: "text-3xl font-black text-[#3b82f6]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Sequence Recall"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Watch colored panels flash in sequence. Reproduce the exact order by clicking the panels. Each correct round adds one more step." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Starting length: ",
                dc.startLen,
                " | Lives: ",
                config.livesCount
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#3b82f6" },
                  "data-ocid": "sequence_recall.start_button",
                  children: "Begin Sequence"
                }
              )
            ]
          }
        ),
        phase !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#3b82f6]", children: [
              "Round ",
              round
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[#f59e0b]", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Len: ",
              seqLen,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            phase === "show" && "Watch carefully...",
            phase === "input" && `Reproduce the sequence — ${playerInput.length}/${sequence.length}`,
            phase === "feedback" && (feedback === "correct" ? "Correct! Loading next..." : "Wrong order!")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-3 gap-3",
              "data-ocid": "sequence_recall.panel_grid",
              children: SEQ_ITEMS.map((item, idx) => {
                const isFlash = flashIdx === idx;
                const btnClickable = phase === "input";
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    animate: isFlash ? { scale: 1.18, opacity: 1 } : { scale: 1, opacity: btnClickable ? 1 : 0.5 },
                    transition: { duration: 0.08 },
                    onClick: () => handleItemClick(item.id),
                    disabled: !btnClickable,
                    className: "w-20 h-20 rounded-xl border-2 font-bold text-sm transition-all disabled:cursor-not-allowed",
                    style: {
                      borderColor: item.color,
                      background: isFlash ? item.color : `${item.color}20`,
                      color: isFlash ? "white" : item.color,
                      boxShadow: isFlash ? `0 0 24px ${item.color}` : "none"
                    },
                    "data-ocid": `sequence_recall.panel.${idx}`,
                    children: item.label
                  },
                  item.id
                );
              })
            }
          ),
          phase === "input" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: sequence.map((sid, i) => {
            const item = SEQ_ITEMS.find((x) => x.id === sid);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-3 h-3 rounded-full transition-all",
                style: {
                  background: i < playerInput.length ? (item == null ? void 0 : item.color) ?? "#fff" : "#334155"
                }
              },
              `dot-${i}`
            );
          }) })
        ] })
      ]
    }
  );
}
const WORD_POOLS = {
  1: [
    "apple",
    "bridge",
    "candle",
    "dragon",
    "engine",
    "forest",
    "guitar",
    "harbor",
    "island",
    "jungle",
    "kitten",
    "lemon",
    "marble",
    "napkin",
    "orange",
    "pencil",
    "quartz",
    "rocket",
    "sunset",
    "tunnel",
    "umbrella",
    "valley",
    "window",
    "yellow",
    "zebra"
  ],
  2: [
    "algorithm",
    "blueprint",
    "catalyst",
    "dimension",
    "electrode",
    "frequency",
    "gravity",
    "hemisphere",
    "inference",
    "junction",
    "kinetic",
    "latitude",
    "magnitude",
    "nitrogen",
    "oxidation",
    "pressure",
    "quantum",
    "resonance",
    "spectrum",
    "thermal",
    "ultraviolet",
    "velocity",
    "wavelength",
    "xenon",
    "zenith"
  ],
  3: [
    "abstraction",
    "bifurcation",
    "circumference",
    "dissipation",
    "eigenvalue",
    "fluorescence",
    "geospatial",
    "hysteresis",
    "interpolation",
    "juxtaposition",
    "kinematics",
    "luminescence",
    "metamorphosis",
    "nanotechnology",
    "oscillation",
    "perpendicular",
    "quantization",
    "refraction",
    "stochastic",
    "thermodynamics",
    "ubiquitous",
    "viscosity",
    "wavefunction",
    "xenolith",
    "zygote"
  ]
};
const WM_TARGET_COUNT = { 1: 10, 2: 15, 3: 20 };
const WM_SHOW_SECONDS = { 1: 25, 2: 20, 3: 15 };
function WordMemory({ config, onGameEnd }) {
  const pool = WORD_POOLS[config.difficulty];
  const targetCount = WM_TARGET_COUNT[config.difficulty];
  const showSeconds = WM_SHOW_SECONDS[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [targetWords, setTargetWords] = reactExports.useState([]);
  const [recallPool, setRecallPool] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState([]);
  const [countdown, setCountdown] = reactExports.useState(showSeconds);
  const [score, setScore] = reactExports.useState(0);
  const phaseRef = reactExports.useRef(phase);
  const scoreRef = reactExports.useRef(score);
  const startTimeRef = reactExports.useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const hits2 = selected.filter((w) => targetWords.includes(w)).length;
      const fp2 = selected.filter((w) => !targetWords.includes(w)).length;
      const acc = targetCount > 0 ? Math.max(0, (hits2 - fp2) / targetCount * 100) : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, selected, targetWords, targetCount]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  reactExports.useEffect(() => {
    if (phase !== "study") return;
    if (countdown <= 0) {
      setPhase("recall");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1e3);
    return () => clearTimeout(t);
  }, [phase, countdown]);
  function startGame() {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, targetCount);
    const distractors = shuffled.slice(
      targetCount,
      targetCount + Math.floor(targetCount * 0.6)
    );
    const mixed = [...targets, ...distractors].sort(() => Math.random() - 0.5);
    setTargetWords(targets);
    setRecallPool(mixed);
    setSelected([]);
    setCountdown(showSeconds);
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("study");
  }
  function toggleWord(w) {
    setSelected(
      (prev) => prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  }
  function submitRecall() {
    const hits2 = selected.filter((w) => targetWords.includes(w)).length;
    const fp2 = selected.filter((w) => !targetWords.includes(w)).length;
    const pts = Math.max(0, (hits2 * 100 - fp2 * 50) * config.difficulty);
    setScore(pts);
    setPhase("result");
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const hits = selected.filter((w) => targetWords.includes(w)).length;
  const fp = selected.filter((w) => !targetWords.includes(w)).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "word_memory.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#22c55e] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
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
                  className: "text-3xl font-black text-[#22c55e]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Word Memory"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: [
                "Study a list of ",
                targetCount,
                " words for ",
                showSeconds,
                " seconds. Then identify every word you remember from a larger mixed pool."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Correct recalls: +100pts | False recalls: -50pts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#22c55e" },
                  "data-ocid": "word_memory.start_button",
                  children: "Study Words"
                }
              )
            ]
          }
        ),
        phase === "study" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#22c55e] font-bold", children: "STUDY PHASE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-mono text-lg", children: [
              countdown,
              "s remaining"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Memorize all ",
            targetCount,
            " words below."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-wrap gap-2",
              "data-ocid": "word_memory.study_list",
              children: targetWords.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-3 py-1.5 rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e] text-sm font-mono font-bold",
                  children: w
                },
                w
              ))
            }
          )
        ] }),
        phase === "recall" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#22c55e] font-bold", children: "RECALL — Select words you saw" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Selected: ",
            selected.length,
            " | Correct so far would be ",
            hits,
            " hits,",
            " ",
            fp,
            " false"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-wrap gap-2 overflow-auto",
              "data-ocid": "word_memory.recall_pool",
              children: recallPool.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleWord(w),
                  className: `px-3 py-1.5 rounded-lg border-2 text-sm font-mono font-bold transition-all ${selected.includes(w) ? "border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]" : "border-border/30 bg-card/50 hover:border-[#22c55e]/40"}`,
                  "data-ocid": `word_memory.word.${w}`,
                  children: w
                },
                w
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: submitRecall,
              className: "self-center px-8 py-2 rounded-lg font-bold text-white",
              style: { background: "#22c55e" },
              "data-ocid": "word_memory.submit_button",
              children: "Submit Recall"
            }
          )
        ] }),
        phase === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-[#22c55e]", children: "Results" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#22c55e]/30 bg-card/40 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-[#22c55e]", children: hits }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Correct Recalls" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f43f5e]/30 bg-card/40 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-[#f43f5e]", children: fp }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "False Recalls" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-card/40 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-[#f59e0b]", children: score.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Score" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Target words: ",
                targetWords.join(", ")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => endGame(true),
                  className: "px-8 py-3 rounded-lg font-bold text-white",
                  style: { background: "#22c55e" },
                  "data-ocid": "word_memory.finish_button",
                  children: "Finish"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function MemoryTraining({ config, onGameEnd }) {
  if (config.gameId === "sequence-recall")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceRecall, { config, onGameEnd });
  if (config.gameId === "word-memory")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(WordMemory, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryMatrix, { config, onGameEnd });
}
export {
  MemoryTraining as default
};
