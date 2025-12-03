import { MaterialIcons } from "@expo/vector-icons"; // material design icons from expo
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

import Text from "../components/Text";
export interface IconProps extends Omit<TouchableOpacityProps, "style"> {
  iconName: string | number;
  iconSize?: number;
  iconColor?: string;
  iconContainerStyle?: StyleProp<ViewStyle>;
  onPress?: TouchableOpacityProps["onPress"];
}

/**
 * Static asset map — add any icons you keep under src/assets/icons here.
 * This avoids dynamic require(...) which Metro doesn't allow.
 *
 * Example:
 *   ICON_ASSETS.person = require('../../assets/icons/person.png')
 *
 * Add only files that actually exist.
 */
export const ICON_ASSETS: Record<string, number> = {
  pos: require("../assets/icons/pos.png"),
  collect: require("../assets/icons/give-money.png"),
  recharge: require("../assets/icons/deposit.png"),
  download: require("../assets/icons/download.png"),
  plus: require("../assets/icons/plus.png"),
  arrow: require("../assets/icons/arrow.png"),
  home: require("../assets/icons/home.png"),
  users: require("../assets/icons/users.png"),
  transfer: require("../assets/icons/transfer.png"),
  moon: require("../assets/icons/moon.png"),
  sun: require("../assets/icons/sun.png"),
  share: require("../assets/icons/share.png"),
};

export function IconComponent(props: IconProps): React.ReactElement {
  const {
    iconName,
    iconSize = 24,
    iconColor = "#000",
    iconContainerStyle,
    onPress,
    ...restProps
  } = props;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
    iconContainerStyle,
  ];

  // 1) If string and present in ICON_ASSETS map -> use that image
  if (typeof iconName === "string" && ICON_ASSETS[iconName]) {
    const imageSource = ICON_ASSETS[iconName];
    const iconElement = (
      <View
        style={[
          containerStyle,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Image
          source={imageSource}
          style={{
            width: iconSize,
            height: iconSize,
            tintColor: iconColor,
          }}
          resizeMode="contain"
        />
      </View>
    );
    if (onPress) {
      return (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPress}
          style={undefined}
          {...restProps}
        >
          {iconElement}
        </TouchableOpacity>
      );
    } else {
      return iconElement;
    }
  }

  // 2) Check MaterialIcons glyph map for the name and render MaterialIcons if available
  let isMaterialIcon = false;
  if (typeof iconName === "string") {
    try {
      // getRawGlyphMap exists on vector icon components; guard in try/catch
      const glyphMap = (MaterialIcons as any).getRawGlyphMap?.();
      if (
        glyphMap &&
        Object.prototype.hasOwnProperty.call(glyphMap, iconName)
      ) {
        isMaterialIcon = true;
      }
    } catch {
      isMaterialIcon = false;
    }
  }

  if (isMaterialIcon) {
    const iconElement = (
      <View
        style={[
          containerStyle,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <MaterialIcons
          name={iconName as any}
          size={iconSize}
          color={iconColor}
        />
      </View>
    );
    if (onPress) {
      return (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPress}
          style={undefined}
          {...restProps}
        >
          {iconElement}
        </TouchableOpacity>
      );
    } else {
      return iconElement;
    }
  }

  // 3) Other fallback options:
  // - number (local require passed in by caller)
  // - http(s) remote uri
  // - default: render the text of the name
  let imageSource: ImageSourcePropType | undefined;
  if (typeof iconName === "number") {
    imageSource = iconName as number;
  } else if (typeof iconName === "string" && /^https?:\/\//.test(iconName)) {
    imageSource = { uri: iconName as string };
  } else {
    imageSource = undefined;
  }

  const inner = imageSource ? (
    <Image
      source={imageSource}
      style={{
        width: iconSize * 0.8,
        height: iconSize * 0.8,
        tintColor: iconColor,
      }}
      resizeMode="contain"
    />
  ) : (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{
        color: iconColor,
        fontSize: Math.round(iconSize * 0.5),
        textAlign: "center",
      }}
    >
      {String(iconName)}
    </Text>
  );

  const iconElement = (
    <View
      style={[
        containerStyle,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      {inner}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={undefined}
        {...restProps}
      >
        {iconElement}
      </TouchableOpacity>
    );
  } else {
    return iconElement;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
