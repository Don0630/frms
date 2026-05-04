// Validates required fields
export function validateRequiredFields(data, fields) {
  for (const field of fields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      const error = new Error(`${field} is required`);
      error.code = "REQUIRED_FIELD_MISSING";
      error.statusCode = 400;
      throw error;
    }
  }
}

// Check if two fields match
export function validateFieldsMatch(data, field1, field2) {
  if (data[field1] !== data[field2]) {
    const error = new Error(`${field1} and ${field2} do not match`);
    error.code = "FIELDS_DO_NOT_MATCH";
    error.statusCode = 400;
    throw error;
  }
}