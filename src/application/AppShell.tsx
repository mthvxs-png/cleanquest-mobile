import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { HomeScreen } from "../screens/HomeScreen";
import { TasksScreen } from "../screens/TasksScreen";
import { MissionsScreen } from "../screens/MissionsScreen";
import { AvatarScreen } from "../screens/AvatarScreen";
import { ShopScreen } from "../screens/ShopScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import type { AppTab } from "../types/app";
import { useShallow } from "zustand/react/shallow";
import { useNowTicker } from "./useNowTicker";

const tabs: AppTab[] = ["home", "tasks", "missions", "shop", "avatar"];

export const AppShell = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [showSettings, setShowSettings] = useState(false);
  const now = useNowTicker();
  const { authState, syncDailyState, syncTaskRuns } = useGameStore(
    useShallow((state) => ({
      authState: state.authState,
      syncDailyState: state.syncDailyState,
      syncTaskRuns: state.syncTaskRuns,
    })),
  );

  useEffect(() => {
    syncDailyState(now);
    syncTaskRuns(now);
  }, [now, syncDailyState, syncTaskRuns]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t("app.title")}</Text>
          <Text style={styles.headerSubtitle}>
            {showSettings ? t("settings.title") : t(`tabs.${activeTab}`)}
          </Text>
        </View>
        <Pressable onPress={() => setShowSettings((current) => !current)} style={styles.settingsButton}>
          <Text style={styles.settingsLabel}>{t("settings.title")}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>{showSettings ? <SettingsScreen /> : renderScreen(activeTab)}</View>

      {authState.lastSyncedAt ? (
        <Text style={styles.syncText}>
          {t("auth.lastSync", { time: new Date(authState.lastSyncedAt).toLocaleTimeString() })}
        </Text>
      ) : null}

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab && !showSettings;
          const isMission = tab === "missions";

          return (
            <Pressable
              key={tab}
              onPress={() => {
                setShowSettings(false);
                setActiveTab(tab);
              }}
              style={[
                styles.tab,
                isMission && styles.missionTab,
                isActive && styles.tabActive,
                isMission && isActive && styles.missionTabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isMission && styles.missionTabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {t(`tabs.${tab}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const renderScreen = (tab: AppTab): React.JSX.Element => {
  switch (tab) {
    case "home":
      return <HomeScreen />;
    case "tasks":
      return <TasksScreen />;
    case "missions":
      return <MissionsScreen />;
    case "shop":
      return <ShopScreen />;
    case "avatar":
      return <AvatarScreen />;
    default:
      return <HomeScreen />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: "700",
  },
  settingsButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingsLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  missionTab: {
    backgroundColor: "#FBE2A7",
    transform: [{ translateY: -6 }],
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  missionTabActive: {
    backgroundColor: "#F3B74E",
  },
  tabLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },
  missionTabLabel: {
    color: theme.colors.text,
  },
  tabLabelActive: {
    color: theme.colors.surface,
  },
  syncText: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 12,
    paddingTop: 4,
  },
});
