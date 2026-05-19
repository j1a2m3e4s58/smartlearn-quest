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

// ─────────────────────────────────────────────
// GAME 1 — Memory Matrix
// ─────────────────────────────────────────────
type Phase = "idle" | "show" | "input" | "feedback" | "over";

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
  "8",
];

const DIFF_CFG = {
  1: { startLen: 3, maxLen: 7, showMs: 600, gridSize: 4 },
  2: { startLen: 4, maxLen: 10, showMs: 500, gridSize: 4 },
  3: { startLen: 5, maxLen: 13, showMs: 400, gridSize: 5 },
};

function MemoryMatrix({ config, onGameEnd }: Props) {
  const dc = DIFF_CFG[config.difficulty];
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [seqLen, setSeqLen] = useState(dc.startLen);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(Date.now());
  const roundsRef = useRef(round);
  scoreRef.current = score;
  livesRef.current = lives;
  phaseRef.current = phase;
  roundsRef.current = round;

  const gridSize = dc.gridSize;
  const totalCells = gridSize * gridSize;
  const cellSymbols = SYMBOLS.slice(0, totalCells);

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = Math.min(
        100,
        ((roundsRef.current - 1) / Math.max(1, roundsRef.current)) * 100,
      );
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function generateSequence(len: number): number[] {
    const seq: number[] = [];
    for (let i = 0; i < len; i++)
      seq.push(Math.floor(Math.random() * totalCells));
    return seq;
  }

  async function playSequence(seq: number[]) {
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

  function handleCellClick(idx: number) {
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

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="memory_training.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#a855f7] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#a855f7" }}
          >
            Memory Matrix
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Watch the cells light up in sequence, then click them back in the
            exact same order. Sequences grow longer each round.
          </p>
          <p className="text-xs text-muted-foreground">
            Starting length: {dc.startLen} | Grid: {gridSize}x{gridSize}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            style={{ background: "#a855f7", color: "white" }}
            data-ocid="memory_training.start_button"
          >
            Begin Training
          </button>
        </motion.div>
      )}
      {phase !== "idle" && (
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-mono" style={{ color: "#a855f7" }}>
              Round {round}
            </span>
            <span className="font-mono text-[#f59e0b]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              Seq: {seqLen} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {phase === "show" && "Memorize the sequence..."}
            {phase === "input" &&
              `Click cells in order — ${playerInput.length}/${sequence.length}`}
            {phase === "feedback" &&
              (feedback === "correct"
                ? "Correct! Next sequence loading..."
                : "Wrong! Watch carefully next time.")}
          </div>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            data-ocid="memory_training.grid"
          >
            {cellSymbols.map((sym, idx) => {
              const isLit = highlighted === idx;
              const posInInput = playerInput.indexOf(idx);
              const isCorrectInput =
                posInInput !== -1 && sequence[posInInput] === idx;
              return (
                <motion.button
                  key={`cell-${idx}`}
                  type="button"
                  animate={isLit ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => handleCellClick(idx)}
                  disabled={phase !== "input"}
                  className={`w-14 h-14 rounded-lg border-2 font-bold text-sm transition-all ${
                    isLit
                      ? "border-[#a855f7] bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                      : isCorrectInput
                        ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                        : phase === "input"
                          ? "border-border/50 bg-card hover:border-[#a855f7] hover:bg-[#a855f7]/10 cursor-pointer"
                          : "border-border/30 bg-card/50 cursor-not-allowed"
                  }`}
                  data-ocid={`memory_training.cell.${idx}`}
                >
                  {sym}
                </motion.button>
              );
            })}
          </div>
          {phase === "input" && (
            <div className="flex gap-1 mt-2">
              {sequence.map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className={`w-3 h-3 rounded-full transition-all ${i < playerInput.length ? "bg-[#a855f7]" : "bg-muted"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 2 — Sequence Recall
// ─────────────────────────────────────────────
const SEQ_ITEMS = [
  { id: "R", label: "Red", color: "#ef4444" },
  { id: "B", label: "Blue", color: "#3b82f6" },
  { id: "G", label: "Green", color: "#22c55e" },
  { id: "Y", label: "Yellow", color: "#eab308" },
  { id: "P", label: "Purple", color: "#a855f7" },
  { id: "O", label: "Orange", color: "#f97316" },
];

const SR_DIFF = {
  1: { startLen: 3, maxLen: 8, showMs: 700 },
  2: { startLen: 4, maxLen: 11, showMs: 500 },
  3: { startLen: 5, maxLen: 14, showMs: 350 },
};

function SequenceRecall({ config, onGameEnd }: Props) {
  const dc = SR_DIFF[config.difficulty];
  const [phase, setPhase] = useState<
    "idle" | "show" | "input" | "feedback" | "over"
  >("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [seqLen, setSeqLen] = useState(dc.startLen);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const roundsRef = useRef(round);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  livesRef.current = lives;
  roundsRef.current = round;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = Math.min(
        100,
        ((roundsRef.current - 1) / Math.max(1, roundsRef.current)) * 100,
      );
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function genSeq(len: number): string[] {
    return Array.from(
      { length: len },
      () => SEQ_ITEMS[Math.floor(Math.random() * SEQ_ITEMS.length)].id,
    );
  }

  async function playSeq(seq: string[]) {
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

  function handleItemClick(itemId: string) {
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

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="sequence_recall.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#3b82f6] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#3b82f6]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Sequence Recall
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Watch colored panels flash in sequence. Reproduce the exact order by
            clicking the panels. Each correct round adds one more step.
          </p>
          <p className="text-xs text-muted-foreground">
            Starting length: {dc.startLen} | Lives: {config.livesCount}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#3b82f6" }}
            data-ocid="sequence_recall.start_button"
          >
            Begin Sequence
          </button>
        </motion.div>
      )}
      {phase !== "idle" && (
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-mono text-[#3b82f6]">Round {round}</span>
            <span className="font-mono text-[#f59e0b]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              Len: {seqLen} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {phase === "show" && "Watch carefully..."}
            {phase === "input" &&
              `Reproduce the sequence — ${playerInput.length}/${sequence.length}`}
            {phase === "feedback" &&
              (feedback === "correct"
                ? "Correct! Loading next..."
                : "Wrong order!")}
          </div>
          <div
            className="grid grid-cols-3 gap-3"
            data-ocid="sequence_recall.panel_grid"
          >
            {SEQ_ITEMS.map((item, idx) => {
              const isFlash = flashIdx === idx;
              const btnClickable = phase === "input";
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  animate={
                    isFlash
                      ? { scale: 1.18, opacity: 1 }
                      : { scale: 1, opacity: btnClickable ? 1 : 0.5 }
                  }
                  transition={{ duration: 0.08 }}
                  onClick={() => handleItemClick(item.id)}
                  disabled={!btnClickable}
                  className="w-20 h-20 rounded-xl border-2 font-bold text-sm transition-all disabled:cursor-not-allowed"
                  style={{
                    borderColor: item.color,
                    background: isFlash ? item.color : `${item.color}20`,
                    color: isFlash ? "white" : item.color,
                    boxShadow: isFlash ? `0 0 24px ${item.color}` : "none",
                  }}
                  data-ocid={`sequence_recall.panel.${idx}`}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </div>
          {phase === "input" && (
            <div className="flex gap-1">
              {sequence.map((sid, i) => {
                const item = SEQ_ITEMS.find((x) => x.id === sid);
                return (
                  <div
                    key={`dot-${i}`}
                    className="w-3 h-3 rounded-full transition-all"
                    style={{
                      background:
                        i < playerInput.length
                          ? (item?.color ?? "#fff")
                          : "#334155",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 3 — Word Memory
// ─────────────────────────────────────────────
const WORD_POOLS: Record<1 | 2 | 3, string[]> = {
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
    "zebra",
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
    "zenith",
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
    "zygote",
  ],
};

const WM_TARGET_COUNT = { 1: 10, 2: 15, 3: 20 };
const WM_SHOW_SECONDS = { 1: 25, 2: 20, 3: 15 };

type WMPhase = "idle" | "study" | "recall" | "result" | "over";

function WordMemory({ config, onGameEnd }: Props) {
  const pool = WORD_POOLS[config.difficulty];
  const targetCount = WM_TARGET_COUNT[config.difficulty];
  const showSeconds = WM_SHOW_SECONDS[config.difficulty];

  const [phase, setPhase] = useState<WMPhase>("idle");
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [recallPool, setRecallPool] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(showSeconds);
  const [score, setScore] = useState(0);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const hits = selected.filter((w) => targetWords.includes(w)).length;
      const fp = selected.filter((w) => !targetWords.includes(w)).length;
      const acc =
        targetCount > 0 ? Math.max(0, ((hits - fp) / targetCount) * 100) : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, selected, targetWords, targetCount],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  // countdown during study phase
  useEffect(() => {
    if (phase !== "study") return;
    if (countdown <= 0) {
      setPhase("recall");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  function startGame() {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, targetCount);
    const distractors = shuffled.slice(
      targetCount,
      targetCount + Math.floor(targetCount * 0.6),
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

  function toggleWord(w: string) {
    setSelected((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w],
    );
  }

  function submitRecall() {
    const hits = selected.filter((w) => targetWords.includes(w)).length;
    const fp = selected.filter((w) => !targetWords.includes(w)).length;
    const pts = Math.max(0, (hits * 100 - fp * 50) * config.difficulty);
    setScore(pts);
    setPhase("result");
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const hits = selected.filter((w) => targetWords.includes(w)).length;
  const fp = selected.filter((w) => !targetWords.includes(w)).length;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="word_memory.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#22c55e] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#22c55e]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Word Memory
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Study a list of {targetCount} words for {showSeconds} seconds. Then
            identify every word you remember from a larger mixed pool.
          </p>
          <p className="text-xs text-muted-foreground">
            Correct recalls: +100pts | False recalls: -50pts
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#22c55e" }}
            data-ocid="word_memory.start_button"
          >
            Study Words
          </button>
        </motion.div>
      )}
      {phase === "study" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#22c55e] font-bold">STUDY PHASE</span>
            <span className="text-[#f59e0b] font-mono text-lg">
              {countdown}s remaining
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Memorize all {targetCount} words below.
          </p>
          <div
            className="flex flex-wrap gap-2"
            data-ocid="word_memory.study_list"
          >
            {targetWords.map((w) => (
              <span
                key={w}
                className="px-3 py-1.5 rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e] text-sm font-mono font-bold"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
      {phase === "recall" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#22c55e] font-bold">
              RECALL — Select words you saw
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {selected.length} | Correct so far would be {hits} hits,{" "}
            {fp} false
          </p>
          <div
            className="flex flex-wrap gap-2 overflow-auto"
            data-ocid="word_memory.recall_pool"
          >
            {recallPool.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => toggleWord(w)}
                className={`px-3 py-1.5 rounded-lg border-2 text-sm font-mono font-bold transition-all ${
                  selected.includes(w)
                    ? "border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]"
                    : "border-border/30 bg-card/50 hover:border-[#22c55e]/40"
                }`}
                data-ocid={`word_memory.word.${w}`}
              >
                {w}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={submitRecall}
            className="self-center px-8 py-2 rounded-lg font-bold text-white"
            style={{ background: "#22c55e" }}
            data-ocid="word_memory.submit_button"
          >
            Submit Recall
          </button>
        </div>
      )}
      {phase === "result" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <h3 className="text-2xl font-black text-[#22c55e]">Results</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl border border-[#22c55e]/30 bg-card/40 p-4">
              <div className="text-2xl font-black text-[#22c55e]">{hits}</div>
              <div className="text-xs text-muted-foreground">
                Correct Recalls
              </div>
            </div>
            <div className="rounded-xl border border-[#f43f5e]/30 bg-card/40 p-4">
              <div className="text-2xl font-black text-[#f43f5e]">{fp}</div>
              <div className="text-xs text-muted-foreground">False Recalls</div>
            </div>
            <div className="rounded-xl border border-[#f59e0b]/30 bg-card/40 p-4">
              <div className="text-2xl font-black text-[#f59e0b]">
                {score.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Target words: {targetWords.join(", ")}
          </p>
          <button
            type="button"
            onClick={() => endGame(true)}
            className="px-8 py-3 rounded-lg font-bold text-white"
            style={{ background: "#22c55e" }}
            data-ocid="word_memory.finish_button"
          >
            Finish
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export default function MemoryTraining({ config, onGameEnd }: Props) {
  if (config.gameId === "sequence-recall")
    return <SequenceRecall config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "word-memory")
    return <WordMemory config={config} onGameEnd={onGameEnd} />;
  return <MemoryMatrix config={config} onGameEnd={onGameEnd} />;
}
