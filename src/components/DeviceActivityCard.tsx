import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "./Text";

interface DeviceActivityCardProps {
  item: any;
  onPress?: () => void;
  theme: any;
}

export default function DeviceActivityCard({
  item,
  onPress,
  theme,
}: DeviceActivityCardProps) {
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Left side box - logoCardType as image */}
      <View style={styles.leftBox}>
        <Image
          source={{ uri: item.logoCardType }}
          style={styles.logoImage}
          contentFit="contain"
          placeholder={require("../assets/images/empty.png")}
        />
      </View>

      {/* Right side area - takes remaining space */}
      <View style={styles.rightArea}>
        {/* Row 1: cardTypeName */}
        <View style={styles.row}>
          <Text weight="medium" style={styles.rightAlignedText}>
            {item.cardTypeName}
          </Text>
        </View>

        {/* Row 2: cardName and inserDate */}
        <View style={styles.rowTight}>
          <Text weight="light" style={styles.cardNameText}>
            {item.cardName}
          </Text>
          <Text weight="light" style={styles.bulletText}>
            •
          </Text>
          <Text weight="light" style={styles.dateText}>
            {new Date(item.inserDate)
              .toLocaleString("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .replace(/-/g, "/")}
          </Text>
        </View>

        {/* Row 3: document id # */}
        <View style={styles.row}>
          <Text weight="light" style={styles.rightAlignedText}>
            #{item.documentId}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "white",
      borderRadius: 12,
      padding: 15,
      marginVertical: 5,
      marginHorizontal: 16,
      shadowColor: "#0000008e",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },
    rightArea: {
      flex: 1,
      justifyContent: "space-between",
      flexDirection: "column", // keep vertical stacking
    },
    row: {
      flexDirection: "row-reverse", // 👈 flips order of text inside row only
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    rowTight: {
      flexDirection: "row-reverse", // RTL like other rows
      alignItems: "center",
      gap: 6, // optional elegant spacing
    },
    rightAlignedText: {
      textAlign: "right",
      writingDirection: "rtl",
      fontSize: 14,
      color: theme.colors.text,
    },
    cardNameText: {
      textAlign: "right",
      writingDirection: "rtl",
      fontSize: 14,
      color: theme.colors.text,
    },
    bulletText: {
      textAlign: "center",
      fontSize: 14,
      color: theme.colors.text,
    },
    dateText: {
      textAlign: "left",
      writingDirection: "ltr",
      fontSize: 14,
      color: theme.colors.text,
    },
    amountText: {
      textAlign: "right",
      fontSize: 17,
      color: theme.colors.text,
    },
    leftBox: {
      width: 40,
      justifyContent: "center",
      marginRight: 12, // Add some spacing between image and text
    },
    logoImage: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
  });
