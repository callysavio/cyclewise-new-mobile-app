import { InsightActionCard } from "@/services/dashboard.service";
import {
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TEXT_DARK = "#1A1A1A";
const TEXT_MUTED = "#737373";
const BACKGROUND_LIGHT = "#FCFCFC";

export default function InsightDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  // Safely parse incoming serialized structural string parameters
  const cardItem: InsightActionCard = params.item
    ? JSON.parse(params.item as string)
    : null;

  if (!fontsLoaded) return null;

  if (!cardItem) {
    return (
      <View style={styles.errorCenteredLayout}>
        <Ionicons name="alert-circle-outline" size={32} color="#E5563D" />
        <Text style={styles.errorText}>
          Failed to open insight data structure.
        </Text>
      </View>
    );
  }

  const isWarning = cardItem.type === "WARNING";
  const isNutrient = cardItem.type === "NUTRIENT";
  const colorTheme = isWarning ? "#FF699C" : isNutrient ? "#22C55E" : "#00A9F1";

  return (
    <View style={[styles.screenWrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER CONTROLS BAR */}
      <View style={styles.customNavBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeRoundButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerLabelTitle}>Medical Intelligence</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollCanvas}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO TITLE DECK */}
        <View
          style={[
            styles.typeBadgeContainer,
            { backgroundColor: colorTheme + "12" },
          ]}
        >
          <Text style={[styles.badgeText, { color: colorTheme }]}>
            {cardItem.type} BREAKDOWN
          </Text>
        </View>

        <Text style={styles.mainInsightTitle}>{cardItem.title}</Text>
        <Text style={styles.summaryTeaserText}>{cardItem.summary}</Text>

        <View style={styles.dividerSpacerLine} />

        {/* SECTION 1: CLINICAL REASONING */}
        <View style={styles.narrativeSectionBlock}>
          <View style={styles.bulletTitleRow}>
            <Ionicons
              name="medical-outline"
              size={18}
              color={colorTheme}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.blockHeading}>Clinical Context</Text>
          </View>
          <Text style={styles.bodyParagraphContent}>
            {cardItem.content ||
              "No secondary research added for this parameter marker yet."}
          </Text>
        </View>

        {/* SECTION 2: IMMEDIATE PRESCRIPTION ACTION */}
        <View
          style={[
            styles.actionPrescriptionBox,
            {
              borderColor: colorTheme + "25",
              backgroundColor: colorTheme + "06",
            },
          ]}
        >
          <View style={styles.bulletTitleRow}>
            <Ionicons
              name="flash"
              size={18}
              color={colorTheme}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.blockHeading, { color: TEXT_DARK }]}>
              Your Action Step
            </Text>
          </View>
          <Text style={styles.actionStepParagraphText}>
            {cardItem.actionStep}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: BACKGROUND_LIGHT },
  errorCenteredLayout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_LIGHT,
    gap: 8,
  },
  errorText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: TEXT_MUTED,
  },
  customNavBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  closeRoundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  headerLabelTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: TEXT_DARK,
    letterSpacing: -0.3,
  },
  scrollCanvas: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 60 },
  typeBadgeContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    letterSpacing: 0.8,
  },
  mainInsightTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 24,
    color: TEXT_DARK,
    lineHeight: 32,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  summaryTeaserText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: TEXT_MUTED,
    lineHeight: 22,
  },
  dividerSpacerLine: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: 24,
  },
  narrativeSectionBlock: { marginBottom: 28 },
  bulletTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  blockHeading: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: TEXT_DARK,
  },
  bodyParagraphContent: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#404040",
    lineHeight: 23,
  },
  actionPrescriptionBox: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
  },
  actionStepParagraphText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: "#262626",
    lineHeight: 22,
    marginTop: 2,
  },
});
