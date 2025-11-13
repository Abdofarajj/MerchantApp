import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fontsLoaded] = useFonts({
    AlexandriaThin: require("../assets/fonts/Alexandria-Thin.ttf"),
    AlexandriaExtraLight: require("../assets/fonts/Alexandria-ExtraLight.ttf"),
    AlexandriaLight: require("../assets/fonts/Alexandria-Light.ttf"),
    AlexandriaRegular: require("../assets/fonts/Alexandria-Regular.ttf"),
    AlexandriaMedium: require("../assets/fonts/Alexandria-Medium.ttf"),
    AlexandriaSemiBold: require("../assets/fonts/Alexandria-SemiBold.ttf"),
    AlexandriaBold: require("../assets/fonts/Alexandria-Bold.ttf"),
    AlexandriaExtraBold: require("../assets/fonts/Alexandria-ExtraBold.ttf"),
    AlexandriaBlack: require("../assets/fonts/Alexandria-Black.ttf"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
