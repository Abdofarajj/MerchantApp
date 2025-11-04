import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import CustomTabBar from "../components/CustomTabBar";
import AccountScreen from "../screens/AccountScreen";
import ActivityScreen from "../screens/ActivityScreen";
import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UsersScreen";

export type TabParamList = {
  Home: undefined;
  Users: undefined;
  Activity: undefined;
  Account: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;

const Tab = createBottomTabNavigator<TabParamList>();

const tabs = [
  { id: "Home", label: "Home", iconName: "home-outline" as const },
  { id: "Users", label: "Users", iconName: "people-outline" as const },
  { id: "Activity", label: "Activity", iconName: "card-outline" as const },
  { id: "Account", label: "Account", iconName: "person-outline" as const },
];

export default function AppNavigator() {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <CustomTabBar
          tabs={tabs}
          activeTab={props.state.routeNames[props.state.index]}
          onTabPress={(tabId) => {
            const route = props.state.routes.find((r) => r.name === tabId);
            if (route) {
              props.navigation.navigate(route.name);
            }
          }}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
