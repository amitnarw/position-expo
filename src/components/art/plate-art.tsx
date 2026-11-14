import { Image, View } from 'react-native';

import { plateImage } from '@/art/plate-images';
import { useTheme } from '@/theme/ThemeProvider';

type PlateArtProps = {
  slug: string;
  /** Fixed square size in dp. Omit to fill the parent's width at 1:1. */
  size?: number;
};

/**
 * Pre-rendered plate art. Grids use these bitmaps instead of mounting a Skia
 * canvas per tile, which is what used to make scrolling stutter.
 *
 * The square is owned by a wrapper View: RN's Image uses the asset's intrinsic
 * pixel size for height when only the width is set, so the aspect ratio has to
 * live one level above it.
 */
export function PlateArt({ slug, size }: PlateArtProps) {
  const { scheme } = useTheme();
  const source = plateImage(slug, scheme);

  return (
    <View style={size ? { width: size, height: size } : { width: '100%', aspectRatio: 1 }}>
      <Image
        source={source}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        fadeDuration={180}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}
