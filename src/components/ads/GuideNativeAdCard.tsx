import { Star } from 'lucide-react-native';
import { memo } from 'react';
import { Image, View } from 'react-native';
import {
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  TestIds,
  useNativeAd,
} from 'react-native-google-mobile-ads';

import { AppText } from '@/components/ui/app-text';
import { Appear, staggerDelay } from '@/components/ui/reveal';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

type GuideNativeAdCardProps = {
  index: number;
};

export const GuideNativeAdCard = memo(function GuideNativeAdCard({ index }: GuideNativeAdCardProps) {
  const { colors, scheme } = useTheme();
  const isDark = scheme === 'dark';
  const adsConsented = useSettings((state) => state.adsConsented);

  const { nativeAd, status } = useNativeAd({
    adUnitId: adsConsented ? TestIds.NATIVE : null,
  });

  if (!adsConsented || status !== 'loaded' || !nativeAd) {
    return null;
  }

  return (
    <Appear delay={staggerDelay(index)}>
      <NativeAdView
        nativeAd={nativeAd}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 26,
          padding: 16,
          overflow: 'hidden',
        }}>
        {/* Top Header: App/Advertiser Icon + Advertiser Info + "Ad" Badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3 flex-1 mr-2">
            {nativeAd.icon?.url ? (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  source={{ uri: nativeAd.icon.url }}
                  style={{ width: 42, height: 42, borderRadius: 12 }}
                  resizeMode="cover"
                />
              </NativeAsset>
            ) : (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: colors.surface2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText className="font-bold text-[13px] text-ink">AD</AppText>
              </View>
            )}

            <View className="flex-1">
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <AppText
                  variant="subtitle"
                  numberOfLines={1}
                  className="text-[15px] font-sans-semibold leading-5">
                  {nativeAd.headline}
                </AppText>
              </NativeAsset>

              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View
                  className="rounded px-1.5 py-0.5"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  }}>
                  <AppText
                    style={{
                      fontSize: 9.5,
                      fontWeight: '700',
                      letterSpacing: 0.5,
                      color: colors.muted,
                    }}>
                    AD
                  </AppText>
                </View>

                {nativeAd.advertiser ? (
                  <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                    <AppText variant="caption" numberOfLines={1} className="text-[12px] text-muted">
                      {nativeAd.advertiser}
                    </AppText>
                  </NativeAsset>
                ) : null}

                {nativeAd.starRating && nativeAd.starRating > 0 ? (
                  <View className="flex-row items-center ml-1">
                    <Star size={11} color="#E5A93C" fill="#E5A93C" />
                    <AppText className="text-[11px] ml-0.5 text-muted">
                      {nativeAd.starRating.toFixed(1)}
                    </AppText>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {/* Media View (Image / Video preview) */}
        <View
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: colors.surface2,
            marginBottom: 12,
          }}>
          <NativeMediaView
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>

        {/* Body Text */}
        {nativeAd.body ? (
          <NativeAsset assetType={NativeAssetType.BODY}>
            <AppText
              variant="body"
              tone="muted"
              numberOfLines={2}
              className="text-[13px] leading-[18px] mb-3">
              {nativeAd.body}
            </AppText>
          </NativeAsset>
        ) : null}

        {/* Call to Action Button */}
        {nativeAd.callToAction ? (
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <View
              className="rounded-full py-2.5 px-4 items-center justify-center"
              style={{
                backgroundColor: colors.ink,
              }}>
              <AppText
                className="text-[13px] font-sans-semibold"
                style={{
                  color: colors.paper,
                }}>
                {nativeAd.callToAction}
              </AppText>
            </View>
          </NativeAsset>
        ) : null}
      </NativeAdView>
    </Appear>
  );
});
