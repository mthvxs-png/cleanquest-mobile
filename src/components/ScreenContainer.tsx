import React from "react";
import { ScrollView, StyleSheet, View, type ScrollViewProps } from "react-native";
import { theme } from "../theme/tokens";

export const ScreenContainer = ({ children, contentContainerStyle, ...rest }: ScrollViewProps): React.JSX.Element => {
  return (
    <ScrollView
      {...rest}
      style={styles.scroll}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 120,
  },
  inner: {
    gap: theme.spacing.md,
  },
});
