import { r as reactExports } from "./index-bdQaMNSA.js";
function calculateXP(score, difficulty, accuracy) {
  return Math.floor(score * difficulty * (accuracy / 100) * 0.5);
}
function calculateCoins(score, difficulty) {
  return Math.floor(score * difficulty * 0.1);
}
function useGameTimer(duration, onExpire) {
  const [timeLeft, setTimeLeft] = reactExports.useState(duration);
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  const onExpireRef = reactExports.useRef(onExpire);
  onExpireRef.current = onExpire;
  const clearTimer = reactExports.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const start = reactExports.useCallback(() => {
    setIsRunning(true);
  }, []);
  const pause = reactExports.useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);
  const reset = reactExports.useCallback(
    (newDuration) => {
      clearTimer();
      setIsRunning(false);
      setTimeLeft(newDuration ?? duration);
    },
    [clearTimer, duration]
  );
  reactExports.useEffect(() => {
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
    }, 1e3);
    return clearTimer;
  }, [isRunning, clearTimer]);
  return { timeLeft, isRunning, start, pause, reset };
}
function buildResult(config, score, accuracy, timeSpent, completed) {
  return {
    gameId: config.gameId,
    score,
    accuracy: Math.round(accuracy),
    timeSpent,
    completed,
    xpEarned: calculateXP(score, config.difficulty, accuracy),
    coinsEarned: calculateCoins(score, config.difficulty)
  };
}
export {
  buildResult as b,
  useGameTimer as u
};
