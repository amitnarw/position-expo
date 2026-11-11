import * as SystemUI from 'expo-system-ui';
import { VariableContextProvider } from 'nativewind';
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { useSettings } from '@/store/settings';
import { cssVariablesFor, palettes, type AccentEdition, type Palette, type Scheme } from './tokens';

type ThemeValue = {
  scheme: Scheme;
  colors: Palette;
  edition: AccentEdition;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const appearance = useColorScheme();
  const preference = useSettings((state) => state.theme);
  const edition = useSettings((state) => state.edition);

  const scheme: Scheme = preference === 'system' ? (appearance === 'dark' ? 'dark' : 'light') : preference;
  const colors = palettes[scheme];

  useEffect(() => {
    Appearance.setColorScheme(preference === 'system' ? 'auto' : preference);
  }, [preference]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.paper).catch(() => {});
  }, [colors.paper]);

  const variables = useMemo(() => cssVariablesFor(scheme, edition), [scheme, edition]);
  const value = useMemo<ThemeValue>(
    () => ({ scheme, colors, edition, isDark: scheme === 'dark' }),
    [scheme, colors, edition],
  );

  return (
    <ThemeContext.Provider value={value}>
      <VariableContextProvider value={variables}>{children}</VariableContextProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return value;
}
