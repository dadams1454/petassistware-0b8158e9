
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthProvider';
import { AuthLoadingState, UnauthorizedState } from '@/components/ui/standardized';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

/**
 * ProtectedRoute - A component that protects routes from unauthorized access
 * It checks if the user is authenticated and optionally if they have the required roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = "/auth" 
}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { loading, user: !!user, userRole, requiredRoles });

  // If authentication is still loading, show the loading state
  if (loading) {
    return <AuthLoadingState fullPage={true} />;
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    console.log('User not authenticated, redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // If roles are required, check if the user has at least one of the required roles
  if (requiredRoles.length > 0 && userRole) {
    // Check if the user has one of the required roles
    const hasRequiredRole = requiredRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      console.log('User lacks required role. Has:', userRole, 'Needs one of:', requiredRoles);
      // Show unauthorized state or redirect
      return (
        <UnauthorizedState 
          title="Insufficient Permissions"
          description="You don't have the necessary permissions to access this page."
          backPath="/dashboard"
        />
      );
    }
  }

  console.log('User authorized, rendering protected content');
  // If user is authenticated and has required role (if any), render the protected content or the Outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
