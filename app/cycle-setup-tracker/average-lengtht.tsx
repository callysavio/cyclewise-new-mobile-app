import { useCycleSetup } from "@/providers/CycleSetupContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NumberPicker from "./components/number-pick";
import styles from "./styles";

export default function AverageLength() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setState } = useCycleSetup();
  const [selected, setSelected] = useState<number>(25);

 const onNext = () => {
  setState({ cycleLength: selected });
  router.push({ pathname: "/cycle-setup-tracker/period-durationt" });
};

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
     <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={26} color="#000" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Cycle Setup</Text>

  <View style={{ width: 26 }} />
</View>

      <Text style={styles.paragraph}>
        Let’s Understand Your Cycle - tell us a bit about your period to personalize your experience.
      </Text>

      <Text style={styles.bigQuestion}>What’s the average length of your menstrual cycle?</Text>

      <View style={styles.illustrationWrapper}>
  <Ionicons
    name="calendar-outline"
    size={110}
    color="#E5563D"
  />
</View>

      <NumberPicker
        min={21}
        max={35}
        initial={selected}
        onChange={(val) => setSelected(val)}
      />

      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

