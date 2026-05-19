import { ParticleBackground } from "@/components/ui/ParticleBackground";
import {
  type SubGame,
  getCategoryInSubject,
  getSubjectInLevel,
} from "@/data/basicLevels";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { motion } from "motion/react";

const PLAYER_XP = 500;

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

function DifficultyStars({ difficulty }: { difficulty: 1 | 2 | 3 }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Difficulty: ${DIFFICULTY_LABELS[difficulty]}`}
    >
      {Array.from({ length: 3 }, (_, i) => (
        <svg
          key={i}
          className="h-2.5 w-2.5"
          viewBox="0 0 10 10"
          aria-hidden="true"
          fill={i < difficulty ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
        >
          <rect x="1" y="1" width="8" height="8" rx="1.5" />
        </svg>
      ))}
    </div>
  );
}

interface SubGameCardProps {
  subGame: SubGame;
  index: number;
  subjectColor: string;
  isUnlocked: boolean;
  onClick: () => void;
}

function SubGameCard({
  subGame,
  index,
  subjectColor,
  isUnlocked,
  onClick,
}: SubGameCardProps) {
  const hasGame = subGame.gameId !== null;
  const isPlayable = isUnlocked && hasGame;
  const isFuture = !hasGame;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={isPlayable ? { y: -3, scale: 1.03 } : {}}
      whileTap={isPlayable ? { scale: 0.97 } : {}}
      onClick={isPlayable ? onClick : undefined}
      data-ocid={`sub-game-grid.card.${index + 1}`}
      className={[
        "relative rounded-xl overflow-hidden",
        isPlayable ? "cursor-pointer group" : "cursor-default",
        !isUnlocked || isFuture ? "opacity-55" : "",
      ].join(" ")}
      style={{
        background: "oklch(0.09 0.02 260 / 0.85)",
        border: `1px solid ${isPlayable ? `${subjectColor}28` : "oklch(0.18 0.02 260)"}`,
        backdropFilter: "blur(8px)",
        minHeight: 130,
      }}
    >
      {/* Number badge */}
      <div
        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
        style={{
          background: isPlayable ? `${subjectColor}20` : "oklch(0.15 0.02 260)",
          color: isPlayable ? subjectColor : "oklch(0.4 0.02 260)",
          border: `1px solid ${isPlayable ? `${subjectColor}30` : "oklch(0.2 0.02 260)"}`,
        }}
      >
        {index + 1}
      </div>

      {/* Hover glow */}
      {isPlayable && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${subjectColor}12 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="p-3 flex flex-col gap-2 h-full">
        {/* State icon */}
        <div className="flex items-start gap-2">
          <div
            className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{
              background: isPlayable
                ? `${subjectColor}18`
                : "oklch(0.12 0.02 260)",
              border: `1px solid ${isPlayable ? `${subjectColor}28` : "oklch(0.18 0.02 260)"}`,
            }}
          >
            {!isUnlocked ? (
              <Lock className="h-3 w-3 text-muted-foreground" />
            ) : isFuture ? (
              <svg
                className="h-3 w-3 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ) : (
              <svg
                className="h-3 w-3"
                style={{ color: subjectColor }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className="text-[11px] font-bold leading-snug line-clamp-2 pr-5"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: isPlayable ? subjectColor : "oklch(0.5 0.03 260)",
              }}
            >
              {subGame.title}
            </h4>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2 flex-1">
          {isFuture ? "Coming in a future update" : subGame.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/15">
          <DifficultyStars difficulty={subGame.difficulty} />
          {!isUnlocked && (
            <span className="text-[9px] text-muted-foreground tracking-wider">
              {subGame.unlockAtXP} XP
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SubGameGridPage() {
  const navigate = useNavigate();
  const { levelId, subjectId, categoryId } = useParams({ strict: false }) as {
    levelId: string;
    subjectId: string;
    categoryId: string;
  };

  const subject = getSubjectInLevel(levelId, subjectId);
  const category = getCategoryInSubject(levelId, subjectId, categoryId);

  if (!subject || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  const isUnlocked = (sg: SubGame) => PLAYER_XP >= sg.unlockAtXP;

  return (
    <div
      className="relative min-h-screen bg-background overflow-hidden"
      data-ocid="sub-game-grid.page"
    >
      <ParticleBackground count={30} />

      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${subject.color}0a 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8 flex-wrap"
          aria-label="Breadcrumb"
          data-ocid="sub-game-grid.breadcrumb"
        >
          {[
            { label: "Home", action: () => navigate({ to: "/world" }) },
            {
              label: levelId
                .replace("-", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
              action: () =>
                navigate({
                  to: "/world/$levelId/subjects",
                  params: { levelId },
                }),
            },
            {
              label: subject.name,
              action: () =>
                navigate({
                  to: "/world/$levelId/subject/$subjectId/categories",
                  params: { levelId, subjectId },
                }),
            },
          ].map(({ label, action }, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-muted-foreground text-xs">/</span>
              )}
              <button
                type="button"
                onClick={action}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </button>
            </span>
          ))}
          <span className="text-muted-foreground text-xs">/</span>
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: subject.color }}
          >
            {category.name}
          </span>
        </motion.nav>

        {/* Back + header */}
        <div className="flex items-start gap-4 mb-8">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/world/$levelId/subject/$subjectId/categories",
                params: { levelId, subjectId },
              })
            }
            data-ocid="sub-game-grid.back_button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
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
              {category.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {category.description}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wider uppercase">
              {category.subGames.length} missions — earn XP to unlock advanced
              stages
            </p>
          </div>
        </div>

        {/* 5×3 sub-game grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          data-ocid="sub-game-grid.list"
        >
          {category.subGames.map((sg, i) => (
            <SubGameCard
              key={sg.id}
              subGame={sg}
              index={i}
              subjectColor={subject.color}
              isUnlocked={isUnlocked(sg)}
              onClick={() => {
                if (sg.gameId) {
                  navigate({
                    to: "/game/$gameId",
                    params: { gameId: sg.gameId },
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
