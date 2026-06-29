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

interface Props {
  visible: boolean;
  onClose: () => void;
  onStartTracking: () => void;
}

const CycleSetupSuccessModal: React.FC<Props> = ({
  visible,
  onClose,
  onStartTracking,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={COLORS.menstrualPink}
              />
            </View>

            <Text style={styles.title}>Cycle Setup Complete</Text>

            <Text style={styles.message}>
              Your cycle has been successfully created. You can now begin
              tracking your cycle and receive personalized insights.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onStartTracking}
            >
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Start Tracking</Text>
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
  },

  primaryButtonText: {
    fontFamily: "Lexend_600SemiBold",
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CycleSetupSuccessModal;