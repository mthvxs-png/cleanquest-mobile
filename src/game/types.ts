export type Difficulty = "easy" | "medium" | "hard";

export type ChestRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export type CosmeticCategory =
  | "outfits"
  | "hats"
  | "pants"
  | "shoes"
  | "pets"
  | "backgrounds"
  | "auras";

export type BuffType = "doubleXp" | "doubleCoins" | "streakShield";

export type Room =
  | "kitchen"
  | "bedroom"
  | "livingRoom"
  | "bathroom"
  | "office"
  | "balcony"
  | "laundry"
  | "yard"
  | "garage"
  | "pantry"
  | "closet";

export type Language = "pt-BR" | "en" | "es";

export interface TaskDefinition {
  id: string;
  room: Room;
  title: string;
  difficulty: Difficulty;
  durationMinutes: number;
}

export interface Reward {
  xp: number;
  coins: number;
}

export interface TimedTaskRun {
  taskId: string;
  startedAt: number;
  minimumEndAt: number;
}

export interface MissionSubtask {
  id: string;
  labelKey: string;
  difficulty: Difficulty;
  durationMinutes: number;
}

export interface DailyMission {
  id: string;
  room: Room;
  subtasks: MissionSubtask[];
  createdAt: number;
  swapUsed: boolean;
}

export interface BuffState {
  type: BuffType;
  activeUntil: number;
}

export interface PlayerProgression {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpRequiredForNextLevel: number;
  coins: number;
}

export interface ChestOpenResult {
  rarity: ChestRarity;
  grantedCosmeticId: string;
  category: CosmeticCategory;
  pityTriggered: boolean;
}

export interface DailyMissionState {
  generatedForDay: string;
  missions: DailyMission[];
  rerollsLeft: number;
}

export interface ChestInventoryState {
  coins: number;
  chestsPurchased: number;
  inventory: string[];
}

export interface LoginRewardState {
  day: number;
  lastClaimDay?: string;
}

export interface PlayerStats {
  completedTasksTotal: number;
  completedMissionsTotal: number;
  openedChestsTotal: number;
  boughtChestsTotal: number;
  highestTasksInDay: number;
  currentDayTaskCount: number;
  currentDayKey?: string;
  bestStreak: number;
  dailyLoginRewardsClaimed: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
}
