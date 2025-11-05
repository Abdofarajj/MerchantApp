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
    return isActive ? "Active" : "Inactive";
  };

  // Use device image if available, otherwise no image
  const posImage = null; // DeviceMerchant doesn't have imageUri field

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
      flex: 1,
      margin: 6,
    },
    card: {
      backgroundColor: "transparent",
      borderRadius: 15,
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
    serialNumber: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text,
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
      color: theme.colors.text,
      marginBottom: 4,
    },
    addressName: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      lineHeight: 16,
    },
    statusContainer: {
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 1,
    },
  });
