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
    'react-native-google-mobile-ads',
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
      zones: {},
      interstitialCapPerSession: 3,
      interstitialOnFirstOpen: false,
    },
  },
};

export default config;
