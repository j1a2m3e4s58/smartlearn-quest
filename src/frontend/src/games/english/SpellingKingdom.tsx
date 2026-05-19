import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Crown, Flame, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

interface SpellingWord {
  definition: string;
  sentence: string;
  word: string;
  hint: string;
  patternNote: string;
}

const WORDS: Record<1 | 2 | 3, SpellingWord[]> = {
  1: [
    {
      word: "necessary",
      definition: "Required or essential",
      sentence: "It is ___ to wear a seatbelt in a car.",
      hint: "One collar, two socks (1 C, 2 S)",
      patternNote: "Remember: 1 C and 2 S's",
    },
    {
      word: "receive",
      definition: "To get or be given something",
      sentence: "Did you ___ my message?",
      hint: "I before E except after C",
      patternNote: "After C, the order is E then I",
    },
    {
      word: "separate",
      definition: "To divide or keep apart",
      sentence: "Please ___ the recycling from the rubbish.",
      hint: "There's a RAT in sepaRAte",
      patternNote: "Middle syllable: -par-, not -per-",
    },
    {
      word: "believe",
      definition: "To accept something as true",
      sentence: "I ___ she will pass her exams.",
      hint: "LIE in beLIEve",
      patternNote: "Contains 'lie' inside the word",
    },
    {
      word: "government",
      definition: "The group that runs a country",
      sentence: "The ___ announced new education policies.",
      hint: "There's an N before -ment",
      patternNote: "governNment — silent N",
    },
    {
      word: "accommodate",
      definition: "To provide room or adjust to fit",
      sentence: "The hotel can ___ 200 guests.",
      hint: "Double C, double M",
      patternNote: "aCCommodate with CC and MM",
    },
    {
      word: "rhythm",
      definition: "A strong regular repeated pattern",
      sentence: "The drummer kept perfect ___.",
      hint: "No vowels except Y",
      patternNote: "RHYthM — Y acts as the only vowel",
    },
    {
      word: "beautiful",
      definition: "Pleasing to the senses",
      sentence: "The sunset was truly ___.",
      hint: "BEAUtiful — begin with BEAU",
      patternNote: "French origin: BEAU = beautiful",
    },
    {
      word: "February",
      definition: "The second month of the year",
      sentence: "My birthday is in ___.",
      hint: "Feb-RU-ary, not Feb-u-ary",
      patternNote: "Don't drop the first R",
    },
    {
      word: "lightning",
      definition: "Electricity in the sky during storms",
      sentence: "___ struck the tree during the storm.",
      hint: "No E unlike lightEning (getting lighter)",
      patternNote: "lightNING, not lighteNING",
    },
    {
      word: "conscience",
      definition: "Your sense of right and wrong",
      sentence: "His ___ would not allow him to cheat.",
      hint: "Science inside: con-SCIENCE",
      patternNote: "Contains the full word 'science'",
    },
    {
      word: "misspell",
      definition: "To spell a word incorrectly",
      sentence: "Ironically, students often ___ the word 'misspell'.",
      hint: "Double S in the middle",
      patternNote: "mis + spell = miSSpell",
    },
    {
      word: "recommend",
      definition: "To suggest something as good",
      sentence: "I would ___ this book to all students.",
      hint: "1 C, 2 M's",
      patternNote: "reCOMmend: one C, double M",
    },
    {
      word: "sufficient",
      definition: "Enough for the purpose",
      sentence: "We have ___ time to finish the project.",
      hint: "Double F in middle",
      patternNote: "sufFIcient: double F",
    },
    {
      word: "Wednesday",
      definition: "The fourth day of the week",
      sentence: "The meeting is scheduled for ___.",
      hint: "Wed-NES-day — say all letters",
      patternNote: "Silent D: WedNESday",
    },
    {
      word: "occurrence",
      definition: "An event or instance of something happening",
      sentence: "The rare ___ attracted scientists worldwide.",
      hint: "Double C, double R",
      patternNote: "oCCuRRence: CC and RR",
    },
    {
      word: "possession",
      definition: "Something you own",
      sentence: "Her most prized ___ was her grandmother's ring.",
      hint: "Double S, double S",
      patternNote: "poSSesSIon: two double-S pairs",
    },
    {
      word: "privilege",
      definition: "A special right or advantage",
      sentence: "Education is a ___, not a guarantee.",
      hint: "No D before the -lege",
      patternNote: "privILEge, not priviDlege",
    },
    {
      word: "consensus",
      definition: "General agreement among a group",
      sentence: "The committee reached a ___ after hours of debate.",
      hint: "Three S's total",
      patternNote: "conSenSuS: count the S's",
    },
    {
      word: "millennium",
      definition: "A period of one thousand years",
      sentence: "We entered a new ___ in the year 2000.",
      hint: "Double L, double N",
      patternNote: "milLENNium: LL and NN",
    },
  ],
  2: [
    {
      word: "acquiesce",
      definition: "To accept or comply reluctantly",
      sentence: "She chose to ___ rather than argue further.",
      hint: "CQ combination in middle",
      patternNote: "acQUIesce: rare CQ cluster",
    },
    {
      word: "conscientious",
      definition: "Diligent and careful",
      sentence: "A ___ student checks work before submitting.",
      hint: "Contains 'science' inside",
      patternNote: "con-SCIENCE-tious",
    },
    {
      word: "mnemonic",
      definition: "A memory aid technique",
      sentence: "She used a ___ to remember the planets.",
      hint: "Silent M at the start",
      patternNote: "MNEMONIC: M is completely silent",
    },
    {
      word: "pharmaceutical",
      definition: "Relating to medicinal drugs",
      sentence: "The ___ industry invests heavily in research.",
      hint: "PH makes the F sound",
      patternNote: "PHarmaceutical: PH = /f/ sound",
    },
    {
      word: "surreptitious",
      definition: "Done secretly and quietly",
      sentence: "She cast a ___ glance at his notes.",
      hint: "Double R after su-",
      patternNote: "suRReptitious: double R",
    },
    {
      word: "idiosyncratic",
      definition: "Peculiar to the individual",
      sentence: "His ___ filing system confused everyone.",
      hint: "IDIO = one's own (Greek)",
      patternNote: "idioSYNcratic: note SYN not SIN",
    },
    {
      word: "exacerbate",
      definition: "To make a problem worse",
      sentence: "Poor communication will only ___ the conflict.",
      hint: "EX + ACER + BATE",
      patternNote: "exACERbate: note the ACER core",
    },
    {
      word: "exorbitant",
      definition: "Unreasonably large or excessive",
      sentence: "The hotel charged an ___ fee for parking.",
      hint: "ORBIT inside the word",
      patternNote: "exORBITant: contains ORBIT",
    },
    {
      word: "bureaucracy",
      definition: "A system with complex administrative rules",
      sentence: "Navigating the ___ took three months.",
      hint: "BUREAU starts it; ends in -CRACY",
      patternNote: "bUREAUcracy: French BUREAU",
    },
    {
      word: "disseminate",
      definition: "To spread widely",
      sentence: "Social media helps ___ information rapidly.",
      hint: "Double S at the start",
      patternNote: "diSSeminate: double S",
    },
    {
      word: "questionnaire",
      definition: "A set of written questions",
      sentence: "Please complete the ___ before the interview.",
      hint: "Double N near the end",
      patternNote: "questioNNaire: double N",
    },
    {
      word: "supersede",
      definition: "To replace something older",
      sentence: "Digital cameras have superseded film cameras.",
      hint: "Ends in -SEDE not -CEDE",
      patternNote: "superSEDE: only common word ending -sede",
    },
    {
      word: "Mediterranean",
      definition: "The sea between Europe and Africa",
      sentence: "The ship crossed the ___ in three days.",
      hint: "MediterRANEan: double R, single N",
      patternNote: "mediTERRAnean: double R, single N",
    },
    {
      word: "onomatopoeia",
      definition: "Words that sound like what they describe",
      sentence: "'Buzz' and 'sizzle' are examples of ___.",
      hint: "Greek origin: ONOMA = name, POEIA = making",
      patternNote: "onomatoPOEIA: POE-IA ending",
    },
    {
      word: "entrepreneur",
      definition: "Someone who starts businesses",
      sentence: "The young ___ launched three startups before age 25.",
      hint: "French word: ENTRE + PRENEUR",
      patternNote: "entreprENEUR: ends in -EUR not -OR",
    },
    {
      word: "reconnaissance",
      definition: "Military observation of an area",
      sentence: "Drones now conduct ___ missions.",
      hint: "Double N, double S",
      patternNote: "reconNaisSance: NN and SS",
    },
    {
      word: "chrysanthemum",
      definition: "A flowering garden plant",
      sentence: "She planted golden ___ in the front garden.",
      hint: "CHR start, ends in -HEMUM",
      patternNote: "chrySANthemum: SAN in middle",
    },
    {
      word: "paraphernalia",
      definition: "Equipment and accessories for an activity",
      sentence: "She arrived with all her diving ___.",
      hint: "PARA + PHERN + ALIA",
      patternNote: "paraPHERnalia: PH = /f/",
    },
    {
      word: "soliloquy",
      definition: "A speech made by a character alone on stage",
      sentence: "Hamlet's famous ___ begins 'To be or not to be'.",
      hint: "Ends in -QUY not -KWEE",
      patternNote: "soliloQUY: ends in QUY",
    },
    {
      word: "recalcitrant",
      definition: "Stubbornly resistant to authority",
      sentence: "The ___ student refused every teacher's request.",
      hint: "Re-CAL-ci-trant",
      patternNote: "recalCItrant: CI not SI",
    },
  ],
  3: [
    {
      word: "epiphenomenon",
      definition: "A secondary effect accompanying a process",
      sentence: "Consciousness may be an ___ of brain activity.",
      hint: "EPI + PHENOMENON",
      patternNote: "epiPHENomenon: contains PHENO",
    },
    {
      word: "schadenfreude",
      definition: "Pleasure from another's misfortune",
      sentence: "He felt ___ watching the arrogant executive fail.",
      hint: "German: SCHADEN + FREUDE",
      patternNote: "sCHAdenfreude: German SCH = /sh/",
    },
    {
      word: "syllogism",
      definition: "A form of logical reasoning with premises",
      sentence: "The philosopher constructed a perfect ___.",
      hint: "Double L in syLLogism",
      patternNote: "syLLogism: LL not single L",
    },
    {
      word: "perspicacious",
      definition: "Having a ready insight",
      sentence: "A ___ reader detects the author's bias immediately.",
      hint: "PERSPICAX = sharp-sighted (Latin)",
      patternNote: "perspicACIOUS: -acious suffix",
    },
    {
      word: "loquacious",
      definition: "Tending to talk a great deal",
      sentence: "The ___ professor delayed class by 20 minutes.",
      hint: "LOQUI = to speak (Latin)",
      patternNote: "loquACIOUS: -acious suffix",
    },
    {
      word: "cacophonous",
      definition: "Involving harsh discordant sounds",
      sentence: "The construction site produced a ___ din.",
      hint: "KAKO = bad (Greek), PHON = sound",
      patternNote: "cacoPHONous: contains PHON",
    },
    {
      word: "serendipitous",
      definition: "Occurring by pleasant chance",
      sentence: "Their meeting was entirely ___.",
      hint: "SERENDIP is a historical name for Sri Lanka",
      patternNote: "serenDIPitous: DIP in middle",
    },
    {
      word: "pusillanimous",
      definition: "Showing a lack of courage",
      sentence: "A ___ leader avoids all risk.",
      hint: "PUSILLUS = very small (Latin)",
      patternNote: "pusilLAnimous: double LL",
    },
    {
      word: "nefarious",
      definition: "Wicked or criminal",
      sentence: "The ___ scheme was uncovered by investigators.",
      hint: "NEFAS = crime (Latin)",
      patternNote: "neFARious: FAR in the middle",
    },
    {
      word: "propitious",
      definition: "Giving or indicating a good chance of success",
      sentence: "The calm weather was ___ for launching the vessel.",
      hint: "PROPITIUS = favorable (Latin)",
      patternNote: "proPITious: PIT in middle",
    },
    {
      word: "antediluvian",
      definition: "Belonging to the time before the biblical flood",
      sentence: "His ___ views on technology were surprising.",
      hint: "ANTE = before, DILUVIUM = flood",
      patternNote: "anteDILUVian: DILUV from diluvium",
    },
    {
      word: "verisimilitude",
      definition: "The appearance of being true",
      sentence: "The documentary achieved remarkable ___.",
      hint: "VERI = truth, SIMIL = likeness",
      patternNote: "veriSIMILitude: SIMIL = likeness",
    },
    {
      word: "circumlocution",
      definition: "The use of many words where fewer would do",
      sentence: "The politician's ___ obscured a simple refusal.",
      hint: "CIRCUM = around, LOCUT = speak",
      patternNote: "circumLOCUtion: LOCU = speak",
    },
    {
      word: "isomorphism",
      definition: "Correspondence between structures",
      sentence: "Mathematicians identified an ___ between the two groups.",
      hint: "ISO = same, MORPH = form",
      patternNote: "isoMORPhism: MORPH = form",
    },
    {
      word: "pellucid",
      definition: "Transparently clear",
      sentence: "Her ___ prose required no second reading.",
      hint: "PER + LUCID = through light",
      patternNote: "peLLUCid: double LL",
    },
    {
      word: "diaphanous",
      definition: "Light, delicate, and translucent",
      sentence: "The ___ fabric shifted in the breeze.",
      hint: "DIA = through, PHAIN = show (Greek)",
      patternNote: "diaPHAnous: PHA from phainein",
    },
    {
      word: "sesquipedalian",
      definition: "Characterised by long words",
      sentence: "His ___ vocabulary intimidated his classmates.",
      hint: "SESQUI = one and a half, PEDAL = foot",
      patternNote: "sesquiPEDALian: PEDAL in middle",
    },
    {
      word: "jejune",
      definition: "Naive, simplistic, or superficial",
      sentence: "The critic dismissed the argument as ___.",
      hint: "Two J's in a short word",
      patternNote: "JeJune: two J sounds",
    },
    {
      word: "meticulousness",
      definition: "Great attention to detail",
      sentence: "The surgeon's ___ ensured zero complications.",
      hint: "METUS = fear (Latin) at root",
      patternNote: "metiCULousness: CULOS segment",
    },
    {
      word: "plenipotentiary",
      definition: "A diplomat with full authority",
      sentence: "She was appointed ___ to the peace talks.",
      hint: "PLENI = full, POTENT = powerful",
      patternNote: "plenipoTENTiary: TENT in middle",
    },
  ],
};

