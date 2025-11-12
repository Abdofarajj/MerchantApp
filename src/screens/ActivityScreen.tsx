import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RequestPreview from "../components/RequestPreview";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useGetChargeOrdersByMerchantQuery } from "../services/ChargeOrders";
import { useDeleteChargeOrderMutation } from "../services/ChargeOrders/hook";
import {
  useGetAllReceiptCharge,
  useGetAllReceiptReCharge,
} from "../services/Documents";
import { darkTheme, lightTheme } from "../theme";

const { width: screenWidth } = Dimensions.get("window");
const tabBarWidth = screenWidth - 16 * 2;
const tabWidth = (tabBarWidth - 12) / 4; // 4 tabs with 3 gaps

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [activeTab, setActiveTab] = useState<
    "all" | "recharge" | "pay" | "collect"
  >("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Animation for tab indicator
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  // API hooks
  const {
    data: rechargeData,
    isLoading: rechargeLoading,
    error: rechargeError,
    refetch: refetchRecharge,
  } = useGetChargeOrdersByMerchantQuery({
    pageSize: 10,
    pageNumber,
  });

  const {
    data: payData,
    isLoading: payLoading,
    error: payError,
    refetch: refetchPay,
  } = useGetAllReceiptCharge({
    pageSize: 10,
    pageNumber: 1,
  });

  const {
    data: collectData,
    isLoading: collectLoading,
    error: collectError,
    refetch: refetchCollect,
  } = useGetAllReceiptReCharge({
    pageSize: 10,
    pageNumber: 1,
  });

  // Mutation for deleting charge orders
  const deleteChargeOrderMutation = useDeleteChargeOrderMutation();

  // Combined data based on active tab
  const combinedData = useMemo(() => {
    let items: any[] = [];

    switch (activeTab) {
      case "all":
        items = [
          ...(rechargeData?.items || []).map((item) => ({
            ...item,
            type: "recharge",
          })),
          ...(payData?.items || []).map((item) => ({ ...item, type: "pay" })),
          ...(collectData?.items || []).map((item) => ({
            ...item,
            type: "collect",
          })),
        ];
        break;
      case "recharge":
        items = (rechargeData?.items || []).map((item) => ({
          ...item,
          type: "recharge",
        }));
        break;
      case "pay":
        items = (payData?.items || []).map((item) => ({
          ...item,
          type: "pay",
        }));
        break;
      case "collect":
        items = (collectData?.items || []).map((item) => ({
          ...item,
          type: "collect",
        }));
        break;
    }

    // Sort by status (pending first) then by date
    return items.sort((a, b) => {
      // Pending items first
      if (a.isApproved !== b.isApproved) {
        return a.isApproved ? 1 : -1;
      }
      // Then sort by date (newest first)
      const dateA = new Date(a.insertDate || a.insertDate);
      const dateB = new Date(b.insertDate || b.insertDate);
      return dateB.getTime() - dateA.getTime();
    });
  }, [activeTab, rechargeData, payData, collectData]);

  const isLoading = rechargeLoading || payLoading || collectLoading;
  const error = rechargeError || payError || collectError;

  const styles = activityScreenStyles(theme);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPageNumber(1);
    await Promise.all([refetchRecharge(), refetchPay(), refetchCollect()]);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    // For now, we'll keep it simple and not implement pagination for all tabs
    // This can be enhanced later with proper pagination per tab
  };

  const handleTabPress = (tab: "all" | "recharge" | "pay" | "collect") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      const tabIndex = ["all", "recharge", "pay", "collect"].indexOf(tab);
      const targetPosition = tabIndex * tabWidth;

      Animated.timing(tabIndicatorPosition, {
        toValue: targetPosition,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleItemPress = (item: any) => {
    // Determine if this is a charge order or receipt document
    const isChargeOrder =
      item.hasOwnProperty("merchantName") &&
      item.hasOwnProperty("distrputerName");
    const isReceiptDocument =
      item.hasOwnProperty("fromAccountName") &&
      item.hasOwnProperty("toAccountName");

    let details: string[] = [];
    let title = "Details";

    if (isChargeOrder) {
      title = "Charge Order Details";
      details = [
        `ID: ${item.id}`,
        `Merchant: ${item.merchantName}`,
        `Amount: $${item.amount}`,
        `User: ${item.appUserName}`,
        `Distributor: ${item.distrputerName}`,
        `Status: ${item.isApproved ? "Approved" : "Pending"}`,
        `Insert Date: ${new Date(item.insertDate).toLocaleString()}`,
      ];

      if (item.isApproved && item.chargeDate) {
        details.push(
          `Charge Date: ${new Date(item.chargeDate).toLocaleString()}`
        );
      }

      if (item.chargeDocumentId) {
        details.push(`Document ID: ${item.chargeDocumentId}`);
      }
    } else if (isReceiptDocument) {
      title = "Receipt Document Details";
      details = [
        `ID: ${item.id}`,
        `Amount: $${item.amount}`,
        `User: ${item.appUserName}`,
        `From Account: ${item.fromAccountName}`,
        `To Account: ${item.toAccountName}`,
        `Financial Item: ${item.financialItemName}`,
        `Status: ${item.isApproved ? "Approved" : "Pending"}`,
        `Insert Date: ${new Date(item.insertDate).toLocaleString()}`,
      ];

      if (item.branchName) {
        details.push(`Branch: ${item.branchName}`);
      }
    } else {
      // Fallback for unknown item type
      details = [
        `ID: ${item.id}`,
        `Amount: $${item.amount || "N/A"}`,
        `Status: ${item.isApproved ? "Approved" : "Pending"}`,
        `Insert Date: ${new Date(item.insertDate).toLocaleString()}`,
      ];
    }

    // Show delete option for pending charge orders only
    if (isChargeOrder && !item.isApproved) {
      Alert.alert(title, details.join("\n"), [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteChargeOrder(item),
        },
      ]);
    } else {
      Alert.alert(title, details.join("\n"));
    }
  };

  const handleDeleteChargeOrder = (item: any) => {
    if (item.type === "recharge") {
      Alert.alert(
        "Delete Charge Order",
        `Are you sure you want to delete this charge order for $${item.amount}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteChargeOrderMutation.mutateAsync({
                  id: item.id,
                  updateToken: item.updateToken,
                });
                Alert.alert("Success", "Charge order deleted successfully");
                // Refresh the list
                refetchRecharge();
              } catch (error: any) {
                Alert.alert(
                  "Error",
                  error.response?.data?.message ||
                    "Failed to delete charge order"
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Cannot Delete",
        "This item cannot be deleted from this view."
      );
    }
  };

  if (error) {
    return (
      <Screen useSafeArea={false}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Failed to load charge orders. Please try again.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen useSafeArea={false}>
      <View style={styles.container}>
        <Text style={styles.header}>Activity</Text>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <Animated.View
            style={[
              styles.tabBackground,
              { transform: [{ translateX: tabIndicatorPosition }] },
            ]}
          />

          {["all", "recharge", "pay", "collect"].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => handleTabPress(tab as any)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          style={styles.list}
          data={combinedData}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <RequestPreview
              item={item}
              onPress={() => handleItemPress(item)}
              theme={theme}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No activities found</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            isLoading && combinedData.length ? (
              <Text style={styles.loadingText}>Loading more...</Text>
            ) : null
          }
        />
      </View>
    </Screen>
  );
}

const activityScreenStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text2,
      textAlign: "center",
      marginVertical: 20,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.radius.lg,
      marginHorizontal: theme.spacing[4],
      marginBottom: theme.spacing[4],
      padding: theme.spacing[1],
      position: "relative",
      overflow: "hidden",
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      alignItems: "center",
      borderRadius: theme.radius.md,
      zIndex: 2,
    },
    tabBackground: {
      position: "absolute",
      top: theme.spacing[1],
      bottom: theme.spacing[1],
      left: theme.spacing[1],
      width: tabWidth - theme.spacing[1] + 4,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
    },
    activeTabText: {
      color: "white",
    },
    inactiveTabText: {
      color: theme.colors.textSecondary,
    },
    list: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing[4],
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    loadingText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      padding: theme.spacing[4],
    },
  });
