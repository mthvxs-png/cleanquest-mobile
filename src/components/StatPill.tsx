import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/tokens";
import { PixelIcon } from "./PixelIcon";
import { uiAssets, type UiIconName } from "../theme/uiAssets";

interface StatPillProps {
  label: string;
  value: string;
  iconName?: UiIconName;
}

export const StatPill = ({ label, value, iconName }: StatPillProps): React.JSX.Element => {
  return (
    <ImageBackground source={uiAssets.bars.statCapsule} style={styles.pill} imageStyle={styles.pillImage} resizeMode="stretch">
      <View style={styles.content}>
        <View style={styles.topRow}>
          {iconName ? <PixelIcon name={iconName} size={18} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  pill: {
    minWidth: 96,
    minHeight: 56,
  },
  pillImage: {
    resizeMode: "stretch",
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    color: "#EEE1C3",
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    color: "#FFF8EE",
    fontSize: 15,
    fontWeight: "800",
  },
});
