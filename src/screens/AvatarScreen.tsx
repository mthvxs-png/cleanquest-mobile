import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { AvatarPreview } from "../components/AvatarPreview";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenContainer } from "../components/ScreenContainer";
import { COSMETIC_DEFINITIONS } from "../application/mockData";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import type { CosmeticCategory } from "../game";
import { useShallow } from "zustand/react/shallow";

const categories: CosmeticCategory[] = ["outfits", "hats", "pants", "shoes", "pets", "backgrounds", "auras"];

export const AvatarScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [activePanel, setActivePanel] = useState<"achievements" | "inventory">("inventory");
  const { character, progression, stats, setBodyType, equipItem } = useGameStore(
    useShallow((state) => ({
      character: state.character,
      progression: state.progression,
      stats: state.stats,
      setBodyType: state.setBodyType,
      equipItem: state.equipItem,
    })),
  );

  return (
    <ScreenContainer>
      <Card style={styles.previewCard} variant="panelDark">
        <AvatarPreview character={character} size="lg" />
        <Text style={styles.levelText}>{t("home.level", { level: progression.level })}</Text>
        <ProgressBar progress={((progression.level - 1) % 10 + 1) / 10} tone="secondary" />
        <Text style={styles.xpText}>{t("home.xp", { current: progression.xpIntoLevel, required: progression.xpRequiredForNextLevel })}</Text>
        <ProgressBar progress={progression.xpIntoLevel / progression.xpRequiredForNextLevel} tone="primary" />
        <View style={styles.toggleRow}>
          <PrimaryButton
            label={t("avatar.achievements")}
            onPress={() => setActivePanel("achievements")}
            tone={activePanel === "achievements" ? "accent" : "secondary"}
            selected={activePanel === "achievements"}
            style={styles.toggleButton}
          />
          <PrimaryButton
            label={t("avatar.inventory")}
            onPress={() => setActivePanel("inventory")}
            tone={activePanel === "inventory" ? "accent" : "secondary"}
            selected={activePanel === "inventory"}
            style={styles.toggleButton}
          />
        </View>
        <View style={styles.toggleRow}>
          <PrimaryButton
            label={t("character.female")}
            onPress={() => setBodyType("female")}
            tone={character.bodyType === "female" ? "accent" : "secondary"}
            selected={character.bodyType === "female"}
            style={styles.toggleButton}
          />
          <PrimaryButton
            label={t("character.male")}
            onPress={() => setBodyType("male")}
            tone={character.bodyType === "male" ? "accent" : "secondary"}
            selected={character.bodyType === "male"}
            style={styles.toggleButton}
          />
        </View>
      </Card>

      {activePanel === "inventory" ? (
        categories.map((category) => {
          const items = Object.values(COSMETIC_DEFINITIONS).filter((item) => item.category === category);

          return (
            <Card key={category}>
              <Text style={styles.panelTitle}>{t(`character.categories.${category}`)}</Text>
              <View style={styles.inventoryList}>
                {items.map((item) => {
                  const unlocked = character.unlockedItemIds.includes(item.id);
                  const equipped = character.equipped[category] === item.id;

                  return (
                    <View key={item.id} style={[styles.inventoryItem, equipped && styles.equippedItem]}>
                      <View style={styles.inventoryText}>
                        <Text style={styles.inventoryName}>{t(item.nameKey)}</Text>
                        <Text style={styles.inventoryMeta}>
                          {t(`shop.rarities.${item.rarity}`)} · {unlocked ? t("avatar.unlocked") : t("avatar.locked")}
                        </Text>
                      </View>
                      <PrimaryButton
                        label={equipped ? t("avatar.equipped") : unlocked ? t("avatar.equip") : t("avatar.locked")}
                        onPress={() => equipItem(category, item.id)}
                        disabled={!unlocked}
                        tone={equipped ? "accent" : "secondary"}
                        selected={equipped}
                      />
                    </View>
                  );
                })}
              </View>
            </Card>
          );
        })
      ) : (
        <Card>
          <Text style={styles.panelTitle}>{t("avatar.achievements")}</Text>
          <View style={styles.achievementList}>
            <Text style={styles.achievementLine}>{t("avatar.chestsOpened", { count: stats.openedChestsTotal })}</Text>
            <Text style={styles.achievementLine}>{t("avatar.boughtChests", { count: stats.boughtChestsTotal })}</Text>
            <Text style={styles.achievementLine}>{t("avatar.highestTasksInDay", { count: stats.highestTasksInDay })}</Text>
            <Text style={styles.achievementLine}>{t("avatar.bestStreak", { count: stats.bestStreak })}</Text>
            <Text style={styles.achievementLine}>{t("avatar.completedMissions", { count: stats.completedMissionsTotal })}</Text>
            <Text style={styles.achievementLine}>{t("avatar.totalXpEarned", { count: stats.totalXpEarned })}</Text>
            <Text style={styles.achievementLine}>{t("avatar.totalCoinsEarned", { count: stats.totalCoinsEarned })}</Text>
          </View>
        </Card>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  previewCard: {
    gap: theme.spacing.sm,
  },
  levelText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  xpText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  toggleRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  toggleButton: {
    flex: 1,
  },
  panelTitle: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  inventoryList: {
    gap: theme.spacing.sm,
  },
  inventoryItem: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  equippedItem: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  inventoryText: {
    flex: 1,
    gap: 4,
  },
  inventoryName: {
    color: theme.colors.text,
    fontWeight: "800",
  },
  inventoryMeta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  achievementList: {
    gap: theme.spacing.sm,
  },
  achievementLine: {
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    fontWeight: "700",
  },
});
