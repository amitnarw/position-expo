import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  TestIds,
  useNativeAd,
} from 'react-native-google-mobile-ads';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/ui/app-text';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

type NativeAdMobCardProps = {
  index: number;
};

/**
 * Genuine AdMob Native Ad Card formatted to match the app's 36px card aesthetic:
 * Uses Google Mobile Ads NativeAdView, NativeMediaView, NativeAsset, and test unit IDs.
 */
export const NativeAdMobCard = memo(function NativeAdMobCard({ index }: NativeAdMobCardProps) {
  const { colors, scheme } = useTheme();
  const isDark = scheme === 'dark';
  const adsConsented = useSettings((state) => state.adsConsented);

  const { nativeAd, status } = useNativeAd({
    adUnitId: adsConsented ? TestIds.NATIVE : null,
  });

  const gradColor = isDark ? '#0C0A09' : '#FFFFFF';

  if (!adsConsented || status !== 'loaded' || !nativeAd) {
    return null;
  }

  return (
    <View className="flex-1">
      <NativeAdView
        nativeAd={nativeAd}
        style={{
          aspectRatio: 0.88,
          borderRadius: 36,
          backgroundColor: colors.surface,
          borderWidth: 0,
          overflow: 'hidden',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Full-bleed Native Media View constrained strictly within card */}
        <NativeMediaView
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
        />

        {/* Top-left Ad Badge */}
        <View className="absolute left-3.5 top-3.5 z-10">
          <View
            className="rounded-full px-2.5 py-0.5"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.85)',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.line,
            }}>
            <AppText
              variant="caption"
              style={{
                fontSize: 10,
                letterSpacing: 0.5,
                color: colors.ink,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}>
              Ad
            </AppText>
          </View>
        </View>

        {/* Compact bottom vignette gradient with Ad Headline & CTA */}
        <View
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0 justify-end px-3 pb-2.5 items-center z-10"
          style={{ height: 52 }}>
          <View style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id={`nativeAdGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={gradColor} stopOpacity="0" />
                  <Stop offset="45%" stopColor={gradColor} stopOpacity={isDark ? '0.45' : '0.55'} />
                  <Stop offset="100%" stopColor={gradColor} stopOpacity={isDark ? '0.85' : '0.92'} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill={`url(#nativeAdGrad-${index})`} />
            </Svg>
          </View>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <AppText
              variant="headline"
              numberOfLines={1}
              style={{
                fontSize: 13.5,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : colors.ink,
                textAlign: 'center',
                maxWidth: '94%',
              }}>
              {nativeAd.headline}
            </AppText>
          </NativeAsset>
          {nativeAd.callToAction ? (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <AppText
                variant="caption"
                numberOfLines={1}
                tone="muted"
                style={{
                  fontSize: 10.5,
                  textAlign: 'center',
                  marginTop: 1,
                  maxWidth: '94%',
                }}>
                {nativeAd.callToAction}
              </AppText>
            </NativeAsset>
          ) : null}
        </View>
      </NativeAdView>
    </View>
  );
});
