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

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `plan-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const initialState = {
  plans: [],
  suggestions: {},
};

export const useMealPlanStore = create(
  persist(
    (set) => ({
      ...initialState,
      addPlan: (plan) => {
        set((state) => ({
          plans: [
            ...state.plans,
            {
              ...plan,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },
      removePlan: (planId) =>
        set((state) => ({
          plans: state.plans.filter((plan) => plan.id !== planId),
        })),
      clearPlans: () => set((state) => ({ ...state, plans: [] })),
      addSuggestedMeal: (meal) => {
        if (!meal?.id) {
          return;
        }
        set((state) => ({
          suggestions: {
            ...state.suggestions,
            [meal.id]: {
              id: meal.id,
              name: meal.name,
              image: meal.image,
              category: meal.category,
              area: meal.area,
            },
          },
        }));
      },
      removeSuggestedMeal: (mealId) =>
        set((state) => {
          const nextSuggestions = { ...state.suggestions };
          delete nextSuggestions[mealId];
          return { suggestions: nextSuggestions };
        }),
      clearSuggestions: () => set((state) => ({ ...state, suggestions: {} })),
    }),
    {
      name: "meal-planner",
      version: 1,
      storage: createJSONStorage(createStorage),
    }
  )
);

export const useMealPlans = () =>
  useMealPlanStore((state) => state.plans ?? []);

// Ambil suggestions object, lalu convert ke array dengan useMemo
export const useMealPlanSuggestions = () => {
  const suggestions = useMealPlanStore((state) => state.suggestions ?? {});

  return useMemo(() => Object.values(suggestions), [suggestions]);
};

export const useMealPlanActions = () => {
  const addPlan = useMealPlanStore((state) => state.addPlan);
  const removePlan = useMealPlanStore((state) => state.removePlan);
  const clearPlans = useMealPlanStore((state) => state.clearPlans);
  const addSuggestedMeal = useMealPlanStore((state) => state.addSuggestedMeal);
  const removeSuggestedMeal = useMealPlanStore(
    (state) => state.removeSuggestedMeal
  );
  const clearSuggestions = useMealPlanStore((state) => state.clearSuggestions);

  return useMemo(
    () => ({
      addPlan,
      removePlan,
      clearPlans,
      addSuggestedMeal,
      removeSuggestedMeal,
      clearSuggestions,
    }),
    [
      addPlan,
      removePlan,
      clearPlans,
      addSuggestedMeal,
      removeSuggestedMeal,
      clearSuggestions,
    ]
  );
};
