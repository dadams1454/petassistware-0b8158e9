
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
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
  
  // Short loading state when authenticating
  if (loading) {
    console.log('AuthLayout: showing loading state');
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // User is authenticated, render the protected content
  if (user) {
    console.log('AuthLayout: user authenticated, rendering outlet');
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    );
  }
  
  // For any protected route: redirect to login if not authenticated
  console.log('AuthLayout: no user found, redirecting to auth page');
  return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
};

export default AuthLayout;
