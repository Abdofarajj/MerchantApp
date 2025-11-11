import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChargeOrderPreviewProps {
  item: any;
  onPress: () => void;
  theme: any;
}

function ChargeOrderPreview({ item, onPress, theme }: ChargeOrderPreviewProps) {
  const styles = chargeOrderPreviewStyles(theme);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
    </TouchableOpacity>
  );
}

const chargeOrderPreviewStyles = (theme: any) =>
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

export default ChargeOrderPreview;
