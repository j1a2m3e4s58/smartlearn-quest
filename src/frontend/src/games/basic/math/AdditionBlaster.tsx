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

interface Bubble {
  id: number;
  value: number;
  x: number;
  y: number;
  speed: number;
}

const DIFF = {
  1: { max: 20, spawnInterval: 2000 },
  2: { max: 50, spawnInterval: 1500 },
  3: { max: 99, spawnInterval: 1200 },
};

function genProblem(max: number): { a: number; b: number; answer: number } {
  const a = Math.floor(Math.random() * Math.floor(max / 2)) + 1;
  const b = Math.floor(Math.random() * Math.floor(max / 2)) + 1;
  return { a, b, answer: a + b };
}

export default function AdditionBlaster({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
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

  const newProblem = useCallback(() => {
    const p = genProblem(params.max);
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const w =
        p.answer +
        (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      if (w !== p.answer && w > 0) wrongs.add(w);
    }
    const vals = [...Array.from(wrongs), p.answer].sort(
      () => Math.random() - 0.5,
    );
    setBubbles(
      vals.map((v, i) => ({
        id: nextId.current++,
        value: v,
        x: 10 + i * 20 + Math.random() * 10,
        y: 90,
        speed: 0.3 + Math.random() * 0.2,
      })),
    );
    setProblem(p);
  }, [params.max]);

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0)
      endGame(scoreRef.current, livesRef.current);
  }, [timeLeft, phase, endGame]);

  useEffect(() => {
    if (phase !== "play") return;
    const iv = setInterval(() => {
      setBubbles((prev) => {
        const updated = prev.map((b) => ({ ...b, y: b.y - b.speed }));
        const escaped = updated.filter((b) => b.y < -5);
        if (escaped.length > 0) {
          const nl = livesRef.current - escaped.length;
          if (nl <= 0) {
            endGame(scoreRef.current, 0);
            return [];
          }
          livesRef.current = nl;
          setLives(nl);
          newProblem();
          return [];
        }
        return updated;
      });
    }, 50);
    return () => clearInterval(iv);
  }, [phase, newProblem, endGame]);

  const handleClick = useCallback(
    (b: Bubble) => {
      if (b.value === problem.answer) {
        setScore((s) => {
          scoreRef.current = s + 10;
          return s + 10;
        });
        newProblem();
      } else {
        setLives((l) => {
          const nl = l - 1;
          livesRef.current = nl;
          if (nl <= 0) endGame(scoreRef.current, 0);
          return nl;
        });
      }
    },
    [problem.answer, newProblem, endGame],
  );

  const startGame = () => {
    setScore(0);
    setLives(3);
    setPhase("play");
    startTimer();
    setTimeout(newProblem, 100);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Addition Blaster
            </h2>
            <p className="text-slate-300 mb-2">
              Click the bubble with the correct answer before it floats away!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              60 seconds. Each correct hit = +10 pts. Escape or wrong = lose
              life.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="addition-blaster.start_button"
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
              {problem.a} + {problem.b} = ?
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
            {bubbles.map((b) => (
              <button
                key={b.id}
                type="button"
                data-ocid={`addition-blaster.bubble.${b.id % 10}`}
                onClick={() => handleClick(b)}
                style={{
                  position: "absolute",
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="w-16 h-16 rounded-full border-2 border-[#00f5ff]/60 bg-[#00f5ff]/10 text-white font-bold text-lg hover:bg-[#00f5ff]/30 transition-colors shadow-lg shadow-[#00f5ff]/10"
              >
                {b.value}
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
              data-ocid="addition-blaster.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
