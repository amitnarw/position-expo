import Constants from 'expo-constants';

export type AdProviderName = 'mock' | 'admob' | 'webview';

export type AdZones = {
  appOpen?: string;
  interstitial?: string;
  banner?: string;
  rewarded?: string;
};

export type AdConfig = {
  provider: AdProviderName;
  testMode: boolean;
  zones: AdZones;
  /** Interstitials per session before we stop showing them. */
  interstitialCapPerSession: number;
  /** Show interstitial on first app open (usually false — too aggressive). */
  interstitialOnFirstOpen: boolean;
};

/**
 * AdMob sandbox unit IDs. These always return test creatives and never touch a
 * real account. They are the built-in defaults so a release bundle behaves the
 * same way even when `Constants.expoConfig` is unavailable.
 */
export const admobTestUnits: AdZones = {
  appOpen: 'ca-app-pub-3940256099942544/5662997125',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

const defaults: AdConfig = {
  provider: 'admob',
  testMode: true,
  zones: admobTestUnits,
  interstitialCapPerSession: 3,
  interstitialOnFirstOpen: false,
};

const raw = (Constants.expoConfig?.extra?.ads as Partial<AdConfig> | undefined) ?? {};

export const adConfig: AdConfig = {
  provider: raw.provider ?? defaults.provider,
  testMode: raw.testMode ?? defaults.testMode,
  zones: { ...defaults.zones, ...(raw.zones ?? {}) },
  interstitialCapPerSession:
    raw.interstitialCapPerSession ?? defaults.interstitialCapPerSession,
  interstitialOnFirstOpen: raw.interstitialOnFirstOpen ?? defaults.interstitialOnFirstOpen,
};
