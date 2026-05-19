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

interface FractionPair {
  a: [number, number];
  b: [number, number];
  answer: "<" | "=" | ">";
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function simplify(n: number, d: number): [number, number] {
  const g = gcd(n, d);
  return [n / g, d / g];
}

function genPair(level: number): FractionPair {
  const maxD = level === 3 ? 12 : level === 2 ? 8 : 6;
  const d1 = Math.floor(Math.random() * (maxD - 2)) + 2;
  const d2 = Math.floor(Math.random() * (maxD - 2)) + 2;
  const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
  const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
  const v1 = n1 / d1;
  const v2 = n2 / d2;
  const answer: "<" | "=" | ">" = v1 < v2 ? "<" : v1 > v2 ? ">" : "=";
  return { a: [n1, d1], b: [n2, d2], answer };
}

export default function FractionComparison({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [pair, setPair] = useState<FractionPair>(genPair(1));
  const [chosen, setChosen] = useState<string | null>(null);
  const level = config.difficulty ?? 1;

  const nextRound = useCallback(
    (rnd: number) => {
      setPair(genPair(level));
      setChosen(null);
      setRound(rnd);
    },
    [level],
  );

  const startGame = () => {
    setScore(0);
    setLives(3);
    nextRound(0);
    setPhase("play");
  };

  const handleChoice = useCallback(
    (symbol: "<" | "=" | ">") => {
      if (chosen !== null) return;
      const correct = symbol === pair.answer;
      setChosen(symbol);
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
    [chosen, pair, score, lives, round, nextRound, onGameEnd, config],
  );

  const FractionDisplay = ({ n, d }: { n: number; d: number }) => (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold text-white">{n}</span>
      <div className="w-10 h-0.5 bg-slate-400 my-1" />
      <span className="text-4xl font-bold text-white">{d}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Fraction Comparison
            </h2>
            <p className="text-slate-300 mb-2">
              Compare two fractions using &lt;, =, or &gt;.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Each correct = +10 pts.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="frac-compare.start_button"
            >
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
            <div className="flex items-center gap-8">
              <FractionDisplay n={pair.a[0]} d={pair.a[1]} />
              <span
                className="text-3xl font-bold"
                style={{
                  color: chosen
                    ? chosen === pair.answer
                      ? "#10b981"
                      : "#f43f5e"
                    : "#475569",
                }}
              >
                {chosen ?? "?"}
              </span>
              <FractionDisplay n={pair.b[0]} d={pair.b[1]} />
            </div>
            <div className="flex gap-4">
              {(["<", "=", ">"] as const).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  data-ocid={`frac-compare.${sym === "<" ? "less" : sym === ">" ? "greater" : "equal"}_button`}
                  onClick={() => handleChoice(sym)}
                  disabled={chosen !== null}
                  className="w-16 h-16 rounded-xl border-2 text-2xl font-bold transition-all disabled:opacity-60"
                  style={{
                    borderColor:
                      chosen === sym
                        ? sym === pair.answer
                          ? "#10b981"
                          : "#f43f5e"
                        : "#00f5ff44",
                    background:
                      chosen === sym
                        ? sym === pair.answer
                          ? "#10b98122"
                          : "#f43f5e22"
                        : "#00f5ff11",
                    color: "#00f5ff",
                  }}
                >
                  {sym}
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
              data-ocid="frac-compare.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
