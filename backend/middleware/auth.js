import { verifyToken } from '../utils/jwt.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json(createErrorResponse(
      'Access token required',
      ErrorCodes.UNAUTHORIZED
    ));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json(createErrorResponse(
      'Invalid or expired token',
      ErrorCodes.UNAUTHORIZED
    ));
  }

  req.user = decoded;
  next();
};