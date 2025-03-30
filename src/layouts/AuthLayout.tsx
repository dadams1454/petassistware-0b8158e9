
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { LoadingState } from '@/components/ui/standardized';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Set a timeout to ensure we don't get stuck in loading state
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) {
        setAuthCheckComplete(true);
        console.log('AuthLayout: forcing auth check completion after timeout');
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      mounted = false;
    };
  }, []);
  
  // Mark auth check as complete when loading finishes
  useEffect(() => {
    if (!loading) {
      setAuthCheckComplete(true);
      console.log('AuthLayout: auth check complete, loading state ended');
    }
  }, [loading]);
  
  // Show loading state only if still authenticating and timeout hasn't elapsed
  if (loading && !authCheckComplete) {
    console.log('AuthLayout: showing loading state');
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
