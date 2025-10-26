import { useCallback, useEffect } from "react";
import { create } from "zustand";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

const initialState = {
  details: {},
  status: {},
  errors: {},
};

const parseIngredients = (data) => {
  const entries = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = data[`strIngredient${index}`];
    const measure = data[`strMeasure${index}`];
    const trimmedName = name?.trim();
    const trimmedMeasure = measure?.trim();

    if (trimmedName) {
      entries.push({
        name: trimmedName,
        measure: trimmedMeasure || "-",
      });
    }
  }
  return entries;
};

const normaliseMeal = (data) => ({
  id: data.idMeal,
  name: data.strMeal,
  category: data.strCategory ?? "Uncategorised",
  area: data.strArea ?? "Unknown",
  instructions:
    data.strInstructions?.trim() ?? "Instructions are not available.",
  thumbnail: data.strMealThumb ?? "",
  tags: data.strTags
    ? data.strTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [],
  youtube: data.strYoutube ?? "",
  source: data.strSource ?? "",
  ingredients: parseIngredients(data),
  raw: data,
});

const useMealDetailStore = create((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  fetchDetail: async (id, { force = false } = {}) => {
    if (!id) {
      return null;
    }

    const key = id.toString().trim();
    if (!key) {
      return null;
    }

    const { status, details } = get();

    if (!force) {
      if (status[key] === "loading") {
        return null;
      }

      if (details[key]) {
        return details[key];
      }
    }

    set((state) => ({
      status: { ...state.status, [key]: "loading" },
      errors: { ...state.errors, [key]: undefined },
    }));

    try {
      const response = await fetch(
        `${API_BASE}/lookup.php?i=${encodeURIComponent(key)}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load recipe detail (status ${response.status}).`
        );
      }

      const data = await response.json();
      const meal = data?.meals?.[0];

      if (!meal) {
        throw new Error("Recipe detail not found.");
      }

      const detail = normaliseMeal(meal);

      set((state) => ({
        details: { ...state.details, [key]: detail },
        status: { ...state.status, [key]: "success" },
        errors: { ...state.errors, [key]: undefined },
      }));

      return detail;
    } catch (error) {
      set((state) => ({
        status: { ...state.status, [key]: "error" },
        errors: {
          ...state.errors,
          [key]: error instanceof Error ? error.message : "Unknown error.",
        },
      }));
      return null;
    }
  },
}));

export const useMealDetail = (id, options = {}) => {
  const enabled = options.enabled ?? true;
  const detail = useMealDetailStore(
    useCallback((state) => (id ? state.details[id] : undefined), [id])
  );
  const status = useMealDetailStore(
    useCallback((state) => state.status[id] ?? "idle", [id])
  );
  const error = useMealDetailStore(
    useCallback((state) => state.errors[id], [id])
  );

  const fetchDetail = useMealDetailStore((state) => state.fetchDetail);

  const refetch = useCallback(
    (params) => fetchDetail(id, params),
    [fetchDetail, id]
  );

  useEffect(() => {
    if (!enabled || !id) {
      return;
    }

    if (!detail && status !== "loading") {
      refetch();
    }
  }, [detail, enabled, id, refetch, status]);

  return {
    detail,
    status,
    error,
    refetch,
  };
};

export const useMealDetailStoreApi = useMealDetailStore;
