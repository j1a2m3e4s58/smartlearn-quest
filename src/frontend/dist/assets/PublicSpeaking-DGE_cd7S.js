import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { U as Users } from "./users-i3WNAdwI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
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
      d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
      key: "80a601"
    }
  ],
  [
    "path",
    {
      d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
      key: "j0ngtp"
    }
  ],
  ["circle", { cx: "16", cy: "7", r: "5", key: "d08jfb" }]
];
const MicVocal = createLucideIcon("mic-vocal", __iconNode);
const TOPICS = {
  1: {
    topic: "Why We Should Eat More Vegetables",
    motion: "Vegetables should form the majority of every meal.",
    hooks: [
      {
        id: "h1",
        label: "Rhetorical Question",
        content: "If you could add five years to your life with one simple change, wouldn't you take it?",
        score: 90,
        technique: "Rhetorical question creates immediate engagement"
      },
      {
        id: "h2",
        label: "Surprising Statistic",
        content: "Approximately 3.9 million deaths per year are caused by insufficient vegetable consumption.",
        score: 85,
        technique: "Statistics create credibility and shock value"
      },
      {
        id: "h3",
        label: "Weak Anecdote",
        content: "I once ate a salad and it was quite nice.",
        score: 20,
        technique: "Too vague; lacks impact or relevance"
      }
    ],
    points: [
      {
        id: "p1",
        content: "Vegetables provide essential vitamins, minerals, and fibre that prevent chronic disease.",
        label: "Health benefit",
        score: 85,
        technique: "Clear and factual"
      },
      {
        id: "p2",
        content: "Plant-based diets have a significantly lower carbon footprint than meat-heavy diets.",
        label: "Environmental benefit",
        score: 80,
        technique: "Appeals to wider social responsibility"
      },
      {
        id: "p3",
        content: "Vegetables are generally cheaper than processed foods, making them accessible to all.",
        label: "Economic benefit",
        score: 75,
        technique: "Addresses a common objection preemptively"
      },
      {
        id: "p4",
        content: "Many people dislike vegetables because of poor preparation techniques.",
        label: "Weak point",
        score: 15,
        technique: "This supports the opposition, not your argument"
      },
      {
        id: "p5",
        content: "My friend is vegetarian and seems very healthy.",
        label: "Anecdotal weak point",
        score: 10,
        technique: "Personal anecdote with no data backing"
      }
    ],
    evidences: [
      {
        pointId: "p1",
        evidence: {
          id: "e1",
          content: "A Harvard study of 110,000 people found that eating fruits and vegetables daily reduced heart disease risk by 30%.",
          label: "Research evidence",
          score: 90,
          technique: "Specific, credible, quantified"
        }
      },
      {
        pointId: "p2",
        evidence: {
          id: "e2",
          content: "The UN FAO reports that livestock production accounts for 14.5% of global greenhouse gas emissions.",
          label: "Authority evidence",
          score: 88,
          technique: "UN source adds institutional authority"
        }
      },
      {
        pointId: "p3",
        evidence: {
          id: "e3",
          content: "In most countries, a kilogram of carrots costs a fraction of a kilogram of beef.",
          label: "Comparative evidence",
          score: 70,
          technique: "Relatable comparison but imprecise"
        }
      }
    ],
    counterArgs: [
      {
        id: "ca1",
        content: "Some argue that vegetables are expensive or inaccessible in food deserts — however, government subsidies and community gardens have addressed this in many regions.",
        label: "Addresses access barrier",
        score: 90,
        technique: "Acknowledge + refute = sophisticated rebuttal"
      },
      {
        id: "ca2",
        content: "Critics say vegetables taste bad, but that is merely a matter of preference and preparation.",
        label: "Taste objection",
        score: 70,
        technique: "Valid but slightly dismissive"
      },
      {
        id: "ca3",
        content: "Some people are allergic to vegetables, so this recommendation doesn't apply to them.",
        label: "Weak concession",
        score: 20,
        technique: "Extreme edge case undermines broader argument"
      }
    ],
    conclusions: [
      {
        id: "con1",
        content: "The science is clear, the planet is at stake, and your health is in your hands. Choose vegetables, choose life.",
        label: "Call to action",
        score: 90,
        technique: "Three-part parallel structure with a memorable final line"
      },
      {
        id: "con2",
        content: "So in summary, vegetables are good. Thank you.",
        label: "Weak summary",
        score: 15,
        technique: "No emotional resonance or call to action"
      },
      {
        id: "con3",
        content: "I hope I have convinced you today that dietary choices matter enormously. The evidence demands action.",
        label: "Appeal to reason",
        score: 80,
        technique: "Formal and logical, but lacks punch"
      }
    ]
  },
  2: {
    topic: "Artificial Intelligence in Education",
    motion: "AI should be integrated into all school curricula immediately.",
    hooks: [
      {
        id: "h1",
        label: "Bold Claim",
        content: "In ten years, a student without AI literacy will face the same disadvantage as a student without reading skills today.",
        score: 92,
        technique: "Bold claim creates urgency"
      },
      {
        id: "h2",
        label: "Historical Parallel",
        content: "When calculators entered classrooms, mathematicians predicted disaster. Instead, deeper mathematical thinking flourished.",
        score: 88,
        technique: "Historical parallel disarms a common objection"
      },
      {
        id: "h3",
        label: "Vague Statement",
        content: "Artificial intelligence is very important to the future of everything.",
        score: 18,
        technique: "Too vague; no specificity or impact"
      }
    ],
    points: [
      {
        id: "p1",
        content: "AI tutoring systems can provide personalised, adaptive learning that traditional one-teacher-to-30-students ratios cannot replicate.",
        label: "Personalisation",
        score: 88,
        technique: "Directly addresses a real systemic gap"
      },
      {
        id: "p2",
        content: "Teaching AI literacy prepares students for a job market where 85% of roles by 2030 will require digital and AI competence.",
        label: "Future readiness",
        score: 85,
        technique: "Data-backed forward projection"
      },
      {
        id: "p3",
        content: "AI tools can automate grading, freeing teachers to focus on mentoring and creative instruction.",
        label: "Teacher efficiency",
        score: 80,
        technique: "Reframes AI as complement to, not replacement of, teachers"
      },
      {
        id: "p4",
        content: "Some students might use AI to cheat on assignments.",
        label: "Weak point",
        score: 12,
        technique: "This supports the opposition"
      },
      {
        id: "p5",
        content: "AI is very popular these days so schools should use it too.",
        label: "Bandwagon fallacy",
        score: 5,
        technique: "Logical fallacy: appeal to popularity"
      }
    ],
    evidences: [
      {
        pointId: "p1",
        evidence: {
          id: "e1",
          content: "A RAND Corporation study found AI tutoring systems improved student outcomes by 20–40% over standard instruction for mathematics.",
          label: "Research",
          score: 92,
          technique: "Specific study, quantified improvement"
        }
      },
      {
        pointId: "p2",
        evidence: {
          id: "e2",
          content: "The World Economic Forum's Future of Jobs report projects 85 million job displacement and 97 million new roles by 2025, heavily favouring AI-literate workers.",
          label: "WEF projection",
          score: 90,
          technique: "Prestigious source with concrete numbers"
        }
      },
      {
        pointId: "p3",
        evidence: {
          id: "e3",
          content: "Teachers in AI-assisted classrooms report spending 30% more time on student engagement versus administrative tasks.",
          label: "Survey data",
          score: 82,
          technique: "Practical impact on teaching quality"
        }
      }
    ],
    counterArgs: [
      {
        id: "ca1",
        content: "Opponents worry AI will widen the digital divide — yet universal AI access programs, like those in South Korea and Estonia, demonstrate that targeted investment eliminates this barrier.",
        label: "Equity objection",
        score: 92,
        technique: "Specific examples validate the refutation"
      },
      {
        id: "ca2",
        content: "Some argue AI promotes laziness — however, evidence shows AI tools are most effective when designed to scaffold rather than substitute student thinking.",
        label: "Critical thinking concern",
        score: 88,
        technique: "Nuanced rebuttal"
      },
      {
        id: "ca3",
        content: "The internet was once considered a distraction too, and look how education embraced it.",
        label: "Weak analogy",
        score: 55,
        technique: "Analogy is apt but oversimplified"
      }
    ],
    conclusions: [
      {
        id: "con1",
        content: "The question is not whether AI will transform education. It already is. The only question is whether we will equip our students to lead that transformation or be left behind by it.",
        label: "Reframe conclusion",
        score: 95,
        technique: "Shifts burden to audience, memorable final contrast"
      },
      {
        id: "con2",
        content: "AI in education is very exciting. Please vote for the motion.",
        label: "Weak close",
        score: 10,
        technique: "No structure, no rhetoric, no impact"
      },
      {
        id: "con3",
        content: "The evidence presented today is unambiguous: AI integration is not optional — it is an imperative. I urge your full support of this motion.",
        label: "Direct call",
        score: 82,
        technique: "Clear and direct but less memorable"
      }
    ]
  },
  3: {
    topic: "Universal Basic Income",
    motion: "All governments should implement Universal Basic Income immediately.",
    hooks: [
      {
        id: "h1",
        label: "Paradox Opening",
        content: "We live in the most productive era in human history, yet almost half the world's workers cannot afford basic security. That paradox ends today.",
        score: 95,
        technique: "Paradox + declarative finale creates rhetorical power"
      },
      {
        id: "h2",
        label: "Counter-narrative",
        content: "Every objection to UBI has been raised before — about child labour laws, the minimum wage, and Social Security. Every time, the objectors were proved catastrophically wrong.",
        score: 88,
        technique: "Historical pattern challenges audience assumptions"
      },
      {
        id: "h3",
        label: "Definition opener",
        content: "Universal Basic Income is a policy where the government gives every citizen a fixed sum monthly.",
        score: 30,
        technique: "Definitions are weak openers — no rhetorical energy"
      }
    ],
    points: [
      {
        id: "p1",
        content: "UBI eliminates poverty traps by ensuring income does not disappear when recipients accept work, incentivising participation rather than dependency.",
        label: "Incentive structure",
        score: 90,
        technique: "Directly addresses the 'disincentive to work' objection"
      },
      {
        id: "p2",
        content: "Automation will displace 40% of current jobs by 2040 — UBI is the only proven mechanism for distributing technological productivity gains equitably.",
        label: "Automation hedge",
        score: 88,
        technique: "Forward-looking, data-backed, urgency-driven"
      },
      {
        id: "p3",
        content: "The Stockton SEED pilot demonstrated that UBI recipients found full-time employment 40% faster than control groups.",
        label: "Empirical evidence",
        score: 92,
        technique: "Named pilot study with counter-intuitive data"
      },
      {
        id: "p4",
        content: "Some rich countries might be able to afford UBI.",
        label: "Weak conditional",
        score: 15,
        technique: "Hedge undermines the universal claim"
      },
      {
        id: "p5",
        content: "People deserve more money and the government should help them.",
        label: "Vague appeal",
        score: 8,
        technique: "No mechanism, no evidence, no specificity"
      }
    ],
    evidences: [
      {
        pointId: "p1",
        evidence: {
          id: "e1",
          content: "The Finnish UBI experiment found recipients reported higher wellbeing, greater trust in institutions, and no reduction in employment compared to the control group.",
          label: "Finnish experiment",
          score: 92,
          technique: "Named experiment, multi-dimensional outcomes"
        }
      },
      {
        pointId: "p2",
        evidence: {
          id: "e2",
          content: "McKinsey Global Institute projects that automation could displace 375 million workers globally by 2030, representing 14% of the global workforce.",
          label: "McKinsey projection",
          score: 90,
          technique: "Prestigious source, massive scale, near-term urgency"
        }
      },
      {
        pointId: "p3",
        evidence: {
          id: "e3",
          content: "A 2021 review of 48 UBI pilot studies across 7 countries found consistent improvements in health, education, and social trust outcomes.",
          label: "Meta-analysis",
          score: 95,
          technique: "Meta-analysis is gold standard evidence"
        }
      }
    ],
    counterArgs: [
      {
        id: "ca1",
        content: "Critics argue UBI is unaffordable — yet Andrew Yang's analysis showed funding UBI via a 10% VAT and consolidating existing welfare programmes creates a net-zero fiscal impact.",
        label: "Fiscal objection",
        score: 94,
        technique: "Specific named policy mechanism with fiscal model"
      },
      {
        id: "ca2",
        content: "The inflation risk is real but manageable: UBI redistributes existing money rather than creating new money supply, as demonstrated by the Alaska Permanent Fund's 40-year record.",
        label: "Inflation risk",
        score: 92,
        technique: "Longest-running UBI precedent neutralises the objection"
      },
      {
        id: "ca3",
        content: "Not everyone agrees with UBI, but that doesn't mean it's wrong.",
        label: "Weak rebuttal",
        score: 10,
        technique: "Adds no argumentative value"
      }
    ],
    conclusions: [
      {
        id: "con1",
        content: "History will not judge us by our GDP. It will judge us by whether we used our unprecedented wealth to guarantee every human being a foundation of dignity. The evidence is in. The pilots are complete. The time for UBI is now.",
        label: "Legacy appeal",
        score: 98,
        technique: "Three-part build, historical framing, final declarative"
      },
      {
        id: "con2",
        content: "For these reasons, UBI is a good idea and I recommend it.",
        label: "Weak summary",
        score: 12,
        technique: "No rhetoric, no emotion, no call to action"
      },
      {
        id: "con3",
        content: "The data speaks clearly: UBI works. I urge every member of this audience to support immediate implementation.",
        label: "Data-led close",
        score: 78,
        technique: "Factual but emotionally flat"
      }
    ]
  }
};
const STEPS = [
  "hook",
  "points",
  "evidence",
  "counter",
  "conclusion"
];
const BEHAVIORS = [
  {
    text: "Maintains steady eye contact with the audience throughout the speech.",
    category: "Confident"
  },
  {
    text: "Reads directly from notes without looking up.",
    category: "Unconfident"
  },
  {
    text: "Uses varied vocal pace to emphasise key points.",
    category: "Confident"
  },
  {
    text: "Fidgets with hands and shifts weight between feet.",
    category: "Unconfident"
  },
  {
    text: "Stands in a neutral position with arms relaxed at sides.",
    category: "Neutral"
  },
  {
    text: "Speaks in a flat monotone with no variation.",
    category: "Unconfident"
  },
  {
    text: "Pauses deliberately for emphasis before a key statement.",
    category: "Confident"
  },
  {
    text: "Apologises before beginning: 'Sorry, I'm not very good at this'.",
    category: "Unconfident"
  },
  { text: "Uses open gestures to reinforce points.", category: "Confident" },
  {
    text: "Reads from the script without any deviation.",
    category: "Unconfident"
  }
];
const DELIVERIES = [
  {
    title: "Student Council Speech",
    description: "The speaker stands at the front, looks up frequently but returns to notes. Speaks at a steady pace with clear pronunciation. Hands remain still but gestures are minimal. The message is organised and easy to follow.",
    correctRatings: { eyeContact: 3, voice: 4, bodyLanguage: 3, clarity: 4 }
  },
  {
    title: "Class Presentation",
    description: "The speaker reads entirely from the paper, never making eye contact. Voice is clear but lacks energy. Body is stiff throughout. The content is accurate and well-structured.",
    correctRatings: { eyeContact: 1, voice: 3, bodyLanguage: 1, clarity: 4 }
  },
  {
    title: "Assembly Speech",
    description: "The speaker maintains confident eye contact, uses varied pitch and volume, and moves naturally on stage. Some words are rushed in the middle section. The audience is clearly engaged.",
    correctRatings: { eyeContact: 5, voice: 4, bodyLanguage: 5, clarity: 3 }
  }
];
const PROPOSITIONS = [
  {
    motion: "School uniforms should be compulsory.",
    arguments: [
      {
        text: "Uniforms reduce visible socioeconomic inequality, allowing students to focus on learning.",
        strength: "strong",
        rank: 1
      },
      {
        text: "Studies show uniform schools report lower rates of bullying related to clothing.",
        strength: "strong",
        rank: 2
      },
      {
        text: "A uniform policy simplifies morning routines and reduces decision fatigue.",
        strength: "strong",
        rank: 3
      },
      {
        text: "All schools in other countries use uniforms, so we should too.",
        strength: "fallacy"
      },
      {
        text: "Students who wear uniforms are generally nicer people.",
        strength: "weak"
      },
      {
        text: "My parents liked uniforms, so they must be good.",
        strength: "weak"
      }
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3
  },
  {
    motion: "Mobile phones should be banned in schools.",
    arguments: [
      {
        text: "Research shows mobile phone use in class correlates with a 23% reduction in student attentiveness.",
        strength: "strong",
        rank: 1
      },
      {
        text: "Banning phones reduces cyberbullying incidents that originate on school grounds.",
        strength: "strong",
        rank: 2
      },
      {
        text: "Phone-free environments improve face-to-face communication skills.",
        strength: "strong",
        rank: 3
      },
      {
        text: "Everyone uses phones, so banning them proves nothing.",
        strength: "fallacy"
      },
      {
        text: "My teacher once used a phone in class, so students should be allowed to.",
        strength: "weak"
      },
      {
        text: "Phones are expensive, therefore they should not be in school.",
        strength: "weak"
      }
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3
  },
  {
    motion: "Physical education should be mandatory every day.",
    arguments: [
      {
        text: "Daily physical activity improves cognitive performance, with studies showing a 20% improvement in memory consolidation.",
        strength: "strong",
        rank: 1
      },
      {
        text: "Childhood obesity rates drop by 30% in schools with daily PE requirements.",
        strength: "strong",
        rank: 2
      },
      {
        text: "PE builds teamwork, resilience, and leadership skills transferable across subjects.",
        strength: "strong",
        rank: 3
      },
      {
        text: "Sports stars are successful, so all students should do PE every day.",
        strength: "fallacy"
      },
      {
        text: "Exercise is good, so more must always be better.",
        strength: "weak"
      },
      { text: "I enjoy PE, so everyone else must too.", strength: "weak" }
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3
  },
  {
    motion: "Homework should be abolished in primary school.",
    arguments: [
      {
        text: "Research by John Hattie shows homework has minimal impact on primary school achievement compared to other interventions.",
        strength: "strong",
        rank: 1
      },
      {
        text: "Excessive homework creates stress and reduces family bonding time, harming overall child development.",
        strength: "strong",
        rank: 2
      },
      {
        text: "Learning time is more effectively used through quality teaching during school hours.",
        strength: "strong",
        rank: 3
      },
      {
        text: "Countries with no homework are automatically better at education.",
        strength: "fallacy"
      },
      {
        text: "Children prefer not to have homework, so it should be abolished.",
        strength: "weak"
      },
      {
        text: "My cousin didn't do homework and turned out fine.",
        strength: "weak"
      }
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3
  },
  {
    motion: "Social media companies should be regulated by governments.",
    arguments: [
      {
        text: "Unregulated social media platforms have been linked to rising rates of teen anxiety and depression, according to multiple longitudinal studies.",
        strength: "strong",
        rank: 1
      },
      {
        text: "Government regulation can enforce data privacy protections that platforms currently self-administer inadequately.",
        strength: "strong",
        rank: 2
      },
      {
        text: "Regulated platforms in the EU under GDPR have shown measurable improvements in user data protection.",
        strength: "strong",
        rank: 3
      },
      {
        text: "Facebook is evil, therefore all social media must be regulated.",
        strength: "fallacy"
      },
      {
        text: "Many people dislike social media, so it should be controlled.",
        strength: "weak"
      },
      {
        text: "Governments are always right when they regulate things.",
        strength: "weak"
      }
    ],
    strongIndices: [0, 1, 2],
    fallacyIndex: 3
  }
];
function PublicSpeaking({ config, onGameEnd }) {
  const gameId = config.gameId;
  const topic = TOPICS[config.difficulty];
  const [phase, setPhase] = reactExports.useState("idle");
  const [step, setStep] = reactExports.useState("hook");
  const [selections, setSelections] = reactExports.useState({
    hook: null,
    points: null,
    evidence: null,
    counter: null,
    conclusion: null
  });
  const [selectedPoints, setSelectedPoints] = reactExports.useState([]);
  const [audienceScore, setAudienceScore] = reactExports.useState(50);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [cbPhase, setCbPhase] = reactExports.useState("start");
  const [cbBehaviorIdx, setCbBehaviorIdx] = reactExports.useState(0);
  const [cbDeliveryIdx, setCbDeliveryIdx] = reactExports.useState(0);
  const [cbScore, setCbScore] = reactExports.useState(0);
  const [cbFeedback, setCbFeedback] = reactExports.useState(null);
  const [cbSliders, setCbSliders] = reactExports.useState({
    eyeContact: 3,
    voice: 3,
    bodyLanguage: 3,
    clarity: 3
  });
  const [cbSliderSubmitted, setCbSliderSubmitted] = reactExports.useState(false);
  const [dpPhase, setDpPhase] = reactExports.useState(
    "start"
  );
  const [dpIdx, setDpIdx] = reactExports.useState(0);
  const [dpSelected, setDpSelected] = reactExports.useState([]);
  const [dpFallacyPick, setDpFallacyPick] = reactExports.useState(null);
  const [dpRanks, setDpRanks] = reactExports.useState({});
  const [dpScore, setDpScore] = reactExports.useState(0);
  const [dpFeedback, setDpFeedback] = reactExports.useState(null);
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = total > 0 ? correct / total * 100 : 0;
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
    [config, correct, total, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const audiencePct = audienceScore;
  function selectComponent(component, key) {
    if (feedback) return;
    const pts = component.score * config.difficulty;
    setTotal((t) => t + 1);
    if (component.score >= 70) {
      setCorrect((c) => c + 1);
      setScore((s) => s + pts);
    }
    setAudienceScore(
      (a) => Math.min(100, Math.max(0, a + (component.score >= 70 ? 8 : -12)))
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
  function selectPoint(pid) {
    if (selectedPoints.includes(pid))
      setSelectedPoints((p) => p.filter((x) => x !== pid));
    else if (selectedPoints.length < 3) setSelectedPoints((p) => [...p, pid]);
  }
  function submitPoints() {
    if (selectedPoints.length < 3) return;
    let pts = 0;
    let c = 0;
    selectedPoints.forEach((pid) => {
      const p = topic.points.find((x) => x.id === pid);
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
  function cbStart() {
    startTime.current = Date.now();
    setCbPhase("behaviors");
  }
  function handleBehavior(category) {
    if (cbFeedback) return;
    const beh = BEHAVIORS[cbBehaviorIdx];
    const isCorrect = category === beh.category;
    const pts = isCorrect ? 60 * config.difficulty : 0;
    setCbScore((s) => s + pts);
    setScore((s) => s + pts);
    setCbFeedback({
      ok: isCorrect,
      msg: isCorrect ? `Correct: ${beh.category}. +${pts} pts` : `Wrong. This behaviour is ${beh.category}.`
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
    const correct2 = delivery.correctRatings;
    const diff = Math.abs(cbSliders.eyeContact - correct2.eyeContact) + Math.abs(cbSliders.voice - correct2.voice) + Math.abs(cbSliders.bodyLanguage - correct2.bodyLanguage) + Math.abs(cbSliders.clarity - correct2.clarity);
    const pts = Math.max(0, (8 - diff) * 30 * config.difficulty);
    setCbScore((s) => s + pts);
    setScore((s) => s + pts);
    setCbSliderSubmitted(true);
    setCbFeedback({
      ok: diff <= 4,
      msg: `Accuracy: ${Math.max(0, 100 - diff * 12)}%. +${pts} pts. Correct: Eye ${correct2.eyeContact} / Voice ${correct2.voice} / Body ${correct2.bodyLanguage} / Clarity ${correct2.clarity}`
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
  const prop = PROPOSITIONS[dpIdx % PROPOSITIONS.length];
  function dpStart() {
    startTime.current = Date.now();
    setDpPhase("select");
  }
  function toggleDpArg(i) {
    if (dpSelected.includes(i)) setDpSelected((p) => p.filter((x) => x !== i));
    else if (dpSelected.length < 3) setDpSelected((p) => [...p, i]);
  }
  function submitDpSelection() {
    if (dpSelected.length !== 3 || dpFallacyPick === null) return;
    const correctStrong = dpSelected.filter(
      (i) => prop.strongIndices.includes(i)
    ).length;
    const fallacyCorrect = dpFallacyPick === prop.fallacyIndex;
    const pts = (correctStrong * 80 + (fallacyCorrect ? 100 : 0)) * config.difficulty;
    setDpScore((s) => s + pts);
    setScore((s) => s + pts);
    setDpFeedback({
      ok: correctStrong >= 2 && fallacyCorrect,
      msg: `${correctStrong}/3 strong arguments correct. Fallacy ${fallacyCorrect ? "correctly" : "incorrectly"} identified. +${pts} pts`
    });
    setTimeout(() => {
      setDpFeedback(null);
      setDpPhase("rank");
    }, 2e3);
  }
  function setRank(argIdx, rank) {
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
      msg: `${correctRanks}/3 ranks correct. +${pts} pts`
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
    }, 2e3);
  }
  if (gameId === "confidence-builder") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col gap-3",
        "data-ocid": "confidence_builder.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-4 w-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: cbScore.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
          cbPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black glow-cyan-text mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Confidence Builder"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Classify 10 speaker behaviours as Confident, Unconfident, or Neutral. Then rate 3 full speech deliveries across 4 dimensions." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: cbStart,
                    "data-ocid": "confidence_builder.start_button",
                    children: "Start Assessment"
                  }
                )
              ]
            }
          ) }),
          cbPhase === "behaviors" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 border border-[#f59e0b]/30 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-[#f59e0b] uppercase tracking-widest", children: [
              "Behaviour ",
              cbBehaviorIdx + 1,
              "/10"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-5 border border-border/30 flex-1 flex flex-col justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground text-center", children: BEHAVIORS[cbBehaviorIdx].text }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ["Confident", "Unconfident", "Neutral"].map(
              (cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "px-3 py-3 rounded-xl border text-sm font-bold transition-all disabled:opacity-50",
                  style: i === 0 ? { borderColor: "#10b981", color: "#10b981" } : i === 1 ? { borderColor: "#f43f5e", color: "#f43f5e" } : { borderColor: "#f59e0b", color: "#f59e0b" },
                  disabled: !!cbFeedback,
                  onClick: () => handleBehavior(cat),
                  "data-ocid": `confidence_builder.category.${i + 1}`,
                  children: cat
                },
                i
              )
            ) }),
            cbFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "rounded-lg px-3 py-2 text-xs font-medium",
                style: {
                  color: cbFeedback.ok ? "#10b981" : "#f43f5e",
                  background: cbFeedback.ok ? "#10b98115" : "#f43f5e15",
                  border: `1px solid ${cbFeedback.ok ? "#10b981" : "#f43f5e"}`
                },
                children: cbFeedback.msg
              }
            )
          ] }),
          cbPhase === "delivery" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-[#f59e0b] mb-1", children: [
                "Delivery ",
                cbDeliveryIdx + 1,
                "/",
                DELIVERIES.length,
                " —",
                " ",
                DELIVERIES[cbDeliveryIdx].title
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: DELIVERIES[cbDeliveryIdx].description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Rate this delivery on each dimension (1=Poor, 5=Excellent):" }),
            ["eyeContact", "voice", "bodyLanguage", "clarity"].map(
              (dim) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-xl p-3 border border-border/30",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground capitalize", children: dim.replace(/([A-Z])/g, " $1") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-[#f59e0b]", children: [
                        cbSliders[dim],
                        "/5"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "flex-1 h-8 rounded-lg border text-xs font-bold transition-all",
                        style: cbSliders[dim] === v ? {
                          borderColor: "#f59e0b",
                          background: "#f59e0b20",
                          color: "#f59e0b"
                        } : { borderColor: "rgba(100,100,100,0.3)" },
                        onClick: () => setCbSliders((s) => ({ ...s, [dim]: v })),
                        "data-ocid": `confidence_builder.${dim}.${v}`,
                        children: v
                      },
                      v
                    )) })
                  ]
                },
                dim
              )
            ),
            cbFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "rounded-lg px-3 py-2 text-xs font-medium",
                style: {
                  color: cbFeedback.ok ? "#10b981" : "#f59e0b",
                  background: cbFeedback.ok ? "#10b98115" : "#f59e0b15",
                  border: `1px solid ${cbFeedback.ok ? "#10b981" : "#f59e0b"}`
                },
                children: cbFeedback.msg
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "primary",
                onClick: submitDelivery,
                disabled: cbSliderSubmitted,
                "data-ocid": "confidence_builder.submit_delivery_button",
                children: "Submit Rating"
              }
            )
          ] })
        ]
      }
    );
  }
  if (gameId === "debate-prep") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col gap-3",
        "data-ocid": "debate_prep.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-4 w-4 text-[#7c3aed]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: dpScore.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Proposition ",
              dpIdx + 1,
              "/",
              PROPOSITIONS.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-[#7c3aed] transition-all duration-1000",
                style: { width: `${timePct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] }),
          dpPhase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black glow-cyan-text mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "Debate Prep"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Select the 3 strongest supporting arguments, identify the 1 logical fallacy, then rank your 3 arguments by strength." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: dpStart,
                    "data-ocid": "debate_prep.start_button",
                    children: "Begin Prep"
                  }
                )
              ]
            }
          ) }),
          (dpPhase === "select" || dpPhase === "rank") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#7c3aed]/30 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-[#7c3aed] mb-1",
                  style: { fontFamily: "'Orbitron',sans-serif" },
                  children: "Proposition"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: prop.motion })
            ] }),
            dpPhase === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select the 3 STRONGEST arguments (green) and identify the 1 logical fallacy (red):" }),
              prop.arguments.map((arg, i) => {
                const isSelected = dpSelected.includes(i);
                const isFallacy = dpFallacyPick === i;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "flex-1 text-left px-3 py-2 rounded-xl border text-xs transition-all",
                      style: isSelected ? {
                        borderColor: "#10b981",
                        background: "#10b98115",
                        color: "#10b981"
                      } : {},
                      onClick: () => toggleDpArg(i),
                      "data-ocid": `debate_prep.arg.${i + 1}`,
                      children: arg.text
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "px-2 py-2 rounded-xl border text-xs font-bold transition-all shrink-0",
                      style: isFallacy ? {
                        borderColor: "#f43f5e",
                        background: "#f43f5e15",
                        color: "#f43f5e"
                      } : {
                        borderColor: "rgba(100,100,100,0.3)",
                        color: "#f43f5e"
                      },
                      onClick: () => setDpFallacyPick(i === dpFallacyPick ? null : i),
                      "data-ocid": `debate_prep.fallacy.${i + 1}`,
                      children: "Fallacy"
                    }
                  )
                ] }, i);
              }),
              dpFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "rounded-lg px-3 py-2 text-xs font-medium",
                  style: {
                    color: dpFeedback.ok ? "#10b981" : "#f59e0b",
                    background: dpFeedback.ok ? "#10b98115" : "#f59e0b15",
                    border: `1px solid ${dpFeedback.ok ? "#10b981" : "#f59e0b"}`
                  },
                  children: dpFeedback.msg
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                GlowButton,
                {
                  variant: "primary",
                  size: "md",
                  disabled: dpSelected.length !== 3 || dpFallacyPick === null || !!dpFeedback,
                  onClick: submitDpSelection,
                  "data-ocid": "debate_prep.submit_selection_button",
                  children: [
                    "Submit Selection (",
                    dpSelected.length,
                    "/3 selected)"
                  ]
                }
              )
            ] }),
            dpPhase === "rank" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Rank your 3 selected arguments from strongest (1) to weakest (3):" }),
              dpSelected.filter((i) => prop.strongIndices.includes(i)).map((argIdx, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-xl p-3 border border-border/30 flex items-center gap-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground flex-1", children: prop.arguments[argIdx].text }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 shrink-0", children: [1, 2, 3].map((rank) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "w-8 h-8 rounded-lg border text-xs font-bold transition-all",
                        style: dpRanks[argIdx] === rank ? {
                          borderColor: "#7c3aed",
                          background: "#7c3aed20",
                          color: "#7c3aed"
                        } : { borderColor: "rgba(100,100,100,0.3)" },
                        onClick: () => setRank(argIdx, rank),
                        "data-ocid": `debate_prep.rank.${j + 1}.${rank}`,
                        children: rank
                      },
                      rank
                    )) })
                  ]
                },
                j
              )),
              dpFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "rounded-lg px-3 py-2 text-xs font-medium",
                  style: {
                    color: dpFeedback.ok ? "#10b981" : "#f59e0b",
                    background: dpFeedback.ok ? "#10b98115" : "#f59e0b15",
                    border: `1px solid ${dpFeedback.ok ? "#10b981" : "#f59e0b"}`
                  },
                  children: dpFeedback.msg
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "md",
                  disabled: Object.keys(dpRanks).length < 3 || !!dpFeedback,
                  onClick: submitRanks,
                  "data-ocid": "debate_prep.submit_ranks_button",
                  children: "Submit Rankings"
                }
              )
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "public_speaking.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-4 w-4 text-[#10b981]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-700",
                style: {
                  width: `${audiencePct}%`,
                  background: audiencePct >= 60 ? "#10b981" : audiencePct >= 35 ? "#f59e0b" : "#f43f5e"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              audienceScore,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) })
        ] }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-14 w-14 mx-auto mb-4 text-[#10b981]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Speech Architect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Construct a compelling speech by selecting the strongest hook, arguments, evidence, counter-argument, and conclusion." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#10b981] text-xs mb-6", children: "Audience reaction meter rises with strong choices and drops with weak ones." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => setPhase("build"),
                  "data-ocid": "public_speaking.start_button",
                  children: "Take the Stage"
                }
              )
            ]
          }
        ) }),
        phase === "build" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 border border-[#10b981]/30 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981] font-bold", children: "Motion:" }),
            " ",
            topic.motion
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 shrink-0", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-1 h-1 rounded-full transition-all ${STEPS.indexOf(step) > i ? "bg-[#10b981]" : STEPS.indexOf(step) === i ? "bg-[#f59e0b]" : "bg-muted"}`
            },
            s
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-muted-foreground shrink-0", children: [
            step.replace("_", " "),
            ": choose the best option"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -40 },
              className: "flex-1 flex flex-col gap-2 overflow-y-auto",
              children: [
                step === "hook" && topic.hooks.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => selectComponent(h, "hook"),
                    className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.hook === h.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`,
                    "data-ocid": `public_speaking.hook.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: h.label }),
                      h.content
                    ]
                  },
                  h.id
                )),
                step === "points" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select exactly 3 supporting points:" }),
                  topic.points.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      disabled: !!feedback,
                      onClick: () => selectPoint(p.id),
                      className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${selectedPoints.includes(p.id) ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`,
                      "data-ocid": `public_speaking.point.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: p.label }),
                        p.content
                      ]
                    },
                    p.id
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GlowButton,
                    {
                      variant: "primary",
                      onClick: submitPoints,
                      disabled: selectedPoints.length !== 3,
                      "data-ocid": "public_speaking.submit_points_button",
                      children: "Confirm 3 Points"
                    }
                  )
                ] }),
                step === "evidence" && topic.evidences.slice(0, 3).map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => selectComponent(e.evidence, "evidence"),
                    className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.evidence === e.evidence.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#10b981]/60 text-foreground"}`,
                    "data-ocid": `public_speaking.evidence.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: e.evidence.label }),
                      e.evidence.content
                    ]
                  },
                  e.evidence.id
                )),
                step === "counter" && topic.counterArgs.map((ca, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => selectComponent(ca, "counter"),
                    className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.counter === ca.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`,
                    "data-ocid": `public_speaking.counter.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: ca.label }),
                      ca.content
                    ]
                  },
                  ca.id
                )),
                step === "conclusion" && topic.conclusions.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => selectComponent(c, "conclusion"),
                    className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${selections.conclusion === c.id ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#f43f5e]/60 text-foreground"}`,
                    "data-ocid": `public_speaking.conclusion.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: c.label }),
                      c.content
                    ]
                  },
                  c.id
                ))
              ]
            },
            step
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: `p-3 rounded-xl border flex items-start gap-2 shrink-0 ${feedback.ok ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`,
              children: [
                feedback.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `text-sm font-bold ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                      children: feedback.ok ? `Strong choice! +${feedback.pts} pts` : "Weak choice. Audience loses confidence."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: feedback.msg })
                ] })
              ]
            }
          ) })
        ] }),
        phase === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground", children: [
            "Your completed speech on:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#10b981]", children: topic.topic })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-[#f59e0b]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Final audience approval" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-black text-[#f59e0b]", children: [
                audienceScore,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-3 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000",
                style: { width: `${audiencePct}%`, background: "#f59e0b" }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              onClick: () => endGame(true),
              "data-ocid": "public_speaking.finish_button",
              children: "Submit Speech"
            }
          )
        ] })
      ]
    }
  );
}
export {
  PublicSpeaking as default
};
