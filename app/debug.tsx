import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import Colors from "@/constants/colors";
import api, { BASE_URL } from "@/utils/api";

export default function DebugScreen() {
    const [log, setLog] = useState<string[]>([]);
    const append = (s: string) => setLog((l) => [s, ...l].slice(0, 200));

    useEffect(() => {
        append(`BASE_URL=${BASE_URL}`);
    }, []);

    const runPing = async () => {
        append("-> Pinging backend via api.get('/')...");
        try {
            const res = await api.get("/");
            append(`OK ${res.status} ${res.config.url}`);
            append(JSON.stringify(res.data).slice(0, 1000));
        } catch (err: any) {
            append(`ERROR ${err.message}`);
            try {
                append(JSON.stringify(err.toJSON ? err.toJSON() : err));
            } catch (e) {
                append(String(e));
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Debug / Network Test</Text>
            <Text style={styles.subtitle}>Checks connectivity to {BASE_URL}</Text>
            <View style={styles.buttons}>
                <Button title="Ping backend" onPress={runPing} />
            </View>
            <ScrollView style={styles.log}>
                {log.map((l, i) => (
                    <Text key={i} style={styles.logLine}>{l}</Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: Colors.background },
    title: { fontSize: 20, fontWeight: "700" as const, color: Colors.text, marginBottom: 6 },
    subtitle: { color: Colors.textMuted, marginBottom: 12 },
    buttons: { marginBottom: 12 },
    log: { backgroundColor: Colors.surface, padding: 12, borderRadius: 8 },
    logLine: { color: Colors.text, marginBottom: 6, fontSize: 12 },
});
