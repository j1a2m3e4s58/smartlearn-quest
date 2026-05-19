import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Headphones, MessageSquare, XCircle } from "lucide-react";
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

// ─── Game 1: audio-detective (existing data) ─────────────────────────────────
interface DialogueLine {
  speaker: string;
  text: string;
  blank?: { position: number; answer: string; options: string[] };
}
interface Scenario {
  title: string;
  context: string;
  lines: DialogueLine[];
  questions: { q: string; options: string[]; answer: string; type: string }[];
  emotion: string;
  emotionOptions: string[];
  mainTopic: string;
  topicOptions: string[];
}
const SCENARIOS: Record<1 | 2 | 3, Scenario[]> = {
  1: [
    {
      title: "At the Doctor's Office",
      context: "A patient is speaking with a doctor about feeling unwell.",
      lines: [
        {
          speaker: "Doctor",
          text: "Good morning. What seems to be the problem today?",
        },
        {
          speaker: "Patient",
          text: "I've had a headache for three days and I feel very tired.",
        },
        {
          speaker: "Doctor",
          text: "I see. Have you been drinking enough water?",
        },
        {
          speaker: "Patient",
          text: "Not really. I've been busy working late every night.",
          blank: {
            position: 4,
            answer: "busy",
            options: ["busy", "sleeping", "eating", "running"],
          },
        },
        {
          speaker: "Doctor",
          text: "That explains it. Dehydration and exhaustion can cause both symptoms.",
        },
        { speaker: "Patient", text: "What should I do?" },
        {
          speaker: "Doctor",
          text: "Rest for two days, drink two liters of water daily, and take paracetamol if needed.",
        },
      ],
      questions: [
        {
          q: "How long has the patient had a headache?",
          options: ["One day", "Two days", "Three days", "One week"],
          answer: "Three days",
          type: "Detail",
        },
        {
          q: "What did the doctor NOT prescribe?",
          options: ["Rest", "Water", "Antibiotics", "Paracetamol"],
          answer: "Antibiotics",
          type: "Inference",
        },
        {
          q: "What caused both symptoms according to the doctor?",
          options: [
            "Infection",
            "Dehydration and exhaustion",
            "Stress",
            "Poor diet",
          ],
          answer: "Dehydration and exhaustion",
          type: "Main Point",
        },
      ],
      emotion: "concerned",
      emotionOptions: ["concerned", "angry", "excited", "bored"],
      mainTopic: "treating dehydration and exhaustion",
      topicOptions: [
        "treating dehydration and exhaustion",
        "scheduling surgery",
        "ordering medication",
        "discussing diet plans",
      ],
    },
  ],
  2: [
    {
      title: "Job Interview Panel",
      context: "A candidate is being interviewed for a data analyst position.",
      lines: [
        {
          speaker: "Interviewer",
          text: "Welcome. Tell me about your experience with data visualization.",
        },
        {
          speaker: "Candidate",
          text: "I've worked with Tableau and Power BI for two years, producing monthly reports for senior management.",
        },
        {
          speaker: "Interviewer",
          text: "Can you describe a time when your analysis directly influenced a business decision?",
        },
        {
          speaker: "Candidate",
          text: "Certainly. I identified a 23% drop in customer retention and traced it to a billing",
          blank: {
            position: 11,
            answer: "error",
            options: ["error", "increase", "system", "delay"],
          },
        },
        {
          speaker: "Candidate",
          text: "My report prompted an immediate product review that recovered that segment within a quarter.",
        },
        {
          speaker: "Interviewer",
          text: "Impressive. How do you handle conflicting data from different sources?",
        },
        {
          speaker: "Candidate",
          text: "I establish a data hierarchy based on source reliability and document every assumption explicitly.",
        },
      ],
      questions: [
        {
          q: "What tools did the candidate mention?",
          options: [
            "Excel and Python",
            "Tableau and Power BI",
            "SQL and Tableau",
            "Power BI and Excel",
          ],
          answer: "Tableau and Power BI",
          type: "Detail",
        },
        {
          q: "What did the candidate identify that caused customer retention drops?",
          options: [
            "Product quality issue",
            "Marketing failure",
            "Billing error",
            "Pricing increase",
          ],
          answer: "Billing error",
          type: "Inference",
        },
        {
          q: "What strategy does the candidate use for conflicting data?",
          options: [
            "Average all sources",
            "Establish a data hierarchy",
            "Ask management",
            "Ignore inconsistencies",
          ],
          answer: "Establish a data hierarchy",
          type: "Main Point",
        },
      ],
      emotion: "confident",
      emotionOptions: ["confident", "nervous", "dismissive", "confused"],
      mainTopic: "demonstrating analytical skills and work experience",
      topicOptions: [
        "demonstrating analytical skills and work experience",
        "negotiating salary",
        "asking about company benefits",
        "discussing team management",
      ],
    },
  ],
  3: [
    {
      title: "UN Climate Negotiation",
      context:
        "Two delegates negotiate a binding emissions reduction framework.",
      lines: [
        {
          speaker: "Delegate A",
          text: "Our position remains that developed nations must commit to 50% emissions cuts by 2035.",
        },
        {
          speaker: "Delegate B",
          text: "We understand that position, however our energy transition requires a longer runway.",
        },
        {
          speaker: "Delegate A",
          text: "The science leaves no room for a longer runway. Every year of delay costs the planet irreversibly.",
        },
        {
          speaker: "Delegate B",
          text: "We propose a differentiated timeline with binding checkpoints every five years.",
          blank: {
            position: 3,
            answer: "timeline",
            options: ["timeline", "budget", "workforce", "committee"],
          },
        },
        {
          speaker: "Delegate A",
          text: "Differentiated timelines have historically allowed backsliding. What enforcement mechanism do you propose?",
        },
        {
          speaker: "Delegate B",
          text: "An independent international tribunal with authority to impose graduated trade penalties.",
        },
        {
          speaker: "Delegate A",
          text: "That is a significant concession. We will bring that to our ministers for review.",
        },
      ],
      questions: [
        {
          q: "What cut does Delegate A demand by 2035?",
          options: ["25%", "40%", "50%", "60%"],
          answer: "50%",
          type: "Detail",
        },
        {
          q: "What concern does Delegate A raise about differentiated timelines?",
          options: [
            "They are too expensive",
            "They allow backsliding",
            "They require UN approval",
            "They need new laws",
          ],
          answer: "They allow backsliding",
          type: "Inference",
        },
        {
          q: "What enforcement mechanism does Delegate B propose?",
          options: [
            "Fines paid to UN",
            "Military sanctions",
            "Trade penalties via tribunal",
            "Suspension from UN",
          ],
          answer: "Trade penalties via tribunal",
          type: "Critical Analysis",
        },
      ],
      emotion: "tense but diplomatic",
      emotionOptions: [
        "tense but diplomatic",
        "casual and friendly",
        "hostile and confrontational",
        "indifferent",
      ],
      mainTopic: "negotiating emissions reduction commitments and enforcement",
      topicOptions: [
        "negotiating emissions reduction commitments and enforcement",
        "discussing renewable energy subsidies",
        "reviewing past treaties",
        "planning a climate summit agenda",
      ],
    },
  ],
};

