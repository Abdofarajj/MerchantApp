import { StyleSheet, Text, View } from "react-native";
import { IconComponent } from "../componenets/Icon"; // use lowercase filename

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Merchant App</Text>
      <Text>This is your starting screen.</Text>

      {/* test 1: IconComponent from your file */}
      <IconComponent
        iconName="person"
        iconSize={40}
        iconColor="#fff"
        onPress={() => console.log("profile (IconComponent)")}
      />

      {/* replacement for direct Ionicons: use IconComponent (text or asset fallback) */}
      <View style={{ marginTop: 16 }}>
        <IconComponent
          iconName="home"
          iconSize={40}
          iconColor="#fff"
          buttoncontainerStyle={{ backgroundColor: "#1976D2", padding: 8, borderRadius: 8 }}
          onPress={() => console.log("home pressed")}
        />
      </View>

      {/* test 3: simple fallback box to ensure screen renders */}
      <View style={{ marginTop: 16, width: 60, height: 60, backgroundColor: "tomato", borderRadius: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
});