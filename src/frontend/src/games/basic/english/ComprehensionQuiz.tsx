import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Question {
  q: string;
  options: string[];
  answer: string;
}
interface Passage {
  title: string;
  text: string;
  questions: Question[];
}

const PASSAGES: Passage[] = [
  {
    title: "The Rainforest",
    text: "The rainforest is home to many animals. Monkeys swing through the trees and colorful birds fill the air. The forest floor is dark because the tall trees block the sunlight. Scientists call this place one of the most biodiverse on Earth.",
    questions: [
      {
        q: "Where do monkeys live in the rainforest?",
        options: [
          "On the forest floor",
          "In the trees",
          "Underground",
          "In caves",
        ],
        answer: "In the trees",
      },
      {
        q: "Why is the forest floor dark?",
        options: [
          "There is no sun",
          "It rains a lot",
          "Trees block sunlight",
          "Animals eat light",
        ],
        answer: "Trees block sunlight",
      },
      {
        q: "What does biodiverse mean?",
        options: [
          "Many kinds of life",
          "Heavy rainfall",
          "Tall trees",
          "Dark floors",
        ],
        answer: "Many kinds of life",
      },
    ],
  },
  {
    title: "The Solar System",
    text: "Our solar system has eight planets orbiting the Sun. Earth is the third planet and the only one known to support life. Jupiter is the largest planet and has a famous storm called the Great Red Spot. Mars is called the Red Planet because of its reddish soil.",
    questions: [
      {
        q: "How many planets orbit the Sun?",
        options: ["Seven", "Eight", "Nine", "Ten"],
        answer: "Eight",
      },
      {
        q: "Which planet is known as the Red Planet?",
        options: ["Jupiter", "Venus", "Mars", "Saturn"],
        answer: "Mars",
      },
      {
        q: "What is the Great Red Spot?",
        options: [
          "A volcano",
          "A storm on Jupiter",
          "A desert on Mars",
          "A moon crater",
        ],
        answer: "A storm on Jupiter",
      },
    ],
  },
  {
    title: "The Water Cycle",
    text: "Water moves in a continuous cycle through the environment. The sun heats water in oceans and lakes, causing it to evaporate into water vapor. The vapor rises, cools, and forms clouds through condensation. When clouds become heavy with water droplets, precipitation falls as rain or snow.",
    questions: [
      {
        q: "What causes water to evaporate?",
        options: ["Wind", "The moon", "The sun", "Clouds"],
        answer: "The sun",
      },
      {
        q: "What is condensation?",
        options: [
          "Water falling as rain",
          "Water turning to vapor",
          "Vapor cooling to form clouds",
          "Snow melting",
        ],
        answer: "Vapor cooling to form clouds",
      },
      {
        q: "What is precipitation?",
        options: [
          "Evaporation of water",
          "Formation of clouds",
          "Rain or snow falling",
          "Water heating up",
        ],
        answer: "Rain or snow falling",
      },
    ],
  },
  {
    title: "Digital Technology",
    text: "Computers process information using binary code, which uses only the digits 0 and 1. The internet connects millions of computers worldwide, allowing people to share information instantly. Smartphones combine the functions of a phone, camera, and computer in one device. Artificial intelligence allows machines to learn from data and make decisions.",
    questions: [
      {
        q: "What does binary code use?",
        options: [
          "Letters A to Z",
          "Numbers 0 to 9",
          "Only digits 0 and 1",
          "Colors and shapes",
        ],
        answer: "Only digits 0 and 1",
      },
      {
        q: "What does the internet allow people to do?",
        options: [
          "Travel faster",
          "Share information instantly",
          "Build computers",
          "Grow plants",
        ],
        answer: "Share information instantly",
      },
      {
        q: "What allows machines to learn from data?",
        options: [
          "Binary code",
          "The internet",
          "Smartphones",
          "Artificial intelligence",
        ],
        answer: "Artificial intelligence",
      },
    ],
  },
  {
    title: "Healthy Living",
    text: "A healthy lifestyle includes eating nutritious food, exercising regularly, and getting enough sleep. Fruits and vegetables provide vitamins and minerals that our bodies need. Exercise strengthens the heart and helps maintain a healthy weight. Doctors recommend children get at least nine hours of sleep each night for proper brain development.",
    questions: [
      {
        q: "What do fruits and vegetables provide?",
        options: [
          "Protein only",
          "Vitamins and minerals",
          "Carbohydrates only",
          "Fat and sugar",
        ],
        answer: "Vitamins and minerals",
      },
      {
        q: "What does exercise strengthen?",
        options: ["Only muscles", "The brain", "The heart", "The lungs only"],
        answer: "The heart",
      },
      {
        q: "How many hours of sleep do doctors recommend for children?",
        options: ["Six hours", "Seven hours", "Eight hours", "Nine hours"],
        answer: "Nine hours",
      },
    ],
  },
];

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function ComprehensionQuiz({ config, onGameEnd }: Props) {
  const { triggerShake, triggerCombo } = useGameFeel();
  const diffMap = {
    1: "easy" as const,
    2: "medium" as const,
    3: "hard" as const,
  };
  const diff = diffMap[config.difficulty as 1 | 2 | 3];
  const totalPassages = diff === "easy" ? 2 : diff === "medium" ? 3 : 5;

  const [phase, setPhase] = useState<"idle" | "reading" | "answering" | "over">(
    "idle",
  );
  const [passageOrder, setPassageOrder] = useState<Passage[]>([]);
  const [pIdx, setPIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(0);
  const [shuffledOpts, setShuffledOpts] = useState<string[]>([]);

  const totalQ = totalPassages * 3;

  const { timeLeft } = useGameTimer(180, () => endGame(score, completed));

  function startGame() {
    const order = shuffleArr(PASSAGES).slice(0, totalPassages);
    setPassageOrder(order);
    setPhase("reading");
    setPIdx(0);
    setQIdx(0);
    setScore(0);
    setLives(3);
    setCompleted(0);
    setSelected(null);
    setFeedback(null);
  }

  function startAnswering() {
    setPhase("answering");
    const q = passageOrder[pIdx].questions[0];
    setShuffledOpts(shuffleArr(q.options));
    setQIdx(0);
    setSelected(null);
    setFeedback(null);
  }

  function endGame(fs: number, fc: number) {
    setPhase("over");
    const accuracy = fc > 0 ? Math.round((fc / totalQ) * 100) : 0;
    onGameEnd(buildResult(config, fs, accuracy, 180 - timeLeft, fc > 0));
  }

  function pickAnswer(opt: string) {
    if (feedback) return;
    setSelected(opt);
    const passage = passageOrder[pIdx];
    const question = passage.questions[qIdx];
    if (opt === question.answer) {
      triggerCombo(score + 10);
      const ns = score + 10;
      const nc = completed + 1;
      setScore(ns);
      setCompleted(nc);
      setFeedback("correct");
      setTimeout(() => {
        const nextQIdx = qIdx + 1;
        if (nextQIdx >= passage.questions.length) {
          const nextPIdx = pIdx + 1;
          if (nextPIdx >= totalPassages) endGame(ns, nc);
          else {
            setPIdx(nextPIdx);
            setPhase("reading");
            setSelected(null);
            setFeedback(null);
          }
        } else {
          setQIdx(nextQIdx);
          setShuffledOpts(shuffleArr(passage.questions[nextQIdx].options));
          setSelected(null);
          setFeedback(null);
        }
      }, 800);
    } else {
      triggerShake();
      const nl = lives - 1;
      setLives(nl);
      setFeedback("wrong");
      setTimeout(() => {
        if (nl <= 0) endGame(score, completed);
        else {
          setSelected(null);
          setFeedback(null);
        }
      }, 900);
    }
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff] tracking-wide">
          Comprehension Quiz
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Read each passage carefully, then answer comprehension questions.
          Understand the text before you answer!
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-sm text-muted-foreground space-y-1">
          <div>
            Passages: {totalPassages} ({totalQ} questions) | Lives: 3 | Timer:
            180s
          </div>
          <div>Correct = +10 points per question</div>
        </div>
        <GlowButton onClick={startGame} data-ocid="comprehension.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-[#00f5ff]">Game Over</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center space-y-2">
          <div className="text-4xl font-bold text-[#10b981]">{score}</div>
          <div className="text-muted-foreground">
            Questions answered: {completed}/{totalQ}
          </div>
        </div>
        <GlowButton
          onClick={startGame}
          data-ocid="comprehension.restart_button"
        >
          Play Again
        </GlowButton>
      </div>
    );
  }

  const passage = passageOrder[pIdx];
  if (!passage) return null;

  if (phase === "reading") {
    return (
      <div className="flex flex-col gap-5 p-4 min-h-[400px]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Passage {pIdx + 1}/{totalPassages}
          </span>
          <span className="text-[#00f5ff] font-bold">Score: {score}</span>
          <span className="text-sm">Time: {timeLeft}s</span>
          <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
        </div>
        <div
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
          data-ocid="comprehension.passage_card"
        >
          <h3 className="text-lg font-bold text-[#f59e0b] mb-4">
            {passage.title}
          </h3>
          <p className="text-foreground leading-relaxed">{passage.text}</p>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Read the passage carefully, then proceed to answer{" "}
          {passage.questions.length} questions.
        </div>
        <div className="flex justify-center">
          <GlowButton
            onClick={startAnswering}
            data-ocid="comprehension.answer_questions_button"
          >
            Answer Questions
          </GlowButton>
        </div>
      </div>
    );
  }

  // answering phase
  const question = passage.questions[qIdx];

  return (
    <div className="flex flex-col gap-5 p-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          P{pIdx + 1} Q{qIdx + 1}/{passage.questions.length}
        </span>
        <span className="text-[#00f5ff] font-bold">Score: {score}</span>
        <span className="text-sm">Time: {timeLeft}s</span>
        <span className="text-[#f43f5e] font-bold">Lives: {lives}</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <p className="text-xs text-muted-foreground mb-1">
          Passage: {passage.title}
        </p>
        <p className="text-foreground font-medium">{question.q}</p>
      </div>

      {feedback === "correct" && (
        <div className="text-center text-[#10b981] font-bold animate-pulse">
          Correct! +10
        </div>
      )}
      {feedback === "wrong" && (
        <div className="text-center text-[#f43f5e] font-bold animate-pulse">
          Wrong! Answer: {question.answer}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3" data-ocid="comprehension.options">
        {shuffledOpts.map((opt, i) => {
          let cls =
            "rounded-xl border p-4 text-left text-sm transition-all cursor-pointer ";
          if (feedback && opt === question.answer)
            cls += "border-[#10b981]/60 bg-[#10b981]/20 text-[#10b981]";
          else if (feedback && opt === selected && opt !== question.answer)
            cls += "border-[#f43f5e]/60 bg-[#f43f5e]/20 text-[#f43f5e]";
          else
            cls +=
              "border-white/10 bg-white/5 hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/10 text-foreground";
          return (
            <button
              type="button"
              key={i}
              className={cls}
              onClick={() => pickAnswer(opt)}
              data-ocid={`comprehension.option.${i + 1}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
