import i18n from "../i18n";
import { create } from "zustand";
import {
  activateBuff,
  applyBuffsToReward,
  BUFF_COSTS,
  calculateMissionReward,
  canCompleteTaskRun,
  claimDailyLoginReward,
  generateDailyMissions,
  getDayKey,
  getFixedTasks,
  getLegendaryRewardIndex,
  getTaskReward,
  grantPlayerCoins,
  grantXp,
  isBuffActive,
  openChest,
  purchaseChest,
  rerollMission,
  runDebugSimulation,
  startTaskRun,
  updateDailyLoginStreak,
  type BuffType,
  type ChestInventoryState,
  type ChestOpenResult,
  type ChestRarity,
  type CosmeticCategory,
  type Language,
  type PlayerProgression,
  type PlayerStats,
  type Reward,
} from "../game";
import { COSMETIC_DEFINITIONS, createInitialGameState } from "../application/mockData";
import type { AuthUserSummary, GameStoreState } from "../types/app";
import { loadUserProgress, saveUserProgress, toPersistedProgress, type PersistedProgress } from "../services/progress";

interface GameStore extends GameStoreState {
  setFirebaseAvailability: (configured: boolean) => void;
  setAuthChecking: () => void;
  setSignedInUser: (user: AuthUserSummary) => void;
  setSignedOutUser: () => void;
  setAuthError: (message: string | null) => void;
  hydrateRemoteProgress: (progress: PersistedProgress) => void;
  markRemoteReady: () => void;
  setLastSyncedAt: (timestamp: number) => void;
  syncDailyState: (now: number) => void;
  syncTaskRuns: (now: number) => void;
  setLanguage: (language: Language) => Promise<void>;
  setSfxVolume: (value: number) => void;
  setMusicVolume: (value: number) => void;
  setBodyType: (bodyType: "male" | "female") => void;
  equipItem: (category: CosmeticCategory, itemId: string) => void;
  toggleTaskSelection: (taskId: string) => void;
  startTask: (taskId: string, now: number) => void;
  completeTask: (taskId: string, now: number) => { success: boolean; reason?: string };
  completeTaskInstantly: (taskId: string, now: number) => { success: boolean; reason?: string };
  rerollDailyMission: (missionId: string, now: number) => { success: boolean; reason?: string };
  completeMission: (missionId: string, now: number) => { success: boolean; reason?: string };
  buyChest: (rarity: ChestRarity) => { success: boolean; reason?: string };
  buyBuff: (type: BuffType, now: number) => { success: boolean; reason?: string };
  activateMockBuff: (type: BuffType, now: number) => void;
  runDebugTester: (now: number) => Promise<void>;
}

const clampVolume = (value: number): number => Math.max(0, Math.min(100, value));

const syncChestCoins = (
  coins: number,
  chestInventory: ChestInventoryState,
): ChestInventoryState => ({
  ...chestInventory,
  coins,
});

const mergeUnlockedItems = (current: string[], nextInventory: string[]): string[] =>
  Array.from(new Set([...current, ...nextInventory]));

const createStartingStore = (): GameStoreState => {
  const now = Date.now();
  const initial = createInitialGameState(now);

  return initial;
};

const applyReward = (
  progression: PlayerProgression,
  chestInventory: ChestInventoryState,
  stats: PlayerStats,
  reward: Reward,
): {
  progression: PlayerProgression;
  chestInventory: ChestInventoryState;
  stats: PlayerStats;
} => {
  const progressionWithXp = grantXp(progression, reward.xp);
  const nextProgression = grantPlayerCoins(progressionWithXp, reward.coins);

  return {
    progression: nextProgression,
    chestInventory: syncChestCoins(nextProgression.coins, chestInventory),
    stats: {
      ...stats,
      totalXpEarned: stats.totalXpEarned + reward.xp,
      totalCoinsEarned: stats.totalCoinsEarned + reward.coins,
    },
  };
};

const recordTaskCompletion = (stats: PlayerStats, now: number): PlayerStats => {
  const dayKey = getDayKey(now);
  const sameDay = stats.currentDayKey === dayKey;
  const currentDayTaskCount = (sameDay ? stats.currentDayTaskCount : 0) + 1;

  return {
    ...stats,
    completedTasksTotal: stats.completedTasksTotal + 1,
    currentDayKey: dayKey,
    currentDayTaskCount,
    highestTasksInDay: Math.max(stats.highestTasksInDay, currentDayTaskCount),
  };
};

