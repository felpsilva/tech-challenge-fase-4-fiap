import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

const THEME_STORAGE_KEY = 'blog-educacional:theme';

export type ResolvedThemeMode = 'light' | 'dark';
export type ThemeMode = ResolvedThemeMode | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

async function readStoredThemeMode(): Promise<ThemeMode> {
  if (Platform.OS === 'web') {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      return isThemeMode(stored) ? stored : 'system';
    } catch {
      return 'system';
    }
  }

  try {
    const stored = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function writeStoredThemeMode(mode: ThemeMode): void {
  if (Platform.OS === 'web') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // O tema continua funcionando durante a sessão mesmo sem persistência.
    }
    return;
  }

  void SecureStore.setItemAsync(THEME_STORAGE_KEY, mode).catch(() => {
    // O tema continua funcionando durante a sessão mesmo sem persistência.
  });
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const systemMode: ResolvedThemeMode = systemScheme === 'dark' ? 'dark' : 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    let active = true;
    void readStoredThemeMode().then((storedMode) => {
      if (active) setModeState(storedMode);
    });

    return () => {
      active = false;
    };
  }, []);

  const resolvedMode = mode === 'system' ? systemMode : mode;

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    writeStoredThemeMode(nextMode);
  }, []);

  const toggle = useCallback(() => {
    setMode(resolvedMode === 'dark' ? 'light' : 'dark');
  }, [resolvedMode, setMode]);

  const value = useMemo(
    () => ({ mode, resolvedMode, setMode, toggle }),
    [mode, resolvedMode, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode precisa estar dentro de ThemeModeProvider');
  }

  return context;
}
