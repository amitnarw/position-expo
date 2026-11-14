import { useState, useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';

import { AdSlot } from '@/components/ads/AdSlot';
import { GuideRow } from '@/components/content/GuideRow';
import { PlateTile } from '@/components/content/PlateTile';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { allGuides, allPositions, type Guide, type Position } from '@/content';
import { useLibrary } from '@/store/library';
import { useTheme } from '@/theme/ThemeProvider';

const positionBySlug = new Map(allPositions.map((pos) => [pos.slug, pos]));
const guideBySlug = new Map(allGuides.map((guide) => [guide.slug, guide]));

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const favorites = useLibrary((state) => state.favorites);
  const favoriteGuides = useLibrary((state) => state.favoriteGuides ?? []);

  const savedPositions = useMemo(() => {
    return favorites
      .map((slug) => positionBySlug.get(slug))
      .filter((pos): pos is Position => Boolean(pos));
  }, [favorites]);

  const savedGuides = useMemo(() => {
    return favoriteGuides
      .map((slug) => guideBySlug.get(slug))
      .filter((guide): guide is Guide => Boolean(guide));
  }, [favoriteGuides]);

  const selectTab = (index: number) => {
    setTabIndex(index);
    pagerRef.current?.setPage(index);
  };

  return (
    <Screen edges={['top', 'bottom']} className="flex-1">
      {/* Top Header */}
      <View className="px-5 pb-3 pt-2">
        <View className="flex-row items-center gap-3">
          <IconButton
            icon={ChevronLeft}
            label="Back"
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/home' as any);
            }}
          />
          <View className="flex-1">
            <AppText variant="title" className="font-display">
              Saved
            </AppText>
          </View>
        </View>

        <AppText variant="subtitle" tone="muted" className="mt-2 text-[14px]">
          Your private collection of positions and guides
        </AppText>

        {/* Tab Selection with horizontal swipeable support */}
        <View className="flex-row items-center gap-2.5 pt-4">
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Positions, ${savedPositions.length} saved`}
            scaleTo={0.93}
            onPress={() => selectTab(0)}
            className="rounded-full px-5 py-2 border"
            style={{
              backgroundColor: tabIndex === 0 ? colors.surface2 : 'transparent',
              borderColor: tabIndex === 0 ? colors.line : 'transparent',
            }}>
            <AppText
              variant="caption"
              tone={tabIndex === 0 ? 'ink' : 'muted'}
              className={`text-[13px] ${tabIndex === 0 ? 'font-sans-semibold' : 'font-sans-medium'}`}>
              Positions ({savedPositions.length})
            </AppText>
          </PressableScale>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Guides, ${savedGuides.length} saved`}
            scaleTo={0.93}
            onPress={() => selectTab(1)}
            className="rounded-full px-5 py-2 border"
            style={{
              backgroundColor: tabIndex === 1 ? colors.surface2 : 'transparent',
              borderColor: tabIndex === 1 ? colors.line : 'transparent',
            }}>
            <AppText
              variant="caption"
              tone={tabIndex === 1 ? 'ink' : 'muted'}
              className={`text-[13px] ${tabIndex === 1 ? 'font-sans-semibold' : 'font-sans-medium'}`}>
              Guides ({savedGuides.length})
            </AppText>
          </PressableScale>
        </View>
      </View>

      {/* Swipeable Tab Pages */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setTabIndex(e.nativeEvent.position)}>
        {/* Positions Tab Page */}
        <View key="positions" style={{ flex: 1 }}>
          {savedPositions.length === 0 ? (
            <View
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 28,
                paddingBottom: 80,
              }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.surface2,
                  marginBottom: 16,
                }}>
                <Heart size={26} color={colors.muted} strokeWidth={1.6} />
              </View>
              <AppText variant="headline" style={{ textAlign: 'center' }}>
                No saved positions yet
              </AppText>
              <AppText
                variant="body"
                tone="muted"
                style={{ textAlign: 'center', marginTop: 8, maxWidth: 280 }}>
                Tap the heart on any position tile to keep it in your personal collection.
              </AppText>
            </View>
          ) : (
            <FlatList
              key="saved-positions-list"
              data={savedPositions}
              keyExtractor={(item) => item.slug}
              numColumns={2}
              renderItem={({ item, index }) => (
                <PlateTile position={item} index={index} />
              )}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: 50,
                gap: 12,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Guides Tab Page */}
        <View key="guides" style={{ flex: 1 }}>
          {savedGuides.length === 0 ? (
            <View
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 28,
                paddingBottom: 80,
              }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.surface2,
                  marginBottom: 16,
                }}>
                <Heart size={26} color={colors.muted} strokeWidth={1.6} />
              </View>
              <AppText variant="headline" style={{ textAlign: 'center' }}>
                No saved guides yet
              </AppText>
              <AppText
                variant="body"
                tone="muted"
                style={{ textAlign: 'center', marginTop: 8, maxWidth: 280 }}>
                Tap the heart on any guide to save it here for easy reading.
              </AppText>
            </View>
          ) : (
            <FlatList
              key="saved-guides-list"
              data={savedGuides}
              keyExtractor={(item) => item.slug}
              renderItem={({ item, index }) => (
                <GuideRow guide={item} index={index} />
              )}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: 50,
                gap: 14,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </PagerView>

      {/* Bottom Banner Ad */}
      <View className="items-center pb-2 pt-1 bg-transparent">
        <AdSlot />
      </View>
    </Screen>
  );
}
