import { Link } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.16_0.03_55)] px-6 py-16 text-center text-zinc-100">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-[oklch(0.18_0.04_55)]/70 px-10 py-12 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center gap-4">
          <SearchX className="h-12 w-12 text-rose-300" />
          <span className="text-sm uppercase tracking-tight text-zinc-300">
            Error 404
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-white">
            Recipe not on the menu
          </h1>
          <p className="max-w-lg text-base text-zinc-200">
            The page you’re looking for isn’t plated yet. Head back to the recipe
            collection or the meal planner to continue cooking.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore recipes
          </Link>
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Plan a meal
          </Link>
        </div>
      </div>
    </div>
  );
}

