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

function genNumbers(difficulty: number): number[] {
  const max = difficulty === 3 ? 999 : difficulty === 2 ? 99 : 20;
  const nums = new Set<number>();
  while (nums.size < 5) nums.add(Math.floor(Math.random() * max) + 1);
  return Array.from(nums);
}

export default function OrderingGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [ascending, setAscending] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const nextRound = useCallback(
    (rnd: number) => {
      const nums = genNumbers(config.difficulty ?? 1);
      const asc = rnd % 2 === 0;
      setNumbers(nums);
      setOrder([...nums].sort(() => Math.random() - 0.5));
      setAscending(asc);
      setFeedback(null);
      setRound(rnd);
    },
    [config.difficulty],
  );

  const startGame = () => {
    setScore(0);
    nextRound(0);
    setPhase("play");
  };

  const handleDrop = useCallback(
    (targetIdx: number) => {
      if (dragging === null) return;
      const newOrder = [...order];
      const fromIdx = newOrder.indexOf(dragging);
      newOrder.splice(fromIdx, 1);
      newOrder.splice(targetIdx, 0, dragging);
      setOrder(newOrder);
      setDragging(null);
    },
    [dragging, order],
  );

  const handleCheck = useCallback(() => {
    const sorted = [...order].sort((a, b) => (ascending ? a - b : b - a));
    const correct = order.every((n, i) => n === sorted[i]);
    setFeedback(correct);
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
    }, 1000);
  }, [order, ascending, score, round, nextRound, onGameEnd, config]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Number Ordering
            </h2>
            <p className="text-slate-300 mb-2">
              Drag tiles to put numbers in the correct order.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Ascending and descending alternate.
            </p>
            <GlowButton onClick={startGame} data-ocid="ordering.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-[#f59e0b] font-bold">
              {ascending
                ? "Ascending (smallest first)"
                : "Descending (largest first)"}
            </span>
            <span className="text-slate-400">
              {round + 1}/{TOTAL}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
            <div className="flex gap-3">
              {order.map((num, idx) => (
                <div
                  key={num}
                  data-ocid={`ordering.tile.${idx + 1}`}
                  draggable
                  onDragStart={() => setDragging(num)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className="w-16 h-16 rounded-xl border-2 border-[#00f5ff]/40 bg-[#00f5ff]/10 flex items-center justify-center text-white font-bold text-xl cursor-grab active:cursor-grabbing select-none"
                  style={{ opacity: dragging === num ? 0.5 : 1 }}
                >
                  {num}
                </div>
              ))}
            </div>
            {feedback !== null && (
              <p
                className="text-lg font-bold"
                style={{ color: feedback ? "#10b981" : "#f43f5e" }}
              >
                {feedback ? "Correct!" : "Try again next round!"}
              </p>
            )}
            <GlowButton onClick={handleCheck} data-ocid="ordering.check_button">
              Check Order
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
            <p className="text-slate-400 mb-6">out of {TOTAL * 20} possible</p>
            <GlowButton onClick={startGame} data-ocid="ordering.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
