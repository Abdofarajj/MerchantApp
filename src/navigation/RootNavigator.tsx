import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { ComponentProps } from "react";
import { queryClient } from "../services/reactQuery";
import { useAuthStore } from "../store/authStore";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

export type NavigationProps = Partial<
  ComponentProps<typeof NavigationContainer>
>;

export const navigationRef = { current: null };

export default function RootNavigator(props: NavigationProps) {
  const { isSignedIn } = useAuthStore();

  console.log("RootNavigator - isSignedIn:", isSignedIn);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef} direction="ltr" {...props}>
        {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
