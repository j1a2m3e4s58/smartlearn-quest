import { GlowButton } from "@/components/ui/GlowButton";
import {
  CheckCircle,
  Cloud,
  Heart,
  Server,
  ShieldAlert,
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

// ─────────────────────────────────────────────────────────
// CLOUD ARCHITECT — IaaS/PaaS/SaaS classification
// ─────────────────────────────────────────────────────────

type CloudModel = "IaaS" | "PaaS" | "SaaS";

interface CloudService {
  name: string;
  description: string;
  correct: CloudModel;
  explanation: string;
}

const CLOUD_SERVICES: CloudService[] = [
  {
    name: "AWS EC2",
    description:
      "Virtual machines in the cloud. You manage the OS, runtime, and apps. AWS manages the physical hardware.",
    correct: "IaaS",
    explanation:
      "AWS EC2 is IaaS — you get raw virtual compute infrastructure and manage everything above the hypervisor.",
  },
  {
    name: "Google Compute Engine",
    description:
      "Scalable VMs hosted on Google's infrastructure. You control OS patches, software installs, and networking rules.",
    correct: "IaaS",
    explanation:
      "Google Compute Engine is IaaS. You rent virtual machines; Google only manages the physical servers.",
  },
  {
    name: "Microsoft Azure VMs",
    description:
      "Windows or Linux virtual machines on Azure. You manage the OS, middleware, applications, and data.",
    correct: "IaaS",
    explanation:
      "Azure Virtual Machines are IaaS. Azure handles hardware and virtualization; you handle everything inside the VM.",
  },
  {
    name: "Heroku",
    description:
      "Deploy your application with a git push. Heroku manages the servers, runtime, and scaling automatically.",
    correct: "PaaS",
    explanation:
      "Heroku is PaaS. You provide the application code; the platform manages the OS, runtime, load balancing, and deployments.",
  },
  {
    name: "Google App Engine",
    description:
      "Fully managed platform for web applications. Google handles infrastructure, auto-scaling, and patching.",
    correct: "PaaS",
    explanation:
      "Google App Engine is PaaS. Developers focus on writing code; Google manages the execution environment.",
  },
  {
    name: "AWS Elastic Beanstalk",
    description:
      "Upload your application zip file. AWS automatically handles capacity, load balancing, and health monitoring.",
    correct: "PaaS",
    explanation:
      "AWS Elastic Beanstalk is PaaS. It abstracts infrastructure management while still running on AWS EC2 under the hood.",
  },
  {
    name: "Google Docs",
    description:
      "Create, edit, and share documents in a browser. No software to install or update. Data is stored on Google's servers.",
    correct: "SaaS",
    explanation:
      "Google Docs is SaaS. You use the application directly — Google manages everything: infrastructure, platform, and the app itself.",
  },
  {
    name: "Microsoft Office 365",
    description:
      "Word, Excel, PowerPoint delivered as a subscription over the internet. Updates are automatic and centrally managed.",
    correct: "SaaS",
    explanation:
      "Office 365 is SaaS. Microsoft manages the software, updates, and servers. Users just subscribe and use the apps.",
  },
  {
    name: "Salesforce CRM",
    description:
      "Customer relationship management software accessible via browser. No installation needed. Salesforce manages all infrastructure.",
    correct: "SaaS",
    explanation:
      "Salesforce is the classic SaaS example. 100% managed by the vendor — you only manage your data and configuration.",
  },
  {
    name: "Gmail",
    description:
      "Email service hosted entirely on Google's infrastructure. You access it via a browser or API. No email server to manage.",
    correct: "SaaS",
    explanation:
      "Gmail is SaaS. Google manages everything from the server hardware to the application code. You just use it.",
  },
  {
    name: "Azure Kubernetes Service (AKS)",
    description:
      "Managed container orchestration. You provide container images; Azure manages the Kubernetes control plane and worker nodes.",
    correct: "PaaS",
    explanation:
      "AKS is PaaS. You get a managed Kubernetes environment without managing master nodes or cluster infrastructure.",
  },
  {
    name: "AWS S3",
    description:
      "Object storage service. You store and retrieve files via API. AWS manages all hardware, replication, and durability.",
    correct: "IaaS",
    explanation:
      "AWS S3 is IaaS (specifically Storage as a Service under IaaS). You get raw storage infrastructure — AWS manages the physical storage layer.",
  },
];

function CloudArchitect({ config, onGameEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedModel, setSelectedModel] = useState<CloudModel | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const service = CLOUD_SERVICES[idx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        CLOUD_SERVICES.length > 0
          ? (correct / CLOUD_SERVICES.length) * 100
          : 50;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, correct],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function handleClassify(model: CloudModel) {
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

  const modelColors: Record<CloudModel, string> = {
    IaaS: "#f43f5e",
    PaaS: "#f59e0b",
    SaaS: "#10b981",
  };
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="cloud_architect.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-[#7c3aed]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Service {idx + 1}/{CLOUD_SERVICES.length}
        </span>
        <span className="text-xs text-muted-foreground">
          Correct: <span className="text-[#10b981] font-bold">{correct}</span>
        </span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#7c3aed] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground w-8">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <Cloud className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Cloud Architect
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Classify each cloud service as IaaS, PaaS, or SaaS based on its
              description.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6 text-xs">
              {(["IaaS", "PaaS", "SaaS"] as CloudModel[]).map((m) => (
                <div key={m} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: modelColors[m] }}
                  />
                  <span className="font-bold" style={{ color: modelColors[m] }}>
                    {m}
                  </span>
                </div>
              ))}
            </div>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTime.current = Date.now();
                setStarted(true);
                startTimer();
              }}
              data-ocid="cloud_architect.start_button"
            >
              Start Classification
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-6 neon-top-border max-w-xl w-full"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Classify this cloud service
              </p>
              <h3 className="text-xl font-black text-foreground mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {service.description}
              </p>
              <div className="flex items-center gap-3">
                {(["IaaS", "PaaS", "SaaS"] as CloudModel[]).map((model) => {
                  const isSelected = selectedModel === model;
                  const isCorrect = feedback && model === service.correct;
                  const isWrong =
                    feedback === "wrong" &&
                    isSelected &&
                    model !== service.correct;
                  const col = modelColors[model];
                  return (
                    <button
                      key={model}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => handleClassify(model)}
                      className="flex-1 py-4 rounded-xl border-2 text-lg font-black transition-all hover:scale-105"
                      style={{
                        borderColor: isCorrect
                          ? col
                          : isWrong
                            ? "#f43f5e"
                            : isSelected
                              ? col
                              : "rgba(100,100,120,0.4)",
                        color: isCorrect || isSelected ? col : "#9ca3af",
                        background: isCorrect
                          ? `${col}15`
                          : isWrong
                            ? "rgba(244,63,94,0.1)"
                            : undefined,
                      }}
                      data-ocid={`cloud_architect.classify_${model.toLowerCase()}`}
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 flex items-start gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>
                    {feedback === "correct"
                      ? "Correct! "
                      : `Wrong — it's ${service.correct}. `}
                    {service.explanation}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LOAD BALANCER — server request routing game
// ─────────────────────────────────────────────────────────

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
  "GET /metrics",
];

function LoadBalancer({ config, onGameEnd }: Props) {
  const TOTAL_REQUESTS = 20;
  const LOAD_PER_REQUEST = 10;
  const RECOVERY_PER_TURN = 5;
  const NUM_SERVERS = 3;

  const [started, setStarted] = useState(false);
  const [loads, setLoads] = useState([20, 30, 15]);
  const [requestIdx, setRequestIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flashServer, setFlashServer] = useState<number | null>(null);
  const [overloadMsg, setOverloadMsg] = useState("");
  const [maxLoads, setMaxLoads] = useState([20, 30, 15]);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const peakMax = Math.max(...maxLoads);
      const balanceScore = Math.max(0, 100 - peakMax);
      const finalScore =
        scoreRef.current + balanceScore * 10 * config.difficulty;
      const acc = completed ? 80 + balanceScore * 0.2 : 40;
      onGameEnd(
        buildResult(
          config,
          finalScore,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, maxLoads],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function handleRouteRequest(serverIdx: number) {
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
        `Server ${serverIdx + 1} overloaded at ${newLoads[serverIdx]}%! -1 life.`,
      );
      setTimeout(() => {
        setFlashServer(null);
        setOverloadMsg("");
      }, 1500);
      const clamped = newLoads.map((l) => Math.min(100, l));
      setLoads(clamped);
      if (nl <= 0) {
        setGameOver(true);
        setTimeout(() => endGame(false), 1000);
        return;
      }
    } else {
      setOverloadMsg("");
    }
    setMaxLoads((prev) => newLoads.map((l, i) => Math.max(prev[i], l)));
    setLoads(newLoads);
    setScore(
      (s) => s + Math.floor((100 - newLoads[serverIdx]) * config.difficulty),
    );
    const nextReq = requestIdx + 1;
    if (nextReq >= TOTAL_REQUESTS) {
      setWin(true);
      setTimeout(() => endGame(true), 1000);
    } else {
      setRequestIdx(nextReq);
    }
  }

  const currentRequest = LB_REQUEST_NAMES[requestIdx % LB_REQUEST_NAMES.length];
  const timePct = (timeLeft / config.timeLimit) * 100;

  function ServerBar({ idx: si }: { idx: number }) {
    const load = loads[si];
    const col = load > 80 ? "#f43f5e" : load > 60 ? "#f59e0b" : "#10b981";
    const isFlash = flashServer === si;
    return (
      <button
        type="button"
        disabled={!!gameOver || !!win}
        onClick={() => handleRouteRequest(si)}
        className="flex-1 glass-card rounded-xl p-3 border-2 transition-all hover:scale-[1.02] disabled:opacity-60"
        style={{
          borderColor: isFlash ? "#f43f5e" : `${col}44`,
          background: isFlash ? "rgba(244,63,94,0.12)" : undefined,
        }}
        data-ocid={`load_balancer.server.${si + 1}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" style={{ color: col }} />
            <span className="text-sm font-bold text-foreground">
              Server {si + 1}
            </span>
          </div>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: col }}
          >
            {Math.round(load)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${load}%`, background: col }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Click to route request
        </p>
      </button>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="load_balancer.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 gap-2">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        <span className="text-xs text-muted-foreground">
          Req {requestIdx}/{TOTAL_REQUESTS}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#7c3aed] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground w-8">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <Server className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Load Balancer
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              {TOTAL_REQUESTS} requests will arrive one at a time. Click a
              server to route each request to it.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              Each request adds +{LOAD_PER_REQUEST}% load. Idle servers recover
              -{RECOVERY_PER_TURN}% per turn.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              If any server exceeds 100%, you lose a life. Score is based on
              lowest peak load across all servers.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTime.current = Date.now();
                setStarted(true);
                startTimer();
              }}
              data-ocid="load_balancer.start_button"
            >
              Start Load Balancing
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {overloadMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-2 bg-[#f43f5e]/15 border border-[#f43f5e]/50 text-[#f43f5e] text-sm font-semibold text-center"
            >
              {overloadMsg}
            </motion.div>
          )}
          <motion.div
            key={requestIdx}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-3 border border-[#7c3aed]/40"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Incoming Request #{requestIdx + 1} — Route to a server
            </p>
            <p className="text-base font-bold font-mono text-[#00f5ff]">
              {currentRequest}
            </p>
            <p className="text-xs text-muted-foreground">
              +{LOAD_PER_REQUEST}% load | Other servers recover -
              {RECOVERY_PER_TURN}%
            </p>
          </motion.div>
          <div className="flex-1 flex gap-3">
            {Array.from({ length: NUM_SERVERS }).map((_, i) => (
              <ServerBar key={`srv-${i}`} idx={i} />
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
            <span>
              Peak loads:{" "}
              {maxLoads
                .map((l, i) => `S${i + 1}:${Math.round(l)}%`)
                .join(" | ")}
            </span>
            {win && (
              <span className="text-[#10b981] font-bold">
                All requests handled!
              </span>
            )}
            {gameOver && (
              <span className="text-[#f43f5e] font-bold">System crashed!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CLOUD SECURITY — incident response game
// ─────────────────────────────────────────────────────────

type VulnType =
  | "Misconfiguration"
  | "Weak Credentials"
  | "Injection Attack"
  | "DDoS"
  | "Insider Threat";

interface SecurityIncident {
  title: string;
  description: string;
  vulnType: VulnType;
  mitigations: string[];
  correctMitigation: string;
  explanation: string;
}

const SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    title: "S3 Bucket Data Breach",
    description:
      "1.2 million customer records were found publicly accessible on the internet. The storage bucket had no access policy configured.",
    vulnType: "Misconfiguration",
    mitigations: [
      "Apply bucket policy to block public access",
      "Install antivirus on the servers",
      "Increase server RAM",
    ],
    correctMitigation: "Apply bucket policy to block public access",
    explanation:
      "Public S3 buckets with no access policy are a classic cloud misconfiguration. The fix is to apply a bucket policy that denies public access and audit all buckets.",
  },
  {
    title: "Admin Account Takeover",
    description:
      "An attacker gained full access to the AWS Management Console. The root account had no MFA and used password '12345'.",
    vulnType: "Weak Credentials",
    mitigations: [
      "Enable MFA and rotate to strong password",
      "Reboot all EC2 instances",
      "Delete all IAM users",
    ],
    correctMitigation: "Enable MFA and rotate to strong password",
    explanation:
      "Weak credentials on cloud root accounts are extremely dangerous. Always enable MFA and use strong, unique passwords. Apply least-privilege IAM policies.",
  },
  {
    title: "Database Error Exposes All Records",
    description:
      "A web app's URL allows ?id=1 OR 1=1 -- to return all database rows. The attacker dumped 50,000 user records.",
    vulnType: "Injection Attack",
    mitigations: [
      "Use parameterized queries / prepared statements",
      "Increase database storage",
      "Restart the web server",
    ],
    correctMitigation: "Use parameterized queries / prepared statements",
    explanation:
      "This is SQL injection. The fix is parameterized queries that treat user input as data, not executable SQL. Also use WAF rules to block common injection patterns.",
  },
  {
    title: "Website Unreachable for 8 Hours",
    description:
      "A cloud-hosted e-commerce site received 4 million fake requests per second from thousands of IPs worldwide, making it unavailable to real customers.",
    vulnType: "DDoS",
    mitigations: [
      "Enable DDoS protection / CDN rate limiting",
      "Increase database read replicas",
      "Compress all HTTP responses",
    ],
    correctMitigation: "Enable DDoS protection / CDN rate limiting",
    explanation:
      "This is a Distributed Denial of Service attack. Enable AWS Shield/Cloudflare DDoS protection, use rate limiting at the CDN edge, and configure auto-scaling.",
  },
  {
    title: "Confidential Files Copied to USB",
    description:
      "System logs show a database administrator copied 90,000 customer records to a USB drive before resigning. No alerts were triggered.",
    vulnType: "Insider Threat",
    mitigations: [
      "Implement DLP tools and revoke access immediately on resignation",
      "Hire more security staff",
      "Upgrade server hardware",
    ],
    correctMitigation:
      "Implement DLP tools and revoke access immediately on resignation",
    explanation:
      "Insider threats are prevented with Data Loss Prevention (DLP) tools, role-based access control, audit logging, and automated access revocation on departure.",
  },
  {
    title: "API Keys Exposed on GitHub",
    description:
      "A developer accidentally pushed AWS API keys to a public GitHub repository. Within 3 minutes, attackers used the keys to launch 200 EC2 instances.",
    vulnType: "Misconfiguration",
    mitigations: [
      "Immediately revoke keys, audit accounts, use secret management",
      "Make the GitHub repo private",
      "Delete all EC2 instances",
    ],
    correctMitigation:
      "Immediately revoke keys, audit accounts, use secret management",
    explanation:
      "Exposed API keys must be revoked immediately. Use tools like AWS Secrets Manager, HashiCorp Vault, or environment variables — never hardcode credentials in code.",
  },
  {
    title: "RDP Brute Force Attack",
    description:
      "Attackers ran a brute-force tool against Windows servers exposed on port 3389 with default admin credentials until they gained access.",
    vulnType: "Weak Credentials",
    mitigations: [
      "Disable public RDP, use VPN + MFA, rename admin account",
      "Add more RAM to servers",
      "Enable HTTP compression",
    ],
    correctMitigation:
      "Disable public RDP, use VPN + MFA, rename admin account",
    explanation:
      "Never expose RDP to the public internet. Place RDP behind a VPN or bastion host with MFA. Rename the admin account and use complex passwords with account lockout.",
  },
  {
    title: "XML External Entity Attack",
    description:
      "An XML parser processes user-uploaded XML files. An attacker included an external entity reference that read /etc/passwd from the server.",
    vulnType: "Injection Attack",
    mitigations: [
      "Disable external entity processing in XML parser config",
      "Increase XML file size limit",
      "Restart the application server",
    ],
    correctMitigation:
      "Disable external entity processing in XML parser config",
    explanation:
      "XXE (XML External Entity) attacks exploit insecure XML parsers. Fix by disabling DTD/external entity processing. Validate and sanitize all uploaded file content.",
  },
  {
    title: "CloudTrail Logging Disabled",
    description:
      "During an incident investigation, security found no audit logs existed because a team member had disabled AWS CloudTrail to 'save costs', violating compliance policy.",
    vulnType: "Insider Threat",
    mitigations: [
      "Re-enable CloudTrail with tamper protection and alert on disable events",
      "Increase EC2 instance types",
      "Enable HTTP/2 on all load balancers",
    ],
    correctMitigation:
      "Re-enable CloudTrail with tamper protection and alert on disable events",
    explanation:
      "Disabling audit logs is a serious insider threat indicator. Enable CloudTrail with log file validation and configure alarms that trigger if CloudTrail is disabled.",
  },
  {
    title: "Port Scan on All Cloud Services",
    description:
      "Monitoring detected thousands of TCP SYN packets targeting all ports on all public IPs simultaneously from 1,000 different source IPs.",
    vulnType: "DDoS",
    mitigations: [
      "Block with security groups, enable WAF, activate DDoS protection",
      "Add more load balancers",
      "Compress database responses",
    ],
    correctMitigation:
      "Block with security groups, enable WAF, activate DDoS protection",
    explanation:
      "Port scanning at scale is a DDoS/reconnaissance attack. Tighten security group rules to allow only necessary ports, enable WAF geo-blocking, and activate DDoS protection.",
  },
];

const VULN_TYPES: VulnType[] = [
  "Misconfiguration",
  "Weak Credentials",
  "Injection Attack",
  "DDoS",
  "Insider Threat",
];

function CloudSecurity({ config, onGameEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selectedVuln, setSelectedVuln] = useState<VulnType | null>(null);
  const [selectedMit, setSelectedMit] = useState<string | null>(null);
  const [phase, setPhase] = useState<"vuln" | "mitigation">("vuln");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const incident = SECURITY_INCIDENTS[idx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        SECURITY_INCIDENTS.length > 0
          ? (correct / SECURITY_INCIDENTS.length) * 100
          : 50;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, correct],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function handleVulnSelect(vuln: VulnType) {
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

  function handleMitSelect(mit: string) {
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
    }, 2000);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const vulnColors: Record<VulnType, string> = {
    Misconfiguration: "#f59e0b",
    "Weak Credentials": "#f43f5e",
    "Injection Attack": "#7c3aed",
    DDoS: "#3b82f6",
    "Insider Threat": "#e879f9",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="cloud_security.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#f43f5e]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Incident {idx + 1}/{SECURITY_INCIDENTS.length}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#f43f5e] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground w-8">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg w-full">
            <ShieldAlert className="h-14 w-14 mx-auto mb-4 text-[#f43f5e]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Cloud Security
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Real cloud security incidents are described. Identify the
              vulnerability type, then select the correct mitigation.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Two-phase questions: Vulnerability type first, then mitigation
              strategy.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTime.current = Date.now();
                setStarted(true);
                startTimer();
              }}
              data-ocid="cloud_security.start_button"
            >
              Start Response
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${idx}-${phase}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-3"
            >
              <div className="glass-card rounded-xl p-4 border border-[#f43f5e]/30">
                <p className="text-xs uppercase tracking-widest text-[#f43f5e] mb-1">
                  {incident.title}
                </p>
                <p className="text-sm text-foreground">
                  {incident.description}
                </p>
              </div>

              {phase === "vuln" ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Step 1: Identify the vulnerability type
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {VULN_TYPES.map((v) => {
                      const col = vulnColors[v];
                      const isSelected = selectedVuln === v;
                      const isCorrect = feedback && v === incident.vulnType;
                      return (
                        <button
                          key={v}
                          type="button"
                          disabled={!!feedback}
                          onClick={() => handleVulnSelect(v)}
                          className="rounded-xl border-2 p-3 text-sm font-bold transition-all"
                          style={{
                            borderColor: isCorrect
                              ? col
                              : isSelected
                                ? col
                                : "rgba(100,100,120,0.4)",
                            color: isCorrect || isSelected ? col : "#9ca3af",
                            background: isCorrect ? `${col}15` : undefined,
                          }}
                          data-ocid={`cloud_security.vuln_type.${v.toLowerCase().replace(/ /g, "_")}`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mt-3 text-sm font-bold ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                    >
                      {feedback === "correct"
                        ? "Correct! Now select the right mitigation."
                        : `Wrong — this is ${incident.vulnType}. Now select the mitigation.`}
                    </motion.div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="rounded-lg p-2 border border-border/40 mb-2">
                    <span className="text-xs text-muted-foreground">
                      Identified as:{" "}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: vulnColors[incident.vulnType] }}
                    >
                      {incident.vulnType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Step 2: Select the correct mitigation
                  </p>
                  <div className="flex flex-col gap-2">
                    {incident.mitigations.map((mit, i) => {
                      const isSelected = selectedMit === mit;
                      const isCorrect =
                        feedback && mit === incident.correctMitigation;
                      const isWrong =
                        feedback === "wrong" &&
                        isSelected &&
                        mit !== incident.correctMitigation;
                      return (
                        <button
                          key={`mit-${i}`}
                          type="button"
                          disabled={!!feedback}
                          onClick={() => handleMitSelect(mit)}
                          className="rounded-xl border p-3 text-sm text-left font-semibold text-foreground transition-all hover:bg-muted"
                          style={{
                            borderColor: isCorrect
                              ? "#10b981"
                              : isWrong
                                ? "#f43f5e"
                                : "rgba(100,100,120,0.4)",
                            background: isCorrect
                              ? "rgba(16,185,129,0.1)"
                              : isWrong
                                ? "rgba(244,63,94,0.08)"
                                : undefined,
                          }}
                          data-ocid={`cloud_security.mitigation.${i + 1}`}
                        >
                          {mit}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 flex items-start gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                    >
                      {feedback === "correct" ? (
                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      )}
                      <span>
                        {feedback === "correct" ? "Correct! " : "Incorrect. "}
                        {incident.explanation}
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────

export default function CloudComputing({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "cloud-quiz")
    return <LoadBalancer config={config} onGameEnd={onGameEnd} />;
  if (gameId === "server-basics")
    return <CloudSecurity config={config} onGameEnd={onGameEnd} />;
  // default: cloud-resource-manager
  return <CloudArchitect config={config} onGameEnd={onGameEnd} />;
}
