import { useEffect } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useTheme } from '@/theme/ThemeProvider';
import { features } from '@/config/features';
import { getProvider, recordBanner } from '@/ads/adManager';

/**
 * Fixed-height banner slot. Reserves space whether or not a creative loads so
 * the page never jumps. Dev/test mode shows a hairline "Ad" box; production
 * networks inject the native banner through the provider.
 */
export function AdSlot({ zoneId }: { zoneId?: string }) {
  const { colors } = useTheme();
  const provider = getProvider();
  const showBanner = features.bannerAds && Boolean(zoneId) && Boolean(provider);

  useEffect(() => {
    if (showBanner) recordBanner();
  }, [showBanner]);

  return (
    <View
      style={{
        height: 52,
        width: '100%',
        borderWidth: showBanner ? 1 : 0,
        borderColor: showBanner ? colors.line : 'transparent',
        borderRadius: 8,
        backgroundColor: showBanner ? colors.surface : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {showBanner ? (
        <View className="flex-row items-center gap-2 px-3 py-1">
          <AppText variant="caption" tone="muted" className="font-sans-medium">
            Ad
          </AppText>
          <AppText variant="caption" tone="muted">
            {provider?.name ?? 'ad'} · {zoneId?.slice(-8) ?? ''}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
