import React, { useEffect, useRef, useState } from "react";
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
import { useActivity } from "../hooks/useActivity";
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
  useHeader({
    title: "الحركات",
    showBackButton: false,
    backgroundColor: theme.colors.background,
  });
  const [activeTab, setActiveTab] = useState<
    "الكل" | "تصفية" | "تسديد" | "شحن"
  >("شحن");
  const [refreshing, setRefreshing] = useState(false);

  const toast = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Animation for tab indicator
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  // Activity hook
  const { combinedData, isLoading, error, refetchAll, loadMore } =
    useActivity(activeTab);

  // Update tab indicator position when activeTab changes
  useEffect(() => {
    const tabIndex = ["الكل", "تصفية", "تسديد", "شحن"].indexOf(activeTab);
    const targetPosition = tabIndex * tabWidth;
    tabIndicatorPosition.setValue(targetPosition);
  }, [activeTab, tabIndicatorPosition]);

  // Mutation for deleting charge orders
  const deleteChargeOrderMutation = useDeleteChargeOrderMutation();

  const styles = activityScreenStyles(theme);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAll();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const handleTabPress = (tab: "الكل" | "تصفية" | "تسديد" | "شحن") => {
    if (tab !== activeTab) {
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
          refetchAll();
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
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
        sections={combinedData}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => (
          <ActivityCard
            item={item}
            onPress={() => handleItemPress(item)}
            theme={theme}
          />
        )}
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
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
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
          isLoading && combinedData.length ? (
            <Text style={styles.loadingText}>جاري التحميل...</Text>
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
  });
