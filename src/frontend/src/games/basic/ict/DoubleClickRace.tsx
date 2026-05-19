import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const DIFF = { 1: 2500, 2: 1800, 3: 1200 };

export default function DoubleClickRace({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [target, setTarget] = useState<{
    id: number;
    x: number;
    y: number;
    label: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<"hit" | "miss" | null>(null);
  const spawnTime = DIFF[(config.difficulty ?? 1) as 1 | 2 | 3];
  const startRef = useRef(Date.now());
  const {
    timeLeft,
    start: startTimer,
    pause: stopTimer,
  } = useGameTimer(60, () => endGame(score, lives));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  livesRef.current = lives;
  scoreRef.current = score;

  const endGame = useCallback(
    (s: number, l: number) => {
      stopTimer();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          s > 0 ? Math.min(100, (s / 200) * 100) : 0,
          Date.now() - startRef.current,
          s >= 50,
        ),
      );
    },
    [stopTimer, onGameEnd, config],
  );

  const spawnTarget = useCallback(() => {
    const labels = [
      "File",
      "Open",
      "Select",
      "Launch",
      "Run",
      "Click Me",
      "Start",
      "Execute",
    ];
    setTarget({
      id: Date.now(),
      x: 10 + Math.random() * 75,
      y: 15 + Math.random() * 65,
      label: labels[Math.floor(Math.random() * labels.length)],
    });
    timeoutRef.current = setTimeout(() => {
      setTarget(null);
      setFeedback("miss");
      setTimeout(() => setFeedback(null), 500);
      const nl = livesRef.current - 1;
      if (nl <= 0) {
        endGame(scoreRef.current, 0);
        return;
      }
      livesRef.current = nl;
      setLives(nl);
      spawnTarget();
    }, spawnTime);
  }, [spawnTime, endGame]);

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0) endGame(score, lives);
  }, [timeLeft, phase]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setPhase("play");
    startTimer();
    spawnTarget();
  };

  const handleDoubleClick = () => {
    if (!target) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFeedback("hit");
    setTimeout(() => setFeedback(null), 300);
    setScore((s) => {
      scoreRef.current = s + 10;
      return s + 10;
    });
    setTarget(null);
    setTimeout(spawnTarget, 300);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Double-Click Race
            </h2>
            <p className="text-slate-300 mb-2">
              Double-click the highlighted target before it disappears!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Each hit = +10 points. Miss = lose 1 life.
            </p>
            <GlowButton onClick={startGame} data-ocid="dcr.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
            <span className="text-slate-300 font-mono">{timeLeft}s</span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            {feedback === "hit" && (
              <div className="absolute inset-0 bg-[#10b981]/10 transition-all" />
            )}
            {feedback === "miss" && (
              <div className="absolute inset-0 bg-[#f43f5e]/10 transition-all" />
            )}
            {target && (
              <button
                type="button"
                data-ocid="dcr.target"
                onDoubleClick={handleDoubleClick}
                style={{
                  position: "absolute",
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                }}
                className="px-5 py-3 rounded-xl border-2 border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff] font-bold text-lg shadow-lg shadow-[#00f5ff]/20 hover:bg-[#00f5ff]/20 select-none cursor-pointer"
              >
                {target.label}
              </button>
            )}
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Game Over
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton onClick={startGame} data-ocid="dcr.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
