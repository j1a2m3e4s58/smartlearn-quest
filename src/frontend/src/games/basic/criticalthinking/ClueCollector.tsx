import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface ClueCollectorProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface Mystery {
  title: string;
  intro: string;
  clues: string[];
  suspects: string[];
  correct: number;
  explanation: string;
}

const MYSTERIES: Mystery[] = [
  {
    title: "The Stolen Cake",
    intro:
      "A freshly baked cake disappeared from the kitchen counter. Four people were in the house. You must find the culprit.",
    clues: [
      "Muddy footprints lead from the back door to the kitchen.",
      "A trail of sugar grains goes from the counter to the garage.",
      "Cake crumbs were found inside the garage toolbox.",
      "Only two people had access to the kitchen key.",
      "Sam was seen in the garage carrying a heavy bag.",
    ],
    suspects: ["Sam", "Alex", "Taylor", "Jordan"],
    correct: 0,
    explanation:
      "Sam left muddy footprints, the sugar trail led to the garage, crumbs were in the toolbox, and Sam was seen leaving the garage.",
  },
  {
    title: "The Missing Toy",
    intro:
      "A prized toy robot vanished from the classroom shelf. Three students had access during the lunch break.",
    clues: [
      "The toy was last seen at noon during lunch break.",
      "A small red thread was found near the shelf.",
      "Only one student wore a red sweater that day.",
      "The student with the red sweater left class early.",
      "A toy robot was spotted in their bag by another student.",
    ],
    suspects: ["Maya", "Kwame", "Abena", "Kofi"],
    correct: 1,
    explanation:
      "Kwame wore the red sweater, left early, and was seen with the robot in their bag.",
  },
  {
    title: "The Broken Window",
    intro:
      "A classroom window was broken during recess. Four students were playing nearby. Determine who is responsible.",
    clues: [
      "The window was broken from outside the classroom.",
      "A football was found on the classroom floor.",
      "One student was playing football near the window.",
      "That student kicked the ball before the break ended.",
      "Others reported hearing the ball hit the window before the crash.",
    ],
    suspects: ["Esi", "Yaw", "Akua", "Fiifi"],
    correct: 2,
    explanation:
      "Akua was playing football outside, kicked the ball toward the building, and witnesses heard the impact before the glass broke.",
  },
];

export default function ClueCollector({
  config,
  onGameEnd,
}: ClueCollectorProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [mysteryIdx, setMysteryIdx] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [explanation, setExplanation] = useState("");
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(180, () => {
    setPhase("over");
    onGameEnd(buildResult(config, score, (score / 90) * 100, 180, false));
  });

  const mystery = MYSTERIES[mysteryIdx];

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setMysteryIdx(0);
    setRevealedCount(0);
    setAnswered(null);
    setExplanation("");
    resetTimer();
    startTimer();
    setPhase("playing");
  }, [resetTimer, startTimer]);

  const revealClue = useCallback(() => {
    if (revealedCount < mystery.clues.length) {
      setRevealedCount((n) => n + 1);
    }
  }, [revealedCount, mystery.clues.length]);

  const selectSuspect = useCallback(
    (idx: number) => {
      if (answered !== null) return;
      setAnswered(idx);
      if (idx === mystery.correct) {
        triggerParticle(0, 0, "correct");
        triggerMascotReaction("correct");
        const newScore = score + 30;
        setScore(newScore);
        setExplanation(mystery.explanation);
        if (mysteryIdx >= 2) {
          setTimeout(() => {
            setPhase("over");
            onGameEnd(
              buildResult(
                config,
                newScore,
                (newScore / 90) * 100,
                180 - timeLeft,
                true,
              ),
            );
          }, 2000);
        } else {
          setTimeout(() => {
            setMysteryIdx((n) => n + 1);
            setRevealedCount(0);
            setAnswered(null);
            setExplanation("");
          }, 2000);
        }
      } else {
        triggerShake();
        const newLives = lives - 1;
        setLives(newLives);
        setExplanation(`Wrong! ${mystery.explanation}`);
        if (newLives <= 0) {
          setTimeout(() => {
            setPhase("over");
            onGameEnd(
              buildResult(
                config,
                score,
                (score / 90) * 100,
                180 - timeLeft,
                false,
              ),
            );
          }, 2000);
        } else {
          setTimeout(() => {
            setMysteryIdx((n) => n + 1);
            setRevealedCount(0);
            setAnswered(null);
            setExplanation("");
          }, 2000);
        }
      }
    },
    [
      answered,
      mystery,
      score,
      mysteryIdx,
      lives,
      triggerParticle,
      triggerMascotReaction,
      triggerShake,
      config,
      timeLeft,
      onGameEnd,
    ],
  );

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Clue Collector</h2>
        <p className="text-white/70 text-center max-w-md">
          Reveal clues one by one, then identify the correct suspect. 3
          mysteries. Use logic, not guessing.
        </p>
        <GlowButton onClick={startGame} data-ocid="clue.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">
          Investigation Complete
        </h2>
        <p className="text-white/70">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="clue.restart_button">
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
        <div className="flex gap-6 text-sm text-white/70">
          <span>
            Mystery:{" "}
            <strong className="text-cyan-300">{mysteryIdx + 1}/3</strong>
          </span>
          <span>
            Score: <strong className="text-cyan-300">{score}</strong>
          </span>
          <span>
            Lives: <strong className="text-rose-400">{lives}</strong>
          </span>
          <span>
            Time: <strong className="text-cyan-300">{timeLeft}s</strong>
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <h3 className="text-lg font-bold text-cyan-300 mb-2">
            {mystery.title}
          </h3>
          <p className="text-white/70 text-sm mb-4">{mystery.intro}</p>
          <div className="space-y-2 mb-4" data-ocid="clue.clues_list">
            {mystery.clues.slice(0, revealedCount).map((clue, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-white/80 text-sm"
                data-ocid={`clue.clue.${i}`}
              >
                {i + 1}. {clue}
              </div>
            ))}
          </div>
          {revealedCount < mystery.clues.length && answered === null && (
            <GlowButton onClick={revealClue} data-ocid="clue.reveal_button">
              Reveal Clue ({revealedCount}/{mystery.clues.length})
            </GlowButton>
          )}
        </div>
        {revealedCount >= 3 && answered === null && (
          <div>
            <p className="text-white/70 text-sm mb-3">Who is the culprit?</p>
            <div className="grid grid-cols-2 gap-2" data-ocid="clue.suspects">
              {mystery.suspects.map((suspect, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => selectSuspect(i)}
                  data-ocid={`clue.suspect.${i}`}
                  className="p-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400 text-white font-medium transition-all"
                >
                  {suspect}
                </button>
              ))}
            </div>
          </div>
        )}
        {answered !== null && (
          <div
            className={`p-3 rounded-xl text-sm ${
              answered === mystery.correct
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
            }`}
          >
            {answered === mystery.correct ? "Correct! " : ""}
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
}
