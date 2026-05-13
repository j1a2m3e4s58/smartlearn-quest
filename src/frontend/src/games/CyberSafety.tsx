import { GlowButton } from "@/components/ui/GlowButton";
import {
  AlertTriangle,
  CheckCircle,
  Heart,
  Shield,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "./GameEngine";

interface Card {
  id: number;
  type: "phishing" | "safe";
  category: "email" | "url" | "popup";
  content: string;
  explanation: string;
}

const CARD_DECK: Card[] = [
  {
    id: 1,
    type: "phishing",
    category: "email",
    content:
      "Subject: URGENT! Your account will be SUSPENDED. Click: bit.ly/acct-fix NOW!",
    explanation:
      "Legitimate banks never send urgent suspension threats. Suspicious URL is a giveaway.",
  },
  {
    id: 2,
    type: "safe",
    category: "email",
    content: "Your order #12345 has shipped. Track at amazon.com/orders",
    explanation:
      "Official domain, no urgency, no credential requests. This is safe.",
  },
  {
    id: 3,
    type: "phishing",
    category: "url",
    content: "http://paypa1.com/secure-login",
    explanation:
      "Fake domain: paypa1 (number 1) mimics paypal. Also uses http not https.",
  },
  {
    id: 4,
    type: "safe",
    category: "url",
    content: "https://www.google.com",
    explanation:
      "HTTPS, verified domain, no suspicious characters. This is safe.",
  },
  {
    id: 5,
    type: "phishing",
    category: "popup",
    content:
      "VIRUS DETECTED on your PC! Download RemoveVirus.exe NOW to protect your data!",
    explanation:
      "Websites cannot detect viruses. This is a scareware popup designed to install malware.",
  },
  {
    id: 6,
    type: "safe",
    category: "email",
    content: "Your Netflix subscription renews on June 15. No action needed.",
    explanation:
      "No links, no urgency, no credential requests. Routine notification.",
  },
  {
    id: 7,
    type: "phishing",
    category: "email",
    content:
      "Dear User, your 500GB free cloud storage expires tonight. Verify: cloudstore-promo.net/claim",
    explanation:
      "Too-good-to-be-true offer with a suspicious promotional domain.",
  },
  {
    id: 8,
    type: "safe",
    category: "url",
    content: "https://accounts.google.com/signin",
    explanation:
      "Official Google subdomain with HTTPS. This is a legitimate sign-in page.",
  },
  {
    id: 9,
    type: "phishing",
    category: "url",
    content: "https://facebook.com.user-verify.xyz/login",
    explanation:
      "The real domain is user-verify.xyz, not facebook.com. A common deception trick.",
  },
  {
    id: 10,
    type: "safe",
    category: "email",
    content:
      "Password reset requested for your account. If not you, ignore this email.",
    explanation:
      "No link forced, no urgency. Gives user safe opt-out. Likely legitimate.",
  },
  {
    id: 11,
    type: "phishing",
    category: "popup",
    content:
      "YOU ARE THE 1,000,000th VISITOR! Claim your iPhone 15 by entering your card details!",
    explanation:
      "Classic lottery scam. No legitimate site gives prizes for visitor counts.",
  },
  {
    id: 12,
    type: "safe",
    category: "url",
    content: "https://github.com/microsoft/vscode",
    explanation:
      "Verified GitHub domain with a well-known organization. Completely safe.",
  },
  {
    id: 13,
    type: "phishing",
    category: "email",
    content:
      "IT Department: Your email quota is full. Login to expand: mail-server-fix.com/auth",
    explanation:
      "IT departments use your company domain, not third-party sites.",
  },
  {
    id: 14,
    type: "safe",
    category: "email",
    content:
      "Hi James, attached is the meeting agenda for Thursday. See you then! - Sarah",
    explanation:
      "Personal, no links, no urgency, no credential requests. Normal communication.",
  },
  {
    id: 15,
    type: "phishing",
    category: "popup",
    content:
      "Adobe Flash Player is outdated. Update here to continue watching: flash-update.net",
    explanation:
      "Adobe Flash was discontinued in 2020. Any Flash update request is malware.",
  },
];

type FlashState = "idle" | "correct" | "wrong";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function CyberSafety({ config, onGameEnd }: Props) {
  const [gameStarted, setGameStarted] = useState(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<FlashState>("idle");
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const answeredRef = useRef(answered);
  const correctRef = useRef(correctCount);
  scoreRef.current = score;
  answeredRef.current = answered;
  correctRef.current = correctCount;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const accuracy =
        answeredRef.current > 0
          ? (correctRef.current / answeredRef.current) * 100
          : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed),
      );
    },
    [config, onGameEnd],
  );

  function handleStart() {
    const shuffled = [...CARD_DECK].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCardIdx(0);
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
  }

  function handleAnswer(guess: "phishing" | "safe") {
    if (flash !== "idle" || gameOverRef.current) return;
    const card = deck[cardIdx];
    const isCorrect = guess === card.type;
    setAnswered((a) => a + 1);
    setLastCorrect(isCorrect);
    setShowExplanation(true);
    if (isCorrect) {
      setScore((s) => s + 200);
      setCorrectCount((c) => c + 1);
      setFlash("correct");
    } else {
      setFlash("wrong");
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) {
          setTimeout(() => endGame(false), 1600);
        }
        return newL;
      });
    }
    setTimeout(() => {
      setFlash("idle");
      setShowExplanation(false);
      const nextIdx = cardIdx + 1;
      if (nextIdx >= deck.length) {
        endGame(true);
      } else {
        setCardIdx(nextIdx);
      }
    }, 1600);
  }

  const card = deck[cardIdx];
  const categoryIcon: Record<Card["category"], React.ReactNode> = {
    email: <span className="text-xs">EMAIL</span>,
    url: <span className="text-xs">URL</span>,
    popup: <span className="text-xs">POPUP</span>,
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="cyber_safety.page"
    >
      {/* HUD */}
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Shield className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length heart row, positional index is stable
              key={`heart-${i}`}
              className={`h-4 w-4 ${
                i < lives
                  ? "text-[#f43f5e] fill-[#f43f5e]"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {cardIdx}/{deck.length} cards
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
          >
            <Shield className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Cyber Safety
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Identify phishing threats vs safe content. Protect the network —
              one card at a time.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="cyber_safety.start_button"
            >
              Start Mission
            </GlowButton>
          </motion.div>
        ) : card ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIdx}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.3 }}
              className={`glass-card rounded-2xl p-8 max-w-lg w-full border-2 transition-all ${
                flash === "correct"
                  ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  : flash === "wrong"
                    ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                    : "border-border/30"
              }`}
              data-ocid="cyber_safety.card"
            >
              {/* Category badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 rounded border border-border/40 text-muted-foreground font-mono text-xs">
                  {categoryIcon[card.category]}
                </span>
                <span className="text-xs text-muted-foreground">
                  Card {cardIdx + 1} of {deck.length}
                </span>
              </div>

              {/* Content */}
              <div className="glass rounded-xl p-4 mb-6 text-sm leading-relaxed font-mono break-all">
                {card.content}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-lg p-3 mb-4 text-sm flex items-start gap-2 ${
                      lastCorrect
                        ? "bg-[#10b981]/10 text-[#10b981]"
                        : "bg-[#f43f5e]/10 text-[#f43f5e]"
                    }`}
                  >
                    {lastCorrect ? (
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span>{card.explanation}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              {flash === "idle" && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleAnswer("safe")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border-2 border-[#10b981] text-[#10b981] font-bold uppercase text-sm tracking-wider hover:bg-[#10b981]/10 transition-smooth"
                    data-ocid="cyber_safety.safe_button"
                  >
                    <CheckCircle className="h-4 w-4" /> Safe
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer("phishing")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border-2 border-[#f43f5e] text-[#f43f5e] font-bold uppercase text-sm tracking-wider hover:bg-[#f43f5e]/10 transition-smooth"
                    data-ocid="cyber_safety.phishing_button"
                  >
                    <AlertTriangle className="h-4 w-4" /> Phishing
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
