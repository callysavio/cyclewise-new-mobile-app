import { AuthProvider, useAuth } from "@/providers/AuthProviders";
import { CycleProvider } from "@/providers/CycleContext";
import { CycleSetupProvider } from "@/providers/CycleSetupContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

/* ---------------- FONTS ---------------- */

import {
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";

/* ---------------- SPLASH ---------------- */

SplashScreen.preventAutoHideAsync().catch(() => {});

/* =====================================================
   ROOT NAVIGATOR
===================================================== */

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // ❌ NOT LOGGED IN → AUTH FLOW ONLY
  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  // ✅ LOGGED IN → ALWAYS ENTER APP (HOME = DEFAULT ENTRY)
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#FAFAFA" },
      }}
    >
      {/* MAIN APP SHELL (HOME/TABS ALWAYS FIRST) */}
      <Stack.Screen name="(tabs)" />

      {/* MODALS / SECONDARY SCREENS */}
      <Stack.Screen name="log-symptoms" />
      <Stack.Screen name="cycle-history" />
      <Stack.Screen name="edit-cycle" />
    </Stack>
  );
}

/* =====================================================
   ROOT LAYOUT
===================================================== */

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!appReady) return null;

  return (
    <AuthProvider>
      <CycleProvider>
        <CycleSetupProvider>
          <SafeAreaProvider>
            <RootNavigator />
            <StatusBar style="dark" />
          </SafeAreaProvider>
        </CycleSetupProvider>
      </CycleProvider>
    </AuthProvider>
  );
}