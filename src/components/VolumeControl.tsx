import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/tokens";
import { PrimaryButton } from "./PrimaryButton";

interface VolumeControlProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
}

export const VolumeControl = ({
  label,
  value,
  onChange,
}: VolumeControlProps): React.JSX.Element => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>
      <View style={styles.row}>
        <PrimaryButton label="-10" onPress={() => onChange(value - 10)} tone="secondary" />
        <PrimaryButton label="+10" onPress={() => onChange(value + 10)} tone="accent" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  value: {
    color: theme.colors.textMuted,
    fontWeight: "700",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
});
