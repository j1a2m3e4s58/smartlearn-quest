import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Mic, Volume2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface WordEntry {
  word: string;
  syllables: string[];
  stressIndex: number;
  stressOptions: string[][];
  trickySound: string;
  phonemeOptions: string[];
  correctPhoneme: string;
}

const WORDS: Record<1 | 2 | 3, WordEntry[]> = {
  1: [
    {
      word: "HAPPY",
      syllables: ["HAP", "PY"],
      stressIndex: 0,
      stressOptions: [
        ["HAP", "py"],
        ["hap", "PY"],
        ["hap", "py"],
      ],
      trickySound: "The double-P sound in 'happy'",
      phonemeOptions: ["/p/", "/b/", "/f/", "/v/"],
      correctPhoneme: "/p/",
    },
    {
      word: "BUTTER",
      syllables: ["BUT", "TER"],
      stressIndex: 0,
      stressOptions: [
        ["BUT", "ter"],
        ["but", "TER"],
        ["BUT", "TER"],
      ],
      trickySound: "The flap-T sound in 'butter'",
      phonemeOptions: ["/t/", "/d/", "/r/", "/l/"],
      correctPhoneme: "/t/",
    },
    {
      word: "GARDEN",
      syllables: ["GAR", "DEN"],
      stressIndex: 0,
      stressOptions: [
        ["GAR", "den"],
        ["gar", "DEN"],
        ["gar", "den"],
      ],
      trickySound: "Silent schwa in 'garden'",
      phonemeOptions: ["/a/", "/e/", "/o/", "/u/"],
      correctPhoneme: "/a/",
    },
    {
      word: "PENCIL",
      syllables: ["PEN", "CIL"],
      stressIndex: 0,
      stressOptions: [
        ["PEN", "cil"],
        ["pen", "CIL"],
        ["PEN", "CIL"],
      ],
      trickySound: "Soft C in 'pencil'",
      phonemeOptions: ["/s/", "/k/", "/ch/", "/sh/"],
      correctPhoneme: "/s/",
    },
    {
      word: "WATER",
      syllables: ["WA", "TER"],
      stressIndex: 0,
      stressOptions: [
        ["WA", "ter"],
        ["wa", "TER"],
        ["WA", "TER"],
      ],
      trickySound: "The 'wa' vowel sound",
      phonemeOptions: ["/o/", "/a/", "/u/", "/e/"],
      correctPhoneme: "/o/",
    },
    {
      word: "MONKEY",
      syllables: ["MON", "KEY"],
      stressIndex: 0,
      stressOptions: [
        ["MON", "key"],
        ["mon", "KEY"],
        ["mon", "key"],
      ],
      trickySound: "The 'ey' sound in 'monkey'",
      phonemeOptions: ["/ee/", "/ay/", "/ey/", "/ow/"],
      correctPhoneme: "/ee/",
    },
  ],
  2: [
    {
      word: "BANANA",
      syllables: ["BA", "NA", "NA"],
      stressIndex: 1,
      stressOptions: [
        ["BA", "NA", "na"],
        ["ba", "NA", "na"],
        ["ba", "na", "NA"],
      ],
      trickySound: "Stress on middle syllable",
      phonemeOptions: ["/buh/", "/ban/", "/bah/", "/ba/"],
      correctPhoneme: "/buh/",
    },
    {
      word: "COMPUTER",
      syllables: ["COM", "PU", "TER"],
      stressIndex: 1,
      stressOptions: [
        ["COM", "PU", "ter"],
        ["com", "PU", "ter"],
        ["com", "pu", "TER"],
      ],
      trickySound: "Reduced vowel in 'com'",
      phonemeOptions: ["/k/", "/g/", "/ch/", "/qu/"],
      correctPhoneme: "/k/",
    },
    {
      word: "IMPORTANT",
      syllables: ["IM", "POR", "TANT"],
      stressIndex: 1,
      stressOptions: [
        ["IM", "POR", "tant"],
        ["im", "POR", "tant"],
        ["im", "por", "TANT"],
      ],
      trickySound: "Silent T in 'important'",
      phonemeOptions: ["/t/", "silent", "/d/", "/n/"],
      correctPhoneme: "/t/",
    },
    {
      word: "REMEMBER",
      syllables: ["RE", "MEM", "BER"],
      stressIndex: 1,
      stressOptions: [
        ["RE", "MEM", "ber"],
        ["re", "MEM", "ber"],
        ["re", "mem", "BER"],
      ],
      trickySound: "Schwa in unstressed syllables",
      phonemeOptions: ["/r/", "/l/", "/w/", "/rr/"],
      correctPhoneme: "/r/",
    },
    {
      word: "EXAMPLE",
      syllables: ["EX", "AM", "PLE"],
      stressIndex: 1,
      stressOptions: [
        ["ex", "AM", "ple"],
        ["EX", "am", "ple"],
        ["ex", "am", "PLE"],
      ],
      trickySound: "The 'gz' sound in 'example'",
      phonemeOptions: ["/ks/", "/gz/", "/z/", "/x/"],
      correctPhoneme: "/gz/",
    },
    {
      word: "DIFFICULT",
      syllables: ["DIF", "FI", "CULT"],
      stressIndex: 0,
      stressOptions: [
        ["DIF", "fi", "cult"],
        ["dif", "FI", "cult"],
        ["dif", "fi", "CULT"],
      ],
      trickySound: "Reduced 'i' in middle syllable",
      phonemeOptions: ["/f/", "/v/", "/ph/", "/ff/"],
      correctPhoneme: "/f/",
    },
  ],
  3: [
    {
      word: "CONTEMPORARY",
      syllables: ["CON", "TEM", "PO", "RA", "RY"],
      stressIndex: 1,
      stressOptions: [
        ["con", "TEM", "po", "ra", "ry"],
        ["CON", "tem", "po", "ra", "ry"],
        ["con", "tem", "PO", "ra", "ry"],
      ],
      trickySound: "Vowel reduction in unstressed syllables",
      phonemeOptions: ["/tem/", "/tum/", "/tim/", "/teem/"],
      correctPhoneme: "/tem/",
    },
    {
      word: "PARTICULARLY",
      syllables: ["PAR", "TIC", "U", "LAR", "LY"],
      stressIndex: 1,
      stressOptions: [
        ["par", "TIC", "u", "lar", "ly"],
        ["PAR", "tic", "u", "lar", "ly"],
        ["par", "tic", "u", "LAR", "ly"],
      ],
      trickySound: "Syllable elision in fast speech",
      phonemeOptions: ["/t/", "/d/", "/tsh/", "/ch/"],
      correctPhoneme: "/t/",
    },
    {
      word: "INEVITABLE",
      syllables: ["IN", "EV", "I", "TA", "BLE"],
      stressIndex: 1,
      stressOptions: [
        ["in", "EV", "i", "ta", "ble"],
        ["IN", "ev", "i", "ta", "ble"],
        ["in", "ev", "i", "TA", "ble"],
      ],
      trickySound: "Schwa in 'i' syllable",
      phonemeOptions: ["/nev/", "/niv/", "/nev/", "/neev/"],
      correctPhoneme: "/nev/",
    },
    {
      word: "AUTONOMOUS",
      syllables: ["AU", "TON", "O", "MOUS"],
      stressIndex: 1,
      stressOptions: [
        ["au", "TON", "o", "mous"],
        ["AU", "ton", "o", "mous"],
        ["au", "ton", "o", "MOUS"],
      ],
      trickySound: "Diphthong 'au' sound",
      phonemeOptions: ["/aw/", "/ah/", "/oh/", "/ow/"],
      correctPhoneme: "/aw/",
    },
    {
      word: "AMBIGUITY",
      syllables: ["AM", "BI", "GU", "I", "TY"],
      stressIndex: 3,
      stressOptions: [
        ["am", "bi", "gu", "I", "ty"],
        ["AM", "bi", "gu", "i", "ty"],
        ["am", "bi", "GU", "i", "ty"],
      ],
      trickySound: "'gu' becomes /gj/ before 'i'",
      phonemeOptions: ["/g/", "/gj/", "/gw/", "/j/"],
      correctPhoneme: "/gj/",
    },
    {
      word: "EPISTEMOLOGY",
      syllables: ["EP", "IS", "TE", "MOL", "O", "GY"],
      stressIndex: 3,
      stressOptions: [
        ["ep", "is", "te", "MOL", "o", "gy"],
        ["EP", "is", "te", "mol", "o", "gy"],
        ["ep", "is", "TE", "mol", "o", "gy"],
      ],
      trickySound: "Stress shift in '-ology' words",
      phonemeOptions: ["/mol/", "/mohl/", "/mawl/", "/mull/"],
      correctPhoneme: "/mol/",
    },
  ],
};

