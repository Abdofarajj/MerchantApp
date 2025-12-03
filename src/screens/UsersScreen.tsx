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
  useHeader({
    title: "مستخدموا الاجهزة",
    showBackButton: false,
    backgroundColor: theme.colors.background,
  });

  const { data, error, isLoading, refetch } = useGetUserDeviceQuery();
  useEffect(() => {
    if (queryClient.getQueryState(["myUserDevice"])?.isInvalidated === true) {
      refetch();
    }
  }, [queryClient.getQueryState(["myUserDevice"])]);
  console.log(
    "User Device Data:",
    data,
    "Error:",
    error,
    "Loading:",
    isLoading
  );

  const users = data as GetUsersDeviceResponse;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.list}>
          {users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onPress={() => {
                console.log("user pressed", u.id);
                navigation.navigate("UserDetails", { userInfo: u });
              }}
            />
          ))}
        </View>
      </ScrollView>
      <FloatingActionButton
        onPress={() => {
          console.log("Add Pressed");
          navigation.navigate("AddUser");
        }}
      />
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
