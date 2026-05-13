import { useCallback, useEffect, useRef, useState } from "react";

export interface GameConfig {
  gameId: string;
  gameName: string;
  difficulty: 1 | 2 | 3;
  timeLimit: number;
  livesCount: number;
}

export interface GameResult {
  gameId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  completed: boolean;
  xpEarned: number;
  coinsEarned: number;
}

export function calculateXP(
  score: number,
  difficulty: number,
  accuracy: number,
): number {
  return Math.floor(score * difficulty * (accuracy / 100) * 0.5);
}

export function calculateCoins(score: number, difficulty: number): number {
  return Math.floor(score * difficulty * 0.1);
}

export interface GameTimer {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (duration?: number) => void;
}

export function useGameTimer(
  duration: number,
  onExpire: () => void,
): GameTimer {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(
    (newDuration?: number) => {
      clearTimer();
      setIsRunning(false);
      setTimeLeft(newDuration ?? duration);
    },
    [clearTimer, duration],
  );

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, clearTimer]);

  return { timeLeft, isRunning, start, pause, reset };
}

export function buildResult(
  config: GameConfig,
  score: number,
  accuracy: number,
  timeSpent: number,
  completed: boolean,
): GameResult {
  return {
    gameId: config.gameId,
    score,
    accuracy: Math.round(accuracy),
    timeSpent,
    completed,
    xpEarned: calculateXP(score, config.difficulty, accuracy),
    coinsEarned: calculateCoins(score, config.difficulty),
  };
}
