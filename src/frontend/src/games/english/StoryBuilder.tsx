import { GlowButton } from "@/components/ui/GlowButton";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  FileText,
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

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

type Stage =
  | "exposition"
  | "rising_action"
  | "climax"
  | "falling_action"
  | "resolution";
type ConnectiveKey = "transition_1" | "transition_2" | "transition_3";

interface Story {
  title: string;
  paragraphs: string[];
  correctOrder: number[];
  stages: Stage[];
  transitions: Record<
    ConnectiveKey,
    { question: string; options: string[]; answer: string }
  >;
}

const STORIES: Record<1 | 2 | 3, Story[]> = {
  1: [
    {
      title: "The Broken Bridge",
      paragraphs: [
        "Villagers discovered the bridge had collapsed overnight, cutting them off from the market town.",
        "For years, the old wooden bridge had served the village well, connecting farmers to the market.",
        "After the flood, the situation became desperate — food supplies dwindled rapidly.",
        "The engineer finally completed the new steel bridge, and the village celebrated with a feast.",
        "Working together, villagers gathered materials and the community engineer designed a new structure.",
      ],
      correctOrder: [1, 0, 2, 4, 3],
      stages: [
        "exposition",
        "rising_action",
        "climax",
        "falling_action",
        "resolution",
      ],
      transitions: {
        transition_1: {
          question:
            "Between introduction and the bridge collapsing, which word best connects them?",
          options: ["However", "Therefore", "Meanwhile", "Similarly"],
          answer: "However",
        },
        transition_2: {
          question:
            "Between the desperate situation and the community working together?",
          options: ["Nevertheless", "Additionally", "Consequently", "Whereas"],
          answer: "Consequently",
        },
        transition_3: {
          question: "Between building and the final celebration?",
          options: ["Meanwhile", "Finally", "Although", "Because"],
          answer: "Finally",
        },
      },
    },
  ],
  2: [
    {
      title: "The Silent Algorithm",
      paragraphs: [
        "Tensions peaked when the system began flagging innocent citizens — protests erupted outside city hall.",
        "Meridian City deployed an AI surveillance network promising to reduce crime by 40% within a year.",
        "A young data analyst discovered the algorithm had been trained on biased historical arrest data.",
        "The city council ordered an independent audit and suspended the system pending review.",
        "Gradually, civilian oversight boards were established, setting transparency standards for AI policing tools.",
      ],
      correctOrder: [1, 2, 0, 3, 4],
      stages: [
        "exposition",
        "rising_action",
        "climax",
        "falling_action",
        "resolution",
      ],
      transitions: {
        transition_1: {
          question: "Between deploying the AI and discovering the bias?",
          options: ["Nevertheless", "However", "Whereas", "Therefore"],
          answer: "However",
        },
        transition_2: {
          question: "Between the protests and the council's response?",
          options: ["In response", "Similarly", "For example", "Despite this"],
          answer: "In response",
        },
        transition_3: {
          question: "Between the audit and establishing oversight boards?",
          options: ["Subsequently", "Although", "Because", "Namely"],
          answer: "Subsequently",
        },
      },
    },
  ],
  3: [
    {
      title: "The Cartographer's Dilemma",
      paragraphs: [
        "Dr. Aruna Patel published a map projection that accurately depicted relative landmass sizes — upending the dominant Mercator tradition.",
        "For centuries, European cartographers had used the Mercator projection, unknowingly distorting Africa and South America's true scale.",
        "The map went viral; established geographic institutes rejected it as confusing, while educators worldwide adopted it immediately.",
        "After years of debate, a new international cartographic standard was proposed incorporating multiple projections for different contexts.",
        "The controversy forced a global conversation about how maps encode political and cultural assumptions.",
      ],
      correctOrder: [1, 0, 2, 4, 3],
      stages: [
        "exposition",
        "rising_action",
        "climax",
        "falling_action",
        "resolution",
      ],
      transitions: {
        transition_1: {
          question:
            "Between the centuries-long Mercator tradition and the new publication?",
          options: [
            "Challenging this",
            "In addition",
            "For instance",
            "Meanwhile",
          ],
          answer: "Challenging this",
        },
        transition_2: {
          question: "Between the mixed reaction and the global conversation?",
          options: ["This polarization", "However", "Moreover", "Similarly"],
          answer: "This polarization",
        },
        transition_3: {
          question: "Between the global conversation and the new standard?",
          options: ["Ultimately", "Although", "Yet", "Furthermore"],
          answer: "Ultimately",
        },
      },
    },
  ],
};

