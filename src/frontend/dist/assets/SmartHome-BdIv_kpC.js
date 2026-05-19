import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, Z as Zap, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
const EVENT_LABELS = {
  motion: "Motion Detected",
  temperature: "Temp > 30 C",
  time: "Time = 8:00 PM",
  door: "Door Unlocked",
  rain: "Rain Detected",
  brightness: "Brightness < 20%"
};
const ACTION_LABELS = {
  lights_on: "Turn Lights ON",
  lights_off: "Turn Lights OFF",
  fan_on: "Activate Fan",
  fan_off: "Turn Fan OFF",
  lock_door: "Lock Door",
  unlock_door: "Unlock Door",
  send_alert: "Send Security Alert",
  play_music: "Play Welcome Music",
  sprinkler_on: "Activate Sprinklers"
};
const EVENT_COLORS = {
  motion: "#f43f5e",
  temperature: "#f59e0b",
  time: "#7c3aed",
  door: "#10b981",
  rain: "#00f5ff",
  brightness: "#e879f9"
};
const ACTION_COLORS = {
  lights_on: "#f59e0b",
  lights_off: "#374151",
  fan_on: "#00f5ff",
  fan_off: "#374151",
  lock_door: "#f43f5e",
  unlock_door: "#10b981",
  send_alert: "#f43f5e",
  play_music: "#7c3aed",
  sprinkler_on: "#00f5ff"
};
const AUTOMATION_CHALLENGES = {
  1: [
    {
      id: "c1",
      description: "Security System",
      scenario: "When someone enters a dark room, the lights should automatically turn on.",
      requiredCondition: "motion",
      requiredAction: "lights_on",
      conditionOptions: ["motion", "time", "temperature", "brightness"],
      actionOptions: ["lights_on", "fan_on", "lock_door", "send_alert"],
      explanation: "Motion detection triggers lights ON — classic smart home automation rule.",
      testEventLabel: "Someone walks into the dark room"
    },
    {
      id: "c2",
      description: "Evening Ambiance",
      scenario: "At 8:00 PM every evening, relaxing music should start playing automatically.",
      requiredCondition: "time",
      requiredAction: "play_music",
      conditionOptions: ["time", "motion", "door", "rain"],
      actionOptions: ["play_music", "lights_off", "fan_on", "send_alert"],
      explanation: "Time-based triggers automate routine actions — the backbone of smart scheduling.",
      testEventLabel: "Clock reaches 8:00 PM"
    },
    {
      id: "c3",
      description: "Temperature Control",
      scenario: "When temperature exceeds 30 C, the cooling fan should activate immediately.",
      requiredCondition: "temperature",
      requiredAction: "fan_on",
      conditionOptions: ["temperature", "brightness", "time", "motion"],
      actionOptions: ["fan_on", "lights_on", "play_music", "lock_door"],
      explanation: "Temperature sensors trigger HVAC actions — smart home energy management.",
      testEventLabel: "Temperature sensor reads 31 C"
    }
  ],
  2: [
    {
      id: "c4",
      description: "Burglary Prevention",
      scenario: "If the front door unlocks unexpectedly, immediately send a security alert.",
      requiredCondition: "door",
      requiredAction: "send_alert",
      conditionOptions: ["door", "motion", "rain", "brightness"],
      actionOptions: ["send_alert", "lights_on", "fan_off", "play_music"],
      explanation: "Door sensors trigger security alerts — IoT security automation pattern.",
      testEventLabel: "Front door lock sensor activates"
    },
    {
      id: "c5",
      description: "Garden Management",
      scenario: "When rain is detected, the garden sprinklers should activate to supplement watering.",
      requiredCondition: "rain",
      requiredAction: "sprinkler_on",
      conditionOptions: ["rain", "temperature", "time", "motion"],
      actionOptions: ["sprinkler_on", "fan_off", "lights_off", "lock_door"],
      explanation: "Rain sensors trigger irrigation — smart garden management.",
      testEventLabel: "Rain sensor detects precipitation"
    },
    {
      id: "c6",
      description: "Sundown Lighting",
      scenario: "When natural light drops below 20% brightness, lights should turn on automatically.",
      requiredCondition: "brightness",
      requiredAction: "lights_on",
      conditionOptions: ["brightness", "temperature", "door", "rain"],
      actionOptions: ["lights_on", "fan_on", "lock_door", "play_music"],
      explanation: "Light sensors automate lighting based on ambient conditions.",
      testEventLabel: "Ambient light sensor reads 15%"
    }
  ],
  3: [
    {
      id: "c7",
      description: "Night Mode",
      scenario: "At 8 PM when motion is detected, activate welcome music for guests.",
      requiredCondition: "time",
      requiredAction: "play_music",
      conditionOptions: ["time", "motion", "brightness", "door"],
      actionOptions: ["play_music", "send_alert", "fan_off", "sprinkler_on"],
      explanation: "Compound time+event rules create sophisticated smart home experiences.",
      testEventLabel: "Clock reaches 8 PM with motion present"
    },
    {
      id: "c8",
      description: "Emergency Response",
      scenario: "When temperature exceeds 30 C at night, lock all doors immediately.",
      requiredCondition: "temperature",
      requiredAction: "lock_door",
      conditionOptions: ["temperature", "brightness", "rain", "motion"],
      actionOptions: ["lock_door", "lights_on", "fan_on", "sprinkler_on"],
      explanation: "Emergency rules combine multiple conditions for safety-critical automation.",
      testEventLabel: "Temp rises to 35 C at midnight"
    }
  ]
};
function AutomatorGame({
  config,
  onGameEnd
}) {
  const challenges = AUTOMATION_CHALLENGES[config.difficulty];
  const [idx, setIdx] = reactExports.useState(0);
  const [selectedCondition, setSelectedCondition] = reactExports.useState(
    null
  );
  const [selectedAction, setSelectedAction] = reactExports.useState(null);
  const [tested, setTested] = reactExports.useState(false);
  const [testResult, setTestResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          correct / challenges.length * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, correct, challenges.length]
  );
  const challenge = challenges[idx];
  function handleTest() {
    if (!selectedCondition || !selectedAction) return;
    const allOk = selectedCondition === challenge.requiredCondition && selectedAction === challenge.requiredAction;
    setTested(true);
    setTestResult(allOk);
    if (allOk) {
      setScore((s) => s + 250 * config.difficulty);
      setCorrect((c) => c + 1);
      setTimeout(() => {
        const next = idx + 1;
        if (next >= challenges.length) {
          setTimeout(() => endGame(true), 400);
        } else {
          setIdx(next);
          setSelectedCondition(null);
          setSelectedAction(null);
          setTested(false);
          setTestResult(null);
        }
      }, 1600);
    } else {
      setTimeout(() => {
        setTested(false);
        setTestResult(null);
        setSelectedCondition(null);
        setSelectedAction(null);
      }, 2e3);
    }
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "smart_home.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                House,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#00f5ff" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
                  children: "Smart Home Automator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Build IF-THEN automation rules. Select the correct CONDITION that triggers an event, then select the correct ACTION to respond." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Simulate Event to test your rule. Correct rules earn points." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "smart_home.start_button",
                  children: "Configure System"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-4",
      "data-ocid": "smart_home.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#00f5ff" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" },
              children: [
                "Rule ",
                idx + 1,
                "/",
                challenges.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Solved: ",
            correct,
            "/",
            challenges.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 shrink-0 border border-[#00f5ff]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-[#00f5ff] font-bold mb-1",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: [
                "AUTOMATION CHALLENGE: ",
                challenge.description
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: challenge.scenario })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 glass-card rounded-xl p-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground mb-2",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "IF (Condition)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-xl border-2 px-4 py-3 min-h-12 flex items-center justify-center transition-all",
                style: {
                  borderColor: selectedCondition ? EVENT_COLORS[selectedCondition] : void 0,
                  borderStyle: selectedCondition ? "solid" : "dashed"
                },
                children: selectedCondition ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-bold",
                    style: { color: EVENT_COLORS[selectedCondition] },
                    children: EVENT_LABELS[selectedCondition]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Select a condition below" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[#00f5ff] font-black text-xl",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "THEN"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground mb-2",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "Action"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-xl border-2 px-4 py-3 min-h-12 flex items-center justify-center transition-all",
                style: {
                  borderColor: selectedAction ? ACTION_COLORS[selectedAction] : void 0,
                  borderStyle: selectedAction ? "solid" : "dashed"
                },
                children: selectedAction ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-bold",
                    style: { color: ACTION_COLORS[selectedAction] },
                    children: ACTION_LABELS[selectedAction]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Select an action below" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "CONDITIONS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: challenge.conditionOptions.map((cond) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.97 },
              onClick: () => setSelectedCondition(cond),
              className: "rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all text-left",
              style: {
                borderColor: selectedCondition === cond ? EVENT_COLORS[cond] : `${EVENT_COLORS[cond]}40`,
                backgroundColor: selectedCondition === cond ? `${EVENT_COLORS[cond]}20` : `${EVENT_COLORS[cond]}08`,
                color: EVENT_COLORS[cond]
              },
              "data-ocid": `smart_home.condition.${cond}`,
              children: EVENT_LABELS[cond]
            },
            cond
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "ACTIONS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: challenge.actionOptions.map((act) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.97 },
              onClick: () => setSelectedAction(act),
              className: "rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all text-left",
              style: {
                borderColor: selectedAction === act ? ACTION_COLORS[act] : `${ACTION_COLORS[act]}40`,
                backgroundColor: selectedAction === act ? `${ACTION_COLORS[act]}20` : `${ACTION_COLORS[act]}08`,
                color: ACTION_COLORS[act]
              },
              "data-ocid": `smart_home.action.${act}`,
              children: ACTION_LABELS[act]
            },
            act
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleTest,
            disabled: !selectedCondition || !selectedAction || tested,
            "data-ocid": "smart_home.simulate_button",
            children: [
              "Simulate: ",
              challenge.testEventLabel
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: tested && testResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 ${testResult ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              testResult ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e] shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: testResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981] font-bold", children: [
                "Correct! ",
                challenge.explanation
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f43f5e]", children: "Wrong combination. Read the scenario and try again." }) })
            ] })
          }
        ) })
      ]
    }
  );
}
const SENSOR_LABELS = {
  smoke: "Smoke Detector",
  motion: "Motion Sensor",
  door_contact: "Door Contact",
  temperature: "Temperature Sensor",
  water_leak: "Water Leak Detector"
};
const SENSOR_COLORS = {
  smoke: "#f43f5e",
  motion: "#f59e0b",
  door_contact: "#10b981",
  temperature: "#00f5ff",
  water_leak: "#7c3aed"
};
const ROOM_LABELS = {
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  hallway: "Hallway",
  bathroom: "Bathroom",
  living_room: "Living Room"
};
const SENSOR_ROOM_SCORES = {
  smoke: {
    kitchen: {
      pts: 100,
      reason: "Kitchen has highest fire/smoke risk from cooking"
    },
    bedroom: {
      pts: 50,
      reason: "Bedroom coverage is important but not primary risk"
    },
    hallway: {
      pts: 75,
      reason: "Hallway covers escape route — good secondary placement"
    },
    bathroom: { pts: 0, reason: "Bathroom steam causes false alarms" },
    living_room: { pts: 50, reason: "Living room coverage is acceptable" }
  },
  motion: {
    hallway: {
      pts: 100,
      reason: "Hallway catches all movement between rooms — ideal"
    },
    living_room: {
      pts: 75,
      reason: "Living room is high-traffic — good placement"
    },
    bedroom: {
      pts: 50,
      reason: "Bedroom motion is useful for occupancy detection"
    },
    kitchen: { pts: 50, reason: "Kitchen motion works for activity detection" },
    bathroom: {
      pts: 0,
      reason: "Bathroom motion invades privacy — not recommended"
    }
  },
  door_contact: {
    bedroom: {
      pts: 100,
      reason: "Bedroom entry door is primary security point"
    },
    hallway: { pts: 75, reason: "Hallway door is a key access point" },
    kitchen: { pts: 50, reason: "Kitchen exterior door is valid" },
    living_room: {
      pts: 75,
      reason: "Living room main door is a standard entry point"
    },
    bathroom: {
      pts: 25,
      reason: "Bathroom door contact has limited security value"
    }
  },
  temperature: {
    living_room: {
      pts: 100,
      reason: "Living room represents average home temperature best"
    },
    bedroom: {
      pts: 75,
      reason: "Bedroom temperature control is important for comfort"
    },
    kitchen: {
      pts: 50,
      reason: "Kitchen temps fluctuate from cooking — not representative"
    },
    hallway: { pts: 75, reason: "Hallway gives good average reading" },
    bathroom: { pts: 25, reason: "Bathroom temps are skewed by showers" }
  },
  water_leak: {
    bathroom: {
      pts: 100,
      reason: "Bathroom is primary water leak risk — toilet, shower, pipes"
    },
    kitchen: {
      pts: 100,
      reason: "Kitchen sink and dishwasher are major leak points"
    },
    hallway: {
      pts: 0,
      reason: "Hallway has no water sources — useless placement"
    },
    bedroom: { pts: 0, reason: "Bedroom has no water sources normally" },
    living_room: { pts: 25, reason: "Living room has minimal water risk" }
  }
};
const HOUSE_LAYOUTS = [
  {
    rooms: ["bedroom", "kitchen", "hallway", "bathroom", "living_room"],
    sensorsToPlace: [
      "smoke",
      "motion",
      "door_contact",
      "temperature",
      "water_leak"
    ]
  },
  {
    rooms: ["kitchen", "hallway", "bathroom", "living_room", "bedroom"],
    sensorsToPlace: [
      "water_leak",
      "smoke",
      "motion",
      "temperature",
      "door_contact"
    ]
  },
  {
    rooms: ["hallway", "bedroom", "kitchen", "living_room", "bathroom"],
    sensorsToPlace: [
      "motion",
      "temperature",
      "smoke",
      "water_leak",
      "door_contact"
    ]
  },
  {
    rooms: ["bathroom", "living_room", "kitchen", "hallway", "bedroom"],
    sensorsToPlace: [
      "water_leak",
      "door_contact",
      "smoke",
      "motion",
      "temperature"
    ]
  },
  {
    rooms: ["bedroom", "bathroom", "hallway", "kitchen", "living_room"],
    sensorsToPlace: [
      "temperature",
      "water_leak",
      "motion",
      "smoke",
      "door_contact"
    ]
  }
];
function SensorNetworkGame({
  config,
  onGameEnd
}) {
  const layoutCount = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [layoutIdx, setLayoutIdx] = reactExports.useState(0);
  const layout = HOUSE_LAYOUTS[layoutIdx % HOUSE_LAYOUTS.length];
  const [selectedSensor, setSelectedSensor] = reactExports.useState(null);
  const [placements, setPlacements] = reactExports.useState({
    bedroom: null,
    kitchen: null,
    hallway: null,
    bathroom: null,
    living_room: null
  });
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [roomScores, setRoomScores] = reactExports.useState({
    bedroom: null,
    kitchen: null,
    hallway: null,
    bathroom: null,
    living_room: null
  });
  const [score, setScore] = reactExports.useState(0);
  const [totalLayouts, setTotalLayouts] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = scoreRef.current / (500 * layoutCount) * 100;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.min(acc, 100),
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, layoutCount]
  );
  function handleRoomClick(room) {
    if (submitted || !selectedSensor) return;
    if (!layout.rooms.includes(room)) return;
    const alreadyPlaced = Object.values(placements).includes(selectedSensor);
    if (alreadyPlaced) {
      const newPlacements = { ...placements };
      for (const r of Object.keys(newPlacements)) {
        if (newPlacements[r] === selectedSensor) newPlacements[r] = null;
      }
      newPlacements[room] = selectedSensor;
      setPlacements(newPlacements);
    } else {
      setPlacements((prev) => ({ ...prev, [room]: selectedSensor }));
    }
  }
  function handleSubmit() {
    const scores = {
      bedroom: null,
      kitchen: null,
      hallway: null,
      bathroom: null,
      living_room: null
    };
    let roundScore = 0;
    for (const room of layout.rooms) {
      const sensor = placements[room];
      if (sensor) {
        const entry = SENSOR_ROOM_SCORES[sensor][room];
        scores[room] = entry;
        roundScore += entry.pts;
      } else {
        scores[room] = { pts: 0, reason: "No sensor placed here" };
      }
    }
    setRoomScores(scores);
    setSubmitted(true);
    const newScore = score + roundScore;
    setScore(newScore);
    scoreRef.current = newScore;
    setTimeout(() => {
      const next = totalLayouts + 1;
      setTotalLayouts(next);
      if (next >= layoutCount) {
        endGame(true);
      } else {
        setLayoutIdx((i) => i + 1);
        setPlacements({
          bedroom: null,
          kitchen: null,
          hallway: null,
          bathroom: null,
          living_room: null
        });
        setRoomScores({
          bedroom: null,
          kitchen: null,
          hallway: null,
          bathroom: null,
          living_room: null
        });
        setSubmitted(false);
        setSelectedSensor(null);
      }
    }, 3500);
  }
  const allSensorsPlaced = layout.sensorsToPlace.every(
    (s) => Object.values(placements).includes(s)
  );
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "sensor_network.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                House,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Sensor Network Design"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Drag sensors to rooms in the house blueprint. Each sensor type has an optimal placement based on safety and function." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mb-6", children: [
                "Select a sensor, then click a room to place it. Maximize your placement score across ",
                layoutCount,
                " house layouts."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "sensor_network.start_button",
                  children: "Begin Placement"
                }
              )
            ]
          }
        )
      }
    );
  }
  const ROOM_POSITIONS = {
    bedroom: { x: "2%", y: "2%", w: "44%", h: "44%" },
    kitchen: { x: "54%", y: "2%", w: "44%", h: "44%" },
    hallway: { x: "2%", y: "50%", w: "96%", h: "16%" },
    bathroom: { x: "2%", y: "70%", w: "44%", h: "28%" },
    living_room: { x: "54%", y: "70%", w: "44%", h: "28%" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "sensor_network.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
              children: [
                "Layout ",
                totalLayouts + 1,
                "/",
                layoutCount
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Select sensor, click room" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 shrink-0 flex-wrap", children: layout.sensorsToPlace.map((sensor) => {
          const placed = Object.values(placements).includes(sensor);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              whileHover: { scale: 1.04 },
              whileTap: { scale: 0.96 },
              onClick: () => setSelectedSensor(selectedSensor === sensor ? null : sensor),
              className: "rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1",
              style: {
                borderColor: selectedSensor === sensor ? SENSOR_COLORS[sensor] : placed ? `${SENSOR_COLORS[sensor]}60` : `${SENSOR_COLORS[sensor]}30`,
                backgroundColor: selectedSensor === sensor ? `${SENSOR_COLORS[sensor]}25` : placed ? `${SENSOR_COLORS[sensor]}12` : "transparent",
                color: SENSOR_COLORS[sensor],
                opacity: placed && selectedSensor !== sensor ? 0.6 : 1
              },
              "data-ocid": `sensor_network.sensor.${sensor}`,
              children: [
                placed && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
                SENSOR_LABELS[sensor]
              ]
            },
            sensor
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative flex-1 rounded-xl border border-border/30 glass overflow-hidden",
            "data-ocid": "sensor_network.blueprint",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanlines absolute inset-0 pointer-events-none z-10" }),
              layout.rooms.map((room) => {
                const pos = ROOM_POSITIONS[room];
                const placed = placements[room];
                const roomScore = roomScores[room];
                const isOptimal = roomScore && roomScore.pts === 100;
                const isGood = roomScore && roomScore.pts >= 50 && roomScore.pts < 100;
                roomScore && roomScore.pts < 50;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    type: "button",
                    className: "absolute rounded-lg border-2 flex flex-col items-center justify-center transition-all cursor-pointer",
                    style: {
                      left: pos.x,
                      top: pos.y,
                      width: pos.w,
                      height: pos.h,
                      borderColor: submitted ? isOptimal ? "#10b981" : isGood ? "#f59e0b" : "#f43f5e" : placed ? SENSOR_COLORS[placed] : "#374151",
                      backgroundColor: submitted ? isOptimal ? "#10b98120" : isGood ? "#f59e0b20" : "#f43f5e20" : placed ? `${SENSOR_COLORS[placed]}15` : "#1e293b40"
                    },
                    whileHover: !submitted ? { scale: 1.02 } : {},
                    onClick: () => handleRoomClick(room),
                    "data-ocid": `sensor_network.room.${room}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-bold",
                          style: {
                            color: placed ? SENSOR_COLORS[placed] : "#6b7280",
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: "9px"
                          },
                          children: ROOM_LABELS[room]
                        }
                      ),
                      placed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs mt-1",
                          style: { color: SENSOR_COLORS[placed], fontSize: "8px" },
                          children: SENSOR_LABELS[placed]
                        }
                      ),
                      submitted && roomScore && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-xs font-bold mt-1",
                          style: {
                            color: isOptimal ? "#10b981" : isGood ? "#f59e0b" : "#f43f5e",
                            fontSize: "10px"
                          },
                          children: [
                            "+",
                            roomScore.pts
                          ]
                        }
                      )
                    ]
                  },
                  room
                );
              })
            ]
          }
        ),
        submitted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 shrink-0 text-xs", children: layout.rooms.filter((r) => roomScores[r]).map((room) => {
          const rs = roomScores[room];
          return rs ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-bold",
                style: {
                  color: rs.pts >= 75 ? "#10b981" : rs.pts >= 50 ? "#f59e0b" : "#f43f5e"
                },
                children: [
                  ROOM_LABELS[room],
                  ":"
                ]
              }
            ),
            " ",
            rs.reason
          ] }, room) : null;
        }) }),
        !submitted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: !allSensorsPlaced,
            "data-ocid": "sensor_network.submit_button",
            children: "Evaluate Placement"
          }
        ) })
      ]
    }
  );
}
const APPLIANCES = [
  {
    id: "washer",
    name: "Washing Machine",
    kw: 2,
    color: "#00f5ff",
    requiredRuns: 1
  },
  {
    id: "dishwasher",
    name: "Dishwasher",
    kw: 1.5,
    color: "#7c3aed",
    requiredRuns: 1
  },
  {
    id: "ev_charger",
    name: "EV Charger",
    kw: 7,
    color: "#f43f5e",
    requiredRuns: 1
  },
  {
    id: "water_heater",
    name: "Water Heater",
    kw: 3,
    color: "#f59e0b",
    requiredRuns: 1
  },
  { id: "dryer", name: "Dryer", kw: 2.5, color: "#10b981", requiredRuns: 1 },
  {
    id: "pool_pump",
    name: "Pool Pump",
    kw: 1,
    color: "#e879f9",
    requiredRuns: 1
  }
];
function isPeak(hour) {
  return hour >= 6 && hour <= 8 || hour >= 17 && hour <= 20;
}
const BASE_RATE = 0.15;
const PEAK_MULTIPLIER = 3;
function calcCost(applianceId, hour) {
  const app = APPLIANCES.find((a) => a.id === applianceId);
  if (!app) return 0;
  const rate = isPeak(hour) ? BASE_RATE * PEAK_MULTIPLIER : BASE_RATE;
  return app.kw * rate;
}
function calcUnoptimizedCost() {
  return APPLIANCES.reduce(
    (sum, a) => sum + a.kw * BASE_RATE * PEAK_MULTIPLIER,
    0
  );
}
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SCENARIO_CONSTRAINTS = [
  { label: "Normal Day", lockedAppliances: [] },
  {
    label: "Work From Home",
    lockedAppliances: [
      {
        id: "dishwasher",
        hour: 12,
        reason: "Dishwasher must run after lunch (12pm)"
      }
    ]
  },
  {
    label: "Weekend",
    lockedAppliances: [
      { id: "water_heater", hour: 7, reason: "Hot shower at 7am required" }
    ]
  }
];
function EnergyOptimizerGame({
  config,
  onGameEnd
}) {
  const scenarioCount = config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const [scenarioIdx, setScenarioIdx] = reactExports.useState(0);
  const scenario = SCENARIO_CONSTRAINTS[scenarioIdx % SCENARIO_CONSTRAINTS.length];
  const [schedule, setSchedule] = reactExports.useState(
    () => {
      const init = {};
      for (const a of APPLIANCES) {
        const locked = scenario.lockedAppliances.find((l) => l.id === a.id);
        init[a.id] = locked ? locked.hour : null;
      }
      return init;
    }
  );
  const [score, setScore] = reactExports.useState(0);
  const [completedScenarios, setCompletedScenarios] = reactExports.useState(0);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completedScenarios / scenarioCount * 100,
          timeSpent,
          completed
        )
      );
    },
    [config, onGameEnd, completedScenarios, scenarioCount]
  );
  function handleSchedule(appId, hour) {
    if (submitted) return;
    const locked = scenario.lockedAppliances.find((l) => l.id === appId);
    if (locked) return;
    setSchedule((prev) => ({
      ...prev,
      [appId]: prev[appId] === hour ? null : hour
    }));
  }
  const allScheduled = APPLIANCES.every((a) => schedule[a.id] !== null);
  const currentCost = allScheduled ? APPLIANCES.reduce(
    (sum, a) => sum + calcCost(a.id, schedule[a.id]),
    0
  ) : 0;
  const unoptimizedCost = calcUnoptimizedCost();
  const savings = unoptimizedCost - currentCost;
  const savingsPct = unoptimizedCost > 0 ? savings / unoptimizedCost * 100 : 0;
  function handleSubmit() {
    if (!allScheduled) return;
    setSubmitted(true);
    const pts = Math.round(savingsPct * 4 * config.difficulty);
    const newScore = score + pts;
    setScore(newScore);
    scoreRef.current = newScore;
    setTimeout(() => {
      const next = completedScenarios + 1;
      setCompletedScenarios(next);
      if (next >= scenarioCount) {
        endGame(true);
      } else {
        const nextScenario = SCENARIO_CONSTRAINTS[next % SCENARIO_CONSTRAINTS.length];
        const initSched = {};
        for (const a of APPLIANCES) {
          const locked = nextScenario.lockedAppliances.find(
            (l) => l.id === a.id
          );
          initSched[a.id] = locked ? locked.hour : null;
        }
        setSchedule(initSched);
        setScenarioIdx(next);
        setSubmitted(false);
      }
    }, 3e3);
  }
  if (!gameStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "energy_optimizer.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Zap,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f59e0b" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
                  children: "Energy Optimizer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "Schedule household appliances to avoid peak electricity hours. Peak hours cost 3x more than off-peak." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-4", children: "Peak hours: 6-9am and 5-9pm. Schedule all appliances to minimize your electricity bill." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-lg p-3 mb-6 text-xs text-left", children: [
                "6-9am: PEAK (3x price = $0.45/kWh)",
                "9am-5pm: OFF-PEAK ($0.15/kWh)",
                "9pm-6am: OFF-PEAK ($0.15/kWh)",
                "5-9pm: PEAK (3x price = $0.45/kWh)"
              ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t }, t)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "energy_optimizer.start_button",
                  children: "Start Scheduling"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "energy_optimizer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f59e0b" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", children: [
              score.toLocaleString(),
              " pts"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" },
              children: [
                "Scenario: ",
                scenario.label
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            completedScenarios + 1,
            "/",
            scenarioCount
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "ELECTRICITY PRICE — 24h"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-px h-8", children: HOURS.map((h) => {
            const peak = isPeak(h);
            const barStyle = {
              height: peak ? "100%" : "40%",
              alignSelf: "flex-end"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full rounded-sm",
                style: {
                  ...barStyle,
                  backgroundColor: peak ? "#f43f5e" : "#10b981"
                }
              }
            ) }, h);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "12am" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "6am" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "12pm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "6pm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "11pm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col gap-2 overflow-y-auto", children: APPLIANCES.map((app) => {
          const locked = scenario.lockedAppliances.find((l) => l.id === app.id);
          const selectedHour = schedule[app.id];
          const cost = selectedHour !== null ? calcCost(app.id, selectedHour) : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-xl p-3 border",
              style: { borderColor: `${app.color}30` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-sm font-bold",
                      style: { color: app.color },
                      children: [
                        app.name,
                        " (",
                        app.kw,
                        "kW)"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    cost !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-xs font-bold",
                        style: {
                          color: isPeak(selectedHour) ? "#f43f5e" : "#10b981"
                        },
                        children: [
                          "$",
                          cost.toFixed(2),
                          "/run"
                        ]
                      }
                    ),
                    locked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Locked: ",
                      locked.reason
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-px overflow-x-auto pb-1", children: HOURS.filter((h) => h % 2 === 0).map((h) => {
                  const peak = isPeak(h);
                  const isSelected = selectedHour === h || locked && locked.hour === h;
                  const cellStyle = {
                    backgroundColor: isSelected ? app.color : peak ? "#f43f5e20" : "#10b98120",
                    borderColor: isSelected ? app.color : peak ? "#f43f5e50" : "#10b98150",
                    color: isSelected ? "#000" : "#94a3b8"
                  };
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleSchedule(app.id, h),
                      className: "flex-shrink-0 w-8 h-8 rounded text-xs font-bold border transition-all",
                      style: cellStyle,
                      disabled: !!locked || submitted,
                      "data-ocid": `energy_optimizer.${app.id}.hour.${h}`,
                      children: h
                    },
                    h
                  );
                }) })
              ]
            },
            app.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-muted-foreground",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "YOUR COST"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xl font-black",
                  style: {
                    color: submitted ? savingsPct > 30 ? "#10b981" : "#f59e0b" : "#f59e0b"
                  },
                  children: [
                    "$",
                    currentCost.toFixed(2)
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "vs unoptimized" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground line-through", children: [
                "$",
                unoptimizedCost.toFixed(2)
              ] }),
              allScheduled && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-sm font-bold",
                  style: { color: savings > 0 ? "#10b981" : "#f43f5e" },
                  children: [
                    savings >= 0 ? "-" : "+",
                    "$",
                    Math.abs(savings).toFixed(2),
                    " (",
                    savingsPct.toFixed(0),
                    "%)"
                  ]
                }
              )
            ] }),
            !submitted && /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "primary",
                size: "sm",
                onClick: handleSubmit,
                disabled: !allScheduled,
                "data-ocid": "energy_optimizer.submit_button",
                children: "Lock Schedule"
              }
            )
          ] }),
          submitted && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm mt-2",
              style: {
                color: savingsPct > 40 ? "#10b981" : savingsPct > 20 ? "#f59e0b" : "#f43f5e"
              },
              children: savingsPct > 40 ? "Excellent optimization — maximum off-peak scheduling achieved." : savingsPct > 20 ? "Good savings — some appliances could still be shifted off-peak." : "Low savings — try shifting high-wattage appliances like the EV charger to midnight."
            }
          )
        ] })
      ]
    }
  );
}
function SmartHome({ config, onGameEnd }) {
  if (config.gameId === "sensor-network")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SensorNetworkGame, { config, onGameEnd });
  if (config.gameId === "energy-optimizer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EnergyOptimizerGame, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AutomatorGame, { config, onGameEnd });
}
export {
  SmartHome as default
};
