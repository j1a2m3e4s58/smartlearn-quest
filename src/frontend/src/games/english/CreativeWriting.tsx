import { GlowButton } from "@/components/ui/GlowButton";
import { BookOpen, CheckCircle, Star, XCircle } from "lucide-react";
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

// ─── GAME 1: Story Forge (original) ──────────────────────────────────────────────
type WordType = "VERB" | "NOUN" | "ADJECTIVE" | "ADVERB" | "PLACE" | "PERSON";
interface WordOption {
  word: string;
  quality: "common" | "uncommon" | "precise";
  score: number;
}
interface TemplateSlot {
  id: number;
  type: WordType;
  label: string;
}
interface StoryTemplate {
  title: string;
  parts: string[];
  slots: TemplateSlot[];
  coherenceHint: string;
  wordBanks: Record<WordType, WordOption[]>;
}

const TEMPLATES: Record<1 | 2 | 3, StoryTemplate[]> = {
  1: [
    {
      title: "The Lost Explorer",
      parts: [
        "The ",
        " explorer ",
        " through the dense jungle, searching for the legendary ",
        " of ",
        ". Suddenly, a ",
        " creature blocked the path.",
      ],
      slots: [
        { id: 0, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 1, type: "VERB", label: "VERB" },
        { id: 2, type: "NOUN", label: "NOUN" },
        { id: 3, type: "PLACE", label: "PLACE" },
        { id: 4, type: "ADJECTIVE", label: "ADJECTIVE" },
      ],
      coherenceHint: "brave, crept, temple, Eldoria, enormous",
      wordBanks: {
        VERB: [
          { word: "went", quality: "common", score: 10 },
          { word: "moved", quality: "common", score: 10 },
          { word: "crept", quality: "uncommon", score: 20 },
          { word: "navigated", quality: "uncommon", score: 20 },
          { word: "traversed", quality: "precise", score: 30 },
          { word: "forged ahead", quality: "precise", score: 30 },
        ],
        NOUN: [
          { word: "thing", quality: "common", score: 10 },
          { word: "place", quality: "common", score: 10 },
          { word: "temple", quality: "uncommon", score: 20 },
          { word: "relic", quality: "uncommon", score: 20 },
          { word: "sanctum", quality: "precise", score: 30 },
          { word: "artifact", quality: "precise", score: 30 },
        ],
        ADJECTIVE: [
          { word: "good", quality: "common", score: 10 },
          { word: "nice", quality: "common", score: 10 },
          { word: "brave", quality: "uncommon", score: 20 },
          { word: "enormous", quality: "uncommon", score: 20 },
          { word: "intrepid", quality: "precise", score: 30 },
          { word: "colossal", quality: "precise", score: 30 },
        ],
        ADVERB: [
          { word: "quickly", quality: "common", score: 10 },
          { word: "slowly", quality: "common", score: 10 },
          { word: "cautiously", quality: "uncommon", score: 20 },
          { word: "stealthily", quality: "precise", score: 30 },
          { word: "methodically", quality: "precise", score: 30 },
          { word: "relentlessly", quality: "precise", score: 30 },
        ],
        PLACE: [
          { word: "somewhere", quality: "common", score: 10 },
          { word: "a land", quality: "common", score: 10 },
          { word: "Eldoria", quality: "uncommon", score: 20 },
          { word: "Kael's Reach", quality: "uncommon", score: 20 },
          { word: "the Sunken Realm", quality: "precise", score: 30 },
          { word: "the Shattered Isles", quality: "precise", score: 30 },
        ],
        PERSON: [
          { word: "man", quality: "common", score: 10 },
          { word: "woman", quality: "common", score: 10 },
          { word: "scholar", quality: "uncommon", score: 20 },
          { word: "cartographer", quality: "precise", score: 30 },
          { word: "archaeologist", quality: "precise", score: 30 },
          { word: "wayfarer", quality: "precise", score: 30 },
        ],
      },
    },
    {
      title: "The Night Market",
      parts: [
        "At the ",
        " market, the ",
        " vendor ",
        " rare spices onto a ",
        " cloth. The aroma was ",
        " and made every passerby stop.",
      ],
      slots: [
        { id: 0, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 1, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 2, type: "VERB", label: "VERB" },
        { id: 3, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 4, type: "ADJECTIVE", label: "ADJECTIVE" },
      ],
      coherenceHint: "midnight, weathered, arranged, crimson, intoxicating",
      wordBanks: {
        VERB: [
          { word: "put", quality: "common", score: 10 },
          { word: "placed", quality: "common", score: 10 },
          { word: "arranged", quality: "uncommon", score: 20 },
          { word: "displayed", quality: "uncommon", score: 20 },
          { word: "meticulously arranged", quality: "precise", score: 30 },
          { word: "curated", quality: "precise", score: 30 },
        ],
        NOUN: [
          { word: "thing", quality: "common", score: 10 },
          { word: "item", quality: "common", score: 10 },
          { word: "spice jar", quality: "uncommon", score: 20 },
          { word: "mortar", quality: "precise", score: 30 },
          { word: "pestle", quality: "precise", score: 30 },
          { word: "porcelain bowl", quality: "precise", score: 30 },
        ],
        ADJECTIVE: [
          { word: "nice", quality: "common", score: 10 },
          { word: "old", quality: "common", score: 10 },
          { word: "midnight", quality: "uncommon", score: 20 },
          { word: "weathered", quality: "uncommon", score: 20 },
          { word: "intoxicating", quality: "precise", score: 30 },
          { word: "crimson", quality: "precise", score: 30 },
        ],
        ADVERB: [
          { word: "quickly", quality: "common", score: 10 },
          { word: "slowly", quality: "common", score: 10 },
          { word: "carefully", quality: "uncommon", score: 20 },
          { word: "precisely", quality: "precise", score: 30 },
          { word: "reverently", quality: "precise", score: 30 },
          { word: "deftly", quality: "precise", score: 30 },
        ],
        PLACE: [
          { word: "a town", quality: "common", score: 10 },
          { word: "the city", quality: "common", score: 10 },
          { word: "the bazaar", quality: "uncommon", score: 20 },
          { word: "the souq", quality: "precise", score: 30 },
          { word: "the midnight quarter", quality: "precise", score: 30 },
          { word: "the lantern district", quality: "precise", score: 30 },
        ],
        PERSON: [
          { word: "person", quality: "common", score: 10 },
          { word: "seller", quality: "common", score: 10 },
          { word: "trader", quality: "uncommon", score: 20 },
          { word: "merchant", quality: "uncommon", score: 20 },
          { word: "apothecary", quality: "precise", score: 30 },
          { word: "purveyor", quality: "precise", score: 30 },
        ],
      },
    },
  ],
  2: [
    {
      title: "The Algorithm's Edge",
      parts: [
        "The ",
        " scientist ",
        " through terabytes of data to uncover a ",
        " pattern hidden inside ",
        " neural weights. The discovery would ",
        " the industry.",
      ],
      slots: [
        { id: 0, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 1, type: "VERB", label: "VERB" },
        { id: 2, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 3, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 4, type: "VERB", label: "VERB" },
      ],
      coherenceHint: "tenacious, sifted, anomalous, corrupted, disrupt",
      wordBanks: {
        VERB: [
          { word: "looked", quality: "common", score: 10 },
          { word: "searched", quality: "common", score: 10 },
          { word: "sifted", quality: "uncommon", score: 20 },
          { word: "excavated", quality: "uncommon", score: 20 },
          { word: "parsed", quality: "precise", score: 30 },
          { word: "distilled", quality: "precise", score: 30 },
        ],
        NOUN: [
          { word: "result", quality: "common", score: 10 },
          { word: "finding", quality: "common", score: 10 },
          { word: "anomaly", quality: "uncommon", score: 20 },
          { word: "paradigm", quality: "precise", score: 30 },
          { word: "inflection point", quality: "precise", score: 30 },
          { word: "emergent property", quality: "precise", score: 30 },
        ],
        ADJECTIVE: [
          { word: "smart", quality: "common", score: 10 },
          { word: "clever", quality: "common", score: 10 },
          { word: "tenacious", quality: "uncommon", score: 20 },
          { word: "anomalous", quality: "uncommon", score: 20 },
          { word: "corrupted", quality: "precise", score: 30 },
          { word: "serendipitous", quality: "precise", score: 30 },
        ],
        ADVERB: [
          { word: "quickly", quality: "common", score: 10 },
          { word: "slowly", quality: "common", score: 10 },
          { word: "methodically", quality: "uncommon", score: 20 },
          { word: "exhaustively", quality: "precise", score: 30 },
          { word: "recursively", quality: "precise", score: 30 },
          { word: "iteratively", quality: "precise", score: 30 },
        ],
        PLACE: [
          { word: "a lab", quality: "common", score: 10 },
          { word: "a facility", quality: "common", score: 10 },
          { word: "the research campus", quality: "uncommon", score: 20 },
          { word: "the compute cluster", quality: "precise", score: 30 },
          { word: "the inference pipeline", quality: "precise", score: 30 },
          { word: "the tensor core array", quality: "precise", score: 30 },
        ],
        PERSON: [
          { word: "worker", quality: "common", score: 10 },
          { word: "researcher", quality: "common", score: 10 },
          { word: "scientist", quality: "uncommon", score: 20 },
          { word: "data engineer", quality: "precise", score: 30 },
          { word: "ML architect", quality: "precise", score: 30 },
          { word: "principal investigator", quality: "precise", score: 30 },
        ],
      },
    },
  ],
  3: [
    {
      title: "The Vanishing Codex",
      parts: [
        "The ",
        " archivist ",
        " through centuries of ",
        " manuscripts, convinced the ",
        " codex held a ",
        " formula capable of rewriting cryptographic history.",
      ],
      slots: [
        { id: 0, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 1, type: "VERB", label: "VERB" },
        { id: 2, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 3, type: "ADJECTIVE", label: "ADJECTIVE" },
        { id: 4, type: "ADJECTIVE", label: "ADJECTIVE" },
      ],
      coherenceHint: "obsessive, combed, encrypted, elusive, irreversible",
      wordBanks: {
        VERB: [
          { word: "read", quality: "common", score: 10 },
          { word: "searched", quality: "common", score: 10 },
          { word: "combed", quality: "uncommon", score: 20 },
          { word: "pored over", quality: "uncommon", score: 20 },
          { word: "excavated", quality: "precise", score: 30 },
          { word: "deciphered", quality: "precise", score: 30 },
        ],
        NOUN: [
          { word: "book", quality: "common", score: 10 },
          { word: "document", quality: "common", score: 10 },
          { word: "codex", quality: "uncommon", score: 20 },
          { word: "grimoire", quality: "precise", score: 30 },
          { word: "palimpsest", quality: "precise", score: 30 },
          { word: "cryptographic folio", quality: "precise", score: 30 },
        ],
        ADJECTIVE: [
          { word: "old", quality: "common", score: 10 },
          { word: "hidden", quality: "common", score: 10 },
          { word: "encrypted", quality: "uncommon", score: 20 },
          { word: "elusive", quality: "uncommon", score: 20 },
          { word: "irreversible", quality: "precise", score: 30 },
          { word: "obsessive", quality: "precise", score: 30 },
        ],
        ADVERB: [
          { word: "quickly", quality: "common", score: 10 },
          { word: "slowly", quality: "common", score: 10 },
          { word: "obsessively", quality: "uncommon", score: 20 },
          { word: "feverishly", quality: "precise", score: 30 },
          { word: "systematically", quality: "precise", score: 30 },
          { word: "tenaciously", quality: "precise", score: 30 },
        ],
        PLACE: [
          { word: "a vault", quality: "common", score: 10 },
          { word: "a library", quality: "common", score: 10 },
          { word: "the archive", quality: "uncommon", score: 20 },
          { word: "the scriptorum", quality: "precise", score: 30 },
          { word: "the restricted stacks", quality: "precise", score: 30 },
          {
            word: "the climate-controlled vault",
            quality: "precise",
            score: 30,
          },
        ],
        PERSON: [
          { word: "person", quality: "common", score: 10 },
          { word: "librarian", quality: "common", score: 10 },
          { word: "archivist", quality: "uncommon", score: 20 },
          { word: "cryptanalyst", quality: "precise", score: 30 },
          { word: "manuscript curator", quality: "precise", score: 30 },
          { word: "philologist", quality: "precise", score: 30 },
        ],
      },
    },
  ],
};

