import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import type { BuffState, BuffType } from "../game";
import type { GameStoreState } from "../types/app";
import { firestore } from "./firebase";

export interface PersistedProgress {
  version: number;
  progression: GameStoreState["progression"];
  streak: GameStoreState["streak"];
  buffs: Partial<Record<BuffType, BuffState>>;
  taskRuns: GameStoreState["taskRuns"];
  selectedTaskIds: GameStoreState["selectedTaskIds"];
  dailyMissions: GameStoreState["dailyMissions"];
  completedMissionIds: GameStoreState["completedMissionIds"];
  loginRewards: GameStoreState["loginRewards"];
  stats: GameStoreState["stats"];
  character: GameStoreState["character"];
  shop: {
    chestInventory: GameStoreState["shop"]["chestInventory"];
  };
}

const progressDocRef = (uid: string) => {
  if (!firestore) {
    throw new Error("Firestore is not configured.");
  }

  return doc(firestore, "users", uid);
};

const compactBuffs = (
  buffs: Partial<Record<BuffType, BuffState>>,
): Partial<Record<BuffType, BuffState>> => {
  return Object.entries(buffs).reduce<Partial<Record<BuffType, BuffState>>>((acc, [key, value]) => {
    if (value) {
      acc[key as BuffType] = value;
    }
    return acc;
  }, {});
};

export const toPersistedProgress = (state: GameStoreState): PersistedProgress => ({
  version: 1,
  progression: state.progression,
  streak: state.streak.lastLoginDay
    ? state.streak
    : {
        current: state.streak.current,
      },
  buffs: compactBuffs(state.buffs),
  taskRuns: state.taskRuns,
  selectedTaskIds: state.selectedTaskIds,
  dailyMissions: state.dailyMissions,
  completedMissionIds: state.completedMissionIds,
  loginRewards: state.loginRewards,
  stats: state.stats,
  character: state.character,
  shop: {
    chestInventory: state.shop.chestInventory,
  },
});

const isPersistedProgress = (value: DocumentData | undefined): value is PersistedProgress => {
  return Boolean(value && typeof value === "object" && "progression" in value && "character" in value);
};

export const loadUserProgress = async (uid: string): Promise<PersistedProgress | null> => {
  if (!firestore) {
    return null;
  }

  const snapshot = await getDoc(progressDocRef(uid));
  const data = snapshot.data();

  if (!snapshot.exists() || !isPersistedProgress(data)) {
    return null;
  }

  return data;
};

export const saveUserProgress = async (uid: string, progress: PersistedProgress): Promise<void> => {
  if (!firestore) {
    return;
  }

  await setDoc(
    progressDocRef(uid),
    {
      ...progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
