import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../components/Text";
interface POSCardProps {
  id: string;
  serialNumber: string;
  model: string;
  addressName?: string;
  status: "active" | "inactive";
  onPress?: () => void;
}

export default function POSCard({
  serialNumber,
  model,
  addressName,
  status,
  onPress,
}: POSCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "inactive":
        return "#9E9E9E";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  // Mock POS device image - replace with actual image path
  const posImage = require("@/assets/images/A75Pro.png");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* POS Image */}
        <Image source={posImage} style={styles.posImage} contentFit="contain" />

        {/* Info Section */}
        <View style={styles.infoSection}>
          {/* Top row: serial + status */}
          <View style={styles.topRow}>
            <Text style={styles.serialNumber} numberOfLines={1}>
              {serialNumber}
            </Text>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText(status)}</Text>
            </View>
          </View>

          {/* Model */}
          <Text style={styles.model} numberOfLines={1}>
            {model}
          </Text>

          {/* addressName */}
          {addressName && (
            <Text style={styles.addressName} numberOfLines={2}>
              {addressName}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000000ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    minHeight: 290,
  },
  posImage: {
    width: "100%",
    height: 200,
  },
  infoSection: {
    padding: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serialNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  model: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  addressName: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
});
