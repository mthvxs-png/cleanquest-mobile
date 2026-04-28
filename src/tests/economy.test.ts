import { describe, expect, it } from "vitest";
import {
  createEconomyState,
  grantCoins,
  openChest,
  purchaseChest,
  spendCoins,
} from "../game";

describe("economy and chest rules", () => {
  it("tracks coin gains and spending", () => {
    const state = grantCoins(createEconomyState(), 200);
    const afterSpend = spendCoins(state, 50);

    expect(afterSpend.coins).toBe(150);
  });

  it("opens the selected chest rarity", () => {
    const funded = grantCoins(createEconomyState(), 500);
    const purchase = purchaseChest(funded, "common");
    const opened = openChest(purchase.nextState, purchase.purchasedRarity, 0, false);

    expect(opened.result.rarity).toBe("common");
    expect(opened.nextState.inventory).toHaveLength(1);
  });

  it("grants one extra legendary chest every 20 purchases", () => {
    let state = grantCoins(createEconomyState(), 5_000);
    let pityCount = 0;
    let openedCount = 0;

    for (let purchaseNumber = 1; purchaseNumber <= 20; purchaseNumber += 1) {
      const purchase = purchaseChest(state, "common");
      state = purchase.nextState;
      state = openChest(state, purchase.purchasedRarity, purchaseNumber, false).nextState;
      openedCount += 1;

      if (purchase.pityLegendaryAwarded) {
        pityCount += 1;
        state = openChest(state, "legendary", purchaseNumber, true).nextState;
        openedCount += 1;
      }
    }

    expect(pityCount).toBe(1);
    expect(openedCount).toBe(21);
    expect(state.chestsPurchased).toBe(20);
    expect(state.inventory).toHaveLength(21);
  });
});
