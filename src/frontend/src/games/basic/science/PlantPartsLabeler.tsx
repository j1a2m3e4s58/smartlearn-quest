import { useGameFeel } from "@/components/GameFeel";
import { GlowButton } from "@/components/ui/GlowButton";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const PARTS: Record<number, string> = {
  1: "Root",
  2: "Stem",
  3: "Leaf",
  4: "Flower",
  5: "Seed",
  6: "Fruit",
};

const REGION_STYLES: Record<
  number,
  { top: string; left: string; width: string; height: string; bg: string }
> = {
  6: {
    top: "2%",
    left: "30%",
    width: "40%",
    height: "14%",
    bg: "bg-amber-500/30 border-amber-500/60",
  },
  4: {
    top: "18%",
    left: "20%",
    width: "60%",
    height: "13%",
    bg: "bg-pink-500/30 border-pink-500/60",
  },
  3: {
    top: "33%",
    left: "5%",
    width: "90%",
    height: "14%",
    bg: "bg-emerald-500/30 border-emerald-500/60",
  },
  5: {
    top: "49%",
    left: "25%",
    width: "50%",
    height: "13%",
    bg: "bg-orange-500/30 border-orange-500/60",
  },
  2: {
    top: "64%",
    left: "40%",
    width: "20%",
    height: "20%",
    bg: "bg-cyan-500/30 border-cyan-500/60",
  },
  1: {
    top: "86%",
    left: "15%",
    width: "70%",
    height: "12%",
    bg: "bg-rose-500/30 border-rose-500/60",
  },
};

function shuffleLabels(round: number) {
  const arr = [1, 2, 3, 4, 5, 6];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.abs(Math.sin(round * 7 + i)) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PlantPartsLabeler({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const [assigned, setAssigned] = useState<Record<number, number>>({});
  const [flash, setFlash] = useState<Record<number, "correct" | "wrong">>({});
  const [labelOrder, setLabelOrder] = useState<number[]>(shuffleLabels(1));
  const [correctTotal, setCorrectTotal] = useState(0);
  const startTimeRef = { current: Date.now() };
  const { triggerShake, triggerCombo } = useGameFeel();

  const endGame = useCallback(
    (finalScore: number, correct: number, lv: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          finalScore,
          correct / 18,
          (Date.now() - startTimeRef.current) / 1000,
          lv > 0,
        ),
      );
    },
    [config, onGameEnd],
  );

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(120, () => {
    endGame(score, correctTotal, lives);
  });

  const startGame = () => {
    setPhase("playing");
    setRound(1);
    setScore(0);
    setLives(3);
    setSelected(null);
    setAssigned({});
    setFlash({});
    setLabelOrder(shuffleLabels(1));
    setCorrectTotal(0);
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const handleLabelClick = (partId: number) => {
    if (assigned[partId] !== undefined) return;
    setSelected(partId);
  };

  const handleRegionClick = (regionId: number) => {
    if (selected === null) return;
    const isCorrect = selected === regionId;
    setFlash((f) => ({ ...f, [regionId]: isCorrect ? "correct" : "wrong" }));
    if (isCorrect) {
      const ns = score + 15;
      const nc = correctTotal + 1;
      setScore(ns);
      setCorrectTotal(nc);
      setAssigned((a) => ({ ...a, [regionId]: selected }));
      triggerCombo(1);
      const newAssigned = { ...assigned, [regionId]: selected };
      if (Object.keys(newAssigned).length === 6) {
        if (round >= 3) {
          setTimeout(() => endGame(ns, nc, lives), 1000);
        } else {
          setTimeout(() => {
            setRound((r) => r + 1);
            setAssigned({});
            setFlash({});
            setSelected(null);
            setLabelOrder(shuffleLabels(round + 1));
          }, 1000);
        }
      }
    } else {
      const nl = lives - 1;
      setLives(nl);
      triggerShake();
      if (nl <= 0) setTimeout(() => endGame(score, correctTotal, 0), 800);
    }
    setTimeout(() => {
      setFlash((f) => {
        const nf = { ...f };
        delete nf[regionId];
        return nf;
      });
    }, 600);
    setSelected(null);
  };

  const assignedPartIds = new Set(Object.values(assigned));

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">
          Plant Parts Labeler
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Click a label, then click the matching plant region. Label all 6 parts
          correctly across 3 rounds.
        </p>
        <GlowButton data-ocid="plant.start_button" onClick={startGame}>
          Start Game
        </GlowButton>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">Game Over</h2>
        <p className="text-2xl text-cyan-400">Score: {score}</p>
        <GlowButton data-ocid="plant.restart_button" onClick={startGame}>
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-rose-500" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div className="text-cyan-400 font-mono text-lg">{timeLeft}s</div>
        <div className="text-foreground font-bold">
          Round {round}/3 | Score: {score}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="relative w-48 h-72 flex-shrink-0">
          {Object.entries(REGION_STYLES).map(([id, style]) => {
            const rid = Number(id);
            const assignedLabel =
              assigned[rid] !== undefined ? PARTS[assigned[rid]] : null;
            return (
              <button
                key={rid}
                type="button"
                data-ocid={`plant.region.${rid}`}
                onClick={() => handleRegionClick(rid)}
                className={`absolute border-2 rounded-lg text-xs font-bold text-white transition-all cursor-pointer ${
                  style.bg
                } ${
                  flash[rid] === "correct"
                    ? "ring-2 ring-emerald-400 bg-emerald-400/30"
                    : flash[rid] === "wrong"
                      ? "ring-2 ring-rose-400 bg-rose-400/30"
                      : ""
                } ${
                  selected !== null ? "hover:ring-2 hover:ring-white/40" : ""
                }`}
                style={{
                  top: style.top,
                  left: style.left,
                  width: style.width,
                  height: style.height,
                }}
              >
                {assignedLabel || `Region ${rid}`}
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-3">
            Select a label, then click the matching region:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {labelOrder.map((partId) => (
              <button
                key={partId}
                type="button"
                data-ocid={`plant.label.${partId}`}
                onClick={() => handleLabelClick(partId)}
                disabled={assignedPartIds.has(partId)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                  assignedPartIds.has(partId)
                    ? "opacity-30 cursor-not-allowed border-white/10 bg-white/5"
                    : selected === partId
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 ring-2 ring-cyan-400/50 scale-105"
                      : "border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15 text-foreground"
                }`}
              >
                {PARTS[partId]}
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-4 text-cyan-400 text-sm">
              Selected: <span className="font-bold">{PARTS[selected]}</span> —
              now click a region
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