const STAGE_COLORS: Record<Stage, string> = {
  exposition: "#7c3aed",
  rising_action: "#f59e0b",
  climax: "#f43f5e",
  falling_action: "#00f5ff",
  resolution: "#10b981",
};

// ──────────────────────────── GAME 2 DATA: CHARACTER CREATOR ────────────────────────

interface CharacterItem {
  name: string;
  description: string;
  trait: string;
  traitOptions: string[];
  motivation: string;
  motivationOptions: string[];
  flaw: string;
  flawOptions: string[];
}

const CHARACTERS: Record<1 | 2 | 3, CharacterItem[]> = {
  1: [
    {
      name: "Marcus",
      description:
        "Marcus always volunteers first in class. He stays late to help the teacher arrange chairs and brings extra pencils for friends who forget theirs. He gets upset if others don't follow the rules.",
      trait: "helpful",
      traitOptions: ["helpful", "selfish", "lazy", "cruel"],
      motivation: "to be liked by everyone",
      motivationOptions: [
        "to be liked by everyone",
        "to become rich",
        "to travel the world",
        "to win prizes",
      ],
      flaw: "needs approval to feel worthy",
      flawOptions: [
        "needs approval to feel worthy",
        "is physically weak",
        "cannot read well",
        "dislikes animals",
      ],
    },
    {
      name: "Efua",
      description:
        "Efua reads every book in the library and asks her teacher endless questions. She stays up past midnight researching. She struggles to connect with classmates who don't share her interests.",
      trait: "curious",
      traitOptions: ["curious", "brave", "dishonest", "generous"],
      motivation: "to understand everything",
      motivationOptions: [
        "to understand everything",
        "to find treasure",
        "to become a doctor",
        "to please her parents",
      ],
      flaw: "alienates peers with her intensity",
      flawOptions: [
        "alienates peers with her intensity",
        "is afraid of heights",
        "cannot swim",
        "loses things easily",
      ],
    },
    {
      name: "Kwame",
      description:
        "Kwame never backs down from any challenge. He crossed the flooded river when others refused. He doesn't think twice about risk and has broken bones twice already.",
      trait: "brave",
      traitOptions: ["brave", "kind", "artistic", "smart"],
      motivation: "to prove himself to his father",
      motivationOptions: [
        "to prove himself to his father",
        "to win a trophy",
        "to impress girls",
        "to escape boredom",
      ],
      flaw: "underestimates danger recklessly",
      flawOptions: [
        "underestimates danger recklessly",
        "is too quiet",
        "eats too much",
        "forgets homework",
      ],
    },
  ],
  2: [
    {
      name: "Dr. Miriam",
      description:
        "Dr. Miriam works 80-hour weeks at the clinic, turns down promotions, and donates her salary increase to equipment. She rarely sleeps and snaps at her family during rare visits home.",
      trait: "dedicated",
      traitOptions: ["dedicated", "ruthless", "arrogant", "naive"],
      motivation: "to save lives that the system abandoned",
      motivationOptions: [
        "to save lives that the system abandoned",
        "to become famous",
        "to earn a large salary",
        "to retire early",
      ],
      flaw: "sacrifices personal relationships for work",
      flawOptions: [
        "sacrifices personal relationships for work",
        "is afraid of blood",
        "cannot drive",
        "dislikes children",
      ],
    },
    {
      name: "Victor",
      description:
        "Victor always finds a shortcut. He copied classmates in school, faked references at work, and takes credit for team ideas. He is charming and rises quickly through every organisation.",
      trait: "opportunistic",
      traitOptions: ["opportunistic", "generous", "courageous", "nurturing"],
      motivation: "to reach the top by any means",
      motivationOptions: [
        "to reach the top by any means",
        "to protect his family",
        "to serve his country",
        "to create art",
      ],
      flaw: "builds success on unstable foundations",
      flawOptions: [
        "builds success on unstable foundations",
        "cannot concentrate",
        "is too honest",
        "is physically frail",
      ],
    },
    {
      name: "Yemi",
      description:
        "Yemi mediates every conflict in her village. She listens for hours, finds common ground, and never takes sides publicly. Her neighbours trust her. But she has never shared her own opinion on anything.",
      trait: "empathetic",
      traitOptions: ["empathetic", "selfish", "stubborn", "reckless"],
      motivation: "to keep her community in harmony",
      motivationOptions: [
        "to keep her community in harmony",
        "to become a politician",
        "to leave her village",
        "to become wealthy",
      ],
      flaw: "suppresses her own needs and identity",
      flawOptions: [
        "suppresses her own needs and identity",
        "cannot cook",
        "speaks too loudly",
        "avoids hard work",
      ],
    },
  ],
  3: [
    {
      name: "Ambassador Selene",
      description:
        "Ambassador Selene negotiated three landmark treaties and speaks seven languages. Every word she utters is measured against its strategic value. She ended a war but lost her marriage and both children's trust in the process.",
      trait: "strategically brilliant",
      traitOptions: [
        "strategically brilliant",
        "emotionally warm",
        "physically strong",
        "creatively gifted",
      ],
      motivation: "to create a world without war at any personal cost",
      motivationOptions: [
        "to create a world without war at any personal cost",
        "to gain international recognition",
        "to avenge a past betrayal",
        "to accumulate political power",
      ],
      flaw: "cannot separate purpose from identity",
      flawOptions: [
        "cannot separate purpose from identity",
        "is afraid of crowds",
        "lacks intelligence",
        "has a speech impediment",
      ],
    },
    {
      name: "The Architect",
      description:
        "The Architect designed the city's masterpiece tower but buried the evidence that its foundations were cut to save costs. The tower stands. He lives in dread. He mentors young engineers and demands absolute integrity from them.",
      trait: "privately hypocritical",
      traitOptions: [
        "privately hypocritical",
        "openly corrupt",
        "naively idealistic",
        "consistently virtuous",
      ],
      motivation: "to be remembered as a great builder",
      motivationOptions: [
        "to be remembered as a great builder",
        "to accumulate wealth",
        "to mentor the next generation",
        "to atone for past failures",
      ],
      flaw: "cannot confront the gap between ideals and actions",
      flawOptions: [
        "cannot confront the gap between ideals and actions",
        "lacks technical skill",
        "is too generous",
        "avoids responsibility",
      ],
    },
  ],
};

