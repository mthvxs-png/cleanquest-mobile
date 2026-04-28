import type { BuffState, BuffType } from "./types";

const BUFF_DURATION_MS = 24 * 60 * 60 * 1000;

export const activateBuff = (
  currentBuffs: Partial<Record<BuffType, BuffState>>,
  type: BuffType,
  now: number,
): Partial<Record<BuffType, BuffState>> => {
  return {
    ...currentBuffs,
    [type]: {
      type,
      activeUntil: now + BUFF_DURATION_MS,
    },
  };
};

export const isBuffActive = (
  currentBuffs: Partial<Record<BuffType, BuffState>>,
  type: BuffType,
  now: number,
): boolean => {
  const buff = currentBuffs[type];
  return Boolean(buff && buff.activeUntil > now);
};

export const applyBuffsToReward = (
  reward: { xp: number; coins: number },
  currentBuffs: Partial<Record<BuffType, BuffState>>,
  now: number,
): { xp: number; coins: number } => {
  const xpMultiplier = isBuffActive(currentBuffs, "doubleXp", now) ? 2 : 1;
  const coinMultiplier = isBuffActive(currentBuffs, "doubleCoins", now) ? 2 : 1;

  return {
    xp: reward.xp * xpMultiplier,
    coins: reward.coins * coinMultiplier,
  };
};

export const consumeStreakProtection = (
  currentBuffs: Partial<Record<BuffType, BuffState>>,
): Partial<Record<BuffType, BuffState>> => {
  const nextBuffs = { ...currentBuffs };
  delete nextBuffs.streakShield;
  return nextBuffs;
};
