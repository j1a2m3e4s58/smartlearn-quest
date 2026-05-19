import { GlowButton } from "@/components/ui/GlowButton";
import { BookMarked, CheckCircle, XCircle } from "lucide-react";
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

type Device =
  | "simile"
  | "metaphor"
  | "alliteration"
  | "personification"
  | "onomatopoeia";

interface PoemEntry {
  title: string;
  author: string;
  lines: string[];
  rhemeScheme: string[];
  devices: {
    lineIdx: number;
    phrase: string;
    device: Device;
    explanation: string;
  }[];
  tone: string;
  mood: string;
  toneOptions: string[];
  moodOptions: string[];
}

const POEMS: Record<1 | 2 | 3, PoemEntry[]> = {
  1: [
    {
      title: "Storm at Sea",
      author: "Classic Verse",
      lines: [
        "The waves roar like angry giants at night,",
        "The lightning cracks and splits the sky in two,",
        "The wind sings danger through the dying light,",
        "While sailors pray beneath a sky of blue.",
      ],
      rhemeScheme: ["A", "B", "A", "B"],
      devices: [
        {
          lineIdx: 0,
          phrase: "like angry giants",
          device: "simile",
          explanation:
            "Comparison using 'like' — waves compared to angry giants",
        },
        {
          lineIdx: 2,
          phrase: "wind sings",
          device: "personification",
          explanation: "The wind is given the human ability to sing",
        },
      ],
      tone: "ominous",
      mood: "fearful",
      toneOptions: ["ominous", "joyful", "sarcastic", "nostalgic"],
      moodOptions: ["fearful", "relaxed", "triumphant", "melancholic"],
    },
  ],
  2: [
    {
      title: "The City Never Sleeps",
      author: "Urban Collection",
      lines: [
        "Steel towers scrape the belly of the clouds,",
        "A million footsteps drum the concrete drum,",
        "Neon whispers hiss through evening crowds,",
        "While sirens scream until the morning comes.",
      ],
      rhemeScheme: ["A", "B", "A", "B"],
      devices: [
        {
          lineIdx: 0,
          phrase: "scrape the belly of the clouds",
          device: "metaphor",
          explanation:
            "Towers directly described as scraping a body part — metaphor for extreme height",
        },
        {
          lineIdx: 1,
          phrase: "drum the concrete drum",
          device: "alliteration",
          explanation: "Repetition of the 'd' consonant sound",
        },
        {
          lineIdx: 3,
          phrase: "sirens scream",
          device: "onomatopoeia",
          explanation: "'Scream' mimics the actual piercing sound of sirens",
        },
      ],
      tone: "intense",
      mood: "restless",
      toneOptions: ["intense", "peaceful", "humorous", "reverent"],
      moodOptions: ["restless", "serene", "hopeful", "despairing"],
    },
  ],
  3: [
    {
      title: "Borrowed Hours",
      author: "Contemporary Verse",
      lines: [
        "Time is a thief that robs us while we sleep,",
        "It bleeds through cracks in clocks we dare not wind,",
        "The memories we promised we would keep,",
        "Dissolve like morning mist inside the mind.",
      ],
      rhemeScheme: ["A", "B", "A", "B"],
      devices: [
        {
          lineIdx: 0,
          phrase: "Time is a thief",
          device: "metaphor",
          explanation:
            "Time directly equated with a thief — implies stealth and loss",
        },
        {
          lineIdx: 1,
          phrase: "bleeds through cracks",
          device: "personification",
          explanation:
            "Abstract time given a bodily function (bleeding) suggesting painful, uncontrollable loss",
        },
        {
          lineIdx: 3,
          phrase: "like morning mist",
          device: "simile",
          explanation:
            "Comparison using 'like' — memories compared to transient morning mist",
        },
      ],
      tone: "melancholic",
      mood: "contemplative",
      toneOptions: ["melancholic", "triumphant", "satirical", "whimsical"],
      moodOptions: ["contemplative", "agitated", "jubilant", "indifferent"],
    },
  ],
};

const DEVICE_OPTIONS: Device[] = [
  "simile",
  "metaphor",
  "alliteration",
  "personification",
  "onomatopoeia",
];
const SCHEME_LABELS = ["A", "B", "C", "D", "E"];

