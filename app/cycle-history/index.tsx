import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Cycle, getCycles } from "@/services/cycle.service";

const Colors = {
  main: "#FF699C",
  mainSoft: "#FFF5F4",
  headerText: "#1C1C1E",
  textDark: "#1F1F1F",
  textMuted: "#6B7280",
  white: "#FFFFFF",
  background: "#FCFCFC",
  border: "#F3F4F6",
};

export default function CycleHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCycles();
      const sorted = [...data].sort(
        (a, b) => moment(b.startDate).valueOf() - moment(a.startDate).valueOf(),
      );
      setCycles(sorted);
    } catch (err) {
      console.error(err);
      setCycles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCycles();
    }, [fetchCycles]),
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Cycle History",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Lexend_600SemiBold",
            fontSize: 18,
            color: Colors.headerText,
          },
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.main} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.main} />
          </View>
        ) : cycles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="calendar-outline"
                size={42}
                color={Colors.textMuted}
              />
            </View>
            <Text style={styles.emptyTitle}>No cycle history yet</Text>
            <Text style={styles.emptySubtitle}>
              Your logged cycles will appear here as you track them
            </Text>
          </View>
        ) : (
          <FlatList
            data={cycles}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isOngoing = !item.endDate;
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/cycle-detail/[id]",
                      params: { id: item.id },
                    })
                  }
                  style={[styles.card, isOngoing && styles.cardActive]}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.dateRow}>
                      <Text style={styles.dateText}>
                        {moment(item.startDate).format("MMM D, YYYY")}
                        {item.endDate &&
                          ` — ${moment(item.endDate).format("MMM D, YYYY")}`}
                      </Text>
                      {isOngoing && (
                        <View style={styles.ongoingBadge}>
                          <View style={styles.ongoingDot} />
                          <Text style={styles.ongoingText}>Ongoing</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={Colors.textMuted}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.infoText}>
                        {item.cycleLength
                          ? `${item.cycleLength} day cycle`
                          : "Cycle length pending"}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isOngoing ? Colors.main : Colors.textMuted}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackBtn: {
    marginLeft: 16,
    padding: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardActive: {
    borderColor: Colors.main,
    backgroundColor: Colors.mainSoft,
  },
  cardContent: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  dateText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15.5,
    color: Colors.textDark,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13.5,
    color: Colors.textMuted,
  },
  ongoingBadge: {
    backgroundColor: Colors.mainSoft,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ongoingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.main,
  },
  ongoingText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: Colors.main,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 17,
    color: Colors.textDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13.5,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
