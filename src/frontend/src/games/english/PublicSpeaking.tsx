import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Mic2, Users, XCircle } from "lucide-react";
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

// ─── Game 1 data (speech-architect — existing) ────────────────────────────────────
interface SpeechComponent {
  id: string;
  label: string;
  content: string;
  score: number;
  technique: string;
}
interface SpeechTopic {
  topic: string;
  motion: string;
  hooks: SpeechComponent[];
  points: SpeechComponent[];
  evidences: { pointId: string; evidence: SpeechComponent }[];
  counterArgs: SpeechComponent[];
  conclusions: SpeechComponent[];
}
const TOPICS: Record<1 | 2 | 3, SpeechTopic> = {
  1: {
    topic: "Why We Should Eat More Vegetables",
    motion: "Vegetables should form the majority of every meal.",
    hooks: [
      {
        id: "h1",
        label: "Rhetorical Question",
        content:
          "If you could add five years to your life with one simple change, wouldn't you take it?",
        score: 90,
        technique: "Rhetorical question creates immediate engagement",
      },
      {
        id: "h2",
        label: "Surprising Statistic",
        content:
          "Approximately 3.9 million deaths per year are caused by insufficient vegetable consumption.",
        score: 85,
        technique: "Statistics create credibility and shock value",
      },
      {
        id: "h3",
        label: "Weak Anecdote",
        content: "I once ate a salad and it was quite nice.",
        score: 20,
        technique: "Too vague; lacks impact or relevance",
      },
    ],
    points: [
      {
        id: "p1",
        content:
          "Vegetables provide essential vitamins, minerals, and fibre that prevent chronic disease.",
        label: "Health benefit",
        score: 85,
        technique: "Clear and factual",
      },
      {
        id: "p2",
        content:
          "Plant-based diets have a significantly lower carbon footprint than meat-heavy diets.",
        label: "Environmental benefit",
        score: 80,
        technique: "Appeals to wider social responsibility",
      },
      {
        id: "p3",
        content:
          "Vegetables are generally cheaper than processed foods, making them accessible to all.",
        label: "Economic benefit",
        score: 75,
        technique: "Addresses a common objection preemptively",
      },
      {
        id: "p4",
        content:
          "Many people dislike vegetables because of poor preparation techniques.",
        label: "Weak point",
        score: 15,
        technique: "This supports the opposition, not your argument",
      },
      {
        id: "p5",
        content: "My friend is vegetarian and seems very healthy.",
        label: "Anecdotal weak point",
        score: 10,
        technique: "Personal anecdote with no data backing",
      },
    ],
    evidences: [
      {
        pointId: "p1",
        evidence: {
          id: "e1",
          content:
            "A Harvard study of 110,000 people found that eating fruits and vegetables daily reduced heart disease risk by 30%.",
          label: "Research evidence",
          score: 90,
          technique: "Specific, credible, quantified",
        },
      },
      {
        pointId: "p2",
        evidence: {
          id: "e2",
          content:
            "The UN FAO reports that livestock production accounts for 14.5% of global greenhouse gas emissions.",
          label: "Authority evidence",
          score: 88,
          technique: "UN source adds institutional authority",
        },
      },
      {
        pointId: "p3",
        evidence: {
          id: "e3",
          content:
            "In most countries, a kilogram of carrots costs a fraction of a kilogram of beef.",
          label: "Comparative evidence",
          score: 70,
          technique: "Relatable comparison but imprecise",
        },
      },
    ],
    counterArgs: [
      {
        id: "ca1",
        content:
          "Some argue that vegetables are expensive or inaccessible in food deserts — however, government subsidies and community gardens have addressed this in many regions.",
        label: "Addresses access barrier",
        score: 90,
        technique: "Acknowledge + refute = sophisticated rebuttal",
      },
      {
        id: "ca2",
        content:
          "Critics say vegetables taste bad, but that is merely a matter of preference and preparation.",
        label: "Taste objection",
        score: 70,
        technique: "Valid but slightly dismissive",
      },
      {
        id: "ca3",
        content:
          "Some people are allergic to vegetables, so this recommendation doesn't apply to them.",
        label: "Weak concession",
        score: 20,
        technique: "Extreme edge case undermines broader argument",
      },
    ],
    conclusions: [
      {
        id: "con1",
        content:
          "The science is clear, the planet is at stake, and your health is in your hands. Choose vegetables, choose life.",
        label: "Call to action",
        score: 90,
        technique: "Three-part parallel structure with a memorable final line",
      },
      {
        id: "con2",
        content: "So in summary, vegetables are good. Thank you.",
        label: "Weak summary",
        score: 15,
        technique: "No emotional resonance or call to action",
      },
      {
        id: "con3",
        content:
          "I hope I have convinced you today that dietary choices matter enormously. The evidence demands action.",
        label: "Appeal to reason",
        score: 80,
        technique: "Formal and logical, but lacks punch",
      },
    ],
  },
  2: {
    topic: "Artificial Intelligence in Education",
    motion: "AI should be integrated into all school curricula immediately.",
    hooks: [
      {
        id: "h1",
        label: "Bold Claim",
        content:
          "In ten years, a student without AI literacy will face the same disadvantage as a student without reading skills today.",
        score: 92,
        technique: "Bold claim creates urgency",
      },
      {
        id: "h2",
        label: "Historical Parallel",
        content:
          "When calculators entered classrooms, mathematicians predicted disaster. Instead, deeper mathematical thinking flourished.",
        score: 88,
        technique: "Historical parallel disarms a common objection",
      },
      {
        id: "h3",
        label: "Vague Statement",
        content:
          "Artificial intelligence is very important to the future of everything.",
        score: 18,
        technique: "Too vague; no specificity or impact",
      },
    ],
    points: [
      {
        id: "p1",
        content:
          "AI tutoring systems can provide personalised, adaptive learning that traditional one-teacher-to-30-students ratios cannot replicate.",
        label: "Personalisation",
        score: 88,
        technique: "Directly addresses a real systemic gap",
      },
      {
        id: "p2",
        content:
          "Teaching AI literacy prepares students for a job market where 85% of roles by 2030 will require digital and AI competence.",
        label: "Future readiness",
        score: 85,
        technique: "Data-backed forward projection",
      },
      {
        id: "p3",
        content:
          "AI tools can automate grading, freeing teachers to focus on mentoring and creative instruction.",
        label: "Teacher efficiency",
        score: 80,
        technique: "Reframes AI as complement to, not replacement of, teachers",
      },
      {
        id: "p4",
        content: "Some students might use AI to cheat on assignments.",
        label: "Weak point",
        score: 12,
        technique: "This supports the opposition",
      },
      {
        id: "p5",
        content: "AI is very popular these days so schools should use it too.",
        label: "Bandwagon fallacy",
        score: 5,
        technique: "Logical fallacy: appeal to popularity",
      },
    ],
    evidences: [
      {
        pointId: "p1",
        evidence: {
          id: "e1",
          content:
            "A RAND Corporation study found AI tutoring systems improved student outcomes by 20–40% over standard instruction for mathematics.",
          label: "Research",
          score: 92,
          technique: "Specific study, quantified improvement",
        },
      },
      {
        pointId: "p2",
        evidence: {
          id: "e2",
          content:
            "The World Economic Forum's Future of Jobs report projects 85 million job displacement and 97 million new roles by 2025, heavily favouring AI-literate workers.",
          label: "WEF projection",
          score: 90,
          technique: "Prestigious source with concrete numbers",
        },
      },
      {
        pointId: "p3",
        evidence: {
          id: "e3",
          content:
            "Teachers in AI-assisted classrooms report spending 30% more time on student engagement versus administrative tasks.",
          label: "Survey data",
          score: 82,
          technique: "Practical impact on teaching quality",
        },
      },
    ],
    counterArgs: [
      {
        id: "ca1",
        content:
          "Opponents worry AI will widen the digital divide — yet universal AI access programs, like those in South Korea and Estonia, demonstrate that targeted investment eliminates this barrier.",
        label: "Equity objection",
        score: 92,
        technique: "Specific examples validate the refutation",
      },
      {
        id: "ca2",
        content:
          "Some argue AI promotes laziness — however, evidence shows AI tools are most effective when designed to scaffold rather than substitute student thinking.",
        label: "Critical thinking concern",
        score: 88,
        technique: "Nuanced rebuttal",
      },
      {
        id: "ca3",
        content:
          "The internet was once considered a distraction too, and look how education embraced it.",
        label: "Weak analogy",
        score: 55,
        technique: "Analogy is apt but oversimplified",
      },
    ],
    conclusions: [
      {
        id: "con1",
        content:
          "The question is not whether AI will transform education. It already is. The only question is whether we will equip our students to lead that transformation or be left behind by it.",
        label: "Reframe conclusion",
        score: 95,
        technique: "Shifts burden to audience, memorable final contrast",
      },
      {
        id: "con2",
        content:
          "AI in education is very exciting. Please vote for the motion.",
        label: "Weak close",
        score: 10,
        technique: "No structure, no rhetoric, no impact",
      },
      {
        id: "con3",
        content:
          "The evidence presented today is unambiguous: AI integration is not optional — it is an imperative. I urge your full support of this motion.",
        label: "Direct call",
        score: 82,
        technique: "Clear and direct but less memorable",
      },
    ],
  },
  3: {
    topic: "Universal Basic Income",
    motion:
      "All governments should implement Universal Basic Income immediately.",
    hooks: [
      {
        id: "h1",
        label: "Paradox Opening",
        content:
          "We live in the most productive era in human history, yet almost half the world's workers cannot afford basic security. That paradox ends today.",
        score: 95,
        technique: "Paradox + declarative finale creates rhetorical power",
      },
      {
        id: "h2",
        label: "Counter-narrative",
        content:
          "Every objection to UBI has been raised before — about child labour laws, the minimum wage, and Social Security. Every time, the objectors were proved catastrophically wrong.",
        score: 88,
        technique: "Historical pattern challenges audience assumptions",
      },
      {
        id: "h3",
        label: "Definition opener",
        content:
          "Universal Basic Income is a policy where the government gives every citizen a fixed sum monthly.",
        score: 30,
        technique: "Definitions are weak openers — no rhetorical energy",
      },
    ],
    points: [
      {
        id: "p1",
        content:
          "UBI eliminates poverty traps by ensuring income does not disappear when recipients accept work, incentivising participation rather than dependency.",
        label: "Incentive structure",
        score: 90,
        technique: "Directly addresses the 'disincentive to work' objection",
      },
      {
        id: "p2",
        content:
          "Automation will displace 40% of current jobs by 2040 — UBI is the only proven mechanism for distributing technological productivity gains equitably.",
        label: "Automation hedge",
        score: 88,
        technique: "Forward-looking, data-backed, urgency-driven",
      },
      {
        id: "p3",
        content:
          "The Stockton SEED pilot demonstrated that UBI recipients found full-time employment 40% faster than control groups.",
        label: "Empirical evidence",
        score: 92,
        technique: "Named pilot study with counter-intuitive data",
      },
      {
        id: "p4",
        content: "Some rich countries might be able to afford UBI.",
        label: "Weak conditional",
        score: 15,
        technique: "Hedge undermines the universal claim",
      },
      {
        id: "p5",
        content:
          "People deserve more money and the government should help them.",
        label: "Vague appeal",
        score: 8,
        technique: "No mechanism, no evidence, no specificity",
      },
    ],
    evidences: [
      {
        pointId: "p1",
        evidence: {
          id: "e1",
          content:
            "The Finnish UBI experiment found recipients reported higher wellbeing, greater trust in institutions, and no reduction in employment compared to the control group.",
          label: "Finnish experiment",
          score: 92,
          technique: "Named experiment, multi-dimensional outcomes",
        },
      },
      {
        pointId: "p2",
        evidence: {
          id: "e2",
          content:
            "McKinsey Global Institute projects that automation could displace 375 million workers globally by 2030, representing 14% of the global workforce.",
          label: "McKinsey projection",
          score: 90,
          technique: "Prestigious source, massive scale, near-term urgency",
        },
      },
      {
        pointId: "p3",
        evidence: {
          id: "e3",
          content:
            "A 2021 review of 48 UBI pilot studies across 7 countries found consistent improvements in health, education, and social trust outcomes.",
          label: "Meta-analysis",
          score: 95,
          technique: "Meta-analysis is gold standard evidence",
        },
      },
    ],
    counterArgs: [
      {
        id: "ca1",
        content:
          "Critics argue UBI is unaffordable — yet Andrew Yang's analysis showed funding UBI via a 10% VAT and consolidating existing welfare programmes creates a net-zero fiscal impact.",
        label: "Fiscal objection",
        score: 94,
        technique: "Specific named policy mechanism with fiscal model",
      },
      {
        id: "ca2",
        content:
          "The inflation risk is real but manageable: UBI redistributes existing money rather than creating new money supply, as demonstrated by the Alaska Permanent Fund's 40-year record.",
        label: "Inflation risk",
        score: 92,
        technique: "Longest-running UBI precedent neutralises the objection",
      },
      {
        id: "ca3",
        content:
          "Not everyone agrees with UBI, but that doesn't mean it's wrong.",
        label: "Weak rebuttal",
        score: 10,
        technique: "Adds no argumentative value",
      },
    ],
    conclusions: [
      {
        id: "con1",
        content:
          "History will not judge us by our GDP. It will judge us by whether we used our unprecedented wealth to guarantee every human being a foundation of dignity. The evidence is in. The pilots are complete. The time for UBI is now.",
        label: "Legacy appeal",
        score: 98,
        technique: "Three-part build, historical framing, final declarative",
      },
      {
        id: "con2",
        content: "For these reasons, UBI is a good idea and I recommend it.",
        label: "Weak summary",
        score: 12,
        technique: "No rhetoric, no emotion, no call to action",
      },
      {
        id: "con3",
        content:
          "The data speaks clearly: UBI works. I urge every member of this audience to support immediate implementation.",
        label: "Data-led close",
        score: 78,
        technique: "Factual but emotionally flat",
      },
    ],
  },
};
type BuildStep = "hook" | "points" | "evidence" | "counter" | "conclusion";
const STEPS: BuildStep[] = [
  "hook",
  "points",
  "evidence",
  "counter",
  "conclusion",
];

