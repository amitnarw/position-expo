import { router, useLocalSearchParams } from 'expo-router';
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { PoseArt } from '@/components/art/pose-art';
import {
  BulletList,
  NoteCard,
  NumberedSteps,
  SectionTitle,
} from '@/components/content/editorial';
import { ModalHeader } from '@/components/content/modal-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { DotScale } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import {
  allPositions,
  collectionsFor,
  getPosition,
  neighbours,
  positionsIn,
  type Position,
} from '@/content';
import { haptics } from '@/lib/haptics';
import { useIsFavorite, useLibrary } from '@/store/library';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

function MetaCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="flex-1 p-5">
      <AppText variant="label">{label}</AppText>
      <View className="mt-2 min-h-[24px] justify-center">{children}</View>
    </View>
  );
}

function PlateNotFound() {
  return (
    <Screen edges={['top', 'bottom']} padded>
      <View className="pt-2 pb-4">
        <IconButton icon={ChevronLeft} label="Close" onPress={() => router.back()} />
      </View>
      <View className="flex-1 items-center justify-center pb-24">
        <AppText variant="title" className="text-center font-display-italic">
          Plate not found.
        </AppText>
        <AppText variant="body" className="mt-3 max-w-[320px] text-center">
          This plate may have moved. Browse the atlas for the full set of thirty-six.
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

export default function PlateScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const position = getPosition(slug) as Position | undefined;
  const favorite = useIsFavorite(slug ?? '');
  const toggleFavorite = useLibrary((state) => state.toggleFavorite);
  const recordView = useLibrary((state) => state.recordView);
  const { colors } = useTheme();

  useEffect(() => {
    if (position) recordView(position.slug);
  }, [position, recordView]);

  if (!position) {
    return <PlateNotFound />;
  }

  const { previous, next } = neighbours(position);
  const collections = collectionsFor(position);

  const openPlate = (target: Position) => {
    haptics.tap();
    router.replace({ pathname: '/plate/[slug]', params: { slug: target.slug } });
  };

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      padded
      bottomSpace={48}
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <ModalHeader
        label={`PLATE ${String(position.plate).padStart(2, '0')} / ${allPositions.length}`}
        right={
          <IconButton
            icon={Bookmark}
            label={favorite ? 'Remove from saved' : 'Save plate'}
            selected={favorite}
            onPress={() => {
              toggleFavorite(position.slug);
              haptics.success();
            }}
          />
        }
      />

      <View className="overflow-hidden rounded-card border border-line bg-surface">
        <PoseArt pose={position.pose} animate />
      </View>

      <View className="mt-8">
        <AppText variant="label">Plate {String(position.plate).padStart(2, '0')}</AppText>
        <AppText variant="display" className="mt-3">
          {position.title}
        </AppText>
        <AppText variant="subtitle" className="mt-3">
          {position.commonName}
        </AppText>
        <AppText variant="body" className="mt-4 max-w-[600px]">
          {position.summary}
        </AppText>
      </View>

      <View className="mt-8 overflow-hidden rounded-card border border-line">
        <View className="flex-row">
          <MetaCell label="Pace">
            <AppText variant="subtitle" className="capitalize">
              {position.pace}
            </AppText>
          </MetaCell>
          <View className="w-px bg-line" />
          <MetaCell label="Closeness">
            <DotScale value={position.closeness} />
          </MetaCell>
        </View>

        <View className="h-px bg-line" />

        <View className="flex-row">
          <MetaCell label="Effort">
            <DotScale value={position.effort} />
          </MetaCell>
          <View className="w-px bg-line" />
          <MetaCell label="Setting">
            <AppText variant="subtitle" numberOfLines={1}>
              {position.setting}
            </AppText>
          </MetaCell>
        </View>
      </View>

      <SectionTitle>The shape</SectionTitle>
      <AppText variant="body" className="max-w-[600px]">
        {position.setup}
      </AppText>

      <SectionTitle>How to arrive</SectionTitle>
      <NumberedSteps items={position.steps} />

      <SectionTitle>Why it works</SectionTitle>
      <AppText variant="body" className="max-w-[600px]">
        {position.why}
      </AppText>

      <SectionTitle>Small adjustments</SectionTitle>
      <BulletList items={position.tips} />

      <View className="mt-8">
        <NoteCard title="Care" text={position.care} />
      </View>

      <SectionTitle>Variations</SectionTitle>
      <BulletList items={position.variations} />

      {collections.length > 0 ? (
        <>
          <SectionTitle>In these collections</SectionTitle>
          <View className="gap-3">
            {collections.map((collection) => (
              <Pressable
                key={collection.slug}
                accessibilityRole="button"
                accessibilityLabel={`Collection: ${collection.title}`}
                accessibilityHint={collection.subtitle}
                onPress={() => {
                  haptics.tap();
                  router.push({
                    pathname: '/collection/[slug]',
                    params: { slug: collection.slug },
                  });
                }}
                className="flex-row items-center gap-4 rounded-card border border-line bg-surface p-4 active:opacity-60">
                <View className="flex-1">
                  <AppText variant="label">{collection.subtitle}</AppText>
                  <AppText variant="subtitle" className="mt-1 text-[16px] leading-6">
                    {collection.title}
                  </AppText>
                </View>
                <AppText variant="numeric">
                  {positionsIn(collection).length} plates
                </AppText>
                <ChevronRight size={16} color={colors.muted} strokeWidth={1.6} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <View className="mt-12">
        <Rule />
        <View className="flex-row">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Previous plate: ${previous.title}`}
            onPress={() => openPlate(previous)}
            className="flex-1 py-5 pr-3 active:opacity-60">
            <View className="flex-row items-center gap-2">
              <ChevronLeft size={15} color={colors.muted} strokeWidth={1.6} />
              <AppText variant="label">Previous</AppText>
            </View>
            <AppText variant="subtitle" className="mt-2 text-[16px] leading-6" numberOfLines={2}>
              {previous.title}
            </AppText>
          </Pressable>

          <View className="my-4 w-px bg-line" />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Next plate: ${next.title}`}
            onPress={() => openPlate(next)}
            className="flex-1 items-end py-5 pl-5 active:opacity-60">
            <View className="flex-row items-center gap-2">
              <AppText variant="label">Next</AppText>
              <ChevronRight size={15} color={colors.muted} strokeWidth={1.6} />
            </View>
            <AppText
              variant="subtitle"
              className="mt-2 text-right text-[16px] leading-6"
              numberOfLines={2}>
              {next.title}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
