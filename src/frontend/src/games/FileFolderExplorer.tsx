import { GlowButton } from "@/components/ui/GlowButton";
import {
  File,
  FileText,
  Film,
  Folder,
  Heart,
  Image,
  Music,
  Package,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "./GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type IconKey = "doc" | "img" | "vid" | "mus" | "prg" | "zip";
function getFileIcon(icon: IconKey, color: string, size = "h-5 w-5") {
  const cls = `${size}`;
  const style = { color };
  if (icon === "doc") return <FileText className={cls} style={style} />;
  if (icon === "img") return <Image className={cls} style={style} />;
  if (icon === "vid") return <Film className={cls} style={style} />;
  if (icon === "mus") return <Music className={cls} style={style} />;
  if (icon === "zip") return <Package className={cls} style={style} />;
  return <File className={cls} style={style} />;
}

// ─── GAME 1: File System Commander ───────────────────────────────────────────
interface FileItem {
  id: string;
  name: string;
  ext: string;
  category: string;
  icon: IconKey;
  color: string;
}
interface FolderSlot {
  id: string;
  label: string;
  category: string;
  color: string;
  files: FileItem[];
}

const FILE_TEMPLATES: Omit<FileItem, "id">[] = [
  {
    name: "Report",
    ext: ".docx",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6",
  },
  {
    name: "Essay",
    ext: ".pdf",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6",
  },
  {
    name: "Notes",
    ext: ".txt",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6",
  },
  {
    name: "Summary",
    ext: ".docx",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6",
  },
  {
    name: "Photo1",
    ext: ".jpg",
    category: "Images",
    icon: "img",
    color: "#10b981",
  },
  {
    name: "Screenshot",
    ext: ".png",
    category: "Images",
    icon: "img",
    color: "#10b981",
  },
  {
    name: "Banner",
    ext: ".jpg",
    category: "Images",
    icon: "img",
    color: "#10b981",
  },
  {
    name: "Wallpaper",
    ext: ".png",
    category: "Images",
    icon: "img",
    color: "#10b981",
  },
  {
    name: "Lecture",
    ext: ".mp4",
    category: "Videos",
    icon: "vid",
    color: "#f59e0b",
  },
  {
    name: "Tutorial",
    ext: ".mp4",
    category: "Videos",
    icon: "vid",
    color: "#f59e0b",
  },
  {
    name: "Clip",
    ext: ".mp4",
    category: "Videos",
    icon: "vid",
    color: "#f59e0b",
  },
  {
    name: "Song1",
    ext: ".mp3",
    category: "Music",
    icon: "mus",
    color: "#7c3aed",
  },
  {
    name: "Podcast",
    ext: ".mp3",
    category: "Music",
    icon: "mus",
    color: "#7c3aed",
  },
  {
    name: "Ringtone",
    ext: ".mp3",
    category: "Music",
    icon: "mus",
    color: "#7c3aed",
  },
  {
    name: "Setup",
    ext: ".exe",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e",
  },
  {
    name: "App",
    ext: ".app",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e",
  },
  {
    name: "Driver",
    ext: ".exe",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e",
  },
  {
    name: "Archive",
    ext: ".zip",
    category: "Documents",
    icon: "zip",
    color: "#3b82f6",
  },
  {
    name: "Readme",
    ext: ".txt",
    category: "Documents",
    icon: "doc",
    color: "#3b82f6",
  },
  {
    name: "Installer",
    ext: ".exe",
    category: "Programs",
    icon: "prg",
    color: "#f43f5e",
  },
];

const FOLDERS: FolderSlot[] = [
  {
    id: "docs",
    label: "Documents",
    category: "Documents",
    color: "#3b82f6",
    files: [],
  },
  {
    id: "imgs",
    label: "Images",
    category: "Images",
    color: "#10b981",
    files: [],
  },
  {
    id: "vids",
    label: "Videos",
    category: "Videos",
    color: "#f59e0b",
    files: [],
  },
  { id: "mus", label: "Music", category: "Music", color: "#7c3aed", files: [] },
  {
    id: "prg",
    label: "Programs",
    category: "Programs",
    color: "#f43f5e",
    files: [],
  },
];

function FileSortGame({ config, onGameEnd }: Props) {
  const fileCount =
    config.difficulty === 1 ? 10 : config.difficulty === 2 ? 15 : 20;
  const [files, setFiles] = useState<FileItem[]>(() =>
    shuffle(FILE_TEMPLATES)
      .slice(0, fileCount)
      .map((f, i) => ({ ...f, id: `f-${i}` })),
  );
  const [folders, setFolders] = useState<FolderSlot[]>(
    FOLDERS.map((f) => ({ ...f, files: [] })),
  );
  const [selected, setSelected] = useState<FileItem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flashFolder, setFlashFolder] = useState<{
    id: string;
    ok: boolean;
  } | null>(null);
  const [placed, setPlaced] = useState(0);
  const [wrong, setWrong] = useState(0);
  const startTimeRef = useRef(Date.now());
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  livesRef.current = lives;
  scoreRef.current = score;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const total = placed + wrong;
      const acc = total > 0 ? (placed / total) * 100 : 0;
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed),
      );
    },
    [config, onGameEnd, gameOver, placed, wrong],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(true),
  );

  function handleFolderClick(folder: FolderSlot) {
    if (!gameStarted || gameOver || !selected) return;
    const correct = selected.category === folder.category;
    setFlashFolder({ id: folder.id, ok: correct });
    setTimeout(() => setFlashFolder(null), 500);
    if (correct) {
      const timeBonus = Math.floor((timeLeft / config.timeLimit) * 50);
      setScore((s) => s + 100 + timeBonus);
      setPlaced((p) => p + 1);
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folder.id ? { ...f, files: [...f.files, selected] } : f,
        ),
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

  const progressPct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="relative w-full h-full flex flex-col select-none"
      data-ocid="file_sort.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 mb-2 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Folder className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 transition-all ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {files.length} left
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-6">
            {timeLeft}s
          </span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            File System Commander
          </h2>
          <p className="text-muted-foreground text-sm mb-1 text-center">
            Click a file, then click the correct folder to organize it.
          </p>
          <p className="text-muted-foreground text-xs mb-6 text-center">
            Wrong folder = lose a life. Sort all {fileCount} files to win.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="file_sort.start_button"
          >
            Start Game
          </GlowButton>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2 shrink-0">
            {folders.map((folder) => {
              const flash = flashFolder?.id === folder.id;
              return (
                <motion.button
                  key={folder.id}
                  type="button"
                  onClick={() => handleFolderClick(folder)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  data-ocid={`file_sort.folder.${folder.id}`}
                  className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    flash
                      ? flashFolder?.ok
                        ? "bg-[#10b981]/20 border-[#10b981]"
                        : "bg-[#f43f5e]/20 border-[#f43f5e]"
                      : "glass-card"
                  }`}
                  style={{
                    borderColor: selected && !flash ? folder.color : undefined,
                  }}
                >
                  <Folder className="h-8 w-8" style={{ color: folder.color }} />
                  <span className="text-xs font-semibold text-foreground">
                    {folder.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {folder.files.length}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <div className="flex-1 overflow-y-auto mt-2">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.button
                    key={file.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() =>
                      setSelected((f) => (f?.id === file.id ? null : file))
                    }
                    data-ocid="file_sort.file_item"
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                      selected?.id === file.id
                        ? "border-[#00f5ff] bg-[#00f5ff]/15 shadow-[0_0_10px_rgba(0,245,255,0.4)]"
                        : "border-border/40 glass-card hover:border-border"
                    }`}
                  >
                    {getFileIcon(file.icon, file.color)}
                    <span className="text-xs text-foreground truncate w-full text-center">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {file.ext}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            {files.length === 0 && (
              <div
                className="flex items-center justify-center h-32 text-[#10b981] font-bold text-lg"
                data-ocid="file_sort.empty_state"
              >
                All files organized!
              </div>
            )}
          </div>
          {selected && (
            <div className="text-center text-xs text-[#00f5ff] animate-pulse mt-1">
              Selected: {selected.name}
              {selected.ext} — click the correct folder
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── GAME 2: Folder Path Quiz ─────────────────────────────────────────────────
interface PathQuestion {
  path: string;
  questions: { q: string; options: string[]; answer: string }[];
}

const PATH_QUESTIONS: PathQuestion[] = [
  {
    path: "C:/Users/Student/Documents/homework.docx",
    questions: [
      {
        q: "What folder contains homework.docx?",
        options: ["Users", "Student", "Documents", "C:"],
        answer: "Documents",
      },
      {
        q: "What is the root drive?",
        options: ["Users", "C:", "Student", "Documents"],
        answer: "C:",
      },
      {
        q: "What is the parent folder of Documents?",
        options: ["Users", "C:", "Student", "homework"],
        answer: "Student",
      },
    ],
  },
  {
    path: "D:/School/Grade5/Science/lab_report.pdf",
    questions: [
      {
        q: "What is the file name?",
        options: ["Grade5", "Science", "lab_report.pdf", "School"],
        answer: "lab_report.pdf",
      },
      {
        q: "What drive is this on?",
        options: ["C:", "D:", "E:", "A:"],
        answer: "D:",
      },
      {
        q: "Which folder directly contains the file?",
        options: ["School", "Grade5", "Science", "D:"],
        answer: "Science",
      },
    ],
  },
  {
    path: "C:/Program Files/Browser/browser.exe",
    questions: [
      {
        q: "What type of file is browser.exe?",
        options: ["Document", "Image", "Executable program", "Music"],
        answer: "Executable program",
      },
      {
        q: "What folder contains the Browser folder?",
        options: ["C:", "System32", "Program Files", "browser.exe"],
        answer: "Program Files",
      },
      {
        q: "What is the extension of the file?",
        options: [".pdf", ".txt", ".exe", ".bat"],
        answer: ".exe",
      },
    ],
  },
  {
    path: "C:/Users/Admin/Desktop/photos/birthday.jpg",
    questions: [
      {
        q: "How many folders deep is birthday.jpg?",
        options: ["2", "3", "4", "5"],
        answer: "4",
      },
      {
        q: "Which user's Desktop is this?",
        options: ["Student", "Guest", "Admin", "System"],
        answer: "Admin",
      },
      {
        q: "What category of file is birthday.jpg?",
        options: ["Document", "Image", "Program", "Video"],
        answer: "Image",
      },
    ],
  },
];

function PathQuizGame({ config, onGameEnd }: Props) {
  const [pathIdx, setPathIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, gameOver],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );
  const progressPct = (timeLeft / config.timeLimit) * 100;

  const allPaths = shuffle([...PATH_QUESTIONS]).slice(
    0,
    config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 4,
  );
  const [paths] = useState(() => allPaths);

  function handleAnswer(option: string) {
    if (feedback || gameOver) return;
    const path = paths[pathIdx];
    const q = path.questions[questionIdx];
    const ok = option === q.answer;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 120 + Math.floor((timeLeft / config.timeLimit) * 80));
      setFeedback({ ok: true, msg: `Correct! "${q.answer}" is right.` });
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
      setFeedback({
        ok: false,
        msg: `Wrong! The correct answer is "${q.answer}".`,
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
  const currentQ = currentPath?.questions[questionIdx];

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="path_quiz.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <Folder className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-1000 xp-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{timeLeft}s</span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Folder Path Quiz
          </h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Read the file path and answer questions about folder structure,
            drives, and file locations.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="path_quiz.start_button"
          >
            Start Quiz
          </GlowButton>
        </motion.div>
      ) : currentQ ? (
        <div className="flex-1 flex flex-col gap-3">
          <div className="glass-card rounded-xl p-3 border border-[#00f5ff]/20">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              File Path
            </p>
            <p className="font-mono text-sm text-[#00f5ff] break-all">
              {currentPath.path}
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Path {pathIdx + 1}/{paths.length} — Q{questionIdx + 1}/
              {currentPath.questions.length}
            </p>
            <p className="font-semibold text-foreground mb-4">{currentQ.q}</p>
            <div className="grid gap-2">
              {currentQ.options.map((opt) => (
                <motion.button
                  key={opt}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  data-ocid="path_quiz.option"
                  className={`text-left px-4 py-3 rounded-lg border text-sm font-mono transition-all ${
                    feedback && opt === currentQ.answer
                      ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]"
                      : "border-border/40 glass-card text-foreground hover:border-[#00f5ff]/40"
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                data-ocid={
                  feedback.ok
                    ? "path_quiz.success_state"
                    : "path_quiz.error_state"
                }
              >
                {feedback.msg}
              </motion.div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── GAME 3: File Types Quiz ──────────────────────────────────────────────────
interface FileTypeItem {
  id: string;
  filename: string;
  ext: string;
  correctApp: string;
  options: string[];
}

const FILE_TYPE_DATA: Omit<FileTypeItem, "id" | "options">[] = [
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
  { filename: "notes", ext: ".txt", correctApp: "Text Editor" },
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
  "Text Editor",
];

function makeFileTypeItems(count: number): FileTypeItem[] {
  return shuffle(FILE_TYPE_DATA)
    .slice(0, count)
    .map((f, i) => {
      const distractors = shuffle(
        ALL_APP_NAMES.filter((a) => a !== f.correctApp),
      ).slice(0, 3);
      return {
        ...f,
        id: `ft-${i}`,
        options: shuffle([f.correctApp, ...distractors]),
      };
    });
}

function FileTypesQuiz({ config, onGameEnd }: Props) {
  const count = config.difficulty === 1 ? 6 : config.difficulty === 2 ? 10 : 12;
  const [items] = useState<FileTypeItem[]>(() => makeFileTypeItems(count));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [answered, setAnswered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  scoreRef.current = score;
  correctRef.current = correct;

  const endGame = useCallback(
    (completed: boolean) => {
      if (gameOver) return;
      setGameOver(true);
      const acc = count > 0 ? (correctRef.current / count) * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          completed,
        ),
      );
    },
    [config, onGameEnd, gameOver, count],
  );

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () =>
    endGame(false),
  );
  const progressPct = (timeLeft / config.timeLimit) * 100;

  function handleAnswer(app: string) {
    if (answered || gameOver) return;
    setAnswered(true);
    const item = items[currentIdx];
    const ok = app === item.correctApp;
    if (ok) {
      setScore((s) => s + 100 + Math.floor((timeLeft / config.timeLimit) * 60));
      setCorrect((c) => c + 1);
      setFeedback({
        ok: true,
        msg: `${item.ext} files open in ${item.correctApp}.`,
      });
    } else {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
      setFeedback({
        ok: false,
        msg: `Wrong. ${item.ext} files open in ${item.correctApp}.`,
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

  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      data-ocid="file_types.page"
    >
      <div className="game-hud flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#00f5ff]">
          <File className="h-4 w-4" />
          <span className="text-lg font-bold">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentIdx + 1}/{count}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full xp-fill transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{timeLeft}s</span>
        </div>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center glass-card rounded-xl p-8"
        >
          <h2
            className="text-2xl font-black glow-cyan-text mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            File Types Quiz
          </h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Each file has an extension — match it to the correct application
            that opens it.
          </p>
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => {
              startTimeRef.current = Date.now();
              setGameStarted(true);
              startTimer();
            }}
            data-ocid="file_types.start_button"
          >
            Start Quiz
          </GlowButton>
        </motion.div>
      ) : item ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="glass-card rounded-xl p-6 flex items-center justify-center border border-[#00f5ff]/20">
              <div className="text-center">
                <div
                  className="text-5xl font-black mb-2"
                  style={{
                    color: "#00f5ff",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  {item.ext}
                </div>
                <p className="text-muted-foreground text-sm">
                  File:{" "}
                  <span className="font-mono text-foreground">
                    {item.filename}
                    {item.ext}
                  </span>
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Which application opens this file type?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {item.options.map((opt) => (
                <motion.button
                  key={opt}
                  type="button"
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(opt)}
                  disabled={answered}
                  data-ocid="file_types.option"
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold text-center transition-all ${
                    answered && opt === item.correctApp
                      ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981]"
                      : "border-border/40 glass-card text-foreground hover:border-[#7c3aed]/50"
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`px-4 py-2 rounded-lg text-sm border ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]" : "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]"}`}
                data-ocid={
                  feedback.ok
                    ? "file_types.success_state"
                    : "file_types.error_state"
                }
              >
                {feedback.msg}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FileFolderExplorer({ config, onGameEnd }: Props) {
  if (config.gameId === "folder-organizer")
    return <PathQuizGame config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "file-types-quiz")
    return <FileTypesQuiz config={config} onGameEnd={onGameEnd} />;
  return <FileSortGame config={config} onGameEnd={onGameEnd} />;
}
