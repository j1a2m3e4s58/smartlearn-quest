import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  condition: string;
}

export const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_game",
    title: "First Steps",
    description: "Complete your first game.",
    xpReward: 50,
    coinReward: 20,
    condition: "Complete 1 game",
  },
  {
    id: "perfect_score",
    title: "Flawless Victory",
    description: "Finish a game with a perfect score.",
    xpReward: 200,
    coinReward: 100,
    condition: "100% accuracy in one game",
  },
  {
    id: "combo_5",
    title: "Combo Starter",
    description: "Hit a 5-answer combo streak.",
    xpReward: 75,
    coinReward: 30,
    condition: "5 consecutive correct answers",
  },
  {
    id: "combo_10",
    title: "Combo Master",
    description: "Hit a 10-answer combo streak.",
    xpReward: 150,
    coinReward: 75,
    condition: "10 consecutive correct answers",
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Log in and play for 7 days in a row.",
    xpReward: 300,
    coinReward: 150,
    condition: "7-day login streak",
  },
  {
    id: "all_ict",
    title: "ICT Graduate",
    description: "Complete all ICT hubs.",
    xpReward: 500,
    coinReward: 250,
    condition: "Finish every ICT hub",
  },
  {
    id: "all_math",
    title: "Math Champion",
    description: "Complete all Mathematics hubs.",
    xpReward: 500,
    coinReward: 250,
    condition: "Finish every Math hub",
  },
  {
    id: "all_science",
    title: "Science Pioneer",
    description: "Complete all Science hubs.",
    xpReward: 500,
    coinReward: 250,
    condition: "Finish every Science hub",
  },
  {
    id: "all_english",
    title: "Wordsmith",
    description: "Complete all English hubs.",
    xpReward: 500,
    coinReward: 250,
    condition: "Finish every English hub",
  },
  {
    id: "all_robotics",
    title: "Robot Engineer",
    description: "Complete all Robotics hubs.",
    xpReward: 500,
    coinReward: 250,
    condition: "Finish every Robotics hub",
  },
  {
    id: "all_critical",
    title: "Critical Thinker",
    description: "Complete all Critical Thinking hubs.",
    xpReward: 500,
    coinReward: 250,
    condition: "Finish every Critical Thinking hub",
  },
  {
    id: "level_up_3",
    title: "Rising Star",
    description: "Reach level 3.",
    xpReward: 200,
    coinReward: 100,
    condition: "Attain player level 3",
  },
  {
    id: "boss_beaten",
    title: "Boss Slayer",
    description: "Defeat your first boss battle.",
    xpReward: 400,
    coinReward: 200,
    condition: "Win a boss battle",
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Complete a game under 30 seconds.",
    xpReward: 150,
    coinReward: 60,
    condition: "Finish any game in < 30s",
  },
  {
    id: "no_hints",
    title: "Solo Scholar",
    description: "Finish a game without using any hints.",
    xpReward: 100,
    coinReward: 50,
    condition: "No hints used in one game",
  },
  {
    id: "early_learner",
    title: "Early Learner",
    description: "Play before 8AM local time.",
    xpReward: 80,
    coinReward: 40,
    condition: "Play between midnight and 8AM",
  },
  {
    id: "explorer",
    title: "World Explorer",
    description: "Visit all 6 subject worlds.",
    xpReward: 250,
    coinReward: 125,
    condition: "Enter ICT, Math, Science, English, Robotics, Critical Thinking",
  },
  {
    id: "collector",
    title: "Collector",
    description: "Unlock 10 achievements.",
    xpReward: 350,
    coinReward: 175,
    condition: "Unlock 10 distinct achievements",
  },
  {
    id: "champion",
    title: "Champion",
    description: "Reach the top of the global leaderboard.",
    xpReward: 1000,
    coinReward: 500,
    condition: "Hold #1 in global leaderboard",
  },
  {
    id: "legend",
    title: "Legend",
    description: "Unlock every achievement.",
    xpReward: 2000,
    coinReward: 1000,
    condition: "Unlock all 20 achievements",
  },
];

interface AchievementState {
  unlockedIds: string[];
  pendingUnlock: AchievementDefinition | null;
}

interface AchievementActions {
  unlock: (achievement: AchievementDefinition) => void;
  dismissPending: () => void;
  isUnlocked: (id: string) => boolean;
}

export const useAchievementStore = create<
  AchievementState & AchievementActions
>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      pendingUnlock: null,

      unlock: (achievement) => {
        const { unlockedIds } = get();
        if (unlockedIds.includes(achievement.id)) return;
        set({
          unlockedIds: [...unlockedIds, achievement.id],
          pendingUnlock: achievement,
        });
      },

      dismissPending: () => set({ pendingUnlock: null }),

      isUnlocked: (id) => get().unlockedIds.includes(id),
    }),
    { name: "smartlearn-achievements" },
  ),
);
