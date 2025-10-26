import { useEffect } from "react";
import { create } from "zustand";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

const fetchAreas = async () => {
  const response = await fetch(`${API_BASE}/list.php?a=list`);
  if (!response.ok) {
    throw new Error(`Failed to load meal areas (status ${response.status}).`);
  }
  const data = await response.json();
  return data?.meals?.map((item) => item.strArea).filter(Boolean) ?? [];
};

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

const fetchIngredients = async () => {
  const response = await fetch(`${API_BASE}/list.php?i=list`);
  if (!response.ok) {
    throw new Error(
      `Failed to load meal ingredients (status ${response.status}).`
    );
  }
  const data = await response.json();
  return (
    data?.meals
      ?.map((item) => item.strIngredient)
      .filter(Boolean)
      .slice(0, 50) ?? []
  );
};

const useMealMetadataStore = create((set, get) => ({
  categories: [],
  areas: [],
  ingredients: [],
  loading: false,
  error: null,
  status: "idle",
  initialise: async () => {
    const state = get();
    if (state.status === "loading" || state.status === "success") {
      return;
    }

    set({ loading: true, error: null, status: "loading" });

    try {
      const [categories, areas, ingredients] = await Promise.all([
        fetchCategories(),
        fetchAreas(),
        fetchIngredients(),
      ]);

      set({
        categories,
        areas,
        ingredients,
        loading: false,
        error: null,
        status: "success",
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error.",
        status: "error",
      });
    }
  },
}));

export const useMealMetadata = () => {
  const categories = useMealMetadataStore((state) => state.categories);
  const areas = useMealMetadataStore((state) => state.areas);
  const ingredients = useMealMetadataStore((state) => state.ingredients);
  const loading = useMealMetadataStore((state) => state.loading);
  const error = useMealMetadataStore((state) => state.error);
  const initialise = useMealMetadataStore((state) => state.initialise);

  useEffect(() => {
    initialise();
  }, [initialise]);

  return {
    categories,
    areas,
    ingredients,
    loading,
    error,
    refresh: initialise,
  };
};
