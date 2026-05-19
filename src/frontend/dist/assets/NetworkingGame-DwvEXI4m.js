import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { S as Server } from "./server-BZDIleJ9.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { M as Monitor } from "./monitor-DU3-xuk_.js";
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
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
function HUDHearts({ total, lives }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: total }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Heart,
    {
      className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
    },
    `h-${i}`
  )) });
}
const DEVICES = [
  { id: "pc1", type: "pc", label: "PC-1", x: 10, y: 15 },
  { id: "pc2", type: "pc", label: "PC-2", x: 10, y: 55 },
  { id: "pc3", type: "pc", label: "PC-3", x: 10, y: 85 },
  { id: "switch1", type: "switch", label: "Switch", x: 42, y: 50 },
  { id: "router1", type: "router", label: "Router", x: 65, y: 50 },
  { id: "server1", type: "server", label: "Server", x: 88, y: 30 },
  { id: "printer1", type: "printer", label: "Printer", x: 88, y: 70 }
];
const VALID_CONNECTIONS = [
  ["pc1", "switch1"],
  ["pc2", "switch1"],
  ["pc3", "switch1"],
  ["switch1", "router1"],
  ["router1", "server1"],
  ["router1", "printer1"]
];
const NET_QUESTIONS = [
  {
    q: "What does IP stand for?",
    options: [
      { label: "Internet Protocol", correct: true },
      { label: "Internal Program", correct: false },
      { label: "Integrated Processor", correct: false },
      { label: "Input Port", correct: false }
    ]
  },
  {
    q: "A switch operates at which OSI layer?",
    options: [
      { label: "Layer 1 - Physical", correct: false },
      { label: "Layer 2 - Data Link", correct: true },
      { label: "Layer 3 - Network", correct: false },
      { label: "Layer 4 - Transport", correct: false }
    ]
  },
  {
    q: "Which device connects different networks together?",
    options: [
      { label: "Hub", correct: false },
      { label: "Switch", correct: false },
      { label: "Router", correct: true },
      { label: "Repeater", correct: false }
    ]
  },
  {
    q: "What is the purpose of a DHCP server?",
    options: [
      { label: "Store website files", correct: false },
      { label: "Assign IP addresses automatically", correct: true },
      { label: "Filter malicious traffic", correct: false },
      { label: "Translate domain names", correct: false }
    ]
  },
  {
    q: "DNS stands for:",
    options: [
      { label: "Data Network Switch", correct: false },
      { label: "Domain Name System", correct: true },
      { label: "Device Node Security", correct: false },
      { label: "Digital Network Service", correct: false }
    ]
  }
];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function getDeviceIcon(type) {
  const cls = "h-5 w-5";
  if (type === "pc") return /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: cls });
  if (type === "router") return /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: cls });
  if (type === "server") return /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: cls });
  if (type === "printer") return /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: cls });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `${cls} flex items-center justify-center text-xs font-bold`,
      children: "SW"
    }
  );
}
function NetworkBuilderGame({ config, onGameEnd }) {
  var _a, _b, _c;
  const [connections, setConnections] = reactExports.useState([]);
  const [selectedDevice, setSelectedDevice] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [phase, setPhase] = reactExports.useState("wiring");
  const [questions] = reactExports.useState(
    () => shuffle(NET_QUESTIONS).slice(
      0,
      config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5
    )
  );
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [qFeedback, setQFeedback] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(0);
  const correctRef = reactExports.useRef(0);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  correctRef.current = correct;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = questions.length > 0 ? correctRef.current / questions.length * 100 : 80;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, gameOver, questions.length]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function isConnected(a, b) {
    return connections.some(
      (c) => c.from === a && c.to === b || c.from === b && c.to === a
    );
  }
  function isValidPair(a, b) {
    return VALID_CONNECTIONS.some(
      ([x, y]) => x === a && y === b || x === b && y === a
    );
  }
  function handleDeviceClick(deviceId) {
    if (!gameStarted || gameOver || phase !== "wiring") return;
    if (!selectedDevice) {
      setSelectedDevice(deviceId);
      return;
    }
    if (selectedDevice === deviceId) {
      setSelectedDevice(null);
      return;
    }
    if (isConnected(selectedDevice, deviceId)) {
      setSelectedDevice(null);
      return;
    }
    const ok = isValidPair(selectedDevice, deviceId);
    if (ok) {
      setConnections((prev) => {
        const nc = [
          ...prev,
          { from: selectedDevice, to: deviceId, valid: true }
        ];
        if (nc.length >= VALID_CONNECTIONS.length)
          setTimeout(() => setPhase("quiz"), 400);
        return nc;
      });
      setScore((s) => s + 80);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) endGame(false);
    }
    setSelectedDevice(null);
  }
  function handleAnswer(isCorrect) {
    if (qFeedback !== null) return;
    setQFeedback(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 150);
      setCorrect((c) => c + 1);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1e3);
        return;
      }
    }
    setTimeout(() => {
      setQFeedback(null);
      if (qIdx + 1 >= questions.length) endGame(true);
      else setQIdx((i) => i + 1);
    }, 1200);
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  const deviceColors = {
    pc: "#00f5ff",
    switch: "#7c3aed",
    router: "#10b981",
    server: "#f59e0b",
    printer: "#f43f5e"
  };
  const timerBarStyle = { width: `${progressPct}%` };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "networking.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: phase === "wiring" ? "Wiring" : "Quiz" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: timerBarStyle
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
                  children: "Network Architect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2 text-center", children: "Click a device, then click another to draw a cable between them." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6 text-center", children: "PCs connect to Switch. Switch to Router. Router to Server and Printer." }),
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
                  "data-ocid": "networking.start_button",
                  children: "Build Network"
                }
              )
            ]
          }
        ) : phase === "wiring" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 glass-card rounded-xl overflow-hidden relative border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-3 text-xs text-muted-foreground", children: [
            "Connections: ",
            connections.length,
            "/",
            VALID_CONNECTIONS.length
          ] }),
          selectedDevice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-3 text-xs text-[#00f5ff] animate-pulse", children: [
            "Selected: ",
            (_a = DEVICES.find((d) => d.id === selectedDevice)) == null ? void 0 : _a.label,
            " — click target"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "absolute inset-0 w-full h-full pointer-events-none",
              role: "img",
              "aria-label": "Network diagram canvas",
              style: { zIndex: 1 },
              children: connections.map((conn, i) => {
                const from = DEVICES.find((d) => d.id === conn.from);
                const to = DEVICES.find((d) => d.id === conn.to);
                if (!from || !to) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: `${from.x + 3}%`,
                    y1: `${from.y + 3}%`,
                    x2: `${to.x + 3}%`,
                    y2: `${to.y + 3}%`,
                    stroke: "#10b981",
                    strokeWidth: "2",
                    opacity: 0.8
                  },
                  `cable-${i}`
                );
              })
            }
          ),
          DEVICES.map((device) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => handleDeviceClick(device.id),
              "data-ocid": `networking.device_${device.id}`,
              className: `absolute flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${selectedDevice === device.id ? "border-[#00f5ff] bg-[#00f5ff]/20 shadow-[0_0_12px_rgba(0,245,255,0.5)]" : "border-border/40 glass-card"}`,
              style: {
                left: `${device.x}%`,
                top: `${device.y}%`,
                zIndex: 2,
                minWidth: "60px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: deviceColors[device.type] }, children: getDeviceIcon(device.type) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground whitespace-nowrap", children: device.label })
              ]
            },
            device.id
          ))
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#10b981]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#10b981] mb-1", children: "Network topology complete! Now answer questions." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: (_b = questions[qIdx]) == null ? void 0 : _b.q })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: (_c = questions[qIdx]) == null ? void 0 : _c.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              onClick: () => handleAnswer(opt.correct),
              whileHover: { scale: 1.01 },
              whileTap: { scale: 0.99 },
              "data-ocid": `networking.q_option_${i}`,
              disabled: qFeedback !== null,
              className: `text-left px-4 py-3 rounded-lg border transition-all text-sm ${qFeedback !== null && opt.correct ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : "border-border/40 glass-card text-foreground hover:border-[#00f5ff]/40"}`,
              children: opt.label
            },
            `q-${i}`
          )) }),
          qFeedback !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `px-4 py-2 rounded-lg text-sm border ${qFeedback ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
              "data-ocid": qFeedback ? "networking.success_state" : "networking.error_state",
              children: qFeedback ? "Correct! Well done." : "Incorrect. The correct answer is highlighted."
            }
          )
        ] })
      ]
    }
  );
}
const IP_SCENARIOS = [
  {
    prompt: "Is this IP private or public?",
    ip: "10.0.0.1",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Private",
    explanation: "10.0.0.0/8 is a private range (RFC 1918). Used inside LANs."
  },
  {
    prompt: "Is this IP private or public?",
    ip: "8.8.8.8",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Public",
    explanation: "8.8.8.8 is Google's public DNS server, routable on the internet."
  },
  {
    prompt: "Is this IP private or public?",
    ip: "192.168.1.100",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Private",
    explanation: "192.168.0.0/16 is a private range used in home and office networks."
  },
  {
    prompt: "Is this IP valid?",
    ip: "256.0.0.1",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Invalid",
    explanation: "Each octet must be 0-255. 256 exceeds the maximum value, making this invalid."
  },
  {
    prompt: "What class is this IP?",
    ip: "172.20.5.1",
    question: "What class is this address?",
    options: ["Class A", "Class B", "Class C", "Private only"],
    correct: "Class B",
    explanation: "172.16.0.0-172.31.255.255 is the Class B private range. First octet 128-191 = Class B."
  },
  {
    prompt: "What class is this IP?",
    ip: "10.45.23.1",
    question: "What class is this address?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correct: "Class A",
    explanation: "First octet 1-126 = Class A. 10.0.0.0/8 is a Class A private network."
  },
  {
    prompt: "What class is this IP?",
    ip: "192.168.10.5",
    question: "What class is this address?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correct: "Class C",
    explanation: "First octet 192-223 = Class C. 192.168.0.0/16 is a Class C private range."
  },
  {
    prompt: "Is this IP private or public?",
    ip: "127.0.0.1",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Loopback",
    explanation: "127.0.0.1 is the loopback address, always referring to the local machine."
  },
  {
    prompt: "Which subnet mask matches /24?",
    ip: "What subnet mask is used with CIDR /24?",
    question: "Select the correct mask",
    options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.128"],
    correct: "255.255.255.0",
    explanation: "/24 = 24 ones in binary = 255.255.255.0. Allows 254 host addresses."
  },
  {
    prompt: "Which subnet mask matches /16?",
    ip: "What subnet mask is used with CIDR /16?",
    question: "Select the correct mask",
    options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.128"],
    correct: "255.255.0.0",
    explanation: "/16 = 16 ones = 255.255.0.0. Used by Class B private networks."
  },
  {
    prompt: "Is this IP private or public?",
    ip: "172.31.255.255",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Private",
    explanation: "172.16.0.0-172.31.255.255 is the Class B private range (RFC 1918)."
  },
  {
    prompt: "Is this IP valid?",
    ip: "192.168.1.0",
    question: "What is this address typically used for?",
    options: [
      "Host address",
      "Network address",
      "Broadcast address",
      "Invalid"
    ],
    correct: "Network address",
    explanation: "The first address in a subnet (host bits all 0) is the network address, not assignable to hosts."
  },
  {
    prompt: "Broadcast address:",
    ip: "Network: 192.168.1.0/24 — what is the broadcast address?",
    question: "Identify the broadcast",
    options: ["192.168.1.0", "192.168.1.1", "192.168.1.254", "192.168.1.255"],
    correct: "192.168.1.255",
    explanation: "The last address in a subnet (host bits all 1) is the broadcast address. For /24: x.x.x.255."
  },
  {
    prompt: "Is this IP private or public?",
    ip: "169.254.1.1",
    question: "Classify this IP",
    options: ["Private", "Public", "APIPA (Link-Local)", "Invalid"],
    correct: "APIPA (Link-Local)",
    explanation: "169.254.0.0/16 is APIPA (Automatic Private IP Addressing) — assigned when DHCP fails."
  },
  {
    prompt: "Usable hosts in a /24 network?",
    ip: "How many usable host addresses in a /24 network?",
    question: "Count usable hosts",
    options: ["256", "254", "255", "252"],
    correct: "254",
    explanation: "/24 has 256 addresses. Subtract network (x.x.x.0) and broadcast (x.x.x.255) = 254 usable hosts."
  }
];
function IPDetectiveGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 15;
  const [scenarios] = reactExports.useState(() => shuffle(IP_SCENARIOS).slice(0, count));
  const [idx, setIdx] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [correctCount, setCorrectCount] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(0);
  const livesRef = reactExports.useRef(lives);
  const correctRef = reactExports.useRef(0);
  scoreRef.current = score;
  livesRef.current = lives;
  correctRef.current = correctCount;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = scenarios.length > 0 ? correctRef.current / scenarios.length * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd, scenarios.length]
  );
  const sc = scenarios[idx];
  function handleAnswer(option) {
    if (feedback) return;
    const isCorrect = option === sc.correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 200 * config.difficulty);
      setCorrectCount((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      setFeedback(null);
      const next = idx + 1;
      if (next >= scenarios.length) endGame(true);
      else setIdx(next);
    }, 1800);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "ip_detective.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Wifi,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#10b981" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "IP Detective"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Classify IP addresses as private, public, loopback, or invalid. Identify address classes and subnet masks." }),
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
                  "data-ocid": "ip_detective.start_button",
                  children: "Begin Investigation"
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
      "data-ocid": "ip_detective.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Q ",
            idx + 1,
            "/",
            scenarios.length
          ] })
        ] }),
        sc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-6 neon-top-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: sc.prompt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-bold text-[#10b981] mb-3", children: sc.ip }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-semibold", children: sc.question })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: sc.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              onClick: () => handleAnswer(opt),
              disabled: !!feedback,
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              className: `py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${feedback && opt === sc.correct ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : "border-border/40 hover:border-[#10b981]/50 hover:bg-[#10b981]/5"}`,
              "data-ocid": `ip_detective.option.${i + 1}`,
              children: opt
            },
            `opt-${i}`
          )) }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              className: `p-3 rounded-lg text-sm flex items-start gap-2 ${feedback === "correct" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              "data-ocid": feedback === "correct" ? "ip_detective.success_state" : "ip_detective.error_state",
              children: [
                feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sc.explanation })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const GRID_SIZE = 4;
