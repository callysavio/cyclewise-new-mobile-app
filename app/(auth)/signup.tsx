import { signUp } from "@/services/auth.service";
import { SignUpPayload } from "@/services/types";
import * as SecureStore from "expo-secure-store";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomTextInput";
import styles from "./styles";

interface SignupState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  dob: string;
}

export default function SignupScreen() {
  const [signupState, setSignupState] = useState<SignupState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof SignupState, value: string) => {
    setSignupState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    const { firstName, lastName, phone, email, password, dob } = signupState;

    if (!firstName || !lastName || !phone || !email || !password || !dob) {
      Alert.alert("Missing fields", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload: SignUpPayload = {
        deviceName: Device.modelName ?? "Unknown Device",
        deviceType: "smartphone",
        email: email.trim().toLowerCase(),
        password,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        phone,
        gender: "FEMALE",
        role: "USER",
        dob,
      };

      const res = await signUp(payload);
      const signupToken = res.data?.data?.accessToken;

      if (!signupToken) {
        throw new Error("Signup token missing from response");
      }

      await SecureStore.setItemAsync("SIGNUP_ACCESS_TOKEN", signupToken);

      router.replace({
        pathname: "/(auth)/otpscreen",
        params: { email: payload.email },
      });
    } catch (err: any) {
      Alert.alert(
        "Signup Error",
        err?.response?.data?.message || "Signup failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.innerContainer}>
          {/* Header/Greeting Display */}
          <View style={styles.signupWelcomeContainer}>
            <Text style={styles.brandTaglineSignup}>
              Welcome to CycleWise! Sign up to get started right away.
            </Text>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subheader}>Let’s get to know you</Text>
          </View>

          {/* Core Input Stack */}
          <View style={styles.formContainer}>
            <CustomTextInput
              label="First Name"
              value={signupState.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
              autoCapitalize="words"
            />

            <CustomTextInput
              label="Last Name"
              value={signupState.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              autoCapitalize="words"
            />

            <CustomTextInput
              label="Phone Number"
              keyboardType="phone-pad"
              placeholder="+234 801 234 5678"
              value={signupState.phone}
              onChangeText={(text) => handleChange("phone", text)}
            />

            <CustomTextInput
              label="Email Address"
              keyboardType="email-address"
              value={signupState.email}
              onChangeText={(text) => handleChange("email", text)}
              autoCapitalize="none"
            />

            <CustomTextInput
              label="Password"
              secureTextEntry
              value={signupState.password}
              onChangeText={(text) => handleChange("password", text)}
              autoCapitalize="none"
            />

            {/* Date Picker Component Form Layer */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <Pressable
                style={styles.datePickerToggle}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.datePickerText,
                    !signupState.dob && styles.datePickerPlaceholderText,
                  ]}
                >
                  {signupState.dob
                    ? new Date(signupState.dob).toDateString()
                    : "Select your date of birth"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#E5563D" />
              </Pressable>
            </View>
          </View>

          {/* Conditional Datepicker Sheet Render */}
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={new Date(signupState.dob || "2000-01-01")}
              maximumDate={new Date()}
              onChange={(_, selected) => {
                setShowDatePicker(false);
                if (selected) {
                  handleChange("dob", selected.toISOString());
                }
              }}
            />
          )}

          {/* Form Actions */}
          <CustomButton
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.signupFooterClickable}
          >
            <Text style={styles.signupFooterText}>
              Already have an account?{" "}
              <Text style={styles.signupFooterHighlight}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}