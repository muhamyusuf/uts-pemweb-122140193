import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const createStorage = () => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return window.localStorage;
};

const initialState = {
  favorites: {},
};

export const useFavoriteMealsStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      toggleFavorite: (meal) => {
        if (!meal?.id) {
          return;
        }

        set((state) => {
          const nextFavorites = { ...state.favorites };
          if (nextFavorites[meal.id]) {
            delete nextFavorites[meal.id];
          } else {
            nextFavorites[meal.id] = {
              id: meal.id,
              name: meal.name,
              image: meal.image,
              category: meal.category,
              area: meal.area,
            };
          }

          return { favorites: nextFavorites };
        });
      },
      removeFavorite: (mealId) => {
        if (!mealId) {
          return;
        }
        set((state) => {
          const nextFavorites = { ...state.favorites };
          delete nextFavorites[mealId];
          return { favorites: nextFavorites };
        });
      },
      clearFavorites: () => set(initialState),
      isFavorite: (mealId) => Boolean(get().favorites[mealId]),
    }),
    {
      name: "meal-favorites",
      version: 1,
      storage: createJSONStorage(createStorage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);

export const useFavoriteMealsList = () => {
  const favoritesMap = useFavoriteMealsStore((state) => state.favorites);
  return useMemo(() => Object.values(favoritesMap), [favoritesMap]);
};

export const useFavoriteMealsActions = () => {
  const toggleFavorite = useFavoriteMealsStore((state) => state.toggleFavorite);
  const removeFavorite = useFavoriteMealsStore((state) => state.removeFavorite);
  const clearFavorites = useFavoriteMealsStore((state) => state.clearFavorites);

  return useMemo(
    () => ({
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [toggleFavorite, removeFavorite, clearFavorites]
  );
};

export const useIsMealFavorite = (id) =>
  useFavoriteMealsStore(
    useMemo(() => (state) => Boolean(id ? state.favorites[id] : false), [id])
  );
