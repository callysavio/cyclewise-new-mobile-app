import { useAuth } from "@/providers/AuthProviders";
import { setAccessToken } from "@/services/api";
import { resendOtp, verifyOtp } from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CustomButton from "./CustomButton";
import styles from "./styles";

const OTP_LENGTH = 6;
const OTP_EXPIRY = 15 * 60;

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { authenticate } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_EXPIRY);
  const [resending, setResending] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  /* ===============================
      TIMER
  =============================== */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /* ===============================
      OTP INPUT LOGIC
  =============================== */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updated.every((d) => d !== "")) {
      submitOtp(updated.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ===============================
      VERIFY OTP
  =============================== */
  const submitOtp = async (code: string) => {
    try {
      setLoading(true);
      const res = await verifyOtp(code);
      const finalAccessToken = res.data?.data?.accessToken;

      if (!finalAccessToken) throw new Error("OTP verification failed");

      await SecureStore.deleteItemAsync("SIGNUP_ACCESS_TOKEN");
      await setAccessToken(finalAccessToken);
      await authenticate(finalAccessToken);

      router.replace("/cycle-setup/last-period");
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        err?.response?.data?.message || "Invalid OTP",
      );

      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      RESEND OTP
  =============================== */
  const handleResendOtp = async () => {
    try {
      setResending(true);
      const res = await resendOtp(email);
      const newToken = res.data?.data?.accessToken;

      if (!newToken) throw new Error("Failed to get new token");

      await SecureStore.setItemAsync("SIGNUP_ACCESS_TOKEN", newToken);
      setTimer(OTP_EXPIRY);

      Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to resend OTP",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerStyle: styles.otpHeaderStyle,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.otpContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.otpInnerView}>
          <Text style={styles.otpHeadingTitle}>Enter OTP</Text>
          <Text style={styles.otpHeadingSubText}>
            Enter the 6-digit code sent to{"\n"}
            <Text style={styles.otpEmailHighlight}>{email}</Text>
          </Text>

          <Text style={styles.otpTimerText}>
            Code expires in {formatTime()}
          </Text>

          {/* OTP INPUTS BLOCK */}
          <View style={styles.otpInputsWrapperRow}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={otp[index]}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={index === 0}
                style={[
                  styles.otpSingleInputBox,
                  focusedIndex === index && styles.otpSingleInputBoxActive,
                ]}
                selectionColor="#E5563D"
              />
            ))}
          </View>

          {/* VERIFY ACTION BUTTON */}
          <CustomButton
            title="Verify"
            onPress={() => submitOtp(otp.join(""))}
            loading={loading}
          />

          {/* RESEND LINK CONTROL */}
          <TouchableOpacity
            disabled={timer > 0 || resending}
            onPress={handleResendOtp}
            style={styles.otpResendClickable}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.otpResendText,
                timer > 0 && styles.otpResendTextDisabled,
              ]}
            >
              {resending
                ? "Resending..."
                : timer > 0
                  ? "Resend OTP when timer ends"
                  : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
