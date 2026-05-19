import { useAudioContext } from "@/audio/AudioProvider";
import { GameFeelProvider, useGameFeel } from "@/components/GameFeel";
import { NarrationPanel } from "@/components/NarrationPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import type { GameConfig, GameResult } from "@/games/GameEngine";
import {
  useMutateApplyProgressUpdate,
  useMutateRecordScore,
} from "@/hooks/useBackend";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronDown, Pause, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { Suspense, lazy, useEffect, useState } from "react";

const MouseMaster = lazy(() => import("@/games/MouseMaster"));
const KeyboardNinja = lazy(() => import("@/games/KeyboardNinja"));
const TypingSpeed = lazy(() => import("@/games/TypingSpeed"));
const CyberSafety = lazy(() => import("@/games/CyberSafety"));
const CodingBasics = lazy(() => import("@/games/CodingBasics"));

type GameComponentType = React.ComponentType<{
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}>;

function gc(
  loader: () => Promise<{ default: GameComponentType }>,
): GameComponentType {
  return React.lazy(loader) as GameComponentType;
}

const GAME_META: Record<
  string,
  { name: string; component: GameComponentType }
> = {
  // ── Existing ICT ──────────────────────────────────────────────────────────
  "mouse-master": {
    name: "Mouse Master",
    component: MouseMaster as GameComponentType,
  },
  "keyboard-ninja": {
    name: "Keyboard Ninja",
    component: KeyboardNinja as GameComponentType,
  },
  "typing-speed": {
    name: "Typing Speed",
    component: TypingSpeed as GameComponentType,
  },
  "cyber-safety": {
    name: "Cyber Safety",
    component: CyberSafety as GameComponentType,
  },
  "coding-basics": {
    name: "Coding Basics",
    component: CodingBasics as GameComponentType,
  },

  // ── ICT: Mouse Master (extra game IDs) ────────────────────────────────────
  "drag-drop-maze": {
    name: "Drag & Drop Maze",
    component: MouseMaster as GameComponentType,
  },
  "double-click-race": {
    name: "Double-Click Race",
    component: MouseMaster as GameComponentType,
  },
  "scroll-shooter": {
    name: "Scroll Shooter",
    component: MouseMaster as GameComponentType,
  },

  // ── ICT: Keyboard Ninja (extra game IDs) ─────────────────────────────────
  "key-mastery": {
    name: "Key Mastery",
    component: KeyboardNinja as GameComponentType,
  },
  "function-key-boss": {
    name: "Function Key Boss",
    component: KeyboardNinja as GameComponentType,
  },
  "symbol-sprint": {
    name: "Symbol Sprint",
    component: KeyboardNinja as GameComponentType,
  },
  "nav-warrior": {
    name: "Navigation Warrior",
    component: KeyboardNinja as GameComponentType,
  },

  // ── ICT: Typing Speed (extra game IDs) ───────────────────────────────────
  "typing-accuracy": {
    name: "Typing Accuracy",
    component: TypingSpeed as GameComponentType,
  },
  "typing-marathon": {
    name: "Typing Marathon",
    component: TypingSpeed as GameComponentType,
  },
  "blind-type": {
    name: "Blind Type Challenge",
    component: TypingSpeed as GameComponentType,
  },
  "code-typist": {
    name: "Code Typist",
    component: TypingSpeed as GameComponentType,
  },

  // ── ICT: Cyber Safety (extra game IDs) ───────────────────────────────────
  "privacy-shield": {
    name: "Privacy Shield",
    component: CyberSafety as GameComponentType,
  },
  "password-fortress": {
    name: "Password Fortress",
    component: CyberSafety as GameComponentType,
  },
  "virus-hunter": {
    name: "Virus Hunter",
    component: CyberSafety as GameComponentType,
  },
  "social-engineering-boss": {
    name: "Social Engineering Boss",
    component: CyberSafety as GameComponentType,
  },

  // ── ICT: Coding Basics (extra game IDs) ──────────────────────────────────
  "conditional-combat": {
    name: "Conditional Combat",
    component: CodingBasics as GameComponentType,
  },
  "loop-lab": {
    name: "Loop Lab",
    component: CodingBasics as GameComponentType,
  },
  "variable-vault": {
    name: "Variable Vault",
    component: CodingBasics as GameComponentType,
  },
  "function-factory": {
    name: "Function Factory",
    component: CodingBasics as GameComponentType,
  },

  // ── ICT: Operating System (extra game IDs) ────────────────────────────────
  "desktop-organizer": {
    name: "Desktop Organizer",
    component: gc(() => import("../games/OperatingSystem")),
  },

  // ── ICT: File & Folder Explorer ───────────────────────────────────────────
  "file-system-commander": {
    name: "File System Commander",
    component: gc(() => import("../games/FileFolderExplorer")),
  },
  "folder-organizer": {
    name: "Folder Organizer",
    component: gc(() => import("../games/FileFolderExplorer")),
  },
  "file-types-quiz": {
    name: "File Types Quiz",
    component: gc(() => import("../games/FileFolderExplorer")),
  },

  // ── ICT: Internet & Browser ───────────────────────────────────────────────
  "browser-quest": {
    name: "Browser Quest",
    component: gc(() => import("../games/InternetBrowser")),
  },
  "url-safety": {
    name: "URL Safety",
    component: gc(() => import("../games/InternetBrowser")),
  },
  "web-navigator": {
    name: "Web Navigator",
    component: gc(() => import("../games/InternetBrowser")),
  },

  // ── ICT: Microsoft Office ─────────────────────────────────────────────────
  "office-productivity": {
    name: "Office Productivity Arena",
    component: gc(() => import("../games/MicrosoftOffice")),
  },
  "document-formatter": {
    name: "Document Formatter",
    component: gc(() => import("../games/MicrosoftOffice")),
  },
  "spreadsheet-basics": {
    name: "Spreadsheet Basics",
    component: gc(() => import("../games/MicrosoftOffice")),
  },

  // ── ICT: Networking ───────────────────────────────────────────────────────
  "network-architect": {
    name: "Network Architect",
    component: gc(() => import("../games/NetworkingGame")),
  },
  "cable-router": {
    name: "Cable Router",
    component: gc(() => import("../games/NetworkingGame")),
  },
  "ip-addressing": {
    name: "IP Addressing",
    component: gc(() => import("../games/NetworkingGame")),
  },

  // ── ICT: Digital Creativity ───────────────────────────────────────────────
  "pixel-design-studio": {
    name: "Pixel Design Studio",
    component: gc(() => import("../games/DigitalCreativity")),
  },
  "color-theory": {
    name: "Color Theory",
    component: gc(() => import("../games/DigitalCreativity")),
  },
  "digital-art": {
    name: "Digital Art",
    component: gc(() => import("../games/DigitalCreativity")),
  },

  // ── ICT: Operating System ─────────────────────────────────────────────────
  "os-control-room": {
    name: "OS Control Room",
    component: gc(() => import("../games/OperatingSystem")),
  },
  "process-manager": {
    name: "Process Manager",
    component: gc(() => import("../games/OperatingSystem")),
  },
  "os-quiz": {
    name: "OS Quiz",
    component: gc(() => import("../games/OperatingSystem")),
  },

  // ── ICT: Cloud Computing ──────────────────────────────────────────────────
  "cloud-resource-manager": {
    name: "Cloud Resource Manager",
    component: gc(() => import("../games/CloudComputing")),
  },
  "cloud-quiz": {
    name: "Cloud Quiz",
    component: gc(() => import("../games/CloudComputing")),
  },
  "server-basics": {
    name: "Server Basics",
    component: gc(() => import("../games/CloudComputing")),
  },

  // ── ICT: Computer Engineering ─────────────────────────────────────────────
  "circuit-board-assembly": {
    name: "Circuit Board Assembly",
    component: gc(() => import("../games/ComputerEngineering")),
  },
  "component-quiz-eng": {
    name: "Component Quiz",
    component: gc(() => import("../games/ComputerEngineering")),
  },
  "pcb-designer": {
    name: "PCB Designer",
    component: gc(() => import("../games/ComputerEngineering")),
  },

  // ── Mathematics: Arithmetic Arena ────────────────────────────────────────
  "arithmetic-combat": {
    name: "Arithmetic Combat",
    component: gc(() => import("../games/math/ArithmeticArena")),
  },

  // ── Mathematics: Fractions Kingdom ───────────────────────────────────────
  "fraction-wars": {
    name: "Fraction Wars",
    component: gc(() => import("../games/math/FractionsKingdom")),
  },
  "fraction-wars-2": {
    name: "Fraction Wars 2",
    component: gc(() => import("../games/math/FractionsKingdom")),
  },
  "fraction-ops": {
    name: "Fraction Operations",
    component: gc(() => import("../games/math/FractionsKingdom")),
  },

  // ── Mathematics: Geometry Builder ────────────────────────────────────────
  "shape-architect": {
    name: "Shape Architect",
    component: gc(() => import("../games/math/GeometryBuilder")),
  },
  "geometry-quest": {
    name: "Geometry Quest",
    component: gc(() => import("../games/math/GeometryBuilder")),
  },
  "area-perimeter": {
    name: "Area and Perimeter",
    component: gc(() => import("../games/math/GeometryBuilder")),
  },

  // ── Mathematics: Algebra Adventure ───────────────────────────────────────
  "equation-quest": {
    name: "Equation Quest",
    component: gc(() => import("../games/math/AlgebraAdventure")),
  },
  "algebra-boss": {
    name: "Algebra Boss",
    component: gc(() => import("../games/math/AlgebraAdventure")),
  },
  "variable-hunt": {
    name: "Variable Hunt",
    component: gc(() => import("../games/math/AlgebraAdventure")),
  },

  // ── Mathematics: Statistics Challenge ────────────────────────────────────
  "data-detective": {
    name: "Data Detective",
    component: gc(() => import("../games/math/StatisticsChallenge")),
  },
  "stats-race": {
    name: "Stats Race",
    component: gc(() => import("../games/math/StatisticsChallenge")),
  },
  "probability-quest": {
    name: "Probability Quest",
    component: gc(() => import("../games/math/StatisticsChallenge")),
  },

  // ── Mathematics: Money Math ───────────────────────────────────────────────
  "market-merchant": {
    name: "Market Merchant",
    component: gc(() => import("../games/math/MoneyMath")),
  },
  "coin-counter": {
    name: "Coin Counter",
    component: gc(() => import("../games/math/MoneyMath")),
  },
  "budget-builder": {
    name: "Budget Builder",
    component: gc(() => import("../games/math/MoneyMath")),
  },

  // ── Mathematics: Measurement Lab ─────────────────────────────────────────
  "measurement-mission": {
    name: "Measurement Mission",
    component: gc(() => import("../games/math/MeasurementLab")),
  },
  "measure-master": {
    name: "Measure Master",
    component: gc(() => import("../games/math/MeasurementLab")),
  },
  "unit-converter": {
    name: "Unit Converter",
    component: gc(() => import("../games/math/MeasurementLab")),
  },

  // ── Mathematics: Time & Speed ─────────────────────────────────────────────
  "time-trial-racer": {
    name: "Time Trial Racer",
    component: gc(() => import("../games/math/TimeSpeed")),
  },
  "speed-calculator": {
    name: "Speed Calculator",
    component: gc(() => import("../games/math/TimeSpeed")),
  },
  "clock-master": {
    name: "Clock Master",
    component: gc(() => import("../games/math/TimeSpeed")),
  },

  // ── Mathematics: Graphing Systems ─────────────────────────────────────────
  "graph-navigator": {
    name: "Graph Navigator",
    component: gc(() => import("../games/math/GraphingSystems")),
  },
  "coordinate-quest": {
    name: "Coordinate Quest",
    component: gc(() => import("../games/math/GraphingSystems")),
  },
  "line-plotter": {
    name: "Line Plotter",
    component: gc(() => import("../games/math/GraphingSystems")),
  },

  // ── Mathematics: Mathematical Reasoning ──────────────────────────────────
  "logic-chain": {
    name: "Logic Chain",
    component: gc(() => import("../games/math/MathematicalReasoning")),
  },
  "number-patterns": {
    name: "Number Patterns",
    component: gc(() => import("../games/math/MathematicalReasoning")),
  },
  "sequence-master": {
    name: "Sequence Master",
    component: gc(() => import("../games/math/MathematicalReasoning")),
  },

  // ── Mathematics: Mental Math ──────────────────────────────────────────────
  "mental-sprint": {
    name: "Mental Math Sprint",
    component: gc(() => import("../games/math/MentalMath")),
  },
  "speed-arithmetic": {
    name: "Speed Arithmetic",
    component: gc(() => import("../games/math/MentalMath")),
  },
  "flash-math": {
    name: "Flash Math",
    component: gc(() => import("../games/math/MentalMath")),
  },

  // ── Mathematics: Magic Mathematics ───────────────────────────────────────
  "vedic-dojo": {
    name: "Vedic Math Dojo",
    component: gc(() => import("../games/math/MagicMathematics")),
  },
  "abacus-master": {
    name: "Abacus Master",
    component: gc(() => import("../games/math/MagicMathematics")),
  },
  "shortcut-wizard": {
    name: "Shortcut Wizard",
    component: gc(() => import("../games/math/MagicMathematics")),
  },

  // ── Science: Human Body ───────────────────────────────────────────────────
  "anatomy-surgeon": {
    name: "Anatomy Surgeon",
    component: gc(() => import("../games/science/HumanBody")),
  },
  "organ-quiz": {
    name: "Organ Quiz",
    component: gc(() => import("../games/science/HumanBody")),
  },
  "body-systems": {
    name: "Body Systems",
    component: gc(() => import("../games/science/HumanBody")),
  },

  // ── Science: Plants & Animals ─────────────────────────────────────────────
  "ecosystem-architect": {
    name: "Ecosystem Architect",
    component: gc(() => import("../games/science/PlantsAnimals")),
  },
  "food-web": {
    name: "Food Web",
    component: gc(() => import("../games/science/PlantsAnimals")),
  },
  "classify-life": {
    name: "Classify Life",
    component: gc(() => import("../games/science/PlantsAnimals")),
  },

  // ── Science: Space Science ────────────────────────────────────────────────
  "mission-control": {
    name: "Mission Control",
    component: gc(() => import("../games/science/SpaceScience")),
  },
  "planet-quiz": {
    name: "Planet Quiz",
    component: gc(() => import("../games/science/SpaceScience")),
  },
  "star-navigator": {
    name: "Star Navigator",
    component: gc(() => import("../games/science/SpaceScience")),
  },

  // ── Science: Chemistry Lab ────────────────────────────────────────────────
  "lab-reaction": {
    name: "Lab Reaction Engine",
    component: gc(() => import("../games/science/ChemistryLab")),
  },
  "element-quiz": {
    name: "Element Quiz",
    component: gc(() => import("../games/science/ChemistryLab")),
  },
  "periodic-explorer": {
    name: "Periodic Explorer",
    component: gc(() => import("../games/science/ChemistryLab")),
  },

  // ── Science: Electricity ──────────────────────────────────────────────────
  "circuit-builder-sci": {
    name: "Circuit Builder",
    component: gc(() => import("../games/science/Electricity")),
  },
  "ohms-law": {
    name: "Ohm's Law",
    component: gc(() => import("../games/science/Electricity")),
  },
  "circuit-quiz": {
    name: "Circuit Quiz",
    component: gc(() => import("../games/science/Electricity")),
  },

  // ── Science: Matter & Materials ───────────────────────────────────────────
  "states-of-matter": {
    name: "States of Matter",
    component: gc(() => import("../games/science/MatterMaterials")),
  },
  "classify-matter": {
    name: "Classify Matter",
    component: gc(() => import("../games/science/MatterMaterials")),
  },
  "particle-theory": {
    name: "Particle Theory",
    component: gc(() => import("../games/science/MatterMaterials")),
  },

  // ── Science: Weather & Climate ────────────────────────────────────────────
  "weather-predictor": {
    name: "Weather Predictor",
    component: gc(() => import("../games/science/WeatherClimate")),
  },
  "climate-quiz": {
    name: "Climate Quiz",
    component: gc(() => import("../games/science/WeatherClimate")),
  },
  "storm-tracker": {
    name: "Storm Tracker",
    component: gc(() => import("../games/science/WeatherClimate")),
  },

  // ── Science: Physics Motion ───────────────────────────────────────────────
  "projectile-lab": {
    name: "Projectile Lab",
    component: gc(() => import("../games/science/PhysicsMotion")),
  },
  "force-quiz": {
    name: "Force Quiz",
    component: gc(() => import("../games/science/PhysicsMotion")),
  },
  "newton-challenge": {
    name: "Newton Challenge",
    component: gc(() => import("../games/science/PhysicsMotion")),
  },

  // ── Science: Environmental Science ───────────────────────────────────────
  "planet-guardian": {
    name: "Planet Guardian",
    component: gc(() => import("../games/science/EnvironmentalScience")),
  },
  "eco-quiz": {
    name: "Eco Quiz",
    component: gc(() => import("../games/science/EnvironmentalScience")),
  },
  "carbon-cycle": {
    name: "Carbon Cycle",
    component: gc(() => import("../games/science/EnvironmentalScience")),
  },

  // ── Science: Earth Science ────────────────────────────────────────────────
  "geological-survey": {
    name: "Geological Survey",
    component: gc(() => import("../games/science/EarthScience")),
  },
  "rock-cycle": {
    name: "Rock Cycle",
    component: gc(() => import("../games/science/EarthScience")),
  },
  "fossil-finder": {
    name: "Fossil Finder",
    component: gc(() => import("../games/science/EarthScience")),
  },

  // ── Science: Renewable Energy ─────────────────────────────────────────────
  "energy-grid": {
    name: "Energy Grid Commander",
    component: gc(() => import("../games/science/RenewableEnergy")),
  },
  "solar-quiz": {
    name: "Solar Quiz",
    component: gc(() => import("../games/science/RenewableEnergy")),
  },
  "clean-power": {
    name: "Clean Power",
    component: gc(() => import("../games/science/RenewableEnergy")),
  },

  // ── Science: Scientific Investigation ────────────────────────────────────
  "hypothesis-lab": {
    name: "Hypothesis Lab",
    component: gc(() => import("../games/science/ScientificInvestigation")),
  },
  "experiment-designer": {
    name: "Experiment Designer",
    component: gc(() => import("../games/science/ScientificInvestigation")),
  },
  "data-analyst": {
    name: "Data Analyst",
    component: gc(() => import("../games/science/ScientificInvestigation")),
  },

  // ── English: Grammar City ─────────────────────────────────────────────────
  "grammar-police": {
    name: "Grammar Police",
    component: gc(() => import("../games/english/GrammarCity")),
  },
  "grammar-quiz": {
    name: "Grammar Quiz",
    component: gc(() => import("../games/english/GrammarCity")),
  },
  "sentence-builder": {
    name: "Sentence Builder",
    component: gc(() => import("../games/english/GrammarCity")),
  },

  // ── English: Vocabulary Quest ─────────────────────────────────────────────
  "word-hunter": {
    name: "Word Hunter",
    component: gc(() => import("../games/english/VocabularyQuest")),
  },
  "vocabulary-match": {
    name: "Vocabulary Match",
    component: gc(() => import("../games/english/VocabularyQuest")),
  },
  "synonym-sprint": {
    name: "Synonym Sprint",
    component: gc(() => import("../games/english/VocabularyQuest")),
  },

  // ── English: Reading Adventure ────────────────────────────────────────────
  "story-speed-reader": {
    name: "Story Speed Reader",
    component: gc(() => import("../games/english/ReadingAdventure")),
  },
  "comprehension-quest": {
    name: "Comprehension Quest",
    component: gc(() => import("../games/english/ReadingAdventure")),
  },
  "inference-master": {
    name: "Inference Master",
    component: gc(() => import("../games/english/ReadingAdventure")),
  },

  // ── English: Pronunciation Studio ────────────────────────────────────────
  "phonics-decoder": {
    name: "Phonics Decoder",
    component: gc(() => import("../games/english/PronunciationStudio")),
  },
  "syllable-stress": {
    name: "Syllable Stress",
    component: gc(() => import("../games/english/PronunciationStudio")),
  },
  "phoneme-match": {
    name: "Phoneme Match",
    component: gc(() => import("../games/english/PronunciationStudio")),
  },

  // ── English: Story Builder ────────────────────────────────────────────────
  "plot-architect": {
    name: "Plot Architect",
    component: gc(() => import("../games/english/StoryBuilder")),
  },
  "story-sequence": {
    name: "Story Sequence",
    component: gc(() => import("../games/english/StoryBuilder")),
  },
  "narrative-master": {
    name: "Narrative Master",
    component: gc(() => import("../games/english/StoryBuilder")),
  },

  // ── English: Poetry & Literature ──────────────────────────────────────────
  "verse-analyzer": {
    name: "Verse Analyzer",
    component: gc(() => import("../games/english/PoetryLiterature")),
  },
  "rhyme-scheme": {
    name: "Rhyme Scheme",
    component: gc(() => import("../games/english/PoetryLiterature")),
  },
  "device-identifier": {
    name: "Device Identifier",
    component: gc(() => import("../games/english/PoetryLiterature")),
  },

  // ── English: Spelling Kingdom ─────────────────────────────────────────────
  "spelling-champion": {
    name: "Spelling Champion",
    component: gc(() => import("../games/english/SpellingKingdom")),
  },
  "spelling-bee": {
    name: "Spelling Bee",
    component: gc(() => import("../games/english/SpellingKingdom")),
  },
  "word-spell": {
    name: "Word Spell",
    component: gc(() => import("../games/english/SpellingKingdom")),
  },

  // ── English: Listening Challenge ──────────────────────────────────────────
  "audio-detective": {
    name: "Audio Detective",
    component: gc(() => import("../games/english/ListeningChallenge")),
  },
  "dialogue-master": {
    name: "Dialogue Master",
    component: gc(() => import("../games/english/ListeningChallenge")),
  },
  "listening-quiz": {
    name: "Listening Quiz",
    component: gc(() => import("../games/english/ListeningChallenge")),
  },

  // ── English: Public Speaking ──────────────────────────────────────────────
  "speech-architect": {
    name: "Speech Architect",
    component: gc(() => import("../games/english/PublicSpeaking")),
  },
  "presentation-builder": {
    name: "Presentation Builder",
    component: gc(() => import("../games/english/PublicSpeaking")),
  },
  "speech-structure": {
    name: "Speech Structure",
    component: gc(() => import("../games/english/PublicSpeaking")),
  },

  // ── English: Debate Arena ─────────────────────────────────────────────────
  "argument-gladiator": {
    name: "Argument Gladiator",
    component: gc(() => import("../games/english/DebateArena")),
  },
  "rebuttal-master": {
    name: "Rebuttal Master",
    component: gc(() => import("../games/english/DebateArena")),
  },
  "debate-quiz": {
    name: "Debate Quiz",
    component: gc(() => import("../games/english/DebateArena")),
  },

  // ── English: Communication Skills ────────────────────────────────────────
  "social-situations": {
    name: "Social Situations",
    component: gc(() => import("../games/english/CommunicationSkills")),
  },
  "register-master": {
    name: "Register Master",
    component: gc(() => import("../games/english/CommunicationSkills")),
  },
  "communicate-well": {
    name: "Communicate Well",
    component: gc(() => import("../games/english/CommunicationSkills")),
  },

  // ── English: Creative Writing ─────────────────────────────────────────────
  "story-forge": {
    name: "Story Forge",
    component: gc(() => import("../games/english/CreativeWriting")),
  },
  "creative-challenge": {
    name: "Creative Challenge",
    component: gc(() => import("../games/english/CreativeWriting")),
  },
  "write-master": {
    name: "Write Master",
    component: gc(() => import("../games/english/CreativeWriting")),
  },

  // ── Robotics: Robot Building ──────────────────────────────────────────────
  "assembly-line": {
    name: "Assembly Line",
    component: gc(() => import("../games/robotics/RobotBuilding")),
  },
  "robot-quiz": {
    name: "Robot Quiz",
    component: gc(() => import("../games/robotics/RobotBuilding")),
  },
  "part-identifier": {
    name: "Part Identifier",
    component: gc(() => import("../games/robotics/RobotBuilding")),
  },

  // ── Robotics: Sensors Hub ─────────────────────────────────────────────────
  "sensor-interpreter": {
    name: "Sensor Data Interpreter",
    component: gc(() => import("../games/robotics/SensorsHub")),
  },
  "sensor-quiz": {
    name: "Sensor Quiz",
    component: gc(() => import("../games/robotics/SensorsHub")),
  },
  "threshold-master": {
    name: "Threshold Master",
    component: gc(() => import("../games/robotics/SensorsHub")),
  },

  // ── Robotics: Circuits Hub ────────────────────────────────────────────────
  "electronic-lab-rob": {
    name: "Electronic Circuit Lab",
    component: gc(() => import("../games/robotics/CircuitsHub")),
  },
  "breadboard-builder": {
    name: "Breadboard Builder",
    component: gc(() => import("../games/robotics/CircuitsHub")),
  },
  "component-quiz": {
    name: "Component Quiz",
    component: gc(() => import("../games/robotics/CircuitsHub")),
  },

  // ── Robotics: Coding Robots ───────────────────────────────────────────────
  "block-code-commander": {
    name: "Block Code Commander",
    component: gc(() => import("../games/robotics/CodingRobots")),
  },
  "robot-maze": {
    name: "Robot Maze",
    component: gc(() => import("../games/robotics/CodingRobots")),
  },
  "logic-sequencer": {
    name: "Logic Sequencer",
    component: gc(() => import("../games/robotics/CodingRobots")),
  },

  // ── Robotics: AI & Automation ─────────────────────────────────────────────
  "ml-trainer": {
    name: "Machine Learning Trainer",
    component: gc(() => import("../games/robotics/AiAutomation")),
  },
  "classifier-quiz": {
    name: "Classifier Quiz",
    component: gc(() => import("../games/robotics/AiAutomation")),
  },
  "ai-concepts": {
    name: "AI Concepts",
    component: gc(() => import("../games/robotics/AiAutomation")),
  },

  // ── Robotics: Electronics Lab ─────────────────────────────────────────────
  "component-identifier": {
    name: "Component Identifier",
    component: gc(() => import("../games/robotics/ElectronicsLab")),
  },
  "resistor-reader": {
    name: "Resistor Reader",
    component: gc(() => import("../games/robotics/ElectronicsLab")),
  },
  "circuit-symbols": {
    name: "Circuit Symbols",
    component: gc(() => import("../games/robotics/ElectronicsLab")),
  },

  // ── Robotics: Machine Logic ───────────────────────────────────────────────
  "logic-gate-network": {
    name: "Logic Gate Network",
    component: gc(() => import("../games/robotics/MachineLogic")),
  },
  "truth-table": {
    name: "Truth Table",
    component: gc(() => import("../games/robotics/MachineLogic")),
  },
  "boolean-master": {
    name: "Boolean Master",
    component: gc(() => import("../games/robotics/MachineLogic")),
  },

  // ── Robotics: Drone Systems ───────────────────────────────────────────────
  "drone-pilot": {
    name: "Drone Pilot Academy",
    component: gc(() => import("../games/robotics/DroneSystems")),
  },
  "flight-physics": {
    name: "Flight Physics",
    component: gc(() => import("../games/robotics/DroneSystems")),
  },
  "navigation-quiz": {
    name: "Navigation Quiz",
    component: gc(() => import("../games/robotics/DroneSystems")),
  },

  // ── Robotics: Smart Home ──────────────────────────────────────────────────
  "smart-home-automator": {
    name: "Smart Home Automator",
    component: gc(() => import("../games/robotics/SmartHome")),
  },
  "iot-quiz": {
    name: "IoT Quiz",
    component: gc(() => import("../games/robotics/SmartHome")),
  },
  "automation-builder": {
    name: "Automation Builder",
    component: gc(() => import("../games/robotics/SmartHome")),
  },

  // ── Robotics: Mechanical Engineering ─────────────────────────────────────
  "gear-ratio-lab": {
    name: "Machine Design Lab",
    component: gc(() => import("../games/robotics/MechanicalEngineering")),
  },
  "pulley-system": {
    name: "Pulley System",
    component: gc(() => import("../games/robotics/MechanicalEngineering")),
  },
  "machine-design": {
    name: "Machine Design",
    component: gc(() => import("../games/robotics/MechanicalEngineering")),
  },

  // ── Robotics: Industrial Automation ──────────────────────────────────────
  "factory-controller": {
    name: "Factory Floor Controller",
    component: gc(() => import("../games/robotics/IndustrialAutomation")),
  },
  "plc-sequencer": {
    name: "PLC Sequencer",
    component: gc(() => import("../games/robotics/IndustrialAutomation")),
  },
  "process-quiz": {
    name: "Process Quiz",
    component: gc(() => import("../games/robotics/IndustrialAutomation")),
  },

  // ── Robotics: Mechatronics ────────────────────────────────────────────────
  "system-integration": {
    name: "System Integration Challenge",
    component: gc(() => import("../games/robotics/Mechatronics")),
  },
  "mechatronics-quiz": {
    name: "Mechatronics Quiz",
    component: gc(() => import("../games/robotics/Mechatronics")),
  },
  "integration-challenge": {
    name: "Integration Challenge",
    component: gc(() => import("../games/robotics/Mechatronics")),
  },

  // ── Critical Thinking: Logic Puzzle ──────────────────────────────────────
  "logic-grid-master": {
    name: "Logic Grid Master",
    component: gc(() => import("../games/criticalthinking/LogicPuzzle")),
  },
  "logic-quiz": {
    name: "Logic Quiz",
    component: gc(() => import("../games/criticalthinking/LogicPuzzle")),
  },
  "deduction-master": {
    name: "Deduction Master",
    component: gc(() => import("../games/criticalthinking/LogicPuzzle")),
  },

  // ── Critical Thinking: Memory Training ───────────────────────────────────
  "memory-matrix": {
    name: "Memory Matrix",
    component: gc(() => import("../games/criticalthinking/MemoryTraining")),
  },
  "memory-sequence": {
    name: "Memory Sequence",
    component: gc(() => import("../games/criticalthinking/MemoryTraining")),
  },
  "recall-challenge": {
    name: "Recall Challenge",
    component: gc(() => import("../games/criticalthinking/MemoryTraining")),
  },

  // ── Critical Thinking: Strategy Games ────────────────────────────────────
  "tactical-conquest": {
    name: "Tactical Conquest",
    component: gc(() => import("../games/criticalthinking/StrategyGames")),
  },
  "strategy-quiz": {
    name: "Strategy Quiz",
    component: gc(() => import("../games/criticalthinking/StrategyGames")),
  },
  "battle-planner": {
    name: "Battle Planner",
    component: gc(() => import("../games/criticalthinking/StrategyGames")),
  },

  // ── Critical Thinking: Brain Teasers ──────────────────────────────────────
  "riddle-gauntlet": {
    name: "Riddle Gauntlet",
    component: gc(() => import("../games/criticalthinking/BrainTeasers")),
  },
  "paradox-solver": {
    name: "Paradox Solver",
    component: gc(() => import("../games/criticalthinking/BrainTeasers")),
  },
  "lateral-thinking": {
    name: "Lateral Thinking",
    component: gc(() => import("../games/criticalthinking/BrainTeasers")),
  },

  // ── Critical Thinking: Coding Logic ──────────────────────────────────────
  "algorithm-debugger": {
    name: "Algorithm Debugger",
    component: gc(() => import("../games/criticalthinking/CodingLogic")),
  },
  "flowchart-tracer": {
    name: "Flowchart Tracer",
    component: gc(() => import("../games/criticalthinking/CodingLogic")),
  },
  "bug-hunt": {
    name: "Bug Hunt",
    component: gc(() => import("../games/criticalthinking/CodingLogic")),
  },

  // ── Critical Thinking: Escape Room ───────────────────────────────────────
  "digital-escape-room": {
    name: "Digital Escape Room",
    component: gc(() => import("../games/criticalthinking/EscapeRoom")),
  },
  "cipher-master": {
    name: "Cipher Master",
    component: gc(() => import("../games/criticalthinking/EscapeRoom")),
  },
  "puzzle-chain": {
    name: "Puzzle Chain",
    component: gc(() => import("../games/criticalthinking/EscapeRoom")),
  },

  // ── Critical Thinking: Pattern Recognition ────────────────────────────────
  "pattern-analyst": {
    name: "Pattern Analyst",
    component: gc(() => import("../games/criticalthinking/PatternRecognition")),
  },
  "sequence-finder": {
    name: "Sequence Finder",
    component: gc(() => import("../games/criticalthinking/PatternRecognition")),
  },
  "matrix-solver": {
    name: "Matrix Solver",
    component: gc(() => import("../games/criticalthinking/PatternRecognition")),
  },

  // ── Critical Thinking: Detective Investigation ────────────────────────────
  "case-file-investigator": {
    name: "Case File Investigator",
    component: gc(
      () => import("../games/criticalthinking/DetectiveInvestigation"),
    ),
  },
  "evidence-chain": {
    name: "Evidence Chain",
    component: gc(
      () => import("../games/criticalthinking/DetectiveInvestigation"),
    ),
  },
  "suspect-list": {
    name: "Suspect List",
    component: gc(
      () => import("../games/criticalthinking/DetectiveInvestigation"),
    ),
  },

  // ── Critical Thinking: Strategic Planning ────────────────────────────────
  "city-planner": {
    name: "City Planner",
    component: gc(() => import("../games/criticalthinking/StrategicPlanning")),
  },
  "resource-allocator": {
    name: "Resource Allocator",
    component: gc(() => import("../games/criticalthinking/StrategicPlanning")),
  },
  "strategy-builder": {
    name: "Strategy Builder",
    component: gc(() => import("../games/criticalthinking/StrategicPlanning")),
  },

  // ── Critical Thinking: Innovation Lab ────────────────────────────────────
  "invention-workshop": {
    name: "Invention Workshop",
    component: gc(() => import("../games/criticalthinking/InnovationLab")),
  },
  "design-thinker": {
    name: "Design Thinker",
    component: gc(() => import("../games/criticalthinking/InnovationLab")),
  },
  "innovation-quiz": {
    name: "Innovation Quiz",
    component: gc(() => import("../games/criticalthinking/InnovationLab")),
  },

  // ── Critical Thinking: Decision Making ───────────────────────────────────
  "consequence-simulator": {
    name: "Consequence Simulator",
    component: gc(() => import("../games/criticalthinking/DecisionMaking")),
  },
  "choice-tree": {
    name: "Choice Tree",
    component: gc(() => import("../games/criticalthinking/DecisionMaking")),
  },
  "outcome-predictor": {
    name: "Outcome Predictor",
    component: gc(() => import("../games/criticalthinking/DecisionMaking")),
  },

  // ── Critical Thinking: Problem Solving ───────────────────────────────────
  "challenge-gauntlet": {
    name: "Challenge Gauntlet",
    component: gc(() => import("../games/criticalthinking/ProblemSolving")),
  },
  "constraint-solver": {
    name: "Constraint Solver",
    component: gc(() => import("../games/criticalthinking/ProblemSolving")),
  },
  "optimization-lab": {
    name: "Optimization Lab",
    component: gc(() => import("../games/criticalthinking/ProblemSolving")),
  },
};

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Beginner",
  2: "Advanced",
  3: "Expert",
};