const QUALITY_COLORS: Record<WordOption["quality"], string> = {
  common: "#6b7280",
  uncommon: "#f59e0b",
  precise: "#00f5ff",
};
const QUALITY_LABELS: Record<WordOption["quality"], string> = {
  common: "Common",
  uncommon: "Uncommon",
  precise: "Precise",
};

// ─── GAME 2: Descriptive Painter data ────────────────────────────────────────────
interface DescriptiveSentence {
  plain: string;
  verbOptions: string[];
  bestVerb: string;
  adjOptions: string[];
  bestAdjs: string[];
  sensoryOptions: string[];
  bestSensory: string;
  enhancedTemplate: string;
}

const DESCRIPTIVE_SENTENCES: DescriptiveSentence[] = [
  {
    plain: "The dog ran.",
    verbOptions: [
      "bolted",
      "trotted",
      "shuffled",
      "sprinted",
      "strolled",
      "darted",
    ],
    bestVerb: "bolted",
    adjOptions: [
      "large",
      "silver-furred",
      "lean",
      "matted",
      "muscular",
      "weary",
      "spotted",
      "trembling",
    ],
    bestAdjs: ["silver-furred", "lean"],
    sensoryOptions: [
      "its paws barely touching the ground",
      "growling softly",
      "leaving shallow prints in the earth",
      "tail low",
      "panting hard",
      "eyes wild",
    ],
    bestSensory: "its paws barely touching the ground",
    enhancedTemplate: "The {adj1}, {adj2} dog {verb} past, {sensory}.",
  },
  {
    plain: "She opened the door.",
    verbOptions: [
      "wrenched open",
      "nudged open",
      "eased open",
      "flung open",
      "inched open",
      "heaved open",
    ],
    bestVerb: "eased open",
    adjOptions: [
      "heavy",
      "ancient",
      "warped",
      "iron-bound",
      "creaking",
      "splintered",
      "painted",
      "narrow",
    ],
    bestAdjs: ["heavy", "creaking"],
    sensoryOptions: [
      "hinges groaning in protest",
      "letting cold air rush in",
      "flooding the hallway with pale light",
      "dust motes swirling",
      "revealing a dark corridor beyond",
      "with careful deliberation",
    ],
    bestSensory: "hinges groaning in protest",
    enhancedTemplate: "She {verb} the {adj1}, {adj2} door, {sensory}.",
  },
  {
    plain: "The food tasted bad.",
    verbOptions: [
      "reeked",
      "curdled on the tongue",
      "revolted",
      "tasted rancid",
      "turned her stomach",
      "reeked of decay",
    ],
    bestVerb: "curdled on the tongue",
    adjOptions: [
      "sour",
      "gelatinous",
      "fermented",
      "acrid",
      "grey-brown",
      "watery",
      "overcooked",
      "pungent",
    ],
    bestAdjs: ["acrid", "fermented"],
    sensoryOptions: [
      "leaving a bitter residue at the back of her throat",
      "coating her mouth with grease",
      "her face contorting involuntarily",
      "she pushed the plate away",
      "its smell still rising from the bowl",
      "and she set her spoon down slowly",
    ],
    bestSensory: "leaving a bitter residue at the back of her throat",
    enhancedTemplate: "The {adj1}, {adj2} stew {verb}, {sensory}.",
  },
  {
    plain: "It rained.",
    verbOptions: [
      "hammered down",
      "drizzled",
      "lashed",
      "pelted",
      "trickled",
      "cascaded",
    ],
    bestVerb: "hammered down",
    adjOptions: [
      "relentless",
      "cold",
      "grey",
      "warm",
      "acid",
      "silver",
      "sideways",
      "frozen",
    ],
    bestAdjs: ["relentless", "cold"],
    sensoryOptions: [
      "drumming a violent rhythm on the corrugated roof",
      "pooling in muddy lakes across the courtyard",
      "soaking through fabric instantly",
      "drowning the street noise",
      "reducing visibility to a few metres",
      "streaming down the glass in rivulets",
    ],
    bestSensory: "drumming a violent rhythm on the corrugated roof",
    enhancedTemplate: "The {adj1}, {adj2} rain {verb}, {sensory}.",
  },
  {
    plain: "The room was quiet.",
    verbOptions: [
      "lay perfectly still",
      "settled into silence",
      "held its breath",
      "breathed with a low hum",
      "fell silent",
      "stretched in hush",
    ],
    bestVerb: "held its breath",
    adjOptions: [
      "dim",
      "close",
      "heavy",
      "dust-laden",
      "curtained",
      "bare",
      "clinical",
      "amber-lit",
    ],
    bestAdjs: ["dim", "close"],
    sensoryOptions: [
      "the only sound a distant clock ticking",
      "even the air seemed reluctant to move",
      "every surface absorbing sound",
      "her own breathing suddenly loud",
      "the stillness pressing against her eardrums",
      "nothing but the slow creak of the building settling",
    ],
    bestSensory: "the only sound a distant clock ticking",
    enhancedTemplate: "The {adj1}, {adj2} room {verb}, {sensory}.",
  },
  {
    plain: "He walked slowly.",
    verbOptions: [
      "shuffled",
      "ambled",
      "trudged",
      "dragged himself",
      "plodded",
      "meandered",
    ],
    bestVerb: "trudged",
    adjOptions: [
      "hunched",
      "broad-shouldered",
      "hollow-eyed",
      "gaunt",
      "stooped",
      "mud-streaked",
      "grey-faced",
      "thin",
    ],
    bestAdjs: ["hunched", "hollow-eyed"],
    sensoryOptions: [
      "each step an effort negotiated with failing joints",
      "his shoes scraping concrete in a slow drag",
      "leaving a trail of damp footprints",
      "one hand trailing the wall for support",
      "eyes fixed on the ground",
      "breath visible in the cold air",
    ],
    bestSensory: "each step an effort negotiated with failing joints",
    enhancedTemplate: "The {adj1}, {adj2} man {verb} forward, {sensory}.",
  },
  {
    plain: "The city was busy.",
    verbOptions: [
      "pulsed",
      "churned",
      "roared",
      "surged",
      "hummed",
      "vibrated",
    ],
    bestVerb: "pulsed",
    adjOptions: [
      "dense",
      "clamorous",
      "relentless",
      "glittering",
      "smoke-filled",
      "humid",
      "teeming",
      "fractured",
    ],
    bestAdjs: ["dense", "teeming"],
    sensoryOptions: [
      "horns, voices, and machinery layering into a single deafening presence",
      "its thousand smells indistinguishable from one another",
      "figures flowing like tributaries between the towers",
      "every surface vibrating with motion",
      "the sky above it orange with reflected light",
      "a living organism too large to comprehend",
    ],
    bestSensory:
      "horns, voices, and machinery layering into a single deafening presence",
    enhancedTemplate: "The {adj1}, {adj2} city {verb}, {sensory}.",
  },
  {
    plain: "The child laughed.",
    verbOptions: [
      "erupted into laughter",
      "dissolved into giggles",
      "shrieked with delight",
      "cackled",
      "bubbled over",
      "collapsed laughing",
    ],
    bestVerb: "erupted into laughter",
    adjOptions: [
      "small",
      "gap-toothed",
      "bright-eyed",
      "sun-browned",
      "barefoot",
      "crinkle-faced",
      "tiny",
      "round-cheeked",
    ],
    bestAdjs: ["gap-toothed", "bright-eyed"],
    sensoryOptions: [
      "throwing her head back until she lost balance",
      "her whole body convulsing with it",
      "unable to speak between gasps",
      "clutching her stomach",
      "tears beginning to form at the corners of her eyes",
      "infectious enough to silence the room and then fill it",
    ],
    bestSensory: "her whole body convulsing with it",
    enhancedTemplate: "The {adj1}, {adj2} child {verb}, {sensory}.",
  },
  {
    plain: "The sea looked big.",
    verbOptions: [
      "stretched",
      "heaved",
      "rolled",
      "expanded",
      "surged",
      "yawned",
    ],
    bestVerb: "heaved",
    adjOptions: [
      "vast",
      "ink-dark",
      "steel-grey",
      "phosphorescent",
      "deep-green",
      "fathomless",
      "slate",
      "restless",
    ],
    bestAdjs: ["ink-dark", "fathomless"],
    sensoryOptions: [
      "its horizon indistinguishable from the sky",
      "the smell of brine sharp enough to taste",
      "every wave building slowly before breaking into white",
      "swallowing the ship in its perspective",
      "a low constant roar beneath the wind",
      "cold spray reaching even the highest deck",
    ],
    bestSensory: "its horizon indistinguishable from the sky",
    enhancedTemplate: "The {adj1}, {adj2} sea {verb}, {sensory}.",
  },
  {
    plain: "The music was loud.",
    verbOptions: [
      "thundered",
      "reverberated",
      "vibrated",
      "detonated",
      "shook the room",
      "saturated the air",
    ],
    bestVerb: "thundered",
    adjOptions: [
      "pounding",
      "distorted",
      "low",
      "driving",
      "bass-heavy",
      "immersive",
      "relentless",
      "wall-shaking",
    ],
    bestAdjs: ["pounding", "bass-heavy"],
    sensoryOptions: [
      "the floor trembling beneath her feet",
      "conversation impossible within its range",
      "felt in the chest rather than just heard",
      "compressing the air in the room",
      "every surface of the building conducting the beat",
      "thoughts dissolving in its frequency",
    ],
    bestSensory: "felt in the chest rather than just heard",
    enhancedTemplate: "The {adj1}, {adj2} music {verb}, {sensory}.",
  },
];

