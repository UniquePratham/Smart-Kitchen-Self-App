import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarChart3, TrendingUp, Activity, Zap } from "lucide-react-native";
import Colors from "@/constants/colors";
import Card from "@/components/Card";

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BarChart3 size={28} color={Colors.primary} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Monitor your IoT ecosystem</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statLabel}>Total Devices</Text>
          <Text style={styles.statValue}>0</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIcon}>
            <Activity size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statLabel}>Active Now</Text>
          <Text style={styles.statValue}>0</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIcon}>
            <Zap size={24} color={Colors.warning} />
          </View>
          <Text style={styles.statLabel}>Alerts Today</Text>
          <Text style={styles.statValue}>0</Text>
        </Card>

        <Card style={styles.messageCard}>
          <Text style={styles.messageTitle}>Coming Soon</Text>
          <Text style={styles.messageText}>
            Advanced analytics and visualizations will be available in the next update.
            Track energy usage, uptime, and device performance metrics.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: 24,
  },
  statIcon: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  messageCard: {
    marginTop: 20,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
