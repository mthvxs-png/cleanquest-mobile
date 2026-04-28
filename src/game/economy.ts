import { CHEST_COSTS, COSMETIC_POOLS } from "./constants";
import type { ChestInventoryState, ChestOpenResult, ChestRarity } from "./types";

export const createEconomyState = (): ChestInventoryState => ({
  coins: 0,
  chestsPurchased: 0,
  inventory: [],
});

export const grantCoins = (state: ChestInventoryState, amount: number): ChestInventoryState => {
  if (amount < 0) {
    throw new Error("Coin amount cannot be negative");
  }

  return {
    ...state,
    coins: state.coins + amount,
  };
};

export const spendCoins = (state: ChestInventoryState, amount: number): ChestInventoryState => {
  if (amount < 0) {
    throw new Error("Coin amount cannot be negative");
  }

  if (state.coins < amount) {
    throw new Error("Not enough coins");
  }

  return {
    ...state,
    coins: state.coins - amount,
  };
};

export const purchaseChest = (
  state: ChestInventoryState,
  rarity: ChestRarity,
): { nextState: ChestInventoryState; purchasedRarity: ChestRarity; pityLegendaryAwarded: boolean } => {
  const cost = CHEST_COSTS[rarity];

  if (state.coins < cost) {
    throw new Error("Not enough coins");
  }

  const nextPurchaseCount = state.chestsPurchased + 1;
  const pityTriggered = nextPurchaseCount % 20 === 0;

  return {
    nextState: {
      ...state,
      coins: state.coins - cost,
      chestsPurchased: nextPurchaseCount,
    },
    purchasedRarity: rarity,
    pityLegendaryAwarded: pityTriggered,
  };
};

export const openChest = (
  state: ChestInventoryState,
  rarity: ChestRarity,
  randomIndex = 0,
  pityTriggered = false,
): { nextState: ChestInventoryState; result: ChestOpenResult } => {
  const pool = COSMETIC_POOLS[rarity];
  const normalizedIndex = ((randomIndex % pool.length) + pool.length) % pool.length;
  const selected = pool[normalizedIndex];

  return {
    nextState: {
      ...state,
      inventory: [...state.inventory, selected.id],
    },
    result: {
      rarity,
      grantedCosmeticId: selected.id,
      category: selected.category,
      pityTriggered,
    },
  };
};
