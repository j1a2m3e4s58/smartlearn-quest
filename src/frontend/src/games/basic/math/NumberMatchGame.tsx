import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const numberToWords = (n: number): string => {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  if (n < 20) return ones[n];
  if (n < 100)
    return `${tens[Math.floor(n / 10)]}${n % 10 ? `-${ones[n % 10]}` : ""}`;
  return `${ones[Math.floor(n / 100)]} hundred${n % 100 ? ` ${numberToWords(n % 100)}` : ""}`;
};

const TOTAL = 20;
const DIFF_MAX = { 1: 50, 2: 100, 3: 200 };

function getChoices(correct: number, max: number): string[] {
  const correctWord = numberToWords(correct);
  const wrongs = new Set<string>();
  while (wrongs.size < 3) {
    const n = Math.floor(Math.random() * max) + 1;
    const w = numberToWords(n);
    if (w !== correctWord) wrongs.add(w);
  }
  return [...Array.from(wrongs), correctWord].sort(() => Math.random() - 0.5);
}

export default function NumberMatchGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const max = DIFF_MAX[(config.difficulty ?? 1) as 1 | 2 | 3];

  const nextRound = useCallback(
    (rnd: number) => {
      const n = Math.floor(Math.random() * max) + 1;
      setCurrent(n);
      setChoices(getChoices(n, max));
      setChosen(null);
      setRound(rnd);
    },
    [max],
  );

  const startGame = () => {
    setScore(0);
    setLives(3);
    nextRound(0);
    setPhase("play");
  };

  const handleChoice = useCallback(
    (word: string) => {
      if (chosen !== null) return;
      const correct = word === numberToWords(current);
      setChosen(word);
      setTimeout(() => {
        const ns = correct ? score + 10 : score;
        const nl = correct ? lives : lives - 1;
        setScore(ns);
        setLives(nl);
        if (nl <= 0 || round + 1 >= TOTAL) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              Math.round((ns / (TOTAL * 10)) * 100),
              0,
              nl > 0,
            ),
          );
          return;
        }
        nextRound(round + 1);
      }, 700);
    },
    [chosen, current, round, score, lives, nextRound, onGameEnd, config],
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Number Match
            </h2>
            <p className="text-slate-300 mb-2">
              Match the number to its word form.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Each correct answer = +10 points.
            </p>
            <GlowButton onClick={startGame} data-ocid="num-match.start_button">
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
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
            <div className="text-7xl font-bold text-white">{current}</div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {choices.map((word, i) => (
                <button
                  key={word}
                  type="button"
                  data-ocid={`num-match.choice.${i + 1}`}
                  onClick={() => handleChoice(word)}
                  className="px-4 py-4 rounded-xl border text-sm text-center transition-all"
                  style={{
                    borderColor:
                      chosen !== null
                        ? word === numberToWords(current)
                          ? "#10b981"
                          : chosen === word
                            ? "#f43f5e"
                            : "#ffffff15"
                        : "#ffffff22",
                    background:
                      chosen !== null
                        ? word === numberToWords(current)
                          ? "#10b98122"
                          : chosen === word
                            ? "#f43f5e22"
                            : "#ffffff05"
                        : "#ffffff08",
                    color: "#e2e8f0",
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
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
            <GlowButton
              onClick={startGame}
              data-ocid="num-match.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
