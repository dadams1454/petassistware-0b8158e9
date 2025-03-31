
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthProvider';
import { UnauthorizedState } from '@/components/ui/standardized';
import { AuthLoadingState } from '@/components/ui/standardized';
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
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  console.log('[ProtectedRoute] Checking permissions:', { 
    userRole, 
    resource, 
    action, 
    path: location.pathname 
  });

  // Show loading state briefly while auth state is loading
  if (loading) {
    return <AuthLoadingState message="Checking permissions..." />;
  }

  // If user is not authenticated
  if (!user) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If specific permissions check is required
  if (resource) {
    try {
      const hasAccess = hasPermission(userRole, resource, action);
      console.log('[ProtectedRoute] Resource permission check:', { resource, action, hasAccess });
      
      if (!hasAccess) {
        return (
          <UnauthorizedState 
            title="Permission Denied" 
            description={`You don't have permission to ${action} ${resource}`}
            backPath="/dashboard" 
            showAdminSetupLink={true}
          />
        );
      }
    } catch (error) {
      console.error('[ProtectedRoute] Error checking permissions:', error);
      return (
        <UnauthorizedState 
          title="Permission Error" 
          description="Failed to check your permissions. Please try again later."
          backPath="/dashboard"
        />
      );
    }
  }

  // If role-based access check is required
  if (requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(role => userRole === role || 
      hasMinimumRole(userRole, role));
    
    console.log('[ProtectedRoute] Role check:', { 
      userRole, 
      requiredRoles, 
      hasRole 
    });
    
    if (!hasRole) {
      return (
        <UnauthorizedState 
          title="Access Restricted" 
          description="You don't have the required role to access this page"
          backPath="/dashboard"
          showAdminSetupLink={true}
        />
      );
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
