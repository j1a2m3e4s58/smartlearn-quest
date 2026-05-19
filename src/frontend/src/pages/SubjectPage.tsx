import { GlowButton } from "@/components/ui/GlowButton";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { getHubsBySubject, getSubjectById } from "@/data/subjects";
import { useAllHubProgress } from "@/hooks/useBackend";
import type { HubData } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Lock, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

function DifficultyStars({
  max,
  filled,
  color,
}: { max: number; filled: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={`star-${i}`}
          className="h-3 w-3"
          style={{ color: i < filled ? color : undefined }}
          fill={i < filled ? color : "none"}
        />
      ))}
    </div>
  );
}

function HubCard({
  hub,
  index,
  completedGames,
  color,
  onClick,
}: {
  hub: HubData;
  index: number;
  completedGames: number;
  color: string;
  onClick: () => void;
}) {
  const isLocked = !hub.unlocked;
  const isComingSoon = !hub.isPlayable;
  const progressPercent =
    hub.gameCount > 0 ? Math.round((completedGames / hub.gameCount) * 100) : 0;
  const difficultyFilled = hub.minGrade <= 3 ? 1 : hub.minGrade <= 6 ? 2 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={!isLocked && !isComingSoon ? { y: -4, scale: 1.01 } : {}}
      whileTap={!isLocked && !isComingSoon ? { scale: 0.98 } : {}}
      onClick={!isLocked && !isComingSoon ? onClick : undefined}
      data-ocid={`subject.hub.item.${index + 1}`}
      className={[
        "relative rounded-xl overflow-hidden glass-card border transition-smooth group",
        isLocked || isComingSoon
          ? "opacity-55 cursor-default border-border/20"
          : "cursor-pointer border-border/30",
      ].join(" ")}
      style={{
        borderColor: !isLocked && !isComingSoon ? `${color}35` : undefined,
      }}
    >
      {/* Top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: isLocked ? 0.2 : 0.7,
        }}
      />

      {/* Hover glow */}
      {!isLocked && !isComingSoon && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${color}0e 0%, transparent 65%)`,
          }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Progress ring */}
          <div className="shrink-0 mt-0.5">
            {isLocked || isComingSoon ? (
              <div className="w-12 h-12 rounded-full border border-border/30 flex items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <ProgressRing
                percent={progressPercent}
                size={48}
                strokeWidth={3.5}
                color={color}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="text-sm font-bold leading-snug truncate"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: !isLocked && !isComingSoon ? color : undefined,
                }}
              >
                {hub.name}
              </h3>

              {isComingSoon ? (
                <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border border-border/30 text-muted-foreground tracking-widest uppercase">
                  Soon
                </span>
              ) : isLocked ? (
                <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border border-border/30 text-muted-foreground tracking-widest uppercase">
                  Locked
                </span>
              ) : (
                <span
                  className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border tracking-widest uppercase"
                  style={{
                    color,
                    borderColor: `${color}50`,
                    background: `${color}12`,
                  }}
                >
                  Play
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
              {hub.description}
            </p>

            <div className="flex items-center gap-3">
              <DifficultyStars
                max={3}
                filled={difficultyFilled}
                color={color}
              />
              <span className="text-[10px] text-muted-foreground">
                {hub.gameCount} Games
              </span>
              <span className="text-[10px] text-muted-foreground">
                Gr.{hub.minGrade}–{hub.maxGrade}
              </span>
            </div>
          </div>

          {!isLocked && !isComingSoon && (
            <ChevronRight
              className="h-4 w-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SubjectPage() {
  const { subjectId } = useParams({ from: "/subject/$subjectId" });
  const navigate = useNavigate();
  const subject = getSubjectById(subjectId);
  const hubs = getHubsBySubject(subjectId);
  const { data: hubProgress = [] } = useAllHubProgress();

  if (!subject) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="subject.error_state"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Subject not found.</p>
          <GlowButton onClick={() => navigate({ to: "/world-map" })}>
            Return to World Map
          </GlowButton>
        </div>
      </div>
    );
  }

  const getHubProgress = (hubId: string) => {
    const hp = hubProgress.find((h) => h.hubId === hubId);
    return hp ? Number(hp.missionsCompleted) : 0;
  };

  const totalHubs = hubs.length;
  const unlockedPlayable = hubs.filter(
    (h) => h.unlocked && h.isPlayable,
  ).length;
  const subjectProgressPercent =
    totalHubs > 0 ? Math.round((unlockedPlayable / totalHubs) * 100) : 0;

  return (
    <div
      className="relative min-h-screen bg-background"
      data-ocid="subject.page"
    >
      <ParticleBackground count={50} />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-0 right-0 h-64 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${subject.color}25 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/world-map" })}
            data-ocid="subject.back_button"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            World Map
          </button>
        </motion.div>

        {/* Subject header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl border p-6 mb-8"
          style={{ borderColor: `${subject.color}30` }}
          data-ocid="subject.section"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: `${subject.color}15`,
                border: `1.5px solid ${subject.color}40`,
              }}
            >
              <span
                className="text-2xl font-black"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: subject.color,
                }}
              >
                {subject.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: subject.color,
                  }}
                >
                  {subject.name}
                </h1>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-widest uppercase"
                  style={{
                    color: subject.color,
                    borderColor: `${subject.color}50`,
                    background: `${subject.color}15`,
                  }}
                >
                  World
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {subject.description}
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subjectProgressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${subject.color}, ${subject.color}88)`,
                      boxShadow: `0 0 6px ${subject.color}60`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {unlockedPlayable}/{totalHubs} hubs
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <ProgressRing
                percent={subjectProgressPercent}
                size={72}
                strokeWidth={5}
                color={subject.color}
              />
            </div>
          </div>
        </motion.div>

        {/* Hub grid */}
        {hubs.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="subject.hub.list"
          >
            {hubs.map((hub, i) => (
              <HubCard
                key={hub.id}
                hub={hub}
                index={i}
                completedGames={getHubProgress(hub.id)}
                color={subject.color}
                onClick={() =>
                  navigate({ to: "/hub/$hubId", params: { hubId: hub.id } })
                }
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="subject.empty_state"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: `${subject.color}10`,
                border: `1.5px solid ${subject.color}30`,
              }}
            >
              <Zap className="h-10 w-10" style={{ color: subject.color }} />
            </div>
            <h2
              className="text-xl font-black mb-2"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: subject.color,
              }}
            >
              No hubs available
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Content for {subject.name} is being prepared.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
