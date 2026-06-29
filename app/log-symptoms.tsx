import SymptomSuccessModal from "@/components/SymptopsSuccessModal";
import { useAuth } from "@/providers/AuthProviders";
import { createSymptom } from "@/services/symptops.service";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ==========================================================================
   DESIGN SYSTEM CONSTANTS
   ========================================================================== */
const COLORS = {
  primaryBrand: "#E5563D",
  accentTint: "#FCECE9",
  lightBorder: "#EEEEEE",
  bgLight: "#FCFCFC",
  textDark: "#1A1A1A",
  textMuted: "#737373",
};

const BASE_SYMPTOMS = [
  "CRAMPS",
  "HEADACHE",
  "FATIGUE",
  "NAUSEA",
  "BACK PAIN",
] as const;
const SEVERITIES = ["MILD", "MODERATE", "SEVERE"] as const;
const CATEGORIES = ["PHYSICAL", "EMOTIONAL", "OTHER"] as const;
const TIMES_OF_DAY = ["morning", "afternoon", "evening", "night"] as const;
const PHASES = ["FOLLICULAR", "OVULATORY", "LUTEAL", "MENSTRUATION"] as const;

const SYMPTOM_EMOJIS: Record<string, string> = {
  CRAMPS: "🌙",
  HEADACHE: "🤕",
  FATIGUE: "😴",
  NAUSEA: "🤢",
  "BACK PAIN": "💥",
  OTHER: "✨",
};

type Severity = (typeof SEVERITIES)[number];
type Category = (typeof CATEGORIES)[number];
type TimeOfDay = (typeof TIMES_OF_DAY)[number];
type Phase = (typeof PHASES)[number];

interface CreateSymptomPayload {
  userId: string;
  date: string;
  symptoms: string[];
  severity: Severity;
  notes?: string;
  category: string;
  timeOfDay: TimeOfDay;
  phase: Phase;
}

