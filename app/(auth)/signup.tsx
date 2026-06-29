import { signUp } from "@/services/auth.service";
import { SignUpPayload } from "@/services/types";
import { setItem } from "@/utils/storage";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [uiError, setUiError] = useState("");

  // Input focus references for a smoother keyboard lifecycle flow
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleChange = (key: keyof SignupState, value: string) => {
    setUiError("");
    setSignupState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    const { firstName, lastName, phone, email, password, dob } = signupState;

    if (!firstName || !lastName || !phone || !email || !password || !dob) {
      setUiError("Please fill in all fields to create an account.");
      return;
    }

    try {
      setLoading(true);
      setUiError("");

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

      await setItem("SIGNUP_ACCESS_TOKEN", signupToken);

      router.replace({
        pathname: "/(auth)/otpscreen",
        params: { email: payload.email },
      });
    } catch (err: any) {
      setUiError(
        err?.response?.data?.message || "Signup failed. Please try again.",
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
            {/* HORIZONTAL NAME ROW */}
            <View style={localStyles.nameRow}>
              <View style={localStyles.flexColumn}>
                <CustomTextInput
                  label="First Name"
                  value={signupState.firstName}
                  onChangeText={(text) => handleChange("firstName", text)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
              </View>
              <View style={localStyles.flexColumn}>
                <CustomTextInput
                  label="Last Name"
                  value={signupState.lastName}
                  onChangeText={(text) => handleChange("lastName", text)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  // Make sure your CustomTextInput passes dynamic forwardRefs or handles explicit wrapper focus
                />
              </View>
            </View>

            <CustomTextInput
              label="Phone Number"
              keyboardType="phone-pad"
              placeholder="+234 801 234 5678"
              value={signupState.phone}
              onChangeText={(text) => handleChange("phone", text)}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <CustomTextInput
              label="Email Address"
              keyboardType="email-address"
              value={signupState.email}
              onChangeText={(text) => handleChange("email", text)}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <CustomTextInput
              label="Password"
              secureTextEntry
              value={signupState.password}
              onChangeText={(text) => handleChange("password", text)}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={() => setShowDatePicker(true)}
            />

            {/* Date Picker Component Form Layer */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <Pressable
                style={localStyles.datePickerToggleCustom}
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

          {/* Inline UI Error Pinout Notification */}
          {uiError ? (
            <View style={localStyles.errorAlertContainer}>
              <Ionicons name="alert-circle" size={16} color="#E5563D" />
              <Text style={localStyles.errorAlertText}>{uiError}</Text>
            </View>
          ) : null}

          {/* Form Actions */}
          <CustomButton
            title={loading ? "Creating account..." : "Create Account"}
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

const localStyles = StyleSheet.create({
  nameRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 4,
  },
  flexColumn: {
    flex: 1,
  },
  datePickerToggleCustom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  errorAlertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F4",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    gap: 6,
  },
  errorAlertText: {
    color: "#D97706",
    fontSize: 13,
    fontFamily: "Lexend_500Medium",
    flex: 1,
  },
});
