import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RequestPreviewProps {
  item: any;
  onPress: () => void;
  theme: any;
}

function RequestPreview({ item, onPress, theme }: RequestPreviewProps) {
  const styles = requestPreviewStyles(theme);

  // Determine the type of request based on available fields
  const isChargeOrder =
    item.hasOwnProperty("merchantName") &&
    item.hasOwnProperty("distrputerName");
  const isReceiptDocument =
    item.hasOwnProperty("fromAccountName") &&
    item.hasOwnProperty("toAccountName");

  const renderChargeOrderPreview = () => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Merchant:</Text>
        <Text style={styles.value}>{item.merchantName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>{item.appUserName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Distributor:</Text>
        <Text style={styles.value}>{item.distrputerName}</Text>
      </View>

      {item.isApproved && item.chargeDate && (
        <View style={styles.row}>
          <Text style={styles.label}>Charge Date:</Text>
          <Text style={styles.value}>
            {new Date(item.chargeDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text
          style={[
            styles.status,
            item.isApproved ? styles.approved : styles.pending,
          ]}
        >
          {item.isApproved ? "Approved" : "Pending"}
        </Text>
        <Text style={styles.amount}>${item.amount}</Text>
      </View>
    </>
  );

  const renderReceiptDocumentPreview = () => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>{item.appUserName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item.fromAccountName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item.toAccountName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Financial Item:</Text>
        <Text style={styles.value}>{item.financialItemName}</Text>
      </View>

      {item.branchName && (
        <View style={styles.row}>
          <Text style={styles.label}>Branch:</Text>
          <Text style={styles.value}>{item.branchName}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text
          style={[
            styles.status,
            item.isApproved ? styles.approved : styles.pending,
          ]}
        >
          {item.isApproved ? "Approved" : "Pending"}
        </Text>
        <Text style={styles.amount}>${item.amount}</Text>
      </View>
    </>
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {isChargeOrder && renderChargeOrderPreview()}
      {isReceiptDocument && renderReceiptDocumentPreview()}
    </TouchableOpacity>
  );
}

const requestPreviewStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing[4],
      marginHorizontal: theme.spacing[4],
      marginVertical: theme.spacing[2],
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing[2],
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    value: {
      fontSize: 14,
      color: theme.colors.text2,
      fontWeight: "600",
    },
    amount: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "right",
    },
    status: {
      fontSize: 12,
      fontWeight: "bold",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      textAlign: "center",
      minWidth: 60,
    },
    approved: {
      backgroundColor: theme.colors.success,
      color: "#fff",
    },
    pending: {
      backgroundColor: theme.colors.warning,
      color: "#fff",
    },
  });

export default RequestPreview;
