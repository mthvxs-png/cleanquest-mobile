import { describe, expect, it } from "vitest";
import { activateBuff, applyBuffsToReward, isBuffActive } from "../game";

describe("buff rules", () => {
  const now = 1_000_000;

  it("activates a 24h buff and keeps only one active state per buff type", () => {
    const first = activateBuff({}, "doubleXp", now);
    const refreshed = activateBuff(first, "doubleXp", now + 500);

    expect(isBuffActive(refreshed, "doubleXp", now + 1_000)).toBe(true);
    expect(refreshed.doubleXp?.activeUntil).toBe(now + 500 + 24 * 60 * 60 * 1000);
  });

  it("does not stack reward multipliers beyond one active buff per type", () => {
    const buffs = activateBuff({}, "doubleXp", now);
    const reward = applyBuffsToReward({ xp: 10, coins: 5 }, buffs, now + 100);

    expect(reward).toEqual({ xp: 20, coins: 5 });
  });
});
