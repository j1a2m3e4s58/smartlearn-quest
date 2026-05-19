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

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  born: number;
  lifetime: number;
}

const DIFF = {
  1: { spawnInterval: 3000, lifetime: 2000, count: 1 },
  2: { spawnInterval: 2000, lifetime: 1800, count: 2 },
  3: { spawnInterval: 1500, lifetime: 1500, count: 3 },
};

export default function ClickTargetGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [targets, setTargets] = useState<Target[]>([]);
  const [hit, setHit] = useState<number | null>(null);
  const nextId = useRef(0);
  const params = DIFF[(config.difficulty ?? 1) as 1 | 2 | 3];
  const startRef = useRef(Date.now());
  const {
    timeLeft,
    start: startTimer,
    pause: stopTimer,
  } = useGameTimer(60, () => endGame(score, lives));
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const endGame = useCallback(
    (s: number, l: number) => {
      stopTimer();
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

  useEffect(() => {
    if (phase !== "play") return;
    if (timeLeft <= 0) {
      endGame(score, lives);
      return;
    }
  }, [timeLeft, phase, score, lives, endGame]);

  useEffect(() => {
    if (phase !== "play") return;
    const spawn = () => {
      const arena = document.getElementById("click-arena");
      if (!arena) return;
      const { width, height } = arena.getBoundingClientRect();
      const newTargets: Target[] = [];
      for (let i = 0; i < params.count; i++) {
        const size = 60 + Math.random() * 30;
        newTargets.push({
          id: nextId.current++,
          x: size / 2 + Math.random() * (width - size),
          y: size / 2 + Math.random() * (height - size),
          size,
          born: Date.now(),
          lifetime: params.lifetime,
        });
      }
      setTargets((prev) => [...prev, ...newTargets]);
    };
    spawn();
    const iv = setInterval(spawn, params.spawnInterval);
    return () => clearInterval(iv);
  }, [phase, params]);

  useEffect(() => {
    if (phase !== "play") return;
    const iv = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => {
        const expired = prev.filter((t) => now - t.born >= t.lifetime);
        if (expired.length > 0) {
          const newLives = livesRef.current - expired.length;
          if (newLives <= 0) {
            endGame(score, 0);
            return [];
          }
          livesRef.current = newLives;
          setLives(newLives);
        }
        return prev.filter((t) => now - t.born < t.lifetime);
      });
    }, 100);
    return () => clearInterval(iv);
  }, [phase, score, endGame]);

  const handleClick = (id: number) => {
    setHit(id);
    setTimeout(() => setHit(null), 200);
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => s + 10);
  };

  const startGame = () => {
    setPhase("play");
    setScore(0);
    setLives(3);
    setTargets([]);
    startTimer();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Click Target
            </h2>
            <p className="text-slate-300 mb-2">
              Circles appear and shrink. Click them before they vanish!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Each hit = +10 points. Each miss = 1 life lost. 3 lives total.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="click-target.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold text-lg">
              Score: {score}
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
            <span className="text-slate-300 font-mono">{timeLeft}s</span>
          </div>
          <div
            id="click-arena"
            className="relative flex-1 overflow-hidden cursor-crosshair"
          >
            {targets.map((t) => {
              const progress = Math.max(
                0,
                1 - (Date.now() - t.born) / t.lifetime,
              );
              return (
                <button
                  key={t.id}
                  type="button"
                  data-ocid={`click-target.target.${t.id}`}
                  onClick={() => handleClick(t.id)}
                  style={{
                    position: "absolute",
                    left: t.x - (t.size * progress) / 2,
                    top: t.y - (t.size * progress) / 2,
                    width: t.size * progress,
                    height: t.size * progress,
                    borderRadius: "50%",
                    background:
                      hit === t.id
                        ? "#10b981"
                        : "radial-gradient(circle, #00f5ff 0%, #0088aa 60%, transparent 100%)",
                    border: "2px solid #00f5ff88",
                    transition: "background 0.1s",
                    boxShadow: "0 0 20px #00f5ff66",
                  }}
                />
              );
            })}
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Game Over
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton
              onClick={startGame}
              data-ocid="click-target.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
