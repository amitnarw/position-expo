import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';

type SectionHeaderProps = {
  label?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('flex-row items-end justify-between gap-4', className)}>
      <View className="flex-1">
        {label ? (
          <AppText variant="label" className="mb-2">
            {label}
          </AppText>
        ) : null}
        <AppText variant="headline">{title}</AppText>
      </View>

      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={() => {
            haptics.tap();
            onAction();
          }}
          hitSlop={8}
          className="pb-1 active:opacity-60">
          <AppText variant="small" tone="accent" className="font-sans-medium">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
