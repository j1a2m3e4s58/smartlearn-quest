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

type FolderName = "Documents" | "Images" | "Music" | "Videos";
const FILES: { name: string; folder: FolderName }[] = [
  { name: "report.docx", folder: "Documents" },
  { name: "photo.jpg", folder: "Images" },
  { name: "song.mp3", folder: "Music" },
  { name: "movie.mp4", folder: "Videos" },
  { name: "notes.txt", folder: "Documents" },
  { name: "selfie.png", folder: "Images" },
  { name: "podcast.mp3", folder: "Music" },
  { name: "tutorial.avi", folder: "Videos" },
  { name: "essay.docx", folder: "Documents" },
  { name: "banner.gif", folder: "Images" },
  { name: "ringtone.wav", folder: "Music" },
  { name: "lecture.mp4", folder: "Videos" },
  { name: "resume.pdf", folder: "Documents" },
  { name: "logo.png", folder: "Images" },
  { name: "album.flac", folder: "Music" },
  { name: "clip.mov", folder: "Videos" },
  { name: "letter.docx", folder: "Documents" },
  { name: "icon.ico", folder: "Images" },
  { name: "track.ogg", folder: "Music" },
  { name: "reel.mp4", folder: "Videos" },
];
const FOLDERS: FolderName[] = ["Documents", "Images", "Music", "Videos"];
const FOLDER_COLORS: Record<FolderName, string> = {
  Documents: "#00f5ff",
  Images: "#10b981",
  Music: "#f59e0b",
  Videos: "#f43f5e",
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function FolderSortGame({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<typeof FILES>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [flash, setFlash] = useState<{
    folder: FolderName;
    ok: boolean;
  } | null>(null);

  const startGame = () => {
    setItems(shuffle(FILES).slice(0, 20));
    setScore(0);
    setLives(3);
    setPhase("play");
  };

  const handleDrop = useCallback(
    (folder: FolderName) => {
      if (!dragging) return;
      const item = items.find((f) => f.name === dragging);
      if (!item) return;
      const correct = item.folder === folder;
      setFlash({ folder, ok: correct });
      setTimeout(() => setFlash(null), 500);
      if (correct) {
        const ns = score + 10;
        setScore(ns);
        const rem = items.filter((f) => f.name !== dragging);
        setItems(rem);
        if (rem.length === 0) {
          setPhase("over");
          onGameEnd(buildResult(config, ns, 100, 0, true));
        }
      } else {
        const nl = lives - 1;
        setLives(nl);
        if (nl <= 0) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              score,
              score > 0 ? Math.min(100, (score / 200) * 100) : 0,
              0,
              false,
            ),
          );
        }
      }
      setDragging(null);
    },
    [dragging, items, score, lives, onGameEnd, config],
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              Folder Sort
            </h2>
            <p className="text-slate-300 mb-2">
              Drag each file to the correct folder category.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Correct drop = +10 pts. Wrong = lose 1 life. 20 files total.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="folder-sort.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
            <span className="text-slate-400">{items.length} left</span>
          </div>
          <div className="flex flex-wrap gap-2 p-4 justify-center">
            {items.map((file, idx) => (
              <div
                key={file.name}
                data-ocid={`folder-sort.file.${idx + 1}`}
                draggable
                onDragStart={() => setDragging(file.name)}
                onDragEnd={() => setDragging(null)}
                className="px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-sm cursor-grab active:cursor-grabbing select-none hover:bg-white/20 transition-all font-mono"
              >
                {file.name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 mt-auto">
            {FOLDERS.map((folder) => (
              <div
                key={folder}
                data-ocid={`folder-sort.folder.${folder.toLowerCase()}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(folder)}
                className="h-20 rounded-xl border-2 flex items-center justify-center font-bold transition-all"
                style={{
                  borderColor:
                    flash?.folder === folder
                      ? flash.ok
                        ? "#10b981"
                        : "#f43f5e"
                      : `${FOLDER_COLORS[folder]}55`,
                  background:
                    flash?.folder === folder
                      ? flash.ok
                        ? "#10b98122"
                        : "#f43f5e22"
                      : `${FOLDER_COLORS[folder]}11`,
                  color: FOLDER_COLORS[folder],
                }}
              >
                {folder}
              </div>
            ))}
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Game Over
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">points scored</p>
            <GlowButton
              onClick={startGame}
              data-ocid="folder-sort.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
