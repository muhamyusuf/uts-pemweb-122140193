import PropTypes from "prop-types";

import RecipeCard from "@/components/ui/recipe-card";

function PlannerQueuePreview({ savedSuggestions }) {
  if (savedSuggestions.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <h2 className="text-xl font-semibold text-white">
        Quick preview from queue
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {savedSuggestions.map((meal) => (
          <RecipeCard
            key={`preview-${meal.id}`}
            meal={{
              id: meal.id,
              name: meal.name,
              image: meal.image,
            }}
          />
        ))}
      </div>
    </section>
  );
}

PlannerQueuePreview.propTypes = {
  savedSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PlannerQueuePreview;

