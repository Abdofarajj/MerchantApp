import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { darkTheme, lightTheme } from "../theme";
import Text from "./Text";

export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  backgroundColor?: string;
}

export default function Header({
  title,
  showBackButton = true,
  onBackPress,
  rightIcon,
  onRightPress,
  backgroundColor,
}: HeaderProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: backgroundColor || "white",
      minHeight: 100,
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    backButton: {
      position: "absolute",
      left: theme.spacing[4],
      bottom: 0,
      zIndex: 1,
      padding: theme.spacing[2],
      borderRadius: theme.radius.md,
    },
    title: {
      fontSize: 18,
      color: "black",
      textAlign: "center",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    rightButton: {
      position: "absolute",
      right: theme.spacing[4],
      top: 20,
      zIndex: 1,
      padding: theme.spacing[2],
      borderRadius: theme.radius.md,
    },
  });

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={onRightPress}
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon} size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}
