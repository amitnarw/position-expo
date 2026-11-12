import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AccentEdition } from '@/theme/tokens';

export type Intent = 'learn' | 'explore' | 'connect';
export type Comfort = 'gentle' | 'curious' | 'adventurous';
export type ThemePreference = 'system' | 'light' | 'dark';

export const SETTINGS_KEY = 'forma.settings';

type SettingsState = {
  hydrated: boolean;
  ageVerified: boolean;
  onboarded: boolean;
  introDone: boolean;
  intent: Intent | null;
  comfort: Comfort | null;
  theme: ThemePreference;
  edition: AccentEdition;
  haptics: boolean;
  verifyAge: () => void;
  completeOnboarding: (input: { intent: Intent; comfort: Comfort }) => void;
  setIntroDone: () => void;
  setTheme: (theme: ThemePreference) => void;
  setEdition: (edition: AccentEdition) => void;
  setHaptics: (enabled: boolean) => void;
  personalizeAgain: () => void;
  resetAll: () => void;
  markHydrated: () => void;
};

const defaults = {
  ageVerified: false,
  onboarded: false,
  introDone: false,
  intent: null,
  comfort: null,
  theme: 'system' as ThemePreference,
  edition: 'clay' as AccentEdition,
  haptics: true,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      hydrated: false,
      verifyAge: () => set({ ageVerified: true }),
      completeOnboarding: ({ intent, comfort }) =>
        set({ intent, comfort, onboarded: true, introDone: false }),
      setIntroDone: () => set({ introDone: true }),
      setTheme: (theme) => set({ theme }),
      setEdition: (edition) => set({ edition }),
      setHaptics: (haptics) => set({ haptics }),
      personalizeAgain: () => set({ onboarded: false, introDone: false }),
      resetAll: () => {
        void Storage.removeItem(SETTINGS_KEY);
        set({ ...defaults, hydrated: true, ageVerified: false });
      },
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: SETTINGS_KEY,
      storage: createJSONStorage(() => Storage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
