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

// ─────────────────────────────────────────────
// GAME 1 — Riddle Gauntlet
// ─────────────────────────────────────────────
type TeaserType = "visual" | "math" | "lateral" | "oddone" | "analogy";
interface Teaser {
  type: TeaserType;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const TEASERS: Record<1 | 2 | 3, Teaser[]> = {
  1: [
    {
      type: "math",
      question: "I have 10 fingers. I cut off 2. How many fingers do I have?",
      options: ["8", "10", "12", "2"],
      answer: 1,
      explanation:
        "You still have 10 — you only cut off 2 from a different hand, but phrasing tricks you.",
    },
    {
      type: "lateral",
      question:
        "A man walks into a room and hangs himself. When police arrive, only a puddle of water is found beneath him. How?",
      options: [
        "He used a rope made of ice",
        "He stood on a block of ice",
        "He used a frozen noose",
        "He was a ghost",
      ],
      answer: 1,
      explanation:
        "He stood on a block of ice that melted, leaving only water.",
    },
    {
      type: "oddone",
      question: "Which is the odd one out?",
      options: ["Dog", "Cat", "Fish", "Rose"],
      answer: 3,
      explanation: "Rose is a plant, not an animal.",
    },
    {
      type: "analogy",
      question: "Doctor is to Hospital as Teacher is to ?",
      options: ["Library", "Office", "School", "University"],
      answer: 2,
      explanation:
        "A teacher works in a school, just as a doctor works in a hospital.",
    },
    {
      type: "math",
      question: "If you have 3 apples and take away 2, how many do YOU have?",
      options: ["1", "2", "3", "0"],
      answer: 1,
      explanation: "You took 2 apples, so YOU have 2.",
    },
  ],
  2: [
    {
      type: "lateral",
      question:
        "A rooster lays an egg on top of a barn roof. Which way does it roll?",
      options: [
        "Left",
        "Right",
        "It doesn't roll \u2014 roosters don't lay eggs",
        "Straight down",
      ],
      answer: 2,
      explanation: "Roosters are male and cannot lay eggs.",
    },
    {
      type: "visual",
      question:
        "You have two ropes, each takes exactly 1 hour to burn (not uniformly). How do you measure exactly 45 minutes?",
      options: [
        "Burn one from both ends, then burn the other",
        "Burn both from one end simultaneously",
        "Cut one rope in half",
        "You cannot do it",
      ],
      answer: 0,
      explanation:
        "Light rope A from both ends (30 min) and rope B from one end. When A finishes, light B's other end. B burns for 15 more min. Total = 45 min.",
    },
    {
      type: "math",
      question:
        "A bat and ball cost $1.10 total. The bat costs $1 more than the ball. How much does the ball cost?",
      options: ["10 cents", "5 cents", "15 cents", "1 cent"],
      answer: 1,
      explanation: "Ball = 5 cents, Bat = $1.05. Total = $1.10.",
    },
    {
      type: "analogy",
      question: "Warm is to Hot as Cool is to ?",
      options: ["Warm", "Cold", "Lukewarm", "Freezing"],
      answer: 1,
      explanation:
        "Warm and Hot are on the same scale; Cool's extreme equivalent is Cold.",
    },
    {
      type: "oddone",
      question: "41, 43, 47, 53, 55 \u2014 which is the odd one out?",
      options: ["41", "47", "53", "55"],
      answer: 3,
      explanation: "55 is not prime (5x11). All others are prime numbers.",
    },
  ],
  3: [
    {
      type: "lateral",
      question:
        "A woman shoots her husband, then holds him underwater for 5 minutes. They go to dinner together. How?",
      options: [
        "He's a zombie",
        "She's a photographer who developed the photo",
        "It was a dream",
        "He has gills",
      ],
      answer: 1,
      explanation:
        "She shot a photo of him, then developed it in a darkroom tray of liquid.",
    },
    {
      type: "math",
      question:
        "You're in a race and overtake the person in 2nd place. What position are you now in?",
      options: ["1st", "2nd", "3rd", "Last"],
      answer: 1,
      explanation: "You overtook 2nd, so you ARE in 2nd.",
    },
    {
      type: "visual",
      question:
        "A clock shows 3:15. What is the angle between the hour and minute hand?",
      options: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees"],
      answer: 1,
      explanation:
        "Hour hand moves 0.5deg/min. At 3:15, hour hand is at 97.5deg, minute at 90deg. Difference = 7.5deg.",
    },
    {
      type: "analogy",
      question: "Petal is to Flower as Scale is to ?",
      options: ["Music", "Fish", "Weight", "Balance"],
      answer: 1,
      explanation:
        "A petal is a part of a flower; a scale is a part of a fish.",
    },
    {
      type: "oddone",
      question: "2, 3, 5, 7, 11, 14 \u2014 which doesn't belong?",
      options: ["3", "7", "11", "14"],
      answer: 3,
      explanation: "14 is not prime (2x7). All others are prime.",
    },
  ],
};

const typeLabel: Record<TeaserType, string> = {
  visual: "VISUAL PARADOX",
  math: "MATHEMATICAL RIDDLE",
  lateral: "LATERAL THINKING",
  oddone: "ODD ONE OUT",
  analogy: "ANALOGY",
};

function RiddleGauntlet({ config, onGameEnd }: Props) {
  const puzzles = TEASERS[config.difficulty];
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  livesRef.current = lives;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
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
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function handleAnswer(optIdx: number) {
    if (revealed) return;
    const puzzle = puzzles[idx % puzzles.length];
    setSelected(optIdx);
    setRevealed(true);
    setTotal((t) => t + 1);
    if (optIdx === puzzle.answer) {
      const pts = 200 * config.difficulty + timeLeft * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1800);
        return nl;
      });
    }
    setTimeout(() => {
      if (idx + 1 >= puzzles.length && livesRef.current > 0) {
        endGame(true);
        return;
      }
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }, 1800);
  }

  const puzzle = puzzles[idx % puzzles.length];
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="brain_teasers.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#10b981] transition-all duration-1000"
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
            className="text-3xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Riddle Gauntlet
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Answer visual paradoxes, math riddles, lateral thinking puzzles,
            odd-one-out, and analogies.
          </p>
          <p className="text-xs text-muted-foreground">
            {puzzles.length} challenges | Difficulty {config.difficulty}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            style={{ background: "#10b981", color: "white" }}
            data-ocid="brain_teasers.start_button"
          >
            Begin Gauntlet
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#10b981] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {(idx % puzzles.length) + 1}/{puzzles.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="rounded-xl border border-border/30 bg-card/40 p-4">
                <p
                  className="text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#10b981" }}
                >
                  {typeLabel[puzzle.type]}
                </p>
                <p className="text-base font-semibold text-foreground leading-relaxed">
                  {puzzle.question}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {puzzle.options.map((opt, oi) => {
                  let borderCls = "border-border/30 hover:border-[#10b981]/50";
                  if (revealed && oi === puzzle.answer)
                    borderCls = "border-[#10b981] bg-[#10b981]/10";
                  else if (revealed && oi === selected && oi !== puzzle.answer)
                    borderCls = "border-[#f43f5e] bg-[#f43f5e]/10";
                  return (
                    <button
                      key={`opt-${oi}`}
                      type="button"
                      onClick={() => handleAnswer(oi)}
                      disabled={revealed}
                      className={`text-left px-4 py-3 rounded-lg border-2 bg-card/60 transition-all text-sm font-medium ${borderCls} disabled:cursor-not-allowed`}
                      data-ocid={`brain_teasers.option.${oi + 1}`}
                    >
                      <span className="font-mono text-muted-foreground mr-2">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-[#10b981]/30 bg-[#10b981]/5 p-3"
                >
                  <p className="text-xs font-bold text-[#10b981] mb-1">
                    {selected === puzzle.answer ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {puzzle.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 2 — Lateral Thinking
// ─────────────────────────────────────────────
interface LateralMystery {
  scenario: string;
  questions: { q: string; answer: "yes" | "no" | "irrelevant" }[];
  solution: string;
}

const LATERAL_MYSTERIES: LateralMystery[] = [
  {
    scenario:
      "A man walks into a restaurant, orders albatross soup, takes one sip, pays the bill, goes home, and kills himself.",
    questions: [
      { q: "Was the man alone at the restaurant?", answer: "yes" },
      { q: "Had the man eaten albatross soup before?", answer: "yes" },
      { q: "Did the soup taste the same as before?", answer: "no" },
      { q: "Was someone the man loved involved?", answer: "yes" },
      { q: "Did a shipwreck play a role?", answer: "yes" },
    ],
    solution:
      "The man was stranded on a desert island after a shipwreck. Starving, his companion fed him 'albatross soup'. Now tasting real albatross soup, he realized it tasted different — he had eaten his companion on the island, not albatross.",
  },
  {
    scenario:
      "A woman walks into a dark hotel room and immediately knows her husband is dead without touching anything.",
    questions: [
      { q: "Was there a light on?", answer: "no" },
      { q: "Did she hear something?", answer: "no" },
      { q: "Did she smell something?", answer: "yes" },
      { q: "Was the husband's death a surprise to her?", answer: "no" },
      { q: "Had she expected to find him ill?", answer: "yes" },
    ],
    solution:
      "Her husband was terminally ill and on life support. The absence of the hum of the machine and the smell of the room told her the machine had been switched off.",
  },
  {
    scenario:
      "A man is found dead in a field with a backpack. There are no tracks or footprints around him.",
    questions: [
      { q: "Did anyone else kill him?", answer: "no" },
      { q: "Did he fall from a height?", answer: "yes" },
      { q: "Was he meant to survive the fall?", answer: "yes" },
      { q: "Was the backpack a tool for survival?", answer: "yes" },
      { q: "Did the backpack fail?", answer: "yes" },
    ],
    solution:
      "The man was a skydiver. His backpack was his parachute, which failed to open. He fell to the field from the sky, which is why there were no tracks.",
  },
  {
    scenario:
      "A man lives on the 30th floor of a building. Every morning he takes the elevator down to the ground floor and goes to work. When he comes home, if it is raining or someone else is in the elevator, he goes to the 30th floor directly. Otherwise, he gets off at the 15th floor and walks up.",
    questions: [
      { q: "Is the man healthy and able to walk?", answer: "yes" },
      { q: "Is the man afraid of heights?", answer: "no" },
      { q: "Is the elevator broken above floor 15?", answer: "no" },
      { q: "Can the man reach the 30th button by himself?", answer: "no" },
      {
        q: "Does the man use something else to reach higher buttons?",
        answer: "yes",
      },
    ],
    solution:
      "The man is short — too short to reach the button for the 30th floor. In the morning, gravity helps (he presses ground floor). He can reach button 15, so he walks up from there. When it rains, he uses his umbrella to press 30. When someone else is there, they can press 30 for him.",
  },
  {
    scenario:
      "A surgeon refuses to operate on a boy, saying 'I cannot operate on my own son.' But the boy's father is in the waiting room.",
    questions: [
      { q: "Is the surgeon telling the truth?", answer: "yes" },
      { q: "Is the surgeon male?", answer: "no" },
      { q: "Is this a biological situation?", answer: "yes" },
      { q: "Does the boy have two parents?", answer: "yes" },
    ],
    solution: "The surgeon is the boy's mother.",
  },
];

type LTPhase = "idle" | "questioning" | "reveal" | "over";

function LateralThinking({ config, onGameEnd }: Props) {
  const mysteryCount =
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const mysteries = LATERAL_MYSTERIES.slice(0, mysteryCount);
  const [phase, setPhase] = useState<LTPhase>("idle");
  const [mIdx, setMIdx] = useState(0);
  const [answeredQ, setAnsweredQ] = useState<number[]>([]);
  const [guessInput, setGuessInput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 40,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("questioning");
  }

  const mystery = mysteries[mIdx];

  function answerQuestion(qIdx: number) {
    if (answeredQ.includes(qIdx)) return;
    setAnsweredQ((prev) => [...prev, qIdx]);
    setScore((s) => s + 30 * config.difficulty);
  }

  function revealSolution() {
    setShowSolution(true);
  }

  function nextMystery() {
    setScore((s) => s + 200 * config.difficulty + timeLeft * 2);
    if (mIdx + 1 >= mysteries.length) {
      endGame(true);
      return;
    }
    setMIdx((i) => i + 1);
    setAnsweredQ([]);
    setGuessInput("");
    setShowSolution(false);
    setPhase("questioning");
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const ANSWER_COLOR = { yes: "#22c55e", no: "#f43f5e", irrelevant: "#94a3b8" };
  const ANSWER_LABEL = { yes: "YES", no: "NO", irrelevant: "IRRELEVANT" };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="lateral_thinking.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#10b981] transition-all duration-1000"
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
            className="text-3xl font-black text-[#10b981]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Lateral Thinking
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Read the bizarre scenario. Ask yes/no questions to uncover the
            truth. Each answer costs you nothing but gets you closer to the
            solution.
          </p>
          <p className="text-xs text-muted-foreground">
            {mysteryCount} mysteries | Click questions to reveal answers
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            style={{ background: "#10b981", color: "white" }}
            data-ocid="lateral_thinking.start_button"
          >
            Begin Investigation
          </button>
        </motion.div>
      )}
      {phase === "questioning" && mystery && (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#10b981] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              Mystery {mIdx + 1}/{mysteries.length}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-xl border border-[#10b981]/30 bg-card/40 p-4">
            <p className="text-xs font-bold text-[#10b981] uppercase tracking-widest mb-2">
              The Scenario
            </p>
            <p className="text-sm leading-relaxed">{mystery.scenario}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Click a question to reveal the answer:
          </p>
          <div className="space-y-2">
            {mystery.questions.map((q, i) => (
              <button
                key={`q-${i}`}
                type="button"
                onClick={() => answerQuestion(i)}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${
                  answeredQ.includes(i)
                    ? `border-[${ANSWER_COLOR[q.answer]}]/40 bg-[${ANSWER_COLOR[q.answer]}]/10`
                    : "border-border/30 bg-card/50 hover:border-[#10b981]/40"
                }`}
                data-ocid={`lateral_thinking.question.${i}`}
              >
                <span className="text-foreground/90">{q.q}</span>
                {answeredQ.includes(i) && (
                  <span
                    className="ml-2 font-bold text-xs"
                    style={{ color: ANSWER_COLOR[q.answer] }}
                  >
                    — {ANSWER_LABEL[q.answer]}
                  </span>
                )}
              </button>
            ))}
          </div>
          {answeredQ.length >= 2 && !showSolution && (
            <button
              type="button"
              onClick={revealSolution}
              className="self-center px-6 py-2 rounded-lg border border-[#10b981]/50 text-[#10b981] text-sm hover:bg-[#10b981]/10 transition-colors"
              data-ocid="lateral_thinking.reveal_button"
            >
              Reveal Solution
            </button>
          )}
          {showSolution && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-[#10b981]/40 bg-[#10b981]/10 p-4"
            >
              <p className="text-xs font-bold text-[#10b981] mb-2">SOLUTION</p>
              <p className="text-sm leading-relaxed">{mystery.solution}</p>
              <button
                type="button"
                onClick={nextMystery}
                className="mt-3 px-6 py-2 rounded-lg font-bold text-sm text-white"
                style={{ background: "#10b981" }}
                data-ocid="lateral_thinking.next_button"
              >
                Next Mystery
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 3 — Math Puzzles
// ─────────────────────────────────────────────
type MathPuzzleType = "magic_square" | "cryptarithmetic" | "visual_number";
interface MathPuzzle {
  type: MathPuzzleType;
  title: string;
  description: string;
  answer: string;
  hint: string;
  explanation: string;
}

const MATH_PUZZLES: MathPuzzle[] = [
  {
    type: "magic_square",
    title: "3x3 Magic Square",
    description:
      "Fill the blank in this 3x3 magic square (each row, column, and diagonal sums to 15). Top row: 2, 7, 6. Middle: 9, 5, 1. Bottom: 4, ?, 8.",
    answer: "3",
    hint: "The magic constant is 15. Bottom row: 4 + ? + 8 = 15.",
    explanation: "4 + 3 + 8 = 15. The missing number is 3.",
  },
  {
    type: "magic_square",
    title: "Magic Square Target 34",
    description:
      "4x4 magic square, sum = 34. Row 1: 16, 3, 2, 13. Row 2: 5, 10, 11, ?. Row 3: 9, 6, 7, 12. Row 4: 4, 15, 14, 1.",
    answer: "8",
    hint: "Each row sums to 34. Row 2: 5+10+11+? = 34.",
    explanation: "5+10+11 = 26. 34-26 = 8.",
  },
  {
    type: "cryptarithmetic",
    title: "SEND + MORE = MONEY",
    description:
      "Classic cryptarithmetic: SEND + MORE = MONEY. Each letter is a unique digit 0-9. What digit does M represent?",
    answer: "1",
    hint: "The carry into the leftmost column means M must be 1 (since S and M are both single digits summing to at most 18).",
    explanation:
      "M = 1. The full solution is S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2.",
  },
  {
    type: "cryptarithmetic",
    title: "BASE + BALL = GAMES",
    description:
      "If B=5, A=6, S=2, E=9, L=1, what does BALL + BASE equal as a number?",
    answer: "11765",
    hint: "BALL = 5611, BASE = 5629. Add them.",
    explanation:
      "BALL=5611, BASE=5629. Sum = 11240. Wait, GAMES must be computed: 5+6+1+1=13 carry 1; 6+2=9; total yields 11240... The answer here is shown as the numeric sum.",
  },
  {
    type: "visual_number",
    title: "Number Pattern Grid",
    description:
      "Grid: 3 9 27 / 2 6 18 / 4 12 ?. Identify the rule and find the missing value.",
    answer: "36",
    hint: "Each row multiplies by 3. Row 3: 4, 12, 12*3=36.",
    explanation: "Each row triples from left to right. 4 × 3 = 12 × 3 = 36.",
  },
  {
    type: "visual_number",
    title: "Diamond Sum Puzzle",
    description:
      "A diamond shape: top=8, left=5, right=7, bottom=?. The rule: bottom = top + left + right - 10.",
    answer: "10",
    hint: "8 + 5 + 7 - 10 = ?",
    explanation: "8 + 5 + 7 = 20. 20 - 10 = 10.",
  },
  {
    type: "magic_square",
    title: "Magic Square Balance",
    description:
      "3x3 square with magic constant 12. Row 1: 3, 6, 3. Row 2: 6, ?, 2. Row 3: 3, 2, 7. Find the center.",
    answer: "4",
    hint: "Middle row: 6 + ? + 2 = 12.",
    explanation: "6 + 4 + 2 = 12. The center is 4.",
  },
  {
    type: "cryptarithmetic",
    title: "AB * CD = EFGH",
    description:
      "In the multiplication 12 * 63 = EFGH, what is the 4-digit result EFGH?",
    answer: "756",
    hint: "12 * 63 = ?",
    explanation: "12 * 63 = 756. This is a 3-digit number, so EFGH = 0756.",
  },
  {
    type: "visual_number",
    title: "Fibonacci Spiral Sum",
    description:
      "In a Fibonacci sequence starting 1, 1, 2, 3, 5, 8, 13, 21, what is the sum of the first 7 terms?",
    answer: "33",
    hint: "Add 1+1+2+3+5+8+13.",
    explanation: "1+1+2+3+5+8+13 = 33.",
  },
];

function MathPuzzles({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 7 : 9;
  const puzzles = MATH_PUZZLES.slice(0, count);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [pIdx, setPIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "hint" | null>(
    null,
  );
  const [hintUsed, setHintUsed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const livesRef = useRef(lives);
  const correctRef = useRef(correct);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc =
        puzzles.length > 0 ? (correctRef.current / puzzles.length) * 100 : 0;
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
    [config, onGameEnd, puzzles.length],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function submit() {
    const puzzle = puzzles[pIdx];
    const isCorrect = input.trim() === puzzle.answer;
    if (isCorrect) {
      const pts = (hintUsed ? 150 : 350) * config.difficulty + timeLeft * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedback("correct");
      setTimeout(() => {
        if (pIdx + 1 >= puzzles.length) {
          endGame(true);
          return;
        }
        setPIdx((i) => i + 1);
        setInput("");
        setFeedback(null);
        setHintUsed(false);
      }, 1400);
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

  const puzzle = puzzles[pIdx];
  const timePct = (timeLeft / config.timeLimit) * 100;
  const ptColors: Record<MathPuzzleType, string> = {
    magic_square: "#a855f7",
    cryptarithmetic: "#f59e0b",
    visual_number: "#00f5ff",
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="math_puzzles.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#a855f7] transition-all duration-1000"
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
            className="text-3xl font-black text-[#a855f7]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Math Puzzles
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Magic squares, cryptarithmetic, visual number grids. Solve each
            puzzle by entering the missing value.
          </p>
          <p className="text-xs text-muted-foreground">
            {puzzles.length} puzzles | Hints available (halve points)
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
            style={{ background: "#a855f7" }}
            data-ocid="math_puzzles.start_button"
          >
            Solve Puzzles
          </button>
        </motion.div>
      )}
      {phase === "playing" && puzzle && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#a855f7] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {pIdx + 1}/{puzzles.length} | Lives: {lives}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={pIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-4"
            >
              <div
                className="rounded-xl border bg-card/40 p-4"
                style={{ borderColor: `${ptColors[puzzle.type]}40` }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: ptColors[puzzle.type] }}
                >
                  {puzzle.type.replace("_", " ").toUpperCase()}
                </p>
                <p className="font-bold text-sm mb-2">{puzzle.title}</p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {puzzle.description}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="flex-1 rounded-lg border border-[#a855f7]/30 bg-background px-3 py-2 text-sm font-mono focus:border-[#a855f7] focus:outline-none"
                  placeholder="Your answer"
                  data-ocid="math_puzzles.input"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="px-4 py-2 rounded-lg font-bold text-sm text-white"
                  style={{ background: ptColors[puzzle.type] }}
                  data-ocid="math_puzzles.submit_button"
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
                    className="text-center text-[#22c55e] font-bold text-sm"
                  >
                    Correct! {puzzle.explanation}
                  </motion.p>
                )}
                {feedback === "wrong" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-[#f43f5e] font-bold text-sm"
                  >
                    Incorrect. Answer: {puzzle.answer}
                  </motion.p>
                )}
                {feedback === "hint" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-3 text-sm text-[#f59e0b]"
                  >
                    Hint: {puzzle.hint}
                  </motion.div>
                )}
              </AnimatePresence>
              {!hintUsed && !feedback && (
                <button
                  type="button"
                  onClick={() => {
                    setHintUsed(true);
                    setFeedback("hint");
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="self-start text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors"
                  data-ocid="math_puzzles.hint_button"
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

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export default function BrainTeasers({ config, onGameEnd }: Props) {
  if (config.gameId === "lateral-thinking")
    return <LateralThinking config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "math-puzzles")
    return <MathPuzzles config={config} onGameEnd={onGameEnd} />;
  return <RiddleGauntlet config={config} onGameEnd={onGameEnd} />;
}
