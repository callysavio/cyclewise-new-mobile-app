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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../(auth)/CustomButton"; // Reusing your standardized action system
import styles from "./styles";

const { width } = Dimensions.get("window");

export default function LastPeriodStart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setState } = useCycleSetup();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calendar configuration parameters
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();
  const firstDayOfMonth = new Date(year, viewDate.getMonth(), 1).getDay();
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
    setState({ startDate: selectedDate || undefined });
    router.push({ pathname: "/cycle-setup/average-length" });
  };

  // Safe History Fallback Navigation Strategy
  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Safely redirect to a stable auth junction if history was replaced
      router.replace("/(auth)/login");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
      style={styles.calendarScreenWrapper}
    >
      {/* Header Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={handleBackNavigation}
          activeOpacity={0.7}
          style={styles.headerBackWrapper}
        >
          <Ionicons name="arrow-back" size={26} color="#1C1C1E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cycle Setup</Text>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Intro Description */}
      <Text style={styles.paragraph}>
        Let’s Understand Your Cycle - tell us a bit about your period to
        personalize your experience.
      </Text>

      {/* Main Context Question */}
      <Text style={styles.bigQuestion}>When did your last period start?</Text>

      {/* Month Selector Component block */}
      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={prevMonth}
            style={styles.navBtn}
            activeOpacity={0.6}
          >
            <Text style={styles.navChevronText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.monthLabelRow}>
            <Text style={styles.monthText}>{monthName}</Text>
            <Text style={styles.yearText}>{year}</Text>
          </View>

          <TouchableOpacity
            onPress={nextMonth}
            style={styles.navBtn}
            activeOpacity={0.6}
          >
            <Text style={styles.navChevronText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day Name Tags rows */}
        <View style={styles.dayNamesContainer}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <Text key={d} style={styles.dayName}>
              {d}
            </Text>
          ))}
        </View>

        {/* Day Item Generation Grid */}
        <View style={styles.daysGrid}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}

          {daysArray.map((day) => {
            const iso = moment(new Date(year, viewDate.getMonth(), day)).format(
              "YYYY-MM-DD",
            );
            const isToday = iso === moment(today).format("YYYY-MM-DD");
            const isSelected = iso === selectedDate;
            const isFuture = new Date(year, viewDate.getMonth(), day) > today;

            return (
              <TouchableOpacity
                key={day}
                onPress={() => onSelectDay(day)}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  isToday && !isSelected && styles.dayCellToday,
                  isFuture && styles.dayCellFuture,
                ]}
                disabled={isFuture}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayCellText,
                    isSelected && styles.dayCellTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Standardized Core Global Button */}
      <View style={styles.continueButtonSpacer}>
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedDate}
          loading={false}
        />
      </View>
    </ScrollView>
  );
}
