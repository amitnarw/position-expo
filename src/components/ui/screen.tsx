import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { cn } from '@/lib/cn';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

type ScreenProps = ViewProps & {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  bottomSpace?: number;
  contentClassName?: string;
  gradient?: boolean;
};

export function Screen({
  children,
  scroll = false,
  padded = false,
  edges = ['top', 'left', 'right'],
  bottomSpace = 0,
  className,
  contentClassName,
  gradient = true,
  ...rest
}: ScreenProps) {
  const { scheme } = useTheme();

  const body = (
    <View className={cn('flex-1', padded && 'px-5', contentClassName)} {...rest}>
      {children}
    </View>
  );

  return (
    // SafeAreaView comes from react-native-safe-area-context, which is NOT
    // CSS-aware: it silently ignores `className`. The flex/background therefore
    // live on this wrapper, and the SafeAreaView is only responsible for insets.
    <View className={cn('flex-1 bg-paper', className)} style={{ position: 'relative' }}>
      {gradient ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              {scheme === 'dark' ? (
                <LinearGradient id="screenBgGradDark" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#060606" />
                  <Stop offset="12%" stopColor="#0C0B0A" />
                  <Stop offset="25%" stopColor="#221E1D" />
                  <Stop offset="45%" stopColor="#272220" />
                  <Stop offset="70%" stopColor="#231F1D" />
                  <Stop offset="100%" stopColor="#1C1817" />
                </LinearGradient>
              ) : (
                <LinearGradient id="screenBgGradLight" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#D4CABE" />
                  <Stop offset="12%" stopColor="#DED5CA" />
                  <Stop offset="25%" stopColor="#EFE8DE" />
                  <Stop offset="45%" stopColor="#F6F2EC" />
                  <Stop offset="70%" stopColor="#FBF9F5" />
                  <Stop offset="100%" stopColor="#FCFAF7" />
                </LinearGradient>
              )}
            </Defs>
            <Rect
              width="100%"
              height="100%"
              fill={scheme === 'dark' ? 'url(#screenBgGradDark)' : 'url(#screenBgGradLight)'}
            />
          </Svg>
        </View>
      ) : null}
      <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: 'transparent' }}>
        {scroll ? (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: bottomSpace, flexGrow: 1 }}>
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </SafeAreaView>
    </View>
  );
}

export { layout };
