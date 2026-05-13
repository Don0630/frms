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


export function validateProgramStatus(status) {
  const allowedStatuses = ["Active", "Completed", "Dropped"];

  if (!allowedStatuses.includes(status)) {
    return "Invalid status!";
  }

  return null;
}


// --------- BUDGET VALIDATION ---------
export function validateProgramBudget(newBudget, totalDistributed) {
  if (parseFloat(newBudget) < totalDistributed) {
    return `Budget cannot be less than the total already distributed (₱${Number(totalDistributed).toLocaleString()})`;
  }
  return null;
}

// --------- STATUS CHANGE VALIDATION ---------
export function validateProgramStatusChange(newStatus, currentStatus, pendingDistributions, budget, totalDistributed) {
  
  // Dropped → Completed not allowed
  if (currentStatus === "Dropped" && newStatus === "Completed") {
    return `Cannot set to "Completed" — program was dropped`;
  }

  // Completed → Dropped not allowed
  if (currentStatus === "Completed" && newStatus === "Dropped") {
    return `Cannot set to "Dropped" — program is already completed`;
  }

  // Active → Dropped
  if (newStatus === "Dropped") {
    if (parseFloat(totalDistributed) > 0) {
      return `Cannot set to "Dropped" — budget has already been distributed (₱${Number(totalDistributed).toLocaleString()})`;
    }
    if (pendingDistributions > 0) {
      return `Cannot set to "Dropped" — there are ${pendingDistributions} pending distributions`;
    }
  }

  // Active → Completed
  if (newStatus === "Completed") {
    if (pendingDistributions > 0) {
      return `Cannot set to "Completed" — there are ${pendingDistributions} pending distributions`;
    }
    if (parseFloat(totalDistributed) < parseFloat(budget)) {
      return `Cannot set to "Completed" — budget is not yet fully distributed (₱${Number(totalDistributed).toLocaleString()} of ₱${Number(budget).toLocaleString()})`;
    }
  }

  return null;
}