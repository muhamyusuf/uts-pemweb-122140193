import { UtensilsCrossed } from "lucide-react";

function PlannerHeader() {
  return (
    <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Meal Planner</h1>
        <p className="text-sm text-zinc-200">
          Schedule your next cooking session and explore tailored recipe
          suggestions based on category and cuisine.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
          <UtensilsCrossed className="h-3.5 w-3.5 text-amber-300" />
          Data from TheMealDB
        </span>
      </div>
    </header>
  );
}

export default PlannerHeader;
