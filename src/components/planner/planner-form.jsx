import PropTypes from "prop-types";
import { Plus, Trash2, ClipboardList } from "lucide-react";

import PlannerDatePicker from "@/components/planner/planner-date-picker";
import { getToday } from "@/components/planner/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PlannerForm({
  form,
  onChange,
  onSubmit,
  onReset,
  statusMessage,
  categories,
  areas,
  ingredients,
  metadataLoading,
  metadataError,
  hasPlans,
  onClearPlans,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
      noValidate
    >
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-amber-300" />
        <h2 className="text-xl font-semibold text-white">Plan details</h2>
      </div>

      <FormGrid
        form={form}
        onChange={onChange}
        categories={categories}
        areas={areas}
        ingredients={ingredients}
      />

      <NotesField value={form.notes} onChange={onChange} />

      {statusMessage ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-900/30 px-3 py-2 text-sm text-emerald-100">
          {statusMessage}
        </p>
      ) : null}

      <FormControls
        hasPlans={hasPlans}
        onClearPlans={onClearPlans}
        onReset={onReset}
      />

      {metadataError ? (
        <p className="rounded-md border border-rose-500/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-100">
          {metadataError}
        </p>
      ) : null}

      {metadataLoading ? (
        <p className="text-sm text-zinc-300">Loading metadata...</p>
      ) : null}
    </form>
  );
}

function FormGrid({ form, onChange, categories, areas, ingredients }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InputField
        label="Plan title"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="e.g. Italian Night"
        required
        minLength={3}
        type="text"
      />
      <InputField
        label="Contact email"
        name="email"
        value={form.email}
        onChange={onChange}
        placeholder="chef@example.com"
        required
        type="email"
      />
      <PlannerDatePicker
        label="Cooking date"
        name="date"
        value={form.date}
        onChange={onChange}
        minDate={getToday()}
      />
      <InputField
        label="Servings"
        name="servings"
        value={form.servings}
        onChange={onChange}
        type="number"
        min={1}
        max={20}
        required
      />
      <SelectField
        label="Category"
        name="category"
        value={form.category}
        onChange={onChange}
        options={categories}
        required
      />
      <SelectField
        label="Cuisine (Area)"
        name="area"
        value={form.area}
        onChange={onChange}
        options={areas}
        required
      />
      <SelectField
        label="Feature ingredient"
        name="ingredient"
        value={form.ingredient}
        onChange={onChange}
        options={ingredients}
      />
      <DessertField checked={form.includeDessert} onChange={onChange} />
    </div>
  );
}

function FormControls({ hasPlans, onClearPlans, onReset }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
        >
          <Plus className="h-4 w-4" />
          Save plan
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>
      {hasPlans ? (
        <button
          type="button"
          onClick={onClearPlans}
          className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/10"
        >
          <Trash2 className="h-4 w-4" />
          Clear all plans
        </button>
      ) : null}
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-200">
      {label}
      <Input {...props} />
    </label>
  );
}

function SelectField({ label, options, value, onChange, name, required }) {
  return (
    <div className="flex flex-col gap-2 text-sm text-zinc-200">
      <span>{label}</span>
      <Select
        value={value || undefined}
        onValueChange={(nextValue) =>
          onChange({
            target: {
              name,
              value: nextValue,
              type: "select-one",
            },
          })
        }
        required={required}
      >
        <SelectTrigger className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-left text-sm text-white transition focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400/60">
          <SelectValue placeholder={`Choose ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="border border-white/10 bg-black/90 text-white">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DessertField({ checked, onChange }) {
  const handleCheckedChange = (nextChecked) => {
    onChange({
      target: {
        name: "includeDessert",
        value: nextChecked === true,
        type: "checkbox",
      },
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-200">
      <Checkbox
        id="includeDessert"
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />
      <label htmlFor="includeDessert" className="cursor-pointer">
        Include dessert course
      </label>
    </div>
  );
}

function NotesField({ value, onChange }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-200">
      Notes
      <Textarea
        name="notes"
        value={value}
        onChange={onChange}
        rows={4}
        placeholder="Any prep instructions or reminders..."
      />
    </label>
  );
}

PlannerForm.propTypes = {
  form: PropTypes.shape({
    title: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    servings: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    ingredient: PropTypes.string.isRequired,
    includeDessert: PropTypes.bool.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  statusMessage: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  areas: PropTypes.arrayOf(PropTypes.string).isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  metadataLoading: PropTypes.bool.isRequired,
  metadataError: PropTypes.string,
  hasPlans: PropTypes.bool.isRequired,
  onClearPlans: PropTypes.func.isRequired,
};

PlannerForm.defaultProps = {
  metadataError: "",
};

FormGrid.propTypes = {
  form: PlannerForm.propTypes.form,
  onChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  areas: PropTypes.arrayOf(PropTypes.string).isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FormControls.propTypes = {
  hasPlans: PropTypes.bool.isRequired,
  onClearPlans: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

SelectField.defaultProps = {
  required: false,
};

DessertField.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

NotesField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PlannerForm;
