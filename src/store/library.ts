import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const LIBRARY_KEY = 'forma.library';

const HISTORY_LIMIT = 24;

type LibraryState = {
  hydrated: boolean;
  favorites: string[];
  favoriteGuides: string[];
  history: string[];
  toggleFavorite: (slug: string) => void;
  toggleFavoriteGuide: (slug: string) => void;
  recordView: (slug: string) => void;
  clearHistory: () => void;
  resetAll: () => void;
  markHydrated: () => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      favorites: [],
      favoriteGuides: [],
      history: [],
      toggleFavorite: (slug) => {
        const favorites = get().favorites;
        set({
          favorites: favorites.includes(slug)
            ? favorites.filter((item) => item !== slug)
            : [slug, ...favorites],
        });
      },
      toggleFavoriteGuide: (slug) => {
        const favoriteGuides = get().favoriteGuides ?? [];
        set({
          favoriteGuides: favoriteGuides.includes(slug)
            ? favoriteGuides.filter((item) => item !== slug)
            : [slug, ...favoriteGuides],
        });
      },
      recordView: (slug) => {
        const history = get().history.filter((item) => item !== slug);
        set({ history: [slug, ...history].slice(0, HISTORY_LIMIT) });
      },
      clearHistory: () => set({ history: [] }),
      resetAll: () => {
        void Storage.removeItem(LIBRARY_KEY);
        set({ hydrated: true, favorites: [], favoriteGuides: [], history: [] });
      },
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: LIBRARY_KEY,
      storage: createJSONStorage(() => Storage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

export function useIsFavorite(slug: string) {
  return useLibrary((state) => state.favorites.includes(slug));
}

export function useIsFavoriteGuide(slug: string) {
  return useLibrary((state) => (state.favoriteGuides ?? []).includes(slug));
}
