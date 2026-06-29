/* =========================
   GENERIC API RESPONSE
   Backend format:
   {
     success: boolean;
     message: string;
     data: T;
   }
   ========================= */

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* =========================
   USER TYPE
   Must match backend /users/me
   ========================= */

export type User = {
  id: string;

  email: string;
  fullName: string;
  phone?: string;

  gender: "MALE" | "FEMALE";

  role: "USER" | "ADMIN";

  dob: string;

  emailVerified: boolean;

  isOtpVerified: boolean;

  cycleSetupCompleted: boolean;

  createdAt: string;
  updatedAt: string;
};

/* =========================
   AUTH RESPONSE
   Backend format:
   {
     accessToken,
     refreshToken?,
     user
   }
   ========================= */

export type AuthResponse = {
  accessToken: string;

  refreshToken?: string;

  user: User;
};

/* =========================
   PROFILE RESPONSE
   ========================= */

export type UserProfileResponse = User;

/* =========================
   SIGNUP PAYLOAD
   ========================= */

export type SignUpPayload = {
  deviceName: string;

  deviceType: string;

  email: string;

  password: string;

  fullName: string;

  phone: string;

  gender: "MALE" | "FEMALE";

  role: "USER" | "ADMIN";

  dob: string;
};

/* =========================
   LOGIN PAYLOAD
   ========================= */

export type LoginPayload = {
  email: string;

  password: string;

  deviceName: string;

  deviceType: "smartphone" | "tablet" | "web";
};

/* =========================
   OTP VERIFY RESPONSE
   ========================= */

export type VerifyOtpResponse = AuthResponse;

/* =========================
   PASSWORD RESET
   ========================= */

export type ResetPasswordPayload = {
  email: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
