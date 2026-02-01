import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireManager, requireAny } from '../middleware/roles.js';

const router = express.Router();

// Mock activity data
const activities = [
  {
    id: 1,
    userId: 2,
    userName: 'Jane Smith',
    userRole: 'member',
    action: 'task_completed',
    entityType: 'task',
    entityId: 3,
    entityName: 'Write API documentation',
    projectName: 'API Integration',
    timestamp: '2024-01-15T14:30:00Z',
    message: 'Jane Smith completed task "Write API documentation" in API Integration project'
  },
  {
    id: 2,
    userId: 1,
    userName: 'Manager',
    userRole: 'manager',
    action: 'task_created',
    entityType: 'task',
    entityId: 4,
    entityName: 'Design login page',
    projectName: 'Website Redesign',
    timestamp: '2024-01-15T13:15:00Z',
    message: 'Manager created new task "Design login page" in Website Redesign project'
  },
  {
    id: 3,
    userId: 3,
    userName: 'Mike Johnson',
    userRole: 'member',
    action: 'task_status_changed',
    entityType: 'task',
    entityId: 1,
    entityName: 'Implement auth system',
    projectName: 'Mobile App',
    metadata: { from: 'todo', to: 'in-progress' },
    timestamp: '2024-01-15T12:45:00Z',
    message: 'Mike Johnson moved "Implement auth system" from To Do to In Progress'
  },
  {
    id: 4,
    userId: 1,
    userName: 'Manager',
    userRole: 'manager',
    action: 'project_created',
    entityType: 'project',
    entityId: 5,
    entityName: 'E-commerce Platform',
    timestamp: '2024-01-15T11:20:00Z',
    message: 'Manager created new project "E-commerce Platform"'
  },
  {
    id: 5,
    userId: 4,
    userName: 'Sarah Wilson',
    userRole: 'member',
    action: 'comment_added',
    entityType: 'task',
    entityId: 2,
    entityName: 'Fix payment bug',
    projectName: 'E-commerce Platform',
    timestamp: '2024-01-15T10:30:00Z',
    message: 'Sarah Wilson added a comment to "Fix payment bug"'
  },
  {
    id: 6,
    userId: 1,
    userName: 'Manager',
    userRole: 'manager',
    action: 'member_assigned',
    entityType: 'task',
    entityId: 6,
    entityName: 'Setup CI/CD pipeline',
    projectName: 'DevOps',
    metadata: { assignedTo: 'Mike Johnson' },
    timestamp: '2024-01-15T09:15:00Z',
    message: 'Manager assigned "Setup CI/CD pipeline" to Mike Johnson'
  }
];

// Get recent activities (for timeline display)
router.get('/recent', authenticateToken, requireAny, (req, res) => {
  const { limit = 20, projectId, userId } = req.query;
  
  let filteredActivities = activities;
  
  // Members can only see activities related to their tasks/projects
  if (req.user.role === 'member') {
    filteredActivities = activities.filter(a => 
      a.userId === req.user.id || // Their own activities
      (a.entityType === 'task' && isUserAssignedToTask(req.user.id, a.entityId)) // Tasks they're assigned to
    );
  }
  
  if (projectId) {
    filteredActivities = filteredActivities.filter(a => a.projectName && a.entityId === parseInt(projectId));
  }
  
  if (userId) {
    // Members can only see their own activities
    if (req.user.role === 'member' && parseInt(userId) !== req.user.id) {
      return res.status(403).json(createErrorResponse(
        'Access denied',
        ErrorCodes.FORBIDDEN
      ));
    }
    filteredActivities = filteredActivities.filter(a => a.userId === parseInt(userId));
  }
  
  // Minimal activity data for timeline
  const recentActivities = filteredActivities
    .slice(0, parseInt(limit))
    .map(activity => ({
      id: activity.id,
      message: activity.message,
      userName: activity.userName,
      timestamp: activity.timestamp,
      timeAgo: getTimeAgo(activity.timestamp)
    }));
  
  res.json({ activities: recentActivities });
});

// Get project-specific activities
router.get('/project/:projectId', authenticateToken, requireAny, (req, res) => {
  let projectActivities = activities
    .filter(a => a.entityId === parseInt(req.params.projectId) || a.projectName);
  
  // Members can only see activities for tasks they're assigned to
  if (req.user.role === 'member') {
    projectActivities = projectActivities.filter(a => 
      a.userId === req.user.id || 
      (a.entityType === 'task' && isUserAssignedToTask(req.user.id, a.entityId))
    );
  }
  
  const result = projectActivities
    .slice(0, 10)
    .map(activity => ({
      id: activity.id,
      message: activity.message,
      userName: activity.userName,
      action: activity.action,
      timestamp: activity.timestamp,
      timeAgo: getTimeAgo(activity.timestamp)
    }));
  
  res.json({ activities: result });
});

// Get user-specific activities (for member profile)
router.get('/user/:userId', authenticateToken, requireManager, (req, res) => {
  const userActivities = activities
    .filter(a => a.userId === parseInt(req.params.userId))
    .slice(0, 15)
    .map(activity => ({
      id: activity.id,
      message: activity.message,
      action: activity.action,
      entityName: activity.entityName,
      projectName: activity.projectName,
      timestamp: activity.timestamp,
      timeAgo: getTimeAgo(activity.timestamp)
    }));
  
  res.json({ activities: userActivities });
});

// Helper function to check if user is assigned to task
function isUserAssignedToTask(userId, taskId) {
  // Mock task assignments - in real app, query database
  const taskAssignments = {
    1: 3, // Task 1 assigned to user 3
    2: 4, // Task 2 assigned to user 4
    3: 2, // Task 3 assigned to user 2
    4: 2, // Task 4 assigned to user 2
    5: 2, // Task 5 assigned to user 2
    6: 3  // Task 6 assigned to user 3
  };
  return taskAssignments[taskId] === userId;
}

// Helper function to calculate time ago
function getTimeAgo(timestamp) {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return activityTime.toLocaleDateString();
}

export { router as activityRoutes };