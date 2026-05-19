import { GlowButton } from "@/components/ui/GlowButton";
import {
  AlertTriangle,
  CheckCircle,
  Heart,
  Shield,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface SentenceError {
  id: string;
  sentence: string;
  words: string[];
  errorIndex: number;
  correction: string;
  rule: string;
  options: string[];
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─────────────────────────────── GAME 1 DATA ────────────────────────────────

const SENTENCES: Record<1 | 2 | 3, SentenceError[]> = {
  1: [
    {
      id: "g1",
      sentence: "She don't like ice cream.",
      words: ["She", "don't", "like", "ice", "cream."],
      errorIndex: 1,
      correction: "doesn't",
      rule: "Subject-verb agreement: use 'doesn't' with she/he/it",
      options: ["doesn't", "don't", "didn't", "ain't"],
    },
    {
      id: "g2",
      sentence: "The childrens are playing.",
      words: ["The", "childrens", "are", "playing."],
      errorIndex: 1,
      correction: "children",
      rule: "'Children' is already plural — no 's' needed",
      options: ["children", "childs", "childrens", "child's"],
    },
    {
      id: "g3",
      sentence: "He runned to the store.",
      words: ["He", "runned", "to", "the", "store."],
      errorIndex: 1,
      correction: "ran",
      rule: "'Run' has an irregular past tense: ran",
      options: ["ran", "runned", "has run", "running"],
    },
    {
      id: "g4",
      sentence: "I goed to school yesterday.",
      words: ["I", "goed", "to", "school", "yesterday."],
      errorIndex: 1,
      correction: "went",
      rule: "'Go' has an irregular past tense: went",
      options: ["went", "goed", "go", "gone"],
    },
    {
      id: "g5",
      sentence: "There is many books on the shelf.",
      words: ["There", "is", "many", "books", "on", "the", "shelf."],
      errorIndex: 1,
      correction: "are",
      rule: "'Many books' is plural — use 'are'",
      options: ["are", "is", "was", "be"],
    },
    {
      id: "g6",
      sentence: "She have a red bicycle.",
      words: ["She", "have", "a", "red", "bicycle."],
      errorIndex: 1,
      correction: "has",
      rule: "Third person singular: use 'has'",
      options: ["has", "have", "had", "having"],
    },
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
        "ready.",
      ],
      errorIndex: 6,
      correction: "was",
      rule: "With 'neither...nor', the verb agrees with the nearest subject ('teacher' — singular)",
      options: ["was", "were", "are", "be"],
    },
    {
      id: "g8",
      sentence: "If I was you, I would study harder.",
      words: ["If", "I", "was", "you,", "I", "would", "study", "harder."],
      errorIndex: 2,
      correction: "were",
      rule: "Subjunctive mood: 'If I were you' expresses hypothetical situations",
      options: ["were", "was", "am", "be"],
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
        "locker.",
      ],
      errorIndex: 4,
      correction: "has",
      rule: "'Each' is singular and always takes a singular verb",
      options: ["has", "have", "had", "having"],
    },
    {
      id: "g10",
      sentence: "She is more smarter than her brother.",
      words: ["She", "is", "more", "smarter", "than", "her", "brother."],
      errorIndex: 2,
      correction: "smarter",
      rule: "Double comparative error: 'smarter' already means 'more smart'",
      options: ["smarter", "more smarter", "most smart", "smart"],
    },
    {
      id: "g11",
      sentence: "The committee have reached a decision.",
      words: ["The", "committee", "have", "reached", "a", "decision."],
      errorIndex: 2,
      correction: "has",
      rule: "Collective nouns like 'committee' take singular verbs in American English",
      options: ["has", "have", "had", "were"],
    },
    {
      id: "g12",
      sentence: "He don't never lie to his friends.",
      words: ["He", "don't", "never", "lie", "to", "his", "friends."],
      errorIndex: 2,
      correction: "ever",
      rule: "Double negative: 'don't never' should be 'doesn't ever'",
      options: ["ever", "never", "always", "sometimes"],
    },
  ],
  3: [
    {
      id: "g13",
      sentence: "The reason is because he was late.",
      words: ["The", "reason", "is", "because", "he", "was", "late."],
      errorIndex: 3,
      correction: "that",
      rule: "'The reason is that' — not 'because'; avoid redundancy",
      options: ["that", "because", "why", "since"],
    },
    {
      id: "g14",
      sentence: "Between you and I, the plan is flawed.",
      words: ["Between", "you", "and", "I,", "the", "plan", "is", "flawed."],
      errorIndex: 3,
      correction: "me,",
      rule: "Prepositions take object pronouns: 'between you and me'",
      options: ["me,", "I,", "myself,", "mine,"],
    },
    {
      id: "g15",
      sentence: "The phenomena is well documented.",
      words: ["The", "phenomena", "is", "well", "documented."],
      errorIndex: 2,
      correction: "are",
      rule: "'Phenomena' is plural; singular is 'phenomenon'",
      options: ["are", "is", "was", "has been"],
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
        "left.",
      ],
      errorIndex: 5,
      correction: "students",
      rule: "Dangling participle: the subject 'students' is missing",
      options: ["students", "room", "class", "teachers"],
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
        "researcher.",
      ],
      errorIndex: 2,
      correction: "were",
      rule: "'Data' is plural: 'the data were analyzed'",
      options: ["were", "was", "is", "are"],
    },
    {
      id: "g18",
      sentence: "Less students attended due to the rain.",
      words: ["Less", "students", "attended", "due", "to", "the", "rain."],
      errorIndex: 0,
      correction: "Fewer",
      rule: "'Fewer' for countable nouns; 'less' for uncountable nouns",
      options: ["Fewer", "Less", "More", "Many"],
    },
  ],
};

