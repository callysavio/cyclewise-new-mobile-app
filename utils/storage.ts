import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "accessToken";

/**
 * Save item (SecureStore with AsyncStorage fallback)
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    const isAvailable = await SecureStore.isAvailableAsync();
    if (isAvailable) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`SecureStore.setItem failed for key ${key}, falling back to AsyncStorage`, error);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (fallbackError) {
      console.error(`AsyncStorage fallback failed for key ${key}`, fallbackError);
    }
  }
};

/**
 * Get item (SecureStore with AsyncStorage fallback)
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    const isAvailable = await SecureStore.isAvailableAsync();
    if (isAvailable) {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error(`SecureStore.getItem failed for key ${key}, falling back to AsyncStorage`, error);
    try {
      return await AsyncStorage.getItem(key);
    } catch (fallbackError) {
      console.error(`AsyncStorage fallback failed for key ${key}`, fallbackError);
      return null;
    }
  }
};

/**
 * Remove item (SecureStore with AsyncStorage fallback)
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    const isAvailable = await SecureStore.isAvailableAsync();
    if (isAvailable) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`SecureStore.deleteItem failed for key ${key}, falling back to AsyncStorage`, error);
    try {
      await AsyncStorage.removeItem(key);
    } catch (fallbackError) {
      console.error(`AsyncStorage fallback failed for key ${key}`, fallbackError);
    }
  }
};

/**
 * Save token (legacy wrapper)
 */
export const saveToken = async (token: string) => {
  await setItem(TOKEN_KEY, token);
};

/**
 * Get token (legacy wrapper)
 */
export const getToken = async (): Promise<string | null> => {
  return await getItem(TOKEN_KEY);
};

/**
 * Remove token (legacy wrapper)
 */
export const removeToken = async () => {
  await removeItem(TOKEN_KEY);
};