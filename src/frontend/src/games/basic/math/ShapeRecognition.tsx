import { GlowButton } from "@/components/ui/GlowButton";
import type React from "react";
import { useCallback, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

const TOTAL = 15;

interface ShapeRound {
  shape: string;
  description: string;
  choices: string[];
}

const SHAPES: ShapeRound[] = [
  {
    shape: "circle",
    description: "A perfectly round flat shape with no corners",
    choices: ["Circle", "Oval", "Square", "Sphere"],
  },
  {
    shape: "square",
    description: "A shape with 4 equal sides and 4 right angles",
    choices: ["Rectangle", "Square", "Rhombus", "Trapezoid"],
  },
  {
    shape: "triangle",
    description: "A shape with exactly 3 sides and 3 angles",
    choices: ["Triangle", "Pentagon", "Diamond", "Hexagon"],
  },
  {
    shape: "rectangle",
    description:
      "A shape with 4 sides where opposite sides are equal and all angles are 90°",
    choices: ["Square", "Parallelogram", "Rectangle", "Trapezoid"],
  },
  {
    shape: "pentagon",
    description: "A polygon with exactly 5 sides",
    choices: ["Hexagon", "Pentagon", "Octagon", "Heptagon"],
  },
  {
    shape: "hexagon",
    description: "A polygon with 6 equal sides (like a honeycomb cell)",
    choices: ["Pentagon", "Hexagon", "Heptagon", "Octagon"],
  },
  {
    shape: "octagon",
    description: "A shape with 8 sides (like a stop sign)",
    choices: ["Hexagon", "Heptagon", "Octagon", "Nonagon"],
  },
  {
    shape: "rhombus",
    description:
      "A shape with 4 equal sides but no right angles (tilted square)",
    choices: ["Square", "Rhombus", "Parallelogram", "Kite"],
  },
  {
    shape: "trapezoid",
    description: "A quadrilateral with exactly one pair of parallel sides",
    choices: ["Trapezoid", "Parallelogram", "Rectangle", "Rhombus"],
  },
  {
    shape: "oval",
    description: "An elongated circle (egg-shaped)",
    choices: ["Circle", "Oval", "Ellipse", "Rectangle"],
  },
  {
    shape: "cube",
    description: "A 3D solid with 6 square faces, 8 vertices, and 12 edges",
    choices: ["Sphere", "Cube", "Cuboid", "Pyramid"],
  },
  {
    shape: "sphere",
    description: "A perfectly round 3D solid (like a ball)",
    choices: ["Circle", "Cylinder", "Sphere", "Hemisphere"],
  },
  {
    shape: "cylinder",
    description: "A 3D shape with two circular ends and one curved surface",
    choices: ["Prism", "Cylinder", "Cone", "Capsule"],
  },
  {
    shape: "cone",
    description: "A 3D shape with a circular base tapering to a single point",
    choices: ["Pyramid", "Cone", "Cylinder", "Prism"],
  },
  {
    shape: "pyramid",
    description:
      "A 3D shape with a polygon base and triangular faces meeting at an apex",
    choices: ["Cone", "Prism", "Pyramid", "Cube"],
  },
];

const SHAPE_SVG: Record<string, React.ReactNode> = {
  circle: (
    <circle
      cx="80"
      cy="80"
      r="60"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  square: (
    <rect
      x="20"
      y="20"
      width="120"
      height="120"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  triangle: (
    <polygon
      points="80,10 150,150 10,150"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  rectangle: (
    <rect
      x="10"
      y="40"
      width="140"
      height="80"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  pentagon: (
    <polygon
      points="80,10 150,60 125,150 35,150 10,60"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  hexagon: (
    <polygon
      points="80,10 140,45 140,115 80,150 20,115 20,45"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  octagon: (
    <polygon
      points="55,10 105,10 145,45 155,90 145,135 105,155 55,155 15,120 5,75 15,30"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  rhombus: (
    <polygon
      points="80,10 155,80 80,150 5,80"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  trapezoid: (
    <polygon
      points="40,30 120,30 150,140 10,140"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  oval: (
    <ellipse
      cx="80"
      cy="80"
      rx="70"
      ry="45"
      fill="#00f5ff22"
      stroke="#00f5ff"
      strokeWidth="3"
    />
  ),
  cube: (
    <g stroke="#00f5ff" strokeWidth="2" fill="#00f5ff22">
      <rect x="30" y="50" width="80" height="80" />
      <polygon points="30,50 70,20 150,20 110,50" />
      <line x1="110" y1="50" x2="150" y2="20" />
      <line x1="110" y1="130" x2="150" y2="100" />
      <line x1="150" y1="20" x2="150" y2="100" />
    </g>
  ),
  sphere: (
    <>
      <circle
        cx="80"
        cy="80"
        r="65"
        fill="#00f5ff22"
        stroke="#00f5ff"
        strokeWidth="3"
      />
      <ellipse
        cx="80"
        cy="80"
        rx="65"
        ry="20"
        fill="none"
        stroke="#00f5ff66"
        strokeWidth="2"
      />
    </>
  ),
  cylinder: (
    <g stroke="#00f5ff" strokeWidth="2" fill="#00f5ff22">
      <ellipse cx="80" cy="40" rx="55" ry="20" />
      <ellipse cx="80" cy="130" rx="55" ry="20" />
      <line x1="25" y1="40" x2="25" y2="130" />
      <line x1="135" y1="40" x2="135" y2="130" />
    </g>
  ),
  cone: (
    <g stroke="#00f5ff" strokeWidth="2" fill="#00f5ff22">
      <ellipse cx="80" cy="140" rx="60" ry="20" />
      <line x1="20" y1="140" x2="80" y2="10" />
      <line x1="140" y1="140" x2="80" y2="10" />
    </g>
  ),
  pyramid: (
    <g stroke="#00f5ff" strokeWidth="2" fill="#00f5ff22">
      <polygon points="80,10 150,140 10,140" />
      <line x1="80" y1="10" x2="110" y2="140" />
      <polygon points="110,140 150,140 80,10" fill="#00f5ff11" />
    </g>
  ),
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ShapeRecognition({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState<ShapeRound[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);

  const startGame = () => {
    setRounds(shuffle(SHAPES).slice(0, TOTAL));
    setScore(0);
    setLives(3);
    setRound(0);
    setChosen(null);
    setPhase("play");
  };

  const handleChoice = useCallback(
    (choice: string) => {
      if (chosen !== null) return;
      const current = rounds[round];
      const correct =
        choice.toLowerCase() === current.shape.toLowerCase() ||
        current.choices.indexOf(choice) ===
          current.choices.findIndex(
            (c) => c.toLowerCase() === current.shape.toLowerCase(),
          );
      const actualCorrect =
        choice ===
        current.choices.find(
          (c) => c.toLowerCase() === current.shape.toLowerCase(),
        );
      setChosen(choice);
      setTimeout(() => {
        const ns = actualCorrect ? score + 10 : score;
        const nl = actualCorrect ? lives : lives - 1;
        setScore(ns);
        setLives(nl);
        if (nl <= 0 || round + 1 >= TOTAL) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              Math.round((ns / (TOTAL * 10)) * 100),
              0,
              nl > 0,
            ),
          );
          return;
        }
        setRound((r) => r + 1);
        setChosen(null);
      }, 700);
    },
    [chosen, rounds, round, score, lives, onGameEnd, config],
  );

  const current = rounds[round];
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Shape Recognition
            </h2>
            <p className="text-slate-300 mb-2">
              Identify the 2D and 3D shape shown from its description.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {TOTAL} rounds. Each correct = +10 pts.
            </p>
            <GlowButton onClick={startGame} data-ocid="shape-rec.start_button">
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && current && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-slate-400">
              {round + 1}/{TOTAL}
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
            <svg width="160" height="160" viewBox="0 0 160 160">
              {SHAPE_SVG[current.shape]}
            </svg>
            <p className="text-slate-300 text-center max-w-sm">
              {current.description}
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {current.choices.map((choice, idx) => {
                const isCorrectChoice =
                  choice.toLowerCase() === current.shape.toLowerCase();
                return (
                  <button
                    key={choice}
                    type="button"
                    data-ocid={`shape-rec.choice.${idx + 1}`}
                    onClick={() => handleChoice(choice)}
                    disabled={chosen !== null}
                    className="py-3 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      borderColor:
                        chosen !== null
                          ? isCorrectChoice
                            ? "#10b981"
                            : chosen === choice
                              ? "#f43f5e"
                              : "#ffffff15"
                          : "#ffffff22",
                      background:
                        chosen !== null
                          ? isCorrectChoice
                            ? "#10b98122"
                            : chosen === choice
                              ? "#f43f5e22"
                              : "#ffffff05"
                          : "#ffffff08",
                      color: "#e2e8f0",
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Complete!
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">out of {TOTAL * 10} possible</p>
            <GlowButton
              onClick={startGame}
              data-ocid="shape-rec.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
