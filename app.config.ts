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
    output: 'server',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
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
      // Dev builds use the local mock by default. Flip to 'admob' to test
      // real AdMob test units, or 'webview' for a tag-based production network.
      provider: 'mock',
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
