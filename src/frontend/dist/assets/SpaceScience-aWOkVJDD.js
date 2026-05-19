import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, l as Star, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }]
];
const Rocket = createLucideIcon("rocket", __iconNode);
const D1_QUESTIONS = [
  {
    text: "Which planet is closest to the Sun?",
    answers: ["Venus", "Mercury", "Earth", "Mars"],
    correct: 1,
    fact: "Mercury orbits the Sun every 88 Earth days."
  },
  {
    text: "How many planets are in our Solar System?",
    answers: ["7", "9", "8", "10"],
    correct: 2,
    fact: "Pluto was reclassified as a dwarf planet in 2006."
  },
  {
    text: "Which is the largest planet?",
    answers: ["Saturn", "Neptune", "Uranus", "Jupiter"],
    correct: 3,
    fact: "Jupiter's mass is greater than all other planets combined."
  },
  {
    text: "What is the star at the center of our Solar System?",
    answers: ["Polaris", "Sirius", "The Sun", "Vega"],
    correct: 2,
    fact: "The Sun contains 99.86% of the Solar System's total mass."
  },
  {
    text: "Which planet has the most moons?",
    answers: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 1,
    fact: "Saturn has 146 confirmed moons as of 2023."
  },
  {
    text: "What causes day and night on Earth?",
    answers: [
      "Earth orbiting the Sun",
      "Moon's shadow",
      "Earth's rotation",
      "Sun's rotation"
    ],
    correct: 2,
    fact: "Earth rotates once every 24 hours."
  },
  {
    text: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Mercury"],
    correct: 1,
    fact: "Mars appears red due to iron oxide (rust) on its surface."
  },
  {
    text: "What is a light-year?",
    answers: [
      "Time to travel to Moon",
      "Distance light travels in a year",
      "Age of a star",
      "Speed of Earth"
    ],
    correct: 1,
    fact: "One light-year is about 9.46 trillion kilometres."
  },
  {
    text: "Which planet has rings clearly visible from Earth?",
    answers: ["Jupiter", "Uranus", "Neptune", "Saturn"],
    correct: 3,
    fact: "Saturn's rings are made mostly of ice and rock."
  },
  {
    text: "What force keeps planets in orbit around the Sun?",
    answers: ["Magnetism", "Gravity", "Friction", "Pressure"],
    correct: 1,
    fact: "Gravity is the fundamental force of orbital mechanics."
  }
];
const D2_QUESTIONS = [
  {
    text: "What is the approximate orbital period of Jupiter?",
    answers: ["5 years", "12 years", "30 years", "84 years"],
    correct: 1,
    fact: "Jupiter completes one orbit around the Sun every ~11.86 years."
  },
  {
    text: "Which force explains why planets stay in elliptical orbits?",
    answers: [
      "Electrostatics",
      "Gravity via Newton's law",
      "Dark energy",
      "Magnetic fields"
    ],
    correct: 1,
    fact: "Newton's law of universal gravitation governs orbital paths."
  },
  {
    text: "What is the Kuiper Belt?",
    answers: [
      "Asteroid belt between Mars and Jupiter",
      "Region of icy bodies beyond Neptune",
      "Layer of the Sun",
      "Ring around Saturn"
    ],
    correct: 1,
    fact: "The Kuiper Belt extends from 30 to 50 AU from the Sun."
  },
  {
    text: "Which moon of Saturn has a thick nitrogen atmosphere?",
    answers: ["Enceladus", "Rhea", "Titan", "Mimas"],
    correct: 2,
    fact: "Titan is the only moon with a dense atmosphere besides Earth."
  },
  {
    text: "What is the escape velocity of Earth?",
    answers: ["7.9 km/s", "11.2 km/s", "17.5 km/s", "5.3 km/s"],
    correct: 1,
    fact: "11.2 km/s is needed to escape Earth's gravitational pull."
  },
  {
    text: "The Hubble Space Telescope orbits at approximately what altitude?",
    answers: ["100 km", "350 km", "550 km", "2000 km"],
    correct: 2,
    fact: "Hubble orbits at ~547 km altitude in Low Earth Orbit."
  },
  {
    text: "What is a pulsar?",
    answers: [
      "Young star",
      "Rotating neutron star emitting beams",
      "Exploding red giant",
      "Black hole"
    ],
    correct: 1,
    fact: "Pulsars emit electromagnetic radiation from their magnetic poles."
  },
  {
    text: "Mars has the largest known volcano. What is it called?",
    answers: ["Vesuvius", "Mauna Kea", "Olympus Mons", "Tharsis"],
    correct: 2,
    fact: "Olympus Mons is 22 km tall, nearly 3x the height of Everest."
  },
  {
    text: "Kepler's first law states planets orbit in what shape?",
    answers: ["Circles", "Parabolas", "Ellipses", "Spirals"],
    correct: 2,
    fact: "Kepler discovered elliptical orbits in 1609."
  },
  {
    text: "What are sunspots?",
    answers: [
      "Hot plasma jets",
      "Dark cooler areas on the Sun's surface",
      "Solar flares",
      "Craters on the Sun"
    ],
    correct: 1,
    fact: "Sunspots are cooler areas caused by magnetic activity."
  }
];
const D3_QUESTIONS = [
  {
    text: "The Schwarzschild radius defines what critical boundary?",
    answers: [
      "Neutron star crust",
      "Event horizon of a black hole",
      "White dwarf boundary",
      "Stellar corona"
    ],
    correct: 1,
    fact: "The Schwarzschild radius is where escape velocity equals the speed of light."
  },
  {
    text: "What does the Hertzsprung-Russell diagram plot?",
    answers: [
      "Orbital periods vs mass",
      "Luminosity vs surface temperature",
      "Planet size vs density",
      "Distance vs age"
    ],
    correct: 1,
    fact: "The H-R diagram is the fundamental tool of stellar astrophysics."
  },
  {
    text: "Type Ia supernovae are standard candles because...",
    answers: [
      "They all have the same color",
      "They have a known absolute luminosity",
      "They occur at regular intervals",
      "They are always close to Earth"
    ],
    correct: 1,
    fact: "Type Ia SNe allow measurement of cosmic distances with high precision."
  },
  {
    text: "What degeneracy pressure supports white dwarfs?",
    answers: [
      "Gas pressure",
      "Magnetic pressure",
      "Electron degeneracy pressure",
      "Photon pressure"
    ],
    correct: 2,
    fact: "Electron degeneracy pressure arises from the Pauli exclusion principle."
  },
  {
    text: "Gravitational lensing is caused by?",
    answers: [
      "Light bending around mirrors",
      "Mass curving spacetime bending light paths",
      "Atmospheric refraction",
      "Magnetic fields"
    ],
    correct: 1,
    fact: "Einstein predicted gravitational lensing in general relativity."
  },
  {
    text: "What fraction of the universe is ordinary matter?",
    answers: ["~95%", "~70%", "~27%", "~5%"],
    correct: 3,
    fact: "About 5% ordinary matter, 27% dark matter, 68% dark energy."
  },
  {
    text: "A quasar is powered by?",
    answers: [
      "A cluster of supernovae",
      "A supermassive black hole accreting matter",
      "A pulsar cloud",
      "Nuclear fusion chains"
    ],
    correct: 1,
    fact: "Quasars can outshine entire galaxies from a region smaller than our Solar System."
  },
  {
    text: "What is Hawking radiation?",
    answers: [
      "Gamma bursts from pulsars",
      "Thermal radiation predicted to leak from black holes",
      "Radiation from solar flares",
      "Cosmic rays from supernovae"
    ],
    correct: 1,
    fact: "Hawking radiation suggests black holes eventually evaporate over time."
  }
];
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
  delay: Math.random() * 3
}));
const CONSTELLATIONS = [
  {
    name: "Orion",
    stars: [
      { x: 50, y: 15 },
      { x: 35, y: 30 },
      { x: 65, y: 30 },
      { x: 40, y: 50 },
      { x: 60, y: 50 },
      { x: 45, y: 68 },
      { x: 55, y: 68 },
      { x: 50, y: 82 }
    ],
    connections: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 7]
    ],
    tempQuestion: "Betelgeuse (Orion's shoulder) is what color, indicating it's a...",
    tempAnswers: [
      "Blue — hot main sequence",
      "Red — cool red supergiant",
      "Yellow — main sequence",
      "White — dwarf"
    ],
    tempCorrect: 1,
    tempFact: "Betelgeuse is a red supergiant, one of the largest known stars."
  },
  {
    name: "Ursa Major",
    stars: [
      { x: 20, y: 55 },
      { x: 32, y: 48 },
      { x: 45, y: 45 },
      { x: 57, y: 48 },
      { x: 65, y: 38 },
      { x: 72, y: 25 },
      { x: 80, y: 20 },
      { x: 60, y: 28 }
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [4, 7],
      [5, 7]
    ],
    tempQuestion: "The Big Dipper (Ursa Major) is used to find which star?",
    tempAnswers: ["Sirius", "Polaris (North Star)", "Betelgeuse", "Vega"],
    tempCorrect: 1,
    tempFact: "The two pointer stars of the Big Dipper point directly to Polaris."
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 15, y: 45 },
      { x: 30, y: 30 },
      { x: 50, y: 55 },
      { x: 70, y: 28 },
      { x: 85, y: 45 }
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4]
    ],
    tempQuestion: "Cassiopeia forms what shape in the sky?",
    tempAnswers: ["Circle", "Triangle", "W or M shape", "Cross"],
    tempCorrect: 2,
    tempFact: "Cassiopeia's five bright stars form a distinctive W or M in the sky."
  },
  {
    name: "Leo",
    stars: [
      { x: 25, y: 30 },
      { x: 38, y: 20 },
      { x: 50, y: 25 },
      { x: 55, y: 40 },
      { x: 45, y: 55 },
      { x: 65, y: 55 },
      { x: 78, y: 50 },
      { x: 85, y: 35 }
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
      [5, 6],
      [6, 7],
      [7, 3]
    ],
    tempQuestion: "Regulus, the brightest star in Leo, is classified as a...",
    tempAnswers: [
      "Red giant",
      "Blue-white main sequence star",
      "Yellow dwarf",
      "Neutron star"
    ],
    tempCorrect: 1,
    tempFact: "Regulus is a blue-white B-type star approximately 79 light-years away."
  }
];
const MISSIONS = [
  {
    title: "Land on Mars",
    stages: [
      {
        briefing: "Stage 1: Calculate orbital transfer to Mars",
        question: "What type of orbital path is used to travel from Earth to Mars most efficiently?",
        answers: [
          "Direct straight-line path",
          "Hohmann transfer orbit (ellipse)",
          "Circular orbit maintained",
          "Retrograde orbit"
        ],
        correct: 1,
        scienceFact: "A Hohmann transfer uses two engine burns to shift between circular orbits."
      },
      {
        briefing: "Stage 2: Entering Mars atmosphere",
        question: "How do spacecraft slow down when entering a planet's atmosphere?",
        answers: [
          "Reverse thrusters only",
          "Aerobraking using atmospheric drag",
          "Magnetic braking",
          "Solar wind resistance"
        ],
        correct: 1,
        scienceFact: "Aerobraking uses atmospheric friction to slow a spacecraft without burning extra fuel."
      },
      {
        briefing: "Stage 3: Deploy landing system",
        question: "Mars gravity is approximately what fraction of Earth's gravity?",
        answers: ["1/6th", "1/3rd", "Same as Earth", "2x Earth"],
        correct: 1,
        scienceFact: "Mars has 38% of Earth's surface gravity due to its smaller mass."
      },
      {
        briefing: "Stage 4: Surface operations",
        question: "What is Mars' atmosphere primarily composed of?",
        answers: [
          "Oxygen and Nitrogen",
          "Carbon Dioxide (95%)",
          "Hydrogen and Helium",
          "Methane"
        ],
        correct: 1,
        scienceFact: "Mars' atmosphere is 95% CO2 and only 0.13% oxygen — unbreathable."
      },
      {
        briefing: "Stage 5: Mission complete — Return trajectory",
        question: "How long does a one-way trip from Earth to Mars typically take?",
        answers: ["2 weeks", "3 months", "7–9 months", "2 years"],
        correct: 2,
        scienceFact: "Depending on orbital alignment, Mars missions take 7–9 months in transit."
      }
    ]
  },
  {
    title: "Repair the Hubble",
    stages: [
      {
        briefing: "Stage 1: Launch to Low Earth Orbit",
        question: "What altitude does the Hubble Space Telescope orbit at?",
        answers: ["100 km", "350 km", "547 km", "1000 km"],
        correct: 2,
        scienceFact: "Hubble orbits at approximately 547 km, well within LEO."
      },
      {
        briefing: "Stage 2: Rendezvous maneuver",
        question: "How do two spacecraft match orbits in space for rendezvous?",
        answers: [
          "Both stop completely",
          "One accelerates into a lower orbit then up",
          "They fly in parallel lines",
          "Ground control tethers them"
        ],
        correct: 1,
        scienceFact: "Orbital rendezvous requires precise phasing burns to match velocity and position."
      },
      {
        briefing: "Stage 3: EVA spacewalk",
        question: "Astronauts in an EVA suit experience what temperature range in orbit?",
        answers: [
          "-157 to +121°C",
          "-20 to +40°C",
          "-300 to +500°C",
          "0°C constant"
        ],
        correct: 0,
        scienceFact: "Sunlit surfaces reach +121°C while shadow areas drop to -157°C in orbit."
      },
      {
        briefing: "Stage 4: Replace optics module",
        question: "What was wrong with Hubble's original mirror when it launched?",
        answers: [
          "Too small",
          "Spherical aberration — wrong curvature",
          "Made of wrong material",
          "Cracked during launch"
        ],
        correct: 1,
        scienceFact: "Hubble's primary mirror had a 2.2 micron shape error causing blurry images until 1993 repairs."
      },
      {
        briefing: "Stage 5: Systems test and departure",
        question: "What type of light can the Hubble detect beyond visible light?",
        answers: [
          "Only visible light",
          "Radio waves",
          "Ultraviolet and near-infrared",
          "X-rays and gamma rays"
        ],
        correct: 2,
        scienceFact: "Hubble observes in UV, visible, and near-infrared wavelengths."
      }
    ]
  },
  {
    title: "Launch Satellite into Orbit",
    stages: [
      {
        briefing: "Stage 1: Pre-launch checks",
        question: "What is orbital velocity needed to stay in Low Earth Orbit?",
        answers: ["1 km/s", "4 km/s", "7.9 km/s", "11.2 km/s"],
        correct: 2,
        scienceFact: "At 7.9 km/s, a satellite's centrifugal tendency matches Earth's gravitational pull."
      },
      {
        briefing: "Stage 2: First stage engine burn",
        question: "Newton's third law explains rocket propulsion as:",
        answers: [
          "Pushing against air",
          "Exhaust gases pushed down, rocket pushed up",
          "Magnetic repulsion from Earth",
          "Gravity reversal"
        ],
        correct: 1,
        scienceFact: "Rockets work in vacuum — they expel mass backward, receiving equal forward thrust."
      },
      {
        briefing: "Stage 3: Stage separation",
        question: "Why do rockets shed stages during ascent?",
        answers: [
          "They break apart accidentally",
          "Reduce mass to improve efficiency as fuel depletes",
          "Stages are reused immediately",
          "To create drag"
        ],
        correct: 1,
        scienceFact: "Dropping empty fuel tanks reduces dead weight, dramatically improving mass ratio."
      },
      {
        briefing: "Stage 4: Orbital insertion burn",
        question: "What is the Karman line, the boundary of outer space?",
        answers: ["50 km", "80 km", "100 km", "200 km"],
        correct: 2,
        scienceFact: "The Karman line at 100 km altitude is the internationally recognized edge of space."
      },
      {
        briefing: "Stage 5: Satellite deployment",
        question: "A geostationary orbit keeps a satellite above the same point because:",
        answers: [
          "It's stationary in space",
          "Its orbital period matches Earth's rotation (24 hrs)",
          "It's in Earth's shadow",
          "Magnetic field locks it in place"
        ],
        correct: 1,
        scienceFact: "GEO satellites orbit at 35,786 km with a 24-hour period, ideal for communications."
      }
    ]
  }
];
function SpaceScience({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "star-navigator")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(StarNavigator, { config, onGameEnd });
  if (gameId === "space-explorer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SpaceExplorer, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MissionControl, { config, onGameEnd });
}
function MissionControl({ config, onGameEnd }) {
  const questions = config.difficulty === 1 ? D1_QUESTIONS : config.difficulty === 2 ? D2_QUESTIONS : D3_QUESTIONS;
  const [phase, setPhase] = reactExports.useState("start");
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [selectedAnswer, setSelectedAnswer] = reactExports.useState(null);
  const [shipProgress, setShipProgress] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const currentQ = questions[qIdx % questions.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  const shipBarStyle = { width: `${qIdx / questions.length * 100}%` };
  const progressBarStyle = { width: `${progressPct}%` };
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleAnswer(idx) {
    if (flash !== "idle" || phase !== "playing") return;
    setSelectedAnswer(idx);
    setTotal((t) => t + 1);
    if (idx === currentQ.correct) {
      const pts = config.difficulty * 250;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setShipProgress((p) => Math.min(100, p + 5));
      setFlash("correct");
      setFeedbackMsg(currentQ.fact);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Incorrect. ${currentQ.fact}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      setSelectedAnswer(null);
      const nextIdx = qIdx + 1;
      if (nextIdx >= questions.length) endGame(true);
      else {
        setQIdx(nextIdx);
        setPhase("playing");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "space_science.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 pointer-events-none overflow-hidden",
            style: { zIndex: 0 },
            children: STARS.map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute rounded-full bg-white star-twinkle",
                style: {
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDelay: `${star.delay}s`
                }
              },
              star.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Mission:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: shipBarStyle
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              qIdx,
              "/",
              questions.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: progressBarStyle
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center relative z-10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Rocket,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#00f5ff" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#00f5ff",
                    textShadow: "0 0 20px rgba(0,245,255,0.6)"
                  },
                  children: "Mission Control"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 text-sm", children: [
                "Answer ",
                questions.length,
                " space science questions to advance your ship across the galaxy."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "space_science.start_button",
                  children: "Launch Mission"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 border border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-8 bg-muted/50 rounded-full overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 flex items-center",
                style: {
                  justifyContent: "flex-start",
                  paddingLeft: `${Math.max(0, shipProgress - 3)}%`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-5 w-5", style: { color: "#00f5ff" } })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-700",
                style: {
                  width: `${shipProgress}%`,
                  background: "linear-gradient(90deg, #7c3aed, #00f5ff)"
                }
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981] shadow-[0_0_24px_rgba(16,185,129,0.3)]" : flash === "wrong" ? "border-[#f43f5e] shadow-[0_0_24px_rgba(244,63,94,0.3)]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-xs uppercase tracking-widest text-muted-foreground",
                      style: { fontFamily: "'Orbitron',sans-serif" },
                      children: [
                        "Q",
                        qIdx + 1,
                        " of ",
                        questions.length
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4", style: { color: "#f59e0b" } })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-5 leading-relaxed", children: currentQ.text }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentQ.answers.map((ans, i) => {
                  let borderColor = "rgba(255,255,255,0.1)";
                  let bgColor = "transparent";
                  if (phase === "feedback") {
                    if (i === currentQ.correct) {
                      borderColor = "#10b981";
                      bgColor = "rgba(16,185,129,0.15)";
                    } else if (i === selectedAnswer) {
                      borderColor = "#f43f5e";
                      bgColor = "rgba(244,63,94,0.15)";
                    }
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "text-left px-4 py-3 rounded-lg border-2 text-sm transition-all hover:border-[#00f5ff] hover:bg-[#00f5ff]/5 text-muted-foreground hover:text-foreground",
                      style: { borderColor, background: bgColor },
                      onClick: () => handleAnswer(i),
                      "data-ocid": `space_science.answer.${i}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs mr-2 opacity-60", children: [
                          String.fromCharCode(65 + i),
                          "."
                        ] }),
                        ans
                      ]
                    },
                    `ans-${i}`
                  );
                }) })
              ]
            },
            qIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 5 },
              animate: { opacity: 1, y: 0 },
              className: `rounded-xl px-4 py-3 text-sm ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: flash === "correct" ? "Correct! " : "Wrong. " }),
                feedbackMsg
              ]
            }
          )
        ] })
      ]
    }
  );
}
function StarNavigator({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [cIdx, setCIdx] = reactExports.useState(0);
  const [drawnLines, setDrawnLines] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [lastTapped, setLastTapped] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const current = CONSTELLATIONS[cIdx % CONSTELLATIONS.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("connect");
    startTimer();
  }
  function handleStarTap(starIdx) {
    if (phase !== "connect") return;
    if (lastTapped === null) {
      setLastTapped(starIdx);
      return;
    }
    const pair = [
      Math.min(lastTapped, starIdx),
      Math.max(lastTapped, starIdx)
    ];
    const isCorrect = current.connections.some(
      ([a, b]) => a === pair[0] && b === pair[1]
    );
    const alreadyDrawn = drawnLines.some(
      ([a, b]) => a === pair[0] && b === pair[1]
    );
    if (!alreadyDrawn) {
      if (isCorrect) {
        setDrawnLines((prev) => [...prev, pair]);
        setScore((s) => s + config.difficulty * 80);
        setCorrect((c) => c + 1);
        const allConnected = current.connections.every(
          ([a, b]) => [...drawnLines, pair].some(([da, db]) => da === a && db === b)
        );
        if (allConnected) {
          setTimeout(() => setPhase("classify"), 600);
        }
      } else {
        setScore((s) => Math.max(0, s - 20));
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return nl;
        });
      }
      setTotal((t) => t + 1);
    }
    setLastTapped(null);
  }
  function handleClassify(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === current.tempCorrect) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${current.tempFact}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${current.tempFact}`);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      setDrawnLines([]);
      setLastTapped(null);
      const next = cIdx + 1;
      if (next >= CONSTELLATIONS.length) endGame(true);
      else {
        setCIdx(next);
        setPhase("connect");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "star_navigator.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Constellation ",
            cIdx + 1,
            "/",
            CONSTELLATIONS.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "h-4 w-4",
              style: {
                color: i < lives ? "#f43f5e" : void 0,
                fill: i < lives ? "#f43f5e" : void 0,
                opacity: i < lives ? 1 : 0.2
              }
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#f59e0b",
                    textShadow: "0 0 20px rgba(245,158,11,0.6)"
                  },
                  children: "Star Navigator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Connect star dots to form named constellations. Tap two stars to draw a line. Then classify the star type." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "star_navigator.start_button",
                  children: "Begin Navigation"
                }
              )
            ] })
          }
        ),
        (phase === "connect" || phase === "classify" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass rounded-xl border border-border/30 relative overflow-hidden",
              style: { minHeight: 240 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0",
                    style: {
                      background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000008 100%)"
                    }
                  }
                ),
                STARS.slice(0, 30).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute rounded-full",
                    style: {
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      width: "2px",
                      height: "2px",
                      background: "white",
                      opacity: s.opacity * 0.4
                    }
                  },
                  s.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "absolute inset-0 w-full h-full", children: drawnLines.map(([a, b], idx) => {
                  const sa = current.stars[a];
                  const sb = current.stars[b];
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "line",
                    {
                      x1: `${sa.x}%`,
                      y1: `${sa.y}%`,
                      x2: `${sb.x}%`,
                      y2: `${sb.y}%`,
                      stroke: "#f59e0b",
                      strokeWidth: "1.5",
                      opacity: "0.7",
                      style: { filter: "drop-shadow(0 0 3px #f59e0b)" }
                    },
                    `l-${idx}`
                  );
                }) }),
                current.stars.map((star, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute rounded-full transition-all",
                    style: {
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: lastTapped === i ? "16px" : "10px",
                      height: lastTapped === i ? "16px" : "10px",
                      background: lastTapped === i ? "#f59e0b" : "white",
                      boxShadow: lastTapped === i ? "0 0 8px #f59e0b" : "0 0 3px rgba(255,255,255,0.6)"
                    },
                    onClick: () => handleStarTap(i),
                    "data-ocid": `star_navigator.star.${i}`
                  },
                  `star-${i}`
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-0 right-0 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-bold px-3 py-1 rounded-full",
                    style: { background: "rgba(0,0,0,0.6)", color: "#f59e0b" },
                    children: [
                      current.name,
                      " —",
                      " ",
                      phase === "connect" ? "Connect the stars" : "Well done!"
                    ]
                  }
                ) })
              ]
            }
          ),
          (phase === "classify" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-[#f59e0b]/40"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-4", children: current.tempQuestion }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: current.tempAnswers.map((ans, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all",
                    onClick: () => handleClassify(i),
                    "data-ocid": `star_navigator.classify.${i}`,
                    children: ans
                  },
                  `ca-${i}`
                )) })
              ]
            },
            cIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-xl px-4 py-3 text-sm ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: feedbackMsg
            }
          ),
          phase === "connect" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-xl px-4 py-2 border border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Tap a star, then tap another to connect them. Lines drawn:",
            " ",
            drawnLines.length,
            "/",
            current.connections.length
          ] }) })
        ] })
      ]
    }
  );
}
function SpaceExplorer({ config, onGameEnd }) {
  const missionList = MISSIONS;
  const [phase, setPhase] = reactExports.useState("start");
  const [mIdx, setMIdx] = reactExports.useState(0);
  const [stageIdx, setStageIdx] = reactExports.useState(0);
  const [resources, setResources] = reactExports.useState(3);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          completed
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  const currentMission = missionList[mIdx % missionList.length];
  const currentStage = currentMission.stages[stageIdx];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("briefing");
    startTimer();
  }
  function handleAnswer(idx) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (idx === currentStage.correct) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${currentStage.scienceFact}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${currentStage.scienceFact}`);
      setResources((r) => {
        const nr = r - 1;
        if (nr <= 0) {
          endGame(false);
        }
        return nr;
      });
    }
    setPhase("feedback");
    setTimeout(() => {
      setFlash("idle");
      setFeedbackMsg("");
      const nextStage = stageIdx + 1;
      if (nextStage >= currentMission.stages.length) {
        const nextM = mIdx + 1;
        if (nextM >= missionList.length) endGame(true);
        else {
          setMIdx(nextM);
          setStageIdx(0);
          setResources(3);
          setPhase("briefing");
        }
      } else {
        setStageIdx(nextStage);
        setPhase("briefing");
      }
    }, 2200);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "space_explorer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#7c3aed" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Resources:" }),
            Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-3 h-3 rounded-full",
                style: {
                  background: i < resources ? "#f59e0b" : "rgba(255,255,255,0.15)"
                }
              },
              `res-${i}`
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Mission ",
            mIdx + 1,
            "/",
            missionList.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        phase === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Rocket,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#7c3aed" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#7c3aed",
                    textShadow: "0 0 20px rgba(124,58,237,0.6)"
                  },
                  children: "Space Explorer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 text-sm", children: [
                "Complete ",
                missionList.length,
                " space missions. Answer 5 questions per mission. Run out of resources = mission abort!"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "space_explorer.start_button",
                  children: "Begin Missions"
                }
              )
            ] })
          }
        ),
        (phase === "briefing" || phase === "question" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#7c3aed]/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs uppercase tracking-widest font-bold",
                  style: {
                    color: "#7c3aed",
                    fontFamily: "'Orbitron',sans-serif"
                  },
                  children: currentMission.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Stage ",
                stageIdx + 1,
                "/",
                currentMission.stages.length
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: {
                  width: `${stageIdx / currentMission.stages.length * 100}%`,
                  background: "linear-gradient(90deg, #7c3aed, #f59e0b)"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mt-3", children: currentStage.briefing })
          ] }),
          phase === "briefing" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              size: "md",
              onClick: () => setPhase("question"),
              "data-ocid": "space_explorer.proceed_button",
              children: "Proceed to Science Check"
            }
          ),
          (phase === "question" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-4", children: currentStage.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: currentStage.answers.map((ans, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "text-left px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all",
                    onClick: () => handleAnswer(i),
                    "data-ocid": `space_explorer.answer.${i}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs mr-2 opacity-60", children: [
                        String.fromCharCode(65 + i),
                        "."
                      ] }),
                      ans
                    ]
                  },
                  `ans-${i}`
                )) })
              ]
            },
            stageIdx
          ) }),
          feedbackMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: `rounded-xl px-4 py-3 text-sm ${flash === "correct" ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30" : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30"}`,
              children: feedbackMsg
            }
          )
        ] })
      ]
    }
  );
}
export {
  SpaceScience as default
};
