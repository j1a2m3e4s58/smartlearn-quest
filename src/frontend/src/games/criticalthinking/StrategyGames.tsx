import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

// ─────────────────────────────────────────────
// GAME 1 — Tactical Conquest (unchanged)
// ─────────────────────────────────────────────
type Team = "player" | "ai" | null;
type UnitType = "warrior" | "archer" | "knight";

interface Unit {
  id: string;
  team: "player" | "ai";
  type: UnitType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  row: number;
  col: number;
  moved: boolean;
}
interface Cell {
  row: number;
  col: number;
  owner: Team;
  isObjective: boolean;
}

const UNIT_STATS: Record<
  UnitType,
  { hp: number; attack: number; defense: number; symbol: string }
> = {
  warrior: { hp: 30, attack: 10, defense: 4, symbol: "W" },
  archer: { hp: 20, attack: 14, defense: 2, symbol: "A" },
  knight: { hp: 40, attack: 8, defense: 8, symbol: "K" },
};

const GRID = 6;
const OBJECTIVES = [
  { row: 0, col: 2 },
  { row: 0, col: 3 },
  { row: 5, col: 2 },
  { row: 5, col: 3 },
];

function makeUnits(): Unit[] {
  const types: UnitType[] = ["warrior", "archer", "knight"];
  const units: Unit[] = [];
  for (let i = 0; i < 3; i++) {
    const t = types[i];
    const st = UNIT_STATS[t];
    units.push({
      id: `p${i}`,
      team: "player",
      type: t,
      hp: st.hp,
      maxHp: st.hp,
      attack: st.attack,
      defense: st.defense,
      row: 5,
      col: i + 1,
      moved: false,
    });
    units.push({
      id: `a${i}`,
      team: "ai",
      type: t,
      hp: st.hp,
      maxHp: st.hp,
      attack: st.attack,
      defense: st.defense,
      row: 0,
      col: i + 1,
      moved: false,
    });
  }
  return units;
}
function makeGrid(): Cell[][] {
  return Array.from({ length: GRID }, (_, r) =>
    Array.from({ length: GRID }, (_, c) => ({
      row: r,
      col: c,
      owner: null,
      isObjective: OBJECTIVES.some((o) => o.row === r && o.col === c),
    })),
  );
}