// ──────────────────────────── GAME 2 DATA: FIGURE OF SPEECH ────────────────────────

type LiteraryDevice =
  | "Simile"
  | "Metaphor"
  | "Personification"
  | "Hyperbole"
  | "Alliteration"
  | "Onomatopoeia"
  | "Oxymoron"
  | "Irony";

interface FigureItem {
  phrase: string;
  source: string;
  device: LiteraryDevice;
  explanation: string;
}

const FIGURE_ITEMS: FigureItem[] = [
  {
    phrase: "Life is a journey with no map.",
    source: "General",
    device: "Metaphor",
    explanation:
      "Life is directly compared to a journey without using 'like' or 'as'.",
  },
  {
    phrase: "The stars danced in the midnight sky.",
    source: "Poetry",
    device: "Personification",
    explanation: "Stars are given the human ability to dance.",
  },
  {
    phrase: "His voice was as smooth as velvet.",
    source: "Literature",
    device: "Simile",
    explanation: "Comparison using 'as' — voice compared to velvet.",
  },
  {
    phrase: "I've told you a million times!",
    source: "Everyday speech",
    device: "Hyperbole",
    explanation: "Extreme exaggeration used for effect, not literal.",
  },
  {
    phrase: "The busy bees buzzed beneath the blossoms.",
    source: "Poetry",
    device: "Alliteration",
    explanation: "Repetition of the 'b' sound at the start of words.",
  },
  {
    phrase: "The thunder crashed and the lightning crackled.",
    source: "Prose",
    device: "Onomatopoeia",
    explanation:
      "'Crashed' and 'crackled' imitate the actual sounds they describe.",
  },
  {
    phrase: "It was an open secret that he was leaving.",
    source: "Common usage",
    device: "Oxymoron",
    explanation: "'Open secret' combines contradictory terms for effect.",
  },
  {
    phrase: "What a beautiful day for a funeral.",
    source: "Drama",
    device: "Irony",
    explanation: "The statement means the opposite of what is literally said.",
  },
  {
    phrase: "The silence screamed at him from every corner.",
    source: "Novel",
    device: "Personification",
    explanation: "Silence is given the human action of screaming.",
  },
  {
    phrase: "Her smile was like a sunrise.",
    source: "Poetry",
    device: "Simile",
    explanation: "Comparison using 'like' — smile compared to a sunrise.",
  },
  {
    phrase: "He drowned in a sea of paperwork.",
    source: "Office novel",
    device: "Metaphor",
    explanation:
      "Paperwork directly equated to a sea to suggest overwhelming volume.",
  },
  {
    phrase: "Deafening silence fell over the courtroom.",
    source: "Legal drama",
    device: "Oxymoron",
    explanation:
      "'Deafening silence' pairs contradictory concepts — extreme quiet described as noise.",
  },
  {
    phrase: "The old clock on the wall ticked away the years.",
    source: "Short story",
    device: "Personification",
    explanation: "The clock is given the conscious ability to count time.",
  },
  {
    phrase: "Fast as lightning, she sprinted to the finish.",
    source: "Sports writing",
    device: "Simile",
    explanation: "Speed compared to lightning using 'as'.",
  },
  {
    phrase: "She carried the weight of the world on her shoulders.",
    source: "Biography",
    device: "Metaphor",
    explanation:
      "Emotional burden directly described as the weight of the world.",
  },
  {
    phrase: "He was so hungry he could eat a horse.",
    source: "Idiom",
    device: "Hyperbole",
    explanation: "Extreme exaggeration to communicate intense hunger.",
  },
  {
    phrase: "Peter Piper picked a peck of pickled peppers.",
    source: "Nursery rhyme",
    device: "Alliteration",
    explanation: "Repetition of the 'p' sound throughout the phrase.",
  },
  {
    phrase: "The bees hummed and the leaves rustled in the breeze.",
    source: "Nature writing",
    device: "Onomatopoeia",
    explanation:
      "'Hummed' and 'rustled' mimic the actual sounds they describe.",
  },
  {
    phrase: "Only the good die young.",
    source: "Cultural proverb",
    device: "Irony",
    explanation:
      "The phrase implies that virtue is rewarded with early death — a bitter irony.",
  },
  {
    phrase: "It was a living death to be trapped in that office.",
    source: "Memoir",
    device: "Oxymoron",
    explanation:
      "'Living death' combines opposite states for expressive impact.",
  },
];

