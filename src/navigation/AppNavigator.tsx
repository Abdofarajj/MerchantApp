import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CustomTabBar from "../components/CustomTabBar";
import AccountScreen from "../screens/AccountScreen";
import ActivityScreen from "../screens/ActivityScreen";
import AddUserScreen from "../screens/AddUserScreen";
import CollectScreen from "../screens/CollectScreen";
import EditUserScreen from "../screens/EditUserScreen";
import HomeScreen from "../screens/HomeScreen";
import POSManagement from "../screens/POSManagement";
import RechargeScreen from "../screens/RechargeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import UsersScreen from "../screens/UsersScreen";
import { UserDevice } from "../services";
import type { AccountSnapshot } from "../types/account";

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

export type RootStackParamList = {
  Tabs: undefined;
  Recharge: undefined;
  Collect: undefined;
  Account: { snapshot?: AccountSnapshot } | undefined;
  POSManagement: undefined;
  AddUser: undefined;
  EditUser: { user: UserDevice };
  UserDetails: { userInfo: UserDevice };
  ResetPassword: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const tabs = [
  { id: "Home", label: "الرئيسية", iconName: "home-outline" as const },
  { id: "Users", label: "المستخدمون", iconName: "people-outline" as const },
  {
    id: "Activity",
    label: "الحركات",
    iconName: "swap-horizontal-outline" as const,
  },
  { id: "Account", label: "الحساب", iconName: "person-outline" as const },
];

// Tab Navigator (navbar screens only)
function Tabs() {
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

// Root Stack Navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Recharge" component={RechargeScreen} />
      <Stack.Screen name="Collect" component={CollectScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="POSManagement" component={POSManagement} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
