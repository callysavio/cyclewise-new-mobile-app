import { StyleSheet } from "react-native";

export default StyleSheet.create({
  calendarScreenWrapper: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerBackWrapper: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  headerTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: "#1C1C1E",
  },
  skipText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#99999F",
  },
  paragraph: {
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
    color: "#636366",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  bigQuestion: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 20,
    color: "#1C1C1E",
    marginBottom: 18,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#E5563D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0E4DC",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#FDF9F6",
  },
  navChevronText: {
    fontSize: 22,
    color: "#E5563D",
    fontFamily: "Lexend_500Medium",
    marginTop: -2, // Fine alignment adjustment
  },
  monthLabelRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  monthText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    color: "#1C1C1E",
    marginRight: 8,
  },
  yearText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#8E8E93",
  },
  dayNamesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  dayName: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    color: "#AEAEB2",
    fontFamily: "Lexend_500Medium",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: "#E5563D",
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: "#E5563D",
  },
  dayCellFuture: {
    opacity: 0.25,
  },
  dayCellText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#1C1C1E",
  },
  dayCellTextSelected: {
    color: "#FFFFFF",
    fontFamily: "Lexend_700Bold",
  },
  continueButtonSpacer: {
    marginTop: 16,
    marginBottom: 12,
  },
  // Setup Flow Layout Extensions
  setupScrollContainer: {
    paddingHorizontal: 20,
    flexGrow: 1,
    justifyContent: "space-between", // Keeps elements cleanly distributed across screens
  },
  modernIllustrationBadge: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
    width: "100%",
  },
  illustrationGlassCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FDF9F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0E4DC",
    // Premium soft element dropshadow map
    shadowColor: "#E5563D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  pickerSectionContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FDF9F6",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F0E4DC",
    marginBottom: 20,
  },
  pickerCaptionText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 12,
    textAlign: "center",
  },
});
