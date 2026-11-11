import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { PoseArt } from '@/components/art/pose-art';
import { AppText } from '@/components/ui/app-text';
import type { Position } from '@/content';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';

function openPlate(slug: string) {
  haptics.tap();
  router.push({ pathname: '/plate/[slug]', params: { slug } });
}

type PlateCardProps = {
  position: Position;
  className?: string;
};

/**
 * Square plate mounted on a card. Fills the width of its parent, so use it
 * inside a fixed-width column or a flex-1 grid cell.
 */
export function PlateCard({ position, className }: PlateCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Plate ${position.plate}, ${position.title}`}
      accessibilityHint={position.commonName}
      onPress={() => openPlate(position.slug)}
      className={cn('flex-1 active:opacity-70', className)}>
      <View className="overflow-hidden rounded-card border border-line bg-surface">
        <PoseArt pose={position.pose} />
      </View>

      <View className="mt-3 flex-row items-baseline gap-2">
        <AppText variant="numeric" className="text-muted">
          {String(position.plate).padStart(2, '0')}
        </AppText>
        <AppText
          variant="subtitle"
          numberOfLines={1}
          className="flex-1 text-[16px] leading-6">
          {position.title}
        </AppText>
      </View>

      <AppText variant="small" numberOfLines={1} className="mt-0.5">
        {position.commonName}
      </AppText>
    </Pressable>
  );
}

type PlateRowProps = {
  position: Position;
  className?: string;
};

/** Compact horizontal plate row for lists and collections. */
export function PlateRow({ position, className }: PlateRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Plate ${position.plate}, ${position.title}`}
      accessibilityHint={position.commonName}
      onPress={() => openPlate(position.slug)}
      className={cn('flex-row items-center gap-4 py-3 active:opacity-60', className)}>
      <View className="overflow-hidden rounded-xl border border-line bg-surface">
        <PoseArt pose={position.pose} size={64} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-baseline gap-2">
          <AppText variant="numeric" className="text-muted">
            {String(position.plate).padStart(2, '0')}
          </AppText>
          <AppText variant="subtitle" numberOfLines={1} className="flex-1 text-[16px] leading-6">
            {position.title}
          </AppText>
        </View>
        <AppText variant="small" numberOfLines={1} className="mt-0.5">
          {position.commonName}
        </AppText>
      </View>
    </Pressable>
  );
}