// ─────────────────────────────── GAME 2 DATA ────────────────────────────────

interface PosItem {
  id: string;
  sentence: string;
  highlighted: string;
  highlightIdx: number;
  partOfSpeech: string;
  options: string[];
  explanation: string;
}

const POS_ITEMS: Record<1 | 2 | 3, PosItem[]> = {
  1: [
    {
      id: "p1",
      sentence: "The brave soldier crossed the field.",
      highlighted: "brave",
      highlightIdx: 1,
      partOfSpeech: "Adjective",
      options: ["Noun", "Verb", "Adjective", "Adverb"],
      explanation: "'Brave' describes the noun 'soldier' — it is an adjective.",
    },
    {
      id: "p2",
      sentence: "She runs every morning before school.",
      highlighted: "runs",
      highlightIdx: 1,
      partOfSpeech: "Verb",
      options: ["Noun", "Verb", "Adjective", "Pronoun"],
      explanation: "'Runs' is the action being performed — it is a verb.",
    },
    {
      id: "p3",
      sentence: "The dog barked loudly at the stranger.",
      highlighted: "loudly",
      highlightIdx: 3,
      partOfSpeech: "Adverb",
      options: ["Verb", "Adverb", "Adjective", "Noun"],
      explanation: "'Loudly' describes how the dog barked — it is an adverb.",
    },
    {
      id: "p4",
      sentence: "They went to the market yesterday.",
      highlighted: "They",
      highlightIdx: 0,
      partOfSpeech: "Pronoun",
      options: ["Noun", "Pronoun", "Adjective", "Conjunction"],
      explanation:
        "'They' substitutes for a group of people — it is a pronoun.",
    },
    {
      id: "p5",
      sentence: "The old bridge collapsed into the river.",
      highlighted: "bridge",
      highlightIdx: 2,
      partOfSpeech: "Noun",
      options: ["Noun", "Verb", "Adjective", "Preposition"],
      explanation: "'Bridge' names a thing — it is a noun.",
    },
    {
      id: "p6",
      sentence: "He placed the book on the shelf.",
      highlighted: "on",
      highlightIdx: 5,
      partOfSpeech: "Preposition",
      options: ["Adverb", "Conjunction", "Preposition", "Noun"],
      explanation:
        "'On' shows the relationship between the book and the shelf — it is a preposition.",
    },
  ],
  2: [
    {
      id: "p7",
      sentence: "She was completely exhausted after the marathon.",
      highlighted: "completely",
      highlightIdx: 2,
      partOfSpeech: "Adverb",
      options: ["Adjective", "Adverb", "Noun", "Verb"],
      explanation:
        "'Completely' modifies the adjective 'exhausted' — it is an adverb.",
    },
    {
      id: "p8",
      sentence: "Neither the manager nor the staff were informed.",
      highlighted: "Neither",
      highlightIdx: 0,
      partOfSpeech: "Conjunction",
      options: ["Pronoun", "Preposition", "Conjunction", "Adverb"],
      explanation:
        "'Neither...nor' connects two subjects — it is a correlative conjunction.",
    },
    {
      id: "p9",
      sentence: "Running every day improved his stamina significantly.",
      highlighted: "Running",
      highlightIdx: 0,
      partOfSpeech: "Noun",
      options: ["Verb", "Noun", "Adjective", "Adverb"],
      explanation:
        "'Running' is a gerund (verb acting as noun) — the subject of the sentence.",
    },
    {
      id: "p10",
      sentence: "The policy was implemented despite strong opposition.",
      highlighted: "despite",
      highlightIdx: 5,
      partOfSpeech: "Preposition",
      options: ["Conjunction", "Preposition", "Adverb", "Adjective"],
      explanation:
        "'Despite' introduces a phrase showing contrast — it is a preposition.",
    },
    {
      id: "p11",
      sentence: "Ouch! That injection was more painful than expected.",
      highlighted: "Ouch",
      highlightIdx: 0,
      partOfSpeech: "Interjection",
      options: ["Noun", "Adverb", "Interjection", "Verb"],
      explanation:
        "'Ouch' expresses sudden pain with no grammatical role — it is an interjection.",
    },
    {
      id: "p12",
      sentence: "The committee and the board reached an agreement.",
      highlighted: "and",
      highlightIdx: 2,
      partOfSpeech: "Conjunction",
      options: ["Preposition", "Adverb", "Pronoun", "Conjunction"],
      explanation:
        "'And' joins 'committee' and 'board' — it is a coordinating conjunction.",
    },
  ],
  3: [
    {
      id: "p13",
      sentence: "To err is human, but to forgive is divine.",
      highlighted: "To err",
      highlightIdx: 0,
      partOfSpeech: "Noun",
      options: ["Noun", "Verb", "Adjective", "Adverb"],
      explanation:
        "'To err' is an infinitive functioning as the subject — it acts as a noun.",
    },
    {
      id: "p14",
      sentence: "The exhausted climbers reached the summit at dawn.",
      highlighted: "exhausted",
      highlightIdx: 1,
      partOfSpeech: "Adjective",
      options: ["Verb", "Adjective", "Adverb", "Noun"],
      explanation:
        "'Exhausted' is a past participle used as an adjective modifying 'climbers'.",
    },
    {
      id: "p15",
      sentence: "She spoke so eloquently that the room fell silent.",
      highlighted: "eloquently",
      highlightIdx: 2,
      partOfSpeech: "Adverb",
      options: ["Adjective", "Adverb", "Noun", "Verb"],
      explanation: "'Eloquently' modifies the verb 'spoke' — it is an adverb.",
    },
    {
      id: "p16",
      sentence: "Having completed his studies, he returned home.",
      highlighted: "Having completed",
      highlightIdx: 0,
      partOfSpeech: "Verb",
      options: ["Noun", "Verb", "Adjective", "Conjunction"],
      explanation:
        "'Having completed' is a perfect participle phrase functioning as a verb.",
    },
    {
      id: "p17",
      sentence: "It is imperative that every student submit their work.",
      highlighted: "submit",
      highlightIdx: 7,
      partOfSpeech: "Verb",
      options: ["Noun", "Adjective", "Verb", "Adverb"],
      explanation:
        "'Submit' is in the subjunctive mood after 'imperative that' — it is a verb form.",
    },
    {
      id: "p18",
      sentence: "The phenomenon, though rare, was meticulously documented.",
      highlighted: "though",
      highlightIdx: 2,
      partOfSpeech: "Conjunction",
      options: ["Preposition", "Adverb", "Conjunction", "Pronoun"],
      explanation:
        "'Though' introduces a concessive clause — it is a subordinating conjunction.",
    },
  ],
};

