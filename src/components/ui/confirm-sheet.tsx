import { useEffect, useState } from 'react';
import { Animated, Easing, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { withAlpha } from '@/lib/color';

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Destructive decisions belong to the same surface language as everything else,
 * so they arrive as a sheet instead of the platform's Material dialog. The
 * backdrop is a flat scrim; nothing here uses a shadow.
 */
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = 'Reset',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return;
    }

    Animated.timing(progress, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, visible]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [36, 0] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onCancel}
          className="absolute inset-0"
          style={{ backgroundColor: withAlpha('#000000', 0.62) }}
        />

        <Animated.View
          accessibilityViewIsModal
          style={{ opacity: progress, transform: [{ translateY }] }}>
          <View
            className="rounded-t-sheet bg-surface px-6 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}>
            <View className="mb-6 h-1 w-10 self-center rounded-pill bg-line" />

            <AppText variant="headline" className="text-[22px]">
              {title}
            </AppText>
            <AppText variant="body" className="mt-2.5">
              {message}
            </AppText>

            <View className="mt-7 gap-3">
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
                scaleTo={0.98}
                onPress={onConfirm}
                className="h-12 items-center justify-center rounded-pill border border-danger">
                <AppText variant="button" tone="danger">
                  {confirmLabel}
                </AppText>
              </PressableScale>

              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={cancelLabel}
                scaleTo={0.98}
                onPress={onCancel}
                className="h-12 items-center justify-center rounded-pill border border-line">
                <AppText variant="button" tone="ink">
                  {cancelLabel}
                </AppText>
              </PressableScale>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
