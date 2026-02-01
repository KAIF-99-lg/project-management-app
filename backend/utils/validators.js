import { createErrorResponse, ErrorCodes } from './errors.js';

// Validation helpers
export const validateRequired = (fields, data) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw {
      status: 400,
      response: createErrorResponse(
        `Required fields missing: ${missing.join(', ')}`,
        ErrorCodes.VALIDATION_ERROR
      )
    };
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw {
      status: 400,
      response: createErrorResponse(
        'Invalid email format',
        ErrorCodes.VALIDATION_ERROR
      )
    };
  }
};