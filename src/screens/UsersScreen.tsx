import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import FloatingActionButton from "../components/FloatingActionButton";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { GetUsersDeviceResponse, useGetUserDeviceQuery } from "../services";
import { queryClient } from "../services/reactQuery";
import { darkTheme, lightTheme } from "../theme";

export default function UsersScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  useHeader({ title: "Users", showBackButton: false });

  const { data, error, isLoading, refetch } = useGetUserDeviceQuery();
  useEffect(() => {
    if (queryClient.getQueryState(["myUserDevice"])?.isInvalidated === true) {
      refetch();
    }
  }, [queryClient.getQueryState(["myUserDevice"])]
  );
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
              user={u}
              onPress={() => console.log("user pressed", u.id)}
            />
          ))}
        </View>
      </ScrollView>
      <FloatingActionButton
      onPress={() => {
        console.log("Add Pressed")
        navigation.navigate("AddUser")
        }
        }/>
      
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 220,
  },
  list: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
});
