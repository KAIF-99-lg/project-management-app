// User role constants
export const USER_ROLES = {
  MANAGER: 'Manager',
  MEMBER: 'Member'
};

// Role permissions
export const PERMISSIONS = {
  [USER_ROLES.MANAGER]: [
    'create_team',
    'create_project',
    'create_task',
    'assign_tasks',
    'manage_members',
    'view_analytics'
  ],
  [USER_ROLES.MEMBER]: [
    'view_own_tasks',
    'update_task_status',
    'view_assigned_teams',
    'view_team_projects'
  ]
};