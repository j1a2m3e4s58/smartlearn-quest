import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Cpu, Heart, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
// OS COMMANDER — scenario-based OS quiz
// ─────────────────────────────────────────────────────────

interface OSQ {
  scenario: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

const OS_QUIZ_QUESTIONS: OSQ[] = [
  {
    difficulty: 1,
    scenario: "Your PC runs slowly when too many programs are open.",
    question:
      "What OS component is responsible for allocating CPU time to each program?",
    options: [
      "The file system",
      "The process scheduler",
      "The display driver",
      "The BIOS",
    ],
    answer: "The process scheduler",
    explanation:
      "The process scheduler (part of the kernel) decides which process runs on the CPU and for how long, ensuring fair sharing of CPU time.",
  },
  {
    difficulty: 1,
    scenario: "You try to open a file but get 'Access Denied'.",
    question:
      "Which OS component checks whether you have permission to open the file?",
    options: [
      "The GPU driver",
      "The network stack",
      "The access control / security subsystem",
      "The boot loader",
    ],
    answer: "The access control / security subsystem",
    explanation:
      "The OS security subsystem checks the file's Access Control List (ACL) against your user credentials before granting access.",
  },
  {
    difficulty: 1,
    scenario:
      "A program crashes and the OS prevents it from corrupting other running programs.",
    question:
      "What mechanism does the OS use to isolate programs from each other?",
    options: [
      "Thread priorities",
      "Virtual memory / address space isolation",
      "File compression",
      "Clock synchronization",
    ],
    answer: "Virtual memory / address space isolation",
    explanation:
      "Each process runs in its own virtual address space. The OS and MMU hardware prevent one process from reading or writing another's memory.",
  },
  {
    difficulty: 1,
    scenario:
      "You install a new printer and the OS automatically recognizes it.",
    question: "What OS subsystem handles communication with hardware devices?",
    options: [
      "The compiler",
      "The device driver / hardware abstraction layer",
      "The file system journal",
      "The swap partition",
    ],
    answer: "The device driver / hardware abstraction layer",
    explanation:
      "Device drivers are software that lets the OS communicate with hardware. The HAL abstracts hardware differences so software works across devices.",
  },
  {
    difficulty: 2,
    scenario:
      "Your system is using a lot of disk activity even with plenty of RAM free.",
    question:
      "A process that is waiting for I/O is moved off the CPU. What is this called?",
    options: ["Context switch", "Thrashing", "Page fault", "Kernel panic"],
    answer: "Context switch",
    explanation:
      "A context switch occurs when the OS saves the state of one process and loads another. I/O-bound processes yield the CPU while waiting.",
  },
  {
    difficulty: 2,
    scenario: "RAM is full but more applications keep launching successfully.",
    question:
      "What OS technique allows the system to run more apps than physical RAM allows?",
    options: [
      "CPU overclocking",
      "Virtual memory / paging to disk",
      "GPU compute offload",
      "BIOS shadowing",
    ],
    answer: "Virtual memory / paging to disk",
    explanation:
      "Virtual memory uses a pagefile/swap on disk as overflow RAM. Pages of inactive processes are swapped out, freeing physical RAM for active ones.",
  },
  {
    difficulty: 2,
    scenario:
      "Process A holds lock on Resource 1 and waits for Resource 2. Process B holds Resource 2 and waits for Resource 1. Neither can proceed.",
    question: "What OS problem does this describe?",
    options: ["Race condition", "Buffer overflow", "Deadlock", "Memory leak"],
    answer: "Deadlock",
    explanation:
      "A deadlock occurs when two or more processes are each waiting for a resource held by the other, so none can proceed. The OS detects or prevents this.",
  },
  {
    difficulty: 2,
    scenario:
      "The OS runs each process in short time slices, switching between them rapidly.",
    question: "What CPU scheduling algorithm does this describe?",
    options: [
      "First Come First Served",
      "Shortest Job First",
      "Round Robin",
      "Priority Scheduling",
    ],
    answer: "Round Robin",
    explanation:
      "Round Robin scheduling gives each process a fixed time quantum in turns. It prevents CPU monopolization and is used in most modern OS timesharing systems.",
  },
  {
    difficulty: 3,
    scenario: "A user-space application wants to write data to a file on disk.",
    question: "In what order does the OS process this request?",
    options: [
      "Application > Kernel syscall > VFS > File system driver > Disk driver > Hardware",
      "Application > BIOS > RAM > CPU > Disk",
      "Application > GPU > Kernel > RAM > Disk",
      "Application > Network stack > File system > BIOS",
    ],
    answer:
      "Application > Kernel syscall > VFS > File system driver > Disk driver > Hardware",
    explanation:
      "A write() call transitions to kernel mode via syscall, passes through the Virtual File System layer, the specific FS driver (ext4/NTFS), then the disk I/O driver to hardware.",
  },
  {
    difficulty: 3,
    scenario:
      "The OS stores frequently accessed disk data in RAM to speed up repeated reads.",
    question: "What is this caching mechanism called?",
    options: [
      "The TLB (Translation Lookaside Buffer)",
      "The page cache / buffer cache",
      "The L3 CPU cache",
      "The swap partition",
    ],
    answer: "The page cache / buffer cache",
    explanation:
      "The page cache holds recently read disk blocks in RAM. Subsequent reads are served from RAM (~10,000x faster). The OS manages cache eviction under memory pressure.",
  },
  {
    difficulty: 3,
    scenario:
      "A system call is made but the privilege level needs to change from user mode to kernel mode.",
    question: "How does the CPU handle this privilege transition?",
    options: [
      "The process simply reads kernel memory directly",
      "A software interrupt/trap gate switches to ring 0 via the IDT",
      "The GPU handles the privilege check",
      "The BIOS mediates all kernel calls",
    ],
    answer: "A software interrupt/trap gate switches to ring 0 via the IDT",
    explanation:
      "System calls use INT or SYSCALL instructions to trigger a controlled privilege escalation. The CPU checks the Interrupt Descriptor Table and switches to ring 0 (kernel mode) safely.",
  },
  {
    difficulty: 3,
    scenario:
      "Multiple threads modify a shared counter simultaneously without synchronization.",
    question: "What problem can occur?",
    options: [
      "Page fault",
      "Deadlock",
      "Race condition leading to data corruption",
      "Stack overflow",
    ],
    answer: "Race condition leading to data corruption",
    explanation:
      "Without mutual exclusion (mutex/lock), threads can interleave their read-modify-write operations. The final count becomes unpredictable — this is a race condition.",
  },
];

function getOSQuestions(difficulty: number): OSQ[] {
  const byDiff = OS_QUIZ_QUESTIONS.filter((q) => q.difficulty <= difficulty);
  const shuffled = [...byDiff].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

function OSCommander({ config, onGameEnd }: Props) {
  const [questions] = useState(() => getOSQuestions(config.difficulty));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [lives, setLives] = useState(config.livesCount);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [started, setStarted] = useState(false);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;

  const q = questions[idx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        questions.length > 0 ? (correct / questions.length) * 100 : 50;
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
    [config, onGameEnd, correct, questions.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function handleAnswer(opt: string) {
    if (feedback || !q) return;
    setSelected(opt);
    const isCorrect = opt === q.answer;
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
      setSelected(null);
      if (idx + 1 >= questions.length) endGame(true);
      else setIdx(idx + 1);
    }, 1800);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="os_commander.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#00f5ff]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Q {idx + 1}/{questions.length}
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
              className="h-full bg-[#00f5ff] transition-all duration-1000"
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
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-2xl p-10 text-center max-w-lg w-full mx-auto"
        >
          <Cpu className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            OS Commander
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Scenario-based OS questions. Read the situation, then pick the
            correct answer.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            {questions.length} questions | {config.livesCount} lives | +
            {300 * config.difficulty} pts per correct answer
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTime.current = Date.now();
              setStarted(true);
              startTimer();
            }}
            data-ocid="os_commander.start_button"
          >
            Boot OS Quiz
          </GlowButton>
        </motion.div>
      ) : q ? (
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-6 neon-top-border max-w-xl w-full"
            >
              <div className="rounded-lg p-3 border border-[#00f5ff]/20 bg-[#00f5ff]/5 mb-4">
                <p className="text-xs uppercase tracking-widest text-[#00f5ff] mb-1">
                  Scenario
                </p>
                <p className="text-sm text-foreground">{q.scenario}</p>
              </div>
              <p className="text-base font-bold text-foreground mb-4">
                {q.question}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, i) => {
                  const isAnswer = feedback && opt === q.answer;
                  const isWrong =
                    feedback === "wrong" &&
                    opt === selected &&
                    opt !== q.answer;
                  return (
                    <button
                      key={`opt-${i}`}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => handleAnswer(opt)}
                      className="rounded-xl border p-3 text-sm text-left font-semibold text-foreground transition-all hover:bg-muted"
                      style={{
                        borderColor: isAnswer
                          ? "#10b981"
                          : isWrong
                            ? "#f43f5e"
                            : "rgba(100,100,120,0.4)",
                        background: isAnswer
                          ? "rgba(16,185,129,0.1)"
                          : isWrong
                            ? "rgba(244,63,94,0.08)"
                            : undefined,
                      }}
                      data-ocid={`os_commander.answer.${i + 1}`}
                    >
                      {opt}
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
                    {feedback === "correct" ? "Correct! " : "Incorrect. "}
                    {q.explanation}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TASK MANAGER — process management simulation
// ─────────────────────────────────────────────────────────

interface TMProcess {
  pid: number;
  name: string;
  cpu: number;
  ram: number;
  status: "running" | "frozen" | "high-cpu" | "memory-hog";
}

interface TMScenario {
  title: string;
  description: string;
  targetPid: number;
  correctAction: "end" | "wait" | "restart";
  explanation: string;
}

const TM_PROCESS_NAMES = [
  "chrome.exe",
  "explorer.exe",
  "node.exe",
  "antivirus.exe",
  "discord.exe",
  "obs.exe",
  "steam.exe",
  "photoshop.exe",
];

function generateTMProcesses(): TMProcess[] {
  return TM_PROCESS_NAMES.map((name, i) => ({
    pid: 1000 + i * 11,
    name,
    cpu: i === 2 ? 97 : i === 5 ? 88 : Math.floor(Math.random() * 25) + 1,
    ram: i === 7 ? 94 : i === 4 ? 88 : Math.floor(Math.random() * 40) + 5,
    status:
      i === 2
        ? "high-cpu"
        : i === 7
          ? "memory-hog"
          : i === 4
            ? "frozen"
            : "running",
  }));
}

const TM_SCENARIOS: TMScenario[] = [
  {
    title: "CPU at 97%",
    description:
      "Your system is unresponsive. CPU usage is at 97%. node.exe is consuming 97% CPU. What should you do?",
    targetPid: 1022,
    correctAction: "end",
    explanation:
      "node.exe has gone into an infinite loop. Ending it will free the CPU immediately. The correct action is End Task.",
  },
  {
    title: "Application Frozen",
    description:
      "discord.exe shows 'Not Responding' and the window won't close. CPU usage is 0%. What do you do?",
    targetPid: 1044,
    correctAction: "end",
    explanation:
      "A frozen process with 0% CPU is stuck waiting. Since it is Not Responding, End Task is the correct action to reclaim system resources.",
  },
  {
    title: "Memory at 94%",
    description:
      "RAM is at 94% used. photoshop.exe is using 94% of RAM. The system is heavily swapping to disk. What do you do?",
    targetPid: 1077,
    correctAction: "end",
    explanation:
      "When RAM is critically full and causing disk thrashing, ending the memory-heavy process restores performance. Save work first if possible.",
  },
  {
    title: "antivirus.exe Spike",
    description:
      "antivirus.exe is using 35% CPU for 2 minutes during a scheduled scan. Should you end it?",
    targetPid: 1033,
    correctAction: "wait",
    explanation:
      "Antivirus scans legitimately spike CPU temporarily. Waiting is correct — ending it would leave your system unprotected.",
  },
  {
    title: "obs.exe High CPU",
    description:
      "obs.exe is using 88% CPU while you are recording video. Is this normal?",
    targetPid: 1055,
    correctAction: "wait",
    explanation:
      "Video encoding is CPU-intensive by nature. 88% CPU during active recording is expected. Waiting and optimizing encoder settings is the right approach.",
  },
  {
    title: "chrome.exe Crash Loop",
    description:
      "chrome.exe has crashed and restarted 3 times in a row, peaking at 40% CPU each time.",
    targetPid: 1000,
    correctAction: "restart",
    explanation:
      "A crash loop suggests corrupted state. Restarting chrome cleanly clears its session data. A full Restart is the correct action here.",
  },
  {
    title: "explorer.exe Unresponsive",
    description:
      "The desktop and taskbar are unresponsive but explorer.exe shows only 2% CPU. This typically means the shell has frozen.",
    targetPid: 1011,
    correctAction: "restart",
    explanation:
      "Restarting explorer.exe (via Task Manager > Restart) refreshes the Windows shell without rebooting the PC. This is the correct action.",
  },
  {
    title: "steam.exe Download",
    description:
      "steam.exe is using 25% CPU while downloading a 50GB game update. Should you end it?",
    targetPid: 1066,
    correctAction: "wait",
    explanation:
      "Steam downloads and decompresses game files in background. 25% CPU is normal during this operation. Waiting is the correct action.",
  },
  {
    title: "node.exe Memory Leak",
    description:
      "A node.exe server process gradually grows from 200MB to 3800MB RAM over 6 hours without releasing it. What is the best action?",
    targetPid: 1022,
    correctAction: "restart",
    explanation:
      "This is a classic memory leak pattern. Restarting the process resets heap memory. In production, you would also patch the code to fix the leak.",
  },
  {
    title: "photoshop.exe High RAM",
    description:
      "photoshop.exe uses 88% RAM but you are actively editing a large PSD file. What do you do?",
    targetPid: 1077,
    correctAction: "wait",
    explanation:
      "Photoshop legitimately needs large amounts of RAM for active documents. If the system is not swapping heavily, waiting is correct and ending it would lose your work.",
  },
];

function TaskManager({ config, onGameEnd }: Props) {
  const [processes] = useState(generateTMProcesses);
  const [scenarios] = useState(() =>
    TM_SCENARIOS.sort(() => Math.random() - 0.5).slice(
      0,
      8 + config.difficulty,
    ),
  );
  const [scenIdx, setScenIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "play" | "result">("idle");
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

  const scen = scenarios[scenIdx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        scenarios.length > 0 ? (correct / scenarios.length) * 100 : 50;
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
    [config, onGameEnd, correct, scenarios.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function handleAction(action: "end" | "wait" | "restart") {
    if (feedback || !scen) return;
    const isCorrect = action === scen.correctAction;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 350 * config.difficulty);
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
      if (scenIdx + 1 >= scenarios.length) endGame(true);
      else setScenIdx(scenIdx + 1);
    }, 1800);
  }

  const statusColors: Record<TMProcess["status"], string> = {
    running: "#10b981",
    frozen: "#00f5ff",
    "high-cpu": "#f43f5e",
    "memory-hog": "#f59e0b",
  };
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="task_manager.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 flex-wrap gap-2">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        {phase === "play" && (
          <span className="text-xs text-muted-foreground">
            Scenario {scenIdx + 1}/{scenarios.length}
          </span>
        )}
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
              className="h-full bg-[#f59e0b] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground w-8">
            {timeLeft}s
          </span>
        </div>
      </div>

      {phase === "idle" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="glass-card rounded-2xl p-8 max-w-xl w-full text-center">
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Task Manager Sim
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              A virtual task manager table is shown below. You will be given
              scenarios about system problems.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Decide: End Task / Wait / Restart for each situation.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/40">
                    <th className="text-left py-1 pr-2">Process</th>
                    <th className="text-right py-1 pr-2">CPU%</th>
                    <th className="text-right py-1 pr-2">RAM%</th>
                    <th className="text-left py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p) => (
                    <tr key={p.pid} className="border-b border-border/20">
                      <td className="py-1 pr-2 font-mono">{p.name}</td>
                      <td
                        className="text-right py-1 pr-2"
                        style={{ color: p.cpu > 80 ? "#f43f5e" : undefined }}
                      >
                        {p.cpu}%
                      </td>
                      <td
                        className="text-right py-1 pr-2"
                        style={{ color: p.ram > 80 ? "#f59e0b" : undefined }}
                      >
                        {p.ram}%
                      </td>
                      <td
                        className="py-1 text-xs"
                        style={{ color: statusColors[p.status] }}
                      >
                        {p.status.replace("-", " ").toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTime.current = Date.now();
                setPhase("play");
                startTimer();
              }}
              data-ocid="task_manager.start_button"
            >
              Start Scenarios
            </GlowButton>
          </div>
        </motion.div>
      ) : phase === "play" && scen ? (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          <div className="overflow-x-auto shrink-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border/40">
                  <th className="text-left py-1 pr-2">Process</th>
                  <th className="text-right py-1 pr-2">CPU%</th>
                  <th className="text-right py-1 pr-2">RAM%</th>
                  <th className="text-left py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((p) => (
                  <tr
                    key={p.pid}
                    className={`border-b border-border/20 transition-all ${p.pid === scen.targetPid ? "bg-[#f59e0b]/10" : ""}`}
                  >
                    <td className="py-1 pr-2 font-mono">
                      {p.name}{" "}
                      {p.pid === scen.targetPid && (
                        <span className="text-[#f59e0b]">[!]</span>
                      )}
                    </td>
                    <td
                      className="text-right py-1 pr-2"
                      style={{ color: p.cpu > 80 ? "#f43f5e" : undefined }}
                    >
                      {p.cpu}%
                    </td>
                    <td
                      className="text-right py-1 pr-2"
                      style={{ color: p.ram > 80 ? "#f59e0b" : undefined }}
                    >
                      {p.ram}%
                    </td>
                    <td
                      className="py-1 text-xs"
                      style={{ color: statusColors[p.status] }}
                    >
                      {p.status.replace("-", " ").toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={scenIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass-card rounded-xl p-4 border border-[#f59e0b]/30"
            >
              <p className="text-xs uppercase tracking-widest text-[#f59e0b] mb-1">
                {scen.title}
              </p>
              <p className="text-sm text-foreground mb-4">{scen.description}</p>
              <div className="flex items-center gap-2">
                {(["end", "wait", "restart"] as const).map((action) => {
                  const col =
                    action === "end"
                      ? "#f43f5e"
                      : action === "wait"
                        ? "#10b981"
                        : "#00f5ff";
                  const isCorrect = feedback && action === scen.correctAction;
                  return (
                    <button
                      key={action}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => handleAction(action)}
                      className="flex-1 py-2 rounded-lg border text-sm font-bold transition-all capitalize"
                      style={{
                        borderColor: isCorrect ? col : "rgba(100,100,120,0.4)",
                        color: col,
                        background: isCorrect ? `${col}18` : undefined,
                      }}
                      data-ocid={`task_manager.action_${action}`}
                    >
                      {action === "end"
                        ? "End Task"
                        : action === "wait"
                          ? "Wait"
                          : "Restart"}
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
                    {scen.explanation}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// FILE PERMISSIONS — Unix chmod puzzle
// ─────────────────────────────────────────────────────────

interface PermBit {
  r: boolean;
  w: boolean;
  x: boolean;
}

interface PermScenario {
  filename: string;
  filetype: "file" | "dir";
  description: string;
  scenario: string;
  correctOwner: PermBit;
  correctGroup: PermBit;
  correctOthers: PermBit;
  explanation: string;
}

const PERM_SCENARIOS: PermScenario[] = [
  {
    filename: "/etc/passwd",
    filetype: "file",
    description: "System user account database",
    scenario:
      "Root (owner) needs full access. The 'users' group should read only. Others: read only. No one except root should write.",
    correctOwner: { r: true, w: true, x: false },
    correctGroup: { r: true, w: false, x: false },
    correctOthers: { r: true, w: false, x: false },
    explanation:
      "644 — rw-r--r-- : Standard for /etc/passwd. Root owns and writes; all others just read.",
  },
  {
    filename: "/usr/bin/sudo",
    filetype: "file",
    description: "Superuser elevation binary",
    scenario:
      "Root (owner) reads+writes+executes. Group 'sudo' reads+executes. Others read+execute. The setUID bit allows privilege elevation.",
    correctOwner: { r: true, w: true, x: true },
    correctGroup: { r: true, w: false, x: true },
    correctOthers: { r: true, w: false, x: true },
    explanation:
      "755 — rwxr-xr-x : Standard for system executables. Everyone can run it; only root can modify it.",
  },
  {
    filename: "/home/student/homework.txt",
    filetype: "file",
    description: "Student personal homework file",
    scenario:
      "The student (owner) should read and write their own file. No one else should have any access.",
    correctOwner: { r: true, w: true, x: false },
    correctGroup: { r: false, w: false, x: false },
    correctOthers: { r: false, w: false, x: false },
    explanation:
      "600 — rw------- : Maximum privacy for personal files. Only the owner can access it.",
  },
  {
    filename: "/var/www/html",
    filetype: "dir",
    description: "Public web server directory",
    scenario:
      "Admin (owner) needs full control. The 'www-data' group (web server) needs read+execute to serve files. Others get no access.",
    correctOwner: { r: true, w: true, x: true },
    correctGroup: { r: true, w: false, x: true },
    correctOthers: { r: false, w: false, x: false },
    explanation:
      "750 — rwxr-x--- : Web directories need owner full control, group can browse and read, others are blocked.",
  },
  {
    filename: "/tmp/shared_report.pdf",
    filetype: "file",
    description: "Shared report in temp directory",
    scenario:
      "Everyone on the system should be able to read this file. No one but the owner should write it.",
    correctOwner: { r: true, w: true, x: false },
    correctGroup: { r: true, w: false, x: false },
    correctOthers: { r: true, w: false, x: false },
    explanation:
      "644 — rw-r--r-- : The standard 'public read' permission. Owner writes; everyone reads.",
  },
  {
    filename: "/usr/local/myapp",
    filetype: "file",
    description: "Custom application binary",
    scenario:
      "Owner and group members should run and read the binary. Others have no access at all.",
    correctOwner: { r: true, w: true, x: true },
    correctGroup: { r: true, w: false, x: true },
    correctOthers: { r: false, w: false, x: false },
    explanation:
      "750 — rwxr-x--- : Restricts a private application to its owner+group. Useful for licensed software.",
  },
  {
    filename: "/etc/ssh/sshd_config",
    filetype: "file",
    description: "SSH server configuration file",
    scenario:
      "Only root (owner) should read and write this critical config. No one else should see it at all.",
    correctOwner: { r: true, w: true, x: false },
    correctGroup: { r: false, w: false, x: false },
    correctOthers: { r: false, w: false, x: false },
    explanation:
      "600 — rw------- : SSH config must be locked to root only. Exposing it to group or others is a security risk.",
  },
  {
    filename: "/public/downloads",
    filetype: "dir",
    description: "Public shared download folder",
    scenario:
      "Everyone should be able to read files and enter (execute) the directory. No one except the admin (owner) should be able to add or delete files.",
    correctOwner: { r: true, w: true, x: true },
    correctGroup: { r: true, w: false, x: true },
    correctOthers: { r: true, w: false, x: true },
    explanation:
      "755 — rwxr-xr-x : Standard public directory. Everyone can list and enter; only the owner modifies.",
  },
];

function permBitToOctal(p: PermBit): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
}

function permBitToString(p: PermBit): string {
  return `${p.r ? "r" : "-"}${p.w ? "w" : "-"}${p.x ? "x" : "-"}`;
}

function permsMatch(a: PermBit, b: PermBit): boolean {
  return a.r === b.r && a.w === b.w && a.x === b.x;
}

function FilePermissions({ config, onGameEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [owner, setOwner] = useState<PermBit>({ r: false, w: false, x: false });
  const [group, setGroup] = useState<PermBit>({ r: false, w: false, x: false });
  const [others, setOthers] = useState<PermBit>({
    r: false,
    w: false,
    x: false,
  });
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

  const scen = PERM_SCENARIOS[idx];

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = idx > 0 ? (correct / idx) * 100 : 50;
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
    [config, onGameEnd, correct, idx],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function toggle(role: "owner" | "group" | "others", bit: "r" | "w" | "x") {
    if (feedback) return;
    const setter =
      role === "owner" ? setOwner : role === "group" ? setGroup : setOthers;
    const current =
      role === "owner" ? owner : role === "group" ? group : others;
    setter({ ...current, [bit]: !current[bit] });
  }

  function handleCheck() {
    if (feedback) return;
    const ownerOk = permsMatch(owner, scen.correctOwner);
    const groupOk = permsMatch(group, scen.correctGroup);
    const othersOk = permsMatch(others, scen.correctOthers);
    const isCorrect = ownerOk && groupOk && othersOk;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 400 * config.difficulty);
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
      setOwner({ r: false, w: false, x: false });
      setGroup({ r: false, w: false, x: false });
      setOthers({ r: false, w: false, x: false });
      if (idx + 1 >= PERM_SCENARIOS.length) endGame(true);
      else setIdx(idx + 1);
    }, 2200);
  }

  const octal = `${permBitToOctal(owner)}${permBitToOctal(group)}${permBitToOctal(others)}`;
  const permString = `${permBitToString(owner)}${permBitToString(group)}${permBitToString(others)}`;
  const timePct = (timeLeft / config.timeLimit) * 100;

  function PermRow({
    label,
    perm,
    permRole,
  }: { label: string; perm: PermBit; permRole: "owner" | "group" | "others" }) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-12 shrink-0">
          {label}
        </span>
        {(["r", "w", "x"] as const).map((bit) => (
          <button
            key={bit}
            type="button"
            disabled={!!feedback}
            onClick={() => toggle(permRole, bit)}
            className="w-10 h-10 rounded-lg border-2 font-bold text-sm transition-all"
            style={{
              borderColor: perm[bit] ? "#10b981" : "rgba(100,100,120,0.4)",
              color: perm[bit] ? "#10b981" : "#6b7280",
              background: perm[bit]
                ? "rgba(16,185,129,0.12)"
                : "rgba(10,10,20,0.5)",
            }}
            data-ocid={`file_perm.${permRole}_${bit}`}
          >
            {bit}
          </button>
        ))}
        <span className="text-xs font-mono text-muted-foreground">
          {permBitToString(perm)}
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="file_permissions.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0 flex-wrap gap-2">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()} pts
        </span>
        {started && (
          <span className="text-xs text-muted-foreground">
            Puzzle {idx + 1}/{PERM_SCENARIOS.length}
          </span>
        )}
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
              className="h-full bg-[#10b981] transition-all duration-1000"
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
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full text-center">
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              File Permissions
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Toggle Unix permission bits (r/w/x) for Owner, Group, and Others
              to satisfy each scenario.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              The octal notation is calculated live. {PERM_SCENARIOS.length}{" "}
              scenarios total.
            </p>
            <div className="rounded-xl p-3 bg-muted/30 text-left text-xs font-mono mb-6">
              <p className="text-[#10b981]">$ ls -la /etc/passwd</p>
              <p className="text-foreground">
                -rw-r--r-- 1 root root 1234 /etc/passwd
              </p>
              <p className="text-muted-foreground mt-1">
                Owner=rw- | Group=r-- | Others=r-- | Octal=644
              </p>
            </div>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                startTime.current = Date.now();
                setStarted(true);
                startTimer();
              }}
              data-ocid="file_permissions.start_button"
            >
              Start Puzzles
            </GlowButton>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="flex flex-col gap-3"
            >
              <div className="glass-card rounded-xl p-3 border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#00f5ff]">
                    {scen.filetype === "dir" ? "d" : "-"}
                    {permString}
                  </span>
                  <span className="text-xs font-mono text-foreground">
                    {scen.filename}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {scen.description}
                </p>
              </div>
              <div className="glass-card rounded-xl p-3 border border-[#f59e0b]/20">
                <p className="text-xs uppercase tracking-widest text-[#f59e0b] mb-1">
                  Scenario
                </p>
                <p className="text-sm text-foreground">{scen.scenario}</p>
              </div>
              <div className="glass-card rounded-xl p-4 border border-border/40">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Set Permissions
                </p>
                <div className="space-y-2">
                  <PermRow label="Owner" perm={owner} permRole="owner" />
                  <PermRow label="Group" perm={group} permRole="group" />
                  <PermRow label="Others" perm={others} permRole="others" />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Octal:
                    </span>
                    <span className="text-lg font-black font-mono text-[#00f5ff]">
                      {octal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Notation:
                    </span>
                    <span className="text-sm font-mono text-foreground">
                      {permString}
                    </span>
                  </div>
                  <GlowButton
                    variant="primary"
                    size="sm"
                    onClick={handleCheck}
                    data-ocid="file_permissions.check_button"
                  >
                    Check
                  </GlowButton>
                </div>
              </div>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-3 border flex items-start gap-2 text-sm ${feedback === "correct" ? "border-[#10b981]/40 text-[#10b981]" : "border-[#f43f5e]/40 text-[#f43f5e]"}`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">
                      {feedback === "correct" ? "Correct!" : "Incorrect."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {scen.explanation}
                    </p>
                  </div>
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
// ROUTER
// ─────────────────────────────────────────────────────────

export default function OperatingSystem({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  if (gameId === "process-manager")
    return <TaskManager config={config} onGameEnd={onGameEnd} />;
  if (gameId === "os-quiz")
    return <FilePermissions config={config} onGameEnd={onGameEnd} />;
  // default: os-control-room
  return <OSCommander config={config} onGameEnd={onGameEnd} />;
}
