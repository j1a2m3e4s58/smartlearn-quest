import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { M as Mic } from "./mic-QB2xxd_J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode);
const WORDS = {
  1: [
    {
      word: "HAPPY",
      syllables: ["HAP", "PY"],
      stressIndex: 0,
      stressOptions: [
        ["HAP", "py"],
        ["hap", "PY"],
        ["hap", "py"]
      ],
      trickySound: "The double-P sound in 'happy'",
      phonemeOptions: ["/p/", "/b/", "/f/", "/v/"],
      correctPhoneme: "/p/"
    },
    {
      word: "BUTTER",
      syllables: ["BUT", "TER"],
      stressIndex: 0,
      stressOptions: [
        ["BUT", "ter"],
        ["but", "TER"],
        ["BUT", "TER"]
      ],
      trickySound: "The flap-T sound in 'butter'",
      phonemeOptions: ["/t/", "/d/", "/r/", "/l/"],
      correctPhoneme: "/t/"
    },
    {
      word: "GARDEN",
      syllables: ["GAR", "DEN"],
      stressIndex: 0,
      stressOptions: [
        ["GAR", "den"],
        ["gar", "DEN"],
        ["gar", "den"]
      ],
      trickySound: "Silent schwa in 'garden'",
      phonemeOptions: ["/a/", "/e/", "/o/", "/u/"],
      correctPhoneme: "/a/"
    },
    {
      word: "PENCIL",
      syllables: ["PEN", "CIL"],
      stressIndex: 0,
      stressOptions: [
        ["PEN", "cil"],
        ["pen", "CIL"],
        ["PEN", "CIL"]
      ],
      trickySound: "Soft C in 'pencil'",
      phonemeOptions: ["/s/", "/k/", "/ch/", "/sh/"],
      correctPhoneme: "/s/"
    },
    {
      word: "WATER",
      syllables: ["WA", "TER"],
      stressIndex: 0,
      stressOptions: [
        ["WA", "ter"],
        ["wa", "TER"],
        ["WA", "TER"]
      ],
      trickySound: "The 'wa' vowel sound",
      phonemeOptions: ["/o/", "/a/", "/u/", "/e/"],
      correctPhoneme: "/o/"
    },
    {
      word: "MONKEY",
      syllables: ["MON", "KEY"],
      stressIndex: 0,
      stressOptions: [
        ["MON", "key"],
        ["mon", "KEY"],
        ["mon", "key"]
      ],
      trickySound: "The 'ey' sound in 'monkey'",
      phonemeOptions: ["/ee/", "/ay/", "/ey/", "/ow/"],
      correctPhoneme: "/ee/"
    }
  ],
  2: [
    {
      word: "BANANA",
      syllables: ["BA", "NA", "NA"],
      stressIndex: 1,
      stressOptions: [
        ["BA", "NA", "na"],
        ["ba", "NA", "na"],
        ["ba", "na", "NA"]
      ],
      trickySound: "Stress on middle syllable",
      phonemeOptions: ["/buh/", "/ban/", "/bah/", "/ba/"],
      correctPhoneme: "/buh/"
    },
    {
      word: "COMPUTER",
      syllables: ["COM", "PU", "TER"],
      stressIndex: 1,
      stressOptions: [
        ["COM", "PU", "ter"],
        ["com", "PU", "ter"],
        ["com", "pu", "TER"]
      ],
      trickySound: "Reduced vowel in 'com'",
      phonemeOptions: ["/k/", "/g/", "/ch/", "/qu/"],
      correctPhoneme: "/k/"
    },
    {
      word: "IMPORTANT",
      syllables: ["IM", "POR", "TANT"],
      stressIndex: 1,
      stressOptions: [
        ["IM", "POR", "tant"],
        ["im", "POR", "tant"],
        ["im", "por", "TANT"]
      ],
      trickySound: "Silent T in 'important'",
      phonemeOptions: ["/t/", "silent", "/d/", "/n/"],
      correctPhoneme: "/t/"
    },
    {
      word: "REMEMBER",
      syllables: ["RE", "MEM", "BER"],
      stressIndex: 1,
      stressOptions: [
        ["RE", "MEM", "ber"],
        ["re", "MEM", "ber"],
        ["re", "mem", "BER"]
      ],
      trickySound: "Schwa in unstressed syllables",
      phonemeOptions: ["/r/", "/l/", "/w/", "/rr/"],
      correctPhoneme: "/r/"
    },
    {
      word: "EXAMPLE",
      syllables: ["EX", "AM", "PLE"],
      stressIndex: 1,
      stressOptions: [
        ["ex", "AM", "ple"],
        ["EX", "am", "ple"],
        ["ex", "am", "PLE"]
      ],
      trickySound: "The 'gz' sound in 'example'",
      phonemeOptions: ["/ks/", "/gz/", "/z/", "/x/"],
      correctPhoneme: "/gz/"
    },
    {
      word: "DIFFICULT",
      syllables: ["DIF", "FI", "CULT"],
      stressIndex: 0,
      stressOptions: [
        ["DIF", "fi", "cult"],
        ["dif", "FI", "cult"],
        ["dif", "fi", "CULT"]
      ],
      trickySound: "Reduced 'i' in middle syllable",
      phonemeOptions: ["/f/", "/v/", "/ph/", "/ff/"],
      correctPhoneme: "/f/"
    }
  ],
  3: [
    {
      word: "CONTEMPORARY",
      syllables: ["CON", "TEM", "PO", "RA", "RY"],
      stressIndex: 1,
      stressOptions: [
        ["con", "TEM", "po", "ra", "ry"],
        ["CON", "tem", "po", "ra", "ry"],
        ["con", "tem", "PO", "ra", "ry"]
      ],
      trickySound: "Vowel reduction in unstressed syllables",
      phonemeOptions: ["/tem/", "/tum/", "/tim/", "/teem/"],
      correctPhoneme: "/tem/"
    },
    {
      word: "PARTICULARLY",
      syllables: ["PAR", "TIC", "U", "LAR", "LY"],
      stressIndex: 1,
      stressOptions: [
        ["par", "TIC", "u", "lar", "ly"],
        ["PAR", "tic", "u", "lar", "ly"],
        ["par", "tic", "u", "LAR", "ly"]
      ],
      trickySound: "Syllable elision in fast speech",
      phonemeOptions: ["/t/", "/d/", "/tsh/", "/ch/"],
      correctPhoneme: "/t/"
    },
    {
      word: "INEVITABLE",
      syllables: ["IN", "EV", "I", "TA", "BLE"],
      stressIndex: 1,
      stressOptions: [
        ["in", "EV", "i", "ta", "ble"],
        ["IN", "ev", "i", "ta", "ble"],
        ["in", "ev", "i", "TA", "ble"]
      ],
      trickySound: "Schwa in 'i' syllable",
      phonemeOptions: ["/nev/", "/niv/", "/nev/", "/neev/"],
      correctPhoneme: "/nev/"
    },
    {
      word: "AUTONOMOUS",
      syllables: ["AU", "TON", "O", "MOUS"],
      stressIndex: 1,
      stressOptions: [
        ["au", "TON", "o", "mous"],
        ["AU", "ton", "o", "mous"],
        ["au", "ton", "o", "MOUS"]
      ],
      trickySound: "Diphthong 'au' sound",
      phonemeOptions: ["/aw/", "/ah/", "/oh/", "/ow/"],
      correctPhoneme: "/aw/"
    },
    {
      word: "AMBIGUITY",
      syllables: ["AM", "BI", "GU", "I", "TY"],
      stressIndex: 3,
      stressOptions: [
        ["am", "bi", "gu", "I", "ty"],
        ["AM", "bi", "gu", "i", "ty"],
        ["am", "bi", "GU", "i", "ty"]
      ],
      trickySound: "'gu' becomes /gj/ before 'i'",
      phonemeOptions: ["/g/", "/gj/", "/gw/", "/j/"],
      correctPhoneme: "/gj/"
    },
    {
      word: "EPISTEMOLOGY",
      syllables: ["EP", "IS", "TE", "MOL", "O", "GY"],
      stressIndex: 3,
      stressOptions: [
        ["ep", "is", "te", "MOL", "o", "gy"],
        ["EP", "is", "te", "mol", "o", "gy"],
        ["ep", "is", "TE", "mol", "o", "gy"]
      ],
      trickySound: "Stress shift in '-ology' words",
      phonemeOptions: ["/mol/", "/mohl/", "/mawl/", "/mull/"],
      correctPhoneme: "/mol/"
    }
  ]
};
const RHYME_ROUNDS = {
  1: [
    {
      word: "CAT",
      rhymePool: [
        { word: "bat", rhymes: true },
        { word: "mat", rhymes: true },
        { word: "dog", rhymes: false },
        { word: "sat", rhymes: true },
        { word: "tree", rhymes: false },
        { word: "hat", rhymes: true },
        { word: "run", rhymes: false },
        { word: "fat", rhymes: true }
      ],
      poem: [
        "I had a little cat",
        "Who sat upon a mat",
        "It wore a tiny hat",
        "And chased the dog around."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "AABB", "ABAB", "ABBA"]
    },
    {
      word: "SING",
      rhymePool: [
        { word: "ring", rhymes: true },
        { word: "king", rhymes: true },
        { word: "blue", rhymes: false },
        { word: "bring", rhymes: true },
        { word: "tall", rhymes: false },
        { word: "spring", rhymes: true },
        { word: "walk", rhymes: false },
        { word: "wing", rhymes: true }
      ],
      poem: [
        "The birds begin to sing",
        "A happy song of spring",
        "While church bells start to ring",
        "And children laugh and play."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "AABB", "ABAB", "AAAA"]
    },
    {
      word: "NIGHT",
      rhymePool: [
        { word: "light", rhymes: true },
        { word: "moon", rhymes: false },
        { word: "right", rhymes: true },
        { word: "star", rhymes: false },
        { word: "might", rhymes: true },
        { word: "sky", rhymes: false },
        { word: "fight", rhymes: true },
        { word: "bright", rhymes: true }
      ],
      poem: [
        "The stars shine bright at night",
        "The moon gives silver light",
        "A shooting star in flight",
        "A fox barks in the dark."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "ABCB", "AABB"]
    }
  ],
  2: [
    {
      word: "MIND",
      rhymePool: [
        { word: "kind", rhymes: true },
        { word: "find", rhymes: true },
        { word: "wish", rhymes: false },
        { word: "blind", rhymes: true },
        { word: "race", rhymes: false },
        { word: "grind", rhymes: true },
        { word: "hope", rhymes: false },
        { word: "wind (past)", rhymes: true }
      ],
      poem: [
        "She had a curious mind",
        "And left the past behind",
        "The road was hard to find",
        "But still she pressed ahead."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "AABB", "ABAB", "AAAA"]
    },
    {
      word: "STONE",
      rhymePool: [
        { word: "alone", rhymes: true },
        { word: "bone", rhymes: true },
        { word: "river", rhymes: false },
        { word: "tone", rhymes: true },
        { word: "green", rhymes: false },
        { word: "known", rhymes: true },
        { word: "truth", rhymes: false },
        { word: "groan", rhymes: true }
      ],
      poem: [
        "He stood there all alone",
        "With nothing but a stone",
        "And carved it till it shone",
        "Then placed it at the gate."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "ABCB", "AABB"]
    },
    {
      word: "DREAM",
      rhymePool: [
        { word: "stream", rhymes: true },
        { word: "beam", rhymes: true },
        { word: "cloud", rhymes: false },
        { word: "theme", rhymes: true },
        { word: "soft", rhymes: false },
        { word: "seam", rhymes: true },
        { word: "earth", rhymes: false },
        { word: "cream", rhymes: true }
      ],
      poem: [
        "I dream beside the stream",
        "Where moonlit waters gleam",
        "The world is not what it seems",
        "On quiet summer nights."
      ],
      poemScheme: "AABB",
      schemeOptions: ["AABB", "AAAB", "ABAB", "ABCB"]
    }
  ],
  3: [
    {
      word: "GRAVE",
      rhymePool: [
        { word: "brave", rhymes: true },
        { word: "cave", rhymes: true },
        { word: "storm", rhymes: false },
        { word: "wave", rhymes: true },
        { word: "ancient", rhymes: false },
        { word: "crave", rhymes: true },
        { word: "winter", rhymes: false },
        { word: "shave", rhymes: true }
      ],
      poem: [
        "The brave stood by the grave",
        "While ocean cracked the cave",
        "And poets long for what they crave",
        "Yet silence rules the earth."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "AABB", "ABBA"]
    },
    {
      word: "LIGHT",
      rhymePool: [
        { word: "night", rhymes: true },
        { word: "flight", rhymes: true },
        { word: "shadow", rhymes: false },
        { word: "right", rhymes: true },
        { word: "question", rhymes: false },
        { word: "plight", rhymes: true },
        { word: "colour", rhymes: false },
        { word: "despite", rhymes: false }
      ],
      poem: [
        "She chased the fading light",
        "And stumbled through the night",
        "Her courage was her right",
        "Her silence was her prayer."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "ABCB", "AABB"]
    },
    {
      word: "FALL",
      rhymePool: [
        { word: "call", rhymes: true },
        { word: "tall", rhymes: true },
        { word: "winter", rhymes: false },
        { word: "wall", rhymes: true },
        { word: "shadow", rhymes: false },
        { word: "crawl", rhymes: true },
        { word: "burden", rhymes: false },
        { word: "enthrall", rhymes: true }
      ],
      poem: [
        "Kingdoms rise and kingdoms fall",
        "Some answer history's call",
        "Some crumble, tower and wall",
        "Forgotten by the age."
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "AABB", "ABBA"]
    }
  ]
};
const SYLLABLE_WORDS = {
  1: [
    {
      word: "apple",
      syllableCount: 2,
      division: "ap-ple",
      stressSyllable: 1,
      stressOptions: ["ap", "ple"]
    },
    {
      word: "banana",
      syllableCount: 3,
      division: "ba-na-na",
      stressSyllable: 2,
      stressOptions: ["ba", "na", "na"]
    },
    {
      word: "elephant",
      syllableCount: 3,
      division: "el-e-phant",
      stressSyllable: 1,
      stressOptions: ["el", "e", "phant"]
    },
    {
      word: "computer",
      syllableCount: 3,
      division: "com-pu-ter",
      stressSyllable: 2,
      stressOptions: ["com", "pu", "ter"]
    },
    {
      word: "beautiful",
      syllableCount: 4,
      division: "beau-ti-ful",
      stressSyllable: 1,
      stressOptions: ["beau", "ti", "ful"]
    }
  ],
  2: [
    {
      word: "remember",
      syllableCount: 3,
      division: "re-mem-ber",
      stressSyllable: 2,
      stressOptions: ["re", "mem", "ber"]
    },
    {
      word: "education",
      syllableCount: 5,
      division: "ed-u-ca-tion",
      stressSyllable: 3,
      stressOptions: ["ed", "u", "ca", "tion"]
    },
    {
      word: "democracy",
      syllableCount: 4,
      division: "de-moc-ra-cy",
      stressSyllable: 2,
      stressOptions: ["de", "moc", "ra", "cy"]
    },
    {
      word: "photography",
      syllableCount: 4,
      division: "pho-tog-ra-phy",
      stressSyllable: 2,
      stressOptions: ["pho", "tog", "ra", "phy"]
    },
    {
      word: "inevitable",
      syllableCount: 5,
      division: "in-ev-i-ta-ble",
      stressSyllable: 2,
      stressOptions: ["in", "ev", "i", "ta", "ble"]
    }
  ],
  3: [
    {
      word: "revolutionary",
      syllableCount: 6,
      division: "rev-o-lu-tion-ar-y",
      stressSyllable: 3,
      stressOptions: ["rev", "o", "lu", "tion", "ar", "y"]
    },
    {
      word: "autobiography",
      syllableCount: 6,
      division: "au-to-bi-og-ra-phy",
      stressSyllable: 4,
      stressOptions: ["au", "to", "bi", "og", "ra", "phy"]
    },
    {
      word: "contemporary",
      syllableCount: 5,
      division: "con-tem-po-rar-y",
      stressSyllable: 2,
      stressOptions: ["con", "tem", "po", "rar", "y"]
    },
    {
      word: "characteristic",
      syllableCount: 5,
      division: "char-ac-ter-is-tic",
      stressSyllable: 4,
      stressOptions: ["char", "ac", "ter", "is", "tic"]
    },
    {
      word: "electromagnetic",
      syllableCount: 6,
      division: "e-lec-tro-mag-net-ic",
      stressSyllable: 5,
      stressOptions: ["e", "lec", "tro", "mag", "net", "ic"]
    }
  ]
};
function PhonicsDecoder({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [wordIdx, setWordIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [attempts, setAttempts] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [stressFeedback, setStressFeedback] = reactExports.useState(null);
  const [phaseScore, setPhaseScore] = reactExports.useState(0);
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const words = WORDS[config.difficulty];
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = attempts > 0 ? correct / attempts * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          score,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          done
        )
      );
    },
    [config, score, correct, attempts, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  function handleStress(optIdx) {
    if (feedback) return;
    const w2 = words[wordIdx];
    const isCorrect = optIdx === w2.stressIndex;
    setAttempts((a) => a + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setPhaseScore(100 * config.difficulty);
    }
    setStressFeedback(isCorrect);
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      setStressFeedback(null);
      setPhase("phoneme");
    }, 1500);
  }
  function handlePhoneme(opt) {
    if (feedback) return;
    const w2 = words[wordIdx];
    const isCorrect = opt === w2.correctPhoneme;
    setAttempts((a) => a + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + phaseScore + 100 * config.difficulty);
    }
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      if (wordIdx + 1 >= words.length) endGame(true);
      else {
        setWordIdx((i) => i + 1);
        setPhase("stress");
      }
    }, 1800);
  }
  const w = words[wordIdx];
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-4",
      "data-ocid": "pronunciation_studio.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4 text-[#f59e0b]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
            wordIdx + 1,
            "/",
            words.length,
            " — ",
            timeLeft,
            "s"
          ] })
        ] }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Phonics Decoder"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Identify the correct syllable stress pattern for each word." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Then identify the tricky phoneme. Score points for accuracy." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => setPhase("stress"),
                  "data-ocid": "pronunciation_studio.start_button",
                  children: "Start Decoding"
                }
              )
            ]
          }
        ) }),
        (phase === "stress" || phase === "phoneme") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            className: "glass-card rounded-2xl p-8 neon-top-border flex-1 flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: phase === "stress" ? "Step 1: Syllable Stress" : "Step 2: Phoneme Identification" }),
                phase === "phoneme" && stressFeedback !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-bold ${stressFeedback ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                    children: stressFeedback ? "Stress correct" : "Stress incorrect"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1 mb-6", children: w.syllables.map((syl, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-4xl font-black tabular-nums tracking-wider ${i === w.stressIndex ? "text-[#00f5ff]" : "text-muted-foreground"}`,
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    syl,
                    i < w.syllables.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 mx-1", children: "·" })
                  ]
                },
                i
              )) }),
              phase === "stress" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3 text-center", children: "Which pattern shows correct syllable stress? (CAPS = stressed)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: w.stressOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => handleStress(i),
                    className: `px-4 py-3 rounded-xl border text-center font-mono text-lg font-bold transition-all ${feedback !== null && i === w.stressIndex ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : feedback === "wrong" ? "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`,
                    "data-ocid": `pronunciation_studio.stress.${i + 1}`,
                    children: opt.join(" · ")
                  },
                  i
                )) })
              ] }),
              phase === "phoneme" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1 text-center", children: w.trickySound }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#f59e0b] mb-3 text-center", children: "Select the correct phoneme symbol:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: w.phonemeOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => handlePhoneme(opt),
                    className: `px-4 py-4 rounded-xl border text-center font-mono text-xl font-black transition-all ${feedback !== null && opt === w.correctPhoneme ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : feedback === "wrong" ? "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`,
                    "data-ocid": `pronunciation_studio.phoneme.${i + 1}`,
                    children: opt
                  },
                  i
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  className: `mt-4 p-3 rounded-xl border flex items-center gap-2 ${feedback === "correct" ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`,
                  children: [
                    feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm font-semibold ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                        children: feedback === "correct" ? "Correct!" : phase === "stress" ? `Wrong stress. Correct: ${w.stressOptions[w.stressIndex].join(" · ")}` : `Wrong. The correct phoneme is ${w.correctPhoneme}`
                      }
                    )
                  ]
                }
              ) })
            ]
          },
          `${wordIdx}-${phase}`
        ) }) })
      ]
    }
  );
}
function RhymeMaster({ config, onGameEnd }) {
  const pool = RHYME_ROUNDS[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("rhyme");
  const [rhymeSelected, setRhymeSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [schemeSubmitted, setSchemeSubmitted] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [schemeFeedback, setSchemeFeedback] = reactExports.useState(null);
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
  function submitRhymes() {
    const correctRhymes = item.rhymePool.filter((r) => r.rhymes).map((r) => r.word);
    const selected = Array.from(rhymeSelected);
    const pts = selected.filter((w) => correctRhymes.includes(w)).length * 50 * config.difficulty;
    setScore((s) => s + pts);
    setPhase("scheme");
  }
  function handleScheme(scheme) {
    if (schemeSubmitted) return;
    const ok = scheme === item.poemScheme;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setSchemeSubmitted(true);
    setSchemeFeedback({
      ok,
      msg: ok ? `Correct! The scheme is ${item.poemScheme}.` : `Wrong. The scheme is ${item.poemScheme}. Each letter represents a line ending.`
    });
    setTimeout(() => {
      setSchemeFeedback(null);
      setSchemeSubmitted(false);
      setRhymeSelected(/* @__PURE__ */ new Set());
      setPhase("rhyme");
      if (idx + 1 >= pool.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2500);
  }
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "pronunciation_studio.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Rhyme Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Part 1: Select all words that rhyme with the target word." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Part 2: Identify the rhyme scheme of a 4-line poem (AABB, ABAB, etc.)." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "pronunciation_studio.start_button",
                  children: "Begin Rhyming"
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
      "data-ocid": "pronunciation_studio.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#7c3aed] transition-all duration-1000",
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
              phase === "rhyme" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 neon-top-border text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Select all words that rhyme with:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-4xl font-black text-[#00f5ff]",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: item.word
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: item.rhymePool.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setRhymeSelected((prev) => {
                      const next = new Set(prev);
                      if (next.has(r.word)) next.delete(r.word);
                      else next.add(r.word);
                      return next;
                    }),
                    className: `px-3 py-2 rounded-xl border text-sm font-bold transition-all ${rhymeSelected.has(r.word) ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 bg-card hover:border-[#7c3aed]/40 text-foreground"}`,
                    "data-ocid": `pronunciation_studio.rhyme_word.${i + 1}`,
                    children: r.word
                  },
                  i
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    onClick: submitRhymes,
                    disabled: rhymeSelected.size === 0,
                    "data-ocid": "pronunciation_studio.submit_rhymes_button",
                    children: "Confirm Selection — Identify Scheme"
                  }
                )
              ] }),
              phase === "scheme" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#7c3aed]/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Identify the rhyme scheme:" }),
                  item.poem.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground italic mb-1", children: line }, i))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "What is the rhyme scheme of this poem?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: item.schemeOptions.map((scheme, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: schemeSubmitted,
                    onClick: () => handleScheme(scheme),
                    className: `px-4 py-4 rounded-xl border text-lg font-black transition-all ${schemeFeedback ? scheme === item.poemScheme ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`,
                    "data-ocid": `pronunciation_studio.scheme.${i + 1}`,
                    children: scheme
                  },
                  i
                )) }),
                schemeFeedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: `p-4 rounded-xl border flex items-start gap-3 ${schemeFeedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`,
                    children: [
                      schemeFeedback.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e] shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: `text-sm ${schemeFeedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                          children: schemeFeedback.msg
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          },
          `${idx}-${phase}`
        ) })
      ]
    }
  );
}
function SyllableCounter({ config, onGameEnd }) {
  const pool = SYLLABLE_WORDS[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("count");
  const [selectedCount, setSelectedCount] = reactExports.useState(null);
  const [selectedStress, setSelectedStress] = reactExports.useState(null);
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
  const countOptions = [1, 2, 3, 4, 5, 6];
  function handleCount(count) {
    if (feedback) return;
    const ok = count === item.syllableCount;
    setSelectedCount(count);
    setFeedback({
      ok,
      msg: ok ? `Correct! "${item.word}" has ${item.syllableCount} syllable(s): ${item.division}` : `Wrong. "${item.word}" has ${item.syllableCount} syllable(s): ${item.division}`
    });
    setTimeout(() => {
      setFeedback(null);
      setPhase("stress");
    }, 2e3);
  }
  function handleStress(sIdx) {
    if (feedback) return;
    const ok = sIdx + 1 === item.stressSyllable;
    setSelectedStress(sIdx);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback({
      ok,
      msg: ok ? `Correct! The stressed syllable is "${item.stressOptions[item.stressSyllable - 1]}".` : `Wrong. The stressed syllable is "${item.stressOptions[item.stressSyllable - 1]}" (syllable ${item.stressSyllable}).`
    });
    setTimeout(() => {
      setFeedback(null);
      setSelectedCount(null);
      setSelectedStress(null);
      setPhase("count");
      if (idx + 1 >= pool.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2500);
  }
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "pronunciation_studio.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-14 w-14 mx-auto mb-4 text-[#10b981]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Syllable Counter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "A word is shown. First count the syllables, then identify the stressed syllable." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "The stressed syllable is the one spoken with most emphasis." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "pronunciation_studio.start_button",
                  children: "Begin Counting"
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
      "data-ocid": "pronunciation_studio.page",
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-8 neon-top-border text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: phase === "count" ? "How many syllables?" : "Which syllable is stressed?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-5xl font-black tracking-widest",
                    style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
                    children: item.word
                  }
                )
              ] }),
              phase === "count" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: countOptions.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: !!feedback,
                  onClick: () => handleCount(n),
                  className: `px-4 py-4 rounded-xl border text-2xl font-black transition-all ${selectedCount === n ? n === item.syllableCount ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]" : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`,
                  "data-ocid": `pronunciation_studio.count.${n}`,
                  children: n
                },
                n
              )) }),
              phase === "stress" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
                  "Syllable divisions:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: item.division })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-3", children: item.stressOptions.map((syl, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => handleStress(i),
                    className: `px-5 py-3 rounded-xl border text-lg font-bold transition-all ${selectedStress === i ? i + 1 === item.stressSyllable ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`,
                    "data-ocid": `pronunciation_studio.stress_syl.${i + 1}`,
                    children: syl
                  },
                  i
                )) })
              ] }),
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
          `${idx}-${phase}`
        ) })
      ]
    }
  );
}
function PronunciationStudio({ config, onGameEnd }) {
  if (config.gameId === "rhyme-master")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RhymeMaster, { config, onGameEnd });
  if (config.gameId === "syllable-counter")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SyllableCounter, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PhonicsDecoder, { config, onGameEnd });
}
export {
  PronunciationStudio as default
};
