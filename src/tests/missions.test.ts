import { describe, expect, it } from "vitest";
import { calculateMissionReward, generateDailyMissions, rerollMission, TASK_REWARDS } from "../game";

describe("mission rules", () => {
  const timestamp = Date.UTC(2026, 3, 24, 12, 0, 0);

  it("generates exactly 3 daily missions with 3 free rerolls", () => {
    const state = generateDailyMissions(timestamp);

    expect(state.missions).toHaveLength(3);
    expect(state.rerollsLeft).toBe(3);
  });

  it("rerolls any mission and spends one free reroll", () => {
    const state = generateDailyMissions(timestamp);
    const originalMission = state.missions[1];
    const rerolled = rerollMission(state, originalMission.id, timestamp);

    expect(rerolled.rerollsLeft).toBe(2);
    expect(rerolled.missions[1].id).not.toBe(originalMission.id);
    expect(rerolled.missions[1].swapUsed).toBe(true);
  });

  it("applies the 50 percent bonus over the subtasks sum", () => {
    const state = generateDailyMissions(timestamp);
    const mission = state.missions[0];
    const reward = calculateMissionReward(mission);
    const subtotal = mission.subtasks.reduce(
      (acc, subtask) => ({
        xp: acc.xp + TASK_REWARDS[subtask.difficulty].xp,
        coins: acc.coins + TASK_REWARDS[subtask.difficulty].coins,
      }),
      { xp: 0, coins: 0 },
    );

    expect(reward).toEqual({
      xp: Math.round(subtotal.xp * 1.5),
      coins: Math.round(subtotal.coins * 1.5),
    });
  });
});
