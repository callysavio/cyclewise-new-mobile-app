import { StyleSheet } from "react-native";

const MAIN_COLOR = "#E5563D";

const styles = StyleSheet.create({
  logPeriodBtn: {
    backgroundColor: MAIN_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  logPeriodBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend_600SemiBold",
  },
  dayDetailsCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  dayDetailsText: {
    fontSize: 16,
    fontFamily: "Lexend_500Medium",
    color: "#333",
    marginBottom: 5,
  },
  phaseInfo: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#666",
    marginBottom: 5,
  },
  statsCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#666",
    marginBottom: 3,
  },
  noCycleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noCycleText: {
    fontSize: 16,
    fontFamily: "Lexend_500Medium",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  createCycleBtn: {
    backgroundColor: MAIN_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  createCycleBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend_600SemiBold",
  },
});

export default styles;