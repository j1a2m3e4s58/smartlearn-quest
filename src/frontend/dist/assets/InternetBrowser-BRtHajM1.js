import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, k as Shield, m as motion, G as GlowButton, n as AnimatePresence, d as Lock, C as ChevronRight } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { S as Search } from "./search-D7BVAEw1.js";
import { G as Globe } from "./globe-xjd47iwo.js";
import { R as RotateCcw } from "./rotate-ccw-D8U3V_vs.js";
import { T as TriangleAlert } from "./triangle-alert-10AslQ5h.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const BROWSER_TASKS = [
  {
    id: "t1",
    type: "url_safety",
    instruction: "Which URL is SAFE to visit?",
    hint: "HTTPS and recognizable domain names are safer.",
    options: [
      { label: "https://www.google.com", value: "a", correct: true },
      { label: "http://g00gle-login.xyz/signin", value: "b", correct: false },
      {
        label: "http://192.168.1.1/phishing?id=99",
        value: "c",
        correct: false
      },
      { label: "https://free-money-now.biz", value: "d", correct: false }
    ]
  },
  {
    id: "t2",
    type: "navigate",
    instruction: "You want to clear your browser history. Which menu should you open?",
    hint: "Browser settings control history, privacy and extensions.",
    options: [
      { label: "File Menu", value: "a", correct: false },
      { label: "View Menu", value: "b", correct: false },
      { label: "Settings / History Menu", value: "c", correct: true },
      { label: "Help Menu", value: "d", correct: false }
    ]
  },
  {
    id: "t3",
    type: "phishing",
    instruction: "Spot the phishing email link. Which one should you NOT click?",
    hint: "Hover over links before clicking. Mis-spelled domains are phishing signs.",
    options: [
      {
        label: "https://accounts.google.com/reset",
        value: "a",
        correct: false
      },
      {
        label: "https://paypa1-security-alert.com/verify",
        value: "b",
        correct: true
      },
      {
        label: "https://support.microsoft.com/help",
        value: "c",
        correct: false
      },
      { label: "https://www.ghana.gov.gh/student", value: "d", correct: false }
    ]
  },
  {
    id: "t4",
    type: "find_setting",
    instruction: "A website wants to use your microphone. Where do you manage this?",
    hint: "Site permissions live inside browser Settings > Privacy & Security.",
    options: [
      { label: "Desktop Taskbar Settings", value: "a", correct: false },
      {
        label: "Browser Site Permissions (Settings > Privacy)",
        value: "b",
        correct: true
      },
      { label: "Windows Device Manager", value: "c", correct: false },
      { label: "Antivirus Software", value: "d", correct: false }
    ]
  },
  {
    id: "t5",
    type: "url_safety",
    instruction: "You see the padlock icon is BROKEN / red. What does this mean?",
    hint: "A broken padlock means the connection is not encrypted.",
    options: [
      { label: "The page is loading slowly", value: "a", correct: false },
      {
        label: "The connection is NOT secure — avoid entering personal data",
        value: "b",
        correct: true
      },
      { label: "Your internet is disconnected", value: "c", correct: false },
      { label: "The website is premium content", value: "d", correct: false }
    ]
  },
  {
    id: "t6",
    type: "navigate",
    instruction: "How do you open a link in a new tab without losing the current page?",
    hint: "Right-click context menus reveal extra browser options.",
    options: [
      { label: "Type the URL in the same bar", value: "a", correct: false },
      { label: "Press Alt + F4", value: "b", correct: false },
      {
        label: 'Right-click the link and select "Open in new tab"',
        value: "c",
        correct: true
      },
      { label: "Bookmark the page first", value: "d", correct: false }
    ]
  },
  {
    id: "t7",
    type: "form_fill",
    instruction: "Which password meets STRONG security requirements?",
    hint: "Strong passwords combine uppercase, lowercase, numbers, and symbols.",
    options: [
      { label: "password123", value: "a", correct: false },
      { label: "MyDog2019", value: "b", correct: false },
      { label: "Tr#9mK!2vX@q", value: "c", correct: true },
      { label: "12345678", value: "d", correct: false }
    ]
  },
  {
    id: "t8",
    type: "phishing",
    instruction: 'An email says "Your account will be deleted in 24 hours, click here NOW." What is this?',
    hint: "Urgency and fear tactics are classic phishing/social engineering tricks.",
    options: [
      { label: "A legitimate security warning", value: "a", correct: false },
      {
        label: "A phishing / social engineering attack",
        value: "b",
        correct: true
      },
      { label: "An account update notification", value: "c", correct: false },
      { label: "A browser notification", value: "d", correct: false }
    ]
  },
  {
    id: "t9",
    type: "navigate",
    instruction: "What does pressing Ctrl+D do in most browsers?",
    hint: "Ctrl+D is a universal browser keyboard shortcut.",
    options: [
      { label: "Downloads the page", value: "a", correct: false },
      {
        label: "Bookmarks/Favorites the current page",
        value: "b",
        correct: true
      },
      { label: "Opens Developer Tools", value: "c", correct: false },
      { label: "Duplicates the tab", value: "d", correct: false }
    ]
  },
  {
    id: "t10",
    type: "find_setting",
    instruction: "How do you force-refresh a page to bypass the browser cache?",
    hint: "Normal refresh uses cached content; Shift+Refresh bypasses it.",
    options: [
      { label: "Press F5", value: "a", correct: false },
      { label: "Press Ctrl+Shift+R or Shift+F5", value: "b", correct: true },
      { label: "Close and reopen the browser", value: "c", correct: false },
      { label: "Clear cookies only", value: "d", correct: false }
    ]
  }
];
const BQ_TYPE_COLORS = {
  navigate: "#00f5ff",
  url_safety: "#10b981",
  form_fill: "#7c3aed",
  phishing: "#f43f5e",
  find_setting: "#f59e0b"
};
const BQ_TYPE_LABELS = {
  navigate: "NAVIGATION",
  url_safety: "URL SAFETY",
  form_fill: "FORM SECURITY",
  phishing: "PHISHING DETECTION",
  find_setting: "BROWSER SETTINGS"
};
function BrowserQuestGame({ config, onGameEnd }) {
  const taskCount = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
  const [tasks] = reactExports.useState(
    () => shuffle(BROWSER_TASKS).slice(0, taskCount)
  );
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [answered, setAnswered] = reactExports.useState(false);
  const [urlBar, setUrlBar] = reactExports.useState("https://www.smartlearn.edu.gh");
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = taskCount > 0 ? correctRef.current / taskCount * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver, taskCount]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleAnswer(option) {
    if (!gameStarted || gameOver || answered) return;
    setAnswered(true);
    if (option.correct) {
      const timeBonus = Math.floor(timeLeft / config.timeLimit * 80);
      setScore((s) => s + 150 + timeBonus);
      setCorrect((c) => c + 1);
      setFeedback({ ok: true, hint: tasks[currentIdx].hint });
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({ ok: false, hint: tasks[currentIdx].hint });
      if (newLives <= 0) {
        setTimeout(() => endGame(false), 1e3);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      if (currentIdx + 1 >= tasks.length) {
        endGame(true);
      } else {
        setCurrentIdx((i) => i + 1);
        setUrlBar(`https://task${currentIdx + 2}.smartlearn.edu.gh`);
      }
    }, 1400);
  }
  const task = tasks[currentIdx];
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "browser_quest.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              currentIdx + 1,
              "/",
              taskCount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Browser Quest"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Answer browser safety and navigation challenges. Identify safe URLs, detect phishing, and master browser settings." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "browser_quest.start_button",
                  children: "Launch Browser"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl overflow-hidden border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#f43f5e]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#10b981]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 bg-background/50 rounded-md px-3 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-[#10b981]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-mono truncate", children: urlBar })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-bold px-2 py-0.5 rounded",
                  style: {
                    background: `${BQ_TYPE_COLORS[task.type]}20`,
                    color: BQ_TYPE_COLORS[task.type]
                  },
                  children: BQ_TYPE_LABELS[task.type]
                }
              ),
              task.type === "phishing" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-[#f43f5e]" }),
              task.type === "url_safety" && /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#10b981]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-4", children: task.instruction }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                className: "grid gap-2",
                children: task.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    onClick: () => handleAnswer(opt),
                    whileHover: !answered ? { scale: 1.01 } : {},
                    whileTap: !answered ? { scale: 0.99 } : {},
                    "data-ocid": `browser_quest.option_${opt.value}`,
                    disabled: answered,
                    className: `text-left px-4 py-3 rounded-lg border transition-all text-sm font-mono ${answered && opt.correct ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : answered && !opt.correct && feedback && !feedback.ok ? "border-[#f43f5e]/40 bg-[#f43f5e]/5 text-muted-foreground" : "border-border/40 glass-card hover:border-[#00f5ff]/40 text-foreground"}`,
                    children: opt.label
                  },
                  opt.value
                ))
              },
              task.id
            ) }),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 4 },
                animate: { opacity: 1, y: 0 },
                className: `mt-3 px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                "data-ocid": feedback.ok ? "browser_quest.success_state" : "browser_quest.error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: feedback.ok ? "Correct! " : "Wrong! " }),
                  feedback.hint
                ]
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
const URL_ITEMS = [
  {
    id: 1,
    url: "https://www.google.com",
    safe: true,
    explanation: "HTTPS, well-known domain, no suspicious characters.",
    flags: []
  },
  {
    id: 2,
    url: "http://paypa1.com/login",
    safe: false,
    explanation: "Fake domain: '1' substituted for 'l'. Uses HTTP not HTTPS.",
    flags: ["Number substitution", "No HTTPS"]
  },
  {
    id: 3,
    url: "https://accounts.google.com/signin",
    safe: true,
    explanation: "Official Google subdomain with HTTPS.",
    flags: []
  },
  {
    id: 4,
    url: "https://facebook.com.user-verify.xyz/login",
    safe: false,
    explanation: "Real domain is user-verify.xyz. Facebook.com is a subdomain trick.",
    flags: ["Subdomain deception", "Suspicious TLD"]
  },
  {
    id: 5,
    url: "https://github.com/openai",
    safe: true,
    explanation: "Verified GitHub domain and well-known organization.",
    flags: []
  },
  {
    id: 6,
    url: "http://free-iphone-giveaway.club/claim",
    safe: false,
    explanation: "Suspicious TLD, unencrypted, prize scam pattern.",
    flags: ["Suspicious TLD", "No HTTPS", "Prize scam"]
  },
  {
    id: 7,
    url: "https://mail.google.com/mail",
    safe: true,
    explanation: "Official Google Mail subdomain with HTTPS.",
    flags: []
  },
  {
    id: 8,
    url: "https://secure-bank-login.info/verify?acct=12345",
    safe: false,
    explanation: ".info TLD with 'secure' keyword to look legitimate. Not a real bank domain.",
    flags: ["Keyword stuffing", "Suspicious TLD", "Query string"]
  },
  {
    id: 9,
    url: "https://www.wikipedia.org/wiki/Computer",
    safe: true,
    explanation: "Trusted nonprofit domain with HTTPS.",
    flags: []
  },
  {
    id: 10,
    url: "http://192.168.0.1/admin/reset?token=abc",
    safe: false,
    explanation: "Raw IP address with admin path and token parameter — suspicious internal attack.",
    flags: ["Raw IP address", "Admin path", "No HTTPS"]
  },
  {
    id: 11,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    safe: true,
    explanation: "Official YouTube domain with HTTPS.",
    flags: []
  },
  {
    id: 12,
    url: "https://amazon.com.deals-special.net/checkout",
    safe: false,
    explanation: "Real domain is deals-special.net, not amazon.com.",
    flags: ["Subdomain deception"]
  },
  {
    id: 13,
    url: "https://update-adobe-flash.net/install",
    safe: false,
    explanation: "Adobe Flash was discontinued in 2020. Any Flash update is malware.",
    flags: ["Discontinued software", "Malware pattern"]
  },
  {
    id: 14,
    url: "https://www.bbc.com/news",
    safe: true,
    explanation: "Trusted global news organization.",
    flags: []
  },
  {
    id: 15,
    url: "https://bit.ly/2xR4abc",
    safe: false,
    explanation: "URL shorteners hide the real destination — cannot verify safety.",
    flags: ["Hidden destination", "URL shortener"]
  }
];
function URLSafetyGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 15;
  const [items] = reactExports.useState(() => shuffle(URL_ITEMS).slice(0, count));
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [answered, setAnswered] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = count > 0 ? correctRef.current / count * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver, count]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleClassify(safe) {
    if (!gameStarted || gameOver || answered) return;
    setAnswered(true);
    const item2 = items[idx];
    const isCorrect = safe === item2.safe;
    if (isCorrect) {
      setScore((s) => s + 120 + Math.floor(timeLeft / config.timeLimit * 60));
      setCorrect((c) => c + 1);
    } else {
      const newL = lives - 1;
      setLives(newL);
      if (newL <= 0) {
        setFeedback({ ok: false, item: item2 });
        setTimeout(() => endGame(false), 1800);
        return;
      }
    }
    setFeedback({ ok: isCorrect, item: item2 });
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      if (idx + 1 >= items.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 1800);
  }
  const item = items[idx];
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "url_safety.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#10b981]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              idx + 1,
              "/",
              count
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "URL Security Inspector"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Classify each URL as Safe or Unsafe. Losing a life reveals the explanation. Learn the red flags!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "url_safety.start_button",
                  children: "Start Inspection"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
            className: "glass-card rounded-xl p-5 border border-border/40 flex-1 flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-3", children: "Inspect this URL — is it safe?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-background/60 rounded-lg px-4 py-3 mb-4 font-mono text-sm break-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: item.url })
              ] }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: `rounded-lg p-3 mb-3 text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                  "data-ocid": feedback.ok ? "url_safety.success_state" : "url_safety.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold mb-1", children: [
                      feedback.ok ? "Correct!" : "Incorrect",
                      " —",
                      " ",
                      item.safe ? "This URL is SAFE" : "This URL is UNSAFE"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: feedback.item.explanation }),
                    feedback.item.flags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: feedback.item.flags.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "px-2 py-0.5 rounded text-xs bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30",
                        children: f
                      },
                      f
                    )) })
                  ]
                }
              ),
              !answered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleClassify(true),
                    className: "flex-1 py-3 rounded-xl border-2 border-[#10b981] text-[#10b981] font-bold uppercase tracking-wider hover:bg-[#10b981]/10 transition-smooth",
                    "data-ocid": "url_safety.safe_button",
                    children: "Safe"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleClassify(false),
                    className: "flex-1 py-3 rounded-xl border-2 border-[#f43f5e] text-[#f43f5e] font-bold uppercase tracking-wider hover:bg-[#f43f5e]/10 transition-smooth",
                    "data-ocid": "url_safety.unsafe_button",
                    children: "Unsafe"
                  }
                )
              ] })
            ]
          },
          item.id
        ) }) })
      ]
    }
  );
}
const SEARCH_CHALLENGES = [
  {
    id: 1,
    question: "You need to find the boiling point of water at sea level for a science assignment.",
    queries: [
      { text: "water", best: false },
      {
        text: "boiling point of water at sea level degrees Celsius",
        best: true
      },
      { text: "why water hot make burn", best: false }
    ],
    results: [
      {
        title: "Water - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Water",
        snippet: "Water boils at 100°C (212°F) at standard atmospheric pressure...",
        reliable: true
      },
      {
        title: "Hot Water Facts | WaterFacts.biz",
        url: "http://waterfacts.biz/boiling",
        snippet: "Water can boil at many temperatures depending on magic.",
        reliable: false
      },
      {
        title: "USGS: Water Properties",
        url: "https://www.usgs.gov/water-resources",
        snippet: "At standard sea-level pressure (101.3 kPa), water boils at 100°C...",
        reliable: true
      }
    ],
    hint: "Specific, scientific terms give more precise results. Government and .org sites are more reliable."
  },
  {
    id: 2,
    question: "You want to find the capital city of Ghana for a geography test.",
    queries: [
      { text: "Ghana capital city", best: true },
      { text: "Ghana", best: false },
      { text: "african country big city names history culture", best: false }
    ],
    results: [
      {
        title: "Ghana - CIA World Factbook",
        url: "https://www.cia.gov/library/publications/factbook/geos/gh.html",
        snippet: "Capital: Accra. Population: 3.1 million...",
        reliable: true
      },
      {
        title: "Ghana Facts | TravelBlog.net",
        url: "http://travelblog.net/ghana",
        snippet: "Ghana is a country in West Africa. Its capital might be Accra or Kumasi.",
        reliable: false
      },
      {
        title: "Ghana | Encyclopedia Britannica",
        url: "https://www.britannica.com/place/Ghana",
        snippet: "Accra is the capital and largest city of Ghana...",
        reliable: true
      }
    ],
    hint: "Concise, specific queries work best. CIA Factbook and Britannica are authoritative sources."
  },
  {
    id: 3,
    question: "You need to understand how a computer CPU works for an ICT report.",
    queries: [
      { text: "computer", best: false },
      { text: "how does a CPU work explained for students", best: true },
      {
        text: "CPU processor technology modern hardware evolution history chips semiconductor silicon valley",
        best: false
      }
    ],
    results: [
      {
        title: "How CPUs Work | HowStuffWorks",
        url: "https://computer.howstuffworks.com/microprocessor.htm",
        snippet: "A CPU fetches, decodes, and executes instructions using the fetch-decode-execute cycle...",
        reliable: true
      },
      {
        title: "Buy Best CPUs 2024 | TechDeals.shop",
        url: "http://techdeals.shop/cpu",
        snippet: "Shop our best CPU deals! Intel i9 and AMD Ryzen 9 on sale.",
        reliable: false
      },
      {
        title: "Central Processing Unit - Khan Academy",
        url: "https://www.khanacademy.org/computing/computers-and-internet",
        snippet: "The CPU is the brain of the computer, executing billions of instructions per second...",
        reliable: true
      }
    ],
    hint: "Adding 'explained' or 'for students' improves results. Educational .org and .edu sites are reliable."
  },
  {
    id: 4,
    question: "You want to know what medications are safe to take for a headache.",
    queries: [
      { text: "headache cure", best: false },
      {
        text: "safe over-the-counter headache medication dosage adults",
        best: true
      },
      {
        text: "headache medicine pills drugs pharmacies symptoms",
        best: false
      }
    ],
    results: [
      {
        title: "Headache Relief | NHS.uk",
        url: "https://www.nhs.uk/conditions/headaches/",
        snippet: "Paracetamol or ibuprofen can relieve headaches. Follow dosage instructions...",
        reliable: true
      },
      {
        title: "Headache Cures | HealthBuzz.net",
        url: "http://healthbuzz.net/cures",
        snippet: "Mix garlic, lemon, and turmeric for a guaranteed headache cure in 5 minutes!",
        reliable: false
      },
      {
        title: "MedlinePlus: Headache",
        url: "https://medlineplus.gov/headache.html",
        snippet: "Medications used for tension headaches include aspirin, ibuprofen, or acetaminophen...",
        reliable: true
      }
    ],
    hint: "For medical information, .gov and official health sites like NHS are most reliable. Avoid cure-all claims."
  }
];
function WebNavigatorGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 4;
  const [challenges] = reactExports.useState(
    () => shuffle(SEARCH_CHALLENGES).slice(0, count)
  );
  const [idx, setIdx] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("query");
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [selectedQuery, setSelectedQuery] = reactExports.useState(null);
  const [selectedResult, setSelectedResult] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = count > 0 ? correctRef.current / (count * 2) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver, count]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleQuerySelect(i) {
    if (selectedQuery !== null || feedback !== null) return;
    setSelectedQuery(i);
    const ch = challenges[idx];
    if (ch.queries[i].best) {
      setScore((s) => s + 150);
      setCorrect((c) => c + 1);
      setFeedback("Best query selected! Now evaluate the search results.");
    } else {
      const newL = lives - 1;
      setLives(newL);
      setFeedback(`Not the best query. ${ch.hint}`);
      if (newL <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setPhase("results");
    }, 1600);
  }
  function handleResultSelect(i) {
    if (selectedResult !== null || feedback !== null) return;
    setSelectedResult(i);
    const ch = challenges[idx];
    if (ch.results[i].reliable) {
      setScore((s) => s + 200);
      setCorrect((c) => c + 1);
      setFeedback(`Reliable source! ${ch.results[i].snippet}`);
    } else {
      const newL = lives - 1;
      setLives(newL);
      setFeedback(`Unreliable source. ${ch.hint}`);
      if (newL <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setSelectedQuery(null);
      setSelectedResult(null);
      setPhase("query");
      if (idx + 1 >= challenges.length) endGame(true);
      else setIdx((i2) => i2 + 1);
    }, 1800);
  }
  const challenge = challenges[idx];
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "web_navigator.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#7c3aed]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              idx + 1,
              "/",
              count
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Web Navigator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Choose the best search query for each scenario, then evaluate the results and pick the most reliable source." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "web_navigator.start_button",
                  children: "Start Searching"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#7c3aed]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#7c3aed] uppercase tracking-widest mb-1", children: phase === "query" ? "Step 1: Choose the best search query" : "Step 2: Select the most reliable source" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: challenge.question })
          ] }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "px-4 py-2 rounded-lg text-sm border border-[#00f5ff]/40 bg-[#00f5ff]/10 text-[#00f5ff]",
              "data-ocid": "web_navigator.feedback",
              children: feedback
            }
          ),
          phase === "query" && !feedback && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: challenge.queries.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleQuerySelect(i),
              disabled: selectedQuery !== null,
              className: `text-left px-4 py-3 rounded-lg border transition-all text-sm font-mono ${selectedQuery === i && q.best ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : selectedQuery === i && !q.best ? "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]" : "border-border/40 glass-card text-foreground hover:border-[#7c3aed]/40"}`,
              "data-ocid": `web_navigator.query_${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 inline mr-2 opacity-60" }),
                q.text
              ]
            },
            `q-${i}`
          )) }),
          phase === "results" && !feedback && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: challenge.results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleResultSelect(i),
              disabled: selectedResult !== null,
              className: `text-left px-4 py-3 rounded-lg border transition-all text-sm ${selectedResult === i && r.reliable ? "border-[#10b981] bg-[#10b981]/15" : selectedResult === i && !r.reliable ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-border/40 glass-card hover:border-[#7c3aed]/40"}`,
              "data-ocid": `web_navigator.result_${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: r.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: r.url }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: r.snippet })
              ]
            },
            `r-${i}`
          )) })
        ] })
      ]
    }
  );
}
function InternetBrowser({ config, onGameEnd }) {
  if (config.gameId === "url-safety")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(URLSafetyGame, { config, onGameEnd });
  if (config.gameId === "web-navigator")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(WebNavigatorGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserQuestGame, { config, onGameEnd });
}
export {
  InternetBrowser as default
};