// ─── Game 2: note-taker ──────────────────────────────────────────────────────
interface Announcement {
  title: string;
  text: string;
  trueFacts: string[];
  falseFacts: string[];
  questions: { q: string; answer: string; options: string[] }[];
}
const ANNOUNCEMENTS: Announcement[] = [
  {
    title: "School Schedule Change",
    text: "Attention all students. Due to the upcoming National Education Day on Thursday, all afternoon classes from 2 PM onwards will be cancelled. Morning classes will proceed as normal from 7:30 AM. All students are required to attend the morning assembly at 8 AM in the main hall. Sports practice is moved to Friday at 4 PM. Any student with questions should report to the school office by Wednesday.",
    trueFacts: [
      "Afternoon classes are cancelled on Thursday.",
      "Morning classes start at 7:30 AM.",
      "Assembly is at 8 AM in the main hall.",
      "Sports practice moves to Friday at 4 PM.",
      "Students should contact the office by Wednesday.",
    ],
    falseFacts: [
      "All classes on Thursday are cancelled.",
      "The assembly is in the sports hall.",
      "Sports practice is cancelled entirely.",
      "The change is due to a public holiday.",
      "Morning classes start at 9 AM.",
    ],
    questions: [
      {
        q: "Why are afternoon classes cancelled on Thursday?",
        options: [
          "Teacher training day",
          "National Education Day",
          "School repairs",
          "Public holiday",
        ],
        answer: "National Education Day",
      },
      {
        q: "Where is the morning assembly?",
        options: ["Sports hall", "Classroom 1", "Main hall", "Library"],
        answer: "Main hall",
      },
      {
        q: "When is sports practice rescheduled to?",
        options: [
          "Thursday 4 PM",
          "Friday 4 PM",
          "Saturday 10 AM",
          "Monday 3 PM",
        ],
        answer: "Friday 4 PM",
      },
    ],
  },
  {
    title: "Sports Results Announcement",
    text: "Good afternoon. Here are the results of last weekend's inter-school athletics competition. Our school placed second overall in the regional championship. The boys' relay team won gold with a time of 43.2 seconds. Our lead sprinter, Samuel Acheampong, set a new school record of 10.8 seconds in the 100 metres. The girls' team placed third in the 4x400 metres relay. The next competition will be held in Cape Coast on the 15th of next month. Students interested in joining the squad should submit their applications to the PE department by Friday.",
    trueFacts: [
      "The school placed second overall.",
      "The boys' relay team won gold.",
      "Samuel Acheampong set a new school record.",
      "The 100m record is 10.8 seconds.",
      "Applications are due to PE by Friday.",
    ],
    falseFacts: [
      "The school placed first overall.",
      "The girls' team won gold.",
      "The next competition is in Accra.",
      "The relay time was 45.1 seconds.",
      "Applications go to the principal.",
    ],
    questions: [
      {
        q: "What position did the school place overall?",
        options: ["First", "Second", "Third", "Fourth"],
        answer: "Second",
      },
      {
        q: "What record did Samuel Acheampong set?",
        options: [
          "400m school record",
          "100m school record",
          "Long jump record",
          "National record",
        ],
        answer: "100m school record",
      },
      {
        q: "Where is the next competition?",
        options: ["Accra", "Kumasi", "Cape Coast", "Takoradi"],
        answer: "Cape Coast",
      },
    ],
  },
  {
    title: "Weather and Safety Advisory",
    text: "The Ghana Meteorological Agency has issued a severe weather warning for the Northern and Upper regions beginning Wednesday evening. Heavy rainfall of up to 80 millimetres is expected over 24 hours, with wind speeds reaching 60 kilometres per hour. Residents in low-lying flood-prone areas are advised to move to higher ground. All outdoor market activities in affected areas should be suspended. Emergency shelters have been opened at the Tamale Technical University and three secondary schools. Residents are urged to charge mobile phones and prepare emergency kits. The warning is in effect until Friday morning.",
    trueFacts: [
      "The warning covers Northern and Upper regions.",
      "Rainfall of up to 80 mm is expected.",
      "Wind speeds may reach 60 km/h.",
      "Emergency shelters are open at Tamale Technical University.",
      "The warning is in effect until Friday morning.",
    ],
    falseFacts: [
      "The warning covers all regions of Ghana.",
      "Rainfall of 200 mm is expected.",
      "Market activities are encouraged to continue.",
      "The warning ends Saturday night.",
      "Only one shelter has been opened.",
    ],
    questions: [
      {
        q: "Which regions are affected by the warning?",
        options: [
          "Greater Accra and Ashanti",
          "Northern and Upper regions",
          "Western and Central regions",
          "All regions",
        ],
        answer: "Northern and Upper regions",
      },
      {
        q: "What is the expected maximum rainfall?",
        options: ["40 mm", "60 mm", "80 mm", "120 mm"],
        answer: "80 mm",
      },
      {
        q: "Until when is the warning in effect?",
        options: [
          "Thursday morning",
          "Friday morning",
          "Saturday evening",
          "Wednesday night",
        ],
        answer: "Friday morning",
      },
    ],
  },
];

