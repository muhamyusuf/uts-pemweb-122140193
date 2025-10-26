import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Heart, HeartOff, ListPlus, Search } from "lucide-react";

import "./card-grainny.css";

import { MorphingDialogBasicImage } from "@/components/ui/morphing-dialog-basic-image";
import { useMealDetail } from "@/hooks/use-meal-detail";
import {
  useFavoriteMealsStore,
  useIsMealFavorite,
} from "@/hooks/use-favorite-meals";
import { useMealPlanActions } from "@/hooks/use-meal-plan";

const IngredientList = ({ ingredients }) => {
  if (!ingredients?.length) {
    return (
      <p className="text-sm text-zinc-400">
        Ingredient list unavailable for this recipe.
      </p>
    );
  }

  return (
    <ul className="grid gap-2 text-sm text-zinc-200 sm:grid-cols-2">
      {ingredients.map((entry) => (
        <li
          key={`${entry.name}-${entry.measure}`}
          className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2"
        >
          <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-400" />
          <div className="flex flex-col">
            <span className="font-medium capitalize text-white">
              {entry.name}
            </span>
            <span className="text-xs text-zinc-300">{entry.measure}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      measure: PropTypes.string.isRequired,
    })
  ),
};

const RecipeDetailContent = ({ meal }) => {
  const { detail, status, error, refetch } = useMealDetail(meal.id, {
    enabled: false,
  });
  const tutorialEmbedUrl = useMemo(
    () => getYoutubeEmbedUrl(detail?.youtube),
    [detail?.youtube]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (status === "loading" && !detail) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 py-6 text-center text-zinc-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
        <p className="text-sm text-zinc-400">Loading recipe details...</p>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="rounded-lg border border-rose-500/40 bg-rose-900/30 p-4 text-sm text-rose-100">
        Failed to load details.{" "}
        <button
          type="button"
          onClick={() => refetch({ force: true })}
          className="font-medium text-rose-200 underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!detail) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6 text-left text-zinc-100">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold capitalize">{detail.name}</h2>
          <p className="text-sm text-zinc-400">
            {detail.category} &middot; {detail.area}
          </p>
        </div>
        {detail.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {detail.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {tutorialEmbedUrl ? (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Video Tutorial</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <iframe
              title={`${detail.name} tutorial`}
              src={tutorialEmbedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Instructions</h3>
        <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
          {detail.instructions}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Ingredients</h3>
        <IngredientList ingredients={detail.ingredients} />
      </section>

      <footer className="flex flex-wrap gap-3 text-sm text-zinc-300">
        {detail.source ? (
          <a
            href={detail.source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 transition hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            View Source
          </a>
        ) : null}
        {detail.youtube ? (
          <a
            href={detail.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 transition hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            Watch on YouTube
          </a>
        ) : null}
      </footer>
    </div>
  );
};

RecipeDetailContent.propTypes = {
  meal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const RecipeCard = ({ meal }) => {
  const formattedName = useMemo(
    () => meal?.name ?? "Unknown Recipe",
    [meal?.name]
  );

  const toggleFavorite = useFavoriteMealsStore((state) => state.toggleFavorite);
  const isFavorite = useIsMealFavorite(meal.id);
  const { addSuggestedMeal } = useMealPlanActions();
  const [imageLoaded, setImageLoaded] = useState(false);
  const openDialogRef = useRef(() => {});

  const registerOpenDialog = useCallback((open) => {
    openDialogRef.current = open;
  }, []);

  useEffect(() => {
    let active = true;
    setImageLoaded(false);

    if (typeof window === "undefined" || !meal?.image) {
      return undefined;
    }

    const image = new window.Image();
    image.src = meal.image;

    if (image.complete) {
      setImageLoaded(true);
    } else {
      image.onload = () => {
        if (active) {
          setImageLoaded(true);
        }
      };
      image.onerror = () => {
        if (active) {
          setImageLoaded(true);
        }
      };
    }

    return () => {
      active = false;
    };
  }, [meal?.image, meal?.id]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(meal);
  }, [meal, toggleFavorite]);

  const handleAddToPlanner = useCallback(() => {
    addSuggestedMeal(meal);
  }, [addSuggestedMeal, meal]);

  return (
    <div className="card">
      <div className="card-content flex flex-col items-center gap-3 text-center">
        {!imageLoaded ? (
          <div className="mx-auto aspect-square h-auto w-full min-w-[328px] rounded-[12px] bg-white/5" />
        ) : null}
        <MorphingDialogBasicImage
          src={meal?.image}
          alt={formattedName}
          onImageLoad={() => setImageLoaded(true)}
          hidden={!imageLoaded}
          previewClassName="mx-auto h-auto w-full rounded-[16px] bg-white/5 object-contain p-2 shadow-xl"
          dialogClassName="h-auto max-h-[320px] w-full object-contain"
          contentClassName="relative flex max-h-[90vh] w-full flex-col gap-6 overflow-y-auto rounded-[24px] bg-zinc-950/95 p-6 shadow-2xl backdrop-blur"
          onRegisterOpen={registerOpenDialog}
        >
          <RecipeDetailContent meal={meal} />
        </MorphingDialogBasicImage>

        <h3 className="title">{formattedName}</h3>

        <p className="description">
          Tap the preview or use the detail button to view the full recipe.
        </p>

        <div className="mt-3 flex w-full flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="relative group rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          >
            {isFavorite ? (
              <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
            ) : (
              <HeartOff className="h-5 w-5 text-white" />
            )}
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-xl bg-white/80 px-3 py-1.5 text-xs text-zinc-800 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
              {isFavorite ? "Remove favorite" : "Save favorite"}
            </span>
          </button>
          <button
            type="button"
            onClick={handleAddToPlanner}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
          >
            <ListPlus className="h-4 w-4" />
            Add to Meal Plan
          </button>
          <button
            type="button"
            onClick={() => openDialogRef.current?.()}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  meal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default RecipeCard;

function getYoutubeEmbedUrl(url) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        const segments = parsed.pathname.split("/").filter(Boolean);
        const videoId = segments[1] ?? segments[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}
