import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthCard } from "../components/AuthCard";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { VolumeControl } from "../components/VolumeControl";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import type { Language } from "../game";
import { useShallow } from "zustand/react/shallow";

const languages: Language[] = ["pt-BR", "en", "es"];

export const SettingsScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [isRunningDebug, setIsRunningDebug] = useState(false);
  const now = Date.now();
  const { settings, setLanguage, setSfxVolume, setMusicVolume, runDebugTester, debugResults, activateMockBuff } =
    useGameStore(
      useShallow((state) => ({
        settings: state.settings,
        setLanguage: state.setLanguage,
        setSfxVolume: state.setSfxVolume,
        setMusicVolume: state.setMusicVolume,
        runDebugTester: state.runDebugTester,
        debugResults: state.debugResults,
        activateMockBuff: state.activateMockBuff,
      })),
    );

  return (
    <ScreenContainer>
      <AuthCard mode="compact" />

      <Card>
        <Text style={styles.cardTitle}>{t("settings.language")}</Text>
        <View style={styles.optionRow}>
          {languages.map((language) => (
            <PrimaryButton
              key={language}
              label={language}
              onPress={() => {
                void setLanguage(language);
              }}
              tone={settings.language === language ? "primary" : "secondary"}
            />
          ))}
        </View>
      </Card>

      <Card>
        <VolumeControl label={t("settings.sfxVolume")} value={settings.sfxVolume} onChange={setSfxVolume} />
        <View style={styles.spacer} />
        <VolumeControl label={t("settings.musicVolume")} value={settings.musicVolume} onChange={setMusicVolume} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>{t("settings.debug")}</Text>
        <View style={styles.optionRow}>
          <PrimaryButton
            label={t("settings.mockBuffXp")}
            onPress={() => activateMockBuff("doubleXp", now)}
            tone="secondary"
          />
          <PrimaryButton
            label={t("settings.mockBuffCoins")}
            onPress={() => activateMockBuff("doubleCoins", now)}
            tone="accent"
          />
        </View>
        <View style={styles.spacer} />
        <PrimaryButton
          label={isRunningDebug ? t("settings.runningDebug") : t("settings.runDebug")}
          onPress={() => {
            setIsRunningDebug(true);
            void runDebugTester(now).finally(() => {
              setIsRunningDebug(false);
            });
          }}
          disabled={isRunningDebug}
        />
        <View style={styles.results}>
          {debugResults.map((result) => (
            <View key={result.key} style={styles.resultRow}>
              <Text style={styles.resultTitle}>{`${result.success ? "[ok]" : "[x]"} ${result.label}`}</Text>
              <Text style={styles.resultStatus}>{result.success ? t("debug.success") : t("debug.failed")}</Text>
              <Text style={styles.resultDetails}>{result.details}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  spacer: {
    height: theme.spacing.md,
  },
  results: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  resultRow: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  resultTitle: {
    color: theme.colors.text,
    fontWeight: "800",
  },
  resultStatus: {
    color: theme.colors.textMuted,
    marginTop: 4,
    fontWeight: "700",
  },
  resultDetails: {
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
