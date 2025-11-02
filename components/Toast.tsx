import React, { useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    Animated,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/colors"; interface ToastProps {
    visible: boolean;
    message: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
    onHide: () => void;
}

export default function Toast({
    visible,
    message,
    type = "info",
    duration = 3000,
    onHide,
}: ToastProps) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const hideToast = useCallback(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    }, [translateY, opacity, onHide]);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible, duration, hideToast, translateY, opacity]); const getIcon = () => {
        switch (type) {
            case "success":
                return <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />;
            case "error":
                return <MaterialCommunityIcons name="close-circle" size={20} color={Colors.error} />;
            case "warning":
                return <MaterialCommunityIcons name="alert-circle" size={20} color={Colors.warning} />;
            default:
                return <MaterialCommunityIcons name="information" size={20} color={Colors.primary} />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return `${Colors.success}15`;
            case "error":
                return `${Colors.error}15`;
            case "warning":
                return `${Colors.warning}15`;
            default:
                return `${Colors.primary}15`;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case "success":
                return Colors.success;
            case "error":
                return Colors.error;
            case "warning":
                return Colors.warning;
            default:
                return Colors.primary;
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                },
            ]}
        >
            <View style={styles.content}>
                {getIcon()}
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 60,
        left: 16,
        right: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
        fontWeight: "500",
    },
    closeButton: {
        padding: 4,
    },
});