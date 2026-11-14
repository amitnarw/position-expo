import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { AdSlot } from '@/components/ads/AdSlot';
import { BulletList, NoteCard } from '@/components/content/editorial';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Appear } from '@/components/ui/reveal';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { allGuides, getGuide } from '@/content';
import { useIsFavoriteGuide, useLibrary } from '@/store/library';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

function close() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/home');
  }
}

function NotFound() {
  return (
    <Screen edges={['top', 'bottom']} padded>
      <View className="pt-2">
        <IconButton icon={ChevronLeft} label="Back" onPress={close} />
      </View>
      <View className="flex-1 items-center justify-center pb-20">
        <AppText variant="title" className="text-center font-display-italic">
          Guide not found.
        </AppText>
        <AppText variant="body" className="mt-3 max-w-[300px] text-center">
          This guide may have moved. The rest of the shelf is one tap away.
        </AppText>
        <Button label="Back to guides" variant="secondary" onPress={close} className="mt-6" />
      </View>
    </Screen>
  );
}

export default function GuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const guide = getGuide(slug);
  const saved = useIsFavoriteGuide(guide?.slug ?? '');
  const toggleFavoriteGuide = useLibrary((state) => state.toggleFavoriteGuide);
  const { colors } = useTheme();

  if (!guide) {
    return <NotFound />;
  }

  const index = allGuides.findIndex((item) => item.slug === guide.slug);
  const nextGuide = index >= 0 ? allGuides[index + 1] : undefined;

  return (
    <Screen
      edges={['top', 'bottom']}
      className="flex-1"
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      {/* Sticky Top Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-2 z-20">
        <IconButton icon={ChevronLeft} label="Back" onPress={close} />
        <View className="flex-row items-center gap-3">
          <AppText variant="caption" tone="muted">
            {guide.minutes} min read
          </AppText>
          <IconButton
            icon={Heart}
            label={saved ? 'Remove from favorites' : 'Save guide'}
            selected={saved}
            onPress={() => toggleFavoriteGuide(guide.slug)}
          />
        </View>
      </View>

      {/* Scrolling Content with native edge fading */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        fadingEdgeLength={40}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 28 }}>
        <Appear delay={40} className="mt-3">
          <AppText variant="label">
            Guide {String(guide.order).padStart(2, '0')} · {guide.kicker}
          </AppText>
          <AppText variant="title" className="mt-2">
            {guide.title}
          </AppText>
          <AppText variant="body" className="mt-3 max-w-[600px]">
            {guide.summary}
          </AppText>
        </Appear>

        <View className="mt-7">
          <Rule />
        </View>

        <Appear delay={90} className="mt-5">
          {guide.blocks.map((block, blockIndex) => {
            if (block.kind === 'paragraph') {
              return (
                <AppText key={blockIndex} variant="body" className="mb-5 max-w-[600px]">
                  {block.text}
                </AppText>
              );
            }

            if (block.kind === 'heading') {
              return (
                <AppText key={blockIndex} variant="headline" className="mt-8 mb-3 max-w-[600px]">
                  {block.text}
                </AppText>
              );
            }

            if (block.kind === 'list') {
              return <BulletList key={blockIndex} items={block.items} className="mb-6" />;
            }

            if (block.kind === 'steps') {
              return (
                <View key={blockIndex} className="mb-6 gap-3">
                  {block.items.map((item, stepIndex) => (
                    <View key={stepIndex} className="rounded-card bg-surface p-4">
                      <View className="flex-row items-baseline gap-3">
                        <AppText className="font-display text-[21px] text-muted">
                          {String(stepIndex + 1).padStart(2, '0')}
                        </AppText>
                        <AppText variant="subtitle" className="flex-1 text-[17px]">
                          {item.title}
                        </AppText>
                      </View>
                      <AppText variant="body" className="mt-2 max-w-[560px]">
                        {item.text}
                      </AppText>
                    </View>
                  ))}
                </View>
              );
            }

            if (block.kind === 'quote') {
              return (
                <View key={blockIndex} className="my-7 border-l border-line pl-5">
                  <AppText variant="quote" className="max-w-[560px]">
                    {block.text}
                  </AppText>
                  {block.cite ? (
                    <AppText variant="small" className="mt-2">
                      {block.cite}
                    </AppText>
                  ) : null}
                </View>
              );
            }

            return <NoteCard key={blockIndex} title={block.title} text={block.text} />;
          })}
        </Appear>

        <View className="mt-8">
          <Rule />

          {nextGuide ? (
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Next guide: ${nextGuide.title}`}
              scaleTo={0.98}
              onPress={() =>
                router.replace({ pathname: '/guide/[slug]', params: { slug: nextGuide.slug } })
              }
              className="flex-row items-center gap-4 py-5">
              <View className="flex-1">
                <AppText variant="label">Next guide</AppText>
                <AppText variant="headline" className="mt-1.5 text-[22px]">
                  {nextGuide.title}
                </AppText>
                <AppText variant="caption" className="mt-1">
                  {nextGuide.kicker} · {nextGuide.minutes} min
                </AppText>
              </View>
              <ChevronRight size={17} color={colors.muted} strokeWidth={1.6} />
            </PressableScale>
          ) : (
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              scaleTo={0.98}
              onPress={() => router.replace('/home')}
              className="flex-row items-center gap-2 py-5">
              <ChevronLeft size={17} color={colors.muted} strokeWidth={1.6} />
              <AppText variant="small" className="font-sans-medium">
                Back to all guides
              </AppText>
            </PressableScale>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Banner Ad */}
      <View className="items-center pb-2 pt-1 bg-transparent">
        <AdSlot />
      </View>
    </Screen>
  );
}
