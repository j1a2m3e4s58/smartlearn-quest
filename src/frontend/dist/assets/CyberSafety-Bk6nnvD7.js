import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, d as Lock, G as GlowButton, k as Shield, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { T as TriangleAlert } from "./triangle-alert-10AslQ5h.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
function HUDRow({
  score,
  lives,
  total,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: total }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Heart,
      {
        className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
      },
      `h-${i}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
  ] });
}
const PHISH_CARDS = [
  {
    id: 1,
    type: "phishing",
    category: "email",
    content: "Subject: URGENT! Your account will be SUSPENDED. Click: bit.ly/acct-fix NOW!",
    explanation: "Legitimate banks never send urgent suspension threats. Suspicious shortened URL is a key red flag.",
    redFlags: [
      "Urgency tactics",
      "Shortened suspicious URL",
      "CAPS LOCK intimidation"
    ]
  },
  {
    id: 2,
    type: "safe",
    category: "email",
    content: "Your order #12345 has shipped. Track at amazon.com/orders",
    explanation: "Official domain, no urgency, no credential requests. This is a safe order notification.",
    redFlags: []
  },
  {
    id: 3,
    type: "phishing",
    category: "url",
    content: "http://paypa1.com/secure-login",
    explanation: "Fake domain: paypa1 (number 1 replaces letter l) mimics PayPal. Also uses http not https.",
    redFlags: [
      "Number replacing letter in domain",
      "HTTP not HTTPS",
      "Mimics PayPal"
    ]
  },
  {
    id: 4,
    type: "safe",
    category: "url",
    content: "https://www.google.com",
    explanation: "HTTPS, verified domain, no suspicious characters. This is safe.",
    redFlags: []
  },
  {
    id: 5,
    type: "phishing",
    category: "popup",
    content: "VIRUS DETECTED on your PC! Download RemoveVirus.exe NOW to protect your data!",
    explanation: "Websites cannot detect viruses. This is scareware designed to trick you into installing malware.",
    redFlags: [
      "Websites cannot scan your PC",
      "Executable download push",
      "Fake urgency"
    ]
  },
  {
    id: 6,
    type: "safe",
    category: "email",
    content: "Your Netflix subscription renews on June 15. No action needed.",
    explanation: "No links, no urgency, no credential requests. This is a routine renewal notification.",
    redFlags: []
  },
  {
    id: 7,
    type: "phishing",
    category: "email",
    content: "Dear User, your 500GB free cloud storage expires tonight. Verify: cloudstore-promo.net/claim",
    explanation: "Too-good-to-be-true offer with a suspicious promotional domain that is not an official provider.",
    redFlags: [
      "Unrealistic free offer",
      "Unknown promo domain",
      "Time pressure"
    ]
  },
  {
    id: 8,
    type: "safe",
    category: "url",
    content: "https://accounts.google.com/signin",
    explanation: "Official Google subdomain with HTTPS. This is a legitimate Google sign-in page.",
    redFlags: []
  },
  {
    id: 9,
    type: "phishing",
    category: "url",
    content: "https://facebook.com.user-verify.xyz/login",
    explanation: "The actual domain is user-verify.xyz. Facebook.com appears as a subdomain — a common deception trick.",
    redFlags: [
      "Real domain is after last dot before path",
      "facebook.com is just a subdomain here",
      "Fake verify site"
    ]
  },
  {
    id: 10,
    type: "safe",
    category: "email",
    content: "Password reset requested for your account. If this wasn't you, ignore this email.",
    explanation: "Provides a safe opt-out, no forced link, no urgency. Likely legitimate.",
    redFlags: []
  },
  {
    id: 11,
    type: "phishing",
    category: "popup",
    content: "YOU ARE THE 1,000,000th VISITOR! Claim your iPhone 15 by entering your card details!",
    explanation: "Classic lottery scam. No legitimate site gives prizes for visitor counts.",
    redFlags: [
      "Lottery/prize scam",
      "Requests card details",
      "Too good to be true"
    ]
  },
  {
    id: 12,
    type: "safe",
    category: "url",
    content: "https://github.com/microsoft/vscode",
    explanation: "Verified GitHub domain with a well-known organization path. Completely safe.",
    redFlags: []
  },
  {
    id: 13,
    type: "phishing",
    category: "email",
    content: "IT Department: Your email quota is full. Login to expand: mail-server-fix.com/auth",
    explanation: "IT departments use your company domain, not third-party sites like mail-server-fix.com.",
    redFlags: [
      "Third-party domain for corporate IT",
      "Login credential request",
      "Impersonates IT department"
    ]
  },
  {
    id: 14,
    type: "safe",
    category: "email",
    content: "Hi James, attached is the meeting agenda for Thursday. See you then! - Sarah",
    explanation: "Personal, no links, no urgency, no credential requests. Normal personal communication.",
    redFlags: []
  },
  {
    id: 15,
    type: "phishing",
    category: "popup",
    content: "Adobe Flash Player is outdated. Update here to continue watching: flash-update.net",
    explanation: "Adobe Flash was discontinued in 2020. Any Flash update request is malware in disguise.",
    redFlags: [
      "Flash discontinued since 2020",
      "Unknown update domain",
      "Fake software update"
    ]
  }
];
function PhishingDetectorGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [deck] = reactExports.useState(
    () => [...PHISH_CARDS].sort(() => Math.random() - 0.5)
  );
  const [cardIdx, setCardIdx] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [showExplanation, setShowExplanation] = reactExports.useState(false);
  const [lastCorrect, setLastCorrect] = reactExports.useState(false);
  const [answered, setAnswered] = reactExports.useState(0);
  const [correctCount, setCorrectCount] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  const answeredRef = reactExports.useRef(0);
  const correctRef = reactExports.useRef(0);
  scoreRef.current = score;
  answeredRef.current = answered;
  correctRef.current = correctCount;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const accuracy = answeredRef.current > 0 ? correctRef.current / answeredRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          accuracy,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  function handleAnswer(guess) {
    if (flash !== "idle" || gameOverRef.current) return;
    const card2 = deck[cardIdx];
    const isCorrect = guess === card2.type;
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
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1600);
        return nl;
      });
    }
    setTimeout(() => {
      setFlash("idle");
      setShowExplanation(false);
      const next = cardIdx + 1;
      if (next >= deck.length) endGame(true);
      else setCardIdx(next);
    }, 1800);
  }
  const card = deck[cardIdx];
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "cyber_safety.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Phishing Detector"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Classify each email, URL, or popup as Phishing or Safe. Red flags are revealed after each answer." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "cyber_safety.start_button",
                  children: "Start Mission"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "cyber_safety.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HUDRow,
          {
            score,
            lives,
            total: config.livesCount,
            label: `${cardIdx}/${deck.length} cards`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, rotateY: 90 },
            animate: { opacity: 1, rotateY: 0 },
            exit: { opacity: 0, rotateY: -90 },
            transition: { duration: 0.3 },
            className: `glass-card rounded-2xl p-8 max-w-lg w-full border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-border/30"}`,
            "data-ocid": "cyber_safety.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded border border-border/40 text-muted-foreground font-mono text-xs uppercase", children: card.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Card ",
                  cardIdx + 1,
                  " of ",
                  deck.length
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-xl p-4 mb-4 text-sm leading-relaxed font-mono break-all", children: card.content }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showExplanation && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                  className: `rounded-lg p-3 mb-4 text-sm ${lastCorrect ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 mb-2", children: [
                      lastCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: card.explanation })
                    ] }),
                    card.redFlags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold mb-1 opacity-80", children: "Red Flags:" }),
                      card.redFlags.map((flag, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs opacity-80", children: [
                        "- ",
                        flag
                      ] }, `flag-${i}`))
                    ] })
                  ]
                }
              ) }),
              flash === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleAnswer("safe"),
                    className: "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border-2 border-[#10b981] text-[#10b981] font-bold uppercase text-sm tracking-wider hover:bg-[#10b981]/10 transition-smooth",
                    "data-ocid": "cyber_safety.safe_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
                      " Safe"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleAnswer("phishing"),
                    className: "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border-2 border-[#f43f5e] text-[#f43f5e] font-bold uppercase text-sm tracking-wider hover:bg-[#f43f5e]/10 transition-smooth",
                    "data-ocid": "cyber_safety.phishing_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
                      " Phishing"
                    ]
                  }
                )
              ] })
            ]
          },
          cardIdx
        ) }) })
      ]
    }
  );
}
const PASSWORD_SETS = [
  [
    {
      password: "abc",
      strength: 1,
      reason: "Only 3 chars, dictionary word, no complexity"
    },
    {
      password: "password1",
      strength: 2,
      reason: "Common word + single digit, very guessable"
    },
    {
      password: "Summer2023",
      strength: 3,
      reason: "Mixed case + digits but common word pattern"
    },
    {
      password: "S!mmer@2023",
      strength: 4,
      reason: "Substitution symbols + mixed case + digits"
    },
    {
      password: "X#9kPw!mZ@3qL",
      strength: 5,
      reason: "Random mix of all character types, long"
    }
  ],
  [
    {
      password: "123456",
      strength: 1,
      reason: "Sequential numbers - first guess of any attacker"
    },
    {
      password: "qwerty",
      strength: 2,
      reason: "Keyboard pattern, extremely common"
    },
    {
      password: "MyDog2022",
      strength: 3,
      reason: "Personal info + year, predictable pattern"
    },
    {
      password: "M!D0g@2022",
      strength: 4,
      reason: "Substitutions added but still based on personal info"
    },
    {
      password: "9Rx#L@pQ7!nW2",
      strength: 5,
      reason: "Long random string with all character types"
    }
  ]
];
function PasswordFortressGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [phase, setPhase] = reactExports.useState("rank");
  const [passwordSet] = reactExports.useState(
    () => PASSWORD_SETS[Math.floor(Math.random() * PASSWORD_SETS.length)]
  );
  const [ranking, setRanking] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [showResult, setShowResult] = reactExports.useState(false);
  const [criteria, setCriteria] = reactExports.useState({
    minLength: false,
    uppercase: false,
    number: false,
    symbol: false
  });
  const [customPassword, setCustomPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [crackTime, setCrackTime] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 88 : 60,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  function addToRanking(pw) {
    if (ranking.includes(pw)) return;
    setRanking((r) => [...r, pw]);
  }
  function checkRanking() {
    const correct = passwordSet.every((p, i) => {
      const rankedIdx = ranking.indexOf(p.password);
      return rankedIdx === i;
    });
    if (correct) {
      setScore((s) => s + 500 * config.difficulty);
      setPhase("create");
    } else {
      setShowResult(true);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 2e3);
        return nl;
      });
      setTimeout(() => {
        if (lives > 1) {
          setRanking([]);
          setShowResult(false);
        }
      }, 2e3);
    }
  }
  function updateCriteria(pw) {
    return {
      minLength: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw)
    };
  }
  function handlePasswordChange(val) {
    setCustomPassword(val);
    setCriteria(updateCriteria(val));
    setCrackTime(null);
  }
  function testPassword() {
    const c = updateCriteria(customPassword);
    const metCount = Object.values(c).filter(Boolean).length;
    const times = [
      "Instantly",
      "A few seconds",
      "A few hours",
      "Several years",
      "Centuries"
    ];
    setCrackTime(times[metCount]);
    if (metCount >= 4) {
      setScore((s) => s + 400 * config.difficulty);
      setTimeout(() => endGame(true), 2e3);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "password_fortress.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Password Fortress"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Rank 5 passwords from weakest to strongest, then build a strong password by meeting all security criteria." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "password_fortress.start_button",
                  children: "Start Challenge"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "password_fortress.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HUDRow,
          {
            score,
            lives,
            total: config.livesCount,
            label: phase === "rank" ? "Phase 1: Rank" : "Phase 2: Create"
          }
        ),
        phase === "rank" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Click passwords in order from",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e] font-bold", children: "weakest" }),
            " to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: "strongest" }),
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: passwordSet.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => addToRanking(entry.password),
              disabled: ranking.includes(entry.password),
              className: `text-left px-4 py-3 rounded-xl border font-mono text-sm transition-all ${ranking.includes(entry.password) ? "border-[#7c3aed]/50 bg-[#7c3aed]/10 opacity-60 cursor-default" : "border-border/40 hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/5"}`,
              "data-ocid": `password_fortress.password.${entry.password}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 text-muted-foreground", children: ranking.indexOf(entry.password) >= 0 ? `#${ranking.indexOf(entry.password) + 1}` : "" }),
                entry.password
              ]
            },
            entry.password
          )) }),
          showResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-sm text-[#f43f5e]", children: [
            "Incorrect order. Correct ranking shown below.",
            passwordSet.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-1", children: [
              i + 1,
              ". ",
              p.password,
              " — ",
              p.reason
            ] }, p.password))
          ] }),
          ranking.length === passwordSet.length && !showResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: checkRanking,
              "data-ocid": "password_fortress.check_button",
              children: "Check Ranking"
            }
          )
        ] }),
        phase === "create" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mb-3", children: "Build a strong password meeting all 4 criteria:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: customPassword,
                  onChange: (e) => handlePasswordChange(e.target.value),
                  placeholder: "Type your password...",
                  className: "flex-1 bg-background/60 border border-border/50 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#f59e0b]/70",
                  "data-ocid": "password_fortress.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword((s) => !s),
                  className: "px-3 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-smooth",
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(criteria).map(([key, met]) => {
              const labels = {
                minLength: "8+ characters",
                uppercase: "Uppercase letter",
                number: "Contains number",
                symbol: "Contains symbol"
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-2 p-2 rounded-lg text-sm ${met ? "bg-[#10b981]/10 text-[#10b981]" : "bg-muted/20 text-muted-foreground"}`,
                  children: [
                    met ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0" }),
                    labels[key]
                  ]
                },
                key
              );
            }) })
          ] }),
          crackTime && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              className: `p-3 rounded-lg text-sm text-center font-bold ${Object.values(criteria).every(Boolean) ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: [
                "Estimated crack time: ",
                crackTime
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: testPassword,
              disabled: !customPassword,
              "data-ocid": "password_fortress.test_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
                " Test Against Cracker"
              ]
            }
          )
        ] })
      ]
    }
  );
}
const ALERT_SCENARIOS = [
  {
    title: "Antivirus Alert",
    content: "THREAT DETECTED: Trojan.GenericKD.47283719 found in C:\\Users\\Downloads\\setup.exe. File quarantined automatically.",
    category: "Real Threat",
    actions: ["Quarantine File", "Ignore", "Delete and Run Full Scan"],
    correctAction: "Delete and Run Full Scan",
    explanation: "A detected trojan should be deleted and followed by a full scan to check for related infections."
  },
  {
    title: "System Scan Result",
    content: "Scan complete: 0 threats found. 128,432 files scanned. 2 cookies cleaned.",
    category: "False Positive",
    actions: ["Quarantine File", "Ignore", "Run Full Scan"],
    correctAction: "Ignore",
    explanation: "Clean scan result with only cookies cleaned. No real threat — cookies are not viruses."
  },
  {
    title: "Browser Extension Alert",
    content: "WARNING: Unknown extension 'QuickSearch Pro' is accessing all your browsing data and passwords.",
    category: "Suspicious",
    actions: ["Remove Extension", "Ignore", "Allow Permanently"],
    correctAction: "Remove Extension",
    explanation: "Unknown extensions with excessive permissions are suspicious and should be removed immediately."
  },
  {
    title: "Pop-up Alert",
    content: "YOUR COMPUTER IS INFECTED WITH 47 VIRUSES! Call 1-800-XXX-XXXX immediately to fix!",
    category: "False Positive",
    actions: ["Call the Number", "Ignore and Close", "Run Full Scan"],
    correctAction: "Ignore and Close",
    explanation: "This is a scareware pop-up. Websites cannot detect viruses. Close the browser tab and do NOT call."
  },
  {
    title: "File Integrity Alert",
    content: "System file C:\\Windows\\System32\\svchost.exe has been modified. Hash mismatch detected.",
    category: "Real Threat",
    actions: ["Quarantine File", "Ignore", "Restore from Backup"],
    correctAction: "Restore from Backup",
    explanation: "Core Windows system files should never be modified. A hash mismatch indicates a rootkit. Restore immediately."
  },
  {
    title: "Firewall Block",
    content: "Outbound connection blocked: app.exe attempting to connect to 185.220.101.47 on port 4444.",
    category: "Real Threat",
    actions: ["Allow Connection", "Quarantine app.exe", "Ignore"],
    correctAction: "Quarantine app.exe",
    explanation: "Port 4444 is commonly used by reverse shells and malware C2 connections. The app is likely infected."
  },
  {
    title: "Email Scan",
    content: "Email attachment 'invoice_2024.pdf.exe' blocked. Executable file disguised as PDF.",
    category: "Real Threat",
    actions: ["Open the File", "Delete and Scan", "Whitelist Sender"],
    correctAction: "Delete and Scan",
    explanation: "Double extensions (PDF.EXE) are a classic trick to disguise executables. Delete and run a scan."
  },
  {
    title: "Auto-Update Alert",
    content: "Windows Update requires restart to install Security Update KB5023696. Update rated Critical.",
    category: "False Positive",
    actions: [
      "Ignore Indefinitely",
      "Install Update",
      "Quarantine Update File"
    ],
    correctAction: "Install Update",
    explanation: "Critical Windows security updates should be installed promptly. This is a legitimate system alert."
  },
  {
    title: "USB Alert",
    content: "USB drive inserted contains autorun.inf file attempting to execute automatically.",
    category: "Suspicious",
    actions: ["Allow Autorun", "Block Autorun and Scan USB", "Ignore"],
    correctAction: "Block Autorun and Scan USB",
    explanation: "Autorun files on USB drives are a classic malware delivery method. Block and scan before accessing."
  },
  {
    title: "Memory Scan",
    content: "Unusual memory allocation pattern detected in process explorer.exe. Could indicate code injection.",
    category: "Suspicious",
    actions: ["Ignore", "Terminate and Investigate", "Whitelist Process"],
    correctAction: "Terminate and Investigate",
    explanation: "explorer.exe is a critical system process. Unusual memory patterns in it may indicate process hollowing."
  },
  {
    title: "Network Scan",
    content: "Port scan detected from internal IP 192.168.1.105. 1,247 ports scanned in 30 seconds.",
    category: "Suspicious",
    actions: ["Ignore", "Block IP and Investigate", "Allow Scan"],
    correctAction: "Block IP and Investigate",
    explanation: "Internal port scanning can indicate a compromised device being used for lateral movement."
  },
  {
    title: "Scheduled Task",
    content: "New scheduled task created: runs PowerShell script daily at 3AM from C:\\Temp\\update.ps1",
    category: "Real Threat",
    actions: ["Allow Task", "Remove Task and Scan", "Ignore"],
    correctAction: "Remove Task and Scan",
    explanation: "Malware often creates scheduled tasks for persistence. Scripts in Temp folder are highly suspicious."
  }
];
function VirusHunterGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [scenarios] = reactExports.useState(
    () => [...ALERT_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, config.difficulty === 1 ? 6 : config.difficulty === 2 ? 9 : 12)
  );
  const [idx, setIdx] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("classify");
  const [chosenCategory, setChosenCategory] = reactExports.useState(null);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 80 : 45,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const scenario = scenarios[idx];
  const categories = [
    "Real Threat",
    "False Positive",
    "Suspicious"
  ];
  const categoryColors = {
    "Real Threat": "#f43f5e",
    "False Positive": "#10b981",
    Suspicious: "#f59e0b"
  };
  function handleClassify(cat) {
    if (feedback) return;
    setChosenCategory(cat);
    const isCorrect = cat === scenario.category;
    if (isCorrect) {
      setPhase("action");
    } else {
      setFeedback("wrong");
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 2e3);
        return nl;
      });
      setTimeout(() => {
        if (livesRef.current > 0) {
          setFeedback(null);
          setChosenCategory(null);
        }
      }, 2e3);
    }
  }
  function handleAction(action) {
    if (feedback) return;
    const isCorrect = action === scenario.correctAction;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 300 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 2e3);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      setFeedback(null);
      setChosenCategory(null);
      setPhase("classify");
      const next = idx + 1;
      if (next >= scenarios.length) endGame(true);
      else setIdx(next);
    }, 2200);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "virus_hunter.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Virus Hunter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Security alerts appear. Classify each as Real Threat, False Positive, or Suspicious, then choose the correct response action." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "virus_hunter.start_button",
                  children: "Begin Triage"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "virus_hunter.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HUDRow,
          {
            score,
            lives,
            total: config.livesCount,
            label: `Alert ${idx + 1}/${scenarios.length}`
          }
        ),
        scenario && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-black text-foreground",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: scenario.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: phase === "classify" ? "Classify alert" : "Choose action" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm p-3 rounded-lg bg-muted/20 border border-border/40 leading-relaxed", children: scenario.content })
          ] }),
          phase === "classify" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleClassify(cat),
              className: "py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all hover:scale-105",
              style: {
                borderColor: `${categoryColors[cat]}66`,
                color: categoryColors[cat],
                background: `${categoryColors[cat]}10`
              },
              "data-ocid": `virus_hunter.classify.${cat.toLowerCase().replace(/ /g, "_")}`,
              children: cat
            },
            cat
          )) }),
          phase === "action" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Correct! This is a",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-bold",
                  style: { color: categoryColors[scenario.category] },
                  children: scenario.category
                }
              ),
              ". Now choose the best action:"
            ] }),
            scenario.actions.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleAction(action),
                disabled: !!feedback,
                className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${feedback && action === scenario.correctAction ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : "border-border/40 hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/5"}`,
                "data-ocid": `virus_hunter.action.${i + 1}`,
                children: action
              },
              action
            )),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: `p-3 rounded-lg text-sm ${feedback === "correct" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
                children: scenario.explanation
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const PROFILE_ITEMS = [
  {
    label: "Full Name",
    value: "Kwame Asante",
    isOvershared: false,
    reason: "Name is generally acceptable on social profiles."
  },
  {
    label: "Profile Photo",
    value: "School uniform photo",
    isOvershared: true,
    reason: "School uniform reveals which school you attend — a security risk."
  },
  {
    label: "Birthday",
    value: "March 12, 2008",
    isOvershared: true,
    reason: "Full birthdate is used for identity theft and account recovery questions."
  },
  {
    label: "School",
    value: "Accra Academy",
    isOvershared: true,
    reason: "School name combined with other info allows predators to locate children."
  },
  {
    label: "Phone Number",
    value: "+233 24 XXX XXXX",
    isOvershared: true,
    reason: "Phone numbers enable direct contact, SIM swapping, and tracking."
  },
  {
    label: "Location",
    value: "East Legon, Accra",
    isOvershared: true,
    reason: "Posting your neighbourhood enables stalking and targeted attacks."
  },
  {
    label: "Interests",
    value: "Football, coding, music",
    isOvershared: false,
    reason: "General interests are safe to share publicly."
  },
  {
    label: "Email",
    value: "kwame@gmail.com",
    isOvershared: false,
    reason: "A general email shown on a profile is normal and low risk."
  }
];
const PRIVACY_SETTINGS = [
  {
    id: "profile_visibility",
    label: "Profile Visibility",
    currentState: "Public — Everyone",
    secureState: "Friends Only",
    description: "Public profiles allow anyone to view your personal information."
  },
  {
    id: "location_sharing",
    label: "Location Sharing",
    currentState: "Always On",
    secureState: "Never / Off",
    description: "Constant location sharing reveals your physical whereabouts to all followers."
  },
  {
    id: "friend_list",
    label: "Friend List Visibility",
    currentState: "Public",
    secureState: "Only Me",
    description: "Visible friend lists help attackers map your social network."
  },
  {
    id: "tagged_photos",
    label: "Photo Tagging",
    currentState: "Anyone can tag",
    secureState: "Require approval",
    description: "Without approval, others can tag you in photos revealing your location and associations."
  },
  {
    id: "direct_messages",
    label: "Direct Messages From",
    currentState: "Everyone",
    secureState: "Friends Only",
    description: "Open DMs from strangers enable harassment and phishing attempts."
  },
  {
    id: "search_visibility",
    label: "Searchable By",
    currentState: "Email and Phone",
    secureState: "Name Only",
    description: "Allowing search by email/phone makes it easy for strangers to find you."
  },
  {
    id: "data_sharing",
    label: "Data Sharing with Apps",
    currentState: "All connected apps",
    secureState: "Manually approved only",
    description: "Uncontrolled app data sharing leaks your data to third-party advertisers."
  },
  {
    id: "online_status",
    label: "Online Status",
    currentState: "Visible to all",
    secureState: "Visible to friends only",
    description: "Broadcasting when you are online helps predators know when to approach."
  }
];
function PrivacyGuardianGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [settingsSecured, setSettingsSecured] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [identifiedOvershared, setIdentifiedOvershared] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [phase, setPhase] = reactExports.useState("settings");
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 55,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  function toggleSetting(id) {
    setSettingsSecured((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        setScore((s) => s + 100 * config.difficulty);
      }
      return next;
    });
  }
  function handleProfileItem(label, isOvershared) {
    if (identifiedOvershared.has(label)) return;
    if (isOvershared) {
      setIdentifiedOvershared((prev) => {
        const next = new Set(prev);
        next.add(label);
        return next;
      });
      setScore((s) => s + 150 * config.difficulty);
      const oversharedCount = PROFILE_ITEMS.filter(
        (p) => p.isOvershared
      ).length;
      if (identifiedOvershared.size + 1 >= oversharedCount)
        setTimeout(() => endGame(true), 1500);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1e3);
        return nl;
      });
    }
  }
  function proceedToIdentify() {
    const allSecured = PRIVACY_SETTINGS.every((s) => settingsSecured.has(s.id));
    if (allSecured) setPhase("identify");
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "privacy_guardian.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Shield,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#7c3aed" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Privacy Guardian"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Secure a social media profile by fixing privacy settings, then identify the overshared personal data items." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "privacy_guardian.start_button",
                  children: "Secure Profile"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "privacy_guardian.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HUDRow,
          {
            score,
            lives,
            total: config.livesCount,
            label: phase === "settings" ? "Phase 1: Settings" : "Phase 2: Identify"
          }
        ),
        phase === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Toggle each setting to its secure state:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex flex-col gap-2", children: PRIVACY_SETTINGS.map((setting) => {
            const secured = settingsSecured.has(setting.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSetting(setting.id),
                className: `text-left p-3 rounded-xl border transition-all ${secured ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-border/40 hover:border-[#7c3aed]/40"}`,
                "data-ocid": `privacy_guardian.setting.${setting.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: setting.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs font-bold ${secured ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                        children: secured ? setting.secureState : setting.currentState
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: setting.description })
                ]
              },
              setting.id
            );
          }) }),
          settingsSecured.size === PRIVACY_SETTINGS.length && /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "sm",
              onClick: proceedToIdentify,
              "data-ocid": "privacy_guardian.proceed_button",
              children: "All Settings Secured — Next Phase"
            }
          )
        ] }),
        phase === "identify" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Click each piece of",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e] font-bold", children: "overshared" }),
            " data on the profile. Avoid clicking safe items."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto grid grid-cols-2 gap-2", children: PROFILE_ITEMS.map((item) => {
            const found = identifiedOvershared.has(item.label);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleProfileItem(item.label, item.isOvershared),
                disabled: found,
                className: `text-left p-3 rounded-xl border transition-all text-sm ${found ? "border-[#f43f5e]/50 bg-[#f43f5e]/10 opacity-70" : "border-border/40 hover:border-[#f43f5e]/40 hover:bg-[#f43f5e]/5"}`,
                "data-ocid": `privacy_guardian.profile_item.${item.label.toLowerCase().replace(/ /g, "_")}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xs text-muted-foreground mb-1", children: item.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground", children: item.value }),
                  found && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#f43f5e] mt-1", children: item.reason })
                ]
              },
              item.label
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Found: ",
            identifiedOvershared.size,
            "/",
            PROFILE_ITEMS.filter((p) => p.isOvershared).length,
            " overshared items"
          ] })
        ] })
      ]
    }
  );
}
const SE_SCENARIOS = [
  {
    title: "IT Help Desk Impostor",
    sender: "it-support@company-helpdesk.net",
    message: "Hello, this is IT Support. We have detected unauthorized access to your account and need your password to verify your identity and secure it immediately. Please reply with your current password.",
    responses: [
      "Reply with your password",
      "Ask to verify through official channels",
      "Ignore and forward to real IT"
    ],
    correctResponse: "Ignore and forward to real IT",
    damageIfWrong: 35,
    explanation: "Legitimate IT staff NEVER ask for your password via email. Always contact IT through official channels and report suspicious requests."
  },
  {
    title: "Prize Winner Scam",
    sender: "prizes@win-notification.com",
    message: "Congratulations! You have been selected as our weekly winner of GH₵20,000 cash prize! To claim your reward, reply with your bank account number and mobile money PIN.",
    responses: [
      "Reply with bank details",
      "Call the number provided",
      "Delete and block sender"
    ],
    correctResponse: "Delete and block sender",
    damageIfWrong: 40,
    explanation: "Unsolicited prize notifications asking for financial details are always scams. No legitimate prize requires your PIN or account credentials."
  },
  {
    title: "Urgent Account Suspension",
    sender: "security@paypa1-verify.com",
    message: "URGENT: Your PayPal account has been suspended due to suspicious activity. You must verify your identity within 24 hours or your account will be permanently closed. Click here to verify.",
    responses: [
      "Click the link and verify",
      "Log in directly at paypal.com to check",
      "Provide verification details by reply"
    ],
    correctResponse: "Log in directly at paypal.com to check",
    damageIfWrong: 30,
    explanation: "Always navigate directly to the official site by typing the URL yourself. Never click links in urgent emails. The sender domain 'paypa1-verify.com' is fake."
  },
  {
    title: "CEO Fraud",
    sender: "ceo.name@company-business.net",
    message: "This is the CEO. I am in a meeting and cannot call. Please urgently transfer GH₵50,000 to account 1234567890 for a confidential business deal. Do not discuss with anyone.",
    responses: [
      "Transfer the money immediately",
      "Verify the request by calling the CEO directly",
      "Send an email confirming the transfer"
    ],
    correctResponse: "Verify the request by calling the CEO directly",
    damageIfWrong: 45,
    explanation: "CEO fraud (BEC scam) uses urgency and authority to bypass verification. Always call to confirm any financial transfer request using a known, trusted phone number."
  },
  {
    title: "Tech Support Vishing",
    sender: "Phone call from +1-800-MICROSOFT",
    message: "Hello, I am calling from Microsoft Technical Support. We have detected that your computer is sending error reports to our servers. I need remote access to fix the critical issue before your data is deleted.",
    responses: [
      "Give them remote access",
      "Hang up immediately",
      "Provide your Windows activation key"
    ],
    correctResponse: "Hang up immediately",
    damageIfWrong: 35,
    explanation: "Microsoft, Google, and Apple do NOT make unsolicited calls about computer problems. This is a vishing attack (voice phishing). Hang up and report it."
  }
];
function SocialEngineeringBossGame({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [bossHP, setBossHP] = reactExports.useState(100);
  const [playerHP, setPlayerHP] = reactExports.useState(100);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [chosenResponse, setChosenResponse] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 95 : 30,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const scenario = SE_SCENARIOS[idx];
  const hpPerBoss = Math.floor(100 / SE_SCENARIOS.length);
  function handleResponse(response) {
    if (feedback) return;
    setChosenResponse(response);
    const isCorrect = response === scenario.correctResponse;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 400 * config.difficulty);
      setBossHP((hp) => Math.max(0, hp - hpPerBoss));
    } else {
      setPlayerHP((hp) => Math.max(0, hp - scenario.damageIfWrong));
      if (playerHP - scenario.damageIfWrong <= 0) {
        setTimeout(() => endGame(false), 2200);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setChosenResponse(null);
      const next = idx + 1;
      if (next >= SE_SCENARIOS.length) {
        endGame(true);
        return;
      }
      setIdx(next);
    }, 2500);
  }
  const bossBarStyle = { width: `${bossHP}%`, background: "#f43f5e" };
  const playerBarStyle = {
    width: `${playerHP}%`,
    background: "#10b981"
  };
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "social_engineering.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-14 w-14 mx-auto mb-4 text-[#f43f5e]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Social Engineering Boss"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Attackers send realistic phishing emails and scam calls. Choose the right response to defeat each attacker before they steal your data." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    gameOverRef.current = false;
                    setGameStarted(true);
                  },
                  "data-ocid": "social_engineering.start_button",
                  children: "Begin Boss Battle"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "social_engineering.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1 max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Attacker HP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                bossHP,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: bossBarStyle
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your Defense" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                playerHP,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: playerBarStyle
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
            "Stage ",
            idx + 1,
            "/",
            SE_SCENARIOS.length
          ] })
        ] }),
        scenario && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-black text-[#f43f5e]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: scenario.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: scenario.sender })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-relaxed p-3 rounded-lg border border-border/30 bg-muted/10 italic", children: [
              '"',
              scenario.message,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Choose your response:" }),
            scenario.responses.map((resp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleResponse(resp),
                disabled: !!feedback,
                className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${feedback && resp === scenario.correctResponse ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : feedback && resp === chosenResponse && resp !== scenario.correctResponse ? "border-[#f43f5e] bg-[#f43f5e]/15 text-[#f43f5e]" : "border-border/40 hover:border-[#f43f5e]/40 hover:bg-[#f43f5e]/5"}`,
                "data-ocid": `social_engineering.response.${i + 1}`,
                children: resp
              },
              resp
            ))
          ] }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              className: `p-3 rounded-lg text-sm flex items-start gap-2 ${feedback === "correct" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: [
                feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: scenario.explanation })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function CyberSafety({ config, onGameEnd }) {
  const id = config.gameId;
  if (id === "password-fortress")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordFortressGame, { config, onGameEnd });
  if (id === "virus-hunter")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(VirusHunterGame, { config, onGameEnd });
  if (id === "privacy-guardian")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PrivacyGuardianGame, { config, onGameEnd });
  if (id === "social-engineering-boss")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SocialEngineeringBossGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PhishingDetectorGame, { config, onGameEnd });
}
export {
  CyberSafety as default
};
