import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
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
import { PixelIcon } from "../components/PixelIcon";
import { uiAssets } from "../theme/uiAssets";

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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{t("app.title")}</Text>
          <Text style={styles.headerSubtitle}>
            {showSettings ? t("settings.title") : t(`tabs.${activeTab}`)}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {activeTab !== "home" && !showSettings ? (
            <Pressable
              onPress={() => {
                setActiveTab("home");
              }}
              style={styles.headerButton}
            >
              <Image source={uiAssets.buttons.back} style={styles.headerButtonImage} resizeMode="contain" />
            </Pressable>
          ) : null}
          <Pressable onPress={() => setShowSettings((current) => !current)} style={styles.headerButton}>
            <Image source={showSettings ? uiAssets.buttons.close : uiAssets.buttons.settings} style={styles.headerButtonImage} resizeMode="contain" />
          </Pressable>
        </View>
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
          const tabBackground = isMission && isActive ? uiAssets.buttons.tab.missionsActive : isActive ? uiAssets.buttons.tab.active : uiAssets.buttons.tab.inactive;
          const iconName =
            tab === "home"
              ? "home"
              : tab === "tasks"
                ? "tasks"
                : tab === "missions"
                  ? "missions"
                  : tab === "shop"
                    ? "shop"
                    : "avatar";

          return (
            <Pressable
              key={tab}
              onPress={() => {
                setShowSettings(false);
                setActiveTab(tab);
              }}
              style={[styles.tab, isMission && styles.missionTab]}
            >
              <ImageBackground source={tabBackground} style={styles.tabBackground} imageStyle={styles.tabBackgroundImage} resizeMode="stretch">
                <PixelIcon name={iconName} size={26} style={isActive ? styles.tabIconActive : styles.tabIconInactive} />
                <Text
                  style={[
                    styles.tabLabel,
                    isMission && styles.missionTabLabel,
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {t(`tabs.${tab}`)}
                </Text>
              </ImageBackground>
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
    paddingBottom: theme.spacing.xs,
  },
  headerInfo: {
    flex: 1,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  headerButton: {
    width: 52,
    height: 52,
  },
  headerButtonImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    minHeight: 88,
  },
  missionTab: {
    transform: [{ translateY: -6 }],
  },
  tabBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 12,
    gap: 4,
  },
  tabBackgroundImage: {
    resizeMode: "stretch",
  },
  tabLabel: {
    color: "#E9D7B8",
    fontSize: 10,
    fontWeight: "800",
  },
  missionTabLabel: {
    color: "#FFF7E0",
  },
  tabLabelActive: {
    color: "#FFF7E0",
  },
  tabIconInactive: {
    opacity: 0.92,
  },
  tabIconActive: {
    opacity: 1,
  },
  syncText: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 12,
    paddingTop: 4,
  },
});
