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

interface Enemy {
  id: number;
  value: number;
  x: number;
  speed: number;
  correct: boolean;
}

const DIFF = {
  1: { max: 20, speed: 0.15 },
  2: { max: 50, speed: 0.25 },
  3: { max: 99, speed: 0.4 },
};

function genProblem(max: number): { a: number; b: number; answer: number } {
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * Math.min(a, 10)) + 1;
  return { a, b, answer: a - b };
}

export default function SubtractionDefense({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const params = DIFF[(config.difficulty ?? 1) as 1 | 2 | 3];
  const {
    timeLeft,
    start: startTimer,
    pause: stopTimer,
  } = useGameTimer(60, () => endGame(scoreRef.current, livesRef.current));
  const nextId = useRef(0);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  livesRef.current = lives;
  scoreRef.current = score;

  const endGame = useCallback(
    (s: number, l: number) => {
      stopTimer();
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          Math.min(100, Math.round((s / 200) * 100)),
          60,
          l > 0,
        ),
      );
    },
    [stopTimer, onGameEnd, config],
  );

  const spawnWave = useCallback(
    (p: { a: number; b: number; answer: number }) => {
      const wrongs = new Set<number>();
      while (wrongs.size < 3) {
        const w =
          p.answer +
          (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
        if (w !== p.answer && w >= 0) wrongs.add(w);
      }
      const all = [p.answer, ...Array.from(wrongs)].sort(
        () => Math.random() - 0.5,
      );
      setEnemies(
        all.map((v, i) => ({
          id: nextId.current++,
          value: v,
          x: 5 + i * 22,
          speed: params.speed,
          correct: v === p.answer,
        })),
      );
    },
    [params.speed],
  );

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0)
      endGame(scoreRef.current, livesRef.current);
  }, [timeLeft, phase, endGame]);

  useEffect(() => {
    if (phase !== "play") return;
    const p = genProblem(params.max);
    setProblem(p);
    spawnWave(p);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const iv = setInterval(() => {
      setEnemies((prev) => {
        const updated = prev.map((e) => ({ ...e, x: e.x + e.speed }));
        const reached = updated.filter((e) => e.x > 95);
        if (reached.length > 0) {
          const nl = livesRef.current - reached.length;
          if (nl <= 0) {
            endGame(scoreRef.current, 0);
            return [];
          }
          livesRef.current = nl;
          setLives(nl);
          const p = genProblem(params.max);
          setProblem(p);
          spawnWave(p);
          return [];
        }
        return updated;
      });
    }, 50);
    return () => clearInterval(iv);
  }, [phase, spawnWave, params, endGame]);

  const shoot = useCallback(
    (id: number, correct: boolean) => {
      if (correct) {
        setScore((s) => {
          scoreRef.current = s + 10;
          return s + 10;
        });
        setEnemies([]);
        const p = genProblem(params.max);
        setProblem(p);
        setTimeout(() => spawnWave(p), 500);
      } else {
        setLives((l) => {
          const nl = l - 1;
          livesRef.current = nl;
          if (nl <= 0) endGame(scoreRef.current, 0);
          return nl;
        });
      }
    },
    [params.max, spawnWave, endGame],
  );

  const startGame = () => {
    setScore(0);
    setLives(3);
    setEnemies([]);
    setPhase("play");
    startTimer();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Subtraction Defense
            </h2>
            <p className="text-slate-300 mb-2">
              Enemies march toward your base. Click the one with the correct
              answer!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Correct shot = +10. Wrong shot = lose life. Don't let them reach
              your base!
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="sub-defense.start_button"
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
            <span className="text-2xl font-bold text-white">
              {problem.a} - {problem.b} = ?
            </span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                  />
                ))}
              </div>
              <span className="text-slate-300 font-mono">{timeLeft}s</span>
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#f43f5e]/40" />
            {enemies.map((e) => (
              <button
                type="button"
                key={e.id}
                data-ocid={`sub-defense.enemy.${e.id % 10}`}
                onClick={() => shoot(e.id, e.correct)}
                style={{
                  position: "absolute",
                  left: `${Math.min(e.x, 90)}%`,
                  top: "40%",
                  transform: "translateY(-50%)",
                }}
                className="w-14 h-14 rounded-lg border-2 border-[#f43f5e]/60 bg-[#f43f5e]/10 text-white font-bold hover:bg-[#f43f5e]/30 transition-colors"
              >
                {e.value}
              </button>
            ))}
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
            <GlowButton
              onClick={startGame}
              data-ocid="sub-defense.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
