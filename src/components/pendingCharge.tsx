import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconComponent as Icon } from "./Icon";
import Text from "./Text";

interface PendingChargeProps {
  item: any;
  onPress: () => void;
  onClose: () => void;
  theme: any;
}

export default function PendingCharge({
  item,
  onPress,
  onClose,
  theme,
}: PendingChargeProps) {
  const row1Text = `شحن رصيد الى ${item.appUserName}`;

  const statusText = "معلق";
  const amountText = `${item.amount} د.ل`;
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.amountView}>
        <Text style={styles.amountText}>{amountText}</Text>
      </View>
      {/* Left side area - takes full space */}
      <View style={styles.leftArea}>
        {/* Row 1: Single Text aligned to the right */}
        <View style={styles.row}>
          <Text weight="medium" style={styles.rightAlignedText}>
            {row1Text}
          </Text>
        </View>

        {/* Row 2: Status with date and amount */}
        <View style={styles.row}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text weight="light" style={styles.rightAlignedText}>
              {statusText}
            </Text>
            <Icon
              iconName="schedule"
              iconSize={25}
              iconColor="#ffc70dff"
              iconContainerStyle={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </View>

      {/* Right side close button */}
      <View style={styles.rightBox}>
        <TouchableOpacity onPress={onClose}>
          <Icon
            iconName="closeCircle"
            iconSize={20}
            iconColor={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "rgba(236, 210, 90, 0.2)",
      padding: 10,
      marginHorizontal: 5,
      borderRadius: 10,
    },
    leftArea: {
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
    rightAlignedText: {
      textAlign: "right",
      fontSize: 14,
      color: theme.colors.text,
    },
    amountText: {
      textAlign: "right",
      fontSize: 20,
      color: theme.colors.text,
    },
    amountView: {
      width: 80,
      justifyContent: "center",
      alignItems: "center",
    },
    rightBox: {
      width: 40,
      justifyContent: "center",
      alignItems: "center",
    },
  });
