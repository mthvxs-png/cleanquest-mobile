import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { uiAssets } from "../theme/uiAssets";

interface ProgressBarProps {
  progress: number;
  tone?: "primary" | "accent" | "secondary";
}

export const ProgressBar = ({ progress, tone = "primary" }: ProgressBarProps): React.JSX.Element => {
  const fillSource = tone === "primary" ? uiAssets.bars.fillPrimary : uiAssets.bars.fillGold;

  return (
    <ImageBackground source={uiAssets.bars.frame} style={styles.frame} imageStyle={styles.frameImage} resizeMode="stretch">
      <View style={styles.track}>
        <View style={[styles.fillClip, { width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }]}>
          <Image source={fillSource} style={styles.fillImage} resizeMode="stretch" />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  frameImage: {
    resizeMode: "stretch",
  },
  track: {
    height: 12,
    justifyContent: "center",
  },
  fillClip: {
    height: "100%",
    overflow: "hidden",
  },
  fillImage: {
    width: "100%",
    height: "100%",
  },
});
