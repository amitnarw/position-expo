import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'FORMA',
  slug: 'forma',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'forma',
  userInterfaceStyle: 'automatic',
  backgroundColor: '#F7F2EA',
  // Mobile-only product. Excluding web also stops the release bundle step from
  // building an Expo Router *server* bundle (which cannot load native-only
  // modules such as react-native-google-mobile-ads).
  platforms: ['ios', 'android'],
  ios: {
    icon: './assets/images/icon.png',
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#F7F2EA',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.forma.atlas',
  },
  web: {
    // 'single' = client-side only. 'server' forces a server bundle on every
    // export, including native release builds, where native-only ad modules
    // cannot be resolved.
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    './plugins/with-release-build',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F7F2EA',
        image: './assets/images/splash-icon.png',
        imageWidth: 96,
        dark: {
          backgroundColor: '#0F0D0C',
          image: './assets/images/splash-icon-dark.png',
        },
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        // Test app IDs — never real account IDs. Required by the GMA plugin.
        androidAppId: 'ca-app-pub-3940256099942544~3347511713',
        iosAppId: 'ca-app-pub-3940256099942544~1444665636',
      },
    ],
    'expo-tracking-transparency',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ads: {
      // AdMob sandbox units for this build. Real monetisation is a separate
      // (and policy-sensitive) decision.
      provider: 'admob',
      testMode: true,
      zones: {
        // AdMob sandbox test unit IDs — test creatives only, never real account IDs.
        appOpen: 'ca-app-pub-3940256099942544/5662997125',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        banner: 'ca-app-pub-3940256099942544/6300978111',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
      },
      interstitialCapPerSession: 3,
      interstitialOnFirstOpen: false,
    },
  },
};

export default config;
