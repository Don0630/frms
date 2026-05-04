// server/src/utils/loginValidators.js

export function validateCredentialsSecurity({ identifier, password }) {
  // identifier can be email OR username
  const emailRegex = /^\S+@\S+\.\S+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;

  const isEmail = emailRegex.test(identifier);
  const isUsername = usernameRegex.test(identifier);

  if (!isEmail && !isUsername) {
    const error = new Error(
      "Identifier must be a valid email or username (5–20 characters)"
    );
    error.statusCode = 400;
    throw error;
  }

  // password strength rules
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!passwordRegex.test(password)) {
    const error = new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
    error.statusCode = 400;
    throw error;
  }
}