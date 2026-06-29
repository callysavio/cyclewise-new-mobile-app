import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { phaseData } from "./phaseData"; // Keep your phaseData

interface PhaseModalProps {
  visible: boolean;
  onClose: () => void;
  phase: keyof typeof phaseData | null;
}

const PhaseModal: React.FC<PhaseModalProps> = ({ visible, onClose, phase }) => {
  if (!phase || !phaseData[phase]) return null;

  const info = phaseData[phase];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header with close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Image */}
            <View
              style={[
                styles.heroImageContainer,
                { backgroundColor: info.color + "15" },
              ]}
            >
              <Image
                source={info.image}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.modalTitle, { color: info.color }]}>
              {info.title || phase}
            </Text>

            {/* Details */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>What Happens</Text>
              <Text style={styles.infoText}>{info.details.whatHappens}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Common Symptoms</Text>
              <Text style={styles.infoText}>{info.details.symptoms}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Fertility Window</Text>
              <Text style={styles.infoText}>{info.details.fertilization}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: "88%",
    paddingTop: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scroll: { flex: 1, paddingHorizontal: 20 },
  heroImageContainer: {
    alignSelf: "center",
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  heroImage: { width: 110, height: 110 },
  modalTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  infoTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 8,
  },
  infoText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
});

export default PhaseModal;
