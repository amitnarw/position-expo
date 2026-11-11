import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { BulletList, NoteCard } from '@/components/content/editorial';
import { ModalHeader } from '@/components/content/modal-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { allGuides, getGuide } from '@/content';
import { haptics } from '@/lib/haptics';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

function GuideNotFound() {
  return (
    <Screen edges={['top', 'bottom']} padded>
      <View className="pt-2 pb-4">
        <IconButton icon={ChevronLeft} label="Close" onPress={() => router.back()} />
      </View>
      <View className="flex-1 items-center justify-center pb-24">
        <AppText variant="title" className="text-center font-display-italic">
          Guide not found.
        </AppText>
        <AppText variant="body" className="mt-3 max-w-[320px] text-center">
          This guide may have moved. Everything else is waiting on the Learn shelf.
        </AppText>
        <Button
          label="Close"
          variant="secondary"
          onPress={() => router.back()}
          className="mt-6"
        />
      </View>
    </Screen>
  );
}

export default function GuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const guide = getGuide(slug);
  const { colors } = useTheme();

  if (!guide) {
    return <GuideNotFound />;
  }

  const index = allGuides.findIndex((item) => item.slug === guide.slug);
  const nextGuide = index >= 0 ? allGuides[index + 1] : undefined;

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      padded
      bottomSpace={48}
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <ModalHeader
        label={`GUIDE ${String(guide.order).padStart(2, '0')} · ${guide.minutes} MIN`}
      />

      <AppText variant="label">{guide.kicker}</AppText>
      <AppText variant="display" className="mt-3">
        {guide.title}
      </AppText>
      <AppText variant="body" className="mt-4 max-w-[600px]">
        {guide.summary}
      </AppText>

      <View className="mt-8">
        <Rule />
      </View>

      <View className="mt-6">
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
                  <View key={stepIndex} className="rounded-card border border-line bg-surface p-4">
                    <View className="flex-row items-baseline gap-3">
                      <AppText className="font-display text-[22px] leading-7 text-clay">
                        {String(stepIndex + 1).padStart(2, '0')}
                      </AppText>
                      <AppText variant="subtitle" className="flex-1 text-[17px] leading-6">
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
              <View key={blockIndex} className="my-7 border-l-2 border-clay pl-5">
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
      </View>

      <View className="mt-12">
        <Rule />

        {nextGuide ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Next guide: ${nextGuide.title}`}
            onPress={() => {
              haptics.tap();
              router.replace({ pathname: '/guide/[slug]', params: { slug: nextGuide.slug } });
            }}
            className="flex-row items-center gap-4 py-5 active:opacity-60">
            <View className="flex-1">
              <AppText variant="label">Next guide</AppText>
              <AppText variant="headline" className="mt-2 text-[24px] leading-[30px]">
                {nextGuide.title}
              </AppText>
              <AppText variant="small" className="mt-1">
                {nextGuide.kicker} · {nextGuide.minutes} min
              </AppText>
            </View>
            <ChevronRight size={18} color={colors.muted} strokeWidth={1.6} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to all guides"
            onPress={() => {
              haptics.tap();
              router.replace('/learn');
            }}
            className="flex-row items-center gap-3 py-5 active:opacity-60">
            <ChevronLeft size={16} color={colors.muted} strokeWidth={1.6} />
            <AppText variant="small" className="font-sans-medium">
              Back to all guides
            </AppText>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
