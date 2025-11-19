import React from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import { useHeader } from "../hooks/useHeader";
import { GetUsersDeviceResponse, useGetUserDeviceQuery } from "../services";
import { darkTheme, lightTheme } from "../theme";

export default function UsersScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  useHeader({ title: "Users", showBackButton: false });
  const { data, error, isLoading } = useGetUserDeviceQuery();
  console.log("User Device Data:", data, "Error:", error, "Loading:", isLoading);

  // Placeholder data that matches the Users schema
  const placeholderUsers: GetUsersDeviceResponse = [
    {
      id: "1",
      accountName: "acct_ahmed",
      displayName: "أحمد علي",
      email: "ahmed@example.com",
      phoneNumber: "+966512345678",
      userName: "ahmed",
      accountCode: "AC001",
      balance: 0,
    },
    {
      id: "2",
      accountName: "acct_sara",
      displayName: "سارة محمد",
      email: "sara@example.com",
      phoneNumber: "+966598765432",
      userName: "sara",
      accountCode: "AC002",
      balance: 0,
    },
    {
      id: "3",
      accountName: "acct_khaled",
      displayName: "خالد حسن",
      email: "",
      phoneNumber: "+966500112233",
      userName: "khaled",
      accountCode: "AC003",
      balance: 0,
    },
  ];

  const users = (data && Array.isArray(data) && data.length > 0 ? data : placeholderUsers) as GetUsersDeviceResponse;

  return (
    <Screen>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.list}>
          {users.map((u) => (
            <UserCard
              key={u.id}
              id={u.id}
              name={u.displayName || u.accountName}
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
