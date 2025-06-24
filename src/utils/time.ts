export const formatTime = (seconds?: number): string => {
  if (!seconds || seconds < 0) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const calculateProgress = (
  currentTime: number,
  duration: number
): number => {
  if (!duration || duration <= 0) return 0;
  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
};

export const calculateTimeFromProgress = (
  progress: number,
  duration: number
): number => {
  if (!duration || duration <= 0) return 0;
  return Math.min(duration, Math.max(0, (progress / 100) * duration));
};

export const millisecondsToSeconds = (ms: number): number => Math.floor(ms / 1000);

