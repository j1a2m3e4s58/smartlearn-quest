import { j as jsxRuntimeExports, r as reactExports, m as motion, k as Shield, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { T as TriangleAlert } from "./triangle-alert-10AslQ5h.js";
const SENTENCES = {
  1: [
    {
      id: "g1",
      sentence: "She don't like ice cream.",
      words: ["She", "don't", "like", "ice", "cream."],
      errorIndex: 1,
      correction: "doesn't",
      rule: "Subject-verb agreement: use 'doesn't' with she/he/it",
      options: ["doesn't", "don't", "didn't", "ain't"]
    },
    {
      id: "g2",
      sentence: "The childrens are playing.",
      words: ["The", "childrens", "are", "playing."],
      errorIndex: 1,
      correction: "children",
      rule: "'Children' is already plural — no 's' needed",
      options: ["children", "childs", "childrens", "child's"]
    },
    {
      id: "g3",
      sentence: "He runned to the store.",
      words: ["He", "runned", "to", "the", "store."],
      errorIndex: 1,
      correction: "ran",
      rule: "'Run' has an irregular past tense: ran",
      options: ["ran", "runned", "has run", "running"]
    },
    {
      id: "g4",
      sentence: "I goed to school yesterday.",
      words: ["I", "goed", "to", "school", "yesterday."],
      errorIndex: 1,
      correction: "went",
      rule: "'Go' has an irregular past tense: went",
      options: ["went", "goed", "go", "gone"]
    },
    {
      id: "g5",
      sentence: "There is many books on the shelf.",
      words: ["There", "is", "many", "books", "on", "the", "shelf."],
      errorIndex: 1,
      correction: "are",
      rule: "'Many books' is plural — use 'are'",
      options: ["are", "is", "was", "be"]
    },
    {
      id: "g6",
      sentence: "She have a red bicycle.",
      words: ["She", "have", "a", "red", "bicycle."],
      errorIndex: 1,
      correction: "has",
      rule: "Third person singular: use 'has'",
      options: ["has", "have", "had", "having"]
    }
  ],
  2: [
    {
      id: "g7",
      sentence: "Neither the students nor the teacher were ready.",
      words: [
        "Neither",
        "the",
        "students",
        "nor",
        "the",
        "teacher",
        "were",
        "ready."
      ],
      errorIndex: 6,
      correction: "was",
      rule: "With 'neither...nor', the verb agrees with the nearest subject ('teacher' — singular)",
      options: ["was", "were", "are", "be"]
    },
    {
      id: "g8",
      sentence: "If I was you, I would study harder.",
      words: ["If", "I", "was", "you,", "I", "would", "study", "harder."],
      errorIndex: 2,
      correction: "were",
      rule: "Subjunctive mood: 'If I were you' expresses hypothetical situations",
      options: ["were", "was", "am", "be"]
    },
    {
      id: "g9",
      sentence: "Each of the players have their own locker.",
      words: [
        "Each",
        "of",
        "the",
        "players",
        "have",
        "their",
        "own",
        "locker."
      ],
      errorIndex: 4,
      correction: "has",
      rule: "'Each' is singular and always takes a singular verb",
      options: ["has", "have", "had", "having"]
    },
    {
      id: "g10",
      sentence: "She is more smarter than her brother.",
      words: ["She", "is", "more", "smarter", "than", "her", "brother."],
      errorIndex: 2,
      correction: "smarter",
      rule: "Double comparative error: 'smarter' already means 'more smart'",
      options: ["smarter", "more smarter", "most smart", "smart"]
    },
    {
      id: "g11",
      sentence: "The committee have reached a decision.",
      words: ["The", "committee", "have", "reached", "a", "decision."],
      errorIndex: 2,
      correction: "has",
      rule: "Collective nouns like 'committee' take singular verbs in American English",
      options: ["has", "have", "had", "were"]
    },
    {
      id: "g12",
      sentence: "He don't never lie to his friends.",
      words: ["He", "don't", "never", "lie", "to", "his", "friends."],
      errorIndex: 2,
      correction: "ever",
      rule: "Double negative: 'don't never' should be 'doesn't ever'",
      options: ["ever", "never", "always", "sometimes"]
    }
  ],
  3: [
    {
      id: "g13",
      sentence: "The reason is because he was late.",
      words: ["The", "reason", "is", "because", "he", "was", "late."],
      errorIndex: 3,
      correction: "that",
      rule: "'The reason is that' — not 'because'; avoid redundancy",
      options: ["that", "because", "why", "since"]
    },
    {
      id: "g14",
      sentence: "Between you and I, the plan is flawed.",
      words: ["Between", "you", "and", "I,", "the", "plan", "is", "flawed."],
      errorIndex: 3,
      correction: "me,",
      rule: "Prepositions take object pronouns: 'between you and me'",
      options: ["me,", "I,", "myself,", "mine,"]
    },
    {
      id: "g15",
      sentence: "The phenomena is well documented.",
      words: ["The", "phenomena", "is", "well", "documented."],
      errorIndex: 2,
      correction: "are",
      rule: "'Phenomena' is plural; singular is 'phenomenon'",
      options: ["are", "is", "was", "has been"]
    },
    {
      id: "g16",
      sentence: "Having finished the exam, the room was left.",
      words: [
        "Having",
        "finished",
        "the",
        "exam,",
        "the",
        "room",
        "was",
        "left."
      ],
      errorIndex: 5,
      correction: "students",
      rule: "Dangling participle: the subject 'students' is missing",
      options: ["students", "room", "class", "teachers"]
    },
    {
      id: "g17",
      sentence: "The data was analyzed by the lead researcher.",
      words: [
        "The",
        "data",
        "was",
        "analyzed",
        "by",
        "the",
        "lead",
        "researcher."
      ],
      errorIndex: 2,
      correction: "were",
      rule: "'Data' is plural: 'the data were analyzed'",
      options: ["were", "was", "is", "are"]
    },
    {
      id: "g18",
      sentence: "Less students attended due to the rain.",
      words: ["Less", "students", "attended", "due", "to", "the", "rain."],
      errorIndex: 0,
      correction: "Fewer",
      rule: "'Fewer' for countable nouns; 'less' for uncountable nouns",
      options: ["Fewer", "Less", "More", "Many"]
    }
  ]
};
const POS_ITEMS = {
  1: [
    {
      id: "p1",
      sentence: "The brave soldier crossed the field.",
      highlighted: "brave",
      highlightIdx: 1,
      partOfSpeech: "Adjective",
      options: ["Noun", "Verb", "Adjective", "Adverb"],
      explanation: "'Brave' describes the noun 'soldier' — it is an adjective."
    },
    {
      id: "p2",
      sentence: "She runs every morning before school.",
      highlighted: "runs",
      highlightIdx: 1,
      partOfSpeech: "Verb",
      options: ["Noun", "Verb", "Adjective", "Pronoun"],
      explanation: "'Runs' is the action being performed — it is a verb."
    },
    {
      id: "p3",
      sentence: "The dog barked loudly at the stranger.",
      highlighted: "loudly",
      highlightIdx: 3,
      partOfSpeech: "Adverb",
      options: ["Verb", "Adverb", "Adjective", "Noun"],
      explanation: "'Loudly' describes how the dog barked — it is an adverb."
    },
    {
      id: "p4",
      sentence: "They went to the market yesterday.",
      highlighted: "They",
      highlightIdx: 0,
      partOfSpeech: "Pronoun",
      options: ["Noun", "Pronoun", "Adjective", "Conjunction"],
      explanation: "'They' substitutes for a group of people — it is a pronoun."
    },
    {
      id: "p5",
      sentence: "The old bridge collapsed into the river.",
      highlighted: "bridge",
      highlightIdx: 2,
      partOfSpeech: "Noun",
      options: ["Noun", "Verb", "Adjective", "Preposition"],
      explanation: "'Bridge' names a thing — it is a noun."
    },
    {
      id: "p6",
      sentence: "He placed the book on the shelf.",
      highlighted: "on",
      highlightIdx: 5,
      partOfSpeech: "Preposition",
      options: ["Adverb", "Conjunction", "Preposition", "Noun"],
      explanation: "'On' shows the relationship between the book and the shelf — it is a preposition."
    }
  ],
  2: [
    {
      id: "p7",
      sentence: "She was completely exhausted after the marathon.",
      highlighted: "completely",
      highlightIdx: 2,
      partOfSpeech: "Adverb",
      options: ["Adjective", "Adverb", "Noun", "Verb"],
      explanation: "'Completely' modifies the adjective 'exhausted' — it is an adverb."
    },
    {
      id: "p8",
      sentence: "Neither the manager nor the staff were informed.",
      highlighted: "Neither",
      highlightIdx: 0,
      partOfSpeech: "Conjunction",
      options: ["Pronoun", "Preposition", "Conjunction", "Adverb"],
      explanation: "'Neither...nor' connects two subjects — it is a correlative conjunction."
    },
    {
      id: "p9",
      sentence: "Running every day improved his stamina significantly.",
      highlighted: "Running",
      highlightIdx: 0,
      partOfSpeech: "Noun",
      options: ["Verb", "Noun", "Adjective", "Adverb"],
      explanation: "'Running' is a gerund (verb acting as noun) — the subject of the sentence."
    },
    {
      id: "p10",
      sentence: "The policy was implemented despite strong opposition.",
      highlighted: "despite",
      highlightIdx: 5,
      partOfSpeech: "Preposition",
      options: ["Conjunction", "Preposition", "Adverb", "Adjective"],
      explanation: "'Despite' introduces a phrase showing contrast — it is a preposition."
    },
    {
      id: "p11",
      sentence: "Ouch! That injection was more painful than expected.",
      highlighted: "Ouch",
      highlightIdx: 0,
      partOfSpeech: "Interjection",
      options: ["Noun", "Adverb", "Interjection", "Verb"],
      explanation: "'Ouch' expresses sudden pain with no grammatical role — it is an interjection."
    },
    {
      id: "p12",
      sentence: "The committee and the board reached an agreement.",
      highlighted: "and",
      highlightIdx: 2,
      partOfSpeech: "Conjunction",
      options: ["Preposition", "Adverb", "Pronoun", "Conjunction"],
      explanation: "'And' joins 'committee' and 'board' — it is a coordinating conjunction."
    }
  ],
  3: [
    {
      id: "p13",
      sentence: "To err is human, but to forgive is divine.",
      highlighted: "To err",
      highlightIdx: 0,
      partOfSpeech: "Noun",
      options: ["Noun", "Verb", "Adjective", "Adverb"],
      explanation: "'To err' is an infinitive functioning as the subject — it acts as a noun."
    },
    {
      id: "p14",
      sentence: "The exhausted climbers reached the summit at dawn.",
      highlighted: "exhausted",
      highlightIdx: 1,
      partOfSpeech: "Adjective",
      options: ["Verb", "Adjective", "Adverb", "Noun"],
      explanation: "'Exhausted' is a past participle used as an adjective modifying 'climbers'."
    },
    {
      id: "p15",
      sentence: "She spoke so eloquently that the room fell silent.",
      highlighted: "eloquently",
      highlightIdx: 2,
      partOfSpeech: "Adverb",
      options: ["Adjective", "Adverb", "Noun", "Verb"],
      explanation: "'Eloquently' modifies the verb 'spoke' — it is an adverb."
    },
    {
      id: "p16",
      sentence: "Having completed his studies, he returned home.",
      highlighted: "Having completed",
      highlightIdx: 0,
      partOfSpeech: "Verb",
      options: ["Noun", "Verb", "Adjective", "Conjunction"],
      explanation: "'Having completed' is a perfect participle phrase functioning as a verb."
    },
    {
      id: "p17",
      sentence: "It is imperative that every student submit their work.",
      highlighted: "submit",
      highlightIdx: 7,
      partOfSpeech: "Verb",
      options: ["Noun", "Adjective", "Verb", "Adverb"],
      explanation: "'Submit' is in the subjunctive mood after 'imperative that' — it is a verb form."
    },
    {
      id: "p18",
      sentence: "The phenomenon, though rare, was meticulously documented.",
      highlighted: "though",
      highlightIdx: 2,
      partOfSpeech: "Conjunction",
      options: ["Preposition", "Adverb", "Conjunction", "Pronoun"],
      explanation: "'Though' introduces a concessive clause — it is a subordinating conjunction."
    }
  ]
};
const SCRAMBLED = {
  1: [
    {
      id: "s1",
      tiles: ["The", "cat", "sat", "on", "the", "mat"],
      validOrders: [[0, 1, 2, 3, 4, 5]],
      hint: "Subject + verb + location"
    },
    {
      id: "s2",
      tiles: ["She", "quickly", "ran", "to", "school"],
      validOrders: [
        [0, 2, 1, 3, 4],
        [0, 1, 2, 3, 4]
      ],
      hint: "Adverb can go before or after verb"
    },
    {
      id: "s3",
      tiles: ["Birds", "sing", "in", "the", "morning"],
      validOrders: [[0, 1, 2, 3, 4]],
      hint: "Subject + verb + time phrase"
    },
    {
      id: "s4",
      tiles: ["He", "ate", "three", "large", "apples"],
      validOrders: [[0, 1, 2, 3, 4]],
      hint: "Number adjective before opinion adjective"
    },
    {
      id: "s5",
      tiles: ["We", "went", "to", "the", "big", "park"],
      validOrders: [[0, 1, 2, 3, 4, 5]],
      hint: "Subject + verb + destination"
    }
  ],
  2: [
    {
      id: "s6",
      tiles: ["Never", "had", "she", "seen", "such", "beauty"],
      validOrders: [[0, 1, 2, 3, 4, 5]],
      hint: "Negative inversion: Never + auxiliary + subject"
    },
    {
      id: "s7",
      tiles: ["The", "report", "which", "she", "wrote", "was", "excellent"],
      validOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hint: "Relative clause modifies the subject"
    },
    {
      id: "s8",
      tiles: [
        "Not",
        "only",
        "did",
        "he",
        "win",
        "but",
        "also",
        "broke",
        "the",
        "record"
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      hint: "Correlative conjunction structure"
    },
    {
      id: "s9",
      tiles: ["Had", "I", "known", "I", "would", "have", "come"],
      validOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hint: "Third conditional with inversion"
    },
    {
      id: "s10",
      tiles: [
        "The",
        "data",
        "collected",
        "over",
        "five",
        "years",
        "proved",
        "the",
        "theory"
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
      hint: "Reduced relative clause modifies 'data'"
    }
  ],
  3: [
    {
      id: "s11",
      tiles: ["Rarely", "does", "such", "courage", "manifest", "so", "clearly"],
      validOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hint: "Adverbial inversion"
    },
    {
      id: "s12",
      tiles: [
        "No",
        "sooner",
        "had",
        "he",
        "arrived",
        "than",
        "the",
        "meeting",
        "began"
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
      hint: "No sooner...than inversion"
    },
    {
      id: "s13",
      tiles: [
        "Only",
        "by",
        "working",
        "together",
        "can",
        "we",
        "solve",
        "this"
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hint: "Only + prepositional phrase triggers inversion"
    },
    {
      id: "s14",
      tiles: [
        "So",
        "complex",
        "was",
        "the",
        "problem",
        "that",
        "experts",
        "disagreed"
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hint: "Fronted complement with inversion"
    },
    {
      id: "s15",
      tiles: [
        "The",
        "hypothesis",
        "having",
        "been",
        "tested",
        "the",
        "team",
        "published"
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hint: "Absolute phrase with passive participle"
    }
  ]
};
function GrammarPolice({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [queue, setQueue] = reactExports.useState([]);
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [selectedWord, setSelectedWord] = reactExports.useState(null);
  const [showOptions, setShowOptions] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [arrests, setArrests] = reactExports.useState(0);
  const [falseArrests, setFalseArrests] = reactExports.useState(0);
  const [showRule, setShowRule] = reactExports.useState(null);
  const scoreRef = reactExports.useRef(score);
  const livesRef = reactExports.useRef(lives);
  const arrestsRef = reactExports.useRef(arrests);
  scoreRef.current = score;
  livesRef.current = lives;
  arrestsRef.current = arrests;
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const total = arrestsRef.current + falseArrests;
      const accuracy = total > 0 ? arrestsRef.current / total * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed)
      );
    },
    [config, falseArrests, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(true));
  function handleStart() {
    const sentences = [...SENTENCES[config.difficulty]].sort(
      () => Math.random() - 0.5
    );
    setQueue(sentences);
    setCurrentIdx(0);
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
  }
  const current = queue[currentIdx];
  function handleWordClick(wordIdx) {
    if (feedback) return;
    setSelectedWord(wordIdx);
    setShowOptions(true);
  }
  function handleOptionSelect(option) {
    if (!current) return;
    setShowOptions(false);
    const isErrorWord = selectedWord === current.errorIndex;
    const isCorrectFix = option === current.correction;
    if (isErrorWord && isCorrectFix) {
      const pts = 200 * config.difficulty;
      setScore((s) => s + pts);
      setArrests((a) => a + 1);
      setFeedback("correct");
      setShowRule(current.rule);
      setTimeout(() => {
        setFeedback(null);
        setShowRule(null);
        setSelectedWord(null);
        if (currentIdx + 1 >= queue.length) endGame(true);
        else setCurrentIdx((i) => i + 1);
      }, 2200);
    } else {
      setFalseArrests((f) => f + 1);
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) setTimeout(() => endGame(false), 1200);
        return newL;
      });
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        setSelectedWord(null);
      }, 1200);
    }
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col", "data-ocid": "grammar_city.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-3 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Heart,
        {
          className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
        },
        `h-${i}`
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full transition-all duration-1000 xp-fill",
            style: { width: `${progressPct}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
          timeLeft,
          "s"
        ] })
      ] })
    ] }),
    !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-3xl font-black glow-cyan-text mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "Grammar Police"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Find the grammatical error, click the wrong word, and select the correct fix." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f43f5e] text-xs mb-6", children: "Clicking a correct word counts as a false arrest — penalty applies!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "lg",
              onClick: handleStart,
              "data-ocid": "grammar_city.start_button",
              children: "Begin Patrol"
            }
          )
        ]
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Case ",
          currentIdx + 1,
          " / ",
          queue.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981]", children: [
          "Arrests: ",
          arrests
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f43f5e]", children: [
          "False: ",
          falseArrests
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: current && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -60 },
          className: "glass-card rounded-2xl p-8 neon-top-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground mb-4",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "Identify the Error"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: current.words.map((word, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleWordClick(idx),
                className: `px-3 py-2 rounded-lg text-lg font-semibold border transition-all duration-200 ${selectedWord === idx ? feedback === "correct" ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : feedback === "wrong" ? "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]" : "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 text-foreground"}`,
                "data-ocid": `grammar_city.word.${idx + 1}`,
                children: word
              },
              `${current.id}-word-${idx}`
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showOptions && selectedWord !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0 },
                className: "mt-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
                    "Select the correct replacement for",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-bold", children: [
                      "“",
                      current.words[selectedWord],
                      "”"
                    ] }),
                    ":"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: current.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleOptionSelect(opt),
                      className: "px-4 py-2 rounded-lg border border-[#7c3aed]/60 bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20 font-semibold transition-smooth",
                      "data-ocid": `grammar_city.option.${opt}`,
                      children: opt
                    },
                    opt
                  )) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
              feedback === "correct" && showRule && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  className: "mt-4 p-3 rounded-lg border border-[#10b981]/50 bg-[#10b981]/10 flex items-start gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#10b981] text-sm", children: showRule })
                  ]
                }
              ),
              feedback === "wrong" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  className: "mt-4 p-3 rounded-lg border border-[#f43f5e]/50 bg-[#f43f5e]/10 flex items-start gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f43f5e] text-sm", children: "False arrest! That word may be correct. Re-examine the sentence." })
                  ]
                }
              )
            ] })
          ]
        },
        current.id
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-[#f59e0b] shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Click the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b]", children: "incorrect word" }),
          ", then select its correction."
        ] })
      ] })
    ] })
  ] });
}
function PartsOfSpeech({ config, onGameEnd }) {
  const items = POS_ITEMS[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = items.length > 0 ? correctRef.current / items.length * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          done
        )
      );
    },
    [config, items.length, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const item = items[idx];
  function handleAnswer(opt) {
    if (feedback || !item) return;
    const ok = opt === item.partOfSpeech;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setFeedback({
      ok,
      msg: ok ? `Correct! ${item.explanation}` : `Wrong. It is a ${item.partOfSpeech}. ${item.explanation}`
    });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= items.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2200);
  }
  const wordsInSentence = (item == null ? void 0 : item.sentence.split(" ")) ?? [];
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "grammar_city.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Parts of Speech"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "A sentence is shown with one word highlighted in amber." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Classify the highlighted word as the correct part of speech from 4 options." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "grammar_city.start_button",
                  children: "Begin Classification"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "grammar_city.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#7c3aed]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#7c3aed] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
            idx + 1,
            "/",
            items.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 neon-top-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Classify the highlighted word" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: wordsInSentence.map((word, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-3 py-1.5 rounded-lg text-lg font-semibold ${word === item.highlighted || word.replace(/[.,!?]/, "") === item.highlighted.replace(/[.,!?]/, "") ? "bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f59e0b]" : "text-foreground"}`,
                    children: word
                  },
                  i
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: item.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: !!feedback,
                  onClick: () => handleAnswer(opt),
                  className: `px-4 py-3 rounded-xl border text-sm font-bold transition-all ${feedback ? opt === item.partOfSpeech ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`,
                  "data-ocid": `grammar_city.pos_option.${i + 1}`,
                  children: opt
                },
                opt
              )) }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: `p-4 rounded-xl border flex items-start gap-3 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`,
                  children: [
                    feedback.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e] shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                        children: feedback.msg
                      }
                    )
                  ]
                }
              )
            ]
          },
          idx
        ) })
      ]
    }
  );
}
function SentenceBuilderGame({ config, onGameEnd }) {
  const pool = SCRAMBLED[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [arranged, setArranged] = reactExports.useState([]);
  const [remaining, setRemaining] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = pool.length > 0 ? correctRef.current / pool.length * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          done
        )
      );
    },
    [config, pool.length, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const item = pool[idx];
  function initItem(i) {
    const it = pool[i];
    setArranged([]);
    setRemaining([...it.tiles].sort(() => Math.random() - 0.5));
    setFeedback(null);
  }
  function startGame() {
    initItem(0);
    setStarted(true);
    startTime.current = Date.now();
  }
  function pickTile(tile, tileIdx) {
    if (feedback) return;
    const newRem = [...remaining];
    newRem.splice(tileIdx, 1);
    setRemaining(newRem);
    setArranged((a) => [...a, tile]);
  }
  function removeTile(tile, arrIdx) {
    if (feedback) return;
    const newArr = [...arranged];
    newArr.splice(arrIdx, 1);
    setArranged(newArr);
    setRemaining((r) => [...r, tile]);
  }
  function checkOrder() {
    if (feedback || !item) return;
    const arrangedStr = arranged.join(",");
    const valid = item.validOrders.some(
      (ord) => ord.map((i) => item.tiles[i]).join(",") === arrangedStr
    );
    if (valid) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 250 * config.difficulty);
    }
    setFeedback({
      ok: valid,
      msg: valid ? "Correct! The sentence is grammatically sound." : `Not quite. Hint: ${item.hint}`
    });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= pool.length) endGame(true);
      else {
        setIdx((i) => i + 1);
        initItem(idx + 1);
      }
    }, 2500);
  }
  function resetTiles() {
    if (feedback) return;
    setArranged([]);
    setRemaining([...item.tiles].sort(() => Math.random() - 0.5));
  }
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "grammar_city.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-14 w-14 mx-auto mb-4 text-[#10b981]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Sentence Builder"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Word tiles are shown scrambled. Click tiles to arrange them into a grammatically correct sentence." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Multiple valid orders are accepted. Click a placed tile to return it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: startGame,
                  "data-ocid": "grammar_city.start_button",
                  children: "Start Building"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "grammar_city.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#10b981] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
            idx + 1,
            "/",
            pool.length,
            " — ",
            timeLeft,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-5 neon-top-border min-h-20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Your sentence:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 min-h-10", children: [
                  arranged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm italic", children: "Click tiles below to build the sentence..." }),
                  arranged.map((tile, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeTile(tile, i),
                      className: "px-3 py-2 rounded-lg border border-[#00f5ff]/60 bg-[#00f5ff]/10 text-[#00f5ff] font-semibold text-sm hover:bg-[#f43f5e]/20 hover:border-[#f43f5e]/60 transition-all",
                      "data-ocid": `grammar_city.arranged.${i + 1}`,
                      children: tile
                    },
                    `arr-${i}`
                  ))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Available tiles:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: remaining.map((tile, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => pickTile(tile, i),
                    className: "px-3 py-2 rounded-lg border border-border/50 bg-card text-foreground font-semibold text-sm hover:border-[#7c3aed]/60 hover:bg-[#7c3aed]/10 transition-all",
                    "data-ocid": `grammar_city.tile.${i + 1}`,
                    children: tile
                  },
                  `rem-${i}`
                )) })
              ] }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: `p-4 rounded-xl border flex items-start gap-3 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f59e0b]/40 bg-[#f59e0b]/10"}`,
                  children: [
                    feedback.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f59e0b] shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f59e0b]"}`,
                        children: feedback.msg
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "secondary",
                    size: "sm",
                    onClick: resetTiles,
                    "data-ocid": "grammar_city.reset_button",
                    children: "Reset"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    onClick: checkOrder,
                    disabled: arranged.length !== item.tiles.length,
                    "data-ocid": "grammar_city.check_button",
                    children: "Check Sentence"
                  }
                )
              ] })
            ]
          },
          idx
        ) })
      ]
    }
  );
}
function GrammarCity({ config, onGameEnd }) {
  if (config.gameId === "parts-of-speech")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PartsOfSpeech, { config, onGameEnd });
  if (config.gameId === "sentence-builder")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SentenceBuilderGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarPolice, { config, onGameEnd });
}
export {
  GrammarCity as default
};
