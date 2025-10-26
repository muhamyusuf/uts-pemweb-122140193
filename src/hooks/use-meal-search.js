import { useCallback, useMemo, useState } from "react";

import { useMealDetailStoreApi } from "@/hooks/use-meal-detail";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

const normaliseTerm = (term) =>
  term?.toString().trim().replace(/\s+/g, " ") ?? "";

const parseMealResult = (meal) => ({
  id: meal.idMeal,
  name: meal.strMeal,
  image: meal.strMealThumb,
  category: meal.strCategory,
  area: meal.strArea,
});

export const useMealSearch = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const clear = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  const search = useCallback(
    async (term) => {
      const value = normaliseTerm(term ?? query);

      setQuery(value);
      if (!value) {
        setError("Please enter a recipe name before searching.");
        setResult(null);
        setStatus("idle");
        return null;
      }

      setStatus("loading");
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE}/search.php?s=${encodeURIComponent(value)}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to search recipe (status ${response.status}).`
          );
        }

        const data = await response.json();
        const meal = data?.meals?.[0];

        if (!meal) {
          throw new Error("Recipe not found. Try a different name.");
        }

        const detail = await useMealDetailStoreApi
          .getState()
          .fetchDetail(meal.idMeal, { force: true });

        const parsedResult = {
          ...parseMealResult(meal),
          detail,
        };

        setResult(parsedResult);
        setStatus("success");
        return parsedResult;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to find that recipe. Please double check the spelling.";
        setError(message);
        setStatus("error");
        setResult(null);
        return null;
      }
    },
    [query]
  );

  return useMemo(
    () => ({
      query,
      setQuery,
      status,
      error,
      result,
      search,
      clear,
    }),
    [query, status, error, result, search, clear]
  );
};
