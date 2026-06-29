import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry,
  placeholder,
  autoCapitalize = "sentences",
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, secureTextEntry && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry ? passwordHidden : false}
          placeholder={placeholder}
          placeholderTextColor="#C7C7CC"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          selectionColor="#E5563D"
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordIconButton}
            onPress={() => setPasswordHidden(!passwordHidden)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={passwordHidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInput;
