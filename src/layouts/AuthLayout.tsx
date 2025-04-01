
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Check if we're on public paths that don't require authentication
  const isAuthPage = location.pathname === '/auth';
  const isPublicPage = location.pathname === '/'; // Landing page is public
  
  console.log('AuthLayout: Current auth state:', { 
    user: !!user, 
    loading, 
    path: location.pathname, 
    isAuthPage,
    isPublicPage
  });
  
  // If on auth page and user is already authenticated, redirect to dashboard
  if (isAuthPage && user) {
    console.log('AuthLayout: User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // If on auth page or public page, bypass auth check
  if (isAuthPage || isPublicPage) {
    console.log('AuthLayout: On public/auth page, bypassing authentication check');
    return <Outlet />;
  }
  
  // Brief loading state
  if (loading) {
    console.log('AuthLayout: showing loading state');
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // For any protected route: if no user, redirect to auth
  if (!user) {
    console.log('AuthLayout: Not authenticated, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, allow access to protected routes
  console.log('AuthLayout: User authenticated, rendering outlet');
  return <Outlet />;
};

export default AuthLayout;
