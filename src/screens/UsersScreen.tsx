import React from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";
import Screen from "../components/Screen";
import { darkTheme, lightTheme } from "../theme";

export default function UsersScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 100,
    },
    text: {
      fontSize: 24,
      color: theme.colors.text,
    },
  });

  return (
    <Screen useSafeArea={false} centerContent>
      <Text style={styles.text}>Users Screen</Text>
    </Screen>
  );
}
