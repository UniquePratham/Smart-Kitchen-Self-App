import React, { useRef } from "react";
import {
    TouchableOpacity,
    Animated,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { Plus } from "lucide-react-native";
import Colors from "@/constants/colors";

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: React.ReactNode;
    style?: ViewStyle;
    size?: number;
}

export default function FloatingActionButton({
    onPress,
    icon,
    style,
    size = 56,
}: FloatingActionButtonProps) {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    transform: [{ scale: scaleValue }],
                },
                style,
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    },
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                {icon || <Plus size={24} color={Colors.background} />}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        right: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    button: {
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
});