import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

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
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

/**
 * Get token (memory first, then SecureStore)
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (accessTokenMemory) return accessTokenMemory;

  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  accessTokenMemory = token;
  return token;
};

/**
 * CLEAR token from memory + SecureStore
 */
export const clearAccessToken = async () => {
  accessTokenMemory = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_URL,
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
        delete config.headers.Authorization;
      }
      return config;
    }

    const token = await getAccessToken();

    if (token && typeof token === "string" && token.length > 10) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
