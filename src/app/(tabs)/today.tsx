import { router } from 'expo-router';
import { ArrowRight, ArrowUpRight, Search, Settings2 } from 'lucide-react-native';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import { PoseArt } from '@/components/art/pose-art';
import { PlateCard, PlateRow } from '@/components/plates/plate-card';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Reveal } from '@/components/ui/reveal';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import {
  allCollections,
  allGuides,
  allPositions,
  featured,
  getPosition,
  positionsIn,
} from '@/content';
import { haptics } from '@/lib/haptics';
import { useLibrary } from '@/store/library';
import type { Intent } from '@/store/settings';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { layout } from '@/theme/scale';

function greetingFor(intent: Intent | null) {
  switch (intent) {
    case 'learn':
      return 'Begin where it is simple.';
    case 'explore':
      return 'One plate you have not tried.';
    case 'connect':
      return 'Start with closeness.';
    default:
      return 'An atlas of closeness.';
  }
}

export default function TodayScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const intent = useSettings((state) => state.intent);
  const history = useLibrary((state) => state.history);

  const contentWidth = Math.min(width, layout.maxWidth);
  const cellWidth = (contentWidth - 48 - 16) / 2;

  const recent = getPosition(history[0]);
  const guide = allGuides[0];

  return (
    <Screen
      scroll
      edges={['top']}
      bottomSpace={40}
      contentClassName="px-6 pt-2"
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-1.5 w-1.5 rounded-full bg-clay" />
          <AppText variant="label">Forma</AppText>
        </View>

        <View className="flex-row items-center gap-2">
          <IconButton icon={Search} label="Search" onPress={() => router.push('/search')} />
          <IconButton icon={Settings2} label="Settings" onPress={() => router.push('/settings')} />
        </View>
      </View>

      <View className="mt-12">
        <AppText variant="label">The daily plate</AppText>
        <AppText variant="display" className="mt-3">
          {greetingFor(intent)}
        </AppText>
        <AppText variant="body" className="mt-5 max-w-[320px]">
          Thirty-six shapes, eight guides, and no expectation to do any of it.
        </AppText>
      </View>

      <Reveal delay={60}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open plate ${featured.plate}, ${featured.title}`}
          accessibilityHint={featured.commonName}
          onPress={() => {
            haptics.press();
            router.push({ pathname: '/plate/[slug]', params: { slug: featured.slug } });
          }}
          className="mt-10 overflow-hidden rounded-card border border-line bg-surface active:opacity-90">
          <PoseArt pose={featured.pose} animate />

          <View className="border-t border-line px-5 py-4">
            <View className="flex-row items-center justify-between gap-4">
              <AppText variant="label" numberOfLines={1} className="flex-1">
                {`Plate ${String(featured.plate).padStart(2, '0')} · ${featured.pace}`}
              </AppText>
              <View className="flex-row items-center gap-1.5">
                <AppText variant="small" tone="accent" className="font-sans-medium">
                  Open the plate
                </AppText>
                <ArrowUpRight size={15} color={colors.clay} strokeWidth={1.8} />
              </View>
            </View>

            <AppText variant="headline" numberOfLines={1} className="mt-2">
              {featured.title}
            </AppText>
            <AppText variant="small" numberOfLines={1} className="mt-0.5">
              {featured.commonName}
            </AppText>
          </View>
        </Pressable>
      </Reveal>

      {recent ? (
        <View className="mt-14">
          <SectionHeader label="Return" title="Pick up where you left off" />
          <View className="mt-4 rounded-card border border-line bg-surface px-4">
            <PlateRow position={recent} />
          </View>
        </View>
      ) : null}

      <View className="mt-14">
        <SectionHeader
          label="Plates"
          title="A first look"
          actionLabel="All 36"
          onAction={() => router.push('/atlas')}
        />

        <View className="mt-5 flex-row flex-wrap justify-between">
          {allPositions.slice(0, 4).map((position) => (
            <View key={position.slug} style={{ width: cellWidth, marginBottom: 28 }}>
              <PlateCard position={position} />
            </View>
          ))}
        </View>
      </View>

      <View className="mt-8">
        <SectionHeader label="Collections" title="Six ways in" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -24 }}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
          {allCollections.map((collection) => {
            const preview = positionsIn(collection).slice(0, 3);

            return (
              <Pressable
                key={collection.slug}
                accessibilityRole="button"
                accessibilityLabel={`Collection, ${collection.title}`}
                accessibilityHint={collection.subtitle}
                onPress={() => {
                  haptics.tap();
                  router.push({
                    pathname: '/collection/[slug]',
                    params: { slug: collection.slug },
                  });
                }}
                style={{ width: 232 }}
                className="rounded-card border border-line bg-surface p-5 active:opacity-70">
                <AppText variant="label" numberOfLines={2} style={{ minHeight: 28 }}>
                  {collection.subtitle}
                </AppText>
                <AppText
                  variant="headline"
                  numberOfLines={2}
                  style={{ minHeight: 68 }}
                  className="mt-2">
                  {collection.title}
                </AppText>
                <AppText variant="numeric" className="mt-1.5">
                  {`${positionsIn(collection).length} plates`}
                </AppText>

                <View className="mt-4 flex-row gap-1.5">
                  {preview.map((position) => (
                    <View
                      key={position.slug}
                      className="overflow-hidden rounded-plate border border-line">
                      <PoseArt pose={position.pose} size={44} />
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="mt-14">
        <SectionHeader label="Read first" title="Before the plates" />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Read ${guide.title}`}
          accessibilityHint={guide.kicker}
          onPress={() => {
            haptics.tap();
            router.push({ pathname: '/guide/[slug]', params: { slug: guide.slug } });
          }}
          className="mt-4 rounded-card border border-line bg-surface p-5 active:opacity-80">
          <AppText variant="label" numberOfLines={1}>
            {guide.kicker}
          </AppText>
          <AppText variant="headline" numberOfLines={2} className="mt-2">
            {guide.title}
          </AppText>
          <AppText variant="small" numberOfLines={2} className="mt-2">
            {guide.summary}
          </AppText>

          <View className="mt-5 flex-row items-center justify-between">
            <AppText variant="numeric">{`${guide.minutes} min read`}</AppText>
            <View className="flex-row items-center gap-1.5">
              <AppText variant="small" tone="accent" className="font-sans-medium">
                Read
              </AppText>
              <ArrowRight size={15} color={colors.clay} strokeWidth={1.8} />
            </View>
          </View>
        </Pressable>
      </View>

      <View className="mt-16">
        <Rule />
        <AppText variant="quote" className="mt-6">
          “Closeness is a practice.”
        </AppText>
        <AppText variant="small" className="mt-2">
          FORMA · An atlas of closeness.
        </AppText>
      </View>
    </Screen>
  );
}
