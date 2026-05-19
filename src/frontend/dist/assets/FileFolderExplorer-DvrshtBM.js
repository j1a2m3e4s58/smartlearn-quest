import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { F as FileText } from "./file-text-7x6WuCaf.js";
import { P as Package } from "./package-CLV5NoJT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
];
const File = createLucideIcon("file", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode);
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function getFileIcon(icon, color, size = "h-5 w-5") {
  const cls = `${size}`;
  const style = { color };
  if (icon === "doc") return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: cls, style });
  if (icon === "img") return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: cls, style });
  if (icon === "vid") return /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: cls, style });
  if (icon === "mus") return /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: cls, style });
  if (icon === "zip") return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: cls, style });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: cls, style });
}
const FILE_TEMPLATES = [
  {
    name: "Report",
    ext: ".docx",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6"
  },
  {
    name: "Essay",
    ext: ".pdf",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6"
  },
  {
    name: "Notes",
    ext: ".txt",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6"
  },
  {
    name: "Summary",
    ext: ".docx",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6"
  },
  {
    name: "Photo1",
    ext: ".jpg",
    category: "Images",
    icon: "img",
    color: "#10b981"
  },
  {
    name: "Screenshot",
    ext: ".png",
    category: "Images",
    icon: "img",
    color: "#10b981"
  },
  {
    name: "Banner",
    ext: ".jpg",
    category: "Images",
    icon: "img",
    color: "#10b981"
  },
  {
    name: "Wallpaper",
    ext: ".png",
    category: "Images",
    icon: "img",
    color: "#10b981"
  },
  {
    name: "Lecture",
    ext: ".mp4",
    category: "Videos",
    icon: "vid",
    color: "#f59e0b"
  },
  {
    name: "Tutorial",
    ext: ".mp4",
    category: "Videos",
    icon: "vid",
    color: "#f59e0b"
  },
  {
    name: "Clip",
    ext: ".mp4",
    category: "Videos",
    icon: "vid",
    color: "#f59e0b"
  },
  {
    name: "Song1",
    ext: ".mp3",
    category: "Music",
    icon: "mus",
    color: "#7c3aed"
  },
  {
    name: "Podcast",
    ext: ".mp3",
    category: "Music",
    icon: "mus",
    color: "#7c3aed"
  },
  {
    name: "Ringtone",
    ext: ".mp3",
    category: "Music",
    icon: "mus",
    color: "#7c3aed"
  },
  {
    name: "Setup",
    ext: ".exe",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e"
  },
  {
    name: "App",
    ext: ".app",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e"
  },
  {
    name: "Driver",
    ext: ".exe",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e"
  },
  {
    name: "Archive",
    ext: ".zip",
    category: "Documents",
    icon: "zip",
    color: "#3b82f6"
  },
  {
    name: "Readme",
    ext: ".txt",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6"
  },
  {
    name: "Installer",
    ext: ".exe",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e"
  }
];
const FOLDERS = [
  {
    id: "docs",
    label: "Documents",
    category: "Documents",
    color: "#3b82f6",
    files: []
  },
  {
    id: "imgs",
    label: "Images",
    category: "Images",
    color: "#10b981",
    files: []
  },
  {
    id: "vids",
    label: "Videos",
    category: "Videos",
    color: "#f59e0b",
    files: []
  },
  { id: "mus", label: "Music", category: "Music", color: "#7c3aed", files: [] },
  {
    id: "prg",
    label: "Programs",
    category: "Programs",
    color: "#f43f5e",
    files: []
  }
];
function FileSortGame({ config, onGameEnd }) {
  const fileCount = config.difficulty === 1 ? 10 : config.difficulty === 2 ? 15 : 20;
  const [files, setFiles] = reactExports.useState(
    () => shuffle(FILE_TEMPLATES).slice(0, fileCount).map((f, i) => ({ ...f, id: `f-${i}` }))
  );
  const [folders, setFolders] = reactExports.useState(
    FOLDERS.map((f) => ({ ...f, files: [] }))
  );
  const [selected, setSelected] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [flashFolder, setFlashFolder] = reactExports.useState(null);
  const [placed, setPlaced] = reactExports.useState(0);
  const [wrong, setWrong] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const livesRef = reactExports.useRef(lives);
  const scoreRef = reactExports.useRef(score);
  livesRef.current = lives;
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const total = placed + wrong;
      const acc = total > 0 ? placed / total * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, gameOver, placed, wrong]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(true)
  );
  function handleFolderClick(folder) {
    if (!gameStarted || gameOver || !selected) return;
    const correct = selected.category === folder.category;
    setFlashFolder({ id: folder.id, ok: correct });
    setTimeout(() => setFlashFolder(null), 500);
    if (correct) {
      const timeBonus = Math.floor(timeLeft / config.timeLimit * 50);
      setScore((s) => s + 100 + timeBonus);
      setPlaced((p) => p + 1);
      setFolders(
        (prev) => prev.map(
          (f) => f.id === folder.id ? { ...f, files: [...f.files, selected] } : f
        )
      );
      const remaining = files.filter((f) => f.id !== selected.id);
      setFiles(remaining);
      setSelected(null);
      if (remaining.length === 0) endGame(true);
    } else {
      setWrong((w) => w + 1);
      const newLives = livesRef.current - 1;
      setLives(newLives);
      if (newLives <= 0) endGame(false);
      setSelected(null);
    }
  }
  const progressPct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full flex flex-col select-none",
      "data-ocid": "file_sort.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 mb-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 transition-all ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              files.length,
              " left"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-6", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "File System Commander"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-1 text-center", children: "Click a file, then click the correct folder to organize it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mb-6 text-center", children: [
                "Wrong folder = lose a life. Sort all ",
                fileCount,
                " files to win."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "file_sort.start_button",
                  children: "Start Game"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2 shrink-0", children: folders.map((folder) => {
            const flash = (flashFolder == null ? void 0 : flashFolder.id) === folder.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                onClick: () => handleFolderClick(folder),
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.96 },
                "data-ocid": `file_sort.folder.${folder.id}`,
                className: `relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all cursor-pointer ${flash ? (flashFolder == null ? void 0 : flashFolder.ok) ? "bg-[#10b981]/20 border-[#10b981]" : "bg-[#f43f5e]/20 border-[#f43f5e]" : "glass-card"}`,
                style: {
                  borderColor: selected && !flash ? folder.color : void 0
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-8 w-8", style: { color: folder.color } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: folder.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: folder.files.length })
                ]
              },
              folder.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-5 gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: files.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.5 },
                whileHover: { scale: 1.06 },
                whileTap: { scale: 0.94 },
                onClick: () => setSelected((f) => (f == null ? void 0 : f.id) === file.id ? null : file),
                "data-ocid": "file_sort.file_item",
                className: `flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${(selected == null ? void 0 : selected.id) === file.id ? "border-[#00f5ff] bg-[#00f5ff]/15 shadow-[0_0_10px_rgba(0,245,255,0.4)]" : "border-border/40 glass-card hover:border-border"}`,
                children: [
                  getFileIcon(file.icon, file.color),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate w-full text-center", children: file.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: file.ext })
                ]
              },
              file.id
            )) }) }),
            files.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-32 text-[#10b981] font-bold text-lg",
                "data-ocid": "file_sort.empty_state",
                children: "All files organized!"
              }
            )
          ] }),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-[#00f5ff] animate-pulse mt-1", children: [
            "Selected: ",
            selected.name,
            selected.ext,
            " — click the correct folder"
          ] })
        ] })
      ]
    }
  );
}
const PATH_QUESTIONS = [
  {
    path: "C:/Users/Student/Documents/homework.docx",
    questions: [
      {
        q: "What folder contains homework.docx?",
        options: ["Users", "Student", "Documents", "C:"],
        answer: "Documents"
      },
      {
        q: "What is the root drive?",
        options: ["Users", "C:", "Student", "Documents"],
        answer: "C:"
      },
      {
        q: "What is the parent folder of Documents?",
        options: ["Users", "C:", "Student", "homework"],
        answer: "Student"
      }
    ]
  },
  {
    path: "D:/School/Grade5/Science/lab_report.pdf",
    questions: [
      {
        q: "What is the file name?",
        options: ["Grade5", "Science", "lab_report.pdf", "School"],
        answer: "lab_report.pdf"
      },
      {
        q: "What drive is this on?",
        options: ["C:", "D:", "E:", "A:"],
        answer: "D:"
      },
      {
        q: "Which folder directly contains the file?",
        options: ["School", "Grade5", "Science", "D:"],
        answer: "Science"
      }
    ]
  },
  {
    path: "C:/Program Files/Browser/browser.exe",
    questions: [
      {
        q: "What type of file is browser.exe?",
        options: ["Document", "Image", "Executable program", "Music"],
        answer: "Executable program"
      },
      {
        q: "What folder contains the Browser folder?",
        options: ["C:", "System32", "Program Files", "browser.exe"],
        answer: "Program Files"
      },
      {
        q: "What is the extension of the file?",
        options: [".pdf", ".txt", ".exe", ".bat"],
        answer: ".exe"
      }
    ]
  },
  {
    path: "C:/Users/Admin/Desktop/photos/birthday.jpg",
    questions: [
      {
        q: "How many folders deep is birthday.jpg?",
        options: ["2", "3", "4", "5"],
        answer: "4"
      },
      {
        q: "Which user's Desktop is this?",
        options: ["Student", "Guest", "Admin", "System"],
        answer: "Admin"
      },
      {
        q: "What category of file is birthday.jpg?",
        options: ["Document", "Image", "Program", "Video"],
        answer: "Image"
      }
    ]
  }
];
function PathQuizGame({ config, onGameEnd }) {
  const [pathIdx, setPathIdx] = reactExports.useState(0);
  const [questionIdx, setQuestionIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [total, setTotal] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
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
    [config, onGameEnd, gameOver]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  const progressPct = timeLeft / config.timeLimit * 100;
  const allPaths = shuffle([...PATH_QUESTIONS]).slice(
    0,
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 4
  );
  const [paths] = reactExports.useState(() => allPaths);
  function handleAnswer(option) {
    if (feedback || gameOver) return;
    const path = paths[pathIdx];
    const q = path.questions[questionIdx];
    const ok = option === q.answer;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 120 + Math.floor(timeLeft / config.timeLimit * 80));
      setFeedback({ ok: true, msg: `Correct! "${q.answer}" is right.` });
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
      setFeedback({
        ok: false,
        msg: `Wrong! The correct answer is "${q.answer}".`
      });
    }
    setTimeout(() => {
      setFeedback(null);
      const nextQ = questionIdx + 1;
      if (nextQ >= path.questions.length) {
        const nextP = pathIdx + 1;
        if (nextP >= paths.length) {
          endGame(true);
          return;
        }
        setPathIdx(nextP);
        setQuestionIdx(0);
      } else {
        setQuestionIdx(nextQ);
      }
    }, 1400);
  }
  const currentPath = paths[pathIdx];
  const currentQ = currentPath == null ? void 0 : currentPath.questions[questionIdx];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "path_quiz.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-1000 xp-fill",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Folder Path Quiz"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Read the file path and answer questions about folder structure, drives, and file locations." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "path_quiz.start_button",
                  children: "Start Quiz"
                }
              )
            ]
          }
        ) : currentQ ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#00f5ff]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: "File Path" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-[#00f5ff] break-all", children: currentPath.path })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
              "Path ",
              pathIdx + 1,
              "/",
              paths.length,
              " — Q",
              questionIdx + 1,
              "/",
              currentPath.questions.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-4", children: currentQ.q }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: currentQ.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileHover: { scale: 1.01 },
                whileTap: { scale: 0.99 },
                onClick: () => handleAnswer(opt),
                disabled: !!feedback,
                "data-ocid": "path_quiz.option",
                className: `text-left px-4 py-3 rounded-lg border text-sm font-mono transition-all ${feedback && opt === currentQ.answer ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : "border-border/40 glass-card text-foreground hover:border-[#00f5ff]/40"}`,
                children: opt
              },
              opt
            )) }),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 4 },
                animate: { opacity: 1, y: 0 },
                className: `mt-3 px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                "data-ocid": feedback.ok ? "path_quiz.success_state" : "path_quiz.error_state",
                children: feedback.msg
              }
            )
          ] })
        ] }) : null
      ]
    }
  );
}
const FILE_TYPE_DATA = [
  { filename: "homework", ext: ".docx", correctApp: "Microsoft Word" },
  { filename: "photo", ext: ".jpg", correctApp: "Image Viewer" },
  { filename: "song", ext: ".mp3", correctApp: "Music Player" },
  { filename: "video", ext: ".mp4", correctApp: "Video Player" },
  { filename: "spreadsheet", ext: ".xlsx", correctApp: "Microsoft Excel" },
  { filename: "presentation", ext: ".pptx", correctApp: "PowerPoint" },
  { filename: "archive", ext: ".zip", correctApp: "WinZip / 7-Zip" },
  { filename: "webpage", ext: ".html", correctApp: "Web Browser" },
  { filename: "ebook", ext: ".pdf", correctApp: "PDF Reader" },
  { filename: "setup", ext: ".exe", correctApp: "Windows Installer" },
  { filename: "screenshot", ext: ".png", correctApp: "Image Viewer" },
  { filename: "notes", ext: ".txt", correctApp: "Text Editor" }
];
const ALL_APP_NAMES = [
  "Microsoft Word",
  "Image Viewer",
  "Music Player",
  "Video Player",
  "Microsoft Excel",
  "PowerPoint",
  "WinZip / 7-Zip",
  "Web Browser",
  "PDF Reader",
  "Windows Installer",
  "Text Editor"
];
function makeFileTypeItems(count) {
  return shuffle(FILE_TYPE_DATA).slice(0, count).map((f, i) => {
    const distractors = shuffle(
      ALL_APP_NAMES.filter((a) => a !== f.correctApp)
    ).slice(0, 3);
    return {
      ...f,
      id: `ft-${i}`,
      options: shuffle([f.correctApp, ...distractors])
    };
  });
}
function FileTypesQuiz({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 6 : config.difficulty === 2 ? 10 : 12;
  const [items] = reactExports.useState(() => makeFileTypeItems(count));
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [answered, setAnswered] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (completed) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = count > 0 ? correctRef.current / count * 100 : 0;
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
    [config, onGameEnd, gameOver, count]
  );
  const { timeLeft, start: startTimer } = useGameTimer(
    config.timeLimit,
    () => endGame(false)
  );
  const progressPct = timeLeft / config.timeLimit * 100;
  function handleAnswer(app) {
    if (answered || gameOver) return;
    setAnswered(true);
    const item2 = items[currentIdx];
    const ok = app === item2.correctApp;
    if (ok) {
      setScore((s) => s + 100 + Math.floor(timeLeft / config.timeLimit * 60));
      setCorrect((c) => c + 1);
      setFeedback({
        ok: true,
        msg: `${item2.ext} files open in ${item2.correctApp}.`
      });
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
      setFeedback({
        ok: false,
        msg: `Wrong. ${item2.ext} files open in ${item2.correctApp}.`
      });
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      if (currentIdx + 1 >= items.length) endGame(true);
      else setCurrentIdx((i) => i + 1);
    }, 1400);
  }
  const item = items[currentIdx];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "file_types.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              currentIdx + 1,
              "/",
              count
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full xp-fill transition-all duration-1000",
                style: { width: `${progressPct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        !gameStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-2xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "File Types Quiz"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 text-center", children: "Each file has an extension — match it to the correct application that opens it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                    startTimer();
                  },
                  "data-ocid": "file_types.start_button",
                  children: "Start Quiz"
                }
              )
            ]
          }
        ) : item ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-6 flex items-center justify-center border border-[#00f5ff]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-5xl font-black mb-2",
                    style: {
                      color: "#00f5ff",
                      fontFamily: "'Orbitron', sans-serif"
                    },
                    children: item.ext
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
                  "File:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
                    item.filename,
                    item.ext
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1", children: "Which application opens this file type?" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: item.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  type: "button",
                  whileHover: !answered ? { scale: 1.02 } : {},
                  whileTap: !answered ? { scale: 0.98 } : {},
                  onClick: () => handleAnswer(opt),
                  disabled: answered,
                  "data-ocid": "file_types.option",
                  className: `px-4 py-3 rounded-xl border text-sm font-semibold text-center transition-all ${answered && opt === item.correctApp ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]" : "border-border/40 glass-card text-foreground hover:border-[#7c3aed]/50"}`,
                  children: opt
                },
                opt
              )) }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: `px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`,
                  "data-ocid": feedback.ok ? "file_types.success_state" : "file_types.error_state",
                  children: feedback.msg
                }
              )
            ]
          },
          item.id
        ) }) : null
      ]
    }
  );
}
function FileFolderExplorer({ config, onGameEnd }) {
  if (config.gameId === "folder-organizer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PathQuizGame, { config, onGameEnd });
  if (config.gameId === "file-types-quiz")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileTypesQuiz, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FileSortGame, { config, onGameEnd });
}
export {
  FileFolderExplorer as default
};
