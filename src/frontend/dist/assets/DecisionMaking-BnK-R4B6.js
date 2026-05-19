import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const EV_SCENARIOS = [
  { text: "Take 40 points now OR risk it", a: 40, prob: 0.6, reward: 80 },
  { text: "Safe 75 points OR gamble", a: 75, prob: 0.9, reward: 90 },
  { text: "Secure 50 points OR chance", a: 50, prob: 0.4, reward: 150 },
  { text: "Guaranteed 100 OR risky choice", a: 100, prob: 0.5, reward: 160 },
  { text: "Certain 30 points OR maybe more", a: 30, prob: 0.8, reward: 45 },
  { text: "Take 60 now OR try for more", a: 60, prob: 0.7, reward: 100 },
  { text: "Safe 20 points OR long shot", a: 20, prob: 0.3, reward: 100 },
  { text: "Solid 90 points OR high risk", a: 90, prob: 0.6, reward: 140 }
];
function RiskAssessor({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [evInput, setEvInput] = reactExports.useState("");
  const [evCorrect, setEvCorrect] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState("");
  const [showResult, setShowResult] = reactExports.useState(false);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const startRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (done) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.round(scoreRef.current / 80 * 100),
          Math.floor((Date.now() - startRef.current) / 1e3),
          done
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
    startRef.current = Date.now();
    startTimer();
    setPhase("calcEV");
  }
  const sc = EV_SCENARIOS[idx];
  const correctEV = Math.round(sc.prob * sc.reward * 10) / 10;
  const betterChoice = correctEV > sc.a ? "B" : "A";
  function submitEV() {
    const val = Number.parseFloat(evInput);
    const close = Math.abs(val - correctEV) <= 1;
    if (close) {
      setScore((s) => s + 5);
      setEvCorrect(true);
      setFeedback("Correct EV calculation! +5 pts");
    } else {
      setEvCorrect(false);
      setFeedback(`Expected value was ${correctEV}. No points.`);
    }
    setPhase("pickBetter");
  }
  function pickBetter(pick) {
    let pts = 0;
    if (pick === betterChoice) {
      pts = 5;
      setScore((s) => s + 5);
    }
    setShowResult(true);
    setFeedback(
      `${pick === betterChoice ? "+5 pts! Correct." : "Incorrect."} Option ${betterChoice} was better. EV(B) = ${correctEV}, Option A = ${sc.a}. You earned ${pts} pts.`
    );
  }
  function next() {
    const newIdx = idx + 1;
    setShowResult(false);
    setFeedback("");
    setEvInput("");
    setEvCorrect(false);
    if (newIdx >= EV_SCENARIOS.length) {
      endGame(true);
      return;
    }
    setIdx(newIdx);
    setPhase("calcEV");
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "risk_assessor.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#f59e0b] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#f59e0b]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Risk Assessor"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Calculate expected values and determine which option is mathematically superior. 8 scenarios. 10 points each. Score up to 80 points total." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-black",
                  style: { background: "#f59e0b" },
                  "data-ocid": "risk_assessor.start_button",
                  children: "Start Assessment"
                }
              )
            ]
          }
        ),
        (phase === "calcEV" || phase === "pickBetter") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-mono", children: [
              "Score: ",
              score,
              " / 80"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Scenario ",
              idx + 1,
              " / ",
              EV_SCENARIOS.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-card/40 p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#f59e0b] uppercase tracking-widest", children: "Scenario" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: sc.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/30 bg-card/60 p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-bold uppercase", children: "Option A" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-black text-foreground mt-1", children: [
                  sc.a,
                  " pts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Certain" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/30 bg-card/60 p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-bold uppercase", children: "Option B" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-black text-foreground mt-1", children: [
                  sc.reward,
                  " pts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  Math.round(sc.prob * 100),
                  "% chance"
                ] })
              ] })
            ] })
          ] }),
          phase === "calcEV" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Calculate the Expected Value (EV) of Option B:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "EV = probability x reward" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: evInput,
                  onChange: (e) => setEvInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && submitEV(),
                  className: "flex-1 rounded-lg border border-[#f59e0b]/30 bg-background px-3 py-2 text-sm font-mono focus:border-[#f59e0b] focus:outline-none",
                  placeholder: "Enter EV of Option B",
                  "data-ocid": "risk_assessor.ev_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submitEV,
                  className: "px-4 py-2 rounded-lg font-bold text-sm text-black hover:opacity-90",
                  style: { background: "#f59e0b" },
                  "data-ocid": "risk_assessor.ev_submit_button",
                  children: "Submit EV"
                }
              )
            ] })
          ] }),
          phase === "pickBetter" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#10b981] font-semibold", children: feedback }),
            !showResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Which option is better based on EV?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => pickBetter("A"),
                    className: "flex-1 py-3 rounded-xl border-2 border-border/30 bg-card/60 font-bold text-sm hover:border-[#f59e0b]/60 transition-all",
                    "data-ocid": "risk_assessor.option_a_button",
                    children: [
                      "Option A (",
                      sc.a,
                      " pts certain)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => pickBetter("B"),
                    className: "flex-1 py-3 rounded-xl border-2 border-border/30 bg-card/60 font-bold text-sm hover:border-[#f59e0b]/60 transition-all",
                    "data-ocid": "risk_assessor.option_b_button",
                    children: "Option B (EV = ?)"
                  }
                )
              ] })
            ] }),
            showResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#f59e0b]", children: feedback }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: next,
                  className: "mt-3 px-5 py-2 rounded-lg font-bold text-sm text-black",
                  style: { background: "#f59e0b" },
                  "data-ocid": "risk_assessor.next_button",
                  children: "Next Scenario"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
