import { Navigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'Manager' | 'Member';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to appropriate login based on required role
    return <Navigate to={`/${requiredRole.toLowerCase()}/login`} replace />;
  }

  if (currentUser?.role !== requiredRole) {
    // Redirect to appropriate dashboard if wrong role
    return <Navigate to={`/${currentUser?.role.toLowerCase()}/dashboard`} replace />;
  }

  return <>{children}</>;
}
