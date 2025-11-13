import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppRegistry, View } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        AlexandriaThin: require("./src/assets/fonts/Alexandria-Thin.ttf"),
        AlexandriaExtraLight: require("./src/assets/fonts/Alexandria-ExtraLight.ttf"),
        AlexandriaLight: require("./src/assets/fonts/Alexandria-Light.ttf"),
        AlexandriaRegular: require("./src/assets/fonts/Alexandria-Regular.ttf"),
        AlexandriaMedium: require("./src/assets/fonts/Alexandria-Medium.ttf"),
        AlexandriaSemiBold: require("./src/assets/fonts/Alexandria-SemiBold.ttf"),
        AlexandriaBold: require("./src/assets/fonts/Alexandria-Bold.ttf"),
        AlexandriaExtraBold: require("./src/assets/fonts/Alexandria-ExtraBold.ttf"),
        AlexandriaBlack: require("./src/assets/fonts/Alexandria-Black.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

AppRegistry.registerComponent("main", () => App);