const DILEMMAS = [
  {
    sit: "You find a classmate copying during a test. The teacher did not notice.",
    stakes: [
      "The copying student",
      "The honest students",
      "The teacher",
      "The school",
      "Your friendship"
    ],
    conseqs: [
      "The copier gets an unfair grade",
      "Honest students are disadvantaged",
      "Trust in the class is undermined",
      "The school rules are broken",
      "The friendship may be affected",
      "Nothing changes"
    ],
    framework: "Deontological",
    decision: "Report it to the teacher",
    explanation: "Rules exist for fairness. A deontological view holds that cheating is inherently wrong and must be reported regardless of consequences."
  },
  {
    sit: "You witness a friend being bullied but speaking up may make you a target too.",
    stakes: [
      "The bullied friend",
      "The bully",
      "Bystanders",
      "School culture",
      "Your own safety"
    ],
    conseqs: [
      "Your friend continues to suffer",
      "The bully faces no consequences",
      "You become a target",
      "Bullying culture spreads",
      "Your friend feels unsupported",
      "You stay safe"
    ],
    framework: "Virtue Ethics",
    decision: "Intervene and support your friend",
    explanation: "Courage and compassion are virtues. A person of good character acts to protect others even at personal risk."
  },
  {
    sit: "A shop owner gives you too much change by mistake. You notice as you leave.",
    stakes: [
      "The shop owner",
      "Future customers",
      "Your integrity",
      "The business",
      "Your conscience"
    ],
    conseqs: [
      "The owner loses money",
      "You gain money unfairly",
      "Prices may increase for others",
      "You feel guilty",
      "The owner trusts customers less",
      "The owner is grateful"
    ],
    framework: "Deontological",
    decision: "Return the extra change",
    explanation: "Honesty is a duty. Taking money you did not earn violates the principle of fairness regardless of whether you are caught."
  },
  {
    sit: "You discover a friend is spreading false rumors about another student to gain popularity.",
    stakes: [
      "The targeted student",
      "The spreading friend",
      "The class community",
      "Your reputation",
      "Long-term trust"
    ],
    conseqs: [
      "The targeted student is hurt",
      "False information spreads",
      "Your friend gains popularity",
      "Your friend loses credibility later",
      "The class becomes divided",
      "You lose trust in your friend"
    ],
    framework: "Consequentialist",
    decision: "Privately confront your friend and ask them to stop",
    explanation: "The best outcome is stopping harm privately. Public confrontation risks escalation; doing nothing allows harm to continue."
  },
  {
    sit: "A local factory provides jobs but is polluting the community river.",
    stakes: [
      "Factory workers",
      "Community residents",
      "Future generations",
      "The environment",
      "Business owners"
    ],
    conseqs: [
      "Jobs are lost if factory closes",
      "Health problems increase",
      "River ecosystem is destroyed",
      "Community protests",
      "Regulations are imposed",
      "Long-term environmental damage"
    ],
    framework: "Consequentialist",
    decision: "Report the pollution to environmental authorities",
    explanation: "Maximizing long-term wellbeing requires stopping pollution. Job losses can be addressed through policy but environmental damage may be irreversible."
  },
  {
    sit: "You can save time on a group project by using someone elses work without credit.",
    stakes: [
      "The original author",
      "Your group",
      "Your school",
      "Your own learning",
      "Future students"
    ],
    conseqs: [
      "The author is uncredited",
      "Your group may score higher",
      "Academic integrity is violated",
      "You learn less",
      "Others may copy next time",
      "Plagiarism norms spread"
    ],
    framework: "Deontological",
    decision: "Credit the original source and do your own work",
    explanation: "Academic integrity is a fundamental rule. Using others work without credit is theft of intellectual effort regardless of time pressure."
  },
  {
    sit: "A friend confides they are struggling with mental health but asks you not to tell anyone.",
    stakes: [
      "Your friend",
      "Your friendship",
      "The school counselor",
      "Your friend's family",
      "Your own wellbeing"
    ],
    conseqs: [
      "Your friend feels betrayed if you tell",
      "Your friend gets help if you tell",
      "The situation worsens if you stay silent",
      "Your friend may be grateful later",
      "You carry the burden alone",
      "Professional help arrives"
    ],
    framework: "Virtue Ethics",
    decision: "Encourage your friend to seek help and offer to go with them",
    explanation: "Genuine care for a friend means protecting their wellbeing even when it is uncomfortable. A caring and courageous friend guides rather than simply obeys."
  },
  {
    sit: "You notice your teacher has made an error that benefits your grade unfairly.",
    stakes: [
      "Your teacher",
      "Other students",
      "Your own honesty",
      "Grade integrity",
      "School reputation"
    ],
    conseqs: [
      "You keep a grade you did not earn",
      "Other students are ranked unfairly",
      "Your teacher trusts you more if you speak up",
      "The error spreads to future classes",
      "You model good character",
      "You feel conflicted"
    ],
    framework: "Deontological",
    decision: "Inform the teacher of the grading error",
    explanation: "Honesty requires correcting errors even when they benefit you. Keeping an unfair advantage violates the principle of fairness."
  }
];
const CORRECT_STAKES_SETS = [
  [0, 1],
  [0, 4],
  [0, 2],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 2],
  [0, 1]
];
const CORRECT_CONSEQ_SETS = [
  [0, 1],
  [0, 4],
  [0, 1],
  [0, 2],
  [1, 5],
  [0, 3],
  [1, 2],
  [0, 1]
];
function EthicalDilemmas({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [explanation, setExplanation] = reactExports.useState("");
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const startRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (done) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.round(scoreRef.current / 32 * 100),
          Math.floor((Date.now() - startRef.current) / 1e3),
          done
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
    startRef.current = Date.now();
    startTimer();
    setPhase("stakes");
    setSelected(/* @__PURE__ */ new Set());
  }
  const d = DILEMMAS[idx];
  function toggle(n) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else if (next.size < 2) next.add(n);
      return next;
    });
  }
  const FRAMEWORKS = [
    "Deontological",
    "Consequentialist",
    "Virtue Ethics",
    "Social Contract"
  ];
  const DECISIONS_MAP = [
    [
      "Report it to the teacher",
      "Ignore it",
      "Talk to the copier privately",
      "Copy yourself"
    ],
    [
      "Intervene and support your friend",
      "Walk away",
      "Record it",
      "Tell a bystander"
    ],
    [
      "Return the extra change",
      "Keep it",
      "Donate it",
      "Leave it on the counter"
    ],
    [
      "Privately confront your friend and ask them to stop",
      "Spread counter-rumors",
      "Tell the target",
      "Ignore it"
    ],
    [
      "Report the pollution to environmental authorities",
      "Ignore the pollution",
      "Start a petition",
      "Leave the community"
    ],
    [
      "Credit the original source and do your own work",
      "Use it without credit",
      "Cite it partially",
      "Ask the author"
    ],
    [
      "Encourage your friend to seek help and offer to go with them",
      "Keep the secret",
      "Tell their parents immediately",
      "Tell the teacher"
    ],
    [
      "Inform the teacher of the grading error",
      "Keep the grade",
      "Tell other students",
      "Ask anonymously"
    ]
  ];
  function confirmStakes() {
    const correct = CORRECT_STAKES_SETS[idx];
    const hits = correct.filter((n) => selected.has(n)).length;
    setScore((s) => s + hits);
    setPhase("conseqs");
    setSelected(/* @__PURE__ */ new Set());
  }
  function confirmConseqs() {
    const correct = CORRECT_CONSEQ_SETS[idx];
    const hits = correct.filter((n) => selected.has(n)).length;
    setScore((s) => s + hits);
    setPhase("framework");
    setSelected(/* @__PURE__ */ new Set());
  }
  function selectFramework(f) {
    if (f === d.framework) setScore((s) => s + 1);
    setPhase("decision");
  }
  function selectDecision(dec) {
    if (dec === d.decision) setScore((s) => s + 1);
    setExplanation(d.explanation);
    setPhase("explain");
  }
  function nextDilemma() {
    const newIdx = idx + 1;
    setExplanation("");
    setSelected(/* @__PURE__ */ new Set());
    if (newIdx >= DILEMMAS.length) {
      endGame(true);
      return;
    }
    setIdx(newIdx);
    setPhase("stakes");
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const phaseLabels = {
    stakes: "Step 1: Select 2 most affected stakeholders",
    conseqs: "Step 2: Select 2 most likely consequences",
    framework: "Step 3: Choose the best ethical framework",
    decision: "Step 4: What is the best decision?"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "ethical_dilemmas.page",
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
                  children: "Ethical Dilemmas"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Navigate 8 real-world ethical dilemmas. Identify stakeholders, analyze consequences, apply ethical frameworks, and choose the best decision. 32 points possible." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#a855f7" },
                  "data-ocid": "ethical_dilemmas.start_button",
                  children: "Begin Dilemmas"
                }
              )
            ]
          }
        ),
        (phase === "stakes" || phase === "conseqs" || phase === "framework" || phase === "decision" || phase === "explain") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#a855f7] font-mono", children: [
              "Score: ",
              score,
              " / 32"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Dilemma ",
              idx + 1,
              " / ",
              DILEMMAS.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#a855f7]/30 bg-card/40 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-1", children: "Dilemma" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold leading-relaxed", children: d.sit })
          ] }),
          phase !== "explain" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#a855f7] uppercase tracking-widest", children: phaseLabels[phase] }),
          phase === "stakes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            d.stakes.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggle(i),
                className: `w-full text-left px-4 py-2 rounded-lg border-2 text-sm transition-all ${selected.has(i) ? "border-[#a855f7] bg-[#a855f7]/20" : "border-border/30 bg-card/60 hover:border-[#a855f7]/40"}`,
                "data-ocid": `ethical_dilemmas.stake.${i + 1}`,
                children: s
              },
              i
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: confirmStakes,
                disabled: selected.size < 2,
                className: "w-full py-2 rounded-lg font-bold text-sm text-white disabled:opacity-40",
                style: { background: "#a855f7" },
                "data-ocid": "ethical_dilemmas.confirm_stakes_button",
                children: [
                  "Confirm Stakeholders (",
                  selected.size,
                  "/2)"
                ]
              }
            )
          ] }),
          phase === "conseqs" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            d.conseqs.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggle(i),
                className: `w-full text-left px-4 py-2 rounded-lg border-2 text-sm transition-all ${selected.has(i) ? "border-[#a855f7] bg-[#a855f7]/20" : "border-border/30 bg-card/60 hover:border-[#a855f7]/40"}`,
                "data-ocid": `ethical_dilemmas.conseq.${i + 1}`,
                children: c
              },
              i
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: confirmConseqs,
                disabled: selected.size < 2,
                className: "w-full py-2 rounded-lg font-bold text-sm text-white disabled:opacity-40",
                style: { background: "#a855f7" },
                "data-ocid": "ethical_dilemmas.confirm_conseqs_button",
                children: [
                  "Confirm Consequences (",
                  selected.size,
                  "/2)"
                ]
              }
            )
          ] }),
          phase === "framework" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: FRAMEWORKS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => selectFramework(f),
              className: "py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm font-semibold hover:border-[#a855f7]/50 transition-all",
              "data-ocid": `ethical_dilemmas.framework.${f.toLowerCase().replace(/ /g, "_")}`,
              children: f
            },
            f
          )) }),
          phase === "decision" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: DECISIONS_MAP[idx].map((dec) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => selectDecision(dec),
              className: "w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#a855f7]/50 transition-all",
              "data-ocid": `ethical_dilemmas.decision.${dec.substring(0, 10).toLowerCase().replace(/ /g, "_")}`,
              children: dec
            },
            dec
          )) }),
          phase === "explain" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "rounded-xl border border-[#a855f7]/30 bg-[#a855f7]/10 p-4 space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#a855f7] uppercase", children: "Explanation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed", children: explanation }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", children: [
                  "Correct framework:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#a855f7]", children: d.framework }),
                  " | Best decision: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981]", children: d.decision })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: nextDilemma,
                    className: "px-5 py-2 rounded-lg font-bold text-sm text-white",
                    style: { background: "#a855f7" },
                    "data-ocid": "ethical_dilemmas.next_button",
                    children: "Next Dilemma"
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
const SCENARIOS = {
  1: [
    {
      id: "exam_prep",
      situation: "You have a major exam tomorrow but your friends invite you to play games tonight.",
      context: "The exam is worth 30% of your grade. You've studied but could study more.",
      choices: [
        {
          id: "study",
          text: "Stay home and study for 2 more hours.",
          shortTermOutcome: "You miss the fun but feel prepared.",
          longTermOutcome: "You score 85% and improve your grade significantly.",
          shortTermScore: 30,
          longTermScore: 90,
          isOptimal: true
        },
        {
          id: "games",
          text: "Join your friends and play games until midnight.",
          shortTermOutcome: "You have fun but feel anxious about tomorrow.",
          longTermOutcome: "You score 55% due to fatigue and gaps in preparation.",
          shortTermScore: 80,
          longTermScore: 20,
          isOptimal: false
        },
        {
          id: "compromise",
          text: "Play for 1 hour, then come home and study.",
          shortTermOutcome: "Balanced evening but limited study time.",
          longTermOutcome: "You score 72% — decent but not your best.",
          shortTermScore: 60,
          longTermScore: 65,
          isOptimal: false
        }
      ]
    },
    {
      id: "found_money",
      situation: "You find a wallet with GHS 500 and an ID card at the bus station.",
      context: "You need new school shoes and have no money.",
      choices: [
        {
          id: "return",
          text: "Return the wallet to the owner using the ID.",
          shortTermOutcome: "You feel honest but have no shoes.",
          longTermOutcome: "The owner gives you GHS 50 reward. Your reputation grows.",
          shortTermScore: 40,
          longTermScore: 100,
          isOptimal: true
        },
        {
          id: "keep",
          text: "Keep the money and discard the wallet.",
          shortTermOutcome: "You get shoes but feel uneasy.",
          longTermOutcome: "CCTV footage leads to your identification. School suspension.",
          shortTermScore: 70,
          longTermScore: 0,
          isOptimal: false
        },
        {
          id: "hand_in",
          text: "Hand it to the bus station lost and found.",
          shortTermOutcome: "Responsible action taken quickly.",
          longTermOutcome: "No reward but clear conscience and no consequences.",
          shortTermScore: 50,
          longTermScore: 80,
          isOptimal: false
        }
      ]
    }
  ],
  2: [
    {
      id: "business_ethics",
      situation: "You run a small food business. A supplier offers cheaper ingredients that are lower quality.",
      context: "Using them would double your profit margin but reduce food quality.",
      choices: [
        {
          id: "quality",
          text: "Keep your quality ingredients despite lower profit.",
          shortTermOutcome: "Lower profit this month.",
          longTermOutcome: "Reputation grows. Customer base expands 40%. Long-term revenue higher.",
          shortTermScore: 30,
          longTermScore: 95,
          isOptimal: true
        },
        {
          id: "cheap",
          text: "Switch to cheaper ingredients without telling customers.",
          shortTermOutcome: "Double profit this month.",
          longTermOutcome: "Customers notice quality drop. Reviews decline. Business closes in 3 months.",
          shortTermScore: 90,
          longTermScore: 5,
          isOptimal: false
        },
        {
          id: "transparent",
          text: "Use cheaper option but inform customers and lower prices.",
          shortTermOutcome: "Moderate profit, mixed customer reactions.",
          longTermOutcome: "Loyal customers stay. You maintain a sustainable but smaller business.",
          shortTermScore: 60,
          longTermScore: 65,
          isOptimal: false
        }
      ]
    },
    {
      id: "climate_invest",
      situation: "Your city has a budget. Spend on an immediate road repair or long-term solar grid?",
      context: "The road is damaged but usable. Solar would cut energy costs by 60% in 5 years.",
      choices: [
        {
          id: "solar",
          text: "Invest in the solar grid now.",
          shortTermOutcome: "Road stays rough. Some complaints.",
          longTermOutcome: "Energy savings fund three road repairs and new schools in 5 years.",
          shortTermScore: 25,
          longTermScore: 100,
          isOptimal: true
        },
        {
          id: "road",
          text: "Fix the road immediately.",
          shortTermOutcome: "Citizens satisfied, road is smooth.",
          longTermOutcome: "No energy savings. City budget remains tight. Road degrades again in 2 years.",
          shortTermScore: 85,
          longTermScore: 35,
          isOptimal: false
        },
        {
          id: "split",
          text: "Split budget: partial road patch + partial solar.",
          shortTermOutcome: "Moderate improvement on both fronts.",
          longTermOutcome: "Neither system performs optimally. Moderate long-term gains.",
          shortTermScore: 60,
          longTermScore: 60,
          isOptimal: false
        }
      ]
    }
  ],
  3: [
    {
      id: "ai_bias",
      situation: "Your team built an AI hiring system that accidentally disadvantages women by 15%.",
      context: "Fixing it takes 3 months. Launching now would fill 50 job vacancies faster.",
      choices: [
        {
          id: "fix_first",
          text: "Delay launch and fix the bias before deploying.",
          shortTermOutcome: "50 vacancies stay unfilled. Leadership is frustrated.",
          longTermOutcome: "Fair system launched. No discrimination lawsuits. Strong team culture.",
          shortTermScore: 20,
          longTermScore: 100,
          isOptimal: true
        },
        {
          id: "launch_anyway",
          text: "Launch immediately to fill vacancies, fix bias later.",
          shortTermOutcome: "50 roles filled quickly.",
          longTermOutcome: "Regulatory investigation. $2M fine. 3 years of reputational damage.",
          shortTermScore: 85,
          longTermScore: 0,
          isOptimal: false
        },
        {
          id: "limited",
          text: "Launch with manual override for female applicants.",
          shortTermOutcome: "Partial deployment, slower.",
          longTermOutcome: "Reduces bias but adds complexity. Moderate risk. Audit required.",
          shortTermScore: 50,
          longTermScore: 55,
          isOptimal: false
        }
      ]
    }
  ]
};
function DecisionMaking({ config, onGameEnd }) {
  if (config.gameId === "risk-assessor") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RiskAssessor, { config, onGameEnd });
  }
  if (config.gameId === "ethical-dilemmas") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EthicalDilemmas, { config, onGameEnd });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ConsequenceSimulator, { config, onGameEnd });
}
function ConsequenceSimulator({ config, onGameEnd }) {
  const scenarios = SCENARIOS[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [chosen, setChosen] = reactExports.useState(null);
  const [showLong, setShowLong] = reactExports.useState(false);
  const [resources, setResources] = reactExports.useState(100);
  const phaseRef = reactExports.useRef(phase);
  const scoreRef = reactExports.useRef(score);
  const startTimeRef = reactExports.useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 60,
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
    setPhase("choose");
  }
  function makeChoice(choice) {
    setChosen(choice);
    setPhase("consequence");
    setResources((r) => Math.max(0, r + (choice.isOptimal ? 10 : -15)));
    setTimeout(() => setShowLong(true), 1e3);
    const totalPts = (choice.shortTermScore + choice.longTermScore) * config.difficulty;
    setScore((s) => s + totalPts);
  }
  function nextScenario() {
    if (idx + 1 >= scenarios.length) {
      endGame(true);
      return;
    }
    setIdx((i) => i + 1);
    setChosen(null);
    setShowLong(false);
    setPhase("choose");
  }
  const scenario = scenarios[idx];
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "decision_making.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#f43f5e] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#f43f5e]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Consequence Simulator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Make difficult decisions. See short-term and long-term consequences play out. Optimal decisions balance ethics and long-term thinking." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#f43f5e" },
                  "data-ocid": "decision_making.start_button",
                  children: "Begin Simulation"
                }
              )
            ]
          }
        ),
        (phase === "choose" || phase === "consequence") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f43f5e] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Resources: ",
              resources,
              "% | Case ",
              idx + 1,
              "/",
              scenarios.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f43f5e]/30 bg-card/40 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#f43f5e] mb-1", children: "SCENARIO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: scenario.situation }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: scenario.context })
          ] }),
          phase === "choose" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: scenario.choices.map((choice) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => makeChoice(choice),
              className: "w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#f43f5e]/50 transition-all",
              "data-ocid": `decision_making.choice.${choice.id}`,
              children: choice.text
            },
            choice.id
          )) }),
          phase === "consequence" && chosen && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#f59e0b] mb-1", children: "SHORT-TERM CONSEQUENCE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: chosen.shortTermOutcome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-[#f59e0b] transition-all duration-700",
                      style: { width: `${chosen.shortTermScore}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Impact: ",
                    chosen.shortTermScore,
                    "%"
                  ] })
                ] }),
                showLong && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    className: `rounded-xl border p-3 ${chosen.isOptimal ? "border-[#10b981]/30 bg-[#10b981]/10" : "border-[#f43f5e]/30 bg-[#f43f5e]/10"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: `text-xs font-bold mb-1 ${chosen.isOptimal ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                          children: "LONG-TERM CONSEQUENCE"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: chosen.longTermOutcome }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `h-full transition-all duration-700 ${chosen.isOptimal ? "bg-[#10b981]" : "bg-[#f43f5e]"}`,
                          style: { width: `${chosen.longTermScore}%` }
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                        "Impact: ",
                        chosen.longTermScore,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: nextScenario,
                          className: "mt-3 px-4 py-1.5 rounded-lg text-sm font-bold text-white",
                          style: {
                            background: chosen.isOptimal ? "#10b981" : "#f43f5e"
                          },
                          "data-ocid": "decision_making.next_button",
                          children: "Next Scenario"
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  DecisionMaking as default
};
