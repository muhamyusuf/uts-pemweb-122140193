import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";

function PlannerSavedPlans({ plans, onRemovePlan }) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <h2 className="text-xl font-semibold text-white">Saved plans</h2>
      {plans.length === 0 ? (
        <p className="text-sm text-zinc-300">
          No plans yet. Submit the form above to organise your next meal.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {new Date(plan.date).toLocaleDateString()} &middot;{" "}
                    {plan.category} ({plan.area})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePlan(plan.id)}
                  className="rounded-full border border-white/10 p-1 text-white transition hover:bg-white/10"
                  aria-label={`Delete plan ${plan.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </header>
              <dl className="grid gap-2 text-xs text-zinc-300">
                <DescriptionItem label="Servings" value={plan.servings} />
                <DescriptionItem
                  label="Feature ingredient"
                  value={plan.ingredient || "--"}
                />
                <DescriptionItem
                  label="Dessert"
                  value={plan.includeDessert ? "Yes" : "--"}
                />
              </dl>
              {plan.notes ? (
                <p className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-zinc-200">
                  {plan.notes}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function DescriptionItem({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

PlannerSavedPlans.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      servings: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      ingredient: PropTypes.string,
      includeDessert: PropTypes.bool.isRequired,
      notes: PropTypes.string,
    })
  ).isRequired,
  onRemovePlan: PropTypes.func.isRequired,
};

DescriptionItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PlannerSavedPlans;
