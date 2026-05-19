import { GlowButton } from "@/components/ui/GlowButton";
import { BookOpen, CheckCircle, Search, XCircle, Zap } from "lucide-react";
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

interface Passage {
  title: string;
  text: string;
  questions: { q: string; options: string[]; answer: string; type: string }[];
}

const PASSAGES: Record<1 | 2 | 3, Passage[]> = {
  1: [
    {
      title: "The Lost Compass",
      text: "Kofi found an old compass in the attic. The brass was tarnished, but the needle still spun freely. He remembered his grandfather saying that a compass always points north — but Kofi noticed this one pointed southwest. He wrapped it carefully and took it to the science museum. The curator examined it and told him it was a civil engineering survey compass from the 1890s, calibrated to magnetic declination in the local region. Kofi donated it to the collection. The curator gave him a certificate and asked him to return for a junior archaeologist program next summer.",
      questions: [
        {
          q: "What did Kofi do with the compass?",
          options: ["Sold it", "Donated it", "Kept it", "Broke it"],
          answer: "Donated it",
          type: "Main Idea",
        },
        {
          q: "Why did the compass point southwest instead of north?",
          options: [
            "It was broken",
            "It was calibrated to local magnetic declination",
            "The needle was reversed",
            "It was too old to work",
          ],
          answer: "It was calibrated to local magnetic declination",
          type: "Inference",
        },
        {
          q: "What does 'tarnished' most likely mean in this passage?",
          options: [
            "Clean and polished",
            "Discolored and dull with age",
            "Sharp and precise",
            "New and shiny",
          ],
          answer: "Discolored and dull with age",
          type: "Vocab in Context",
        },
        {
          q: "What was the author's main purpose?",
          options: [
            "To teach how compasses work",
            "To show how to find a museum",
            "To tell a story of discovery and generosity",
            "To describe metal collecting",
          ],
          answer: "To tell a story of discovery and generosity",
          type: "Author Purpose",
        },
        {
          q: "How is this text organized?",
          options: [
            "Compare and contrast",
            "Problem and solution",
            "Chronological narrative",
            "Cause and effect",
          ],
          answer: "Chronological narrative",
          type: "Text Structure",
        },
      ],
    },
    {
      title: "The Rain Garden",
      text: "The school's courtyard flooded every rainy season. Teachers complained, students slipped on puddles, and the caretaker spent hours with a mop. Principal Ama proposed a solution: a rain garden. She researched native plants that absorb large amounts of water and submitted a proposal to the district education office. After three months, workers dug a shallow basin near the drainage pipe and planted elephant grass, bird-of-paradise shrubs, and papyrus reeds. The first test came in October. Heavy rains fell for two days, yet the courtyard stayed dry. Maintenance costs dropped and the garden became a biology field station.",
      questions: [
        {
          q: "What was the original problem described in this passage?",
          options: [
            "Too little water",
            "Flooding in the courtyard",
            "Lack of plants",
            "Broken drainage pipes",
          ],
          answer: "Flooding in the courtyard",
          type: "Main Idea",
        },
        {
          q: "Why were native plants chosen?",
          options: [
            "They are decorative",
            "They absorb large amounts of water",
            "They are cheap",
            "Students requested them",
          ],
          answer: "They absorb large amounts of water",
          type: "Inference",
        },
        {
          q: "What does 'basin' most closely mean here?",
          options: [
            "A large bucket",
            "A shallow hollowed area",
            "A roof gutter",
            "A garden wall",
          ],
          answer: "A shallow hollowed area",
          type: "Vocab in Context",
        },
        {
          q: "Why did the author include the October rain event?",
          options: [
            "To describe weather patterns",
            "To demonstrate the solution worked",
            "To introduce a new problem",
            "To criticize the design",
          ],
          answer: "To demonstrate the solution worked",
          type: "Author Purpose",
        },
        {
          q: "What text structure best describes this passage?",
          options: [
            "Opinion and argument",
            "Description of setting",
            "Problem and solution",
            "Sequence of events",
          ],
          answer: "Problem and solution",
          type: "Text Structure",
        },
      ],
    },
  ],
  2: [
    {
      title: "Invisible Architecture",
      text: "When city planners design public spaces, they rarely consider the invisible social architecture that governs them. Research by environmental psychologist Roger Ulrich demonstrated that patients in hospital rooms with window views of trees recovered faster and required fewer pain medications than those facing brick walls. This finding catalyzed a movement called 'biophilic design' — integrating natural elements into built environments. Beyond hospitals, biophilic principles have been applied to offices, schools, and transit stations. Google's Singapore campus features indoor waterfalls and living plant walls. Studies tracking employee data show a 15% reduction in absenteeism and measurable improvements in focus and creativity. The challenge, critics argue, is equity: premium green design reaches corporate headquarters but rarely reaches social housing.",
      questions: [
        {
          q: "What is the central argument of this passage?",
          options: [
            "Nature improves human wellbeing in built environments",
            "Hospitals should have more windows",
            "Singapore has the best architecture",
            "Green buildings are expensive",
          ],
          answer: "Nature improves human wellbeing in built environments",
          type: "Main Idea",
        },
        {
          q: "What can be inferred about social housing from the final sentence?",
          options: [
            "It already uses biophilic design",
            "Biophilic benefits are unevenly distributed",
            "Social housing has better natural light",
            "Critics support expanding the movement",
          ],
          answer: "Biophilic benefits are unevenly distributed",
          type: "Inference",
        },
        {
          q: "In context, 'catalyzed' most nearly means:",
          options: ["destroyed", "delayed", "triggered", "questioned"],
          answer: "triggered",
          type: "Vocab in Context",
        },
        {
          q: "Why does the author mention Google's Singapore campus?",
          options: [
            "To praise a specific company",
            "To provide concrete evidence of biophilic design",
            "To discuss tech industry trends",
            "To compare Asian and Western architecture",
          ],
          answer: "To provide concrete evidence of biophilic design",
          type: "Author Purpose",
        },
        {
          q: "Which structure best describes the passage organization?",
          options: [
            "Chronological history",
            "Cause and effect with counterargument",
            "Compare and contrast of buildings",
            "List of design rules",
          ],
          answer: "Cause and effect with counterargument",
          type: "Text Structure",
        },
      ],
    },
  ],
  3: [
    {
      title: "The Ethics of Predictive Policing",
      text: "Predictive policing algorithms analyse historical crime data to forecast where offences are likely to occur. Proponents argue the approach optimizes resource allocation, directing patrols to high-risk zones before crimes happen. Critics contend these systems encode systemic bias: because Black and Brown communities have historically faced disproportionate policing, the training data contains racially skewed crime records. The algorithm thus predicts more crimes in those areas, generating more police presence, producing more arrests, which further skews the data — a self-reinforcing cycle. A 2020 audit of the PredPol system used in Los Angeles found that patrol density increased 53% in low-income minority neighborhoods while remaining unchanged in comparably rated affluent areas. The company disputes the methodology. Resolving this debate requires confronting a foundational question: can a fair algorithm exist if trained on fundamentally unfair historical data?",
      questions: [
        {
          q: "What is the core tension the author presents?",
          options: [
            "Resource allocation vs. officer safety",
            "Efficiency gains vs. encoded racial bias",
            "Technology vs. traditional policing",
            "Privacy vs. public safety",
          ],
          answer: "Efficiency gains vs. encoded racial bias",
          type: "Main Idea",
        },
        {
          q: "What does the 'self-reinforcing cycle' suggest about the algorithm?",
          options: [
            "It learns to become more accurate over time",
            "It perpetuates existing inequalities by design",
            "Officers can override its recommendations",
            "It only works in large cities",
          ],
          answer: "It perpetuates existing inequalities by design",
          type: "Inference",
        },
        {
          q: "The word 'disproportionate' in this context means:",
          options: [
            "Unusually small",
            "Greater than what is fair or expected",
            "Carefully measured",
            "Historically justified",
          ],
          answer: "Greater than what is fair or expected",
          type: "Vocab in Context",
        },
        {
          q: "Why does the author end with a question?",
          options: [
            "Because no research exists on the topic",
            "To prompt critical reflection on fundamental assumptions",
            "To avoid taking a position",
            "Because the question is easily answered",
          ],
          answer: "To prompt critical reflection on fundamental assumptions",
          type: "Author Purpose",
        },
        {
          q: "The passage is primarily structured as:",
          options: [
            "Narrative story",
            "Argumentative analysis presenting opposing views",
            "Description of a single research study",
            "Historical timeline",
          ],
          answer: "Argumentative analysis presenting opposing views",
          type: "Text Structure",
        },
      ],
    },
  ],
};

