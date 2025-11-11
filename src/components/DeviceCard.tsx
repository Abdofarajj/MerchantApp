import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DeviceCardProps {
  device: {
    deviceName: string;
    serialNumber: string;
    addressName?: string;
  };
}

export default function DeviceCard({ device }: DeviceCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="phone-android" size={24} color="#666" />
      </View>
      <View style={styles.content}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName} numberOfLines={1}>
            {device.deviceName}
          </Text>
          <Text style={styles.serialNumber} numberOfLines={1}>
            {device.serialNumber}
          </Text>
        </View>
        {device.addressName && (
          <Text style={styles.addressName} numberOfLines={1}>
            {device.addressName}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: 100,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    margin: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  deviceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  serialNumber: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  addressName: {
    fontSize: 12,
    color: "#888",
  },
});
