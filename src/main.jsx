import { StrictMode, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";

import "./index.css";

import Favorites from "@/pages/favorites";
import Home from "@/pages/home";
import MealPlanner from "@/pages/meal-planner";
import NotFound from "@/pages/not-found";

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_55)]">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-xl backdrop-blur">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-amber-300" />
        <p className="text-sm text-zinc-300">Preparing delicious content…</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/planner" element={<MealPlanner />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </StrictMode>
  </BrowserRouter>
);

