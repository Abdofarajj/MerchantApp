import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { darkTheme, lightTheme } from "../theme";
import Text from "./Text";

interface TabItem {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

interface CustomTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export default function CustomTabBar({
  tabs,
  activeTab,
  onTabPress,
}: CustomTabBarProps) {
  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  const animationValues = useRef<Record<string, Animated.Value>>({});

  const containerBackground =
    colorScheme === "dark"
      ? theme.colors.surfaceVariant
      : "rgba(244, 244, 246, 0.95)";
  const activeBackground =
    colorScheme === "dark"
      ? "rgba(16, 185, 129, 0.18)"
      : "rgba(0, 122, 255, 0.18)";

  const styles = StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
      paddingBottom: Math.max(insets.bottom - 12, 0),
      alignItems: "center",
    },
    shell: {
      width: "100%",
      maxWidth: 480,
      backgroundColor: containerBackground,
      borderRadius: 28,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 14 },
      shadowRadius: 22,
      elevation: 18,
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
    },
    pill: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      paddingVertical: 10,
    },
    tabLabel: {
      fontSize: 13,
      textAlign: "center",
      maxWidth: 90,
    },
  });

  tabs.forEach((tab) => {
    if (!animationValues.current[tab.id]) {
      animationValues.current[tab.id] = new Animated.Value(
        activeTab === tab.id ? 1 : 0
      );
    }
  });

  useEffect(() => {
    tabs.forEach((tab) => {
      Animated.timing(animationValues.current[tab.id], {
        toValue: activeTab === tab.id ? 1 : 0,
        duration: 280,
        useNativeDriver: false,
      }).start();
    });
  }, [activeTab, tabs]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [activeTab]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.shell}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const animation = animationValues.current[tab.id];
          const backgroundColor = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["transparent", activeBackground],
          });
          const labelOpacity = animation;
          const labelSpacing = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 8],
          });
          const paddingHorizontal = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          });
          const labelWidth = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 70],
          });
          const iconScale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1.15, 1],
          });
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.85}
            >
              <Animated.View
                style={[
                  styles.pill,
                  {
                    backgroundColor,
                    paddingHorizontal,
                  },
                ]}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: iconScale }],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={tab.iconName}
                    size={26}
                    color={
                      isActive
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: labelOpacity,
                    marginLeft: labelSpacing,
                    width: labelWidth,
                  }}
                >
                  <Text
                    weight="medium"
                    style={[styles.tabLabel, { color: theme.colors.primary }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {tab.label}
                  </Text>
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
