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

const TOTAL = 10;

type ShapeType = "square" | "rectangle" | "triangle";

interface ShapeRound {
  type: ShapeType;
  sides: number[];
  answer: number;
  label: string;
}

function genRound(level: number): ShapeRound {
  const max = level === 3 ? 20 : level === 2 ? 12 : 8;
  const rand = (n: number) => Math.floor(Math.random() * (max - 1)) + 2;
  const r = Math.random();
  if (r < 0.33) {
    const s = rand(max);
    return {
      type: "square",
      sides: [s],
      answer: s * 4,
      label: `Square with side = ${s} cm`,
    };
  }
  if (r < 0.66) {
    const w = rand(max);
    const h = rand(max);
    return {
      type: "rectangle",
      sides: [w, h],
      answer: 2 * (w + h),
      label: `Rectangle with width = ${w} cm, height = ${h} cm`,
    };
  }
  const a = rand(max);
  const b = rand(max);
  const c = rand(max);
  return {
    type: "triangle",
    sides: [a, b, c],
    answer: a + b + c,
    label: `Triangle with sides ${a} cm, ${b} cm, ${c} cm`,
  };
}

const SHAPE_SVG: Record<ShapeType, (sides: number[]) => React.ReactNode> = {
  square: ([s]) => (
    <>
      <rect
        x="30"
        y="30"
        width="120"
        height="120"
        fill="#00f5ff11"
        stroke="#00f5ff"
        strokeWidth="2"
      />
      <text x="90" y="165" textAnchor="middle" fill="#94a3b8" fontSize="12">
        {s} cm
      </text>
      <text
        x="-90"
        y="-25"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="12"
        transform="rotate(-90)"
      >
        {s} cm
      </text>
    </>
  ),
  rectangle: ([w, h]) => (
    <>
      <rect
        x="20"
        y="40"
        width="140"
        height="90"
        fill="#00f5ff11"
        stroke="#00f5ff"
        strokeWidth="2"
      />
      <text x="90" y="148" textAnchor="middle" fill="#94a3b8" fontSize="12">
        {w} cm
      </text>
      <text
        x="-85"
        y="-155"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="12"
        transform="rotate(-90)"
      >
        {h} cm
      </text>
    </>
  ),
  triangle: ([a, b, c]) => (
    <>
      <polygon
        points="90,20 150,150 30,150"
        fill="#00f5ff11"
        stroke="#00f5ff"
        strokeWidth="2"
      />
      <text x="90" y="168" textAnchor="middle" fill="#94a3b8" fontSize="11">
        {b} cm
      </text>
      <text x="35" y="95" textAnchor="middle" fill="#94a3b8" fontSize="11">
        {a} cm
      </text>
      <text x="147" y="95" textAnchor="middle" fill="#94a3b8" fontSize="11">
        {c} cm
      </text>
    </>
  ),
};

export default function PerimeterCalculator({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState<ShapeRound>(genRound(1));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const level = config.difficulty ?? 1;

  const nextRound = useCallback(
    (rnd: number) => {
      setCurrent(genRound(level));
      setInput("");
      setFeedback(null);
      setRound(rnd);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [level],
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
      const correct = guess === current.answer;
      setFeedback(correct ? "correct" : "wrong");
      setTimeout(() => {
        const ns = correct ? score + 20 : score;
        setScore(ns);
        if (round + 1 >= TOTAL) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              Math.round((ns / (TOTAL * 20)) * 100),
              0,
              ns >= 100,
            ),
          );
          return;
        }
        nextRound(round + 1);
      }, 800);
    },
    [input, current, feedback, score, round, nextRound, onGameEnd, config],
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Perimeter Calculator
            </h2>
            <p className="text-slate-300 mb-2">
              Calculate the perimeter of each shape using its side measurements.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Each correct = +20 pts. Perimeter = sum of all
              sides.
            </p>
            <GlowButton onClick={startGame} data-ocid="perimeter.start_button">
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
            <p className="text-slate-400 text-sm">{current.label}</p>
            <svg width="180" height="180" viewBox="0 0 180 180">
              {SHAPE_SVG[current.type](current.sides)}
            </svg>
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <label htmlFor="perimeter-input" className="text-slate-300">
                Perimeter =
              </label>
              <input
                ref={inputRef}
                id="perimeter-input"
                data-ocid="perimeter.input"
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-24 text-center text-xl bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f5ff]"
                autoComplete="off"
              />
              <span className="text-slate-400">cm</span>
              <button
                type="submit"
                data-ocid="perimeter.submit_button"
                className="px-4 py-2 rounded-xl bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] font-bold hover:bg-[#00f5ff]/20 transition-all"
              >
                Check
              </button>
            </form>
            {feedback && (
              <p
                className="font-bold"
                style={{
                  color: feedback === "correct" ? "#10b981" : "#f43f5e",
                }}
              >
                {feedback === "correct"
                  ? `Correct! ${current.answer} cm`
                  : `Wrong! The answer is ${current.answer} cm`}
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
            <p className="text-slate-400 mb-6">out of {TOTAL * 20} possible</p>
            <GlowButton
              onClick={startGame}
              data-ocid="perimeter.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