// ──────────────────────────── GAME 3 DATA: STORY CONTINUER ────────────────────────

interface BranchChoice {
  text: string;
  shortTerm: string;
  longTerm: string;
  score: number;
}

interface BranchStory {
  title: string;
  opening: string;
  choices: [BranchChoice[], BranchChoice[], BranchChoice[]];
  bestPath: [number, number, number];
  bestOutcome: string;
  poorOutcome: string;
}

const BRANCH_STORIES: Record<1 | 2 | 3, BranchStory[]> = {
  1: [
    {
      title: "The New Student",
      opening:
        "Kofi notices a new student sitting alone at lunch, looking overwhelmed. Nobody else has gone to speak with them.",
      choices: [
        [
          {
            text: "Walk over and introduce yourself",
            shortTerm: "The student looks relieved and smiles.",
            longTerm:
              "You develop a lasting friendship and the student becomes confident.",
            score: 3,
          },
          {
            text: "Wait to see if someone else goes",
            shortTerm: "Nobody approaches. The student eats alone.",
            longTerm: "The student withdraws from school activities.",
            score: 1,
          },
          {
            text: "Mention it to the teacher and move on",
            shortTerm: "The teacher nods but is busy.",
            longTerm: "The student receives some support but feels isolated.",
            score: 2,
          },
        ],
        [
          {
            text: "Invite them to join your group's activity",
            shortTerm: "The student joins and participates carefully.",
            longTerm: "They integrate into the class and gain confidence.",
            score: 3,
          },
          {
            text: "Suggest they speak to the class rep",
            shortTerm: "The student is uncertain who that is.",
            longTerm: "Minor improvement but connection remains thin.",
            score: 2,
          },
          {
            text: "Talk to them but leave after five minutes",
            shortTerm: "Brief warmth but they are alone again.",
            longTerm: "The student sees the gesture as hollow.",
            score: 1,
          },
        ],
        [
          {
            text: "Continue checking in with them daily",
            shortTerm: "They open up and share what is difficult.",
            longTerm: "Full inclusion in the class community.",
            score: 3,
          },
          {
            text: "Move on to your existing friends",
            shortTerm: "The new student manages independently.",
            longTerm: "They do fine but never feel fully included.",
            score: 2,
          },
          {
            text: "Discourage others from being exclusive",
            shortTerm: "Some classmates become more welcoming.",
            longTerm: "Class culture shifts positively for everyone.",
            score: 3,
          },
        ],
      ],
      bestPath: [0, 0, 0],
      bestOutcome:
        "You consistently showed empathy and inclusion. The student thrives and the class grows stronger.",
      poorOutcome:
        "Passive or shallow responses left the student isolated and the opportunity for genuine connection missed.",
    },
  ],
  2: [
    {
      title: "The Group Project",
      opening:
        "Your group must submit a major project in three days. One member hasn't contributed at all. Another wants to exclude them from the final submission and divide the grade among those who worked.",
      choices: [
        [
          {
            text: "Speak privately with the absent member about what's wrong",
            shortTerm: "They reveal a family crisis you didn't know about.",
            longTerm:
              "Trust increases and they contribute as much as possible.",
            score: 3,
          },
          {
            text: "Report them to the teacher immediately",
            shortTerm: "The teacher investigates but disrupts the group.",
            longTerm: "Resentment develops and the final product suffers.",
            score: 1,
          },
          {
            text: "Carry on without them to protect the grade",
            shortTerm: "Work progresses but unfairness grows.",
            longTerm: "A rift forms that persists beyond the project.",
            score: 2,
          },
        ],
        [
          {
            text: "Negotiate a reduced but genuine contribution they can manage",
            shortTerm: "They complete a small section with real effort.",
            longTerm:
              "Everyone feels fairly treated and group cohesion improves.",
            score: 3,
          },
          {
            text: "Give them a token task that doesn't affect quality",
            shortTerm: "They sense the sidelining and withdraw.",
            longTerm: "They stop engaging with group work altogether.",
            score: 1,
          },
          {
            text: "Let them choose their own task freely",
            shortTerm: "Some ambiguity remains about expectations.",
            longTerm: "Mixed results depending on their choice.",
            score: 2,
          },
        ],
        [
          {
            text: "Present the group as a united team",
            shortTerm: "Submission goes smoothly and fairly.",
            longTerm: "Group emerges more cohesive and empathetic.",
            score: 3,
          },
          {
            text: "Note individually who contributed what",
            shortTerm: "Accurate but creates division.",
            longTerm: "The struggling member is further stigmatised.",
            score: 2,
          },
          {
            text: "Ask the teacher to reassign the group",
            shortTerm: "Disruption at a critical stage.",
            longTerm: "All suffer from the reassignment delay.",
            score: 1,
          },
        ],
      ],
      bestPath: [0, 0, 0],
      bestOutcome:
        "You led with empathy, adapted to circumstances, and kept the team intact. A stronger result for everyone.",
      poorOutcome:
        "Prioritizing grades over people fractured the group and failed the struggling member when they needed support.",
    },
  ],
  3: [
    {
      title: "The Whistleblower",
      opening:
        "You discover that a trusted colleague has been falsifying safety data. If reported, the project gets cancelled, many jobs are lost, and your career suffers. If ignored, a dangerous product reaches the public.",
      choices: [
        [
          {
            text: "Gather all the evidence carefully before acting",
            shortTerm:
              "You have an airtight case and protect yourself legally.",
            longTerm: "The report carries maximum credibility and impact.",
            score: 3,
          },
          {
            text: "Confront the colleague directly",
            shortTerm: "They deny everything and begin covering tracks.",
            longTerm: "Evidence disappears and the situation worsens.",
            score: 1,
          },
          {
            text: "Speak informally to your manager first",
            shortTerm: "The manager is conflicted and asks you to wait.",
            longTerm: "Delay allows harm to accumulate.",
            score: 2,
          },
        ],
        [
          {
            text: "Report to the regulatory authority with your evidence",
            shortTerm: "Investigation begins promptly and officially.",
            longTerm:
              "Public safety is protected and your integrity is established.",
            score: 3,
          },
          {
            text: "Report anonymously through an internal hotline",
            shortTerm: "Investigation starts but lacks your evidence.",
            longTerm: "Outcome is uncertain and may not be fully effective.",
            score: 2,
          },
          {
            text: "Consult a lawyer about personal risk only",
            shortTerm: "Your legal protection improves.",
            longTerm: "You protect yourself but delay the public good.",
            score: 1,
          },
        ],
        [
          {
            text: "Cooperate fully with investigators and accept the consequences",
            shortTerm: "Short-term career disruption occurs.",
            longTerm:
              "You are vindicated; the product is recalled; lives saved.",
            score: 3,
          },
          {
            text: "Minimise your role to reduce personal impact",
            shortTerm: "Reduced exposure initially.",
            longTerm: "Incomplete investigation leaves gaps.",
            score: 2,
          },
          {
            text: "Distance yourself from the outcome",
            shortTerm: "You feel safe temporarily.",
            longTerm: "Moral cost compounds over time.",
            score: 1,
          },
        ],
      ],
      bestPath: [0, 0, 0],
      bestOutcome:
        "You gathered evidence, reported properly, and cooperated fully. A difficult but ethically sound path that protects public safety.",
      poorOutcome:
        "Prioritizing personal safety over public welfare allowed preventable harm and eroded your own integrity.",
    },
  ],
};

