import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import Text from "../components/Text";

import { Colors } from "../theme";
import { IconComponent } from "./Icon";

interface IconButtonOptions {
  name?: string | number;
  size?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface UserCardProps extends Omit<TouchableOpacityProps, "style"> {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  onPress?: TouchableOpacityProps["onPress"];
  // styling overrides
  nameStyle?: StyleProp<TextStyle>;
  detailsStyle?: StyleProp<TextStyle>; // used for both phone and email
  touchableProps?: TouchableOpacityProps; // props forwarded to the TouchableOpacity wrapper
  // icon button options
  deleteIcon?: IconButtonOptions;
  editIcon?: IconButtonOptions;
}

export default function UserCard(props: UserCardProps) {
  const {
    id,
    name,
    email,
    phoneNumber,
    onPress,
    nameStyle,
    detailsStyle,
    touchableProps,
    deleteIcon,
    editIcon,
    ...restProps
  } = props;

  const colorScheme = useColorScheme();
  const isLight = colorScheme !== "dark";
  const textColor = isLight ? (Colors?.light?.text ?? "#000000") : (Colors?.dark?.text ?? "#ffffff");

  const deleteOpts: IconButtonOptions = {
    name: deleteIcon?.name ?? "delete",
    size: deleteIcon?.size ?? 40, // larger default
    color: deleteIcon?.color ?? "#ff3300ff",
    containerStyle: deleteIcon?.containerStyle,
  };

  const editOpts: IconButtonOptions = {
    name: editIcon?.name ?? "edit",
    size: editIcon?.size ?? 40, // larger default
    color: editIcon?.color ?? isLight ? "#062c55ff" : "#66a1ffff",
    containerStyle: editIcon?.containerStyle,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.wrapper}
      {...restProps}
      {...touchableProps}
    >
      <View style={styles.card}>
        {/* Right side: content */}
        <View style={styles.content}>
          <Text style={[styles.name, nameStyle, { color: textColor }]} numberOfLines={1}>
            {name}
          </Text>

          {email ? (
            <Text style={[styles.details, detailsStyle, { color: textColor, opacity: 0.85 }]} numberOfLines={1}>
              {email}
            </Text>
          ) : null}

          <Text style={[styles.details, detailsStyle, { color: textColor, opacity: 0.85 }]} numberOfLines={1}>
            {phoneNumber}
          </Text>
        </View>
        {/* Left side: action icons side-by-side */}
        <View style={styles.sideActions}>
          <View style={[styles.iconContainer, deleteOpts.containerStyle]}>
            <IconComponent
              iconName={deleteOpts.name || "delete"}
              iconSize={deleteOpts.size}
              iconColor={deleteOpts.color}
              onPress={() => console.log("delete pressed", id)}
            />
          </View>

          <View style={[styles.iconContainer, editOpts.containerStyle]}>
            <IconComponent
              iconName={editOpts.name || "edit"}
              iconSize={editOpts.size}
              iconColor={editOpts.color}
              onPress={() => console.log("edit pressed", id)}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CARD_BG = "#25367523"; // off-white greenish

const styles = StyleSheet.create({
  wrapper: {},
  card: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    padding: 16,
    borderWidth: 1,
    borderColor: "#a8e9f1ff",
    borderRadius: 12,
    // iOS shadow
    shadowColor: "#1c331621",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    // Android elevation
    elevation: 2,
    marginVertical: 8,
  },
  sideActions: {
    flex: 2,
    // make room for two larger icons side-by-side on the left
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 96,
    paddingRight: 8,
  },
  iconContainer: {
    margin: 8,
    backgroundColor: "#e1f0e834",
    borderRadius: 20,
  },
  content: {
    flex: 4,
    paddingLeft: 8,
    paddingRight: 4,
  },
  name: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000000ff",
    paddingStart: 4,
    marginBottom: 4,
  },
  details: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.95,
  },
});
