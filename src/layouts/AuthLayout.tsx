
import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthLoadingState } from '@/components/ui/standardized';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const firstRenderRef = useRef(true);
  
  // Explicitly check if we're on the auth page
  const isAuthPage = location.pathname === '/auth';
  
  // Set a shorter timeout to ensure we don't get stuck in loading state
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) {
        setAuthCheckComplete(true);
        console.log('AuthLayout: forcing auth check completion after timeout');
      }
    }, 100); // Even shorter timeout for quicker response
    
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
  
  // Priority check - if we have a user already, mark auth as complete immediately
  useEffect(() => {
    if (user && firstRenderRef.current) {
      setAuthCheckComplete(true);
      console.log('AuthLayout: user exists on first render, immediately completing auth check');
    }
    firstRenderRef.current = false;
  }, [user]);
  
  // Add detailed logging
  useEffect(() => {
    console.log('AuthLayout state:', { 
      loading, 
      authCheckComplete, 
      userExists: !!user,
      path: location.pathname,
      isAuthPage,
      firstRender: firstRenderRef.current
    });
  }, [loading, authCheckComplete, user, location, isAuthPage]);
  
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
  
  // Admin users get fast-track access to bypass any loading
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
  
  // Show loading state only if still authenticating and timeout hasn't elapsed
  if (loading && !authCheckComplete) {
    console.log('AuthLayout: showing loading state');
    return <AuthLoadingState fullPage={true} message="Verifying authentication..." />;
  }
  
  // For any protected route: redirect to login if not authenticated
  if (!user) {
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
