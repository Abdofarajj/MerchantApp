import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import Text from "../components/Text";

import { IconComponent } from "../components/Icon"; // use lowercase filename
import POSCard from "../components/POSCard";
import QuickActionButton from "../components/QuickActionButton";
import Screen from "../components/Screen";
import { useHomeDetails } from "../hooks/useHomeDetails";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function HomeScreen() {
  const { data, isLoading, error, signalRBalance, signalRConnected } =
    useHomeDetails();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { userInfo } = useAuthStore();

  // Log userInfo when component mounts or userInfo changes
  useEffect(() => {
    if (userInfo) {
      console.log("HomeScreen: userInfo", userInfo);
    }
  }, [userInfo]);

  if (error) {
    const styles = StyleSheet.create({
      errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: theme.colors.background,
      },
      errorText: {
        fontSize: 16,
        color: theme.colors.error,
      },
    });
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
      </View>
    );
  }

  if (!data) return null;

  const handleQuickAction = (action: string) => {
    Alert.alert("Quick Action", `${action} feature coming soon!`);
  };

  const quickActions = [
    {
      id: "recharge",
      label: "Recharge",
      icon: "+",
      iconColor: theme.colors.primary,
      iconBg: `${theme.colors.primary}1A`, // 10% opacity
      navigateTo: "requests",
    },
    {
      id: "collect",
      label: "Collect",
      icon: "$",
      iconColor: theme.colors.success,
      iconBg: `${theme.colors.success}1A`, // 10% opacity
      navigateTo: "devices",
    },
    {
      id: "refund",
      label: "Refund",
      icon: "×",
      iconColor: theme.colors.warning,
      iconBg: `${theme.colors.warning}1A`, // 10% opacity
      navigateTo: "requests",
    },
  ];

  const renderPOSDevice = ({ item }: { item: any }) => (
    <POSCard
      id={item.id}
      serialNumber={item.serialNumber}
      model={item.model}
      addressName={item.addressName}
      status={item.status}
      onPress={() =>
        Alert.alert("Device", `Navigating to ${item.model} details`)
      }
    />
  );

  const styles = StyleSheet.create({
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: theme.colors.background,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
    },
    header: {
      // backgroundColor: theme.colors.surface,
      padding: 20,
      paddingTop: 40,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 40,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      // borderWidth: 1,
      // borderColor: "rgba(255, 255, 255, 0.3)",
    },
    greeting: {
      flexDirection: "column",
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "Alexandria",
      fontWeight: "bold",
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: 16,
      fontFamily: "Alexandria",
      color: theme.colors.textSecondary,
      // marginTop: 4,
    },
    balanceCard: {
      marginHorizontal: 16,
      backgroundColor: "none",
    },
    balanceLabel: {
      fontSize: 16,
      color: "white",
      marginBottom: 8,
      fontFamily: "Alexandria",
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: "bold",
      fontFamily: "Alexandria",
      color: "white",
      marginBottom: 16,
    },
    pendingLabel: {
      fontSize: 14,
      color: "white",
      fontFamily: "Alexandria",
      opacity: 0.8,
      marginTop: 5,
    },
    pendingValue: {
      fontSize: 18,
      fontFamily: "Alexandria",
      fontWeight: "bold",
      color: "white",
    },
    actionsContainer: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    actionsTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    posHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      marginHorizontal: 16,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: "Alexandria",
      color: theme.colors.text,
    },
    viewAllText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <Screen
      useSafeArea={false}
      // style={{ backgroundColor: theme.colors.surface }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View style={styles.greeting}>
              <Text style={{ fontSize: 18, color: "white", fontWeight: "600" }}>
                Good day
              </Text>
              <Text style={{ fontSize: 16, color: "white", opacity: 0.8 }}>
                {userInfo?.displayName || "User"}
              </Text>
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            Current Balance{signalRConnected}
          </Text>
          <Text style={styles.balanceAmount}>
            {data.currency} {(signalRBalance ?? data.balance).toLocaleString()}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
          <Text style={styles.pendingLabel}>Pending Requests</Text>
          <Text style={styles.pendingValue}>{data.pendingRequests}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.id}
                title={action.label}
                icon={action.icon}
                iconColor={action.iconColor}
                iconBg={action.iconBg}
                onPress={() => handleQuickAction(action.label)}
              />
            ))}
          </View>
        </View>

        {/* POS Devices */}
        <>
          <View style={styles.posHeader}>
            <Text style={styles.sectionTitle}>Your POS Devices</Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Devices", "View all devices")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data.devices}
            renderItem={renderPOSDevice}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
          />
        </>
      </ScrollView>
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
          iconContainerStyle={{ backgroundColor: "#1976D2", padding: 8, borderRadius: 8 }}
          onPress={() => console.log("home pressed")}
        />
      </View>

      {/* test 3: simple fallback box to ensure screen renders */}
      <View style={{ marginTop: 16, width: 60, height: 60, backgroundColor: "tomato", borderRadius: 30 }} />

    </Screen>
  );
}
