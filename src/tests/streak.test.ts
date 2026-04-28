import { describe, expect, it } from "vitest";
import { activateBuff, updateDailyLoginStreak } from "../game";

describe("streak rules", () => {
  const now = Date.UTC(2026, 3, 24, 12, 0, 0);

  it("increases streak on consecutive daily logins", () => {
    const first = updateDailyLoginStreak({ current: 0 }, "2026-04-24", {}, now);
    const second = updateDailyLoginStreak(first.streak, "2026-04-25", first.buffs, now);

    expect(second.streak.current).toBe(2);
  });

  it("consumes streak protection instead of resetting once", () => {
    const buffs = activateBuff({}, "streakShield", now);
    const result = updateDailyLoginStreak(
      { current: 5, lastLoginDay: "2026-04-22" },
      "2026-04-24",
      buffs,
      now,
    );

    expect(result.streak.current).toBe(5);
    expect(result.buffs.streakShield).toBeUndefined();
  });
});
