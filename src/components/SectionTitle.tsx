import React from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "../theme/tokens";

export const SectionTitle = ({ title }: { title: string }): React.JSX.Element => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
});
