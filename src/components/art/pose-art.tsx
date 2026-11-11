import { Canvas, Group, Path } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { getArt, type ArtFigure } from '@/art/scene';
import { mixHex } from '@/lib/color';
import { useTheme } from '@/theme/ThemeProvider';

type PoseArtProps = {
  pose: string;
  /** Fixed square size. Omit to fill the parent width at 1:1. */
  size?: number;
  /** Slow breathing drift. Off by default. */
  animate?: boolean;
  /** Colour the whole plate with a single tone. */
  mono?: boolean;
  ground?: string;
  accessibilityLabel?: string;
};

const VIEWBOX = 1000;

export function PoseArt({ pose, size, animate = false, mono = false, ground }: PoseArtProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const [measured, setMeasured] = useState(0);

  const figures = useMemo(() => getArt(pose), [pose]);
  const dim = size ?? measured;
  const background = ground ?? colors.paper;

  const phase = useSharedValue(0);
  const active = animate && !reduceMotion;

  useEffect(() => {
    if (!active) {
      phase.value = 0;
      return;
    }
    phase.value = withRepeat(
      withTiming(1, { duration: 6800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [active, phase]);

  const transform = useDerivedValue(() => {
    if (!active) return [{ scale: 1 }];
    const s = 1 + phase.value * 0.012;
    const drift = phase.value * 6;
    return [
      { translateX: 500 },
      { translateY: 500 },
      { scale: s },
      { translateX: -500 },
      { translateY: -500 + drift },
    ];
  });

  // Keep hairlines ~1.4pt regardless of plate size.
  const strokeWidth = Math.min(5.5, Math.max(2, 1.45 * (VIEWBOX / Math.max(dim, 1))));

  const colorFor = (figure: ArtFigure) => {
    if (mono) return figure.depth === 'back' ? mixHex(colors.ink, background, 0.55) : colors.ink;
    const base = figure.tone === 'clay' ? colors.clay : colors.ink;
    return figure.depth === 'back' ? mixHex(base, background, 0.42) : base;
  };

  const paint = (width: number) => {
    if (!figures) return null;
    return (
      <Canvas style={{ width, height: width }}>
        <Group transform={transform}>
          {figures.map((figure, figureIndex) => {
            const tone = colorFor(figure);
            return (
              <Group key={`figure-${figureIndex}`}>
                {figure.halo.map((path, index) => (
                  <Path key={`halo-${index}`} path={path} style="fill" color={background} />
                ))}
                {figure.body.map((path, index) => (
                  <Group key={`body-${index}`}>
                    <Path path={path} style="fill" color={background} />
                    <Path
                      path={path}
                      style="stroke"
                      color={tone}
                      strokeWidth={strokeWidth}
                      strokeJoin="round"
                      strokeCap="round"
                    />
                  </Group>
                ))}
              </Group>
            );
          })}
        </Group>
      </Canvas>
    );
  };

  if (size) {
    return (
      <View
        style={{ width: size, height: size }}
        accessible={false}
        importantForAccessibility="no-hide-descendants">
        {paint(size)}
      </View>
    );
  }

  return (
    <View
      style={{ width: '100%', aspectRatio: 1 }}
      onLayout={(event: LayoutChangeEvent) => setMeasured(event.nativeEvent.layout.width)}
      accessible={false}
      importantForAccessibility="no-hide-descendants">
      {measured > 0 ? paint(measured) : null}
    </View>
  );
}
