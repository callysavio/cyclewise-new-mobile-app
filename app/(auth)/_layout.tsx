import { useAuth } from "@/providers/AuthProviders";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootNavigationLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Determine if the user is currently inside an authentication path block
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Restrict access and redirect unauthenticated traffic back to login route
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Block logged-in users from seeing input forms again
      router.replace("/");
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E5563D" />
      </View>
    );
  }

  return <Slot />;
}
