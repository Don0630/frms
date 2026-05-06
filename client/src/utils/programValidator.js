export function programDateRange(
  startDate,
  endDate,
  { isEdit = false, originalStartDate = null } = {}
) {
  if (!startDate || !endDate) {
    return "Start date and end date are required";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // CREATE: start must be today onwards
  if (!isEdit && start < today) {
    return "Start date cannot be in the past";
  }

  // EDIT: start cannot go earlier than original start
  if (isEdit && originalStartDate) {
    const original = new Date(originalStartDate);
    original.setHours(0, 0, 0, 0);

    if (start < original) {
      return "Start date cannot be earlier than original start date";
    }
  }

  // End must be after start
  if (end <= start) {
    return "End date must be after start date";
  }

  // End date window should be based on CURRENT start date
  const minEnd = new Date(start);
  minEnd.setMonth(minEnd.getMonth() + 1);

  const maxEnd = new Date(start);
  maxEnd.setFullYear(maxEnd.getFullYear() + 1);

  if (end < minEnd) {
    return "End date must be at least 1 month after start date";
  }

  if (end > maxEnd) {
    return "End date cannot exceed 1 year after start date";
  }

  return null;
}