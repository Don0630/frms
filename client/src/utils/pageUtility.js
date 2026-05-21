// January 15, 2025
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Jan 15, 2025
export function formatDateShort(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// 01/15/2025
export function formatDateNumeric(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ₱1,000,000.00
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "N/A";
  return `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// 1,000,000
export function formatNumber(value) {
  if (value === null || value === undefined) return "N/A";
  return Number(value).toLocaleString("en-PH");
}

// 25 years old
export function formatAge(dateOfBirth) {
  if (!dateOfBirth) return "N/A";
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return `${age} years old`;
}