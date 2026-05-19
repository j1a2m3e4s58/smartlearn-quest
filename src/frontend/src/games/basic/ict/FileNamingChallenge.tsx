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

interface Round {
  description: string;
  correct: string;
  choices: string[];
}

const ALL_ROUNDS: Round[] = [
  {
    description: "A holiday photo taken at the beach",
    correct: "beach_photo.jpg",
    choices: [
      "beach_photo.jpg",
      "file1.xyz",
      "BeachHoliday",
      "photo beach.jpg",
    ],
  },
  {
    description: "A Word document containing your CV",
    correct: "curriculum_vitae.docx",
    choices: [
      "curriculum_vitae.docx",
      "cv file.word",
      "my document",
      "cv_doc.txt",
    ],
  },
  {
    description: "A spreadsheet with monthly expenses",
    correct: "monthly_expenses.xlsx",
    choices: [
      "expenses",
      "my file.ex",
      "monthly_expenses.xlsx",
      "expense sheet.doc",
    ],
  },
  {
    description: "A music file — a pop song",
    correct: "song_title.mp3",
    choices: ["song_title.mp3", "music1", "song title.music", "pop_song.jpg"],
  },
  {
    description: "A school project presentation",
    correct: "school_project.pptx",
    choices: [
      "school project",
      "school_project.pptx",
      "presentation.doc",
      "project final",
    ],
  },
  {
    description: "A backup copy of your essay",
    correct: "essay_backup.docx",
    choices: ["backup", "essay_backup.docx", "essay-v2.word", "myEssay"],
  },
  {
    description: "A scanned certificate image",
    correct: "certificate_2024.pdf",
    choices: ["certificate_2024.pdf", "cert.ppt", "scanned image", "doc_scan"],
  },
  {
    description: "Source code for a Python script",
    correct: "calculator.py",
    choices: ["calculator.py", "python file", "calc.java", "script.text"],
  },
  {
    description: "A video recording of a lecture",
    correct: "lecture_recording.mp4",
    choices: [
      "video1",
      "lecture_recording.mp4",
      "class video.avi.mp3",
      "LectureRecording",
    ],
  },
  {
    description: "An icon image for an app",
    correct: "app_icon.png",
    choices: ["app_icon.png", "icon.mp3", "AppIcon.exe", "icon image"],
  },
  {
    description: "A zipped folder of your project files",
    correct: "project_files.zip",
    choices: [
      "project_files.zip",
      "zip file",
      "project.tar.gz.zip",
      "files compressed",
    ],
  },
  {
    description: "A PDF version of a receipt",
    correct: "receipt_2024.pdf",
    choices: ["receipt_2024.pdf", "receipt.doc", "payment.jpg", "receipt file"],
  },
  {
    description: "Your contact list exported from phone",
    correct: "contacts.vcf",
    choices: ["contacts.vcf", "contacts", "phone numbers.txt", "contacts.exe"],
  },
  {
    description: "A high-resolution wallpaper image",
    correct: "wallpaper_1920x1080.jpg",
    choices: [
      "wallpaper_1920x1080.jpg",
      "wallpaper.mp4",
      "image file",
      "bg.exe",
    ],
  },
  {
    description: "A configuration file for an application",
    correct: "settings.json",
    choices: ["settings.json", "config.jpg", "settings file", "app settings"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function FileNamingChallenge({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"start" | "play" | "over">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const startGame = () => {
    setRounds(shuffle(ALL_ROUNDS).slice(0, 15));
    setScore(0);
    setLives(3);
    setRound(0);
    setSelected(null);
    setFeedback(null);
    setPhase("play");
  };

  const handleChoice = useCallback(
    (choice: string) => {
      if (feedback !== null) return;
      const current = rounds[round];
      const correct = choice === current.correct;
      setSelected(choice);
      setFeedback(correct);
      setTimeout(() => {
        const ns = correct ? score + 10 : score;
        const nl = correct ? lives : lives - 1;
        setScore(ns);
        setLives(nl);
        const next = round + 1;
        if (nl <= 0 || next >= rounds.length) {
          setPhase("over");
          onGameEnd(
            buildResult(
              config,
              ns,
              ns > 0 ? Math.min(100, (ns / 150) * 100) : 0,
              0,
              ns >= 80,
            ),
          );
          return;
        }
        setRound(next);
        setSelected(null);
        setFeedback(null);
      }, 700);
    },
    [feedback, round, rounds, score, lives, onGameEnd, config],
  );

  const current = rounds[round];
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {phase === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#00f5ff] mb-3">
              File Naming Challenge
            </h2>
            <p className="text-slate-300 mb-2">
              Select the best file name for each description.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              15 rounds. Good names have an extension and no spaces.
            </p>
            <GlowButton
              onClick={startGame}
              data-ocid="file-naming.start_button"
            >
              Start Game
            </GlowButton>
          </div>
        </div>
      )}
      {phase === "play" && current && (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[#00f5ff] font-bold">Score: {score}</span>
            <span className="text-slate-400">{round + 1}/15</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i <= lives ? "bg-[#f43f5e]" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 max-w-md text-center">
              <p className="text-slate-400 text-sm mb-1">File description:</p>
              <p className="text-white text-lg font-medium">
                {current.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {current.choices.map((choice, idx) => (
                <button
                  key={choice}
                  type="button"
                  data-ocid={`file-naming.choice.${idx + 1}`}
                  onClick={() => handleChoice(choice)}
                  className="px-4 py-3 rounded-xl border font-mono text-sm text-left transition-all"
                  style={{
                    borderColor:
                      selected === choice
                        ? feedback
                          ? "#10b981"
                          : "#f43f5e"
                        : selected && choice === current.correct
                          ? "#10b981"
                          : "#ffffff22",
                    background:
                      selected === choice
                        ? feedback
                          ? "#10b98122"
                          : "#f43f5e22"
                        : selected && choice === current.correct
                          ? "#10b98122"
                          : "#ffffff08",
                    color: "#e2e8f0",
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {phase === "over" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#f59e0b] mb-3">
              Complete!
            </h2>
            <p className="text-4xl font-bold text-white mb-2">{score}</p>
            <p className="text-slate-400 mb-6">out of 150 possible points</p>
            <GlowButton
              onClick={startGame}
              data-ocid="file-naming.restart_button"
            >
              Play Again
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