// ──────────────────────────── GAME 2 DATA: MAIN IDEA MASTER ────────────────────────

interface ParagraphItem {
  sentences: string[];
  mainIdeaIdx: number;
  explanation: string;
}

const PARAGRAPH_ITEMS: Record<1 | 2 | 3, ParagraphItem[]> = {
  1: [
    {
      sentences: [
        "Dogs are popular pets worldwide.",
        "They can be trained to perform many tasks.",
        "Dogs were among the first animals domesticated by humans.",
        "Many people enjoy walking their dogs in the park.",
      ],
      mainIdeaIdx: 0,
      explanation:
        "'Dogs are popular pets worldwide' is the broadest statement the others support.",
    },
    {
      sentences: [
        "Solar energy is becoming cheaper every year.",
        "Solar panels can power homes and businesses.",
        "Renewable energy sources like solar are the future of power.",
        "Countries are investing more in solar farms.",
      ],
      mainIdeaIdx: 2,
      explanation:
        "'Renewable energy sources like solar are the future' encompasses all other details.",
    },
    {
      sentences: [
        "Exercise improves heart health.",
        "Regular physical activity reduces stress.",
        "It also boosts memory and concentration.",
        "Physical activity benefits both body and mind.",
      ],
      mainIdeaIdx: 3,
      explanation:
        "'Physical activity benefits both body and mind' is the umbrella claim.",
    },
    {
      sentences: [
        "Ghana gained independence in 1957.",
        "The fight for independence began in the 1940s.",
        "Ghana was the first sub-Saharan African country to gain independence.",
        "Independence movements spread across Africa after Ghana's success.",
      ],
      mainIdeaIdx: 2,
      explanation:
        "Ghana being first is the key fact; the others provide context.",
    },
  ],
  2: [
    {
      sentences: [
        "The printing press democratized knowledge by making books affordable.",
        "Gutenberg invented the printing press in the 1440s.",
        "Before printing, books were hand-copied by monks.",
        "The press sparked the Protestant Reformation and Scientific Revolution.",
      ],
      mainIdeaIdx: 0,
      explanation:
        "Democratizing knowledge is the impact; other sentences give background or examples.",
    },
    {
      sentences: [
        "Urban heat islands occur when cities are significantly warmer than surrounding rural areas.",
        "Dark surfaces like asphalt absorb more solar radiation.",
        "Reduced vegetation means less cooling through evapotranspiration.",
        "Heat islands increase energy consumption and heat-related illness.",
      ],
      mainIdeaIdx: 0,
      explanation:
        "The first sentence defines the phenomenon; others explain causes and effects.",
    },
    {
      sentences: [
        "Antibiotic resistance is accelerating due to overuse in livestock and medicine.",
        "Resistant bacteria killed 1.27 million people in 2019.",
        "Antibiotic resistance threatens to make routine infections fatal.",
        "Overuse of antibiotics is a major public health crisis.",
      ],
      mainIdeaIdx: 2,
      explanation:
        "'Resistance threatens to make infections fatal' captures the danger; others are evidence.",
    },
    {
      sentences: [
        "Language shapes how we think about time, colour, and relationships.",
        "Mandarin speakers use vertical spatial metaphors for time.",
        "Some languages have no words for left and right, only cardinal directions.",
        "The Sapir-Whorf hypothesis suggests language influences cognition.",
      ],
      mainIdeaIdx: 0,
      explanation:
        "'Language shapes how we think' is the broad claim supported by the specific examples.",
    },
  ],
  3: [
    {
      sentences: [
        "The concept of net neutrality ensures all internet traffic is treated equally by providers.",
        "Telecom companies argue that priority lanes would fund network upgrades.",
        "Critics warn that without neutrality, small businesses and free speech suffer.",
        "Net neutrality is a contested policy shaping who controls the internet.",
      ],
      mainIdeaIdx: 3,
      explanation:
        "The contested nature and its stakes is the main idea; others are sub-arguments.",
    },
    {
      sentences: [
        "Quantum computing uses superposition and entanglement to perform calculations.",
        "Classical computers use binary bits; quantum computers use qubits.",
        "Quantum computers could break current encryption standards.",
        "Quantum computing represents a fundamental shift in computational power.",
      ],
      mainIdeaIdx: 3,
      explanation:
        "'Fundamental shift in computational power' is the overarching claim the others support.",
    },
    {
      sentences: [
        "Indigenous knowledge systems offer insights into biodiversity and sustainable land use.",
        "Ethnobotanists have documented medicinal plants known to indigenous communities for centuries.",
        "Many modern pharmaceuticals derive from plants identified in traditional medicine.",
        "Mainstream science is increasingly integrating indigenous ecological knowledge.",
      ],
      mainIdeaIdx: 3,
      explanation:
        "The trend toward integration is the main idea; specific examples are supporting details.",
    },
    {
      sentences: [
        "Disinformation spreads faster than correction on social media due to algorithmic amplification.",
        "False news spreads six times faster than accurate news on Twitter, per MIT research.",
        "Social media platforms profit from engagement regardless of content accuracy.",
        "The digital information ecosystem increasingly favours sensationalism over truth.",
      ],
      mainIdeaIdx: 3,
      explanation:
        "'The digital ecosystem favours sensationalism' is the broad indictment the others evidence.",
    },
  ],
};

