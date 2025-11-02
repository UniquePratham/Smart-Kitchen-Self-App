import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import Card from "@/components/Card";
import FloatingActionButton from "@/components/FloatingActionButton";
import Toast from "@/components/Toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import api, { Device } from "@/utils/api";
import { getTimeAgo, isDeviceOnline } from "@/utils/helpers";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);

  const devicesQuery = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await api.get<Device[]>("/devices");
      return response.data;
    },
    refetchInterval: 30000,
  });

  const handleAddDevice = () => {
    setShowToast(true);
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const online = isDeviceOnline(item.updatedAt);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/device/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <Card style={styles.deviceCard}>
          <View style={styles.deviceHeader}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceLocation}>
                {item.location?.label || "No location"}
              </Text>
            </View>
            <View style={[styles.statusBadge, online ? styles.onlineBadge : styles.offlineBadge]}>
              {online ? (
                <MaterialCommunityIcons name="wifi" size={16} color={Colors.online} />
              ) : (
                <MaterialCommunityIcons name="wifi-off" size={16} color={Colors.offline} />
              )}
              <Text style={[styles.statusText, online ? styles.onlineText : styles.offlineText]}>
                {online ? "Online" : "Offline"}
              </Text>
            </View>
          </View>

          <View style={styles.deviceMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="thermometer" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>Last update: {getTimeAgo(item.updatedAt)}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Toast
        visible={showToast}
        message="Add device feature coming soon!"
        type="info"
        onHide={() => setShowToast(false)}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>IoT Nexus</Text>
          <Text style={styles.subtitle}>
            {devicesQuery.data?.length || 0} {devicesQuery.data?.length === 1 ? "Device" : "Devices"}
          </Text>
        </View>
      </View>

      {devicesQuery.isLoading && !devicesQuery.data ? (
        <View style={styles.centerContainer}>
          <LoadingSpinner size={48} />
        </View>
      ) : devicesQuery.data && devicesQuery.data.length > 0 ? (
        <FlatList
          data={devicesQuery.data}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={devicesQuery.isRefetching}
              onRefresh={devicesQuery.refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No devices found</Text>
          <Text style={styles.emptySubtext}>Add your first IoT device to get started</Text>
        </View>
      )}

      <FloatingActionButton onPress={handleAddDevice} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  listContent: {
    padding: 20,
  },
  deviceCard: {
    marginBottom: 16,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  onlineBadge: {
    backgroundColor: `${Colors.online}20`,
  },
  offlineBadge: {
    backgroundColor: `${Colors.offline}20`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  onlineText: {
    color: Colors.online,
  },
  offlineText: {
    color: Colors.offline,
  },
  deviceMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
  },
});
