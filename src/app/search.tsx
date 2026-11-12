import { router } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Rule } from '@/components/ui/rule';
import { search, type SearchHit } from '@/content';
import { haptics } from '@/lib/haptics';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

const suggestions = ['consent', 'slow', 'wall', 'beginner', 'oral', 'side lying'];

const groups: { kind: SearchHit['kind']; label: string }[] = [
  { kind: 'position', label: 'Plates' },
  { kind: 'guide', label: 'Guides' },
  { kind: 'collection', label: 'Collections' },
];

const kindLabel: Record<SearchHit['kind'], string> = {
  position: 'Plate',
  guide: 'Guide',
  collection: 'Collection',
};

function openHit(hit: SearchHit) {
  haptics.tap();

  if (hit.kind === 'position') {
    router.push({ pathname: '/plate/[slug]', params: { slug: hit.slug } });
    return;
  }

  if (hit.kind === 'guide') {
    router.push({ pathname: '/guide/[slug]', params: { slug: hit.slug } });
    return;
  }

  router.push({ pathname: '/collection/[slug]', params: { slug: hit.slug } });
}

export default function SearchScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const results = useMemo(() => search(query, 40), [query]);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-paper">
      <View
        className="flex-1"
        style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
        <View className="px-6">
          <View className="flex-row items-center gap-3 pt-2 pb-4">
            <View className="flex-1 flex-row items-center rounded-pill border border-line bg-surface px-4">
              <Search size={16} color={colors.muted} strokeWidth={1.8} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                autoFocus
                placeholder="Search the atlas"
                placeholderTextColor={colors.muted}
                returnKeyType="search"
                clearButtonMode="while-editing"
                accessibilityLabel="Search the atlas"
                className="ml-2 flex-1 py-3 font-sans text-body"
                style={{ color: colors.ink }}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel search"
              onPress={() => router.back()}
              hitSlop={8}
              className="py-2 active:opacity-60">
              <AppText variant="small" className="font-sans-medium">
                Cancel
              </AppText>
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {query.trim().length === 0 ? (
          <View className="pt-6">
            <AppText variant="label">Try</AppText>
            <View className="mt-4 flex-row flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  onPress={() => setQuery(suggestion)}
                />
              ))}
            </View>
            <AppText variant="small" className="mt-8 max-w-[420px]">
              Search by plate name, plain-language name, pace, setting, or the subject of a guide.
            </AppText>
          </View>
        ) : null}

        {query.trim().length > 0 && results.length === 0 ? (
          <View className="pt-10">
            <AppText
              variant="display"
              className="font-display-italic text-[40px] leading-[46px]">
              Nothing under that word yet.
            </AppText>
            <AppText variant="body" className="mt-4 max-w-[420px]">
              Try a plainer word — a setting, a pace, or a part of the body. Searching for “slow”
              or “bed” usually finds something.
            </AppText>
          </View>
        ) : null}

        {query.trim().length > 0
          ? groups.map((group) => {
              const hits = results.filter((hit) => hit.kind === group.kind);
              if (hits.length === 0) return null;

              return (
                <View key={group.kind} className="mt-6">
                  <AppText variant="label">{group.label}</AppText>
                  <View className="mt-2">
                    <Rule />
                  </View>

                  {hits.map((hit) => (
                    <Pressable
                      key={`${hit.kind}:${hit.slug}`}
                      accessibilityRole="button"
                      accessibilityLabel={`${kindLabel[hit.kind]}: ${hit.title}`}
                      accessibilityHint={hit.subtitle}
                      onPress={() => openHit(hit)}
                      className="flex-row items-center gap-3 py-4 active:opacity-60">
                      <View className="flex-1">
                        <AppText variant="subtitle" className="text-[17px] leading-6">
                          {hit.title}
                        </AppText>
                        <AppText variant="small" className="mt-0.5" numberOfLines={1}>
                          {hit.subtitle}
                        </AppText>
                      </View>

                      <AppText variant="label">{kindLabel[hit.kind]}</AppText>
                      <ChevronRight size={16} color={colors.muted} strokeWidth={1.6} />
                    </Pressable>
                  ))}
                </View>
              );
            })
          : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
