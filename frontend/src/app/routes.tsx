import { createBrowserRouter, Navigate } from 'react-router';

// Landing Page
import Landing from '@/app/pages/Landing';

// Auth Pages
import ManagerLogin from '@/app/pages/auth/ManagerLogin';
import ManagerSignup from '@/app/pages/auth/ManagerSignup';
import MemberLogin from '@/app/pages/auth/MemberLogin';
import MemberSignup from '@/app/pages/auth/MemberSignup';

// Manager Pages
import ManagerDashboard from '@/app/pages/manager/Dashboard';
import TeamManagement from '@/app/pages/manager/TeamManagement';
import ProjectManagement from '@/app/pages/manager/ProjectManagement';
import ProjectDetails from '@/app/pages/manager/ProjectDetails';
import TaskManagement from '@/app/pages/manager/TaskManagement';
import KanbanBoard from '@/app/pages/manager/KanbanBoard';
import WorkProgress from '@/app/pages/manager/WorkProgress';
import ActivityLogs from '@/app/pages/manager/ActivityLogs';

// Member Pages
import MemberDashboard from '@/app/pages/member/Dashboard';
import MyTasks from '@/app/pages/member/MyTasks';
import TaskDetail from '@/app/pages/member/TaskDetail';
import MemberProjectDetails from '@/app/pages/member/ProjectDetails';

// Components
import ProtectedRoute from '@/app/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  // Manager Auth Routes
  {
    path: '/manager/login',
    element: <ManagerLogin />
  },
  {
    path: '/manager/signup',
    element: <ManagerSignup />
  },
  // Manager Protected Routes
  {
    path: '/manager/dashboard',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <ManagerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/teams',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <TeamManagement />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/projects',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <ProjectManagement />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/projects/:id',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <ProjectDetails />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/tasks',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <TaskManagement />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/kanban',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <KanbanBoard />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/progress',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <WorkProgress />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/activity',
    element: (
      <ProtectedRoute requiredRole="Manager">
        <ActivityLogs />
      </ProtectedRoute>
    )
  },
  // Member Auth Routes
  {
    path: '/member/login',
    element: <MemberLogin />
  },
  {
    path: '/member/signup',
    element: <MemberSignup />
  },
  // Member Protected Routes
  {
    path: '/member/dashboard',
    element: (
      <ProtectedRoute requiredRole="Member">
        <MemberDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/member/tasks',
    element: (
      <ProtectedRoute requiredRole="Member">
        <MyTasks />
      </ProtectedRoute>
    )
  },
  {
    path: '/member/tasks/:id',
    element: (
      <ProtectedRoute requiredRole="Member">
        <TaskDetail />
      </ProtectedRoute>
    )
  },
  {
    path: '/member/projects/:id',
    element: (
      <ProtectedRoute requiredRole="Member">
        <MemberProjectDetails />
      </ProtectedRoute>
    )
  },
  // 404 Route
  {
    path: '*',
    element: <Navigate to="/manager/login" replace />
  }
]);