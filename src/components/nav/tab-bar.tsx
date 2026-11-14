import type { MaterialTopTabBarProps } from 'expo-router/js-top-tabs';
import { BlurView } from 'expo-blur';
import { House, Settings2, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { AdSlot } from '@/components/ads/AdSlot';
import { AppText } from '@/components/ui/app-text';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

type TabMeta = { icon: LucideIcon; label: string };

const TAB_META: Record<string, TabMeta> = {
  home: { icon: House, label: 'Home' },
  settings: { icon: Settings2, label: 'Settings' },
};

const FALLBACK_META: TabMeta = { icon: House, label: 'Home' };

/**
 * Floating bottom navigation dock with frosted glass and blur effect.
 * Sits elevated above screen content with a Banner Ad placed directly below it.
 */
export function TabBar({
  state,
  descriptors,
  emitter,
  insets,
  position,
  jumpTo,
}: MaterialTopTabBarProps) {
  const { colors, scheme } = useTheme();
  const isDark = scheme === 'dark';
  const [rowWidth, setRowWidth] = useState(0);

  const routeCount = Math.max(state.routes.length, 1);
  const cell = rowWidth / routeCount;
  // Increased width of the active pill (92% of cell width)
  const pillWidth = cell * 0.92;
  const pillInset = (cell - pillWidth) / 2;

  const pillTranslate = position.interpolate({
    inputRange: state.routes.map((_, index) => index),
    outputRange: state.routes.map((_, index) => index * cell + pillInset),
    extrapolate: 'clamp',
  });

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 9999,
        paddingBottom: Math.max(insets.bottom, 8),
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
      {/* Floating navigation pill with frosted glass and blur effect (no border) */}
      <View
        style={{
          width: '90%',
          maxWidth: 390,
          borderRadius: 999,
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(28, 23, 21, 0.82)' : 'rgba(255, 255, 255, 0.88)',
          borderWidth: 0,
          paddingHorizontal: 4,
          paddingVertical: 4,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 16,
          elevation: 12,
        }}>
        {/* Blur backdrop with native Dimezis blur */}
        <BlurView
          intensity={85}
          tint={isDark ? 'dark' : 'light'}
          blurMethod="dimezisBlurView"
          style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
        />

        <View
          className="relative flex-row"
          style={{ height: 50 }}
          onLayout={(event) => setRowWidth(event.nativeEvent.layout.width)}>
          {cell > 0 ? (
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 2,
                bottom: 2,
                left: 0,
                width: pillWidth,
                borderRadius: 999,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.06)',
                transform: [{ translateX: pillTranslate }],
              }}
            />
          ) : null}

          {state.routes.map((route) => {
            const focused = state.routes[state.index]?.key === route.key;
            const meta = TAB_META[route.name] ?? FALLBACK_META;
            const Icon = meta.icon;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel={
                  descriptors[route.key]?.options.tabBarAccessibilityLabel ?? meta.label
                }
                accessibilityState={{ selected: focused }}
                onPress={() => {
                  haptics.select();
                  const event = emitter.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (event.defaultPrevented || focused) return;
                  jumpTo(route.key);
                }}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-full"
                style={{ overflow: 'hidden' }}>
                <Icon
                  size={19}
                  color={focused ? colors.ink : colors.muted}
                  strokeWidth={focused ? 1.9 : 1.6}
                />
                <AppText
                  variant="small"
                  tone={focused ? 'ink' : 'muted'}
                  className={cn(focused ? 'font-sans-semibold' : 'font-sans-medium')}>
                  {meta.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Banner Ad below the floating nav bar */}
      <AdSlot variant="dock" />
    </View>
  );
}
