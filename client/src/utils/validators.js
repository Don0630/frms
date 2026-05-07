export function validateRequiredFields(data, fields, labels = {}) {
  for (const field of fields) {
    const value = data?.[field];

    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "");

    if (isEmpty) {
      return `${labels[field] || field} is required.`;
    }
  }

  return null;
}


export function validateNoChanges(originalData, newData, fields = []) {
  const normalize = (obj) =>
    fields.reduce((acc, key) => {
      const val = obj?.[key];

      acc[key] =
        val === null || val === undefined
          ? ""
          : String(val).trim();

      return acc;
    }, {});

  const original = normalize(originalData);
  const updated = normalize(newData);

  return JSON.stringify(original) === JSON.stringify(updated)
    ? "No changes have been made!"
    : null;
}


export function validatePHAge(dateOfBirth) {
 
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18) {
    return "Farmer must be at least 18 years old!";
  }

  if (age > 100) {
    return "Age cannot exceed 100 years!";
  }

  return null;
}



export function validatePHMobileNumber(number) {

  const cleaned = number.trim();

  if (!/^09/.test(cleaned)) {
    return "Contact number must start with 09!";
  }

  if (!/^\d+$/.test(cleaned)) {
    return "Contact number must contain numbers only!";
  }

  if (cleaned.length !== 11) {
    return "Contact number must be exactly 11 digits!";
  }

  return null; // valid
}



export function validateEmail(email) {
  if (!email) return "Email is required";

  const cleaned = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleaned)) {
    return "Invalid email format!";
  }

  return null;
}



export function validatePositiveNumber(value, fieldName = "Field") {
  if (value === null || value === undefined || value === "") {
    return `${fieldName} is required.`;
  }

  const num = Number(value);

  if (isNaN(num)) {
    return `${fieldName} must be a valid number.`;
  }

  if (num <= 0) {
    return `${fieldName} must be greater than 0.`;
  }

  return null;
}



export function validateGender(gender) {
  const allowedGenders = [
    "Male",
    "Female",
    "Other",
  ];

  if (!allowedGenders.includes(gender)) {
    return "Invalid gender selected";
  }

  return "";
}