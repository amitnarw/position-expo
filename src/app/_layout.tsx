import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSettings } from '@/store/settings';
import { fontAssets } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { features } from '@/config/features';
import { OnlineGate } from '@/net/OnlineGate';
import { useOnline } from '@/net/useOnline';
import { InterstitialHost } from '@/components/ads/InterstitialHost';
import { initAds } from '@/ads/adManager';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 500, fade: true });

function RootNavigator() {
  const { colors, scheme } = useTheme();
  const ageVerified = useSettings((state) => state.ageVerified);
  const onboarded = useSettings((state) => state.onboarded);
  const introDone = useSettings((state) => state.introDone);
  const online = useOnline();

  const needsAgeGate = features.ageGate && !ageVerified;
  const needsOnboarding = needsAgeGate ? ageVerified && !onboarded : !onboarded;
  const needsIntro = onboarded && !introDone;

  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.paper },
    animation: 'fade' as const,
  };

  // Initialize ads (mock in dev, AdMob test units when provider === 'admob').
  // Safe to call on every render — initAds() guards against double init.
  void initAds();

  // Connectivity gate: app is only usable once we know internet is reachable.
  if (online === null) {
    return (
      <OnlineGate online={null} onRetry={() => {}} />
    );
  }
  if (!online) {
    return (
      <OnlineGate online={false} onRetry={() => {}} />
    );
  }

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <InterstitialHost>
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="index" />

          {needsAgeGate ? (
            <Stack.Protected guard={true}>
              <Stack.Screen name="age" />
            </Stack.Protected>
          ) : null}

          <Stack.Protected guard={needsOnboarding}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={needsIntro}>
            <Stack.Screen name="primer" />
            <Stack.Screen name="how-to-read/[step]" />
          </Stack.Protected>

          <Stack.Protected guard={onboarded && introDone}>
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
      </InterstitialHost>
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
