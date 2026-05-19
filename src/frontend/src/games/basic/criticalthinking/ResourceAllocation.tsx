import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface ResourceAllocationProps {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface Item {
  id: number;
  name: string;
  cost: number;
  benefit: number;
}

const CHALLENGES: { items: Item[] }[] = [
  {
    items: [
      { id: 0, name: "Textbooks", cost: 30, benefit: 40 },
      { id: 1, name: "Lab Equipment", cost: 50, benefit: 70 },
      { id: 2, name: "Computer Software", cost: 25, benefit: 35 },
      { id: 3, name: "Sports Gear", cost: 20, benefit: 20 },
      { id: 4, name: "Music Instruments", cost: 40, benefit: 50 },
    ],
  },
  {
    items: [
      { id: 0, name: "Solar Panels", cost: 60, benefit: 90 },
      { id: 1, name: "Water Filter", cost: 35, benefit: 55 },
      { id: 2, name: "Seeds", cost: 15, benefit: 25 },
      { id: 3, name: "Fertilizer", cost: 20, benefit: 30 },
      { id: 4, name: "Tools", cost: 45, benefit: 60 },
    ],
  },
  {
    items: [
      { id: 0, name: "First Aid Kit", cost: 20, benefit: 45 },
      { id: 1, name: "Generator", cost: 70, benefit: 80 },
      { id: 2, name: "Radio", cost: 15, benefit: 30 },
      { id: 3, name: "Food Supplies", cost: 40, benefit: 50 },
      { id: 4, name: "Shelter Materials", cost: 55, benefit: 65 },
    ],
  },
  {
    items: [
      { id: 0, name: "Server Hardware", cost: 65, benefit: 85 },
      { id: 1, name: "Network Cables", cost: 10, benefit: 20 },
      { id: 2, name: "Security System", cost: 45, benefit: 70 },
      { id: 3, name: "Backup Drives", cost: 25, benefit: 40 },
      { id: 4, name: "Cloud Service", cost: 30, benefit: 35 },
    ],
  },
  {
    items: [
      { id: 0, name: "Art Supplies", cost: 20, benefit: 30 },
      { id: 1, name: "Projector", cost: 55, benefit: 75 },
      { id: 2, name: "Books", cost: 25, benefit: 40 },
      { id: 3, name: "Tablets", cost: 60, benefit: 80 },
      { id: 4, name: "Microscopes", cost: 35, benefit: 55 },
    ],
  },
];

function getOptimalScore(items: Item[]): number {
  const n = items.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let cost = 0;
    let benefit = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        cost += items[i].cost;
        benefit += items[i].benefit;
      }
    }
    if (cost <= 100) best = Math.max(best, benefit);
  }
  return best;
}

export default function ResourceAllocation({
  config,
  onGameEnd,
}: ResourceAllocationProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState("");
  const { triggerShake, triggerParticle, triggerMascotReaction } =
    useGameFeel();
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, () => {
    setPhase("over");
    onGameEnd(buildResult(config, score, (score / 300) * 100, 120, false));
  });

  const challenge = CHALLENGES[challengeIdx];
  const totalCost = challenge.items
    .filter((i) => checked.has(i.id))
    .reduce((s, i) => s + i.cost, 0);
  const totalBenefit = challenge.items
    .filter((i) => checked.has(i.id))
    .reduce((s, i) => s + i.benefit, 0);
  const optimal = getOptimalScore(challenge.items);
  const overBudget = totalCost > 100;

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setChallengeIdx(0);
    setChecked(new Set());
    setFeedback("");
    resetTimer();
    startTimer();
    setPhase("playing");
  }, [resetTimer, startTimer]);

  const toggleItem = useCallback((id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const submitAllocation = useCallback(() => {
    if (overBudget) {
      triggerShake();
      setFeedback("Over budget! Total cost must be 100 or less.");
      return;
    }
    const gained = Math.round((totalBenefit / optimal) * 100);
    if (gained >= 80) {
      triggerParticle(0, 0, "correct");
      triggerMascotReaction("correct");
      setFeedback(
        `Excellent! ${totalBenefit}/${optimal} benefit. +${gained} points`,
      );
    } else {
      triggerShake();
      setFeedback(
        `Suboptimal. ${totalBenefit}/${optimal} benefit. +${gained} points. Optimal was ${optimal}.`,
      );
    }
    const newScore = score + gained;
    setScore(newScore);
    if (challengeIdx >= 4) {
      setTimeout(() => {
        setPhase("over");
        onGameEnd(
          buildResult(
            config,
            newScore,
            (newScore / 500) * 100,
            120 - timeLeft,
            true,
          ),
        );
      }, 1500);
    } else {
      setTimeout(() => {
        setChallengeIdx((n) => n + 1);
        setChecked(new Set());
        setFeedback("");
      }, 1500);
    }
  }, [
    overBudget,
    totalBenefit,
    optimal,
    triggerParticle,
    triggerMascotReaction,
    triggerShake,
    score,
    challengeIdx,
    config,
    timeLeft,
    onGameEnd,
  ]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">
          Resource Allocation
        </h2>
        <p className="text-white/70 text-center max-w-md">
          You have 100 coins. Select items to maximize total benefit without
          exceeding your budget. 5 challenges.
        </p>
        <GlowButton onClick={startGame} data-ocid="resource.start_button">
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold text-cyan-400">Complete</h2>
        <p className="text-white/70">
          Total Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
        <GlowButton onClick={startGame} data-ocid="resource.restart_button">
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
            Challenge:{" "}
            <strong className="text-cyan-300">{challengeIdx + 1}/5</strong>
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
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/70 text-sm">Budget: 100 coins</span>
            <span
              className={`font-bold text-sm ${overBudget ? "text-rose-400" : "text-emerald-400"}`}
            >
              Spent: {totalCost} / Benefit: {totalBenefit}
            </span>
          </div>
          <div className="space-y-2" data-ocid="resource.items">
            {challenge.items.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
                data-ocid={`resource.item.${item.id}`}
              >
                <input
                  type="checkbox"
                  checked={checked.has(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span className="flex-1 text-white/90">{item.name}</span>
                <span className="text-yellow-400 text-sm">
                  {item.cost} coins
                </span>
                <span className="text-emerald-400 text-sm">
                  {item.benefit} pts
                </span>
              </label>
            ))}
          </div>
          {feedback && (
            <p className="mt-3 text-sm text-yellow-400">{feedback}</p>
          )}
        </div>
        <GlowButton
          onClick={submitAllocation}
          disabled={overBudget}
          data-ocid="resource.submit_button"
        >
          Submit Allocation
        </GlowButton>
      </div>
    </div>
  );
}
