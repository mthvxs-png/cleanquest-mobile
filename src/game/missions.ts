import { ROOM_POOL, ROOM_SUBTASKS, TASK_REWARDS } from "./constants";
import type { DailyMission, DailyMissionState, Room } from "./types";

const DAILY_REROLLS = 3;

export const getDayKey = (timestamp: number): string => {
  return new Date(timestamp).toISOString().slice(0, 10);
};

const rotateRoom = (offset: number): Room => ROOM_POOL[offset % ROOM_POOL.length];

export const generateDailyMissions = (timestamp: number): DailyMissionState => {
  const seed = Math.floor(timestamp / (24 * 60 * 60 * 1000));

  const missions = Array.from({ length: 3 }, (_, index) => {
    const room = rotateRoom(seed + index);
    return {
      id: `${getDayKey(timestamp)}-${room}-${index}`,
      room,
      subtasks: ROOM_SUBTASKS[room],
      createdAt: timestamp,
      swapUsed: false,
    };
  });

  return {
    generatedForDay: getDayKey(timestamp),
    missions,
    rerollsLeft: DAILY_REROLLS,
  };
};

export const rerollMission = (
  state: DailyMissionState,
  missionId: string,
  timestamp: number,
): DailyMissionState => {
  if (state.rerollsLeft <= 0) {
    throw new Error("No rerolls left");
  }

  const missionIndex = state.missions.findIndex((mission) => mission.id === missionId);
  if (missionIndex === -1) {
    throw new Error("Mission not found");
  }

  if (state.missions[missionIndex].swapUsed) {
    throw new Error("Mission already swapped");
  }

  const room = rotateRoom(
    Math.floor(timestamp / (24 * 60 * 60 * 1000)) + missionIndex + (3 - state.rerollsLeft) + 4,
  );

  const rerolledMission: DailyMission = {
    id: `${getDayKey(timestamp)}-${room}-${missionIndex}-${state.rerollsLeft}`,
    room,
    subtasks: ROOM_SUBTASKS[room],
    createdAt: timestamp,
    swapUsed: true,
  };

  const missions = [...state.missions];
  missions[missionIndex] = rerolledMission;

  return {
    ...state,
    missions,
    rerollsLeft: state.rerollsLeft - 1,
  };
};

export const calculateMissionReward = (mission: DailyMission): { xp: number; coins: number } => {
  const subtotal = mission.subtasks.reduce(
    (acc, subtask) => {
      const reward = TASK_REWARDS[subtask.difficulty];
      return {
        xp: acc.xp + reward.xp,
        coins: acc.coins + reward.coins,
      };
    },
    { xp: 0, coins: 0 },
  );

  return {
    xp: Math.round(subtotal.xp * 1.5),
    coins: Math.round(subtotal.coins * 1.5),
  };
};
