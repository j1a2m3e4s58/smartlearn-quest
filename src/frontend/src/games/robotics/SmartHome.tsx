import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Home, XCircle, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type GameConfig, type GameResult, buildResult } from "../GameEngine";

// ─── Game 1: Smart Home Automator ───────────────────────────────────────────

type EventType =
  | "motion"
  | "temperature"
  | "time"
  | "door"
  | "rain"
  | "brightness";
type ActionType =
  | "lights_on"
  | "lights_off"
  | "fan_on"
  | "fan_off"
  | "lock_door"
  | "unlock_door"
  | "send_alert"
  | "play_music"
  | "sprinkler_on";

interface AutomationChallenge {
  id: string;
  description: string;
  scenario: string;
  requiredCondition: EventType;
  requiredAction: ActionType;
  conditionOptions: EventType[];
  actionOptions: ActionType[];
  explanation: string;
  testEventLabel: string;
}

const EVENT_LABELS: Record<EventType, string> = {
  motion: "Motion Detected",
  temperature: "Temp > 30 C",
  time: "Time = 8:00 PM",
  door: "Door Unlocked",
  rain: "Rain Detected",
  brightness: "Brightness < 20%",
};
const ACTION_LABELS: Record<ActionType, string> = {
  lights_on: "Turn Lights ON",
  lights_off: "Turn Lights OFF",
  fan_on: "Activate Fan",
  fan_off: "Turn Fan OFF",
  lock_door: "Lock Door",
  unlock_door: "Unlock Door",
  send_alert: "Send Security Alert",
  play_music: "Play Welcome Music",
  sprinkler_on: "Activate Sprinklers",
};
const EVENT_COLORS: Record<EventType, string> = {
  motion: "#f43f5e",
  temperature: "#f59e0b",
  time: "#7c3aed",
  door: "#10b981",
  rain: "#00f5ff",
  brightness: "#e879f9",
};
const ACTION_COLORS: Record<ActionType, string> = {
  lights_on: "#f59e0b",
  lights_off: "#374151",
  fan_on: "#00f5ff",
  fan_off: "#374151",
  lock_door: "#f43f5e",
  unlock_door: "#10b981",
  send_alert: "#f43f5e",
  play_music: "#7c3aed",
  sprinkler_on: "#00f5ff",
};

const AUTOMATION_CHALLENGES: Record<1 | 2 | 3, AutomationChallenge[]> = {
  1: [
    {
      id: "c1",
      description: "Security System",
      scenario:
        "When someone enters a dark room, the lights should automatically turn on.",
      requiredCondition: "motion",
      requiredAction: "lights_on",
      conditionOptions: ["motion", "time", "temperature", "brightness"],
      actionOptions: ["lights_on", "fan_on", "lock_door", "send_alert"],
      explanation:
        "Motion detection triggers lights ON — classic smart home automation rule.",
      testEventLabel: "Someone walks into the dark room",
    },
    {
      id: "c2",
      description: "Evening Ambiance",
      scenario:
        "At 8:00 PM every evening, relaxing music should start playing automatically.",
      requiredCondition: "time",
      requiredAction: "play_music",
      conditionOptions: ["time", "motion", "door", "rain"],
      actionOptions: ["play_music", "lights_off", "fan_on", "send_alert"],
      explanation:
        "Time-based triggers automate routine actions — the backbone of smart scheduling.",
      testEventLabel: "Clock reaches 8:00 PM",
    },
    {
      id: "c3",
      description: "Temperature Control",
      scenario:
        "When temperature exceeds 30 C, the cooling fan should activate immediately.",
      requiredCondition: "temperature",
      requiredAction: "fan_on",
      conditionOptions: ["temperature", "brightness", "time", "motion"],
      actionOptions: ["fan_on", "lights_on", "play_music", "lock_door"],
      explanation:
        "Temperature sensors trigger HVAC actions — smart home energy management.",
      testEventLabel: "Temperature sensor reads 31 C",
    },
  ],
  2: [
    {
      id: "c4",
      description: "Burglary Prevention",
      scenario:
        "If the front door unlocks unexpectedly, immediately send a security alert.",
      requiredCondition: "door",
      requiredAction: "send_alert",
      conditionOptions: ["door", "motion", "rain", "brightness"],
      actionOptions: ["send_alert", "lights_on", "fan_off", "play_music"],
      explanation:
        "Door sensors trigger security alerts — IoT security automation pattern.",
      testEventLabel: "Front door lock sensor activates",
    },
    {
      id: "c5",
      description: "Garden Management",
      scenario:
        "When rain is detected, the garden sprinklers should activate to supplement watering.",
      requiredCondition: "rain",
      requiredAction: "sprinkler_on",
      conditionOptions: ["rain", "temperature", "time", "motion"],
      actionOptions: ["sprinkler_on", "fan_off", "lights_off", "lock_door"],
      explanation: "Rain sensors trigger irrigation — smart garden management.",
      testEventLabel: "Rain sensor detects precipitation",
    },
    {
      id: "c6",
      description: "Sundown Lighting",
      scenario:
        "When natural light drops below 20% brightness, lights should turn on automatically.",
      requiredCondition: "brightness",
      requiredAction: "lights_on",
      conditionOptions: ["brightness", "temperature", "door", "rain"],
      actionOptions: ["lights_on", "fan_on", "lock_door", "play_music"],
      explanation:
        "Light sensors automate lighting based on ambient conditions.",
      testEventLabel: "Ambient light sensor reads 15%",
    },
  ],
  3: [
    {
      id: "c7",
      description: "Night Mode",
      scenario:
        "At 8 PM when motion is detected, activate welcome music for guests.",
      requiredCondition: "time",
      requiredAction: "play_music",
      conditionOptions: ["time", "motion", "brightness", "door"],
      actionOptions: ["play_music", "send_alert", "fan_off", "sprinkler_on"],
      explanation:
        "Compound time+event rules create sophisticated smart home experiences.",
      testEventLabel: "Clock reaches 8 PM with motion present",
    },
    {
      id: "c8",
      description: "Emergency Response",
      scenario:
        "When temperature exceeds 30 C at night, lock all doors immediately.",
      requiredCondition: "temperature",
      requiredAction: "lock_door",
      conditionOptions: ["temperature", "brightness", "rain", "motion"],
      actionOptions: ["lock_door", "lights_on", "fan_on", "sprinkler_on"],
      explanation:
        "Emergency rules combine multiple conditions for safety-critical automation.",
      testEventLabel: "Temp rises to 35 C at midnight",
    },
  ],
};

function AutomatorGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const challenges = AUTOMATION_CHALLENGES[config.difficulty];
  const [idx, setIdx] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState<EventType | null>(
    null,
  );
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [tested, setTested] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (correct / challenges.length) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, correct, challenges.length],
  );

  const challenge = challenges[idx];

  function handleTest() {
    if (!selectedCondition || !selectedAction) return;
    const allOk =
      selectedCondition === challenge.requiredCondition &&
      selectedAction === challenge.requiredAction;
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
      }, 2000);
    }
  }

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="smart_home.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Home
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#00f5ff" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" }}
          >
            Smart Home Automator
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Build IF-THEN automation rules. Select the correct CONDITION that
            triggers an event, then select the correct ACTION to respond.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Simulate Event to test your rule. Correct rules earn points.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="smart_home.start_button"
          >
            Configure System
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-4"
      data-ocid="smart_home.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#00f5ff" }}>
          <Home className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#00f5ff" }}
        >
          Rule {idx + 1}/{challenges.length}
        </span>
        <span className="text-xs text-muted-foreground">
          Solved: {correct}/{challenges.length}
        </span>
      </div>
      <div className="glass-card rounded-xl p-4 shrink-0 border border-[#00f5ff]/30">
        <p
          className="text-xs text-[#00f5ff] font-bold mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          AUTOMATION CHALLENGE: {challenge.description}
        </p>
        <p className="text-sm text-foreground">{challenge.scenario}</p>
      </div>
      <div className="flex items-center gap-3 glass-card rounded-xl p-4 shrink-0">
        <div className="flex-1">
          <p
            className="text-xs text-muted-foreground mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            IF (Condition)
          </p>
          <div
            className="rounded-xl border-2 px-4 py-3 min-h-12 flex items-center justify-center transition-all"
            style={{
              borderColor: selectedCondition
                ? EVENT_COLORS[selectedCondition]
                : undefined,
              borderStyle: selectedCondition ? "solid" : "dashed",
            }}
          >
            {selectedCondition ? (
              <span
                className="text-sm font-bold"
                style={{ color: EVENT_COLORS[selectedCondition] }}
              >
                {EVENT_LABELS[selectedCondition]}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Select a condition below
              </span>
            )}
          </div>
        </div>
        <div
          className="text-[#00f5ff] font-black text-xl"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          THEN
        </div>
        <div className="flex-1">
          <p
            className="text-xs text-muted-foreground mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Action
          </p>
          <div
            className="rounded-xl border-2 px-4 py-3 min-h-12 flex items-center justify-center transition-all"
            style={{
              borderColor: selectedAction
                ? ACTION_COLORS[selectedAction]
                : undefined,
              borderStyle: selectedAction ? "solid" : "dashed",
            }}
          >
            {selectedAction ? (
              <span
                className="text-sm font-bold"
                style={{ color: ACTION_COLORS[selectedAction] }}
              >
                {ACTION_LABELS[selectedAction]}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Select an action below
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          CONDITIONS
        </p>
        <div className="grid grid-cols-2 gap-2">
          {challenge.conditionOptions.map((cond) => (
            <motion.button
              type="button"
              key={cond}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCondition(cond)}
              className="rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all text-left"
              style={{
                borderColor:
                  selectedCondition === cond
                    ? EVENT_COLORS[cond]
                    : `${EVENT_COLORS[cond]}40`,
                backgroundColor:
                  selectedCondition === cond
                    ? `${EVENT_COLORS[cond]}20`
                    : `${EVENT_COLORS[cond]}08`,
                color: EVENT_COLORS[cond],
              }}
              data-ocid={`smart_home.condition.${cond}`}
            >
              {EVENT_LABELS[cond]}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="shrink-0">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          ACTIONS
        </p>
        <div className="grid grid-cols-2 gap-2">
          {challenge.actionOptions.map((act) => (
            <motion.button
              type="button"
              key={act}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedAction(act)}
              className="rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all text-left"
              style={{
                borderColor:
                  selectedAction === act
                    ? ACTION_COLORS[act]
                    : `${ACTION_COLORS[act]}40`,
                backgroundColor:
                  selectedAction === act
                    ? `${ACTION_COLORS[act]}20`
                    : `${ACTION_COLORS[act]}08`,
                color: ACTION_COLORS[act],
              }}
              data-ocid={`smart_home.action.${act}`}
            >
              {ACTION_LABELS[act]}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="shrink-0 flex justify-between items-center">
        <GlowButton
          variant="primary"
          size="sm"
          onClick={handleTest}
          disabled={!selectedCondition || !selectedAction || tested}
          data-ocid="smart_home.simulate_button"
        >
          Simulate: {challenge.testEventLabel}
        </GlowButton>
      </div>
      <AnimatePresence>
        {tested && testResult !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-3 border shrink-0 ${testResult ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`}
          >
            <div className="flex items-center gap-2">
              {testResult ? (
                <CheckCircle className="h-5 w-5 text-[#10b981] shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-[#f43f5e] shrink-0" />
              )}
              <p className="text-sm">
                {testResult ? (
                  <span className="text-[#10b981] font-bold">
                    Correct! {challenge.explanation}
                  </span>
                ) : (
                  <span className="text-[#f43f5e]">
                    Wrong combination. Read the scenario and try again.
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Game 2: Sensor Network ──────────────────────────────────────────────────

type SensorType =
  | "smoke"
  | "motion"
  | "door_contact"
  | "temperature"
  | "water_leak";
type RoomId = "bedroom" | "kitchen" | "hallway" | "bathroom" | "living_room";

interface SensorPlacement {
  sensor: SensorType;
  room: RoomId;
  score: number;
  reason: string;
}

const SENSOR_LABELS: Record<SensorType, string> = {
  smoke: "Smoke Detector",
  motion: "Motion Sensor",
  door_contact: "Door Contact",
  temperature: "Temperature Sensor",
  water_leak: "Water Leak Detector",
};
const SENSOR_COLORS: Record<SensorType, string> = {
  smoke: "#f43f5e",
  motion: "#f59e0b",
  door_contact: "#10b981",
  temperature: "#00f5ff",
  water_leak: "#7c3aed",
};
const ROOM_LABELS: Record<RoomId, string> = {
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  hallway: "Hallway",
  bathroom: "Bathroom",
  living_room: "Living Room",
};

// Scoring: best placement = 100pts, acceptable = 50pts, wrong = 0pts
const SENSOR_ROOM_SCORES: Record<
  SensorType,
  Record<RoomId, { pts: number; reason: string }>
> = {
  smoke: {
    kitchen: {
      pts: 100,
      reason: "Kitchen has highest fire/smoke risk from cooking",
    },
    bedroom: {
      pts: 50,
      reason: "Bedroom coverage is important but not primary risk",
    },
    hallway: {
      pts: 75,
      reason: "Hallway covers escape route — good secondary placement",
    },
    bathroom: { pts: 0, reason: "Bathroom steam causes false alarms" },
    living_room: { pts: 50, reason: "Living room coverage is acceptable" },
  },
  motion: {
    hallway: {
      pts: 100,
      reason: "Hallway catches all movement between rooms — ideal",
    },
    living_room: {
      pts: 75,
      reason: "Living room is high-traffic — good placement",
    },
    bedroom: {
      pts: 50,
      reason: "Bedroom motion is useful for occupancy detection",
    },
    kitchen: { pts: 50, reason: "Kitchen motion works for activity detection" },
    bathroom: {
      pts: 0,
      reason: "Bathroom motion invades privacy — not recommended",
    },
  },
  door_contact: {
    bedroom: {
      pts: 100,
      reason: "Bedroom entry door is primary security point",
    },
    hallway: { pts: 75, reason: "Hallway door is a key access point" },
    kitchen: { pts: 50, reason: "Kitchen exterior door is valid" },
    living_room: {
      pts: 75,
      reason: "Living room main door is a standard entry point",
    },
    bathroom: {
      pts: 25,
      reason: "Bathroom door contact has limited security value",
    },
  },
  temperature: {
    living_room: {
      pts: 100,
      reason: "Living room represents average home temperature best",
    },
    bedroom: {
      pts: 75,
      reason: "Bedroom temperature control is important for comfort",
    },
    kitchen: {
      pts: 50,
      reason: "Kitchen temps fluctuate from cooking — not representative",
    },
    hallway: { pts: 75, reason: "Hallway gives good average reading" },
    bathroom: { pts: 25, reason: "Bathroom temps are skewed by showers" },
  },
  water_leak: {
    bathroom: {
      pts: 100,
      reason: "Bathroom is primary water leak risk — toilet, shower, pipes",
    },
    kitchen: {
      pts: 100,
      reason: "Kitchen sink and dishwasher are major leak points",
    },
    hallway: {
      pts: 0,
      reason: "Hallway has no water sources — useless placement",
    },
    bedroom: { pts: 0, reason: "Bedroom has no water sources normally" },
    living_room: { pts: 25, reason: "Living room has minimal water risk" },
  },
};

const HOUSE_LAYOUTS: Array<{ rooms: RoomId[]; sensorsToPlace: SensorType[] }> =
  [
    {
      rooms: ["bedroom", "kitchen", "hallway", "bathroom", "living_room"],
      sensorsToPlace: [
        "smoke",
        "motion",
        "door_contact",
        "temperature",
        "water_leak",
      ],
    },
    {
      rooms: ["kitchen", "hallway", "bathroom", "living_room", "bedroom"],
      sensorsToPlace: [
        "water_leak",
        "smoke",
        "motion",
        "temperature",
        "door_contact",
      ],
    },
    {
      rooms: ["hallway", "bedroom", "kitchen", "living_room", "bathroom"],
      sensorsToPlace: [
        "motion",
        "temperature",
        "smoke",
        "water_leak",
        "door_contact",
      ],
    },
    {
      rooms: ["bathroom", "living_room", "kitchen", "hallway", "bedroom"],
      sensorsToPlace: [
        "water_leak",
        "door_contact",
        "smoke",
        "motion",
        "temperature",
      ],
    },
    {
      rooms: ["bedroom", "bathroom", "hallway", "kitchen", "living_room"],
      sensorsToPlace: [
        "temperature",
        "water_leak",
        "motion",
        "smoke",
        "door_contact",
      ],
    },
  ];

function SensorNetworkGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const layoutCount =
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [layoutIdx, setLayoutIdx] = useState(0);
  const layout = HOUSE_LAYOUTS[layoutIdx % HOUSE_LAYOUTS.length];
  const [selectedSensor, setSelectedSensor] = useState<SensorType | null>(null);
  const [placements, setPlacements] = useState<
    Record<RoomId, SensorType | null>
  >({
    bedroom: null,
    kitchen: null,
    hallway: null,
    bathroom: null,
    living_room: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [roomScores, setRoomScores] = useState<
    Record<RoomId, { pts: number; reason: string } | null>
  >({
    bedroom: null,
    kitchen: null,
    hallway: null,
    bathroom: null,
    living_room: null,
  });
  const [score, setScore] = useState(0);
  const [totalLayouts, setTotalLayouts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const acc = (scoreRef.current / (500 * layoutCount)) * 100;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          Math.min(acc, 100),
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, layoutCount],
  );

  function handleRoomClick(room: RoomId) {
    if (submitted || !selectedSensor) return;
    // Only place sensor if room is in this layout
    if (!layout.rooms.includes(room)) return;
    // Check if sensor already placed somewhere
    const alreadyPlaced = Object.values(placements).includes(selectedSensor);
    if (alreadyPlaced) {
      // Remove from previous room
      const newPlacements = { ...placements };
      for (const r of Object.keys(newPlacements) as RoomId[]) {
        if (newPlacements[r] === selectedSensor) newPlacements[r] = null;
      }
      newPlacements[room] = selectedSensor;
      setPlacements(newPlacements);
    } else {
      setPlacements((prev) => ({ ...prev, [room]: selectedSensor }));
    }
  }

  function handleSubmit() {
    const scores: Record<RoomId, { pts: number; reason: string } | null> = {
      bedroom: null,
      kitchen: null,
      hallway: null,
      bathroom: null,
      living_room: null,
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
          living_room: null,
        });
        setRoomScores({
          bedroom: null,
          kitchen: null,
          hallway: null,
          bathroom: null,
          living_room: null,
        });
        setSubmitted(false);
        setSelectedSensor(null);
      }
    }, 3500);
  }

  const allSensorsPlaced = layout.sensorsToPlace.every((s) =>
    Object.values(placements).includes(s),
  );

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="sensor_network.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Home
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f59e0b" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
          >
            Sensor Network Design
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Drag sensors to rooms in the house blueprint. Each sensor type has
            an optimal placement based on safety and function.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Select a sensor, then click a room to place it. Maximize your
            placement score across {layoutCount} house layouts.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="sensor_network.start_button"
          >
            Begin Placement
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  const ROOM_POSITIONS: Record<
    RoomId,
    { x: string; y: string; w: string; h: string }
  > = {
    bedroom: { x: "2%", y: "2%", w: "44%", h: "44%" },
    kitchen: { x: "54%", y: "2%", w: "44%", h: "44%" },
    hallway: { x: "2%", y: "50%", w: "96%", h: "16%" },
    bathroom: { x: "2%", y: "70%", w: "44%", h: "28%" },
    living_room: { x: "54%", y: "70%", w: "44%", h: "28%" },
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="sensor_network.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Home className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
        >
          Layout {totalLayouts + 1}/{layoutCount}
        </span>
        <span className="text-xs text-muted-foreground">
          Select sensor, click room
        </span>
      </div>

      {/* Sensor palette */}
      <div className="flex gap-2 shrink-0 flex-wrap">
        {layout.sensorsToPlace.map((sensor) => {
          const placed = Object.values(placements).includes(sensor);
          return (
            <motion.button
              type="button"
              key={sensor}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                setSelectedSensor(selectedSensor === sensor ? null : sensor)
              }
              className="rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1"
              style={{
                borderColor:
                  selectedSensor === sensor
                    ? SENSOR_COLORS[sensor]
                    : placed
                      ? `${SENSOR_COLORS[sensor]}60`
                      : `${SENSOR_COLORS[sensor]}30`,
                backgroundColor:
                  selectedSensor === sensor
                    ? `${SENSOR_COLORS[sensor]}25`
                    : placed
                      ? `${SENSOR_COLORS[sensor]}12`
                      : "transparent",
                color: SENSOR_COLORS[sensor],
                opacity: placed && selectedSensor !== sensor ? 0.6 : 1,
              }}
              data-ocid={`sensor_network.sensor.${sensor}`}
            >
              {placed && <CheckCircle className="h-3 w-3" />}
              {SENSOR_LABELS[sensor]}
            </motion.button>
          );
        })}
      </div>

      {/* House blueprint */}
      <div
        className="relative flex-1 rounded-xl border border-border/30 glass overflow-hidden"
        data-ocid="sensor_network.blueprint"
      >
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />
        {layout.rooms.map((room) => {
          const pos = ROOM_POSITIONS[room];
          const placed = placements[room];
          const roomScore = roomScores[room];
          const isOptimal = roomScore && roomScore.pts === 100;
          const isGood =
            roomScore && roomScore.pts >= 50 && roomScore.pts < 100;
          const isBad = roomScore && roomScore.pts < 50;
          return (
            <motion.button
              type="button"
              key={room}
              className="absolute rounded-lg border-2 flex flex-col items-center justify-center transition-all cursor-pointer"
              style={{
                left: pos.x,
                top: pos.y,
                width: pos.w,
                height: pos.h,
                borderColor: submitted
                  ? isOptimal
                    ? "#10b981"
                    : isGood
                      ? "#f59e0b"
                      : "#f43f5e"
                  : placed
                    ? SENSOR_COLORS[placed]
                    : "#374151",
                backgroundColor: submitted
                  ? isOptimal
                    ? "#10b98120"
                    : isGood
                      ? "#f59e0b20"
                      : "#f43f5e20"
                  : placed
                    ? `${SENSOR_COLORS[placed]}15`
                    : "#1e293b40",
              }}
              whileHover={!submitted ? { scale: 1.02 } : {}}
              onClick={() => handleRoomClick(room)}
              data-ocid={`sensor_network.room.${room}`}
            >
              <span
                className="text-xs font-bold"
                style={{
                  color: placed ? SENSOR_COLORS[placed] : "#6b7280",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px",
                }}
              >
                {ROOM_LABELS[room]}
              </span>
              {placed && (
                <span
                  className="text-xs mt-1"
                  style={{ color: SENSOR_COLORS[placed], fontSize: "8px" }}
                >
                  {SENSOR_LABELS[placed]}
                </span>
              )}
              {submitted && roomScore && (
                <span
                  className="text-xs font-bold mt-1"
                  style={{
                    color: isOptimal
                      ? "#10b981"
                      : isGood
                        ? "#f59e0b"
                        : "#f43f5e",
                    fontSize: "10px",
                  }}
                >
                  +{roomScore.pts}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {submitted && (
        <div className="glass-card rounded-xl p-3 shrink-0 text-xs">
          {layout.rooms
            .filter((r) => roomScores[r])
            .map((room) => {
              const rs = roomScores[room];
              return rs ? (
                <p key={room} className="text-muted-foreground">
                  <span
                    className="font-bold"
                    style={{
                      color:
                        rs.pts >= 75
                          ? "#10b981"
                          : rs.pts >= 50
                            ? "#f59e0b"
                            : "#f43f5e",
                    }}
                  >
                    {ROOM_LABELS[room]}:
                  </span>{" "}
                  {rs.reason}
                </p>
              ) : null;
            })}
        </div>
      )}

      {!submitted && (
        <div className="shrink-0 flex justify-end">
          <GlowButton
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!allSensorsPlaced}
            data-ocid="sensor_network.submit_button"
          >
            Evaluate Placement
          </GlowButton>
        </div>
      )}
    </div>
  );
}

// ─── Game 3: Energy Optimizer ────────────────────────────────────────────────

interface Appliance {
  id: string;
  name: string;
  kw: number;
  color: string;
  requiredRuns: number;
}

const APPLIANCES: Appliance[] = [
  {
    id: "washer",
    name: "Washing Machine",
    kw: 2.0,
    color: "#00f5ff",
    requiredRuns: 1,
  },
  {
    id: "dishwasher",
    name: "Dishwasher",
    kw: 1.5,
    color: "#7c3aed",
    requiredRuns: 1,
  },
  {
    id: "ev_charger",
    name: "EV Charger",
    kw: 7.0,
    color: "#f43f5e",
    requiredRuns: 1,
  },
  {
    id: "water_heater",
    name: "Water Heater",
    kw: 3.0,
    color: "#f59e0b",
    requiredRuns: 1,
  },
  { id: "dryer", name: "Dryer", kw: 2.5, color: "#10b981", requiredRuns: 1 },
  {
    id: "pool_pump",
    name: "Pool Pump",
    kw: 1.0,
    color: "#e879f9",
    requiredRuns: 1,
  },
];

// 24 hours; peak = 3x price, off-peak = 1x
// Peak hours: 6-9am (6,7,8) and 5-9pm (17,18,19,20)
function isPeak(hour: number): boolean {
  return (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 20);
}
const BASE_RATE = 0.15; // per kWh
const PEAK_MULTIPLIER = 3;

function calcCost(applianceId: string, hour: number): number {
  const app = APPLIANCES.find((a) => a.id === applianceId);
  if (!app) return 0;
  const rate = isPeak(hour) ? BASE_RATE * PEAK_MULTIPLIER : BASE_RATE;
  return app.kw * rate;
}

function calcUnoptimizedCost(): number {
  // Default: run all at peak hours (7am)
  return APPLIANCES.reduce(
    (sum, a) => sum + a.kw * BASE_RATE * PEAK_MULTIPLIER,
    0,
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SCENARIO_CONSTRAINTS: Array<{
  label: string;
  lockedAppliances: Array<{ id: string; hour: number; reason: string }>;
}> = [
  { label: "Normal Day", lockedAppliances: [] },
  {
    label: "Work From Home",
    lockedAppliances: [
      {
        id: "dishwasher",
        hour: 12,
        reason: "Dishwasher must run after lunch (12pm)",
      },
    ],
  },
  {
    label: "Weekend",
    lockedAppliances: [
      { id: "water_heater", hour: 7, reason: "Hot shower at 7am required" },
    ],
  },
];

function EnergyOptimizerGame({
  config,
  onGameEnd,
}: { config: GameConfig; onGameEnd: (r: GameResult) => void }) {
  const scenarioCount =
    config.difficulty === 1 ? 1 : config.difficulty === 2 ? 2 : 3;
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario =
    SCENARIO_CONSTRAINTS[scenarioIdx % SCENARIO_CONSTRAINTS.length];
  const [schedule, setSchedule] = useState<Record<string, number | null>>(
    () => {
      const init: Record<string, number | null> = {};
      for (const a of APPLIANCES) {
        const locked = scenario.lockedAppliances.find((l) => l.id === a.id);
        init[a.id] = locked ? locked.hour : null;
      }
      return init;
    },
  );
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          (completedScenarios / scenarioCount) * 100,
          timeSpent,
          completed,
        ),
      );
    },
    [config, onGameEnd, completedScenarios, scenarioCount],
  );

  function handleSchedule(appId: string, hour: number) {
    if (submitted) return;
    const locked = scenario.lockedAppliances.find((l) => l.id === appId);
    if (locked) return;
    setSchedule((prev) => ({
      ...prev,
      [appId]: prev[appId] === hour ? null : hour,
    }));
  }

  const allScheduled = APPLIANCES.every((a) => schedule[a.id] !== null);
  const currentCost = allScheduled
    ? APPLIANCES.reduce(
        (sum, a) => sum + calcCost(a.id, schedule[a.id] as number),
        0,
      )
    : 0;
  const unoptimizedCost = calcUnoptimizedCost();
  const savings = unoptimizedCost - currentCost;
  const savingsPct =
    unoptimizedCost > 0 ? (savings / unoptimizedCost) * 100 : 0;

  function handleSubmit() {
    if (!allScheduled) return;
    setSubmitted(true);
    // Score: savings percentage mapped to points
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
        const nextScenario =
          SCENARIO_CONSTRAINTS[next % SCENARIO_CONSTRAINTS.length];
        const initSched: Record<string, number | null> = {};
        for (const a of APPLIANCES) {
          const locked = nextScenario.lockedAppliances.find(
            (l) => l.id === a.id,
          );
          initSched[a.id] = locked ? locked.hour : null;
        }
        setSchedule(initSched);
        setScenarioIdx(next);
        setSubmitted(false);
      }
    }, 3000);
  }

  if (!gameStarted) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        data-ocid="energy_optimizer.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md w-full"
        >
          <Zap
            className="h-14 w-14 mx-auto mb-4"
            style={{ color: "#f59e0b" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
          >
            Energy Optimizer
          </h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Schedule household appliances to avoid peak electricity hours. Peak
            hours cost 3x more than off-peak.
          </p>
          <p className="text-muted-foreground text-xs mb-4">
            Peak hours: 6-9am and 5-9pm. Schedule all appliances to minimize
            your electricity bill.
          </p>
          <div className="glass rounded-lg p-3 mb-6 text-xs text-left">
            {[
              "6-9am: PEAK (3x price = $0.45/kWh)",
              "9am-5pm: OFF-PEAK ($0.15/kWh)",
              "9pm-6am: OFF-PEAK ($0.15/kWh)",
              "5-9pm: PEAK (3x price = $0.45/kWh)",
            ].map((t) => (
              <p key={t} className="text-muted-foreground">
                {t}
              </p>
            ))}
          </div>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
            }}
            data-ocid="energy_optimizer.start_button"
          >
            Start Scheduling
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="energy_optimizer.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
          <Zap className="h-4 w-4" />
          <span className="text-lg font-bold">
            {score.toLocaleString()} pts
          </span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#f59e0b" }}
        >
          Scenario: {scenario.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {completedScenarios + 1}/{scenarioCount}
        </span>
      </div>

      {/* Price bar */}
      <div className="glass-card rounded-xl p-3 shrink-0">
        <p
          className="text-xs text-muted-foreground mb-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          ELECTRICITY PRICE — 24h
        </p>
        <div className="flex gap-px h-8">
          {HOURS.map((h) => {
            const peak = isPeak(h);
            const barStyle = {
              height: peak ? "100%" : "40%",
              alignSelf: "flex-end" as const,
            };
            return (
              <div key={h} className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full rounded-sm"
                  style={{
                    ...barStyle,
                    backgroundColor: peak ? "#f43f5e" : "#10b981",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>11pm</span>
        </div>
      </div>

      {/* Appliance scheduler */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {APPLIANCES.map((app) => {
          const locked = scenario.lockedAppliances.find((l) => l.id === app.id);
          const selectedHour = schedule[app.id];
          const cost =
            selectedHour !== null
              ? calcCost(app.id, selectedHour as number)
              : null;
          return (
            <div
              key={app.id}
              className="glass-card rounded-xl p-3 border"
              style={{ borderColor: `${app.color}30` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: app.color }}
                >
                  {app.name} ({app.kw}kW)
                </span>
                <div className="flex items-center gap-2">
                  {cost !== null && (
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: isPeak(selectedHour as number)
                          ? "#f43f5e"
                          : "#10b981",
                      }}
                    >
                      ${cost.toFixed(2)}/run
                    </span>
                  )}
                  {locked && (
                    <span className="text-xs text-muted-foreground">
                      Locked: {locked.reason}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-px overflow-x-auto pb-1">
                {HOURS.filter((h) => h % 2 === 0).map((h) => {
                  const peak = isPeak(h);
                  const isSelected =
                    selectedHour === h || (locked && locked.hour === h);
                  const cellStyle = {
                    backgroundColor: isSelected
                      ? app.color
                      : peak
                        ? "#f43f5e20"
                        : "#10b98120",
                    borderColor: isSelected
                      ? app.color
                      : peak
                        ? "#f43f5e50"
                        : "#10b98150",
                    color: isSelected ? "#000" : "#94a3b8",
                  };
                  return (
                    <button
                      type="button"
                      key={h}
                      onClick={() => handleSchedule(app.id, h)}
                      className="flex-shrink-0 w-8 h-8 rounded text-xs font-bold border transition-all"
                      style={cellStyle}
                      disabled={!!locked || submitted}
                      data-ocid={`energy_optimizer.${app.id}.hour.${h}`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost summary */}
      <div className="glass-card rounded-xl p-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              YOUR COST
            </p>
            <p
              className="text-xl font-black"
              style={{
                color: submitted
                  ? savingsPct > 30
                    ? "#10b981"
                    : "#f59e0b"
                  : "#f59e0b",
              }}
            >
              ${currentCost.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">vs unoptimized</p>
            <p className="text-sm text-muted-foreground line-through">
              ${unoptimizedCost.toFixed(2)}
            </p>
            {allScheduled && (
              <p
                className="text-sm font-bold"
                style={{ color: savings > 0 ? "#10b981" : "#f43f5e" }}
              >
                {savings >= 0 ? "-" : "+"}${Math.abs(savings).toFixed(2)} (
                {savingsPct.toFixed(0)}%)
              </p>
            )}
          </div>
          {!submitted && (
            <GlowButton
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!allScheduled}
              data-ocid="energy_optimizer.submit_button"
            >
              Lock Schedule
            </GlowButton>
          )}
        </div>
        {submitted && (
          <p
            className="text-sm mt-2"
            style={{
              color:
                savingsPct > 40
                  ? "#10b981"
                  : savingsPct > 20
                    ? "#f59e0b"
                    : "#f43f5e",
            }}
          >
            {savingsPct > 40
              ? "Excellent optimization — maximum off-peak scheduling achieved."
              : savingsPct > 20
                ? "Good savings — some appliances could still be shifted off-peak."
                : "Low savings — try shifting high-wattage appliances like the EV charger to midnight."}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

export default function SmartHome({ config, onGameEnd }: Props) {
  if (config.gameId === "sensor-network")
    return <SensorNetworkGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "energy-optimizer")
    return <EnergyOptimizerGame config={config} onGameEnd={onGameEnd} />;
  return <AutomatorGame config={config} onGameEnd={onGameEnd} />;
}
