
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading, refreshSession, isRefreshingSession } = useAuth();
  const location = useLocation();
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  
  // Single-time authentication check on mount
  useEffect(() => {
    // Only perform one check per mount
    if (initialAuthCheckComplete) return;
    
    const checkAuth = async () => {
      try {
        // If already have user, no need to refresh
        if (user) {
          console.log('AuthLayout: user already authenticated, skipping refresh');
          setInitialAuthCheckComplete(true);
          return;
        }
        
        // Only perform refresh if not already in progress
        if (!isRefreshingSession) {
          console.log('AuthLayout: performing initial session check');
          await refreshSession();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setInitialAuthCheckComplete(true);
      }
    };
    
    checkAuth();
  }, [user, refreshSession, isRefreshingSession, initialAuthCheckComplete]);
  
  // Show loading state while checking authentication
  if ((loading || isRefreshingSession) && !initialAuthCheckComplete) {
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // Redirect to login if not authenticated after check is complete
  if (!user && initialAuthCheckComplete) {
    console.log('AuthLayout: no user found, redirecting to auth page');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, render the protected content
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
