import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useEffect, useRef } from "react";
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

const CRITERIA = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "Contains UPPERCASE letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "Contains a number (0-9)",
    test: (p: string) => /[0-9]/.test(p),
  },
  {
    id: "symbol",
    label: "Contains a symbol (!@#$%^&*)",
    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  },
];

export default function PasswordStrengthGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [password, setPassword] = useState("");
  const [won, setWon] = useState(false);
  const timeLimit =
    config.difficulty === 3 ? 20 : config.difficulty === 2 ? 30 : 45;
  const {
    timeLeft,
    start: startTimer,
    pause: stopTimer,
  } = useGameTimer(timeLimit, () => {
    setPhase("over");
    onGameEnd(
      buildResult(
        config,
        strength * 20,
        (strength / 4) * 100,
        timeLimit * 1000,
        false,
      ),
    );
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const passed = CRITERIA.map((c) => c.test(password));
  const strength = passed.filter(Boolean).length;

  useEffect(() => {
    if (phase !== "play") return;
    if (strength === 4) {
      stopTimer();
      setWon(true);
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          timeLeft * 5 + 100,
          100,
          (timeLimit - timeLeft) * 1000,
          true,
        ),
      );
    }
  }, [strength, phase]);

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0 && !won) {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          strength * 20,
          (strength / 4) * 100,
          timeLimit * 1000,
          false,
        ),
      );
    }
  }, [timeLeft, phase, won]);

  const startGame = () => {
    setPassword("");
    setWon(false);
    setPhase("play");
    startTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const strengthColors = [
    "#f43f5e",
    "#f59e0b",
    "#f59e0b",
    "#10b981",
    "#10b981",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Password Strength
            </h2>
            <p className="text-slate-300 mb-2">
              Create a password that meets ALL 4 security criteria before time
              runs out!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {timeLimit} seconds to build the perfect password.
            </p>
            <GlowButton onClick={startGame} data-ocid="password.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">
              Criteria Met: {strength}/4
            </span>
            <span
              className="text-slate-300 font-mono text-xl"
              style={{ color: timeLeft < 10 ? "#f43f5e" : "#94a3b8" }}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
            <input
              ref={inputRef}
              data-ocid="password.input"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password here..."
              className="w-full max-w-md text-center text-xl bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#00f5ff] font-mono"
              autoComplete="off"
            />
            <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(strength / 4) * 100}%`,
                  background: strengthColors[strength],
                }}
              />
            </div>
            <p
              className="font-bold"
              style={{ color: strengthColors[strength] }}
            >
              {strengthLabels[strength]}
            </p>
            <div className="w-full max-w-md grid gap-2">
              {CRITERIA.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${passed[i] ? "bg-[#10b981] border-[#10b981]" : "border-slate-600"}`}
                  >
                    {passed[i] && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${passed[i] ? "text-[#10b981]" : "text-slate-400"}`}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: won ? "#10b981" : "#f43f5e" }}
            >
              {won ? "Password Secured!" : "Time Up!"}
            </h2>
            <p className="text-4xl font-bold text-white mb-2">
              {won ? timeLeft * 5 + 100 : strength * 20}
            </p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton onClick={startGame} data-ocid="password.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
