import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  menstrualPink: "#FF699C",
  buttonBrown: "#E5563D",
};

interface SymptomSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onLogAnother: () => void;
}

const SymptomSuccessModal: React.FC<SymptomSuccessModalProps> = ({
  visible,
  onClose,
  onGoHome,
  onLogAnother,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* Success Icon Circle */}
            <View style={styles.iconCircle}>
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={COLORS.menstrualPink}
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Symptom Logged</Text>

            {/* Message */}
            <Text style={styles.message}>
              Your symptom entry has been successfully recorded in your
              CycleWise tracker.
            </Text>

            {/* Primary Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onLogAnother}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Log Another Symptom</Text>
            </TouchableOpacity>

            {/* Secondary Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onGoHome}
            >
              <Ionicons name="home-outline" size={20} color="#555" />
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 55,
    paddingHorizontal: 22,
    maxHeight: "85%",
  },

  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 50,
    padding: 6,
  },

  content: {
    alignItems: "center",
    paddingBottom: 40,
  },

  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF699C22",
    marginBottom: 25,
  },

  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },

  message: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.buttonBrown,
    borderRadius: 30,
    paddingVertical: 16,
    width: "100%",
    marginBottom: 14,
  },

  primaryButtonText: {
    fontFamily: "Lexend_600SemiBold",
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 14,
  },

  secondaryButtonText: {
    fontFamily: "Lexend_600SemiBold",
    color: "#555",
    fontSize: 15,
    marginLeft: 8,
  },
});

export default SymptomSuccessModal;