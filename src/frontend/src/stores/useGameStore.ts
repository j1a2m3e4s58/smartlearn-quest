import { create } from "zustand";

interface GameState {
  currentGameId: string | null;
  score: number;
  accuracy: number;
  lives: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  combo: number;
  multiplier: number;
}

interface GameActions {
  startGame: (gameId: string, initialTime?: number) => void;
  endGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  loseLife: () => void;
  setTimeLeft: (t: number) => void;
  setAccuracy: (acc: number) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  currentGameId: null,
  score: 0,
  accuracy: 100,
  lives: 3,
  timeLeft: 60,
  isPlaying: false,
  isPaused: false,
  combo: 0,
  multiplier: 1,

  startGame: (gameId, initialTime = 60) =>
    set({
      currentGameId: gameId,
      score: 0,
      accuracy: 100,
      lives: 3,
      timeLeft: initialTime,
      isPlaying: true,
      isPaused: false,
      combo: 0,
      multiplier: 1,
    }),

  endGame: () =>
    set({ isPlaying: false, isPaused: false, currentGameId: null }),

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),

  addScore: (points) => {
    const { score, multiplier } = get();
    set({ score: score + Math.floor(points * multiplier) });
  },

  incrementCombo: () => {
    const newCombo = get().combo + 1;
    const newMultiplier = 1 + Math.floor(newCombo / 5) * 0.5;
    set({ combo: newCombo, multiplier: newMultiplier });
  },

  resetCombo: () => set({ combo: 0, multiplier: 1 }),

  loseLife: () => {
    const { lives } = get();
    const newLives = lives - 1;
    set({ lives: newLives, combo: 0, multiplier: 1 });
    if (newLives <= 0) {
      set({ isPlaying: false });
    }
  },

  setTimeLeft: (t) => set({ timeLeft: t }),
  setAccuracy: (acc) => set({ accuracy: acc }),
}));
