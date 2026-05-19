import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

// ─── GAME 1: Invention Workshop ─────────────────────────────────────────────
type DesignStage = "empathize" | "define" | "ideate" | "prototype" | "test";
interface DesignChallenge {
  problem: string;
  context: string;
  stages: {
    empathize: {
      prompt: string;
      options: { id: string; label: string; correct: boolean }[];
    };
    define: {
      prompt: string;
      options: { id: string; label: string; correct: boolean }[];
    };
    ideate: {
      prompt: string;
      options: { id: string; label: string; score: number }[];
    };
    prototype: {
      prompt: string;
      components: { id: string; label: string; needed: boolean }[];
    };
    test: {
      prompt: string;
      outcomes: { id: string; label: string; good: boolean }[];
    };
  };
}

const CHALLENGES: Record<1 | 2 | 3, DesignChallenge> = {
  1: {
    problem: "Children in rural schools have no access to books.",
    context: "500 students, no library, 30km from nearest city.",
    stages: {
      empathize: {
        prompt: "Who are the most affected users?",
        options: [
          { id: "a", label: "Students aged 6-14", correct: true },
          { id: "b", label: "City bookstore owners", correct: false },
          { id: "c", label: "Government officials", correct: false },
        ],
      },
      define: {
        prompt: "Define the core problem:",
        options: [
          {
            id: "a",
            label: "Children lack access to reading materials for learning",
            correct: true,
          },
          { id: "b", label: "The school needs more teachers", correct: false },
          {
            id: "c",
            label: "The road to the city needs repair",
            correct: false,
          },
        ],
      },
      ideate: {
        prompt: "Select the most feasible solution idea:",
        options: [
          {
            id: "a",
            label: "Solar-powered e-reader library (reusable, offline)",
            score: 90,
          },
          { id: "b", label: "Monthly book bus delivery from city", score: 60 },
          { id: "c", label: "Build a large library building", score: 30 },
        ],
      },
      prototype: {
        prompt: "Select required components for your design:",
        components: [
          { id: "solar_panel", label: "Solar Panel", needed: true },
          { id: "e_reader", label: "E-Reader Devices", needed: true },
          { id: "wifi_router", label: "Wi-Fi Router", needed: false },
          { id: "content", label: "Offline Book Content", needed: true },
          { id: "bookshelf", label: "Physical Bookshelf", needed: false },
        ],
      },
      test: {
        prompt: "Simulate the solution. Which outcome do you see?",
        outcomes: [
          {
            id: "a",
            label: "Students can access 500+ books offline using solar power",
            good: true,
          },
          {
            id: "b",
            label: "Students still cannot access books due to no internet",
            good: false,
          },
          {
            id: "c",
            label: "Only students near outlets can use the devices",
            good: false,
          },
        ],
      },
    },
  },
  2: {
    problem: "Workers in a factory suffer from repetitive strain injuries.",
    context: "300 workers, 8hr shifts, manual assembly line.",
    stages: {
      empathize: {
        prompt: "Who faces the highest risk?",
        options: [
          {
            id: "a",
            label: "Assembly line workers doing repetitive motions",
            correct: true,
          },
          { id: "b", label: "Office managers", correct: false },
          { id: "c", label: "Factory investors", correct: false },
        ],
      },
      define: {
        prompt: "The core problem is:",
        options: [
          {
            id: "a",
            label: "Repetitive manual tasks cause physical injuries over time",
            correct: true,
          },
          { id: "b", label: "Workers arrive late to shifts", correct: false },
          { id: "c", label: "The factory produces too slowly", correct: false },
        ],
      },
      ideate: {
        prompt: "Best solution approach:",
        options: [
          {
            id: "a",
            label:
              "Introduce robotic arms for repetitive tasks + worker retraining",
            score: 95,
          },
          { id: "b", label: "Give workers more breaks", score: 50 },
          { id: "c", label: "Hire more workers to share the load", score: 40 },
        ],
      },
      prototype: {
        prompt: "Select components for the robotic system:",
        components: [
          { id: "robot_arm", label: "Robotic Arm", needed: true },
          { id: "sensor", label: "Safety Sensors", needed: true },
          { id: "training", label: "Worker Retraining Program", needed: true },
          { id: "camera", label: "Surveillance Camera", needed: false },
          { id: "coffee", label: "Coffee Machine", needed: false },
        ],
      },
      test: {
        prompt: "Test result:",
        outcomes: [
          {
            id: "a",
            label: "Injuries reduced by 80%, productivity increased",
            good: true,
          },
          { id: "b", label: "Workers refuse to use the robots", good: false },
          {
            id: "c",
            label: "Robots malfunction due to missing safety sensors",
            good: false,
          },
        ],
      },
    },
  },
  3: {
    problem: "Urban flooding destroys homes every rainy season.",
    context: "City of 2M, poor drainage, climate change intensifying rainfall.",
    stages: {
      empathize: {
        prompt: "Primary affected group:",
        options: [
          {
            id: "a",
            label: "Low-income families in flood-prone zones",
            correct: true,
          },
          { id: "b", label: "Suburban homeowners", correct: false },
          { id: "c", label: "Airport operators", correct: false },
        ],
      },
      define: {
        prompt: "Root cause:",
        options: [
          {
            id: "a",
            label:
              "Inadequate drainage infrastructure combined with climate-driven rainfall increases",
            correct: true,
          },
          {
            id: "b",
            label: "People build homes in flood areas by choice",
            correct: false,
          },
          { id: "c", label: "City population is too large", correct: false },
        ],
      },
      ideate: {
        prompt: "Most comprehensive solution:",
        options: [
          {
            id: "a",
            label:
              "Smart drainage network + green permeable infrastructure + early warning system",
            score: 95,
          },
          { id: "b", label: "Relocate all flood zone residents", score: 40 },
          { id: "c", label: "Build walls around flood zones", score: 30 },
        ],
      },
      prototype: {
        prompt: "Design components:",
        components: [
          { id: "drainage", label: "Underground Drainage", needed: true },
          { id: "sensors", label: "Flood Sensors", needed: true },
          { id: "green_roof", label: "Green Permeable Surfaces", needed: true },
          { id: "alert", label: "SMS Alert System", needed: true },
          { id: "fountain", label: "Decorative Fountains", needed: false },
        ],
      },
      test: {
        prompt: "Test outcomes:",
        outcomes: [
          {
            id: "a",
            label:
              "Flood levels reduced 70%, early warnings evacuate 95% of residents",
            good: true,
          },
          {
            id: "b",
            label: "Sensors fail due to power outages during storms",
            good: false,
          },
          {
            id: "c",
            label: "Green surfaces help but drainage is still insufficient",
            good: false,
          },
        ],
      },
    },
  },
};

const STAGE_ORDER: DesignStage[] = [
  "empathize",
  "define",
  "ideate",
  "prototype",
  "test",
];

// ─── GAME 2: Design Thinking ──────────────────────────────────────────────────
interface DesignThinkingProblem {
  title: string;
  context: string;
  empathize: {
    prompt: string;
    options: {
      id: string;
      label: string;
      correct: boolean;
      explanation: string;
    }[];
  };
  define: {
    prompt: string;
    options: {
      id: string;
      label: string;
      correct: boolean;
      explanation: string;
    }[];
  };
  ideate: {
    prompt: string;
    ideas: { id: string; label: string }[];
    correctRanking: string[];
  };
  prototype: {
    prompt: string;
    features: { id: string; label: string; needed: boolean }[];
    neededCount: number;
  };
  test: {
    prompt: string;
    feedback: string;
    options: {
      id: string;
      label: string;
      correct: boolean;
      explanation: string;
    }[];
  };
}

