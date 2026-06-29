import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCycle } from "@/providers/CycleContext";
import { updateCycle } from "@/services/cycle.service";

/* ==============================
   BRAND TOKENS
============================== */
const Colors = {
  background: "#FFFFFF",
  cardBg: "#FFFFFF",
  inputBg: "#FDF9F6",
  border: "#F0E4DC",
  cardBorder: "#F3F4F6",
  textDark: "#1C1C1E",
  textMuted: "#636366",
  textFaint: "#8E8E93",
  main: "#E5563D",
  mainSoft: "#FFF5F4",
  error: "#D64545",
  errorSoft: "#FBEAEA",
};

const MIN_CYCLE = 15;
const MAX_CYCLE = 60;
const MIN_BLEEDING = 1;
const MAX_BLEEDING = 15;

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const toISODateString = (date: Date) => date.toISOString().slice(0, 10);

export default function EditCycleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { currentCycle, setCurrentCycle, loading: cycleLoading } = useCycle();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cycleLength, setCycleLength] = useState(28);
  const [bleedingLength, setBleedingLength] = useState(5);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    cycle?: string;
    bleeding?: string;
  }>({});

  useEffect(() => {
    if (currentCycle) {
      const parsed = new Date(currentCycle.startDate);
      if (!Number.isNaN(parsed.getTime())) setStartDate(parsed);
      if (currentCycle.cycleLength) setCycleLength(currentCycle.cycleLength);
      if (currentCycle.bleedingLength)
        setBleedingLength(currentCycle.bleedingLength);
    }
  }, [currentCycle]);

  /* ==============================
     LIVE PREVIEW
  ============================== */
  const preview = useMemo(() => {
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    const periodEnd = new Date(startDate);
    periodEnd.setDate(periodEnd.getDate() + bleedingLength - 1);

    return {
      periodEndLabel: formatDisplayDate(periodEnd),
      nextPeriodLabel: formatDisplayDate(nextPeriod),
    };
  }, [startDate, cycleLength, bleedingLength]);

  /* ==============================
     STEPPER HELPERS
  ============================== */
  const adjustCycle = (delta: number) => {
    setCycleLength((prev) => {
      const next = prev + delta;
      if (next < MIN_CYCLE || next > MAX_CYCLE) return prev;
      return next;
    });
  };

  const adjustBleeding = (delta: number) => {
    setBleedingLength((prev) => {
      const next = prev + delta;
      if (next < MIN_BLEEDING || next > MAX_BLEEDING) return prev;
      return next;
    });
  };

  /* ==============================
     VALIDATION
  ============================== */
  const validate = () => {
    const nextErrors: typeof errors = {};

    if (startDate > new Date()) {
      nextErrors.date = "Start date can't be in the future";
    }
    if (cycleLength < MIN_CYCLE || cycleLength > MAX_CYCLE) {
      nextErrors.cycle = `Cycle length should be ${MIN_CYCLE}–${MAX_CYCLE} days`;
    }
    if (bleedingLength < MIN_BLEEDING || bleedingLength > MAX_BLEEDING) {
      nextErrors.bleeding = `Period length should be ${MIN_BLEEDING}–${MAX_BLEEDING} days`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ==============================
     SAVE
  ============================== */
  const handleSave = async () => {
    if (!currentCycle) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const updated = await updateCycle(currentCycle.id, {
        startDate: toISODateString(startDate),
        bleedingLength,
        manuallyRecomputed: true,
        recomputedAt: new Date().toISOString(),
      });

      setCurrentCycle(updated);
      Alert.alert("Saved", "Your cycle details have been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update cycle");
    } finally {
      setLoading(false);
    }
  };

  if (cycleLoading || !currentCycle) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.main} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Cycle</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Update your cycle information for more accurate predictions.
        </Text>

        {/* Start Date */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Last Period Start Date</Text>
          <Pressable
            style={[styles.dateField, errors.date && styles.fieldError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color={Colors.main} />
            <Text style={styles.dateFieldText}>
              {formatDisplayDate(startDate)}
            </Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textFaint} />
          </Pressable>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              maximumDate={new Date()}
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_, selected) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selected) setStartDate(selected);
              }}
            />
          )}
          {showDatePicker && Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cycle Length */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Cycle Length</Text>
            <Text style={styles.labelHint}>
              {MIN_CYCLE}–{MAX_CYCLE} days
            </Text>
          </View>
          <View style={[styles.stepperRow, errors.cycle && styles.fieldError]}>
            <StepperButton
              icon="remove"
              onPress={() => adjustCycle(-1)}
              disabled={cycleLength <= MIN_CYCLE}
            />
            <View style={styles.stepperValueWrap}>
              <Text style={styles.stepperValue}>{cycleLength}</Text>
              <Text style={styles.stepperUnit}>days</Text>
            </View>
            <StepperButton
              icon="add"
              onPress={() => adjustCycle(1)}
              disabled={cycleLength >= MAX_CYCLE}
            />
          </View>
          {errors.cycle && <Text style={styles.errorText}>{errors.cycle}</Text>}
        </View>

        {/* Period (Bleeding) Length */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Period Length</Text>
            <Text style={styles.labelHint}>
              {MIN_BLEEDING}–{MAX_BLEEDING} days
            </Text>
          </View>
          <View
            style={[styles.stepperRow, errors.bleeding && styles.fieldError]}
          >
            <StepperButton
              icon="remove"
              onPress={() => adjustBleeding(-1)}
              disabled={bleedingLength <= MIN_BLEEDING}
            />
            <View style={styles.stepperValueWrap}>
              <Text style={styles.stepperValue}>{bleedingLength}</Text>
              <Text style={styles.stepperUnit}>days</Text>
            </View>
            <StepperButton
              icon="add"
              onPress={() => adjustBleeding(1)}
              disabled={bleedingLength >= MAX_BLEEDING}
            />
          </View>
          {errors.bleeding && (
            <Text style={styles.errorText}>{errors.bleeding}</Text>
          )}
        </View>

        {/* Live Preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Ionicons name="sparkles-outline" size={16} color={Colors.main} />
            <Text style={styles.previewTitle}>Updated Preview</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Period ends around</Text>
            <Text style={styles.previewValue}>{preview.periodEndLabel}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Next period expected</Text>
            <Text style={styles.previewValue}>{preview.nextPeriodLabel}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.buttonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ==============================
   STEPPER BUTTON
============================== */
const StepperButton = ({
  icon,
  onPress,
  disabled,
}: {
  icon: "add" | "remove";
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.stepperButton, disabled && styles.stepperButtonDisabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Ionicons
      name={icon}
      size={18}
      color={disabled ? Colors.textFaint : Colors.main}
    />
  </TouchableOpacity>
);

/* ==============================
   STYLES
============================== */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: Colors.textDark,
  },

  subtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 24,
  },

  /* Fields */
  fieldGroup: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 8,
  },
  labelHint: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: Colors.textFaint,
  },

  dateField: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  dateFieldText: {
    flex: 1,
    fontFamily: "Lexend_500Medium",
    fontSize: 15,
    color: Colors.textDark,
    marginLeft: 10,
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    fontFamily: "Lexend_600SemiBold",
    color: Colors.main,
    fontSize: 14,
  },

  fieldError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
  },

  /* Stepper */
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
  },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.mainSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    backgroundColor: Colors.cardBorder,
  },
  stepperValueWrap: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  stepperValue: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: Colors.textDark,
  },
  stepperUnit: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 6,
  },

  /* Preview card */
  previewCard: {
    backgroundColor: Colors.mainSoft,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  previewTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: Colors.main,
    marginLeft: 6,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  previewLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  previewValue: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: Colors.textDark,
  },

  /* Save button */
  button: {
    flexDirection: "row",
    backgroundColor: Colors.main,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    marginLeft: 8,
  },
});
