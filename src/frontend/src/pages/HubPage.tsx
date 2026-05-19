import { useAudioContext } from "@/audio/AudioProvider";
import { GlowButton } from "@/components/ui/GlowButton";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { getHubById, getSubjectById } from "@/data/subjects";
import { useAllHubProgress, useMyRecentScores } from "@/hooks/useBackend";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Lock,
  Play,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useEffect } from "react";

interface GameEntry {
  id: string;
  name: string;
  description: string;
  educationalObjective: string;
  difficulty: 1 | 2 | 3;
  route: string;
  unlocked: boolean;
}

const HUB_GAMES: Record<string, GameEntry[]> = {
  mouseMaster: [
    {
      id: "mouse-master",
      name: "Cursor Precision Training",
      description:
        "Navigate through shrinking target zones with increasing speed and accuracy.",
      educationalObjective:
        "Develop fine motor control and cursor precision for desktop computing.",
      difficulty: 1,
      route: "/game/mouse-master",
      unlocked: true,
    },
    {
      id: "drag-drop-maze",
      name: "Drag-Drop Obstacle Maze",
      description:
        "Drag items through complex pathways without touching maze walls.",
      educationalObjective:
        "Master drag-and-drop interactions for file management and GUI use.",
      difficulty: 2,
      route: "/game/drag-drop-maze",
      unlocked: true,
    },
    {
      id: "double-click-race",
      name: "Double-Click Race",
      description:
        "Open files faster than the AI opponent using precise double-clicks.",
      educationalObjective:
        "Practice double-click timing essential for file and folder operations.",
      difficulty: 1,
      route: "/game/double-click-race",
      unlocked: true,
    },
    {
      id: "desktop-organizer",
      name: "Desktop Organization Challenge",
      description:
        "Sort and organize cluttered desktop icons into the correct folders before time runs out.",
      educationalObjective:
        "Learn desktop organization and file categorization principles.",
      difficulty: 2,
      route: "/game/desktop-organizer",
      unlocked: true,
    },
    {
      id: "scroll-shooter",
      name: "Scroll Wheel Navigator",
      description:
        "Navigate long documents finding hidden targets using scroll gestures.",
      educationalObjective:
        "Develop scrolling and document navigation skills for productivity.",
      difficulty: 3,
      route: "/game/scroll-shooter",
      unlocked: true,
    },
  ],
  keyboardNinja: [
    {
      id: "keyboard-ninja",
      name: "Shortcut Combat Arena",
      description:
        "Defeat opponents using keyboard shortcuts faster than they can use the mouse.",
      educationalObjective:
        "Master essential keyboard shortcuts to boost productivity and speed.",
      difficulty: 2,
      route: "/game/keyboard-ninja",
      unlocked: true,
    },
    {
      id: "key-mastery",
      name: "Key Mastery Challenge",
      description:
        "Identify and press the correct keys on a virtual keyboard within the countdown.",
      educationalObjective:
        "Build keyboard familiarity and key identification skills.",
      difficulty: 1,
      route: "/game/key-mastery",
      unlocked: true,
    },
    {
      id: "function-key-boss",
      name: "Function Key Boss Battle",
      description:
        "Use F1-F12 function keys to defeat escalating enemy waves in combat.",
      educationalObjective:
        "Learn the purpose and context of function keys in real applications.",
      difficulty: 3,
      route: "/game/function-key-boss",
      unlocked: true,
    },
    {
      id: "symbol-sprint",
      name: "Symbol Sprint",
      description:
        "Type special characters and symbols at speed in a timed race.",
      educationalObjective:
        "Practice typing symbols and punctuation for advanced text entry.",
      difficulty: 2,
      route: "/game/symbol-sprint",
      unlocked: true,
    },
    {
      id: "nav-warrior",
      name: "Navigation Warrior",
      description:
        "Use arrow keys, Home, End, and Page keys to navigate text documents efficiently.",
      educationalObjective:
        "Master keyboard navigation for efficient document and browser use.",
      difficulty: 3,
      route: "/game/nav-warrior",
      unlocked: true,
    },
  ],
  fileFolder: [
    {
      id: "file-system-commander",
      name: "File System Commander",
      description:
        "Navigate directory trees, move files, and organize folder structures under time pressure.",
      educationalObjective:
        "Understand hierarchical file systems and folder organization for productivity.",
      difficulty: 1,
      route: "/game/file-system-commander",
      unlocked: true,
    },
    {
      id: "folder-organizer",
      name: "Folder Organization Mission",
      description:
        "Sort chaotic files into correct folder categories using drag-and-drop mechanics.",
      educationalObjective:
        "Learn file type recognition and logical folder categorization strategies.",
      difficulty: 2,
      route: "/game/folder-organizer",
      unlocked: true,
    },
    {
      id: "file-types-quiz",
      name: "File Types Identifier",
      description:
        "Race to correctly identify file extensions and their associated applications.",
      educationalObjective:
        "Master common file types and understand how operating systems handle them.",
      difficulty: 1,
      route: "/game/file-types-quiz",
      unlocked: true,
    },
  ],
  internetBrowser: [
    {
      id: "browser-quest",
      name: "Browser Quest",
      description:
        "Navigate websites, use browser tools, and complete web exploration missions.",
      educationalObjective:
        "Build web browsing proficiency and internet navigation skills.",
      difficulty: 1,
      route: "/game/browser-quest",
      unlocked: true,
    },
    {
      id: "url-safety",
      name: "URL Safety Inspector",
      description:
        "Identify safe versus dangerous URLs and protect against malicious web links.",
      educationalObjective:
        "Develop critical evaluation skills for web safety and link verification.",
      difficulty: 2,
      route: "/game/url-safety",
      unlocked: true,
    },
    {
      id: "web-navigator",
      name: "Web Navigator Challenge",
      description:
        "Find specific information across websites using search strategies and browser features.",
      educationalObjective:
        "Master effective web searching and information retrieval techniques.",
      difficulty: 3,
      route: "/game/web-navigator",
      unlocked: true,
    },
  ],
  typingSpeed: [
    {
      id: "typing-speed",
      name: "Speed Typist: WPM Tournament",
      description:
        "Race against time and opponents to achieve the highest words-per-minute score.",
      educationalObjective:
        "Develop touch typing speed and accuracy for real-world computing tasks.",
      difficulty: 2,
      route: "/game/typing-speed",
      unlocked: true,
    },
    {
      id: "typing-accuracy",
      name: "Precision Typist",
      description:
        "Type complex passages with zero errors - accuracy over speed.",
      educationalObjective:
        "Build precise typing habits to reduce errors in professional work.",
      difficulty: 1,
      route: "/game/typing-accuracy",
      unlocked: true,
    },
    {
      id: "code-typist",
      name: "Code Typist Challenge",
      description:
        "Type programming syntax and code snippets accurately at speed.",
      educationalObjective:
        "Prepare for programming by mastering code-specific typing patterns.",
      difficulty: 3,
      route: "/game/code-typist",
      unlocked: true,
    },
    {
      id: "typing-marathon",
      name: "Typing Marathon",
      description:
        "Sustain high WPM across an extended passage without losing momentum.",
      educationalObjective:
        "Build typing endurance required for lengthy document production.",
      difficulty: 2,
      route: "/game/typing-marathon",
      unlocked: true,
    },
    {
      id: "blind-type",
      name: "Blind Type Master",
      description:
        "Type words without looking at the keyboard - full touch-typing technique.",
      educationalObjective:
        "Achieve true touch-typing independence for maximum professional efficiency.",
      difficulty: 3,
      route: "/game/blind-type",
      unlocked: true,
    },
  ],
  microsoftOffice: [
    {
      id: "office-productivity",
      name: "Office Productivity Challenge",
      description:
        "Complete real office tasks in Word, Excel, and PowerPoint simulations.",
      educationalObjective:
        "Build professional office software skills for workplace readiness.",
      difficulty: 2,
      route: "/game/office-productivity",
      unlocked: true,
    },
    {
      id: "document-formatter",
      name: "Document Formatter",
      description:
        "Format documents correctly applying styles, headings, and layout rules.",
      educationalObjective:
        "Master document formatting standards used in professional environments.",
      difficulty: 1,
      route: "/game/document-formatter",
      unlocked: true,
    },
    {
      id: "spreadsheet-basics",
      name: "Spreadsheet Formula Arena",
      description:
        "Solve data problems using Excel formulas, functions, and cell references.",
      educationalObjective:
        "Develop spreadsheet literacy for data analysis and mathematical computation.",
      difficulty: 3,
      route: "/game/spreadsheet-basics",
      unlocked: true,
    },
  ],
  codingBasics: [
    {
      id: "coding-basics",
      name: "Code Puzzle: Drag-Drop Programming",
      description:
        "Arrange code blocks in the correct sequence to make programs execute properly.",
      educationalObjective:
        "Understand algorithmic thinking, sequencing, and basic programming logic.",
      difficulty: 1,
      route: "/game/coding-basics",
      unlocked: true,
    },
    {
      id: "loop-lab",
      name: "Loop Lab",
      description:
        "Use loops to control robot movements through challenging grid mazes.",
      educationalObjective:
        "Master loop structures and iteration as core programming concepts.",
      difficulty: 2,
      route: "/game/loop-lab",
      unlocked: true,
    },
    {
      id: "variable-vault",
      name: "Variable Vault",
      description:
        "Store, modify, and retrieve variables to unlock safes in an escape room.",
      educationalObjective:
        "Understand variables, data types, and memory assignment in programming.",
      difficulty: 2,
      route: "/game/variable-vault",
      unlocked: true,
    },
    {
      id: "function-factory",
      name: "Function Factory",
      description:
        "Build reusable functions on an assembly line to maximize factory output.",
      educationalObjective:
        "Learn function definition, parameters, and return values in programming.",
      difficulty: 3,
      route: "/game/function-factory",
      unlocked: true,
    },
    {
      id: "conditional-combat",
      name: "Conditional Combat",
      description:
        "Program AI warriors using if/else logic to defeat adaptive enemies.",
      educationalObjective:
        "Apply conditional statements and boolean logic to solve real problems.",
      difficulty: 3,
      route: "/game/conditional-combat",
      unlocked: true,
    },
  ],
  cyberSafety: [
    {
      id: "cyber-safety",
      name: "Cyber Guardian: Phishing Defense",
      description:
        "Identify and neutralize phishing emails, fake websites, and social engineering attacks.",
      educationalObjective:
        "Recognize and respond to digital threats to protect personal information online.",
      difficulty: 2,
      route: "/game/cyber-safety",
      unlocked: true,
    },
    {
      id: "password-fortress",
      name: "Password Fortress Builder",
      description:
        "Construct strong passwords and protect your digital vault from cracking attempts.",
      educationalObjective:
        "Learn password security principles and strong credential management.",
      difficulty: 1,
      route: "/game/password-fortress",
      unlocked: true,
    },
    {
      id: "virus-hunter",
      name: "Virus Hunter",
      description:
        "Detect and quarantine malware hidden inside files before it spreads.",
      educationalObjective:
        "Understand how malware works and how to protect devices from infection.",
      difficulty: 2,
      route: "/game/virus-hunter",
      unlocked: true,
    },
    {
      id: "privacy-shield",
      name: "Privacy Shield Mission",
      description:
        "Audit your digital footprint and secure exposed personal data across platforms.",
      educationalObjective:
        "Develop digital privacy awareness and responsible online behavior.",
      difficulty: 3,
      route: "/game/privacy-shield",
      unlocked: true,
    },
    {
      id: "social-engineering-boss",
      name: "Social Engineering Boss Battle",
      description:
        "Defeat the master manipulator by identifying deceptive tactics in real scenarios.",
      educationalObjective:
        "Recognize social engineering techniques used in real-world cyberattacks.",
      difficulty: 3,
      route: "/game/social-engineering-boss",
      unlocked: true,
    },
  ],
  networking: [
    {
      id: "network-architect",
      name: "Network Architect",
      description:
        "Design and connect network topologies to route data efficiently across nodes.",
      educationalObjective:
        "Understand network topology, routing, and data transmission fundamentals.",
      difficulty: 2,
      route: "/game/network-architect",
      unlocked: true,
    },
    {
      id: "cable-router",
      name: "Cable Routing Simulator",
      description:
        "Connect devices by routing the correct cables through a virtual data center.",
      educationalObjective:
        "Learn physical network infrastructure and cable types for IT environments.",
      difficulty: 1,
      route: "/game/cable-router",
      unlocked: true,
    },
    {
      id: "ip-addressing",
      name: "IP Address Challenge",
      description:
        "Assign correct IP addresses, configure subnets, and troubleshoot connectivity.",
      educationalObjective:
        "Master IP addressing, subnetting, and network configuration principles.",
      difficulty: 3,
      route: "/game/ip-addressing",
      unlocked: true,
    },
  ],
  digitalCreativity: [
    {
      id: "pixel-design-studio",
      name: "Pixel Design Studio",
      description:
        "Create pixel art and digital illustrations using design tools and color theory.",
      educationalObjective:
        "Develop digital art skills and understanding of design principles.",
      difficulty: 1,
      route: "/game/pixel-design-studio",
      unlocked: true,
    },
    {
      id: "color-theory",
      name: "Color Theory Master",
      description:
        "Apply color wheels, harmonies, and contrast rules to solve design challenges.",
      educationalObjective:
        "Master color theory fundamentals essential for graphic design and media.",
      difficulty: 2,
      route: "/game/color-theory",
      unlocked: true,
    },
    {
      id: "digital-art",
      name: "Digital Art Creator",
      description:
        "Create layered digital artwork using tools that mimic professional software.",
      educationalObjective:
        "Build proficiency with digital creation tools for multimedia production.",
      difficulty: 3,
      route: "/game/digital-art",
      unlocked: true,
    },
  ],
  operatingSystem: [
    {
      id: "os-control-room",
      name: "OS Control Room",
      description:
        "Manage system settings, configure OS features, and troubleshoot OS problems.",
      educationalObjective:
        "Understand operating system functions, settings, and system administration.",
      difficulty: 2,
      route: "/game/os-control-room",
      unlocked: true,
    },
    {
      id: "process-manager",
      name: "Process Manager",
      description:
        "Monitor running processes, manage memory, and optimize system performance.",
      educationalObjective:
        "Learn how operating systems manage processes, memory, and system resources.",
      difficulty: 3,
      route: "/game/process-manager",
      unlocked: true,
    },
    {
      id: "os-quiz",
      name: "OS Knowledge Sprint",
      description:
        "Answer rapid-fire questions about operating system concepts and terminology.",
      educationalObjective:
        "Consolidate operating system theory knowledge through active recall.",
      difficulty: 1,
      route: "/game/os-quiz",
      unlocked: true,
    },
  ],
  cloudComputing: [
    {
      id: "cloud-resource-manager",
      name: "Cloud Resource Manager",
      description:
        "Allocate virtual machines, storage, and bandwidth in a cloud infrastructure simulation.",
      educationalObjective:
        "Understand cloud computing resource management and infrastructure concepts.",
      difficulty: 3,
      route: "/game/cloud-resource-manager",
      unlocked: true,
    },
    {
      id: "cloud-quiz",
      name: "Cloud Concepts Sprint",
      description:
        "Answer timed questions covering cloud services, SaaS, PaaS, IaaS, and security.",
      educationalObjective:
        "Build theoretical knowledge of cloud computing models and service types.",
      difficulty: 2,
      route: "/game/cloud-quiz",
      unlocked: true,
    },
    {
      id: "server-basics",
      name: "Server Room Simulator",
      description:
        "Configure server settings, install services, and maintain uptime in a simulation.",
      educationalObjective:
        "Learn server administration fundamentals and data center management.",
      difficulty: 2,
      route: "/game/server-basics",
      unlocked: true,
    },
  ],
  computerEngineering: [
    {
      id: "circuit-board-assembly",
      name: "Circuit Board Assembly",
      description:
        "Assemble PC motherboards and connect components in the correct order.",
      educationalObjective:
        "Understand computer hardware architecture and component relationships.",
      difficulty: 2,
      route: "/game/circuit-board-assembly",
      unlocked: true,
    },
    {
      id: "component-quiz-eng",
      name: "Hardware Component Quiz",
      description:
        "Identify CPU, RAM, GPU, storage, and motherboard components against the clock.",
      educationalObjective:
        "Learn hardware component identification for IT support and engineering roles.",
      difficulty: 1,
      route: "/game/component-quiz-eng",
      unlocked: true,
    },
    {
      id: "pcb-designer",
      name: "PCB Design Challenge",
      description:
        "Route connections on a printed circuit board layout to complete functional circuits.",
      educationalObjective:
        "Develop understanding of PCB design and electronic circuit layout principles.",
      difficulty: 3,
      route: "/game/pcb-designer",
      unlocked: true,
    },
  ],
  // Mathematics hubs
  arithmeticArena: [
    {
      id: "arithmetic-combat",
      name: "Arithmetic Combat",
      description:
        "Battle enemies by solving arithmetic problems faster than the timer countdown.",
      educationalObjective:
        "Build fluency in the four arithmetic operations and mental calculation speed.",
      difficulty: 1,
      route: "/game/arithmetic-combat",
      unlocked: true,
    },
    {
      id: "fraction-wars",
      name: "Fraction Wars",
      description:
        "Compare and operate on fractions to defeat opponents in head-to-head rounds.",
      educationalObjective:
        "Develop fraction comparison and operation skills through competitive gameplay.",
      difficulty: 2,
      route: "/game/fraction-wars",
      unlocked: true,
    },
    {
      id: "shape-architect",
      name: "Shape Architect",
      description:
        "Calculate areas and perimeters of shapes to construct architectural blueprints.",
      educationalObjective:
        "Apply area and perimeter formulas to real-world geometric design challenges.",
      difficulty: 2,
      route: "/game/shape-architect",
      unlocked: true,
    },
  ],
  fractionsKingdom: [
    {
      id: "fraction-wars-2",
      name: "Fractions Battle Royale",
      description:
        "Master equivalent fractions, simplification, and ordering in intense battles.",
      educationalObjective:
        "Strengthen understanding of fraction equivalence and ordering on a number line.",
      difficulty: 1,
      route: "/game/fraction-wars-2",
      unlocked: true,
    },
    {
      id: "fraction-ops",
      name: "Fraction Operations Lab",
      description:
        "Add, subtract, multiply, and divide fractions in laboratory puzzle scenarios.",
      educationalObjective:
        "Master all four fraction operations with mixed numbers and improper fractions.",
      difficulty: 2,
      route: "/game/fraction-ops",
      unlocked: true,
    },
    {
      id: "fraction-wars",
      name: "Fraction Wars Champion",
      description:
        "Advanced fraction challenges including decimals and percentages conversions.",
      educationalObjective:
        "Connect fractions, decimals, and percentages as equivalent representations.",
      difficulty: 3,
      route: "/game/fraction-wars",
      unlocked: true,
    },
  ],
  geometryBuilder: [
    {
      id: "shape-architect",
      name: "Geometry Shape Architect",
      description:
        "Construct geometric shapes, identify properties, and solve angle challenges.",
      educationalObjective:
        "Understand geometric properties of 2D and 3D shapes including angles.",
      difficulty: 1,
      route: "/game/shape-architect",
      unlocked: true,
    },
    {
      id: "geometry-quest",
      name: "Geometry Quest",
      description:
        "Navigate geometric puzzles using transformation, symmetry, and coordinate skills.",
      educationalObjective:
        "Apply geometric transformations and coordinate geometry to solve problems.",
      difficulty: 2,
      route: "/game/geometry-quest",
      unlocked: true,
    },
    {
      id: "area-perimeter",
      name: "Area and Perimeter Master",
      description:
        "Calculate dimensions of complex shapes including composite figures under pressure.",
      educationalObjective:
        "Master area and perimeter calculations for diverse geometric shapes.",
      difficulty: 3,
      route: "/game/area-perimeter",
      unlocked: true,
    },
  ],
  algebraAdventure: [
    {
      id: "equation-quest",
      name: "Equation Quest",
      description:
        "Solve linear equations and inequalities to unlock portals in a mathematical world.",
      educationalObjective:
        "Develop systematic equation-solving skills and algebraic reasoning.",
      difficulty: 2,
      route: "/game/equation-quest",
      unlocked: true,
    },
    {
      id: "algebra-boss",
      name: "Algebra Boss Battle",
      description:
        "Defeat the Algebra Boss using simultaneous equations and expression simplification.",
      educationalObjective:
        "Apply algebraic techniques including factorization and substitution methods.",
      difficulty: 3,
      route: "/game/algebra-boss",
      unlocked: true,
    },
    {
      id: "variable-hunt",
      name: "Variable Hunt",
      description:
        "Find unknown variables hidden across a mathematical landscape using clues.",
      educationalObjective:
        "Understand variable concepts and practice isolating unknowns in equations.",
      difficulty: 1,
      route: "/game/variable-hunt",
      unlocked: true,
    },
  ],
  statisticsChallenge: [
    {
      id: "data-detective",
      name: "Data Detective",
      description:
        "Investigate data sets to find mean, median, mode, and range to solve cases.",
      educationalObjective:
        "Calculate and interpret central tendency and spread in statistical data.",
      difficulty: 1,
      route: "/game/data-detective",
      unlocked: true,
    },
    {
      id: "stats-race",
      name: "Statistics Race",
      description:
        "Interpret graphs and statistical diagrams faster than opponents in timed rounds.",
      educationalObjective:
        "Develop graph reading and statistical interpretation skills under pressure.",
      difficulty: 2,
      route: "/game/stats-race",
      unlocked: true,
    },
    {
      id: "probability-quest",
      name: "Probability Quest",
      description:
        "Calculate probabilities, predict outcomes, and navigate chance-based challenges.",
      educationalObjective:
        "Understand probability theory and apply it to predict real-world outcomes.",
      difficulty: 3,
      route: "/game/probability-quest",
      unlocked: true,
    },
  ],
  moneyMath: [
    {
      id: "market-merchant",
      name: "Market Merchant",
      description:
        "Buy and sell goods in a virtual market, calculating change and profit margins.",
      educationalObjective:
        "Apply money calculations including profit, loss, and percentage to real contexts.",
      difficulty: 1,
      route: "/game/market-merchant",
      unlocked: true,
    },
    {
      id: "coin-counter",
      name: "Coin Counter Challenge",
      description:
        "Count coins and notes rapidly to make correct change under time pressure.",
      educationalObjective:
        "Build fluency with currency denominations and making change accurately.",
      difficulty: 1,
      route: "/game/coin-counter",
      unlocked: true,
    },
    {
      id: "budget-builder",
      name: "Budget Builder",
      description:
        "Manage a household budget, track expenses, and maximize savings goals.",
      educationalObjective:
        "Develop financial literacy skills including budgeting and financial planning.",
      difficulty: 3,
      route: "/game/budget-builder",
      unlocked: true,
    },
  ],
  measurementLab: [
    {
      id: "measurement-mission",
      name: "Measurement Mission",
      description:
        "Use virtual rulers, scales, and measuring tools to solve precision challenges.",
      educationalObjective:
        "Develop accurate measurement skills using standard and metric units.",
      difficulty: 1,
      route: "/game/measurement-mission",
      unlocked: true,
    },
    {
      id: "measure-master",
      name: "Measurement Master",
      description:
        "Estimate and measure lengths, masses, and volumes with increasing accuracy.",
      educationalObjective:
        "Build estimation and measurement skills for practical real-world applications.",
      difficulty: 2,
      route: "/game/measure-master",
      unlocked: true,
    },
    {
      id: "unit-converter",
      name: "Unit Conversion Race",
      description:
        "Convert between metric and imperial units at speed to complete engineering tasks.",
      educationalObjective:
        "Master unit conversion across length, mass, volume, and temperature.",
      difficulty: 3,
      route: "/game/unit-converter",
      unlocked: true,
    },
  ],
  timeSpeed: [
    {
      id: "time-trial-racer",
      name: "Time Trial Racer",
      description:
        "Calculate journey times, average speeds, and distances to win racing missions.",
      educationalObjective:
        "Apply distance-speed-time relationships to solve motion problems.",
      difficulty: 2,
      route: "/game/time-trial-racer",
      unlocked: true,
    },
    {
      id: "speed-calculator",
      name: "Speed Calculator Challenge",
      description:
        "Solve speed, distance, and time problems within a countdown to rescue missions.",
      educationalObjective:
        "Develop fluency with the distance-speed-time formula and its rearrangements.",
      difficulty: 2,
      route: "/game/speed-calculator",
      unlocked: true,
    },
    {
      id: "clock-master",
      name: "Clock Master",
      description:
        "Read clocks, calculate time intervals, and coordinate schedules in real scenarios.",
      educationalObjective:
        "Build time-reading proficiency and time calculation skills for everyday use.",
      difficulty: 1,
      route: "/game/clock-master",
      unlocked: true,
    },
  ],
  graphingSystems: [
    {
      id: "graph-navigator",
      name: "Graph Navigator",
      description:
        "Plot data points, read coordinates, and navigate a cartesian plane mission world.",
      educationalObjective:
        "Develop coordinate geometry skills and graph plotting accuracy.",
      difficulty: 1,
      route: "/game/graph-navigator",
      unlocked: true,
    },
    {
      id: "coordinate-quest",
      name: "Coordinate Quest",
      description:
        "Solve coordinate geometry puzzles including midpoints, gradients, and distances.",
      educationalObjective:
        "Apply coordinate geometry formulas to calculate distances and midpoints.",
      difficulty: 3,
      route: "/game/coordinate-quest",
      unlocked: true,
    },
    {
      id: "line-plotter",
      name: "Line Graph Plotter",
      description:
        "Draw and interpret straight-line graphs to decode hidden mathematical messages.",
      educationalObjective:
        "Understand linear graphs including gradient, intercept, and y = mx + c.",
      difficulty: 2,
      route: "/game/line-plotter",
      unlocked: true,
    },
  ],
  mathematicalReasoning: [
    {
      id: "logic-chain",
      name: "Logic Chain Solver",
      description:
        "Follow mathematical reasoning chains and deduce conclusions from given information.",
      educationalObjective:
        "Develop logical reasoning and mathematical deduction skills.",
      difficulty: 2,
      route: "/game/logic-chain",
      unlocked: true,
    },
    {
      id: "number-patterns",
      name: "Number Pattern Decoder",
      description:
        "Identify rules in number sequences and predict next terms under time pressure.",
      educationalObjective:
        "Recognize arithmetic, geometric, and complex number patterns systematically.",
      difficulty: 1,
      route: "/game/number-patterns",
      unlocked: true,
    },
    {
      id: "sequence-master",
      name: "Sequence Master",
      description:
        "Complete and extend complex sequences using nth-term rules and algebraic patterns.",
      educationalObjective:
        "Generate and describe sequences using mathematical formulae and rules.",
      difficulty: 3,
      route: "/game/sequence-master",
      unlocked: true,
    },
  ],
  mentalMath: [
    {
      id: "mental-sprint",
      name: "Mental Math Sprint",
      description:
        "Solve calculations mentally at maximum speed in escalating rapid-fire rounds.",
      educationalObjective:
        "Build mental arithmetic fluency and calculation speed for all operations.",
      difficulty: 1,
      route: "/game/mental-sprint",
      unlocked: true,
    },
    {
      id: "speed-arithmetic",
      name: "Speed Arithmetic Tournament",
      description:
        "Compete in arithmetic tournaments requiring instant mental calculation responses.",
      educationalObjective:
        "Develop rapid mental calculation techniques for competitive mathematical speed.",
      difficulty: 2,
      route: "/game/speed-arithmetic",
      unlocked: true,
    },
    {
      id: "flash-math",
      name: "Flash Math Challenge",
      description:
        "React to flashing numbers and operations with instant correct responses.",
      educationalObjective:
        "Sharpen cognitive processing speed for mathematical operations.",
      difficulty: 3,
      route: "/game/flash-math",
      unlocked: true,
    },
  ],
  magicMathematics: [
    {
      id: "vedic-dojo",
      name: "Vedic Math Dojo",
      description:
        "Master ancient Vedic multiplication and calculation techniques in training missions.",
      educationalObjective:
        "Learn Vedic mathematics shortcuts for rapid multiplication and division.",
      difficulty: 2,
      route: "/game/vedic-dojo",
      unlocked: true,
    },
    {
      id: "abacus-master",
      name: "Abacus Master",
      description:
        "Use virtual abacus beads to perform calculations with traditional counting methods.",
      educationalObjective:
        "Develop abacus calculation skills and understand place value deeply.",
      difficulty: 2,
      route: "/game/abacus-master",
      unlocked: true,
    },
    {
      id: "shortcut-wizard",
      name: "Shortcut Wizard",
      description:
        "Unlock mathematical shortcut techniques that solve problems at superhuman speed.",
      educationalObjective:
        "Apply mathematical shortcuts and memory techniques for rapid calculation.",
      difficulty: 3,
      route: "/game/shortcut-wizard",
      unlocked: true,
    },
  ],
  // Science hubs
  humanBody: [
    {
      id: "anatomy-surgeon",
      name: "Virtual Anatomy Surgeon",
      description:
        "Perform virtual operations, identify organs, and repair body systems under pressure.",
      educationalObjective:
        "Learn human organ names, locations, and functions through surgical simulation.",
      difficulty: 2,
      route: "/game/anatomy-surgeon",
      unlocked: true,
    },
    {
      id: "organ-quiz",
      name: "Organ System Sprint",
      description:
        "Rapidly classify organs into body systems and answer anatomy questions.",
      educationalObjective:
        "Build comprehensive knowledge of human body organ systems and functions.",
      difficulty: 1,
      route: "/game/organ-quiz",
      unlocked: true,
    },
    {
      id: "body-systems",
      name: "Body Systems Explorer",
      description:
        "Trace pathways through circulatory, digestive, and nervous systems interactively.",
      educationalObjective:
        "Understand how different body systems interact and support one another.",
      difficulty: 3,
      route: "/game/body-systems",
      unlocked: true,
    },
  ],
  plantsAnimals: [
    {
      id: "ecosystem-architect",
      name: "Ecosystem Architect",
      description:
        "Build balanced ecosystems with correct food chains and habitat conditions.",
      educationalObjective:
        "Understand ecosystem balance, food chains, and interdependence of organisms.",
      difficulty: 2,
      route: "/game/ecosystem-architect",
      unlocked: true,
    },
    {
      id: "food-web",
      name: "Food Web Challenge",
      description:
        "Construct and analyze food webs to predict the impact of removing species.",
      educationalObjective:
        "Analyze food web relationships and understand ecosystem interdependencies.",
      difficulty: 2,
      route: "/game/food-web",
      unlocked: true,
    },
    {
      id: "classify-life",
      name: "Life Classification Lab",
      description:
        "Sort organisms into taxonomic kingdoms using observable characteristics.",
      educationalObjective:
        "Learn biological classification systems and taxonomic groupings.",
      difficulty: 1,
      route: "/game/classify-life",
      unlocked: true,
    },
  ],
  spaceScience: [
    {
      id: "mission-control",
      name: "Mission Control",
      description:
        "Launch and navigate spacecraft through the solar system on exploration missions.",
      educationalObjective:
        "Learn about the solar system, planetary motion, and space exploration history.",
      difficulty: 2,
      route: "/game/mission-control",
      unlocked: true,
    },
    {
      id: "planet-quiz",
      name: "Planet Knowledge Sprint",
      description:
        "Answer rapid questions about planets, moons, and solar system characteristics.",
      educationalObjective:
        "Build comprehensive knowledge of solar system bodies and space science.",
      difficulty: 1,
      route: "/game/planet-quiz",
      unlocked: true,
    },
    {
      id: "star-navigator",
      name: "Star Navigator",
      description:
        "Navigate using star maps, identify constellations, and plot astronomical courses.",
      educationalObjective:
        "Understand stellar classification, constellations, and astronomical navigation.",
      difficulty: 3,
      route: "/game/star-navigator",
      unlocked: true,
    },
  ],
  chemistryLab: [
    {
      id: "lab-reaction",
      name: "Lab Reaction Master",
      description:
        "Mix chemicals safely in virtual experiments to create target reactions.",
      educationalObjective:
        "Understand chemical reaction types and laboratory safety procedures.",
      difficulty: 2,
      route: "/game/lab-reaction",
      unlocked: true,
    },
    {
      id: "element-quiz",
      name: "Element Sprint",
      description:
        "Identify elements by symbol, atomic number, and properties against the clock.",
      educationalObjective:
        "Build knowledge of the periodic table elements and their properties.",
      difficulty: 1,
      route: "/game/element-quiz",
      unlocked: true,
    },
    {
      id: "periodic-explorer",
      name: "Periodic Table Explorer",
      description:
        "Explore groups and periods, predict properties, and complete the missing elements.",
      educationalObjective:
        "Understand periodic table organization and trends in element properties.",
      difficulty: 3,
      route: "/game/periodic-explorer",
      unlocked: true,
    },
  ],
  electricity: [
    {
      id: "circuit-builder-sci",
      name: "Circuit Builder",
      description:
        "Wire series and parallel circuits correctly to power devices in challenges.",
      educationalObjective:
        "Understand series and parallel circuit configurations and electrical components.",
      difficulty: 2,
      route: "/game/circuit-builder-sci",
      unlocked: true,
    },
    {
      id: "ohms-law",
      name: "Ohm's Law Calculator",
      description:
        "Apply Ohm's law to calculate voltage, current, and resistance in circuit scenarios.",
      educationalObjective:
        "Apply Ohm's law V=IR to solve electrical circuit calculation problems.",
      difficulty: 3,
      route: "/game/ohms-law",
      unlocked: true,
    },
    {
      id: "circuit-quiz",
      name: "Electricity Concepts Quiz",
      description:
        "Answer timed questions on electrical concepts, components, and safety rules.",
      educationalObjective:
        "Consolidate knowledge of electricity theory including conductors and insulators.",
      difficulty: 1,
      route: "/game/circuit-quiz",
      unlocked: true,
    },
  ],
  matterMaterials: [
    {
      id: "states-of-matter",
      name: "States of Matter Explorer",
      description:
        "Change states by applying heat and pressure to observe particle behavior.",
      educationalObjective:
        "Understand particle theory and how heat changes states of matter.",
      difficulty: 1,
      route: "/game/states-of-matter",
      unlocked: true,
    },
    {
      id: "classify-matter",
      name: "Matter Classification Challenge",
      description:
        "Sort materials into elements, compounds, and mixtures using their properties.",
      educationalObjective:
        "Distinguish between pure substances and mixtures at the particle level.",
      difficulty: 2,
      route: "/game/classify-matter",
      unlocked: true,
    },
    {
      id: "particle-theory",
      name: "Particle Theory Lab",
      description:
        "Visualize and manipulate particles to demonstrate properties of solids, liquids, gases.",
      educationalObjective:
        "Apply particle theory to explain properties and behavior of states of matter.",
      difficulty: 3,
      route: "/game/particle-theory",
      unlocked: true,
    },
  ],
  weatherClimate: [
    {
      id: "weather-predictor",
      name: "Weather Predictor",
      description:
        "Analyze weather data to make accurate forecasts and warn communities.",
      educationalObjective:
        "Understand weather patterns, fronts, and meteorological data interpretation.",
      difficulty: 2,
      route: "/game/weather-predictor",
      unlocked: true,
    },
    {
      id: "climate-quiz",
      name: "Climate Concepts Sprint",
      description:
        "Answer rapid questions distinguishing weather from climate and climate zones.",
      educationalObjective:
        "Build knowledge of climate zones, global warming, and climate change causes.",
      difficulty: 1,
      route: "/game/climate-quiz",
      unlocked: true,
    },
    {
      id: "storm-tracker",
      name: "Storm Tracker",
      description:
        "Track and analyze severe weather systems to predict their path and intensity.",
      educationalObjective:
        "Understand storm formation, weather systems, and emergency preparedness.",
      difficulty: 3,
      route: "/game/storm-tracker",
      unlocked: true,
    },
  ],
  physicsMotion: [
    {
      id: "projectile-lab",
      name: "Projectile Lab",
      description:
        "Launch projectiles and adjust angles and speeds to hit targets precisely.",
      educationalObjective:
        "Apply projectile motion concepts including velocity components and gravity.",
      difficulty: 3,
      route: "/game/projectile-lab",
      unlocked: true,
    },
    {
      id: "force-quiz",
      name: "Forces Knowledge Sprint",
      description:
        "Rapidly identify forces acting on objects and predict motion outcomes.",
      educationalObjective:
        "Understand balanced and unbalanced forces and their effects on motion.",
      difficulty: 1,
      route: "/game/force-quiz",
      unlocked: true,
    },
    {
      id: "newton-challenge",
      name: "Newton's Laws Challenge",
      description:
        "Apply Newton's three laws to solve motion puzzles across physics scenarios.",
      educationalObjective:
        "Apply Newton's laws of motion to predict and explain movement.",
      difficulty: 2,
      route: "/game/newton-challenge",
      unlocked: true,
    },
  ],
  environmentalScience: [
    {
      id: "planet-guardian",
      name: "Planet Guardian",
      description:
        "Protect ecosystems from pollution and make decisions to restore environmental balance.",
      educationalObjective:
        "Understand human impacts on ecosystems and sustainable development solutions.",
      difficulty: 2,
      route: "/game/planet-guardian",
      unlocked: true,
    },
    {
      id: "eco-quiz",
      name: "Ecology Knowledge Sprint",
      description:
        "Answer rapid questions on environmental science, habitats, and conservation.",
      educationalObjective:
        "Build knowledge of ecological concepts, biomes, and conservation strategies.",
      difficulty: 1,
      route: "/game/eco-quiz",
      unlocked: true,
    },
    {
      id: "carbon-cycle",
      name: "Carbon Cycle Simulator",
      description:
        "Trace carbon through the atmosphere, oceans, and biosphere in interactive simulations.",
      educationalObjective:
        "Understand the carbon cycle and its role in climate and ecosystem balance.",
      difficulty: 3,
      route: "/game/carbon-cycle",
      unlocked: true,
    },
  ],
  earthScience: [
    {
      id: "geological-survey",
      name: "Geological Survey Mission",
      description:
        "Survey rock formations, identify strata layers, and map geological features.",
      educationalObjective:
        "Understand geological time, rock formation processes, and stratigraphy.",
      difficulty: 2,
      route: "/game/geological-survey",
      unlocked: true,
    },
    {
      id: "rock-cycle",
      name: "Rock Cycle Explorer",
      description:
        "Guide rocks through igneous, sedimentary, and metamorphic cycles interactively.",
      educationalObjective:
        "Understand the rock cycle and the processes that transform rock types.",
      difficulty: 1,
      route: "/game/rock-cycle",
      unlocked: true,
    },
    {
      id: "fossil-finder",
      name: "Fossil Finder",
      description:
        "Excavate and identify fossils to determine geological age and ancient environments.",
      educationalObjective:
        "Learn about fossil formation, paleontology, and evidence for evolution.",
      difficulty: 3,
      route: "/game/fossil-finder",
      unlocked: true,
    },
  ],
  renewableEnergy: [
    {
      id: "energy-grid",
      name: "Energy Grid Manager",
      description:
        "Build and balance a renewable energy grid serving a growing population.",
      educationalObjective:
        "Understand energy generation, distribution, and the transition to renewables.",
      difficulty: 3,
      route: "/game/energy-grid",
      unlocked: true,
    },
    {
      id: "solar-quiz",
      name: "Renewable Energy Sprint",
      description:
        "Answer rapid-fire questions on solar, wind, hydro, and other renewable sources.",
      educationalObjective:
        "Build knowledge of renewable energy types, advantages, and challenges.",
      difficulty: 1,
      route: "/game/solar-quiz",
      unlocked: true,
    },
    {
      id: "clean-power",
      name: "Clean Power Designer",
      description:
        "Design clean power installations optimizing efficiency and environmental impact.",
      educationalObjective:
        "Apply renewable energy engineering principles to sustainable design challenges.",
      difficulty: 2,
      route: "/game/clean-power",
      unlocked: true,
    },
  ],
  scientificInvestigation: [
    {
      id: "hypothesis-lab",
      name: "Hypothesis Lab",
      description:
        "Design valid hypotheses for experiments and test them through scientific method.",
      educationalObjective:
        "Master the scientific method including hypothesis formation and testing.",
      difficulty: 1,
      route: "/game/hypothesis-lab",
      unlocked: true,
    },
    {
      id: "experiment-designer",
      name: "Experiment Designer",
      description:
        "Design controlled experiments with correct variables and valid methodology.",
      educationalObjective:
        "Understand experimental design including control variables and fair testing.",
      difficulty: 2,
      route: "/game/experiment-designer",
      unlocked: true,
    },
    {
      id: "data-analyst",
      name: "Scientific Data Analyst",
      description:
        "Analyze experimental results, plot graphs, and draw evidence-based conclusions.",
      educationalObjective:
        "Develop data analysis and scientific reasoning from experimental evidence.",
      difficulty: 3,
      route: "/game/data-analyst",
      unlocked: true,
    },
  ],
  // English hubs
  grammarCity: [
    {
      id: "grammar-police",
      name: "Grammar Police",
      description:
        "Patrol Grammar City correcting errors in sentences before citizens are misled.",
      educationalObjective:
        "Identify and correct grammatical errors covering parts of speech and tenses.",
      difficulty: 2,
      route: "/game/grammar-police",
      unlocked: true,
    },
    {
      id: "grammar-quiz",
      name: "Grammar Knowledge Sprint",
      description:
        "Answer rapid grammar questions covering tenses, punctuation, and sentence structure.",
      educationalObjective:
        "Build comprehensive grammar knowledge for writing and communication.",
      difficulty: 1,
      route: "/game/grammar-quiz",
      unlocked: true,
    },
    {
      id: "sentence-builder",
      name: "Sentence Structure Builder",
      description:
        "Construct grammatically correct sentences from scrambled word components.",
      educationalObjective:
        "Master sentence construction including subjects, verbs, objects, and clauses.",
      difficulty: 3,
      route: "/game/sentence-builder",
      unlocked: true,
    },
  ],
  vocabularyQuest: [
    {
      id: "word-hunter",
      name: "Word Hunter",
      description:
        "Track and capture rare vocabulary words across challenging terrain missions.",
      educationalObjective:
        "Expand vocabulary through contextual word learning and meaning discovery.",
      difficulty: 2,
      route: "/game/word-hunter",
      unlocked: true,
    },
    {
      id: "vocabulary-match",
      name: "Vocabulary Match Master",
      description:
        "Match words to their definitions at speed in competitive vocabulary challenges.",
      educationalObjective:
        "Build extensive vocabulary through definition matching and usage practice.",
      difficulty: 1,
      route: "/game/vocabulary-match",
      unlocked: true,
    },
    {
      id: "synonym-sprint",
      name: "Synonym Sprint",
      description:
        "Find synonyms and antonyms at maximum speed across escalating word rounds.",
      educationalObjective:
        "Develop synonym and antonym knowledge for varied and precise language use.",
      difficulty: 3,
      route: "/game/synonym-sprint",
      unlocked: true,
    },
  ],
  readingAdventure: [
    {
      id: "story-speed-reader",
      name: "Story Speed Reader",
      description:
        "Read passages at speed and answer comprehension questions to advance the story.",
      educationalObjective:
        "Develop reading fluency and literal comprehension from various text types.",
      difficulty: 1,
      route: "/game/story-speed-reader",
      unlocked: true,
    },
    {
      id: "comprehension-quest",
      name: "Comprehension Quest",
      description:
        "Navigate comprehension puzzles requiring inference, deduction, and analysis.",
      educationalObjective:
        "Develop inferential and evaluative comprehension skills from complex texts.",
      difficulty: 2,
      route: "/game/comprehension-quest",
      unlocked: true,
    },
    {
      id: "inference-master",
      name: "Inference Master",
      description:
        "Read between the lines to uncover hidden meanings and author intentions.",
      educationalObjective:
        "Master inference, deduction, and critical reading of implicit meaning.",
      difficulty: 3,
      route: "/game/inference-master",
      unlocked: true,
    },
  ],
  pronunciationStudio: [
    {
      id: "phonics-decoder",
      name: "Phonics Decoder",
      description:
        "Decode phonics patterns and blend sounds correctly to complete reading missions.",
      educationalObjective:
        "Develop phonological awareness and phonics decoding skills for reading.",
      difficulty: 1,
      route: "/game/phonics-decoder",
      unlocked: true,
    },
    {
      id: "syllable-stress",
      name: "Syllable Stress Master",
      description:
        "Identify correct stress patterns in multi-syllabic words to defeat word bosses.",
      educationalObjective:
        "Master syllable stress rules for accurate pronunciation of complex words.",
      difficulty: 2,
      route: "/game/syllable-stress",
      unlocked: true,
    },
    {
      id: "phoneme-match",
      name: "Phoneme Matching Challenge",
      description:
        "Match phonemes to their grapheme representations in rapid pattern challenges.",
      educationalObjective:
        "Build grapheme-phoneme correspondence knowledge for reading and spelling.",
      difficulty: 3,
      route: "/game/phoneme-match",
      unlocked: true,
    },
  ],
  storyBuilder: [
    {
      id: "plot-architect",
      name: "Plot Architect",
      description:
        "Design story plots using narrative arc structures with rising action and climax.",
      educationalObjective:
        "Understand story structure including exposition, climax, and resolution.",
      difficulty: 2,
      route: "/game/plot-architect",
      unlocked: true,
    },
    {
      id: "story-sequence",
      name: "Story Sequence Challenge",
      description:
        "Arrange scrambled story events into correct chronological narrative order.",
      educationalObjective:
        "Develop narrative sequencing and understanding of story chronology.",
      difficulty: 1,
      route: "/game/story-sequence",
      unlocked: true,
    },
    {
      id: "narrative-master",
      name: "Narrative Master",
      description:
        "Write and continue stories using narrative techniques learned through challenges.",
      educationalObjective:
        "Apply narrative writing techniques including perspective, voice, and tension.",
      difficulty: 3,
      route: "/game/narrative-master",
      unlocked: true,
    },
  ],
  poetryLiterature: [
    {
      id: "verse-analyzer",
      name: "Verse Analyzer",
      description:
        "Analyze poetry verses to identify meter, tone, and poetic structure.",
      educationalObjective:
        "Develop poetry analysis skills including meter, rhyme, and form.",
      difficulty: 2,
      route: "/game/verse-analyzer",
      unlocked: true,
    },
    {
      id: "rhyme-scheme",
      name: "Rhyme Scheme Detective",
      description:
        "Identify rhyme schemes in poems and complete missing rhyming lines.",
      educationalObjective:
        "Understand rhyme scheme patterns and their effect on poetic expression.",
      difficulty: 1,
      route: "/game/rhyme-scheme",
      unlocked: true,
    },
    {
      id: "device-identifier",
      name: "Literary Device Identifier",
      description:
        "Identify metaphors, similes, personification, and other literary devices in texts.",
      educationalObjective:
        "Recognize and explain literary devices and their effects in texts.",
      difficulty: 3,
      route: "/game/device-identifier",
      unlocked: true,
    },
  ],
  spellingKingdom: [
    {
      id: "spelling-champion",
      name: "Spelling Champion",
      description:
        "Defeat spelling opponents by correctly spelling progressively harder words.",
      educationalObjective:
        "Develop spelling accuracy across common and complex word patterns.",
      difficulty: 2,
      route: "/game/spelling-champion",
      unlocked: true,
    },
    {
      id: "spelling-bee",
      name: "Spelling Bee Tournament",
      description:
        "Compete in spelling bee rounds under pressure with increasing word difficulty.",
      educationalObjective:
        "Build spelling stamina and accuracy for academic and professional contexts.",
      difficulty: 3,
      route: "/game/spelling-bee",
      unlocked: true,
    },
    {
      id: "word-spell",
      name: "Word Construction Lab",
      description:
        "Build words from letter tiles using spelling patterns and word-building strategies.",
      educationalObjective:
        "Understand word construction rules including prefixes, suffixes, and roots.",
      difficulty: 1,
      route: "/game/word-spell",
      unlocked: true,
    },
  ],
  listeningChallenge: [
    {
      id: "audio-detective",
      name: "Audio Detective",
      description:
        "Listen to complex audio passages and solve comprehension mysteries from clues.",
      educationalObjective:
        "Develop active listening skills and auditory processing for comprehension.",
      difficulty: 2,
      route: "/game/audio-detective",
      unlocked: true,
    },
    {
      id: "dialogue-master",
      name: "Dialogue Master",
      description:
        "Follow multi-speaker dialogues and answer detailed comprehension questions.",
      educationalObjective:
        "Build listening comprehension skills from conversations and discussions.",
      difficulty: 3,
      route: "/game/dialogue-master",
      unlocked: true,
    },
    {
      id: "listening-quiz",
      name: "Listening Skills Sprint",
      description:
        "Listen and respond rapidly to audio instructions in timed listening challenges.",
      educationalObjective:
        "Develop rapid listening comprehension and instruction-following accuracy.",
      difficulty: 1,
      route: "/game/listening-quiz",
      unlocked: true,
    },
  ],
  publicSpeaking: [
    {
      id: "speech-architect",
      name: "Speech Architect",
      description:
        "Design and deliver structured speeches using persuasive rhetoric frameworks.",
      educationalObjective:
        "Develop public speaking skills including structure, delivery, and persuasion.",
      difficulty: 3,
      route: "/game/speech-architect",
      unlocked: true,
    },
    {
      id: "presentation-builder",
      name: "Presentation Builder",
      description:
        "Construct effective presentation slides with correct structure and visual hierarchy.",
      educationalObjective:
        "Build presentation skills including visual design and audience engagement.",
      difficulty: 2,
      route: "/game/presentation-builder",
      unlocked: true,
    },
    {
      id: "speech-structure",
      name: "Speech Structure Master",
      description:
        "Arrange speech components in correct order and identify strong opening techniques.",
      educationalObjective:
        "Master speech structure including introduction, body, and conclusion techniques.",
      difficulty: 1,
      route: "/game/speech-structure",
      unlocked: true,
    },
  ],
  debateArena: [
    {
      id: "argument-gladiator",
      name: "Argument Gladiator",
      description:
        "Construct and deliver powerful arguments to win structured debate rounds.",
      educationalObjective:
        "Develop argument construction skills including claims, evidence, and reasoning.",
      difficulty: 2,
      route: "/game/argument-gladiator",
      unlocked: true,
    },
    {
      id: "rebuttal-master",
      name: "Rebuttal Master",
      description:
        "Identify weaknesses in opposing arguments and deliver effective counter-arguments.",
      educationalObjective:
        "Master rebuttal techniques and critical analysis of opposing viewpoints.",
      difficulty: 3,
      route: "/game/rebuttal-master",
      unlocked: true,
    },
    {
      id: "debate-quiz",
      name: "Debate Concepts Sprint",
      description:
        "Answer rapid questions on debate formats, rules, and argumentation principles.",
      educationalObjective:
        "Build theoretical knowledge of debate structure and argumentation theory.",
      difficulty: 1,
      route: "/game/debate-quiz",
      unlocked: true,
    },
  ],
  communicationSkills: [
    {
      id: "social-situations",
      name: "Social Situations Simulator",
      description:
        "Navigate complex social scenarios choosing correct communication strategies.",
      educationalObjective:
        "Develop interpersonal communication skills for diverse social contexts.",
      difficulty: 2,
      route: "/game/social-situations",
      unlocked: true,
    },
    {
      id: "register-master",
      name: "Register Master",
      description:
        "Switch between formal and informal language registers across different scenarios.",
      educationalObjective:
        "Understand formal and informal language registers and when to apply each.",
      difficulty: 2,
      route: "/game/register-master",
      unlocked: true,
    },
    {
      id: "communicate-well",
      name: "Communication Excellence",
      description:
        "Demonstrate effective communication including active listening and clear expression.",
      educationalObjective:
        "Apply core communication principles including clarity, empathy, and precision.",
      difficulty: 3,
      route: "/game/communicate-well",
      unlocked: true,
    },
  ],
  creativeWriting: [
    {
      id: "story-forge",
      name: "Story Forge",
      description:
        "Forge compelling stories using character development, setting, and plot techniques.",
      educationalObjective:
        "Develop creative writing skills including character, setting, and plot creation.",
      difficulty: 2,
      route: "/game/story-forge",
      unlocked: true,
    },
    {
      id: "creative-challenge",
      name: "Creative Writing Challenge",
      description:
        "Complete creative writing tasks under timed conditions with genre constraints.",
      educationalObjective:
        "Apply creative writing techniques across various genres and forms.",
      difficulty: 3,
      route: "/game/creative-challenge",
      unlocked: true,
    },
    {
      id: "write-master",
      name: "Writing Techniques Master",
      description:
        "Learn and apply advanced writing techniques through structured practice missions.",
      educationalObjective:
        "Master stylistic writing techniques including show-don't-tell and sensory detail.",
      difficulty: 1,
      route: "/game/write-master",
      unlocked: true,
    },
  ],
  // Robotics hubs
  robotBuilding: [
    {
      id: "assembly-line",
      name: "Robot Assembly Line",
      description:
        "Assemble robots correctly on a factory assembly line against time pressure.",
      educationalObjective:
        "Learn robot component identification and correct assembly procedures.",
      difficulty: 1,
      route: "/game/assembly-line",
      unlocked: true,
    },
    {
      id: "robot-quiz",
      name: "Robotics Knowledge Sprint",
      description:
        "Answer rapid-fire questions on robot types, components, and applications.",
      educationalObjective:
        "Build comprehensive knowledge of robotics theory and real-world applications.",
      difficulty: 1,
      route: "/game/robot-quiz",
      unlocked: true,
    },
    {
      id: "part-identifier",
      name: "Robot Parts Identifier",
      description:
        "Identify and classify robot components including actuators, sensors, and controllers.",
      educationalObjective:
        "Understand the functions of key robot components in mechanical systems.",
      difficulty: 2,
      route: "/game/part-identifier",
      unlocked: true,
    },
  ],
  sensorsHub: [
    {
      id: "sensor-interpreter",
      name: "Sensor Data Interpreter",
      description:
        "Read sensor outputs and program appropriate robot responses to environment changes.",
      educationalObjective:
        "Understand sensor types and how robots use sensor data to interact with environments.",
      difficulty: 2,
      route: "/game/sensor-interpreter",
      unlocked: true,
    },
    {
      id: "sensor-quiz",
      name: "Sensor Systems Sprint",
      description:
        "Identify sensor types and their applications in rapid challenge rounds.",
      educationalObjective:
        "Build knowledge of sensor technology including proximity, temperature, and light sensors.",
      difficulty: 1,
      route: "/game/sensor-quiz",
      unlocked: true,
    },
    {
      id: "threshold-master",
      name: "Threshold Configuration Master",
      description:
        "Set sensor thresholds to trigger correct robotic responses in complex environments.",
      educationalObjective:
        "Apply sensor threshold configuration principles to build responsive robotic systems.",
      difficulty: 3,
      route: "/game/threshold-master",
      unlocked: true,
    },
  ],
  circuitsHub: [
    {
      id: "electronic-lab-rob",
      name: "Electronics Lab Simulator",
      description:
        "Build functional electronic circuits on virtual breadboards with components.",
      educationalObjective:
        "Learn practical circuit building skills for robotics and electronics projects.",
      difficulty: 2,
      route: "/game/electronic-lab-rob",
      unlocked: true,
    },
    {
      id: "breadboard-builder",
      name: "Breadboard Builder",
      description:
        "Place and connect components on breadboards to create working electronic circuits.",
      educationalObjective:
        "Develop breadboard circuit construction skills for electronics prototyping.",
      difficulty: 1,
      route: "/game/breadboard-builder",
      unlocked: true,
    },
    {
      id: "component-quiz",
      name: "Electronic Components Sprint",
      description:
        "Identify electronic components and their circuit symbols in timed challenges.",
      educationalObjective:
        "Master electronic component identification for circuit reading and construction.",
      difficulty: 1,
      route: "/game/component-quiz",
      unlocked: true,
    },
  ],
  codingRobots: [
    {
      id: "block-code-commander",
      name: "Block Code Commander",
      description:
        "Command robots through complex mazes using block-based programming sequences.",
      educationalObjective:
        "Develop computational thinking through visual block-based programming.",
      difficulty: 1,
      route: "/game/block-code-commander",
      unlocked: true,
    },
    {
      id: "robot-maze",
      name: "Robot Maze Navigator",
      description:
        "Write programs that navigate robots through increasingly complex obstacle mazes.",
      educationalObjective:
        "Apply programming logic including loops and conditions to robot navigation.",
      difficulty: 2,
      route: "/game/robot-maze",
      unlocked: true,
    },
    {
      id: "logic-sequencer",
      name: "Logic Sequencer",
      description:
        "Program multi-step robot sequences solving complex tasks through logical ordering.",
      educationalObjective:
        "Master algorithmic sequencing and logical problem decomposition for robotics.",
      difficulty: 3,
      route: "/game/logic-sequencer",
      unlocked: true,
    },
  ],
  aiAutomation: [
    {
      id: "ml-trainer",
      name: "Machine Learning Trainer",
      description:
        "Train AI models with data sets and test classification accuracy on new examples.",
      educationalObjective:
        "Understand machine learning concepts including training, testing, and classification.",
      difficulty: 3,
      route: "/game/ml-trainer",
      unlocked: true,
    },
    {
      id: "classifier-quiz",
      name: "AI Classification Sprint",
      description:
        "Classify data examples correctly using AI logic in rapid-fire challenge rounds.",
      educationalObjective:
        "Apply classification concepts to understand how AI categorizes information.",
      difficulty: 2,
      route: "/game/classifier-quiz",
      unlocked: true,
    },
    {
      id: "ai-concepts",
      name: "AI Concepts Explorer",
      description:
        "Explore core AI concepts through interactive demonstrations and knowledge challenges.",
      educationalObjective:
        "Build foundational knowledge of AI, neural networks, and automation principles.",
      difficulty: 1,
      route: "/game/ai-concepts",
      unlocked: true,
    },
  ],
  electronicsLab: [
    {
      id: "component-identifier",
      name: "Component Identifier Challenge",
      description:
        "Identify electronic components from images and circuit diagrams at speed.",
      educationalObjective:
        "Master identification of resistors, capacitors, transistors, and other components.",
      difficulty: 1,
      route: "/game/component-identifier",
      unlocked: true,
    },
    {
      id: "resistor-reader",
      name: "Resistor Color Code Reader",
      description:
        "Decode resistor color bands to determine resistance values accurately.",
      educationalObjective:
        "Master the resistor color code system for practical electronics work.",
      difficulty: 2,
      route: "/game/resistor-reader",
      unlocked: true,
    },
    {
      id: "circuit-symbols",
      name: "Circuit Symbols Master",
      description:
        "Identify and draw circuit symbols for all standard electronic components.",
      educationalObjective:
        "Build proficiency with standardized circuit symbols for reading schematics.",
      difficulty: 2,
      route: "/game/circuit-symbols",
      unlocked: true,
    },
  ],
  machineLogic: [
    {
      id: "logic-gate-network",
      name: "Logic Gate Network Builder",
      description:
        "Connect logic gates to build digital circuits that produce correct binary outputs.",
      educationalObjective:
        "Understand AND, OR, NOT, NAND, NOR, XOR gates and digital circuit design.",
      difficulty: 2,
      route: "/game/logic-gate-network",
      unlocked: true,
    },
    {
      id: "truth-table",
      name: "Truth Table Constructor",
      description:
        "Complete truth tables for logic expressions and identify gate combinations.",
      educationalObjective:
        "Master truth table construction for Boolean logic analysis and verification.",
      difficulty: 3,
      route: "/game/truth-table",
      unlocked: true,
    },
    {
      id: "boolean-master",
      name: "Boolean Algebra Master",
      description:
        "Simplify Boolean expressions using algebra rules to optimize logic circuits.",
      educationalObjective:
        "Apply Boolean algebra laws to simplify digital logic expressions.",
      difficulty: 3,
      route: "/game/boolean-master",
      unlocked: true,
    },
  ],
  droneSystems: [
    {
      id: "drone-pilot",
      name: "Drone Pilot Training",
      description:
        "Complete drone navigation courses through 3D obstacle challenges.",
      educationalObjective:
        "Understand drone operation principles, flight physics, and control systems.",
      difficulty: 2,
      route: "/game/drone-pilot",
      unlocked: true,
    },
    {
      id: "flight-physics",
      name: "Flight Physics Lab",
      description:
        "Experiment with lift, thrust, drag, and weight forces in drone flight simulations.",
      educationalObjective:
        "Apply aerodynamic physics principles to understand how drones achieve flight.",
      difficulty: 3,
      route: "/game/flight-physics",
      unlocked: true,
    },
    {
      id: "navigation-quiz",
      name: "Navigation Systems Sprint",
      description:
        "Answer questions on GPS, compass navigation, and autonomous flight systems.",
      educationalObjective:
        "Build knowledge of navigation technologies used in drone and robotic systems.",
      difficulty: 1,
      route: "/game/navigation-quiz",
      unlocked: true,
    },
  ],
  smartHome: [
    {
      id: "smart-home-automator",
      name: "Smart Home Automator",
      description:
        "Program smart home devices to automate routines and respond to conditions.",
      educationalObjective:
        "Understand IoT automation logic and smart home system programming.",
      difficulty: 2,
      route: "/game/smart-home-automator",
      unlocked: true,
    },
    {
      id: "iot-quiz",
      name: "IoT Concepts Sprint",
      description:
        "Answer rapid-fire questions on Internet of Things devices and protocols.",
      educationalObjective:
        "Build foundational knowledge of IoT technology and connected device systems.",
      difficulty: 1,
      route: "/game/iot-quiz",
      unlocked: true,
    },
    {
      id: "automation-builder",
      name: "Automation Flow Builder",
      description:
        "Design if-this-then-that automation sequences for complex smart home scenarios.",
      educationalObjective:
        "Apply conditional automation logic to design responsive smart environment systems.",
      difficulty: 3,
      route: "/game/automation-builder",
      unlocked: true,
    },
  ],
  mechanicalEngineering: [
    {
      id: "gear-ratio-lab",
      name: "Gear Ratio Lab",
      description:
        "Calculate gear ratios and configure gear systems to achieve required speed and torque.",
      educationalObjective:
        "Understand gear ratios and mechanical advantage in simple machine systems.",
      difficulty: 2,
      route: "/game/gear-ratio-lab",
      unlocked: true,
    },
    {
      id: "pulley-system",
      name: "Pulley System Designer",
      description:
        "Design pulley configurations to lift loads with minimum force through mechanical advantage.",
      educationalObjective:
        "Apply pulley system principles and mechanical advantage to engineering problems.",
      difficulty: 2,
      route: "/game/pulley-system",
      unlocked: true,
    },
    {
      id: "machine-design",
      name: "Simple Machines Designer",
      description:
        "Select and configure simple machines to solve mechanical engineering design challenges.",
      educationalObjective:
        "Understand levers, pulleys, gears, and wedges as fundamental mechanical systems.",
      difficulty: 3,
      route: "/game/machine-design",
      unlocked: true,
    },
  ],
  industrialAutomation: [
    {
      id: "factory-controller",
      name: "Factory Controller",
      description:
        "Program factory automation sequences to maximize production output and efficiency.",
      educationalObjective:
        "Understand industrial automation principles and production line optimization.",
      difficulty: 3,
      route: "/game/factory-controller",
      unlocked: true,
    },
    {
      id: "plc-sequencer",
      name: "PLC Ladder Logic Sequencer",
      description:
        "Program PLC ladder logic diagrams to control industrial automation sequences.",
      educationalObjective:
        "Learn PLC programming fundamentals using ladder logic for industrial control.",
      difficulty: 3,
      route: "/game/plc-sequencer",
      unlocked: true,
    },
    {
      id: "process-quiz",
      name: "Industrial Process Sprint",
      description:
        "Answer rapid questions on industrial processes, sensors, and automation systems.",
      educationalObjective:
        "Build knowledge of industrial automation systems and manufacturing processes.",
      difficulty: 1,
      route: "/game/process-quiz",
      unlocked: true,
    },
  ],
  mechatronics: [
    {
      id: "system-integration",
      name: "System Integration Challenge",
      description:
        "Integrate mechanical, electronic, and software subsystems into a unified mechatronic system.",
      educationalObjective:
        "Understand systems integration principles combining mechanics, electronics, and software.",
      difficulty: 3,
      route: "/game/system-integration",
      unlocked: true,
    },
    {
      id: "mechatronics-quiz",
      name: "Mechatronics Concepts Sprint",
      description:
        "Answer questions across all mechatronics disciplines in rapid-fire challenge rounds.",
      educationalObjective:
        "Consolidate interdisciplinary mechatronics knowledge across all system domains.",
      difficulty: 2,
      route: "/game/mechatronics-quiz",
      unlocked: true,
    },
    {
      id: "integration-challenge",
      name: "Integration Design Lab",
      description:
        "Design complete mechatronic systems from requirements through component selection.",
      educationalObjective:
        "Apply engineering design methodology to complete mechatronics system projects.",
      difficulty: 3,
      route: "/game/integration-challenge",
      unlocked: true,
    },
  ],
  // Critical Thinking hubs
  logicPuzzle: [
    {
      id: "logic-grid-master",
      name: "Logic Grid Master",
      description:
        "Solve complex grid logic puzzles using deductive elimination and constraint analysis.",
      educationalObjective:
        "Develop deductive reasoning skills through systematic elimination logic puzzles.",
      difficulty: 2,
      route: "/game/logic-grid-master",
      unlocked: true,
    },
    {
      id: "logic-quiz",
      name: "Logic Concepts Sprint",
      description:
        "Answer rapid-fire questions on logical reasoning, fallacies, and argument structure.",
      educationalObjective:
        "Build foundational logical reasoning knowledge and argument analysis skills.",
      difficulty: 1,
      route: "/game/logic-quiz",
      unlocked: true,
    },
    {
      id: "deduction-master",
      name: "Deduction Master",
      description:
        "Work through advanced deductive chains to reach irrefutable logical conclusions.",
      educationalObjective:
        "Master formal deductive reasoning and logical argument construction.",
      difficulty: 3,
      route: "/game/deduction-master",
      unlocked: true,
    },
  ],
  memoryTraining: [
    {
      id: "memory-matrix",
      name: "Memory Matrix",
      description:
        "Memorize and reproduce complex grid patterns with increasing size and complexity.",
      educationalObjective:
        "Develop visual working memory capacity and pattern retention strategies.",
      difficulty: 2,
      route: "/game/memory-matrix",
      unlocked: true,
    },
    {
      id: "memory-sequence",
      name: "Memory Sequence Challenge",
      description:
        "Recall and reproduce extended sequences of numbers, colors, and symbols.",
      educationalObjective:
        "Build sequential memory capacity using chunking and encoding techniques.",
      difficulty: 2,
      route: "/game/memory-sequence",
      unlocked: true,
    },
    {
      id: "recall-challenge",
      name: "Total Recall Challenge",
      description:
        "Study complex information sets and reconstruct them perfectly under time pressure.",
      educationalObjective:
        "Develop long-term memory consolidation and retrieval strategies.",
      difficulty: 3,
      route: "/game/recall-challenge",
      unlocked: true,
    },
  ],
  strategyGames: [
    {
      id: "tactical-conquest",
      name: "Tactical Conquest",
      description:
        "Command armies in turn-based tactical battles requiring multi-move planning.",
      educationalObjective:
        "Develop strategic planning, resource management, and tactical decision-making.",
      difficulty: 3,
      route: "/game/tactical-conquest",
      unlocked: true,
    },
    {
      id: "strategy-quiz",
      name: "Strategy Concepts Sprint",
      description:
        "Answer questions on strategy game theory, decision trees, and planning frameworks.",
      educationalObjective:
        "Build strategic thinking vocabulary and framework knowledge.",
      difficulty: 1,
      route: "/game/strategy-quiz",
      unlocked: true,
    },
    {
      id: "battle-planner",
      name: "Battle Planner",
      description:
        "Plan complex multi-phase campaigns allocating limited resources for maximum effect.",
      educationalObjective:
        "Apply strategic resource allocation and planning under constraint challenges.",
      difficulty: 2,
      route: "/game/battle-planner",
      unlocked: true,
    },
  ],
  brainTeasers: [
    {
      id: "riddle-gauntlet",
      name: "Riddle Gauntlet",
      description:
        "Solve chains of increasingly difficult riddles requiring lateral thinking.",
      educationalObjective:
        "Develop lateral thinking and creative problem-solving through riddle challenges.",
      difficulty: 2,
      route: "/game/riddle-gauntlet",
      unlocked: true,
    },
    {
      id: "paradox-solver",
      name: "Paradox Solver",
      description:
        "Analyze and resolve classic logical paradoxes and counterintuitive reasoning challenges.",
      educationalObjective:
        "Develop tolerance for ambiguity and skills in analyzing contradictory information.",
      difficulty: 3,
      route: "/game/paradox-solver",
      unlocked: true,
    },
    {
      id: "lateral-thinking",
      name: "Lateral Thinking Challenges",
      description:
        "Solve problems by approaching them from unexpected creative angles and perspectives.",
      educationalObjective:
        "Build creative problem-solving skills through non-linear thinking approaches.",
      difficulty: 2,
      route: "/game/lateral-thinking",
      unlocked: true,
    },
  ],
  codingLogic: [
    {
      id: "algorithm-debugger",
      name: "Algorithm Debugger",
      description:
        "Identify and fix bugs in algorithms to restore correct program execution.",
      educationalObjective:
        "Develop systematic debugging skills and algorithmic thinking for programming.",
      difficulty: 2,
      route: "/game/algorithm-debugger",
      unlocked: true,
    },
    {
      id: "flowchart-tracer",
      name: "Flowchart Tracer",
      description:
        "Trace execution paths through complex flowcharts predicting program outputs.",
      educationalObjective:
        "Understand algorithmic flow control and program execution sequence reading.",
      difficulty: 2,
      route: "/game/flowchart-tracer",
      unlocked: true,
    },
    {
      id: "bug-hunt",
      name: "Bug Hunt Mission",
      description:
        "Locate hidden bugs across code bases using systematic testing and elimination.",
      educationalObjective:
        "Apply systematic testing methodologies to identify and classify code defects.",
      difficulty: 3,
      route: "/game/bug-hunt",
      unlocked: true,
    },
  ],
  escapeRoom: [
    {
      id: "digital-escape-room",
      name: "Digital Escape Room",
      description:
        "Solve interconnected puzzles to escape a digital challenge room within the time limit.",
      educationalObjective:
        "Apply multi-domain problem-solving skills in a sequential puzzle environment.",
      difficulty: 2,
      route: "/game/digital-escape-room",
      unlocked: true,
    },
    {
      id: "cipher-master",
      name: "Cipher Master",
      description:
        "Decode encrypted messages using classical ciphers to advance through mission levels.",
      educationalObjective:
        "Understand cryptographic principles through hands-on cipher decoding challenges.",
      difficulty: 3,
      route: "/game/cipher-master",
      unlocked: true,
    },
    {
      id: "puzzle-chain",
      name: "Puzzle Chain Challenge",
      description:
        "Solve chained puzzle sequences where each solution unlocks the next challenge.",
      educationalObjective:
        "Develop sequential problem-solving and solution transfer skills.",
      difficulty: 2,
      route: "/game/puzzle-chain",
      unlocked: true,
    },
  ],
  patternRecognition: [
    {
      id: "pattern-analyst",
      name: "Pattern Analyst",
      description:
        "Identify hidden patterns in complex visual sequences and data sets.",
      educationalObjective:
        "Develop visual pattern recognition and abstract reasoning abilities.",
      difficulty: 2,
      route: "/game/pattern-analyst",
      unlocked: true,
    },
    {
      id: "sequence-finder",
      name: "Sequence Finder",
      description:
        "Discover the rules governing complex sequences and predict continuation values.",
      educationalObjective:
        "Apply pattern recognition skills to identify mathematical and logical sequences.",
      difficulty: 2,
      route: "/game/sequence-finder",
      unlocked: true,
    },
    {
      id: "matrix-solver",
      name: "Matrix Pattern Solver",
      description:
        "Complete matrix patterns by identifying the governing transformation rules.",
      educationalObjective:
        "Develop abstract reasoning through visual matrix pattern completion tasks.",
      difficulty: 3,
      route: "/game/matrix-solver",
      unlocked: true,
    },
  ],
  detectiveInvestigation: [
    {
      id: "case-file-investigator",
      name: "Case File Investigator",
      description:
        "Analyze case files, cross-reference evidence, and identify the correct suspect.",
      educationalObjective:
        "Develop evidence evaluation and deductive reasoning through detective scenarios.",
      difficulty: 2,
      route: "/game/case-file-investigator",
      unlocked: true,
    },
    {
      id: "evidence-chain",
      name: "Evidence Chain Builder",
      description:
        "Connect evidence pieces into logical chains to build conclusive criminal cases.",
      educationalObjective:
        "Apply logical reasoning to build coherent arguments from fragments of evidence.",
      difficulty: 3,
      route: "/game/evidence-chain",
      unlocked: true,
    },
    {
      id: "suspect-list",
      name: "Suspect Elimination",
      description:
        "Systematically eliminate suspects by testing alibis, motives, and opportunities.",
      educationalObjective:
        "Develop systematic elimination reasoning and critical evidence evaluation.",
      difficulty: 1,
      route: "/game/suspect-list",
      unlocked: true,
    },
  ],
  strategicPlanning: [
    {
      id: "city-planner",
      name: "City Planner Challenge",
      description:
        "Plan and develop a city optimizing resources, services, and citizen happiness.",
      educationalObjective:
        "Apply long-term planning and resource optimization to complex system management.",
      difficulty: 3,
      route: "/game/city-planner",
      unlocked: true,
    },
    {
      id: "resource-allocator",
      name: "Resource Allocation Mission",
      description:
        "Allocate limited resources across competing priorities to maximize outcomes.",
      educationalObjective:
        "Develop resource allocation reasoning and prioritization under constraint.",
      difficulty: 2,
      route: "/game/resource-allocator",
      unlocked: true,
    },
    {
      id: "strategy-builder",
      name: "Strategy Builder",
      description:
        "Design multi-phase strategic plans with contingency options for unpredictable events.",
      educationalObjective:
        "Master strategic planning methodology including scenario planning and contingency.",
      difficulty: 2,
      route: "/game/strategy-builder",
      unlocked: true,
    },
  ],
  innovationLab: [
    {
      id: "invention-workshop",
      name: "Invention Workshop",
      description:
        "Prototype innovative solutions to real-world problems using design thinking tools.",
      educationalObjective:
        "Apply design thinking methodology including empathy, ideation, and prototyping.",
      difficulty: 2,
      route: "/game/invention-workshop",
      unlocked: true,
    },
    {
      id: "design-thinker",
      name: "Design Thinker Challenge",
      description:
        "Work through design thinking process stages to solve human-centered challenges.",
      educationalObjective:
        "Develop human-centered design thinking skills for innovation and problem-solving.",
      difficulty: 2,
      route: "/game/design-thinker",
      unlocked: true,
    },
    {
      id: "innovation-quiz",
      name: "Innovation Concepts Sprint",
      description:
        "Answer questions on innovation frameworks, creativity tools, and design principles.",
      educationalObjective:
        "Build knowledge of innovation processes and creative problem-solving frameworks.",
      difficulty: 1,
      route: "/game/innovation-quiz",
      unlocked: true,
    },
  ],
  decisionMaking: [
    {
      id: "consequence-simulator",
      name: "Consequence Simulator",
      description:
        "Make decisions and observe cascading consequences across complex simulation scenarios.",
      educationalObjective:
        "Develop consequence awareness and long-term thinking in decision-making.",
      difficulty: 3,
      route: "/game/consequence-simulator",
      unlocked: true,
    },
    {
      id: "choice-tree",
      name: "Decision Tree Navigator",
      description:
        "Navigate decision trees selecting optimal choices based on available information.",
      educationalObjective:
        "Apply decision tree analysis methodology to structured choice scenarios.",
      difficulty: 2,
      route: "/game/choice-tree",
      unlocked: true,
    },
    {
      id: "outcome-predictor",
      name: "Outcome Predictor",
      description:
        "Predict outcomes of decisions using probability, logic, and causal reasoning.",
      educationalObjective:
        "Develop probabilistic and causal reasoning for better decision-making outcomes.",
      difficulty: 2,
      route: "/game/outcome-predictor",
      unlocked: true,
    },
  ],
  problemSolving: [
    {
      id: "challenge-gauntlet",
      name: "Challenge Gauntlet",
      description:
        "Tackle escalating multi-stage challenges requiring diverse problem-solving approaches.",
      educationalObjective:
        "Apply flexible problem-solving strategies across varied challenge types.",
      difficulty: 3,
      route: "/game/challenge-gauntlet",
      unlocked: true,
    },
    {
      id: "constraint-solver",
      name: "Constraint Problem Solver",
      description:
        "Find solutions that satisfy multiple competing constraints simultaneously.",
      educationalObjective:
        "Develop constraint satisfaction problem-solving for engineering and logistics.",
      difficulty: 3,
      route: "/game/constraint-solver",
      unlocked: true,
    },
    {
      id: "optimization-lab",
      name: "Optimization Lab",
      description:
        "Find optimal solutions to maximization and minimization problems under constraints.",
      educationalObjective:
        "Apply optimization thinking to find best solutions within defined parameters.",
      difficulty: 2,
      route: "/game/optimization-lab",
      unlocked: true,
    },
  ],
};

