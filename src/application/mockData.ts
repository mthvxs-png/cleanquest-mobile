import {
  COSMETIC_POOLS,
  createLoginRewardState,
  createEconomyState,
  createPlayerProgression,
  generateDailyMissions,
  grantCoins,
  grantPlayerCoins,
} from "../game";
import type { ChestRarity, CosmeticCategory } from "../game";
import type { CharacterState, CosmeticDefinition, GameStoreState } from "../types/app";

export const COSMETIC_DEFINITIONS: Record<string, CosmeticDefinition> = Object.values(COSMETIC_POOLS)
  .flat()
  .reduce<Record<string, CosmeticDefinition>>((acc, item) => {
    const rarity = Object.entries(COSMETIC_POOLS).find(([, pool]) =>
      pool.some((poolItem) => poolItem.id === item.id),
    )?.[0] as ChestRarity | undefined;

    if (!rarity) {
      return acc;
    }

    acc[item.id] = {
      id: item.id,
      category: item.category,
      rarity,
      nameKey: `cosmetics.${item.id}`,
    };
    return acc;
  }, {});

const starterEquipped: Record<CosmeticCategory, string> = {
  outfits: "linen-shirt",
  hats: "straw-hat",
  pants: "garden-pants",
  shoes: "soft-sneakers",
  pets: "tabby-pet",
  backgrounds: "sunny-wallpaper",
  auras: "mint-aura",
};

const createInitialCharacter = (): CharacterState => ({
  bodyType: "female",
  equipped: starterEquipped,
  unlockedItemIds: [
    "linen-shirt",
    "straw-hat",
    "garden-pants",
    "soft-sneakers",
    "tabby-pet",
    "sunny-wallpaper",
    "mint-aura",
    "sky-hoodie",
  ],
});

export const createInitialGameState = (now: number): GameStoreState => {
  const progression = grantPlayerCoins(createPlayerProgression(), 420);
  const chestInventory = grantCoins(createEconomyState(), progression.coins);

  return {
    authState: {
      firebaseConfigured: false,
      status: "idle",
      user: null,
      remoteLoaded: false,
      error: null,
    },
    progression,
    streak: {
      current: 0,
    },
    buffs: {},
    taskRuns: {},
    selectedTaskIds: [],
    dailyMissions: generateDailyMissions(now),
    completedMissionIds: [],
    loginRewards: createLoginRewardState(),
    stats: {
      completedTasksTotal: 0,
      completedMissionsTotal: 0,
      openedChestsTotal: 0,
      boughtChestsTotal: 0,
      highestTasksInDay: 0,
      currentDayTaskCount: 0,
      bestStreak: 0,
      dailyLoginRewardsClaimed: 0,
      totalXpEarned: 0,
      totalCoinsEarned: 0,
    },
    character: createInitialCharacter(),
    settings: {
      language: "pt-BR",
      sfxVolume: 70,
      musicVolume: 40,
    },
    shop: {
      chestInventory,
      lastRewards: [],
    },
    debugResults: [],
  };
};
