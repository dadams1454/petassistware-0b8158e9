
import React, { useEffect, useState } from 'react';
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
  const { user, loading, userRole } = useAuth();
  const location = useLocation();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const [authTimeout, setAuthTimeout] = useState(false);

  // Explicitly check if we're on the auth page to prevent circular redirects
  const isAuthPage = location.pathname === '/auth';

  // If we're on the auth page, skip all checks and just render
  if (isAuthPage) {
    console.log('[ProtectedRoute] On auth page, bypassing protection');
    return <>{children}</>;
  }

  // Debug logging in development environment
  useEffect(() => {
    if (isDevelopment) {
      console.log('[ProtectedRoute]', { 
        loading, 
        user: !!user, 
        userRole, 
        requiredRoles, 
        resource, 
        action,
        path: location.pathname,
        isAuthPage
      });
    }
  }, [loading, user, userRole, requiredRoles, resource, action, location.pathname, isAuthPage]);

  // Set a timeout to prevent getting stuck in authentication loading state
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setAuthTimeout(true);
        console.log('[ProtectedRoute] Auth timeout occurred, will attempt to proceed');
      }, 1000); // Reduced timeout for better UX
      
      return () => clearTimeout(timer);
    } else {
      setAuthTimeout(false);
    }
  }, [loading]);

  // Force auth check to complete if we're stuck in a loading state for mock development auth
  useEffect(() => {
    if (isDevelopment && loading) {
      const forceAuthTimer = setTimeout(() => {
        console.log('[ProtectedRoute] Force completing auth check in development mode');
      }, 1000); // Reduced timeout
      
      return () => clearTimeout(forceAuthTimer);
    }
  }, [loading, isDevelopment]);

  // If authentication is still loading and timeout hasn't occurred, show the loading state
  if (loading && !authTimeout) {
    return <AuthLoadingState 
      message="Verifying authentication..." 
      fullPage={true} 
      onRetry={() => window.location.reload()} 
    />;
  }

  // If no valid user (after timeout or loading completes), redirect to login
  if (!user) {
    if (isDevelopment) {
      console.log(`[ProtectedRoute] Redirecting to auth page: ${fallbackPath}`);
    }
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // For the admin user, bypass resource checks if they have the admin role
  if (userRole === 'admin' || userRole === 'owner') {
    console.log('[ProtectedRoute] User has admin or owner role, bypassing detailed permission checks');
    return <>{children}</>;
  }

  // Check permissions using the resource and action (if provided)
  if (resource && !hasPermission(userRole, resource, action)) {
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
    const hasRequiredRole = requiredRoles.some(role => 
      hasMinimumRole(userRole, role)
    );
    
    if (!hasRequiredRole) {
      console.warn(`[Role] Permission denied: User with role "${userRole}" attempted to access a route requiring one of these roles: ${requiredRoles.join(', ')} at path: ${location.pathname}`);
      
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
  
  // If user is authenticated and has required role (if any), render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
