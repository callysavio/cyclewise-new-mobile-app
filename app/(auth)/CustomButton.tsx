import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import styles from "./styles";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
  style?: ViewStyle; // Added flexibility for subtle custom container adjustments if necessary
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
}) => {
  const isInteractionDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isInteractionDisabled && {
          opacity: 0.5,
          elevation: 0,
          shadowOpacity: 0,
        },
      ]}
      disabled={isInteractionDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
