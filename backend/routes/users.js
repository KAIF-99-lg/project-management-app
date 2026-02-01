import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, userController.getAllUsers);
router.get('/me/teams', authenticateToken, userController.getUserTeams);
router.get('/me/projects', authenticateToken, userController.getUserProjects);
router.get('/:id', authenticateToken, userController.getUserById);

export { router as userRoutes };