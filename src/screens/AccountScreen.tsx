import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Button } from "react-native-paper";
import Avatar from "../components/Avatar";
import Screen from "../components/Screen";
import { useHomeDetails } from "../hooks/useHomeDetails";
import { useLogoutMutation } from "../services/Accounts";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const navigation = useNavigation();

  // Get user info from auth store
  const { userInfo } = useAuthStore();

  // Initialize home details (which will fetch user info if needed)
  const { data: dashboardData, isLoading, error } = useHomeDetails();

  // Logout mutation
  const logoutMutation = useLogoutMutation();

  // User info is now ready to use (from auth store)
  const userData = userInfo;
  const balanceData = dashboardData;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              // Clear all user cache and navigate to login
              console.log("Logged out successfully");
              // Navigation will happen automatically through auth store changes
              // The RootNavigator will switch to AuthNavigator when isSignedIn becomes false
            },
            onError: (error) => {
              Alert.alert(
                "Error",
                "Failed to logout: " + (error as Error).message
              );
            },
          });
        },
      },
    ]);
  };

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
      marginBottom: theme.spacing[4],
    },
    logoutButton: {
      marginTop: theme.spacing[4],
      width: 200,
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
          <Button
            mode="contained"
            onPress={handleLogout}
            loading={logoutMutation.isPending}
            disabled={logoutMutation.isPending}
            buttonColor={theme.colors.error}
            style={styles.logoutButton}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </View>
      </View>
    </Screen>
  );
}
