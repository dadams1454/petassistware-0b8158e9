
import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthLoadingState, UnauthorizedState } from '@/components/ui/standardized';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: string[];
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
  const { user, loading, session } = useAuth();
  const location = useLocation();

  // If authentication is still loading, show the loading state
  if (loading) {
    return <AuthLoadingState fullPage={true} />;
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // If roles are required, check if the user has at least one of the required roles
  if (requiredRoles.length > 0) {
    // Get user role from session
    const userRole = user.user_metadata?.role || 'viewer';
    
    // Check if the user has one of the required roles
    const hasRequiredRole = requiredRoles.includes(userRole);
    
    if (!hasRequiredRole) {
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

  // If user is authenticated and has required role (if any), render the protected content or the Outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