// ──────────────────────────── GAME 3 DATA: INFERENCE DETECTIVE ────────────────────────

interface InferenceItem {
  passage: string;
  question: string;
  options: string[];
  answer: string;
  evidence: string;
  wrongExplanation: string;
}

const INFERENCE_ITEMS: Record<1 | 2 | 3, InferenceItem[]> = {
  1: [
    {
      passage:
        "Amara entered the classroom, looked at the empty desks, and smiled. She sat in her usual seat by the window and opened her notebook before anyone else arrived.",
      question: "What can you infer about Amara?",
      options: [
        "She is late for class",
        "She is an early and prepared student",
        "She has never been in this classroom",
        "She dislikes sitting by windows",
      ],
      answer: "She is an early and prepared student",
      evidence:
        "She arrived before anyone and opened her notebook immediately.",
      wrongExplanation:
        "Empty desks and arriving early contradict being late or unfamiliar.",
    },
    {
      passage:
        "The market stalls were empty. Shopkeepers were boarding up windows. A woman hurried past, pushing a cart loaded with sandbags.",
      question: "What situation is the passage implying?",
      options: [
        "A market is closing for the night",
        "A dangerous weather event is approaching",
        "A public holiday is starting",
        "A new road is being built",
      ],
      answer: "A dangerous weather event is approaching",
      evidence:
        "Boarding windows and sandbags indicate flood or storm preparation.",
      wrongExplanation:
        "Sandbags specifically suggest flooding or storm, not holidays or construction.",
    },
    {
      passage:
        "Thomas checked his watch three times in ten minutes, drummed his fingers on the table, and kept glancing toward the door.",
      question: "What is Thomas likely feeling?",
      options: ["Bored", "Angry", "Anxious or impatient", "Hungry"],
      answer: "Anxious or impatient",
      evidence:
        "Repeated watch-checking, drumming fingers, and watching the door are signs of impatience.",
      wrongExplanation:
        "Boredom wouldn't explain watching the door; hunger is not implied.",
    },
  ],
  2: [
    {
      passage:
        "The company announced record profits in its annual report. The same week, two board members quietly sold large portions of their shares.",
      question: "What does the author imply about the board members?",
      options: [
        "They are celebrating the company's success",
        "They may have information suggesting the profits won't last",
        "They are investing elsewhere for better returns",
        "They are required to sell shares annually",
      ],
      answer: "They may have information suggesting the profits won't last",
      evidence:
        "Selling shares immediately after record profits is counterintuitive — it implies insider knowledge of trouble ahead.",
      wrongExplanation:
        "Celebrating success would mean buying more shares, not selling.",
    },
    {
      passage:
        "The delegation arrived with full diplomatic credentials. The host nation's foreign minister greeted them personally at the airport. All scheduled public events were cancelled the following day.",
      question: "What can be inferred from the cancelled public events?",
      options: [
        "The visitors prefer privacy",
        "Sensitive private negotiations have begun",
        "The host nation made a diplomatic error",
        "The delegation wants to tour the capital",
      ],
      answer: "Sensitive private negotiations have begun",
      evidence:
        "High-level greeting plus sudden cancellation of public events signals confidential talks.",
      wrongExplanation:
        "Cancelling public events to 'tour the capital' or due to error does not fit the diplomatic context.",
    },
    {
      passage:
        "The study found that students who ate breakfast scored 14% higher on concentration tests. The school canteen operated only from 11am onwards.",
      question: "What problem does the author imply exists at this school?",
      options: [
        "The canteen food is unhealthy",
        "Students arrive too early for classes",
        "Students likely attend class without breakfast",
        "The study's methodology is flawed",
      ],
      answer: "Students likely attend class without breakfast",
      evidence:
        "If the canteen opens at 11am but breakfast improves performance, students have no access to breakfast before lessons.",
      wrongExplanation:
        "The passage implies a structural access problem, not food quality or methodology.",
    },
  ],
  3: [
    {
      passage:
        "The independent audit cleared the mayor of wrongdoing. The mayor's press team immediately called a press conference. Opposition party leaders declined to attend, releasing a statement calling the audit 'politically compromised'.",
      question: "What tension does the author imply exists in this situation?",
      options: [
        "The audit findings are legally binding",
        "Trust in institutional independence has broken down",
        "The opposition has evidence of corruption",
        "The press conference was poorly organized",
      ],
      answer: "Trust in institutional independence has broken down",
      evidence:
        "The opposition rejecting the audit result as 'politically compromised' signals institutional distrust, regardless of actual findings.",
      wrongExplanation:
        "The passage implies a crisis of trust, not confirmed corruption or procedural issues.",
    },
    {
      passage:
        "The algorithm's recommendation engine served users increasingly extreme content over a six-month observation period. Researchers noted user engagement rose by 40% while self-reported wellbeing dropped by 22%.",
      question:
        "What does this data imply about the platform's design incentives?",
      options: [
        "The platform prioritizes user mental health",
        "The platform optimizes for engagement regardless of harm",
        "Extreme content is more educational",
        "Users requested more challenging content",
      ],
      answer: "The platform optimizes for engagement regardless of harm",
      evidence:
        "Higher engagement alongside lower wellbeing shows the system values clicks over user welfare.",
      wrongExplanation:
        "If mental health were the priority, the design would not trade wellbeing for engagement.",
    },
    {
      passage:
        "Three peer-reviewed studies found no link between the vaccine and the reported side effects. The pharmaceutical company that manufactures the vaccine funded all three studies.",
      question: "What concern does the author imply the reader should have?",
      options: [
        "The vaccine is definitely unsafe",
        "The studies are methodologically flawed",
        "Funding source may create a conflict of interest",
        "Peer review is not a reliable process",
      ],
      answer: "Funding source may create a conflict of interest",
      evidence:
        "All three studies being funded by the benefiting company suggests potential bias, even if the methodology is sound.",
      wrongExplanation:
        "The passage implies a systemic concern about independence, not a direct claim the vaccine is unsafe.",
    },
  ],
};

