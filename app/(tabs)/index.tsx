import { useAuth } from "@/providers/AuthProviders";
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PhaseModal from "../../components/phaseModal";
import PredictionHexagon from "../../components/PredictionHexagon";

import {
  CycleSummaryResponse,
  DailyInsightsPayload,
  getCyclesSummary,
  getDailyInsights,
  getPredictionSummary,
  getPregnancyOdds,
  getWeeklyLogs,
  PredictionSummary,
  PregnancyOddsResponse,
  WeeklyLogDay,
} from "@/services/dashboard.service";
import { getGreeting } from "@/utils/greeting";
SplashScreen.preventAutoHideAsync();

const MAIN_COLOR = "#E5563D";
const BACKGROUND_LIGHT = "#FCFCFC";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#1F1F1F";
const TEXT_MUTED = "#6B7280";

const CYCLE_PHASES_DATA = [
  {
    key: "MENSTRUAL",
    title: "Menstrual Phase",
    description:
      "Your period marks the start of your cycle. Estrogen and progesterone levels drop.",
    icon: "water-outline",
  },
  {
    key: "FOLLICULAR",
    title: "Follicular Phase",
    description:
      "Your body prepares to release an egg. Energy and mood start building up.",
    icon: "partly-sunny-outline",
  },
  {
    key: "OVULATION",
    title: "Ovulation Phase",
    description:
      "The mature egg is released. High fertility window with peak energy levels.",
    icon: "sparkles-outline",
  },
  {
    key: "LUTEAL",
    title: "Luteal Phase",
    description:
      "Progesterone builds up the uterine lining. Perfect time for wind-down and self-care.",
    icon: "moon-outline",
  },
];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogDay[]>([]);
  const [pregnancyOdds, setPregnancyOdds] =
    useState<PregnancyOddsResponse | null>(null);
  const [cycleSummary, setCycleSummary] = useState<CycleSummaryResponse | null>(
    null,
  );
  const [insights, setInsights] = useState<DailyInsightsPayload | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getPhaseColor = (phase: string = "") => {
    const colors: Record<string, string> = {
      MENSTRUAL: "#FF699C",
      FOLLICULAR: "#00A9F1",
      OVULATION: "#FFC02D",
      LUTEAL: "#DD8A64",
    };
    return colors[phase.toUpperCase()] || MAIN_COLOR;
  };

  const getOddsStyle = (odds: string = "LOW") => {
    const stylesMap: Record<string, { bg: string; text: string }> = {
      HIGH: { bg: "#FDF0F4", text: "#FF699C" },
      MEDIUM: { bg: "#FFF9EB", text: "#FFC02D" },
      LOW: { bg: "#F1F5F9", text: "#64748B" },
    };
    return stylesMap[odds.toUpperCase()] || stylesMap.LOW;
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setIsInsightsLoading(true);

        const today = new Date();
        const startOfWeek = moment(today).startOf("week").format("YYYY-MM-DD");
        const endOfWeek = moment(today).endOf("week").format("YYYY-MM-DD");
        const todayFormatted = moment(today).format("YYYY-MM-DD");

        const [summaryData, logsData, cycleData, insightsData] =
          await Promise.all([
            getPredictionSummary().catch(() => null),
            getWeeklyLogs(startOfWeek, endOfWeek).catch(() => []),
            getCyclesSummary().catch(() => null),
            getDailyInsights().catch(() => null),
          ]);

        setSummary(summaryData);
        setWeeklyLogs(logsData || []);
        setCycleSummary(cycleData);
        setInsights(insightsData);

        const oddsData = summaryData?.cycleId
          ? await getPregnancyOdds(summaryData.cycleId, todayFormatted).catch(
              () => null,
            )
          : null;
        setPregnancyOdds(oddsData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setIsLoading(false);
        setIsInsightsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  const currentActivePhase =
    summary?.currentPhase || insights?.currentPhase || "";
  const activeOdds = getOddsStyle(pregnancyOdds?.odds || "LOW");

  // Executing the updated functional return block properly
  const greetingText = getGreeting(user?.fullName);

  const hexagonContentText = (() => {
    if (!summary) return "No Data";
    if (summary.currentPhase === "MENSTRUAL") {
      return "Period\nDay";
    }
    if (
      summary.daysUntilNextPeriod !== null &&
      summary.daysUntilNextPeriod !== undefined
    ) {
      return `${summary.daysUntilNextPeriod}\nDays Left`;
    }
    return "Track Cycle";
  })();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(insets.bottom + 40, 60),
        },
      ]}
    >
      {/* HEADER WITH BALANCED FLEX VALUES */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting} numberOfLines={2}>
            {greetingText}
          </Text>
          <Text style={styles.dateText}>{moment().format("MMMM D, YYYY")}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          accessibilityLabel="Go to profile"
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: user?.profileImage || "https://i.pravatar.cc/80" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* WEEKLY CALENDAR */}
      <View style={styles.weekRow}>
        {daysOfWeek.map((date, index) => {
          const isToday = date.getDate() === today.getDate();
          const dateKey = moment(date).format("YYYY-MM-DD");
          const log = weeklyLogs.find((l) => l.date === dateKey);

          return (
            <View
              key={index}
              style={[
                styles.dayBox,
                isToday && styles.currentDayBox,
                log?.isPeriodDay && styles.periodDayBox,
              ]}
            >
              <Text style={[styles.dayName, isToday && styles.currentDayText]}>
                {dayNames[index]}
              </Text>
              <Text
                style={[styles.dayNumber, isToday && styles.currentDayText]}
              >
                {date.getDate()}
              </Text>
              {log?.hasLog && <View style={styles.symptomDot} />}
            </View>
          );
        })}
      </View>

      {/* MAIN PREDICTION CARD */}
      <View style={styles.predictionCard}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={MAIN_COLOR}
            style={{ padding: 40 }}
          />
        ) : (
          <>
            <PredictionHexagon
              date={moment().format("MMM DD")}
              predictionText={hexagonContentText}
              predictionColor={getPhaseColor(currentActivePhase)}
            />

            <View
              style={[styles.oddsContainer, { backgroundColor: activeOdds.bg }]}
            >
              <Ionicons name="sparkles" size={18} color={activeOdds.text} />
              <Text style={[styles.oddsLabel, { color: activeOdds.text }]}>
                Conception Odds:{" "}
                <Text style={styles.oddsBold}>
                  {pregnancyOdds?.odds || "LOW"}
                </Text>
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.logButton}
          onPress={() => router.push("/log-symptoms")}
          activeOpacity={0.9}
        >
          <Ionicons name="add-circle" size={22} color="#FFF" />
          <Text style={styles.logButtonText}>Log Today&apos;s Symptoms</Text>
        </TouchableOpacity>
      </View>

      {/* DAILY INSIGHTS */}
      <Text style={styles.sectionTitle}>Daily Insights</Text>
      {isInsightsLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={MAIN_COLOR} />
          <Text style={styles.loadingText}>Preparing personalized tips...</Text>
        </View>
      ) : insights?.actionCards && insights.actionCards.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.insightsScroll}
          contentContainerStyle={styles.insightsScrollContent}
        >
          {insights.actionCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.insightCard}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/insight-details",
                  params: { item: JSON.stringify(card) },
                })
              }
            >
              <View style={styles.insightCardHeader}>
                <Text style={styles.insightTitle} numberOfLines={1}>
                  {card.title}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={MAIN_COLOR} />
              </View>
              <Text style={styles.insightSummary} numberOfLines={2}>
                {card.summary}
              </Text>
              <View style={styles.actionLinkRow}>
                <Text style={styles.actionLinkText}>Read Insights</Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={MAIN_COLOR}
                  style={{ marginLeft: 2 }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="analytics-outline" size={32} color={TEXT_MUTED} />
          <Text style={styles.emptyTitle}>No insights yet</Text>
          <Text style={styles.emptySubtitle}>
            Log more data to unlock personalized advice
          </Text>
        </View>
      )}

      {/* CYCLE TRENDS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cycle Trends</Text>
        <TouchableOpacity
          onPress={() => router.push("/symptoms-history")}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* TREND SUMMARY CARDS */}
      <View style={styles.trendsContainer}>
        <View style={styles.trendCard}>
          <Text style={styles.trendValue}>
            {cycleSummary?.averageCycleLength || "--"} days
          </Text>
          <Text style={styles.trendCardLabel}>Avg Cycle Length</Text>
        </View>
        <View style={styles.trendCard}>
          <Text style={styles.trendValue}>
            {cycleSummary?.averagePeriodLength || "--"} days
          </Text>
          <Text style={styles.trendCardLabel}>Avg Period Length</Text>
        </View>
      </View>

      {/* CYCLE PHASES GUIDE LIST */}
      <Text style={styles.sectionTitle}>Cycle Phases</Text>
      <View style={styles.phasesContainer}>
        {CYCLE_PHASES_DATA.map((phase) => {
          const isUserCurrentPhase =
            currentActivePhase.toUpperCase() === phase.key;
          const phaseColor = getPhaseColor(phase.key);

          return (
            <TouchableOpacity
              key={phase.key}
              style={[
                styles.phaseCard,
                isUserCurrentPhase && {
                  borderColor: phaseColor,
                  borderWidth: 1.5,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedPhase(phase.key);
                setModalVisible(true);
              }}
            >
              <View style={styles.phaseCardHeader}>
                <View
                  style={[
                    styles.phaseIconWrapper,
                    { backgroundColor: `${phaseColor}15` },
                  ]}
                >
                  <Ionicons
                    name={phase.icon as any}
                    size={20}
                    color={phaseColor}
                  />
                </View>
                <Text style={styles.phaseCardTitle}>{phase.title}</Text>
                {isUserCurrentPhase && (
                  <View
                    style={[
                      styles.currentPhaseBadge,
                      { backgroundColor: phaseColor },
                    ]}
                  >
                    <Text style={styles.currentPhaseBadgeText}>Current</Text>
                  </View>
                )}
              </View>
              <Text style={styles.phaseCardDescription} numberOfLines={2}>
                {phase.description}
              </Text>

              <View style={styles.phaseActionLinkRow}>
                <Text
                  style={[styles.phaseActionLinkText, { color: phaseColor }]}
                >
                  View Phase Breakdown
                </Text>
                <Ionicons name="chevron-forward" size={14} color={phaseColor} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PhaseModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedPhase(null);
        }}
        phase={selectedPhase as any}
      />
    </ScrollView>
  );
};

/* ==========================================
   STYLES IMPLEMENTATION
   ========================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  greetingContainer: {
    flex: 1,
    flexShrink: 1, // Prevents container from knocking avatar image out of view bounds
    paddingRight: 16,
  },
  greeting: {
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: TEXT_DARK,
    lineHeight: 22,
  },
  dateText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dayBox: {
    width: 44,
    height: 64,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    position: "relative",
  },
  currentDayBox: {
    borderColor: MAIN_COLOR,
    backgroundColor: "#FFF5F4",
  },
  periodDayBox: {
    backgroundColor: "#FF699C",
    borderColor: "#FF699C",
  },
  dayName: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: TEXT_DARK,
  },
  currentDayText: {
    color: MAIN_COLOR,
  },
  symptomDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: MAIN_COLOR,
    position: "absolute",
    bottom: 6,
  },
  predictionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  oddsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
  },
  oddsLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    marginLeft: 6,
  },
  oddsBold: {
    fontFamily: "Lexend_700Bold",
  },
  logButton: {
    flexDirection: "row",
    backgroundColor: MAIN_COLOR,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  logButtonText: {
    fontFamily: "Lexend_600SemiBold",
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: TEXT_DARK,
    marginTop: 24,
    marginBottom: 12,
  },
  viewAll: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: MAIN_COLOR,
  },
  insightsScroll: {
    marginBottom: 4,
    marginLeft: -16,
    marginRight: -16,
  },
  insightsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  insightCard: {
    backgroundColor: CARD_BG,
    width: 240,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    justifyContent: "space-between",
  },
  insightCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  insightTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: TEXT_DARK,
    flex: 1,
    marginRight: 4,
  },
  insightSummary: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 16,
    marginBottom: 10,
  },
  actionLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  actionLinkText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 11,
    color: MAIN_COLOR,
  },
  loadingCard: {
    backgroundColor: CARD_BG,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  emptyTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: TEXT_DARK,
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: "center",
    marginTop: 2,
  },
  trendsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  trendCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  trendValue: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: TEXT_DARK,
  },
  trendCardLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  phasesContainer: {
    gap: 12,
  },
  phaseCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  phaseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  phaseIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  phaseCardTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15,
    color: TEXT_DARK,
    flex: 1,
  },
  currentPhaseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPhaseBadgeText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  phaseCardDescription: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 18,
    marginBottom: 12,
  },
  phaseActionLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#F9FAFB",
    paddingTop: 10,
  },
  phaseActionLinkText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    marginRight: 2,
  },
});

export default HomeScreen;
