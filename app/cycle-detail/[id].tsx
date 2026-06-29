import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Cycle, getCycleById } from "@/services/cycle.service";

const MAIN_COLOR = "#E5563D";
const MAIN_SOFT = "#FCECE9";

export default function CycleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCycle = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getCycleById(id);
      setCycle(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cycle");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCycle();
  }, [fetchCycle]);

  const handleEdit = () => {
    if (!cycle) return;
    router.push({
      pathname: "/edit-cycle",
      params: { id: cycle.id },
    });
  };

  const Row = ({
    label,
    value,
    isLast,
  }: {
    label: string;
    value: string;
    isLast?: boolean;
  }) => (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Cycle Details",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Lexend_600SemiBold",
            fontSize: 18,
            color: "#1A1A1A",
          },
          headerStyle: { backgroundColor: "#FFF" },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          ),
          headerRight: () =>
            cycle ? (
              <TouchableOpacity
                onPress={handleEdit}
                style={styles.headerEditBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color={MAIN_COLOR} />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={MAIN_COLOR} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="alert-circle-outline" size={28} color="#DC2626" />
            </View>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={fetchCycle}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry View</Text>
            </TouchableOpacity>
          </View>
        ) : cycle ? (
          <>
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: insets.bottom + 100 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* HERO SUMMARY CARD */}
              <View style={styles.heroCard}>
                <View style={styles.heroTopRow}>
                  <View style={styles.heroHeader}>
                    <View style={styles.iconWrapper}>
                      <Ionicons name="water" size={20} color={MAIN_COLOR} />
                    </View>
                    <View style={styles.heroTitleContainer}>
                      <Text style={styles.heroRangeText}>
                        {moment(cycle.startDate).format("MMM D")}
                        {cycle.endDate
                          ? ` – ${moment(cycle.endDate).format("MMM D, YYYY")}`
                          : " — Present"}
                      </Text>
                      <Text style={styles.heroYearText}>
                        {moment(cycle.startDate).format("YYYY")} Timeline
                      </Text>
                    </View>
                  </View>

                  {!cycle.endDate && (
                    <View style={styles.activeBadge}>
                      <View style={styles.activeDot} />
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.editPill}
                  onPress={handleEdit}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="create-outline"
                    size={15}
                    color={MAIN_COLOR}
                  />
                  <Text style={styles.editPillText}>Edit this cycle</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={MAIN_COLOR}
                  />
                </TouchableOpacity>
              </View>

              {/* BLOCK 1: METRICS */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="analytics-outline"
                    size={18}
                    color="#1A1A1A"
                  />
                  <Text style={styles.sectionTitle}>Cycle Metrics</Text>
                </View>
                <Row
                  label="Cycle duration"
                  value={
                    cycle.cycleLength
                      ? `${cycle.cycleLength} days`
                      : "In progress"
                  }
                />
                <Row
                  label="Bleeding window"
                  value={
                    cycle.bleedingLength ? `${cycle.bleedingLength} days` : "—"
                  }
                />
                <Row label="Classification" value={cycle.type || "Standard"} />
                <Row label="Current Phase" value={cycle.phase || "—"} />
                <Row
                  label="Irregularity flags"
                  value={cycle.isIrregular ? "Yes" : "No"}
                />
                <Row
                  label="Algorithmic prediction"
                  value={cycle.isPredicted ? "Yes" : "No"}
                  isLast={true}
                />
              </View>

              {/* BLOCK 2: FERTILITY */}
              {(cycle.ovulationDate || cycle.fertileWindowStart) && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="sparkles-outline"
                      size={18}
                      color="#1A1A1A"
                    />
                    <Text style={styles.sectionTitle}>
                      Fertility Indicators
                    </Text>
                  </View>
                  <Row
                    label="Estimated ovulation"
                    value={
                      cycle.ovulationDate
                        ? moment(cycle.ovulationDate).format("MMMM D, YYYY")
                        : "—"
                    }
                  />
                  <Row
                    label="Fertile window"
                    value={
                      cycle.fertileWindowStart && cycle.fertileWindowEnd
                        ? `${moment(cycle.fertileWindowStart).format("MMM D")} – ${moment(cycle.fertileWindowEnd).format("MMM D, YYYY")}`
                        : "—"
                    }
                    isLast={true}
                  />
                </View>
              )}

              {/* BLOCK 3: NOTES */}
              {(cycle.notes || (cycle.tags && cycle.tags.length > 0)) && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#1A1A1A"
                    />
                    <Text style={styles.sectionTitle}>Log entries & Tags</Text>
                  </View>

                  {cycle.notes && (
                    <Text style={styles.notesText}>{cycle.notes}</Text>
                  )}

                  {cycle.tags && cycle.tags.length > 0 && (
                    <View style={styles.tagCloud}>
                      {cycle.tags.map((tag, idx) => (
                        <View key={idx} style={styles.tagPill}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* STICKY EDIT CTA */}
            <View
              style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}
            >
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEdit}
                activeOpacity={0.85}
              >
                <Ionicons name="create-outline" size={18} color="#fff" />
                <Text style={styles.editButtonText}>Edit Cycle</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  headerBackBtn: {
    paddingLeft: 4,
    paddingRight: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerEditBtn: {
    paddingRight: 4,
    paddingLeft: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F3F3",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: MAIN_SOFT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  heroTitleContainer: {
    flex: 1,
  },
  heroRangeText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 17,
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  heroYearText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#737373",
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#137333",
  },
  activeBadgeText: {
    fontSize: 11,
    color: "#137333",
    fontFamily: "Lexend_500Medium",
  },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: MAIN_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    gap: 6,
  },
  editPillText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: MAIN_COLOR,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F3F3",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F7",
  },
  rowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  rowLabel: {
    fontFamily: "Lexend_400Regular",
    color: "#737373",
    fontSize: 14,
  },
  rowValue: {
    fontFamily: "Lexend_500Medium",
    color: "#1A1A1A",
    fontSize: 14,
  },
  notesText: {
    fontFamily: "Lexend_400Regular",
    color: "#404040",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
  },
  tagCloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagPill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 12,
    color: "#404040",
    fontFamily: "Lexend_400Regular",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  errorText: {
    fontFamily: "Lexend_500Medium",
    color: "#1A1A1A",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: MAIN_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 100,
  },
  retryButtonText: {
    color: "#FFF",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },

  /* Sticky bottom edit bar */
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F3F3",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: MAIN_COLOR,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: "#fff",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15,
  },
});
