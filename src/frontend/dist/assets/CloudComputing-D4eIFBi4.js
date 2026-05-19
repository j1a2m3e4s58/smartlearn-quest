import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { S as Server } from "./server-BZDIleJ9.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { C as Cloud } from "./cloud-CfXUYkEF.js";
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
const CLOUD_SERVICES = [
  {
    name: "AWS EC2",
    description: "Virtual machines in the cloud. You manage the OS, runtime, and apps. AWS manages the physical hardware.",
    correct: "IaaS",
    explanation: "AWS EC2 is IaaS — you get raw virtual compute infrastructure and manage everything above the hypervisor."
  },
  {
    name: "Google Compute Engine",
    description: "Scalable VMs hosted on Google's infrastructure. You control OS patches, software installs, and networking rules.",
    correct: "IaaS",
    explanation: "Google Compute Engine is IaaS. You rent virtual machines; Google only manages the physical servers."
  },
  {
    name: "Microsoft Azure VMs",
    description: "Windows or Linux virtual machines on Azure. You manage the OS, middleware, applications, and data.",
    correct: "IaaS",
    explanation: "Azure Virtual Machines are IaaS. Azure handles hardware and virtualization; you handle everything inside the VM."
  },
  {
    name: "Heroku",
    description: "Deploy your application with a git push. Heroku manages the servers, runtime, and scaling automatically.",
    correct: "PaaS",
    explanation: "Heroku is PaaS. You provide the application code; the platform manages the OS, runtime, load balancing, and deployments."
  },
  {
    name: "Google App Engine",
    description: "Fully managed platform for web applications. Google handles infrastructure, auto-scaling, and patching.",
    correct: "PaaS",
    explanation: "Google App Engine is PaaS. Developers focus on writing code; Google manages the execution environment."
  },
  {
    name: "AWS Elastic Beanstalk",
    description: "Upload your application zip file. AWS automatically handles capacity, load balancing, and health monitoring.",
    correct: "PaaS",
    explanation: "AWS Elastic Beanstalk is PaaS. It abstracts infrastructure management while still running on AWS EC2 under the hood."
  },
  {
    name: "Google Docs",
    description: "Create, edit, and share documents in a browser. No software to install or update. Data is stored on Google's servers.",
    correct: "SaaS",
    explanation: "Google Docs is SaaS. You use the application directly — Google manages everything: infrastructure, platform, and the app itself."
  },
  {
    name: "Microsoft Office 365",
    description: "Word, Excel, PowerPoint delivered as a subscription over the internet. Updates are automatic and centrally managed.",
    correct: "SaaS",
    explanation: "Office 365 is SaaS. Microsoft manages the software, updates, and servers. Users just subscribe and use the apps."
  },
  {
    name: "Salesforce CRM",
    description: "Customer relationship management software accessible via browser. No installation needed. Salesforce manages all infrastructure.",
    correct: "SaaS",
    explanation: "Salesforce is the classic SaaS example. 100% managed by the vendor — you only manage your data and configuration."
  },
  {
    name: "Gmail",
    description: "Email service hosted entirely on Google's infrastructure. You access it via a browser or API. No email server to manage.",
    correct: "SaaS",
    explanation: "Gmail is SaaS. Google manages everything from the server hardware to the application code. You just use it."
  },
  {
    name: "Azure Kubernetes Service (AKS)",
    description: "Managed container orchestration. You provide container images; Azure manages the Kubernetes control plane and worker nodes.",
    correct: "PaaS",
    explanation: "AKS is PaaS. You get a managed Kubernetes environment without managing master nodes or cluster infrastructure."
  },
  {
    name: "AWS S3",
    description: "Object storage service. You store and retrieve files via API. AWS manages all hardware, replication, and durability.",
    correct: "IaaS",
    explanation: "AWS S3 is IaaS (specifically Storage as a Service under IaaS). You get raw storage infrastructure — AWS manages the physical storage layer."
  }
];
function CloudArchitect({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [selectedModel, setSelectedModel] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const startTime = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const service = CLOUD_SERVICES[idx];
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = CLOUD_SERVICES.length > 0 ? correct / CLOUD_SERVICES.length * 100 : 50;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, correct]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function handleClassify(model) {
    if (feedback) return;
    setSelectedModel(model);
    const isCorrect = model === service.correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 300 * config.difficulty);
    }
    setTimeout(() => {
      setFeedback(null);
      setSelectedModel(null);
      if (idx + 1 >= CLOUD_SERVICES.length) endGame(true);
      else setIdx(idx + 1);
    }, 1800);
  }
  const modelColors = {
    IaaS: "#f43f5e",
    PaaS: "#f59e0b",
    SaaS: "#10b981"
  };
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "cloud_architect.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-4 w-4 text-[#7c3aed]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Service ",
            idx + 1,
            "/",
            CLOUD_SERVICES.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Correct: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: correct })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-[#7c3aed] transition-all duration-1000",
                style: { width: `${timePct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground w-8", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !started ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex flex-col items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Cloud Architect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Classify each cloud service as IaaS, PaaS, or SaaS based on its description." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-4 mb-6 text-xs", children: ["IaaS", "PaaS", "SaaS"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2 h-2 rounded-full",
                    style: { background: modelColors[m] }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: { color: modelColors[m] }, children: m })
              ] }, m)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTime.current = Date.now();
                    setStarted(true);
                    startTimer();
                  },
                  "data-ocid": "cloud_architect.start_button",
                  children: "Start Classification"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            className: "glass-card rounded-2xl p-6 neon-top-border max-w-xl w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Classify this cloud service" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-foreground mb-2", children: service.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: service.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: ["IaaS", "PaaS", "SaaS"].map((model) => {
                const isSelected = selectedModel === model;
                const isCorrect = feedback && model === service.correct;
                const isWrong = feedback === "wrong" && isSelected && model !== service.correct;
                const col = modelColors[model];
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => handleClassify(model),
                    className: "flex-1 py-4 rounded-xl border-2 text-lg font-black transition-all hover:scale-105",
                    style: {
                      borderColor: isCorrect ? col : isWrong ? "#f43f5e" : isSelected ? col : "rgba(100,100,120,0.4)",
                      color: isCorrect || isSelected ? col : "#9ca3af",
                      background: isCorrect ? `${col}15` : isWrong ? "rgba(244,63,94,0.1)" : void 0
                    },
                    "data-ocid": `cloud_architect.classify_${model.toLowerCase()}`,
                    children: model
                  },
                  model
                );
              }) }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: `mt-4 flex items-start gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                  children: [
                    feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      feedback === "correct" ? "Correct! " : `Wrong — it's ${service.correct}. `,
                      service.explanation
                    ] })
                  ]
                }
              )
            ]
          },
          idx
        ) }) })
      ]
    }
  );
}
const LB_REQUEST_NAMES = [
  "GET /api/users",
  "POST /upload",
  "GET /dashboard",
  "WebSocket /live",
  "GET /assets/main.js",
  "POST /checkout",
  "GET /search?q=cloud",
  "DELETE /session",
  "PUT /profile",
  "GET /health-check",
  "POST /login",
  "GET /reports",
  "POST /analytics",
  "GET /docs",
  "PUT /settings",
  "GET /notifications",
  "POST /payment",
  "GET /catalog",
  "DELETE /cache",
  "GET /metrics"
];
function LoadBalancer({ config, onGameEnd }) {
  const TOTAL_REQUESTS = 20;
  const LOAD_PER_REQUEST = 10;
  const RECOVERY_PER_TURN = 5;
  const NUM_SERVERS = 3;
  const [started, setStarted] = reactExports.useState(false);
  const [loads, setLoads] = reactExports.useState([20, 30, 15]);
  const [requestIdx, setRequestIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [win, setWin] = reactExports.useState(false);
  const [flashServer, setFlashServer] = reactExports.useState(null);
  const [overloadMsg, setOverloadMsg] = reactExports.useState("");
  const [maxLoads, setMaxLoads] = reactExports.useState([20, 30, 15]);
  const startTime = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const peakMax = Math.max(...maxLoads);
      const balanceScore = Math.max(0, 100 - peakMax);
      const finalScore = scoreRef.current + balanceScore * 10 * config.difficulty;
      const acc = completed ? 80 + balanceScore * 0.2 : 40;
      onGameEnd(
        buildResult(
          config,
          finalScore,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, maxLoads]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function handleRouteRequest(serverIdx) {
    if (gameOverRef.current || gameOver || win) return;
    const newLoads = loads.map((l, i) => {
      if (i === serverIdx) return l + LOAD_PER_REQUEST;
      return Math.max(0, l - RECOVERY_PER_TURN);
    });
    if (newLoads[serverIdx] > 100) {
      const nl = livesRef.current - 1;
      setLives(nl);
      setFlashServer(serverIdx);
      setOverloadMsg(
        `Server ${serverIdx + 1} overloaded at ${newLoads[serverIdx]}%! -1 life.`
      );
      setTimeout(() => {
        setFlashServer(null);
        setOverloadMsg("");
      }, 1500);
      const clamped = newLoads.map((l) => Math.min(100, l));
      setLoads(clamped);
      if (nl <= 0) {
        setGameOver(true);
        setTimeout(() => endGame(false), 1e3);
        return;
      }
    } else {
      setOverloadMsg("");
    }
    setMaxLoads((prev) => newLoads.map((l, i) => Math.max(prev[i], l)));
    setLoads(newLoads);
    setScore(
      (s) => s + Math.floor((100 - newLoads[serverIdx]) * config.difficulty)
    );
    const nextReq = requestIdx + 1;
    if (nextReq >= TOTAL_REQUESTS) {
      setWin(true);
      setTimeout(() => endGame(true), 1e3);
    } else {
      setRequestIdx(nextReq);
    }
  }
  const currentRequest = LB_REQUEST_NAMES[requestIdx % LB_REQUEST_NAMES.length];
  const timePct = timeLeft / config.timeLimit * 100;
  function ServerBar({ idx: si }) {
    const load = loads[si];
    const col = load > 80 ? "#f43f5e" : load > 60 ? "#f59e0b" : "#10b981";
    const isFlash = flashServer === si;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        disabled: !!gameOver || !!win,
        onClick: () => handleRouteRequest(si),
        className: "flex-1 glass-card rounded-xl p-3 border-2 transition-all hover:scale-[1.02] disabled:opacity-60",
        style: {
          borderColor: isFlash ? "#f43f5e" : `${col}44`,
          background: isFlash ? "rgba(244,63,94,0.12)" : void 0
        },
        "data-ocid": `load_balancer.server.${si + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4", style: { color: col } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
                "Server ",
                si + 1
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-sm font-bold tabular-nums",
                style: { color: col },
                children: [
                  Math.round(load),
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full transition-all duration-500",
              style: { width: `${load}%`, background: col }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 text-center", children: "Click to route request" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "load_balancer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#00f5ff]", children: [
            score.toLocaleString(),
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Req ",
            requestIdx,
            "/",
            TOTAL_REQUESTS
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-[#7c3aed] transition-all duration-1000",
                style: { width: `${timePct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground w-8", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !started ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex flex-col items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Load Balancer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-2", children: [
                TOTAL_REQUESTS,
                " requests will arrive one at a time. Click a server to route each request to it."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-2", children: [
                "Each request adds +",
                LOAD_PER_REQUEST,
                "% load. Idle servers recover -",
                RECOVERY_PER_TURN,
                "% per turn."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "If any server exceeds 100%, you lose a life. Score is based on lowest peak load across all servers." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTime.current = Date.now();
                    setStarted(true);
                    startTimer();
                  },
                  "data-ocid": "load_balancer.start_button",
                  children: "Start Load Balancing"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          overloadMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "rounded-xl p-2 bg-[#f43f5e]/15 border border-[#f43f5e]/50 text-[#f43f5e] text-sm font-semibold text-center",
              children: overloadMsg
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -12 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-xl p-3 border border-[#7c3aed]/40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-1", children: [
                  "Incoming Request #",
                  requestIdx + 1,
                  " — Route to a server"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold font-mono text-[#00f5ff]", children: currentRequest }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "+",
                  LOAD_PER_REQUEST,
                  "% load | Other servers recover -",
                  RECOVERY_PER_TURN,
                  "%"
                ] })
              ]
            },
            requestIdx
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex gap-3", children: Array.from({ length: NUM_SERVERS }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ServerBar, { idx: i }, `srv-${i}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Peak loads:",
              " ",
              maxLoads.map((l, i) => `S${i + 1}:${Math.round(l)}%`).join(" | ")
            ] }),
            win && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: "All requests handled!" }),
            gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e] font-bold", children: "System crashed!" })
          ] })
        ] })
      ]
    }
  );
}
const SECURITY_INCIDENTS = [
  {
    title: "S3 Bucket Data Breach",
    description: "1.2 million customer records were found publicly accessible on the internet. The storage bucket had no access policy configured.",
    vulnType: "Misconfiguration",
    mitigations: [
      "Apply bucket policy to block public access",
      "Install antivirus on the servers",
      "Increase server RAM"
    ],
    correctMitigation: "Apply bucket policy to block public access",
    explanation: "Public S3 buckets with no access policy are a classic cloud misconfiguration. The fix is to apply a bucket policy that denies public access and audit all buckets."
  },
  {
    title: "Admin Account Takeover",
    description: "An attacker gained full access to the AWS Management Console. The root account had no MFA and used password '12345'.",
    vulnType: "Weak Credentials",
    mitigations: [
      "Enable MFA and rotate to strong password",
      "Reboot all EC2 instances",
      "Delete all IAM users"
    ],
    correctMitigation: "Enable MFA and rotate to strong password",
    explanation: "Weak credentials on cloud root accounts are extremely dangerous. Always enable MFA and use strong, unique passwords. Apply least-privilege IAM policies."
  },
  {
    title: "Database Error Exposes All Records",
    description: "A web app's URL allows ?id=1 OR 1=1 -- to return all database rows. The attacker dumped 50,000 user records.",
    vulnType: "Injection Attack",
    mitigations: [
      "Use parameterized queries / prepared statements",
      "Increase database storage",
      "Restart the web server"
    ],
    correctMitigation: "Use parameterized queries / prepared statements",
    explanation: "This is SQL injection. The fix is parameterized queries that treat user input as data, not executable SQL. Also use WAF rules to block common injection patterns."
  },
  {
    title: "Website Unreachable for 8 Hours",
    description: "A cloud-hosted e-commerce site received 4 million fake requests per second from thousands of IPs worldwide, making it unavailable to real customers.",
    vulnType: "DDoS",
    mitigations: [
      "Enable DDoS protection / CDN rate limiting",
      "Increase database read replicas",
      "Compress all HTTP responses"
    ],
    correctMitigation: "Enable DDoS protection / CDN rate limiting",
    explanation: "This is a Distributed Denial of Service attack. Enable AWS Shield/Cloudflare DDoS protection, use rate limiting at the CDN edge, and configure auto-scaling."
  },
  {
    title: "Confidential Files Copied to USB",
    description: "System logs show a database administrator copied 90,000 customer records to a USB drive before resigning. No alerts were triggered.",
    vulnType: "Insider Threat",
    mitigations: [
      "Implement DLP tools and revoke access immediately on resignation",
      "Hire more security staff",
      "Upgrade server hardware"
    ],
    correctMitigation: "Implement DLP tools and revoke access immediately on resignation",
    explanation: "Insider threats are prevented with Data Loss Prevention (DLP) tools, role-based access control, audit logging, and automated access revocation on departure."
  },
  {
    title: "API Keys Exposed on GitHub",
    description: "A developer accidentally pushed AWS API keys to a public GitHub repository. Within 3 minutes, attackers used the keys to launch 200 EC2 instances.",
    vulnType: "Misconfiguration",
    mitigations: [
      "Immediately revoke keys, audit accounts, use secret management",
      "Make the GitHub repo private",
      "Delete all EC2 instances"
    ],
    correctMitigation: "Immediately revoke keys, audit accounts, use secret management",
    explanation: "Exposed API keys must be revoked immediately. Use tools like AWS Secrets Manager, HashiCorp Vault, or environment variables — never hardcode credentials in code."
  },
  {
    title: "RDP Brute Force Attack",
    description: "Attackers ran a brute-force tool against Windows servers exposed on port 3389 with default admin credentials until they gained access.",
    vulnType: "Weak Credentials",
    mitigations: [
      "Disable public RDP, use VPN + MFA, rename admin account",
      "Add more RAM to servers",
      "Enable HTTP compression"
    ],
    correctMitigation: "Disable public RDP, use VPN + MFA, rename admin account",
    explanation: "Never expose RDP to the public internet. Place RDP behind a VPN or bastion host with MFA. Rename the admin account and use complex passwords with account lockout."
  },
  {
    title: "XML External Entity Attack",
    description: "An XML parser processes user-uploaded XML files. An attacker included an external entity reference that read /etc/passwd from the server.",
    vulnType: "Injection Attack",
    mitigations: [
      "Disable external entity processing in XML parser config",
      "Increase XML file size limit",
      "Restart the application server"
    ],
    correctMitigation: "Disable external entity processing in XML parser config",
    explanation: "XXE (XML External Entity) attacks exploit insecure XML parsers. Fix by disabling DTD/external entity processing. Validate and sanitize all uploaded file content."
  },
  {
    title: "CloudTrail Logging Disabled",
    description: "During an incident investigation, security found no audit logs existed because a team member had disabled AWS CloudTrail to 'save costs', violating compliance policy.",
    vulnType: "Insider Threat",
    mitigations: [
      "Re-enable CloudTrail with tamper protection and alert on disable events",
      "Increase EC2 instance types",
      "Enable HTTP/2 on all load balancers"
    ],
    correctMitigation: "Re-enable CloudTrail with tamper protection and alert on disable events",
    explanation: "Disabling audit logs is a serious insider threat indicator. Enable CloudTrail with log file validation and configure alarms that trigger if CloudTrail is disabled."
  },
  {
    title: "Port Scan on All Cloud Services",
    description: "Monitoring detected thousands of TCP SYN packets targeting all ports on all public IPs simultaneously from 1,000 different source IPs.",
    vulnType: "DDoS",
    mitigations: [
      "Block with security groups, enable WAF, activate DDoS protection",
      "Add more load balancers",
      "Compress database responses"
    ],
    correctMitigation: "Block with security groups, enable WAF, activate DDoS protection",
    explanation: "Port scanning at scale is a DDoS/reconnaissance attack. Tighten security group rules to allow only necessary ports, enable WAF geo-blocking, and activate DDoS protection."
  }
];
const VULN_TYPES = [
  "Misconfiguration",
  "Weak Credentials",
  "Injection Attack",
  "DDoS",
  "Insider Threat"
];
function CloudSecurity({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [selectedVuln, setSelectedVuln] = reactExports.useState(null);
  const [selectedMit, setSelectedMit] = reactExports.useState(null);
  const [phase, setPhase] = reactExports.useState("vuln");
  const [feedback, setFeedback] = reactExports.useState(null);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const startTime = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  scoreRef.current = score;
  const livesRef = reactExports.useRef(lives);
  livesRef.current = lives;
  const incident = SECURITY_INCIDENTS[idx];
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = SECURITY_INCIDENTS.length > 0 ? correct / SECURITY_INCIDENTS.length * 100 : 50;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, correct]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function handleVulnSelect(vuln) {
    if (feedback || phase !== "vuln") return;
    setSelectedVuln(vuln);
    const isCorrect = vuln === incident.vulnType;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 200 * config.difficulty);
    else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setPhase("mitigation");
    }, 1200);
  }
  function handleMitSelect(mit) {
    if (feedback || phase !== "mitigation") return;
    setSelectedMit(mit);
    const isCorrect = mit === incident.correctMitigation;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 300 * config.difficulty);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setSelectedVuln(null);
      setSelectedMit(null);
      setPhase("vuln");
      if (idx + 1 >= SECURITY_INCIDENTS.length) endGame(true);
      else setIdx(idx + 1);
    }, 2e3);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const vulnColors = {
    Misconfiguration: "#f59e0b",
    "Weak Credentials": "#f43f5e",
    "Injection Attack": "#7c3aed",
    DDoS: "#3b82f6",
    "Insider Threat": "#e879f9"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "cloud_security.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0 flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-[#f43f5e]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Incident ",
            idx + 1,
            "/",
            SECURITY_INCIDENTS.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-[#f43f5e] transition-all duration-1000",
                style: { width: `${timePct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground w-8", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !started ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "flex-1 flex flex-col items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-14 w-14 mx-auto mb-4 text-[#f43f5e]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Cloud Security"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Real cloud security incidents are described. Identify the vulnerability type, then select the correct mitigation." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Two-phase questions: Vulnerability type first, then mitigation strategy." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTime.current = Date.now();
                    setStarted(true);
                    startTimer();
                  },
                  "data-ocid": "cloud_security.start_button",
                  children: "Start Response"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-3 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -12 },
            className: "flex flex-col gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#f43f5e]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-[#f43f5e] mb-1", children: incident.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: incident.description })
              ] }),
              phase === "vuln" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-2", children: "Step 1: Identify the vulnerability type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: VULN_TYPES.map((v) => {
                  const col = vulnColors[v];
                  const isSelected = selectedVuln === v;
                  const isCorrect = feedback && v === incident.vulnType;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: !!feedback,
                      onClick: () => handleVulnSelect(v),
                      className: "rounded-xl border-2 p-3 text-sm font-bold transition-all",
                      style: {
                        borderColor: isCorrect ? col : isSelected ? col : "rgba(100,100,120,0.4)",
                        color: isCorrect || isSelected ? col : "#9ca3af",
                        background: isCorrect ? `${col}15` : void 0
                      },
                      "data-ocid": `cloud_security.vuln_type.${v.toLowerCase().replace(/ /g, "_")}`,
                      children: v
                    },
                    v
                  );
                }) }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: `mt-3 text-sm font-bold ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                    children: feedback === "correct" ? "Correct! Now select the right mitigation." : `Wrong — this is ${incident.vulnType}. Now select the mitigation.`
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-2 border border-border/40 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Identified as:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-bold",
                      style: { color: vulnColors[incident.vulnType] },
                      children: incident.vulnType
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-2", children: "Step 2: Select the correct mitigation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: incident.mitigations.map((mit, i) => {
                  const isSelected = selectedMit === mit;
                  const isCorrect = feedback && mit === incident.correctMitigation;
                  const isWrong = feedback === "wrong" && isSelected && mit !== incident.correctMitigation;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: !!feedback,
                      onClick: () => handleMitSelect(mit),
                      className: "rounded-xl border p-3 text-sm text-left font-semibold text-foreground transition-all hover:bg-muted",
                      style: {
                        borderColor: isCorrect ? "#10b981" : isWrong ? "#f43f5e" : "rgba(100,100,120,0.4)",
                        background: isCorrect ? "rgba(16,185,129,0.1)" : isWrong ? "rgba(244,63,94,0.08)" : void 0
                      },
                      "data-ocid": `cloud_security.mitigation.${i + 1}`,
                      children: mit
                    },
                    `mit-${i}`
                  );
                }) }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 6 },
                    animate: { opacity: 1, y: 0 },
                    className: `mt-3 flex items-start gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                    children: [
                      feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        feedback === "correct" ? "Correct! " : "Incorrect. ",
                        incident.explanation
                      ] })
                    ]
                  }
                )
              ] })
            ]
          },
          `${idx}-${phase}`
        ) }) })
      ]
    }
  );
}
function CloudComputing({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "cloud-quiz")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadBalancer, { config, onGameEnd });
  if (gameId === "server-basics")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudSecurity, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudArchitect, { config, onGameEnd });
}
export {
  CloudComputing as default
};
