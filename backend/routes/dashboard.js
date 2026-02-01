import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireManager, requireMember } from '../middleware/roles.js';

const router = express.Router();

router.get('/manager/overview', authenticateToken, requireManager, (req, res) => {
  res.json({
    stats: {
      totalProjects: 12,
      activeProjects: 8,
      completedTasks: 156,
      teamMembers: 24,
      pendingTasks: 32,
      overdueTasks: 5
    },
    recentProjects: [
      { id: 1, name: 'Website Redesign', progress: 75, status: 'active', dueDate: '2024-02-15' },
      { id: 2, name: 'Mobile App', progress: 45, status: 'active', dueDate: '2024-03-30' },
      { id: 3, name: 'API Integration', progress: 90, status: 'review', dueDate: '2024-01-25' }
    ],
    teamActivity: [
      { user: 'John Doe', action: 'completed task', project: 'Website Redesign', time: '2 hours ago' },
      { user: 'Jane Smith', action: 'updated project', project: 'Mobile App', time: '4 hours ago' },
      { user: 'Mike Johnson', action: 'created task', project: 'API Integration', time: '6 hours ago' }
    ],
    analytics: {
      projectProgress: [
        { month: 'Dec', completed: 18, inProgress: 6 },
        { month: 'Jan', completed: 24, inProgress: 8 }
      ],
      taskDistribution: [
        { status: 'Completed', count: 156, percentage: 65 },
        { status: 'In Progress', count: 32, percentage: 20 },
        { status: 'Todo', count: 28, percentage: 15 }
      ],
      teamPerformance: [
        { member: 'John Doe', tasksCompleted: 24, efficiency: 92 },
        { member: 'Jane Smith', tasksCompleted: 18, efficiency: 88 },
        { member: 'Mike Johnson', tasksCompleted: 15, efficiency: 85 }
      ]
    },
    notifications: [
      { id: 1, type: 'warning', message: '5 tasks are overdue', time: '1 hour ago' },
      { id: 2, type: 'info', message: 'Website Redesign 75% complete', time: '3 hours ago' }
    ]
  });
});

router.get('/member/overview', authenticateToken, requireMember, (req, res) => {
  res.json({
    stats: {
      assignedTasks: 8,
      completedTasks: 12,
      inProgressTasks: 3,
      overdueTasks: 1,
      completionRate: 75,
      avgTaskTime: '2.5 days'
    },
    recentTasks: [
      { id: 1, title: 'Update homepage design', priority: 'high', status: 'in-progress', dueDate: '2024-01-15', project: 'Website Redesign' },
      { id: 2, title: 'Fix login bug', priority: 'medium', status: 'todo', dueDate: '2024-01-18', project: 'Mobile App' },
      { id: 3, title: 'Write documentation', priority: 'low', status: 'completed', dueDate: '2024-01-10', project: 'API Integration' }
    ],
    upcomingDeadlines: [
      { taskId: 1, title: 'Update homepage design', dueDate: '2024-01-15', daysLeft: 2 },
      { taskId: 2, title: 'Fix login bug', dueDate: '2024-01-18', daysLeft: 5 }
    ],
    weeklyProgress: [
      { day: 'Mon', completed: 2 },
      { day: 'Tue', completed: 1 },
      { day: 'Wed', completed: 3 },
      { day: 'Thu', completed: 2 },
      { day: 'Fri', completed: 1 }
    ],
    notifications: [
      { id: 1, type: 'task', message: 'New task assigned: Update homepage design', time: '1 hour ago' },
      { id: 2, type: 'deadline', message: 'Task due tomorrow: Fix login bug', time: '3 hours ago' },
      { id: 3, type: 'completed', message: 'Task completed: Write documentation', time: '1 day ago' }
    ]
  });
});

// Legacy endpoints for backward compatibility
router.get('/manager', authenticateToken, requireManager, (req, res) => {
  res.json({
    stats: { totalProjects: 12, activeProjects: 8, completedTasks: 156, teamMembers: 24 },
    recentProjects: [{ id: 1, name: 'Website Redesign', progress: 75, status: 'active' }],
    teamActivity: [{ user: 'John Doe', action: 'completed task', time: '2 hours ago' }]
  });
});

router.get('/member', authenticateToken, requireMember, (req, res) => {
  res.json({
    stats: { assignedTasks: 8, completedTasks: 12, inProgressTasks: 3, overdueTasks: 1 },
    recentTasks: [{ id: 1, title: 'Update homepage design', priority: 'high', dueDate: '2024-01-15' }],
    notifications: [{ id: 1, message: 'New task assigned', time: '1 hour ago' }]
  });
});

export { router as dashboardRoutes };