const ROUTER_NODES = [
  { id: "R00", label: "R00", latency: 5, row: 0, col: 0 },
  { id: "R01", label: "R01", latency: 12, row: 0, col: 1 },
  { id: "R02", label: "R02", latency: 3, row: 0, col: 2 },
  { id: "R03", label: "R03", latency: 20, row: 0, col: 3 },
  { id: "R10", label: "R10", latency: 8, row: 1, col: 0 },
  { id: "R11", label: "R11", latency: 2, row: 1, col: 1 },
  { id: "R12", label: "R12", latency: 15, row: 1, col: 2 },
  { id: "R13", label: "R13", latency: 4, row: 1, col: 3 },
  { id: "R20", label: "R20", latency: 10, row: 2, col: 0 },
  { id: "R21", label: "R21", latency: 6, row: 2, col: 1 },
  { id: "R22", label: "R22", latency: 1, row: 2, col: 2 },
  { id: "R23", label: "R23", latency: 18, row: 2, col: 3 },
  { id: "R30", label: "R30", latency: 9, row: 3, col: 0 },
  { id: "R31", label: "R31", latency: 7, row: 3, col: 1 },
  { id: "R32", label: "R32", latency: 11, row: 3, col: 2 },
  { id: "R33", label: "R33", latency: 4, row: 3, col: 3 }
];
const CHALLENGES = [
  {
    source: "R00",
    dest: "R33",
    optimalPath: ["R00", "R10", "R11", "R22", "R33"],
    maxAllowedLatency: 50
  },
  {
    source: "R03",
    dest: "R30",
    optimalPath: ["R03", "R13", "R22", "R21", "R20", "R30"],
    maxAllowedLatency: 60
  },
  {
    source: "R00",
    dest: "R23",
    optimalPath: ["R00", "R01", "R02", "R13", "R23"],
    maxAllowedLatency: 55
  },
  {
    source: "R30",
    dest: "R03",
    optimalPath: ["R30", "R21", "R11", "R02", "R03"],
    maxAllowedLatency: 55
  },
  {
    source: "R10",
    dest: "R32",
    optimalPath: ["R10", "R11", "R22", "R32"],
    maxAllowedLatency: 40
  },
  {
    source: "R01",
    dest: "R22",
    optimalPath: ["R01", "R11", "R22"],
    maxAllowedLatency: 35
  },
  {
    source: "R20",
    dest: "R13",
    optimalPath: ["R20", "R21", "R11", "R12", "R13"],
    maxAllowedLatency: 50
  },
  {
    source: "R33",
    dest: "R00",
    optimalPath: ["R33", "R22", "R11", "R00"],
    maxAllowedLatency: 35
  }
];
function areAdjacent(a, b) {
  return Math.abs(a.row - b.row) === 1 && a.col === b.col || Math.abs(a.col - b.col) === 1 && a.row === b.row;
}
function PacketRacerGame({ config, onGameEnd }) {
  const challengeCount = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
  const [challenges] = reactExports.useState(
    () => shuffle(CHALLENGES).slice(0, challengeCount)
  );
  const [idx, setIdx] = reactExports.useState(0);
  const [selectedPath, setSelectedPath] = reactExports.useState([]);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
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
          completed ? 85 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const challenge = challenges[idx];
  function calcPathLatency(path) {
    return path.reduce((sum, id) => {
      const node = ROUTER_NODES.find((r) => r.id === id);
      return sum + ((node == null ? void 0 : node.latency) ?? 0);
    }, 0);
  }
  function handleNodeClick(nodeId) {
    if (submitted) return;
    const node = ROUTER_NODES.find((r) => r.id === nodeId);
    if (!node) return;
    if (selectedPath.length === 0) {
      setSelectedPath([nodeId]);
      return;
    }
    const last = selectedPath[selectedPath.length - 1];
    if (last === nodeId) {
      setSelectedPath((p) => p.slice(0, -1));
      return;
    }
    if (selectedPath.includes(nodeId)) {
      setSelectedPath((p) => p.slice(0, p.indexOf(nodeId) + 1));
      return;
    }
    const lastNode = ROUTER_NODES.find((r) => r.id === last);
    if (!lastNode || !areAdjacent(lastNode, node)) return;
    setSelectedPath((p) => [...p, nodeId]);
  }
  function handleSubmit() {
    if (!challenge || submitted) return;
    const first = selectedPath[0];
    const last = selectedPath[selectedPath.length - 1];
    if (first !== challenge.source || last !== challenge.dest) {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
      setSubmitted(true);
      setTimeout(() => {
        if (livesRef.current > 0) {
          setSubmitted(false);
          setSelectedPath([]);
        }
      }, 1500);
      return;
    }
    const latency = calcPathLatency(selectedPath);
    const optimalLatency = calcPathLatency(challenge.optimalPath);
    const withinLimit = latency <= challenge.maxAllowedLatency;
    setSubmitted(true);
    if (withinLimit) {
      const bonus = latency <= optimalLatency ? 200 : 0;
      setScore((s) => s + 300 * config.difficulty + bonus);
    } else {
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) setTimeout(() => endGame(false), 1800);
        return nl;
      });
    }
    setTimeout(() => {
      if (livesRef.current <= 0) return;
      setSubmitted(false);
      setSelectedPath([]);
      const next = idx + 1;
      if (next >= challenges.length) endGame(true);
      else setIdx(next);
    }, 2e3);
  }
  const pathLatency = calcPathLatency(selectedPath);
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center h-full",
        "data-ocid": "packet_racer.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Packet Racer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Route packets across a grid of routers. Each router has a latency cost. Click nodes to build a path from source to destination within the latency limit." }),
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
                  "data-ocid": "packet_racer.start_button",
                  children: "Launch Packet"
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
      "data-ocid": "packet_racer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#7c3aed]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HUDHearts, { total: config.livesCount, lives }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Challenge ",
            idx + 1,
            "/",
            challenges.length
          ] })
        ] }),
        challenge && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between glass-card rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Route: " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-[#10b981]", children: challenge.source }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " → " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-[#f43f5e]", children: challenge.dest })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Max latency: " }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-[#f59e0b]", children: [
                challenge.maxAllowedLatency,
                "ms"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Current: " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono font-bold ${selectedPath.length > 1 && pathLatency > challenge.maxAllowedLatency ? "text-[#f43f5e]" : "text-[#10b981]"}`,
                  children: selectedPath.length > 0 ? `${pathLatency}ms` : "--"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 glass-card rounded-xl p-3 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-2 h-full",
              style: { gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` },
              children: Array.from({ length: GRID_SIZE }, (_, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid gap-2",
                  style: { gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` },
                  children: Array.from({ length: GRID_SIZE }, (_2, col) => {
                    const node = ROUTER_NODES.find(
                      (r) => r.row === row && r.col === col
                    );
                    if (!node) return null;
                    const isSource = node.id === challenge.source;
                    const isDest = node.id === challenge.dest;
                    const isInPath = selectedPath.includes(node.id);
                    const pathIdx = selectedPath.indexOf(node.id);
                    const nodeStyle = {
                      borderColor: isSource ? "#10b981" : isDest ? "#f43f5e" : isInPath ? "#7c3aed" : "rgba(100,100,120,0.4)",
                      background: isSource ? "rgba(16,185,129,0.2)" : isDest ? "rgba(244,63,94,0.2)" : isInPath ? "rgba(124,58,237,0.2)" : "rgba(10,10,20,0.6)",
                      boxShadow: isInPath ? "0 0 8px rgba(124,58,237,0.5)" : "none"
                    };
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleNodeClick(node.id),
                        disabled: submitted,
                        className: "rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all hover:scale-105",
                        style: nodeStyle,
                        "data-ocid": `packet_racer.node.${node.id}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-bold text-xs",
                              style: {
                                color: isSource ? "#10b981" : isDest ? "#f43f5e" : isInPath ? "#7c3aed" : "#9ca3af"
                              },
                              children: isSource ? "SRC" : isDest ? "DST" : isInPath ? `#${pathIdx + 1}` : node.id
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                            node.latency,
                            "ms"
                          ] })
                        ]
                      },
                      node.id
                    );
                  })
                },
                `row-${row}`
              ))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "primary",
                size: "sm",
                onClick: handleSubmit,
                disabled: selectedPath.length < 2 || selectedPath[0] !== challenge.source || submitted,
                "data-ocid": "packet_racer.submit_button",
                children: "Send Packet"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setSelectedPath([]),
                disabled: submitted,
                "data-ocid": "packet_racer.reset_button",
                children: "Clear Path"
              }
            ),
            selectedPath.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground self-center", children: [
              "Path: ",
              selectedPath.join(" → "),
              " (",
              pathLatency,
              "ms)"
            ] })
          ] })
        ] })
      ]
    }
  );
}
function NetworkingGame({ config, onGameEnd }) {
  const id = config.gameId;
  if (id === "ip-detective")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(IPDetectiveGame, { config, onGameEnd });
  if (id === "packet-racer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PacketRacerGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkBuilderGame, { config, onGameEnd });
}
export {
  NetworkingGame as default
};
