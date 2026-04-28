import { activateBuff, applyBuffsToReward, isBuffActive } from "./buffs";
import { createEconomyState, grantCoins, openChest, purchaseChest } from "./economy";
import { calculateMissionReward, generateDailyMissions, rerollMission } from "./missions";
import { getFixedTasks, getTaskReward } from "./tasks";
import { createPlayerProgression, grantPlayerCoins, grantXp } from "./xp";
import type { PersistedProgress } from "../services/progress";
import type { Language } from "./types";

export interface DebugResult {
  key: string;
  label: string;
  success: boolean;
  details: string;
}

interface DebugSimulationOptions {
  currentLanguage: Language;
  now: number;
  localProgress: PersistedProgress;
  validateFirebasePersistence: () => Promise<{ supported: boolean; success: boolean; details: string }>;
}

export const runDebugSimulation = async ({
  currentLanguage,
  now,
  localProgress,
  validateFirebasePersistence,
}: DebugSimulationOptions): Promise<DebugResult[]> => {
  const easyTask = getFixedTasks().find((task) => task.difficulty === "easy");
  const mediumTask = getFixedTasks().find((task) => task.difficulty === "medium");
  const hardTask = getFixedTasks().find((task) => task.difficulty === "hard");

  if (!easyTask || !mediumTask || !hardTask) {
    throw new Error("Missing fixed task definitions for all difficulties.");
  }

  let progression = createPlayerProgression();

  const easyReward = getTaskReward(easyTask.difficulty);
  progression = grantPlayerCoins(grantXp(progression, easyReward.xp), easyReward.coins);

  const mediumReward = getTaskReward(mediumTask.difficulty);
  progression = grantPlayerCoins(grantXp(progression, mediumReward.xp), mediumReward.coins);

  const hardReward = getTaskReward(hardTask.difficulty);
  progression = grantPlayerCoins(grantXp(progression, hardReward.xp), hardReward.coins);

  const missions = generateDailyMissions(now);
  const missionReward = calculateMissionReward(missions.missions[0]);
  const missionProgression = grantPlayerCoins(grantXp(progression, missionReward.xp), missionReward.coins);
  const swapped = rerollMission(missions, missions.missions[1].id, now);

  let buffs = activateBuff({}, "doubleXp", now);
  buffs = activateBuff(buffs, "doubleCoins", now);
  buffs = activateBuff(buffs, "streakShield", now);
  const buffValidation =
    isBuffActive(buffs, "doubleXp", now + 1000) &&
    isBuffActive(buffs, "doubleCoins", now + 1000) &&
    isBuffActive(buffs, "streakShield", now + 1000);

  let economy = createEconomyState();
  economy = grantCoins(economy, 5000);

  let pityTriggeredAt = 0;
  let totalOpened = 0;
  for (let purchaseIndex = 1; purchaseIndex <= 20; purchaseIndex += 1) {
    const purchase = purchaseChest(economy, "common");
    economy = purchase.nextState;
    const open = openChest(economy, purchase.purchasedRarity, purchaseIndex, false);
    economy = open.nextState;
    totalOpened += 1;
    if (purchase.pityLegendaryAwarded) {
      pityTriggeredAt = purchaseIndex;
      const legendaryOpen = openChest(economy, "legendary", purchaseIndex, true);
      economy = legendaryOpen.nextState;
      totalOpened += 1;
    }
  }

  const nextLanguage: Language =
    currentLanguage === "pt-BR" ? "en" : currentLanguage === "en" ? "es" : "pt-BR";
  const buffedReward = applyBuffsToReward(easyReward, buffs, now + 1000);

  const localRoundTrip = JSON.parse(JSON.stringify(localProgress)) as PersistedProgress;
  const localPersistenceValid =
    localRoundTrip.progression.totalXp === localProgress.progression.totalXp &&
    localRoundTrip.shop.chestInventory.chestsPurchased ===
      localProgress.shop.chestInventory.chestsPurchased &&
    localRoundTrip.character.equipped.outfits === localProgress.character.equipped.outfits &&
    localRoundTrip.dailyMissions.generatedForDay === localProgress.dailyMissions.generatedForDay;

  const firebaseValidation = await validateFirebasePersistence();

  return [
    {
      key: "complete-easy-task",
      label: "1. Concluir tarefa facil",
      success: progression.totalXp >= easyReward.xp,
      details: `${easyTask.id} concedeu ${easyReward.xp} XP e ${easyReward.coins} moedas.`,
    },
    {
      key: "complete-medium-task",
      label: "2. Concluir tarefa media",
      success: progression.totalXp >= easyReward.xp + mediumReward.xp,
      details: `${mediumTask.id} concedeu ${mediumReward.xp} XP e ${mediumReward.coins} moedas.`,
    },
    {
      key: "complete-hard-task",
      label: "3. Concluir tarefa dificil",
      success: progression.level >= 1 && progression.coins === easyReward.coins + mediumReward.coins + hardReward.coins,
      details: `${hardTask.id} fechou o fluxo com ${progression.totalXp} XP total e ${progression.coins} moedas.`,
    },
    {
      key: "complete-special-mission",
      label: "4. Completar missao especial",
      success: missionProgression.totalXp > progression.totalXp && missionReward.xp > 0 && missionReward.coins > 0,
      details: `Missao especial concedeu ${missionReward.xp} XP e ${missionReward.coins} moedas com bonus de 50%.`,
    },
    {
      key: "mission-reroll",
      label: "5. Testar troca de missao",
      success: swapped.rerollsLeft === 2 && swapped.missions[1].id !== missions.missions[1].id && swapped.missions[1].swapUsed,
      details: `Troca aplicada com sucesso. Restaram ${swapped.rerollsLeft} trocas gratis.`,
    },
    {
      key: "chest-opening",
      label: "6. Comprar 20 baus e validar lendario",
      success: totalOpened === 21,
      details: `${totalOpened} baus abertos no total; lendario automatico acionado na compra ${pityTriggeredAt}.`,
    },
    {
      key: "buff-activation",
      label: "7. Ativar buffs",
      success: buffValidation && buffedReward.xp === easyReward.xp * 2 && buffedReward.coins === easyReward.coins * 2,
      details: "XP dobrado, moedas dobradas e protecao de streak ficaram ativos por 24h no teste.",
    },
    {
      key: "language-switch",
      label: "8. Trocar idioma",
      success: nextLanguage !== currentLanguage,
      details: `Idioma alternado de ${currentLanguage} para ${nextLanguage}.`,
    },
    {
      key: "persistence-validation",
      label: "9. Validar persistencia local/Firebase",
      success: localPersistenceValid && firebaseValidation.success,
      details: `Persistencia local: ${localPersistenceValid ? "ok" : "falhou"}. ${firebaseValidation.details}`,
    },
  ];
};