const completeTaskAndReward = (
  state: GameStoreState,
  taskId: string,
  now: number,
): Pick<GameStoreState, "progression" | "shop" | "stats" | "selectedTaskIds" | "taskRuns"> => {
  const task = getFixedTasks().find((item) => item.id === taskId);
  if (!task) {
    return {
      progression: state.progression,
      shop: state.shop,
      stats: state.stats,
      selectedTaskIds: state.selectedTaskIds,
      taskRuns: state.taskRuns,
    };
  }

  const reward = applyBuffsToReward(getTaskReward(task.difficulty), state.buffs, now);
  const rewardResult = applyReward(state.progression, state.shop.chestInventory, state.stats, reward);
  const nextRuns = { ...state.taskRuns };
  delete nextRuns[taskId];

  return {
    progression: rewardResult.progression,
    shop: {
      ...state.shop,
      chestInventory: rewardResult.chestInventory,
    },
    stats: recordTaskCompletion(rewardResult.stats, now),
    selectedTaskIds: state.selectedTaskIds.filter((currentTaskId) => currentTaskId !== taskId),
    taskRuns: nextRuns,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createStartingStore(),

  setFirebaseAvailability: (configured) => {
    set((state) => ({
      authState: {
        ...state.authState,
        firebaseConfigured: configured,
      },
    }));
  },

  setAuthChecking: () => {
    set((state) => ({
      authState: {
        ...state.authState,
        status: "checking",
        error: null,
      },
    }));
  },

  setSignedInUser: (user) => {
    set((state) => ({
      authState: {
        ...state.authState,
        status: "signedIn",
        user,
        remoteLoaded: false,
        error: null,
      },
    }));
  },

  setSignedOutUser: () => {
    set((state) => ({
      authState: {
        ...state.authState,
        status: "signedOut",
        user: null,
        remoteLoaded: true,
        error: null,
      },
    }));
  },

  setAuthError: (message) => {
    set((state) => ({
      authState: {
        ...state.authState,
        error: message,
      },
    }));
  },

  hydrateRemoteProgress: (progress) => {
    set((state) => ({
      progression: progress.progression,
      streak: progress.streak,
      buffs: progress.buffs,
      taskRuns: progress.taskRuns,
      selectedTaskIds: progress.selectedTaskIds ?? [],
      dailyMissions: progress.dailyMissions,
      completedMissionIds: progress.completedMissionIds,
      loginRewards: progress.loginRewards ?? state.loginRewards,
      stats: progress.stats ?? state.stats,
      character: progress.character,
      shop: {
        ...state.shop,
        chestInventory: progress.shop.chestInventory,
      },
      authState: {
        ...state.authState,
        remoteLoaded: true,
        error: null,
      },
    }));
  },

  markRemoteReady: () => {
    set((state) => ({
      authState: {
        ...state.authState,
        remoteLoaded: true,
      },
    }));
  },

  setLastSyncedAt: (timestamp) => {
    set((state) => ({
      authState: {
        ...state.authState,
        lastSyncedAt: timestamp,
      },
    }));
  },

  syncDailyState: (now) => {
    const state = get();
    const todayKey = getDayKey(now);
    const shouldRefreshMissions = state.dailyMissions.generatedForDay !== todayKey;
    const needsDailyClaim = state.loginRewards.lastClaimDay !== todayKey;
    const needsStreakSync = state.streak.lastLoginDay !== todayKey;

    if (!shouldRefreshMissions && !needsDailyClaim && !needsStreakSync) {
      return;
    }

    const streakResult = updateDailyLoginStreak(state.streak, todayKey, state.buffs, now);
    const loginClaim = claimDailyLoginReward(state.loginRewards, todayKey);

    let nextProgression = state.progression;
    let nextChestInventory = state.shop.chestInventory;
    let nextStats = {
      ...state.stats,
      bestStreak: Math.max(state.stats.bestStreak, streakResult.streak.current),
    };
    let nextCharacter = state.character;
    let lastRewards = state.shop.lastRewards;

    if (needsDailyClaim) {
      const rewardResult = applyReward(nextProgression, nextChestInventory, nextStats, loginClaim.reward);
      nextProgression = rewardResult.progression;
      nextChestInventory = rewardResult.chestInventory;
      nextStats = {
        ...rewardResult.stats,
        dailyLoginRewardsClaimed: rewardResult.stats.dailyLoginRewardsClaimed + 1,
      };

      if (loginClaim.grantsLegendaryChest) {
        const legendary = openChest(
          nextChestInventory,
          "legendary",
          getLegendaryRewardIndex(nextChestInventory),
          false,
        );
        nextChestInventory = legendary.nextState;
        lastRewards = [legendary.result];
        nextCharacter = {
          ...nextCharacter,
          unlockedItemIds: mergeUnlockedItems(nextCharacter.unlockedItemIds, legendary.nextState.inventory),
        };
        nextStats = {
          ...nextStats,
          openedChestsTotal: nextStats.openedChestsTotal + 1,
        };
      }
    }

    set({
      progression: nextProgression,
      streak: streakResult.streak,
      buffs: streakResult.buffs,
      dailyMissions: shouldRefreshMissions ? generateDailyMissions(now) : state.dailyMissions,
      completedMissionIds: shouldRefreshMissions ? [] : state.completedMissionIds,
      selectedTaskIds: shouldRefreshMissions ? [] : state.selectedTaskIds,
      loginRewards: needsDailyClaim ? loginClaim.nextState : state.loginRewards,
      stats: shouldRefreshMissions
        ? {
            ...nextStats,
            currentDayTaskCount: 0,
            currentDayKey: todayKey,
          }
        : nextStats,
      character: nextCharacter,
      shop: {
        chestInventory: nextChestInventory,
        lastRewards,
      },
    });
  },

  syncTaskRuns: (now) => {
    const state = get();
    const completableTaskIds = Object.values(state.taskRuns)
      .filter((run): run is NonNullable<typeof run> => Boolean(run && canCompleteTaskRun(run, now)))
      .map((run) => run.taskId);

    if (completableTaskIds.length === 0) {
      return;
    }

    let workingState: GameStoreState = { ...state };

    for (const taskId of completableTaskIds) {
      const result = completeTaskAndReward(workingState, taskId, now);
      workingState = {
        ...workingState,
        progression: result.progression,
        shop: result.shop,
        stats: result.stats,
        selectedTaskIds: result.selectedTaskIds,
        taskRuns: result.taskRuns,
      };
    }

    set({
      progression: workingState.progression,
      shop: workingState.shop,
      stats: workingState.stats,
      selectedTaskIds: workingState.selectedTaskIds,
      taskRuns: workingState.taskRuns,
    });
  },

  setLanguage: async (language) => {
    await i18n.changeLanguage(language);
    set((state) => ({
      settings: {
        ...state.settings,
        language,
      },
    }));
  },

  setSfxVolume: (value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        sfxVolume: clampVolume(value),
      },
    }));
  },

  setMusicVolume: (value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        musicVolume: clampVolume(value),
      },
    }));
  },

  setBodyType: (bodyType) => {
    set((state) => ({
      character: {
        ...state.character,
        bodyType,
      },
    }));
  },

  equipItem: (category, itemId) => {
    const state = get();
    const item = COSMETIC_DEFINITIONS[itemId];
    if (!item || item.category !== category || !state.character.unlockedItemIds.includes(itemId)) {
      return;
    }

    set((current) => ({
      character: {
        ...current.character,
        equipped: {
          ...current.character.equipped,
          [category]: itemId,
        },
      },
    }));
  },

  toggleTaskSelection: (taskId) => {
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds.includes(taskId)
        ? state.selectedTaskIds.filter((currentTaskId) => currentTaskId !== taskId)
        : [...state.selectedTaskIds, taskId],
    }));
  },

  startTask: (taskId, now) => {
    const task = getFixedTasks().find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    set((state) => ({
      taskRuns: {
        ...state.taskRuns,
        [taskId]: startTaskRun(task, now),
      },
      selectedTaskIds: state.selectedTaskIds.includes(taskId)
        ? state.selectedTaskIds
        : [...state.selectedTaskIds, taskId],
    }));
  },

  completeTask: (taskId, now) => {
    const state = get();
    const run = state.taskRuns[taskId];

    if (!run) {
      return { success: false, reason: "task-missing" };
    }

    if (!canCompleteTaskRun(run, now)) {
      return { success: false, reason: "timer-running" };
    }

    const result = completeTaskAndReward(state, taskId, now);
    set(result);
    return { success: true };
  },

  completeTaskInstantly: (taskId, now) => {
    const state = get();
    const task = getFixedTasks().find((item) => item.id === taskId);
    if (!task) {
      return { success: false, reason: "task-missing" };
    }

    const result = completeTaskAndReward(state, taskId, now);
    set(result);
    return { success: true };
  },

  rerollDailyMission: (missionId, now) => {
    const state = get();
    try {
      const dailyMissions = rerollMission(state.dailyMissions, missionId, now);
      set({ dailyMissions });
      return { success: true };
    } catch {
      return { success: false, reason: "reroll-unavailable" };
    }
  },

  completeMission: (missionId, now) => {
    const state = get();
    if (state.completedMissionIds.includes(missionId)) {
      return { success: false, reason: "already-completed" };
    }

    const mission = state.dailyMissions.missions.find((item) => item.id === missionId);
    if (!mission) {
      return { success: false, reason: "mission-missing" };
    }

    const reward = applyBuffsToReward(calculateMissionReward(mission), state.buffs, now);
    const rewardResult = applyReward(state.progression, state.shop.chestInventory, state.stats, reward);

    set({
      progression: rewardResult.progression,
      completedMissionIds: [...state.completedMissionIds, missionId],
      shop: {
        ...state.shop,
        chestInventory: rewardResult.chestInventory,
      },
      stats: {
        ...rewardResult.stats,
        completedMissionsTotal: rewardResult.stats.completedMissionsTotal + 1,
      },
    });

    return { success: true };
  },

  buyChest: (rarity) => {
    const state = get();
    try {
      const purchase = purchaseChest(state.shop.chestInventory, rarity);
      let chestInventory = purchase.nextState;
      const rewards: ChestOpenResult[] = [];

      const openResult = openChest(chestInventory, purchase.purchasedRarity, chestInventory.chestsPurchased, false);
      chestInventory = openResult.nextState;
      rewards.push(openResult.result);

      if (purchase.pityLegendaryAwarded) {
        const pityOpen = openChest(chestInventory, "legendary", chestInventory.chestsPurchased, true);
        chestInventory = pityOpen.nextState;
        rewards.push(pityOpen.result);
      }

      set({
        shop: {
          chestInventory,
          lastRewards: rewards,
        },
        progression: {
          ...state.progression,
          coins: chestInventory.coins,
        },
        character: {
          ...state.character,
          unlockedItemIds: mergeUnlockedItems(state.character.unlockedItemIds, chestInventory.inventory),
        },
        stats: {
          ...state.stats,
          boughtChestsTotal: state.stats.boughtChestsTotal + 1,
          openedChestsTotal: state.stats.openedChestsTotal + rewards.length,
        },
      });

      return { success: true };
    } catch {
      return { success: false, reason: "insufficient-coins" };
    }
  },

  buyBuff: (type, now) => {
    const state = get();
    const cost = BUFF_COSTS[type];

    if (isBuffActive(state.buffs, type, now)) {
      return { success: false, reason: "buff-already-active" };
    }

    if (state.progression.coins < cost) {
      return { success: false, reason: "insufficient-coins" };
    }

    const nextProgression = {
      ...state.progression,
      coins: state.progression.coins - cost,
    };

    set({
      progression: nextProgression,
      shop: {
        ...state.shop,
        chestInventory: syncChestCoins(nextProgression.coins, state.shop.chestInventory),
      },
      buffs: activateBuff(state.buffs, type, now),
    });

    return { success: true };
  },

  activateMockBuff: (type, now) => {
    set((state) => ({
      buffs: activateBuff(state.buffs, type, now),
    }));
  },

  runDebugTester: async (now) => {
    const state = get();
    const localProgress = toPersistedProgress(state);
    const debugResults = await runDebugSimulation({
      currentLanguage: state.settings.language,
      now,
      localProgress,
      validateFirebasePersistence: async () => {
        if (!state.authState.firebaseConfigured) {
          return {
            supported: false,
            success: true,
            details: "Firebase nao configurado; validacao remota ignorada.",
          };
        }

        if (!state.authState.user) {
          return {
            supported: false,
            success: true,
            details: "Sem login ativo; validacao remota ignorada.",
          };
        }

        try {
          await saveUserProgress(state.authState.user.uid, localProgress);
          const remoteProgress = await loadUserProgress(state.authState.user.uid);
          const matches = remoteProgress
            ? remoteProgress.progression.totalXp === localProgress.progression.totalXp &&
              remoteProgress.shop.chestInventory.chestsPurchased ===
                localProgress.shop.chestInventory.chestsPurchased &&
              remoteProgress.character.equipped.outfits === localProgress.character.equipped.outfits &&
              remoteProgress.dailyMissions.generatedForDay === localProgress.dailyMissions.generatedForDay
            : false;

          return {
            supported: true,
            success: matches,
            details: matches
              ? "Persistencia Firebase validada com save e load no Firestore."
              : "Persistencia Firebase retornou dados divergentes.",
          };
        } catch (error) {
          return {
            supported: true,
            success: false,
            details:
              error instanceof Error
                ? `Persistencia Firebase falhou: ${error.message}`
                : "Persistencia Firebase falhou.",
          };
        }
      },
    });

    set({
      debugResults,
    });
  },
}));
