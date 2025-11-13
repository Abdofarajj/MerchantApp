import React from "react";
import { Text as RNText, StyleProp, TextProps } from "react-native";

type FontWeight =
  | "thin"
  | "extraLight"
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "bold"
  | "extraBold"
  | "black";

interface CustomTextProps extends TextProps {
  weight?: FontWeight;
  style?: StyleProp<any>;
}

const fontMap: Record<FontWeight, string> = {
  thin: "AlexandriaThin",
  extraLight: "AlexandriaExtraLight",
  light: "AlexandriaLight",
  regular: "AlexandriaRegular",
  medium: "AlexandriaMedium",
  semiBold: "AlexandriaSemiBold",
  bold: "AlexandriaBold",
  extraBold: "AlexandriaExtraBold",
  black: "AlexandriaBlack",
};

export default function Text({
  weight = "regular",
  style,
  ...props
}: CustomTextProps) {
  const fontFamily = fontMap[weight];

  return <RNText {...props} style={[style, { fontFamily }]} />;
}
