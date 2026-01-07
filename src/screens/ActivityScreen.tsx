import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ActivityCard from "../components/ActivityCard";
import { ActivityDetailsModal } from "../components/Modal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { ActivityItem, useActivityFeed } from "../hooks/useActivityFeed";
import { useHeader } from "../hooks/useHeader";
import { useDeleteChargeOrderMutation } from "../services/ChargeOrders/hook";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

const { width: screenWidth } = Dimensions.get("window");
const tabBarWidth = screenWidth - 16 * 2;
const tabWidth = (tabBarWidth - 12) / 4; // 4 tabs with 3 gaps

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const queryClient = useQueryClient();
  useHeader({
    title: "الطلبات",
    showBackButton: false,
    backgroundColor: theme.colors.background,
  });
  const [activeTab, setActiveTab] = useState<
    "الكل" | "تصفية" | "تسديد" | "شحن"
  >("شحن");

  const toast = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Animation for tab indicator
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const lastFetchRef = useRef(Date.now());

  // Activity hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useActivityFeed(activeTab);

  // Compute sections from data
  const sections = useMemo(() => {
    const items = (data?.pages as ActivityItem[]) || [];
    const grouped = items.reduce(
      (acc, item) => {
        const dateObj = new Date(item.date);
        const dateKey = dateObj.toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      },
      {} as Record<string, ActivityItem[]>
    );
    const sortedGroups = Object.keys(grouped).sort((a, b) =>
      b.localeCompare(a)
    );
    return sortedGroups.map((dateKey) => ({
      title: dateKey,
      data: grouped[dateKey],
    }));
  }, [data?.pages]);

  // Update tab indicator position when activeTab changes
  useEffect(() => {
    const tabIndex = ["الكل", "تصفية", "تسديد", "شحن"].indexOf(activeTab);
    const targetPosition = tabIndex * tabWidth;
    tabIndicatorPosition.setValue(targetPosition);
  }, [activeTab, tabIndicatorPosition]);

  // Mutation for deleting charge orders
  const deleteChargeOrderMutation = useDeleteChargeOrderMutation();

  const styles = activityScreenStyles(theme);

  const handleTabPress = (tab: "الكل" | "تصفية" | "تسديد" | "شحن") => {
    if (tab !== activeTab) {
      // Invalidate queries for the new tab to fetch latest data
      if (tab === "الكل" || tab === "شحن") {
        queryClient.invalidateQueries({
          queryKey: ["activityFeed", "recharge"],
        });
      }
      if (tab === "الكل" || tab === "تسديد" || tab === "تصفية") {
        queryClient.invalidateQueries({ queryKey: ["activityFeed", "pay"] });
        queryClient.invalidateQueries({
          queryKey: ["activityFeed", "collect"],
        });
      }
      if (tab === "الكل") {
        queryClient.invalidateQueries({ queryKey: ["activityFeed", "all"] });
      }
      setActiveTab(tab);
      const tabIndex = ["الكل", "تصفية", "تسديد", "شحن"].indexOf(tab);
      const targetPosition = tabIndex * tabWidth;

      Animated.timing(tabIndicatorPosition, {
        toValue: targetPosition,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleItemPress = (item: ActivityItem) => {
    setSelectedItem(item.raw);
    setModalVisible(true);
  };

  const handleDelete = (item: any) => {
    deleteChargeOrderMutation.mutate(
      { id: item.id, updateToken: item.updateToken },
      {
        onSuccess: (response) => {
          toast.success(response.messageName);
          // Refresh the list after deletion
          if (activeTab === "الكل" || activeTab === "شحن") {
            queryClient.invalidateQueries({
              queryKey: ["activityFeed", "recharge"],
            });
          }
          if (activeTab === "الكل") {
            queryClient.invalidateQueries({
              queryKey: ["activityFeed", "all"],
            });
          }
          setModalVisible(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.messageName || "فشل في حذف طلب الشحن"
          );
        },
      }
    );
  };

  if (error) {
    return (
      <Screen useSafeArea={false}>
        <FlatList
          data={[]}
          keyExtractor={() => "error"}
          renderItem={() => null}
          contentContainerStyle={{ flex: 1, justifyContent: "center" }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                فشل تحميل الحركات. يرجى المحاولة مرة أخرى{" "}
              </Text>
            </View>
          }
        />
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
        {["الكل", "تصفية", "تسديد", "شحن"].map((tab, index) => (
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

      <SectionList
        style={styles.list}
        sections={sections}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => {
          // Map ActivityItem back to old format for ActivityCard
          let cardItem: any = {
            id: item.raw.id,
            type: item.type.toLowerCase(),
            isApproved: item.isApproved,
            amount: item.amount,
          };

          if (item.type === "RECHARGE") {
            cardItem.appUserName = item.merchantName;
          } else if (item.type === "PAY" || item.type === "COLLECT") {
            cardItem.financialItemName = item.financialItemName;
            cardItem.toAccountName = item.toAccountName;
          }

          return (
            <ActivityCard
              item={cardItem}
              onPress={() => handleItemPress(item)}
              theme={theme}
            />
          );
        }}
        renderSectionHeader={({ section: { title } }) => {
          const dateObj = new Date(title);
          const formattedDate = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${String(dateObj.getDate()).padStart(2, "0")}`;
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{formattedDate}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              // Refresh the current tab
              if (activeTab === "الكل" || activeTab === "شحن") {
                queryClient.invalidateQueries({
                  queryKey: ["activityFeed", "recharge"],
                });
              }
              if (
                activeTab === "الكل" ||
                activeTab === "تسديد" ||
                activeTab === "تصفية"
              ) {
                queryClient.invalidateQueries({
                  queryKey: ["activityFeed", "pay"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["activityFeed", "collect"],
                });
              }
              if (activeTab === "الكل") {
                queryClient.invalidateQueries({
                  queryKey: ["activityFeed", "all"],
                });
              }
            }}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد أنشطة</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
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
      textAlign: "right",
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
    sectionHeader: {
      padding: theme.spacing[2],
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
    },
    sectionHeaderText: {
      textAlign: "right",
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "bold",
    },
    loadingContainer: {
      padding: theme.spacing[4],
      alignItems: "center",
    },
  });
