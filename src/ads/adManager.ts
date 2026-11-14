import { useCallback, useState } from 'react';

import { features } from '@/config/features';
import { useSettings } from '@/store/settings';
import { admobProvider } from './admob';
import { adConfig, type AdConfig } from './config';
import { mockProvider } from './mock';
import type { AdCaps, AdOutcome, AdProvider } from './types';

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
let initPromise: Promise<void> | null = null;
const caps: AdCaps = { appOpenShown: false, interstitialCount: 0, bannerCount: 0 };

/** Module-level trigger registered by InterstitialHost. */
let interstitialTrigger: ((zoneId: string) => Promise<AdOutcome>) | null = null;

/** Distinct plates opened this session. Drives the one natural ad break. */
const openedPlates = new Set<string>();
let pendingInterstitial = false;

export function registerInterstitialTrigger(fn: ((zoneId: string) => Promise<AdOutcome>) | null) {
  interstitialTrigger = fn;
}

/** Initialize the selected provider once. Safe to call repeatedly. */
export function initAds(): Promise<void> {
  if (initPromise) return initPromise;
  provider = resolveProvider(adConfig);
  initPromise = provider
    .initialize()
    .then(() => {
      console.log(`[ads] provider=${provider?.name} testMode=${adConfig.testMode}`);
    })
    .catch((error) => {
      console.warn('[ads] initialize failed', error);
    });
  return initPromise;
}

export function getProvider(): AdProvider | null {
  return provider;
}

export function recordBanner() {
  caps.bannerCount += 1;
}

export function canShowInterstitial({
  firstOpen,
  adsConsented,
}: {
  firstOpen: boolean;
  adsConsented: boolean;
}): boolean {
  if (!features.interstitialAds) return false;
  if (!adsConsented) return false;
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
 * Call once per plate open. After the third distinct plate in a session we
 * arm one interstitial, which Home shows when it regains focus.
 */
export function recordPlateOpen(slug: string) {
  openedPlates.add(slug);
  if (openedPlates.size >= 3) {
    pendingInterstitial = true;
  }
}

/** True at most once per armed break. */
export function consumePendingInterstitial(): boolean {
  if (!pendingInterstitial) return false;
  pendingInterstitial = false;
  return true;
}

/**
 * Hook: show an interstitial honoring caps. Routes through InterstitialHost
 * when mounted, otherwise calls the provider directly.
 */
export function useInterstitial({ firstOpen }: { firstOpen: boolean }) {
  const [showing, setShowing] = useState(false);
  const adsConsented = useSettings((state) => state.adsConsented);

  const show = useCallback(
    async (zoneId: string): Promise<AdOutcome> => {
      await initAds();
      const active = provider;
      if (!active) return { kind: 'error', zoneId, message: 'ads not initialized' };
      if (!canShowInterstitial({ firstOpen, adsConsented })) {
        return { kind: 'capped', reason: firstOpen ? 'first-open' : 'frequency' };
      }

      setShowing(true);
      try {
        const outcome = interstitialTrigger
          ? await interstitialTrigger(zoneId)
          : await active.showInterstitial(zoneId);
        if (outcome.kind === 'ok') recordInterstitial();
        return outcome;
      } finally {
        setShowing(false);
      }
    },
    [firstOpen, adsConsented],
  );

  return { show, showing, caps: getCaps() };
}
