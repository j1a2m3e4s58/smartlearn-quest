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

interface PhishRound {
  content: string;
  label: string;
  isReal: boolean;
  hint: string;
}

const ROUNDS: PhishRound[] = [
  {
    content: "http://paypa1.com/secure/login",
    label: "URL",
    isReal: false,
    hint: '"paypa1" — the letter "l" replaced with "1"',
  },
  {
    content: "https://paypal.com/signin",
    label: "URL",
    isReal: true,
    hint: "Official PayPal domain with HTTPS",
  },
  {
    content: "From: support@amaz0n-verify.com",
    label: "Email",
    isReal: false,
    hint: '"amaz0n" and unofficial domain',
  },
  {
    content: "From: no-reply@amazon.com",
    label: "Email",
    isReal: true,
    hint: "Official Amazon domain",
  },
  {
    content: "http://google.com.phishing-site.ru/login",
    label: "URL",
    isReal: false,
    hint: "Domain ends in .ru, not google.com",
  },
  {
    content: "https://accounts.google.com/signin",
    label: "URL",
    isReal: true,
    hint: "Verified Google accounts subdomain",
  },
  {
    content: "Your account is SUSPENDED! Click here NOW: bit.ly/acc-fix",
    label: "Message",
    isReal: false,
    hint: "Urgency + shortened link = phishing",
  },
  {
    content: "Your order #48291 has shipped. Track at ups.com",
    label: "Message",
    isReal: true,
    hint: "No urgency, links to official site",
  },
  {
    content: "http://secure-bank-login.info/verify",
    label: "URL",
    isReal: false,
    hint: "No real bank uses .info for login",
  },
  {
    content: "https://online.hsbc.com/login",
    label: "URL",
    isReal: true,
    hint: "Bank subdomain on official domain",
  },
  {
    content: "WIN iPhone 15! You are the 1,000,000th visitor! Click now!",
    label: "Pop-up",
    isReal: false,
    hint: "Classic prize scam — too good to be true",
  },
  {
    content:
      "Update available for your Chrome browser. Download from chrome.google.com",
    label: "Notice",
    isReal: true,
    hint: "Links to official Google domain",
  },
  {
    content:
      "Your PayPal account needs verification: paypal.security-check.net",
    label: "Email",
    isReal: false,
    hint: "Subdomain trick — paypal is not the root domain",
  },
  {
    content: "Apple ID: verify your identity at appleid.apple.com",
    label: "Message",
    isReal: true,
    hint: "Official Apple ID subdomain",
  },
  {
    content:
      "Dear Customer, send your credit card number to verify: support@g00gle.net",
    label: "Email",
    isReal: false,
    hint: "No company asks for card number by email; fake domain",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function PhishingSpotter({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState<PhishRound[]>([]);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  const startGame = () => {
    setRounds(shuffle(ROUNDS).slice(0, 15));
    setScore(0);
    setLives(3);
    setRound(0);
    setChosen(null);
    setShowHint(false);
    setPhase("play");
  };

  const handleAnswer = useCallback(
    (guessReal: boolean) => {
      if (chosen !== null) return;
      const current = rounds[round];
      const correct = guessReal === current.isReal;
      setChosen(guessReal);
      setShowHint(true);
      setTimeout(() => {
        const ns = correct ? score + 10 : score;
        const nl = correct ? lives : lives - 1;
        setScore(ns);
        setLives(nl);
        const next = round + 1;
        if (nl <= 0 || next >= rounds.length) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              ns > 0 ? Math.min(100, (ns / 100) * 100) : 0,
              0,
              ns >= 80,
            ),
          );
          return;
        }
        setRound(next);
        setChosen(null);
        setShowHint(false);
      }, 1500);
    },
    [chosen, rounds, round, score, lives, onGameEnd, config],
  );

  const current = rounds[round];
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Phishing Spotter
            </h2>
            <p className="text-slate-300 mb-2">
              Is it REAL or FAKE? Identify phishing attempts.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Look at URLs, domains, and email addresses carefully. 15 rounds.
            </p>
            <GlowButton onClick={startGame} data-ocid="phishing.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && current && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-slate-400">{round + 1}/15</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              {current.label}
            </span>
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-mono text-sm text-[#00f5ff] break-all text-center">
              {current.content}
            </div>
            {showHint && (
              <div
                className={`w-full max-w-lg rounded-xl border px-4 py-3 text-sm text-center ${
                  chosen === current.isReal
                    ? "border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]"
                    : "border-[#f43f5e]/50 bg-[#f43f5e]/10 text-[#f43f5e]"
                }`}
              >
                {chosen === current.isReal ? "Correct! " : "Wrong! "}
                {current.hint}
              </div>
            )}
            <div className="flex gap-4 w-full max-w-lg">
              <button
                type="button"
                data-ocid="phishing.real_button"
                onClick={() => handleAnswer(true)}
                disabled={chosen !== null}
                className="flex-1 py-4 rounded-xl border-2 border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981] font-bold text-lg hover:bg-[#10b981]/20 transition-all disabled:opacity-50"
              >
                REAL
              </button>
              <button
                type="button"
                data-ocid="phishing.fake_button"
                onClick={() => handleAnswer(false)}
                disabled={chosen !== null}
                className="flex-1 py-4 rounded-xl border-2 border-[#f43f5e]/50 bg-[#f43f5e]/10 text-[#f43f5e] font-bold text-lg hover:bg-[#f43f5e]/20 transition-all disabled:opacity-50"
              >
                FAKE
              </button>
            </div>
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
            <p className="text-slate-400 mb-6">out of 150 possible</p>
            <GlowButton onClick={startGame} data-ocid="phishing.restart_button">
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