// Fallback generic games for other hubs
function getDefaultGames(hubId: string): GameEntry[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${hubId}-game-${i + 1}`,
    name: `Mission ${i + 1}`,
    description:
      "Complete this mission to advance your knowledge and earn rewards.",
    educationalObjective:
      "Build core competencies aligned with Ghana Education Service standards.",
    difficulty: ((i % 3) + 1) as 1 | 2 | 3,
    route: `/game/${hubId}-${i + 1}`,
    unlocked: i < 2,
  }));
}

function DifficultyBadge({
  level,
  color,
}: { level: 1 | 2 | 3; color: string }) {
  const labels = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
  const opacities = { 1: "25", 2: "35", 3: "50" };
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase"
      style={{
        color,
        background: `${color}${opacities[level]}`,
        border: `1px solid ${color}50`,
      }}
    >
      <Star className="h-2.5 w-2.5" fill={color} />
      {labels[level]}
    </span>
  );
}

export default function HubPage() {
  const { hubId } = useParams({ from: "/hub/$hubId" });
  const navigate = useNavigate();
  const hub = getHubById(hubId);
  const subject = hub ? getSubjectById(hub.subjectId) : null;
  const { data: hubProgress = [] } = useAllHubProgress();
  const { data: recentScores = [] } = useMyRecentScores();
  const { playAmbience, stopAmbience } = useAudioContext();

  useEffect(() => {
    playAmbience(hubId ?? "menu");
    return () => stopAmbience();
  }, [hubId, playAmbience, stopAmbience]);

  if (!hub || !subject) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="hub.error_state"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Hub not found.</p>
          <GlowButton onClick={() => navigate({ to: "/world-map" })}>
            Return to World Map
          </GlowButton>
        </div>
      </div>
    );
  }

  const color = subject.color;
  const games = HUB_GAMES[hubId] ?? getDefaultGames(hubId);

  const hubProgressData = hubProgress.find((h) => h.hubId === hubId);
  const completedGames = hubProgressData
    ? Number(hubProgressData.missionsCompleted)
    : 0;
  const progressPercent =
    games.length > 0 ? Math.round((completedGames / games.length) * 100) : 0;

  const getPersonalBest = (gameId: string) => {
    const scores = recentScores
      .filter((s) => s.gameId === gameId)
      .map((s) => Number(s.score));
    return scores.length > 0 ? Math.max(...scores) : null;
  };

  const XP_REWARDS = { 1: 50, 2: 100, 3: 200 };

  const HUB_ACHIEVEMENTS = [
    {
      id: "first-play",
      label: "First Mission Cleared",
      earned: completedGames >= 1,
    },
    { id: "halfway", label: "Halfway Master", earned: completedGames >= 3 },
    {
      id: "full-clear",
      label: "Hub Champion",
      earned: completedGames >= games.length,
    },
    { id: "no-damage", label: "Flawless Run", earned: false },
  ];

  return (
    <div className="relative min-h-screen bg-background" data-ocid="hub.page">
      <ParticleBackground count={40} />

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-48 opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${color}30 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Breadcrumb nav */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/subject/$subjectId",
                params: { subjectId: hub.subjectId },
              })
            }
            data-ocid="hub.back_button"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {subject.name}
          </button>
          <span className="text-border">/</span>
          <span className="text-foreground/60 truncate">{hub.name}</span>
        </motion.div>

        {/* Hub header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl border p-6 mb-6"
          style={{ borderColor: `${color}30` }}
          data-ocid="hub.section"
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: 0.8,
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" style={{ color }} />
                <span
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color }}
                >
                  {subject.name} Hub
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif", color }}
              >
                {hub.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {hub.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Grade {hub.minGrade}–{hub.maxGrade}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" style={{ color }} />
                  <span className="text-xs" style={{ color }}>
                    Up to {XP_REWARDS[3]} XP per game
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs text-muted-foreground">
                    {completedGames}/{games.length} Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Progress ring */}
            <div className="shrink-0">
              <ProgressRing
                percent={progressPercent}
                size={80}
                strokeWidth={6}
                color={color}
              />
            </div>
          </div>
        </motion.div>

        {/* Games list */}
        <div className="space-y-3 mb-8" data-ocid="hub.game.list">
          <h2
            className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Missions
          </h2>

          {games.map((game, i) => {
            const personalBest = getPersonalBest(game.id);
            const xpReward = XP_REWARDS[game.difficulty];

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.07,
                  ease: "easeOut",
                }}
                data-ocid={`hub.game.item.${i + 1}`}
                className={[
                  "glass-card rounded-xl border overflow-hidden group transition-smooth",
                  game.unlocked
                    ? "border-border/30 cursor-pointer hover:border-opacity-60"
                    : "border-border/20 opacity-55",
                ].join(" ")}
                style={{
                  borderColor: game.unlocked ? `${color}25` : undefined,
                }}
                onClick={
                  game.unlocked
                    ? () =>
                        navigate({
                          to: game.route as "/game/$gameId",
                          params: { gameId: game.id },
                        })
                    : undefined
                }
                whileHover={game.unlocked ? { y: -2 } : {}}
              >
                {/* Hover glow */}
                {game.unlocked && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 0% 50%, ${color}0a 0%, transparent 60%)`,
                    }}
                  />
                )}

                <div className="flex items-start gap-4 p-4">
                  {/* Number badge */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                    style={{
                      background: game.unlocked
                        ? `${color}18`
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${game.unlocked ? `${color}40` : "rgba(255,255,255,0.08)"}`,
                      color: game.unlocked ? color : undefined,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {game.unlocked ? i + 1 : <Lock className="h-3.5 w-3.5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3
                        className="text-sm font-bold leading-snug"
                        style={{
                          fontFamily: "'Orbitron', sans-serif",
                          color: game.unlocked ? color : undefined,
                        }}
                      >
                        {game.name}
                      </h3>
                      <DifficultyBadge
                        level={game.difficulty}
                        color={game.unlocked ? color : "rgba(255,255,255,0.3)"}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-2">
                      <Target className="h-3 w-3 shrink-0" />
                      <span className="italic">
                        {game.educationalObjective}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase"
                          style={{ color: game.unlocked ? color : undefined }}
                        >
                          +{xpReward} XP
                        </span>
                        {personalBest !== null && (
                          <span className="text-[10px] text-accent font-bold">
                            Best: {personalBest.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {game.unlocked ? (
                        <motion.div
                          className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color }}
                        >
                          <Play className="h-3 w-3" fill={color} />
                          Launch
                        </motion.div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hub Progress / Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl border p-5"
          style={{ borderColor: `${color}20` }}
          data-ocid="hub.achievements.section"
        >
          <h2
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif", color }}
          >
            Hub Achievements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HUB_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className={[
                  "flex items-center gap-3 rounded-lg p-3 border transition-smooth",
                  ach.earned
                    ? "border-accent/30 bg-accent/5"
                    : "border-border/20 opacity-50",
                ].join(" ")}
              >
                <Trophy
                  className="h-4 w-4 shrink-0"
                  style={{ color: ach.earned ? "#f59e0b" : undefined }}
                  fill={ach.earned ? "#f59e0b" : "none"}
                />
                <span className="text-xs font-medium text-foreground/80">
                  {ach.label}
                </span>
                {ach.earned && (
                  <span className="ml-auto text-[9px] font-bold tracking-widest uppercase text-accent">
                    Earned
                  </span>
                )}
              </div>
            ))}
          </div>

          {hub.unlocked && hub.isPlayable && (
            <div className="mt-5 pt-4 border-t border-border/20 flex justify-center">
              <GlowButton
                onClick={() => {
                  const firstGame = games.find((g) => g.unlocked);
                  if (firstGame)
                    navigate({
                      to: firstGame.route as "/game/$gameId",
                      params: { gameId: firstGame.id },
                    });
                }}
                size="lg"
                data-ocid="hub.start_button"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Start First Mission
              </GlowButton>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
