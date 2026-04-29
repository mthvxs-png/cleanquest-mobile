import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { COSMETIC_DEFINITIONS } from "../application/mockData";
import { theme } from "../theme/tokens";
import type { CharacterState } from "../types/app";
import { uiAssets } from "../theme/uiAssets";

interface AvatarPreviewProps {
  character: CharacterState;
  size?: "sm" | "lg";
}

export const AvatarPreview = ({ character, size = "sm" }: AvatarPreviewProps): React.JSX.Element => {
  const { t } = useTranslation();
  const isLarge = size === "lg";

  return (
    <ImageBackground source={uiAssets.panels.dark} style={[styles.frame, isLarge ? styles.frameLarge : styles.frameSmall]} imageStyle={styles.frameImage} resizeMode="stretch">
      <View style={styles.glow} />
      <Text style={[styles.body, isLarge ? styles.bodyLarge : styles.bodySmall]}>
        {character.bodyType === "female" ? "Aventureira" : "Aventureiro"}
      </Text>
      <Text style={styles.line}>{t(COSMETIC_DEFINITIONS[character.equipped.outfits].nameKey)}</Text>
      <Text style={styles.line}>{t(COSMETIC_DEFINITIONS[character.equipped.hats].nameKey)}</Text>
      <Text style={styles.line}>{t(COSMETIC_DEFINITIONS[character.equipped.pets].nameKey)}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 8,
  },
  frameImage: {
    resizeMode: "stretch",
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
    color: "#FFF6DC",
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
    color: "#E2C99E",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
