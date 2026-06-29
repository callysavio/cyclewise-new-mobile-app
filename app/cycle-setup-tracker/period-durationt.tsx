import CycleSetupSuccessModal from "@/components/CycleSetupSuccessModal";
import { useCycleSetup } from "@/providers/CycleSetupContext";
import { createCycle } from "@/services/cycle.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NumberPicker from "./components/number-pick";
import styles from "./styles";

export default function PeriodDuration() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, reset } = useCycleSetup();

  const [duration, setDuration] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleDurationChange = useCallback((v: number) => {
    setDuration(v);
  }, []);

  const onComplete = useCallback(async () => {
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

      const start = new Date(state.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + state.cycleLength);

      const payload = {
        startDate: state.startDate,
        endDate: end.toISOString().split("T")[0],
        bleedingLength: duration, // ✅ uses the picker value directly, not the unset context field
        notes: state.notes || undefined,
        tags: state.tags || undefined,
        type: state.type || "NATURAL",
      };

      await createCycle(payload);
      reset();
      setShowCompleteModal(true);
    } catch (error: any) {
      Alert.alert(
        "Setup Error",
        error?.message || "Failed to finalize your setup",
      );
    } finally {
      setLoading(false);
    }
  }, [state, duration, reset]);

  const startTracking = useCallback(() => {
    setShowCompleteModal(false);
    router.replace("/(tabs)/track");
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
      }}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle Setup</Text>
      </View>

      <Text style={styles.paragraph}>
        Let&apos;s understand your cycle — tell us a bit about your period to
        personalize your experience.
      </Text>

      <Text style={styles.bigQuestion}>
        How long does your period usually last?
      </Text>

      <View style={styles.illustrationWrapper}>
        <Ionicons name="water-outline" size={110} color="#E5563D" />
      </View>

      <NumberPicker
        min={2}
        max={10}
        initial={duration}
        onChange={handleDurationChange}
      />

      <Text style={styles.pickerCaptionText}>
        Most common duration is 4–6 days
      </Text>

      <TouchableOpacity
        style={[styles.nextBtn, loading && { opacity: 0.6 }]}
        onPress={onComplete}
        disabled={loading}
      >
        <Text style={styles.nextBtnText}>
          {loading ? "Saving..." : "Finish"}
        </Text>
      </TouchableOpacity>

      <CycleSetupSuccessModal
        visible={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onStartTracking={startTracking}
      />
    </View>
  );
}
