import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface WordItem {
  display: string;
  word: string;
  blanks: number[];
}

const EASY: WordItem[] = [
  { display: "C_T", word: "CAT", blanks: [1] },
  { display: "_OG", word: "DOG", blanks: [0] },
  { display: "S_N", word: "SUN", blanks: [1] },
  { display: "_UN", word: "RUN", blanks: [0] },
  { display: "B_G", word: "BAG", blanks: [1] },
];
const MEDIUM: WordItem[] = [
  { display: "SC_OOL", word: "SCHOOL", blanks: [2] },
  { display: "FR_END", word: "FRIEND", blanks: [2] },
  { display: "AN_MAL", word: "ANIMAL", blanks: [2] },
  { display: "F_OWER", word: "FLOWER", blanks: [1] },
  { display: "PL_NET", word: "PLANET", blanks: [2] },
];
const HARD: WordItem[] = [
  { display: "EL_PH_NT", word: "ELEPHANT", blanks: [2, 4] },
  { display: "BU_T_RFLY", word: "BUTTERFLY", blanks: [2, 4] },
  { display: "_IRTHDAY", word: "BIRTHDAY", blanks: [0] },
  { display: "CH_COL_TE", word: "CHOCOLATE", blanks: [2, 6] },
  { display: "VEG_T_BLE", word: "VEGETABLE", blanks: [3, 5] },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

export default function MissingLetterFill({ config, onGameEnd }: Props) {
  const diffMap: Record<number, WordItem[]> = { 1: EASY, 2: MEDIUM, 3: HARD };
  const wordSet = diffMap[config.difficulty] ?? MEDIUM;

  const [phase, setPhase] = useState<Phase>("idle");
  const [words] = useState<WordItem[]>(() =>
    [...wordSet].sort(() => Math.random() - 0.5),
  );
  const [wordIdx, setWordIdx] = useState(0);
  const [blankIdx, setBlankIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [flashWrong, setFlashWrong] = useState<string | null>(null);
  const [flashRight, setFlashRight] = useState(false);
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();

  const handleExpire = useCallback(() => {
    setPhase("over");
    onGameEnd(buildResult(config, score, correct / words.length, 120, true));
  }, [config, score, correct, words.length, onGameEnd]);

  const { timeLeft, start, reset } = useGameTimer(120, handleExpire);

  const startGame = () => {
    reset();
    setWordIdx(0);
    setBlankIdx(0);
    setScore(0);
    setLives(3);
    setCorrect(0);
    setFlashWrong(null);
    setFlashRight(false);
    setPhase("playing");
    start();
  };

  const handleLetter = (letter: string) => {
    if (flashWrong || flashRight) return;
    const item = words[wordIdx];
    const targetIdx = item.blanks[blankIdx];
    const expected = item.word[targetIdx];
    if (letter === expected) {
      setFlashRight(true);
      triggerParticle(200, 200, "correct");
      const nextBlank = blankIdx + 1;
      setTimeout(() => {
        setFlashRight(false);
        if (nextBlank >= item.blanks.length) {
          const newScore = score + 10;
          const newCorrect = correct + 1;
          setScore(newScore);
          setCorrect(newCorrect);
          triggerMascotReaction("correct");
          if (wordIdx + 1 >= words.length) {
            setPhase("over");
            onGameEnd(
              buildResult(
                config,
                newScore,
                newCorrect / words.length,
                120 - timeLeft,
                true,
              ),
            );
          } else {
            setWordIdx((w) => w + 1);
            setBlankIdx(0);
          }
        } else {
          setBlankIdx(nextBlank);
        }
      }, 400);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFlashWrong(letter);
      triggerShake();
      triggerMascotReaction("wrong");
      setTimeout(() => {
        setFlashWrong(null);
        if (newLives <= 0) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              correct / words.length,
              120 - timeLeft,
              false,
            ),
          );
        }
      }, 600);
    }
  };

  const renderDisplay = () => {
    if (phase !== "playing") return null;
    const item = words[wordIdx];
    let blanksSeen = 0;
    return item.display.split("").map((ch, i) => {
      const isBlank = ch === "_";
      const currentBlankCount = isBlank ? blanksSeen++ : blanksSeen;
      const isPast = isBlank && currentBlankCount < blankIdx;
      const isCurrent = isBlank && currentBlankCount === blankIdx;
      const revealedLetter = isPast
        ? item.word[item.blanks[currentBlankCount]]
        : ch;
      return (
        <span
          key={i}
          className={`inline-flex items-center justify-center w-10 h-12 text-2xl font-bold mx-1 rounded-lg border ${
            isCurrent
              ? "border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff] animate-pulse"
              : isPast
                ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
                : isBlank
                  ? "border-white/20 bg-white/5 text-white/30"
                  : "border-white/10 bg-white/5 text-white"
          }`}
        >
          {isCurrent ? "_" : revealedLetter}
        </span>
      );
    });
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
            Missing Letter Fill
          </h2>
          <p className="text-white/70 mb-2">
            Click the correct letter to fill each blank in the word.
          </p>
          <p className="text-white/50 text-sm mb-6">
            {words.length} words / 3 lives / 120 seconds
          </p>
          <GlowButton data-ocid="mlf.start_button" onClick={startGame}>
            Start Game
          </GlowButton>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">Game Over</h2>
          <p className="text-white/70 text-xl mb-1">
            Score: <span className="text-[#00f5ff] font-bold">{score}</span>
          </p>
          <p className="text-white/50 mb-6">
            Correct: {correct} / {words.length}
          </p>
          <GlowButton data-ocid="mlf.restart_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
        <span className="text-white/70 text-sm">
          Word {wordIdx + 1}/{words.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 20 ? "text-[#f43f5e]" : "text-[#10b981]"}`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 flex justify-center flex-wrap gap-1">
        {renderDisplay()}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-4 text-center">
          Select the missing letter
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {ALPHABET.map((letter) => {
            const isWrong = flashWrong === letter;
            return (
              <button
                type="button"
                key={letter}
                data-ocid={`mlf.letter.${letter}`}
                onClick={() => handleLetter(letter)}
                disabled={!!flashWrong || flashRight}
                className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all duration-200 ${
                  isWrong
                    ? "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : "border-white/10 bg-white/5 text-white hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/10"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
