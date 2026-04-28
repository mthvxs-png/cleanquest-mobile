import type { PlayerProgression } from "./types";

export const getXpRequiredForLevel = (level: number): number => {
  if (level < 1) {
    throw new Error("Level must be at least 1");
  }

  return Math.round(100 * 1.2 ** (level - 1));
};

export const getLevelProgress = (totalXp: number): {
  level: number;
  xpIntoLevel: number;
  xpRequired: number;
} => {
  if (totalXp < 0) {
    throw new Error("XP cannot be negative");
  }

  let remainingXp = totalXp;
  let level = 1;
  let xpRequired = getXpRequiredForLevel(level);

  while (remainingXp >= xpRequired) {
    remainingXp -= xpRequired;
    level += 1;
    xpRequired = getXpRequiredForLevel(level);
  }

  return {
    level,
    xpIntoLevel: remainingXp,
    xpRequired,
  };
};

export const createPlayerProgression = (): PlayerProgression => ({
  totalXp: 0,
  level: 1,
  xpIntoLevel: 0,
  xpRequiredForNextLevel: getXpRequiredForLevel(1),
  coins: 0,
});

export const grantXp = (
  progression: PlayerProgression,
  xpAmount: number,
): PlayerProgression & { leveledUp: boolean } => {
  if (xpAmount < 0) {
    throw new Error("XP amount cannot be negative");
  }

  const totalXp = progression.totalXp + xpAmount;
  const levelProgress = getLevelProgress(totalXp);

  return {
    totalXp,
    level: levelProgress.level,
    xpIntoLevel: levelProgress.xpIntoLevel,
    xpRequiredForNextLevel: levelProgress.xpRequired,
    coins: progression.coins,
    leveledUp: levelProgress.level > progression.level,
  };
};

export const grantPlayerCoins = (
  progression: PlayerProgression,
  coinsAmount: number,
): PlayerProgression => {
  if (coinsAmount < 0) {
    throw new Error("Coin amount cannot be negative");
  }

  return {
    ...progression,
    coins: progression.coins + coinsAmount,
  };
};
