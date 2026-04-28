import React from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../theme/tokens";

interface ProgressBarProps {
  progress: number;
  tone?: "primary" | "accent" | "secondary";
}

export const ProgressBar = ({ progress, tone = "primary" }: ProgressBarProps): React.JSX.Element => {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, toneStyles[tone], { width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }]} />
    </View>
  );
};

const toneStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  accent: {
    backgroundColor: theme.colors.accent,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
});

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: theme.radius.pill,
  },
});