// ──────────────────────────── GAME 1: STORY SPRINT ────────────────────────

function StorySprint({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<
    "idle" | "reading" | "questions" | "between"
  >("idle");
  const [passageIdx, setPassageIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    explanation: string;
  } | null>(null);
  const [readStart, setReadStart] = useState<number>(0);
  const [speedBonus, setSpeedBonus] = useState(0);
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const passages = PASSAGES[config.difficulty];
  const passage = passages[passageIdx];

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = total > 0 ? (correct / total) * 100 : 0;
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
    [config, score, correct, total, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));

  function startQuestions() {
    const readSec = (Date.now() - readStart) / 1000;
    setSpeedBonus(Math.max(0, Math.floor(300 - readSec * 2)));
    setQIdx(0);
    setPhase("questions");
  }

  function handleAnswer(opt: string) {
    const q = passage.questions[qIdx];
    const ok = opt === q.answer;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty + speedBonus);
    }
    setFeedback({
      ok,
      explanation: ok
        ? `Correct! This was a ${q.type} question.`
        : `Incorrect. The answer was: "${q.answer}"`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (qIdx + 1 >= passage.questions.length) {
        if (passageIdx + 1 >= passages.length) endGame(true);
        else setPhase("between");
      } else setQIdx((i) => i + 1);
    }, 2000);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="reading_adventure.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#7c3aed]" />
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
            <BookOpen className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Story Speed Reader
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Read each passage, then answer 5 comprehension questions. Score =
              correct answers x speed bonus.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => {
                setPhase("reading");
                setReadStart(Date.now());
              }}
              data-ocid="reading_adventure.start_button"
            >
              Begin Reading
            </GlowButton>
          </motion.div>
        </div>
      )}
      {phase === "reading" && (
        <motion.div
          key={`reading-${passageIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col gap-4 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Passage {passageIdx + 1} of {passages.length}
            </span>
            <span className="text-xs text-[#f59e0b]">
              Read carefully — questions follow
            </span>
          </div>
          <div className="glass-card rounded-2xl p-6 flex-1 overflow-y-auto neon-top-border">
            <h3
              className="text-xl font-black text-[#00f5ff] mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {passage.title}
            </h3>
            <p className="text-foreground leading-relaxed text-sm">
              {passage.text}
            </p>
          </div>
          <GlowButton
            variant="secondary"
            onClick={startQuestions}
            data-ocid="reading_adventure.done_reading_button"
          >
            Ready — Answer Questions
          </GlowButton>
        </motion.div>
      )}
      {phase === "questions" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question {qIdx + 1} of {passage.questions.length}
            </span>
            <span className="text-[#f59e0b] flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Speed bonus: +{speedBonus}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`q-${passageIdx}-${qIdx}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-[#7c3aed] mb-2">
                  {passage.questions[qIdx].type}
                </p>
                <p className="text-lg font-bold text-foreground mb-4">
                  {passage.questions[qIdx].q}
                </p>
                <div className="flex flex-col gap-2">
                  {passage.questions[qIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => handleAnswer(opt)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${feedback ? (opt === passage.questions[qIdx].answer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:border-[#7c3aed]/60 hover:bg-[#7c3aed]/10 text-foreground"}`}
                      data-ocid={`reading_adventure.option.${i + 1}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-3 p-3 rounded-xl border flex items-start gap-2 ${feedback.ok ? "border-[#10b981]/50 bg-[#10b981]/10" : "border-[#f43f5e]/50 bg-[#f43f5e]/10"}`}
                  >
                    {feedback.ok ? (
                      <CheckCircle className="h-4 w-4 text-[#10b981] shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-[#f43f5e] shrink-0" />
                    )}
                    <p
                      className={`text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                    >
                      {feedback.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {phase === "between" && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-[#10b981]" />
            <h3 className="text-2xl font-black text-[#10b981] mb-2">
              Passage Complete
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Moving to the next passage...
            </p>
            <GlowButton
              variant="primary"
              onClick={() => {
                setPassageIdx((i) => i + 1);
                setPhase("reading");
                setReadStart(Date.now());
              }}
              data-ocid="reading_adventure.next_passage_button"
            >
              Next Passage
            </GlowButton>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────── GAME 2: MAIN IDEA MASTER ────────────────────────

function MainIdeaMaster({ config, onGameEnd }: Props) {
  const pool = PARAGRAPH_ITEMS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selections, setSelections] = useState<("main" | "support" | null)[]>(
    [],
  );
  const [submitted, setSubmitted] = useState(false);
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
    setSelections(new Array(pool[i].sentences.length).fill(null));
    setSubmitted(false);
    setFeedback(null);
  }

  function handleStart() {
    initItem(0);
    setStarted(true);
    startTime.current = Date.now();
  }

  function toggleLabel(sIdx: number, label: "main" | "support") {
    if (submitted) return;
    const next = [...selections];
    next[sIdx] = next[sIdx] === label ? null : label;
    setSelections(next);
  }

  function submitLabels() {
    if (submitted || !item) return;
    const mainIdx = selections.findIndex((s) => s === "main");
    const ok = mainIdx === item.mainIdeaIdx;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 250 * config.difficulty);
    }
    setSubmitted(true);
    setFeedback({
      ok,
      msg: ok
        ? `Correct! ${item.explanation}`
        : `Wrong. Sentence ${item.mainIdeaIdx + 1} is the main idea. ${item.explanation}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= pool.length) endGame(true);
      else {
        setIdx((i) => i + 1);
        initItem(idx + 1);
      }
    }, 3000);
  }

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="reading_adventure.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Search className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Main Idea Master
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A paragraph is shown as individual sentences. Label each sentence:
            Main Idea or Supporting Detail.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Only one sentence is the main idea. The rest support it.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={handleStart}
            data-ocid="reading_adventure.start_button"
          >
            Start Labelling
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="reading_adventure.page"
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
          className="flex-1 flex flex-col gap-3"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Label each sentence: Mark the Main Idea, rest are Supporting Details
          </p>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {item.sentences.map((sent, sIdx) => (
              <div
                key={sIdx}
                className={`glass-card rounded-xl p-3 border transition-all ${
                  submitted && sIdx === item.mainIdeaIdx
                    ? "border-[#10b981] bg-[#10b981]/10"
                    : submitted
                      ? "border-border/20"
                      : "border-border/40"
                }`}
              >
                <p className="text-sm text-foreground mb-2">{sent}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLabel(sIdx, "main")}
                    disabled={submitted}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${selections[sIdx] === "main" ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 text-muted-foreground hover:border-[#7c3aed]/40"}`}
                    data-ocid={`reading_adventure.main_label.${sIdx + 1}`}
                  >
                    Main Idea
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLabel(sIdx, "support")}
                    disabled={submitted}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${selections[sIdx] === "support" ? "border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]" : "border-border/40 text-muted-foreground hover:border-[#f59e0b]/40"}`}
                    data-ocid={`reading_adventure.support_label.${sIdx + 1}`}
                  >
                    Supporting
                  </button>
                </div>
              </div>
            ))}
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
          {!submitted && (
            <GlowButton
              variant="primary"
              onClick={submitLabels}
              disabled={!selections.some((s) => s === "main")}
              data-ocid="reading_adventure.submit_labels_button"
            >
              Submit Labels
            </GlowButton>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────── GAME 3: INFERENCE DETECTIVE ────────────────────────

function InferenceDetective({ config, onGameEnd }: Props) {
  const pool = INFERENCE_ITEMS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"question" | "evidence">("question");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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

  function handleAnswer(opt: string) {
    if (feedback) return;
    const ok = opt === item.answer;
    setSelectedAnswer(opt);
    if (!ok)
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    setFeedback({
      ok,
      msg: ok
        ? "Correct inference! Now identify the textual evidence that supports it."
        : `Wrong. The correct inference is: "${item.answer}"`,
    });
    if (ok) {
      setTimeout(() => {
        setFeedback(null);
        setPhase("evidence");
      }, 1800);
    } else {
      setTimeout(() => {
        setFeedback(null);
        if (idx + 1 >= pool.length) endGame(false);
        else {
          setIdx((i) => i + 1);
          setPhase("question");
          setSelectedAnswer(null);
        }
      }, 2000);
    }
  }

  function handleEvidence(evidenceText: string) {
    if (feedback) return;
    const ok = evidenceText === item.evidence;
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 300 * config.difficulty);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1500);
        return nl;
      });
    setFeedback({
      ok,
      msg: ok
        ? `Excellent! Evidence identified correctly. +${300 * config.difficulty} pts`
        : `Not quite. The key evidence was: "${item.evidence}"`,
    });
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      setPhase("question");
      if (idx + 1 >= pool.length) endGame(true);
      else setIdx((i) => i + 1);
    }, 2500);
  }

  // Build evidence options: correct + distractors
  const EVIDENCE_DISTRACTORS = [
    "The author uses formal academic language throughout.",
    "The setting is described in the opening sentence.",
    "Multiple characters are introduced early in the passage.",
    "Statistical data is referenced to support the claim.",
  ];
  const evidenceOptions = [
    item?.evidence,
    ...EVIDENCE_DISTRACTORS.slice(0, 3),
  ].sort(() => Math.random() - 0.5);

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="reading_adventure.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <Search className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Inference Detective
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Read each passage, then answer an inference question.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            If correct, identify the textual evidence that supports your
            inference for bonus points.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="reading_adventure.start_button"
          >
            Begin Investigation
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="reading_adventure.page"
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
          {idx + 1}/{pool.length}
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
          <div className="glass-card rounded-xl p-4 border border-[#f59e0b]/30">
            <p className="text-xs uppercase tracking-widest text-[#f59e0b] mb-2">
              Passage
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {item.passage}
            </p>
          </div>
          {phase === "question" && (
            <>
              <p className="text-sm font-bold text-foreground">
                {item.question}
              </p>
              <div className="flex flex-col gap-2">
                {item.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleAnswer(opt)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${feedback ? (opt === item.answer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : opt === selectedAnswer ? "border-[#f43f5e]/60 bg-[#f43f5e]/10 text-[#f43f5e]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:border-[#f59e0b]/60 text-foreground"}`}
                    data-ocid={`reading_adventure.inference_option.${i + 1}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
          {phase === "evidence" && (
            <>
              <p className="text-sm font-bold text-foreground">
                Which sentence from the passage best supports your inference?
              </p>
              <div className="flex flex-col gap-2">
                {evidenceOptions.map((ev, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleEvidence(ev)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${feedback ? (ev === item.evidence ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:border-[#00f5ff]/60 text-foreground"}`}
                    data-ocid={`reading_adventure.evidence_option.${i + 1}`}
                  >
                    {ev}
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

export default function ReadingAdventure({ config, onGameEnd }: Props) {
  if (config.gameId === "main-idea-master")
    return <MainIdeaMaster config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "inference-detective")
    return <InferenceDetective config={config} onGameEnd={onGameEnd} />;
  return <StorySprint config={config} onGameEnd={onGameEnd} />;
}