// ──────────────────────────── GAME 2 DATA: RHYME MASTER ────────────────────────

interface RhymeRound {
  word: string;
  rhymePool: { word: string; rhymes: boolean }[];
  poem: string[];
  poemScheme: string;
  schemeOptions: string[];
}

const RHYME_ROUNDS: Record<1 | 2 | 3, RhymeRound[]> = {
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
        { word: "fat", rhymes: true },
      ],
      poem: [
        "I had a little cat",
        "Who sat upon a mat",
        "It wore a tiny hat",
        "And chased the dog around.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "AABB", "ABAB", "ABBA"],
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
        { word: "wing", rhymes: true },
      ],
      poem: [
        "The birds begin to sing",
        "A happy song of spring",
        "While church bells start to ring",
        "And children laugh and play.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "AABB", "ABAB", "AAAA"],
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
        { word: "bright", rhymes: true },
      ],
      poem: [
        "The stars shine bright at night",
        "The moon gives silver light",
        "A shooting star in flight",
        "A fox barks in the dark.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "ABCB", "AABB"],
    },
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
        { word: "wind (past)", rhymes: true },
      ],
      poem: [
        "She had a curious mind",
        "And left the past behind",
        "The road was hard to find",
        "But still she pressed ahead.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "AABB", "ABAB", "AAAA"],
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
        { word: "groan", rhymes: true },
      ],
      poem: [
        "He stood there all alone",
        "With nothing but a stone",
        "And carved it till it shone",
        "Then placed it at the gate.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "ABCB", "AABB"],
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
        { word: "cream", rhymes: true },
      ],
      poem: [
        "I dream beside the stream",
        "Where moonlit waters gleam",
        "The world is not what it seems",
        "On quiet summer nights.",
      ],
      poemScheme: "AABB",
      schemeOptions: ["AABB", "AAAB", "ABAB", "ABCB"],
    },
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
        { word: "shave", rhymes: true },
      ],
      poem: [
        "The brave stood by the grave",
        "While ocean cracked the cave",
        "And poets long for what they crave",
        "Yet silence rules the earth.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "AABB", "ABBA"],
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
        { word: "despite", rhymes: false },
      ],
      poem: [
        "She chased the fading light",
        "And stumbled through the night",
        "Her courage was her right",
        "Her silence was her prayer.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "ABCB", "AABB"],
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
        { word: "enthrall", rhymes: true },
      ],
      poem: [
        "Kingdoms rise and kingdoms fall",
        "Some answer history's call",
        "Some crumble, tower and wall",
        "Forgotten by the age.",
      ],
      poemScheme: "AAAB",
      schemeOptions: ["AAAB", "ABAB", "AABB", "ABBA"],
    },
  ],
};

