
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading, refreshSession } = useAuth();
  const location = useLocation();
  
  // Refresh session on mount to ensure we have the latest auth state
  useEffect(() => {
    console.log('AuthLayout mounted, refreshing session');
    refreshSession();
  }, [refreshSession]);
  
  // Show loading state while checking authentication
  if (loading) {
    console.log('AuthLayout loading...');
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user found, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  console.log('User authenticated, rendering outlet');
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
