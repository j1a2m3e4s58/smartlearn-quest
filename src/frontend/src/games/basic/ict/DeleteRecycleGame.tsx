import { GlowButton } from "@/components/ui/GlowButton";
import React, { useState, useCallback } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
} from "../../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (result: GameResult) => void;
}

interface FileItem {
  name: string;
  description: string;
  shouldDelete: boolean;
}

const FILE_SET: FileItem[] = [
  {
    name: "system32.dll",
    description: "Core Windows system file",
    shouldDelete: false,
  },
  {
    name: "virus_crack.exe",
    description: "Unknown executable from internet",
    shouldDelete: true,
  },
  {
    name: "important_report.docx",
    description: "Your school assignment",
    shouldDelete: false,
  },
  {
    name: "free_money_click_me.exe",
    description: "Downloaded from suspicious email",
    shouldDelete: true,
  },
  {
    name: "myphoto_2024.jpg",
    description: "Your personal photo",
    shouldDelete: false,
  },
  {
    name: "INSTALL_NOW.exe",
    description: "Unsolicited download",
    shouldDelete: true,
  },
  {
    name: "homework_draft.docx",
    description: "Work in progress essay",
    shouldDelete: false,
  },
  {
    name: "keylogger.bat",
    description: "Unknown batch script",
    shouldDelete: true,
  },
  {
    name: "chrome_setup.exe",
    description: "Official Chrome installer from google.com",
    shouldDelete: false,
  },
  {
    name: "win32k_patch.exe",
    description: "Downloaded from random forum",
    shouldDelete: true,
  },
  {
    name: "family_vacation.mp4",
    description: "Personal video memory",
    shouldDelete: false,
  },
  {
    name: "free_antivirus_keygen.exe",
    description: "Pirated software crack",
    shouldDelete: true,
  },
  {
    name: "project_backup.zip",
    description: "Your project archive",
    shouldDelete: false,
  },
  {
    name: "ransomware_decrypt.exe",
    description: "Unfamiliar program asking for admin rights",
    shouldDelete: true,
  },
  {
    name: "contact_list.vcf",
    description: "Saved phone contacts export",
    shouldDelete: false,
  },
  {
    name: "click_here_win_iphone.bat",
    description: "Suspicious script",
    shouldDelete: true,
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function DeleteRecycleGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const startGame = () => {
    setFiles(shuffle(FILE_SET).slice(0, 12));
    setScore(0);
    setLives(3);
    setSelected(new Set());
    setSubmitted(false);
    setPhase("play");
  };

  const toggleSelect = (name: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(name)) s.delete(name);
      else s.add(name);
      return s;
    });
  };

  const handleSubmit = useCallback(() => {
    let pts = 0;
    let lostLives = 0;
    files.forEach((f) => {
      const markedDelete = selected.has(f.name);
      if (markedDelete === f.shouldDelete) pts += 10;
      else lostLives++;
    });
    const nl = Math.max(0, lives - lostLives);
    setScore(pts);
    setLives(nl);
    setSubmitted(true);
    setTimeout(() => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          pts,
          pts > 0 ? Math.min(100, (pts / 120) * 100) : 0,
          0,
          pts >= 80,
        ),
      );
    }, 2000);
  }, [files, selected, lives, onGameEnd, config]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Delete or Keep?
            </h2>
            <p className="text-slate-300 mb-2">
              Select files that should be deleted (sent to Recycle Bin).
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Malicious or suspicious files should be deleted. Keep personal
              files and system files safe.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="delete-recycle.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">
              Select files to delete
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid gap-2">
            {files.map((file, idx) => {
              const isSel = selected.has(file.name);
              const isCorrect = submitted ? isSel === file.shouldDelete : null;
              return (
                <button
                  type="button"
                  key={file.name}
                  data-ocid={`delete-recycle.file.${idx + 1}`}
                  onClick={() => toggleSelect(file.name)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                  style={{
                    borderColor: submitted
                      ? isCorrect
                        ? "#10b981"
                        : "#f43f5e"
                      : isSel
                        ? "#f43f5e"
                        : "#ffffff22",
                    background: submitted
                      ? isCorrect
                        ? "#10b98111"
                        : "#f43f5e11"
                      : isSel
                        ? "#f43f5e11"
                        : "#ffffff05",
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${isSel ? "bg-[#f43f5e] border-[#f43f5e]" : "border-slate-600"}`}
                  >
                    {isSel && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <div>
                    <p className="text-white font-mono text-sm">{file.name}</p>
                    <p className="text-slate-400 text-xs">{file.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {!submitted && (
            <div className="p-4">
              <GlowButton
                onClick={handleSubmit}
                className="w-full"
                data-ocid="delete-recycle.submit_button"
              >
                Submit Selections
              </GlowButton>
            </div>
          )}
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">Results</h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton
              onClick={startGame}
              data-ocid="delete-recycle.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
