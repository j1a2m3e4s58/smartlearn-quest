import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

// --- ConstraintSolver ---

interface Person {
  id: string;
  name: string;
  avail: string[];
}

interface Meeting {
  id: string;
  label: string;
  needs: string[];
}

interface CSPuzzle {
  people: Person[];
  meetings: Meeting[];
  slots: string[];
  constraints: string[];
  solution: Record<string, string>;
}

const CS_PUZZLES: CSPuzzle[] = [
  {
    people: [
      { id: "p1", name: "Alice", avail: ["9am", "11am", "2pm"] },
      { id: "p2", name: "Bob", avail: ["10am", "11am", "3pm"] },
      { id: "p3", name: "Carol", avail: ["9am", "10am", "2pm", "3pm"] },
      { id: "p4", name: "David", avail: ["11am", "2pm", "3pm"] },
      { id: "p5", name: "Eve", avail: ["9am", "10am", "11am"] },
    ],
    meetings: [
      { id: "m1", label: "Math Review", needs: ["p1", "p2"] },
      { id: "m2", label: "Science Project", needs: ["p3", "p4"] },
      { id: "m3", label: "English Debate", needs: ["p2", "p5"] },
      { id: "m4", label: "Art Workshop", needs: ["p1", "p3"] },
    ],
    slots: ["9am", "10am", "11am", "2pm", "3pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Math Review must come before Science Project",
      "English Debate cannot be at 9am",
      "Art Workshop cannot be at the same time as Math Review",
    ],
    solution: { m1: "11am", m2: "2pm", m3: "10am", m4: "9am" },
  },
  {
    people: [
      { id: "p1", name: "Frank", avail: ["8am", "10am", "1pm"] },
      { id: "p2", name: "Grace", avail: ["8am", "9am", "1pm"] },
      { id: "p3", name: "Hank", avail: ["9am", "10am", "2pm"] },
      { id: "p4", name: "Ivy", avail: ["8am", "10am", "2pm"] },
      { id: "p5", name: "Jake", avail: ["9am", "1pm", "2pm"] },
    ],
    meetings: [
      { id: "m1", label: "Team Briefing", needs: ["p1", "p2"] },
      { id: "m2", label: "Lab Session", needs: ["p3", "p4"] },
      { id: "m3", label: "Study Hall", needs: ["p2", "p5"] },
      { id: "m4", label: "Review Board", needs: ["p1", "p4"] },
    ],
    slots: ["8am", "9am", "10am", "1pm", "2pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Team Briefing must come before Lab Session",
      "Study Hall cannot be at 8am",
      "Review Board cannot be at the same time as Team Briefing",
    ],
    solution: { m1: "8am", m2: "10am", m3: "9am", m4: "10am" },
  },
  {
    people: [
      { id: "p1", name: "Lena", avail: ["9am", "11am", "3pm"] },
      { id: "p2", name: "Mike", avail: ["10am", "11am", "2pm"] },
      { id: "p3", name: "Nina", avail: ["9am", "10am", "3pm"] },
      { id: "p4", name: "Omar", avail: ["11am", "2pm", "4pm"] },
      { id: "p5", name: "Pam", avail: ["9am", "10am", "4pm"] },
    ],
    meetings: [
      { id: "m1", label: "Planning Session", needs: ["p1", "p2"] },
      { id: "m2", label: "Data Analysis", needs: ["p3", "p4"] },
      { id: "m3", label: "Code Review", needs: ["p2", "p5"] },
      { id: "m4", label: "Design Sprint", needs: ["p1", "p3"] },
    ],
    slots: ["9am", "10am", "11am", "2pm", "4pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Planning Session before Data Analysis",
      "Code Review cannot be at 9am",
      "Design Sprint cannot coincide with Planning Session",
    ],
    solution: { m1: "11am", m2: "2pm", m3: "10am", m4: "9am" },
  },
  {
    people: [
      { id: "p1", name: "Quinn", avail: ["8am", "10am", "12pm"] },
      { id: "p2", name: "Rosa", avail: ["9am", "10am", "2pm"] },
      { id: "p3", name: "Sam", avail: ["8am", "9am", "12pm"] },
      { id: "p4", name: "Tara", avail: ["10am", "12pm", "2pm"] },
      { id: "p5", name: "Umar", avail: ["9am", "10am", "2pm"] },
    ],
    meetings: [
      { id: "m1", label: "Morning Standup", needs: ["p1", "p3"] },
      { id: "m2", label: "Product Demo", needs: ["p2", "p4"] },
      { id: "m3", label: "Sprint Planning", needs: ["p2", "p5"] },
      { id: "m4", label: "Retrospective", needs: ["p1", "p4"] },
    ],
    slots: ["8am", "9am", "10am", "12pm", "2pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Morning Standup before Product Demo",
      "Sprint Planning cannot be at 8am",
      "Retrospective cannot coincide with Morning Standup",
    ],
    solution: { m1: "8am", m2: "12pm", m3: "10am", m4: "12pm" },
  },
  {
    people: [
      { id: "p1", name: "Vera", avail: ["9am", "1pm", "3pm"] },
      { id: "p2", name: "Will", avail: ["10am", "1pm", "4pm"] },
      { id: "p3", name: "Xena", avail: ["9am", "10am", "3pm"] },
      { id: "p4", name: "Yuri", avail: ["10am", "3pm", "4pm"] },
      { id: "p5", name: "Zara", avail: ["9am", "1pm", "4pm"] },
    ],
    meetings: [
      { id: "m1", label: "Budget Review", needs: ["p1", "p2"] },
      { id: "m2", label: "Tech Sync", needs: ["p3", "p4"] },
      { id: "m3", label: "Client Call", needs: ["p2", "p5"] },
      { id: "m4", label: "Workshop", needs: ["p1", "p3"] },
    ],
    slots: ["9am", "10am", "1pm", "3pm", "4pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Budget Review before Tech Sync",
      "Client Call cannot be at 9am",
      "Workshop cannot coincide with Budget Review",
    ],
    solution: { m1: "1pm", m2: "3pm", m3: "4pm", m4: "9am" },
  },
  {
    people: [
      { id: "p1", name: "Anna", avail: ["8am", "11am", "2pm"] },
      { id: "p2", name: "Ben", avail: ["9am", "11am", "3pm"] },
      { id: "p3", name: "Cara", avail: ["8am", "9am", "2pm"] },
      { id: "p4", name: "Dan", avail: ["11am", "2pm", "3pm"] },
      { id: "p5", name: "Ella", avail: ["9am", "11am", "3pm"] },
    ],
    meetings: [
      { id: "m1", label: "Strategy Session", needs: ["p1", "p2"] },
      { id: "m2", label: "Risk Assessment", needs: ["p3", "p4"] },
      { id: "m3", label: "Feedback Round", needs: ["p2", "p5"] },
      { id: "m4", label: "Kickoff", needs: ["p1", "p3"] },
    ],
    slots: ["8am", "9am", "11am", "2pm", "3pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Strategy Session before Risk Assessment",
      "Feedback Round cannot be at 8am",
      "Kickoff cannot coincide with Strategy Session",
    ],
    solution: { m1: "11am", m2: "2pm", m3: "3pm", m4: "8am" },
  },
  {
    people: [
      { id: "p1", name: "Felix", avail: ["9am", "12pm", "3pm"] },
      { id: "p2", name: "Gina", avail: ["10am", "12pm", "4pm"] },
      { id: "p3", name: "Hugo", avail: ["9am", "10am", "4pm"] },
      { id: "p4", name: "Iris", avail: ["12pm", "3pm", "4pm"] },
      { id: "p5", name: "Joel", avail: ["9am", "10am", "3pm"] },
    ],
    meetings: [
      { id: "m1", label: "Product Sync", needs: ["p1", "p2"] },
      { id: "m2", label: "QA Testing", needs: ["p3", "p4"] },
      { id: "m3", label: "Demo Prep", needs: ["p2", "p5"] },
      { id: "m4", label: "Ops Review", needs: ["p1", "p3"] },
    ],
    slots: ["9am", "10am", "12pm", "3pm", "4pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Product Sync before QA Testing",
      "Demo Prep cannot be at 9am",
      "Ops Review cannot coincide with Product Sync",
    ],
    solution: { m1: "12pm", m2: "4pm", m3: "10am", m4: "9am" },
  },
  {
    people: [
      { id: "p1", name: "Kim", avail: ["8am", "10am", "1pm"] },
      { id: "p2", name: "Leo", avail: ["9am", "10am", "3pm"] },
      { id: "p3", name: "Mia", avail: ["8am", "9am", "1pm"] },
      { id: "p4", name: "Ned", avail: ["10am", "1pm", "3pm"] },
      { id: "p5", name: "Ora", avail: ["9am", "10am", "3pm"] },
    ],
    meetings: [
      { id: "m1", label: "Daily Standup", needs: ["p1", "p3"] },
      { id: "m2", label: "Architecture Review", needs: ["p2", "p4"] },
      { id: "m3", label: "Release Planning", needs: ["p2", "p5"] },
      { id: "m4", label: "Incident Debrief", needs: ["p1", "p4"] },
    ],
    slots: ["8am", "9am", "10am", "1pm", "3pm"],
    constraints: [
      "All required people must be available at the chosen slot",
      "No person can attend two meetings at the same time",
      "Daily Standup before Architecture Review",
      "Release Planning cannot be at 8am",
      "Incident Debrief cannot coincide with Daily Standup",
    ],
    solution: { m1: "8am", m2: "10am", m3: "9am", m4: "1pm" },
  },
];

