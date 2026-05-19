function buildSubGames(categoryId, slots) {
  return slots.map((s, i) => ({ id: `${categoryId}-sg-${i + 1}`, ...s }));
}
const ICT_CATEGORIES = [
  {
    id: "ict-mouse-mastery",
    name: "Mouse Mastery",
    description: "Precision clicking, hover targeting, and cursor control",
    subGames: buildSubGames("ict-mouse-mastery", [
      {
        title: "Cursor Precision Mission 1",
        description: "Hit moving targets with pixel-perfect accuracy",
        gameId: "cursor-precision-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Click Accuracy Drill",
        description: "Rapid-fire click accuracy under time pressure",
        gameId: "click-accuracy-1",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Drag and Drop Maze",
        description: "Guide objects through obstacle courses using drag",
        gameId: "drag-maze-1",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Double-Click Race",
        description: "Beat the clock in double-click speed challenges",
        gameId: "double-click-1",
        unlockAtXP: 150,
        difficulty: 1
      },
      {
        title: "Right-Click Detective",
        description: "Use context menus to solve mystery missions",
        gameId: "right-click-1",
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Scroll Mastery Challenge",
        description: "Navigate documents using precise scroll control",
        gameId: "scroll-master-1",
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Multi-Target Blitz",
        description: "Click multiple moving targets simultaneously",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Micro-Precision Lab",
        description: "Sub-pixel accuracy targeting exercises",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 2
      },
      {
        title: "Mouse Trail Puzzle",
        description: "Draw precise paths to connect circuit nodes",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 2
      },
      {
        title: "Hover Activation Grid",
        description: "Activate grid cells by hovering in sequence",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Speed Click Tournament",
        description: "Compete against AI in rapid click competitions",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Drag Physics Lab",
        description: "Use drag mechanics with physics-based objects",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Cursor King",
        description: "Final precision challenge – defeat the Cursor King",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Mouse Skills",
        description: "Prove your complete mouse mastery",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: Infinite Precision",
        description: "Hidden extreme precision challenge for masters",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-keyboard-control",
    name: "Keyboard Control",
    description: "Key recognition, shortcut mastery, and keyboard navigation",
    subGames: buildSubGames("ict-keyboard-control", [
      {
        title: "Key Identification Blitz",
        description: "Identify keys as they appear on screen fast",
        gameId: "keyboard-ninja-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Home Row Warrior",
        description: "Master ASDF JKL; home row touch typing",
        gameId: "keyboard-ninja-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Shortcut Combat Arena",
        description: "Battle enemies using keyboard shortcuts",
        gameId: "keyboard-ninja-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Number Pad Challenge",
        description: "Enter numeric sequences at speed",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 1
      },
      {
        title: "Function Key Missions",
        description: "Complete tasks using F1-F12 function keys",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Ctrl Combo Gauntlet",
        description: "Execute complex Ctrl shortcut sequences",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Keyboard Maze Navigator",
        description: "Navigate a maze using arrow keys only",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Special Characters Lab",
        description: "Type symbols, punctuation, and special chars",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 2
      },
      {
        title: "Multi-Key Chord Master",
        description: "Simultaneous multi-key press challenges",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Keyboard Speed Run",
        description: "Type full paragraphs faster than AI opponents",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Blind Typing Mission",
        description: "Type without looking at keyboard or screen",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "OS Shortcut Challenge",
        description: "Navigate entire OS using keyboard only",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Keyboard Ninja",
        description: "Ultimate shortcut battle against Keyboard Ninja",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Keyboard Mastery",
        description: "Full keyboard skills evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: Speed Typist Elite",
        description: "Hidden elite typing challenge for masters",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-file-management",
    name: "File Management",
    description: "File creation, organization, and directory navigation",
    subGames: buildSubGames("ict-file-management", [
      {
        title: "Desktop Organization",
        description: "Sort chaotic desktop files into correct folders",
        gameId: "file-folder-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Folder Tree Navigator",
        description: "Navigate deep directory trees to find files",
        gameId: "file-folder-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "File Sorting Race",
        description: "Sort files by type, date, and size rapidly",
        gameId: "file-folder-3",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Rename Master Challenge",
        description: "Rename files using correct naming conventions",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 1
      },
      {
        title: "Copy Paste Operations",
        description: "Efficiently copy and move file collections",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Search and Retrieve",
        description: "Use search tools to locate hidden files fast",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Recycle Bin Rescue",
        description: "Recover deleted files before permanent deletion",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "File Extension Detective",
        description: "Match files to correct applications by extension",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 2
      },
      {
        title: "Permission Management",
        description: "Set correct read/write/execute permissions",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Compression Lab",
        description: "Zip and unzip file archives for transfer",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Backup Systems Mission",
        description: "Create structured backup folder hierarchies",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Version Control Intro",
        description: "Track file versions and manage changes",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The File Corruptor",
        description: "Restore a corrupted file system to order",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: File Systems",
        description: "Complete file management competency test",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Lost Archive",
        description: "Recover a legendary lost digital archive",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-browser-skills",
    name: "Browser Skills",
    description: "Web navigation, search strategies, and browser mastery",
    subGames: buildSubGames("ict-browser-skills", [
      {
        title: "URL Navigation Race",
        description: "Enter URLs and navigate pages at speed",
        gameId: "browser-quest-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Search Strategy Master",
        description: "Use search operators to find specific results",
        gameId: "browser-quest-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Tab Management Pro",
        description: "Organize 20+ browser tabs efficiently",
        gameId: "browser-quest-3",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Bookmark Organization",
        description: "Create and organize bookmark collections",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 1
      },
      {
        title: "Browser History Detective",
        description: "Use history to reconstruct browsing paths",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Download Manager",
        description: "Manage file downloads and verify integrity",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Form Filling Expert",
        description: "Complete web forms accurately and quickly",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Cookie and Cache Lab",
        description: "Understand and manage browser data storage",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 2
      },
      {
        title: "Extensions Manager",
        description: "Install, configure, and manage extensions",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Private Browsing Mission",
        description: "Complete tasks using privacy-focused techniques",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Developer Tools Intro",
        description: "Inspect page elements and view source code",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Cross-Browser Challenge",
        description: "Identify compatibility differences across browsers",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Web Guardian",
        description: "Navigate a complex multi-site challenge",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Browser Mastery",
        description: "Full browser competency evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Deep Web Map",
        description: "Advanced web navigation hidden challenge",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-typing-speed",
    name: "Typing Speed",
    description: "Touch typing, speed tournaments, and accuracy challenges",
    subGames: buildSubGames("ict-typing-speed", [
      {
        title: "Typing Speed Trial 1",
        description: "Type sample texts at increasing speeds",
        gameId: "typing-tournament-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Word Per Minute Race",
        description: "Beat WPM targets against timer",
        gameId: "typing-tournament-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Accuracy Precision Test",
        description: "Type with zero errors under time pressure",
        gameId: "typing-tournament-3",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Sentence Construction Speed",
        description: "Build sentences from scrambled words quickly",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 1
      },
      {
        title: "Code Typing Challenge",
        description: "Type programming code syntax accurately",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Paragraph Sprint",
        description: "Type full paragraphs in under 60 seconds",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Random Word Blitz",
        description: "Type randomized word sequences at speed",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Capital Letter Combat",
        description: "Mix caps and lowercase in rapid sequences",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 2
      },
      {
        title: "Number Row Speed",
        description: "Type numeric data at professional speed",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Punctuation Master",
        description: "Include all punctuation without errors",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Advanced Code Sprint",
        description: "Type complex code blocks at 60+ WPM",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Endurance Typing Run",
        description: "Maintain speed for 5 consecutive minutes",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: Speed Demon",
        description: "Out-type the Speed Demon AI at 80 WPM",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Typing Mastery",
        description: "Professional typing certification test",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The 100 WPM Club",
        description: "Hidden ultra-speed typing challenge",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-office-apps",
    name: "Office Applications",
    description: "Word processing, spreadsheets, and presentation tools",
    subGames: buildSubGames("ict-office-apps", [
      {
        title: "Word Processing Basics",
        description: "Create and format basic documents",
        gameId: "office-word-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Spreadsheet Adventure",
        description: "Build spreadsheets with formulas and data",
        gameId: "office-excel-1",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Presentation Builder",
        description: "Design slides and deliver presentations",
        gameId: "office-ppt-1",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Document Formatting Lab",
        description: "Apply styles, headers, and professional formats",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Formula Challenge",
        description: "Use SUM, AVERAGE, IF formulas to solve problems",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Chart Creation Studio",
        description: "Build bar, pie, and line charts from data",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Table Mastery",
        description: "Create, sort, and filter data tables",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Mail Merge Mission",
        description: "Automate personalized letter generation",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Macro Introduction",
        description: "Record and run basic automation macros",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Advanced Formulas",
        description: "VLOOKUP, INDEX-MATCH, nested IF challenges",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Slide Animation Lab",
        description: "Add professional transitions and animations",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Collaboration Mission",
        description: "Share, comment, and track document changes",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: Office Master",
        description: "Complete a full professional document project",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Office Suite",
        description: "Full office applications certification",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: Executive Report",
        description: "Create a full business report hidden challenge",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-coding-fundamentals",
    name: "Coding Fundamentals",
    description: "Variables, loops, functions, and algorithmic thinking",
    subGames: buildSubGames("ict-coding-fundamentals", [
      {
        title: "Variables and Data Types",
        description: "Learn to store and manipulate data",
        gameId: "coding-puzzle-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Conditional Logic",
        description: "Build if/else decision systems",
        gameId: "coding-puzzle-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Loop Master",
        description: "Control repetition with for and while loops",
        gameId: "coding-puzzle-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Function Builder",
        description: "Create reusable functions for common tasks",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Array Challenge",
        description: "Store and access collections of data",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "String Operations",
        description: "Manipulate and transform text strings",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Input Output Mission",
        description: "Read input and display formatted output",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Debugging Lab",
        description: "Find and fix errors in broken code",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Algorithm Design",
        description: "Design step-by-step solutions to problems",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Sorting Algorithms",
        description: "Implement bubble sort and selection sort",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Search Algorithms",
        description: "Binary and linear search implementations",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Object Basics",
        description: "Create and use objects in code",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Code Guardian",
        description: "Solve a complex coding challenge to win",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Coding Skills",
        description: "Full programming fundamentals evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Algorithm Vault",
        description: "Advanced algorithm challenge for elite coders",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-cyber-safety",
    name: "Cyber Safety",
    description: "Online safety, phishing detection, and digital defense",
    subGames: buildSubGames("ict-cyber-safety", [
      {
        title: "Phishing Detector",
        description: "Identify fake websites and phishing emails",
        gameId: "cyber-defense-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Password Strength Lab",
        description: "Create and evaluate password security",
        gameId: "cyber-defense-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Safe Browsing Mission",
        description: "Navigate the web avoiding dangerous links",
        gameId: "cyber-defense-3",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Privacy Shield",
        description: "Protect personal information online",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Virus and Malware Defense",
        description: "Identify and eliminate malware threats",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Social Engineering Awareness",
        description: "Recognize manipulation and deception tactics",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Two-Factor Authentication",
        description: "Set up and use 2FA security systems",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Data Encryption Basics",
        description: "Understand how encryption protects data",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Firewall Configuration",
        description: "Set up firewall rules to block threats",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Cyberbullying Response",
        description: "Identify and respond to online harassment",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Digital Footprint Audit",
        description: "Trace and manage your online presence",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Incident Response Drill",
        description: "Respond to a simulated cyber attack",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Cyber Threat",
        description: "Defend against a full-scale cyber attack",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Cyber Safety",
        description: "Complete digital security certification",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Dark Web Vault",
        description: "Advanced cybersecurity challenge for experts",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-networking",
    name: "Networking",
    description: "Network topology, IP addressing, and connectivity",
    subGames: buildSubGames("ict-networking", [
      {
        title: "Cable Routing Simulation",
        description: "Route ethernet cables to connect devices",
        gameId: "network-routing-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "IP Address Puzzle",
        description: "Assign correct IP addresses to network nodes",
        gameId: "network-routing-2",
        unlockAtXP: 50,
        difficulty: 2
      },
      {
        title: "Network Topology Builder",
        description: "Design star, bus, and mesh network layouts",
        gameId: "network-routing-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "DNS Resolution Lab",
        description: "Trace how domain names resolve to IPs",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Subnet Calculator",
        description: "Calculate subnets and network masks",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Router Configuration",
        description: "Configure routers for optimal data flow",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 3
      },
      {
        title: "Switch Programming",
        description: "Set up VLANs and switch configurations",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Wi-Fi Security Setup",
        description: "Configure secure wireless networks",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Packet Tracer Challenge",
        description: "Simulate network packet routing paths",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Network Troubleshooting",
        description: "Diagnose and fix network connectivity issues",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Load Balancer Lab",
        description: "Distribute traffic across multiple servers",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "VPN Tunnel Mission",
        description: "Create secure encrypted tunnels",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: Network Outage Crisis",
        description: "Restore a collapsed enterprise network",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Networking",
        description: "Full networking competency evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Server Room",
        description: "Configure an entire data center network",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-digital-creativity",
    name: "Digital Creativity",
    description: "Graphic design, image editing, and multimedia creation",
    subGames: buildSubGames("ict-digital-creativity", [
      {
        title: "Logo Design Challenge",
        description: "Create professional logos using design tools",
        gameId: "digital-art-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Color Theory Lab",
        description: "Master color wheels and complementary colors",
        gameId: "digital-art-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Digital Poster Creator",
        description: "Design event posters with layout principles",
        gameId: "digital-art-3",
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Typography Master",
        description: "Choose and pair fonts for impact",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Photo Editing Suite",
        description: "Crop, adjust, and enhance photographs",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Animation Basics",
        description: "Create simple frame animations",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Icon Design Workshop",
        description: "Design clean vector-style icons",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Infographic Builder",
        description: "Present data visually with infographics",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Video Editing Intro",
        description: "Cut, trim, and sequence video clips",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Audio Production Lab",
        description: "Record, mix, and produce audio tracks",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "UI Design Challenge",
        description: "Design user interfaces for apps",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "3D Modeling Intro",
        description: "Create basic 3D shapes and models",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: Creative Director",
        description: "Complete a full brand identity project",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Digital Arts",
        description: "Portfolio-based creative skills evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Masterpiece",
        description: "Create a hidden digital art masterpiece",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-operating-systems",
    name: "Operating Systems",
    description: "OS simulation, settings management, and troubleshooting",
    subGames: buildSubGames("ict-operating-systems", [
      {
        title: "Desktop Navigation",
        description: "Navigate a simulated Windows desktop",
        gameId: "os-explorer-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Settings Configuration",
        description: "Configure system preferences correctly",
        gameId: "os-explorer-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Task Manager Mission",
        description: "Manage running processes and memory",
        gameId: "os-explorer-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "User Account Control",
        description: "Create and manage user accounts securely",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "System Update Lab",
        description: "Manage OS updates and patches",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Device Manager Challenge",
        description: "Install drivers and manage hardware",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Registry Explorer",
        description: "Navigate and safely modify the registry",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Command Line Basics",
        description: "Execute system commands in terminal",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Disk Management",
        description: "Partition, format, and manage drives",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "System Restore Mission",
        description: "Use restore points to fix system problems",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Linux Terminal Intro",
        description: "Execute basic Linux command line tasks",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Virtual Machine Lab",
        description: "Create and run virtual machines",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The System Crash",
        description: "Rescue a critically failing operating system",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: OS Mastery",
        description: "Full operating systems competency test",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Root Access",
        description: "Advanced system administration challenge",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-hardware-basics",
    name: "Hardware Basics",
    description: "Computer components, assembly, and system diagnostics",
    subGames: buildSubGames("ict-hardware-basics", [
      {
        title: "Component Identification",
        description: "Name all parts inside a computer system",
        gameId: "pc-assembly-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "PC Assembly Lab",
        description: "Build a complete PC in the correct order",
        gameId: "pc-assembly-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Hardware Diagnostic Test",
        description: "Run diagnostics to find hardware faults",
        gameId: "pc-assembly-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Motherboard Explorer",
        description: "Identify all motherboard components and slots",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "RAM Installation",
        description: "Install and configure memory modules",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "GPU Setup Challenge",
        description: "Install and configure graphics cards",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Power Supply Lab",
        description: "Calculate power requirements and connect PSU",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Cooling Systems",
        description: "Design cooling solutions for high-performance PCs",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "BIOS Configuration",
        description: "Configure BIOS settings for optimal boot",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Peripheral Connection",
        description: "Connect and configure all peripherals",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Laptop Repair Mission",
        description: "Diagnose and repair a broken laptop",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Server Hardware Lab",
        description: "Identify and configure server components",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Broken Machine",
        description: "Fix a completely broken computer system",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Hardware Skills",
        description: "Full hardware competency evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Ultimate Build",
        description: "Build the most powerful PC ever assembled",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-cloud-storage",
    name: "Cloud Storage",
    description: "Cloud services, sync systems, and distributed storage",
    subGames: buildSubGames("ict-cloud-storage", [
      {
        title: "Cloud Upload Mission",
        description: "Upload and organize files in cloud storage",
        gameId: "cloud-quest-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Sync Configuration",
        description: "Set up automatic sync between devices",
        gameId: "cloud-quest-2",
        unlockAtXP: 50,
        difficulty: 2
      },
      {
        title: "Cloud Sharing Lab",
        description: "Share files and manage access permissions",
        gameId: "cloud-quest-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Backup Recovery",
        description: "Restore files from cloud backup systems",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Storage Optimization",
        description: "Manage storage quotas and compress files",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Version History",
        description: "Navigate file versions and recover old copies",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 3
      },
      {
        title: "Collaboration Hub",
        description: "Co-edit documents with multiple users",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "API Integration Basics",
        description: "Connect apps to cloud storage via APIs",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Security and Encryption",
        description: "Encrypt cloud data and manage keys",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Hybrid Cloud Design",
        description: "Design hybrid local-cloud architectures",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Cost Optimization Mission",
        description: "Reduce cloud storage costs efficiently",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Disaster Recovery Plan",
        description: "Build a complete disaster recovery strategy",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Data Storm",
        description: "Recover all data during a cloud failure",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Cloud Mastery",
        description: "Full cloud services certification test",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: Infinite Storage",
        description: "Build an unlimited distributed storage system",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-data-management",
    name: "Data Management",
    description: "Data collection, analysis, and database fundamentals",
    subGames: buildSubGames("ict-data-management", [
      {
        title: "Data Collection Mission",
        description: "Gather and organize data from multiple sources",
        gameId: "data-explorer-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Spreadsheet Data Lab",
        description: "Clean and organize raw data in tables",
        gameId: "data-explorer-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Chart and Graph Builder",
        description: "Visualize data using appropriate chart types",
        gameId: "data-explorer-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Database Introduction",
        description: "Create basic tables and relationships",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "SQL Query Basics",
        description: "Write SELECT queries to retrieve data",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Data Sorting and Filtering",
        description: "Find specific records using filters",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Data Validation Rules",
        description: "Create rules to ensure data quality",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Pivot Table Challenge",
        description: "Create pivot tables for data analysis",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Statistical Analysis",
        description: "Calculate mean, median, and standard deviation",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Data Security Mission",
        description: "Protect sensitive data from unauthorized access",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Big Data Concepts",
        description: "Understand volume, velocity, and variety",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Data Mining Intro",
        description: "Extract patterns from large datasets",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Data Crisis",
        description: "Analyze and fix a corrupted data emergency",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Data Skills",
        description: "Full data management competency test",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Data Oracle",
        description: "Advanced predictive analytics challenge",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-email-communication",
    name: "Email Communication",
    description: "Professional email writing, inbox management, and communication",
    subGames: buildSubGames("ict-email-communication", [
      {
        title: "Email Composition Lab",
        description: "Write clear professional emails",
        gameId: null,
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Subject Line Mastery",
        description: "Write effective subject lines that get opened",
        gameId: null,
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Inbox Zero Challenge",
        description: "Sort and archive 100 emails efficiently",
        gameId: null,
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "CC and BCC Logic",
        description: "Use CC and BCC correctly in group emails",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Attachment Management",
        description: "Attach, compress, and manage file attachments",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Email Filter Setup",
        description: "Create filters and labels for organization",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Formal vs Informal",
        description: "Match email tone to audience and context",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Auto-Reply Configuration",
        description: "Set up out-of-office and auto-reply systems",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Email Security Scan",
        description: "Detect spam, phishing, and suspicious emails",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Newsletter Builder",
        description: "Create and send formatted newsletters",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Group Email Management",
        description: "Coordinate email threads across teams",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Email Analytics Lab",
        description: "Analyze open rates and click-through data",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Communication Director",
        description: "Manage a complete professional email system",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Email Mastery",
        description: "Full professional communication certification",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Executive Inbox",
        description: "Manage a CEO-level inbox under crisis",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-programming-logic",
    name: "Programming Logic",
    description: "Flowcharts, pseudocode, and computational thinking",
    subGames: buildSubGames("ict-programming-logic", [
      {
        title: "Flowchart Builder",
        description: "Design flowcharts for common algorithms",
        gameId: "logic-flow-1",
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Pseudocode Writer",
        description: "Translate problems into clear pseudocode",
        gameId: "logic-flow-2",
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Boolean Logic Gates",
        description: "AND, OR, NOT gate truth table challenges",
        gameId: "logic-flow-3",
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Decision Tree Mission",
        description: "Build decision trees for problem solving",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Algorithm Trace",
        description: "Trace through algorithms step by step",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Recursion Visualization",
        description: "See and understand recursive thinking",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 3
      },
      {
        title: "Computational Thinking Lab",
        description: "Decompose complex problems into steps",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Pattern Abstraction",
        description: "Identify and abstract repeating patterns",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Algorithm Efficiency",
        description: "Compare algorithm speeds and optimize",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Data Structure Basics",
        description: "Stacks, queues, and linked lists",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Binary and Hex Systems",
        description: "Convert between number systems",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Logic Circuit Design",
        description: "Build complex logic circuits",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Logic Master",
        description: "Solve a multi-layer logic challenge",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Programming Logic",
        description: "Full computational thinking evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Turing Test",
        description: "Complete an AI-level logic challenge",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-computer-history",
    name: "Computer History",
    description: "Evolution of computing, pioneers, and technological milestones",
    subGames: buildSubGames("ict-computer-history", [
      {
        title: "Computing Timeline",
        description: "Place major inventions in chronological order",
        gameId: null,
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Pioneers Memory Match",
        description: "Match computing pioneers to their inventions",
        gameId: null,
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Generation Explorer",
        description: "Identify computer generations by technology",
        gameId: null,
        unlockAtXP: 100,
        difficulty: 1
      },
      {
        title: "Operating System History",
        description: "Trace the evolution of OS from DOS to now",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Internet Origins Quest",
        description: "Discover how ARPANET became the internet",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Programming Language Tree",
        description: "Map the evolution of programming languages",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Storage Evolution Lab",
        description: "From punch cards to SSDs timeline",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 2
      },
      {
        title: "Processor Evolution",
        description: "Trace CPU development from 4-bit to 64-bit",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "AI History Journey",
        description: "Trace AI from Turing to modern neural nets",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Mobile Revolution",
        description: "From brick phones to smartphones timeline",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Open Source Movement",
        description: "Story of Linux, GNU, and open software",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Future Tech Forecast",
        description: "Predict next computing breakthroughs",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The History Master",
        description: "Answer 30 consecutive history questions",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Computer History",
        description: "Full computing history knowledge test",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Time Machine",
        description: "Travel through all computing eras in one run",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-spreadsheet-skills",
    name: "Spreadsheet Skills",
    description: "Advanced Excel and spreadsheet analysis techniques",
    subGames: buildSubGames("ict-spreadsheet-skills", [
      {
        title: "Cell Reference Master",
        description: "Absolute and relative cell references",
        gameId: null,
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Formula Race",
        description: "Write formulas faster than competitors",
        gameId: null,
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Conditional Formatting",
        description: "Highlight cells based on logical conditions",
        gameId: null,
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "VLOOKUP Adventure",
        description: "Use VLOOKUP to find data across sheets",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Pivot Table Wizard",
        description: "Create and analyze complex pivot tables",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Data Analysis Tools",
        description: "Goal seek, solver, and scenario analysis",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 3
      },
      {
        title: "Dashboard Builder",
        description: "Create interactive KPI dashboards",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Financial Model",
        description: "Build a complete financial projection model",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Array Formula Lab",
        description: "Master complex array formula techniques",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Power Query Intro",
        description: "Import and transform data with Power Query",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Data Validation Expert",
        description: "Create dropdown lists and validation rules",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Macro Automation",
        description: "Automate repetitive tasks with macros",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Data Analyst",
        description: "Complete a real-world business analysis",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Spreadsheets",
        description: "Full spreadsheet mastery evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Model Factory",
        description: "Build an advanced enterprise data model",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-presentation-skills",
    name: "Presentation Skills",
    description: "Slide design, storytelling, and presentation delivery",
    subGames: buildSubGames("ict-presentation-skills", [
      {
        title: "Slide Layout Basics",
        description: "Create clean well-structured slide layouts",
        gameId: null,
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Data Visualization Slides",
        description: "Present data with charts and graphics",
        gameId: null,
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "Animation Sequencing",
        description: "Add professional slide transition effects",
        gameId: null,
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "Speaker Notes Creator",
        description: "Write effective speaker notes for delivery",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "Visual Hierarchy Lab",
        description: "Use size and contrast for visual impact",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "Brand Consistency",
        description: "Apply brand colors and fonts consistently",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Storytelling Structure",
        description: "Build a compelling narrative arc",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Interactive Slides",
        description: "Create clickable navigation in slides",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Presentation Timing",
        description: "Deliver a timed presentation on schedule",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Audience Analysis",
        description: "Adapt presentation style for different audiences",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Q&A Simulation",
        description: "Handle difficult questions with confidence",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Video Integration",
        description: "Embed and control videos in presentations",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Big Pitch",
        description: "Deliver a full product pitch to the board",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Presentation Mastery",
        description: "Full presentation skills evaluation",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: TED Talk Challenge",
        description: "Deliver a perfect 18-minute TED Talk",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  },
  {
    id: "ict-database-intro",
    name: "Database Introduction",
    description: "Relational databases, SQL queries, and data modeling",
    subGames: buildSubGames("ict-database-intro", [
      {
        title: "Table Design Basics",
        description: "Create well-structured database tables",
        gameId: null,
        unlockAtXP: 0,
        difficulty: 1
      },
      {
        title: "Primary Key Mission",
        description: "Define primary keys for unique record identity",
        gameId: null,
        unlockAtXP: 50,
        difficulty: 1
      },
      {
        title: "SQL SELECT Queries",
        description: "Retrieve data using SELECT statements",
        gameId: null,
        unlockAtXP: 100,
        difficulty: 2
      },
      {
        title: "WHERE Clause Challenge",
        description: "Filter records using WHERE conditions",
        gameId: null,
        unlockAtXP: 150,
        difficulty: 2
      },
      {
        title: "JOIN Operations",
        description: "Combine tables using INNER and OUTER JOINs",
        gameId: null,
        unlockAtXP: 200,
        difficulty: 2
      },
      {
        title: "INSERT and UPDATE",
        description: "Add and modify database records",
        gameId: null,
        unlockAtXP: 250,
        difficulty: 2
      },
      {
        title: "Aggregate Functions",
        description: "Use COUNT, SUM, AVG in SQL queries",
        gameId: null,
        unlockAtXP: 300,
        difficulty: 3
      },
      {
        title: "Entity Relationship Diagrams",
        description: "Design ERDs for real-world systems",
        gameId: null,
        unlockAtXP: 400,
        difficulty: 3
      },
      {
        title: "Database Normalization",
        description: "Apply 1NF, 2NF, 3NF to reduce redundancy",
        gameId: null,
        unlockAtXP: 500,
        difficulty: 3
      },
      {
        title: "Index Optimization",
        description: "Speed up queries using database indexes",
        gameId: null,
        unlockAtXP: 600,
        difficulty: 3
      },
      {
        title: "Stored Procedures",
        description: "Create reusable database procedures",
        gameId: null,
        unlockAtXP: 700,
        difficulty: 3
      },
      {
        title: "Database Security",
        description: "Grant and revoke database permissions",
        gameId: null,
        unlockAtXP: 800,
        difficulty: 3
      },
      {
        title: "Boss: The Database Architect",
        description: "Design and build a complete database system",
        gameId: null,
        unlockAtXP: 1e3,
        difficulty: 3
      },
      {
        title: "Assessment: Database Skills",
        description: "Full database competency certification",
        gameId: null,
        unlockAtXP: 1200,
        difficulty: 3
      },
      {
        title: "Secret: The Data Warehouse",
        description: "Build an enterprise data warehouse",
        gameId: null,
        unlockAtXP: 2e3,
        difficulty: 3
      }
    ])
  }
];
function makeICTSubject() {
  return {
    id: "ict",
    name: "ICT",
    color: "oklch(0.75 0.25 200)",
    iconPath: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
    description: "Master computers, coding, cybersecurity, and digital skills",
    categories: ICT_CATEGORIES
  };
}
function makeMathSubject() {
  return {
    id: "mathematics",
    name: "Mathematics",
    color: "oklch(0.78 0.20 60)",
    iconPath: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
    description: "Conquer numbers, geometry, algebra, and advanced calculations",
    categories: buildMathCategories()
  };
}
function makeEnglishSubject() {
  return {
    id: "english",
    name: "English",
    color: "oklch(0.72 0.22 290)",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    description: "Build grammar, vocabulary, reading, and communication skills",
    categories: buildEnglishCategories()
  };
}
function makeScienceSubject() {
  return {
    id: "science",
    name: "Science",
    color: "oklch(0.72 0.22 145)",
    iconPath: "M19.428 15.428a2 2 0 0 0-1.022-.547l-2.387-.477a6 6 0 0 0-3.86.517l-.318.158a6 6 0 0 1-3.86.517L6.05 15.21a2 2 0 0 0-1.806.547M8 4h8l-1 1v5.172a2 2 0 0 0 .586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 0 0 9 10.172V5L8 4z",
    description: "Explore human biology, chemistry, physics, and space",
    categories: buildScienceCategories()
  };
}
function makeRoboticsSubject() {
  return {
    id: "robotics",
    name: "Robotics",
    color: "oklch(0.72 0.25 15)",
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2",
    description: "Build robots, design circuits, and program autonomous machines",
    categories: buildRoboticsCategories()
  };
}
function makeCriticalThinkingSubject() {
  return {
    id: "criticalThinking",
    name: "Critical Thinking",
    color: "oklch(0.65 0.28 280)",
    iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    description: "Solve logic puzzles, mysteries, and strategic challenges",
    categories: buildCriticalThinkingCategories()
  };
}
function makeCodingSubject() {
  return {
    id: "coding",
    name: "Coding",
    color: "oklch(0.70 0.22 220)",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    description: "Learn programming from blocks to text-based code",
    categories: buildCodingCategories()
  };
}
function makeDigitalSkillsSubject() {
  return {
    id: "digitalSkills",
    name: "Digital Skills",
    color: "oklch(0.75 0.20 175)",
    iconPath: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
    description: "Social media literacy, digital citizenship, and online collaboration",
    categories: buildDigitalSkillsCategories()
  };
}
function buildMathCategories() {
  const names = [
    "Arithmetic Fundamentals",
    "Fractions and Decimals",
    "Geometry Shapes",
    "Measurement Systems",
    "Number Patterns",
    "Time and Money",
    "Multiplication Mastery",
    "Division Challenges",
    "Algebra Basics",
    "Statistics and Data",
    "Graphing and Coordinates",
    "Mental Math Speed",
    "Word Problems",
    "Mathematical Reasoning",
    "Advanced Calculations",
    "Fractions Kingdom",
    "Algebra Adventure",
    "Geometry Builder",
    "Magic Mathematics",
    "Arithmetic Arena"
  ];
  return names.map((name, idx) => ({
    id: `math-cat-${idx + 1}`,
    name,
    description: `Master ${name.toLowerCase()} through interactive challenges`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `math-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Progressive challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: i < 3 ? `math-${idx + 1}-game-${i + 1}` : null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
function buildEnglishCategories() {
  const names = [
    "Grammar Foundations",
    "Vocabulary Building",
    "Reading Comprehension",
    "Spelling Mastery",
    "Sentence Construction",
    "Punctuation Rules",
    "Parts of Speech",
    "Tenses and Verbs",
    "Story Writing",
    "Poetry and Rhyme",
    "Pronunciation Practice",
    "Listening Skills",
    "Public Speaking",
    "Debate Skills",
    "Creative Writing",
    "Grammar City Missions",
    "Vocabulary Quest",
    "Reading Adventure",
    "Communication Skills",
    "Literature Exploration"
  ];
  return names.map((name, idx) => ({
    id: `eng-cat-${idx + 1}`,
    name,
    description: `Develop ${name.toLowerCase()} through language adventures`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `eng-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Language challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: i < 3 ? `eng-${idx + 1}-game-${i + 1}` : null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
function buildScienceCategories() {
  const names = [
    "Human Body Systems",
    "Plants and Animals",
    "Space Exploration",
    "Chemistry Lab",
    "Electricity and Circuits",
    "States of Matter",
    "Weather Patterns",
    "Forces and Motion",
    "Environmental Science",
    "Earth and Rocks",
    "Renewable Energy",
    "Scientific Method",
    "Ecosystems",
    "Light and Sound",
    "Health and Nutrition",
    "Biology Basics",
    "Physics Fundamentals",
    "Chemical Reactions",
    "Climate Science",
    "Earth Science"
  ];
  return names.map((name, idx) => ({
    id: `sci-cat-${idx + 1}`,
    name,
    description: `Explore ${name.toLowerCase()} through scientific discovery`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `sci-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Scientific challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: i < 3 ? `sci-${idx + 1}-game-${i + 1}` : null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
function buildRoboticsCategories() {
  const names = [
    "Robot Assembly",
    "Sensor Systems",
    "Circuit Building",
    "Robot Programming",
    "AI and Machine Learning",
    "Electronics Lab",
    "Logic Gates",
    "Drone Navigation",
    "Smart Systems",
    "Mechanical Design",
    "Industrial Automation",
    "Mechatronics",
    "Servo Motors",
    "Pathfinding Algorithms",
    "Robot Debugging",
    "Robotic Arms",
    "Line Following",
    "Object Detection",
    "Autonomous Vehicles",
    "Space Robots"
  ];
  return names.map((name, idx) => ({
    id: `rob-cat-${idx + 1}`,
    name,
    description: `Master ${name.toLowerCase()} through hands-on robotics`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `rob-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Robotics challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: i < 3 ? `rob-${idx + 1}-game-${i + 1}` : null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
function buildCriticalThinkingCategories() {
  const names = [
    "Logic Puzzles",
    "Memory Training",
    "Strategy Games",
    "Brain Teasers",
    "Pattern Recognition",
    "Detective Mysteries",
    "Escape Rooms",
    "Decision Making",
    "Problem Solving",
    "Innovation Challenges",
    "Strategic Planning",
    "Coding Logic",
    "Analytical Reasoning",
    "Lateral Thinking",
    "Mind Maps",
    "Chess Strategy",
    "Sudoku Masters",
    "Cryptography Basics",
    "Debate Logic",
    "Research Skills"
  ];
  return names.map((name, idx) => ({
    id: `ct-cat-${idx + 1}`,
    name,
    description: `Sharpen your ${name.toLowerCase()} skills through challenges`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `ct-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Reasoning challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: i < 3 ? `ct-${idx + 1}-game-${i + 1}` : null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
function buildCodingCategories() {
  const names = [
    "Block Coding Basics",
    "Scratch Projects",
    "Python Introduction",
    "JavaScript Basics",
    "HTML and CSS",
    "Game Development",
    "App Building",
    "Web Design",
    "Data Structures",
    "Algorithm Design",
    "Debugging Skills",
    "API Basics",
    "Database Queries",
    "Machine Learning Intro",
    "Capstone Projects",
    "Code Challenges",
    "Hackathon Prep",
    "Open Source Intro",
    "Security Coding",
    "Full Stack Basics"
  ];
  return names.map((name, idx) => ({
    id: `cod-cat-${idx + 1}`,
    name,
    description: `Build ${name.toLowerCase()} programming skills`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `cod-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Coding challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
function buildDigitalSkillsCategories() {
  const names = [
    "Digital Citizenship",
    "Social Media Safety",
    "Online Collaboration",
    "Digital Well-being",
    "Media Literacy",
    "Online Research",
    "Digital Communication",
    "Information Verification",
    "Copyright Basics",
    "Privacy Awareness",
    "Digital Commerce",
    "E-Government Services",
    "Online Learning Tools",
    "Digital Accessibility",
    "Future Technologies",
    "Digital Economy",
    "Remote Work Skills",
    "Virtual Collaboration",
    "Content Creation",
    "Digital Leadership"
  ];
  return names.map((name, idx) => ({
    id: `ds-cat-${idx + 1}`,
    name,
    description: `Develop ${name.toLowerCase()} competencies`,
    subGames: Array.from({ length: 15 }, (_, i) => ({
      id: `ds-cat-${idx + 1}-sg-${i + 1}`,
      title: `${name} Level ${i + 1}`,
      description: `Digital skills challenge ${i + 1} for ${name.toLowerCase()}`,
      gameId: null,
      unlockAtXP: i * 100,
      difficulty: Math.floor(i / 5) + 1
    }))
  }));
}
const LEVEL_THEMES = [
  { primary: "oklch(0.75 0.25 200)", glow: "oklch(0.75 0.25 200 / 0.4)" },
  { primary: "oklch(0.78 0.20 60)", glow: "oklch(0.78 0.20 60 / 0.4)" },
  { primary: "oklch(0.72 0.22 145)", glow: "oklch(0.72 0.22 145 / 0.4)" },
  { primary: "oklch(0.72 0.22 290)", glow: "oklch(0.72 0.22 290 / 0.4)" },
  { primary: "oklch(0.72 0.25 15)", glow: "oklch(0.72 0.25 15 / 0.4)" },
  { primary: "oklch(0.65 0.28 280)", glow: "oklch(0.65 0.28 280 / 0.4)" },
  { primary: "oklch(0.70 0.22 220)", glow: "oklch(0.70 0.22 220 / 0.4)" },
  { primary: "oklch(0.75 0.20 175)", glow: "oklch(0.75 0.20 175 / 0.4)" },
  { primary: "oklch(0.80 0.25 45)", glow: "oklch(0.80 0.25 45 / 0.4)" }
];
const LEVEL_SUBTITLES = [
  "Foundation of Knowledge — where every great journey begins",
  "Building Blocks — connecting concepts into understanding",
  "Growing Minds — expanding skills across all dimensions",
  "Rising Scholar — tackling complex challenges with confidence",
  "Knowledge Seeker — pushing into advanced territories",
  "Skilled Thinker — mastering intricate systems and ideas",
  "Advanced Explorer — solving multi-layered problems",
  "Expert Navigator — commanding professional-level knowledge",
  "Master Scholar — the pinnacle of the SmartLearn Quest journey"
];
const BASIC_LEVELS = Array.from({ length: 9 }, (_, i) => ({
  id: `basic-${i + 1}`,
  name: `Basic ${i + 1}`,
  subtitle: LEVEL_SUBTITLES[i],
  theme: LEVEL_THEMES[i],
  subjects: [
    makeICTSubject(),
    makeMathSubject(),
    makeEnglishSubject(),
    makeScienceSubject(),
    makeRoboticsSubject(),
    makeCriticalThinkingSubject(),
    makeCodingSubject(),
    makeDigitalSkillsSubject()
  ]
}));
function getBasicLevel(id) {
  return BASIC_LEVELS.find((l) => l.id === id);
}
function getSubjectInLevel(levelId, subjectId) {
  const level = getBasicLevel(levelId);
  return level == null ? void 0 : level.subjects.find((s) => s.id === subjectId);
}
function getCategoryInSubject(levelId, subjectId, categoryId) {
  const subject = getSubjectInLevel(levelId, subjectId);
  return subject == null ? void 0 : subject.categories.find((c) => c.id === categoryId);
}
export {
  BASIC_LEVELS as B,
  getCategoryInSubject as a,
  getSubjectInLevel as g
};
