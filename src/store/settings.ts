import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

export const SETTINGS_KEY = 'forma.settings';

/**
 * Deliberately tiny. Everything a new user needs is on by default; the only
 * real gate is the one-button welcome screen.
 */
type SettingsState = {
  hydrated: boolean;
  onboarded: boolean;
  adsConsented: boolean;
  theme: ThemePreference;
  haptics: boolean;
  enter: () => void;
  setAdsConsented: (consented: boolean) => void;
  setTheme: (theme: ThemePreference) => void;
  setHaptics: (enabled: boolean) => void;
  resetAll: () => void;
  markHydrated: () => void;
};

const defaults = {
  onboarded: false,
  // Test builds show AdMob sandbox creatives by default; the Settings switch
  // lets a tester turn them off. Real monetisation is a separate decision.
  adsConsented: true,
  // The app is designed dark-first; System and Light stay available.
  theme: 'dark' as ThemePreference,
  haptics: true,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      hydrated: false,
      enter: () => set({ onboarded: true }),
      setAdsConsented: (adsConsented: boolean) => set({ adsConsented }),
      setTheme: (theme) => set({ theme }),
      setHaptics: (haptics) => set({ haptics }),
      resetAll: () => {
        void Storage.removeItem(SETTINGS_KEY);
        set({ ...defaults, hydrated: true });
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
