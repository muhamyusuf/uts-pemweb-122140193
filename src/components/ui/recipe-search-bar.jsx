import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

import { useMealSearch } from "@/hooks/use-meal-search";
import { cn } from "@/lib/utils";

export function RecipeSearchBar({
  onResult,
  onClear,
  onError,
  placeholder = "Search recipes by name…",
  className,
  autoFocus = false,
}) {
  const { query, setQuery, status, error, result, search, clear } =
    useMealSearch();

  useEffect(() => {
    if (result && onResult) {
      onResult(result);
    }
  }, [result, onResult]);

  useEffect(() => {
    if (status === "idle" && !query && !result && onClear) {
      onClear();
    }
  }, [status, query, result, onClear]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const isLoading = status === "loading";
  const showClearButton = useMemo(
    () => Boolean(query || result),
    [query, result]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query) {
      return;
    }
    search(query);
  };

  const handleClear = () => {
    setQuery("");
    clear();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="group relative flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 ring-1 ring-transparent transition focus-within:border-amber-300/80 focus-within:ring-amber-400/40"
      >
        <Search className="h-5 w-5 shrink-0 text-zinc-400 group-focus-within:text-amber-200" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
          autoComplete="off"
          spellCheck="false"
          autoFocus={autoFocus}
        />
        {showClearButton ? (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1 text-zinc-500 transition hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-400/50 disabled:text-amber-900/70"
        >
          {isLoading ? "Searching…" : "Search"}
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-xs text-rose-300" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}

RecipeSearchBar.propTypes = {
  onResult: PropTypes.func,
  onClear: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
};