export default function TrackInputScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Symptoms states
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isOtherSymptomSelected, setIsOtherSymptomSelected] = useState(false);
  const [customSymptom, setCustomSymptom] = useState("");

  const [severity, setSeverity] = useState<Severity | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const clearFormFields = () => {
    setSelectedSymptoms([]);
    setIsOtherSymptomSelected(false);
    setCustomSymptom("");
    setSeverity(null);
    setCategory(null);
    setCustomCategory("");
    setTimeOfDay(null);
    setPhase(null);
    setNote("");
    setSelectedDate(new Date());
  };

  const handleSave = async () => {
    // Basic validation logic updates
    const hasSymptoms =
      selectedSymptoms.length > 0 ||
      (isOtherSymptomSelected && customSymptom.trim());

    if (!hasSymptoms || !severity || !category || !timeOfDay || !phase) {
      Alert.alert(
        "Incomplete Data",
        "Please complete all section requirements to process logs.",
      );
      return;
    }

    if (category === "OTHER" && !customCategory.trim()) {
      Alert.alert(
        "Specification Needed",
        "Please specify details for your custom classification category.",
      );
      return;
    }

    if (isOtherSymptomSelected && !customSymptom.trim()) {
      Alert.alert(
        "Specification Needed",
        "Please enter your custom symptom description.",
      );
      return;
    }

    try {
      setLoading(true);

      // Cleanly stitch regular items and custom inputs into a unified array list
      const finalSymptomsList = [...selectedSymptoms];
      if (isOtherSymptomSelected && customSymptom.trim()) {
        finalSymptomsList.push(customSymptom.trim().toUpperCase());
      }

      const finalCategoryValue =
        category === "OTHER" ? customCategory.trim() : category;

      const payload: CreateSymptomPayload = {
        userId: user!.id!,
        date: selectedDate.toISOString(),
        symptoms: finalSymptomsList,
        severity,
        notes: note.trim(),
        category: finalCategoryValue,
        timeOfDay,
        phase,
      };

      await createSymptom(payload);
      setSuccessVisible(true);
    } catch (err: any) {
      console.log(
        "Error response payload sync trace details:",
        err?.response?.data || err.message,
      );
      Alert.alert(
        "Sync Failure",
        "Could not complete logging transaction. Please verify connections.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
      <Stack.Screen
        options={{
          title: "Log Daily Activity",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Lexend_600SemiBold",
            fontSize: 16,
            color: COLORS.textDark,
          },
          headerStyle: { backgroundColor: "#FFF" },
          headerShadowVisible: false,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionHeadlineTitle}>
            Tell us about your day
          </Text>

          {/* DATE BLOCK */}
          <Text style={styles.inputGroupLabel}>Date</Text>
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.datePickerText}>
              {moment(selectedDate).format("MMMM DD, YYYY")}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={selectedDate}
              maximumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          {/* SYMPTOMS SECTION */}
          <Text style={styles.inputGroupLabel}>
            What symptoms are you experiencing?
          </Text>
          <View style={styles.optionRowGrid}>
            {BASE_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.chipButton,
                    isSelected && styles.chipButtonActive,
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {SYMPTOM_EMOJIS[symptom]} {symptom.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* SYMPTOM "OTHER" TOGGLE ACTION BOX */}
            <TouchableOpacity
              style={[
                styles.chipButton,
                isOtherSymptomSelected && styles.chipButtonActive,
              ]}
              onPress={() => setIsOtherSymptomSelected(!isOtherSymptomSelected)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  isOtherSymptomSelected && styles.chipTextActive,
                ]}
              >
                {SYMPTOM_EMOJIS.OTHER} other
              </Text>
            </TouchableOpacity>
          </View>

          {/* DYNAMIC TEXT FIELD INPUT FOR CUSTOM SYMPTOM */}
          {isOtherSymptomSelected && (
            <TextInput
              style={styles.customInputText}
              placeholder="What symptom are you feeling? (e.g. Bloating)"
              placeholderTextColor={COLORS.textMuted}
              value={customSymptom}
              onChangeText={setCustomSymptom}
              autoFocus
            />
          )}

          {/* SEVERITY SECTION */}
          <Text style={styles.inputGroupLabel}>Severity Intensity Level</Text>
          <View style={styles.optionRowGrid}>
            {SEVERITIES.map((s) => {
              const isSelected = severity === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.chipButton,
                    isSelected && styles.chipButtonActive,
                  ]}
                  onPress={() => setSeverity(s)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {s.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CATEGORY SECTION */}
          <Text style={styles.inputGroupLabel}>Classification Category</Text>
          <View style={styles.optionRowGrid}>
            {CATEGORIES.map((c) => {
              const isSelected = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.chipButton,
                    isSelected && styles.chipButtonActive,
                  ]}
                  onPress={() => setCategory(c)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {c.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CONDITIONAL SUB-INPUT TEXT FIELD FOR "OTHER" CATEGORY */}
          {category === "OTHER" && (
            <TextInput
              style={styles.customInputText}
              placeholder="Specify custom classification context..."
              placeholderTextColor={COLORS.textMuted}
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          )}

          {/* TIME OF DAY SECTION */}
          <Text style={styles.inputGroupLabel}>Time Period Window</Text>
          <View style={styles.optionRowGrid}>
            {TIMES_OF_DAY.map((t) => {
              const isSelected = timeOfDay === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.chipButton,
                    isSelected && styles.chipButtonActive,
                  ]}
                  onPress={() => setTimeOfDay(t)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {t.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BIOLOGICAL PHASE SECTION */}
          <Text style={styles.inputGroupLabel}>
            Est. Biological Cycle Phase
          </Text>
          <View style={styles.optionRowGrid}>
            {PHASES.map((p) => {
              const isSelected = phase === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.chipButton,
                    isSelected && styles.chipButtonActive,
                  ]}
                  onPress={() => setPhase(p)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {p.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CONTEXT NOTES FIELD */}
          <Text style={styles.inputGroupLabel}>Personal Logs / Notes</Text>
          <TextInput
            style={styles.customTextAreaBox}
            placeholder="Describe context signals or details here..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
          />

          {/* PRIMARY SUBMIT CTA ACTION */}
          <TouchableOpacity
            style={[styles.submitActionCTA, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitActionCTAText}>
              {loading ? "Recording Matrix..." : "Save Metric Log"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SymptomSuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        onGoHome={() => {
          setSuccessVisible(false);
          clearFormFields();
          router.replace("/(tabs)");
        }}
        onLogAnother={() => {
          setSuccessVisible(false);
          clearFormFields();
        }}
      />
    </View>
  );
}

/* ==========================================================================
   UNIFORM PREMIUM STYLESHEET DEFINITIONS
   ========================================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionHeadlineTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  inputGroupLabel: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 18,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  datePickerBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  datePickerText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: COLORS.textDark,
  },
  optionRowGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  chipButton: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  chipButtonActive: {
    backgroundColor: COLORS.accentTint,
    borderColor: COLORS.primaryBrand,
  },
  chipText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
    textTransform: "capitalize",
  },
  chipTextActive: {
    color: COLORS.primaryBrand,
    fontFamily: "Lexend_600SemiBold",
  },
  customInputText: {
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryBrand,
    paddingHorizontal: 16,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 4,
    marginBottom: 12,
  },
  customTextAreaBox: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    padding: 16,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: COLORS.textDark,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitActionCTA: {
    backgroundColor: COLORS.primaryBrand,
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    shadowColor: COLORS.primaryBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  submitActionCTAText: {
    fontFamily: "Lexend_600SemiBold",
    color: "#FFF",
    fontSize: 15,
  },
});
