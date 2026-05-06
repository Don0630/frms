export function validateDistributionDate(dateString) {
  if (!dateString) return "Date is required.";

  const selectedDate = new Date(dateString);

  // normalize "today" (remove time part)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // max allowed = 1 year from today
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 1);
  maxDate.setHours(23, 59, 59, 999);

  if (selectedDate < today) {
    return "Past distribution dates are not allowed.";
  }

  if (selectedDate > maxDate) {
    return "Date cannot exceed 1 year from today.";
  }

  return null;
}