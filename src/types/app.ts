import type {
  BuffState,
  BuffType,
  ChestInventoryState,
  ChestOpenResult,
  ChestRarity,
  CosmeticCategory,
  DailyMissionState,
  Language,
  LoginRewardState,
  PlayerStats,
  PlayerProgression,
  StreakState,
  TimedTaskRun,
} from "../game";
import type { DebugResult } from "../game/debugTester";

export type AppTab = "home" | "tasks" | "missions" | "shop" | "avatar";

export type CharacterBodyType = "male" | "female";

export interface CosmeticDefinition {
  id: string;
  category: CosmeticCategory;
  rarity: ChestRarity;
  nameKey: string;
}

export interface CharacterState {
  bodyType: CharacterBodyType;
  equipped: Record<CosmeticCategory, string>;
  unlockedItemIds: string[];
}

export interface SettingsState {
  language: Language;
  sfxVolume: number;
  musicVolume: number;
}

export interface AuthUserSummary {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthState {
  firebaseConfigured: boolean;
  status: "idle" | "checking" | "signedOut" | "signedIn";
  user: AuthUserSummary | null;
  remoteLoaded: boolean;
  error: string | null;
  lastSyncedAt?: number;
}

export interface ShopState {
  chestInventory: ChestInventoryState;
  lastRewards: ChestOpenResult[];
}

export interface GameStoreState {
  authState: AuthState;
  progression: PlayerProgression;
  streak: StreakState;
  buffs: Partial<Record<BuffType, BuffState>>;
  taskRuns: Partial<Record<string, TimedTaskRun>>;
  selectedTaskIds: string[];
  dailyMissions: DailyMissionState;
  completedMissionIds: string[];
  loginRewards: LoginRewardState;
  stats: PlayerStats;
  character: CharacterState;
  settings: SettingsState;
  shop: ShopState;
  debugResults: DebugResult[];
}
