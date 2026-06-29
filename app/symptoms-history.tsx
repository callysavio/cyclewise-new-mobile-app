import { useAuth } from "@/providers/AuthProviders";
import {
    getUserSymptomsHistory,
    PaginatedMeta,
    UserSymptomLog,
} from "@/services/dashboard.service";
import {
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAIN_COLOR = "#E5563D";
const BACKGROUND_LIGHT = "#FCFCFC";
const TEXT_DARK = "#1A1A1A";
const TEXT_MUTED = "#737373";

const SEVERITY_FILTERS = [
  { label: "All Logs", value: "" },
  { label: "Mild", value: "MILD" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Severe", value: "SEVERE" },
];

export default function SymptomsHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  // Primary Component States
  const [logs, setLogs] = useState<UserSymptomLog[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isRefreshingRef = useRef(isRefreshing);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchSymptomLogs = useCallback(
    async (pageToFetch: number, clearPrevious: boolean) => {
      if (!user?.id) return;

      try {
        if (pageToFetch === 1 && !isRefreshingRef.current) {
          setIsLoading(true);
        }

        const response = await getUserSymptomsHistory(user.id, {
          page: pageToFetch,
          limit: 15,
          search: debouncedSearch,
          severity: selectedSeverity,
        });

        setLogs((prev) =>
          clearPrevious ? response.data : [...prev, ...response.data],
        );
        setMeta(response.meta);
      } catch (error) {
        console.log(
          "Error loading symptoms history logs layout sequence:",
          error,
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [user?.id, debouncedSearch, selectedSeverity],
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchSymptomLogs(1, true);
  }, [fetchSymptomLogs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchSymptomLogs(1, true);
  };

  const handleLoadMore = () => {
    if (!meta || currentPage >= meta.totalPages || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSymptomLogs(nextPage, false);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "SEVERE":
        return { bg: "#FDF0F4", text: "#FF699C" };
      case "MODERATE":
        return { bg: "#FFF9EB", text: "#FFC02D" };
      default:
        return { bg: "#EEF8FD", text: "#00A9F1" };
    }
  };

  const getTimeIcon = (time: string) => {
    switch (time?.toLowerCase()) {
      case "morning":
        return "sunny-outline";
      case "afternoon":
        return "partly-sunny-outline";
      default:
        return "moon-outline";
    }
  };

  if (!fontsLoaded) return null;

  const renderLogItem = ({ item }: { item: UserSymptomLog }) => {
    const severityTheme = getSeverityStyles(item.severity);
    const timeIconName = getTimeIcon(item.timeOfDay);

    return (
      <View style={styles.logCard}>
        {/* Card Top Line Info Row */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.cardDate}>
              {moment(item.date).format("MMMM DD, YYYY")}
            </Text>
            <View style={styles.cardSubDetails}>
              <Ionicons
                name={timeIconName}
                size={12}
                color={TEXT_MUTED}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.subText}>
                {item.timeOfDay.toUpperCase()} •{" "}
              </Text>
              <Text
                style={[
                  styles.subText,
                  { color: MAIN_COLOR, fontFamily: "Lexend_600SemiBold" },
                ]}
              >
                {item.phase?.toUpperCase()}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.severityBadge,
              { backgroundColor: severityTheme.bg },
            ]}
          >
            <Text style={[styles.severityText, { color: severityTheme.text }]}>
              {item.severity}
            </Text>
          </View>
        </View>

        {/* Symptoms Entry List Mapping */}
        <View style={styles.tagsContainer}>
          {item.symptomEntries?.map((entry) => (
            <View key={entry.id} style={styles.symptomTag}>
              <View
                style={[styles.tagDot, { backgroundColor: severityTheme.text }]}
              />
              <Text style={styles.tagText}>
                {entry.symptom.replace(/_/g, " ")}
              </Text>
            </View>
          ))}
        </View>

        {/* User Notes Context Block */}
        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText} numberOfLines={3}>
              “{item.notes}”
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.mainLayout, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* SCREEN NAVBAR */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Symptoms History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* FILTERS UTILITY COMPONENT DOCK */}
      <View style={styles.filterDock}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={TEXT_MUTED}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search symptoms or notes..."
            placeholderTextColor={TEXT_MUTED}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Horizontal Severity Slider Pills */}
        <View style={styles.pillsRow}>
          {SEVERITY_FILTERS.map((filter) => {
            const isActive = selectedSeverity === filter.value;
            return (
              <TouchableOpacity
                key={filter.label}
                onPress={() => setSelectedSeverity(filter.value)}
                style={[styles.filterPill, isActive && styles.activeFilterPill]}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.pillText, isActive && styles.activePillText]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* CORE DATA FEED AREA */}
      {isLoading ? (
        <View style={styles.fallbackCenteredState}>
          <ActivityIndicator size="small" color={MAIN_COLOR} />
          <Text style={styles.loadingStateMessageText}>
            Compiling logs timeline...
          </Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLogItem}
          contentContainerStyle={styles.listContainerContent}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            <View style={styles.fallbackCenteredState}>
              <Ionicons
                name="document-text-outline"
                size={40}
                color={TEXT_MUTED}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyHeaderTitle}>
                No logs match your filter
              </Text>
              <Text style={styles.emptySubMessage}>
                Try adjusting your severity metrics or entry search filter
                parameters.
              </Text>
            </View>
          }
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="small"
                color={MAIN_COLOR}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainLayout: { flex: 1, backgroundColor: BACKGROUND_LIGHT },
  navBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#F2F2F2",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  screenTitle: {
    fontSize: 16,
    fontFamily: "Lexend_600SemiBold",
    color: TEXT_DARK,
    letterSpacing: -0.3,
  },
  filterDock: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#F2F2F2",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND_LIGHT,
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
    fontFamily: "Lexend_400Regular",
  },
  pillsRow: { flexDirection: "row", alignItems: "center" },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: BACKGROUND_LIGHT,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  activeFilterPill: {
    backgroundColor: "#FFF0ED",
    borderColor: MAIN_COLOR,
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: TEXT_MUTED,
  },
  activePillText: {
    color: MAIN_COLOR,
    fontFamily: "Lexend_600SemiBold",
  },
  listContainerContent: { padding: 20, paddingBottom: 40 },
  logCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardDate: {
    fontSize: 15,
    fontFamily: "Lexend_600SemiBold",
    color: TEXT_DARK,
    marginBottom: 3,
  },
  cardSubDetails: { flexDirection: "row", alignItems: "center" },
  subText: {
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    color: TEXT_MUTED,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontFamily: "Lexend_700Bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  symptomTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Lexend_600SemiBold",
    color: "#404040",
    textTransform: "capitalize",
  },
  notesContainer: {
    backgroundColor: "#FCFCFC",
    padding: 12,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderColor: MAIN_COLOR + "40",
    marginTop: 6,
  },
  notesText: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#525252",
    lineHeight: 18,
  },
  fallbackCenteredState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 60,
  },
  loadingStateMessageText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: TEXT_MUTED,
  },
  emptyHeaderTitle: {
    fontSize: 15,
    fontFamily: "Lexend_600SemiBold",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  emptySubMessage: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 18,
  },
});
