import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useLibrary } from '@/store/library';
import { useSettings } from '@/store/settings';
import { fontAssets } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 500, fade: true });

function RootNavigator() {
  const { colors, scheme } = useTheme();
  const settingsHydrated = useSettings((state) => state.hydrated);
  const libraryHydrated = useLibrary((state) => state.hydrated);
  const ageVerified = useSettings((state) => state.ageVerified);
  const onboarded = useSettings((state) => state.onboarded);

  const hydrated = settingsHydrated && libraryHydrated;

  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.paper },
    animation: 'fade' as const,
  };

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {!hydrated ? (
        <View style={{ flex: 1, backgroundColor: colors.paper }} />
      ) : (
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="index" />

          <Stack.Protected guard={!ageVerified}>
            <Stack.Screen name="age" />
          </Stack.Protected>

          <Stack.Protected guard={ageVerified && !onboarded}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={ageVerified && onboarded}>
            <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
            <Stack.Screen
              name="plate/[slug]"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="guide/[slug]"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="collection/[slug]"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="search" options={{ presentation: 'modal', animation: 'fade' }} />
            <Stack.Screen
              name="settings"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </Stack.Protected>
        </Stack>
      )}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const ready = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hide();
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
