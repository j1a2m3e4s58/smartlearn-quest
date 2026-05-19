import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence, Z as Zap, l as Star } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { M as Map } from "./map-CgAdZPgE.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
const VOCAB_DATA = {
  1: [
    {
      word: "Brave",
      definition: "Showing courage in dangerous situations",
      synonyms: ["courageous", "bold"],
      antonyms: ["cowardly", "timid"],
      fillSentence: "The ___ soldier crossed the battlefield without fear.",
      fillAnswer: "brave",
      fillOptions: ["brave", "lazy", "tired", "quiet"]
    },
    {
      word: "Ancient",
      definition: "Belonging to the very distant past",
      synonyms: ["old", "archaic"],
      antonyms: ["modern", "new"],
      fillSentence: "Archaeologists discovered ___ pottery buried underground.",
      fillAnswer: "ancient",
      fillOptions: ["ancient", "plastic", "broken", "cheap"]
    },
    {
      word: "Fragile",
      definition: "Easily broken or damaged",
      synonyms: ["delicate", "brittle"],
      antonyms: ["sturdy", "tough"],
      fillSentence: "Handle the ___ vase with care or it will shatter.",
      fillAnswer: "fragile",
      fillOptions: ["fragile", "heavy", "dirty", "shiny"]
    },
    {
      word: "Eager",
      definition: "Strongly wanting to do something",
      synonyms: ["keen", "enthusiastic"],
      antonyms: ["reluctant", "indifferent"],
      fillSentence: "She was ___ to start her first day at the new school.",
      fillAnswer: "eager",
      fillOptions: ["eager", "afraid", "angry", "quiet"]
    },
    {
      word: "Gloomy",
      definition: "Dark or poorly lit; causing sadness",
      synonyms: ["dark", "dreary"],
      antonyms: ["bright", "cheerful"],
      fillSentence: "The storm made the sky ___ and the children stayed inside.",
      fillAnswer: "gloomy",
      fillOptions: ["gloomy", "sunny", "orange", "clear"]
    },
    {
      word: "Peculiar",
      definition: "Strange or unusual in character",
      synonyms: ["strange", "odd"],
      antonyms: ["normal", "ordinary"],
      fillSentence: "The scientist made a ___ discovery that confused the experts.",
      fillAnswer: "peculiar",
      fillOptions: ["peculiar", "common", "boring", "simple"]
    },
    {
      word: "Vivid",
      definition: "Producing powerful or clear mental images",
      synonyms: ["bright", "striking"],
      antonyms: ["dull", "faint"],
      fillSentence: "She had a ___ dream about flying over the ocean.",
      fillAnswer: "vivid",
      fillOptions: ["vivid", "short", "dark", "heavy"]
    },
    {
      word: "Stubborn",
      definition: "Refusing to change your opinion or action",
      synonyms: ["obstinate", "headstrong"],
      antonyms: ["flexible", "agreeable"],
      fillSentence: "The ___ mule refused to move no matter how hard they pushed.",
      fillAnswer: "stubborn",
      fillOptions: ["stubborn", "happy", "helpful", "clever"]
    },
    {
      word: "Serene",
      definition: "Calm, peaceful, and untroubled",
      synonyms: ["tranquil", "peaceful"],
      antonyms: ["chaotic", "turbulent"],
      fillSentence: "The lake was completely ___ in the early morning light.",
      fillAnswer: "serene",
      fillOptions: ["serene", "loud", "muddy", "frozen"]
    },
    {
      word: "Triumph",
      definition: "A great victory or achievement",
      synonyms: ["victory", "success"],
      antonyms: ["defeat", "failure"],
      fillSentence: "Winning the championship felt like a complete ___ for the team.",
      fillAnswer: "triumph",
      fillOptions: ["triumph", "defeat", "mistake", "exercise"]
    }
  ],
  2: [
    {
      word: "Ambiguous",
      definition: "Open to more than one interpretation",
      synonyms: ["vague", "unclear"],
      antonyms: ["clear", "definite"],
      fillSentence: "The contract's ___ wording led to a dispute.",
      fillAnswer: "ambiguous",
      fillOptions: ["ambiguous", "detailed", "shortened", "reviewed"]
    },
    {
      word: "Benevolent",
      definition: "Well meaning and kindly towards others",
      synonyms: ["charitable", "generous"],
      antonyms: ["cruel", "malevolent"],
      fillSentence: "The ___ donor gave millions to rebuild the flooded village.",
      fillAnswer: "benevolent",
      fillOptions: ["benevolent", "hostile", "reluctant", "confused"]
    },
    {
      word: "Contemplative",
      definition: "Involving deep, quiet thought",
      synonyms: ["reflective", "meditative"],
      antonyms: ["impulsive", "hasty"],
      fillSentence: "He sat in a ___ silence, weighing every possible outcome.",
      fillAnswer: "contemplative",
      fillOptions: ["contemplative", "agitated", "restless", "confused"]
    },
    {
      word: "Diligent",
      definition: "Careful and persistent work or effort",
      synonyms: ["industrious", "assiduous"],
      antonyms: ["lazy", "negligent"],
      fillSentence: "Only a ___ student can master calculus in a single semester.",
      fillAnswer: "diligent",
      fillOptions: ["diligent", "careless", "distracted", "bored"]
    },
    {
      word: "Eloquent",
      definition: "Fluent and persuasive in speaking or writing",
      synonyms: ["articulate", "fluent"],
      antonyms: ["inarticulate", "tongue-tied"],
      fillSentence: "Her ___ speech moved the entire audience to tears.",
      fillAnswer: "eloquent",
      fillOptions: ["eloquent", "mumbled", "rushed", "copied"]
    },
    {
      word: "Formidable",
      definition: "Inspiring fear or respect through impressive size",
      synonyms: ["impressive", "daunting"],
      antonyms: ["weak", "feeble"],
      fillSentence: "The climbers faced a ___ challenge in scaling the icy peak.",
      fillAnswer: "formidable",
      fillOptions: ["formidable", "manageable", "pleasant", "ordinary"]
    },
    {
      word: "Gregarious",
      definition: "Fond of company; sociable",
      synonyms: ["sociable", "outgoing"],
      antonyms: ["introverted", "reclusive"],
      fillSentence: "A ___ personality makes one an excellent sales representative.",
      fillAnswer: "gregarious",
      fillOptions: ["gregarious", "isolated", "methodical", "anxious"]
    },
    {
      word: "Inquisitive",
      definition: "Eager to learn or know things",
      synonyms: ["curious", "enquiring"],
      antonyms: ["indifferent", "apathetic"],
      fillSentence: "The ___ child dismantled every toy to see how it worked.",
      fillAnswer: "inquisitive",
      fillOptions: ["inquisitive", "destructive", "resistant", "forgetful"]
    },
    {
      word: "Meticulous",
      definition: "Showing great attention to detail",
      synonyms: ["precise", "thorough"],
      antonyms: ["careless", "sloppy"],
      fillSentence: "The surgeon was ___ in every procedure.",
      fillAnswer: "meticulous",
      fillOptions: ["meticulous", "impatient", "distracted", "casual"]
    },
    {
      word: "Tenacious",
      definition: "Tending to keep a firm hold; persistent",
      synonyms: ["persistent", "resolute"],
      antonyms: ["irresolute", "vacillating"],
      fillSentence: "Her ___ pursuit of justice never wavered over fifteen years.",
      fillAnswer: "tenacious",
      fillOptions: ["tenacious", "occasional", "reluctant", "passive"]
    }
  ],
  3: [
    {
      word: "Laconic",
      definition: "Using very few words; brief and pithy",
      synonyms: ["terse", "succinct"],
      antonyms: ["verbose", "loquacious"],
      fillSentence: "His ___ reply — a single word — ended the debate entirely.",
      fillAnswer: "laconic",
      fillOptions: ["laconic", "elaborate", "redundant", "rambling"]
    },
    {
      word: "Obfuscate",
      definition: "To make something confusing or unclear deliberately",
      synonyms: ["obscure", "muddle"],
      antonyms: ["clarify", "elucidate"],
      fillSentence: "Politicians often ___ policy details to avoid accountability.",
      fillAnswer: "obfuscate",
      fillOptions: ["obfuscate", "simplify", "disclose", "announce"]
    },
    {
      word: "Ephemeral",
      definition: "Lasting only for a very short time",
      synonyms: ["transient", "fleeting"],
      antonyms: ["permanent", "enduring"],
      fillSentence: "Fame is ___ — the crowd forgets within a generation.",
      fillAnswer: "ephemeral",
      fillOptions: ["ephemeral", "eternal", "universal", "substantial"]
    },
    {
      word: "Equivocate",
      definition: "Use ambiguous language to conceal truth",
      synonyms: ["hedge", "prevaricate"],
      antonyms: ["assert", "clarify"],
      fillSentence: "The suspect continued to ___ when the detective pressed for details.",
      fillAnswer: "equivocate",
      fillOptions: ["equivocate", "confess", "confirm", "contradict"]
    },
    {
      word: "Pellucid",
      definition: "Translucently clear; easily understood",
      synonyms: ["transparent", "lucid"],
      antonyms: ["opaque", "murky"],
      fillSentence: "The water in the hidden spring was ___ and ice-cold.",
      fillAnswer: "pellucid",
      fillOptions: ["pellucid", "cloudy", "mineral", "stagnant"]
    },
    {
      word: "Perfidious",
      definition: "Deceitful and untrustworthy; treacherous",
      synonyms: ["treacherous", "disloyal"],
      antonyms: ["loyal", "trustworthy"],
      fillSentence: "The ___ general surrendered the fortress to the enemy at dawn.",
      fillAnswer: "perfidious",
      fillOptions: ["perfidious", "valiant", "celebrated", "cautious"]
    },
    {
      word: "Verisimilitude",
      definition: "The appearance of being true or real",
      synonyms: ["authenticity", "plausibility"],
      antonyms: ["implausibility", "fiction"],
      fillSentence: "The novel's ___ convinced readers it was a genuine memoir.",
      fillAnswer: "verisimilitude",
      fillOptions: ["verisimilitude", "exaggeration", "ambiguity", "symbolism"]
    },
    {
      word: "Recondite",
      definition: "Not known by many; obscure or abstruse",
      synonyms: ["arcane", "esoteric"],
      antonyms: ["familiar", "mainstream"],
      fillSentence: "The professor's lectures covered ___ topics few had studied.",
      fillAnswer: "recondite",
      fillOptions: ["recondite", "popular", "basic", "practical"]
    },
    {
      word: "Sycophantic",
      definition: "Behaving obsequiously to gain advantage",
      synonyms: ["fawning", "flattering"],
      antonyms: ["honest", "forthright"],
      fillSentence: "The ___ aide agreed with everything the director said.",
      fillAnswer: "sycophantic",
      fillOptions: ["sycophantic", "principled", "outspoken", "negligent"]
    },
    {
      word: "Solipsistic",
      definition: "Holding the view that the self is all that exists",
      synonyms: ["self-absorbed", "narcissistic"],
      antonyms: ["empathetic", "altruistic"],
      fillSentence: "His ___ worldview prevented him from understanding others.",
      fillAnswer: "solipsistic",
      fillOptions: ["solipsistic", "empathetic", "rational", "pragmatic"]
    }
  ]
};
const CELL_TYPES = [
  "definition",
  "synonym",
  "fill",
  "definition",
  "synonym",
  "fill",
  "definition",
  "synonym",
  "fill",
  "definition",
  "synonym",
  "fill",
  "definition",
  "synonym",
  "fill",
  "definition",
  "synonym",
  "fill",
  "definition",
  "fill"
];
const SYN_ANT_DATA = {
  1: [
    {
      word: "Happy",
      pairs: [
        { word: "Joyful", relation: "Synonym" },
        { word: "Sad", relation: "Antonym" },
        { word: "Running", relation: "Neither" },
        { word: "Cheerful", relation: "Synonym" }
      ]
    },
    {
      word: "Fast",
      pairs: [
        { word: "Quick", relation: "Synonym" },
        { word: "Slow", relation: "Antonym" },
        { word: "Hungry", relation: "Neither" },
        { word: "Rapid", relation: "Synonym" }
      ]
    },
    {
      word: "Hot",
      pairs: [
        { word: "Warm", relation: "Synonym" },
        { word: "Cold", relation: "Antonym" },
        { word: "Tall", relation: "Neither" },
        { word: "Freezing", relation: "Antonym" }
      ]
    },
    {
      word: "Brave",
      pairs: [
        { word: "Fearless", relation: "Synonym" },
        { word: "Cowardly", relation: "Antonym" },
        { word: "Green", relation: "Neither" },
        { word: "Bold", relation: "Synonym" }
      ]
    },
    {
      word: "Dark",
      pairs: [
        { word: "Dim", relation: "Synonym" },
        { word: "Bright", relation: "Antonym" },
        { word: "Wooden", relation: "Neither" },
        { word: "Shadowy", relation: "Synonym" }
      ]
    }
  ],
  2: [
    {
      word: "Benevolent",
      pairs: [
        { word: "Charitable", relation: "Synonym" },
        { word: "Malevolent", relation: "Antonym" },
        { word: "Efficient", relation: "Neither" },
        { word: "Generous", relation: "Synonym" }
      ]
    },
    {
      word: "Verbose",
      pairs: [
        { word: "Laconic", relation: "Antonym" },
        { word: "Wordy", relation: "Synonym" },
        { word: "Metallic", relation: "Neither" },
        { word: "Terse", relation: "Antonym" }
      ]
    },
    {
      word: "Diligent",
      pairs: [
        { word: "Industrious", relation: "Synonym" },
        { word: "Negligent", relation: "Antonym" },
        { word: "Circular", relation: "Neither" },
        { word: "Lazy", relation: "Antonym" }
      ]
    },
    {
      word: "Ephemeral",
      pairs: [
        { word: "Transient", relation: "Synonym" },
        { word: "Permanent", relation: "Antonym" },
        { word: "Logical", relation: "Neither" },
        { word: "Fleeting", relation: "Synonym" }
      ]
    },
    {
      word: "Eloquent",
      pairs: [
        { word: "Articulate", relation: "Synonym" },
        { word: "Inarticulate", relation: "Antonym" },
        { word: "Frugal", relation: "Neither" },
        { word: "Fluent", relation: "Synonym" }
      ]
    }
  ],
  3: [
    {
      word: "Obfuscate",
      pairs: [
        { word: "Elucidate", relation: "Antonym" },
        { word: "Obscure", relation: "Synonym" },
        { word: "Enumerate", relation: "Neither" },
        { word: "Clarify", relation: "Antonym" }
      ]
    },
    {
      word: "Perfidious",
      pairs: [
        { word: "Loyal", relation: "Antonym" },
        { word: "Treacherous", relation: "Synonym" },
        { word: "Geometric", relation: "Neither" },
        { word: "Trustworthy", relation: "Antonym" }
      ]
    },
    {
      word: "Perspicacious",
      pairs: [
        { word: "Obtuse", relation: "Antonym" },
        { word: "Astute", relation: "Synonym" },
        { word: "Volatile", relation: "Neither" },
        { word: "Perceptive", relation: "Synonym" }
      ]
    },
    {
      word: "Sycophantic",
      pairs: [
        { word: "Forthright", relation: "Antonym" },
        { word: "Fawning", relation: "Synonym" },
        { word: "Empirical", relation: "Neither" },
        { word: "Obsequious", relation: "Synonym" }
      ]
    },
    {
      word: "Laconic",
      pairs: [
        { word: "Verbose", relation: "Antonym" },
        { word: "Succinct", relation: "Synonym" },
        { word: "Tactile", relation: "Neither" },
        { word: "Loquacious", relation: "Antonym" }
      ]
    }
  ]
};
const CONTEXT_CLUES = {
  1: [
    {
      paragraph: "The exhausted hikers finally reached the summit after hours of climbing. They were completely fatigued and collapsed on the ground.",
      targetWord: "fatigued",
      options: ["excited", "very tired", "very hungry", "angry"],
      answer: "very tired",
      explanation: "'exhausted' and 'collapsed' are context clues indicating extreme tiredness."
    },
    {
      paragraph: "The merchant was frugal with his money. He never wasted a single coin and always found the cheapest option.",
      targetWord: "frugal",
      options: ["generous", "dishonest", "careful with money", "careless"],
      answer: "careful with money",
      explanation: "'Never wasted' and 'cheapest option' signal frugality means being careful with money."
    },
    {
      paragraph: "The sky was overcast and gloomy. Dark clouds blocked the sun, making the day feel somber and sad.",
      targetWord: "somber",
      options: ["bright", "dark and sad", "windy", "cheerful"],
      answer: "dark and sad",
      explanation: "'Overcast', 'dark clouds', and 'gloomy' all reinforce somber meaning dark and sad."
    },
    {
      paragraph: "The new bridge was deemed unsafe by inspectors due to several structural deficiencies that had been overlooked during construction.",
      targetWord: "deficiencies",
      options: [
        "improvements",
        "strengths",
        "flaws or shortcomings",
        "features"
      ],
      answer: "flaws or shortcomings",
      explanation: "'Unsafe' and 'overlooked' signal that deficiencies are problems or flaws."
    },
    {
      paragraph: "The scientist meticulously recorded every detail of the experiment, noting even the most minute observations.",
      targetWord: "minute",
      options: ["60 seconds", "very small", "very important", "colorful"],
      answer: "very small",
      explanation: "'Meticulously' and context of recording small observations means minute here means very small."
    }
  ],
  2: [
    {
      paragraph: "The politician's speech was filled with platitudes — empty phrases like 'we must work together' and 'our future is bright' that said nothing specific.",
      targetWord: "platitudes",
      options: [
        "detailed policies",
        "overused meaningless phrases",
        "technical statistics",
        "personal stories"
      ],
      answer: "overused meaningless phrases",
      explanation: "The examples given are generic and unspecific, clarifying that platitudes are empty phrases."
    },
    {
      paragraph: "The archaeologist unearthed an unprecedented artifact — nothing like it had ever been found in any previous dig in the region.",
      targetWord: "unprecedented",
      options: [
        "very old",
        "never seen before",
        "well-preserved",
        "heavily studied"
      ],
      answer: "never seen before",
      explanation: "'Nothing like it had ever been found' directly explains unprecedented."
    },
    {
      paragraph: "Her acerbic wit made colleagues wince — every joke had a sharp edge that stung even while making people laugh.",
      targetWord: "acerbic",
      options: [
        "gentle and warm",
        "sharp and cutting",
        "absurd and silly",
        "calm and steady"
      ],
      answer: "sharp and cutting",
      explanation: "'Wince', 'sharp edge', and 'stung' all point to acerbic meaning cutting or biting."
    },
    {
      paragraph: "The CEO remained sanguine about the company's prospects despite the economic downturn, predicting recovery by year's end.",
      targetWord: "sanguine",
      options: ["worried", "confused", "optimistic", "angry"],
      answer: "optimistic",
      explanation: "'Despite' and 'predicting recovery' show the CEO had a positive outlook — sanguine."
    },
    {
      paragraph: "The student's verbose essay was returned with a note asking for a more concise version — the professor wanted fewer words, more meaning.",
      targetWord: "verbose",
      options: [
        "well-argued",
        "poorly structured",
        "using too many words",
        "factually incorrect"
      ],
      answer: "using too many words",
      explanation: "'Fewer words, more meaning' and 'concise' contrast directly with verbose."
    }
  ],
  3: [
    {
      paragraph: "The treaty was abrogated by the new administration, who declared it null and void, refusing to honour its terms.",
      targetWord: "abrogated",
      options: [
        "renewed",
        "formally cancelled",
        "secretly modified",
        "publicly celebrated"
      ],
      answer: "formally cancelled",
      explanation: "'Null and void' and 'refusing to honour' confirm that abrogated means cancelled."
    },
    {
      paragraph: "His argument was largely tautological — essentially saying 'this is true because it is true' without providing actual evidence.",
      targetWord: "tautological",
      options: [
        "mathematically precise",
        "needlessly repetitive in meaning",
        "historically grounded",
        "logically complex"
      ],
      answer: "needlessly repetitive in meaning",
      explanation: "The example 'true because it is true' illustrates circular, repetitive reasoning."
    },
    {
      paragraph: "The government's obsequious response to every demand from the foreign power alarmed observers, who called it a servile capitulation.",
      targetWord: "obsequious",
      options: [
        "aggressive and defiant",
        "excessively submissive",
        "diplomatically neutral",
        "strategically calculated"
      ],
      answer: "excessively submissive",
      explanation: "'Servile capitulation' and yielding to every demand confirm obsequious means overly submissive."
    },
    {
      paragraph: "Critics called the memoir a hagiography rather than an honest biography — it presented the subject as saintly, ignoring all flaws.",
      targetWord: "hagiography",
      options: [
        "harsh criticism",
        "idealized biography",
        "historical timeline",
        "academic analysis"
      ],
      answer: "idealized biography",
      explanation: "'Saintly' and 'ignoring all flaws' indicate an uncritical, idealised account."
    },
    {
      paragraph: "The scientist's theory was falsifiable — it made specific predictions that could, in principle, be proven wrong through experiment.",
      targetWord: "falsifiable",
      options: [
        "already proven false",
        "impossible to test",
        "able to be tested and potentially disproven",
        "widely accepted"
      ],
      answer: "able to be tested and potentially disproven",
      explanation: "'Specific predictions' and 'proven wrong through experiment' define falsifiable."
    }
  ]
};
function WordHunter({ config, onGameEnd }) {
  const [started, setStarted] = reactExports.useState(false);
  const [cells] = reactExports.useState(() => {
    const data = VOCAB_DATA[config.difficulty];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      vocab: data[i % data.length],
      challengeType: CELL_TYPES[i],
      visited: false,
      treasure: Math.floor(Math.random() * 50) + 10
    }));
  });
  const [currentCell, setCurrentCell] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [score, setScore] = reactExports.useState(0);
  const [collected, setCollected] = reactExports.useState(0);
  const [challenge, setChallenge] = reactExports.useState(null);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [visitedSet, setVisitedSet] = reactExports.useState(/* @__PURE__ */ new Set([0]));
  const correct = reactExports.useRef(0);
  const attempts = reactExports.useRef(0);
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = attempts.current > 0 ? correct.current / attempts.current * 100 : 100;
      onGameEnd(
        buildResult(
          config,
          score,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          completed
        )
      );
    },
    [config, score, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  function getAdjacentCells(idx) {
    const cols = 4;
    const adj = [];
    if (idx % cols !== 0) adj.push(idx - 1);
    if (idx % cols !== cols - 1) adj.push(idx + 1);
    if (idx >= cols) adj.push(idx - cols);
    if (idx < 16) adj.push(idx + cols);
    return adj;
  }
  function handleCellClick(idx) {
    if (feedback || challenge) return;
    const adj = getAdjacentCells(currentCell);
    if (!adj.includes(idx)) return;
    const cell = cells[idx];
    setChallenge({ cell: idx, type: cell.challengeType });
  }
  function handleAnswer(isCorrect, cellIdx) {
    attempts.current++;
    if (isCorrect) {
      correct.current++;
      const pts = 150 * config.difficulty + cells[cellIdx].treasure;
      setScore((s) => s + pts);
      setCollected((c) => c + 1);
      setFeedback("correct");
      setCurrentCell(cellIdx);
      setVisitedSet((v) => /* @__PURE__ */ new Set([...v, cellIdx]));
      setTimeout(() => {
        setFeedback(null);
        setChallenge(null);
        if (cellIdx === 19) endGame(true);
      }, 1500);
    } else {
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) setTimeout(() => endGame(false), 1200);
        return n;
      });
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        setChallenge(null);
      }, 1500);
    }
  }
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "vocab_quest.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Word Hunter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Navigate the dungeon by clicking adjacent cells. Each cell hides a vocabulary challenge." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f59e0b] text-xs mb-6", children: "Correct answers let you advance. Wrong answers cost lives. Reach cell 20 to win." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "vocab_quest.start_button",
                  children: "Enter Dungeon"
                }
              )
            ]
          }
        )
      }
    );
  }
  const activeCellData = challenge ? cells[challenge.cell] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "vocab_quest.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#00f5ff] font-bold", children: [
            score.toLocaleString(),
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
            timeLeft,
            "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] text-xs", children: [
            collected,
            "/20 collected"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid grid-cols-4 gap-2 overflow-hidden", children: cells.map((_cell, idx) => {
          const isCurrent = idx === currentCell;
          const isAdj = getAdjacentCells(currentCell).includes(idx);
          const isVisited = visitedSet.has(idx);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              onClick: () => handleCellClick(idx),
              whileHover: isAdj ? { scale: 1.05 } : {},
              className: `rounded-xl border text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 p-1 ${isCurrent ? "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]" : isAdj ? "border-[#7c3aed]/60 bg-[#7c3aed]/10 text-[#7c3aed] cursor-pointer hover:bg-[#7c3aed]/20" : isVisited ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-border/20 bg-card/50 text-muted-foreground cursor-not-allowed"}`,
              "data-ocid": `vocab_quest.cell.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: idx + 1 }),
                isVisited && !isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3" }),
                isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" })
              ]
            },
            idx
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: challenge && activeCellData && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 30 },
            className: "glass-card rounded-2xl p-5 neon-top-border shrink-0",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChallengePanel,
              {
                cell: cells[challenge.cell],
                type: challenge.type,
                difficulty: config.difficulty,
                feedback,
                onAnswer: (ok) => handleAnswer(ok, challenge.cell)
              }
            )
          }
        ) })
      ]
    }
  );
}
function ChallengePanel({
  cell,
  type,
  feedback,
  onAnswer
}) {
  const v = cell.vocab;
  if (type === "definition") {
    const opts = VOCAB_DATA[1].filter((x) => x.word !== v.word).slice(0, 3).map((x) => x.definition);
    const all = [...opts, v.definition].sort(() => Math.random() - 0.5);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-widest", children: "Definition Match" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xl font-black text-[#00f5ff] mb-3",
          style: { fontFamily: "'Orbitron', sans-serif" },
          children: v.word
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: all.map((def, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          disabled: !!feedback,
          onClick: () => onAnswer(def === v.definition),
          className: `text-left px-3 py-2 rounded-lg border text-sm transition-all ${feedback && def === v.definition ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`,
          "data-ocid": `vocab_quest.def_option.${i + 1}`,
          children: def
        },
        i
      )) }),
      feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `mt-2 flex items-center gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
          children: [
            feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
            feedback === "correct" ? `Correct! +${cell.treasure + 150} pts` : `Wrong! The answer was: "${v.definition}"`
          ]
        }
      )
    ] });
  }
  if (type === "synonym") {
    const fakes = ["reckless", "obtuse", "mundane", "sullen"].slice(0, 3);
    const all = [...fakes, v.synonyms[0]].sort(() => Math.random() - 0.5);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-widest", children: "Synonym Selection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xl font-black text-[#00f5ff] mb-1",
          style: { fontFamily: "'Orbitron', sans-serif" },
          children: v.word
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Choose the correct synonym:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: all.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          disabled: !!feedback,
          onClick: () => onAnswer(opt === v.synonyms[0]),
          className: `px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${feedback && opt === v.synonyms[0] ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`,
          "data-ocid": `vocab_quest.syn_option.${i + 1}`,
          children: opt
        },
        i
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-widest", children: "Fill in the Blank" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mb-3 italic", children: v.fillSentence }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: v.fillOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        disabled: !!feedback,
        onClick: () => onAnswer(opt === v.fillAnswer),
        className: `px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${feedback && opt === v.fillAnswer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#00f5ff]/60 text-foreground"}`,
        "data-ocid": `vocab_quest.fill_option.${i + 1}`,
        children: opt
      },
      i
    )) }),
    feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `mt-2 flex items-center gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
        children: [
          feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
          feedback === "correct" ? "Correct! Path unlocked." : `Wrong! The word was: ${v.fillAnswer}`
        ]
      }
    )
  ] });
}
function SynonymAntonym({ config, onGameEnd }) {
  const pool = SYN_ANT_DATA[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [pairIdx, setPairIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [qStart, setQStart] = reactExports.useState(Date.now());
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
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
    [config, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const item = pool[idx];
  const pair = item == null ? void 0 : item.pairs[pairIdx];
  const RELATIONS = ["Synonym", "Antonym", "Neither"];
  function handleRelation(rel) {
    if (feedback || !pair) return;
    const elapsed = (Date.now() - qStart) / 1e3;
    const ok = rel === pair.relation;
    const speedBonus = ok ? Math.max(0, Math.floor((5 - elapsed) * 20)) : 0;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty + speedBonus);
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    }
    setFeedback({
      ok,
      msg: ok ? `Correct! ${pair.word} is a ${pair.relation} of ${item.word}.` : `Wrong. It is a ${pair.relation}.`,
      speed: speedBonus
    });
    setTimeout(() => {
      setFeedback(null);
      setQStart(Date.now());
      const nextPair = pairIdx + 1;
      if (nextPair >= item.pairs.length) {
        const nextIdx = idx + 1;
        if (nextIdx >= pool.length) endGame(true);
        else {
          setIdx(nextIdx);
          setPairIdx(0);
        }
      } else setPairIdx(nextPair);
    }, 1800);
  }
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "vocab_quest.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Synonym vs Antonym"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "A target word is shown with a related word. Classify the relationship." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#f59e0b] text-xs mb-6", children: "Answer faster for speed bonuses! Choose Synonym, Antonym, or Neither." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                    setQStart(Date.now());
                  },
                  "data-ocid": "vocab_quest.start_button",
                  children: "Start Challenge"
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
      className: "w-full h-full flex flex-col gap-4",
      "data-ocid": "vocab_quest.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#f59e0b] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
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
            className: "flex-1 flex flex-col gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-8 neon-top-border text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Target word" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-4xl font-black text-[#00f5ff] mb-4",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: item == null ? void 0 : item.word
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "How does this word relate?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[#f59e0b]", children: pair == null ? void 0 : pair.word })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: RELATIONS.map((rel, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: !!feedback,
                  onClick: () => handleRelation(rel),
                  className: `px-4 py-4 rounded-xl border text-sm font-bold transition-all ${feedback ? rel === (pair == null ? void 0 : pair.relation) ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 text-foreground"}`,
                  "data-ocid": `vocab_quest.relation.${i + 1}`,
                  children: rel
                },
                rel
              )) }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: `p-4 rounded-xl border flex items-center gap-3 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`,
                  children: [
                    feedback.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: `text-sm font-bold ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                          children: feedback.msg
                        }
                      ),
                      feedback.ok && feedback.speed !== void 0 && feedback.speed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#f59e0b] flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                        " Speed bonus: +",
                        feedback.speed
                      ] })
                    ] })
                  ]
                }
              )
            ]
          },
          `${idx}-${pairIdx}`
        ) })
      ]
    }
  );
}
function ContextCluesGame({ config, onGameEnd }) {
  const pool = CONTEXT_CLUES[config.difficulty];
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
  function highlightText(paragraph, target) {
    const parts = paragraph.split(target);
    if (parts.length < 2) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: paragraph });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      parts[0],
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold underline", children: target }),
      parts.slice(1).join(target)
    ] });
  }
  function handleAnswer(opt) {
    if (feedback || !item) return;
    const ok = opt === item.answer;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    setFeedback({
      ok,
      msg: ok ? item.explanation : `Wrong. Correct: "${item.answer}". ${item.explanation}`
    });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= pool.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2500);
  }
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "vocab_quest.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Context Clues"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "A paragraph is shown with one word underlined in amber." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Infer the meaning of that word from its context. Select the best definition from 4 options." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "vocab_quest.start_button",
                  children: "Begin Inference"
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
      "data-ocid": "vocab_quest.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
            idx + 1,
            "/",
            pool.length
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Read the passage — what does the underlined word mean?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: highlightText(item.paragraph, item.targetWord) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: item.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: !!feedback,
                  onClick: () => handleAnswer(opt),
                  className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${feedback ? opt === item.answer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#00f5ff]/60 text-foreground"}`,
                  "data-ocid": `vocab_quest.context_option.${i + 1}`,
                  children: opt
                },
                i
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
function VocabularyQuest({ config, onGameEnd }) {
  if (config.gameId === "synonym-antonym")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SynonymAntonym, { config, onGameEnd });
  if (config.gameId === "context-clues")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ContextCluesGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WordHunter, { config, onGameEnd });
}
export {
  VocabularyQuest as default
};
