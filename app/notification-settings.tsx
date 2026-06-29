import { ScrollView, StyleSheet, Text } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.text}>
        This app respects your privacy. Your data remains confidential and is not shared with third parties.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  text: { color: "#555", lineHeight: 22 },
});
