// Standardized error response format
export const createErrorResponse = (message, code = null, details = null) => ({
  success: false,
  error: {
    message,
    code,
    details
  },
  data: null
});

// Common error types
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  SERVER_ERROR: 'SERVER_ERROR'
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json(createErrorResponse(
      'Validation failed',
      ErrorCodes.VALIDATION_ERROR,
      err.details
    ));
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(createErrorResponse(
      'Authentication required',
      ErrorCodes.UNAUTHORIZED
    ));
  }
  
  // Default server error
  res.status(500).json(createErrorResponse(
    'Internal server error',
    ErrorCodes.SERVER_ERROR
  ));
};

// Not found handler
export const notFoundHandler = (req, res) => {
  res.status(404).json(createErrorResponse(
    'Endpoint not found',
    ErrorCodes.NOT_FOUND
  ));
};