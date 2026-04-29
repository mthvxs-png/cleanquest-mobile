import React from "react";
import { Image, ImageBackground, StyleSheet, View, type ViewProps } from "react-native";
import { theme } from "../theme/tokens";
import { uiAssets } from "../theme/uiAssets";

type CardVariant = "base" | "selected" | "locked" | "reward" | "panelLight" | "panelDark";

interface CardProps extends ViewProps {
  variant?: CardVariant;
}

export const Card = ({ style, children, variant = "base", ...rest }: CardProps): React.JSX.Element => {
  const backgroundSource = variant === "panelLight" ? uiAssets.panels.light : variant === "panelDark" ? uiAssets.panels.dark : uiAssets.cards.base;
  const overlaySource =
    variant === "selected"
      ? uiAssets.cards.selected
      : variant === "locked"
        ? uiAssets.cards.locked
        : variant === "reward" || variant === "panelLight"
          ? uiAssets.cards.reward
          : undefined;

  return (
    <ImageBackground source={backgroundSource} style={[styles.card, style]} imageStyle={styles.cardImage} resizeMode="stretch">
      {overlaySource ? <Image source={overlaySource} style={styles.overlay} resizeMode="stretch" /> : null}
      <View style={styles.content} {...rest}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    minHeight: 110,
  },
  cardImage: {
    resizeMode: "stretch",
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
