import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

import { IconComponent } from "./Icon";
import Text from "./Text";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  height?: number;
  width?: number;
  backgroundColor?: string;
  gradientColors?: string[];
  text?: string;
  textColor?: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  height = 60,
  width,
  backgroundColor = "#333333",
  gradientColors,
  text,
  textColor = "white",
  iconName,
  iconSize = 24,
  iconColor = "white",
  loading = false,
  disabled = false,
  style,
  children,
  ...props
}) => {
  const buttonStyle: ViewStyle = {
    height,
    width,
    borderRadius: 15,
    overflow: "hidden",
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const content = (
    <View style={styles.content}>
      {loading && <ActivityIndicator size="small" color="white" />}
      {!loading && iconName && (
        <IconComponent
          iconName={iconName}
          iconSize={iconSize}
          iconColor={iconColor}
        />
      )}
      {!loading && text && (
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      )}
      {children}
    </View>
  );

  if (gradientColors) {
    return (
      <TouchableOpacity
        style={buttonStyle}
        disabled={disabled || loading}
        {...props}
      >
        <LinearGradient
          colors={gradientColors as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[buttonStyle, { backgroundColor }]}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default Button;
