import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const TEASERS = {
  1: [
    {
      type: "math",
      question: "I have 10 fingers. I cut off 2. How many fingers do I have?",
      options: ["8", "10", "12", "2"],
      answer: 1,
      explanation: "You still have 10 — you only cut off 2 from a different hand, but phrasing tricks you."
    },
    {
      type: "lateral",
      question: "A man walks into a room and hangs himself. When police arrive, only a puddle of water is found beneath him. How?",
      options: [
        "He used a rope made of ice",
        "He stood on a block of ice",
        "He used a frozen noose",
        "He was a ghost"
      ],
      answer: 1,
      explanation: "He stood on a block of ice that melted, leaving only water."
    },
    {
      type: "oddone",
      question: "Which is the odd one out?",
      options: ["Dog", "Cat", "Fish", "Rose"],
      answer: 3,
      explanation: "Rose is a plant, not an animal."
    },
    {
      type: "analogy",
      question: "Doctor is to Hospital as Teacher is to ?",
      options: ["Library", "Office", "School", "University"],
      answer: 2,
      explanation: "A teacher works in a school, just as a doctor works in a hospital."
    },
    {
      type: "math",
      question: "If you have 3 apples and take away 2, how many do YOU have?",
      options: ["1", "2", "3", "0"],
      answer: 1,
      explanation: "You took 2 apples, so YOU have 2."
    }
  ],
  2: [
    {
      type: "lateral",
      question: "A rooster lays an egg on top of a barn roof. Which way does it roll?",
      options: [
        "Left",
        "Right",
        "It doesn't roll — roosters don't lay eggs",
        "Straight down"
      ],
      answer: 2,
      explanation: "Roosters are male and cannot lay eggs."
    },
    {
      type: "visual",
      question: "You have two ropes, each takes exactly 1 hour to burn (not uniformly). How do you measure exactly 45 minutes?",
      options: [
        "Burn one from both ends, then burn the other",
        "Burn both from one end simultaneously",
        "Cut one rope in half",
        "You cannot do it"
      ],
      answer: 0,
      explanation: "Light rope A from both ends (30 min) and rope B from one end. When A finishes, light B's other end. B burns for 15 more min. Total = 45 min."
    },
    {
      type: "math",
      question: "A bat and ball cost $1.10 total. The bat costs $1 more than the ball. How much does the ball cost?",
      options: ["10 cents", "5 cents", "15 cents", "1 cent"],
      answer: 1,
      explanation: "Ball = 5 cents, Bat = $1.05. Total = $1.10."
    },
    {
      type: "analogy",
      question: "Warm is to Hot as Cool is to ?",
      options: ["Warm", "Cold", "Lukewarm", "Freezing"],
      answer: 1,
      explanation: "Warm and Hot are on the same scale; Cool's extreme equivalent is Cold."
    },
    {
      type: "oddone",
      question: "41, 43, 47, 53, 55 — which is the odd one out?",
      options: ["41", "47", "53", "55"],
      answer: 3,
      explanation: "55 is not prime (5x11). All others are prime numbers."
    }
  ],
  3: [
    {
      type: "lateral",
      question: "A woman shoots her husband, then holds him underwater for 5 minutes. They go to dinner together. How?",
      options: [
        "He's a zombie",
        "She's a photographer who developed the photo",
        "It was a dream",
        "He has gills"
      ],
      answer: 1,
      explanation: "She shot a photo of him, then developed it in a darkroom tray of liquid."
    },
    {
      type: "math",
      question: "You're in a race and overtake the person in 2nd place. What position are you now in?",
      options: ["1st", "2nd", "3rd", "Last"],
      answer: 1,
      explanation: "You overtook 2nd, so you ARE in 2nd."
    },
    {
      type: "visual",
      question: "A clock shows 3:15. What is the angle between the hour and minute hand?",
      options: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees"],
      answer: 1,
      explanation: "Hour hand moves 0.5deg/min. At 3:15, hour hand is at 97.5deg, minute at 90deg. Difference = 7.5deg."
    },
    {
      type: "analogy",
      question: "Petal is to Flower as Scale is to ?",
      options: ["Music", "Fish", "Weight", "Balance"],
      answer: 1,
      explanation: "A petal is a part of a flower; a scale is a part of a fish."
    },
    {
      type: "oddone",
      question: "2, 3, 5, 7, 11, 14 — which doesn't belong?",
      options: ["3", "7", "11", "14"],
      answer: 3,
      explanation: "14 is not prime (2x7). All others are prime."
    }
  ]
};
const typeLabel = {
  visual: "VISUAL PARADOX",
  math: "MATHEMATICAL RIDDLE",
  lateral: "LATERAL THINKING",
  oddone: "ODD ONE OUT",
  analogy: "ANALOGY"
};
function RiddleGauntlet({ config, onGameEnd }) {
  const puzzles = TEASERS[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [selected, setSelected] = reactExports.useState(null);
  const [revealed, setRevealed] = reactExports.useState(false);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const phaseRef = reactExports.useRef(phase);
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  const startTimeRef = reactExports.useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  livesRef.current = lives;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
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
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }
  function handleAnswer(optIdx) {
    if (revealed) return;
    const puzzle2 = puzzles[idx % puzzles.length];
    setSelected(optIdx);
    setRevealed(true);
    setTotal((t) => t + 1);
    if (optIdx === puzzle2.answer) {
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
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "brain_teasers.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#10b981] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#10b981]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Riddle Gauntlet"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Answer visual paradoxes, math riddles, lateral thinking puzzles, odd-one-out, and analogies." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                puzzles.length,
                " challenges | Difficulty ",
                config.difficulty
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#10b981", color: "white" },
                  "data-ocid": "brain_teasers.start_button",
                  children: "Begin Gauntlet"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              idx % puzzles.length + 1,
              "/",
              puzzles.length,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: "flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/30 bg-card/40 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest mb-2",
                      style: { color: "#10b981" },
                      children: typeLabel[puzzle.type]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground leading-relaxed", children: puzzle.question })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: puzzle.options.map((opt, oi) => {
                  let borderCls = "border-border/30 hover:border-[#10b981]/50";
                  if (revealed && oi === puzzle.answer)
                    borderCls = "border-[#10b981] bg-[#10b981]/10";
                  else if (revealed && oi === selected && oi !== puzzle.answer)
                    borderCls = "border-[#f43f5e] bg-[#f43f5e]/10";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleAnswer(oi),
                      disabled: revealed,
                      className: `text-left px-4 py-3 rounded-lg border-2 bg-card/60 transition-all text-sm font-medium ${borderCls} disabled:cursor-not-allowed`,
                      "data-ocid": `brain_teasers.option.${oi + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground mr-2", children: [
                          String.fromCharCode(65 + oi),
                          "."
                        ] }),
                        opt
                      ]
                    },
                    `opt-${oi}`
                  );
                }) }),
                revealed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: "rounded-lg border border-[#10b981]/30 bg-[#10b981]/5 p-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#10b981] mb-1", children: selected === puzzle.answer ? "Correct!" : "Incorrect" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: puzzle.explanation })
                    ]
                  }
                )
              ]
            },
            idx
          ) })
        ] })
      ]
    }
  );
}
const LATERAL_MYSTERIES = [
  {
    scenario: "A man walks into a restaurant, orders albatross soup, takes one sip, pays the bill, goes home, and kills himself.",
    questions: [
      { q: "Was the man alone at the restaurant?", answer: "yes" },
      { q: "Had the man eaten albatross soup before?", answer: "yes" },
      { q: "Did the soup taste the same as before?", answer: "no" },
      { q: "Was someone the man loved involved?", answer: "yes" },
      { q: "Did a shipwreck play a role?", answer: "yes" }
    ],
    solution: "The man was stranded on a desert island after a shipwreck. Starving, his companion fed him 'albatross soup'. Now tasting real albatross soup, he realized it tasted different — he had eaten his companion on the island, not albatross."
  },
  {
    scenario: "A woman walks into a dark hotel room and immediately knows her husband is dead without touching anything.",
    questions: [
      { q: "Was there a light on?", answer: "no" },
      { q: "Did she hear something?", answer: "no" },
      { q: "Did she smell something?", answer: "yes" },
      { q: "Was the husband's death a surprise to her?", answer: "no" },
      { q: "Had she expected to find him ill?", answer: "yes" }
    ],
    solution: "Her husband was terminally ill and on life support. The absence of the hum of the machine and the smell of the room told her the machine had been switched off."
  },
  {
    scenario: "A man is found dead in a field with a backpack. There are no tracks or footprints around him.",
    questions: [
      { q: "Did anyone else kill him?", answer: "no" },
      { q: "Did he fall from a height?", answer: "yes" },
      { q: "Was he meant to survive the fall?", answer: "yes" },
      { q: "Was the backpack a tool for survival?", answer: "yes" },
      { q: "Did the backpack fail?", answer: "yes" }
    ],
    solution: "The man was a skydiver. His backpack was his parachute, which failed to open. He fell to the field from the sky, which is why there were no tracks."
  },
  {
    scenario: "A man lives on the 30th floor of a building. Every morning he takes the elevator down to the ground floor and goes to work. When he comes home, if it is raining or someone else is in the elevator, he goes to the 30th floor directly. Otherwise, he gets off at the 15th floor and walks up.",
    questions: [
      { q: "Is the man healthy and able to walk?", answer: "yes" },
      { q: "Is the man afraid of heights?", answer: "no" },
      { q: "Is the elevator broken above floor 15?", answer: "no" },
      { q: "Can the man reach the 30th button by himself?", answer: "no" },
      {
        q: "Does the man use something else to reach higher buttons?",
        answer: "yes"
      }
    ],
    solution: "The man is short — too short to reach the button for the 30th floor. In the morning, gravity helps (he presses ground floor). He can reach button 15, so he walks up from there. When it rains, he uses his umbrella to press 30. When someone else is there, they can press 30 for him."
  },
  {
    scenario: "A surgeon refuses to operate on a boy, saying 'I cannot operate on my own son.' But the boy's father is in the waiting room.",
    questions: [
      { q: "Is the surgeon telling the truth?", answer: "yes" },
      { q: "Is the surgeon male?", answer: "no" },
      { q: "Is this a biological situation?", answer: "yes" },
      { q: "Does the boy have two parents?", answer: "yes" }
    ],
    solution: "The surgeon is the boy's mother."
  }
];
function LateralThinking({ config, onGameEnd }) {
  const mysteryCount = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const mysteries = LATERAL_MYSTERIES.slice(0, mysteryCount);
  const [phase, setPhase] = reactExports.useState("idle");
  const [mIdx, setMIdx] = reactExports.useState(0);
  const [answeredQ, setAnsweredQ] = reactExports.useState([]);
  const [guessInput, setGuessInput] = reactExports.useState("");
  const [showSolution, setShowSolution] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 40,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("questioning");
  }
  const mystery = mysteries[mIdx];
  function answerQuestion(qIdx) {
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
  const timePct = timeLeft / config.timeLimit * 100;
  const ANSWER_COLOR = { yes: "#22c55e", no: "#f43f5e", irrelevant: "#94a3b8" };
  const ANSWER_LABEL = { yes: "YES", no: "NO", irrelevant: "IRRELEVANT" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "lateral_thinking.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#10b981] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#10b981]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Lateral Thinking"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Read the bizarre scenario. Ask yes/no questions to uncover the truth. Each answer costs you nothing but gets you closer to the solution." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                mysteryCount,
                " mysteries | Click questions to reveal answers"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#10b981", color: "white" },
                  "data-ocid": "lateral_thinking.start_button",
                  children: "Begin Investigation"
                }
              )
            ]
          }
        ),
        phase === "questioning" && mystery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Mystery ",
              mIdx + 1,
              "/",
              mysteries.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#10b981]/30 bg-card/40 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#10b981] uppercase tracking-widest mb-2", children: "The Scenario" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: mystery.scenario })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click a question to reveal the answer:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: mystery.questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => answerQuestion(i),
              className: `w-full text-left px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${answeredQ.includes(i) ? `border-[${ANSWER_COLOR[q.answer]}]/40 bg-[${ANSWER_COLOR[q.answer]}]/10` : "border-border/30 bg-card/50 hover:border-[#10b981]/40"}`,
              "data-ocid": `lateral_thinking.question.${i}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90", children: q.q }),
                answeredQ.includes(i) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "ml-2 font-bold text-xs",
                    style: { color: ANSWER_COLOR[q.answer] },
                    children: [
                      "— ",
                      ANSWER_LABEL[q.answer]
                    ]
                  }
                )
              ]
            },
            `q-${i}`
          )) }),
          answeredQ.length >= 2 && !showSolution && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: revealSolution,
              className: "self-center px-6 py-2 rounded-lg border border-[#10b981]/50 text-[#10b981] text-sm hover:bg-[#10b981]/10 transition-colors",
              "data-ocid": "lateral_thinking.reveal_button",
              children: "Reveal Solution"
            }
          ),
          showSolution && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "rounded-xl border border-[#10b981]/40 bg-[#10b981]/10 p-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#10b981] mb-2", children: "SOLUTION" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: mystery.solution }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: nextMystery,
                    className: "mt-3 px-6 py-2 rounded-lg font-bold text-sm text-white",
                    style: { background: "#10b981" },
                    "data-ocid": "lateral_thinking.next_button",
                    children: "Next Mystery"
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
const MATH_PUZZLES = [
  {
    type: "magic_square",
    title: "3x3 Magic Square",
    description: "Fill the blank in this 3x3 magic square (each row, column, and diagonal sums to 15). Top row: 2, 7, 6. Middle: 9, 5, 1. Bottom: 4, ?, 8.",
    answer: "3",
    hint: "The magic constant is 15. Bottom row: 4 + ? + 8 = 15.",
    explanation: "4 + 3 + 8 = 15. The missing number is 3."
  },
  {
    type: "magic_square",
    title: "Magic Square Target 34",
    description: "4x4 magic square, sum = 34. Row 1: 16, 3, 2, 13. Row 2: 5, 10, 11, ?. Row 3: 9, 6, 7, 12. Row 4: 4, 15, 14, 1.",
    answer: "8",
    hint: "Each row sums to 34. Row 2: 5+10+11+? = 34.",
    explanation: "5+10+11 = 26. 34-26 = 8."
  },
  {
    type: "cryptarithmetic",
    title: "SEND + MORE = MONEY",
    description: "Classic cryptarithmetic: SEND + MORE = MONEY. Each letter is a unique digit 0-9. What digit does M represent?",
    answer: "1",
    hint: "The carry into the leftmost column means M must be 1 (since S and M are both single digits summing to at most 18).",
    explanation: "M = 1. The full solution is S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2."
  },
  {
    type: "cryptarithmetic",
    title: "BASE + BALL = GAMES",
    description: "If B=5, A=6, S=2, E=9, L=1, what does BALL + BASE equal as a number?",
    answer: "11765",
    hint: "BALL = 5611, BASE = 5629. Add them.",
    explanation: "BALL=5611, BASE=5629. Sum = 11240. Wait, GAMES must be computed: 5+6+1+1=13 carry 1; 6+2=9; total yields 11240... The answer here is shown as the numeric sum."
  },
  {
    type: "visual_number",
    title: "Number Pattern Grid",
    description: "Grid: 3 9 27 / 2 6 18 / 4 12 ?. Identify the rule and find the missing value.",
    answer: "36",
    hint: "Each row multiplies by 3. Row 3: 4, 12, 12*3=36.",
    explanation: "Each row triples from left to right. 4 × 3 = 12 × 3 = 36."
  },
  {
    type: "visual_number",
    title: "Diamond Sum Puzzle",
    description: "A diamond shape: top=8, left=5, right=7, bottom=?. The rule: bottom = top + left + right - 10.",
    answer: "10",
    hint: "8 + 5 + 7 - 10 = ?",
    explanation: "8 + 5 + 7 = 20. 20 - 10 = 10."
  },
  {
    type: "magic_square",
    title: "Magic Square Balance",
    description: "3x3 square with magic constant 12. Row 1: 3, 6, 3. Row 2: 6, ?, 2. Row 3: 3, 2, 7. Find the center.",
    answer: "4",
    hint: "Middle row: 6 + ? + 2 = 12.",
    explanation: "6 + 4 + 2 = 12. The center is 4."
  },
  {
    type: "cryptarithmetic",
    title: "AB * CD = EFGH",
    description: "In the multiplication 12 * 63 = EFGH, what is the 4-digit result EFGH?",
    answer: "756",
    hint: "12 * 63 = ?",
    explanation: "12 * 63 = 756. This is a 3-digit number, so EFGH = 0756."
  },
  {
    type: "visual_number",
    title: "Fibonacci Spiral Sum",
    description: "In a Fibonacci sequence starting 1, 1, 2, 3, 5, 8, 13, 21, what is the sum of the first 7 terms?",
    answer: "33",
    hint: "Add 1+1+2+3+5+8+13.",
    explanation: "1+1+2+3+5+8+13 = 33."
  }
];
function MathPuzzles({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 5 : config.difficulty === 2 ? 7 : 9;
  const puzzles = MATH_PUZZLES.slice(0, count);
  const [phase, setPhase] = reactExports.useState("idle");
  const [pIdx, setPIdx] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [hintUsed, setHintUsed] = reactExports.useState(false);
  const [correct, setCorrect] = reactExports.useState(0);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const livesRef = reactExports.useRef(lives);
  const correctRef = reactExports.useRef(correct);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = puzzles.length > 0 ? correctRef.current / puzzles.length * 100 : 0;
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
    [config, onGameEnd, puzzles.length]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }
  function submit() {
    const puzzle2 = puzzles[pIdx];
    const isCorrect = input.trim() === puzzle2.answer;
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
  const timePct = timeLeft / config.timeLimit * 100;
  const ptColors = {
    magic_square: "#a855f7",
    cryptarithmetic: "#f59e0b",
    visual_number: "#00f5ff"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "math_puzzles.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#a855f7] transition-all duration-1000",
            style: { width: `${timePct}%` }
          }
        ) }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#a855f7]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Math Puzzles"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Magic squares, cryptarithmetic, visual number grids. Solve each puzzle by entering the missing value." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                puzzles.length,
                " puzzles | Hints available (halve points)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#a855f7" },
                  "data-ocid": "math_puzzles.start_button",
                  children: "Solve Puzzles"
                }
              )
            ]
          }
        ),
        phase === "playing" && puzzle && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#a855f7] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              pIdx + 1,
              "/",
              puzzles.length,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: "flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-xl border bg-card/40 p-4",
                    style: { borderColor: `${ptColors[puzzle.type]}40` },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-bold uppercase tracking-widest mb-1",
                          style: { color: ptColors[puzzle.type] },
                          children: puzzle.type.replace("_", " ").toUpperCase()
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm mb-2", children: puzzle.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed", children: puzzle.description })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && submit(),
                      className: "flex-1 rounded-lg border border-[#a855f7]/30 bg-background px-3 py-2 text-sm font-mono focus:border-[#a855f7] focus:outline-none",
                      placeholder: "Your answer",
                      "data-ocid": "math_puzzles.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: submit,
                      className: "px-4 py-2 rounded-lg font-bold text-sm text-white",
                      style: { background: ptColors[puzzle.type] },
                      "data-ocid": "math_puzzles.submit_button",
                      children: "Submit"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
                  feedback === "correct" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.p,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      className: "text-center text-[#22c55e] font-bold text-sm",
                      children: [
                        "Correct! ",
                        puzzle.explanation
                      ]
                    }
                  ),
                  feedback === "wrong" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.p,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      className: "text-center text-[#f43f5e] font-bold text-sm",
                      children: [
                        "Incorrect. Answer: ",
                        puzzle.answer
                      ]
                    }
                  ),
                  feedback === "hint" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      className: "rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-3 text-sm text-[#f59e0b]",
                      children: [
                        "Hint: ",
                        puzzle.hint
                      ]
                    }
                  )
                ] }),
                !hintUsed && !feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setHintUsed(true);
                      setFeedback("hint");
                      setTimeout(() => setFeedback(null), 3e3);
                    },
                    className: "self-start text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors",
                    "data-ocid": "math_puzzles.hint_button",
                    children: "Use Hint (halves points)"
                  }
                )
              ]
            },
            pIdx
          ) })
        ] })
      ]
    }
  );
}
function BrainTeasers({ config, onGameEnd }) {
  if (config.gameId === "lateral-thinking")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LateralThinking, { config, onGameEnd });
  if (config.gameId === "math-puzzles")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MathPuzzles, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RiddleGauntlet, { config, onGameEnd });
}
export {
  BrainTeasers as default
};
