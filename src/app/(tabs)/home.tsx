import { router, useFocusEffect } from 'expo-router';
import { Heart, Moon, Search, Sun } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Animated, FlatList, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { consumePendingInterstitial, useInterstitial } from '@/ads/adManager';
import { adConfig } from '@/ads/config';
import { GuideNativeAdCard } from '@/components/ads/GuideNativeAdCard';
import { NativeAdMobCard } from '@/components/ads/NativeAdMobCard';
import { GuideRow } from '@/components/content/GuideRow';
import { PlateTile } from '@/components/content/PlateTile';
import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { allGuides, allPositions, type Guide, type Position } from '@/content';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

type Section = 'plates' | 'guides';

type GridItem =
  | { kind: 'plate'; position: Position }
  | { kind: 'native-ad'; id: string }
  | { kind: 'spacer' };

type GuideItem =
  | { kind: 'guide'; guide: Guide }
  | { kind: 'guide-ad'; id: string };

function padGridItems(items: GridItem[]): GridItem[] {
  return items.length % 2 === 0 ? items : [...items, { kind: 'spacer' }];
}

export default function HomeScreen() {
  const { colors, scheme } = useTheme();
  const [section, setSection] = useState<Section>('plates');
  const setTheme = useSettings((state) => state.setTheme);
  const adsConsented = useSettings((state) => state.adsConsented);
  const { show } = useInterstitial({ firstOpen: false });
  const [scrollY] = useState(() => new Animated.Value(0));

  const topFadeOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 24],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const onScrollEvent = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY],
  );

  // 2-column grid of positions with integrated native AdMob ads
  const plateGridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = [];
    allPositions.forEach((position, idx) => {
      items.push({ kind: 'plate', position });
      // After every 3 rows (6 positions), insert a native ad
      if (adsConsented && (idx + 1) % 6 === 0) {
        items.push({
          kind: 'native-ad',
          id: `native-ad-${idx}`,
        });
      }
    });
    return padGridItems(items);
  }, [adsConsented]);

  // Guides list with native ads inserted after every 6 guide cards
  const guideListItems = useMemo<GuideItem[]>(() => {
    const items: GuideItem[] = [];
    allGuides.forEach((guide, idx) => {
      items.push({ kind: 'guide', guide });
      if (adsConsented && (idx + 1) % 6 === 0) {
        items.push({
          kind: 'guide-ad',
          id: `guide-ad-${idx}`,
        });
      }
    });
    return items;
  }, [adsConsented]);

  useFocusEffect(
    useCallback(() => {
      if (!consumePendingInterstitial()) return;
      const zone = adConfig.zones.interstitial;
      if (zone) void show(zone);
    }, [show]),
  );

  const header = (
    <View className="px-5 pb-2 pt-2">
      {/* Top action row: App name on left, action buttons on right */}
      <View className="flex-row items-center justify-between">
        <AppText variant="display" className="text-[32px] leading-[36px] font-display">
          Forma
        </AppText>

        <View className="flex-row items-center gap-2.5">
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Search"
            scaleTo={0.9}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
              borderWidth: 1,
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => router.push('/search' as any)}>
            <Search size={18} color={colors.ink} strokeWidth={1.9} />
          </PressableScale>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Saved favorites"
            scaleTo={0.9}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
              borderWidth: 1,
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => router.push('/favorites' as any)}>
            <Heart size={18} color={colors.ink} fill="transparent" strokeWidth={1.9} />
          </PressableScale>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Theme toggle"
            scaleTo={0.9}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
              borderWidth: 1,
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => setTheme(scheme === 'dark' ? 'light' : 'dark')}>
            {scheme === 'dark' ? (
              <Sun size={17} color={colors.ink} strokeWidth={1.9} />
            ) : (
              <Moon size={17} color={colors.ink} strokeWidth={1.9} />
            )}
          </PressableScale>
        </View>
      </View>

      <AppText variant="subtitle" tone="muted" className="mt-1 text-[13.5px]">
        The reference for closeness
      </AppText>

      {/* Two section tabs: Positions & Guides only */}
      <View className="flex-row items-center gap-2.5 pt-3.5 pb-1">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Positions"
          scaleTo={0.93}
          onPress={() => setSection('plates')}
          style={{
            backgroundColor: section === 'plates' ? colors.surface2 : 'transparent',
            borderColor: section === 'plates' ? colors.line : 'transparent',
            borderWidth: 1,
          }}
          className="rounded-full px-5 py-2">
          <AppText
            variant="caption"
            tone={section === 'plates' ? 'ink' : 'muted'}
            className={`text-[13px] ${
              section === 'plates' ? 'font-sans-semibold' : 'font-sans-medium'
            }`}>
            Positions
          </AppText>
        </PressableScale>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Guides"
          scaleTo={0.93}
          onPress={() => setSection('guides')}
          style={{
            backgroundColor: section === 'guides' ? colors.surface2 : 'transparent',
            borderColor: section === 'guides' ? colors.line : 'transparent',
            borderWidth: 1,
          }}
          className="rounded-full px-5 py-2">
          <AppText
            variant="caption"
            tone={section === 'guides' ? 'ink' : 'muted'}
            className={`text-[13px] ${
              section === 'guides' ? 'font-sans-semibold' : 'font-sans-medium'
            }`}>
            Guides
          </AppText>
        </PressableScale>
      </View>
    </View>
  );

  const empty = (title: string, body: string) => (
    <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 40 }}>
      <AppText variant="headline" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText variant="body" tone="muted" style={{ textAlign: 'center', marginTop: 8, maxWidth: 280 }}>
        {body}
      </AppText>
    </View>
  );

  const topFadeColor = scheme === 'dark' ? '#141211' : '#E4DCD2';

  return (
    <Screen edges={['top', 'left', 'right']} className="flex-1">
      {header}

      <View className="flex-1 relative">
        {section === 'plates' ? (
          <FlatList
            key="plates"
            data={plateGridItems}
            keyExtractor={(item, index) =>
              item.kind === 'plate'
                ? `plate-${item.position.slug}`
                : item.kind === 'native-ad'
                  ? `ad-${item.id}`
                  : `spacer-${index}`
            }
            numColumns={2}
            onScroll={onScrollEvent}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              if (item.kind === 'plate') {
                return <PlateTile position={item.position} index={index} />;
              }
              if (item.kind === 'native-ad') {
                return <NativeAdMobCard index={index} />;
              }
              return <View className="flex-1" />;
            }}
            columnWrapperStyle={plateGridItems.length > 0 ? { gap: 12 } : undefined}
            contentContainerStyle={
              plateGridItems.length === 0
                ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 220 }
                : {
                    paddingHorizontal: 20,
                    paddingTop: 12,
                    paddingBottom: 220,
                    gap: 12,
                  }
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={empty(
              'Nothing here yet',
              'Explore the library or explore guides.',
            )}
          />
        ) : null}

        {section === 'guides' ? (
          <FlatList
            key="guides"
            data={guideListItems}
            keyExtractor={(item) => (item.kind === 'guide' ? item.guide.slug : item.id)}
            onScroll={onScrollEvent}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              if (item.kind === 'guide') {
                return <GuideRow guide={item.guide} index={index} />;
              }
              return <GuideNativeAdCard index={index} />;
            }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 220,
              gap: 14,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          />
        ) : null}

        {/* Dynamic Top Edge Fade (visible only during upward scroll, tucked behind tabs with zero harsh lines) */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -14,
            left: 0,
            right: 0,
            height: 38,
            zIndex: 10,
            opacity: topFadeOpacity,
          }}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="homeTopFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={topFadeColor} stopOpacity="1" />
                <Stop offset="35%" stopColor={topFadeColor} stopOpacity="0.75" />
                <Stop offset="70%" stopColor={topFadeColor} stopOpacity="0.25" />
                <Stop offset="100%" stopColor={topFadeColor} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#homeTopFade)" />
          </Svg>
        </Animated.View>
      </View>
    </Screen>
  );
}
