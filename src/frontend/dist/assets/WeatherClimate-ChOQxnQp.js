import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { C as Cloud } from "./cloud-CfXUYkEF.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
];
const Wind = createLucideIcon("wind", __iconNode);
const D1_ROUNDS = [
  {
    pressure: 1025,
    tempC: 28,
    humidity: 35,
    windKph: 10,
    correct: "sunny",
    explanation: "High pressure (1025 hPa) and low humidity (35%) produce clear sunny skies."
  },
  {
    pressure: 1008,
    tempC: 18,
    humidity: 65,
    windKph: 20,
    correct: "partly cloudy",
    explanation: "Moderate pressure and humidity result in partly cloudy conditions."
  },
  {
    pressure: 998,
    tempC: 15,
    humidity: 80,
    windKph: 35,
    correct: "cloudy",
    explanation: "Low pressure (998 hPa) with high humidity (80%) produces overcast skies."
  },
  {
    pressure: 985,
    tempC: 12,
    humidity: 90,
    windKph: 50,
    correct: "rainy",
    explanation: "Very low pressure (985 hPa) and high humidity (90%) indicate rain."
  },
  {
    pressure: 968,
    tempC: 8,
    humidity: 98,
    windKph: 90,
    correct: "stormy",
    explanation: "Extremely low pressure (968 hPa) and 90+ kph winds indicate a storm."
  },
  {
    pressure: 1020,
    tempC: 24,
    humidity: 45,
    windKph: 15,
    correct: "sunny",
    explanation: "High pressure systems push moisture away — ideal for sunshine."
  },
  {
    pressure: 1010,
    tempC: 20,
    humidity: 70,
    windKph: 25,
    correct: "partly cloudy",
    explanation: "Slightly below normal pressure with moderate humidity: partly cloudy."
  },
  {
    pressure: 994,
    tempC: 14,
    humidity: 85,
    windKph: 40,
    correct: "rainy",
    explanation: "Low pressure trough draws in moisture — rain expected."
  },
  {
    pressure: 975,
    tempC: 10,
    humidity: 95,
    windKph: 75,
    correct: "stormy",
    explanation: "Depression system with very high humidity and high winds: storm conditions."
  },
  {
    pressure: 1003,
    tempC: 17,
    humidity: 75,
    windKph: 30,
    correct: "cloudy",
    explanation: "Below average pressure and elevated humidity: overcast but dry."
  }
];
const D2_ROUNDS = [
  {
    pressure: 1030,
    tempC: 32,
    humidity: 25,
    windKph: 5,
    correct: "sunny",
    front: "High Pressure Anticyclone",
    explanation: "Anticyclone: diverging air sinks, warms, produces clear sky."
  },
  {
    pressure: 980,
    tempC: 9,
    humidity: 92,
    windKph: 65,
    correct: "stormy",
    front: "Deep Low Pressure System",
    explanation: "Deep depression: rapidly rising warm air cools, heavy precipitation."
  },
  {
    pressure: 1e3,
    tempC: 15,
    humidity: 78,
    windKph: 35,
    correct: "rainy",
    front: "Warm Front",
    explanation: "Warm front: warm moist air rises over cold air, steady rain."
  },
  {
    pressure: 996,
    tempC: 11,
    humidity: 85,
    windKph: 55,
    correct: "stormy",
    front: "Cold Front",
    explanation: "Cold front: fast-moving cold air undercuts warm air, thunderstorms."
  },
  {
    pressure: 1012,
    tempC: 22,
    humidity: 60,
    windKph: 20,
    correct: "partly cloudy",
    front: "Occluded Front",
    explanation: "Occluded front: cold front catches warm front, cloud and light rain."
  },
  {
    pressure: 1018,
    tempC: 26,
    humidity: 40,
    windKph: 12,
    correct: "sunny",
    front: "Subtropical High",
    explanation: "Subtropical high pressure belt: dry, sunny, tropical conditions."
  },
  {
    pressure: 985,
    tempC: 13,
    humidity: 88,
    windKph: 48,
    correct: "rainy",
    front: "Polar Front",
    explanation: "Polar front low: convergence of polar and tropical air masses, rain."
  },
  {
    pressure: 970,
    tempC: 7,
    humidity: 96,
    windKph: 100,
    correct: "stormy",
    front: "Tropical Cyclone",
    explanation: "Tropical cyclone: intense low pressure, extreme winds, heavy rain."
  },
  {
    pressure: 1007,
    tempC: 19,
    humidity: 72,
    windKph: 28,
    correct: "cloudy",
    front: "Stationary Front",
    explanation: "Stationary front: prolonged cloud cover with possible drizzle."
  },
  {
    pressure: 1022,
    tempC: 29,
    humidity: 30,
    windKph: 8,
    correct: "sunny",
    front: "Ridge of High Pressure",
    explanation: "Ridge extension of anticyclone: warm, dry, and sunny."
  }
];
const D3_ROUNDS = [
  {
    pressure: 960,
    tempC: 5,
    humidity: 99,
    windKph: 140,
    correct: "stormy",
    front: "Category 4 Hurricane",
    explanation: "Extreme low (960 hPa) with 140+ kph winds: major hurricane system."
  },
  {
    pressure: 1035,
    tempC: 35,
    humidity: 15,
    windKph: 5,
    correct: "sunny",
    front: "Saharan High",
    explanation: "Subtropical desert high: extreme heat, very low humidity, sunny."
  },
  {
    pressure: 990,
    tempC: 16,
    humidity: 82,
    windKph: 45,
    correct: "rainy",
    front: "Wave Cyclone",
    explanation: "Wave cyclone developing: poleward air flow creates rainfall."
  },
  {
    pressure: 978,
    tempC: 11,
    humidity: 94,
    windKph: 80,
    correct: "stormy",
    front: "Extratropical Cyclone",
    explanation: "Mature extratropical cyclone: comma cloud pattern, heavy precipitation."
  },
  {
    pressure: 1015,
    tempC: 21,
    humidity: 55,
    windKph: 18,
    correct: "partly cloudy",
    front: "Col (Saddle) Region",
    explanation: "Col region between two highs and two lows: variable, partly cloudy."
  }
];
const WEATHER_COLORS = {
  sunny: "#f59e0b",
  "partly cloudy": "#94a3b8",
  cloudy: "#64748b",
  rainy: "#00f5ff",
  stormy: "#7c3aed"
};
const ALL_WEATHERS = [
  "sunny",
  "partly cloudy",
  "cloudy",
  "rainy",
  "stormy"
];
const CLIMATE_ZONES_DATA = [
  {
    region: "Central Amazon Basin, Brazil",
    avgTemp: "27°C year-round",
    annualRain: "2200 mm/year",
    extraClue: "Dense rainforest, high biodiversity",
    correctZone: "Tropical",
    explanation: "High temperatures and very high rainfall year-round define the tropical zone."
  },
  {
    region: "Sahara Desert, North Africa",
    avgTemp: "30°C (summer 45°C)",
    annualRain: "25 mm/year",
    extraClue: "Sandy, sparse vegetation, extreme heat",
    correctZone: "Arid",
    explanation: "Less than 250mm annual rainfall defines an arid (desert) climate."
  },
  {
    region: "Paris, France",
    avgTemp: "11°C annual average",
    annualRain: "637 mm/year",
    extraClue: "Four seasons, deciduous forests",
    correctZone: "Temperate",
    explanation: "Mild temperatures and moderate rainfall year-round characterize temperate zones."
  },
  {
    region: "Moscow, Russia",
    avgTemp: "-5°C to +20°C seasonal range",
    annualRain: "700 mm/year",
    extraClue: "Severe winters, warm summers, taiga forest",
    correctZone: "Continental",
    explanation: "Continental zones have extreme seasonal temperature variation."
  },
  {
    region: "Antarctica Research Station",
    avgTemp: "-30°C annual average",
    annualRain: "166 mm/year (as snow)",
    extraClue: "Ice sheet, no trees, permafrost",
    correctZone: "Polar",
    explanation: "Polar regions have permanent ice and temperatures below 10°C even in warmest month."
  },
  {
    region: "Nairobi, Kenya",
    avgTemp: "18°C stable",
    annualRain: "860 mm/year",
    extraClue: "High altitude grasslands, safari wildlife",
    correctZone: "Tropical",
    explanation: "Nairobi's stable warm temperature and seasonal rains mark a tropical highland climate."
  },
  {
    region: "Gobi Desert, Mongolia",
    avgTemp: "Varies -30°C to +40°C",
    annualRain: "194 mm/year",
    extraClue: "Cold desert, extreme winter, steppe vegetation",
    correctZone: "Arid",
    explanation: "The Gobi is a cold arid desert with minimal precipitation."
  },
  {
    region: "Melbourne, Australia",
    avgTemp: "14°C annual average",
    annualRain: "648 mm/year",
    extraClue: "Four seasons, eucalyptus forests",
    correctZone: "Temperate",
    explanation: "Melbourne has mild, wet winters and warm, dry summers — typical temperate maritime."
  },
  {
    region: "Siberia, Russia",
    avgTemp: "-20°C winter, +15°C summer",
    annualRain: "500 mm/year",
    extraClue: "Permafrost, vast coniferous taiga",
    correctZone: "Continental",
    explanation: "Siberia has the most extreme continental climate on Earth."
  },
  {
    region: "Greenland Interior",
    avgTemp: "-32°C annual average",
    annualRain: "340 mm/year (snow)",
    extraClue: "Glacial ice sheet, no surface life",
    correctZone: "Polar",
    explanation: "Greenland's ice sheet marks one of the most extreme polar climates."
  },
  {
    region: "Singapore",
    avgTemp: "27°C stable",
    annualRain: "2340 mm/year",
    extraClue: "Equatorial, lush vegetation, no dry season",
    correctZone: "Tropical",
    explanation: "Singapore's equatorial location means consistent heat and heavy rainfall year-round."
  },
  {
    region: "Nevada Desert, USA",
    avgTemp: "16°C annual average",
    annualRain: "240 mm/year",
    extraClue: "Dry scrubland, cacti, intense sun",
    correctZone: "Arid",
    explanation: "Nevada's Great Basin is an arid region with very low annual precipitation."
  }
];
const CLIMATE_ZONE_TYPES = [
  "Tropical",
  "Arid",
  "Temperate",
  "Continental",
  "Polar"
];
const ZONE_COLORS = {
  Tropical: "#10b981",
  Arid: "#f59e0b",
  Temperate: "#22c55e",
  Continental: "#06b6d4",
  Polar: "#7c3aed"
};
const WATER_CYCLE_SLOTS = [
  {
    id: "evap",
    position: "Ocean surface → Atmosphere",
    description: "Water changes from liquid to vapour when heated by the sun",
    correctProcess: "Evaporation"
  },
  {
    id: "transp",
    position: "Plants → Atmosphere",
    description: "Plants release water vapour through their leaves",
    correctProcess: "Transpiration"
  },
  {
    id: "cond",
    position: "Vapour → Clouds",
    description: "Water vapour cools and turns back into tiny droplets forming clouds",
    correctProcess: "Condensation"
  },
  {
    id: "precip",
    position: "Clouds → Surface",
    description: "Water falls from clouds as rain, snow, sleet, or hail",
    correctProcess: "Precipitation"
  },
  {
    id: "runoff",
    position: "Surface → Rivers",
    description: "Water flows across the surface into streams and rivers",
    correctProcess: "Runoff"
  },
  {
    id: "infil",
    position: "Surface → Underground",
    description: "Water soaks into the soil and moves into groundwater reserves",
    correctProcess: "Infiltration"
  },
  {
    id: "coll",
    position: "Groundwater/Lakes → Oceans",
    description: "Water gathers in oceans, lakes, and aquifers",
    correctProcess: "Collection"
  }
];
const WATER_PROCESSES = [
  "Evaporation",
  "Transpiration",
  "Condensation",
  "Precipitation",
  "Runoff",
  "Infiltration",
  "Collection"
];
function WeatherClimate({ config, onGameEnd }) {
  const gameId = config.gameId;
  if (gameId === "climate-zones")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ClimateZones, { config, onGameEnd });
  if (gameId === "water-cycle")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(WaterCycle, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WeatherPredictor, { config, onGameEnd });
}
function WeatherPredictor({ config, onGameEnd }) {
  const rounds = config.difficulty === 1 ? D1_ROUNDS : config.difficulty === 2 ? D2_ROUNDS : D3_ROUNDS;
  const [phase, setPhase] = reactExports.useState("start");
  const [rIdx, setRIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
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
  const currentR = rounds[rIdx % rounds.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  const progressBarStyle = { width: `${progressPct}%` };
  const roundProgressStyle = { width: `${rIdx / rounds.length * 100}%` };
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("predict");
    startTimer();
  }
  function handlePredict(w) {
    if (flash !== "idle" || phase !== "predict") return;
    setTotal((t) => t + 1);
    if (w === currentR.correct) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(
        currentR.explanation + (currentR.front ? ` Front type: ${currentR.front}` : "")
      );
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Incorrect. Actual: ${currentR.correct.toUpperCase()}. ${currentR.explanation}`
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
      const nextIdx = rIdx + 1;
      if (nextIdx >= rounds.length) endGame(true);
      else {
        setRIdx(nextIdx);
        setPhase("predict");
      }
    }, 2200);
  }
  function getPressureColor(p) {
    return p >= 1020 ? "#10b981" : p >= 1e3 ? "#f59e0b" : p >= 980 ? "#f97316" : "#f43f5e";
  }
  function getTempColor(t) {
    return t >= 25 ? "#f43f5e" : t >= 15 ? "#f59e0b" : "#00f5ff";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "weather_climate.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: roundProgressStyle
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              rIdx,
              "/",
              rounds.length
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
            className: "flex-1 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-10 text-center max-w-md w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cloud,
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
                  children: "Meteorologist Mission"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Read pressure, temperature, humidity, and wind speed gauges. Predict the weather condition." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "weather_climate.start_button",
                  children: "Begin Forecast"
                }
              )
            ] })
          }
        ),
        (phase === "predict" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                className: `glass-card rounded-xl p-5 border-2 transition-all flex-1 ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest mb-4 text-muted-foreground",
                      style: { fontFamily: "'Orbitron',sans-serif" },
                      children: [
                        "Station Report — Round ",
                        rIdx + 1
                      ]
                    }
                  ),
                  currentR.front && config.difficulty >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mb-3 px-2 py-1 rounded border border-border/30 text-muted-foreground", children: currentR.front }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                    {
                      label: "Pressure",
                      value: `${currentR.pressure} hPa`,
                      color: getPressureColor(currentR.pressure),
                      pct: (currentR.pressure - 950) / 100 * 100
                    },
                    {
                      label: "Temperature",
                      value: `${currentR.tempC}°C`,
                      color: getTempColor(currentR.tempC),
                      pct: (currentR.tempC + 10) / 50 * 100
                    },
                    {
                      label: "Humidity",
                      value: `${currentR.humidity}%`,
                      color: currentR.humidity > 80 ? "#00f5ff" : "#10b981",
                      pct: currentR.humidity
                    },
                    {
                      label: "Wind Speed",
                      value: `${currentR.windKph} kph`,
                      color: currentR.windKph > 60 ? "#f43f5e" : "#f59e0b",
                      pct: Math.min(100, currentR.windKph)
                    }
                  ].map((gauge) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "glass rounded-lg p-3 border border-border/20",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: gauge.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-base font-mono font-bold mb-2",
                            style: { color: gauge.color },
                            children: gauge.value
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-full rounded-full transition-all duration-700",
                            style: {
                              width: `${Math.max(0, Math.min(100, gauge.pct))}%`,
                              background: gauge.color
                            }
                          }
                        ) })
                      ]
                    },
                    gauge.label
                  )) })
                ]
              },
              rIdx
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
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-48 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest px-1 text-muted-foreground",
                style: { fontFamily: "'Orbitron',sans-serif" },
                children: "Predict"
              }
            ),
            ALL_WEATHERS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "w-full px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all glass",
                style: {
                  borderColor: `${WEATHER_COLORS[w]}60`,
                  color: WEATHER_COLORS[w]
                },
                onClick: () => handlePredict(w),
                "data-ocid": `weather_climate.predict.${w.replace(" ", "_")}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wind, { className: "h-3 w-3 inline mr-2 opacity-70" }),
                  w.toUpperCase()
                ]
              },
              w
            ))
          ] })
        ] })
      ]
    }
  );
}
function ClimateZones({ config, onGameEnd }) {
  const totalQ = config.difficulty === 1 ? 8 : config.difficulty === 2 ? 10 : 12;
  const zoneList = CLIMATE_ZONES_DATA.slice(0, totalQ);
  const [phase, setPhase] = reactExports.useState("start");
  const [qIdx, setQIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
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
  const current = zoneList[qIdx % zoneList.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleZone(zone) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (zone === current.correctZone) {
      const pts = config.difficulty * 200;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${current.explanation}`);
    } else {
      setFlash("wrong");
      setFeedbackMsg(
        `Wrong. This is a ${current.correctZone} climate. ${current.explanation}`
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
      const next = qIdx + 1;
      if (next >= zoneList.length) endGame(true);
      else {
        setQIdx(next);
        setPhase("playing");
      }
    }, 2200);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "climate_zones.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#10b981" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            qIdx + 1,
            "/",
            zoneList.length
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
                Cloud,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#10b981" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#10b981",
                    textShadow: "0 0 20px rgba(16,185,129,0.6)"
                  },
                  children: "Climate Zones"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Regional climate data is shown. Classify each region as Tropical, Arid, Temperate, Continental, or Polar." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "climate_zones.start_button",
                  children: "Begin Classification"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-border/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                    style: { fontFamily: "'Orbitron',sans-serif" },
                    children: [
                      "Region ",
                      qIdx + 1
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-foreground mb-3", children: current.region }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg p-3 border border-border/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Average Temperature" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", style: { color: "#f59e0b" }, children: current.avgTemp })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-lg p-3 border border-border/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Annual Rainfall" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", style: { color: "#00f5ff" }, children: current.annualRain })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-lg p-2 border border-border/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: current.extraClue }) })
              ]
            },
            qIdx
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: CLIMATE_ZONE_TYPES.map((zone, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all",
              style: {
                borderColor: `${ZONE_COLORS[zone]}60`,
                color: ZONE_COLORS[zone]
              },
              onClick: () => handleZone(zone),
              "data-ocid": `climate_zones.zone.${i}`,
              children: zone
            },
            zone
          )) }),
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
function WaterCycle({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("start");
  const [slotIdx, setSlotIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState("idle");
  const [feedbackMsg, setFeedbackMsg] = reactExports.useState("");
  const [answeredSlots, setAnsweredSlots] = reactExports.useState(
    {}
  );
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
  const current = WATER_CYCLE_SLOTS[slotIdx % WATER_CYCLE_SLOTS.length];
  const progressPct = timeLeft / config.timeLimit * 100;
  WATER_PROCESSES.filter(
    (p) => !Object.values(answeredSlots).includes(p)
  );
  function handleStart() {
    startTimeRef.current = Date.now();
    gameOverRef.current = false;
    setPhase("playing");
    startTimer();
  }
  function handleProcess(proc) {
    if (flash !== "idle") return;
    setTotal((t) => t + 1);
    if (proc === current.correctProcess) {
      const pts = config.difficulty * 150;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setFlash("correct");
      setFeedbackMsg(`Correct! ${proc} is the right process here. +${pts} pts`);
      setAnsweredSlots((prev) => ({ ...prev, [current.id]: proc }));
    } else {
      setFlash("wrong");
      setFeedbackMsg(`Wrong. This process is ${current.correctProcess}.`);
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
      const next = slotIdx + 1;
      if (next >= WATER_CYCLE_SLOTS.length) endGame(true);
      else {
        setSlotIdx(next);
        setPhase("playing");
      }
    }, 1800);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2 select-none",
      "data-ocid": "water_cycle.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#06b6d4" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            slotIdx + 1,
            "/",
            WATER_CYCLE_SLOTS.length
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
                Cloud,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#06b6d4" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: {
                    fontFamily: "'Orbitron',sans-serif",
                    color: "#06b6d4",
                    textShadow: "0 0 20px rgba(6,182,212,0.6)"
                  },
                  children: "Water Cycle"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Each step in the water cycle is described. Select the correct process name that matches each step." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: handleStart,
                  "data-ocid": "water_cycle.start_button",
                  children: "Begin Cycle"
                }
              )
            ] })
          }
        ),
        (phase === "playing" || phase === "feedback") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                style: { fontFamily: "'Orbitron',sans-serif" },
                children: "Cycle Progress"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: WATER_CYCLE_SLOTS.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs px-2 py-0.5 rounded font-medium transition-all",
                style: answeredSlots[slot.id] ? {
                  background: "#06b6d420",
                  color: "#06b6d4",
                  border: "1px solid #06b6d460"
                } : {
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)"
                },
                children: answeredSlots[slot.id] ?? "?"
              },
              slot.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              className: `glass-card rounded-xl p-5 border-2 transition-all ${flash === "correct" ? "border-[#10b981]" : flash === "wrong" ? "border-[#f43f5e]" : "border-[#06b6d4]/40"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
                    style: { fontFamily: "'Orbitron',sans-serif" },
                    children: [
                      "Step ",
                      slotIdx + 1,
                      " — ",
                      current.position
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-4", children: current.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Which water cycle process is this?" })
              ]
            },
            slotIdx
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: WATER_PROCESSES.map((proc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "px-4 py-3 rounded-lg border-2 border-border/30 text-sm text-muted-foreground hover:border-[#06b6d4] hover:text-[#06b6d4] transition-all",
              style: {
                opacity: Object.values(answeredSlots).includes(proc) ? 0.4 : 1
              },
              onClick: () => handleProcess(proc),
              "data-ocid": `water_cycle.process.${i}`,
              children: proc
            },
            proc
          )) }),
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
  WeatherClimate as default
};
