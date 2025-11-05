import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle
} from "react-native";
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

  const deleteOpts: IconButtonOptions = {
    name: deleteIcon?.name ?? "delete",
    size: deleteIcon?.size ?? 45, // larger default
    color: deleteIcon?.color ?? "#c42525ff",
    containerStyle: deleteIcon?.containerStyle,
  };

  const editOpts: IconButtonOptions = {
    name: editIcon?.name ?? "edit",
    size: editIcon?.size ?? 45, // larger default
    color: editIcon?.color ?? "#152f79ff",
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

        {/* Right side: content */}
        <View style={styles.content}>
          <Text style={[styles.name, nameStyle]} numberOfLines={1}>
            {name}
          </Text>

          {email ? (
            <Text style={[styles.details, detailsStyle]} numberOfLines={1}>
              {email}
            </Text>
          ) : null}

          <Text style={[styles.details, detailsStyle]} numberOfLines={1}>
            {phoneNumber}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CARD_BG = "#49f37373"; // off-white blue

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 12,
    // iOS shadow
    shadowColor: "#dde4dbb0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Android elevation
    elevation: 2,
    marginVertical: 8,
  },
  sideActions: {
    // make room for two larger icons side-by-side on the left
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 96,
    paddingRight: 8,
  },
  iconContainer: {
    marginHorizontal: 8,
    backgroundColor: "#e1f0e891",
    borderRadius: 16,
  },
  content: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    
    color: "#0b3b66",
    textAlign: "right",
  },
  details: {
    marginTop: 4,
    fontSize: 14,
    color: "#56606bff",
    opacity: 0.8,
    textAlign: "right",
  },
});

