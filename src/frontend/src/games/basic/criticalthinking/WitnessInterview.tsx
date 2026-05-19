import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface WitnessInterviewProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface Question {
  text: string;
  isKeyFact: boolean;
  response: string;
}

interface Scenario {
  title: string;
  witnessName: string;
  context: string;
  questions: Question[];
}

const SCENARIOS: Scenario[] = [
  {
    title: "Classroom Incident",
    witnessName: "Ms. Owusu",
    context:
      "A student reported their pencil case missing after lunch. You are interviewing the class teacher.",
    questions: [
      {
        text: "Who was the last person near the desk?",
        isKeyFact: true,
        response: "I saw Kofi near that desk just before lunch ended.",
      },
      {
        text: "What is your favorite subject?",
        isKeyFact: false,
        response: "I enjoy teaching mathematics.",
      },
      {
        text: "Was anything unusual during lunch?",
        isKeyFact: true,
        response:
          "The door to the storeroom was found open — it is usually locked.",
      },
      {
        text: "How long have you taught here?",
        isKeyFact: false,
        response: "About six years now.",
      },
      {
        text: "Were there any visitors today?",
        isKeyFact: true,
        response:
          "Yes, a parent visited and waited near the classroom briefly.",
      },
      {
        text: "Do you like the school canteen food?",
        isKeyFact: false,
        response: "It is decent, nothing special.",
      },
      {
        text: "What did students do after lunch?",
        isKeyFact: false,
        response: "They returned to their seats for afternoon lessons.",
      },
      {
        text: "Was the pencil case expensive?",
        isKeyFact: false,
        response: "The student said it had a sentimental value.",
      },
    ],
  },
  {
    title: "Library Book Disappearance",
    witnessName: "Mr. Asante",
    context:
      "A rare reference book went missing from the library. The librarian is your witness.",
    questions: [
      {
        text: "Who accessed the rare books section today?",
        isKeyFact: true,
        response:
          "Only two students signed the log — Ama and a senior student.",
      },
      {
        text: "Do you enjoy being a librarian?",
        isKeyFact: false,
        response: "Very much — I love books.",
      },
      {
        text: "Was the CCTV working?",
        isKeyFact: true,
        response: "No, the camera in that section has been broken for a week.",
      },
      {
        text: "What time does the library close?",
        isKeyFact: false,
        response: "We close at 5 PM on weekdays.",
      },
      {
        text: "Did anyone seem nervous or rushed?",
        isKeyFact: true,
        response: "Yes, one of the seniors left quickly without signing out.",
      },
      {
        text: "How many books do you have?",
        isKeyFact: false,
        response: "Over four thousand catalogued items.",
      },
      {
        text: "Is the library air-conditioned?",
        isKeyFact: false,
        response: "Only in the reference section.",
      },
      {
        text: "What subjects are most popular?",
        isKeyFact: false,
        response: "Science and history are very popular.",
      },
    ],
  },
  {
    title: "School Gate Vandalism",
    witnessName: "Security Officer Mensah",
    context:
      "The school gate was found spray-painted with graffiti. You are interviewing the night security officer.",
    questions: [
      {
        text: "Did you hear any unusual sounds last night?",
        isKeyFact: true,
        response:
          "I heard what sounded like a spray can rattling around midnight.",
      },
      {
        text: "What do you do during patrols?",
        isKeyFact: false,
        response: "I walk the perimeter every hour.",
      },
      {
        text: "Did you see anyone near the gate?",
        isKeyFact: true,
        response: "I saw two figures in dark clothing near the side entrance.",
      },
      {
        text: "How many years have you worked here?",
        isKeyFact: false,
        response: "Twelve years of service.",
      },
      {
        text: "Was the side gate locked?",
        isKeyFact: true,
        response:
          "It was unlocked — the lock appeared to have been tampered with.",
      },
      {
        text: "Do you have children?",
        isKeyFact: false,
        response: "Yes, three children.",
      },
      {
        text: "What time do you start your shift?",
        isKeyFact: false,
        response: "At 6 PM until 6 AM.",
      },
      {
        text: "Do you know who owns the school?",
        isKeyFact: false,
        response: "The Ghana Education Service oversees us.",
      },
    ],
  },
];

