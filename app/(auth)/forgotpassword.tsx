import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Text, View } from "react-native";

import { resetPasswordRequest } from "@/services/auth.service";
import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomTextInput";
import styles from "./styles";

const ForgotPasswordEmailScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendReset = async () => {
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      // Call backend to initiate password reset
      const res = await resetPasswordRequest(email.trim().toLowerCase());
      // Store temporary reset token for change-password
      const resetToken = res.data?.data?.accessToken;
      if (!resetToken) throw new Error("Could not get reset token");

      await SecureStore.setItemAsync("RESET_ACCESS_TOKEN", resetToken);

      // Navigate to change password screen
      router.push("/(auth)/forgotpassword-newpas");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to request password reset"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Stack.Screen
            options={{
                            headerShown: true,
    
              title: "forgot password",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: "#FFF",
              },
              headerTitleStyle: {
                fontFamily: "Lexend_600SemiBold",
              },
            }}
          />
           <View style={styles.screenContent}>
      <Text style={styles.subheader}>Forgot Password</Text>
      <Text style={styles.infoText}>
        Enter your email to reset your Cyclewise password.
      </Text>

      <CustomTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <CustomButton
        title="Send Reset Link"
        onPress={handleSendReset}
        loading={loading}
      />
    </View>
    </>
   
  );
};

export default ForgotPasswordEmailScreen;
