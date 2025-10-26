import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/list.php?c=list`);
  if (!response.ok) {
    throw new Error(
      `Failed to load meal categories (status ${response.status}).`
    );
  }
  const data = await response.json();
  return data?.meals?.map((item) => item.strCategory).filter(Boolean) ?? [];
};

const fetchMealsByCategory = async (category) => {
  const response = await fetch(
    `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to load meals for ${category} (status ${response.status}).`
    );
  }
  const data = await response.json();
  return (
    data?.meals?.map((meal) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
    })) ?? []
  );
};

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

const useMealCatalogStore = create(
  persist(
    (set, get) => ({
      categories: [],
      selectedCategory: "",
      mealsByCategory: {},
      loading: false,
      error: null,
      page: 1,
      limit: 3,
      initialise: async () => {
        const state = get();
        if (state.loading) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const categories = await fetchCategories();
          let resolvedCategory = "";

          set((current) => {
            const storedCategory = current.selectedCategory;
            const fallbackCategory = categories[0] ?? "";
            const nextCategory = categories.includes(storedCategory)
              ? storedCategory
              : fallbackCategory;

            resolvedCategory = nextCategory;

            const shouldFetchMeals =
              Boolean(nextCategory) &&
              !current.mealsByCategory[nextCategory];

            return {
              categories,
              selectedCategory: nextCategory,
              page:
                categories.includes(storedCategory) && current.page
                  ? current.page
                  : 1,
              loading: shouldFetchMeals,
              error: null,
            };
          });

          const latestState = get();

          if (
            resolvedCategory &&
            !latestState.mealsByCategory[resolvedCategory]
          ) {
            const meals = await fetchMealsByCategory(resolvedCategory);
            set((current) => ({
              mealsByCategory: {
                ...current.mealsByCategory,
                [resolvedCategory]: meals,
              },
              loading: false,
            }));
          } else {
            set({ loading: false });
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error.",
          });
        }
      },
      setCategory: async (category) => {
        const safeCategory = category ?? "";
        const state = get();

        if (safeCategory === state.selectedCategory) {
          return;
        }

        set({
          selectedCategory: safeCategory,
          page: 1,
          error: null,
        });

        if (!safeCategory) {
          return;
        }

        if (state.mealsByCategory[safeCategory]) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const meals = await fetchMealsByCategory(safeCategory);
          set((current) => ({
            mealsByCategory: {
              ...current.mealsByCategory,
              [safeCategory]: meals,
            },
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error ? error.message : "Unknown error.",
          });
        }
      },
      setPage: (page) =>
        set((state) => ({
          page: Math.max(1, Number.isFinite(page) ? page : state.page),
        })),
      setLimit: (limit) =>
        set((state) => {
          const nextLimit = Math.max(
            1,
            Number.isFinite(limit) ? Number(limit) : state.limit
          );
          return {
            limit: nextLimit,
            page: 1,
          };
        }),
    }),
    {
      name: "meal-catalog",
      version: 1,
      storage: createJSONStorage(createStorage),
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        page: state.page,
        limit: state.limit,
        mealsByCategory: state.mealsByCategory,
      }),
    }
  )
);

export const useMealCatalog = ({ limit } = {}) => {
  const categories = useMealCatalogStore((state) => state.categories);
  const selectedCategory = useMealCatalogStore(
    (state) => state.selectedCategory
  );
  const mealsByCategory = useMealCatalogStore((state) => state.mealsByCategory);
  const loading = useMealCatalogStore((state) => state.loading);
  const error = useMealCatalogStore((state) => state.error);
  const page = useMealCatalogStore((state) => state.page);
  const currentLimit = useMealCatalogStore((state) => state.limit);
  const initialise = useMealCatalogStore((state) => state.initialise);
  const setCategory = useMealCatalogStore((state) => state.setCategory);
  const setPageStore = useMealCatalogStore((state) => state.setPage);
  const setLimitStore = useMealCatalogStore((state) => state.setLimit);

  useEffect(() => {
    initialise();
  }, [initialise]);

  useEffect(() => {
    if (Number.isFinite(limit) && limit !== currentLimit) {
      setLimitStore(limit);
    }
  }, [limit, currentLimit, setLimitStore]);

  const mealsForCategory = mealsByCategory[selectedCategory] ?? [];

  const total = mealsForCategory.length;
  const totalPages =
    currentLimit > 0 ? Math.max(1, Math.ceil(total / currentLimit)) : 1;
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (safePage !== page) {
      setPageStore(safePage);
    }
  }, [page, safePage, setPageStore]);

  const paginatedMeals = useMemo(() => {
    if (currentLimit <= 0) {
      return mealsForCategory;
    }
    const startIndex = (safePage - 1) * currentLimit;
    return mealsForCategory.slice(startIndex, startIndex + currentLimit);
  }, [mealsForCategory, safePage, currentLimit]);

  const hasNext = safePage < totalPages;
  const hasPrev = safePage > 1;

  const goToPage = useCallback(
    (nextPage) => {
      const safeValue = Math.max(1, Math.min(totalPages, nextPage));
      if (safeValue === safePage) {
        return;
      }
      setPageStore(safeValue);
    },
    [safePage, setPageStore, totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasNext) {
      goToPage(safePage + 1);
    }
  }, [goToPage, hasNext, safePage]);

  const prevPage = useCallback(() => {
    if (hasPrev) {
      goToPage(safePage - 1);
    }
  }, [goToPage, hasPrev, safePage]);

  return {
    categories,
    selectedCategory,
    meals: paginatedMeals,
    total,
    totalPages,
    page: safePage,
    limit: currentLimit,
    loading,
    error,
    hasNext,
    hasPrev,
    setCategory,
    setPage: goToPage,
    setLimit: setLimitStore,
    nextPage,
    prevPage,
  };
};
