// Load dotenv ONLY in local development
if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config');
}

// Force production environment variables for Render
if (process.env.RENDER) {
  process.env.NODE_ENV = 'production';
  process.env.CORS_ORIGIN = 'https://project-management-app-theta-five.vercel.app';
  process.env.JWT_SECRET = 'mdkaif_project_management_super_secret_key_2024';
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import { config } from './config/environment.js';
import { errorHandler, notFoundHandler } from './utils/errors.js';

// Route imports
import { authRoutes } from './routes/auth.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { tasksRoutes } from './routes/tasks.js';
import { kanbanRoutes } from './routes/kanban.js';
import { projectRoutes } from './routes/projects.js';
import { teamRoutes } from './routes/teams.js';
import { memberRoutes } from './routes/members.js';
import { analyticsRoutes } from './routes/analytics.js';
import { activityRoutes } from './routes/activity.js';
import { userRoutes } from './routes/users.js';

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: ['https://project-management-app-theta-five.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/kanban', kanbanRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS origin: ${config.corsOrigin}`);
  console.log(`🗄️ MongoDB connected`);
});
