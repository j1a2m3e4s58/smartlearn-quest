import { useLeaderboardStore } from "@/stores/useLeaderboardStore";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type LeaderboardScope = "game" | "subject" | "global";

interface LeaderboardPanelProps {
  scope: LeaderboardScope;
  scopeId?: string;
  onClose: () => void;
}

// ─── Rank badge ───────────────────────────────────────────────────────────────

const RANK_STYLES: Record<
  number,
  { color: string; shadow: string; border: string; bg: string }
> = {
  1: {
    color: "oklch(0.82 0.2 85)",
    shadow: "0 0 16px oklch(0.82 0.2 85 / 0.7)",
    border: "oklch(0.82 0.2 85 / 0.5)",
    bg: "oklch(0.14 0.04 80 / 0.8)",
  },
  2: {
    color: "oklch(0.78 0.04 255)",
    shadow: "0 0 12px oklch(0.78 0.04 255 / 0.5)",
    border: "oklch(0.6 0.04 255 / 0.4)",
    bg: "oklch(0.12 0.02 265 / 0.8)",
  },
  3: {
    color: "oklch(0.72 0.12 50)",
    shadow: "0 0 12px oklch(0.72 0.12 50 / 0.6)",
    border: "oklch(0.6 0.1 50 / 0.4)",
    bg: "oklch(0.12 0.03 50 / 0.8)",
  },
};

const DEFAULT_RANK_STYLE = {
  color: "oklch(0.55 0.02 255)",
  shadow: "none",
  border: "oklch(0.2 0.02 265 / 0.3)",
  bg: "oklch(0.10 0.015 265 / 0.6)",
};

function RankBadge({ rank }: { rank: number }) {
  const style = RANK_STYLES[rank] ?? DEFAULT_RANK_STYLE;
  return (
    <div
      style={{
        minWidth: "36px",
        height: "36px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: style.shadow,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
          fontSize: "13px",
          fontWeight: 900,
          color: style.color,
          textShadow: style.shadow,
          letterSpacing: "0.02em",
        }}
      >
        {rank}
      </span>
    </div>
  );
}

// ─── Entry row ───────────────────────────────────────────────────────────────

interface EntryData {
  id: string;
  playerName: string;
  score: number;
  xp: number;
  coins: number;
  timestamp: number;
}

function EntryRow({
  entry,
  rank,
  index,
}: { entry: EntryData; rank: number; index: number }) {
  const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const isTop3 = rank <= 3;
  const rankStyle = RANK_STYLES[rank] ?? DEFAULT_RANK_STYLE;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      data-ocid={`leaderboard.item.${rank}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "10px",
        background: isTop3
          ? "oklch(0.11 0.02 265 / 0.7)"
          : "oklch(0.09 0.015 265 / 0.5)",
        border: isTop3
          ? `1px solid ${rankStyle.border}`
          : "1px solid oklch(0.16 0.02 265 / 0.4)",
        backdropFilter: "blur(8px)",
        transition: "background 0.2s",
      }}
    >
      <RankBadge rank={rank} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: isTop3 ? rankStyle.color : "oklch(0.88 0.01 255)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {entry.playerName}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "oklch(0.45 0.02 255)",
            marginTop: "2px",
          }}
        >
          {date}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "2px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
            fontSize: "15px",
            fontWeight: 900,
            color: "oklch(0.88 0.14 194)",
            letterSpacing: "0.03em",
          }}
        >
          {entry.score.toLocaleString()}
        </span>
        <div
          style={{
            display: "flex",
            gap: "8px",
            fontSize: "10px",
            color: "oklch(0.5 0.02 255)",
          }}
        >
          <span>{entry.xp} XP</span>
          <span>{entry.coins} coins</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

const SCOPE_LABELS: Record<LeaderboardScope, string> = {
  game: "Top Scores — This Game",
  subject: "Top Scores — This Subject",
  global: "Global Leaderboard",
};

export function LeaderboardPanel({
  scope,
  scopeId,
  onClose,
}: LeaderboardPanelProps) {
  const store = useLeaderboardStore();

  const entries = useMemo(() => {
    if (scope === "game" && scopeId)
      return store.getTopEntriesByGame(scopeId, 10);
    if (scope === "subject" && scopeId)
      return store.getTopEntriesBySubject(scopeId, 10);
    return store.getGlobalTop(10);
  }, [scope, scopeId, store]);

  return (
    <AnimatePresence>
      <motion.div
        key="lb-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        data-ocid="leaderboard.backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "oklch(0 0 0 / 0.65)",
          zIndex: 8800,
          backdropFilter: "blur(4px)",
        }}
      />
      <motion.div
        key="lb-panel"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.35, ease: "backOut" }}
        data-ocid="leaderboard.panel"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 8900,
          width: "min(480px, calc(100vw - 32px))",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          background: "oklch(0.08 0.02 265 / 0.97)",
          border: "1px solid oklch(0.65 0.2 194 / 0.3)",
          borderRadius: "20px",
          boxShadow:
            "0 0 60px oklch(0.65 0.2 194 / 0.15), 0 32px 64px oklch(0 0 0 / 0.6)",
          backdropFilter: "blur(24px)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid oklch(0.16 0.025 265 / 0.6)",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
                fontSize: "1rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "oklch(0.88 0.14 194)",
                textShadow: "0 0 20px oklch(0.78 0.2 194 / 0.4)",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {SCOPE_LABELS[scope]}
            </h2>
            <p
              style={{
                fontSize: "11px",
                color: "oklch(0.45 0.02 255)",
                marginTop: "4px",
                letterSpacing: "0.05em",
              }}
            >
              {entries.length === 0
                ? "No entries yet"
                : `${entries.length} ranked players`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="leaderboard.close_button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "oklch(0.14 0.02 265 / 0.8)",
              border: "1px solid oklch(0.2 0.02 265 / 0.5)",
              cursor: "pointer",
              color: "oklch(0.6 0.02 255)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            aria-label="Close leaderboard"
          >
            <X size={16} />
          </button>
        </div>

        {/* Entry list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="leaderboard.empty_state"
              style={{
                textAlign: "center",
                padding: "48px 24px",
                color: "oklch(0.4 0.02 255)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "oklch(0.12 0.02 265)",
                  border: "1px solid oklch(0.2 0.02 265)",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "2px solid oklch(0.3 0.02 265)",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                No scores yet
              </p>
              <p style={{ fontSize: "12px", marginTop: "6px" }}>
                Complete a game to appear here
              </p>
            </motion.div>
          ) : (
            entries.map((entry, i) => (
              <EntryRow key={entry.id} entry={entry} rank={i + 1} index={i} />
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid oklch(0.16 0.025 265 / 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "oklch(0.35 0.02 265)",
              textTransform: "uppercase",
            }}
          >
            SmartLearn Quest
          </span>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "oklch(0.78 0.2 190)",
              boxShadow: "0 0 8px oklch(0.78 0.2 190 / 0.6)",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