const DESIGN_PROBLEMS: DesignThinkingProblem[] = [
  {
    title: "Students always forget their homework assignments",
    context:
      "Secondary school, mixed smartphone ownership, teachers assign work verbally or via whiteboard.",
    empathize: {
      prompt: "What is the best way to understand this problem deeply?",
      options: [
        {
          id: "a",
          label:
            "Survey 50 students about their homework tracking methods and failure points",
          correct: true,
          explanation:
            "Primary user research with a representative sample is the gold standard for Empathize phase.",
        },
        {
          id: "b",
          label: "Read academic papers about memory and forgetting",
          correct: false,
          explanation:
            "Academic research is useful background but does not capture this specific user's experience.",
        },
        {
          id: "c",
          label: "Ask the headmaster what they think the problem is",
          correct: false,
          explanation:
            "Administrator perspective misses the student's direct experience of the problem.",
        },
      ],
    },
    define: {
      prompt: "Select the best problem statement:",
      options: [
        {
          id: "a",
          label:
            "Students need a reliable, low-effort way to capture and review assignments because current methods depend on memory and inconsistent communication.",
          correct: true,
          explanation:
            "User-centred, specific, actionable, and points toward solutions without prescribing them.",
        },
        {
          id: "b",
          label: "The school needs a homework policy.",
          correct: false,
          explanation:
            "Too vague, system-focused, not user-centred, and does not capture the root cause.",
        },
        {
          id: "c",
          label: "Students should be more responsible.",
          correct: false,
          explanation:
            "Blames the user rather than framing a design opportunity. Not actionable for a designer.",
        },
      ],
    },
    ideate: {
      prompt:
        "Rank these 6 ideas from most creative/practical (1) to least (6):",
      ideas: [
        { id: "a", label: "Class WhatsApp group where assignments are posted" },
        {
          id: "b",
          label:
            "School-provided digital assignment tracker app with teacher input",
        },
        { id: "c", label: "Physical assignment diary stamped by teacher" },
        {
          id: "d",
          label: "End-of-lesson assignment recap projected on screen",
        },
        { id: "e", label: "AI reminder system synced to school timetable" },
        { id: "f", label: "Homework is abolished entirely" },
      ],
      correctRanking: ["b", "d", "e", "a", "c", "f"],
    },
    prototype: {
      prompt:
        "Build the Minimum Viable Product. Select 3 essential features from 8:",
      features: [
        {
          id: "assignment_list",
          label: "Assignment list with due dates",
          needed: true,
        },
        {
          id: "teacher_post",
          label: "Teacher can post assignments directly",
          needed: true,
        },
        {
          id: "notification",
          label: "Reminder notification before deadline",
          needed: true,
        },
        {
          id: "gamification",
          label: "Gamification with badges and leaderboards",
          needed: false,
        },
        { id: "ai_tutor", label: "AI tutoring system", needed: false },
        { id: "social", label: "Social feed and messaging", needed: false },
        {
          id: "analytics",
          label: "Teacher analytics dashboard",
          needed: false,
        },
        {
          id: "calendar",
          label: "Full school timetable integration",
          needed: false,
        },
      ],
      neededCount: 3,
    },
    test: {
      prompt:
        "After 2 weeks of testing, 70% of students completed homework on time but teachers found posting assignments took 5 extra minutes per class. What do you decide?",
      feedback:
        "Pilot users: strong adoption from students, but teacher time cost is creating resistance.",
      options: [
        {
          id: "a",
          label:
            "Iterate: streamline the teacher posting flow to under 60 seconds before wider rollout",
          correct: true,
          explanation:
            "Identifies the specific friction point and plans a targeted iteration. Sound design thinking.",
        },
        {
          id: "b",
          label:
            "Launch immediately — student adoption numbers are strong enough",
          correct: false,
          explanation:
            "Ignores a critical stakeholder's pain point that will undermine adoption over time.",
        },
        {
          id: "c",
          label: "Abandon the project — if teachers won't use it, it will fail",
          correct: false,
          explanation:
            "Premature abandonment based on solvable friction. The student data is encouraging.",
        },
      ],
    },
  },
  {
    title: "People with disabilities struggle to use standard keyboards",
    context:
      "A tech company wants to build an accessible input device. Budget: moderate. Users: physical and motor disabilities.",
    empathize: {
      prompt: "Best user research method for this problem:",
      options: [
        {
          id: "a",
          label:
            "Conduct contextual observation sessions with 10 users with different disabilities, observing how they currently interact with keyboards",
          correct: true,
          explanation:
            "Contextual observation captures real barriers that surveys or interviews alone might miss.",
        },
        {
          id: "b",
          label: "Review existing accessibility guidelines and standards",
          correct: false,
          explanation:
            "Guidelines are valuable but secondary research — they cannot replace observing actual user struggles.",
        },
        {
          id: "c",
          label: "Prototype a solution based on the design team's assumptions",
          correct: false,
          explanation:
            "Jumping to prototyping without research produces solutions designed for the team, not the user.",
        },
      ],
    },
    define: {
      prompt: "Select the best problem statement:",
      options: [
        {
          id: "a",
          label:
            "People with limited motor control need an input method that adapts to their range of motion because standard keyboards require fine motor skills that many cannot reliably perform.",
          correct: true,
          explanation:
            "Specific, user-centred, identifies the functional gap, points to an opportunity space.",
        },
        {
          id: "b",
          label: "Keyboards are too difficult.",
          correct: false,
          explanation:
            "Too vague, not user-centred, provides no direction for design.",
        },
        {
          id: "c",
          label: "We should build a better keyboard.",
          correct: false,
          explanation:
            "Jumps to a solution before defining the problem. Not a valid problem statement.",
        },
      ],
    },
    ideate: {
      prompt:
        "Rank these 6 solution ideas from most feasible/impactful (1) to least (6):",
      ideas: [
        { id: "a", label: "Eye-tracking input system" },
        { id: "b", label: "Voice recognition with error correction" },
        {
          id: "c",
          label: "Switch-scanning interface with single-button input",
        },
        { id: "d", label: "Brain-computer interface typing" },
        { id: "e", label: "Enlarged touch keyboard with gesture shortcuts" },
        { id: "f", label: "AI prediction that reduces keystrokes by 70%" },
      ],
      correctRanking: ["b", "c", "e", "f", "a", "d"],
    },
    prototype: {
      prompt:
        "Select 3 MVP features from 8 for an adaptive keyboard prototype:",
      features: [
        { id: "voice_input", label: "Voice input mode", needed: true },
        { id: "large_keys", label: "Configurable key sizing", needed: true },
        { id: "prediction", label: "Predictive word completion", needed: true },
        {
          id: "rgb_lighting",
          label: "Customizable RGB key lighting",
          needed: false,
        },
        { id: "gaming_mode", label: "Gaming optimisation mode", needed: false },
        { id: "wireless", label: "Long-range Bluetooth", needed: false },
        { id: "waterproof", label: "Waterproof casing", needed: false },
        { id: "emoji", label: "Emoji quick-access panel", needed: false },
      ],
      neededCount: 3,
    },
    test: {
      prompt:
        "Testing with 8 users: voice input works well for 6 users, but 2 users with speech impairments cannot use it at all. What do you decide?",
      feedback:
        "Core voice mode works for most. Speech-impaired users are completely excluded by the primary input method.",
      options: [
        {
          id: "a",
          label:
            "Iterate: ensure alternative input modes (switch/eye) are equally supported before launch, not as afterthoughts",
          correct: true,
          explanation:
            "Inclusive design requires all identified user groups to have a viable primary pathway, not just a majority.",
        },
        {
          id: "b",
          label:
            "Launch for the 75% it works for and address the remaining users in version 2",
          correct: false,
          explanation:
            "Deliberately shipping a product that excludes a known vulnerable group violates accessibility design principles.",
        },
        {
          id: "c",
          label: "Remove voice input and focus only on physical alternatives",
          correct: false,
          explanation:
            "Abandons a proven feature for the majority. The goal is to expand, not contract, the accessible pathway.",
        },
      ],
    },
  },
  {
    title: "Street vendors lose stock and income during unexpected rain",
    context:
      "Urban market, West Africa, vendors lack weather alerts and protective infrastructure.",
    empathize: {
      prompt: "Best research method to understand the vendors' experience:",
      options: [
        {
          id: "a",
          label:
            "Spend 3 days at the market, talking to vendors and observing what happens when it rains",
          correct: true,
          explanation:
            "Ethnographic research at the point of experience generates deep, contextual insights.",
        },
        {
          id: "b",
          label: "Check weather bureau statistics for annual rainfall",
          correct: false,
          explanation:
            "Data on rain frequency does not capture the vendor's experience, coping strategies, or losses.",
        },
        {
          id: "c",
          label: "Create a survey and post it in local Facebook groups",
          correct: false,
          explanation:
            "Many street vendors may not use social media; the sample would be unrepresentative.",
        },
      ],
    },
    define: {
      prompt: "Best problem statement:",
      options: [
        {
          id: "a",
          label:
            "Street vendors need advance warning of rain and rapid access to protective cover because unexpected rainfall destroys unprotected stock and eliminates daily income.",
          correct: true,
          explanation:
            "Specific, user-centred, identifies twin needs (warning + protection), quantifies the impact.",
        },
        {
          id: "b",
          label: "The market needs better infrastructure.",
          correct: false,
          explanation:
            "Too broad and system-level. Does not specify the user need or the root cause.",
        },
        {
          id: "c",
          label: "Rain is unpredictable and damages goods.",
          correct: false,
          explanation:
            "Describes the condition, not the user need. Not actionable as a design brief.",
        },
      ],
    },
    ideate: {
      prompt: "Rank these solution ideas most to least impactful and feasible:",
      ideas: [
        {
          id: "a",
          label: "WhatsApp-based rain alert system using local weather API",
        },
        { id: "b", label: "Rapid-deploy collapsible shelter on each stall" },
        { id: "c", label: "Covered market hall with permanent roof" },
        { id: "d", label: "Market insurance scheme for rain losses" },
        { id: "e", label: "Waterproof packaging for all goods" },
        { id: "f", label: "Move the market indoors entirely" },
      ],
      correctRanking: ["a", "b", "e", "d", "c", "f"],
    },
    prototype: {
      prompt: "Select 3 MVP features for a rain alert and protection system:",
      features: [
        {
          id: "sms_alert",
          label: "SMS/WhatsApp rain warning 2 hours ahead",
          needed: true,
        },
        {
          id: "cover",
          label: "Low-cost collapsible shelter design",
          needed: true,
        },
        {
          id: "training",
          label: "Rapid cover deployment training for vendors",
          needed: true,
        },
        {
          id: "insurance",
          label: "Full market insurance system",
          needed: false,
        },
        {
          id: "perm_roof",
          label: "Permanent roof installation",
          needed: false,
        },
        {
          id: "app",
          label: "Full smartphone app with analytics",
          needed: false,
        },
        {
          id: "sensor",
          label: "Weather sensor network across the city",
          needed: false,
        },
        {
          id: "solar",
          label: "Solar-powered charging stations",
          needed: false,
        },
      ],
      neededCount: 3,
    },
    test: {
      prompt:
        "After 2 weeks: alerts were accurate 8/10 times and 85% of vendors deployed cover in time. However, 30% of vendors missed alerts because they did not check WhatsApp regularly. What do you decide?",
      feedback:
        "Strong results overall, but a gap in alert reach for low-engagement users.",
      options: [
        {
          id: "a",
          label:
            "Iterate: add a loud audio alarm or market PA system for vendors who miss digital alerts",
          correct: true,
          explanation:
            "Addresses the specific gap with a complementary low-tech solution that reaches all users.",
        },
        {
          id: "b",
          label:
            "Require all vendors to check WhatsApp as a condition of using the system",
          correct: false,
          explanation:
            "Puts burden on users rather than designing around their existing behaviour patterns.",
        },
        {
          id: "c",
          label: "Launch as-is — 85% success rate is commercially acceptable",
          correct: false,
          explanation:
            "The 15% who remain unprotected still lose stock. In human-centred design, acceptable performance means reaching all users.",
        },
      ],
    },
  },
  {
    title: "Elderly residents struggle to navigate a new hospital system",
    context:
      "Large urban hospital, newly digitised. Elderly patients must book online, check in via kiosk, and navigate app.",
    empathize: {
      prompt: "Best method to understand the elderly patients' experience:",
      options: [
        {
          id: "a",
          label:
            "Accompany 8 elderly patients through the full hospital visit process, noting every friction point",
          correct: true,
          explanation:
            "Accompanied journey mapping reveals real pain points that patients themselves might not articulate.",
        },
        {
          id: "b",
          label: "Read hospital complaint emails from the last year",
          correct: false,
          explanation:
            "Complaint data reveals only problems patients chose to report — many give up silently.",
        },
        {
          id: "c",
          label: "Interview hospital IT staff about system features",
          correct: false,
          explanation:
            "Designers, not IT staff, experience usability barriers. The user is the source of truth.",
        },
      ],
    },
    define: {
      prompt: "Best problem statement:",
      options: [
        {
          id: "a",
          label:
            "Elderly patients need a way to complete hospital processes independently because the current digital system assumes literacy, smartphone ownership, and internet access that many elderly people do not have.",
          correct: true,
          explanation:
            "Names the capability gap, identifies the assumption the system makes, and points toward inclusive design solutions.",
        },
        {
          id: "b",
          label: "The hospital app is too complicated.",
          correct: false,
          explanation:
            "Opinion without user context or direction for redesign.",
        },
        {
          id: "c",
          label: "Elderly people find technology difficult.",
          correct: false,
          explanation:
            "Stereotypes the user group without identifying specific barriers or the system's role in creating them.",
        },
      ],
    },
    ideate: {
      prompt: "Rank these solution ideas most to least appropriate:",
      ideas: [
        {
          id: "a",
          label:
            "Simplified 'senior mode' in the app with large text and voice guidance",
        },
        {
          id: "b",
          label: "Dedicated human-assisted help desk at the hospital entrance",
        },
        { id: "c", label: "Phone booking option as an alternative to online" },
        {
          id: "d",
          label: "Printed step-by-step guide in large font at each kiosk",
        },
        {
          id: "e",
          label: "Family member login to manage booking on patient's behalf",
        },
        { id: "f", label: "Train all elderly patients in smartphone usage" },
      ],
      correctRanking: ["b", "c", "a", "d", "e", "f"],
    },
    prototype: {
      prompt: "Select 3 MVP features for an inclusive hospital access system:",
      features: [
        {
          id: "phone_booking",
          label: "Telephone booking hotline with human agent",
          needed: true,
        },
        {
          id: "guide",
          label: "Large-print step-by-step kiosk guide",
          needed: true,
        },
        { id: "help_desk", label: "Staffed entrance help desk", needed: true },
        { id: "biometric", label: "Biometric patient ID", needed: false },
        { id: "chatbot", label: "AI chatbot assistant", needed: false },
        { id: "app_redesign", label: "Full app redesign", needed: false },
        { id: "smart_watch", label: "Smartwatch integration", needed: false },
        {
          id: "facial_recognition",
          label: "Facial recognition check-in",
          needed: false,
        },
      ],
      neededCount: 3,
    },
    test: {
      prompt:
        "After a 3-week pilot: the help desk reduced navigation complaints by 60%. However, it has a queue at peak times and some patients still miss appointments due to booking confusion. What do you decide?",
      feedback:
        "Help desk is effective but creates a new bottleneck. Booking remains a gap.",
      options: [
        {
          id: "a",
          label:
            "Iterate: add telephone booking and a second help desk agent during peak hours to address both remaining pain points",
          correct: true,
          explanation:
            "Targets both identified gaps simultaneously with low-cost, proven solutions.",
        },
        {
          id: "b",
          label:
            "Launch the current system — 60% improvement is significant progress",
          correct: false,
          explanation:
            "Remaining missed appointments represent real patient harm. Iteration is the appropriate design thinking response.",
        },
        {
          id: "c",
          label: "Redesign the entire digital system from scratch",
          correct: false,
          explanation:
            "Over-engineering: the non-digital interventions are already working. Iteration, not overhaul, is indicated.",
        },
      ],
    },
  },
  {
    title: "Secondary school canteen generates excessive food waste daily",
    context:
      "1,200 students, fixed menu, large portions, no tracking of what is wasted.",
    empathize: {
      prompt: "Best method to understand the waste problem:",
      options: [
        {
          id: "a",
          label:
            "Measure and categorise the waste at collection point for 5 consecutive days and survey students on why they leave food",
          correct: true,
          explanation:
            "Mixed method: quantitative waste data combined with qualitative user insight gives a complete picture.",
        },
        {
          id: "b",
          label: "Ask the canteen manager what they think causes waste",
          correct: false,
          explanation:
            "Single stakeholder perspective, likely to identify symptoms rather than root causes.",
        },
        {
          id: "c",
          label: "Look at international reports on school food waste",
          correct: false,
          explanation:
            "Secondary research lacks context for this specific school's population and culture.",
        },
      ],
    },
    define: {
      prompt: "Best problem statement:",
      options: [
        {
          id: "a",
          label:
            "The canteen needs a system to match food production to actual student demand because portions and menu choices are currently based on assumptions rather than data, generating avoidable daily waste.",
          correct: true,
          explanation:
            "Identifies the root cause (data gap), not just the symptom (waste), and points toward a data-driven solution space.",
        },
        {
          id: "b",
          label: "Students do not eat all their food.",
          correct: false,
          explanation:
            "Symptom-level observation. Does not identify why, for whom, or how to solve it.",
        },
        {
          id: "c",
          label: "The canteen cooks too much food.",
          correct: false,
          explanation:
            "Partially correct but does not identify the underlying cause — lack of demand prediction data.",
        },
      ],
    },
    ideate: {
      prompt: "Rank these solution ideas most to least impactful:",
      ideas: [
        {
          id: "a",
          label: "Pre-order system: students select meals the day before",
        },
        {
          id: "b",
          label: "Portion choice: small, medium, large at same price",
        },
        { id: "c", label: "Weekly menu survey to track preferences" },
        { id: "d", label: "Donate surplus food to local community centre" },
        { id: "e", label: "Composting system for unavoidable waste" },
        { id: "f", label: "Fine students for leaving food" },
      ],
      correctRanking: ["a", "b", "c", "d", "e", "f"],
    },
    prototype: {
      prompt: "Select 3 MVP features for a waste reduction system:",
      features: [
        { id: "preorder", label: "Digital pre-order system", needed: true },
        { id: "portions", label: "Three portion size options", needed: true },
        {
          id: "tracking",
          label: "Daily waste tracking dashboard for kitchen",
          needed: true,
        },
        {
          id: "reward",
          label: "Points/rewards for finishing meals",
          needed: false,
        },
        { id: "compost", label: "On-site composting unit", needed: false },
        {
          id: "live_camera",
          label: "Live kitchen camera for parents",
          needed: false,
        },
        {
          id: "ai_chef",
          label: "AI-powered meal planning system",
          needed: false,
        },
        { id: "recipe_db", label: "Full recipe database", needed: false },
      ],
      neededCount: 3,
    },
    test: {
      prompt:
        "After 3 weeks: waste reduced by 45%. However, only 60% of students completed pre-orders; the other 40% grabbed whatever was left, undermining prediction accuracy. What do you decide?",
      feedback:
        "Strong waste reduction but pre-order adoption is incomplete, limiting demand prediction.",
      options: [
        {
          id: "a",
          label:
            "Iterate: make pre-order the default and introduce a small incentive (priority queue) to increase adoption to 90%+",
          correct: true,
          explanation:
            "Behavioural design principle: make the desired behaviour the default and the easiest option.",
        },
        {
          id: "b",
          label: "Launch as-is — 45% waste reduction is a clear success",
          correct: false,
          explanation:
            "Significant improvement but the 40% non-adopters are the key lever for further gains.",
        },
        {
          id: "c",
          label: "Make pre-ordering mandatory and penalise non-compliance",
          correct: false,
          explanation:
            "Coercive approach likely to generate resentment and reduce overall participation.",
        },
      ],
    },
  },
];

