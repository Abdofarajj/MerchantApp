import React, { useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import ChargeOrderPreview from "../components/ChargeOrderPreview";
import Screen from "../components/Screen";
import { useGetChargeOrdersByMerchantQuery } from "../services/ChargeOrders";
import { useDeleteChargeOrderMutation } from "../services/ChargeOrders/hook";
import { darkTheme, lightTheme } from "../theme";

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useGetChargeOrdersByMerchantQuery(
    {
      pageSize: 10,
      pageNumber,
    }
  );

  // Mutation for deleting charge orders
  const deleteChargeOrderMutation = useDeleteChargeOrderMutation();

  const styles = activityScreenStyles(theme);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPageNumber(1);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (data?.hasNextPage && !isLoading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handleItemPress = (item: any) => {
    const details = [
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

    // Show delete option for pending orders
    if (!item.isApproved) {
      Alert.alert("Charge Order Details", details.join("\n"), [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteChargeOrder(item),
        },
      ]);
    } else {
      Alert.alert("Charge Order Details", details.join("\n"));
    }
  };

  const handleDeleteChargeOrder = (item: any) => {
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
              refetch();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to delete charge order"
              );
            }
          },
        },
      ]
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
      <View style={styles.container}>
        <Text style={styles.header}>Recharge Requests</Text>

        <FlatList
          style={styles.list}
          data={data?.items || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ChargeOrderPreview
              item={item}
              onPress={() => handleItemPress(item)}
              theme={theme}
            />
          )}
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
                <Text style={styles.emptyText}>No recharge requests found</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            isLoading && (data as any)?.items?.length ? (
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
      marginVertical: 60,
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
