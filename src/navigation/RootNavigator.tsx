import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { ComponentProps } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { queryClient } from "../services/reactQuery";
import { useAuthStore } from "../store/authStore";
import { ToastContainer } from "../utils/toast";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

export type NavigationProps = Partial<
  ComponentProps<typeof NavigationContainer>
>;

export const navigationRef = { current: null };

export default function RootNavigator(props: NavigationProps) {
  const { isSignedIn, isLoading } = useAuthStore();

  console.log(
    "RootNavigator - isSignedIn:",
    isSignedIn,
    "isLoading:",
    isLoading
  );

  // Show loading screen during auto-login check
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef} direction="rtl" {...props}>
        {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <ToastContainer />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
