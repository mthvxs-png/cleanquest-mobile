import { describe, expect, it } from "vitest";
import { canCompleteTaskRun, getFixedTasks, getTaskReward, startTaskRun } from "../game";

describe("task rules", () => {
  it("returns the configured rewards by difficulty", () => {
    expect(getTaskReward("easy")).toEqual({ xp: 10, coins: 5 });
    expect(getTaskReward("medium")).toEqual({ xp: 25, coins: 12 });
    expect(getTaskReward("hard")).toEqual({ xp: 50, coins: 25 });
  });

  it("starts a task timer and blocks completion before the minimum duration", () => {
    const task = getFixedTasks().find((item) => item.id === "wash-few-dishes");
    if (!task) {
      throw new Error("Mock task not found");
    }

    const startedAt = 1_000;
    const run = startTaskRun(task, startedAt);

    expect(canCompleteTaskRun(run, startedAt + task.durationMinutes * 60 * 1000 - 1)).toBe(false);
    expect(canCompleteTaskRun(run, startedAt + task.durationMinutes * 60 * 1000)).toBe(true);
  });
});
