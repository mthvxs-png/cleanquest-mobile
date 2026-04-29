import type { ImageSourcePropType } from "react-native";

export type UiIconName =
  | "avatar"
  | "check"
  | "clock"
  | "coin"
  | "home"
  | "lock"
  | "missions"
  | "settings"
  | "shop"
  | "streak"
  | "tasks"
  | "xp";

export const uiAssets = {
  buttons: {
    settings: require("../../generated_assets/phase1_ui_buttons/button_settings.png"),
    back: require("../../generated_assets/phase1_ui_buttons/button_back.png"),
    close: require("../../generated_assets/phase1_ui_buttons/button_close.png"),
    iconSquare: require("../../generated_assets/phase1_ui_buttons/button_icon_square.png"),
    primary: {
      normal: require("../../generated_assets/phase1_ui_buttons/button_primary.png"),
      pressed: require("../../generated_assets/phase1_ui_buttons/button_primary_pressed.png"),
      disabled: require("../../generated_assets/phase1_ui_buttons/button_primary_disabled.png"),
    },
    secondary: {
      normal: require("../../generated_assets/phase1_ui_buttons/button_secondary.png"),
      pressed: require("../../generated_assets/phase1_ui_buttons/button_secondary_pressed.png"),
      disabled: require("../../generated_assets/phase1_ui_buttons/button_secondary_disabled.png"),
    },
    accent: {
      normal: require("../../generated_assets/phase1_ui_buttons/button_accent.png"),
      pressed: require("../../generated_assets/phase1_ui_buttons/button_accent_pressed.png"),
      selected: require("../../generated_assets/phase1_ui_buttons/button_accent_selected.png"),
    },
    danger: {
      normal: require("../../generated_assets/phase1_ui_buttons/button_danger.png"),
      pressed: require("../../generated_assets/phase1_ui_buttons/button_danger_pressed.png"),
    },
    tab: {
      active: require("../../generated_assets/phase1_ui_buttons/button_tab_active.png"),
      inactive: require("../../generated_assets/phase1_ui_buttons/button_tab_inactive.png"),
      missionsActive: require("../../generated_assets/phase1_ui_buttons/button_missions_tab_active.png"),
    },
  },
  panels: {
    light: require("../../generated_assets/phase1_ui_foundations/panel_window_light_9slice.png"),
    dark: require("../../generated_assets/phase1_ui_foundations/panel_window_dark_9slice.png"),
  },
  cards: {
    base: require("../../generated_assets/phase1_ui_foundations/card_base.png"),
    selected: require("../../generated_assets/phase1_ui_foundations/card_selected_overlay.png"),
    locked: require("../../generated_assets/phase1_ui_foundations/card_locked_overlay.png"),
    reward: require("../../generated_assets/phase1_ui_foundations/card_reward_overlay.png"),
  },
  bars: {
    frame: require("../../generated_assets/phase1_ui_foundations/bar_frame.png"),
    fillPrimary: require("../../generated_assets/phase1_ui_foundations/bar_fill_primary.png"),
    fillGold: require("../../generated_assets/phase1_ui_foundations/bar_fill_gold.png"),
    statCapsule: require("../../generated_assets/phase1_ui_foundations/stat_capsule.png"),
  },
  icons: {
    avatar: require("../../generated_assets/phase1_ui_icons/icon_avatar.png"),
    check: require("../../generated_assets/phase1_ui_icons/icon_check.png"),
    clock: require("../../generated_assets/phase1_ui_icons/icon_clock.png"),
    coin: require("../../generated_assets/phase1_ui_icons/icon_coin.png"),
    home: require("../../generated_assets/phase1_ui_icons/icon_home.png"),
    lock: require("../../generated_assets/phase1_ui_icons/icon_lock.png"),
    missions: require("../../generated_assets/phase1_ui_icons/icon_missions.png"),
    settings: require("../../generated_assets/phase1_ui_icons/icon_settings.png"),
    shop: require("../../generated_assets/phase1_ui_icons/icon_shop.png"),
    streak: require("../../generated_assets/phase1_ui_icons/icon_streak.png"),
    tasks: require("../../generated_assets/phase1_ui_icons/icon_tasks.png"),
    xp: require("../../generated_assets/phase1_ui_icons/icon_xp.png"),
  } satisfies Record<UiIconName, ImageSourcePropType>,
} as const;

