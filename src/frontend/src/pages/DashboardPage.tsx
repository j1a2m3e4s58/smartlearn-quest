import { Layout } from "@/components/Layout";
import { AchievementBadge } from "@/components/ui/AchievementBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { XPBar } from "@/components/ui/XPBar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllHubProgress,
  useMyProfile,
  useMyProgression,
  useMyRecentScores,
} from "@/hooks/useBackend";
import { GradeLevel } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Clock,
  Coins,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

// ── Animated counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  useEffect(() => {
    const ctrl = animate(mv, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => ctrl.stop();
  }, [value, mv]);
  return <span ref={ref}>0</span>;
}

// ── Grade label ─────────────────────────────────────────────────────────────
const GRADE_LABELS: Record<GradeLevel, string> = {
  [GradeLevel.basic1]: "Basic 1",
  [GradeLevel.basic2]: "Basic 2",
  [GradeLevel.basic3]: "Basic 3",
  [GradeLevel.basic4]: "Basic 4",
  [GradeLevel.basic5]: "Basic 5",
  [GradeLevel.basic6]: "Basic 6",
  [GradeLevel.basic7]: "Basic 7",
  [GradeLevel.basic8]: "Basic 8",
  [GradeLevel.basic9]: "Basic 9",
};

// ── Game name map ────────────────────────────────────────────────────────────
const GAME_NAMES: Record<string, string> = {
  "cursor-precision": "Cursor Precision",
  "keyboard-ninja": "Keyboard Ninja",
  "typing-tournament": "Typing Tournament",
  "file-explorer": "File Explorer",
  "browser-quest": "Browser Quest",
  "shortcut-combat": "Shortcut Combat",
  "drag-maze": "Drag & Drop Maze",
  "double-click-race": "Double-Click Race",
  "phishing-detective": "Phishing Detective",
  "network-router": "Network Router",
};
const gameLabel = (id: string) =>
  GAME_NAMES[id] ??
  id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ── Time formatter ───────────────────────────────────────────────────────────
function fmtTime(ns: bigint) {
  const secs = Number(ns / 1_000_000_000n);
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

// ── Subject config ───────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "ict", name: "ICT", color: "#00f5ff", ring: "#00f5ff" },
  { id: "mathematics", name: "Mathematics", color: "#7c3aed", ring: "#7c3aed" },
  { id: "science", name: "Science", color: "#10b981", ring: "#10b981" },
  { id: "english", name: "English", color: "#f59e0b", ring: "#f59e0b" },
  { id: "robotics", name: "Robotics", color: "#f43f5e", ring: "#f43f5e" },
  {
    id: "criticalThinking",
    name: "Critical Thinking",
    color: "#8b5cf6",
    ring: "#8b5cf6",
  },
] as const;

// ── Achievement config ───────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    id: "first-login",
    name: "First Login",
    desc: "Entered the Knowledge World",
  },
  {
    id: "first-game",
    name: "First Mission",
    desc: "Completed your first game",
  },
  { id: "score-1000", name: "1K Score", desc: "Reached 1,000 points" },
  { id: "streak-3", name: "3-Day Streak", desc: "Played 3 days in a row" },
  { id: "streak-7", name: "Week Warrior", desc: "Played 7 days in a row" },
  { id: "level-5", name: "Level 5", desc: "Reached Commander Level 5" },
  { id: "level-10", name: "Level 10", desc: "Reached Commander Level 10" },
  { id: "hub-complete", name: "Hub Master", desc: "Mastered an entire hub" },
  { id: "perfect-game", name: "Perfect Run", desc: "100% accuracy on a game" },
  { id: "speed-typist", name: "Speed Typist", desc: "Typed 60+ WPM" },
];

