import { router } from "expo-router";
import { getItem, removeItem } from "@/utils/storage";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import api from "@/services/api"; // We'll call change-password with stored token
import styles from "./styles";

const ForgotPasswordNewPasswordScreen: React.FC = () => {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSetNewPassword = async () => {
    setError("");
    if (!newPass || !confirmPass) {
      setError("Please fill both fields.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // Get temporary token
      const token = await getItem("RESET_ACCESS_TOKEN");
      if (!token) throw new Error("Session expired. Please try again.");

      // Call backend
      await api.post(
        "/auth/change-password",
        { password: newPass },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove temp token
      await removeItem("RESET_ACCESS_TOKEN");

      alert("Password reset successfully!");
      router.replace("/(auth)/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContent}>
      <Text style={styles.subheader}>Set New Password</Text>
      <Text style={styles.infoText}>
        Please choose a strong new password for your Cyclewise account.
      </Text>

      <TextInput
        style={styles.input}
        value={newPass}
        onChangeText={setNewPass}
        placeholder="New Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPass}
        onChangeText={setConfirmPass}
        placeholder="Confirm New Password"
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleSetNewPassword}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Set Password & Log In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordNewPasswordScreen;