// ──────────────────────────── GAME 2 DATA: WORD JUMBLE ────────────────────────

interface JumbleWord {
  jumbled: string;
  answer: string;
  definition: string;
  hint: string;
}

const JUMBLE_WORDS: Record<1 | 2 | 3, JumbleWord[]> = {
  1: [
    {
      jumbled: "EAPPL",
      answer: "APPLE",
      definition: "A common red or green fruit",
      hint: "Starts with A",
    },
    {
      jumbled: "OSHCU",
      answer: "COUCH",
      definition: "A comfortable piece of furniture to sit on",
      hint: "Starts with C",
    },
    {
      jumbled: "ABRDE",
      answer: "BREAD",
      definition: "A baked food made from flour",
      hint: "Starts with B",
    },
    {
      jumbled: "ATNLP",
      answer: "PLANT",
      definition: "A living organism that grows in soil",
      hint: "Starts with P",
    },
    {
      jumbled: "GLEEA",
      answer: "EAGLE",
      definition: "A large bird of prey",
      hint: "Starts with E",
    },
    {
      jumbled: "RDAEW",
      answer: "AWARD",
      definition: "A prize given for achievement",
      hint: "Starts with A",
    },
    {
      jumbled: "NTRAI",
      answer: "TRAIN",
      definition: "A vehicle that runs on rails",
      hint: "Starts with T",
    },
    {
      jumbled: "ODLCU",
      answer: "CLOUD",
      definition: "Water vapour visible in the sky",
      hint: "Starts with C",
    },
    {
      jumbled: "NLAEP",
      answer: "PLANE",
      definition: "An aircraft that flies",
      hint: "Starts with P",
    },
    {
      jumbled: "ORCAH",
      answer: "ROACH",
      definition: "A type of insect found in warm environments",
      hint: "Starts with R",
    },
    {
      jumbled: "RTCSU",
      answer: "CRUST",
      definition: "The outer layer of bread or Earth",
      hint: "Starts with C",
    },
    {
      jumbled: "LGBTIH",
      answer: "BLIGHT",
      definition: "A plant disease or damaging influence",
      hint: "Starts with B",
    },
    {
      jumbled: "NTRFE",
      answer: "FRENT",
      definition: "Start fresh from a different angle",
      hint: "Starts with F",
    },
    {
      jumbled: "WSGNI",
      answer: "WINGS",
      definition: "Structures used for flying",
      hint: "Starts with W",
    },
    {
      jumbled: "RCDOW",
      answer: "CROWD",
      definition: "A large group of people together",
      hint: "Starts with C",
    },
    {
      jumbled: "TSERH",
      answer: "THREE",
      definition: "The number between two and four",
      hint: "Starts with T",
    },
    {
      jumbled: "FROCA",
      answer: "FAROC",
      definition: "A long outer garment worn by priests",
      hint: "Starts with F",
    },
    {
      jumbled: "NBULC",
      answer: "BUNCH",
      definition: "A group of things bound together",
      hint: "Starts with B",
    },
    {
      jumbled: "TNOLFE",
      answer: "FONTLE",
      definition: "A gentle stream of water",
      hint: "Starts with F",
    },
    {
      jumbled: "OPSRT",
      answer: "SPORT",
      definition: "A physical activity done for fun or competition",
      hint: "Starts with S",
    },
  ],
  2: [
    {
      jumbled: "TANEGS",
      answer: "AGENTS",
      definition: "People who act on behalf of others",
      hint: "Starts with A",
    },
    {
      jumbled: "RFOEST",
      answer: "FOREST",
      definition: "A large area covered with trees",
      hint: "Starts with F",
    },
    {
      jumbled: "NARTEDS",
      answer: "ANDERS",
      definition: "Branching antlers of a deer",
      hint: "Starts with A",
    },
    {
      jumbled: "EUDNRTS",
      answer: "NUDERTS",
      definition: "Sounds like thunder",
      hint: "Starts with T",
    },
    {
      jumbled: "BLENMO",
      answer: "NIMBLE",
      definition: "Quick and agile in movement",
      hint: "Starts with N",
    },
    {
      jumbled: "YDOCES",
      answer: "DECOYS",
      definition: "Things used to lure or mislead",
      hint: "Starts with D",
    },
    {
      jumbled: "TSTRUE",
      answer: "TURRETS",
      definition: "Small towers on castles",
      hint: "Starts with T",
    },
    {
      jumbled: "RETNSO",
      answer: "TONERS",
      definition: "Something that tones or tightens",
      hint: "Starts with T",
    },
    {
      jumbled: "LDCAORE",
      answer: "COLLARED",
      definition: "Having a collar around the neck",
      hint: "Starts with C",
    },
    {
      jumbled: "BNRIOAG",
      answer: "RAINBOW",
      definition: "Colourful arc in the sky after rain",
      hint: "Starts with R",
    },
    {
      jumbled: "ERADCOS",
      answer: "CORRADES",
      definition: "Wears away by friction",
      hint: "Starts with C",
    },
    {
      jumbled: "SLIPTAR",
      answer: "ALTRIST",
      definition: "One who puts others before self",
      hint: "Starts with A",
    },
    {
      jumbled: "ATRBLSE",
      answer: "BLASTER",
      definition: "Something that blasts or destroys",
      hint: "Starts with B",
    },
    {
      jumbled: "TEDNVIOR",
      answer: "INVENTOR",
      definition: "Someone who creates something new",
      hint: "Starts with I",
    },
    {
      jumbled: "CSTANID",
      answer: "DISTANT",
      definition: "Far away in space or time",
      hint: "Starts with D",
    },
    {
      jumbled: "REDNATU",
      answer: "UNRATED",
      definition: "Not yet given a rating or classification",
      hint: "Starts with U",
    },
    {
      jumbled: "BTSCRAA",
      answer: "CABRATS",
      definition: "Plural of cabaret setting",
      hint: "Starts with C",
    },
    {
      jumbled: "RANCETS",
      answer: "CASTERS",
      definition: "Wheels under furniture",
      hint: "Starts with C",
    },
    {
      jumbled: "ELOCTPAM",
      answer: "COMPLEAT",
      definition: "Archaic: perfectly skilled",
      hint: "Starts with C",
    },
    {
      jumbled: "TNARSCOB",
      answer: "ABSTORCON",
      definition: "An abstract conception",
      hint: "Starts with A",
    },
  ],
  3: [
    {
      jumbled: "RCAONLUT",
      answer: "ULCNAROT",
      definition: "Extremely harsh",
      hint: "Starts with U",
    },
    {
      jumbled: "ELOPMNACT",
      answer: "CONTEMPAL",
      definition: "Meditative and reflective",
      hint: "Starts with C",
    },
    {
      jumbled: "LITVEOCAM",
      answer: "LOCOMOTIVE",
      definition: "A self-propelled railway engine",
      hint: "Starts with L",
    },
    {
      jumbled: "UECROTPND",
      answer: "PRODUNECT",
      definition: "Conducted or carried out",
      hint: "Starts with P",
    },
    {
      jumbled: "AICLOMNRP",
      answer: "PROCLAIMA",
      definition: "To announce publicly",
      hint: "Starts with P",
    },
    {
      jumbled: "TONERALCIV",
      answer: "VELOCINATOR",
      definition: "An instrument measuring speed",
      hint: "Starts with V",
    },
    {
      jumbled: "SEANDTIBRU",
      answer: "SUBSIDRATE",
      definition: "To provide financial support",
      hint: "Starts with S",
    },
    {
      jumbled: "CIOATLNVERP",
      answer: "CORRELATION",
      definition: "A mutual relationship between variables",
      hint: "Starts with C",
    },
    {
      jumbled: "PLATIRNUCED",
      answer: "REPLICAUND",
      definition: "Replicated undeniably",
      hint: "Starts with R",
    },
    {
      jumbled: "TIONCULARVES",
      answer: "VOCALTURES",
      definition: "Relating to vocal expressions",
      hint: "Starts with V",
    },
    {
      jumbled: "EBCALURINT",
      answer: "LUBRICATE",
      definition: "To apply lubricant to reduce friction",
      hint: "Starts with L",
    },
    {
      jumbled: "ROSNPTICLIE",
      answer: "INTERSCOL",
      definition: "Occurring between schools",
      hint: "Starts with I",
    },
    {
      jumbled: "BRITLECONVUS",
      answer: "CONTRIBULES",
      definition: "Those who contribute",
      hint: "Starts with C",
    },
    {
      jumbled: "ACILMONEPRUSD",
      answer: "MEDICALPOURS",
      definition: "A theatrical performance",
      hint: "Starts with M",
    },
    {
      jumbled: "EITCOLMRANDS",
      answer: "MELODICRAFT",
      definition: "Crafted with melodic structure",
      hint: "Starts with M",
    },
    {
      jumbled: "SITUMOVERCA",
      answer: "VOCAMERUST",
      definition: "A skilled vocal master",
      hint: "Starts with V",
    },
    {
      jumbled: "CERATONILB",
      answer: "NARCOTICLE",
      definition: "Relating to narcotics",
      hint: "Starts with N",
    },
    {
      jumbled: "BIRECONTALSP",
      answer: "CONSTRABLE",
      definition: "Capable of being constructed",
      hint: "Starts with C",
    },
    {
      jumbled: "ALRESUCONB",
      answer: "CONSURBALE",
      definition: "Able to be consumed",
      hint: "Starts with C",
    },
    {
      jumbled: "ONICRATLEBUS",
      answer: "CORUSCABLE",
      definition: "Capable of gleaming brightly",
      hint: "Starts with C",
    },
  ],
};

