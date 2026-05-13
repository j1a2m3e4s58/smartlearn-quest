import { GlowButton } from "@/components/ui/GlowButton";
import { Heart, Type, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "./GameEngine";

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

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function TypingSpeed({ config, onGameEnd }: Props) {
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
    const options = PASSAGES[config.difficulty];
    setPassage(options[Math.floor(Math.random() * options.length)]);
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
    // Limit to passage length
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
    if (val.length === passage.length) {
      endGame(true, val.length, passage.length, elapsed);
    }
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
      {/* HUD */}
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

      {/* Main */}
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
              Typing Speed
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
          {/* Passage display */}
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
                // biome-ignore lint/suspicious/noArrayIndexKey: character spans in a fixed passage string, index is the stable identity
                <span key={`char-${i}`} className={color}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Hidden textarea */}
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

          {/* Click-to-focus overlay */}
          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="glass-card rounded-xl p-4 text-center text-muted-foreground text-sm hover:text-foreground transition-smooth border-2 border-dashed border-border/30 hover:border-[#00f5ff]/40"
            data-ocid="typing_speed.focus_area"
          >
            Click here then start typing
          </button>

          {/* Progress */}
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
