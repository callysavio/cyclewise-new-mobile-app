import { LoginPayload, SignUpPayload } from "@/services/types";
import { getItem } from "@/utils/storage";
import api from "./api";

/* ======================= PUBLIC ROUTES ======================= */
export const signUp = (payload: SignUpPayload) =>
  api.post("/auth/signup", payload, { skipAuth: true });

export const verifyOtp = async (otp: string) => {
  const signupToken = await getItem("SIGNUP_ACCESS_TOKEN");
  if (!signupToken) throw new Error("Signup token missing. Please sign up again.");

  return api.post(
    "/auth/verify-otp",
    { otp: Number(otp) },
    {
      skipAuth: true,
      headers: { Authorization: `Bearer ${signupToken}` },
    }
  );
};

export const resendOtp = (email: string) =>
  api.post("/auth/resend-otp", { email }, { skipAuth: true });

export const login = (payload: LoginPayload) =>
  api.post("/auth/login", payload, { skipAuth: true });

export const resetPasswordRequest = (email: string) =>
  api.post("/auth/reset-password", { email }, { skipAuth: true });

export const googleAuth = (token: string) =>
  api.post("/auth/google-auth", { token }, { skipAuth: true });

export const biometricLogin = (payload: { deviceId: string; signature: string }) =>
  api.post("/auth/login/with/biometry", payload, { skipAuth: true });

/* Protected Routes */
export const changePassword = (payload: { oldPassword: string; newPassword: string }) =>
  api.post("/auth/change-password", payload);

export const registerBiometry = (payload: { deviceId: string; publicKey: string }) =>
  api.post("/auth/biometry/registration", payload);

export const getProfile = () => api.get("/users/me");