// ─── GAME 3: Innovation Challenge ──────────────────────────────────────────────
interface InnovationChallenge {
  title: string;
  constraints: string[];
  solutions: {
    id: string;
    label: string;
    modelRatings: {
      feasibility: number;
      desirability: number;
      viability: number;
    };
    justifications: string[];
    bestJustifications: string[];
  }[];
  bestSolutionId: string;
}

const INNOVATION_CHALLENGES: InnovationChallenge[] = [
  {
    title: "Design a community library for a village with no electricity",
    constraints: [
      "No electricity available",
      "Limited budget (under $500)",
      "Materials must be locally sourceable",
      "Must be usable by all ages",
      "Must be durable in rainy season",
    ],
    solutions: [
      {
        id: "a",
        label: "Solar-powered digital kiosk with e-books",
        modelRatings: { feasibility: 2, desirability: 4, viability: 2 },
        justifications: [
          "Accessible from anywhere with signal",
          "No electricity means no reliable power for kiosk",
          "High initial cost exceeds budget",
          "Digital divide excludes older users",
        ],
        bestJustifications: [
          "No electricity means no reliable power for kiosk",
          "High initial cost exceeds budget",
        ],
      },
      {
        id: "b",
        label:
          "Physical book-sharing hut with sealed wooden shelves and a community ledger",
        modelRatings: { feasibility: 5, desirability: 4, viability: 5 },
        justifications: [
          "No electricity needed",
          "Materials available locally",
          "Durable design with weather protection",
          "Community-managed with minimal cost",
        ],
        bestJustifications: [
          "No electricity needed",
          "Community-managed with minimal cost",
        ],
      },
      {
        id: "c",
        label: "Monthly travelling librarian on a bicycle",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Reaches different areas",
          "Dependent on one person's availability",
          "Difficult to maintain in rainy season",
          "No fixed infrastructure",
        ],
        bestJustifications: [
          "Reaches different areas",
          "Dependent on one person's availability",
        ],
      },
      {
        id: "d",
        label: "Radio-based audio book broadcasting",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Battery-powered radios available",
          "Does not support interactive literacy",
          "Limited book selection possible",
          "Broadcast-only with no choice",
        ],
        bestJustifications: [
          "Battery-powered radios available",
          "Does not support interactive literacy",
        ],
      },
      {
        id: "e",
        label: "Smartphone app with offline e-library",
        modelRatings: { feasibility: 2, desirability: 3, viability: 2 },
        justifications: [
          "Modern and scalable",
          "Requires smartphone ownership across the community",
          "No electricity for charging",
          "Data literacy required",
        ],
        bestJustifications: [
          "Requires smartphone ownership across the community",
          "No electricity for charging",
        ],
      },
      {
        id: "f",
        label: "Partnership with a city school to donate books quarterly",
        modelRatings: { feasibility: 4, desirability: 4, viability: 4 },
        justifications: [
          "Builds relationships between communities",
          "Dependent on city school continuity",
          "No infrastructure for the books",
          "Relies on external goodwill",
        ],
        bestJustifications: [
          "Builds relationships between communities",
          "Dependent on city school continuity",
        ],
      },
    ],
    bestSolutionId: "b",
  },
  {
    title:
      "Design a low-cost health screening system for elderly patients in remote areas",
    constraints: [
      "Must reach patients who cannot travel",
      "Healthcare workers have basic (not specialist) training",
      "No hospital nearby",
      "Must be affordable per patient",
      "Must work without reliable internet",
    ],
    solutions: [
      {
        id: "a",
        label: "AI diagnostic app requiring specialist doctors via video call",
        modelRatings: { feasibility: 2, desirability: 4, viability: 2 },
        justifications: [
          "High accuracy potential",
          "Requires reliable internet",
          "Requires specialist availability",
          "High cost per interaction",
        ],
        bestJustifications: [
          "Requires reliable internet",
          "Requires specialist availability",
        ],
      },
      {
        id: "b",
        label:
          "Community health worker with a basic vitals kit and paper checklist",
        modelRatings: { feasibility: 5, desirability: 4, viability: 5 },
        justifications: [
          "No internet required",
          "Trained lay workers can operate it",
          "Very low cost per patient",
          "Builds local health capacity",
        ],
        bestJustifications: [
          "No internet required",
          "Very low cost per patient",
        ],
      },
      {
        id: "c",
        label: "Mobile health clinic van visiting monthly",
        modelRatings: { feasibility: 3, desirability: 5, viability: 3 },
        justifications: [
          "Comprehensive screening possible",
          "High operating cost",
          "Monthly frequency may miss acute cases",
          "Road access may be limited",
        ],
        bestJustifications: [
          "Comprehensive screening possible",
          "High operating cost",
        ],
      },
      {
        id: "d",
        label: "Wearable health monitor distributed to all patients",
        modelRatings: { feasibility: 2, desirability: 4, viability: 2 },
        justifications: [
          "Continuous monitoring",
          "High device cost",
          "Requires data literacy",
          "Battery and charging dependency",
        ],
        bestJustifications: [
          "High device cost",
          "Battery and charging dependency",
        ],
      },
      {
        id: "e",
        label: "Pharmacy-based health screening kiosk in nearby town",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Existing infrastructure used",
          "Does not reach patients who cannot travel",
          "Limited to those mobile enough to visit",
          "Does not address remote access constraint",
        ],
        bestJustifications: [
          "Does not reach patients who cannot travel",
          "Does not address remote access constraint",
        ],
      },
      {
        id: "f",
        label: "Offline-capable tablet with symptom checker and triage guide",
        modelRatings: { feasibility: 4, desirability: 4, viability: 4 },
        justifications: [
          "Works offline",
          "Empowers community health worker",
          "Lower cost than specialist consultation",
          "Requires training and device management",
        ],
        bestJustifications: [
          "Works offline",
          "Empowers community health worker",
        ],
      },
    ],
    bestSolutionId: "b",
  },
  {
    title: "Design a way to reduce plastic bag use in a busy market",
    constraints: [
      "Traders cannot bear extra costs",
      "Customers are price-sensitive",
      "Solution must work in rainy weather",
      "No central authority to enforce rules",
      "Must be adopted voluntarily",
    ],
    solutions: [
      {
        id: "a",
        label: "Government ban on plastic bags with fines",
        modelRatings: { feasibility: 2, desirability: 2, viability: 2 },
        justifications: [
          "High compliance potential",
          "Requires central enforcement authority",
          "No central authority in this market",
          "Fines create resistance",
        ],
        bestJustifications: [
          "Requires central enforcement authority",
          "No central authority in this market",
        ],
      },
      {
        id: "b",
        label:
          "Subsidised reusable bag depot at market entrance with deposit-return scheme",
        modelRatings: { feasibility: 4, desirability: 4, viability: 4 },
        justifications: [
          "Works without enforcement",
          "Covers cost through deposit system",
          "No extra cost to traders",
          "Gives customers ownership and incentive",
        ],
        bestJustifications: [
          "Works without enforcement",
          "No extra cost to traders",
        ],
      },
      {
        id: "c",
        label: "Branded cloth bags sold at a discount by market association",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Market association involvement builds buy-in",
          "Price-sensitive customers may not buy",
          "Requires upfront investment",
          "No guaranteed adoption",
        ],
        bestJustifications: [
          "Market association involvement builds buy-in",
          "Price-sensitive customers may not buy",
        ],
      },
      {
        id: "d",
        label: "Compostable bags distributed free by an NGO",
        modelRatings: { feasibility: 3, desirability: 4, viability: 2 },
        justifications: [
          "High immediate adoption",
          "Dependent on NGO funding continuity",
          "Does not build lasting behaviour change",
          "Supply chain uncertainty",
        ],
        bestJustifications: [
          "Dependent on NGO funding continuity",
          "Does not build lasting behaviour change",
        ],
      },
      {
        id: "e",
        label: "Social media campaign encouraging personal change",
        modelRatings: { feasibility: 4, desirability: 2, viability: 2 },
        justifications: [
          "Low cost to implement",
          "No structural incentive for change",
          "Does not address the market context",
          "Limited reach in low-smartphone markets",
        ],
        bestJustifications: [
          "No structural incentive for change",
          "Limited reach in low-smartphone markets",
        ],
      },
      {
        id: "f",
        label:
          "Biodegradable bag produced and sold locally by women's cooperative",
        modelRatings: { feasibility: 3, desirability: 4, viability: 4 },
        justifications: [
          "Builds local economy",
          "Takes time to establish production",
          "Community ownership increases adoption",
          "Bags may cost more initially",
        ],
        bestJustifications: [
          "Builds local economy",
          "Community ownership increases adoption",
        ],
      },
    ],
    bestSolutionId: "b",
  },
  {
    title: "Design a reading improvement programme for struggling students",
    constraints: [
      "School budget is limited",
      "Teachers already overloaded",
      "Must work during school hours",
      "Students have mixed reading levels",
      "Must be replicable across multiple schools",
    ],
    solutions: [
      {
        id: "a",
        label: "Hire specialist reading tutors for every class",
        modelRatings: { feasibility: 2, desirability: 5, viability: 2 },
        justifications: [
          "Ideal support quality",
          "High cost, not scalable on limited budget",
          "Dependent on tutor availability",
          "Not replicable without sustained funding",
        ],
        bestJustifications: [
          "High cost, not scalable on limited budget",
          "Not replicable without sustained funding",
        ],
      },
      {
        id: "b",
        label:
          "Peer reading pairs: stronger readers mentor weaker ones with structured guides",
        modelRatings: { feasibility: 5, desirability: 4, viability: 5 },
        justifications: [
          "No additional cost",
          "Builds community within the class",
          "Replicable with a single training session",
          "Does not add burden to teachers",
        ],
        bestJustifications: [
          "No additional cost",
          "Replicable with a single training session",
        ],
      },
      {
        id: "c",
        label: "AI reading app with adaptive difficulty",
        modelRatings: { feasibility: 3, desirability: 4, viability: 3 },
        justifications: [
          "Personalised to each student",
          "Requires devices and reliable internet",
          "Cannot function without infrastructure",
          "Licence costs per student",
        ],
        bestJustifications: [
          "Requires devices and reliable internet",
          "Licence costs per student",
        ],
      },
      {
        id: "d",
        label: "Extended school hours for reading clinic",
        modelRatings: { feasibility: 2, desirability: 3, viability: 2 },
        justifications: [
          "Targeted support possible",
          "Adds burden to teachers and students",
          "Family commitments prevent attendance",
          "Does not operate within school hours constraint",
        ],
        bestJustifications: [
          "Adds burden to teachers and students",
          "Does not operate within school hours constraint",
        ],
      },
      {
        id: "e",
        label: "Radio-based phonics programme broadcast during class",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Low cost and replicable",
          "Passive and non-adaptive",
          "Cannot address mixed levels",
          "Requires consistent broadcast schedule",
        ],
        bestJustifications: [
          "Low cost and replicable",
          "Cannot address mixed levels",
        ],
      },
      {
        id: "f",
        label: "Community reading circles run by trained parent volunteers",
        modelRatings: { feasibility: 4, desirability: 4, viability: 4 },
        justifications: [
          "Engages community",
          "Dependent on volunteer availability",
          "Operates outside school hours",
          "Strong replication potential",
        ],
        bestJustifications: [
          "Engages community",
          "Dependent on volunteer availability",
        ],
      },
    ],
    bestSolutionId: "b",
  },
  {
    title:
      "Design a solution for traffic congestion in a secondary school drop-off zone",
    constraints: [
      "No new roads can be built",
      "School has no parking authority",
      "Parents are time-pressured",
      "Solution must not add cost to parents",
      "Must reduce congestion by at least 50%",
    ],
    solutions: [
      {
        id: "a",
        label:
          "Staggered start times: different year groups arrive at 20-minute intervals",
        modelRatings: { feasibility: 4, desirability: 3, viability: 4 },
        justifications: [
          "Spreads peak arrival load",
          "Disrupts parent schedules slightly",
          "No cost to implement",
          "Easy to replicate",
        ],
        bestJustifications: [
          "Spreads peak arrival load",
          "No cost to implement",
        ],
      },
      {
        id: "b",
        label:
          "Kiss-and-drop zone with 2-minute maximum stop time, enforced by staff",
        modelRatings: { feasibility: 4, desirability: 3, viability: 4 },
        justifications: [
          "Maximises throughput of the existing space",
          "Requires staff deployment",
          "No new infrastructure",
          "Effective in schools globally",
        ],
        bestJustifications: [
          "Maximises throughput of the existing space",
          "No new infrastructure",
        ],
      },
      {
        id: "c",
        label:
          "Subsidised school bus network reducing private drop-offs by 60%",
        modelRatings: { feasibility: 2, desirability: 5, viability: 2 },
        justifications: [
          "High impact if adopted",
          "High cost, difficult to sustain",
          "Requires route planning infrastructure",
          "Not replicable without ongoing funding",
        ],
        bestJustifications: [
          "High cost, difficult to sustain",
          "Not replicable without ongoing funding",
        ],
      },
      {
        id: "d",
        label: "Designated walking routes with supervised crossing points",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Reduces car dependency",
          "Only works for students within walking distance",
          "Requires trained crossing supervisors",
          "Does not address car-dependent families",
        ],
        bestJustifications: [
          "Reduces car dependency",
          "Only works for students within walking distance",
        ],
      },
      {
        id: "e",
        label: "Real-time drop-off zone congestion app for parents",
        modelRatings: { feasibility: 3, desirability: 3, viability: 3 },
        justifications: [
          "Data-driven decisions for parents",
          "Requires smartphone ownership",
          "Does not address the physical constraint",
          "Low motivation to change routine",
        ],
        bestJustifications: [
          "Requires smartphone ownership",
          "Does not address the physical constraint",
        ],
      },
      {
        id: "f",
        label: "Parent cycling challenge incentive programme",
        modelRatings: { feasibility: 2, desirability: 2, viability: 2 },
        justifications: [
          "Promotes healthy transport",
          "Only works for nearby families",
          "Does not address the majority",
          "Seasonal weather limits adoption",
        ],
        bestJustifications: [
          "Promotes healthy transport",
          "Seasonal weather limits adoption",
        ],
      },
    ],
    bestSolutionId: "a",
  },
];

