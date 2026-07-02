import { getItem, removeItem, setItem } from "@/utils/storage";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Constants from "expo-constants";

/* =========================
   BASE URL
   — __DEV__ is React Native's built-in flag:
     true  → expo start (local dev)
     false → any eas build (preview / production)
========================= */
const DEV_URL = "http://10.201.165.43:3000/api/v1";
const PROD_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  "https://cyclewise-backend.onrender.com/api/v1";

const API_URL = __DEV__ ? DEV_URL : PROD_URL;

/* =========================
   TOKEN MANAGEMENT
========================= */
const TOKEN_KEY = "accessToken";
let accessTokenMemory: string | null = null;

export const setAccessToken = async (token: string): Promise<void> => {
  accessTokenMemory = token;
  await setItem(TOKEN_KEY, token);
};

export const getAccessToken = async (): Promise<string | null> => {
  if (accessTokenMemory) return accessTokenMemory;
  const token = await getItem(TOKEN_KEY);
  accessTokenMemory = token;
  return token;
};

export const clearAccessToken = async (): Promise<void> => {
  accessTokenMemory = null;
  await removeItem(TOKEN_KEY);
};

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_URL,
  timeout: 45000, // 45s — covers Render cold-start wake-up time
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    config.headers = config.headers ?? {};

    const callerProvidedAuth = !!config.headers.Authorization;

    // skipAuth — caller explicitly opted out of automatic token attachment
    // (e.g. login, signup, OTP verify with its own token)
    if (config.skipAuth) {
      if (!callerProvidedAuth) {
        delete config.headers.Authorization;
      }
      return config;
    }

    // If caller already set an Authorization header (e.g. OTP/reset flows),
    // respect it and don't overwrite with the stored token
    if (callerProvidedAuth) {
      return config;
    }

    // Default: attach stored access token
    const token = await getAccessToken();

    if (token && token.length > 10) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================
   RESPONSE INTERCEPTOR
   Centralizes error handling so individual service functions
   don't all need to duplicate the same error-unwrapping logic.
========================= */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Token expired or invalid — clear stored token so the next
    // request doesn't keep sending a bad token
    if (status === 401) {
      await clearAccessToken();
      accessTokenMemory = null;
    }

    // Re-throw with a clean, readable message attached so catch blocks
    // in service files can just use err.message directly
    const readableMessage =
      typeof message === "string"
        ? message
        : (error.message ?? "An unexpected error occurred");

    return Promise.reject(new Error(readableMessage));
  },
);

export default api;
