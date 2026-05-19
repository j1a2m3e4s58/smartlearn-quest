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
const TARGET_ANGLES = [30, 45, 60, 90, 120, 150, 135, 75, 105, 165];

export default function AngleMeasure({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(45);
  const [userAngle, setUserAngle] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nextRound = useCallback(
    (rnd: number) => {
      const difficulty = config.difficulty ?? 1;
      const pool =
        difficulty === 3
          ? TARGET_ANGLES
          : difficulty === 2
            ? TARGET_ANGLES.slice(0, 8)
            : TARGET_ANGLES.slice(0, 6);
      setTarget(pool[rnd % pool.length]);
      setUserAngle(0);
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

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (feedback !== null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    if (angle > 180) angle = Math.max(0, Math.min(180, 360 - angle));
    setUserAngle(Math.round(angle));
  };

  const handleConfirm = useCallback(() => {
    if (feedback !== null) return;
    const correct = Math.abs(userAngle - target) <= 5;
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
  }, [userAngle, target, feedback, score, round, nextRound, onGameEnd, config]);

  const cx = 100;
  const cy = 140;
  const r = 90;
  // Static arm at 0 degrees (pointing right)
  const arm1x = cx + r;
  const arm1y = cy;
  // User-controlled arm
  const rad = ((userAngle - 90) * Math.PI) / 180;
  const arm2x = cx + r * Math.cos(rad);
  const arm2y = cy + r * Math.sin(rad);
  // Target arm
  const trad = ((target - 90) * Math.PI) / 180;
  const tax = cx + r * Math.cos(trad);
  const tay = cy + r * Math.sin(trad);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Angle Measure
            </h2>
            <p className="text-slate-300 mb-2">
              Move your mouse over the protractor to set the angle to match the
              target.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Within 5 degrees = correct. {TOTAL} rounds.
            </p>
            <GlowButton onClick={startGame} data-ocid="angle.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-[#f59e0b] font-bold">Target: {target}°</span>
            <span className="text-slate-400">
              {round + 1}/{TOTAL}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-slate-400 text-sm">
              Your angle:{" "}
              <span className="text-white font-bold">{userAngle}°</span>
            </p>
            <svg
              ref={svgRef}
              width="200"
              height="160"
              viewBox="0 0 200 160"
              onMouseMove={handleMouseMove}
              data-ocid="angle.protractor"
              className="cursor-crosshair"
            >
              {/* Protractor arc */}
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="#00f5ff11"
                stroke="#00f5ff44"
                strokeWidth="2"
              />
              <line
                x1={cx - r - 10}
                y1={cy}
                x2={cx + r + 10}
                y2={cy}
                stroke="#475569"
                strokeWidth="1"
              />
              {/* Degree marks */}
              {[30, 45, 60, 90, 120, 135, 150].map((deg) => {
                const a = ((deg - 90) * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={cx + (r - 8) * Math.cos(a)}
                    y1={cy + (r - 8) * Math.sin(a)}
                    x2={cx + (r + 4) * Math.cos(a)}
                    y2={cy + (r + 4) * Math.sin(a)}
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                );
              })}
              {/* Static base arm */}
              <line
                x1={cx}
                y1={cy}
                x2={arm1x}
                y2={arm1y}
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {/* Target arm (ghost) */}
              {feedback === null && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={tax}
                  y2={tay}
                  stroke="#f59e0b44"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}
              {/* User arm */}
              <line
                x1={cx}
                y1={cy}
                x2={arm2x}
                y2={arm2y}
                stroke={
                  feedback === null
                    ? "#00f5ff"
                    : feedback
                      ? "#10b981"
                      : "#f43f5e"
                }
                strokeWidth="3"
              />
              <circle cx={cx} cy={cy} r="4" fill="#00f5ff" />
            </svg>
            {feedback !== null && (
              <p
                className="font-bold"
                style={{ color: feedback ? "#10b981" : "#f43f5e" }}
              >
                {feedback
                  ? `Correct! (${userAngle}°)`
                  : `Off by ${Math.abs(userAngle - target)}°. Target was ${target}°`}
              </p>
            )}
            <GlowButton
              onClick={handleConfirm}
              data-ocid="angle.confirm_button"
            >
              Confirm Angle
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
            <GlowButton onClick={startGame} data-ocid="angle.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
