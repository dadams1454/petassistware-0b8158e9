
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
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Debug logging in development environment
  if (isDevelopment) {
    console.log('[ProtectedRoute]', { 
      loading, 
      user: !!user, 
      userRole, 
      requiredRoles, 
      resource, 
      action,
      path: location.pathname
    });
  }

  // If authentication is still loading, show the loading state
  if (loading) {
    return <AuthLoadingState fullPage={true} />;
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    if (isDevelopment) {
      console.log('[Auth] User not authenticated, redirecting to:', fallbackPath);
    }
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Check permissions using the resource and action (if provided)
  if (resource && !hasPermission(userRole, resource, action)) {
    // Audit logging for permission failures
    console.warn(`[Permission] Denied: User with role "${userRole}" attempted to ${action} ${resource} at path: ${location.pathname}`);
    
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
      // Audit logging for role-based permission failures
      console.warn(`[Role] Permission denied: User with role "${userRole}" attempted to access a route requiring one of these roles: ${requiredRoles.join(', ')} at path: ${location.pathname}`);
      
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

  if (isDevelopment) {
    console.log('[ProtectedRoute] User authorized, rendering protected content');
  }
  // If user is authenticated and has required role (if any), render the protected content or the Outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
