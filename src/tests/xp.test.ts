import { describe, expect, it } from "vitest";
import {
  createPlayerProgression,
  getLevelProgress,
  getXpRequiredForLevel,
  grantPlayerCoins,
  grantXp,
} from "../game";

describe("xp rules", () => {
  it("calculates xp required per level with the growth formula", () => {
    expect(getXpRequiredForLevel(1)).toBe(100);
    expect(getXpRequiredForLevel(2)).toBe(120);
    expect(getXpRequiredForLevel(3)).toBe(144);
  });

  it("returns the current level progress from total xp", () => {
    expect(getLevelProgress(99)).toEqual({
      level: 1,
      xpIntoLevel: 99,
      xpRequired: 100,
    });
    expect(getLevelProgress(100)).toEqual({
      level: 2,
      xpIntoLevel: 0,
      xpRequired: 120,
    });
  });

  it("grants xp and levels up when the threshold is crossed", () => {
    const progression = createPlayerProgression();
    const updated = grantXp(progression, 150);

    expect(updated.level).toBe(2);
    expect(updated.xpIntoLevel).toBe(50);
    expect(updated.xpRequiredForNextLevel).toBe(120);
    expect(updated.leveledUp).toBe(true);
  });

  it("tracks coin gains on the player progression", () => {
    const progression = createPlayerProgression();
    const updated = grantPlayerCoins(progression, 25);

    expect(updated.coins).toBe(25);
    expect(updated.level).toBe(1);
  });
});
