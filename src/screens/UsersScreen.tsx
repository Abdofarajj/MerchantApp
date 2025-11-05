import React from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import { darkTheme, lightTheme } from "../theme";

export default function UsersScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const users = [
    { id: "1", name: "أحمد علي", phoneNumber: "+966512345678", email: "ahmed@example.com" },
    { id: "2", name: "سارة محمد", phoneNumber: "+966598765432", email: "sara@example.com" },
    { id: "3", name: "خالد حسن", phoneNumber: "+966500112233" },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.list}>
          {users.map((u) => (
            <UserCard
              key={u.id}
              id={u.id}
              name={u.name}
              phoneNumber={u.phoneNumber}
              email={u.email}
              onPress={() => console.log("user pressed", u.id)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  list: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
});
