import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  xp: number;
  coins: number;
  gameId: string;
  hubId: string;
  subjectId: string;
  timestamp: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
}

interface LeaderboardActions {
  addEntry: (entry: LeaderboardEntry) => void;
  getTopEntriesByGame: (gameId: string, limit?: number) => LeaderboardEntry[];
  getTopEntriesBySubject: (
    subjectId: string,
    limit?: number,
  ) => LeaderboardEntry[];
  getGlobalTop: (limit?: number) => LeaderboardEntry[];
  clearAll: () => void;
}

export const useLeaderboardStore = create<
  LeaderboardState & LeaderboardActions
>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => ({ entries: [...state.entries, entry] })),

      getTopEntriesByGame: (gameId, limit = 10) =>
        get()
          .entries.filter((e) => e.gameId === gameId)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit),

      getTopEntriesBySubject: (subjectId, limit = 10) =>
        get()
          .entries.filter((e) => e.subjectId === subjectId)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit),

      getGlobalTop: (limit = 10) =>
        get()
          .entries.sort((a, b) => b.score - a.score)
          .slice(0, limit),

      clearAll: () => set({ entries: [] }),
    }),
    { name: "smartlearn-leaderboard" },
  ),
);
