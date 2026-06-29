// CycleSetup.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

/**
 * Types
 */
type Step = "start" | "length" | "duration" | "summary";

interface CycleState {
  cycleStart: string | null; // YYYY-MM-DD
  cycleLength: number | null; // days (21..35)
  periodDuration: number | null; // days (3..7)
}

/**
 * Utility: format YYYY-MM-DD
 */
const formatDate = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/**
 * Placeholder: simulate backend save
 */
const saveCycleSetupToBackend = async (payload: CycleState) => {
  // TODO: replace with real API call
  // Example:
  // await api.post('/user/cycle', payload)
  await new Promise((res) => setTimeout(res, 700));
  return { ok: true };
};

/**
 * Calendar component (simplified, local)
 */
const CalendarGrid: React.FC<{
  year: number;
  month: number; // 0-indexed
  selectedDate: string | null;
  onSelectDate: (dateString: string) => void;
}> = ({ year, month, selectedDate, onSelectDate }) => {
  const today = useMemo(() => new Date(), []);
  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);
  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );

  // produce array of day numbers with empties for offset
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isFuture = (d: number) => {
    const date = new Date(year, month, d);
    // compare only date
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date.getTime() > todayMid.getTime();
  };

  return (
    <View style={localStyles.calendarGrid}>
      {cells.map((cell, idx) => {
        if (cell === null) {
          return <View key={`empty-${idx}`} style={localStyles.dayCell} />;
        }
        const d = cell;
        const dateString = formatDate(year, month + 1, d);
        const selected = selectedDate === dateString;
        const disabled = isFuture(d);

        return (
          <TouchableOpacity
            key={dateString}
            style={[
              localStyles.dayCell,
              selected && localStyles.dayCellSelected,
              disabled && localStyles.dayCellDisabled,
            ]}
            onPress={() => !disabled && onSelectDate(dateString)}
            activeOpacity={0.8}
          >
            <Text style={[localStyles.dayText, selected && localStyles.dayTextSelected]}>
              {d}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/**
 * Horizontal number picker component
 */
const HorizontalNumberPicker: React.FC<{
  min: number;
  max: number;
  value: number | null;
  onChange: (n: number) => void;
  stepLabel?: string;
}> = ({ min, max, value, onChange, stepLabel }) => {
  const data = useMemo(() => {
    const arr: number[] = [];
    for (let n = min; n <= max; n++) arr.push(n);
    return arr;
  }, [min, max]);

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(i) => String(i)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={localStyles.pickerList}
      renderItem={({ item }) => {
        const selected = item === value;
        return (
          <TouchableOpacity
            style={[localStyles.pickerItem, selected && localStyles.pickerItemSelected]}
            onPress={() => onChange(item)}
            activeOpacity={0.8}
          >
            <Text style={[localStyles.pickerItemText, selected && localStyles.pickerItemTextSelected]}>
              {item}
            </Text>
            {stepLabel ? <Text style={localStyles.pickerItemLabel}>{stepLabel}</Text> : null}
          </TouchableOpacity>
        );
      }}
    />
  );
};

/**
 * Main: CycleSetup
 */
const CycleSetup: React.FC<{ onDone?: () => void; onSkip?: () => void }> = ({ onDone, onSkip }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("start");
  const [state, setState] = useState<CycleState>({
    cycleStart: null,
    cycleLength: null,
    periodDuration: null,
  });

  // Calendar viewport controls
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-indexed

  const goPrevMonth = useCallback(() => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  }, [viewDate]);

  const goNextMonth = useCallback(() => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  }, [viewDate]);

  const handleSelectDate = useCallback((dateString: string) => {
    setState((s) => ({ ...s, cycleStart: dateString }));
  }, []);

  const handleContinueFromStart = useCallback(() => {
    if (!state.cycleStart) {
      Alert.alert("Select a date", "Please choose the start date of your last period.");
      return;
    }
    setStep("length");
  }, [state.cycleStart]);

  const handleContinueFromLength = useCallback(() => {
    if (!state.cycleLength) {
      Alert.alert("Choose cycle length", "Please select your average cycle length.");
      return;
    }
    setStep("duration");
  }, [state.cycleLength]);

  const handleContinueFromDuration = useCallback(() => {
    if (!state.periodDuration) {
      Alert.alert("Choose period duration", "Please select how many days your period lasts.");
      return;
    }
    setStep("summary");
  }, [state.periodDuration]);

  const handleSave = useCallback(async () => {
    try {
      // show loading UI in real app
      const res = await saveCycleSetupToBackend(state);
      if (res.ok) {
        // call onDone to navigate to app home or next step
        onDone?.();
        Alert.alert("Saved", "Your cycle setup has been saved.");
      } else {
        Alert.alert("Error", "Could not save your cycle. Try again later.");
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Network or server error. Try again later.");
    }
  }, [state, onDone]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Cycle Setup</Text>
        <TouchableOpacity onPress={() => onSkip?.() ?? null} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.leadText}>
          Let’s understand your cycle — tell us a bit about your period to personalize your experience.
        </Text>

        {step === "start" && (
          <>
            <Text style={styles.questionTitle}>When did your last period start?</Text>

            {/* Month / Year header with nav */}
            <View style={localStyles.calendarHeader}>
              <TouchableOpacity onPress={goPrevMonth} style={localStyles.calendarNav}>
                <Text style={localStyles.navText}>◀</Text>
              </TouchableOpacity>

              <View style={localStyles.calendarTitleWrap}>
                <Text style={localStyles.calendarTitle}>
                  {viewDate.toLocaleString(undefined, { month: "long" })} {viewYear}
                </Text>
              </View>

              <TouchableOpacity onPress={goNextMonth} style={localStyles.calendarNav}>
                <Text style={localStyles.navText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Day names */}
            <View style={localStyles.dayNames}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <Text key={d} style={localStyles.dayNameText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Calendar grid */}
            <CalendarGrid
              year={viewYear}
              month={viewMonth}
              selectedDate={state.cycleStart}
              onSelectDate={handleSelectDate}
            />

            {/* Spacer pushes button to bottom of scroll content so the button isn't at the very bottom of the screen */}
            <View style={{ height: 24 }} />
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinueFromStart} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {step === "length" && (
          <>
            <Text style={styles.questionTitle}>What’s the average length of your menstrual cycle?</Text>

            <Text style={styles.helperText}>Tap a number below to select (21–35 days)</Text>

            <HorizontalNumberPicker
              min={21}
              max={35}
              value={state.cycleLength}
              onChange={(n) => setState((s) => ({ ...s, cycleLength: n }))}
              stepLabel="days"
            />

            <View style={{ height: 8 }} />

            <View style={styles.stepButtonsRow}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setStep("start")}>
                <Text style={styles.ghostButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleContinueFromLength}>
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === "duration" && (
          <>
            <Text style={styles.questionTitle}>How long does your period last?</Text>

            <Text style={styles.helperText}>Select how many days your period usually lasts</Text>

            <HorizontalNumberPicker
              min={3}
              max={7}
              value={state.periodDuration}
              onChange={(n) => setState((s) => ({ ...s, periodDuration: n }))}
              stepLabel="days"
            />

            <View style={{ height: 8 }} />
            <View style={styles.stepButtonsRow}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setStep("length")}>
                <Text style={styles.ghostButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleContinueFromDuration}>
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === "summary" && (
          <>
            <Text style={styles.questionTitle}>You're all set</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Last period start</Text>
              <Text style={styles.summaryValue}>{state.cycleStart ?? "—"}</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryColumn}>
                  <Text style={styles.summaryLabel}>Cycle length</Text>
                  <Text style={styles.summaryValue}>{state.cycleLength ? `${state.cycleLength} days` : "—"}</Text>
                </View>
                <View style={styles.summaryColumn}>
                  <Text style={styles.summaryLabel}>Period duration</Text>
                  <Text style={styles.summaryValue}>{state.periodDuration ? `${state.periodDuration} days` : "—"}</Text>
                </View>
              </View>
            </View>

            <View style={{ height: 8 }} />
            <View style={styles.stepButtonsRow}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setStep("duration")}>
                <Text style={styles.ghostButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                <Text style={styles.primaryButtonText}>Save & Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerRow: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: "#111",
  },
  skipText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#E5563D",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  leadText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 18,
  },
  questionTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 20,
    color: "#111",
    marginBottom: 12,
  },
  helperText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#777",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#E5563D",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    fontFamily: "Lexend_600SemiBold",
    color: "#fff",
    fontSize: 16,
  },
  ghostButton: {
    backgroundColor: "#F4F5F6",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  ghostButtonText: {
    fontFamily: "Lexend_500Medium",
    color: "#333",
    fontSize: 15,
  },
  stepButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  summaryCard: {
    backgroundColor: "#FFF7F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  summaryLabel: {
    fontFamily: "Lexend_500Medium",
    color: "#6B6B6B",
    fontSize: 13,
  },
  summaryValue: {
    fontFamily: "Lexend_600SemiBold",
    color: "#111",
    fontSize: 16,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  summaryColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
});

/**
 * Local styles for calendar & pickers
 */
const localStyles = StyleSheet.create({
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarNav: {
    padding: 8,
  },
  navText: {
    fontSize: 18,
    color: "#666",
  },
  calendarTitleWrap: {
    flex: 1,
    alignItems: "center",
  },
  calendarTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#111",
  },
  dayNames: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dayNameText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontFamily: "Lexend_500Medium",
    color: "#8B8B8B",
    fontSize: 12,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  dayText: {
    fontFamily: "Lexend_400Regular",
    color: "#111",
  },
  dayCellSelected: {
    backgroundColor: "#E5563D",
    borderRadius: 999,
  },
  dayTextSelected: {
    color: "#fff",
    fontFamily: "Lexend_700Bold",
  },
  dayCellDisabled: {
    opacity: 0.35,
  },

  // picker
  pickerList: {
    paddingVertical: 12,
  },
  pickerItem: {
    minWidth: Math.min(86, width * 0.18),
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F4F5F6",
  },
  pickerItemSelected: {
    backgroundColor: "#E5563D",
  },
  pickerItemText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: "#222",
  },
  pickerItemTextSelected: {
    color: "#fff",
  },
  pickerItemLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
});

export default CycleSetup;
