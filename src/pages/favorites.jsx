import { useCallback, useMemo, useState } from "react";

import { RecipeDock } from "@/components/ui/dock";
import RecipeCard from "@/components/ui/recipe-card";
import { RecipeSearchBar } from "@/components/ui/recipe-search-bar";
import {
  useFavoriteMealsActions,
  useFavoriteMealsList,
} from "@/hooks/use-favorite-meals";

export default function Favorites() {
  const favorites = useFavoriteMealsList();
  const { clearFavorites } = useFavoriteMealsActions();
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const filteredFavorites = useMemo(() => {
    if (!searchResult) {
      return favorites;
    }
    return favorites.filter((meal) => meal.id === searchResult.id);
  }, [favorites, searchResult]);

  const handleSearchResult = useCallback((meal) => {
    setSearchResult(meal);
    setSearchError("");
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchResult(null);
    setSearchError("");
  }, []);

  const handleSearchError = useCallback((message) => {
    setSearchError(message);
    setSearchResult(null);
  }, []);

  const hasFavorites = favorites.length > 0;
  const displayFavorites = filteredFavorites.length > 0;

  return (
    <div className="relative min-h-screen pb-32">
      <div className="mx-auto flex w-full flex-col gap-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Favorite Recipes</h1>
            <p className="text-sm text-zinc-200">
              All meals you have saved across the app live here for quick access.
            </p>
          </div>

          {hasFavorites ? (
            <button
              type="button"
              onClick={clearFavorites}
              className="self-start rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:self-auto"
            >
              Clear favorites
            </button>
          ) : null}
        </header>

        <RecipeSearchBar
          onResult={handleSearchResult}
          onClear={handleSearchClear}
          onError={handleSearchError}
          className="sm:max-w-lg"
          placeholder="Find a recipe by name…"
        />

        {searchError ? (
          <p className="rounded-md border border-rose-500/40 bg-rose-900/30 px-3 py-2 text-sm text-rose-100">
            {searchError}
          </p>
        ) : null}

        {searchResult ? (
          <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-200">
              <span>
                Search result for{" "}
                <span className="font-semibold text-white">
                  {searchResult.name}
                </span>
              </span>
              {favorites.some((meal) => meal.id === searchResult.id) ? (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  In Favorites
                </span>
              ) : (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                  Not Saved
                </span>
              )}
            </div>
            <RecipeCard meal={searchResult} />
          </section>
        ) : null}

        {!hasFavorites ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-zinc-200">
            <p className="text-lg font-medium text-white">
              You have no favorite recipes yet
            </p>
            <p className="text-sm text-zinc-300">
              Explore the recipe catalog and tap the heart icon to save meals
              you love.
            </p>
          </div>
        ) : displayFavorites ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredFavorites.map((meal) => (
              <RecipeCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-zinc-300">
            That recipe is not in your favorites yet. Open its card from search
            to add it.
          </div>
        )}
      </div>

      <RecipeDock />
    </div>
  );
}

