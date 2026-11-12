import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { AppText } from '@/components/ui/app-text';
import { useTheme } from '@/theme/ThemeProvider';
import { features } from '@/config/features';
import { adConfig } from '@/ads/config';
import { getProvider, recordBanner } from '@/ads/adManager';
import { useSettings } from '@/store/settings';

/**
 * Fixed-height banner slot (52 px). Reserves space whether or not a creative
 * loads so the page never jumps.
 *
 * - provider === 'admob': renders the native <BannerAd> with the configured
 *   banner zone.
 * - provider === 'mock': shows a hairline placeholder box and logs an
 *   impression so every screen can be exercised offline.
 * - provider === 'webview' / no zone / not consented: renders nothing (slot
 *   still reserves height when a future network fills it).
 */
export function AdSlot({ zoneId }: { zoneId?: string }) {
  const { colors } = useTheme();
  const adsConsented = useSettings((state) => state.adsConsented);
  const provider = getProvider();
  const id = zoneId ?? adConfig.zones.banner;
  const showBanner = features.bannerAds && adsConsented && Boolean(id) && Boolean(provider);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (showBanner && loaded) recordBanner();
  }, [showBanner, loaded]);

  if (!id || !showBanner) {
    return null;
  }

  const bannerContent = (
    <View
      className="flex-row items-center gap-2 px-3 py-1"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: 999,
      }}>
      <AppText variant="caption" tone="muted" className="font-sans-medium">
        Ad
      </AppText>
      <AppText variant="caption" tone="muted">
        {provider?.name ?? 'ad'} · {id.slice(-8)}
      </AppText>
    </View>
  );

  // Slot always reserves 52 px. The creative (or placeholder) paints inside it.
  return (
    <View
      style={{
        height: 52,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: 8,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {provider?.name === 'admob' ? (
        <BannerAd
          unitId={id}
          size={BannerAdSize.BANNER}
          requestOptions={{}}
          onAdLoaded={() => setLoaded(true)}
          onAdFailedToLoad={() => setLoaded(false)}
          onAdImpression={() => recordBanner()}
        />
      ) : (
        bannerContent
      )}
    </View>
  );
}
