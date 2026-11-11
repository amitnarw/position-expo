import { View } from 'react-native';

import { cn } from '@/lib/cn';

export function Rule({ className }: { className?: string }) {
  return <View className={cn('h-px w-full bg-line', className)} />;
}
