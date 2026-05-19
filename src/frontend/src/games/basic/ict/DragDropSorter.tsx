import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

type Category = "Hardware" | "Software" | "Input" | "Output";
const ITEMS: { label: string; category: Category }[] = [
  { label: "Keyboard", category: "Input" },
  { label: "Monitor", category: "Output" },
  { label: "CPU", category: "Hardware" },
  { label: "Windows OS", category: "Software" },
  { label: "Mouse", category: "Input" },
  { label: "Printer", category: "Output" },
  { label: "RAM", category: "Hardware" },
  { label: "Microsoft Word", category: "Software" },
  { label: "Scanner", category: "Input" },
  { label: "Speakers", category: "Output" },
  { label: "Hard Disk", category: "Hardware" },
  { label: "Chrome Browser", category: "Software" },
];
const CATEGORIES: Category[] = ["Hardware", "Software", "Input", "Output"];
const CAT_COLORS: Record<Category, string> = {
  Hardware: "#00f5ff",
  Software: "#f59e0b",
  Input: "#10b981",
  Output: "#f43f5e",
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function DragDropSorter({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<typeof ITEMS>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ cat: Category; ok: boolean } | null>(
    null,
  );
  const count = config.difficulty === 3 ? 12 : config.difficulty === 2 ? 8 : 6;

  const startGame = () => {
    setItems(shuffle(ITEMS).slice(0, count));
    setScore(0);
    setLives(3);
    setPhase("play");
  };

  const handleDrop = useCallback(
    (cat: Category) => {
      if (!dragging) return;
      const item = items.find((i) => i.label === dragging);
      if (!item) return;
      const correct = item.category === cat;
      if (correct) {
        setScore((s) => s + 10);
        setItems((prev) => prev.filter((i) => i.label !== dragging));
        const remaining = items.filter((i) => i.label !== dragging);
        if (remaining.length === 0) {
          setPhase("over");
          onGameEnd(buildResult(config, score + 10, 100, 0, true));
        }
      } else {
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) {
            setPhase("over");
            onGameEnd(
              buildResult(
                config,
                score,
                score > 0 ? Math.min(100, (score / 120) * 100) : 0,
                0,
                false,
              ),
            );
          }
          return nl;
        });
      }
      setFlash({ cat, ok: correct });
      setTimeout(() => setFlash(null), 500);
      setDragging(null);
    },
    [dragging, items, score, lives, onGameEnd, config],
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Drag & Drop Sorter
            </h2>
            <p className="text-slate-300 mb-2">
              Drag each item to its correct category bin.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Correct = +10 points. Wrong bin = lose 1 life.
            </p>
            <GlowButton onClick={startGame} data-ocid="dnd-sorter.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
            <span className="text-slate-400">{items.length} left</span>
          </div>
          <div className="flex flex-wrap gap-3 p-4 justify-center">
            {items.map((item, idx) => (
              <div
                key={item.label}
                data-ocid={`dnd-sorter.item.${idx + 1}`}
                draggable
                onDragStart={() => setDragging(item.label)}
                onDragEnd={() => setDragging(null)}
                className="px-4 py-2 rounded-xl border border-white/20 bg-white/10 text-white cursor-grab active:cursor-grabbing select-none hover:bg-white/20 transition-all"
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex gap-3 p-4 mt-auto justify-center flex-wrap">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                data-ocid={`dnd-sorter.bin.${cat.toLowerCase()}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(cat)}
                className="flex-1 min-w-32 h-24 rounded-xl border-2 flex items-center justify-center transition-all text-sm font-bold"
                style={{
                  borderColor:
                    flash?.cat === cat
                      ? flash.ok
                        ? "#10b981"
                        : "#f43f5e"
                      : `${CAT_COLORS[cat]}66`,
                  background:
                    flash?.cat === cat
                      ? flash.ok
                        ? "#10b98122"
                        : "#f43f5e22"
                      : `${CAT_COLORS[cat]}11`,
                  color: CAT_COLORS[cat],
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Game Over
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton
              onClick={startGame}
              data-ocid="dnd-sorter.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
