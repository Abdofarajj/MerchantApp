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
  label?: string;
  value?: React.ReactNode;
  iconName?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconBackground?: string;
  hideLabel?: boolean;
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
  hideLabel = false,
}: InfoRowProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.texts, hideLabel && styles.textsNoLabel]}>
        {!hideLabel && label ? (
          <Text
            weight="medium"
            style={[styles.label, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
        ) : null}
        <View style={[styles.valueContainer, hideLabel && styles.valueContainerNoLabel]}>
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
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 0, // Allow shrinking
  },
  textsNoLabel: {
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    flexShrink: 0, // Don't shrink label
  },
  valueContainer: {
    flex: 1,
    marginLeft: 8,
    minWidth: 0, // Allow shrinking
  },
  valueContainerNoLabel: {
    marginLeft: 0,
  },
  value: {
    fontSize: 16,
    color: "#0f172a",
    textAlign: "right",
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0, // Don't shrink icon
  },
});
