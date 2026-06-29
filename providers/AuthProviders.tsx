import * as SecureStore from "expo-secure-store";

import { clearAccessToken, setAccessToken } from "@/services/api";

import { getProfile } from "@/services/auth.service";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

/* =========================
   TYPES
========================= */

export type AuthUser = {
  id?: string;
  email?: string;
  fullName?: string;

  // verification flags
  emailVerified: boolean;
  isOtpVerified: boolean;

  // onboarding
  cycleSetupCompleted: boolean;

  // raw backend passthrough
  [key: string]: any;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  authenticate: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* =========================
   NORMALIZER
========================= */

const normalizeUser = (raw: any): AuthUser => {
  if (!raw) {
    return {
      emailVerified: false,
      isOtpVerified: false,
      cycleSetupCompleted: false,
    };
  }

  return {
    ...raw,
    fullName:
      raw.fullName ??
      raw.name ??
      `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim(),
    emailVerified:
      raw.emailVerified ?? raw.isEmailVerified ?? raw.otpVerified ?? false,
    isOtpVerified: raw.isOtpVerified ?? raw.otpVerified ?? false,
    cycleSetupCompleted:
      raw.cycleSetupCompleted ?? raw.hasCompletedCycleSetup ?? false,
  };
};

/* =========================
   PROVIDER
========================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Restore session on app launch
   */
  const bootstrap = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      setUser(null);
      return;
    }

    const res = await getProfile();
    setUser(normalizeUser(res.data.data));
  } catch {
    await clearAccessToken();
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    bootstrap();
  }, []);

  /**
   * Called after login / OTP verification
   */
  const authenticate = async (token: string) => {
    // Save token to memory + SecureStore
    await setAccessToken(token);

    // Fetch user profile and normalize
    const res = await getProfile();
    setUser(normalizeUser(res.data.data));
  };

  /**
   * Logout
   */
  const logout = async () => {
    // Clear token from memory + SecureStore
    await clearAccessToken();
      await SecureStore.deleteItemAsync("SIGNUP_ACCESS_TOKEN");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};