import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─────────────────────────────────────────────────────────
// PIXEL DESIGN STUDIO — 16×16 grid pixel art matching
// ─────────────────────────────────────────────────────────

const PIXEL_PALETTE = [
  "transparent",
  "#f43f5e",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#7c3aed",
  "#e5e7eb",
  "#1e293b",
];

type P16 = number[][];

function make16(rows: number[][]): P16 {
  return Array.from({ length: 16 }, (_, r) =>
    Array.from({ length: 16 }, (_, c) => rows[r]?.[c] ?? 0),
  );
}

const PIXEL_REFS: { name: string; desc: string; grid: P16 }[] = [
  {
    name: "House",
    desc: "A simple house shape: triangular roof over a rectangle with a door.",
    grid: make16([
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0, 0],
      [0, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0, 0],
    ]),
  },
  {
    name: "Star",
    desc: "A 5-pointed star pattern.",
    grid: make16([
      [0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
      [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
      [0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0],
      [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
      [0, 4, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 0],
      [4, 4, 4, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 4],
      [4, 4, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 4, 4],
      [4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]),
  },
  {
    name: "Arrow",
    desc: "A right-pointing arrow.",
    grid: make16([
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    ]),
  },
  {
    name: "Letter A",
    desc: "Block letter A in pixel art.",
    grid: make16([
      [0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 5, 5, 5, 0, 0, 5, 5, 5, 0, 0, 0, 0],
      [0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]),
  },
  {
    name: "Flag",
    desc: "A simple waving flag on a pole.",
    grid: make16([
      [0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0],
      [0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0],
      [0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0],
      [0, 0, 6, 1, 1, 1, 3, 3, 1, 1, 1, 6, 0, 0, 0, 0],
      [0, 0, 6, 1, 1, 3, 3, 3, 3, 1, 1, 6, 0, 0, 0, 0],
      [0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]),
  },
];

function PixelDesignStudio({ config, onGameEnd }: Props) {
  const [refIdx, setRefIdx] = useState(0);
  const [userGrid, setUserGrid] = useState<number[][]>(() =>
    Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => 0)),
  );
  const [selectedColor, setSelectedColor] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<number[][][]>([]);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const ref = PIXEL_REFS[refIdx];

  const endGame = useCallback(
    (completed: boolean, finalScore = scoreRef.current) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          finalScore,
          accuracy,
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, accuracy],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function calcAccuracy(grid: number[][]): number {
    let match = 0;
    for (let r = 0; r < 16; r++)
      for (let c = 0; c < 16; c++)
        if (grid[r][c] > 0 === ref.grid[r][c] > 0) match++;
    return Math.round((match / 256) * 100);
  }

  function paint(r: number, c: number) {
    if (!started || gameOverRef.current) return;
    setUserGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = selectedColor === 0 ? 0 : selectedColor;
      const acc = calcAccuracy(next);
      setAccuracy(acc);
      return next;
    });
  }

  function handleUndo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setUserGrid(prev);
    setHistory((h) => h.slice(0, -1));
    setAccuracy(calcAccuracy(prev));
  }

  function handleMouseDown(r: number, c: number) {
    setHistory((h) => [...h.slice(-19), userGrid.map((row) => [...row])]);
    setDrawing(true);
    paint(r, c);
  }

  function handleSubmit() {
    const acc = calcAccuracy(userGrid);
    const timeBonus = Math.floor((timeLeft / config.timeLimit) * 200);
    const pts = Math.floor(acc * 3) + timeBonus;
    const newScore = score + pts;
    setScore(newScore);
    scoreRef.current = newScore;
    setAccuracy(acc);
    setSubmitted(true);
    setTimeout(() => {
      if (refIdx + 1 >= PIXEL_REFS.length) {
        endGame(true, newScore);
      } else {
        setRefIdx(refIdx + 1);
        setUserGrid(
          Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => 0)),
        );
        setSubmitted(false);
        setAccuracy(0);
        setHistory([]);
      }
    }, 1800);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const cellSize = 14;

  return (
    <div
      className="w-full h-full flex flex-col gap-2"
      data-ocid="pixel_studio.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 gap-3">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        <span className="text-xs text-muted-foreground">
          Match: <span className="text-[#10b981] font-bold">{accuracy}%</span>
        </span>
        <span className="text-xs text-muted-foreground">
          Ref {refIdx + 1}/{PIXEL_REFS.length}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#00f5ff] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 tabular-nums">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8 text-center"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Pixel Design Studio
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Recreate the reference pattern by clicking and dragging on the 16x16
            canvas. Match filled vs empty cells.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Higher accuracy earns more points. Speed bonus applies. 5 patterns
            total.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTime.current = Date.now();
              setStarted(true);
              startTimer();
            }}
            data-ocid="pixel_studio.start_button"
          >
            Open Studio
          </GlowButton>
        </motion.div>
      ) : (
        <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
          <div className="flex flex-col gap-2 shrink-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">
              Reference: {ref.name}
            </p>
            <p className="text-xs text-muted-foreground text-center max-w-[120px]">
              {ref.desc}
            </p>
            <div className="glass-card rounded-xl p-1.5 border border-border/40">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(16, ${cellSize - 2}px)`,
                  gap: "1px",
                }}
              >
                {ref.grid.map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`ref-${r}-${c}`}
                      style={{
                        width: cellSize - 2,
                        height: cellSize - 2,
                        background:
                          v > 0
                            ? PIXEL_PALETTE[v % PIXEL_PALETTE.length]
                            : "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    />
                  )),
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider text-center mt-2">
              Colors
            </p>
            <div className="grid grid-cols-4 gap-1">
              {PIXEL_PALETTE.slice(1).map((col, i) => (
                <button
                  key={`col-${i}`}
                  type="button"
                  onClick={() => setSelectedColor(i + 1)}
                  className="w-7 h-7 rounded border-2 transition-all"
                  style={{
                    background: col,
                    borderColor:
                      selectedColor === i + 1
                        ? "#fff"
                        : "rgba(255,255,255,0.15)",
                  }}
                  data-ocid={`pixel_studio.color.${i + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => setSelectedColor(0)}
                className="w-7 h-7 rounded border-2 transition-all flex items-center justify-center text-xs text-muted-foreground"
                style={{
                  borderColor:
                    selectedColor === 0 ? "#fff" : "rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.04)",
                }}
                data-ocid="pixel_studio.eraser"
              >
                E
              </button>
            </div>
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={handleUndo}
              data-ocid="pixel_studio.undo_button"
              className="mt-1"
            >
              Undo
            </GlowButton>
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              data-ocid="pixel_studio.submit_button"
              className="mt-1"
            >
              Submit
            </GlowButton>
            {submitted && (
              <div
                className="text-center text-sm font-bold mt-1"
                style={{
                  color:
                    accuracy >= 80
                      ? "#10b981"
                      : accuracy >= 60
                        ? "#f59e0b"
                        : "#f43f5e",
                }}
              >
                {accuracy}% match!
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <p className="text-xs text-muted-foreground uppercase tracking-wider text-center mb-1">
              Your Canvas
            </p>
            <div
              className="glass-card rounded-xl p-1.5 border border-border/40 overflow-auto"
              onMouseLeave={() => setDrawing(false)}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(16, ${cellSize}px)`,
                  gap: "1px",
                }}
              >
                {userGrid.map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`cell-${r}-${c}`}
                      onMouseDown={() => handleMouseDown(r, c)}
                      onMouseEnter={() => {
                        if (drawing) paint(r, c);
                      }}
                      onMouseUp={() => setDrawing(false)}
                      data-ocid="pixel_studio.canvas_target"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        background:
                          v > 0
                            ? PIXEL_PALETTE[v % PIXEL_PALETTE.length]
                            : "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        cursor: "crosshair",
                      }}
                    />
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// COLOR THEORY — RGB mixing + color theory quiz
// ─────────────────────────────────────────────────────────

interface ColorChallenge {
  type: "mixer" | "quiz";
  targetR?: number;
  targetG?: number;
  targetB?: number;
  question?: string;
  options?: string[];
  answer?: string;
  explanation: string;
}

const COLOR_CHALLENGES: ColorChallenge[] = [
  {
    type: "mixer",
    targetR: 220,
    targetG: 60,
    targetB: 60,
    explanation:
      "Warm reds need high R, low G and B. Try R:200-255, G:0-80, B:0-80.",
  },
  {
    type: "mixer",
    targetR: 60,
    targetG: 140,
    targetB: 220,
    explanation:
      "Sky blue: medium-high R, high G and B. Try R:40-80, G:120-160, B:200-255.",
  },
  {
    type: "mixer",
    targetR: 240,
    targetG: 200,
    targetB: 40,
    explanation:
      "Yellow = high R + high G, very low B. Try R:220-255, G:180-220, B:0-60.",
  },
  {
    type: "mixer",
    targetR: 120,
    targetG: 60,
    targetB: 200,
    explanation:
      "Purple = medium-high R, low G, high B. Try R:100-140, G:40-80, B:180-220.",
  },
  {
    type: "mixer",
    targetR: 40,
    targetG: 180,
    targetB: 100,
    explanation:
      "Green: low R, high G, medium B. Try R:0-60, G:160-200, B:80-120.",
  },
  {
    type: "mixer",
    targetR: 200,
    targetG: 120,
    targetB: 40,
    explanation:
      "Orange: high R, medium G, low B. Try R:180-220, G:100-140, B:0-60.",
  },
  {
    type: "quiz",
    question:
      "Which color is the complementary (opposite) of RED on the color wheel?",
    options: ["Blue", "Cyan", "Green", "Yellow"],
    answer: "Cyan",
    explanation:
      "Red's complement is Cyan (0,255,255). Complementary colors are opposite on the color wheel and create maximum contrast.",
  },
  {
    type: "quiz",
    question: "Is ORANGE a warm or cool color?",
    options: ["Warm", "Cool", "Neutral", "It depends"],
    answer: "Warm",
    explanation:
      "Orange is a warm color. Warm colors (reds, oranges, yellows) evoke energy and warmth; cool colors (blues, greens) evoke calm.",
  },
  {
    type: "quiz",
    question: "Which is the complementary of BLUE?",
    options: ["Green", "Orange", "Purple", "Red"],
    answer: "Orange",
    explanation:
      "Blue's complement is Orange. They sit opposite on the color wheel and are used together for high-impact designs.",
  },
  {
    type: "quiz",
    question: "Which two colors mix to create PURPLE?",
    options: ["Red + Blue", "Red + Green", "Blue + Yellow", "Green + Red"],
    answer: "Red + Blue",
    explanation:
      "Red and blue mix to create purple. In subtractive (paint) color theory, these are the primary colors for purple.",
  },
  {
    type: "quiz",
    question: "Is VIOLET a warm or cool color?",
    options: ["Warm", "Cool", "Neutral", "Both"],
    answer: "Cool",
    explanation:
      "Violet/purple leans cool. It sits on the cool side of the color wheel, though it has warm red undertones.",
  },
  {
    type: "quiz",
    question: "What is an ANALOGOUS color scheme?",
    options: [
      "Colors opposite on the wheel",
      "Three colors evenly spaced 120 degrees apart",
      "Colors adjacent on the wheel",
      "Only black and white",
    ],
    answer: "Colors adjacent on the wheel",
    explanation:
      "Analogous colors are next to each other on the color wheel (e.g., red, red-orange, orange). They create harmonious, natural designs.",
  },
];

function ColorTheory({ config, onGameEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [r, setR] = useState(128);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);
  const [feedback, setFeedback] = useState<
    "correct" | "close" | "wrong" | null
  >(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const challenge = COLOR_CHALLENGES[idx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = answered > 0 ? (correct / answered) * 100 : 50;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, answered],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function advance(pts: number, isCorrect: boolean) {
    const ns = score + pts;
    setScore(ns);
    scoreRef.current = ns;
    setAnswered((a) => a + 1);
    if (isCorrect) setCorrect((c) => c + 1);
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= COLOR_CHALLENGES.length) endGame(true);
      else {
        setIdx(idx + 1);
        setR(128);
        setG(128);
        setB(128);
      }
    }, 1800);
  }

  function checkMix() {
    const ch = challenge;
    if (!ch.targetR) return;
    const dr = Math.abs(r - ch.targetR);
    const dg = Math.abs(g - (ch.targetG ?? 0));
    const db = Math.abs(b - (ch.targetB ?? 0));
    const maxDiff = Math.max(dr, dg, db);
    if (maxDiff <= 15) {
      setFeedback("correct");
      advance(500 * config.difficulty, true);
    } else if (maxDiff <= 40) {
      setFeedback("close");
      advance(150 * config.difficulty, false);
    } else {
      setFeedback("wrong");
      advance(0, false);
    }
  }

  function handleQuizAnswer(opt: string) {
    if (feedback) return;
    const isCorrect = opt === challenge.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    advance(isCorrect ? 400 * config.difficulty : 0, isCorrect);
  }

  const userColor = `rgb(${r},${g},${b})`;
  const targetColor =
    challenge.type === "mixer"
      ? `rgb(${challenge.targetR},${challenge.targetG},${challenge.targetB})`
      : null;
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="color_theory.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 gap-2">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        <span className="text-xs text-muted-foreground">
          Challenge {idx + 1}/{COLOR_CHALLENGES.length}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${timePct}%`, background: "#7c3aed" }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8 text-center"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Color Theory Lab
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            First 6 challenges: Mix RGB sliders to match a target color within
            tolerance. Last 6: Color theory quiz.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Exact match = 500 pts, close = 150 pts. Quiz = 400 pts per correct
            answer.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTime.current = Date.now();
              setStarted(true);
              startTimer();
            }}
            data-ocid="color_theory.start_button"
          >
            Start Lab
          </GlowButton>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex-1 flex flex-col gap-3"
            >
              {challenge.type === "mixer" ? (
                <div className="glass-card rounded-xl p-4 border border-border/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Match the target color using RGB sliders
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs text-muted-foreground">Target</p>
                      <div
                        className="w-20 h-20 rounded-xl border-2 border-border"
                        style={{ background: targetColor ?? "transparent" }}
                      />
                      <p className="text-xs font-mono text-muted-foreground">
                        R:{challenge.targetR} G:{challenge.targetG} B:
                        {challenge.targetB}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        vs
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs text-muted-foreground">Your mix</p>
                      <div
                        className="w-20 h-20 rounded-xl border-2 border-border transition-colors"
                        style={{ background: userColor }}
                      />
                      <p className="text-xs font-mono text-muted-foreground">
                        R:{r} G:{g} B:{b}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(["R", "G", "B"] as const).map((ch, ci) => {
                      const val = ci === 0 ? r : ci === 1 ? g : b;
                      const setter = ci === 0 ? setR : ci === 1 ? setG : setB;
                      const col =
                        ci === 0 ? "#f43f5e" : ci === 1 ? "#10b981" : "#3b82f6";
                      return (
                        <div key={ch} className="flex items-center gap-3">
                          <span
                            className="text-sm font-bold w-4"
                            style={{ color: col }}
                          >
                            {ch}
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={255}
                            value={val}
                            onChange={(e) => setter(Number(e.target.value))}
                            className="flex-1"
                            style={{ accentColor: col }}
                            data-ocid={`color_theory.slider_${ch.toLowerCase()}`}
                          />
                          <span className="text-xs font-mono tabular-nums w-8 text-right text-muted-foreground">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <GlowButton
                      variant="primary"
                      size="sm"
                      onClick={checkMix}
                      data-ocid="color_theory.check_button"
                    >
                      Check Mix
                    </GlowButton>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{
                          color:
                            feedback === "correct"
                              ? "#10b981"
                              : feedback === "close"
                                ? "#f59e0b"
                                : "#f43f5e",
                        }}
                      >
                        {feedback === "correct" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {feedback === "correct"
                          ? "Perfect match!"
                          : feedback === "close"
                            ? "Close — partial credit"
                            : "Too far off"}
                      </motion.div>
                    )}
                  </div>
                  {feedback && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {challenge.explanation}
                    </p>
                  )}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-4 border border-border/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Color Theory Quiz
                  </p>
                  <p className="text-base font-bold text-foreground mb-4">
                    {challenge.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {challenge.options?.map((opt, i) => {
                      const isAns = feedback && opt === challenge.answer;
                      return (
                        <button
                          key={`opt-${i}`}
                          type="button"
                          disabled={!!feedback}
                          onClick={() => handleQuizAnswer(opt)}
                          className="rounded-xl border p-3 text-sm text-left font-semibold text-foreground transition-all hover:bg-muted"
                          style={{
                            borderColor: isAns
                              ? "#10b981"
                              : "rgba(100,100,120,0.4)",
                            background: isAns
                              ? "rgba(16,185,129,0.1)"
                              : undefined,
                          }}
                          data-ocid={`color_theory.answer.${i + 1}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 flex items-start gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                    >
                      {feedback === "correct" ? (
                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      )}
                      <span>
                        {feedback === "correct" ? "Correct! " : "Incorrect. "}
                        {challenge.explanation}
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DESIGN PRINCIPLES — Side-by-side layout critique
// ─────────────────────────────────────────────────────────

interface DesignPair {
  principle: string;
  description: string;
  optionA: string;
  optionB: string;
  correct: "A" | "B";
  reason: string;
  goodElement: string;
}

const DESIGN_PAIRS: DesignPair[] = [
  {
    principle: "Contrast",
    description:
      "Which layout uses stronger contrast between text and background?",
    optionA: "Light gray text on white background",
    optionB: "Black text on white background with bold headings",
    correct: "B",
    reason:
      "High contrast makes text readable and draws attention to key content.",
    goodElement: "Bold dark text vs light background",
  },
  {
    principle: "Alignment",
    description: "Which layout demonstrates better alignment?",
    optionA: "Text centered, images left, buttons scattered",
    optionB: "All elements left-aligned to a common grid edge",
    correct: "B",
    reason:
      "Consistent alignment creates visual order and makes content scannable.",
    goodElement: "Left-edge grid alignment",
  },
  {
    principle: "Proximity",
    description: "Which layout groups related items better?",
    optionA: "Product name, price, and button spread across the page",
    optionB: "Product name, price, and button grouped in one card",
    correct: "B",
    reason:
      "Proximity signals that items are related, reducing cognitive load.",
    goodElement: "Grouped card container",
  },
  {
    principle: "Repetition",
    description: "Which layout demonstrates visual repetition?",
    optionA: "Five different button styles across the page",
    optionB: "All buttons share the same color, size, and font",
    correct: "B",
    reason:
      "Repeating visual elements creates consistency and a professional look.",
    goodElement: "Consistent button style",
  },
  {
    principle: "Contrast",
    description: "Which heading treatment creates better hierarchy?",
    optionA: "All headings in the same size and weight",
    optionB: "H1 large+bold, H2 medium+semibold, body small+regular",
    correct: "B",
    reason:
      "Size and weight contrast establishes a clear typographic hierarchy.",
    goodElement: "Scaled typographic hierarchy",
  },
  {
    principle: "Alignment",
    description: "Which form layout looks more organized?",
    optionA: "Labels above inputs, randomly spaced",
    optionB: "Labels above inputs, all vertically aligned to 8px grid",
    correct: "B",
    reason: "Grid-aligned forms look professional and are easier to scan.",
    goodElement: "8px grid alignment",
  },
  {
    principle: "Proximity",
    description: "Which navigation is easier to understand?",
    optionA: "Nav links evenly spread across full viewport width",
    optionB: "Nav links grouped: Logo on left, links in center, CTA on right",
    correct: "B",
    reason:
      "Grouping related nav items helps users understand the page structure.",
    goodElement: "Logical link grouping",
  },
  {
    principle: "Repetition",
    description: "Which card grid looks more professional?",
    optionA: "Cards with different border radius, padding, and shadow",
    optionB: "Cards all share 12px radius, 24px padding, same shadow",
    correct: "B",
    reason:
      "Repeated spacing, sizing, and shadow values create a cohesive design system.",
    goodElement: "Unified card design tokens",
  },
  {
    principle: "Contrast",
    description: "Which call-to-action button stands out more?",
    optionA: "Gray button on gray background",
    optionB: "Bright accent color button on neutral background",
    correct: "B",
    reason:
      "A high-contrast CTA directs the user's eye and increases click rates.",
    goodElement: "Accent CTA against neutral background",
  },
  {
    principle: "Alignment",
    description: "Which image-text layout looks more balanced?",
    optionA: "Image top, text bottom — both different widths",
    optionB: "Image left, text right — both same height, edge-aligned",
    correct: "B",
    reason:
      "Matching heights and aligning edges creates visual harmony in split layouts.",
    goodElement: "Equal-height edge-aligned split",
  },
];

function DesignPrinciples({ config, onGameEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<"A" | "B" | null>(null);
  const [goodElement, setGoodElement] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const pair = DESIGN_PAIRS[idx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = idx > 0 ? (correct / idx) * 100 : 50;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, idx],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function handleSelect(choice: "A" | "B") {
    if (feedback) return;
    setSelected(choice);
  }

  function handleSubmitChoice() {
    if (!selected || feedback) return;
    const isCorrect = selected === pair.correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    const elementBonus =
      goodElement.trim().length > 4 ? 100 * config.difficulty : 0;
    const pts = isCorrect ? 400 * config.difficulty + elementBonus : 0;
    setScore((s) => s + pts);
    if (isCorrect) setCorrect((c) => c + 1);
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setGoodElement("");
      if (idx + 1 >= DESIGN_PAIRS.length) endGame(true);
      else setIdx(idx + 1);
    }, 2000);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="design_principles.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 gap-2">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        <span className="text-xs text-muted-foreground">
          Pair {idx + 1}/{DESIGN_PAIRS.length}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${timePct}%`, background: "#f59e0b" }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8 text-center"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Design Principles Critic
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            10 side-by-side layout comparisons. The principle is shown above
            each pair.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Select which version better demonstrates the principle, then
            identify the good element for bonus points.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTime.current = Date.now();
              setStarted(true);
              startTimer();
            }}
            data-ocid="design_principles.start_button"
          >
            Start Critique
          </GlowButton>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-3"
            >
              <div className="glass-card rounded-xl p-3 border border-[#f59e0b]/30">
                <p className="text-xs uppercase tracking-widest text-[#f59e0b] mb-1">
                  Principle: {pair.principle}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {pair.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["A", "B"] as const).map((choice) => {
                  const text = choice === "A" ? pair.optionA : pair.optionB;
                  const isSelected = selected === choice;
                  const isCorrect = feedback && choice === pair.correct;
                  const isWrong =
                    feedback === "wrong" &&
                    isSelected &&
                    choice !== pair.correct;
                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => handleSelect(choice)}
                      className="rounded-xl border-2 p-4 text-left transition-all"
                      style={{
                        borderColor: isCorrect
                          ? "#10b981"
                          : isWrong
                            ? "#f43f5e"
                            : isSelected
                              ? "#00f5ff"
                              : "rgba(100,100,120,0.4)",
                        background: isCorrect
                          ? "rgba(16,185,129,0.08)"
                          : isWrong
                            ? "rgba(244,63,94,0.08)"
                            : isSelected
                              ? "rgba(0,245,255,0.06)"
                              : undefined,
                      }}
                      data-ocid={`design_principles.choice_${choice.toLowerCase()}`}
                    >
                      <span className="text-xs font-black text-muted-foreground mb-2 block">
                        Option {choice}
                      </span>
                      <span className="text-sm text-foreground">{text}</span>
                    </button>
                  );
                })}
              </div>
              {!feedback && selected && (
                <div className="glass-card rounded-xl p-3 border border-border/40">
                  <label
                    htmlFor="design-element-input"
                    className="text-xs text-muted-foreground block mb-1"
                  >
                    Identify the good element (optional, +100 pts):
                  </label>
                  <input
                    id="design-element-input"
                    type="text"
                    value={goodElement}
                    onChange={(e) => setGoodElement(e.target.value)}
                    placeholder="e.g. bold heading, consistent padding..."
                    className="w-full bg-transparent border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-[#00f5ff]/60"
                    data-ocid="design_principles.good_element_input"
                  />
                  <GlowButton
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitChoice}
                    className="mt-2"
                    data-ocid="design_principles.submit_button"
                  >
                    Submit Answer
                  </GlowButton>
                </div>
              )}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-3 border text-sm flex items-start gap-2 ${feedback === "correct" ? "border-[#10b981]/40 text-[#10b981]" : "border-[#f43f5e]/40 text-[#f43f5e]"}`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">
                      {feedback === "correct"
                        ? "Correct!"
                        : `Incorrect. Option ${pair.correct} was right.`}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {pair.reason}
                    </p>
                    <p className="text-xs mt-0.5">
                      Good element:{" "}
                      <span className="font-semibold">{pair.goodElement}</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────

export default function DigitalCreativity({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "color-theory")
    return <ColorTheory config={config} onGameEnd={onGameEnd} />;
  if (gameId === "digital-art")
    return <DesignPrinciples config={config} onGameEnd={onGameEnd} />;
  // default: pixel-design-studio
  return <PixelDesignStudio config={config} onGameEnd={onGameEnd} />;
}
