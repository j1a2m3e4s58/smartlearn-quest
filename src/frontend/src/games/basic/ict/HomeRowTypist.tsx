import { GlowButton } from "@/components/ui/GlowButton";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const WORDS = [
  "falls",
  "flask",
  "lads",
  "slash",
  "flags",
  "halls",
  "glass",
  "jaffa",
  "flask",
  "salad",
  "dahl",
  "flash",
  "slab",
  "glad",
  "shall",
  "flag",
  "saga",
  "half",
  "slag",
  "lass",
];

export default function HomeRowTypist({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState<boolean[]>([]);
  const [totalErrors, setTotalErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalWords =
    config.difficulty === 3 ? 12 : config.difficulty === 2 ? 10 : 8;
  const words = WORDS.slice(0, totalWords);

  const endGame = useCallback(
    (s: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          totalErrors === 0
            ? 100
            : Math.max(0, 100 - (totalErrors / (s / 5)) * 50),
          0,
          s >= 50,
        ),
      );
    },
    [onGameEnd, config],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const word = words[wordIdx];
    setTyped(val);
    const errs = val.split("").map((c, i) => c !== word[i]);
    setErrors(errs);
    if (val === word) {
      const pts = word.length * 5;
      const newScore = score + pts;
      setScore(newScore);
      const next = wordIdx + 1;
      if (next >= words.length) {
        endGame(newScore);
        return;
      }
      setWordIdx(next);
      setTyped("");
      setErrors([]);
    } else if (val.length > word.length) {
      setTotalErrors((te) => te + 1);
    }
  };

  useEffect(() => {
    if (phase === "play") inputRef.current?.focus();
  }, [phase]);

  const startGame = () => {
    setScore(0);
    setWordIdx(0);
    setTyped("");
    setErrors([]);
    setTotalErrors(0);
    setPhase("play");
  };

  const word = words[wordIdx] ?? "";
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Home Row Typist
            </h2>
            <p className="text-slate-300 mb-2">
              Type each word using only home row keys: A S D F G H J K L
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Each correct character = +5 pts. {totalWords} words total.
            </p>
            <GlowButton onClick={startGame} data-ocid="homerow.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-slate-400">
              {wordIdx + 1}/{words.length}
            </span>
            <span className="text-[#f43f5e]">Errors: {totalErrors}</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
            <div className="flex gap-1 text-4xl font-mono font-bold">
              {word.split("").map((c, i) => (
                <span
                  key={i}
                  style={{
                    color:
                      i < typed.length
                        ? errors[i]
                          ? "#f43f5e"
                          : "#10b981"
                        : "#94a3b8",
                    textDecoration: errors[i] ? "underline" : "none",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
            <input
              ref={inputRef}
              data-ocid="homerow.input"
              value={typed}
              onChange={handleInput}
              className="w-64 text-center text-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5ff]"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className="text-slate-500 text-sm">Type the word above</p>
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Complete!
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-1">points scored</p>
            <p className="text-slate-500 text-sm mb-6">
              Total errors: {totalErrors}
            </p>
            <GlowButton onClick={startGame} data-ocid="homerow.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
