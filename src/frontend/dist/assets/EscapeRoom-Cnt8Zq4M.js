import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
const ROOM_DATA = [
  {
    id: "lab",
    name: "Science Lab",
    bg: "#0f172a",
    items: [
      {
        id: "notebook",
        label: "Old Notebook",
        x: 10,
        y: 55,
        width: 12,
        height: 16,
        collectible: true,
        revealsClue: "The code is the sum of the prime numbers under 10."
      },
      {
        id: "microscope",
        label: "Microscope",
        x: 60,
        y: 45,
        width: 14,
        height: 22,
        revealsClue: "Look for a 2-digit code on the safe."
      },
      { id: "safe", label: "Safe", x: 40, y: 60, width: 16, height: 20 }
    ],
    puzzles: [
      {
        id: "safe_code",
        prompt: "The sum of prime numbers under 10 (2+3+5+7). Enter the 2-digit code:",
        type: "code",
        input: [],
        answer: "17",
        rewardItem: "keycard"
      }
    ],
    nextRoomUnlockItem: "keycard"
  },
  {
    id: "vault",
    name: "Security Vault",
    bg: "#0c1427",
    items: [
      {
        id: "panel",
        label: "Control Panel",
        x: 30,
        y: 40,
        width: 40,
        height: 25,
        revealsClue: "Sequence: red, blue, red, green, ?"
      },
      {
        id: "manual",
        label: "Color Manual",
        x: 70,
        y: 65,
        width: 12,
        height: 18,
        collectible: true,
        revealsClue: "Each pair alternates. After red-blue-red-green comes red."
      }
    ],
    puzzles: [
      {
        id: "sequence",
        prompt: "Complete the sequence: Red, Blue, Red, Green, ?",
        type: "sequence",
        input: ["Red", "Blue", "Green", "Yellow"],
        answer: "Red",
        rewardItem: "access_code"
      }
    ],
    nextRoomUnlockItem: "access_code"
  },
  {
    id: "exit",
    name: "Exit Chamber",
    bg: "#0a1020",
    items: [
      {
        id: "cipher_note",
        label: "Cipher Note",
        x: 20,
        y: 50,
        width: 15,
        height: 20,
        collectible: true,
        revealsClue: "Caesar cipher +3: ORYH = ?"
      },
      { id: "door", label: "Exit Door", x: 55, y: 30, width: 20, height: 50 }
    ],
    puzzles: [
      {
        id: "cipher",
        prompt: "Decode Caesar cipher (shift -3): ORYH",
        type: "cipher",
        input: ["LOVE", "HATE", "FIRE", "LOST"],
        answer: "LOVE",
        rewardItem: "escape"
      }
    ]
  }
];
function DigitalEscapeRoom({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [roomIdx, setRoomIdx] = reactExports.useState(0);
  const [inventory, setInventory] = reactExports.useState([]);
  const [clues, setClues] = reactExports.useState([]);
  const [activePuzzle, setActivePuzzle] = reactExports.useState(null);
  const [puzzleInput, setPuzzleInput] = reactExports.useState("");
  const [solvedPuzzles, setSolvedPuzzles] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [examineMsg, setExamineMsg] = reactExports.useState("");
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
          completed ? 100 : 50,
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
  const room = ROOM_DATA[roomIdx];
  function handleItemClick(item) {
    if (item.collectible && !inventory.includes(item.id))
      setInventory((prev) => [...prev, item.id]);
    if (item.revealsClue && !clues.includes(item.revealsClue)) {
      setClues((prev) => [...prev, item.revealsClue]);
      setExamineMsg(`Clue: ${item.revealsClue}`);
    } else if (!item.revealsClue && !item.collectible) {
      const puzzle = room.puzzles.find(
        (p) => p.id.includes(item.id.split("_")[0]) || item.id === "safe" || item.id === "panel" || item.id === "door"
      );
      if (puzzle && !solvedPuzzles.includes(puzzle.id)) {
        if (puzzle.requiresItem && !inventory.includes(puzzle.requiresItem)) {
          setExamineMsg(`Need ${puzzle.requiresItem} first.`);
          return;
        }
        setActivePuzzle(puzzle);
        setPuzzleInput("");
      } else if (puzzle && solvedPuzzles.includes(puzzle.id))
        setExamineMsg("Already solved.");
    }
    setTimeout(() => setExamineMsg(""), 3e3);
  }
  function openPuzzleForRoom() {
    const unsolved = room.puzzles.find((p) => !solvedPuzzles.includes(p.id));
    if (unsolved) {
      setActivePuzzle(unsolved);
      setPuzzleInput("");
    }
  }
  function submitPuzzle() {
    if (!activePuzzle) return;
    const correct = puzzleInput.trim().toUpperCase() === activePuzzle.answer.toUpperCase() || puzzleInput.trim() === activePuzzle.answer;
    if (correct) {
      const pts = 600 * config.difficulty + timeLeft * 4;
      setScore((s) => s + pts);
      setSolvedPuzzles((prev) => [...prev, activePuzzle.id]);
      setInventory((prev) => [...prev, activePuzzle.rewardItem]);
      if (activePuzzle.rewardItem === "escape") {
        setActivePuzzle(null);
        setTimeout(() => endGame(true), 1e3);
        return;
      }
      if (room.nextRoomUnlockItem && activePuzzle.rewardItem === room.nextRoomUnlockItem)
        setTimeout(
          () => setRoomIdx((r) => Math.min(r + 1, ROOM_DATA.length - 1)),
          1e3
        );
      setActivePuzzle(null);
      setExamineMsg(`Solved! +${pts} pts`);
    } else setExamineMsg("Incorrect. Try again.");
    setTimeout(() => setExamineMsg(""), 2500);
  }
  function selectSequenceAnswer(ans) {
    if (!activePuzzle) return;
    const correct = ans === activePuzzle.answer;
    if (correct) {
      const pts = 600 * config.difficulty + timeLeft * 4;
      setScore((s) => s + pts);
      setSolvedPuzzles((prev) => [...prev, activePuzzle.id]);
      setInventory((prev) => [...prev, activePuzzle.rewardItem]);
      if (room.nextRoomUnlockItem && activePuzzle.rewardItem === room.nextRoomUnlockItem)
        setTimeout(
          () => setRoomIdx((r) => Math.min(r + 1, ROOM_DATA.length - 1)),
          1e3
        );
      setActivePuzzle(null);
      setExamineMsg(`Correct! +${pts} pts`);
    } else setExamineMsg("Not quite.");
    setTimeout(() => setExamineMsg(""), 2e3);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "escape_room.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#f97316] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#f97316]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Digital Escape Room"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Examine items, collect clues, solve cipher puzzles and logic sequences. Escape all 3 rooms before time runs out." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#f97316" },
                  "data-ocid": "escape_room.start_button",
                  children: "Enter Room 1"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f97316] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              room.name,
              " (",
              roomIdx + 1,
              "/",
              ROOM_DATA.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "relative rounded-xl border border-border/30 overflow-hidden",
              style: { height: 200, background: room.bg },
              children: room.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleItemClick(item),
                  className: `absolute rounded border transition-all hover:opacity-90 text-[9px] text-center flex items-center justify-center font-bold ${inventory.includes(item.id) ? "border-[#f59e0b]/30 bg-[#f59e0b]/5 text-[#f59e0b]/50" : "border-[#f97316]/50 bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20"}`,
                  style: {
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: `${item.width}%`,
                    height: `${item.height}%`
                  },
                  "data-ocid": `escape_room.item.${item.id}`,
                  children: item.label
                },
                item.id
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/30 bg-card/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-1", children: "Clue Board" }),
            clues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Examine items to find clues." }) : clues.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#f97316]/90", children: c }, `clue-${i}`))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Inventory:" }),
            inventory.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "px-2 py-0.5 rounded text-xs bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316]",
                children: it
              },
              it
            ))
          ] }),
          examineMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-sm text-center text-[#f59e0b]",
              children: examineMsg
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: openPuzzleForRoom,
              className: "self-center px-6 py-2 rounded-lg border border-[#f97316]/50 text-[#f97316] text-sm hover:bg-[#f97316]/10 transition-colors",
              "data-ocid": "escape_room.puzzle_button",
              children: "Attempt Puzzle"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activePuzzle && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[#f97316]/30 bg-card p-5 max-w-sm w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#f97316] mb-2", children: "Puzzle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mb-4", children: activePuzzle.prompt }),
              activePuzzle.type === "sequence" || activePuzzle.type === "cipher" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: activePuzzle.input.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => selectSequenceAnswer(opt),
                  className: "px-3 py-2 rounded border border-border/40 bg-card/60 text-sm hover:border-[#f97316] transition-all",
                  "data-ocid": `escape_room.answer.${i}`,
                  children: opt
                },
                `opt-${i}`
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: puzzleInput,
                    onChange: (e) => setPuzzleInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && submitPuzzle(),
                    className: "flex-1 rounded border border-border/40 bg-background px-3 py-2 text-sm focus:border-[#f97316] focus:outline-none",
                    placeholder: "Enter code",
                    "data-ocid": "escape_room.code_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: submitPuzzle,
                    className: "px-4 py-2 rounded bg-[#f97316] text-white text-sm font-bold hover:opacity-90",
                    "data-ocid": "escape_room.submit_button",
                    children: "Submit"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActivePuzzle(null),
                  className: "mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors",
                  "data-ocid": "escape_room.close_button",
                  children: "Cancel"
                }
              )
            ] })
          }
        ) })
      ]
    }
  );
}
const TV_ROOMS = [
  {
    name: "Cipher Chamber",
    bg: "#080f1a",
    puzzles: [
      {
        id: "cipher1",
        prompt: "ROT-13 decode: FRPERG",
        answer: "SECRET",
        hint: "Each letter shifts 13 positions."
      },
      {
        id: "math1",
        prompt: "Lock combo: (3^3) + (4^2) + 7 = ?",
        answer: "50",
        hint: "27 + 16 + 7"
      }
    ]
  },
  {
    name: "Binary Vault",
    bg: "#050d14",
    puzzles: [
      {
        id: "binary1",
        prompt: "Binary to decimal: 1011",
        answer: "11",
        hint: "8+0+2+1"
      },
      {
        id: "hex1",
        prompt: "Hex to decimal: 1F",
        answer: "31",
        hint: "16*1 + 15"
      }
    ]
  },
  {
    name: "Logic Lock",
    bg: "#030810",
    puzzles: [
      {
        id: "logic1",
        prompt: "All A are B. All B are C. Is every A a C? Answer YES or NO.",
        answer: "YES",
        hint: "Syllogism: A⊂B, B⊂C ⇒ A⊂C"
      },
      {
        id: "prime1",
        prompt: "The 5th prime number is?",
        answer: "11",
        hint: "2,3,5,7,11..."
      }
    ]
  }
];
function TimeVault({ config, onGameEnd }) {
  const TIME_LIMIT = config.difficulty === 1 ? 240 : config.difficulty === 2 ? 180 : 120;
  const [phase, setPhase] = reactExports.useState("idle");
  const [roomIdx, setRoomIdx] = reactExports.useState(0);
  const [pIdx, setPIdx] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [solved, setSolved] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [hintShown, setHintShown] = reactExports.useState(false);
  const scoreRef = reactExports.useRef(score);
  const phaseRef = reactExports.useRef(phase);
  const startTimeRef = reactExports.useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      const acc = solved / TV_ROOMS.reduce((s, r) => s + r.puzzles.length, 0) * 100;
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
    [config, onGameEnd, solved]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    TIME_LIMIT,
    () => endGame(false)
  );
  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }
  const room = TV_ROOMS[roomIdx];
  const puzzle = room.puzzles[pIdx];
  function submit() {
    const isCorrect = input.trim().toUpperCase() === puzzle.answer.toUpperCase();
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 3);
      const pts = 400 * config.difficulty + timeBonus;
      setScore((s) => s + pts);
      setSolved((s) => s + 1);
      setFeedback({
        msg: `Correct! +${pts} pts (${timeBonus} time bonus)`,
        good: true
      });
      setTimeout(() => {
        setFeedback(null);
        setInput("");
        setHintShown(false);
        const nextP = pIdx + 1;
        if (nextP >= room.puzzles.length) {
          const nextR = roomIdx + 1;
          if (nextR >= TV_ROOMS.length) {
            endGame(true);
            return;
          }
          setRoomIdx(nextR);
          setPIdx(0);
        } else setPIdx(nextP);
      }, 1500);
    } else {
      setFeedback({ msg: "Incorrect. Think faster!", good: false });
      setTimeout(() => setFeedback(null), 1200);
    }
  }
  const timePct = timeLeft / TIME_LIMIT * 100;
  const urgencyColor = timeLeft < 30 ? "#f43f5e" : timeLeft < 60 ? "#f59e0b" : "#f97316";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "time_vault.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full transition-all duration-1000",
            style: { width: `${timePct}%`, background: urgencyColor }
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
                  className: "text-3xl font-black",
                  style: {
                    fontFamily: "'Orbitron', sans-serif",
                    color: urgencyColor
                  },
                  children: "Time Vault"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: [
                "3 rooms, 6 hard puzzles, ",
                TIME_LIMIT,
                " seconds total. Harder ciphers, binary decoding, and logic locks. Score bonuses for speed."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold", style: { color: urgencyColor }, children: "Time pressure is real. Every second counts." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: urgencyColor },
                  "data-ocid": "time_vault.start_button",
                  children: "Start the Clock"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", style: { color: urgencyColor }, children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              room.name,
              " | Puzzle ",
              pIdx + 1,
              "/",
              room.puzzles.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono font-bold tabular-nums",
                style: { color: urgencyColor },
                children: [
                  timeLeft,
                  "s"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border bg-card/40 p-4",
              style: { borderColor: `${urgencyColor}40` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold uppercase tracking-widest mb-2",
                    style: { color: urgencyColor },
                    children: "VAULT PUZZLE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold font-mono", children: puzzle.prompt })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && submit(),
                className: "flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono focus:outline-none",
                style: { borderColor: `${urgencyColor}40` },
                placeholder: "Enter answer fast...",
                "data-ocid": "time_vault.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: submit,
                className: "px-4 py-2 rounded-lg font-bold text-sm text-white",
                style: { background: urgencyColor },
                "data-ocid": "time_vault.submit_button",
                children: "Go"
              }
            )
          ] }),
          !hintShown && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setHintShown(true),
              className: "self-start text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors",
              "data-ocid": "time_vault.hint_button",
              children: "Show Hint (-50pts)"
            }
          ),
          hintShown && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#f59e0b] border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-2 rounded-lg", children: [
            "Hint: ",
            puzzle.hint
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: `text-sm font-bold text-center ${feedback.good ? "text-[#22c55e]" : "text-[#f43f5e]"}`,
              children: feedback.msg
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-auto", children: TV_ROOMS.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-1 h-1.5 rounded-full transition-all ${i < roomIdx ? "bg-[#22c55e]" : i === roomIdx ? "bg-[#f97316]/60" : "bg-muted"}`
            },
            r.name
          )) })
        ] })
      ]
    }
  );
}
const CC_ROOMS = [
  {
    name: "Library",
    clues: [
      {
        id: "footprint",
        label: "Muddy Footprint",
        text: "Size 12 boot print. Ms. Carter wears size 6.",
        eliminates: "carter"
      },
      {
        id: "receipt",
        label: "Coffee Receipt",
        text: "Receipt time-stamped 2:30pm at cafe across town. Mr. Blake was there.",
        eliminates: "blake"
      }
    ],
    suspect: {
      name: "Dr. Finch",
      eliminatedBy: "fingerprint_match",
      motive: "Had access to restricted section"
    }
  },
  {
    name: "Study Room",
    clues: [
      {
        id: "phone_log",
        label: "Phone Log",
        text: "Prof. Hale called colleague at 3pm — during crime window.",
        eliminates: "hale"
      },
      {
        id: "torn_note",
        label: "Torn Note",
        text: "Partial note signed 'D.F.' found near window.",
        eliminates: "none"
      }
    ],
    suspect: {
      name: "Prof. Dex",
      eliminatedBy: "alibi_confirmed",
      motive: "Jealous of research rival"
    }
  },
  {
    name: "Vault Room",
    clues: [
      {
        id: "keycard",
        label: "Access Keycard",
        text: "Only suspect Mara had vault access that day.",
        eliminates: "others"
      },
      {
        id: "witness",
        label: "Witness Statement",
        text: "Security saw a tall figure. Mara is 6ft 1in. Others are under 5ft 8in.",
        eliminates: "short_suspects"
      }
    ],
    suspect: {
      name: "Mara Voss",
      eliminatedBy: "keycard_match",
      motive: "Financial motive confirmed"
    }
  }
];
const CC_SUSPECTS = [
  { id: "mara", name: "Mara Voss" },
  { id: "finch", name: "Dr. Finch" },
  { id: "prof_dex", name: "Prof. Dex" },
  { id: "blake", name: "Mr. Blake" }
];
function ClueCollector({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [roomIdx, setRoomIdx] = reactExports.useState(0);
  const [collectedClues, setCollectedClues] = reactExports.useState([]);
  const [eliminatedSuspects, setEliminatedSuspects] = reactExports.useState([]);
  const [accusation, setAccusation] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [msg, setMsg] = reactExports.useState("");
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
          completed ? 95 : 40,
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
  const room = CC_ROOMS[roomIdx];
  function collectClue(clue) {
    if (collectedClues.includes(clue.id)) return;
    setCollectedClues((prev) => [...prev, clue.id]);
    setMsg(`Clue: ${clue.text}`);
    if (clue.eliminates !== "none" && clue.eliminates !== "others" && clue.eliminates !== "short_suspects") {
      setEliminatedSuspects((prev) => [...prev, clue.eliminates]);
    }
    setScore((s) => s + 100 * config.difficulty);
    setTimeout(() => setMsg(""), 3e3);
  }
  function proceedToNextRoom() {
    const next = roomIdx + 1;
    if (next >= CC_ROOMS.length) {
      setPhase("accusation");
      return;
    }
    setRoomIdx(next);
  }
  function makeAccusation(suspectId) {
    setAccusation(suspectId);
    const correct = suspectId === "mara";
    const pts = correct ? 1e3 * config.difficulty + timeLeft * 5 : 0;
    if (correct) setScore((s) => s + pts);
    setTimeout(() => endGame(correct), 2500);
  }
  const timePct = timeLeft / config.timeLimit * 100;
  const roomCluesCollected = room.clues.filter(
    (c) => collectedClues.includes(c.id)
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "clue_collector.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-[#f97316] transition-all duration-1000",
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
                  className: "text-3xl font-black text-[#f97316]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Clue Collector"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm text-sm", children: "Investigate 3 crime scene rooms. Collect physical evidence. Eliminate suspects. Make the final accusation." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                CC_ROOMS.length,
                " rooms | ",
                CC_SUSPECTS.length,
                " suspects | 1 culprit"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: startGame,
                  className: "px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white",
                  style: { background: "#f97316" },
                  "data-ocid": "clue_collector.start_button",
                  children: "Enter Crime Scene"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f97316] font-mono", children: [
              "Score: ",
              score.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              room.name,
              " (Room ",
              roomIdx + 1,
              "/",
              CC_ROOMS.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Collect all clues before proceeding. Eliminated suspects:",
            " ",
            eliminatedSuspects.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: room.clues.map((clue) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => collectClue(clue),
              className: `text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${collectedClues.includes(clue.id) ? "border-[#f97316]/50 bg-[#f97316]/10" : "border-border/30 bg-card/50 hover:border-[#f97316]/30"}`,
              "data-ocid": `clue_collector.clue.${clue.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[#f97316]/90 mb-1", children: clue.label }),
                collectedClues.includes(clue.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: clue.text }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "[Click to examine]" })
              ]
            },
            clue.id
          )) }),
          msg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-xs text-[#f59e0b]",
              children: msg
            }
          ),
          roomCluesCollected >= room.clues.length && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: proceedToNextRoom,
              className: "self-center px-6 py-2 rounded-lg font-bold text-sm text-white",
              style: { background: "#f97316" },
              "data-ocid": "clue_collector.next_room_button",
              children: roomIdx + 1 < CC_ROOMS.length ? "Next Room" : "Make Accusation"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: CC_ROOMS.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-1 h-1 rounded-full ${i < roomIdx ? "bg-[#22c55e]" : i === roomIdx ? "bg-[#f97316]" : "bg-muted"}`
            },
            r.name
          )) })
        ] }),
        phase === "accusation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#f97316]", children: "Based on your evidence, who is responsible?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Eliminated: ",
            eliminatedSuspects.join(", ") || "none"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: CC_SUSPECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => makeAccusation(s.id),
              className: `text-left px-4 py-3 rounded-xl border-2 transition-all ${accusation === s.id ? s.id === "mara" ? "border-[#22c55e] bg-[#22c55e]/10" : "border-[#f43f5e] bg-[#f43f5e]/10" : eliminatedSuspects.includes(s.id.replace("prof_", "")) ? "border-border/20 bg-card/20 opacity-50" : "border-border/30 bg-card/50 hover:border-[#f97316]/50"}`,
              "data-ocid": `clue_collector.suspect.${s.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: s.name }),
                eliminatedSuspects.includes(s.id.replace("prof_", "")) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Alibi confirmed by evidence" })
              ]
            },
            s.id
          )) }),
          accusation && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-lg p-3 text-sm border ${accusation === "mara" ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
              children: accusation === "mara" ? "Correct! Mara Voss had sole keycard access and matching height. The evidence chain is complete." : "Incorrect. Review the keycard and witness statement from the Vault Room."
            }
          )
        ] })
      ]
    }
  );
}
function EscapeRoom({ config, onGameEnd }) {
  if (config.gameId === "time-vault")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TimeVault, { config, onGameEnd });
  if (config.gameId === "clue-collector")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ClueCollector, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DigitalEscapeRoom, { config, onGameEnd });
}
export {
  EscapeRoom as default
};
