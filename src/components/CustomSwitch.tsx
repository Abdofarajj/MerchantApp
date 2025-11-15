import React from "react";
import { Switch, View, useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../theme";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <View
      style={{
        width: 60, // Track width
        height: 30, // Track height (same as thumb)
        backgroundColor: value ? theme.colors.primary : theme.colors.disabled,
        borderRadius: 30,
        justifyContent: "center",
        padding: 2, // Space so thumb doesn't touch edges
      }}
    >
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "transparent", true: "transparent" }}
        thumbColor="#000000ff"
        style={{
          transform: [{ scale: 1.2 }], // shrink thumb slightly if needed
          alignSelf: value ? "flex-end" : "flex-start",
        }}
      />
    </View>
  );
};

export default CustomSwitch;