// ─────────────────────────────── GAME 3 DATA ────────────────────────────────

interface ScrambledSentence {
  id: string;
  tiles: string[];
  validOrders: number[][];
  hint: string;
}

const SCRAMBLED: Record<1 | 2 | 3, ScrambledSentence[]> = {
  1: [
    {
      id: "s1",
      tiles: ["The", "cat", "sat", "on", "the", "mat"],
      validOrders: [[0, 1, 2, 3, 4, 5]],
      hint: "Subject + verb + location",
    },
    {
      id: "s2",
      tiles: ["She", "quickly", "ran", "to", "school"],
      validOrders: [
        [0, 2, 1, 3, 4],
        [0, 1, 2, 3, 4],
      ],
      hint: "Adverb can go before or after verb",
    },
    {
      id: "s3",
      tiles: ["Birds", "sing", "in", "the", "morning"],
      validOrders: [[0, 1, 2, 3, 4]],
      hint: "Subject + verb + time phrase",
    },
    {
      id: "s4",
      tiles: ["He", "ate", "three", "large", "apples"],
      validOrders: [[0, 1, 2, 3, 4]],
      hint: "Number adjective before opinion adjective",
    },
    {
      id: "s5",
      tiles: ["We", "went", "to", "the", "big", "park"],
      validOrders: [[0, 1, 2, 3, 4, 5]],
      hint: "Subject + verb + destination",
    },
  ],
  2: [
    {
      id: "s6",
      tiles: ["Never", "had", "she", "seen", "such", "beauty"],
      validOrders: [[0, 1, 2, 3, 4, 5]],
      hint: "Negative inversion: Never + auxiliary + subject",
    },
    {
      id: "s7",
      tiles: ["The", "report", "which", "she", "wrote", "was", "excellent"],
      validOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hint: "Relative clause modifies the subject",
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
        "record",
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      hint: "Correlative conjunction structure",
    },
    {
      id: "s9",
      tiles: ["Had", "I", "known", "I", "would", "have", "come"],
      validOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hint: "Third conditional with inversion",
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
        "theory",
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
      hint: "Reduced relative clause modifies 'data'",
    },
  ],
  3: [
    {
      id: "s11",
      tiles: ["Rarely", "does", "such", "courage", "manifest", "so", "clearly"],
      validOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hint: "Adverbial inversion",
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
        "began",
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
      hint: "No sooner...than inversion",
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
        "this",
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hint: "Only + prepositional phrase triggers inversion",
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
        "disagreed",
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hint: "Fronted complement with inversion",
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
        "published",
      ],
      validOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hint: "Absolute phrase with passive participle",
    },
  ],
};

