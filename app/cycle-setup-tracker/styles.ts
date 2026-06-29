import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
  },
  skipText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#999",
  },
  paragraph: {
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
    color: "#555",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  bigQuestion: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 20,
    color: "#111",
    marginBottom: 18,
  },
  illustrationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  navBtn: {
    padding: 8,
  },
  monthText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    marginRight: 8,
  },
  yearText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#666",
  },
  dayNamesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    marginBottom: 8,
  },
  dayName: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    fontFamily: "Lexend_400Regular",
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
    padding: 6,
  },
  dayCellText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#111",
  },
  nextBtn: {
    backgroundColor: "#E5563D",
    paddingVertical: 16,
    borderRadius: 40,
    marginTop: 30,
    marginBottom: 20,
  },
  nextBtnText: {
    color: "#fff",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  pickerCaptionText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});
