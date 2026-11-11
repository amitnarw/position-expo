import { router } from 'expo-router';
import { Alert, View, useWindowDimensions } from 'react-native';

import { PlateCard, PlateRow } from '@/components/plates/plate-card';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { allPositions, type Position } from '@/content';
import { haptics } from '@/lib/haptics';
import { useLibrary } from '@/store/library';
import { layout } from '@/theme/scale';

const positionBySlug = new Map(allPositions.map((position) => [position.slug, position]));

function toPositions(slugs: string[]): Position[] {
  return slugs
    .map((slug) => positionBySlug.get(slug))
    .filter((position): position is Position => Boolean(position));
}

export default function SavedScreen() {
  const favorites = useLibrary((state) => state.favorites);
  const history = useLibrary((state) => state.history);
  const { width } = useWindowDimensions();

  const saved = toPositions(favorites);
  const recent = toPositions(history);
  const columnWidth = (Math.min(width, layout.maxWidth) - 48 - 16) / 2;
  const isEmpty = saved.length === 0 && recent.length === 0;

  const confirmClearHistory = () => {
    Alert.alert(
      'Clear history?',
      'This removes the plates you have opened. Saved plates stay.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            haptics.warn();
            useLibrary.getState().clearHistory();
          },
        },
      ],
    );
  };

  return (
    <Screen
      scroll
      edges={['top']}
      bottomSpace={40}
      contentClassName="px-6 pt-2"
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <View className="mt-10">
        <AppText variant="label">Saved</AppText>
        <AppText variant="display" className="mt-3 max-w-[560px]">
          Your shortlist.
        </AppText>
        <AppText variant="body" className="mt-4 max-w-[600px]">
          Plates you have set aside and the ones you looked at last.
        </AppText>
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center py-24">
          <AppText variant="display" className="max-w-[340px] text-center font-display-italic">
            Nothing set aside yet.
          </AppText>
          <AppText variant="body" className="mt-4 max-w-[320px] text-center">
            Save a plate with the bookmark on its page. It will wait here.
          </AppText>
          <Button
            label="Browse the atlas"
            variant="secondary"
            onPress={() => {
              haptics.tap();
              router.push('/atlas');
            }}
            className="mt-7"
          />
        </View>
      ) : null}

      {saved.length > 0 ? (
        <View className="mt-10">
          <AppText variant="numeric">
            {String(saved.length).padStart(2, '0')} saved
          </AppText>

          <View className="mt-4 flex-row flex-wrap justify-between">
            {saved.map((position) => (
              <View key={position.slug} style={{ width: columnWidth }} className="mb-7">
                <PlateCard position={position} />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {recent.length > 0 ? (
        <View className="mt-6">
          <SectionHeader
            label="History"
            title="Recently opened"
            actionLabel="Clear"
            onAction={confirmClearHistory}
          />

          <View className="mt-4">
            {recent.map((position, index) => (
              <View key={position.slug}>
                {index > 0 ? <Rule /> : null}
                <PlateRow position={position} />
              </View>
            ))}
          </View>
        </View>
      ) : null}

    </Screen>
  );
}
