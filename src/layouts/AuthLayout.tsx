
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading, refreshSession, isRefreshingSession } = useAuth();
  const location = useLocation();
  const [initialRefreshAttempted, setInitialRefreshAttempted] = useState(false);
  
  // Handle initial session refresh - only do this once
  useEffect(() => {
    if (!initialRefreshAttempted && !isRefreshingSession && !user) {
      console.log('AuthLayout: performing initial session refresh');
      
      refreshSession()
        .then(() => {
          console.log('AuthLayout: initial session refresh complete');
          setInitialRefreshAttempted(true);
        })
        .catch(err => {
          console.error('Error refreshing session in AuthLayout:', err);
          setInitialRefreshAttempted(true);
        });
    } else if (!initialRefreshAttempted && user) {
      // If we already have a user, no need to refresh
      console.log('AuthLayout: user already authenticated, skipping refresh');
      setInitialRefreshAttempted(true);
    }
  }, [refreshSession, initialRefreshAttempted, isRefreshingSession, user]);
  
  // Handle loading state
  if ((loading || isRefreshingSession) && !initialRefreshAttempted) {
    console.log('AuthLayout: in loading state');
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
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
