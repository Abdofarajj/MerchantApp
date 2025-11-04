import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { Colors, darkTheme, lightTheme } from "../theme";

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
      backgroundColor:
        colorScheme === "dark" ? Colors.dark.bg100 : Colors.light.bg100,
      borderRadius: 12,
      padding: 16,
      minHeight: 88,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 6,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      backgroundColor: iconBg,
    },
    icon: {
      fontSize: 20,
      color: iconColor,
    },
    text: {
      fontSize: 14,
      fontWeight: "600",
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
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
