import React from "react";
import {
    Image,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from "react-native";

// map common vector icon families; add more if needed
const IconMap: Record<string, any> = {
    MaterialIcons: require("react-native-vector-icons/MaterialIcons").default,
    FontAwesome: require("react-native-vector-icons/FontAwesome").default,
    Ionicons: require("react-native-vector-icons/Ionicons").default,
    Entypo: require("react-native-vector-icons/Entypo").default,
};

interface IconProps extends Omit<TouchableOpacityProps, "style"> {
    iconName: string;
    iconFamily?: keyof typeof IconMap;
    iconSize?: number;
    iconColor?: string;
    onPress?: TouchableOpacityProps["onPress"];
    buttoncontainerStyle?: StyleProp<ViewStyle>;
    gradient?: boolean;
    gradientColors?: string[];
    gradientStart?: { x: number; y: number };
    gradientEnd?: { x: number; y: number };
}

export class IconComponent extends React.Component<IconProps> {
    render(): React.ReactNode {
        const {
            iconName,
            iconFamily = "MaterialIcons",
            iconSize = 24,
            iconColor = "#000",
            gradient,
            buttoncontainerStyle,
            gradientColors = ["#fff", "#000"],
            gradientStart = { x: 0, y: 0 },
            gradientEnd = { x: 1, y: 1 },
            onPress,
            ...restProps
        } = this.props;

        const containerStyle: StyleProp<ViewStyle> = [
            styles.container,
            { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
            buttoncontainerStyle,
        ];

        // Try treat iconName as an image uri if it looks like one
        const isUri = typeof iconName === "string" && /^https?:\/\//.test(iconName);
        const imageSource = isUri ? { uri: iconName } : undefined;

        let iconInner: React.ReactNode;
        if (imageSource) {
            iconInner = (
                <Image
                    source={imageSource}
                    style={{ width: iconSize * 0.6, height: iconSize * 0.6, tintColor: iconColor }}
                    resizeMode="contain"
                />
            );
        } else {
            // use vector icon
            const VectorIcon = IconMap[iconFamily] || IconMap.MaterialIcons;
            iconInner = (
                <VectorIcon
                    name={iconName}
                    size={Math.round(iconSize * 0.6)}
                    color={iconColor}
                    style={{ width: iconSize * 0.6, height: iconSize * 0.6 }}
                />
            );
        }

        // If you want real gradients install react-native-linear-gradient and swap the inner View for <LinearGradient>
        const content = gradient ? (
            <View
                style={[
                    containerStyle,
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        // simple fallback gradient look — replace with LinearGradient for true gradients
                        backgroundColor: gradientColors[0],
                    },
                ]}
            >
                {iconInner}
            </View>
        ) : (
            <View style={[containerStyle, { justifyContent: "center", alignItems: "center" }]}>
                {iconInner}
            </View>
        );

        return (
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={onPress}
                style={undefined} // keep wrapper styling in content (containerStyle)
                {...restProps}
            >
                {content}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
});