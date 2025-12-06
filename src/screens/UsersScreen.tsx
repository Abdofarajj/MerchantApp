import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import QuickActionButton from "../components/QuickActionButton";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { GetUsersDeviceResponse, useGetUserDeviceQuery } from "../services";
import { darkTheme, lightTheme } from "../theme";

export default function UsersScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  useHeader({
    title: "مستخدموا الاجهزة",
    showBackButton: false,
  });

  const { data, error, isLoading, refetch, isStale } = useGetUserDeviceQuery();
  useEffect(() => {
    if (isStale === true) {
      refetch();
    }
  }, [isStale, refetch]);
  console.log(
    "User Device Data:",
    data,
    "Error:",
    error,
    "Loading:",
    isLoading
  );

  const users = (data as GetUsersDeviceResponse) || [];

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
      <View style={styles.floatingButtonContainer}>
        <QuickActionButton
          title=""
          icon="plus"
          iconColor={theme.colors.onPrimary}
          iconBg={theme.colors.primary}
          onPress={() => {
            console.log("Add Pressed");
            navigation.navigate("AddUser");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  list: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 40,
    right: 0,
  },
});