// ──────────────────────────── GAME 1: PLOT ARCHITECT ────────────────────────

function PlotArchitect({ config, onGameEnd }: Props) {
  const story = STORIES[config.difficulty][0];
  const [phase, setPhase] = useState<
    "idle" | "order" | "stages" | "connectives"
  >("idle");
  const [order, setOrder] = useState(() =>
    story.paragraphs.map((_, i) => i).sort(() => Math.random() - 0.5),
  );
  const [stageSelections, setStageSelections] = useState<(Stage | null)[]>(
    new Array(5).fill(null),
  );
  const [stageIdx, setStageIdx] = useState(0);
  const [connIdx, setConnIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [orderScore, setOrderScore] = useState(0);
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

  function moveUp(i: number) {
    if (i === 0) return;
    const o = [...order];
    [o[i], o[i - 1]] = [o[i - 1], o[i]];
    setOrder(o);
  }
  function moveDown(i: number) {
    if (i === order.length - 1) return;
    const o = [...order];
    [o[i], o[i + 1]] = [o[i + 1], o[i]];
    setOrder(o);
  }

  function submitOrder() {
    let pts = 0;
    let c = 0;
    order.forEach((paraIdx, position) => {
      if (paraIdx === story.correctOrder[position]) {
        pts += 200 * config.difficulty;
        c++;
      }
    });
    setTotal((t) => t + 5);
    setCorrect((cr) => cr + c);
    setScore((s) => s + pts);
    setOrderScore(pts);
    setPhase("stages");
  }

  function handleStageSelect(stage: Stage) {
    if (feedback) return;
    const isCorrect = stage === story.stages[stageIdx];
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    const newSel = [...stageSelections];
    newSel[stageIdx] = stage;
    setStageSelections(newSel);
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      if (stageIdx + 1 >= 5) setPhase("connectives");
      else setStageIdx((i) => i + 1);
    }, 1500);
  }

  function handleConnective(opt: string) {
    if (feedback) return;
    const key = `transition_${connIdx + 1}` as ConnectiveKey;
    const isCorrect = opt === story.transitions[key].answer;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      if (connIdx + 1 >= 3) endGame(true);
      else setConnIdx((i) => i + 1);
    }, 1500);
  }

  const STAGES: Stage[] = [
    "exposition",
    "rising_action",
    "climax",
    "falling_action",
    "resolution",
  ];
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="story_builder.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#f59e0b]" />
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
            <FileText className="h-14 w-14 mx-auto mb-4 text-[#f59e0b]" />
            <h2
              className="text-3xl font-black glow-cyan-text mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Plot Architect
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Arrange scrambled paragraphs, identify narrative stages, and
              select transition words.
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={() => setPhase("order")}
              data-ocid="story_builder.start_button"
            >
              Begin Building
            </GlowButton>
          </motion.div>
        </div>
      )}
      {phase === "order" && (
        <div className="flex-1 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Arrange paragraphs for:{" "}
            <span className="text-[#f59e0b] font-bold">{story.title}</span>
          </p>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {order.map((paraIdx, i) => (
              <motion.div
                key={paraIdx}
                layout
                className="glass-card rounded-xl p-3 border border-border/40 flex items-start gap-2"
              >
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    data-ocid={`story_builder.move_up.${i + 1}`}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === order.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    data-ocid={`story_builder.move_down.${i + 1}`}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground mb-1 block">
                    Position {i + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {story.paragraphs[paraIdx]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <GlowButton
            variant="primary"
            onClick={submitOrder}
            data-ocid="story_builder.submit_order_button"
          >
            Confirm Order
          </GlowButton>
        </div>
      )}
      {phase === "stages" && (
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Order score:{" "}
            <span className="text-[#f59e0b] font-bold">{orderScore} pts</span> —
            now identify narrative stages
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Stage {stageIdx + 1} of 5
              </p>
              <p className="text-sm text-foreground leading-relaxed border-l-2 border-[#f59e0b] pl-3">
                {story.paragraphs[story.correctOrder[stageIdx]]}
              </p>
              <p className="text-sm font-bold text-foreground">
                What narrative stage is this?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleStageSelect(s)}
                    className={`px-3 py-2 rounded-xl border text-sm font-semibold transition-all text-left ${feedback && s === story.stages[stageIdx] ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:bg-muted text-foreground"}`}
                    data-ocid={`story_builder.stage.${s}`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ background: STAGE_COLORS[s] }}
                    />
                    {s.replace("_", " ").toUpperCase()}
                  </button>
                ))}
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {feedback === "correct"
                    ? "Correct narrative stage!"
                    : `Incorrect. This is ${story.stages[stageIdx].replace("_", " ")}`}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {phase === "connectives" && (
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Final phase: select the correct transition words
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={connIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Transition {connIdx + 1} of 3
              </p>
              <p className="text-sm text-foreground">
                {
                  story.transitions[
                    `transition_${connIdx + 1}` as ConnectiveKey
                  ].question
                }
              </p>
              <div className="grid grid-cols-2 gap-2">
                {story.transitions[
                  `transition_${connIdx + 1}` as ConnectiveKey
                ].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => handleConnective(opt)}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${feedback && opt === story.transitions[`transition_${connIdx + 1}` as ConnectiveKey].answer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`}
                    data-ocid={`story_builder.connective.${i + 1}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {feedback === "correct"
                    ? "Excellent connective choice!"
                    : `Incorrect. Best: "${story.transitions[`transition_${connIdx + 1}` as ConnectiveKey].answer}"`}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────── GAME 2: CHARACTER CREATOR ────────────────────────

function CharacterCreator({ config, onGameEnd }: Props) {
  const pool = CHARACTERS[config.difficulty];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"trait" | "motivation" | "flaw">("trait");
  const [score, setScore] = useState(0);
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
  const item = pool[idx];

  function handleAnswer(opt: string) {
    if (feedback || !item) return;
    let correct_val = "";
    let label = "";
    if (phase === "trait") {
      correct_val = item.trait;
      label = "Trait";
    } else if (phase === "motivation") {
      correct_val = item.motivation;
      label = "Motivation";
    } else {
      correct_val = item.flaw;
      label = "Flaw";
    }
    const ok = opt === correct_val;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    setFeedback({
      ok,
      msg: ok
        ? `Correct ${label}! ${item.name}'s ${label.toLowerCase()} is indeed: ${correct_val}`
        : `Wrong. ${item.name}'s ${label.toLowerCase()} is: ${correct_val}`,
    });
    setTimeout(() => {
      setFeedback(null);
      if (phase === "trait") setPhase("motivation");
      else if (phase === "motivation") setPhase("flaw");
      else {
        setPhase("trait");
        if (idx + 1 >= pool.length) endGame(true);
        else setIdx((i) => i + 1);
      }
    }, 2000);
  }

  const currentOptions =
    phase === "trait"
      ? item?.traitOptions
      : phase === "motivation"
        ? item?.motivationOptions
        : item?.flawOptions;
  const phaseColors = {
    trait: "#00f5ff",
    motivation: "#f59e0b",
    flaw: "#f43f5e",
  };

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="story_builder.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <FileText className="h-14 w-14 mx-auto mb-4 text-[#00f5ff]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Character Creator
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A character is described in 3-4 sentences. Identify their core
            Trait, Motivation, and Flaw.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Real character analysis — no trick options.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="story_builder.start_button"
          >
            Analyse Characters
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="story_builder.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <span className="font-bold text-[#00f5ff]">
          {score.toLocaleString()}
        </span>
        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full transition-all duration-1000"
            style={{ width: `${timePct}%`, background: phaseColors[phase] }}
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
          <div className="glass-card rounded-2xl p-5 neon-top-border">
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: phaseColors[phase] }}
            >
              {item?.name} — identify the {phase.toUpperCase()}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {item?.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {currentOptions?.map((opt, i) => (
              <button
                key={i}
                type="button"
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left ${feedback ? (opt === (phase === "trait" ? item.trait : phase === "motivation" ? item.motivation : item.flaw) ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground") : "border-border/40 bg-card hover:bg-muted text-foreground"}`}
                data-ocid={`story_builder.char_option.${i + 1}`}
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

// ──────────────────────────── GAME 3: STORY CONTINUER ────────────────────────

function StoryContinuer({ config, onGameEnd }: Props) {
  const pool = BRANCH_STORIES[config.difficulty];
  const [started, setStarted] = useState(false);
  const [storyIdx, setStoryIdx] = useState(0);
  const [choicePhase, setChoicePhase] = useState(0);
  const [scores, setScores] = useState([0, 0, 0]);
  const [chosen, setChosen] = useState<(number | null)[]>([null, null, null]);
  const [totalScore, setTotalScore] = useState(0);
  const [showConsequence, setShowConsequence] = useState<{
    short: string;
    long: string;
    score: number;
  } | null>(null);
  const startTime = useRef(Date.now());
  const gameOver = useRef(false);
  const scoreRef = useRef(totalScore);
  scoreRef.current = totalScore;

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const finalScore = scores.reduce((a, b) => a + b, 0);
      const acc = (finalScore / (3 * 3)) * 100;
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
    [config, scores, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;
  const story = pool[storyIdx];

  function handleChoice(choiceIdx: number) {
    if (showConsequence) return;
    const choice = story.choices[choicePhase as 0 | 1 | 2][choiceIdx];
    const newChosen = [...chosen];
    newChosen[choicePhase] = choiceIdx;
    setChosen(newChosen);
    const newScores = [...scores];
    newScores[choicePhase] = choice.score;
    setScores(newScores);
    const pts = choice.score * 100 * config.difficulty;
    setTotalScore((s) => s + pts);
    setShowConsequence({
      short: choice.shortTerm,
      long: choice.longTerm,
      score: choice.score,
    });
    setTimeout(() => {
      setShowConsequence(null);
      if (choicePhase + 1 >= 3) {
        setTimeout(() => {
          if (storyIdx + 1 >= pool.length) endGame(true);
          else {
            setStoryIdx((i) => i + 1);
            setChoicePhase(0);
            setScores([0, 0, 0]);
            setChosen([null, null, null]);
          }
        }, 2000);
      } else setChoicePhase((p) => p + 1);
    }, 3000);
  }

  const isBestPath = chosen.every(
    (c, i) => c === story.bestPath[i as 0 | 1 | 2],
  );

  if (!started) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="story_builder.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <FileText className="h-14 w-14 mx-auto mb-4 text-[#f43f5e]" />
          <h2
            className="text-3xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Story Continuer
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            A story opening is shown. Make 3 choices that shape the narrative.
            Each choice has short-term and long-term consequences.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Aim for the best possible outcome across all three decisions.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              setStarted(true);
              startTime.current = Date.now();
            }}
            data-ocid="story_builder.start_button"
          >
            Begin Story
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="story_builder.page"
    >
      <div className="game-hud flex items-center justify-between shrink-0">
        <span className="font-bold text-[#00f5ff]">
          {totalScore.toLocaleString()}
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-all ${i < choicePhase ? "bg-[#10b981]" : i === choicePhase ? "bg-[#f59e0b]" : "bg-muted"}`}
            />
          ))}
        </div>
        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[#f43f5e] transition-all duration-1000"
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${storyIdx}-${choicePhase}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 flex flex-col gap-4"
        >
          {choicePhase === 0 && (
            <div className="glass-card rounded-xl p-4 border border-[#f43f5e]/30">
              <p className="text-xs uppercase tracking-widest text-[#f43f5e] mb-2">
                {story.title}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {story.opening}
              </p>
            </div>
          )}
          <p className="text-sm font-bold text-foreground">
            Decision {choicePhase + 1} of 3: What do you do?
          </p>
          <div className="flex flex-col gap-2">
            {story.choices[choicePhase as 0 | 1 | 2].map((choice, i) => (
              <button
                key={i}
                type="button"
                disabled={!!showConsequence}
                onClick={() => handleChoice(i)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${chosen[choicePhase] === i ? (scores[choicePhase] === 3 ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : scores[choicePhase] === 2 ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]") : "border-border/40 bg-card hover:border-[#f43f5e]/40 text-foreground"}`}
                data-ocid={`story_builder.choice.${i + 1}`}
              >
                {choice.text}
              </button>
            ))}
          </div>
          {showConsequence && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border border-[#f59e0b]/30 bg-[#f59e0b]/5"
            >
              <p className="text-xs uppercase tracking-widest text-[#f59e0b] mb-2">
                Consequences
              </p>
              <p className="text-sm text-foreground mb-1">
                <span className="text-[#00f5ff] font-bold">Short-term: </span>
                {showConsequence.short}
              </p>
              <p className="text-sm text-foreground">
                <span className="text-[#7c3aed] font-bold">Long-term: </span>
                {showConsequence.long}
              </p>
            </motion.div>
          )}
          {choicePhase === 2 && chosen[2] !== null && !showConsequence && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl border ${isBestPath ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f59e0b]/40 bg-[#f59e0b]/10"}`}
            >
              <p
                className={`text-sm font-bold mb-1 ${isBestPath ? "text-[#10b981]" : "text-[#f59e0b]"}`}
              >
                {isBestPath ? "Optimal Path!" : "Good effort"}
              </p>
              <p className="text-sm text-foreground">
                {isBestPath ? story.bestOutcome : story.poorOutcome}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────── MAIN EXPORT ────────────────────────

export default function StoryBuilder({ config, onGameEnd }: Props) {
  if (config.gameId === "character-creator")
    return <CharacterCreator config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "story-continuer")
    return <StoryContinuer config={config} onGameEnd={onGameEnd} />;
  return <PlotArchitect config={config} onGameEnd={onGameEnd} />;
}
