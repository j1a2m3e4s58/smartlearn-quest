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

const MOLECULES = [
  { name: "Water", formula: ["H", "H", "O"] },
  { name: "Carbon Dioxide", formula: ["C", "O", "O"] },
  { name: "Oxygen", formula: ["O", "O"] },
  { name: "Methane", formula: ["C", "H", "H", "H", "H"] },
  { name: "Ammonia", formula: ["N", "H", "H", "H"] },
  { name: "Salt (NaCl)", formula: ["Na", "Cl"] },
  { name: "Hydrogen Peroxide", formula: ["H", "H", "O", "O"] },
  { name: "Carbon Monoxide", formula: ["C", "O"] },
];

const ATOM_COLORS: Record<string, string> = {
  H: "bg-cyan-500/80 border-cyan-400",
  C: "bg-stone-600/80 border-stone-400",
  N: "bg-blue-500/80 border-blue-400",
  O: "bg-rose-500/80 border-rose-400",
  Na: "bg-yellow-500/80 border-yellow-400",
  Cl: "bg-lime-500/80 border-lime-400",
};

const PALETTE = ["H", "C", "N", "O", "Na", "Cl"];

export default function MoleculeBuilder({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [mIndex, setMIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = { current: Date.now() };
  const { triggerShake, triggerCombo, triggerMascotReaction } = useGameFeel();

  const endGame = useCallback(
    (finalScore: number, correct: number, lv: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          finalScore,
          correct / MOLECULES.length,
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
  } = useGameTimer(60, () => {
    const nl = lives - 1;
    setLives(nl);
    if (nl <= 0) endGame(score, correctCount, 0);
    else {
      if (mIndex + 1 >= MOLECULES.length) endGame(score, correctCount, nl);
      else {
        setMIndex((m) => m + 1);
        setSelected([]);
        resetTimer();
        startTimer();
      }
    }
  });

  const startGame = () => {
    setPhase("playing");
    setMIndex(0);
    setSelected([]);
    setScore(0);
    setLives(3);
    setFlash(null);
    setCorrectCount(0);
    startTimeRef.current = Date.now();
    resetTimer();
    startTimer();
  };

  const addAtom = (atom: string) => {
    if (flash) return;
    const molecule = MOLECULES[mIndex];
    const next = [...selected, atom];
    setSelected(next);

    if (next.length === molecule.formula.length) {
      const correct = molecule.formula.every((a, i) => a === next[i]);
      if (correct) {
        setFlash("correct");
        const ns = score + 20;
        const nc = correctCount + 1;
        setScore(ns);
        setCorrectCount(nc);
        triggerCombo(1);
        triggerMascotReaction("correct");
        setTimeout(() => {
          setFlash(null);
          if (mIndex + 1 >= MOLECULES.length) endGame(ns, nc, lives);
          else {
            setMIndex((m) => m + 1);
            setSelected([]);
            resetTimer();
            startTimer();
          }
        }, 1000);
      } else {
        setFlash("wrong");
        triggerShake();
        const nl = lives - 1;
        setLives(nl);
        setTimeout(() => {
          setFlash(null);
          setSelected([]);
          if (nl <= 0) endGame(score, correctCount, 0);
        }, 800);
      }
    } else if (next.length > molecule.formula.length) {
      setFlash("wrong");
      triggerShake();
      setTimeout(() => {
        setFlash(null);
        setSelected([]);
      }, 600);
    }
  };

  const clearSelection = () => setSelected([]);

  const molecule = MOLECULES[mIndex];

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-3xl font-bold text-foreground">Molecule Builder</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Build molecules by clicking atoms in the correct order. Match the
          formula for each compound.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {MOLECULES.map((m) => (
            <span
              key={m.name}
              className="text-xs text-muted-foreground border border-white/10 rounded px-2 py-1"
            >
              {m.name}: {m.formula.join("-")}
            </span>
          ))}
        </div>
        <GlowButton data-ocid="molecule.start_button" onClick={startGame}>
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
        <p className="text-muted-foreground">
          Molecules built: {correctCount} / {MOLECULES.length}
        </p>
        <GlowButton data-ocid="molecule.restart_button" onClick={startGame}>
          Play Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
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
          {mIndex + 1}/{MOLECULES.length} | Score: {score}
        </div>
      </div>

      <div
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-center transition-all ${
          flash === "correct"
            ? "ring-2 ring-emerald-400 bg-emerald-400/10"
            : flash === "wrong"
              ? "ring-2 ring-rose-400 bg-rose-400/10"
              : ""
        }`}
      >
        <div className="text-muted-foreground text-sm mb-2">
          Build this molecule:
        </div>
        <div className="text-2xl font-bold text-foreground mb-1">
          {molecule.name}
        </div>
        <div className="text-sm text-muted-foreground">
          Formula: {molecule.formula.join(" — ")}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 min-h-[64px] flex items-center gap-2 flex-wrap">
        {selected.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            Click atoms below to build the molecule...
          </span>
        ) : (
          selected.map((atom, i) => (
            <span
              key={i}
              className={`rounded-lg border px-3 py-2 text-sm font-bold text-white ${ATOM_COLORS[atom] || "bg-white/20 border-white/40"}`}
            >
              {atom}
            </span>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {PALETTE.map((atom) => (
          <button
            key={atom}
            type="button"
            data-ocid={`molecule.atom.${atom.toLowerCase()}`}
            onClick={() => addAtom(atom)}
            disabled={!!flash}
            className={`rounded-xl border px-5 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${ATOM_COLORS[atom] || "bg-white/20 border-white/40"}`}
          >
            {atom}
          </button>
        ))}
      </div>

      <button
        type="button"
        data-ocid="molecule.clear_button"
        onClick={clearSelection}
        className="text-xs text-muted-foreground underline mx-auto"
      >
        Clear selection
      </button>
    </div>
  );
}
