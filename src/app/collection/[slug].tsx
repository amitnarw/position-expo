import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { PoseArt } from '@/components/art/pose-art';
import { ModalHeader } from '@/components/content/modal-header';
import { PlateRow } from '@/components/plates/plate-card';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { getCollection, positionsIn } from '@/content';
import { layout } from '@/theme/scale';

function CollectionNotFound() {
  return (
    <Screen edges={['top', 'bottom']} padded>
      <View className="pt-2 pb-4">
        <IconButton icon={ChevronLeft} label="Close" onPress={() => router.back()} />
      </View>
      <View className="flex-1 items-center justify-center pb-24">
        <AppText variant="title" className="text-center font-display-italic">
          Collection not found.
        </AppText>
        <AppText variant="body" className="mt-3 max-w-[320px] text-center">
          This path may have been renamed. The atlas still holds every plate.
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

export default function CollectionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const collection = getCollection(slug);

  if (!collection) {
    return <CollectionNotFound />;
  }

  const positions = positionsIn(collection);
  const preview = positions.slice(0, 3);

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      padded
      bottomSpace={48}
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <ModalHeader label="COLLECTION" />

      <AppText variant="label">{collection.subtitle}</AppText>
      <AppText variant="display" className="mt-3">
        {collection.title}
      </AppText>
      <AppText variant="body" className="mt-4 max-w-[600px]">
        {collection.intro}
      </AppText>

      {preview.length > 0 ? (
        <View className="mt-8 flex-row gap-2">
          {preview.map((position) => (
            <View
              key={position.slug}
              className="flex-1 overflow-hidden rounded-card border border-line bg-surface">
              <PoseArt pose={position.pose} />
            </View>
          ))}
        </View>
      ) : null}

      <View className="mt-4">
        <AppText variant="numeric">
          {positions.length} {positions.length === 1 ? 'plate' : 'plates'}
        </AppText>
      </View>

      <View className="mt-6">
        {positions.map((position, index) => (
          <View key={position.slug}>
            {index > 0 ? <Rule /> : null}
            <PlateRow position={position} />
          </View>
        ))}
      </View>
    </Screen>
  );
}
