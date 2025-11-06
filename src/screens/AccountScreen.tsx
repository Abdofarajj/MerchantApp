import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Avatar from "../components/Avatar";
import Screen from "../components/Screen";
import { useHomeDetails } from "../hooks/useHomeDetails";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  // Get user info from auth store
  const { userInfo } = useAuthStore();

  // Initialize home details (which will fetch user info if needed)
  const { data: dashboardData, isLoading, error } = useHomeDetails();

  // User info is now ready to use (from auth store)
  const userData = userInfo;
  const balanceData = dashboardData;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: theme.colors.background,
      paddingTop: 60,
      paddingHorizontal: theme.spacing[4],
    },
    profileCard: {
      width: "100%",
      padding: theme.spacing[3],
      borderRadius: theme.radius.xxxl,
      marginBottom: theme.spacing[6],
      direction: "rtl",
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing[3],
    },
    displayName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    mainContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 24,
      color: theme.colors.text,
    },
  });

  return (
    <Screen useSafeArea={false}>
      <View style={styles.container}>
        <LinearGradient
          colors={[
            theme.colors.secondary,
            theme.colors.primary,
            theme.colors.primary,
            theme.colors.secondary,
          ]}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Avatar />
          {userData?.displayName && (
            <Text style={styles.displayName}>{userData.displayName}</Text>
          )}
        </LinearGradient>
        <View style={styles.mainContent}>
          <Text style={styles.text}>Account Screen</Text>
        </View>
      </View>
    </Screen>
  );
}
