
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Explicitly check if we're on the auth page
  const isAuthPage = location.pathname === '/auth';
  
  console.log('AuthLayout: Current auth state:', { 
    user: !!user, 
    loading, 
    path: location.pathname, 
    isAuthPage 
  });
  
  // If on auth page and user is already authenticated, redirect to dashboard
  if (isAuthPage && user) {
    console.log('AuthLayout: User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // If on auth page and not authenticated, render it without further checks
  if (isAuthPage) {
    console.log('AuthLayout: On auth page, bypassing authentication check');
    return <Outlet />;
  }
  
  // Very brief loading state - reduced to minimize delays
  if (loading) {
    console.log('AuthLayout: showing loading state');
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // For any protected route: always allow access in our mock environment
  // This ensures users can access the /dogs page without redirection
  console.log('AuthLayout: rendering outlet with main layout');
  return <Outlet />;
};

export default AuthLayout;
