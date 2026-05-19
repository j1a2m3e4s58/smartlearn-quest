import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { T as TrendingUp } from "./trending-up-BCF05R7n.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      key: "nnexq3"
    }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }]
];
const Leaf = createLucideIcon("leaf", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
const BASE_SPECIES = [
  {
    id: "grass",
    name: "Grass",
    role: "producer",
    eats: [],
    population: 500,
    maxPop: 1e3,
    icon: "G",
    color: "#4ade80"
  },
  {
    id: "shrub",
    name: "Shrub",
    role: "producer",
    eats: [],
    population: 200,
    maxPop: 500,
    icon: "S",
    color: "#22c55e"
  },
  {
    id: "rabbit",
    name: "Rabbit",
    role: "herbivore",
    eats: ["grass", "shrub"],
    population: 100,
    maxPop: 300,
    icon: "R",
    color: "#a78bfa"
  },
  {
    id: "deer",
    name: "Deer",
    role: "herbivore",
    eats: ["grass", "shrub"],
    population: 60,
    maxPop: 200,
    icon: "D",
    color: "#c084fc"
  },
  {
    id: "fox",
    name: "Fox",
    role: "carnivore",
    eats: ["rabbit"],
    population: 20,
    maxPop: 80,
    icon: "F",
    color: "#fb923c"
  },
  {
    id: "wolf",
    name: "Wolf",
    role: "carnivore",
    eats: ["deer", "rabbit"],
    population: 10,
    maxPop: 40,
    icon: "W",
    color: "#f43f5e"
  },
  {
    id: "mushroom",
    name: "Fungus",
    role: "decomposer",
    eats: [],
    population: 150,
    maxPop: 400,
    icon: "M",
    color: "#94a3b8"
  },
  {
    id: "bear",
    name: "Bear",
    role: "omnivore",
    eats: ["rabbit", "deer", "shrub"],
    population: 5,
    maxPop: 20,
    icon: "B",
    color: "#f59e0b"
  }
];
const PLANT_PART_QUESTIONS = [
  {
    question: "Which part of the plant absorbs water and minerals from the soil?",
    options: ["Leaf", "Stem", "Root", "Flower"],
    correct: 2,
    explanation: "Roots anchor the plant and absorb water and dissolved minerals."
  },
  {
    question: "Where does photosynthesis primarily occur?",
    options: ["Root", "Stem", "Flower", "Leaf"],
    correct: 3,
    explanation: "Leaves contain chloroplasts with chlorophyll for photosynthesis."
  },
  {
    question: "What function does the stem serve?",
    options: [
      "Absorbs sunlight",
      "Transports water and nutrients",
      "Produces seeds",
      "Attracts pollinators"
    ],
    correct: 1,
    explanation: "The stem conducts water/minerals upward and glucose downward."
  },
  {
    question: "What is the primary function of the flower?",
    options: [
      "Food storage",
      "Water absorption",
      "Reproduction",
      "Photosynthesis"
    ],
    correct: 2,
    explanation: "Flowers are the reproductive structures of flowering plants."
  },
  {
    question: "What gas do plants release during photosynthesis?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    correct: 2,
    explanation: "Photosynthesis produces oxygen as a byproduct: 6CO2 + 6H2O + light = C6H12O6 + 6O2"
  },
  {
    question: "What raw material do plants take in through their leaves for photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Water Vapour"],
    correct: 1,
    explanation: "CO2 enters leaves through tiny pores called stomata."
  },
  {
    question: "What is the green pigment in leaves called?",
    options: ["Carotenoid", "Melanin", "Chlorophyll", "Hemoglobin"],
    correct: 2,
    explanation: "Chlorophyll absorbs red and blue light, reflecting green."
  },
  {
    question: "What does a plant store as food after photosynthesis?",
    options: ["Starch and Glucose", "Fat", "Protein", "Minerals"],
    correct: 0,
    explanation: "Plants convert glucose to starch for long-term storage."
  },
  {
    question: "Which structure in plant cells carries out photosynthesis?",
    options: ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"],
    correct: 2,
    explanation: "Chloroplasts contain the thylakoid membranes where light reactions occur."
  },
  {
    question: "What happens to glucose produced during photosynthesis?",
    options: [
      "Exhaled as CO2",
      "Used for respiration and growth",
      "Converted to water",
      "Released as heat"
    ],
    correct: 1,
    explanation: "Glucose fuels cellular respiration and builds cell structures."
  }
];
const ANIMALS = [
  {
    name: "Dolphin",
    description: "Warm-blooded, breathes air, nurses young with milk",
    category: "Mammal",
    vertebrate: true
  },
  {
    name: "Eagle",
    description: "Has feathers, lays eggs, warm-blooded, two wings",
    category: "Bird",
    vertebrate: true
  },
  {
    name: "Crocodile",
    description: "Scaly skin, cold-blooded, lays eggs on land",
    category: "Reptile",
    vertebrate: true
  },
  {
    name: "Frog",
    description: "Moist skin, starts aquatic, lives on land as adult",
    category: "Amphibian",
    vertebrate: true
  },
  {
    name: "Salmon",
    description: "Has gills and fins, cold-blooded, lives in water",
    category: "Fish",
    vertebrate: true
  },
  {
    name: "Butterfly",
    description: "Six legs, three body segments, exoskeleton, wings",
    category: "Insect",
    vertebrate: false
  },
  {
    name: "Lion",
    description: "Warm-blooded, has fur, nurses young, gives live birth",
    category: "Mammal",
    vertebrate: true
  },
  {
    name: "Penguin",
    description: "Has feathers, warm-blooded, cannot fly, swims well",
    category: "Bird",
    vertebrate: true
  },
  {
    name: "Python",
    description: "Scaly, cold-blooded, no limbs, egg-laying",
    category: "Reptile",
    vertebrate: true
  },
  {
    name: "Salamander",
    description: "Smooth moist skin, breathes through gills as larva",
    category: "Amphibian",
    vertebrate: true
  },
  {
    name: "Clownfish",
    description: "Aquatic, has scales and fins, breathes through gills",
    category: "Fish",
    vertebrate: true
  },
  {
    name: "Ant",
    description: "Six legs, three segments, exoskeleton, social colony",
    category: "Insect",
    vertebrate: false
  },
  {
    name: "Bat",
    description: "Warm-blooded, has wings made of skin, nurses young",
    category: "Mammal",
    vertebrate: true
  },
  {
    name: "Parrot",
    description: "Has feathers, beak, lays eggs, warm-blooded",
    category: "Bird",
    vertebrate: true
  },
  {
    name: "Gecko",
    description: "Has scales, cold-blooded, climbs walls with toe pads",
    category: "Reptile",
    vertebrate: true
  },
  {
    name: "Axolotl",
    description: "Aquatic salamander with external gills, neotenic",
    category: "Amphibian",
    vertebrate: true
  },
  {
    name: "Shark",
    description: "Cartilaginous fish, cold-blooded, powerful predator",
    category: "Fish",
    vertebrate: true
  },
  {
    name: "Beetle",
    description: "Six legs, hard wing cases (elytra), exoskeleton",
    category: "Insect",
    vertebrate: false
  },
  {
    name: "Elephant",
    description: "Largest land animal, warm-blooded, long gestation",
    category: "Mammal",
    vertebrate: true
  },
  {
    name: "Dragonfly",
    description: "Four wings, six legs, compound eyes, aquatic larva",
    category: "Insect",
    vertebrate: false
  }
];
const CATEGORIES = ["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Insect"];
function PlantsAnimals({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "plant-scientist")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PlantScientist, { config, onGameEnd });
  if (gameId === "classification-expert")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ClassificationExpert, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(EcosystemArchitect, { config, onGameEnd });
}
function EcosystemArchitect({ config, onGameEnd }) {
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [species, setSpecies] = reactExports.useState(() => {
    const count = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 6 : 8;
    return BASE_SPECIES.slice(0, count).map((s) => ({ ...s }));
  });
  const [connections, setConnections] = reactExports.useState([]);
  const [dragging, setDragging] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [tick, setTick] = reactExports.useState(0);
  const [events, setEvents] = reactExports.useState([]);
  const [stability, setStability] = reactExports.useState(100);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const stabilityRef = reactExports.useRef(stability);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  stabilityRef.current = stability;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : stabilityRef.current;
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
  function simulateEcosystem() {
    setSpecies((prev) => {
      const next = prev.map((s) => ({ ...s }));
      const msgs = [];
      for (const sp of next) {
        if (sp.role === "producer") {
          sp.population = Math.min(sp.maxPop, sp.population + 30);
        } else if (sp.role === "decomposer") {
          sp.population = Math.min(sp.maxPop, sp.population + 10);
        } else {
          const prey = sp.eats.map((eid) => next.find((s) => s.id === eid)).filter(Boolean);
          const totalPreyPop = prey.reduce((s, p) => s + p.population, 0);
          const connected = connections.some(
            (c) => sp.eats.includes(c.from) && c.to === sp.id || c.from === sp.id
          );
          if (totalPreyPop > 50 && connected) {
            sp.population = Math.min(
              sp.maxPop,
              sp.population + Math.floor(totalPreyPop * 0.05)
            );
            for (const p of prey)
              p.population = Math.max(
                0,
                p.population - Math.floor(sp.population * 0.2)
              );
          } else {
            sp.population = Math.max(
              0,
              sp.population - Math.floor(sp.population * 0.15)
            );
            if (sp.population === 0) msgs.push(`${sp.name} went extinct!`);
          }
        }
      }
      const extinct = next.filter(
        (s) => s.population === 0 && s.role !== "producer"
      ).length;
      const newStability = Math.max(0, 100 - extinct * 20);
      if (newStability < stabilityRef.current) {
        setScore((s) => Math.max(0, s - 50));
        setEvents(msgs);
      } else {
        setScore((s) => s + config.difficulty * 30);
        setCorrect((c) => c + 1);
      }
      setTotal((t) => t + 1);
      setStability(newStability);
      if (newStability === 0) endGame(false);
      setTick((t) => t + 1);
      return next;
    });
  }
  function handleConnect(from, to) {
    if (from === to) return;
    const exists = connections.some((c) => c.from === from && c.to === to);
    if (exists) return;
    const fromSp = species.find((s) => s.id === from);
    const toSp = species.find((s) => s.id === to);
    if (!fromSp || !toSp) return;
    const valid = toSp.eats.includes(from) || fromSp.eats.includes(to);
    if (valid) {
      setConnections((cs) => [...cs, { from, to }]);
      setScore((s) => s + config.difficulty * 100);
      setCorrect((c) => c + 1);
    } else {
      setScore((s) => Math.max(0, s - 30));
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
    }
    setTotal((t) => t + 1);
  }
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setGameStarted(true);
    startTimer();
    const interval = setInterval(() => {
      if (gameOverRef.current) {
        clearInterval(interval);
        return;
      }
      simulateEcosystem();
    }, 3e3);
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  const stabilityColor = stability > 60 ? "#10b981" : stability > 30 ? "#f59e0b" : "#f43f5e";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "plants_animals.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#4ade80" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Ecosystem:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: { width: `${stability}%`, background: stabilityColor }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-xs tabular-nums",
                style: { color: stabilityColor },
                children: [
                  stability,
                  "%"
                ]
              }
            )
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
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Leaf,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#4ade80" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#4ade80",
                    textShadow: "0 0 20px rgba(74,222,128,0.6)"
                  },
                  children: "Ecosystem Architect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Connect producers to consumers to predators. Build a balanced food web." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Drag from one species to another to create a food chain link. Keep the ecosystem stable." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "plants_animals.start_button",
                  children: "Build Ecosystem"
                }
              )
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 glass rounded-xl border border-border/30 p-4 overflow-hidden relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "absolute inset-0 w-full h-full pointer-events-none",
                style: { zIndex: 5 },
                children: connections.map((c, i) => {
                  var _a;
                  const fromEl = document.getElementById(`sp-${c.from}`);
                  const toEl = document.getElementById(`sp-${c.to}`);
                  if (!fromEl || !toEl) return null;
                  const fr = fromEl.getBoundingClientRect();
                  const tr = toEl.getBoundingClientRect();
                  const container = (_a = fromEl.closest(".glass")) == null ? void 0 : _a.getBoundingClientRect();
                  if (!container) return null;
                  const x1 = fr.left + fr.width / 2 - container.left;
                  const y1 = fr.top + fr.height / 2 - container.top;
                  const x2 = tr.left + tr.width / 2 - container.left;
                  const y2 = tr.top + tr.height / 2 - container.top;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "line",
                    {
                      x1,
                      y1,
                      x2,
                      y2,
                      stroke: "#4ade8080",
                      strokeWidth: "2",
                      strokeDasharray: "4 2"
                    },
                    `conn-${i}`
                  );
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3 h-full content-start", children: species.map((sp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                id: `sp-${sp.id}`,
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: sp.population > 0 ? 1 : 0.3, scale: 1 },
                className: "glass-card rounded-xl p-3 cursor-grab border-2 transition-all",
                style: {
                  borderColor: dragging === sp.id ? sp.color : `${sp.color}40`
                },
                draggable: true,
                onDragStart: () => setDragging(sp.id),
                onDragOver: (e) => e.preventDefault(),
                onDrop: () => {
                  if (dragging && dragging !== sp.id) {
                    handleConnect(dragging, sp.id);
                    setDragging(null);
                  }
                },
                "data-ocid": `plants_animals.species.${sp.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center font-black text-lg",
                      style: {
                        background: `${sp.color}20`,
                        color: sp.color,
                        border: `2px solid ${sp.color}60`
                      },
                      children: sp.icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground", children: sp.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize", children: sp.role }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all duration-500",
                      style: {
                        width: `${sp.population / sp.maxPop * 100}%`,
                        background: sp.color
                      }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                    sp.population,
                    " pop"
                  ] })
                ] })
              },
              sp.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-52 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground", children: "Instructions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Drag species cards to connect them. Producer feeds Herbivore feeds Carnivore." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground", children: [
                "Tick ",
                tick
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3", style: { color: "#4ade80" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Connections: ",
                  connections.length
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: events.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: "text-xs mt-1",
                  style: { color: "#f43f5e" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "inline h-3 w-3 mr-1" }),
                    e
                  ]
                },
                `ev-${i}`
              )) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
const PHOTO_INPUTS = ["Water", "CO2", "Sunlight", "Chlorophyll"];
const PHOTO_OUTPUTS = ["Glucose", "Oxygen"];
const PHOTO_BOTH = [...PHOTO_INPUTS, ...PHOTO_OUTPUTS];
function PlantScientist({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [placedInputs, setPlacedInputs] = reactExports.useState([]);
  const [placedOutputs, setPlacedOutputs] = reactExports.useState([]);
  const [equationDone, setEquationDone] = reactExports.useState(false);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [draggingTile, setDraggingTile] = reactExports.useState(null);
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
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("equation");
    startTimer();
  }
  function dropToSide(side) {
    if (!draggingTile) return;
    const tile = draggingTile;
    if (side === "input") {
      if (PHOTO_INPUTS.includes(tile) && !placedInputs.includes(tile)) {
        setPlacedInputs((prev) => [...prev, tile]);
        setScore((s) => s + config.difficulty * 80);
        setCorrect((c) => c + 1);
      } else {
        setScore((s) => Math.max(0, s - 30));
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return nl;
        });
      }
    } else {
      if (PHOTO_OUTPUTS.includes(tile) && !placedOutputs.includes(tile)) {
        setPlacedOutputs((prev) => [...prev, tile]);
        setScore((s) => s + config.difficulty * 80);
        setCorrect((c) => c + 1);
      } else {
        setScore((s) => Math.max(0, s - 30));
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) endGame(false);
          return nl;
        });
      }
    }
    setTotal((t) => t + 1);
    setDraggingTile(null);
    if (placedInputs.length + (PHOTO_INPUTS.includes(tile) ? 1 : 0) >= PHOTO_INPUTS.length && placedOutputs.length + (PHOTO_OUTPUTS.includes(tile) ? 1 : 0) >= PHOTO_OUTPUTS.length) {
      setEquationDone(true);
      setTimeout(() => setPhase("quiz"), 800);
    }
  }
  function handleAnswer(idx) {
    if (flash !== "idle") return;
    const q = PLANT_PART_QUESTIONS[qIdx % PLANT_PART_QUESTIONS.length];
    setTotal((t) => t + 1);
    if (idx === q.correct) {
      const pts = config.difficulty * 120;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${q.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. ${q.explanation}`);
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
      const next = qIdx + 1;
      if (next >= 10) endGame(true);
      else {
        setQIdx(next);
        setPhase("quiz");
      }
    }, 1800);
  }
  const currentQ = PLANT_PART_QUESTIONS[qIdx % PLANT_PART_QUESTIONS.length];
  const availableTiles = PHOTO_BOTH.filter(
    (t) => !placedInputs.includes(t) && !placedOutputs.includes(t)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "plant_scientist.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#22c55e" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: phase === "quiz" || phase === "feedback" ? `Q${qIdx + 1}/10` : "Equation" }),
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
                Leaf,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#22c55e" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#22c55e",
                    textShadow: "0 0 20px rgba(34,197,94,0.6)"
                  },
                  children: "Plant Scientist"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Drag tiles to complete the photosynthesis equation, then answer 10 questions about plant parts." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "plant_scientist.start_button",
                  children: "Start Lab"
                }
              )
            ] })
          }
        ),
        phase === "equation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground mb-4",
                style: { fontFamily: "'Orbitron',sans-serif" },
                children: "Photosynthesis Equation — Drag tiles to correct side"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "INPUTS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "min-h-16 w-40 rounded-xl border-2 border-dashed border-[#22c55e]/40 p-2 flex flex-wrap gap-1 items-start",
                    onDragOver: (e) => e.preventDefault(),
                    onDrop: () => dropToSide("input"),
                    children: placedInputs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "px-2 py-1 rounded text-xs font-bold",
                        style: { background: "#22c55e20", color: "#22c55e" },
                        children: t
                      },
                      t
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-full border-2 border-[#f59e0b]/60 flex items-center justify-center",
                    style: { background: "#f59e0b20" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-black text-xs", children: "Light" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-black text-lg", children: "->" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "OUTPUTS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "min-h-16 w-40 rounded-xl border-2 border-dashed border-[#06b6d4]/40 p-2 flex flex-wrap gap-1 items-start",
                    onDragOver: (e) => e.preventDefault(),
                    onDrop: () => dropToSide("output"),
                    children: placedOutputs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "px-2 py-1 rounded text-xs font-bold",
                        style: { background: "#06b6d420", color: "#06b6d4" },
                        children: t
                      },
                      t
                    ))
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: availableTiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              draggable: true,
              onDragStart: () => setDraggingTile(t),
              className: "px-3 py-2 rounded-lg border-2 border-border/40 text-sm font-bold cursor-grab text-foreground hover:border-[#22c55e] transition-all",
              children: t
            },
            t
          )) }),
          equationDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl px-4 py-3 text-center text-sm font-bold",
              style: {
                background: "#22c55e20",
                color: "#22c55e",
                border: "2px solid #22c55e60"
              },
              children: "Equation complete! Moving to plant questions..."
            }
          )
        ] }),
        (phase === "quiz" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: [
                  "Plant Biology — Question ",
                  qIdx + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-5", children: currentQ.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: currentQ.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#22c55e] hover:text-[#22c55e] transition-all",
                    onClick: () => handleAnswer(i),
                    "data-ocid": `plant_scientist.answer.${i}`,
                    children: opt
                  },
                  `opt-${i}`
                )) })
              ]
            },
            qIdx
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
function ClassificationExpert({ config, onGameEnd }) {
  const animalCount = config.difficulty === 1 ? 12 : 16;
  const animalList = ANIMALS.slice(0, animalCount);
  const [phase, setPhase] = reactExports.useState("start");
  const [aIdx, setAIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [chosenCategory, setChosenCategory] = reactExports.useState("");
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
  const currentA = animalList[aIdx % animalList.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("classify");
    startTimer();
  }
  function handleCategorySelect(cat) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    setChosenCategory(cat);
    if (cat === currentA.category) {
      setScore((s) => s + config.difficulty * 120);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${currentA.name} is a ${currentA.category}. Now classify its vertebrate status.`
      );
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("vertebrate");
      }, 1e3);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. ${currentA.name} is a ${currentA.category}. Try the vertebrate question.`
      );
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) endGame(false);
        return nl;
      });
      setTimeout(() => {
        setFlash("idle");
        setFeedbackMsg("");
        setPhase("vertebrate");
      }, 1500);
    }
  }
  function handleVertebrate(isVert) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    const correct_ans = currentA.vertebrate;
    if (isVert === correct_ans) {
      const pts = config.difficulty * (chosenCategory === currentA.category ? 180 : 90);
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        `Correct! ${currentA.name} is ${correct_ans ? "a vertebrate" : "an invertebrate"}. +${pts} pts`
      );
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. ${currentA.name} is ${correct_ans ? "a vertebrate" : "an invertebrate"}.`
      );
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
      setChosenCategory("");
      const next = aIdx + 1;
      if (next >= animalList.length) endGame(true);
      else {
        setAIdx(next);
        setPhase("classify");
      }
    }, 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "classification_expert.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#a78bfa" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            aIdx + 1,
            "/",
            animalList.length
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
                Leaf,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#a78bfa" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#a78bfa",
                    textShadow: "0 0 20px rgba(167,139,250,0.6)"
                  },
                  children: "Classification Expert"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 text-sm", children: [
                "Classify ",
                animalList.length,
                " animals by type (Mammal/Bird/Reptile/etc.) then by vertebrate status."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "classification_expert.start_button",
                  children: "Start Sorting"
                }
              )
            ] })
          }
        ),
        (phase === "classify" || phase === "vertebrate" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -30 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h3",
                  {
                    className: "text-2xl font-black mb-1",
                    style: { color: "#a78bfa" },
                    children: currentA.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: currentA.description }),
                phase === "classify" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Classify this animal:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: CATEGORIES.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "px-3 py-2 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#a78bfa] hover:text-[#a78bfa] transition-all",
                      onClick: () => handleCategorySelect(cat),
                      "data-ocid": `classification_expert.category.${i}`,
                      children: cat
                    },
                    cat
                  )) })
                ] }),
                (phase === "vertebrate" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Is this animal a vertebrate or invertebrate?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "flex-1 py-3 rounded-xl border-2 border-border/30 text-sm font-bold text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all",
                        onClick: () => handleVertebrate(true),
                        "data-ocid": "classification_expert.vertebrate_yes",
                        children: "Vertebrate"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "flex-1 py-3 rounded-xl border-2 border-border/30 text-sm font-bold text-muted-foreground hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all",
                        onClick: () => handleVertebrate(false),
                        "data-ocid": "classification_expert.vertebrate_no",
                        children: "Invertebrate"
                      }
                    )
                  ] })
                ] })
              ]
            },
            aIdx
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
  PlantsAnimals as default
};
