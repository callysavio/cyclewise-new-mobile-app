import { useCycleSetup } from "@/providers/CycleSetupContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../(auth)/CustomButton";
import NumberPicker from "./components/number-pick";
import styles from "./styles";

export default function AverageLength() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setState } = useCycleSetup();
  const [selected, setSelected] = useState<number>(28); // Standardized reproductive health baseline default

  const onNext = () => {
    setState({ cycleLength: selected });
    router.push({ pathname: "/cycle-setup/period-duration" });
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
      {/* Top Header Layout Block */}
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

      {/* Hero Header Typography Elements */}
      <Text style={styles.paragraph}>
        Let’s Understand Your Cycle - tell us a bit about your period to
        personalize your experience.
      </Text>

      <Text style={styles.bigQuestion}>
        What’s the average length of your menstrual cycle?
      </Text>

      {/* Decorative Icon Graphic Element Block */}
      <View style={styles.modernIllustrationBadge}>
        <View style={styles.illustrationGlassCircle}>
          <Ionicons name="calendar-clear" size={54} color="#E5563D" />
        </View>
      </View>

      {/* Selector Module Segment */}
      <View style={styles.pickerSectionContainer}>
        <NumberPicker
          min={21}
          max={35}
          initial={selected}
          onChange={(val) => setSelected(val)}
        />
        <Text style={styles.pickerCaptionText}>Most common is 28 days</Text>
      </View>

      {/* Standard Action Interface Layer */}
      <View style={styles.continueButtonSpacer}>
        <CustomButton title="Next" onPress={onNext} loading={false} />
      </View>
    </ScrollView>
  );
}
