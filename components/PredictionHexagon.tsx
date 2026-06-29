import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PredictionHexagonProps {
  date: string;
  predictionText: string;
  predictionColor?: string;
  backgroundImage?: any;
}

const PredictionHexagon: React.FC<PredictionHexagonProps> = ({
  date,
  predictionText,
  predictionColor = "#E5563D",
  backgroundImage = require("@/assets/images/octagon.png"),
}) => {
  const textLength = predictionText.length;

  // Scales up the container frame if the text phrase gets long
  const scaleFactor = textLength > 12 ? 1 + (textLength - 12) * 0.025 : 1;
  const dynamicWidth = Math.min(
    SCREEN_WIDTH * 0.52 * scaleFactor,
    SCREEN_WIDTH * 0.85,
  );
  const dynamicHeight = Math.min(
    SCREEN_WIDTH * 0.44 * scaleFactor,
    SCREEN_WIDTH * 0.72,
  );

  // Optimizes base font size dynamically so long strings layout comfortably
  const dynamicFontSize = textLength > 16 ? 14 : 16;

  return (
    <View style={styles.container}>
      {/* Background Hexagon Frame */}
      <Image
        source={backgroundImage}
        style={{ width: dynamicWidth, height: dynamicHeight }}
        resizeMode="contain"
      />

      {/* Overlay Text Engine */}
      <View style={styles.contentOverlay}>
        <View style={styles.content}>
          {/* Wraps beautifully onto a new line if it hits container limits */}
          <Text
            style={[
              styles.predictionText,
              { color: predictionColor, fontSize: dynamicFontSize },
            ]}
          >
            {predictionText}
          </Text>

          {/* Supportive Date Context Label */}
          <Text style={[styles.dateText, { color: predictionColor }]}>
            {date}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  contentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%", // Safe boundary padding layout inside the hexagon walls
  },
  predictionText: {
    fontFamily: "Lexend_600SemiBold",
    textAlign: "center",
    width: "100%",
    lineHeight: 20,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
});

export default PredictionHexagon;
