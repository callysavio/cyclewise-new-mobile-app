import { useCycleSetup } from "@/providers/CycleSetupContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

const { width } = Dimensions.get("window");

export default function LastPeriodStart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setState } = useCycleSetup();

  // Local cycle setup state (in real app persist/send to backend)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calendar view state
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();
  const firstDayOfMonth = new Date(year, viewDate.getMonth(), 1).getDay(); // 0..6
  const daysInMonth = new Date(year, viewDate.getMonth() + 1, 0).getDate();

  const daysArray = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [daysInMonth]);

  const prevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const onSelectDay = (day: number) => {
    const date = new Date(year, viewDate.getMonth(), day);
    const iso = moment(date).format("YYYY-MM-DD");
    setSelectedDate(iso);
  };

  const handleContinue = () => {
setState({ startDate: selectedDate || undefined });  router.push({ pathname: "/cycle-setup-tracker/average-lengtht" });
};

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#fff", flex: 1 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
  <TouchableOpacity
    onPress={() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/track");
      }
    }}
  >
    <Ionicons name="arrow-back" size={26} color="#000" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Cycle Setup</Text>
</View>

      {/* Lead paragraph */}
      <Text style={styles.paragraph}>
        Let’s Understand Your Cycle - tell us a bit about your period to personalize your experience.
      </Text>

      {/* Question */}
      <Text style={styles.bigQuestion}>When did your last period start?</Text>

      {/* Month header */}
      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Text style={{ fontSize: 22, color: "#666" }}>‹</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={styles.monthText}>{monthName}</Text>
            <Text style={styles.yearText}>{year}</Text>
          </View>

          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Text style={{ fontSize: 22, color: "#666" }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day names */}
        <View style={styles.dayNamesContainer}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <Text key={d} style={styles.dayName}>
              {d}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.daysGrid}>
          {/* empty cells for firstDayOfMonth */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}

          {daysArray.map((day) => {
            const iso = moment(new Date(year, viewDate.getMonth(), day)).format("YYYY-MM-DD");
            const isToday = iso === moment(today).format("YYYY-MM-DD");
            const isSelected = iso === selectedDate;
            const isFuture = new Date(year, viewDate.getMonth(), day) > today;

            return (
              <TouchableOpacity
                key={day}
                onPress={() => onSelectDay(day)}
                style={[
                  styles.dayCell,
                  isSelected && { backgroundColor: "#E5563D", borderRadius: 999 },
                  isToday && !isSelected && { borderWidth: 1, borderColor: "#E5563D", borderRadius: 999 },
                  isFuture && { opacity: 0.4 },
                ]}
                disabled={isFuture}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayCellText, isSelected ? { color: "#fff", fontWeight: "700" } : {}]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Continue */}
      <TouchableOpacity
        onPress={handleContinue}
        disabled={!selectedDate}
        style={[
          styles.nextBtn,
          { opacity: selectedDate ? 1 : 0.6, marginTop: 24 },
        ]}
      >
        <Text style={styles.nextBtnText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
