import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { SESSION_STORAGE_KEY } from '@/constants/api';
import { AuthSession } from '@/types/api';

async function getStoredValue(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  }

  return SecureStore.getItemAsync(SESSION_STORAGE_KEY);
}

async function setStoredValue(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(SESSION_STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, value);
}

export async function getSession(): Promise<AuthSession | null> {
  const value = await getStoredValue();
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    await clearSession();
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  await setStoredValue(JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}
