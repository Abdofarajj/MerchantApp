import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { darkTheme, lightTheme } from "../theme";
import { IconComponent } from "./Icon";

interface TabItem {
  id: string;
  label: string;
  iconName: string;
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

  const containerBackground =
    colorScheme === "dark"
      ? theme.colors.surfaceVariant
      : "rgba(244, 244, 246, 0.95)";

  const styles = StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    shell: {
      width: "100%",
      backgroundColor: containerBackground,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.shell}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.85}
            >
              <IconComponent
                iconName={tab.iconName}
                iconSize={26}
                iconColor={
                  isActive ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
