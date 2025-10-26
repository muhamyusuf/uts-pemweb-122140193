import PropTypes from "prop-types";
import { CalendarClock, Trash2 } from "lucide-react";

function PlannerQueuePanel({
  savedSuggestions,
  onRemoveSuggestion,
  onClearQueue,
}) {
  return (
    <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold text-white">Planner queue</h2>
      </div>
      {savedSuggestions.length === 0 ? (
        <p className="text-sm text-zinc-300">
          Add recipes from the catalog to keep a shortlist for upcoming plans.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {savedSuggestions.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <img
                src={`${meal.image}/preview`}
                alt={meal.name}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="flex-1 text-sm text-zinc-200">
                <p className="font-semibold text-white">{meal.name}</p>
                <p className="text-xs text-zinc-400">
                  {meal.category ?? "Recipe"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveSuggestion(meal.id)}
                className="rounded-full border border-white/10 p-1.5 text-sm text-white transition hover:bg-white/10"
                aria-label={`Remove ${meal.name} from queue`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onClearQueue}
            className="self-start rounded-full border border-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-200 transition hover:bg-white/10"
          >
            Clear queue
          </button>
        </div>
      )}
    </aside>
  );
}

PlannerQueuePanel.propTypes = {
  savedSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  onRemoveSuggestion: PropTypes.func.isRequired,
  onClearQueue: PropTypes.func.isRequired,
};

export default PlannerQueuePanel;
