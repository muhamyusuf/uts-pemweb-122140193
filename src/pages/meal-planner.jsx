import { useCallback, useEffect, useMemo, useState } from "react";

import PlannerForm from "@/components/planner/planner-form";
import PlannerHeader from "@/components/planner/planner-header";
import PlannerQueuePanel from "@/components/planner/planner-queue-panel";
import PlannerQueuePreview from "@/components/planner/planner-queue-preview";
import PlannerSavedPlans from "@/components/planner/planner-saved-plans";
import PlannerSuggestionsTable from "@/components/planner/planner-suggestions-table";
import { getToday, resolveValue } from "@/components/planner/utils";
import { RecipeDock } from "@/components/ui/dock";
import { useMealMetadata } from "@/hooks/use-meal-metadata";
import {
  useMealPlanActions,
  useMealPlanSuggestions,
  useMealPlans,
} from "@/hooks/use-meal-plan";
import { useMealSuggestions } from "@/hooks/use-meal-suggestions";

const createDefaultFormState = () => ({
  title: "",
  email: "",
  date: getToday(),
  servings: 2,
  category: "",
  area: "",
  ingredient: "",
  includeDessert: false,
  notes: "",
});

function MealPlanner() {
  const [form, setForm] = useState(createDefaultFormState);
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const {
    categories,
    areas,
    ingredients,
    loading: metadataLoading,
    error: metadataError,
  } = useMealMetadata();

  const plans = useMealPlans();
  const savedSuggestions = useMealPlanSuggestions();
  const {
    addPlan,
    removePlan,
    clearPlans,
    addSuggestedMeal,
    removeSuggestedMeal,
    clearSuggestions,
  } = useMealPlanActions();

  const metadataReady =
    categories.length > 0 || areas.length > 0 || ingredients.length > 0;

  useEffect(() => {
    if (!metadataReady) {
      return;
    }

    setForm((current) => {
      const nextCategory = resolveValue(current.category, categories);
      const nextArea = resolveValue(current.area, areas);
      const nextIngredient = resolveValue(current.ingredient, ingredients);

      if (
        current.category === nextCategory &&
        current.area === nextArea &&
        current.ingredient === nextIngredient
      ) {
        return current;
      }

      return {
        ...current,
        category: nextCategory,
        area: nextArea,
        ingredient: nextIngredient,
      };
    });
  }, [areas, categories, ingredients, metadataReady]);

  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useMealSuggestions({
    category: form.category,
    area: form.area,
    limit: 5,
  });

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setStatusMessage("");
    // Reset showErrors saat user mulai edit field
    setShowErrors(false);
    setErrors({});
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      // Validasi custom
      const newErrors = {};

      if (!form.title.trim() || form.title.trim().length < 3) {
        newErrors.title = "Title must be at least 3 characters long";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!form.date) {
        newErrors.date = "Cooking date is required";
      }

      if (!form.servings || form.servings < 1 || form.servings > 20) {
        newErrors.servings = "Servings must be between 1 and 20";
      }

      if (!form.category) {
        newErrors.category = "Please select a category";
      }

      if (!form.area) {
        newErrors.area = "Please select a cuisine area";
      }

      // Jika ada error, tampilkan dan jangan submit
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setShowErrors(true);
        setStatusMessage("");
        return;
      }

      const formElement = event.currentTarget;
      if (!formElement.checkValidity()) {
        formElement.reportValidity();
        return;
      }

      addPlan({
        title: form.title.trim(),
        email: form.email.trim(),
        date: form.date,
        servings: Number(form.servings),
        category: form.category,
        area: form.area,
        ingredient: form.ingredient,
        includeDessert: form.includeDessert,
        notes: form.notes.trim(),
      });

      setStatusMessage("Meal plan saved successfully.");
      setShowErrors(false);
      setErrors({});
      setForm((current) => ({
        ...current,
        title: "",
        notes: "",
      }));
    },
    [addPlan, form]
  );

  const handleReset = useCallback(() => {
    setStatusMessage("");
    setErrors({});
    setShowErrors(false);
    setForm((current) => ({
      ...createDefaultFormState(),
      category: resolveValue(current.category, categories),
      area: resolveValue(current.area, areas),
      ingredient: resolveValue(current.ingredient, ingredients),
    }));
  }, [areas, categories, ingredients]);

  const selectedSuggestionIds = useMemo(
    () => new Set(savedSuggestions.map((meal) => meal.id)),
    [savedSuggestions]
  );

  const queueSuggestion = useCallback(
    (meal) => {
      addSuggestedMeal({
        id: meal.id,
        name: meal.name,
        image: meal.thumbnail,
        category: meal.category,
        area: meal.area,
      });
    },
    [addSuggestedMeal]
  );

  const planFromSuggestion = useCallback(
    (meal) => {
      addPlan({
        title: `${meal.name} Dinner`,
        email: form.email,
        date: form.date,
        servings: Number(form.servings),
        category: meal.category,
        area: meal.area,
        ingredient: form.ingredient,
        includeDessert: form.includeDessert,
        notes: "Auto-planned from suggestions.",
      });
    },
    [
      addPlan,
      form.date,
      form.email,
      form.includeDessert,
      form.ingredient,
      form.servings,
    ]
  );

  return (
    <div className="relative min-h-screen pb-32">
      <div className="mx-auto flex w-full flex-col gap-6">
        <PlannerHeader />

        <section className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
          <PlannerForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            statusMessage={statusMessage}
            errors={errors}
            showErrors={showErrors}
            categories={categories}
            areas={areas}
            ingredients={ingredients}
            metadataLoading={metadataLoading}
            metadataError={metadataError}
            hasPlans={plans.length > 0}
            onClearPlans={clearPlans}
          />

          <PlannerQueuePanel
            savedSuggestions={savedSuggestions}
            onRemoveSuggestion={removeSuggestedMeal}
            onClearQueue={clearSuggestions}
          />
        </section>

        <PlannerSuggestionsTable
          suggestions={suggestions}
          loading={suggestionsLoading}
          error={suggestionsError}
          selectedSuggestionIds={selectedSuggestionIds}
          onQueue={queueSuggestion}
          onPlan={planFromSuggestion}
        />

        <PlannerSavedPlans plans={plans} onRemovePlan={removePlan} />

        <PlannerQueuePreview savedSuggestions={savedSuggestions} />
      </div>

      <RecipeDock />
    </div>
  );
}

export default MealPlanner;
