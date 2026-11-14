import { Search, X } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { useTheme } from '@/theme/ThemeProvider';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/** A hairline pill, unfilled — the same outline language as the filter chips. */
export function SearchField({ value, onChange, placeholder = 'Search' }: SearchFieldProps) {
  const { colors } = useTheme();

  return (
    <View className="h-11 flex-row items-center gap-2.5 rounded-pill border border-line px-4">
      <Search size={17} color={colors.muted} strokeWidth={1.6} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        selectionColor={colors.ink}
        className="h-full flex-1 font-sans text-[15px] text-ink"
        accessibilityLabel="Search"
      />
      {value.length > 0 ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          haptic="none"
          scaleTo={0.86}
          hitSlop={8}
          onPress={() => onChange('')}
          className="h-6 w-6 items-center justify-center rounded-full bg-surface-3">
          <X size={13} color={colors.ink} strokeWidth={2} />
        </PressableScale>
      ) : null}
    </View>
  );
}
