import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Heart, Keyboard, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Shortcut {
  action: string;
  keys: string[];
  display: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  {
    action: "Copy",
    keys: ["Control", "c"],
    display: "Ctrl + C",
    category: "Edit",
  },
  {
    action: "Paste",
    keys: ["Control", "v"],
    display: "Ctrl + V",
    category: "Edit",
  },
  {
    action: "Cut",
    keys: ["Control", "x"],
    display: "Ctrl + X",
    category: "Edit",
  },
  {
    action: "Undo",
    keys: ["Control", "z"],
    display: "Ctrl + Z",
    category: "Edit",
  },
  {
    action: "Save",
    keys: ["Control", "s"],
    display: "Ctrl + S",
    category: "File",
  },
  {
    action: "Select All",
    keys: ["Control", "a"],
    display: "Ctrl + A",
    category: "Edit",
  },
  {
    action: "Print",
    keys: ["Control", "p"],
    display: "Ctrl + P",
    category: "File",
  },
  {
    action: "New File",
    keys: ["Control", "n"],
    display: "Ctrl + N",
    category: "File",
  },
  {
    action: "Find",
    keys: ["Control", "f"],
    display: "Ctrl + F",
    category: "Navigation",
  },
  {
    action: "Bold",
    keys: ["Control", "b"],
    display: "Ctrl + B",
    category: "Format",
  },
  {
    action: "Italic",
    keys: ["Control", "i"],
    display: "Ctrl + I",
    category: "Format",
  },
  {
    action: "Underline",
    keys: ["Control", "u"],
    display: "Ctrl + U",
    category: "Format",
  },
  {
    action: "Redo",
    keys: ["Control", "y"],
    display: "Ctrl + Y",
    category: "Edit",
  },
  {
    action: "Close Tab",
    keys: ["Control", "w"],
    display: "Ctrl + W",
    category: "Navigation",
  },
  {
    action: "Open",
    keys: ["Control", "o"],
    display: "Ctrl + O",
    category: "File",
  },
];

type FlashState = "idle" | "correct" | "wrong";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function KeyboardNinja({ config, onGameEnd }: Props) {
  const [gameStarted, setGameStarted] = useState(false);
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffled, setShuffled] = useState<Shortcut[]>([]);
  const [flash, setFlash] = useState<FlashState>("idle");
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  const correctRef = useRef(correctAnswers);
  const totalRef = useRef(totalAnswers);
  livesRef.current = lives;
  scoreRef.current = score;
  correctRef.current = correctAnswers;
  totalRef.current = totalAnswers;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const accuracy =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  useEffect(() => {
    const arr = [...SHORTCUTS].sort(() => Math.random() - 0.5);
    setShuffled(arr);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOverRef.current || flash !== "idle") return;
    function handleKey(e: KeyboardEvent) {
      e.preventDefault();
      if (!shuffled.length) return;
      const current = shuffled[currentIdx % shuffled.length];
      const pressedKey = e.key.toLowerCase();
      const expectedKey = current.keys[current.keys.length - 1].toLowerCase();
      const needsCtrl = current.keys.includes("Control");
      const needsShift = current.keys.includes("Shift");
      const needsAlt = current.keys.includes("Alt");
      const ctrlOk = needsCtrl ? e.ctrlKey || e.metaKey : true;
      const shiftOk = needsShift ? e.shiftKey : !e.shiftKey;
      const altOk = needsAlt ? e.altKey : !e.altKey;
      const isCorrect =
        ctrlOk && shiftOk && altOk && pressedKey === expectedKey;
      setTotalAnswers((t) => t + 1);
      if (isCorrect) {
        const levelMult = config.difficulty;
        setScore((s) => s + 150 * levelMult);
        setCorrectAnswers((c) => c + 1);
        setFlash("correct");
        setTimeout(() => {
          setFlash("idle");
          setCurrentIdx((i) => i + 1);
        }, 500);
      } else {
        setFlash("wrong");
        setShowAnswer(true);
        setLives((l) => {
          const newL = l - 1;
          if (newL <= 0) endGame(false);
          return newL;
        });
        setTimeout(() => {
          setFlash("idle");
          setShowAnswer(false);
          setCurrentIdx((i) => i + 1);
        }, 1000);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameStarted, flash, currentIdx, shuffled, config.difficulty, endGame]);

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    startTimer();
  }

  const current =
    shuffled.length > 0 ? shuffled[currentIdx % shuffled.length] : null;
  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="keyboard_ninja.page"
    >
      {/* HUD */}
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Keyboard className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length heart row, positional index is stable
              key={`heart-${i}`}
              className={`h-4 w-4 ${
                i < lives
                  ? "text-[#f43f5e] fill-[#f43f5e]"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center">
        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
          >
            <Keyboard className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Keyboard Ninja
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Press the correct keyboard shortcut shown on screen. Speed and
              accuracy both count.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="keyboard_ninja.start_button"
            >
              Begin Training
            </GlowButton>
          </motion.div>
        ) : current ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
              className={`glass-card rounded-2xl p-10 text-center max-w-md w-full border-2 transition-all ${
                flash === "correct"
                  ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  : flash === "wrong"
                    ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                    : "border-border/30"
              }`}
              data-ocid="keyboard_ninja.challenge_card"
            >
              <span
                className="text-xs uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {current.category}
              </span>
              <h2
                className="text-4xl font-black mt-2 mb-6"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "#00f5ff",
                }}
              >
                {current.action}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Press the shortcut for:
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {current.keys.map((k, ki) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: keyboard shortcut keys are stable positional items
                  <span key={`key-${ki}`}>
                    <kbd className="px-3 py-1.5 rounded-lg border border-[#00f5ff]/50 text-[#00f5ff] font-mono text-lg font-bold bg-[#00f5ff]/5">
                      {k}
                    </kbd>
                    {ki < current.keys.length - 1 && (
                      <span className="text-muted-foreground mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-center gap-2 text-[#f43f5e]"
                >
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm">Answer: {current.display}</span>
                </motion.div>
              )}
              {flash === "correct" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex items-center justify-center gap-2 text-[#10b981]"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-bold">
                    +{150 * config.difficulty} pts
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
