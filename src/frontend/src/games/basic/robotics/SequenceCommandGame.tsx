import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

const CMDS = [
  "Move Forward",
  "Turn Left",
  "Turn Right",
  "Wait",
  "Repeat",
] as const;
type Cmd = (typeof CMDS)[number];

interface Level {
  grid: number;
  startPos: [number, number];
  goalPos: [number, number];
  startDir: number; // 0=up 1=right 2=down 3=left
  solution: Cmd[];
  hint: string;
}

const LEVELS: Level[] = [
  {
    grid: 5,
    startPos: [2, 4],
    goalPos: [2, 0],
    startDir: 0,
    solution: ["Move Forward", "Move Forward", "Move Forward", "Move Forward"],
    hint: "Move straight to the top",
  },
  {
    grid: 5,
    startPos: [0, 4],
    goalPos: [4, 4],
    startDir: 1,
    solution: ["Move Forward", "Move Forward", "Move Forward", "Move Forward"],
    hint: "Move right across the grid",
  },
  {
    grid: 5,
    startPos: [0, 4],
    goalPos: [4, 0],
    startDir: 0,
    solution: [
      "Turn Right",
      "Move Forward",
      "Move Forward",
      "Move Forward",
      "Move Forward",
      "Turn Left",
      "Move Forward",
      "Move Forward",
      "Move Forward",
      "Move Forward",
    ],
    hint: "Turn right then go forward",
  },
  {
    grid: 5,
    startPos: [2, 4],
    goalPos: [4, 2],
    startDir: 0,
    solution: [
      "Move Forward",
      "Move Forward",
      "Turn Right",
      "Move Forward",
      "Move Forward",
    ],
    hint: "Move up then turn right",
  },
  {
    grid: 5,
    startPos: [0, 4],
    goalPos: [2, 0],
    startDir: 0,
    solution: [
      "Move Forward",
      "Move Forward",
      "Move Forward",
      "Move Forward",
      "Turn Right",
      "Move Forward",
      "Move Forward",
    ],
    hint: "Go forward then navigate to goal",
  },
];

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export default function SequenceCommandGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [levelIdx, setLevelIdx] = useState(0);
  const [sequence, setSequence] = useState<Cmd[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [running, setRunning] = useState(false);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [robotDir, setRobotDir] = useState(0);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const startRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const level = LEVELS[Math.min(levelIdx, LEVELS.length - 1)];

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          won ? 88 : 42,
          Math.floor((Date.now() - startRef.current) / 1000),
          won,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startRef.current = Date.now();
    setLevelIdx(0);
    setSequence([]);
    setScore(0);
    setLives(config.livesCount);
    setRobotPos(LEVELS[0].startPos);
    setRobotDir(LEVELS[0].startDir);
    setPhase("playing");
    startTimer();
  }

  function addCmd(cmd: Cmd) {
    if (running) return;
    setSequence((s) => [...s, cmd]);
  }

  function removeCmd(i: number) {
    if (running) return;
    setSequence((s) => s.filter((_, idx) => idx !== i));
  }

  async function runSequence() {
    if (running || sequence.length === 0) return;
    setRunning(true);
    let pos: [number, number] = [...level.startPos] as [number, number];
    let dir = level.startDir;
    const g = level.grid;

    for (let i = 0; i < sequence.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 400));
      const cmd = sequence[i];
      if (cmd === "Move Forward") {
        const [dx, dy] = DIRS[dir];
        const np: [number, number] = [pos[0] + dx, pos[1] + dy];
        if (np[0] >= 0 && np[0] < g && np[1] >= 0 && np[1] < g) pos = np;
        else {
          pos = np.map((v, idx) => Math.max(0, Math.min(g - 1, v))) as [
            number,
            number,
          ];
        }
      } else if (cmd === "Turn Left") {
        dir = (dir + 3) % 4;
      } else if (cmd === "Turn Right") {
        dir = (dir + 1) % 4;
      }
      setRobotPos([...pos] as [number, number]);
      setRobotDir(dir);
    }
    setActiveStep(-1);
    const reached = pos[0] === level.goalPos[0] && pos[1] === level.goalPos[1];
    if (reached) {
      setFlash("ok");
      const bonus =
        300 +
        timeLeft * 3 +
        Math.max(0, (level.solution.length - sequence.length) * 50);
      setScore((s) => s + bonus * config.difficulty);
      setTimeout(() => {
        setFlash(null);
        if (levelIdx + 1 >= LEVELS.length) {
          endGame(true);
          return;
        }
        const next = levelIdx + 1;
        setLevelIdx(next);
        setSequence([]);
        setRobotPos(LEVELS[next].startPos);
        setRobotDir(LEVELS[next].startDir);
        setRunning(false);
      }, 1500);
    } else {
      setFlash("err");
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 800);
        return nl;
      });
      setTimeout(() => {
        setFlash(null);
        setSequence([]);
        setRobotPos(level.startPos);
        setRobotDir(level.startDir);
        setRunning(false);
      }, 1200);
    }
  }

  const dirArrow = ["↑", "→", "↓", "←"];

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="sequence_command.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
          style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            Sequence Commander
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Drag command blocks into the sequence tray then press Run. Guide the
            robot from start to the goal marker. Fewer commands = higher score.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[#00f5ff] text-black font-bold hover:opacity-90 transition-colors"
            data-ocid="sequence_command.start_button"
          >
            Start Mission
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between text-sm shrink-0">
            <span className="font-mono text-[#00f5ff]">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">
              Level {levelIdx + 1}/5 | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="text-xs text-[#f59e0b] shrink-0">{level.hint}</div>
          <div className="flex gap-3 flex-1 min-h-0">
            <div
              className={`flex-1 rounded-xl border overflow-auto transition-all ${
                flash === "err"
                  ? "border-[#f43f5e] shadow-[0_0_16px_rgba(244,63,94,0.5)]"
                  : flash === "ok"
                    ? "border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "border-border/30"
              }`}
              data-ocid="sequence_command.grid"
            >
              <div
                className="p-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${level.grid},1fr)`,
                  gap: "2px",
                }}
              >
                {Array.from({ length: level.grid * level.grid }, (_, i) => {
                  const x = i % level.grid;
                  const y = Math.floor(i / level.grid);
                  const isRobot = robotPos[0] === x && robotPos[1] === y;
                  const isGoal =
                    level.goalPos[0] === x && level.goalPos[1] === y;
                  const isStart =
                    level.startPos[0] === x && level.startPos[1] === y;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded flex items-center justify-center text-sm font-bold border ${
                        isRobot
                          ? "bg-[#00f5ff]/20 border-[#00f5ff]"
                          : isGoal
                            ? "bg-[#10b981]/20 border-[#10b981]"
                            : isStart
                              ? "bg-[#f59e0b]/10 border-[#f59e0b]/30"
                              : "bg-card/30 border-border/20"
                      }`}
                    >
                      {isRobot ? dirArrow[robotDir] : isGoal ? "G" : ""}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-40 flex flex-col gap-2 shrink-0">
              <div className="text-xs text-muted-foreground font-semibold">
                COMMANDS
              </div>
              {CMDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => addCmd(cmd)}
                  className="px-2 py-1.5 rounded border border-[#00f5ff]/30 bg-[#00f5ff]/10 text-[#00f5ff] text-xs font-semibold hover:bg-[#00f5ff]/20 transition-colors"
                  data-ocid={`sequence_command.cmd_${cmd.toLowerCase().replace(/ /g, "_")}`}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <div className="text-xs text-muted-foreground font-semibold mb-1">
              SEQUENCE ({sequence.length})
            </div>
            <div className="flex flex-wrap gap-1 min-h-[32px] p-2 rounded-lg border border-border/30 bg-card/20">
              {sequence.map((cmd, i) => (
                <motion.button
                  key={i}
                  type="button"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: activeStep === i ? 1.1 : 1 }}
                  onClick={() => removeCmd(i)}
                  className={`px-2 py-0.5 rounded text-xs font-bold border transition-all ${
                    activeStep === i
                      ? "bg-[#f59e0b]/30 border-[#f59e0b] text-[#f59e0b]"
                      : "bg-card border-border/40 text-foreground"
                  }`}
                  data-ocid={`sequence_command.seq_item.${i + 1}`}
                >
                  {cmd}
                </motion.button>
              ))}
              {sequence.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Click commands above to add
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={runSequence}
              disabled={running || sequence.length === 0}
              className="flex-1 py-2 rounded-lg bg-[#10b981] text-black font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-colors"
              data-ocid="sequence_command.run_button"
            >
              Run Sequence
            </button>
            <button
              type="button"
              onClick={() => {
                if (!running) {
                  setSequence([]);
                  setRobotPos(level.startPos);
                  setRobotDir(level.startDir);
                }
              }}
              className="px-4 py-2 rounded-lg border border-border/40 text-muted-foreground text-sm hover:bg-muted/30 transition-colors"
              data-ocid="sequence_command.clear_button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {phase === "over" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div
            className="text-4xl font-black text-[#00f5ff]"
            style={{ fontFamily: "'Orbitron',sans-serif" }}
          >
            MISSION OVER
          </div>
          <div className="text-2xl font-bold text-foreground">
            {score.toLocaleString()} pts
          </div>
          <div className="text-muted-foreground text-sm">
            Levels completed: {levelIdx}/5
          </div>
        </motion.div>
      )}
    </div>
  );
}
