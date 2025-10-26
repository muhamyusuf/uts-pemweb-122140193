import { useEffect, useState } from "react";

import { useMealDetailStoreApi } from "@/hooks/use-meal-detail";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

const fetchMealsByCategory = async (category) => {
  const response = await fetch(
    `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to load meals for category ${category} (status ${response.status}).`
    );
  }
  const data = await response.json();
  return data?.meals ?? [];
};

const fetchMealsByArea = async (area) => {
  const response = await fetch(
    `${API_BASE}/filter.php?a=${encodeURIComponent(area)}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to load meals for area ${area} (status ${response.status}).`
    );
  }
  const data = await response.json();
  return data?.meals ?? [];
};

export const useMealSuggestions = ({ category, area, limit = 5 }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const shouldFetch = Boolean(category || area);
    if (!shouldFetch) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const loadSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const [categoryMeals, areaMeals] = await Promise.all([
          category ? fetchMealsByCategory(category) : Promise.resolve([]),
          area ? fetchMealsByArea(area) : Promise.resolve([]),
        ]);

        let candidates;

        if (category && area) {
          const areaMap = new Map(areaMeals.map((meal) => [meal.idMeal, meal]));
          candidates = categoryMeals.filter((meal) => areaMap.has(meal.idMeal));
        } else if (category) {
          candidates = categoryMeals;
        } else {
          candidates = areaMeals;
        }

        const uniqueIds = Array.from(
          new Map(candidates.map((meal) => [meal.idMeal, meal])).keys()
        );

        const limitedIds = uniqueIds.slice(0, limit);

        const details = await Promise.all(
          limitedIds.map((id) =>
            useMealDetailStoreApi.getState().fetchDetail(id, { force: true })
          )
        );

        if (!cancelled) {
          setSuggestions(
            details.filter(Boolean).map((detail) => ({
              id: detail.id,
              name: detail.name,
              category: detail.category,
              area: detail.area,
              tags: detail.tags,
              thumbnail: detail.thumbnail,
            }))
          );
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load suggestions."
          );
          setLoading(false);
        }
      }
    };

    loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [area, category, limit]);

  return {
    suggestions,
    loading,
    error,
  };
};
