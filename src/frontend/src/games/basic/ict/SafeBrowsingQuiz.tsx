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

interface Scenario {
  situation: string;
  choices: string[];
  correct: number;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    situation:
      'You receive an email asking for your account password to "verify your identity". What do you do?',
    choices: [
      "Reply with your password",
      "Ignore and delete the email",
      "Click the link to check",
      "Call the company directly using official contact info",
    ],
    correct: 3,
    explanation:
      "Legitimate companies never ask for passwords by email. Contact them directly.",
  },
  {
    situation:
      "A pop-up says your computer has a virus and to call a phone number immediately. What do you do?",
    choices: [
      "Call the number right away",
      "Close the browser tab",
      "Enter your credit card details",
      "Download the suggested software",
    ],
    correct: 1,
    explanation:
      "This is a tech support scam. Close the browser. No real antivirus works this way.",
  },
  {
    situation:
      "You want to buy something online. The site has no padlock icon and shows http://. What do you do?",
    choices: [
      "Buy anyway — looks fine",
      "Avoid it — no HTTPS means unsafe",
      "Enter only your email",
      "Share your card number carefully",
    ],
    correct: 1,
    explanation:
      "HTTPS encrypts your data. Never enter payment info on HTTP-only sites.",
  },
  {
    situation:
      'A friend sends you a link: "bit.ly/win-prize-2024". What should you do?',
    choices: [
      "Click it — your friend sent it",
      "Hover to check the real URL first",
      "Share it with others",
      "Immediately download what it offers",
    ],
    correct: 1,
    explanation:
      "Shortened URLs hide the real destination. Always check before clicking.",
  },
  {
    situation:
      "You use a public WiFi at a cafe to check your bank account. This is:",
    choices: [
      "Completely safe",
      "Risky — use a VPN or wait for private connection",
      "Fine if you use incognito mode",
      "Safe as long as you log out",
    ],
    correct: 1,
    explanation:
      "Public WiFi is unencrypted. Attackers can intercept traffic. Use VPN or mobile data.",
  },
  {
    situation:
      "A website asks you to create an account. Which password is safest?",
    choices: ["password123", "john1990", "Tr!ck#92Pl@y", "abc123"],
    correct: 2,
    explanation:
      "Strong passwords mix uppercase, lowercase, numbers and symbols.",
  },
  {
    situation:
      'You receive a text saying your package is held at customs: "Pay GHS 5 to release: link". What do you do?',
    choices: [
      "Pay immediately",
      "Ignore — it is a smishing scam",
      "Forward to family",
      "Call the number in the text",
    ],
    correct: 1,
    explanation:
      "This is smishing (SMS phishing). Verify through official courier websites only.",
  },
  {
    situation: "Which of these is the safest behavior when using social media?",
    choices: [
      "Share your home address for giveaways",
      "Use your full birthdate in your bio",
      "Keep your account private and limit personal info",
      "Accept all friend requests to grow your network",
    ],
    correct: 2,
    explanation:
      "Limiting personal info online reduces your risk of identity theft and stalking.",
  },
  {
    situation:
      "Your school email account gets hacked. What should you do first?",
    choices: [
      "Wait and see if it resolves",
      "Tell your friends",
      "Report it to your teacher/admin and change your password immediately",
      "Delete your account",
    ],
    correct: 2,
    explanation:
      "Immediate reporting allows admins to secure the account and prevent further damage.",
  },
  {
    situation: "You find a USB drive in the car park. What do you do?",
    choices: [
      "Plug it in to see what is on it",
      "Take it home and check it later",
      "Hand it to security — never plug in unknown drives",
      "Keep it for yourself",
    ],
    correct: 2,
    explanation:
      "Unknown USB drives can contain malware that runs automatically when plugged in.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SafeBrowsingQuiz({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);

  const startGame = () => {
    setScenarios(shuffle(SCENARIOS).slice(0, 10));
    setScore(0);
    setLives(3);
    setRound(0);
    setChosen(null);
    setPhase("play");
  };

  const handleChoice = useCallback(
    (idx: number) => {
      if (chosen !== null) return;
      const current = scenarios[round];
      const correct = idx === current.correct;
      setChosen(idx);
      setTimeout(() => {
        const ns = correct ? score + 10 : score;
        const nl = correct ? lives : lives - 1;
        setScore(ns);
        setLives(nl);
        const next = round + 1;
        if (nl <= 0 || next >= scenarios.length) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              ns > 0 ? Math.min(100, (ns / 100) * 100) : 0,
              0,
              ns >= 60,
            ),
          );
          return;
        }
        setRound(next);
        setChosen(null);
      }, 1500);
    },
    [chosen, scenarios, round, score, lives, onGameEnd, config],
  );

  const current = scenarios[round];
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Safe Browsing Quiz
            </h2>
            <p className="text-slate-300 mb-2">
              Real-world cybersecurity scenarios. Choose the safest action.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              10 scenarios. Each correct answer = +10 points.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="safebrowsing.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && current && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-slate-400">{round + 1}/10</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-6">
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 px-6 py-4">
              <p className="text-white leading-relaxed">{current.situation}</p>
            </div>
            {chosen !== null && (
              <div
                className={`w-full max-w-lg rounded-xl border px-4 py-3 text-sm ${
                  chosen === current.correct
                    ? "border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]"
                    : "border-[#f43f5e]/50 bg-[#f43f5e]/10 text-[#f43f5e]"
                }`}
              >
                {current.explanation}
              </div>
            )}
            <div className="w-full max-w-lg grid gap-2">
              {current.choices.map((choice, i) => (
                <button
                  key={i}
                  type="button"
                  data-ocid={`safebrowsing.choice.${i + 1}`}
                  onClick={() => handleChoice(i)}
                  disabled={chosen !== null}
                  className="w-full px-4 py-3 rounded-xl border text-left text-sm transition-all disabled:cursor-default"
                  style={{
                    borderColor:
                      chosen !== null
                        ? i === current.correct
                          ? "#10b981"
                          : chosen === i
                            ? "#f43f5e"
                            : "#ffffff15"
                        : "#ffffff22",
                    background:
                      chosen !== null
                        ? i === current.correct
                          ? "#10b98122"
                          : chosen === i
                            ? "#f43f5e22"
                            : "#ffffff05"
                        : "#ffffff08",
                    color: "#e2e8f0",
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Quiz Complete!
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">out of 100 possible points</p>
            <GlowButton
              onClick={startGame}
              data-ocid="safebrowsing.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
