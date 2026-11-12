import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import { PlateCard } from '@/components/plates/plate-card';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Screen } from '@/components/ui/screen';
import { allPositions } from '@/content';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { layout } from '@/theme/scale';

type Filter = 'all' | 'slow' | 'steady' | 'playful' | 'low';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'slow', label: 'Slow' },
  { id: 'steady', label: 'Steady' },
  { id: 'playful', label: 'Playful' },
  { id: 'low', label: 'Low effort' },
];

export default function AtlasScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<Filter>('all');

  const contentWidth = Math.min(width, layout.maxWidth);
  const cellWidth = (contentWidth - 48 - 16) / 2;

  const plates = useMemo(() => {
    switch (filter) {
      case 'all':
        return allPositions;
      case 'low':
        return allPositions.filter((position) => position.effort <= 2);
      default:
        return allPositions.filter((position) => position.pace === filter);
    }
  }, [filter]);

  return (
    <Screen
      scroll
      edges={['top']}
      bottomSpace={40}
      contentClassName="px-6 pt-2"
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <View className="mt-10">
        <AppText variant="label">The atlas</AppText>
        <AppText variant="display" className="mt-3">
          Thirty-six plates
        </AppText>
        <AppText variant="body" className="mt-5 max-w-[340px]">
          Abstract line studies, drawn to be read rather than looked at.
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search plates, guides, collections"
        onPress={() => {
          haptics.tap();
          router.push('/search');
        }}
        className="mt-8 flex-row items-center gap-3 rounded-pill border border-line bg-surface px-4 py-3 active:opacity-70">
        <Search size={18} color={colors.muted} strokeWidth={1.7} />
        <AppText variant="small" numberOfLines={1} className="flex-1">
          Search plates, guides, collections
        </AppText>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -24, marginTop: 20 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingVertical: 2 }}>
        {FILTERS.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={filter === item.id}
            onPress={() => setFilter(item.id)}
          />
        ))}
      </ScrollView>

      <View className="mt-6 flex-row items-baseline justify-between">
        <AppText variant="numeric">{`${plates.length} ${plates.length === 1 ? 'plate' : 'plates'}`}</AppText>
        <AppText variant="caption">By plate</AppText>
      </View>

      {plates.length > 0 ? (
        <View className="mt-5 flex-row flex-wrap justify-between">
          {plates.map((position) => (
            <View key={position.slug} style={{ width: cellWidth, marginBottom: 28 }}>
              <PlateCard position={position} />
            </View>
          ))}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center py-20">
          <AppText variant="body" tone="muted" className="text-center">
            No plates match that filter.
          </AppText>
          <View className="mt-5">
            <Chip label="Show all" onPress={() => setFilter('all')} />
          </View>
        </View>
      )}
    </Screen>
  );
}