// Map game/subject IDs to ambience context keys
const SUBJECT_AMBIENCE_MAP: Record<string, string> = {
  ict: "ict",
  math: "math",
  mathematics: "math",
  science: "science",
  english: "english",
  robotics: "robotics",
  critical: "critical",
  criticalthinking: "critical",
};

function getAmbienceForGame(id: string): string {
  const lower = id.toLowerCase();
  if (
    lower.includes("arithmetic") ||
    lower.includes("fraction") ||
    lower.includes("geometry") ||
    lower.includes("algebra") ||
    lower.includes("stats") ||
    lower.includes("money") ||
    lower.includes("measurement") ||
    lower.includes("time-trial") ||
    lower.includes("graph") ||
    lower.includes("math") ||
    lower.includes("mental") ||
    lower.includes("vedic") ||
    lower.includes("abacus") ||
    lower.includes("number") ||
    lower.includes("sequence") ||
    lower.includes("speed-arith") ||
    lower.includes("flash") ||
    lower.includes("coordinate") ||
    lower.includes("logic-chain") ||
    lower.includes("shortcut")
  )
    return "math";
  if (
    lower.includes("mouse") ||
    lower.includes("keyboard") ||
    lower.includes("typing") ||
    lower.includes("cyber") ||
    lower.includes("coding") ||
    lower.includes("network") ||
    lower.includes("cloud") ||
    lower.includes("os-") ||
    lower.includes("file") ||
    lower.includes("browser") ||
    lower.includes("office") ||
    lower.includes("digital") ||
    lower.includes("circuit-board") ||
    lower.includes("pcb") ||
    lower.includes("desktop") ||
    lower.includes("scroll") ||
    lower.includes("function-key") ||
    lower.includes("symbol")
  )
    return "ict";
  if (
    lower.includes("anatomy") ||
    lower.includes("organ") ||
    lower.includes("ecosystem") ||
    lower.includes("space") ||
    lower.includes("lab-reaction") ||
    lower.includes("element") ||
    lower.includes("periodic") ||
    lower.includes("circuit-builder-sci") ||
    lower.includes("ohms") ||
    lower.includes("states-of-matter") ||
    lower.includes("weather") ||
    lower.includes("projectile") ||
    lower.includes("planet") ||
    lower.includes("star-nav") ||
    lower.includes("renewable") ||
    lower.includes("geological") ||
    lower.includes("fossil") ||
    lower.includes("carbon") ||
    lower.includes("hypothesis") ||
    lower.includes("experiment")
  )
    return "science";
  if (
    lower.includes("grammar") ||
    lower.includes("vocabulary") ||
    lower.includes("reading") ||
    lower.includes("phonics") ||
    lower.includes("spelling") ||
    lower.includes("listening") ||
    lower.includes("public-speaking") ||
    lower.includes("debate") ||
    lower.includes("communication") ||
    lower.includes("creative-writing") ||
    lower.includes("story") ||
    lower.includes("poetry") ||
    lower.includes("pronunciation") ||
    lower.includes("word-hunter") ||
    lower.includes("synonym")
  )
    return "english";
  if (
    lower.includes("assembly") ||
    lower.includes("robot") ||
    lower.includes("sensor") ||
    lower.includes("breadboard") ||
    lower.includes("block-code") ||
    lower.includes("ml-") ||
    lower.includes("classifier") ||
    lower.includes("ai-concepts") ||
    lower.includes("resistor") ||
    lower.includes("component") ||
    lower.includes("logic-gate") ||
    lower.includes("truth-table") ||
    lower.includes("drone") ||
    lower.includes("smart-home") ||
    lower.includes("gear") ||
    lower.includes("pulley") ||
    lower.includes("factory") ||
    lower.includes("plc") ||
    lower.includes("mechatronics") ||
    lower.includes("integration")
  )
    return "robotics";
  if (
    lower.includes("logic-grid") ||
    lower.includes("memory-matrix") ||
    lower.includes("tactical") ||
    lower.includes("riddle") ||
    lower.includes("paradox") ||
    lower.includes("lateral") ||
    lower.includes("algorithm") ||
    lower.includes("flowchart") ||
    lower.includes("bug-hunt") ||
    lower.includes("escape") ||
    lower.includes("cipher") ||
    lower.includes("pattern") ||
    lower.includes("case-file") ||
    lower.includes("evidence") ||
    lower.includes("suspect") ||
    lower.includes("city-planner") ||
    lower.includes("resource-alloc") ||
    lower.includes("invention") ||
    lower.includes("design-think") ||
    lower.includes("consequence") ||
    lower.includes("choice-tree") ||
    lower.includes("challenge-gauntlet") ||
    lower.includes("constraint") ||
    lower.includes("optimization")
  )
    return "critical";
  return "ict";
}

