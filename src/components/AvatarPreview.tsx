import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { COSMETIC_DEFINITIONS } from "../application/mockData";
import { theme } from "../theme/tokens";
import type { CharacterState } from "../types/app";

interface AvatarPreviewProps {
  character: CharacterState;
  size?: "sm" | "lg";
}

export const AvatarPreview = ({ character, size = "sm" }: AvatarPreviewProps): React.JSX.Element => {
  const { t } = useTranslation();
  const isLarge = size === "lg";

  return (
    <View style={[styles.frame, isLarge ? styles.frameLarge : styles.frameSmall]}>
      <View style={styles.glow} />
      <Text style={[styles.body, isLarge ? styles.bodyLarge : styles.bodySmall]}>
        {character.bodyType === "female" ? "Aventureira" : "Aventureiro"}
      </Text>
      <Text style={styles.line}>{t(COSMETIC_DEFINITIONS[character.equipped.outfits].nameKey)}</Text>
      <Text style={styles.line}>{t(COSMETIC_DEFINITIONS[character.equipped.hats].nameKey)}</Text>
      <Text style={styles.line}>{t(COSMETIC_DEFINITIONS[character.equipped.pets].nameKey)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    borderRadius: theme.radius.lg,
    backgroundColor: "#FFE6D4",
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 8,
  },
  frameSmall: {
    width: 108,
    height: 108,
    padding: theme.spacing.sm,
  },
  frameLarge: {
    width: "100%",
    aspectRatio: 1,
    padding: theme.spacing.lg,
  },
  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFF6CC",
    top: -30,
  },
  body: {
    color: theme.colors.text,
    fontWeight: "800",
    textAlign: "center",
  },
  bodySmall: {
    fontSize: 15,
  },
  bodyLarge: {
    fontSize: 24,
  },
  line: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
