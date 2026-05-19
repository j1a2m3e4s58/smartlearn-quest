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
  onGameEnd: (r: GameResult) => void;
}
type Phase = "idle" | "playing" | "over";

const PLANETS = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
];
const PLANET_COLORS: Record<string, string> = {
  Mercury: "#a0a0b0",
  Venus: "#e8c87a",
  Earth: "#4a9eff",
  Mars: "#cc4422",
  Jupiter: "#c8a060",
  Saturn: "#e0c880",
  Uranus: "#66ddee",
  Neptune: "#3366ff",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PlanetOrderGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [tiles, setTiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [checking, setChecking] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const { triggerShake, triggerParticle, triggerAchievement, triggerCombo } =
    useGameFeel();

  const endGame = useCallback(
    (s: number, cr: number, won: boolean) => {
      setPhase("over");
      const elapsed = (Date.now() - startTime) / 1000;
      onGameEnd(buildResult(config, s, (cr / 3) * 100, elapsed, won));
    },
    [config, startTime, onGameEnd],
  );

  const handleExpire = useCallback(() => {
    endGame(score, correctRounds, false);
  }, [score, correctRounds, endGame]);

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useGameTimer(90, handleExpire);

  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setLives(3);
    setRound(1);
    setCorrectRounds(0);
    setTiles(shuffle(PLANETS));
    setSelected([]);
    setFeedback(null);
    setChecking(false);
    setStartTime(Date.now());
    resetTimer();
    startTimer();
  };

  const handlePlanetClick = (planet: string) => {
    if (checking || phase !== "playing") return;
    if (selected.includes(planet)) return;
    const newSelected = [...selected, planet];
    setSelected(newSelected);
    if (newSelected.length === PLANETS.length) {
      setChecking(true);
      const isCorrect = newSelected.every((p, i) => p === PLANETS[i]);
      if (isCorrect) {
        const ns = score + 30;
        const ncr = correctRounds + 1;
        setScore(ns);
        setCorrectRounds(ncr);
        triggerParticle(0, 0, "correct");
        triggerAchievement("Round Complete!");
        triggerCombo(ncr);
        setFeedback({
          msg: `Perfect order! Round ${round} complete! +30 points`,
          ok: true,
        });
        if (round >= 3) {
          setTimeout(() => endGame(ns, ncr, true), 1500);
        } else {
          setTimeout(() => {
            setRound((r) => r + 1);
            setTiles(shuffle(PLANETS));
            setSelected([]);
            setFeedback(null);
            setChecking(false);
          }, 1500);
        }
      } else {
        const nl = lives - 1;
        setLives(nl);
        triggerShake();
        setFeedback({
          msg: "Wrong order! Correct: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune",
          ok: false,
        });
        if (nl <= 0) {
          setTimeout(() => endGame(score, correctRounds, false), 1500);
        } else {
          setTimeout(() => {
            setTiles(shuffle(PLANETS));
            setSelected([]);
            setFeedback(null);
            setChecking(false);
          }, 1800);
        }
      }
    }
  };

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-[#4a9eff] mb-3">
            Planet Order
          </h2>
          <p className="text-white/70 mb-4">
            Click the planets in order from closest to the Sun to farthest. 3
            rounds, shuffled each time.
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {PLANETS.map((p) => (
              <div
                key={p}
                className="rounded-full px-3 py-1 text-xs font-medium border"
                style={{
                  borderColor: `${PLANET_COLORS[p]}60`,
                  color: PLANET_COLORS[p],
                  background: `${PLANET_COLORS[p]}15`,
                }}
              >
                {p}
              </div>
            ))}
          </div>
          <GlowButton data-ocid="planet.play_button" onClick={startGame}>
            Play Now
          </GlowButton>
        </div>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md w-full text-center">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: correctRounds >= 2 ? "#10b981" : "#f43f5e" }}
          >
            {correctRounds >= 2 ? "Space Explorer!" : "Game Over"}
          </h2>
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#00f5ff]">{score}</div>
              <div className="text-white/50 text-sm">Score</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#10b981]">
                {correctRounds}/3
              </div>
              <div className="text-white/50 text-sm">Rounds Won</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-2xl font-bold text-[#f59e0b]">{lives}</div>
              <div className="text-white/50 text-sm">Lives Left</div>
            </div>
          </div>
          <GlowButton data-ocid="planet.play_again_button" onClick={startGame}>
            Play Again
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="text-[#4a9eff] font-bold">Score: {score}</div>
        <div className="text-white/60 text-sm">Round {round}/3</div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-[#f43f5e]" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div
          className={`font-bold ${timeLeft <= 15 ? "text-[#f43f5e] animate-pulse" : "text-[#f59e0b]"}`}
        >
          {timeLeft}s
        </div>
      </div>

      <p className="text-center text-white/60 text-sm">
        Click planets from{" "}
        <span className="text-[#f59e0b] font-semibold">nearest</span> to{" "}
        <span className="text-[#4a9eff] font-semibold">farthest</span> from the
        Sun
      </p>

      {feedback && (
        <div
          className={`rounded-lg px-4 py-2 text-xs font-medium text-center ${
            feedback.ok
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
              : "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">
          Available Planets
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {tiles.map((planet) => (
            <button
              key={planet}
              type="button"
              data-ocid={`planet.tile.${planet.toLowerCase()}`}
              onClick={() => handlePlanetClick(planet)}
              disabled={selected.includes(planet) || checking}
              className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all ${
                selected.includes(planet)
                  ? "opacity-30 cursor-not-allowed border-white/10 bg-white/5"
                  : "hover:scale-105 cursor-pointer"
              }`}
              style={
                !selected.includes(planet)
                  ? {
                      borderColor: `${PLANET_COLORS[planet]}60`,
                      color: PLANET_COLORS[planet],
                      background: `${PLANET_COLORS[planet]}15`,
                    }
                  : {}
              }
            >
              {planet}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">
          Your Order ({selected.length}/8)
        </h4>
        <div className="flex flex-wrap gap-2">
          {selected.map((planet, i) => (
            <div
              key={planet}
              className="flex items-center gap-1 px-3 py-1 rounded-lg border text-sm"
              style={{
                borderColor: `${PLANET_COLORS[planet]}60`,
                color: PLANET_COLORS[planet],
                background: `${PLANET_COLORS[planet]}15`,
              }}
            >
              <span className="text-white/40 text-xs">{i + 1}.</span> {planet}
            </div>
          ))}
          {selected.length === 0 && (
            <p className="text-white/30 text-sm">
              Click planets above to order them...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
