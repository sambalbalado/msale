import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { darkPalette, lightPalette } from '@/constants/theme';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/providers/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2, refetchOnWindowFocus: true },
    mutations: { retry: 0 },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = AppState.addEventListener('change', (status) => focusManager.setFocused(status === 'active'));
    return () => subscription.remove();
  }, []);

  const navigationTheme = colorScheme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: darkPalette.background, card: darkPalette.surface, text: darkPalette.text, border: darkPalette.line, primary: darkPalette.brand } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: lightPalette.background, card: lightPalette.surface, text: lightPalette.text, border: lightPalette.line, primary: lightPalette.brand } };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <AuthProvider>
              <ThemeProvider value={navigationTheme}>
                <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="listing/[id]" />
                  <Stack.Screen name="chat/[id]" />
                  <Stack.Screen name="auth/index" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                  <Stack.Screen name="language" options={{ presentation: 'formSheet', sheetGrabberVisible: true }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              </ThemeProvider>
            </AuthProvider>
          </I18nProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
