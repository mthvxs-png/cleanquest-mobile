import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenContainer } from "../components/ScreenContainer";
import { calculateMissionReward } from "../game";
import { isMissionCompleted } from "../application/formatters";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import { useNowTicker } from "../application/useNowTicker";
import { useShallow } from "zustand/react/shallow";

export const MissionsScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const now = useNowTicker(5000);
  const { dailyMissions, completedMissionIds, rerollDailyMission, completeMission, loginRewards } = useGameStore(
    useShallow((state) => ({
      dailyMissions: state.dailyMissions,
      completedMissionIds: state.completedMissionIds,
      rerollDailyMission: state.rerollDailyMission,
      completeMission: state.completeMission,
      loginRewards: state.loginRewards,
    })),
  );

  return (
    <ScreenContainer>
      <Card style={styles.loginCard}>
        <Text style={styles.loginTitle}>{t("missions.loginRewardTitle")}</Text>
        <Text style={styles.loginText}>{t("missions.loginRewardSubtitle")}</Text>
        <ProgressBar progress={Math.min(loginRewards.day, 7) / 7} tone="accent" />
        <Text style={styles.loginMeta}>{t("missions.loginRewardProgress", { current: Math.min(loginRewards.day, 7), total: 7 })}</Text>
      </Card>

      <Text style={styles.meta}>{t("missions.rerollsLeft", { count: dailyMissions.rerollsLeft })}</Text>

      {dailyMissions.missions.map((mission) => {
        const reward = calculateMissionReward(mission);
        const completed = isMissionCompleted(mission, completedMissionIds);

        return (
          <Card key={mission.id}>
            <Text style={styles.room}>{t(`missions.room.${mission.room}`)}</Text>
            <Text style={styles.reward}>{t("missions.reward", { xp: reward.xp, coins: reward.coins })}</Text>
            <View style={styles.subtasks}>
              {mission.subtasks.map((subtask) => (
                <View key={subtask.id} style={styles.subtaskRow}>
                  <Text style={styles.subtaskLabel}>{t(subtask.labelKey)}</Text>
                  <Text style={styles.subtaskMeta}>
                    {t(`tasks.${subtask.difficulty}`)} | {t("tasks.duration", { minutes: subtask.durationMinutes })}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.actions}>
              <PrimaryButton
                label={t("missions.swap")}
                onPress={() => {
                  void rerollDailyMission(mission.id, now);
                }}
                disabled={mission.swapUsed || dailyMissions.rerollsLeft <= 0}
                tone="secondary"
              />
              <PrimaryButton
                label={completed ? t("missions.completed") : t("missions.complete")}
                onPress={() => {
                  void completeMission(mission.id, now);
                }}
                disabled={completed}
                tone="accent"
              />
            </View>
          </Card>
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loginCard: {
    backgroundColor: "#FFF1C7",
    gap: theme.spacing.sm,
  },
  loginTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  loginText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  loginMeta: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 13,
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  room: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  reward: {
    marginTop: theme.spacing.xs,
    color: theme.colors.success,
    fontWeight: "700",
  },
  subtasks: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  subtaskRow: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
  },
  subtaskLabel: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  subtaskMeta: {
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
});
