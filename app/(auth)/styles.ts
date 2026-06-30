import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Main structural containers
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 450, // Limits container spread on iPads or wider desktop views
    alignSelf: "center",
  },
  screenContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
  },

  // Brand/Identity system
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandLogo: {
    fontFamily: "Lexend_700Bold",
    fontSize: 32,
    color: "#E5563D",
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
    textAlign: "center",
  },

  // Headers & Subtext
  welcomeContainer: {
    marginBottom: 28,
  },
  signupWelcomeContainer: {
    paddingTop: 24,
    marginBottom: 28,
  },
  brandTaglineSignup: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 15,
    color: "#2C2C2E",
    lineHeight: 22,
    marginBottom: 16,
    textAlign: "center",
  },
  header: {
    fontFamily: "Lexend_700Bold",
    fontSize: 24,
    color: "#1C1C1E",
    marginBottom: 6,
  },
  subheader: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#636366",
    lineHeight: 20,
  },
  infoText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
    marginBottom: 16,
  },

  // Universal Inputs (Used in CustomTextInput)
  formContainer: {
    width: "100%",
    marginBottom: 12,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: "#2C2C2E",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  input: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#FDF9F6", // Warm signature tint
    borderWidth: 1,
    borderColor: "#F0E4DC",
    fontSize: 16,
    paddingHorizontal: 16,
    fontFamily: "Lexend_400Regular",
    color: "#1C1C1E",
  },
  inputWithIcon: {
    paddingRight: 48, // Clears room so typed characters never pass under the toggle icon
  },
  passwordIconButton: {
    position: "absolute",
    right: 0,
    height: 50,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  // Navigation & Inline Links
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 16,
    paddingVertical: 6,
  },
  linkText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 13,
    color: "#E5563D",
  },

  // Primary Buttons (Used in CustomButton)
  button: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5563D",
    marginTop: 16,
    elevation: 3,
    shadowColor: "#E5563D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    letterSpacing: -0.1,
  },

  // Feedback, Errors & Context Items
  errorText: {
    color: "#D64545",
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  verificationContainer: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  verificationText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#636366",
  },
  verifyNowHighlight: {
    fontFamily: "Lexend_600SemiBold",
    color: "#E5563D",
    textDecorationLine: "underline",
  },

  datePickerToggle: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FDF9F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F0E4DC",
  },
  datePickerText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    color: "#1C1C1E",
  },
  datePickerPlaceholderText: {
    color: "#C7C7CC",
  },

  // Interface Footer Links
  signupFooterClickable: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 10,
  },
  signupFooterText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#48484A",
  },
  signupFooterHighlight: {
    color: "#E5563D",
    fontFamily: "Lexend_600SemiBold",
  },
  // OTP Architectural Screens Styling Profiles
  otpHeaderStyle: {
    backgroundColor: "#FFFFFF",
  },
  otpContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  otpInnerView: {
    flex: 1,
    justifyContent: "center",
  },
  otpHeadingTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 26,
    color: "#1C1C1E",
    marginBottom: 8,
  },
  otpHeadingSubText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 15,
    color: "#636366",
    lineHeight: 22,
    marginBottom: 24,
  },
  otpEmailHighlight: {
    fontFamily: "Lexend_600SemiBold",
    color: "#1C1C1E",
  },
  otpTimerText: {
    textAlign: "center",
    marginBottom: 24,
    color: "#E5563D",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },
  otpInputsWrapperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    width: "100%",
  },
  otpSingleInputBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0E4DC",
    backgroundColor: "#FDF9F6",
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Lexend_600SemiBold",
    color: "#1C1C1E",
  },
  otpSingleInputBoxActive: {
    borderColor: "#E5563D",
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
  },
  otpResendClickable: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 10,
  },
  otpResendText: {
    textAlign: "center",
    color: "#E5563D",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },
  otpResendTextDisabled: {
    color: "#A2A2A7",
    fontFamily: "Lexend_400Regular",
  },
});

export default styles;
