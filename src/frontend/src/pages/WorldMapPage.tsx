import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { SUBJECTS } from "@/data/subjects";
import { useAllHubProgress } from "@/hooks/useBackend";
import type { SubjectData } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  Brain,
  Calculator,
  ChevronRight,
  FlaskConical,
  Globe,
  Lock,
  Monitor,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const ICONS: Record<
  string,
  React.ComponentType<{
    className?: string;
    size?: number;
    style?: React.CSSProperties;
  }>
> = {
  Monitor,
  Calculator,
  FlaskConical,
  BookOpen,
  Bot,
  Brain,
};

// Asymmetric layout positions for a cinematic, non-grid arrangement
const CARD_POSITIONS = [
  { col: "lg:col-start-1 lg:col-span-2", order: 1 },
  { col: "lg:col-start-3 lg:col-span-2", order: 2 },
  { col: "lg:col-start-5 lg:col-span-2", order: 3 },
  { col: "lg:col-start-2 lg:col-span-2", order: 4 },
  { col: "lg:col-start-4 lg:col-span-2", order: 5 },
  { col: "lg:col-start-3 lg:col-span-2", order: 6 },
];

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  ict: "Information & Communications Technology",
  mathematics: "Mathematics",
  science: "Science",
  english: "English Language",
  robotics: "Robotics & Engineering",
  criticalThinking: "Critical Thinking",
};

interface SubjectNodeProps {
  subject: SubjectData;
  index: number;
  completedHubs: number;
  onClick: () => void;
}

function SubjectNode({
  subject,
  index,
  completedHubs,
  onClick,
}: SubjectNodeProps) {
  const Icon = ICONS[subject.icon] ?? Monitor;
  const progressPercent =
    subject.hubCount > 0
      ? Math.round((completedHubs / subject.hubCount) * 100)
      : 0;
  const isLocked = !subject.unlocked;

  const handleClick = () => {
    if (isLocked) {
      toast.error("World Locked", {
        description: "Complete the previous world to unlock this dimension.",
      });
      return;
    }
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={!isLocked ? { y: -6, scale: 1.02 } : { scale: 1.01 }}
      whileTap={!isLocked ? { scale: 0.97 } : {}}
      onClick={handleClick}
      data-ocid={`world-map.subject.item.${index + 1}`}
      className={[
        "relative group rounded-2xl overflow-hidden transition-smooth",
        "glass-card border",
        isLocked
          ? "cursor-not-allowed opacity-50 border-border/20"
          : "cursor-pointer border-border/30 hover:border-opacity-60",
      ].join(" ")}
      style={{
        borderColor: !isLocked ? `${subject.color}40` : undefined,
        boxShadow: !isLocked
          ? `0 0 0 0 ${subject.color}00, inset 0 1px 0 rgba(255,255,255,0.06)`
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${subject.color}, transparent)`,
          opacity: isLocked ? 0.3 : 0.8,
        }}
      />

      {/* Hover glow overlay */}
      {!isLocked && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${subject.color}12 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-sm z-10 rounded-2xl">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground text-center px-4">
            Complete previous world to unlock
          </p>
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        {/* Icon + progress row */}
        <div className="flex items-start justify-between">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${subject.color}18`,
              border: `1px solid ${subject.color}30`,
            }}
          >
            <Icon className="h-6 w-6" style={{ color: subject.color }} />
          </div>
          <ProgressRing
            percent={progressPercent}
            size={52}
            strokeWidth={4}
            color={subject.color}
            label={`${completedHubs}/${subject.hubCount}`}
          />
        </div>

        {/* Text */}
        <div>
          <h2
            className="text-sm font-bold tracking-widest uppercase mb-1"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: !isLocked ? subject.color : undefined,
            }}
          >
            {subject.name}
          </h2>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {SUBJECT_DESCRIPTIONS[subject.id]}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-1 border-t border-border/20">
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
            {completedHubs} of {subject.hubCount} Hubs Mastered
          </span>
          {!isLocked && (
            <ChevronRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
              style={{ color: subject.color }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function WorldMapPage() {
  const navigate = useNavigate();
  const { data: hubProgress = [] } = useAllHubProgress();

  const getCompletedHubs = (subjectId: string) => {
    return hubProgress.filter((hp) => hp.hubId?.startsWith(subjectId)).length;
  };

  return (
    <div
      className="relative min-h-screen bg-background overflow-hidden"
      data-ocid="world-map.page"
    >
      <ParticleBackground count={80} />

      {/* Deep radial ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,245,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, rgba(124,58,237,0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
          data-ocid="world-map.section"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-5">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
              Knowledge Dimensions
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-gradient-cyan"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            SmartLearn Quest
          </h1>

          {/* Story intro */}
          <div className="max-w-2xl mx-auto glass rounded-xl p-5 border border-border/30">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              The Knowledge Dimensions have been shattered. Restore intelligence
              to civilization by mastering the ancient arts of
              <span className="text-primary font-medium"> computing</span>,
              <span className="text-accent font-medium"> mathematics</span>,
              <span style={{ color: "#10b981" }} className="font-medium">
                {" "}
                science
              </span>
              , and more. Each world you conquer unlocks the next dimension. The
              fate of civilization rests on your mastery.
            </p>
          </div>
        </motion.div>

        {/* World grid — responsive asymmetric layout */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5"
          data-ocid="world-map.list"
        >
          {SUBJECTS.map((subject, i) => (
            <div key={subject.id} className={`${CARD_POSITIONS[i]?.col ?? ""}`}>
              <SubjectNode
                subject={subject}
                index={i}
                completedHubs={
                  subject.completedHubs + getCompletedHubs(subject.id)
                }
                onClick={() =>
                  navigate({
                    to: "/subject/$subjectId",
                    params: { subjectId: subject.id },
                  })
                }
              />
            </div>
          ))}
        </div>

        {/* GES Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="fixed bottom-4 right-4 z-20"
          data-ocid="world-map.ges-badge"
        >
          <div className="glass rounded-lg px-3 py-2 border border-border/30 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground max-w-[160px] leading-tight">
              Aligned with Ghana Education Service Basic 1–9 Curriculum
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
