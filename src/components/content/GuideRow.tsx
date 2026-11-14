import { memo } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Heart } from 'lucide-react-native';

import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Appear, staggerDelay } from '@/components/ui/reveal';
import type { Guide } from '@/content';
import { useLibrary } from '@/store/library';
import { useTheme } from '@/theme/ThemeProvider';

function openGuide(slug: string) {
  router.push({ pathname: '/guide/[slug]', params: { slug } });
}

export const GuideRow = memo(function GuideRow({
  guide,
  index,
}: {
  guide: Guide;
  index: number;
}) {
  const { colors } = useTheme();
  const saved = useLibrary((state) => (state.favoriteGuides ?? []).includes(guide.slug));
  const toggleFavoriteGuide = useLibrary((state) => state.toggleFavoriteGuide);

  return (
    <Appear delay={staggerDelay(index)}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${guide.title}, ${guide.minutes} minute read`}
        scaleTo={0.975}
        haptic="none"
        onPress={() => openGuide(guide.slug)}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 26,
          borderWidth: 0,
          minHeight: 96,
          paddingHorizontal: 18,
          paddingVertical: 18,
          justifyContent: 'center',
        }}
        className="flex-row items-center gap-4">
        {/* Order badge */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText className="font-display text-[17px] text-muted font-bold">
            {String(guide.order).padStart(2, '0')}
          </AppText>
        </View>

        {/* Title & metadata */}
        <View className="flex-1 justify-center">
          <AppText
            variant="subtitle"
            numberOfLines={2}
            className="text-[17px] leading-[22px] font-sans-semibold">
            {guide.title}
          </AppText>
          <AppText variant="caption" className="mt-1.5 text-[12.5px]" numberOfLines={1}>
            {guide.kicker} · {guide.minutes} min read
          </AppText>
        </View>

        {/* Favorite action & navigation chevron */}
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from favorites' : 'Save guide'}
          scaleTo={0.82}
          haptic="select"
          hitSlop={10}
          onPress={() => toggleFavoriteGuide(guide.slug)}
          className="p-2">
          <Heart
            size={20}
            color={saved ? colors.ink : colors.muted}
            fill={saved ? colors.ink : 'transparent'}
            strokeWidth={1.7}
          />
        </PressableScale>
        <ChevronRight size={18} color={colors.muted} strokeWidth={1.8} />
      </PressableScale>
    </Appear>
  );
});
