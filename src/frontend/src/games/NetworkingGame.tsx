import { GlowButton } from "@/components/ui/GlowButton";
import {
  CheckCircle,
  Heart,
  Monitor,
  Printer,
  Server,
  Wifi,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

function HUDHearts({ total, lives }: { total: number; lives: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <Heart
          key={`h-${i}`}
          className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

// ─── Network Builder ────────────────────────────────────────────────────────────

type DeviceType = "pc" | "router" | "switch" | "server" | "printer";

interface NetworkDevice {
  id: string;
  type: DeviceType;
  label: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  valid: boolean;
}
interface NetQuestion {
  q: string;
  options: { label: string; correct: boolean }[];
}

const DEVICES: NetworkDevice[] = [
  { id: "pc1", type: "pc", label: "PC-1", x: 10, y: 15 },
  { id: "pc2", type: "pc", label: "PC-2", x: 10, y: 55 },
  { id: "pc3", type: "pc", label: "PC-3", x: 10, y: 85 },
  { id: "switch1", type: "switch", label: "Switch", x: 42, y: 50 },
  { id: "router1", type: "router", label: "Router", x: 65, y: 50 },
  { id: "server1", type: "server", label: "Server", x: 88, y: 30 },
  { id: "printer1", type: "printer", label: "Printer", x: 88, y: 70 },
];

const VALID_CONNECTIONS: [string, string][] = [
  ["pc1", "switch1"],
  ["pc2", "switch1"],
  ["pc3", "switch1"],
  ["switch1", "router1"],
  ["router1", "server1"],
  ["router1", "printer1"],
];

const NET_QUESTIONS: NetQuestion[] = [
  {
    q: "What does IP stand for?",
    options: [
      { label: "Internet Protocol", correct: true },
      { label: "Internal Program", correct: false },
      { label: "Integrated Processor", correct: false },
      { label: "Input Port", correct: false },
    ],
  },
  {
    q: "A switch operates at which OSI layer?",
    options: [
      { label: "Layer 1 - Physical", correct: false },
      { label: "Layer 2 - Data Link", correct: true },
      { label: "Layer 3 - Network", correct: false },
      { label: "Layer 4 - Transport", correct: false },
    ],
  },
  {
    q: "Which device connects different networks together?",
    options: [
      { label: "Hub", correct: false },
      { label: "Switch", correct: false },
      { label: "Router", correct: true },
      { label: "Repeater", correct: false },
    ],
  },
  {
    q: "What is the purpose of a DHCP server?",
    options: [
      { label: "Store website files", correct: false },
      { label: "Assign IP addresses automatically", correct: true },
      { label: "Filter malicious traffic", correct: false },
      { label: "Translate domain names", correct: false },
    ],
  },
  {
    q: "DNS stands for:",
    options: [
      { label: "Data Network Switch", correct: false },
      { label: "Domain Name System", correct: true },
      { label: "Device Node Security", correct: false },
      { label: "Digital Network Service", correct: false },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDeviceIcon(type: DeviceType) {
  const cls = "h-5 w-5";
  if (type === "pc") return <Monitor className={cls} />;
  if (type === "router") return <Wifi className={cls} />;
  if (type === "server") return <Server className={cls} />;
  if (type === "printer") return <Printer className={cls} />;
  return (
    <span
      className={`${cls} flex items-center justify-center text-xs font-bold`}
    >
      SW
    </span>
  );
}

function NetworkBuilderGame({ config, onGameEnd }: Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [phase, setPhase] = useState<"wiring" | "quiz">("wiring");
  const [questions] = useState<NetQuestion[]>(() =>
    shuffle(NET_QUESTIONS).slice(
      0,
      config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5,
    ),
  );
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [qFeedback, setQFeedback] = useState<boolean | null>(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const livesRef = useRef(lives);
  scoreRef.current = score;
  correctRef.current = correct;
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const acc =
        questions.length > 0
          ? (correctRef.current / questions.length) * 100
          : 80;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, gameOver, questions.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function isConnected(a: string, b: string) {
    return connections.some(
      (c) => (c.from === a && c.to === b) || (c.from === b && c.to === a),
    );
  }
  function isValidPair(a: string, b: string) {
    return VALID_CONNECTIONS.some(
      ([x, y]) => (x === a && y === b) || (x === b && y === a),
    );
  }

  function handleDeviceClick(deviceId: string) {
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
          { from: selectedDevice, to: deviceId, valid: true },
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

  function handleAnswer(isCorrect: boolean) {
    if (qFeedback !== null) return;
    setQFeedback(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 150);
      setCorrect((c) => c + 1);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1000);
        return;
      }
    }
    setTimeout(() => {
      setQFeedback(null);
      if (qIdx + 1 >= questions.length) endGame(true);
      else setQIdx((i) => i + 1);
    }, 1200);
  }

  const progressPct = (timeLeft / config.timeLimit) * 100;
  const deviceColors: Record<DeviceType, string> = {
    pc: "#00f5ff",
    switch: "#7c3aed",
    router: "#10b981",
    server: "#f59e0b",
    printer: "#f43f5e",
  };
  const timerBarStyle = { width: `${progressPct}%` } as const;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="networking.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Wifi className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {phase === "wiring" ? "Wiring" : "Quiz"}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={timerBarStyle}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>
      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Network Architect
          </h2>
          <p className="text-muted-foreground text-sm mb-2 text-center">
            Click a device, then click another to draw a cable between them.
          </p>
          <p className="text-muted-foreground text-xs mb-6 text-center">
            PCs connect to Switch. Switch to Router. Router to Server and
            Printer.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="networking.start_button"
          >
            Build Network
          </GlowButton>
        </motion.div>
      ) : phase === "wiring" ? (
        <div className="flex-1 glass-card rounded-xl overflow-hidden relative border border-border/40">
          <div className="absolute top-2 left-3 text-xs text-muted-foreground">
            Connections: {connections.length}/{VALID_CONNECTIONS.length}
          </div>
          {selectedDevice && (
            <div className="absolute top-2 right-3 text-xs text-[#00f5ff] animate-pulse">
              Selected: {DEVICES.find((d) => d.id === selectedDevice)?.label} —
              click target
            </div>
          )}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            role="img"
            aria-label="Network diagram canvas"
            style={{ zIndex: 1 }}
          >
            {connections.map((conn, i) => {
              const from = DEVICES.find((d) => d.id === conn.from);
              const to = DEVICES.find((d) => d.id === conn.to);
              if (!from || !to) return null;
              return (
                <line
                  key={`cable-${i}`}
                  x1={`${from.x + 3}%`}
                  y1={`${from.y + 3}%`}
                  x2={`${to.x + 3}%`}
                  y2={`${to.y + 3}%`}
                  stroke="#10b981"
                  strokeWidth="2"
                  opacity={0.8}
                />
              );
            })}
          </svg>
          {DEVICES.map((device) => (
            <motion.button
              key={device.id}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDeviceClick(device.id)}
              data-ocid={`networking.device_${device.id}`}
              className={`absolute flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                selectedDevice === device.id
                  ? "border-[#00f5ff] bg-[#00f5ff]/20 shadow-[0_0_12px_rgba(0,245,255,0.5)]"
                  : "border-border/40 glass-card"
              }`}
              style={{
                left: `${device.x}%`,
                top: `${device.y}%`,
                zIndex: 2,
                minWidth: "60px",
              }}
            >
              <div style={{ color: deviceColors[device.type] }}>
                {getDeviceIcon(device.type)}
              </div>
              <span className="text-xs text-foreground whitespace-nowrap">
                {device.label}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-3 border border-[#10b981]/30">
            <p className="text-xs text-[#10b981] mb-1">
              Network topology complete! Now answer questions.
            </p>
            <p className="text-foreground font-semibold">
              {questions[qIdx]?.q}
            </p>
          </div>
          <div className="grid gap-2">
            {questions[qIdx]?.options.map((opt, i) => (
              <motion.button
                key={`q-${i}`}
                type="button"
                onClick={() => handleAnswer(opt.correct)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                data-ocid={`networking.q_option_${i}`}
                disabled={qFeedback !== null}
                className={`text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                  qFeedback !== null && opt.correct
                    ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]"
                    : "border-border/40 glass-card text-foreground hover:border-[#00f5ff]/40"
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
          {qFeedback !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`px-4 py-2 rounded-lg text-sm border ${
                qFeedback
                  ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                  : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
              }`}
              data-ocid={
                qFeedback
                  ? "networking.success_state"
                  : "networking.error_state"
              }
            >
              {qFeedback
                ? "Correct! Well done."
                : "Incorrect. The correct answer is highlighted."}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── IP Detective ──────────────────────────────────────────────────────────────

interface IPScenario {
  prompt: string;
  ip: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

const IP_SCENARIOS: IPScenario[] = [
  {
    prompt: "Is this IP private or public?",
    ip: "10.0.0.1",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Private",
    explanation: "10.0.0.0/8 is a private range (RFC 1918). Used inside LANs.",
  },
  {
    prompt: "Is this IP private or public?",
    ip: "8.8.8.8",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Public",
    explanation:
      "8.8.8.8 is Google's public DNS server, routable on the internet.",
  },
  {
    prompt: "Is this IP private or public?",
    ip: "192.168.1.100",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Private",
    explanation:
      "192.168.0.0/16 is a private range used in home and office networks.",
  },
  {
    prompt: "Is this IP valid?",
    ip: "256.0.0.1",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Invalid",
    explanation:
      "Each octet must be 0-255. 256 exceeds the maximum value, making this invalid.",
  },
  {
    prompt: "What class is this IP?",
    ip: "172.20.5.1",
    question: "What class is this address?",
    options: ["Class A", "Class B", "Class C", "Private only"],
    correct: "Class B",
    explanation:
      "172.16.0.0-172.31.255.255 is the Class B private range. First octet 128-191 = Class B.",
  },
  {
    prompt: "What class is this IP?",
    ip: "10.45.23.1",
    question: "What class is this address?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correct: "Class A",
    explanation:
      "First octet 1-126 = Class A. 10.0.0.0/8 is a Class A private network.",
  },
  {
    prompt: "What class is this IP?",
    ip: "192.168.10.5",
    question: "What class is this address?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correct: "Class C",
    explanation:
      "First octet 192-223 = Class C. 192.168.0.0/16 is a Class C private range.",
  },
  {
    prompt: "Is this IP private or public?",
    ip: "127.0.0.1",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Loopback",
    explanation:
      "127.0.0.1 is the loopback address, always referring to the local machine.",
  },
  {
    prompt: "Which subnet mask matches /24?",
    ip: "What subnet mask is used with CIDR /24?",
    question: "Select the correct mask",
    options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.128"],
    correct: "255.255.255.0",
    explanation:
      "/24 = 24 ones in binary = 255.255.255.0. Allows 254 host addresses.",
  },
  {
    prompt: "Which subnet mask matches /16?",
    ip: "What subnet mask is used with CIDR /16?",
    question: "Select the correct mask",
    options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.128"],
    correct: "255.255.0.0",
    explanation:
      "/16 = 16 ones = 255.255.0.0. Used by Class B private networks.",
  },
  {
    prompt: "Is this IP private or public?",
    ip: "172.31.255.255",
    question: "Classify this IP",
    options: ["Private", "Public", "Loopback", "Invalid"],
    correct: "Private",
    explanation:
      "172.16.0.0-172.31.255.255 is the Class B private range (RFC 1918).",
  },
  {
    prompt: "Is this IP valid?",
    ip: "192.168.1.0",
    question: "What is this address typically used for?",
    options: [
      "Host address",
      "Network address",
      "Broadcast address",
      "Invalid",
    ],
    correct: "Network address",
    explanation:
      "The first address in a subnet (host bits all 0) is the network address, not assignable to hosts.",
  },
  {
    prompt: "Broadcast address:",
    ip: "Network: 192.168.1.0/24 — what is the broadcast address?",
    question: "Identify the broadcast",
    options: ["192.168.1.0", "192.168.1.1", "192.168.1.254", "192.168.1.255"],
    correct: "192.168.1.255",
    explanation:
      "The last address in a subnet (host bits all 1) is the broadcast address. For /24: x.x.x.255.",
  },
  {
    prompt: "Is this IP private or public?",
    ip: "169.254.1.1",
    question: "Classify this IP",
    options: ["Private", "Public", "APIPA (Link-Local)", "Invalid"],
    correct: "APIPA (Link-Local)",
    explanation:
      "169.254.0.0/16 is APIPA (Automatic Private IP Addressing) — assigned when DHCP fails.",
  },
  {
    prompt: "Usable hosts in a /24 network?",
    ip: "How many usable host addresses in a /24 network?",
    question: "Count usable hosts",
    options: ["256", "254", "255", "252"],
    correct: "254",
    explanation:
      "/24 has 256 addresses. Subtract network (x.x.x.0) and broadcast (x.x.x.255) = 254 usable hosts.",
  },
];

function IPDetectiveGame({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 12 : 15;
  const [scenarios] = useState(() => shuffle(IP_SCENARIOS).slice(0, count));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(lives);
  const correctRef = useRef(0);
  scoreRef.current = score;
  livesRef.current = lives;
  correctRef.current = correctCount;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        scenarios.length > 0
          ? (correctRef.current / scenarios.length) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, scenarios.length],
  );

  const sc = scenarios[idx];

  function handleAnswer(option: string) {
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
    return (
      <div
        className="flex-1 flex items-center justify-center h-full"
        data-ocid="ip_detective.page"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Wifi
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#10b981" }}
          />
          <h2
            className="text-3xl font-black glow-cyan-text mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            IP Detective
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Classify IP addresses as private, public, loopback, or invalid.
            Identify address classes and subnet masks.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              gameOverRef.current = false;
              setGameStarted(true);
            }}
            data-ocid="ip_detective.start_button"
          >
            Begin Investigation
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="ip_detective.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#10b981" }}>
          <Wifi className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <span className="text-xs text-muted-foreground">
          Q {idx + 1}/{scenarios.length}
        </span>
      </div>
      {sc && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-6 neon-top-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {sc.prompt}
            </p>
            <p className="font-mono text-2xl font-bold text-[#10b981] mb-3">
              {sc.ip}
            </p>
            <p className="text-sm text-foreground font-semibold">
              {sc.question}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sc.options.map((opt, i) => (
              <motion.button
                key={`opt-${i}`}
                type="button"
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  feedback && opt === sc.correct
                    ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]"
                    : "border-border/40 hover:border-[#10b981]/50 hover:bg-[#10b981]/5"
                }`}
                data-ocid={`ip_detective.option.${i + 1}`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                feedback === "correct"
                  ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                  : "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30"
              }`}
              data-ocid={
                feedback === "correct"
                  ? "ip_detective.success_state"
                  : "ip_detective.error_state"
              }
            >
              {feedback === "correct" ? (
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <span>{sc.explanation}</span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Packet Racer ───────────────────────────────────────────────────────────────

interface RouterNode {
  id: string;
  label: string;
  latency: number;
  row: number;
  col: number;
}

interface PacketChallenge {
  source: string;
  dest: string;
  optimalPath: string[];
  maxAllowedLatency: number;
}

const GRID_SIZE = 4;
const ROUTER_NODES: RouterNode[] = [
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
  { id: "R33", label: "R33", latency: 4, row: 3, col: 3 },
];

const CHALLENGES: PacketChallenge[] = [
  {
    source: "R00",
    dest: "R33",
    optimalPath: ["R00", "R10", "R11", "R22", "R33"],
    maxAllowedLatency: 50,
  },
  {
    source: "R03",
    dest: "R30",
    optimalPath: ["R03", "R13", "R22", "R21", "R20", "R30"],
    maxAllowedLatency: 60,
  },
  {
    source: "R00",
    dest: "R23",
    optimalPath: ["R00", "R01", "R02", "R13", "R23"],
    maxAllowedLatency: 55,
  },
  {
    source: "R30",
    dest: "R03",
    optimalPath: ["R30", "R21", "R11", "R02", "R03"],
    maxAllowedLatency: 55,
  },
  {
    source: "R10",
    dest: "R32",
    optimalPath: ["R10", "R11", "R22", "R32"],
    maxAllowedLatency: 40,
  },
  {
    source: "R01",
    dest: "R22",
    optimalPath: ["R01", "R11", "R22"],
    maxAllowedLatency: 35,
  },
  {
    source: "R20",
    dest: "R13",
    optimalPath: ["R20", "R21", "R11", "R12", "R13"],
    maxAllowedLatency: 50,
  },
  {
    source: "R33",
    dest: "R00",
    optimalPath: ["R33", "R22", "R11", "R00"],
    maxAllowedLatency: 35,
  },
];

function areAdjacent(a: RouterNode, b: RouterNode) {
  return (
    (Math.abs(a.row - b.row) === 1 && a.col === b.col) ||
    (Math.abs(a.col - b.col) === 1 && a.row === b.row)
  );
}

function PacketRacerGame({ config, onGameEnd }: Props) {
  const challengeCount =
    config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
  const [challenges] = useState(() =>
    shuffle(CHALLENGES).slice(0, challengeCount),
  );
  const [idx, setIdx] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(lives);
  scoreRef.current = score;
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const challenge = challenges[idx];

  function calcPathLatency(path: string[]) {
    return path.reduce((sum, id) => {
      const node = ROUTER_NODES.find((r) => r.id === id);
      return sum + (node?.latency ?? 0);
    }, 0);
  }

  function handleNodeClick(nodeId: string) {
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
    }, 2000);
  }

  const pathLatency = calcPathLatency(selectedPath);

  if (!gameStarted) {
    return (
      <div
        className="flex-1 flex items-center justify-center h-full"
        data-ocid="packet_racer.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Server className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Packet Racer
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Route packets across a grid of routers. Each router has a latency
            cost. Click nodes to build a path from source to destination within
            the latency limit.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              gameOverRef.current = false;
              setGameStarted(true);
            }}
            data-ocid="packet_racer.start_button"
          >
            Launch Packet
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="packet_racer.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#7c3aed]">
          <Server className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <HUDHearts total={config.livesCount} lives={lives} />
        <span className="text-xs text-muted-foreground">
          Challenge {idx + 1}/{challenges.length}
        </span>
      </div>
      {challenge && (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between glass-card rounded-xl p-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Route: </span>
              <span className="font-mono font-bold text-[#10b981]">
                {challenge.source}
              </span>
              <span className="text-muted-foreground"> → </span>
              <span className="font-mono font-bold text-[#f43f5e]">
                {challenge.dest}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Max latency: </span>
              <span className="font-mono font-bold text-[#f59e0b]">
                {challenge.maxAllowedLatency}ms
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Current: </span>
              <span
                className={`font-mono font-bold ${selectedPath.length > 1 && pathLatency > challenge.maxAllowedLatency ? "text-[#f43f5e]" : "text-[#10b981]"}`}
              >
                {selectedPath.length > 0 ? `${pathLatency}ms` : "--"}
              </span>
            </div>
          </div>
          <div className="flex-1 glass-card rounded-xl p-3 overflow-hidden">
            <div
              className="grid gap-2 h-full"
              style={{ gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
            >
              {Array.from({ length: GRID_SIZE }, (_, row) => (
                <div
                  key={`row-${row}`}
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                >
                  {Array.from({ length: GRID_SIZE }, (_, col) => {
                    const node = ROUTER_NODES.find(
                      (r) => r.row === row && r.col === col,
                    );
                    if (!node) return null;
                    const isSource = node.id === challenge.source;
                    const isDest = node.id === challenge.dest;
                    const isInPath = selectedPath.includes(node.id);
                    const pathIdx = selectedPath.indexOf(node.id);
                    const nodeStyle = {
                      borderColor: isSource
                        ? "#10b981"
                        : isDest
                          ? "#f43f5e"
                          : isInPath
                            ? "#7c3aed"
                            : "rgba(100,100,120,0.4)",
                      background: isSource
                        ? "rgba(16,185,129,0.2)"
                        : isDest
                          ? "rgba(244,63,94,0.2)"
                          : isInPath
                            ? "rgba(124,58,237,0.2)"
                            : "rgba(10,10,20,0.6)",
                      boxShadow: isInPath
                        ? "0 0 8px rgba(124,58,237,0.5)"
                        : "none",
                    } as const;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => handleNodeClick(node.id)}
                        disabled={submitted}
                        className="rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                        style={nodeStyle}
                        data-ocid={`packet_racer.node.${node.id}`}
                      >
                        <span
                          className="font-bold text-xs"
                          style={{
                            color: isSource
                              ? "#10b981"
                              : isDest
                                ? "#f43f5e"
                                : isInPath
                                  ? "#7c3aed"
                                  : "#9ca3af",
                          }}
                        >
                          {isSource
                            ? "SRC"
                            : isDest
                              ? "DST"
                              : isInPath
                                ? `#${pathIdx + 1}`
                                : node.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {node.latency}ms
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={
                selectedPath.length < 2 ||
                selectedPath[0] !== challenge.source ||
                submitted
              }
              data-ocid="packet_racer.submit_button"
            >
              Send Packet
            </GlowButton>
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPath([])}
              disabled={submitted}
              data-ocid="packet_racer.reset_button"
            >
              Clear Path
            </GlowButton>
            {selectedPath.length > 0 && (
              <span className="text-xs text-muted-foreground self-center">
                Path: {selectedPath.join(" → ")} ({pathLatency}ms)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────────

export default function NetworkingGame({ config, onGameEnd }: Props) {
  const id = config.gameId;
  if (id === "ip-detective")
    return <IPDetectiveGame config={config} onGameEnd={onGameEnd} />;
  if (id === "packet-racer")
    return <PacketRacerGame config={config} onGameEnd={onGameEnd} />;
  return <NetworkBuilderGame config={config} onGameEnd={onGameEnd} />;
}