// ──────────────────────────── GAME 3 DATA: POEM BUILDER ────────────────────────

interface PoemBuildSlot {
  lineNum: number;
  rhymeLetter: string;
  template: string;
  wordBankKey: "A" | "B";
  correctWord: string;
  wordBank: string[];
}

interface PoemBuildItem {
  theme: string;
  slots: PoemBuildSlot[];
  rhymeScheme: string;
}

const POEM_BUILD_ITEMS: Record<1 | 2 | 3, PoemBuildItem[]> = {
  1: [
    {
      theme: "Nature",
      rhymeScheme: "ABAB",
      slots: [
        {
          lineNum: 1,
          rhymeLetter: "A",
          template: "The golden sun begins to ___ (A)",
          wordBankKey: "A",
          correctWord: "rise",
          wordBank: ["rise", "fall", "shine", "walk"],
        },
        {
          lineNum: 2,
          rhymeLetter: "B",
          template: "And morning birds begin their ___ (B)",
          wordBankKey: "B",
          correctWord: "song",
          wordBank: ["song", "flight", "dance", "nest"],
        },
        {
          lineNum: 3,
          rhymeLetter: "A",
          template: "Across the blue and cloudless ___ (rhymes with A)",
          wordBankKey: "A",
          correctWord: "skies",
          wordBank: ["skies", "hills", "trees", "earth"],
        },
        {
          lineNum: 4,
          rhymeLetter: "B",
          template: "The whole world wakes where it belongs (rhymes with B)",
          wordBankKey: "B",
          correctWord: "belongs",
          wordBank: ["belongs", "rests", "sings", "stays"],
        },
      ],
    },
  ],
  2: [
    {
      theme: "Friendship",
      rhymeScheme: "ABAB",
      slots: [
        {
          lineNum: 1,
          rhymeLetter: "A",
          template: "A friend will stand with you through ___ (A)",
          wordBankKey: "A",
          correctWord: "fire",
          wordBank: ["fire", "storms", "rain", "cold"],
        },
        {
          lineNum: 2,
          rhymeLetter: "B",
          template: "And hold your hand in darkest ___ (B)",
          wordBankKey: "B",
          correctWord: "night",
          wordBank: ["night", "hour", "time", "day"],
        },
        {
          lineNum: 3,
          rhymeLetter: "A",
          template: "They lift your spirit ever ___ (rhymes with A)",
          wordBankKey: "A",
          correctWord: "higher",
          wordBank: ["higher", "further", "faster", "deeper"],
        },
        {
          lineNum: 4,
          rhymeLetter: "B",
          template: "And help you find your inner light (rhymes with B)",
          wordBankKey: "B",
          correctWord: "light",
          wordBank: ["light", "strength", "voice", "truth"],
        },
      ],
    },
  ],
  3: [
    {
      theme: "Time",
      rhymeScheme: "ABAB",
      slots: [
        {
          lineNum: 1,
          rhymeLetter: "A",
          template: "The years dissolve like morning ___ (A)",
          wordBankKey: "A",
          correctWord: "mist",
          wordBank: ["mist", "light", "rain", "snow"],
        },
        {
          lineNum: 2,
          rhymeLetter: "B",
          template: "And memories drift too swift to ___ (B)",
          wordBankKey: "B",
          correctWord: "hold",
          wordBank: ["hold", "keep", "find", "trace"],
        },
        {
          lineNum: 3,
          rhymeLetter: "A",
          template: "What once shone bright is barely ___ (rhymes with A)",
          wordBankKey: "A",
          correctWord: "kissed",
          wordBank: ["kissed", "found", "known", "shown"],
        },
        {
          lineNum: 4,
          rhymeLetter: "B",
          template: "By time's indifferent hand, ice cold (rhymes with B)",
          wordBankKey: "B",
          correctWord: "cold",
          wordBank: ["cold", "grey", "gone", "still"],
        },
      ],
    },
  ],
};

const ALL_LITERARY_DEVICES: LiteraryDevice[] = [
  "Simile",
  "Metaphor",
  "Personification",
  "Hyperbole",
  "Alliteration",
  "Onomatopoeia",
  "Oxymoron",
  "Irony",
];

// ──────────────────────────── GAME 1: VERSE ANALYZER ────────────────────────

