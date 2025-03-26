
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthProvider';
import { AuthLoadingState, UnauthorizedState } from '@/components/ui/standardized';
import { hasMinimumRole, PERMISSIONS, hasPermission } from '@/utils/permissions';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: UserRole[];
  resource?: keyof typeof PERMISSIONS;
  action?: 'view' | 'add' | 'edit' | 'delete';
  fallbackPath?: string;
}

/**
 * ProtectedRoute - A component that protects routes from unauthorized access
 * It checks if the user is authenticated and if they have the required permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  resource,
  action = 'view',
  fallbackPath = "/auth" 
}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { loading, user: !!user, userRole, requiredRoles, resource, action });

  // If authentication is still loading, show the loading state
  if (loading) {
    return <AuthLoadingState fullPage={true} />;
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    console.log('User not authenticated, redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Check permissions using the resource and action (if provided)
  if (resource && !hasPermission(userRole, resource, action)) {
    return (
      <UnauthorizedState 
        title="Insufficient Permissions"
        description={`You don't have the necessary permissions to ${action} ${resource}. Your current role is "${userRole}" but you need a higher permission level.`}
        backPath="/dashboard"
        showAdminSetupLink={true}
      />
    );
  }

  // If roles are required, check if the user has at least one of the required roles
  if (requiredRoles.length > 0 && userRole) {
    // Check if the user has the minimum required role
    const hasRequiredRole = requiredRoles.some(role => 
      hasMinimumRole(userRole, role)
    );
    
    if (!hasRequiredRole) {
      console.log('User lacks required role. Has:', userRole, 'Needs one of:', requiredRoles);
      // Show unauthorized state with multiple navigation options
      return (
        <UnauthorizedState 
          title="Insufficient Permissions"
          description={`You don't have the necessary permissions to access this page. Your current role is "${userRole}" but you need one of these roles: ${requiredRoles.join(', ')}.`}
          backPath="/dashboard"
          showAdminSetupLink={true}
        />
      );
    }
  }

  console.log('User authorized, rendering protected content');
  // If user is authenticated and has required role (if any), render the protected content or the Outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