// ─── Game 3: instruction-follower ───────────────────────────────────────────────
interface InstructionSet {
  title: string;
  instructions: string[];
  steps: { prompt: string; options: string[]; answer: string }[];
}
const INSTRUCTION_SETS: InstructionSet[] = [
  {
    title: "Prepare a Science Experiment",
    instructions: [
      "Put on safety goggles.",
      "Pour 100 mL of water into the beaker.",
      "Add 5 g of salt and stir.",
    ],
    steps: [
      {
        prompt: "What is the FIRST thing you do?",
        options: [
          "Pour water",
          "Add salt",
          "Put on safety goggles",
          "Stir the mixture",
        ],
        answer: "Put on safety goggles",
      },
      {
        prompt: "What do you do SECOND?",
        options: [
          "Add salt",
          "Put on goggles",
          "Pour 100 mL of water",
          "Write results",
        ],
        answer: "Pour 100 mL of water",
      },
      {
        prompt: "What is the LAST step?",
        options: [
          "Put on goggles",
          "Pour water",
          "Add 5 g of salt and stir",
          "Record temperature",
        ],
        answer: "Add 5 g of salt and stir",
      },
    ],
  },
  {
    title: "Send a Formal Email",
    instructions: [
      "Open your email application.",
      "Click Compose.",
      "Enter the recipient address.",
      "Write a clear subject line.",
      "Type the body of the message.",
    ],
    steps: [
      {
        prompt: "What is the FIRST step?",
        options: [
          "Write subject",
          "Click Compose",
          "Open email application",
          "Type message",
        ],
        answer: "Open email application",
      },
      {
        prompt: "What do you do after clicking Compose?",
        options: [
          "Type body",
          "Enter recipient address",
          "Write subject",
          "Send",
        ],
        answer: "Enter recipient address",
      },
      {
        prompt: "What comes BEFORE writing the body?",
        options: [
          "Open email",
          "Type recipient",
          "Write a clear subject line",
          "Attach files",
        ],
        answer: "Write a clear subject line",
      },
      {
        prompt: "What is the FINAL step?",
        options: [
          "Write subject",
          "Click Compose",
          "Open email",
          "Type the body of the message",
        ],
        answer: "Type the body of the message",
      },
    ],
  },
  {
    title: "Emergency Evacuation Procedure",
    instructions: [
      "Sound the alarm.",
      "Alert all occupants.",
      "Guide everyone to the nearest exit.",
      "Account for all persons at the assembly point.",
      "Do not re-enter until cleared.",
      "Call emergency services.",
      "Complete an incident report.",
    ],
    steps: [
      {
        prompt: "What is the FIRST action?",
        options: [
          "Call emergency services",
          "Sound the alarm",
          "Guide to exit",
          "Account for persons",
        ],
        answer: "Sound the alarm",
      },
      {
        prompt: "What happens AFTER alerting occupants?",
        options: [
          "Sound alarm",
          "Account for persons",
          "Guide everyone to nearest exit",
          "Complete report",
        ],
        answer: "Guide everyone to nearest exit",
      },
      {
        prompt: "What happens at the assembly point?",
        options: [
          "Sound the alarm again",
          "Call emergency services",
          "Account for all persons",
          "Re-enter building",
        ],
        answer: "Account for all persons",
      },
      {
        prompt: "What must NOT happen before clearance?",
        options: [
          "Account for persons",
          "Re-enter the building",
          "Call services",
          "Complete the report",
        ],
        answer: "Re-enter the building",
      },
      {
        prompt: "What is the LAST step?",
        options: [
          "Sound alarm",
          "Call emergency services",
          "Guide occupants",
          "Complete an incident report",
        ],
        answer: "Complete an incident report",
      },
    ],
  },
];

