import { GlowButton } from "@/components/ui/GlowButton";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const TARGETS = [
  "Hello World!",
  "CODE@2024",
  "SmartLearn#1",
  "ICT_Master!",
  "SHIFT+Win=Pro",
  "Type@Speed",
  "ABC_XYZ!",
  "Quest#Done",
];
const TOTAL = 8;

export default function ShiftKeyMaster({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const endGame = useCallback(
    (s: number) => {
      setPhase("over");
      onGameEnd(buildResult(config, s, 100, 0, s >= 60));
    },
    [onGameEnd, config],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const target = TARGETS[idx];
    setTyped(val);
    if (val === target) {
      const pts = target.length * 3;
      const ns = score + pts;
      setScore(ns);
      const next = idx + 1;
      if (next >= TOTAL) {
        endGame(ns);
        return;
      }
      setIdx(next);
      setTyped("");
    }
  };

  useEffect(() => {
    if (phase === "play") inputRef.current?.focus();
  }, [phase, idx]);

  const startGame = () => {
    setScore(0);
    setIdx(0);
    setTyped("");
    setPhase("play");
  };
  const target = TARGETS[idx] ?? "";

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Shift Key Master
            </h2>
            <p className="text-slate-300 mb-2">
              Type each target string exactly, including UPPERCASE and symbols.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Use Shift for capitals. {TOTAL} targets total.
            </p>
            <GlowButton onClick={startGame} data-ocid="shiftkey.start_button">
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
              {idx + 1}/{TOTAL}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
            <p className="text-slate-400 text-sm">Type this exactly:</p>
            <div className="text-3xl font-mono font-bold tracking-wider text-white bg-white/5 rounded-xl px-6 py-4 border border-white/10">
              {target}
            </div>
            <div className="flex gap-0 text-2xl font-mono">
              {target.split("").map((c, i) => (
                <span
                  key={i}
                  style={{
                    color:
                      i >= typed.length
                        ? "#475569"
                        : typed[i] === c
                          ? "#10b981"
                          : "#f43f5e",
                    borderBottom:
                      i >= typed.length
                        ? "2px solid transparent"
                        : typed[i] === c
                          ? "2px solid #10b981"
                          : "2px solid #f43f5e",
                  }}
                >
                  {c === " " ? "\u00B7" : c}
                </span>
              ))}
            </div>
            <input
              ref={inputRef}
              data-ocid="shiftkey.input"
              value={typed}
              onChange={handleInput}
              className="w-72 text-center text-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5ff]"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
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
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton onClick={startGame} data-ocid="shiftkey.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
