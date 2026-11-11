import type { ReactNode } from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';
import { layout } from '@/theme/scale';

type ScreenProps = ViewProps & {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  bottomSpace?: number;
  contentClassName?: string;
};

export function Screen({
  children,
  scroll = false,
  padded = false,
  edges = ['top', 'left', 'right'],
  bottomSpace = 0,
  className,
  contentClassName,
  ...rest
}: ScreenProps) {
  const body = (
    <View className={cn('flex-1', padded && 'px-6', contentClassName)} {...rest}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-paper', className)}>
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
  );
}

export { layout };