// ─── GAME 3: Dialogue Writer data ──────────────────────────────────────────────
interface DialogueScene {
  scene: string;
  charA: { name: string; trait: string };
  charB: { name: string; trait: string };
  dialogueOptions: {
    text: string;
    speaker: "A" | "B";
    correct: boolean;
    reason: string;
  }[];
  punctQuestions: {
    question: string;
    options: string[];
    correctIdx: number;
    explanation: string;
  }[];
}

const DIALOGUE_SCENES: DialogueScene[] = [
  {
    scene:
      "Two students discover a locked room in their school that has been sealed for 30 years.",
    charA: { name: "Kofi", trait: "Impulsive and brave" },
    charB: { name: "Ama", trait: "Cautious and analytical" },
    dialogueOptions: [
      {
        text: "Kofi: 'Come on, let's break it open! Whatever is in there must be amazing!'",
        speaker: "A",
        correct: true,
        reason:
          "Fits Kofi's impulsive bravery and advances the scene with energy.",
      },
      {
        text: "Kofi: 'I think we should report this to the headmaster and wait for guidance.'",
        speaker: "A",
        correct: false,
        reason:
          "Too cautious for an impulsive character — sounds like Ama's voice.",
      },
      {
        text: "Ama: 'Before we do anything, we need to find out who sealed this room and why. There could be a reason it was locked.'",
        speaker: "B",
        correct: true,
        reason:
          "Perfectly fits Ama's analytical caution and creates tension with Kofi's urgency.",
      },
      {
        text: "Ama: 'Yes! Let's go in right now before anyone sees us!'",
        speaker: "B",
        correct: false,
        reason:
          "Too reckless for a cautious character — this is Kofi's voice, not Ama's.",
      },
    ],
    punctQuestions: [
      {
        question: "Where does the comma go in: 'Kofi said let me try'",
        options: [
          "Kofi said, let me try",
          "Kofi, said let me try",
          "Kofi said let, me try",
          "Kofi said let me, try",
        ],
        correctIdx: 0,
        explanation:
          "A comma follows the speech tag before the direct speech begins.",
      },
      {
        question: "Which uses correct speech marks?",
        options: [
          "Ama said, 'This is strange.'",
          "Ama 'said This is strange.'",
          "Ama said This is 'strange.'",
          "'Ama said This is strange.'",
        ],
        correctIdx: 0,
        explanation:
          "Speech marks enclose only the spoken words, after the speech tag and comma.",
      },
      {
        question: "A new speaker means:",
        options: [
          "A new paragraph",
          "A new sentence in the same paragraph",
          "A longer sentence",
          "Capital letters",
        ],
        correctIdx: 0,
        explanation:
          "Every change of speaker starts a new paragraph in correctly formatted dialogue.",
      },
    ],
  },
  {
    scene:
      "A student has missed a group deadline and must explain themselves to the group leader.",
    charA: { name: "Yaw", trait: "Direct and principled" },
    charB: { name: "Efua", trait: "Defensive and emotional" },
    dialogueOptions: [
      {
        text: "Yaw: 'I needed your section yesterday. The whole group has been affected by this. What happened?'",
        speaker: "A",
        correct: true,
        reason:
          "Direct, factual, holds accountability without aggression. True to Yaw's principled voice.",
      },
      {
        text: "Yaw: 'It is okay, these things happen. We will fix it together.'",
        speaker: "A",
        correct: false,
        reason:
          "Too forgiving for a direct, principled character who has been let down.",
      },
      {
        text: "Efua: 'I know, I know! You don't have to keep going on about it. I had problems this week, okay?'",
        speaker: "B",
        correct: true,
        reason:
          "Defensive and emotionally reactive — authentic to Efua's established voice.",
      },
      {
        text: "Efua: 'You are completely right. I take full responsibility and I am deeply sorry.'",
        speaker: "B",
        correct: false,
        reason:
          "Too composed and accountable for a defensive, emotional character.",
      },
    ],
    punctQuestions: [
      {
        question: "In dialogue, a question mark replaces:",
        options: [
          "The comma before the closing speech mark",
          "The full stop inside the speech mark",
          "The capital letter after the speech mark",
          "The speech mark itself",
        ],
        correctIdx: 0,
        explanation:
          "The question mark or exclamation mark replaces the usual full stop inside the closing speech mark.",
      },
      {
        question: "Which is correctly punctuated?",
        options: [
          "'What happened?' asked Yaw.",
          "'What happened?' Asked Yaw.",
          "'What happened,' asked Yaw.",
          "'What happened'. Asked Yaw.",
        ],
        correctIdx: 0,
        explanation:
          "The question mark inside the speech marks, lowercase continuation for the attribution.",
      },
      {
        question: "New paragraph for new speaker because:",
        options: [
          "Readers track who is speaking more easily",
          "It looks better on the page",
          "It is a grammar rule with no practical reason",
          "It signals a scene change",
        ],
        correctIdx: 0,
        explanation:
          "The new paragraph rule exists specifically to help readers track changes of speaker without confusion.",
      },
    ],
  },
  {
    scene:
      "Two scientists disagree about which experiment to run next with limited resources.",
    charA: { name: "Dr Nyarko", trait: "Methodical and evidence-driven" },
    charB: { name: "Dr Ampah", trait: "Intuitive and risk-taking" },
    dialogueOptions: [
      {
        text: "Dr Nyarko: 'We should follow the data. The baseline trial gives us the cleanest variables. Rushing ahead risks the integrity of the whole study.'",
        speaker: "A",
        correct: true,
        reason:
          "Methodical, cites evidence and process risk. Fully fits Dr Nyarko's character.",
      },
      {
        text: "Dr Nyarko: 'Your instinct might be right. Let us take the chance.'s worth trying.'",
        speaker: "A",
        correct: false,
        reason:
          "Abandons evidence-driven character to validate an intuitive decision — wrong voice.",
      },
      {
        text: "Dr Ampah: 'Sometimes science needs a leap. If we wait for perfect conditions, we will never make the discovery.'",
        speaker: "B",
        correct: true,
        reason:
          "Risk-taking, passionate, challenges the methodical approach. Authentic to Dr Ampah.",
      },
      {
        text: "Dr Ampah: 'I agree with you. The data clearly supports the baseline approach.'",
        speaker: "B",
        correct: false,
        reason:
          "Entirely contradicts the intuitive, risk-taking character trait established.",
      },
    ],
    punctQuestions: [
      {
        question: "Which correctly continues dialogue after a speech tag?",
        options: [
          "Dr Nyarko said, 'The baseline is essential.'",
          "Dr Nyarko said 'The baseline is essential.'",
          "Dr Nyarko said, 'the baseline is essential.'",
          "Dr Nyarko said 'the baseline is essential'",
        ],
        correctIdx: 0,
        explanation:
          "Comma after speech tag, capital letter to open speech, closing punctuation inside speech marks.",
      },
      {
        question: "An interrupted sentence in dialogue uses:",
        options: [
          "An em dash or ellipsis",
          "A comma",
          "A full stop",
          "A semicolon",
        ],
        correctIdx: 0,
        explanation:
          "Interruptions use an em dash (—) or ellipsis (...) to show the speech was cut off.",
      },
      {
        question:
          "When the attribution follows the speech, the speech ends with:",
        options: [
          "A comma inside the speech marks",
          "A full stop inside the speech marks",
          "A full stop after the speech marks",
          "Nothing",
        ],
        correctIdx: 0,
        explanation:
          "When dialogue is followed by an attribution, a comma (not full stop) closes the speech.",
      },
    ],
  },
  {
    scene:
      "Two students are deciding whether to tell the truth about a broken school trophy.",
    charA: { name: "Adjoa", trait: "Honest and morally courageous" },
    charB: { name: "Mensah", trait: "Pragmatic and self-preserving" },
    dialogueOptions: [
      {
        text: "Adjoa: 'We have to tell the truth. It is the only right thing to do, even if it means getting into trouble.'",
        speaker: "A",
        correct: true,
        reason:
          "Honest, morally clear, faces consequences. True to Adjoa's established character.",
      },
      {
        text: "Adjoa: 'No one saw us. We can just say it was already broken when we arrived.'",
        speaker: "A",
        correct: false,
        reason:
          "Completely contradicts the honest, morally courageous character.",
      },
      {
        text: "Mensah: 'Think about it practically — if we keep quiet, we get through this without consequences. The trophy can be replaced.'",
        speaker: "B",
        correct: true,
        reason:
          "Calculative, weighs personal cost, typical of a pragmatic self-preserving character.",
      },
      {
        text: "Mensah: 'You are right. Let us confess straight away and accept whatever happens.'",
        speaker: "B",
        correct: false,
        reason: "Too morally pure for a pragmatic, self-preserving character.",
      },
    ],
    punctQuestions: [
      {
        question: "Which shows correct use of a speech tag mid-sentence?",
        options: [
          "'We have to,' said Adjoa, 'tell the truth.'",
          "'We have to' said Adjoa 'tell the truth.'",
          "'We have to,' Said Adjoa, 'tell the truth.'",
          "'We have to,' said Adjoa 'tell the truth.'",
        ],
        correctIdx: 0,
        explanation:
          "Comma inside speech before interrupting tag, lowercase tag, comma after tag, lowercase continuation.",
      },
      {
        question: "Speech marks are used for:",
        options: [
          "Exact spoken words only",
          "Thoughts and spoken words",
          "All quoted material",
          "Titles of books",
        ],
        correctIdx: 0,
        explanation:
          "In dialogue, speech marks enclose exact spoken words. Thoughts use italics or free indirect style.",
      },
      {
        question: "After closing speech marks, the attribution:",
        options: [
          "Begins with a lowercase letter unless it is a proper noun",
          "Always begins with a capital letter",
          "Is not needed if the speaker is clear",
          "Comes before the speech only",
        ],
        correctIdx: 0,
        explanation:
          "The attribution after speech marks continues with lowercase unless a proper name follows.",
      },
    ],
  },
  {
    scene: "A parent and child negotiate screen time rules at home.",
    charA: { name: "Parent", trait: "Firm but fair" },
    charB: { name: "Teen", trait: "Passionate and argumentative" },
    dialogueOptions: [
      {
        text: "Parent: 'Two hours on school nights is the limit. I understand you want more, but sleep and homework come first. We can discuss weekends separately.'",
        speaker: "A",
        correct: true,
        reason:
          "Firm, sets a clear boundary, acknowledges the teen's position, offers a negotiation space. Fits the character.",
      },
      {
        text: "Parent: 'Fine, three hours then. Whatever makes you happy.'",
        speaker: "A",
        correct: false,
        reason:
          "Too permissive and emotionally driven for a firm but fair character.",
      },
      {
        text: "Teen: 'That is completely unfair! Everyone in my class has unlimited screen time and I am being held to a different standard for no reason.'",
        speaker: "B",
        correct: true,
        reason:
          "Passionate, uses peer comparison as argument, feels unjustly treated. Authentic to the character.",
      },
      {
        text: "Teen: 'I understand. Two hours is probably sensible given the research on sleep.'",
        speaker: "B",
        correct: false,
        reason:
          "Completely out of character for a passionate, argumentative teen in a heated negotiation.",
      },
    ],
    punctQuestions: [
      {
        question: "Exclamation marks in dialogue should be used:",
        options: [
          "For genuine emotion or strong exclamation only",
          "Frequently to show energy",
          "After every sentence the character says loudly",
          "In place of a full stop always",
        ],
        correctIdx: 0,
        explanation:
          "Overuse of exclamation marks weakens their effect. Reserve them for genuine emotional peaks.",
      },
      {
        question:
          "Which correctly shows a character talking about someone else's speech?",
        options: [
          "'She told me, 'You have to come,'' said the teen.",
          "'She told me you had to come,' said the teen.",
          "She told me 'You have to come' said the teen.",
          "She told me, you have to come, said the teen.",
        ],
        correctIdx: 1,
        explanation:
          "Reported speech does not use speech marks. Only direct quotation within dialogue uses nested marks.",
      },
      {
        question: "'Firm but fair' dialogue is characterised by:",
        options: [
          "Clear statements with some acknowledgement of the other view",
          "Long emotional speeches",
          "Short one-word commands",
          "Endless questions",
        ],
        correctIdx: 0,
        explanation:
          "A firm but fair character states positions clearly, acknowledges the other party, and maintains boundaries — this is what the dialogue structure should reflect.",
      },
    ],
  },
];

