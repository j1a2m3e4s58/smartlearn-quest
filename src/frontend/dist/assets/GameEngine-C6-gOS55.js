import { c as createLucideIcon, r as reactExports } from "./index-YNz7x6b_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
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
  Heart as H,
  buildResult as b,
  useGameTimer as u
};
