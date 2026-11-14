import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { PlateArt } from '@/components/art/plate-art';
import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Appear, staggerDelay } from '@/components/ui/reveal';
import type { Position } from '@/content';
import { useLibrary } from '@/store/library';
import { useTheme } from '@/theme/ThemeProvider';

function openPlate(slug: string) {
  router.push({ pathname: '/plate/[slug]', params: { slug } });
}

/**
 * Standard grid tile with full-bleed artwork, 36px rounded corners,
 * outlined heart (filled only when favorited), and theme-aware bottom title vignette.
 */
export const PlateTile = memo(function PlateTile({
  position,
  index,
}: {
  position: Position;
  index: number;
}) {
  const { colors, scheme } = useTheme();
  const isDark = scheme === 'dark';
  const saved = useLibrary((state) => state.favorites.includes(position.slug));
  const toggleFavorite = useLibrary((state) => state.toggleFavorite);

  // In dark mode: white heart and white text on dark vignette.
  // In light mode: ink/black heart and ink text on white vignette.
  const heartColor = isDark ? '#FFFFFF' : colors.ink;
  const gradColor = isDark ? '#0C0A09' : '#FFFFFF';

  return (
    <Appear delay={staggerDelay(index)} className="flex-1">
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={position.title}
        accessibilityHint={position.commonName}
        scaleTo={0.965}
        haptic="none"
        onPress={() => openPlate(position.slug)}
        className="flex-1 overflow-hidden relative justify-center items-center"
        style={{
          aspectRatio: 0.88,
          borderRadius: 36,
          backgroundColor: colors.surface,
          borderWidth: 0,
        }}>
        {/* Full-bleed Artwork filling the entire card */}
        <View className="absolute inset-0 items-center justify-center">
          <PlateArt slug={position.slug} />
        </View>

        {/* Compact bottom vignette with gradient fading to transparent at top */}
        <View
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0 justify-end px-3 pb-2.5 items-center"
          style={{ height: 46 }}>
          <View style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id={`cardGrad-${position.slug}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={gradColor} stopOpacity="0" />
                  <Stop offset="45%" stopColor={gradColor} stopOpacity={isDark ? '0.38' : '0.45'} />
                  <Stop offset="100%" stopColor={gradColor} stopOpacity={isDark ? '0.78' : '0.85'} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill={`url(#cardGrad-${position.slug})`} />
            </Svg>
          </View>
          <AppText
            variant="headline"
            numberOfLines={1}
            tone="ink"
            style={{ color: isDark ? '#FFFFFF' : colors.ink }}
            className="text-[14.5px] leading-tight font-display text-center">
            {position.title}
          </AppText>
        </View>

        {/* Top-right heart: outlined by default, filled only when favorited */}
        <View className="absolute right-3.5 top-3.5">
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={
              saved ? `Remove ${position.title} from saved` : `Save ${position.title}`
            }
            accessibilityState={{ selected: saved }}
            scaleTo={0.82}
            haptic="select"
            onPress={() => toggleFavorite(position.slug)}
            className="h-8 w-8 items-center justify-center">
            <Heart
              size={18}
              color={heartColor}
              fill={saved ? heartColor : 'transparent'}
              strokeWidth={1.7}
            />
          </PressableScale>
        </View>
      </PressableScale>
    </Appear>
  );
});
