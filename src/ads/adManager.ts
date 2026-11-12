import { useState, useCallback } from 'react';
import { adConfig, type AdConfig } from './config';
import { features } from '@/config/features';
import { mockProvider } from './mock';
import { admobProvider } from './admob';
import type { AdProvider, AdOutcome, AdCaps } from './types';

function resolveProvider(config: AdConfig): AdProvider {
  switch (config.provider) {
    case 'admob':
      return admobProvider;
    case 'webview':
      // Tag-based provider is implemented in src/ads/webview.ts when needed.
      return mockProvider;
    case 'mock':
    default:
      return mockProvider;
  }
}

let provider: AdProvider | null = null;
let isInitialized = false;
let caps: AdCaps = { appOpenShown: false, interstitialCount: 0, bannerCount: 0 };

/** Module-level trigger registered by InterstitialHost. */
let interstitialTrigger:
  | ((zoneId: string, firstOpen: boolean) => Promise<AdOutcome>)
  | null = null;

/** Register the root host's interstitial trigger. Called once on mount. */
export function registerInterstitialTrigger(
  fn: (zoneId: string, firstOpen: boolean) => Promise<AdOutcome>,
) {
  interstitialTrigger = fn;
}

/** Initialize the selected provider once. Safe to call repeatedly. */
export async function initAds() {
  if (isInitialized) return;
  provider = resolveProvider(adConfig);
  await provider.initialize();
  isInitialized = true;
  console.log(`[ads] provider=${provider.name} testMode=${adConfig.testMode}`);
}

export function getProvider(): AdProvider | null {
  return provider;
}

export function recordBanner() {
  caps.bannerCount += 1;
}

export function canShowInterstitial({ firstOpen }: { firstOpen: boolean }): boolean {
  if (!features.interstitialAds) return false;
  if (firstOpen && !adConfig.interstitialOnFirstOpen) return false;
  if (caps.interstitialCount >= adConfig.interstitialCapPerSession) return false;
  return true;
}

export function recordInterstitial() {
  caps.interstitialCount += 1;
}

export function getCaps(): AdCaps {
  return { ...caps };
}

/**
 * Hook: show an interstitial honoring caps. Routes through InterstitialHost
 * when mounted (so the mock overlay renders), otherwise calls the provider
 * directly.
 */
export function useInterstitial({ firstOpen }: { firstOpen: boolean }) {
  const [showing, setShowing] = useState(false);

  const show = useCallback(
    async (zoneId: string): Promise<AdOutcome> => {
      if (!provider) await initAds();
      const p = provider;
      if (!p) return { kind: 'error', zoneId, message: 'ads not initialized' };
      if (!canShowInterstitial({ firstOpen })) {
        return { kind: 'capped', reason: firstOpen ? 'first-open' : 'frequency' };
      }

      // Route through host if registered (renders mock overlay).
      if (interstitialTrigger) {
        setShowing(true);
        try {
          const outcome = await interstitialTrigger(zoneId, firstOpen);
          if (outcome.kind === 'ok') recordInterstitial();
          return outcome;
        } finally {
          setShowing(false);
        }
      }

      // Direct provider path (production networks present natively).
      setShowing(true);
      try {
        const outcome = await p.showInterstitial(zoneId);
        if (outcome.kind === 'ok') recordInterstitial();
        return outcome;
      } finally {
        setShowing(false);
      }
    },
    [firstOpen],
  );

  return { show, showing, caps: getCaps() };
}
