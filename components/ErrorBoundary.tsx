import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "./Button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <AlertTriangle size={64} color={Colors.error} />
                        </View>

                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>
                            An unexpected error occurred. Please try again.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>Error Details:</Text>
                                <Text style={styles.errorMessage}>{this.state.error.message}</Text>
                                {this.state.error.stack && (
                                    <Text style={styles.errorStack}>{this.state.error.stack.substring(0, 500)}...</Text>
                                )}
                            </View>
                        )}

                        <Button
                            title="Try Again"
                            onPress={this.handleRetry}
                            style={styles.retryButton}
                        />
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        maxWidth: 400,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.text,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textMuted,
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 24,
    },
    errorDetails: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.border,
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.error,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 12,
        color: Colors.text,
        marginBottom: 8,
        fontFamily: "monospace",
    },
    errorStack: {
        fontSize: 10,
        color: Colors.textMuted,
        fontFamily: "monospace",
    },
    retryButton: {
        minWidth: 120,
    },
});