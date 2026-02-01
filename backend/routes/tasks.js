import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, taskController.getAllTasks);
router.get('/my-tasks', authenticateToken, taskController.getUserTasks);
router.get('/:id', authenticateToken, taskController.getTaskById);
router.post('/', authenticateToken, taskController.createTask);
router.put('/:id', authenticateToken, taskController.updateTask);
router.post('/:id/comments', authenticateToken, taskController.addComment);
router.delete('/:id', authenticateToken, taskController.deleteTask);

export { router as tasksRoutes };