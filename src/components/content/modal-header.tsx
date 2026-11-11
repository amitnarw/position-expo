import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';

type ModalHeaderProps = {
  /** Small centred plate/guide label. */
  label?: string;
  /** Optional action on the right. Reserves the same width when absent. */
  right?: ReactNode;
};

/**
 * Quiet top bar for modal screens. Close on the left, a centred numeric
 * label, and an optional action on the right.
 */
export function ModalHeader({ label, right }: ModalHeaderProps) {
  return (
    <View className="flex-row items-center justify-between pt-2 pb-4">
      <IconButton icon={ChevronLeft} label="Close" onPress={() => router.back()} />

      <View className="flex-1 items-center px-2">
        {label ? (
          <AppText variant="numeric" numberOfLines={1}>
            {label}
          </AppText>
        ) : null}
      </View>

      <View className="h-11 w-11 items-center justify-center">{right}</View>
    </View>
  );
}
