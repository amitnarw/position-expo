import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

import { recordPlateOpen } from '@/ads/adManager';
import { AdSlot } from '@/components/ads/AdSlot';
import { PoseArt } from '@/components/art/pose-art';
import { BulletList, NoteCard, NumberedSteps, SectionTitle } from '@/components/content/editorial';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Appear } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { getPosition, neighbours, type Position } from '@/content';
import { useIsFavorite, useLibrary } from '@/store/library';
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
          Plate not found.
        </AppText>
        <AppText variant="body" className="mt-3 max-w-[300px] text-center">
          It may have moved. The atlas is one tap away.
        </AppText>
        <Button label="Back to plates" variant="secondary" onPress={close} className="mt-6" />
      </View>
    </Screen>
  );
}

function NeighbourLink({
  position,
  direction,
}: {
  position: Position;
  direction: 'previous' | 'next';
}) {
  const { colors } = useTheme();
  const next = direction === 'next';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${next ? 'Next' : 'Previous'} plate: ${position.title}`}
      scaleTo={0.96}
      onPress={() => router.replace({ pathname: '/plate/[slug]', params: { slug: position.slug } })}
      className={`flex-1 rounded-card bg-surface p-4 ${next ? 'items-end' : 'items-start'}`}>
      <AppText variant="label" tone="muted">
        {next ? 'Next' : 'Previous'}
      </AppText>
      <View className={`mt-1.5 flex-row items-center gap-1 ${next ? '' : 'flex-row-reverse'}`}>
        {!next ? <ChevronLeft size={15} color={colors.muted} strokeWidth={1.6} /> : null}
        <AppText variant="subtitle" numberOfLines={1} className="text-[16px]">
          {position.title}
        </AppText>
        {next ? <ChevronRight size={15} color={colors.muted} strokeWidth={1.6} /> : null}
      </View>
    </PressableScale>
  );
}

export default function PlateScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const position = getPosition(slug);
  const saved = useIsFavorite(position?.slug ?? '');
  const toggleFavorite = useLibrary((state) => state.toggleFavorite);
  const recordView = useLibrary((state) => state.recordView);

  const plateSlug = position?.slug;

  useEffect(() => {
    if (!plateSlug) return;
    recordView(plateSlug);
    recordPlateOpen(plateSlug);
  }, [plateSlug, recordView]);

  if (!position) {
    return <NotFound />;
  }

  const { previous, next } = neighbours(position);
  const pace = position.pace[0].toUpperCase() + position.pace.slice(1);

  return (
    <Screen
      edges={['top', 'bottom']}
      className="flex-1"
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      {/* Sticky Top Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-2 z-20">
        <IconButton icon={ChevronLeft} label="Back" onPress={close} />
        <IconButton
          icon={Heart}
          label={saved ? 'Remove from saved' : 'Save plate'}
          selected={saved}
          onPress={() => toggleFavorite(position.slug)}
        />
      </View>

      {/* Scrolling Content with native edge fading */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        fadingEdgeLength={40}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 28 }}>
        <Appear distance={16} className="mt-2">
          <View className="overflow-hidden rounded-card bg-surface">
            <PoseArt pose={position.pose} animate />
          </View>
        </Appear>

        <Appear delay={70} className="mt-7">
          <AppText variant="label">
            Plate {String(position.plate).padStart(2, '0')} · {pace}
          </AppText>
          <AppText variant="title" className="mt-2">
            {position.title}
          </AppText>
          <AppText variant="subtitle" className="mt-1">
            {position.commonName}
          </AppText>
          <AppText variant="body" className="mt-3 max-w-[600px]">
            {position.summary}
          </AppText>
          <AppText variant="small" tone="muted" className="mt-3">
            {pace} · closeness {position.closeness}/5 · effort {position.effort}/5
          </AppText>
        </Appear>

        <Appear delay={110}>
          <SectionTitle>How</SectionTitle>
          <NumberedSteps items={position.steps} />

          <SectionTitle>Why it works</SectionTitle>
          <AppText variant="body" className="max-w-[600px]">
            {position.why}
          </AppText>

          <SectionTitle>Tips</SectionTitle>
          <BulletList items={position.tips} />

          <View className="mt-10">
            <NoteCard title="Care" text={position.care} />
          </View>
        </Appear>

        <View className="mt-12 flex-row gap-3">
          <NeighbourLink position={previous} direction="previous" />
          <NeighbourLink position={next} direction="next" />
        </View>

        <AppText variant="caption" tone="muted" className="mt-6 text-center">
          Plate {String(position.plate).padStart(2, '0')}
        </AppText>
      </ScrollView>

      {/* Sticky Bottom Banner Ad */}
      <View className="items-center pb-2 pt-1 bg-transparent">
        <AdSlot />
      </View>
    </Screen>
  );
}
