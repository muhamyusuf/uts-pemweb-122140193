import "./home.css";

import { useCallback, useMemo, useState } from "react";

import { RecipeDock } from "@/components/ui/dock";
import RecipeCard from "@/components/ui/recipe-card";
import { RecipeSearchBar } from "@/components/ui/recipe-search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMealCatalog } from "@/hooks/use-meal-catalog";

function Home() {
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const {
    categories,
    selectedCategory,
    meals,
    loading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    setCategory,
  } = useMealCatalog({ limit: 3 });

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

  const showSearchResult = useMemo(() => Boolean(searchResult), [searchResult]);

  return (
    <>
      <div className="relative min-h-screen pb-32">
        <section className="mx-auto flex w-full flex-col gap-6">
          <header className="hero-highlight flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="space-y-3">
              <p className="inline-flex w-fit rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100">
                The MealDB API
              </p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Taste Atlas
              </h1>
              <p className="max-w-2xl text-sm text-zinc-200 sm:text-base">
                Discover curated recipes from around the world. Search by name
                or browse categories to reveal ingredients, instructions, and
                cooking inspiration powered by TheMealDB.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 text-sm text-zinc-200 sm:flex-row sm:items-center sm:gap-3">
                <span className="font-medium text-white" id="category-label">
                  Category
                </span>
                <Select
                  value={selectedCategory || undefined}
                  onValueChange={setCategory}
                >
                  <SelectTrigger
                    aria-labelledby="category-label"
                    className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white outline-none transition focus-visible:border-amber-300 focus-visible:ring-amber-400/60 sm:w-72"
                  >
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent className="border border-white/10 bg-black/80 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-xs uppercase tracking-wide text-zinc-400">
                {selectedCategory
                  ? `Showing recipes for ${selectedCategory}`
                  : "Select a category to explore recipes"}
              </span>
            </div>
          </header>

          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-amber-100 sm:text-sm">
            Tip: Click a recipe preview or press the View Details button on each
            card to open the full instructions and ingredient list.
          </p>

          <RecipeSearchBar
            onResult={handleSearchResult}
            onClear={handleSearchClear}
            onError={handleSearchError}
            className="sm:max-w-lg"
          />

          {searchError ? (
            <p className="rounded-md border border-rose-500/40 bg-rose-900/30 px-3 py-2 text-sm text-rose-100">
              {searchError}
            </p>
          ) : null}

          {error && !showSearchResult ? (
            <p className="rounded-md border border-rose-500/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {showSearchResult ? (
              <RecipeCard meal={searchResult} />
            ) : loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="card animate-pulse bg-white/5"
                >
                  <div className="card-content flex flex-col items-center gap-3 text-center">
                    <div className="mx-auto aspect-square h-auto w-full min-w-[328px] rounded-[12px] bg-white/10" />
                    <div className="h-5 w-32 rounded bg-white/20" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                    <div className="mt-3 flex w-full justify-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10" />
                      <div className="h-10 w-24 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              meals.map((meal) => <RecipeCard key={meal.id} meal={meal} />)
            )}
          </div>

          {!showSearchResult && meals.length > 0 ? (
            <nav className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
              <button
                type="button"
                onClick={prevPage}
                disabled={!hasPrev || loading}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-white/5"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-200">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={nextPage}
                disabled={!hasNext || loading}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-white/5"
              >
                Next
              </button>
            </nav>
          ) : null}
        </section>
      </div>

      <RecipeDock />
    </>
  );
}

export default Home;
