import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ================================
   COLORS & CONFIG
================================ */
const COLORS = {
  primary: "#C96185",
  whatsapp: "#25D366",
  email: "#4285F4",
  background: "#FCFCFC",
  surface: "#FFFFFF",
  headerText: "#1C1C1E",
  textDark: "#1F1F1F",
  textMuted: "#6B7280",
  border: "#F3F4F6",
};

const SUPPORT_NUMBERS = {
  primary: { raw: "+2348131137854", formatted: "+234 813 113 7854" },
  secondary: { raw: "+2347062086182", formatted: "+234 706 208 6182" },
};

const SUPPORT_EMAIL = "cyclewiseebonyinigeria@gmail.com";

const WHATSAPP_PREDEFINED_MSG = encodeURIComponent(
  "Hello Cycle-Wise Support, I need some assistance with the app.",
);

/* ================================
   COMPONENT
================================ */
export default function ContactSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Action: Open Native Mail Client
  const handleEmail = async () => {
    const subject = encodeURIComponent("Cycle-Wise App Support Request");
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback: Copy to clipboard if no mail app configured
        await Clipboard.setStringAsync(SUPPORT_EMAIL);
        Alert.alert(
          "Email Copied",
          "No default mail application found. The support email address has been copied to your clipboard.",
        );
      }
    } catch {
      await Clipboard.setStringAsync(SUPPORT_EMAIL);
      Alert.alert("Notice", "Support email address copied to clipboard.");
    }
  };

  // Action: Trigger Native Phone Call
  const handlePhoneCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device.");
        }
      })
      .catch(() => Alert.alert("Error", "An unexpected error occurred."));
  };

  // Action: Open WhatsApp Inbox with Predefined Text
  const handleWhatsApp = (phoneNumber: string) => {
    const url = `whatsapp://send?phone=${phoneNumber}&text=${WHATSAPP_PREDEFINED_MSG}`;
    const webUrl = `https://wa.me/${phoneNumber}?text=${WHATSAPP_PREDEFINED_MSG}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(webUrl);
        }
      })
      .catch(() => {
        Linking.openURL(webUrl);
      });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Help & Support",
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* Intro Visual Header */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="headset-outline" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.heroTitle}>We are here for you</Text>
          <Text style={styles.heroSubtitle}>
            Have questions or running into issues with Cycle-Wise? Reach out
            directly using your preferred platform.
          </Text>
        </View>

        {/* SECTION: EMAIL SUPPORT */}
        <Text style={styles.sectionLabel}>Email Support</Text>
        <Text style={styles.sectionDesc}>
          Best for detailed queries or technical feedback.
        </Text>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={handleEmail}
        >
          <View style={[styles.iconBox, { backgroundColor: "#EEF4FF" }]}>
            <Ionicons name="mail-outline" size={24} color={COLORS.email} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Official Support Email</Text>
            <Text style={styles.cardValue}>{SUPPORT_EMAIL}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* SECTION: WHATSAPP CHAT */}
        <Text style={styles.sectionLabel}>Chat on WhatsApp</Text>
        <Text style={styles.sectionDesc}>
          Instant messaging for prompt assistance.
        </Text>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => handleWhatsApp(SUPPORT_NUMBERS.primary.raw)}
        >
          <View style={[styles.iconBox, { backgroundColor: "#E8FAD0" }]}>
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.whatsapp} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Primary Chat Line</Text>
            <Text style={styles.cardValue}>
              {SUPPORT_NUMBERS.primary.formatted}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => handleWhatsApp(SUPPORT_NUMBERS.secondary.raw)}
        >
          <View style={[styles.iconBox, { backgroundColor: "#E8FAD0" }]}>
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.whatsapp} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Alternative Chat Line</Text>
            <Text style={styles.cardValue}>
              {SUPPORT_NUMBERS.secondary.formatted}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* SECTION: VOICE CALLS */}
        <Text style={styles.sectionLabel}>Voice Call Support</Text>
        <Text style={styles.sectionDesc}>
          Available Monday through Friday, 8 AM - 6 PM WAT.
        </Text>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => handlePhoneCall(SUPPORT_NUMBERS.primary.raw)}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FFF0F4" }]}>
            <Ionicons name="call-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Call Primary Line</Text>
            <Text style={styles.cardValue}>
              {SUPPORT_NUMBERS.primary.formatted}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => handlePhoneCall(SUPPORT_NUMBERS.secondary.raw)}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FFF0F4" }]}>
            <Ionicons name="call-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Call Alternative Line</Text>
            <Text style={styles.cardValue}>
              {SUPPORT_NUMBERS.secondary.formatted}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Security Disclaimer */}
        <View style={styles.footerInfoBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={COLORS.textMuted}
          />
          <Text style={styles.footerInfoText}>
            Your tracking logs remain fully confidential during standard support
            inquiries.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

/* ================================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  headerBackBtn: {
    marginLeft: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  heroIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF0F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionLabel: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15,
    color: COLORS.textDark,
    marginTop: 16,
  },
  sectionDesc: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  cardValue: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: COLORS.textDark,
  },
  footerInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    paddingHorizontal: 20,
  },
  footerInfoText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    textAlign: "center",
    flex: 1,
  },
});
