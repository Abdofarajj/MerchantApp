import { Image } from "expo-image";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { darkTheme, lightTheme } from "../theme";

import { DeviceMerchant } from "../services/DeviceMerchants/schema";

interface POSCardProps {
  device: DeviceMerchant;
  onPress?: () => void;
}

export default function POSCard({ device, onPress }: POSCardProps) {
  const {
    serialNumber,
    deviceName: model,
    addressName,
    isActive: status,
  } = device;
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const getStatusColor = (isActive: boolean) => {
    return isActive ? theme.colors.success : theme.colors.textSecondary;
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "مفعلة" : "غير مفعلة";
  };

  // Use hardcoded A75Pro image for all POS devices
  const posImage = require("../assets/images/A75Pro.png");

  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Status indicator at top right */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        </View>

        {/* POS Image */}
        <Image source={posImage} style={styles.posImage} contentFit="contain" />

        {/* Info Section */}
        <View style={styles.infoSection}>
          {/* Serial number */}
          <Text style={styles.serialNumber} numberOfLines={1}>
            {serialNumber}
          </Text>

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

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "50%", // Set width to exactly 50% for half screen
    },
    card: {
      // backgroundColor: theme.colors.surface,
      borderRadius: 15,
      overflow: "hidden",
      minHeight: 290,
      margin: 6, // Move margin to card level
    },
    posImage: {
      width: "70%",
      height: 200,
    },
    infoSection: {
      padding: 12,
    },
    serialNumber: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
      marginLeft: 8,
      textAlign: "right", // Always RTL text alignment
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
      textAlign: "center", // Center align status text
    },
    model: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
      textAlign: "right", // Always RTL text alignment
    },
    addressName: {
      fontSize: 12,
      color: theme.colors.text,
      lineHeight: 16,
      textAlign: "right", // Always RTL text alignment
    },
    statusContainer: {
      position: "absolute",
      top: 10,
      right: 10, // Fixed RTL positioning
      zIndex: 1,
    },
  });