function VerseAnalyzer({ config, onGameEnd }: Props) {
  const poem = POEMS[config.difficulty][0];
  const [phase, setPhase] = useState<"idle" | "rhyme" | "devices" | "tone">(
    "idle",
  );
  const [rhymeSelections, setRhymeSelections] = useState<(string | null)[]>(
    new Array(poem.lines.length).fill(null),
  );
  const [rhymeIdx, setRhymeIdx] = useState(0);
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = total > 0 ? (correct / total) * 100 : 0;
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
    [config, correct, total, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  function handleRhyme(label: string) {
    if (feedback) return;
    const isCorrect = label === poem.rhemeScheme[rhymeIdx];
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 100 * config.difficulty);
    }
    const ns = [...rhymeSelections];
    ns[rhymeIdx] = label;
    setRhymeSelections(ns);
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? "Correct rhyme label!"
        : `Wrong. This line rhymes with pattern: ${poem.rhemeScheme[rhymeIdx]}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (rhymeIdx + 1 >= poem.lines.length) setPhase("devices");
      else setRhymeIdx((i) => i + 1);
    }, 1500);
  }

  function handleDevice(device: Device) {
    if (feedback) return;
    const d = poem.devices[deviceIdx];
    const isCorrect = device === d.device;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? `Correct! ${d.explanation}`
        : `Wrong. This is ${d.device}: ${d.explanation}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (deviceIdx + 1 >= poem.devices.length) {
        if (config.difficulty >= 2) setPhase("tone");
        else endGame(true);
      } else setDeviceIdx((i) => i + 1);
    }, 2200);
  }

  function handleTone(opt: string, isTone: boolean) {
    if (feedback) return;
    const correct_val = isTone ? poem.tone : poem.mood;
    const isCorrect = opt === correct_val;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? `Correct ${isTone ? "tone" : "mood"}!`
        : `Wrong. The ${isTone ? "tone" : "mood"} is: ${correct_val}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (!isTone) endGame(true);
    }, 1800);
  }

  const [tonePhase, setTonePhaseDone] = useState(false);
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="poetry_literature.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-[#7c3aed]" />
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
          {timeLeft}s
        </span>
      </div>
      {phase === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
          >
            <BookMarked className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Verse Analyzer
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Read the poem, then identify the rhyme scheme, literary devices,
              tone and mood.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setPhase("rhyme")}
              data-ocid="poetry_literature.start_button"
            >
              Analyze Verse
            </GlowButton>
          </motion.div>
        </div>
      )}
      {(phase === "rhyme" || phase === "devices" || phase === "tone") && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-2xl p-4 neon-top-border shrink-0">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {poem.author}
            </p>
            <h3
              className="text-lg font-black text-[#00f5ff] mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {poem.title}
            </h3>
            <div className="space-y-1">
              {poem.lines.map((line, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-5 text-muted-foreground">
                    {rhymeSelections[i] ?? "?"}
                  </span>
                  <p
                    className={`text-sm italic flex-1 ${phase === "devices" && poem.devices[deviceIdx]?.lineIdx === i ? "text-[#f59e0b]" : "text-foreground"}`}
                  >
                    {phase === "devices"
                      ? line.replace(
                          poem.devices[deviceIdx]?.phrase,
                          `[${poem.devices[deviceIdx]?.phrase}]`,
                        )
                      : line}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${rhymeIdx}-${deviceIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-3"
            >
              {phase === "rhyme" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Label line {rhymeIdx + 1}:{" "}
                    <span className="text-foreground italic">
                      {poem.lines[rhymeIdx]}
                    </span>
                  </p>
                  <p className="text-xs text-[#f59e0b]">
                    What rhyme scheme label does this line get?
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {SCHEME_LABELS.slice(0, 4).map((l) => (
                      <button
                        key={l}
                        type="button"
                        disabled={!!feedback}
                        onClick={() => handleRhyme(l)}
                        className={`w-12 h-12 rounded-xl border text-lg font-black transition-all ${feedback && l === poem.rhemeScheme[rhymeIdx] ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#7c3aed] text-foreground"}`}
                        data-ocid={`poetry_literature.rhyme_label.${l}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {phase === "devices" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    The highlighted phrase:{" "}
                    <span className="text-[#f59e0b] font-bold italic">
                      "{poem.devices[deviceIdx].phrase}"
                    </span>
                  </p>
                  <p className="text-xs text-foreground mb-1">
                    What literary device is this?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEVICE_OPTIONS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        disabled={!!feedback}
                        onClick={() => handleDevice(d)}
                        className={`px-3 py-2 rounded-xl border text-sm font-semibold capitalize transition-all ${feedback && d === poem.devices[deviceIdx].device ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                        data-ocid={`poetry_literature.device.${i + 1}`}
                      >
                        {d.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {phase === "tone" &&
                (!tonePhase ? (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      What is the TONE of this poem?
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tone = the author's attitude
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {poem.toneOptions.map((opt, i) => (
                        <button
                          key={opt}
                          type="button"
                          disabled={!!feedback}
                          onClick={() => {
                            handleTone(opt, true);
                            setTonePhaseDone(true);
                          }}
                          className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${feedback && opt === poem.tone ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`}
                          data-ocid={`poetry_literature.tone.${i + 1}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      What is the MOOD of this poem?
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Mood = how the reader feels
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {poem.moodOptions.map((opt, i) => (
                        <button
                          key={opt}
                          type="button"
                          disabled={!!feedback}
                          onClick={() => handleTone(opt, false)}
                          className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${feedback && opt === poem.mood ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                          data-ocid={`poetry_literature.mood.${i + 1}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ))}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-xl border flex items-start gap-2 ${feedback.ok ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`}
                >
                  {feedback.ok ? (
                    <CheckCircle className="h-4 w-4 text-[#10b981] shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[#f43f5e] shrink-0" />
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
      )}
    </div>
  );
}

// ──────────────────────────── GAME 2: FIGURE OF SPEECH ────────────────────────

function FigureOfSpeech({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 14 : 20;
  const [items] = useState(() =>
    [...FIGURE_ITEMS].sort(() => Math.random() - 0.5).slice(0, count),
  );
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

  function handleAnswer(device: LiteraryDevice) {
    if (feedback || !item) return;
    const ok = device === item.device;
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
      msg: ok
        ? item.explanation
        : `Wrong. This is ${item.device}. ${item.explanation}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= items.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2200);
  }

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="poetry_literature.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <BookMarked className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Figure of Speech
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A phrase from real literature is shown. Identify the literary device
            used.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            {count} phrases — Simile, Metaphor, Personification, Hyperbole,
            Alliteration, Onomatopoeia, Oxymoron, Irony.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="poetry_literature.start_button"
          >
            Identify Devices
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="poetry_literature.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full ${i < lives ? "bg-[#f43f5e]" : "bg-muted"}`}
            />
          ))}
        </div>
        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#f59e0b] transition-all duration-1000"
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
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {item.source}
            </p>
            <p className="text-xl font-bold text-foreground italic">
              {item.phrase}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Which literary device is used?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_LITERARY_DEVICES.map((d, i) => (
              <button
                key={d}
                type="button"
                disabled={!!feedback}
                onClick={() => handleAnswer(d)}
                className={`px-3 py-3 rounded-xl border text-sm font-bold transition-all ${feedback ? (d === item.device ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                data-ocid={`poetry_literature.figure_option.${i + 1}`}
              >
                {d}
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

// ──────────────────────────── GAME 3: POEM BUILDER ────────────────────────

function PoemBuilder({ config, onGameEnd }: Props) {
  const pool = POEM_BUILD_ITEMS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [poemIdx, setPoemIdx] = useState(0);
  const [selections, setSelections] = useState<(string | null)[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
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
  const poemItem = pool[poemIdx];

  function initPoem(i: number) {
    setSelections(new Array(pool[i].slots.length).fill(null));
    setActiveSlot(null);
    setSubmitted(false);
    setResultMsg("");
  }

  function handleStart() {
    initPoem(0);
    setStarted(true);
    startTime.current = Date.now();
  }

  function selectWord(word: string) {
    if (activeSlot === null || submitted) return;
    const next = [...selections];
    next[activeSlot] = word;
    setSelections(next);
    // auto advance
    let nextEmpty = -1;
    for (let i = activeSlot + 1; i < next.length; i++) {
      if (!next[i]) {
        nextEmpty = i;
        break;
      }
    }
    if (nextEmpty === -1)
      for (let i = 0; i < activeSlot; i++) {
        if (!next[i]) {
          nextEmpty = i;
          break;
        }
      }
    setActiveSlot(nextEmpty);
  }

  function submitPoem() {
    if (submitted || !poemItem) return;
    const allCorrect = poemItem.slots.every(
      (slot, i) => selections[i] === slot.correctWord,
    );
    const correctCount = poemItem.slots.filter(
      (slot, i) => selections[i] === slot.correctWord,
    ).length;
    const pts = correctCount * 100 * config.difficulty;
    setScore((s) => s + pts);
    if (allCorrect) setCorrect((c) => c + 1);
    setSubmitted(true);
    setResultMsg(
      allCorrect
        ? `All words correct! Perfect rhyme scheme ${poemItem.rhymeScheme}. +${pts} pts`
        : `${correctCount}/${poemItem.slots.length} correct. Check the rhyme scheme and try again next time.`,
    );
    setTimeout(() => {
      if (poemIdx + 1 >= pool.length) endGame(true);
      else {
        setPoemIdx((i) => i + 1);
        initPoem(poemIdx + 1);
      }
    }, 3500);
  }

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="poetry_literature.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <BookMarked className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Poem Builder
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A theme is given. Complete the poem by selecting rhyming words from
            the word bank.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Follow the ABAB rhyme scheme. Each slot shows which rhyme group it
            belongs to.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={handleStart}
            data-ocid="poetry_literature.start_button"
          >
            Build a Poem
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  const activeSlotData =
    activeSlot !== null ? poemItem.slots[activeSlot] : null;
  const allFilled = selections.every((s) => s !== null);

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="poetry_literature.page"
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
          {poemIdx + 1}/{pool.length} — {timeLeft}s
        </span>
      </div>
      <div className="glass-card rounded-xl p-4 border border-[#10b981]/30">
        <p className="text-xs uppercase tracking-widest text-[#10b981] mb-2">
          Theme: {poemItem.theme} — Scheme: {poemItem.rhymeScheme}
        </p>
        {poemItem.slots.map((slot, i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono w-4 text-[#f59e0b]">
              {slot.rhymeLetter}
            </span>
            <button
              type="button"
              onClick={() => {
                if (!submitted) setActiveSlot(i);
              }}
              className={`flex-1 text-left text-sm px-3 py-1.5 rounded-lg border transition-all ${activeSlot === i ? "border-[#10b981] bg-[#10b981]/10" : "border-border/30"} ${submitted && selections[i] === slot.correctWord ? "text-[#10b981]" : submitted ? "text-[#f43f5e]" : "text-foreground"}`}
              data-ocid={`poetry_literature.poem_slot.${i + 1}`}
            >
              {slot.template
                .replace(/ \(.*\)/, "")
                .replace("___", selections[i] ? `[${selections[i]}]` : "[___]")}
            </button>
          </div>
        ))}
      </div>
      {activeSlotData && !submitted && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Select a word for slot {activeSlot !== null ? activeSlot + 1 : ""}{" "}
            (rhyme group {activeSlotData.rhymeLetter}):
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSlotData.wordBank.map((word, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectWord(word)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${selections[activeSlot ?? 0] === word ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`}
                data-ocid={`poetry_literature.word_choice.${i + 1}`}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
      {resultMsg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border ${resultMsg.includes("All") ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f59e0b]/40 bg-[#f59e0b]/10"}`}
        >
          <p
            className={`text-sm ${resultMsg.includes("All") ? "text-[#10b981]" : "text-[#f59e0b]"}`}
          >
            {resultMsg}
          </p>
        </motion.div>
      )}
      {!submitted && (
        <GlowButton
          variant="primary"
          onClick={submitPoem}
          disabled={!allFilled}
          data-ocid="poetry_literature.submit_poem_button"
        >
          Submit Poem
        </GlowButton>
      )}
    </div>
  );
}

// ──────────────────────────── MAIN EXPORT ────────────────────────

export default function PoetryLiterature({ config, onGameEnd }: Props) {
  if (config.gameId === "figure-of-speech")
    return <FigureOfSpeech config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "poem-builder")
    return <PoemBuilder config={config} onGameEnd={onGameEnd} />;
  return <VerseAnalyzer config={config} onGameEnd={onGameEnd} />;
}