// ──────────────────────────── GAME 3 DATA: SYLLABLE COUNTER ────────────────────────

interface SyllableWord {
  word: string;
  syllableCount: number;
  division: string;
  stressSyllable: number;
  stressOptions: string[];
}

const SYLLABLE_WORDS: Record<1 | 2 | 3, SyllableWord[]> = {
  1: [
    {
      word: "apple",
      syllableCount: 2,
      division: "ap-ple",
      stressSyllable: 1,
      stressOptions: ["ap", "ple"],
    },
    {
      word: "banana",
      syllableCount: 3,
      division: "ba-na-na",
      stressSyllable: 2,
      stressOptions: ["ba", "na", "na"],
    },
    {
      word: "elephant",
      syllableCount: 3,
      division: "el-e-phant",
      stressSyllable: 1,
      stressOptions: ["el", "e", "phant"],
    },
    {
      word: "computer",
      syllableCount: 3,
      division: "com-pu-ter",
      stressSyllable: 2,
      stressOptions: ["com", "pu", "ter"],
    },
    {
      word: "beautiful",
      syllableCount: 4,
      division: "beau-ti-ful",
      stressSyllable: 1,
      stressOptions: ["beau", "ti", "ful"],
    },
  ],
  2: [
    {
      word: "remember",
      syllableCount: 3,
      division: "re-mem-ber",
      stressSyllable: 2,
      stressOptions: ["re", "mem", "ber"],
    },
    {
      word: "education",
      syllableCount: 5,
      division: "ed-u-ca-tion",
      stressSyllable: 3,
      stressOptions: ["ed", "u", "ca", "tion"],
    },
    {
      word: "democracy",
      syllableCount: 4,
      division: "de-moc-ra-cy",
      stressSyllable: 2,
      stressOptions: ["de", "moc", "ra", "cy"],
    },
    {
      word: "photography",
      syllableCount: 4,
      division: "pho-tog-ra-phy",
      stressSyllable: 2,
      stressOptions: ["pho", "tog", "ra", "phy"],
    },
    {
      word: "inevitable",
      syllableCount: 5,
      division: "in-ev-i-ta-ble",
      stressSyllable: 2,
      stressOptions: ["in", "ev", "i", "ta", "ble"],
    },
  ],
  3: [
    {
      word: "revolutionary",
      syllableCount: 6,
      division: "rev-o-lu-tion-ar-y",
      stressSyllable: 3,
      stressOptions: ["rev", "o", "lu", "tion", "ar", "y"],
    },
    {
      word: "autobiography",
      syllableCount: 6,
      division: "au-to-bi-og-ra-phy",
      stressSyllable: 4,
      stressOptions: ["au", "to", "bi", "og", "ra", "phy"],
    },
    {
      word: "contemporary",
      syllableCount: 5,
      division: "con-tem-po-rar-y",
      stressSyllable: 2,
      stressOptions: ["con", "tem", "po", "rar", "y"],
    },
    {
      word: "characteristic",
      syllableCount: 5,
      division: "char-ac-ter-is-tic",
      stressSyllable: 4,
      stressOptions: ["char", "ac", "ter", "is", "tic"],
    },
    {
      word: "electromagnetic",
      syllableCount: 6,
      division: "e-lec-tro-mag-net-ic",
      stressSyllable: 5,
      stressOptions: ["e", "lec", "tro", "mag", "net", "ic"],
    },
  ],
};

