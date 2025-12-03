import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconComponent as Icon } from "./Icon";
import Text from "./Text";

interface ActivityCardProps {
  item: any;
  onPress: () => void;
  theme: any;
}

export default function ActivityCard({
  item,
  onPress,
  theme,
}: ActivityCardProps) {
  const isRecharge = item.type === "recharge";
  const isPay = item.type === "pay";
  const isCollect = item.type === "collect";
  const isPayOrCollect = isPay || isCollect;

  let row1Text = "";
  if (isRecharge) {
    row1Text = `شحن رصيد الى ${item.appUserName}`;
  } else if (isPayOrCollect) {
    row1Text = `${item.financialItemName} الى ${item.toAccountName}`;
  }

  const statusText = item.isApproved ? "تم الموافقة" : "معلق";
  const amountText = `${item.amount}${isCollect ? "+" : isPay ? "" : ""} د.ل`;
  const dateObj = item.chargeDate
    ? new Date(item.chargeDate)
    : new Date(item.insertDate);
  const dateText = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}:${String(dateObj.getSeconds()).padStart(2, "0")}, ${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${String(dateObj.getDate()).padStart(2, "0")}`;
  const styles = getStyles(theme, item.type);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Left side area - takes remaining space */}
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
              {statusText} • {dateText}
            </Text>
            <Icon
              iconName={item.isApproved ? "check-circle" : "schedule"}
              iconSize={25}
              iconColor={item.isApproved ? "green" : "#ffc70dff"}
              iconContainerStyle={{ marginLeft: 8 }}
            />
          </View>
          <Text style={styles.amountText}>{amountText}</Text>
        </View>

        {/* Row 3: ID */}
        <View style={styles.row}>
          <Text weight="light" style={styles.rightAlignedText}>
            #{item.id}
          </Text>
        </View>
      </View>

      {/* Right side box - fixed width of 50 */}
      <View style={styles.rightBox}>
        {isCollect ? (
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <Icon iconName="arrow" iconSize={30} iconColor="#000000ff" />
          </View>
        ) : (
          <Icon
            iconName={isRecharge ? "plus" : isPay ? "arrow" : "help"}
            iconSize={isRecharge ? 20 : 30}
            iconColor="#000000ff"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: any, type: string) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      padding: 15,
      marginVertical: 5,
      marginHorizontal: 8,
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
      fontSize: 17,
      color: type === "collect" ? "green" : theme.colors.text,
    },
    rightBox: {
      width: 40,
      justifyContent: "center",
      alignItems: "center",
    },
  });
