import PropTypes from "prop-types";

function PlannerSuggestionsTable({
  suggestions,
  loading,
  error,
  selectedSuggestionIds,
  onQueue,
  onPlan,
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Suggested recipes
          </h2>
          <p className="text-sm text-zinc-300">
            Matching recipes based on your selected category and cuisine.
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-rose-500/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white">
          <thead className="bg-white/10 text-xs uppercase text-amber-100">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Meal
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Category
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Area
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Tags
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/5">
            {loading ? (
              <TableMessage message="Loading suggestions..." />
            ) : suggestions.length === 0 ? (
              <TableMessage message="Adjust the category or cuisine to see matching meals." />
            ) : (
              suggestions.map((meal) => (
                <SuggestionRow
                  key={meal.id}
                  meal={meal}
                  isQueued={selectedSuggestionIds.has(meal.id)}
                  onQueue={onQueue}
                  onPlan={onPlan}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SuggestionRow({ meal, isQueued, onQueue, onPlan }) {
  return (
    <tr>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={`${meal.thumbnail}/preview`}
            alt={meal.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <span className="font-medium text-white">{meal.name}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-zinc-200">{meal.category}</td>
      <td className="px-4 py-4 text-zinc-200">{meal.area}</td>
      <td className="px-4 py-4 text-zinc-300">
        {meal.tags?.length ? meal.tags.join(", ") : "--"}
      </td>
      <td className="px-4 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onQueue(meal)}
            disabled={isQueued}
            className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-400/50 disabled:text-amber-900/70"
          >
            {isQueued ? "Queued" : "Queue"}
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            onClick={() => onPlan(meal)}
          >
            Plan
          </button>
        </div>
      </td>
    </tr>
  );
}

function TableMessage({ message }) {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-6 text-center text-sm text-zinc-300">
        {message}
      </td>
    </tr>
  );
}

PlannerSuggestionsTable.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      thumbnail: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  selectedSuggestionIds: PropTypes.instanceOf(Set).isRequired,
  onQueue: PropTypes.func.isRequired,
  onPlan: PropTypes.func.isRequired,
};

PlannerSuggestionsTable.defaultProps = {
  error: "",
};

SuggestionRow.propTypes = {
  meal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
  isQueued: PropTypes.bool.isRequired,
  onQueue: PropTypes.func.isRequired,
  onPlan: PropTypes.func.isRequired,
};

TableMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default PlannerSuggestionsTable;
