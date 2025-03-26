
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import Navbar from '@/components/common/navbar';
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
    return <AuthLoadingState fullPage={true} />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user found, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  console.log('User authenticated, rendering outlet');
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
