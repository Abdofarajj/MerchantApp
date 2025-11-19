import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ActivityCard from "../components/ActivityCard";
import { ActivityDetailsModal } from "../components/ActivityDetailsModal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { useGetChargeOrdersByMerchantQuery } from "../services/ChargeOrders";
import { useDeleteChargeOrderMutation } from "../services/ChargeOrders/hook";
import {
  useGetAllReceiptCharge,
  useGetAllReceiptReCharge,
} from "../services/Documents";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

const { width: screenWidth } = Dimensions.get("window");
const tabBarWidth = screenWidth - 16 * 2;
const tabWidth = (tabBarWidth - 12) / 4; // 4 tabs with 3 gaps

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  useHeader({ title: "الحركات", showBackButton: false });
  const [activeTab, setActiveTab] = useState<
    "الكل" | "شحن" | "تسديد" | "تصفية"
  >("الكل");
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const toast = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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

  // Refetch data on screen focus
  useFocusEffect(
    useCallback(() => {
      refetchRecharge();
      refetchPay();
      refetchCollect();
    }, [refetchRecharge, refetchPay, refetchCollect])
  );

  // Combined data based on active tab
  const combinedData = useMemo(() => {
    let items: any[] = [];

    switch (activeTab) {
      case "الكل":
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
      case "شحن":
        items = (rechargeData?.items || []).map((item) => ({
          ...item,
          type: "recharge",
        }));
        break;
      case "تسديد":
        items = (payData?.items || []).map((item) => ({
          ...item,
          type: "pay",
        }));
        break;
      case "تصفية":
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

  const handleTabPress = (tab: "الكل" | "شحن" | "تسديد" | "تصفية") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      const tabIndex = ["الكل", "شحن", "تسديد", "تصفية"].indexOf(tab);
      const targetPosition = tabIndex * tabWidth;

      Animated.timing(tabIndicatorPosition, {
        toValue: targetPosition,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDelete = (item: any) => {
    deleteChargeOrderMutation.mutate(
      { id: item.id, updateToken: item.updateToken },
      {
        onSuccess: (response) => {
          toast.success(response.messageName);
          refetchRecharge();
          setModalVisible(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.messageName || "Failed to delete charge order"
          );
        },
      }
    );
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
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabBackground,
            { transform: [{ translateX: tabIndicatorPosition }] },
          ]}
        />

        {["الكل", "شحن", "تسديد", "تصفية"].map((tab, index) => (
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
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        style={styles.list}
        data={combinedData}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => (
          <ActivityCard
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
      <ActivityDetailsModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        theme={theme}
        onDelete={handleDelete}
      />
    </Screen>
  );
}

const activityScreenStyles = (theme: any) =>
  StyleSheet.create({
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.radius.lg * 5,
      marginHorizontal: theme.spacing[4],
      marginBottom: theme.spacing[4],
      padding: theme.spacing[1],
      position: "relative",
      overflow: "hidden",
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing[2],
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
      borderRadius: theme.radius.lg * 5,
    },
    tabText: {
      fontSize: 14,
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