// ─── Game 2: confidence-builder ─────────────────────────────────────────────────

const BEHAVIORS: {
  text: string;
  category: "Confident" | "Unconfident" | "Neutral";
}[] = [
  {
    text: "Maintains steady eye contact with the audience throughout the speech.",
    category: "Confident",
  },
  {
    text: "Reads directly from notes without looking up.",
    category: "Unconfident",
  },
  {
    text: "Uses varied vocal pace to emphasise key points.",
    category: "Confident",
  },
  {
    text: "Fidgets with hands and shifts weight between feet.",
    category: "Unconfident",
  },
  {
    text: "Stands in a neutral position with arms relaxed at sides.",
    category: "Neutral",
  },
  {
    text: "Speaks in a flat monotone with no variation.",
    category: "Unconfident",
  },
  {
    text: "Pauses deliberately for emphasis before a key statement.",
    category: "Confident",
  },
  {
    text: "Apologises before beginning: 'Sorry, I'm not very good at this'.",
    category: "Unconfident",
  },
  { text: "Uses open gestures to reinforce points.", category: "Confident" },
  {
    text: "Reads from the script without any deviation.",
    category: "Unconfident",
  },
];
interface DeliveryAssessment {
  title: string;
  description: string;
  correctRatings: {
    eyeContact: number;
    voice: number;
    bodyLanguage: number;
    clarity: number;
  };
}
const DELIVERIES: DeliveryAssessment[] = [
  {
    title: "Student Council Speech",
    description:
      "The speaker stands at the front, looks up frequently but returns to notes. Speaks at a steady pace with clear pronunciation. Hands remain still but gestures are minimal. The message is organised and easy to follow.",
    correctRatings: { eyeContact: 3, voice: 4, bodyLanguage: 3, clarity: 4 },
  },
  {
    title: "Class Presentation",
    description:
      "The speaker reads entirely from the paper, never making eye contact. Voice is clear but lacks energy. Body is stiff throughout. The content is accurate and well-structured.",
    correctRatings: { eyeContact: 1, voice: 3, bodyLanguage: 1, clarity: 4 },
  },
  {
    title: "Assembly Speech",
    description:
      "The speaker maintains confident eye contact, uses varied pitch and volume, and moves naturally on stage. Some words are rushed in the middle section. The audience is clearly engaged.",
    correctRatings: { eyeContact: 5, voice: 4, bodyLanguage: 5, clarity: 3 },
  },
];

