
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { LoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [initialRefreshDone, setInitialRefreshDone] = useState(false);
  
  // Only check session once on mount
  useEffect(() => {
    let mounted = true;
    
    if (!initialRefreshDone) {
      console.log('AuthLayout: performing initial session check');
      
      // Add a small delay to prevent conflicts with AuthProvider initialization
      const timer = setTimeout(() => {
        if (mounted) {
          console.log('AuthLayout: initial session check complete');
          setInitialRefreshDone(true);
        }
      }, 300);
      
      return () => {
        clearTimeout(timer);
        mounted = false;
      };
    }
  }, [initialRefreshDone]);
  
  // Handle different states
  if (loading && !initialRefreshDone) {
    console.log('AuthLayout: in loading state');
    return <LoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log('AuthLayout: no user found, redirecting to auth page');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, render the protected content
  console.log('AuthLayout: user authenticated, rendering outlet');
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
