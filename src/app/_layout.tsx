import '../global.css';

import { useFonts } from 'expo-font';
import {
  CardStyleInterpolators,
  Stack,
} from 'expo-router/js-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Easing, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as TrackingTransparency from 'expo-tracking-transparency';

import { useSettings } from '@/store/settings';
import { useLibrary } from '@/store/library';
import { duration } from '@/theme/scale';
import { fontAssets } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { InterstitialHost } from '@/components/ads/InterstitialHost';
import { initAds } from '@/ads/adManager';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 220, fade: true });

/**
 * Screens leave faster than they arrive: 300 ms in, 160 ms out. The JS stack
 * is used instead of the native one because it is the only stack that lets
 * `open` and `close` keep separate durations.
 */
const slideIn = {
  animation: 'timing' as const,
  config: { duration: duration.enter, easing: Easing.bezier(0.16, 1, 0.3, 1) },
};

const slideOut = {
  animation: 'timing' as const,
  config: { duration: duration.exit, easing: Easing.bezier(0.4, 0, 1, 1) },
};

function RootNavigator() {
  const { colors, scheme } = useTheme();

  useEffect(() => {
    void initAds();
  }, []);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <InterstitialHost>
        <Stack
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.paper },
            cardShadowEnabled: false,
            cardOverlayEnabled: false,
            detachPreviousScreen: false,
            gestureEnabled: Platform.OS === 'ios',
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: { open: slideIn, close: slideOut },
          }}>
          <Stack.Screen
            name="index"
            options={{
              animation: 'none',
              cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }}
          />
          <Stack.Screen
            name="get-in"
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            }}
          />
          <Stack.Screen
            name="plate/[slug]"
            options={{
              presentation: 'modal',
              detachPreviousScreen: false,
              gestureDirection: 'vertical',
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
          />
          <Stack.Screen
            name="guide/[slug]"
            options={{
              detachPreviousScreen: false,
            }}
          />
          <Stack.Screen
            name="favorites"
            options={{
              detachPreviousScreen: false,
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              detachPreviousScreen: false,
            }}
          />
          <Stack.Screen name="privacy" />
        </Stack>
      </InterstitialHost>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const settingsHydrated = useSettings((state) => state.hydrated);
  const libraryHydrated = useLibrary((state) => state.hydrated);
  const ready = (fontsLoaded || Boolean(fontError)) && settingsHydrated && libraryHydrated;
  const [trackingRequested, setTrackingRequested] = useState(false);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hide();
  }, [ready]);

  useEffect(() => {
    // iOS only: ask once so ad networks can use the IDFA. Android is a no-op.
    if (!trackingRequested && Platform.OS === 'ios' && ready) {
      (async () => {
        try {
          await TrackingTransparency.requestTrackingPermissionsAsync();
        } catch {
          // Denied or unavailable — ads still work, just less targeted.
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
