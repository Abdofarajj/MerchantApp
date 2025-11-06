import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
  backgroundColor?: string;
  centerContent?: boolean;
}

export default function Screen({
  children,
  style,
  useSafeArea = true,
  backgroundColor,
  centerContent = false,
}: ScreenProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      height: screenHeight,
      ...style,
      paddingBottom: 0,
    },
    gradient: {
      flex: 1,
      paddingBottom: 80,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={styles.container}>
      <ImageBackground
        source={require("../assets/images/background.jpg")}
        style={styles.gradient}
        resizeMode="cover"
      >
        {centerContent ? (
          <View style={styles.content}>{children}</View>
        ) : (
          children
        )}
      </ImageBackground>
    </Container>
  );
}

// Export screen dimensions for use in other components
export { screenHeight, screenWidth };
