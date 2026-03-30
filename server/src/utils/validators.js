// server/src/utils/validators.js

// --------- REGISTER VALIDATION ---------
export function validateRegisterInput({ username, email, password }) {
  if (!username || username.trim() === "") {
    return "Username is required";
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return "Valid email is required";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null; // no errors
}

// --------- LOGIN VALIDATION ---------
export function validateLoginInput({ identifier, password }) {
  if (!identifier || identifier.trim() === "") {
    return "Username or email is required";
  }

  if (!password || password.trim() === "") {
    return "Password is required";
  }

  return null; // no errors
}


// --------- SETUP VALIDATION ---------
export function validateName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    return "Name is required";
  }

  const validPattern = /^[a-zA-Z0-9]+$/;
  if (!validPattern.test(name)) {
    return "Name must contain only letters and numbers";
  }

  if (name.length > 10) {
    return "Name must be up to 10 characters only";
  }

  return null;
}


// --------- GENDER VALIDATION ---------
export function validateGender(gender) {
  // Check if gender is provided
  if (!gender) {
    return "Gender is required";
  }

  // Convert to string (in case it's passed as a number)
  const value = String(gender);

  // Check valid values (1 = Male, 2 = Female)
  if (value !== "1" && value !== "2") {
    return "Invalid gender selection";
  }

  return null; // no errors
}

 
