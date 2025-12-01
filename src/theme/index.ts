// src/theme/theme.ts
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const lightColors = {
  primary: "#007AFF", // Main brand blue
  onPrimary: "#FFFFFF", // Text on primary buttons
  primaryContainer: "#007AFF", // Primary container color

  secondary: "#0c29a8ff", // Secondary accent blue

  background: "#FFFFFF", // Main app background
  background2: "#e6e6e6ff", // Secondary background sections

  surface: "#F7FAF8", // Cards / surfaces
  surfaceVariant: "#c3d8f3ff", // Slightly darker surface variant

  text: "#000000FF", // Main black text
  text2: "#000000FF", // Secondary main text
  textSecondary: "#334155", // Less emphasis text
  textDim: "#727272FF", // Dimmed / hint text

  outline: "#9C9C9CFF", // Borders / dividers

  success: "#10B981", // Success green
  warning: "#F59E0B", // Warning orange
  error: "#EF4444", // Error red
  info: "#3B82F6", // Info blue

  white: "#FFFFFF", // Pure white
  black: "#000000", // Pure black

  disabled: "#474747FF", // Disabled elements
};

const darkColors = {
  primary: "#004A99", // Brightened for dark background
  onPrimary: "#000000", // Text on primary buttons
  primaryContainer: "#005FCC", // Darker container for primary

  secondary: "#4A8DDB", // Softer alternative to primary

  background: "#000000ff", // Main app background (near-black)
  background2: "#1A1A1A", // Secondary background

  surface: "#1E1E1E", // Cards / surfaces
  surfaceVariant: "#2A2A2A", // Slightly brighter surface variant

  text: "#FFFFFFFF", // Main white text
  text2: "#E7E7E7FF", // Slightly dimmed white
  textSecondary: "#A0AEC0", // Cool gray for less emphasis
  textDim: "#7A7A7AFF", // Even dimmer text (labels, hints)

  outline: "#5F5F5FFF", // Border / dividers

  success: "#22C55E", // Green success on dark background
  warning: "#FBBF24", // Deep warm yellow
  error: "#F87171", // Light red for visibility
  info: "#60A5FA", // Light blue info

  white: "#FFFFFF",
  black: "#000000",

  disabled: "#555555FF", // Disabled elements (low contrast)
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
    level1: {
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
    },
    level2: {
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
    },
    level3: {
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 15,
    },
    level4: {
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 25,
    },
  },
  fonts: {
    titleLarge: {
      fontFamily: "Poppins-Bold",
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.02,
    },
    titleMedium: {
      fontFamily: "Poppins-SemiBold",
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.01,
    },
    titleSmall: {
      fontFamily: "Poppins-SemiBold",
      fontSize: 20,
      lineHeight: 28,
    },
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
    xxl: 24,
    xxxl: 30,
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
