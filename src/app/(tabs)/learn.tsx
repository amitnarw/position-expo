import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View, useWindowDimensions } from 'react-native';

import { PoseArt } from '@/components/art/pose-art';
import { AppText } from '@/components/ui/app-text';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { allCollections, allGuides, positionsIn } from '@/content';
import { haptics } from '@/lib/haptics';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

export default function LearnScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const columnWidth = (Math.min(width, layout.maxWidth) - 48 - 16) / 2;

  const openGuide = (slug: string) => {
    haptics.tap();
    router.push({ pathname: '/guide/[slug]', params: { slug } });
  };

  const openCollection = (slug: string) => {
    haptics.tap();
    router.push({ pathname: '/collection/[slug]', params: { slug } });
  };

  return (
    <Screen
      scroll
      edges={['top']}
      bottomSpace={40}
      contentClassName="px-6 pt-2"
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <View className="mt-10">
        <AppText variant="label">Learn</AppText>
        <AppText variant="display" className="mt-3 max-w-[560px]">
          Eight short guides.
        </AppText>
        <AppText variant="body" className="mt-4 max-w-[600px]">
          Consent, communication, anatomy, pace, comfort, lubricant, aftercare, and what to do when
          it goes wrong.
        </AppText>
      </View>

      <View className="mt-10">
        {allGuides.map((guide, index) => (
          <View key={guide.slug}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Guide ${guide.order}: ${guide.title}`}
              accessibilityHint={guide.summary}
              onPress={() => openGuide(guide.slug)}
              className="flex-row items-start gap-4 py-4 active:opacity-60">
              <AppText className="w-8 font-display text-[24px] leading-8 text-clay">
                {String(guide.order).padStart(2, '0')}
              </AppText>

              <View className="flex-1">
                <AppText variant="label">{guide.kicker}</AppText>
                <AppText variant="headline" className="mt-2 text-[24px] leading-[30px]">
                  {guide.title}
                </AppText>
                <AppText variant="small" className="mt-2" numberOfLines={2}>
                  {guide.summary}
                </AppText>
              </View>

              <View className="items-end justify-between self-stretch">
                <AppText variant="numeric">{guide.minutes} min</AppText>
                <ChevronRight size={16} color={colors.muted} strokeWidth={1.6} />
              </View>
            </Pressable>

            {index < allGuides.length - 1 ? <Rule /> : null}
          </View>
        ))}
      </View>

      <View className="mt-12">
        <SectionHeader
          label="Collections"
          title="Curated paths"
          actionLabel="Atlas"
          onAction={() => {
            haptics.tap();
            router.push('/atlas');
          }}
        />
      </View>

      <View className="mt-6 flex-row flex-wrap justify-between">
        {allCollections.map((collection) => {
          const first = positionsIn(collection)[0];
          return (
            <View key={collection.slug} style={{ width: columnWidth }} className="mb-4">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Collection: ${collection.title}`}
                accessibilityHint={collection.subtitle}
                onPress={() => openCollection(collection.slug)}
                className="rounded-card border border-line bg-surface p-5 active:opacity-70">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <AppText variant="label" numberOfLines={2}>
                      {collection.subtitle}
                    </AppText>
                    <AppText variant="subtitle" className="mt-2 text-[18px] leading-6">
                      {collection.title}
                    </AppText>
                    <AppText variant="numeric" className="mt-3">
                      {positionsIn(collection).length} plates
                    </AppText>
                  </View>

                  {first ? (
                    <View className="overflow-hidden rounded-xl border border-line">
                      <PoseArt pose={first.pose} size={48} />
                    </View>
                  ) : null}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>

    </Screen>
  );
}
