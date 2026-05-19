import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const CASES = {
  1: [
    {
      id: "missing_laptop",
      title: "The Missing Laptop",
      scenario: "A laptop disappeared from the school computer lab during lunch break. Three students had access.",
      evidences: [
        {
          id: "e1",
          title: "Security footage",
          detail: "Shows someone in a red hoodie entering the lab at 12:15pm.",
          pointsTo: "tom"
        },
        {
          id: "e2",
          title: "Witness statement",
          detail: "A teacher saw Tom in the canteen at 12:10pm but not at 12:15pm.",
          pointsTo: "tom"
        },
        {
          id: "e3",
          title: "Alibi note",
          detail: "Sara claims she was in the library from 12:00 to 1:00pm.",
          pointsTo: "sara"
        },
        {
          id: "e4",
          title: "Library record",
          detail: "Library sign-in shows Sara checked in at 12:05pm and out at 12:40pm.",
          contradicts: "sara"
        }
      ],
      suspects: [
        {
          id: "tom",
          name: "Tom (red hoodie owner)",
          alibi: "Was getting lunch."
        },
        {
          id: "sara",
          name: "Sara (library claim)",
          alibi: "Was in library 12:00-1:00.",
          contradictionEvidenceId: "e4"
        },
        {
          id: "ben",
          name: "Ben",
          alibi: "Was in PE class with the whole class."
        }
      ],
      culpritId: "tom",
      solution: "Tom was seen on footage in a red hoodie entering the lab at 12:15pm — the time the laptop disappeared. His canteen alibi only covers 12:10pm."
    }
  ],
  2: [
    {
      id: "forged_results",
      title: "Forged Test Results",
      scenario: "A student's exam results were altered in the school database. Only 4 people had system access.",
      evidences: [
        {
          id: "e1",
          title: "Access log",
          detail: "Database accessed from IP 192.168.1.14 at 9:47pm on Tuesday."
        },
        {
          id: "e2",
          title: "IT records",
          detail: "IP 192.168.1.14 is assigned to the teacher's lounge computer."
        },
        {
          id: "e3",
          title: "Staff schedule",
          detail: "Only Ms. Rivers stayed late on Tuesday. Mr. Cole left at 6pm."
        },
        {
          id: "e4",
          title: "Email trace",
          detail: "An email from Ms. Rivers' account accessed the student results form at 9:44pm."
        },
        {
          id: "e5",
          title: "Phone record",
          detail: "Ms. Rivers called her sister at 9:50pm from the teacher's lounge phone."
        }
      ],
      suspects: [
        {
          id: "rivers",
          name: "Ms. Rivers (teacher)",
          alibi: "Stayed late to mark papers."
        },
        {
          id: "cole",
          name: "Mr. Cole (teacher)",
          alibi: "Left school at 6pm.",
          contradictionEvidenceId: "e3"
        },
        {
          id: "james",
          name: "James (IT admin)",
          alibi: "Was home — VPN logs show no remote access."
        },
        {
          id: "maya",
          name: "Maya (student council)",
          alibi: "No system access credentials."
        }
      ],
      culpritId: "rivers",
      solution: "Ms. Rivers accessed the database from the teacher's lounge at 9:47pm. Her email was used at 9:44pm and she was on the lounge phone at 9:50pm."
    }
  ],
  3: [
    {
      id: "stolen_formula",
      title: "The Stolen Formula",
      scenario: "A prize-winning science formula was stolen from the lab safe overnight. Four researchers had key card access.",
      evidences: [
        {
          id: "e1",
          title: "Key card log",
          detail: "Safe accessed at 11:23pm. Card ID #4 (Dr. Nash)."
        },
        {
          id: "e2",
          title: "CCTV blind spot",
          detail: "Camera was deliberately covered 11:20-11:30pm."
        },
        {
          id: "e3",
          title: "Dr. Nash alibi",
          detail: "Dr. Nash claims to have been at a conference dinner until midnight."
        },
        {
          id: "e4",
          title: "Conference records",
          detail: "Conference dinner ended at 10:30pm, not midnight.",
          contradicts: "nash"
        },
        {
          id: "e5",
          title: "Taxi receipt",
          detail: "Dr. Nash took a taxi from the conference at 10:38pm. Journey = 30 mins."
        },
        {
          id: "e6",
          title: "Copy equipment",
          detail: "Photo copier in Dr. Nash's office used at 11:35pm."
        }
      ],
      suspects: [
        {
          id: "nash",
          name: "Dr. Nash",
          alibi: "At conference dinner until midnight.",
          contradictionEvidenceId: "e4"
        },
        {
          id: "chen",
          name: "Dr. Chen",
          alibi: "Key card not used that evening."
        },
        {
          id: "patel",
          name: "Dr. Patel",
          alibi: "Security footage shows leaving at 9pm."
        },
        {
          id: "moore",
          name: "Dr. Moore",
          alibi: "Attending a lecture across town."
        }
      ],
      culpritId: "nash",
      solution: "Dr. Nash's alibi disproved — dinner ended 10:30pm. Taxi placed Nash at lab by 11:08pm. Card #4 opened safe at 11:23pm. Camera covered. Copier used 11:35pm."
    }
  ]
};
function CaseFileInvestigator({ config, onGameEnd }) {
  const cases = CASES[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [caseIdx] = reactExports.useState(0);
  const [examinedEvidence, setExaminedEvidence] = reactExports.useState([]);
  const [activeEvidence, setActiveEvidence] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [accusation, setAccusation] = reactExports.useState(null);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const currentCase2 = cases[caseIdx % cases.length];
      const acc = examinedEvidence.length / Math.max(1, currentCase2.evidences.length) * 100;
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
    [config, onGameEnd, examinedEvidence.length, caseIdx, cases]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  const currentCase = cases[caseIdx % cases.length];
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("investigation");
  }
  function examineEvidence(ev) {
    if (!examinedEvidence.includes(ev.id))
      setExaminedEvidence((prev) => [...prev, ev.id]);
    setActiveEvidence(ev);
  }
  function makeAccusation(suspectId) {
    const correct = suspectId === currentCase.culpritId;
    setAccusation(suspectId);
    const pts = correct ? 800 * config.difficulty + timeLeft * 5 : 0;
    if (correct) setScore((s) => s + pts);
    setTimeout(() => endGame(correct), 2500);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "detective_investigation.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#eab308] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#eab308]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Case File Investigator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Examine evidence, find alibi contradictions, and identify the culprit. Build your case before making an accusation." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#eab308", color: "black" },
                  "data-ocid": "detective_investigation.start_button",
                  children: "Open Case File"
                }
              )
            ]
          }
        ),
        phase === "investigation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#eab308] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Evidence: ",
              examinedEvidence.length,
              "/",
              currentCase.evidences.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#eab308]/30 bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#eab308] mb-1", children: currentCase.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: currentCase.scenario })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Evidence Files" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentCase.evidences.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => examineEvidence(ev),
              className: `text-left p-2 rounded-lg border transition-all text-xs ${examinedEvidence.includes(ev.id) ? "border-[#eab308]/50 bg-[#eab308]/10" : "border-border/30 bg-card/40 hover:border-[#eab308]/30"}`,
              "data-ocid": `detective.evidence.${ev.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[#eab308]/90 mb-0.5", children: ev.title }),
                examinedEvidence.includes(ev.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground leading-tight", children: ev.detail }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "[Click to examine]" })
              ]
            },
            ev.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activeEvidence && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "rounded-lg border border-[#eab308]/40 bg-[#eab308]/5 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#eab308]", children: activeEvidence.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: activeEvidence.detail })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPhase("accusation"),
              disabled: examinedEvidence.length < 2,
              className: "self-center px-6 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed",
              style: { background: "#eab308", color: "black" },
              "data-ocid": "detective_investigation.accuse_button",
              children: "Make Accusation"
            }
          )
        ] }),
        phase === "accusation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground", children: "Based on your evidence, who is the culprit?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: currentCase.suspects.map((suspect) => {
            const hasContradiction = suspect.contradictionEvidenceId && examinedEvidence.includes(suspect.contradictionEvidenceId);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => makeAccusation(suspect.id),
                className: `text-left p-3 rounded-xl border-2 transition-all ${accusation === suspect.id ? suspect.id === currentCase.culpritId ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10" : "border-border/30 bg-card/40 hover:border-[#eab308]/50"}`,
                "data-ocid": `detective.suspect.${suspect.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: suspect.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    "Alibi: ",
                    suspect.alibi
                  ] }),
                  hasContradiction && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[#f43f5e] mt-0.5", children: "Alibi contradicted by evidence" })
                ]
              },
              suspect.id
            );
          }) }),
          accusation && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-lg p-3 text-sm border ${accusation === currentCase.culpritId ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
              children: [
                accusation === currentCase.culpritId ? "Correct! " : "Wrong. ",
                currentCase.solution
              ]
            }
          )
        ] })
      ]
    }
  );
}
const ALIBI_CASES = [
  {
    crime: "Theft at National Museum",
    crimeWindow: "2:15pm – 2:45pm",
    crimeLocation: "National Museum (downtown)",
    suspects: [
      {
        name: "Dr. Watts",
        alibi: "Was at university library on campus",
        location: "University library",
        distanceMins: 45,
        impossibleId: "watts"
      },
      {
        name: "Ms. Lima",
        alibi: "Attending yoga class at gym nearby",
        location: "Gym (5 mins away)",
        distanceMins: 5,
        impossibleId: ""
      },
      {
        name: "Mr. Osei",
        alibi: "Working from home (no verification)",
        location: "Home (30 mins away)",
        distanceMins: 30,
        impossibleId: ""
      }
    ],
    impossibleSuspect: "watts",
    explanation: "Dr. Watts' university campus is 45 minutes from the museum. Even leaving at 2pm they couldn't arrive until 2:45pm — the crime window end. The alibi is physically impossible."
  },
  {
    crime: "Computer Lab Break-in",
    crimeWindow: "10:30pm – 11:00pm",
    crimeLocation: "School computer lab",
    suspects: [
      {
        name: "Jake",
        alibi: "At a cinema 20 minutes away. Movie ended at 10:45pm.",
        location: "Cinema (20 mins)",
        distanceMins: 20,
        impossibleId: ""
      },
      {
        name: "Nadia",
        alibi: "At home in village 90 minutes away with no transport",
        location: "Village (90 mins)",
        distanceMins: 90,
        impossibleId: "nadia"
      },
      {
        name: "Theo",
        alibi: "At a friend's house 10 minutes away",
        location: "Friend's house (10 mins)",
        distanceMins: 10,
        impossibleId: ""
      }
    ],
    impossibleSuspect: "nadia",
    explanation: "Nadia lives 90 minutes away with no transport. Even if she left at 9pm she wouldn't arrive until 10:30pm, which is the earliest point of the crime window. With no return transport confirmed, presence is impossible."
  },
  {
    crime: "Safe Robbery at Jewelry Store",
    crimeWindow: "3:00pm – 3:20pm",
    crimeLocation: "Central Jewelry Store",
    suspects: [
      {
        name: "Mr. Cross",
        alibi: "In meeting at office building 5 minutes away, meeting ended at 2:55pm",
        location: "Office (5 mins)",
        distanceMins: 5,
        impossibleId: ""
      },
      {
        name: "Ms. Phan",
        alibi: "Was at airport checking in for a 3:10pm flight",
        location: "Airport (60 mins)",
        distanceMins: 60,
        impossibleId: "phan"
      },
      {
        name: "Leo Gray",
        alibi: "Was at gym around the corner",
        location: "Gym (2 mins)",
        distanceMins: 2,
        impossibleId: ""
      }
    ],
    impossibleSuspect: "phan",
    explanation: "Ms. Phan was checking in at the airport — 60 minutes from the store — for a 3:10pm flight. Airport check-in and security takes at minimum 40 minutes. She could not be at the store during 3:00-3:20pm."
  }
];
function AlibiChecker({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const cases = ALIBI_CASES.slice(0, count);
  const [phase, setPhase] = reactExports.useState("idle");
  const [cIdx, setCIdx] = reactExports.useState(0);
  const [picked, setPicked] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const livesRef = reactExports.useRef(lives);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
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
    setPhase("playing");
  }
  const ac = cases[cIdx];
  function pickSuspect(suspectId) {
    if (picked) return;
    setPicked(suspectId);
    const correct = suspectId === ac.impossibleSuspect;
    if (correct) {
      const pts = 600 * config.difficulty + timeLeft * 4;
      setScore((s) => s + pts);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
    }
    setTimeout(() => {
      if (cIdx + 1 >= cases.length) {
        endGame(correct || livesRef.current > 0);
        return;
      }
      setCIdx((i) => i + 1);
      setPicked(null);
    }, 2500);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "alibi_checker.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#eab308] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#eab308]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Alibi Checker"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "A crime occurred in a specific time window and location. Read each suspect's alibi and travel distance. Identify whose alibi is physically impossible." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                cases.length,
                " cases | Time + distance logic"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#eab308", color: "black" },
                  "data-ocid": "alibi_checker.start_button",
                  children: "Check Alibis"
                }
              )
            ]
          }
        ),
        phase === "playing" && ac && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#eab308] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Case ",
              cIdx + 1,
              "/",
              cases.length,
              " | Lives: ",
              lives
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#eab308]/30 bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#eab308] mb-1", children: ac.crime }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Crime window:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono", children: ac.crimeWindow })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Location:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: ac.crimeLocation })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Whose alibi is impossible given the time and distance?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ac.suspects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => pickSuspect(
                s.impossibleId || s.name.toLowerCase().replace(" ", "_")
              ),
              className: `w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${picked && s.impossibleId === ac.impossibleSuspect ? "border-[#22c55e] bg-[#22c55e]/10" : picked && (s.impossibleId || s.name.toLowerCase().replace(" ", "_")) === picked && s.impossibleId !== ac.impossibleSuspect ? "border-[#f43f5e] bg-[#f43f5e]/10" : "border-border/30 bg-card/50 hover:border-[#eab308]/50"}`,
              "data-ocid": `alibi_checker.suspect.${s.impossibleId || s.name}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm mb-1", children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.alibi }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-xs font-mono mt-1",
                    style: { color: "#eab308" },
                    children: [
                      "Distance: ",
                      s.distanceMins,
                      " minutes travel"
                    ]
                  }
                )
              ]
            },
            s.impossibleId || s.name
          )) }),
          picked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-lg p-3 text-sm border ${picked === ac.impossibleSuspect ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
              children: [
                picked === ac.impossibleSuspect ? "Correct! " : "Incorrect. ",
                ac.explanation
              ]
            }
          )
        ] })
      ]
    }
  );
}
const CSA_CASES = [
  {
    title: "Bank Robbery",
    description: "A bank was robbed at 3pm. The robber wore a mask and fled in a vehicle. Investigators found several items at the scene.",
    topThreeIds: ["fingerprint", "cctv_footage", "getaway_car"],
    evidences: [
      {
        id: "fingerprint",
        title: "Fingerprint on counter",
        description: "Partial fingerprint lifted from the teller counter.",
        category: "Physical",
        relevanceScore: 95,
        reason: "Directly links a person to the crime location."
      },
      {
        id: "cctv_footage",
        title: "CCTV footage",
        description: "Security camera captured the robbery on video.",
        category: "Digital",
        relevanceScore: 92,
        reason: "Visual record of the perpetrator in action."
      },
      {
        id: "getaway_car",
        title: "Abandoned vehicle",
        description: "Car matching witness description found 2km away.",
        category: "Physical",
        relevanceScore: 88,
        reason: "Physical link to flight route and potentially the suspect."
      },
      {
        id: "witness_stmt",
        title: "Witness statement",
        description: "Customer saw a person in a grey jacket enter.",
        category: "Testimonial",
        relevanceScore: 60,
        reason: "Useful but subjective and only partial description."
      },
      {
        id: "ransom_note",
        title: "Demand note",
        description: "Handwritten note passed to teller.",
        category: "Documentary",
        relevanceScore: 75,
        reason: "May contain handwriting or DNA, but secondary."
      },
      {
        id: "coin_jar",
        title: "Spilled coins",
        description: "Coins scattered on floor near exit.",
        category: "Physical",
        relevanceScore: 20,
        reason: "Low relevance — coincidental scatter, not identifying."
      },
      {
        id: "weather_report",
        title: "Weather report",
        description: "It was raining heavily at the time.",
        category: "Documentary",
        relevanceScore: 5,
        reason: "Environmental factor with no direct link to suspect."
      },
      {
        id: "bank_statement",
        title: "Victim bank records",
        description: "Shows the amount stolen.",
        category: "Documentary",
        relevanceScore: 40,
        reason: "Quantifies the crime but doesn't identify the perpetrator."
      }
    ]
  }
];
function CrimeSceneAnalyst({ config, onGameEnd }) {
  const crimeCase = CSA_CASES[0];
  const [phase, setPhase] = reactExports.useState(
    "idle"
  );
  const [ranked, setRanked] = reactExports.useState([]);
  const [categoryPicks, setCategoryPicks] = reactExports.useState({});
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
          completed ? 90 : 50,
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
    setPhase("ranking");
  }
  function toggleRank(id) {
    setRanked(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }
  function setCategory(id, cat) {
    setCategoryPicks((prev) => ({ ...prev, [id]: cat }));
  }
  function submitAnalysis() {
    const correctTop3 = crimeCase.topThreeIds.filter(
      (id) => ranked.includes(id)
    ).length;
    const correctCats = crimeCase.evidences.filter(
      (e) => categoryPicks[e.id] === e.category
    ).length;
    const pts = (correctTop3 * 200 + correctCats * 80) * config.difficulty + timeLeft * 2;
    setScore(pts);
    setPhase("result");
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const catColors = {
    Physical: "#f59e0b",
    Testimonial: "#3b82f6",
    Digital: "#22c55e",
    Documentary: "#a855f7"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "crime_scene_analyst.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#eab308] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#eab308]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Crime Scene Analyst"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Classify each piece of evidence as Physical / Testimonial / Digital / Documentary. Then select the top 3 most relevant pieces." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all",
                  style: { background: "#eab308", color: "black" },
                  "data-ocid": "crime_scene_analyst.start_button",
                  children: "Analyze Scene"
                }
              )
            ]
          }
        ),
        phase === "ranking" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#eab308] font-mono", children: [
              "Top 3 selected: ",
              ranked.length,
              "/3"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#eab308]/30 bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#eab308] mb-1", children: crimeCase.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: crimeCase.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "For each evidence: classify its type, then click to select top 3 most relevant." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: crimeCase.evidences.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-xl border-2 p-3 transition-all ${ranked.includes(ev.id) ? "border-[#eab308] bg-[#eab308]/10" : "border-border/20 bg-card/30"}`,
              "data-ocid": `crime_scene_analyst.evidence.${ev.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", children: ev.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: ev.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleRank(ev.id),
                      className: `ml-2 px-2 py-1 rounded text-xs font-bold transition-all shrink-0 ${ranked.includes(ev.id) ? "bg-[#eab308] text-black" : ranked.length < 3 ? "border border-[#eab308]/40 text-[#eab308]" : "border border-border/30 opacity-40"}`,
                      "data-ocid": `crime_scene_analyst.rank.${ev.id}`,
                      children: ranked.includes(ev.id) ? `#${ranked.indexOf(ev.id) + 1}` : "Select"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-2", children: [
                  "Physical",
                  "Testimonial",
                  "Digital",
                  "Documentary"
                ].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCategory(ev.id, cat),
                    className: "px-2 py-0.5 rounded text-xs transition-all border",
                    style: {
                      borderColor: categoryPicks[ev.id] === cat ? catColors[cat] : "transparent",
                      background: categoryPicks[ev.id] === cat ? `${catColors[cat]}20` : "transparent",
                      color: categoryPicks[ev.id] === cat ? catColors[cat] : "#94a3b8"
                    },
                    "data-ocid": `crime_scene_analyst.cat.${ev.id}.${cat}`,
                    children: cat
                  },
                  cat
                )) })
              ]
            },
            ev.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: submitAnalysis,
              disabled: ranked.length < 3,
              className: "self-center px-8 py-2 rounded-lg font-bold text-sm disabled:opacity-40",
              style: { background: "#eab308", color: "black" },
              "data-ocid": "crime_scene_analyst.submit_button",
              children: "Submit Analysis"
            }
          )
        ] }),
        phase === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-[#eab308]", children: "Analysis Results" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#eab308]/30 bg-card/40 p-4 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Your top 3 picks:" }),
                ranked.map((id) => {
                  const ev = crimeCase.evidences.find((e) => e.id === id);
                  const correct = crimeCase.topThreeIds.includes(id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `flex gap-2 items-start text-sm rounded-lg p-2 border ${correct ? "border-[#22c55e]/30 bg-[#22c55e]/10" : "border-[#f43f5e]/30 bg-[#f43f5e]/10"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-bold",
                            style: { color: correct ? "#22c55e" : "#f43f5e" },
                            children: correct ? "V" : "X"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: ev.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ev.reason })
                        ] })
                      ]
                    },
                    id
                  );
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-black text-[#eab308]", children: [
                score.toLocaleString(),
                " pts"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => endGame(true),
                  className: "self-center px-8 py-3 rounded-lg font-bold",
                  style: { background: "#eab308", color: "black" },
                  "data-ocid": "crime_scene_analyst.finish_button",
                  children: "Finish"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function DetectiveInvestigation({ config, onGameEnd }) {
  if (config.gameId === "alibi-checker")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlibiChecker, { config, onGameEnd });
  if (config.gameId === "crime-scene-analyst")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CrimeSceneAnalyst, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CaseFileInvestigator, { config, onGameEnd });
}
export {
  DetectiveInvestigation as default
};
