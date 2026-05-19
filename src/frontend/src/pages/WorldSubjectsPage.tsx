import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { BASIC_LEVELS, type SubjectDef } from "@/data/basicLevels";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface SubjectCardProps {
  subject: SubjectDef;
  levelId: string;
  index: number;
  onClick: () => void;
}

function SubjectCard({ subject, levelId, index, onClick }: SubjectCardProps) {
  const totalSubGames = subject.categories.reduce(
    (sum, c) => sum + c.subGames.length,
    0,
  );
  const completedSubGames = 0; // TODO: connect to real progress store
  const progress =
    totalSubGames > 0 ? (completedSubGames / totalSubGames) * 100 : 0;
  void levelId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      data-ocid={`world-subjects.card.${index + 1}`}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "oklch(0.08 0.02 260 / 0.85)",
        border: `1px solid ${subject.color}30`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 0 0 ${subject.color}00, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${subject.color}, transparent)`,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${subject.color}14 0%, transparent 70%)`,
        }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `${subject.color}18`,
            border: `1px solid ${subject.color}30`,
          }}
        >
          <svg
            className="h-6 w-6"
            style={{ color: subject.color }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={subject.iconPath} />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3
            className="text-sm font-bold tracking-widest uppercase mb-1"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: subject.color,
            }}
          >
            {subject.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {subject.description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
              {completedSubGames} / {totalSubGames} activities
            </span>
            <span
              className="text-[10px] font-bold"
              style={{ color: subject.color }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: subject.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, delay: index * 0.07 + 0.3 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
            {subject.categories.length} categories
          </span>
          <ChevronRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            style={{ color: subject.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function WorldSubjectsPage() {
  const navigate = useNavigate();
  const { levelId } = useParams({ strict: false }) as { levelId: string };
  const level = BASIC_LEVELS.find((l) => l.id === levelId);

  if (!level) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Level not found.</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-background overflow-hidden"
      data-ocid="world-subjects.page"
    >
      <ParticleBackground count={50} />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(ellipse, ${level.theme.primary} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8 flex-wrap"
          data-ocid="world-subjects.breadcrumb"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/world" })}
            data-ocid="world-subjects.back_button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            SmartLearn Quest
          </button>
          <span className="text-muted-foreground text-xs">/</span>
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: level.theme.primary }}
          >
            {level.name}
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: level.theme.primary,
            }}
          >
            {level.name}
          </h1>
          <p className="text-sm text-muted-foreground">{level.subtitle}</p>
        </motion.div>

        {/* Subject grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="world-subjects.grid"
        >
          {level.subjects.map((subject, i) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              levelId={levelId}
              index={i}
              onClick={() =>
                navigate({
                  to: "/world/$levelId/subject/$subjectId/categories",
                  params: { levelId, subjectId: subject.id },
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