export default function CreativeWriting({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // ── Shared ────────────────────────────────────────────────────────────────
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const startTime = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = total > 0 ? (correct / total) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.min(acc, 100),
          Math.floor((Date.now() - startTime.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, total],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;
  const timerBarStyle = { width: `${timePct}%` } as const;

  // ── GAME 1: Story Forge ────────────────────────────────────────────────────────
  const templates = TEMPLATES[config.difficulty];
  const [templateIdx, setTemplateIdx] = useState(0);
  const template = templates[templateIdx % templates.length];
  const [g1Phase, setG1Phase] = useState<"idle" | "play" | "result">("idle");
  const [selections, setSelections] = useState<(WordOption | null)[]>(
    new Array(template.slots.length).fill(null),
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [g1Score, setG1Score] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [lastInserted, setLastInserted] = useState<number | null>(null);

  function startG1() {
    setSelections(new Array(template.slots.length).fill(null));
    setActiveSlot(null);
    setG1Phase("play");
    startTime.current = Date.now();
  }

  function selectWord(word: WordOption) {
    if (activeSlot === null) return;
    const next = [...selections];
    next[activeSlot] = word;
    setSelections(next);
    setLastInserted(activeSlot);
    setTimeout(() => setLastInserted(null), 600);
    let nextEmpty = -1;
    for (let i = activeSlot + 1; i < next.length; i++) {
      if (!next[i]) {
        nextEmpty = i;
        break;
      }
    }
    if (nextEmpty === -1) {
      for (let i = 0; i < activeSlot; i++) {
        if (!next[i]) {
          nextEmpty = i;
          break;
        }
      }
    }
    setActiveSlot(nextEmpty);
  }

  function submitStory() {
    let pts = 0;
    let words = 0;
    selections.forEach((sel) => {
      if (sel) {
        pts += sel.score * config.difficulty;
        words++;
      }
    });
    const preciseCount = selections.filter(
      (s) => s?.quality === "precise",
    ).length;
    if (preciseCount >= 2) pts += 100 * config.difficulty;
    setG1Score((s) => s + pts);
    setScore((s) => s + pts);
    setTotalWords((t) => t + words);
    setTotal((t) => t + words);
    setCorrect((c) => c + preciseCount);
    setG1Phase("result");
  }

  function nextTemplate() {
    const nextIdx = templateIdx + 1;
    if (nextIdx >= templates.length) {
      endGame(true);
      return;
    }
    setTemplateIdx(nextIdx);
    const nextTpl = templates[nextIdx % templates.length];
    setSelections(new Array(nextTpl.slots.length).fill(null));
    setActiveSlot(null);
    setG1Phase("play");
  }

  const allFilled = selections.every((s) => s !== null);

  function buildStoryPreview() {
    const out: React.ReactNode[] = [];
    let slotIdx = 0;
    template.parts.forEach((part, i) => {
      out.push(<span key={`p-${i}`}>{part}</span>);
      if (slotIdx < template.slots.length && i < template.parts.length - 1) {
        const sel = selections[slotIdx];
        const slot = template.slots[slotIdx];
        const slotColor = sel ? QUALITY_COLORS[sel.quality] : "#7c3aed";
        const slotStyle = {
          color: slotColor,
          borderColor: slotColor,
          background: sel ? `${slotColor}18` : "transparent",
        } as const;
        out.push(
          <button
            key={`slot-${slotIdx}`}
            type="button"
            onClick={() => setActiveSlot(slotIdx)}
            className="inline-flex items-center px-2 py-0.5 rounded border font-bold text-sm mx-1 transition-all"
            style={slotStyle}
            data-ocid={`creative_writing.slot.${slotIdx + 1}`}
          >
            {sel ? sel.word : `[${slot.label}]`}
          </button>,
        );
        slotIdx++;
      }
    });
    return out;
  }

  // ── GAME 2: Descriptive Painter ─────────────────────────────────────────────
  const sentenceCount =
    config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 10;
  const [g2Sentences] = useState<DescriptiveSentence[]>(() =>
    [...DESCRIPTIVE_SENTENCES]
      .sort(() => Math.random() - 0.5)
      .slice(0, sentenceCount),
  );
  const [g2Phase, setG2Phase] = useState<"idle" | "playing" | "result">("idle");
  const [g2Idx, setG2Idx] = useState(0);
  const [g2Verb, setG2Verb] = useState<string | null>(null);
  const [g2Adjs, setG2Adjs] = useState<string[]>([]);
  const [g2Sensory, setG2Sensory] = useState<string | null>(null);
  const [g2Submitted, setG2Submitted] = useState(false);
  const usedWords = useRef<Set<string>>(new Set());

  const g2Sentence = g2Sentences[g2Idx];

  function submitG2() {
    if (!g2Verb || g2Adjs.length < 2 || !g2Sensory || !g2Sentence) return;
    const verbCorrect = g2Verb === g2Sentence.bestVerb;
    const adjCorrect = g2Adjs.filter((a) =>
      g2Sentence.bestAdjs.includes(a),
    ).length;
    const sensoryCorrect = g2Sensory === g2Sentence.bestSensory;
    const pts =
      (verbCorrect ? 150 : 30) + adjCorrect * 80 + (sensoryCorrect ? 120 : 30);
    setScore((s) => s + pts * config.difficulty);
    setTotal((t) => t + 4);
    setCorrect(
      (c) => c + (verbCorrect ? 1 : 0) + adjCorrect + (sensoryCorrect ? 1 : 0),
    );
    [g2Verb, ...g2Adjs, g2Sensory].forEach((w) => usedWords.current.add(w));
    setG2Submitted(true);
  }

  function nextG2() {
    if (g2Idx + 1 >= g2Sentences.length) {
      endGame(true);
      return;
    }
    setG2Idx((i) => i + 1);
    setG2Verb(null);
    setG2Adjs([]);
    setG2Sensory(null);
    setG2Submitted(false);
  }

  function buildG2Enhanced() {
    if (!g2Sentence || !g2Verb || g2Adjs.length < 2 || !g2Sensory) return "";
    return g2Sentence.enhancedTemplate
      .replace("{verb}", g2Verb)
      .replace("{adj1}", g2Adjs[0])
      .replace("{adj2}", g2Adjs[1] || "")
      .replace("{sensory}", g2Sensory);
  }

  // ── GAME 3: Dialogue Writer ──────────────────────────────────────────────
  const sceneCount =
    config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const [g3Scenes] = useState<DialogueScene[]>(() =>
    [...DIALOGUE_SCENES].sort(() => Math.random() - 0.5).slice(0, sceneCount),
  );
  const [g3Phase, setG3Phase] = useState<
    "idle" | "dialogue" | "punctuation" | "result"
  >("idle");
  const [g3Idx, setG3Idx] = useState(0);
  const [g3SelectedLines, setG3SelectedLines] = useState<number[]>([]);
  const [g3PunctAnswers, setG3PunctAnswers] = useState<number[]>([]);
  const [g3Submitted, setG3Submitted] = useState(false);
  const [g3PunctSubmitted, setG3PunctSubmitted] = useState(false);

  const g3Scene = g3Scenes[g3Idx];

  function toggleG3Line(i: number) {
    setG3SelectedLines((prev) =>
      prev.includes(i)
        ? prev.filter((x) => x !== i)
        : prev.length < 4
          ? [...prev, i]
          : prev,
    );
  }

  function submitG3Dialogue() {
    if (g3SelectedLines.length !== 4 || !g3Scene) return;
    const correctCount = g3SelectedLines.filter(
      (i) => g3Scene.dialogueOptions[i].correct,
    ).length;
    const pts = correctCount * 100 * config.difficulty;
    setScore((s) => s + pts);
    setTotal((t) => t + 4);
    setCorrect((c) => c + correctCount);
    setG3Submitted(true);
  }

  function submitG3Punctuation() {
    if (g3PunctAnswers.length !== g3Scene.punctQuestions.length || !g3Scene)
      return;
    const correctCount = g3PunctAnswers.filter(
      (ans, i) => ans === g3Scene.punctQuestions[i].correctIdx,
    ).length;
    const pts = correctCount * 80 * config.difficulty;
    setScore((s) => s + pts);
    setTotal((t) => t + g3Scene.punctQuestions.length);
    setCorrect((c) => c + correctCount);
    setG3PunctSubmitted(true);
  }

  function nextG3Scene() {
    if (g3Idx + 1 >= g3Scenes.length) {
      endGame(true);
      return;
    }
    setG3Idx((i) => i + 1);
    setG3SelectedLines([]);
    setG3PunctAnswers([]);
    setG3Submitted(false);
    setG3PunctSubmitted(false);
    setG3Phase("dialogue");
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="creative_writing.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#f59e0b]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <div
              key={`h-${i}`}
              className={`w-2 h-2 rounded-full ${i < lives ? "bg-[#f43f5e]" : "bg-muted"}`}
            />
          ))}
        </div>
        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#00f5ff] transition-all duration-1000"
            style={timerBarStyle}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {timeLeft}s
        </span>
      </div>

      {/* ═══════════ GAME 1: Story Forge ═══════════ */}
      {gameId === "story-forge" && (
        <>
          {g1Phase === "idle" && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
              >
                <BookOpen className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
                <h2
                  className="text-3xl font-black glow-cyan-text mb-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Story Forge
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Fill story template slots with words from the word bank.
                  Rarer, more precise words score higher. Use 2+ precise words
                  for a coherence bonus.
                </p>
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={startG1}
                  data-ocid="creative_writing.start_button"
                >
                  Begin Forging
                </GlowButton>
              </motion.div>
            </div>
          )}

          {g1Phase === "play" && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Story Template — {template.title}
                </p>
                <p className="text-sm leading-loose text-foreground">
                  {buildStoryPreview()}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {activeSlot !== null ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      Select a word for slot [{template.slots[activeSlot].label}
                      ]
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {template.wordBanks[template.slots[activeSlot].type].map(
                        (w, i) => {
                          const isSelected =
                            selections[activeSlot]?.word === w.word;
                          const cardBorderColor = QUALITY_COLORS[w.quality];
                          const cardStyle = isSelected
                            ? {
                                borderColor: cardBorderColor,
                                background: `${cardBorderColor}22`,
                              }
                            : { borderColor: `${cardBorderColor}44` };
                          return (
                            <motion.button
                              key={i}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => selectWord(w)}
                              className="rounded-xl border p-3 text-left transition-all bg-card"
                              style={cardStyle}
                              data-ocid={`creative_writing.word.${i + 1}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-foreground text-sm">
                                  {w.word}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star
                                    className="h-3 w-3"
                                    style={{ color: QUALITY_COLORS[w.quality] }}
                                  />
                                  <span
                                    className="text-xs font-mono"
                                    style={{ color: QUALITY_COLORS[w.quality] }}
                                  >
                                    {w.score}
                                  </span>
                                </div>
                              </div>
                              <span
                                className="text-xs font-semibold"
                                style={{ color: QUALITY_COLORS[w.quality] }}
                              >
                                {QUALITY_LABELS[w.quality]}
                              </span>
                            </motion.button>
                          );
                        },
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">
                      Click a [SLOT] in the story to select words
                    </p>
                  </div>
                )}
              </div>
              <AnimatePresence>
                {lastInserted !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs text-[#00f5ff] font-bold"
                  >
                    Word inserted!
                  </motion.div>
                )}
              </AnimatePresence>
              <GlowButton
                variant="primary"
                onClick={submitStory}
                disabled={!allFilled}
                data-ocid="creative_writing.submit_button"
              >
                Submit Story
              </GlowButton>
            </div>
          )}

          {g1Phase === "result" && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="glass-card rounded-2xl p-5 neon-top-border">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  Completed Story — {template.title}
                </p>
                <p className="text-sm leading-loose text-foreground">
                  {buildStoryPreview()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                {selections.map(
                  (sel, i) =>
                    sel && (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-foreground font-semibold">
                          {sel.word}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs"
                            style={{ color: QUALITY_COLORS[sel.quality] }}
                          >
                            {QUALITY_LABELS[sel.quality]}
                          </span>
                          <span className="text-xs font-mono text-[#00f5ff]">
                            +{sel.score * config.difficulty}
                          </span>
                        </div>
                      </div>
                    ),
                )}
                {selections.filter((s) => s?.quality === "precise").length >=
                  2 && (
                  <div className="flex items-center justify-between border-t border-border/30 pt-2 mt-1">
                    <span className="text-sm text-[#10b981] font-bold">
                      Coherence Bonus
                    </span>
                    <span className="text-xs font-mono text-[#10b981]">
                      +{100 * config.difficulty}
                    </span>
                  </div>
                )}
              </div>
              {templateIdx + 1 < templates.length ? (
                <GlowButton
                  variant="primary"
                  className="flex-1"
                  onClick={nextTemplate}
                  data-ocid="creative_writing.next_template_button"
                >
                  Next Template
                </GlowButton>
              ) : (
                <GlowButton
                  variant="primary"
                  className="flex-1"
                  onClick={() => endGame(true)}
                  data-ocid="creative_writing.finish_button"
                >
                  Finish
                </GlowButton>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#10b981]" />
                <span className="text-sm text-[#00f5ff] font-bold">
                  Score this round: {g1Score.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 2: Descriptive Painter ═══════════ */}
      {gameId === "descriptive-painter" && (
        <>
          {g2Phase === "idle" && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
              >
                <BookOpen className="h-14 w-14 mx-auto mb-4 text-[#a855f7]" />
                <h2
                  className="text-3xl font-black mb-2"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#a855f7",
                  }}
                >
                  Descriptive Painter
                </h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {sentenceCount} plain sentences. For each: pick 1 strong verb,
                  2 adjectives, and 1 sensory detail to transform it into vivid
                  writing.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Best verb: +150 pts. Each correct adjective: +80 pts. Best
                  sensory: +120 pts.
                </p>
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    startTime.current = Date.now();
                    setG2Phase("playing");
                  }}
                  data-ocid="creative_writing.g2_start_button"
                >
                  Begin Painting
                </GlowButton>
              </motion.div>
            </div>
          )}

          {(g2Phase === "playing" || g2Phase === "result") && g2Sentence && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="glass-card rounded-xl p-4 border border-[#a855f7]/30 shrink-0">
                <p
                  className="text-xs uppercase tracking-widest text-[#a855f7] mb-1"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Sentence {g2Idx + 1} of {g2Sentences.length}
                </p>
                <p className="text-sm font-bold text-foreground mb-2">
                  PLAIN:{" "}
                  <span className="text-muted-foreground">
                    {g2Sentence.plain}
                  </span>
                </p>
                {g2Verb && g2Adjs.length >= 2 && g2Sensory && (
                  <p className="text-sm font-semibold text-[#a855f7]">
                    ENHANCED: {buildG2Enhanced()}
                  </p>
                )}
              </div>

              {!g2Submitted ? (
                <>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-2">
                      Pick 1 strong verb:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {g2Sentence.verbOptions.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setG2Verb(v)}
                          data-ocid={`creative_writing.g2_verb.${i + 1}`}
                          className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${g2Verb === v ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border/40 text-foreground hover:border-[#a855f7]/40"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-2">
                      Pick 2 adjectives:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {g2Sentence.adjOptions.map((a, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setG2Adjs((prev) =>
                              prev.includes(a)
                                ? prev.filter((x) => x !== a)
                                : prev.length < 2
                                  ? [...prev, a]
                                  : prev,
                            )
                          }
                          data-ocid={`creative_writing.g2_adj.${i + 1}`}
                          className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${g2Adjs.includes(a) ? "border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]" : "border-border/40 text-foreground hover:border-[#f59e0b]/40"}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-2">
                      Pick 1 sensory detail:
                    </p>
                    <div className="flex flex-col gap-2">
                      {g2Sentence.sensoryOptions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setG2Sensory(s)}
                          data-ocid={`creative_writing.g2_sensory.${i + 1}`}
                          className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${g2Sensory === s ? "border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]" : "border-border/40 text-foreground hover:border-[#00f5ff]/40"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <GlowButton
                    variant="primary"
                    size="md"
                    disabled={!g2Verb || g2Adjs.length < 2 || !g2Sensory}
                    onClick={submitG2}
                    data-ocid="creative_writing.g2_submit_button"
                  >
                    Submit Enhancement
                  </GlowButton>
                </>
              ) : (
                <>
                  <div className="glass-card rounded-xl p-4 border border-[#10b981]/30">
                    <p className="text-xs font-bold text-[#10b981] mb-2">
                      Results:
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      {g2Verb === g2Sentence.bestVerb ? (
                        <CheckCircle className="h-3 w-3 text-[#10b981]" />
                      ) : (
                        <XCircle className="h-3 w-3 text-[#f43f5e]" />
                      )}
                      <span className="text-xs">
                        Verb "{g2Verb}" —{" "}
                        {g2Verb === g2Sentence.bestVerb
                          ? "strongest choice"
                          : `best was "${g2Sentence.bestVerb}"`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">
                        Adjectives:{" "}
                        {
                          g2Adjs.filter((a) => g2Sentence.bestAdjs.includes(a))
                            .length
                        }
                        /2 correct (best: {g2Sentence.bestAdjs.join(", ")})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {g2Sensory === g2Sentence.bestSensory ? (
                        <CheckCircle className="h-3 w-3 text-[#10b981]" />
                      ) : (
                        <XCircle className="h-3 w-3 text-[#f43f5e]" />
                      )}
                      <span className="text-xs">
                        Sensory —{" "}
                        {g2Sensory === g2Sentence.bestSensory
                          ? "most vivid choice"
                          : `best was "${g2Sentence.bestSensory}"`}
                      </span>
                    </div>
                  </div>
                  <GlowButton
                    variant="primary"
                    size="md"
                    onClick={nextG2}
                    data-ocid="creative_writing.g2_next_button"
                  >
                    {g2Idx + 1 < g2Sentences.length
                      ? "Next Sentence"
                      : "Finish"}
                  </GlowButton>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 3: Dialogue Writer ═══════════ */}
      {gameId === "dialogue-writer" && (
        <>
          {g3Phase === "idle" && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
              >
                <BookOpen className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
                <h2
                  className="text-3xl font-black mb-2"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#10b981",
                  }}
                >
                  Dialogue Writer
                </h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {sceneCount} scenes. For each: select 4 dialogue lines
                  matching character voices, then answer punctuation questions.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Each correct line: +100 pts. Each correct punctuation: +80
                  pts.
                </p>
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    startTime.current = Date.now();
                    setG3Phase("dialogue");
                  }}
                  data-ocid="creative_writing.g3_start_button"
                >
                  Begin Writing
                </GlowButton>
              </motion.div>
            </div>
          )}

          {g3Phase === "dialogue" && g3Scene && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="glass-card rounded-xl p-4 border border-[#10b981]/30 shrink-0">
                <p
                  className="text-xs uppercase tracking-widest text-[#10b981] mb-1"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Scene {g3Idx + 1} of {g3Scenes.length}
                </p>
                <p className="text-sm font-semibold text-foreground mb-2">
                  {g3Scene.scene}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs">
                    <span className="text-[#7c3aed] font-bold">
                      {g3Scene.charA.name}:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {g3Scene.charA.trait}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#f43f5e] font-bold">
                      {g3Scene.charB.name}:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {g3Scene.charB.trait}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-bold text-foreground">
                Select 4 dialogue lines that best match each character's voice
                and advance the scene:
              </p>
              <div className="flex flex-col gap-2">
                {g3Scene.dialogueOptions.map((opt, i) => {
                  const sel = g3SelectedLines.includes(i);
                  const isA = opt.speaker === "A";
                  const showResult = g3Submitted;
                  let cls =
                    "border-border/40 text-foreground hover:border-[#10b981]/40";
                  if (showResult && sel && opt.correct)
                    cls = "border-[#10b981] bg-[#10b981]/15 text-[#10b981]";
                  else if (showResult && sel && !opt.correct)
                    cls = "border-[#f43f5e]/60 bg-[#f43f5e]/10 text-[#f43f5e]";
                  else if (sel)
                    cls = "border-[#10b981]/60 bg-[#10b981]/10 text-[#10b981]";
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !g3Submitted && toggleG3Line(i)}
                      data-ocid={`creative_writing.g3_line.${i + 1}`}
                      className={`text-left px-4 py-3 rounded-xl border text-xs transition-all glass-card ${cls}`}
                    >
                      <span
                        className="font-bold"
                        style={{ color: isA ? "#7c3aed" : "#f43f5e" }}
                      >
                        {isA ? g3Scene.charA.name : g3Scene.charB.name}:{" "}
                      </span>
                      {opt.text.split(": ").slice(1).join(": ")}
                      {g3Submitted && sel && (
                        <span className="ml-2 text-xs opacity-70">
                          {opt.reason}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {!g3Submitted ? (
                <GlowButton
                  variant="primary"
                  size="md"
                  disabled={g3SelectedLines.length !== 4}
                  onClick={submitG3Dialogue}
                  data-ocid="creative_writing.g3_submit_dialogue"
                >
                  Submit Lines ({g3SelectedLines.length}/4)
                </GlowButton>
              ) : (
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setG3Phase("punctuation")}
                  data-ocid="creative_writing.g3_punctuation_button"
                >
                  Continue to Punctuation
                </GlowButton>
              )}
            </div>
          )}

          {g3Phase === "punctuation" && g3Scene && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="glass-card rounded-xl p-3 border border-[#f59e0b]/30 shrink-0">
                <p
                  className="text-xs uppercase tracking-widest text-[#f59e0b] mb-1"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Dialogue Punctuation — Scene {g3Idx + 1}
                </p>
              </div>
              {g3Scene.punctQuestions.map((q, qi) => (
                <div
                  key={qi}
                  className="glass-card rounded-xl p-4 border border-border/30"
                >
                  <p className="text-xs font-bold text-foreground mb-2">
                    {q.question}
                  </p>
                  <div className="flex flex-col gap-1">
                    {q.options.map((opt, oi) => {
                      const sel = g3PunctAnswers[qi] === oi;
                      const showResult = g3PunctSubmitted;
                      const correct_opt = oi === q.correctIdx;
                      let cls =
                        "border-border/40 hover:border-[#f59e0b]/40 text-foreground";
                      if (showResult && correct_opt)
                        cls = "border-[#10b981] bg-[#10b981]/15 text-[#10b981]";
                      else if (showResult && sel && !correct_opt)
                        cls =
                          "border-[#f43f5e]/60 bg-[#f43f5e]/10 text-[#f43f5e]";
                      else if (sel)
                        cls =
                          "border-[#f59e0b]/60 bg-[#f59e0b]/10 text-[#f59e0b]";
                      return (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => {
                            if (!g3PunctSubmitted) {
                              const next = [...g3PunctAnswers];
                              next[qi] = oi;
                              setG3PunctAnswers(next);
                            }
                          }}
                          data-ocid={`creative_writing.g3_punct.${qi + 1}.${oi + 1}`}
                          className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${cls}`}
                        >
                          {opt}
                          {showResult && correct_opt && (
                            <span className="ml-2 opacity-70">
                              — {q.explanation}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {!g3PunctSubmitted ? (
                <GlowButton
                  variant="primary"
                  size="md"
                  disabled={
                    g3PunctAnswers.length !== g3Scene.punctQuestions.length ||
                    g3PunctAnswers.some((a) => a === undefined)
                  }
                  onClick={submitG3Punctuation}
                  data-ocid="creative_writing.g3_submit_punct"
                >
                  Submit Punctuation
                </GlowButton>
              ) : (
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={nextG3Scene}
                  data-ocid="creative_writing.g3_next_scene"
                >
                  {g3Idx + 1 < g3Scenes.length ? "Next Scene" : "Finish"}
                </GlowButton>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
