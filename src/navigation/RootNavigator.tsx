import { NavigationContainer } from "@react-navigation/native";
import React, { ComponentProps } from "react";
import { useAuthStore } from "../store/authStore";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

export type NavigationProps = Partial<ComponentProps<typeof NavigationContainer>>;

export const navigationRef = { current: null };

export default function RootNavigator(props: NavigationProps) {
  const { isSignedIn } = useAuthStore();

  console.log("RootNavigator - isSignedIn:", isSignedIn);

  return (
    <NavigationContainer ref={navigationRef} direction="ltr" {...props}>
      {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
