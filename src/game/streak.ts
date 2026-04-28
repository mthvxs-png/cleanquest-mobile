import { consumeStreakProtection, isBuffActive } from "./buffs";
import type { BuffState, BuffType } from "./types";

export interface StreakState {
  current: number;
  lastLoginDay?: string;
}

const dayToNumber = (day: string): number => {
  const date = new Date(`${day}T00:00:00.000Z`);
  return Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
};

export const updateDailyLoginStreak = (
  streak: StreakState,
  today: string,
  buffs: Partial<Record<BuffType, BuffState>>,
  now: number,
): { streak: StreakState; buffs: Partial<Record<BuffType, BuffState>> } => {
  if (!streak.lastLoginDay) {
    return {
      streak: { current: 1, lastLoginDay: today },
      buffs,
    };
  }

  const dayDiff = dayToNumber(today) - dayToNumber(streak.lastLoginDay);
  if (dayDiff <= 0) {
    return { streak, buffs };
  }

  if (dayDiff === 1) {
    return {
      streak: { current: streak.current + 1, lastLoginDay: today },
      buffs,
    };
  }

  if (isBuffActive(buffs, "streakShield", now)) {
    return {
      streak: { current: streak.current, lastLoginDay: today },
      buffs: consumeStreakProtection(buffs),
    };
  }

  return {
    streak: { current: 1, lastLoginDay: today },
    buffs,
  };
};
