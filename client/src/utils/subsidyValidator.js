export function validateDistributionDate(dateString, programStartDate = null, programEndDate = null) {
  if (!dateString) return "Date is required.";

  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0);

  if (programStartDate) {
    const start = new Date(programStartDate);
    start.setHours(0, 0, 0, 0);
    if (selectedDate < start) {
      return "Distribution date cannot be before the program start date.";
    }
  }

  if (programEndDate) {
    const end = new Date(programEndDate);
    end.setHours(0, 0, 0, 0);
    if (selectedDate > end) {
      return "Distribution date cannot exceed the program end date.";
    }
  }

  return null;
}


export function validateSubsidyAmount(amount, availableBudget) {
  const available = parseFloat(availableBudget) || 0;
  const newAmount = parseFloat(amount) || 0;

  if (available <= 0) {
    return "No available amount left for this program.";
  }
  if (newAmount > available) {
    return `Amount exceeds available budget. Available: ₱${available.toLocaleString()}`;
  }
  return null;
}