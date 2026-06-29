import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// Aligning with your brand tokens
const Colors = {
  main: "#FF699C",
  mainSoft: "#FFF5F4",
  headerText: "#1C1C1E",
  textDark: "#2D2D30",
  textMuted: "#6B7280",
  white: "#FFFFFF",
  background: "#FAFAFA",
  border: "#E5E7EB",
};

interface PolicySectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

// Collapsible Section component for modern scannability
const PolicySection: React.FC<PolicySectionProps> = ({
  title,
  icon,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}
        android_ripple={{ color: Colors.mainSoft }}
      >
        <View style={styles.cardTitleContainer}>
          <View style={styles.iconContainer}>
            <Icon name={icon} size={18} color={Colors.main} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Icon
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.textMuted}
        />
      </Pressable>
      {expanded && <View style={styles.cardContent}>{children}</View>}
    </View>
  );
};

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* HEADER SECTION (Matches your custom layout design) */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
        >
          <Icon name="arrow-back" size={24} color={Colors.main} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introBlock}>
          <Icon name="shield-checkmark" size={48} color={Colors.main} />
          <Text style={styles.introTitle}>Your Data, Protected</Text>
          <Text style={styles.introSubtitle}>
            We treat your reproductive health information with extreme care.
            Review how we store, encrypt, and respect your absolute right to
            data autonomy.
          </Text>
          <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>
        </View>

        {/* POLICY BREAKDOWNS REQUIRED FOR STORES */}
        <PolicySection
          title="1. Information We Collect"
          icon="document-text-outline"
        >
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Cycle & Symptom Data: </Text>
            Period dates, symptoms (e.g., cramps, moods), flow intensity, and
            other biological tracking points you choose to log.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Account Information: </Text>
            If you create an account, we collect basic indicators like email
            addresses. You may also choose to use the app entirely anonymously.
          </Text>
        </PolicySection>

        <PolicySection
          title="2. How Data is Processed & Encrypted"
          icon="lock-closed-outline"
        >
          <Text style={styles.paragraph}>
            All sensitive health metrics undergo end-to-end industry-standard
            protocol encryption. Data transmitted over the web uses secure layer
            protocols (HTTPS/TLS) and rest-state server multi-layered
            cryptography.
          </Text>
          <Text style={styles.paragraph}>
            Your information is exclusively utilized to run cycle calculations,
            predict upcoming biological shifts, and offer custom educational
            summaries.
          </Text>
        </PolicySection>

        <PolicySection
          title="3. Third-Party Sharing Declarations"
          icon="share-social-outline"
        >
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>
              We do not sell, rent, trade, or monetize your health data{" "}
            </Text>
            to any ad networks, analytics brokers, or commercial third parties.
          </Text>
          <Text style={styles.paragraph}>
            No health metrics logged within this platform are accessible to
            external tracking pixels or profiling tools.
          </Text>
        </PolicySection>

        <PolicySection
          title="4. Store & Regulatory Compliances"
          icon="ribbon-outline"
        >
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Apple & Google Play Policy: </Text>
            This policy adheres strictly to App Store Guidelines regarding
            Health Tracking and Google Play Developer Policies regarding
            Personal and Sensitive Information handling.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>GDPR / CCPA Actions: </Text>
            Users across all global jurisdictions maintain total legal ownership
            of their records. You can completely edit, request copies of, or
            delete your information at any moment.
          </Text>
        </PolicySection>

        <PolicySection
          title="5. Complete Account & Data Deletion"
          icon="trash-outline"
        >
          <Text style={styles.paragraph}>
            You maintain full rights to be forgotten. By accessing your profile
            menu or using our built-in deletion mechanisms, you can purge all
            historical cycles and logged criteria permanently from our
            ecosystem.
          </Text>
        </PolicySection>

        <PolicySection title="6. Contact & Support" icon="mail-outline">
          <Text style={styles.paragraph}>
            For privacy inquiries, technical audits, or assistance deleting data
            profiles, reach out to our core developer team at:
          </Text>
          <Text style={styles.emailText}>privacy@bcloudtechnologies.com</Text>
        </PolicySection>
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginLeft: 16,
    padding: 4,
  },
  headerTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: Colors.headerText,
  },
  headerSpacer: {
    width: 24,
    marginRight: 16,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  introBlock: {
    alignItems: "center",
    textAlign: "center",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  introTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: Colors.textDark,
    marginTop: 12,
    marginBottom: 6,
  },
  introSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  lastUpdated: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: Colors.main,
    marginTop: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.mainSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: Colors.textDark,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
    paddingTop: 12,
  },
  paragraph: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: Colors.textDark,
    lineHeight: 19,
    marginBottom: 10,
  },
  boldText: {
    fontFamily: "Lexend_600SemiBold",
    color: Colors.textDark,
  },
  emailText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: Colors.main,
    marginTop: 4,
  },
});
