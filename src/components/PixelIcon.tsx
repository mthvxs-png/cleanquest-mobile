import React from "react";
import { Image, StyleSheet, type ImageStyle, type StyleProp } from "react-native";
import { uiAssets, type UiIconName } from "../theme/uiAssets";

interface PixelIconProps {
  name: UiIconName;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const PixelIcon = ({ name, size = 24, style }: PixelIconProps): React.JSX.Element => {
  return <Image source={uiAssets.icons[name]} style={[styles.icon, { width: size, height: size }, style]} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  icon: {
    flexShrink: 0,
  },
});

