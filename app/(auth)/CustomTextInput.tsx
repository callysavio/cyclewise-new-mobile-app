import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps, // 1. Import the native props type
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

// 2. Extend TextInputProps so all standard input properties are supported
interface CustomTextInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
  placeholderTextColor = "#C7C7CC",
  selectionColor = "#E5563D",
  ...restProps // 3. Gather all other forwarded native props (returnKeyType, onSubmitEditing, etc.)
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
          placeholderTextColor={placeholderTextColor}
          selectionColor={selectionColor}
          {...restProps} // 4. Spread them cleanly onto the actual TextInput element
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
