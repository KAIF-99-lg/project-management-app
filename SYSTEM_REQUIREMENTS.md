# Project Management System - Requirements Implementation

## System Overview

This project management system implements role-based access control with two main user types: **Managers** and **Employees** (Members).

## Manager Capabilities

### Team Management
- ✅ Create teams
- ✅ Add employees to teams
- ✅ Remove employees from teams
- ✅ View all teams they own

### Project Management
- ✅ Create projects
- ✅ Assign projects to specific teams
- ✅ Update project details
- ✅ View all projects they own

### Task Management
- ✅ Create tasks within projects
- ✅ Assign tasks to team members (employees only)
- ✅ Update task details
- ✅ Delete tasks
- ✅ View all tasks they created

## Employee Capabilities

### Team Access
- ✅ View all teams they belong to
- ✅ See team members and details

### Project Access
- ✅ View projects assigned to their teams
- ✅ Read-only access to project information

### Task Management
- ✅ View only tasks assigned to them
- ✅ Update status of their own tasks (To Do → In Progress → In Review → Done)
- ❌ Cannot create, delete, or assign tasks
- ❌ Cannot modify other task details

## Key Features Implemented

### Multi-Team Membership
- ✅ Employees can belong to multiple teams simultaneously
- ✅ Access to projects from all their teams
- ✅ Tasks can be assigned from any team they belong to

### Role-Based Access Control
- ✅ Manager-only endpoints for creation operations
- ✅ Employee-restricted access to their own data
- ✅ Proper authentication and authorization middleware

### Data Relationships
- ✅ Teams → Projects (one-to-many)
- ✅ Projects → Tasks (one-to-many)
- ✅ Users → Teams (many-to-many)
- ✅ Tasks → Users (assigned to specific employees)

## API Endpoints

### Authentication
- `POST /api/auth/manager/login` - Manager login
- `POST /api/auth/manager/signup` - Manager registration
- `POST /api/auth/member/login` - Employee login
- `POST /api/auth/member/signup` - Employee registration

### Teams (Manager only for creation/modification)
- `GET /api/teams` - Get teams (filtered by role)
- `POST /api/teams` - Create team (Manager only)
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams/:id/members` - Add member (Manager only)
- `DELETE /api/teams/:id/members/:userId` - Remove member (Manager only)

### Projects (Manager only for creation/modification)
- `GET /api/projects` - Get projects (filtered by role)
- `POST /api/projects` - Create project (Manager only)
- `PUT /api/projects/:id` - Update project (Manager only)

### Tasks
- `GET /api/tasks` - Get tasks (filtered by role)
- `GET /api/tasks/my-tasks` - Get user's assigned tasks
- `POST /api/tasks` - Create task (Manager only)
- `PUT /api/tasks/:id` - Update task (role-based restrictions)
- `DELETE /api/tasks/:id` - Delete task (Manager only)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me/teams` - Get current user's teams
- `GET /api/users/me/projects` - Get current user's projects

## Frontend Pages

### Manager Interface
- Team Management - Create/manage teams and members
- Project Management - Create/assign projects to teams
- Task Management - Create/assign tasks to team members
- Dashboard - Overview of all managed resources

### Employee Interface
- Dashboard - Overview of assigned teams, projects, and tasks
- My Tasks - View and update status of assigned tasks
- Task filtering and status updates

## Running the System

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Security Features

- JWT-based authentication
- Role-based route protection
- Input validation and sanitization
- Secure password hashing
- CORS configuration
- Error handling with proper status codes

## Database Models

### User
- name, email, password, role (Manager/Member)
- Password hashing with bcrypt

### Team
- name, description, owner (Manager), members array
- Support for multiple members per team

### Project
- name, description, team assignment, owner (Manager)
- Status tracking and priority levels

### Task
- title, description, project, assignedTo, createdBy
- Status workflow: To Do → In Progress → In Review → Done
- Priority levels: Low, Medium, High, Critical