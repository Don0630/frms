export function validateUsername(username, fieldName = "Username") {
  if (!username?.trim()) {
    return `${fieldName} is required.`;
  }

  const value = username.trim();

  if (value.length < 5) {
    return `${fieldName} must be at least 5 characters long.`;
  }

  const regex = /^[a-zA-Z0-9_]+$/;

  if (!regex.test(value)) {
    return `${fieldName} can only contain letters, numbers, and underscores.`;
  }

  return null;
}



export function validatePassword(password, confirmPassword, fieldName = "Password") {
  if (!password || password.trim() === "")
    return `${fieldName} is required.`;

  const value = password.trim();

  if (value.length < 8)
    return `${fieldName} must be at least 8 characters long.`;

  if (!/[A-Z]/.test(value))
    return `${fieldName} must contain at least one uppercase letter.`;

  if (!/[a-z]/.test(value))
    return `${fieldName} must contain at least one lowercase letter.`;

  if (!/[0-9]/.test(value))
    return `${fieldName} must contain at least one number.`;

  if (!/[^a-zA-Z0-9]/.test(value))
    return `${fieldName} must contain at least one special character.`;

  if (!confirmPassword || confirmPassword.trim() === "")
    return "Confirm Password is required.";

  if (value !== confirmPassword.trim())
    return "Passwords do not match.";

  return null;
}



export function validateRole(role) {
  const allowedRoles = ["Admin", "Staff"];

  if (!allowedRoles.includes(role)) {
    return "Invalid role selected";
  }

  return "";
}