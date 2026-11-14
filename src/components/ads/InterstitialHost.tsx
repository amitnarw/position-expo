import { useEffect } from 'react';

import { initAds, getProvider, registerInterstitialTrigger } from '@/ads/adManager';
import { features } from '@/config/features';
import { useSettings } from '@/store/settings';

/**
 * Root-mounted plumbing for full-screen ads. AdMob presents interstitials
 * natively, so this renders no UI of its own — it only registers the trigger
 * used by `useInterstitial`.
 */
export function InterstitialHost({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerInterstitialTrigger(async (zoneId) => {
      if (!features.interstitialAds) {
        return { kind: 'capped' as const, reason: 'frequency' as const };
      }
      if (!useSettings.getState().adsConsented) {
        return { kind: 'capped' as const, reason: 'frequency' as const };
      }

      try {
        await initAds();
        const provider = getProvider();
        if (!provider) {
          return { kind: 'error' as const, zoneId, message: 'ads not initialized' };
        }
        return await provider.showInterstitial(zoneId);
      } catch (error) {
        return {
          kind: 'error' as const,
          zoneId,
          message: error instanceof Error ? error.message : String(error),
        };
      }
    });

    return () => registerInterstitialTrigger(null);
  }, []);

  return <>{children}</>;
}
