import { useEffect } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { adConfig } from '@/ads/config';
import { recordBanner } from '@/ads/adManager';
import { features } from '@/config/features';
import { useSettings } from '@/store/settings';

/**
 * Banner ad component. Renders below the floating dock or in editorial footers.
 * Renders nothing when ads are off or unconfigured.
 */
export function AdSlot({
  zoneId,
  variant = 'footer',
}: {
  zoneId?: string;
  variant?: 'footer' | 'dock';
}) {
  const adsConsented = useSettings((state) => state.adsConsented);
  const unitId = zoneId ?? adConfig.zones.banner;

  const enabled =
    features.bannerAds && adsConsented && adConfig.provider === 'admob' && Boolean(unitId);

  useEffect(() => {
    if (enabled) recordBanner();
  }, [enabled]);

  if (!enabled || !unitId) return null;

  if (variant === 'dock') {
    return (
      <View className="w-full items-center justify-center pt-2 pb-1">
        <BannerAd
          unitId={unitId}
          size={BannerAdSize.BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdLoaded={() => console.log('[ads] dock banner loaded')}
          onAdImpression={() => console.log('[ads] dock banner impression')}
          onAdFailedToLoad={(error) => console.warn('[ads] dock banner failed', error.message)}
        />
      </View>
    );
  }

  return (
    <View className="w-full items-center justify-center py-1">
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => console.log('[ads] banner loaded')}
        onAdImpression={() => console.log('[ads] banner impression')}
        onAdFailedToLoad={(error) => console.warn('[ads] banner failed', error.message)}
      />
    </View>
  );
}
