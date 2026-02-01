import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireManager, requireAny } from '../middleware/roles.js';

const router = express.Router();

// Mock data for calculations
const members = [
  { id: 1, name: 'John Doe', role: 'Lead Developer' },
  { id: 2, name: 'Jane Smith', role: 'UI Designer' },
  { id: 3, name: 'Mike Johnson', role: 'Backend Developer' },
  { id: 4, name: 'Sarah Wilson', role: 'QA Engineer' }
];

const tasks = [
  { assigneeId: 1, status: 'completed', priority: 'high', completedDate: '2024-01-10', estimatedHours: 8, actualHours: 6 },
  { assigneeId: 1, status: 'completed', priority: 'medium', completedDate: '2024-01-12', estimatedHours: 4, actualHours: 5 },
  { assigneeId: 1, status: 'in-progress', priority: 'high', estimatedHours: 6, actualHours: 3 },
  { assigneeId: 2, status: 'completed', priority: 'high', completedDate: '2024-01-08', estimatedHours: 12, actualHours: 10 },
  { assigneeId: 2, status: 'completed', priority: 'low', completedDate: '2024-01-14', estimatedHours: 3, actualHours: 4 },
  { assigneeId: 2, status: 'todo', priority: 'medium', estimatedHours: 8, actualHours: 0 },
  { assigneeId: 3, status: 'completed', priority: 'high', completedDate: '2024-01-11', estimatedHours: 16, actualHours: 14 },
  { assigneeId: 3, status: 'in-progress', priority: 'medium', estimatedHours: 10, actualHours: 7 },
  { assigneeId: 4, status: 'completed', priority: 'medium', completedDate: '2024-01-09', estimatedHours: 6, actualHours: 8 }
];

// Member progress statistics (for tables and charts)
router.get('/member-progress', authenticateToken, requireManager, (req, res) => {
  const memberStats = members.map(member => {
    const memberTasks = tasks.filter(t => t.assigneeId === member.id);
    const completedTasks = memberTasks.filter(t => t.status === 'completed');
    const inProgressTasks = memberTasks.filter(t => t.status === 'in-progress');
    const todoTasks = memberTasks.filter(t => t.status === 'todo');
    
    const totalEstimated = memberTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const totalActual = memberTasks.reduce((sum, t) => sum + t.actualHours, 0);
    const completionRate = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0;
    const efficiency = totalEstimated > 0 ? Math.round((totalEstimated / totalActual) * 100) : 100;
    
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      totalTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      todoTasks: todoTasks.length,
      completionRate,
      efficiency,
      totalHours: totalActual,
      estimatedHours: totalEstimated
    };
  });
  
  res.json({ memberStats });
});

// Chart data for member performance
router.get('/member-charts', authenticateToken, requireManager, (req, res) => {
  const chartData = {
    completionRates: members.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      const completedTasks = memberTasks.filter(t => t.status === 'completed');
      const rate = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0;
      
      return {
        name: member.name,
        completionRate: rate,
        totalTasks: memberTasks.length
      };
    }),
    
    taskDistribution: members.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      
      return {
        name: member.name,
        completed: memberTasks.filter(t => t.status === 'completed').length,
        inProgress: memberTasks.filter(t => t.status === 'in-progress').length,
        todo: memberTasks.filter(t => t.status === 'todo').length
      };
    }),
    
    efficiency: members.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      const totalEstimated = memberTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
      const totalActual = memberTasks.reduce((sum, t) => sum + t.actualHours, 0);
      const efficiency = totalEstimated > 0 ? Math.round((totalEstimated / totalActual) * 100) : 100;
      
      return {
        name: member.name,
        efficiency,
        estimatedHours: totalEstimated,
        actualHours: totalActual
      };
    })
  };
  
  res.json(chartData);
});

// Legacy endpoints
router.get('/complete-overview', authenticateToken, requireManager, (req, res) => {
  res.json({
    projectMetrics: {
      totalProjects: 12,
      activeProjects: 8,
      completedProjects: 4,
      projectsOnTrack: 6,
      projectsDelayed: 2
    },
    taskMetrics: {
      totalTasks: 240,
      completedTasks: 156,
      inProgressTasks: 32,
      todoTasks: 28,
      overdueTasks: 5,
      completionRate: 65
    },
    teamMetrics: {
      totalMembers: 24,
      activeMembers: 20,
      avgTasksPerMember: 10,
      topPerformers: [
        { name: 'John Doe', tasksCompleted: 24, efficiency: 92 },
        { name: 'Jane Smith', tasksCompleted: 18, efficiency: 88 }
      ]
    },
    timelineData: {
      projectProgress: [
        { month: 'Oct', completed: 12, inProgress: 8 },
        { month: 'Nov', completed: 18, inProgress: 6 },
        { month: 'Dec', completed: 24, inProgress: 9 },
        { month: 'Jan', completed: 30, inProgress: 12 }
      ],
      weeklyTaskCompletion: [
        { week: 'Week 1', planned: 20, completed: 18 },
        { week: 'Week 2', planned: 25, completed: 22 },
        { week: 'Week 3', planned: 30, completed: 28 },
        { week: 'Week 4', planned: 22, completed: 20 }
      ]
    },
    alerts: [
      { type: 'warning', message: '5 tasks are overdue', priority: 'high' },
      { type: 'info', message: 'Website Redesign 75% complete', priority: 'medium' },
      { type: 'success', message: 'API Integration ready for review', priority: 'low' }
    ]
  });
});

router.get('/overview', authenticateToken, requireAny, (req, res) => {
  res.json({
    projectProgress: [
      { month: 'Jan', completed: 12, inProgress: 8 },
      { month: 'Feb', completed: 18, inProgress: 6 },
      { month: 'Mar', completed: 24, inProgress: 9 },
      { month: 'Apr', completed: 30, inProgress: 12 }
    ],
    taskDistribution: [
      { status: 'Completed', count: 45, percentage: 60 },
      { status: 'In Progress', count: 20, percentage: 27 },
      { status: 'Todo', count: 10, percentage: 13 }
    ],
    teamPerformance: [
      { member: 'John Doe', tasksCompleted: 24, efficiency: 92 },
      { member: 'Jane Smith', tasksCompleted: 18, efficiency: 88 },
      { member: 'Mike Johnson', tasksCompleted: 15, efficiency: 85 }
    ]
  });
});

router.get('/work-progress', authenticateToken, requireAny, (req, res) => {
  res.json({
    weeklyProgress: [
      { week: 'Week 1', planned: 20, completed: 18 },
      { week: 'Week 2', planned: 25, completed: 22 },
      { week: 'Week 3', planned: 30, completed: 28 },
      { week: 'Week 4', planned: 22, completed: 20 }
    ],
    projectTimeline: [
      { project: 'Website Redesign', startDate: '2024-01-01', endDate: '2024-02-15', progress: 75 },
      { project: 'Mobile App', startDate: '2024-01-15', endDate: '2024-03-30', progress: 45 }
    ]
  });
});

export { router as analyticsRoutes };