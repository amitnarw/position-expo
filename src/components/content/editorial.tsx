import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { cn } from '@/lib/cn';

/**
 * A quiet section heading: a small muted label with a hairline running to
 * the edge of the column.
 */
export function SectionTitle({ children, className }: { children: string; className?: string }) {
  return (
    <View className={cn('mt-10 mb-4', className)}>
      <AppText variant="label">{children}</AppText>
    </View>
  );
}

/** Numbered instructions with serif numerals, quiet against the text. */
export function NumberedSteps({ items }: { items: string[] }) {
  return (
    <View className="gap-5">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start gap-4">
          <AppText className="w-7 font-display text-[21px] leading-7 text-muted">
            {String(index + 1).padStart(2, '0')}
          </AppText>
          <AppText variant="body" className="flex-1 max-w-[560px]">
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

/** A plain list marked with short hairlines instead of bullets. */
export function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <View className={cn('gap-4', className)}>
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start gap-4">
          <View className="mt-[12px] h-px w-3 bg-muted" />
          <AppText variant="body" className="flex-1 max-w-[560px]">
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

/** A soft surface for care notes and asides. */
export function NoteCard({
  title,
  text,
  children,
}: {
  title?: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <View className="rounded-card bg-surface p-5">
      {title ? (
        <AppText variant="label" className="mb-2.5">
          {title}
        </AppText>
      ) : null}
      {text ? (
        <AppText variant="body" className="max-w-[560px]">
          {text}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}
