// utils.js
export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${seconds} seconds`;
};

export const startTimer = (setTimer, setTimerRunning) => {
  setTimer(0);
  setTimerRunning(true);
  const intervalId = setInterval(() => {
    setTimer((prevTimer) => prevTimer + 1);
  }, 1000);
  return intervalId;
};

export const stopTimer = (intervalId, setTimerRunning) => {
  clearInterval(intervalId);
  setTimerRunning(false);
};
