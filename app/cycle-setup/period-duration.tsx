import { useCycleSetup } from "@/providers/CycleSetupContext";
import { createCycle } from "@/services/cycle.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../(auth)/CustomButton";
import NumberPicker from "./components/number-pick";
import styles from "./styles";

export default function PeriodDuration() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, reset } = useCycleSetup();
  const [duration, setDuration] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  const onComplete = async () => {
    if (!state.startDate) {
      Alert.alert("Missing Data", "Last period date is required.");
      return;
    }

    if (!state.cycleLength) {
      Alert.alert("Missing Data", "Average cycle length is required.");
      return;
    }

    try {
      setLoading(true);

      // Compute accurate absolute expiration timestamp
      const start = new Date(state.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + state.cycleLength);

      const payload = {
        startDate: state.startDate,
        endDate: end.toISOString().split("T")[0],
        bleedingLength: duration,
        notes: state.notes || undefined,
        tags: state.tags || undefined,
        type: state.type || "NATURAL",
      };

      await createCycle(payload);
      reset();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Setup Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to finalize your setup",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.setupScrollContainer,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.calendarScreenWrapper}
    >
      {/* Header Context Junction */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/login")
          }
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

      {/* Typography Prompts */}
      <Text style={styles.paragraph}>
        Let’s Understand Your Cycle - tell us a bit about your period to
        personalize your experience.
      </Text>

      <Text style={styles.bigQuestion}>
        How long does your period usually last?
      </Text>

      {/* Clean Dynamic Graphical Section */}
      <View style={styles.modernIllustrationBadge}>
        <View
          style={[
            styles.illustrationGlassCircle,
            { backgroundColor: "#FFF5F3" },
          ]}
        >
          <Ionicons name="water" size={54} color="#E5563D" />
        </View>
      </View>

      {/* Picker Framework Overlay Component */}
      <View style={styles.pickerSectionContainer}>
        <NumberPicker
          min={2}
          max={10}
          initial={duration}
          onChange={(v) => setDuration(v)}
        />
        <Text style={styles.pickerCaptionText}>
          Most common duration is 4–6 days
        </Text>
      </View>

      {/* Completion Button Execution Module */}
      <View style={styles.continueButtonSpacer}>
        <CustomButton title="Finish" onPress={onComplete} loading={loading} />
      </View>
    </ScrollView>
  );
}