export default function GamePage() {
  const { gameId } = useParams({ strict: false }) as { gameId: string };
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [showNarration, setShowNarration] = useState(true);
  const { mutateAsync: recordScore } = useMutateRecordScore();
  const { mutateAsync: applyProgress } = useMutateApplyProgressUpdate();
  const { playAmbience, stopAmbience, playEffect } = useAudioContext();

  const meta = GAME_META[gameId];

  // Start subject ambience on mount; stop on unmount
  useEffect(() => {
    const ambienceKey = getAmbienceForGame(gameId);
    playAmbience(ambienceKey);
    return () => stopAmbience();
  }, [gameId, playAmbience, stopAmbience]);

  // Wire game feedback events to audio + feel effects
  useEffect(() => {
    const handleEffect = (e: Event) => {
      const { type } = (
        e as CustomEvent<{ type: "correct" | "wrong" | "achievement" }>
      ).detail;
      if (type === "correct") playEffect("correct");
      else if (type === "wrong") playEffect("wrong");
      else if (type === "achievement") playEffect("achievement");
    };
    window.addEventListener("gamefeel", handleEffect);
    return () => window.removeEventListener("gamefeel", handleEffect);
  }, [playEffect]);

  if (!meta) {
    navigate({ to: "/world-map" });
    return null;
  }

  const config: GameConfig = {
    gameId,
    gameName: meta.name,
    difficulty,
    timeLimit: difficulty === 1 ? 60 : difficulty === 2 ? 90 : 120,
    livesCount: difficulty === 1 ? 5 : difficulty === 2 ? 3 : 3,
  };

  async function handleGameEnd(result: GameResult) {
    try {
      await recordScore({
        gameId: result.gameId,
        score: BigInt(result.score),
        accuracy: BigInt(Math.round(result.accuracy)),
        timeSpent: BigInt(result.timeSpent),
      });
      await applyProgress({
        xpEarned: BigInt(result.xpEarned),
        coinsEarned: BigInt(result.coinsEarned),
        playTimeSeconds: BigInt(result.timeSpent),
        dateString: new Date().toISOString().split("T")[0],
      });
    } catch {
      // Silently fail — navigate anyway
    }
    navigate({
      to: "/results/$gameId",
      params: { gameId },
      state: { result } as Record<string, unknown>,
    });
  }

  const GameComponent = meta.component;

  return (
    <GameFeelProvider>
      <div
        className="min-h-screen bg-background flex flex-col"
        data-ocid="game.page"
      >
        {/* Pre-game narration panel */}
        <AnimatePresence>
          {showNarration && (
            <NarrationPanel
              gameId={gameId}
              onComplete={() => setShowNarration(false)}
              onSkip={() => setShowNarration(false)}
            />
          )}
        </AnimatePresence>
        {/* Top HUD bar */}
        <div className="game-hud shrink-0 flex items-center justify-between gap-3 m-3 mb-0 rounded-xl neon-top-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/world-map" })}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth text-sm"
            data-ocid="game.back_button"
          >
            <X className="h-4 w-4" /> Quit
          </button>

          <h1
            className="text-sm font-black uppercase tracking-widest glow-cyan-text"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {meta.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDifficultyPicker((p) => !p)}
                className="flex items-center gap-1 text-xs border border-[#7c3aed]/50 text-[#7c3aed] rounded-lg px-2 py-1 hover:bg-[#7c3aed]/10 transition-smooth"
                data-ocid="game.difficulty_toggle"
              >
                {DIFFICULTY_LABELS[difficulty]}
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {showDifficultyPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-8 glass-card rounded-lg border border-border/30 z-50 overflow-hidden"
                    data-ocid="game.difficulty_menu"
                  >
                    {([1, 2, 3] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDifficulty(d);
                          setGameKey((k) => k + 1);
                          setShowDifficultyPicker(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#7c3aed]/10 transition-smooth ${
                          difficulty === d
                            ? "text-[#7c3aed] font-bold"
                            : "text-muted-foreground"
                        }`}
                        data-ocid={`game.difficulty_option.${d}`}
                      >
                        {DIFFICULTY_LABELS[d]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="p-1.5 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-border transition-smooth"
              aria-label={isPaused ? "Resume game" : "Pause game"}
              data-ocid="game.pause_button"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Game area */}
        <div className="flex-1 relative p-3 overflow-hidden">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#00f5ff] border-t-transparent animate-spin" />
              </div>
            }
          >
            <GameComponent
              key={gameKey}
              config={config}
              onGameEnd={handleGameEnd}
            />
          </Suspense>

          <AnimatePresence>
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-40"
                data-ocid="game.pause_overlay"
              >
                <div className="glass-card rounded-2xl p-10 text-center border border-[#7c3aed]/30">
                  <h2
                    className="text-3xl font-black glow-purple-text mb-2"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    PAUSED
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Game is paused
                  </p>
                  <div className="flex flex-col gap-3">
                    <GlowButton
                      variant="primary"
                      size="md"
                      onClick={() => setIsPaused(false)}
                      data-ocid="game.resume_button"
                    >
                      <Play className="h-4 w-4" /> Resume
                    </GlowButton>
                    <GlowButton
                      variant="ghost"
                      size="md"
                      onClick={() => navigate({ to: "/world-map" })}
                      data-ocid="game.quit_button"
                    >
                      <X className="h-4 w-4" /> Quit to Map
                    </GlowButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameFeelProvider>
  );
}