// ─────────────────────────────── GAME 1: GRAMMAR POLICE ─────────────────────

function GrammarPolice({ config, onGameEnd }: Props) {
  const [gameStarted, setGameStarted] = useState(false);
  const [queue, setQueue] = useState<SentenceError[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [arrests, setArrests] = useState(0);
  const [falseArrests, setFalseArrests] = useState(0);
  const [showRule, setShowRule] = useState<string | null>(null);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const arrestsRef = useRef(arrests);
  scoreRef.current = score;
  livesRef.current = lives;
  arrestsRef.current = arrests;
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const total = arrestsRef.current + falseArrests;
      const accuracy = total > 0 ? (arrestsRef.current / total) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, accuracy, timeSpent, completed),
      );
    },
    [config, falseArrests, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(true));

  function handleStart() {
    const sentences = [...SENTENCES[config.difficulty]].sort(
      () => Math.random() - 0.5,
    );
    setQueue(sentences);
    setCurrentIdx(0);
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
  }

  const current = queue[currentIdx];

  function handleWordClick(wordIdx: number) {
    if (feedback) return;
    setSelectedWord(wordIdx);
    setShowOptions(true);
  }

  function handleOptionSelect(option: string) {
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

  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div className="w-full h-full flex flex-col" data-ocid="grammar_city.page">
      <div className="game-hud flex items-center justify-between gap-4 mb-3 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Shield className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!gameStarted ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
          >
            <Shield className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Grammar Police
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Find the grammatical error, click the wrong word, and select the
              correct fix.
            </p>
            <p className="text-[#f43f5e] text-xs mb-6">
              Clicking a correct word counts as a false arrest — penalty
              applies!
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              data-ocid="grammar_city.start_button"
            >
              Begin Patrol
            </GlowButton>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Case {currentIdx + 1} / {queue.length}
            </span>
            <span className="text-[#10b981]">Arrests: {arrests}</span>
            <span className="text-[#f43f5e]">False: {falseArrests}</span>
          </div>
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="glass-card rounded-2xl p-8 neon-top-border"
              >
                <p
                  className="text-xs uppercase tracking-widest text-muted-foreground mb-4"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Identify the Error
                </p>
                <div className="flex flex-wrap gap-2">
                  {current.words.map((word, idx) => (
                    <button
                      key={`${current.id}-word-${idx}`}
                      type="button"
                      onClick={() => handleWordClick(idx)}
                      className={`px-3 py-2 rounded-lg text-lg font-semibold border transition-all duration-200 ${
                        selectedWord === idx
                          ? feedback === "correct"
                            ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                            : feedback === "wrong"
                              ? "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                              : "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]"
                          : "border-border/40 bg-card hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/10 text-foreground"
                      }`}
                      data-ocid={`grammar_city.word.${idx + 1}`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {showOptions && selectedWord !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6"
                    >
                      <p className="text-xs text-muted-foreground mb-3">
                        Select the correct replacement for{" "}
                        <span className="text-[#f59e0b] font-bold">
                          &ldquo;{current.words[selectedWord]}&rdquo;
                        </span>
                        :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {current.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleOptionSelect(opt)}
                            className="px-4 py-2 rounded-lg border border-[#7c3aed]/60 bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20 font-semibold transition-smooth"
                            data-ocid={`grammar_city.option.${opt}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {feedback === "correct" && showRule && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-3 rounded-lg border border-[#10b981]/50 bg-[#10b981]/10 flex items-start gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
                      <p className="text-[#10b981] text-sm">{showRule}</p>
                    </motion.div>
                  )}
                  {feedback === "wrong" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-3 rounded-lg border border-[#f43f5e]/50 bg-[#f43f5e]/10 flex items-start gap-2"
                    >
                      <XCircle className="h-4 w-4 text-[#f43f5e] shrink-0 mt-0.5" />
                      <p className="text-[#f43f5e] text-sm">
                        False arrest! That word may be correct. Re-examine the
                        sentence.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-[#f59e0b] shrink-0" />
            <p className="text-xs text-muted-foreground">
              Click the <span className="text-[#f59e0b]">incorrect word</span>,
              then select its correction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────── GAME 2: PARTS OF SPEECH ────────────────────

function PartsOfSpeech({ config, onGameEnd }: Props) {
  const items = POS_ITEMS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
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
        items.length > 0 ? (correctRef.current / items.length) * 100 : 0;
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
    [config, items.length, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;
  const item = items[idx];

  function handleAnswer(opt: string) {
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
      msg: ok
        ? `Correct! ${item.explanation}`
        : `Wrong. It is a ${item.partOfSpeech}. ${item.explanation}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= items.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2200);
  }

  const wordsInSentence = item?.sentence.split(" ") ?? [];

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="grammar_city.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Shield className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Parts of Speech
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A sentence is shown with one word highlighted in amber.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Classify the highlighted word as the correct part of speech from 4
            options.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="grammar_city.start_button"
          >
            Begin Classification
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="grammar_city.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#7c3aed]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={i}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {idx + 1}/{items.length}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 flex flex-col gap-4"
        >
          <div className="glass-card rounded-2xl p-6 neon-top-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Classify the highlighted word
            </p>
            <div className="flex flex-wrap gap-2">
              {wordsInSentence.map((word, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-lg font-semibold ${
                    word === item.highlighted ||
                    word.replace(/[.,!?]/, "") ===
                      item.highlighted.replace(/[.,!?]/, "")
                      ? "bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f59e0b]"
                      : "text-foreground"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {item.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                  feedback
                    ? opt === item.partOfSpeech
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-border/20 text-muted-foreground"
                    : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"
                }`}
                data-ocid={`grammar_city.pos_option.${i + 1}`}
              >
                {opt}
              </button>
            ))}
          </div>
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

// ─────────────────────────────── GAME 3: SENTENCE BUILDER ───────────────────

function SentenceBuilderGame({ config, onGameEnd }: Props) {
  const pool = SCRAMBLED[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [arranged, setArranged] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>([]);
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

  function initItem(i: number) {
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

  function pickTile(tile: string, tileIdx: number) {
    if (feedback) return;
    const newRem = [...remaining];
    newRem.splice(tileIdx, 1);
    setRemaining(newRem);
    setArranged((a) => [...a, tile]);
  }

  function removeTile(tile: string, arrIdx: number) {
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
      (ord) => ord.map((i) => item.tiles[i]).join(",") === arrangedStr,
    );
    if (valid) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 250 * config.difficulty);
    }
    setFeedback({
      ok: valid,
      msg: valid
        ? "Correct! The sentence is grammatically sound."
        : `Not quite. Hint: ${item.hint}`,
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
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="grammar_city.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Shield className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Sentence Builder
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Word tiles are shown scrambled. Click tiles to arrange them into a
            grammatically correct sentence.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Multiple valid orders are accepted. Click a placed tile to return
            it.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={startGame}
            data-ocid="grammar_city.start_button"
          >
            Start Building
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="grammar_city.page"
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
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 flex flex-col gap-4"
        >
          <div className="glass-card rounded-2xl p-5 neon-top-border min-h-20">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Your sentence:
            </p>
            <div className="flex flex-wrap gap-2 min-h-10">
              {arranged.length === 0 && (
                <span className="text-muted-foreground text-sm italic">
                  Click tiles below to build the sentence...
                </span>
              )}
              {arranged.map((tile, i) => (
                <button
                  key={`arr-${i}`}
                  type="button"
                  onClick={() => removeTile(tile, i)}
                  className="px-3 py-2 rounded-lg border border-[#00f5ff]/60 bg-[#00f5ff]/10 text-[#00f5ff] font-semibold text-sm hover:bg-[#f43f5e]/20 hover:border-[#f43f5e]/60 transition-all"
                  data-ocid={`grammar_city.arranged.${i + 1}`}
                >
                  {tile}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Available tiles:
            </p>
            <div className="flex flex-wrap gap-2">
              {remaining.map((tile, i) => (
                <button
                  key={`rem-${i}`}
                  type="button"
                  onClick={() => pickTile(tile, i)}
                  className="px-3 py-2 rounded-lg border border-border/50 bg-card text-foreground font-semibold text-sm hover:border-[#7c3aed]/60 hover:bg-[#7c3aed]/10 transition-all"
                  data-ocid={`grammar_city.tile.${i + 1}`}
                >
                  {tile}
                </button>
              ))}
            </div>
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl border flex items-start gap-3 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f59e0b]/40 bg-[#f59e0b]/10"}`}
            >
              {feedback.ok ? (
                <CheckCircle className="h-5 w-5 text-[#10b981] shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-[#f59e0b] shrink-0" />
              )}
              <p
                className={`text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f59e0b]"}`}
              >
                {feedback.msg}
              </p>
            </motion.div>
          )}
          <div className="flex gap-3">
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={resetTiles}
              data-ocid="grammar_city.reset_button"
            >
              Reset
            </GlowButton>
            <GlowButton
              variant="primary"
              onClick={checkOrder}
              disabled={arranged.length !== item.tiles.length}
              data-ocid="grammar_city.check_button"
            >
              Check Sentence
            </GlowButton>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────── MAIN EXPORT ────────────────────────────────

export default function GrammarCity({ config, onGameEnd }: Props) {
  if (config.gameId === "parts-of-speech")
    return <PartsOfSpeech config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "sentence-builder")
    return <SentenceBuilderGame config={config} onGameEnd={onGameEnd} />;
  return <GrammarPolice config={config} onGameEnd={onGameEnd} />;
}