// ──────────────────────────── GAME 3 DATA: SPELLING PATTERNS ────────────────────────

interface PatternRule {
  rule: string;
  explanation: string;
  examples: string[];
  blanks: { prompt: string; options: string[]; answer: string }[];
}

const PATTERN_RULES: Record<1 | 2 | 3, PatternRule[]> = {
  1: [
    {
      rule: "Silent E makes the vowel long",
      explanation:
        "When a word ends in silent-E, the vowel before the consonant says its name.",
      examples: ["cake", "time", "hope", "cute", "lane"],
      blanks: [
        {
          prompt: "c_pe (covering)",
          options: ["cap", "cape", "cpe", "ca"],
          answer: "cape",
        },
        {
          prompt: "m_ke (create)",
          options: ["mak", "mike", "make", "mk"],
          answer: "make",
        },
        {
          prompt: "kn_fe (sharp tool)",
          options: ["knif", "knife", "knfe", "knofe"],
          answer: "knife",
        },
      ],
    },
    {
      rule: "-ING doubles the consonant after a short vowel",
      explanation:
        "When a verb ends in a short vowel + single consonant, double the consonant before -ing.",
      examples: ["running", "sitting", "hitting", "swimming", "cutting"],
      blanks: [
        {
          prompt: "run + ing",
          options: ["runing", "running", "runeing", "runnng"],
          answer: "running",
        },
        {
          prompt: "swim + ing",
          options: ["swiming", "swimeing", "swimming", "swiiming"],
          answer: "swimming",
        },
        {
          prompt: "hop + ing",
          options: ["hoping", "hopping", "hopeing", "hpping"],
          answer: "hopping",
        },
      ],
    },
  ],
  2: [
    {
      rule: "-TION makes the /shun/ sound",
      explanation:
        "The suffix -TION is added to verbs to form nouns meaning the act of doing something.",
      examples: ["action", "nation", "station", "fraction", "solution"],
      blanks: [
        {
          prompt: "educate → educa___",
          options: ["educashun", "education", "educasion", "educacion"],
          answer: "education",
        },
        {
          prompt: "communicate → communica___",
          options: [
            "communication",
            "communicasion",
            "communicashun",
            "comunicacion",
          ],
          answer: "communication",
        },
        {
          prompt: "create → crea___",
          options: ["creasion", "creashun", "creation", "creacion"],
          answer: "creation",
        },
      ],
    },
    {
      rule: "I before E except after C",
      explanation:
        "In most cases, I comes before E. After C, the order reverses.",
      examples: ["believe", "receive", "ceiling", "achieve", "conceive"],
      blanks: [
        {
          prompt: "ach___ve (reach a goal)",
          options: ["acheive", "achieve", "acheeve", "achive"],
          answer: "achieve",
        },
        {
          prompt: "rec___ve (get something)",
          options: ["recieve", "receive", "receeve", "receve"],
          answer: "receive",
        },
        {
          prompt: "bel___ve (accept as true)",
          options: ["beleive", "beleeve", "believe", "belive"],
          answer: "believe",
        },
      ],
    },
  ],
  3: [
    {
      rule: "Latin roots: -SPECT means 'to look'",
      explanation:
        "Words containing -SPECT carry meaning related to looking or seeing.",
      examples: [
        "inspect",
        "prospect",
        "spectator",
        "retrospect",
        "circumspect",
      ],
      blanks: [
        {
          prompt: "___ (look back on the past)",
          options: ["respect", "retrospect", "despect", "reinspect"],
          answer: "retrospect",
        },
        {
          prompt: "___ (careful and cautious)",
          options: ["circumspect", "inspect", "prospect", "aspect"],
          answer: "circumspect",
        },
        {
          prompt: "___ (a viewer of an event)",
          options: ["spectator", "specter", "spectrum", "spectral"],
          answer: "spectator",
        },
      ],
    },
    {
      rule: "Prefix mis- means 'wrongly'",
      explanation:
        "Adding mis- to a word means doing something wrongly or badly.",
      examples: ["mistake", "misread", "mislead", "misplace", "misunderstand"],
      blanks: [
        {
          prompt: "___ (to place in the wrong location)",
          options: ["misplace", "displace", "replace", "misplaze"],
          answer: "misplace",
        },
        {
          prompt: "___ (to understand incorrectly)",
          options: [
            "misunderstand",
            "understandmis",
            "misunderstan",
            "disunderstand",
          ],
          answer: "misunderstand",
        },
        {
          prompt: "___ (to spell incorrectly)",
          options: ["misspell", "mispell", "missspell", "misspel"],
          answer: "misspell",
        },
      ],
    },
  ],
};

