import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/providers/AuthProviders";

/* =======================
   BRAND TOKENS
======================= */
const Colors = {
  background: "#FAFAFA",
  cardBg: "#FFFFFF",
  inputBg: "#FDF9F6",
  border: "#F0E4DC",
  cardBorder: "#F3F4F6",
  textDark: "#1C1C1E",
  textMuted: "#636366",
  textFaint: "#8E8E93",
  main: "#FF699C",
  mainSoft: "#FFF5F4",
  error: "#D64545",
  errorSoft: "#FBEAEA",
  trackOff: "#E5E5EA",
};

/* =======================
   TYPES
======================= */
interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  isLast?: boolean;
}

interface SettingsSwitchProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  isLast?: boolean;
}

/* =======================
   SCREEN
======================= */
const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [periodReminder, setPeriodReminder] = useState(false);
  const [ovulationReminder, setOvulationReminder] = useState(false);
  const [fertilityReminder, setFertilityReminder] = useState(false);
  const [birthControlReminder, setBirthControlReminder] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* =======================
     DERIVED PROFILE DATA
  ======================= */
  const getAge = (dob?: string) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return "-";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return String(Math.max(age, 0));
  };

  const profile = useMemo(() => {
    if (!user) return null;

    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender === "MALE" ? "Male" : "Female",
      age: getAge(user.dob),
      initials: (user.fullName ?? "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n.charAt(0).toUpperCase())
        .join(""),
    };
  }, [user]);

  /* =======================
     LOGOUT
  ======================= */
  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out of CycleWise?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);
            await logout();
            router.replace("/(auth)/login");
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* =======================
            PROFILE CARD
        ======================= */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.85}
          // onPress={() => router.push("/edit-profile")}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.fullName}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
          <View style={styles.editBadge}>
            <Ionicons name="create-outline" size={16} color={Colors.main} />
          </View>
        </TouchableOpacity>

        {/* =======================
            PROFILE DETAILS
        ======================= */}
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="call-outline"
            label="Phone"
            value={profile.phone}
          />
          <SettingsRow
            icon="person-outline"
            label="Gender"
            value={profile.gender}
          />
          <SettingsRow
            icon="calendar-outline"
            label="Age"
            value={profile.age}
            isLast
          />
        </View>

        {/* =======================
            REMINDERS
        ======================= */}
        <Text style={styles.sectionTitle}>Reminders</Text>
        <View style={styles.section}>
          <SettingsSwitch
            icon="water-outline"
            label="Period"
            value={periodReminder}
            onValueChange={setPeriodReminder}
          />
          <SettingsSwitch
            icon="sparkles-outline"
            label="Ovulation"
            value={ovulationReminder}
            onValueChange={setOvulationReminder}
          />
          <SettingsSwitch
            icon="leaf-outline"
            label="Fertility Window"
            value={fertilityReminder}
            onValueChange={setFertilityReminder}
          />
          <SettingsSwitch
            icon="medkit-outline"
            label="Birth Control"
            value={birthControlReminder}
            onValueChange={setBirthControlReminder}
            isLast
          />
        </View>

        {/* =======================
            APP SETTINGS
        ======================= */}
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.section}>
          <SettingsSwitch
            icon="notifications-outline"
            label="Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingsSwitch
            icon="moon-outline"
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingsRow
            icon="language-outline"
            label="Language"
            value="English"
            onPress={() => router.push("/")}
          />
          <SettingsRow
            icon="time-outline"
            label="Cycle History"
            onPress={() => router.push("/cycle-history")}
          />
          <SettingsRow
            icon="alarm-outline"
            label="Notification Settings"
            onPress={() => router.push("/notification")}
          />
          <SettingsRow
            icon="help-circle-outline"
            label="Help Centre"
            onPress={() => router.push("/help")}
            isLast
          />
        </View>

        {/* =======================
            SUPPORT
        ======================= */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="chatbubbles-outline"
            label="Contact Support"
            onPress={() => router.push("/support")}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() => router.push("/privacy")}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="About CycleWise"
            value="v1.0.0"
            onPress={() => router.push("/(tabs)/profile")}
            isLast
          />
        </View>

        {/* =======================
            ACCOUNT / LOGOUT
        ======================= */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="log-out-outline"
            label={loggingOut ? "Logging out..." : "Log out"}
            danger
            onPress={loggingOut ? undefined : handleLogout}
            isLast
          />
        </View>
      </ScrollView>
    </View>
  );
};

/* =======================
   ROW COMPONENTS
======================= */

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  onPress,
  danger,
  isLast,
}) => (
  <TouchableOpacity
    style={[styles.row, isLast && styles.rowLast]}
    activeOpacity={0.7}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.rowLeft}>
      <View
        style={[
          styles.iconWrapper,
          danger ? styles.iconWrapperDanger : styles.iconWrapperDefault,
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={danger ? Colors.error : Colors.main}
        />
      </View>
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
        {label}
      </Text>
    </View>

    <View style={styles.rowRight}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {onPress && !danger && (
        <Ionicons name="chevron-forward" size={18} color={Colors.textFaint} />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
  isLast,
}) => (
  <View style={[styles.row, isLast && styles.rowLast]}>
    <View style={styles.rowLeft}>
      <View style={styles.iconWrapperDefault}>
        <Ionicons name={icon} size={17} color={Colors.main} />
      </View>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && (
          <Text style={styles.rowDescription}>{description}</Text>
        )}
      </View>
    </View>
    <Switch
      trackColor={{ false: Colors.trackOff, true: "#F4A693" }}
      thumbColor={value ? Colors.main : "#FFFFFF"}
      ios_backgroundColor={Colors.trackOff}
      value={value}
      onValueChange={onValueChange}
    />
  </View>
);

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingBottom: 6,
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 26,
    color: Colors.textDark,
  },

  /* Profile card */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    marginTop: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.mainSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: Colors.main,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  editBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.mainSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Sections */
  sectionTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 26,
    marginBottom: 10,
    marginLeft: 4,
  },
  section: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  /* Rows */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: Colors.cardBorder,
    borderBottomWidth: 1,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconWrapperDefault: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.mainSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconWrapperDanger: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.errorSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: Colors.textDark,
  },
  rowLabelDanger: {
    color: Colors.error,
    fontFamily: "Lexend_600SemiBold",
  },
  rowDescription: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: Colors.textFaint,
    marginTop: 1,
  },
  rowValue: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    marginRight: 6,
  },
});

export default SettingsScreen;
