import * as Device from "expo-device";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/providers/AuthProviders";
import { clearAccessToken } from "@/services/api";
import { login } from "@/services/auth.service";
import { LoginPayload } from "@/services/types";
import { Ionicons } from "@expo/vector-icons";

import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomTextInput";
import styles from "./styles";

/* =======================
   TYPES
======================= */
interface LoginState {
  email: string;
  password: string;
}

/* =======================
   SCREEN
======================= */
export default function LoginScreen() {
  const { authenticate } = useAuth();

  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState("");
  const [emailVerificationRequired, setEmailVerificationRequired] =
    useState(false);

  // Focus pointer for keyboard traversal tracking
  const passwordInputRef = useRef<TextInput>(null);

  const handleInputChange = (key: keyof LoginState, value: string) => {
    setUiError(""); // Clear layout errors immediately as the user writes
    setState((prev) => ({ ...prev, [key]: value }));
  };

  /* =======================
     HANDLER
  ======================= */
  const handleLogin = async () => {
    if (loading) return;

    if (!state.email.trim() || !state.password) {
      setUiError("Please enter both your email address and password.");
      return;
    }

    try {
      setLoading(true);
      setUiError("");
      setEmailVerificationRequired(false);

      await clearAccessToken();

      const payload: LoginPayload = {
        email: state.email.trim().toLowerCase(),
        password: state.password,
        deviceName: Device.modelName ?? "Unknown Device",
        deviceType: "smartphone",
      };

      const res = await login(payload);
      const accessToken = res.data?.data?.accessToken || res.data?.accessToken;

      if (!accessToken) {
        console.log("LOGIN ERROR: Token missing", res.data);
        setUiError(
          "An authentication parsing error occurred. Please try again.",
        );
        return;
      }

      await authenticate(accessToken);
      router.replace("/");
    } catch (err: any) {
      // Differentiate between explicit credentials failures and Render backend sleeping warmups
      const message = err?.response
        ? err.response.data?.message || "Invalid email or password."
        : "Network error: Server is warming up. Please try again in a moment.";

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("email verification required")
      ) {
        setEmailVerificationRequired(true);
        setUiError("");
        return;
      }

      setUiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    router.push({
      pathname: "/otpscreen",
      params: { email: state.email.trim().toLowerCase() },
    });
  };

  /* =======================
     UI
  ======================= */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.innerContainer}>
          {/* Brand/Header Section */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandLogo}>CycleWise</Text>
            <Text style={styles.brandTagline}>
              Your cycle. Your rhythm. Your care.
            </Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.header}>Welcome back 🌸</Text>
            <Text style={styles.subheader}>
              Log in to continue your wellness journey
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <CustomTextInput
              label="Email address"
              value={state.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <CustomTextInput
              label="Password"
              value={state.password}
              onChangeText={(text) => handleInputChange("password", text)}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {/* Contextual Placement: Forgot Password directly links to input field context */}
            <TouchableOpacity
              onPress={() => router.push("/forgotpassword")}
              style={styles.forgotPasswordLink}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* Structured Visual Error Banner Block */}
          {uiError ? (
            <View style={localStyles.errorAlertContainer}>
              <Ionicons name="alert-circle" size={16} color="#E5563D" />
              <Text style={localStyles.errorAlertText}>{uiError}</Text>
            </View>
          ) : null}

          {/* Verification Warning Interventions */}
          {emailVerificationRequired && (
            <TouchableOpacity
              onPress={handleVerifyOtp}
              style={localStyles.verificationInlineCard}
              activeOpacity={0.8}
            >
              <Ionicons name="mail-unread-outline" size={18} color="#E5563D" />
              <Text style={localStyles.verificationCardText}>
                Email not verified yet.{" "}
                <Text style={localStyles.verifyHighlight}>Verify now</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Action Callouts */}
          <CustomButton
            title={loading ? "Logging in..." : "Log in"}
            onPress={handleLogin}
            loading={loading}
          />

          {/* Account Creation Footer */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            style={styles.signupFooterClickable}
            activeOpacity={0.7}
          >
            <Text style={styles.signupFooterText}>
              New to CycleWise?{" "}
              <Text style={styles.signupFooterHighlight}>
                Create an account
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* =======================
   LOCAL UX STYLES
======================= */
const localStyles = StyleSheet.create({
  errorAlertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F4",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    gap: 8,
  },
  errorAlertText: {
    color: "#E5563D",
    fontSize: 13,
    fontFamily: "Lexend_500Medium",
    flex: 1,
  },
  verificationInlineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    gap: 8,
  },
  verificationCardText: {
    color: "#D97706",
    fontSize: 13,
    fontFamily: "Lexend_500Medium",
    flex: 1,
  },
  verifyHighlight: {
    fontFamily: "Lexend_600SemiBold",
    textDecorationLine: "underline",
  },
});
