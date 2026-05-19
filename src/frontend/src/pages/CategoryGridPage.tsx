import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { type Category, getSubjectInLevel } from "@/data/basicLevels";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Lock } from "lucide-react";
import { motion } from "motion/react";

const PLAYER_XP = 500;

interface CategoryCardProps {
  category: Category;
  index: number;
  subjectColor: string;
  isUnlocked: boolean;
  onClick: () => void;
}

function CategoryCard({
  category,
  index,
  subjectColor,
  isUnlocked,
  onClick,
}: CategoryCardProps) {
  const completed = 0; // TODO: real progress
  const total = category.subGames.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={isUnlocked ? { y: -3, scale: 1.02 } : {}}
      whileTap={isUnlocked ? { scale: 0.97 } : {}}
      onClick={isUnlocked ? onClick : undefined}
      data-ocid={`category-grid.card.${index + 1}`}
      className={[
        "relative rounded-xl overflow-hidden",
        isUnlocked ? "cursor-pointer group" : "cursor-not-allowed opacity-50",
      ].join(" ")}
      style={{
        background: "oklch(0.08 0.02 260 / 0.8)",
        border: `1px solid ${isUnlocked ? `${subjectColor}25` : "oklch(0.2 0.02 260)"}`,

        backdropFilter: "blur(10px)",
      }}
    >
      {/* Hover glow */}
      {isUnlocked && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${subjectColor}10 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-xs font-bold tracking-wider uppercase leading-snug max-w-[80%]"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: isUnlocked ? subjectColor : "oklch(0.4 0.02 260)",
            }}
          >
            {category.name}
          </h3>
          {!isUnlocked ? (
            <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight
              className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
              style={{ color: subjectColor }}
            />
          )}
        </div>

        <p className="text-[10px] text-muted-foreground leading-snug mb-3 line-clamp-2">
          {category.description}
        </p>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-muted-foreground tracking-wider uppercase">
              {completed}/{total} completed
            </span>
          </div>
          <div className="h-0.5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: subjectColor }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoryGridPage() {
  const navigate = useNavigate();
  const { levelId, subjectId } = useParams({ strict: false }) as {
    levelId: string;
    subjectId: string;
  };

  const subject = getSubjectInLevel(levelId, subjectId);

  if (!subject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Subject not found.</p>
      </div>
    );
  }

  const isUnlocked = (_idx: number) => PLAYER_XP >= 0; // All visible; sub-games have XP gates

  return (
    <div
      className="relative min-h-screen bg-background overflow-hidden"
      data-ocid="category-grid.page"
    >
      <ParticleBackground count={40} />

      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${subject.color}0c 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8 flex-wrap"
          data-ocid="category-grid.breadcrumb"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/world" })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="category-grid.home_link"
          >
            SmartLearn Quest
          </button>
          <span className="text-muted-foreground text-xs">/</span>
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/world/$levelId/subjects", params: { levelId } })
            }
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="category-grid.level_link"
          >
            {levelId.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
          <span className="text-muted-foreground text-xs">/</span>
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: subject.color }}
          >
            {subject.name}
          </span>
        </motion.div>

        {/* Back + header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/world/$levelId/subjects", params: { levelId } })
            }
            data-ocid="category-grid.back_button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <div>
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: subject.color,
              }}
            >
              {subject.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subject.categories.length} categories — select one to explore its
              missions
            </p>
          </div>
        </div>

        {/* Category grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          data-ocid="category-grid.list"
        >
          {subject.categories.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              subjectColor={subject.color}
              isUnlocked={isUnlocked(i)}
              onClick={() =>
                navigate({
                  to: "/world/$levelId/subject/$subjectId/category/$categoryId",
                  params: { levelId, subjectId, categoryId: category.id },
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
