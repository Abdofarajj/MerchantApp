import React from "react";
import {
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

import { IconComponent } from "./Icon";
import Text from "./Text";

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  iconName?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconBackground?: string;
}

export default function InfoRow({
  label,
  value = "-",
  iconName,
  style,
  labelStyle,
  valueStyle,
  iconColor = "#2563EB",
  iconBackground = "rgba(37, 99, 235, 0.08)",
}: InfoRowProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.texts}>
        <Text
          weight="medium"
          style={[styles.label, labelStyle]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {React.isValidElement(value) ? (
          value
        ) : (
          <Text
            weight="semiBold"
            style={[styles.value, valueStyle]}
            numberOfLines={1}
          >
            {value}
          </Text>
        )}
      </View>
      {iconName ? (
        <IconComponent
          iconName={iconName}
          iconSize={38}
          iconColor={iconColor}
          iconContainerStyle={[
            styles.iconContainer,
            { backgroundColor: iconBackground },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  texts: {
    flex: 1,
    marginRight: 12,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 14,
    color: "#64748b",
  },
  value: {
    fontSize: 16,
    color: "#0f172a",
    marginTop: 4,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

