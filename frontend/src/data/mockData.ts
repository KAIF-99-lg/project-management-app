// Mock Data Structure for Project Management System

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // For mock authentication
  role: 'Manager' | 'Member';
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  role: 'Admin' | 'Member';
}

export interface Team {
  id: string;
  name: string;
  createdBy: string;
  members: TeamMember[];
}

export interface Project {
  id: string;
  name: string;
  teamId: string;
  createdBy: string;
  status: 'Active' | 'Completed' | 'On Hold';
  description?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  projectId: string;
  progress: number;
  dueDate: string;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  assignedTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface ProjectProgress {
  projectId: string;
  userProgress: UserProgress[];
}

export interface ActivityLog {
  id: string;
  message: string;
  performedBy: string;
  timestamp: string;
  type: 'task_created' | 'task_assigned' | 'task_updated' | 'project_created' | 'team_created' | 'member_added';
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user_001',
    name: 'Kaif Ahmed',
    email: 'kaif@example.com',
    password: 'manager123',
    role: 'Manager',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'user_002',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'member123',
    role: 'Member',
    createdAt: '2026-01-16T10:00:00Z'
  },
  {
    id: 'user_003',
    name: 'Priya Singh',
    email: 'priya@example.com',
    password: 'member123',
    role: 'Member',
    createdAt: '2026-01-17T10:00:00Z'
  },
  {
    id: 'user_004',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    password: 'member123',
    role: 'Member',
    createdAt: '2026-01-18T10:00:00Z'
  },
  {
    id: 'user_005',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'manager123',
    role: 'Manager',
    createdAt: '2026-01-19T10:00:00Z'
  }
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team_001',
    name: 'Frontend Team',
    createdBy: 'user_001',
    members: [
      { userId: 'user_001', role: 'Admin' },
      { userId: 'user_002', role: 'Member' },
      { userId: 'user_003', role: 'Member' }
    ]
  },
  {
    id: 'team_002',
    name: 'Backend Team',
    createdBy: 'user_001',
    members: [
      { userId: 'user_001', role: 'Admin' },
      { userId: 'user_004', role: 'Member' }
    ]
  },
  {
    id: 'team_003',
    name: 'Design Team',
    createdBy: 'user_005',
    members: [
      { userId: 'user_005', role: 'Admin' },
      { userId: 'user_003', role: 'Member' }
    ]
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'project_001',
    name: 'Website Revamp',
    teamId: 'team_001',
    createdBy: 'user_001',
    status: 'Active',
    description: 'Complete redesign of the company website with modern UI/UX',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'project_002',
    name: 'Mobile App Development',
    teamId: 'team_001',
    createdBy: 'user_001',
    status: 'Active',
    description: 'Build a cross-platform mobile application',
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'project_003',
    name: 'API Integration',
    teamId: 'team_002',
    createdBy: 'user_001',
    status: 'Active',
    description: 'Integrate third-party APIs for enhanced functionality',
    createdAt: '2026-01-22T10:00:00Z'
  },
  {
    id: 'project_004',
    name: 'Database Migration',
    teamId: 'team_002',
    createdBy: 'user_001',
    status: 'On Hold',
    description: 'Migrate from MySQL to PostgreSQL',
    createdAt: '2026-01-23T10:00:00Z'
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task_001',
    title: 'Build Login Page',
    description: 'Create a responsive login page with form validation',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'user_002',
    projectId: 'project_001',
    progress: 70,
    dueDate: '2026-02-05T23:59:59Z',
    createdAt: '2026-01-25T10:00:00Z'
  },
  {
    id: 'task_002',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups for the homepage',
    status: 'Done',
    priority: 'High',
    assignedTo: 'user_003',
    projectId: 'project_001',
    progress: 100,
    dueDate: '2026-01-30T23:59:59Z',
    createdAt: '2026-01-25T11:00:00Z'
  },
  {
    id: 'task_003',
    title: 'Setup Navigation',
    description: 'Implement responsive navigation menu',
    status: 'Done',
    priority: 'Medium',
    assignedTo: 'user_002',
    projectId: 'project_001',
    progress: 100,
    dueDate: '2026-01-28T23:59:59Z',
    createdAt: '2026-01-25T12:00:00Z'
  },
  {
    id: 'task_004',
    title: 'Implement User Authentication',
    description: 'Add JWT-based authentication system',
    status: 'To Do',
    priority: 'High',
    assignedTo: 'user_004',
    projectId: 'project_003',
    progress: 0,
    dueDate: '2026-02-10T23:59:59Z',
    createdAt: '2026-01-26T10:00:00Z'
  },
  {
    id: 'task_005',
    title: 'Create Dashboard Components',
    description: 'Build reusable dashboard components',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'user_003',
    projectId: 'project_001',
    progress: 45,
    dueDate: '2026-02-08T23:59:59Z',
    createdAt: '2026-01-26T11:00:00Z'
  },
  {
    id: 'task_006',
    title: 'API Documentation',
    description: 'Write comprehensive API documentation',
    status: 'To Do',
    priority: 'Low',
    assignedTo: 'user_004',
    projectId: 'project_003',
    progress: 0,
    dueDate: '2026-02-15T23:59:59Z',
    createdAt: '2026-01-27T10:00:00Z'
  },
  {
    id: 'task_007',
    title: 'Payment Integration',
    description: 'Integrate Stripe payment gateway',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'user_002',
    projectId: 'project_002',
    progress: 30,
    dueDate: '2026-02-12T23:59:59Z',
    createdAt: '2026-01-27T11:00:00Z'
  },
  {
    id: 'task_008',
    title: 'Mobile UI Design',
    description: 'Design mobile app interface',
    status: 'Done',
    priority: 'High',
    assignedTo: 'user_003',
    projectId: 'project_002',
    progress: 100,
    dueDate: '2026-01-31T23:59:59Z',
    createdAt: '2026-01-28T10:00:00Z'
  },
  {
    id: 'task_009',
    title: 'Testing & QA',
    description: 'Perform comprehensive testing',
    status: 'To Do',
    priority: 'Medium',
    assignedTo: 'user_002',
    projectId: 'project_001',
    progress: 0,
    dueDate: '2026-02-20T23:59:59Z',
    createdAt: '2026-01-28T11:00:00Z'
  },
  {
    id: 'task_010',
    title: 'Database Schema Design',
    description: 'Design PostgreSQL database schema',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'user_004',
    projectId: 'project_004',
    progress: 60,
    dueDate: '2026-02-07T23:59:59Z',
    createdAt: '2026-01-29T10:00:00Z'
  }
];

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log_001',
    message: "Manager Kaif Ahmed assigned task 'Build Login Page' to Rahul Sharma",
    performedBy: 'user_001',
    timestamp: '2026-01-30T09:30:00Z',
    type: 'task_assigned'
  },
  {
    id: 'log_002',
    message: "Priya Singh marked task 'Design Homepage' as completed",
    performedBy: 'user_003',
    timestamp: '2026-01-30T10:15:00Z',
    type: 'task_updated'
  },
  {
    id: 'log_003',
    message: "Manager Kaif Ahmed created project 'Website Revamp'",
    performedBy: 'user_001',
    timestamp: '2026-01-30T11:00:00Z',
    type: 'project_created'
  },
  {
    id: 'log_004',
    message: "Rahul Sharma updated task 'Build Login Page' progress to 70%",
    performedBy: 'user_002',
    timestamp: '2026-01-30T12:30:00Z',
    type: 'task_updated'
  },
  {
    id: 'log_005',
    message: "Manager Kaif Ahmed created team 'Frontend Team'",
    performedBy: 'user_001',
    timestamp: '2026-01-30T13:00:00Z',
    type: 'team_created'
  },
  {
    id: 'log_006',
    message: "Manager Kaif Ahmed added Amit Kumar to Backend Team",
    performedBy: 'user_001',
    timestamp: '2026-01-30T14:00:00Z',
    type: 'member_added'
  },
  {
    id: 'log_007',
    message: "Manager Kaif Ahmed created task 'Payment Integration'",
    performedBy: 'user_001',
    timestamp: '2026-01-30T14:30:00Z',
    type: 'task_created'
  }
];

// Helper functions to calculate progress
export const calculateProjectProgress = (projectId: string): ProjectProgress => {
  const projectTasks = mockTasks.filter(task => task.projectId === projectId);
  const userIds = [...new Set(projectTasks.map(task => task.assignedTo))];
  
  const userProgress: UserProgress[] = userIds.map(userId => {
    const userTasks = projectTasks.filter(task => task.assignedTo === userId);
    const completedTasks = userTasks.filter(task => task.status === 'Done').length;
    const assignedTasks = userTasks.length;
    const progressPercentage = assignedTasks > 0 
      ? Math.round((completedTasks / assignedTasks) * 100) 
      : 0;
    
    return {
      userId,
      assignedTasks,
      completedTasks,
      progressPercentage
    };
  });
  
  return {
    projectId,
    userProgress
  };
};

export const getAllUserProgress = (): ProjectProgress[] => {
  return mockProjects.map(project => calculateProjectProgress(project.id));
};
