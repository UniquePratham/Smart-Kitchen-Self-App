import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import Card from "@/components/Card";
import api, { DeviceSnapshot } from "@/utils/api";
import { getTimeAgo } from "@/utils/helpers";

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [toggleAnim] = useState(new Animated.Value(0));

  const deviceQuery = useQuery({
    queryKey: ["device", id],
    queryFn: async () => {
      const response = await api.get<DeviceSnapshot>(`/devices/${id}/snapshot`);
      return response.data;
    },
    refetchInterval: 10000,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/devices/${id}/toggle`);
      return response.data;
    },
    onSuccess: () => {
      deviceQuery.refetch();
      Animated.sequence([
        Animated.timing(toggleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toggleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
  });

  if (deviceQuery.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!deviceQuery.data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Device not found</Text>
      </View>
    );
  }

  const { device, latestReadings, latestOutputs } = deviceQuery.data;
  const ledOn = latestOutputs?.led_on || false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            {device.location && (
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color={Colors.textMuted} />
                <Text style={styles.locationText}>{device.location.label}</Text>
              </View>
            )}
          </View>
          <Animated.View
            style={[
              styles.powerButton,
              ledOn && styles.powerButtonOn,
              {
                transform: [
                  {
                    scale: toggleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleMutation.mutate()}
              disabled={toggleMutation.isPending}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="power" size={32} color={ledOn ? Colors.background : Colors.text} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensor Readings</Text>
        <View style={styles.sensorsGrid}>
          {latestReadings?.dht11 && (
            <>
              <Card style={styles.sensorCard}>
                <MaterialCommunityIcons name="thermometer" size={28} color={Colors.primary} />
                <Text style={styles.sensorLabel}>Temperature</Text>
                <Text style={styles.sensorValue}>{latestReadings.dht11.temp}°C</Text>
                <Text style={styles.sensorTime}>
                  {getTimeAgo(latestReadings.dht11.timestamp)}
                </Text>
              </Card>

              <Card style={styles.sensorCard}>
                <MaterialCommunityIcons name="water" size={28} color={Colors.secondary} />
                <Text style={styles.sensorLabel}>Humidity</Text>
                <Text style={styles.sensorValue}>{latestReadings.dht11.humidity}%</Text>
                <Text style={styles.sensorTime}>
                  {getTimeAgo(latestReadings.dht11.timestamp)}
                </Text>
              </Card>
            </>
          )}

          {latestReadings?.mq2 && (
            <Card style={styles.sensorCard}>
              <MaterialCommunityIcons name="weather-windy" size={28} color={Colors.warning} />
              <Text style={styles.sensorLabel}>Gas Level</Text>
              <Text style={styles.sensorValue}>{latestReadings.mq2.gas_ppm} ppm</Text>
              <Text style={styles.sensorTime}>
                {getTimeAgo(latestReadings.mq2.timestamp)}
              </Text>
            </Card>
          )}

          {latestReadings?.hx711 && (
            <Card style={styles.sensorCard}>
              <MaterialCommunityIcons name="flash" size={28} color={Colors.accent} />
              <Text style={styles.sensorLabel}>Weight</Text>
              <Text style={styles.sensorValue}>{latestReadings.hx711.weight_g}g</Text>
              <Text style={styles.sensorTime}>
                {getTimeAgo(latestReadings.hx711.timestamp)}
              </Text>
            </Card>
          )}
        </View>
      </View>

      {latestOutputs && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Status</Text>
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>LED</Text>
              <View style={[styles.statusBadge, ledOn && styles.statusBadgeOn]}>
                <Text style={[styles.statusText, ledOn && styles.statusTextOn]}>
                  {ledOn ? "ON" : "OFF"}
                </Text>
              </View>
            </View>
            {latestOutputs.buzzer_on !== undefined && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Buzzer</Text>
                <View
                  style={[styles.statusBadge, latestOutputs.buzzer_on && styles.statusBadgeOn]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      latestOutputs.buzzer_on && styles.statusTextOn,
                    ]}
                  >
                    {latestOutputs.buzzer_on ? "ON" : "OFF"}
                  </Text>
                </View>
              </View>
            )}
            {latestOutputs.spoilage_score !== undefined && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Spoilage Score</Text>
                <Text style={styles.spoilageScore}>{latestOutputs.spoilage_score}</Text>
              </View>
            )}
            {latestOutputs.timestamp && (
              <View style={styles.timestampRow}>
                <MaterialCommunityIcons name="clock" size={14} color={Colors.textMuted} />
                <Text style={styles.timestampText}>
                  Last update: {getTimeAgo(latestOutputs.timestamp)}
                </Text>
              </View>
            )}
          </Card>
        </View>
      )}

      {!latestReadings?.dht11 && !latestReadings?.mq2 && !latestReadings?.hx711 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No sensor data available</Text>
          <Text style={styles.emptySubtext}>Waiting for device to send readings</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  powerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  powerButtonOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 12,
  },
  sensorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sensorCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    paddingVertical: 20,
  },
  sensorLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 8,
    marginBottom: 4,
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  sensorTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusCard: {
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
  },
  statusBadgeOn: {
    backgroundColor: `${Colors.secondary}30`,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  statusTextOn: {
    color: Colors.secondary,
  },
  spoilageScore: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.warning,
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  timestampText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
