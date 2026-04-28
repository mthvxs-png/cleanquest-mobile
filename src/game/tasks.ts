import { FIXED_TASKS, TASK_DURATION_RANGES, TASK_REWARDS } from "./constants";
import type { Difficulty, Reward, TaskDefinition, TimedTaskRun } from "./types";

export const getFixedTasks = (): TaskDefinition[] => FIXED_TASKS;

export const getTaskReward = (difficulty: Difficulty): Reward => TASK_REWARDS[difficulty];

export const startTaskRun = (task: TaskDefinition, now: number): TimedTaskRun => {
  const [minDuration, maxDuration] = TASK_DURATION_RANGES[task.difficulty];

  if (task.durationMinutes < minDuration || task.durationMinutes > maxDuration) {
    throw new Error("Task duration is outside the allowed difficulty range");
  }

  return {
    taskId: task.id,
    startedAt: now,
    minimumEndAt: now + task.durationMinutes * 60 * 1000,
  };
};

export const canCompleteTaskRun = (run: TimedTaskRun, now: number): boolean => {
  return now >= run.minimumEndAt;
};
