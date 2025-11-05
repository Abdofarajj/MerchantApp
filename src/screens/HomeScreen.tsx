import { LinearGradient } from "expo-linear-gradient";
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
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { IconComponent } from "../components/Icon"; // use lowercase filename
import POSCard from "../components/POSCard";
import QuickActionButton from "../components/QuickActionButton";
import Screen from "../components/Screen";
import { useDashboard } from "../hooks/useDashboard";
import { darkTheme, lightTheme } from "../theme";

export default function HomeScreen() {
  const { data, isLoading, error } = useDashboard();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const renderShimmerBalanceCard = () => (
    <View style={styles.balanceCard}>
      <ShimmerPlaceholder
        style={[styles.shimmerLine, { width: "80%" }]}
        shimmerColors={[
          theme.colors.outline,
          theme.colors.surface,
          theme.colors.outline,
        ]}
      />
      <ShimmerPlaceholder
        style={[styles.shimmerLine, { width: "60%", marginTop: 8 }]}
        shimmerColors={[
          theme.colors.outline,
          theme.colors.surface,
          theme.colors.outline,
        ]}
      />
      <ShimmerPlaceholder
        style={[styles.shimmerLine, { width: "40%", height: 2, marginTop: 16 }]}
        shimmerColors={[
          theme.colors.outline,
          theme.colors.surface,
          theme.colors.outline,
        ]}
      />
      <ShimmerPlaceholder
        style={[styles.shimmerLine, { width: "50%", marginTop: 8 }]}
        shimmerColors={[
          theme.colors.outline,
          theme.colors.surface,
          theme.colors.outline,
        ]}
      />
    </View>
  );

  const renderShimmerQuickActions = () => (
    <View style={styles.actionsContainer}>
      <ShimmerPlaceholder
        style={[
          styles.shimmerLine,
          { width: "40%", height: 24, marginBottom: 16 },
        ]}
        shimmerColors={[
          theme.colors.outline,
          theme.colors.surface,
          theme.colors.outline,
        ]}
      />
      <View style={styles.actionsGrid}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.shimmerActionButton}>
            <ShimmerPlaceholder
              style={styles.shimmerCircle}
              shimmerColors={[
                theme.colors.outline,
                theme.colors.surface,
                theme.colors.outline,
              ]}
            />
            <ShimmerPlaceholder
              style={[
                styles.shimmerLine,
                { width: "60%", height: 16, marginTop: 8 },
              ]}
              shimmerColors={[
                theme.colors.outline,
                theme.colors.surface,
                theme.colors.outline,
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderShimmerPOSDevices = () => (
    <View>
      <View style={styles.posHeader}>
        <ShimmerPlaceholder
          style={[styles.shimmerLine, { width: "50%", height: 24 }]}
          shimmerColors={[
            theme.colors.outline,
            theme.colors.surface,
            theme.colors.outline,
          ]}
        />
        <ShimmerPlaceholder
          style={[styles.shimmerLine, { width: "20%", height: 16 }]}
          shimmerColors={[
            theme.colors.outline,
            theme.colors.surface,
            theme.colors.outline,
          ]}
        />
      </View>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 6 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.shimmerPOSCard}>
            <ShimmerPlaceholder
              style={styles.shimmerImage}
              shimmerColors={[
                theme.colors.outline,
                theme.colors.surface,
                theme.colors.outline,
              ]}
            />
            <View style={{ padding: 12 }}>
              <ShimmerPlaceholder
                style={[
                  styles.shimmerLine,
                  { width: "80%", height: 12, marginBottom: 8 },
                ]}
                shimmerColors={[
                  theme.colors.outline,
                  theme.colors.surface,
                  theme.colors.outline,
                ]}
              />
              <ShimmerPlaceholder
                style={[
                  styles.shimmerLine,
                  { width: "60%", height: 14, marginBottom: 4 },
                ]}
                shimmerColors={[
                  theme.colors.outline,
                  theme.colors.surface,
                  theme.colors.outline,
                ]}
              />
              <ShimmerPlaceholder
                style={[styles.shimmerLine, { width: "70%", height: 12 }]}
                shimmerColors={[
                  theme.colors.outline,
                  theme.colors.surface,
                  theme.colors.outline,
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

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
    shimmerLine: {
      backgroundColor: theme.colors.outline,
      borderRadius: 4,
      height: 16,
    },
    shimmerCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.outline,
    },
    shimmerActionButton: {
      width: "30%",
      alignItems: "center",
      marginBottom: 16,
    },
    shimmerImage: {
      width: "100%",
      height: 200,
      backgroundColor: theme.colors.outline,
      borderRadius: 15,
    },
    shimmerPOSCard: {
      flex: 1,
      margin: 6,
      backgroundColor: theme.colors.surface,
      borderRadius: 15,
      shadowColor: "#000000ff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      overflow: "hidden",
      minHeight: 290,
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
        {/* Balance Card */}
        {isLoading ? (
          renderShimmerBalanceCard()
        ) : (
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
        )}

        {/* Quick Actions */}
        {isLoading ? (
          renderShimmerQuickActions()
        ) : (
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
        )}

        {/* POS Devices */}
        {isLoading ? (
          renderShimmerPOSDevices()
        ) : (
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
        )}
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
