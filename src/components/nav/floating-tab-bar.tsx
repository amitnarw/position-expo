import type { BottomTabBarProps } from 'expo-router/js-tabs';
import {
  Bookmark,
  BookOpen,
  Compass,
  Sun,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

type TabMeta = { icon: LucideIcon; label: string };

const TAB_META: Record<string, TabMeta> = {
  today: { icon: Sun, label: 'Today' },
  atlas: { icon: Compass, label: 'Atlas' },
  learn: { icon: BookOpen, label: 'Learn' },
  saved: { icon: Bookmark, label: 'Saved' },
};

const FALLBACK_META: TabMeta = { icon: Compass, label: 'Atlas' };

/**
 * In-flow floating pill. Hairline border, near-invisible lift, and a clay dot
 * for the active route — the only saturated mark in the chrome.
 */
export function FloatingTabBar({
  state,
  emitter,
  navigateToTab,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: insets.bottom + 6,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 999,
          paddingVertical: 8,
          paddingHorizontal: 6,
          shadowColor: colors.ink,
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}>
        {state.routes.map((route) => {
          const focused = state.routes[state.index]?.key === route.key;
          const meta = TAB_META[route.name] ?? FALLBACK_META;
          const Icon = meta.icon;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              hitSlop={8}
              onPress={() => {
                haptics.tap();
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigateToTab(route.key);
                }
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 2,
              }}>
              <Icon
                size={20}
                color={focused ? colors.ink : colors.muted}
                strokeWidth={1.7}
              />
              <AppText
                variant="label"
                tone={focused ? 'ink' : 'muted'}
                numberOfLines={1}
                className="mt-1">
                {meta.label}
              </AppText>
              <View
                style={{
                  marginTop: 4,
                  height: 4,
                  width: 4,
                  borderRadius: 999,
                  backgroundColor: focused ? colors.clay : 'transparent',
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