// ─── Game 3: debate-prep ───────────────────────────────────────────────────────

interface Proposition {
  motion: string;
  arguments: {
    text: string;
    strength: "strong" | "weak" | "fallacy";
    rank?: number;
  }[];
  strongIndices: number[];
  fallacyIndex: number;
}
const PROPOSITIONS: Proposition[] = [
  {
    motion: "School uniforms should be compulsory.",
    arguments: [
      {
        text: "Uniforms reduce visible socioeconomic inequality, allowing students to focus on learning.",
        strength: "strong",
        rank: 1,
      },
      {
        text: "Studies show uniform schools report lower rates of bullying related to clothing.",
        strength: "strong",
        rank: 2,
      },
      {
        text: "A uniform policy simplifies morning routines and reduces decision fatigue.",
        strength: "strong",
        rank: 3,
      },
      {
        text: "All schools in other countries use uniforms, so we should too.",
        strength: "fallacy",
      },
      {
        text: "Students who wear uniforms are generally nicer people.",
        strength: "weak",
      },
      {
        text: "My parents liked uniforms, so they must be good.",
        strength: "weak",
      },
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3,
  },
  {
    motion: "Mobile phones should be banned in schools.",
    arguments: [
      {
        text: "Research shows mobile phone use in class correlates with a 23% reduction in student attentiveness.",
        strength: "strong",
        rank: 1,
      },
      {
        text: "Banning phones reduces cyberbullying incidents that originate on school grounds.",
        strength: "strong",
        rank: 2,
      },
      {
        text: "Phone-free environments improve face-to-face communication skills.",
        strength: "strong",
        rank: 3,
      },
      {
        text: "Everyone uses phones, so banning them proves nothing.",
        strength: "fallacy",
      },
      {
        text: "My teacher once used a phone in class, so students should be allowed to.",
        strength: "weak",
      },
      {
        text: "Phones are expensive, therefore they should not be in school.",
        strength: "weak",
      },
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3,
  },
  {
    motion: "Physical education should be mandatory every day.",
    arguments: [
      {
        text: "Daily physical activity improves cognitive performance, with studies showing a 20% improvement in memory consolidation.",
        strength: "strong",
        rank: 1,
      },
      {
        text: "Childhood obesity rates drop by 30% in schools with daily PE requirements.",
        strength: "strong",
        rank: 2,
      },
      {
        text: "PE builds teamwork, resilience, and leadership skills transferable across subjects.",
        strength: "strong",
        rank: 3,
      },
      {
        text: "Sports stars are successful, so all students should do PE every day.",
        strength: "fallacy",
      },
      {
        text: "Exercise is good, so more must always be better.",
        strength: "weak",
      },
      { text: "I enjoy PE, so everyone else must too.", strength: "weak" },
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3,
  },
  {
    motion: "Homework should be abolished in primary school.",
    arguments: [
      {
        text: "Research by John Hattie shows homework has minimal impact on primary school achievement compared to other interventions.",
        strength: "strong",
        rank: 1,
      },
      {
        text: "Excessive homework creates stress and reduces family bonding time, harming overall child development.",
        strength: "strong",
        rank: 2,
      },
      {
        text: "Learning time is more effectively used through quality teaching during school hours.",
        strength: "strong",
        rank: 3,
      },
      {
        text: "Countries with no homework are automatically better at education.",
        strength: "fallacy",
      },
      {
        text: "Children prefer not to have homework, so it should be abolished.",
        strength: "weak",
      },
      {
        text: "My cousin didn't do homework and turned out fine.",
        strength: "weak",
      },
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3,
  },
  {
    motion: "Social media companies should be regulated by governments.",
    arguments: [
      {
        text: "Unregulated social media platforms have been linked to rising rates of teen anxiety and depression, according to multiple longitudinal studies.",
        strength: "strong",
        rank: 1,
      },
      {
        text: "Government regulation can enforce data privacy protections that platforms currently self-administer inadequately.",
        strength: "strong",
        rank: 2,
      },
      {
        text: "Regulated platforms in the EU under GDPR have shown measurable improvements in user data protection.",
        strength: "strong",
        rank: 3,
      },
      {
        text: "Facebook is evil, therefore all social media must be regulated.",
        strength: "fallacy",
      },
      {
        text: "Many people dislike social media, so it should be controlled.",
        strength: "weak",
      },
      {
        text: "Governments are always right when they regulate things.",
        strength: "weak",
      },
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3,
  },
];

export default function PublicSpeaking({ config, onGameEnd }: Props) {
  const gameId = config.gameId;
  const topic = TOPICS[config.difficulty];

  // Game 1 state
  const [phase, setPhase] = useState<"idle" | "build" | "review">("idle");
  const [step, setStep] = useState<BuildStep>("hook");
  const [selections, setSelections] = useState<
    Record<BuildStep, string | null>
  >({
    hook: null,
    points: null,
    evidence: null,
    counter: null,
    conclusion: null,
  });
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [audienceScore, setAudienceScore] = useState(50);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    pts: number;
    msg: string;
  } | null>(null);

  // Game 2 state
  const [cbPhase, setCbPhase] = useState<
    "start" | "behaviors" | "delivery" | "done"
  >("start");
  const [cbBehaviorIdx, setCbBehaviorIdx] = useState(0);
  const [cbDeliveryIdx, setCbDeliveryIdx] = useState(0);
  const [cbScore, setCbScore] = useState(0);
  const [cbFeedback, setCbFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [cbSliders, setCbSliders] = useState({
    eyeContact: 3,
    voice: 3,
    bodyLanguage: 3,
    clarity: 3,
  });
  const [cbSliderSubmitted, setCbSliderSubmitted] = useState(false);

  // Game 3 state
  const [dpPhase, setDpPhase] = useState<"start" | "select" | "rank" | "done">(
    "start",
  );
  const [dpIdx, setDpIdx] = useState(0);
  const [dpSelected, setDpSelected] = useState<number[]>([]);
  const [dpFallacyPick, setDpFallacyPick] = useState<number | null>(null);
  const [dpRanks, setDpRanks] = useState<Record<number, number>>({});
  const [dpScore, setDpScore] = useState(0);
  const [dpFeedback, setDpFeedback] = useState<{
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
  const timePct = (timeLeft / config.timeLimit) * 100;
  const audiencePct = audienceScore;

  // Game 1 handlers
  function selectComponent(component: SpeechComponent, key: BuildStep) {
    if (feedback) return;
    const pts = component.score * config.difficulty;
    setTotal((t) => t + 1);
    if (component.score >= 70) {
      setCorrect((c) => c + 1);
      setScore((s) => s + pts);
    }
    setAudienceScore((a) =>
      Math.min(100, Math.max(0, a + (component.score >= 70 ? 8 : -12))),
    );
    setSelections((s) => ({ ...s, [key]: component.id }));
    setFeedback({ ok: component.score >= 70, pts, msg: component.technique });
    setTimeout(() => {
      setFeedback(null);
      const nextIdx = STEPS.indexOf(key) + 1;
      if (nextIdx >= STEPS.length) setPhase("review");
      else setStep(STEPS[nextIdx]);
    }, 2200);
  }
  function selectPoint(pid: string) {
    if (selectedPoints.includes(pid))
      setSelectedPoints((p) => p.filter((x) => x !== pid));
    else if (selectedPoints.length < 3) setSelectedPoints((p) => [...p, pid]);
  }
  function submitPoints() {
    if (selectedPoints.length < 3) return;
    let pts = 0;
    let c = 0;
    selectedPoints.forEach((pid) => {
      const p = topic.points.find((x) => x.id === pid)!;
      if (p.score >= 70) {
        pts += p.score * config.difficulty;
        c++;
      }
    });
    setTotal((t) => t + 3);
    setCorrect((cr) => cr + c);
    setScore((s) => s + pts);
    setAudienceScore((a) => Math.min(100, a + (c >= 2 ? 10 : -8)));
    setSelections((s) => ({ ...s, points: selectedPoints.join(",") }));
    setFeedback({ ok: c >= 2, pts, msg: `Selected ${c}/3 strong arguments.` });
    setTimeout(() => {
      setFeedback(null);
      setStep("evidence");
    }, 2200);
  }

  // Game 2 handlers
  function cbStart() {
    startTime.current = Date.now();
    setCbPhase("behaviors");
  }
  function handleBehavior(category: "Confident" | "Unconfident" | "Neutral") {
    if (cbFeedback) return;
    const beh = BEHAVIORS[cbBehaviorIdx];
    const isCorrect = category === beh.category;
    const pts = isCorrect ? 60 * config.difficulty : 0;
    setCbScore((s) => s + pts);
    setScore((s) => s + pts);
    setCbFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? `Correct: ${beh.category}. +${pts} pts`
        : `Wrong. This behaviour is ${beh.category}.`,
    });
    setTimeout(() => {
      setCbFeedback(null);
      if (cbBehaviorIdx + 1 >= BEHAVIORS.length) setCbPhase("delivery");
      else setCbBehaviorIdx((i) => i + 1);
    }, 1800);
  }
  function submitDelivery() {
    if (cbSliderSubmitted) return;
    const delivery = DELIVERIES[cbDeliveryIdx];
    const correct = delivery.correctRatings;
    const diff =
      Math.abs(cbSliders.eyeContact - correct.eyeContact) +
      Math.abs(cbSliders.voice - correct.voice) +
      Math.abs(cbSliders.bodyLanguage - correct.bodyLanguage) +
      Math.abs(cbSliders.clarity - correct.clarity);
    const pts = Math.max(0, (8 - diff) * 30 * config.difficulty);
    setCbScore((s) => s + pts);
    setScore((s) => s + pts);
    setCbSliderSubmitted(true);
    setCbFeedback({
      ok: diff <= 4,
      msg: `Accuracy: ${Math.max(0, 100 - diff * 12)}%. +${pts} pts. Correct: Eye ${correct.eyeContact} / Voice ${correct.voice} / Body ${correct.bodyLanguage} / Clarity ${correct.clarity}`,
    });
    setTimeout(() => {
      setCbFeedback(null);
      setCbSliderSubmitted(false);
      if (cbDeliveryIdx + 1 >= DELIVERIES.length) {
        setCbPhase("done");
        endGame(true);
      } else {
        setCbDeliveryIdx((i) => i + 1);
        setCbSliders({ eyeContact: 3, voice: 3, bodyLanguage: 3, clarity: 3 });
      }
    }, 2500);
  }

  // Game 3 handlers
  const prop = PROPOSITIONS[dpIdx % PROPOSITIONS.length];
  function dpStart() {
    startTime.current = Date.now();
    setDpPhase("select");
  }
  function toggleDpArg(i: number) {
    if (dpSelected.includes(i)) setDpSelected((p) => p.filter((x) => x !== i));
    else if (dpSelected.length < 3) setDpSelected((p) => [...p, i]);
  }
  function submitDpSelection() {
    if (dpSelected.length !== 3 || dpFallacyPick === null) return;
    const correctStrong = dpSelected.filter((i) =>
      prop.strongIndices.includes(i),
    ).length;
    const fallacyCorrect = dpFallacyPick === prop.fallacyIndex;
    const pts =
      (correctStrong * 80 + (fallacyCorrect ? 100 : 0)) * config.difficulty;
    setDpScore((s) => s + pts);
    setScore((s) => s + pts);
    setDpFeedback({
      ok: correctStrong >= 2 && fallacyCorrect,
      msg: `${correctStrong}/3 strong arguments correct. Fallacy ${fallacyCorrect ? "correctly" : "incorrectly"} identified. +${pts} pts`,
    });
    setTimeout(() => {
      setDpFeedback(null);
      setDpPhase("rank");
    }, 2000);
  }
  function setRank(argIdx: number, rank: number) {
    setDpRanks((prev) => ({ ...prev, [argIdx]: rank }));
  }
  function submitRanks() {
    const strongArgs = dpSelected.filter((i) => prop.strongIndices.includes(i));
    let correctRanks = 0;
    strongArgs.forEach((argIdx) => {
      const arg = prop.arguments[argIdx];
      if (arg.rank && dpRanks[argIdx] === arg.rank) correctRanks++;
    });
    const pts = correctRanks * 100 * config.difficulty;
    setDpScore((s) => s + pts);
    setScore((s) => s + pts);
    setDpFeedback({
      ok: correctRanks >= 2,
      msg: `${correctRanks}/3 ranks correct. +${pts} pts`,
    });
    setTimeout(() => {
      setDpFeedback(null);
      const next = dpIdx + 1;
      if (next >= PROPOSITIONS.length) {
        setDpPhase("done");
        endGame(true);
      } else {
        setDpIdx(next);
        setDpPhase("select");
        setDpSelected([]);
        setDpFallacyPick(null);
        setDpRanks({});
      }
    }, 2000);
  }

  // ─── Game 2 render ────────────────────────────────────────────────────────
  if (gameId === "confidence-builder") {
    return (
      <div
        className="w-full h-full flex flex-col gap-3"
        data-ocid="confidence_builder.page"
      >
        <div className="game-hud flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-[#f59e0b]" />
            <span className="font-bold text-[#00f5ff]">
              {cbScore.toLocaleString()}
            </span>
          </div>
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#f59e0b] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {timeLeft}s
          </span>
        </div>
        {cbPhase === "start" && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
            >
              <Mic2 className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
              <h2
                className="text-3xl font-black glow-cyan-text mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Confidence Builder
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Classify 10 speaker behaviours as Confident, Unconfident, or
                Neutral. Then rate 3 full speech deliveries across 4 dimensions.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={cbStart}
                data-ocid="confidence_builder.start_button"
              >
                Start Assessment
              </GlowButton>
            </motion.div>
          </div>
        )}
        {cbPhase === "behaviors" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="glass-card rounded-xl p-3 border border-[#f59e0b]/30 shrink-0">
              <p className="text-xs font-bold text-[#f59e0b] uppercase tracking-widest">
                Behaviour {cbBehaviorIdx + 1}/10
              </p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-border/30 flex-1 flex flex-col justify-center">
              <p className="text-sm font-semibold text-foreground text-center">
                {BEHAVIORS[cbBehaviorIdx].text}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["Confident", "Unconfident", "Neutral"] as const).map(
                (cat, i) => (
                  <button
                    key={i}
                    type="button"
                    className="px-3 py-3 rounded-xl border text-sm font-bold transition-all disabled:opacity-50"
                    style={
                      i === 0
                        ? { borderColor: "#10b981", color: "#10b981" }
                        : i === 1
                          ? { borderColor: "#f43f5e", color: "#f43f5e" }
                          : { borderColor: "#f59e0b", color: "#f59e0b" }
                    }
                    disabled={!!cbFeedback}
                    onClick={() => handleBehavior(cat)}
                    data-ocid={`confidence_builder.category.${i + 1}`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
            {cbFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg px-3 py-2 text-xs font-medium"
                style={{
                  color: cbFeedback.ok ? "#10b981" : "#f43f5e",
                  background: cbFeedback.ok ? "#10b98115" : "#f43f5e15",
                  border: `1px solid ${cbFeedback.ok ? "#10b981" : "#f43f5e"}`,
                }}
              >
                {cbFeedback.msg}
              </motion.div>
            )}
          </div>
        )}
        {cbPhase === "delivery" && (
          <div className="flex-1 flex flex-col gap-3 overflow-auto">
            <div className="glass-card rounded-xl p-4 border border-border/30">
              <p className="text-xs font-bold text-[#f59e0b] mb-1">
                Delivery {cbDeliveryIdx + 1}/{DELIVERIES.length} —{" "}
                {DELIVERIES[cbDeliveryIdx].title}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {DELIVERIES[cbDeliveryIdx].description}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Rate this delivery on each dimension (1=Poor, 5=Excellent):
            </p>
            {(["eyeContact", "voice", "bodyLanguage", "clarity"] as const).map(
              (dim) => (
                <div
                  key={dim}
                  className="glass-card rounded-xl p-3 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground capitalize">
                      {dim.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-xs font-mono text-[#f59e0b]">
                      {cbSliders[dim]}/5
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        className="flex-1 h-8 rounded-lg border text-xs font-bold transition-all"
                        style={
                          cbSliders[dim] === v
                            ? {
                                borderColor: "#f59e0b",
                                background: "#f59e0b20",
                                color: "#f59e0b",
                              }
                            : { borderColor: "rgba(100,100,100,0.3)" }
                        }
                        onClick={() =>
                          setCbSliders((s) => ({ ...s, [dim]: v }))
                        }
                        data-ocid={`confidence_builder.${dim}.${v}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}
            {cbFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg px-3 py-2 text-xs font-medium"
                style={{
                  color: cbFeedback.ok ? "#10b981" : "#f59e0b",
                  background: cbFeedback.ok ? "#10b98115" : "#f59e0b15",
                  border: `1px solid ${cbFeedback.ok ? "#10b981" : "#f59e0b"}`,
                }}
              >
                {cbFeedback.msg}
              </motion.div>
            )}
            <GlowButton
              variant="primary"
              onClick={submitDelivery}
              disabled={cbSliderSubmitted}
              data-ocid="confidence_builder.submit_delivery_button"
            >
              Submit Rating
            </GlowButton>
          </div>
        )}
      </div>
    );
  }

  // ─── Game 3 render ────────────────────────────────────────────────────────
  if (gameId === "debate-prep") {
    return (
      <div
        className="w-full h-full flex flex-col gap-3"
        data-ocid="debate_prep.page"
      >
        <div className="game-hud flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-[#7c3aed]" />
            <span className="font-bold text-[#00f5ff]">
              {dpScore.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Proposition {dpIdx + 1}/{PROPOSITIONS.length}
          </span>
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#7c3aed] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {timeLeft}s
          </span>
        </div>
        {dpPhase === "start" && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
            >
              <Mic2 className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
              <h2
                className="text-3xl font-black glow-cyan-text mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Debate Prep
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Select the 3 strongest supporting arguments, identify the 1
                logical fallacy, then rank your 3 arguments by strength.
              </p>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={dpStart}
                data-ocid="debate_prep.start_button"
              >
                Begin Prep
              </GlowButton>
            </motion.div>
          </div>
        )}
        {(dpPhase === "select" || dpPhase === "rank") && (
          <div className="flex-1 flex flex-col gap-3 overflow-auto">
            <div className="glass-card rounded-xl p-4 border border-[#7c3aed]/30 shrink-0">
              <p
                className="text-xs uppercase tracking-widest text-[#7c3aed] mb-1"
                style={{ fontFamily: "'Orbitron',sans-serif" }}
              >
                Proposition
              </p>
              <p className="text-sm font-bold text-foreground">{prop.motion}</p>
            </div>
            {dpPhase === "select" && (
              <>
                <p className="text-xs text-muted-foreground">
                  Select the 3 STRONGEST arguments (green) and identify the 1
                  logical fallacy (red):
                </p>
                {prop.arguments.map((arg, i) => {
                  const isSelected = dpSelected.includes(i);
                  const isFallacy = dpFallacyPick === i;
                  return (
                    <div key={i} className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 text-left px-3 py-2 rounded-xl border text-xs transition-all"
                        style={
                          isSelected
                            ? {
                                borderColor: "#10b981",
                                background: "#10b98115",
                                color: "#10b981",
                              }
                            : {}
                        }
                        onClick={() => toggleDpArg(i)}
                        data-ocid={`debate_prep.arg.${i + 1}`}
                      >
                        {arg.text}
                      </button>
                      <button
                        type="button"
                        className="px-2 py-2 rounded-xl border text-xs font-bold transition-all shrink-0"
                        style={
                          isFallacy
                            ? {
                                borderColor: "#f43f5e",
                                background: "#f43f5e15",
                                color: "#f43f5e",
                              }
                            : {
                                borderColor: "rgba(100,100,100,0.3)",
                                color: "#f43f5e",
                              }
                        }
                        onClick={() =>
                          setDpFallacyPick(i === dpFallacyPick ? null : i)
                        }
                        data-ocid={`debate_prep.fallacy.${i + 1}`}
                      >
                        Fallacy
                      </button>
                    </div>
                  );
                })}
                {dpFeedback && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      color: dpFeedback.ok ? "#10b981" : "#f59e0b",
                      background: dpFeedback.ok ? "#10b98115" : "#f59e0b15",
                      border: `1px solid ${dpFeedback.ok ? "#10b981" : "#f59e0b"}`,
                    }}
                  >
                    {dpFeedback.msg}
                  </motion.div>
                )}
                <GlowButton
                  variant="primary"
                  size="md"
                  disabled={
                    dpSelected.length !== 3 ||
                    dpFallacyPick === null ||
                    !!dpFeedback
                  }
                  onClick={submitDpSelection}
                  data-ocid="debate_prep.submit_selection_button"
                >
                  Submit Selection ({dpSelected.length}/3 selected)
                </GlowButton>
              </>
            )}
            {dpPhase === "rank" && (
              <>
                <p className="text-xs text-muted-foreground">
                  Rank your 3 selected arguments from strongest (1) to weakest
                  (3):
                </p>
                {dpSelected
                  .filter((i) => prop.strongIndices.includes(i))
                  .map((argIdx, j) => (
                    <div
                      key={j}
                      className="glass-card rounded-xl p-3 border border-border/30 flex items-center gap-3"
                    >
                      <p className="text-xs text-foreground flex-1">
                        {prop.arguments[argIdx].text}
                      </p>
                      <div className="flex gap-1 shrink-0">
                        {[1, 2, 3].map((rank) => (
                          <button
                            key={rank}
                            type="button"
                            className="w-8 h-8 rounded-lg border text-xs font-bold transition-all"
                            style={
                              dpRanks[argIdx] === rank
                                ? {
                                    borderColor: "#7c3aed",
                                    background: "#7c3aed20",
                                    color: "#7c3aed",
                                  }
                                : { borderColor: "rgba(100,100,100,0.3)" }
                            }
                            onClick={() => setRank(argIdx, rank)}
                            data-ocid={`debate_prep.rank.${j + 1}.${rank}`}
                          >
                            {rank}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                {dpFeedback && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      color: dpFeedback.ok ? "#10b981" : "#f59e0b",
                      background: dpFeedback.ok ? "#10b98115" : "#f59e0b15",
                      border: `1px solid ${dpFeedback.ok ? "#10b981" : "#f59e0b"}`,
                    }}
                  >
                    {dpFeedback.msg}
                  </motion.div>
                )}
                <GlowButton
                  variant="primary"
                  size="md"
                  disabled={Object.keys(dpRanks).length < 3 || !!dpFeedback}
                  onClick={submitRanks}
                  data-ocid="debate_prep.submit_ranks_button"
                >
                  Submit Rankings
                </GlowButton>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Default: speech-architect ────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="public_speaking.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Mic2 className="h-4 w-4 text-[#10b981]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${audiencePct}%`,
                background:
                  audiencePct >= 60
                    ? "#10b981"
                    : audiencePct >= 35
                      ? "#f59e0b"
                      : "#f43f5e",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {audienceScore}%
          </span>
        </div>
        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#00f5ff] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>

      {phase === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
          >
            <Mic2 className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Speech Architect
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Construct a compelling speech by selecting the strongest hook,
              arguments, evidence, counter-argument, and conclusion.
            </p>
            <p className="text-[#10b981] text-xs mb-6">
              Audience reaction meter rises with strong choices and drops with
              weak ones.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setPhase("build")}
              data-ocid="public_speaking.start_button"
            >
              Take the Stage
            </GlowButton>
          </motion.div>
        </div>
      )}

      {phase === "build" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-xl p-3 border border-[#10b981]/30 shrink-0">
            <p className="text-xs text-muted-foreground">
              <span className="text-[#10b981] font-bold">Motion:</span>{" "}
              {topic.motion}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${STEPS.indexOf(step) > i ? "bg-[#10b981]" : STEPS.indexOf(step) === i ? "bg-[#f59e0b]" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground shrink-0">
            {step.replace("_", " ")}: choose the best option
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex-1 flex flex-col gap-2 overflow-y-auto"
            >
              {step === "hook" &&
                topic.hooks.map((h, i) => (
                  <button
                    key={h.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => selectComponent(h, "hook")}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.hook === h.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`}
                    data-ocid={`public_speaking.hook.${i + 1}`}
                  >
                    <span className="text-xs text-muted-foreground block mb-1">
                      {h.label}
                    </span>
                    {h.content}
                  </button>
                ))}
              {step === "points" && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Select exactly 3 supporting points:
                  </p>
                  {topic.points.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => selectPoint(p.id)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${selectedPoints.includes(p.id) ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                      data-ocid={`public_speaking.point.${i + 1}`}
                    >
                      <span className="text-xs text-muted-foreground block mb-1">
                        {p.label}
                      </span>
                      {p.content}
                    </button>
                  ))}
                  <GlowButton
                    variant="primary"
                    onClick={submitPoints}
                    disabled={selectedPoints.length !== 3}
                    data-ocid="public_speaking.submit_points_button"
                  >
                    Confirm 3 Points
                  </GlowButton>
                </>
              )}
              {step === "evidence" &&
                topic.evidences.slice(0, 3).map((e, i) => (
                  <button
                    key={e.evidence.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => selectComponent(e.evidence, "evidence")}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.evidence === e.evidence.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`}
                    data-ocid={`public_speaking.evidence.${i + 1}`}
                  >
                    <span className="text-xs text-muted-foreground block mb-1">
                      {e.evidence.label}
                    </span>
                    {e.evidence.content}
                  </button>
                ))}
              {step === "counter" &&
                topic.counterArgs.map((ca, i) => (
                  <button
                    key={ca.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => selectComponent(ca, "counter")}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.counter === ca.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`}
                    data-ocid={`public_speaking.counter.${i + 1}`}
                  >
                    <span className="text-xs text-muted-foreground block mb-1">
                      {ca.label}
                    </span>
                    {ca.content}
                  </button>
                ))}
              {step === "conclusion" &&
                topic.conclusions.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => selectComponent(c, "conclusion")}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.conclusion === c.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f43f5e]/60 text-foreground"}`}
                    data-ocid={`public_speaking.conclusion.${i + 1}`}
                  >
                    <span className="text-xs text-muted-foreground block mb-1">
                      {c.label}
                    </span>
                    {c.content}
                  </button>
                ))}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-xl border flex items-start gap-2 shrink-0 ${feedback.ok ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`}
              >
                {feedback.ok ? (
                  <CheckCircle className="h-4 w-4 text-[#10b981] shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#f43f5e] shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-bold ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                  >
                    {feedback.ok
                      ? `Strong choice! +${feedback.pts} pts`
                      : "Weak choice. Audience loses confidence."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {feedback.msg}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {phase === "review" && (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          <p className="text-sm font-bold text-foreground">
            Your completed speech on:{" "}
            <span className="text-[#10b981]">{topic.topic}</span>
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10">
            <Users className="h-5 w-5 text-[#f59e0b]" />
            <div>
              <p className="text-xs text-muted-foreground">
                Final audience approval
              </p>
              <p className="text-lg font-black text-[#f59e0b]">
                {audienceScore}%
              </p>
            </div>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-1000"
                style={{ width: `${audiencePct}%`, background: "#f59e0b" }}
              />
            </div>
          </div>
          <GlowButton
            variant="primary"
            onClick={() => endGame(true)}
            data-ocid="public_speaking.finish_button"
          >
            Submit Speech
          </GlowButton>
        </div>
      )}
    </div>
  );
}
