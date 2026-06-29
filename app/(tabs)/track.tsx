import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CalendarList } from "react-native-calendars";

import { useAuth } from "@/providers/AuthProviders";
import {
  Cycle,
  createCycle,
  getCycles,
  updateCycle,
} from "@/services/cycle.service";

/* ==========================================================================
   DESIGN SYSTEM CONSTANTS
   ========================================================================== */
const MAIN_COLOR = "#E5563D";
const LIGHT_ORANGE = "#FCECE9"; // Uniform warm tint matching detail screen accents
const TEXT_DARK = "#1A1A1A";
const TEXT_MUTED = "#737373";

export default function TrackScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasNoCycles, setHasNoCycles] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD"),
  );

  const opacity = useRef(new Animated.Value(0)).current;

  /* ==========================================================================
     DATA MUTATION / SYNC PIPELINE
     ========================================================================== */
  const fetchCycles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getCycles();

      if (!data || data.length === 0) {
        setHasNoCycles(true);
        setCycles([]);
        return;
      }

      setHasNoCycles(false);
      setCycles(data);
    } catch (err: any) {
      Alert.alert("Sync Error", err.message || "Failed to load cycle charts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchCycles();
    }, [fetchCycles]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCycles();
  };

  const goToCycleSetup = () => {
    router.push("/cycle-setup/last-period");
  };

  /* ==========================================================================
     IN-FLIGHT STATE COMPUTATIONS
     ========================================================================== */
  const activeCycle = useMemo(() => cycles.find((c) => !c.endDate), [cycles]);
  const periodActive = !!activeCycle;

  const findCycleForDate = useCallback(
    (dateStr: string) => {
      const date = moment(dateStr);
      return cycles.find((c) => {
        const start = moment(c.startDate);
        const end = c.endDate ? moment(c.endDate) : moment(); // ongoing -> fallback to today
        return date.isBetween(start, end, "day", "[]");
      });
    },
    [cycles],
  );

  /* ==========================================================================
     CALENDAR EMBEDDED MARK MARKERS
     ========================================================================== */
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    const today = moment();

    cycles.forEach((c) => {
      const start = moment(c.startDate);
      let length: number;

      if (!c.endDate) {
        length = today.diff(start, "days") + 1;
      } else {
        length = c.bleedingLength || 5;
      }

      for (let i = 0; i < length; i++) {
        const date = start.clone().add(i, "days").format("YYYY-MM-DD");
        marks[date] = {
          customStyles: {
            container: {
              backgroundColor: LIGHT_ORANGE,
              borderRadius: 20,
            },
            text: {
              color: TEXT_DARK,
              fontFamily: "Lexend_600SemiBold",
              fontSize: 14,
            },
          },
        };
      }
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        customStyles: {
          container: {
            backgroundColor: MAIN_COLOR,
            borderRadius: 20,
          },
          text: {
            color: "#FFF",
            fontFamily: "Lexend_600SemiBold",
            fontSize: 14,
          },
        },
      };
    }

    return marks;
  }, [cycles, selectedDate]);

  /* ==========================================================================
     INTERACTIVE ANIMATION TRIGGERS
     ========================================================================== */
  const showFeedback = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePeriodAction = async () => {
    const todayStr = moment().format("YYYY-MM-DD");

    try {
      setActionLoading(true);

      if (!periodActive) {
        await createCycle({
          startDate: todayStr,
          bleedingLength: 5, // Clean fallback default for data tracking accuracy
        });
      } else {
        const start = moment(activeCycle!.startDate);
        const bleedingLength = moment().diff(start, "days") + 1;

        await updateCycle(activeCycle!.id, {
          endDate: todayStr,
          bleedingLength,
        });
      }

      showFeedback();
      await fetchCycles();
    } catch (err: any) {
      Alert.alert("Update Failed", err.message || "An issue occurred while logging.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={MAIN_COLOR} />
      </View>
    );
  }

  /* ==========================================================================
     EMPTY BOOTSTRAP TEMPLATE
     ========================================================================== */
  if (hasNoCycles) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="calendar-outline" size={32} color="#A3A3A3" />
        </View>
        <Text style={styles.emptyTitle}>No cycles yet</Text>
        <Text style={styles.emptySubtext}>
          Start tracking your cycle to get personalized predictions and health insights.
        </Text>

        <TouchableOpacity onPress={goToCycleSetup} style={styles.primarySetupBtn} activeOpacity={0.8}>
          <Text style={styles.primarySetupBtnText}>Start Tracking</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ==========================================================================
     MAIN INTERFACE RENDER
     ========================================================================== */
  return (
    <View style={styles.container}>
      {/* QUICK LOG CONTROL HUB */}
      <View style={styles.actionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateLabel}>
            {moment(selectedDate).isSame(moment(), "day")
              ? "Today"
              : moment(selectedDate).format("MMMM D, YYYY")}
          </Text>

          <TouchableOpacity 
            onPress={() => router.push("/cycle-history")}
            style={styles.historyBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={22} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardInstruction}> Tap below to log or update your period window</Text>

        <TouchableOpacity
          onPress={handlePeriodAction}
          disabled={actionLoading}
          activeOpacity={0.8}
          style={[styles.logActionButton, periodActive ? styles.btnActiveState : styles.btnInactiveState]}
        >
          {actionLoading ? (
            <ActivityIndicator size="small" color={MAIN_COLOR} />
          ) : (
            <Text style={[styles.logActionText, { color: periodActive ? MAIN_COLOR : "#FFF" }]}>
              {periodActive ? "End period today" : "Start period today"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* MATRIX MONTH GRID SCROLLER */}
      <CalendarList
        current={selectedDate}
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled
        showScrollIndicator={false}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);

          const match = findCycleForDate(day.dateString);
          if (match) {
            router.push({
              pathname: "/cycle-detail/[id]",
              params: { id: String(match.id) },
            });
          }
        }}
        theme={{
          calendarBackground: "#FCFCFC",
          textSectionTitleColor: TEXT_MUTED,
          textMonthFontFamily: "Lexend_600SemiBold",
          textDayFontFamily: "Lexend_400Regular",
          textDayHeaderFontFamily: "Lexend_500Medium",
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
          dayTextColor: TEXT_DARK,
          todayTextColor: MAIN_COLOR,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={MAIN_COLOR} />
        }
      />

      {/* FLOATING APP STATUS NOTIFIER */}
      <Animated.View style={[styles.toastContainer, { opacity }]}>
        <View style={styles.toastBubble}>
          <Text style={styles.toastText}>Logs Updated Successfully</Text>
        </View>
      </Animated.View>
    </View>
  );
}

/* ==========================================================================
   UNIFORM STYLESHEET ARCHITECTURE
   ========================================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
  },
  actionCard: {
    marginTop: 14,
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F3F3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: TEXT_DARK,
    letterSpacing: -0.2,
  },
  historyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInstruction: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
    marginBottom: 16,
  },
  logActionButton: {
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  btnActiveState: {
    backgroundColor: LIGHT_ORANGE,
    borderColor: "transparent",
  },
  btnInactiveState: {
    backgroundColor: MAIN_COLOR,
    borderColor: "transparent",
  },
  logActionText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: TEXT_DARK,
    marginBottom: 6,
  },
  emptySubtext: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  primarySetupBtn: {
    backgroundColor: MAIN_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  primarySetupBtnText: {
    color: "#FFF",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 99,
  },
  toastBubble: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
  },
  toastText: {
    color: "#FFF",
    fontFamily: "Lexend_500Medium",
    fontSize: 13,
  },
});