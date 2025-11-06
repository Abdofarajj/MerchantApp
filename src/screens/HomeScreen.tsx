import { useEffect } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Avatar from "../components/Avatar";
import POSCard from "../components/POSCard";
import QuickActionButton from "../components/QuickActionButton";
import Screen from "../components/Screen";
import { useHomeDetails } from "../hooks/useHomeDetails";
import { usePosDetails } from "../hooks/usePosDetails";
import { useAuthStore } from "../store/authStore";
import { darkTheme, lightTheme } from "../theme";

export default function HomeScreen() {
  const { data, isLoading, error, signalRBalance, signalRConnected } =
    useHomeDetails();
  const {
    data: posData,
    isLoading: posLoading,
    error: posError,
  } = usePosDetails();
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
      device={item}
      onPress={() =>
        Alert.alert("Device", `Navigating to ${item.deviceName} details`)
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
    greeting: {
      flexDirection: "column",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: 16,
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
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: "bold",
      color: "white",
      marginBottom: 16,
    },
    pendingLabel: {
      fontSize: 14,
      color: "white",
      opacity: 0.8,
      marginTop: 5,
    },
    pendingValue: {
      fontSize: 18,
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
            <Avatar />
            <View style={styles.greeting}>
              <Text style={{ fontSize: 18, color: "white", fontWeight: "600" }}>
                مرحبا
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
        <View>
          <View style={styles.posHeader}>
            <Text style={styles.sectionTitle}>Your POS Devices</Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Devices", "View all devices")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Loading state */}
          {posLoading && (
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
                marginVertical: 20,
              }}
            >
              Loading POS devices...
            </Text>
          )}

          {/* Error state */}
          {posError && (
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.error,
                marginVertical: 20,
              }}
            >
              Failed to load POS devices
            </Text>
          )}

          {/* Devices list */}
          {posData && posData.length > 0 && (
            <FlatList
              data={posData}
              renderItem={renderPOSDevice}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          )}

          {/* Empty state */}
          {posData && posData.length === 0 && !posLoading && (
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
                marginVertical: 20,
              }}
            >
              No POS devices found
            </Text>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
