import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { theme } from "../theme/tokens";
import { uiAssets } from "../theme/uiAssets";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "primary" | "secondary" | "accent";
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  selected?: boolean;
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled = false,
  tone = "primary",
  style,
  labelStyle,
  selected = false,
}: PrimaryButtonProps): React.JSX.Element => {
  const resolveButtonSource = (pressed: boolean) => {
    if (tone === "primary") {
      return disabled ? uiAssets.buttons.primary.disabled : pressed ? uiAssets.buttons.primary.pressed : uiAssets.buttons.primary.normal;
    }

    if (tone === "secondary") {
      return disabled
        ? uiAssets.buttons.secondary.disabled
        : pressed
          ? uiAssets.buttons.secondary.pressed
          : uiAssets.buttons.secondary.normal;
    }

    if (selected) {
      return uiAssets.buttons.accent.selected;
    }

    return pressed ? uiAssets.buttons.accent.pressed : uiAssets.buttons.accent.normal;
  };

  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.pressable, style, disabled && styles.disabled]}>
      {({ pressed }) => (
        <ImageBackground source={resolveButtonSource(pressed && !disabled)} style={styles.button} imageStyle={styles.buttonImage} resizeMode="stretch">
          <Text style={[styles.label, tone === "accent" && styles.labelAccent, labelStyle]} numberOfLines={1}>
            {label}
          </Text>
        </ImageBackground>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    minWidth: 112,
  },
  button: {
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 2,
  },
  disabled: {
    opacity: 0.72,
  },
  buttonImage: {
    resizeMode: "stretch",
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  labelAccent: {
    color: "#FFF8EE",
  },
});
