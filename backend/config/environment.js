// Environment configuration (Render / Production safe)
export const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Security configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',

  // CORS configuration (NO localhost fallback)
  corsOrigin: process.env.CORS_ORIGIN,

  // Rate limiting
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100,

  // Request limits
  jsonLimit: '10mb',
  urlEncodedLimit: '10mb',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