export default function WitnessInterview({
  config,
  onGameEnd,
}: WitnessInterviewProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const [responses, setResponses] = useState<
    { idx: number; isKeyFact: boolean }[]
  >([]);
  const [questionsLeft, setQuestionsLeft] = useState(6);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [scenarioDone, setScenarioDone] = useState(false);
  const _gameFeel = useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, () => {
    setPhase("over");
    onGameEnd(buildResult(config, score, (score / 90) * 100, 120, false));
  });

  const scenario = SCENARIOS[scenarioIdx];

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setScenarioIdx(0);
    setAsked(new Set());
    setResponses([]);
    setQuestionsLeft(6);
    setScenarioDone(false);
    resetTimer();
    startTimer();
    setPhase("playing");
  }, [resetTimer, startTimer]);

  const askQuestion = useCallback(
    (idx: number) => {
      if (asked.has(idx) || questionsLeft <= 0 || scenarioDone) return;
      const q = scenario.questions[idx];
      const newAsked = new Set(asked);
      newAsked.add(idx);
      setAsked(newAsked);
      const newResponses = [...responses, { idx, isKeyFact: q.isKeyFact }];
      setResponses(newResponses);
      const newLeft = questionsLeft - 1;
      setQuestionsLeft(newLeft);
      const keyFactsFound = newResponses.filter((r) => r.isKeyFact).length;
      const roundScore = keyFactsFound * 10;
      if (newLeft === 0 || keyFactsFound === 3) {
        setScenarioDone(true);
        const newScore = score + roundScore;
        setScore(newScore);
        if (scenarioIdx >= 2) {
          setTimeout(() => {
            setPhase("over");
            onGameEnd(
              buildResult(
                config,
                newScore,
                (newScore / 90) * 100,
                120 - timeLeft,
                true,
              ),
            );
          }, 1500);
        }
      }
    },
    [
      asked,
      questionsLeft,
      scenarioDone,
      scenario,
      responses,
      score,
      scenarioIdx,
      config,
      timeLeft,
      onGameEnd,
    ],
  );

  const nextScenario = useCallback(() => {
    if (scenarioIdx < 2) {
      setScenarioIdx((n) => n + 1);
      setAsked(new Set());
      setResponses([]);
      setQuestionsLeft(6);
      setScenarioDone(false);
    }
  }, [scenarioIdx]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Witness Interview</h2>
        <p className="text-white/70 text-center max-w-md">
          Ask the witness 6 questions. 3 questions reveal key facts. Find all 3
          key facts for maximum score. Use your limited questions wisely.
        </p>
        <GlowButton onClick={startGame} data-ocid="witness.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">
          Interviews Complete
        </h2>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="witness.restart_button">
          Play Again
        </GlowButton>
      </div>
    );
  }

  const keyFactsFound = responses.filter((r) => r.isKeyFact).length;

  return (
    <div>
      <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Case: <strong className="text-cyan-300">{scenarioIdx + 1}/3</strong>
          </span>
          <span>
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Questions left:{" "}
            <strong className="text-yellow-400">{questionsLeft}</strong>
          </span>
          <span>
            Key facts:{" "}
            <strong className="text-emerald-400">{keyFactsFound}/3</strong>
          </span>
          <span>
            Time: <strong className="text-cyan-300">{timeLeft}s</strong>
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <h3 className="text-lg font-bold text-cyan-300 mb-1">
            {scenario.title}
          </h3>
          <p className="text-white/60 text-sm mb-3">{scenario.context}</p>
          {/* Witness silhouette */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
              <div
                className="w-20 h-12 bg-white/10 border-2 border-white/20 rounded-t-full mx-auto"
                style={{ marginTop: "-2px" }}
              />
              <p className="text-center text-white/70 text-xs mt-1">
                {scenario.witnessName}
              </p>
            </div>
          </div>
          {/* Response feed */}
          {responses.length > 0 && (
            <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
              {responses.map((r, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-xs ${
                    r.isKeyFact
                      ? "bg-yellow-400/20 border border-yellow-400/40 text-yellow-200"
                      : "bg-white/5 border border-white/10 text-white/60"
                  }`}
                  data-ocid={`witness.response.${i}`}
                >
                  {r.isKeyFact && "[KEY FACT] "}
                  {scenario.questions[r.idx].response}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Questions */}
        {!scenarioDone && (
          <div className="grid grid-cols-1 gap-2" data-ocid="witness.questions">
            {scenario.questions.map((q, i) => (
              <button
                type="button"
                key={i}
                onClick={() => askQuestion(i)}
                disabled={asked.has(i) || questionsLeft <= 0}
                data-ocid={`witness.question.${i}`}
                className={`p-3 rounded-xl border text-left text-sm transition-all ${
                  asked.has(i)
                    ? "border-white/5 bg-white/5 text-white/30 cursor-not-allowed"
                    : "border-white/20 bg-white/5 hover:border-cyan-400 hover:bg-cyan-500/10 text-white/80 cursor-pointer"
                }`}
              >
                {q.text}
              </button>
            ))}
          </div>
        )}
        {scenarioDone && scenarioIdx < 2 && (
          <div className="text-center">
            <p className="text-white/70 text-sm mb-3">
              Found {keyFactsFound}/3 key facts in this interview.
            </p>
            <GlowButton onClick={nextScenario} data-ocid="witness.next_button">
              Next Witness
            </GlowButton>
          </div>
        )}
      </div>
    </div>
  );
}