// ──────────────────────────── GAME 1: SPELLING CHAMPION ────────────────────────

function SpellingChampion({ config, onGameEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    correct: string;
    note: string;
  } | null>(null);
  const [wordTimeLeft, setWordTimeLeft] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const totalRef = useRef(total);
  totalRef.current = total;
  const words = WORDS[config.difficulty];
  const w = words[wordIdx];

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
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
    [config, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  function startWordTimer() {
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    setWordTimeLeft(30);
    wordTimerRef.current = setInterval(() => {
      setWordTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(wordTimerRef.current!);
          submitAnswer(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (started && !feedback) {
      startWordTimer();
      inputRef.current?.focus();
    }
    return () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    };
  }, [wordIdx, started, feedback]);

  function submitAnswer(timedOut = false) {
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    if (feedback) return;
    const typed = timedOut ? "" : input.trim().toLowerCase();
    const isCorrect = typed === w.word.toLowerCase();
    setTotal((t) => t + 1);
    const mult = Math.min(streak + 1, 5);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
      setScore((s) => s + 200 * config.difficulty * mult);
    } else setStreak(0);
    setFeedback({ ok: isCorrect, correct: w.word, note: w.patternNote });
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (wordIdx + 1 >= words.length) endGame(true);
      else setWordIdx((i) => i + 1);
    }, 2500);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const wordPct = (wordTimeLeft / 30) * 100;

  if (!started)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="spelling_kingdom.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Crown className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Spelling Champion
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            A definition and example sentence are shown. Type the correct
            spelling. Build streaks for bonus multipliers.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => setStarted(true)}
            data-ocid="spelling_kingdom.start_button"
          >
            Start Tournament
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="spelling_kingdom.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-[#f59e0b]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <div className="flex items-center gap-1 text-[#f43f5e]">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-bold">{streak}x</span>
            </div>
          )}
          <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#00f5ff] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {wordIdx + 1}/{words.length}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={wordIdx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Word {wordIdx + 1} of {words.length}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[#f43f5e] transition-all duration-1000"
                  style={{ width: `${wordPct}%` }}
                />
              </div>
              <span className="text-xs text-[#f43f5e] tabular-nums">
                {wordTimeLeft}s
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Definition
              </p>
              <p className="text-base font-semibold text-foreground">
                {w.definition}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Used in a sentence
              </p>
              <p className="text-sm text-foreground italic">{w.sentence}</p>
            </div>
            <div className="p-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5">
              <p className="text-xs text-[#f59e0b]">{w.hint}</p>
            </div>
          </div>
          {!feedback ? (
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-[#00f5ff]/40 bg-card focus:border-[#00f5ff] focus:outline-none text-lg font-mono text-center tracking-widest"
                placeholder="Type the spelling..."
                autoComplete="off"
                spellCheck={false}
                data-ocid="spelling_kingdom.input"
              />
              <GlowButton
                variant="primary"
                onClick={() => submitAnswer()}
                data-ocid="spelling_kingdom.submit_button"
              >
                Submit
              </GlowButton>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${feedback.ok ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {feedback.ok ? (
                  <CheckCircle className="h-5 w-5 text-[#10b981]" />
                ) : (
                  <XCircle className="h-5 w-5 text-[#f43f5e]" />
                )}
                <span
                  className={`text-base font-black font-mono tracking-widest ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback.correct}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{feedback.note}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────── GAME 2: WORD JUMBLE ────────────────────────

function WordJumble({ config, onGameEnd }: Props) {
  const pool = JUMBLE_WORDS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
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

  function submit() {
    if (feedback || !item) return;
    const typed = input.trim().toUpperCase();
    const ok = typed === item.answer.toUpperCase();
    if (ok) {
      setCorrect((c) => c + 1);
      const pts = (hintUsed ? 50 : 100) * config.difficulty;
      setScore((s) => s + pts);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    setFeedback({
      ok,
      msg: ok
        ? `Correct! The word was ${item.answer}`
        : `Wrong. The answer is ${item.answer}. ${item.definition}`,
    });
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      setHintUsed(false);
      if (idx + 1 >= pool.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2500);
  }

  if (!started)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="spelling_kingdom.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Crown className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Word Jumble
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Scrambled letters and a definition clue are shown.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Type the correct word by rearranging the letters. A hint reveals the
            first letter at -50% score.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="spelling_kingdom.start_button"
          >
            Unscramble Words
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="spelling_kingdom.page"
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
            className="h-full bg-[#7c3aed] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {idx + 1}/{pool.length}
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
          <div className="glass-card rounded-2xl p-8 neon-top-border text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Unscramble this word:
            </p>
            <p
              className="text-4xl font-black tracking-widest text-[#f59e0b] mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {item.jumbled}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {item.definition}
            </p>
            {hintUsed && (
              <p className="text-xs text-[#f59e0b] mt-2">Hint: {item.hint}</p>
            )}
          </div>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-[#7c3aed]/40 bg-card focus:border-[#7c3aed] focus:outline-none text-lg font-mono text-center tracking-widest uppercase"
              placeholder="Type your answer..."
              autoComplete="off"
              spellCheck={false}
              data-ocid="spelling_kingdom.jumble_input"
            />
          </div>
          {!hintUsed && !feedback && (
            <button
              type="button"
              onClick={() => setHintUsed(true)}
              className="text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors"
              data-ocid="spelling_kingdom.hint_button"
            >
              Show hint (-50% score)
            </button>
          )}
          {!feedback ? (
            <GlowButton
              variant="primary"
              onClick={submit}
              disabled={!input.trim()}
              data-ocid="spelling_kingdom.jumble_submit"
            >
              Submit Answer
            </GlowButton>
          ) : (
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

// ──────────────────────────── GAME 3: SPELLING PATTERNS ────────────────────────

function SpellingPatterns({ config, onGameEnd }: Props) {
  const rules = PATTERN_RULES[config.difficulty];
  const [started, setStarted] = useState(false);
  const [ruleIdx, setRuleIdx] = useState(0);
  const [blankIdx, setBlankIdx] = useState(0);
  const [phase, setPhase] = useState<"learn" | "practice">("learn");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
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
    [config, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;
  const rule = rules[ruleIdx];

  function handleAnswer(opt: string) {
    if (feedback || !rule) return;
    const blank = rule.blanks[blankIdx];
    const ok = opt === blank.answer;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    setFeedback({
      ok,
      msg: ok
        ? `Correct! ${blank.answer} follows the rule.`
        : `Wrong. The answer is ${blank.answer}.`,
    });
    setTimeout(() => {
      setFeedback(null);
      const nextBlank = blankIdx + 1;
      if (nextBlank >= rule.blanks.length) {
        const nextRule = ruleIdx + 1;
        if (nextRule >= rules.length) endGame(true);
        else {
          setRuleIdx(nextRule);
          setBlankIdx(0);
          setPhase("learn");
        }
      } else setBlankIdx(nextBlank);
    }, 1800);
  }

  if (!started)
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="spelling_kingdom.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Crown className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Spelling Patterns
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A spelling rule is explained with examples, then you apply it to
            fill in the blanks.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            {rules.length} rules across this difficulty level.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="spelling_kingdom.start_button"
          >
            Learn the Rules
          </GlowButton>
        </motion.div>
      </div>
    );

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="spelling_kingdom.page"
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
            className="h-full bg-[#10b981] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${ruleIdx}-${phase}-${blankIdx}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 flex flex-col gap-4"
        >
          {phase === "learn" && (
            <>
              <div className="glass-card rounded-2xl p-6 neon-top-border">
                <p className="text-xs uppercase tracking-widest text-[#10b981] mb-2">
                  Rule {ruleIdx + 1} of {rules.length}
                </p>
                <p className="text-lg font-black text-foreground mb-2">
                  {rule.rule}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {rule.explanation}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Examples:
                </p>
                <div className="flex flex-wrap gap-2">
                  {rule.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981] text-sm font-mono"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
              <GlowButton
                variant="primary"
                onClick={() => setPhase("practice")}
                data-ocid="spelling_kingdom.practice_button"
              >
                Apply the Rule
              </GlowButton>
            </>
          )}
          {phase === "practice" && rule.blanks[blankIdx] && (
            <>
              <div className="glass-card rounded-xl p-4 border border-[#10b981]/30">
                <p className="text-xs uppercase tracking-widest text-[#10b981] mb-1">
                  Rule: {rule.rule}
                </p>
                <p className="text-xs text-muted-foreground">
                  Blank {blankIdx + 1} of {rule.blanks.length}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-6 neon-top-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Choose the correctly spelled word:
                </p>
                <p className="text-lg font-bold text-foreground">
                  {rule.blanks[blankIdx].prompt}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {rule.blanks[blankIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleAnswer(opt)}
                    className={`px-4 py-3 rounded-xl border text-sm font-mono font-bold transition-all ${feedback ? (opt === rule.blanks[blankIdx].answer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`}
                    data-ocid={`spelling_kingdom.pattern_option.${i + 1}`}
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
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────── MAIN EXPORT ────────────────────────

export default function SpellingKingdom({ config, onGameEnd }: Props) {
  if (config.gameId === "word-jumble")
    return <WordJumble config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "spelling-patterns")
    return <SpellingPatterns config={config} onGameEnd={onGameEnd} />;
  return <SpellingChampion config={config} onGameEnd={onGameEnd} />;
}
