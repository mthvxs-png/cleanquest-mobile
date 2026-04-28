import type { DailyMission, TimedTaskRun } from "../game";

export const formatCountdown = (targetTime: number, now: number): string => {
  const remainingMs = Math.max(targetTime - now, 0);
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const getTaskProgressLabel = (run: TimedTaskRun, now: number): string => {
  return formatCountdown(run.minimumEndAt, now);
};

export const isMissionCompleted = (mission: DailyMission, completedMissionIds: string[]): boolean => {
  return completedMissionIds.includes(mission.id);
};
