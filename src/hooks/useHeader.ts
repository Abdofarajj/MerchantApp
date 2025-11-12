import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { useColorScheme } from "react-native";
import Header, { HeaderProps } from "../components/Header";
import { darkTheme, lightTheme } from "../theme";

/**
 * Custom hook for React Navigation screens to declaratively configure and render
 * a custom header component without directly manipulating navigation options in each screen.
 *
 * This hook simplifies header management by allowing developers to pass header properties
 * (like title, icons, and actions) directly from within a screen component, while ensuring
 * smooth transitions between screens by applying changes before rendering via useLayoutEffect.
 * This avoids visible "jumps" or flashes when navigating, as the header updates synchronously
 * with layout changes rather than after the screen renders.
 *
 * @param headerProps - HeaderProps (defined in the Header component)
 * @param deps - Optional array of dependencies to control when the header re-renders
 */
export const useHeader = (
  headerProps: HeaderProps,
  deps: React.DependencyList = []
) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => React.createElement(Header, headerProps),
    });
  }, [navigation, theme, headerProps, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};
