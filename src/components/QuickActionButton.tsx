import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { IconComponent } from "../components/Icon";
import Text from "../components/Text";

import { darkTheme, lightTheme } from "../theme";

interface QuickActionButtonProps {
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  onPress: () => void;
}

export default function QuickActionButton({
  title,
  icon,
  iconColor,
  iconBg,
  onPress,
}: QuickActionButtonProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    button: {
      borderRadius: 44,
      padding: 16,
      minHeight: 88,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 6,
      // backgroundColor: "#FFFFF",
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 20,
    },
    text: {
      fontSize: 14,
      color: theme.colors.text,
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.iconContainer}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IconComponent iconName={icon} iconSize={30} iconColor={iconColor} />
      </LinearGradient>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
