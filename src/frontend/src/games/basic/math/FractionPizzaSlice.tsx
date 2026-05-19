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

const TOTAL = 10;

function genRound() {
  const total = 8; // pizza has 8 slices
  const numerator = Math.floor(Math.random() * (total - 1)) + 1;
  return { numerator, denominator: total };
}

export default function FractionPizzaSlice({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState({ numerator: 3, denominator: 8 });
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const SLICES = 8;

  const nextRound = useCallback((rnd: number) => {
    setTarget(genRound());
    setSelected(new Set());
    setFeedback(null);
    setRound(rnd);
  }, []);

  const startGame = () => {
    setScore(0);
    nextRound(0);
    setPhase("play");
  };

  const toggleSlice = (i: number) => {
    if (feedback !== null) return;
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(i)) s.delete(i);
      else s.add(i);
      return s;
    });
  };

  const handleConfirm = useCallback(() => {
    if (feedback !== null) return;
    const correct = selected.size === target.numerator;
    setFeedback(correct);
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
    }, 1000);
  }, [selected, target, feedback, score, round, nextRound, onGameEnd, config]);

  // Render pizza slices as SVG wedges
  const renderPizza = () => {
    const cx = 100;
    const cy = 100;
    const r = 90;
    const slices = Array.from({ length: SLICES }, (_, i) => {
      const startAngle = (((i * 360) / SLICES - 90) * Math.PI) / 180;
      const endAngle = ((((i + 1) * 360) / SLICES - 90) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const isSel = selected.has(i);
      return (
        <g
          key={i}
          role="button"
          tabIndex={0}
          data-ocid={`pizza.slice.${i + 1}`}
          onClick={() => toggleSlice(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleSlice(i);
          }}
          style={{ cursor: "pointer" }}
          aria-label={`Slice ${i + 1}`}
        >
          <path
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
            fill={isSel ? "#f59e0b" : "#1e293b"}
            stroke="#475569"
            strokeWidth="2"
            style={{ transition: "fill 0.15s" }}
          />
        </g>
      );
    });
    return (
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="#f59e0b22"
          stroke="#f59e0b44"
          strokeWidth="3"
        />
        {slices}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Fraction Pizza
            </h2>
            <p className="text-slate-300 mb-2">
              Click the correct number of pizza slices to match the fraction
              shown.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Each correct answer = +10 points.
            </p>
            <GlowButton onClick={startGame} data-ocid="pizza.start_button">
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
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            <p className="text-slate-400">Shade this fraction of the pizza:</p>
            <div className="text-5xl font-bold text-white flex flex-col items-center">
              <span style={{ color: "#f59e0b" }}>{target.numerator}</span>
              <div className="w-12 h-0.5 bg-white my-1" />
              <span>{target.denominator}</span>
            </div>
            {renderPizza()}
            {feedback !== null && (
              <p
                className="font-bold"
                style={{ color: feedback ? "#10b981" : "#f43f5e" }}
              >
                {feedback
                  ? "Correct!"
                  : `Wrong! You needed ${target.numerator} slice(s)`}
              </p>
            )}
            <GlowButton
              onClick={handleConfirm}
              data-ocid="pizza.confirm_button"
            >
              Confirm
            </GlowButton>
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
            <GlowButton onClick={startGame} data-ocid="pizza.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
