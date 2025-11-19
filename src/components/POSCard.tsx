import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { darkTheme, lightTheme } from "../theme";

import { IconComponent } from "../components/Icon";
import Text from "../components/Text";
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

  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Top Half - Icon and Status */}
        <View style={styles.topHalf}>
          {/* Left side: POS icon */}
          <View style={styles.iconContainer}>
            <IconComponent
              iconName="pos"
              iconSize={35} // Increased from 24 to 40
              iconColor={theme.colors.text || "#333"}
            />
          </View>

          {/* Right side: Status */}
          <View
            style={[
              styles.statusPill,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        </View>

        {/* Bottom Half - Two rows */}
        <View style={styles.bottomHalf}>
          {/* First Row: Serial Number (left) and Model (right) */}
          <View style={styles.bottomFirstRow}>
            <Text style={styles.serialNumber} numberOfLines={1}>
              {serialNumber}
            </Text>
            <Text style={styles.model} numberOfLines={1}>
              {model}
            </Text>
          </View>

          {/* Second Row: Address aligned to flex-end */}
          {addressName && (
            <View style={styles.bottomSecondRow}>
              <Text style={styles.addressName} numberOfLines={2}>
                {addressName}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "50%",
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 15,
      overflow: "hidden",
      // margin: 6,
      // borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: 8,
      minHeight: 120, // Increased to accommodate proper spacing
    },
    topHalf: {
      flexDirection: "row",
      alignItems: "center", // Changed from "flex-start" to "center"
      justifyContent: "space-between",
      height: "43%", // Slightly reduced to make room for spacing
      paddingBottom: 12, // Space between top content and bottom half
    },
    bottomHalf: {
      height: "57%", // Increased to compensate and maintain balance
      justifyContent: "flex-start",
      paddingTop: 20, // Small additional spacing at top of bottom half
    },
    bottomFirstRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      // marginBottom: 8, // Space between first and second row
    },
    bottomSecondRow: {
      alignItems: "flex-end",
    },
    iconContainer: {
      justifyContent: "flex-start",
      alignItems: "center",
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
      textAlign: "center",
    },
    serialNumber: {
      fontSize: 11,
      color: theme.colors.text,
      flex: 1,
      textAlign: "left",
    },
    model: {
      fontSize: 11,
      color: theme.colors.text,
      flex: 1,
      textAlign: "right",
    },
    addressName: {
      fontSize: 10,
      color: theme.colors.text || theme.colors.textSecondary,
      lineHeight: 14,
      textAlign: "right",
    },
  });
