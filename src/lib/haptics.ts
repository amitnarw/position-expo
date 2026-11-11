import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useSettings } from '@/store/settings';

function enabled() {
  return Platform.OS !== 'web' && useSettings.getState().haptics;
}

export const haptics = {
  tap() {
    if (!enabled()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  press() {
    if (!enabled()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  select() {
    if (!enabled()) return;
    Haptics.selectionAsync().catch(() => {});
  },
  success() {
    if (!enabled()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warn() {
    if (!enabled()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
};
