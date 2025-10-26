import { useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import useClickOutside from "@/hooks/use-click-outside";
import { formatDateToISO, parseISODate } from "@/components/planner/utils";

function PlannerDatePicker({
  label,
  name,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const selectedDate = useMemo(() => parseISODate(value) ?? undefined, [value]);

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : placeholder;

  const handleSelect = (date) => {
    if (!date) {
      return;
    }

    const iso = formatDateToISO(date);

    if (!iso) {
      return;
    }

    onChange({
      target: {
        name,
        value: iso,
        type: "date",
      },
    });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 text-sm text-zinc-200">
      <span>{label}</span>
      <div className="relative" ref={containerRef}>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-xl border border-white/10 bg-black/40 text-left text-white hover:bg-white/10"
          onClick={() => setOpen((state) => !state)}
        >
          <span className={selectedDate ? "" : "text-zinc-400"}>
            {displayValue}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 opacity-60"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
          </svg>
        </Button>

        {open ? (
          <div className="absolute z-20 mt-2 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              defaultMonth={selectedDate ?? new Date()}
              fromDate={parseISODate(minDate) ?? undefined}
              toDate={parseISODate(maxDate) ?? undefined}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

PlannerDatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  placeholder: PropTypes.string,
};

PlannerDatePicker.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
  placeholder: "Pick a date",
};

export default PlannerDatePicker;