// ──────────────────────────── GAME 1: PHONICS DECODER ────────────────────────

function PhonicsDecoder({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "stress" | "phoneme">("idle");
  const [wordIdx, setWordIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [stressFeedback, setStressFeedback] = useState<boolean | null>(null);
  const [phaseScore, setPhaseScore] = useState(0);
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const words = WORDS[config.difficulty];

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = attempts > 0 ? (correct / attempts) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          score,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          done,
        ),
      );
    },
    [config, score, correct, attempts, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  function handleStress(optIdx: number) {
    if (feedback) return;
    const w = words[wordIdx];
    const isCorrect = optIdx === w.stressIndex;
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

  function handlePhoneme(opt: string) {
    if (feedback) return;
    const w = words[wordIdx];
    const isCorrect = opt === w.correctPhoneme;
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
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-4"
      data-ocid="pronunciation_studio.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-[#f59e0b]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#00f5ff] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {wordIdx + 1}/{words.length} — {timeLeft}s
        </span>
      </div>
      {phase === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
          >
            <Volume2 className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Phonics Decoder
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Identify the correct syllable stress pattern for each word.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Then identify the tricky phoneme. Score points for accuracy.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setPhase("stress")}
              data-ocid="pronunciation_studio.start_button"
            >
              Start Decoding
            </GlowButton>
          </motion.div>
        </div>
      )}
      {(phase === "stress" || phase === "phoneme") && (
        <div className="flex-1 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${wordIdx}-${phase}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="glass-card rounded-2xl p-8 neon-top-border flex-1 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {phase === "stress"
                    ? "Step 1: Syllable Stress"
                    : "Step 2: Phoneme Identification"}
                </span>
                {phase === "phoneme" && stressFeedback !== null && (
                  <span
                    className={`text-xs font-bold ${stressFeedback ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                  >
                    {stressFeedback ? "Stress correct" : "Stress incorrect"}
                  </span>
                )}
              </div>
              <div className="flex justify-center gap-1 mb-6">
                {w.syllables.map((syl, i) => (
                  <span
                    key={i}
                    className={`text-4xl font-black tabular-nums tracking-wider ${i === w.stressIndex ? "text-[#00f5ff]" : "text-muted-foreground"}`}
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {syl}
                    {i < w.syllables.length - 1 && (
                      <span className="text-muted-foreground/40 mx-1">·</span>
                    )}
                  </span>
                ))}
              </div>
              {phase === "stress" && (
                <>
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    Which pattern shows correct syllable stress? (CAPS =
                    stressed)
                  </p>
                  <div className="flex flex-col gap-2">
                    {w.stressOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={!!feedback}
                        onClick={() => handleStress(i)}
                        className={`px-4 py-3 rounded-xl border text-center font-mono text-lg font-bold transition-all ${feedback !== null && i === w.stressIndex ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : feedback === "wrong" ? "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                        data-ocid={`pronunciation_studio.stress.${i + 1}`}
                      >
                        {opt.join(" · ")}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {phase === "phoneme" && (
                <>
                  <p className="text-sm text-muted-foreground mb-1 text-center">
                    {w.trickySound}
                  </p>
                  <p className="text-xs text-[#f59e0b] mb-3 text-center">
                    Select the correct phoneme symbol:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {w.phonemeOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={!!feedback}
                        onClick={() => handlePhoneme(opt)}
                        className={`px-4 py-4 rounded-xl border text-center font-mono text-xl font-black transition-all ${feedback !== null && opt === w.correctPhoneme ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : feedback === "wrong" ? "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`}
                        data-ocid={`pronunciation_studio.phoneme.${i + 1}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-4 p-3 rounded-xl border flex items-center gap-2 ${feedback === "correct" ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`}
                  >
                    {feedback === "correct" ? (
                      <CheckCircle className="h-4 w-4 text-[#10b981]" />
                    ) : (
                      <XCircle className="h-4 w-4 text-[#f43f5e]" />
                    )}
                    <p
                      className={`text-sm font-semibold ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                    >
                      {feedback === "correct"
                        ? "Correct!"
                        : phase === "stress"
                          ? `Wrong stress. Correct: ${w.stressOptions[w.stressIndex].join(" · ")}`
                          : `Wrong. The correct phoneme is ${w.correctPhoneme}`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────── GAME 2: RHYME MASTER ────────────────────────

function RhymeMaster({ config, onGameEnd }: Props) {
  const pool = RHYME_ROUNDS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"rhyme" | "scheme">("rhyme");
  const [rhymeSelected, setRhymeSelected] = useState<Set<string>>(new Set());
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [schemeFeedback, setSchemeFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc =
        pool.length > 0 ? (correctRef.current / pool.length) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          done,
        ),
      );
    },
    [config, pool.length, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;
  const item = pool[idx];

  function submitRhymes() {
    const correctRhymes = item.rhymePool
      .filter((r) => r.rhymes)
      .map((r) => r.word);
    const selected = Array.from(rhymeSelected);
    const pts =
      selected.filter((w) => correctRhymes.includes(w)).length *
      50 *
      config.difficulty;
    setScore((s) => s + pts);
    setPhase("scheme");
  }

  function handleScheme(scheme: string) {
    if (schemeSubmitted) return;
    const ok = scheme === item.poemScheme;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setSchemeSubmitted(true);
    setSchemeFeedback({
      ok,
      msg: ok
        ? `Correct! The scheme is ${item.poemScheme}.`
        : `Wrong. The scheme is ${item.poemScheme}. Each letter represents a line ending.`,
    });
    setTimeout(() => {
      setSchemeFeedback(null);
      setSchemeSubmitted(false);
      setRhymeSelected(new Set());
      setPhase("rhyme");
      if (idx + 1 >= pool.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2500);
  }

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="pronunciation_studio.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Volume2 className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Rhyme Master
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Part 1: Select all words that rhyme with the target word.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Part 2: Identify the rhyme scheme of a 4-line poem (AABB, ABAB,
            etc.).
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="pronunciation_studio.start_button"
          >
            Begin Rhyming
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="pronunciation_studio.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()}
        </span>
        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {idx + 1}/{pool.length} — {timeLeft}s
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${idx}-${phase}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 flex flex-col gap-4"
        >
          {phase === "rhyme" && (
            <>
              <div className="glass-card rounded-2xl p-6 neon-top-border text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Select all words that rhyme with:
                </p>
                <p
                  className="text-4xl font-black text-[#00f5ff]"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {item.word}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {item.rhymePool.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setRhymeSelected((prev) => {
                        const next = new Set(prev);
                        if (next.has(r.word)) next.delete(r.word);
                        else next.add(r.word);
                        return next;
                      })
                    }
                    className={`px-3 py-2 rounded-xl border text-sm font-bold transition-all ${rhymeSelected.has(r.word) ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 bg-card hover:border-[#7c3aed]/40 text-foreground"}`}
                    data-ocid={`pronunciation_studio.rhyme_word.${i + 1}`}
                  >
                    {r.word}
                  </button>
                ))}
              </div>
              <GlowButton
                variant="primary"
                onClick={submitRhymes}
                disabled={rhymeSelected.size === 0}
                data-ocid="pronunciation_studio.submit_rhymes_button"
              >
                Confirm Selection — Identify Scheme
              </GlowButton>
            </>
          )}
          {phase === "scheme" && (
            <>
              <div className="glass-card rounded-xl p-4 border border-[#7c3aed]/30">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Identify the rhyme scheme:
                </p>
                {item.poem.map((line, i) => (
                  <p key={i} className="text-sm text-foreground italic mb-1">
                    {line}
                  </p>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                What is the rhyme scheme of this poem?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {item.schemeOptions.map((scheme, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={schemeSubmitted}
                    onClick={() => handleScheme(scheme)}
                    className={`px-4 py-4 rounded-xl border text-lg font-black transition-all ${schemeFeedback ? (scheme === item.poemScheme ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                    data-ocid={`pronunciation_studio.scheme.${i + 1}`}
                  >
                    {scheme}
                  </button>
                ))}
              </div>
              {schemeFeedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${schemeFeedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`}
                >
                  {schemeFeedback.ok ? (
                    <CheckCircle className="h-5 w-5 text-[#10b981] shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[#f43f5e] shrink-0" />
                  )}
                  <p
                    className={`text-sm ${schemeFeedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                  >
                    {schemeFeedback.msg}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────── GAME 3: SYLLABLE COUNTER ────────────────────────

function SyllableCounter({ config, onGameEnd }: Props) {
  const pool = SYLLABLE_WORDS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"count" | "stress">("count");
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [selectedStress, setSelectedStress] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc =
        pool.length > 0 ? (correctRef.current / pool.length) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1000),
          done,
        ),
      );
    },
    [config, pool.length, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;
  const item = pool[idx];
  const countOptions = [1, 2, 3, 4, 5, 6];

  function handleCount(count: number) {
    if (feedback) return;
    const ok = count === item.syllableCount;
    setSelectedCount(count);
    setFeedback({
      ok,
      msg: ok
        ? `Correct! "${item.word}" has ${item.syllableCount} syllable(s): ${item.division}`
        : `Wrong. "${item.word}" has ${item.syllableCount} syllable(s): ${item.division}`,
    });
    setTimeout(() => {
      setFeedback(null);
      setPhase("stress");
    }, 2000);
  }

  function handleStress(sIdx: number) {
    if (feedback) return;
    const ok = sIdx + 1 === item.stressSyllable;
    setSelectedStress(sIdx);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback({
      ok,
      msg: ok
        ? `Correct! The stressed syllable is "${item.stressOptions[item.stressSyllable - 1]}".`
        : `Wrong. The stressed syllable is "${item.stressOptions[item.stressSyllable - 1]}" (syllable ${item.stressSyllable}).`,
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
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="pronunciation_studio.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Volume2 className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Syllable Counter
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A word is shown. First count the syllables, then identify the
            stressed syllable.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            The stressed syllable is the one spoken with most emphasis.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="pronunciation_studio.start_button"
          >
            Begin Counting
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="pronunciation_studio.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()}
        </span>
        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#10b981] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {idx + 1}/{pool.length} — {timeLeft}s
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${idx}-${phase}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 flex flex-col gap-4"
        >
          <div className="glass-card rounded-2xl p-8 neon-top-border text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {phase === "count"
                ? "How many syllables?"
                : "Which syllable is stressed?"}
            </p>
            <p
              className="text-5xl font-black tracking-widest"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" }}
            >
              {item.word}
            </p>
          </div>
          {phase === "count" && (
            <div className="grid grid-cols-3 gap-3">
              {countOptions.map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => handleCount(n)}
                  className={`px-4 py-4 rounded-xl border text-2xl font-black transition-all ${selectedCount === n ? (n === item.syllableCount ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]") : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`}
                  data-ocid={`pronunciation_studio.count.${n}`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
          {phase === "stress" && (
            <>
              <p className="text-xs text-muted-foreground text-center">
                Syllable divisions:{" "}
                <span className="text-[#f59e0b] font-bold">
                  {item.division}
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {item.stressOptions.map((syl, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleStress(i)}
                    className={`px-5 py-3 rounded-xl border text-lg font-bold transition-all ${selectedStress === i ? (i + 1 === item.stressSyllable ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]") : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`}
                    data-ocid={`pronunciation_studio.stress_syl.${i + 1}`}
                  >
                    {syl}
                  </button>
                ))}
              </div>
            </>
          )}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-start gap-3 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`}
            >
              {feedback.ok ? (
                <CheckCircle className="h-5 w-5 text-[#10b981] shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-[#f43f5e] shrink-0" />
              )}
              <p
                className={`text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
              >
                {feedback.msg}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────── MAIN EXPORT ────────────────────────

export default function PronunciationStudio({ config, onGameEnd }: Props) {
  if (config.gameId === "rhyme-master")
    return <RhymeMaster config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "syllable-counter")
    return <SyllableCounter config={config} onGameEnd={onGameEnd} />;
  return <PhonicsDecoder config={config} onGameEnd={onGameEnd} />;
}
