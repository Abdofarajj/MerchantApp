import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "../theme";
import { IconComponent, IconProps } from "./Icon";
export const FLOATING_ACTION_BUTTON_LOCATIONS: Record<string, string> = {
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
};

interface FloatingActionButtonProps extends Omit<IconProps, "iconName"> {
    iconName?: IconProps["iconName"];
    location?: string;
}

export default function FloatingActionButton(props: FloatingActionButtonProps) {
    const { location = FLOATING_ACTION_BUTTON_LOCATIONS.BOTTOM_RIGHT, iconName = "add", ...restProps } = props;

    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    return <View style={{
        position: 'absolute',
        ...(location.includes('bottom') ? { bottom: "20%" } : { top: "20%" }),
        ...(location.includes('right') ? { right: "10%" } : { left: "10%" }),
        }}>
        <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.iconContainer}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
        <IconComponent
        iconName={iconName}
        iconSize={40}
        iconColor={theme.colors.onPrimary}
        iconContainerStyle={[styles.iconContainer, { }]}
        {...restProps}
        />
        </LinearGradient>
    </View>
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
});
