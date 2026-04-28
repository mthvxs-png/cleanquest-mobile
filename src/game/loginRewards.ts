import { EASY_MISSION_EQUIVALENT_REWARD } from "./constants";
import type { ChestInventoryState, LoginRewardState, Reward } from "./types";

export const createLoginRewardState = (): LoginRewardState => ({
  day: 0,
});

export const getDailyLoginReward = (): Reward => EASY_MISSION_EQUIVALENT_REWARD;

export const claimDailyLoginReward = (
  state: LoginRewardState,
  today: string,
): {
  nextState: LoginRewardState;
  reward: Reward;
  grantsLegendaryChest: boolean;
} => {
  if (state.lastClaimDay === today) {
    return {
      nextState: state,
      reward: getDailyLoginReward(),
      grantsLegendaryChest: false,
    };
  }

  const nextDay = state.day >= 7 ? 1 : state.day + 1;

  return {
    nextState: {
      day: nextDay,
      lastClaimDay: today,
    },
    reward: getDailyLoginReward(),
    grantsLegendaryChest: nextDay === 7,
  };
};

export const getLegendaryRewardIndex = (state: ChestInventoryState): number => {
  return state.chestsPurchased + state.inventory.length;
};
