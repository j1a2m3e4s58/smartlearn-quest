export type {
  UserProfileView,
  ProgressionView,
  ScoreRecord,
  HubProgress,
  LeaderboardEntry,
  RegisterInput,
  ScoreInput,
  HubProgressUpdate,
  ProgressUpdate,
  Result,
  Result_1,
  Result_2,
  Result_4,
  Error_,
} from "@/backend";
export { GradeLevel, UserRole, UserRole__1 } from "@/backend";

// Frontend-only game data types
export type SubjectId =
  | "ict"
  | "mathematics"
  | "science"
  | "english"
  | "robotics"
  | "criticalThinking";

export type HubId =
  | "mouseMaster"
  | "keyboardNinja"
  | "fileFolder"
  | "internetBrowser"
  | "typingSpeed"
  | "microsoftOffice"
  | "codingBasics"
  | "cyberSafety"
  | "networking"
  | "digitalCreativity"
  | "operatingSystem"
  | "cloudComputing"
  | "computerEngineering"
  | "arithmeticArena"
  | "fractionsKingdom"
  | "geometryBuilder"
  | "algebraAdventure"
  | "statisticsChallenge"
  | "moneyMath"
  | "measurementLab"
  | "timeSpeed"
  | "graphingSystems"
  | "mathematicalReasoning"
  | "mentalMath"
  | "magicMathematics"
  | "humanBody"
  | "plantsAnimals"
  | "spaceScience"
  | "chemistryLab"
  | "electricity"
  | "matterMaterials"
  | "weatherClimate"
  | "physicsMotion"
  | "environmentalScience"
  | "earthScience"
  | "renewableEnergy"
  | "scientificInvestigation"
  | "grammarCity"
  | "vocabularyQuest"
  | "readingAdventure"
  | "pronunciationStudio"
  | "storyBuilder"
  | "poetryLiterature"
  | "spellingKingdom"
  | "listeningChallenge"
  | "publicSpeaking"
  | "debateArena"
  | "communicationSkills"
  | "creativeWriting"
  | "robotBuilding"
  | "sensorsHub"
  | "circuitsHub"
  | "codingRobots"
  | "aiAutomation"
  | "electronicsLab"
  | "machineLogic"
  | "droneSystems"
  | "smartHome"
  | "mechanicalEngineering"
  | "industrialAutomation"
  | "mechatronics"
  | "logicPuzzle"
  | "memoryTraining"
  | "strategyGames"
  | "brainTeasers"
  | "codingLogic"
  | "escapeRoom"
  | "patternRecognition"
  | "detectiveInvestigation"
  | "strategicPlanning"
  | "innovationLab"
  | "decisionMaking"
  | "problemSolving";

export interface SubjectData {
  id: SubjectId;
  name: string;
  description: string;
  unlocked: boolean;
  hubCount: number;
  completedHubs: number;
  color: string;
  icon: string;
}

export interface HubData {
  id: HubId;
  subjectId: SubjectId;
  name: string;
  description: string;
  unlocked: boolean;
  gameCount: number;
  completedGames: number;
  isPlayable: boolean;
  minGrade: number;
  maxGrade: number;
}

export interface GameData {
  id: string;
  hubId: HubId;
  name: string;
  description: string;
  minGrade: number;
  maxGrade: number;
  difficulty: 1 | 2 | 3;
}

export interface NavLink {
  label: string;
  path: string;
}
