export const getToday = () => new Date().toISOString().split("T")[0];

export const resolveValue = (currentValue, options = []) => {
  if (!options.length) {
    return "";
  }

  if (currentValue && options.includes(currentValue)) {
    return currentValue;
  }

  return options[0];
};

export const formatDateToISO = (date) => {
  if (!(date instanceof Date)) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseISODate = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
};
