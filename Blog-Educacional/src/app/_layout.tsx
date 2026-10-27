import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/context/auth-context';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemeModeProvider, useThemeMode } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <ThemedRootLayout />
    </ThemeModeProvider>
  );
}

function ThemedRootLayout() {
  const { resolvedMode } = useThemeMode();
  const backgroundColor = resolvedMode === 'dark' ? '#0d1117' : '#FFFFFF';

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(backgroundColor);

    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = backgroundColor;
    }
  }, [backgroundColor]);

  return (
    <ThemeProvider value={resolvedMode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar
        style={resolvedMode === 'dark' ? 'light' : 'dark'}
      />
      <AuthProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
