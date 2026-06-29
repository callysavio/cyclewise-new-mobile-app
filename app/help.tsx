import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* Enable layout transitions on Android */
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ============================
   COLORS (CycleWise theme)
============================ */
const COLORS = {
  primary: "#C96185",
  background: "#FCFCFC",
  surface: "#FFFFFF",
  headerText: "#1C1C1E",
  textDark: "#1F1F1F",
  textMuted: "#6B7280",
  border: "#F3F4F6",
  inputBg: "#F3EAEF", // Balanced branding tint
};

/* ============================
   FAQ DATA
============================ */
const FAQ_DATA = [
  {
    question: "How does CycleWise track my cycle?",
    answer:
      "CycleWise uses the period dates you log to calculate your average cycle length. Using scientific cycle phase modeling, it estimates your menstrual, follicular, ovulation, and luteal phases. The more consistently you log your data, the more accurate the predictions become.",
  },
  {
    question: "How accurate are ovulation predictions?",
    answer:
      "CycleWise provides estimates based on your cycle patterns. Ovulation predictions improve over time as more cycles are logged. For medical or pregnancy purposes, combine with ovulation tests or consult your doctor.",
  },
  {
    question: "Can I edit or delete cycle history?",
    answer:
      "Yes. You can edit or delete any cycle entry from the Cycle History screen. Tap a cycle entry and select edit or delete.",
  },
  {
    question: "What happens if I miss logging a period?",
    answer:
      "Missing one log will not break predictions. However, regular logging improves accuracy significantly. You can always add past periods manually.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Yes. CycleWise uses secure authentication and encrypted communication. Your data is private and never shared without your consent.",
  },
  {
    question: "Can I use CycleWise to track fertility?",
    answer:
      "Yes. CycleWise estimates fertile windows and ovulation timing. However, it should not replace medical contraception or fertility treatments.",
  },
  {
    question: "Why is my cycle length changing?",
    answer:
      "Cycle variations can occur due to stress, hormonal changes, illness, sleep, diet, or lifestyle changes. This is normal.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact CycleWise support from the Contact Support screen. Our team typically responds within 24 hours.",
  },
  {
    question: "Does CycleWise work for irregular cycles?",
    answer:
      "Yes. CycleWise adapts over time and improves predictions even for irregular cycles.",
  },
  {
    question: "Can I use CycleWise if I am on birth control?",
    answer:
      "Yes. However, hormonal birth control can affect ovulation predictions.",
  },
];

/* ============================
   COMPONENT
============================ */
export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  /* Filter items matching query */
  const filteredFAQ = useMemo(() => {
    if (!search.trim()) return FAQ_DATA;
    const query = search.toLowerCase();
    return FAQ_DATA.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query),
    );
  }, [search]);

  /* Animated Expand/Collapse Toggle */
  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Help & FAQs",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Lexend_600SemiBold",
            fontSize: 18,
            color: COLORS.headerText,
          },
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.headerBackBtn,
                { marginTop: insets.top > 0 ? insets.top / 2 : 0 },
              ]}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Search Header Input */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search help topics..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.7}>
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* scroll list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
        >
          {filteredFAQ.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="search-sharp"
                size={48}
                color="#E5E7EB"
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                No results matching your search
              </Text>
              <Text style={styles.emptySubtext}>
                Try typing alternative words or browse down below.
              </Text>
            </View>
          ) : (
            filteredFAQ.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View
                  key={index}
                  style={[styles.faqCard, isExpanded && styles.faqCardActive]}
                >
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleAccordion(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.questionText}>{item.question}</Text>
                    <View
                      style={[
                        styles.arrowCircle,
                        isExpanded && styles.arrowCircleActive,
                      ]}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={isExpanded ? "#FFF" : COLORS.primary}
                        style={{
                          transform: [
                            { rotate: isExpanded ? "180deg" : "0deg" },
                          ],
                        }}
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}

          {/* Call-to-Action Bottom Banner */}
          <View style={styles.supportCard}>
            <View style={styles.supportInfo}>
              <Text style={styles.supportTitle}>Still need assistance?</Text>
              <Text style={styles.supportSub}>
                Our tracking team is available for raw queries.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.supportButton}
              activeOpacity={0.8}
              onPress={() => router.push("/support")}
            >
              <Text style={styles.supportButtonText}>Get Support</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFF"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

/* ============================
   STYLES
============================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBackBtn: {
    marginLeft: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: COLORS.textDark,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  faqCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: { elevation: 0.5 },
    }),
  },
  faqCardActive: {
    borderColor: "#EAEAEA",
    ...Platform.select({
      ios: { shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    paddingRight: 12,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF0F4",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowCircleActive: {
    backgroundColor: COLORS.primary,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: "#FAFAFA",
  },
  answerText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginTop: 12,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  supportCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  supportInfo: {
    flex: 1,
    paddingRight: 8,
  },
  supportTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  supportSub: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: COLORS.textMuted,
  },
  supportButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  supportButtonText: {
    color: "#FFF",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
  },
});
