import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { darkTheme, lightTheme } from "../theme";

export type ToastType = "error" | "success" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, duration);

    return () => clearTimeout(timer);
  }, [opacity, onDismiss, duration]);

  const getToastColors = () => {
    switch (type) {
      case "error":
        return {
          background: theme.colors.error,
          icon: "close-circle",
        };
      case "success":
        return {
          background: theme.colors.success,
          icon: "checkmark-circle",
        };
      case "info":
      default:
        return {
          background: theme.colors.primary,
          icon: "information-circle",
        };
    }
  };

  const { background } = getToastColors();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: background,
      padding: theme.spacing[4],
      paddingTop: 50, // Account for status bar
      flexDirection: "row",
      alignItems: "center",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      zIndex: 1000,
    },
    icon: {
      marginRight: theme.spacing[3],
    },
    message: {
      flex: 1,
      color: "white",
      fontSize: 14,
      fontWeight: "500",
      textAlign: "right",
    },
    dismissButton: {
      padding: theme.spacing[1],
      marginLeft: theme.spacing[2],
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* <Ionicons
        name={icon as any}
        size={24}
        color="white"
        style={styles.icon}
      /> */}
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={onDismiss}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
}
