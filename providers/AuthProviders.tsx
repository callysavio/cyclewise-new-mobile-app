import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/services/api"; // Added getAccessToken & setAccessToken
import { getProfile } from "@/services/auth.service";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type AuthUser = {
  id?: string;
  email?: string;
  fullName?: string;
  emailVerified: boolean;
  isOtpVerified: boolean;
  cycleSetupCompleted: boolean;
  [key: string]: any;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  authenticate: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Restore session on app launch
   */
  const bootstrap = async () => {
    try {
      // FIX: Use your native API utility wrapper to restore memory state
      const token = await getAccessToken();

      if (!token) {
        setUser(null);
        return;
      }

      const res = await getProfile();
      setUser(normalizeUser(res.data.data));
    } catch (error) {
      console.log("Bootstrap restoration failed:", error);
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
   * Called after login / OTP verification completed successfully
   */
  const authenticate = async (token: string) => {
    // Save token to memory + SecureStore
    await setAccessToken(token);

    // Fetch user profile and normalize
    const res = await getProfile();
    setUser(normalizeUser(res.data.data));
  };

  /**
   * Logout cleanup block
   */
  const logout = async () => {
    await clearAccessToken();
    await SecureStore.deleteItemAsync("SIGNUP_ACCESS_TOKEN");
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
