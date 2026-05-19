import { GlowButton } from "@/components/ui/GlowButton";
import { Heart, Type, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─ Shared passage data ──────────────────────────────────────────────────────────────────
const PASSAGES: Record<1 | 2 | 3, string[]> = {
  1: [
    "The cat sat on the mat and looked around at the room.",
    "A dog runs fast in the park every single morning.",
    "Blue birds fly high in the bright clear sky above.",
  ],
  2: [
    "Information technology connects people across the world through fast networks.",
    "Computer systems process data and store information for future use every day.",
    "Digital devices help students learn and explore new knowledge at their own pace.",
  ],
  3: [
    "The central processing unit executes instructions and manages data flow throughout the system.",
    "Encryption algorithms protect sensitive information from unauthorized access across networks.",
    "Machine learning models analyze patterns in large datasets to make intelligent predictions.",
  ],
};

const CODE_SNIPPETS: Record<1 | 2 | 3, string[]> = {
  1: [
    "x = 10; y = 20; print(x + y)",
    "if (score > 100) { grade = 'A'; }",
    "for i in range(5): print(i)",
  ],
  2: [
    "function add(a, b) { return a + b; }",
    "const list = [1, 2, 3]; list.forEach(n => console.log(n));",
    "while (count < 10) { count++; total += count; }",
  ],
  3: [
    "class Node { constructor(val) { this.val = val; this.next = null; } }",
    "def binary_search(arr, target): lo, hi = 0, len(arr)-1",
    "SELECT name, score FROM students WHERE grade = 'A' ORDER BY score DESC;",
  ],
};

const MARATHON_WORDS: Record<1 | 2 | 3, string[]> = {
  1: [
    "cat",
    "dog",
    "run",
    "fun",
    "sun",
    "top",
    "cup",
    "big",
    "red",
    "hot",
    "map",
    "sit",
    "fly",
    "bed",
    "car",
  ],
  2: [
    "apple",
    "cloud",
    "brain",
    "swift",
    "track",
    "delta",
    "prime",
    "flame",
    "graft",
    "quilt",
    "stone",
    "cramp",
    "blend",
    "frost",
    "pivot",
  ],
  3: [
    "algorithm",
    "encryption",
    "processor",
    "bandwidth",
    "interface",
    "debugging",
    "recursion",
    "database",
    "framework",
    "protocol",
    "compiler",
    "variable",
    "software",
    "hardware",
    "function",
  ],
};

const HOME_ROW_WORDS: Record<1 | 2 | 3, string[]> = {
  1: [
    "all",
    "fall",
    "hall",
    "dash",
    "gash",
    "glad",
    "flag",
    "half",
    "lass",
    "flask",
  ],
  2: [
    "glass",
    "flags",
    "clads",
    "salad",
    "halfs",
    "flads",
    "klash",
    "shall",
    "falls",
    "hags",
  ],
  3: [
    "flashy",
    "classy",
    "gladly",
    "flasks",
    "jacked",
    "khakis",
    "safely",
    "halved",
    "sashed",
    "flaked",
  ],
};

// ─ Game 1: Classic Speed Typist ───────────────────────────────────────────────────────────
function SpeedTypistGame({ config, onGameEnd }: Props) {
  const [gameStarted, setGameStarted] = useState(false);
  const [passage, setPassage] = useState("");
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameOverRef = useRef(false);

  const endGame = useCallback(
    (
      completed: boolean,
      typedLen: number,
      passageLen: number,
      elapsed: number,
    ) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const correctChars = Array.from({
        length: Math.min(typedLen, passageLen),
      }).filter((_, i) => typedText[i] === passage[i]).length;
      const acc = typedLen > 0 ? (correctChars / typedLen) * 100 : 0;
      const minutes = elapsed / 60;
      const calcWpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
      const score = calcWpm * 10 + Math.floor(acc);
      onGameEnd(
        buildResult(config, score, acc, Math.round(elapsed), completed),
      );
    },
    [config, onGameEnd, typedText, passage],
  );

  useEffect(() => {
    const opts = PASSAGES[config.difficulty];
    setPassage(opts[Math.floor(Math.random() * opts.length)]);
  }, [config.difficulty]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          endGame(false, typedText.length, passage.length, elapsed);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame, typedText.length, passage.length]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!gameStarted || gameOver) return;
    const val = e.target.value;
    if (val.length > passage.length) return;
    setTypedText(val);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const correctChars = Array.from(val).filter(
      (ch, i) => ch === passage[i],
    ).length;
    const acc = val.length > 0 ? (correctChars / val.length) * 100 : 100;
    const minutes = elapsed / 60;
    const calcWpm =
      minutes > 0 && elapsed > 1 ? Math.round(correctChars / 5 / minutes) : 0;
    setWpm(calcWpm);
    setAccuracy(Math.round(acc));
    if (val.length === passage.length)
      endGame(true, val.length, passage.length, elapsed);
  }

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    setTypedText("");
    setTimeLeft(config.timeLimit);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="typing_speed.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Type className="h-4 w-4" />
          <span className="text-lg font-bold">
            <span className="text-[#f59e0b]">{wpm}</span>
            <span className="text-xs text-muted-foreground ml-1">WPM</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3 text-[#00f5ff]" />
          <span>{accuracy}% accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-[#f43f5e] fill-[#f43f5e]" />
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

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <Type className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Speed Typist
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Type the passage as fast and accurately as possible. Your WPM
              score determines your final rank.
            </p>
            {passage && (
              <p className="text-muted-foreground text-xs mb-6 border border-border/30 rounded-lg p-3 text-left leading-relaxed">
                {passage}
              </p>
            )}
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="typing_speed.start_button"
            >
              Start Typing
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          <div
            className="glass-card rounded-xl p-5 font-mono text-base leading-8 min-h-[100px] select-none"
            data-ocid="typing_speed.passage"
          >
            {Array.from(passage).map((char, i) => {
              let color = "text-muted-foreground";
              if (i < typedText.length) {
                color =
                  typedText[i] === char
                    ? "text-[#00f5ff]"
                    : "text-[#f43f5e] underline";
              } else if (i === typedText.length) {
                color = "text-foreground bg-[#00f5ff]/20 rounded";
              }
              return (
                <span key={`char-${i}`} className={color}>
                  {char}
                </span>
              );
            })}
          </div>
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={handleInput}
            className="opacity-0 absolute w-0 h-0 pointer-events-none"
            aria-label="Type the passage here"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-ocid="typing_speed.input"
          />
          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="glass-card rounded-xl p-4 text-center text-muted-foreground text-sm hover:text-foreground transition-smooth border-2 border-dashed border-border/30 hover:border-[#00f5ff]/40"
            data-ocid="typing_speed.focus_area"
          >
            Click here then start typing
          </button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full xp-fill transition-all duration-200"
                style={{
                  width: `${(typedText.length / passage.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {typedText.length}/{passage.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─ Game 2: Typing Accuracy ────────────────────────────────────────────────────────────────
function TypingAccuracyGame({ config, onGameEnd }: Props) {
  const [passage] = useState(() => {
    const opts = PASSAGES[config.difficulty];
    return opts[Math.floor(Math.random() * opts.length)];
  });
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [perfect, setPerfect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameOverRef = useRef(false);
  const errorsRef = useRef(errors);
  errorsRef.current = errors;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const acc =
        passage.length > 0
          ? Math.max(
              0,
              ((passage.length - errorsRef.current) / passage.length) * 100,
            )
          : 0;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const bonus = errorsRef.current === 0 ? 500 : 0;
      const score = Math.floor(acc * 2) + bonus;
      onGameEnd(
        buildResult(config, score, acc, Math.round(elapsed), completed),
      );
    },
    [config, onGameEnd, passage],
  );

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!gameStarted || gameOver) return;
    const val = e.target.value;
    // Block forward progress on error: check last character
    if (val.length > typed.length) {
      const newChar = val[val.length - 1];
      const expectedChar = passage[typed.length];
      if (newChar !== expectedChar) {
        setErrors((er) => er + 1);
        return; // block progression
      }
    }
    if (val.length > passage.length) return;
    setTyped(val);
    if (val.length === passage.length) {
      if (errorsRef.current === 0) setPerfect(true);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTimeout(() => endGame(true), 400);
      return;
    }
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;
  const typingProgressPct = (typed.length / passage.length) * 100;
  const errBarW = Math.min(100, errors * 10);

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="typing_accuracy.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-[#10b981]" />
          <span className="text-sm font-bold text-[#10b981]">
            Errors: {errors}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {perfect && (
            <span className="text-[#f59e0b] font-bold text-xs animate-pulse">
              PERFECT!
            </span>
          )}
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

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Typing Accuracy
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Every mistake is blocked — you cannot advance until you type the
              correct character. Achieve 0 errors for a perfect bonus!
            </p>
            {passage && (
              <p className="text-muted-foreground text-xs mb-6 border border-border/30 rounded-lg p-3 text-left leading-relaxed">
                {passage}
              </p>
            )}
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTimeRef.current = Date.now();
                setGameStarted(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              data-ocid="typing_accuracy.start_button"
            >
              Begin Accuracy Test
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-xl p-5 font-mono text-base leading-8 select-none">
            {Array.from(passage).map((char, i) => {
              let cls = "text-muted-foreground";
              if (i < typed.length) cls = "text-[#10b981]";
              else if (i === typed.length)
                cls = "text-foreground bg-[#00f5ff]/20 rounded";
              return (
                <span key={`c-${i}`} className={cls}>
                  {char}
                </span>
              );
            })}
          </div>
          <textarea
            ref={textareaRef}
            value={typed}
            onChange={handleInput}
            className="opacity-0 absolute w-0 h-0 pointer-events-none"
            aria-label="Type accurately"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="glass-card rounded-xl p-4 text-center text-sm text-muted-foreground hover:text-foreground border-2 border-dashed border-border/30 transition-smooth"
            data-ocid="typing_accuracy.focus_area"
          >
            Click here and type — errors are blocked, not allowed
          </button>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Progress</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[#10b981] transition-all duration-200"
                  style={{ width: `${typingProgressPct}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Error rate</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[#f43f5e] transition-all duration-200"
                  style={{ width: `${errBarW}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─ Game 3: Code Typist ────────────────────────────────────────────────────────────────────
function CodeTypistGame({ config, onGameEnd }: Props) {
  const [snippet] = useState(() => {
    const opts = CODE_SNIPPETS[config.difficulty];
    return opts[Math.floor(Math.random() * opts.length)];
  });
  const [typed, setTyped] = useState("");
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameOverRef = useRef(false);

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const correctChars = Array.from(typed).filter(
        (ch, i) => ch === snippet[i],
      ).length;
      const acc = typed.length > 0 ? (correctChars / typed.length) * 100 : 0;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const minutes = elapsed / 60;
      const calcWpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
      const score = calcWpm * 12 + Math.floor(acc) - errors * 5;
      onGameEnd(
        buildResult(
          config,
          Math.max(0, score),
          acc,
          Math.round(elapsed),
          completed,
        ),
      );
    },
    [config, onGameEnd, typed, snippet, errors],
  );

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!gameStarted || gameOver) return;
    const val = e.target.value;
    if (val.length > snippet.length) return;
    if (val.length > typed.length) {
      const newChar = val[val.length - 1];
      if (newChar !== snippet[val.length - 1]) setErrors((er) => er + 1);
    }
    setTyped(val);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const correctChars = Array.from(val).filter(
      (ch, i) => ch === snippet[i],
    ).length;
    const minutes = elapsed / 60;
    if (minutes > 0 && elapsed > 1)
      setWpm(Math.round(correctChars / 5 / minutes));
    if (val.length === snippet.length) endGame(true);
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="code_typist.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-[#7c3aed]" />
          <span className="text-lg font-bold text-[#7c3aed]">
            {wpm} <span className="text-xs text-muted-foreground">WPM</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Errors: <span className="text-[#f43f5e] font-bold">{errors}</span>
        </span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-6">{timeLeft}s</span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Code Typist
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Type code snippets including special characters. Errors deduct
              points. High WPM with accuracy wins!
            </p>
            {snippet && (
              <p className="text-muted-foreground text-xs mb-6 border border-[#7c3aed]/30 rounded-lg p-3 text-left leading-relaxed font-mono">
                {snippet}
              </p>
            )}
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTimeRef.current = Date.now();
                setGameStarted(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              data-ocid="code_typist.start_button"
            >
              Start Coding
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-xl p-5 font-mono text-sm leading-8 select-none border border-[#7c3aed]/20">
            {Array.from(snippet).map((char, i) => {
              let cls = "text-muted-foreground";
              if (i < typed.length) {
                cls =
                  typed[i] === char
                    ? "text-[#7c3aed]"
                    : "text-[#f43f5e] underline";
              } else if (i === typed.length)
                cls = "text-foreground bg-[#7c3aed]/20 rounded";
              return (
                <span key={`s-${i}`} className={cls}>
                  {char}
                </span>
              );
            })}
          </div>
          <textarea
            ref={textareaRef}
            value={typed}
            onChange={handleInput}
            className="opacity-0 absolute w-0 h-0 pointer-events-none"
            aria-label="Type the code here"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="glass-card rounded-xl p-4 text-center text-sm text-muted-foreground hover:text-foreground border-2 border-dashed border-[#7c3aed]/30 transition-smooth"
            data-ocid="code_typist.focus_area"
          >
            Click here then type the code above
          </button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] transition-all"
                style={{ width: `${(typed.length / snippet.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {typed.length}/{snippet.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─ Game 4: Typing Marathon (falling words) ──────────────────────────────────────────

interface FallingWord {
  id: number;
  word: string;
  x: number; // 0-85%
  y: number; // 0-100%
  speed: number;
}

let wordIdCounter = 0;

function TypingMarathonGame({ config, onGameEnd }: Props) {
  const words = MARATHON_WORDS[config.difficulty];
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameOverRef = useRef(false);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  const typedRef = useRef(typedCount);
  livesRef.current = lives;
  scoreRef.current = score;
  typedRef.current = typedCount;
  const startTimeRef = useRef(Date.now());
  const baseSpeed =
    config.difficulty === 1 ? 0.4 : config.difficulty === 2 ? 0.6 : 0.9;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const acc =
        typedRef.current > 0
          ? Math.min(
              100,
              (typedRef.current /
                (typedRef.current + (config.livesCount - livesRef.current))) *
                100,
            )
          : 0;
      onGameEnd(buildResult(config, scoreRef.current, acc, elapsed, completed));
    },
    [config, onGameEnd],
  );

  // Spawn words
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(
      () => {
        const word = words[Math.floor(Math.random() * words.length)];
        const speedMult = 1 + Math.random() * 0.5;
        setFallingWords((prev) => [
          ...prev,
          {
            id: wordIdCounter++,
            word,
            x: Math.floor(Math.random() * 85),
            y: 0,
            speed: baseSpeed * speedMult,
          },
        ]);
      },
      config.difficulty === 1 ? 2200 : config.difficulty === 2 ? 1700 : 1300,
    );
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, words, baseSpeed, config.difficulty]);

  // Move words down
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      setFallingWords((prev) => {
        const next: FallingWord[] = [];
        let livesLost = 0;
        for (const w of prev) {
          const newY = w.y + w.speed;
          if (newY >= 100) {
            livesLost++;
          } else {
            next.push({ ...w, y: newY });
          }
        }
        if (livesLost > 0) {
          setLives((l) => {
            const nl = l - livesLost;
            if (nl <= 0) {
              setTimeout(() => endGame(false), 300);
              return 0;
            }
            return nl;
          });
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, endGame]);

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    if (gameOver) return;
    const val = e.target.value;
    setCurrentInput(val);
    // Check if any falling word matches
    const match = fallingWords.find((w) => w.word === val.trim());
    if (match) {
      setFallingWords((prev) => prev.filter((w) => w.id !== match.id));
      setScore((s) => s + 100 + Math.floor((100 - match.y) * 2));
      setTypedCount((t) => t + 1);
      setCurrentInput("");
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="typing_marathon.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#f59e0b]">
          <Zap className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          Typed: {typedCount}
        </span>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Typing Marathon
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Words fall from the top. Type them before they reach the bottom.
              Speed increases over time. Lose a life for every missed word!
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTimeRef.current = Date.now();
                setGameStarted(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              data-ocid="typing_marathon.start_button"
            >
              Start Marathon
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-2">
          <div className="relative flex-1 glass-card rounded-xl overflow-hidden border border-border/40">
            <AnimatePresence>
              {fallingWords.map((w) => {
                const wordStyle = { left: `${w.x}%`, top: `${w.y}%` };
                return (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute font-mono text-sm font-bold px-2 py-1 rounded border ${
                      currentInput.length > 0 && w.word.startsWith(currentInput)
                        ? "border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/15"
                        : "border-border/40 text-foreground bg-background/50"
                    }`}
                    style={wordStyle}
                  >
                    {w.word}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {fallingWords.length === 0 && gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Words incoming...
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleTyping}
            placeholder="Type words here..."
            className="glass-card rounded-xl px-4 py-3 font-mono text-foreground border border-border/40 focus:border-[#00f5ff]/60 outline-none text-center"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-ocid="typing_marathon.input"
          />
        </div>
      )}
    </div>
  );
}

// ─ Game 5: Blind Type ──────────────────────────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const HOME_ROW_KEYS = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];

function BlindTypeGame({ config, onGameEnd }: Props) {
  const wordList = HOME_ROW_WORDS[config.difficulty];
  const [words] = useState(() => [...wordList].sort(() => Math.random() - 0.5));
  const [wordIdx, setWordIdx] = useState(0);
  const [showWord, setShowWord] = useState(true);
  const [typed, setTyped] = useState("");
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;
  const startTimeRef = useRef(Date.now());

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const acc = words.length > 0 ? (wordIdx / words.length) * 100 : 0;
      onGameEnd(buildResult(config, scoreRef.current, acc, elapsed, completed));
    },
    [config, onGameEnd, words.length, wordIdx],
  );

  function startNextWord() {
    setShowWord(true);
    setTyped("");
    setFeedback(null);
    setTimeout(() => {
      setShowWord(false);
      inputRef.current?.focus();
    }, 1500);
  }

  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    setShowWord(true);
    setTimeout(() => {
      setShowWord(false);
      inputRef.current?.focus();
    }, 1800);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const word = words[wordIdx];
      if (typed.toLowerCase() === word.toLowerCase()) {
        setScore((s) => s + 200);
        setFeedback("correct");
      } else {
        const newL = livesRef.current - 1;
        setLives(newL);
        setFeedback("wrong");
        if (newL <= 0) {
          setTimeout(() => endGame(false), 1000);
          return;
        }
      }
      setTimeout(() => {
        const nextIdx = wordIdx + 1;
        if (nextIdx >= words.length) endGame(true);
        else {
          setWordIdx(nextIdx);
          startNextWord();
        }
      }, 800);
    }
  }

  const currentWord = words[wordIdx];

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="blind_type.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <span className="text-lg font-bold text-[#f59e0b]">
          {score.toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {wordIdx + 1}/{words.length}
        </span>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Blind Type
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              A word appears briefly then hides. Type it from memory using the
              home row. Press Enter to submit. No key highlights — pure muscle
              memory!
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="blind_type.start_button"
            >
              Begin Blind Test
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="glass-card rounded-2xl px-12 py-8 border border-border/40 min-w-[240px] text-center">
              {showWord ? (
                <motion.p
                  key="show"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl font-black font-mono tracking-widest"
                  style={{ color: "#00f5ff" }}
                >
                  {currentWord.toUpperCase()}
                </motion.p>
              ) : (
                <motion.p
                  key="hide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-4xl font-mono tracking-widest text-muted-foreground/20"
                >
                  ????
                </motion.p>
              )}
              {feedback && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm font-bold mt-2 ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback === "correct"
                    ? "Correct!"
                    : `Wrong! It was: ${currentWord.toUpperCase()}`}
                </motion.p>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type then press Enter"
              className="glass-card rounded-xl px-6 py-3 font-mono text-xl text-center text-foreground border border-border/40 focus:border-[#00f5ff]/60 outline-none w-64"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={showWord}
              data-ocid="blind_type.input"
            />
          </div>
          {/* Virtual keyboard (no hints) */}
          <div className="flex flex-col items-center gap-1">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={`row-${ri}`} className="flex gap-1">
                {row.map((key) => {
                  const isHome = HOME_ROW_KEYS.includes(key);
                  const keyStyle = isHome
                    ? { borderColor: "rgba(124,58,237,0.5)", color: "#7c3aed" }
                    : {
                        borderColor: "rgba(100,100,120,0.3)",
                        color: "#6b7280",
                      };
                  return (
                    <div
                      key={key}
                      className="w-7 h-7 rounded border flex items-center justify-center text-xs font-mono font-bold"
                      style={keyStyle}
                    >
                      {key}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─ Router ────────────────────────────────────────────────────────────────────────
export default function TypingSpeed({ config, onGameEnd }: Props) {
  if (config.gameId === "typing-accuracy")
    return <TypingAccuracyGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "code-typist")
    return <CodeTypistGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "typing-marathon")
    return <TypingMarathonGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "blind-type")
    return <BlindTypeGame config={config} onGameEnd={onGameEnd} />;
  return <SpeedTypistGame config={config} onGameEnd={onGameEnd} />;
}