// ── Stagger variants ─────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// ── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  sublabel: string;
  icon: React.ReactNode;
  borderColor: string;
  glowColor: string;
  ocid: string;
}
function StatCard({
  label: _label,
  value,
  sublabel,
  icon,
  borderColor,
  glowColor,
  ocid,
}: StatCardProps) {
  return (
    <motion.div
      variants={item}
      className="glass-card rounded-xl p-5 flex flex-col gap-2"
      style={{
        border: `1px solid ${borderColor}44`,
        boxShadow: `0 0 16px ${glowColor}22`,
      }}
      data-ocid={ocid}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-muted-foreground"
          style={{ color: borderColor, opacity: 0.8 }}
        >
          {icon}
        </span>
        <span
          className="text-3xl font-black tabular-nums leading-none"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: borderColor,
            textShadow: `0 0 16px ${glowColor}88`,
          }}
        >
          <AnimatedNumber value={value} />
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {sublabel}
      </p>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: progression, isLoading: progressionLoading } =
    useMyProgression();
  const { data: hubProgress, isLoading: hubLoading } = useAllHubProgress();
  const { data: recentScores, isLoading: scoresLoading } = useMyRecentScores();

  const isLoading =
    profileLoading || progressionLoading || hubLoading || scoresLoading;

  const level = Number(progression?.currentLevel ?? 1n);
  const xp = Number(progression?.xp ?? 0n);
  const coins = Number(progression?.coins ?? 0n);
  const streak = Number(progression?.dailyStreak ?? 0n);
  const xpToNext = level * level * 100;

  // ICT hub completion %
  const ictHubs = hubProgress ?? [];
  const ictPercent =
    ictHubs.length > 0
      ? Math.round(
          ictHubs.reduce((s, h) => s + Number(h.completionPercent), 0) /
            ictHubs.length,
        )
      : 0;
  const ictMastered = ictHubs.filter(
    (h) => Number(h.completionPercent) >= 100,
  ).length;

  const scores = recentScores?.slice(0, 5) ?? [];
  const unlockedSet = new Set(progression?.unlockedAchievements ?? []);
  const grade = profile?.gradeLevel ? GRADE_LABELS[profile.gradeLevel] : null;

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4" data-ocid="dashboard.page">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* ── Header ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-between gap-4 flex-wrap"
            data-ocid="dashboard.header"
          >
            <div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest leading-tight"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "var(--color-cyan)",
                  textShadow:
                    "0 0 24px rgba(0,245,255,0.6), 0 0 48px rgba(0,245,255,0.2)",
                }}
              >
                Command Center
              </h1>
              {profile && (
                <p className="text-muted-foreground text-sm mt-1 font-medium tracking-wide">
                  Welcome back,{" "}
                  <span className="text-foreground font-bold">
                    {profile.username}
                  </span>
                </p>
              )}
            </div>
            {grade && (
              <div
                className="glass-card rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border"
                style={{
                  color: "var(--color-purple)",
                  borderColor: "rgba(124,58,237,0.4)",
                  boxShadow: "0 0 12px rgba(124,58,237,0.2)",
                }}
                data-ocid="dashboard.grade_badge"
              >
                {grade}
              </div>
            )}
          </motion.div>

          {/* ── Stats row ──────────────────────────────────────────────── */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              data-ocid="dashboard.stats_row"
            >
              <StatCard
                label="XP"
                value={xp}
                sublabel="Total XP"
                icon={<Zap className="h-5 w-5" />}
                borderColor="#00f5ff"
                glowColor="#00f5ff"
                ocid="dashboard.stat_xp"
              />
              <StatCard
                label="Level"
                value={level}
                sublabel="Commander Level"
                icon={<TrendingUp className="h-5 w-5" />}
                borderColor="#7c3aed"
                glowColor="#7c3aed"
                ocid="dashboard.stat_level"
              />
              <StatCard
                label="Coins"
                value={coins}
                sublabel="Learning Coins"
                icon={<Coins className="h-5 w-5" />}
                borderColor="#f59e0b"
                glowColor="#f59e0b"
                ocid="dashboard.stat_coins"
              />
              <StatCard
                label="Streak"
                value={streak}
                sublabel="Day Streak"
                icon={<Flame className="h-5 w-5" />}
                borderColor="#10b981"
                glowColor="#10b981"
                ocid="dashboard.stat_streak"
              />
            </motion.div>
          )}

          {/* ── XP Bar ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="glass-card rounded-2xl p-6 neon-top-border"
            data-ocid="dashboard.xp_section"
          >
            <div className="flex items-center gap-2 mb-5">
              <Trophy
                className="h-4 w-4"
                style={{ color: "var(--color-cyan)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{
                  color: "var(--color-cyan)",
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                Experience Progress
              </span>
            </div>
            {progressionLoading ? (
              <Skeleton className="h-16 rounded-xl" />
            ) : (
              <XPBar
                level={level}
                currentXP={xp}
                xpToNext={xpToNext}
                totalXP={xp}
              />
            )}
          </motion.div>

          {/* ── Knowledge Worlds ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            data-ocid="dashboard.worlds_section"
          >
            <h2
              className="text-sm font-black uppercase tracking-widest mb-4"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: "var(--color-cyan)",
              }}
            >
              Knowledge Worlds
            </h2>
            {hubLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {SUBJECTS.map((subj, idx) => {
                  const pct = subj.id === "ict" ? ictPercent : 0;
                  const mastered = subj.id === "ict" ? ictMastered : 0;
                  return (
                    <motion.div
                      key={subj.id}
                      variants={item}
                      custom={idx}
                      className="glass-card rounded-xl p-4 flex flex-col items-center gap-3 text-center border"
                      style={{
                        borderColor: `${subj.color}22`,
                        boxShadow: `0 0 12px ${subj.color}11`,
                      }}
                      data-ocid={`dashboard.world.${idx + 1}`}
                    >
                      <ProgressRing
                        percent={pct}
                        size={72}
                        strokeWidth={6}
                        color={subj.ring}
                      />
                      <div>
                        <p
                          className="text-xs font-bold uppercase tracking-wider leading-tight"
                          style={{
                            fontFamily: "'Orbitron', sans-serif",
                            color: subj.color,
                          }}
                        >
                          {subj.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {mastered} Hub{mastered !== 1 ? "s" : ""} Mastered
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* ── Recent Missions ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="glass-card rounded-2xl p-6"
            data-ocid="dashboard.missions_section"
          >
            <div className="flex items-center gap-2 mb-5">
              <Target
                className="h-4 w-4"
                style={{ color: "var(--color-purple)" }}
              />
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "var(--color-purple)",
                }}
              >
                Recent Missions
              </h2>
            </div>

            {scoresLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
            ) : scores.length === 0 ? (
              <div
                className="flex flex-col items-center gap-3 py-10 text-center"
                data-ocid="dashboard.missions_empty_state"
              >
                <Award className="h-10 w-10 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-sm">
                  No missions completed yet.
                </p>
                <p className="text-muted-foreground text-xs">
                  Start your journey!
                </p>
                <Link
                  to="/world-map"
                  className="mt-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-smooth"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,245,255,0.05))",
                    border: "1px solid rgba(0,245,255,0.35)",
                    color: "var(--color-cyan)",
                  }}
                  data-ocid="dashboard.start_journey_link"
                >
                  Explore World Map
                </Link>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2"
              >
                {scores.map((s, idx) => (
                  <motion.div
                    key={`score-${s.gameId}-${idx}`}
                    variants={item}
                    className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 border"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                    data-ocid={`dashboard.mission.${idx + 1}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: "var(--color-cyan)",
                          boxShadow: "0 0 6px rgba(0,245,255,0.8)",
                        }}
                      />
                      <span className="text-sm font-semibold truncate text-foreground">
                        {gameLabel(s.gameId)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground tabular-nums">
                      <span
                        className="font-bold"
                        style={{ color: "var(--color-gold)" }}
                      >
                        {Number(s.score).toLocaleString()}
                      </span>
                      <span>{Number(s.accuracy)}%</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {fmtTime(s.timeSpent)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* ── Achievements ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            data-ocid="dashboard.achievements_section"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy
                className="h-4 w-4"
                style={{ color: "var(--color-gold)" }}
              />
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: "var(--color-gold)",
                }}
              >
                Achievements
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {ACHIEVEMENTS.map((a, idx) => (
                <AchievementBadge
                  key={a.id}
                  achievementId={a.id}
                  name={a.name}
                  description={a.desc}
                  unlocked={unlockedSet.has(a.id)}
                  animate={unlockedSet.has(a.id)}
                  data-ocid={`dashboard.achievement.${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
