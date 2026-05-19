import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useEffect, useCallback } from "react";
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

const KEYS = [
  { label: "A", key: "a" },
  { label: "S", key: "s" },
  { label: "D", key: "d" },
  { label: "F", key: "f" },
  { label: "J", key: "j" },
  { label: "K", key: "k" },
  { label: "L", key: "l" },
  { label: "Enter", key: "enter" },
  { label: "Space", key: " " },
  { label: "Shift", key: "shift" },
  { label: "Backspace", key: "backspace" },
  { label: "Tab", key: "tab" },
  { label: "Z", key: "z" },
  { label: "X", key: "x" },
  { label: "C", key: "c" },
];
const TOTAL_ROUNDS = 20;

export default function KeyMatchGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(KEYS[0]);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  const nextKey = useCallback(
    () => setCurrent(KEYS[Math.floor(Math.random() * KEYS.length)]),
    [],
  );

  const endGame = useCallback(
    (s: number, l: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          s > 0 ? Math.min(100, (s / (TOTAL_ROUNDS * 10)) * 100) : 0,
          0,
          s >= 100,
        ),
      );
    },
    [onGameEnd, config],
  );

  useEffect(() => {
    if (phase !== "play") return;
    const handler = (e: KeyboardEvent) => {
      const pressed = e.key.toLowerCase();
      const correct = pressed === current.key.toLowerCase();
      setFlash(correct ? "correct" : "wrong");
      setTimeout(() => {
        setFlash(null);
        const newRound = round + 1;
        const newScore = correct ? score + 10 : Math.max(0, score - 5);
        const newLives = correct ? lives : lives - 1;
        setScore(newScore);
        setLives(newLives);
        setRound(newRound);
        if (newLives <= 0 || newRound >= TOTAL_ROUNDS) {
          endGame(newScore, newLives);
          return;
        }
        nextKey();
      }, 400);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, current, round, score, lives, nextKey, endGame]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setRound(0);
    nextKey();
    setPhase("play");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Key Match
            </h2>
            <p className="text-slate-300 mb-2">
              Press the key shown on screen as fast as you can!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Correct = +10 pts. Wrong = -5 pts. 20 rounds total.
            </p>
            <GlowButton onClick={startGame} data-ocid="keymatch.start_button">
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
              {round}/{TOTAL_ROUNDS}
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
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            <p className="text-slate-400 text-sm">Press this key:</p>
            <div
              data-ocid="keymatch.key_display"
              className="w-40 h-40 rounded-2xl border-2 border-[#00f5ff]/50 bg-[#00f5ff]/10 flex items-center justify-center text-5xl font-bold transition-all"
              style={{
                background:
                  flash === "correct"
                    ? "#10b98122"
                    : flash === "wrong"
                      ? "#f43f5e22"
                      : undefined,
                borderColor:
                  flash === "correct"
                    ? "#10b981"
                    : flash === "wrong"
                      ? "#f43f5e"
                      : "#00f5ff88",
                color:
                  flash === "correct"
                    ? "#10b981"
                    : flash === "wrong"
                      ? "#f43f5e"
                      : "#00f5ff",
              }}
            >
              {current.label}
            </div>
            {flash && (
              <p
                className="text-lg font-bold"
                style={{ color: flash === "correct" ? "#10b981" : "#f43f5e" }}
              >
                {flash === "correct" ? "Correct!" : "Wrong!"}
              </p>
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
            <p className="text-slate-400 mb-6">
              points in {TOTAL_ROUNDS} rounds
            </p>
            <GlowButton onClick={startGame} data-ocid="keymatch.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
