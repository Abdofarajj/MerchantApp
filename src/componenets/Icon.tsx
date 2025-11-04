import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from "react-native";

interface IconProps extends Omit<TouchableOpacityProps, "style"> {
    iconName: string | number;
    iconSize?: number;
    iconColor?: string;
    buttoncontainerStyle?: StyleProp<ViewStyle>;
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
    // person: require('../../assets/icons/person.png'),
    // logo: require('../../assets/icons/logo.png'),
};

export function IconComponent(props: IconProps): React.ReactElement {
    const {
        iconName,
        iconSize = 24,
        iconColor = "#000",
        buttoncontainerStyle,
        onPress,
        ...restProps
    } = props;

    const containerStyle: StyleProp<ViewStyle> = [
        styles.container,
        { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
        buttoncontainerStyle,
    ];

    // Resolve image source:
    // 1) number (local require passed in by caller)
    // 2) http(s) remote uri (string)
    // 3) lookup in explicit ICON_ASSETS map (string)
    let imageSource: ImageSourcePropType | undefined;
    if (typeof iconName === "number") {
        imageSource = iconName as number;
    } else if (typeof iconName === "string" && /^https?:\/\//.test(iconName)) {
        imageSource = { uri: iconName as string };
    } else if (typeof iconName === "string") {
        // explicit static lookup only — no dynamic require
        const asset = ICON_ASSETS[iconName];
        if (asset) {
            imageSource = asset;
        } else {
            imageSource = undefined;
        }
    }

    const inner = imageSource ? (
        <Image
            source={imageSource}
            style={{ width: iconSize * 0.6, height: iconSize * 0.6, tintColor: iconColor }}
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

    return (
        <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={undefined} {...restProps}>
            <View style={[containerStyle, { justifyContent: "center", alignItems: "center" }]}>
                {inner}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
});