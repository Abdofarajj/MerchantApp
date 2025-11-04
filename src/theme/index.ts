// src/theme/theme.ts
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const lightColors = {
  primary: "#10B981",
  onPrimary: "#FFFFFF",
  primaryContainer: "#6EE7B7",
  secondary: "#098761ff",
  background: "#FFFFFF",
  surface: "#F7FAF8",
  surfaceVariant: "#F0F4F2",
  text: "#0F172A",
  textSecondary: "#334155",
  outline: "#E0E0E0",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

const darkColors = {
  primary: "#10B981",
  onPrimary: "#FFFFFF",
  background: "#071122",
  surface: "#0B1220",
  surfaceVariant: "#0F1829",
  text: "#E6EEF2",
  textSecondary: "#94A3B8",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  roundness: 8,
  elevation: {
    level0: { shadowColor: "transparent" },
    level1: { shadowColor: "rgba(0,0,0,0.1)", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 3 },
    level2: { shadowColor: "rgba(0,0,0,0.1)", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 6 },
    level3: { shadowColor: "rgba(0,0,0,0.1)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 15 },
    level4: { shadowColor: "rgba(0,0,0,0.1)", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 1, shadowRadius: 25 },
  },
  fonts: {
    titleLarge: { fontFamily: "Poppins-Bold", fontSize: 32, lineHeight: 40, letterSpacing: -0.02 },
    titleMedium: { fontFamily: "Poppins-SemiBold", fontSize: 24, lineHeight: 32, letterSpacing: -0.01 },
    titleSmall: { fontFamily: "Poppins-SemiBold", fontSize: 20, lineHeight: 28 },
    labelLarge: { fontFamily: "Inter-Medium", fontSize: 16, lineHeight: 24 },
    bodyMedium: { fontFamily: "Inter-Regular", fontSize: 14, lineHeight: 20 },
    labelSmall: { fontFamily: "Inter-Regular", fontSize: 12, lineHeight: 16 },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    6: 24,
    8: 32,
    10: 40,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  roundness: 8,
  elevation: lightTheme.elevation,
  fonts: lightTheme.fonts,
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
};

const tintColorLight = "#5c9b32ff";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    success: "#4CAF50",
    info: "#2196F3",
    warning: "#FF9800",
    error: "#E53935",
    lightBackground: "#f8f9fa",
    bg100: "#ffffff",
    bg200: "#f8f9fa",
    bg300: "#e0e0e0",
    primary500: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    success: "#4CAF50",
    info: "#2196F3",
    warning: "#FF9800",
    error: "#E53935",
    lightBackground: "#1a1b1e",
    bg100: "#1a1b1e",
    bg200: "#151718",
    bg300: "#2a2d2f",
    primary500: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
