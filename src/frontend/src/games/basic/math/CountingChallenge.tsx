import { GlowButton } from "@/components/ui/GlowButton";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFF = {
  1: { min: 1, max: 10 },
  2: { min: 11, max: 30 },
  3: { min: 31, max: 50 },
};
const TOTAL = 10;

export default function CountingChallenge({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { min, max } = DIFF[(config.difficulty ?? 1) as 1 | 2 | 3];

  const genCount = () => Math.floor(Math.random() * (max - min + 1)) + min;

  const nextRound = useCallback(
    (rnd: number) => {
      setCount(genCount());
      setInput("");
      setFeedback(null);
      setRound(rnd);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [min, max],
  );

  const startGame = () => {
    setScore(0);
    nextRound(0);
    setPhase("play");
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (feedback !== null) return;
      const guess = Number.parseInt(input, 10);
      const correct = guess === count;
      setFeedback(correct ? "correct" : "wrong");
      setTimeout(() => {
        const ns = correct ? score + 10 : score;
        setScore(ns);
        if (round + 1 >= TOTAL) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              Math.round((ns / (TOTAL * 10)) * 100),
              0,
              ns >= 60,
            ),
          );
          return;
        }
        nextRound(round + 1);
      }, 800);
    },
    [input, count, round, score, feedback, nextRound, onGameEnd, config],
  );

  const dots = Array.from({ length: count });
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Counting Challenge
            </h2>
            <p className="text-slate-300 mb-2">
              Count the dots and type the correct number.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Numbers range: {min}–{max}.
            </p>
            <GlowButton onClick={startGame} data-ocid="counting.start_button">
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
              {round + 1}/{TOTAL}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
            <div
              data-ocid="counting.dots"
              className="flex flex-wrap gap-2 justify-center max-w-xs p-4 rounded-xl border border-white/10 bg-white/5"
            >
              {dots.map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full"
                  style={{
                    background:
                      feedback === "correct"
                        ? "#10b981"
                        : feedback === "wrong"
                          ? "#f43f5e"
                          : "#00f5ff",
                  }}
                />
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                data-ocid="counting.input"
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-28 text-center text-2xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5ff]"
                min={0}
                max={100}
              />
              <button
                type="submit"
                data-ocid="counting.submit_button"
                className="px-5 py-3 rounded-xl bg-[#00f5ff]/10 border border-[#00f5ff]/40 text-[#00f5ff] font-bold hover:bg-[#00f5ff]/20 transition-all"
              >
                Check
              </button>
            </form>
            {feedback && (
              <p
                className="text-lg font-bold"
                style={{
                  color: feedback === "correct" ? "#10b981" : "#f43f5e",
                }}
              >
                {feedback === "correct" ? "Correct!" : `Wrong! It was ${count}`}
              </p>
            )}
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
            <p className="text-slate-400 mb-6">out of {TOTAL * 10} possible</p>
            <GlowButton onClick={startGame} data-ocid="counting.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
