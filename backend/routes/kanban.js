import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireManager, requireAny } from '../middleware/roles.js';
import { TASK_STATUS, KANBAN_COLUMNS } from '../constants/taskStatus.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

const router = express.Router();

// Mock tasks data using status constants
const tasks = [
  { id: 1, title: 'Design homepage', description: 'Create new homepage design', assignee: 'John Doe', assigneeId: 1, priority: 'high', status: TASK_STATUS.TODO, progress: 0, projectId: 1, dueDate: '2024-01-20' },
  { id: 2, title: 'Setup database', description: 'Configure production database', assignee: 'Jane Smith', assigneeId: 2, priority: 'medium', status: TASK_STATUS.TODO, progress: 0, projectId: 2, dueDate: '2024-01-25' },
  { id: 3, title: 'Implement auth', description: 'User authentication system', assignee: 'Mike Johnson', assigneeId: 3, priority: 'high', status: TASK_STATUS.IN_PROGRESS, progress: 60, projectId: 1, dueDate: '2024-01-18' },
  { id: 4, title: 'Test payment flow', description: 'End-to-end payment testing', assignee: 'Sarah Wilson', assigneeId: 4, priority: 'medium', status: TASK_STATUS.REVIEW, progress: 90, projectId: 2, dueDate: '2024-01-22' },
  { id: 5, title: 'Setup project structure', description: 'Initial project scaffolding', assignee: 'John Doe', assigneeId: 1, priority: 'low', status: TASK_STATUS.DONE, progress: 100, projectId: 1, dueDate: '2024-01-10' },
  { id: 6, title: 'API documentation', description: 'Document REST endpoints', assignee: 'Mike Johnson', assigneeId: 3, priority: 'medium', status: TASK_STATUS.DONE, progress: 100, projectId: 2, dueDate: '2024-01-15' }
];

// Get tasks grouped by status (for Kanban columns)
router.get('/boards', authenticateToken, requireAny, (req, res) => {
  const { projectId } = req.query;
  
  let filteredTasks = tasks;
  
  // Filter by project if specified
  if (projectId) {
    filteredTasks = tasks.filter(t => t.projectId === parseInt(projectId));
  }
  
  // Members can only see their own tasks
  if (req.user.role === 'member') {
    filteredTasks = filteredTasks.filter(t => t.assigneeId === req.user.id);
  }
  
  // Group tasks by status using constants
  const groupedTasks = {
    [TASK_STATUS.TODO]: filteredTasks.filter(t => t.status === TASK_STATUS.TODO),
    [TASK_STATUS.IN_PROGRESS]: filteredTasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS),
    [TASK_STATUS.REVIEW]: filteredTasks.filter(t => t.status === TASK_STATUS.REVIEW),
    [TASK_STATUS.DONE]: filteredTasks.filter(t => t.status === TASK_STATUS.DONE)
  };
  
  // Return columns with minimal task data
  const columns = KANBAN_COLUMNS.map(column => ({
    id: column.id,
    title: column.title,
    count: groupedTasks[column.id].length,
    tasks: groupedTasks[column.id].map(task => ({
      id: task.id,
      title: task.title,
      assignee: task.assignee,
      priority: task.priority,
      dueDate: task.dueDate
    }))
  }));
  
  res.json({ columns });
});

// Update task status/progress (assigned member only)
router.put('/tasks/:id/status', authenticateToken, requireAny, (req, res) => {
  const { status, progress } = req.body;
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  
  if (!task) {
    return res.status(404).json(createErrorResponse(
      'Task not found',
      ErrorCodes.NOT_FOUND
    ));
  }
  
  // Only assigned member can update their task
  if (task.assigneeId !== req.user.id) {
    return res.status(403).json(createErrorResponse(
      'Only assigned member can update this task',
      ErrorCodes.FORBIDDEN
    ));
  }
  
  // Validate status using constants
  if (status && !Object.values(TASK_STATUS).includes(status)) {
    return res.status(400).json(createErrorResponse(
      'Invalid task status',
      ErrorCodes.VALIDATION_ERROR
    ));
  }
  
  if (status) task.status = status;
  if (progress !== undefined) task.progress = progress;
  
  res.json({
    success: true,
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      assigneeId: task.assigneeId,
      priority: task.priority,
      status: task.status,
      progress: task.progress || 0,
      projectId: task.projectId,
      dueDate: task.dueDate
    }
  });
});

// Create new task
router.post('/tasks', authenticateToken, requireManager, (req, res) => {
  const { title, description, assigneeId, assigneeName, priority, status, projectId, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json(createErrorResponse(
      'Title required',
      ErrorCodes.VALIDATION_ERROR
    ));
  }
  
  const newTask = {
    id: Date.now(),
    title,
    description: description || '',
    assignee: assigneeName || 'Unassigned',
    assigneeId: assigneeId || null,
    priority: priority || 'medium',
    status: status || TASK_STATUS.TODO,
    progress: 0,
    projectId: projectId || null,
    dueDate: dueDate || null
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    task: newTask
  });
});

export { router as kanbanRoutes };