function checkViolations(
  puzzle: CSPuzzle,
  assignments: Record<string, string>,
): string[] {
  const violations: string[] = [];
  for (const mtg of puzzle.meetings) {
    const slot = assignments[mtg.id];
    if (!slot) continue;
    for (const pid of mtg.needs) {
      const person = puzzle.people.find((p) => p.id === pid);
      if (person && !person.avail.includes(slot)) {
        violations.push(
          `${person.name} is not available at ${slot} for ${mtg.label}`,
        );
      }
    }
  }
  const slotToPeople: Record<string, Set<string>> = {};
  for (const mtg of puzzle.meetings) {
    const slot = assignments[mtg.id];
    if (!slot) continue;
    if (!slotToPeople[slot]) slotToPeople[slot] = new Set();
    for (const pid of mtg.needs) {
      if (slotToPeople[slot].has(pid)) {
        const person = puzzle.people.find((p) => p.id === pid);
        violations.push(
          `${person ? person.name : pid} is double-booked at ${slot}`,
        );
      }
      slotToPeople[slot].add(pid);
    }
  }
  return violations;
}

function ConstraintSolver({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "checked" | "over">(
    "idle",
  );
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [violations, setViolations] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [checkResult, setCheckResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const startRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;

  const endGame = useCallback(
    (done: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.round((scoreRef.current / CS_PUZZLES.length) * 100),
          Math.floor((Date.now() - startRef.current) / 1000),
          done,
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
    startTimer();
    setPhase("playing");
  }

  const puzzle = CS_PUZZLES[puzzleIdx];

  function assignSlot(slotLabel: string) {
    if (!selectedMeeting) return;
    setAssignments((prev) => ({ ...prev, [selectedMeeting]: slotLabel }));
    setSelectedMeeting(null);
    setViolations([]);
    setCheckResult(null);
  }

  function checkSolution() {
    const viols = checkViolations(puzzle, assignments);
    setViolations(viols);
    const allAssigned = puzzle.meetings.every((m) => assignments[m.id]);
    if (allAssigned && viols.length === 0) {
      setScore((s) => s + 1);
      setCheckResult("correct");
      setPhase("checked");
    } else {
      setCheckResult("wrong");
    }
  }

  function nextPuzzle() {
    const newIdx = puzzleIdx + 1;
    setCheckResult(null);
    setViolations([]);
    setAssignments({});
    setSelectedMeeting(null);
    if (newIdx >= CS_PUZZLES.length) {
      endGame(true);
      return;
    }
    setPuzzleIdx(newIdx);
    setPhase("playing");
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="constraint_solver.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
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
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Constraint Solver
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Schedule meetings by assigning time slots. All people must be
            available and no one can be double-booked. Satisfy all constraints
            to score.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-black"
            style={{ background: "#00f5ff" }}
            data-ocid="constraint_solver.start_button"
          >
            Start Scheduling
          </button>
        </motion.div>
      )}

      {(phase === "playing" || phase === "checked") && (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#00f5ff] font-mono">
              Score: {score} / {CS_PUZZLES.length}
            </span>
            <span className="text-muted-foreground">
              Puzzle {puzzleIdx + 1} / {CS_PUZZLES.length}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>

          <div className="rounded-xl border border-[#00f5ff]/20 bg-card/40 p-3">
            <p className="text-xs font-bold text-[#00f5ff] uppercase tracking-widest mb-2">
              Constraints
            </p>
            <ul className="space-y-0.5">
              {puzzle.constraints.map((c, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex gap-2"
                >
                  <span className="text-[#00f5ff]/60 shrink-0">{i + 1}.</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              People Availability
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-1 pr-3 font-semibold text-muted-foreground">
                      Person
                    </th>
                    {puzzle.slots.map((s) => (
                      <th
                        key={s}
                        className="px-2 py-1 font-semibold text-muted-foreground text-center"
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {puzzle.people.map((p) => (
                    <tr key={p.id} className="border-t border-border/20">
                      <td className="py-1 pr-3 font-medium">{p.name}</td>
                      {puzzle.slots.map((s) => (
                        <td key={s} className="px-2 py-1 text-center">
                          <div
                            className={
                              p.avail.includes(s)
                                ? "w-3 h-3 rounded-full mx-auto bg-[#10b981]"
                                : "w-3 h-3 rounded-full mx-auto bg-muted/40"
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {selectedMeeting
                ? "Click a time slot to assign"
                : "Click a meeting to select it"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {puzzle.meetings.map((m) => {
                const isActiveMeeting = selectedMeeting === m.id;
                const meetingBorderClass = isActiveMeeting
                  ? "border-[#00f5ff] bg-[#00f5ff]/10"
                  : "border-border/30 bg-card/60 hover:border-[#00f5ff]/40";
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      setSelectedMeeting(isActiveMeeting ? null : m.id)
                    }
                    className={`rounded-lg border-2 p-2 text-left text-xs transition-all ${meetingBorderClass}`}
                    data-ocid={`constraint_solver.meeting.${m.id}`}
                  >
                    <p className="font-bold text-foreground">{m.label}</p>
                    <p className="text-muted-foreground mt-0.5">
                      Needs:{" "}
                      {m.needs
                        .map(
                          (pid) =>
                            puzzle.people.find((p) => p.id === pid)?.name,
                        )
                        .join(", ")}
                    </p>
                    <p className="mt-1">
                      {assignments[m.id] ? (
                        <span className="text-[#10b981] font-bold">
                          {assignments[m.id]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedMeeting && (
              <div className="flex flex-wrap gap-2 mt-2">
                {puzzle.slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => assignSlot(s)}
                    className="px-3 py-1.5 rounded-lg border border-[#00f5ff]/40 bg-[#00f5ff]/10 text-[#00f5ff] text-xs font-bold hover:bg-[#00f5ff]/20 transition-all"
                    data-ocid={`constraint_solver.slot.${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {violations.length > 0 && (
            <div className="rounded-lg border border-[#f43f5e]/30 bg-[#f43f5e]/10 p-3 space-y-1">
              {violations.map((v, i) => (
                <p key={i} className="text-xs text-[#f43f5e]">
                  {v}
                </p>
              ))}
            </div>
          )}

          {phase === "checked" && checkResult === "correct" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 p-4"
            >
              <p className="text-[#10b981] font-bold">
                Perfect schedule! All constraints satisfied. +1 point
              </p>
              <button
                type="button"
                onClick={nextPuzzle}
                className="mt-2 px-5 py-2 rounded-lg font-bold text-sm text-black"
                style={{ background: "#10b981" }}
                data-ocid="constraint_solver.next_button"
              >
                Next Puzzle
              </button>
            </motion.div>
          )}

          {phase === "playing" && (
            <button
              type="button"
              onClick={checkSolution}
              className="w-full py-2.5 rounded-lg font-bold text-sm text-black hover:opacity-90"
              style={{ background: "#00f5ff" }}
              data-ocid="constraint_solver.check_button"
            >
              Check Solution
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// --- OptimizationMaster ---

interface KnapsackItem {
  id: string;
  name: string;
  w: number;
  v: number;
}

interface Challenge {
  limit: number;
  items: KnapsackItem[];
}

const CHALLENGES: Challenge[] = [
  {
    limit: 20,
    items: [
      { id: "a1", name: "First Aid Kit", w: 2, v: 80 },
      { id: "a2", name: "Water Bottles", w: 3, v: 90 },
      { id: "a3", name: "Radio", w: 5, v: 100 },
      { id: "a4", name: "Map", w: 1, v: 40 },
      { id: "a5", name: "Tent", w: 8, v: 120 },
      { id: "a6", name: "Food Rations", w: 4, v: 95 },
      { id: "a7", name: "Torch", w: 1, v: 60 },
      { id: "a8", name: "Rope", w: 3, v: 75 },
      { id: "a9", name: "Compass", w: 1, v: 50 },
      { id: "a10", name: "Blanket", w: 2, v: 55 },
    ],
  },
  {
    limit: 15,
    items: [
      { id: "b1", name: "Laptop", w: 3, v: 150 },
      { id: "b2", name: "Books", w: 4, v: 60 },
      { id: "b3", name: "Tablet", w: 1, v: 100 },
      { id: "b4", name: "Charger", w: 1, v: 70 },
      { id: "b5", name: "Notebook", w: 1, v: 30 },
      { id: "b6", name: "Camera", w: 2, v: 110 },
      { id: "b7", name: "Tripod", w: 3, v: 50 },
      { id: "b8", name: "Hard Drive", w: 1, v: 90 },
      { id: "b9", name: "Speaker", w: 2, v: 45 },
      { id: "b10", name: "Keyboard", w: 2, v: 80 },
    ],
  },
  {
    limit: 25,
    items: [
      { id: "c1", name: "Drill", w: 4, v: 85 },
      { id: "c2", name: "Saw", w: 5, v: 100 },
      { id: "c3", name: "Hammer", w: 2, v: 60 },
      { id: "c4", name: "Screwdriver Set", w: 1, v: 45 },
      { id: "c5", name: "Level", w: 1, v: 35 },
      { id: "c6", name: "Tape Measure", w: 1, v: 30 },
      { id: "c7", name: "Wrench Set", w: 3, v: 80 },
      { id: "c8", name: "Safety Goggles", w: 1, v: 50 },
      { id: "c9", name: "Work Gloves", w: 1, v: 40 },
      { id: "c10", name: "Clamp Set", w: 2, v: 55 },
    ],
  },
  {
    limit: 18,
    items: [
      { id: "d1", name: "Bread", w: 1, v: 25 },
      { id: "d2", name: "Canned Beans", w: 2, v: 40 },
      { id: "d3", name: "Rice Bag", w: 5, v: 55 },
      { id: "d4", name: "Cooking Oil", w: 3, v: 35 },
      { id: "d5", name: "Salt Pack", w: 1, v: 20 },
      { id: "d6", name: "Dried Fruit", w: 1, v: 60 },
      { id: "d7", name: "Protein Bars", w: 1, v: 75 },
      { id: "d8", name: "Pasta", w: 2, v: 30 },
      { id: "d9", name: "Instant Coffee", w: 1, v: 45 },
      { id: "d10", name: "Oats", w: 2, v: 40 },
    ],
  },
  {
    limit: 12,
    items: [
      { id: "e1", name: "Signal Mirror", w: 1, v: 90 },
      { id: "e2", name: "Whistle", w: 1, v: 80 },
      { id: "e3", name: "Fire Starter", w: 1, v: 100 },
      { id: "e4", name: "Water Filter", w: 2, v: 120 },
      { id: "e5", name: "Emergency Poncho", w: 1, v: 70 },
      { id: "e6", name: "Multi-Tool", w: 2, v: 110 },
      { id: "e7", name: "Paracord", w: 1, v: 65 },
      { id: "e8", name: "Tarp", w: 3, v: 85 },
      { id: "e9", name: "Headlamp", w: 1, v: 95 },
      { id: "e10", name: "Emergency Blanket", w: 1, v: 75 },
    ],
  },
  {
    limit: 30,
    items: [
      { id: "f1", name: "Solar Panel", w: 5, v: 130 },
      { id: "f2", name: "Battery Pack", w: 4, v: 115 },
      { id: "f3", name: "LED Strip", w: 1, v: 50 },
      { id: "f4", name: "Fan", w: 3, v: 70 },
      { id: "f5", name: "Inverter", w: 4, v: 125 },
      { id: "f6", name: "USB Hub", w: 1, v: 60 },
      { id: "f7", name: "Motion Sensor", w: 1, v: 85 },
      { id: "f8", name: "Smart Plug", w: 1, v: 75 },
      { id: "f9", name: "Cable Bundle", w: 2, v: 40 },
      { id: "f10", name: "Voltage Meter", w: 2, v: 80 },
    ],
  },
  {
    limit: 22,
    items: [
      { id: "g1", name: "Research Report", w: 1, v: 90 },
      { id: "g2", name: "Lab Equipment", w: 6, v: 140 },
      { id: "g3", name: "Sample Kits", w: 3, v: 95 },
      { id: "g4", name: "Microscope", w: 5, v: 130 },
      { id: "g5", name: "Data Logger", w: 2, v: 100 },
      { id: "g6", name: "Reference Books", w: 3, v: 55 },
      { id: "g7", name: "Specimen Jars", w: 2, v: 45 },
      { id: "g8", name: "Reagents", w: 2, v: 85 },
      { id: "g9", name: "Protective Gear", w: 2, v: 70 },
      { id: "g10", name: "Field Notes", w: 1, v: 50 },
    ],
  },
  {
    limit: 16,
    items: [
      { id: "h1", name: "Sketch Pad", w: 1, v: 35 },
      { id: "h2", name: "Watercolors", w: 1, v: 55 },
      { id: "h3", name: "Canvas Roll", w: 3, v: 70 },
      { id: "h4", name: "Oil Paints", w: 2, v: 90 },
      { id: "h5", name: "Easel", w: 5, v: 60 },
      { id: "h6", name: "Brushes Set", w: 1, v: 75 },
      { id: "h7", name: "Palette", w: 1, v: 40 },
      { id: "h8", name: "Fixative Spray", w: 1, v: 50 },
      { id: "h9", name: "Portfolio Case", w: 3, v: 80 },
      { id: "h10", name: "Reference Photos", w: 1, v: 45 },
    ],
  },
];

function greedyOptimal(challenge: Challenge): Set<string> {
  const sorted = [...challenge.items].sort((a, b) => b.v / b.w - a.v / a.w);
  let remaining = challenge.limit;
  const sel = new Set<string>();
  for (const item of sorted) {
    if (item.w <= remaining) {
      sel.add(item.id);
      remaining -= item.w;
    }
  }
  return sel;
}

function OptimizationMaster({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "submitted" | "over">(
    "idle",
  );
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [localTime, setLocalTime] = useState(60);
  const [score, setScore] = useState(0);
  const [optimal, setOptimal] = useState<Set<string>>(new Set());
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  scoreRef.current = score;
  phaseRef.current = phase;

  const endGame = useCallback(
    (done: boolean) => {
      if (phaseRef.current === "over") return;
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.round((scoreRef.current / CHALLENGES.length) * 100),
          Math.floor((Date.now() - startRef.current) / 1000),
          done,
        ),
      );
    },
    [config, onGameEnd],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    timerRef.current = setInterval(() => {
      setLocalTime((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function startGame() {
    startRef.current = Date.now();
    setPhase("playing");
    setLocalTime(60);
    startTimer();
  }

  const challenge = CHALLENGES[challengeIdx];
  const totalWeight = [...selected].reduce((sum, id) => {
    const item = challenge.items.find((i) => i.id === id);
    return sum + (item ? item.w : 0);
  }, 0);
  const totalValue = [...selected].reduce((sum, id) => {
    const item = challenge.items.find((i) => i.id === id);
    return sum + (item ? item.v : 0);
  }, 0);
  const remaining = challenge.limit - totalWeight;
  const overWeight = remaining < 0;

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submitSelection() {
    if (timerRef.current) clearInterval(timerRef.current);
    const opt = greedyOptimal(challenge);
    setOptimal(opt);
    const optValue = [...opt].reduce((sum, id) => {
      const item = challenge.items.find((i) => i.id === id);
      return sum + (item ? item.v : 0);
    }, 0);
    if (!overWeight && totalValue >= optValue * 0.85) {
      setScore((s) => s + 1);
    }
    setPhase("submitted");
  }

  function nextChallenge() {
    const newIdx = challengeIdx + 1;
    setSelected(new Set());
    setOptimal(new Set());
    if (newIdx >= CHALLENGES.length) {
      endGame(true);
      return;
    }
    setChallengeIdx(newIdx);
    setLocalTime(60);
    setPhase("playing");
    startTimer();
  }

  const optValue = [...optimal].reduce((sum, id) => {
    const item = challenge.items.find((i) => i.id === id);
    return sum + (item ? item.v : 0);
  }, 0);

  const weightBoxClass = overWeight
    ? "flex items-center justify-between rounded-xl border px-4 py-3 border-[#f43f5e]/40 bg-[#f43f5e]/10"
    : "flex items-center justify-between rounded-xl border px-4 py-3 border-[#10b981]/30 bg-[#10b981]/10";
  const weightTextClass = overWeight
    ? "text-xl font-black text-[#f43f5e]"
    : "text-xl font-black text-[#10b981]";
  const timerClass =
    localTime <= 10
      ? "tabular-nums font-bold text-sm text-[#f43f5e]"
      : "tabular-nums font-bold text-sm text-muted-foreground";

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="optimization_master.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Optimization Master
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Select items to maximize total value without exceeding the weight
            limit. 60 seconds per challenge. 8 challenges. Score based on how
            close you get to the optimal solution.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#10b981" }}
            data-ocid="optimization_master.start_button"
          >
            Start Challenges
          </button>
        </motion.div>
      )}

      {(phase === "playing" || phase === "submitted") && (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="flex items-center justify-between">
            <span className="text-[#10b981] font-mono text-sm">
              Score: {score} / {CHALLENGES.length}
            </span>
            <span className="text-muted-foreground text-sm">
              Challenge {challengeIdx + 1} / {CHALLENGES.length}
            </span>
            <span className={timerClass}>{localTime}s</span>
          </div>

          <div className={weightBoxClass}>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Weight
              </p>
              <p className={weightTextClass}>
                {totalWeight} / {challenge.limit} kg
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Value
              </p>
              <p className="text-xl font-black text-foreground">
                {totalValue} pts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {challenge.items.map((item) => {
              const isSelected = selected.has(item.id);
              const isOptimalItem = optimal.has(item.id);
              let borderClass: string;
              if (phase === "submitted") {
                if (isOptimalItem && isSelected)
                  borderClass = "border-[#10b981]";
                else if (isOptimalItem && !isSelected)
                  borderClass = "border-[#f59e0b]";
                else if (!isOptimalItem && isSelected)
                  borderClass = "border-[#f43f5e]";
                else borderClass = "border-border/20";
              } else {
                borderClass = isSelected
                  ? "border-[#10b981]"
                  : "border-border/30";
              }
              const bgClass = isSelected ? "bg-[#10b981]/10" : "bg-card/60";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => phase === "playing" && toggleItem(item.id)}
                  disabled={phase === "submitted"}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${borderClass} ${bgClass}`}
                  data-ocid={`optimization_master.item.${item.id}`}
                >
                  <p className="text-xs font-bold text-foreground truncate">
                    {item.name}
                  </p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {item.w} kg
                    </span>
                    <span className="text-xs font-bold text-[#10b981]">
                      {item.v} pts
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {phase === "playing" && (
            <button
              type="button"
              onClick={submitSelection}
              disabled={overWeight}
              className="w-full py-2.5 rounded-lg font-bold text-sm text-white disabled:opacity-40 hover:opacity-90"
              style={{ background: "#10b981" }}
              data-ocid="optimization_master.submit_button"
            >
              {overWeight ? "Over Weight Limit" : "Submit Selection"}
            </button>
          )}

          {phase === "submitted" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#10b981]/30 bg-card/40 p-4 space-y-2"
            >
              <p className="text-sm font-bold">
                Your value:{" "}
                <span className="text-[#10b981]">{totalValue} pts</span>
                {" | "}
                Optimal: <span className="text-[#f59e0b]">{optValue} pts</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {!overWeight && totalValue >= optValue * 0.85
                  ? "Excellent! Within 85% of optimal. +1 point awarded."
                  : overWeight
                    ? "Over weight limit. No point awarded."
                    : "Below 85% of optimal. No point. Yellow items were missed."}
              </p>
              <button
                type="button"
                onClick={nextChallenge}
                className="px-5 py-2 rounded-lg font-bold text-sm text-white"
                style={{ background: "#10b981" }}
                data-ocid="optimization_master.next_button"
              >
                Next Challenge
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Original: ChallengeGauntlet ---

type StageType = "constraint" | "optimization" | "path" | "balance";

interface Stage {
  id: string;
  type: StageType;
  title: string;
  description: string;
  solve: (input: number | string) => boolean;
  hintText: string;
  answerDisplay: string;
  inputLabel: string;
  inputType: "number" | "path";
  pathGrid?: number[][];
  pathStart?: [number, number];
  pathEnd?: [number, number];
}

function buildStages(difficulty: 1 | 2 | 3): Stage[] {
  const d = difficulty;
  return [
    {
      id: "constraint1",
      type: "constraint",
      title: "Resource Constraint",
      description: `You have ${
        d === 1 ? 100 : d === 2 ? 250 : 400
      } coins. Items cost 40, 60, and ${
        d === 1 ? 30 : d === 2 ? 70 : 110
      } coins. What is the maximum number of items you can buy (any combination)?`,
      hintText:
        d === 1
          ? "Try buying the two cheapest items: 40+30=70. Can you fit more?"
          : d === 2
            ? "Try greedy: many 40s then fill with others."
            : "Consider all permutations.",
      answerDisplay: d === 1 ? "3" : d === 2 ? "6" : "8",
      inputLabel: "Max items",
      inputType: "number",
      solve: (v) => {
        const val = Number(v);
        const ans = d === 1 ? 3 : d === 2 ? 6 : 8;
        return val === ans;
      },
    },
    {
      id: "opt1",
      type: "optimization",
      title: "Optimization Challenge",
      description: `A farmer has ${
        d === 1 ? 20 : d === 2 ? 50 : 80
      }m of fence. Wants to enclose a rectangular field of maximum area. If one side is ${
        d === 1 ? 6 : d === 2 ? 15 : 24
      }m, what is the other side (in meters)?`,
      hintText: "Perimeter = 2*(L+W). Solve for the other side.",
      answerDisplay: d === 1 ? "4" : d === 2 ? "10" : "16",
      inputLabel: "Other side (m)",
      inputType: "number",
      solve: (v) => {
        const val = Number(v);
        const ans = d === 1 ? 4 : d === 2 ? 10 : 16;
        return val === ans;
      },
    },
    {
      id: "balance1",
      type: "balance",
      title: "Balance Equation",
      description:
        d === 1
          ? "Left pan: 3x. Right pan: 21. Find x."
          : d === 2
            ? "Left pan: 5x + 10. Right pan: 40. Find x."
            : "Left pan: 4x - 8. Right pan: 3x + 6. Find x.",
      hintText:
        d === 1
          ? "3x=21 => x=7"
          : d === 2
            ? "5x=30 => x=6"
            : "4x-3x=6+8 => x=14",
      answerDisplay: d === 1 ? "7" : d === 2 ? "6" : "14",
      inputLabel: "x = ",
      inputType: "number",
      solve: (v) => {
        const val = Number(v);
        const ans = d === 1 ? 7 : d === 2 ? 6 : 14;
        return val === ans;
      },
    },
    {
      id: "path1",
      type: "path",
      title: "Minimum Path",
      description:
        "Find the minimum cost path from top-left to bottom-right. Move only right or down. What is the minimum total?",
      hintText:
        "Use dynamic programming: for each cell, take min(above, left) + current.",
      answerDisplay: d === 1 ? "15" : d === 2 ? "18" : "22",
      inputLabel: "Min total",
      inputType: "number",
      pathGrid:
        d === 1
          ? [
              [1, 3, 2],
              [4, 2, 1],
              [3, 2, 2],
            ]
          : d === 2
            ? [
                [2, 3, 1, 4],
                [1, 5, 2, 1],
                [4, 2, 1, 3],
                [1, 3, 2, 1],
              ]
            : [
                [1, 2, 4, 3, 1],
                [3, 1, 2, 4, 2],
                [2, 4, 1, 1, 3],
                [1, 2, 3, 2, 1],
                [4, 1, 2, 1, 2],
              ],
      pathStart: [0, 0],
      pathEnd: d === 1 ? [2, 2] : d === 2 ? [3, 3] : [4, 4],
      solve: (v) => {
        const val = Number(v);
        const ans = d === 1 ? 15 : d === 2 ? 18 : 22;
        return val === ans;
      },
    },
  ];
}

export default function ProblemSolving({ config, onGameEnd }: Props) {
  if (config.gameId === "constraint-solver") {
    return <ConstraintSolver config={config} onGameEnd={onGameEnd} />;
  }
  if (config.gameId === "optimization-master") {
    return <OptimizationMaster config={config} onGameEnd={onGameEnd} />;
  }
  return <ChallengeGauntlet config={config} onGameEnd={onGameEnd} />;
}

function ChallengeGauntlet({ config, onGameEnd }: Props) {
  const stages = buildStages(config.difficulty);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "hint" | null>(
    null,
  );
  const [hintUsed, setHintUsed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  livesRef.current = lives;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        stages.length > 0 ? (correctRef.current / stages.length) * 100 : 0;
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
    [config, onGameEnd, stages.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  const stage = stages[stageIdx];

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function submitAnswer() {
    if (!stage || input.trim() === "") return;
    const correct_ans = stage.solve(input.trim());
    if (correct_ans) {
      const pts = (hintUsed ? 150 : 300) * config.difficulty + timeLeft * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedback("correct");
      setTimeout(() => {
        if (stageIdx + 1 >= stages.length) {
          endGame(true);
          return;
        }
        setStageIdx((i) => i + 1);
        setInput("");
        setFeedback(null);
        setHintUsed(false);
      }, 1200);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      setFeedback("wrong");
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1500);
        return;
      }
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  function useHint() {
    setHintUsed(true);
    setFeedback("hint");
    setTimeout(() => setFeedback(null), 3000);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const stageColors: Record<StageType, string> = {
    constraint: "#00f5ff",
    optimization: "#f59e0b",
    path: "#10b981",
    balance: "#a855f7",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="problem_solving.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00f5ff] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
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
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Challenge Gauntlet
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Solve 4 escalating challenges: resource constraints, optimization,
            balance equations, and minimum-path problems. Use hints wisely, they
            reduce points.
          </p>
          <p className="text-xs text-muted-foreground">
            {stages.length} stages | Difficulty {config.difficulty}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            style={{ background: "#00f5ff", color: "black" }}
            data-ocid="problem_solving.start_button"
          >
            Enter Gauntlet
          </button>
        </motion.div>
      )}

      {phase === "playing" && stage && (
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#00f5ff] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <div className="flex gap-1">
              {stages.map((_, i) => (
                <div
                  key={`stage-${i}`}
                  className={`h-2 w-6 rounded-full ${
                    i < stageIdx
                      ? "bg-[#00f5ff]"
                      : i === stageIdx
                        ? "bg-[#00f5ff]/60"
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="tabular-nums text-muted-foreground">
              Lives: {lives} | {timeLeft}s
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stageIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4"
            >
              <div
                className="rounded-xl border bg-card/40 p-4"
                style={{ borderColor: `${stageColors[stage.type]}40` }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: stageColors[stage.type] }}
                >
                  {stage.type.toUpperCase()}
                </p>
                <p className="font-bold text-sm mb-1">{stage.title}</p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {stage.type === "path" && stage.pathGrid && (
                <div className="flex justify-center">
                  <div
                    className="grid gap-0.5"
                    style={{
                      gridTemplateColumns: `repeat(${stage.pathGrid[0].length}, 1fr)`,
                    }}
                  >
                    {stage.pathGrid.flat().map((val, i) => {
                      const r = Math.floor(i / stage.pathGrid![0].length);
                      const c = i % stage.pathGrid![0].length;
                      const isStart =
                        r === stage.pathStart![0] && c === stage.pathStart![1];
                      const isEnd =
                        r === stage.pathEnd![0] && c === stage.pathEnd![1];
                      return (
                        <div
                          key={`cell-${i}`}
                          className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-bold ${
                            isStart
                              ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                              : isEnd
                                ? "border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]"
                                : "border-border/30 bg-card/40"
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <label
                  htmlFor="problem-solving-input"
                  className="text-sm font-mono text-muted-foreground shrink-0"
                >
                  {stage.inputLabel}
                </label>
                <input
                  id="problem-solving-input"
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                  className="flex-1 rounded-lg border border-[#00f5ff]/30 bg-background px-3 py-2 text-sm font-mono focus:border-[#00f5ff] focus:outline-none"
                  placeholder="Your answer"
                  data-ocid="problem_solving.input"
                />
                <button
                  type="button"
                  onClick={submitAnswer}
                  className="px-4 py-2 rounded-lg font-bold text-sm text-black hover:opacity-90"
                  style={{ background: stageColors[stage.type] }}
                  data-ocid="problem_solving.submit_button"
                >
                  Submit
                </button>
              </div>

              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-[#10b981] font-bold"
                  >
                    Correct! +
                    {(hintUsed ? 150 : 300) * config.difficulty + timeLeft * 2}{" "}
                    pts
                  </motion.p>
                )}
                {feedback === "wrong" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-[#f43f5e] font-bold"
                  >
                    Incorrect. Try again! (Answer: {stage.answerDisplay})
                  </motion.p>
                )}
                {feedback === "hint" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-3 text-sm text-[#f59e0b]"
                  >
                    Hint: {stage.hintText}
                  </motion.div>
                )}
              </AnimatePresence>

              {!hintUsed && !feedback && (
                <button
                  type="button"
                  onClick={useHint}
                  className="self-start text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors"
                  data-ocid="problem_solving.hint_button"
                >
                  Use Hint (halves points)
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
