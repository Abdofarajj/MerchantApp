import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import POSCard from "../components/POSCard";
import QuickActionButton from "../components/QuickActionButton";
import Screen from "../components/Screen";
import { useDashboard } from "../hooks/useDashboard";
import { darkTheme, lightTheme } from "../theme";

export default function HomeScreen() {
  const { data, isLoading, error } = useDashboard();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  if (isLoading) {
    const styles = StyleSheet.create({
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      },
      loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: theme.colors.textSecondary,
      },
    });
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    const styles = StyleSheet.create({
      errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
    },
    header: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
      padding: 20,
      paddingTop: 40,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    balanceCard: {
      borderRadius: 12,
      padding: 20,
      marginTop: 80,
      marginHorizontal: 16,
      elevation: 8,
      shadowColor: "#b11313ff",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 1,
      overflow: "hidden",
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
      style={{ backgroundColor: theme.colors.surface }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome back!</Text>
        <Text style={styles.headerSubtitle}>Merchant Dashboard</Text>
      </View> */}

        {/* Balance Card */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {data.currency} {data.balance.toLocaleString()}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
          <Text style={styles.pendingLabel}>Pending Requests</Text>
          <Text style={styles.pendingValue}>{data.pendingRequests}</Text>
        </LinearGradient>

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
      </ScrollView>
    </Screen>
  );
}