function TacticalConquest({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "player" | "ai" | "over">("idle");
  const [units, setUnits] = useState<Unit[]>(makeUnits());
  const [grid, setGrid] = useState<Cell[][]>(makeGrid());
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const unitsRef = useRef(units);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;
  unitsRef.current = units;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 100 : 40,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 6));
  }
  function getUnitAt(r: number, c: number, us: Unit[]): Unit | null {
    return us.find((u) => u.hp > 0 && u.row === r && u.col === c) ?? null;
  }
  function calcDamage(attacker: Unit, defender: Unit): number {
    return Math.max(1, attacker.attack - Math.floor(defender.defense / 2));
  }
  function moveUnit(unitId: string, toRow: number, toCol: number) {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId ? { ...u, row: toRow, col: toCol, moved: true } : u,
      ),
    );
    setGrid((prev) => {
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      const unit = unitsRef.current.find((u) => u.id === unitId);
      if (unit?.team === "player" && next[toRow][toCol].isObjective) {
        next[toRow][toCol].owner = "player";
        setScore((s) => s + 200);
        addLog(`Captured objective at (${toRow},${toCol})!`);
      }
      return next;
    });
    setSelected(null);
  }
  function attackUnit(attackerId: string, defenderId: string) {
    setUnits((prev) => {
      const attacker = prev.find((u) => u.id === attackerId)!;
      const defender = prev.find((u) => u.id === defenderId)!;
      const dmg = calcDamage(attacker, defender);
      const newHP = Math.max(0, defender.hp - dmg);
      addLog(`${attacker.type} hits ${defender.type} for ${dmg} dmg!`);
      const next = prev.map((u) => {
        if (u.id === attackerId) return { ...u, moved: true };
        if (u.id === defenderId) return { ...u, hp: newHP };
        return u;
      });
      if (newHP === 0 && defender.team === "ai") setScore((s) => s + 300);
      const aiAlive = next.filter((u) => u.team === "ai" && u.hp > 0);
      if (aiAlive.length === 0) setTimeout(() => endGame(true), 600);
      return next;
    });
    setSelected(null);
  }
  function endPlayerTurn() {
    setPhase("ai");
    setUnits((prev) => prev.map((u) => ({ ...u, moved: false })));
  }

  useEffect(() => {
    if (phase !== "ai") return;
    const delay =
      config.difficulty === 1 ? 1200 : config.difficulty === 2 ? 800 : 500;
    const timer = setTimeout(() => {
      setUnits((prev) => {
        let next = prev.map((u) => ({ ...u }));
        const aiUnits = next.filter((u) => u.team === "ai" && u.hp > 0);
        for (const ai of aiUnits) {
          const playerUnits = next.filter(
            (u) => u.team === "player" && u.hp > 0,
          );
          if (playerUnits.length === 0) break;
          playerUnits.sort(
            (a, b) =>
              Math.abs(a.row - ai.row) +
              Math.abs(a.col - ai.col) -
              (Math.abs(b.row - ai.row) + Math.abs(b.col - ai.col)),
          );
          const target = playerUnits[0];
          const dist =
            Math.abs(target.row - ai.row) + Math.abs(target.col - ai.col);
          if (dist === 1) {
            const dmg = calcDamage(ai, target);
            const newHP = Math.max(0, target.hp - dmg);
            addLog(`AI ${ai.type} attacks for ${dmg}!`);
            next = next.map((u) =>
              u.id === target.id ? { ...u, hp: newHP } : u,
            );
          } else {
            let nr = ai.row;
            let nc = ai.col;
            if (Math.abs(target.row - ai.row) > Math.abs(target.col - ai.col)) {
              nr += target.row > ai.row ? 1 : -1;
            } else {
              nc += target.col > ai.col ? 1 : -1;
            }
            nr = Math.max(0, Math.min(GRID - 1, nr));
            nc = Math.max(0, Math.min(GRID - 1, nc));
            if (!next.find((u) => u.hp > 0 && u.row === nr && u.col === nc)) {
              next = next.map((u) =>
                u.id === ai.id ? { ...u, row: nr, col: nc } : u,
              );
            }
          }
        }
        const playerAlive = next.filter((u) => u.team === "player" && u.hp > 0);
        if (playerAlive.length === 0) setTimeout(() => endGame(false), 400);
        return next;
      });
      setTurn((t) => t + 1);
      setPhase("player");
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, config.difficulty, endGame]);

  function handleCellClick(r: number, c: number) {
    if (phase !== "player") return;
    const unitHere = getUnitAt(r, c, units);
    if (selected) {
      const sel = units.find((u) => u.id === selected);
      if (!sel || sel.moved) {
        setSelected(null);
        return;
      }
      if (unitHere && unitHere.team === "ai") {
        const dist = Math.abs(r - sel.row) + Math.abs(c - sel.col);
        if (dist <= 1) attackUnit(selected, unitHere.id);
        return;
      }
      if (!unitHere) {
        const dist = Math.abs(r - sel.row) + Math.abs(c - sel.col);
        if (dist <= 2) moveUnit(selected, r, c);
        return;
      }
      if (unitHere.team === "player") setSelected(unitHere.id);
    } else {
      if (unitHere && unitHere.team === "player" && !unitHere.moved)
        setSelected(unitHere.id);
    }
  }

  const timePct = (timeLeft / config.timeLimit) * 100;
  const objectiveCount = grid
    .flat()
    .filter((c) => c.isObjective && c.owner === "player").length;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="strategy_games.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Tactical Conquest
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Move your units (W/A/K) to capture objectives and eliminate the
            enemy.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            {(["warrior", "archer", "knight"] as UnitType[]).map((t) => (
              <div
                key={t}
                className="rounded-lg border border-border/30 p-2 bg-card/40"
              >
                <div className="font-bold text-[#f59e0b]">
                  {t.toUpperCase()}
                </div>
                <div>
                  ATK {UNIT_STATS[t].attack} DEF {UNIT_STATS[t].defense} HP{" "}
                  {UNIT_STATS[t].hp}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              startTimer();
              setPhase("player");
            }}
            className="px-8 py-3 rounded-lg bg-[#f59e0b] text-black font-bold hover:bg-[#f59e0b]/90 transition-colors"
            data-ocid="strategy_games.start_button"
          >
            Deploy Forces
          </button>
        </motion.div>
      )}
      {phase !== "idle" && (
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#f59e0b] font-mono">
              Turn {turn} | Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              Objectives: {objectiveCount}/2
            </span>
            <span
              className={`font-bold ${phase === "player" ? "text-[#4ade80]" : "text-[#f43f5e]"}`}
            >
              {phase === "player"
                ? "YOUR TURN"
                : phase === "ai"
                  ? "AI THINKING..."
                  : "GAME OVER"}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="flex gap-4">
            <div
              className="grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
            >
              {grid.flat().map((cell) => {
                const unit = getUnitAt(cell.row, cell.col, units);
                const isSel = unit?.id === selected;
                const isMovable =
                  selected &&
                  !unit &&
                  (() => {
                    const sel = units.find((u) => u.id === selected);
                    if (!sel || sel.moved) return false;
                    return (
                      Math.abs(cell.row - sel.row) +
                        Math.abs(cell.col - sel.col) <=
                      2
                    );
                  })();
                const isAttackable =
                  selected &&
                  unit?.team === "ai" &&
                  (() => {
                    const sel = units.find((u) => u.id === selected);
                    if (!sel || sel.moved) return false;
                    return (
                      Math.abs(cell.row - sel.row) +
                        Math.abs(cell.col - sel.col) <=
                      1
                    );
                  })();
                return (
                  <motion.button
                    key={`cell-${cell.row}-${cell.col}`}
                    type="button"
                    onClick={() => handleCellClick(cell.row, cell.col)}
                    animate={isSel ? { scale: 1.1 } : { scale: 1 }}
                    className={`w-11 h-11 rounded border flex items-center justify-center font-bold text-sm transition-all ${
                      isSel
                        ? "border-[#f59e0b] bg-[#f59e0b]/30"
                        : isAttackable
                          ? "border-[#f43f5e] bg-[#f43f5e]/20 cursor-pointer"
                          : isMovable
                            ? "border-[#10b981]/50 bg-[#10b981]/10 cursor-pointer"
                            : cell.isObjective
                              ? cell.owner === "player"
                                ? "border-[#f59e0b]/70 bg-[#f59e0b]/10"
                                : "border-[#f59e0b]/30 bg-[#f59e0b]/5"
                              : "border-border/20 bg-card/30"
                    }`}
                    data-ocid={`strategy_games.cell.${cell.row}_${cell.col}`}
                  >
                    {unit && unit.hp > 0 && (
                      <div
                        className={`flex flex-col items-center ${unit.team === "player" ? "text-[#00f5ff]" : "text-[#f43f5e]"}`}
                      >
                        <span className="text-xs font-black">
                          {UNIT_STATS[unit.type].symbol}
                        </span>
                        <span className="text-[9px] leading-none">
                          {unit.hp}
                        </span>
                      </div>
                    )}
                    {!unit && cell.isObjective && (
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b]/60" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Battle Log
              </p>
              <div className="flex-1 space-y-1">
                <AnimatePresence>
                  {log.map((l, i) => (
                    <motion.div
                      key={`${l}-${i}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-muted-foreground"
                    >
                      {l}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          {phase === "player" && (
            <button
              type="button"
              onClick={endPlayerTurn}
              className="self-end px-4 py-1.5 rounded bg-card border border-border/40 text-xs hover:border-[#f59e0b] transition-colors"
              data-ocid="strategy_games.end_turn_button"
            >
              End Turn
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 2 — Resource Manager
// ─────────────────────────────────────────────
const RM_ACTIONS = [
  {
    id: "shelter",
    label: "Build Shelter",
    desc: "Costs 30 material",
    material: -30,
    food: 0,
    energy: 0,
    pts: 80,
  },
  {
    id: "feed",
    label: "Feed Community",
    desc: "Costs 10 food",
    material: 0,
    food: -10,
    energy: 0,
    pts: 50,
  },
  {
    id: "trade",
    label: "Trade for Food",
    desc: "Costs 20 material, +30 food",
    material: -20,
    food: 30,
    energy: 0,
    pts: 60,
  },
  {
    id: "rest",
    label: "Conserve Energy",
    desc: "Costs nothing, +15 energy",
    material: 0,
    food: 0,
    energy: 15,
    pts: 30,
  },
  {
    id: "forage",
    label: "Forage Food",
    desc: "+20 food, -10 energy",
    material: 0,
    food: 20,
    energy: -10,
    pts: 40,
  },
];

function ResourceManager({ config, onGameEnd }: Props) {
  const totalRounds = 10;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [food, setFood] = useState(100);
  const [material, setMaterial] = useState(50);
  const [energy, setEnergy] = useState(80);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(score);
  const startTimeRef = useRef(Date.now());
  phaseRef.current = phase;
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 85 : 40,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  function pickAction(actionId: string) {
    if (chosen) return;
    const action = RM_ACTIONS.find((a) => a.id === actionId)!;
    const nf = food + action.food;
    const nm = material + action.material;
    const ne = energy + action.energy;
    if (nf < 0 || nm < 0 || ne < 0) {
      setLog((prev) =>
        [`Round ${round}: Cannot afford ${action.label}!`, ...prev].slice(0, 6),
      );
      return;
    }
    setFood(nf);
    setMaterial(nm);
    setEnergy(ne);
    const pts = action.pts * config.difficulty;
    setScore((s) => s + pts);
    setLog((prev) =>
      [`Round ${round}: ${action.label} +${pts}pts`, ...prev].slice(0, 6),
    );
    setChosen(actionId);
    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound > totalRounds) {
        endGame(true);
        return;
      }
      setRound(nextRound);
      setChosen(null);
      // food drains each round
      setFood((f) => {
        const nf2 = f - 8;
        if (nf2 <= 0) {
          setTimeout(() => endGame(false), 500);
          return 0;
        }
        return nf2;
      });
    }, 900);
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  const resBar = (val: number, max: number, label: string, color: string) => (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span style={{ color }}>{val}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, (val / max) * 100)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="resource_manager.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Resource Manager
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Manage food, materials, and energy across 10 rounds. Choose wisely —
            let any resource hit zero and the colony collapses.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-lg border border-border/30 p-2 bg-card/40">
              <div className="font-bold text-[#22c55e]">Food 100</div>
            </div>
            <div className="rounded-lg border border-border/30 p-2 bg-card/40">
              <div className="font-bold text-[#f59e0b]">Material 50</div>
            </div>
            <div className="rounded-lg border border-border/30 p-2 bg-card/40">
              <div className="font-bold text-[#00f5ff]">Energy 80</div>
            </div>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            style={{ background: "#f59e0b", color: "black" }}
            data-ocid="resource_manager.start_button"
          >
            Manage Colony
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#f59e0b] font-mono">
              Round {round}/{totalRounds}
            </span>
            <span className="text-[#f59e0b] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {resBar(food, 150, "Food", "#22c55e")}
            {resBar(material, 100, "Material", "#f59e0b")}
            {resBar(energy, 120, "Energy", "#00f5ff")}
          </div>
          <p className="text-xs text-muted-foreground">
            Food depletes -8 each round. Choose your action:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {RM_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => pickAction(action.id)}
                disabled={!!chosen}
                className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  chosen === action.id
                    ? "border-[#f59e0b] bg-[#f59e0b]/20"
                    : "border-border/30 bg-card/50 hover:border-[#f59e0b]/50"
                } disabled:cursor-not-allowed`}
                data-ocid={`resource_manager.action.${action.id}`}
              >
                <span className="font-bold">{action.label}</span>
                <span className="text-muted-foreground text-xs ml-2">
                  {action.desc}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-1">
            {log.map((l, i) => (
              <p key={`log-${i}`} className="text-xs text-muted-foreground">
                {l}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME 3 — Chess Tactics
// ─────────────────────────────────────────────
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type PieceColor = "w" | "b";
interface Piece {
  type: PieceType;
  color: PieceColor;
}
type BoardMap = Record<string, Piece>;

interface ChessPuzzle {
  title: string;
  fen: BoardMap;
  prompt: string;
  correctFrom: string;
  correctTo: string;
  explanation: string;
}

const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    title: "Checkmate in 1",
    prompt: "White to move. Find checkmate in 1.",
    fen: {
      e1: { type: "K", color: "w" },
      d1: { type: "Q", color: "w" },
      h7: { type: "K", color: "b" },
      g6: { type: "P", color: "b" },
    },
    correctFrom: "d1",
    correctTo: "h5",
    explanation:
      "Qh5# is checkmate. The black king on h7 is mated with no escape.",
  },
  {
    title: "Fork the King",
    prompt: "White knight to move. Fork the king and rook.",
    fen: {
      e1: { type: "K", color: "w" },
      c3: { type: "N", color: "w" },
      e8: { type: "K", color: "b" },
      h8: { type: "R", color: "b" },
    },
    correctFrom: "c3",
    correctTo: "f5",
    explanation:
      "Nf5 forks the black king on e8 and threatens g7, forcing a material advantage.",
  },
  {
    title: "Pin the Queen",
    prompt: "White to move. Pin the queen to the king with the bishop.",
    fen: {
      e1: { type: "K", color: "w" },
      c1: { type: "B", color: "w" },
      d8: { type: "K", color: "b" },
      e7: { type: "Q", color: "b" },
    },
    correctFrom: "c1",
    correctTo: "b2",
    explanation:
      "Bb2 pins the black queen on e5 to the king on d8 along the diagonal.",
  },
  {
    title: "Back Rank Mate",
    prompt: "White rook to deliver back-rank checkmate.",
    fen: {
      e1: { type: "K", color: "w" },
      a1: { type: "R", color: "w" },
      e8: { type: "K", color: "b" },
      d8: { type: "R", color: "b" },
    },
    correctFrom: "a1",
    correctTo: "e1",
    explanation:
      "Re1 contests the file. The concept: seize open files to restrict the enemy king.",
  },
  {
    title: "Skewer",
    prompt: "White bishop moves to skewer the king behind the queen.",
    fen: {
      g1: { type: "K", color: "w" },
      f3: { type: "B", color: "w" },
      e8: { type: "K", color: "b" },
      d6: { type: "Q", color: "b" },
    },
    correctFrom: "f3",
    correctTo: "c6",
    explanation:
      "Bc6+ skewers the king. King must move, leaving queen exposed for capture.",
  },
];

const PIECE_UNICODE: Record<PieceType, Record<PieceColor, string>> = {
  K: { w: "\u2654", b: "\u265A" },
  Q: { w: "\u2655", b: "\u265B" },
  R: { w: "\u2656", b: "\u265C" },
  B: { w: "\u2657", b: "\u265D" },
  N: { w: "\u2658", b: "\u265E" },
  P: { w: "\u2659", b: "\u265F" },
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

function ChessTactics({ config, onGameEnd }: Props) {
  const puzzles = CHESS_PUZZLES.slice(
    0,
    config.difficulty === 1 ? 3 : config.difficulty === 2 ? 4 : 5,
  );
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [fromSq, setFromSq] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [feedback, setFeedback] = useState<{
    msg: string;
    good: boolean;
  } | null>(null);
  const [correct, setCorrect] = useState(0);
  const scoreRef = useRef(score);
  const phaseRef = useRef(phase);
  const livesRef = useRef(lives);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;
  phaseRef.current = phase;
  livesRef.current = lives;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );

  function startGame() {
    startTimeRef.current = Date.now();
    startTimer();
    setPhase("playing");
  }

  const puzzle = puzzles[puzzleIdx];

  function handleSquareClick(sq: string) {
    if (!fromSq) {
      const piece = puzzle.fen[sq];
      if (piece && piece.color === "w") setFromSq(sq);
      return;
    }
    // second click — destination
    const isCorrect = fromSq === puzzle.correctFrom && sq === puzzle.correctTo;
    setFromSq(null);
    if (isCorrect) {
      const pts = 500 * config.difficulty + timeLeft * 3;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFeedback({ msg: `Correct! ${puzzle.explanation}`, good: true });
      setTimeout(() => {
        setFeedback(null);
        if (puzzleIdx + 1 >= puzzles.length) {
          endGame(true);
          return;
        }
        setPuzzleIdx((i) => i + 1);
      }, 2200);
    } else {
      const nl = livesRef.current - 1;
      setLives(nl);
      setFeedback({
        msg: `Not quite. Try another piece/square. Lives: ${nl}`,
        good: false,
      });
      if (nl <= 0) {
        setTimeout(() => endGame(false), 1800);
        return;
      }
      setTimeout(() => setFeedback(null), 1800);
    }
  }

  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="chess_tactics.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#f59e0b] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#f59e0b]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Chess Tactics
          </h2>
          <p className="text-muted-foreground text-center max-w-sm text-sm">
            Study each board position. Click the correct piece, then click its
            destination to solve the tactic.
          </p>
          <p className="text-xs text-muted-foreground">
            {puzzles.length} puzzles | Find forks, pins, mates, skewers
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            style={{ background: "#f59e0b", color: "black" }}
            data-ocid="chess_tactics.start_button"
          >
            Solve Puzzles
          </button>
        </motion.div>
      )}
      {phase === "playing" && puzzle && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#f59e0b] font-mono">
              Score: {score.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {puzzleIdx + 1}/{puzzles.length} | Lives: {lives} | Solved:{" "}
              {correct}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {timeLeft}s
            </span>
          </div>
          <div className="rounded-xl border border-[#f59e0b]/30 bg-card/40 p-3">
            <p className="text-xs font-bold text-[#f59e0b]">{puzzle.title}</p>
            <p className="text-sm text-foreground mt-1">{puzzle.prompt}</p>
            {fromSq && (
              <p className="text-xs text-[#22c55e] mt-1">
                Piece selected: {fromSq} — now click destination
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <div className="border border-border/30 overflow-hidden rounded-lg">
              {RANKS.map((rank) => (
                <div key={rank} className="flex">
                  {FILES.map((file) => {
                    const sq = file + rank;
                    const isLight =
                      (FILES.indexOf(file) + Number.parseInt(rank)) % 2 === 0;
                    const piece = puzzle.fen[sq];
                    const isSelected = sq === fromSq;
                    return (
                      <button
                        key={sq}
                        type="button"
                        onClick={() => handleSquareClick(sq)}
                        className={`w-9 h-9 flex items-center justify-center text-lg transition-all ${
                          isSelected
                            ? "bg-[#f59e0b]/60"
                            : isLight
                              ? "bg-[#f0d9b5]"
                              : "bg-[#b58863]"
                        }`}
                        data-ocid={`chess_tactics.sq.${sq}`}
                      >
                        {piece ? (
                          <span
                            style={{
                              color: piece.color === "w" ? "#fff" : "#1e293b",
                              textShadow:
                                piece.color === "w" ? "0 1px 2px #000" : "none",
                            }}
                          >
                            {PIECE_UNICODE[piece.type][piece.color]}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg border p-3 text-sm ${
                  feedback.good
                    ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                    : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"
                }`}
              >
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export default function StrategyGames({ config, onGameEnd }: Props) {
  if (config.gameId === "resource-manager")
    return <ResourceManager config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "chess-tactics")
    return <ChessTactics config={config} onGameEnd={onGameEnd} />;
  return <TacticalConquest config={config} onGameEnd={onGameEnd} />;
}
