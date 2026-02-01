import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(createErrorResponse(
        'Authentication required',
        ErrorCodes.UNAUTHORIZED
      ));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(createErrorResponse(
        'Insufficient permissions',
        ErrorCodes.FORBIDDEN
      ));
    }

    next();
  };
};

export const requireManager = requireRole(['Manager']);
export const requireMember = requireRole(['Member']);
export const requireAny = requireRole(['Manager', 'Member']);