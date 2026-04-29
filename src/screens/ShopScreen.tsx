import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { BUFF_COSTS, CHEST_COSTS, isBuffActive, type BuffType, type ChestRarity } from "../game";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import { useNowTicker } from "../application/useNowTicker";
import { useShallow } from "zustand/react/shallow";

const chestRarities: ChestRarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
const buffTypes: BuffType[] = ["streakShield", "doubleXp", "doubleCoins"];

export const ShopScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const now = useNowTicker();
  const { shop, buffs, progression, buyChest, buyBuff } = useGameStore(
    useShallow((state) => ({
      shop: state.shop,
      buffs: state.buffs,
      progression: state.progression,
      buyChest: state.buyChest,
      buyBuff: state.buyBuff,
    })),
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t("shop.title")}</Text>
      <Text style={styles.meta}>{t("shop.pity", { count: shop.chestInventory.chestsPurchased % 20, total: 20 })}</Text>

      <Card>
        <Text style={styles.sectionTitle}>{t("shop.buffsTitle")}</Text>
        <View style={styles.buffList}>
          {buffTypes.map((buffType) => {
            const active = isBuffActive(buffs, buffType, now);
            return (
              <View key={buffType} style={styles.buffRow}>
                <View style={styles.buffText}>
                  <Text style={styles.buffName}>{t(`buffs.${buffType}`)}</Text>
                  <Text style={styles.buffMeta}>{t("shop.cost", { cost: BUFF_COSTS[buffType] })}</Text>
                </View>
                <PrimaryButton
                  label={active ? t("shop.activeBuff") : t("shop.buy")}
                  onPress={() => {
                    void buyBuff(buffType, now);
                  }}
                  disabled={active || progression.coins < BUFF_COSTS[buffType]}
                  tone="secondary"
                  selected={active}
                />
              </View>
            );
          })}
        </View>
      </Card>

      {chestRarities.map((rarity) => (
        <Card key={rarity} variant={rarity === "legendary" ? "reward" : "base"}>
          <Text style={styles.rarity}>{t(`shop.rarities.${rarity}`)}</Text>
          <Text style={styles.cost}>{t("shop.cost", { cost: CHEST_COSTS[rarity] })}</Text>
          <PrimaryButton
            label={t("shop.buy")}
            onPress={() => {
              void buyChest(rarity);
            }}
            disabled={shop.chestInventory.coins < CHEST_COSTS[rarity]}
            style={styles.buyButton}
          />
        </Card>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: theme.spacing.sm,
  },
  buffList: {
    gap: theme.spacing.sm,
  },
  buffRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  buffText: {
    flex: 1,
    gap: 4,
  },
  buffName: {
    color: theme.colors.text,
    fontWeight: "800",
  },
  buffMeta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  rarity: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  cost: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  buyButton: {
    alignSelf: "stretch",
  },
});
