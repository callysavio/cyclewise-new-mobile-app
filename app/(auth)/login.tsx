import * as Device from "expo-device";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/providers/AuthProviders";
import { clearAccessToken } from "@/services/api";
import { login } from "@/services/auth.service";
import { LoginPayload } from "@/services/types";

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
  const [error, setError] = useState("");
  const [emailVerificationRequired, setEmailVerificationRequired] =
    useState(false);

  /* =======================
     HANDLER
  ======================= */
  const handleLogin = async () => {
    if (loading) return;

    if (!state.email || !state.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
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
        setError("Something went wrong while logging in. Please try again.");
        return;
      }

      await authenticate(accessToken);
      router.replace("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid email or password";

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("email verification required")
      ) {
        setEmailVerificationRequired(true);
        setError("");
        return;
      }

      setError(message);
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
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
            />

            <CustomTextInput
              label="Password"
              value={state.password}
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
            />

            {/* Contextual Placement: Forgot Password directly links to input field context */}
            <TouchableOpacity
              onPress={() => router.push("/forgotpassword")}
              style={styles.forgotPasswordLink}
            >
              <Text style={styles.linkText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message Pinout */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Action Callouts */}
          <CustomButton
            title={loading ? "Logging in..." : "Log in"}
            onPress={handleLogin}
            loading={loading}
          />

          {/* Verification Warning Interventions */}
          {emailVerificationRequired && (
            <TouchableOpacity
              onPress={handleVerifyOtp}
              style={styles.verificationContainer}
            >
              <Text style={styles.verificationText}>
                Email not verified?{" "}
                <Text style={styles.verifyNowHighlight}>Verify now</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Account Creation Footer */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            style={styles.signupFooterClickable}
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