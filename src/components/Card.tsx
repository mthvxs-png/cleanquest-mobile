import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { theme } from "../theme/tokens";

export const Card = ({ style, ...rest }: ViewProps): React.JSX.Element => {
  return <View style={[styles.card, style]} {...rest} />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
});
