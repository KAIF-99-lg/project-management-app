// Production environment configuration
export const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Security configuration
  jwtSecret: process.env.JWT_SECRET || 'your-production-secret-key-change-this',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate limiting
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
  
  // Request limits
  jsonLimit: '10mb',
  urlEncodedLimit: '10mb',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};