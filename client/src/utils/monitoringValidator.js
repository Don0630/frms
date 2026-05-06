export function validateMonitoringDate(dateString, fieldName = "Date") {
  if (!dateString) {
    return `${fieldName} is required.`;
  }

  const selectedDate = new Date(dateString);

  // normalize today (remove time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // normalize selected date
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return `${fieldName} cannot be a future date.`;
  }

  return null;
}