export default function ListeningChallenge({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // Game 1 state
  const scenario = SCENARIOS[config.difficulty][0];
  const [phase, setPhase] = useState<
    "idle" | "transcript" | "blanks" | "questions" | "final"
  >("idle");
  const [revealedLines, setRevealedLines] = useState(0);
  const [blankAnswer, setBlankAnswer] = useState<string | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [emotionDone, setEmotionDone] = useState(false);
  const revealRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Game 2 state
  const [ntPhase, setNtPhase] = useState<
    "start" | "read" | "hidden" | "questions" | "done"
  >("start");
  const [ntIdx, setNtIdx] = useState(0);
  const [ntFactAnswers, setNtFactAnswers] = useState<Record<number, boolean>>(
    {},
  );
  const [ntQIdx, setNtQIdx] = useState(0);
  const [ntScore, setNtScore] = useState(0);
  const [ntFeedback, setNtFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [readTimer, setReadTimer] = useState(0);
  const readTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Game 3 state
  const [ifPhase, setIfPhase] = useState<
    "start" | "read" | "hidden" | "steps" | "done"
  >("start");
  const [ifIdx, setIfIdx] = useState(0);
  const [ifStepIdx, setIfStepIdx] = useState(0);
  const [ifReadTimer, setIfReadTimer] = useState(0);
  const ifReadRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ifScore, setIfScore] = useState(0);
  const [ifFeedback, setIfFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

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

  useEffect(() => {
    if (phase !== "transcript") return;
    if (revealedLines >= scenario.lines.length) {
      setTimeout(() => setPhase("blanks"), 800);
      return;
    }
    revealRef.current = setTimeout(() => setRevealedLines((r) => r + 1), 1200);
    return () => {
      if (revealRef.current) clearTimeout(revealRef.current);
    };
  }, [phase, revealedLines, scenario.lines.length]);

  const blankLine = scenario.lines.find((l) => l.blank);

  function handleBlank(opt: string) {
    if (!blankLine?.blank) return;
    const isCorrect = opt === blankLine.blank.answer;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    setBlankAnswer(opt);
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? "Correct! Good listening comprehension."
        : `Wrong. The missing word was: "${blankLine.blank.answer}"`,
    });
    setTimeout(() => {
      setFeedback(null);
      setPhase("questions");
    }, 1800);
  }
  function handleQuestion(opt: string) {
    const q = scenario.questions[qIdx];
    const isCorrect = opt === q.answer;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? `Correct! (${q.type})`
        : `Incorrect. Answer: "${q.answer}"`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (qIdx + 1 >= scenario.questions.length) setPhase("final");
      else setQIdx((i) => i + 1);
    }, 1800);
  }
  function handleEmotion(opt: string) {
    const isCorrect = opt === scenario.emotion;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? "Correct emotional register detected!"
        : `Wrong. The tone was: ${scenario.emotion}`,
    });
    setTimeout(() => {
      setFeedback(null);
      setEmotionDone(true);
    }, 1800);
  }
  function handleTopic(opt: string) {
    const isCorrect = opt === scenario.mainTopic;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? "Correct main topic identified!"
        : `Wrong. The main topic was: ${scenario.mainTopic}`,
    });
    setTimeout(() => {
      setFeedback(null);
      endGame(true);
    }, 1800);
  }

  // ── Game 2 handlers ──────────────────────────────────────────────────────
  const ann = ANNOUNCEMENTS[ntIdx % ANNOUNCEMENTS.length];
  const allFacts = [...ann.trueFacts, ...ann.falseFacts].sort(
    () => Math.random() - 0.5,
  );

  function ntStart() {
    startTime.current = Date.now();
    setNtPhase("read");
    let t = 15;
    setReadTimer(t);
    readTimerRef.current = setInterval(() => {
      t--;
      setReadTimer(t);
      if (t <= 0) {
        if (readTimerRef.current) clearInterval(readTimerRef.current);
        setNtPhase("hidden");
      }
    }, 1000);
  }
  function toggleFactAnswer(factIdx: number, isTrue: boolean) {
    if (ntFeedback) return;
    setNtFactAnswers((prev) => ({ ...prev, [factIdx]: isTrue }));
  }
  function submitFacts() {
    const trueFacts = ann.trueFacts;
    let pts = 0;
    let c = 0;
    allFacts.forEach((fact, i) => {
      const userSaysTrue = ntFactAnswers[i] === true;
      const isActuallyTrue = trueFacts.includes(fact);
      if (userSaysTrue === isActuallyTrue) {
        pts += 40 * config.difficulty;
        c++;
      }
    });
    setNtScore((s) => s + pts);
    setScore((s) => s + pts);
    setNtFeedback({ ok: c >= 8, msg: `${c}/10 correct. +${pts} pts` });
    setTimeout(() => {
      setNtFeedback(null);
      setNtPhase("questions");
      setNtQIdx(0);
    }, 2000);
  }
  function handleNtQuestion(opt: string) {
    if (ntFeedback) return;
    const q = ann.questions[ntQIdx];
    const isCorrect = opt === q.answer;
    const pts = isCorrect ? 100 * config.difficulty : 0;
    setNtScore((s) => s + pts);
    setScore((s) => s + pts);
    setNtFeedback({
      ok: isCorrect,
      msg: isCorrect ? `Correct! +${pts} pts` : `Wrong. Answer: ${q.answer}`,
    });
    setTimeout(() => {
      setNtFeedback(null);
      if (ntQIdx + 1 >= ann.questions.length) {
        const next = ntIdx + 1;
        if (next >= ANNOUNCEMENTS.length) {
          setNtPhase("done");
          endGame(true);
        } else {
          setNtIdx(next);
          setNtPhase("start");
          setNtFactAnswers({});
        }
      } else setNtQIdx((q) => q + 1);
    }, 1800);
  }

  // ── Game 3 handlers ──────────────────────────────────────────────────────
  const instrSet = INSTRUCTION_SETS[ifIdx % INSTRUCTION_SETS.length];
  const readSeconds =
    config.difficulty === 1 ? 8 : config.difficulty === 2 ? 10 : 12;

  function ifStart() {
    startTime.current = Date.now();
    setIfPhase("read");
    let t = readSeconds;
    setIfReadTimer(t);
    ifReadRef.current = setInterval(() => {
      t--;
      setIfReadTimer(t);
      if (t <= 0) {
        if (ifReadRef.current) clearInterval(ifReadRef.current);
        setIfPhase("hidden");
      }
    }, 1000);
  }
  function handleIfStep(opt: string) {
    if (ifFeedback) return;
    const step = instrSet.steps[ifStepIdx];
    const isCorrect = opt === step.answer;
    const pts = isCorrect ? 100 * config.difficulty : 0;
    setIfScore((s) => s + pts);
    setScore((s) => s + pts);
    setIfFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? `Correct! +${pts} pts`
        : `Wrong. Correct: ${step.answer}`,
    });
    setTimeout(() => {
      setIfFeedback(null);
      if (ifStepIdx + 1 >= instrSet.steps.length) {
        const next = ifIdx + 1;
        if (next >= INSTRUCTION_SETS.length) {
          setIfPhase("done");
          endGame(true);
        } else {
          setIfIdx(next);
          setIfStepIdx(0);
          setIfPhase("start");
        }
      } else setIfStepIdx((s) => s + 1);
    }, 1800);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  // ─── Game 2 render ────────────────────────────────────────────────────────
  if (gameId === "note-taker") {
    return (
      <div
        className="w-full h-full flex flex-col gap-3"
        data-ocid="note_taker.page"
      >
        <div className="game-hud flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#10b981]" />
            <span className="font-bold text-[#00f5ff]">
              {ntScore.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Announcement {ntIdx + 1}/{ANNOUNCEMENTS.length}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#10b981] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {timeLeft}s
          </span>
        </div>
        {ntPhase === "start" && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
            >
              <MessageSquare className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
              <h2
                className="text-3xl font-black glow-cyan-text mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Note Taker
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Read each announcement carefully. It disappears after{" "}
                {readSeconds} seconds. Then identify 5 true key facts and answer
                3 recall questions.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={ntStart}
                data-ocid="note_taker.start_button"
              >
                Read Announcement {ntIdx + 1}
              </GlowButton>
            </motion.div>
          </div>
        )}
        {ntPhase === "read" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="glass-card rounded-xl p-4 border border-[#10b981]/30 shrink-0 flex items-center justify-between">
              <span className="text-xs font-bold text-[#10b981]">
                {ann.title}
              </span>
              <span className="text-xs font-mono text-[#f59e0b]">
                Disappears in {readTimer}s
              </span>
            </div>
            <div className="glass-card rounded-xl p-5 border border-border/30 flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                {ann.text}
              </p>
            </div>
          </div>
        )}
        {ntPhase === "hidden" && (
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-sm font-bold text-foreground shrink-0">
              Announcement is now hidden. Which of these were KEY FACTS in it?
              Mark each as True or False:
            </p>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {allFacts.map((fact, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-3 border border-border/30 flex items-center justify-between gap-3"
                >
                  <p className="text-xs text-foreground flex-1">{fact}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                      style={
                        ntFactAnswers[i] === true
                          ? {
                              background: "#10b98120",
                              color: "#10b981",
                              border: "1px solid #10b981",
                            }
                          : { border: "1px solid rgba(100,100,100,0.3)" }
                      }
                      onClick={() => toggleFactAnswer(i, true)}
                      data-ocid={`note_taker.fact_true.${i + 1}`}
                    >
                      True
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                      style={
                        ntFactAnswers[i] === false
                          ? {
                              background: "#f43f5e20",
                              color: "#f43f5e",
                              border: "1px solid #f43f5e",
                            }
                          : { border: "1px solid rgba(100,100,100,0.3)" }
                      }
                      onClick={() => toggleFactAnswer(i, false)}
                      data-ocid={`note_taker.fact_false.${i + 1}`}
                    >
                      False
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {ntFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg px-3 py-2 text-xs font-medium"
                style={{
                  color: ntFeedback.ok ? "#10b981" : "#f59e0b",
                  background: ntFeedback.ok ? "#10b98115" : "#f59e0b15",
                  border: `1px solid ${ntFeedback.ok ? "#10b981" : "#f59e0b"}`,
                }}
              >
                {ntFeedback.msg}
              </motion.div>
            )}
            <GlowButton
              variant="primary"
              size="md"
              onClick={submitFacts}
              disabled={
                Object.keys(ntFactAnswers).length < allFacts.length ||
                !!ntFeedback
              }
              data-ocid="note_taker.submit_facts_button"
            >
              Submit Facts
            </GlowButton>
          </div>
        )}
        {ntPhase === "questions" && (
          <div className="flex-1 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={ntQIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Q{ntQIdx + 1}/{ann.questions.length} — Recall
                </p>
                <p className="text-lg font-bold text-foreground">
                  {ann.questions[ntQIdx].q}
                </p>
                <div className="flex flex-col gap-2">
                  {ann.questions[ntQIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        ntFeedback
                          ? opt === ann.questions[ntQIdx].answer
                            ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                            : "border-border/20 text-muted-foreground"
                          : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"
                      }`}
                      disabled={!!ntFeedback}
                      onClick={() => handleNtQuestion(opt)}
                      data-ocid={`note_taker.question_option.${i + 1}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {ntFeedback && (
                  <div
                    className={`flex items-center gap-2 text-sm ${ntFeedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                  >
                    {ntFeedback.ok ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {ntFeedback.msg}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  // ─── Game 3 render ────────────────────────────────────────────────────────
  if (gameId === "instruction-follower") {
    return (
      <div
        className="w-full h-full flex flex-col gap-3"
        data-ocid="instruction_follower.page"
      >
        <div className="game-hud flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#f59e0b]" />
            <span className="font-bold text-[#00f5ff]">
              {ifScore.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Set {ifIdx + 1}/{INSTRUCTION_SETS.length}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#f59e0b] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {timeLeft}s
          </span>
        </div>
        {ifPhase === "start" && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
            >
              <MessageSquare className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
              <h2
                className="text-3xl font-black glow-cyan-text mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Instruction Follower
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Read the instruction sequence carefully. It disappears after{" "}
                {readSeconds} seconds. Then recall each step in order.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={ifStart}
                data-ocid="instruction_follower.start_button"
              >
                Read Set {ifIdx + 1}
              </GlowButton>
            </motion.div>
          </div>
        )}
        {ifPhase === "read" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="glass-card rounded-xl p-4 border border-[#f59e0b]/30 flex items-center justify-between shrink-0">
              <span className="text-sm font-bold text-[#f59e0b]">
                {instrSet.title}
              </span>
              <span className="text-xs font-mono text-[#f59e0b]">
                Disappears in {ifReadTimer}s
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {instrSet.instructions.map((inst, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-3 border border-border/30 flex items-center gap-3"
                >
                  <span
                    className="text-lg font-black tabular-nums"
                    style={{ color: "#f59e0b", minWidth: "2rem" }}
                  >
                    {i + 1}.
                  </span>
                  <span className="text-sm text-foreground">{inst}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {ifPhase === "hidden" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="glass-card rounded-xl p-4 border border-border/30">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Instructions hidden. Recall from memory.
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {instrSet.steps[ifStepIdx].prompt}
            </p>
            <div className="flex flex-col gap-2">
              {instrSet.steps[ifStepIdx].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    ifFeedback
                      ? opt === instrSet.steps[ifStepIdx].answer
                        ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                        : "border-border/20 text-muted-foreground"
                      : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"
                  }`}
                  disabled={!!ifFeedback}
                  onClick={() => handleIfStep(opt)}
                  data-ocid={`instruction_follower.step_option.${i + 1}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {ifFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-2 text-sm ${ifFeedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
              >
                {ifFeedback.ok ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {ifFeedback.msg}
              </motion.div>
            )}
            <p className="text-xs text-muted-foreground">
              Step {ifStepIdx + 1} of {instrSet.steps.length}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─── Default: audio-detective ────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="listening_challenge.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-[#7c3aed]" />
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
            <Headphones className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Audio Detective
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              A dialogue transcript will appear word by word. Fill in the
              missing word as it plays.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Then answer comprehension questions and identify the speaker's
              emotion.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setPhase("transcript")}
              data-ocid="listening_challenge.start_button"
            >
              Begin Session
            </GlowButton>
          </motion.div>
        </div>
      )}

      {phase === "transcript" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-xl p-3 border border-[#7c3aed]/30 shrink-0">
            <p className="text-xs text-muted-foreground">
              <span className="text-[#7c3aed] font-bold">Context:</span>{" "}
              {scenario.context}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {scenario.lines.slice(0, revealedLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-2 ${line.speaker === scenario.lines[0].speaker ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs rounded-xl px-3 py-2 ${line.speaker === scenario.lines[0].speaker ? "bg-[#7c3aed]/20 border border-[#7c3aed]/30" : "bg-[#00f5ff]/10 border border-[#00f5ff]/30"}`}
                >
                  <p className="text-xs font-bold text-muted-foreground mb-1">
                    {line.speaker}
                  </p>
                  <p className="text-sm text-foreground">
                    {line.text}
                    {line.blank ? " ___" : ""}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {phase === "blanks" && blankLine?.blank && (
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Fill in the missing word from the transcript:
          </p>
          <div className="glass-card rounded-2xl p-5 neon-top-border">
            <p className="text-xs font-bold text-muted-foreground mb-1">
              {blankLine.speaker}
            </p>
            <p className="text-sm text-foreground italic">
              "...{blankLine.text}{" "}
              <span className="text-[#f59e0b] font-bold underline">___</span>
              ..."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {blankLine.blank.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                disabled={!!feedback || !!blankAnswer}
                onClick={() => handleBlank(opt)}
                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                  blankAnswer === opt
                    ? opt === blankLine!.blank!.answer
                      ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                      : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                    : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"
                }`}
                data-ocid={`listening_challenge.blank.${i + 1}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-xl border flex items-center gap-2 ${feedback.ok ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`}
            >
              {feedback.ok ? (
                <CheckCircle className="h-4 w-4 text-[#10b981]" />
              ) : (
                <XCircle className="h-4 w-4 text-[#f43f5e]" />
              )}
              <p
                className={`text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
              >
                {feedback.msg}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {phase === "questions" && (
        <div className="flex-1 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {scenario.questions[qIdx].type} — Q{qIdx + 1}/
                {scenario.questions.length}
              </p>
              <p className="text-lg font-bold text-foreground">
                {scenario.questions[qIdx].q}
              </p>
              <div className="flex flex-col gap-2">
                {scenario.questions[qIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleQuestion(opt)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      feedback
                        ? opt === scenario.questions[qIdx].answer
                          ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                          : "border-border/20 text-muted-foreground"
                        : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"
                    }`}
                    data-ocid={`listening_challenge.question_option.${i + 1}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-2 text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback.ok ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {feedback.msg}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === "final" && (
        <div className="flex-1 flex flex-col gap-4">
          {!emotionDone ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <p className="text-sm font-bold text-foreground">
                What was the overall emotional tone of this conversation?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {scenario.emotionOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleEmotion(opt)}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      feedback
                        ? opt === scenario.emotion
                          ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                          : "border-border/20 text-muted-foreground"
                        : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"
                    }`}
                    data-ocid={`listening_challenge.emotion.${i + 1}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-2 text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback.ok ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {feedback.msg}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <p className="text-sm font-bold text-foreground">
                What was the main topic of this dialogue?
              </p>
              <div className="flex flex-col gap-2">
                {scenario.topicOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleTopic(opt)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      feedback
                        ? opt === scenario.mainTopic
                          ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                          : "border-border/20 text-muted-foreground"
                        : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"
                    }`}
                    data-ocid={`listening_challenge.topic.${i + 1}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-2 text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback.ok ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {feedback.msg}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
