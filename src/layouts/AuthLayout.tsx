
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading, refreshSession } = useAuth();
  const location = useLocation();
  const [initialRefreshDone, setInitialRefreshDone] = useState(false);
  
  // Only refresh session once on mount
  useEffect(() => {
    let mounted = true;
    
    if (!initialRefreshDone) {
      console.log('AuthLayout: performing initial session refresh');
      
      // Add a small delay to prevent conflicts with AuthProvider initialization
      const timer = setTimeout(() => {
        if (mounted) {
          refreshSession()
            .then(() => {
              if (mounted) {
                console.log('AuthLayout: initial session refresh complete');
                setInitialRefreshDone(true);
              }
            })
            .catch(err => {
              console.error('Error refreshing session in AuthLayout:', err);
              if (mounted) setInitialRefreshDone(true);
            });
        }
      }, 300);
      
      return () => {
        clearTimeout(timer);
        mounted = false;
      };
    }
  }, [refreshSession, initialRefreshDone]);
  
  // Handle different states
  if (loading && !initialRefreshDone) {
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
