import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as TrackingTransparency from 'expo-tracking-transparency';

import { useSettings } from '@/store/settings';
import { useLibrary } from '@/store/library';
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
  const settingsHydrated = useSettings((state) => state.hydrated);
  const libraryHydrated = useLibrary((state) => state.hydrated);
  const ageVerified = useSettings((state) => state.ageVerified);
  const onboarded = useSettings((state) => state.onboarded);
  const introDone = useSettings((state) => state.introDone);
  const { online, refetch } = useOnline();

  const needsAgeGate = features.ageGate && !ageVerified;
  const needsOnboarding = needsAgeGate ? ageVerified && !onboarded : !onboarded;
  const needsIntro = onboarded && !introDone;

  const hydrated = settingsHydrated && libraryHydrated;

  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.paper },
    animation: 'fade' as const,
  };

  // Initialize ads once stores are hydrated (mock in dev, AdMob test units when provider === 'admob').
  useEffect(() => {
    if (hydrated) {
      void initAds();
    }
  }, [hydrated]);

  // Connectivity gate: app is only usable once we know internet is reachable.
  if (!hydrated) {
    return null;
  }
  if (online === null) {
    return (
      <OnlineGate online={null} onRetry={refetch} />
    );
  }
  if (!online) {
    return (
      <OnlineGate online={false} onRetry={refetch} />
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
            {features.introPrimer ? <Stack.Screen name="primer" /> : null}
            {features.introHowToRead ? (
              <Stack.Screen name="how-to-read/[step]" />
            ) : null}
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
            <Stack.Screen
              name="privacy"
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
  const [trackingRequested, setTrackingRequested] = useState(false);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hide();
  }, [ready]);

  useEffect(() => {
    // Request ATT permission on iOS so ad networks can use the IDFA.
    // Android / Expo Go: no-op.
    if (!trackingRequested && Platform.OS === 'ios' && ready) {
      (async () => {
        try {
          await TrackingTransparency.requestTrackingPermissionsAsync();
        } catch {
          // user denied or not available — ads still work, just less targeted.
        }
        setTrackingRequested(true);
      })();
    }
  }, [ready, trackingRequested]);

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
