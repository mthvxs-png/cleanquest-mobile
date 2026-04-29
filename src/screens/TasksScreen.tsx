import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { getFixedTasks, getTaskReward, type Room } from "../game";
import { getTaskProgressLabel } from "../application/formatters";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import { useNowTicker } from "../application/useNowTicker";
import { useShallow } from "zustand/react/shallow";

const roomOrder: Room[] = [
  "bedroom",
  "livingRoom",
  "kitchen",
  "bathroom",
  "office",
  "balcony",
  "laundry",
  "yard",
  "garage",
];

const tasks = getFixedTasks();

export const TasksScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const now = useNowTicker();
  const { selectedTaskIds, taskRuns, toggleTaskSelection, startTask, completeTask, completeTaskInstantly } = useGameStore(
    useShallow((state) => ({
      selectedTaskIds: state.selectedTaskIds,
      taskRuns: state.taskRuns,
      toggleTaskSelection: state.toggleTaskSelection,
      startTask: state.startTask,
      completeTask: state.completeTask,
      completeTaskInstantly: state.completeTaskInstantly,
    })),
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t("tasks.title")}</Text>
      <Text style={styles.subtitle}>{t("tasks.subtitle")}</Text>

      {roomOrder.map((room) => {
        const roomTasks = tasks.filter((task) => task.room === room);
        if (roomTasks.length === 0) {
          return null;
        }

        return (
          <View key={room} style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`missions.room.${room}`)}</Text>
            {roomTasks.map((task) => {
              const reward = getTaskReward(task.difficulty);
              const run = taskRuns[task.id];
              const canComplete = Boolean(run && run.minimumEndAt <= now);
              const isSelected = selectedTaskIds.includes(task.id);

              return (
                <Card key={task.id} style={isSelected ? styles.cardSelected : undefined} variant={isSelected ? "selected" : "base"}>
                  <View style={styles.topRow}>
                    <View style={styles.taskText}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskMeta}>
                        {t(`tasks.${task.difficulty}`)} | {t("tasks.duration", { minutes: task.durationMinutes })}
                      </Text>
                      <Text style={styles.taskReward}>{t("tasks.rewards", { xp: reward.xp, coins: reward.coins })}</Text>
                    </View>
                    <PrimaryButton
                      label={isSelected ? t("tasks.remove") : t("tasks.select")}
                      onPress={() => toggleTaskSelection(task.id)}
                      tone={isSelected ? "accent" : "secondary"}
                      selected={isSelected}
                    />
                  </View>

                  {run ? (
                    <View style={styles.actions}>
                      <Text style={styles.timer}>{t("tasks.timer", { time: getTaskProgressLabel(run, now) })}</Text>
                      <View style={styles.buttonRow}>
                        <PrimaryButton
                          label={t("tasks.complete")}
                          onPress={() => {
                            void completeTask(task.id, now);
                          }}
                          disabled={!canComplete}
                          tone="primary"
                          style={styles.actionButton}
                        />
                        <PrimaryButton
                          label={t("tasks.completeNow")}
                          onPress={() => {
                            void completeTaskInstantly(task.id, now);
                          }}
                          tone="accent"
                          style={styles.actionButton}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.buttonRow}>
                      <PrimaryButton label={t("tasks.start")} onPress={() => startTask(task.id, now)} style={styles.actionButton} />
                      <PrimaryButton
                        label={t("tasks.completeNow")}
                        onPress={() => {
                          void completeTaskInstantly(task.id, now);
                        }}
                        tone="accent"
                        style={styles.actionButton}
                      />
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  cardSelected: {
    borderColor: theme.colors.primary,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  taskText: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  taskMeta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  taskReward: {
    color: theme.colors.success,
    fontWeight: "800",
    fontSize: 13,
  },
  actions: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  timer: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
