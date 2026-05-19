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

const TOTAL = 15;

interface EqRound {
  display: [number, number];
  correct: [number, number];
  choices: [number, number][];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function equivalent(n: number, d: number): [number, number] {
  const multiplier = Math.floor(Math.random() * 4) + 2;
  return [n * multiplier, d * multiplier];
}

function genRound(): EqRound {
  const denoms = [2, 3, 4, 5, 6, 8];
  const d = denoms[Math.floor(Math.random() * denoms.length)];
  const n = Math.floor(Math.random() * (d - 1)) + 1;
  const correct = equivalent(n, d);
  const wrongs: [number, number][] = [];
  while (wrongs.length < 3) {
    const wd = denoms[Math.floor(Math.random() * denoms.length)];
    const wn = Math.floor(Math.random() * (wd - 1)) + 1;
    const isEq = wn * d === n * wd;
    if (!isEq) wrongs.push([wn, wd]);
  }
  const choices = [...wrongs, correct].sort(() => Math.random() - 0.5) as [
    number,
    number,
  ][];
  return { display: [n, d], correct, choices };
}

export default function FractionEquivalence({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState<EqRound>(genRound());
  const [chosen, setChosen] = useState<number | null>(null);

  const nextRound = useCallback((rnd: number) => {
    setCurrent(genRound());
    setChosen(null);
    setRound(rnd);
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    nextRound(0);
    setPhase("play");
  };

  const handleChoice = useCallback(
    (idx: number) => {
      if (chosen !== null) return;
      const [cn, cd] = current.choices[idx];
      const [dn, dd] = current.display;
      const isEq = cn * dd === dn * cd;
      setChosen(idx);
      setTimeout(() => {
        const ns = isEq ? score + 10 : score;
        const nl = isEq ? lives : lives - 1;
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
    [chosen, current, score, lives, round, nextRound, onGameEnd, config],
  );

  const isCorrectChoice = (idx: number) => {
    const [cn, cd] = current.choices[idx];
    const [dn, dd] = current.display;
    return cn * dd === dn * cd;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Fraction Equivalence
            </h2>
            <p className="text-slate-300 mb-2">
              Find the fraction equivalent to the one shown.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Each correct = +10 pts.
            </p>
            <GlowButton onClick={startGame} data-ocid="frac-eq.start_button">
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
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            <p className="text-slate-400">Which fraction equals:</p>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-[#00f5ff]">
                {current.display[0]}
              </span>
              <div className="w-16 h-1 bg-white my-2" />
              <span className="text-6xl font-bold text-[#00f5ff]">
                {current.display[1]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {current.choices.map(([n, d], idx) => (
                <button
                  key={idx}
                  type="button"
                  data-ocid={`frac-eq.choice.${idx + 1}`}
                  onClick={() => handleChoice(idx)}
                  disabled={chosen !== null}
                  className="w-28 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all disabled:cursor-default"
                  style={{
                    borderColor:
                      chosen !== null
                        ? isCorrectChoice(idx)
                          ? "#10b981"
                          : chosen === idx
                            ? "#f43f5e"
                            : "#ffffff15"
                        : "#ffffff22",
                    background:
                      chosen !== null
                        ? isCorrectChoice(idx)
                          ? "#10b98122"
                          : chosen === idx
                            ? "#f43f5e22"
                            : "#ffffff05"
                        : "#ffffff08",
                  }}
                >
                  <span className="text-xl font-bold text-white">{n}</span>
                  <div className="w-8 h-0.5 bg-slate-400 my-1" />
                  <span className="text-xl font-bold text-white">{d}</span>
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
            <GlowButton onClick={startGame} data-ocid="frac-eq.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
