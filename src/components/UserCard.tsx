import React, { useRef } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import Text from "../components/Text";
import { RootStackParamList } from "../navigation/AppNavigator";
import { usedeleteUserDeviceMutation as useDeleteUserDeviceMutation, UserDevice } from "../services";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";
import { IconComponent } from "./Icon";
import { ConfirmationModal, ConfirmationModalRef } from "./Modal";
interface IconButtonOptions {
  name?: string | number;
  size?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface UserCardProps extends Omit<TouchableOpacityProps, "style"> {
  user: UserDevice;
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
    user,
    onPress,
    nameStyle,
    detailsStyle,
    touchableProps,
    deleteIcon,
    editIcon,
    ...restProps
  } = props;
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const textColor = theme?.colors.text;
  const CARD_BG = theme?.colors.surface;
  const deleteOpts: IconButtonOptions = {
    name: deleteIcon?.name ?? "delete",
    size: deleteIcon?.size ?? 36, // larger default
    color: deleteIcon?.color ?? "#ff3300ff",
    containerStyle: deleteIcon?.containerStyle,
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const editOpts: IconButtonOptions = {
    name: editIcon?.name ?? "edit",
    size: editIcon?.size ?? 36, // larger default
    color: editIcon?.color ?? theme.colors.primary,
    containerStyle: editIcon?.containerStyle,
  };
  
  const { error } = useToast();
  const deleteUserDeviceMutation = useDeleteUserDeviceMutation();
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
    const handleDelete = () => {
      deleteUserDeviceMutation.mutate(
        { id: user.id },
        {
          onSuccess: (response) => {
            // Handle success (e.g., show a success message, navigate back, etc.)
            alert("تم حذف مستخدم الجهاز بنجاح");
          },
          onError: (err) => {
            // Handle error (e.g., show an error message)
            error("حدث خطأ أثناء حذف مستخدم الجهاز");
            console.error("Delete User Device Error:", err);
        }
      }
    ) 
    };

  return (<View>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.wrapper}
      {...restProps}
      {...touchableProps}
    >
      <View style={[  styles.card, { backgroundColor: CARD_BG }]}>
        {/* Right side: content */}
        <View style={styles.content}>
          <Text style={[styles.name, nameStyle, { color: textColor, borderBottomColor: theme.colors.onSurface }]} numberOfLines={1}>
            {user.displayName}
          </Text>

          {user.email ? (
            <Text style={[styles.details, detailsStyle, { color: textColor, opacity: 0.85 }]} numberOfLines={1}>
              {user.email}
            </Text>
          ) : null}

          <Text style={[styles.details, detailsStyle, { color: textColor, opacity: 0.85 }]} numberOfLines={1}>
            {user.phoneNumber}
          </Text>
        </View>
        {/* Left side: action icons side-by-side */}
        <View style={styles.sideActions}>
          <View style={[styles.iconContainer, deleteOpts.containerStyle, {backgroundColor: theme.colors.background2}]}>
            <IconComponent
              iconName={deleteOpts.name || "delete"}
              iconSize={deleteOpts.size}
              iconColor={deleteOpts.color}
              onPress={() => { confirmationModalRef.current?.present(); }}
            />
          </View>

          <View style={[styles.iconContainer, editOpts.containerStyle, {backgroundColor: theme.colors.background2}]}>
            <IconComponent
              iconName={editOpts.name || "edit"}
              iconSize={editOpts.size}
              iconColor={editOpts.color}
              onPress={() => {
                console.log("edit pressed", user.id)
                navigation.navigate("EditUser", { user: user});
              }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
    <ConfirmationModal
            ref={confirmationModalRef}
            desc="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
            onConfirm={handleDelete}
            onCancel={() => {
              // Handle cancel action
              console.log("Cancelled");
            }}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  card: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    // iOS shadow
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
    padding: 4,
    marginVertical: 4,
    borderRadius: 8,
  },
  content: {
    flex: 4,
    paddingLeft: 8,
    paddingRight: 4,
  },
  name: {
    fontSize: 20,
    borderBottomWidth: 1,
    paddingStart: 4,
    marginBottom: 4,
  },
  details: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.95,
  },
});
