import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, darkTheme, lightTheme } from "../theme";
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
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      // backgroundColor: Colors.light.bg100,
      borderTopWidth: 1,
      borderTopColor: Colors.light.bg300,
      paddingBottom: insets.bottom,
      alignSelf: "center",
      maxWidth: 480,
      width: "100%",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    tabButton: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 60,
      minHeight: 44,
    },
    tabIcon: {
      marginBottom: 4,
    },
    tabLabel: {
      fontSize: 12,
      textAlign: "center",
    },
  });

  return (
    <BlurView
      intensity={100}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        paddingBottom: insets.bottom,
        alignSelf: "center",
        maxWidth: 480,
        width: "100%",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.iconName}
              size={24}
              color={
                isActive ? theme.colors.primary : theme.colors.textSecondary
              }
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}
