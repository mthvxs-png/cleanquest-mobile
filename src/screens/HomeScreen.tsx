import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../components/Card";
import { AuthCard } from "../components/AuthCard";
import { AvatarPreview } from "../components/AvatarPreview";
import { ScreenContainer } from "../components/ScreenContainer";
import { getFixedTasks } from "../game";
import { formatCountdown } from "../application/formatters";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import { useNowTicker } from "../application/useNowTicker";
import { useShallow } from "zustand/react/shallow";

const tasks = getFixedTasks();

export const HomeScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const now = useNowTicker();
  const { authState, character, progression, streak, buffs, selectedTaskIds, taskRuns } = useGameStore(
    useShallow((state) => ({
      authState: state.authState,
      character: state.character,
      progression: state.progression,
      streak: state.streak,
      buffs: state.buffs,
      selectedTaskIds: state.selectedTaskIds,
      taskRuns: state.taskRuns,
    })),
  );

  const activeBuffs = Object.values(buffs).filter((buff): buff is NonNullable<typeof buff> => Boolean(buff && buff.activeUntil > now));
  const selectedTasks = selectedTaskIds
    .map((taskId) => tasks.find((task) => task.id === taskId))
    .filter((task): task is NonNullable<typeof task> => Boolean(task));

  return (
    <ScreenContainer>
      {authState.status !== "signedIn" ? <AuthCard mode="full" /> : null}

      <Card style={styles.heroCard}>
        <AvatarPreview character={character} size="sm" />
        <View style={styles.heroText}>
          <Text style={styles.title}>{t("home.welcome")}</Text>
          <Text style={styles.subtitle}>{t("app.subtitle")}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>{t("home.levelShort", { level: progression.level })}</Text>
            <Text style={styles.statText}>{t("home.xpShort", { current: progression.xpIntoLevel, required: progression.xpRequiredForNextLevel })}</Text>
            <Text style={styles.statText}>{t("home.coinsShort", { count: progression.coins })}</Text>
            <Text style={styles.statText}>{t("home.streakShort", { count: streak.current })}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardLabel}>{t("home.activeBuffs")}</Text>
        {activeBuffs.length === 0 ? (
          <Text style={styles.emptyText}>{t("home.none")}</Text>
        ) : (
          <View style={styles.buffList}>
            {activeBuffs.map((buff) => (
              <View key={buff.type} style={styles.buffChip}>
                <Text style={styles.buffName}>{t(`buffs.${buff.type}`)}</Text>
                <Text style={styles.buffTimer}>{formatCountdown(buff.activeUntil, now)}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        {selectedTasks.length === 0 ? (
          <Text style={styles.emptyText}>{t("home.noTasksSelected")}</Text>
        ) : (
          <View style={styles.selectedList}>
            {selectedTasks.map((task) => {
              const run = taskRuns[task.id];
              return (
                <View key={task.id} style={styles.selectedTaskRow}>
                  <View style={styles.selectedTaskText}>
                    <Text style={styles.selectedTaskTitle}>{task.title}</Text>
                    <Text style={styles.selectedTaskMeta}>
                      {t(`missions.room.${task.room}`)} | {t(`tasks.${task.difficulty}`)} | {t("tasks.duration", { minutes: task.durationMinutes })}
                    </Text>
                  </View>
                  <Text style={styles.selectedTaskStatus}>
                    {run ? formatCountdown(run.minimumEndAt, now) : t("tasks.ready")}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: theme.colors.surfaceAlt,
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
  },
  statText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "800",
    backgroundColor: theme.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: theme.radius.md,
    textAlign: "center",
  },
  cardLabel: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  buffList: {
    gap: theme.spacing.sm,
  },
  buffChip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  buffName: {
    color: theme.colors.text,
    fontWeight: "800",
  },
  buffTimer: {
    color: theme.colors.textMuted,
    fontWeight: "700",
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  selectedList: {
    gap: theme.spacing.sm,
  },
  selectedTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  selectedTaskText: {
    flex: 1,
    gap: 4,
  },
  selectedTaskTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  selectedTaskMeta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  selectedTaskStatus: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
});
