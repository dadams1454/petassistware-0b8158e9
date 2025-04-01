
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoadingState, UnauthorizedState } from '@/components/ui/standardized';
import { hasPermission } from '@/utils/permissions';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: string[];
  resource?: string;
  action?: 'view' | 'add' | 'edit' | 'delete';
  fallbackPath?: string;
}

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

  // Show loading state while auth state is loading
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

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