export default function InnovationLab({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // ── Shared ───────────────────────────────────────────────────────────────
  const [score, setScore] = useState(0);
  const phaseRef = useRef("idle");
  const scoreRef = useRef(score);
  const startTimeRef = useRef(Date.now());
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (phaseRef.current === "over") return;
      phaseRef.current = "over";
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          completed ? 90 : 50,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );
  const timePct = (timeLeft / config.timeLimit) * 100;

  // ── GAME 1: Invention Workshop ───────────────────────────────────────────────
  const challenge = CHALLENGES[config.difficulty];
  const [g1Phase, setG1Phase] = useState<"idle" | "playing" | "over">("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [selectedProto, setSelectedProto] = useState<string[]>([]);

  const stage = STAGE_ORDER[stageIdx];

  function startG1() {
    startTimeRef.current = Date.now();
    startTimer();
    setG1Phase("playing");
  }

  function nextStage(pts: number) {
    setScore((s) => s + pts);
    if (stageIdx + 1 >= STAGE_ORDER.length) {
      setTimeout(() => endGame(true), 1200);
    } else {
      setStageIdx((i) => i + 1);
      setSelectedProto([]);
    }
  }

  function handleEmpathizeDefine(correct: boolean) {
    nextStage(correct ? 200 * config.difficulty : 50);
  }
  function handleIdeate(sc: number) {
    nextStage(sc * config.difficulty);
  }
  function handlePrototype() {
    const st = challenge.stages.prototype;
    const needed = st.components.filter((c) => c.needed).map((c) => c.id);
    const correct =
      needed.every((id) => selectedProto.includes(id)) &&
      !st.components
        .filter((c) => !c.needed)
        .some((c) => selectedProto.includes(c.id));
    nextStage(correct ? 300 * config.difficulty : 100);
  }
  function handleTest(good: boolean) {
    nextStage(good ? 400 * config.difficulty : 100);
    setTimeout(() => endGame(good), 1500);
  }

  // ── GAME 2: Design Thinking ───────────────────────────────────────────────
  const dtCount = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [dtProblems] = useState<DesignThinkingProblem[]>(() =>
    [...DESIGN_PROBLEMS].sort(() => Math.random() - 0.5).slice(0, dtCount),
  );
  const [dtPhase, setDtPhase] = useState<
    "idle" | "empathize" | "define" | "ideate" | "prototype" | "test" | "result"
  >("idle");
  const [dtIdx, setDtIdx] = useState(0);
  const [dtRanking, setDtRanking] = useState<string[]>([]);
  const [dtPrototype, setDtPrototype] = useState<string[]>([]);
  const [dtFeedback, setDtFeedback] = useState<string | null>(null);

  const dtProblem = dtProblems[dtIdx];

  function startDt() {
    startTimeRef.current = Date.now();
    startTimer();
    setDtPhase("empathize");
  }

  function handleDtChoice(
    correct: boolean,
    pts: number,
    next: "define" | "ideate" | "prototype" | "test" | "result",
  ) {
    setScore(
      (s) => s + (correct ? pts : Math.round(pts * 0.3)) * config.difficulty,
    );
    if (next === "result") {
      if (dtIdx + 1 >= dtProblems.length) {
        endGame(true);
        return;
      }
      setDtIdx((i) => i + 1);
      setDtRanking([]);
      setDtPrototype([]);
      setDtFeedback(null);
      setDtPhase("empathize");
    } else {
      setDtPhase(next);
    }
  }

  function submitDtIdeate() {
    const target = dtProblem.ideate.correctRanking;
    let pts = 0;
    dtRanking.forEach((id, i) => {
      if (id === target[i]) pts += 100;
      else if (target.includes(id) && Math.abs(target.indexOf(id) - i) <= 1)
        pts += 50;
    });
    setScore((s) => s + pts * config.difficulty);
    setDtPhase("prototype");
  }

  function submitDtPrototype() {
    const needed = dtProblem.prototype.features
      .filter((f) => f.needed)
      .map((f) => f.id);
    const correct =
      needed.every((id) => dtPrototype.includes(id)) &&
      dtPrototype.length === dtProblem.prototype.neededCount;
    setScore((s) => s + (correct ? 300 : 80) * config.difficulty);
    setDtPhase("test");
  }

  function toggleDtRank(id: string) {
    setDtRanking((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // ── GAME 3: Innovation Challenge ────────────────────────────────────────────
  const icCount = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [icChallenges] = useState<InnovationChallenge[]>(() =>
    [...INNOVATION_CHALLENGES]
      .sort(() => Math.random() - 0.5)
      .slice(0, icCount),
  );
  const [icPhase, setIcPhase] = useState<
    "idle" | "rating" | "select" | "justify" | "result"
  >("idle");
  const [icIdx, setIcIdx] = useState(0);
  const [icRatings, setIcRatings] = useState<
    Record<
      string,
      { feasibility: number; desirability: number; viability: number }
    >
  >({});
  const [icSelected, setIcSelected] = useState<string | null>(null);
  const [icJustifications, setIcJustifications] = useState<string[]>([]);
  const [icSubmitted, setIcSubmitted] = useState(false);

  const icChallenge = icChallenges[icIdx];

  function startIc() {
    startTimeRef.current = Date.now();
    startTimer();
    setIcPhase("rating");
  }

  function setIcRating(
    solId: string,
    dim: "feasibility" | "desirability" | "viability",
    val: number,
  ) {
    setIcRatings((prev) => ({
      ...prev,
      [solId]: {
        ...(prev[solId] ?? { feasibility: 0, desirability: 0, viability: 0 }),
        [dim]: val,
      },
    }));
  }

  function getIcTotal(solId: string) {
    const r = icRatings[solId];
    if (!r) return 0;
    return r.feasibility + r.desirability + r.viability;
  }

  function submitIcRatings() {
    // Compare player's top-rated solution to model
    const bestPlayer = icChallenge.solutions.reduce(
      (best, sol) => (getIcTotal(sol.id) > getIcTotal(best.id) ? sol : best),
      icChallenge.solutions[0],
    );
    setIcSelected(bestPlayer.id);
    setIcPhase("justify");
  }

  function toggleIcJustification(j: string) {
    setIcJustifications((prev) =>
      prev.includes(j)
        ? prev.filter((x) => x !== j)
        : prev.length < 2
          ? [...prev, j]
          : prev,
    );
  }

  function submitIcJustification() {
    if (!icChallenge || !icSelected) return;
    const bestSolution = icChallenge.solutions.find((s) => s.id === icSelected);
    const correctSolution = icSelected === icChallenge.bestSolutionId;
    const correctJust = icJustifications.filter((j) =>
      bestSolution?.bestJustifications.includes(j),
    ).length;

    // Rating accuracy vs model
    let ratingPts = 0;
    icChallenge.solutions.forEach((sol) => {
      const player = icRatings[sol.id];
      if (!player) return;
      const model = sol.modelRatings;
      if (Math.abs(player.feasibility - model.feasibility) <= 1)
        ratingPts += 20;
      if (Math.abs(player.desirability - model.desirability) <= 1)
        ratingPts += 20;
      if (Math.abs(player.viability - model.viability) <= 1) ratingPts += 20;
    });

    const pts = ratingPts + (correctSolution ? 200 : 50) + correctJust * 100;
    setScore((s) => s + pts * config.difficulty);
    setIcSubmitted(true);
  }

  function nextIcChallenge() {
    if (icIdx + 1 >= icChallenges.length) {
      endGame(true);
      return;
    }
    setIcIdx((i) => i + 1);
    setIcRatings({});
    setIcSelected(null);
    setIcJustifications([]);
    setIcSubmitted(false);
    setIcPhase("rating");
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="innovation_lab.page"
    >
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#8b5cf6] transition-all duration-1000"
          style={{ width: `${timePct}%` }}
        />
      </div>

      {/* ═══════════ GAME 1: Invention Workshop ═══════════ */}
      {gameId === "invention-workshop" && (
        <>
          {g1Phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#8b5cf6]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Invention Workshop
              </h2>
              <p className="text-muted-foreground text-center max-w-sm text-sm">
                Apply the 5-stage design thinking process: Empathize, Define,
                Ideate, Prototype, Test. Solve real-world problems with creative
                solutions.
              </p>
              <button
                type="button"
                onClick={startG1}
                className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
                style={{ background: "#8b5cf6" }}
                data-ocid="innovation_lab.start_button"
              >
                Start Designing
              </button>
            </motion.div>
          )}
          {g1Phase === "playing" && (
            <div className="flex-1 flex flex-col gap-4 overflow-auto">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8b5cf6] font-mono">
                  Score: {score.toLocaleString()}
                </span>
                <div className="flex gap-1">
                  {STAGE_ORDER.map((s, i) => (
                    <div
                      key={s}
                      className={`h-1.5 w-8 rounded-full transition-all ${i < stageIdx ? "bg-[#8b5cf6]" : i === stageIdx ? "bg-[#8b5cf6]/60" : "bg-muted"}`}
                    />
                  ))}
                </div>
                <span className="tabular-nums text-muted-foreground">
                  {timeLeft}s
                </span>
              </div>
              <div className="rounded-xl border border-[#8b5cf6]/30 bg-card/40 p-3">
                <p className="text-xs font-bold text-[#8b5cf6] uppercase tracking-widest">
                  {stage}
                </p>
                <p className="text-sm font-semibold mt-1">
                  {challenge.problem}
                </p>
                <p className="text-xs text-muted-foreground">
                  {challenge.context}
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col gap-3"
                >
                  {(stage === "empathize" || stage === "define") && (
                    <>
                      <p className="text-sm font-semibold">
                        {challenge.stages[stage].prompt}
                      </p>
                      <div className="space-y-2">
                        {challenge.stages[stage].options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleEmpathizeDefine(opt.correct)}
                            className="w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#8b5cf6]/50 transition-all"
                            data-ocid={`innovation_lab.option.${opt.id}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {stage === "ideate" && (
                    <>
                      <p className="text-sm font-semibold">
                        {challenge.stages.ideate.prompt}
                      </p>
                      <div className="space-y-2">
                        {challenge.stages.ideate.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleIdeate(opt.score)}
                            className="w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#8b5cf6]/50 transition-all"
                            data-ocid={`innovation_lab.ideate.${opt.id}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {stage === "prototype" && (
                    <>
                      <p className="text-sm font-semibold">
                        {challenge.stages.prototype.prompt}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {challenge.stages.prototype.components.map((comp) => (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() =>
                              setSelectedProto((prev) =>
                                prev.includes(comp.id)
                                  ? prev.filter((x) => x !== comp.id)
                                  : [...prev, comp.id],
                              )
                            }
                            className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all ${selectedProto.includes(comp.id) ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]" : "border-border/30 bg-card/50"}`}
                            data-ocid={`innovation_lab.component.${comp.id}`}
                          >
                            {comp.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handlePrototype}
                        disabled={selectedProto.length === 0}
                        className="self-center px-6 py-2 rounded-lg font-bold text-sm text-white disabled:opacity-40"
                        style={{ background: "#8b5cf6" }}
                        data-ocid="innovation_lab.build_button"
                      >
                        Build Prototype
                      </button>
                    </>
                  )}
                  {stage === "test" && (
                    <>
                      <p className="text-sm font-semibold">
                        {challenge.stages.test.prompt}
                      </p>
                      <div className="space-y-2">
                        {challenge.stages.test.outcomes.map((out) => (
                          <button
                            key={out.id}
                            type="button"
                            onClick={() => handleTest(out.good)}
                            className="w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#8b5cf6]/50 transition-all"
                            data-ocid={`innovation_lab.outcome.${out.id}`}
                          >
                            {out.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 2: Design Thinking ═══════════ */}
      {gameId === "design-thinking" && (
        <>
          {dtPhase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#a855f7]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Design Thinking
              </h2>
              <p className="text-muted-foreground text-center max-w-sm text-sm">
                {dtCount} real design problems. Work through 5 phases:
                Empathize, Define, Ideate, Prototype, Test. Make key decisions
                at each phase.
              </p>
              <button
                type="button"
                onClick={startDt}
                className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all text-white"
                style={{ background: "#a855f7" }}
                data-ocid="innovation_lab.dt_start_button"
              >
                Begin Design Process
              </button>
            </motion.div>
          )}
          {dtProblem &&
            (dtPhase === "empathize" ||
              dtPhase === "define" ||
              dtPhase === "test") && (
              <div className="flex-1 flex flex-col gap-3 overflow-auto">
                <div className="rounded-xl border border-[#a855f7]/30 bg-card/40 p-3 shrink-0">
                  <p className="text-xs font-bold text-[#a855f7] uppercase tracking-widest">
                    {dtPhase} — Problem {dtIdx + 1}/{dtProblems.length}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {dtProblem.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dtProblem.context}
                  </p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dtPhase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-2"
                  >
                    {dtPhase === "empathize" && (
                      <>
                        <p className="text-sm font-semibold">
                          {dtProblem.empathize.prompt}
                        </p>
                        {dtProblem.empathize.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleDtChoice(opt.correct, 200, "define")
                            }
                            className="w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#a855f7]/50 transition-all"
                            data-ocid={`innovation_lab.dt_emp.${opt.id}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </>
                    )}
                    {dtPhase === "define" && (
                      <>
                        <p className="text-sm font-semibold">
                          {dtProblem.define.prompt}
                        </p>
                        {dtProblem.define.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleDtChoice(opt.correct, 250, "ideate")
                            }
                            className="w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#a855f7]/50 transition-all"
                            data-ocid={`innovation_lab.dt_def.${opt.id}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </>
                    )}
                    {dtPhase === "test" && (
                      <>
                        <p className="text-sm font-semibold">
                          {dtProblem.test.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {dtProblem.test.feedback}
                        </p>
                        {dtProblem.test.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleDtChoice(opt.correct, 300, "result")
                            }
                            className="w-full text-left px-4 py-3 rounded-xl border-2 border-border/30 bg-card/60 text-sm hover:border-[#a855f7]/50 transition-all"
                            data-ocid={`innovation_lab.dt_test.${opt.id}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          {dtProblem && dtPhase === "ideate" && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="rounded-xl border border-[#a855f7]/30 bg-card/40 p-3 shrink-0">
                <p className="text-xs font-bold text-[#a855f7] uppercase tracking-widest">
                  Ideate — {dtProblem.title}
                </p>
              </div>
              <p className="text-sm font-semibold">{dtProblem.ideate.prompt}</p>
              <p className="text-xs text-muted-foreground">
                Click ideas to rank them (first click = rank 1, most
                creative/practical). Selected: {dtRanking.length}/6
              </p>
              <div className="flex flex-col gap-2">
                {dtProblem.ideate.ideas.map((idea, i) => {
                  const rankPos = dtRanking.indexOf(idea.id);
                  const isRanked = rankPos !== -1;
                  return (
                    <button
                      key={idea.id}
                      type="button"
                      onClick={() => toggleDtRank(idea.id)}
                      data-ocid={`innovation_lab.dt_idea.${idea.id}`}
                      className={`w-full text-left px-4 py-2 rounded-xl border-2 text-sm transition-all flex items-center justify-between ${isRanked ? "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]" : "border-border/30 bg-card/60 text-foreground hover:border-[#a855f7]/40"}`}
                    >
                      <span>{idea.label}</span>
                      {isRanked && (
                        <span className="font-bold text-[#a855f7] shrink-0 ml-2">
                          #{rankPos + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={submitDtIdeate}
                disabled={dtRanking.length !== 6}
                className="px-6 py-2 rounded-lg font-bold text-sm text-white disabled:opacity-40 transition-all"
                style={{ background: "#a855f7" }}
                data-ocid="innovation_lab.dt_ideate_submit"
              >
                Submit Ranking
              </button>
            </div>
          )}
          {dtProblem && dtPhase === "prototype" && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="rounded-xl border border-[#a855f7]/30 bg-card/40 p-3 shrink-0">
                <p className="text-xs font-bold text-[#a855f7] uppercase tracking-widest">
                  Prototype — Select {dtProblem.prototype.neededCount} MVP
                  features from {dtProblem.prototype.features.length}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {dtProblem.prototype.prompt}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {dtProblem.prototype.features.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      setDtPrototype((prev) =>
                        prev.includes(f.id)
                          ? prev.filter((x) => x !== f.id)
                          : prev.length < dtProblem.prototype.neededCount
                            ? [...prev, f.id]
                            : prev,
                      )
                    }
                    data-ocid={`innovation_lab.dt_feature.${f.id}`}
                    className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all ${dtPrototype.includes(f.id) ? "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7]" : "border-border/30 bg-card/50 text-foreground"}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={submitDtPrototype}
                disabled={
                  dtPrototype.length !== dtProblem.prototype.neededCount
                }
                className="px-6 py-2 rounded-lg font-bold text-sm text-white disabled:opacity-40"
                style={{ background: "#a855f7" }}
                data-ocid="innovation_lab.dt_proto_submit"
              >
                Build MVP
              </button>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 3: Innovation Challenge ═══════════ */}
      {gameId === "innovation-challenge" && (
        <>
          {icPhase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <h2
                className="text-3xl font-black text-[#00f5ff]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Innovation Challenge
              </h2>
              <p className="text-muted-foreground text-center max-w-sm text-sm">
                {icCount} constrained challenges. Rate each solution on
                Feasibility, Desirability, and Viability (1-5). Select the best
                and justify your choice.
              </p>
              <button
                type="button"
                onClick={startIc}
                className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
                style={{ background: "#00f5ff", color: "black" }}
                data-ocid="innovation_lab.ic_start_button"
              >
                Start Evaluating
              </button>
            </motion.div>
          )}
          {icChallenge && (icPhase === "rating" || icPhase === "justify") && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="rounded-xl border border-[#00f5ff]/30 bg-card/40 p-3 shrink-0">
                <p className="text-xs font-bold text-[#00f5ff] uppercase tracking-widest">
                  Challenge {icIdx + 1}/{icChallenges.length}
                </p>
                <p className="text-sm font-semibold mt-1">
                  {icChallenge.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Constraints: {icChallenge.constraints.join(" | ")}
                </p>
              </div>

              {icPhase === "rating" && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Rate each solution 1-5 on Feasibility, Desirability, and
                    Viability. Then submit to see your top choice.
                  </p>
                  <div className="flex flex-col gap-3">
                    {icChallenge.solutions.map((sol) => {
                      const r = icRatings[sol.id] ?? {
                        feasibility: 0,
                        desirability: 0,
                        viability: 0,
                      };
                      const total =
                        r.feasibility + r.desirability + r.viability;
                      return (
                        <div
                          key={sol.id}
                          className="rounded-xl border border-border/30 bg-card/40 p-3"
                        >
                          <p className="text-xs font-bold text-foreground mb-2">
                            {sol.label}
                          </p>
                          {(
                            [
                              "feasibility",
                              "desirability",
                              "viability",
                            ] as const
                          ).map((dim) => (
                            <div
                              key={dim}
                              className="flex items-center gap-2 mb-1"
                            >
                              <span className="text-xs text-muted-foreground w-20 shrink-0 capitalize">
                                {dim}
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    onClick={() => setIcRating(sol.id, dim, v)}
                                    data-ocid={`innovation_lab.ic_rating.${sol.id}.${dim}.${v}`}
                                    className={`w-7 h-7 rounded border text-xs font-bold transition-all ${r[dim] === v ? "border-[#00f5ff] bg-[#00f5ff]/20 text-[#00f5ff]" : "border-border/40 text-foreground hover:border-[#00f5ff]/40"}`}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground w-4 text-right">
                                {r[dim] || ""}
                              </span>
                            </div>
                          ))}
                          {total > 0 && (
                            <p className="text-xs font-bold text-[#00f5ff] mt-1">
                              Total: {total}/15
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={submitIcRatings}
                    disabled={icChallenge.solutions.some((s) => {
                      const r = icRatings[s.id];
                      return (
                        !r ||
                        r.feasibility === 0 ||
                        r.desirability === 0 ||
                        r.viability === 0
                      );
                    })}
                    className="px-6 py-2 rounded-lg font-bold text-sm disabled:opacity-40"
                    style={{ background: "#00f5ff", color: "black" }}
                    data-ocid="innovation_lab.ic_submit_ratings"
                  >
                    Select Best Solution
                  </button>
                </>
              )}

              {icPhase === "justify" &&
                icSelected &&
                (() => {
                  const sol = icChallenge.solutions.find(
                    (s) => s.id === icSelected,
                  );
                  if (!sol) return null;
                  return (
                    <>
                      <div className="rounded-xl border border-[#00f5ff]/30 bg-[#00f5ff]/10 p-3">
                        <p className="text-xs font-bold text-[#00f5ff] mb-1">
                          Your highest-rated solution:
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {sol.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Score: {getIcTotal(icSelected)}/15
                        </p>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        Select 2 key reasons that best justify this choice:
                      </p>
                      <div className="flex flex-col gap-2">
                        {sol.justifications.map((j, ji) => (
                          <button
                            key={ji}
                            type="button"
                            onClick={() =>
                              !icSubmitted && toggleIcJustification(j)
                            }
                            data-ocid={`innovation_lab.ic_just.${ji + 1}`}
                            className={`text-left px-4 py-2 rounded-xl border text-xs transition-all ${icJustifications.includes(j) ? "border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]" : "border-border/40 text-foreground hover:border-[#00f5ff]/40"}`}
                          >
                            {j}
                          </button>
                        ))}
                      </div>
                      {!icSubmitted ? (
                        <button
                          type="button"
                          onClick={submitIcJustification}
                          disabled={icJustifications.length !== 2}
                          className="px-6 py-2 rounded-lg font-bold text-sm disabled:opacity-40"
                          style={{ background: "#00f5ff", color: "black" }}
                          data-ocid="innovation_lab.ic_submit_just"
                        >
                          Confirm Justification
                        </button>
                      ) : (
                        <>
                          <div className="rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 p-3">
                            <p className="text-xs font-bold text-[#10b981] mb-1">
                              Best justifications for this solution:
                            </p>
                            {sol.bestJustifications.map((j, ji) => (
                              <p key={ji} className="text-xs text-foreground">
                                {j}
                              </p>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={nextIcChallenge}
                            className="px-6 py-2 rounded-lg font-bold text-sm"
                            style={{ background: "#00f5ff", color: "black" }}
                            data-ocid="innovation_lab.ic_next"
                          >
                            {icIdx + 1 < icChallenges.length
                              ? "Next Challenge"
                              : "Finish"}
                          </button>
                        </>
                      )}
                    </>
                  );
                })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
