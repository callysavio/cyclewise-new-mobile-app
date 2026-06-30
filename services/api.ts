import axios, { InternalAxiosRequestConfig } from "axios";
import { getItem, setItem, removeItem } from "@/utils/storage";

const API_URL = "https://cyclewise-backend.onrender.com/api/v1";

const TOKEN_KEY = "accessToken";

/**
 * Memory cache
 */
let accessTokenMemory: string | null = null;

/**
 * Save token to memory + SecureStore
 */
export const setAccessToken = async (token: string) => {
  accessTokenMemory = token;
  await setItem(TOKEN_KEY, token);
};

/**
 * Get token (memory first, then SecureStore)
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (accessTokenMemory) return accessTokenMemory;

  const token = await getItem(TOKEN_KEY);
  accessTokenMemory = token;
  return token;
};

/**
 * CLEAR token from memory + SecureStore
 */
export const clearAccessToken = async () => {
  accessTokenMemory = null;
  await removeItem(TOKEN_KEY);
};

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 45000, // 45 seconds (Render sleep wake-up tolerance)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    config.headers = config.headers || {};

    const callerProvidedAuth = !!config.headers.Authorization;

    if (config.skipAuth) {
      // Only strip if the caller didn't explicitly set one for this request
      if (!callerProvidedAuth) {
        if (config.headers.delete) {
          config.headers.delete("Authorization");
        } else {
          delete config.headers.Authorization;
        }
      }
      return config;
    }

    // Respect explicit bearer tokens supplied by specialized flows such as
    // password reset or OTP verification.
    if (callerProvidedAuth) {
      return config;
    }

    const token = await getAccessToken();

    if (token && typeof token === "string" && token.length > 10) {
      if (config.headers.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      if (config.headers.delete) {
        config.headers.delete("Authorization");
      } else {
        delete config.headers.Authorization;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
